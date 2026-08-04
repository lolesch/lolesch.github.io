// Relative luminance and contrast ratio, WCAG 2.2. Lifted verbatim from
// tests/unit/contrast.test.ts, which now imports it: the table a reader sees
// and the table the build enforces are one calculation, so they cannot
// disagree about a number.

const luminance = (hex: string) => {
  const digits = hex.trim().replace('#', '');
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits;
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const channels = (hex: string) => {
  const digits = hex.trim().replace('#', '');
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

/**
 * What a translucent layer actually becomes once it is painted over something.
 *
 * Added for the title scrim on a project card, which is the one surface on this
 * site where text sits over an image rather than over a token. Alpha compositing
 * in CSS happens in sRGB, so this multiplies the encoded bytes rather than the
 * linear values `luminance` works in. That is not a shortcut: matching what the
 * browser does is the whole point, and doing it "properly" in linear space would
 * compute a colour the screen never shows.
 *
 * `over` is the pixel underneath. For a photograph the caller passes the worst
 * one that could be there rather than one that is, which is what turns an
 * unknowable ratio into a bound.
 */
/**
 * The two ends of the sRGB gamut, for bounding a composite against an image.
 *
 * These are the one place in application code where a hex is not a token that
 * was never minted, and rule four of tests/unit/token-discipline.test.ts exempts
 * this file by name because of them. Nothing here is a design decision: black
 * and white are where the colour space stops, and a bound against "the worst
 * pixel an image could contain" has to name them. Minting Semantic roles for
 * them would put two colours in the system that the site never renders, which is
 * the inventory the restraint claim on /design-system is about.
 *
 * Which one is the worst depends on the text, not on the image: the hostile
 * pixel is whichever end drags the scrim towards the colour of the glyphs.
 */
export const GAMUT = { black: '#000000', white: '#ffffff' } as const;

export const composite = (layer: string, alpha: number, over: string) => {
  const [a, b] = [channels(layer), channels(over)];
  const mixed = a.map((c, i) => Math.round(alpha * c + (1 - alpha) * b[i]));
  return `#${mixed.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};
