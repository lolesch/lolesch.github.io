import { readFileSync } from 'node:fs';

export const raw = (page: string) => readFileSync(page, 'utf8');

// Next inlines the RSC flight payload into <script> tags and it repeats the page
// copy verbatim. Any assertion about what a visitor can actually read has to
// exclude it, or the assertion passes on script data while the markup is empty.
export const rendered = (page: string) => raw(page).replace(/<script[\s\S]*?<\/script>/g, '');
