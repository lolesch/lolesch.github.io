import type { Project } from './types';

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
    summary:
      'A roller-skate configurator built on Figma variables and modes, so new skate types extend the system instead of forcing a redraw.',
    // Framed to 16:10 in `scripts/extract-figures.py` rather than left to
    // object-cover, and kept as the whole viewport rather than the boot alone:
    // at card size the option panel and the cart button are what make it read
    // as a configurator, which is what the summary above claims it is.
    thumb: {
      src: '/figures/rollhaus-thumb.jpg',
      alt: 'The Rollhaus customization editor: a teal, red, yellow and blue roller skate fills the screen beside a panel of skate-type options and an add to cart button.',
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
        // Replaces the placeholder screenshot that stood here until 2026-07-31,
        // and retires it rather than swapping it: the caption below used to
        // assert that the skate updates alongside the categories, and a single
        // still could only assert it. The pair shows it. The old file carried a
        // "Patten" typo and a clipped summary card baked in by the slide it was
        // captured into, so nothing is lost by dropping it.
        //
        // Static rather than a cut-between loop, per the spec's decision 2: a
        // loop would also claim smoothness, and Learnings below says the
        // opposite about animating across a variable state change.
        kind: 'comparison',
        heading: 'The editor',
        caption:
          'One switch, two states of the same screen. Selecting a skate type re-renders the hero and every option thumbnail into the colourway already configured, because each thumbnail is an instance of the product rather than a static icon. The step, the price and the colour set hold.',
        items: [
          {
            label: 'Quad selected',
            src: '/figures/rollhaus-editor-quad.jpg',
            alt: 'The Rollhaus editor with Quad selected: a teal, red, yellow and blue boot on four wheels fills the screen, beside a panel whose four thumbnails show that same boot as a quad skate, an inline, an ice skate and a plain shoe.',
            width: 1400,
            height: 994,
          },
          {
            label: 'Inline selected',
            src: '/figures/rollhaus-editor-inline.jpg',
            alt: 'The same editor with Inline selected: the boot is unchanged and now sits on a five-wheel inline frame, the selection has moved to the second thumbnail, and the step, price and colours are the same as before.',
            width: 1400,
            height: 994,
          },
        ],
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
        // Sits above the next section rather than inside it, because that
        // section closes on "the figure below carries it in full" pointing at
        // the architecture embed. Putting this between the two would silently
        // repoint that sentence at the wrong figure.
        kind: 'figure',
        heading: 'What the system had to survive',
        caption:
          'The option space as we mapped it at the lo-fi stage, down to ball bearings and inline sub-type by wheel count. A working note rather than a deliverable, and the thing the proof of concept below had to hold before it was worth scaling.',
        src: '/figures/rollhaus-options.png',
        alt: 'A note from the design file headed Customization Options, listing a nested tree: shoe model with high top, low top and a closing mechanism of laces or straps; size; pattern with a base colour set and an overlay; then base type branching into quad, inline and ice, the quad and inline each carrying their own wheel options and ball bearings.',
        width: 1401,
        height: 2299,
      },
      {
        kind: 'prose',
        heading: 'One system, not a screen per option',
        body: [
          'We wrote four design principles in week one, from a user story and a moodboard, and checked components against them. Highlight Individuality, Flow Over Flash, Guidance Over Selling, Design for Joy. Writing principles down is ordinary practice and it bought us something modest but real: each one names a tradeoff we would otherwise have argued about every week. Flow Over Flash settles personality against usability, so usability wins the structure and the personality lives in the copy. Guidance Over Selling settles conversion pressure against trust, which is why the editor recommends and never pushes.',
          'That gave the copy a rule of its own. The interface talks like a knowledgeable skate friend rather than a salesperson: "Nice choice. Now pick your wheels." moves someone forward without inventing a points system, and progress reads as readiness, "Your setup is 80% complete", instead of as a checklist.',
          'Before committing to the full editor I built a small working version as a go or no-go gate. The product gave that gate something concrete to survive: shoe model, closing mechanism, size, patterns and colour sets, three skate types each with their own wheels and brakes, and per wheel the size, material, hardness and colour, down to the ball bearings. Either one variable system could carry all of that or it would collapse as soon as the product got complex. It held, so we scaled it.',
          'The mechanism is the core of the project and the figure below carries it in full. The part worth naming here is the slot system: one Base Card, slotted differently, serves the landing page, the cart, the checkout and the confirmation. Peers and the instructor arrived at the same note independently, that talking about atomic design in general terms buried the decision that was actually ours.',
        ],
      },
      {
        kind: 'embed',
        heading: 'How the configurator is built',
        caption:
          'The system as it actually works, ported from the Figma file onto the tokens this site runs on, so it follows the theme.',
        figure: 'rollhaus-architecture',
      },
      {
        kind: 'prose',
        heading: 'What testing changed',
        body: [
          'In week three we put the prototype through Maze, 18 unmoderated tasks and one moderated session. The shopping flow held. Cart to confirmation came back at a 100% success rate and people described it as straightforward. The editor did not hold: editing a skate produced a 68% misclick rate.',
          'The cause was structural rather than visual. People could not tell the customization categories apart, so they clicked around to find out what was editable and lost their place between tasks. We put the findings on an affinity map and a prioritization matrix, which pushed the side panel to the top of the list.',
          // Category names corrected 2026-07-31 to the ones on the screen in
          // the figure below, which reads Pattern and Skates. The earlier
          // "Colour, Skate Type" was a paraphrase, and a paraphrase that
          // disagrees with the image two paragraphs down is the kind of small
          // thing the reader this page is written for will notice.
          'So we re-cut it. The panel became a category selector, Shoe Model, Pattern, Skates and Wheels, sitting above an option grid, in place of one list that merged unrelated options. Reading the results as a request for visual tweaks would have been much cheaper. Re-cutting the information hierarchy was the more expensive call and the right one.',
        ],
      },
      {
        // Captioned as two panel structures, not as a test artefact. The merged
        // column demonstrably exists in the design file, but nothing in the
        // sources proves it is the exact screen the 18 Maze participants
        // clicked, and the caption may not quietly imply that it is.
        // Guardrail 1. Leonid, 2026-07-31; the open item is in
        // `scripts/extract-figures.py` next to the crop.
        kind: 'comparison',
        heading: 'The side panel, before and after',
        caption:
          'Two panel structures from the design file. One merges shoe, pattern, skates and wheels into a single scroll, so nothing tells you where one category ends. The other gives each its own step, and the step you are on is the ringed icon in the row above the grid.',
        items: [
          {
            label: 'One merged column',
            src: '/figures/rollhaus-panel-before.jpg',
            alt: 'A narrow dark panel running as one continuous column: a Shoe heading over two boot options, then Pattern at 5 euro over eight swatches, then Skates over three options, then Wheels at 23 euro over eight more, with nothing dividing one category from the next.',
            width: 701,
            height: 2501,
          },
          {
            label: 'Four categories',
            src: '/figures/rollhaus-panel-after.jpg',
            alt: 'The reworked panel in four headed sections, Select Your Shoe Model, Select Your Pattern, Select Your Skates and Select Your Wheels. Each heading is paired with the same row of four icons, the icon for that section ringed and the line connecting them filled up to it, above only the options belonging to that one category.',
            width: 901,
            height: 2631,
          },
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
  {
    slug: 'glyphshero',
    title: 'GlyphsHero',
    year: '2023-present',
    context: 'Solo, active',
    role: 'Direction, architecture, review',
    lenses: ['AI Workflow', 'Systems & Architecture', 'Games / XR'],
    tier: 'bridge',
    summary:
      'A tactile auto-battler where the inventory is the spell. Each item in a chain bends one part of an attack: what it targets, how it lands, what it spawns.',
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
    summary:
      'VR spellcasting and grabbing for Meta Quest. I owned UX and game feel: tuning gesture recognition, hand colliders and haptics until casting and grabbing felt right.',
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
