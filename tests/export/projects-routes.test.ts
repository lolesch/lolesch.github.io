import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { projects } from '../../src/content/projects';
import { rendered, text } from './rendered';

describe('project routes (Seam 2)', () => {
  for (const project of projects) {
    describe(project.slug, () => {
      const page = `out/projects/${project.slug}/index.html`;

      it('exports an index.html', () => {
        expect(existsSync(page), `${page} was not exported`).toBe(true);
      });

      it('carries the project title as its h1', () => {
        // Read the <h1> specifically. The title is also in <title> and in the
        // meta description, so a document-wide check passes with no page.
        const h1 = rendered(page).match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
        expect(h1).toContain(project.title);
      });

      it('is linked from the home page', () => {
        expect(rendered('out/index.html')).toContain(`href="/projects/${project.slug}/"`);
      });

      it('opens with the three schema lines the card no longer carries', () => {
        // The inverse of the rule this guard held until 2026-07-31. The card
        // used to carry these lines, so the page skipped them; the card now
        // carries a summary and a thumbnail instead, which makes the page the
        // only place they exist. Losing them here would reintroduce exactly the
        // failure CONTEXT.md records the Tile Schema to prevent.
        const visible = text(page);
        for (const line of [project.problem, project.whatIDid, project.whatChanged]) {
          expect(visible, `${project.slug} drops a schema line`).toContain(line);
        }
      });
    });
  }
});
