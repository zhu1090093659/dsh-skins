// @vitest-environment jsdom

/**
 * Client API path resolution (issue #2063).
 *
 * The browser half used root-absolute same-origin URLs (/api/skin-center/...).
 * The harness serves the GUI with `<base href="./">`, so behind a reverse proxy
 * that mounts DSH under a path prefix a root-absolute URL resolves against the
 * ORIGIN and the request never reaches the mounted host. The repository-wide
 * convention (issue #1707) is DOCUMENT-RELATIVE client routes: drop the leading
 * slash and let the browser resolve against the document base, while the host
 * keeps its root-absolute registration constant.
 *
 * This spec pins that contract three ways: the client base is derived from the
 * host prefix (drift guard), no root-absolute client literal survives (regression
 * guard), and the relative URLs are the ones actually used at runtime (behavior).
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it, vi } from 'vitest'

import { SKIN_CENTER_V2_PREFIX } from '../src/routes-v2.ts'
import { CLIENT_API_BASE } from '../src/core/api-prefix.ts'
import { bootSkinRuntime } from '../src/client/runtime/boot.ts'
import { createSkinController, type ControllerSkinEntry } from '../src/client/runtime/skin-controller.ts'
import { createEffectLedger } from '../src/client/runtime/effect-ledger.ts'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Every source file under dir (recursive), ts/tsx only. */
function sourceFiles(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full))
    else if (full.endsWith('.ts') || full.endsWith('.tsx')) out.push(full)
  }
  return out
}

describe('CLIENT_API_BASE drift guard', () => {
  it('derives the client base from the host prefix without its leading slash', () => {
    // The host registration constant stays root-absolute; the client base is
    // the same path made document-relative. The two cannot drift.
    expect(CLIENT_API_BASE).toBe(SKIN_CENTER_V2_PREFIX.slice(1))
    expect(CLIENT_API_BASE).toBe('api/skin-center/v2')
  })

  it('is document-relative (no leading slash)', () => {
    expect(CLIENT_API_BASE.startsWith('/')).toBe(false)
    expect(SKIN_CENTER_V2_PREFIX.startsWith('/')).toBe(true)
  })
})

describe('no root-absolute client literals', () => {
  it('finds no quoted /api/skin-center literal under src/client or the tap adapter', () => {
    // A quoted string that opens with /api/skin-center is exactly a
    // root-absolute client route: it would break under a sub-path mount.
    const literal = /['"`]\/api\/skin-center/
    const offenders: string[] = []
    for (const file of [...sourceFiles(join(REPO, 'src', 'client')), join(REPO, 'src', 'tap-index-adapter.ts')]) {
      const lines = readFileSync(file, 'utf8').split(/\r?\n/)
      lines.forEach((line, index) => {
        if (literal.test(line)) offenders.push(`${file.replace(REPO, '')}:${index + 1}: ${line.trim()}`)
      })
    }
    expect(offenders).toEqual([])
  })
})

describe('relative URLs are actually used', () => {
  it('boot fetches the catalog and active selection from the document-relative base', async () => {
    document.documentElement.removeAttribute('data-dsh-skin')
    const urls: string[] = []
    const fetchImpl = (async (input: RequestInfo | URL) => {
      const url = String(input)
      urls.push(url)
      const body = url.endsWith('/catalog')
        ? { ok: true, skins: [], diagnostics: [] }
        : url.endsWith('/active') ? { ok: true, active: null } : null
      return new Response(JSON.stringify(body ?? {}), { status: body ? 200 : 404, headers: { 'content-type': 'application/json' } })
    }) as unknown as typeof fetch

    const store = bootSkinRuntime({ fetchImpl })
    await vi.waitFor(() => { expect(urls).toContain('api/skin-center/v2/active') })
    expect(urls).toContain('api/skin-center/v2/catalog')
    store.shutdown()
  })

  it('an injected apiBase still wins over the document-relative default', async () => {
    document.documentElement.removeAttribute('data-dsh-skin')
    const urls: string[] = []
    const fetchImpl = (async (input: RequestInfo | URL) => {
      urls.push(String(input))
      return new Response(JSON.stringify({ ok: true, skins: [], diagnostics: [] }), { status: 200, headers: { 'content-type': 'application/json' } })
    }) as unknown as typeof fetch

    const store = bootSkinRuntime({ fetchImpl, apiBase: '/api/skin-center/v2' })
    await vi.waitFor(() => { expect(urls).toContain('/api/skin-center/v2/catalog') })
    expect(urls.some((u) => u.startsWith('api/skin-center'))).toBe(false)
    store.shutdown()
  })

  it('the controller loads the skin stylesheet from the document-relative base', async () => {
    document.head.innerHTML = ''
    const controller = createSkinController({ doc: document, ledger: createEffectLedger(), persist: async () => {} })
    const entry: ControllerSkinEntry = { manifest: { id: 'harbor', contributes: { stylesheet: 'skin.css' } } }

    const switching = controller.switchTo('harbor', entry)
    const link = document.head.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')
    expect(link).not.toBeNull()
    expect(link!.getAttribute('href')).toBe('api/skin-center/v2/skins/harbor/stylesheet')
    link!.dispatchEvent(new Event('load'))
    await switching
    expect(controller.active).toBe('harbor')
    controller.shutdown()
  })

  it('an injected controller apiBase still wins', async () => {
    document.head.innerHTML = ''
    const controller = createSkinController({
      doc: document,
      ledger: createEffectLedger(),
      apiBase: '/api/skin-center/v2',
      persist: async () => {},
    })
    const entry: ControllerSkinEntry = { manifest: { id: 'harbor', contributes: { stylesheet: 'skin.css' } } }

    const switching = controller.switchTo('harbor', entry)
    const link = document.head.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')
    expect(link!.getAttribute('href')).toBe('/api/skin-center/v2/skins/harbor/stylesheet')
    link!.dispatchEvent(new Event('load'))
    await switching
    controller.shutdown()
  })
})
