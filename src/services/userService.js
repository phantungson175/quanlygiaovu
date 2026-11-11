import {
  collection, doc, getDocs, updateDoc, deleteDoc,
  serverTimestamp, setDoc
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';
import { logAction } from './auditService';

const COL = 'users';

/**
 * Tự động sinh mã cán bộ duy nhất theo định dạng CB-YYYY-XXX (CB-2026-001)
 */
export const generateNextStaffId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `CB-${currentYear}-`;
  try {
    const snap = await getDocs(collection(db, COL));
    let maxNum = 0;
    snap.docs.forEach(d => {
      const sId = d.data()?.staffId;
      if (sId && typeof sId === 'string') {
        if (sId.startsWith(prefix)) {
          const num = parseInt(sId.replace(prefix, ''), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        } else if (sId.startsWith('CB-')) {
          const parts = sId.split('-');
          const last = parseInt(parts[parts.length - 1], 10);
          if (!isNaN(last) && last > maxNum) maxNum = last;
        }
      }
    });
    return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
  } catch (err) {
    console.warn('Lỗi sinh mã CB:', err);
    return `${prefix}${Math.floor(100 + Math.random() * 900)}`;
  }
};

/**
 * Tự động rà soát và cấp mã CB cho những tài khoản chưa có
 */
export const ensureAllUsersHaveStaffId = async () => {
  try {
    const snap = await getDocs(collection(db, COL));
    const currentYear = new Date().getFullYear();
    const prefix = `CB-${currentYear}-`;

    let maxNum = 0;
    const missing = [];

    // Lấy số lớn nhất đã được cấp
    snap.docs.forEach(d => {
      const sId = d.data()?.staffId;
      if (sId && typeof sId === 'string' && sId.startsWith(prefix)) {
        const num = parseInt(sId.replace(prefix, ''), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      } else if (!sId) {
        missing.push({ id: d.id, ...d.data() });
      }
    });

    // Cấp mã tuần tự cho các user chưa có
    for (const u of missing) {
      maxNum += 1;
      const newId = `${prefix}${String(maxNum).padStart(3, '0')}`;
      await setDoc(doc(db, COL, u.id), {
        staffId: newId,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Lỗi kiểm tra mã cán bộ tự động:', err);
  }
};

/**
 * Lấy danh sách toàn bộ tài khoản người dùng (tự động cấp mã CB nếu thiếu)
 */
export const getAllUsers = async () => {
  try {
    let snap = await getDocs(collection(db, COL));
    const hasMissing = snap.docs.some(d => !d.data()?.staffId);
    if (hasMissing) {
      await ensureAllUsersHaveStaffId();
      snap = await getDocs(collection(db, COL));
    }
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (err) {
    console.error('Lỗi lấy danh sách tài khoản:', err);
    throw err;
  }
};

/**
 * Cập nhật vai trò người dùng (Quản trị viên <-> Cán bộ Giáo vụ)
 */
export const updateUserRole = async (uid, newRole, adminUser) => {
  try {
    const userRef = doc(db, COL, uid);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: serverTimestamp(),
    });

    await logAction({
      action: 'update_role',
      module: 'Quản trị Tài khoản',
      detail: `Đổi vai trò UID ${uid} thành ${newRole}`,
      user: adminUser,
    });
  } catch (err) {
    console.error('Lỗi cập nhật vai trò:', err);
    throw err;
  }
};

/**
 * Khóa hoặc Mở khóa tài khoản
 */
export const toggleUserStatus = async (uid, currentStatus, adminUser) => {
  try {
    const nextStatus = currentStatus === 'locked' ? 'active' : 'locked';
    const userRef = doc(db, COL, uid);
    await updateDoc(userRef, {
      status: nextStatus,
      updatedAt: serverTimestamp(),
    });

    await logAction({
      action: nextStatus === 'locked' ? 'lock_account' : 'unlock_account',
      module: 'Quản trị Tài khoản',
      detail: `${nextStatus === 'locked' ? 'Khóa' : 'Mở khóa'} tài khoản UID: ${uid}`,
      user: adminUser,
    });
    return nextStatus;
  } catch (err) {
    console.error('Lỗi thay đổi trạng thái tài khoản:', err);
    throw err;
  }
};

/**
 * Cấp hoặc thu hồi quyền đồng bộ văn bản từ Gmail (gắn nhãn VanBanDen) cho tài khoản
 */
export const toggleUserGmailSync = async (uid, currentEnabled, adminUser) => {
  try {
    const nextEnabled = !currentEnabled;
    const userRef = doc(db, COL, uid);
    await updateDoc(userRef, {
      canSyncGmail: nextEnabled,
      updatedAt: serverTimestamp(),
    });

    await logAction({
      action: nextEnabled ? 'grant_gmail_sync' : 'revoke_gmail_sync',
      module: 'Quản trị Tài khoản',
      detail: `${nextEnabled ? 'Cấp' : 'Thu hồi'} quyền đồng bộ Gmail cho UID: ${uid}`,
      user: adminUser,
    });
    return nextEnabled;
  } catch (err) {
    console.error('Lỗi thay đổi quyền đồng bộ Gmail:', err);
    throw err;
  }
};

/**
 * Xóa tài khoản khỏi Firestore
 */
export const deleteUserDoc = async (uid, displayName, adminUser) => {
  try {
    await deleteDoc(doc(db, COL, uid));
    await logAction({
      action: 'delete_account',
      module: 'Quản trị Tài khoản',
      detail: `Xóa tài khoản người dùng: ${displayName || uid}`,
      user: adminUser,
    });
  } catch (err) {
    console.error('Lỗi xóa tài khoản:', err);
    throw err;
  }
};

/**
 * Quản trị viên cập nhật thông tin cá nhân của người dùng (Mã CB, SĐT, Phòng ban, Họ tên, Vai trò, Trạng thái)
 */
export const updateUserProfileData = async (uid, data, adminUser) => {
  try {
    const userRef = doc(db, COL, uid);
    const payload = {
      displayName: (data.displayName || '').trim(),
      staffId: (data.staffId || '').trim(),
      phone: (data.phone || '').trim(),
      department: (data.department || '').trim(),
      updatedAt: serverTimestamp(),
    };
    if (data.role) payload.role = data.role;
    if (data.status) payload.status = data.status;
    if (typeof data.canSyncGmail === 'boolean') payload.canSyncGmail = data.canSyncGmail;

    await setDoc(userRef, payload, { merge: true });

    await logAction({
      action: 'update_user_info',
      module: 'Quản trị Tài khoản',
      detail: `Cập nhật thông tin cán bộ: ${data.displayName || uid} (Mã CB: ${data.staffId || '—'}, SĐT: ${data.phone || '—'})`,
      user: adminUser,
    });
  } catch (err) {
    console.error('Lỗi cập nhật thông tin người dùng:', err);
    throw err;
  }
};

/**
 * Người dùng tự cập nhật hồ sơ cá nhân của chính mình (Họ tên, Mã CB, SĐT, Đơn vị)
 */
export const updateMyProfile = async (uid, data) => {
  try {
    const userRef = doc(db, COL, uid);
    const snap = await getDocs(collection(db, COL));
    const currentDoc = snap.docs.find(d => d.id === uid)?.data();

    // Giữ nguyên mã cán bộ đã cấp, hoặc tự sinh nếu chưa có
    let staffId = currentDoc?.staffId;
    if (!staffId) {
      staffId = (data.staffId && data.staffId.trim()) || await generateNextStaffId();
    }

    const payload = {
      displayName: (data.displayName || '').trim(),
      staffId,
      phone: (data.phone || '').trim(),
      department: (data.department || '').trim(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, payload, { merge: true });

    // Đồng bộ displayName vào Firebase Auth nếu có
    if (auth.currentUser && payload.displayName && auth.currentUser.displayName !== payload.displayName) {
      await updateProfile(auth.currentUser, { displayName: payload.displayName });
    }

    await logAction({
      action: 'update_self_profile',
      module: 'Hồ sơ Cá nhân',
      detail: `Người dùng tự cập nhật thông tin cá nhân (Mã CB: ${data.staffId || '—'}, SĐT: ${data.phone || '—'})`,
      user: { uid, displayName: payload.displayName, email: auth.currentUser?.email },
    });
  } catch (err) {
    console.error('Lỗi cập nhật hồ sơ cá nhân:', err);
    throw err;
  }
};

