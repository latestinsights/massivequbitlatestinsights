# MassiveQubit knowledge library

- [Latest insights](latestinsights/): published articles.
- [Wikis](wikis/): practical guides and reference material.
- [Projects](projects/): project writeups.

## Weekly publication

The active publisher is a ChatGPT hosted Scheduled task using the connected GitHub plugin. It runs every Sunday at 21:30 Australia/Melbourne, follows daylight saving, and does not require a local computer to be awake. The former API-based GitHub Actions generator has been removed.

Each run must fail closed unless it can research and validate one original 900–1,600 word article, create an original header image, update `entries.json`, `feed.json`, and `publication-state.json`, commit all publication files atomically, and verify the public article and MassiveQubit blog feed. The fixed article author is `concierge@massivequbit.io`.

The ledger uses Monday–Sunday Sydney calendar weeks. A run exits without writing if that week already exists in `publication-state.json` or any feed item has the same `automationWeek`. Retries reconcile the remote branch before writing and never force-push.

The website reads the public feed at runtime using its existing card presentation and GitHub Read More links. Routine articles do not require an Azure redeployment. Preserve `projects/`, `wikis/`, and `latestinsights/`.

## Editorial evidence

Every new article requires at least two verified peer-reviewed papers plus one authoritative standard, official document, or institutional publication. Research evidence and validation results are stored under `research/`. Preprints are labelled and do not count toward the two-paper minimum. If accuracy, citations, image, metadata, duplicate, or live-link checks fail, publish nothing and report an actionable failure.

The six historical articles retain their previously approved status and are not modified by the weekly task.
