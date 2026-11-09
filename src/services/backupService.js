// src/services/backupService.js
// Dịch vụ Sao lưu (Export JSON) & Phục hồi (Restore) toàn bộ cơ sở dữ liệu hệ thống
import {
  collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { logAction } from './auditService';

export const BACKUP_COLLECTIONS = [
  { key: 'assets', label: 'Tài sản Giáo cụ' },
  { key: 'experts', label: 'Chuyên gia Thỉnh giảng' },
  { key: 'docs_incoming', label: 'Văn bản Đến' },
  { key: 'docs_outgoing', label: 'Văn bản Đi' },
  { key: 'teaching_norm', label: 'Định mức Giảng dạy' },
  { key: 'teaching_contract', label: 'Hợp đồng Giảng dạy' },
  { key: 'scores', label: 'File Điểm Đại học' },
  { key: 'folders', label: 'Cây Thư mục & Năm' },
  { key: 'users', label: 'Tài khoản & Phân quyền' },
  { key: 'audit_logs', label: 'Nhật ký Hoạt động' },
];

/**
 * Lấy số lượng bản ghi của tất cả collection
 */
export const getSystemDataStats = async () => {
  const stats = {};
  await Promise.all(
    BACKUP_COLLECTIONS.map(async ({ key }) => {
      try {
        const snap = await getDocs(collection(db, key));
        stats[key] = snap.size;
      } catch (err) {
        console.warn(`Lỗi lấy stats collection ${key}:`, err);
        stats[key] = 0;
      }
    })
  );
  return stats;
};

/**
 * Tạo và tải về file sao lưu toàn bộ hệ thống
 */
export const exportFullBackup = async (user) => {
  const backupPayload = {
    app: 'quanlygiaovu2026',
    systemName: 'Hệ thống Quản lý Giáo vụ 2026',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    exportedBy: {
      uid: user?.uid || 'unknown',
      email: user?.email || '',
      displayName: user?.displayName || '',
    },
    stats: {},
    collections: {},
  };

  for (const { key } of BACKUP_COLLECTIONS) {
    try {
      const snap = await getDocs(collection(db, key));
      backupPayload.stats[key] = snap.size;
      backupPayload.collections[key] = snap.docs.map(docSnap => ({
        _id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (err) {
      console.error(`Lỗi sao lưu collection ${key}:`, err);
      backupPayload.stats[key] = 0;
      backupPayload.collections[key] = [];
    }
  }

  // Tải file JSON về máy tính
  const jsonStr = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `backup_quanlygiaovu_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);

  // Ghi nhật ký
  await logAction({
    action: 'backup',
    module: 'Sao lưu hệ thống',
    detail: `Xuất tệp sao lưu dữ liệu toàn hệ thống (${Object.values(backupPayload.stats).reduce((a, b) => a + b, 0)} bản ghi)`,
    user,
  });

  return backupPayload;
};

/**
 * Phục hồi dữ liệu từ file backup JSON
 * @param {Object} backupData - Dữ liệu JSON đã parse
 * @param {string} mode - 'merge' (giữ cũ, thêm/ghi đè) hoặc 'clean' (xóa sạch làm mới)
 * @param {Function} onProgress - Callback tiến độ (percent, message)
 */
export const restoreFromBackup = async (backupData, mode = 'merge', onProgress = () => {}) => {
  if (!backupData || !backupData.collections) {
    throw new Error('Dữ liệu sao lưu không đúng định dạng!');
  }

  const collectionsToRestore = Object.keys(backupData.collections);
  const totalCollections = collectionsToRestore.length;
  let currentStep = 0;

  for (const colKey of collectionsToRestore) {
    currentStep++;
    const percent = Math.round((currentStep / totalCollections) * 100);
    const docs = backupData.collections[colKey] || [];

    onProgress(percent, `Đang xử lý phân hệ: ${colKey} (${docs.length} bản ghi)...`);

    // Nếu chọn chế độ 'clean': xóa dữ liệu hiện tại trước
    if (mode === 'clean') {
      try {
        const snap = await getDocs(collection(db, colKey));
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db, colKey, d.id))));
      } catch (err) {
        console.warn(`Không thể xóa dữ liệu cũ collection ${colKey}:`, err);
      }
    }

    // Nạp lại từng document
    for (const item of docs) {
      const docId = item._id;
      const dataToSave = { ...item };
      delete dataToSave._id;

      // Xử lý các trường thời gian
      if (!dataToSave.updatedAt) {
        dataToSave.updatedAt = serverTimestamp();
      }

      if (docId) {
        await setDoc(doc(db, colKey, docId), dataToSave, { merge: true });
      }
    }
  }

  onProgress(100, 'Phục hồi toàn bộ dữ liệu thành công!');
};
