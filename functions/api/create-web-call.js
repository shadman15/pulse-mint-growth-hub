// Cloudflare Pages Function, served at /api/create-web-call.
// The implementation is shared with the Netlify function so the two hosts
// cannot drift apart. Set RETELL_API_KEY, AGENT_ID and ALLOWED_HOSTS under
// Cloudflare Pages > Settings > Environment variables (encrypt the key).
import { createWebCall } from '../../shared/retell-call.mjs';

export const onRequest = (context) => createWebCall(context.request, context.env);
