import React from 'react';
import imageCompression from 'browser-image-compression';

export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const compressSingleImage = async (file, options = {}) => {
  if (!file || !file.type || !file.type.startsWith('image/')) return file;

  const defaultOptions = {
    maxSizeMB: 1.0,           // 1MB max target
    maxWidthOrHeight: 1920,   // max width/height
    useWebWorker: true,
    ...options
  };

  try {
    const compressedBlob = await imageCompression(file, defaultOptions);
    const compressedFile = new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: Date.now()
    });
    return compressedFile;
  } catch (error) {
    console.error('Image compression error, returning original file:', error);
    return file;
  }
};

const ImageCompressorToggle = ({ isEnabled, onToggle, stats, isCompressing }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-3 text-left">
      <div className="d-flex align-items-center justify-content-between">
        <label className="d-flex align-items-center gap-2 cursor-pointer mb-0">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="form-check-input mt-0"
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
            Enable Image Compression <span className="text-primary font-normal">(Default: ON)</span>
          </span>
        </label>
        <span className={`badge ${isEnabled ? 'bg-primary' : 'bg-secondary'}`}>
          {isEnabled ? '⚡ Compression ON' : 'OFF'}
        </span>
      </div>

      {isCompressing && (
        <div className="mt-2 text-primary font-medium" style={{ fontSize: '0.82rem' }}>
          ⏳ Compressing image(s)... Please wait.
        </div>
      )}

      {stats && stats.count > 0 && !isCompressing && (
        <div className="mt-2 pt-2 border-top border-slate-200 d-flex flex-wrap align-items-center justify-between gap-2" style={{ fontSize: '0.82rem' }}>
          <div>
            <span className="text-muted">Original Size:</span> <strong className="text-dark">{formatBytes(stats.originalSize)}</strong>
          </div>
          {isEnabled && stats.compressedSize > 0 && stats.compressedSize < stats.originalSize ? (
            <>
              <div>
                <span className="text-muted">After Compression:</span> <strong className="text-success">{formatBytes(stats.compressedSize)}</strong>
              </div>
              <span className="badge bg-success">
                Saved {Math.max(0, Math.round((1 - stats.compressedSize / stats.originalSize) * 100))}% ⚡
              </span>
            </>
          ) : isEnabled && stats.compressedSize >= stats.originalSize ? (
            <span className="text-muted italic">(Already optimized)</span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ImageCompressorToggle;
