import { describe, expect, it } from 'vitest';
import { CONTRAST_PAIRS as PAIRS } from '../../src/content/design-system';
import { composite, GAMUT, ratio as contrast } from '../../src/lib/contrast';
import { PEAK } from '../../src/lib/scrim';
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

/*
 * The pair the table above cannot hold, because one side of it is not a token.
 *
 * A project title sits on a scrim over a photograph, and the scrim is
 * translucent, so what the glyphs actually resolve against is the page
 * background diluted by whatever pixel the image put there. Every earlier
 * version of this component dodged that by making the scrim opaque under the
 * text, and the comment said the ratio was not computable at build time.
 *
 * It is computable, as a bound. The image cannot do worse than its most hostile
 * pixel, and in sRGB there are only two candidates for that: pure black, which
 * drags a light scrim down towards dark text, and pure white, which drags a dark
 * one up towards light text. Measure the theme against the one that hurts it and
 * the result holds for every photograph that could ever be dropped into the
 * grid, including the ones that are not in the repo yet.
 *
 * This is the guard that lets PEAK be a decision rather than a gamble. Lower it
 * far enough and this fails, which is the point: the AA floor is around 0.60,
 * and dark is the binding theme, which is not the intuitive answer.
 */
describe('the title scrim, bounded against any photograph', () => {
  /*
   * The scrim is dark in both themes, so the worst pixel is white in both: the
   * hostile one is whichever end of the gamut drags the veil towards the colour
   * of the text, and the text is light wherever you are. Black underneath only
   * makes a dark scrim darker, which helps.
   */
  const WORST = GAMUT.white;

  // Asserted rather than assumed, and this is the case that would catch someone
  // re-declaring either token in tokens/semantic/color.dark.json. Without it the
  // single bound below would quietly become a bound on the light theme only.
  it('holds the scrim and its text still while the theme moves', () => {
    for (const token of ['--ds-color-scrim', '--ds-color-on-scrim']) {
      expect(resolve(token, LIGHT), `${token} varies by theme`).toBe(resolve(token, DARK));
    }
    // Guards against the case above passing because everything is invariant,
    // which would mean the theme is broken rather than the scrim fixed.
    expect(resolve('--ds-color-bg', LIGHT)).not.toBe(resolve('--ds-color-bg', DARK));
  });

  it('clears 4.5:1 over the worst pixel an image could put under it', () => {
    const behind = composite(resolve('--ds-color-scrim', LIGHT), PEAK, WORST);
    const ratio = contrast(resolve('--ds-color-on-scrim', LIGHT), behind);
    expect(
      ratio,
      `at ${PEAK * 100}% the scrim resolves to ${behind} over ${WORST}, measuring ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(4.5);
  });

  // Without this the case above passes for a scrim that is simply opaque, which
  // is the version this replaced. The claim is that the image survives *and* the
  // text is legible, and only the pair of assertions says both.
  it('leaves the photograph visible rather than covering it', () => {
    expect(PEAK).toBeLessThan(1);
  });

  /*
   * What the peak is actually for, now that the title is the brand gold.
   *
   * Every earlier version of this file treated the peak as a taste setting with
   * a contrast consequence. It is the reverse: gold is a mid-tone, so the peak
   * is whatever makes gold survive a bright photograph, and the floor is a
   * number rather than a feeling.
   *
   * Searching for it rather than hardcoding it means the message below stays
   * true after a palette change. A previous case here asserted that gold *could
   * not* be the fill, which was correct at a 70% peak and became false at 90%.
   * The lesson is in the shape: assert the relationship, not the verdict.
   */
  it('sets the peak from what the title colour needs, with headroom', () => {
    const scrim = resolve('--ds-color-scrim', LIGHT);
    const title = resolve('--ds-color-on-scrim', LIGHT);

    let floor = 1;
    while (floor > 0 && contrast(title, composite(scrim, floor - 0.001, WORST)) >= 4.5) {
      floor -= 0.001;
    }

    expect(
      PEAK,
      `the title needs a peak of at least ${floor.toFixed(3)} to clear AA over a white pixel`,
    ).toBeGreaterThanOrEqual(floor);
  });
});
