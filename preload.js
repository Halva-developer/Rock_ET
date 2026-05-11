import { contextBridge as e, ipcRenderer as t } from "electron";
//#region electron/preload.ts
e.exposeInMainWorld("electronAPI", {
	minimize: () => t.invoke("minimize-window"),
	close: () => t.invoke("close-window"),
	selectFile: () => t.invoke("select-file"),
	installPackage: (e, n) => t.invoke("install-package", e, n)
});
//#endregion
