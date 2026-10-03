# Agent Note: Midnight Contract skin pair

Status: implemented

## Problem

The contributor requested two character-led skins with extensive generated UI materials rather than a palette-only reskin. The selected castle and city backgrounds both place the character on the left, whereas the original concept placed the character on the right. Default desktop settings navigation also consumes most of a narrow viewport.

## Decision

Submit two independently installable v2 pure-asset directories generated with the standard scaffolder. Keep each supplied background byte-for-byte and remove the sidebar portrait per the latest contributor request. Place the empty-state composer to the right on desktop, preserve its native shrink behavior when details are open, and use horizontal settings navigation below 600px. Generated assets decorate the existing workspace, form, menu, toggle, card and composer controls; there are no hooks, model changes or DOM mutations. Prefer semantic attributes and disclose the bounded class-suffix L3 seams in each README.

The official rc.1 renderer does not attach a message-body part to assistant Markdown or a tool-card part to tool views. Use actual assistant-step/tool-call flow kinds and their official slots, with a small body/bubble suffix seam where necessary. Code blocks expose stable banner/content attributes. Session-header is a display:contents wrapper, so its actual header receives the opaque title surface. Detail frame painting uses explicit border-image widths without increasing layout width, preserving the native closed pane.

## Alternatives considered

- Repainting the supplied scene would break the contributor's explicit background selection.
- Baking text or navigation into raster images would lose native localization, editing and accessibility.
- Adding an executable skin hook just to replace labels would increase the review surface without adding necessary functionality.
- Blurring the composer card itself would change the containing block for fixed tooltips; leave frost to the controller's body-level sibling.

## Consequences

The two directories duplicate material references intentionally so Workshop packages remain self-contained. Original background hashes, generation prompts, material licenses and real-GUI screenshots accompany each skin. Optional plugin rows only appear when their actual plugins are installed. Class-suffix compatibility requires retesting against future official shell versions. A clearly labeled local SSE protocol fixture exercises actual session messages, code and a genuine readonly tool receipt through the official Agent and renderer; it is not external model inference or DOM injection. QA removes its temporary provider and dummy credential, restores the original stock model selection, and opens the native new-session state for standard previews. External model inference and human visual acceptance remain separate boundaries.

## Alignment revision

The contributor requested an independent repository and removal of the upper-left portrait, with exact branding Deepseek Harness. Replace the tall ledger portrait region with the 64px native brand row. Separate UI and serif typography, move workspace content clear of the generated spine, and preserve aspect ratios on short action plaques. Add real-GUI assertions for brand fit, removed portrait height and workspace label/action separation. Skin source/notice URLs now point at Theater-ahyeon/midnight-contract-skins; both versions are 0.1.1.

The folio title now sits inside the artwork's 42–78px inset and shares a vertical center with the three native actions. Expanded Settings hides the duplicate gear and offsets native text beyond the raven. The official rc.1 collapsed state removes the brand button, so compact overrides use the actual root collapsed suffix and wait for the native fade to complete in QA. Final 80 GUI assertions, 8 fixture conversation cases and 126 focused upstream tests pass. Each skin carries its own Apache-2.0 LICENSE; the independent repo preserves the upstream BSD attribution separately.

## Local environment verification revision

On 2026-10-02 the contributor requested repair of the local runtime and explicitly approved updating shared WSL. The full Docker WSL distribution was exported before removing only a task-owned incomplete unpack directory that had filled its small disk. Source and test fixtures now run in separate task-owned ext4 images; no assets, host source, assertions, timeouts or clock changes are included. The official update restored a missing verified Microsoft MSI source and upgraded WSL to 3.0.1 / kernel 6.18.40.1.

The original 4515448 skin snapshot passes all 776 tests, 27 script tests, typecheck, 55-entry catalog, hooks and build locally on Debian 12 / Node 22.23.3 / pnpm 11.24.0. The unchanged c42e3d2 dsh-web baseline passes typecheck across 18 projects, complete tests (3244 passed, 14 pre-existing skips) and docs:check. Worker counts are bounded without reducing test discovery or changing timeouts. Actual Git/OpenSSH tools, device bindings and a read-only proc mount satisfy the baseline fixtures. Before/after SHA-256 checks confirm 249 skin-contribution and 891 host-baseline files are unchanged. The former platform failures remain historical evidence; full local gates are now complete. The two 0.1.1 designs remain at the contributor-requested rollback, with no new visual polish.

## Character artwork intake revision

On 2026-10-03 the contributor confirmed both skins' materials were self-generated using AI, with the backgrounds generated in Codex. Record AI-generated fan artwork as the creation category, preserve the supplied image hashes, and disclose that exact background generation request metadata is not retained. Existing interface prompts establish OpenAI image_gen usage; contributor declaration and file identity are evidence, not franchise authorization.

Following maintainer comment 5953289445, both bilingual READMEs, NOTICE and provenance identify Lu Mingze from Jiang Nan's Dragon Raja, name Jiang Nan (Yang Zhi) and the respective original rights holders, restrict artwork to personal non-commercial use, disclaim official status and repository affiliation, and commit to removal upon rights-holder objection. Apache-2.0 covers original CSS/code only; manifests now point artwork licensing to NOTICE using LicenseRef-Personal-NonCommercial-Fan-Art. This prevents the earlier blanket code-license metadata from appearing to grant commercial character-art rights. No artwork, CSS or interaction changes are made. Byte-identical light/dark previews are copied under evidence to satisfy the newly published screenshot policy. The independent validator adds a regression case rejecting blanket Apache-2.0 licensing for the fan artwork.

## Fresh intake submission

The contributor explicitly requested resubmission after GitHub refused to reopen PR 33. Create a dedicated branch from current upstream main 13deb94 and carry only the two corrected skin packages, matching evidence screenshots and this owning note. This refreshes the trusted intake baseline so its policy scripts exist. Preserve the previously validated visual bytes, do not alter submission policy or host behavior, and rerun the complete gates against the latest baseline before creating the replacement PR.

## Contributor responsibility revision

On 2026-10-04 the contributor instructed Codex to write the responsibility undertaking requested by maintainer comment 5970429689. Both skins' SOURCE-DECLARATION and NOTICE, plus the PR description, now expressly assign artwork copyright/compliance responsibility to Theater-ahyeon and warrant the right to provide and distribute the assets within the stated personal non-commercial scope. The statement retains the existing removal undertaking and does not claim official Dragon Raja authorization or introduce broader indemnity terms. Only declaration documents change; artwork, CSS, manifests, evidence and runtime behavior remain unchanged.
