import React from 'react';
import { Icon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { CreateFreePanel } from './panels/CreateFreePanel';
import { CreateApiPanel } from './panels/CreateApiPanel';
import { InteriorPanel } from './panels/InteriorPanel';
import { PlanningPanel } from './panels/PlanningPanel';
import { CameraAnglePanel, EditPanel, PlanTo3dPanel, VideoPanel, CanvaPanel, PromptGenPanel } from './panels/SecondaryPanels';

export const ControlPanel: React.FC<any> = (props) => {
    const {
        activeTab,
        handleGeneration,
        isLoading,
        sourceImage,
        sourceImage2,
        editSubMode,
        canvaObjects,
        aiModel,
        imageCount,
        imageSize,
        selectedModelPreset,
    } = props;
    const { t } = useLanguage();
    const { theme } = useTheme();

    const renderPanel = () => {
        switch (activeTab) {
            case 'create':
                if (aiModel === 'gemini-3-pro-image-preview') {
                    return <CreateApiPanel {...props} />;
                }
                return <CreateFreePanel {...props} />;
            case 'interior':
                return <InteriorPanel {...props} />;
            case 'planning':
                return <PlanningPanel {...props} />;
            case 'cameraAngle':
                return <CameraAnglePanel {...props} />;
            case 'edit':
                return <EditPanel {...props} materialOptions={props.materialOptions} setMaterialOptions={props.setMaterialOptions} />;
            case 'planTo3d':
                return <PlanTo3dPanel {...props} />;
            case 'canva':
                return <CanvaPanel {...props} />;
            case 'prompt':
                return <PromptGenPanel {...props} />;
            case 'video':
                return <VideoPanel {...props} />;
            default:
                return null;
        }
    };

    const isGenerationDisabled = () => {
        if (isLoading) return true;

        if (activeTab === 'edit' && editSubMode === 'canva') {
            return !sourceImage || !canvaObjects || canvaObjects.length === 0;
        }

        if (activeTab === 'canva') {
            return !sourceImage || !canvaObjects || canvaObjects.length === 0;
        }

        if (activeTab === 'prompt') {
            return !sourceImage;
        }

        if (!['create', 'interior', 'planning'].includes(activeTab) && !sourceImage) return true;

        if (activeTab === 'edit' && ['mergeHouse', 'mergeMaterial', 'mergeFurniture'].includes(editSubMode) && !sourceImage2) {
            return true;
        }

        return false;
    };

    const getButtonText = () => {
        switch (activeTab) {
            case 'video':
                return t('createVideo');
            case 'prompt':
                return t('createPrompt');
            default:
                return t('createImage');
        }
    };

    const getButtonIcon = () => {
        switch (activeTab) {
            case 'video':
                return 'video-camera';
            case 'prompt':
                return 'sparkles';
            default:
                return 'camera';
        }
    };

    const getEstimatedCost = () => {
        if (!['create', 'interior', 'planning', 'cameraAngle', 'planTo3d', 'edit'].includes(activeTab)) {
            return null;
        }

        const modelCosts: Record<string, Record<string, number>> = {
            'imagen-4': { '1K': 950, '2K': 1900, '4K': 3800 },
            'gemini-flash-3.1': { '1K': 250, '2K': 500, '4K': 1000 },
            'gemini-pro-3.0': { '1K': 1800, '2K': 3600, '4K': 7200 },
            'gemini-2.5-flash-image': { '1K': 250, '2K': 500, '4K': 1000 },
            'gemini-3-pro-image-preview': { '1K': 1800, '2K': 3600, '4K': 7200 },
        };

        const modelKey = selectedModelPreset || aiModel;
        const sizeKey = imageSize || '1K';
        const perImage = modelCosts[modelKey]?.[sizeKey] ?? modelCosts[modelKey]?.['1K'] ?? 0;
        const total = perImage * Math.max(1, Number(imageCount || 1));

        return {
            perImage,
            total,
            modelLabel:
                modelKey === 'imagen-4'
                    ? 'Imagen 4'
                    : modelKey === 'gemini-flash-3.1' || modelKey === 'gemini-2.5-flash-image'
                        ? 'Gemini Flash 3.1'
                        : 'Gemini Pro 3.0',
        };
    };

    const estimatedCost = getEstimatedCost();
    const formatVnd = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

    return (
        <div className={`lg:col-span-4 xl:col-span-3 ${theme.panelBg} neon-border h-max rounded-[28px] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.3)] flex flex-col gap-5`}>
            {renderPanel()}

            <button
                onClick={handleGeneration}
                disabled={isGenerationDisabled()}
                className="neva-primary-button mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-base font-bold transition-all"
            >
                <Icon name={getButtonIcon()} className="w-5 h-5" />
                {getButtonText()}
            </button>

            {estimatedCost && (
                <div className="neva-nav rounded-2xl border border-cyan-300/12 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200/80">
                                {'Chi phí dự kiến'}
                            </p>
                            <p className={`mt-1 text-sm ${theme.textSub}`}>
                                {estimatedCost.modelLabel} {'·'} {Math.max(1, Number(imageCount || 1))} {'ảnh'} {'·'} {imageSize || '1K'}
                            </p>
                        </div>
                        <p className="text-right text-lg font-extrabold text-cyan-200">
                            {formatVnd(estimatedCost.total)} {'đ'}
                        </p>
                    </div>
                    <p className={`mt-2 text-xs ${theme.textSub}`}>
                        {'Ước tính khoảng'} {formatVnd(estimatedCost.perImage)} {'đ / ảnh. Con số này chỉ để tham khảo trước khi tạo.'}
                    </p>
                </div>
            )}
        </div>
    );
};
