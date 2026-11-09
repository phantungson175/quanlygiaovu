// src/services/assetService.js
// CRUD tài sản - Firebase Firestore
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, orderBy, query, serverTimestamp,
} from 'firebase/firestore';
import { uploadFileSafely } from './storageHelper';
import { db } from './firebase';
import { logAction } from './auditService';

const COL = 'assets';

export const getAssets = async () => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addAsset = async (data, file, user) => {
  let fileUrl = null;
  let fileName = null;
  if (file) {
    const res = await uploadFileSafely('assets', file);
    fileUrl = res.fileUrl;
    fileName = res.fileName;
  }
  const docRef = await addDoc(collection(db, COL), {
    ...data,
    fileUrl,
    fileName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await logAction({ action: 'add', module: 'Tài sản', detail: `Thêm: ${data.name}`, user });
  return docRef.id;
};

export const updateAsset = async (id, data, file, user) => {
  let updateData = { ...data, updatedAt: serverTimestamp() };
  if (file) {
    const res = await uploadFileSafely('assets', file);
    updateData.fileUrl = res.fileUrl;
    updateData.fileName = res.fileName;
  }
  await updateDoc(doc(db, COL, id), updateData);
  await logAction({ action: 'edit', module: 'Tài sản', detail: `Sửa: ${data.name}`, user });
};

export const deleteAsset = async (id, name, user) => {
  await deleteDoc(doc(db, COL, id));
  await logAction({ action: 'delete', module: 'Tài sản', detail: `Xóa: ${name}`, user });
};
