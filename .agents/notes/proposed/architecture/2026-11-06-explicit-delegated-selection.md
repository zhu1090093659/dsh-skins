# Agent Note: selection across delegated themes

Status: proposed

## Proposal
Expose the displayed delegated ID at first paint and at the controller switch. Let a registered delegate opt into occupying the skin stamp to make legacy peers yield. Leave the existing Claude descriptor on its legacy behavior.

## Alternatives considered
A selected-ID attribute alone cannot make a legacy plugin yield. The persisted active ID does not follow previews. Loading the registered asset as a proxy would conflate the asset and plugin entries.

## Acceptance criteria
When previewing an opt-in delegate from an asset, the legacy peer yields, only the selected peer paints, cancellation restores the asset, and no preview is persisted. The same rules apply on reload, failure and wallpaper withholding. No plugin registration or installation changes are part of this proposal.

## Risks
Third-party consumers that equate the presence of the skin stamp with asset CSS must be reviewed before adopting this contract. Keeping the legacy delegate stamp-free intentionally preserves how existing plugins behave on the default appearance.
