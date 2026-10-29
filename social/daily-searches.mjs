#!/usr/bin/env node
/**
 * Sends the morning search links to your phone through ntfy.
 *
 * Facebook and LinkedIn do not let tools search other people's posts, so
 * this does the next best thing: one notification per three searches, each
 * a button that opens that search in your own app, newest posts first.
 *
 *   node social/daily-searches.mjs --dry-run   # print the links, send nothing
 *   node social/daily-searches.mjs             # send them (needs NTFY_TOPIC)
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = process.env.DAILY_CONFIG || join(HERE, 'daily-searches.json');
const NTFY_URL = process.env.NTFY_URL || 'https://ntfy.sh';
const DRY_RUN = process.argv.includes('--dry-run');

// Facebook's own "Recent posts" filter, so results open newest first.
const FB_RECENT = Buffer.from(
  JSON.stringify({ 'recent_posts:0': JSON.stringify({ name: 'recent_posts', args: '' }) }),
).toString('base64');

export function buildLinks(config) {
  const links = [];
  for (const q of config.facebook || []) {
    links.push({
      label: `FB: ${q}`,
      url: `https://www.facebook.com/search/posts/?q=${encodeURIComponent(q)}&filters=${encodeURIComponent(FB_RECENT)}`,
    });
  }
  for (const g of config.facebookGroups || []) {
    const id = String(g).replace(/^https?:\/\/(www\.|m\.)?facebook\.com\/groups\//, '').replace(/\/.*$/, '');
    for (const q of config.facebookGroupQueries || []) {
      links.push({
        label: `Group ${id}: ${q}`,
        url: `https://www.facebook.com/groups/${encodeURIComponent(id)}/search/?q=${encodeURIComponent(q)}`,
      });
    }
  }
  for (const q of config.linkedin || []) {
    links.push({
      label: 'LinkedIn: latest posts',
      url: `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(q)}&sortBy=${encodeURIComponent('"date_posted"')}`,
    });
  }
  return links;
}

async function main() {
  const config = JSON.parse(await readFile(CONFIG_PATH, 'utf8'));
  const links = buildLinks(config);

  // ntfy allows three buttons per notification.
  const batches = [];
  for (let i = 0; i < links.length; i += 3) batches.push(links.slice(i, i + 3));

  if (DRY_RUN) {
    for (const l of links) console.log(`${l.label}\n  ${l.url}`);
    console.log(`${links.length} links in ${batches.length} notifications (dry run)`);
    return;
  }
  if (!process.env.NTFY_TOPIC) {
    console.log('NTFY_TOPIC is not set, nothing sent');
    return;
  }

  for (const [i, batch] of batches.entries()) {
    const res = await fetch(NTFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: process.env.NTFY_TOPIC,
        title: `Morning search ${i + 1}/${batches.length}`,
        message: batch.map((l) => `• ${l.label.replace(/^(FB|LinkedIn): /, '')}`).join('\n') +
          '\n\nTap a button. Look for owners asking, reply helpfully, no pitch.',
        click: batch[0].url,
        tags: ['mag'],
        priority: 3,
        actions: batch.map((l) => ({ action: 'view', label: l.label.slice(0, 40), url: l.url })),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`ntfy HTTP ${res.status}`);
  }
  console.log(`sent ${links.length} links in ${batches.length} notifications`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
