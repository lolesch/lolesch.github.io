import type { About } from './types';

// Ported from job-search/portfolio/site_copy.md §2, tone-checked 2026-07-28,
// character for character apart from the two changes noted inline. This repo is
// canonical for it from 2026-07-31; the source carries a superseded-pointer.
export const about: About = {
  // Rewritten 2026-08-04. The arc is unchanged and deliberately so: metalworker
  // to Unity developer to designer in nine words is the most memorable sentence
  // on the site, and the alternative considered, some version of "I have worn
  // many hats", is a cliché that says less. What the old line was missing is
  // that it listed three states and attached no claim to any of them.
  //
  // "UX Engineer" replaces "UX/UI designer" on 2026-08-08, matching the title
  // tag, the hero eyebrow and the CV. See hero.ts's eyebrow comment for the
  // full reasoning; this line and that one move together by the same coupling.
  //
  // Rewritten again 2026-08-11, worked out on the LinkedIn About rewrite the
  // same day and ported back here. "And I still write the code" is cut: it
  // reads as pre-empting a doubt nobody had raised, and the page already
  // proves it (the Paintbucket token system and the AI-workflow paragraph
  // below). Restructured from the two-sentence "X before this, Y before that"
  // shape into one sentence, "building on A, and B before that", which reads
  // as accumulation rather than a chronological list.
  intro:
    "I'm a UX Engineer in Berlin, building on five years as a Unity developer, and a hands-on metalworker's apprenticeship before that.",

  // Reordered 2026-08-04, from chronological to present-first. The old order ran
  // How that happened, Why UX, How I work, Where I'm going, which put who Leonid
  // is now third of four on the page a hiring manager opens to find out exactly
  // that. Now: what he does, where it is going, why the pivot, then the story.
  // "Why UX" sits third rather than last because it answers a question a reader
  // actively has, which the biography does not.
  sections: [
    {
      kind: 'prose',
      heading: 'How I work',
      body: [
        // Clauses flipped 2026-08-04. Both halves survive, and the honesty is
        // the point of the sentence, but as the first line of the page the old
        // order opened on a weakness and read as a hedge before anything had
        // been claimed.
        //
        // Split into two sentences 2026-08-11 to fix a comma splice; "design
        // tokens" folded into a plain list and "the urge to improve systems
        // throughout their lifetime" added as its closing item.
        "I think in systems. My work still holds up when the requirements change three months later. This quality can't be rushed. It shows up as reusable components, architecture decisions, and the urge to improve systems throughout their lifetime.",
        // Rewritten 2026-08-11. The old close, "most of what I went to SPICED
        // for", moved to "Why UX" below, which now names SPICED directly. This
        // version stays on what the paragraph is actually claiming: UX training
        // is what keeps the framing-first habit honest, not just where the
        // theory came from.
        'Coming from engineering, the temptation is to jump to a solution before the problem is properly framed. Learning to do the framing first is where my UX focus helps keep it grounded.',
      ],
    },
    {
      kind: 'prose',
      heading: "Where I'm going",
      body: [
        // The final clause used to read "and there's a case study about it".
        // Cut on 2026-07-31 under guardrail 1: the meta case study is v2 and
        // does not exist, so it was not a claim yet. Put it back when it ships.
        //
        // The opening used to read "Design and engineering as one job rather
        // than two". Cut 2026-08-04 with the same phrase in the hero: if the two
        // are one job then there is only one job, which was never the claim.
        // They are two ways at the same problem and Leonid has both.
        //
        // "and working out what AI actually changes about that" replaced
        // 2026-08-11 with a plain statement that the field itself is new,
        // ahead of the concrete workflow sentence that follows it.
        "Design and engineering are two ways into the same problem rather than two departments. With the recent AI changes in the industry, there is a new field of experience to conquer. I write the architecture and design docs myself, then use AI to review them and to execute inside guardrails I set. This site is being built that way.",
      ],
    },
    {
      kind: 'prose',
      heading: 'Why UX',
      body: [
        // Rewritten 2026-08-11. The old closer, "the pivot made formal the part
        // I had already been doing", was cut for reading as a manufactured
        // summary line (tone tell #2) once it sat a page away from a near-
        // identical closer in "How I got here" below, the same point made
        // twice. Paintbucket, Sorcerers Lab and Grimbart Tales collapsed into
        // one "I owned UI functionality and animation" clause; Paintbucket's
        // fuller origin story ("started implementing UI because nobody else
        // wanted to, then owned it") moved to "How I got here" rather than
        // being lost, replaced there by the token-system claim.
        'The interface was in every job I had. Games Academy included interaction design. At Paintbucket, Sorcerers Lab, and Grimbart Tales I owned UI functionality and animation. At Thoughtfish the remit was interaction and game feel.',
        'The practical side is real too: not much stability in multi-year game projects. I wanted to go somewhere my existing skillset stays valuable.',
        // "720 hours, graduating in May 2026" replaced with "to get back on
        // track" 2026-08-11, Leonid's edit, kept as written.
        "Then in 2023 I became a father and took time out from work to care for my family. After that I built VR interaction systems at Thoughtfish, spent a year on self-directed systems work, then did SPICED's UX/UI program to get back on track.",
      ],
    },
    {
      // Renamed from "How that happened" on 2026-08-04. It reads last now, and
      // "that" had nothing in front of it to point at.
      kind: 'prose',
      heading: 'How I got here',
      body: [
        // "Metallgestaltung" and "Gesellenstück" gained inline English glosses
        // 2026-08-11, matching the CV gloss in work_history.md ("artistic metal
        // design"). The systems-origin sentence ("That was the first thing I
        // built where the parts had to work in more than one arrangement.") and
        // the closing pocket-knife clause were cut in the same pass: the
        // shelf's own description ("layers unlock and remount in any
        // configuration") now carries the point on its own, and the later
        // Paintbucket token-system sentence closes the loop without needing a
        // sentence to spell out the parallel.
        "I trained in Metallgestaltung (artistic metal design) and passed my journeyman's exam in 2016. My Gesellenstück (journeyman's piece) was a wall shelf on a bayonet mechanism, so the layers unlock and remount in any configuration. It is still on my wall.",
        // "modding Torchlight II" generalized to "occasionally modding games"
        // 2026-08-11, Leonid's edit, kept as written.
        'I was restoring a VW LT with a friend, living on a farm in Mecklenburg, and occasionally modding games, when it occurred to me that people do this for a living. I applied to Games Academy in Berlin and started my digital career.',
        // Reordered 2026-08-11 to run chronologically: Paintbucket (2020-21) now
        // sits before Sorcerers Lab (2022), which an earlier draft had
        // backwards. The old Beholder 3 sentence ("owned the UI... a color
        // system where a single ScriptableObject drove the palette across
        // every menu") is replaced by a shorter claim about the token system
        // itself; the fuller technical detail still lives in work_history.md
        // and the Beholder 3 portfolio tile for a reader who wants it. Closing
        // line replaces "so I taught myself to code" as the section's landing
        // point.
        "I trained there as a game designer and then kept gravitating to the programming side of every project. At Paintbucket Games I created a reusable token system in Unity that the studio could build on throughout future projects. At Sorcerers Lab I ended up as the studio's only developer and shipped a turn-based roguelite in about five months. As all my jobs were user-centric, UX was just the natural next step.",
      ],
    },
  ],

  // 505x518 at source. On an About page the photograph identifies the subject,
  // so it is informative rather than decorative and an empty alt would be wrong.
  portrait: {
    src: '/leonid-schreiber.jpg',
    alt: 'Leonid Schreiber',
    width: 505,
    height: 518,
  },

  // Verified from the shipped CV PDFs, HANDOFF_portfolio_site.md:75. itch.io is
  // a fourth link past the three the PRD names: a Rollhaus-only v1 makes the
  // whole Unity and games half of the arc invisible, and itch.io is its only
  // public evidence. Approved 2026-07-31.
  contact: [
    {
      label: 'Email',
      value: 'leonid.schreiber@yahoo.de',
      href: 'mailto:leonid.schreiber@yahoo.de',
      icon: 'email',
      external: false,
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/leonid-schreiber',
      href: 'https://www.linkedin.com/in/leonid-schreiber/',
      icon: 'linkedin',
      external: true,
    },
    {
      label: 'GitHub',
      value: 'github.com/lolesch',
      href: 'https://github.com/lolesch',
      icon: 'github',
      external: true,
    },
    {
      label: 'itch.io',
      value: 'lolesch.itch.io',
      href: 'https://lolesch.itch.io',
      icon: 'itch',
      external: true,
    },
  ],

  // Re-exported 2026-07-31 against https://lolesch.github.io, so the document
  // and the site now agree. It was null until then, because the old export
  // pointed its portfolio link at the Figma prototype and would have handed a
  // reviewer a document contradicting the site they were reading.
  //
  // One CV, Track C. Offering both tracks side by side asks the visitor to
  // classify themselves, which is the v2 Router's job.
  cv: {
    // What it is, not how it opens. The "(opens in a new tab)" cue belongs to
    // the component, which is what knows the target.
    label: 'CV (PDF)',
    href: '/cv/leonid-schreiber-ux-engineer.pdf',
  },
};
