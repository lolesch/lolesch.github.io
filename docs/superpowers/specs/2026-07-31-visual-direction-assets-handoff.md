# Handoff: the four remaining Rollhaus assets

Date: 2026-07-31
Status: **done.** Extraction run, all six figures shipped, `projects.ts` wired.

Executed the same day. What actually happened is below each section; the round
is logged in `_build-log.md`. Four of the six crop boxes recorded here needed
correcting against the file before they were usable, so the boxes in this
document are superseded by the ones in `scripts/extract-figures.py`, which is
the source of truth for every committed figure.

Companion to `2026-07-31-visual-direction-design.md`. That spec is implemented on
`main` except for the Rollhaus captures in its Assets table. This file records
where each one comes from so the extraction can be done without re-scanning the
sources.

## Repo state at handoff

- On `main`, working tree clean, 11 commits ahead of `origin/main`, unpushed.
- `feat/visual-direction` is fully merged (`git log feat/visual-direction ^main`
  is empty). Safe to delete once pushed.
- Spec asset 4 shipped as `src/components/figures/glyphshero-chain.tsx`.
- Spec asset 6 shipped as `public/figures/how-to-god.jpg`.
- Spec asset 7 shipped as `public/figures/glyphshero-runes.png`.
- Still placeholder: `public/figures/rollhaus-editor.jpg`, used in two places,
  the Rollhaus `thumb` at `projects.ts:26` and the figure at `projects.ts:68`.

## The sources

Four Figma canvas exports in `../job-search/portfolio/case_studies/assets/`:

| File | Page size (pt) |
|---|---|
| `Project3_Rollhaus (Lo-Fi).pdf` | 10291 x 9772 |
| `Project3_Rollhaus (Mid-Fi).pdf` | 9964 x 4393 |
| `Project3_Rollhaus (Hi-Fi).pdf` | 10908 x 7048 |
| `Project3_Rollhaus (Components).pdf` | 13178 x 14325 |

Each is **one PDF page holding a whole Figma canvas**, not a deck. There are no
pages to select, only regions to crop, so every figure below is a `clip` entry
for `scripts/extract-figures.py`, never an `xref`.

Frame names recovered from the Components canvas, useful for orientation:
`Skates Atoms`, `Editor Atoms Cards`, `Editor Molecules`, `SideBarRework`,
`Hero Section`, `Editor Playground`, `Playground`.

Two PNGs added to the same folder on 2026-07-31, native 2916x2086 exports with
alpha: `Editor.png` and `Editor-1.png`.

## Asset 1: the mode-switch two-state comparison

**Use `Editor.png` (Quad) and `Editor-1.png` (Inline) directly.** No cropping.
They are a matched pair: same colourway, same step (`Select Your Skates`), same
124 EUR, differing only in skate type.

What one switch propagates, all visible in the pair:

- the hero render swaps quad trucks for a five-wheel inline frame
- all four option thumbnails re-render into the current colourway, because each
  is an instance of the configured product rather than a static icon
- the selection label moves from Quad to Inline

What holds: stepper position, price, background, colourway. The re-rendering
thumbnails are the strongest part and the reason a caption is barely needed.

The Hi-Fi PDF has no inline or ice editor state, so these PNGs are the only
shipped-fidelity source for this claim. A lower-fidelity fallback exists in the
Lo-Fi canvas if ever needed (dark exploration direction, carries a `Pretty Logo`
placeholder in the right panel):

    lofi  clip [0.7025, 0.6440, 0.7930, 0.7500]   quad
    lofi  clip [0.7025, 0.7695, 0.7930, 0.8755]   inline

## Asset 2: the side-panel before and after

Both halves are in the Components canvas, in the same visual language.

    comp  clip [0.1030, 0.2975, 0.1440, 0.4215]   before, width 700
    comp  clip [0.0200, 0.4655, 0.0705, 0.5945]   after,  width 900

**Before** is the merged column inside the `Editor Molecules` frame: Shoe, then
Pattern 5 EUR, then Skates, then Wheels 23 EUR, one continuous scroll of
unrelated options.

**After** is the left column of the frame Figma itself names `SideBarRework`:
four categories, each a four-icon selector with the active step ringed and the
connector line filled, sitting above its own option grid. This is the sentence
at `projects.ts:99` rendered as an image.

**Open question, needs Leonid.** The merged list demonstrably exists in the file,
but nothing proves it is the exact screen the 18 Maze participants clicked. Until
that is confirmed, caption it as the two panel structures rather than as a test
artefact. Guardrail 1.

**Caution.** `Editor Molecules` also contains the strings "Custom Inline Skates
Coming Soon, Stay Tuned!" and the same for ice, meaning the per-type wheel sets
were not all built. The crop box above excludes that column (it sits near
x = 0.1585). Do not widen the crop.

## Asset 3: the extension strip

    hifi  clip [0.0918, 0.7227, 0.1968, 0.9473]   width 1400

The Hi-Fi homepage grid, sections Quads / Inline / Ice. Chosen over the four
atoms in `Skates Atoms` because it makes the harder argument: the checkerboard
boot appears as a Quad and as an Ice skate, the tartan as an Inline and an Ice,
the geometric colourblock as a Quad and an Inline. Same boot, same pattern,
different mount. Extension rather than duplication, shown in the product instead
of in a parts diagram.

## Asset 5: fold it into asset 1

Recommended, not yet decided. Rather than swapping a clean editor screenshot in
for the placeholder, retire `rollhaus-editor.jpg` from both of its jobs:

- **The figure** at `projects.ts:68` becomes the asset 1 pair. Its heading is
  already "The editor" and its caption already reads "with each category on its
  own step and the configured skate updating alongside it", which the pair
  demonstrates and a single screenshot only asserts. Delete the PLACEHOLDER
  comment block at `projects.ts:57-63`.
- **The thumb** at `projects.ts:26` becomes a crop of `Editor.png`. The
  colourblock boot reads better at card size than the white one.

This closes spec asset 5 by making it unnecessary, and avoids two near-identical
editor shots on one page.

If a standalone clean editor is wanted after all, the Hi-Fi viewport is here:

    hifi  clip [0.2350, 0.0855, 0.3665, 0.2270]   width 1600

`PageName` in the browser tab is fine and stays. Leonid, 2026-07-31: it shows the
system behind it.

## Two additions not in the spec's table

**Outcome: the tree shipped, the debug panel did not.** Both were extracted and
looked at. Leonid took the option tree; two working-note figures on one page is
one more than the page can hold. The debug panel's box is kept in
`extract-figures.py` as a recorded rejection rather than deleted.

Both were found while scanning and both carry a claim prose cannot, which is
decision 1 of the spec.

**The debug variable panel.**

    hifi  clip [0.4200, 0.2260, 0.5520, 0.2585]   width 1800

Four blocks on the Hi-Fi cart page naming the variables that drive the screen:
Shoe Type / Shoe Pattern / Shoe Size, Skate Type / Wheels Color / Wheels Type,
Shoe / Pattern / Wheel / Total Price, Side Panel Content / Side Panel State. The
strongest evidence on the whole canvas for "built on Figma variables and modes",
because it shows the variable layer rather than its output. Visually plain, which
suits a page already carrying product shots.

**The Customization Options tree.**

    lofi  clip [0.7185, 0.1330, 0.7620, 0.2430]   width 900

The Lo-Fi note enumerating the full option space down to ball bearings and inline
sub-type by wheel count. Carries `projects.ts:82`, "either one variable system
could carry all of that or it would collapse".

## Do not use

The exploded inline-skate parts diagram in the Lo-Fi canvas
(around `[0.84, 0.19, 0.98, 0.29]`) is a stock reference image, not Leonid's or
Yassine's work. Guardrail 4.

## Next steps

All five done on 2026-07-31.

1. **Done.** `FIGURES` carries seven entries. Boxes were re-derived off the
   files rather than reused: the option tree box cut the left edge off every
   line and stopped a row early, the extension strip clipped all three headings
   and the whole bottom row, and both panel boxes included Figma's dashed
   section outline.
2. **Done, differently.** The PNGs are not copied. `extract-figures.py` gained a
   third mode, `png`, which crops in source pixels and flattens to JPEG at 1400
   wide: 134 KB and 138 KB rather than 3.9 MB each. The crop insets 10px into
   the mockup's rounded window, because flattening the transparent corners of
   the full frame puts white wedges in a figure that sits on a dark theme.
3. **Done.** The figure became a `comparison`, a new section kind for a fixed
   pair of labelled states. The thumb is `rollhaus-thumb.jpg`, framed to 16:10
   in the script because the tile crops with `object-cover`. The placeholder
   comment is gone and so is `public/figures/rollhaus-editor.jpg`.
4. **Resolved conservatively.** Leonid, 2026-07-31: caption it as two panel
   structures. The confirmation against the Maze build is still open, and the
   question now lives beside the crop in `extract-figures.py`.
5. **Done.** `_build-log.md`, rejections included.

Beyond the list: `sections.tsx` and `tests/export/figures.test.ts` both picked
the LCP image with `findIndex(s => s.kind === 'figure')`. A `comparison` is now
the first image on Rollhaus, so both were about to lazily load the page's LCP
candidate with every test still green.

## Reproducing the scan

Needs `pymupdf`. Every coordinate above is a fraction of the page rect, matching
the `clip` convention already in `scripts/extract-figures.py`.

```python
import fitz
doc = fitz.open(pdf_path)
page = doc[0]
r = page.rect
box = fitz.Rect(r.x0 + x0 * r.width,  r.y0 + y0 * r.height,
                r.x0 + x1 * r.width,  r.y0 + y1 * r.height)
zoom = out_width / box.width
page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=box, alpha=False).save(out)
```
