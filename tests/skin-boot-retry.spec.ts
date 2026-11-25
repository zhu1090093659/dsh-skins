// @vitest-environment jsdom

/**
 * Cold-start boot adopt retries (issue #2085).
 *
 * On a cold start the first skin stylesheet request can land on a cold CSS
 * safety worker and answer HTTP 500 (the transform exceeds
 * SKIN_CSS_REQUEST_TIMEOUT_MS on that first request). Adding front of the boot
 * used to adopt the persisted skin exactly once and, on that single miss, fall
 * back to the official default and claim 'previous skin intact' - so a restart
 * always dropped the user's skin while the log said otherwise.
 *
 * Boot now retries the adopt with backoff on the SAME controller and only the
 * last failure falls back to the official default. These specs pin the four
 * required behaviors with fake timers (deterministic time): success on a retry
 * applies the persisted skin; every retry failing falls back to the default
 * with a truthful log; a user selection during the retry window cancels the
 * retries; and disposing the runtime cancels them too.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  bootSkinRuntime,
  DEFAULT_ADOPT_RETRY_DELAYS_MS,
  type CatalogSkin,
  type SkinRuntimeStore,
} from '../src/client/runtime/boot.ts'

const API = '/api/skin-center/v2'
const PERSISTED = 'mint'
const DEFAULT_SKIN = 'blue-fantasy'

function catalogSkin(id: string): CatalogSkin {
  return {
    origin: 'builtin',
    warnings: [],
    manifest: { id, name: id, nameEn: id, contributes: { stylesheet: 'skin.css' } },
  } as CatalogSkin
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

/**
 * Drain the pending microtask chain (the boot async IIFE up to the first
 * backoff wait, plus any adopt round-trip). Fake timers keep the backoff
 * timers suspended, so this never advances time.
 */
async function flushMicrotasks(): Promise<void> {
  for (let i = 0; i < 100; i += 1) await Promise.resolve()
}

interface Harness {
  store: SkinRuntimeStore
  /** Every stylesheet href the controller tried to load, in order. */
  loadCalls: string[]
  /** console.error messages captured from the controller's onError. */
  errorMessages(): string[]
}

/**
 * Boot a runtime whose persisted selection is PERSISTED, failing the first
 * `failTimes` requests for that skin's stylesheet and serving the rest. The
 * catalog also carries the official default so the fallback resolves.
 */
function harness(options: { failTimes: number; retryDelaysMs?: readonly number[] }): Harness {
  const loadCalls: string[] = []
  let remainingFailures = options.failTimes
  const loadStylesheet = async (href: string): Promise<void> => {
    loadCalls.push(href)
    if (href.endsWith(`/skins/${PERSISTED}/stylesheet`) && remainingFailures > 0) {
      remainingFailures -= 1
      throw new Error(`stylesheet load failed: ${href}`)
    }
  }
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    if (init?.method === 'POST') return jsonResponse({ ok: true })
    if (url.endsWith('/catalog')) {
      return jsonResponse({ ok: true, skins: [catalogSkin(PERSISTED), catalogSkin(DEFAULT_SKIN)], diagnostics: [] })
    }
    if (url.endsWith('/active')) return jsonResponse({ ok: true, active: PERSISTED })
    return new Response('{}', { status: 404 })
  }) as unknown as typeof fetch
  const store = bootSkinRuntime({
    apiBase: API,
    fetchImpl,
    loadStylesheet,
    adoptRetryDelaysMs: options.retryDelaysMs ?? DEFAULT_ADOPT_RETRY_DELAYS_MS,
  })
  const errorMessages = (): string[] => errorSpy.mock.calls.map((call) => String(call[0]))
  return { store, loadCalls, errorMessages }
}

let errorSpy: ReturnType<typeof vi.spyOn>

const persistedLoads = (h: Harness): string[] =>
  h.loadCalls.filter((href) => href.endsWith(`/skins/${PERSISTED}/stylesheet`))

beforeEach(() => {
  vi.useFakeTimers()
  document.head.innerHTML = ''
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('data-dsh-skin')
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('cold-start boot adopt retries (issue #2085)', () => {
  it('applies the persisted skin on a retry after the first cold-start miss', async () => {
    // Given a cold start whose first stylesheet request fails once
    const h = harness({ failTimes: 1, retryDelaysMs: [1000, 3000, 6000] })
    await flushMicrotasks()

    // The first attempt failed: the page is still on the official default,
    // the fallback log fired, and one retry is waiting on its backoff.
    expect(persistedLoads(h)).toHaveLength(1)
    expect(h.store.controller.active).toBeNull()
    expect(h.errorMessages().some((m) => m.includes('official default'))).toBe(true)

    // When the backoff elapses the retry re-adopts the persisted skin
    await vi.advanceTimersByTimeAsync(1000)
    await flushMicrotasks()

    // Then the persisted skin is active and stamped, without the fallback
    expect(persistedLoads(h)).toHaveLength(2)
    expect(h.store.controller.active).toBe(PERSISTED)
    expect(document.documentElement.getAttribute('data-dsh-skin')).toBe(PERSISTED)
    h.store.shutdown()
  })

  it('falls back to the official default only after every retry fails, and logs the truth', async () => {
    // Given a cold start whose stylesheet request keeps failing
    const h = harness({ failTimes: 10, retryDelaysMs: [1000, 3000, 6000] })
    await flushMicrotasks()

    // When every backoff elapses (1s + 3s + 6s) and every retry has failed
    await vi.advanceTimersByTimeAsync(1000)
    await vi.advanceTimersByTimeAsync(3000)
    await vi.advanceTimersByTimeAsync(6000)
    await flushMicrotasks()

    // Then the persisted skin was tried four times (the initial attempt plus
    // three retries) before giving up
    expect(persistedLoads(h)).toHaveLength(4)
    // And the page fell back to the official default (the stock look)
    expect(h.store.controller.active).toBeNull()
    expect(document.documentElement.hasAttribute('data-dsh-skin')).toBe(false)
    // And the log states the truthful outcome: it fell back to the official
    // default, and it does NOT claim a previous skin stayed intact.
    const messages = h.errorMessages()
    expect(messages.some((m) => m.includes('stays on the official default'))).toBe(true)
    expect(messages.some((m) => m.includes('previous skin intact'))).toBe(false)
    h.store.shutdown()
  })

  it('cancels the retries when the user selects a skin during the retry window', async () => {
    // Given a cold start whose persisted skin keeps failing (waiting on a retry)
    const h = harness({ failTimes: 10, retryDelaysMs: [1000, 3000, 6000] })
    await flushMicrotasks()
    expect(persistedLoads(h)).toHaveLength(1)
    const before = persistedLoads(h).length

    // When the user picks a different skin while the retry backoff is pending
    await h.store.controller.switchTo('harbor', catalogSkin('harbor'))
    await flushMicrotasks()
    expect(h.store.controller.active).toBe('harbor')

    // Then the pending and later retries stand down: the persisted skin is
    // never tried again, and the user's choice stays on the page.
    await vi.advanceTimersByTimeAsync(10_000)
    await flushMicrotasks()
    expect(persistedLoads(h)).toHaveLength(before)
    expect(h.store.controller.active).toBe('harbor')
    expect(document.documentElement.getAttribute('data-dsh-skin')).toBe('harbor')
    h.store.shutdown()
  })

  it('cancels the retries when the runtime is disposed during the retry window', async () => {
    // Given a cold start waiting on a retry
    const h = harness({ failTimes: 10, retryDelaysMs: [1000, 3000, 6000] })
    await flushMicrotasks()
    const before = persistedLoads(h).length
    expect(before).toBe(1)

    // When the runtime is disposed and time passes
    h.store.shutdown()
    await vi.advanceTimersByTimeAsync(20_000)
    await flushMicrotasks()

    // Then no further attempt is made for the persisted skin.
    expect(persistedLoads(h)).toHaveLength(before)
  })
})
