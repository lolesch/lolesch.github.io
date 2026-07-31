import { glyphsheroChain as fig } from '@/content/figures/glyphshero-chain';

// Semantic tokens throughout, so the figure follows the theme toggle. Unlike
// the Rollhaus diagram, no literal colour arrives as data here: that figure is
// *about* a palette, this one is about structure.

export function GlyphsheroChain() {
  return (
    <div className="rounded-card border border-border p-gutter text-body">
      <p className="font-serif text-subheading leading-tight">{fig.title}</p>
      <p className="mt-tight text-meta text-muted">{fig.standfirst}</p>

      {/*
        A real table, because this is tabular data: three chains against three
        axes, and the reader compares down a column. A grid of divs would look
        identical and tell a screen reader nothing about which value belongs to
        which axis.

        overflow-x-auto on the wrapper rather than the table, so the page body
        never scrolls sideways on a phone.
      */}
      <div className="mt-gap overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th
                scope="col"
                className="p-tight text-meta font-bold tracking-widest text-muted uppercase"
              >
                Chain
              </th>
              {fig.axes.map((axis) => (
                <th
                  key={axis}
                  scope="col"
                  className="p-tight text-meta font-bold tracking-widest text-muted uppercase"
                >
                  {axis}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fig.rows.map((row) => (
              <tr key={row.chain.join('+')} className="border-t border-border">
                <th scope="row" className="p-tight text-meta font-normal">
                  {row.chain.map((item, index) => (
                    <span key={item}>
                      {index > 0 ? ' + ' : ''}
                      <span className={item === row.added ? 'font-bold' : undefined}>{item}</span>
                    </span>
                  ))}
                </th>
                {row.values.map((value, index) => (
                  <td key={fig.axes[index]} className="p-tight">
                    {/*
                      The changed cell is bold *and* carries a visually hidden
                      word. Weight alone fails the same way colour alone does:
                      it says nothing to a screen reader, and which single cell
                      moved is this figure's entire argument.
                    */}
                    {index === row.changed ? (
                      <>
                        <span className="sr-only">changed to </span>
                        <span className="font-bold">{value}</span>
                      </>
                    ) : (
                      <span className="text-muted">{value}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-gap text-meta text-muted">{fig.footnote}</p>
    </div>
  );
}
