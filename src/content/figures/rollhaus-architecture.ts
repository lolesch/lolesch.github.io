// The Rollhaus brand yellow and teal are content, not styling. This diagram is
// *about* that palette, so the literal values belong here rather than in a
// token. src/content/** is exempt from the raw-colour guard for this reason.
//
// Source: job-search/portfolio/case_studies/assets/rollhaus_architecture.html,
// built from the live Figma file (Project3_Rollhaus, editor node 966:17281) on
// 2026-06-19.
export const rollhausPalette = {
  brand: '#ffd942',
  teal: '#2f8f8a',
  neutrals: [
    { value: '#f3f2f1', label: 'Neutrals 1' },
    { value: '#dedbd9', label: 'Neutrals 2' },
    { value: '#a7a19a', label: 'Neutrals 3' },
    { value: '#888077', label: 'Neutrals 4' },
    { value: '#262421', label: 'Neutrals 6' },
  ],
} as const;

export const rollhausArchitecture = {
  title: 'Rollhaus configurator architecture',
  standfirst:
    'One configurable product. A selection drives variables and modes, which switch the skate component to the matching variant and recalculate the price, all on a real token system.',

  flowLabel: 'How a configuration is driven',
  flow: [
    {
      title: '1 · Selection',
      detail: 'A category, then an option inside it.',
      chips: [
        { text: 'Shoe model', on: true },
        { text: 'Colour', on: false },
        { text: 'Skate type', on: false },
        { text: 'Wheels', on: false },
      ],
      arrow: 'sets',
    },
    {
      title: '2 · Variables and modes',
      detail: 'A selection sets a variable. Naming is still ad hoc.',
      variables: [
        { name: 'QuadSelected', type: 'bool' },
        { name: 'Spotlight', type: 'string' },
        { name: 'TotalPrice', type: 'number' },
      ],
      arrow: 'switch',
    },
    {
      title: '3 · Component variants and conditionals',
      detail:
        'Variables and modes switch the skate to the matching variant, so it shows the chosen features. Conditionals show or hide parts and panels. No duplicate layout per combination.',
      arrow: 'renders',
    },
    {
      title: '4 · Output',
      detail: 'The product render updates, and the live price recalculates.',
    },
  ],

  tokensLabel: 'Token foundation (every layer draws from this)',
  tokenGroups: [
    { name: 'Typography', detail: 'H2 Poppins SemiBold 24 · CTA Poppins 20 · BodyBold Inter 20' },
    { name: 'Spacing and stroke', detail: 'Spacing/small 8 · IconStroke/Thin 1' },
    { name: 'Elevation', detail: 'DropShadow Medium and Small' },
  ],

  compositionLabel: 'Composition and reuse (slots, not screens)',
  composition: {
    base: { name: 'Base Card', slots: ['Image slot', 'Content slot'] },
    slotted: {
      name: 'One component, slotted differently',
      slots: ['product image / property list / summary', 'price, tag, CTA'],
    },
    reusedOn: 'Landing · Cart · Checkout · Confirmation',
    note: 'Slots also hold the parts that grow, so new content extends the structure instead of forcing a rebuild.',
  },

  extend: {
    label: 'Extend, do not redraw',
    body: 'Started with Quad. Added Inline, Ice and Without (just the shoe), plus new patterns and fabrics. Each one extends the token set, an option slot or a component variant. None of them is a new screen.',
  },

  footnote:
    'Built from the live Figma file on 2026-06-19. This was an early variables project: the main technique was variables and modes driving component variants. The token system is real and multi-category; the variable naming is ad hoc and would need a convention to scale beyond a project.',
} as const;
