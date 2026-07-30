import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const declarations = (css: string) => {
  const out = new Map<string, string>();
  for (const match of css.matchAll(/(--ds-[\w-]+):\s*([^;]+);/g)) {
    out.set(match[1], match[2].trim());
  }
  return out;
};

const LIGHT = declarations(readFileSync('src/styles/generated/tokens.css', 'utf8'));

// Dark re-declares only the Semantic layer, so it layers over light rather than
// replacing it. That is exactly what the CSS cascade does at runtime.
const DARK = new Map([
  ...LIGHT,
  ...declarations(readFileSync('src/styles/generated/tokens.dark.css', 'utf8')),
]);

// Walks the Primitive -> Brand -> Semantic chain the way a browser would.
const resolve = (name: string, vars: Map<string, string>): string => {
  const value = vars.get(name);
  if (value === undefined) throw new Error(`${name} is not declared in the generated tokens`);
  const reference = value.match(/^var\((--[\w-]+)\)$/);
  return reference ? resolve(reference[1], vars) : value;
};

const luminance = (hex: string) => {
  const digits = hex.trim().replace('#', '');
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits;
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Every pair the site actually renders. A token pair that nothing renders is
// not listed, because an unrendered pair passing tells you nothing.
//
// Measured 2026-07-30 and deliberately absent: --ds-color-muted on
// --ds-color-surface is 4.40:1 in light, under AA, and
// --ds-color-border-interactive on surface is 3.08:1 in dark. Nothing renders
// on surface today, which is why tiles are bordered rather than filled. Add
// both pairs here the moment something does.
const PAIRS = [
  { fg: '--ds-color-fg', bg: '--ds-color-bg', min: 4.5, role: 'body text' },
  { fg: '--ds-color-muted', bg: '--ds-color-bg', min: 4.5, role: 'metadata text' },
  { fg: '--ds-color-accent', bg: '--ds-color-bg', min: 4.5, role: 'accent text' },
  {
    fg: '--ds-color-border-interactive',
    bg: '--ds-color-bg',
    min: 3,
    role: 'control boundary (SC 1.4.11)',
  },
] as const;

const THEMES = [
  ['light', LIGHT],
  ['dark', DARK],
] as const;

describe('contrast (WCAG 2.2 AA)', () => {
  for (const [theme, vars] of THEMES) {
    for (const pair of PAIRS) {
      it(`${theme}: ${pair.role} clears ${pair.min}:1`, () => {
        const ratio = contrast(resolve(pair.fg, vars), resolve(pair.bg, vars));
        expect(
          ratio,
          `${pair.fg} on ${pair.bg} measured ${ratio.toFixed(2)}:1 in ${theme}`,
        ).toBeGreaterThanOrEqual(pair.min);
      });
    }
  }
});
