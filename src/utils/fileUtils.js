// src/utils/fileUtils.js
// Tiện ích xử lý file

/**
 * Xác định loại file từ tên file hoặc URL
 */
export const getFileType = (fileName = '', url = '') => {
  if (url && (url.includes('drive.google.com') || url.includes('docs.google.com'))) return 'gdrive';
  if (!fileName) return 'other';
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['xlsx', 'xls'].includes(ext)) return 'excel';
  if (['docx', 'doc'].includes(ext)) return 'word';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'img';
  return 'other';
};

/**
 * Icon cho từng loại file
 */
export const getFileIcon = (fileName = '', url = '') => {
  if (url && (url.includes('drive.google.com') || url.includes('docs.google.com'))) return 'DRIVE';
  const type = getFileType(fileName, url);
  const labels = {
    gdrive: 'DRIVE',
    pdf: 'PDF',
    excel: 'XLSX',
    word: 'DOCX',
    img: 'IMG',
    other: 'FILE',
  };
  return labels[type] || 'FILE';
};

/**
 * Format dung lượng file
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Validate loại file được phép upload
 */
export const validateFileType = (file, allowed = ['pdf', 'xlsx', 'xls', 'docx', 'doc', 'jpg', 'jpeg', 'png', 'webp']) => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  return allowed.includes(ext);
};

/**
 * Validate kích thước file (mặc định tối đa 25MB)
 */
export const validateFileSize = (file, maxMB = 25) => {
  return file.size <= maxMB * 1024 * 1024;
};
