// src/services/teachingService.js
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDoc, getDocs, orderBy, query, serverTimestamp,
} from 'firebase/firestore';
import { uploadFileSafely, deleteCloudFileChunks } from './storageHelper';
import { db } from './firebase';
import { logAction } from './auditService';

const COL_NORM = 'teaching_norm';
const COL_CONTRACT = 'teaching_contract';

// Tải nhiều tệp đính kèm với tổng ngưỡng an toàn cho 1 tài liệu Firestore
const uploadMultipleAttachmentsSafely = async (pathPrefix, files = []) => {
  const attachments = [];
  let remainingBudgetChars = 650 * 1024;
  for (const file of files) {
    const { fileUrl, fileName } = await uploadFileSafely(pathPrefix, file, {
      maxDataUrlChars: Math.max(0, remainingBudgetChars),
    });
    if (fileUrl) {
      if (fileUrl.startsWith('data:')) {
        remainingBudgetChars -= fileUrl.length;
      }
      attachments.push({ name: fileName, url: fileUrl });
    }
  }
  return attachments;
};

const cleanupTeachingAttachments = async (colName, id) => {
  try {
    const snap = await getDoc(doc(db, colName, id));
    if (snap.exists() && Array.isArray(snap.data().attachments)) {
      await Promise.all(snap.data().attachments.map(a => deleteCloudFileChunks(a?.url)));
    }
  } catch {}
};

// ---- ĐỊNH MỨC ----
export const getTeachingNorms = async () => {
  const q = query(collection(db, COL_NORM), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addTeachingNorm = async (data, files, user) => {
  const attachments = await uploadMultipleAttachmentsSafely('teaching/norm', files);

  const docRef = await addDoc(collection(db, COL_NORM), {
    ...data, attachments, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  await logAction({ action: 'add', module: 'KLGD Định mức', detail: `Thêm: ${data.lecturerName}`, user });
  return docRef.id;
};

export const updateTeachingNorm = async (id, data, user) => {
  await updateDoc(doc(db, COL_NORM, id), { ...data, updatedAt: serverTimestamp() });
  await logAction({ action: 'edit', module: 'KLGD Định mức', detail: `Sửa: ${data.lecturerName}`, user });
};

export const deleteTeachingNorm = async (id, name, user) => {
  await cleanupTeachingAttachments(COL_NORM, id);
  await deleteDoc(doc(db, COL_NORM, id));
  await logAction({ action: 'delete', module: 'KLGD Định mức', detail: `Xóa: ${name}`, user });
};

// ---- HỢP ĐỒNG ----
export const getTeachingContracts = async () => {
  const q = query(collection(db, COL_CONTRACT), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addTeachingContract = async (data, files, user) => {
  const attachments = await uploadMultipleAttachmentsSafely('teaching/contract', files);

  const docRef = await addDoc(collection(db, COL_CONTRACT), {
    ...data, attachments, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  await logAction({ action: 'add', module: 'KLGD Hợp đồng', detail: `Thêm: ${data.lecturerName}`, user });
  return docRef.id;
};

export const deleteTeachingContract = async (id, name, user) => {
  await cleanupTeachingAttachments(COL_CONTRACT, id);
  await deleteDoc(doc(db, COL_CONTRACT, id));
  await logAction({ action: 'delete', module: 'KLGD Hợp đồng', detail: `Xóa: ${name}`, user });
};
