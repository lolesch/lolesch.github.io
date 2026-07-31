import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { designSystem, SEMANTIC_COLOURS } from '../../src/content/design-system';
import { body, rendered, text } from './rendered';

const PAGE = 'out/design-system/index.html';

describe('design-system route (Seam 2)', () => {
  it('exports an index.html', () => {
    expect(existsSync(PAGE), `${PAGE} was not exported`).toBe(true);
  });

  it('carries the page title as its h1', () => {
    const h1 = rendered(PAGE).match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
    expect(h1).toContain('Design System');
  });

  it('renders the intro and every section heading', () => {
    const visible = text(PAGE);
    expect(visible).toContain(designSystem.intro);
    for (const section of [
      designSystem.layers,
      designSystem.families,
      designSystem.rules,
      designSystem.contrast,
      designSystem.built,
    ]) {
      expect(visible, `the "${section.heading}" section is missing`).toContain(section.heading);
    }
  });

  it('carries the restraint line, which is a decision rather than a caption', () => {
    expect(text(PAGE)).toContain(designSystem.restraint);
  });

  // Spec decision 2. The sync is deferred, so the page does not mention it: not
  // as a limitation, not as a roadmap marker. Asserted rather than trusted,
  // because this is the kind of line a future edit adds back helpfully.
  it('says nothing about Figma', () => {
    expect(text(PAGE).toLowerCase()).not.toContain('figma');
  });
});

describe('the data step actually ran', () => {
  // THE load-bearing assertion on this page. A data step that returned an empty
  // array still renders every heading and every empty box without complaint, so
  // asserting a heading proves nothing about the thing this route claims. This
  // hex is a resolved Primitive: it exists in the markup only if the build-time
  // read, the var() walk and the render all happened.
  //
  // Hardcoded rather than computed from readTokens(). Reading it from the same
  // source the page read would assert the page agrees with itself, which it
  // always will. tests/unit/design-system.test.ts is what ties this value to
  // the generated CSS.
  it('renders a resolved Primitive value', () => {
    expect(body(PAGE)).toContain('#b45309');
  });

  it('renders the Semantic layer through its Tailwind utility, not a fixed value', () => {
    // The adapter path, which is the other half of the argument: this class
    // carries no colour, it points at the token, and the dark block re-declares
    // the token. Finding it in the markup proves the Semantic row is live.
    const accent = SEMANTIC_COLOURS.find((entry) => entry.token === '--ds-color-accent');
    expect(body(PAGE)).toContain(accent!.utility);
  });

  it('renders every documented Semantic utility', () => {
    const visible = body(PAGE);
    for (const entry of SEMANTIC_COLOURS) {
      expect(visible, `${entry.token} is documented but its swatch is missing`).toContain(
        entry.utility,
      );
    }
  });
});
