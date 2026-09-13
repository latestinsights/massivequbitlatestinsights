import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calendar, prepare, digest, wordCount } from './publication-gate.mjs';
const now = new Date('2026-09-13T12:17:00Z');
function fixture() {
  const title = 'Synthetic publication gate fixture';
  const markdown = `# ${title}\n\nAuthor: concierge@massivequbit.io\n\nPublished: 2026-09-13\n\n${'synthetic '.repeat(940)}[1](https://example.org/1) [2](https://example.org/2) [3](https://example.org/3)\n\n## References\n\nPaper One\nPaper Two\nTechnical Source\n`;
  return { markdown, metadata: { id: '2026-09-07-synthetic-fixture', title, author: 'concierge@massivequbit.io', date: '2026-09-13', excerpt: 'Synthetic test, never for publication.', readTime: `${Math.ceil(wordCount(markdown) / 200)} min read`, category: 'Technology', image: 'https://massivequbit.io/massive-qubit-logo-optimized.webp', imageAlt: 'MassiveQubit logo', section: 'latestinsights', status: 'published', url: 'https://github.com/latestinsights/massivequbitlatestinsights/blob/main/latestinsights/2026-09-07-synthetic-fixture.md' }, review: { articleSha256: digest(markdown), existingContentDigest: digest('[]'), candidates: ['a', 'b', 'c'], selectionRationale: 'Synthetic test.', checks: Object.fromEntries(['technicalAccuracy', 'claimSupport', 'referenceAuthenticity', 'arithmetic', 'authorIdentity', 'metadata', 'duplicateContent', 'articleLinks', 'imageRights', 'feasibility'].map(k => [k, { passed: true, evidence: 'Synthetic test only.' }])), references: ['Paper One', 'Paper Two', 'Technical Source'].map((title, i) => ({ title, authors: 'Synthetic', date: '2026', venue: 'Synthetic', kind: i < 2 ? 'peer-reviewed' : 'technical', peerReviewEvidence: 'Synthetic', url: `https://example.org/${i + 1}`, verificationUrl: 'https://example.org', access: 'abstract', supportedClaims: 'Synthetic' })) } };
}
test('Sydney schedule handles DST transitions and Monday week/year boundaries', () => {
  assert.equal(calendar(now).eligible, true);
  assert.equal(calendar(new Date('2026-09-13T12:16:00Z')).eligible, false);
  assert.equal(calendar(new Date('2026-10-04T11:17:00Z')).eligible, true);
  assert.equal(calendar(new Date('2026-04-05T12:17:00Z')).eligible, true);
  assert.equal(calendar(new Date('2026-09-13T14:00:00Z')).eligible, false);
  assert.equal(calendar(new Date('2027-01-03T11:17:00Z')).week, '2026-12-28');
});
test('valid mechanical dry run does not mutate inputs; replay and second article are refused', () => {
  const c = fixture(), before = JSON.stringify(c);
  const output = prepare(c, [], {}, now);
  assert.equal(JSON.stringify(c), before);
  assert.equal(output.feed.length, 1);
  assert.equal(digest(c.markdown.replace(/\n/g, '\r\n')), digest(c.markdown));
  assert.throws(() => prepare(c, output.updated, output.state, now), /already published/);
  assert.throws(() => prepare(c, output.updated, {}, now), /already published/);
});
test('gate fails closed on altered article, unverified references, wrong metadata and stale review', () => {
  for (const mutate of [c => c.markdown += 'changed', c => c.review.references[0].kind = 'preprint', c => c.metadata.author = 'Someone', c => c.metadata.readTime = '1 min read', c => c.review.checks.arithmetic.passed = false, c => c.review.existingContentDigest = 'stale']) {
    const c = fixture(); mutate(c); assert.throws(() => prepare(c, [], {}, now));
  }
});

