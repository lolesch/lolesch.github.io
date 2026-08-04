import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/*
 * The one guard in this repo that reads the compiled stylesheet rather than the
 * markup, and it exists because of a bug it would have caught.
 *
 * `motion-safe:motion-state` was written on the thumbnail and Tailwind emitted
 * it with the variant's media query silently *dropped*: the role already
 * contains an at-rule of its own, and the two could not be nested. Nothing
 * failed. The class name was in the markup, the utility was in the stylesheet,
 * the page looked right, and a reader auditing the source would have concluded
 * something the browser never did.
 *
 * That is the shape of failure this file is for. Every other motion decision on
 * the site is a media query that most people never trigger, so the difference
 * between working and not working is invisible to everyone who is not affected
 * by it. Asserting the class names appear in the HTML proves nothing about any
 * of it; only the compiled CSS says what the browser will do.
 */

const stylesheet = () => {
  const files = globSync('out/_next/static/**/*.css');
  // A glob that matched nothing would make every case below vacuous, and the
  // hashed path this depends on is exactly the kind of thing a framework
  // upgrade moves.
  expect(files.length).toBeGreaterThan(0);
  return files.map((file) => readFileSync(file, 'utf8')).join('\n');
};

/*
 * Minified CSS is one line, so the at-rule a declaration sits in cannot be read
 * by looking near it. This walks the braces from the top and returns, for each
 * rule whose selector contains the needle, the `@media` conditions wrapping it.
 *
 * Only `@media`. The first draft collected every at-rule and the cases below
 * started arguing with `@layer utilities`, which is Tailwind's cascade
 * bookkeeping and has nothing to do with what these tests ask. A helper that
 * reports more than the question needs makes the assertions describe the build
 * tool instead of the decision.
 */
const mediaAround = (css: string, needle: string) => {
  const found: string[][] = [];
  const stack: string[] = [];
  let depth = 0;
  let token = '';

  for (const char of css) {
    if (char === '{') {
      const head = token.trim();
      stack[depth] = head.startsWith('@media') ? head : '';
      depth += 1;
      token = '';
      if (!head.startsWith('@') && head.includes(needle)) {
        found.push(stack.slice(0, depth).filter(Boolean));
      }
      continue;
    }
    if (char === '}') {
      depth = Math.max(0, depth - 1);
      token = '';
      continue;
    }
    // A statement at-rule (`@layer a,b;`) never opens a block, so the accumulator
    // has to be cleared at the semicolon or its text leaks into the next head.
    if (char === ';') {
      token = '';
      continue;
    }
    token += char;
  }
  return found;
};

describe('the motion role, as compiled', () => {
  const css = stylesheet();

  it('emits the role at the tempo the tokens declare', () => {
    const unconditional = mediaAround(css, '.motion-state').filter(
      (conditions) => conditions.length === 0,
    );
    expect(unconditional.length, 'the role never applies outside a media query').toBeGreaterThan(0);
    expect(css).toContain('transition-duration:var(--ds-motion-state)');
    expect(css).toContain('transition-timing-function:var(--ds-motion-ease)');
  });

  // The reduced-motion arm is the half nobody sees. It is written inside the
  // role in globals.css precisely so no call site has to remember it, and this
  // is what proves the arrangement survived the build.
  it('carries its own reduced-motion arm rather than leaving it to a call site', () => {
    const wrapped = mediaAround(css, '.motion-state').some((conditions) =>
      conditions.some((condition) => condition.includes('prefers-reduced-motion:reduce')),
    );
    expect(wrapped).toBe(true);
  });

  // The bug this file was written for. If the variant is ever dropped again the
  // thumbnail scales for a visitor who asked for less motion, and nothing else
  // in the suite would notice.
  it('gates the thumbnail lift behind no-preference, with the variant intact', () => {
    const matches = mediaAround(css, 'scale-\\[1\\.04\\]');
    expect(matches.length).toBeGreaterThan(0);
    for (const conditions of matches) {
      expect(conditions.join(' '), 'the scale escaped its reduced-motion guard').toContain(
        'prefers-reduced-motion:no-preference',
      );
    }
  });
});

/*
 * The other half of "a state is never carried by motion alone". The thumbnail
 * lift is the part a reduced-motion visitor loses, so the border promotion has
 * to be reachable without it, which means it must not sit inside any
 * motion-conditional at-rule.
 */
describe('the card state survives without motion', () => {
  const css = stylesheet();

  it('promotes the card border outside every motion query', () => {
    const matches = mediaAround(css, 'has-\\[a\\:hover\\]\\:border-fg');
    expect(matches.length).toBeGreaterThan(0);
    for (const conditions of matches) {
      expect(conditions.join(' ')).not.toContain('prefers-reduced-motion');
    }
  });
});
