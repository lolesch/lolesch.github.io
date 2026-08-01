import type { Metadata } from 'next';
import { FixedLayer, SemanticLayer } from '@/components/design-system/colour';
import { ContrastTable } from '@/components/design-system/contrast-table';
import { RadiusScale, SpaceScale, TypeRoles, TypeScale } from '@/components/design-system/scales';
import {
  designSystem,
  ENFORCED_RULES,
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
    <main className="mx-auto max-w-3xl px-gutter pt-gap pb-section">
      <h1 className="type-title text-balance">Design System</h1>
      <p className="mt-gap type-lead text-muted">{designSystem.intro}</p>
      {/*
        The restraint line, once, directly under the intro so it is read before
        the reader has counted anything. It is a decision, not a caption.
      */}
      <p className="mt-gap type-body">{designSystem.restraint}</p>

      <section aria-labelledby="layers" className="mt-section">
        <h2 id="layers" className="type-heading">
          {designSystem.layers.heading}
        </h2>
        <Prose body={designSystem.layers.body} />

        {/*
          Counts are computed, never authored. The spec's own hand-written
          "13 Brand" was already wrong two days later, on a page whose argument
          is that documentation cannot drift from what ships.
        */}
        <h3 className="mt-section type-subheading">Primitive ({primitiveColour.length})</h3>
        <FixedLayer tokens={primitiveColour} />

        <h3 className="mt-section type-subheading">Brand ({brand.length})</h3>
        <FixedLayer tokens={brand} />

        <h3 className="mt-section type-subheading">Semantic ({SEMANTIC_COLOURS.length})</h3>
        <SemanticLayer entries={SEMANTIC_COLOURS} tokens={tokens} />
      </section>

      <section aria-labelledby="families" className="mt-section">
        <h2 id="families" className="type-heading">
          {designSystem.families.heading}
        </h2>
        <Prose body={designSystem.families.body} />

        <h3 className="mt-section type-subheading">Space ({of('semantic', 'space').length})</h3>
        <SpaceScale tokens={of('semantic', 'space')} />

        <h3 className="mt-section type-subheading">Type sizes ({of('semantic', 'text').length})</h3>
        <TypeScale tokens={of('semantic', 'text')} />

        <h3 className="mt-section type-subheading">Type roles ({TYPE_ROLES.length})</h3>
        <TypeRoles roles={TYPE_ROLES} tokens={tokens} />

        <h3 className="mt-section type-subheading">Radius ({of('semantic', 'radius').length})</h3>
        <RadiusScale tokens={of('semantic', 'radius')} />
      </section>

      <section aria-labelledby="rules" className="mt-section">
        <h2 id="rules" className="type-heading">
          {designSystem.rules.heading}
        </h2>
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

      <section aria-labelledby="contrast" className="mt-section">
        <h2 id="contrast" className="type-heading">
          {designSystem.contrast.heading}
        </h2>
        <Prose body={designSystem.contrast.body} />
        <ContrastTable />
      </section>

      <section aria-labelledby="built" className="mt-section">
        <h2 id="built" className="type-heading">
          {designSystem.built.heading}
        </h2>
        <Prose body={designSystem.built.body} />
      </section>
    </main>
  );
}
