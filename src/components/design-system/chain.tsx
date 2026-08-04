import type { Token } from '@/lib/tokens';

/**
 * One colour, traced through all three layers.
 *
 * Added 2026-08-04, replacing 28 swatches in the scan path. The grids are still
 * on the page behind a disclosure, and they were answering the wrong question:
 * they showed *what exists*, and the argument the section makes is about
 * *direction*. One value followed from the role that uses it down to the number
 * it resolves to shows the direction in a way a grid of squares cannot.
 *
 * Walks `token.reference` rather than taking a list, so it cannot fall out of
 * step with the generated CSS, and so this file names no Primitive or Brand
 * token: rule 1 of tests/unit/token-discipline.test.ts bans those literals in
 * application code and it reads comments too.
 */
export function TokenChain({ from, tokens }: { from: string; tokens: readonly Token[] }) {
  const byName = new Map(tokens.map((token) => [token.name, token]));

  const steps: Token[] = [];
  let step = byName.get(from);
  // Terminates on a leaf, whose `reference` is null. A cycle would hang this,
  // and cannot occur: Style Dictionary rejects one before it ever emits a file.
  while (step) {
    steps.push(step);
    step = step.reference ? byName.get(step.reference) : undefined;
  }

  const leaf = steps.at(-1);

  return (
    <ol className="mt-gap flex flex-wrap items-stretch gap-gap">
      {steps.map((token, index) => (
        <li key={token.name} className="flex items-center gap-gap">
          <span className="rounded-card border border-border p-gutter">
            <span className="block type-eyebrow text-muted">{token.layer}</span>
            <code className="mt-tight block type-code">{token.name}</code>
            {/*
              The leaf shows the number it resolves to. The two above it show
              nothing extra on purpose: their value is identical, and printing it
              three times would suggest three values rather than three names for
              one.
            */}
            {token.reference === null && (
              <span className="mt-tight block type-meta text-muted">{token.value}</span>
            )}
          </span>
          {index < steps.length - 1 && (
            // Decorative. The list is already ordered and the reading order
            // already carries the direction, so a screen reader gets nothing
            // from hearing "points at" three times.
            <span aria-hidden="true" className="type-body text-muted">
              →
            </span>
          )}
        </li>
      ))}

      {leaf && (
        <li className="flex items-center">
          <span
            aria-hidden="true"
            // Build-time data, same as the fixed swatches: a utility class
            // cannot express a value read out of a file, and minting a token per
            // Primitive so Tailwind could render one would be a fourth layer.
            style={{ backgroundColor: leaf.value }}
            className="block size-10 rounded-control border border-border"
          />
        </li>
      )}
    </ol>
  );
}
