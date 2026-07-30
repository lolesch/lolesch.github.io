# lolesch.github.io — Portfolio & Design-System Case Study

Personal portfolio website that doubles as a design-engineering case study: a token-driven design system, code-as-source-of-truth workflow, and a set of UX/UI + frontend case studies. Owner: Leonid Schreiber (GitHub `lolesch`).

Status: strategy complete, build starting. Positioning, IA, and the architecture are locked in `CONTEXT.md` + `docs/adr/`; the v1 scope is issue #1. No application code exists yet.

## Content guardrails

These bind every session that writes outward-facing text. They come from a 2026-07-29 reconciliation with Leonid; the rationale is in `_build-log.md`.

1. **Claim only what ships.** The Figma round-trip was aspirational in earlier CV drafts. ADR-0002's one-directional sync resolves it *if built*. Until it is built and deployed, it is not a claim. Same for anything else in the PRD.
2. **The AI story belongs to this site and nowhere else.** The code-first AI workflow is the meta case study (v2). Never retrofit it onto Rollhaus or any SPICED project. Rollhaus used no AI.
3. **Rollhaus is C-primary** (UX Engineer). Lead with the system, not the user. One version only; it still appears in UX/UI applications, carried there by visuals rather than by reordering.
4. **Attribution.** SPICED work was often group work. Rollhaus is a two-person project with Yassine Alikhbari, so "we" is correct where the team genuinely did it. Never widen a claim past what the source-of-truth files support.
5. **Tone.** No em-dashes. State an honest limitation once, where it lands hardest, not repeatedly. Label course projects as course projects. Read `../job-search/_project/tone_of_voice.md` before writing and run its check after.
6. **Log decisions here.** Append to `_build-log.md` (or an ADR/issue) as you go, including what was *rejected* and why. That record is the raw material for the meta case study, and it is what makes the site read as judgment rather than automation.

## Content sources

Copy, case studies, and biographical facts are authored in the sibling `job-search` project and **copied into this repo**, which then becomes canonical (per `job-search/portfolio/site_copy.md`). Ground truth lives in `job-search/cv/work_history.md` and the `*_source_of_truth.md` files; those beat any case-study draft on disagreement.

## Agent skills

### Issue tracker

Issues and PRDs live as **GitHub issues** in `lolesch/lolesch.github.io` (via the `gh` CLI); external PRs are **not** a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles map 1:1 to label strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

**Single-context** layout: one `CONTEXT.md` (glossary) + `docs/adr/` (decisions) at the repo root, created lazily by `/domain-modeling`. See `docs/agents/domain.md`.
