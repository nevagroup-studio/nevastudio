import React from 'react';
import type { ActiveTab } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

type TabConfig = {
  key: ActiveTab;
  label: string;
  isActive: boolean;
};

export const TopNavBar: React.FC<{
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isProMode: boolean;
}> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0, opacity: 0 });

  const tabs = React.useMemo<TabConfig[]>(
    () => [
      { key: 'create', label: t('tabCreate'), isActive: ['create', 'interior', 'planning', 'planTo3d'].includes(activeTab) },
      { key: 'cameraAngle', label: t('tabCameraAngle'), isActive: ['cameraAngle', 'architectureView', 'interiorView', 'archToInterior', 'interiorDetailView'].includes(activeTab) },
      { key: 'edit', label: t('tabEdit'), isActive: activeTab === 'edit' },
      { key: 'prompt', label: t('tabCreatePrompt'), isActive: activeTab === 'prompt' },
      { key: 'video', label: t('tabCreateVideo'), isActive: activeTab === 'video' },
      { key: 'library', label: t('library'), isActive: activeTab === 'library' },
      { key: 'utilities', label: t('tabUtilities'), isActive: activeTab === 'utilities' },
    ],
    [activeTab, t],
  );

  React.useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.isActive);
    const target = activeIndex >= 0 ? buttonRefs.current[activeIndex] : null;
    if (!target) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    setIndicator({
      left: target.offsetLeft,
      width: target.offsetWidth,
      opacity: 1,
    });
  }, [tabs]);

  React.useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = tabs.findIndex((tab) => tab.isActive);
      const target = activeIndex >= 0 ? buttonRefs.current[activeIndex] : null;
      if (!target) return;

      setIndicator({
        left: target.offsetLeft,
        width: target.offsetWidth,
        opacity: 1,
      });
    };

    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [tabs]);

  return (
    <nav className="mx-auto mb-6 flex max-w-[1800px] justify-center">
      <div className="neva-tab-shell thin-scrollbar relative flex items-center gap-1 overflow-x-auto rounded-full p-1.5">
        <div
          className="neva-tab-indicator absolute bottom-1.5 top-1.5 rounded-full"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
            opacity: indicator.opacity,
          }}
        />
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            onClick={() => onTabChange(tab.key)}
            className={`neva-tab-button relative z-10 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 md:px-5 md:text-sm ${
              tab.isActive ? 'text-slate-950' : 'neva-text-sub hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};