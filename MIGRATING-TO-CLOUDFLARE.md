# Moving to Cloudflare Pages, step by step

Netlify's free plan allows 20 production deploys a month and all 20 are used
until 25 November. Cloudflare Pages allows 500 builds a month and unlimited
bandwidth, free.

Your live site keeps working throughout. Nothing here switches off Netlify
until the very last step, and you can stop at any point.

---

## First, how deploying works from now on

You do not deploy anything by hand. The flow is:

1. Claude changes the code and pushes it to GitHub.
2. Cloudflare notices the push within a few seconds.
3. Cloudflare runs the build and publishes it, usually in one to two minutes.

That is the whole process. The only time you touch Cloudflare is the setup
below, and afterwards if you want to check a build or change a setting.

You can watch builds at **Workers & Pages > your project > Deployments**.

---

## Part 1: Create the project (about 10 minutes)

### Step 1. Create the account

Sign up at <https://dash.cloudflare.com/sign-up>. The free plan is enough.

### Step 2. Connect the repository

1. In the left menu choose **Workers & Pages**.
2. **Create** > **Pages** tab > **Connect to Git**.
3. Authorise GitHub and pick `shadman15/pulse-mint-growth-hub`.
4. Production branch: **main**.

### Step 3. Build settings

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | leave empty |

### Step 4. Environment variables

Still on the setup screen, open **Environment variables** and add these four.
Add them for **Production**, and again for **Preview** if it asks separately.

| Name | Value | Notes |
| --- | --- | --- |
| `RETELL_API_KEY` | your Retell key | click **Encrypt** |
| `AGENT_ID` | your agent id | |
| `ALLOWED_HOSTS` | `pulsemint.co.uk` | no `https://`, no slash |
| `NODE_VERSION` | `22` | |

Make a **new** Retell key for this rather than reusing the old one, and
delete the old key in Retell afterwards.

### Step 5. Deploy

Press **Save and Deploy**. After a minute or two you get an address like
`pulse-mint-growth-hub.pages.dev`.

---

## Part 2: Test before touching your domain

Open the `pages.dev` address and check each of these:

- [ ] Homepage loads, the PULSE / MINT animation runs
- [ ] `/blog/` lists all five posts
- [ ] Open a post: the diagram appears and the page is styled
- [ ] The missed call calculator works
- [ ] `/sitemap.xml` and `/favicon.ico` load
- [ ] **Press "Test Agent Now" and hold a real conversation**

The last one is the one that matters. If the call fails, go to
**Deployments > the latest one > Functions** and read the `reason`:

| Reason | Meaning |
| --- | --- |
| `not_configured` | An environment variable is missing or misspelt |
| `upstream_401` | The Retell key is wrong |
| `upstream_400` | Retell rejected the request, read the hint |
| `origin_blocked` | Should not happen on `pages.dev`, which is allowed automatically |

**Do not continue until the call works.**

---

## Part 3: Move the domain and fix email

Your domain is registered at Namecheap, your mailbox is Namecheap, and your
DNS currently sits at Netlify. After this, DNS lives at Cloudflare.

**The order matters.** Add every record in Cloudflare *before* switching the
nameservers, or email and the website will drop out during the gap.

### Step 6. Add the domain to Cloudflare

1. Cloudflare dashboard > **Add a domain** > `pulsemint.co.uk`.
2. Choose the **Free** plan.
3. Cloudflare scans your current DNS and imports what it finds.

### Step 7. Check the records, and add the email ones

Go to **DNS > Records** and compare against your Namecheap mail settings.

Namecheap Private Email normally needs these. **Confirm the exact values in
your Namecheap account** before entering them, because they differ between
Namecheap's Private Email and its free forwarding:

| Type | Name | Value | Priority | Proxy |
| --- | --- | --- | --- | --- |
| MX | `@` | `mx1.privateemail.com` | 10 | n/a |
| MX | `@` | `mx2.privateemail.com` | 10 | n/a |
| TXT | `@` | `v=spf1 include:spf.privateemail.com ~all` | | n/a |

If Namecheap also gives you a DKIM record, add that too. It is a TXT record
with a name like `default._domainkey`.

**Important:** any record that is mail related, or any record that is not the
website itself, must have the orange cloud switched **off** (DNS only).
Proxying mail records breaks email. Only the website records should be
proxied, and Cloudflare sets those up for you in the next step.

### Step 8. Switch the nameservers at Namecheap

Cloudflare shows you two nameservers, something like `xxx.ns.cloudflare.com`.

1. Log in to Namecheap > **Domain List** > **Manage** next to pulsemint.co.uk.
2. **Nameservers** > choose **Custom DNS**.
3. Replace what is there with Cloudflare's two. Save.

This can take a few hours to take effect, occasionally up to a day.

### Step 9. Point the domain at the site

Back in **Workers & Pages > your project > Custom domains**:

1. **Set up a domain** > enter `pulsemint.co.uk` > follow the prompt.
2. Repeat for `www.pulsemint.co.uk` if you want that to work too.

Cloudflare adds the DNS records for this itself.

---

## Part 4: Afterwards

- [ ] <https://pulsemint.co.uk> loads over https
- [ ] Test Agent Now still works **on the real domain**
- [ ] Send an email to `info@pulsemint.co.uk` from your phone and confirm it
      arrives in Namecheap webmail
- [ ] Send one *from* info@ to your Gmail, to check sending still works
- [ ] Google Search Console still verifies. The verification is a meta tag
      inside the site, so it travels with it
- [ ] Resubmit `sitemap.xml` in Search Console if it shows an error

Leave the Netlify site alone for a week in case you want to go back. Delete
it after that.

---

## Does this affect the search rankings?

No. The domain and every URL stay exactly the same. Search engines do not
care which company serves the files. What harms rankings is changing domain
or changing URL structure, and neither is happening.

## Rolling back

Change the nameservers at Namecheap back to Netlify's. The Netlify site and
its settings are untouched, so it starts serving again as soon as DNS
spreads. Remember to put the MX records back wherever DNS ends up.
