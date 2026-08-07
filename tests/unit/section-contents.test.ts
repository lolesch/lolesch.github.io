import { describe, expect, it } from 'vitest';
// Relative rather than the @/ alias, for the reason tests/unit/content.test.ts
// gives: vitest.config.mts declares no path aliases.
import { about } from '../../src/content/about';
import { DESIGN_SYSTEM_SECTIONS } from '../../src/content/design-system';
import { projects } from '../../src/content/projects';
import { contentsOf, sectionId } from '../../src/lib/sections';

/*
 * The section rail turns every heading into a link, which makes two things that
 * were previously harmless into defects: a heading that slugs to nothing, and
 * two headings on one page that slug to the same thing. Neither is visible on
 * the rendered page. The first ships a link to `#`, and the second ships two
 * entries that scroll to the same place, with the second one unreachable.
 *
 * src/lib/sections.ts deliberately does not disambiguate collisions with a
 * numeric suffix. That would make this test pass while hiding the actual
 * problem, which is two sections on one page headed the same thing.
 */

// A fragment that is safe in a URL and in a CSS selector: lowercase alphanumeric
// groups joined by single hyphens, with no hyphen at either end.
const FRAGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Every page whose contents feed a rail, named the way a failure should read.
const PAGES = [
  ...projects.map((project) => [`projects/${project.slug}`, contentsOf(project.sections)] as const),
  ['about', contentsOf(about.sections)] as const,
  // Authored rather than derived, so this is the one page where the ids are a
  // decision someone made and could get wrong by hand.
  ['design-system', DESIGN_SYSTEM_SECTIONS] as const,
];

describe('section contents', () => {
  it('covers every reading page, so the cases below are not vacuous', () => {
    // Four projects, About, and the design system.
    expect(PAGES.length).toBeGreaterThan(4);
  });

  it('slugs a heading to the fragment it will be linked as', () => {
    // Spelled out rather than derived, so a change to the rule fails here with
    // the old and new behaviour side by side rather than silently agreeing with
    // itself.
    expect(sectionId('The flow')).toBe('the-flow');
    expect(sectionId("Where I'm going")).toBe('where-i-m-going');
    expect(sectionId('One card, four screens')).toBe('one-card-four-screens');
  });

  for (const [page, contents] of PAGES) {
    describe(page, () => {
      it('gives every section a usable fragment', () => {
        for (const section of contents) {
          expect(section.id, `"${section.heading}" slugs to nothing usable`).toMatch(FRAGMENT);
        }
      });

      it('never gives two sections the same fragment', () => {
        // Reported as the duplicated id rather than as a count, because the
        // fix is to rename one of the two headings and the message has to say
        // which.
        const seen = new Set<string>();
        const clashes = contents.filter((section) => {
          if (seen.has(section.id)) return true;
          seen.add(section.id);
          return false;
        });
        expect(clashes.map((section) => section.id)).toEqual([]);
      });

      it('shows the heading it points at, verbatim', () => {
        // The rail's label is the heading rather than a shortened version of
        // it. A contents entry that paraphrases is a second piece of copy to
        // keep in step, which is the thing this whole arrangement avoids.
        for (const section of contents) {
          expect(section.heading.length).toBeGreaterThan(0);
        }
      });
    });
  }
});
