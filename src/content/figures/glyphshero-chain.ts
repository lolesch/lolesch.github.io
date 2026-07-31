// Vocabulary is GlyphsHero's own domain language, taken from CONTEXT.md in the
// game repo (Docs/adr/0004 governs the axes). The terms are canonical there:
// Single, Line, Cleave and Aoe are the delivery pattern names, not "bolt" or
// "beam", and a Converter reclassifies a kind while an Amplifier scales an
// amount. Renaming anything here to read more smoothly would put a second
// vocabulary on one system, which is the thing the glossary exists to stop.
export const glyphsheroChain = {
  title: 'One item, one axis',
  standfirst:
    'An attack resolves as a sentence across independent axes. Each item added to the chain reclassifies exactly one of them, which is what lets items compose without colliding.',

  axes: ['Targets', 'Delivers', 'Spawns'],

  rows: [
    {
      chain: ['Weapon'],
      added: null,
      values: ['Nearest', 'Single', 'nothing'],
      changed: null,
    },
    {
      chain: ['Weapon', 'Converter'],
      added: 'Converter',
      values: ['Nearest', 'Line', 'nothing'],
      // An index into `values`, so the component never guesses which cell
      // moved. Deriving it by diffing against the row above would make the
      // figure's whole argument a side effect of array order.
      changed: 1,
    },
    {
      chain: ['Weapon', 'Converter', 'Payload'],
      added: 'Payload',
      values: ['Nearest', 'Line', 'Aoe child'],
      changed: 2,
    },
  ],

  footnote:
    'Ported from the game repo, where these axes are the attack model of record. The chain is built by arranging items in the inventory grid, so the layout is the logic.',
} as const;
