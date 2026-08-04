import StyleDictionary from 'style-dictionary';

const buildPath = 'src/styles/generated/';

// Every build sees the full Primitive + Brand graph plus theme-independent
// semantics. Only the theme-specific colour file changes between the two.
const base = [
  'tokens/primitive/**/*.json',
  'tokens/brand/**/*.json',
  'tokens/semantic/space.json',
  'tokens/semantic/text.json',
  // Reads text.json, so it has to come after it in this list for the reference
  // to resolve by name rather than by file order. Style Dictionary flattens
  // every source before resolving, so the order is documentation rather than a
  // dependency, and it is written down because the next family may not be.
  'tokens/semantic/type.json',
  'tokens/semantic/radius.json',
  'tokens/semantic/motion.json',
  // Semantic *colours* that do not follow the theme, so they belong in the base
  // set beside space and radius rather than in either theme file.
  //
  // Two, both for the scrim that carries a title over a thumbnail. It is dark in
  // light mode as well as dark mode, because it is media chrome rather than page
  // surface: it reads as belonging to the photograph the way a subtitle does,
  // and a light veil over a light card had nothing to distinguish it from the
  // card. `on-scrim` is fixed in the same direction and for the same reason, so
  // a title cannot end up as dark ink on a dark band.
  //
  // No description fields on them, matching every other token file here. Style
  // Dictionary emits `$description` as a comment in the stylesheet the browser
  // downloads, and reasoning belongs in the source rather than in the artifact.
  //
  // The dark platform's filter below keeps only tokens from color.dark, so these
  // are emitted once under :root and never overridden. That is the whole
  // mechanism, and it is worth naming: a colour is theme-varying here exactly
  // when the dark file re-declares it, which is also what the guard in
  // tests/unit/design-system.test.ts asserts.
  'tokens/semantic/color.json',
];

const platforms = (destination, selector, filter) => ({
  css: {
    transformGroup: 'css',
    prefix: 'ds',
    buildPath,
    // The dark build intentionally references Brand tokens it does not emit;
    // they resolve against :root at cascade time. Silence the expected warning.
    log: { warnings: 'disabled' },
    files: [
      {
        destination,
        format: 'css/variables',
        filter,
        options: { outputReferences: true, selector },
      },
    ],
  },
});

// Light: emit all three layers under :root.
const light = new StyleDictionary({
  source: [...base, 'tokens/semantic/color.light.json'],
  platforms: platforms('tokens.css', ':root'),
});

// Dark: emit ONLY the semantic colour overrides.
const dark = new StyleDictionary({
  source: [...base, 'tokens/semantic/color.dark.json'],
  platforms: platforms('tokens.dark.css', '[data-theme="dark"]', (token) =>
    token.filePath.includes('color.dark'),
  ),
});

await light.buildAllPlatforms();
await dark.buildAllPlatforms();
