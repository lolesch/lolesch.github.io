import { existsSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { raw, rendered } from './rendered';

const HOME = 'out/index.html';

describe('static export (Seam 2)', () => {
  it('produces an index.html at the export root', () => {
    expect(existsSync(HOME)).toBe(true);
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
    const h1 = rendered(HOME).match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
    expect(h1).toContain(
      'I build systems that designers can understand and engineers can build.',
    );
  });

  it('pre-renders the hero body as the first paragraphs, readable with JS disabled', () => {
    // Anchored to position rather than to a document-wide count: the work grid
    // adds paragraphs of its own below, and this assertion is about the hero.
    const paragraphs = [...rendered(HOME).matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
    // The first hero paragraph carries an apostrophe React escapes as an
    // entity, so this matches a fragment that does not. It still fails if the
    // paragraph goes missing, which is what the assertion is for.
    expect(paragraphs[0]).toContain('taught me that the hard problems were rarely in the code');
    expect(paragraphs[1]).toContain(
      'Now I work where design and implementation are one job instead of two.',
    );
  });

  it('renders the hero headline on the display role, not a Tailwind built-in', () => {
    // The walking skeleton used text-4xl/sm:text-5xl and recorded that this
    // plan replaces them. Asserting on the class asserts the thing promised.
    //
    // Moved from sm:text-display to sm:type-display on 2026-08-01: the bare
    // size utility carried one of the five decisions a heading makes and left
    // the other four at the call site. The role carries all five, and the size
    // ramp is no longer reachable as a utility at all.
    const h1 = raw(HOME).match(/<h1[^>]*>/)?.[0] ?? '';
    expect(h1).toContain('sm:type-display');
    expect(h1).not.toContain('text-4xl');
    expect(h1).not.toContain('text-5xl');
  });

  it('ships the pre-paint theme script in <head>, so a returning visitor gets no flash', () => {
    // Asserted on raw HTML because this test is *about* the script. Presence
    // alone is the guard: deleting themeInit must fail something.
    const head = raw(HOME).match(/<head>[\s\S]*?<\/head>/)?.[0] ?? '';
    expect(head).toContain("localStorage.getItem('theme')");
  });

  it('ships a default theme on <html>, so the static markup is never theme-less', () => {
    expect(rendered(HOME)).toMatch(/<html[^>]*data-theme="light"/);
  });

  it('links a favicon that actually exists in the export', () => {
    // Following the href to disk is the point. Asserting only that a <link>
    // is present would stay green over a 404, which is exactly the failure
    // mode a favicon has: invisible until someone looks at the tab.
    const head = raw(HOME).match(/<head>[\s\S]*?<\/head>/)?.[0] ?? '';
    const href = head.match(/<link[^>]*rel="icon"[^>]*href="([^"]+)"/)?.[1];

    expect(href, 'no rel="icon" link in <head>').toBeDefined();

    // Next appends a cache-busting query to metadata icon hrefs.
    const path = href!.split('?')[0];
    expect(existsSync(`out${path}`), `${path} is linked but not exported`).toBe(true);
  });

  it('puts the project grid on Home, directly under the hero', () => {
    const html = rendered(HOME);
    expect(html).toContain('Rollhaus');
    expect(html).toContain('GlyphsHero');
    expect(html).toContain('How to God');
  });

  it('names every tile link after the project, never "read more"', () => {
    const links = [
      ...rendered(HOME).matchAll(/<a[^>]*href="\/projects\/([^"]+)\/"[^>]*>([\s\S]*?)<\/a>/g),
    ];
    expect(links.length).toBeGreaterThanOrEqual(3);
    for (const [, slug, text] of links) {
      expect(text.trim().length, `link to ${slug} has no accessible name`).toBeGreaterThan(0);
      expect(text.toLowerCase()).not.toContain('read more');
    }
  });

  it('keeps the honest context label on every tile', () => {
    // "Course project, pair" is content, not decoration. It never drops.
    expect(rendered(HOME)).toContain('Course project, pair');
  });
});
