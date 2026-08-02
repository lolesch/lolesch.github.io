// The stage names are the design file's own, kept verbatim: Stabilizing,
// Maturing, Ready Evaluation, Over-Fermented. They are the product's domain
// vocabulary, and renaming them here to match this repo's British spelling
// would put a second vocabulary on one model, which is what the glossary rule
// in CONTEXT.md exists to stop. Prose written around them uses "flavour".
//
// Source: job-search/portfolio/projects/fermentor/fermentor_source_of_truth.md
// section 5b, read off the Components page of the design file.
type Stage = {
  name: string;
  gloss: string;
  signals: readonly string[];
  // Present on exactly two stages. Both are arrows drawn on the original
  // taxonomy rather than descriptions of it, which is why they render as a
  // separate annotation instead of joining the gloss.
  note: string | null;
};

type Phase = {
  name: string;
  signalsLabel: string;
  stages: readonly Stage[];
};

// Typed rather than `as const`, unlike the two figures beside it. The phases
// hold four, one and two stages, so `as const` would infer three different
// tuple types and hand the component a union it cannot map over. The shape is
// the thing worth fixing here anyway: the model is a funnel into one decision.
export const fermentorStages: {
  title: string;
  standfirst: string;
  phases: readonly Phase[];
  footnote: string;
} = {
  title: 'The fermentation stage model',
  standfirst:
    'Seven stages in three phases, each carrying the signals a beginner can actually observe from outside the jar. This is the part that makes "what should this look like right now" a question the product can answer at all.',

  phases: [
    {
      name: 'Development',
      // Named per phase because the Decision phase does not hold signals. It
      // holds the questions the signals are gathered to answer, and labelling
      // both columns "What you can see" would flatten the one place the model
      // stops describing and starts deciding.
      signalsLabel: 'What you can see',
      stages: [
        {
          name: 'Activation',
          gloss: 'Visible activity may not be obvious yet.',
          signals: ['Few or no bubbles', 'Slight cloudiness', 'Aroma shift beginning'],
          note: 'Where beginners quit, because early fermentation looks like nothing is happening.',
        },
        {
          name: 'Active Fermentation',
          gloss: 'Peak microbial activity.',
          signals: ['Bubbling', 'Pressure', 'Foam', 'Rising acidity', 'Strong smell changes'],
          note: null,
        },
        {
          name: 'Stabilizing',
          gloss: 'Activity slows from rapid change to refinement.',
          signals: ['Fewer bubbles', 'Sediment forming', 'Clearer liquid', 'Flavour balancing'],
          note: null,
        },
        {
          name: 'Maturing',
          gloss: 'Optional, and common across most ferment types.',
          signals: ['Slower visual change', 'Flavour complexity', 'Texture changes'],
          note: null,
        },
      ],
    },
    {
      name: 'Decision',
      signalsLabel: 'What you decide',
      stages: [
        {
          name: 'Ready Evaluation',
          gloss: 'Assess whether intervention is needed.',
          signals: [
            'Stop now?',
            'Refrigerate?',
            'Bottle?',
            'Continue aging?',
            'Safe?',
            'Desired flavour reached?',
          ],
          note: null,
        },
      ],
    },
    {
      name: 'Outcome',
      signalsLabel: 'What you can see',
      stages: [
        {
          name: 'Storage / Preservation',
          gloss: 'The batch is held rather than developed.',
          signals: ['Slowed activity', 'Stable appearance'],
          note: null,
        },
        {
          name: 'Over-Fermented / Risk State',
          gloss: 'The batch has gone past ready.',
          signals: [
            'Too sour',
            'Mushy',
            'Pressure risk',
            'Kahm yeast',
            'Mold',
            'Alcohol shift',
            'Vinegar conversion',
          ],
          note: 'Where the product earns its place, because this is the moment a beginner most needs to be told what they are looking at.',
        },
      ],
    },
  ],

  footnote:
    'Written for the capstone from desk research and AI-assisted synthesis, not from the three interviews. It is the strongest artifact in the project and it rests on the thinnest evidence in it, which makes it a model to test rather than a validated one.',
};
