// Records a conversion event. Cloudflare Pages Function, served at /api/event.
//
// Cloudflare Web Analytics counts page views but cannot tell you whether a
// visitor pressed Test Agent or used the calculator, which is the number that
// actually matters. This fills that gap.
//
// Deliberately stores no cookie, no IP address, no device fingerprint and no
// identifier of any kind, so it needs no consent banner. The cost of that
// choice: these are event counts, not unique people. Three presses from one
// visitor count as three.
//
// Needs a Workers KV namespace bound as EVENTS. Until that exists the endpoint
// still answers 200 and simply records nothing, so the site never breaks
// because analytics are misconfigured.

// Only these names are stored. An open endpoint would otherwise let anyone
// fill the namespace with junk.
const ALLOWED = new Set([
  'test_agent_opened',
  'test_agent_connected',
  'test_agent_failed',
  'calculator_used',
  'book_call_clicked',
  'blog_cta_clicked',
]);

const DAYS_KEPT = 90;
const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Keep only our own pages, and drop anything that looks like a query or id. */
function tidyPath(raw) {
  if (typeof raw !== 'string' || !raw.startsWith('/')) return '/';
  return raw.split(/[?#]/)[0].slice(0, 120) || '/';
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // Same-site only. Without this, anyone could inflate the numbers.
  const origin = request.headers.get('origin');
  if (origin) {
    let host;
    try {
      host = new URL(origin).hostname;
    } catch {
      return json(400, { ok: false, reason: 'bad_origin' });
    }
    const allowed =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.pages.dev') ||
      host === 'pulsemint.co.uk' ||
      host.endsWith('.pulsemint.co.uk');
    if (!allowed) return json(403, { ok: false, reason: 'origin_blocked' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, reason: 'bad_json' });
  }

  const name = String(body?.name || '');
  if (!ALLOWED.has(name)) return json(400, { ok: false, reason: 'unknown_event' });

  // No storage bound yet: accept and discard rather than fail the page.
  if (!env.EVENTS) return json(200, { ok: true, stored: false, reason: 'storage_not_configured' });

  // One key per event rather than a counter. Counters in KV race against
  // themselves when two people act at once and silently lose events.
  const day = new Date().toISOString().slice(0, 10);
  const key = `e:${day}:${name}:${crypto.randomUUID()}`;
  const value = JSON.stringify({ path: tidyPath(body?.path), t: Date.now() });

  try {
    await env.EVENTS.put(key, value, { expirationTtl: DAYS_KEPT * 86400 });
    return json(200, { ok: true, stored: true });
  } catch (err) {
    console.error('event write failed:', String(err).slice(0, 200));
    return json(200, { ok: true, stored: false, reason: 'write_failed' });
  }
}

// A GET here is almost always someone poking at the URL.
export const onRequestGet = () => json(405, { ok: false, reason: 'use_post' });
