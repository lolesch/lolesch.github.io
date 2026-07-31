# Visual Direction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every project tile a thumbnail and a purpose-written summary, move the three schema lines to the detail page, correct the How to God attribution, and add the GlyphsHero chain diagram.

**Architecture:** Content stays data. `Project` gains two fields (`summary`, `thumb`); the tile renders them and stops carrying the schema lines; the detail page picks those lines up as its opener. One new figure component joins the existing `FIGURES` registry. Two existing guards invert because the rule they encode changes.

**Tech Stack:** Next.js 16 static export, React 19, Tailwind v4 over `--ds-*` custom properties, Vitest.

Spec: `docs/superpowers/specs/2026-07-31-visual-direction-design.md`

## Global Constraints

- **No em-dashes** anywhere in content. `tests/unit/copy.test.ts` walks every string in `src/content/**` and fails on one.
- **Copy is frozen unless a decision is recorded.** The `summary` strings and the How to God corrections in this plan are approved 2026-07-31; do not reword them.
- **A section exists only if it has substance.** Never pad to look complete (`CONTEXT.md`).
- **Tokens only.** No raw colour outside `src/content/**`, no hardcoded spacing. Use `--ds-*`-backed utilities (`p-gutter`, `text-meta`, `rounded-card`).
- **`border` is decorative; `border-interactive` identifies a control; `border-media` is for media.** Do not borrow one for another.
- **British spelling** in copy, matching existing content ("colour", "recognised", "behaviour").
- **Append to `_build-log.md`** as you go, including what was rejected.
- Every task ends green on `npm test` and `npm run typecheck`.

## File Structure

| File | Responsibility |
|---|---|
| `src/content/types.ts` | `Project.summary`, `Project.thumb`, `FigureId` gains `glyphshero-chain` |
| `src/content/projects.ts` | summaries, thumbs, How to God correction, GlyphsHero game sections |
| `src/content/figures/glyphshero-chain.ts` | the chain diagram's data |
| `src/components/figures/glyphshero-chain.tsx` | the chain diagram's markup |
| `src/components/figures/registry.ts` | registers the new figure |
| `src/components/project-tile.tsx` | thumb + summary; no schema lines |
| `src/app/work/[slug]/page.tsx` | schema lines as the page opener |
| `tests/unit/content.test.ts` | guards for the two new fields |
| `tests/export/work-routes.test.ts` | the inverted restate guard |
| `public/figures/*` | the staged image assets |

## Scope

Spec assets 1, 2, 3 and 5 (the Rollhaus mode-switch comparison, the side-panel before/after, the extension strip, and the replacement editor figure) are **not** in this plan. They are blocked on Figma captures in progress. They are content additions to `projects.ts` using the existing `figure` section kind, which this plan does not change, so they need no code and will land as a follow-on.

---

### Task 1: Stage the thumbnail assets

`thumb` is required on every project, so all three files must exist before the type change compiles. This task is a gate: it produces no code.

**Files:**
- Create: `public/figures/glyphshero-runes.png`
- Create: `public/figures/how-to-god.jpg`
- Use as-is: `public/figures/rollhaus-editor.jpg`

- [ ] **Step 1: Copy the GlyphsHero art in**

```bash
cp "/c/Users/loles/Desktop/LEONID/AutoBattler/Assets/Art/G.png" public/figures/glyphshero-runes.png
```

- [ ] **Step 2: Add the How to God press image**

Download a gameplay screenshot from the Thoughtfish press kit
(<https://drive.google.com/drive/folders/1JCslZvz3fpcohKOgDBOdhHaXdHBmR0io>, linked
from <https://www.thoughtfish.de/projects/how-to-god/>) and save it as
`public/figures/how-to-god.jpg`.

**If the press kit is unreachable, stop and ask.** Do not substitute a
screenshot scraped from a store page: the spec's caption commits to a
specific provenance, and an asset whose origin is not the press kit makes
that caption false.

- [ ] **Step 3: Record the dimensions of all three**

`next/image` needs exact intrinsic dimensions, and Task 4 writes them onto the
record. Read them with PowerShell:

```powershell
Add-Type -AssemblyName System.Drawing; Get-ChildItem public/figures/* | ForEach-Object { $i = [System.Drawing.Image]::FromFile($_.FullName); "$($_.Name) $($i.Width)x$($i.Height)"; $i.Dispose() }
```

Expected: three lines, one per file. Write the pairs down. A wrong value here
does not fail any test, it ships a layout shift, which is why this is its own
step.

- [ ] **Step 4: Verify all three exist**

```bash
ls -la public/figures/
```

Expected: `glyphshero-runes.png`, `how-to-god.jpg`, `rollhaus-editor.jpg`.

- [ ] **Step 5: Commit**

```bash
git add public/figures/
git commit -m "assets: stage the three work-grid thumbnails

G.png is AI-generated from Leonid's own prompts, carried over from the
GlyphsHero repo. The How to God image is from the Thoughtfish press kit and
shows a build past his involvement, which its caption states.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: `summary` on the project record

**Files:**
- Modify: `src/content/types.ts:36-52`
- Modify: `src/content/projects.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces: `Project.summary: string` — read by `ProjectTile` in Task 5.

- [ ] **Step 1: Write the failing test**

Add inside the `describe(project.slug, ...)` block in `tests/unit/content.test.ts`, after the `fills all three schema lines` case:

```ts
      it('carries a summary that is not a schema line', () => {
        // The card hook is written for the card. Reusing a schema line here
        // would put the same sentence in two places and make the detail page
        // opener read as an echo.
        expect(project.summary.length).toBeGreaterThan(0);
        for (const line of [project.problem, project.whatIDid, project.whatChanged]) {
          expect(project.summary).not.toBe(line);
        }
      });
```

And extend the em-dash case's array in the same file, adding `project.summary` after `project.role`:

```ts
          project.role,
          project.summary,
          project.problem,
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npm test
```

Expected: FAIL, `Property 'summary' does not exist on type 'Project'` or `expect(received).toBeGreaterThan(0)` on `undefined`.

- [ ] **Step 3: Add the field to the type**

In `src/content/types.ts`, inside `Project`, directly above the `// The three fixed schema lines` comment:

```ts
  // The card hook. Names a decision rather than describing the project: a tile
  // that says what a project *was* is the old portfolio's failure in miniature
  // (CONTEXT.md), and the three schema lines below now open the detail page
  // instead of the card.
  summary: string;
```

- [ ] **Step 4: Add the approved copy**

In `src/content/projects.ts`, add `summary` to each record directly after `tier`.

Rollhaus:

```ts
    summary:
      'A roller-skate configurator built on Figma variables and modes, so new skate types extend the system instead of forcing a redraw.',
```

GlyphsHero:

```ts
    summary:
      'A tactile auto-battler where the inventory is the spell. Each item in a chain bends one part of an attack: what it targets, how it lands, what it spawns.',
```

How to God:

```ts
    summary:
      'VR spellcasting and grabbing for Meta Quest. I owned UX and game feel: tuning gesture recognition, hand colliders and haptics until casting and grabbing felt right.',
```

- [ ] **Step 5: Run the tests**

```bash
npm test && npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/types.ts src/content/projects.ts tests/unit/content.test.ts
git commit -m "feat: the card summary, written for the card

Adding a thumbnail leaves no room for three ~150-word schema lines at a
readable density, and the grid is the surface that most needs scanning. The
summary names a decision rather than describing the project, because a tile
that only says what a project was is the failure CONTEXT.md records the Tile
Schema to prevent.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: The How to God attribution correction

The shipped line claims the gesture system. `cv/cv_track_b_content.md:74` in the sibling repo logs the June 2026 correction ("an existing plugin, not something he built from scratch"), `site_copy.md` dropped the qualifier, and this record inherited it. Confirmed by Leonid 2026-07-31.

**Files:**
- Modify: `src/content/projects.ts` (the `how-to-god` record)

- [ ] **Step 1: Correct the two schema lines**

Replace `problem`:

```ts
    problem:
      'In VR you cast spells by gesture and pick objects up with your hands. Neither works if the player has to think about how to do it.',
```

Replace `whatIDid`:

```ts
    whatIDid:
      "Designed the gesture set around simple, distinct shapes on an existing recognition plugin, and trained the model across several people rather than only myself. Tuned the colliders on the in-game hand model so grabbing felt right, added haptics as success and warning signals, and built the input scheme to Meta Quest's guidelines.",
```

`whatChanged` is unchanged and remains accurate.

- [ ] **Step 2: Rewrite the section built on the old claim**

The `Designing for hands that vary` section carries both the unqualified claim and the population-coverage angle the correction moves away from. Replace that whole section object with:

```ts
      {
        kind: 'prose',
        heading: 'Making it feel right',
        body: [
          'The recognition plugin was already in the project when I arrived. What was open was everything around it: which shapes the spells used, how much slack a shape got before it stopped counting, and how fast the game told you it had counted. That is the part I was hired for.',
          'Simple, distinct shapes did most of the work, because a shape that stays distinguishable when it is drawn badly needs less tuning than one that does not. I trained the model across several people instead of only myself, which is the difference between a system that works and a system that works for the person who built it.',
          'Grabbing is the same problem from the other side. The colliders on the in-game hand model decide whether a pickup reads as contact or as a near miss, and that is tuning rather than design: you adjust, you playtest, you adjust again. Haptics carry the result back, one signal for a success and another for a warning.',
          "The input scheme follows Meta Quest's guidelines, which set what a grab, a trigger and a menu call are expected to do on that hardware. Deliberately conventional, so it is learnable.",
        ],
      },
```

The plugin qualifier is now stated in two places, `whatIDid` and this section's
first line. That is intentional and it is not tone tell #10: the schema line and
the page opener are the same sentence after Task 6, so the reader meets it once.

- [ ] **Step 3: Run the tests**

```bash
npm test && npm run typecheck
```

Expected: PASS. The `never restates a tile line verbatim in a section` guard is
the one to watch: the section paraphrases, it does not copy.

- [ ] **Step 4: Commit**

```bash
git add src/content/projects.ts
git commit -m "fix: the gesture claim the CV corrected in June and the site kept

The recogniser was an existing plugin. cv_track_b_content.md:74 logged that as
the Thoughtfish accuracy fix and both CV bullets carry 'on an existing
recognition plugin'; site_copy.md dropped the qualifier and this record
inherited it, which left the portfolio as the only surface still overclaiming
and the only one about to go public.

The section angle moves with it, from population coverage to game feel, which
is what the role actually was.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: `thumb` on the project record

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/projects.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: the three files staged in Task 1.
- Produces: `Project.thumb: { src: string; alt: string; width: number; height: number }` — read by `ProjectTile` in Task 5.

- [ ] **Step 1: Write the failing test**

Add inside the `describe(project.slug, ...)` block in `tests/unit/content.test.ts`:

```ts
      it('carries a thumbnail with alt text', () => {
        // The thumb is inside the card's link target, so its alt is the copy a
        // screen reader gets for the image half of that link. An empty alt here
        // is not a decorative image, it is a missing description.
        expect(project.thumb.src.startsWith('/')).toBe(true);
        expect(project.thumb.alt.length).toBeGreaterThan(0);
        expect(project.thumb.width).toBeGreaterThan(0);
        expect(project.thumb.height).toBeGreaterThan(0);
      });
```

Extend the em-dash case's array, adding `project.thumb.alt` after `project.summary`:

```ts
          project.summary,
          project.thumb.alt,
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npm test
```

Expected: FAIL, `Property 'thumb' does not exist on type 'Project'`.

- [ ] **Step 3: Add the field to the type**

In `src/content/types.ts`, inside `Project`, after `summary`:

```ts
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
```

- [ ] **Step 4: Add the data**

Use the real dimensions recorded in Task 1 Step 3. The values below are the
shape; replace each `width`/`height` with what the file actually measures.

Rollhaus (reuses the existing editor image, itself a placeholder per the comment
already in this file):

```ts
    thumb: {
      src: '/figures/rollhaus-editor.jpg',
      alt: 'The Rollhaus customization editor, with a white roller skate beside a panel of pattern swatches.',
      width: 1440,
      height: 1024,
    },
```

GlyphsHero:

```ts
    // G.png from the game repo's Assets/Art, generated by Leonid's own prompts.
    // Placeholder until the chain diagram in this plan can carry the tile: the
    // art shows the theme, the diagram shows the work.
    thumb: {
      src: '/figures/glyphshero-runes.png',
      alt: 'Four carved rune tiles linked together in a chain, each one a different stone and colour.',
      width: 340,
      height: 340,
    },
```

How to God:

```ts
    thumb: {
      src: '/figures/how-to-god.jpg',
      alt: 'A press image from How to God, showing the VR god sim in play.',
      width: 1920,
      height: 1080,
    },
```

- [ ] **Step 5: Run the tests**

```bash
npm test && npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/types.ts src/content/projects.ts tests/unit/content.test.ts
git commit -m "feat: the thumbnail on the record, alt text included

Required rather than optional: the grid is image-led now, so a project without
one is a broken card, not a plainer one. alt rides on the record because it is
copy, and the copy guards walk src/content/**.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: The tile renders thumb and summary

**Files:**
- Modify: `src/components/project-tile.tsx`

**Interfaces:**
- Consumes: `Project.summary`, `Project.thumb` from Tasks 2 and 4.

- [ ] **Step 1: Replace the component**

Replace the whole of `src/components/project-tile.tsx`:

```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/types';

export function ProjectTile({ project }: { project: Project }) {
  return (
    <article
      // position: relative so the link's ::after can cover the whole card, and
      // :has() so focus is visible on the card rather than only on the heading
      // text. Bordered rather than filled: `muted` on `surface` measures 4.40:1
      // in light, under AA, and this tile carries a muted metadata line.
      className="relative flex h-full flex-col overflow-hidden rounded-card border border-border-interactive has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-border-interactive"
    >
      {/*
        `border-media` rather than `border-interactive`: the image is inside the
        link but it is not the control, and borrowing the control token for
        media is a mistake _build-log.md already records once. Here it is a
        bottom edge only, because the card's own border carries the rest.

        Fixed aspect ratio with object-cover, so three thumbnails of different
        native sizes present as one row. Without it the grid's rhythm follows
        whatever the source images happen to measure.
      */}
      <div className="relative aspect-[16/10] w-full border-b border-border-media">
        <Image
          src={project.thumb.src}
          alt={project.thumb.alt}
          fill
          // The grid is auto-fill with a 17rem minimum, so a tile is never wider
          // than roughly a third of a 3xl container. Telling the browser that
          // stops it shipping a full-width source for a card-sized slot.
          sizes="(max-width: 40rem) 100vw, 20rem"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-tight p-gutter">
        <p className="text-meta text-muted">
          {project.year} · {project.context} · {project.role}
        </p>

        <h3 className="font-serif text-subheading leading-tight">
          <Link
            href={`/work/${project.slug}/`}
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

        <ul className="flex flex-wrap gap-tight">
          {project.lenses.map((lens) => (
            <li
              key={lens}
              // Text, never colour-coded alone. The decorative `border` token is
              // correct here: a chip is not a control.
              className="rounded-tag border border-border p-tight text-meta text-muted"
            >
              {lens}
            </li>
          ))}
        </ul>

        <p className="text-body">{project.summary}</p>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Typecheck and test**

```bash
npm run typecheck && npm test
```

Expected: PASS.

- [ ] **Step 3: Build and look at it**

```bash
npm run build && npx serve out -l 4321
```

Open <http://localhost:4321/>. Confirm three tiles each show an image, that the
row heights are even, and that tabbing to a card outlines the whole card.

- [ ] **Step 4: Commit**

```bash
git add src/components/project-tile.tsx
git commit -m "feat: the tile leads with an image and a hook

Three ~150-word tiles side by side made the most scannable surface the densest
one, which is the anti-brand constraint tripped by the component meant to
serve it. The schema lines are not lost: Task 6 opens the detail page with
them.

border-media on the image edge, not border-interactive. The image sits inside
the link but it is not the control, and that borrowing is a mistake the log
already records once.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: The detail page opens with the schema lines

The paired half of Task 5. `work/[slug]/page.tsx:51-56` currently explains why the page omits these lines, and `tests/export/work-routes.test.ts` asserts it. Both encode a rule that has now changed, so both invert.

**Files:**
- Modify: `src/app/work/[slug]/page.tsx`
- Modify: `tests/export/work-routes.test.ts`

- [ ] **Step 1: Invert the export guard**

In `tests/export/work-routes.test.ts`, replace the `does not restate the tile lines the visitor just read` case with:

```ts
      it('opens with the three schema lines the card no longer carries', () => {
        // The inverse of the rule this guard held until 2026-07-31. The card
        // used to carry these lines, so the page skipped them; the card now
        // carries a summary and a thumbnail instead, which makes the page the
        // only place they exist. Losing them here would reintroduce exactly the
        // failure CONTEXT.md records the Tile Schema to prevent.
        const visible = text(page);
        for (const line of [project.problem, project.whatIDid, project.whatChanged]) {
          expect(visible, `${project.slug} drops a schema line`).toContain(line);
        }
      });
```

Replace the import on line 4. `body` was used only by the case you just
removed, so it goes:

```ts
import { rendered, text } from './rendered';
```

`text` rather than `body`: the schema lines contain apostrophes, which ship as
`&#x27;`, so comparing authored copy against raw markup fails on punctuation and
pushes the assertion towards matching a fragment. `text` decodes the five
entities React escapes, which is what makes a whole-sentence assertion possible.

- [ ] **Step 2: Run the export suite and watch it fail**

```bash
npm run test:export
```

Expected: FAIL, `rollhaus drops a schema line`.

- [ ] **Step 3: Render the lines on the page**

In `src/app/work/[slug]/page.tsx`, replace the comment block and `<ContentSections>` call (lines 51-57) with:

```tsx
      {/*
        The card carries a thumbnail and a summary, not these three lines, so
        the page is where they live. Label/value pairs rather than prose for the
        same reason the constraints callout is: the reader scans them before the
        writing has to work. This inverts the rule that stood here until
        2026-07-31, when the grid became image-led.
      */}
      <dl className="mt-gap space-y-gap border-l border-border pl-gutter text-body">
        <div>
          <dt className="text-meta text-muted">Problem</dt>
          <dd>{project.problem}</dd>
        </div>
        <div>
          <dt className="text-meta text-muted">What I did</dt>
          <dd>{project.whatIDid}</dd>
        </div>
        <div>
          <dt className="text-meta text-muted">What changed</dt>
          <dd>{project.whatChanged}</dd>
        </div>
      </dl>

      <ContentSections sections={project.sections} />
```

- [ ] **Step 4: Run both suites**

```bash
npm test && npm run test:export && npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/work/[slug]/page.tsx tests/export/work-routes.test.ts
git commit -m "feat: the detail page opens where the card used to

The paired half of the tile change. The page skipped these three lines because
the card carried them; the card now carries a summary, so the page is the only
place they exist and dropping them would reintroduce the failure the Tile
Schema exists to prevent.

The export guard inverts with the rule rather than being deleted, and it moves
from body() to text(), because these lines carry apostrophes that ship as
entities.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: The GlyphsHero chain diagram

Shows the one idea that makes the combat system his: each chain item reclassifies exactly one axis. Vocabulary is taken from `CONTEXT.md` in the game repo so the diagram and the code agree.

**Files:**
- Create: `src/content/figures/glyphshero-chain.ts`
- Create: `src/components/figures/glyphshero-chain.tsx`
- Modify: `src/content/types.ts` (`FigureId`)
- Modify: `src/components/figures/registry.ts`
- Modify: `src/content/projects.ts` (the embed section)

**Interfaces:**
- Produces: `glyphsheroChain` with a `title: string`, and `GlyphsheroChain` as a `ComponentType`.

- [ ] **Step 1: Write the figure data**

Create `src/content/figures/glyphshero-chain.ts`:

```ts
// Vocabulary is GlyphsHero's own domain language, taken from CONTEXT.md in the
// game repo (Docs/adr/0004 governs the axes). Terms are canonical there:
// Single/Line/Cleave/Aoe are the pattern names, not "bolt" or "beam".
export const glyphsheroChain = {
  title: 'One item, one axis',
  standfirst:
    'An attack resolves as a sentence across independent axes. Each item added to the chain reclassifies exactly one of them, which is what lets items compose without colliding.',

  axes: ['Targets', 'Delivers', 'Spawns'],

  rows: [
    {
      chain: ['Weapon'],
      added: null,
      values: ['Nearest', 'Single', 'nothing'],
      changed: null,
    },
    {
      chain: ['Weapon', 'Converter'],
      added: 'Converter',
      values: ['Nearest', 'Line', 'nothing'],
      // Index into `values`, so the component never guesses which cell moved.
      changed: 1,
    },
    {
      chain: ['Weapon', 'Converter', 'Payload'],
      added: 'Payload',
      values: ['Nearest', 'Line', 'Aoe child'],
      changed: 2,
    },
  ],

  footnote:
    'Ported from the game repo, where the axes are the attack model of record. The chain is built by arranging items in the inventory grid, so the layout is the logic.',
} as const;
```

- [ ] **Step 2: Write the component**

Create `src/components/figures/glyphshero-chain.tsx`:

```tsx
import { glyphsheroChain as fig } from '@/content/figures/glyphshero-chain';

// Semantic tokens throughout, so the figure follows the theme toggle. No
// literal colour arrives as data here, unlike the Rollhaus diagram: that one is
// *about* a palette, this one is about structure.

export function GlyphsheroChain() {
  return (
    <div className="rounded-card border border-border p-gutter text-body">
      <p className="font-serif text-subheading leading-tight">{fig.title}</p>
      <p className="mt-tight text-meta text-muted">{fig.standfirst}</p>

      {/*
        A real table, because this is tabular data: three rows against three
        axes, and the reader compares down a column. A grid of divs would look
        the same and tell a screen reader nothing about which value belongs to
        which axis.

        overflow-x-auto on the wrapper, because the page body must never scroll
        sideways on a phone.
      */}
      <div className="mt-gap overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th scope="col" className="p-tight text-meta font-bold tracking-widest text-muted uppercase">
                Chain
              </th>
              {fig.axes.map((axis) => (
                <th
                  key={axis}
                  scope="col"
                  className="p-tight text-meta font-bold tracking-widest text-muted uppercase"
                >
                  {axis}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fig.rows.map((row) => (
              <tr key={row.chain.join('+')} className="border-t border-border">
                <th scope="row" className="p-tight text-meta font-normal">
                  {row.chain.map((item, index) => (
                    <span key={item}>
                      {index > 0 ? ' + ' : ''}
                      <span className={item === row.added ? 'font-bold' : undefined}>{item}</span>
                    </span>
                  ))}
                </th>
                {row.values.map((value, index) => (
                  <td key={fig.axes[index]} className="p-tight">
                    {/*
                      The changed cell is bold *and* carries a visually hidden
                      word. Weight alone is the same failure as colour alone:
                      it says nothing to a screen reader, and this diagram's
                      entire argument is which single cell moved.
                    */}
                    {index === row.changed ? (
                      <>
                        <span className="sr-only">changed to </span>
                        <span className="font-bold">{value}</span>
                      </>
                    ) : (
                      <span className="text-muted">{value}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-gap text-meta text-muted">{fig.footnote}</p>
    </div>
  );
}
```

- [ ] **Step 3: Add `sr-only` if the project has no such utility**

Tailwind v4 ships `sr-only` as a built-in utility. Confirm it resolves:

```bash
npm run build && grep -c "sr-only" out/_next/static/css/*.css
```

Expected: a count of at least 1. If it is 0, add the class explicitly to
`src/app/globals.css` below the `body` rule:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border-width: 0;
}
```

- [ ] **Step 4: Register the figure**

In `src/content/types.ts`, widen `FigureId`:

```ts
export type FigureId = 'rollhaus-architecture' | 'glyphshero-chain';
```

In `src/components/figures/registry.ts`:

```ts
import type { ComponentType } from 'react';
import { GlyphsheroChain } from '@/components/figures/glyphshero-chain';
import { RollhausArchitecture } from '@/components/figures/rollhaus-architecture';
import type { FigureId } from '@/content/types';

// The content data names a figure; this is where the name becomes a component.
// Record<FigureId, ...> means adding a FigureId without a component fails the
// build.
export const FIGURES: Record<FigureId, ComponentType> = {
  'rollhaus-architecture': RollhausArchitecture,
  'glyphshero-chain': GlyphsheroChain,
};
```

- [ ] **Step 5: Place the embed in the GlyphsHero record**

In `src/content/projects.ts`, in the `glyphshero` record's `sections`, insert after the `Context` section:

```ts
      {
        kind: 'embed',
        heading: 'How an attack is built',
        caption:
          'The attack model as the game actually resolves it, ported onto the tokens this site runs on, so it follows the theme.',
        figure: 'glyphshero-chain',
      },
```

- [ ] **Step 6: Run everything**

```bash
npm test && npm run typecheck && npm run test:export
```

Expected: PASS. `tests/export/figures.test.ts` will now assert this embed's
heading and caption reach the exported HTML.

- [ ] **Step 7: Commit**

```bash
git add src/content/figures/glyphshero-chain.ts src/components/figures/glyphshero-chain.tsx src/components/figures/registry.ts src/content/types.ts src/content/projects.ts
git commit -m "feat: the chain diagram, one item and one axis at a time

The claim is that each chain item reclassifies exactly one axis, which is what
lets items compose instead of colliding. Three rows, one item added per row,
exactly one column moving.

A real table, because the reader compares down a column and a grid of divs
would tell a screen reader nothing. The changed cell is bold and carries a
visually hidden word: weight alone fails the same way colour alone does, and
which cell moved is the whole argument.

Vocabulary is the game repo's own, so the diagram and the code agree.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: GlyphsHero gains its game content

The record is framed entirely on the AI workflow and contains no game content. Per `CLAUDE.md` guardrail 2 the AI story is this site's meta case study, so the game material is added beneath rather than swapping one out.

**Files:**
- Modify: `src/content/projects.ts` (the `glyphshero` record)

- [ ] **Step 1: Rewrite the Context section**

Replace the `Context` section's `body` with:

```ts
        body: [
          'GlyphsHero is a hex-grid auto battler I have been building alone since 2023. Into the Breach for the tactics, Noita for the way spells are assembled out of parts, Backpack Battles for the inventory that assembles them.',
          'The idea it is built on is that your inventory is your spellbook. Items sit in a grid, adjacent items form a chain, and the chain is the attack. Rearranging your bag is how you change what you cast, so inventory management stops being bookkeeping and becomes the main decision.',
          'It is also where the reusable systems I have carried from project to project for years currently live, so the architecture underneath it is older than the game on top of it.',
        ],
```

- [ ] **Step 2: Add the combat section after the embed**

Insert directly after the `embed` section added in Task 7:

```ts
      {
        kind: 'prose',
        heading: 'Why the axes are separate',
        body: [
          'The first version had an item type per behaviour: a piercing weapon, a splitting weapon, a homing weapon. Every new combination meant a new type, and the combinations multiply faster than you can author them.',
          'Splitting an attack into independent axes fixed it. Target selection picks what the attack aims at, delivery decides which hexes it covers, propagation decides what it spawns on impact. An item reclassifies one axis and leaves the others alone, so a converter that turns a single-hex hit into a line does not need to know what payload is attached behind it.',
          'The cost of that is a vocabulary you have to hold in your head, and I keep it written down rather than in my head: the domain glossary and nine ADRs live in the repo, and they are what stop the terms drifting while the code changes underneath them.',
        ],
      },
```

- [ ] **Step 3: Keep the AI section, retitled for its new neighbours**

The `The loop` section stays. Change its heading only, so it reads as one facet of the project rather than the whole of it:

```ts
        heading: 'How it gets built',
```

- [ ] **Step 4: Run everything**

```bash
npm test && npm run typecheck && npm run test:export
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/projects.ts
git commit -m "feat: GlyphsHero is a game before it is a workflow

The record carried the AI story and no game at all, which made the one project
with a real systems argument read as a process note. The game goes underneath
it, not instead of it: guardrail 2 puts the AI story in this site's own meta
case study, and the workflow section stays as one facet of the project.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Log the decisions

**Files:**
- Modify: `_build-log.md`

- [ ] **Step 1: Append the entry**

Append a dated section covering: the reference review and what it found; the paired tile/detail-page change and why it could not be a swap; the rejected options (the cut-between loop, the before/after slider, truncating a schema line onto the card, dropping prose from cards, 21st.dev components); the How to God correction and the propagation gap that caused it; and the two guards that inverted rather than being deleted.

- [ ] **Step 2: Commit**

```bash
git add _build-log.md
git commit -m "docs: log the visual direction round, rejections included

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Follow-on, not in this plan

Once the Figma captures land, each is a `figure` section appended to the
Rollhaus record. No code changes: the `figure` kind already renders `src`, `alt`,
`caption`, `width`, `height`, and `tests/export/figures.test.ts` already guards
that the file shipped and the alt text reached the HTML.

1. Mode-switch two-state comparison
2. Side-panel before/after (static side-by-side, not a slider)
3. Extension strip: quad / inline / ice / shoe-only
4. Replacement editor figure, retiring the placeholder whose panel reads "Patten"

Also deferred, with reasons in the spec: the type scale (font-size only, no
line-height/weight/tracking tokens), self-hosted fonts, and motion.
