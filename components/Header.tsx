import React from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Icon } from './icons';

type HeaderModel = 'imagen-4' | 'gemini-flash-3.1' | 'gemini-pro-3.0';
type UpdateStatusType =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'downloaded'
  | 'not-available'
  | 'error'
  | 'unsupported';

const MODEL_OPTIONS: Array<{ value: HeaderModel; label: string }> = [
  { value: 'imagen-4', label: 'Imagen 4' },
  { value: 'gemini-flash-3.1', label: 'Gemini Flash 3.1' },
  { value: 'gemini-pro-3.0', label: 'Gemini Pro 3.0' },
];

const HEADER_COPY = {
  vi: {
    selectModel: '\u0043h\u1ecdn m\u00f4 h\u00ecnh',
    selectedModel: 'M\u00f4 h\u00ecnh',
    apiKeyTitle: 'D\u00e1n API key Google AI Studio',
    apiKeyDescription:
      'Nh\u1eadp API key c\u1ee7a b\u1ea1n v\u00e0 nh\u1ea5n x\u00e1c nh\u1eadn. Key s\u1ebd \u0111\u01b0\u1ee3c l\u01b0u cho nh\u1eefng l\u1ea7n s\u1eed d\u1ee5ng sau tr\u00ean thi\u1ebft b\u1ecb n\u00e0y.',
    apiKeyPlaceholder: 'D\u00e1n API key t\u1eeb Google AI Studio v\u00e0o \u0111\u00e2y...',
    apiKeyStorageHint: 'API key \u0111\u01b0\u1ee3c l\u01b0u c\u1ee5c b\u1ed9 tr\u00ean m\u00e1y n\u00e0y.',
    apiKeySavedDescription: 'API key \u0111\u00e3 \u0111\u01b0\u1ee3c l\u01b0u v\u00e0 s\u1ebd \u0111\u01b0\u1ee3c d\u00f9ng l\u1ea1i \u1edf nh\u1eefng l\u1ea7n sau.',
    apiKeySavedShort: '\u0110\u00e3 l\u01b0u key',
    apiKeyEmptyError: 'Vui l\u00f2ng d\u00e1n API key tr\u01b0\u1edbc khi x\u00e1c nh\u1eadn.',
    apiKeySaveError: 'Kh\u00f4ng th\u1ec3 l\u01b0u API key tr\u00ean thi\u1ebft b\u1ecb n\u00e0y.',
    apiKeyLabel: 'Google AI Studio API Key',
    logoSlot: 'Logo NEVA Studio',
    logoHint: 'Thay b\u1eb1ng logo ch\u00ednh th\u1ee9c sau',
    updateTitle: 'C\u1eadp nh\u1eadt \u1ee9ng d\u1ee5ng',
    updateDesktopOnly: 'T\u00ednh n\u0103ng c\u1eadp nh\u1eadt ch\u1ec9 ho\u1ea1t \u0111\u1ed9ng trong b\u1ea3n desktop.',
    updateChecking: '\u0110ang ki\u1ec3m tra b\u1ea3n m\u1edbi...',
    updateAvailable: '\u0110ang t\u1ea3i b\u1ea3n c\u1eadp nh\u1eadt m\u1edbi nh\u1ea5t...',
    updateDownloading: '\u0110ang t\u1ea3i g\u00f3i c\u1eadp nh\u1eadt...',
    updateReady: 'B\u1ea3n c\u1eadp nh\u1eadt \u0111\u00e3 s\u1eb5n s\u00e0ng. B\u1ea5m l\u1ea1i \u0111\u1ec3 c\u00e0i v\u00e0 kh\u1edfi \u0111\u1ed9ng l\u1ea1i.',
    updateLatest: 'B\u1ea1n \u0111ang d\u00f9ng b\u1ea3n m\u1edbi nh\u1ea5t.',
    updateUnavailable: 'B\u1ea3n desktop n\u00e0y ch\u01b0a c\u1ea5u h\u00ecnh ngu\u1ed3n c\u1eadp nh\u1eadt.',
    updateUnsupported: 'B\u1ea3n portable \u0111\u00e3 build xong, nh\u01b0ng mu\u1ed1n t\u1ef1 c\u1eadp nh\u1eadt v\u1eabn c\u1ea7n ngu\u1ed3n ph\u00e1t h\u00e0nh.',
    updateError: 'Kh\u00f4ng th\u1ec3 ki\u1ec3m tra c\u1eadp nh\u1eadt l\u00fac n\u00e0y.',
    updateButton: 'Update',
    version: 'Phi\u00ean b\u1ea3n',
  },
  en: {
    selectModel: 'Select model',
    selectedModel: 'Model',
    apiKeyTitle: 'Paste Google AI Studio API key',
    apiKeyDescription: 'Paste your API key and confirm. It will be saved for future use on this device.',
    apiKeyPlaceholder: 'Paste your Google AI Studio API key here...',
    apiKeyStorageHint: 'The API key is stored locally on this device.',
    apiKeySavedDescription: 'The API key has been saved and will be reused next time.',
    apiKeySavedShort: 'Saved key',
    apiKeyEmptyError: 'Please paste an API key before confirming.',
    apiKeySaveError: 'Unable to save the API key on this device.',
    apiKeyLabel: 'Google AI Studio API Key',
    logoSlot: 'NEVA Studio logo',
    logoHint: 'Replace with your official logo later',
    updateTitle: 'Update app',
    updateDesktopOnly: 'Update is only available in the desktop build.',
    updateChecking: 'Checking for a newer version...',
    updateAvailable: 'Downloading the latest update...',
    updateDownloading: 'Downloading update package...',
    updateReady: 'The update is ready. Click again to install and restart.',
    updateLatest: 'You already have the latest version.',
    updateUnavailable: 'No update source is configured for this desktop build yet.',
    updateUnsupported: 'The portable build is ready, but self-updating still needs a release feed.',
    updateError: 'Unable to check for updates right now.',
    updateButton: 'Update',
    version: 'Version',
  },
} as const;

const getUpdateMessage = (
  language: keyof typeof HEADER_COPY,
  status: UpdateStatusType,
  fallback?: string,
) => {
  const copy = HEADER_COPY[language];
  switch (status) {
    case 'checking':
      return copy.updateChecking;
    case 'available':
      return copy.updateAvailable;
    case 'downloading':
      return fallback || copy.updateDownloading;
    case 'downloaded':
      return copy.updateReady;
    case 'not-available':
      return copy.updateLatest;
    case 'unsupported':
      return fallback || copy.updateUnsupported;
    case 'error':
      return fallback || copy.updateError;
    case 'idle':
    default:
      return copy.updateTitle;
  }
};

const HeaderControls: React.FC<{
  aiModel: HeaderModel;
  onModelChange: (model: HeaderModel) => void;
}> = ({ aiModel, onModelChange }) => {
  const { language, setLanguage, t } = useLanguage();
  const copy = HEADER_COPY[language];
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = React.useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = React.useState(false);
  const [apiKeyInput, setApiKeyInput] = React.useState('');
  const [hasSavedApiKey, setHasSavedApiKey] = React.useState(false);
  const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  React.useEffect(() => {
    try {
      const savedKey = window.localStorage.getItem('neva_google_ai_studio_api_key') || '';
      setApiKeyInput(savedKey);
      setHasSavedApiKey(Boolean(savedKey.trim()));
    } catch {
      setApiKeyInput('');
      setHasSavedApiKey(false);
    }
  }, []);

  const handleSaveApiKey = () => {
    const trimmedKey = apiKeyInput.trim();
    if (!trimmedKey) {
      alert(copy.apiKeyEmptyError);
      return;
    }

    try {
      window.localStorage.setItem('neva_google_ai_studio_api_key', trimmedKey);
      setHasSavedApiKey(true);
      setIsApiKeyModalOpen(false);
    } catch {
      alert(copy.apiKeySaveError);
    }
  };

  const handleClearApiKey = () => {
    try {
      window.localStorage.removeItem('neva_google_ai_studio_api_key');
      setApiKeyInput('');
      setHasSavedApiKey(false);
    } catch {}
  };

  return (
    <>
      <div className="flex w-full flex-col gap-3 lg:items-end">
        <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
          <button
            onClick={() => setIsModelModalOpen(true)}
            className="neva-icon-button flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all duration-200 md:text-sm"
            title={copy.selectModel}
          >
            <Icon name="cpu-chip" className="h-4 w-4 text-cyan-300" />
            <span className="hidden sm:inline">{copy.selectedModel}</span>
            <span className="rounded-full bg-white/6 px-2 py-0.5 text-[11px] font-semibold text-cyan-200">
              {MODEL_OPTIONS.find((option) => option.value === aiModel)?.label}
            </span>
          </button>

          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="neva-icon-button flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all duration-200 md:text-sm"
            title={t('selectApiKey')}
          >
            <Icon name="key" className={`h-4 w-4 ${hasSavedApiKey ? 'text-cyan-300' : 'text-lime-300'}`} />
            <span>{hasSavedApiKey ? copy.apiKeySavedShort : 'APIKEY'}</span>
          </button>

          <div className="neva-nav flex space-x-1 rounded-2xl p-1">
            <button
              onClick={() => setLanguage('vi')}
              aria-label="Switch to Vietnamese"
              className={`rounded-xl px-3 py-1.5 text-sm font-bold transition-all duration-200 ${
                language === 'vi' ? 'neva-primary-button' : 'neva-text-sub hover:bg-white/5'
              }`}
            >
              VN
            </button>
            <button
              onClick={() => setLanguage('en')}
              aria-label="Switch to English"
              className={`rounded-xl px-3 py-1.5 text-sm font-bold transition-all duration-200 ${
                language === 'en' ? 'neva-primary-button' : 'neva-text-sub hover:bg-white/5'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {portalRoot &&
        isModelModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/72 px-4 backdrop-blur-md">
            <div className="neva-panel neon-border w-full max-w-3xl rounded-[28px] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.4)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="neva-text-main text-xl font-extrabold tracking-[0.04em] md:text-2xl">{copy.selectModel}</h2>
                  <p className="neva-text-sub mt-2 text-sm leading-6">
                    {language === 'vi'
                      ? 'Chọn model phù hợp theo chất lượng và chi phí. Bạn có thể đổi bất cứ lúc nào.'
                      : 'Choose the model that fits your quality and cost target. You can switch at any time.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsModelModalOpen(false)}
                  className="neva-icon-button rounded-full p-2"
                  aria-label={t('close')}
                >
                  <Icon name="x-circle" className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {MODEL_OPTIONS.map((option) => {
                  const isActive = aiModel === option.value;
                  const description =
                    option.value === 'imagen-4'
                      ? language === 'vi'
                        ? 'Cân bằng tốc độ và chất lượng, phù hợp render hằng ngày.'
                        : 'Balanced speed and quality for most daily renders.'
                      : option.value === 'gemini-flash-3.1'
                        ? language === 'vi'
                          ? 'Nhanh nhất, phù hợp phác thảo, test prompt và lấy nháp.'
                          : 'Fastest option for draft renders and prompt testing.'
                        : language === 'vi'
                          ? 'Chất lượng cao nhất, chi tiết tốt hơn, chi phí cao hơn.'
                          : 'Highest quality with better detail at a higher cost.';

                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        onModelChange(option.value);
                        setIsModelModalOpen(false);
                      }}
                      className={`rounded-[24px] border p-4 text-left transition-all ${
                        isActive
                          ? 'neva-primary-button border-white/10 text-slate-950 shadow-lg shadow-cyan-500/20'
                          : 'neva-nav neva-text-main border-white/8 hover:border-cyan-300/30 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-extrabold tracking-[0.03em]">{option.label}</h3>
                        {isActive && <Icon name="check" className="h-5 w-5" />}
                      </div>
                      <p className={`mt-2 text-sm leading-6 ${isActive ? 'text-slate-900/85' : 'neva-text-sub'}`}>{description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          portalRoot,
        )}

      {portalRoot &&
        isApiKeyModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/72 px-4 backdrop-blur-md">
            <div className="neva-panel neon-border w-full max-w-2xl rounded-[28px] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.4)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="neva-text-main text-xl font-extrabold tracking-[0.04em] md:text-2xl">{copy.apiKeyTitle}</h2>
                  <p className="neva-text-sub mt-2 max-w-xl text-sm leading-6">{copy.apiKeyDescription}</p>
                </div>
                <button
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="neva-icon-button rounded-full p-2"
                  aria-label={t('close')}
                >
                  <Icon name="x-circle" className="h-5 w-5" />
                </button>
              </div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-cyan-200/80">
                {copy.apiKeyLabel}
              </label>
              <textarea
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={copy.apiKeyPlaceholder}
                className="neva-input neva-text-main min-h-[120px] w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none"
              />

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="neva-text-sub text-xs leading-5">{hasSavedApiKey ? copy.apiKeySavedDescription : copy.apiKeyStorageHint}</p>
                {hasSavedApiKey && (
                  <button
                    onClick={handleClearApiKey}
                    className="text-xs font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
                  >
                    {t('delete')}
                  </button>
                )}
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="neva-btn-secondary rounded-2xl px-4 py-2 text-sm font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSaveApiKey}
                  className="neva-primary-button rounded-2xl px-5 py-2 text-sm font-bold"
                >
                  {t('confirm')}
                </button>
              </div>
            </div>
          </div>,
          portalRoot,
        )}
    </>
  );
};

interface HeaderProps {
  onBack?: () => void;
  isProMode?: boolean;
  aiModel: HeaderModel;
  onModelChange: (model: HeaderModel) => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack, isProMode: _isProMode, aiModel, onModelChange }) => {
  const { language, t } = useLanguage();
  const copy = HEADER_COPY[language];
  const buildAssetUrl = React.useCallback((assetName: string) => {
    if (typeof window === 'undefined') {
      return `./branding/${assetName}`;
    }
    return new URL(`branding/${assetName}`, window.location.href).toString();
  }, []);
  const [logoSrc, setLogoSrc] = React.useState(() => buildAssetUrl('logo.png'));
  const [desktopVersion, setDesktopVersion] = React.useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = React.useState<UpdateStatusType>('idle');
  const [updateDetail, setUpdateDetail] = React.useState('');
  const isDesktopApp = typeof window !== 'undefined' && !!window.desktopApp;

  React.useEffect(() => {
    if (!window.desktopApp) {
      return;
    }

    window.desktopApp.getVersion().then(setDesktopVersion).catch(() => null);

    const unsubscribe = window.desktopApp.onUpdaterStatus((payload) => {
      setUpdateStatus(payload.status);
      setUpdateDetail(payload.message || '');
    });

    return unsubscribe;
  }, []);

  const handleUpdateClick = async () => {
    if (!window.desktopApp) {
      alert(copy.updateDesktopOnly);
      return;
    }

    if (updateStatus === 'downloaded') {
      window.desktopApp.installUpdate();
      return;
    }

    try {
      const result = await window.desktopApp.checkForUpdates();
      setUpdateStatus(result.status);
      setUpdateDetail(result.message || '');
    } catch {
      setUpdateStatus('error');
      setUpdateDetail(copy.updateError);
    }
  };

  const updateMessage = getUpdateMessage(language, updateStatus, updateDetail);

  return (
    <header className="neva-panel neon-border relative mb-5 rounded-[28px] px-5 py-4 shadow-[0_24px_80px_rgba(2,6,23,0.3)] md:px-6 md:py-4">
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 md:left-6 md:top-6">
        <button
          onClick={handleUpdateClick}
          className="neva-icon-button flex items-center gap-2 rounded-full px-3 py-2 transition-all"
          title={updateMessage}
        >
          <Icon
            name="arrow-path"
            className={`h-5 w-5 ${updateStatus === 'downloaded' ? 'text-lime-300' : 'text-cyan-300'}`}
          />
          <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-cyan-100/90 xl:inline">
            {copy.updateButton}
          </span>
        </button>

        {onBack && (
          <button
            onClick={onBack}
            className="neva-icon-button rounded-full p-2 transition-all"
            title={t('navHome')}
          >
            <Icon name="arrow-uturn-left" className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="grid items-center gap-4 pt-10 lg:grid-cols-[1fr_auto_1fr] lg:pt-0">
        <div className="hidden lg:block" />

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center gap-2 sm:gap-3">
            <div className="flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
              <img
                src={logoSrc}
                alt={copy.logoSlot}
                className="h-20 w-20 max-h-full max-w-full object-contain opacity-100 sm:h-24 sm:w-24"
                onError={() => setLogoSrc(buildAssetUrl('logo-placeholder.svg'))}
              />
            </div>
            <h1
              className="neva-text-main text-3xl font-extrabold tracking-[0.04em] sm:text-4xl"
              style={{ textShadow: '0 0 24px rgba(34, 211, 238, 0.14), 0 0 36px rgba(139, 92, 246, 0.12)' }}
            >
              {t('appTitle')}
            </h1>
          </div>
          <div className="mt-1.5 flex items-center justify-center gap-2 text-[11px] font-medium text-cyan-100/55">
            <span>{updateMessage}</span>
            {desktopVersion && (
              <>
                <span className="text-cyan-200/30">{"\u2022"}</span>
                <span>
                  {copy.version} {desktopVersion}
                </span>
              </>
            )}
            {!isDesktopApp && (
              <>
                <span className="text-cyan-200/30">{"\u2022"}</span>
                <span>Web</span>
              </>
            )}
          </div>
        </div>

        <div className="justify-self-stretch lg:justify-self-end">
          <HeaderControls aiModel={aiModel} onModelChange={onModelChange} />
        </div>
      </div>
    </header>
  );
};



