/**
 * CSS-module coverage of the skin-center stylesheet: every `css.<name>` a
 * client component references must exist in skin-center.module.css.
 *
 * The module typing is `Record<string, string>`, so a missing class is not a
 * compile error — the component renders `class="undefined"` and the block
 * silently loses its layout. The manual-folder row (its path chips, remove and
 * add controls) did exactly that with six classes until this guard existed.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CLIENT_DIR = fileURLToPath(new URL('../src/client', import.meta.url))
const STYLESHEET = join(CLIENT_DIR, 'skin-center.module.css')

/** Every .ts/.tsx under the client half. */
function clientSources(dir: string): string[] {
  const found: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...clientSources(path))
    else if (path.endsWith('.ts') || path.endsWith('.tsx')) found.push(path)
  }
  return found
}

/** Class names the stylesheet defines (comments stripped first). */
function definedClasses(): Set<string> {
  const css = readFileSync(STYLESHEET, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  return new Set([...css.matchAll(/\.([A-Za-z][A-Za-z0-9_-]*)/g)].map(match => match[1] as string))
}

/** `css.<name>` references of every component that imports this stylesheet. */
function referencedClasses(): Map<string, string> {
  const references = new Map<string, string>()
  for (const file of clientSources(CLIENT_DIR)) {
    const source = readFileSync(file, 'utf8')
    if (!/from '[^']*skin-center\.module\.css'/.test(source)) continue
    for (const match of source.matchAll(/css\.([A-Za-z0-9_]+)/g)) {
      const name = match[1] as string
      if (!references.has(name)) references.set(name, file)
    }
  }
  return references
}

describe('skin-center CSS module coverage', () => {
  it('defines every class the client components reference', () => {
    // Given the stylesheet's class definitions and the component references
    const defined = definedClasses()
    const referenced = referencedClasses()

    // When the references are checked against the definitions
    const missing = [...referenced].filter(([name]) => !defined.has(name))

    // Then no component renders an undefined class (and the guard sees both halves)
    expect(referenced.size).toBeGreaterThan(0)
    expect(missing.map(([name]) => name)).toEqual([])
  })
})
