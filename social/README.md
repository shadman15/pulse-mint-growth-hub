# Social publishing

Claude writes the week's posts into `queue.json`. A GitHub Actions cron runs
`publish.mjs` four times a day and posts whatever is due. No server, no monthly
fee, nothing to keep running on your laptop.

```
node social/publish.mjs --dry-run   # show what would post, send nothing
node social/publish.mjs             # post for real
```

Run it from the Actions tab too: **Publish social queue → Run workflow**. Leave
"dry run" ticked the first time.

## What can and cannot be automated

| Platform | Autonomous posting | What it needs |
| --- | --- | --- |
| Facebook Page | Yes | Meta app in Development mode, you as app admin, a Page token |
| Instagram | Yes, with an image or video | Instagram **Business** account (not Creator), same Meta app |
| LinkedIn personal profile | Yes | `w_member_social` via the Share on LinkedIn product, self-serve |
| LinkedIn company Page | Not yet | Community Management API, reviewed by LinkedIn |
| TikTok | No | Posts from an unaudited app are forced to private. Upload by hand until TikTok audits the app |

Two things worth knowing before you start. Instagram cannot post text on its own
through the API, so every Instagram item needs a `mediaUrl`. And Meta's App
Review only gates *other people's* Pages: while your app sits in Development
mode and you hold a role on it, you can post to your own Page and your own
Instagram account without review.

## Setting up the credentials

Each platform is independent. A platform with no credentials is skipped with a
warning, so start with LinkedIn, get a post out, then add the others.

### LinkedIn (easiest, no review)

1. Create an app at <https://www.linkedin.com/developers/apps>, linked to your
   company Page.
2. Under **Products**, add **Share on LinkedIn** and **Sign In with LinkedIn
   using OpenID Connect**. Both are self-serve.
3. On the **Auth** tab, run the OAuth flow with scopes `openid profile
   w_member_social` and keep the access token.
4. Get your person URN:
   ```
   curl -H "Authorization: Bearer YOUR_TOKEN" https://api.linkedin.com/v2/userinfo
   ```
   The `sub` field is your id. Your URN is `urn:li:person:<sub>`.
5. Check the current API version at
   <https://learn.microsoft.com/en-us/linkedin/marketing/versioning> and set
   `LI_VERSION` if `202506` has aged out.

Tokens last about 60 days, so this needs redoing roughly every two months.

### Facebook Page and Instagram

1. Create an app at <https://developers.facebook.com/apps> of type **Business**.
   Leave it in **Development** mode.
2. Add yourself as an app admin, and make sure you are an admin of the Page.
3. Convert the Instagram account to a **Business** account and link it to the
   Page.
4. In Graph API Explorer, select your app and grant `pages_show_list`,
   `pages_manage_posts`, `pages_read_engagement`, `instagram_basic` and
   `instagram_content_publish`.
5. Get the Page token and the Instagram user id:
   ```
   curl "https://graph.facebook.com/v23.0/me/accounts?access_token=USER_TOKEN"
   curl "https://graph.facebook.com/v23.0/PAGE_ID?fields=instagram_business_account&access_token=PAGE_TOKEN"
   ```
6. Exchange the short-lived token for a long-lived one at
   <https://developers.facebook.com/tools/debug/accesstoken> — click **Extend
   Access Token**. It then lasts about 60 days.

### Put them in GitHub

Repository **Settings → Secrets and variables → Actions → New repository
secret**:

```
FB_PAGE_ID        your Page id
FB_PAGE_TOKEN     the long-lived Page token
IG_USER_ID        the Instagram Business account id
IG_TOKEN          the same Page token works
LI_PERSON_URN     urn:li:person:xxxx
LI_TOKEN          the LinkedIn access token
```

Optional **variables** (not secrets): `GRAPH_VERSION`, `LI_VERSION`.

## Queue format

```json
{
  "items": [
    {
      "id": "2026-11-03-li-1",
      "platform": "linkedin",
      "publishAt": "2026-11-03T08:40:00Z",
      "status": "pending",
      "text": "the post body",
      "mediaUrl": "https://.../image.jpg",
      "mediaType": "image",
      "link": "https://pulsemint.co.uk"
    }
  ]
}
```

- `platform` — `facebook`, `instagram` or `linkedin`
- `publishAt` — UTC. A run posts anything already due, so the cron minute does
  not have to match.
- `mediaType` — `image`, or `video`/`reel` for an Instagram Reel. A Reel needs a
  publicly reachable file; Meta fetches it.
- `link` — Facebook only.
- `status` — `pending` until it posts, then `posted`. Three failures sets
  `failed` so one bad item cannot block the queue, and the reason is written to
  `error`.

Media has to be on a public URL. Putting the files in `public/social/` in this
repo works: Netlify then serves them at
`https://pulsemint.co.uk/social/<name>`.

## Troubleshooting

Run the workflow with dry run ticked; it prints the exact request for every due
item without sending it.

- **`not configured`** — the secret is missing or empty.
- **HTTP 190** — the token expired. Mint a new one.
- **Instagram `status_code: ERROR`** — Meta could not fetch or transcode the
  video. Check the URL is public and the file is H.264 MP4.
- **LinkedIn 426** — `LI_VERSION` is outside the supported window.
- **Nothing posts and nothing errors** — every `publishAt` is still in the
  future, which is what `0 due` means.
