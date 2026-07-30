import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const light = readFileSync('src/styles/generated/tokens.css', 'utf8');
const dark = readFileSync('src/styles/generated/tokens.dark.css', 'utf8');

describe('token pipeline (Seam 1)', () => {
  it('emits all three layers into :root', () => {
    expect(light).toContain(':root {');
    expect(light).toMatch(/--ds-primitive-/);
    expect(light).toMatch(/--ds-brand-/);
    expect(light).toMatch(/--ds-color-/);
  });

  it('keeps the layer chain visible as nested var() calls', () => {
    // This is also the propagation guarantee the PRD asks for: because Semantic
    // points at Brand by reference rather than by value, any Brand change
    // propagates through the CSS cascade by construction.
    expect(light).toMatch(/--ds-color-bg:\s*var\(--ds-brand-paper\)/);
    expect(light).toMatch(/--ds-brand-paper:\s*var\(--ds-primitive-neutral-0\)/);
  });

  it('re-declares only the Semantic layer for dark', () => {
    expect(dark).toContain('[data-theme="dark"]');
    expect(dark).toMatch(/--ds-color-bg:\s*var\(--ds-brand-paper-inverse\)/);
    // No Primitive is referenced or declared in the dark override at all.
    expect(dark).not.toMatch(/--ds-primitive-/);
    // Brand may be *referenced* by dark, but never *declared* there.
    expect(dark).not.toMatch(/--ds-brand-[\w-]+:/);
  });

  it('gives light and dark identical Semantic keys, so no component branches on theme', () => {
    const keys = (css: string) =>
      [...css.matchAll(/(--ds-color-[\w-]+):/g)].map((m) => m[1]).sort();
    expect(keys(dark)).toEqual(keys(light));
  });
});
