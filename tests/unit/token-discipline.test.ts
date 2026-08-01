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

type Offence = {
  pattern: RegExp;
  why: string;
  // Paths this rule does not apply to, on top of the generated stylesheets.
  exempt?: (path: string) => boolean;
};

// Five ways application code actually escapes the Semantic layer.
const OFFENCES: Offence[] = [
  {
    pattern: /--ds-(?:primitive|brand)-[\w-]+/g,
    why: 'references a Primitive or Brand token directly',
  },
  {
    // A name composed at runtime evades a literal match:
    // style={{ background: `var(--ds-${layer}-${name})` }}
    pattern: /--ds-\$\{/g,
    why: 'composes a token name at runtime, which defeats this check',
  },
  {
    // The likelier failure is bypassing the token system altogether. Tailwind's
    // built-in palette is not part of the three layers at all.
    pattern:
      /\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|divide|shadow|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g,
    why: "uses Tailwind's built-in palette instead of a Semantic token",
  },
  {
    // Without this rule the test above means less than it looks: it bans
    // reaching past Semantic while waving through skipping the token system
    // outright. Exact hex lengths, so an English word that happens to be
    // hex-ish (#added) does not trip it. A guard that cries wolf gets disabled.
    pattern:
      /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b|\brgba?\(|\bhsla?\(/g,
    why: 'hardcodes a colour literal instead of using a Semantic token',
    // src/content/** is exempt because a diagram that depicts the Rollhaus
    // brand palette is *about* those colours. They are content, not styling.
    exempt: (path) => path.startsWith('src/content/'),
  },
  {
    // The four properties a type role carries alongside its size. Reaching for
    // one of them on its own composes a sixth role nobody named, which is
    // exactly how src/components/work-grid.tsx shipped an h2 without
    // `leading-tight` beside seven that had it, and nothing could catch it.
    //
    // text-balance is deliberately absent: wrapping is a hint about this
    // sentence, not a type decision the system should own. text-transform is
    // absent for the opposite reason: `type-eyebrow` already carries it.
    pattern:
      /\b(?:leading|tracking)-[\w.\[\]/-]+|\bfont-(?:serif|sans|mono|thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g,
    why: 'sets a type property outside a role',
  },
];

describe('token discipline', () => {
  it('never reaches past the Semantic layer from application code', () => {
    const files = SCANNED.flatMap((pattern) => globSync(pattern))
      .map((f) => f.replaceAll('\\', '/'))
      .filter((f) => !f.includes(GENERATED));

    // Guards against the whole test passing because the glob matched nothing.
    expect(files.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      for (const offence of OFFENCES) {
        if (offence.exempt?.(file)) continue;
        const hits = source.match(offence.pattern);
        if (hits) {
          violations.push(`${file} ${offence.why}: ${[...new Set(hits)].join(', ')}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
