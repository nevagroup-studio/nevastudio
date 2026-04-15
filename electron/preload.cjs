const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopApp', {
  isDesktopApp: true,
  getVersion: () => ipcRenderer.invoke('desktop:get-version'),
  checkForUpdates: () => ipcRenderer.invoke('desktop:check-for-updates'),
  installUpdate: () => ipcRenderer.send('desktop:install-update'),
  saveGeneratedImage: (payload) => ipcRenderer.invoke('desktop:save-generated-image', payload),
  onUpdaterStatus: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('desktop-updater-status', listener);
    return () => {
      ipcRenderer.removeListener('desktop-updater-status', listener);
    };
  },
});
