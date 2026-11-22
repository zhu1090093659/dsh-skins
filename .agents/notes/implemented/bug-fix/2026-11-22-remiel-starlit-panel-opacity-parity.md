# Agent Note: remiel-starlit 0.1.2 panel-opacity parity

Status: implemented

## Problem

`#108` (`fix(remiel-starlit): pin panel opacity so macOS and Windows match (0.1.2)`) was returned on 2026-11-13 with five actionable items: the Windows titlebar selector `[data-windows-titlebar]::before` could never match once `transformSkinCss` prefixed every selector with `html[data-dsh-skin=...]`; the sidebar lock carried no `:not([data-sidebar-drawer])` / `:not([data-sidebar-collapsed])` guard, so the drawer lost its blur and the sub-768px collapsed rail grew a 52px translucent strip; `:global(.aionui-*)` is not browser syntax and dropped the whole `button, a` rule group; `[data-gitgraph-chip]` selectors had no producer after `dsh-git-graph` was retired; `skin.json` `noticeUrl` still pointed at the pre-split `dsh-web` path. The re-review had to confirm all five were fixed and re-run the content gates without a Windows machine.

## Decision

Merged as `5076bc36` (squash, head `e89440a`). All five items verified by source comparison rather than a Windows run:

- The titlebar rule now anchors `[data-dsh-frame]::before` (`patches.css:326-329`, `:331-334`). The host paints the drag strip through `.frame::before` and only the `[data-windows-titlebar]` branch gives that pseudo-element `content: ''` (`AppFrame.module.css:40-47`), so on macOS the rule matches nothing while on Windows it locks the strip to the sidebar value.
- The sidebar lock carries `[data-dsh-frame]:not([data-sidebar-drawer]):not([data-sidebar-collapsed])` (`patches.css:295-307`). Both attributes sit on the frame element itself, so the lock and the compatibility layer's `background: transparent !important` for the collapsed rail no longer overlap.
- `:global(` count is 0, `data-gitgraph` count is 0, `noticeUrl` points at `dsh-skins/main`, and `skin.json` plus both READMEs say 0.1.2.
- The pinned values are the author's macOS composite: light sidebar 0.74 x 40% is about 0.299, pinned to 0.30; dark tint 0.58 x 50% is 0.29; the Windows frame layer is neutralised to transparent so the centre column lands on 0.62 / 0.48.

Content gates: the PR body carries the four template sections with refreshed PNG evidence, `LICENSE` and `NOTICE` keep the Zenless Zone Zero / miHoYo attribution and the non-commercial note, and the four images (two evidence frames, two previews) were reviewed in one batch. Contrast and blending are unchanged from the 0.1.1 approval, so the aesthetic gate passes.

## Alternatives considered

**Hold the merge until 0.1.3 adds a `prefers-reduced-transparency: reduce` block.** Rejected: the new `!important` does override the host's 90%-opaque fallback (`AppFrame.module.css:141-148`), but this is a style pack whose contract is a fixed glass look, both themes stay readable in the evidence, and the reduced-transparency value was already unreachable in the reviewed revision. A fourth round trip for a one-line follow-up costs more than deferring it, so it is recorded as a 0.1.3 item on the PR.

**Rebase the contributor branch onto current main before merging.** Rejected: main had moved 7 commits, all inside unrelated skin directories; `git merge-tree` produced a clean merge whose `patches.css` is byte-identical to the PR head, and the ruleset does not require strict status checks, so the GitHub merge carries exactly the code CI validated.

## Consequences

- `dsh-skins` main is at `5076bc36`; `dsh-web` must move the `satellites/dsh-skins` pin and rebuild `market/dist`.
- Deferred to 0.1.3 and listed on the PR: the reduced-transparency override, the `[data-dsh-surface=...]` selectors that have no producer (kept as fallbacks), and the Linux/Web sidebar shifting from 0.74 to 0.30 as part of the parity decision.
- Windows titlebar and sub-768px states still have no screenshot evidence; the author reports no Windows machine.
