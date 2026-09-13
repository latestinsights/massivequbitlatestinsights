import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { validateFeed } from './insights.mjs';

const today = new Date().toISOString().slice(0, 10);
const entries = JSON.parse(readFileSync('entries.json', 'utf8'));
const ids = new Set();
for (const entry of entries) {
  if (ids.has(entry.id)) throw new Error(`Duplicate ID: ${entry.id}`);
  ids.add(entry.id);
  if (!['draft', 'approved', 'published'].includes(entry.status)) throw new Error('Invalid status');
  validateFeed([{ ...entry, status: 'published' }]);
  if (!existsSync(`${entry.section}/${entry.id}.md`)) throw new Error(`Missing article: ${entry.id}`);
}
// Validate every entry before modifying publication state.
const state = existsSync('publication-state.json') ? JSON.parse(readFileSync('publication-state.json', 'utf8')) : {};
if (process.argv.includes('--weekly')) {
  const elapsed = state.lastPublished ? Date.parse(today) - Date.parse(state.lastPublished) : Infinity;
  if (elapsed >= 7 * 86400000) {
    const next = entries.filter(entry => entry.status === 'approved' && entry.date <= today)
      .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))[0];
    if (next) {
      if (next.migratedSummary) throw new Error('Complete the article before approving it');
      next.status = 'published';
      next.date = today;
      state.lastPublished = today;
    } else console.log('No approved entries due; nothing published.');
  }
}
const feed = validateFeed(entries.filter(entry => entry.status === 'published'));
writeFileSync('feed.json', JSON.stringify(feed, null, 2) + '\n');
writeFileSync('entries.json', JSON.stringify(entries, null, 2) + '\n');
writeFileSync('publication-state.json', JSON.stringify(state, null, 2) + '\n');
console.log(`Validated ${entries.length} entries; ${feed.length} published previews.`);
