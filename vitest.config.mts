import { defineConfig } from 'vitest/config';

// .mts, not .ts: this package is not `"type": "module"` (Next's scaffold omits
// it), so a .ts config gets loaded as CommonJS and Vite warns that the ESM
// syntax here is unsupported by its future default config loader.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
