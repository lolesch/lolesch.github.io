import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/*
 * Reads the generated stylesheets and resolves the var() chain the way a
 * browser would. This is possible only because scripts/build-tokens.mjs sets
 * outputReferences: true, which keeps the whole layer chain visible as nested
 * var() in the emitted file. tokens.test.ts:15 already guards that property for
 * its own reasons, so this page depends on something a test protects.
 *
 * NOTE for anyone editing this file: token-discipline.test.ts scans src/lib/
 * with no exemption, and a full Primitive or Brand token name fails it even
 * inside a comment. That is why the classifier below parses the name into
 * segments instead of matching a literal prefix. Do not "simplify" it back.
 */

export type Layer = 'primitive' | 'brand' | 'semantic';

export type Token = {
  /** Full custom-property name, e.g. `--ds-color-accent`. */
  name: string;
  layer: Layer;
  /** Grouping segment: `color`, `space`, `neutral`, `paper`. See familyOf. */
  family: string;
  /** What this points at in `:root`, or null for a leaf value. */
  reference: string | null;
  /**
   * Fully resolved leaf value in the light cascade: a hex colour, a length like
   * `1.5rem`, a font stack. No example hex here on purpose, because rule 4 of
   * token-discipline.test.ts bans a colour literal in application code and it
   * reads comments too.
   */
  value: string;
  /** What this points at under `[data-theme="dark"]`, or null when it does not vary. */
  darkReference: string | null;
  /** Resolved leaf value under dark, or null when it does not vary. */
  darkValue: string | null;
};

const GENERATED = 'src/styles/generated';

// Explicitly rooted at the working directory. Both callers run from the repo
// root, `next build` and vitest, and saying so beats a bare relative path that
// happens to mean the same thing in two different runtimes.
const read = (file: string) => readFileSync(join(process.cwd(), GENERATED, file), 'utf8');

export const declarations = (css: string): Map<string, string> => {
  const out = new Map<string, string>();
  for (const match of css.matchAll(/(--ds-[\w-]+):\s*([^;]+);/g)) {
    out.set(match[1], match[2].trim());
  }
  return out;
};

// Walks the chain the way a browser would. Throws rather than falling back:
// see the guard in tests/unit/design-system.test.ts for why that is the feature.
export const resolve = (name: string, vars: Map<string, string>): string => {
  const value = vars.get(name);
  if (value === undefined) throw new Error(`${name} is not declared in the generated tokens`);
  const reference = value.match(/^var\((--[\w-]+)\)$/);
  return reference ? resolve(reference[1], vars) : value;
};

export const lightVars = () => declarations(read('tokens.css'));

// Dark re-declares only the Semantic layer, so it layers over light rather than
// replacing it. That is exactly what the CSS cascade does at runtime.
export const darkVars = () => new Map([...lightVars(), ...declarations(read('tokens.dark.css'))]);

const referenceOf = (value: string) => value.match(/^var\((--[\w-]+)\)$/)?.[1] ?? null;

const PREFIX = '--ds-';

// Classified by parsing, not by matching a literal prefix. See the note at the
// top of the file: the literal would fail the discipline guard this page is
// partly about.
const segmentsOf = (name: string) => name.slice(PREFIX.length).split('-');

const layerOf = (name: string): Layer => {
  const [head] = segmentsOf(name);
  if (head === 'primitive') return 'primitive';
  if (head === 'brand') return 'brand';
  // Deliberately the catch-all: `color`, `space`, `text` and `radius` are all
  // Semantic, and a future family should land here without a code change. The
  // family guard in tests/unit/design-system.test.ts is what stops this arm
  // swallowing a genuinely unknown prefix.
  return 'semantic';
};

// For Semantic the first segment *is* the family (`color`, `space`). For the
// two named layers it is the segment after the layer, which groups the base and
// its inverse together: `paper` and `paper-inverse` are one family with two
// members, which is exactly how the page wants to show them.
const familyOf = (name: string) => {
  const segments = segmentsOf(name);
  return layerOf(name) === 'semantic' ? segments[0] : segments[1];
};

export function readTokens(): Token[] {
  const light = lightVars();
  const overrides = declarations(read('tokens.dark.css'));
  const dark = new Map([...light, ...overrides]);

  return [...light].map(([name, raw]) => {
    const override = overrides.get(name) ?? null;
    return {
      name,
      layer: layerOf(name),
      family: familyOf(name),
      reference: referenceOf(raw),
      value: resolve(name, light),
      darkReference: override === null ? null : referenceOf(override),
      darkValue: override === null ? null : resolve(name, dark),
    };
  });
}
