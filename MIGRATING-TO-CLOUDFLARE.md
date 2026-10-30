# Moving the site to Cloudflare Pages

Netlify's free plan gives 300 credits a month and a production deploy costs
15, so you get 20 deploys a month. Cloudflare Pages gives 500 builds a month
and unlimited bandwidth on its free plan.

The code already runs on both. Nothing here touches Netlify, so the live site
keeps working the whole way through and you can stop at any point.

## What is already done

- The call logic lives in `shared/retell-call.mjs`, used by both hosts, so
  they cannot drift apart.
- `functions/api/create-web-call.js` is the Cloudflare handler.
- `netlify/functions/create-web-call.mjs` is the Netlify handler.
- The site calls `/api/create-web-call`, which works on either host.
- `public/_redirects` carries the single-page-app rule for Cloudflare.

## Step 1: create the project (5 minutes)

1. Sign in at <https://dash.cloudflare.com> and go to **Workers & Pages**.
2. **Create** then **Pages** then **Connect to Git**, and choose
   `shadman15/pulse-mint-growth-hub`.
3. Build settings:
   - Framework preset: **None** (or Vite, which sets the same values)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: leave blank
4. Add the environment variables, for **Production and Preview**:

   | Name | Value |
   | --- | --- |
   | `RETELL_API_KEY` | your Retell key, click **Encrypt** |
   | `AGENT_ID` | your agent id |
   | `ALLOWED_HOSTS` | `pulsemint.co.uk` |
   | `NODE_VERSION` | `22` |

5. Deploy. You get an address like `pulse-mint-growth-hub.pages.dev`.

Mint a **new** Retell key for this and retire the old one, since the old key
has been pasted into chat.

## Step 2: test before touching the domain

On the `pages.dev` address, check:

- The homepage loads and the animation runs.
- `/blog/` lists all five posts.
- Open one post: the diagram shows and the page is styled.
- `/sitemap.xml` and `/favicon.ico` load.
- **Press "Test Agent Now" and have a real conversation.** This is the one
  that matters. If the call fails, open the deployment's function logs and
  look at the `reason` field:
  - `not_configured` means an environment variable is missing or misspelt.
  - `origin_blocked` means `ALLOWED_HOSTS` is wrong. `.pages.dev` is allowed
    automatically, so this should not appear during testing.
  - `upstream_401` means the Retell key is wrong.

Do not continue until the call works.

## Step 3: point the domain across

Your DNS is currently at Netlify. Two ways round:

**Option A, move DNS to Cloudflare (recommended).** In Cloudflare, add the
site `pulsemint.co.uk`, let it import the existing records, then change the
nameservers at your registrar to the two Cloudflare gives you. **Before you
switch, check the imported records include your email records** (MX, SPF,
DKIM) or email to `info@pulsemint.co.uk` will stop. Then in Pages, add the
custom domain.

**Option B, keep DNS at Netlify.** In Pages add the custom domain, and
Cloudflare gives you a CNAME to add in Netlify's DNS panel. Fewer moving
parts, and your email records stay untouched.

Nameserver changes can take a few hours to spread.

## Step 4: afterwards

- Check <https://pulsemint.co.uk> and the Test Agent button once more.
- In Google Search Console, confirm the property still verifies. Verification
  is on the meta tag in `index.html`, which moves with the site, so it should
  be unaffected.
- Leave the Netlify site in place for a week as a fallback. Delete it later.

## Does this hurt the search rankings?

No, as long as the domain and the URLs stay the same, which they do. Search
engines do not care which company serves the pages. What hurts is changing
domain or changing URL structure, and neither is happening.

## Rolling back

Point the domain back at Netlify. The Netlify function and its configuration
are untouched, so it works immediately. The only cost is DNS propagation.
