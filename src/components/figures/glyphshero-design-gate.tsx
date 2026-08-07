import { glyphsheroDesignGate as fig } from '@/content/figures/glyphshero-design-gate';

// Semantic tokens throughout, matching glyphshero-chain: this figure is about
// structure and a rule, not about a palette, so no literal colour arrives as
// data here.

export function GlyphsheroDesignGate() {
  return (
    <div className="rounded-card border border-border p-gutter type-body">
      <p className="type-subheading">{fig.title}</p>
      <p className="mt-tight type-meta text-muted">{fig.standfirst}</p>

      {/*
        A real table: two rows against three questions (which door, what
        triggers it, what happens), and the reader compares across a row. A
        grid of divs would look identical and tell a screen reader nothing
        about which value belongs to which door.
      */}
      <div className="mt-gap overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th scope="col" className="p-tight type-eyebrow text-muted">
                Door
              </th>
              <th scope="col" className="p-tight type-eyebrow text-muted">
                Trigger
              </th>
              <th scope="col" className="p-tight type-eyebrow text-muted">
                What happens
              </th>
            </tr>
          </thead>
          <tbody>
            {fig.doors.map((door) => (
              <tr key={door.kind} className="border-t border-border">
                <th scope="row" className="p-tight type-meta type-emphasis">
                  {door.kind}
                </th>
                <td className="p-tight type-meta text-muted">{door.trigger}</td>
                <td className="p-tight type-meta">{door.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-gap rounded-card border border-border bg-surface p-gutter">
        <p className="type-eyebrow text-muted">{fig.ledgerLabel}</p>
        <dl className="mt-tight space-y-tight">
          {fig.ledger.map((row) => (
            <div key={row.line}>
              <dt className="type-meta type-emphasis">{row.line}</dt>
              <dd className="type-meta text-muted">{row.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-gap type-meta text-muted">{fig.footnote}</p>
    </div>
  );
}
