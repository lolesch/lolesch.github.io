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
    // Empty on purpose. `job-search/_project/tasks.md:26` sequences the Rollhaus
    // top-up into spiced_rollhaus.md before this page is written: the draft
    // names three design principles where the 2026-07-29 top-up found four, and
    // it lacks the role split and the instructor feedback. This repo becomes
    // canonical on copy at port time, so writing sections now would launder a
    // stale draft into the source of truth. Task 6 of
    // docs/plans/2026-07-30-work-grid.md fills this in once that lands.
    sections: [],
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
