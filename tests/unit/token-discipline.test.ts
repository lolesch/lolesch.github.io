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
    //
    // src/lib/contrast.ts is exempt for a different reason and it is the
    // narrower one: it declares the two ends of the sRGB gamut, which the scrim
    // bound needs in order to say "no photograph can do worse than this". Black
    // and white there are not colours anything renders and not decisions anyone
    // made; they are where the colour space stops. The exemption is one file
    // rather than a directory precisely because that argument does not
    // generalise.
    exempt: (path) => path.startsWith('src/content/') || path.endsWith('src/lib/contrast.ts'),
  },
  {
    // The four properties a type role carries alongside its size. Reaching for
    // one of them on its own composes a sixth role nobody named, which is
    // exactly how src/components/project-grid.tsx shipped an h2 without
    // `leading-tight` beside seven that had it, and nothing could catch it.
    //
    // text-balance is deliberately absent: wrapping is a hint about this
    // sentence, not a type decision the system should own. text-transform is
    // absent for the opposite reason: `type-eyebrow` already carries it.
    pattern:
      /\b(?:leading|tracking)-[\w.\[\]/-]+|\bfont-(?:serif|sans|mono|thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g,
    why: 'sets a type property outside a role',
  },
  {
    // The same failure as the rule above, one family across. `motion-state`
    // carries the duration and the curve together, and the two are only a tempo
    // when they arrive together: a call site that takes `duration-200` and
    // forgets the easing has invented a second tempo, and nothing looks wrong
    // until there are four of them.
    //
    // `transition-*` is deliberately absent. Which property moves is the
    // component's decision, not the system's, so the card naming
    // `transition-colors` and the thumbnail naming `transition-transform` are
    // both correct and both have to stay sayable.
    //
    // Both halves are narrower than they look, and the first draft was not.
    // `duration-[\w-]+` and a bare `ease-[\w-]+` caught the phrase "ease-out
    // curve" in a comment in src/lib/scrim.ts, which is prose about a curve and
    // not a class. So `duration-` has to be followed by the number or the
    // bracket a real utility carries, and the easing arm names Tailwind's four
    // built-ins outright. Those are the only easings reachable here anyway,
    // because the adapter in globals.css deliberately does not bridge the token
    // to an `ease-*` utility. "ease-out" in running text still collides and that
    // is accepted: it is one phrase, against rule four's warning that a guard
    // which cries wolf is a guard someone deletes.
    pattern: /\bduration-(?:\d|\[)[\w.\[\]/-]*|\bease-(?:linear|in-out|in|out|initial|\[)[\w.\[\]/-]*/g,
    why: 'sets a duration or an easing outside the motion role',
    // globals.css is where the role is defined, the same way it is the only
    // file allowed to name a type token.
    exempt: (path) => path.endsWith('src/app/globals.css'),
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
