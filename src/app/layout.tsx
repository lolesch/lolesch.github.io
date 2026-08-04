import type { Metadata } from 'next';
import { Source_Serif_4, Inter } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
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
  // Descriptive rather than the h1, which the headline rewrite on 2026-08-04
  // made necessary: "The hard part happens before anyone starts building." is a
  // point of view, and a search result carrying only that says nothing about
  // whose page it is. A description is read out of context, so it names the
  // person and the contents; the headline is read in context and does not have
  // to.
  description:
    'Portfolio of Leonid Schreiber, UX/UI designer in Berlin. Case studies in UX, design systems and interaction, plus the design system this site runs on.',
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
    <html
      lang="en"
      data-theme="light"
      // On <html> rather than <body>, which is where next/font's own examples
      // put it. A custom property is substituted where it is declared, and the
      // font family Primitives are declared in :root. With these one element
      // lower, those tokens would compute to nothing and every role's family
      // would silently fall back to the browser default.
      //
      // The tokens are described rather than named here on purpose: the
      // discipline guard reads comments, and it caught the first draft of this
      // one. See the same note at the top of src/lib/tokens.ts.
      className={`${headline.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <SiteHeader />
        {/*
          The frame, once, rather than on each page's <main>. Every route sits
          in the same 64rem box with the same gutter, so a page decides only how
          wide its own content is inside that: `measure` for the ones that are
          reading, nothing for Home, which has a grid that takes the lot.

          Hoisted here on 2026-08-02 because the alternative was `frame mx-auto
          px-gutter` repeated on four <main> elements, each with a `measure`
          wrapper inside it. This way the left edge of every page is decided in
          one place, and it is the same edge the header's wordmark sits on.
        */}
        <div className="frame mx-auto px-gutter">{children}</div>
      </body>
    </html>
  );
}
