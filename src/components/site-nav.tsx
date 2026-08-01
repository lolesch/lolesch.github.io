'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLink = {
  href: string;
  label: string;
  /** The route this link *is*, normalised. Absent on a link that is a fragment. */
  page?: string;
  /** A route prefix this link stands for while the visitor is somewhere inside it. */
  section?: string;
  /** The type role. A literal, because Tailwind generates from literals. */
  role: string;
};

/*
 * The wordmark carries no `page` and no `section`, so it is never marked. It is
 * the way back, not a place you can be: Home *is* the work page, the grid is on
 * it, and Work is what that location is called. Marking both would put two
 * links on one destination, and marking the name would make the site's identity
 * double as a location.
 *
 * It is still a NavLink rather than its own block in site-header.tsx, because
 * everything else about it is a nav link and the alternative is a second copy
 * of the logic below. It is exported separately only because it sits at the
 * other end of the header.
 */
const WORDMARK: NavLink = {
  href: '/',
  label: 'Leonid Schreiber',
  role: 'type-wordmark',
};

const ROUTES: readonly NavLink[] = [
  /*
   * Work is both. On '/' it is the page: the href is a fragment, and a fragment
   * does not leave the page it points into. On /work/<slug> it is the section
   * the visitor is inside, which is a weaker claim and gets the weaker marker.
   */
  { href: '/#work', label: 'Work', page: '/', section: '/work', role: 'type-body' },
  { href: '/design-system/', label: 'Design System', page: '/design-system', role: 'type-body' },
  { href: '/about/', label: 'About', page: '/about', role: 'type-body' },
];

// trailingSlash: true means a path can arrive either way. Stripped, except '/'
// which has nothing left to strip and must not become ''.
const normalise = (path: string) => (path.length > 1 ? path.replace(/\/$/, '') : path);

/*
 * 'page' is the exact route. 'true' is the generic "you are inside this", and
 * the distinction is kept rather than blurred: a project page is under Work but
 * it is not /#work, and claiming 'page' there would tell a screen reader the
 * visitor is somewhere they are not.
 */
const marker = (link: NavLink, here: string): 'page' | 'true' | undefined => {
  if (link.page && here === link.page) return 'page';
  if (link.section && here.startsWith(link.section)) return 'true';
  return undefined;
};

function NavItem({ link, here }: { link: NavLink; here: string }) {
  const current = marker(link, here);
  return (
    <Link
      href={link.href}
      aria-current={current}
      // aria-current alone is invisible, so the state is carried visually too.
      // A screen-reader-only cue is not a cue. The underline stays, so colour
      // is never the only channel (SC 1.4.1) and the accent is the second one.
      className={`${link.role} underline-offset-4 ${
        current ? 'text-accent underline' : 'hover:underline'
      }`}
    >
      {link.label}
    </Link>
  );
}

// A client component only so usePathname can mark the current page. The site
// already ships client JS for the theme toggle, so the boundary costs nothing
// new, and a nav that never says where you are is a small miss on a site
// arguing for care.
const useHere = () => normalise(usePathname() ?? '/');

export function Wordmark() {
  return <NavItem link={WORDMARK} here={useHere()} />;
}

export function SiteNav() {
  const here = useHere();

  return (
    <nav aria-label="Main">
      {/*
        flex-wrap because three links, a wordmark and a theme switch do not fit
        one line at 320px. The header wraps too, so this wraps inside a row that
        has already wrapped, which is what keeps nothing clipped.
      */}
      <ul className="flex flex-wrap items-center gap-gap">
        {ROUTES.map((route) => (
          <li key={route.href}>
            <NavItem link={route} here={here} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
