import { describe, expect, it } from 'vitest';
import { CONTRAST_PAIRS as PAIRS } from '../../src/content/design-system';
import { ratio as contrast } from '../../src/lib/contrast';
import { darkVars, lightVars, resolve } from '../../src/lib/tokens';

const LIGHT = lightVars();
const DARK = darkVars();

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
