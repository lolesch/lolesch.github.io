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
          <code className="text-meta">{token.name}</code>
          <span className="text-meta text-muted">{token.value}</span>
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
            leading-tight so the largest step does not open a gap the ramp does
            not have. The specimen is the token name itself, which keeps the
            label and the sample the same object.
          */}
          <span style={{ fontSize: token.value }} className="font-serif leading-tight">
            {token.name.replace('--ds-text-', '')}
          </span>
          <span className="text-meta text-muted">{token.value}</span>
        </li>
      ))}
    </ul>
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
          <code className="mt-tight block text-meta">{token.name}</code>
          <span className="block text-meta text-muted">{token.value}</span>
        </li>
      ))}
    </ul>
  );
}
