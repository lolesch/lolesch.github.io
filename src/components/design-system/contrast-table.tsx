import { CONTRAST_PAIRS } from '@/content/design-system';
import { composite, GAMUT, ratio } from '@/lib/contrast';
import { PEAK } from '@/lib/scrim';
import { darkVars, lightVars, resolve } from '@/lib/tokens';

const THEMES = [
  ['Light', lightVars()],
  ['Dark', darkVars()],
] as const;

/*
 * Measured here, at build time, by the same function tests/unit/contrast.test.ts
 * calls. Not transcribed: a number typed into a table is a claim about the
 * system, and a number computed from it is a reading of the system.
 */
export function ContrastTable() {
  const themes = THEMES;

  const rows = CONTRAST_PAIRS.map((pair) => ({
    pair,
    measured: themes.map(
      ([theme, vars]) => [theme, ratio(resolve(pair.fg, vars), resolve(pair.bg, vars))] as const,
    ),
  }));

  return (
    // overflow-x-auto so a narrow viewport scrolls the table rather than the
    // page. Three columns is the minimum this can be and still say anything.
    <div className="mt-gap overflow-x-auto">
      <table className="w-full border-collapse type-body">
        <thead>
          {/* type-meta carries weight 400, so the browser's bold th is reset by
              the role rather than by a separate weight class beside it. The
              class it replaced cannot be named here: the rule coming in the
              next commit bans the literal, and it reads comments. */}
          <tr className="border-b border-border text-left type-meta text-muted">
            <th scope="col" className="py-tight pr-gap">
              Pair
            </th>
            <th scope="col" className="py-tight pr-gap">
              Required
            </th>
            {themes.map(([theme]) => (
              <th key={theme} scope="col" className="py-tight pr-gap">
                {theme}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ pair, measured }) => (
            <tr key={pair.role} className="border-b border-border align-top">
              <th scope="row" className="py-tight pr-gap type-body">
                {pair.role}
              </th>
              <td className="py-tight pr-gap text-muted">{pair.min}:1</td>
              {measured.map(([theme, value]) => (
                <td key={theme} className="py-tight pr-gap">
                  {value.toFixed(2)}:1
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/*
 * The scrim bound, computed here rather than stated.
 *
 * It sits outside the table above because it is not the same kind of row: every
 * pair up there is two tokens, and one side of this one is a hypothetical pixel.
 * Putting it in the table would make it look measured the same way, and the
 * difference between a measurement and a bound is the whole reason this can be
 * on the page at all.
 *
 * The worst pixel is the one that pulls the composite towards the text colour,
 * which is black under a light scrim and white under a dark one. Note which
 * theme is tighter: it is dark, which is not the guess most people make.
 */
export function ScrimBound() {
  const [light, dark] = THEMES.map(([, vars]) => vars);

  /*
   * One row, not one per theme, and the single row is the claim.
   *
   * The scrim and the type on it are the two Semantic colours that do not follow
   * the theme, so the composite underneath the title is the same in both and
   * there is one ratio rather than two that happen to agree. A two-row table
   * printing the same number twice would look like a bug and would be arguing
   * for something weaker than what is true.
   *
   * The invariance is read from the tokens here rather than assumed, so if
   * either one ever gains a dark override this stops claiming both themes. The
   * unit guard fails in that case too, which is where it should be caught first.
   */
  const invariant =
    resolve('--ds-color-scrim', light) === resolve('--ds-color-scrim', dark) &&
    resolve('--ds-color-on-scrim', light) === resolve('--ds-color-on-scrim', dark);

  const behind = composite(resolve('--ds-color-scrim', light), PEAK, GAMUT.white);
  const measured = ratio(resolve('--ds-color-on-scrim', light), behind);

  return (
    <div className="mt-gap overflow-x-auto">
      <table className="w-full border-collapse type-body">
        <caption className="pb-tight text-left type-meta text-muted">
          A title over a thumbnail, with the scrim at {Math.round(PEAK * 100)}% and the worst pixel
          an image could put beneath it.{' '}
          {invariant
            ? 'One row, because the scrim and its text are the two roles that do not follow the theme.'
            : 'The scrim now varies by theme, so this row describes light only.'}
        </caption>
        <thead>
          <tr className="border-b border-border text-left type-meta text-muted">
            <th scope="col" className="py-tight pr-gap">
              Pair
            </th>
            <th scope="col" className="py-tight pr-gap">
              Worst pixel
            </th>
            <th scope="col" className="py-tight pr-gap">
              Required
            </th>
            <th scope="col" className="py-tight pr-gap">
              Bound
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border align-top">
            <th scope="row" className="py-tight pr-gap type-body">
              title on a scrim
            </th>
            <td className="py-tight pr-gap text-muted type-code">{GAMUT.white}</td>
            <td className="py-tight pr-gap text-muted">4.5:1</td>
            <td className="py-tight pr-gap">{measured.toFixed(2)}:1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
