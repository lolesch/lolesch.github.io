import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The generated stylesheets are where Primitive and Brand legitimately live.
const GENERATED = 'src/styles/generated/';

describe('token discipline', () => {
  it('never reaches past the Semantic layer from application code', () => {
    const files = globSync('src/**/*.{ts,tsx,css}').filter(
      (f) => !f.replaceAll('\\', '/').includes(GENERATED),
    );

    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      const offenders = source.match(/--ds-(primitive|brand)-[\w-]+/g) ?? [];
      expect(
        offenders,
        `${file} reaches past the Semantic layer: ${offenders.join(', ')}`,
      ).toEqual([]);
    }
  });
});
