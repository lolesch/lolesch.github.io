import { describe, expect, it } from 'vitest';
import { rollhausArchitecture } from '../../src/content/figures/rollhaus-architecture';

// Figure copy is authored prose that ships on a page, but it lives outside the
// Project records, so every guard in content.test.ts walks straight past it.
// This is where the same rules reach it.
const strings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
};

const FIGURE_COPY = [['rollhaus-architecture', rollhausArchitecture]] as const;

describe('figure copy', () => {
  for (const [id, figure] of FIGURE_COPY) {
    describe(id, () => {
      const copy = strings(figure);

      it('walks a real amount of copy, so the rules below are not vacuous', () => {
        expect(copy.length).toBeGreaterThan(20);
      });

      it('uses no em-dash', () => {
        for (const line of copy) {
          expect(line, `${id} uses an em-dash`).not.toContain('—');
        }
      });
    });
  }
});
