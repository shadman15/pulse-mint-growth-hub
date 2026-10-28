// Netlify Function: starts a voice call with the Pulsemint agent.
// The secret key lives only in Netlify's environment variables (RETELL_API_KEY),
// never in the website code.
//
// Required env vars (Netlify → Site configuration → Environment variables):
//   RETELL_API_KEY   your secret API key
//   AGENT_ID         the agent to call

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const apiKey = process.env.RETELL_API_KEY;
  const agentId = process.env.AGENT_ID;
  if (!apiKey || !agentId) return json(500, { error: 'Voice agent is not configured' });

  // Only allow calls started from this site (blocks casual abuse from other origins).
  const origin = req.headers.get('origin');
  if (origin) {
    const host = new URL(origin).hostname;
    const allowed =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.netlify.app') ||
      (process.env.ALLOWED_HOSTS || '')
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean)
        .some((h) => host === h || host.endsWith('.' + h));
    if (!allowed) return json(403, { error: 'Not allowed' });
  }

  try {
    const res = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId }),
    });
    if (!res.ok) return json(502, { error: 'Could not start the call' });
    const data = await res.json();
    return json(200, { accessToken: data.access_token });
  } catch {
    return json(502, { error: 'Could not start the call' });
  }
};
