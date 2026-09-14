# Weekly research and publication contract

This document mirrors the operating rules for the hosted ChatGPT Scheduled task.

1. Read `entries.json`, `feed.json`, `publication-state.json`, and every title in `latestinsights/`. Derive the current Monday–Sunday week in Australia/Sydney. If it has already been published, stop without writing.
2. Research at least three materially different topics relevant to MassiveQubit digital twins. Prefer primary sources and select a fresh topic with a credible application path.
3. Verify at least two peer-reviewed papers and one authoritative technical source. Record exact title, authors, date, venue, DOI or stable URL, access scope, and preprint status.
4. Write an original 900–1,600 word Markdown article using author `concierge@massivequbit.io`. Separate demonstrated results from proposals and speculation. Include problem, technology, implementation, feasibility, resources, cost considerations, risks, trade-offs, conclusions, and complete references.
5. Generate a new original header image. Use that exact image in the Markdown header and feed metadata with meaningful alt text.
6. Calculate reading time from the finished article at 200 words per minute, rounded up. Validate citations, claims, arithmetic, author, metadata, duplicates, hashes, and links.
7. Re-read the main branch. Atomically commit the article, image, evidence record, both identical feed files, and weekly ledger. Never overwrite an existing article and never force-push.
8. Verify the GitHub article URL, raw image, raw feed, and the newest card and Read More link at https://massivequbit.io. If a pre-commit check fails, write nothing. If a post-commit live check is delayed, preserve the valid commit and report the precise synchronization state.

The task runs Sunday at 21:30 Australia/Melbourne. ChatGPT hosts the task; there is no repository scheduler, local-computer dependency, or OpenAI API secret.
