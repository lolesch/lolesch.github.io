import { describe, expect, it } from 'vitest';
import { projects } from '../../src/content/projects';
import { body } from './rendered';

/*
 * The sticky bar has to stay the top layer, and on 2026-08-05 it was not.
 *
 * Both scrim titles carry `z-10` to sit above the image they share a grid cell
 * with, which is a claim about two elements in one box. Neither box was a
 * stacking context, so both z-indexes resolved against the root, where the
 * header's own `z-10` lives. Two tens tie, the later element in the document
 * wins, and the header is first: a project title scrolled over the bar, and on
 * Home the card link's ::after went with it, so a strip of the header
 * navigated to whichever project was passing underneath.
 *
 * None of that is visible in a screenshot of the top of a page, and the click
 * half of it is not visible at all. The invariant is what gets asserted here
 * instead: one layer in the root stacking context, and every local z-index
 * sealed inside an `isolate` box. A guard on the ordering itself is not
 * available to a static export test, because painting order is a property of
 * the browser rather than of the markup.
 */
const PAGES = [
  'out/index.html',
  'out/about/index.html',
  'out/design-system/index.html',
  ...projects.map((project) => `out/projects/${project.slug}/index.html`),
];

const classLists = (markup: string) => [...markup.matchAll(/class="([^"]*)"/g)].map((m) => m[1]);

// Everything a visitor sees except the bar itself. The header is the one place
// a z-index is allowed to mean "above the page".
const belowTheBar = (page: string) => body(page).replace(/<header[\s\S]*?<\/header>/, '');

describe('stacking (Seam 2)', () => {
  for (const page of PAGES) {
    describe(page, () => {
      it('pins the header and gives it the only global z-index', () => {
        const header = body(page).match(/<header[^>]*class="([^"]*)"/)?.[1] ?? '';
        expect(header, 'no <header> on this page').not.toBe('');
        expect(header).toContain('sticky');
        expect(header).toContain('z-10');
      });

      it('seals every other z-index inside an isolated box', () => {
        const lists = classLists(belowTheBar(page));
        const layered = lists.filter((list) => /(^|\s)z-\d/.test(list));
        // Both of them are scrim titles today. A new one that is not is not
        // forbidden, it just has to be looked at: it means something else on the
        // site now wants to be above its neighbours, and this is the case that
        // asks whether it also wants to be above the bar.
        for (const list of layered) {
          expect(list, `an element carries a z-index and is not a scrim title: ${list}`).toContain(
            'text-on-scrim',
          );
        }
        // One isolated container per layered element, at least. Counting rather
        // than walking ancestry, because the export is matched with regexes and
        // there is no DOM here to climb.
        const isolated = lists.filter((list) => /(^|\s)isolate(\s|$)/.test(list));
        expect(
          isolated.length,
          `${layered.length} layered elements and only ${isolated.length} isolated boxes`,
        ).toBeGreaterThanOrEqual(layered.length);
      });
    });
  }
});
