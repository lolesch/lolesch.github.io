import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { projects } from '../../src/content/projects';
import { body, rendered } from './rendered';

describe('work routes (Seam 2)', () => {
  for (const project of projects) {
    describe(project.slug, () => {
      const page = `out/work/${project.slug}/index.html`;

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
        expect(rendered('out/index.html')).toContain(`href="/work/${project.slug}/"`);
      });

      it('does not restate the tile lines the visitor just read', () => {
        // The no-repeat rule checked against the artifact rather than the data,
        // so a page that hardcodes a tile line outside the content model is
        // caught too. Scoped to <body>, because the meta description in <head>
        // reuses the Problem line on purpose.
        const visible = body(page);
        for (const line of [project.problem, project.whatIDid, project.whatChanged]) {
          expect(visible, `${project.slug} restates a tile line on its page`).not.toContain(line);
        }
      });
    });
  }
});
