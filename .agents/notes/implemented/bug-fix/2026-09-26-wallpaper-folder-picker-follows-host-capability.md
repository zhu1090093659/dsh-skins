# Agent Note: The wallpaper folder picker follows the Host's picker capability

Status: implemented

## Problem

The manual-folder row (the Wallpaper Engine library folders) offered a Browse
button that called `remote.directoryPicker.pick`. On a macOS desktop host that
binds the web server to the LAN for remote-GUI access, the click answered

```
directoryPicker.pick needs the native capability; the composed picker serves "browse"
```

and the panel fell back to "无法打开系统目录选择框——请手动输入路径": the button
never opened a chooser at all.

The seam has two interaction shapes and the Host composes exactly one at boot.
`@deepseek-ai/dsh-host-directory-picker-native` opens one OS chooser on the Host
display; `@deepseek-ai/dsh-host-directory-picker-browse` serves
`list`/`createDirectory` for an in-app browser instead.
`dsh-host-directory-picker-auto` resolves native only for a loopback-only bind,
a non-SSH launch and a servable display session; every ambiguous deployment —
this Mac runs the desktop app with remote-web-ui's LAN bind
(`host: 0.0.0.0`) — resolves browse.

Both backends register the same `remote.directoryPicker` namespace, so the
inference the [macOS user-folders note](../simplification/2026-09-25-macos-wallpapers-user-folders-only.md)
drew from `inject` ("the namespace is mounted, therefore `pickDir` works")
held for neither case: the namespace was mounted and `pick` was still refused.

## Decision

**A refused pick is a capability answer, not a failure.** `mapDirPickResult`
maps the Remote result onto `{ kind: 'picked' | 'cancelled' | 'unavailable' }`;
`directory-picker/unavailable` is the browse signal, while every other code
still rejects so a transport or assembly fault can never read as a cancel.

**A browse-composed Host gets an in-app browser, not a hint.**
`WallpaperHandle` gains `listDir(path?)` over `remote.directoryPicker.list`,
and `DirBrowserDialog` drives it one level at a time: ancestry crumbs, the
child rows, a dot-folder toggle, and the backend's truncation note. The dialog
owns no path joining — every crumb and row is the absolute Host path the
backend reported — so a paired remote client still picks a real Host folder.

**The manual input stays the fallback only when neither capability exists**:
no picker namespace at all, or a refused pick with no listing primitives.

**The click decides, it does not probe.** The refused `pick` is the cheapest
capability signal (the backend refuses before doing any work), so the panel pays
it on demand instead of reading the Host filesystem at panel mount.

## Alternatives considered

- **Hide the Browse button when the pick is refused.** Rejected: it deletes the
  only chooser a remote/paired client could ever have, and the browse backend
  exists precisely to give that client one.
- **Drive the official `dsh-client-ui-directory-picker-browse` dialog.**
  Rejected: its client half registers into ui-workspace's
  `sidebar.workspaces.directoryFlow` / `conversation.hero.workspace.directoryFlow`
  holes under the workspace UI's own busy state, and the package exposes only
  `apply`/`inject` — no service a third-party card may call.
- **Register our own occupant into those workspace holes.** Rejected: they are
  `single` slots owned by ui-workspace, and a second occupant is a duplicate
  registration; the workspace dialog would also be keyed to the workspace flow,
  not to wallpaper folders.
- **Probe the capability by calling `list()` when the panel opens.** Rejected:
  it reads the Host home directory on every panel open for a feature the user
  may never click, and the browser opens on the first `list` anyway.
- **Turn the Host back to a loopback bind so Finder serves this Mac.** Rejected:
  the LAN bind is the user's remote-access configuration and the adaptive
  chooser's browse answer is by design for a remote-capable Host.

## Consequences

- On a browse-composed Host (LAN/remote bind, SSH launch, headless Linux) the
  Browse button opens the in-app browser and adds a real Host folder; on a
  native-composed Host nothing changes and Finder/Explorer still opens directly.
  The first browse click costs one refused RPC before the dialog loads the Host
  home.
- `pickDir`'s contract changed from `string | null` to `WallpaperDirPick`; the
  panel and the wallpaper tests are its only consumers.
- A listing failure inside the dialog reports the Host's message and keeps the
  manual input reachable, matching the earlier behaviour.
- The manual-folder row's own CSS classes (`wallpaperDirs*`) are absent from the
  stylesheet, so that block renders unstyled; this change leaves it as it was
  and styles only the new dialog.
