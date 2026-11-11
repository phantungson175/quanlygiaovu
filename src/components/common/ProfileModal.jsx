// src/components/common/ProfileModal.jsx
// Modal xem & chỉnh sửa thông tin cá nhân (Họ tên, Mã CB, SĐT, Phòng ban)
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateMyProfile } from '../../services/userService';
import { formatTimestamp } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

import Modal from './Modal';
import UserAvatar from './UserAvatar';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, profile, isAdmin, refreshUser } = useAuth();

  const [form, setForm] = useState({
    displayName: '',
    staffId: '',
    phone: '',
    department: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setForm({
        displayName: profile?.displayName || user?.displayName || '',
        staffId: profile?.staffId || '',
        phone: profile?.phone || '',
        department: profile?.department || 'Phòng Quản lý Đào tạo',
      });
    }
  }, [isOpen, user, profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.displayName.trim()) {
      toast.error('Vui lòng nhập Họ và tên!');
      return;
    }

    setSaving(true);
    try {
      await updateMyProfile(user.uid, form);
      await refreshUser();
      toast.success('Đã cập nhật thông tin cá nhân thành công!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi cập nhật thông tin: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Thông tin Cá nhân & Tài khoản"
      size="modal-md"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ padding: '4px 0' }}>
          {/* Header tóm tắt hồ sơ */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '14px 16px',
            marginBottom: 18,
          }}>
            <UserAvatar
              photoURL={user?.photoURL}
              name={form.displayName}
              email={user?.email}
              isAdmin={isAdmin}
              size={52}
              fontSize={18}
            />

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                {form.displayName || user?.email}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontFamily: 'monospace', marginTop: 2 }}>
                {user?.email}
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className={`badge ${isAdmin ? 'badge-danger' : 'badge-primary'}`}>
                  {isAdmin ? 'Quản trị viên (Admin)' : 'Cán bộ'}
                </span>
                {profile?.createdAt && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Tham gia: {formatTimestamp(profile.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-group">
            <label className="form-label">
              Họ và tên cán bộ <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={form.displayName}
              onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
              required
              disabled={saving}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Mã Cán bộ (Mã CB)</label>
              <input
                type="text"
                className="form-control"
                value={form.staffId || 'CB-2026-xxx'}
                disabled
                style={{ background: '#f1f5f9', cursor: 'not-allowed', fontWeight: 600, color: 'var(--primary)', fontFamily: 'monospace' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại liên hệ</label>
              <input
                type="tel"
                className="form-control"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Đơn vị / Phòng ban / Khoa</label>
            <input
              type="text"
              className="form-control"
              value={form.department}
              onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
              disabled={saving}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label" style={{ color: 'var(--text-muted)' }}>Email đăng nhập (Cố định)</label>
            <input
              type="text"
              className="form-control"
              value={user?.email || ''}
              disabled
              style={{ background: '#f1f5f9', cursor: 'not-allowed', color: 'var(--text-secondary)' }}
            />
          </div>



          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileModal;
