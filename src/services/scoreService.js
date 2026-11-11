// src/services/scoreService.js
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDoc, getDocs, orderBy, query, serverTimestamp,
} from 'firebase/firestore';
import { uploadFileSafely, deleteCloudFileChunks } from './storageHelper';
import { db } from './firebase';
import { logAction } from './auditService';

const COL = 'scores';

export const getScores = async () => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const uploadScore = async (file, subjectName, tag, user, academicYear, folderId = null, folderName = '') => {
  const { fileUrl, fileName: uploadedFileName } = await uploadFileSafely('scores', file);
  const curY = new Date().getFullYear();
  const defYear = `${curY - 1}-${curY}`;

  const finalFileName = uploadedFileName || file.fileName || file.name || 'Tài liệu bảng điểm';
  const finalSize = file.size || 0;
  const finalType = finalFileName.includes('.') ? finalFileName.split('.').pop().toLowerCase() : 'gdrive';

  const docRef = await addDoc(collection(db, COL), {
    fileName: finalFileName,
    fileUrl,
    fileSize: finalSize,
    fileType: finalType,
    subjectName,
    tag: tag || folderName || 'Chung',
    academicYear: academicYear || defYear,
    folderId: folderId || null,
    folderName: folderName || '',
    createdAt: serverTimestamp(),
  });

  await logAction({
    action: 'upload',
    module: 'Điểm',
    detail: `Upload: ${finalFileName} (Năm: ${academicYear || defYear}${folderName ? `, Thư mục: ${folderName}` : ''})`,
    user,
  });
  return docRef.id;
};

export const updateScore = async (id, { subjectName, academicYear, newFile }, user) => {
  const updateData = {
    subjectName,
    academicYear,
    updatedAt: serverTimestamp(),
  };

  if (newFile) {
    try {
      const snap = await getDoc(doc(db, COL, id));
      if (snap.exists()) await deleteCloudFileChunks(snap.data().fileUrl);
    } catch {}
    const { fileUrl, fileName: uploadedFileName } = await uploadFileSafely('scores', newFile);
    const finalFileName = uploadedFileName || newFile.fileName || newFile.name || 'Tài liệu bảng điểm';
    const finalSize = newFile.size || 0;
    const finalType = finalFileName.includes('.') ? finalFileName.split('.').pop().toLowerCase() : 'gdrive';
    updateData.fileName = finalFileName;
    updateData.fileUrl = fileUrl;
    updateData.fileSize = finalSize;
    updateData.fileType = finalType;
  }

  await updateDoc(doc(db, COL, id), updateData);
  await logAction({
    action: 'edit',
    module: 'Điểm',
    detail: `Sửa hồ sơ điểm: ${subjectName} (Năm: ${academicYear})`,
    user,
  });
};

export const deleteScore = async (id, fileName, user) => {
  try {
    const snap = await getDoc(doc(db, COL, id));
    if (snap.exists()) await deleteCloudFileChunks(snap.data().fileUrl);
  } catch {}
  await deleteDoc(doc(db, COL, id));
  await logAction({ action: 'delete', module: 'Điểm', detail: `Xóa: ${fileName}`, user });
};
