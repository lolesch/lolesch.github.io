import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { ThemeToggle } from '@/components/theme-toggle';

// In the layout rather than on Home, so a project route gets the theme toggle
// and a way back without repeating either.
export function SiteHeader() {
  return (
    // flex-wrap rather than a breakpoint: at 320px the wordmark, two nav links
    // and a "Dark mode" button do not fit on one line, and wrapping is a better
    // answer than hiding one of them behind a menu nobody asked for.
    <header className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-tight px-gutter pt-gutter">
      <Link href="/" className="type-wordmark hover:underline">
        Leonid Schreiber
      </Link>
      <div className="flex items-center gap-gap">
        <SiteNav />
        <ThemeToggle />
      </div>
    </header>
  );
}
