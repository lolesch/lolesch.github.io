import { describe, expect, it } from 'vitest';
import { projects } from '../../src/content/projects';
import { body } from './rendered';

/*
 * The spec's opening measurement was that two of eight Semantic colours
 * rendered nowhere outside their own swatch on /design-system, which made the
 * restraint line on that page false about a quarter of its own colour set.
 * These are the cases that stop that being true again: they assert the two
 * accents reach a page a visitor reads, not that they look like anything.
 */
describe('the accents render outside /design-system', () => {
  it('puts the capability role on the lens chips in the work grid', () => {
    expect(body('out/index.html')).toContain('text-capability');
  });

  for (const project of projects) {
    it(`puts the capability role on the lens chips of ${project.slug}`, () => {
      expect(body(`out/projects/${project.slug}/index.html`)).toContain('text-capability');
    });
  }

  it('puts the accent role on the contact links', () => {
    expect(body('out/about/index.html')).toContain('text-accent');
  });

  it('puts the accent role on the way back out of a project page', () => {
    expect(body(`out/projects/${projects[0].slug}/index.html`)).toContain('text-accent');
  });
});
