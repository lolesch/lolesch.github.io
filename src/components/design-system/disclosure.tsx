import type { ReactNode } from 'react';

/**
 * A native <details>, which is the whole reason this exists rather than a
 * client component with a `useState`. The page is a Server Component and ships
 * no JS of its own; a disclosure that needed some would be the one place on the
 * site where documenting the system cost more than using it.
 *
 * Added 2026-08-04 to demote the token inventory. The full Primitive and Brand
 * grids and the per-role type properties are the proof behind this page's claim
 * that nothing on it is transcribed by hand, and they were also the first three
 * screens of it. <details> keeps them in the exported markup, which is what the
 * guards in tests/export/design-system.test.ts read, and out of the scan path.
 */
export function Disclosure({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="mt-gap rounded-card border border-border p-gutter">
      {/*
        The marker stays. A disclosure whose triangle is hidden has to invent
        its own affordance, and the one this replaces would then be a chevron
        drawn to look like the thing the browser already draws.

        `cursor-pointer` because Chrome does not set it on a summary, and a
        control that does not say it is a control under the pointer is the same
        miss the theme toggle's rewrite records.
      */}
      <summary className="cursor-pointer rounded-control type-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-interactive">
        {summary}
      </summary>
      {children}
    </details>
  );
}
