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
SOURCES = REPO.parent / "job-search" / "portfolio" / "case_studies" / "assets"

LOFI = "Project3_Rollhaus (Lo-Fi).pdf"
HIFI = "Project3_Rollhaus (Hi-Fi).pdf"
COMPONENTS = "Project3_Rollhaus (Components).pdf"

# The Figma section outline, a dashed violet rectangle, sits a few points
# outside each frame on the Components canvas. Every box below is pulled in to
# the frame's own fill so the outline does not ship as decoration.
FIGURES = [
    {
        "out": "public/figures/rollhaus-thumb.jpg",
        "png": "Editor.png",
        "crop": [22, 295, 2830, 2050],
        "width": 1120,
        "why": (
            "The project-grid card. The editor viewport below the browser chrome, "
            "cropped to 16:10 because the tile fixes that ratio and crops with "
            "object-cover, so framing it here is the only way to control it. "
            "Top edge sits just under the site logo rather than through it, "
            "which is what fixes the width: 16:10 off a 1755px-tall viewport. "
            "Chosen over a boot-only crop: at a 320px card the option panel and "
            "the cart button are what make it read as a configurator rather "
            "than a product photo, which is what the card's summary claims."
        ),
    },
    {
        "out": "public/figures/rollhaus-editor-quad.jpg",
        "png": "Editor.png",
        "crop": [22, 18, 2886, 2050],
        "width": 1400,
        "why": (
            "Left half of the two-state comparison, Quad selected. Native "
            "2916x2086 with alpha; the crop insets 10px into the mockup's "
            "rounded window so no transparent corner survives the flatten to "
            "JPEG. Browser chrome is kept deliberately: Leonid, 2026-07-31, "
            "the PageName placeholder in the tab shows the system behind it."
        ),
    },
    {
        "out": "public/figures/rollhaus-editor-inline.jpg",
        "png": "Editor-1.png",
        "crop": [22, 18, 2886, 2050],
        "width": 1400,
        "why": (
            "Right half of the same comparison, Inline selected. Identical crop "
            "to the Quad state on purpose: the figure's whole claim is what "
            "changes between them, so any difference in framing would be read "
            "as part of the answer. Matched pair, same colourway, same step, "
            "same 124 EUR. The Hi-Fi canvas carries no inline editor state, so "
            "these two PNGs are the only shipped-fidelity source for this."
        ),
    },
    {
        "out": "public/figures/rollhaus-panel-before.jpg",
        "pdf": COMPONENTS,
        "page": 0,
        "clip": [0.1050, 0.2996, 0.1415, 0.4195],
        "width": 700,
        "why": (
            "The merged column inside the `Editor Molecules` frame: Shoe, then "
            "Pattern, then Skates, then Wheels as one continuous scroll. The "
            "crop stops short of the column at x=0.1585, which carries the "
            "strings 'Custom Inline Skates Coming Soon' and the ice equivalent, "
            "because the per-type wheel sets were not all built. Do not widen."
        ),
        "open": (
            "This structure demonstrably exists in the file, but nothing in the "
            "sources proves it is the exact screen the 18 Maze participants "
            "clicked. Leonid, 2026-07-31: caption it as two panel structures, "
            "not as a test artefact, until that is confirmed. Guardrail 1."
        ),
    },
    {
        "out": "public/figures/rollhaus-panel-after.jpg",
        "pdf": COMPONENTS,
        "page": 0,
        "clip": [0.0218, 0.4679, 0.0684, 0.5932],
        "width": 900,
        "why": (
            "The left column of the frame Figma itself names `SideBarRework`: "
            "four categories, each a four-icon selector with the active step "
            "ringed and the connector filled, above its own option grid. This "
            "is the rework sentence in the case study rendered as an image."
        ),
    },
    {
        "out": "public/figures/rollhaus-extension.jpg",
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
        "out": "public/figures/rollhaus-options.png",
        "pdf": LOFI,
        "page": 0,
        "clip": [0.7006, 0.1351, 0.7654, 0.2471],
        "width": 1400,
        "why": (
            "The Lo-Fi working note enumerating the option space down to ball "
            "bearings and inline sub-type by wheel count. Box covers the pink "
            "plate and its 'Customization Options' title tab, so it reads as "
            "the note it is. The empty upper third is the note's own layout and "
            "is kept rather than cropped into, which would cut its corners off."
        ),
    },
]

# Rejected while scanning, recorded so the next session does not re-derive them:
#
#   The exploded inline-skate parts diagram on the Lo-Fi canvas, around
#   [0.84, 0.19, 0.98, 0.29], is a stock reference image rather than Leonid's or
#   Yassine's work. Guardrail 4, do not use.
#
#   The Hi-Fi debug variable panel, hifi clip [0.4190, 0.2250, 0.5530, 0.2595]
#   at width 1800, names the variables driving the cart screen and is the
#   strongest evidence on the canvas for "built on Figma variables and modes".
#   Verified and then cut on 2026-07-31: Leonid took the option tree instead,
#   and two working-note figures on one page is one more than the page can hold.
#
#   A standalone clean editor viewport, hifi clip [0.2350, 0.0855, 0.3665,
#   0.2270] at width 1600. It replaces the "Patten" typo and the clipped summary
#   card that made the old rollhaus-editor.jpg a placeholder, but the two-state
#   pair retires that figure's job entirely, and one page does not need two
#   near-identical editor shots.


def render(figure, out_path):
    """Write one figure. Returns a short description of what landed."""
    import fitz  # imported lazily so --list works without pymupdf installed

    quality = {"jpg_quality": 86} if out_path.suffix == ".jpg" else {}

    if "png" in figure:
        src = fitz.Pixmap(SOURCES / figure["png"])
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

    doc = fitz.open(SOURCES / figure["pdf"])
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

    src_path = SOURCES / (figure.get("png") or figure["pdf"])
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
