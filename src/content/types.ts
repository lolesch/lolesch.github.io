export type Lens = 'UX/UI' | 'Systems & Architecture' | 'Games / XR' | 'AI Workflow';

// Rides on the record from the start even though nothing reads it yet, so the
// featured/bridge/archive split and the v2 Router cost no model change.
export type Tier = 'featured' | 'bridge' | 'archive';

// `embed` resolves through a registry (FigureId -> React component), which is
// what keeps "content is data" true: the data names a figure, it does not
// carry one.
export type FigureId = 'rollhaus-architecture' | 'glyphshero-chain';

// A page renders the sections that exist and stops. There is no fixed template
// and no required section: CONTEXT.md's rule is that a section exists only if
// it has substance, never padded to look complete.
export type Section =
  | { kind: 'prose'; heading: string; body: readonly string[] }
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
  | { kind: 'embed'; heading: string; caption: string; figure: FigureId };

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

export type ContactLink = {
  label: string; // "Email", "LinkedIn"
  value: string; // what the visitor reads, and the link's accessible name
  href: string;
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
