// Relative, like `./types` below, rather than the @/ alias the components use.
// tests/unit/copy.test.ts pulls every module under src/content through an eager
// import.meta.glob, and vitest.config.mts declares no path aliases.
import type { SectionRef } from '../lib/sections';
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
 * Uniform bg-* on purpose. Three of them are border roles, and rendering
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
  /*
   * The two that do not move with the theme, and the only two on this list that
   * render the same swatch in both. That is the interesting thing about them
   * rather than an omission: the veil over a thumbnail is media chrome, so it
   * stays dark on a light page the way a subtitle does, and the type on it has
   * to be fixed in the same direction or the light theme puts dark ink on a dark
   * band. Throw the switch above and watch these two hold still while the seven
   * before them move.
   */
  { token: '--ds-color-scrim', utility: 'bg-scrim', role: 'Veil carrying a title over media' },
  { token: '--ds-color-on-scrim', utility: 'bg-on-scrim', role: 'The title on that veil' },
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
  { role: 'hero', utility: 'type-hero', job: 'The home headline, and the only fluid role' },
  { role: 'display', utility: 'type-display', job: 'The title on a featured project tile' },
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
 * --ds-color-accent on --ds-color-surface is under AA, so accent text sits on
 * --ds-color-bg and never inside a filled panel.
 * --ds-color-border-interactive on surface is under the 3:1 boundary, so a
 * *control* does not sit on a panel. That constraint survived the filled card
 * on 2026-08-05 rather than being waived by it: the card's own border has the
 * page on its outer side, which is the adjacency SC 1.4.11 is about and which
 * is listed below, and nothing inside the card is a control. The one link is on
 * the scrim over the thumbnail, and the lens chips are list items.
 *
 * --ds-color-capability on surface was the third of these until the same day,
 * at 4.02:1, and it is now a listed pair instead. Filling the card is what
 * moved it: the chips it holds went from sitting on `bg` to sitting on a panel,
 * which is precisely the case the old note said to add the moment something
 * rendered it. The green moved with it, one step darker in light, so the chip
 * clears AA on both. Add any remaining pair here the moment something renders
 * it.
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
    fg: '--ds-color-capability',
    bg: '--ds-color-surface',
    min: 4.5,
    // Added 2026-08-05 with the filled project card, which is the first thing
    // to render a lens chip on a panel rather than on the page. See the note
    // above: this pair is the reason the light `capability` green is a step
    // darker than it was, and listing it is what stops the next palette
    // undoing that quietly.
    role: 'capability tag text on a raised panel',
  },
  {
    fg: '--ds-color-border-interactive',
    bg: '--ds-color-bg',
    min: 3,
    role: 'control boundary (SC 1.4.11)',
  },
  {
    fg: '--ds-color-bg',
    bg: '--ds-color-accent',
    min: 4.5,
    /*
     * The one filled control on the site, added with the hero on 2026-08-05.
     * The label takes `bg` rather than a white, and that is the whole reason the
     * pair clears AA in both themes: gold is dark in light mode and light in
     * dark mode, so the type on it has to move in the opposite direction, which
     * is exactly what `bg` does for free.
     *
     * It is the tightest pair in this table at 4.54:1 in light, against 6.87:1
     * in dark, and it is listed rather than eyeballed for that reason. A Brand
     * change that darkens `accent` by a step in light mode fails here instead of
     * shipping.
     */
    role: 'label on a filled control',
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

// What tests/unit/token-discipline.test.ts bans. Kept in step with that file by
// hand, which is honest: a guard that generated its own description would
// document itself rather than the code.
//
// The count is deliberately not stated here or in the prose. It was, as "five",
// in two sentences and this comment, and the sixth rule landed on 2026-08-05
// and left all three behind. The page renders `ENFORCED_RULES.length` in the
// heading instead, which is the same argument this file makes about every other
// number on it.
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
  {
    rule: 'No component may set a duration or an easing on its own.',
    why: 'The same failure one family across. A tempo is a duration and a curve together, and a call site that takes one and forgets the other has invented a second tempo. Which property moves stays the component\'s decision, because the card animates its border and the thumbnail animates its transform and both are right.',
  },
];

export type InteractionRule = {
  /** The rule, stated as a constraint. */
  rule: string;
  /** What it prevents. Concrete, or it is not a rule. */
  why: string;
};

/*
 * Added 2026-08-05, when the project cards got a hover state and the system had
 * nothing to say about what a hover state is.
 *
 * Four, and the count is the argument rather than an accident: what a state
 * change is allowed to do turns out to be a small number of decisions, and every
 * one below is either enforced by a test or made impossible by the way the role
 * in globals.css is written. A fifth was drafted, "motion should be quick", and
 * cut for being a preference with no mechanism behind it.
 */
export const INTERACTION_RULES: readonly InteractionRule[] = [
  {
    rule: 'A state is never carried by motion alone.',
    why: 'Motion is invisible to a visitor who has asked their system for less of it, and colour alone fails SC 1.4.1 for everyone else. So the card that lifts its thumbnail also promotes its border and underlines its title, and holding the thumbnail still costs the state nothing.',
  },
  {
    rule: 'Nothing that answers a pointer may change the layout.',
    why: 'Scaling a card was the first thing tried and the grid reflowed under the cursor. The featured tile is already the full content box, so it grew past the page frame, and the two-up row ate the gap the spacing token exists to hold. What moves now moves inside a box whose size is fixed.',
  },
  {
    rule: 'Hover and focus are one state, resolved by one selector.',
    why: 'They are the same question asked by a mouse and by a keyboard. Writing them apart is how one of them ends up a step behind the other, and it is usually the keyboard.',
  },
  {
    rule: 'The reduced-motion answer lives in the role, not at the call site.',
    why: 'A guard that has to be remembered gets forgotten, and this one fails invisibly to everyone it does not affect. The role drops its duration to zero on its own, so a state still changes and stops travelling; anything that should not happen at all is marked where it is written.',
  },
];

export type Pillar = {
  /** The decision, stated as a rule. */
  title: string;
  /** What it buys, and what it costs. One sentence each way where both apply. */
  body: string;
};

/*
 * Added 2026-08-04, at the top of the page, above every swatch.
 *
 * The page used to open on 12 Primitives and answer "what tokens exist". The
 * question a reader actually arrives with is which decisions hold this together
 * and what they bought, and that was answerable only by reading five sections of
 * prose interleaved with tables. These are those decisions, stated once.
 *
 * Four, not more. Each one is enforced somewhere further down the page, so a
 * pillar that could not point at its own proof did not get written: "tokens are
 * themeable" and "the scale is consistent" were both drafted and cut for that
 * reason. Tone tell #3 is the risk this section runs, and the defence is that
 * every line below names a mechanism rather than a virtue.
 */
export const PILLARS: readonly Pillar[] = [
  {
    title: 'A component may touch one layer, and it is the layer with a job attached.',
    body: 'Primitive is a value, Brand names it in this site\'s voice, Semantic names what it is for. Reaching past Semantic means a colour was chosen for how it looks, and nothing above can move it again. The cost is a name for everything, including the two border roles that resolve to the same value today.',
  },
  {
    title: 'A type role carries five decisions, not one.',
    body: 'Size, weight, line height, letter spacing and family are fixed together, so a call site names a job and gets all of it. There is no size utility to reach for on its own. This exists because one heading on this site shipped at the wrong line height beside seven that did not, and nothing could catch it.',
  },
  {
    title: 'The rules run in the test suite, not in a document.',
    body: 'They run over every file under src and public, on every build. Tokens without enforcement are a naming convention, and a convention is what everyone follows until the week they are busy.',
  },
  {
    title: 'Contrast is computed, never asserted.',
    body: 'Every pair the site renders is measured from the resolved token values in both themes, by the same function on this page and in the tests. A palette change that breaks a ratio fails the build. A pair nothing renders is not listed, because an unrendered pair passing tells you nothing.',
  },
];

export const designSystem: {
  intro: string;
  restraint: string;
  pillars: Prose;
  inPlace: Prose;
  interaction: Prose;
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

  pillars: {
    kind: 'prose',
    heading: 'What holds it together',
    body: [
      'Four decisions, each enforced somewhere below rather than promised here.',
    ],
  },

  inPlace: {
    kind: 'prose',
    heading: 'The system in place',
    body: [
      'Every control below is the component that ships elsewhere on this site, imported rather than rebuilt for this page. The lens chips are the ones on the project cards, the switch is the one in the header, and throwing it moves the Semantic swatches further down while the two layers above them hold still.',
      'Hover them, and tab through them. States are live here rather than pinned as separate styles, which would mean keeping a second copy of each one in step with the first.',
    ],
  },

  interaction: {
    kind: 'prose',
    heading: 'How things respond',
    body: [
      'The system had a colour role for every surface, eleven type roles, and no answer to what a control does when you touch it. The project cards above are where that stopped being theoretical: a title that underlines is feedback at the wrong end of a card whose whole surface is the target.',
      'One motion role, carrying a duration and a curve, because those two are only a tempo when they arrive together. What moves is left to the component: a card animates its border, a thumbnail animates its transform, and a role that fixed the property would have to be two roles or a lie.',
      'Four rules govern the rest. Each one is either checked by the test suite or made impossible by how the role is written, which is the same standard the five above are held to.',
    ],
  },

  layers: {
    kind: 'prose',
    heading: 'Three layers, one direction',
    body: [
      "A Primitive is a raw value with no opinion about where it goes. A Brand token gives that value a name in this site's voice. A Semantic token names a job, and it is the only layer a component is allowed to touch.",
      'The chain stays visible in the file the browser receives, because the build emits each layer as a reference to the one below rather than flattening it to a value. Change a Brand token and every Semantic role above it moves, with no component involved.',
      'Body text is the shortest example. Three names resolve to one value, and each name answers a different question: what the number is, what this site calls it, and what it is for.',
      'Only the Semantic row varies by theme, so it is the first link that re-points in dark and nothing below it moves. That is also why the two fixed layers are shown here as values and the Semantic row is not. Switch the theme and watch which one changes.',
      'Two Semantic colours do not re-point, and they are the exception that shows what the layer is for. The scrim over a thumbnail and the text on it stay dark and light respectively in both themes, because the veil is chrome belonging to the photograph rather than surface belonging to the page. Naming the job rather than the colour is what makes that sayable: a component asks for the role and is correct in both themes without knowing which one is on.',
    ],
  },

  families: {
    kind: 'prose',
    // Was "Space, type and radius" until 2026-08-05, when elevation became a
    // fourth family under it and the heading started listing three of four. A
    // heading that enumerates its contents has to be edited every time they
    // change, and this page's whole argument is that nothing here drifts from
    // what ships. Naming the job instead means the next family costs no edit.
    heading: 'The families under colour',
    body: [
      'The same three layers carry everything else. These are shown at the size they render rather than as a table of numbers, because the question is whether the steps are far enough apart to see.',
      'Type is two things. A size ramp, and the roles built on it. Each role is set below in the utility that renders it, so what you are reading is the role rather than a description of one, and the five properties each one fixes are in the table under them.',
      // Added with the family, and it says the thing worth knowing about it
      // rather than describing the swatches, which are directly underneath.
      'Elevation is the one family that does not move with the theme. Throw the switch and the two shadows hold still while everything above them changes: there is one light source in both themes, and what differs is only how much of it you can see once the surface underneath has gone dark.',
    ],
  },

  rules: {
    kind: 'prose',
    heading: 'The rules that hold it together',
    body: [
      'Tokens without enforcement are a naming convention. These run in the test suite on every build, over every file under src and public. The count is in the heading because it is read from the list rather than written into this sentence, which is where it was until a sixth rule arrived and left the number behind.',
      'This page is inside them, with no exemption. It renders the two fixed layers from values read at build time, and the Semantic layer through the same utilities every component uses, which is why the swatches below switch with the theme and the ones above them do not.',
      'Three of the Semantic roles are borders, and two of them resolve to the same value today. One is the decorative hairline, one is the 3:1 boundary that identifies a control, and one frames a photograph. Two roles that agree can diverge later without touching a component, which is the whole point of naming the job rather than the colour.',
    ],
  },

  contrast: {
    kind: 'prose',
    heading: 'Contrast, measured on every build',
    body: [
      'Every pair the site renders is measured against WCAG 2.2 AA from the resolved token values, in both themes. The numbers below are computed on this page by the same function the test suite uses, so a Brand change that breaks a ratio fails the build before it reaches here.',
      'A pair nothing renders is not listed. An unrendered pair passing tells you nothing.',
      'One pair is not a pair of tokens. A project title sits on a translucent scrim over a photograph, so what the letters resolve against is the scrim diluted by whatever pixel the image put there. Earlier versions of that card avoided the problem by making the scrim opaque, and the comment in the code said the ratio was not computable at build time.',
      'It is computable as a bound. An image cannot do worse than its most hostile pixel, and there are only two candidates: the two ends of the colour space. The scrim is dark, so the pixel that hurts is white, and the number below holds for every photograph that could be dropped into the grid, including the ones not taken yet.',
      'That number is also what sets the opacity, rather than the other way round. The title is the brand gold, and gold is a mid-tone, so the veil has to be dense enough to carry it over a bright thumbnail. The floor is computable too, and the peak sits just above it. An earlier version of this card had a lighter veil and a gold title would have measured 2.53:1 on it, which is unreadable on a photograph of a pale screen and looks perfectly fine on a dark one. That is the failure this whole table exists to catch: the kind that depends on which image you happened to look at.',
      'There is one row rather than two because the scrim does not follow the theme. It is the veil over a photograph, which is chrome belonging to the image rather than surface belonging to the page, so it stays dark on a light background the way a subtitle does. It and the type on it are the only two Semantic colours here that hold still when the switch is thrown.',
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

/*
 * This page's contents, in the order it reads them.
 *
 * Every other reading page derives its contents from the Section[] it renders,
 * so the rail and the headings are one list by construction. This page cannot:
 * it composes its eight sections by hand because it interleaves prose with
 * generated tables, and the ids below are authored rather than slugged for the
 * same reason, so `in-place` stays short instead of becoming
 * `the-system-in-place`.
 *
 * The headings are referenced rather than retyped, which is the half of the
 * problem that can be solved here. The half that cannot is order and
 * completeness: nothing stops a ninth section being added to the page without
 * being added here. tests/export/section-nav.test.ts closes that by asserting
 * this list against the ids the exported page actually carries, in order, which
 * is a stronger check than anything expressible in the type.
 *
 * `rules` carries its count because the heading on the page does. A contents
 * entry that quietly differs from the heading it points at is the drift this
 * whole arrangement exists to avoid, even when the difference is an
 * improvement.
 */
export const DESIGN_SYSTEM_SECTIONS: readonly SectionRef[] = [
  { id: 'pillars', heading: designSystem.pillars.heading },
  { id: 'in-place', heading: designSystem.inPlace.heading },
  { id: 'interaction', heading: designSystem.interaction.heading },
  { id: 'layers', heading: designSystem.layers.heading },
  { id: 'families', heading: designSystem.families.heading },
  { id: 'rules', heading: `${designSystem.rules.heading} (${ENFORCED_RULES.length})` },
  { id: 'contrast', heading: designSystem.contrast.heading },
  { id: 'built', heading: designSystem.built.heading },
];
