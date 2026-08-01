import {
  rollhausArchitecture as fig,
  rollhausPalette,
} from '@/content/figures/rollhaus-architecture';

// Chrome on Semantic tokens, so the figure follows the theme toggle. The only
// literal colours in here arrive as data, because they are what the diagram
// depicts. The source file carried its own :root token block; porting rather
// than iframing is what stops a second token system shipping inside a site
// whose argument is that it has one.

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="type-eyebrow text-muted">{children}</p>
);

const Step = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-card border border-border bg-surface p-gutter">{children}</div>
);

const Arrow = ({ label }: { label: string }) => (
  <p className="py-tight pl-gutter type-meta text-muted" aria-hidden="true">
    {label}
  </p>
);

export function RollhausArchitecture() {
  return (
    <div className="rounded-card border border-border p-gutter type-body">
      <p className="type-subheading">{fig.title}</p>
      <p className="mt-tight type-meta text-muted">{fig.standfirst}</p>

      <div className="mt-gap grid gap-gap md:grid-cols-[1.55fr_1fr]">
        <div>
          <Label>{fig.flowLabel}</Label>
          <ol className="mt-tight">
            {fig.flow.map((step) => (
              <li key={step.title}>
                <Step>
                  <p className="type-emphasis">{step.title}</p>
                  <p className="mt-tight type-meta text-muted">{step.detail}</p>

                  {'chips' in step && (
                    <ul className="mt-tight flex flex-wrap gap-tight">
                      {step.chips.map((chip) => (
                        <li
                          key={chip.text}
                          className="rounded-tag border border-border p-tight type-meta"
                          // The selected chip is depicted in the Rollhaus brand
                          // yellow, because which colour it is *is* the point.
                          style={
                            chip.on
                              ? {
                                  background: rollhausPalette.brand,
                                  borderColor: rollhausPalette.brand,
                                  color: rollhausPalette.neutrals[4].value,
                                }
                              : undefined
                          }
                        >
                          {chip.text}
                        </li>
                      ))}
                    </ul>
                  )}

                  {'variables' in step && (
                    <ul className="mt-tight flex flex-wrap gap-tight">
                      {step.variables.map((variable) => (
                        <li
                          key={variable.name}
                          className="rounded-control p-tight type-code"
                          style={{
                            background: rollhausPalette.neutrals[4].value,
                            color: rollhausPalette.neutrals[0].value,
                          }}
                        >
                          {variable.name}{' '}
                          <span style={{ color: rollhausPalette.brand }}>{variable.type}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Step>
                {'arrow' in step && step.arrow ? <Arrow label={step.arrow} /> : null}
              </li>
            ))}
          </ol>
        </div>

        <div>
          <Label>{fig.tokensLabel}</Label>
          <div className="mt-tight rounded-card border border-border bg-surface p-gutter">
            <p className="type-meta type-emphasis">Colour</p>
            {/*
              A grid rather than a wrapping flex row: the swatches are one
              scale, and a scale that breaks across two lines at a narrow column
              width reads as an accident. The columns scale, the row does not
              wrap.
            */}
            <ul className="mt-tight grid grid-cols-6 gap-tight">
              {[
                ...rollhausPalette.neutrals,
                { value: rollhausPalette.brand, label: 'Primary 1' },
              ].map((swatch) => (
                <li
                  key={swatch.value}
                  className="aspect-square rounded-control border border-border"
                  style={{ background: swatch.value }}
                >
                  <span className="sr-only">{`${swatch.label} ${swatch.value}`}</span>
                </li>
              ))}
            </ul>

            {fig.tokenGroups.map((group) => (
              <div key={group.name} className="mt-gap">
                <p className="type-meta type-emphasis">{group.name}</p>
                <p className="mt-tight type-meta text-muted">{group.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-gap rounded-card border border-border bg-surface p-gutter">
        <Label>{fig.compositionLabel}</Label>
        <div className="mt-tight flex flex-wrap gap-tight">
          {[fig.composition.base, fig.composition.slotted].map((card) => (
            <div
              key={card.name}
              className="flex-1 basis-40 rounded-control border border-border p-tight type-meta"
            >
              <p className="type-emphasis">{card.name}</p>
              {card.slots.map((slot) => (
                <p
                  key={slot}
                  className="mt-tight rounded-control border border-border p-tight text-muted"
                >
                  {slot}
                </p>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-tight type-meta text-muted">
          Reused across <b className="text-fg">{fig.composition.reusedOn}</b>.{' '}
          {fig.composition.note}
        </p>
      </div>

      <div
        className="mt-gap rounded-card border border-border p-gutter"
        // The callout is depicted in the Rollhaus brand yellow for the same
        // reason the chip is: it is what the source artifact looks like.
        style={{ borderLeft: `6px solid ${rollhausPalette.brand}` }}
      >
        <Label>{fig.extend.label}</Label>
        <p className="mt-tight type-meta">{fig.extend.body}</p>
      </div>

      <p className="mt-gap type-meta text-muted">{fig.footnote}</p>
    </div>
  );
}
