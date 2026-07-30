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

  // Asserted against the <h1> content, not the whole document: the same
  // sentence appears in the meta description, so a document-wide `toContain`
  // passes even when the hero is not rendered at all.
  it('pre-renders the approved hero headline as the h1', () => {
    const html = readFileSync('out/index.html', 'utf8');
    const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1] ?? '';
    expect(h1).toContain(
      'I build systems that designers can understand and engineers can build.',
    );
  });

  it('renders the hero body, so the page is readable with JS disabled', () => {
    const html = readFileSync('out/index.html', 'utf8');
    expect(html).toContain(
      'Now I work where design and implementation are one job instead of two.',
    );
  });

  it('sets a default theme on the document before paint', () => {
    const html = readFileSync('out/index.html', 'utf8');
    expect(html).toMatch(/data-theme/);
  });
});
