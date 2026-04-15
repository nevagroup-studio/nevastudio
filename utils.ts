
import type { SourceImage, BoundingBox } from './types';

export const sourceImageToDataUrl = (image: SourceImage): string => {
    return `data:${image.mimeType};base64,${image.base64}`;
}

export const dataUrlToSourceImage = (dataUrl: string): SourceImage | null => {
    if (!dataUrl) return null;

    const [header, base64Data] = dataUrl.split(',');
    if (!header || !base64Data) {
        console.error("Invalid data URL format for selected image.");
        return null;
    }

    const mimeTypeMatch = header.match(/:(.*?);/);
    if (!mimeTypeMatch || !mimeTypeMatch[1]) {
        console.error("Could not extract mimeType from data URL.");
        return null;
    }
    
    const mimeType = mimeTypeMatch[1];
    
    return {
        base64: base64Data,
        mimeType: mimeType
    };
};

export const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy text: ', err);
    });
};

/**
 * Crops an image to a target aspect ratio, cutting from the center.
 */
export const cropImageToAspectRatio = (image: SourceImage, targetAspectRatio: number): Promise<SourceImage> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = sourceImageToDataUrl(image);

    img.onload = () => {
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const originalAspectRatio = originalWidth / originalHeight;

      let sx = 0, sy = 0, sWidth = originalWidth, sHeight = originalHeight;

      if (originalAspectRatio > targetAspectRatio) {
        sWidth = originalHeight * targetAspectRatio;
        sx = (originalWidth - sWidth) / 2;
      } else if (originalAspectRatio < targetAspectRatio) {
        sHeight = originalWidth / targetAspectRatio;
        sy = (originalHeight - sHeight) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(sWidth);
      canvas.height = Math.round(sHeight);
      const ctx = canvas.getContext('2d');

      if (!ctx) return reject(new Error('Could not get canvas context'));
      
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL(image.mimeType);
      const newSourceImage = dataUrlToSourceImage(dataUrl);

      if (newSourceImage) resolve(newSourceImage);
      else reject(new Error('Failed to convert cropped canvas to SourceImage'));
    };

    img.onerror = (err) => reject(new Error(`Image could not be loaded: ${err}`));
  });
};

/**
 * Pads an image with transparency to match a target aspect ratio.
 */
export const padImageToAspectRatio = (image: SourceImage, targetAspectRatio: number): Promise<SourceImage> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = sourceImageToDataUrl(image);

    img.onload = () => {
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const originalAspectRatio = originalWidth / originalHeight;

      if (Math.abs(originalAspectRatio - targetAspectRatio) < 0.01) {
        resolve(image);
        return;
      }

      let canvasWidth = originalWidth;
      let canvasHeight = originalHeight;
      let dx = 0;
      let dy = 0;

      if (originalAspectRatio > targetAspectRatio) {
        canvasHeight = originalWidth / targetAspectRatio;
        dy = (canvasHeight - originalHeight) / 2;
      } else {
        canvasWidth = originalHeight * targetAspectRatio;
        dx = (canvasWidth - originalWidth) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(canvasWidth);
      canvas.height = Math.round(canvasHeight);
      const ctx = canvas.getContext('2d');

      if (!ctx) return reject(new Error('Could not get canvas context'));
      
      ctx.drawImage(img, dx, dy, originalWidth, originalHeight);

      const dataUrl = canvas.toDataURL('image/png');
      const newSourceImage = dataUrlToSourceImage(dataUrl);

      if (newSourceImage) resolve(newSourceImage);
      else reject(new Error('Failed to convert padded canvas to SourceImage'));
    };

    img.onerror = (err) => reject(new Error(`Image could not be loaded: ${err}`));
  });
};

/**
 * Pads an image with a solid color to match a target aspect ratio.
 */
export const padImageToAspectRatioWithColor = (image: SourceImage, targetAspectRatio: number, color: string = 'white'): Promise<SourceImage> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = sourceImageToDataUrl(image);

    img.onload = () => {
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const originalAspectRatio = originalWidth / originalHeight;

      if (Math.abs(originalAspectRatio - targetAspectRatio) < 0.01) {
        resolve(image);
        return;
      }

      let canvasWidth = originalWidth;
      let canvasHeight = originalHeight;
      let dx = 0;
      let dy = 0;

      if (originalAspectRatio > targetAspectRatio) {
        canvasWidth = originalWidth;
        canvasHeight = originalWidth / targetAspectRatio;
        dy = (canvasHeight - originalHeight) / 2;
      } else {
        canvasHeight = originalHeight;
        canvasWidth = originalHeight * targetAspectRatio;
        dx = (canvasWidth - originalWidth) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(canvasWidth);
      canvas.height = Math.round(canvasHeight);
      const ctx = canvas.getContext('2d');

      if (!ctx) return reject(new Error('Could not get canvas context'));
      
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, dx, dy, originalWidth, originalHeight);

      const dataUrl = canvas.toDataURL('image/png');
      const newSourceImage = dataUrlToSourceImage(dataUrl);

      if (newSourceImage) resolve(newSourceImage);
      else reject(new Error('Failed to convert padded canvas to SourceImage'));
    };

    img.onerror = (err) => reject(new Error(`Image could not be loaded: ${err}`));
  });
};

/**
 * Crops an image based on a bounding box.
 */
export const cropImage = (image: SourceImage, box: BoundingBox): Promise<SourceImage> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = sourceImageToDataUrl(image);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(box.width);
      canvas.height = Math.round(box.height);
      const ctx = canvas.getContext('2d');

      if (!ctx) return reject(new Error('Could not get canvas context'));
      
      ctx.drawImage(
        img, 
        Math.round(box.x), Math.round(box.y), Math.round(box.width), Math.round(box.height),
        0, 0, canvas.width, canvas.height
      );

      const dataUrl = canvas.toDataURL(image.mimeType);
      const newSourceImage = dataUrlToSourceImage(dataUrl);

      if (newSourceImage) resolve(newSourceImage);
      else reject(new Error('Failed to convert cropped canvas to SourceImage'));
    };

    img.onerror = (err) => reject(new Error(`Image could not be loaded: ${err}`));
  });
};

interface CompositeOptions {
  expansion: number;
  edgeBlend: number;
}

/**
 * Composites a generated image back onto a source image using a mask.
 * Optimized for seamless integration with context preservation.
 */
export const compositeImage = (
  bgImage: SourceImage,
  fgImage: SourceImage,
  box: BoundingBox,
  maskImage: SourceImage,
  options: CompositeOptions
): Promise<SourceImage> => {
  return new Promise((resolve, reject) => {
    const bg = new Image();
    const fg = new Image();
    const mask = new Image();
    
    let loadedCount = 0;
    const totalImages = 3;

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) performComposite();
    };

    bg.crossOrigin = "anonymous";
    fg.crossOrigin = "anonymous";
    mask.crossOrigin = "anonymous";

    bg.onload = onImageLoad;
    fg.onload = onImageLoad;
    mask.onload = onImageLoad;

    const errorHandler = (err: any) => reject(new Error(`Image could not be loaded: ${err}`));
    bg.onerror = errorHandler;
    fg.onerror = errorHandler;
    mask.onerror = errorHandler;

    bg.src = sourceImageToDataUrl(bgImage);
    fg.src = sourceImageToDataUrl(fgImage);
    mask.src = sourceImageToDataUrl(maskImage);

    const performComposite = () => {
      try {
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = bg.naturalWidth;
        finalCanvas.height = bg.naturalHeight;
        const finalCtx = finalCanvas.getContext('2d');
        if (!finalCtx) return reject(new Error('Could not get final canvas context'));

        // 1. Draw the original background image as the base layer.
        finalCtx.drawImage(bg, 0, 0);

        // 2. Prepare the feathered mask.
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = bg.naturalWidth;
        maskCanvas.height = bg.naturalHeight;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return reject(new Error('Could not get mask canvas context'));

        // Implementation of mask expansion using multiple draws or filters.
        // We use expansion (dilation) to ensure the edit covers slightly more area to hide gaps.
        if (options.expansion > 0) {
            maskCtx.shadowBlur = options.expansion;
            maskCtx.shadowColor = 'white';
            // Draw a few times to create solid expansion
            for(let i=0; i<3; i++) maskCtx.drawImage(mask, 0, 0);
            maskCtx.shadowBlur = 0;
        } else {
            maskCtx.drawImage(mask, 0, 0);
        }

        // 3. Prepare the feathered edge on a temp canvas for the blending zone.
        const featherCanvas = document.createElement('canvas');
        featherCanvas.width = bg.naturalWidth;
        featherCanvas.height = bg.naturalHeight;
        const featherCtx = featherCanvas.getContext('2d');
        if (!featherCtx) return reject(new Error('Could not get feather canvas context'));

        if (options.edgeBlend > 0) {
            featherCtx.filter = `blur(${options.edgeBlend}px)`;
        }
        featherCtx.drawImage(maskCanvas, 0, 0);

        // 4. Prepare the content layer.
        const fgCanvas = document.createElement('canvas');
        fgCanvas.width = bg.naturalWidth;
        fgCanvas.height = bg.naturalHeight;
        const fgCtx = fgCanvas.getContext('2d');
        if (!fgCtx) return reject(new Error('Could not get content canvas context'));

        // Draw the AI result (cropped to bounding box) onto the full-size layer.
        fgCtx.drawImage(fg, box.x, box.y, box.width, box.height);

        // 5. Mask the content layer using the feathered mask.
        // This ensures only pixels inside the mask are taken from the AI output.
        fgCtx.globalCompositeOperation = 'destination-in';
        fgCtx.drawImage(featherCanvas, 0, 0);

        // 6. Draw the result back onto the original image.
        finalCtx.globalCompositeOperation = 'source-over';
        finalCtx.drawImage(fgCanvas, 0, 0);

        const dataUrl = finalCanvas.toDataURL('image/png');
        const newSourceImage = dataUrlToSourceImage(dataUrl);

        if (newSourceImage) resolve(newSourceImage);
        else reject(new Error('Failed to convert final canvas to SourceImage'));
      } catch (error) {
        reject(error);
      }
    };
  });
};
