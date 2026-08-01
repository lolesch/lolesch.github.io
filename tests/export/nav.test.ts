import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { body } from './rendered';

/*
 * Moved out of tests/export/about.test.ts on 2026-07-31, when a third link made
 * it obvious the block was never about /about/. It globs every exported page,
 * because the nav lives in the layout and a regression drops it from all of
 * them at once.
 */

// The four the PRD specifies: three links plus the wordmark. The wordmark is
// matched on its text rather than on href="/", which a project page also ships
// on "Back to all work" and would pass without a header at all.
const LINKS = [
  ['the wordmark', '>Leonid Schreiber</a>'],
  ['Work', 'href="/#work"'],
  ['Design System', 'href="/design-system/"'],
  ['About', 'href="/about/"'],
] as const;

// Every route a link stands for. The 404 pages are deliberately absent: they
// correspond to no nav entry, and marking one would be a claim about where the
// visitor is that is not true.
const ROUTES = ['out/index.html', 'out/design-system/index.html', 'out/about/index.html'] as const;

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
      for (const [label, marker] of LINKS) {
        expect(visible, `no ${label} link`).toContain(marker);
      }
    });
  }

  it('marks the current route on every route page, Home included', () => {
    // Home was the exception until 2026-08-01. Work is a fragment into it and
    // could not claim to be the page, so the one route every visitor lands on
    // first was the one that highlighted nothing. The wordmark is a route link
    // now, and it is what carries Home.
    for (const page of ROUTES) {
      expect(body(page), `${page} marks nothing as current`).toContain('aria-current="page"');
    }
  });

  it('marks exactly one link per page, so two never claim the same place', () => {
    for (const page of ROUTES) {
      const marks = body(page).match(/aria-current=/g) ?? [];
      expect(marks.length, `${page} marks ${marks.length} links`).toBe(1);
    }
  });

  it('marks a project page as inside Work rather than as Work itself', () => {
    // /work/<slug> has no link of its own and highlighted nothing until
    // 2026-08-01. `true` rather than `page`, because the visitor is under Work
    // and is not on /#work: the distinction is the whole reason both exist.
    const page = globSync('out/work/*/index.html')[0];
    expect(page, 'no project page was exported').toBeDefined();
    expect(body(page)).toContain('aria-current="true"');
    expect(body(page)).not.toContain('aria-current="page"');
  });
});
