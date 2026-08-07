// Content is the game repo's own, from Docs/agents/night-shift.md, confirmed
// against real branches: night-base, night/2026-07-01 and night/2026-07-02 all
// exist via `git branch -a`.
export const glyphsheroNightShift = {
  title: 'Day shift, night shift',
  standfirst:
    'One backlog, read by two sessions with different authority. The night shift only touches what the day shift has already cleared to hand off.',

  shifts: [
    {
      name: 'Day shift',
      where: 'Interactive, on main',
      role: 'Has priority and authority. Curates the backlog and decides what the night runner is allowed to touch.',
    },
    {
      name: 'Night shift',
      where: 'Unattended, on night-base',
      role: 'Only ever pulls an issue labeled ready-for-agent. Work lands on a night/<date> branch, never on main.',
    },
  ],

  protocolLabel: "Park, don't guess: what happens when the runner hits an undecided fork mid-task",
  protocol: [
    'Commit only the already-decided safe part',
    'Open a needs-design issue capturing the fork',
    'Strip ready-for-agent from the original issue',
    'Move to the next eligible issue',
  ],

  footnote:
    'Nothing reaches main on its own. A human reads the morning summary, runs the Unity Test Runner (the one step the agent cannot do), and merges only what survives review.',
} as const;
