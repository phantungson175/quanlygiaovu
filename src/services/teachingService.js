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
const uploadMultipleAttachmentsSafely = async (pathPrefix, files = [], initialUsedChars = 0) => {
  const attachments = [];
  let remainingBudgetChars = Math.max(0, 650 * 1024 - initialUsedChars);
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

const updateTeachingRecord = async (
  colName, moduleLabel, pathPrefix,
  id, data, existingAttachments = [], newFiles = [], removedAttachments = [], user
) => {
  const usedChars = existingAttachments.reduce(
    (sum, a) => sum + (a?.url?.startsWith('data:') ? a.url.length : 0),
    0
  );
  const addedAttachments = await uploadMultipleAttachmentsSafely(pathPrefix, newFiles, usedChars);
  if (removedAttachments.length > 0) {
    await Promise.all(removedAttachments.map(a => deleteCloudFileChunks(a?.url)));
  }
  const attachments = [...existingAttachments, ...addedAttachments];
  await updateDoc(doc(db, colName, id), {
    ...data,
    attachments,
    updatedAt: serverTimestamp(),
  });
  await logAction({ action: 'edit', module: moduleLabel, detail: `Sửa: ${data.lecturerName}`, user });
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

export const updateTeachingNorm = async (id, data, existingAttachments, newFiles, removedAttachments, user) => {
  await updateTeachingRecord(
    COL_NORM, 'KLGD Định mức', 'teaching/norm',
    id, data, existingAttachments, newFiles, removedAttachments, user
  );
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

export const updateTeachingContract = async (id, data, existingAttachments, newFiles, removedAttachments, user) => {
  await updateTeachingRecord(
    COL_CONTRACT, 'KLGD Hợp đồng', 'teaching/contract',
    id, data, existingAttachments, newFiles, removedAttachments, user
  );
};

export const deleteTeachingContract = async (id, name, user) => {
  await cleanupTeachingAttachments(COL_CONTRACT, id);
  await deleteDoc(doc(db, COL_CONTRACT, id));
  await logAction({ action: 'delete', module: 'KLGD Hợp đồng', detail: `Xóa: ${name}`, user });
};
