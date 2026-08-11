import type { ReactNode } from 'react';
import type { ContactIconId } from '@/content/types';

/*
 * The drawings, keyed by the id on the record. One 24-unit grid, one stroke
 * weight, currentColor throughout, so the four read as one set and take the
 * link's colour rather than declaring one of their own. That last part is what
 * keeps them inside the token rules: an icon that carried its own hex would be
 * a colour literal in application code, which rule four bans.
 */
const ICONS: Record<ContactIconId, ReactNode> = {
  email: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
  /*
   * A gamepad rather than the itch.io mark. The three above are wordless logos
   * a reader recognises; itch.io's is a lettermark that would be unreadable at
   * this size, and drawing it badly would be worse than not drawing it. What
   * the link is for is games, and the label beside it says whose.
   */
  itch: (
    <>
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </>
  ),
};

// The only export left in this file since 2026-08-11, when the /about Contact
// section it used to sit beside was cut as a duplicate of the footer (both
// rendered the same four links; see site-footer.tsx). The drawings and the
// registry stayed rather than moving into site-footer.tsx directly, because
// SiteFooter is the only remaining caller and a component still earns its own
// file at one call site when the thing it owns, four hand-drawn icon sets, is
// not something a footer component should carry inline.
export function Icon({ id }: { id: ContactIconId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      // Decorative here, and that is a claim about this markup rather than
      // about icons: the label it replaced is still in the link, one element
      // down, so the icon has nothing left to say that is not already said.
      aria-hidden="true"
      // Sized in em rather than in a spacing token, so it is a ratio to the
      // text beside it instead of a length that happens to match today. At 1:1
      // an icon reads smaller than the type it sits with, because it fills the
      // em box and a glyph does not. Change the role and this follows.
      className="size-[1.25em] shrink-0"
    >
      {ICONS[id]}
    </svg>
  );
}
