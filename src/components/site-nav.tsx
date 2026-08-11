'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';

type NavLink = {
  href: string;
  label: string;
  /** The route this link *is*, normalised. Absent on a link with no destination of its own. */
  page?: string;
  /** A route prefix this link stands for while the visitor is somewhere inside it. */
  section?: string;
  /** The type role. A literal, because Tailwind generates from literals. */
  role: string;
};

/*
 * The wordmark carried no `page` and no `section` until 2026-08-11: it was the
 * way back, not a place you can be. That held while it pointed at Home, which
 * every other link could also reach. It no longer does. A name reads as a
 * person, not as a body of work, so Leonid's own read was that his name should
 * open his bio rather than the project grid: the wordmark now *is* /about, the
 * same as any other route, and carries the same `page` marker as one.
 *
 * It is still a NavLink rather than its own block in site-header.tsx, because
 * everything else about it is a nav link and the alternative is a second copy
 * of the logic below. It is exported separately only because it sits at the
 * other end of the header.
 */
const WORDMARK: NavLink = {
  href: '/about/',
  label: 'Leonid Schreiber',
  page: '/about',
  role: 'type-wordmark',
};

/*
 * Two links, not three. About/Contact was the third until 2026-08-11, and it
 * became redundant rather than rearranged: the wordmark took /about, and this
 * site has exactly three root pages, so a third ROUTES entry could only repeat
 * one of the other two destinations. That is the same "two links, one place"
 * problem the wordmark used to avoid by carrying no destination at all;
 * dropping the entry is what avoids it now that the wordmark carries one.
 *
 * Every href below is a root page on purpose, none a fragment. That was Home's
 * own rule under the old "Projects" label (see below); it now applies site-wide.
 */
const ROUTES: readonly NavLink[] = [
  /*
   * Portfolio is both. On '/' it is the page. On /projects/<slug> it is the
   * section the visitor is inside, which is a weaker claim and gets the weaker
   * marker.
   *
   * Named Projects until 2026-08-11, and Work before that. Renamed because the
   * wordmark moved onto /about and "Projects" then read as a second link to the
   * same place as the name beside it. The href changed with it, from the
   * `/#projects` fragment to plain '/': the label describes what the whole page
   * is, not a scroll position on it, and root pages are now the rule for every
   * nav entry, not an exception the wordmark used to be argued out of.
   */
  { href: '/', label: 'Portfolio', page: '/', section: '/projects', role: 'type-body' },
  { href: '/design-system/', label: 'Design System', page: '/design-system', role: 'type-body' },
];

// trailingSlash: true means a path can arrive either way. Stripped, except '/'
// which has nothing left to strip and must not become ''.
const normalise = (path: string) => (path.length > 1 ? path.replace(/\/$/, '') : path);

/*
 * 'page' is the exact route. 'true' is the generic "you are inside this", and
 * the distinction is kept rather than blurred: a project page is under
 * Portfolio but it is not '/', and claiming 'page' there would tell a screen
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
      // A link to the page already open is not a navigation Next.js scrolls
      // for: the pathname does not change, so the router has nothing to react
      // to and the visitor stays wherever they were reading. `current ===
      // 'page'` is exactly that case (`marker` above), so it is what this
      // checks rather than re-deriving the same comparison a second way. No
      // `behavior: 'smooth'`, matching the plain jump the section rail already
      // uses instead of animating ten thousand pixels of case study.
      onClick={() => {
        if (current === 'page') window.scrollTo({ top: 0 });
      }}
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
 * the page. Pinning it changed the arithmetic: a wrapped bar becomes permanent
 * screen real estate rather than a one-time cost, measured at the time as a
 * sixth to a fifth of a phone screen across two narrow breakpoints. A menu
 * that has to be opened is the smaller loss. Dropping the third link on
 * 2026-08-11 (About/Contact folded into the wordmark) only widens that
 * margin, so the conclusion was not re-measured.
 *
 * Nothing changes at `sm` and up, where all four fit on one 75px row and a
 * button would be hiding two links from a screen with room for them.
 */
export function SiteNav() {
  const here = useHere();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Closes on navigation. Every link either leaves the route, which changes
  // `here`, or points back at the page already open, which does not: hence
  // both this and the handler on the list below. A panel still standing open
  // over a route the visitor never left is the obvious failure here.
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
