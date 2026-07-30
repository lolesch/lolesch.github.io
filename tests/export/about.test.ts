import { existsSync, globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { about } from '../../src/content/about';
import { body, rendered, text } from './rendered';

const PAGE = 'out/about/index.html';

// href values carry dots and slashes. Escaped so a regex built from one matches
// the literal string rather than nearly it.
const literal = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('about route (Seam 2)', () => {
  it('exports an index.html', () => {
    expect(existsSync(PAGE), `${PAGE} was not exported`).toBe(true);
  });

  it('carries the page title as its h1', () => {
    // Read the <h1> specifically. "About" is also in <title> and in the nav, so
    // a document-wide check passes with no page.
    const h1 = rendered(PAGE).match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
    expect(h1).toContain('About');
  });

  it('renders the intro and every section heading', () => {
    // Decoded, so this compares whole sentences against the copy as authored
    // rather than an apostrophe-free fragment of one.
    const visible = text(PAGE);
    expect(visible).toContain(about.intro);
    for (const section of about.sections) {
      expect(visible, `the "${section.heading}" section is missing`).toContain(section.heading);
    }
  });
});

describe('the portrait', () => {
  it('carries its alt text, which is the copy a screen reader gets', () => {
    expect(text(PAGE)).toContain(about.portrait.alt);
  });

  it('points at a file that actually shipped', () => {
    // Following the src to disk is the point. Asserting only that an <img> is
    // present stays green over a 404, which is the only way an image fails.
    expect(
      existsSync(`out${about.portrait.src}`),
      `${about.portrait.src} is linked but not exported`,
    ).toBe(true);
  });

  it("is not lazy-loaded, because it is this route's LCP candidate", () => {
    const tag =
      body(PAGE).match(new RegExp(`<img[^>]*${literal(about.portrait.src)}[^>]*>`))?.[0] ?? '';
    expect(tag, `no <img> found for ${about.portrait.src}`).not.toBe('');
    expect(tag).not.toContain('loading="lazy"');
  });
});

describe('contact', () => {
  it('ships every contact link with a real accessible name', () => {
    const visible = body(PAGE);
    for (const link of about.contact) {
      const match = visible.match(
        new RegExp(`<a[^>]*href="${literal(link.href)}"[^>]*>([\\s\\S]*?)</a>`),
      );
      expect(match, `no link to ${link.href}`).not.toBeNull();
      expect(
        match![1].trim().length,
        `the ${link.label} link has no accessible name`,
      ).toBeGreaterThan(0);
    }
  });

  it('mails the verified address, character for character', () => {
    // Hardcoded rather than read from about.contact. Reading it from the data
    // the page was built from would assert that the page agrees with itself,
    // which it always will. This asserts it agrees with the shipped CVs.
    expect(body(PAGE)).toContain('href="mailto:leonid.schreiber@yahoo.de"');
  });

  it('sends every off-site link out with rel="noopener noreferrer"', () => {
    const visible = body(PAGE);
    for (const link of about.contact.filter((l) => l.external)) {
      const tag = visible.match(new RegExp(`<a[^>]*href="${literal(link.href)}"[^>]*>`))?.[0] ?? '';
      expect(tag, `no link to ${link.href}`).not.toBe('');
      expect(tag, `${link.label} leaves the site without rel`).toContain('noopener noreferrer');
    }
  });
});

describe('the CV link', () => {
  const cv = about.cv;

  // Skipped rather than absent while about.cv is null. A skipped case is
  // visible in the run and comes back on its own the moment the record is
  // filled; a case that does not exist yet has to be remembered.
  it.skipIf(!cv)('links a file that actually shipped', () => {
    expect(existsSync(`out${cv!.href}`), `${cv!.href} is linked but not exported`).toBe(true);
  });

  it.skipIf(!cv)('opens in a new tab, so a PDF never replaces the site', () => {
    const tag = body(PAGE).match(new RegExp(`<a[^>]*href="${literal(cv!.href)}"[^>]*>`))?.[0] ?? '';
    expect(tag, `no link to ${cv!.href}`).not.toBe('');
    expect(tag).toContain('target="_blank"');
    expect(tag).toContain('noopener noreferrer');
  });
});

describe('site navigation', () => {
  // Globbed rather than checked on Home. The nav lives in the layout, so a
  // regression drops it from every page at once, and a Home-only check would
  // not see that. The 404 pages carry the header too and are included on
  // purpose: a visitor who lands on one needs the way out most.
  const pages = globSync('out/**/*.html');

  it('has pages to check, so the cases below are not vacuous', () => {
    expect(pages.length).toBeGreaterThan(3);
  });

  for (const page of pages) {
    it(`${page} carries both nav links`, () => {
      const visible = body(page);
      expect(visible, 'no Work link').toContain('href="/#work"');
      expect(visible, 'no About link').toContain('href="/about/"');
    });
  }

  it('marks About as the current page there, and nowhere else', () => {
    expect(body(PAGE)).toContain('aria-current="page"');
    // Work is a fragment link into Home, which has no unambiguous current
    // state, so Home marks nothing.
    expect(body('out/index.html')).not.toContain('aria-current="page"');
  });
});
