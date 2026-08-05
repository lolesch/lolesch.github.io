import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { projects } from '../../src/content/projects';
import { body } from './rendered';

const stylesheet = () => {
  const files = globSync('out/_next/static/**/*.css');
  expect(files.length).toBeGreaterThan(0);
  return files.map((file) => readFileSync(file, 'utf8')).join('\n');
};

/*
 * A cross-document view transition needs three things and any one of them
 * missing makes it silently do nothing: both documents opt in, the two elements
 * share a name, and the navigation is a real document navigation rather than a
 * client-side route change. None of those is visible in a screenshot, and the
 * failure mode is the transition simply not happening, which nobody notices.
 */
describe('the card to page transition', () => {
  it('opts both documents in', () => {
    expect(stylesheet()).toContain('@view-transition');
  });

  it('names the same element on the card and on the hero', () => {
    const home = body('out/index.html');
    for (const project of projects) {
      const name = `thumb-${project.slug}`;
      expect(home, `the card for ${project.slug} carries no transition name`).toContain(name);
      expect(
        body(`out/projects/${project.slug}/index.html`),
        `the hero for ${project.slug} carries no transition name`,
      ).toContain(name);
    }
  });

  it('reaches a project through a plain anchor rather than the router', () => {
    // Asserted against the source, not the markup, and that is not laziness:
    // next/link renders a bare <a href> in the exported HTML too, so the two are
    // indistinguishable once built. The difference only exists at runtime, where
    // the router intercepts the click and the navigation never becomes a
    // document navigation, so `@view-transition` never fires. Nothing else
    // breaks, which is exactly why this needs a guard.
    //
    // The import specifier rather than the bare string: the comment in the tile
    // explaining why the anchor is plain says the words "next/link", and a
    // substring search cannot tell an explanation from an import. Matching
    // `from 'next/link'` is the thing that actually changes the behaviour.
    const tile = readFileSync('src/components/project-tile.tsx', 'utf8');
    expect(tile, 'the tile imports next/link again, so the morph will not fire').not.toMatch(
      /from\s+['"]next\/link['"]/,
    );
    expect(body('out/index.html')).toContain('href="/projects/rollhaus/"');
  });
});
