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

## 2026-07-30 — Walking skeleton built, and what the review caught

Tasks 1 to 3 of `docs/plans/2026-07-30-walking-skeleton.md` landed: Next 16 static export, the three-layer DTCG token pipeline, the approved hero, and a working theme toggle. 12 tests green. Then an independent review pass, run by an agent that had not written the plan, found eleven issues. Four are worth keeping, because each one is a case of something looking correct while being wrong.

1. **The repo did not typecheck, and CI would not have noticed.** `next build` succeeded and every test passed, but `tsc --noEmit` failed on three errors. Next typechecks only its own module graph, and all three errors were under `tests/`. A portfolio arguing for engineering discipline cannot ship a repo that does not typecheck, so `typecheck` is now its own CI step. The root cause was subtler than it looked: `@types/node@20`, which is what Next's generator pins, does not declare `fs.globSync` even though the Node 24 runtime has it.

2. **Tailwind was reading the documentation.** Tailwind v4 auto-detects sources from the repo root. It scanned `docs/`, so a utility class that appears in a *plan document* and nowhere in `src/` was generated and shipped. Editing a markdown file changed the production stylesheet. Scoping detection with `source("../")` cut the bundle by 24%. The general lesson: a build tool with automatic behaviour will find inputs you did not intend to give it.

3. **Three tests passed for the wrong reason, found one at a time.** The hero headline assertion matched the `<meta name="description">`. The hero body assertion matched the inlined RSC flight payload, so a test named "readable with JS disabled" would have stayed green over a blank page. The `data-theme` assertion was satisfied by the static attribute alone and would have survived deleting the entire anti-flash script. All three shared one root cause: asserting against the whole document instead of against the thing being claimed. **Rejected the temptation to trust a green test suite** — every guard in the repo has now been watched to fail on purpose before being believed.

4. **A latent accessibility trap, not a live failure.** `brand.accent` measured 3.19:1 on paper, under the 4.5:1 the plan requires, but nothing rendered it yet. It would have failed on the first accent-coloured link in Plan 2 or 3, and the per-task contrast check would not have flagged it because the token pair already existed and looked blessed. Fixed at the Brand layer, which is the architecture doing what it promised: one token changed, no component touched.

Also fixed by measurement rather than opinion: the theme toggle's border was using the decorative-rule token at 1.48:1, against the 3:1 that WCAG 2.2 SC 1.4.11 requires to identify a control. **Rejected** the obvious fix of darkening the shared `border` token, because a decorative hairline and an interactive boundary genuinely want different values. Plan 2 should split those two roles once there is more than one control.

One more, noted while checking something else: an assertion that the anti-flash script must precede the stylesheet would have been **wrong**. Next hoists the stylesheet above it. No flash occurs anyway, because a stylesheet in `<head>` is render-blocking, so paint happens after both. It nearly became a test asserting something false about a mechanism that works for a different reason than assumed.

## 2026-07-30 — First live deploy

`https://lolesch.github.io/` serves the real site. Task 4 of the walking-skeleton plan is done: GitHub Actions workflow, Pages `build_type` switched from `legacy` to `workflow`, `feat/walking-skeleton` fast-forwarded onto `main`. Build and deploy jobs green in 41 seconds. Light and dark both confirmed against the live URL, not against a local build.

**The Pages switch was the only irreversible step and it was cheap.** The legacy builder had been happily building for a month and serving a 404, because it publishes the repo root and the repo root had no `index.html`. Switching to `workflow` before the first push, rather than after as the plan sequenced it, avoided one guaranteed-red run.

**Favicon: installed as `src/app/icon.png`, not `app/favicon.ico`.** The supplied file is a 32x32 PNG carrying an `.ico` name. Next's `favicon.ico` convention would have emitted `type="image/x-icon"` for PNG bytes. Browsers sniff and it would have worked, which is exactly why it was worth not doing: a site arguing for engineering care should not ship a content type it knows is wrong. The `icon.png` convention emits `type="image/png" sizes="32x32"`, verified on the live URL where Pages also serves it as `image/png`.

- **Rejected: asserting that a `<link rel="icon">` exists.** That test stays green over a 404, which is the only way a favicon actually fails. The test now reads the `href` out of `<head>`, strips Next's cache-busting query, and checks the file is on disk in `out/`.
- **Accepted, not fixed: `/favicon.ico` returns 404.** Modern browsers use the `<link>`. Some link-preview bots request the root path directly, so a shared URL may unfurl without an icon. Costs a duplicate 2.4 KB to fix; deferred until it is observed rather than imagined.
- **Fonts (Source Serif 4 + Inter) kept, on Leonid's call.** This resolves half the flag at the end of Task 3. The amber accent is still an unapproved default, and it renders nowhere yet.

**Two things where verification disagreed with expectation, both in the checking rather than in the build.**

1. A `curl | grep` for `_next/static/css/` returned nothing, which reads exactly like an unstyled deploy with `.nojekyll` missing. The site was fine. Next 16 emits stylesheets under `_next/static/chunks/`. The grep pattern was the stale thing, copied from an older Next layout. A verification step that is wrong in the pessimistic direction is the good kind of wrong, but it is still worth knowing that the check itself needs checking.

2. Grepping production CSS for `[data-theme="dark"]` returned zero matches while the dark values were plainly present. The minifier drops the quotes: `[data-theme=dark]`. Still a correct selector, still matches the DOM attribute. The Seam 1 test asserts the quoted form against the *generated* token file, which is the artifact it guards, so it is not wrong. But the generated bytes and the shipped bytes are not the same bytes, and only the second kind is what a visitor gets.

**Known and unaddressed:** the deploy logs a Node 20 deprecation annotation for `checkout@v4`, `setup-node@v4`, `configure-pages@v5`, and `upload-artifact@v4`. The runner force-upgrades them to Node 24 today. Bumping the two actions pinned directly here would not clear it, because `upload-artifact@v4` arrives transitively through `upload-pages-artifact@v3`. Left alone rather than half-fixed.

## 2026-07-30 — The work grid: a scope reversal, and a review across the repo split

The live site was a hero and nothing else. Deciding what to put under it reversed a locked decision, and a review from the `job-search` side caught the reversal's real cost before any of it was built.

**The reversal: v1 gets a work grid.** The 2026-06-24 rejection of a `/work` listing reasoned that "a list of one item is just a link," which was correct while v1 was Rollhaus-only. It is no longer true. `site_copy.md` already carries **18 tiles, written to the CONTEXT.md tile schema and tone-checked on 2026-07-28**, so the grid is an assembly job rather than a writing job and the premise the rejection rested on is gone. Reversing it costs one page of layout and no new copy.

Worth separating from that: **the grid is not a new route.** It goes on Home, which is what the locked IA already said ("hero, then the work immediately"). Only the listing *page* was rejected, and nothing here revives it.

**Decisions, with what lost:**

- **Start with four tiles, schema shaped for all eighteen.** Rollhaus, FerMentor, How to God, GlyphsHero. Same tracer-bullet move as the walking skeleton: prove the component and the layout against real content, then widen by adding data. `tier` rides on the record from the start so the featured/bridge/archive split costs nothing later.
- **Every tile links to `/work/<slug>/`.** **Rejected: non-linking tiles**, which was the recommendation here on the grounds that the tile schema is already complete content and that stub pages contradict the calm anti-brand. Leonid overruled it, and the objection dissolves under a rule already in `CONTEXT.md`: the case-study template is a flexible superset whose hard rule is that a section exists only if it has substance. A page that renders what is verified and then stops is a lean instance, not a stub. **Also rejected: external links only**, which is uneven across tiles and sends a reviewer off the site seconds after arriving.
- **The architecture diagram is ported to a component, not iframed.** `rollhaus_architecture.html` turns out to be pure HTML and CSS, no JavaScript and no external assets, which makes the port cheap. **Rejected the iframe** for a reason that only shows up on inspection: the file carries its own `:root` token block, so embedding it would ship a second, conflicting token system inside a site whose entire argument is that it has one, and it would sit theme-blind directly below the theme toggle. Ported, it follows the toggle and the figure stops being an attachment to the argument and becomes an instance of it.
- **`Section` is a discriminated union, not implicit prose.** `prose | figure | embed`, where `embed` names a figure through a registry so content data never contains markup. The deferred Rollhaus visuals land in the same slot as `figure` with no model change.

**What the cross-repo review caught, and it was right four times out of five.**

1. **Porting Rollhaus now would canonicalize a known inaccuracy.** `tasks.md` sequences the top-up before the case-study route is built: the draft still names three design principles where the 2026-07-29 top-up found four, and it lacks the role split and the instructor feedback. Since the repo becomes canonical on copy, porting first would launder a stale draft into the source of truth. Folding happens first.
2. **The content model had no slot for the strongest evidence.** Caught before it was written down, which is the cheapest possible moment. The diagram is recorded as load-bearing Track C evidence, and a text-only `Section[]` would have quietly shipped the hero case study without it.
3. **A guard was about to imply coverage it does not have.** The placeholder test catches `[NEEDS INPUT]` reaching the export. It says nothing about tone, and copy newly authored on this side still owes a `tone_of_voice.md` pass. Stated in the spec rather than left to be assumed.
4. **The canonical move needs superseded-pointers**, written as part of the port and not after, or future sessions edit dead copy in `job-search`.

**The fifth was stale, and so was the state it came from.** The review flagged the hero line as unresolved and blocking. It was adjudicated and shipped earlier the same day, and is live. The flag traces to `tasks.md`, which still carries it open at line 25, alongside line 24 asserting that Pages was never enabled. Both closed today. Two agents working from a shared task file drifted within hours of each other, in a project whose most useful log entry to date is about exactly this failure mode. The fix is not more process, it is that a task file which is read by two sides has to be written back to by both.

One smaller instance of the same thing, found while reading: **FerMentor's tile carries a note saying it must stay a stub** because its material came from three lines in `spiced_projects.md`. That note is stale too. `fermentor_source_of_truth.md` was gathered the same day and never folded back, and it holds the shipped problem statement, a full fermentation-stage domain model, and the `SHOW ME` interaction. The tile is an authoring task, not a blocked one.
