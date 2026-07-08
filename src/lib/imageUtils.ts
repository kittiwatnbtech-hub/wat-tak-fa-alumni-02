/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Compresses a Base64 image using HTML5 Canvas to fit within Firestore's 1MB document limit.
 * Resizes the image to a maximum width/height of 800px and reduces JPEG quality to 0.85 by default.
 * Uses high-quality image smoothing to ensure the resized image is sharp and not blurry.
 */
export function compressImage(base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    // If it's already extremely small, resolve immediately
    if (base64Str.length < 10000) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions preserving aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Enable high-quality image smoothing for crisp, clear downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        // Export to high-quality compressed JPEG format
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}
