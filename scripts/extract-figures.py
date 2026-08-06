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

Three extraction modes:

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
# Components page's Screens frame at 4986x5158pt; the planning board is a FigJam
# export at 21472x48681pt, which is why its fractions carry five decimals.
SCREENS = "Screens.pdf"
PLANNING = "Capstone Task & Planning Group 2.pdf"

# The component library, one canvas per level of the hierarchy the case study
# claims. Untouched until 2026-08-06, when two sections turned out to be
# asserting things these files show: the four feedback levels and the order the
# product asks you to assess in.
MOLECULE = "Molecule.pdf"
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
    {
        "out": "public/figures/fermentor-framings.png",
        "project": "fermentor",
        "pdf": PLANNING,
        "page": 0,
        "clip": [0.48621, 0.49157, 0.54490, 0.55771],
        "width": 1100,
        "why": (
            "The three candidate problem framings on the UX Research board, each "
            "with its written reasoning, which is the artifact behind the reframe "
            "section. Tall and narrow because the column is: cropping it wider "
            "would pull in the neighbouring Problem Statement and HMW columns "
            "and make it a picture of a board rather than of an argument."
        ),
        "open": (
            "The reasoning paragraphs address Leonid in the second person "
            "('evidenced in your research'), which is visible in the crop and is "
            "the AI-assisted drafting the case study discloses in prose. Left in "
            "rather than cropped out: removing it would be hiding the thing the "
            "copy already states."
        ),
    },
    {
        "out": "public/figures/fermentor-predict.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.31588, 0.71001, 0.39009, 0.74952],
        "width": 800,
        "why": (
            "Left half of the SHOW ME exchange: what the system says to expect "
            "at this stage, as Brine, Surface and Appearance. Cropped to the card "
            "alone rather than shown on the phone, because its pair below is a "
            "separate overlay and the two only read as one exchange at the same "
            "size. The dead canvas between them on the source page is why."
        ),
    },
    {
        "out": "public/figures/fermentor-report.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.31588, 0.82590, 0.39009, 0.87418],
        "width": 800,
        "why": (
            "Right half of the same exchange: what the user reports back, in the "
            "same three categories and the same order, through dropdowns rather "
            "than a text field. The matching order is the appearance-first "
            "assessment rule made visible, so both crops keep the full category "
            "column even though it costs some height."
        ),
    },
    {
        "out": "public/figures/fermentor-dash-early.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.13498, 0.28131, 0.21380, 0.44532],
        "width": 700,
        "why": (
            "Left half of the dashboard comparison, two days before the "
            "Cauliflower window closes. Same three batches as its pair, same "
            "crop box, so the only thing that differs between the two images is "
            "what the interface is saying."
        ),
    },
    {
        "out": "public/figures/fermentor-dash-late.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.22603, 0.28131, 0.30465, 0.44532],
        "width": 700,
        "why": (
            "Right half, two days later: the top row has gone from a countdown "
            "to 'act now', and the Cauliflower bar has run past its range. The "
            "other two countdowns move 6d to 4d and 11d to 9d, which is what "
            "dates the pair at two days and stops the caption having to assert "
            "it. Identical crop box to the early state, deliberately."
        ),
    },
    # The four flow states, added 2026-08-06. Every phone frame on this canvas
    # measures exactly 390x844pt, found with `get_drawings` rather than by eye,
    # so these four boxes are the same box at four offsets and any difference
    # between the images is a difference in the product. The prose in Outcome
    # used to list these four in a sentence; it does not any more.
    {
        "out": "public/figures/fermentor-flow-notice.jpg",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.48596, 0.07968, 0.56418, 0.24331],
        "width": 700,
        "why": (
            "Step 1 of 4. The cold-open row holds seven screens, and this is the "
            "only one where FerMentor does anything: a lock-screen notification "
            "saying the Cauliflower should be ready for preservation, which the "
            "app worked out from the stage model rather than from a timer the "
            "user set. Chosen over the home screen with the app icon installed, "
            "which is any app, and over the splash frame, which is a logo. JPEG "
            "rather than PNG because the wallpaper is a photographic gradient, "
            "which is the one screen in this set that is not flat colour and "
            "type."
        ),
    },
    {
        "out": "public/figures/fermentor-flow-dashboard.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.04412, 0.28286, 0.12234, 0.44649],
        "width": 700,
        "why": (
            "Step 2 of 4, the dashboard: next actions with their countdowns "
            "above the batches in progress, which is what the Outcome section "
            "describes. Column 1 of four on the canvas, not column 2, which is "
            "already on this page as the early half of the dashboard pair. Two "
            "images of one screen on one page would read as a mistake."
        ),
    },
    {
        "out": "public/figures/fermentor-flow-batch.png",
        "project": "fermentor",
        "pdf": SCREENS,
        "page": 0,
        "clip": [0.04392, 0.71016, 0.12214, 0.87379],
        "width": 700,
        "why": (
            "Step 3 of 4, and the product in one screen: the five stages as a "
            "stack, Preparation done, Activation in progress and carrying the "
            "SHOW ME button, the rest waiting. Also the prototype section's "
            "poster, for the reason the Rollhaus wheels step is its own: the "
            "facade should open on a screen the page has already shown. This "
            "frame is inside the card thumbnail too, at a fifth of the size and "
            "beside two others."
        ),
        "open": (
            "The Maturing stage reads 'Maturing description here', a placeholder "
            "left in the capstone file. It is in the source and it is not quoted "
            "in the alt text, which names the stages instead. Recorded so a "
            "clean re-export can fix it rather than the next reader finding it."
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
            "inside the group's dashed outline on all four sides, and starts "
            "below the two cards the comparison above already ships full size."
        ),
    },
    {
        "out": "public/figures/fermentor-feedback.png",
        "project": "fermentor",
        "pdf": MOLECULE,
        "page": 0,
        "clip": [0.05250, 0.54111, 0.25550, 0.68356],
        "width": 1200,
        "why": (
            "The four feedback levels as one component in four states, which is "
            "what The system section claims and could not show. Colour, icon and "
            "urgency move together: green check, amber dot, orange triangle, red "
            "diamond, and the last one reads 'now' where the others read 'in "
            "2d'. The dashed violet outline is kept for the reason the Rollhaus "
            "atoms crop keeps its own, that it is what makes this a component "
            "set rather than four screenshots, and the placeholder Task Label "
            "text is the same argument: a component has no content of its own."
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
#   comparison two sections above already ships at full size, so the crop starts
#   below them instead.


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

    x0, y0, x1, y1 = figure["clip"]
    rect = page.rect
    box = fitz.Rect(
        rect.x0 + x0 * rect.width, rect.y0 + y0 * rect.height,
        rect.x0 + x1 * rect.width, rect.y0 + y1 * rect.height,
    )
    zoom = figure["width"] / box.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=box, alpha=False)
    pix.save(out_path, **quality)
    return f"{pix.width}x{pix.height} from a {box.width:.0f}x{box.height:.0f}pt region"


def source_of(figure):
    if "png" in figure:
        return figure["png"], f"crop {figure['crop']}"
    where = f"page {figure['page']}"
    if "xref" in figure:
        return figure["pdf"], f"{where} xref {figure['xref']}"
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
