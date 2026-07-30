import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const raw = () => readFileSync('out/index.html', 'utf8');

// Next inlines the RSC flight payload into <script> tags and it repeats the page
// copy verbatim. Any assertion about what a visitor can actually read has to
// exclude it, or the assertion passes on script data while the markup is empty.
const rendered = () => raw().replace(/<script[\s\S]*?<\/script>/g, '');

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

  it('pre-renders the approved hero headline as the h1', () => {
    // Read the <h1> specifically: the same sentence is in the meta description,
    // so a document-wide check passes even with no hero on the page.
    const h1 = rendered().match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
    expect(h1).toContain(
      'I build systems that designers can understand and engineers can build.',
    );
  });

  it('pre-renders the hero body as real paragraphs, readable with JS disabled', () => {
    const paragraphs = [...rendered().matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs.join(' ')).toContain(
      'Now I work where design and implementation are one job instead of two.',
    );
  });

  it('ships the pre-paint theme script in <head>, so a returning visitor gets no flash', () => {
    // Asserted on raw HTML because this test is *about* the script. Presence
    // alone is the guard: deleting themeInit must fail something.
    const head = raw().match(/<head>[\s\S]*?<\/head>/)?.[0] ?? '';
    expect(head).toContain("localStorage.getItem('theme')");
  });

  it('ships a default theme on <html>, so the static markup is never theme-less', () => {
    expect(rendered()).toMatch(/<html[^>]*data-theme="light"/);
  });
});
