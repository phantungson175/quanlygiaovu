// src/services/expertService.js
// CRUD chuyên gia thỉnh giảng - Firebase Firestore + Storage
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDoc, getDocs, orderBy, query, serverTimestamp,
} from 'firebase/firestore';
import { uploadFileSafely, deleteCloudFileChunks } from './storageHelper';
import { db } from './firebase';
import { logAction } from './auditService';

const COL = 'experts';

export const getExperts = async () => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addExpert = async (data, contractFile, user) => {
  const { fileUrl: contractFileUrl, fileName: contractFileName } = 
    await uploadFileSafely('contracts', contractFile);

  const docRef = await addDoc(collection(db, COL), {
    ...data,
    contractFileUrl,
    contractFileName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await logAction({ action: 'add', module: 'Thỉnh giảng', detail: `Thêm chuyên gia: ${data.name}`, user });
  return docRef.id;
};

export const updateExpert = async (id, data, contractFile, user) => {
  let updateData = { ...data, updatedAt: serverTimestamp() };

  if (contractFile) {
    const { fileUrl, fileName } = await uploadFileSafely('contracts', contractFile);
    updateData.contractFileUrl = fileUrl;
    updateData.contractFileName = fileName;
  }

  await updateDoc(doc(db, COL, id), updateData);
  await logAction({ action: 'edit', module: 'Thỉnh giảng', detail: `Sửa chuyên gia: ${data.name}`, user });
};

export const deleteExpert = async (id, name, user) => {
  try {
    const snap = await getDoc(doc(db, COL, id));
    if (snap.exists()) await deleteCloudFileChunks(snap.data().contractFileUrl);
  } catch {}
  await deleteDoc(doc(db, COL, id));
  await logAction({ action: 'delete', module: 'Thỉnh giảng', detail: `Xóa: ${name}`, user });
};
