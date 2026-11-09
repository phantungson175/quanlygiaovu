// src/services/auditService.js
// Nhật ký hoạt động - ghi lại mọi thao tác thêm/sửa/xóa/upload
import {
  collection, addDoc, getDocs,
  orderBy, query, limit, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COL = 'audit_logs';

/**
 * Ghi log hoạt động
 * @param {Object} params
 * @param {string} params.action - 'add' | 'edit' | 'delete' | 'upload' | 'login' | 'logout'
 * @param {string} params.module - Tên module
 * @param {string} params.detail - Mô tả chi tiết
 * @param {Object} params.user - Firebase user object
 */
export const logAction = async ({ action, module, detail, user }) => {
  try {
    await addDoc(collection(db, COL), {
      action,
      module,
      detail,
      userEmail: user?.email || 'Ẩn danh',
      userName: user?.displayName || user?.email || 'Ẩn danh',
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    // Không throw lỗi để không ảnh hưởng đến thao tác chính
    console.warn('Audit log error:', e);
  }
};

/**
 * Lấy nhật ký hoạt động (mới nhất)
 */
export const getAuditLogs = async (limitCount = 100) => {
  const q = query(
    collection(db, COL),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addAuditLog = logAction;
