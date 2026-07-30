"""Extract case-study figures from the source Figma PDF exports.

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

Two extraction modes:

  xref  Copy an embedded image out of the PDF byte for byte. No re-encode, so
        this is the original asset at native resolution. Preferred whenever the
        artifact was placed into the slide as one image.
  clip  Render a region of the page. For artifacts drawn as vector on the
        canvas, where there is no embedded image to lift and resolution is
        therefore ours to choose.
"""

import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# The sibling repo holding the Figma PDF exports. Not vendored, not required to
# build the site: only to regenerate a figure.
SOURCES = REPO.parent / "job-search" / "portfolio" / "case_studies" / "assets"

FIGURES = [
    {
        "out": "public/figures/rollhaus-editor.jpg",
        "pdf": "Project3_Group2_Yassine&Leonid (Copy).pdf",
        "page": 5,
        "xref": 1003,
        "why": (
            "The customization editor after the usability rework: category rail, "
            "Shoe and Pattern as separate steps. Placed on the 'Wireframes' slide "
            "as its High Fidelity endpoint, which is the only export that carries "
            "the post-rework editor as a full screen. Native 1440x1024."
        ),
        "open": (
            "PLACEHOLDER. Two defects are baked into this export: the panel "
            "heading reads 'Patten', and the summary card is clipped behind the "
            "panel. Both come from how the screen was captured into the deck, not "
            "from a limitation of the design. Replace with a clean export from "
            "the design file (figma.com/design/y7bE7LrAbTqplVEh7y44ID), which has "
            "never been exported. Tracked as an open item in _build-log.md."
        ),
    },
]


def extract(figure, *, dry_run):
    pdf_path = SOURCES / figure["pdf"]
    out_path = REPO / figure["out"]

    print(f"{figure['out']}")
    print(f"  from   {figure['pdf']} page {figure['page']}")
    mode = "xref" if "xref" in figure else "clip"
    print(f"  mode   {mode} {figure.get('xref', figure.get('clip'))}")
    print(f"  why    {figure['why']}")
    if figure.get("open"):
        print(f"  OPEN   {figure['open']}")

    if dry_run:
        return True

    if not pdf_path.exists():
        print(f"  SKIP   source not found: {pdf_path}", file=sys.stderr)
        return False

    import fitz  # imported lazily so --list works without pymupdf installed

    doc = fitz.open(pdf_path)
    page = doc[figure["page"]]
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if "xref" in figure:
        # Byte for byte. Re-encoding a JPEG to write the same picture back out
        # only loses information.
        data = doc.extract_image(figure["xref"])
        out_path.write_bytes(data["image"])
        print(f"  wrote  {data['width']}x{data['height']} {data['ext']}, "
              f"{len(data['image']) // 1024} KB")
    else:
        x0, y0, x1, y1 = figure["clip"]
        rect = page.rect
        box = fitz.Rect(
            rect.x0 + x0 * rect.width, rect.y0 + y0 * rect.height,
            rect.x0 + x1 * rect.width, rect.y0 + y1 * rect.height,
        )
        zoom = figure["width"] / box.width
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=box, alpha=False)
        pix.save(out_path)
        print(f"  wrote  {pix.width}x{pix.height} png")

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
