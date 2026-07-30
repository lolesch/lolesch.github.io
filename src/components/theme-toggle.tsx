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
      // border-interactive is the token for exactly this: WCAG 2.2 SC 1.4.11
      // wants 3:1 for a control's boundary, and `border` is the decorative-rule
      // token at 1.48:1. This previously borrowed `muted`, which is a *text*
      // colour, and measured 11.99:1 in dark. That is a loud hairline on a site
      // whose one anti-brand constraint is "never cluttered". Now 4.83:1 light
      // and 3.67:1 dark, held there by tests/unit/contrast.test.ts.
      className="rounded-control border border-border-interactive p-tight text-meta text-muted hover:border-fg hover:text-fg"
    >
      {theme === 'dark' ? 'Light' : 'Dark'} mode
    </button>
  );
}
