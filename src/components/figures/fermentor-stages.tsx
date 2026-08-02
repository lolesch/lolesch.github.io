import { fermentorStages as fig } from '@/content/figures/fermentor-stages';

// Semantic tokens throughout, so the figure follows the theme toggle. No
// literal colour arrives as data here: the FerMentor palette is unverified in
// the source, and this figure is about a model rather than about a palette.

const Arrow = () => (
  <p className="py-tight pl-gutter type-meta text-muted" aria-hidden="true">
    then
  </p>
);

export function FermentorStages() {
  return (
    <div className="rounded-card border border-border p-gutter type-body">
      <p className="type-subheading">{fig.title}</p>
      <p className="mt-tight type-meta text-muted">{fig.standfirst}</p>

      {/*
        An ordered list of phases, each holding its own list of stages, rather
        than one flat list of seven. The nesting is the argument: four stages of
        development funnel into a single decision, which branches into two
        outcomes. Flattening it would show the same seven names and lose the
        shape that makes the model worth anything.
      */}
      <ol className="mt-gap">
        {fig.phases.map((phase, index) => (
          <li key={phase.name}>
            {index > 0 ? <Arrow /> : null}
            <p className="type-eyebrow text-muted">{phase.name}</p>

            <ul className="mt-tight grid gap-tight sm:grid-cols-2">
              {phase.stages.map((stage) => (
                <li
                  key={stage.name}
                  className="rounded-card border border-border bg-surface p-gutter"
                >
                  <p className="type-emphasis">{stage.name}</p>
                  <p className="mt-tight type-meta text-muted">{stage.gloss}</p>

                  {/*
                    The label is per phase, not per stage: Decision holds the
                    questions the signals are gathered to answer, and calling
                    those "what you can see" would quietly turn a decision point
                    back into an observation.
                  */}
                  <p className="mt-gap type-eyebrow text-muted">{phase.signalsLabel}</p>
                  <ul className="mt-tight flex flex-wrap gap-tight">
                    {stage.signals.map((signal) => (
                      <li
                        key={signal}
                        className="rounded-tag border border-border p-tight type-meta"
                      >
                        {signal}
                      </li>
                    ))}
                  </ul>

                  {stage.note ? (
                    <p className="mt-gap rounded-control border border-border p-tight type-meta">
                      <span className="type-eyebrow text-muted">Annotated on the model </span>
                      {stage.note}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="mt-gap type-meta text-muted">{fig.footnote}</p>
    </div>
  );
}
