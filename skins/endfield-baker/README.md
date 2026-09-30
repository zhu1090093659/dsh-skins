# Endfield Baker (终末地 · BAKER)

English | [中文](README.zh.md)

Endfield Baker turns the DSH web GUI into an *Arknights: Endfield* field terminal — a pure asset
skin (v2 `skin.json` + `skin.css` + `patches.css` + `assets/`), kept in this repository and
installed on demand into `$DSH_HOME/skins/endfield-baker/` by the Workshop.

## What it is

- **Pure assets**: `skin.css` (L1: `--dsw-*` token remap plus the `--ef-*` primitives),
  `patches.css` (L3: structural patches for the chat shell and the plugin pages),
  `assets/` (terminal artwork, signal bars, corner cuts), `preview/` (light/dark screenshots).
  No package.json, no build step, nothing executes.
- **One palette**: every colour lives in the `:root` block of `skin.css`. Light and dark share
  the same terminal palette; changing a scheme means editing one block.
- **Session area rebuilt**: the chat panel is redone as the BAKER comms screen — cyan header rail,
  signal-yellow selected row, cut-corner console cards for tool calls / thinking / context rows,
  a white capsule composer, and a frosted grey chat base plate over the industrial terminal
  background.
- **Shell and plugin pages**: dossier-style sidebar rows and workspace rows (monospace micro
  labels, one-pixel light borders), hairline grids and diagonal signal strips, plus structural
  patches for the task board, SSH, pet, and plugin settings pages. Patches for plugins you do not
  have installed simply stay dormant.

## Verification

Applied locally through the skin center and checked in both skins-visible states:

- `dsh-web` skin center, engine `0.2.0-rc.2`, skin id `endfield-baker`; `data-dsh-skin`
  asserted before every measurement, `GET /api/skin-center/v2/skins/endfield-baker/patches`
  returns 200.
- **Web**: chat shell, sidebar, settings, task board, plugin pages measured with a headless probe
  (computed styles and element rects) rather than by eye.
- **Desktop (Electron)**: the same asset directory applied in the desktop build and used by hand;
  no layout breakage found. The desktop build's CSS-module hashes differ from the web build, so the
  chat base plate and the rail handle are patched through `:is(<web hash>, <desktop hash>)`.
- Fixed in this version: the composer's frosted backplate used to create a containing block for the
  app's fixed-position floating bubble, which pushed the message area and composer up by roughly
  510 px while a task was running. The frost now lives on a child-free `::before`, so it can no
  longer capture fixed descendants.

## Credits and license

- Base theme rewritten from **blue-fantasy** (`powerdog996` / DreamSkin community).
- Skin engineering (`skin.css`, `patches.css`, `assets/`) by **Yuji6278**, released under
  [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/); see [LICENSE](LICENSE).
- *Arknights: Endfield* names and settings belong to Hypergryph. This is a non-commercial fan work.

## Known limitations

- Presentation-only: the skin mutates browser styles and never touches a model request.
- `patches.css` anchors on CSS-module hash class fragments, so an official rebuild can move an
  anchor; `dsh-skin validate` reports this as a warning by design.
- No `hooks.mjs` is declared, so the workspace row's inline "+ new session" button (which the
  design replaces with a menu entry) stays hidden and new sessions are started from the *New Baker*
  entry at the top of the sidebar.
