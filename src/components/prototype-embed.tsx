'use client';

import Image from 'next/image';
import { useState } from 'react';

/*
 * A click-to-load facade, and the only place on this site that reaches another
 * origin at runtime.
 *
 * A bare <iframe> was rejected: it loads Figma's application on page load, does
 * not follow the theme, and makes a third-party request on behalf of a reader
 * who never asked for one, on a page whose stated constraint is that nothing is
 * cluttered. The poster is a screenshot the page already ships as the last step
 * of the progression above, so the facade costs one extra byte of markup and no
 * extra image.
 *
 * `loaded` is one-way on purpose. There is no close button, because a reader who
 * opened the prototype and wants the picture back can scroll four hundred pixels
 * up to the step it was cropped from.
 */
export function PrototypeEmbed({
  embedSrc,
  poster,
}: {
  embedSrc: string;
  poster: { src: string; alt: string; width: number; height: number };
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={embedSrc}
        title="The Rollhaus prototype, running in Figma"
        // 16:10, matching the poster it replaces, so the page does not jump when
        // the iframe arrives.
        className="aspect-[16/10] w-full rounded-card border border-border-media"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      // `border-interactive` rather than `border-media`: this one *is* a
      // control, which is the distinction the two roles exist for.
      className="group relative block w-full overflow-hidden rounded-card border border-border-interactive motion-state transition-[border-color] hover:border-fg focus-visible:border-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-interactive"
    >
      <Image
        src={poster.src}
        alt={poster.alt}
        width={poster.width}
        height={poster.height}
        className="h-auto w-full"
      />
      {/*
        The label sits on the same scrim the project titles use, for the same
        reason: it is type over an arbitrary photograph, and `on-scrim` is fixed
        in one direction so it stays legible in both themes.
      */}
      <span className="absolute inset-x-0 bottom-0 bg-scrim/90 p-gutter text-center type-body text-on-scrim">
        Load the prototype and configure a skate
      </span>
    </button>
  );
}
