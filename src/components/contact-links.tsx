import type { ReactNode } from 'react';
import { SectionHeading } from '@/components/section-heading';
import type { About, ContactIconId, ContactLink } from '@/content/types';

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

// Exported since 2026-08-05, when the footer started carrying the same four
// links in a shorter row. The drawings stay here, with the section that has the
// most to say about them, rather than moving to a third file that both import:
// two call sites is not yet a shared module, and the registry above is the
// thing either one would have to come back to.
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

export function ContactLinks({ contact, cv }: { contact: readonly ContactLink[]; cv: About['cv'] }) {
  return (
    // `mt-section` moved onto SectionHeading on 2026-08-05, with the rule.
    <section aria-labelledby="contact">
      {/*
        No index, and this is the one place where that is a judgement rather
        than a count. /about runs four numbered sections and then this, which is
        not a fifth part of the reading: it is what the page is for. The rule
        still separates it; the number would file it as more prose.
      */}
      <SectionHeading id="contact">Contact</SectionHeading>

      <ul className="mt-gap grid gap-x-gap gap-y-tight type-body sm:grid-cols-2">
        {contact.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              // Same tab, deliberately. The visitor chose to leave, and taking
              // over their tab management is not this site's call. `noopener`
              // is inert without target="_blank" and is set anyway, so the rel
              // is already right if that ever changes.
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-tight text-accent"
            >
              <Icon id={link.icon} />
              {/*
                The underline is on the text rather than on the link, so it does
                not run under the icon. Matches the "Back to all projects" link on a
                project page: always underlined, no hover change. One link style
                on the site.
              */}
              <span className="underline underline-offset-4">
                {/*
                  The label was a heading above the value until 2026-08-01, when
                  the icon took that job. It stays here because a picture is not
                  an accessible name: without it the itch.io link announces as
                  "lolesch.itch.io" and the drawing beside it says nothing.
                */}
                <span className="sr-only">{link.label} </span>
                {link.value}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {cv ? (
        <p className="mt-gap type-body">
          <a
            href={cv.href}
            // The CV is the one link that opens elsewhere. A PDF replacing the
            // site is a dead end for a reader who was about to email. No
            // `download` attribute: opening in the browser's viewer is
            // friendlier for someone skimming, and forcing a file to disk is
            // their call.
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4"
          >
            {cv.label}
            {/*
              The behaviour is announced in the link, but it belongs to the
              component rather than to the content record: the record says what
              the file is, the component knows how it opens.
            */}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      ) : null}
    </section>
  );
}
