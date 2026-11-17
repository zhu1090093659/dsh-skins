/**
 * Skin-center v2 API prefix, both forms, in ONE home.
 *
 * The host registers its routes under the root-absolute `SKIN_CENTER_V2_PREFIX`.
 * The browser half and the first-paint `<link>` hrefs must be DOCUMENT-RELATIVE
 * (`CLIENT_API_BASE`): the harness serves the Web GUI with `<base href="./">`,
 * so a same-origin URL that keeps its leading slash resolves against the ORIGIN
 * and, behind a reverse proxy that mounts DSH under a path prefix
 * (`https://host/dsh/`), never reaches the host route. A document-relative URL
 * resolves under the mount instead. At the origin root the two forms are the
 * same pathname, so this is behavior-preserving there (issue #2063; the
 * repository-wide convention fixed in #1707).
 *
 * This module has NO imports: it is pure data shared by both halves. src/core is
 * the layering both halves already import from (e.g. src/client imports
 * ../core/delegated-skins.ts), so neither half pulls in the other's code. That
 * matters: `src/client/**` value-importing `src/routes-v2.ts` would drag
 * host-only modules into the browser bundle, and a host module importing
 * `src/client/**` is the mirror defect. CLIENT_API_BASE is DERIVED from the host
 * constant so the two forms cannot drift.
 */

/** Root-absolute v2 API prefix for host route registration. */
export const SKIN_CENTER_V2_PREFIX = '/api/skin-center/v2'

/** Document-relative v2 API base for the browser half and injected hrefs. */
export const CLIENT_API_BASE: string = SKIN_CENTER_V2_PREFIX.slice(1)
