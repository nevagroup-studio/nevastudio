import React from 'react';
import type { ActiveTab } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Tab: React.FC<{ label: string; active: boolean; onClick: () => void; disabled?: boolean }> = ({ label, active, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 md:px-5 md:text-sm ${
        active
          ? 'neva-pill neva-pill-active'
          : 'neva-pill'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {label}
    </button>
  );
};

export const TopNavBar: React.FC<{
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isProMode: boolean;
}> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  return (
    <nav className="mx-auto mb-6 flex max-w-[1800px] justify-center">
      <div className="neva-nav flex items-center space-x-1 overflow-x-auto rounded-full p-1.5 thin-scrollbar">
          <Tab label={t('tabCreate')} active={['create', 'interior', 'planning', 'planTo3d'].includes(activeTab)} onClick={() => onTabChange('create')} />
          <Tab label={t('tabCameraAngle')} active={['cameraAngle', 'architectureView', 'interiorView', 'archToInterior', 'interiorDetailView'].includes(activeTab)} onClick={() => onTabChange('cameraAngle')} />
          <Tab label={t('tabEdit')} active={activeTab === 'edit'} onClick={() => onTabChange('edit')} />
          <Tab label={t('tabCreatePrompt')} active={activeTab === 'prompt'} onClick={() => onTabChange('prompt')} />
          <Tab label={t('tabCreateVideo')} active={activeTab === 'video'} onClick={() => onTabChange('video')} />
          <Tab label={t('library')} active={activeTab === 'library'} onClick={() => onTabChange('library')} />
          <Tab label={t('tabUtilities')} active={activeTab === 'utilities'} onClick={() => onTabChange('utilities')} />
      </div>
    </nav>
  );
};
