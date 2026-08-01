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
 * The wordmark is a NavLink like the others rather than its own block in
 * site-header.tsx, which is where it lived until 2026-08-01. It is a link to a
 * route, it needs the same current-page marker, and the current-page logic is
 * identical for every link: a second copy of that ternary is where the second
 * one quietly differs. It is exported separately only because it sits at the
 * other end of the header.
 */
const WORDMARK: NavLink = {
  href: '/',
  label: 'Leonid Schreiber',
  page: '/',
  role: 'type-wordmark',
};

const ROUTES: readonly NavLink[] = [
  /*
   * Work is a fragment into Home, so it is never the current *page*: Home's
   * work grid already carries <h2 id="work">, and the wordmark above marks
   * Home itself. What Work is, is the section a project detail page sits
   * inside. Without `section`, /work/<slug> would be the one route on the site
   * that highlights nothing.
   */
  { href: '/#work', label: 'Work', section: '/work', role: 'type-body' },
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
