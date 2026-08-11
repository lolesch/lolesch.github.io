import Link from 'next/link';
import { Icon } from '@/components/contact-links';
import { about } from '@/content/about';

/*
 * Added 2026-08-05. Home ended on the last project card until then: a reader who
 * scrolled the whole page arrived at the bottom of the argument with nothing to
 * do and no way to reach anyone. /about carried the only contact block on the
 * site, one click away from the page most people land on.
 *
 * In the layout beside SiteHeader rather than on Home, for the reason stated
 * there: a long case study ends the same way, and the reader most likely to
 * write is the one who just finished reading one.
 *
 * The CV link joined this on 2026-08-11, and /about's own contact section, the
 * `ContactLinks` component, was deleted rather than kept. The two used to carry
 * the same four links: a reader who reached /about by way of the wordmark saw
 * them once at the end of the bio and again one scroll further in the footer.
 * This is now the one copy, which is also the one that reaches every route
 * instead of only /about. Still no heading that would enter the document
 * outline on every page; "Contact" is styled to read as one without being one,
 * the same call `ContactLinks` used to make with a real `<h2>` where the page
 * was about nothing else.
 */
export function SiteFooter() {
  return (
    /*
     * Edge-to-edge rule, frame-wide contents, mirroring SiteHeader. `mt-section`
     * is on the element rather than on the page, so a route cannot forget it.
     *
     * The decorative `border` token: a footer boundary is not a control, which
     * is the same call the header's hairline makes.
     */
    <footer className="mt-section border-t border-border">
      <div className="frame mx-auto flex flex-col gap-gap px-gutter py-section">
        {/*
          "Say hello." until 2026-08-11. Renamed once this became the site's
          only contact block: an invitation reads right beside a lone set of
          links, but this now sits under a header whose own wordmark reads
          "Leonid Schreiber" and points at the bio the links used to close, so
          the plainer, findable label is the one worth having. Availability,
          notice period and what Leonid is looking for still belong on /about or
          in an email, where they can be said properly; a footer that tried to
          say them would be the clutter CONTEXT.md's one anti-brand constraint
          bans.
        */}
        <p className="type-title">Contact</p>

        <ul className="flex flex-wrap gap-x-gap gap-y-tight type-body">
          {about.contact.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                // Same tab, and `noopener` set on the external three only.
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-tight text-accent"
              >
                <Icon id={link.icon} />
                <span className="underline underline-offset-4">
                  <span className="sr-only">{link.label} </span>
                  {link.value}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {about.cv ? (
          <p className="type-body">
            <a
              href={about.cv.href}
              // The CV is the one link that opens elsewhere. A PDF replacing
              // the site is a dead end for a reader who was about to email. No
              // `download` attribute: opening in the browser's viewer is
              // friendlier for someone skimming, and forcing a file to disk is
              // their call. Carried over unchanged from the deleted
              // `ContactLinks`, which made the same call for the same reasons.
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4"
            >
              {about.cv.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        ) : null}

        {/*
          The one line that is not a link to a person, and it is here rather than
          on Home because it is a footnote rather than a claim. It also does a
          job: /design-system is the strongest artifact on this site and the
          hardest to stumble into, sitting third in a nav most readers scan once.

          Claims only what ships, per guardrail 1. The tokens, the roles and the
          contrast table are all rendered from the generated stylesheet today.
          The Figma half of the pipeline is not built, so it is not mentioned.
        */}
        <p className="type-meta text-muted">
          This site runs on a token system it also documents.{' '}
          <Link href="/design-system/" className="text-accent underline underline-offset-4">
            See how it is put together
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
