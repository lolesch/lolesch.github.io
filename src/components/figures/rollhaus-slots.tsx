import { rollhausPalette, rollhausSlots as fig } from '@/content/figures/rollhaus-slots';

// Chrome on Semantic tokens, so the figure follows the theme toggle. The only
// literal colours in here arrive as data, because they are what the diagram
// depicts.

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="type-eyebrow text-muted">{children}</p>
);

export function RollhausSlots() {
  return (
    <div className="rounded-card border border-border p-gutter type-body">
      <p className="type-subheading">{fig.title}</p>
      <p className="mt-tight type-meta text-muted">{fig.standfirst}</p>

      <div className="mt-gap grid gap-gap md:grid-cols-2">
        <div>
          <Label>{fig.treeLabel}</Label>
          {/*
            An indented list rather than a drawn tree. The depth is real, it
            comes off the layer panel, and a rule-and-elbow diagram would spend
            a lot of markup saying what an indent already says.
          */}
          <ul className="mt-tight rounded-card border border-border bg-surface p-gutter">
            {fig.tree.map((node) => (
              <li
                key={`${node.depth}-${node.name}`}
                className="type-code"
                style={{ paddingLeft: `${node.depth}.25rem` }}
              >
                <span className={node.kind === 'slot' ? 'text-accent' : 'text-muted'}>
                  {node.kind === 'slot' ? '▸ ' : '· '}
                </span>
                <span className={node.kind === 'slot' ? 'type-emphasis' : ''}>{node.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Label>{fig.screensLabel}</Label>
          <dl className="mt-tight space-y-tight">
            {fig.screens.map((screen) => (
              <div
                key={screen.name}
                className="rounded-card border border-border bg-surface p-tight"
              >
                <dt className="type-meta type-emphasis">{screen.name}</dt>
                <dd className="type-meta text-muted">
                  <b className="text-fg">Image slot:</b> {screen.image}
                </dd>
                <dd className="type-meta text-muted">
                  <b className="text-fg">Content slot:</b> {screen.content}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-gap rounded-card border border-border bg-surface p-gutter">
        <Label>{fig.tokensLabel}</Label>
        {/*
          A grid rather than a wrapping flex row: the swatches are one scale, and
          a scale that breaks across two lines reads as an accident.
        */}
        <ul className="mt-tight grid grid-cols-10 gap-tight">
          {[
            ...rollhausPalette.neutrals,
            ...rollhausPalette.secondary,
            { value: rollhausPalette.brand, label: 'Primary 1' },
            { value: rollhausPalette.brandSoft, label: 'Primary 2' },
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

      <div
        className="mt-gap rounded-card border border-border p-gutter"
        // Depicted in the Rollhaus brand yellow because that is what the source
        // artifact looks like.
        style={{ borderLeft: `6px solid ${rollhausPalette.brand}` }}
      >
        <Label>{fig.extend.label}</Label>
        <p className="mt-tight type-meta">{fig.extend.body}</p>
      </div>

      <p className="mt-gap type-meta text-muted">{fig.footnote}</p>
    </div>
  );
}
