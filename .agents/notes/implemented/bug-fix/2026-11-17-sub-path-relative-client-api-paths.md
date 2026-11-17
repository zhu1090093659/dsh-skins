# Agent Note: Sub-path deployments need document-relative client API URLs

Status: implemented

## Problem

Every same-origin skin-center URL the browser half used was root-absolute
(`/api/skin-center/v2/...`): the catalog heartbeat, the `/active` state
channel, the runtime and controller `apiBase` defaults, the verify / versions /
repair / uninstall fetches in the card, the external-wallpaper probe, and the
first-paint stylesheet `<link>` tags `skinLinkTags()` injects into the served
document. The harness serves the Web GUI with one document base,
`<base href="./">`, so behind a reverse proxy that mounts DSH under a path
prefix (`https://host/dsh/`, nginx strips `/dsh`) a root-absolute URL resolves
against the ORIGIN, not the mount, and never reaches the host route. "Check
integrity and updates", apply, uninstall, repair, the wallpaper probe, the
catalog heartbeat and the first-paint stylesheets all failed there (issue
#2063). A direct root deployment resolves both forms to the same pathname, which
is why local development never saw it.

This is the same defect the parent repository already fixed repository-wide for
its plugins in the #1707 batch: client routes are document-relative, host route
REGISTRATION stays root-absolute, and the two forms derive from one constant so
they cannot drift. The skin-center satellite shipped after that batch and
reproduced the literal pattern it retired. The owning decision for the
convention is
`dsh-web/.agents/notes/implemented/bug-fix/2026-09-23-issue-batch-1707-1708-sub-path-routes-and-failed-reuse-executions.md`.

## Decision

Both forms of the v2 API prefix live in ONE pure module, `src/core/api-prefix.ts`,
which has no imports:

- `SKIN_CENTER_V2_PREFIX = '/api/skin-center/v2'` — root-absolute, for host
  route registration.
- `CLIENT_API_BASE = SKIN_CENTER_V2_PREFIX.slice(1)` — document-relative, for
  the browser half and the injected first-paint hrefs, derived from the host
  form so the two cannot drift.

`src/core` is the layer both halves already import from (`src/client` imports
`../core/delegated-skins.ts`, and host modules import `src/core/**` widely), so
this is the established layering: neither half pulls in the other's code. That
is the point — putting the constant in a client module made the browser half
value-import `src/routes-v2.ts` (host code, with `node:fs` / `./bulk.ts` /
lightningcss in its graph) and leak host-only regions into the browser bundle;
putting it in `src/client` would make the host half import browser source. The
pure `src/core` module removes both edges.

- `src/routes-v2.ts` takes `SKIN_CENTER_V2_PREFIX` from `./core/api-prefix.ts`
  and RE-EXPORTS it, so `src/index.ts` and every existing test that imports it
  from `routes-v2` keep working unchanged. No route path changes.
- Every browser-half site imports `CLIENT_API_BASE` from `../core/api-prefix.ts`
  (runtime files from `../../core/api-prefix.ts`): the heartbeat and
  `V2_ACTIVE_URL` in `src/client/index.ts`; the `apiBase` defaults in
  `src/client/runtime/boot.ts` and `src/client/runtime/skin-controller.ts`; the
  verify / versions / repair / uninstall fetches and the `apiBase` default in
  `src/client/SkinCenter.tsx`; the probe constant in
  `src/client/ExternalWallpaperNotice.tsx`. No client file imports `routes-v2.ts`.
- `skinLinkTags()` in `src/tap-index-adapter.ts` builds its `<link>` hrefs from
  `CLIENT_API_BASE` (imported from `./core/api-prefix.ts`, never `src/client`).
  The injected hrefs are document-relative for both consumers: the served form
  places them in the document text (honoring `<base href="./">`), and the
  static-worker form inserts them with `insertAdjacentHTML('beforeend', html)`,
  which also resolves against the document base. Nothing else about the rows
  changes.
- Derived URLs (asset base, stylesheets, patches, `hooks.mjs`, background
  media, preview thumbnails) all flow from `apiBase`, so converting the default
  converts them; no second mechanism is added.
- The injection seams are untouched: `deps.apiBase`, `options.apiBase`,
  `runtime.apiBase` and any test-injected base are still honored exactly as
  passed. Only the DEFAULT becomes document-relative.

A drift guard plus a behavior spec live in `tests/client-api-base.spec.ts`: it
pins `CLIENT_API_BASE === SKIN_CENTER_V2_PREFIX.slice(1)` (importing both from
`src/core/api-prefix.ts`), scans `src/client/**` and the tap adapter for any
quoted `/api/skin-center` literal (fails if one returns), and asserts the
relative URLs are actually used (boot catalog + `/active` fetch URLs, the
controller's stylesheet `<link> href`) while an injected `apiBase` still wins.
`tests/tap-index-adapter.spec.ts` expects the document-relative hrefs from
`skinLinkTags()`.

## Alternatives considered

**A shared URL helper resolved against `document.baseURI`.** Rejected for the
same reason as #1707: the browser already resolves a relative path against
`document.baseURI` for `fetch` and link hrefs, so the helper would only
reproduce a platform behavior, and the literal form matches the official client
verbatim, which keeps the convention auditable by reading upstream.

**Keep the constant in a client module and import the host constant from it.**
Rejected: it inverts the layering. The browser half would value-import the host
`routes-v2.ts` (dragging `node:fs`, `./bulk.ts`, lightningcss into the browser
graph; only tree-shaking kept them out of the emitted bundle), and
`skinLinkTags()` — host code — would import browser source. A pure `src/core`
module shared by both halves is the layering the repository already uses.

**Keep the literals and rewrite the remote channel's fence.** Out of scope: the
reported deployment is a local reverse-proxy mount where the remote channel is
not installed, so relative routes reach the proxy directly. Making the
security-sensitive fence mount-aware is a separate change, noted as a follow-on
in #1707.

**Rewrite the paths inside the served HTML / worker boot payload instead.**
Rejected: the document base already decides resolution; rewriting injected
markup would invent a second mechanism for something the browser does for free,
and would have to special-case both consumers.

## Consequences

A prefix-mounted GUI now reaches every skin-center route, and the first-paint
stylesheet links resolve under the mount instead of the origin. At the origin
root nothing changes observably — a document-relative and a root-absolute path
resolve to the same pathname there — so direct root deployments and existing
tests that inject `/api/skin-center/v2` keep the same behavior.

Keeping the constant in the pure `src/core` module also keeps the browser
bundle from carrying host code: `lib/client.js` gains only the derived constant
and the URL edits, with no `routes-v2`/host region, and `lib/index.js` carries no
`src/client` region.

The remote-pairing fence remains prefix-unaware (inherited from #1707): a
sub-path deployment reached from a *remote* device is not addressed here. The
client bundle changes, so the browser half picks the fix up on a page refresh
once the package is rebuilt; no host restart is required for the client half.
