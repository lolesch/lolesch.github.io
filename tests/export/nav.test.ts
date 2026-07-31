import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { body } from './rendered';

/*
 * Moved out of tests/export/about.test.ts on 2026-07-31, when a third link made
 * it obvious the block was never about /about/. It globs every exported page,
 * because the nav lives in the layout and a regression drops it from all of
 * them at once.
 */

// The four the PRD specifies: three links plus the wordmark.
const LINKS = [
  ['Work', 'href="/#work"'],
  ['Design System', 'href="/design-system/"'],
  ['About', 'href="/about/"'],
] as const;

describe('site navigation', () => {
  // The 404 pages carry the header too and are included on purpose: a visitor
  // who lands on one needs the way out most.
  const pages = globSync('out/**/*.html');

  it('has pages to check, so the cases below are not vacuous', () => {
    expect(pages.length).toBeGreaterThan(3);
  });

  for (const page of pages) {
    it(`${page} carries every nav link`, () => {
      const visible = body(page);
      for (const [label, href] of LINKS) {
        expect(visible, `no ${label} link`).toContain(href);
      }
    });
  }

  it('marks each route link as current on its own page and nowhere else', () => {
    expect(body('out/about/index.html')).toContain('aria-current="page"');
    expect(body('out/design-system/index.html')).toContain('aria-current="page"');
    // Work is a fragment link into Home, which has no unambiguous current
    // state, so Home marks nothing.
    expect(body('out/index.html')).not.toContain('aria-current="page"');
  });
});
