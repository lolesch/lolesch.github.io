# lolesch.github.io — Portfolio & Design-System Case Study

Personal portfolio website that doubles as a design-engineering case study: a token-driven design system, code-as-source-of-truth workflow, and a set of UX/UI + frontend case studies. Owner: Leonid Schreiber (GitHub `lolesch`).

Status: greenfield. Currently in **Phase 1 — Portfolio Strategy** (positioning + audiences), being worked through via `/grill-with-docs`.

## Agent skills

### Issue tracker

Issues and PRDs live as **GitHub issues** in `lolesch/lolesch.github.io` (via the `gh` CLI); external PRs are **not** a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles map 1:1 to label strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

**Single-context** layout: one `CONTEXT.md` (glossary) + `docs/adr/` (decisions) at the repo root, created lazily by `/domain-modeling`. See `docs/agents/domain.md`.
