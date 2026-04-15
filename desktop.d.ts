export {};

declare global {
  interface Window {
    desktopApp?: {
      isDesktopApp: boolean;
      getVersion: () => Promise<string>;
      checkForUpdates: () => Promise<{ status: string; message?: string }>;
      installUpdate: () => void;
      onUpdaterStatus: (
        callback: (payload: { status: 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'not-available' | 'error' | 'unsupported'; message?: string }) => void,
      ) => () => void;
    };
  }
}
