# MassiveQubit knowledge library

- [Latest insights](latestinsights/): articles and migrated website entries.
- [Wikis](wikis/): practical guides and reference material.
- [Projects](projects/): project writeups.

## Editorial workflow

Create a Markdown file under its section, then add its metadata to `entries.json` using an existing entry as the schema. Use a unique lowercase hyphenated ID matching the filename. Provide title, excerpt, author, ISO date, category, reading time, HTTPS image URL, meaningful imageAlt, and the exact GitHub article URL. Set `status` to `draft`. Estimate reading time from the completed article at about 200 words per minute.

Follow [the weekly research procedure](WEEKLY-RESEARCH.md) for NEW articles. The six existing full drafts remain pending separate owner approval and are excluded from automation. Draft and approved entries never appear in the feed. Files committed here are public; keep confidential drafts elsewhere.

Schedule: Sunday 22:17 Australia/Sydney, including daylight saving, through the owner's active local Codex task. The former UTC GitHub queue scheduler is disabled. The gate permits one new article per Monday–Sunday Sydney calendar week, with article, feed and ledger in one normal fast-forward Git push. GitHub Actions now only validates; manual Actions runs cannot publish a queue. Target completion is before midnight, with no automatic late backfill.

The website reads the public feed on page load; routine publications do not require website deployment or cross-repository credentials. GitHub raw-content caching can delay visibility briefly. Existing open pages refresh on reload.

## Initial migration

The six imported entries remain **summary-only migration records**. Their full drafts are not published. Preview author is concierge@massivequbit.io and the fallback image is explicitly the MassiveQubit logo. Historical dates and old reading estimates do not establish that full articles existed. New weekly articles use finished-text reading times and fully checked evidence.

## Operations

Run `node --test scripts/publication-gate.test.mjs` and `node scripts/validate-publication.mjs` for no-write checks. Run `node scripts/publication-gate.mjs CANDIDATE_PATH` for a no-write candidate dry run within the publication window. The retired `publish.mjs --weekly` refuses queue publication. Research/source/accuracy review is performed by the Codex task; the gate enforces its evidence record and mechanical invariants, not scientific truth by itself.

Credentials: signed-in Codex with available usage and approved network access; Git write access to main via an approved credential store. No OpenAI API key is needed. The existing website Azure deployment secret remains in its repository. GitHub validation needs only read permission. Local scheduling requires the host and Codex to be available; unattended research-to-publication completion has not yet been demonstrated. Mechanical dry runs, GitHub validation, Azure deployment and live preview links passed on 2026-09-13. The live site retains cached or bundled previews when feed fetching fails. Never remove a publication ledger entry just to retry a failed synchronization check.
