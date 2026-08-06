import { fermentorFramings as fig } from '@/content/figures/fermentor-framings';

// Semantic tokens throughout, so the figure follows the theme toggle. Nothing
// here is a colour the figure is about, unlike the Rollhaus palette swatches,
// so no literal arrives as data.

export function FermentorFramings() {
  return (
    <div className="rounded-card border border-border p-gutter type-body">
      <p className="type-subheading">{fig.title}</p>
      <p className="mt-tight type-meta text-muted">{fig.standfirst}</p>

      {/*
        An ordered list, because the options were numbered on the board and the
        prose refers to them by number. One column rather than three: each one
        is a statement plus a paragraph of argument, and at a third of the
        reading column that argument is the thing that stops being readable,
        which is the whole complaint against the screenshot this replaces.
      */}
      <ol className="mt-gap space-y-gap">
        {fig.framings.map((framing) => (
          <li
            key={framing.label}
            className="rounded-card border border-border bg-surface p-gutter"
          >
            <p className="type-eyebrow text-muted">
              {framing.label}
              {/*
                The chosen option is marked in words as well as in weight,
                because weight alone fails the way colour alone does. Same call
                as the changed cell in the GlyphsHero chain figure.
              */}
              {framing.chosen ? <span className="text-fg"> · became the shipped statement</span> : null}
            </p>
            <p className="mt-tight type-emphasis">{framing.title}</p>
            <p className="mt-tight">{framing.statement}</p>

            <p className="mt-gap type-eyebrow text-muted">Reasoning, as written</p>
            <p className="mt-tight type-meta text-muted">{framing.reasoning}</p>
            {framing.highlights.length > 0 ? (
              <ul className="mt-tight space-y-tight type-meta text-muted">
                {framing.highlights.map((highlight) => (
                  <li key={highlight} className="pl-gutter">
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-gap rounded-card border border-border p-gutter">
        <p className="type-eyebrow text-muted">{fig.verdictLabel}</p>
        <p className="mt-tight">{fig.verdict}</p>
      </div>

      <p className="mt-gap type-meta text-muted">{fig.footnote}</p>
    </div>
  );
}
