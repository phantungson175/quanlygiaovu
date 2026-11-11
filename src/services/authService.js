// src/services/authService.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  EmailAuthProvider,
  linkWithCredential,
  updatePassword,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from 'firebase/auth';
import {
  doc, setDoc, getDoc, getDocs, collection, serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { generateNextStaffId } from './userService';

const assertUserNotLocked = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists() && snap.data().status === 'locked') {
      await signOut(auth);
      throw new Error('Tài khoản của bạn đã bị khóa bởi Quản trị viên. Vui lòng liên hệ phòng Giáo vụ!');
    }
  } catch (err) {
    if (err.message && err.message.includes('bị khóa')) throw err;
  }
};

/**
 * Đăng nhập bằng Email & Password
 */
export const loginWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await assertUserNotLocked(result.user.uid);
  return result.user;
};

/**
 * Đăng ký tài khoản mới bằng Email & Password
 * Có lưu thông tin cán bộ giáo vụ và gửi email xác minh
 */
export const registerWithEmail = async (email, password, displayName, extraData = {}) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Cập nhật tên hiển thị
  await updateProfile(result.user, { displayName });

  // Gửi email xác thực đến địa chỉ người dùng vừa đăng ký
  try {
    await sendEmailVerification(result.user);
  } catch (err) {
    console.warn('Lỗi gửi email xác thực:', err);
  }

  // Tự động phân quyền: Nếu là tài khoản đầu tiên trong hệ thống, cấp quyền Quản trị viên
  let role = 'Cán bộ';
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (snap.empty) {
      role = 'Quản trị viên';
    }
  } catch (e) {
    console.warn('Lỗi kiểm tra số lượng users:', e);
  }

  // Tự động cấp mã cán bộ duy nhất (CB-YYYY-XXX)
  let staffId = extraData.staffId;
  if (!staffId) {
    staffId = await generateNextStaffId();
  }

  // Lưu hồ sơ cán bộ giáo vụ vào Firestore
  try {
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email,
      displayName,
      staffId,
      department: extraData.department || 'Phòng Quản lý Đào tạo',
      phone: extraData.phone || '',
      role,
      status: 'active',
      canSyncGmail: role === 'Quản trị viên',
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Lỗi lưu hồ sơ user vào Firestore:', err);
  }

  return result.user;
};

/**
 * Gửi lại email xác thực
 */
export const resendVerificationEmail = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};

/**
 * Reload lại thông tin user để cập nhật trạng thái emailVerified
 */
export const reloadUser = async () => {
  if (auth.currentUser) {
    await auth.currentUser.reload();
    return auth.currentUser;
  }
  return null;
};

/**
 * Lấy thông tin chi tiết hồ sơ cán bộ từ Firestore (tự động cấp mã CB nếu thiếu)
 */
export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      let data = snap.data();

      // Nếu user chưa có Mã Cán bộ, tự động cấp mã duy nhất
      if (!data.staffId) {
        const autoStaffId = await generateNextStaffId();
        await setDoc(userRef, { staffId: autoStaffId }, { merge: true });
        data = { ...data, staffId: autoStaffId };
      }

      // Nếu chưa có Quản trị viên nào trong toàn hệ thống, tự động nâng tài khoản hiện tại lên Quản trị viên
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const hasAdmin = usersSnap.docs.some(d => d.data().role === 'Quản trị viên' || d.data().role === 'admin');
        if (!hasAdmin) {
          await setDoc(userRef, { role: 'Quản trị viên' }, { merge: true });
          return { ...data, role: 'Quản trị viên' };
        }
      } catch {}
      return data;
    } else if (auth.currentUser) {
      // Nếu chưa có bản ghi Firestore (do user login Google hoặc tài khoản cũ)
      let role = 'Cán bộ';
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        if (usersSnap.empty || !usersSnap.docs.some(d => d.data().role === 'Quản trị viên' || d.data().role === 'admin')) {
          role = 'Quản trị viên';
        }
      } catch {}
      const autoStaffId = await generateNextStaffId();
      const newProfile = {
        uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName || auth.currentUser.email,
        staffId: autoStaffId,
        department: 'Phòng Quản lý Đào tạo',
        phone: '',
        role,
        status: 'active',
        canSyncGmail: role === 'Quản trị viên',
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (err) {
    console.warn('Lỗi lấy profile:', err);
  }
  return null;
};

/**
 * Đăng nhập bằng tài khoản Google (Gmail)
 * Luôn bắt buộc hiển thị màn hình cho người dùng tự gõ/chọn tài khoản Google
 */
export const loginWithGoogle = async () => {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });
  const result = await signInWithPopup(auth, googleProvider);
  await assertUserNotLocked(result.user.uid);
  return result.user;
};

/**
 * Kiểm tra các phương thức đăng nhập đang gắn với tài khoản hiện tại
 */
export const getAccountAuthInfo = (u = auth.currentUser) => {
  const providers = u?.providerData?.map(p => p.providerId) || [];
  return {
    hasPassword: providers.includes('password'),
    hasGoogle: providers.includes('google.com'),
  };
};

/**
 * Đặt hoặc đổi mật khẩu đăng nhập trực tiếp cho tài khoản (kể cả tài khoản Google)
 * Giúp người dùng đăng nhập bằng Email + Mật khẩu hoặc dùng cho đồng bộ Gmail
 */
export const setAccountPassword = async (newPassword, currentPassword = '') => {
  const currentUser = auth.currentUser;
  if (!currentUser || !currentUser.email) {
    throw new Error('Không tìm thấy phiên đăng nhập hiện tại.');
  }

  const { hasPassword, hasGoogle } = getAccountAuthInfo(currentUser);

  const applyPassword = async () => {
    if (!hasPassword) {
      try {
        const cred = EmailAuthProvider.credential(currentUser.email, newPassword);
        await linkWithCredential(currentUser, cred);
        return;
      } catch (linkErr) {
        if (linkErr?.code !== 'auth/provider-already-linked') {
          throw linkErr;
        }
      }
    }
    await updatePassword(currentUser, newPassword);
  };

  try {
    await applyPassword();
  } catch (err) {
    if (err?.code === 'auth/requires-recent-login') {
      if (hasPassword && currentPassword) {
        const cred = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, cred);
        await applyPassword();
      } else if (hasGoogle) {
        googleProvider.setCustomParameters({ login_hint: currentUser.email });
        await reauthenticateWithPopup(currentUser, googleProvider);
        await applyPassword();
      } else {
        throw new Error('Vì lý do bảo mật, vui lòng nhập mật khẩu hiện tại (hoặc đăng xuất rồi đăng nhập lại) trước khi đổi mật khẩu.');
      }
    } else {
      throw err;
    }
  }

  await currentUser.reload();
};

/**
 * Đăng xuất
 */
export const logout = async () => {
  await signOut(auth);
};

/**
 * Gửi email khôi phục / đặt lại mật khẩu
 */
export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

