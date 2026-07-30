import { readFileSync } from 'node:fs';

export const raw = (page: string) => readFileSync(page, 'utf8');

// Next inlines the RSC flight payload into <script> tags and it repeats the page
// copy verbatim. Any assertion about what a visitor can actually read has to
// exclude it, or the assertion passes on script data while the markup is empty.
export const rendered = (page: string) => raw(page).replace(/<script[\s\S]*?<\/script>/g, '');

// What a visitor actually reads, with <head> dropped. Use this for assertions
// about page copy. <meta name="description"> legitimately reuses a tile line:
// someone arriving from a search result or a link unfurl has not seen the tile,
// so the no-repeat rule does not reach into <head>.
export const body = (page: string) => rendered(page).match(/<body[\s\S]*<\/body>/)?.[0] ?? '';

// The five characters React escapes in text children and attributes. Decoded in
// one pass rather than five, so a decoded `&amp;` cannot be re-decoded into
// something else.
const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#x27;': "'",
};

// The copy as it was authored. Use this to assert that a sentence reached the
// page: an apostrophe ships as &#x27;, so comparing a content string against
// raw markup fails on punctuation and pushes the assertion towards matching a
// fragment instead of the sentence. A fragment still passes when the rest of
// the sentence is gone, which is a weaker guard than it looks.
export const text = (page: string) =>
  body(page).replace(/&(?:amp|lt|gt|quot|#x27);/g, (entity) => ENTITIES[entity]);
