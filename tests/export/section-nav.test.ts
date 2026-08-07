import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { body } from './rendered';

/*
 * The rail against the artifact that ships, which is the only place two of
 * these can be checked at all.
 *
 * The unit guard asserts the contents of a page are internally sound. It cannot
 * assert that the ids reach anything, because the anchors are set by a
 * component and the headings are rendered by another one: a rail pointing at
 * `#the-editor` and a heading carrying `id="the-editor"` are two files agreeing,
 * and the exported HTML is where that agreement is either true or not.
 *
 * /design-system needs this most. Its eight sections are composed by hand and
 * its contents list is authored beside them, so a ninth section added to the
 * page without a ninth entry in the list is invisible to typecheck, to the unit
 * guard, and to anyone looking at the page.
 */

const RAIL = /<nav[^>]*aria-label="On this page"[\s\S]*?<\/nav>/;

const railOf = (page: string) => body(page).match(RAIL)?.[0] ?? '';

const fragmentsOf = (rail: string) => [...rail.matchAll(/href="#([^"]+)"/g)].map(([, id]) => id);

describe('section rail', () => {
  // Every page that is a reading. Home is deliberately absent and is asserted
  // against separately below.
  const pages = [
    ...globSync('out/projects/*/index.html'),
    'out/about/index.html',
    'out/design-system/index.html',
  ];

  it('has pages to check, so the cases below are not vacuous', () => {
    expect(pages.length).toBeGreaterThan(4);
  });

  for (const page of pages) {
    describe(page, () => {
      const rail = railOf(page);
      const fragments = fragmentsOf(rail);

      it('ships a rail with more than one entry', () => {
        // More than one, because ReadingPage renders nothing at all below that:
        // a contents list of one is an empty promise, and a rail asserted only
        // to exist would pass with a single dead entry in it.
        expect(rail, 'no rail in the export').not.toBe('');
        expect(fragments.length).toBeGreaterThan(1);
      });

      it('points every entry at a heading that is actually there', () => {
        // The defect this exists for: a heading rewritten, or a section added
        // to a hand-composed page, leaving a link that scrolls nowhere. It
        // looks completely fine until someone clicks it.
        const visible = body(page);
        const dead = fragments.filter((id) => !visible.includes(`id="${id}"`));
        expect(dead).toEqual([]);
      });

      it('lists the headings in the order the page reads them', () => {
        // Order is the argument on a case study, and the rail carries a number
        // per entry. A list that is complete but out of sequence numbers the
        // sections wrongly, which is worse than omitting the numbers.
        const visible = body(page);
        const positions = fragments.map((id) => visible.indexOf(`id="${id}"`));
        expect(positions).toEqual([...positions].sort((a, b) => a - b));
      });

      it('marks nothing as current in the export', () => {
        // Where the reader is depends on scroll position, which does not exist
        // at build time. A build that somehow emitted a mark would be claiming
        // a position nobody is in, and would also put a second aria-current on
        // a page where tests/export/nav.test.ts counts them.
        expect(rail).not.toContain('aria-current');
      });

      it('is not rendered below the breakpoint that has room for it', () => {
        // The requirement the rail exists under: it occupies the slack beside
        // `measure`, and that slack only exists once `frame` has stopped
        // growing. `hidden` rather than an off-screen inset, so it leaves the
        // accessibility tree too and a phone reader is not offered navigation
        // it cannot reach.
        const tag = rail.match(/<nav[^>]*>/)?.[0] ?? '';
        expect(tag).toContain('hidden');
        expect(tag).toContain('lg:block');
      });
    });
  }

  it('leaves Home alone, which has one section and no sequence', () => {
    // The same call SectionHeading makes by not numbering Home's one section:
    // a contents list there would promise a second entry that never arrives.
    expect(railOf('out/index.html')).toBe('');
  });
});
