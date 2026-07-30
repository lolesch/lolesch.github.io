import type { Metadata } from 'next';
import { Source_Serif_4, Inter } from 'next/font/google';
import './globals.css';

const headline = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  // No em-dash (CLAUDE.md guardrail 5). The middot matches the metadata
  // separator already used in site_copy.md's tile lines.
  title: 'Leonid Schreiber · Design Engineer',
  description: 'I build systems that designers can understand and engineers can build.',
};

// Runs before first paint so the correct theme is on <html> with no flash.
// Inline because a deferred module would paint the wrong theme first.
const themeInit = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = stored || (dark ? 'dark' : 'light');
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${headline.variable} ${body.variable} font-sans`}>{children}</body>
    </html>
  );
}
