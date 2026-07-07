/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Compresses a Base64 image using HTML5 Canvas to fit within Firestore's 1MB document limit.
 * Resizes the image to a maximum width/height of 350px and reduces JPEG quality to 0.7 by default.
 */
export function compressImage(base64Str: string, maxWidth = 350, maxHeight = 350, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    // If it's already small or not a typical image format, resolve immediately
    if (base64Str.length < 50000) {
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
        ctx.drawImage(img, 0, 0, width, height);
        // Export to highly compressed JPEG format
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
