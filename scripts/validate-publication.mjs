import { readFileSync } from 'node:fs';
import { validateFeed } from './insights.mjs';
import { digest, calendar, wordCount } from './publication-gate.mjs';
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const entries = read('entries.json');
const feed = read('feed.json');
const state = read('publication-state.json');
const expected = validateFeed(entries.filter(e => e.status === 'published'));
if (JSON.stringify(feed) !== JSON.stringify(expected)) throw new Error('Feed differs from published entries');
const weeks = new Set();
for (const e of entries) {
  const body = readFileSync(`${e.section}/${e.id}.md`, 'utf8');
  if (!e.automationWeek) continue;
  if (weeks.has(e.automationWeek)) throw new Error('Duplicate publication week');
  weeks.add(e.automationWeek);
  const review = read(`research/${e.id}.json`);
  if (digest(body) !== e.articleSha256 || review.articleSha256 !== e.articleSha256 || state.weeks?.[e.automationWeek]?.id !== e.id) throw new Error('Article/review/state mismatch');
  if (calendar(new Date(`${e.date}T12:00:00+10:00`)).week !== e.automationWeek || e.readTime !== `${Math.ceil(wordCount(body) / 200)} min read`) throw new Error('Invalid date or reading time');
}
console.log(`Validated ${feed.length} published previews and ${weeks.size} weekly articles; no files changed.`);
