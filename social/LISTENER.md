# Lead listener

Every 10 minutes GitHub runs `listen.mjs`. It reads Reddit, a set of trade
forums and any Google Alerts you add, keeps posts from the last 7 days that
talk about missed calls or wanting an answering service, and sends each new
one to your phone as a notification. Tap it and the post opens.

Free: GitHub runs it, ntfy delivers it. Nothing to keep running.

## Switch it on (5 minutes)

1. Install the **ntfy** app (Android or iPhone).
2. In the app, tap **+** and subscribe to a topic name that nobody could
   guess, for example `pulsemint-leads-` followed by 16 random letters and
   numbers. Anyone who knows the name can read it, so keep it private.
3. In GitHub: **Settings → Secrets and variables → Actions → New repository
   secret**. Name `NTFY_TOPIC`, value the exact topic name.

Leads found before you set the topic are not lost. They are sent on the first
run after it is set.

## What it can and cannot watch

| Source | Watched | Notes |
| --- | --- | --- |
| Reddit | Yes | Trade and small-business subreddits for broad terms, all of Reddit for "answering service"-type phrases |
| Trade forums | Yes | Mike Holt, Screwfix Community, Electricians Forums, PlumbingZone, ContractorTalk, ElectricianTalk, LawnSite. Edit `listen.config.json` to add any forum with an RSS feed |
| Google Alerts | Yes, once you add them | Picks up blogs, forums and some Quora pages |
| Facebook groups | No | No API for groups. Turn on notifications in the groups you join |
| Quora, Nextdoor | No direct feed | Google Alerts catches some Quora pages |
| X (Twitter) | No | The search API is paid |

## Add Google Alerts

At <https://www.google.com/alerts> create an alert, open **Show options**, set
**Deliver to: RSS feed**, then copy the feed link from the RSS icon. Good
queries:

```
"answering service" (plumber OR electrician OR roofer OR builder OR tradesman)
"missed calls" ("small business" OR tradesman OR contractor)
"virtual receptionist" recommend
```

Paste each link into one of the `Google Alert` entries in
`listen.config.json` and set `"enabled": true`.

## If Reddit shows "failed: HTTP 403"

Reddit sometimes blocks requests from GitHub's servers. Create a Reddit app
at <https://www.reddit.com/prefs/apps> (type **script**), then add
`REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` as secrets. The listener uses
them automatically. Reddit may ask you to apply for API access first.

## Checking it works

**Actions → Listen for leads → Run workflow**, tick **report**. The run opens
an issue listing every source, whether it worked, and what matched this week.
Issues on this repo are public, so close it once you have read it.

## Tuning

`listen.config.json` holds the words it scores on. A post needs at least one
problem phrase (like "answering service" or "missed calls") plus some sign of
a business or a question. Posts selling something ("we offer", "free trial",
"DM me") are dropped. Raise `minScore` for fewer, stronger leads; lower it for
more.

GitHub turns off scheduled workflows in a public repo after 60 days without
any commits. The social publisher commits regularly, which keeps this one on.
