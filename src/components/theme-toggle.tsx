'use client';

/*
 * No state and no effect, which is the second half of the fix that put the knob
 * on data-theme. The theme lives on <html>, written before first paint by the
 * script in the root layout, and everything this control shows is derived from
 * it in CSS. Reading it back into React gave the server a value it cannot know
 * and the first render a state it then had to correct, which is why the label
 * had to be a constant to avoid flashing: it was the only string safe to render
 * before hydration told it the truth.
 */
export function ThemeToggle() {
  function toggle() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // No aria-pressed. The accessible name below states the mode and the
      // action outright, which is more than a pressed state says and is never
      // wrong in one theme: "Light mode, not pressed" is a contradiction,
      // because light mode is exactly what is on.
      //
      // 1.5rem tall, which is the 24px floor for a target (WCAG 2.2 SC 2.5.8).
      // The switch sets that height and the label rides in the same row, so the
      // whole control is the target rather than the graphic alone.
      className="group flex items-center gap-tight rounded-control type-meta text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-interactive"
    >
      {/*
        Both labels ship and CSS shows one, so the control reads correctly at
        first paint instead of after hydration. Each span only ever sets itself
        to display:none and never competes to set it back, so there is no pair
        of equal-specificity rules racing to decide which one wins.

        The name gives the mode and then the action. That is what a screen
        reader needs, and it is what SC 2.5.3 needs: the visible words are the
        start of the accessible name rather than a different string from it.
      */}
      <span className="dark:hidden">
        Light mode<span className="sr-only">. Switch to dark mode</span>
      </span>
      <span className="not-dark:hidden">
        Dark mode<span className="sr-only">. Switch to light mode</span>
      </span>

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
        <span className="size-[1.125rem] rounded-tag bg-fg transition-transform motion-reduce:transition-none dark:translate-x-stack" />
      </span>
    </button>
  );
}
