import type { About, ContactLink } from '@/content/types';

export function ContactLinks({ contact, cv }: { contact: readonly ContactLink[]; cv: About['cv'] }) {
  return (
    <section aria-labelledby="contact" className="mt-section">
      <h2 id="contact" className="type-heading">
        Contact
      </h2>

      <ul className="mt-gap grid gap-gap type-body sm:grid-cols-2">
        {contact.map((link) => (
          <li key={link.href}>
            <p className="type-meta text-muted">{link.label}</p>
            <a
              href={link.href}
              // Same tab, deliberately. The visitor chose to leave, and taking
              // over their tab management is not this site's call. `noopener`
              // is inert without target="_blank" and is set anyway, so the rel
              // is already right if that ever changes.
              rel={link.external ? 'noopener noreferrer' : undefined}
              // Matches the "Back to all work" link on a project page: always
              // underlined, no hover change. One link style on the site.
              className="text-accent underline underline-offset-4"
            >
              {link.value}
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
