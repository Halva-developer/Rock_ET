import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PackageInfo, RcktConfig, ScriptAnalysis, InstalledPackage, SystemInfo, CatalogPackage, CatalogData, AppSettings } from './vite-env'
import './App.css'

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  catalogUrl: 'https://raw.githubusercontent.com/Halva-developer/ROCK_ET-packages-/main/catalog.json',
  defaultInstallMode: 'sandbox',
  animations: true,
  checkUpdates: true,
}

function applyTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function RocketLogo({ size = 36, uid = 'a' }: { size?: number; uid?: string }) {
  const bg = `rl-bg-${uid}`, rocket = `rl-rk-${uid}`, glow = `rl-gl-${uid}`, shadow = `rl-sh-${uid}`
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={bg} cx="35%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#1e1040"/><stop offset="100%" stopColor="#07091a"/>
        </radialGradient>
        <linearGradient id={rocket} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffb366"/><stop offset="50%" stopColor="#ff6b2b"/><stop offset="100%" stopColor="#d83a00"/>
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff5f1f" stopOpacity="0.28"/><stop offset="100%" stopColor="#ff5f1f" stopOpacity="0"/>
        </radialGradient>
        <filter id={shadow}><feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ff5f1f" floodOpacity="0.55"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill={`url(#${glow})`}/>
      <circle cx="24" cy="24" r="22" fill={`url(#${bg})`}/>
      <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,95,31,0.5)" strokeWidth="1.2"/>
      <path d="M24 7 C20 13 18 18 18 25 L24 30 L30 25 C30 18 28 13 24 7Z"
        fill={`url(#${rocket})`} filter={`url(#${shadow})`}/>
      <circle cx="24" cy="20" r="3.5" fill="#07091a" stroke="#ffd080" strokeWidth="1"/>
      <circle cx="24" cy="20" r="1.8" fill="rgba(255,208,128,0.18)"/>
      <circle cx="23" cy="19" r="0.7" fill="rgba(255,255,255,0.5)"/>
      <path d="M18 25 L13 33 L18 30Z" fill="#ff7c45"/>
      <path d="M30 25 L35 33 L30 30Z" fill="#ff7c45"/>
      <path d="M21 30 C20 36 24 41 24 41 C24 41 28 36 27 30Z" fill="#fbbf24" opacity="0.85"/>
      <path d="M22.5 30 C22 35 24 38.5 24 38.5 C24 38.5 26 35 25.5 30Z" fill="#ff9a5a" opacity="0.9"/>
      <path d="M23.2 30 C23 34 24 36 24 36 C24 36 25 34 24.8 30Z" fill="white" opacity="0.55"/>
    </svg>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

type Page = 'catalog' | 'install' | 'installed' | 'settings'

function Sidebar({ page, onNav }: { page: Page; onNav: (p: Page) => void }) {
  const items: { id: Page; icon: string; label: string }[] = [
    { id: 'catalog',   icon: '📡', label: 'Каталог' },
    { id: 'install',   icon: '🚀', label: 'Установка' },
    { id: 'installed', icon: '📦', label: 'Установлено' },
    { id: 'settings',  icon: '⚙',  label: 'Настройки' },
  ]
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <RocketLogo size={34} uid="sb"/>
        <div>
          <div className="sb-name">Rock_ET</div>
          <div className="sb-tagline">Package Manager</div>
        </div>
      </div>
      <nav className="sb-nav">
        {items.map(item => (
          <button
            key={item.id}
            className={`sb-item ${page === item.id ? 'active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span className="sb-icon">{item.icon}</span>
            <span className="sb-label">{item.label}</span>
            {page === item.id && <motion.div className="sb-indicator" layoutId="indicator"/>}
          </button>
        ))}
      </nav>
      <div className="sb-footer">
        <div className="sb-ver">v0.1.0 alpha</div>
        <div className="sb-footer-tagline">Open Source · Linux</div>
      </div>
    </aside>
  )
}

// ── Info Modal ────────────────────────────────────────────────────────────────

function InfoModal({ text, name, icon, onClose }: { text: string; name: string; icon?: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div className="im-overlay" onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="im-panel" onClick={e => e.stopPropagation()}
        initial={{ y: 32, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
      >
        <div className="im-header">
          <span className="im-icon">{icon ?? '📦'}</span>
          <div className="im-title-wrap">
            <span className="im-name">{name}</span>
            <span className="im-subtitle">Описание от автора</span>
          </div>
          <button className="im-close" onClick={onClose}>✕</button>
        </div>
        <div className="im-body">
          <pre className="im-text">{text}</pre>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Script Viewer ─────────────────────────────────────────────────────────────

function ScriptViewer({ analysis }: { analysis: ScriptAnalysis }) {
  const [open, setOpen] = useState(false)
  const dangerLines = new Set(analysis.findings.filter(f => f.level === 'danger').map(f => f.line))
  const warnLines   = new Set(analysis.findings.filter(f => f.level === 'warn').map(f => f.line))
  const badge = analysis.level === 'danger' ? 'badge-danger' : analysis.level === 'warn' ? 'badge-warn' : 'badge-clean'
  const label = analysis.level === 'danger' ? '🔴 Опасность' : analysis.level === 'warn' ? '⚠ Подозрительно' : '✅ Чисто'
  return (
    <div className="script-block">
      <button className="script-header" onClick={() => setOpen(o => !o)}>
        <code className="script-name">{analysis.name}</code>
        <span className={`badge ${badge}`}>{label}</span>
        <span className="script-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {analysis.findings.length > 0 && (
        <div className="script-findings">
          {analysis.findings.map((f, i) => (
            <div key={i} className={`finding ${f.level}`}>
              <span className="finding-line">L{f.line}</span>
              <span className="finding-reason">{f.reason}</span>
            </div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {open && (
          <motion.div className="script-code-wrap"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="tm-bar">
              <span className="tmd r"/><span className="tmd y"/><span className="tmd g"/>
              <span className="tm-fn">{analysis.name}</span>
            </div>
            <pre className="script-code">
              {analysis.content.split('\n').map((line, i) => {
                const ln = i + 1
                const cls = dangerLines.has(ln) ? 'line-danger' : warnLines.has(ln) ? 'line-warn' : ''
                return (
                  <div key={i} className={`code-line ${cls}`}>
                    <span className="line-num">{String(ln).padStart(3)}</span>
                    <span className="line-txt">{line}</span>
                  </div>
                )
              })}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Smart Digest ──────────────────────────────────────────────────────────────

function SmartDigest({ info, targetEnv }: { info: PackageInfo; targetEnv: 'sandbox' | 'global' }) {
  const cfg = info.config!
  const scriptLevel = info.scriptAnalyses?.reduce((acc, s) =>
    s.level === 'danger' ? 'danger' : acc === 'danger' ? 'danger' : s.level, 'clean' as string) ?? 'clean'
  const hasNet = (info.wgets?.length ?? 0) > 0
  const sandbox = cfg.sandbox?.enabled

  const sizeStr = info.totalSize
    ? info.totalSize > 1_000_000 ? `${(info.totalSize / 1_000_000).toFixed(1)} МБ`
    : `${(info.totalSize / 1000).toFixed(0)} КБ`
    : '—'

  return (
    <div className="digest">
      <div className="digest-chip"><span>💾</span><span>Размер: <strong>{sizeStr}</strong></span></div>
      <div className={`digest-chip ${hasNet ? 'chip-warn' : ''}`}>
        <span>{hasNet ? '🌐' : '🔒'}</span>
        <span>Сеть: <strong>{hasNet ? `${info.wgets!.length} загр.` : 'нет'}</strong></span>
      </div>
      <div className={`digest-chip chip-${scriptLevel}`}>
        <span>{scriptLevel === 'danger' ? '🔴' : scriptLevel === 'warn' ? '⚠' : '✅'}</span>
        <span>Скрипты: <strong>
          {scriptLevel === 'danger' ? 'опасные' : scriptLevel === 'warn' ? 'подозрительно' : 'чисто'}
        </strong></span>
      </div>
      {sandbox && <div className="digest-chip chip-ok"><span>✅</span><span>Sandbox-config: <strong>есть</strong></span></div>}
      <div className={`digest-chip ${targetEnv === 'sandbox' ? 'chip-ok' : 'chip-warn'}`}>
        <span>{targetEnv === 'sandbox' ? '🔒' : '🌍'}</span>
        <span>Режим: <strong>{targetEnv === 'sandbox' ? 'sandbox (bwrap)' : 'глобальная'}</strong></span>
      </div>
    </div>
  )
}

// ── Catalog Page ──────────────────────────────────────────────────────────────

function CatalogPage({ onInstall, settings }: { onInstall: (info: PackageInfo) => void; settings: AppSettings }) {
  const [catalog, setCatalog]       = useState<CatalogData | null>(null)
  const [installed, setInstalled]   = useState<Record<string, string>>({})
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState<string | null>(null)
  const [installing, setInstalling] = useState<string | null>(null)
  const [installMsg, setInstallMsg] = useState('')
  const [infoTarget, setInfoTarget] = useState<CatalogPackage | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    const [catRes, instRes] = await Promise.all([
      window.electronAPI.fetchCatalog(),
      window.electronAPI.listInstalled(),
    ])
    if (catRes.success && catRes.data) setCatalog(catRes.data)
    else setError(catRes.error ?? 'Неизвестная ошибка')
    const map: Record<string, string> = {}
    for (const p of instRes.packages ?? []) map[p.name] = p.version
    setInstalled(map)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleInstall = async (pkg: CatalogPackage) => {
    setInstalling(pkg.name); setInstallMsg('⬇ Подключаемся...')
    const unsub = window.electronAPI.onDownloadProgress(msg => setInstallMsg(msg))
    const dlRes = await window.electronAPI.downloadPackage(pkg.downloadUrl)
    unsub()
    if (!dlRes.success) { setInstalling(null); setInstallMsg(''); return }
    setInstallMsg('📦 Читаем пакет...')
    const info = await window.electronAPI.readPackageInfo()
    setInstalling(null); setInstallMsg('')
    if (info.success) onInstall(info)
  }

  const allCategories = catalog
    ? [...new Set(catalog.packages.map(p => p.category).filter(Boolean))] as string[]
    : []

  const filtered = catalog?.packages.filter(pkg => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      pkg.name.toLowerCase().includes(q) ||
      pkg.description.toLowerCase().includes(q) ||
      pkg.author.toLowerCase().includes(q) ||
      (pkg.tags ?? []).some(t => t.toLowerCase().includes(q))
    const matchCat = !category || pkg.category === category
    return matchSearch && matchCat
  }) ?? []

  return (
    <div className="catalog-page">

      {/* Header */}
      <div className="cat-header">
        <div className="cat-header-inner">
          <div className="cat-title-row">
            <RocketLogo size={44} uid="cat"/>
            <div>
              <h1 className="cat-title">Rock_ET Каталог</h1>
              <p className="cat-subtitle">Официальный репозиторий пакетов · Open Source</p>
            </div>
          </div>
          <div className="cat-search-wrap">
            <span className="cat-search-icon">🔍</span>
            <input
              className="cat-search"
              placeholder="Поиск пакетов..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="cat-search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>
      </div>

      {/* Category filters */}
      {allCategories.length > 0 && (
        <div className="cat-filters">
          <button
            className={`cat-filter ${!category ? 'active' : ''}`}
            onClick={() => setCategory(null)}
          >Все</button>
          {allCategories.map(c => (
            <button
              key={c}
              className={`cat-filter ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c === category ? null : c)}
            >{c}</button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="cat-content">

        {loading && (
          <div className="cat-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="cat-skeleton glass"/>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="cat-error">
            <span className="cat-err-icon">📡</span>
            <h3>Не удалось загрузить каталог</h3>
            <p>{error}</p>
            <p className="cat-err-hint">Проверьте подключение к интернету</p>
            <button className="btn-ghost" onClick={load}>↻ Попробовать снова</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="cat-empty">
            {catalog === null || catalog.packages.length === 0 ? (
              <>
                <span className="cat-empty-icon">🌱</span>
                <h3>Каталог пуст</h3>
                <p>В репозитории пока нет пакетов.</p>
                <p className="cat-err-hint">
                  Добавьте <code>catalog.json</code> в репозиторий<br/>
                  <code>Halva-developer/ROCK_ET-packages-</code>
                </p>
              </>
            ) : (
              <>
                <span className="cat-empty-icon">🔍</span>
                <h3>Ничего не найдено</h3>
                <p>По запросу «{search}» пакетов не найдено</p>
              </>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="cat-grid">
            {filtered.map(pkg => {
              const instVer = installed[pkg.name]
              const isInstalled = !!instVer
              const hasUpdate   = isInstalled && instVer !== pkg.version
              return (
                <motion.div key={pkg.name} className={`cat-card glass ${isInstalled ? 'cat-card-installed' : ''}`}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
                  <div className="cat-card-top">
                    <span className="cat-card-icon">{pkg.icon ?? '📦'}</span>
                    <div className="cat-card-badges">
                      {hasUpdate    && <span className="badge-update">↑ Обновление</span>}
                      {isInstalled && !hasUpdate && <span className="badge-installed">✓ Установлен</span>}
                      {pkg.verified && <span className="badge-verified">✓ Проверен</span>}
                      {pkg.sandboxReady && <span className="badge-sandbox">🔒</span>}
                    </div>
                  </div>
                  <div className="cat-card-meta">
                    <div className="cat-card-name-row">
                      <span className="cat-card-name">{pkg.name}</span>
                      <span className="badge">{pkg.version}</span>
                    </div>
                    <p className="cat-card-desc">{pkg.description}</p>
                    <p className="cat-card-author">by {pkg.author}{pkg.license ? ` · ${pkg.license}` : ''}</p>
                  </div>
                  <div className="cat-card-actions">
                    {pkg.longDescription && (
                      <button className="btn-ghost sm cat-btn-info" onClick={() => setInfoTarget(pkg)}>
                        📖 Подробнее
                      </button>
                    )}
                    <button
                      className={`btn-launch cat-btn-install ${hasUpdate ? 'btn-update' : ''}`}
                      onClick={() => handleInstall(pkg)}
                      disabled={!!installing}
                    >
                      {installing === pkg.name
                        ? <><div className="spinner" style={{width:14,height:14}}/> {installMsg || '...'}</>
                        : hasUpdate ? '↑ Обновить' : isInstalled ? '↻ Переустановить' : '🚀 Установить'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {!loading && catalog && (
          <div className="cat-footer-meta">
            <span>📡 {catalog.packages.length} пакет{catalog.packages.length === 1 ? '' : 'ов'}</span>
            {catalog.updated && <span>· обновлён {catalog.updated}</span>}
            <button className="cat-refresh" onClick={load}>↻</button>
          </div>
        )}
      </div>

      {/* Info modal */}
      <AnimatePresence>
        {infoTarget && infoTarget.longDescription && (
          <InfoModal
            text={infoTarget.longDescription}
            name={infoTarget.name}
            icon={infoTarget.icon}
            onClose={() => setInfoTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Install Page ──────────────────────────────────────────────────────────────

type Stage = 'drop' | 'preview' | 'installing' | 'done'

interface InstallPageProps {
  initialInfo?: PackageInfo | null
  onClearInitial?: () => void
  defaultInstallMode?: 'sandbox' | 'global'
}

function InstallPage({ initialInfo, onClearInitial, defaultInstallMode = 'sandbox' }: InstallPageProps) {
  const [stage, setStage]         = useState<Stage>(initialInfo ? 'preview' : 'drop')
  const [pkgInfo, setPkgInfo]     = useState<PackageInfo | null>(initialInfo ?? null)
  const [targetEnv, setTargetEnv] = useState<'sandbox' | 'global'>(defaultInstallMode)
  const [logs, setLogs]           = useState<string[]>([])
  const [result, setResult]       = useState<{ success: boolean; message: string } | null>(null)
  const [dragOver, setDragOver]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [scriptAck, setScriptAck] = useState(false)
  const [showInfo, setShowInfo]   = useState(false)

  const logsEndRef  = useRef<HTMLDivElement>(null)
  const dragCounter = useRef(0)
  const stageRef    = useRef(stage)
  stageRef.current  = stage

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [logs])

  useEffect(() => {
    if (initialInfo) { setPkgInfo(initialInfo); setStage('preview'); setScriptAck(false) }
  }, [initialInfo])

  const loadPackageInfo = useCallback(async () => {
    setLoading(true); setLoadError(null); setScriptAck(false)
    try {
      if (!window.electronAPI) throw new Error('IPC недоступен')
      const info = await window.electronAPI.readPackageInfo()
      if (info.success && info.config) { setPkgInfo(info); setStage('preview') }
      else setLoadError(info.error ?? 'Не удалось прочитать config.yaml')
    } catch (e: any) { setLoadError(`Ошибка: ${e.message}`) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const onEnter = (e: DragEvent) => { e.preventDefault(); if (stageRef.current !== 'drop') return; if (++dragCounter.current === 1) setDragOver(true) }
    const onOver  = (e: DragEvent) => { e.preventDefault() }
    const onLeave = (e: DragEvent) => { e.preventDefault(); if (--dragCounter.current <= 0) { dragCounter.current = 0; setDragOver(false) } }
    const onDrop  = async (e: DragEvent) => {
      e.preventDefault(); dragCounter.current = 0; setDragOver(false)
      if (stageRef.current !== 'drop') return
      const file = e.dataTransfer?.files[0]
      if (!file) return
      if (!file.name.endsWith('.rckt')) { setLoadError('Нужен файл с расширением .rckt'); return }
      setLoading(true); setLoadError(null)
      try {
        const res = await window.electronAPI.uploadPackage(new Uint8Array(await file.arrayBuffer()))
        if (!res.success) throw new Error(res.error)
        await loadPackageInfo()
      } catch (err: any) { setLoading(false); setLoadError(`DnD: ${err.message}`) }
    }
    window.addEventListener('dragenter', onEnter)
    window.addEventListener('dragover',  onOver)
    window.addEventListener('dragleave', onLeave)
    window.addEventListener('drop',      onDrop)
    return () => {
      window.removeEventListener('dragenter', onEnter)
      window.removeEventListener('dragover',  onOver)
      window.removeEventListener('dragleave', onLeave)
      window.removeEventListener('drop',      onDrop)
    }
  }, [loadPackageInfo])

  const handleSelect = async () => {
    if (!window.electronAPI) { setLoadError('IPC недоступен — перезапустите приложение'); return }
    try { const fp = await window.electronAPI.selectFile(); if (fp) await loadPackageInfo() }
    catch (e: any) { setLoadError(`Ошибка диалога: ${e.message}`) }
  }

  const handleInstall = async () => {
    setStage('installing'); setLogs([])
    const unsub = window.electronAPI.onInstallLog(l => setLogs(p => [...p, l]))
    const res = await window.electronAPI.installPackage(targetEnv)
    unsub()
    setResult({ success: res.success, message: res.success ? (res.message ?? 'Успешно!') : (res.error ?? 'Ошибка') })
    setStage('done')
  }

  const handleReset = () => {
    setStage('drop'); setPkgInfo(null); setLogs([]); setResult(null)
    setLoadError(null); setDragOver(false); dragCounter.current = 0; setScriptAck(false)
    onClearInitial?.()
  }

  const cfg = pkgInfo?.config as RcktConfig | undefined
  const hasScripts = (cfg?.bash?.pre_install?.length ?? 0) + (cfg?.bash?.post_install?.length ?? 0) > 0
  const scriptLevel = pkgInfo?.scriptAnalyses?.reduce((acc, s) =>
    s.level === 'danger' ? 'danger' : acc === 'danger' ? 'danger' : s.level, 'clean' as string) ?? 'clean'
  const needsAck = hasScripts && scriptLevel !== 'clean'
  const targetBin = targetEnv === 'global'
    ? '/usr/local/bin'
    : `~/.local/bin/${cfg?.name ?? 'app'}`

  return (
    <div className="page-content">
      <AnimatePresence mode="wait">

        {/* ── Drop ── */}
        {stage === 'drop' && (
          <motion.div key="drop" className="stage stage-home"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

            <div className="home-hero">
              <div className="home-glow"/>
              <motion.div className="home-rocket"
                animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                <RocketLogo size={80} uid="hero"/>
              </motion.div>
              <div className="home-text">
                <h1 className="home-title">Rock_ET</h1>
                <p className="home-sub">Менеджер пакетов нового поколения для Linux</p>
                <p className="home-desc">Видите всё до установки — скрипты, файлы, риски. Изоляция через bubblewrap.</p>
              </div>
            </div>

            <div
              className={`dropzone ${dragOver ? 'dragover' : ''} ${loading ? 'busy' : ''}`}
              onClick={!loading ? handleSelect : undefined}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && !loading && handleSelect()}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" className="dz-inner"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="spinner lg"/>
                    <p className="dz-title">Читаем пакет...</p>
                  </motion.div>
                ) : dragOver ? (
                  <motion.div key="over" className="dz-inner"
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.span className="dz-icon"
                      animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 0.6 }}>📂</motion.span>
                    <p className="dz-title">Отпустите .rckt файл!</p>
                  </motion.div>
                ) : (
                  <motion.div key="idle" className="dz-inner"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span className="dz-icon">📦</span>
                    <p className="dz-title">Перетащите .rckt пакет</p>
                    <p className="dz-hint">или нажмите, чтобы открыть файловый диалог</p>
                    <div className="dz-ext">.rckt</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {loadError && (
              <motion.div className="alert-err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                ⚠ {loadError}
              </motion.div>
            )}

            <div className="feat-cards">
              {[
                { icon: '👁', title: 'Превью до установки', desc: 'Видите каждый файл, путь и команду прежде чем нажать «Установить»' },
                { icon: '🔍', title: 'Анализ скриптов',     desc: 'Автоматически подсвечиваем опасные паттерны: sudo, curl|bash, ~/.ssh' },
                { icon: '🔒', title: 'Sandbox (bwrap)',      desc: 'Приложения изолированы через bubblewrap — система в безопасности' },
                { icon: '📋', title: 'Реестр пакетов',       desc: 'Знает что установлено и полностью удаляет без «хвостов»' },
              ].map(card => (
                <div key={card.title} className="feat-card glass">
                  <span className="fc-icon">{card.icon}</span>
                  <div>
                    <p className="fc-title">{card.title}</p>
                    <p className="fc-desc">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rckt-hint glass">
              <div className="rh-header">
                <code className="rh-ext">.rckt</code>
                <span className="rh-sep">—</span>
                <span className="rh-sub">Smart-архив (tar.gz) со строгой структурой</span>
              </div>
              <div className="rh-tree">
                {[
                  ['config.yaml',       'манифест: name, version, icon, depends, sandbox…'],
                  ['info.txt',          'описание от автора (что делает пакет)'],
                  ['bin/',              'бинарники → chmod +x при установке'],
                  ['bash/',             'pre/post install/uninstall скрипты'],
                  ['libs/',             'bundled .so для sandbox-изоляции'],
                  ['data/ configs/',    'данные и конфиги приложения'],
                  ['source/wgets.list', 'URL dest [sha256:HASH]'],
                ].map(([name, desc]) => (
                  <div key={name} className="rh-row">
                    <code>{name}</code><span>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Preview ── */}
        {stage === 'preview' && pkgInfo && cfg && (
          <motion.div key="preview" className="stage"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>

            <div className="pkg-header glass">
              <span className="pkg-icon">{cfg.icon ?? '📦'}</span>
              <div className="pkg-meta">
                <div className="row-wrap">
                  <h2 className="pkg-name">{cfg.name}</h2>
                  <span className="badge">{cfg.version}</span>
                  {cfg.license && <span className="badge-ghost">{cfg.license}</span>}
                  {cfg.sandbox?.enabled && <span className="badge-sandbox">🔒 Sandbox</span>}
                </div>
                {cfg.description && <p className="pkg-desc">{cfg.description}</p>}
                {cfg.author      && <p className="pkg-author">by {cfg.author}</p>}
                {cfg.verified_on && cfg.verified_on.length > 0 && (
                  <p className="pkg-verified">🐧 Проверено: {cfg.verified_on.join(', ')}</p>
                )}
              </div>
            </div>

            {/* INFO.txt big button */}
            {pkgInfo.infoText && (
              <motion.button className="btn-info-full"
                onClick={() => setShowInfo(true)}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <span className="bif-icon">📖</span>
                <div className="bif-text">
                  <span className="bif-title">Просмотреть функционал и действия</span>
                  <span className="bif-sub">Описание от автора пакета</span>
                </div>
                <span className="bif-arr">→</span>
              </motion.button>
            )}

            <SmartDigest info={pkgInfo} targetEnv={targetEnv}/>

            {(pkgInfo.scriptAnalyses?.length ?? 0) > 0 && (
              <div className="glass card-block">
                <p className="block-title">
                  🔍 Анализ скриптов
                  {scriptLevel === 'danger' && <span className="title-badge danger">Опасные команды</span>}
                  {scriptLevel === 'warn'   && <span className="title-badge warn">Подозрительно</span>}
                  {scriptLevel === 'clean'  && <span className="title-badge ok">Всё чисто</span>}
                </p>
                <div className="scripts-list">
                  {pkgInfo.scriptAnalyses!.map(a => <ScriptViewer key={a.name} analysis={a}/>)}
                </div>
              </div>
            )}

            <div className="glass card-block">
              <p className="block-title">📋 Что будет установлено</p>
              <div className="steps">
                {(pkgInfo.wgets?.length ?? 0) > 0 && (
                  <div className="step">
                    <span className="step-icon">⬇</span>
                    <div>
                      <p className="step-label">Загрузки из сети ({pkgInfo.wgets!.length})</p>
                      {pkgInfo.wgets!.slice(0, 3).map((w, i) => (
                        <code key={i} className="step-val">
                          {w.url.split('/').pop()} → {w.dest}
                          {w.sha256 && <span style={{color:'var(--green)',marginLeft:6}}>✓ sha256</span>}
                        </code>
                      ))}
                      {pkgInfo.wgets!.length > 3 && <span className="step-more">+ещё {pkgInfo.wgets!.length - 3}</span>}
                    </div>
                  </div>
                )}
                {(pkgInfo.binFiles?.length ?? 0) > 0 && (
                  <div className="step">
                    <span className="step-icon">💾</span>
                    <div>
                      <p className="step-label">Бинарники → <code className="hl">{targetBin}</code></p>
                      {pkgInfo.binFiles!.map(f => <code key={f} className="step-val">{f}</code>)}
                    </div>
                  </div>
                )}
                {(pkgInfo.dataFiles?.length ?? 0) > 0 && (
                  <div className="step">
                    <span className="step-icon">📁</span>
                    <div><p className="step-label">Данные ({pkgInfo.dataFiles!.length} файлов)</p></div>
                  </div>
                )}
                {(pkgInfo.configFiles?.length ?? 0) > 0 && (
                  <div className="step">
                    <span className="step-icon">⚙</span>
                    <div>
                      <p className="step-label">Конфиги ({pkgInfo.configFiles!.length} файлов)</p>
                      {pkgInfo.configFiles!.map(f => <code key={f} className="step-val">{f}</code>)}
                    </div>
                  </div>
                )}
                {(pkgInfo.libFiles?.length ?? 0) > 0 && (
                  <div className="step">
                    <span className="step-icon">🧩</span>
                    <div>
                      <p className="step-label">Bundled libs ({pkgInfo.libFiles!.length} файлов)</p>
                      <span className="step-more">Для sandbox-изоляции</span>
                    </div>
                  </div>
                )}
                {(cfg.depends?.length ?? 0) > 0 && (
                  <div className="step">
                    <span className="step-icon">📎</span>
                    <div>
                      <p className="step-label">Зависимости</p>
                      {cfg.depends!.map(d => <code key={d} className="step-val">{d}</code>)}
                    </div>
                  </div>
                )}
                {(cfg.conflicts?.length ?? 0) > 0 && (
                  <div className="step">
                    <span className="step-icon">⚔</span>
                    <div>
                      <p className="step-label">Конфликтует с</p>
                      {cfg.conflicts!.map(d => <code key={d} className="step-val">{d}</code>)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="glass card-block">
              <p className="block-title">📄 config.yaml</p>
              <div className="terminal-mini">
                <div className="tm-bar">
                  <span className="tmd r"/><span className="tmd y"/><span className="tmd g"/>
                  <span className="tm-fn">config.yaml</span>
                </div>
                <pre className="tm-code">{pkgInfo.configYaml}</pre>
              </div>
            </div>

            <div className="glass card-block">
              <p className="block-title">🎯 Куда установить?</p>
              <div className="targets">
                {(['sandbox', 'global'] as const).map(env => (
                  <label key={env} className={`t-item ${targetEnv === env ? 'sel' : ''}`}>
                    <input type="radio" name="env" checked={targetEnv === env} onChange={() => setTargetEnv(env)}/>
                    <div className="t-radio"/>
                    <div className="t-body">
                      <strong>{env === 'sandbox' ? '🔒 Sandbox (bubblewrap)' : '🌍 Глобальная (для всех)'}</strong>
                      <code>{env === 'sandbox'
                        ? `~/.local/share/rock-et/apps/${cfg?.name ?? '…'}`
                        : '/usr/local/bin'}</code>
                      <span>{env === 'sandbox'
                        ? 'Изоляция через bwrap — launcher в ~/.local/bin'
                        : 'Системная установка, требует sudo'}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {needsAck && (
              <motion.div className={`ack-box ${scriptLevel}`}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <label className="ack-label">
                  <input type="checkbox" checked={scriptAck} onChange={e => setScriptAck(e.target.checked)}/>
                  <span>
                    {scriptLevel === 'danger'
                      ? '🔴 Я прочитал скрипты и понимаю, что они делают опасные вещи'
                      : '⚠ Я ознакомился со скриптами и принимаю риски'}
                  </span>
                </label>
              </motion.div>
            )}

            <div className="summary-bar">
              <span>{targetEnv === 'sandbox' ? '🔒' : '📍'}</span>
              <span>
                <strong>{cfg.name}</strong>
                {targetEnv === 'sandbox'
                  ? <> → launcher <code className="hl">{targetBin}</code>, данные в <code className="hl">~/.local/share/rock-et/apps/{cfg.name}</code></>
                  : <> установится в <code className="hl">{targetBin}</code></>}
              </span>
            </div>

            <div className="actions">
              <button className="btn-ghost" onClick={handleReset}>← Назад</button>
              <button className="btn-launch" onClick={handleInstall} disabled={needsAck && !scriptAck}>
                🚀 Запустить установку
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Installing ── */}
        {stage === 'installing' && (
          <motion.div key="installing" className="stage stage-install"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="inst-head glass">
              <motion.span className="inst-rocket"
                animate={{ y: [0, -14, 0], rotate: [0, 4, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}>🚀</motion.span>
              <div>
                <h2 className="inst-title">Установка...</h2>
                <p className="inst-pkg">{cfg?.name} v{cfg?.version}</p>
              </div>
              <div className="spinner" style={{ marginLeft: 'auto' }}/>
            </div>
            <div className="terminal glass">
              <div className="tm-bar">
                <span className="tmd r"/><span className="tmd y"/><span className="tmd g"/>
                <span className="tm-fn">live output</span>
              </div>
              <div className="tm-scroll">
                {logs.length === 0 && <div className="log muted">Ожидание вывода...</div>}
                {logs.map((l, i) => <div key={i} className="log">{l}</div>)}
                <div ref={logsEndRef}/>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Done ── */}
        {stage === 'done' && result && (
          <motion.div key="done" className="stage stage-done"
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div className="result-emoji"
              initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.55, delay: 0.08 }}>
              {result.success ? '🎉' : '💥'}
            </motion.div>
            <h2 className={result.success ? 'ok' : 'err'}>
              {result.success ? 'Установка успешна!' : 'Ошибка установки'}
            </h2>
            <p className="result-msg">{result.message}</p>
            {result.success && (
              <div className="summary-bar success">
                ✅ {targetEnv === 'sandbox' ? `Sandbox: ${targetBin}` : `Установлено в ${targetBin}`}
              </div>
            )}
            <div className="terminal glass" style={{ maxHeight: 220 }}>
              <div className="tm-bar">
                <span className="tmd r"/><span className="tmd y"/><span className="tmd g"/>
                <span className="tm-fn">Лог установки</span>
              </div>
              <div className="tm-scroll" style={{ maxHeight: 180 }}>
                {logs.map((l, i) => <div key={i} className="log">{l}</div>)}
              </div>
            </div>
            <button className="btn-launch" onClick={handleReset}>← Установить ещё</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info text modal */}
      <AnimatePresence>
        {showInfo && pkgInfo?.infoText && (
          <InfoModal
            text={pkgInfo.infoText}
            name={cfg?.name ?? ''}
            icon={cfg?.icon}
            onClose={() => setShowInfo(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Installed Page ────────────────────────────────────────────────────────────

function InstalledPage() {
  const [packages, setPackages] = useState<InstalledPackage[]>([])
  const [loading, setLoading]   = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const [logs, setLogs]         = useState<string[]>([])
  const [error, setError]       = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await window.electronAPI.listInstalled()
    setPackages(res.packages ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleUninstall = async (name: string) => {
    setRemoving(name); setLogs([])
    const unsub = window.electronAPI.onUninstallLog(l => setLogs(p => [...p, l]))
    await window.electronAPI.uninstallPackage(name)
    unsub(); setRemoving(null)
    await load()
  }

  if (loading) return (
    <div className="page-content center-page">
      <div className="spinner lg"/>
      <p className="muted-text">Загрузка реестра...</p>
    </div>
  )

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">Установленные пакеты</h2>
        <button className="btn-ghost sm" onClick={load}>↻ Обновить</button>
      </div>

      {error && <div className="alert-err">{error}</div>}

      {packages.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>Пока ничего не установлено</p>
          <p className="muted-text">Перейдите в «Каталог» или «Установка» чтобы добавить первый пакет</p>
        </div>
      ) : (
        <div className="pkg-list">
          {packages.map(pkg => (
            <motion.div key={pkg.name} className="pkg-card glass"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="pkc-left">
                <span className="pkc-icon">{pkg.icon ?? '📦'}</span>
                <div>
                  <div className="row-wrap">
                    <span className="pkc-name">{pkg.name}</span>
                    <span className="badge">{pkg.version}</span>
                    {pkg.sandboxed
                      ? <span className="badge-sandbox">🔒 Sandbox</span>
                      : <span className="badge-ghost">🌍 Global</span>}
                  </div>
                  {pkg.description && <p className="pkc-desc">{pkg.description}</p>}
                  <p className="pkc-meta">
                    {pkg.author && <span>by {pkg.author} · </span>}
                    {pkg.files.length} файлов · {new Date(pkg.installedAt).toLocaleDateString('ru-RU')}
                    {pkg.launcherPath && <> · <code style={{fontSize:10,color:'var(--blue)'}}>{pkg.launcherPath}</code></>}
                  </p>
                </div>
              </div>
              <button className="btn-remove" onClick={() => handleUninstall(pkg.name)} disabled={removing === pkg.name}>
                {removing === pkg.name ? <div className="spinner"/> : '🗑 Удалить'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {logs.length > 0 && (
        <div className="terminal glass" style={{ marginTop: 16 }}>
          <div className="tm-bar">
            <span className="tmd r"/><span className="tmd y"/><span className="tmd g"/>
            <span className="tm-fn">uninstall log</span>
          </div>
          <div className="tm-scroll">
            {logs.map((l, i) => <div key={i} className="log">{l}</div>)}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Settings Page ─────────────────────────────────────────────────────────────

const THEME_DEFS: { id: AppSettings['theme']; label: string; bg: string; accent: string; text: string; surf: string }[] = [
  { id: 'dark',       label: 'Dark',       bg: '#07091a', accent: '#ff5f1f', text: '#c6d8f0', surf: '#0c1030' },
  { id: 'amoled',     label: 'AMOLED',     bg: '#000000', accent: '#ff5f1f', text: '#e8e8e8', surf: '#111111' },
  { id: 'nord',       label: 'Nord',       bg: '#2e3440', accent: '#88c0d0', text: '#eceff4', surf: '#3b4252' },
  { id: 'catppuccin', label: 'Catppuccin', bg: '#1e1e2e', accent: '#cba6f7', text: '#cdd6f4', surf: '#24273a' },
]

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className={`toggle ${value ? 'on' : ''}`} onClick={() => onChange(!value)}>
      <div className="toggle-knob"/>
    </button>
  )
}

function SettingsPage({ settings, onUpdate }: { settings: AppSettings; onUpdate: (p: Partial<AppSettings>) => void }) {
  const [info, setInfo]       = useState<SystemInfo | null>(null)
  const [catUrlDraft, setCatUrlDraft] = useState(settings.catalogUrl)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null)

  useEffect(() => { window.electronAPI?.getSystemInfo().then(setInfo) }, [])
  useEffect(() => { setCatUrlDraft(settings.catalogUrl) }, [settings.catalogUrl])

  const testUrl = async () => {
    setTesting(true); setTestResult(null)
    try {
      const res = await window.electronAPI.fetchCatalog()
      setTestResult(res.success
        ? { ok: true,  msg: `OK — ${(res.data?.packages?.length ?? 0)} пакет(ов)` }
        : { ok: false, msg: res.error ?? 'Ошибка' })
    } catch (e: any) { setTestResult({ ok: false, msg: e.message }) }
    setTesting(false)
  }

  const saveCatalogUrl = () => {
    onUpdate({ catalogUrl: catUrlDraft })
    setTestResult(null)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">Настройки</h2>
      </div>

      {/* ── Внешний вид ── */}
      <div className="glass card-block">
        <p className="block-title">🎨 Внешний вид</p>
        <div className="stg-section">
          <p className="stg-label">Тема оформления</p>
          <div className="theme-grid">
            {THEME_DEFS.map(t => (
              <button
                key={t.id}
                className={`theme-card ${settings.theme === t.id ? 'active' : ''}`}
                onClick={() => onUpdate({ theme: t.id })}
              >
                <div className="tc-preview" style={{ background: t.bg }}>
                  <div className="tc-sidebar" style={{ background: t.surf }}/>
                  <div className="tc-content">
                    <div className="tc-bar" style={{ background: t.accent }}/>
                    <div className="tc-lines">
                      <div style={{ background: t.text, opacity: .6 }}/>
                      <div style={{ background: t.text, opacity: .3 }}/>
                      <div style={{ background: t.text, opacity: .2, width: '60%' }}/>
                    </div>
                  </div>
                  {settings.theme === t.id && <div className="tc-check">✓</div>}
                </div>
                <span className="tc-label">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="stg-row">
            <div>
              <span className="stg-row-label">Анимации</span>
              <span className="stg-row-sub">Переходы и плавные эффекты</span>
            </div>
            <Toggle value={settings.animations} onChange={v => onUpdate({ animations: v })}/>
          </div>
        </div>
      </div>

      {/* ── Источники пакетов ── */}
      <div className="glass card-block">
        <p className="block-title">📡 Источники пакетов</p>
        <div className="stg-section">
          <p className="stg-label">URL каталога</p>
          <div className="stg-url-row">
            <input
              className="stg-input"
              value={catUrlDraft}
              onChange={e => setCatUrlDraft(e.target.value)}
              placeholder="https://raw.githubusercontent.com/..."
              spellCheck={false}
            />
          </div>
          <div className="stg-url-actions">
            <button className="btn-ghost sm" onClick={() => setCatUrlDraft(DEFAULT_SETTINGS.catalogUrl)}>
              ↩ По умолчанию
            </button>
            <button className="btn-ghost sm" onClick={testUrl} disabled={testing}>
              {testing ? <><div className="spinner" style={{width:10,height:10}}/> Проверка...</> : '🔌 Проверить'}
            </button>
            <button className="btn-launch" style={{padding:'6px 14px',fontSize:12}} onClick={saveCatalogUrl}
              disabled={catUrlDraft === settings.catalogUrl}>
              Сохранить
            </button>
          </div>
          {testResult && (
            <div className={`stg-test-result ${testResult.ok ? 'ok' : 'err'}`}>
              {testResult.ok ? '✅' : '❌'} {testResult.msg}
            </div>
          )}
        </div>
      </div>

      {/* ── Установка ── */}
      <div className="glass card-block">
        <p className="block-title">📦 Установка</p>
        <div className="stg-section">
          <div className="stg-row">
            <div>
              <span className="stg-row-label">Режим по умолчанию</span>
              <span className="stg-row-sub">Sandbox (bwrap) или Глобальная (pkexec)</span>
            </div>
            <div className="stg-mode-btns">
              {(['sandbox','global'] as const).map(m => (
                <button key={m} className={`stg-mode-btn ${settings.defaultInstallMode === m ? 'active' : ''}`}
                  onClick={() => onUpdate({ defaultInstallMode: m })}>
                  {m === 'sandbox' ? '🔒 Sandbox' : '🌍 Global'}
                </button>
              ))}
            </div>
          </div>
          <div className="stg-row">
            <div>
              <span className="stg-row-label">Проверять обновления</span>
              <span className="stg-row-sub">При открытии каталога</span>
            </div>
            <Toggle value={settings.checkUpdates} onChange={v => onUpdate({ checkUpdates: v })}/>
          </div>
        </div>
      </div>

      {/* ── Система ── */}
      <div className="glass card-block">
        <p className="block-title">🖥 Система</p>
        <div className="settings-rows">
          <div className="srow"><span className="srow-label">Дистрибутив</span><span className="srow-val">{info?.distro ?? '...'}</span></div>
          <div className="srow"><span className="srow-label">Home</span><code className="srow-val">{info?.homeDir ?? '...'}</code></div>
          <div className="srow"><span className="srow-label">Rock_ET data</span><code className="srow-val">{info?.rockEtDir ?? '...'}</code></div>
          <div className="srow">
            <span className="srow-label">bubblewrap</span>
            <span className={`srow-val ${info?.bwrapAvailable ? 'text-green' : 'text-red'}`}>
              {info == null ? '...' : info.bwrapAvailable ? `✅ ${info.bwrapVersion}` : '❌ Не установлен'}
            </span>
          </div>
          {!info?.bwrapAvailable && info != null && (
            <div className="bwrap-hint">
              <pre className="tm-code" style={{margin:0}}>{`sudo apt install bubblewrap     # Debian/Ubuntu
sudo pacman -S bubblewrap       # Arch Linux
sudo dnf install bubblewrap     # Fedora`}</pre>
            </div>
          )}
        </div>
      </div>

      {/* ── О приложении ── */}
      <div className="glass card-block">
        <p className="block-title">ℹ О Rock_ET</p>
        <div className="settings-rows">
          <div className="srow"><span className="srow-label">Версия</span><span className="srow-val">0.1.0 alpha</span></div>
          <div className="srow"><span className="srow-label">Стек</span><span className="srow-val">Electron 32 · React 19 · Vite 8 · TypeScript</span></div>
          <div className="srow"><span className="srow-label">Формат</span><span className="srow-val">.rckt (tar.gz, v1)</span></div>
          <div className="srow"><span className="srow-label">Sandbox</span><span className="srow-val">bubblewrap (bwrap)</span></div>
          <div className="srow"><span className="srow-label">Лицензия</span><span className="srow-val">MIT</span></div>
        </div>
      </div>
    </div>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────────

function App() {
  const [page, setPage]       = useState<Page>('catalog')
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [preloadedInstall, setPreloadedInstall] = useState<PackageInfo | null>(null)

  useEffect(() => {
    window.electronAPI?.getSettings().then(s => {
      setSettings(s)
      applyTheme(s.theme)
    })
  }, [])

  const updateSettings = useCallback(async (partial: Partial<AppSettings>) => {
    const next = { ...settings, ...partial }
    setSettings(next)
    if (partial.theme) applyTheme(partial.theme)
    await window.electronAPI?.saveSettings(partial)
  }, [settings])

  const handleCatalogInstall = (info: PackageInfo) => {
    setPreloadedInstall(info)
    setPage('install')
  }

  const transition = settings.animations
    ? { duration: 0.15 }
    : { duration: 0 }

  return (
    <div className="app">
      <div className="titlebar">
        <div className="tb-logo"><RocketLogo size={20} uid="tb"/></div>
        <span className="tb-appname">Rock_ET</span>
        <div className="tb-drag"/>
        <div className="tb-controls">
          <button className="tb-btn" onClick={() => window.electronAPI?.minimize()} title="Свернуть">
            <svg width="11" height="2" viewBox="0 0 11 2"><rect width="11" height="1.5" y="0.25" fill="currentColor"/></svg>
          </button>
          <button className="tb-btn" onClick={() => window.electronAPI?.maximize()} title="Развернуть">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="0.6" y="0.6" width="8.8" height="8.8"/></svg>
          </button>
          <button className="tb-btn tb-close" onClick={() => window.electronAPI?.close()} title="Закрыть">
            <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4"><line x1="0.5" y1="0.5" x2="9.5" y2="9.5"/><line x1="9.5" y1="0.5" x2="0.5" y2="9.5"/></svg>
          </button>
        </div>
      </div>

      <div className="layout">
        <Sidebar page={page} onNav={setPage}/>
        <AnimatePresence mode="wait">
          <motion.div key={page} className="content"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }} transition={transition}>
            {page === 'catalog'   && <CatalogPage onInstall={handleCatalogInstall} settings={settings}/>}
            {page === 'install'   && (
              <InstallPage
                initialInfo={preloadedInstall}
                onClearInitial={() => setPreloadedInstall(null)}
                defaultInstallMode={settings.defaultInstallMode}
              />
            )}
            {page === 'installed' && <InstalledPage/>}
            {page === 'settings'  && <SettingsPage settings={settings} onUpdate={updateSettings}/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
