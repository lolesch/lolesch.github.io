// The Rollhaus brand palette is content, not styling. This figure is *about*
// that token set, so the literal values belong here rather than in a token.
// src/content/** is exempt from the raw-colour guard for this reason.
//
// Read from the live file on 2026-08-05 via the Figma MCP, on nodes 966:17281
// (Editor Content) and 1703:20783 (Cart). Transcribed rather than re-fetched:
// that server is on a free tier of roughly six calls, so this file is the
// durable copy.
export const rollhausPalette = {
  brand: '#ffd942',
  brandSoft: '#fac172',
  teal: '#2f8f8a',
  secondary: [
    { value: '#64adb3', label: 'Secondary 3' },
    { value: '#2e5856', label: 'Secondary 5' },
  ],
  neutrals: [
    { value: '#f3f2f1', label: 'Neutrals 1' },
    { value: '#dedbd9', label: 'Neutrals 2' },
    { value: '#a7a19a', label: 'Neutrals 3' },
    { value: '#888077', label: 'Neutrals 4' },
    { value: '#262421', label: 'Neutrals 6' },
    { value: '#0e0d0c', label: 'Neutrals 7' },
  ],
} as const;

export const rollhausSlots = {
  // Named after what it depicts rather than after the claim it supports, the
  // same way the figure it replaced was ("Rollhaus configurator architecture").
  // The section heading above it is already "One card, four screens", and a
  // figure repeating its own section heading forty pixels lower reads as a
  // rendering mistake rather than as emphasis.
  title: 'Rollhaus Base Card and its slots',
  standfirst:
    'The layer tree as Figma holds it. Base Card owns two slots and knows nothing about what goes in them, so a new screen fills the slots differently instead of being drawn.',

  treeLabel: 'Base Card, as the file holds it',
  tree: [
    { depth: 0, name: 'Base Card', kind: 'instance' },
    { depth: 1, name: 'Image slot', kind: 'slot' },
    { depth: 2, name: 'Background Variant', kind: 'instance' },
    { depth: 2, name: 'Composable Skates', kind: 'instance' },
    { depth: 2, name: 'Tag', kind: 'instance' },
    { depth: 1, name: 'Content slot', kind: 'slot' },
    { depth: 2, name: 'Card content', kind: 'instance' },
    { depth: 3, name: 'Slot', kind: 'slot' },
    { depth: 4, name: 'SkatesProperty x4', kind: 'instance' },
    { depth: 4, name: 'Total Price', kind: 'instance' },
  ],

  screensLabel: 'What each screen puts in them',
  screens: [
    {
      name: 'Landing',
      image: 'Composable Skates, plus a New or On Sale tag',
      content: 'Card content: name, material, price',
    },
    {
      name: 'Cart',
      image: 'Hidden. The product render moves to the page itself',
      content: 'The four SkatesProperty rows, a total, a quantity selector',
    },
    {
      name: 'Checkout',
      image: 'Hidden',
      content: 'The same summary, plus an address form and a shipping switch',
    },
    {
      name: 'Confirmation',
      image: 'Hidden',
      content: 'The same summary again, and nothing else',
    },
  ],

  tokensLabel: 'The token foundation every screen draws from',
  tokenGroups: [
    {
      name: 'Typography',
      detail:
        'H2 Poppins SemiBold 24 · H3 Poppins SemiBold 16 · Body Inter 20 · Body2 Inter 16 · BodyBold Inter SemiBold 20 · CTA Poppins SemiBold 20',
    },
    {
      name: 'Spacing and stroke',
      detail: 'Spacing/small 8 · IconStroke Thin 1 · IconStroke Default 1.5',
    },
    {
      name: 'Elevation',
      detail: 'DropShadow Medium x0 y4 blur4 · DropShadow Small x0 y2 blur2 spread2',
    },
  ],

  extend: {
    label: 'Extend, do not redraw',
    body: 'Started with quad skates. Added inline, ice and a version that is just the shoe, plus new patterns and fabrics. Each one extends a token set, an option slot or a component variant. None of them is a new screen.',
  },

  footnote:
    'Read from the live Figma file on 2026-08-05. This was an early variables project: the token system is real and multi-category, and the variable naming is ad hoc and would need a convention to scale beyond a project. A collection named Test Radio Buttons is still in the file, which is visible two figures above.',
} as const;
