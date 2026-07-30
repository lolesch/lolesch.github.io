import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static export (Seam 2)', () => {
  it('produces an index.html at the export root', () => {
    expect(existsSync('out/index.html')).toBe(true);
  });

  it('emits the _next asset directory', () => {
    expect(readdirSync('out')).toContain('_next');
  });

  it('carries .nojekyll so GitHub Pages does not drop _next/', () => {
    expect(existsSync('out/.nojekyll')).toBe(true);
  });

  it('pre-renders real HTML rather than an empty JS shell', () => {
    const html = readFileSync('out/index.html', 'utf8');
    expect(html).toContain('<h1');
  });
});
