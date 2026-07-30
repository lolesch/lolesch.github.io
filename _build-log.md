# Build log

Raw material for the meta case study. Append as decisions land, newest last. Record what was **rejected** and why, not only what was chosen: the rejections are what make the record read as judgment rather than as automation.

Format per entry: date, the decision, and the reasoning that survived. Keep it factual. This is notes, not prose.

---

## 2026-06-24 — Architecture locked

A strategy grilling session produced `CONTEXT.md`, three ADRs, and the v1 PRD (issue #1). Full decisions in those files. The rejections worth keeping:

- **Figma as source of truth: rejected.** Figma Dev Mode "make code" produces throwaway scaffolding, not a maintainable token architecture, and it undercuts the whole Track C claim that Leonid architects the system. Code owns the tokens; Figma receives them. ADR-0002.
- **Bidirectional token sync: rejected.** Two sources of truth guarantee drift. A portfolio whose thesis is "I build maintainable systems" cannot itself have an ambiguous source of truth.
- **CSS Modules without Tailwind: rejected for v1.** More visibly hand-built and maximally portable, but it means *more* manual CSS, which conflicts with a stated constraint (Leonid is new to web frontend and wants to minimize hand-written CSS). Recoverable later per component, because the tokens are CSS variables either way. ADR-0003.
- **Tailwind v3 with a JS config bridge: rejected.** Couples tokens to Tailwind's config format and weakens framework-replaceability. v4 `@theme` reading generated CSS variables keeps the token system intact if Tailwind is removed.
- **A fourth Component token layer: rejected as premature.** Three layers (Primitive to Brand to Semantic) for a solo portfolio; components consume Semantic directly. Additive later without breaking anything.
- **Vercel from day one: rejected for v1.** It removes every static-export constraint and is free, but GitHub Pages needs no extra service and the v1 content is fully static anyway. Revisit when a real need for SSR appears. ADR-0001.
- **A `/work` listing page in v1: rejected.** A list of one item is just a link. URL kept as `/work/rollhaus` so the listing slots in at v2 without breaking the case study link.
- **An interstitial positioning block on Home: rejected.** Hero, then the work immediately.

## 2026-07-29 — Reconciliation: the site was planned twice

The site was specified twice, a month apart, in two different projects, and the two specs contradicted each other. Neither author was wrong; the two efforts never saw each other. This is the single most useful thing in the log, because the failure mode and the fix are both concrete.

**What happened.** June 2026: this repo got ADRs and a PRD (Next.js, tokens authored upfront in DTCG, Rollhaus-only v1), then stalled at three commits. July 2026: the sibling `job-search` project wrote a fresh site spec with no knowledge of the repo (vanilla HTML with no framework, tokens extracted later, three case studies at launch, a router and a work grid).

**Resolution: split authority by domain rather than by document.** Engineering (stack, tokens, hosting, architecture, testing) is owned by this repo. Content (copy, case studies, tone, what is true about Leonid) is owned by `job-search` and copied in here. v1 scope is the repo's PRD.

**Reversals, with the reasoning that decided them:**

- **Vanilla HTML with no framework: rejected.** Two independent reasons. It maximizes hand-written CSS, against an explicit constraint that no `job-search` document had recorded. And its stated rationale, that content must remain readable with JavaScript disabled, is already satisfied by static export, which pre-renders real HTML. The rationale did not survive contact with the facts.
- **Extracting tokens after the first two pages: withdrawn.** Chosen once without the repo in view. Style Dictionary also makes no sense in a vanilla build, so this fell out of the stack decision anyway.
- **Three case studies at launch: rejected as not achievable.** Fermentor is unwritten and the meta case study cannot be written until the build exists. Rollhaus-only also fits the ship-to-learn direction: a live narrow site beats a perfect unshipped one.
- **Router and work grid in v1: deferred to v2.** With one case study there is nothing to filter and nothing to grid. The tile schema and the router presets are recorded as the v2 standard in `CONTEXT.md` so they are not lost.
- **Figma's role: no actual conflict.** Both documents already agreed that Figma is downstream asset production, never a source.

**Accepted risk.** A Rollhaus-only v1 makes everything except one course project invisible: no game work, no Unity career, no metalwork. The About page carries the arc in prose and the CV carries the rest. Thin for Track A, acceptable for Track B, accepted because Track C is the highest-weighted track and Rollhaus is its strongest artifact. Revisit at v2 when the work grid arrives.

## 2026-07-30 — Hero line resolved

Two hero lines had been separately approved a month apart and were in conflict.

- The PRD (2026-06-24) locked the claim *"I build systems that designers can understand and engineers can build."*
- `site_copy.md` (2026-07-28) marked SELECTED *"Developer first, designer second."* plus two substantiating sentences, and flagged its own read-risk: a fast scanner may read it as a ranking rather than as a chronology, which is a poor first impression for a Track B reviewer.

**Decision: keep the PRD claim as the headline and the `site_copy` body underneath it.** The two pieces were never actually competing. One is a claim about capability, the other is a chronology explaining how the capability was acquired. The headline answers "what kind of candidate is this" inside the 30-second scan the PRD specifies, the body substantiates it in Leonid's own voice, and the flagged "designer second" ranking risk disappears because that phrasing never appears.

- **Rejected: "Developer first, designer second." as the headline.** Punchiest of the options and closest to the tone North Star's "honest admission, not enthusiasm performance," but the ranking misread is self-inflicted damage with a whole audience track.
- **Rejected: "I was a developer before I was a designer."** Removes the ambiguity, but it states a biography rather than a claim. A 30-second scanner would learn that Leonid changed careers and not what he can do.
- **Rejected: the headline alone with no body.** Tightest against the anti-brand constraint, but it discards tone-checked copy that does real work.

## 2026-07-30 — GitHub Pages was already on

The handoff recorded Pages as never enabled, which was the accepted explanation for `lolesch.github.io` returning 404. It is wrong. The API shows Pages enabled with three successful builds on 2026-06-24, `build_type: legacy`, serving branch `main` at path `/`. The 404 has a duller cause: there is no `index.html` at the repo root, so the legacy builder has nothing to serve.

This changes the first task rather than removing it. There is nothing to "turn on." What is needed is switching `build_type` from `legacy` to `workflow` and adding a GitHub Actions deploy, which is only meaningful once a Next.js static export exists. So it folds into the first vertical slice instead of preceding it.

Worth noting as a process point: a blocker had been sitting in a handoff for a day as a fact, and it took one API call to find it was not one.
