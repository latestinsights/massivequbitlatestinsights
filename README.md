# MassiveQubit knowledge library

- [Latest insights](latestinsights/): articles and migrated website entries.
- [Wikis](wikis/): practical guides and reference material.
- [Projects](projects/): project writeups.

## Editorial workflow

Create a Markdown file under its section, then add its metadata to `entries.json` using an existing entry as the schema. Use a unique lowercase hyphenated ID matching the filename. Provide title, excerpt, author, ISO date, category, reading time, HTTPS image URL, meaningful imageAlt, and the exact GitHub article URL. Set `status` to `draft`. Estimate reading time from the completed article at about 200 words per minute.

Review facts, sources, authorship, and image rights before changing status to `approved`. The weekly workflow publishes at most one due approved entry and updates `feed.json` in the same commit. Draft and approved entries never appear in the feed. These files remain publicly readable in this public repository; use a private editorial location for confidential drafts.

Default schedule: Sunday 22:17 UTC (Monday 08:17 Sydney standard time / 09:17 daylight time). Manual workflow runs also process the queue. A seven-day publication guard prevents duplicate weekly releases on reruns. An empty queue publishes nothing. This is scheduled publishing of reviewed content, not automatic research or article generation.

The website reads the public feed on page load; routine publications do not require website deployment or cross-repository credentials. GitHub raw-content caching can delay visibility briefly. Existing open pages refresh on reload.

## Initial migration

The six imported entries are **summary-only migration records**. No full articles or photographs existed in the website source. Imported bylines, dates, and estimated reading times are preserved, but require editorial verification. The existing MassiveQubit logo is the temporary image. Complete the articles, replace the images, verify authors, and recalculate reading times before treating them as finished articles. Remove `migratedSummary` after review.

## Operations

Run `node scripts/publish.mjs` to validate metadata/files and regenerate the public feed. Run `node scripts/publish.mjs --weekly` to simulate processing the queue in a disposable copy. Failed Actions runs report validation/push failures. Enable GitHub Actions and allow its token to write repository contents; branch rules must permit the workflow commit or publication will fail visibly. Revert a bad publication commit to restore its metadata and feed together.

Publication commits made using GITHUB_TOKEN do not trigger another push workflow: https://docs.github.com/en/actions/concepts/security/github_token . The feed is generated in the publishing job itself.
