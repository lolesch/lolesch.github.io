import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The generated stylesheets are where Primitive and Brand legitimately live.
const GENERATED = 'src/styles/generated/';

const SCANNED = [
  'src/**/*.{ts,tsx,js,jsx,mjs,mts,css,svg,json,md,mdx}',
  // public/ is served verbatim, so anything here reaches the browser without
  // passing through a build step that could catch it.
  'public/**/*.{css,svg,js,html}',
];

// Three ways application code actually escapes the Semantic layer.
const OFFENCES: Array<[RegExp, string]> = [
  [/--ds-(?:primitive|brand)-[\w-]+/g, 'references a Primitive or Brand token directly'],
  // A name composed at runtime evades a literal match:
  // style={{ background: `var(--ds-${layer}-${name})` }}
  [/--ds-\$\{/g, 'composes a token name at runtime, which defeats this check'],
  // The likelier failure is bypassing the token system altogether. Tailwind's
  // built-in palette is not part of the three layers at all.
  [
    /\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|divide|shadow|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g,
    "uses Tailwind's built-in palette instead of a Semantic token",
  ],
];

describe('token discipline', () => {
  it('never reaches past the Semantic layer from application code', () => {
    const files = SCANNED.flatMap((pattern) => globSync(pattern)).filter(
      (f) => !f.replaceAll('\\', '/').includes(GENERATED),
    );

    // Guards against the whole test passing because the glob matched nothing.
    expect(files.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      for (const [pattern, why] of OFFENCES) {
        const hits = source.match(pattern);
        if (hits) {
          violations.push(`${file} ${why}: ${[...new Set(hits)].join(', ')}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
