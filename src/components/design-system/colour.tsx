import type { ReactNode } from 'react';
import type { SemanticColour } from '@/content/design-system';
import type { Token } from '@/lib/tokens';

/*
 * Primitive and Brand render from `token.value`, a value resolved at build
 * time. That is not a workaround for the token-discipline rules: those two
 * layers do not vary by theme (tokens.test.ts:23 asserts the dark file declares
 * neither), so a fixed value is the correct rendering. The value arrives as
 * build-time data and appears nowhere as a source literal, so the no-raw-hex
 * rule is untouched.
 */
function FixedSwatch({ value }: { value: string }) {
  return (
    <span
      aria-hidden="true"
      // The one inline style on the site, and it is the point rather than an
      // escape: this square is data. A utility class cannot express a value
      // that was read out of a file at build time, and minting a token for each
      // Primitive so Tailwind could render it would be a fourth layer.
      style={{ backgroundColor: value }}
      className="block size-10 shrink-0 rounded-control border border-border"
    />
  );
}

function Row({
  name,
  meta,
  children,
}: {
  name: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-center gap-gap">
      {children}
      <span className="min-w-0">
        <code className="block truncate text-meta">{name}</code>
        <span className="block text-meta text-muted">{meta}</span>
      </span>
    </li>
  );
}

export function FixedLayer({ tokens }: { tokens: readonly Token[] }) {
  return (
    <ul className="mt-gap grid gap-gap sm:grid-cols-2">
      {tokens.map((token) => (
        <Row
          key={token.name}
          name={token.name}
          // A Primitive is a leaf, so it shows its value. A Brand token shows
          // what it points at, which is the link in the chain worth seeing.
          meta={token.reference ?? token.value}
        >
          <FixedSwatch value={token.value} />
        </Row>
      ))}
    </ul>
  );
}

/*
 * The Semantic layer renders through the ordinary Tailwind utilities that
 * @theme inline generates. This is the identical mechanism every component on
 * the site uses: the class carries no colour, it references the Semantic
 * custom property, and [data-theme="dark"] re-declares that property. So this
 * row switches with the theme toggle through the cascade, with no client JS
 * added and no branch on theme anywhere.
 *
 * That difference is the page's argument, made by construction rather than
 * claimed in a sentence: hit the toggle and only this row moves.
 */
export function SemanticLayer({
  entries,
  tokens,
}: {
  entries: readonly SemanticColour[];
  tokens: readonly Token[];
}) {
  const byName = new Map(tokens.map((token) => [token.name, token]));

  return (
    <ul className="mt-gap grid gap-gap sm:grid-cols-2">
      {entries.map((entry) => {
        const token = byName.get(entry.token);
        return (
          <li key={entry.token} className="flex items-center gap-gap">
            <span
              aria-hidden="true"
              className={`block size-10 shrink-0 rounded-control border border-border ${entry.utility}`}
            />
            <span className="min-w-0">
              <code className="block truncate text-meta">{entry.token}</code>
              <span className="block text-meta text-muted">{entry.role}</span>
              {/*
                Both references, because this is the only layer that has two.
                Rendered from the data rather than authored, so a token that
                stops varying by theme loses its second line by itself.
              */}
              <span className="block text-meta text-muted">
                light {token?.reference} · dark {token?.darkReference}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
