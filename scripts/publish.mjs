// Queue publication is retired. New weekly articles must pass publication-gate.mjs.
if (process.argv.includes('--weekly')) throw new Error('Queue publication disabled; use the weekly research procedure');
await import('./validate-publication.mjs');
