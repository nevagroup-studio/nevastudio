
export type EditSubMode = 'inpaint' | 'smartEdit' | 'mergeHouse' | 'mergeMaterial' | 'mergeFurniture' | 'canva';
export type ActiveTab = 'create' | 'interior' | 'cameraAngle' | 'edit' | 'planTo3d' | 'video' | 'canva' | 'prompt' | 'utilities' | 'library' | 'planning' | 'architectureView' | 'interiorView' | 'archToInterior' | 'interiorDetailView';
export type AspectRatio = 'auto' | '1:1' | '4:3' | '3:4' | '16:9' | '9:16' | '2:3' | '3:2';
export type ImageSize = '1K' | '2K' | '4K';
export type Utility = 'moodboard' | 'videoPrompt' | 'lighting' | 'virtualTour' | 'extendView' | 'changeStyle' | 'layout' | 'model' | 'diagram' | 'analyze' | 'trendMoodboard' | 'vr360' | 'interiorView' | 'architectureView' | 'archToInterior' | 'interiorDetailView' | 'syncView' | 'lightingSimulation' | 'constructionProcess' | 'textureMap';

export interface SourceImage {
  base64: string;
  mimeType: string;
}

export interface HistoryItem {
  id: string;
  tab: ActiveTab | 'utilities' | 'trend'; // Keep 'trend' in type for compatibility with old history items
  sourceImage: SourceImage | null;
  sourceImage2?: SourceImage | null;
  referenceImage: SourceImage | null;
  prompt: string;
  negativePrompt?: string;
  imageCount: number;
  generatedImages: string[];
  generatedPrompts?: string | null;
  videoModel?: string;
}

export interface LibraryItem {
  id: string;
  imageData: string; // data URL
  prompt?: string;
}

// FIX: Added ObjectTransform interface to resolve import error in InteractiveCanvas.tsx
export interface ObjectTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MaterialOptions {
  type: string;
  tileSize: string;
  scale: string;
  property: string;
  pattern: string;
}

export type TextureMapType = 'Diffuse' | 'Normal' | 'Displacement' | 'Roughness' | 'AO';
