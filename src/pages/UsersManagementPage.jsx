// src/pages/UsersManagementPage.jsx
// Trang Quản lý Người dùng & Phân quyền (Dành riêng cho Quản trị viên)
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAllUsers, updateUserRole, toggleUserStatus, toggleUserGmailSync, deleteUserDoc, updateUserProfileData
} from '../services/userService';
import { formatTimestamp } from '../utils/dateUtils';
import SearchBar from '../components/common/SearchBar';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import { useConfirm } from '../context/ConfirmContext';
import toast from 'react-hot-toast';

const UsersManagementPage = () => {
  const { user, profile, refreshUser } = useAuth();
  const confirm = useConfirm();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal Chỉnh sửa thông tin người dùng
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    displayName: '',
    staffId: '',
    phone: '',
    department: '',
    role: 'Cán bộ',
    status: 'active',
    canSyncGmail: false,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsersList(data);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = usersList.length;
    const admins = usersList.filter(u => u.role === 'Quản trị viên' || u.role === 'admin').length;
    const staff = usersList.filter(u => u.role !== 'Quản trị viên' && u.role !== 'admin').length;
    const locked = usersList.filter(u => u.status === 'locked').length;
    return { total, admins, staff, locked };
  }, [usersList]);

  const filtered = useMemo(() => {
    return usersList.filter(u => {
      const matchSearch =
        (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.department || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.phone || '').includes(search) ||
        (u.staffId || '').toLowerCase().includes(search.toLowerCase());

      const matchRole =
        roleFilter === 'all' ||
        (roleFilter === 'admin' && (u.role === 'Quản trị viên' || u.role === 'admin')) ||
        (roleFilter === 'staff' && u.role !== 'Quản trị viên' && u.role !== 'admin');

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && u.status !== 'locked') ||
        (statusFilter === 'locked' && u.status === 'locked');

      return matchSearch && matchRole && matchStatus;
    });
  }, [usersList, search, roleFilter, statusFilter]);

  // Đổi vai trò
  const handleToggleRole = async (targetUser) => {
    if (targetUser.uid === user.uid) {
      toast.error('Bạn không thể tự giáng quyền Quản trị viên của chính mình!');
      return;
    }

    const currentIsAdmin = targetUser.role === 'Quản trị viên' || targetUser.role === 'admin';
    const newRole = currentIsAdmin ? 'Cán bộ' : 'Quản trị viên';

    const ok = await confirm({
      title: 'Xác nhận thay đổi phân quyền',
      message: `Bạn có chắc muốn đổi vai trò của cán bộ "${targetUser.displayName || targetUser.email}" thành "${newRole}"?`,
      confirmText: 'Đổi vai trò',
      cancelText: 'Huỷ bỏ',
      type: 'warning',
    });
    if (!ok) return;

    try {
      await updateUserRole(targetUser.id || targetUser.uid, newRole, user);
      toast.success(`Đã cập nhật vai trò thành: ${newRole}`);
      await load();
    } catch (err) {
      toast.error('Lỗi khi cập nhật vai trò!');
    }
  };

  // Khóa / Mở khóa
  const handleToggleLock = async (targetUser) => {
    if (targetUser.uid === user.uid) {
      toast.error('Bạn không thể tự khóa tài khoản của chính mình!');
      return;
    }

    const isLocked = targetUser.status === 'locked';
    const actionText = isLocked ? 'mở khóa' : 'khóa';

    const ok = await confirm({
      title: isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản',
      message: `Bạn có chắc muốn ${actionText} tài khoản "${targetUser.displayName || targetUser.email}"?`,
      confirmText: isLocked ? 'Mở khóa' : 'Khóa tài khoản',
      cancelText: 'Huỷ bỏ',
      type: isLocked ? 'info' : 'danger',
    });
    if (!ok) return;

    try {
      const nextStatus = await toggleUserStatus(targetUser.id || targetUser.uid, targetUser.status, user);
      toast.success(nextStatus === 'locked' ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản thành công!');
      await load();
    } catch (err) {
      toast.error('Lỗi khi thay đổi trạng thái tài khoản!');
    }
  };

  // Cấp / Thu hồi quyền đồng bộ Gmail
  const handleToggleGmailSync = async (targetUser) => {
    const targetIsAdmin = targetUser.role === 'Quản trị viên' || targetUser.role === 'admin';
    if (targetIsAdmin) {
      toast('Quản trị viên mặc định luôn có quyền đồng bộ Gmail!');
      return;
    }

    const enabled = targetUser.canSyncGmail === true;
    const ok = await confirm({
      title: enabled ? 'Thu hồi quyền đồng bộ Gmail' : 'Cấp quyền đồng bộ Gmail',
      message: enabled
        ? `Thu hồi quyền gắn nhãn đồng bộ Gmail của "${targetUser.displayName || targetUser.email}"? Tài khoản này sẽ không thể đẩy văn bản mới từ Gmail lên web nữa.`
        : `Cấp quyền cho "${targetUser.displayName || targetUser.email}" tự cấu hình gắn nhãn Gmail đẩy văn bản đến/đi lên trang web?`,
      confirmText: enabled ? 'Thu hồi quyền' : 'Cấp quyền',
      cancelText: 'Huỷ bỏ',
      type: enabled ? 'warning' : 'info',
    });
    if (!ok) return;

    try {
      const next = await toggleUserGmailSync(targetUser.id || targetUser.uid, enabled, user);
      toast.success(next ? 'Đã cấp quyền đồng bộ Gmail!' : 'Đã thu hồi quyền đồng bộ Gmail!');
      await load();
      if (targetUser.uid === user.uid && refreshUser) {
        await refreshUser();
      }
    } catch {
      toast.error('Lỗi khi thay đổi quyền đồng bộ Gmail!');
    }
  };

  // Xóa tài khoản khỏi danh sách
  const handleDeleteUser = async (targetUser) => {
    if (targetUser.uid === user.uid) {
      toast.error('Bạn không thể xóa tài khoản của chính mình!');
      return;
    }

    const ok = await confirm({
      title: 'Xác nhận xóa tài khoản',
      message: `CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ tài khoản "${targetUser.displayName || targetUser.email}"? Thao tác này không thể hoàn tác.`,
      confirmText: 'Xóa tài khoản',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;

    try {
      await deleteUserDoc(targetUser.id || targetUser.uid, targetUser.displayName || targetUser.email, user);
      toast.success('Đã xóa hồ sơ tài khoản thành công!');
      await load();
    } catch (err) {
      toast.error('Lỗi khi xóa tài khoản!');
    }
  };

  // Mở modal sửa thông tin cán bộ
  const handleOpenEdit = async (targetUser) => {
    setEditingUser(targetUser);
    let sId = targetUser.staffId;
    if (!sId) {
      sId = await generateNextStaffId();
    }
    setEditForm({
      displayName: targetUser.displayName || '',
      staffId: sId,
      phone: targetUser.phone || '',
      department: targetUser.department || 'Phòng Quản lý Đào tạo',
      role: (targetUser.role === 'Quản trị viên' || targetUser.role === 'admin') ? 'Quản trị viên' : 'Cán bộ',
      status: targetUser.status || 'active',
      canSyncGmail: Boolean(targetUser.canSyncGmail),
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.displayName.trim()) {
      toast.error('Vui lòng nhập Họ và tên cán bộ!');
      return;
    }
    setSavingEdit(true);
    try {
      const payloadToSave = {
        ...editForm,
        canSyncGmail: editForm.role === 'Quản trị viên' ? true : Boolean(editForm.canSyncGmail),
      };
      await updateUserProfileData(editingUser.id || editingUser.uid, payloadToSave, user);
      toast.success(`Đã cập nhật thông tin cán bộ "${editForm.displayName}"!`);
      setEditModalOpen(false);
      await load();
      if (editingUser.uid === user.uid && refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi cập nhật thông tin: ' + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="stat-grid">
        <StatCard num={stats.total} label="Tổng số tài khoản" variant="primary" />
        <StatCard num={stats.admins} label="Quản trị viên (Admin)" variant="danger" />
        <StatCard num={stats.staff} label="Cán bộ" variant="info" />
        <StatCard num={stats.locked} label="Tài khoản bị khóa" variant="warning" />
      </div>

      {/* Toolbar */}
      <div className="toolbar" style={{ flexWrap: 'wrap', gap: 10 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên, email, khoa/bộ môn, mã cán bộ..."
        />

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select
            className="form-control"
            style={{ width: 170, height: 38 }}
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="staff">Cán bộ</option>
          </select>

          <select
            className="form-control"
            style={{ width: 170, height: 38 }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>STT</th>
                <th>Họ và tên</th>
                <th>Email đăng nhập</th>
                <th>Đơn vị / Phòng ban</th>
                <th>Mã CB</th>
                <th>Số ĐT</th>
                <th style={{ textAlign: 'center' }}>Vai trò</th>
                <th style={{ textAlign: 'center' }}>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Đồng bộ Gmail</th>
                <th>Ngày tạo</th>
                <th style={{ textAlign: 'center' }}>Thao tác quản trị</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11}>
                    <div className="page-loading">
                      <div className="spinner" />
                      <span>Đang tải danh sách người dùng...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11}>
                    <div className="table-empty">
                      <p>{search ? 'Không tìm thấy người dùng phù hợp.' : 'Chưa có tài khoản nào được ghi nhận.'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((u, index) => {
                  const isAdmin = u.role === 'Quản trị viên' || u.role === 'admin';
                  const isLocked = u.status === 'locked';
                  const isCurrent = u.uid === user.uid;
                  const hasGmailSync = isAdmin || u.canSyncGmail === true;

                  return (
                    <tr key={u.id || u.uid} style={isLocked ? { opacity: 0.65, background: '#fef2f2' } : {}}>
                      <td style={{ textAlign: 'center' }}>{index + 1}</td>
                      <td>
                        <strong>{u.displayName || '—'}</strong>
                        {isCurrent && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>(Bạn)</span>}
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>{u.email}</td>
                      <td>{u.department || 'Phòng Quản lý Đào tạo'}</td>
                      <td style={{ fontFamily: 'monospace' }}>{u.staffId || '—'}</td>
                      <td>{u.phone || '—'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${isAdmin ? 'badge-danger' : 'badge-primary'}`}>
                          {isAdmin ? 'Quản trị viên' : 'Cán bộ'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${isLocked ? 'badge-danger' : 'badge-success'}`}>
                          {isLocked ? 'Đã khóa' : 'Hoạt động'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${hasGmailSync ? 'badge-success' : 'badge-default'}`}>
                          {isAdmin ? 'Mặc định' : (u.canSyncGmail === true ? 'Đã cấp' : 'Chưa cấp')}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {formatTimestamp(u.createdAt)}
                      </td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {/* Cấp / Thu hồi quyền đồng bộ Gmail */}
                        {!isAdmin && (
                          <>
                            <button
                              className={`btn ${u.canSyncGmail === true ? 'btn-outline' : 'btn-primary'} btn-xs`}
                              onClick={() => handleToggleGmailSync(u)}
                              title={u.canSyncGmail === true ? 'Thu hồi quyền đồng bộ Gmail' : 'Cấp quyền dán nhãn đồng bộ Gmail lên web'}
                            >
                              {u.canSyncGmail === true ? 'Tắt Gmail' : 'Cấp Gmail'}
                            </button>
                            {' '}
                          </>
                        )}
                        {/* Sửa thông tin cá nhân: Mã CB, SĐT, Phòng ban */}
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => handleOpenEdit(u)}
                          title="Sửa thông tin: Họ tên, Mã CB, Số ĐT, Đơn vị"
                          style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}
                        >
                          Sửa
                        </button>
                        {' '}
                        {/* Đổi quyền */}
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => handleToggleRole(u)}
                          disabled={isCurrent}
                          title={isAdmin ? 'Chuyển về Cán bộ' : 'Cấp quyền Quản trị viên'}
                        >
                          {isAdmin ? 'Hạ quyền Cán bộ' : 'Cấp quyền Admin'}
                        </button>
                        {' '}
                        {/* Khóa/Mở */}
                        <button
                          className={`btn ${isLocked ? 'btn-primary' : 'btn-outline'} btn-xs`}
                          onClick={() => handleToggleLock(u)}
                          disabled={isCurrent}
                          title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                        >
                          {isLocked ? 'Mở khóa' : 'Khóa'}
                        </button>
                        {' '}
                        {/* Xóa */}
                        <button
                          className="btn btn-danger btn-xs"
                          onClick={() => handleDeleteUser(u)}
                          disabled={isCurrent}
                          title="Xóa tài khoản khỏi hệ thống"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Chỉnh sửa thông tin Cán bộ / Người dùng */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Chỉnh sửa thông tin Cán bộ / Người dùng"
      >
        <form onSubmit={handleSaveEdit}>
          <div style={{ padding: '4px 0' }}>
            <div className="form-group">
              <label className="form-label">
                Họ và tên cán bộ <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={editForm.displayName}
                onChange={e => setEditForm(p => ({ ...p, displayName: e.target.value }))}
                required
                disabled={savingEdit}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Mã Cán bộ (Mã CB)</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.staffId || 'CB-2026-xxx'}
                  disabled
                  style={{ background: '#f1f5f9', cursor: 'not-allowed', fontWeight: 600, color: 'var(--primary)', fontFamily: 'monospace' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  className="form-control"
                  value={editForm.phone}
                  onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                  disabled={savingEdit}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Đơn vị / Phòng ban</label>
              <input
                type="text"
                className="form-control"
                value={editForm.department}
                onChange={e => setEditForm(p => ({ ...p, department: e.target.value }))}
                disabled={savingEdit}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Vai trò trong hệ thống</label>
                <select
                  className="form-control"
                  value={editForm.role}
                  onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
                  disabled={editingUser?.uid === user.uid || savingEdit}
                >
                  <option value="Cán bộ">Cán bộ</option>
                  <option value="Quản trị viên">Quản trị viên (Admin)</option>
                </select>
                {editingUser?.uid === user.uid && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Bạn không thể đổi vai trò của chính mình</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Trạng thái tài khoản</label>
                <select
                  className="form-control"
                  value={editForm.status}
                  onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                  disabled={editingUser?.uid === user.uid || savingEdit}
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="locked">Bị khóa</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, cursor: editForm.role === 'Quản trị viên' ? 'default' : 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editForm.role === 'Quản trị viên' ? true : editForm.canSyncGmail}
                  onChange={e => setEditForm(p => ({ ...p, canSyncGmail: e.target.checked }))}
                  disabled={editForm.role === 'Quản trị viên' || savingEdit}
                />
                <span>
                  <strong>Cho phép đồng bộ Văn bản Đến & Đi từ Gmail</strong>
                  {editForm.role === 'Quản trị viên' && (
                    <span style={{ marginLeft: 6, fontSize: 12, color: 'var(--text-muted)' }}>(Admin mặc định được phép)</span>
                  )}
                </span>
              </label>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ color: 'var(--text-muted)' }}>Email đăng nhập (Cố định)</label>
              <input
                type="text"
                className="form-control"
                value={editingUser?.email || ''}
                disabled
                style={{ background: '#f1f5f9', cursor: 'not-allowed', color: 'var(--text-secondary)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setEditModalOpen(false)}
                disabled={savingEdit}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingEdit}
              >
                {savingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersManagementPage;
