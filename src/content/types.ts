export type Lens = 'UX/UI' | 'Systems & Architecture' | 'Games / XR' | 'AI Workflow';

// Rides on the record from the start even though nothing reads it yet, so the
// featured/bridge/archive split and the v2 Router cost no model change.
export type Tier = 'featured' | 'bridge' | 'archive';

// `embed` resolves through a registry (FigureId -> React component), which is
// what keeps "content is data" true: the data names a figure, it does not
// carry one.
// `fermentor-stages` and `fermentor-framings` were here until 2026-08-07. Both
// were retired for the same reason and it is worth keeping: a ported figure is
// still a figure, and neither of those two was carrying an argument the prose
// around it was not already making. See `_build-log.md`.
export type FigureId = 'rollhaus-slots' | 'glyphshero-chain';

// A page renders the sections that exist and stops. There is no fixed template
// and no required section: CONTEXT.md's rule is that a section exists only if
// it has substance, never padded to look complete.
// The one outward link a section may carry, same shape as About['cv'] and for
// the same reason: the record says what it points at, the component knows how
// it opens. Optional, because most sections have nothing to link to and none is
// improved by being handed something. It exists because a prototype the reader
// cannot open is a claim rather than evidence.
export type SectionLink = { label: string; href: string };

// An image inside a prose section, with no caption and nothing said about it.
// Added 2026-08-07 for a figure that had been given a section of its own and
// did not need one: a heading, a section index and a caption is a lot of
// furniture around a picture whose only job is to be looked at while you read
// the sentence above it.
//
// Deliberately not a `figure` with an optional caption. The absence of a
// caption is the point, and an optional field would let one drift back in; a
// section that wants to say something about its image already has a kind.
export type Inset = { src: string; alt: string; width: number; height: number };

export type Section =
  | {
      kind: 'prose';
      heading: string;
      body: readonly string[];
      link?: SectionLink;
      inset?: Inset;
    }
  // The time/team/tools callout CONTEXT.md lists as pending polish on the case
  // study template. Label/value pairs rather than prose, because the reader
  // scans them: they answer "what was this" before the writing has to.
  | {
      kind: 'constraints';
      heading: string;
      items: readonly { label: string; value: string }[];
    }
  | {
      kind: 'figure';
      heading: string;
      caption: string;
      src: string;
      alt: string;
      width: number;
      height: number;
    }
  // Two states of one screen, side by side. A separate kind rather than two
  // `figure`s, because the claim lives in the difference between them: split
  // across two sections a reader compares from memory, and the spec's decision
  // 2 is that both states have to be visible at once. Not one pre-composed
  // image either, which would carry two pictures under a single alt string.
  //
  // A fixed pair, not a list. The renderer is a two-column grid and there is no
  // reading of "before, after, and a third thing" that the caption could carry,
  // so the type says two and the layout never has to guess.
  | {
      kind: 'comparison';
      heading: string;
      caption: string;
      items: readonly [ComparisonState, ComparisonState];
    }
  | {
      kind: 'progression';
      heading: string;
      caption: string;
      steps: readonly ProgressionStep[];
    }
  // An embedded app, and the one section that reaches a third party. It ships as
  // a facade: the poster is a real screenshot the page already carries, and the
  // iframe is not requested until the reader clicks it. `href` is the same
  // prototype as a plain link, so a reader who does not want an embedded
  // application still gets the prototype.
  | {
      kind: 'prototype';
      heading: string;
      caption: string;
      href: string;
      embedSrc: string;
      // The button the reader presses, and the name assistive technology reads
      // once the iframe is there. Both were literals inside the component until
      // 2026-08-06, and both named a roller skate, so they could not survive a
      // second project. On the record because they are copy.
      action: string;
      title: string;
      poster: { src: string; alt: string; width: number; height: number };
    }
  | { kind: 'embed'; heading: string; caption: string; figure: FigureId };

// An ordered, cumulative sequence: each step keeps what the one before it added.
// A separate kind from `comparison`, which is a fixed *pair* whose whole argument
// is the difference between two things and which therefore renders as a
// two-column grid. Here the reader follows the list rather than comparing across
// it, so it renders as an <ol> and a screen reader gets the order for free.
//
// A list rather than a tuple: four is this instance's number, not the kind's.
//
// No `link`. The prototype is its own section, because an embedded app is not a
// caption on a figure.
export type ProgressionStep = {
  label: string; // "Shoe model". Which decision this step is.
  note: string; // what it added, and what it left alone
  src: string;
  alt: string;
  width: number;
  height: number;
};

// `label` is the one thing a lone screenshot never needs: with both states
// present, the reader has to be told which is which before the caption can
// mean anything.
export type ComparisonState = {
  label: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  title: string;
  year: string; // "2026", "2020-21"
  context: string; // "Course project, pair". The honest label, never omitted
  role: string;
  lenses: readonly Lens[];
  tier: Tier;

  // The card hook. Names a decision rather than describing the project: a tile
  // that says what a project *was* is the old portfolio's failure in miniature
  // (CONTEXT.md), and the three schema lines below now open the detail page
  // instead of the card.
  summary: string;

  // Required, not optional. Every project appears in the grid and the grid is
  // now image-led, so a missing thumb is a broken card rather than a plainer
  // one. `alt` rides on the record for the same reason the figure kind carries
  // one: it is copy, and the copy guards walk src/content/**.
  thumb: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };

  // The three fixed schema lines from CONTEXT.md. They opened the tile until
  // 2026-07-31; the grid is image-led now, so they open the detail page.
  problem: string;
  whatIDid: string;
  whatChanged: string;

  // Only what has substance. May be empty. Never padded to look complete.
  sections: readonly Section[];
};

// Resolves through a registry (ContactIconId -> SVG paths) in
// src/components/contact-links.tsx, for the same reason FigureId does: the data
// names an icon, it does not carry one. A union rather than a string, so an id
// with no drawing behind it fails to compile instead of rendering an empty box.
export type ContactIconId = 'email' | 'linkedin' | 'github' | 'itch';

export type ContactLink = {
  // Not rendered as a heading since 2026-08-01, when the icon took that job.
  // It survives as the link's spoken prefix, because a picture is not an
  // accessible name and "lolesch.itch.io" alone leaves the icon unannounced.
  label: string; // "Email", "LinkedIn"
  value: string; // what the visitor reads, and the rest of the accessible name
  href: string;
  icon: ContactIconId;
  // Marks a link that leaves the site, which gets rel="noopener noreferrer".
  // false for mailto, which opens no page at all.
  external: boolean;
};

export type About = {
  // The opening line, above the sections. Not a Section: it sits beside the
  // portrait rather than under a heading.
  intro: string;
  sections: readonly Section[];
  portrait: { src: string; alt: string; width: number; height: number };
  contact: readonly ContactLink[];
  // Nullable so the page ships before the Track C re-export exists. The export
  // guard only fires when this is non-null, which is the difference between a
  // page that waits and a page that ships a broken link.
  cv: { label: string; href: string } | null;
};
