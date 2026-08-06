import type { Project } from './types';

/**
 * FerMentor, authored 2026-08-02 to the design in
 * `docs/superpowers/specs/2026-08-02-fermentor-case-study-design.md`.
 *
 * Written before its images existed and held outside the array for a day, on
 * the rule that a required thumb cannot be filled with invented dimensions.
 * Landed the same day once Leonid exported the Figma canvases; every crop is
 * recorded in `scripts/extract-figures.py` with the reason for its framing.
 *
 * Declared here rather than inline because it is long enough that the array
 * below stops being readable as an ordering when it is pasted into it.
 *
 * Sources: `job-search/portfolio/projects/fermentor/fermentor_source_of_truth.md`,
 * which wins on any disagreement, plus the four facts Leonid resolved on
 * 2026-08-02 and the 5 week span he confirmed on 2026-08-03.
 */
const fermentor: Project = {
  slug: 'fermentor',
  title: 'FerMentor',
  year: '2026',
  // Leonid's wording, 2026-08-02. Leads with what he owned and puts the shared
  // part where it belongs, as the qualifier. The course label it does not carry
  // is carried by the Constraints callout below, per guardrail 5.
  context: 'Solo, after shared research',
  role: 'Research, framing, product design',
  lenses: ['UX/UI', 'Systems & Architecture'],
  tier: 'featured',
  // Shortened 2026-08-04. A card is a hook, and every summary on the grid ran
  // to three lines: the first clause names the decision, which is what
  // `Project.summary` is specified to do, and the clause after it is the payoff,
  // which is what the case study is for. The jar-opening consequence is still on
  // the detail page, in `problem`.
  summary:
    'A fermentation app built on a model that predicts what a batch should look like right now.',
  // Three batch-detail screens rather than the dashboard group, framed to 16:10
  // in `scripts/extract-figures.py` for the reason the Rollhaus thumb is. A
  // dashboard reads as any list app. This carries SHOW ME, the overdue banner
  // and the Ready state, which is what the summary above claims the product is.
  thumb: {
    src: '/figures/fermentor-thumb.png',
    alt: 'Three phone screens side by side on a dark canvas. The first tracks a Kimchi batch through five steps with a SHOW ME button on the step in progress, the second shows a Cauliflower batch under a red "Maturing overtime, action required" banner, and the third has reached Ready with buttons to keep maturing or store.',
    width: 1121,
    height: 700,
  },
  problem:
    'Fermentation beginners cannot tell whether what they are seeing is normal, and opening the jar to find out is the thing most likely to ruin it.',
  whatIDid:
    'Reframed a confidence problem into a state and timing problem, then built the product on a stage model carrying the observable signals for each stage. The screens run on a Figma variable system.',
  // The no-testing limitation is stated here, once, and the Outcome section
  // deliberately does not restate it. Same call as how-to-god below: the detail
  // page renders these three lines in a <dl> above the sections, so a section
  // repeating one is the apology loop, tone tell #10.
  whatChanged:
    'A clickable full flow, built on a model that answers what this should look like right now instead of listing steps. No usability testing: the capstone ran out of time.',
  sections: [
    {
      kind: 'constraints',
      heading: 'Constraints',
      items: [
        { label: 'Duration', value: '5 weeks, SPICED capstone, to May 2026' },
        { label: 'Team', value: 'Shared research with Leith Gow, then two separate products' },
        { label: 'Platform', value: 'Mobile, iOS' },
        { label: 'Tools', value: 'Figma variables and components, FigJam for research' },
      ],
    },
    {
      // Added 2026-08-06, in the position the Rollhaus editor progression
      // occupies: the product first, the reasoning that produced it after. The
      // Outcome section used to carry these four states as a sentence, which is
      // a list standing in for a picture on a page that had one product
      // screenshot before section 8.
      //
      // One crop box at four offsets. Every phone frame on the Screens canvas
      // is exactly 390x844pt, so any difference between these images is a
      // difference in the product rather than in the framing.
      kind: 'progression',
      heading: 'The flow',
      caption:
        'Four points in the flow, in the order you meet them. Not four taps in one sitting: the app is the thing that decides when to speak, so the first screen arrives before the user has thought to check. Everything after it runs off the stage model rather than a step list, which is why the batch screen can put one control on the stage in progress and leave the other four quiet.',
      steps: [
        {
          label: 'The notification',
          note: 'Sent because the model put the Cauliflower at the end of its window, not because anyone set a reminder.',
          src: '/figures/fermentor-flow-notice.jpg',
          alt: 'An iPhone lock screen reading 19:41, Tuesday 20 May, carrying one notification from FerMentor: "Time to check your ferments. Your Cauliflower should be ready for preservation", sent 2 minutes ago.',
          width: 701,
          height: 1516,
        },
        {
          label: 'The dashboard',
          note: 'Next actions with their countdowns, above the batches in progress. The list is ordered by what needs something soonest.',
          src: '/figures/fermentor-flow-dashboard.png',
          alt: 'The FerMentor dashboard. Under NEXT ACTION, "Cauliflower preservation in 2d" with an orange warning triangle and "Observe your Carrots in 6d" with an amber dot. Under MY BATCHES, cards for Carrots and Cauliflower, each with an estimated end date and a progress bar. A tab bar carries Actions, Dashboard, New Batch and Settings.',
          width: 701,
          height: 1516,
        },
        {
          label: 'One batch',
          note: 'Five stages, one of them in progress, and SHOW ME on that one alone.',
          src: '/figures/fermentor-flow-batch.png',
          alt: 'A batch screen headed Kimchi. Cards along the top give the status as Activation, an estimated end of May 29, and three 500 ml jars at 3% salt. Below them five stages: Preparation complete, Activation in progress under the description "Active microbial culture growth" and carrying a SHOW ME button, then Stabilizing, Maturing and Ready still waiting.',
          width: 701,
          height: 1516,
        },
        {
          label: 'The way out',
          note: 'Storing it and leaving it to mature longer are both reasonable, so the screen asks rather than picking one.',
          src: '/figures/fermentor-flow-ready.png',
          alt: 'The same screen for a Cauliflower batch, with Preparation, Activation, Stabilizing and Maturing all checked off. The last card reads "Ready. Fermentation complete, time to taste!" above two buttons, KEEP MATURING and STORE.',
          width: 701,
          height: 1516,
        },
      ],
    },
    {
      // Promoted 2026-08-06 from a `link` on the Outcome section, where the one
      // interactive thing in this case study was a line of blue text eleven
      // sections down. Poster is the batch screen from the step above, for the
      // reason the Rollhaus poster is its own progression's last step: a facade
      // should open on a screen the reader has already been shown.
      kind: 'prototype',
      heading: 'Try it',
      caption:
        'The whole flow, cold open to storage. Nothing loads from Figma until you press the button, and the prototype is a mobile one, so it runs at phone size rather than filling the column.',
      href: 'https://www.figma.com/proto/Pbd2s3zJgdo5q2d15lvqjE/Capstone_Design_Leonid?node-id=2110-8314&starting-point-node-id=2110%3A8314',
      embedSrc:
        'https://embed.figma.com/proto/Pbd2s3zJgdo5q2d15lvqjE/Capstone_Design_Leonid?node-id=2110-8314&starting-point-node-id=2110%3A8314&scaling=scale-down&content-scaling=fixed&embed-host=lolesch-github-io',
      action: 'Load the prototype and open a batch',
      title: 'The FerMentor prototype, running in Figma',
      poster: {
        src: '/figures/fermentor-flow-batch.png',
        alt: 'The FerMentor batch screen for a Kimchi batch, with the Activation stage in progress and a SHOW ME button on it.',
        width: 701,
        height: 1516,
      },
    },
    {
      kind: 'prose',
      heading: 'Context',
      body: [
        'Fermentation runs on its own. Bacteria and yeast break down what you give them in an anaerobic environment, and in the right conditions the process needs almost no intervention, so most of the work is waiting and knowing when to stop. That is what makes it a bad fit for a recipe. Temperature and the state of the culture move the timing, the end point is not a clock, and the reliable way to check is to open the jar, which is also the fastest way to contaminate it.',
        'The capstone did not start here. We took a time management app and then a gardening companion through idea evaluation, pain points and problem statements before dropping both, and the board records the arc as too broad, then similar but specific, then fermentation. It won on practical grounds: Leith had the experience and the equipment, and the process looked simple enough to model. The cons we wrote down at the time were that it might be too simple and might not have enough variables in it.',
        'Leith Gow and I ran the research together. Partway through it became clear the findings were pulling toward two different people. His was an experienced fermenter losing track across several batches at once. Mine was a beginner in the first month, who has no baseline to compare anything against. Rather than average them into one product we split there, and from that point the two designs share a research phase and nothing else.',
      ],
    },
    {
      kind: 'prose',
      heading: 'The reframe',
      body: [
        'The obvious framing is that beginners lack confidence. It is true, and it is not something you can build against, because a lack of confidence is a symptom. What I wrote on the research board is that ambiguous signals, high consequences and low expertise together produce it, which turns the question into which of those three a product can actually move.',
        // The second-person voice in the figure below ("evidenced in your
        // research") makes the AI drafting visible to anyone who reads it, so
        // the claim here is written to match rather than to survive the image.
        // Disclosure at the point of the claim, which is what guardrail 2
        // allows; a workflow narrative is what it bans.
        'So I put three candidate framings side by side, each with its reasoning written out, drafted with AI to pressure-test them rather than to settle them. The first put the cause in state and timing: users cannot reliably read where the process is or judge when to act. The second put it in invisible variables, temperature and microbial activity being hard to observe, which is why results resist prediction. The third put it in decision-making during execution: not knowing when to act, which signals to trust, or how to evaluate progress without risking the batch.',
        'The third is the most behaviourally precise and the second explains the most, but the first is the one that names something a product can change. You cannot make microbial activity visible to someone looking at a jar. You can make the state legible and the timing predictable. That is the framing that shipped: fermentation beginners need to know what to expect, because variable conditions and unclear progress make it hard to decide whether action is required or what that action should be.',
      ],
    },
    {
      // The reasoning paragraphs are still the point, which is the argument the
      // screenshot version of this section made for two years' worth of a
      // fortnight. What changed on 2026-08-06 is the medium, not the content:
      // the three options and their reasoning are transcribed verbatim, so
      // nothing is lost and the argument becomes readable on a phone, in the
      // dark theme, and to a screen reader that previously got one alt string
      // in place of 250 words.
      kind: 'embed',
      heading: 'The three framings, as they were written',
      caption:
        'The candidate framings from the research board, transcribed rather than screenshotted, second person and all. Option 1 became the shipped statement, on the argument in the paragraph above.',
      figure: 'fermentor-framings',
    },
    {
      kind: 'prose',
      heading: 'Who it is for',
      body: [
        'Lukas Weber, 32, a product designer who started fermenting vegetables a few months ago for a more balanced diet. He likes making things himself, he follows the general guidelines, and he is still in the phase of working out what the right timing and conditions are. His line on the persona card: "I know the steps, but I\'m never fully sure if now is the right moment to do something or just leave it."',
        'He is a proto persona, assembled from desk research and three interviews, two of those with experts rather than with beginners. That is a thinner evidence base than a researched persona and it is worth naming, because every decision downstream inherits it.',
        'What he needs is narrow enough to design against. An indication of the state his ferment is in. Guidance on what to expect at that state. Help deciding whether action is required at all. The damage is done by his own mental model, which is reasonable and which costs him batches: if he is not sure what is happening he waits, because intervening at the wrong moment might ruin it. Waiting is the safe move right up until it is not.',
      ],
    },
    {
      kind: 'embed',
      heading: 'What the product had to know',
      caption:
        'The stage model as it was written for the capstone, ported onto the tokens this site runs on, so it follows the theme.',
      figure: 'fermentor-stages',
    },
    {
      kind: 'prose',
      heading: 'From model to product',
      body: [
        'A model is only worth anything if the user meets it somewhere. In FerMentor that place is a single control on the batch detail screen, a SHOW ME button sitting on whichever step is currently in progress.',
        'It answers the question a step list cannot. Steps tell you where you are in a sequence. SHOW ME tells you what this stage should look like right now, for this batch and the conditions it was set up under, so the user compares instead of guessing. That is the difference between instruction and prediction, and it is most of the product in one control.',
        'The other half is the order you are allowed to check in. The research finding that intervening carries contamination risk has a design consequence that follows directly: assessment is ordered so the jar stays shut as long as possible. Appearance first. Smell and texture only if appearance was not enough. Opening is the last resort rather than the reflex, which is the inverse of what a beginner does when they are unsure.',
        'Logging follows the same rule. Structured choices per sensory category rather than a free text field, so what the user observed can be read against the model instead of only recorded next to it.',
      ],
    },
    {
      // Two halves of one exchange rather than two states of one screen, which
      // stretches the kind slightly and is still the right one: the claim lives
      // in the difference between them, and split across two sections a reader
      // compares from memory. What makes the pair work is the category column,
      // identical and in the same order on both sides.
      kind: 'comparison',
      heading: 'Predict, then report',
      caption:
        'The system commits to what this stage should look like before the user says what they see, and both sides speak in the same three categories in the same order. The observation here does not match the prediction, which is the case the product is actually for.',
      items: [
        {
          label: 'What the system expects',
          src: '/figures/fermentor-predict.png',
          alt: 'A card headed "What you should see", listing Brine as slightly cloudy, Surface as fine bubbles and Appearance as bright red, above an Adjust button and a Confirm button.',
          width: 801,
          height: 441,
        },
        {
          label: 'What the user reports',
          src: '/figures/fermentor-report.png',
          alt: 'A card headed "Enter your visual observation", reading "Before we enter the next stage, we need to assess the current state." The same three categories follow as dropdowns, set to opaque and settled, thin white film, and translucent, above a Confirm button.',
          width: 801,
          height: 539,
        },
      ],
    },
    {
      // Added 2026-08-06. The section above states the appearance-first rule and
      // then shows only its first rung, which left the most specific research
      // consequence in this project asserted and unillustrated. The crop starts
      // below the two cards the comparison already ships full size.
      //
      // "as the component library holds it" is doing real work in the caption:
      // these states are built, and nothing in the sources proves the prototype
      // wires all of them. Guardrail 1.
      kind: 'figure',
      heading: 'When appearance is not enough',
      caption:
        'The rest of the ladder, as the component library holds it. Smell only comes up when looking has not settled it, and the smell prompt is the one that says to open the jar, drawn at the highest attention level in the set. Taste comes after that. Both endings are built: the estimate updates and the batch moves on, or the batch is irrecoverable and the app says to discard it rather than leaving the user to work that out.',
      src: '/figures/fermentor-ladder.png',
      alt: 'Six cards in two columns. On the left, "You should do a smell test", reading "Carefully open the jar - observe the pressure buildup and the smell", with dropdowns for Pressure, Smell and Intensity set to None, Sour / tangy and Mild. Below it "You should taste it", with Texture and Taste set to Slightly softened and Tangy / sour. Below that a green card, "Great! Your ferment is doing well. Estimations are updated. We can enter the next stage", with a CONTINUE button. On the right, two matching processing cards, "Assessing fermentation smell" and "Assessing fermentation taste", each reading "This should take about a minute, hold tight", and at the bottom a red card, "Oh no! Something is off. From your data, this batch is irrecoverable. You should discard it!", with TRY AGAIN and DISCARD buttons.',
      width: 1401,
      height: 1248,
    },
    {
      kind: 'prose',
      heading: 'The system',
      body: [
        'The screens run on Figma variables rather than colour styles, so a change to a token updates everywhere that token is used. The component library is organised as an explicit hierarchy, from sub atomic through atomic, molecule, organism and template to the screens themselves, with one frame holding every component and every state laid out together.',
        'Two design principles in the deck are mine. Consistency, which is what the token system is for, and Clear State, which is the one that matters to this product specifically. If the premise is that a user cannot read the state of their ferment, then the interface cannot be vague about the state of anything. Feedback runs as a four level stack, each level with its own colour and icon and its own job: the batch is doing well, here is what you should be seeing, tell us what you observed, and this needs your attention.',
      ],
    },
    {
      // Added 2026-08-06, against a claim the page had made since 2026-08-02
      // with nothing behind it. The caption deliberately does not map these four
      // rows onto the four jobs named in the paragraph above: those are the
      // message cards, recorded in `fermentor_source_of_truth.md` from
      // graduation slide 19, and this is the same four levels applied to a
      // different component. Saying otherwise would be the kind of tidy 1:1 that
      // is wrong on inspection.
      kind: 'figure',
      heading: 'One component, four levels',
      caption:
        'The four levels on a dashboard row. Colour, icon and urgency move together, and the red state is the only one that stops counting down and says now. The message cards further up this page are the same four levels on a different component, which is the whole of what Clear State bought. The dashed boundary is Figma marking a component set: one component in four states, not four rows drawn four times.',
      src: '/figures/fermentor-feedback.png',
      alt: 'Four rows of one component, each on its own tint and carrying its own icon. A green row with a filled check, a cream row with an amber information dot and a pale orange row with an orange warning triangle, all three reading "Task Label" and "in 2d", then a pink row with a red diamond alert reading "Task Label" and "now". A dashed violet rectangle encloses all four.',
      width: 1201,
      height: 882,
    },
    {
      // The first paragraph used to enumerate the four states of the flow and
      // carry the prototype link. Both moved to the top of the page on
      // 2026-08-06, as a progression and a section of its own, and the sentence
      // that listed them came out rather than being left to restate a figure
      // eleven sections above it.
      kind: 'prose',
      heading: 'Outcome',
      body: [
        'The dashboard is where the model becomes visible without being explained. Each batch card carries a progress bar that moves through its range as the estimated end approaches and passes, and the next action list is sorted by what is closest to needing something. A batch that has gone past its window says so plainly rather than sitting quietly in a grid.',
      ],
    },
    {
      // The pair is dated by its own content: the two countdowns that are not
      // the subject move 6d to 4d and 11d to 9d, so the caption does not have
      // to assert how much time passed. Identical crop boxes, for the reason
      // the Rollhaus editor pair uses identical crops.
      kind: 'comparison',
      heading: 'The same three batches, two days apart',
      caption:
        'Nothing here was edited between the two. Time passing is the only input, and the interface goes from counting down to asking for something, while the Cauliflower bar runs past the end of its range.',
      items: [
        {
          label: 'Two days out',
          src: '/figures/fermentor-dash-early.png',
          alt: 'A dashboard headed Next Action, listing Cauliflower preservation in 2 days with a warning icon, Observe your Carrots in 6 days, and Kimchi taste test in 11 days. Below, under My Batches, cards for Kimchi, Carrots and Cauliflower each carry a progress bar still inside its green range.',
          width: 701,
          height: 1508,
        },
        {
          label: 'Two days later',
          src: '/figures/fermentor-dash-late.png',
          alt: 'The same dashboard with the top row replaced by Maturing overtime, act now, on a red band. The other two rows have counted down to 4 days and 9 days, and the Cauliflower progress bar has run past green into orange.',
          width: 701,
          height: 1511,
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'Learnings',
      body: [
        'The framing work was the most valuable part of the project and the cheapest to redo. Three problem statements with the reasoning written under each took an afternoon, and everything after it inherited that choice. I would spend that afternoon again on anything ambiguous.',
        'Splitting rather than averaging was right, and I would do it sooner. We spent time trying to serve an expert and a beginner with one product before admitting they wanted different things, and the products both got better the moment we stopped.',
        'A domain model is design work. Most of what makes FerMentor answerable is not on a screen at all, it is the list of stages and the signals attached to each one. I spent longer on that than on any interface, and the screens got simpler every time the model got sharper.',
      ],
    },
  ],
};

/**
 * The three schema lines on each record are frozen copy, reproduced character
 * for character from `job-search/portfolio/site_copy.md` §5, tone-checked
 * 2026-07-28. Do not reword them here.
 *
 * `sections` are authored in this repo, which is canonical for the copy it
 * holds. Sources: `cv/work_history.md`.
 *
 * Display order is the array order. `tier` is on the record but nothing sorts
 * by it yet: the v2 Router is what will.
 */
export const projects: readonly Project[] = [
  {
    slug: 'rollhaus',
    title: 'Rollhaus',
    year: '2026',
    context: 'Course project, pair',
    role: 'UX + design systems',
    lenses: ['UX/UI', 'Systems & Architecture'],
    tier: 'featured',
    // Shortened 2026-08-04, same call as FerMentor's. "built on Figma variables
    // and modes" is the decision; extending to new skate types is the payoff and
    // the Outcome section argues it properly.
    summary: 'A roller-skate configurator built on Figma variables and modes.',
    // Framed to 16:10 in `scripts/extract-figures.py` rather than left to
    // object-cover, and kept as the whole viewport rather than the boot alone:
    // at card size the option panel and the cart button are what make it read
    // as a configurator, which is what the summary above claims it is.
    thumb: {
      src: '/figures/rollhaus-thumb.jpg',
      // Re-alted 2026-08-05 with the crop. The file was re-sourced from the
      // wheels step of the progression below, so the panel beside the boot is
      // now colourways rather than skate types, and the old wording described
      // an image that no longer ships.
      alt: 'The Rollhaus customization editor: a teal, red, yellow and blue roller skate on yellow wheels fills the screen beside a panel of wheel colourways and an add to cart button.',
      width: 1120,
      height: 700,
    },
    problem:
      "A custom roller-skate shop where a single product has dozens of configurations. Hand-building each variant doesn't scale, and early on every mid-build change cost us work.",
    whatIDid:
      'Built the product page on Figma variables and modes instead of duplicated frames, so one mode switch reconfigures several linked elements at once. Added a color token system, then extended the setup from quad skates to inline, ice, and shoe-only, plus fabric and pattern options.',
    whatChanged:
      'The system grew by extension rather than duplication. Usability testing with 18 unmoderated and 1 moderated participant found a 68% misclick rate on editing a skate, which drove a category-based rework of the side panel.',
    // Ported 2026-07-30 from `job-search/portfolio/case_studies/spiced_rollhaus.md`
    // once the top-up landed, which is what precondition 1 was gating. The
    // fourth design principle, Guidance Over Selling, is named here on Leonid's
    // confirmation the same day that it was part of the presented set.
    //
    // The ad hoc variable naming is stated once on this page, in the figure's
    // footnote. The Learnings section deliberately does not restate it: the
    // same caveat twice on one page is tone tell #10.
    sections: [
      {
        kind: 'constraints',
        heading: 'Constraints',
        items: [
          { label: 'Duration', value: '3 weeks, March 2026' },
          { label: 'Team', value: '2 designers, with Yassine Alikhbari' },
          { label: 'Platform', value: 'Desktop-first' },
          { label: 'Tools', value: 'Figma: variables, modes, slots' },
        ],
      },
      {
        // Replaces the quad-versus-inline pair that stood here until
        // 2026-08-05. Leonid's objection was that the two states were "mainly
        // the same": one wheel mount differed and the reader had to hunt for
        // it. A progression starts from almost nothing and adds one decision at
        // a time, so the option space opens in front of the reader instead of
        // being asserted in a caption.
        //
        // He clicked and exported all four in one sitting, at an identical
        // 2916x2086, which is why any difference between these images is a
        // difference in the product rather than in the framing.
        kind: 'progression',
        heading: 'The editor',
        caption:
          'Four decisions, in the order the editor asks for them. Each state keeps everything the one before it added, and the rail above the options fills as you go. Nothing was redrawn between them: the product is one component reading the current selection, which is why the panel thumbnails in step 3 are the boot you already configured rather than four stock icons.',
        steps: [
          {
            label: 'Shoe model',
            note: 'Two lasts, a high top and a low shoe. Nothing is mounted yet, so this is the whole product.',
            src: '/figures/rollhaus-editor-shoe.jpg',
            alt: 'The Rollhaus editor with Select Your Shoe Model active. A plain cream boot fills the canvas with nothing fitted underneath it, and the panel offers two thumbnails, a low shoe and a high boot.',
            width: 1400,
            height: 994,
          },
          {
            label: 'Pattern',
            note: 'Eight fabrics and colourways. The boot changes, the mount is still absent.',
            src: '/figures/rollhaus-editor-pattern.jpg',
            alt: 'The same editor with Select Your Pattern active. The boot now carries a teal, red, yellow and blue colourblock, and the panel shows eight swatches including tartan, checkerboard, floral, polka dot and a retro wave.',
            width: 1400,
            height: 994,
          },
          {
            label: 'Skates',
            note: 'Quad, inline, ice, or nothing at all. Every thumbnail here is the boot from the step before.',
            src: '/figures/rollhaus-editor-skates.jpg',
            alt: 'The same editor with Select Your Skates active. The colourblock boot now sits on a four-wheel quad plate, and the four panel thumbnails show that same boot as a quad, an inline, an ice skate and a plain shoe.',
            width: 1400,
            height: 994,
          },
          {
            label: 'Wheels',
            note: 'Eight colourways, and each one carries more than a colour. The variables figure below shows what.',
            src: '/figures/rollhaus-editor-wheels.jpg',
            alt: 'The same editor with Select Your Wheels active. The wheels have turned yellow and the panel shows eight wheel colourways including cream, dark green, orange, pale blue, royal blue, rust, black and mint.',
            width: 1400,
            height: 994,
          },
        ],
      },
      {
        kind: 'prototype',
        heading: 'Try it',
        caption:
          'The full flow, landing page to confirmation, with the editor at its centre. Nothing loads from Figma until you press the button.',
        href: 'https://www.figma.com/proto/y7bE7LrAbTqplVEh7y44ID/Project3_Rollhaus-Copy?node-id=1927-3157&starting-point-node-id=1927%3A3157&scaling=scale-down&content-scaling=fixed',
        embedSrc:
          'https://embed.figma.com/proto/y7bE7LrAbTqplVEh7y44ID/Project3_Rollhaus-Copy?node-id=1927-3157&starting-point-node-id=1927%3A3157&scaling=scale-down&content-scaling=fixed&embed-host=lolesch-github-io',
        action: 'Load the prototype and configure a skate',
        title: 'The Rollhaus prototype, running in Figma',
        poster: {
          src: '/figures/rollhaus-editor-wheels.jpg',
          alt: 'The Rollhaus editor with a fully configured skate: a colourblock boot on a quad plate with yellow wheels.',
          width: 1400,
          height: 994,
        },
      },
      {
        kind: 'prose',
        heading: 'Context',
        body: [
          'Every option you add to a customizable product is another decision handed to the user, and another way for the interface to get crowded. Rollhaus sells one roller skate that the buyer configures, so the number of possible products was open-ended from the start while the shopping flow had to stay simple.',
          "The brief asked for an e-commerce site for a niche product, and the product itself was ours to pick. We chose customizable skates on purpose, because a single configurable product was the hardest test we could set for Figma's variables, modes and the then-new Slots feature. Neither of us had built a system like that before, which was the point.",
          'The design process was collaborative. After wireframing we delegated screen responsibilities. I took the landing page and the editor, plus the technical screen setup that unified screens and scroll behaviour. My editor proof of concept became the basis for the variable setup, which we then refined together. Yassine mainly built the flow from cart to confirmation.',
        ],
      },
      {
        // Replaces the option-tree screenshot that stood here until 2026-08-05,
        // which was a picture of text on a page whose problem was that it had
        // too few pictures. Nothing is lost by dropping it: the prose in the
        // next section already enumerates the same option space, down to the
        // ball bearings, so the tree was restating a paragraph in a lower
        // resolution.
        kind: 'figure',
        heading: 'What you can actually change',
        caption:
          'The parts, as they are built in the file. Two lasts and eight patterns make sixteen boots, three mounts and eight wheel colourways multiply that again, and none of it is a screen. The dashed outlines are Figma component-set boundaries, left in because they are what makes these sets rather than a page of product shots.',
        src: '/figures/rollhaus-atoms.jpg',
        alt: 'Three groups of product renders on a dark canvas. On the left, three mounts: an inline frame, a quad plate and an ice blade. In the middle, two columns of eight, high tops beside low shoes, running through plain cream, tartan, retro stripe, checkerboard, floral, colourblock, polka dot and a wave print. On the right, wheel sets in eight colourways, each drawn as a quad pair and as an inline row.',
        width: 1401,
        height: 1230,
      },
      {
        kind: 'prose',
        heading: 'One system, not a screen per option',
        body: [
          'We wrote four design principles in week one, from a user story and a moodboard, and checked components against them. Highlight Individuality, Flow Over Flash, Guidance Over Selling, Design for Joy. Writing principles down is ordinary practice and it bought us something modest but real: each one names a tradeoff we would otherwise have argued about every week. Flow Over Flash settles personality against usability, so usability wins the structure and the personality lives in the copy. Guidance Over Selling settles conversion pressure against trust, which is why the editor recommends and never pushes.',
          'That gave the copy a rule of its own. The interface talks like a knowledgeable skate friend rather than a salesperson: "Nice choice. Now pick your wheels." moves someone forward without inventing a points system, and progress reads as readiness, "Your setup is 80% complete", instead of as a checklist.',
          'Before committing to the full editor I built a small working version as a go or no-go gate. The product gave that gate something concrete to survive: shoe model, closing mechanism, size, patterns and colour sets, three skate types each with their own wheels and brakes, and per wheel the size, material, hardness and colour, down to the ball bearings. Either one variable system could carry all of that or it would collapse as soon as the product got complex. It held, so we scaled it.',
          'The mechanism is the core of the project, and the three figures below carry it: what the variables are, what a screen reads off them, and what one card does across four screens. The part worth naming here is the slot system: one Base Card, slotted differently, serves the landing page, the cart, the checkout and the confirmation. Peers and the instructor arrived at the same note independently, that talking about atomic design in general terms buried the decision that was actually ours.',
        ],
      },
      {
        // The strongest artifact in this case study, and Leonid offered it with
        // "though I dont know how usefull that is". It is the only evidence
        // anywhere for modes, which every earlier version of this page could
        // assert and never show.
        //
        // A full-width figure rather than half of a `comparison` with the debug
        // readout below: both images are wide landscape strips, and the
        // comparison renderer is a two-column grid that would put each of them
        // near 350px and make both unreadable.
        kind: 'figure',
        heading: 'Where the configuration is defined',
        caption:
          'Eleven collections, nine of them named for what they drive, and the Wheels collection open with its modes as columns. Green sets the colour, the outdoor type and 26 euro together. Black sets black, outdoor and 17. One switch, three linked values, which is the whole of what modes are doing in this file.',
        src: '/figures/rollhaus-variables.png',
        alt: 'The Figma variables panel. A left rail lists eleven collections: Color 31, System 5, an unnamed empty one, Cart 5, EditorSidePanel 2, Test Radio Buttons 5, a second unnamed empty one, Pattern 2, Shoe 3, Skates 2, and Wheels 3, which is selected. The table shows three variables, WheelColor, WheelType and WheelPrice, across seven mode columns named Default, Yellow, Green, Water blue, Blue, Orange and Black. WheelPrice reads 23, 23, 26, 26, 23, 21 and 17 across them.',
        width: 1600,
        // 385 rather than 386: measured off the written file, because the zoom
        // lands a fraction under a whole pixel. next/image uses this only for
        // the aspect ratio, so the measurement wins and the crop stays.
        height: 385,
      },
      {
        kind: 'figure',
        heading: 'And where it is read',
        caption:
          'A debug panel left on the cart screen during the build. The same state the collections above define, grouped by what it drives, on a screen that is using it.',
        src: '/figures/rollhaus-debug.png',
        alt: 'A readout in four columns headed Debug Shoe, Debug Skates, Debug Cart and Debug Side Panel. Shoe reads Shoe Type High, Shoe Pattern Default, Shoe Size 49. Skates reads Skate Type Quad, Wheels Color Default, Wheels Type Indoor. Cart reads Shoe Price 54, Pattern Price 5, Wheel Price 65, Total Price 123, Amount Counter 0. Side Panel reads Side Panel Content Pattern, Side Panel State Collapsed.',
        width: 1701,
        height: 288,
      },
      {
        kind: 'embed',
        heading: 'One card, four screens',
        caption:
          'The layer tree and the token set as the Figma file actually holds them, ported onto the tokens this site runs on, so it follows the theme. This replaced a flow diagram on 2026-08-05: that figure drew a mechanism in boxes, and the file itself is more convincing than a drawing of it.',
        figure: 'rollhaus-slots',
      },
      {
        kind: 'prose',
        heading: 'What testing changed',
        body: [
          'In week three we put the prototype through Maze, 18 unmoderated tasks and one moderated session. The shopping flow held. Cart to confirmation came back at a 100% success rate and people described it as straightforward. The editor did not hold: editing a skate produced a 68% misclick rate.',
          'The cause was structural rather than visual. People could not tell the customization categories apart, so they clicked around to find out what was editable and lost their place between tasks. We put the findings on an affinity map and a prioritization matrix, which pushed the side panel to the top of the list.',
          // Category names corrected 2026-07-31 to the ones on the screen. They
          // are the four headings in the progression at the top of this page,
          // Select Your Shoe Model / Pattern / Skates / Wheels. The earlier
          // "Colour, Skate Type" was a paraphrase, and a paraphrase that
          // disagrees with an image on the same page is the kind of small thing
          // the reader this page is written for will notice.
          //
          // The final sentence took over from the before/after comparison that
          // followed this section until 2026-08-05. Leonid's call was to drop
          // the before state; with it gone the after state had nothing to be a
          // pair with, and it is already the panel in all four editor
          // screenshots above, so the argument is made by pointing rather than
          // by shipping a fifth picture of the same panel.
          'So we re-cut it. The panel became a category selector, Shoe Model, Pattern, Skates and Wheels, sitting above an option grid, in place of one list that merged unrelated options. Reading the results as a request for visual tweaks would have been much cheaper. Re-cutting the information hierarchy was the more expensive call and the right one. It is the panel in every screenshot above.',
        ],
      },
      {
        kind: 'prose',
        heading: 'Outcome',
        body: [
          'What shipped is a desktop-first flow from landing to confirmation with a working customization editor at its centre, fully prototyped. The result I would defend is the blueprint rather than a headline number. We did exactly that during the build: we started with quad skates, then added inline, ice and a version that is just the shoe, along with new patterns and fabrics, by extending the system instead of redrawing the editor.',
          'We paid for that depth in visual fidelity. Three weeks against a system this involved meant the surface never got the polish we wanted, and we chose it that way rather than discovered it late. The instructor feedback on the final presentation named the depth from the outside: "The level of detail in your design system, microinteractions and prototype depth is exceptional, this is a major strength."',
          'There are no live users behind any of this and no business numbers. What it shows is what the system makes possible and what testing exposed, not a metric I would have to invent.',
        ],
      },
      {
        // The shop grid rather than the four skate atoms from the Components
        // canvas. The atoms would show four types; this shows the same boot
        // under two of them, which is the argument the Outcome above actually
        // makes. Shoe-only is not in this crop, so the caption does not claim
        // it: the copy above already names it.
        kind: 'figure',
        heading: 'The same boot on a different mount',
        caption:
          'The shop page after the extension round. The checkerboard boot is here as a quad and as an ice skate, the tartan as an inline and an ice, the colourblock as a quad and an inline. Nothing was redrawn to do that.',
        src: '/figures/rollhaus-extension.jpg',
        alt: 'A shop grid in three rows headed Quads, Inline and Ice, with three product cards in each. Several boots repeat between the rows with a different base fitted: one checkerboard boot appears both on four wheels and on a blade, and one tartan boot both on an inline frame and on a blade.',
        width: 1401,
        height: 1915,
      },
      {
        kind: 'prose',
        heading: 'Learnings',
        body: [
          'Do not rush the wireframes. Our worst self-inflicted problem came from racing to a testable state, and we went back to lo-fi anyway for the clarifications we had skipped. Slowing down at the start would have been faster.',
          'Principles and a design system pay off when they are applied from week one. Introduced late they would have been decoration.',
          'Mid-build change was expensive until we learned to expect it. Reworking a design after the variables were wired cost us states that had worked. Some of that was the tool: wiring variables, modes and nested instance variants together is fiddly, micro-interactions conflict with applying variables, nothing animates smoothly across a variable state change, and scroll-to behaviour misfires with instance variants. Most of it was us learning where to put the seams. By the end a change no longer meant losing work.',
          'Scalability turned out to be a recovery tool, which I had not expected. Because the system was built to extend, falling behind meant adding to the blueprint rather than rebuilding it. That is now part of how I judge a system under time pressure.',
        ],
      },
    ],
  },
  // Second, after Rollhaus. Array order is display order and Rollhaus stays the
  // lead because the site is Track C primary: it leads with the system, this
  // leads with the framing. Both are featured tier and nothing sorts by tier
  // yet, so the order here is the only thing deciding which is read first.
  fermentor,
  {
    slug: 'glyphshero',
    title: 'GlyphsHero',
    year: '2023-present',
    context: 'Solo, active',
    role: 'Direction, architecture, review',
    lenses: ['AI Workflow', 'Systems & Architecture', 'Games / XR'],
    tier: 'bridge',
    // The second sentence moved off the card 2026-08-04. It explains the
    // mechanism, which is what "Why the axes are separate" does at length.
    summary: 'A tactile auto-battler where the inventory is the spell.',
    // G.png from the game repo's Assets/Art, generated by Leonid's own prompts.
    // Placeholder until the chain diagram on the detail page can carry the tile:
    // the art shows the theme, the diagram shows the work.
    thumb: {
      src: '/figures/glyphshero-runes.png',
      alt: 'Four carved rune tiles linked together in a chain, each one a different stone and colour.',
      width: 340,
      height: 340,
    },
    problem:
      'I wanted to find out what actually changes when AI does the implementation and I do the direction.',
    whatIDid:
      'Built an auto-battler as the ongoing test. I write the design docs and the first architecture myself, use AI to review them for gaps and contradictions, then let it run focused task sessions under red-green tests while I keep direction and code review. The repo carries a CLAUDE.md and an Obsidian doc vault, which is the setup rather than a claim about it.',
    whatChanged:
      '75 commits so far. The work moved upstream, into defining a goal precisely enough that it can be delegated.',
    sections: [
      {
        kind: 'prose',
        heading: 'Context',
        body: [
          'GlyphsHero is a hex-grid auto battler I have been building alone since 2023. Into the Breach for the tactics, Noita for the way spells are assembled out of parts, Backpack Battles for the inventory that assembles them.',
          'The idea it is built on is that your inventory is your spellbook. Items sit in a grid, adjacent items form a chain, and the chain is the attack. Rearranging your bag is how you change what you cast, so inventory management stops being bookkeeping and becomes the main decision.',
          'It is also where the reusable systems I have carried from project to project for years currently live, so the architecture underneath it is older than the game on top of it.',
          'It doubles as the test rig. I wanted the test to run on a real codebase rather than a toy one, because a toy has no architecture to misread.',
        ],
      },
      {
        kind: 'embed',
        heading: 'How an attack is built',
        caption:
          'The attack model as the game actually resolves it, ported onto the tokens this site runs on, so it follows the theme.',
        figure: 'glyphshero-chain',
      },
      {
        kind: 'prose',
        heading: 'Why the axes are separate',
        body: [
          'The first version had an item type per behaviour: a piercing weapon, a splitting weapon, a homing weapon. Every new combination meant a new type, and the combinations multiply faster than you can author them.',
          'Splitting an attack into independent axes fixed it. Target selection picks what the attack aims at, delivery decides which hexes it covers, propagation decides what it spawns on impact. An item reclassifies one axis and leaves the others alone, so a converter that turns a single-hex hit into a line does not need to know what payload is attached behind it.',
          'The cost of that is a vocabulary you have to hold in your head, and I keep it written down rather than in my head: the domain glossary and nine ADRs live in the repo, and they are what stop the terms drifting while the code changes underneath them.',
        ],
      },
      {
        kind: 'prose',
        heading: 'How it gets built',
        body: [
          'I write the design docs and the first architecture myself. No AI, or AI only for inspiration. The thinking has to be mine or there is nothing to delegate.',
          'Then I hand those documents back to a model and ask it to find the gaps and the contradictions, which is a different request from asking whether they are good.',
          'Then a grilling session: an interview format where the model keeps asking until the plan has no soft spots left. What comes out is a shared vocabulary and an execution plan.',
          'Then it runs focused task sessions and commits, under red-green testing where testing applies. I keep direction, decisions and code review.',
          "The repo carries a CLAUDE.md and an Obsidian docs vault. That is where the project's rules and vocabulary live, so a fresh session starts with them instead of rediscovering them.",
        ],
      },
      {
        kind: 'prose',
        heading: 'Outcome',
        body: [
          'Seventy-five commits in, the thing that actually moved is where my time goes. Most of the work is now upstream of the code: stating a goal precisely enough that someone else, or something else, can execute it without me in the room. That turns out to be harder than writing the implementation was, and it is the part that transfers to working with people.',
          'It has no players. This is a personal project and I have not put it in front of anyone, so nothing here is validated by use.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-god',
    title: 'How to God',
    year: '2024',
    context: 'Commercial, Thoughtfish',
    role: 'Unity Developer',
    lenses: ['Games / XR', 'UX/UI'],
    tier: 'bridge',
    // The list of what tuning meant came off 2026-08-04. It is the same list
    // `whatIDid` carries, one line into the detail page.
    summary: 'VR spellcasting and grabbing for Meta Quest. I owned UX and game feel.',
    // PDPScreenshot2.png from the Thoughtfish press kit, downscaled and
    // re-encoded, uncropped. Of the six screenshots in the kit it is the one
    // showing the hands mid-gesture rather than the setting, which is what this
    // project is about. The alt describes the image rather than the project:
    // the plan's placeholder wording was written before the file existed.
    thumb: {
      src: '/figures/how-to-god.jpg',
      alt: 'Two hands seen in first person over an island, fingertips almost touching, a blue and a red orb meeting in a flash of light between them.',
      width: 1920,
      height: 1080,
    },
    // Corrected 2026-07-31. The recogniser was an existing plugin, which
    // `cv/cv_track_b_content.md:74` in the sibling repo logged as the
    // Thoughtfish accuracy fix back in June; `site_copy.md` dropped the
    // qualifier and this record inherited it, leaving the portfolio as the only
    // surface still claiming the system. Do not drop it again.
    problem:
      'In VR you cast spells by gesture and pick objects up with your hands. Neither works if the player has to think about how to do it.',
    whatIDid:
      "Designed the gesture set around simple, distinct shapes on an existing recognition plugin, and trained the model across several people rather than only myself. Tuned the colliders on the in-game hand model so grabbing felt right, added haptics as success and warning signals, and built the input scheme to Meta Quest's guidelines.",
    whatChanged:
      "The interaction layer was playtested and merged to main. I left a year before Early Access, so I can't tell you what survived.",
    sections: [
      {
        kind: 'prose',
        heading: 'Context',
        body: [
          'How to God is a VR god sim for Meta Quest, made at Thoughtfish in Berlin. The player builds villages by placing blocks, raises a creature, follows branching quests and fights rival deities, all with their hands.',
          'I was hired to own UX and game feel. Shortly after I joined, another developer was let go, so I picked up gameplay features and quest logic on top of that. The interaction layer stayed mine throughout.',
        ],
      },
      {
        kind: 'prose',
        heading: 'Making it feel right',
        body: [
          'The recognition plugin was already in the project when I arrived. What was open was everything around it: which shapes the spells used, how much slack a shape got before it stopped counting, and how fast the game told you it had counted. That is the part I was hired for.',
          'Simple, distinct shapes did most of the work, because a shape that stays distinguishable when it is drawn badly needs less tuning than one that does not. I trained the model across several people instead of only myself, which is the difference between a system that works and a system that works for the person who built it.',
          'Grabbing is the same problem from the other side. The colliders on the in-game hand model decide whether a pickup reads as contact or as a near miss, and that is tuning rather than design: you adjust, you playtest, you adjust again. Haptics carry the result back, one signal for a success and another for a warning.',
          "The input scheme follows Meta Quest's guidelines, which set what a grab, a trigger and a menu call are expected to do on that hardware. Deliberately conventional, so it is learnable.",
        ],
      },
      {
        kind: 'prose',
        heading: 'Outcome',
        body: [
          // The limitation is stated once, in `whatChanged`, which the detail
          // page renders in the <dl> above this section. It said it. This
          // paragraph gives the chronology that substantiates it and stops
          // there. Restating the conclusion here is what guardrail 5 bans, and
          // it read as a third hedge on a site that already carries two.
          'I left Thoughtfish in December 2024, and the game reached Early Access a year after that.',
          'One thing on this project is not mine. It ran a hybrid OOP and ECS architecture, and the team had already done the optimisation work before I arrived: low-poly geometry, object pooling, simplified colliders. I worked next to that, not on it.',
        ],
      },
    ],
  },
];
