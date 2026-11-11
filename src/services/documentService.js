// src/services/documentService.js
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDoc, getDocs, orderBy, query, serverTimestamp,
} from 'firebase/firestore';
import { uploadFileSafely, deleteCloudFileChunks } from './storageHelper';
import { db } from './firebase';
import { logAction } from './auditService';

const COL_IN = 'docs_incoming';
const COL_OUT = 'docs_outgoing';

const updateDocRecord = async (colName, moduleLabel, storagePath, id, data, newFile, removeFile, user) => {
  const updateData = { ...data, updatedAt: serverTimestamp() };
  if (newFile || removeFile) {
    try {
      const snap = await getDoc(doc(db, colName, id));
      if (snap.exists()) await deleteCloudFileChunks(snap.data().fileUrl);
    } catch {}
  }
  if (newFile) {
    const { fileUrl, fileName } = await uploadFileSafely(storagePath, newFile);
    updateData.fileUrl = fileUrl;
    updateData.fileName = fileName;
  } else if (removeFile) {
    updateData.fileUrl = null;
    updateData.fileName = null;
  }
  await updateDoc(doc(db, colName, id), updateData);
  await logAction({ action: 'edit', module: moduleLabel, detail: `Sửa: ${data.refNo}`, user });
};

// ---- VĂN BẢN ĐẾN ----
export const getIncomingDocs = async () => {
  const q = query(collection(db, COL_IN), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addIncomingDoc = async (data, file, user) => {
  const { fileUrl, fileName } = await uploadFileSafely('documents/incoming', file);
  const docRef = await addDoc(collection(db, COL_IN), {
    ...data, fileUrl, fileName,
    status: 'Chưa xử lý',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await logAction({ action: 'add', module: 'Văn bản đến', detail: `Thêm: ${data.refNo}`, user });
  return docRef.id;
};

export const updateIncomingDoc = async (id, data, newFile, removeFile, user) => {
  await updateDocRecord(COL_IN, 'Văn bản đến', 'documents/incoming', id, data, newFile, removeFile, user);
};

export const updateIncomingDocStatus = async (id, status, user) => {
  await updateDoc(doc(db, COL_IN, id), { status, updatedAt: serverTimestamp() });
  await logAction({ action: 'edit', module: 'Văn bản đến', detail: `Cập nhật trạng thái: ${status}`, user });
};

export const deleteIncomingDoc = async (id, refNo, user) => {
  try {
    const snap = await getDoc(doc(db, COL_IN, id));
    if (snap.exists()) await deleteCloudFileChunks(snap.data().fileUrl);
  } catch {}
  await deleteDoc(doc(db, COL_IN, id));
  await logAction({ action: 'delete', module: 'Văn bản đến', detail: `Xóa: ${refNo}`, user });
};

// ---- VĂN BẢN ĐI ----
export const getOutgoingDocs = async () => {
  const q = query(collection(db, COL_OUT), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addOutgoingDoc = async (data, file, user) => {
  const { fileUrl, fileName } = await uploadFileSafely('documents/outgoing', file);
  const docRef = await addDoc(collection(db, COL_OUT), {
    ...data, fileUrl, fileName,
    status: 'Đã gửi',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await logAction({ action: 'add', module: 'Văn bản đi', detail: `Thêm: ${data.refNo}`, user });
  return docRef.id;
};

export const updateOutgoingDoc = async (id, data, newFile, removeFile, user) => {
  await updateDocRecord(COL_OUT, 'Văn bản đi', 'documents/outgoing', id, data, newFile, removeFile, user);
};

export const updateOutgoingDocStatus = async (id, status, user) => {
  await updateDoc(doc(db, COL_OUT, id), { status, updatedAt: serverTimestamp() });
  await logAction({ action: 'edit', module: 'Văn bản đi', detail: `Cập nhật trạng thái: ${status}`, user });
};

export const deleteOutgoingDoc = async (id, refNo, user) => {
  try {
    const snap = await getDoc(doc(db, COL_OUT, id));
    if (snap.exists()) await deleteCloudFileChunks(snap.data().fileUrl);
  } catch {}
  await deleteDoc(doc(db, COL_OUT, id));
  await logAction({ action: 'delete', module: 'Văn bản đi', detail: `Xóa: ${refNo}`, user });
};
