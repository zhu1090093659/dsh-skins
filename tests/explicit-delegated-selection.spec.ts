// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from 'vitest'
import { createSkinController, type ControllerSkinEntry } from '../src/client/runtime/skin-controller.ts'
import { createEffectLedger } from '../src/client/runtime/effect-ledger.ts'
import { makeSkinIndexTap, makeSkinIndexRows } from '../src/tap-index-adapter.ts'
// Supply a synthetic opt-in descriptor without registering any new package.
vi.mock('../src/core/delegated-skins.ts', async importOriginal => {
  const original = await importOriginal<typeof import('../src/core/delegated-skins.ts')>()
  return { ...original,
    isDelegatedSkinId: (id: string) => id === 'example-journal' || original.isDelegatedSkinId(id),
    findDelegatedSkin: (id: string) => id === 'example-journal'
      ? { ...original.CLAUDE_STYLE_SKIN, id, selectionMode: 'explicit' }
      : original.findDelegatedSkin(id),
  }
})

const id = 'example-journal'
const entry: ControllerSkinEntry = { manifest: { id, delegated: {
  package: 'example-journal', selectionMode: 'explicit',
  repository: 'https://example.org/journal',
  bodyAttr: 'data-example-journal', handoffAttr: 'data-example-journal-handoff', installed: true,
} } }
const legacy: ControllerSkinEntry = { manifest: { id: 'claude-style', delegated: {
  ...entry.manifest.delegated!, selectionMode: undefined,
} } }
const root = () => document.documentElement
beforeEach(() => {
  root().removeAttribute('data-dsh-skin')
  root().removeAttribute('data-dsh-delegated-skin')
  document.head.innerHTML = ''; document.body.innerHTML = ''
})

it('selects exactly one delegated owner, yields legacy peers and restores cancelled previews', async () => {
  const persist = vi.fn(async () => {})
  const loadStylesheet = vi.fn(async () => {})
  const c = createSkinController({ doc: document, ledger: createEffectLedger(), persist, loadStylesheet })
  await c.switchTo(id, entry)
  expect(root().getAttribute('data-dsh-delegated-skin')).toBe(id)
  expect(root().getAttribute('data-dsh-skin')).toBe(id)
  expect(loadStylesheet).not.toHaveBeenCalled()
  await c.tryOn(null, null)
  expect(root().hasAttribute('data-dsh-delegated-skin')).toBe(false)
  expect(root().hasAttribute('data-dsh-skin')).toBe(false)
  await c.exitTryOn()
  expect(root().getAttribute('data-dsh-delegated-skin')).toBe(id)
  await c.tryOn('claude-style', legacy)
  expect(root().getAttribute('data-dsh-delegated-skin')).toBe('claude-style')
  expect(root().hasAttribute('data-dsh-skin')).toBe(false)
  await c.exitTryOn()
  expect(root().getAttribute('data-dsh-skin')).toBe(id)
  expect(persist).toHaveBeenCalledTimes(1)
  c.shutdown()
  expect(root().hasAttribute('data-dsh-delegated-skin')).toBe(false)
  expect(root().hasAttribute('data-dsh-skin')).toBe(false)
})

it('adopts after restart without persisting, and withholds both markers for wallpaper', async () => {
  let wallpaper = false
  const persist = vi.fn(async () => {})
  const c = createSkinController({ doc: document, ledger: createEffectLedger(), persist,
    suppressSkin: () => wallpaper, loadStylesheet: vi.fn(async () => {}) })
  await c.adopt(id, entry)
  expect(root().getAttribute('data-dsh-skin')).toBe(id)
  expect(persist).not.toHaveBeenCalled()
  wallpaper = true; await c.refresh()
  expect(root().hasAttribute('data-dsh-skin')).toBe(false)
  expect(root().hasAttribute('data-dsh-delegated-skin')).toBe(false)
  wallpaper = false; await c.refresh()
  expect(root().getAttribute('data-dsh-delegated-skin')).toBe(id)
  await c.switchTo(null, null)
  expect(root().hasAttribute('data-dsh-delegated-skin')).toBe(false)
  c.shutdown()
})

it('failed or stale asset loads cannot replace a newer delegated selection', async () => {
  let release!: () => void
  const c = createSkinController({ doc: document, ledger: createEffectLedger(), persist: async () => {},
    loadStylesheet: () => new Promise<void>(resolve => { release = resolve }) })
  const asset: ControllerSkinEntry = { manifest: { id: 'asset', contributes: { stylesheet: 'skin.css' } } }
  const pending = c.switchTo('asset', asset)
  await c.switchTo(id, entry)
  release(); await pending
  expect(root().getAttribute('data-dsh-delegated-skin')).toBe(id)
  expect(root().getAttribute('data-dsh-skin')).toBe(id)
  c.shutdown()
})

it('stamps first paint without asset CSS and respects wallpaper prediction', () => {
  const html = '<html><head></head><body></body></html>'
  const deps = { readActiveId: () => id }
  expect(makeSkinIndexRows(deps)()).toEqual([])
  const out = makeSkinIndexTap(deps)(html)
  expect(out).toContain('data-dsh-delegated-skin="example-journal"')
  expect(out).toContain('data-dsh-skin="example-journal"')
  expect(out).not.toContain('stylesheet')
  const withheld = makeSkinIndexTap({ ...deps, readWallpaperOnStage: () => true })(html)
  expect(withheld).not.toContain('data-dsh-delegated-skin=')
  expect(withheld).not.toContain('data-dsh-skin=')
  const old = makeSkinIndexTap({ readActiveId: () => 'claude-style' })(html)
  expect(old).not.toContain('data-dsh-skin=')
})

it('restores the asset after an explicit peer preview while the legacy peer yields', async () => {
  const persist = vi.fn(async () => {})
  const c = createSkinController({ doc: document, ledger: createEffectLedger(), persist,
    loadStylesheet: vi.fn(async () => {}) })
  const asset = { manifest: { id: 'paper', contributes: { stylesheet: 'skin.css' } } }
  await c.switchTo('paper', asset)
  await c.tryOn(id, entry)
  expect(root().getAttribute('data-dsh-delegated-skin')).toBe(id)
  expect(root().getAttribute('data-dsh-skin')).toBe(id)
  await c.exitTryOn()
  expect(root().getAttribute('data-dsh-skin')).toBe('paper')
  expect(root().hasAttribute('data-dsh-delegated-skin')).toBe(false)
  expect(persist).toHaveBeenCalledTimes(1)
  c.shutdown()
})
