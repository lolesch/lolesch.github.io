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
        kind: 'prose',
        heading: 'Context',
        body: [
          'Every option you add to a customizable product is another decision handed to the user, and another way for the interface to get crowded. Rollhaus sells one roller skate that the buyer configures, so the number of possible products was open-ended from the start while the shopping flow had to stay simple.',
          "The brief asked for an e-commerce site for a niche product, and the product itself was ours to pick. We chose customizable skates on purpose, because a single configurable product was the hardest test we could set for Figma's variables, modes and the then-new Slots feature. Neither of us had built a system like that before, which was the point.",
          'The design process was collaborative. After wireframing we delegated screen responsibilities. I took the landing page and the editor, plus the technical screen setup that unified screens and scroll behaviour. My editor proof of concept became the basis for the variable setup, which we then refined together. Yassine mainly built the flow from cart to confirmation.',
        ],
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
          'So we re-cut it. The panel became a category selector, Shoe Model, Colour, Skate Type and Wheels, sitting above an option grid, in place of one list that merged unrelated options. Reading the results as a request for visual tweaks would have been much cheaper. Re-cutting the information hierarchy was the more expensive call and the right one.',
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
          'GlyphsHero is an auto battler I have been building alone since 2023. Unit placement, a unit bank, synergy effects, an inventory. It is also where the reusable systems I have carried from project to project for years currently live, so the architecture underneath it is older than the game on top of it.',
          'It doubles as the test rig. I wanted the test to run on a real codebase rather than a toy one, because a toy has no architecture to misread.',
        ],
      },
      {
        kind: 'prose',
        heading: 'The loop',
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
    problem:
      "In VR you cast spells by gesture and pick objects up with your hands. Both have to work for people whose hands don't move the way yours do.",
    whatIDid:
      "Designed the gesture set around simple, distinct shapes that survive being recognised imperfectly, and trained the recogniser across several people rather than only myself. Tuned the colliders on the in-game hand model so grabbing felt right, added haptics as success and warning signals, and built the input scheme to Meta Quest's guidelines.",
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
        heading: 'Designing for hands that vary',
        body: [
          'Gesture recognition fails differently for different people. A shape I draw cleanly is a shape someone else draws at a different size, at a different speed, with a different tremor. So the gesture set is built from simple, distinct shapes chosen to stay distinguishable when they are recognised imperfectly, and the recogniser was trained across several people instead of only on me. Training on one person produces a system that works for one person.',
          'Grabbing is the same problem approached from the other side. The colliders on the in-game hand model decide whether a pickup reads as contact or as a near miss, and getting that right is tuning rather than design: you adjust, you playtest, you adjust again. Haptics carry the result back to the player, one signal for a success and another for a warning.',
          "The whole input scheme follows Meta Quest's guidelines, which set what a grab, a trigger and a menu call are expected to do on that hardware.",
        ],
      },
      {
        kind: 'prose',
        heading: 'Outcome',
        body: [
          'The interaction layer was playtested and went into main. I left Thoughtfish in December 2024, and the game reached Early Access a year after that, so I cannot tell you which of those decisions survived the year in between.',
          'One thing on this project is not mine. It ran a hybrid OOP and ECS architecture, and the team had already done the optimisation work before I arrived: low-poly geometry, object pooling, simplified colliders. I worked next to that, not on it.',
        ],
      },
    ],
  },
];
