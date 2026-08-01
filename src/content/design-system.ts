import type { Section } from './types';

type Prose = Extract<Section, { kind: 'prose' }>;

export type SemanticColour = {
  /** The Semantic token this documents. */
  token: string;
  /** The Tailwind utility that renders it, generated because this string is here. */
  utility: string;
  /** What the role is for. Copy, which is why this list lives in content. */
  role: string;
};

/*
 * Every Semantic colour, with the utility that renders its swatch. The unit
 * guard asserts this list and the --ds-color-* set in the generated CSS are the
 * same set in both directions, so adding a token without documenting it fails
 * the build and documenting one that no longer exists fails the build.
 *
 * Uniform bg-* on purpose. Three of the nine are border roles, and rendering
 * those as a ring while the other six are fills would make the reader compare
 * two things at once. The swatch shows the colour; the role line says what it
 * is for.
 */
export const SEMANTIC_COLOURS: readonly SemanticColour[] = [
  { token: '--ds-color-bg', utility: 'bg-bg', role: 'Page background' },
  { token: '--ds-color-fg', utility: 'bg-fg', role: 'Body text' },
  { token: '--ds-color-muted', utility: 'bg-muted', role: 'Metadata and captions' },
  { token: '--ds-color-accent', utility: 'bg-accent', role: 'Links and emphasis' },
  { token: '--ds-color-capability', utility: 'bg-capability', role: 'Capability tags' },
  { token: '--ds-color-surface', utility: 'bg-surface', role: 'Raised panel fill' },
  { token: '--ds-color-border', utility: 'bg-border', role: 'Decorative hairline' },
  {
    token: '--ds-color-border-interactive',
    utility: 'bg-border-interactive',
    role: 'Control boundary, held at 3:1',
  },
  {
    token: '--ds-color-border-media',
    utility: 'bg-border-media',
    role: 'Frame around a photograph',
  },
];

export type TypeRole = {
  /** The role, matching the `--ds-type-<role>-*` group in the generated CSS. */
  role: string;
  /** The utility that renders it, literal so Tailwind generates it. */
  utility: string;
  /** What the role is for. Copy, which is why this list lives in content. */
  job: string;
};

/*
 * Every typographic role, with the utility that renders its specimen. Guarded
 * in both directions against the `type` family in the generated CSS, for the
 * same reason and by the same shape of test as SEMANTIC_COLOURS: a hand-written
 * token-to-utility list is drift surface, and the utility name has to be a
 * literal or Tailwind never generates the class.
 *
 * Ordered by size rather than alphabetically, so the list reads as a scale.
 * `emphasis` is last because it has no size: it is the one role that sets a
 * single property.
 */
export const TYPE_ROLES: readonly TypeRole[] = [
  { role: 'display', utility: 'type-display', job: 'The home headline, once there is room for it' },
  { role: 'title', utility: 'type-title', job: 'The h1 on every route' },
  { role: 'heading', utility: 'type-heading', job: 'Section headings' },
  { role: 'subheading', utility: 'type-subheading', job: 'Card titles and figure titles' },
  { role: 'lead', utility: 'type-lead', job: 'The opening line under an h1' },
  { role: 'wordmark', utility: 'type-wordmark', job: 'The name in the header' },
  { role: 'body', utility: 'type-body', job: 'Running prose' },
  { role: 'meta', utility: 'type-meta', job: 'Captions, metadata lines and chips' },
  { role: 'eyebrow', utility: 'type-eyebrow', job: 'The uppercase label above a group' },
  { role: 'code', utility: 'type-code', job: 'Token names and code specimens' },
  { role: 'emphasis', utility: 'type-emphasis', job: 'The one value that changed, inside a line' },
];

export type ContrastPair = {
  fg: string;
  bg: string;
  min: number;
  role: string;
};

/*
 * Moved here from tests/unit/contrast.test.ts on 2026-07-31 so the table a
 * reader sees and the table the build enforces are one list. They cannot
 * disagree, because there is nothing to disagree with.
 *
 * Every pair the site actually renders. A token pair that nothing renders is
 * not listed, because an unrendered pair passing tells you nothing. That
 * judgement is a human one: no test in this repo proves a listed pair is
 * rendered, or that a rendered pair is listed. It is the honest limit of the
 * table and it travels with the list rather than being stated on the page.
 *
 * Measured 2026-08-01 against the CV palette and deliberately absent:
 * --ds-color-accent on --ds-color-surface is 4.05:1 in light and
 * --ds-color-capability on surface is 4.02:1, both under AA, so accent text and
 * lens chips sit on --ds-color-bg and never inside a filled panel.
 * --ds-color-border-interactive on surface is 2.71:1 light and 2.89:1 dark,
 * under the 3:1 boundary, so a control does not sit on a panel either. Add any
 * of them here the moment something renders them.
 */
export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  { fg: '--ds-color-fg', bg: '--ds-color-bg', min: 4.5, role: 'body text' },
  { fg: '--ds-color-muted', bg: '--ds-color-bg', min: 4.5, role: 'metadata text' },
  { fg: '--ds-color-accent', bg: '--ds-color-bg', min: 4.5, role: 'accent text' },
  { fg: '--ds-color-capability', bg: '--ds-color-bg', min: 4.5, role: 'capability tag text' },
  {
    fg: '--ds-color-muted',
    bg: '--ds-color-surface',
    min: 4.5,
    // The Rollhaus figure has filled its step panels with `surface` and
    // captioned them in `muted` since 2026-07-31, and this pair was not listed
    // until 2026-08-01. On the zinc palette it measured 4.40:1 in light, under
    // AA, and three comments in this repo asserted that nothing renders on
    // `surface`. Listing it is what stops the next palette shipping the same
    // way.
    role: 'metadata text on a raised panel',
  },
  {
    fg: '--ds-color-border-interactive',
    bg: '--ds-color-bg',
    min: 3,
    role: 'control boundary (SC 1.4.11)',
  },
  {
    fg: '--ds-color-border-media',
    bg: '--ds-color-bg',
    min: 3,
    // Design intent, not a WCAG requirement, and the distinction is recorded
    // rather than blurred: SC 1.4.11 governs controls and meaningful graphics,
    // and a decorative frame around a photograph is neither. Held at 3:1 anyway
    // so a Brand change cannot quietly erase the ring, which is the whole
    // reason the token exists.
    role: 'media frame (design intent, not SC 1.4.11)',
  },
];

export type EnforcedRule = {
  rule: string;
  why: string;
};

// The five things tests/unit/token-discipline.test.ts bans. Kept in step with
// that file by hand, which is honest: a guard that generated its own
// description would document itself rather than the code.
export const ENFORCED_RULES: readonly EnforcedRule[] = [
  {
    rule: 'No component may reference a Primitive or Brand token.',
    why: 'Semantic is the only layer with a job attached. Reaching past it means a colour is chosen for how it looks rather than for what it does, and nothing above can move it again.',
  },
  {
    rule: 'No token name may be composed at runtime.',
    why: 'A name built from parts evades the rule above. This one exists to stop the first being true only literally.',
  },
  {
    rule: 'No Tailwind built-in palette class.',
    why: 'The likelier failure is not reaching past the layers but skipping them. The built-in palette is not part of the system at all.',
  },
  {
    rule: 'No colour literal in application code.',
    why: "Content is exempt, because a diagram of another product's palette is about those colours rather than styled by them. Everywhere else a hex is a token that was never minted.",
  },
  {
    rule: 'No component may set a font family, weight, line height or letter spacing on its own.',
    why: 'A type role carries all five decisions together, so a call site names a job and gets the whole of it. Reaching for one of them separately composes a role nobody named, which is how one heading on this site rendered at the wrong line height beside seven that did not.',
  },
];

export const designSystem: {
  intro: string;
  restraint: string;
  layers: Prose;
  families: Prose;
  rules: Prose;
  contrast: Prose;
  built: Prose;
} = {
  intro:
    'The tokens this site runs on, read at build time out of the same generated stylesheet the browser receives. Nothing on this page is transcribed by hand.',

  // Ships in the wording the spec fixed. Not a hedge: the three limitation
  // lines on the case studies are all "this was not validated by use", and this
  // is a restraint claim, the same family as the no-padding rule in CONTEXT.md.
  // It pre-empts "this is a small system" by showing the smallness was chosen.
  restraint:
    'This system covers what the site renders and stops there. Tokens nothing uses are inventory rather than a system.',

  layers: {
    kind: 'prose',
    heading: 'Three layers, one direction',
    body: [
      "A Primitive is a raw value with no opinion about where it goes. A Brand token gives that value a name in this site's voice. A Semantic token names a job, and it is the only layer a component is allowed to touch.",
      'The chain stays visible in the file the browser receives, because the build emits each layer as a reference to the one below rather than flattening it to a value. Change a Brand token and every Semantic role above it moves, with no component involved.',
      'Only the Semantic row varies by theme. The two rows above it are the same in light and dark, which is why they are shown here as fixed values and the row below them is not. Switch the theme and watch which row moves.',
    ],
  },

  families: {
    kind: 'prose',
    heading: 'Space, type and radius',
    body: [
      'The same three layers carry everything else. These are shown at the size they render rather than as a table of numbers, because the question is whether the steps are far enough apart to see.',
      'Type is two things. A size ramp, and the roles built on it: each role fixes a size, a weight, a line height, a letter spacing and a family together, so a call site names a job and gets all five rather than a size plus four things it has to remember.',
    ],
  },

  rules: {
    kind: 'prose',
    heading: 'The rules that hold it together',
    body: [
      'Tokens without enforcement are a naming convention. Five rules run in the test suite on every build, over every file under src and public.',
      'This page is inside them, with no exemption. It renders the two fixed layers from values read at build time, and the Semantic layer through the same utilities every component uses, which is why the swatches below switch with the theme and the ones above them do not.',
      'Three of the nine Semantic roles are borders, and two of them resolve to the same value today. One is the decorative hairline, one is the 3:1 boundary that identifies a control, and one frames a photograph. Two roles that agree can diverge later without touching a component, which is the whole point of naming the job rather than the colour.',
    ],
  },

  contrast: {
    kind: 'prose',
    heading: 'Contrast, measured on every build',
    body: [
      'Every pair the site renders is measured against WCAG 2.2 AA from the resolved token values, in both themes. The numbers below are computed on this page by the same function the test suite uses, so a Brand change that breaks a ratio fails the build before it reaches here.',
      'A pair nothing renders is not listed. An unrendered pair passing tells you nothing.',
    ],
  },

  built: {
    kind: 'prose',
    heading: 'How it is built',
    body: [
      'Tokens are authored as DTCG JSON and built by Style Dictionary into CSS custom properties. Tailwind consumes those properties through a theme block that references them rather than redefining them, so the utilities carry no colour of their own. Remove Tailwind and the token system survives untouched.',
      'Code is the source of truth and the flow runs one way. Nothing on this page is maintained by hand except the words.',
    ],
  },
};
