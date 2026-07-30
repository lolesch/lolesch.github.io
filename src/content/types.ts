export type Lens = 'UX/UI' | 'Systems & Architecture' | 'Games / XR' | 'AI Workflow';

// Rides on the record from the start even though nothing reads it yet, so the
// featured/bridge/archive split and the v2 Router cost no model change.
export type Tier = 'featured' | 'bridge' | 'archive';

// `embed` resolves through a registry (FigureId -> React component), which is
// what keeps "content is data" true: the data names a figure, it does not
// carry one.
export type FigureId = 'rollhaus-architecture';

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
  | { kind: 'embed'; heading: string; caption: string; figure: FigureId };

export type Project = {
  slug: string;
  title: string;
  year: string; // "2026", "2020-21"
  context: string; // "Course project, pair". The honest label, never omitted
  role: string;
  lenses: readonly Lens[];
  tier: Tier;

  // The three fixed schema lines from CONTEXT.md. These are the tile.
  problem: string;
  whatIDid: string;
  whatChanged: string;

  // Only what has substance. May be empty. Never padded to look complete.
  sections: readonly Section[];
};
