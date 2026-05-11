import { contextBridge, ipcRenderer } from 'electron'

// Намеренно НЕ используем webUtils — он ненадёжно работает через contextBridge.
// Вместо этого renderer отдаёт файл как ArrayBuffer напрямую.

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.invoke('minimize-window'),
  maximize: () => ipcRenderer.invoke('maximize-window'),
  close:    () => ipcRenderer.invoke('close-window'),

  // Диалог выбора файла (path возвращается из main, минуя renderer)
  selectFile: () => ipcRenderer.invoke('select-file'),

  // DnD: renderer читает файл как Uint8Array и отдаёт в main.
  // Uint8Array надёжно сериализуется через structured clone в IPC.
  uploadPackage: (data: Uint8Array) => ipcRenderer.invoke('upload-package', data),

  // Получить инфо о загруженном пакете (читает config.yaml)
  readPackageInfo: () => ipcRenderer.invoke('read-package-info'),

  // Установить пакет, только targetEnv нужен — path хранится в main
  installPackage: (targetEnv: string) => ipcRenderer.invoke('install-package', targetEnv),

  // Стриминг логов установки
  onInstallLog: (callback: (log: string) => void) => {
    const handler = (_: Electron.IpcRendererEvent, log: string) => callback(log)
    ipcRenderer.on('install-log', handler)
    return () => ipcRenderer.removeListener('install-log', handler)
  },
})
