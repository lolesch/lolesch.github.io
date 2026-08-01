import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CONTRAST_PAIRS, SEMANTIC_COLOURS } from '../../src/content/design-system';
import { lightVars, readTokens, resolve } from '../../src/lib/tokens';

const TOKENS = readTokens();

// Parsed straight from the file rather than from readTokens(), so this is an
// independent reading of the same source. A guard built from the thing it
// checks only proves the thing agrees with itself.
const darkNames = [
  ...readFileSync('src/styles/generated/tokens.dark.css', 'utf8').matchAll(/(--ds-[\w-]+):/g),
]
  .map((match) => match[1])
  .sort();

describe('the token model', () => {
  it('reads a real number of tokens, so the cases below are not vacuous', () => {
    expect(TOKENS.length).toBeGreaterThan(50);
  });

  it('puts every token in exactly one of the three layers', () => {
    const unplaced = TOKENS.filter(
      (token) => !['primitive', 'brand', 'semantic'].includes(token.layer),
    );
    expect(unplaced).toEqual([]);
  });

  // The Semantic arm is a catch-all, so on its own it can swallow a genuinely
  // unknown prefix and call it Semantic. This is what stops that: a new family
  // fails here until someone decides where on the page it belongs, which is a
  // decision no fallback should make quietly.
  it('recognises every Semantic family, so the catch-all cannot hide a new one', () => {
    const known = ['color', 'space', 'text', 'type', 'radius'];
    const unknown = [
      ...new Set(
        TOKENS.filter((token) => token.layer === 'semantic')
          .map((token) => token.family)
          .filter((family) => !known.includes(family)),
      ),
    ];
    expect(unknown).toEqual([]);
  });

  it('marks exactly the tokens the dark file re-declares as theme-varying', () => {
    const varying = TOKENS.filter((token) => token.darkValue !== null)
      .map((token) => token.name)
      .sort();
    expect(varying).toEqual(darkNames);
  });

  // outputReferences is what keeps the chain legible in the artifact, so the
  // dark side is a reference too. A literal here would mean the layer chain was
  // flattened for dark only, and the page would show a hex where every other
  // row shows a name.
  it('resolves each dark override through a reference rather than a literal', () => {
    const flattened = TOKENS.filter(
      (token) => token.darkValue !== null && token.darkReference === null,
    ).map((token) => token.name);
    expect(flattened).toEqual([]);
  });

  it('resolves a known chain end to end', () => {
    // Semantic -> Brand -> Primitive -> literal. Hardcoded on purpose: this is
    // the one case that asserts the resolver walks the whole chain rather than
    // returning the first var() it meets.
    const accent = TOKENS.find((token) => token.name === '--ds-color-accent');
    expect(accent?.reference).toBe('--ds-brand-accent');
    expect(accent?.value).toBe('#ac6513');
    expect(resolve('--ds-color-accent', lightVars())).toBe('#ac6513');
  });

  // A token may legitimately point at a variable this system does not own.
  // --ds-primitive-font-family-serif holds var(--font-headline), which
  // next/font declares on <html>. That is a leaf here: this file resolves the
  // token graph, not the whole page cascade. Following it would throw, because
  // the generated stylesheet has no such declaration and never will.
  it('stops at a var() that is not a token in this system', () => {
    const vars = new Map([
      ['--ds-type-body-family', 'var(--ds-primitive-font-family-sans)'],
      ['--ds-primitive-font-family-sans', 'var(--font-body)'],
    ]);
    expect(resolve('--ds-type-body-family', vars)).toBe('var(--font-body)');
  });

  it('throws on a token that is not declared, rather than returning a fallback', () => {
    // A page whose data step quietly returned nothing still renders every
    // heading and a set of neat empty boxes. Throwing is the feature.
    expect(() => resolve('--ds-color-nonexistent', lightVars())).toThrow(
      'is not declared in the generated tokens',
    );
  });
});

describe('the documented Semantic list cannot drift from the tokens', () => {
  const declared = TOKENS.filter((token) => token.family === 'color' && token.layer === 'semantic')
    .map((token) => token.name)
    .sort();
  const documented = SEMANTIC_COLOURS.map((entry) => entry.token).sort();

  // Both directions, because one direction catches half of drift. Adding a
  // token without documenting it and documenting one that was deleted are
  // different mistakes and they fail differently.
  it('documents every Semantic colour the generated CSS declares', () => {
    const undocumented = declared.filter((name) => !documented.includes(name));
    expect(undocumented).toEqual([]);
  });

  it('documents nothing the generated CSS does not declare', () => {
    const phantom = documented.filter((name) => !declared.includes(name));
    expect(phantom).toEqual([]);
  });

  it('gives every documented token a distinct utility', () => {
    const utilities = SEMANTIC_COLOURS.map((entry) => entry.utility);
    expect(new Set(utilities).size).toBe(utilities.length);
  });
});

describe('the contrast list', () => {
  // A renamed token would otherwise drop a row from the documented table in
  // silence, which is the failure this page exists to argue against.
  it('names only tokens the generated CSS declares', () => {
    const names = new Set(TOKENS.map((token) => token.name));
    const missing = CONTRAST_PAIRS.flatMap((pair) =>
      [pair.fg, pair.bg].filter((name) => !names.has(name)),
    );
    expect(missing).toEqual([]);
  });
});
