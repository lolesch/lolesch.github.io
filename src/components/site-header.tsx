import { SiteNav, Wordmark } from '@/components/site-nav';
import { ThemeToggle } from '@/components/theme-toggle';

// In the layout rather than on Home, so a project route gets the theme toggle
// and a way back without repeating either.
export function SiteHeader() {
  return (
    /*
     * Sticky, so the way out is reachable from the bottom of a long case study
     * rather than only from the top. Two elements rather than one, because the
     * background has to run edge to edge while the row inside it stays on the
     * frame: a sticky element that is itself `frame`-wide would let the page
     * scroll past it on both sides.
     *
     * Opaque `bg` rather than a blur. A translucent bar puts running text
     * behind the nav links, and the contrast ratios this site publishes are
     * measured against `bg`, not against `bg` with a paragraph showing through.
     *
     * The hairline is load-bearing at that point: with an opaque background and
     * no edge, text scrolling underneath reads as text being clipped. The
     * decorative `border` token is the right one, because a bar is not a
     * control.
     */
    <header className="sticky top-0 z-10 border-b border-border bg-bg">
      {/*
        Three children rather than two, so the toggle is its own zone at the end
        of the row instead of a fourth item in a cluster with the links. It read
        as one of them until 2026-08-01: same gap, same box, and nothing about it
        saying it changes a setting rather than going somewhere.

        This wrapped rather than collapsing until 2026-08-02, on the argument
        that hiding a link behind a menu nobody asked for was the worse trade.
        Pinning the header is what overturned it: wrapping now costs three rows
        at 390px and four at 320px, permanently, and the nav became a
        disclosure. `flex-wrap` stays as the backstop for the case the
        breakpoint does not cover, a long wordmark against a narrow screen.

        `py-gutter` rather than the `pt-gutter` this carried while it scrolled
        away. Padding on one side is enough when the page simply starts below
        it; a bar with a background needs the same space underneath, or the
        first line of content sits on the border.
      */}
      <div className="frame mx-auto flex flex-wrap items-center justify-between gap-tight px-gutter py-gutter">
        <Wordmark />
        {/*
          A cluster below `sm` so the menu button and the switch sit together at
          the end of the bar, and `contents` from `sm` up, which dissolves the
          wrapper so the three land on the row exactly as they did before.

          Grouping rather than reordering, on purpose. The DOM order is still
          wordmark, nav, toggle in both layouts, so the tab order is the reading
          order and nothing has to be argued about under SC 2.4.3.
        */}
        <div className="flex items-center gap-gap sm:contents">
          <SiteNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
