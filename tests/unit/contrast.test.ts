import { describe, expect, it } from 'vitest';
import { ratio as contrast } from '../../src/lib/contrast';
import { darkVars, lightVars, resolve } from '../../src/lib/tokens';

const LIGHT = lightVars();
const DARK = darkVars();

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
  {
    fg: '--ds-color-border-media',
    bg: '--ds-color-bg',
    min: 3,
    // Design intent, not a WCAG requirement, and the distinction is recorded
    // rather than blurred: SC 1.4.11 governs controls and meaningful graphics,
    // and a decorative frame around a photograph is neither. Held at 3:1 anyway
    // so a Brand change cannot quietly erase the ring, which is the whole
    // reason the token exists.
    role: 'media frame (design intent, not SC 1.4.11)',
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
