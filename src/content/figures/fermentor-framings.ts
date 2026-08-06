// The three candidate problem framings, transcribed from the UX Research board
// in `Capstone Task & Planning Group 2.pdf` rather than paraphrased. The
// statements and the reasoning are quoted as written, including the second
// person, which is what makes the AI drafting visible to anyone who reads it.
// The case study discloses that in prose two sections above, and the footnote
// below repeats it at the point of the evidence.
//
// This replaces `public/figures/fermentor-framings.png`, a 1101x2811 screenshot
// of the same column. That figure was text as an image: on a phone it is a
// column of type about a third the width of the reading column, it is invisible
// to selection and to search, it does not follow the theme, and a screen reader
// gets one alt string standing in for roughly 250 words of argument. The board
// is not the artifact here. The reasoning is, and the reasoning is text.
//
// American spellings inside the quotes ("behavior", "behaviorally") are the
// source's own and stay. Everything outside the quotes follows the repo.
type Framing = {
  label: string; // "Option 1"
  title: string; // the cause it names
  statement: string; // the problem statement as written
  reasoning: string; // the argument written under it
  highlights: readonly string[]; // only Option 3 breaks its reasoning into a list
  // The one that shipped. On the record rather than derived from array order,
  // for the reason the GlyphsHero chain figure stores its changed cell: the
  // figure's argument should not be a side effect of ordering.
  chosen: boolean;
};

export const fermentorFramings: {
  title: string;
  standfirst: string;
  framings: readonly Framing[];
  verdictLabel: string;
  verdict: string;
  footnote: string;
} = {
  title: 'Three candidate problem framings',
  standfirst:
    'Each one names a different cause for the same observation, and each carries the argument that was written under it at the time. Picking between them was an afternoon of work, and everything downstream inherited the choice.',

  framings: [
    {
      label: 'Option 1',
      title: 'Confidence as a result of uncertainty in state and timing',
      statement:
        'Users lack confidence during fermentation because they cannot reliably interpret the current state of their process or determine the correct timing of actions, leading to hesitation, mistakes, or abandonment.',
      reasoning:
        'This ties confidence directly to state ambiguity and timing uncertainty, which are both strongly evidenced in your research. It keeps the problem grounded in observable breakdowns (interpretation + decision-making), not just emotion.',
      highlights: [],
      chosen: true,
    },
    {
      label: 'Option 2',
      title: 'Confidence as a result of invisible variables and unpredictability',
      statement:
        'Users lack confidence managing fermentation processes because outcomes are influenced by hard-to-observe variables (e.g. temperature, microbial activity), making it difficult to predict progress, reproduce results, or trust their decisions.',
      reasoning:
        'This leans into complexity and variability as the root cause. It explains why even when users follow instructions, they still feel unsure. Strong for explaining why fermentation is inherently difficult, but slightly less focused on mid-process behavior.',
      highlights: [],
      chosen: false,
    },
    {
      label: 'Option 3',
      title: 'Confidence as a breakdown in decision-making during execution',
      statement:
        'Users lack confidence during fermentation because they do not know when to act, what signals to trust, or how to evaluate progress without risking failure, resulting in inconsistent outcomes and anxiety during critical decision points.',
      reasoning:
        'This is the most behaviorally anchored version. It highlights:',
      highlights: [
        'when to act (timing)',
        'what signals to trust (state assessment)',
        'fear of interference (contamination risk)',
      ],
      chosen: false,
    },
  ],

  verdictLabel: 'Why Option 1',
  verdict:
    'Option 3 is the most behaviourally precise and Option 2 explains the most. Option 1 is the only one that names something a product can change. Microbial activity cannot be made visible to someone looking at a jar. State can be made legible and timing can be made predictable.',

  footnote:
    'Transcribed from the UX Research board, where the reasoning under each option was drafted with AI to pressure-test the three rather than to settle them. That is why it addresses me in the second person, and why the closing line of Option 3 quotes a priority back at me. The decision above it is mine.',
};
