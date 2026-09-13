export const repositoryUrl = 'https://github.com/latestinsights/massivequbitlatestinsights';
export const feedUrl = 'https://raw.githubusercontent.com/latestinsights/massivequbitlatestinsights/main/feed.json';
export const articleAuthor = 'concierge@massivequbit.io';

export function validateFeed(feed, now = new Date()) {
  if (!Array.isArray(feed) || !feed.length || feed.length > 1000) throw new Error('Invalid insights feed');
  const ids = new Set();
  for (const post of feed) {
    if (post.author !== articleAuthor) throw new Error('Article author must be concierge@massivequbit.io');
    for (const key of ['id', 'title', 'excerpt', 'author', 'date', 'readTime', 'category', 'image', 'imageAlt', 'url']) {
      if (typeof post[key] !== 'string' || !post[key].trim()) throw new Error(`Missing ${key}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.id) || ids.has(post.id)) throw new Error('Invalid or duplicate ID');
    ids.add(post.id);
    if (!['latestinsights', 'wikis', 'projects'].includes(post.section)) throw new Error('Invalid section');
    if (post.url !== `${repositoryUrl}/blob/main/${post.section}/${post.id}.md`) throw new Error('Invalid article URL');
    if (new URL(post.image).protocol !== 'https:') throw new Error('Invalid image URL');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || !Number.isFinite(Date.parse(post.date)) || new Date(post.date).toISOString().slice(0, 10) !== post.date) throw new Error('Invalid date');
    if (post.status !== 'published') throw new Error('Unpublished feed entry');
  }
  return feed.filter(post => post.date <= new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now))
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}
