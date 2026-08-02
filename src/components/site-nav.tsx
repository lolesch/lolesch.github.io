'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';

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
 * the way back, not a place you can be: Home *is* the projects page, the grid
 * is on it, and Projects is what that location is called. Marking both would
 * put two links on one destination, and marking the name would make the site's
 * identity double as a location.
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
   * Projects is both. On '/' it is the page: the href is a fragment, and a
   * fragment does not leave the page it points into. On /projects/<slug> it is
   * the section the visitor is inside, which is a weaker claim and gets the
   * weaker marker.
   *
   * Named Work until 2026-08-02. "Work" reads as employment, which is the wrong
   * promise on a page where two of three entries are not jobs, and the route
   * moved with the label rather than leaving the URL arguing with the nav.
   */
  { href: '/#projects', label: 'Projects', page: '/', section: '/projects', role: 'type-body' },
  { href: '/design-system/', label: 'Design System', page: '/design-system', role: 'type-body' },
  { href: '/about/', label: 'About', page: '/about', role: 'type-body' },
];

// trailingSlash: true means a path can arrive either way. Stripped, except '/'
// which has nothing left to strip and must not become ''.
const normalise = (path: string) => (path.length > 1 ? path.replace(/\/$/, '') : path);

/*
 * 'page' is the exact route. 'true' is the generic "you are inside this", and
 * the distinction is kept rather than blurred: a project page is under Projects
 * but it is not /#projects, and claiming 'page' there would tell a screen
 * reader the visitor is somewhere they are not.
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

/*
 * A row at `sm` and up, a disclosure below it.
 *
 * The header used to wrap instead, and that was the right answer while it
 * scrolled away: nothing was hidden, and the cost was paid once at the top of
 * the page. Pinning it changed the arithmetic. Three links, the wordmark and
 * the switch wrap to three rows at 390px and four at 320px, which measured
 * 135px and 186px of permanent bar, or a sixth and a fifth of a phone screen.
 * A menu that has to be opened is the smaller loss.
 *
 * Nothing changes at `sm` and up, where all five fit on one 75px row and a
 * button would be hiding three links from a screen with room for them.
 */
export function SiteNav() {
  const here = useHere();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Closes on navigation. Every link either leaves the route, which changes
  // `here`, or is the fragment into Home, which does not: hence both this and
  // the handler on the list below. A panel still standing open over the section
  // it just scrolled to is the obvious failure here.
  useEffect(() => setOpen(false), [here]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <nav aria-label="Main">
      {/*
        The name is the word rather than the glyph, so it does not depend on
        three lines being read as "menu". `aria-expanded` carries the state, so
        the name stays put instead of flipping to "Close": a control whose name
        changes under you is harder to refer to, not easier.

        24px of glyph and a `tight` inset on each side, which clears the 24px
        target floor (SC 2.5.8) with room over.
      */}
      <button
        type="button"
        onClick={() => setOpen((was) => !was)}
        aria-expanded={open}
        aria-controls={panelId}
        className="-me-tight rounded-control p-tight text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-interactive sm:hidden"
      >
        <span className="sr-only">Menu</span>
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6 18 18M18 6 6 18" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" />
          )}
        </svg>
      </button>

      {/*
        One list in both layouts rather than two rendered side by side, so there
        is never a second copy of the links in the accessible tree.

        Absolute against the header, which is `sticky` and therefore already a
        containing block, so the panel hangs under the bar at full width instead
        of stretching it. `sm:` puts every one of those back: static, a row,
        no background and no border, which is the header exactly as it was.
      */}
      <ul
        id={panelId}
        onClick={() => setOpen(false)}
        className={`${
          open ? 'flex' : 'hidden'
        } absolute inset-x-0 top-full flex-col gap-stack border-b border-border bg-bg px-gutter py-gutter sm:static sm:flex sm:flex-row sm:items-center sm:gap-gap sm:border-0 sm:bg-transparent sm:p-0`}
      >
        {ROUTES.map((route) => (
          <li key={route.href}>
            <NavItem link={route} here={here} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
