#!/usr/bin/env node
/**
 * Checks what the Facebook token in FB_PAGE_TOKEN can actually do, and finds
 * the Page id to put in FB_PAGE_ID.
 *
 *   node social/fb-check.mjs
 *
 * Prints names and ids only. It never prints the token, and it asks Facebook
 * for named fields so no Page token is returned in the reply either.
 */

// GRAPH_BASE exists so the tests can point this at a stand-in server.
const GRAPH = `${process.env.GRAPH_BASE || 'https://graph.facebook.com'}/${process.env.GRAPH_VERSION || 'v23.0'}`;
const TOKEN = process.env.FB_PAGE_TOKEN;
const PAGE_ID = process.env.FB_PAGE_ID;
const IG_USER_ID = process.env.IG_USER_ID;

const notice = (m) => console.log(`::notice::${m}`);
const problem = (m) => console.log(`::warning::${m}`);

async function graph(path, fields) {
  const url = new URL(`${GRAPH}/${path}`);
  if (fields) url.searchParams.set('fields', fields);
  url.searchParams.set('access_token', TOKEN);
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = body?.error || {};
    throw new Error(`HTTP ${res.status} (#${e.code ?? '?'}) ${e.message || 'unknown'}`);
  }
  return body;
}

async function main() {
  if (!TOKEN) {
    problem('FB_PAGE_TOKEN is not set. Add it under Settings > Secrets and variables > Actions.');
    return;
  }
  notice(`FB_PAGE_TOKEN is set (${TOKEN.length} characters). FB_PAGE_ID is currently ${PAGE_ID || 'not set'}.`);

  // 1. What does this token belong to?
  try {
    const me = await graph('me', 'id,name');
    notice(`The token belongs to: ${me.name} (id ${me.id}).`);
    if (PAGE_ID && me.id === PAGE_ID) {
      notice('FB_PAGE_ID matches the token owner, so this looks like a Page token.');
    }
  } catch (err) {
    problem(`Could not read /me: ${err.message}`);
  }

  // 2. Which Pages can it manage? Naming fields keeps Page tokens out of the reply.
  try {
    const accounts = await graph('me/accounts', 'id,name,category,tasks');
    const pages = accounts.data || [];
    if (!pages.length) {
      problem('This token manages no Pages. It is probably a Page token already, or the Page permissions were not granted.');
    }
    for (const p of pages) {
      const canPost = (p.tasks || []).includes('CREATE_CONTENT');
      notice(`Page: "${p.name}" | FB_PAGE_ID = ${p.id} | can post: ${canPost ? 'yes' : 'NO'}${p.category ? ` | ${p.category}` : ''}`);
      try {
        const ig = await graph(p.id, 'instagram_business_account{id,username}');
        const acc = ig.instagram_business_account;
        if (acc) notice(`  Instagram linked to "${p.name}": IG_USER_ID = ${acc.id}${acc.username ? ` (@${acc.username})` : ''}`);
        else notice(`  No Instagram Business account linked to "${p.name}".`);
      } catch (err) {
        notice(`  Could not read the Instagram link for "${p.name}": ${err.message}`);
      }
    }
  } catch (err) {
    problem(`Could not list Pages: ${err.message}`);
  }

  // 3. Is the configured id usable?
  if (PAGE_ID) {
    try {
      const page = await graph(PAGE_ID, 'id,name,category');
      notice(`FB_PAGE_ID ${PAGE_ID} reads as "${page.name}"${page.category ? ` (${page.category})` : ''}.`);
    } catch (err) {
      problem(`FB_PAGE_ID ${PAGE_ID} cannot be read with this token: ${err.message}`);
    }
  }

  if (IG_USER_ID) {
    try {
      const ig = await graph(IG_USER_ID, 'id,username');
      notice(`IG_USER_ID ${IG_USER_ID} reads as @${ig.username}.`);
    } catch (err) {
      problem(`IG_USER_ID ${IG_USER_ID} cannot be read with this token: ${err.message}`);
    }
  }
}

main().catch((err) => {
  problem(`Check failed: ${err.message || err}`);
});
