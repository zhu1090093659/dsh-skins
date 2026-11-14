# Agent Note: dsh-message-edit leaves the semantic attr contract

Status: implemented

## Problem

The family repository removed the `dsh-message-edit` plugin outright: it forked a branch session per edit and offered nothing the official composer pipeline lacks, so its package, aggregate row and every documentation reference are gone. The skin repository's contract still enumerated it — `contracts/semantic-attrs-v1.md` carried two `data-dsh-part` rows (`entry`, `editor`) and one `data-dsh-plugin` row for it. No DOM stamps those attributes now that the plugin is uninstalled, so the rows describe styling surface that cannot exist.

## Decision

**The contract stops naming dsh-message-edit.** The two part rows and the plugin row are deleted, and the group headings are recounted against the tables that remain: part 组 99 to 97 rows, plugin 组 17 to 16 owners. No skin CSS referenced the plugin — the only hits outside the contract were frozen release notes — so no selector cleanup was needed.

## Alternatives considered

- **Keep the rows for profiles that still run an older bundle.** Rejected: the plugin is removed from the family rather than deprecated in place, and a contract that enumerates unstamped attributes invites skins to style ghosts.
- **Mark the rows deprecated instead of deleting them.** Rejected: the enum's value is exactly "what is stamped at runtime"; a deprecated row reads as still-stamped to a skin author.

## Consequences

`pnpm skin-center:check`, `pnpm skin-hooks:check`, `pnpm test` and `pnpm typecheck` pass; the built `lib/` is untouched because no source or skin asset changed. A future plugin removal repeats this shape: delete the part and plugin rows, recount the headings, and sweep the skins for selectors naming the plugin.
