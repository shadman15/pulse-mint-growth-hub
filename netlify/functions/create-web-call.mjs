// Netlify Function: starts a voice call with the Pulsemint agent.
// The secret key lives only in Netlify's environment variables (RETELL_API_KEY),
// never in the website code.
//
// Required env vars (Netlify → Site configuration → Environment variables):
//   RETELL_API_KEY   your secret API key
//   AGENT_ID         the agent to call

const fail = (status, reason, detail, hint) => {
  // Shows up in Netlify → Logs → Functions. Never includes the API key.
  console.error('create-web-call failed:', reason, detail ?? '');
  return json(status, { error: 'Could not start the call', reason, hint });
};

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const apiKey = process.env.RETELL_API_KEY;
  const agentId = process.env.AGENT_ID;
  if (!apiKey || !agentId) {
    return fail(500, 'not_configured', {
      hasKey: Boolean(apiKey),
      hasAgentId: Boolean(agentId),
    });
  }

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
    if (!allowed) return fail(403, 'origin_blocked', host);
  }

  try {
    const res = await fetch('https://api.retellai.com/v3/create-web-call', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId }),
    });
    if (!res.ok) {
      const text = (await res.text()).slice(0, 300);
      let hint;
      try {
        const msg = JSON.parse(text);
        hint = String(msg.message || msg.error_message || msg.error || '').slice(0, 160);
      } catch {
        hint = undefined;
      }
      return fail(502, `upstream_${res.status}`, text, hint);
    }
    const data = await res.json();
    return json(200, {
      accessToken: data.access_token,
      callId: data.call_id,
      transport: data.transport,
      iceServers: data.ice_servers,
    });
  } catch (e) {
    return fail(502, 'network', String(e));
  }
};
