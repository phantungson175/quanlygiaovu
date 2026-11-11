// src/components/common/PasswordSetupBox.jsx
// Khối đặt / đổi mật khẩu trực tiếp cho tài khoản (hỗ trợ cả tài khoản đăng nhập bằng Google)
import { useState } from 'react';
import { setAccountPassword } from '../../services/authService';
import toast from 'react-hot-toast';

const PasswordSetupBox = ({ hasPassword, hasGoogle, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [needCurrentPwd, setNeedCurrentPwd] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSavePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    setSaving(true);
    try {
      await setAccountPassword(newPassword, currentPassword);
      toast.success('Đã thiết lập mật khẩu thành công! Bạn có thể dùng mật khẩu này để đăng nhập và đồng bộ Gmail.');
      const savedPwd = newPassword;
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNeedCurrentPwd(false);
      if (onSuccess) onSuccess(savedPwd);
    } catch (err) {
      console.error('Lỗi đặt mật khẩu:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        toast.error('Bạn đã đóng cửa sổ xác thực Google.');
      } else if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setNeedCurrentPwd(true);
        toast.error('Mật khẩu hiện tại chưa chính xác.');
      } else if (err?.message?.includes('mật khẩu hiện tại')) {
        setNeedCurrentPwd(true);
        toast.error(err.message);
      } else {
        toast.error('Không thể đặt mật khẩu: ' + (err?.message || 'Lỗi không xác định'));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--primary)' }}>
          🔐 {hasPassword ? 'Đổi mật khẩu đăng nhập / đồng bộ Gmail' : 'Tạo mật khẩu cho tài khoản Google'}
        </div>
        <span className={`badge ${hasPassword ? 'badge-success' : 'badge-warning'}`}>
          {hasPassword ? 'Đã có mật khẩu' : 'Chưa đặt mật khẩu'}
        </span>
      </div>

      {!hasPassword && (
        <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.45 }}>
          Tài khoản đăng nhập bằng Google chưa có mật khẩu riêng. Hãy đặt 1 mật khẩu (tối thiểu 6 ký tự) để dùng đăng nhập hoặc kết nối đồng bộ Gmail tự động.
        </p>
      )}

      {needCurrentPwd && hasPassword && !hasGoogle && (
        <div className="form-group" style={{ marginBottom: 10 }}>
          <label className="form-label" style={{ fontSize: 12 }}>Mật khẩu hiện tại *</label>
          <input
            type={showPwd ? 'text' : 'password'}
            className="form-control"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu cũ để xác nhận"
            disabled={saving}
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div>
          <label className="form-label" style={{ fontSize: 12 }}>Mật khẩu mới *</label>
          <input
            type={showPwd ? 'text' : 'password'}
            className="form-control"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Ít nhất 6 ký tự"
            disabled={saving}
          />
        </div>
        <div>
          <label className="form-label" style={{ fontSize: 12 }}>Xác nhận mật khẩu *</label>
          <input
            type={showPwd ? 'text' : 'password'}
            className="form-control"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            disabled={saving}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showPwd}
            onChange={e => setShowPwd(e.target.checked)}
          />
          Hiện mật khẩu
        </label>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleSavePassword}
          disabled={saving}
          style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}
        >
          {saving ? 'Đang lưu...' : (hasPassword ? 'Cập nhật mật khẩu' : 'Lưu mật khẩu mới')}
        </button>
      </div>
    </div>
  );
};

export default PasswordSetupBox;

