// Vocabulary and content are the game repo's own, from Docs/agents/design-gate.md:
// the two-way/one-way door test and the slice-end ledger it feeds. Transcribed
// rather than summarised, so the figure argues the same thing the doc does.
export const glyphsheroDesignGate = {
  title: 'Two-way door, one-way door',
  standfirst:
    'Two kinds of gap, not one rule for filling them. Whether a fork gets decided on the spot or stops the work depends on how expensive it would be to undo.',

  doors: [
    {
      kind: 'Two-way',
      trigger: 'Cheap to reverse: a tuning value, an ordering tiebreak, a default',
      result: 'Decide it, but log it in the slice-end ledger for veto',
    },
    {
      kind: 'One-way',
      trigger:
        'Expensive to unwind once code depends on it, or it contradicts an accepted decision, or it defines a previously undefined rule',
      result: 'Stop. Surface it as needs-design. Do not settle it silently',
    },
  ],

  ledgerLabel: 'The slice-end ledger, filled whether or not a fork came up',
  ledger: [
    { line: 'Assumptions made', detail: 'Two-way doors decided, open for review or veto' },
    {
      line: 'Decisions I took',
      detail: 'Anything that leaned on judgement, with the door-test result',
    },
    { line: 'Gaps left open', detail: 'One-way doors not filled, each a needs-design candidate' },
  ],

  footnote:
    "The real fork this caught: a change that looked like a small pool tweak to how a payload's propagation cost worked turned out to hide an undecided rule, and became ADR-0006 instead of a silent call made mid-implementation.",
} as const;
