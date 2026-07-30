import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { rendered } from './rendered';

// Enumerated, not "similar markers". Deliberately absent: a bare [...], which
// is the standard elision mark inside a quotation, and these case studies quote
// their sources heavily. A guard that cries wolf on legitimate copy gets
// disabled, and then it guards nothing.
//
// This is a spell-check, not a tone check. It says nothing about whether copy
// is good, and anything newly authored still owes a tone_of_voice.md pass.
const MARKERS: Array<[RegExp, string]> = [
  [/\[[A-Z][A-Z ]+\]/g, 'bracketed-caps placeholder'],
  [/\bTODO\b/g, 'TODO'],
  [/\bTBD\b/g, 'TBD'],
  [/\bFIXME\b/g, 'FIXME'],
  [/\bXXX\b/g, 'XXX'],
  [/Lorem ipsum/gi, 'lorem ipsum filler'],
];

describe('no placeholder reaches the export', () => {
  it('finds no placeholder marker on any exported page', () => {
    const pages = globSync('out/**/*.html');

    // Guards against the whole test passing because the glob matched nothing.
    expect(pages.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const page of pages) {
      const text = rendered(page);
      for (const [pattern, what] of MARKERS) {
        const hits = text.match(pattern);
        if (hits) {
          violations.push(`${page} carries a ${what}: ${[...new Set(hits)].join(', ')}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
