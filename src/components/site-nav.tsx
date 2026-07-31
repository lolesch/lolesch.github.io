'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// The route links, in nav order. A list rather than three hand-written blocks,
// because the current-page logic is identical for each and a third copy of a
// ternary is where the third one quietly differs.
const ROUTES = [
  { href: '/design-system/', label: 'Design System' },
  { href: '/about/', label: 'About' },
] as const;

// A client component only so usePathname can mark the current page. The site
// already ships client JS for the theme toggle, so the boundary costs nothing
// new, and a nav that never says where you are is a small miss on a site
// arguing for care.
export function SiteNav() {
  const pathname = usePathname();
  // trailingSlash: true means this can arrive either way. Strip it rather than
  // matching both, and note that '/' becomes '' harmlessly.
  const current = pathname?.replace(/\/$/, '') ?? '';

  return (
    <nav aria-label="Main">
      {/*
        flex-wrap because three links, a wordmark and a "Dark mode" button do
        not fit one line at 320px. The header wraps too, so this wraps inside a
        row that has already wrapped, which is what keeps nothing clipped.
      */}
      <ul className="flex flex-wrap gap-gap text-body">
        <li>
          {/*
            A fragment into Home rather than its own route, so it works from
            anywhere. Home's work grid already carries <h2 id="work">. It gets
            no aria-current: Home has no unambiguous current state and claiming
            one would be worse than claiming none.
          */}
          <Link href="/#work" className="hover:underline">
            Work
          </Link>
        </li>
        {ROUTES.map((route) => {
          const onIt = current === route.href.replace(/\/$/, '');
          return (
            <li key={route.href}>
              <Link
                href={route.href}
                aria-current={onIt ? 'page' : undefined}
                // aria-current alone is invisible, so the state is carried
                // visually too. A screen-reader-only cue is not a cue.
                className={onIt ? 'underline underline-offset-4' : 'hover:underline'}
              >
                {route.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
