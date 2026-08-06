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

## 2026-07-30 — Building the work grid: what the measurements decided

Tasks 1 to 5 of `docs/plans/2026-07-30-work-grid.md` landed. Home has a work grid, three `/work/<slug>/` routes exist, the token set grew a type ramp, a radius scale and an interactive-boundary colour, and five guards went in. 29 unit tests and 28 export tests green, typecheck clean.

Almost every decision below was settled by a number rather than by taste, which is the thing worth recording.

**Tiles are bordered, not filled, and a measurement decided it.** The intended design was a filled card on `surface`. Measuring first found `muted` on `surface` at **4.40:1 in light**, under AA, and metadata is exactly what a tile's `surface` would carry. Rather than darken `muted` for one component, the tile lost its fill. **Rejected: a filled card**, for a measured reason instead of a stylistic one. The unused pair is now recorded in a comment in `tests/unit/contrast.test.ts` alongside `border-interactive` on `surface` at 3.08:1 in dark, so whoever renders something on `surface` next inherits the finding rather than rediscovering it.

**The contrast guard became a test with a pair table, not a devtools ritual.** The last entry recorded `brand.accent` sitting at 3.19:1 for a whole plan because "the token pair already existed and looked blessed". A per-task manual check does not catch that, and a check nobody can fail is not a check. `tests/unit/contrast.test.ts` parses the generated CSS, layers dark over light the way the cascade does, resolves the `var()` chain through all three layers, and asserts an explicit table of the pairs the site actually renders. Pairs nothing renders are deliberately absent: an unrendered pair passing tells you nothing.

The measured numbers also corrected the spec, which had estimated them. `border-interactive` is **4.83:1 light and 3.67:1 dark**, against the guessed 4.6 and 3.7. Both clear the 3:1 that SC 1.4.11 requires to identify a control, from a single Primitive in both themes.

**`border-border-interactive` is an ugly utility name, accepted rather than aliased.** The Tailwind adapter maps `--color-*` one to one onto the token name, so a semantic token called `border-interactive` produces that. Renaming it in the adapter would have given one concept a third name, in the layer whose whole job is to not do that. Two specs drifting apart is how this project's worst logged failure started, and it started smaller than this.

**The hero steps to 2rem below `sm`, not 2.25rem.** Moving the hero onto `text.display` was the one change touching live, asserted markup. `text-title sm:text-display` keeps desktop byte-identical at 3rem and steps mobile from 2.25rem to 2rem. **Rejected: inventing a Primitive step to serve one breakpoint**, which is a ramp bending to a layout rather than a layout using a ramp.

**`embed` and the figure registry were held back to Task 5**, on the walking skeleton's own precedent about scaffolding without a consumer. A registry whose only entry does not exist yet is that. The extension point is now demonstrated rather than asserted, and the exhaustive `never` check is what forced the renderer to be extended when the arm landed. It fired exactly as planned.

**The Rollhaus page was going to ship near-empty, and did not.** This was the plan's own worst outcome, logged as an open question and then put to Leonid rather than decided quietly. Precondition 1 gates the Rollhaus page because `spiced_rollhaus.md` names three design principles where the 2026-07-29 top-up found four, and lacks the role split and the instructor feedback. Rendered, the consequence was worse than it read on paper: the site's hero case study was a title, a metadata line and a back link.

The narrow reading of that precondition ships the architecture figure now, because the diagram was built from the live Figma file on 2026-06-19, separately from the case-study draft, and asserts none of the three things the top-up corrects. It is not what the gate is protecting. Leonid took it. The written case study still waits.

Worth being honest about why this was asked rather than assumed: **reinterpreting an approved instruction to suit a sequencing preference is exactly the drift this log keeps recording.** The reading is defensible, and it was still not mine to take alone.

**Three guards that would have passed for the wrong reason, found by trying to break them.**

1. The no-repeat rule fired on `/work/glyphshero/` because `generateMetadata` puts the Problem line in `<meta name="description">`. The page was right and the assertion was wrong: someone arriving from a search result or a link unfurl has not seen the tile. Scoping it to `<body>` is correct, but scoping an assertion to make it pass is also how a guard gets hollowed out, so the rescoped version was **proved to still bite** by hardcoding a tile line into the page component, where the data-level guard cannot see it. It fired.
2. `Record<FigureId, ComponentType>` proves the registry has an entry for every id. It cannot prove the component rendered. `tests/export/figures.test.ts` is that half, against the artifact.
3. Figure copy is authored prose that ships on a page, but it lives outside the `Project` records, so every guard in `content.test.ts` walked straight past it. `tests/unit/figures.test.ts` reaches it. Watched failing on an inserted em-dash before being believed.

**One copy decision inside the port.** The source figure flagged the ad hoc variable naming twice, once as an aside next to the variables and once in the footnote. Stated twice in one diagram it reads as apologising for the work. It is stated once now, in the footnote, where it is scoped and its consequence is given. Nothing was softened: the footnote is the stronger of the two.

**Also fixed in passing:** the theme toggle had been borrowing `muted`, a text colour, for its border, with a comment saying `border` was too low contrast. That was a stopgap from the walking skeleton wearing a justification. It is on `border-interactive` now. Dark drops from 11.99:1 to 3.67:1, which is the point: 11.99 is a loud hairline on a site whose anti-brand constraint is "never cluttered".

## 2026-07-30 — The Rollhaus page, and the gate that half-cleared

The top-up landed in `spiced_rollhaus.md`, so Task 6 opened and the site's hero case study went from a title and a back link to a full page: Constraints, Context, One system not a screen per option, the architecture figure, What testing changed, Outcome, Learnings. 29 unit tests and 28 export tests green, typecheck clean.

**The gate did not clear the way it was written, and that was worth stopping over.** Task 6's check was literal: "confirm it names four design principles, not three." The topped-up file names three. Everything else the gate protected had landed, the role split in Leonid's own words and the instructor feedback, and the fourth principle had been *deliberately* held back with an open question attached: the FigJam carries Guidance Over Selling, the Week 3 slides do not. So the precondition's substance was met and its stated test was not.

Two readings were available. Treat the check as satisfied because its purpose was, or treat it as failed because its words were. The log already records what happens when an approved instruction gets reinterpreted to suit a sequencing preference, so neither was taken alone. **Leonid confirmed all four were presented**, which resolved it at the source instead of at the gate. The Week 3 deck maps three principles to its three test tasks, which is that deck's scoping rather than the full set. `rollhaus_source_of_truth.md`, `spiced_rollhaus.md` and `_project/tasks.md` are all marked resolved, so the next reader inherits the answer rather than the question.

**A new section kind, because the callout is scanned rather than read.** CONTEXT.md has listed a Constraints callout as pending polish on the case-study template since the strategy phase. It could have been a prose paragraph. It is `kind: 'constraints'` with label/value pairs instead, because the reader uses it to answer "what was this" before the writing gets a chance to, and prose cannot be scanned at that speed. **Rejected: putting the same facts in the metadata line**, which already carries year, context and role and would have become a run-on.

The callout is **bordered, not filled**, for the reason the tile is: `muted` on `surface` measures 4.40:1 in light, under AA, and every value in the callout sits under a muted label. On `bg` both pairs are already in the contrast table, so the component needed no new measurement and no new token.

**The guard extension is the part that mattered.** A new section kind ships copy that `content.test.ts` could not see: `bodies()` handled `prose` and fell through to `caption` for everything else, so constraints labels and values would have walked past the em-dash rule, the no-repeat rule and the padding rule. This is the identical failure logged one entry above for figure copy, arriving from a different direction, and it is the argument for watching a guard fail rather than trusting it. `bodies()` now switches on `kind`, `pads no section` reaches the rows, and the extension was **proved to bite** by putting an em-dash in a constraints value, where only the new code path can see it. It fired.

**One honesty decision inside the copy.** The Learnings section originally named the ad hoc variable naming (`QuadSelected`, `Spotlight`, `TotalPrice`) as the thing to do differently next time. The figure's footnote already states it, and the figure sits on the same page. Twice on one page is tone tell #10, the apology loop, and the footnote is the stronger placement because it is scoped and gives the consequence. Learnings keeps the lesson that is genuinely its own, that mid-build change cost them working states until they learned where to put the seams. **Nothing was softened**: the limitation still ships, once, and a test holds it there.

**Framing followed the outside note, not the draft.** Peers and the instructor independently said the generic atomic-design framing buried the distinctive decision, which is the slot system. The prose hands the mechanism to the figure and spends its one paragraph on slots. The visual-fidelity tradeoff and the absence of live users are each stated once, in the Outcome.

Still pending on this page, and not hidden: the visual overhaul. The editor before/after that carries the research-to-decision thread, the exploded product hero, the wireframe-to-hi-fi progression and the prototype embed are all still unbuilt. The page currently argues the system well and shows the craft only through the architecture figure, which is the honest state of it for a Track C reader and thin for a Track B one.

## 2026-07-30 — Mining the decks for visuals, and a premise that did not survive

The visual overhaul opened with four named targets: the editor before/after, an exploded product hero, the wireframe-to-hi-fi progression and a prototype embed. One figure shipped. The interesting part is why the other three did not, and what checking cost.

**The assets were not where the notes said they were.** `public/` held no images at all, and the only two on disk anywhere were `SideBarProcess.png` and `WireFrameProcess.png`, both 1920x1080 raster exports of presentation slides, complete with banner, logo and page number. `portfolio_site_spec.md` §12 files all four targets under Phase 3, "Figma work, exported in", and `HANDOFF_portfolio_phase0.md` still carries the design file as unexported. On that reading the overhaul was blocked outright.

It was not, and the thing that changed the answer was checking rather than concluding. The decks in `case_studies/assets/` are vector PDFs at 1920x1080, and the two PNGs turned out to be raster exports of slides that exist there as source. Rendering from the deck gives arbitrary resolution and clean crops. Better still, the artifact that mattered is an embedded image that can be lifted byte for byte at native resolution, with no re-encode. **Rejected: cropping the raster PNGs**, which was the obvious move and would have shipped a worse asset than the source already contained.

**The 202 MB file is the FigJam, not the design file.** `Project3_Group2 (Copy).pdf` is one flattened 36564x33184pt canvas: moodboard, flows, sketches, the prototype wiring map, the editor v1 to v5 evolution, and the instructor Glows and Grows. Useful later. It is not the design file, which is `Project3_Rollhaus` and has still never been exported. That is why no final screen exists at full fidelity.

**A premise failed on inspection, one step before it shipped.** The plan was to open the page with the hi-fi editor screen from the Week 3 deck. Rendered large enough to read, that screen is the panel with Shoe and Pattern merged into one list and type chips on the rail: **the pre-rework editor, the version that produced the 68% misclick rate.** As the case study's opening image it would have headlined the page with the design the prose two sections later says was replaced. Nothing in the file names says which state a screen is in, and at thumbnail size the two are hard to tell apart. This is the same class of error the log keeps recording, caught here only because the before/after slide was rendered at full size to check.

The post-rework screen does exist, as the High Fidelity endpoint on the Wireframes slide of the final deck, native 1440x1024, with the category rail and the full site nav. It ships with two defects baked into the capture: the panel heading reads "Patten", and the summary card is clipped behind the panel. Neither is a limitation of the design. **Leonid took it as a placeholder** pending a clean export, and it is marked open in three places rather than one: a comment on the content record, the provenance entry in `scripts/extract-figures.py`, and here.

**Deferred, with the material already extracted:** the editor before/after, the wireframe staircase and the Base Card slot figure. All three are recoverable now and none were rejected on merit. One figure against seven sections is the Flow Over Flash call, and the page can take more when there is a reason to add it.

**The guard gap arrived a third time, and got a structural fix instead of a third patch.** `bodies()` in `content.test.ts` ended in a `default` arm returning `section.caption`. That arm is what let `constraints` ship label and value pairs past the copy rules, and it does the same for a figure's `alt`. Alt text is copy: it reaches screen readers and it sits in the exported HTML. No figure section had ever shipped, so nothing had exercised it.

Patching it once more would have left the mechanism intact. Every kind is now named explicitly and the switch closes on `never`, so **adding an arm to `Section` fails typecheck in the guard until its copy is accounted for.** The gap was proved first by shipping an em-dash inside `alt` and watching all 14 tests pass, then proved closed by watching the same copy fail.

**Two more guards, both watched failing before being believed.** That a figure points at a file which actually reached the export, proved by moving the asset aside. And that the lead figure is not lazy-loaded, proved by dropping `priority` and rebuilding.

**The lead figure is eager, and that decision sits in the renderer.** `next/image` lazy-loads by default, which is wrong for the first image on a page: it is the LCP candidate, so deferring it delays the paint it defines. **Rejected: a `priority` field on the content record.** Which image paints first is a property of the rendered page, not of the copy, and the content model should not learn about the fold.

29 unit tests, 33 export tests, typecheck clean. Checked in both themes at desktop. The 390px pass was done against the exported markup rather than in a browser, because the browser tooling available this session would not resize: the image carries `h-auto w-full`, so CSS overrides the intrinsic width attribute and it cannot overflow its container.

**Still open, and now tracked as an issue rather than only as prose:** a clean editor-screen export from the design file, the exploded product hero, which exists in no source and has to be authored, and a prototype URL. The final deck's prototype slide is a black video frame, so the demo did not survive PDF export. All three need the same Figma session.

## 2026-07-31 — The About page, and the guard gap closed as a class

The site had no contact information anywhere. A reviewer convinced by the Rollhaus page had no way to act on it, and a Rollhaus-only v1 made the whole Unity and games half of the arc invisible. `/about/` closes both.

**The guard gap got closed as a class rather than patched a fourth time.** Three previous instances, three patches at the path where copy escaped: figure captions, then constraints label and value pairs, then a figure's `alt`. Every rule in `content.test.ts` iterates `projects`, so About would have been the fourth. `tests/unit/copy.test.ts` globs `src/content/**` through `import.meta.glob`, walks every exported value recursively and applies the em-dash and placeholder rules to whatever it reaches, naming the offending field by path. **`tests/unit/figures.test.ts` was deleted rather than kept beside it**, because a hand-registered `FIGURE_COPY` array next to an automatic walk is the same registration failure in miniature. Coverage went up while a file went away: the rule now reaches four modules instead of one.

Proved before it was believed, twice. First with `src/content/spike-copy.ts`, referenced by nothing and registered nowhere, which came back as two named violations. Then again through `about.ts` once it existed. Before this, no guard could see a single string in that file.

**`npm test` was green while `npm run typecheck` was not.** `import.meta.glob` is a Vite feature and vitest transpiles without typechecking, so the guard that had just been proved working would not have compiled. This is the Global Constraint that says typechecking is its own step, paying for itself on the first task that could exercise it. Fixed with a narrow reference to Vite's `importMeta` types. **Rejected: `vite/client`**, which typechecks clean but also pulls in Vite's own module declarations for `*.svg` and friends alongside Next's, where `skipLibCheck` would hide the clash instead of reporting it.

**`border-media` is a third border role pointing at the same value as the second.** **Rejected: `border` for the portrait ring**, correct role and invisible at 1.48:1, which the browser pass confirmed matters: the photo's background is near-white and the page is white, so the ring is the only thing separating them in light theme. **Rejected: `border-interactive`**, visible in both themes and already there, on Leonid's grounds that a picture is not a control. Borrowing a token for the wrong role is the mistake the log already records once, when the theme toggle borrowed `muted`. Two roles that happen to agree today is what the Semantic layer is for, and they can diverge later without touching a component.

**The contrast table gained a row that is design intent, not WCAG.** SC 1.4.11 governs controls and meaningful graphics, and a decorative frame around a photograph is neither. Held at 3:1 anyway so a Brand change cannot quietly erase the ring. Recording the distinction keeps the table from implying obligations that do not exist.

**A clause was cut for claiming something that had not shipped.** "Where I'm going" ended on "This site was built that way, and there's a case study about it." The meta case study is v2 and does not exist, so under guardrail 1 it was not a claim yet. Now "This site is being built that way", which is also more accurate about a site that is live and unfinished. The tone check had praised the old clause for landing flat rather than reaching; the replacement is equally flat, so nothing was lost. It goes back when the case study ships.

**The metalwork sentence, decided 2026-07-29 and unwritten since.** Three candidates went to Leonid, all keeping the shelf as the subject so the following "It is still on my wall" still resolves, and none drawing the parallel to design work. He chose *"That was the first thing I built where the parts had to work in more than one arrangement."* The known trap was tone tell #4: the cut version, "same instinct as the shelf, different material", failed because it drew the parallel for the reader. **A second trap turned up while drafting and killed two candidates:** any version claiming he already framed before building contradicts "Learning to do the framing first is most of what I went to SPICED for" four paragraphs later. Fabrication planning and problem framing are different things, but a reader feels the friction rather than parsing the distinction.

**The CV link ships nullable rather than blocking the route.** **Rejected: holding the page until the Track C re-export exists.** `about.cv` is `null`, its two export assertions are skipped rather than absent, and they come back on their own when the record is filled. A skipped case is visible in the run; a case that does not exist yet has to be remembered. The page still cannot ship over a 404, because the assertion follows the href to disk. Same reasoning as the favicon guard.

**`ProjectSections` became `ContentSections`.** It was never project-specific: it takes a `Section[]` and renders it. Renamed at the moment a second consumer appeared, which is two call sites, rather than later, which is a decision about whether it is worth doing.

**A test helper that was wrong in a way that made guards weaker.** Asserting that a content string reached the page cannot match, because React escapes an apostrophe as an entity. The repo's existing answer, in the hero assertion, was to match an apostrophe-free fragment with a comment apologising for it. A fragment still passes when the rest of the sentence is gone, which is a weaker guard than it looks. `text()` in `tests/export/rendered.ts` decodes the five characters React escapes, in one pass so a decoded ampersand cannot be re-decoded, and assertions now compare whole sentences against the copy as authored. The hero assertion still uses the old workaround and could move onto it.

**The portrait's 200px is an arbitrary value, not a token.** A size that serves one image would be a fourth layer under the three ADR-0003 names. Same reasoning that rejected inventing a Primitive font step to serve one breakpoint. `aspect-square` plus `object-cover` is load-bearing rather than stylistic: the source is 505x518, so `rounded-full` on the raw aspect gives an ellipse. The crop also removes the photo's dark vignette corners, which as a rectangle would have read as a bright square with dirty corners on the dark theme.

**The nav went last, deliberately.** A nav link to a route that does not exist is worse than no nav, so `/about/` shipped first and the header gained links after. `aria-current="page"` is set on About only: Work is a fragment into Home, which has no unambiguous current state, and claiming one would be worse than claiming none. The one thing that could have failed for a reason that was not a mistake, `usePathname` returning null during static prerender, did not: the attribute is in the exported markup, so the fallback of dropping it was never needed. The nav guard globs the whole export rather than checking Home, and deleting one link failed **8 pages at once**, which is the evidence that the layout is a single point of failure and that the guard covers all of it.

32 unit tests, 52 export tests plus 2 skipped, typecheck clean. Checked in a browser this session rather than against markup: both themes at 1280, and 320px where the header wraps to two lines and the portrait and intro stack, with a 305px scroll width against a 320px viewport.

**Still open.** The Track C CV re-export, which is Task 6 of the plan and gated on Leonid; the domain decision, which should be taken first because the re-export is what bakes the URL into every sent CV. And one polish item found during the tone pass and deliberately not fixed: the About copy writes "color system" in US spelling while `projects.ts` writes "optimisation" in UK spelling. Both are approved, tone-checked copy, so the split is Leonid's call rather than a session's.

## 2026-07-31 — The grid leads with pictures, and the pages pick up what it dropped

Four reference portfolios came in for a feedback round. What they share is not a style: every one of them shows the work before it describes it, and three of the four carry no body copy above the fold at all. The site had the opposite shape. Three tiles of roughly 150 words each, side by side, made the most scannable surface on the site its densest one, which is the anti-brand constraint tripped by the component built to serve it.

**The tile change could not be a swap.** `work/[slug]/page.tsx` deliberately omitted the three schema lines, with a comment saying the visitor had just clicked them. Putting a summary on the card without moving those lines to the page would have deleted them from the site entirely, reintroducing the exact failure CONTEXT.md records the Tile Schema to prevent. So the two changes are one change: the card gains a thumbnail and a purpose-written hook, the page opens with Problem / What I did / What changed.

**Both guards inverted rather than being deleted.** `content.test.ts` still forbids a section restating a schema line verbatim; the export guard that asserted the page does *not* carry those lines now asserts that it does. A guard whose rule changes is evidence that the rule was load-bearing, and deleting it would have left the new rule unguarded on the grounds that the old one was inconvenient. The export guard also moved from `body()` to `text()`, because the schema lines carry apostrophes that ship as `&#x27;`.

**Rejected: four tile schemas before the one that shipped.** Truncating a schema line onto the card, showing only Problem, showing a label-free first line, and dropping card prose to title plus lenses. All four are the same mistake in different clothes: they treat the hook as an excerpt of the page. Leonid's fifth option is what shipped, a short description written for the card and for nothing else, which is why `content.test.ts` now asserts the summary is not any of the three lines.

**Rejected: 21st.dev components.** The offer was a community component library. The site's whole argument is that the code is the source of truth and the design system is authored here; importing a community component undercuts that precisely where a systems reader would go looking.

**Rejected: a cut-between video of the Rollhaus mode switch, and a before/after slider.** The loop would claim a smoothness the Learnings section explicitly denies, and a slider makes the reader operate a control to see the evidence. A static two-state comparison carries the propagation claim with neither liability.

**GlyphsHero is a game before it is a workflow.** The record described only the AI experiment, which made the page read as a methodology with a game attached. Leonid: *"glyphs hero is not about AI implementation, it still is a game"*, and *"the AI story is the development of the web page itself"*. The page now opens with the hex grid, the inventory-as-spellbook idea and the three reference games, and the workflow is one section among five. The first summary draft came back as *"way to generative"*; the shipped line starts from his own phrasing, a tactile spell-crafting inventory.

**The chain diagram is a table, because it is tabular data.** Three chains against three axes, and the argument is that adding one item changes exactly one cell. A grid of divs would look identical and tell a screen reader nothing about which value belongs to which axis. The changed cell is bold *and* carries a visually hidden "changed to", because weight alone fails the way colour alone does. `changed` is an index stored in the data rather than derived by diffing the row above: the figure's entire argument should not be a side effect of array order.

**The How to God overclaim, and the propagation gap that caused it.** The record said Leonid designed the gesture recognition system. He did not: *"the gesture system was not my invention, i just made it work for our gestures"*. The correction had already been made once. `cv/cv_track_b_content.md:74` logged it in June as the Thoughtfish accuracy fix, and both CV bullets carry "on an existing recognition plugin". `site_copy.md:158` dropped the qualifier, `projects.ts` inherited it from there, and the portfolio was left as the only surface still making the claim and the only one about to go public. Corrected in both repos, with a comment on the record naming the source so the qualifier cannot be dropped a third time. The section it sits in moved with it, from "Designing for hands that vary" to "Making it feel right": he was hired as a UX designer, so the claim is feel and learnability, not inclusion.

**The press kit was the only acceptable source for the How to God image.** The plan said to stop and ask rather than substitute a store screenshot, because the caption commits to a provenance and an asset from elsewhere makes the caption false. The kit resolved: `PDPScreenshot2.png` of six, downscaled to 1920x1080 and re-encoded, uncropped. It is the two-handed cast with the spell igniting between the fingertips, which is the one shot in the kit that shows the interaction rather than the setting, and it is the same frame the studio uses for the "battle rival gods" pillar on its own fact sheet. **Rejected: the keyart**, which is illustration and says nothing about how the game plays, and **the four screenshots that lead with the island**, which lose their subject at card size.

**The alt text was rewritten against the image rather than the plan.** The plan's placeholder read "A press image from How to God, showing the VR god sim in play", written before anyone had seen the file. Alt text that names the project instead of the picture tells a screen reader nothing the surrounding link has not already said.

**`border-media` on the thumbnail edge, not `border-interactive`.** The image sits inside the card's link but it is not the control. This is the second time the log records that borrowing, which is what the third border role exists to prevent.

38 unit tests, 53 export tests plus 2 skipped, typecheck clean, checked in a browser at both themes.

**Still open, and found by looking at the result rather than the tests.** The schema lines were written as a *substitute* for the page and now sit *on top of* it, so all three pages open by summarising themselves. GlyphsHero is the clearest: "The work moved upstream, into defining a goal precisely enough that it can be delegated" in the opener, and "Most of the work is now upstream of the code: stating a goal precisely enough that someone else, or something else, can execute it" in Outcome, about 600px apart. How to God is the one that breaks a guardrail rather than only reading badly: the limitation about leaving before Early Access is stated in the opener and again in Outcome, and guardrail 5 says state an honest limitation once, where it lands hardest. The verbatim guard passes because the wording differs; the reader does not care. Fixing it is a copy decision and belongs to Leonid, not to the session that caused it.

**Also still open:** the four Rollhaus figures the spec specifies are blocked on Figma captures Leonid is taking himself, the GlyphsHero thumbnail is a square crop of AI-generated key art standing in until the chain diagram can carry the tile, and the Rollhaus thumbnail is still the placeholder editor capture whose panel reads "Patten". Deferred with reasons in the spec: the type scale, self-hosted fonts, and motion.

## 2026-07-31 — The Rollhaus figures, and the placeholder that got retired instead of replaced

The handoff spec located the four remaining assets and recorded their crop boxes without running the extraction. Running it is this round. All six figures now ship, `public/figures/rollhaus-editor.jpg` is deleted, and the Rollhaus page went from two figures across ~2,500 words to five.

**Asset 5 was closed by making it unnecessary.** The plan for the placeholder had always been "capture a clean editor and swap it in". The better move was to retire the figure's job: its caption already claimed the configured skate updates alongside the categories, and a single still can only assert that. The two-state pair shows it. **Rejected: the standalone clean Hi-Fi editor viewport**, at `hifi clip [0.2350, 0.0855, 0.3665, 0.2270]`. It is a genuinely clean capture with no "Patten" typo and no clipped summary card, and it was extracted and looked at before being cut. One page does not need two near-identical editor shots, and the box is recorded in `extract-figures.py` if that judgement ever reverses.

**Four of the six crop boxes in the handoff were wrong, and a dry run would not have shown it.** The option tree box cut the left edge off every line, so the note read "oe model" and "se Type", and stopped one row above the end. The extension strip clipped all three section headings and the entire bottom row of cards. Both side-panel boxes sat outside the frame and included Figma's dashed violet section outline, which would have shipped as decoration. Every box was re-derived off the file itself, using `page.search_for` and `get_drawings` to find text bounds and frame fills, then padded, rather than adjusted by eye. That is why `extract-figures.py` now says the boxes sit on content edges instead of near them: it is a claim about method, and it is checkable.

**A third extraction mode, because the sources stopped being PDFs.** The two editor states were exported from Figma as 2916x2086 PNGs with alpha rather than onto a canvas, so there is no page to clip and no embedded image to lift. `png` takes source pixels instead of page fractions. The alpha is load-bearing: the mockup is a rounded window over transparency, and a naive flatten puts white wedges in four corners that would show against the dark theme. The crop insets 10px into the window, which was measured rather than guessed.

**`comparison` is its own section kind rather than two figures or one composite.** Two `figure`s split across two sections make the reader compare from memory, and the spec's decision 2 is that both states have to be visible at once. One pre-composed image puts two pictures under a single `alt`. The type fixes the pair at exactly two, because the renderer is a two-column grid and there is no reading of "before, after, and a third thing" a caption could carry. Each state carries a `label`, which is the one thing a lone screenshot never needs.

**The lead-figure rule had quietly become wrong.** `sections.tsx` picked the LCP candidate with `findIndex(s => s.kind === 'figure')`, and the export guard repeated that expression independently. `comparison` is now the first image on Rollhaus, so both would have handed the most important page on the site a lazily loaded LCP image while every test stayed green. The guard's copy of the rule is extracted as `leadIndex` with a comment naming the drift, and `figures.test.ts` walks both kinds through one `never`-closed switch instead of a second parallel describe block. Coverage went from one image to six.

**The side-panel caption claims two structures, not a test artefact.** The merged column demonstrably exists in `Editor Molecules`, but nothing in the sources proves it is the exact screen the 18 Maze participants clicked, and a caption placed directly under the 68% paragraph would imply it. Guardrail 1. Leonid took the conservative wording. The open question is recorded next to the crop in `extract-figures.py` rather than only here, so whoever confirms it finds it at the point of use. **Rejected: leaving asset 2 out until confirmed**, which would have lost a figure that carries its claim honestly under a narrower caption.

**Rejected: the debug variable panel**, at `hifi clip [0.4190, 0.2250, 0.5530, 0.2585]`. Four blocks naming the variables driving the cart screen: Shoe Type, Shoe Pattern, Shoe Size, Skate Type, Wheels Color, Wheels Type, the price parts, Side Panel Content and State. It is the strongest evidence on the whole canvas for "built on Figma variables and modes", because it shows the variable layer rather than its output. Extracted, verified, and cut: Leonid took the option tree instead, and two working-note figures on one page is one more than the page can hold. Box recorded.

**Rejected: the lo-fi two-state fallback**, a dark exploration direction carrying a `Pretty Logo` placeholder in the right panel. Only ever the answer if the shipped-fidelity PNGs had not existed. **Rejected, guardrail 4: the exploded inline-skate parts diagram** on the Lo-Fi canvas, which is a stock reference image and neither Leonid's nor Yassine's work. Recorded as a comment in `extract-figures.py` so it is not rediscovered and mistaken for source material.

**A paraphrase that the new figure would have contradicted.** "The panel became a category selector, Shoe Model, Colour, Skate Type and Wheels" was written before anyone had the screen in front of them. The screen reads Shoe Model, Pattern, Skates, Wheels. Corrected to match, because a caption disagreeing with the image two paragraphs below it is exactly what the reader this page is written for will notice first.

**The thumbnail is the viewport, not the boot.** The tile fixes 16:10 and crops with `object-cover`, so framing it in the extraction script is the only way to control it at all. A boot-only crop was rendered at real card size and looked better in isolation, and worse on the card: it reads as a product photo, while the summary beside it claims a configurator. The option panel and the cart button are what carry that. The top edge sits just under the site logo rather than through it, which is what fixes the width.

38 unit tests, 77 export tests plus the same 2 skipped, typecheck clean. Checked in a browser at 1280 rather than against markup: the lazily loaded figures needed forcing to `eager` before a full-page capture showed anything, which is the lazy-loading working.

**Still open.** The side-panel caption question, which needs Leonid to confirm against the Maze build. The two open items from the previous entry are unchanged and still Leonid's: the schema lines summarising the pages they open, and the How to God limitation stated twice.

---

## 2026-07-31 — An outside review of the live site, and the one finding that was not about the site

A review of `https://lolesch.github.io` came in after the Rollhaus figures shipped. Four findings. Three hold, one was stale, and the highest-severity one turned out to be blocked on a decision rather than on any code here.

**The missing CV is the top finding, and it is not a frontend gap.** `contact-links.tsx` has shipped a CV link since the About route landed: new tab, `noopener noreferrer`, an `sr-only` announcement of the target. It renders only when `about.cv` is non-null, and it is null on purpose. Both CV PDFs still point their footer portfolio link at the old Figma prototype, so shipping either one hands a reviewer a document that contradicts the site they are reading. The review's suggested fix, a placeholder pointing at the Track C PDF now, would cause exactly the failure the code comment predicts.

**The real blocker was the domain, and it had already been decided twice.** `portfolio_site_spec.md` §13 settled it on 2026-07-29: github.io now, paid later, free domains rejected on revocation risk. `_project/tasks.md:29` still carried "buy the domain before the first application goes out" as open, contradicting it. Leonid re-confirmed `lolesch.github.io` on 2026-07-31 and the contradiction is closed. The cost is stated rather than hidden: the URL is baked into every sent CV, so buying a domain later means a second re-export. Taken anyway, because the CV link has been blocked on this for two days and shipping beats a cleaner URL. **Rejected: buying a domain first**, which is the tidier answer and delays the site's biggest conversion gap by days for a cosmetic gain.

The export itself is a manual Figma step nobody but Leonid can run, so the site side stays parked at Task 6 of `docs/plans/2026-07-31-about-route.md`, which is written and waiting on the file.

**Three hedges in a row, and one of them was already a guardrail violation.** Rollhaus says there are no live users, GlyphsHero says nothing is validated by use, How to God says it cannot say what survived. Each is true and each was written deliberately. Read back to back by a fast scanner they compound into a pattern, which is the review's actual point and a fair one. Only one was cut, and it was the one that did not need the judgment call: How to God stated its limitation in `whatChanged`, which the detail page renders in the `<dl>` near the top, and then restated it in Outcome further down. Same page, same reader, twice. Guardrail 5 says once, where it lands hardest. The tile line stays because it is what the scanner reads; the Outcome paragraph keeps the chronology that substantiates it and drops the conclusion.

**Rejected: cutting the Rollhaus or GlyphsHero hedge as well.** Rollhaus's is load-bearing, it is what protects the course-project framing, and the review agrees. GlyphsHero's is the only place that page states its scope at all, so removing it trades a tone problem for an honesty problem. Three honest statements reading as a pattern is a real cost, but the answer to it is a project that has touched real users, not quieter language about the ones that have not.

**The hero-line flag was stale, for the second time.** `hero.ts` records the approval and `_build-log.md:40-51` carries the full adjudication with two rejections. `_build-log.md:119` already logs a *previous* review raising this same closed flag and traces it to `_project/tasks.md`. The same file also still claimed Pages was never enabled and the site 404s. Two reviews, weeks apart, both misled by the same file, in a project whose most useful log entry to date is about exactly this. The earlier entry named the fix and nobody performed it: a task file read by two sides has to be written back to by both. It has now been written back, and it opens with a note saying why, so the next agent that closes an item there knows the cost of not recording it.

**Not acted on: the lens filter.** Games/XR, UX/UI and AI Workflow sit tangled on one page and a Track A reader gets diluted signal. True, and already recorded as accepted risk. The Router is v2 and nothing about this review moves it forward.

38 unit tests, typecheck clean.

---

## 2026-07-31 — The CV link, unblocked

Leonid re-exported `CV Track C - UX Engineer` from Figma and Task 6 of `docs/plans/2026-07-31-about-route.md` ran end to end. The baked-in URL is `https://lolesch.github.io`, so the domain decision was **taken, not deferred**, with the known cost accepted: buying a domain later means a second re-export of both tracks. Verified before it was copied and again after it deployed, on the downloaded file rather than the local one: 2 pages, A4 595x842, selectable text on both, five live footer links, portfolio link pointing at the site, and no figma.com anywhere in it. `about.cv` went from `null` to the record, and the two `it.skipIf` guards in `tests/export/about.test.ts` came back on their own, which is what nullable-plus-skip was for.

**The CV guard was watched failing, and the reason it is worth having showed up in the failure.** With the PDF moved aside, `links a file that actually shipped` went red and the sibling case asserting `target="_blank"` and `rel="noopener noreferrer"` stayed green. That is the favicon lesson again: a download link fails invisibly, the markup stays perfect, and only following the href to disk sees it. 38 unit, 79 export with 0 skipped, typecheck clean, and `https://lolesch.github.io/cv/leonid-schreiber-ux-engineer.pdf` returns 200 with `application/pdf` at the exact byte count of the local file.

**One CV, Track C. Rejected: offering both tracks side by side.** It would cover a Track B reviewer directly, and it asks the visitor to classify themselves, which is the job `CONTEXT.md` assigns to the v2 Router. One link matching what the rest of the site argues is the better answer until the Router exists.

This closes the top finding of the 2026-07-31 review. A hiring manager who likes the site can now reach the document that shortlists him, which was the whole of that finding once the frontend half turned out to have shipped days earlier.

---

## 2026-07-31 — /design-system, and the exemption that was not needed

The last route in the locked v1 scope. `docs/superpowers/plans/2026-07-31-design-system-route.md` ran end to end in five tasks. The page reads the generated stylesheet at build time and documents itself out of it: eleven Primitive colours, fourteen Brand tokens, eight Semantic roles, five space steps, seven type steps, three radii, and a contrast table measured on every build. **Every number on it is computed. None is authored.**

**The resolver was extracted, not reimplemented.** `tests/unit/contrast.test.ts` already walked the `var()` chain correctly, so `src/lib/tokens.ts` and `src/lib/contrast.ts` are that code moved, and the guard now imports it. The proof that the move preserved behaviour is that all ten contrast case names and assertions are byte-identical through it. A second implementation would have let the table a reader sees and the table the build enforces disagree about a number, which is precisely the drift PRD story 20 is about.

**No `token-discipline.test.ts` exemption was needed, and that is the design.** Primitive and Brand do not vary by theme, so rendering them from build-time resolved values is the *correct* rendering rather than a workaround, and the values arrive as data rather than as source literals. Semantic renders through the same Tailwind utilities every component uses, so it live-switches through the cascade. Confirmed in a browser in both themes: the eight Semantic swatches move, the eleven Primitive and fourteen Brand swatches hold exactly. **Rejected: exempting the route**, which is the obvious move and is wrong twice over, because it weakens the guard at the one place on the site that brags about it.

**The guard caught this page's own code, twice.** `src/lib/tokens.ts` shipped a JSDoc example reading `#b45309`, and rule 4 bans a colour literal in application code including comments. Fixed by removing the example, not by exempting `src/lib/`. The layer classifier parses a token name into segments for the same reason: a spike showed a full Primitive name fails the scan even inside a comment. That spike also found a narrow hole, recorded rather than exploited: the offence pattern requires a character after the layer prefix, so a bare prefix string plus runtime composition would slip past rules 1 and 2. Not used, and named here so the next person to notice it knows it was seen.

**The spec's hand-counted "13 Brand" was wrong. It is 14.** Nothing shipped broken, because the restraint line the spec fixed carries no numbers. But a hand-maintained count was already wrong two days after being written, on a page whose entire argument is that documentation cannot drift from what ships. That is the concrete reason every count is computed from `readTokens()`.

**Two of the plan's own predictions about its guards were wrong, and both corrections are worth keeping.**

Deleting `--ds-color-surface` from the dark token file was supposed to redden the new theme-varying guard. It did not: the guard compares `readTokens()` against an independent parse of the same file, so removing the token removes it from both sides. Only the older identical-keys assertion in `tokens.test.ts` caught it, which is the right division of labour. The new guard's red state comes from a broken resolver, and it was watched red that way instead, with the dark layer dropped.

The load-bearing export assertion was supposed to take three cases down with it. It takes one. Setting the data step to `[]` and rebuilding produced a page that renders every heading, every paragraph, the full contrast table with real measured numbers, and **all eight Semantic swatches in their correct colours**, because those are fed from `src/content/` rather than from `readTokens()`. It was opened in a browser and screenshotted: only three `(0)` counts betray it. So `renders a resolved Primitive value` is not one of three guards on the data step. It is the only one, and the page it protects against is convincing enough to ship.

**Drift moved, so the guard moved with it.** Rendering Semantic through utilities means a hand-written token-to-utility list, which is new drift surface. It is guarded in both directions against the generated CSS, and both directions were watched red: an undocumented token, then a documented phantom.

**The nav guard moved out of `about.test.ts`** into `tests/export/nav.test.ts`. It globs every page and was never about-specific; a third route made that visible. Same precedent as `ProjectSections` becoming `ContentSections`. **This is a deviation from the spec**, which listed the nav assertion under the design-system suite; duplicating a globbed check would leave two lists of links to keep in step, which is the drift this route argues against.

**Rejected, carried from the spec:** a component gallery (the components are thin and a gallery would pad, which `CONTEXT.md:72` bans), a Style Dictionary token manifest (no `$description` metadata exists to lose), importing the DTCG JSON (the dark build filters, so a token can exist in JSON and never ship), and any mention of Figma at all (ADR-0002's sync is deferred, guardrail 1).

**The tone pass changed one line.** "because a number is not a thing you can judge" became "because the question is whether the steps are far enough apart to see". Tell #2: the first is a maxim shaped to sound like insight, the second is the actual reason. The restraint line ships unchanged in the wording the spec fixed, once, directly under the intro.

**Known thin spot, stated rather than hidden.** `ENFORCED_RULES` in `src/content/design-system.ts` describes `token-discipline.test.ts` in prose, by hand. A fifth rule added to that test and not to this list would leave the page quietly out of date, and no guard catches it. Generating the descriptions was rejected: the page would then document itself rather than the code, and the `why` for each rule is the part worth reading and cannot be derived.

49 unit, 88 export, 0 skipped, typecheck clean. v1's four routes are all shipped.

## 2026-08-01: The CV palette and the type roles

`docs/superpowers/plans/2026-08-01-cv-palette-and-type-roles.md` ran end to end in ten tasks, each ending green and committed. It closed the two gaps its spec opened with: two of eight Semantic colours rendered nowhere outside their own swatch on `/design-system`, and the type layer named sizes rather than jobs.

**The palette came out of the CVs by measurement, not by eye.** The content streams of `CV Track B` and `CV Track C` were extracted and both use exactly four colours: `#000000`, `#795428`, `#ffffff`, `#181A1B`. No green, and no `#AC814F`. The CV in the screenshot with the green header band is the Track A games CV, a different document for a different track. The two CVs this site serves run on near-black, white and one bronze. The two near-blacks are 5% apart in lightness, which is not a text decision but a page and a raised panel, so `surface` got its job straight out of the source.

**The grey merge, and the CV deviation it costs.** CV `#999999` is merged into `#949494`. One primitive now does both jobs: the light control boundary at 3.03:1 and dark muted text at 5.76:1. Keeping `#999999` for dark muted would have read 6.13:1, a ratio nothing needed, at the price of two greys 2% apart with one used only in light and one only in dark. This is the single place the palette departs from its source for a reason internal to the site. **Rejected: keeping `#999999` for CV fidelity.**

**The green split, flagged and accepted.** `capability` shifts 19 degrees in hue and 31 points in saturation between themes: `#49851D` is a vivid grass green, `#93A855` a muted olive. Every other token changes lightness and keeps its character, and the gold pair shifts 2 degrees. Leonid chose this knowingly after it was flagged. It matters because `/design-system` invites a reader to toggle the theme and watch the Semantic row move, and this is the one row that will do something other than get lighter.

**`muted` on `surface` was rendered and unlisted, and measuring found it.** The Rollhaus figure has filled its step panels with `bg-surface` and captioned them in `text-muted` since 2026-07-31. On the zinc palette that pair measured 4.40:1 in light, under AA, and it shipped, because three comments in this repo asserted that nothing renders on `surface`. All three were written in good faith and all three were stale. The CV palette clears it at 7.54:1 light and 5.48:1 dark, both confirmed in a browser against the live rendered figure rather than against the token table. It is now a listed pair. Listing it is what stops the next palette shipping the same way, and the three comments were corrected in the same commit rather than later.

**Eleven roles, not the spec's nine.** `wordmark` exists because the header is a serif at body size that no listed role produces. `code` exists because five monospace specimens get their family from Tailwind's preflight, and `type-meta` would have set them in the sans family with nothing to notice. **Rejected:** losing the serif wordmark, losing the monospace specimens, and leaving five call sites outside a rule whose whole point is that nothing is outside it.

**`type-eyebrow` carries `text-transform: uppercase`,** the one literal in an adapter that is otherwise all `var(--ds-*)`. **Rejected: leaving `uppercase` at the four call sites,** which keeps the adapter purely token-referencing at the price of a role that is only four fifths of the pattern.

**The font variables moved from `<body>` to `<html>`, and the reason is a cascade rule rather than a preference.** A custom property is substituted where it is declared. The family Primitives are declared in `:root`, so with `next/font`'s variables one element lower they would have computed to nothing and every role's family would have fallen back silently. Found by reasoning about the cascade before it shipped, which matters because the failure mode is invisible: a wrong font looks like a font choice. Verified after the move by reading the resolved `:root` value in a browser, not by looking at the page.

**The resolver now stops at a `var()` outside the `--ds-` namespace.** One regex, scoped from `--*` to `--ds-*`. Not a workaround: the token graph legitimately ends at the framework's variable, and following it threw on a value that is correct.

**The work-grid drift was watched failing under the new rule before the rule was believed.** Putting `font-serif text-heading` back on that h2 fails with `sets a type property outside a role: font-serif`. A fifth rule added after every call site was already migrated is green from the start, which proves nothing until it is made red on purpose. The h2 itself now renders at 1.250 line height, measured in the browser, beside the seven that always did.

**The plan's own comments tripped its own guard three times.** Three comment texts the plan supplied name a banned class or token literally (`--ds-primitive-font-family-serif` in `layout.tsx`, `font-normal` in `contrast-table.tsx`, `leading-tight` in `globals.css`), and `token-discipline.test.ts` reads comments. Each was reworded to describe rather than name, following the precedent already at the top of `src/lib/tokens.ts`. The guard was right every time. This is the same class of finding as the JSDoc hex on 2026-07-31: prose about the system is inside the system.

**One guard the plan did not list moved with the work.** `tests/export/static-export.test.ts` pinned the hero headline to `sm:text-display` by name. Its point was that the headline is not on a Tailwind built-in, which is more true after the change, so the assertion follows the utility and records why in place.

**One deviation on tone.** The plan put the work-grid heading incident both in the families prose and in the new enforced rule's `why`, on the same page. `CLAUDE.md` guardrail 5 says state an honest limitation once, where it lands hardest. The prose now explains the mechanism and the rule keeps the incident, which is where a reader asks why the rule exists.

**The known thin spot from 2026-07-31 was walked across for the first time, and held by hand as designed.** `ENFORCED_RULES` describes `token-discipline.test.ts` in prose, with no guard keeping them in step. A fifth rule was added to both in the same commit, along with the two counts in the surrounding copy. The thin spot is still there and still unguarded; it is now known to be load-bearing rather than theoretical.

**The size ramp is no longer reachable.** The seven `--text-*` bridges and the two family bridges are out of `@theme inline`. `--ds-text-*` survives as what a role's size references, so the ramp is still in the chain and still on the page, but a component picks a role or nothing.

61 unit, 95 export, 0 skipped, typecheck clean. Verified from a clean state with `.next`, `out` and the generated CSS deleted. Browser pass over all four routes in both themes changed nothing: nine Semantic swatches move on the toggle, twelve Primitive and sixteen Brand hold, and all eleven role specimens render through their own utility.

---

## 2026-08-01: The header chrome, and two routes that highlighted nothing

Six changes from a review by Leonid, plus two things measuring turned up on the way. All of it is chrome: no copy moved.

**The wordmark moved onto the body family, which reverses a decision logged four entries above.** That entry lists "losing the serif wordmark" as rejected, and the role exists in the first place because the header was a serif at body size. What changed is the argument, not the taste: at one size, in one row, a second family reads as an inconsistency rather than as hierarchy, because nothing else marks the name as the name. Leonid was given three options and picked this one. **Rejected: keeping the serif** (logo-then-links, which is defensible and is what was there), **and keeping the serif one step larger** so the size difference explains the family difference. The role survives the change: weight and line height still separate it from `type-body`, and weight is now the whole of the difference.

**The wordmark became a nav link rather than a block in the header.** It is a link to a route, it needs the same current-page marker as the others, and the marker logic is identical for all four. It was already written once in `site-nav.tsx` for exactly that reason; leaving the wordmark outside would have made a second copy, which is what the comment there had been warning about since 2026-07-31.

**Two routes highlighted nothing, and only one of them was on purpose.** Home marked nothing because Work is a fragment into it and cannot claim to be the page, which was recorded as deliberate. That reasoning was sound and the conclusion was still wrong: the wordmark is Home's link and could always have carried it. The second was not deliberate at all. `/work/<slug>` has no link of its own and had been highlighting nothing since the route shipped. It now marks Work with `aria-current="true"` rather than `"page"`, because the visitor is under Work and is not on `/#work`. **Rejected: `"page"` for both,** which is the common shortcut and would tell a screen reader the visitor is somewhere they are not.

**The theme toggle was a bordered rectangle with a word in it, one gap away from three links that gain a border on hover.** It read as a fourth link. It is a track and a knob now, and the label names the setting instead of the action: it used to say "Light mode" while the site was dark, which is what a button that performs an action says, not what a control that reports a state says. Side effect worth having: the text no longer swaps at hydration.

**The knob's position comes from `data-theme`, not from React state.** State is null until hydration, so a returning visitor with a stored dark theme would have seen the knob start on the left and jump. The attribute is on `<html>` before first paint, set by the same script that stops the colours flashing. This is the first component on the site whose geometry reads the theme, and it needed `@custom-variant dark ([data-theme="dark"] *)`, because Tailwind's own `dark` variant follows `prefers-color-scheme`, which on this site is a lie. **Rejected: a second name (`theme-dark`) beside the built-in,** which would leave `dark:` in place as a trap that silently does the wrong thing.

**Contact links show an icon instead of a label heading.** The label is not deleted, it moved into the link where a screen reader still reaches it: a picture is not an accessible name, and without it the itch.io row announces as "lolesch.itch.io" with the drawing beside it saying nothing. The icons are `currentColor` throughout, which is what keeps them inside rule four rather than being four colour literals in a component. **Rejected: the itch.io lettermark,** which is unreadable at this size; a gamepad says what the link is for and the label says whose. Sized in `em` rather than in a spacing token, so it is a ratio to the text rather than a length that happens to match today.

**The portrait ring went from 1px to 4px, and the lens capsules had their inset flipped.** The capsules were a uniform `tight` and read as tall and narrow, which is what a full radius does: it spends the horizontal space on the curve, while `meta`'s line box already supplies the height. Horizontal only now, so the height comes from the role and the width is the one of the two a capsule has to decide.

**A measurement mistake worth recording, because it nearly produced a fix for a bug that did not exist.** The knob's position read as `transform: none` in both themes and looked broken. Tailwind v4 sets the standalone `translate` property, not `transform`. The generated CSS was correct the whole time. Reading the artifact rather than trusting the reading is what settled it, which is the same move that found the `surface` contrast gap yesterday.

**Three new guards were watched failing before being believed.** Removing `page` from the wordmark and `section` from Work fails all three: Home marks nothing, the one-mark-per-page count drops to zero, and the project page loses its section marker. Reverted, and the suite is green again.

61 unit, 97 export, 0 skipped, typecheck clean. Browser pass over all four routes in both themes: the switch moves in both directions, the wordmark and the three links each mark exactly their own route, and the project page marks Work.

## 2026-08-01: Two corrections to the entry above, both from Leonid using it

**The wordmark should never have carried the marker, and the entry above got the reasoning backwards.** It says Home is the work page and concludes that the wordmark is therefore Home's link. The first half is the point: Home *is* the work page, the grid is on it, and Work is what that location is called. The wordmark is the way back to it, not its name. What shipped meant clicking Work highlighted the site's own name, which is how Leonid found it. Work now carries `page` on `/` and `section` on `/work/<slug>`, and the wordmark carries neither. **Rejected: marking both,** which puts two links on one destination and makes the identity double as a location.

The claim it replaces was that a fragment cannot claim to be the page. A fragment does not leave the page it points into, so `/#work` is `/`, and Home was never the exception it was recorded as being twice.

**The switch label never changed, which was a deliberate choice that was wrong in use.** A switch names its setting and lets the knob carry on and off, so "Dark mode" was correct by the pattern and read as stuck by the person using it. The label now names the current mode and the accessible name continues into the action: "Light mode. Switch to dark mode". **Rejected: a visible label that changes while the accessible name stays fixed,** which reads well on both sides and fails SC 2.5.3, because a voice-control user says the words they can see.

**The fix removed the component's state entirely.** The label had to be a constant precisely because React could not know the theme before hydration, so any changing string would have flashed. Shipping both labels and letting CSS show one removes the reason: no `useState`, no `useEffect`, no `aria-pressed` that is undefined until the client catches up. The attribute the pre-paint script writes is now the only source, for the colours, the knob and the words alike. `aria-pressed` is gone rather than kept, because "Light mode, not pressed" is a contradiction when light mode is what is on.

**A reading that nearly became a bug report, for the second time today.** The page reader reported no accessible name on the button and on all four contact links. It reports one for every link whose text is a direct child and none for any link whose text sits one span deeper, including links that predate this work. Checked against the browser's own accessibility tree, every one of them names correctly and the `display:none` label and the `aria-hidden` icons are excluded as they should be. The tool was shallow. Yesterday's version of this was reading `transform` where Tailwind sets `translate`: when a reading says something is broken, confirm the reading before believing it.

61 unit, 98 export, 0 skipped, typecheck clean.

## 2026-08-02: The nav pins, Work becomes Projects, and the page grows a second width

Four pieces of feedback from Leonid, one of which turned out to be two problems, plus a fifth change he called during the pass.

**The header is pinned, and pinning it is what broke the nav.** Sticky, opaque `bg`, with a hairline underneath: with a background and no edge, text scrolling beneath reads as text being clipped. **Rejected: a blur,** which puts running text behind the links and measures its contrast against something other than the `bg` this site publishes numbers for. The bar is two elements rather than one, because the background has to run edge to edge while the row inside stays on the frame.

**The nav collapses to a menu button below `sm`, which reverses the `flex-wrap` decision from 2026-08-01.** That decision was right while the header scrolled away: nothing was hidden and the cost was paid once, at the top. Pinning changed the arithmetic, and the numbers are the argument. Measured, the wrapped header was 135px at 390px and 186px at 320px, a sixth and a fifth of a phone screen, permanently. It is 89px at 320px now. Leonid called this one after seeing the wrapped version pinned. **Rejected: keeping the wrap and paying for it in scroll offset,** which is what the first draft did and is recorded below as the bug it was. **Also rejected: `order` utilities to pull the switch up beside the wordmark,** which gets to two rows without a menu but makes the tab order jump down to the nav and back up to the switch. The wrapper that groups the button and the switch uses `sm:contents` instead, so the DOM order is wordmark, nav, toggle in both layouts and SC 2.4.3 needs no argument.

**The toggle's label goes `sr-only` below `sm`, which trims a decision from the entry above rather than reversing it.** The visible words exist to keep the switch from reading as a fourth nav link. Below `sm` there are no visible nav links to be confused with, and the label is about 70px that a 320px row does not have. The accessible name is untouched.

**Work is Projects, in the label and in the URL.** `/work/<slug>/` is `/projects/<slug>/`, `WorkGrid` is `ProjectGrid`, and the anchor is `#projects`. **Rejected: renaming the label only,** which is the smaller diff and leaves the URL bar arguing with the nav. Free to do now and not later: nothing is deployed with inbound links yet.

**The card's metadata line lost `role`, which is the half of it the lens chips were already saying.** Rollhaus read "UX + design systems" and then showed `UX/UI` and `Systems & Architecture` one line below. `year` and `context` stay, because neither is duplicated and "Course project, pair" is the honest label guardrail 5 asks for on the surface most people read instead of the page. **Rejected: cutting the chips instead,** which are the site's own taxonomy and the thing the v2 Router will filter on, so between the two they are the one with a second job. **Rejected: cutting `role` from the detail page as well.** The page is where full attribution belongs and where nobody is scanning.

**The page has two widths now, `frame` at 64rem and `measure` at 48rem, and that is the actual fix for the squeezed cards.** One width meant the grid was sized by what a paragraph needs, so two cards shared a container built for text. The grid track minimum went 17rem to 22rem at the same time, and the number is doing one job: above 19.4rem a third column no longer fits in the wider frame, at or below 29.75rem a second still does. Cards are 29.75rem where they were 22rem. **Rejected: one column with horizontal cards,** and **rejected: letting the featured tile span both columns,** which uses the `tier` field that currently sorts nothing and is worth revisiting when there are more than three projects.

**The frame is on the layout, not on four `<main>` elements.** Each page now declares only its own width, and the left edge of the site is decided in one place.

**Centring the reading column inside the frame was wrong, and the screenshot is what showed it.** It gave Home three left edges: wordmark and grid at 225px, hero text at 338px, with the first thing anyone reads lining up with nothing. Flush left everywhere instead. This was not caught by reasoning about it and was obvious on sight.

**The first draft of the scroll offset shipped the exact bug its own comment warned about.** A sticky header needs `scroll-padding-top` or an in-page jump lands behind it. The comment said a single value could not cover a header that wraps, and that erring short hides the heading; the value under it was 6rem against a 135px phone header. The collapsing nav is what made one value honest, and it is 7rem against an 89px worst case. Both widths were measured after the change rather than reasoned about: 23px of clearance at 320px, 36px at 1440px.

**Two `@utility` literals were added rather than tokens.** `frame` and `measure` are lengths in `globals.css`, not `var(--ds-*)`, because there is no Semantic family for layout geometry and adding one means a family, a guard in `design-system.test.ts` and a section on `/design-system`. Named in one place first, which is the drift the type roles exist to stop. The `scroll-padding-top` literal is the worse of the three, because it is a measurement of another component rather than a decision, and it goes stale in silence if the header gains a row.

**The new menu-button guard was watched failing before being believed.** Removing `aria-controls` fails it on all nine exported pages. The three link assertions above it stay green throughout, which is the point of adding it: the links are in the markup at every width, CSS is what hides them, and without this the site could ship with no way to reach them on a phone and every existing guard would pass.

61 unit, 99 export, 0 skipped, typecheck clean. Browser pass at 320, 390, 480, 640, 1280 and 1440 in both themes: the menu opens, closes on Escape, closes on navigation, and the desktop row is unchanged at 75px.

## 2026-08-02: FerMentor is written, and held back on one missing image

Implements `docs/superpowers/specs/2026-08-02-fermentor-case-study-design.md`. Nine of its eleven sections shipped. Sections 4 and 8, the research board and the screens, are the two that are pictures, and the exports they need do not exist yet.

**The record is complete and is not in the `projects` array.** It is typed `Omit<Project, 'thumb'>` and exported on its own, because the one field it cannot honestly carry is the thumbnail. **Rejected: a placeholder thumb.** `width` and `height` come off the exported image, inventing a pair ships layout shift, and deploy runs on every push to main, so a `src` pointing at nothing is a broken card in production rather than a plainer one. `types.ts` already says this: the thumb is required because the grid is image-led. Landing it is `thumb` plus a spread, and nothing else in the file changes.

**The copy guards were widened to reach records that have not shipped.** They walked `projects`, so an authored record sitting outside the array is checked by nothing until the day it goes in, which is the worst moment to discover an em-dash in it. `AUTHORED` is the array plus FerMentor, and it runs the schema, padding, restatement and em-dash rules. The thumbnail rules split off into their own loop over the shipped array, because those are the rules the held record is held for. Slug uniqueness moved to `AUTHORED` too: a held record that collides with a live slug takes the route with it when it lands.

**The stage figure is typed rather than `as const`, unlike the two figures beside it.** Its phases hold four, one and two stages, so `as const` infers three different tuple types and hands the component a union it cannot map over. The shape is the argument the figure makes, so it is worth stating in the type: four stages of development funnel into one decision, which branches into two outcomes. Nested lists rather than a flat seven for the same reason.

**Three limitations, three places, and one of them moved off the spec's plan.** The spec put no-usability-testing in the Outcome section. It is in `whatChanged` instead, and Outcome does not restate it, which is the call how-to-god already made and recorded: the detail page renders the three schema lines above the sections, so a section repeating one is tone tell #10 with extra steps. The proto persona is named once in Who it is for. The taxonomy provenance, desk research and AI-assisted synthesis rather than the three interviews, is in the figure's footnote, where Rollhaus puts its ad hoc naming caveat. None is echoed in the Learnings.

**The AI sentence stayed a disclosure and did not become a story.** `work_history.md` already records AI in the discovery phase, so stating where the model came from is accuracy. A paragraph about pressure-testing framings with AI would be the code-first workflow narrative retrofitted onto a SPICED project, which guardrail 2 bans. The footnote says where it came from and stops.

**Two things this turned up that are not fixed.** `scripts/extract-figures.py` is broken: `SOURCES` points at `job-search/portfolio/case_studies/assets`, and the sibling repo has restructured to `portfolio/projects/<slug>/{source,assets}`. It is not a path edit, because files were renamed with the move (`Editor.png` is now `rollhaus_editor_quad.png`) and `Project3_Rollhaus (Lo-Fi).pdf` is not in the new tree at all. Guessing the mapping would produce a script that looks fixed and is not. Separately, the Outcome section cannot carry the Figma prototype link even once the URL exists: `prose` bodies are plain strings and the content model has no link anywhere in it. That is a type and renderer change, and building it before there is a URL to put in it would be machinery with nothing to carry.

Verified by temporarily putting the record in the array with a throwaway thumb, building, and reverting: the route generates, all seven stages and both annotations reach the HTML, and the export suite goes 99 to 106 green. The file was diffed against its pre-verification copy afterwards to confirm the revert was exact.

69 unit, 99 export, 0 skipped, typecheck clean, build green at three routes.

## 2026-08-03: FerMentor lands, and the extraction script follows the sibling repo

Leonid supplied the Figma exports, the prototype link and the span, which unblocked everything the entry above was holding back. The record is in the array, second, and the page ships at `/projects/fermentor/`.

**The extraction script was broken and is fixed, and the fix verified itself.** `SOURCES` pointed at `case_studies/assets`, which the sibling repo replaced with a folder per project. The layouts inside are not consistent, Rollhaus keeping PDFs in `source/` and PNGs in `assets/` while FerMentor keeps everything at the project root, so `find_source` looks in all three and takes the first hit rather than encoding the layout per figure. The PNG renames were confirmed by dimensions before being trusted, `Editor.png` to `rollhaus_editor_quad.png` at the 2916x2086 with alpha the script already documented. **The proof is that all six Rollhaus figures regenerate byte-identical**, which is the only thing that could distinguish a real fix from a plausible one. The previous entry called this unfixable without guessing; it was fixable by checking.

**Six FerMentor figures, each chosen against an alternative.** The thumb is three batch-detail screens rather than the dashboard group, because a dashboard reads as any list app while this one carries SHOW ME, the overdue banner and the Ready state. The framings figure is the research board column with its reasoning paragraphs, tall and narrow because the column is; cropping wider would pull in the neighbouring columns and make it a picture of a board rather than of an argument. The two dashboard states use identical crop boxes for the reason the Rollhaus editor pair does, so the only difference between the images is what the interface says.

**The predict and report cards are a `comparison` of two halves of one exchange, not two states of one screen.** That stretches the kind and is still right: the claim is in the difference, and the category column is identical and in the same order on both sides, which is the appearance-first rule made visible rather than asserted. On the source canvas they sit far apart with dead space between them, so shipping the phone that carries them would have shipped mostly empty canvas.

**`prose` sections can carry one outward link now, which is a type change made for a real thing rather than in advance.** Same `{label, href}` shape as `About['cv']`, same `target="_blank"` and `rel="noopener noreferrer"`, same reason: a prototype the reader cannot open is a claim rather than evidence, and a PDF or a Figma file replacing the page is a dead end for someone part-way through it.

**Two guards were watched failing, and the first attempt at watching proved nothing.** Breaking the href in the record and rebuilding still passed, because the test builds its regex from the same record: both sides moved together. That is the honest limit of this guard and it is written into the test. Stripping `target="_blank"` out of the renderer is the failure it can actually see, and it fails on that. Whether the URL resolves stays a manual check, which is the CV lesson from 2026-07-31.

**A latent bug in the figure guards surfaced.** The alt assertion read `body`, which is raw markup, so it only ever worked because no alt on the site contained a quote or an apostrophe. The first alt with quotes in it failed against correct markup. It reads `text` now, which decodes what React escaped, and that is what the helper's own docstring says it is for.

**The AI disclosure moved to where the claim is made.** The framings figure shows its reasoning addressing Leonid in the second person, so the prose says the options were drafted with AI to pressure-test them and the paragraph after it argues the choice. Cropping the tell out would have been hiding it. This is disclosure at the point of claim, which guardrail 2 allows; a workflow narrative is what it bans, and there is none.

**Three limitations, unchanged from the plan, each in one place:** no usability testing in `whatChanged`, the proto persona in Who it is for, the taxonomy provenance in the figure footnote. Nothing echoes in the Learnings.

67 unit, 132 export, 0 skipped, typecheck clean. Four routes, FerMentor second behind Rollhaus.

## 2026-08-04: the scan pass, and seven headlines that were all the same headline

Leonid read the shipped site the way a UX/UI hiring manager would on a first pass and came back with four complaints: the headline is strange, the card copy is too long and the titles too small, the design-system page is a hierarchy nobody asked for, and About opens with the least interesting thing about him. Every one of them was right about the symptom. Two were wrong about the cure, and the interesting part of this entry is those two.

**The headline took seven drafts because the first six were the same draft.** The brief was "more straightforward and punchy", so the first three replaced `I build systems that designers can understand and engineers can build.` with variations on `Design and engineering are two ways at the same problem. I work in both.` Leonid rejected all three: "it still feels constructed, not what I would ever say." The next four were plainer versions of the identical move, `I design and I build.` and its relatives, and he rejected those too, with "I think we need to step back and look for alternatives."

He was right and the diagnosis is worth keeping. Every one of the seven had the shape *proposition, then claim*: state something about design and engineering, then assert he does it. That is essay structure, and nothing in his own writing does it. `The interface was in every job I had.` states a fact and lets the reader draw the conclusion. So the fix was not a better sentence in that shape, it was a different shape. Four directions were put up, a point of view about the work, the arc as bare fact, a plain introduction, and the site as the argument, and he picked the first. The headline is now `The hard part happens before anyone starts building.` and the body paragraph is where it came from, which also stops the two repeating each other.

**"One job" was cut from three places at once, on Leonid's objection to the logic.** The old body read `design and implementation are one job instead of two` and About's closing section said the same. His note: if they are one job then there is only one job, which was never the claim. They are two ways into the same problem and he has both. Fixing the h1 alone would have left the site arguing with itself, so all three moved together, and `tests/export/static-export.test.ts` now asserts the phrase is absent from Home rather than trusting it.

**Rejected: naming what actually went wrong at those jobs.** Leonid's own reading of `they were in what nobody had framed` was sharper and more specific: nobody held the whole project, people started developing without planning ahead at the required capacity. It is true and it is unusable. Any version of it reads as a candidate blaming his old teams, and About already carries the braver form, where he owns the same failure himself ("the temptation is to jump to a solution before the problem is properly framed"). The line kept the diagnosis and dropped the villain: `They were in what nobody had decided yet.` Also gone is `from someone else's spec`, which spent five years of experience instead of banking it, and `learned to do that half properly`, which parses as *halfway* properly.

**Five card title treatments were built and rendered rather than described, and the two that lost taught more than the winner.** Leonid asked for the project name centred over the visual. The objection on paper was that text over arbitrary imagery is the one contrast this site cannot compute at build time, which matters on a site whose flagship page computes all of them. That objection turned out to be the second-best reason. Rendered at full width on the real thumbnails, the translucent veil bleaches the image: Rollhaus is a *colour* configurator, and a 78% wash turns its skate pastel, destroying the one thing that thumbnail exists to prove. The centred plate was worse in a different way, slicing every image through its subject. What shipped is a bottom gradient, opaque where the text sits, left-aligned onto the same edge the wordmark and the hero share. The opaque stop is 40% rather than the 30% the variant shipped with, because at bridge size the scrim is only about 162px tall and 30% of it put the top of the glyphs outside the solid zone, which would have made the contrast claim false in exactly the place nobody would check.

**The grid splits on `tier`, which has been on the model since it was written and had never been read.** Featured full width, bridge two-up. Four equal cards say the four projects are equally worth your time, and this site is Track C primary. Rejected: full width for all four, which ran the page to roughly 3000px, and a heading over the second group, because "Other work" signals *lesser* on the two projects carrying the games half of the arc while the size difference already says which to read first.

**The design-system page had no components on it at all.** Leonid's complaint was the type-role hierarchy, eleven roles times five token lines, and he was right that nobody is reading it. The larger problem was underneath: the page documented 12 Primitives, 16 Brand tokens, 9 Semantic roles, 5 space steps, 7 sizes, 11 roles and 3 radii, and did not render a single button, chip or focus state. It answered *what tokens exist* when the question is *what decisions hold this together*. It now opens on four pillars, each enforced somewhere further down rather than promised, then a gallery of the components in place, and the inventory sits behind `<details>` where it is still proof and no longer the first three screens.

**Rejected: deleting the detail.** The build-time reading, the five enforced rules and the computed contrast table are the things no other portfolio has. Nothing was removed; the ordering was wrong, not the volume. The 28 fixed swatches were replaced *in the scan path* by one traced chain, Semantic to Brand to Primitive to the resolved value, which shows the direction the section is about in a way a grid of squares cannot.

**`LensChip` was extracted so the gallery could show the component rather than a picture of it.** A gallery of reproductions documents a second system that happens to match the first one today. One component, two call sites, nothing to drift.

**Two guards caught the gallery doing real damage, and both times the guard was right.** The specimen card started as `projects[0]`, which is Rollhaus, whose summary reads "built on Figma variables and modes"; that put the word Figma on the page documenting a code-first token system whose ADR explicitly defers any Figma sync, and a reader is entitled to infer a connection that does not exist yet. It is FerMentor now, selected by slug so a reorder cannot change it. The current-page link specimen carried a real `aria-current="page"`, which told a screen reader the visitor was in two places at once; it is styling without the attribute now, and the note says so. Neither guard was loosened.

**The tone check pulled back a claim in the About intro.** The rewrite ended `and I still use all three`, which reads as though the metalwork were also live. It is not: what survives it is a shelf on a wall and a knife in a pocket, which the last section says properly. It is `and I still write the code` now. Guardrail 1 applies to a sentence about yourself the same as to one about a project. Three other lines came back for tell #2, the manufactured closer, which had started collecting on the new design-system copy.

**About is present-first.** How I work, Where I'm going, Why UX, How I got here, against the chronological order that put who Leonid is now third of four on the page a reader opens to find out exactly that. The "How I work" opening had its clauses flipped so the strength lands before the caveat; both halves survive, and as the first sentence on the page the old order read as a hedge before anything had been claimed. Rejected: replacing the intro's metalworker-to-developer-to-designer arc with a "many hats" line. The arc is the most memorable sentence on the site and "many hats" is a cliché that says less. What it was missing was a claim attached to it, not a different subject.

67 unit, 133 export, 0 skipped, typecheck clean, build green at four routes.

## 2026-08-05: the title moves to the top, and a contrast we said we could not compute

Leonid asked for three things: the project title at the top of the thumbnail rather than the bottom left, a scrim that peaks around 80% and fades out instead of running fully opaque, and a hover that does more than underline a heading. The third came with an observation that the design system had no interaction rules and this was the moment to write them. What follows is what the work turned up, which was more than the brief.

**The accessibility argument the old comment made was true about opacity and wrong about computation.** The bottom scrim was fully opaque under the text, and the code said so in as many words: text over an arbitrary photograph is the one contrast this site cannot compute at build time. That sentence was on a card belonging to a site whose flagship page claims it computes all of them. It is computable as a *bound*. A translucent scrim composites over the image, so the result depends on the image, but not without limit: the worst the image can do is put its most hostile pixel underneath, and in sRGB there are only two candidates, black and white. Bound the composite against the one that pulls towards the text colour and the ratio holds for every photograph that could ever be dropped into the grid. At 80% it measures **10.88:1 in light and 9.22:1 in dark**, both past AAA. The AA floor is 0.60 and **dark is the binding theme**, which is not the intuitive answer: the hard case is light text over a light-diluted scrim on a white pixel, not the dark one. So the request that looked like it traded legibility for prettiness turned out to have four tenths of headroom, and the site can now prove it. `src/lib/scrim.ts` owns the peak, `tests/unit/contrast.test.ts` bounds it, and /design-system renders the two numbers computed rather than quoted.

**Rendered before written, again, and the lab answered a question that was not asked.** A prototype in `.scratch/` with the real tokens and the real thumbnails carried three placements, a scrim slider wired to the live WCAG calculation, and six interaction variants. Two findings came out of hovering it rather than reasoning about it. The scrim as a percentage of the image cannot work at both tile sizes: 55% is 335px on the featured card carrying a 44px line and 162px on a bridge card carrying a 30px one, and stops tuned for one put the other's glyph tops outside the covered zone. That is how the bottom scrim had reached 40% by trial. Content-sized, one set of stops is right for both. And a three-stop fade left a **visible horizontal seam** across the photograph, because the eye reads a discontinuity in the rate of change and not only in the value. Seven stops approximating a decelerating curve, and the scrim has no bottom edge.

**Rejected: scaling the card, which is what "scale it up" literally asked for.** Rendered with the frame edge marked, and it fails twice. The featured tile is already the full content box, so it grows past the frame and the page's left margin stops being the left margin. In the two-up row it eats the gap the spacing token exists to hold. A grid that reflows under the pointer is a grid you cannot aim at. What ships moves the thumbnail 4% *inside* a box whose size never changes, promotes the card border to `fg`, and keeps the underline. Three channels, one of which is motion.

**A claim in the code was false and moving the title would have made it obvious.** `after:inset-0` resolves against the nearest *positioned* ancestor, and the title was an absolutely positioned overlay, so the link's target was the scrim rather than the card while the comment beside it said "the whole card is the click target". At the bottom edge that was 55% of the thumbnail and easy to miss. At the top it would have been a 120px band. The media box is a one-cell grid now: stacking needs no positioning, the `<h3>` stays static, `z-10` orders it above the image without making it a containing block, and the pseudo-element resolves against the `<article>`. Verified by hit-testing three quarters of the way down a card.

**One motion role, not two utilities.** `--ds-motion-state` and `--ds-motion-ease` are a new Semantic family, and `motion-state` in globals.css carries both, the same shape as a type role and for the same reason: a call site that takes the duration and forgets the curve has invented a second tempo, and nothing looks wrong until there are four of them. `transition-property` is deliberately *not* in the role, because which property moves is the component's business: the card animates its border and the thumbnail animates its transform and both are correct. Rule six of `token-discipline.test.ts` bans `duration-*` and `ease-*` everywhere else.

**The reduced-motion answer is inside the role rather than at the call site,** because a guard that has to be remembered gets forgotten and this one fails invisibly to everyone it does not affect. Verified under emulation: with the setting on, the border still promotes and the title still underlines, the durations go to 0s, and the thumbnail does not scale at all.

**Three bugs surfaced only by reading the compiled CSS and the rendered page, and none of them would have failed a test.**

`motion-safe:motion-state` came out of Tailwind with the variant's media query *silently dropped*, because the role already contains an at-rule and the two could not be nested. The class was in the markup, the utility was in the stylesheet, the page looked right, and the source asserted something the browser never did. It was also redundant. `tests/export/motion.test.ts` now walks the minified CSS for the at-rules wrapping each rule, and it fails when the variant is reintroduced.

`transition-colors` on the card also covers `color`, so throwing the theme faded every line of text on the card across 160ms while the rest of the page changed instantly. Caught in a screenshot taken mid-swap. It is `transition-[border-color]` now: only the border is a state here.

The first draft of rule six matched the phrase "ease-out curve" in a comment. Rule four's own note says a guard that cries wolf gets deleted, so the pattern names Tailwind's four built-in easings outright and requires a digit or bracket after `duration-`.

**Two stale counts, and the fix was to stop writing counts.** ENFORCED_RULES went from five to six and left "Five of them" behind in two sentences and a comment. The number is rendered from `ENFORCED_RULES.length` in the heading now, which is the argument this page makes about every other number on it and was not making about its own.

**Open, and Leonid's to settle: centred collides with thumbnails that carry their own centred UI text.** On the Rollhaus editor the title lands beside "Select Your Skates" and the two read as one row of unrelated words. Top-left avoids it and keeps the shared left edge every other block on the page starts from, which is what the 2026-08-04 comment defended. Both are in the lab.

70 unit, 137 export, 0 skipped, typecheck clean, build green at four routes.

### Same day, second pass: the scrim stops following the theme

Leonid picked top-centred, variant 3, and 70%, then added the thing that turned out to matter: the overlay should be dark in *both* modes rather than flipping to a light wash in light mode.

**He was right on the rendering and the reason is worth keeping.** A pale veil over a pale card has nothing separating it from the card, so it read as the card spilling upward into the photograph rather than as something laid over it. Dark, it reads as media chrome, which is what it is. The same move a subtitle makes, and subtitles do not invert with the surrounding page either.

**That made two Semantic colours theme-invariant, which is a first here and a better demonstration than the ones already on the page.** `--ds-color-scrim` and `--ds-color-on-scrim` have to move together: a title that kept `fg` would be dark ink on a dark band in light mode, which is the exact failure the pair exists to make unsayable. They live in a new `tokens/semantic/color.json`, beside space and radius rather than inside either theme file, and the dark platform's existing filter leaves them alone with no change to the build. The mechanism is now worth stating out loud: **a colour is theme-varying here exactly when the dark file re-declares it.**

**A guard caught the change and was right to.** `tokens.test.ts` asserted light and dark declare an identical `--ds-color-*` set, under the name "so no component branches on theme". That name is still satisfied, because a role declared in `:root` and never overridden is correct in both themes without a component knowing which is on; `text-on-scrim` is written once. The mechanism assertion was what had gone stale. It is split rather than loosened: an override with no role under `:root` is still a failure, and the roles the dark file omits are now listed by name, so the next one is a decision someone makes rather than a check that quietly stops applying.

**The bound collapses to one number, and that is the claim rather than a simplification.** Scrim, text and worst pixel are all theme-independent now, so 70% measures **6.44:1** everywhere, past AA and no longer past AAA. The floor for this pairing is near 0.6, so 0.7 keeps a tenth in hand and 0.6 would not. The table on /design-system is one row, and the caption says why; two rows printing the same number would have looked like a bug and argued for something weaker than what is true. The unit test asserts the invariance directly instead of measuring the same thing twice and trusting the numbers to agree.

**Four counts written into prose went stale in one pass** and all four are gone rather than corrected: "nine colour roles" twice, "three of the nine", and "the five enforced rules". The page renders lengths from the lists. A page whose argument is that documentation cannot drift from what ships should not be the last place hand-counted numbers survive.

71 unit, 137 export, 0 skipped, typecheck clean, build green at four routes.

### Same day, third pass: the title gets bigger, and gold gets a number put on it

Three notes from Leonid: the title is still too small, could some of the brand gold get in there ("as an outline to the font, or the font color itself"), and it is "Rollhaus", not "Rollhaus Skateshop".

**The name was wrong in the prototype, not on the site.** `projects.ts` has said `Rollhaus` since it was written. The lab I built the previous pass invented "Rollhaus Skateshop" along with a summary and two wrong years, because I typed plausible copy into a scratch file instead of pulling the records. It is a scratch file and it still matters: he read it as the site and reported a bug against copy that does not exist. The lab now carries the real strings. **Fabricated copy in a throwaway is still fabricated copy**, and this is the second time in two days that a guard existed for the shipped surface and not for the thing being looked at.

**Titles go up one role at both sizes:** `display` on a featured tile and `title` on a bridge tile, from `title` and `heading`. This is the second call site for `display`, which was the home h1 alone and was the type role closest to being inventory. The hierarchy cost is real and is paid knowingly: a card title now matches the page headline in size. They never share a screen, and inside the projects section this is the headline.

**Gold as the title colour is not available, and the numbers are why rather than an opinion.** Against the bound, gold-300 is **2.53:1** and gold-500 is **1.42:1**, versus 6.44:1 for white. Raising the scrim does not rescue it: at 85%, which is nearly opaque and defeats the whole reason the scrim came off 100% in the first place, gold-300 still only reaches 4.34:1. Lightening it until it clears AA at 70% needs 60% toward white, landing on `#e9d7be`, which is a cream and no longer the brand colour. Rendered, the gold fill looks fine on the Rollhaus thumbnail, whose top is dark, and is genuinely hard to read on FerMentor's pale phone screenshots. That pair of screenshots is the argument for the bound: **it is not that gold fails everywhere, it is that gold fails on photographs the grid is allowed to contain.**

**So the gold is an outline, which carries no contrast and therefore costs nothing.** `paint-order: stroke fill` puts the stroke behind the fill, so the white glyph stays at full weight and the gold extends outward instead of eating into the thing holding the 6.44:1. Set in `em` so it tracks the role, about 2.9px under `display` and 1.9px under `title`, rather than one width that is heavy at the smaller size. A browser with neither property renders plain white text, which is what shipped that morning.

**A third theme-invariant role, `--ds-color-on-scrim-accent`,** because the veil does not flip and neither can anything on it. It resolves to the lighter gold, which is the dark theme's accent and the right one for a dark surface. Reaching for the Brand token directly was the alternative and rule one bans it.

**One test asserts a failure, deliberately.** `cannot use the accent as the title fill, which is why it is a stroke` measures gold as a fill and expects it *under* 4.5:1. The next person to see a gold-outlined title will ask why the gold is not simply the colour, and the answer should be a number they can run. If the palette ever changes enough for it to pass, the case fails and says the fill may be back on the table, which is the moment to reconsider rather than a moment to delete the test.

72 unit, 137 export, 0 skipped, typecheck clean, build green at four routes.

### Same day, fourth pass: 90% and gold, and padding that scales with the role

Leonid: scrim at 90%, title in gold. Plus a real observation about the two card sizes, that the bridge tile's top padding looked right and the featured tile's looked cramped because the type had grown and the padding had not.

**Gold clears AA at 90%, so there was nothing to argue about.** The previous pass had measured gold at 2.53:1 and called it unavailable, which was true *at a 70% peak* and stated as if it were true of gold. At 90% the lighter gold measures **5.15:1** against the bound and the floor is 0.861, so the chosen peak has room above it. The correct framing is the one this landed on: **the peak is not a taste setting with a contrast consequence, it is set by what the title colour needs.** Three peaks in one day, 0.8, 0.7, 0.9, each right for what the title was at the time.

**One role, not two.** With the title gold, `on-scrim` as white would have rendered nowhere, so `--ds-color-on-scrim` now resolves to the accent and `--ds-color-on-scrim-accent` is gone along with the text-stroke. Two theme-invariant colours again rather than three. A role that exists for a treatment nobody uses any more is the inventory the restraint claim is about.

**A test that asserted a failure had to be replaced, and the lesson is in the shape.** `cannot use the accent as the title fill, which is why it is a stroke` was correct when written and became false six hours later, because the thing it asserted was a verdict rather than a relationship. What replaces it searches for the floor and asserts `PEAK >= floor`, so it stays true across palette changes and its failure message names the number needed. Watched failing at 0.84.

**The padding is in `em`, which is the answer to the actual complaint rather than a second set of numbers.** Three quarters of the title's own size for the inset and two and a quarter times it for the fade runway. That reproduces the bridge tile exactly as it was, 24px and 72px under its 32px role, and gives the featured tile 36px and 108px under its 48px role. The relationship is what was being expressed, so expressing it as a ratio means a type role change carries the scrim with it and there is no second edit to forget.

**The cost is real and is worth naming.** At 90% the top band of every thumbnail is nearly gone, which is the objection the whole line of work started from when the scrim was opaque. The difference is that this veil ends: it is a band rather than a floor, it fades to nothing before the middle of the frame, and the subject of every thumbnail in the grid sits below it. That is a judgement rather than a measurement and it belongs to Leonid, who has now looked at it rendered three times.

72 unit, 137 export, 0 skipped, typecheck clean, build green at four routes.

## 2026-08-05 — The craft layer, and the reader it was missing

Leonid opened the session with a fear rather than a task: applying as a UX/UI designer, and the site "looks so default, so simple. There is nothing special to it."

**The instinct was right and the diagnosis was not, which decided the whole pass.** The site is not failing because it is too simple. Restraint is a legitimate posture and this one is well argued. It was failing because **restraint only reads as a choice when something on the page shows the range being withheld**, and there was no moment of craft anywhere to measure it against. Measured at 1440x900 before any change: the type ramp ran 48px to 16px, a 3:1 range, with exactly one element on Home using the top of it; `measure` sat flush left inside a centred `frame`, leaving a 447px empty stripe down the right of every hero line, 47% of the fold carrying nothing; the dark card surface measured **1.05:1** against the page and light **1.12:1**, so nothing sat on a second plane; and the page ended on the last project card with no footer and no call to action anywhere on the site.

**The fork was put to Leonid rather than assumed, because it contradicts CONTEXT.md.** The site is built to win a Track C reader: title tag "Design Engineer", Design System second in the nav, a hero thesis about deciding before building. That is not what survives a UX/UI screen, where someone spends 40 seconds looking for evidence of an eye. **Retargeting the front door to Track B was offered and rejected**; Leonid chose to hold Track C and add the craft layer under it. Nothing in CONTEXT.md is reversed and no ADR is owed.

**Fraunces and Archivo, replacing Source Serif 4 and Inter.** Not because the old pair was bad but because it was *the* pair: two of the most-used families on the web, read first by exactly the person being applied to. `opsz` is requested on Fraunces and nothing else is, which is the whole reason for a variable face here: CSS defaults `font-optical-sizing` to auto, so the hero at 88px gets the high-contrast cut and `subheading` at 20px gets the sturdy one, with nothing at the call site. **WONK and SOFT were rejected at their defaults on purpose** — they are what make Fraunces quirky and the copy on this site is dry.

**A `hero` role, because `display` had two jobs and they stopped agreeing.** `display` is the featured tile's title, sized so 2rem of serif does not read as a caption on a 610px image, and it is correct at that. The home h1 wants roughly twice that. **Fluid rather than the `title` -> `display` breakpoint swap it had**, which put a visible 16px jump at `sm` in the middle of the largest thing on the site. The clamp is bounded by two Primitives, so the range steps along the same ramp as everything else. Style Dictionary carries `clamp()` through with `outputReferences` intact, which was checked rather than assumed.

**The headline takes the frame; only the reading is held to `measure`.** That is the distinction the two widths were split for. A paragraph has a width past which it stops being readable and a headline is not a paragraph. The empty stripe is gone and `mx-auto` stayed off, so the page still has one left edge.

**Two controls, and the filled one is `text-bg` rather than a white.** Gold is dark in light mode and light in dark mode, so the label has to move in the opposite direction, which is exactly what `bg` does for free: **4.54:1 light, 6.87:1 dark**, both measured and both now in CONTRAST_PAIRS. It is the tightest pair in the table, which is why it is listed rather than eyeballed.

**Filling the project card broke an AA pair, and the green moved rather than the constraint.** With the card filled, the lens chips went from sitting on `bg` to sitting on a panel, and `capability` measured **3.83:1** on the new light surface. The old note in design-system.ts said to add that pair the moment something rendered it, so it is a listed pair now and the light green is one step darker, `#49851d` to `#3d6f18`, clearing on both. **The surface value itself was chosen against a guard, not by eye**: one step lighter in dark measured 4.34:1 for `muted` on `surface` and was rejected, so dark landed on `#2e2b27` at 1.24:1 elevation and light on `#f0ece6` at 1.18:1.

**`border-interactive` on `surface` is still under 3:1 and the constraint survived rather than being waived.** The card's border has the page on its outer side, which is the adjacency SC 1.4.11 is about, and nothing inside the card is a control: the one link is on the scrim over the thumbnail and the lens chips are list items.

**An `shadow` family, deliberately not theme-varying.** One light source in both themes; what changes is how much of it you can see. Over white the shadow is the elevation, over near-black the raised fill has taken that job and the shadow costs nothing by still being there. **A `shadow.dark.json` was rejected**: it would need the dark platform's filter to stop being about colour, and it would mint a second shadow whose job is to be invisible.

**A section opener, which is the one piece of pure visual craft in the pass.** A rule and an optional index. The number is rendered where there is a sequence, which is a case study or /design-system, and omitted on Home and on Contact, where labelling a list of one promises a second entry that never arrives. `mt-section` moved onto the component so the rule and the space above it cannot come apart.

**A footer, because Home ended on the last card.** Not a second copy of ContactLinks: same four links, no heading, so nothing enters the document outline on every route.

**"Space, type and radius" became "The families under colour".** Elevation made it a heading that listed three of four, and a heading that enumerates its contents has to be edited every time they change. On this page that is the whole argument.

**One claim in this pass was wrong and is recorded as wrong.** The Rollhaus cover was reported as carrying its own wordmark under the overlay title. It does not; the source has no wordmark, and the first reading mistook the overlay for artwork. The real defect is the one the tile's own comment already names: the title lands beside the screenshot's embedded "Select Your Skates" and the two read as one row of unrelated words. **No `object-position` fixes it** on a source that is already exactly 16:10, so it is an asset problem rather than a CSS one. GlyphsHero is the same class of problem measured differently: a 340x340 source upscaled into a ~470px 16:10 tile, which renders soft. Both need purpose-made covers and both are Leonid's call.

76 unit, typecheck clean, build green at four routes.

---

## 2026-08-05: the figure pass is specced, and five Figma calls that should not have been spent

Leonid reviewed the live site and gave six findings, all on Rollhaus except the
first: the card image vanishes on navigation; the editor comparison shows two
states that are "mainly the same"; section 04 is a screenshot of text; section 06
tries to show the mechanism and does not work; section 08's before state goes and
the after state becomes the visual language of the case study; the prototype
should be embedded or at least mentioned. Design in
`docs/superpowers/specs/2026-08-05-case-study-visual-pass-design.md`.

**Five Figma MCP calls were spent unprompted, and the free tier holds about six.**
`whoami`, two `get_metadata`, two `get_variable_defs`, all to source figures
Leonid could have pointed at in a sentence, and he did: the exports were already
in the sibling repo's `assets/` folder, or arrived there within the hour once
asked. Everything those calls returned is transcribed into the spec so it never
needs repeating, and the rule is now in the session memory. The cheap substitutes
that should have been reached for first: `assets/` and `source/` in the sibling
repo, PyMuPDF for crops, and `curl figma.com/api/oembed?url=...` for whether a
link is publicly shared, which is free and answers a question the MCP does not.

**The prototype link Leonid first supplied was not public**, which oEmbed caught
before it shipped: 404 against a 200 for the FerMentor link already live on the
site. He changed the share setting and it now returns 200. Worth keeping as a
check on any outward link, because a permission wall is invisible to the person
who owns the file.

**`Variable.png` turned out to be the strongest artifact in the case study**, and
Leonid offered it with "though I dont know how usefull that is". It shows eleven
variable collections scoped by domain, and the Wheels collection expanded with
its modes as columns: Default, Yellow, Green, Water blue, Blue, Orange, Black.
Each mode carries `WheelColor`, `WheelType` and `WheelPrice` together, so Green
gives Green, Outdoor, 26 and Black gives Black, Outdoor, 17. That is the record's
own sentence, "one mode switch reconfigures several linked elements at once",
proven in one image. It is also the only evidence anywhere for modes, which the
page has until now asserted and never shown.

**`Test Radio Buttons` and two empty collections stay in the crop.** They
corroborate the footnote the page already ships, that this was a first variables
project and the naming is ad hoc. Cropping them out would be tidying the
evidence.

**The slot photo was cut after four rejected crops.** Cart, Checkout and
Confirmation sit at different heights with dead canvas between them, so every box
tight enough to be legible clipped one of the three. Boxes tried and rejected:
`[0.4290, 0.655, 0.9450, 0.980]` (carries the red annotation and its caption),
`[0.4345, 0.6640, 0.9395, 0.9230]` (red sliver at the top, suggestion cards cut
mid-card), `[0.4425, 0.6660, 0.9220, 0.8600]` (first product image clipped at the
left edge), and a panels-only band at roughly 7:1 that rendered the summary type
too small to read. The slot argument moves whole into the rewritten embed, which
is where a mechanism belongs. Fighting a crop that hard was the signal.

**Two-up progression steps were specced and then reversed by arithmetic.** At the
two-column `sizes` hint each 1400x994 screenshot lands near 470px wide, which
puts "Select Your Pattern" at about 5px tall. The panel changing is half of what
the figure is for. Full width costs roughly 2,200px of page height and was taken
deliberately.

**A number given to Leonid mid-session was wrong and is corrected in the spec.**
He was told the page would not get shorter, which was a guess. Worked through, the
retirements save about 4,100px and the additions cost about 4,800px, so the page
grows by roughly 1,400px rather than holding level. Under two-up steps it would
have been a net saving of about 800px, which is the version that was rejected.

**Section 09 loses its figure entirely**, confirmed by Leonid rather than assumed,
because it is the most aggressive cut in the pass. The reworked panel is what
every screenshot from section 02 onward already shows. This also retires the open
provenance caveat against `rollhaus-panel-before.jpg`, that nothing in the
sources proves it is the screen the 18 Maze participants clicked.

**Card to page continuity ships as CSS cross-document view transitions**, which
means project cards become plain `<a>` and lose Next's client-side routing on
those links. `unstable_ViewTransition` would have kept routing and was rejected:
an experimental API on the site's flagship interaction, on a site arguing its
choices are durable.

**The price reads 124 EUR in all four progression states.** The selections happen
to be price-neutral, so no caption may claim the price ticks up. Recorded because
it is the obvious thing to write and it would be false.

**`rollhaus_editor_02.png` in the sibling repo was overwritten** by the new Skates
export; it used to be the inline-selected state. `rollhaus-editor-inline.jpg` can
no longer be regenerated from its recorded source. The figure retires in this
pass so nothing breaks, but the entry comes out rather than sitting in
`extract-figures.py` describing a crop that would now produce a different
picture.

## 2026-08-05: impeccable is installed, and a fifth doc that had to earn its place

Leonid asked for the skills from `impeccable.style`. `/plugin marketplace add
pbakaus/impeccable` is the documented route for Claude Code and is unavailable in
this harness, so the install went through `npx impeccable install`, which the site
lists first anyway because it compiles a build for the detected harness rather
than one shared build.

**The installer detected eight harnesses and installed into two, and one of them
was wrong.** It wrote 148 files into `.claude` and a second full copy, 152 files,
into `.github/agents`, `.github/hooks` and `.github/skills` for GitHub Copilot.
Nothing in this repo uses Copilot and `.github` tracks exactly one file,
`workflows/deploy.yml`. **The Copilot copy was removed** rather than left in place
against a someday, and removing it is what later made the pointer-over-copy
argument work: Claude Code is now the only thing that reads any of this.

**The skill itself is gitignored rather than committed.** 148 vendored files,
reinstallable with one command, in a public repo whose diffs are themselves
case-study material. The hooks landed in `.claude/settings.local.json`, which was
already gitignored, so the detector is machine-local: a fresh clone gets neither
the hooks nor the skill until someone reruns the installer. Stated because it is
the kind of thing that gets discovered later as a bug.

**`init` needed three questions and one of the answers came back impossible.** The
repo answered platform, stack, accessibility floor, voice and positioning on its
own, so nothing already written down was asked again. The evidence question came
back with `None of these exist` selected together with all three things that would
exist. **The safe-looking reading would have written a falsehood into the record**:
the Rollhaus prototype has been live and linked at `projects.ts:175` for days, so
"no live URLs" was never true. It was put back to Leonid instead of resolved by
picking the cautious option, which is the whole point of guardrail 1 being about
accuracy rather than about modesty. Resolved: prototype, store page, repo and
press kit are real; **metrics and testimonials do not exist**, which is what the
shipped Rollhaus copy already says at `projects.ts:395`.

**The first PRODUCT.md was 98 lines and about half of it was other files.**
Terminology, Tile Schema, Lenses, the three ADR constraints, the CLAUDE.md
guardrails, all copied in. The reasoning was that impeccable resolves PRODUCT.md
by path and loads nothing else, so facts living only in CONTEXT.md would be
invisible to it. **That was wrong for this setup and Leonid caught it in one
question.** CLAUDE.md is auto-loaded every session and already points at
CONTEXT.md and the ADRs, so a pointer reaches those facts as well as a copy does,
and a copy is a second place to update when a Lens gets renamed. He applied the
site's own anti-brand constraint to the repo, which is the correct reading of it:
a fifth document that restates four others is clutter by exactly the rule the
site is built on.

**What survived is what nothing else holds:** the reader's situation, the Track C
decision with its date, the current milestone, the confirmation that runtime
dependencies are *not* restricted, and Evidence on Hand. That last section is the
one that justifies the file existing at all. Nothing in the repo previously stated
in one place what proof exists and what must never be invented; the pieces were
spread across a Rollhaus paragraph, a link 220 lines away, and a CLAUDE.md
guardrail. 618 words now.

**Worth knowing before reaching for impeccable again:** only new-surface and
redesign flows block on PRODUCT.md. `polish`, `critique`, `audit`, `typeset`,
`layout`, `clarify`, `adapt` and `optimize` read the existing code as authority
and run without it. So the file's payoff is the v2 Router and the meta case study,
not the day-to-day.

**A small process cost, recorded because it will happen again.** `git add -N`
records intent to add and no blob, so overwriting the first PRODUCT.md left
nothing to diff the trim against. The original exists only in the session
transcript. Staging content, not intent, is what makes a draft recoverable.

**CONTEXT.md had drifted in four places and was missing a term.** Home is hero
plus the grid rather than hero plus a Rollhaus card; `/projects/[slug]` is four
records rather than one; the Tile Schema is no longer a v2 standard waiting for a
grid, because tiles have rendered on Home since 2026-07-30; and the Constraints callout listed
as pending polish has been a `constraints` section kind on both featured case
studies for days. **`Tier` is now defined**, since `featured`/`bridge`/`archive`
has been live vocabulary in `types.ts` and the grid without ever being in the
glossary. `Hero Case Study` is kept as a definition rather than deleted, because
earlier log entries and plans use the phrase and an orphaned term is worse than a
superseded one.

The deferral of the `/projects` listing was recorded with the reason "a list of
one is just a link". That reason expired at four records, so the deferral is
restated on the Router rather than left resting on a fact that stopped being true.

No source files changed in this pass. 76 unit, typecheck clean, run to confirm
the baseline rather than because anything here could have moved it. `21591a3`
landed from another session while this one was open; it is docs-only and does not
touch anything above.

**Two dates in this entry were wrong on the first write and are corrected here
rather than quietly.** The grid was dated 2026-08-04 and the Tier supersession
2026-08-05; git says tiles have rendered since `098c549` on 2026-07-30 and
FerMentor shipped in `42f5bc9` on 2026-08-02. Both came from reading the log's
recent entries instead of asking git, on a day whose own entries are about not
trusting a plausible-looking claim.

## 2026-08-05: the figure pass ships, and the guard that matched its own comment

The plan in `docs/superpowers/plans/2026-08-05-case-study-visual-pass.md` executed
in eight commits, `abe766e` through `a0d00b8`. Typecheck clean, 76 unit, 154
export. What follows is only what the plan did not already predict.

**Rendered result.** The Rollhaus page is 12,819px, against 10,216px before. The
plan estimated growth of about 1,300px and the real figure is 2,600. The whole
difference is section 2: four full-width 546px screenshots plus their labels come
to 2,647px on their own. That is the cost the one-step-per-row decision was
knowingly taking, and it is worth more than the estimate was: at 768px the panel
headings and the option thumbnails are legible, and the two-up version this
replaced would have put them at 350px where they are not. The page is longer and
the ratio it was failing on has inverted, which was the point.

**The morph fires.** Verified at runtime rather than inferred: the `pageswap`
event on the home document reports `viewTransition` non-null on a click through
to `/projects/rollhaus/`, and the browser parses the at-rule as a real
`CSSViewTransitionRule` with `navigation: auto` nested inside
`(prefers-reduced-motion: no-preference)`. **Lightning CSS did not strip
`@view-transition`,** so the `public/view-transition.css` fallback the plan
carried was not needed. That is now a known-good data point for any future
at-rule in this repo.

**The guard that matched its own comment.** `view-transition.test.ts` asserts the
tile does not import `next/link`, because a client-side route change would make
the morph silently never happen. Written as a substring search it failed against
the comment in `project-tile.tsx` that *explains* why the anchor is plain, which
says the words "next/link". Narrowed to `/from\s+['"]next\/link['"]/`. A source
guard has to match the construct rather than the vocabulary, or the file cannot
document its own reason.

**Three claims the images did not support**, all caught by looking at the written
crops rather than by any test:

- The thumb was re-sourced from the wheels step, so its alt still described "a
  panel of skate-type options" from the retired quad export. Re-alted with the
  crop.
- The atoms alt said "eight patterns each drawn as a high top and a low shoe".
  Row three pairs a striped high top with a plain tan low shoe, so it is two
  columns of eight rather than eight matched pairs. Reworded.
- The variables caption said "eleven collections, each scoped to what it drives".
  Two of the eleven are unnamed and empty. Now "nine of them named for what they
  drive", which is also the honest version of the same argument.

**Two things the plan got wrong by arithmetic.** `rollhaus-variables.png` writes
at 1600x385, not the predicted 386: the zoom lands a fraction under a whole pixel
and PyMuPDF floors it. And `rollhaus-debug.png` at clip bottom 0.2620 cut through
the tops of the next row of labels, which no test could see; tightened to 0.2600
and re-rendered at 1701x288.

**One duplication the plan wrote in.** It gave the embed section the heading
"One card, four screens" and the figure inside it the title "One card, four
screens", which renders the same phrase twice about forty pixels apart. The
section heading is the spec's and stays; the figure is now titled "Rollhaus Base
Card and its slots", after what it depicts, which is how the figure it replaced
was named.

**Open, not fixed here.** The prototype facade's label sits on a 90% scrim over
the poster, and the poster's own ADD TO CART button reads through it. It is
legible and it is a button, but at rest it reads more like a caption baked into a
screenshot than like a control. Worth a look before this is called done.

**Also open and pre-existing:** the header nav still uses `next/link`, so every
page load 404s on `/about/__next.about.__PAGE__.txt` and the design-system
equivalent. Static export emits no RSC payloads for prefetch to find. Unrelated
to this pass, visible in the console on every page.

## 2026-08-05: the 2x2, and the two tens

Two notes from Leonid on the pass above, one layout and one defect.

**The four editor states are a 2x2 now, with the notes collected underneath.**
What shipped this morning put one step per row at the full reading width, and
the comment in `sections.tsx` argued for it: halving the width puts the editor's
panel heading under 5px tall, and the panel changing is half of what the figure
is about. That cost is real and it is still paid. It stopped being the deciding
one on the rendered page. A paragraph between every pair of screenshots meant
four near-identical states were compared from memory, which is the exact failure
that made `comparison` a separate kind in the first place. Contiguous, the mount
appearing in step 3 and the wheels turning in step 4 are one glance apart.

The notes moved out from between the images rather than staying with them,
because a caption per cell puts a text band back between row one and row two and
gives half the separation back. Reading order maps them: 1 and 2 above 3 and 4.
One `<ol>` carries the sequence and the images sit in a plain grid, rather than
two lists numbering the same four things.

**The title scrolled over the nav, and the same bug was quietly worse on Home.**
Both scrim titles carry `z-10` so they paint above the image they share a grid
cell with. Neither box was a stacking context, so both z-indexes resolved
against the root, where the sticky header's own `z-10` lives. Two tens tie and
the later element in the document wins, and the header is first.

On a project page that is the reported symptom: the `<h1>` slides over the bar.
On Home it also takes the clicks, because the card link's `::after` covers the
whole card and lives inside the title's stacking context, so a strip of the
header navigated to whichever project was passing underneath it. Nobody had
noticed, and nothing in the suite could.

Fixed with `isolate` on both media containers rather than by promoting the
header to `z-20`. Promoting it treats the collision as a ranking problem and
leaves the next overlay to discover the same tie; isolating says what is
actually true, which is that a title above its own thumbnail is a claim about
two elements in one box and was never about the page. The header is now the only
z-index in the document that means anything globally.

Rejected on the way: nothing. The one thing worth recording is what made the fix
safe to make. `isolation` changes paint order and not the containing block, so
the card's `::after` still resolves against the `<article>` and still covers the
whole card. That was checked in the browser before it was written, because the
click target is load-bearing and the failure would have been invisible.

**A guard for the half that is invisible.** `tests/export/stacking.test.ts`
asserts the header carries `sticky` and a z-index, that every other z-index in
the document sits on a scrim title, and that there is at least one `isolate` box
per layered element. Paint order is a property of the browser, not of the
markup, so what a static export test can hold is the invariant that produced it:
one global layer, everything else sealed.

**One test needed narrowing, for the reason the `next/link` guard did.**
`figures.test.ts` proved the progression's steps stay in order by looking for
each step's *label* in the page. With the notes below the grid, three of the four
labels now match earlier inside the alt text of the images above ("Select Your
Pattern active"), so the case was passing or failing on which occurrence the
string happened to hit first. It asserts on the image sources and on the notes
instead, which are unique, and it asserts both because a grid that reflowed and
a list that reordered are different bugs and only one of them is visible.

## 2026-08-06: FerMentor gets the same pass, and two claims that had been asserting themselves

The Rollhaus figure pass ran on 2026-08-05. FerMentor was the same job on a
different project, and it started worse: 12 sections, 20 prose paragraphs, four
real product screenshots, one ported diagram, and a 1101x2811 picture of text.
The Rollhaus spec opened by calling 17 paragraphs against 6 images an inverted
ratio. This page was further out on both terms. It is 16 sections now, with a
four state progression, a prototype, six new figures and no new section kind.

**Nothing needed a new `Section` arm, which is the part worth noticing.**
`progression` and `prototype` were built for Rollhaus a day earlier and both took
a second project without a model change. The four `never` switches never fired.
What did have to change is everything those two kinds had quietly hardcoded.

**The facade named a roller skate twice, in the component.** `title="The Rollhaus
prototype, running in Figma"` and a button reading "Load the prototype and
configure a skate" were literals inside `PrototypeEmbed`. A second prototype
would have offered a FerMentor reader a skate to configure and announced itself
to a screen reader as the wrong project. Both are on the content record now,
because a button label and an iframe's accessible name are copy, and inside a
component neither was reachable by any rule in `content.test.ts`. The iframe's
`aspect-[16/10]` was the same mistake in a third place: it carried a comment
promising the page would not jump when the iframe arrived, which was true for
exactly as long as one project shipped a prototype. It reads the poster's own
ratio now.

**And the guard named one page.** The prototype facade block asserted against
`out/projects/rollhaus/index.html` and the string `rollhaus-editor-wheels.jpg`,
so FerMentor's prototype would have shipped completely unguarded while the suite
stayed green. This is the registration failure that retired the hand-written
`FIGURE_COPY` array and the parallel `comparison` describe block, arriving a
third time. It walks every `prototype` section now, the way the `embed` block
directly above it already walked every embed. **It also stopped matching a
prefix.** The old assertion looked for `figma.com/proto/`, which stays green when
a page links the wrong project's file; it asserts the whole `href` through
`text()` now, proved by swapping the file key in the built HTML and watching only
the new case fail.

**A mobile prototype is not a desktop one, and the difference is a layout
decision the data can make.** Across the 48rem column a phone poster renders at
about twice life size, and Figma then letterboxes the prototype inside that box
down to roughly a fifth of it. The renderer caps the facade at 22rem when the
poster is portrait, which is the width the `comparison` renderer already gives
every phone screenshot on this site, so the prototype sits at the same size as
the figures around it. **Rejected: an `aspect` field on the content record.**
Whether a prototype is phone-shaped is visible in the poster it already carries,
and a second field that has to agree with the first is a second thing to get
wrong.

**The four flow states share one crop box, and the box was found rather than
guessed.** `get_drawings` on the Screens canvas returns every phone frame at
exactly 390x844pt, in four bands, so the four states are one box at four offsets
and every one of them wrote at an identical 701x1516. Any difference between the
images is a difference in the product.

**Step 1 is the notification, and that was a choice against the literal
instruction.** The Outcome prose called the first beat "the cold open and
install", and the cold-open row holds seven screens: a home screen with the app
installed, a splash frame, and five lock screens. An app icon on an iOS
springboard is the same picture for every app ever shipped, and a splash frame is
a logo. The one screen where FerMentor does anything is the lock screen carrying
"Your Cauliflower should be ready for preservation", which the app worked out
from the stage model. **Rejected: the home screen and the splash**, boxes
recorded so the literal reading is one line away if Leonid wants it.

**The dashboard step is column 1, not column 2.** Column 2 is already on this
page as the early half of the dashboard pair, and the same picture twice on one
page reads as a mistake rather than as a callback. The cost is that the
progression's dashboard shows two batches where the pair below shows three, which
is a different moment in the demo data and not a contradiction. The caption
carries the load instead: "Not four taps in one sitting." **The alternative was
column 3**, which follows the notification perfectly and is the other half of
that same pair.

**The Outcome section lost the sentence that listed the four states.** With the
progression at position 2, that sentence was a list standing in for a picture
eleven sections above it. This is the Rollhaus finding repeating from the other
side: the option tree retired there because the prose already enumerated it, and
here the prose retired because the figure now shows it. Outcome is one paragraph
and still has substance, which is the CONTEXT.md rule for whether a section
exists at all.

**Two sections had been asserting things the sibling repo could prove.**
`Molecule.pdf` and `Organism.pdf` had never been opened by
`extract-figures.py`, and between them they hold the two claims this page had
been making since 2026-08-02 with nothing behind them.

- **The appearance-first rule** is the sharpest research consequence in the
  project, and the page showed only its first rung. The organism canvas holds the
  rest as built states: the smell prompt, which is the one that says "carefully
  open the jar" and which is drawn at the highest attention level in the set,
  then taste, then both verdicts including "this batch is irrecoverable". The
  styling carries the ordering rule without the caption having to assert it.
- **The four level feedback stack** is now shown, and the caption deliberately
  does **not** map its four rows onto the four jobs the paragraph above names.
  Those jobs come from graduation slide 19 and describe the message cards;
  `fermentor_source_of_truth.md` lists them as green success, amber
  informational, orange prompt for input, red assessment. What the crop shows is
  the same four levels applied to a dashboard row. The tidy 1:1 was the obvious
  caption and it would have been wrong on inspection, which is the same class of
  error as the three over-claiming alts caught on Rollhaus.

**Both captions say "as the component library holds it".** Nothing in the sources
proves the prototype wires every state in the ladder, and a caption under a crop
of built components implies it does unless it says otherwise. Guardrail 1.

**Two placeholder defects ship, recorded rather than hidden.** The Maturing stage
reads "Maturing description here" in the capstone file, and the Ready screen's
step counter reads 3/5 with all five complete while its batch info still says
Status Activation. Both are in the source, both are visible in the shipped crops,
and neither is quoted in the alt text, which names the stages instead. They are
`open` notes on the figure entries, so a clean re-export fixes them rather than
the next reader finding them.

**The three framings screenshot is retired, and Leonid took the call the same
day.** The comment on that record defended it deliberately, so the alternative
was built on `figure/framings-alternative` and put to him rendered rather than
described. It transcribes the three options and their reasoning verbatim, second
person and all, into an `embed` on this site's own tokens. What decided it was
measurement rather than argument:

- In dark theme the current figure is a **768x1950 pure white slab** at
  rgb(255,255,255) against a page at rgb(24,26,27). It is the only element on
  this site that ignores the theme toggle.
- At a 390px viewport it renders **327px wide**, which puts the board's body type
  at roughly **8px** against the site's own 14px at that width.
- It carries **three em-dashes**, in a project that bans them in copy. The copy
  guard cannot see them, because they are pixels.
- A screen reader gets **one alt string** standing in for about 250 words of
  argument, and that argument is the whole reason the section exists.

Against all that, the screenshot was the only thing on the page that showed the
research board as an artifact, and the second-person voice was visible evidence
of the AI drafting rather than a claim about it. **That is what the trade cost,
and it is the reason the decision was put to Leonid rather than taken here.** The
disclosure survives as a footnote at the point of the evidence, which states the
same thing instead of showing it.

**`public/figures/fermentor-framings.png` is now referenced by nothing** and is
left on disk in this pass rather than deleted in the same breath as the merge.
Retiring an asset is its own decision, the Rollhaus retirements each got one, and
the entry in `extract-figures.py` is what makes the crop reproducible if the call
ever reverses.

**Still open.** The facade's label sits on a 90% scrim across the bottom of the
poster and at rest reads more like a caption baked into a screenshot than like a
control. That was logged as open on 2026-08-05 and is now on two pages rather
than one. FerMentor's poster has empty cream space under the stage stack, so it
reads better there than on Rollhaus, which is why it was left alone in this pass
rather than redesigned in passing.

Typecheck clean, 76 unit, 202 export, up from 168. Checked in a browser at 1280
in both themes and at 390, where the page does not scroll horizontally.
