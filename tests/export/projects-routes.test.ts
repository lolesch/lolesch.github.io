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

      // A section link is the one piece of evidence on these pages that lives
      // on someone else's domain, so the markup is all this suite can prove.
      // Whether the URL still resolves is a manual check, and the CV guard
      // lesson from 2026-07-31 is why it stays on the release checklist: a link
      // fails invisibly while the markup around it stays perfect.
      const links = project.sections.flatMap((section) =>
        section.kind === 'prose' && section.link ? [section.link] : [],
      );

      for (const link of links) {
        describe(link.href, () => {
          // React escapes `&` inside an attribute, so the URL in the markup is
          // not the URL on the record. Encoding the needle is the narrow fix;
          // decoding the whole document instead would turn any escaped angle
          // bracket in the page copy into markup this regex could match.
          const attribute = link.href.replace(/&/g, '&amp;');
          const pattern = new RegExp(
            `<a[^>]*href="${attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`,
          );
          const tag = () => rendered(page).match(pattern)?.[0] ?? '';

          it('renders as an anchor carrying its label', () => {
            expect(tag(), `no link to ${link.href}`).not.toBe('');
            expect(text(page)).toContain(link.label);
          });

          it('opens in a new tab, so the case study is not replaced by it', () => {
            // Same call the CV link makes. A reader part-way through a page
            // should not lose it to a prototype they wanted to glance at.
            expect(tag()).toContain('target="_blank"');
            expect(tag()).toContain('noopener');
          });
        });
      }
    });
  }
});
