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
      // border-muted, not border-border: WCAG 2.2 SC 1.4.11 wants 3:1 for a
      // control's boundary, and `border` is the decorative-rule token (1.48:1
      // on paper). Measured 4.83:1 light / 11.99:1 dark with `muted`.
      className="rounded border border-muted px-2 py-1 text-sm text-muted hover:border-fg hover:text-fg"
    >
      {theme === 'dark' ? 'Light' : 'Dark'} mode
    </button>
  );
}
