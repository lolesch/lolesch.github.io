'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Read what the pre-paint script already decided, rather than deciding again.
  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? 'light');
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // aria-pressed stays undefined until the client knows the real theme, so
      // the button never announces a state that contradicts what is on screen.
      aria-pressed={theme === 'dark' ? true : theme === 'light' ? false : undefined}
      // 1.5rem tall, which is the 24px floor for a target (WCAG 2.2 SC 2.5.8).
      // The switch sets that height and the label rides in the same row, so the
      // whole control is the target rather than the graphic alone.
      className="group flex items-center gap-tight rounded-control type-meta text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-interactive"
    >
      {/*
        The label names the setting, not the action. It read "Light mode" while
        the site was dark, which is what a button that performs an action says;
        a control that reports a state has to name the state it is of. The
        switch beside it carries on and off, so the label no longer has to
        change at all, and the text no longer swaps at hydration.
      */}
      Dark mode

      {/*
        A track and a knob. What this replaces was a bordered rectangle with a
        word in it, sitting one gap away from three bordered-on-hover links, and
        nothing about it said it changed a setting rather than went somewhere.

        The three measurements are the control's own geometry rather than a
        spacing role: 2.5rem by 1.5rem with a 2px inset leaves a 1.125rem knob
        and exactly one `stack` of travel. Minting tokens for a control that
        appears once would be inventory, which is the argument the portrait's
        200px already makes on /about.
      */}
      <span
        aria-hidden="true"
        className="flex h-gap w-[2.5rem] items-center rounded-tag border border-border-interactive p-[0.125rem] group-hover:border-fg"
      >
        {/*
          Positioned from data-theme rather than from React state, so a
          returning visitor whose stored theme is dark never sees the knob start
          on the left and jump. That attribute is on <html> before first paint,
          set by the script in the root layout, which is the same reason the
          colours do not flash either. No base translate is declared, so there
          is one declaration rather than two racing on equal specificity.
        */}
        <span className="size-[1.125rem] rounded-tag bg-fg transition-transform motion-reduce:transition-none dark:translate-x-stack" />
      </span>
    </button>
  );
}
