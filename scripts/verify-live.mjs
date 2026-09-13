const feedUrl = 'https://raw.githubusercontent.com/latestinsights/massivequbitlatestinsights/main/feed.json';
const state = JSON.parse(await (await import('node:fs/promises')).readFile('publication-state.json', 'utf8'));
const expectedId = state.weeks?.[state.lastAutomationWeek]?.id;
if (!expectedId) throw new Error('Publication ledger has no expected weekly article ID');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
for (let attempt = 1; attempt <= 10; attempt++) {
  try {
    const feedResponse = await fetch(`${feedUrl}?v=${Date.now()}`, { cache: 'no-store' });
    const feed = await feedResponse.json();
    const newest = feed.find(entry => entry.id === expectedId);
    if (!newest) throw new Error(`Public feed has not exposed ${expectedId} yet`);
    for (const url of [newest.url, newest.image, 'https://massivequbit.io/#blog']) {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      await response.body?.cancel();
    }
    console.log(`Verified public article, original image, feed and blog endpoint for ${newest.id}.`);
    process.exit(0);
  } catch (error) {
    if (attempt === 10) throw error;
    await sleep(15000);
  }
}
