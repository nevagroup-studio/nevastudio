const path = require('path');
const fs = require('fs/promises');
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

const isDev = !app.isPackaged || Boolean(process.env.VITE_DEV_SERVER_URL);
const isPortable = Boolean(process.env.PORTABLE_EXECUTABLE_FILE);
let mainWindow = null;
let startupUpdateScheduled = false;

const getWindowIconPath = () => {
  if (isDev) {
    return path.join(__dirname, '..', 'build-resources', 'icon.png');
  }
  return path.join(__dirname, '..', 'dist', 'branding', 'icon.png');
};

const getGeneratedImagesDir = async () => {
  const baseDir = path.join(app.getPath('pictures'), 'NEVA Studio', 'Generated Images');
  await fs.mkdir(baseDir, { recursive: true });
  return baseDir;
};

const slugifyPrompt = (prompt = '') =>
  prompt
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .toLowerCase() || 'render';

const saveDataUrlToFile = async (dataUrl, prompt = '') => {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) {
    throw new Error('Invalid image data');
  }

  const mimeType = match[1].toLowerCase();
  const base64 = match[2];
  const extension = mimeType.includes('jpeg') ? 'jpg' : mimeType.includes('webp') ? 'webp' : 'png';
  const dir = await getGeneratedImagesDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `neva-${slugifyPrompt(prompt)}-${timestamp}.${extension}`;
  const filePath = path.join(dir, fileName);
  await fs.writeFile(filePath, Buffer.from(base64, 'base64'));
  return filePath;
};

const sendUpdaterStatus = (status, message = '') => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  mainWindow.webContents.send('desktop-updater-status', { status, message });
};

const createMainWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1540,
    height: 980,
    minWidth: 1280,
    minHeight: 800,
    backgroundColor: '#07111f',
    autoHideMenuBar: true,
    title: 'NEVA Studio',
    icon: getWindowIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    await mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
};

app.whenReady().then(async () => {
  app.setAppUserModelId('com.nevastudio.desktop');
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => sendUpdaterStatus('checking'));
  autoUpdater.on('update-available', (info) => sendUpdaterStatus('available', info?.version ? `Version ${info.version}` : ''));
  autoUpdater.on('download-progress', (progress) => {
    const percent = typeof progress?.percent === 'number' ? `${Math.round(progress.percent)}%` : '';
    sendUpdaterStatus('downloading', percent ? `Downloading ${percent}` : 'Downloading update');
  });
  autoUpdater.on('update-downloaded', (info) =>
    sendUpdaterStatus('downloaded', info?.version ? `Ready to install ${info.version}` : 'Ready to install'),
  );
  autoUpdater.on('update-not-available', () => sendUpdaterStatus('not-available'));
  autoUpdater.on('error', (error) => sendUpdaterStatus('error', error?.message || 'Unable to check for updates'));

  ipcMain.handle('desktop:get-version', () => app.getVersion());
  ipcMain.handle('desktop:check-for-updates', async () => {
    if (isPortable) {
      const message = 'Portable build ready. Self-update needs a configured release feed or installed build.';
      sendUpdaterStatus('unsupported', message);
      return { status: 'unsupported', message };
    }

    try {
      await autoUpdater.checkForUpdates();
      return { status: 'checking', message: '' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to check for updates';
      sendUpdaterStatus('error', message);
      return { status: 'error', message };
    }
  });
  ipcMain.handle('desktop:save-generated-image', async (_event, payload) => {
    const filePath = await saveDataUrlToFile(payload?.dataUrl, payload?.prompt || 'render');
    return { path: filePath };
  });
  ipcMain.on('desktop:install-update', () => {
    autoUpdater.quitAndInstall();
  });

  await createMainWindow();

  if (!isDev && !isPortable && !startupUpdateScheduled) {
    startupUpdateScheduled = true;
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify().catch((error) => {
        sendUpdaterStatus('error', error?.message || 'Unable to check for updates');
      });
    }, 4000);
  }

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
