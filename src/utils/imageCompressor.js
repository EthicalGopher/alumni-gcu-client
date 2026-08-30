import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file in the browser before upload.
 * @param {File} imageFile - The file to compress.
 * @param {Object} customOptions - Optional custom compression settings.
 * @returns {Promise<File>} Compressed image file.
 */
export const compressImage = async (imageFile, customOptions = {}) => {
  // If not an image file or missing, return as is
  if (!imageFile || !imageFile.type || !imageFile.type.startsWith('image/')) {
    return imageFile;
  }

  const defaultOptions = {
    maxSizeMB: 1, // Compress to max 1MB
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true,
    initialQuality: 0.8,
    fileType: 'image/jpeg'
  };

  const options = { ...defaultOptions, ...customOptions };

  try {
    const compressedBlob = await imageCompression(imageFile, options);
    // Return as File with original filename
    const compressedFile = new File([compressedBlob], imageFile.name, {
      type: compressedBlob.type || imageFile.type,
      lastModified: Date.now()
    });
    return compressedFile;
  } catch (error) {
    console.warn('Image compression failed or skipped, using original file:', error);
    return imageFile;
  }
};

/**
 * Compresses an array of image files in parallel.
 * @param {File[]} imageFiles - Array of image files to compress.
 * @param {Object} customOptions - Optional compression options.
 * @returns {Promise<File[]>} Array of compressed files.
 */
export const compressImages = async (imageFiles, customOptions = {}) => {
  if (!Array.isArray(imageFiles)) return [];
  return Promise.all(imageFiles.map(file => compressImage(file, customOptions)));
};

export default compressImage;
