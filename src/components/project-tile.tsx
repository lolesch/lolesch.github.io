import Image from 'next/image';
import Link from 'next/link';
import { LensChip } from '@/components/lens-chip';
import type { Project } from '@/content/types';
import { scrimGradient } from '@/lib/scrim';

/**
 * `featured` renders at the full frame, `bridge` two-up. The prop exists because
 * two things vary with it and neither can be derived from CSS: the `sizes` hint,
 * which has to name a real width, and the title's type role, which is a
 * different job at 976px than at 470px rather than the same job scaled.
 *
 * It takes the size rather than reading `project.tier` so the component says
 * what it renders instead of knowing the taxonomy. Which tier gets which size is
 * src/components/project-grid.tsx's decision.
 */
export type TileSize = 'featured' | 'bridge';

export function ProjectTile({
  project,
  size = 'bridge',
}: {
  project: Project;
  size?: TileSize;
}) {
  return (
    <article
      // position: relative so the link's ::after can cover the whole card, and
      // :has() so focus is visible on the card rather than only on the heading
      // text. Bordered rather than filled, and now for a different reason than
      // when it was written: `muted` on `surface` cleared AA when the CV palette
      // landed, so the constraint that decided this is the lens chip, which
      // measures 4.02:1 on `surface` in light and has to sit on `bg`.
      //
      // `w-full` is load-bearing rather than defensive. The <li> around this is
      // a flex container, so without it the article sizes to its text content,
      // which is invisible in a two-column grid where the track sets the width
      // and obvious in a one-column one where nothing does.
      //
      // `group` so the thumbnail can read the card's state; `has-[a:hover]`
      // rather than a plain `:hover` so hover and focus resolve through the same
      // selector the outline already uses, and the state is the *link's* rather
      // than the article's. They coincide today, because the link's ::after
      // covers the card, and if that ever stops being true this is the reading
      // that stays correct.
      //
      // The border promoting to `fg` is the load-bearing half of the hover.
      // Motion is the half a reduced-motion visitor never sees, and colour alone
      // is what SC 1.4.1 is about, so the state has to survive with the
      // thumbnail held still. It does: border, plus the underline on the title.
      //
      // `transition-[border-color]` and not `transition-colors`, which is what
      // this said first and which was visibly wrong the moment the theme was
      // thrown: `transition-colors` covers `color` too, so every line of text on
      // the card faded across 160ms while the rest of the page changed
      // instantly. A card is not a place where the theme arrives late. Only the
      // border is a state here, so only the border transitions.
      //
      // Filled and raised since 2026-08-05, against bordered-on-`bg` before.
      // The card had a 1px hairline and nothing else, and `surface` measured
      // 1.05:1 against the page in dark and 1.12:1 in light, so four cards read
      // as four outlines drawn on one flat plane. Both halves of that changed:
      // `surface` moved to 1.24:1 and 1.18:1, and the shadow does the rest of
      // the work in light mode, where a fill that faint cannot.
      //
      // What made this safe is the pair the fill would have broken. `muted` on
      // `surface` is in CONTRAST_PAIRS and the tile renders exactly that on its
      // metadata line, so the new value was chosen against it rather than by
      // eye: one step lighter in dark measured 4.34:1 and was rejected.
      //
      // The lens chips are why this was not done sooner, and they are still the
      // constraint: `capability` on `surface` is 4.02:1 in light, under AA. They
      // sit on `bg` inside the card body, which is now a fill inside a fill.
      // That is a real cost, paid because the alternative was a card that could
      // not be seen.
      //
      // `transition-[border-color,box-shadow]` and still not `transition-colors`,
      // for the reason the old comment gives: `colors` covers `color`, so every
      // line of text on the card faded across 160ms while the rest of the page
      // threw the theme instantly.
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-card border border-border-interactive bg-surface shadow-raised transition-[border-color,box-shadow] motion-state has-[a:focus-visible]:border-fg has-[a:focus-visible]:shadow-lifted has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-border-interactive has-[a:hover]:border-fg has-[a:hover]:shadow-lifted"
    >
      {/*
        `border-media` rather than `border-interactive`: the image is inside the
        link but it is not the control, and borrowing the control token for
        media is a mistake _build-log.md already records once. Here it is a
        bottom edge only, because the card's own border carries the rest.

        Fixed aspect ratio with object-cover, so thumbnails of different native
        sizes present as one row. Without it the grid's rhythm follows whatever
        the source images happen to measure.

        A one-cell grid rather than a positioned box, and that part is not
        cosmetic: it is what makes the click target claim below true.

        `after:inset-0` resolves against the nearest *positioned* ancestor. While
        the title was an absolutely positioned overlay, that ancestor was the
        <h3>, so the card's target was the scrim and not the card, and the
        comment on the link said otherwise. At the bottom edge the scrim was 55%
        of the thumbnail and the gap between claim and behaviour was easy to
        miss. At the top it would have been a ~120px band, which is the version
        that would have got noticed.

        Stacking the image and the title in one grid cell needs no positioning at
        all, so the <h3> stays static and the pseudo-element resolves against the
        <article>. `z-10` orders it above the image without positioning it:
        z-index applies to a grid item as it stands, and a stacking context is
        not a containing block. The image keeps its own `relative` wrapper, which
        `fill` requires, and that wrapper is now the title's sibling rather than
        its ancestor.
      */}
      <div className="grid aspect-[16/10] w-full overflow-hidden border-b border-border-media">
        <div className="relative col-start-1 row-start-1">
          <Image
            src={project.thumb.src}
            alt={project.thumb.alt}
            fill
            // Both branches name the width the tile actually gets, so the browser
            // stops shipping a full-viewport source into a card-sized slot. The
            // numbers track src/components/project-grid.tsx: a featured tile is
            // the 61rem content box, a bridge tile is 29.75rem at its widest and
            // full-width below roughly 48rem, where the second column stops
            // fitting. Change the track minimum and these move with it.
            sizes={
              size === 'featured'
                ? '(max-width: 64rem) 100vw, 61rem'
                : '(max-width: 48rem) 100vw, 30rem'
            }
            // The one thing that moves, and it moves *inside* a box whose size is
            // fixed by the aspect ratio above. Scaling the card instead was the
            // obvious reading of "scale it up" and it was rendered and rejected:
            // the featured tile is already the full content box, so it grows past
            // the frame and the page's left margin stops being the left margin,
            // and in the two-up grid it eats the gap the spacing token is there to
            // hold. A grid that reflows under the pointer is a grid you cannot aim
            // at.
            //
            // 1.04 rather than a round Tailwind step. `scale-105` crops visibly at
            // bridge size, where the frame is only ~470px wide, and the effect
            // wants to be felt rather than watched.
            //
            // `motion-safe` and not `motion-reduce`: under a reduced-motion
            // setting this does not happen instantly, it does not happen. An
            // instant 4% jump is not a vestibular trigger but it is not feedback
            // either, and the border and the underline are already carrying the
            // state on their own.
            //
            // The variant is on the scale and not on the two transition classes,
            // which is the arrangement that survives compilation. `motion-safe:`
            // stacked onto `motion-state` came out of Tailwind with the variant's
            // own media query *dropped*, because the role already carries an
            // at-rule and the two could not be nested. The result was harmless,
            // both arms of the role were still emitted, and it was a class name
            // asserting something the stylesheet did not do. It was also
            // redundant: the role answers the setting by itself, so gating the
            // scale is the whole of what was left to say.
            className="object-cover transition-transform motion-state motion-safe:group-has-[a:focus-visible]:scale-[1.04] motion-safe:group-has-[a:hover]:scale-[1.04]"
          />
        </div>

        {/*
          The title sits on the image rather than under it, chosen from five
          rendered variants on 2026-08-04. It moved from the bottom edge to the
          top on 2026-08-05, and the scrim stopped being opaque in the same
          change; both are argued in `_build-log.md` and in src/lib/scrim.ts.

          Content-sized rather than a percentage of the image, which the previous
          version was and which cannot work at both sizes at once. A block of
          55% is 335px on the featured tile carrying a 44px line, and 162px on a
          bridge tile carrying a 30px one; tuning the stops for one puts the
          glyph tops of the other outside the covered zone, which is how the
          bottom scrim reached 40% by trial. Sized by its contents, the block is
          whatever the role in it needs, and one set of stops is right for both.

          Both paddings are in `em`, so the block scales with whichever type role
          is in it instead of being one measurement for two sizes. That is
          Leonid's note on 2026-08-05: the bridge tile looked right and the
          featured one, at half again the type size with identical padding,
          looked cramped against the top edge.

          `em` rather than a second pair of arbitrary values behind the same
          `size` branch, because the relationship is the thing being expressed.
          The inset is three quarters of the title's own size and the fade runway
          is two and a quarter times it, which reproduces the bridge tile exactly
          as it was, 24px and 72px under a 32px role, and gives the featured one
          36px and 108px under its 48px role. Change a type role and the scrim
          follows with no second edit.

          Not a Semantic space token, and that is the same call as the theme
          toggle's 2.5rem track and /about's 200px portrait: a measurement that
          serves one element is geometry. These are more clearly so than most,
          because they are ratios to a font size rather than lengths at all.

          Centred, which reverses the call made on 2026-08-04 and is Leonid's,
          on the rendered result. What the old comment defended, every block on
          the page starting at the same left edge, is still true of the page and
          is now false of this one card. Worth knowing when a thumbnail carries
          its own centred UI text: on the Rollhaus editor the title lands beside
          "Select Your Skates" and the two read as one row of unrelated words.

          `text-on-scrim` rather than inheriting `fg`, and it is not a detail.
          The scrim is dark in both themes, so the type on it has to be fixed in
          the same direction or the light theme renders dark ink on a dark band.
          The pair is why both are Semantic roles instead of one component
          reaching for the dark theme's colours by hand.
        */}
        {/*
          One role larger at both sizes since 2026-08-05, on Leonid's reading of
          the rendered cards: `display` on the featured tile and `title` on a
          bridge tile, against `title` and `heading` before.

          This is the second call site for `display`, which until now was the
          home h1 alone and was the one type role closest to being inventory. It
          is defensible here for the reason the size split exists at all: the
          featured tile is a 610px-tall image inside a 976px box, and 2rem of
          serif floating at the top of it read as a caption rather than as the
          name of the thing. It does put a card title level with the page
          headline, which is a hierarchy cost paid knowingly: the two never share
          a screen, and inside the projects section this *is* the headline.
        */}
        <h3
          className={`col-start-1 row-start-1 z-10 self-start p-[0.75em] pb-[2.25em] text-center text-on-scrim ${
            size === 'featured' ? 'type-display' : 'type-title'
          }`}
          style={{ backgroundImage: scrimGradient }}
        >
          <Link
            href={`/projects/${project.slug}/`}
            // The whole card is the click target. The link name stays the
            // project title, which is what a screen reader reads out of a link
            // list. Wrapping the card in one <a> instead would flatten the
            // heading out of screen-reader navigation and name the link after
            // the entire tile, thumbnail alt text and all.
            className="after:absolute after:inset-0 hover:underline focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h3>
      </div>

      <div className="flex flex-col gap-tight p-gutter">
        {/*
          Two of the three schema fields, not all three. `role` came off on
          2026-08-02 because the chips below already say it and say it better:
          Rollhaus read "UX + design systems" here and then "UX/UI" and
          "Systems & Architecture" one line down, which is the same claim in two
          voices. The lenses are also the site's own taxonomy, the thing the v2
          Router will filter on, so between the two the chips are the one that
          has a second job.

          `year` and `context` stay. Neither is duplicated anywhere on the card,
          and "Course project, pair" is the honest label guardrail 5 asks for on
          the surface most people will read instead of the page. There is a
          guard on it in tests/export/static-export.test.ts.

          `role` is not lost: the detail page still opens with all three, which
          is where full attribution belongs and where nobody is scanning.
        */}
        <p className="type-meta text-muted">
          {project.year} · {project.context}
        </p>

        <ul className="flex flex-wrap gap-tight">
          {project.lenses.map((lens) => (
            <LensChip key={lens} lens={lens} />
          ))}
        </ul>

        <p className="type-body">{project.summary}</p>
      </div>
    </article>
  );
}
