import { glyphsheroNightShift as fig } from '@/content/figures/glyphshero-night-shift';

// Semantic tokens throughout, matching the design-gate figure beside it.

export function GlyphsheroNightShift() {
  return (
    <div className="rounded-card border border-border p-gutter type-body">
      <p className="type-subheading">{fig.title}</p>
      <p className="mt-tight type-meta text-muted">{fig.standfirst}</p>

      <dl className="mt-gap grid gap-gap sm:grid-cols-2">
        {fig.shifts.map((shift) => (
          <div key={shift.name} className="rounded-card border border-border bg-surface p-gutter">
            <dt className="type-meta type-emphasis">{shift.name}</dt>
            <dd className="mt-tight type-meta text-muted">{shift.where}</dd>
            <dd className="mt-tight type-meta">{shift.role}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-gap rounded-card border border-border p-gutter">
        <p className="type-eyebrow text-muted">{fig.protocolLabel}</p>
        {/*
          An <ol>, matching the progression section kind's own reasoning: the
          four steps are a sequence a reader follows, not a set they scan, so
          the order belongs in the markup.
        */}
        <ol className="mt-tight space-y-tight type-meta">
          {fig.protocol.map((step, index) => (
            <li key={step}>
              <span className="type-emphasis text-fg">{index + 1}.</span> {step}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-gap type-meta text-muted">{fig.footnote}</p>
    </div>
  );
}
