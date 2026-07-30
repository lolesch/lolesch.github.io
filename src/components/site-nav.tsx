'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// A client component only so usePathname can mark the current page. The site
// already ships client JS for the theme toggle, so the boundary costs nothing
// new, and a nav that never says where you are is a small miss on a site
// arguing for care.
export function SiteNav() {
  const pathname = usePathname();
  // trailingSlash: true means this can arrive either way. Strip it rather than
  // matching both, and note that '/' becomes '' harmlessly.
  const onAbout = pathname?.replace(/\/$/, '') === '/about';

  return (
    <nav aria-label="Main">
      <ul className="flex gap-gap text-body">
        <li>
          {/*
            A fragment into Home rather than its own route, so it works from
            anywhere. Home's work grid already carries <h2 id="work">.
          */}
          <Link href="/#work" className="hover:underline">
            Work
          </Link>
        </li>
        <li>
          <Link
            href="/about/"
            // Set for About only. Work points at a fragment inside Home, which
            // has no unambiguous current state, and claiming one would be worse
            // than claiming none.
            aria-current={onAbout ? 'page' : undefined}
            // aria-current alone is invisible, so the state is carried visually
            // too. A screen-reader-only cue is not a cue.
            className={onAbout ? 'underline underline-offset-4' : 'hover:underline'}
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
