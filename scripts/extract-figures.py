"""Extract case-study figures from the source Figma exports.

An authoring tool, not a build step. It is deliberately outside `npm run build`
for two reasons: the sources live in the sibling `job-search` repo and are far
too large to vendor (the Rollhaus FigJam export alone is 202 MB), and a figure
should change only when someone decides it should, never as a side effect of a
deploy. The derived images are committed; this file is why they look the way
they do.

Without it the figures in `public/figures/` are mystery assets: no way to tell
which deck a crop came from, at what page, or whether a sharper version exists.
That matters more here than usual, because the site's own argument is that code
is the source of truth.

Usage (needs `pip install pymupdf`, and the sibling repo checked out):

    python scripts/extract-figures.py            # write every figure
    python scripts/extract-figures.py --list     # show provenance, write nothing

Four extraction modes:

  xref  Copy an embedded image out of a PDF byte for byte. No re-encode, so
        this is the original asset at native resolution. Preferred whenever the
        artifact was placed into the slide as one image.
  clip  Render a region of a PDF page. For artifacts drawn as vector on the
        canvas, where there is no embedded image to lift and resolution is
        therefore ours to choose. Coordinates are fractions of the page rect,
        so they survive a re-export at a different page size.
  png   Crop and rescale a raster export. The Rollhaus editor states were
        exported from Figma as PNGs rather than onto a canvas, so there is no
        page to clip. Coordinates here are source pixels, because that is what
        the export is measured in.
  over  A `clip` with a second `clip` laid over it behind a scrim. One figure
        needs this and it is the one place in this file that composes rather
        than crops, so the record carries every number: which two regions, the
        scrim's opacity, and where on the first the second lands. See the
        `over` key on `fermentor-flow-showme.png` for why that is honest there
        and would not be somewhere else.

The four Rollhaus canvas exports are each *one PDF page holding a whole Figma
canvas*, not a deck: `page` is always 0 and there is nothing to select but a
region. Boxes below were read off the file (frame outlines, text bounds) rather
than eyeballed, so they sit on content edges instead of near them.

On JPEG vs PNG: product renders and photographic patterns go to JPEG, flat
colour and type go to PNG. The one place that is not obvious is the option
tree, which is large black text on flat pink and is both smaller and sharper as
a PNG.
"""

import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# The sibling repo holding the Figma exports. Not vendored, not required to
# build the site: only to regenerate a figure.
#
# Per project since 2026-08-02, when the sibling repo moved from one flat
# `case_studies/assets` folder to a folder per project. The layout inside is not
# consistent between them: Rollhaus keeps its PDFs in `source/` and its PNGs in
# `assets/`, FerMentor keeps everything at the project root. Rather than encode
# that per figure, `find_source` looks in all three and takes the first hit,
# which costs nothing and survives the next reorganisation.
PROJECTS = REPO.parent / "job-search" / "portfolio" / "projects"

SUBDIRS = ("source", "assets", "")


def find_source(figure):
    """Absolute path to a figure's source file, existing or not."""
    base = PROJECTS / figure["project"]
    name = figure.get("png") or figure["pdf"]
    for subdir in SUBDIRS:
        candidate = base / subdir / name if subdir else base / name
        if candidate.exists():
            return candidate
    return base / name


LOFI = "Project3_Rollhaus (Lo-Fi).pdf"
HIFI = "Project3_Rollhaus (Hi-Fi).pdf"
COMPONENTS = "Project3_Rollhaus (Components).pdf"

# The FerMentor exports, whole Figma canvases rather than decks, so `page` is
# always 0 and there is nothing to select but a region. `Screens.pdf` is the
# Components page's Screens frame at 4986x5158pt.
#
# `Capstone Task & Planning Group 2.pdf`, the FigJam board, is no longer read
# by anything here. Its one crop is in the rejected notes at the bottom of this
# list, with the reason.
SCREENS = "Screens.pdf"

# The component library, one canvas per level of the hierarchy the case study
# claims. Untouched until 2026-08-06, when two sections turned out to be
# asserting things these files show: the four feedback levels and the order the
# product asks you to assess in. `Molecule.pdf` was the first of those and is no
# longer read here; its crop is in the rejected notes at the bottom of the list.
ORGANISM = "Organism.pdf"

# The Figma section outline, a dashed violet rectangle, sits a few points
# outside each frame on the Components canvas. Every box below is pulled in to
# the frame's own fill so the outline does not ship as decoration.
FIGURES = [
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
        "clip": [0.4190, 0.2250, 0.5530, 0.2600],
        "width": 1700,
        "why": (
            "The debug panel left on the cart screen during the build, printing "
            "live variable state in four groups. Scouted and cut on 2026-07-31 "
            "because two working-note figures on one page was one too many; the "
            "page it was cut from no longer exists. It is the second half of the "
            "variables pair: the panel above defines the state, this shows a "
            "product screen reading it. PNG for the same reason the variables "
            "crop is. Bottom edge is 0.2600 rather than the 0.2620 first tried, "
            "which cut through the tops of the next row of labels. Do not widen."
        ),
    },
    {
        "out": "public/figures/rollhaus-extension.jpg",
        "project": "rollhaus",
        "pdf": HIFI,
        "page": 0,
        "clip": [0.0891, 0.7188, 0.1995, 0.9524],
        "width": 1400,
        "why": (
            "The Hi-Fi shop grid, sections Quads / Inline / Ice. Chosen over the "
            "four atoms in `Skates Atoms` because it makes the harder argument: "
            "the checkerboard boot appears as a quad and as an ice skate, the "
            "tartan as an inline and an ice, the colourblock as a quad and an "
            "inline. Same boot, different mount, shown in the product rather "
            "than in a parts diagram. Box covers the Quads heading down to the "
            "bottom of the Ice row and stops above 'Make it yours'."
        ),
    },
    {
        "out": "public/figures/fermentor-thumb.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.03490, 0.70668, 0.31569, 0.87631],
        "width": 1120,
        "why": (
            "The project-grid card, three batch-detail screens on the canvas "
            "background, cropped to 16:10 for the same reason the Rollhaus thumb "
            "is: the tile fixes that ratio and crops with object-cover. Three "
            "portrait phones is what makes 16:10 land honestly here, and two "
            "would leave margins doing nothing. Chosen over the dashboard group, "
            "which reads as any list app; this one carries SHOW ME, the overdue "
            "banner and the Ready state, so the card shows the product's "
            "argument rather than its navigation."
        ),
    },
    # The four flow states, added 2026-08-06 and re-cut on 2026-08-07. Every
    # phone frame on this canvas measures exactly 390x844pt, found with
    # `get_drawings` rather than by eye, so these four boxes are the same box at
    # four offsets and any difference between the images is a difference in the
    # product. The prose in Outcome used to list these four in a sentence; it
    # does not any more.
    {
        "out": "public/figures/fermentor-flow-dashboard.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.04412, 0.28286, 0.12234, 0.44649],
        "width": 700,
        "why": (
            "Step 1 of 4 since 2026-08-07, when the lock-screen notification "
            "that opened the progression came out. The dashboard: next actions "
            "with their countdowns above the batches in progress. Column 1 of "
            "four on the canvas, chosen while column 2 was still on the page as "
            "the early half of the dashboard pair. That pair came out later the "
            "same day, so this is the only dashboard on the page now and the "
            "reason for picking between the two columns went with it."
        ),
    },
    {
        "out": "public/figures/fermentor-flow-new.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.04392, 0.49651, 0.12214, 0.66014],
        "width": 700,
        "why": (
            "Step 2 of 4, added 2026-08-07 on Leonid's call that the flow should "
            "show a batch being started rather than a notification arriving. The "
            "only New Batch frame on the canvas, and it is the first of four "
            "setup steps: a checklist of ingredients, supplies and optional "
            "equipment under a MATERIALS tab, with 2, 3 and 4 still to come. "
            "Same 390x844pt box as its three siblings, one row up."
        ),
        "open": (
            "What steps 2, 3 and 4 of the setup ask for is not in this frame and "
            "is not recorded in `fermentor_source_of_truth.md`, so nothing on "
            "the page claims it. The batch info the rest of the app reads, jars, "
            "salt percentage and start date, has to be entered somewhere and "
            "this wizard is the only candidate, but that is an inference and it "
            "stays out of the copy."
        ),
    },
    {
        "out": "public/figures/fermentor-flow-showme.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.04392, 0.71016, 0.12214, 0.87379],
        "width": 700,
        # The one composed figure in this file. The design file draws the
        # overlay card beside the screen it belongs to rather than over it, and
        # the working TODO list on the same canvas carries "add system prompts
        # as overlay" struck through as done, so the presentation is decided in
        # the source and only the rendering of it is missing. Composing is what
        # puts the control and the thing it opens in one image; the alternative
        # is a screen with a button on it and, six sections later, a card that
        # the reader has to connect back by memory.
        #
        # Every number here is a choice and none of it is design work of mine:
        # the card is at its native size, horizontally centred (390-360)/2 = 15pt
        # in from the left, and sits at 468pt from the top, which is the gap
        # directly under the Activation card that carries SHOW ME. Leonid asked
        # for it vertically centred; that placement covers the button, so the
        # image would show the result of an interaction whose trigger is hidden
        # behind it. Move `at[1]` to 0.38152 for the centred version.
        "over": {
            "clip": [0.31688, 0.70996, 0.38909, 0.74874],
            "at": [0.03846, 0.55450],
            "scrim": 0.15,
            # The flat Figma canvas the card is drawn against. Keyed out at the
            # four corners so the card's own radius survives the composite
            # instead of shipping four grey wedges.
            "canvas": (68, 68, 68),
            "corner": 10,
        },
        "why": (
            "Step 3 of 4, and the product in one image: the five stages as a "
            "stack with SHOW ME on the one in progress, and behind a 15% scrim, "
            "the card that button opens. The card commits to what this stage "
            "should look like right now, for this batch, before the user has "
            "reported anything, which is the whole argument of the case study "
            "and was previously only readable six sections further down. Since "
            "2026-08-07 this composite is the only place that card appears at "
            "all: the Predict, then report pair that shipped it full size, "
            "beside the observation card the user answers with, came out the "
            "same day."
        ),
        "open": (
            "The Maturing stage reads 'Maturing description here', a placeholder "
            "left in the capstone file. It is behind the card in this crop and "
            "it is not quoted in the alt text. Recorded so a clean re-export can "
            "fix it rather than the next reader finding it."
        ),
    },
    {
        "out": "public/figures/fermentor-flow-ready.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.22603, 0.71016, 0.30425, 0.87379],
        "width": 700,
        "why": (
            "Step 4 of 4, the way out: every stage checked off and the Ready "
            "card offering KEEP MATURING or STORE. A decision rather than a "
            "congratulation, which is the point of ending the flow here instead "
            "of on a success screen."
        ),
        "open": (
            "Two states in this frame disagree with each other. The step counter "
            "reads 3/5 while all five stages are complete, and the batch info "
            "card still reads Status Activation. Both are stale mock data rather "
            "than design, so the alt text describes the stage stack and the "
            "Ready card and quotes neither."
        ),
    },
    {
        "out": "public/figures/fermentor-ladder.png",
        "project": "fermentor",
        "pdf": ORGANISM,
        "page": 0,
        "clip": [0.03483, 0.33987, 0.22537, 0.66587],
        "width": 1400,
        "why": (
            "The assessment ladder as the component library holds it, and the "
            "evidence for a rule the page has stated since 2026-08-02 and never "
            "shown: assessment is ordered so the jar stays shut as long as "
            "possible. Three rows by two columns. Smell, then taste, each beside "
            "its own processing state, then the two verdicts. The smell prompt "
            "is the one that says 'carefully open the jar', and it is drawn at "
            "the highest attention level in the set, which is the ordering rule "
            "visible in the styling rather than asserted in prose. Box sits "
            "inside the group's dashed outline on all four sides. Since "
            "2026-08-07 it is the only image in The system section, which is "
            "the merge of the section this crop was made for and the prose that "
            "followed it."
        ),
        "open": (
            "The box starts below the prediction and observation cards because "
            "the comparison above it shipped those two full size. That section "
            "came out on 2026-08-07, so the reason for the top edge no longer "
            "holds and the wider box, organism clip [0.0328, 0.0942, 0.2274, "
            "0.6696], would put the whole exchange back on the page inside this "
            "figure. Not taken: Leonid cut that section, and widening a crop to "
            "carry its content back in is the same content arriving through a "
            "side door. One line to change if he wants it."
        ),
    },
    # The GlyphsHero entries, added 2026-08-07: its first figures in this
    # pipeline. The live thumb was hand-copied in before this project had an
    # `assets/` folder here; this pass gives it one, the same provenance
    # discipline Rollhaus and FerMentor already have.
    {
        "out": "public/figures/glyphshero-runes.png",
        "project": "glyphshero",
        "png": "glyphshero-runes.png",
        "crop": [0, 0, 340, 318],
        "width": 340,
        "why": (
            "The project-grid card and detail-page thumb, generated by Leonid's "
            "own prompts. Copied in from the game repo's Assets/Art/G.png, the "
            "same 340x340 file already live on the site. The crop drops the "
            "bottom 22px, a generator watermark strip, and stops there: the "
            "source's softness at this resolution is a known gap PRODUCT.md "
            "records, and this pass does not claim to fix it."
        ),
    },
    {
        "out": "public/figures/glyphshero-test-runner.png",
        "project": "glyphshero",
        "png": "TestRunner.png",
        "crop": [0, 0, 986, 749],
        "width": 986,
        "why": (
            "The Unity Test Runner, EditMode tab, 213 of 213 tests green across "
            "six module groups: Combat, Inventory, Pawns, Statistics, UI, "
            "Utility. Leonid's own capture, provided 2026-08-07, and the one "
            "step the agent cannot do itself, since the Runner only runs inside "
            "the Editor. Full-bounds crop, a no-op: the capture is already "
            "framed and native resolution is the point."
        ),
    },
]

# Rejected while scanning, recorded so the next session does not re-derive them:
#
#   The exploded inline-skate parts diagram on the Lo-Fi canvas, around
#   [0.84, 0.19, 0.98, 0.29], is a stock reference image rather than Leonid's or
#   Yassine's work. Guardrail 4, do not use.
#
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
#
#   A standalone clean editor viewport, hifi clip [0.2350, 0.0855, 0.3665,
#   0.2270] at width 1600. It replaces the "Patten" typo and the clipped summary
#   card that made the old rollhaus-editor.jpg a placeholder, but the two-state
#   pair retires that figure's job entirely, and one page does not need two
#   near-identical editor shots.
#
#   The FerMentor home screen and splash frames, screens clip [0.12174, 0.07968,
#   0.19996, 0.24331] and [0.2128, ...] at the same box as the flow states.
#   Rejected on 2026-08-06 as step 1 of the flow: an app icon on an iOS home
#   screen is the same picture for every app ever shipped, and a splash frame is
#   a logo. The notification screen two frames along shows the product doing the
#   one thing this case study is about.
#
#   A second Kimchi batch detail, screens clip [0.43562, 0.71016, 0.51384,
#   0.87379], sitting alone outside the Current Batch group. It is the same
#   screen one stage later, with SHOW ME moved from Activation to Stabilizing,
#   and it would make a two-state pair proving the stack advances. Cut because
#   the flow progression already spends four images on this product and the
#   difference between the two is one row.
#
#   The whole assessment organism group, organism clip [0.0328, 0.0942, 0.2274,
#   0.6696]. It carries the prediction and observation cards as well, which the
#   comparison two sections above shipped at full size, so the crop started
#   below them instead. That comparison is gone as of 2026-08-07 and this box is
#   now live again rather than rejected: see the `open` note on
#   `fermentor-ladder.png` for why it is still not taken.
#
#   The SHOW ME exchange as a pair, `fermentor-predict.png` at screens clip
#   [0.31588, 0.71001, 0.39009, 0.74952] and `fermentor-report.png` at
#   [0.31588, 0.82590, 0.39009, 0.87418], both at width 800. Shipped 2026-08-02
#   to 2026-08-07 as the Predict, then report comparison: the system committing
#   to what a stage should look like, and the user answering in the same three
#   categories in the same order. Leonid cut the section on 2026-08-07 and the
#   two crops went with it. The prediction card survives on the page as the
#   overlay in `fermentor-flow-showme.png`; the observation card, with its
#   dropdowns, is not on the site any more, and the matching-order argument is
#   now carried by one sentence of prose in `From model to product` rather than
#   by a picture. That is the sharpest thing this pass gave up.
#
#   The dashboard pair, `fermentor-dash-early.png` at screens clip [0.13498,
#   0.28131, 0.21380, 0.44532] and `fermentor-dash-late.png` at [0.22603,
#   0.28131, 0.30465, 0.44532], both at width 700 and both the same box two
#   columns apart. Shipped 2026-08-02 to 2026-08-07. The two countdowns that are
#   not the subject move 6d to 4d and 11d to 9d, which dated the pair at two
#   days without the caption having to assert it, and nothing between the two
#   frames was edited: time passing was the only input. Cut with the section
#   that held it. Nothing else on the site shows one screen at two moments, so
#   if a later pass wants that argument back these are the two boxes.
#
#   The four feedback levels as one component set, `fermentor-feedback.png` at
#   `Molecule.pdf` clip [0.05250, 0.54111, 0.25550, 0.68356] at width 1200.
#   Green check, amber dot, orange triangle, red diamond, the last reading 'now'
#   where the others read 'in 2d'. Added 2026-08-06 against a claim The system
#   had been making since 2026-08-02 with nothing behind it, shipped for one day
#   as the page's only inset, and cut on 2026-08-07 when that section merged
#   with the ladder figure. Less is lost than it looks: the ladder that stayed
#   carries three of the four levels on real cards, green check, orange triangle
#   and red diamond, each on its own tint. What only this crop shows is the four
#   as one component set, which is the difference between a system and a set of
#   choices that happen to agree. Re-derive it here if that difference has to be
#   made again.
#
#   The three candidate problem framings on the UX Research board, planning clip
#   [0.48621, 0.49157, 0.54490, 0.55771] at width 1100, from `Capstone Task &
#   Planning Group 2.pdf`. Shipped 2026-08-02 to 2026-08-06 as a 1101x2811 PNG,
#   then ported to text, then dropped entirely on 2026-08-07 when the section
#   holding it merged into the prose above it. Both versions were the same
#   mistake at different resolutions: by the time a reader reaches them the
#   choice between the three has already been made and argued, so the artifact
#   is restating a decision rather than evidencing one. The three statements are
#   in the copy now, in the paragraph that picks between them.
#
#   The FerMentor lock-screen notification, screens clip [0.48596, 0.07968,
#   0.56418, 0.24331] at width 700, written as `fermentor-flow-notice.jpg`
#   between 2026-08-06 and 2026-08-07. It was step 1 of the flow on the argument
#   that the app decides when to speak. Leonid cut it: a notification is the one
#   screen in the flow that is not the product, and the claim it carried is made
#   twice more on the page, by the next-action list and by the dashboard pair
#   where time passing is the only input. The New Batch frame took its slot.


# How far a pixel has to sit from the canvas colour before it counts as card
# rather than as background. Small, because the only thing being separated is a
# flat fill from a card whose lightest edge is nowhere near it; the values in
# between are the renderer's antialiasing, and letting them through as partial
# alpha is what gives the composited card a clean rounded corner.
KEY_SPAN = 40


def clip_box(page, fractions):
    """The `clip` convention: a region as fractions of the page rect, so a box
    survives a re-export at a different page size."""
    import fitz

    x0, y0, x1, y1 = fractions
    rect = page.rect
    return fitz.Rect(
        rect.x0 + x0 * rect.width, rect.y0 + y0 * rect.height,
        rect.x0 + x1 * rect.width, rect.y0 + y1 * rect.height,
    )


def keyed_corners(pix, inset, canvas):
    """Alpha for a card rendered against a flat canvas: opaque everywhere except
    the four corner squares, where distance from the canvas colour gives the
    card's rounded edge, antialiasing included.

    Keying is confined to the corners on purpose. Nothing but the card's own
    radius lives there, whereas run over the whole image it would eat the card's
    body text, which is dark enough to sit inside KEY_SPAN of a mid grey.
    """
    width, height = pix.width, pix.height
    inset = min(inset, width // 2, height // 2)
    alpha = bytearray(b"\xff" * (width * height))
    for top in (0, height - inset):
        for left in (0, width - inset):
            for y in range(top, top + inset):
                row = y * width
                for x in range(left, left + inset):
                    r, g, b = pix.pixel(x, y)[:3]
                    off = max(abs(r - canvas[0]), abs(g - canvas[1]), abs(b - canvas[2]))
                    alpha[row + x] = 255 if off >= KEY_SPAN else off * 255 // KEY_SPAN
    return bytes(alpha)


def compose(doc, figure, base, zoom):
    """The `over` mode: a region, a scrim, and a second region laid on top.

    The base and the scrim stay vector all the way to the final rasterise. Only
    the overlay goes through a pixmap, because it needs an alpha channel to keep
    its rounded corners, and it is rendered at four times the output scale so
    that detour is invisible at the size that ships.
    """
    import fitz

    over = figure["over"]
    card = clip_box(doc[figure["page"]], over["clip"])

    out = fitz.open()
    page = out.new_page(width=base.width, height=base.height)
    page.show_pdf_page(page.rect, doc, figure["page"], clip=base)
    page.draw_rect(page.rect, color=None, fill=(0, 0, 0), fill_opacity=over["scrim"])

    detail = 4
    pix = doc[figure["page"]].get_pixmap(
        clip=card, matrix=fitz.Matrix(zoom * detail, zoom * detail), alpha=False
    )
    alpha = keyed_corners(pix, round(over["corner"] * zoom * detail), over["canvas"])
    pix = fitz.Pixmap(pix, 1)  # RGB -> RGBA; set_alpha needs the channel to exist
    pix.set_alpha(alpha)

    left = base.width * over["at"][0]
    top = base.height * over["at"][1]
    page.insert_image(
        fitz.Rect(left, top, left + card.width, top + card.height), pixmap=pix
    )
    # This lands one pixel narrower and shorter than the same region taken
    # through the plain `clip` mode, and the three siblings it sits beside in a
    # progression come through that mode. The cause is rounding and nothing
    # else: a clip box at x=218.99 rounds outward to 701 pixels, while the same
    # width starting at a page origin of exactly 0 rounds to 700. Same region,
    # same zoom, same framing. Not worth offsetting a synthetic page to hide.
    return page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)


def render(figure, out_path):
    """Write one figure. Returns a short description of what landed."""
    import fitz  # imported lazily so --list works without pymupdf installed

    quality = {"jpg_quality": 86} if out_path.suffix == ".jpg" else {}

    if "png" in figure:
        src = fitz.Pixmap(find_source(figure))
        x0, y0, x1, y1 = figure["crop"]
        box = fitz.Rect(x0, y0, x1, y1)

        # The exports carry alpha, and a rounded window corner over transparency
        # would flatten to a white wedge. Draw onto an opaque page instead of
        # matting the pixmap, which keeps the crop and the flatten in one step.
        doc = fitz.open()
        page = doc.new_page(width=box.width, height=box.height)
        page.insert_image(
            fitz.Rect(-x0, -y0, -x0 + src.width, -y0 + src.height), pixmap=src
        )
        zoom = figure["width"] / box.width
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
        pix.save(out_path, **quality)
        return f"{pix.width}x{pix.height} from {src.width}x{src.height} source"

    doc = fitz.open(find_source(figure))
    page = doc[figure["page"]]

    if "xref" in figure:
        # Byte for byte. Re-encoding a JPEG to write the same picture back out
        # only loses information.
        data = doc.extract_image(figure["xref"])
        out_path.write_bytes(data["image"])
        return f"{data['width']}x{data['height']} {data['ext']}, unmodified"

    box = clip_box(page, figure["clip"])
    zoom = figure["width"] / box.width

    if "over" in figure:
        pix = compose(doc, figure, box, zoom)
        pix.save(out_path, **quality)
        over = clip_box(page, figure["over"]["clip"])
        return (
            f"{pix.width}x{pix.height} from a {box.width:.0f}x{box.height:.0f}pt region, "
            f"with a {over.width:.0f}x{over.height:.0f}pt region composed over it "
            f"behind a {figure['over']['scrim']:.0%} scrim"
        )

    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=box, alpha=False)
    pix.save(out_path, **quality)
    return f"{pix.width}x{pix.height} from a {box.width:.0f}x{box.height:.0f}pt region"


def source_of(figure):
    if "png" in figure:
        return figure["png"], f"crop {figure['crop']}"
    where = f"page {figure['page']}"
    if "xref" in figure:
        return figure["pdf"], f"{where} xref {figure['xref']}"
    if "over" in figure:
        return figure["pdf"], (
            f"{where} clip {figure['clip']} "
            f"under clip {figure['over']['clip']} at {figure['over']['at']}"
        )
    return figure["pdf"], f"{where} clip {figure['clip']}"


def extract(figure, *, dry_run):
    name, how = source_of(figure)
    out_path = REPO / figure["out"]

    print(f"{figure['out']}")
    print(f"  from   {name}")
    print(f"  how    {how}")
    print(f"  why    {figure['why']}")
    if figure.get("open"):
        print(f"  OPEN   {figure['open']}")

    if dry_run:
        return True

    src_path = find_source(figure)
    if not src_path.exists():
        print(f"  SKIP   source not found: {src_path}", file=sys.stderr)
        return False

    out_path.parent.mkdir(parents=True, exist_ok=True)
    written = render(figure, out_path)
    print(f"  wrote  {written}, {out_path.stat().st_size // 1024} KB")
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--list", action="store_true",
                        help="print provenance for every figure and write nothing")
    args = parser.parse_args()

    ok = all([extract(figure, dry_run=args.list) for figure in FIGURES])
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
