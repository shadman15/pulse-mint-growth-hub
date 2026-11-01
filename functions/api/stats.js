// Reads back the recorded events. Cloudflare Pages Function at /api/stats.
//
// Returns totals by event, by day, and by the page the visitor was on, so you
// can see which article actually produces demos rather than only which one
// gets read.
//
// Counts are not secret, but they are nobody else's business either, so this
// is unlisted rather than protected. Put Cloudflare Access in front of
// /stats if that stops being good enough.

const json = (status, body, cache = 'no-store') =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': cache },
  });

const dayKey = (d) => d.toISOString().slice(0, 10);

export async function onRequestGet(context) {
  const { request, env } = context;
  const days = Math.min(Math.max(Number(new URL(request.url).searchParams.get('days')) || 30, 1), 90);

  if (!env.EVENTS) {
    return json(200, {
      configured: false,
      message: 'No KV namespace is bound as EVENTS, so nothing is being recorded yet.',
      days, totals: {}, byDay: {}, byPath: {}, total: 0,
    });
  }

  // Build the window first so quiet days still show as zero rather than
  // vanishing from the chart.
  const wanted = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    wanted.push(dayKey(d));
  }
  const inWindow = new Set(wanted);

  const totals = {};
  const byDay = Object.fromEntries(wanted.map((d) => [d, {}]));
  const byPath = {};
  let total = 0;
  let truncated = false;

  // One list call per day keeps each page small and lets us stop early.
  for (const day of wanted) {
    let cursor;
    let guard = 0;
    do {
      const res = await env.EVENTS.list({ prefix: `e:${day}:`, limit: 1000, cursor });
      for (const k of res.keys) {
        // e:<day>:<name>:<uuid>
        const parts = k.name.split(':');
        const name = parts[2];
        if (!name || !inWindow.has(day)) continue;
        totals[name] = (totals[name] || 0) + 1;
        byDay[day][name] = (byDay[day][name] || 0) + 1;
        total++;
      }
      cursor = res.list_complete ? undefined : res.cursor;
      if (++guard >= 5) { truncated = true; break; }
    } while (cursor);
  }

  // Which page drove the action. Only read values for a recent slice, because
  // each value is a separate read and the free tier has a daily budget.
  try {
    const recent = await env.EVENTS.list({ prefix: `e:${wanted[wanted.length - 1]}:`, limit: 200 });
    for (const k of recent.keys) {
      const v = await env.EVENTS.get(k.name, { type: 'json' });
      const p = v?.path || '/';
      byPath[p] = (byPath[p] || 0) + 1;
    }
  } catch {
    /* paths are a nice-to-have; totals still stand without them */
  }

  return json(200, { configured: true, days, total, totals, byDay, byPath, truncated });
}
