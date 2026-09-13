import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { validateFeed, repositoryUrl, articleAuthor } from './insights.mjs';

export function calendar(now = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now).map(p => [p.type, p.value]));
  const date = `${p.year}-${p.month}-${p.day}`;
  const monday = new Date(`${date}T12:00:00Z`);
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  return { date, week: monday.toISOString().slice(0, 10), eligible: p.weekday === 'Sunday' && (+p.hour * 60 + +p.minute) >= 1337 };
}
export const digest = text => createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');
export const wordCount = text => (text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').match(/\b[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*\b/gu) || []).length;
const checks = ['technicalAccuracy', 'claimSupport', 'referenceAuthenticity', 'arithmetic', 'authorIdentity', 'metadata', 'duplicateContent', 'articleLinks', 'imageRights', 'feasibility'];
export function prepare(candidate, entries, state, now = new Date(), readArticle = p => readFileSync(p, 'utf8')) {
  const slot = calendar(now);
  if (!slot.eligible) throw new Error('Outside Sunday 22:17–23:59 Australia/Sydney; publish nothing');
  if (state.weeks?.[slot.week] || entries.some(e => e.status === 'published' && !e.migratedSummary && calendar(new Date(`${e.date}T12:00:00+10:00`)).week === slot.week)) throw new Error('Sydney calendar week already published');
  const { metadata: m, markdown, review } = candidate;
  if (!m || typeof markdown !== 'string' || !review) throw new Error('Missing candidate, metadata or review');
  if (!m.id.startsWith(`${slot.week}-`) || entries.some(e => e.id === m.id || e.title.toLowerCase() === m.title.toLowerCase())) throw new Error('Existing/protected ID or duplicate title');
  if (m.date !== slot.date || m.author !== articleAuthor || m.section !== 'latestinsights' || m.status !== 'published' || m.migratedSummary) throw new Error('Invalid weekly metadata');
  if (!markdown.startsWith(`# ${m.title}\n\nAuthor: ${articleAuthor}\n`) || (markdown.match(/^Author:/gm) || []).length !== 1 || !markdown.includes(`Published: ${slot.date}`)) throw new Error('Byline/title/date mismatch');
  if (!markdown.includes('\n## References\n')) throw new Error('Missing full References section');
  const prose = markdown.split('\n## References\n')[0].replace(/^# .*\n|^Author:.*\n|^Published:.*\n/gm, '');
  const words = wordCount(prose);
  if (words < 900 || words > 1600) throw new Error(`Expected 900–1600 prose words; got ${words}`);
  if (m.readTime !== `${Math.ceil(wordCount(markdown) / 200)} min read`) throw new Error('Reading time must count finished Markdown text at 200 wpm');
  if (review.articleSha256 !== digest(markdown) || !checks.every(k => review.checks?.[k]?.passed === true && review.checks[k].evidence?.trim())) throw new Error('Missing substantive review tied to final article hash');
  if (review.existingContentDigest !== digest(JSON.stringify(entries))) throw new Error('Review must cover current repository entries');
  if (!Array.isArray(review.candidates) || review.candidates.length < 3 || !review.selectionRationale) throw new Error('Record three candidate assessments and selection rationale');
  const refs = review.references || [];
  if (refs.filter(r => r.kind === 'peer-reviewed' && r.peerReviewEvidence).length < 2 || !refs.some(r => r.kind === 'technical')) throw new Error('Need two verified peer-reviewed papers and one authoritative technical source');
  const urls = new Set();
  for (const r of refs) {
    if (!r.title || !r.authors || !r.date || !r.venue || !r.verificationUrl || !r.supportedClaims || !['abstract', 'full-text'].includes(r.access)) throw new Error('Incomplete source verification');
    if (new URL(r.url).protocol !== 'https:' || urls.has(r.url)) throw new Error('Invalid/duplicate reference URL');
    urls.add(r.url);
    if (!markdown.split('\n## References\n')[1].includes(r.title) || !prose.includes(`](${r.url})`)) throw new Error('Reference missing or not cited beside claims');
    if (r.kind === 'preprint' && !markdown.includes('preprint')) throw new Error('Label preprints');
  }
  for (const e of entries) {
    if (digest(readArticle(`${e.section}/${e.id}.md`)) === digest(markdown)) throw new Error('Duplicate article content');
  }
  if (m.image === 'https://massivequbit.io/massive-qubit-logo-optimized.webp' && m.imageAlt !== 'MassiveQubit logo') throw new Error('Logo fallback alt must be accurate');
  const updated = [...entries, { ...m, automationWeek: slot.week, articleSha256: digest(markdown) }];
  const feed = validateFeed(updated.filter(e => e.status === 'published'), now);
  return { updated, feed, state: { ...state, weeks: { ...state.weeks, [slot.week]: { id: m.id, date: slot.date, sha256: digest(markdown) } } }, words };
}

export function run(candidatePath, apply = false) {
  const candidate = JSON.parse(readFileSync(candidatePath, 'utf8'));
  const entries = JSON.parse(readFileSync('entries.json', 'utf8'));
  const state = JSON.parse(readFileSync('publication-state.json', 'utf8'));
  const result = prepare(candidate, entries, state);
  const path = `latestinsights/${candidate.metadata.id}.md`;
  if (existsSync(path)) throw new Error('Article path already exists; reconcile remote state before retry');
  if (apply) {
    mkdirSync('research', { recursive: true });
    writeFileSync(path, candidate.markdown);
    writeFileSync(`research/${candidate.metadata.id}.json`, JSON.stringify(candidate.review, null, 2) + '\n');
    for (const [path, data] of [['entries.json', result.updated], ['feed.json', result.feed], ['publication-state.json', result.state]]) writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  }
  console.log(`${apply ? 'Prepared atomic Git publication' : 'DRY RUN PASS; no repository writes'}: ${candidate.metadata.id}, ${result.words} prose words`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { run(process.argv[2], process.argv.includes('--apply')); }
  catch (e) { console.error(`Publication refused: ${e.message}`); process.exitCode = 1; }
}
