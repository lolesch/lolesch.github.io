import type { About } from './types';

// Ported from job-search/portfolio/site_copy.md §2, tone-checked 2026-07-28,
// character for character apart from the two changes noted inline. This repo is
// canonical for it from 2026-07-31; the source carries a superseded-pointer.
export const about: About = {
  intro:
    "I'm a UX/UI designer in Berlin. Before that I was a Unity developer for over five years, and before that a metalworker.",

  sections: [
    {
      kind: 'prose',
      heading: 'How that happened',
      body: [
        // The second sentence is the metalwork systems-origin line, decided
        // 2026-07-29 and written 2026-07-31. It states a fact about the shelf
        // and leaves the parallel to design work unstated: an earlier version
        // drew it ("same instinct as the shelf, different material") and was
        // cut under tone tell #4. It also avoids claiming he already framed
        // before building, which would contradict "How I work" below.
        "I trained in Metallgestaltung and passed my journeyman's exam in 2016. My Gesellenstück was a wall shelf on a bayonet mechanism, so the layers unlock and remount in any configuration. That was the first thing I built where the parts had to work in more than one arrangement. It is still on my wall, and I still carry the pocket knife I forged during the apprenticeship.",
        'Then a few years without much direction. I was restoring a VW LT with a friend, living on a farm in Mecklenburg, and modding Torchlight II in the evenings, when it occurred to me that people do this for a living. I applied to Games Academy in Berlin.',
        "I trained there as a game designer and then kept gravitating to the programming side of every project, so I taught myself to code. At Sorcerers Lab I ended up as the studio's only developer and shipped a turn-based roguelite in about five months. At Paintbucket Games I owned the UI on Beholder 3: designed it, implemented it, and built a color system where a single ScriptableObject drove the palette across every menu instead of colors being set per object.",
      ],
    },
    {
      kind: 'prose',
      heading: 'Why UX',
      body: [
        'The interface was in every job I had. Games Academy coursework included interaction design. At Paintbucket I started implementing UI because nobody else wanted to, then ended up owning it. At Sorcerers Lab and Grimbart Tales the UI functionality and animation were mine. At Thoughtfish the remit was interaction and game feel. The pivot made formal the part I had already been doing.',
        'The practical side was real too: multi-year projects and not much stability. I wanted to go somewhere my existing skillset stays valuable.',
        "In 2023 I became a father and took time out from work to care for my family. After that I built VR interaction systems at Thoughtfish, spent a year on self-directed systems work, then did SPICED's UX/UI program, 720 hours, graduating in May 2026.",
      ],
    },
    {
      kind: 'prose',
      heading: 'How I work',
      body: [
        'I think in systems. That means I am usually not the fastest person on a task, and I am reliably the one whose work still holds up when the requirements change three months later. It shows up as design tokens, reusable components, and architecture decisions made early enough to matter.',
        'It has a failure mode and I know what it is. Coming from engineering, the temptation is to jump to a solution before the problem is properly framed. Learning to do the framing first is most of what I went to SPICED for.',
      ],
    },
    {
      kind: 'prose',
      heading: "Where I'm going",
      body: [
        // The final clause used to read "and there's a case study about it".
        // Cut on 2026-07-31 under guardrail 1: the meta case study is v2 and
        // does not exist, so it was not a claim yet. Put it back when it ships.
        'Design and engineering as one job rather than two, and working out what AI actually changes about that. I write the architecture and the design docs myself, then use AI to review them and to execute inside guardrails I set. This site is being built that way.',
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
      external: false,
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/leonid-schreiber',
      href: 'https://www.linkedin.com/in/leonid-schreiber/',
      external: true,
    },
    {
      label: 'GitHub',
      value: 'github.com/lolesch',
      href: 'https://github.com/lolesch',
      external: true,
    },
    {
      label: 'itch.io',
      value: 'lolesch.itch.io',
      href: 'https://lolesch.itch.io',
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
