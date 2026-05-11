/// <reference types="vite/client" />

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

export interface PackageInfo {
  success: boolean
  error?: string
  config?: RcktConfig
  configYaml?: string
  binFiles?:       string[]
  dataFiles?:      string[]
  configFiles?:    string[]
  libFiles?:       string[]
  bashScripts?:    string[]
  scriptAnalyses?: ScriptAnalysis[]
  wgets?:          { url: string; dest: string; sha256?: string }[]
  hasLicense?:     boolean
  totalSize?:      number
  infoText?:       string
}

export interface InstalledPackage {
  name: string
  version: string
  description?: string
  author?: string
  icon?: string
  installedAt: string
  targetEnv: 'sandbox' | 'global'
  sandboxed: boolean
  launcherPath?: string
  files: string[]
  dirsCreated: string[]
}

export interface SystemInfo {
  bwrapAvailable: boolean
  bwrapVersion: string | null
  distro: string
  homeDir: string
  rockEtDir: string
}

export interface CatalogPackage {
  name: string
  version: string
  description: string
  longDescription?: string
  icon?: string
  author: string
  license?: string
  category?: string
  tags?: string[]
  downloadUrl: string
  infoUrl?: string
  verified?: boolean
  size?: number
  sandboxReady?: boolean
}

export interface AppSettings {
  theme: 'dark' | 'amoled' | 'nord' | 'catppuccin'
  catalogUrl: string
  defaultInstallMode: 'sandbox' | 'global'
  animations: boolean
  checkUpdates: boolean
}

export interface CatalogData {
  version: number
  updated: string
  packages: CatalogPackage[]
}

declare global {
  interface Window {
    electronAPI: {
      minimize(): Promise<void>
      maximize(): Promise<void>
      close():    Promise<void>
      selectFile(): Promise<string | null>
      uploadPackage(data: Uint8Array): Promise<{ success: boolean; error?: string }>
      readPackageInfo(): Promise<PackageInfo>
      installPackage(targetEnv: 'sandbox' | 'global'): Promise<{ success: boolean; message?: string; error?: string }>
      onInstallLog(cb: (log: string) => void): () => void
      getSystemInfo(): Promise<SystemInfo>
      listInstalled(): Promise<{ success: boolean; packages: InstalledPackage[]; error?: string }>
      uninstallPackage(name: string): Promise<{ success: boolean; error?: string }>
      onUninstallLog(cb: (log: string) => void): () => void
      launchApp(launcherPath: string): Promise<{ success: boolean; error?: string }>
      getSettings(): Promise<AppSettings>
      saveSettings(partial: Partial<AppSettings>): Promise<{ success: boolean }>
      fetchCatalog(): Promise<{ success: boolean; data?: CatalogData; error?: string }>
      downloadPackage(url: string): Promise<{ success: boolean; error?: string }>
      onDownloadProgress(cb: (msg: string) => void): () => void
    }
  }
}
