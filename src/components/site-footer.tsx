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
 * Not a second copy of ContactLinks. That is a <section> with an h2 and a
 * two-column list, correct where the page is *about* getting in touch. Here the
 * same four links are a row at the end of a page about something else, so they
 * are shorter, quieter, and carry no heading that would enter the document
 * outline on every route.
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
          The invitation, and deliberately the only sentence here. Availability,
          notice period and what Leonid is looking for all belong on /about or
          in an email, where they can be said properly; a footer that tried to
          say them would be the clutter CONTEXT.md's one anti-brand constraint
          bans. Two words and four links is the whole of what a footer owes.
        */}
        <p className="type-title">Say hello.</p>

        <ul className="flex flex-wrap gap-x-gap gap-y-tight type-body">
          {about.contact.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                // Same tab, and `noopener` set on the external three only. Both
                // calls match ContactLinks exactly, which is the point of the
                // two being one set of links in two placements.
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
