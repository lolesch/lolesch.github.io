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
