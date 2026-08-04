import type { TypeRole } from '@/content/design-system';
import type { Token } from '@/lib/tokens';

/*
 * Specimens rather than numbers. Each of these renders the token at the size it
 * actually produces, using the resolved value as an inline width or font-size
 * for the same reason the fixed swatches do: the value is build-time data, and
 * none of these three families varies by theme.
 */

export function SpaceScale({ tokens }: { tokens: readonly Token[] }) {
  return (
    <ul className="mt-gap space-y-tight">
      {tokens.map((token) => (
        <li key={token.name} className="flex items-center gap-gap">
          <span
            aria-hidden="true"
            style={{ width: token.value }}
            className="block h-4 shrink-0 bg-accent"
          />
          <code className="type-code">{token.name}</code>
          <span className="type-meta text-muted">{token.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function TypeScale({ tokens }: { tokens: readonly Token[] }) {
  return (
    <ul className="mt-gap space-y-tight">
      {tokens.map((token) => (
        <li key={token.name} className="flex flex-wrap items-baseline gap-gap">
          {/*
            Set in the heading role and sized by the token being shown, which is
            the only inline style on this page that overrides a role. The ramp is
            a set of sizes, so a specimen has to take its size from the data and
            everything else from somewhere; taking the rest from a role is what
            stops this component improvising a sixth one.
          */}
          <span style={{ fontSize: token.value }} className="type-heading">
            {token.name.replace('--ds-text-', '')}
          </span>
          <span className="type-meta text-muted">{token.value}</span>
        </li>
      ))}
    </ul>
  );
}

/*
 * The roles, each rendered through its own utility. This is the type half of
 * what the Semantic colour row does: the specimen is not described, it is set.
 *
 * Split in two on 2026-08-04. Every role used to print its five token
 * properties directly underneath it, which is eleven roles times five lines of
 * token names, and it was roughly a third of the page. The specimen and the job
 * stay here, because showing the scale *is* the design work. The properties move
 * into TypeRoleProperties below, behind a disclosure, where they are still proof
 * and no longer the thing a reader has to scroll past.
 */
export function TypeRoles({ roles }: { roles: readonly TypeRole[] }) {
  return (
    <ul className="mt-gap space-y-gap">
      {roles.map((entry) => (
        <li key={entry.role}>
          <p className={entry.utility}>{entry.role}</p>
          <p className="mt-tight type-meta text-muted">{entry.job}</p>
        </li>
      ))}
    </ul>
  );
}

/*
 * What each role actually sets, read out of the generated CSS. A role that gains
 * or loses a property says so here with no edit, which is the claim the intro
 * makes about the whole page.
 *
 * A table rather than the old per-role list, because behind a disclosure the
 * reader who opens it is comparing roles against each other. That is the
 * question the shape should answer, and eleven separate lists answered a
 * different one.
 */
export function TypeRoleProperties({
  roles,
  tokens,
}: {
  roles: readonly TypeRole[];
  tokens: readonly Token[];
}) {
  return (
    // Scrolls inside itself rather than widening the page. Five columns of token
    // references do not fit a phone and never will.
    <div className="mt-gap overflow-x-auto">
      <table className="w-full text-left type-meta text-muted">
        <thead>
          <tr>
            <th scope="col" className="pe-gap pb-tight">
              Role
            </th>
            <th scope="col" className="pe-gap pb-tight">
              Sets
            </th>
          </tr>
        </thead>
        <tbody>
          {roles.map((entry) => (
            <tr key={entry.role} className="border-t border-border">
              <th scope="row" className="pe-gap py-tight align-top">
                <code className="type-code">{entry.role}</code>
              </th>
              <td className="py-tight">
                <ul className="flex flex-wrap gap-gap">
                  {tokens
                    .filter((token) => token.name.startsWith(`--ds-type-${entry.role}-`))
                    .map((token) => (
                      <li key={token.name}>
                        <code className="type-code">
                          {token.name.replace(`--ds-type-${entry.role}-`, '')}
                        </code>{' '}
                        {token.reference ?? token.value}
                      </li>
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RadiusScale({ tokens }: { tokens: readonly Token[] }) {
  return (
    <ul className="mt-gap flex flex-wrap gap-gap">
      {tokens.map((token) => (
        <li key={token.name}>
          <span
            aria-hidden="true"
            style={{ borderRadius: token.value }}
            className="block size-20 border border-border-interactive"
          />
          <code className="mt-tight block type-code">{token.name}</code>
          <span className="block type-meta text-muted">{token.value}</span>
        </li>
      ))}
    </ul>
  );
}
