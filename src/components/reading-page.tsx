import { SectionNav } from '@/components/section-nav';
import type { SectionRef } from '@/lib/sections';

/*
 * The three pages that are a reading: a case study, About, and the design
 * system. All three shipped the same <main className="measure pt-gap
 * pb-section"> independently, so the rail's row is hoisted here with it rather
 * than repeated a fourth and fifth time. Home is deliberately not one of these:
 * it is a headline and a grid, and it has one section.
 *
 * The row collapses to nothing below `lg`, where the rail is display:none and
 * <main> is the only child: `flex-1` against a `measure` cap gives exactly the
 * width the page had before this existed.
 */
export function ReadingPage({
  sections,
  children,
}: {
  sections: readonly SectionRef[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-gutter">
      {/*
        `min-w-0` because a flex item's floor is its content, and one wide
        figure inside a case study would otherwise push the row past the frame
        rather than scrolling inside its own column.
      */}
      <main className="measure min-w-0 flex-1 pt-gap pb-section">{children}</main>

      {/*
        Two or more, or none at all. A rail with a single entry is the same
        empty promise the section index avoids by not numbering Home's one
        section: it says there is a list to move through when there is not.
        Decided here rather than inside the rail so a page that fails the test
        does not ship the scroll listener either.
      */}
      {sections.length > 1 ? <SectionNav sections={sections} /> : null}
    </div>
  );
}
