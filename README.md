# MassiveQubit knowledge library

- [Latest insights](latestinsights/): articles and migrated website entries.
- [Wikis](wikis/): practical guides and reference material.
- [Projects](projects/): project writeups.

## Editorial workflow

Create a Markdown file under its section, then add its metadata to `entries.json` using an existing entry as the schema. Use a unique lowercase hyphenated ID matching the filename. Provide title, excerpt, author, ISO date, category, reading time, HTTPS image URL, meaningful imageAlt, and the exact GitHub article URL. Set `status` to `draft`. Estimate reading time from the completed article at about 200 words per minute.

Follow [the weekly research procedure](WEEKLY-RESEARCH.md) for NEW articles. The six existing full drafts remain pending separate owner approval and are excluded from automation. Draft and approved entries never appear in the feed. Files committed here are public; keep confidential drafts elsewhere.

Schedule: Sunday 21:30 Australia/Melbourne, including daylight saving, on GitHub-hosted Actions. It does not depend on a local computer. GitHub's timezone-aware schedule runs once at the Melbourne wall-clock time. The retired queue and local Codex schedules are removed. The generator permits one new article per Monday–Sunday Melbourne/Sydney calendar week, with article, original image, evidence, feed and ledger in one normal fast-forward Git push. Target completion is before midnight, with no automatic late backfill.

The website reads the public feed on page load; routine publications do not require website deployment or cross-repository credentials. GitHub raw-content caching can delay visibility briefly. Existing open pages refresh on reload.

## Initial migration

The six imported summaries were expanded and published as full articles after owner approval on 13 September 2026. Each article and card uses its own original generated header image. Their historical preview dates remain unchanged. New weekly articles use finished-text reading times and fully checked evidence.

## Operations

Run `node --test scripts/publication-gate.test.mjs` and `node scripts/validate-publication.mjs` for no-write checks. Run `node scripts/publication-gate.mjs CANDIDATE_PATH` for a no-write candidate dry run within the publication window. The retired `publish.mjs --weekly` refuses queue publication. Research/source/accuracy review is performed by the Codex task; the gate enforces its evidence record and mechanical invariants, not scientific truth by itself.

Credentials: the content repository requires an `OPENAI_API_KEY` Actions secret with Responses web-search and image-generation access. Optional `OPENAI_MODEL` and `OPENAI_IMAGE_MODEL` repository variables default to `gpt-5.4` and `gpt-image-2`. GitHub's scoped token commits the generated files. The existing website Azure deployment secret remains in its repository. No credential is committed or printed. Until the OpenAI secret is installed, scheduled runs fail safely before research and publish nothing. The live site retains cached or bundled previews when feed fetching fails.
