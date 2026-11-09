// src/services/folderService.js
// Quản lý Thư mục tự tạo linh hoạt theo năm và hỗ trợ phân cấp đa tầng (Nested Subfolders)
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { logAction } from './auditService';

const COL = 'custom_folders';

/**
 * Lấy danh sách thư mục theo phân hệ (module), năm và thư mục cha (parentId)
 */
export const getFolders = async (module, year, parentId = null) => {
  try {
    const q = query(
      collection(db, COL),
      where('module', '==', module),
      where('year', '==', String(year))
    );
    const snap = await getDocs(q);
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Lọc chính xác theo parentId
    const filtered = all.filter(d => {
      if (parentId) {
        return d.parentId === parentId;
      }
      return !d.parentId; // null, undefined hoặc rỗng
    });

    // Sắp xếp theo thời gian tạo
    filtered.sort((a, b) => {
      const ta = a.createdAt?.seconds || 0;
      const tb = b.createdAt?.seconds || 0;
      return ta - tb;
    });

    return filtered;
  } catch (e) {
    console.error('Lỗi lấy danh sách thư mục:', e);
    return [];
  }
};

/**
 * Tạo thư mục mới do người dùng đặt tên
 */
export const createFolder = async ({ name, module, year, parentId = null, user }) => {
  if (!name || !name.trim()) throw new Error('Tên thư mục không được để trống!');
  const trimmed = name.trim();

  const docRef = await addDoc(collection(db, COL), {
    name: trimmed,
    module,
    year: String(year),
    parentId: parentId || null,
    createdAt: serverTimestamp(),
    createdBy: user?.displayName || user?.email || 'Người dùng',
  });

  const moduleNameMap = {
    scores: 'Điểm',
    docs_incoming: 'Văn bản đến',
    docs_outgoing: 'Văn bản đi',
    assets: 'Tài sản',
    experts: 'Chuyên gia',
    teaching_norm: 'Định mức giảng dạy',
    teaching_contract: 'Hợp đồng giảng dạy',
  };

  await logAction({
    action: 'create',
    module: moduleNameMap[module] || 'Hệ thống',
    detail: `Tạo thư mục mới: "${trimmed}" (Năm: ${year}${parentId ? ', Thư mục con' : ''})`,
    user,
  });

  return { id: docRef.id, name: trimmed, module, year: String(year), parentId };
};

/**
 * Đổi tên thư mục
 */
export const renameFolder = async (folderId, newName, user, module = 'scores') => {
  if (!newName || !newName.trim()) throw new Error('Tên thư mục không được để trống!');
  const trimmed = newName.trim();

  await updateDoc(doc(db, COL, folderId), {
    name: trimmed,
    updatedAt: serverTimestamp(),
  });

  await logAction({
    action: 'update',
    module: 'Thư mục',
    detail: `Đổi tên thư mục thành: "${trimmed}"`,
    user,
  });
};

/**
 * Xóa thư mục
 */
export const deleteFolder = async (folderId, folderName, user, module = 'scores') => {
  await deleteDoc(doc(db, COL, folderId));

  await logAction({
    action: 'delete',
    module: 'Thư mục',
    detail: `Xóa thư mục: "${folderName}"`,
    user,
  });
};
