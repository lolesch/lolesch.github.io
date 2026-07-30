import StyleDictionary from 'style-dictionary';

const buildPath = 'src/styles/generated/';

// Every build sees the full Primitive + Brand graph plus theme-independent
// semantics. Only the theme-specific colour file changes between the two.
const base = [
  'tokens/primitive/**/*.json',
  'tokens/brand/**/*.json',
  'tokens/semantic/space.json',
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
