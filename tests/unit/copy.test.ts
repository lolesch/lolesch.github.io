// tsc does not know import.meta.glob: it is a Vite feature, and vitest
// transpiles without typechecking, so `npm test` is green while `npm run
// typecheck` is not. This is the narrow reference rather than "vite/client",
// which would also pull in Vite's `declare module '*.svg'` and friends and put
// them next to Next's own. skipLibCheck would hide that clash rather than
// report it, which is the kind of quiet thing this repo keeps a log about.
/// <reference types="vite/types/importMeta.d.ts" />
import { describe, expect, it } from 'vitest';

// import.meta.glob rather than a registered list. Vitest processes this file
// through Vite, so the pattern resolves at transform time against the real
// filesystem: a new content module is inside this guard the moment it exists,
// with nothing for a future session to remember. Eager, so every module is
// imported at collect time and a broken one fails loudly here.
//
// This is the structural answer to a gap _build-log.md records three times.
// Figure captions escaped the guards, then constraints label/value pairs, then
// a figure's alt. Each was patched where it escaped. Every rule in
// content.test.ts iterates `projects`, so anything that is not a project ships
// past all of them. This walks whatever is there instead.
const MODULES = import.meta.glob('../../src/content/**/*.ts', { eager: true });

// Path alongside value, so a failure names the field rather than the file.
const strings = (value: unknown, path: string): Array<[string, string]> => {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => strings(item, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => strings(item, `${path}.${key}`));
  }
  return [];
};

const COPY = Object.entries(MODULES).flatMap(([file, module]) =>
  strings(module, file.replace('../../', '')),
);

// It also walks strings that are not copy: slugs, image paths, figure ids, and
// the literal hex values in src/content/figures/rollhaus-architecture.ts. That
// is harmless, because none of them can contain an em-dash or a placeholder
// marker either. A narrower walk would need a registry, which is the thing
// that failed three times.
const RULES: Array<[RegExp, string]> = [
  [/—/, 'an em-dash'],
  // Enumerated, not "similar markers", matching tests/export/placeholders.ts.
  // A bare [...] is deliberately absent: it is the elision mark inside a
  // quotation, and a guard that cries wolf on legitimate copy gets disabled.
  [/\[[A-Z][A-Z ]+\]/, 'a bracketed-caps placeholder'],
  [/\bTODO\b/, 'a TODO'],
  [/\bTBD\b/, 'a TBD'],
  [/\bFIXME\b/, 'a FIXME'],
  [/Lorem ipsum/i, 'lorem ipsum filler'],
];

describe('content copy', () => {
  it('reaches more than one content module, so the glob is not silently empty', () => {
    expect(Object.keys(MODULES).length).toBeGreaterThan(1);
  });

  it('walks a real amount of copy, so the rules below are not vacuous', () => {
    expect(COPY.length).toBeGreaterThan(100);
  });

  it('carries no em-dash and no placeholder marker anywhere', () => {
    const violations = COPY.flatMap(([path, text]) =>
      RULES.filter(([pattern]) => pattern.test(text)).map(([, what]) => `${path} carries ${what}`),
    );
    expect(violations).toEqual([]);
  });
});
