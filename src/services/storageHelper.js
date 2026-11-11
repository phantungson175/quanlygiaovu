import {
  collection, doc, setDoc, getDocs, query, where, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import toast from 'react-hot-toast';

const DB_NAME = 'GiaoVuStorageDB';
const STORE_NAME = 'files';
const CHUNK_COLLECTION = 'file_chunks';
const CHUNK_SIZE = 550 * 1024;
const MAX_CLOUD_FILE_BYTES = 15 * 1024 * 1024;

/**
 * Kiểm tra xem URL có phải liên kết Google Drive hay không
 */
export const isGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
};

/**
 * Kiểm tra xem URL có phải liên kết Thư mục (Folder) Google Drive không
 */
export const isGoogleDriveFolderUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') && url.includes('/folders/');
};

/**
 * Trích xuất File ID từ link Google Drive bất kỳ
 */
export const extractGoogleDriveFileId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/\/document\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/\/spreadsheets\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/\/presentation\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

/**
 * Chuyển đổi link Google Drive / Docs sang định dạng nhúng xem trước (Iframe Preview)
 */
export const getGoogleDrivePreviewUrl = (url) => {
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    if (url.includes('docs.google.com/document/')) {
      return `https://docs.google.com/document/d/${fileId}/preview`;
    }
    if (url.includes('docs.google.com/spreadsheets/')) {
      return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
    }
    if (url.includes('docs.google.com/presentation/')) {
      return `https://docs.google.com/presentation/d/${fileId}/preview`;
    }
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
};

/**
 * Chuyển đổi link Google Drive / Docs sang link tải xuống trực tiếp
 */
export const getGoogleDriveDownloadUrl = (url) => {
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    if (url.includes('docs.google.com/document/')) {
      return `https://docs.google.com/document/d/${fileId}/export?format=docx`;
    }
    if (url.includes('docs.google.com/spreadsheets/')) {
      return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
    }
    if (url.includes('docs.google.com/presentation/')) {
      return `https://docs.google.com/presentation/d/${fileId}/export?format=pptx`;
    }
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
};

/**
 * Tự động nén ảnh tại Client (WebP) trước khi lưu
 * Giúp giảm dung lượng từ 5MB - 10MB xuống còn ~80KB - 200KB mà vẫn rõ nét chữ ký, con dấu
 */
export const compressImageClient = async (file, options = {}) => {
  const { maxWidth = 1600, maxHeight = 1600, quality = 0.8 } = options;
  if (!file || !file.type || !file.type.startsWith('image/')) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob || blob.size >= file.size) {
            // Nếu nén không giảm được dung lượng thì giữ file gốc
            resolve(file);
          } else {
            const originalBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const compressedFile = new File([blob], `${originalBaseName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }
        }, 'image/webp', quality);
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

const getIDB = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve(null);
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
};

export const saveFileToIndexedDB = async (fileId, file) => {
  try {
    const db = await getIDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id: fileId, file, name: file.name, type: file.type, size: file.size, createdAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
};

export const getFileFromIndexedDB = async (fileId) => {
  try {
    const db = await getIDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(fileId);
      req.onsuccess = () => resolve(req.result ? req.result.file : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

/**
 * Lưu tệp lớn theo từng phân mảnh (chunks) lên Cloud Firestore để mọi thiết bị đều xem/tải được
 */
const saveFileChunksToFirestore = async (fileId, fileName, dataUrl) => {
  const total = Math.ceil(dataUrl.length / CHUNK_SIZE);
  const tasks = [];
  for (let i = 0; i < total; i++) {
    const slice = dataUrl.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    tasks.push(() =>
      setDoc(doc(db, CHUNK_COLLECTION, `${fileId}_${i}`), {
        fileId,
        fileName,
        index: i,
        total,
        data: slice,
        createdAt: serverTimestamp(),
      })
    );
  }
  for (let i = 0; i < tasks.length; i += 4) {
    await Promise.all(tasks.slice(i, i + 4).map(fn => fn()));
  }
  return `fs://${fileId}`;
};

/**
 * Tải lại tệp phân mảnh từ Cloud Firestore (có cache cục bộ vào IndexedDB để mở lại tức thì)
 */
const loadFileFromFirestoreChunks = async (fileId) => {
  // Kiểm tra cache cục bộ trước
  const cachedFile = await getFileFromIndexedDB(fileId);
  if (cachedFile) {
    return cachedFile;
  }

  // Tải từ Cloud Firestore
  const q = query(collection(db, CHUNK_COLLECTION), where('fileId', '==', fileId));
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const parts = snap.docs.map(d => d.data()).sort((a, b) => a.index - b.index);
  const expectedTotal = parts[0]?.total;
  if (expectedTotal && parts.length < expectedTotal) {
    return null;
  }

  const fullDataUrl = parts.map(p => p.data).join('');
  const blob = dataUrlToBlob(fullDataUrl);
  if (!blob) return null;

  // Lưu cache vào IndexedDB của thiết bị hiện tại
  const fileName = parts[0]?.fileName || 'tai_lieu';
  const fileObj = new File([blob], fileName, { type: blob.type || getMimeTypeFromFileName(fileName) });
  await saveFileToIndexedDB(fileId, fileObj);
  return fileObj;
};

/**
 * Xóa các phân mảnh đám mây khi xóa bản ghi
 */
export const deleteCloudFileChunks = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('fs://')) return;
  const fileId = fileUrl.replace('fs://', '');
  try {
    const q = query(collection(db, CHUNK_COLLECTION), where('fileId', '==', fileId));
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map(d => deleteDoc(doc(db, CHUNK_COLLECTION, d.id))));
  } catch (err) {
    console.warn('Không thể dọn dữ liệu phân mảnh tệp:', err);
  }
};

/**
 * Upload file an toàn & đồng bộ đám mây trên mọi thiết bị:
 * 1. Nếu là liên kết ngoài (Google Drive / Web Link): Lưu trực tiếp URL và tên hiển thị.
 * 2. Nếu là ảnh: Tự động nén WebP trước khi chuyển Base64.
 * 3. Nếu file nhỏ (<= ngưỡng Data URL): Lưu trực tiếp vào bản ghi Firestore.
 * 4. Nếu file vừa & lớn (<= 15MB): Tự động phân mảnh lưu lên Cloud Firestore (fs://) để mọi tài khoản & máy tính đều xem được.
 */
export const uploadFileSafely = async (pathPrefix, file, options = {}) => {
  const { maxDataUrlChars = 650 * 1024 } = options;
  if (!file) return { fileUrl: null, fileName: null };

  // Trường hợp 1: Người dùng dán link Google Drive hoặc link ngoài
  if (file.isLink || file.isExternalLink) {
    return {
      fileUrl: file.fileUrl || file.url,
      fileName: file.fileName || file.name || 'Tài liệu Google Drive',
    };
  }

  // Trường hợp truyền URL dạng chuỗi
  if (typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'))) {
    return {
      fileUrl: file,
      fileName: isGoogleDriveUrl(file) ? 'Tài liệu Google Drive' : 'Liên kết tài liệu',
    };
  }

  // Trường hợp 2: Tệp tải từ máy tính -> Tự động nén ảnh nếu là ảnh
  let processedFile = file;
  if (file.type && file.type.startsWith('image/')) {
    try {
      processedFile = await compressImageClient(file);
    } catch (e) {
      console.warn('Không thể nén ảnh client, dùng ảnh gốc:', e);
    }
  }

  if (processedFile.size > MAX_CLOUD_FILE_BYTES) {
    throw new Error('Tệp vượt quá 15MB. Vui lòng chuyển sang tab "Google Drive / Đám mây" để đính kèm tệp dung lượng lớn!');
  }

  const safePrefix = String(pathPrefix || 'file').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileId = `${safePrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Đọc file thành Data URL Base64
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Không thể đọc file'));
    reader.readAsDataURL(processedFile);
  });

  // Lưu bản sao cache vào IndexedDB nội bộ để người gửi mở lại tức thì
  await saveFileToIndexedDB(fileId, processedFile);

  // Nếu vừa trong ngưỡng lưu thẳng cùng document
  if (typeof dataUrl === 'string' && dataUrl.length <= maxDataUrlChars) {
    return {
      fileUrl: dataUrl,
      fileName: processedFile.name,
    };
  }

  // Ngược lại: Lưu phân mảnh lên Cloud Firestore để mọi tài khoản & thiết bị khác đều xem/tải được
  const cloudUrl = await saveFileChunksToFirestore(fileId, processedFile.name, dataUrl);
  return {
    fileUrl: cloudUrl,
    fileName: processedFile.name,
  };
};

/**
 * Tải file an toàn về máy tính cho người dùng
 * @returns {Promise<boolean>}
 */
export const downloadFileSafely = async (fileUrl, fileName) => {
  if (!fileUrl) return false;

  // Nếu là liên kết Google Drive -> Mở trang tải về của Drive
  if (isGoogleDriveUrl(fileUrl)) {
    window.open(getGoogleDriveDownloadUrl(fileUrl), '_blank');
    return true;
  }

  // Tệp lưu phân mảnh trên Cloud Firestore (fs://)
  if (fileUrl.startsWith('fs://')) {
    const fileId = fileUrl.replace('fs://', '');
    try {
      const file = await loadFileFromFirestoreChunks(fileId);
      if (file) {
        const blobUrl = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName || file.name || 'tai_ve';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        return true;
      }
    } catch (err) {
      console.error('Lỗi tải tệp từ đám mây:', err);
    }
    toast.error('Không tìm thấy dữ liệu tệp trên máy chủ đám mây.');
    return false;
  }

  // Tệp lưu cục bộ cũ (idb://)
  if (fileUrl.startsWith('idb://')) {
    const fileId = fileUrl.replace('idb://', '');
    const file = await getFileFromIndexedDB(fileId);
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName || file.name || 'tai_ve';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      return true;
    }
    toast.error('Tệp cũ này chỉ lưu ở máy người gửi. Hãy nhờ người gửi tải lại 1 lần để đồng bộ cho mọi người!');
    return false;
  }

  // Với link web hoặc Data URL Base64
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = fileName || 'tai_ve';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return true;
};

/**
 * Xác định MIME type từ tên file
 */
export const getMimeTypeFromFileName = (fileName = '') => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return 'application/pdf';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'svg': return 'image/svg+xml';
    case 'txt': return 'text/plain';
    case 'csv': return 'text/csv';
    case 'json': return 'application/json';
    case 'docx':
    case 'doc': return 'application/msword';
    case 'xlsx':
    case 'xls': return 'application/vnd.ms-excel';
    default: return 'application/octet-stream';
  }
};

/**
 * Chuyển đổi Data URL (Base64) sang Blob an toàn
 */
export const dataUrlToBlob = (dataUrl) => {
  try {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (err) {
    console.error('Error converting dataUrl to blob:', err);
    return null;
  }
};

/**
 * Trích xuất URL xem trực tiếp (Object URL hoặc Link gốc)
 */
export const resolveFileForPreview = async (fileUrl, fileName) => {
  if (!fileUrl) return null;

  try {
    // 1. Tệp Google Drive -> Trả về link Embed Preview (hoặc link Folder)
    if (isGoogleDriveUrl(fileUrl)) {
      if (isGoogleDriveFolderUrl(fileUrl)) {
        return {
          previewUrl: fileUrl,
          isBlob: false,
          isGoogleDriveFolder: true,
          mimeType: 'folder',
        };
      }
      return {
        previewUrl: getGoogleDrivePreviewUrl(fileUrl),
        isBlob: false,
        isGoogleDrive: true,
        mimeType: 'application/pdf',
      };
    }

    // 2. Tệp phân mảnh trên Cloud Firestore (fs://)
    if (fileUrl.startsWith('fs://')) {
      const fileId = fileUrl.replace('fs://', '');
      const file = await loadFileFromFirestoreChunks(fileId);
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        return {
          previewUrl: objectUrl,
          isBlob: true,
          mimeType: file.type || getMimeTypeFromFileName(fileName),
          size: file.size,
          file,
        };
      }
      return {
        error: 'Không tìm thấy dữ liệu tệp trên máy chủ đám mây.',
      };
    }

    // 3. Tệp lưu cục bộ cũ trong IndexedDB (idb://)
    if (fileUrl.startsWith('idb://')) {
      const fileId = fileUrl.replace('idb://', '');
      const file = await getFileFromIndexedDB(fileId);
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        return {
          previewUrl: objectUrl,
          isBlob: true,
          mimeType: file.type || getMimeTypeFromFileName(fileName),
          size: file.size,
          file,
        };
      }
      return {
        error: 'Tệp này được tải lên trước khi bật đồng bộ đám mây nên chỉ lưu ở thiết bị cũ. Người gửi vui lòng tải lại tệp này 1 lần để mọi tài khoản đều xem được.',
      };
    }

    // 3. Tệp lưu dạng Data URL Base64 (data:...)
    if (fileUrl.startsWith('data:')) {
      const blob = dataUrlToBlob(fileUrl);
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        return {
          previewUrl: objectUrl,
          isBlob: true,
          mimeType: blob.type || getMimeTypeFromFileName(fileName),
          size: blob.size,
          blob,
        };
      }
      return {
        previewUrl: fileUrl,
        isBlob: false,
        mimeType: getMimeTypeFromFileName(fileName),
      };
    }

    // 4. Link URL thông thường (http/https/blob)
    return {
      previewUrl: fileUrl,
      isBlob: false,
      mimeType: getMimeTypeFromFileName(fileName),
    };
  } catch (err) {
    console.error('Lỗi khi giải mã file preview:', err);
    return { error: 'Không thể tải tệp để xem trước: ' + err.message };
  }
};

/**
 * Mở trực tiếp tài liệu trong một Tab trình duyệt mới độc lập (Full screen)
 */
export const openFileInNewTab = async (fileUrl, fileName) => {
  if (!fileUrl) return;

  // Nếu là Google Drive hoặc link web thông thường -> Mở thẳng tab mới
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    window.open(fileUrl, '_blank');
    return;
  }

  // Mở tab trống trước ngay trong ngữ cảnh click của người dùng
  let newTab = null;
  try {
    newTab = window.open('about:blank', '_blank');
    if (newTab) {
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${fileName || 'Đang mở tài liệu...'}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #0f172a;
              color: #f8fafc;
            }
            .box { text-align: center; }
            .spinner {
              width: 36px;
              height: 36px;
              border: 3px solid rgba(255,255,255,0.2);
              border-top-color: #38bdf8;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
              margin: 0 auto 14px;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            .name { font-size: 14px; font-weight: 600; color: #38bdf8; margin-top: 6px; }
          </style>
        </head>
        <body>
          <div class="box">
            <div class="spinner"></div>
            <div>Đang tải tài liệu sang tab mới...</div>
            <div class="name">${fileName || ''}</div>
          </div>
        </body>
        </html>
      `);
    }
  } catch (e) {
    console.warn('Popup blocked:', e);
  }

  try {
    const res = await resolveFileForPreview(fileUrl, fileName);
    if (res && res.previewUrl) {
      if (newTab) {
        newTab.location.href = res.previewUrl;
      } else {
        window.open(res.previewUrl, '_blank');
      }
    } else {
      if (newTab) newTab.close();
      toast.error(res?.error || 'Không thể mở tài liệu này.');
    }
  } catch (err) {
    if (newTab) newTab.close();
    console.error('Lỗi khi mở tab mới:', err);
    toast.error('Lỗi khi mở tab mới: ' + err.message);
  }
};
