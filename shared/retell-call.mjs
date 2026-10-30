// Starts a voice call with the Pulsemint agent.
//
// This holds the whole implementation so that Netlify and Cloudflare run
// byte-for-byte the same logic. Each host has a thin wrapper that passes in
// its own request object and environment:
//
//   netlify/functions/create-web-call.mjs   process.env
//   functions/api/create-web-call.js        context.env
//
// The secret key only ever lives in the host's environment variables, never
// in the website code and never in a log line.
//
// Required environment variables:
//   RETELL_API_KEY   your secret API key
//   AGENT_ID         the agent to call
// Optional:
//   ALLOWED_HOSTS    comma separated hostnames allowed to start a call

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const fail = (status, reason, detail, hint) => {
  // Appears in the host's function logs. Never includes the API key.
  console.error('create-web-call failed:', reason, detail ?? '');
  return json(status, { error: 'Could not start the call', reason, hint });
};

/** True when a call may be started from this origin. */
export function originAllowed(origin, allowedHosts = '') {
  if (!origin) return true; // same-origin requests may omit it
  let host;
  try {
    host = new URL(origin).hostname;
  } catch {
    return false;
  }
  if (host === 'localhost' || host === '127.0.0.1') return true;
  // Deploy previews on either host.
  if (host.endsWith('.netlify.app') || host.endsWith('.pages.dev')) return true;
  return allowedHosts
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
    .some((h) => host === h || host.endsWith('.' + h));
}

export async function createWebCall(request, env) {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const apiKey = env.RETELL_API_KEY;
  const agentId = env.AGENT_ID;
  if (!apiKey || !agentId) {
    return fail(500, 'not_configured', {
      hasKey: Boolean(apiKey),
      hasAgentId: Boolean(agentId),
    });
  }

  const origin = request.headers.get('origin');
  if (!originAllowed(origin, env.ALLOWED_HOSTS || '')) {
    return fail(403, 'origin_blocked', origin);
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
}
