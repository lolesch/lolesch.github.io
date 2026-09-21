# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone. This repo is `lolesch/lolesch.github.io`.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --comments` and `gh pr diff <number>` for the diff.
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` then keep only `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE` (drop `OWNER`/`MEMBER`/`COLLABORATOR`).
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either — resolve with `gh pr view 42` and fall back to `gh issue view 42`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Wayfinding operations

How the `wayfinder` skill's concepts map onto this tracker. Worked out and verified on 2026-08-28 while charting the German-version map (#3).

GitHub supports **native sub-issues and native issue dependencies**, so neither needs a body convention. Both are REST-only: `gh issue` has no subcommand for either.

**Both APIs take a database `id`, not an issue number**, and both need `-F` (typed) rather than `-f` (string), which returns a 422 saying the value "is not of type integer".

```bash
# database id for an issue number
gh api repos/lolesch/lolesch.github.io/issues/<number> --jq '.id'
```

| Concept | Operation |
| --- | --- |
| The map | An issue labelled `wayfinder:map` |
| Ticket is a child of the map | `gh api --method POST repos/OWNER/REPO/issues/<map>/sub_issues -F sub_issue_id=<child-id>` |
| List the map's tickets | `gh api repos/OWNER/REPO/issues/<map>/sub_issues --jq '.[] \| "#\(.number) \(.title)"'` |
| Ticket A blocks ticket B | `gh api --method POST repos/OWNER/REPO/issues/<B>/dependencies/blocked_by -F issue_id=<A-id>` |
| What blocks a ticket | `gh api repos/OWNER/REPO/issues/<n>/dependencies/blocked_by --jq '[.[].number] \| join(", ")'` |
| Claim a ticket | `gh issue edit <n> --add-assignee @me`, before any work |
| Resolve a ticket | `gh issue close <n> --comment "..."`, then append a line to the map's Decisions-so-far |

**Frontier query.** GitHub has no single filter for "open, unblocked, unassigned", so compute it: list the map's sub-issues, then keep the open ones whose `blocked_by` is empty and which carry no assignee.

```bash
for n in $(gh api repos/OWNER/REPO/issues/<map>/sub_issues --jq '.[] | select(.state=="open" and .assignee==null) | .number'); do
  [ -z "$(gh api repos/OWNER/REPO/issues/$n/dependencies/blocked_by --jq '[.[].number] | join(",")')" ] && echo "frontier: #$n"
done
```

**Ticket type labels** are `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, `wayfinder:task`. All five wayfinder labels exist in this repo.
