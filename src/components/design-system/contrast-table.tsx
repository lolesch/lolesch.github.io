import { CONTRAST_PAIRS } from '@/content/design-system';
import { ratio } from '@/lib/contrast';
import { darkVars, lightVars, resolve } from '@/lib/tokens';

/*
 * Measured here, at build time, by the same function tests/unit/contrast.test.ts
 * calls. Not transcribed: a number typed into a table is a claim about the
 * system, and a number computed from it is a reading of the system.
 */
export function ContrastTable() {
  const themes = [
    ['Light', lightVars()],
    ['Dark', darkVars()],
  ] as const;

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
