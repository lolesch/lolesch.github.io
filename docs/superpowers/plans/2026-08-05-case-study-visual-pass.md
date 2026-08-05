# Case Study Visual Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Rollhaus case study lead with figures rather than prose, and stop the project card's image vanishing when the reader opens the page.

**Architecture:** Two independent threads. The figure pass is content-only: eight new assets extracted from the sibling repo, two new `Section` kinds (`progression`, `prototype`), one rewritten `embed`, and five retired figures. The continuity thread turns project links into real document navigations and adds a CSS cross-document view transition that morphs the card thumbnail into a page hero. Nothing new is installed.

**Tech Stack:** Next 16.2.12 (`output: 'export'`), React 19.2.4, Tailwind v4 via `@theme inline` over Style Dictionary tokens, Vitest 4, PyMuPDF for figure extraction.

## Global Constraints

- **No em-dashes anywhere in `src/content/**`.** `tests/unit/copy.test.ts` walks every string in every content module and fails on `—`. Also banned: `TODO`, `TBD`, `FIXME`, bracketed-caps placeholders, lorem ipsum.
- **No colour literals, Tailwind palette classes, or raw type/motion properties outside a role.** `tests/unit/token-discipline.test.ts` scans `src/**` and `public/**`. `src/content/**` is exempt from the hex rule only. `src/app/globals.css` is the only file exempt from the duration/easing rule.
- **Reuse `--ds-motion-state` and `--ds-motion-ease` for the view transition.** Do not mint a new motion token. `src/content/design-system.ts:353` ships the sentence "One motion role", and a second one would make that copy false.
- **Every `Section` kind switch is closed with `never`.** Adding a kind fails typecheck in four places until handled: `src/components/sections.tsx`, `tests/unit/content.test.ts`, `tests/export/figures.test.ts`, and anywhere else tsc points.
- **Figure provenance is mandatory.** Every entry in `scripts/extract-figures.py` carries a `why`. A figure with no recorded reason is a mystery asset.
- **Alt text is copy.** It reaches screen readers and the exported HTML, and it is walked by both copy guards.
- **Run `npm run typecheck && npm test` before every commit.** `npm run test:export` additionally runs a build and is needed for tasks touching rendering.

---

## File Structure

**Created**
- `src/content/figures/rollhaus-slots.ts`: the Base Card layer tree, the four screens' slot contents, and the verified token inventory, as data
- `src/components/figures/rollhaus-slots.tsx`: renders the above on Semantic tokens
- `src/components/prototype-embed.tsx`: the click-to-load facade, the only new client component

**Modified**
- `scripts/extract-figures.py`: five entries retired, seven added, one re-sourced
- `src/content/types.ts`: `progression` and `prototype` arms, `ProgressionStep`, `FigureId` rename
- `src/content/projects.ts`: the Rollhaus `sections` array
- `src/components/sections.tsx`: two new arms, lead-figure rule removed
- `src/components/figures/registry.ts`: `rollhaus-architecture` becomes `rollhaus-slots`
- `src/components/project-tile.tsx`: `<Link>` becomes `<a>`, thumbnail gains a transition name
- `src/app/projects/[slug]/page.tsx`: hero, `<h1>` onto the scrim, back link becomes `<a>`
- `src/app/globals.css`: `@view-transition`, the header's transition name, the morph tempo
- `tests/unit/content.test.ts`, `tests/export/figures.test.ts`: new arms and the lead rule

**Deleted**
- `src/content/figures/rollhaus-architecture.ts`, `src/components/figures/rollhaus-architecture.tsx`
- `public/figures/rollhaus-options.png`, `rollhaus-panel-before.jpg`, `rollhaus-panel-after.jpg`, `rollhaus-editor-quad.jpg`, `rollhaus-editor-inline.jpg`

---

### Task 1: Extract the eight figures, retire the five

**Files:**
- Modify: `scripts/extract-figures.py:90-303` (the `FIGURES` list) and `:305-321` (the rejected-notes block)
- Delete: `public/figures/rollhaus-options.png`, `public/figures/rollhaus-panel-before.jpg`, `public/figures/rollhaus-panel-after.jpg`, `public/figures/rollhaus-editor-quad.jpg`, `public/figures/rollhaus-editor-inline.jpg`

**Interfaces:**
- Consumes: nothing.
- Produces: eight files in `public/figures/` at exact dimensions later tasks hardcode into content records: `rollhaus-editor-shoe.jpg`, `rollhaus-editor-pattern.jpg`, `rollhaus-editor-skates.jpg`, `rollhaus-editor-wheels.jpg` all **1400x994**; `rollhaus-thumb.jpg` **1120x700**; `rollhaus-atoms.jpg` **1401x1230**; `rollhaus-variables.png` **1600x386**; `rollhaus-debug.png` **1701x304**.

- [ ] **Step 1: Replace the five retired Rollhaus entries with the seven new ones**

In `scripts/extract-figures.py`, delete the dicts whose `out` is `public/figures/rollhaus-editor-quad.jpg`, `public/figures/rollhaus-editor-inline.jpg`, `public/figures/rollhaus-panel-before.jpg`, `public/figures/rollhaus-panel-after.jpg`, and `public/figures/rollhaus-options.png`. Change the `rollhaus-thumb.jpg` entry's `png` value from `"rollhaus_editor_quad.png"` to `"rollhaus_editor_03.png"` and replace its `why` with the one below. Then insert the seven new dicts after it.

```python
    {
        "out": "public/figures/rollhaus-thumb.jpg",
        "project": "rollhaus",
        "png": "rollhaus_editor_03.png",
        "crop": [22, 295, 2830, 2050],
        "width": 1120,
        "why": (
            "The project-grid card, and since 2026-08-05 also the hero at the "
            "top of the detail page, which the card morphs into. Both render "
            "the same file so the view transition has one image to move rather "
            "than two to cross-fade. Re-sourced from the wheels step of the new "
            "progression, because the card promises the finished skate and the "
            "old quad export is a different boot. Editor viewport below the "
            "browser chrome, cropped to 16:10 because the tile fixes that ratio "
            "and crops with object-cover, so framing it here is the only way to "
            "control it."
        ),
    },
    {
        "out": "public/figures/rollhaus-editor-shoe.jpg",
        "project": "rollhaus",
        "png": "rollhaus_editor_00.png",
        "crop": [22, 18, 2886, 2050],
        "width": 1400,
        "why": (
            "Step 1 of 4. Leonid clicked these four states in the prototype on "
            "2026-08-05 and exported them at an identical 2916x2086, so all four "
            "share one crop and any difference between the images is a "
            "difference in the product. This one is the boot with nothing "
            "mounted, which is the state the old quad-versus-inline pair could "
            "not show: the reader starts from almost nothing and watches the "
            "option space open. Browser chrome kept, per Leonid 2026-07-31: the "
            "PageName placeholder in the tab shows the system behind it."
        ),
    },
    {
        "out": "public/figures/rollhaus-editor-pattern.jpg",
        "project": "rollhaus",
        "png": "rollhaus_editor_01.png",
        "crop": [22, 18, 2886, 2050],
        "width": 1400,
        "why": (
            "Step 2 of 4, the pattern applied and still no mount. Identical crop "
            "to its three siblings on purpose. The eight swatches in the panel "
            "are the pattern axis of the atoms figure, seen from the product "
            "side."
        ),
    },
    {
        "out": "public/figures/rollhaus-editor-skates.jpg",
        "project": "rollhaus",
        "png": "rollhaus_editor_02.png",
        "crop": [22, 18, 2886, 2050],
        "width": 1400,
        "why": (
            "Step 3 of 4, the quad appears. The strongest of the four: its own "
            "panel thumbnails are the already-configured boot drawn as a quad, "
            "an inline, an ice skate and a plain shoe, which is the case "
            "study's claim that a thumbnail is an instance of the product "
            "rather than a static icon. This source file replaced the old "
            "inline-selected export of the same name on 2026-08-05."
        ),
    },
    {
        "out": "public/figures/rollhaus-editor-wheels.jpg",
        "project": "rollhaus",
        "png": "rollhaus_editor_03.png",
        "crop": [22, 18, 2886, 2050],
        "width": 1400,
        "why": (
            "Step 4 of 4, the wheels recolour. Eight colourways in the panel, "
            "each one a mode in the Wheels collection carrying its own type and "
            "price, which the variables figure shows directly. Same frame as the "
            "thumb crop above, so the card and the last step of the progression "
            "are the same picture at two sizes."
        ),
    },
    {
        "out": "public/figures/rollhaus-atoms.jpg",
        "project": "rollhaus",
        "pdf": COMPONENTS,
        "page": 0,
        "clip": [0.0045, 0.1228, 0.1825, 0.2665],
        "width": 1400,
        "why": (
            "The `Skates Atoms` frame, replacing the option-tree screenshot that "
            "stood at this position until 2026-08-05. That figure was a picture "
            "of text on a page arguing it needed more pictures, and the prose in "
            "the section below already enumerates the same option space. Three "
            "mounts, sixteen boots as eight patterns by two lasts, and eight "
            "wheel colourways: the option space as parts rather than as a list. "
            "Box covers all three component sets and stops at the frame edge."
        ),
        "open": (
            "Figma's dashed violet component-set outlines are inside this crop "
            "and cannot be excluded without cutting content. Kept on the "
            "argument that a UX/UI reader reads them as component sets "
            "instantly, which is the section's point. Reversing this means "
            "dropping the figure, not tightening the box."
        ),
    },
    {
        "out": "public/figures/rollhaus-variables.png",
        "project": "rollhaus",
        "png": "Variable.png",
        "crop": [0, 38, 1920, 500],
        "width": 1600,
        "why": (
            "The Figma variables panel, and the strongest single artifact in "
            "this case study. Eleven collections scoped by domain, and the "
            "Wheels collection open with its modes as columns: Default, Yellow, "
            "Green, Water blue, Blue, Orange, Black, each setting WheelColor, "
            "WheelType and WheelPrice together. That is the record's own "
            "sentence, one mode switch reconfiguring several linked elements at "
            "once, and it is the only evidence anywhere for modes, which the "
            "page could previously only assert. PNG rather than JPEG: flat dark "
            "UI and small type. The crop starts at y=38 to drop the browser tab "
            "strip, which carried unrelated tabs."
        ),
        "open": (
            "The `Test Radio Buttons` collection and two empty collections are "
            "visible and stay. They corroborate the footnote the page already "
            "ships, that this was a first variables project and the naming is "
            "ad hoc. Cropping them out would be tidying the evidence."
        ),
    },
    {
        "out": "public/figures/rollhaus-debug.png",
        "project": "rollhaus",
        "pdf": HIFI,
        "page": 0,
        "clip": [0.4190, 0.2250, 0.5530, 0.2620],
        "width": 1700,
        "why": (
            "The debug panel left on the cart screen during the build, printing "
            "live variable state in four groups. Scouted and cut on 2026-07-31 "
            "because two working-note figures on one page was one too many; the "
            "page it was cut from no longer exists. It is the second half of the "
            "variables pair: the panel above defines the state, this shows a "
            "product screen reading it. PNG for the same reason the variables "
            "crop is."
        ),
    },
```

- [ ] **Step 2: Update the rejected-notes block at the foot of the FIGURES list**

Replace the third paragraph of that block (the one beginning "The Hi-Fi debug variable panel") and add the new note, so the file records what was tried and dropped in this pass:

```python
#   The Hi-Fi debug variable panel was cut on 2026-07-31 and restored on
#   2026-08-05 as `rollhaus-debug.png`. The reason it was cut, that the page
#   could not hold two working-note figures, went away when the option tree it
#   was competing with was retired.
#
#   The slot trio, Cart / Checkout / Confirmation on the Hi-Fi canvas showing one
#   Base Card slotted three ways. Four boxes were tried on 2026-08-05 and all
#   four were rejected: [0.4290, 0.655, 0.9450, 0.980] carries the red annotation
#   and its caption; [0.4345, 0.6640, 0.9395, 0.9230] leaves a red sliver at the
#   top and cuts the suggestion cards mid-card; [0.4425, 0.6660, 0.9220, 0.8600]
#   clips the first product image at the left edge; and a panels-only band at
#   roughly 7:1 renders the summary type too small to read. The three screens sit
#   at different heights with dead canvas between them, so no single box is both
#   legible and complete. The slot argument moved into the rollhaus-slots embed
#   instead, which is where a mechanism belongs. Do not re-derive these.
```

- [ ] **Step 3: Print the provenance without writing anything, to prove the table parses**

Run: `python scripts/extract-figures.py --list`
Expected: every figure prints an `out`, `from`, `how` and `why`; `rollhaus-atoms.jpg`, `rollhaus-variables.png` and the two `open` notes appear; no traceback; exit code 0.

- [ ] **Step 4: Write the figures**

Run: `python scripts/extract-figures.py`
Expected: `wrote NNNNxNNNN ...` for every entry, no `SKIP source not found` lines.

- [ ] **Step 5: Assert the dimensions the content records will hardcode**

Run:

```bash
python -c "
import fitz, sys
want = {
 'rollhaus-editor-shoe.jpg': (1400, 994),
 'rollhaus-editor-pattern.jpg': (1400, 994),
 'rollhaus-editor-skates.jpg': (1400, 994),
 'rollhaus-editor-wheels.jpg': (1400, 994),
 'rollhaus-thumb.jpg': (1120, 700),
 'rollhaus-atoms.jpg': (1401, 1230),
 'rollhaus-variables.png': (1600, 386),
 'rollhaus-debug.png': (1701, 304),
}
bad = []
for name, (w, h) in want.items():
    p = fitz.Pixmap('public/figures/' + name)
    if (p.width, p.height) != (w, h):
        bad.append(f'{name}: got {p.width}x{p.height}, want {w}x{h}')
print('MISMATCH' if bad else 'OK')
print('\n'.join(bad))
sys.exit(1 if bad else 0)
"
```

Expected: `OK` and exit code 0. If any line mismatches, correct the number in the content records in Tasks 4 and 5 rather than forcing the crop: `next/image` uses these only for aspect ratio, and the measured value is the truth.

- [ ] **Step 6: Delete the five retired assets**

```bash
git rm public/figures/rollhaus-options.png public/figures/rollhaus-panel-before.jpg public/figures/rollhaus-panel-after.jpg public/figures/rollhaus-editor-quad.jpg public/figures/rollhaus-editor-inline.jpg
```

Note: `npm test` will now fail, because `src/content/projects.ts` still references four of these. That is expected and Task 5 fixes it. Do not patch the content here.

- [ ] **Step 7: Commit**

```bash
git add scripts/extract-figures.py public/figures/
git commit -m "feat: eight figures extracted, five retired, and the thumb becomes the last step"
```

---

### Task 2: The `progression` section kind

**Files:**
- Modify: `src/content/types.ts:10` and `:22-56`
- Modify: `src/components/sections.tsx:39-150`
- Modify: `tests/unit/content.test.ts:18-41`
- Modify: `tests/export/figures.test.ts:58-112`

**Interfaces:**
- Consumes: nothing.
- Produces: `type ProgressionStep = { label: string; note: string; src: string; alt: string; width: number; height: number }` and a `Section` arm `{ kind: 'progression'; heading: string; caption: string; steps: readonly ProgressionStep[] }`. Task 4 authors the data. No `link` field: the `prototype` kind in Task 3 owns the outward link.

- [ ] **Step 1: Write the failing test**

Add to `tests/export/figures.test.ts`, inside `describe('image figures (Seam 2)')`, immediately after the existing vacuity test:

```ts
  it('ships a progression whose steps are numbered in order', () => {
    const page = body('out/projects/rollhaus/index.html');
    const progression = projects
      .flatMap((project) => project.sections)
      .find((section) => section.kind === 'progression');
    expect(progression, 'no progression section ships').toBeDefined();
    if (progression?.kind !== 'progression') throw new Error('unreachable');

    // An <ol> rather than a stack of <figure>s is the whole reason this is a
    // separate kind: the steps are cumulative, so a screen reader has to get
    // the order. Asserting the labels appear in source order is what proves
    // the list was not reshuffled by a grid.
    const positions = progression.steps.map((step) => page.indexOf(step.label));
    expect(positions.every((at) => at >= 0), 'a step label is missing').toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm run test:export -- -t "progression"`
Expected: FAIL. Either `no progression section ships` (the section does not exist yet) or a TypeScript error on `section.kind === 'progression'` being uncomparable, depending on transform order.

- [ ] **Step 3: Add the type**

In `src/content/types.ts`, add above `ComparisonState`:

```ts
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
```

and add this arm to the `Section` union, after the `comparison` arm:

```ts
  | {
      kind: 'progression';
      heading: string;
      caption: string;
      steps: readonly ProgressionStep[];
    }
```

- [ ] **Step 4: Render it**

In `src/components/sections.tsx`, add this case to `SectionBody`, after the `comparison` case:

```tsx
    case 'progression':
      return (
        <figure className="mt-gap">
          {/*
            One step per row at the full reading width, not two-up. At the
            two-column width these screenshots land near 350px, which puts the
            panel heading under 5px tall, and the panel changing is half of what
            the figure is for. Height is the cost and it is taken deliberately.

            <ol> rather than a stack of <figure>s: the steps are cumulative and
            the order is the argument, so it has to be in the markup rather than
            only in the layout.
          */}
          <ol className="space-y-gap">
            {section.steps.map((step, index) => (
              <li key={step.src}>
                <p className="type-meta text-muted">
                  <span className="type-emphasis text-fg">
                    {index + 1}. {step.label}
                  </span>{' '}
                  {step.note}
                </p>
                <Image
                  src={step.src}
                  alt={step.alt}
                  width={step.width}
                  height={step.height}
                  className="mt-tight h-auto w-full rounded-card border border-border"
                />
              </li>
            ))}
          </ol>
          <figcaption className="mt-gap type-meta text-muted">{section.caption}</figcaption>
        </figure>
      );
```

- [ ] **Step 5: Close the two `never` switches**

In `tests/unit/content.test.ts`, add to the switch in `bodies`, after the `comparison` case:

```ts
      case 'progression':
        // Label and note as well as alt. The label names which step this is and
        // the note says what it added, so both are copy in the sense the
        // comparison label is.
        return [
          section.caption,
          ...section.steps.flatMap((step) => [step.label, step.note, step.alt]),
        ];
```

In `tests/export/figures.test.ts`, add to the switch in `imagesOf`, after the `comparison` case:

```ts
    case 'progression': {
      const { kind, heading, caption } = section;
      return section.steps.map(({ src, alt, label }) => ({
        kind,
        heading,
        caption,
        src,
        alt,
        label,
      }));
    }
```

and widen the `Shipped` type at the top of that file:

```ts
type Shipped = {
  kind: 'figure' | 'comparison' | 'progression';
  heading: string;
  caption: string;
  src: string;
  alt: string;
  label: string | null;
};
```

- [ ] **Step 6: Run typecheck and the unit suite**

Run: `npm run typecheck && npm test`
Expected: typecheck clean. Unit tests pass except any already failing from Task 1's deletions, which Task 5 fixes.

- [ ] **Step 7: Commit**

```bash
git add src/content/types.ts src/components/sections.tsx tests/unit/content.test.ts tests/export/figures.test.ts
git commit -m "feat: a progression section kind, ordered and cumulative rather than paired"
```

---

### Task 3: The `prototype` section kind and its click-to-load facade

**Files:**
- Create: `src/components/prototype-embed.tsx`
- Modify: `src/content/types.ts`
- Modify: `src/components/sections.tsx`
- Modify: `tests/unit/content.test.ts`, `tests/export/figures.test.ts`

**Interfaces:**
- Consumes: `ProgressionStep`'s sibling arms from Task 2.
- Produces: a `Section` arm `{ kind: 'prototype'; heading: string; caption: string; href: string; embedSrc: string; poster: { src: string; alt: string; width: number; height: number } }`, and `<PrototypeEmbed href embedSrc poster />`.

- [ ] **Step 1: Write the failing test**

Add to `tests/export/figures.test.ts`, as a new top-level `describe` at the end of the file:

```ts
describe('the prototype facade (Seam 2)', () => {
  const page = 'out/projects/rollhaus/index.html';

  it('ships the poster and the outward link without the iframe', () => {
    const markup = body(page);
    // The whole point of a facade: nothing third-party is requested until the
    // reader asks. An <iframe> in the exported HTML means the facade regressed
    // into a plain embed, which loads Figma's application for someone who never
    // clicked.
    expect(markup).not.toContain('embed.figma.com');
    expect(markup).toContain('figma.com/proto/');
    expect(markup).toContain('rollhaus-editor-wheels.jpg');
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm run test:export -- -t "prototype facade"`
Expected: FAIL on `expect(markup).toContain('figma.com/proto/')`, because no prototype section exists yet.

- [ ] **Step 3: Add the type**

In `src/content/types.ts`, add after the `progression` arm:

```ts
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
      poster: { src: string; alt: string; width: number; height: number };
    }
```

- [ ] **Step 4: Write the facade**

Create `src/components/prototype-embed.tsx`:

```tsx
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
```

- [ ] **Step 5: Render the section**

In `src/components/sections.tsx`, import the component at the top:

```tsx
import { PrototypeEmbed } from '@/components/prototype-embed';
```

and add this case after `progression`:

```tsx
    case 'prototype':
      return (
        <figure className="mt-gap">
          {/* `href` is not passed: the facade is the button, and the link
              below it is this renderer's job. */}
          <PrototypeEmbed embedSrc={section.embedSrc} poster={section.poster} />
          <figcaption className="mt-tight type-meta text-muted">{section.caption}</figcaption>
          <p className="mt-gap type-body">
            <a
              href={section.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4"
            >
              Open the prototype in Figma
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </figure>
      );
```

- [ ] **Step 6: Close the two `never` switches**

In `tests/unit/content.test.ts`, after the `progression` case:

```ts
      case 'prototype':
        return [section.caption, section.poster.alt];
```

In `tests/export/figures.test.ts`, in `imagesOf`, add `'prototype'` to the list of kinds returning `[]`:

```ts
    case 'prose':
    case 'constraints':
    case 'embed':
    case 'prototype':
      return [];
```

The poster is checked by the facade's own describe block above, not by the image walker, because it is a control's label rather than a figure.

- [ ] **Step 7: Run typecheck and unit tests**

Run: `npm run typecheck && npm test`
Expected: typecheck clean.

- [ ] **Step 8: Commit**

```bash
git add src/components/prototype-embed.tsx src/content/types.ts src/components/sections.tsx tests/unit/content.test.ts tests/export/figures.test.ts
git commit -m "feat: the prototype ships as a facade, so nothing third-party loads unasked"
```

---

### Task 4: Rollhaus sections 2 and 3, the editor progression and the prototype

**Files:**
- Modify: `src/content/projects.ts:275-306` (the existing `comparison` headed "The editor")

**Interfaces:**
- Consumes: the `progression` and `prototype` arms from Tasks 2 and 3, and the figures from Task 1.
- Produces: the Rollhaus `sections[1]` and `sections[2]`.

- [ ] **Step 1: Replace the editor comparison with a progression and a prototype section**

In `src/content/projects.ts`, replace the entire section object whose `heading` is `'The editor'` with these two:

```ts
      {
        // Replaces the quad-versus-inline pair that stood here until
        // 2026-08-05. Leonid's objection was that the two states were "mainly
        // the same": one wheel mount differed and the reader had to hunt for
        // it. A progression starts from almost nothing and adds one decision at
        // a time, so the option space opens in front of the reader instead of
        // being asserted in a caption.
        //
        // He clicked and exported all four in one sitting, at an identical
        // 2916x2086, which is why any difference between these images is a
        // difference in the product rather than in the framing.
        kind: 'progression',
        heading: 'The editor',
        caption:
          'Four decisions, in the order the editor asks for them. Each state keeps everything the one before it added, and the rail above the options fills as you go. Nothing was redrawn between them: the product is one component reading the current selection, which is why the panel thumbnails in step 3 are the boot you already configured rather than four stock icons.',
        steps: [
          {
            label: 'Shoe model',
            note: 'Two lasts, a high top and a low shoe. Nothing is mounted yet, so this is the whole product.',
            src: '/figures/rollhaus-editor-shoe.jpg',
            alt: 'The Rollhaus editor with Select Your Shoe Model active. A plain cream boot fills the canvas with nothing fitted underneath it, and the panel offers two thumbnails, a low shoe and a high boot.',
            width: 1400,
            height: 994,
          },
          {
            label: 'Pattern',
            note: 'Eight fabrics and colourways. The boot changes, the mount is still absent.',
            src: '/figures/rollhaus-editor-pattern.jpg',
            alt: 'The same editor with Select Your Pattern active. The boot now carries a teal, red, yellow and blue colourblock, and the panel shows eight swatches including tartan, checkerboard, floral, polka dot and a retro wave.',
            width: 1400,
            height: 994,
          },
          {
            label: 'Skates',
            note: 'Quad, inline, ice, or nothing at all. Every thumbnail here is the boot from the step before.',
            src: '/figures/rollhaus-editor-skates.jpg',
            alt: 'The same editor with Select Your Skates active. The colourblock boot now sits on a four-wheel quad plate, and the four panel thumbnails show that same boot as a quad, an inline, an ice skate and a plain shoe.',
            width: 1400,
            height: 994,
          },
          {
            label: 'Wheels',
            note: 'Eight colourways, and each one carries more than a colour. The variables figure below shows what.',
            src: '/figures/rollhaus-editor-wheels.jpg',
            alt: 'The same editor with Select Your Wheels active. The wheels have turned yellow and the panel shows eight wheel colourways including cream, dark green, orange, pale blue, royal blue, rust, black and mint.',
            width: 1400,
            height: 994,
          },
        ],
      },
      {
        kind: 'prototype',
        heading: 'Try it',
        caption:
          'The full flow, landing page to confirmation, with the editor at its centre. Nothing loads from Figma until you press the button.',
        href: 'https://www.figma.com/proto/y7bE7LrAbTqplVEh7y44ID/Project3_Rollhaus-Copy?node-id=1927-3157&starting-point-node-id=1927%3A3157&scaling=scale-down&content-scaling=fixed',
        embedSrc:
          'https://embed.figma.com/proto/y7bE7LrAbTqplVEh7y44ID/Project3_Rollhaus-Copy?node-id=1927-3157&starting-point-node-id=1927%3A3157&scaling=scale-down&content-scaling=fixed&embed-host=lolesch-github-io',
        poster: {
          src: '/figures/rollhaus-editor-wheels.jpg',
          alt: 'The Rollhaus editor with a fully configured skate: a colourblock boot on a quad plate with yellow wheels.',
          width: 1400,
          height: 994,
        },
      },
```

- [ ] **Step 2: Run the copy and content guards**

Run: `npm run typecheck && npm test`
Expected: typecheck clean; `content copy` and `project content` pass. If `copy.test.ts` reports an em-dash, find it in the strings above and replace it with a comma or a full stop.

- [ ] **Step 3: Build and check the rendered order**

Run: `npm run test:export -- -t "progression"`
Expected: PASS. The four step labels appear in source order in `out/projects/rollhaus/index.html`.

- [ ] **Step 4: Commit**

```bash
git add src/content/projects.ts
git commit -m "feat: the editor becomes four decisions, and the prototype gets a door"
```

---

### Task 5: The atoms figure, the variables pair, and the panel comparison retired

**Files:**
- Modify: `src/content/projects.ts`: the `figure` headed "What the system had to survive", the prose headed "One system, not a screen per option", the prose headed "What testing changed", and the `comparison` headed "The side panel, before and after"

**Interfaces:**
- Consumes: `rollhaus-atoms.jpg`, `rollhaus-variables.png`, `rollhaus-debug.png` from Task 1.
- Produces: the final Rollhaus section order.

- [ ] **Step 1: Replace the option-tree figure with the atoms figure**

Replace the whole section object whose `heading` is `'What the system had to survive'` with:

```ts
      {
        // Replaces the option-tree screenshot that stood here until 2026-08-05,
        // which was a picture of text on a page whose problem was that it had
        // too few pictures. Nothing is lost by dropping it: the prose in the
        // next section already enumerates the same option space, down to the
        // ball bearings, so the tree was restating a paragraph in a lower
        // resolution.
        kind: 'figure',
        heading: 'What you can actually change',
        caption:
          'The parts, as they are built in the file. Two lasts and eight patterns make sixteen boots, three mounts and eight wheel colourways multiply that again, and none of it is a screen. The dashed outlines are Figma component-set boundaries, left in because they are what makes these sets rather than a page of product shots.',
        src: '/figures/rollhaus-atoms.jpg',
        alt: 'Three groups of product renders on a dark canvas. On the left, three mounts: an inline frame, a quad plate and an ice blade. In the middle, sixteen boots, eight patterns each drawn as a high top and a low shoe, running from plain cream through tartan, retro stripe, checkerboard, floral, colourblock, polka dot and a wave print. On the right, wheel sets in eight colourways, each shown as a quad pair and as an inline row.',
        width: 1401,
        height: 1230,
      },
```

- [ ] **Step 2: Repoint the sentence that aimed at the old architecture figure**

In the prose section headed `'One system, not a screen per option'`, replace the final paragraph:

```ts
          'The mechanism is the core of the project, and the three figures below carry it: what the variables are, what a screen reads off them, and what one card does across four screens. The part worth naming here is the slot system: one Base Card, slotted differently, serves the landing page, the cart, the checkout and the confirmation. Peers and the instructor arrived at the same note independently, that talking about atomic design in general terms buried the decision that was actually ours.',
```

- [ ] **Step 3: Insert the variables pair before the embed**

Immediately after the prose headed `'One system, not a screen per option'` and **before** the `embed` section (which Task 6 rewrites), insert the two figures below. Order matters: the prose above now says "the three figures below carry it", and those three are these two plus the embed, in that order.

```ts
      {
        // The strongest artifact in this case study, and Leonid offered it with
        // "though I dont know how usefull that is". It is the only evidence
        // anywhere for modes, which every earlier version of this page could
        // assert and never show.
        //
        // A full-width figure rather than half of a `comparison` with the debug
        // readout below: both images are wide landscape strips, and the
        // comparison renderer is a two-column grid that would put each of them
        // near 350px and make both unreadable.
        kind: 'figure',
        heading: 'Where the configuration is defined',
        caption:
          'Eleven collections, each scoped to what it drives, and the Wheels collection open with its modes as columns. Green sets the colour, the outdoor type and 26 euro together. Black sets black, outdoor and 17. One switch, three linked values, which is the whole of what modes are doing in this file.',
        src: '/figures/rollhaus-variables.png',
        alt: 'The Figma variables panel. A left rail lists eleven collections with their counts: Color 31, System 5, Cart 5, EditorSidePanel 2, Test Radio Buttons 5, Pattern 2, Shoe 3, Skates 2, and Wheels 3, which is selected. The table shows three variables, WheelColor, WheelType and WheelPrice, across seven mode columns named Default, Yellow, Green, Water blue, Blue, Orange and Black. WheelPrice reads 23, 23, 26, 26, 23, 21 and 17 across them.',
        width: 1600,
        // 385 rather than the 386 this plan first predicted. Measured off the
        // written file in Task 1 Step 5: the zoom lands a fraction under a whole
        // pixel and PyMuPDF floors it. next/image uses this only for the aspect
        // ratio, so the measurement is the truth and the crop stays.
        height: 385,
      },
      {
        kind: 'figure',
        heading: 'And where it is read',
        caption:
          'A debug panel left on the cart screen during the build. The same state the collections above define, grouped by what it drives, on a screen that is using it.',
        src: '/figures/rollhaus-debug.png',
        alt: 'A readout in four columns headed Debug Shoe, Debug Skates, Debug Cart and Debug Side Panel. Shoe reads Shoe Type High, Shoe Pattern Default, Shoe Size 49. Skates reads Skate Type Quad, Wheels Color Default, Wheels Type Indoor. Cart reads Shoe Price 54, Pattern Price 5, Wheel Price 65, Total Price 123, Amount Counter 0. Side Panel reads Side Panel Content Pattern, Side Panel State Collapsed.',
        width: 1701,
        height: 304,
      },
```

- [ ] **Step 4: Delete the side-panel comparison and tie its prose to what the reader has already seen**

Delete the entire section object whose `heading` is `'The side panel, before and after'`, including its comment block.

Then, in the prose section headed `'What testing changed'`, append one sentence to the final paragraph so it reads:

```ts
          'So we re-cut it. The panel became a category selector, Shoe Model, Pattern, Skates and Wheels, sitting above an option grid, in place of one list that merged unrelated options. Reading the results as a request for visual tweaks would have been much cheaper. Re-cutting the information hierarchy was the more expensive call and the right one. It is the panel in every screenshot above.',
```

- [ ] **Step 5: Run the guards**

Run: `npm run typecheck && npm test`
Expected: typecheck clean, all unit tests pass. The four references to deleted assets from Task 1 are now gone.

- [ ] **Step 6: Build and confirm no figure points at a missing file**

Run: `npm run test:export`
Expected: every `points at a file that actually shipped` case passes. The `embed` cases still reference `rollhausArchitecture` and will fail until Task 6; that is expected.

- [ ] **Step 7: Commit**

```bash
git add src/content/projects.ts
git commit -m "feat: the option tree becomes parts, the variables get shown, and the before state goes"
```

---

### Task 6: The slots embed replaces the architecture diagram

**Files:**
- Create: `src/content/figures/rollhaus-slots.ts`
- Create: `src/components/figures/rollhaus-slots.tsx`
- Delete: `src/content/figures/rollhaus-architecture.ts`, `src/components/figures/rollhaus-architecture.tsx`
- Modify: `src/content/types.ts:10` (`FigureId`), `src/components/figures/registry.ts`, `src/content/projects.ts` (the embed section), `tests/export/figures.test.ts:35-41`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `FigureId` gains `'rollhaus-slots'` and loses `'rollhaus-architecture'`; `rollhausSlots` and `rollhausPalette` exported from `src/content/figures/rollhaus-slots.ts`; `RollhausSlots` exported from the component.

- [ ] **Step 1: Write the failing test**

In `tests/export/figures.test.ts`, replace the `renders the Rollhaus diagram` case with:

```ts
  it('renders the Rollhaus slot figure, honest limitation included', () => {
    const visible = body('out/projects/rollhaus/index.html');
    expect(visible).toContain(rollhausSlots.title);
    // Every screen the one card serves has to be named, or the figure is a
    // drawing of a tree rather than evidence of reuse.
    for (const screen of rollhausSlots.screens) {
      expect(visible).toContain(screen.name);
    }
    // The footnote is the one place the ad hoc naming limitation is stated.
    // Drop it in a refactor and the page starts overclaiming, quietly.
    expect(visible).toContain('the variable naming is ad hoc');
  });
```

and change the import at the top of that file from

```ts
import { rollhausArchitecture } from '../../src/content/figures/rollhaus-architecture';
```

to

```ts
import { rollhausSlots } from '../../src/content/figures/rollhaus-slots';
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm run typecheck`
Expected: FAIL with `Cannot find module '../../src/content/figures/rollhaus-slots'`.

- [ ] **Step 3: Write the content module**

Create `src/content/figures/rollhaus-slots.ts`:

```ts
// The Rollhaus brand palette is content, not styling. This figure is *about*
// that token set, so the literal values belong here rather than in a token.
// src/content/** is exempt from the raw-colour guard for this reason.
//
// Read from the live file on 2026-08-05 via the Figma MCP, on nodes 966:17281
// (Editor Content) and 1703:20783 (Cart). Transcribed rather than re-fetched:
// that server is on a free tier of roughly six calls, so this file is the
// durable copy.
export const rollhausPalette = {
  brand: '#ffd942',
  brandSoft: '#fac172',
  teal: '#2f8f8a',
  secondary: [
    { value: '#64adb3', label: 'Secondary 3' },
    { value: '#2e5856', label: 'Secondary 5' },
  ],
  neutrals: [
    { value: '#f3f2f1', label: 'Neutrals 1' },
    { value: '#dedbd9', label: 'Neutrals 2' },
    { value: '#a7a19a', label: 'Neutrals 3' },
    { value: '#888077', label: 'Neutrals 4' },
    { value: '#262421', label: 'Neutrals 6' },
    { value: '#0e0d0c', label: 'Neutrals 7' },
  ],
} as const;

export const rollhausSlots = {
  title: 'One card, four screens',
  standfirst:
    'The layer tree as Figma holds it. Base Card owns two slots and knows nothing about what goes in them, so a new screen fills the slots differently instead of being drawn.',

  treeLabel: 'Base Card, as the file holds it',
  tree: [
    { depth: 0, name: 'Base Card', kind: 'instance' },
    { depth: 1, name: 'Image slot', kind: 'slot' },
    { depth: 2, name: 'Background Variant', kind: 'instance' },
    { depth: 2, name: 'Composable Skates', kind: 'instance' },
    { depth: 2, name: 'Tag', kind: 'instance' },
    { depth: 1, name: 'Content slot', kind: 'slot' },
    { depth: 2, name: 'Card content', kind: 'instance' },
    { depth: 3, name: 'Slot', kind: 'slot' },
    { depth: 4, name: 'SkatesProperty x4', kind: 'instance' },
    { depth: 4, name: 'Total Price', kind: 'instance' },
  ],

  screensLabel: 'What each screen puts in them',
  screens: [
    {
      name: 'Landing',
      image: 'Composable Skates, plus a New or On Sale tag',
      content: 'Card content: name, material, price',
    },
    {
      name: 'Cart',
      image: 'Hidden. The product render moves to the page itself',
      content: 'The four SkatesProperty rows, a total, a quantity selector',
    },
    {
      name: 'Checkout',
      image: 'Hidden',
      content: 'The same summary, plus an address form and a shipping switch',
    },
    {
      name: 'Confirmation',
      image: 'Hidden',
      content: 'The same summary again, and nothing else',
    },
  ],

  tokensLabel: 'The token foundation every screen draws from',
  tokenGroups: [
    {
      name: 'Typography',
      detail: 'H2 Poppins SemiBold 24 · H3 Poppins SemiBold 16 · Body Inter 20 · Body2 Inter 16 · BodyBold Inter SemiBold 20 · CTA Poppins SemiBold 20',
    },
    { name: 'Spacing and stroke', detail: 'Spacing/small 8 · IconStroke Thin 1 · IconStroke Default 1.5' },
    { name: 'Elevation', detail: 'DropShadow Medium x0 y4 blur4 · DropShadow Small x0 y2 blur2 spread2' },
  ],

  extend: {
    label: 'Extend, do not redraw',
    body: 'Started with quad skates. Added inline, ice and a version that is just the shoe, plus new patterns and fabrics. Each one extends a token set, an option slot or a component variant. None of them is a new screen.',
  },

  footnote:
    'Read from the live Figma file on 2026-08-05. This was an early variables project: the token system is real and multi-category, and the variable naming is ad hoc and would need a convention to scale beyond a project. A collection named Test Radio Buttons is still in the file, which is visible two figures above.',
} as const;
```

- [ ] **Step 4: Write the component**

Create `src/components/figures/rollhaus-slots.tsx`:

```tsx
import { rollhausPalette, rollhausSlots as fig } from '@/content/figures/rollhaus-slots';

// Chrome on Semantic tokens, so the figure follows the theme toggle. The only
// literal colours in here arrive as data, because they are what the diagram
// depicts.

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="type-eyebrow text-muted">{children}</p>
);

export function RollhausSlots() {
  return (
    <div className="rounded-card border border-border p-gutter type-body">
      <p className="type-subheading">{fig.title}</p>
      <p className="mt-tight type-meta text-muted">{fig.standfirst}</p>

      <div className="mt-gap grid gap-gap md:grid-cols-2">
        <div>
          <Label>{fig.treeLabel}</Label>
          {/*
            An indented list rather than a drawn tree. The depth is real, it
            comes off the layer panel, and a rule-and-elbow diagram would spend
            a lot of markup saying what an indent already says.
          */}
          <ul className="mt-tight rounded-card border border-border bg-surface p-gutter">
            {fig.tree.map((node) => (
              <li
                key={`${node.depth}-${node.name}`}
                className="type-code"
                style={{ paddingLeft: `${node.depth}.25rem` }}
              >
                <span className={node.kind === 'slot' ? 'text-accent' : 'text-muted'}>
                  {node.kind === 'slot' ? '▸ ' : '· '}
                </span>
                <span className={node.kind === 'slot' ? 'type-emphasis' : ''}>{node.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Label>{fig.screensLabel}</Label>
          <dl className="mt-tight space-y-tight">
            {fig.screens.map((screen) => (
              <div key={screen.name} className="rounded-card border border-border bg-surface p-tight">
                <dt className="type-meta type-emphasis">{screen.name}</dt>
                <dd className="type-meta text-muted">
                  <b className="text-fg">Image slot:</b> {screen.image}
                </dd>
                <dd className="type-meta text-muted">
                  <b className="text-fg">Content slot:</b> {screen.content}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-gap rounded-card border border-border bg-surface p-gutter">
        <Label>{fig.tokensLabel}</Label>
        {/*
          A grid rather than a wrapping flex row: the swatches are one scale, and
          a scale that breaks across two lines reads as an accident.
        */}
        <ul className="mt-tight grid grid-cols-10 gap-tight">
          {[
            ...rollhausPalette.neutrals,
            ...rollhausPalette.secondary,
            { value: rollhausPalette.brand, label: 'Primary 1' },
            { value: rollhausPalette.brandSoft, label: 'Primary 2' },
          ].map((swatch) => (
            <li
              key={swatch.value}
              className="aspect-square rounded-control border border-border"
              style={{ background: swatch.value }}
            >
              <span className="sr-only">{`${swatch.label} ${swatch.value}`}</span>
            </li>
          ))}
        </ul>

        {fig.tokenGroups.map((group) => (
          <div key={group.name} className="mt-gap">
            <p className="type-meta type-emphasis">{group.name}</p>
            <p className="mt-tight type-meta text-muted">{group.detail}</p>
          </div>
        ))}
      </div>

      <div
        className="mt-gap rounded-card border border-border p-gutter"
        // Depicted in the Rollhaus brand yellow because that is what the source
        // artifact looks like.
        style={{ borderLeft: `6px solid ${rollhausPalette.brand}` }}
      >
        <Label>{fig.extend.label}</Label>
        <p className="mt-tight type-meta">{fig.extend.body}</p>
      </div>

      <p className="mt-gap type-meta text-muted">{fig.footnote}</p>
    </div>
  );
}
```

- [ ] **Step 5: Rewire the id, the registry and the section**

In `src/content/types.ts`, change the `FigureId` union:

```ts
export type FigureId = 'rollhaus-slots' | 'glyphshero-chain' | 'fermentor-stages';
```

In `src/components/figures/registry.ts`, replace the `rollhaus-architecture` import and entry with `RollhausSlots` from `@/components/figures/rollhaus-slots`, keyed `'rollhaus-slots'`.

In `src/content/projects.ts`, replace the embed section:

```ts
      {
        kind: 'embed',
        heading: 'One card, four screens',
        caption:
          'The layer tree and the token set as the Figma file actually holds them, ported onto the tokens this site runs on, so it follows the theme. This replaced a flow diagram on 2026-08-05: that figure drew a mechanism in boxes, and the file itself is more convincing than a drawing of it.',
        figure: 'rollhaus-slots',
      },
```

- [ ] **Step 6: Delete the old figure**

```bash
git rm src/content/figures/rollhaus-architecture.ts src/components/figures/rollhaus-architecture.tsx
```

- [ ] **Step 7: Typecheck, then build and run the export suite**

Run: `npm run typecheck && npm test && npm run test:export`
Expected: all green. `renders the Rollhaus slot figure` passes, including the four screen names and the ad hoc naming footnote.

- [ ] **Step 8: Commit**

```bash
git add -A src/content/figures src/components/figures src/content/types.ts src/content/projects.ts tests/export/figures.test.ts
git commit -m "feat: the architecture diagram becomes the layer tree it was describing"
```

---

### Task 7: The project-page hero, and the lead-figure rule retired

**Files:**
- Modify: `src/app/projects/[slug]/page.tsx:33-95`
- Modify: `src/components/sections.tsx:6-37` (remove the `lead` computation and the `priority` prop)
- Modify: `tests/export/figures.test.ts:105-112` and `:145-155`

**Interfaces:**
- Consumes: `scrimGradient` from `@/lib/scrim`, `project.thumb` from the content record.
- Produces: a hero whose `<Image>` carries `style={{ viewTransitionName: \`thumb-${project.slug}\` }}`, which Task 8 pairs against the card.

- [ ] **Step 1: Write the failing test**

In `tests/export/figures.test.ts`, replace the `does not lazy-load the lead figure` case with:

```ts
      it('is allowed to lazy-load, because the hero above it is the LCP', () => {
        const tag = body(page).match(new RegExp(`<img[^>]*${state.src}[^>]*>`))?.[0] ?? '';
        expect(tag, `no <img> found for ${state.src}`).not.toBe('');
      });
```

Then delete the `leadIndex` helper entirely, and narrow `IMAGES` now that nothing needs the section index:

```ts
const IMAGES = projects.flatMap((project) =>
  project.sections.flatMap((section) => imagesOf(section).map((state) => ({ project, state }))),
);
```

and change the loop header from `for (const { project, index, state } of IMAGES)` to `for (const { project, state } of IMAGES)`.

Then add a new top-level `describe` at the end of the file:

```ts
describe('the project hero (Seam 2)', () => {
  for (const project of projects) {
    it(`${project.slug} paints its card image eagerly at the top of the page`, () => {
      const markup = body(`out/projects/${project.slug}/index.html`);
      const tag = markup.match(new RegExp(`<img[^>]*${project.thumb.src}[^>]*>`))?.[0] ?? '';
      expect(tag, `no hero <img> found for ${project.thumb.src}`).not.toBe('');
      // The hero is the LCP on every project page now, so deferring it delays
      // the paint it defines. This is the rule the old lead-figure computation
      // used to carry, moved to the element that actually earns it.
      expect(tag).not.toContain('loading="lazy"');
    });
  }
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm run test:export -- -t "project hero"`
Expected: FAIL with `no hero <img> found for /figures/rollhaus-thumb.jpg`, because the detail page renders no thumbnail.

- [ ] **Step 3: Add the hero**

In `src/app/projects/[slug]/page.tsx`, add the imports:

```tsx
import Image from 'next/image';
import { scrimGradient } from '@/lib/scrim';
```

Replace the opening of the returned JSX, from `<main ...>` through the closing `</h1>`, with:

```tsx
    <main className="measure pt-gap pb-section">
      {/*
        The card's image, in the card's treatment, at the top of the page it
        opens. Added 2026-08-05: Leonid's note was that clicking a card entered a
        new page and the visual was gone. Repeating the thumbnail under a
        separate heading would have answered that literally and read as two
        pictures; the same image in the same scrim reads as the card growing,
        which is also what the view transition in globals.css animates.

        A one-cell grid rather than a positioned box, matching
        src/components/project-tile.tsx exactly, so the `em`-relative scrim
        insets behave identically at both sizes. The <h1> lives inside it: the
        page had a scrim title and a separate headline for about ten minutes
        during the build, and one of them was always redundant.
      */}
      <div className="grid aspect-[16/10] w-full overflow-hidden rounded-card border border-border-media">
        <div className="relative col-start-1 row-start-1">
          <Image
            src={project.thumb.src}
            alt={project.thumb.alt}
            fill
            // The LCP on this page, so never lazy. `sizes` names the reading
            // column, which is the width this actually gets.
            priority
            sizes="(max-width: 48rem) 100vw, 48rem"
            className="object-cover"
            // Paired against the same name on the card in
            // src/components/project-tile.tsx. Only one element carrying a given
            // name may be visible at a time, which is why it is per slug rather
            // than a constant: the home grid renders four cards at once.
            style={{ viewTransitionName: `thumb-${project.slug}` }}
          />
        </div>
        <h1
          className="col-start-1 row-start-1 z-10 self-start p-[0.75em] pb-[2.25em] text-center type-display text-on-scrim"
          style={{ backgroundImage: scrimGradient }}
        >
          {project.title}
        </h1>
      </div>

      <p className="mt-gap type-meta text-muted">
        {project.year} · {project.context} · {project.role}
      </p>
```

Keep the existing comment above the metadata paragraph. The old standalone `<h1 className="mt-tight type-title text-balance">` is deleted, and the metadata paragraph moves below the hero with `mt-gap` instead of no margin.

- [ ] **Step 4: Make the back link a document navigation**

At the foot of the same file, replace the `<Link>` with a plain anchor so the reverse transition runs, and drop the now-unused `next/link` import:

```tsx
      <p className="mt-section type-body">
        <a href="/" className="text-accent underline underline-offset-4">
          Back to all projects
        </a>
      </p>
```

- [ ] **Step 5: Retire the lead-figure rule**

In `src/components/sections.tsx`, delete the `const lead = sections.findIndex(...)` block and its comment, change the map to stop passing `priority`, and remove the `priority` parameter from `SectionBody` and from every `<Image>` inside it:

```tsx
export function ContentSections({ sections }: { sections: readonly Section[] }) {
  // No lead-figure rule since 2026-08-05. Every project page now opens on a
  // hero carrying `priority`, so the first figure inside the sections is no
  // longer the LCP candidate and marking it eager would only compete with the
  // image that is.
  return (
    <>
      {sections.map((section, index) => (
        <section key={section.heading}>
          <SectionHeading index={index + 1}>{section.heading}</SectionHeading>
          <SectionBody section={section} />
        </section>
      ))}
    </>
  );
}

function SectionBody({ section }: { section: Section }) {
```

- [ ] **Step 6: Build and run the full export suite**

Run: `npm run typecheck && npm test && npm run test:export`
Expected: all green, including `the project hero (Seam 2)` for all four projects.

- [ ] **Step 7: Commit**

```bash
git add src/app/projects src/components/sections.tsx tests/export/figures.test.ts
git commit -m "feat: the project page opens on the card it came from"
```

---

### Task 8: Cross-document view transitions

**Files:**
- Modify: `src/app/globals.css` (append after the `motion-state` utility)
- Modify: `src/components/project-tile.tsx:112-238`

**Interfaces:**
- Consumes: the hero's `view-transition-name` from Task 7.
- Produces: matching names on the card thumbnail, and the `@view-transition` opt-in both documents need.

- [ ] **Step 1: Write the failing test**

Create `tests/export/view-transition.test.ts`:

```ts
import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { projects } from '../../src/content/projects';
import { body } from './rendered';

const stylesheet = () => {
  const files = globSync('out/_next/static/**/*.css');
  expect(files.length).toBeGreaterThan(0);
  return files.map((file) => readFileSync(file, 'utf8')).join('\n');
};

/*
 * A cross-document view transition needs three things and any one of them
 * missing makes it silently do nothing: both documents opt in, the two elements
 * share a name, and the navigation is a real document navigation rather than a
 * client-side route change. None of those is visible in a screenshot, and the
 * failure mode is the transition simply not happening, which nobody notices.
 */
describe('the card to page transition', () => {
  it('opts both documents in', () => {
    expect(stylesheet()).toContain('@view-transition');
  });

  it('names the same element on the card and on the hero', () => {
    const home = body('out/index.html');
    for (const project of projects) {
      const name = `thumb-${project.slug}`;
      expect(home, `the card for ${project.slug} carries no transition name`).toContain(name);
      expect(
        body(`out/projects/${project.slug}/index.html`),
        `the hero for ${project.slug} carries no transition name`,
      ).toContain(name);
    }
  });

  it('reaches a project through a plain anchor rather than the router', () => {
    // Asserted against the source, not the markup, and that is not laziness:
    // next/link renders a bare <a href> in the exported HTML too, so the two are
    // indistinguishable once built. The difference only exists at runtime, where
    // the router intercepts the click and the navigation never becomes a
    // document navigation, so `@view-transition` never fires. Nothing else
    // breaks, which is exactly why this needs a guard.
    const tile = readFileSync('src/components/project-tile.tsx', 'utf8');
    expect(tile, 'the tile imports next/link again, so the morph will not fire').not.toContain(
      'next/link',
    );
    expect(body('out/index.html')).toContain('href="/projects/rollhaus/"');
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm run test:export -- -t "card to page transition"`
Expected: FAIL on `@view-transition` not being in the stylesheet.

- [ ] **Step 3: Add the opt-in and the tempo**

Append to `src/app/globals.css`:

```css
/*
 * The card grows into the page it opens, rather than the page replacing it.
 *
 * Cross-document rather than React's ViewTransition, and that is the load-bearing
 * choice. `@view-transition` only fires on a real document navigation, which is
 * why src/components/project-tile.tsx uses a plain <a> and gives up Next's
 * client-side routing on project links. The alternative was
 * unstable_ViewTransition, which keeps routing and puts an experimental API
 * under the site's flagship interaction, on a site whose argument is that its
 * choices are durable. Four static pages make the prefetch a cheap thing to lose.
 *
 * The tempo is the site's existing one. A second motion token was drafted and
 * rejected: src/content/design-system.ts ships the sentence "One motion role",
 * and a page-level morph is a state change like any other. 160ms is brisk, which
 * is what Flow Over Flash asks for.
 *
 * Nothing here is inside `motion-state`, because that role is for `transition-*`
 * on an element. This is a document-level at-rule and a pseudo-element tree, and
 * they cannot be expressed as one utility.
 */
@media (prefers-reduced-motion: no-preference) {
  @view-transition {
    navigation: auto;
  }

  ::view-transition-group(*) {
    animation-duration: var(--ds-motion-state);
    animation-timing-function: var(--ds-motion-ease);
  }

  /*
   * The header is the same bar on both documents, so without a name of its own
   * it joins the root snapshot and cross-fades with everything else, which reads
   * as the chrome flickering. Named, it is its own group and simply holds still.
   */
  header {
    view-transition-name: site-header;
  }
}
```

- [ ] **Step 4: Make the card a document navigation**

In `src/components/project-tile.tsx`, delete the `import Link from 'next/link';` line and replace the `<Link>` element with:

```tsx
          <a
            href={`/projects/${project.slug}/`}
            // A plain anchor rather than next/link since 2026-08-05, and the
            // reason is in globals.css: `@view-transition` only fires on a real
            // document navigation, so a client-side route change would make the
            // morph never happen and nothing would look broken.
            //
            // The whole card is the click target. The link name stays the
            // project title, which is what a screen reader reads out of a link
            // list. Wrapping the card in one <a> instead would flatten the
            // heading out of screen-reader navigation and name the link after
            // the entire tile, thumbnail alt text and all.
            className="after:absolute after:inset-0 hover:underline focus-visible:outline-none"
          >
            {project.title}
          </a>
```

Then add the transition name to the thumbnail `<Image>`, alongside its existing `className`:

```tsx
            // Paired against the hero in src/app/projects/[slug]/page.tsx. Per
            // slug rather than a constant, because only one element carrying a
            // given name may be visible and this grid renders four cards.
            style={{ viewTransitionName: `thumb-${project.slug}` }}
```

- [ ] **Step 5: Run the new suite**

Run: `npm run test:export -- -t "card to page transition"`
Expected: PASS, all three cases.

If `opts both documents in` fails, the at-rule was stripped rather than mistyped: Tailwind v4 runs Lightning CSS, which drops at-rules it does not recognise. Confirm by grepping the built stylesheet for `view-transition-name`, which is a plain declaration and survives regardless. The fix is to move the whole block into `public/view-transition.css` and link it from `src/app/layout.tsx`, since `public/` is copied verbatim and never parsed. Note in `_build-log.md` if this happens, because it is a constraint on every future at-rule this repo writes.

- [ ] **Step 6: Run everything**

Run: `npm run typecheck && npm test && npm run test:export`
Expected: all green.

- [ ] **Step 7: Look at it in a browser**

Run: `npm run dev`
Then open `http://localhost:3000`, click the Rollhaus card, and confirm the thumbnail scales into the hero rather than the page swapping. Toggle the OS reduced-motion setting and confirm the navigation becomes instant with no morph. Chrome 126+, Safari 18.2+ or Firefox 144+ is needed to see it at all; anything older gets a plain navigation, which is correct.

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/components/project-tile.tsx tests/export/view-transition.test.ts
git commit -m "feat: the card morphs into the page, on a real document navigation"
```

---

## Verification

After Task 8, from a clean tree:

```bash
npm run typecheck && npm test && npm run test:export
```

Expected: typecheck clean, unit suite green, export suite green including `the project hero`, `the card to page transition`, `the prototype facade`, and `renders the Rollhaus slot figure`.

Then append the outcome to `_build-log.md` under the existing `2026-08-05` entry: what the rendered progression actually looked like at full width, whether 160ms reads as too fast for the morph, and whether `embed-host=lolesch-github-io` was accepted by Figma or fell back to the link.
