'use strict'
console.log('[preload.cjs] loading...')
const { contextBridge, ipcRenderer } = require('electron')
console.log('[preload.cjs] contextBridge:', typeof contextBridge)

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    minimize:        () => ipcRenderer.invoke('minimize-window'),
    maximize:        () => ipcRenderer.invoke('maximize-window'),
    close:           () => ipcRenderer.invoke('close-window'),
    selectFile:      () => ipcRenderer.invoke('select-file'),
    uploadPackage:   (data) => ipcRenderer.invoke('upload-package', data),
    readPackageInfo: () => ipcRenderer.invoke('read-package-info'),
    installPackage:  (targetEnv) => ipcRenderer.invoke('install-package', targetEnv),
    onInstallLog:    (cb) => {
      const h = (_, log) => cb(log)
      ipcRenderer.on('install-log', h)
      return () => ipcRenderer.removeListener('install-log', h)
    },
    getSystemInfo:   () => ipcRenderer.invoke('get-system-info'),
    listInstalled:   () => ipcRenderer.invoke('list-installed'),
    uninstallPackage:(name) => ipcRenderer.invoke('uninstall-package', name),
    onUninstallLog:  (cb) => {
      const h = (_, log) => cb(log)
      ipcRenderer.on('uninstall-log', h)
      return () => ipcRenderer.removeListener('uninstall-log', h)
    },
    getSettings:      ()  => ipcRenderer.invoke('get-settings'),
    saveSettings:     (s) => ipcRenderer.invoke('save-settings', s),
    fetchCatalog:     () => ipcRenderer.invoke('fetch-catalog'),
    downloadPackage:  (url) => ipcRenderer.invoke('download-package', url),
    onDownloadProgress: (cb) => {
      const h = (_, msg) => cb(msg)
      ipcRenderer.on('download-progress', h)
      return () => ipcRenderer.removeListener('download-progress', h)
    },
  })
  console.log('[preload.cjs] exposeInMainWorld OK')
} catch (e) {
  console.error('[preload.cjs] ERROR:', e)
}
