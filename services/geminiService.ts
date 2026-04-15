
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { SourceImage, ObjectTransform, AspectRatio, ImageSize, TextureMapType } from '../types';
import { translations } from '../locales/translations';
import { padImageToAspectRatioWithColor, dataUrlToSourceImage } from "../utils";

function formatPrompt(template: string, ...args: any[]): string {
    if (!template) return '';
    return template.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
}

export const getClosestAspectRatio = (sourceImage: SourceImage): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            const ratio = w / h;
            const targets = [
                { id: '1:1', val: 1 },
                { id: '4:3', val: 4/3 },
                { id: '3:4', val: 3/4 },
                { id: '16:9', val: 16/9 },
                { id: '9:16', val: 9/16 },
                { id: '2:3', val: 2/3 },
                { id: '3:2', val: 3/2 },
            ];
            const closest = targets.reduce((prev, curr) => 
                Math.abs(curr.val - ratio) < Math.abs(prev.val - ratio) ? curr : prev
            );
            resolve(closest.id);
        };
        img.onerror = () => resolve('4:3');
        img.src = `data:${sourceImage.mimeType};base64,${sourceImage.base64}`;
    });
};

const extractBase64Image = (response: GenerateContentResponse): string | null => {
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
};

const getApiKey = () => {
    try {
        if (typeof window !== 'undefined') {
            const storedKey = window.localStorage.getItem('neva_google_ai_studio_api_key');
            if (storedKey && storedKey.trim()) {
                return storedKey.trim();
            }
        }
    } catch (e) {}
    // In this environment, process.env.API_KEY is replaced by the platform with the user's key if selected.
    // We use a fallback to GEMINI_API_KEY (the free key) if API_KEY is not available or not yet replaced.
    try {
        const key = process.env.API_KEY;
        if (key && key !== "process.env.API_KEY" && !key.startsWith("process.env.")) {
            return key;
        }
    } catch (e) {}
    return process.env.GEMINI_API_KEY || "";
};

export const generateImages = async (
  sourceImage: SourceImage | null,
  prompt: string,
  count: number = 2,
  referenceImage: SourceImage | null = null,
  aspectRatio: string = '4:3',
  lang: 'vi' | 'en' = 'vi',
  negativePrompt?: string,
  modelName: string = 'gemini-2.5-flash-image',
  imageSize: ImageSize = '1K'
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const results: (string | null)[] = [];
  
  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      if (sourceImage) {
          finalAspectRatio = await getClosestAspectRatio(sourceImage);
      } else {
          finalAspectRatio = '4:3';
      }
  }

  const isProModel = modelName === 'gemini-3-pro-image-preview';
  const config: any = {
      imageConfig: {
          aspectRatio: finalAspectRatio
      }
  };
  
  if (isProModel) {
      config.imageConfig.imageSize = imageSize;
  }

  for (let i = 0; i < count; i++) {
    try {
      let parts: any[] = [];
      let engineeredPrompt = prompt;

      if (sourceImage) {
        parts.push({
          inlineData: {
            data: sourceImage.base64,
            mimeType: sourceImage.mimeType,
          },
        });

        if (referenceImage) {
            parts.push({
                inlineData: {
                    data: referenceImage.base64,
                    mimeType: referenceImage.mimeType,
                },
            });
            const template = (negativePrompt && negativePrompt.trim() !== '')
                ? translations[lang].engineeredPrompts.generateWithReferenceNegative
                : translations[lang].engineeredPrompts.generateWithReference;
            engineeredPrompt = formatPrompt(template, prompt, negativePrompt);
        } else {
            const template = (negativePrompt && negativePrompt.trim() !== '')
                ? translations[lang].engineeredPrompts.generateWithoutReferenceNegative
                : translations[lang].engineeredPrompts.generateWithoutReference;
            engineeredPrompt = formatPrompt(template, prompt, negativePrompt);
        }
      } else {
          if (negativePrompt && negativePrompt.trim() !== '') {
              engineeredPrompt = `${prompt} (Do not include: ${negativePrompt})`;
          }
      }

      parts.push({ text: engineeredPrompt });

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config,
      });
      results.push(extractBase64Image(response));
    } catch (error) {
      console.error(`Failed to generate image ${i + 1}/${count}:`, error);
    }
  }

  return results.filter((result): result is string => result !== null);
};

export const syncView = async (
  referenceView: SourceImage,
  targetView: SourceImage,
  count: number = 2,
  lang: 'vi' | 'en' = 'vi',
  imageSize: ImageSize = '1K',
  modelName: string = 'gemini-2.5-flash-image'
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const results: (string | null)[] = [];
  
  const finalAspectRatio = await getClosestAspectRatio(targetView);
  const engineeredPrompt = translations[lang].engineeredPrompts.syncViewPrompt;
  
  const config: any = {
      imageConfig: {
          aspectRatio: finalAspectRatio
      }
  };
  
  if (modelName === 'gemini-3-pro-image-preview') {
      config.imageConfig.imageSize = imageSize;
  }

  for (let i = 0; i < count; i++) {
    try {
      const parts: any[] = [
        { inlineData: { data: referenceView.base64, mimeType: referenceView.mimeType } }, // Image 1: Style
        { inlineData: { data: targetView.base64, mimeType: targetView.mimeType } }, // Image 2: Geometry
        { text: engineeredPrompt }
      ];

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config,
      });
      results.push(extractBase64Image(response));
    } catch (error) {
      console.error(`Failed to sync view ${i + 1}/${count}:`, error);
    }
  }

  return results.filter((result): result is string => result !== null);
};

export const simulateLightingAndStyle = async (
  referenceStyle: SourceImage,
  baseRender: SourceImage,
  count: number = 2,
  lang: 'vi' | 'en' = 'vi',
  imageSize: ImageSize = '1K',
  modelName: string = 'gemini-2.5-flash-image'
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const results: (string | null)[] = [];
  
  const finalAspectRatio = await getClosestAspectRatio(baseRender);
  const engineeredPrompt = translations[lang].engineeredPrompts.lightingSimulationPrompt;
  
  const config: any = {
      imageConfig: {
          aspectRatio: finalAspectRatio
      }
  };
  
  if (modelName === 'gemini-3-pro-image-preview') {
      config.imageConfig.imageSize = imageSize;
  }

  for (let i = 0; i < count; i++) {
    try {
      const parts: any[] = [
        { inlineData: { data: referenceStyle.base64, mimeType: referenceStyle.mimeType } }, // Image 1: Lighting/Style ref
        { inlineData: { data: baseRender.base64, mimeType: baseRender.mimeType } }, // Image 2: Geometry source
        { text: engineeredPrompt }
      ];

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config,
      });
      results.push(extractBase64Image(response));
    } catch (error) {
      console.error(`Failed to simulate lighting ${i + 1}/${count}:`, error);
    }
  }

  return results.filter((result): result is string => result !== null);
};

export const generateInteriorVariationSet = async (
  sourceImage: SourceImage,
  lang: 'vi' | 'en' = 'vi',
  aspectRatio: string = '4:3',
  imageSize: ImageSize = '1K',
  characterImage: SourceImage | null = null,
  modelName: string = 'gemini-2.5-flash-image',
  onRoomComplete?: (room: string, imageUrl: string) => void
): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const rooms = [
    translations[lang].roomLiving,
    translations[lang].roomBedroom,
    translations[lang].roomKitchen,
    translations[lang].roomDining,
    translations[lang].roomStudy,
    translations[lang].roomBath,
    translations[lang].roomHall,
    translations[lang].roomDetail,
    translations[lang].roomOutdoor,
  ];

  const template = translations[lang].engineeredPrompts.generateInteriorVariation;
  
  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      finalAspectRatio = await getClosestAspectRatio(sourceImage);
  }

  const isProModel = modelName === 'gemini-3-pro-image-preview';
  const config: any = {
      imageConfig: {
          aspectRatio: finalAspectRatio
      }
  };
  
  if (isProModel) {
      config.imageConfig.imageSize = imageSize;
  }

  for (const room of rooms) {
    try {
      let characterAction = "";
      if (characterImage) {
          const actions: Record<string, string> = {
              [translations[lang].roomLiving]: lang === 'vi' ? "đang ngồi thư giãn trên sofa" : "relaxing on the sofa",
              [translations[lang].roomBedroom]: lang === 'vi' ? "đang nằm nghỉ ngơi trên giường" : "resting on the bed",
              [translations[lang].roomKitchen]: lang === 'vi' ? "đang chuẩn bị đồ ăn tại bàn bếp" : "preparing food at the kitchen counter",
              [translations[lang].roomDining]: lang === 'vi' ? "đang ngồi tại bàn ăn" : "sitting at the dining table",
              [translations[lang].roomStudy]: lang === 'vi' ? "đang ngồi làm việc tại bàn" : "working at the desk",
              [translations[lang].roomBath]: lang === 'vi' ? "đang đứng trước gương" : "standing in front of the mirror",
              [translations[lang].roomHall]: lang === 'vi' ? "đang đi bộ trong hành lang" : "walking in the hallway",
              [translations[lang].roomDetail]: lang === 'vi' ? "đang chạm tay vào bề mặt vật liệu" : "touching the material surface",
              [translations[lang].roomOutdoor]: lang === 'vi' ? "đang đứng ngắm cảnh" : "enjoying the view",
          };
          const specificAction = actions[room] || (lang === 'vi' ? "đang hoạt động trong không gian" : "active in the space");
          characterAction = translations[lang].engineeredPrompts.interiorViewWithCharacter.replace("{action}", specificAction);
      }

      const engineeredPrompt = formatPrompt(template, room, characterAction);
      const parts: any[] = [
        { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
      ];
      
      if (characterImage) {
        parts.push({ inlineData: { data: characterImage.base64, mimeType: characterImage.mimeType } });
      }

      parts.push({ text: engineeredPrompt });

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config,
      });

      const imageUrl = extractBase64Image(response);
      if (imageUrl && onRoomComplete) {
        onRoomComplete(room, imageUrl);
      }
    } catch (error) {
      console.error(`Failed to generate room view for: ${room}`, error);
    }
  }
};

export const generateArchToInteriorSet = async (
  sourceImage: SourceImage,
  lang: 'vi' | 'en' = 'vi',
  aspectRatio: string = '4:3',
  imageSize: ImageSize = '1K',
  characterImage: SourceImage | null = null,
  modelName: string = 'gemini-2.5-flash-image',
  onRoomComplete?: (room: string, imageUrl: string) => void
): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const rooms = [
    translations[lang].roomLiving,
    translations[lang].roomBedroom,
    translations[lang].roomKitchen,
    translations[lang].roomDining,
    translations[lang].roomStudy,
    translations[lang].roomBath,
    translations[lang].roomHall,
    translations[lang].roomDetail,
    translations[lang].roomOutdoor,
  ];

  const template = translations[lang].engineeredPrompts.generateArchToInterior;
  
  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      finalAspectRatio = await getClosestAspectRatio(sourceImage);
  }

  const config: any = {
      imageConfig: {
          aspectRatio: finalAspectRatio
      }
  };
  
  if (modelName === 'gemini-3-pro-image-preview') {
      config.imageConfig.imageSize = imageSize;
  }

  for (const room of rooms) {
    try {
      const characterPrompt = characterImage ? (lang === 'vi' ? "Có thêm nhân vật đang sinh hoạt trong không gian." : "Include a person living in the space.") : "";
      const engineeredPrompt = formatPrompt(template, room, characterPrompt);
      const parts: any[] = [
        { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
      ];
      
      if (characterImage) {
        parts.push({ inlineData: { data: characterImage.base64, mimeType: characterImage.mimeType } });
      }

      parts.push({ text: engineeredPrompt });

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config,
      });

      const imageUrl = extractBase64Image(response);
      if (imageUrl && onRoomComplete) {
        onRoomComplete(room, imageUrl);
      }
    } catch (error) {
      console.error(`Failed to generate room view for: ${room}`, error);
    }
  }
};

export const generateArchitectureVariationSet = async (
  sourceImage: SourceImage,
  lang: 'vi' | 'en' = 'vi',
  aspectRatio: string = '4:3',
  imageSize: ImageSize = '1K',
  characterImage: SourceImage | null = null,
  modelName: string = 'gemini-2.5-flash-image',
  onOptionComplete?: (option: string, imageUrl: string) => void
): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const viewTypes = translations[lang].archViewTypes;
  
  const options = [
    { name: viewTypes.wide1, desc: lang === 'vi' ? "Góc cao toàn cảnh bao quát công trình, ánh sáng bình minh trong trẻo với sương nhẹ" : "High angle panoramic wide shot, clear morning dawn light with light mist" },
    { name: viewTypes.wide2, desc: lang === 'vi' ? "Góc nghiêng 45 độ toàn cảnh từ xa, bối cảnh bầu trời hoàng hôn vàng rực rỡ" : "45-degree angle wide shot from distance, vibrant golden sunset sky context" },
    { name: viewTypes.wide3, desc: lang === 'vi' ? "Góc chụp flycam từ trên cao nhìn xuống (bird-eye view), thấy toàn bộ khuôn viên và cảnh quan" : "Bird-eye flycam view looking down, showing the entire site and landscaping" },
    { name: viewTypes.close1, desc: lang === 'vi' ? "Cận cảnh đặc tả bề mặt vật liệu hiện có trên công trình: vân đá, gỗ hoặc kim loại" : "Macro close-up of existing surface materials: stone veins, wood or metal" },
    { name: viewTypes.close2, desc: lang === 'vi' ? "Cận cảnh chi tiết cấu trúc hiện có: các khớp nối, lan can hoặc điểm giao cắt hình khối" : "Macro close-up of existing structural details: joints, railings or geometry intersections" },
    { name: viewTypes.close3, desc: lang === 'vi' ? "Cận cảnh tập trung vào lối vào chính và sảnh đón của công trình gốc" : "Close-up focused on main entrance and lobby of the source building" },
    { name: viewTypes.close4, desc: lang === 'vi' ? "Cận cảnh một góc chi tiết kiến trúc hoặc cảnh quan ngay sát chân công trình" : "Close-up of an existing architectural corner or landscape detail adjacent to the building" },
    { name: viewTypes.artistic1, desc: lang === 'vi' ? "Góc máy nghệ thuật với tiền cảnh mờ ảo, lấy nét sâu vào một chi tiết hiện hữu của công trình" : "Artistic shot with blurred foreground, deep focus on an existing part of the building" },
    { name: viewTypes.artistic2, desc: lang === 'vi' ? "Góc máy đêm kịch tính, nhấn mạnh ánh sáng hắt ra từ các ô cửa hiện có của công trình" : "Dramatic night shot, highlighting light glowing from the building's existing windows" },
  ];

  const template = translations[lang].engineeredPrompts.generateArchitectureVariation;
  const characterPrompt = characterImage ? translations[lang].engineeredPrompts.architectureViewWithCharacter : "";

  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      finalAspectRatio = await getClosestAspectRatio(sourceImage);
  }

  const isProModel = modelName === 'gemini-3-pro-image-preview';
  const config: any = {
      imageConfig: {
          aspectRatio: finalAspectRatio
      }
  };
  
  if (isProModel) {
      config.imageConfig.imageSize = imageSize;
  }

  for (const opt of options) {
    try {
      const engineeredPrompt = formatPrompt(template, opt.desc, characterPrompt);
      const parts: any[] = [
        { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
      ];
      
      if (characterImage) {
        parts.push({ inlineData: { data: characterImage.base64, mimeType: characterImage.mimeType } });
      }

      parts.push({ text: engineeredPrompt });

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config,
      });

      const imageUrl = extractBase64Image(response);
      if (imageUrl && onOptionComplete) {
        onOptionComplete(opt.name, imageUrl);
      }
    } catch (error) {
      console.error(`Failed to generate architecture option for: ${opt.name}`, error);
    }
  }
};

export const generateInteriorDetailVariationSet = async (
  sourceImage: SourceImage,
  lang: 'vi' | 'en' = 'vi',
  aspectRatio: string = '4:3',
  imageSize: ImageSize = '1K',
  modelName: string = 'gemini-2.5-flash-image',
  onOptionComplete?: (option: string, imageUrl: string) => void
): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const viewTypes = translations[lang].interiorDetailViewTypes;
  
  const options = [
    { name: viewTypes.detail1, desc: lang === 'vi' ? "Cận cảnh đặc tả bề mặt vải sofa, thớ vải dệt thô, gối tựa mềm mại" : "Close-up of sofa fabric surface, coarse weave texture, soft cushions" },
    { name: viewTypes.detail2, desc: lang === 'vi' ? "Cận cảnh mặt bàn gỗ hoặc đá với các món đồ decor nhỏ, lọ hoa, nến" : "Close-up of wood or stone tabletop with small decor items, flower vase, candles" },
    { name: viewTypes.detail3, desc: lang === 'vi' ? "Cận cảnh đèn bàn hoặc đèn treo, tập trung vào hiệu ứng ánh sáng và vật liệu chao đèn" : "Close-up of table or pendant lamp, focusing on lighting effects and lampshade material" },
    { name: viewTypes.detail4, desc: lang === 'vi' ? "Cận cảnh vân gỗ tự nhiên hoặc vân đá marble sắc nét trên đồ nội thất" : "Close-up of natural wood grain or sharp marble veins on furniture" },
    { name: viewTypes.detail5, desc: lang === 'vi' ? "Cận cảnh các chi tiết kim loại, tay nắm cửa, chân bàn mạ PVD hoặc khớp nối cơ khí" : "Close-up of metal details, door handles, PVD plated table legs or mechanical joints" },
    { name: viewTypes.detail6, desc: lang === 'vi' ? "Góc chụp nghệ thuật một góc decor nhỏ trên kệ sách hoặc tủ trang trí" : "Artistic shot of a small decor corner on a bookshelf or decorative cabinet" },
    { name: viewTypes.artistic1, desc: lang === 'vi' ? "Góc máy nghệ thuật với tiền cảnh mờ ảo (bokeh), lấy nét vào một món đồ rời" : "Artistic shot with blurred foreground (bokeh), focusing on a loose furniture item" },
    { name: viewTypes.artistic2, desc: lang === 'vi' ? "Góc chụp với độ tương phản sáng tối mạnh, nhấn mạnh hình khối của đồ nội thất" : "Shot with strong chiaroscuro contrast, emphasizing furniture geometry" },
    { name: viewTypes.artistic3, desc: lang === 'vi' ? "Bố cục tối giản, tập trung vào sự tĩnh lặng và tinh tế của một góc nhỏ" : "Minimalist composition, focusing on the stillness and refinement of a small corner" },
  ];

  const template = translations[lang].engineeredPrompts.generateInteriorDetailVariation;

  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      finalAspectRatio = await getClosestAspectRatio(sourceImage);
  }

  const isProModel = modelName === 'gemini-3-pro-image-preview';
  const config: any = {
      imageConfig: {
          aspectRatio: finalAspectRatio
      }
  };
  
  if (isProModel) {
      config.imageConfig.imageSize = imageSize;
  }

  for (const opt of options) {
    try {
      const engineeredPrompt = formatPrompt(template, opt.desc);
      const parts: any[] = [
        { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
        { text: engineeredPrompt }
      ];

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config,
      });

      const imageUrl = extractBase64Image(response);
      if (imageUrl && onOptionComplete) {
        onOptionComplete(opt.name, imageUrl);
      }
    } catch (error) {
      console.error(`Failed to generate interior detail option for: ${opt.name}`, error);
    }
  }
};

export const generateConstructionSequence = async (
  sourceImage: SourceImage,
  lang: 'vi' | 'en' = 'vi',
  aspectRatio: string = '4:3',
  imageSize: ImageSize = '1K',
  modelName: string = 'gemini-2.5-flash-image',
  onStageComplete?: (stage: string, imageUrl: string) => void
): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const stages = [
    translations[lang].stageMessy,
    translations[lang].stageCleaned,
    translations[lang].stageRough,
    translations[lang].stageFinishing,
    translations[lang].stageLandscape
  ];

  const promptsMap: Record<string, string> = {
    [translations[lang].stageMessy]: translations[lang].engineeredPrompts.constructionMessy,
    [translations[lang].stageCleaned]: translations[lang].engineeredPrompts.constructionCleaned,
    [translations[lang].stageRough]: translations[lang].engineeredPrompts.constructionRough,
    [translations[lang].stageFinishing]: translations[lang].engineeredPrompts.constructionFinishing,
    [translations[lang].stageLandscape]: translations[lang].engineeredPrompts.constructionLandscape,
  };

  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      finalAspectRatio = await getClosestAspectRatio(sourceImage);
  }

  const isProModel = modelName === 'gemini-3-pro-image-preview';
  const config: any = {
      imageConfig: {
          aspectRatio: finalAspectRatio
      }
  };
  
  if (isProModel) {
      config.imageConfig.imageSize = imageSize;
  }

  for (const stage of stages) {
    try {
      const engineeredPrompt = promptsMap[stage];
      const parts: any[] = [
        { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
        { text: engineeredPrompt }
      ];

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config,
      });

      const imageUrl = extractBase64Image(response);
      if (imageUrl && onStageComplete) {
        onStageComplete(stage, imageUrl);
      }
    } catch (error) {
      console.error(`Failed to generate construction stage for: ${stage}`, error);
    }
  }
};

export const generateTextureMapSet = async (
  sourceImage: SourceImage,
  selectedMaps: TextureMapType[],
  lang: 'vi' | 'en' = 'vi',
  imageSize: ImageSize = '1K',
  modelName: string = 'gemini-2.5-flash-image',
  onMapComplete?: (mapType: TextureMapType, imageUrl: string) => void
): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const template = translations[lang].engineeredPrompts.generateTextureMap;
  
  const finalAspectRatio = await getClosestAspectRatio(sourceImage);
  const isProModel = modelName === 'gemini-3-pro-image-preview';
  
  const config: any = {
      imageConfig: {
          aspectRatio: finalAspectRatio
      }
  };
  
  if (isProModel) {
      config.imageConfig.imageSize = imageSize;
  }

  // Quy trình mới: Tạo map Diffuse trước làm cơ sở
  let workingSource: SourceImage = sourceImage;
  
  try {
      // LUÔN tạo map Diffuse đầu tiên để làm sạch bối cảnh, khử phối cảnh và DELIGHTING
      const diffusePrompt = formatPrompt(template, 'Diffuse');
      const diffuseResponse = await ai.models.generateContent({
        model: modelName,
        contents: { parts: [
            { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
            { text: diffusePrompt }
        ] },
        config: config,
      });

      const diffuseUrl = extractBase64Image(diffuseResponse);
      if (diffuseUrl) {
          // Nếu người dùng yêu cầu Diffuse, gọi callback hoàn tất cho Diffuse
          if (selectedMaps.includes('Diffuse')) {
              onMapComplete?.('Diffuse', diffuseUrl);
          }
          // Chuyển đổi dataUrl về SourceImage để làm base cho các map tiếp theo
          const refinedSource = dataUrlToSourceImage(diffuseUrl);
          if (refinedSource) workingSource = refinedSource;
      }
  } catch (error) {
      console.error("Failed to generate base Diffuse map. Chaining to original source.", error);
  }

  // Tiếp tục tạo các kênh map khác dựa trên map Diffuse đã "tinh chế"
  for (const mapType of selectedMaps) {
    if (mapType === 'Diffuse') continue; // Đã xử lý ở trên

    try {
      const engineeredPrompt = formatPrompt(template, mapType);
      const parts: any[] = [
        { inlineData: { data: workingSource.base64, mimeType: workingSource.mimeType } },
        { text: engineeredPrompt }
      ];

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config,
      });

      const imageUrl = extractBase64Image(response);
      if (imageUrl && onMapComplete) {
        onMapComplete(mapType, imageUrl);
      }
    } catch (error) {
      console.error(`Failed to generate texture map: ${mapType}`, error);
    }
  }
};

export const generateVideo = async (
  sourceImage: SourceImage,
  prompt: string,
  model: string,
  onProgress: (message: string) => void
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const progressMessages = [
    "AI is warming up the virtual cameras...",
    "Analyzing the scene and your prompt...",
    "Storyboarding the first few frames...",
    "Rendering the motion sequence...",
    "Adding final touches and visual effects...",
    "This can take a few minutes, hang tight!",
  ];

  try {
    onProgress("Initializing video generation...");
    let operation = await ai.models.generateVideos({
      model: model,
      prompt: prompt,
      image: {
        imageBytes: sourceImage.base64,
        mimeType: sourceImage.mimeType,
      },
      config: {
        numberOfVideos: 1,
      }
    });

    let messageIndex = 0;
    onProgress(progressMessages[messageIndex]);

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      messageIndex = (messageIndex + 1) % progressMessages.length;
      onProgress(progressMessages[messageIndex]);
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    onProgress("Video generated! Downloading...");
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation succeeded but no download link was found.");
    
    const response = await fetch(downloadLink, {
      method: 'GET',
      headers: {
        'x-goog-api-key': getApiKey(),
      },
    });
    if (!response.ok) throw new Error(`Failed to download video: ${response.statusText}`);

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    onProgress("Download complete!");
    return videoUrl;
  } catch (error) {
    console.error("Failed to generate video:", error);
    throw error;
  }
};

export const classifyImageType = async (
  sourceImage: SourceImage
): Promise<'interior' | 'exterior'> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const engineeredPrompt = translations.vi.engineeredPrompts.classifyImageTypePrompt;
  const parts: any[] = [
    { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
    { text: engineeredPrompt },
  ];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
    });
    const result = (response.text || "").trim().toLowerCase();
    return result.includes('interior') ? 'interior' : 'exterior';
  } catch (error) {
    console.error("Failed to classify image type:", error);
    return 'exterior';
  }
};

export const generatePromptFromImage = async (
  sourceImage: SourceImage,
  lang: 'vi' | 'en' = 'vi',
  imageType: 'interior' | 'exterior' | 'planning' = 'exterior'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  let templateKey: string;
  if (imageType === 'interior') templateKey = 'generateFromImageInterior';
  else if (imageType === 'planning') templateKey = 'generateFromPlanningImage';
  else templateKey = 'generateFromImage';
  
  const engineeredPrompt = translations[lang].engineeredPrompts[templateKey as keyof typeof translations.vi.engineeredPrompts];
  const parts: any[] = [
    { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
    { text: engineeredPrompt },
  ];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
    });
    
    let result = (response.text || "").trim();
    
    return result;
  } catch (error) {
    console.error("Failed to generate prompt from image:", error);
    throw new Error("Could not generate prompt from image.");
  }
};

export const generatePromptFromKeywords = async (
  keywords: string,
  lang: 'vi' | 'en' = 'vi',
  imageType: 'interior' | 'exterior' | 'planning' = 'exterior'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  let templateKey: string;
  if (imageType === 'interior') templateKey = 'generateFromKeywordsInterior';
  else if (imageType === 'planning') templateKey = 'generateFromPlanningImage'; 
  else templateKey = 'generateFromKeywords';
  
  const template = translations[lang].engineeredPrompts[templateKey as keyof typeof translations.vi.engineeredPrompts];
  const engineeredPrompt = formatPrompt(template, keywords);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: engineeredPrompt,
    });
    return (response.text || "").trim();
  } catch (error) {
    console.error("Failed to generate prompt from keywords:", error);
    throw new Error("Could not generate prompt from keywords.");
  }
};

export const editImage = async (
  sourceImage: SourceImage,
  maskImage: SourceImage,
  prompt: string,
  count: number = 2,
  referenceImage: SourceImage | null = null,
  lang: 'vi' | 'en' = 'vi',
  aspectRatio: string = 'auto'
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const results: (string | null)[] = [];

  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      finalAspectRatio = await getClosestAspectRatio(sourceImage);
  }

  for (let i = 0; i < count; i++) {
    const parts: any[] = [
        { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
        { inlineData: { data: maskImage.base64, mimeType: maskImage.mimeType } },
    ];
    
    let engineeredPrompt: string;
    if (referenceImage) {
        parts.push({ inlineData: { data: referenceImage.base64, mimeType: referenceImage.mimeType } });
        const template = translations[lang].engineeredPrompts.editWithReference;
        engineeredPrompt = formatPrompt(template, prompt);
    } else {
        const template = translations[lang].engineeredPrompts.editWithoutReference;
        engineeredPrompt = formatPrompt(template, prompt);
    }
    parts.push({ text: engineeredPrompt });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                imageConfig: {
                    aspectRatio: finalAspectRatio
                }
            },
          }
        );
        results.push(extractBase64Image(response));
    } catch(error) {
        console.error(`Failed to edit image ${i + 1}/${count}:`, error);
        throw error;
    }
  }
  return results.filter((result): result is string => result !== null);
};

export const mergeImages = async (
  image1: SourceImage,
  image2: SourceImage,
  prompt: string,
  count: number = 2,
  aspectRatio: string = 'auto'
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const results: (string | null)[] = [];

  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      finalAspectRatio = await getClosestAspectRatio(image1);
  }

  for (let i = 0; i < count; i++) {
    const parts: any[] = [
      { inlineData: { data: image1.base64, mimeType: image1.mimeType } },
      { inlineData: { data: image2.base64, mimeType: image2.mimeType } },
      { text: prompt },
    ];
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            imageConfig: {
                aspectRatio: finalAspectRatio
            }
        },
      });
      results.push(extractBase64Image(response));
    } catch (error) {
      console.error(`Failed to generate merged image ${i + 1}/${count}:`, error);
    }
  }
  return results.filter((result): result is string => result !== null);
};

export const placeAndRenderFurniture = async (
  bgImage: SourceImage,
  placements: { image: SourceImage; transform: ObjectTransform }[],
  count: number = 2,
  lang: 'vi' | 'en' = 'vi',
  aspectRatio: string = 'auto'
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  if (placements.length === 0) return [];

  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      finalAspectRatio = await getClosestAspectRatio(bgImage);
  }

  const simplifiedPlacements = placements.map(({ transform }) => ({
    pos: { x: transform.x.toFixed(2), y: transform.y.toFixed(2) },
    scale: transform.scale.toFixed(2),
    rotation: transform.rotation.toFixed(0),
    orientation: { flip_horizontal: transform.flipHorizontal, flip_vertical: transform.flipVertical }
  }));
  const template = translations[lang].engineeredPrompts.placeAndRenderFurniture;
  const engineeredPrompt = formatPrompt(template, JSON.stringify(simplifiedPlacements, null, 2));
  const results: (string | null)[] = [];
  for (let i = 0; i < count; i++) {
    const parts: any[] = [
        { inlineData: { data: bgImage.base64, mimeType: bgImage.mimeType } },
        ...placements.map(p => ({ inlineData: { data: p.image.base64, mimeType: p.image.mimeType } })),
        { text: engineeredPrompt },
    ];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                imageConfig: {
                    aspectRatio: finalAspectRatio
                }
            },
        });
        results.push(extractBase64Image(response));
    } catch (error) {
        console.error(`Failed to generate canva image ${i + 1}/${count}:`, error);
    }
  }
  return results.filter((result): result is string => result !== null);
};

export const analyzeCharacterImage = async (
    characterImage: SourceImage,
    lang: 'vi' | 'en' = 'vi'
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const engineeredPrompt = translations[lang].engineeredPrompts.analyzeCharacterPrompt;
    const parts: any[] = [
        { inlineData: { data: characterImage.base64, mimeType: characterImage.mimeType } },
        { text: engineeredPrompt },
    ];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts },
        });
        return (response.text || "").trim();
    } catch (error) {
        console.error("Failed to analyze character image:", error);
        return "";
    }
};

export const analyzeImageArea = async (
    areaImage: SourceImage,
    lang: 'vi' | 'en' = 'vi'
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const engineeredPrompt = translations[lang].engineeredPrompts.analyzeAreaPrompt;
    const parts: any[] = [
        { inlineData: { data: areaImage.base64, mimeType: areaImage.mimeType } },
        { text: engineeredPrompt },
    ];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts },
        });
        return (response.text || "").trim();
    } catch (error) {
        console.error("Failed to analyze image area:", error);
        return "";
    }
};

export const generateArchitecturalPrompts = async (
    sourceImage: SourceImage,
    lang: 'vi' | 'en' = 'vi',
    characterDescription: string = '',
    modelName: string = 'gemini-3-flash-preview'
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const template = translations[lang].engineeredPrompts.generateArchitecturalPrompts;
    const engineeredPrompt = formatPrompt(template, characterDescription);
    const parts: any[] = [
        { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
        { text: engineeredPrompt },
    ];
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts },
        });
        const rawText = (response.text || "").trim();
        const firstHeaderIndex = rawText.search(/\d+️⃣/);
        const contentText = firstHeaderIndex !== -1 ? rawText.substring(firstHeaderIndex) : rawText;
        return contentText.replace(/\*/g, '').replace(/^\s*[-•]\s*/gm, '').trim();
    } catch (error) {
        console.error("Failed to generate architectural prompts from image:", error);
        throw new Error("Could not generate prompts from image.");
    }
};

export const generatePromptFromPlan = async (
  sourceImage: SourceImage,
  lang: 'vi' | 'en' = 'vi'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const engineeredPrompt = translations[lang].engineeredPrompts.generateFromPlan;
  const parts: any[] = [
    { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
    { text: engineeredPrompt },
  ];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
    });
    return (response.text || "").trim();
  } catch (error) {
    console.error("Failed to generate prompt from plan:", error);
    throw new Error("Could not generate prompt from plan.");
  }
};

export const analyzePlanStyle = async (
  referenceImage: SourceImage,
  lang: 'vi' | 'en' = 'vi'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const engineeredPrompt = translations[lang].engineeredPrompts.analyzePlanStyle;
  const parts: any[] = [
    { inlineData: { data: referenceImage.base64, mimeType: referenceImage.mimeType } },
    { text: engineeredPrompt },
  ];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
    });
    return (response.text || "").trim();
  } catch (error) {
    console.error("Failed to analyze plan style:", error);
    throw new Error("Could not analyze plan style.");
  }
};

export const generateMoodboard = async (
  sourceImage: SourceImage,
  userPrompt: string,
  referenceImage: SourceImage | null,
  imageCount: number,
  lang: 'vi' | 'en' = 'vi',
  aspectRatio: string = 'auto'
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const results: (string | null)[] = [];

  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      finalAspectRatio = await getClosestAspectRatio(sourceImage);
  }

  for (let i = 0; i < imageCount; i++) {
    const parts: any[] = [
      { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
    ];
    let engineeredPrompt: string;
    if (referenceImage) {
      parts.push({ inlineData: { data: referenceImage.base64, mimeType: referenceImage.mimeType } });
      const template = translations[lang].engineeredPrompts.generateMoodboardWithReference;
      engineeredPrompt = formatPrompt(template, userPrompt);
    } else {
      const template = translations[lang].engineeredPrompts.generateMoodboard;
      engineeredPrompt = formatPrompt(template, userPrompt);
    }
    parts.push({ text: engineeredPrompt });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            imageConfig: {
                aspectRatio: finalAspectRatio
            }
        },
      });
      results.push(extractBase64Image(response));
    } catch (error) {
      console.error(`Failed to generate moodboard ${i + 1}/${imageCount}:`, error);
    }
  }
  return results.filter((result): result is string => result !== null);
};

export const applyLighting = async (
  sourceImage: SourceImage,
  lightingPrompt: string,
  imageCount: number,
  lang: 'vi' | 'en' = 'vi',
  aspectRatio: string = 'auto'
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const results: (string | null)[] = [];

  let finalAspectRatio = aspectRatio;
  if (finalAspectRatio === 'auto') {
      finalAspectRatio = await getClosestAspectRatio(sourceImage);
  }

  const template = translations[lang].engineeredPrompts.applyLighting;
  const engineeredPrompt = formatPrompt(template, lightingPrompt);
  for (let i = 0; i < imageCount; i++) {
    const parts: any[] = [
      { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
      { text: engineeredPrompt }
    ];
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            imageConfig: {
                aspectRatio: finalAspectRatio
            }
        },
      });
      results.push(extractBase64Image(response));
    } catch (error) {
      console.error(`Failed to generate lighting image ${i + 1}/${imageCount}:`, error);
    }
  }
  return results.filter((result): result is string => result !== null);
};

export const generateVideoScriptPrompt = async (
  sourceImage: SourceImage,
  userPrompt: string,
  lang: 'vi' | 'en' = 'vi'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const engineeredPrompt = `hãy đóng vai một đạo diễn chuyên về quay phim kiến trúc,nội thất với hơn 20 năm kinh nghiệm và một chuyên gia viết promt chuyển từ ảnh thành video ngắn cho các ai kling và veo 3, bạn có kinh nghiệm về các góc camera, chuyển động của ánh sáng, bố cục và dựa vào tài liệu hàng đầu về nhiếp ảnh kiến trúc, nội thất. Khi tôi tải ảnh lên + yêu cầu bằng tiếng việt bạn hãy đựa vào đó viết promt tạo chuyển động cho ảnh theo chỉ định bằng tiếng anh, chỉ hiện promt ko hiện phân tích. Yêu cầu của người dùng là: "${userPrompt}"`;
  const parts: any[] = [
    { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
    { text: engineeredPrompt },
  ];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
    });
    return (response.text || "").trim();
  } catch (error) {
    console.error("Failed to generate video script prompt:", error);
    throw new Error("Could not generate video script prompt.");
  }
};

export const extendView = async (
  sourceImage: SourceImage,
  targetAspectRatioLabel: AspectRatio,
  imageCount: number,
  lang: 'vi' | 'en' = 'vi'
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  let finalRatioLabel = targetAspectRatioLabel;
  if (finalRatioLabel === 'auto') {
      finalRatioLabel = await getClosestAspectRatio(sourceImage) as AspectRatio;
  }
  
  const [w, h] = finalRatioLabel.split(':').map(Number);
  const targetAspectRatio = w / h;
  const paddedImage = await padImageToAspectRatioWithColor(sourceImage, targetAspectRatio, '#FF00FF');
  const results: (string | null)[] = [];
  const engineeredPrompt = translations[lang].engineeredPrompts.extendView;
  for (let i = 0; i < imageCount; i++) {
    const parts: any[] = [
      { inlineData: { data: paddedImage.base64, mimeType: paddedImage.mimeType } },
      { text: engineeredPrompt }
    ];
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            imageConfig: {
                aspectRatio: finalRatioLabel === 'auto' ? '4:3' : finalRatioLabel
            }
        },
      });
      results.push(extractBase64Image(response));
    } catch (error) {
      console.error(`Failed to generate extended view image ${i + 1}/${imageCount}:`, error);
    }
  }
  return results.filter((result): result is string => result !== null);
};

export const generateStyleChangePrompt = async (
  sourceImage: SourceImage,
  userPrompt: string,
  lang: 'vi' | 'en' = 'vi'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const template = translations[lang].engineeredPrompts.changeStylePrompt;
  const engineeredPrompt = formatPrompt(template, userPrompt);
  const parts: any[] = [
    { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
    { text: engineeredPrompt },
  ];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
    });
    return (response.text || "").trim();
  } catch (error) {
    console.error("Failed to generate style change prompt:", error);
    throw new Error("Could not generate style change prompt.");
  }
};

export const detectPerspective = async (
  sourceImage: SourceImage,
  lang: 'vi' | 'en' = 'vi'
): Promise<number[][] | null> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const engineeredPrompt = translations[lang].engineeredPrompts.detectPerspectivePrompt;
  const parts: any[] = [
    { inlineData: { data: sourceImage.base64, mimeType: sourceImage.mimeType } },
    { text: engineeredPrompt },
  ];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: { responseMimeType: "application/json" }
    });
    
    const text = response.text || "";
    const data = JSON.parse(text);
    if (data && data.points && Array.isArray(data.points)) {
      return data.points;
    }
    return null;
  } catch (error) {
    console.error("Failed to detect perspective:", error);
    return null;
  }
};
