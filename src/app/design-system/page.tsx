import type { Metadata } from 'next';
import { TokenChain } from '@/components/design-system/chain';
import { FixedLayer, SemanticLayer } from '@/components/design-system/colour';
import { ContrastTable, ScrimBound } from '@/components/design-system/contrast-table';
import { Disclosure } from '@/components/design-system/disclosure';
import { ComponentGallery } from '@/components/design-system/gallery';
import { ReadingPage } from '@/components/reading-page';
import { SectionHeading } from '@/components/section-heading';
import {
  RadiusScale,
  ShadowScale,
  SpaceScale,
  TypeRoleProperties,
  TypeRoles,
  TypeScale,
} from '@/components/design-system/scales';
import {
  DESIGN_SYSTEM_SECTIONS,
  designSystem,
  ENFORCED_RULES,
  INTERACTION_RULES,
  PILLARS,
  SEMANTIC_COLOURS,
  TYPE_ROLES,
} from '@/content/design-system';
import { type Layer, readTokens } from '@/lib/tokens';

export const metadata: Metadata = {
  // Middot rather than an em-dash, matching the root layout.
  title: 'Design System · Leonid Schreiber',
  description: designSystem.intro,
};

/*
 * Local rather than reused from src/components/sections.tsx. ContentSections
 * walks a Section[] and wraps each entry in its own <section><h2>, which is
 * right for a page that is a list of sections and wrong for this one: it
 * interleaves prose with generated tables, and a linear walk cannot express
 * that. The prose is still typed as the `prose` arm of Section, so the copy
 * guards and the markup match what every other page uses.
 */
function Prose({ body }: { body: readonly string[] }) {
  return (
    <div className="mt-gap space-y-gap type-body">
      {body.map((paragraph) => (
        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
      ))}
    </div>
  );
}

/*
 * Restructured 2026-08-04. The order used to be layers, families, rules,
 * contrast, built, which is the order the system was constructed in and the
 * wrong one to read it in: the page opened on 12 Primitive swatches and put
 * every decision behind them.
 *
 * Now the decisions come first, then the components those decisions produce,
 * and the inventory that used to open the page sits behind disclosures. Nothing
 * was deleted. The three things no other portfolio has, the build-time reading,
 * the enforced rules and the computed contrast table, are all still here
 * and are now reachable without scrolling past a token dump to find them.
 */
export default function DesignSystemPage() {
  // Read once, at build time, and passed down. The page is a Server Component
  // and this never reaches the browser.
  const tokens = readTokens();
  const of = (layer: Layer, family?: string) =>
    tokens.filter(
      (token) => token.layer === layer && (family === undefined || token.family === family),
    );

  // Colour only for the layer rows: the chain is legible there in a way it is
  // not for a size. The other families get their own section below.
  const primitiveColour = of('primitive').filter((token) => token.value.startsWith('#'));
  const brand = of('brand');

  return (
    /*
      The one reading page whose contents are a list rather than derived from
      one. This page composes its eight sections by hand, because it interleaves
      prose with generated tables and a linear walk cannot express that, so the
      rail is fed from DESIGN_SYSTEM_SECTIONS and an export test asserts that
      list still matches the headings this page renders, in order.
    */
    <ReadingPage sections={DESIGN_SYSTEM_SECTIONS}>
      <h1 className="type-title text-balance">Design System</h1>
      <p className="mt-gap type-lead text-muted">{designSystem.intro}</p>
      {/*
        The restraint line, once, directly under the intro so it is read before
        the reader has counted anything. It is a decision, not a caption.
      */}
      <p className="mt-gap type-body">{designSystem.restraint}</p>

      <section aria-labelledby="pillars">
        <SectionHeading id="pillars" index={1}>
          {designSystem.pillars.heading}
        </SectionHeading>
        <Prose body={designSystem.pillars.body} />

        <dl className="mt-gap grid gap-gap rounded-card border border-border p-gutter type-body">
          {PILLARS.map((pillar) => (
            <div key={pillar.title}>
              <dt className="type-emphasis">{pillar.title}</dt>
              <dd className="text-muted">{pillar.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/*
        Second, before any token. A reader who stops here has still seen the
        system do its job, which was not true of any earlier version of this
        page.
      */}
      <section aria-labelledby="in-place">
        <SectionHeading id="in-place" index={2}>
          {designSystem.inPlace.heading}
        </SectionHeading>
        <Prose body={designSystem.inPlace.body} />
        <ComponentGallery />
      </section>

      {/*
        Directly under the gallery, because it is about the things in it. A
        reader who has just been told to hover the card is one paragraph away
        from what the hover is made of.
      */}
      <section aria-labelledby="interaction">
        <SectionHeading id="interaction" index={3}>
          {designSystem.interaction.heading}
        </SectionHeading>
        <Prose body={designSystem.interaction.body} />

        {/*
          The two tokens read out of the generated stylesheet like every other
          value on this page, rather than written into the copy. A tempo quoted
          in prose is a number that can go stale; this one cannot.
        */}
        <dl className="mt-gap grid gap-gap rounded-card border border-border p-gutter type-body">
          {of('semantic', 'motion').map((token) => (
            <div key={token.name}>
              <dt className="type-code">{token.name}</dt>
              <dd className="text-muted">{token.value}</dd>
            </div>
          ))}
        </dl>

        <dl className="mt-gap grid gap-gap rounded-card border border-border p-gutter type-body">
          {INTERACTION_RULES.map((rule) => (
            <div key={rule.rule}>
              <dt className="type-emphasis">{rule.rule}</dt>
              <dd className="text-muted">{rule.why}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="layers">
        <SectionHeading id="layers" index={4}>
          {designSystem.layers.heading}
        </SectionHeading>
        <Prose body={designSystem.layers.body} />

        {/*
          One traced colour in the scan path, the full grids behind it. Started
          from the Semantic end because that is the only end a component is
          allowed to hold, and the walk finds the rest.
        */}
        <TokenChain from="--ds-color-fg" tokens={tokens} />

        {/*
          Counts are computed, never authored. The spec's own hand-written
          "13 Brand" was already wrong two days later, on a page whose argument
          is that documentation cannot drift from what ships.
        */}
        <Disclosure summary={`Every fixed token (${primitiveColour.length + brand.length})`}>
          <h3 className="mt-gap type-subheading">Primitive ({primitiveColour.length})</h3>
          <FixedLayer tokens={primitiveColour} />

          <h3 className="mt-section type-subheading">Brand ({brand.length})</h3>
          <FixedLayer tokens={brand} />
        </Disclosure>

        {/*
          The Semantic row stays open. It is short, it is the only layer a
          component may touch, and it is the one that moves with the theme, which
          is the demonstration the prose above asks the reader to watch for.
        */}
        <h3 className="mt-section type-subheading">Semantic ({SEMANTIC_COLOURS.length})</h3>
        <SemanticLayer entries={SEMANTIC_COLOURS} tokens={tokens} />
      </section>

      <section aria-labelledby="families">
        <SectionHeading id="families" index={5}>
          {designSystem.families.heading}
        </SectionHeading>
        <Prose body={designSystem.families.body} />

        <h3 className="mt-section type-subheading">Space ({of('semantic', 'space').length})</h3>
        <SpaceScale tokens={of('semantic', 'space')} />

        <h3 className="mt-section type-subheading">Type sizes ({of('semantic', 'text').length})</h3>
        <TypeScale tokens={of('semantic', 'text')} />

        <h3 className="mt-section type-subheading">Type roles ({TYPE_ROLES.length})</h3>
        <TypeRoles roles={TYPE_ROLES} />
        <Disclosure summary="What each role sets">
          <TypeRoleProperties roles={TYPE_ROLES} tokens={tokens} />
        </Disclosure>

        <h3 className="mt-section type-subheading">Radius ({of('semantic', 'radius').length})</h3>
        <RadiusScale tokens={of('semantic', 'radius')} />

        {/*
          Last, and newest: the family landed on 2026-08-05 with the filled
          project card. It is the only one here whose two values are identical
          in both themes, which is a decision rather than an oversight and is
          argued where it is made, in scripts/build-tokens.mjs.
        */}
        <h3 className="mt-section type-subheading">Elevation ({of('semantic', 'shadow').length})</h3>
        <ShadowScale tokens={of('semantic', 'shadow')} />
      </section>

      <section aria-labelledby="rules">
        <SectionHeading id="rules" index={6}>
          {designSystem.rules.heading} ({ENFORCED_RULES.length})
        </SectionHeading>
        <Prose body={designSystem.rules.body} />

        <dl className="mt-gap grid gap-gap rounded-card border border-border p-gutter type-body">
          {ENFORCED_RULES.map((rule) => (
            <div key={rule.rule}>
              <dt>{rule.rule}</dt>
              <dd className="text-muted">{rule.why}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="contrast">
        <SectionHeading id="contrast" index={7}>
          {designSystem.contrast.heading}
        </SectionHeading>
        <Prose body={designSystem.contrast.body} />
        <ContrastTable />
        <ScrimBound />
      </section>

      <section aria-labelledby="built">
        <SectionHeading id="built" index={8}>
          {designSystem.built.heading}
        </SectionHeading>
        <Prose body={designSystem.built.body} />
      </section>
    </ReadingPage>
  );
}
