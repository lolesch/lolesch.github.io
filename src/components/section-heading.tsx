/*
 * The one section opener on the site, added 2026-08-05.
 *
 * Before this, a section was an h2 at 24px with `mt-section` above it and
 * nothing else. That was legible and it was invisible: on a page whose headline
 * had just gone to 88px, the boundary between the hero and the work read as a
 * larger gap rather than as a new part, and a 10,000px case study had eleven of
 * them with no way to tell where you were.
 *
 * A rule and a label, which is the smallest thing that answers both. The rule
 * says a part ended; the index says which part this is and, by implication, that
 * there are others. Neither is decoration: they are the page's structure made
 * visible, which is the argument this site makes about everything else.
 */
export function SectionHeading({
  children,
  id,
  index,
}: {
  children: React.ReactNode;
  id?: string;
  /*
   * Optional, and the option is the point. A number means a sequence, so it is
   * rendered where there is one: a case study runs six to eleven sections and
   * the reader is genuinely somewhere in a list. Home has exactly one section
   * under the hero, and labelling it "01" would promise a "02" that never
   * arrives. The rule alone is correct there.
   */
  index?: number;
}) {
  return (
    /*
     * The rule sits on the wrapper rather than on the heading, so the padding
     * below it belongs to the group and a section can never render the label
     * tight against the line.
     *
     * `border` and not `border-interactive`: a section boundary is not a
     * control, which is the same call the header hairline and the constraints
     * callout both make.
     */
    <div className="mt-section border-t border-border pt-gap">
      {index === undefined ? null : (
        // Padded to two digits, so 01 and 11 occupy the same width and the
        // labels down a long case study sit on one left edge instead of
        // shifting by a character at ten.
        <p className="type-eyebrow text-muted">{String(index).padStart(2, '0')}</p>
      )}
      <h2 id={id} className={`type-heading ${index === undefined ? '' : 'mt-tight'}`}>
        {children}
      </h2>
    </div>
  );
}
