import { SiteNav, Wordmark } from '@/components/site-nav';
import { ThemeToggle } from '@/components/theme-toggle';

// In the layout rather than on Home, so a project route gets the theme toggle
// and a way back without repeating either.
export function SiteHeader() {
  return (
    /*
     * Three children rather than two, so the toggle is its own zone at the end
     * of the row instead of a fourth item in a cluster with the links. It read
     * as one of them until 2026-08-01: same gap, same box, and nothing about it
     * saying it changes a setting rather than going somewhere.
     *
     * flex-wrap rather than a breakpoint: at 320px the wordmark, three nav
     * links and the switch do not fit on one line, and wrapping is a better
     * answer than hiding one of them behind a menu nobody asked for.
     */
    <header className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-tight px-gutter pt-gutter">
      <Wordmark />
      <SiteNav />
      <ThemeToggle />
    </header>
  );
}
