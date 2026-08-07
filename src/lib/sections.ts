/*
 * The link between a section's heading and the anchor that reaches it.
 *
 * Derived rather than authored. A `id` field on the Section record was the
 * obvious alternative and it was rejected for one reason: two fields that have
 * to agree eventually do not, and the failure is silent. A heading edited
 * without its id is a table of contents entry pointing at the old name, which
 * looks fine in every screenshot and is wrong for whoever clicks it. Derived,
 * the two cannot come apart, because there is only one of them.
 *
 * The cost is that ids are not stable across a heading rewrite, so a link
 * someone bookmarked to #the-editor dies when that heading changes. That is the
 * right trade here: nothing outside this site links to a section anchor, and
 * a stale anchor is a worse thing to ship than a dead bookmark.
 */
export type SectionRef = { id: string; heading: string };

/*
 * Lowercase, and every run of anything that is not a letter or a digit becomes
 * a single hyphen. Apostrophes go the same way as spaces, so "Where I'm going"
 * becomes `where-i-m-going`. That is uglier than dropping them would be and it
 * is deliberate: a rule with one case is a rule nobody has to remember, and the
 * string is never read by a person.
 *
 * Collisions are possible in principle, because two sections on one page could
 * be headed the same thing. tests/unit/section-contents.test.ts asserts they
 * are not, which is the check that belongs in a test rather than in a
 * disambiguating suffix here: two identically headed sections on one page is a
 * content problem, and silently renaming one to `-2` would hide it.
 */
export const sectionId = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/*
 * The contents of a page, in the order it reads them. Takes the same array the
 * page renders from, so the rail and the headings are one list rather than two
 * that match today.
 *
 * Structurally typed on `heading` alone rather than on Section, so it also
 * serves anything else that grows a heading later without importing the content
 * model into a layout helper.
 */
export const contentsOf = (sections: readonly { heading: string }[]): readonly SectionRef[] =>
  sections.map((section) => ({ id: sectionId(section.heading), heading: section.heading }));
