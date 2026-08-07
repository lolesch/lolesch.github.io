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
// on "Back to all projects" and would pass without a header at all.
const LINKS = [
  ['the wordmark', '>Leonid Schreiber</a>'],
  ['Projects', 'href="/#projects"'],
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
    // Home was the exception until 2026-08-01, because Projects is a fragment
    // into it and was read as unable to claim the page. A fragment does not
    // leave the page it points into, so Projects is the page on '/', and Home
    // is not an exception at all.
    for (const page of ROUTES) {
      expect(body(page), `${page} marks nothing as current`).toContain('aria-current="page"');
    }
  });

  it('never marks the wordmark, wherever the visitor is', () => {
    // It is the way back, not a place you can be: Home is the projects page,
    // and Projects is what that location is called. This briefly marked the
    // wordmark on '/' instead, so clicking Projects highlighted the site's own
    // name.
    for (const page of pages) {
      const tag = body(page).match(/<a[^>]*>Leonid Schreiber<\/a>/)?.[0] ?? '';
      expect(tag, `${page} has no wordmark`).not.toBe('');
      expect(tag, `${page} marks the wordmark`).not.toContain('aria-current');
    }
  });

  it('marks exactly one link per page, so two never claim the same place', () => {
    // Scoped to the header since the section rail landed. The rail marks the
    // section the reader is in with aria-current="location", which is a
    // different claim from the route they are on and belongs to a different
    // navigation. It emits nothing at build time, because where the reader is
    // depends on scroll position, so counting across the whole body still
    // passes today. It would stop passing the moment anything marked a section
    // server-side, and the failure would land here, in a test about the header,
    // naming a defect that is not one. The claim this makes is about the site
    // nav, so it looks at the site nav.
    for (const page of ROUTES) {
      const header = body(page).match(/<header[\s\S]*?<\/header>/)?.[0] ?? '';
      expect(header, `${page} has no header`).not.toBe('');
      const marks = header.match(/aria-current=/g) ?? [];
      expect(marks.length, `${page} marks ${marks.length} links`).toBe(1);
    }
  });

  it('ships the menu button, wired to the list it discloses', () => {
    // The links above are in the markup at every width; below 40rem CSS is what
    // hides them, and this button is what brings them back. If it stops being
    // exported, every one of those assertions still passes and the site has no
    // navigation at all on a phone.
    //
    // aria-controls is matched against the id it points at rather than merely
    // being present, because a disclosure wired to nothing is the failure that
    // looks fine in a screenshot.
    for (const page of pages) {
      const visible = body(page);
      const button = visible.match(/<button[^>]*aria-expanded="false"[^>]*>/)?.[0] ?? '';
      expect(button, `${page} has no collapsed menu button`).not.toBe('');

      const controls = button.match(/aria-controls="([^"]+)"/)?.[1];
      expect(controls, `${page} menu button controls nothing`).toBeDefined();
      expect(visible, `${page} menu button points at a missing list`).toContain(
        `id="${controls}"`,
      );
    }
  });

  it('marks a project page as inside Projects rather than as Projects itself', () => {
    // /projects/<slug> has no link of its own and highlighted nothing until
    // 2026-08-01. `true` rather than `page`, because the visitor is under
    // Projects and is not on /#projects: the distinction is the whole reason
    // both exist.
    const page = globSync('out/projects/*/index.html')[0];
    expect(page, 'no project page was exported').toBeDefined();
    expect(body(page)).toContain('aria-current="true"');
    expect(body(page)).not.toContain('aria-current="page"');
  });
});
