export {};

declare global {
  interface Window {
    desktopApp?: {
      isDesktopApp: boolean;
      getVersion: () => Promise<string>;
      checkForUpdates: () => Promise<{ status: string; message?: string }>;
      installUpdate: () => void;
      saveGeneratedImage: (payload: { dataUrl: string; prompt?: string }) => Promise<{ path: string }>;
      onUpdaterStatus: (
        callback: (payload: { status: 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'not-available' | 'error' | 'unsupported'; message?: string }) => void,
      ) => () => void;
    };
  }
}
