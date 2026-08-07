'use client';

import { useEffect, useState } from 'react';
import type { SectionRef } from '@/lib/sections';

/*
 * Which section the reader is in, computed from where the headings are.
 *
 * A scroll listener reading rects, rather than an IntersectionObserver, and the
 * reason is the case an observer handles worst. An observer answers "is this
 * element inside a band", so a section taller than the band leaves no heading in
 * it and the rail has to either go blank or remember what it said last. Rects
 * answer the question actually being asked, which is "which heading did I pass
 * most recently", and that has no dead zone at any section length.
 *
 * The usual argument for an observer is that it avoids reading layout on every
 * frame. That argument is about hundreds of elements. This site's longest page
 * has thirteen headings, the reads are batched into one animation frame and
 * nothing is written between them, so the whole pass is a single style flush
 * that only happens while the reader is actually scrolling.
 */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  // Joined, so the effect keys off the ids themselves rather than off the
  // identity of an array the parent may or may not be recreating. The array
  // arrives from a Server Component and is stable in practice; depending on it
  // directly would make that an assumption instead of a fact.
  const key = ids.join(' ');

  useEffect(() => {
    const targets = key.split(' ');
    let frame = 0;

    const read = () => {
      frame = 0;

      /*
       * Read out of the same declaration the browser uses to land an in-page
       * jump, which is set once in globals.css. Recomputing the header's height
       * here, or repeating the number, would give the rail its own idea of where
       * the page starts, and the two would drift the first time the bar changed.
       */
      const clearance =
        parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

      let current: string | null = null;
      for (const id of targets) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        // The heading counts as reached when it sits at the line a jump would
        // land it on, not when it leaves the viewport. That is where the reader
        // starts the section, so it is where the rail should say they are.
        // A pixel of slack, because the two are compared after fractional
        // layout and an exact landing would otherwise sometimes miss.
        if (top !== undefined && top <= clearance + 1) current = id;
      }

      // Null above the first heading, and that is honest rather than an
      // omission: a project page opens on a hero, a metadata line and three
      // schema rows, none of which is a numbered section. Marking 01 there
      // would claim a position the reader is not in yet.
      setActive(current);
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(read);
    };

    // Once on mount, so a reader who arrives on a #fragment or restores a
    // scroll position sees the right mark before touching the wheel.
    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}

/*
 * The page's own section index, made navigable, in the space `measure` has
 * always left empty beside the reading column.
 *
 * `hidden` below `lg` rather than a narrower rail, because there is no honest
 * intermediate: `frame` stops growing at 64rem, and below that the slack shrinks
 * continuously until it is nothing. display:none rather than visibility or an
 * off-screen inset, so it leaves the accessibility tree too. A navigation a
 * phone reader can hear but not reach is worse than no navigation.
 *
 * The jump is a plain anchor. No handler, no smooth-scroll: `scroll-padding-top`
 * already lands it clear of the sticky bar, it works before hydration, and
 * animating a reader ten thousand pixels down a case study is a worse experience
 * than arriving.
 */
export function SectionNav({ sections }: { sections: readonly SectionRef[] }) {
  const active = useActiveSection(sections.map((section) => section.id));

  return (
    <nav
      aria-label="On this page"
      /*
       * `self-start` is load-bearing: a flex item stretches to the row's height
       * by default, and an element as tall as its container has nowhere to stick
       * to. The max-height is what stops thirteen sections running off the bottom
       * of a short laptop screen.
       */
      className="hidden rail shrink-0 self-start sticky top-[var(--header-clearance)] max-h-[calc(100vh-var(--header-clearance))] overflow-y-auto pb-gap lg:block"
    >
      <p className="type-eyebrow text-muted">On this page</p>

      {/*
        An <ol>, because the order is the argument the same way it is in the
        page. The hairline is on the list rather than on each item, so it is one
        continuous rule that the active marker sits on top of.
      */}
      <ol className="mt-tight border-l border-border">
        {sections.map((section, index) => {
          const current = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                /*
                 * 'location' rather than 'true'. The header nav already uses
                 * 'page' for the route you are on and 'true' for a route you are
                 * inside; this is neither, it is a position within the page, and
                 * that is exactly what 'location' is for.
                 */
                aria-current={current ? 'location' : undefined}
                // Puts a clipped heading back on hover. Not the accessible
                // name: the link's own text is that, and it is the whole
                // heading whether or not the ellipsis is showing.
                title={section.heading}
                /*
                 * The marker is a segment of the rule, pulled one pixel left so
                 * its 2px covers the list's 1px rather than sitting beside it.
                 * Transparent when inactive, so the item does not shift by two
                 * pixels when it becomes current.
                 *
                 * Colour is not the only channel: the segment is present or
                 * absent, which is a difference in shape. `py-tight` puts the
                 * target at roughly 36px, clear of the 24px floor in SC 2.5.8.
                 */
                className={`-ml-px flex gap-tight border-l-2 py-tight pl-stack type-meta transition-colors motion-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-interactive ${
                  current
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-fg'
                }`}
              >
                {/*
                  Padded to two digits and held at its own width, matching the
                  label on the heading it points at, so the headings in the rail
                  sit on one left edge instead of shifting by a character at ten.
                */}
                <span className="shrink-0">{String(index + 1).padStart(2, '0')}</span>
                {/*
                  One line, clipped rather than wrapped. Thirteen entries of one
                  or two or three lines each gave the rail a ragged right edge
                  and no fixed row height, so scanning it meant reading it. At
                  one line per section the list is a column of even rows and the
                  eye finds the marked one without stopping.

                  The cost is real and it is paid by the longest headings, which
                  lose their last few words to an ellipsis. Three things keep
                  that from being a defect: the number beside it is unambiguous
                  on its own, the full heading is still the link's accessible
                  name and still reaches a screen reader, and `title` puts it
                  back on hover for anyone who wants it.

                  `min-w-0` is what makes the clip happen at all. A flex item's
                  floor is its content, so without this the span refuses to
                  shrink and `truncate` has nothing to truncate against.
                */}
                <span className="min-w-0 truncate">{section.heading}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
