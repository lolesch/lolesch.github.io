import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

// In the layout rather than on Home, so a project route gets the theme toggle
// and a way back without repeating either.
export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-3xl items-center justify-between px-gutter pt-gutter">
      <Link href="/" className="font-serif text-body hover:underline">
        Leonid Schreiber
      </Link>
      <ThemeToggle />
    </header>
  );
}
