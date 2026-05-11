import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import fs from 'node:fs/promises'
import { existsSync, createReadStream } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawn, execFile } from 'node:child_process'
import * as tar from 'tar'
import os from 'node:os'
import yaml from 'js-yaml'
import { fileURLToPath } from 'node:url'

const __dirname   = path.dirname(fileURLToPath(import.meta.url))
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const PRELOAD_PATH = path.join(__dirname, 'preload.cjs')
const ROCK_ET_DIR  = path.join(os.homedir(), '.local', 'share', 'rock-et')
const APPS_DIR     = path.join(ROCK_ET_DIR, 'apps')
const STAGING_DIR  = path.join(ROCK_ET_DIR, '.staging')
const LOCAL_BIN    = path.join(os.homedir(), '.local', 'bin')
const SETTINGS_DIR = path.join(os.homedir(), '.config', 'rock-et')
const SETTINGS_PATH = path.join(SETTINGS_DIR, 'settings.json')
const DEFAULT_CATALOG_URL = 'https://raw.githubusercontent.com/Halva-developer/ROCK_ET-packages-/main/catalog.json'

let currentPackagePath: string | null = null
let mainWindow: BrowserWindow | null = null

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RcktConfig {
  rckt_version?: number
  name: string
  version: string
  description?: string
  author?: string
  license?: string
  icon?: string
  depends?: string[]
  conflicts?: string[]
  install?: {
    bin?:     { target: string }
    data?:    { target: string }
    configs?: { target: string }
  }
  bash?: {
    pre_install?:    string[]
    post_install?:   string[]
    pre_uninstall?:  string[]
    post_uninstall?: string[]
  }
  sandbox?: {
    enabled?: boolean
    libs?: string
    permissions?: {
      network?: boolean
      home?: 'none' | 'readonly' | 'readwrite'
      display?: boolean
      audio?: boolean
    }
  }
  verified_on?: string[]
  last_verified?: string
  log?: { level?: string }
}

export interface ScriptFinding {
  line: number; text: string; reason: string; level: 'danger' | 'warn'
}
export interface ScriptAnalysis {
  name: string; content: string; level: 'danger' | 'warn' | 'clean'; findings: ScriptFinding[]
}
export interface InstalledPackage {
  name: string; version: string; description?: string; author?: string; icon?: string
  installedAt: string
  targetEnv: 'sandbox' | 'global'
  sandboxed: boolean
  launcherPath?: string
  files: string[]
  dirsCreated: string[]
}

type Registry = Record<string, InstalledPackage>
interface WgetEntry { url: string; dest: string; sha256?: string }

export interface AppSettings {
  theme: 'dark' | 'amoled' | 'nord' | 'catppuccin'
  catalogUrl: string
  defaultInstallMode: 'sandbox' | 'global'
  animations: boolean
  checkUpdates: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  catalogUrl: DEFAULT_CATALOG_URL,
  defaultInstallMode: 'sandbox',
  animations: true,
  checkUpdates: true,
}

async function readSettings(): Promise<AppSettings> {
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(await fs.readFile(SETTINGS_PATH, 'utf-8')) } }
  catch { return { ...DEFAULT_SETTINGS } }
}
async function writeSettings(s: AppSettings): Promise<void> {
  await fs.mkdir(SETTINGS_DIR, { recursive: true })
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(s, null, 2))
}

// ── Config validation ─────────────────────────────────────────────────────────

function validateConfig(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return 'config.yaml не является объектом'
  const c = raw as Record<string, unknown>
  if (!c.name || typeof c.name !== 'string' || !c.name.trim())
    return 'Обязательное поле "name" отсутствует или пустое'
  if (!c.version || typeof c.version !== 'string' || !c.version.trim())
    return 'Обязательное поле "version" отсутствует или пустое'
  if (c.rckt_version !== undefined && typeof c.rckt_version !== 'number')
    return 'Поле "rckt_version" должно быть числом'
  if (typeof c.rckt_version === 'number' && c.rckt_version > 1)
    return `Формат пакета v${c.rckt_version} не поддерживается (максимум v1)`
  if (typeof c.name === 'string' && /[^a-zA-Z0-9_\-.]/.test(c.name))
    return 'Поле "name" содержит недопустимые символы (разрешены: a-z A-Z 0-9 _ - .)'
  return null
}

// ── Script analyzer ───────────────────────────────────────────────────────────

const DANGER_PATTERNS: { pattern: RegExp; level: 'danger' | 'warn'; reason: string }[] = [
  { pattern: /\.ssh/,                     level: 'danger', reason: 'Доступ к SSH ключам' },
  { pattern: /\.gnupg/,                   level: 'danger', reason: 'Доступ к GPG ключам' },
  { pattern: /\/etc\//,                   level: 'danger', reason: 'Изменение системных файлов' },
  { pattern: /curl[^|]*\|[^|]*bash/,      level: 'danger', reason: 'Выполнение кода из сети' },
  { pattern: /wget[^|]*\|[^|]*bash/,      level: 'danger', reason: 'Выполнение кода из сети' },
  { pattern: /\beval\b/,                  level: 'danger', reason: 'Динамическое выполнение кода' },
  { pattern: /base64\s+-d/,              level: 'danger', reason: 'Возможная обфускация' },
  { pattern: /rm\s+-rf\s+~\//,           level: 'danger', reason: 'Удаление домашней директории' },
  { pattern: /rm\s+-rf\s+\//,            level: 'danger', reason: 'Удаление корня системы' },
  { pattern: /\bsudo\b/,                  level: 'warn',   reason: 'Запрос прав root' },
  { pattern: /chmod\s+777/,              level: 'warn',   reason: 'Небезопасные права доступа' },
  { pattern: /\bcurl\b/,                  level: 'warn',   reason: 'Загрузка из сети (curl)' },
  { pattern: /\bwget\b/,                  level: 'warn',   reason: 'Загрузка из сети (wget)' },
  { pattern: /crontab/,                   level: 'warn',   reason: 'Изменение автозапуска' },
  { pattern: /\.(bashrc|profile|zshrc)/, level: 'warn',   reason: 'Изменение переменных среды' },
  { pattern: /systemctl/,                level: 'warn',   reason: 'Управление системными службами' },
]

function analyzeScript(name: string, content: string): ScriptAnalysis {
  const findings: ScriptFinding[] = []
  content.split('\n').forEach((line, i) => {
    if (line.trim().startsWith('#') || !line.trim()) return
    for (const { pattern, level, reason } of DANGER_PATTERNS) {
      if (pattern.test(line)) { findings.push({ line: i + 1, text: line.trim(), reason, level }); break }
    }
  })
  const level = findings.some(f => f.level === 'danger') ? 'danger'
              : findings.some(f => f.level === 'warn')   ? 'warn' : 'clean'
  return { name, content, level, findings }
}

// ── Checksum ──────────────────────────────────────────────────────────────────

async function sha256File(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(filePath)
    stream.on('data', d => hash.update(d))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', reject)
  })
}

async function verifyChecksum(filePath: string, expected: string): Promise<boolean> {
  return (await sha256File(filePath)) === expected.toLowerCase()
}

// ── Registry ──────────────────────────────────────────────────────────────────

async function readRegistry(): Promise<Registry> {
  try { return JSON.parse(await fs.readFile(path.join(ROCK_ET_DIR, 'installed.json'), 'utf-8')) }
  catch { return {} }
}
async function writeRegistry(reg: Registry): Promise<void> {
  await fs.mkdir(ROCK_ET_DIR, { recursive: true })
  await fs.writeFile(path.join(ROCK_ET_DIR, 'installed.json'), JSON.stringify(reg, null, 2))
}

// ── Bwrap launcher ────────────────────────────────────────────────────────────

async function generateBwrapLauncher(config: RcktConfig, appDir: string): Promise<string> {
  const perms = config.sandbox?.permissions ?? {}
  const hasLibs = existsSync(path.join(appDir, 'libs'))

  let mainBin = config.name
  try {
    const bins = await fs.readdir(path.join(appDir, 'bin'))
    if (bins.length > 0) mainBin = bins.sort()[0]
  } catch { /* use config.name */ }

  const args: string[] = [
    `  --ro-bind /usr /usr`,
    `  --ro-bind-try /lib /lib`,
    `  --ro-bind-try /lib64 /lib64`,
    `  --ro-bind-try /lib32 /lib32`,
    `  --proc /proc`,
    `  --dev /dev`,
    `  --tmpfs /tmp`,
    `  --unshare-pid`,
    `  --die-with-parent`,
  ]

  if (perms.network === false) args.push(`  --unshare-net`)

  if (perms.home === 'readonly')      args.push(`  --ro-bind "$HOME" "$HOME"`)
  else if (perms.home === 'readwrite') args.push(`  --bind "$HOME" "$HOME"`)

  if (perms.display !== false) {
    args.push(`  --bind-try /tmp/.X11-unix /tmp/.X11-unix`)
    args.push(`  --setenv DISPLAY "\${DISPLAY:-:0}"`)
    args.push(`  --bind-try "\${XDG_RUNTIME_DIR:-/run/user/$(id -u)}" "\${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"`)
    args.push(`  --setenv WAYLAND_DISPLAY "\${WAYLAND_DISPLAY:-wayland-0}"`)
  }

  if (hasLibs) {
    args.push(`  --ro-bind "$APP_DIR/libs" "/opt/${config.name}/libs"`)
    args.push(`  --setenv LD_LIBRARY_PATH "/opt/${config.name}/libs:\${LD_LIBRARY_PATH:-}"`)
  }

  args.push(`  --ro-bind "$APP_DIR/bin" "$APP_DIR/bin"`)
  if (existsSync(path.join(appDir, 'data')))
    args.push(`  --ro-bind "$APP_DIR/data" "$APP_DIR/data"`)
  if (existsSync(path.join(appDir, 'configs')))
    args.push(`  --bind "$APP_DIR/configs" "$APP_DIR/configs"`)

  const bwrapLines = args.map((a, i) => i < args.length - 1 ? a + ' \\' : a)

  return [
    `#!/bin/bash`,
    `# Rock_ET sandbox launcher — ${config.name} v${config.version}`,
    `# DO NOT EDIT — regenerated by Rock_ET on reinstall`,
    `APP_DIR="${appDir}"`,
    ``,
    `exec bwrap \\`,
    ...bwrapLines,
    `  "$APP_DIR/bin/${mainBin}" "$@"`,
    ``,
  ].join('\n')
}

// ── System info ───────────────────────────────────────────────────────────────

async function checkBwrap(): Promise<string | null> {
  return new Promise(resolve => {
    execFile('bwrap', ['--version'], (err, stdout) => resolve(err ? null : stdout.trim()))
  })
}
async function readDistroName(): Promise<string> {
  try {
    const raw = await fs.readFile('/etc/os-release', 'utf-8')
    const m = raw.match(/^PRETTY_NAME="?([^"\n]+)"?/m)
    return m ? m[1] : 'Linux'
  } catch { return 'Linux' }
}

// ── Window ────────────────────────────────────────────────────────────────────

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1060, height: 720, minWidth: 860, minHeight: 560,
    webPreferences: { preload: PRELOAD_PATH, contextIsolation: true, nodeIntegration: false },
    titleBarStyle: 'hidden', title: 'Rock_ET', backgroundColor: '#07091a', show: false,
  })
  mainWindow.once('ready-to-show', () => mainWindow?.show())
  mainWindow.webContents.on('will-navigate', e => e.preventDefault())
  console.log('[main] preload path:', PRELOAD_PATH)
  console.log('[main] preload exists:', existsSync(PRELOAD_PATH))
  mainWindow.webContents.on('preload-error', (_e, p, err) => console.error('[main] PRELOAD ERROR:', p, err))

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    const indexPath = path.join(__dirname, 'dist', 'index.html')
    mainWindow.loadFile(indexPath).catch(() => {
      mainWindow?.loadURL(`file://${path.join(process.resourcesPath, 'app.asar', 'dist', 'index.html')}`)
    })
  }
}

app.whenReady().then(createWindow)

// ── Window controls ───────────────────────────────────────────────────────────

ipcMain.handle('minimize-window', () => mainWindow?.minimize())
ipcMain.handle('maximize-window', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize(); else mainWindow?.maximize()
})
ipcMain.handle('close-window', () => mainWindow?.close())

// ── System info ───────────────────────────────────────────────────────────────

ipcMain.handle('get-system-info', async () => {
  const bwrapVersion = await checkBwrap()
  return {
    bwrapAvailable: !!bwrapVersion, bwrapVersion: bwrapVersion ?? null,
    distro: await readDistroName(), homeDir: os.homedir(), rockEtDir: ROCK_ET_DIR,
  }
})

// ── File loading ──────────────────────────────────────────────────────────────

ipcMain.handle('select-file', async () => {
  if (!mainWindow) return null
  const res = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Rock_ET Package (.rckt)', extensions: ['rckt'] }],
  })
  if (res.canceled) return null
  currentPackagePath = res.filePaths[0]
  return currentPackagePath
})

ipcMain.handle('upload-package', async (_, data: number[] | Uint8Array) => {
  try {
    const tmp = path.join(os.tmpdir(), `rocket-upload-${Date.now()}.rckt`)
    await fs.writeFile(tmp, Buffer.from(data))
    currentPackagePath = tmp
    return { success: true }
  } catch (e: any) { return { success: false, error: e.message } }
})

// ── Package info ──────────────────────────────────────────────────────────────

ipcMain.handle('read-package-info', async () => {
  if (!currentPackagePath) return { success: false, error: 'Пакет не загружен' }

  const tempDir = path.join(os.tmpdir(), `rocket-preview-${Date.now()}`)
  try {
    await fs.mkdir(tempDir, { recursive: true })
    await tar.x({ file: currentPackagePath, cwd: tempDir })

    const configPath = path.join(tempDir, 'config.yaml')
    if (!existsSync(configPath)) return { success: false, error: 'Файл config.yaml не найден в архиве' }

    const configRaw = await fs.readFile(configPath, 'utf-8')
    const config = yaml.load(configRaw) as RcktConfig

    const validErr = validateConfig(config)
    if (validErr) return { success: false, error: `Невалидный config.yaml: ${validErr}` }

    const bashFiles = await listDir(path.join(tempDir, 'bash'))
    const scriptAnalyses: ScriptAnalysis[] = []
    for (const name of bashFiles) {
      try {
        const content = await fs.readFile(path.join(tempDir, 'bash', name), 'utf-8')
        scriptAnalyses.push(analyzeScript(name, content))
      } catch { scriptAnalyses.push({ name, content: '', level: 'clean', findings: [] }) }
    }

    return {
      success: true, config, configYaml: configRaw,
      binFiles:    await listDirRecursive(path.join(tempDir, 'bin')),
      dataFiles:   await listDirRecursive(path.join(tempDir, 'data')),
      configFiles: await listDirRecursive(path.join(tempDir, 'configs')),
      libFiles:    await listDirRecursive(path.join(tempDir, 'libs')),
      bashScripts: bashFiles, scriptAnalyses,
      wgets:       await parseWgetsList(path.join(tempDir, 'source', 'wgets.list')),
      hasLicense:  existsSync(path.join(tempDir, 'license.txt')),
      totalSize:   await calcDirSize(tempDir),
      infoText:    await fs.readFile(path.join(tempDir, 'info.txt'), 'utf-8').catch(() => undefined),
    }
  } catch (e: any) { return { success: false, error: e.message } }
  finally { await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {}) }
})

// ── Install (transactional) ───────────────────────────────────────────────────

ipcMain.handle('install-package', async (event, targetEnv: 'sandbox' | 'global') => {
  if (!currentPackagePath) return { success: false, error: 'Пакет не загружен' }

  const send = (msg: string) => event.sender.send('install-log', msg)
  const extractDir = path.join(os.tmpdir(), `rocket-install-${Date.now()}`)

  try {
    send('📦 Распаковка пакета...')
    await fs.mkdir(extractDir, { recursive: true })
    await tar.x({ file: currentPackagePath, cwd: extractDir })

    const configRaw = await fs.readFile(path.join(extractDir, 'config.yaml'), 'utf-8')
    const config = yaml.load(configRaw) as RcktConfig

    const validErr = validateConfig(config)
    if (validErr) throw new Error(`Невалидный config.yaml: ${validErr}`)

    send(`✅ Пакет: ${config.icon ? config.icon + '  ' : ''}${config.name} v${config.version}`)
    if (config.description) send(`   ${config.description}`)

    // Check conflicts
    if ((config.conflicts?.length ?? 0) > 0) {
      const registry = await readRegistry()
      for (const conflict of config.conflicts!) {
        if (registry[conflict])
          throw new Error(`Конфликт с установленным пакетом "${conflict}" — удалите его сначала`)
      }
    }

    // Pre-install scripts
    for (const script of config.bash?.pre_install ?? []) {
      send(`\n🔧 [pre-install] ${script}`)
      await runScript(path.join(extractDir, 'bash', script), {
        RCKT_DIR: extractDir,
        RCKT_BIN: path.join(extractDir, 'bin'),
        RCKT_DATA: path.join(extractDir, 'data'),
        RCKT_CONFIGS: path.join(extractDir, 'configs'),
        RCKT_INSTALL_MODE: targetEnv,
      }, send)
    }

    // Download wgets
    const wgets = await parseWgetsList(path.join(extractDir, 'source', 'wgets.list'))
    const downloadedFiles: string[] = []
    if (wgets.length > 0) {
      send(`\n⬇ Загрузка файлов (${wgets.length})...`)
      for (const entry of wgets) {
        const dest = entry.dest.replace(/^~/, os.homedir())
        await fs.mkdir(path.dirname(dest), { recursive: true })
        send(`   ${entry.url.split('/').pop()} → ${dest}`)
        await runCommand(`wget -q -O "${dest}" "${entry.url}"`, send)
        if (entry.sha256) {
          send(`   🔐 Проверка контрольной суммы...`)
          const ok = await verifyChecksum(dest, entry.sha256)
          if (!ok) {
            await fs.unlink(dest).catch(() => {})
            throw new Error(`sha256 не совпадает для ${entry.url.split('/').pop()}`)
          }
          send(`   ✅ sha256 верна`)
        }
        downloadedFiles.push(dest)
      }
    }

    // ── SANDBOX: transactional staging → atomic rename ────────────────────────
    if (targetEnv === 'sandbox') {
      await fs.mkdir(STAGING_DIR, { recursive: true })
      const stagingPath = path.join(STAGING_DIR, `${config.name}-${Date.now()}`)
      const appDir = path.join(APPS_DIR, config.name)

      send(`\n🔒 Подготовка изолированного окружения...`)

      try {
        for (const dir of ['bin', 'data', 'configs', 'libs'] as const) {
          const src = path.join(extractDir, dir)
          if (existsSync(src)) {
            await fs.cp(src, path.join(stagingPath, dir), { recursive: true })
            const n = (await collectFiles(path.join(stagingPath, dir))).length
            send(`   ✓ ${dir}/ → ${n} файл${n === 1 ? '' : 'а/ов'}`)
          }
        }

        // chmod +x all binaries in staging
        const stagingBin = path.join(stagingPath, 'bin')
        if (existsSync(stagingBin))
          for (const f of await collectFiles(stagingBin)) await fs.chmod(f, 0o755)

        send(`\n🔄 Атомарная фиксация...`)
        await fs.mkdir(APPS_DIR, { recursive: true })
        if (existsSync(appDir)) {
          await fs.rm(appDir, { recursive: true, force: true })
          send(`   ↻ Предыдущая версия заменена`)
        }
        try {
          await fs.rename(stagingPath, appDir)
        } catch {
          // Cross-filesystem fallback
          await fs.cp(stagingPath, appDir, { recursive: true })
          await fs.rm(stagingPath, { recursive: true, force: true })
        }
        send(`   ✅ ${appDir}`)

      } catch (e) {
        await fs.rm(stagingPath, { recursive: true, force: true }).catch(() => {})
        throw e
      }

      // Generate bwrap launcher
      await fs.mkdir(LOCAL_BIN, { recursive: true })
      const launcherPath = path.join(LOCAL_BIN, config.name)
      await fs.writeFile(launcherPath, await generateBwrapLauncher(config, appDir))
      await fs.chmod(launcherPath, 0o755)
      send(`\n🔒 Launcher → ${launcherPath}`)

      // Post-install
      for (const script of config.bash?.post_install ?? []) {
        send(`\n🔧 [post-install] ${script}`)
        await runScript(path.join(extractDir, 'bash', script), {
          RCKT_DIR: appDir, RCKT_BIN: path.join(appDir, 'bin'),
          RCKT_DATA: path.join(appDir, 'data'), RCKT_CONFIGS: path.join(appDir, 'configs'),
          RCKT_INSTALL_MODE: 'sandbox',
        }, send).catch(e => send(`   ⚠ post-install: ${e.message}`))
      }

      const registry = await readRegistry()
      registry[config.name] = {
        name: config.name, version: config.version, description: config.description,
        author: config.author, icon: config.icon,
        installedAt: new Date().toISOString(),
        targetEnv: 'sandbox', sandboxed: true, launcherPath,
        files: [...(await collectFiles(appDir)), launcherPath, ...downloadedFiles],
        dirsCreated: [appDir],
      }
      await writeRegistry(registry)

      send(`\n🎉 ${config.name} v${config.version} установлен в sandbox!`)
      send(`   Запуск: ${launcherPath}`)
      return { success: true, message: `${config.name} v${config.version} установлен` }

    // ── GLOBAL: /usr/local/* via pkexec ──────────────────────────────────────
    } else {
      const targets = {
        bin:     '/usr/local/bin',
        data:    `/usr/local/share/${config.name}`,
        configs: `/etc/${config.name}`,
      }
      const createdDirs: string[] = []

      send(`\n🌍 Глобальная установка (потребуется пароль sudo)...`)

      // Stage files first (no root needed)
      await fs.mkdir(STAGING_DIR, { recursive: true })
      const stagingPath = path.join(STAGING_DIR, `global-${config.name}-${Date.now()}`)
      try {
        for (const dir of ['bin', 'data', 'configs'] as const) {
          const src = path.join(extractDir, dir)
          if (existsSync(src)) await fs.cp(src, path.join(stagingPath, dir), { recursive: true })
        }

        // Build privileged install script
        const installSh = [
          `#!/bin/bash`, `set -e`,
          `echo "[rock-et] Установка ${config.name} v${config.version}..."`,
          ...(existsSync(path.join(stagingPath, 'bin')) ? [
            `cp -r "${stagingPath}/bin/." "${targets.bin}/"`,
            `find "${targets.bin}" -maxdepth 1 -newer "${stagingPath}/bin" -type f -exec chmod +x {} \\;`,
            `echo "✓ bin"`,
          ] : []),
          ...(existsSync(path.join(stagingPath, 'data')) ? [
            `mkdir -p "${targets.data}"`,
            `cp -r "${stagingPath}/data/." "${targets.data}/"`,
            `echo "✓ data"`,
          ] : []),
          ...(existsSync(path.join(stagingPath, 'configs')) ? [
            `mkdir -p "${targets.configs}"`,
            `cp -r "${stagingPath}/configs/." "${targets.configs}/"`,
            `echo "✓ configs"`,
          ] : []),
          `echo "[rock-et] Готово"`,
        ].join('\n')

        const scriptPath = path.join(os.tmpdir(), `rock-et-global-${Date.now()}.sh`)
        await fs.writeFile(scriptPath, installSh, { mode: 0o755 })

        send(`   🔐 Запрос прав через pkexec...`)
        await runElevated(scriptPath, send)
        await fs.unlink(scriptPath).catch(() => {})

      } catch (e) {
        await fs.rm(stagingPath, { recursive: true, force: true }).catch(() => {})
        throw e
      }
      await fs.rm(stagingPath, { recursive: true, force: true }).catch(() => {})

      // Collect installed files for registry
      const installedFiles: string[] = []
      for (const [, dir] of Object.entries(targets)) {
        installedFiles.push(...await collectFiles(dir).catch(() => []))
      }

      for (const script of config.bash?.post_install ?? []) {
        send(`\n🔧 [post-install] ${script}`)
        await runScript(path.join(extractDir, 'bash', script), {
          RCKT_DIR: extractDir, RCKT_BIN: targets.bin,
          RCKT_DATA: targets.data, RCKT_CONFIGS: targets.configs,
          RCKT_INSTALL_MODE: 'global',
        }, send).catch(e => send(`   ⚠ post-install: ${e.message}`))
      }

      const registry = await readRegistry()
      registry[config.name] = {
        name: config.name, version: config.version, description: config.description,
        author: config.author, icon: config.icon,
        installedAt: new Date().toISOString(),
        targetEnv: 'global', sandboxed: false,
        files: [...new Set([...installedFiles, ...downloadedFiles])],
        dirsCreated: createdDirs,
      }
      await writeRegistry(registry)

      send(`\n🎉 ${config.name} v${config.version} установлен глобально!`)
      return { success: true, message: `${config.name} v${config.version} установлен` }
    }

  } catch (e: any) { return { success: false, error: e.message } }
  finally { await fs.rm(extractDir, { recursive: true, force: true }).catch(() => {}) }
})

// ── Installed packages ────────────────────────────────────────────────────────

ipcMain.handle('list-installed', async () => {
  try { return { success: true, packages: Object.values(await readRegistry()) } }
  catch (e: any) { return { success: false, error: e.message, packages: [] } }
})

ipcMain.handle('uninstall-package', async (event, name: string) => {
  const send = (msg: string) => event.sender.send('uninstall-log', msg)
  try {
    const registry = await readRegistry()
    const pkg = registry[name]
    if (!pkg) return { success: false, error: 'Пакет не найден в реестре' }

    send(`🗑 Удаление ${pkg.name} v${pkg.version}...`)

    // Pre-uninstall scripts (for sandbox: stored inside appDir/bash/)
    if (pkg.sandboxed) {
      const appDir = path.join(APPS_DIR, name)
      const cfgPath = path.join(appDir, 'config.yaml')
      if (existsSync(cfgPath)) {
        try {
          const config = yaml.load(await fs.readFile(cfgPath, 'utf-8')) as RcktConfig
          for (const script of config.bash?.pre_uninstall ?? []) {
            send(`\n🔧 [pre-uninstall] ${script}`)
            await runScript(path.join(appDir, 'bash', script), {
              RCKT_DIR: appDir, RCKT_BIN: path.join(appDir, 'bin'),
              RCKT_DATA: path.join(appDir, 'data'), RCKT_CONFIGS: path.join(appDir, 'configs'),
            }, send).catch(e => send(`   ⚠ ${e.message}`))
          }
        } catch { /* ignore */ }
      }
    }

    // Remove individual tracked files (wgets downloads etc.)
    for (const file of pkg.files) {
      try { await fs.unlink(file); send(`   ✓ ${file}`) }
      catch { send(`   ⚠ Не найден: ${file}`) }
    }

    // For sandbox: remove entire app dir at once
    if (pkg.sandboxed) {
      const appDir = path.join(APPS_DIR, name)
      if (existsSync(appDir)) {
        await fs.rm(appDir, { recursive: true, force: true })
        send(`   ✓ Папка приложения удалена`)
      }
    } else {
      // Global: need pkexec to remove from /usr/local
      const globalFiles = pkg.files.filter(f => f.startsWith('/usr/') || f.startsWith('/etc/') || f.startsWith('/opt/'))
      const userFiles   = pkg.files.filter(f => !globalFiles.includes(f))

      for (const f of userFiles) {
        try { await fs.unlink(f); send(`   ✓ ${f}`) } catch { /* ignore */ }
      }

      if (globalFiles.length > 0) {
        const removeSh = [
          `#!/bin/bash`,
          ...globalFiles.map(f => `rm -f "${f}" && echo "✓ ${f}"`),
          ...( pkg.dirsCreated ?? []).reverse().map(d => `rmdir "${d}" 2>/dev/null || true`),
        ].join('\n')
        const scriptPath = path.join(os.tmpdir(), `rock-et-rm-${Date.now()}.sh`)
        await fs.writeFile(scriptPath, removeSh, { mode: 0o755 })
        send(`   🔐 Запрос прав для удаления системных файлов...`)
        await runElevated(scriptPath, send).catch(e => send(`   ⚠ ${e.message}`))
        await fs.unlink(scriptPath).catch(() => {})
      }
    }

    // Post-uninstall (sandbox only — bash/ is inside appDir, run before appDir removal above)
    // Global: no persistent script storage — skipped by design

    delete registry[name]
    await writeRegistry(registry)
    send(`\n✅ ${pkg.name} удалён.`)
    return { success: true }
  } catch (e: any) { return { success: false, error: e.message } }
})

// ── Catalog ───────────────────────────────────────────────────────────────────

ipcMain.handle('get-settings', async () => readSettings())
ipcMain.handle('save-settings', async (_, partial: Partial<AppSettings>) => {
  const current = await readSettings()
  await writeSettings({ ...current, ...partial })
  return { success: true }
})

ipcMain.handle('fetch-catalog', async () => {
  try {
    const { catalogUrl } = await readSettings()
    const res = await fetch(catalogUrl, {
      signal: AbortSignal.timeout(12_000),
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      cache: 'no-store',
    } as RequestInit)
    if (!res.ok) throw new Error(`HTTP ${res.status} — каталог недоступен (${catalogUrl})`)
    const data = await res.json()
    return { success: true, data }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
})

ipcMain.handle('launch-app', async (_, launcherPath: string) => {
  try {
    if (!existsSync(launcherPath)) return { success: false, error: 'Launcher не найден' }
    const proc = spawn(launcherPath, [], { detached: true, stdio: 'ignore' })
    proc.unref()
    return { success: true }
  } catch (e: any) { return { success: false, error: e.message } }
})

ipcMain.handle('download-package', async (event, url: string) => {
  const send = (msg: string) => event.sender.send('download-progress', msg)
  try {
    send(`⬇ Загрузка ${url.split('/').pop()}...`)
    const res = await fetch(url, {
      signal: AbortSignal.timeout(60_000),
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      cache: 'no-store',
    } as RequestInit)
    if (!res.ok) throw new Error(`HTTP ${res.status} при загрузке ${url}`)
    const buf = await res.arrayBuffer()
    const tmp = path.join(os.tmpdir(), `rocket-catalog-${Date.now()}.rckt`)
    await fs.writeFile(tmp, Buffer.from(buf))
    currentPackagePath = tmp
    send(`✅ Загружено (${(buf.byteLength / 1024).toFixed(0)} КБ)`)
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
})

// ── Helpers ───────────────────────────────────────────────────────────────────

async function parseWgetsList(listPath: string): Promise<WgetEntry[]> {
  try {
    return (await fs.readFile(listPath, 'utf-8'))
      .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
      .map(l => {
        const [url, dest, checksum] = l.split(/\s+/)
        if (!url || !dest) return null
        return { url, dest, sha256: checksum?.startsWith('sha256:') ? checksum.slice(7) : undefined }
      }).filter(Boolean) as WgetEntry[]
  } catch { return [] }
}

async function listDir(dirPath: string): Promise<string[]> {
  try { return await fs.readdir(dirPath) } catch { return [] }
}

async function listDirRecursive(dirPath: string): Promise<string[]> {
  const result: string[] = []
  try {
    for (const e of await fs.readdir(dirPath, { withFileTypes: true })) {
      if (e.isDirectory()) {
        const sub = await listDirRecursive(path.join(dirPath, e.name))
        result.push(...sub.map(f => `${e.name}/${f}`))
      } else result.push(e.name)
    }
  } catch { /* empty dir */ }
  return result
}

async function collectFiles(dirPath: string): Promise<string[]> {
  const result: string[] = []
  try {
    for (const e of await fs.readdir(dirPath, { withFileTypes: true })) {
      const full = path.join(dirPath, e.name)
      if (e.isDirectory()) result.push(...await collectFiles(full))
      else result.push(full)
    }
  } catch { /* ignore */ }
  return result
}

async function calcDirSize(dirPath: string): Promise<number> {
  let total = 0
  try {
    for (const e of await fs.readdir(dirPath, { withFileTypes: true })) {
      const full = path.join(dirPath, e.name)
      if (e.isDirectory()) total += await calcDirSize(full)
      else { const s = await fs.stat(full).catch(() => null); if (s) total += s.size }
    }
  } catch { /* ignore */ }
  return total
}

async function runElevated(scriptPath: string, send: (m: string) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      DISPLAY: process.env.DISPLAY || ':0',
      XAUTHORITY: process.env.XAUTHORITY || path.join(os.homedir(), '.Xauthority'),
      DBUS_SESSION_BUS_ADDRESS: process.env.DBUS_SESSION_BUS_ADDRESS || '',
    }
    const proc = spawn('pkexec', ['/bin/bash', scriptPath], { env })
    proc.stdout.on('data', (d: Buffer) => send('   ' + d.toString().trimEnd()))
    proc.stderr.on('data', (d: Buffer) => send('   ' + d.toString().trimEnd()))
    proc.on('close', code => {
      if (code === 0) return resolve()
      if (code === 126 || code === 127) return reject(new Error('Авторизация отклонена или pkexec недоступен'))
      reject(new Error(`Установка завершилась с кодом ${code}`))
    })
    proc.on('error', () => {
      reject(new Error('pkexec не найден. Для глобальной установки нужен PolicyKit (polkit). Попробуйте: sudo apt install policykit-1'))
    })
  })
}

async function runScript(
  scriptPath: string,
  envVars: Record<string, string>,
  send: (m: string) => void
): Promise<void> {
  if (!existsSync(scriptPath)) { send(`   ⚠ Скрипт не найден: ${path.basename(scriptPath)}`); return }
  await fs.chmod(scriptPath, 0o755)
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', [scriptPath], {
      env: { ...process.env, ...envVars },
      cwd: path.dirname(scriptPath),
    })
    proc.stdout.on('data', (d: Buffer) => send('   ' + d.toString().trimEnd()))
    proc.stderr.on('data', (d: Buffer) => send('   ⚠ ' + d.toString().trimEnd()))
    proc.on('close', code => code === 0 ? resolve() : reject(new Error(`exit ${code}`)))
    proc.on('error', reject)
  })
}

async function runCommand(cmd: string, send: (m: string) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', ['-c', cmd])
    proc.stdout.on('data', (d: Buffer) => send('   ' + d.toString().trimEnd()))
    proc.stderr.on('data', (d: Buffer) => send('   ' + d.toString().trimEnd()))
    proc.on('close', code => code === 0 ? resolve() : reject(new Error(`exit ${code}`)))
    proc.on('error', reject)
  })
}
