#!/usr/bin/env node
/**
 * Pulsemint social publisher.
 *
 * Reads social/queue.json, publishes every item whose publishAt has passed,
 * and writes the result back into the queue.
 *
 *   node social/publish.mjs --dry-run    # show the exact requests, send nothing
 *   node social/publish.mjs              # publish for real
 *
 * Credentials come from the environment. A platform with no credentials is
 * skipped, not failed, so you can switch one platform on at a time.
 *
 *   FB_PAGE_ID, FB_PAGE_TOKEN      Facebook Page
 *   IG_USER_ID,  IG_TOKEN          Instagram Business account
 *   LI_PERSON_URN, LI_TOKEN        LinkedIn personal profile
 *
 * Optional:
 *   GRAPH_VERSION  default v23.0   Meta Graph API version
 *   LI_VERSION     default 202608  LinkedIn-Version header (YYYYMM)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const QUEUE_PATH = process.env.QUEUE_PATH || join(HERE, 'queue.json');

const DRY_RUN = process.argv.includes('--dry-run');
const GRAPH = `https://graph.facebook.com/${process.env.GRAPH_VERSION || 'v23.0'}`;
const LI_VERSION = process.env.LI_VERSION || '202608';

// Meta allows 100 API publishes per Instagram account per rolling 24h.
// We stay well under it; this is a guard against a runaway queue.
const MAX_PER_RUN = Number(process.env.MAX_PER_RUN || 10);

const log = (...a) => console.log(...a);
const warn = (...a) => console.warn(...a);

/** Send a request, or describe it when dry running. */
async function send(label, url, init = {}) {
  if (DRY_RUN) {
    const redacted = url.replace(/access_token=[^&]+/g, 'access_token=REDACTED');
    log(`    [dry-run] ${init.method || 'GET'} ${redacted}`);
    if (init.body && typeof init.body === 'string') {
      log(`    [dry-run] body: ${init.body.slice(0, 400)}`);
    }
    return { dryRun: true, id: 'dry-run-id' };
  }
  const res = await fetch(url, init);
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const detail = body?.error?.message || body?.message || text.slice(0, 300);
    throw new Error(`${label} failed (HTTP ${res.status}): ${detail}`);
  }
  // LinkedIn returns the new post id in a header, not the body.
  const restliId = res.headers.get('x-restli-id');
  if (restliId && !body.id) body.id = restliId;
  return body;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ Facebook */

const facebook = {
  name: 'facebook',
  ready: () => Boolean(process.env.FB_PAGE_ID && process.env.FB_PAGE_TOKEN),
  missing: 'FB_PAGE_ID and FB_PAGE_TOKEN',

  async publish(item) {
    const pageId = process.env.FB_PAGE_ID;
    const token = process.env.FB_PAGE_TOKEN;

    // A link or photo post uses a different edge from a plain text post.
    if (item.mediaUrl && item.mediaType === 'image') {
      const params = new URLSearchParams({
        url: item.mediaUrl,
        caption: item.text,
        access_token: token,
      });
      const r = await send('facebook photo', `${GRAPH}/${pageId}/photos`, {
        method: 'POST',
        body: params,
      });
      return r.post_id || r.id;
    }

    const params = new URLSearchParams({ message: item.text, access_token: token });
    if (item.link) params.set('link', item.link);
    const r = await send('facebook feed', `${GRAPH}/${pageId}/feed`, {
      method: 'POST',
      body: params,
    });
    return r.id;
  },
};

/* ----------------------------------------------------------------- Instagram */

const instagram = {
  name: 'instagram',
  ready: () => Boolean(process.env.IG_USER_ID && process.env.IG_TOKEN),
  missing: 'IG_USER_ID and IG_TOKEN',

  async publish(item) {
    const igId = process.env.IG_USER_ID;
    const token = process.env.IG_TOKEN;

    if (!item.mediaUrl) {
      throw new Error('instagram needs mediaUrl; the API cannot post text alone');
    }

    // Step 1: create the container.
    const params = new URLSearchParams({ caption: item.text, access_token: token });
    if (item.mediaType === 'video' || item.mediaType === 'reel') {
      params.set('media_type', 'REELS');
      params.set('video_url', item.mediaUrl);
      if (item.coverUrl) params.set('cover_url', item.coverUrl);
      params.set('share_to_feed', 'true');
    } else {
      params.set('image_url', item.mediaUrl);
    }

    const container = await send('instagram container', `${GRAPH}/${igId}/media`, {
      method: 'POST',
      body: params,
    });
    const creationId = container.id;

    // Step 2: video containers are transcoded, so wait for FINISHED.
    if (params.get('media_type') === 'REELS' && !DRY_RUN) {
      let ready = false;
      for (let attempt = 0; attempt < 10; attempt++) {
        await sleep(15000);
        const status = await send(
          'instagram status',
          `${GRAPH}/${creationId}?fields=status_code&access_token=${token}`,
        );
        if (status.status_code === 'FINISHED') {
          ready = true;
          break;
        }
        if (status.status_code === 'ERROR' || status.status_code === 'EXPIRED') {
          throw new Error(`instagram container ${status.status_code}`);
        }
      }
      if (!ready) throw new Error('instagram container still processing after 150s');
    }

    // Step 3: publish.
    const pub = await send('instagram publish', `${GRAPH}/${igId}/media_publish`, {
      method: 'POST',
      body: new URLSearchParams({ creation_id: creationId, access_token: token }),
    });
    return pub.id;
  },
};

/* ------------------------------------------------------------------ LinkedIn */

const linkedin = {
  name: 'linkedin',
  ready: () => Boolean(process.env.LI_PERSON_URN && process.env.LI_TOKEN),
  missing: 'LI_PERSON_URN and LI_TOKEN',

  async publish(item) {
    const author = process.env.LI_PERSON_URN;
    const token = process.env.LI_TOKEN;

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': LI_VERSION,
    };

    const body = {
      author,
      commentary: item.text,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    };

    // An image needs registering, uploading, then referencing by URN.
    if (item.mediaUrl && item.mediaType === 'image') {
      const init = await send(
        'linkedin initializeUpload',
        'https://api.linkedin.com/rest/images?action=initializeUpload',
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ initializeUploadRequest: { owner: author } }),
        },
      );
      const uploadUrl = init?.value?.uploadUrl;
      const imageUrn = init?.value?.image;

      if (!DRY_RUN) {
        const src = await fetch(item.mediaUrl);
        if (!src.ok) throw new Error(`could not fetch ${item.mediaUrl}`);
        const bytes = Buffer.from(await src.arrayBuffer());
        const up = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: bytes,
        });
        if (!up.ok) throw new Error(`linkedin image upload failed (HTTP ${up.status})`);
      }

      body.content = { media: { id: imageUrn || 'urn:li:image:dry-run' } };
    }

    const r = await send('linkedin post', 'https://api.linkedin.com/rest/posts', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return r.id;
  },
};

/* ---------------------------------------------------------------------- main */

const ADAPTERS = { facebook, instagram, linkedin };

async function main() {
  const queue = JSON.parse(await readFile(QUEUE_PATH, 'utf8'));
  const items = Array.isArray(queue) ? queue : queue.items;
  if (!Array.isArray(items)) throw new Error('queue.json must be an array, or {items: []}');

  const now = Date.now();
  const due = items.filter(
    (i) => i.status === 'pending' && new Date(i.publishAt).getTime() <= now,
  );

  log(`${items.length} in queue, ${due.length} due${DRY_RUN ? ' (dry run)' : ''}`);
  if (!due.length) return;

  let published = 0;
  let failed = 0;

  for (const item of due.slice(0, MAX_PER_RUN)) {
    const adapter = ADAPTERS[item.platform];
    if (!adapter) {
      warn(`  ${item.id}: unknown platform "${item.platform}", skipping`);
      continue;
    }
    if (!adapter.ready()) {
      warn(`  ${item.id}: ${item.platform} not configured (set ${adapter.missing}), leaving pending`);
      continue;
    }

    log(`  ${item.id}: ${item.platform} -> "${item.text.slice(0, 60).replace(/\n/g, ' ')}..."`);
    try {
      const remoteId = await adapter.publish(item);
      if (!DRY_RUN) {
        item.status = 'posted';
        item.postedAt = new Date().toISOString();
        item.remoteId = remoteId;
        delete item.error;
      }
      published++;
      log(`    ok${remoteId ? ` (${remoteId})` : ''}`);
    } catch (err) {
      failed++;
      if (!DRY_RUN) {
        item.attempts = (item.attempts || 0) + 1;
        item.error = String(err.message || err);
        // Three strikes, then stop retrying so a bad item cannot block the queue.
        if (item.attempts >= 3) item.status = 'failed';
      }
      warn(`    ${err.message || err}`);
    }
  }

  if (!DRY_RUN) {
    await writeFile(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
  }

  log(`done: ${published} published, ${failed} failed`);
  // A failure must not fail the whole workflow run; the queue records it.
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
