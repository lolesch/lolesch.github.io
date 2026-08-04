import type { Lens } from '@/content/types';

/**
 * Extracted from src/components/project-tile.tsx on 2026-08-04, when
 * /design-system gained a gallery of the components in place.
 *
 * The extraction is the point rather than tidiness. A gallery that reproduced
 * this markup would be documenting a copy, and a copy drifts: the page whose
 * argument is that nothing on it is transcribed by hand cannot show a
 * hand-transcribed chip. One component, two call sites, no way for them to
 * disagree.
 */
export function LensChip({ lens }: { lens: Lens }) {
  return (
    <li
      // Text, never colour-coded alone: the lens name is the label and the
      // colour is a second channel on top of it. `capability` is the role,
      // because gold marks what someone was and green marks what they can do. It
      // sits on `bg` rather than inside a filled panel, which is 4.02:1 in light.
      //
      // Horizontal inset only. A uniform `tight` inset read as tall and narrow,
      // because a full radius spends the horizontal space on the curve and
      // `meta`'s line box already supplies the height. So the height comes from
      // the role and the width is set here, which is the one of the two a
      // capsule actually has to decide.
      className="rounded-tag border border-capability px-stack type-meta text-capability"
    >
      {lens}
    </li>
  );
}
