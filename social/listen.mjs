#!/usr/bin/env node
/**
 * Pulsemint lead listener.
 *
 * Checks Reddit, trade forums and Google Alerts feeds for recent posts from
 * people who miss calls or want an answering service, scores each post, and
 * pushes the good ones to your phone through ntfy.
 *
 *   node social/listen.mjs --dry-run          # print matches, send nothing, remember nothing
 *   node social/listen.mjs                    # push new matches
 *   node social/listen.mjs --report out.md    # also write a source-health report
 *
 * Environment:
 *   NTFY_TOPIC            the private ntfy topic your phone subscribes to
 *   REDDIT_CLIENT_ID      optional, Reddit app credentials, used if Reddit
 *   REDDIT_CLIENT_SECRET  blocks unauthenticated feed requests
 *   LISTEN_SEEN           where to remember posts already sent (default .listen-state/seen.json)
 *   LISTEN_CONFIG         config path (default social/listen.config.json)
 *
 * Nothing is remembered as seen unless it was actually delivered, so a run
 * without NTFY_TOPIC loses nothing: the posts are sent once the topic is set.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = process.env.LISTEN_CONFIG || join(HERE, 'listen.config.json');
const SEEN_PATH = process.env.LISTEN_SEEN || join(process.cwd(), '.listen-state', 'seen.json');
const NTFY_URL = process.env.NTFY_URL || 'https://ntfy.sh';
const REDDIT_WWW = process.env.REDDIT_WWW || 'https://www.reddit.com';
const REDDIT_OAUTH = process.env.REDDIT_OAUTH || 'https://oauth.reddit.com';
const USER_AGENT = 'web:pulsemint-lead-listener:1.0 (contact info@pulsemint.co.uk)';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const reportIdx = args.indexOf('--report');
const REPORT_PATH = reportIdx >= 0 ? args[reportIdx + 1] : null;

const log = (...a) => console.log(...a);
const DAY = 86_400_000;

/* ------------------------------------------------------------- text helpers */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };

function decode(s = '') {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z0-9#]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

function stripHtml(s = '') {
  // Feeds often HTML-escape their HTML, so decode first, then strip tags.
  return decode(decode(s))
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1] : '';
}

/** Google Alerts wraps every link in a google.com/url redirect. */
function unwrapLink(href) {
  try {
    const u = new URL(href);
    if (/(^|\.)google\.[a-z.]+$/.test(u.hostname) && u.pathname === '/url') {
      return u.searchParams.get('url') || u.searchParams.get('q') || href;
    }
  } catch {}
  return href;
}

/** Parse RSS 2.0 or Atom into {title, url, text, publishedAt}. */
export function parseFeed(xml) {
  const out = [];
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  for (const b of blocks) {
    const title = stripHtml(tag(b, 'title'));
    let url = decode(tag(b, 'link')).trim();
    if (!url) {
      const href = b.match(/<link[^>]*?href="([^"]+)"/i);
      url = href ? decode(href[1]) : '';
    }
    url = unwrapLink(url);
    const body =
      tag(b, 'content:encoded') || tag(b, 'content') || tag(b, 'description') || tag(b, 'summary');
    const date = tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date');
    const author = stripHtml(tag(b, 'dc:creator') || tag(tag(b, 'author'), 'name') || tag(b, 'author'));
    if (!url) continue;
    out.push({ title, url, text: stripHtml(body), publishedAt: date ? new Date(decode(date).trim()) : null, author });
  }
  return out;
}

/* ------------------------------------------------------------------ scoring */

function termRegex(term) {
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = /^\w/.test(term) ? '\\b' : '';
  const end = term.length <= 4 && /\w$/.test(term) ? '\\b' : '';
  return new RegExp(`${start}${esc}${end}`, 'i');
}

export function makeScorer(scoring) {
  const lists = Object.fromEntries(
    Object.entries(scoring).map(([k, terms]) => [k, terms.map((t) => [t, termRegex(t)])]),
  );
  // "missed call" and "missed calls" are one signal, not two: drop any hit
  // that is part of a longer hit in the same list.
  const hits = (k, text) => {
    const found = lists[k].filter(([, re]) => re.test(text)).map(([t]) => t);
    return found.filter((t) => !found.some((o) => o !== t && o.includes(t)));
  };
  return (post) => {
    const text = `${post.title}\n${post.text}`.replace(/[’‘]/g, "'");
    const h = {
      strong: hits('strong', text),
      weak: hits('weak', text),
      intent: hits('intent', text),
      business: hits('business', text),
      vendor: hits('vendor', text),
    };
    const cap = (n, c) => Math.min(n, c);
    // One strong phrase is worth 3, a second distinct one adds 1. Reaching the
    // threshold of 4 always needs some sign of a business or a question.
    const score =
      (h.strong.length ? 3 + (h.strong.length > 1 ? 1 : 0) : 0) +
      cap(h.weak.length, 2) +
      cap(h.intent.length, 2) +
      cap(h.business.length, 2) -
      5 * h.vendor.length;
    // A post with only a passing word like "voicemail" must clear a higher bar.
    const relevant = h.strong.length > 0 || h.weak.length > 0;
    const bonusNeeded = h.strong.length ? 0 : 2;
    return { score, relevant, bonusNeeded, hits: h };
  };
}

/* ------------------------------------------------------------------ sources */

async function fetchText(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, application/json;q=0.9, */*;q=0.5', ...(init.headers || {}) },
    signal: AbortSignal.timeout(20_000),
  });
  const body = await res.text();
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return body;
}

let redditToken; // cached for the run
async function getRedditToken() {
  if (redditToken !== undefined) return redditToken;
  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) return (redditToken = null);
  const res = await fetch(`${REDDIT_WWW}/api/v1/access_token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(20_000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) throw new Error(`reddit token failed (HTTP ${res.status})`);
  return (redditToken = body.access_token);
}

async function readReddit(src) {
  const all = src.subreddits.length === 1 && src.subreddits[0] === 'all';
  const path = all ? '' : `/r/${src.subreddits.join('+')}`;
  const params = new URLSearchParams({ q: src.query, sort: 'new', t: 'week', limit: '50' });
  if (!all) params.set('restrict_sr', '1');

  const token = await getRedditToken();
  if (token) {
    params.set('raw_json', '1');
    const json = JSON.parse(
      await fetchText(`${REDDIT_OAUTH}${path}/search?${params}`, { headers: { Authorization: `Bearer ${token}` } }),
    );
    return (json?.data?.children || []).map(({ data: d }) => ({
      title: d.title || '',
      url: `https://www.reddit.com${d.permalink}`,
      text: d.selftext || '',
      publishedAt: new Date(d.created_utc * 1000),
      author: d.author,
      where: `r/${d.subreddit}`,
    }));
  }
  const xml = await fetchText(`${REDDIT_WWW}${path}/search.rss?${params}`);
  return parseFeed(xml).map((p) => {
    const m = p.url.match(/reddit\.com\/r\/([^/]+)/i);
    return { ...p, where: m ? `r/${m[1]}` : 'Reddit' };
  });
}

async function readRss(src) {
  return parseFeed(await fetchText(src.url)).map((p) => ({ ...p, where: src.name }));
}

const READERS = { reddit: readReddit, rss: readRss };

/* -------------------------------------------------------------------- state */

async function loadSeen() {
  try {
    return JSON.parse(await readFile(SEEN_PATH, 'utf8'));
  } catch {
    return {};
  }
}

async function saveSeen(seen) {
  const cutoff = Date.now() - 45 * DAY;
  for (const [k, t] of Object.entries(seen)) if (t < cutoff) delete seen[k];
  await mkdir(dirname(SEEN_PATH), { recursive: true });
  await writeFile(SEEN_PATH, JSON.stringify(seen));
}

const keyFor = (url) => url.replace(/[?#].*$/, '').replace(/\/+$/, '').toLowerCase();

/* ------------------------------------------------------------------- notify */

function ago(date) {
  const h = Math.round((Date.now() - date.getTime()) / 3_600_000);
  return h < 1 ? 'just now' : h < 48 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
}

async function push(lead) {
  const snippet = lead.text.length > 280 ? `${lead.text.slice(0, 277)}...` : lead.text;
  const why = [...lead.hits.strong, ...lead.hits.weak].slice(0, 3).join(', ');
  const body = {
    topic: process.env.NTFY_TOPIC,
    title: `Lead: ${lead.where}`.slice(0, 120),
    message: `${lead.title}\n\n${snippet}\n\n${ago(lead.publishedAt)} · matched: ${why} · score ${lead.score}`,
    click: lead.url,
    tags: ['telephone_receiver'],
    priority: lead.score >= 8 ? 4 : 3,
    actions: [{ action: 'view', label: 'Open post', url: lead.url }],
  };
  const res = await fetch(NTFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`ntfy HTTP ${res.status}`);
}

/* --------------------------------------------------------------------- main */

async function main() {
  const config = JSON.parse(await readFile(CONFIG_PATH, 'utf8'));
  const score = makeScorer(config.scoring);
  const maxAge = (config.maxAgeDays || 7) * DAY;
  const minScore = config.minScore ?? 4;
  const maxPush = config.maxPushPerRun ?? 8;
  const seen = await loadSeen();

  const health = [];
  const leads = new Map();

  let redditCalls = 0;
  for (const src of config.sources) {
    if (!src.enabled || (src.type === 'rss' && !src.url)) continue;
    // Reddit rate-limits back-to-back requests (HTTP 429), so space them out.
    if (src.type === 'reddit' && redditCalls++ > 0) {
      await new Promise((r) => setTimeout(r, Number(process.env.REDDIT_GAP_MS ?? 4000)));
    }
    const row = { name: src.name, ok: false, items: 0, fresh: 0, matches: 0, error: '' };
    health.push(row);
    try {
      const posts = await READERS[src.type](src);
      row.ok = true;
      row.items = posts.length;
      for (const p of posts) {
        if (!p.publishedAt || Number.isNaN(p.publishedAt.getTime())) continue;
        if (Date.now() - p.publishedAt.getTime() > maxAge) continue;
        row.fresh++;
        const s = score(p);
        if (!s.relevant || s.score < minScore + s.bonusNeeded) continue;
        row.matches++;
        const key = keyFor(p.url);
        if (!leads.has(key)) leads.set(key, { ...p, key, score: s.score, hits: s.hits });
      }
    } catch (err) {
      row.error = err.status ? `HTTP ${err.status}` : String(err.message || err).slice(0, 120);
    }
  }

  const all = [...leads.values()].sort((a, b) => b.score - a.score || b.publishedAt - a.publishedAt);
  const fresh = all.filter((l) => !seen[l.key]);

  for (const r of health) {
    log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.name}: ${r.ok ? `${r.items} posts, ${r.fresh} this week, ${r.matches} matched` : r.error}`);
  }
  log(`${all.length} matching posts this week, ${fresh.length} not sent before`);

  let sent = 0;
  if (DRY_RUN) {
    for (const l of fresh) log(`  [${l.score}] ${l.where} · ${l.title}\n        ${l.url}`);
  } else if (!process.env.NTFY_TOPIC) {
    if (fresh.length) log('NTFY_TOPIC is not set, so nothing was sent. These will be sent once it is.');
  } else {
    for (const l of fresh.slice(0, maxPush)) {
      try {
        await push(l);
        seen[l.key] = Date.now();
        sent++;
      } catch (err) {
        log(`  push failed for ${l.url}: ${err.message || err}`);
      }
    }
    if (fresh.length > maxPush) log(`${fresh.length - maxPush} more will follow on the next run`);
    await saveSeen(seen);
  }
  log(`sent ${sent}`);

  if (REPORT_PATH) {
    const lines = [
      `Run at ${new Date().toISOString()}. Sources checked: ${health.length}. Matching posts from the last ${config.maxAgeDays || 7} days: ${all.length}. Sent this run: ${sent}.`,
      '',
      '| Source | Status | Posts read | This week | Matched |',
      '| --- | --- | --- | --- | --- |',
      ...health.map((r) => `| ${r.name} | ${r.ok ? 'ok' : `failed: ${r.error}`} | ${r.items} | ${r.fresh} | ${r.matches} |`),
      '',
      all.length ? '### Matches' : '_No matches this week._',
      ...all.map((l) => `- **${l.score}** · ${l.where} · ${ago(l.publishedAt)} · [${l.title.replace(/[[\]]/g, '')}](${l.url})  \n  matched: ${[...l.hits.strong, ...l.hits.weak, ...l.hits.intent].slice(0, 5).join(', ')}`),
    ];
    await writeFile(REPORT_PATH, `${lines.join('\n')}\n`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
