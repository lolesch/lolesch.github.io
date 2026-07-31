import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
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
    const known = ['color', 'space', 'text', 'radius'];
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
    expect(accent?.value).toBe('#b45309');
    expect(resolve('--ds-color-accent', lightVars())).toBe('#b45309');
  });

  it('throws on a token that is not declared, rather than returning a fallback', () => {
    // A page whose data step quietly returned nothing still renders every
    // heading and a set of neat empty boxes. Throwing is the feature.
    expect(() => resolve('--ds-color-nonexistent', lightVars())).toThrow(
      'is not declared in the generated tokens',
    );
  });
});
