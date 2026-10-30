// Netlify Function, served at /.netlify/functions/create-web-call and also
// at /api/create-web-call via the rewrite in netlify.toml.
// The implementation is shared with the Cloudflare Pages Function so the two
// hosts cannot drift apart. Set RETELL_API_KEY, AGENT_ID and ALLOWED_HOSTS
// under Netlify > Site configuration > Environment variables.
import { createWebCall } from '../../shared/retell-call.mjs';

export default async (req) => createWebCall(req, process.env);
