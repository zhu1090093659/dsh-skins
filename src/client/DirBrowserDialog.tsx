/**
 * In-app folder browser: the picking surface for a Host whose directory
 * picker composes the browse backend. The adaptive chooser resolves that
 * backend whenever the web server binds beyond loopback (LAN / remote GUI
 * access) or the host is launched over SSH, because no OS chooser can reach
 * such a client; the picker then refuses `pick` and serves listing
 * primitives instead.
 *
 * The dialog drives those primitives one level at a time and owns no path
 * joining: every crumb and every row is an absolute host path the backend
 * reported, so a client on another machine still picks a real host folder.
 * Escape and a backdrop click close it; the chosen path goes back through
 * `onPick` and the caller persists it.
 *
 * @module @linxin666/dsh-client-ui-skin-center/DirBrowserDialog
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { WallpaperDirListing } from './wallpaper.ts'
import css from './skin-center.module.css'

/** Props of the in-app folder browser. */
export interface DirBrowserDialogProps {
  t: PropsLocale<'skinCenter'>['t']
  /** List one host directory level; an absent path lists the host account's home. */
  listDir(path?: string): Promise<WallpaperDirListing>
  /** Take the chosen absolute host path; the caller closes the dialog. */
  onPick(path: string): void
  /** Dismiss without choosing. */
  onClose(): void
}

/** Render the in-app folder browser over the picker's browse primitives. */
export function DirBrowserDialog({ t, listDir, onPick, onClose }: DirBrowserDialogProps): ReactNode {
  const [listing, setListing] = useState<WallpaperDirListing | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(true)
  const [showHidden, setShowHidden] = useState(false)
  const alive = useRef(true)
  const panel = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

  /** Load one level; an absent path loads the host account's home. */
  const open = useCallback((path?: string): void => {
    setBusy(true)
    setError(null)
    void listDir(path).then(next => {
      if (!alive.current) return
      setBusy(false)
      setListing(next)
    }, (reason: unknown) => {
      if (!alive.current) return
      setBusy(false)
      setError(reason instanceof Error ? reason.message : String(reason))
    })
  }, [listDir])

  useEffect(() => { open() }, [open])

  useEffect(() => {
    panel.current?.focus()
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey) }
  }, [onClose])

  const entries = (listing?.entries ?? []).filter(entry => showHidden || !entry.hidden)
  const failed = error !== null

  return (
    <div
      className={css.dirBrowserOverlay}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div
        className={css.dirBrowser}
        role="dialog"
        aria-modal="true"
        aria-label={t('wallpaperDirBrowseTitle')}
        tabIndex={-1}
        ref={panel}
      >
        <div className={css.dirBrowserTitle}>{t('wallpaperDirBrowseTitle')}</div>
        <div className={css.dirBrowserCrumbs}>
          {(listing?.crumbs ?? []).map((crumb, index) => (
            <span className={css.dirBrowserCrumb} key={crumb.path}>
              {index > 0 && <span className={css.dirBrowserCrumbSep}>/</span>}
              <button
                type="button"
                className={css.dirBrowserCrumbButton}
                title={crumb.path}
                onClick={() => { open(crumb.path) }}
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </div>
        <div className={css.dirBrowserList}>
          {busy && <div className={css.dirBrowserNote}>{t('loading')}</div>}
          {!busy && failed && (
            <div className={css.dirBrowserError}>
              {t('wallpaperDirBrowseFailed')}: {error}
            </div>
          )}
          {!busy && !failed && entries.length === 0 && (
            <div className={css.dirBrowserNote}>{t('wallpaperDirBrowseEmpty')}</div>
          )}
          {!busy && !failed && entries.map(entry => (
            <button
              type="button"
              className={css.dirBrowserEntry}
              key={entry.path}
              title={entry.path}
              onClick={() => { open(entry.path) }}
            >
              {entry.name}
            </button>
          ))}
          {!busy && !failed && listing?.truncated === true && (
            <div className={css.dirBrowserNote}>{t('wallpaperDirBrowseTruncated')}</div>
          )}
        </div>
        <label className={css.dirBrowserHidden}>
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(event) => { setShowHidden(event.target.checked) }}
          />
          {t('wallpaperDirBrowseHidden')}
        </label>
        <div className={css.dirBrowserActions}>
          <button type="button" className={css.button} onClick={onClose}>{t('cancel')}</button>
          <button
            type="button"
            className={css.button}
            disabled={listing === null}
            onClick={() => { if (listing !== null) onPick(listing.path) }}
          >
            {t('wallpaperDirBrowseChoose')}
          </button>
        </div>
      </div>
    </div>
  )
}
