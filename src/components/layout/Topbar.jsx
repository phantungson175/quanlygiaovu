import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../context/ConfirmContext';
import { logout } from '../../services/authService';
import NotificationDropdown from './NotificationDropdown';
import toast from 'react-hot-toast';

const PAGE_TITLES = {
  dashboard: 'Tổng quan',
  assets: 'Quản lý Tài sản',
  scores: 'Quản lý Điểm Đại học',
  experts: 'Quản lý Thỉnh giảng Chuyên gia',
  documents: 'Quản lý Văn bản',
  teaching: 'Quản lý Khối lượng Giảng dạy',
  users: 'Quản lý Người dùng & Phân quyền',
  backup: 'Sao lưu & Phục hồi Hệ thống',
  audit: 'Nhật ký Hoạt động',
};

const Topbar = ({
  currentPage,
  notifications = [],
  onNavigate,
  onRefreshNotifications,
  onToggleMobileMenu,
  onOpenProfile,
}) => {
  const { user, profile, isAdmin } = useAuth();
  const confirm = useConfirm();
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Đăng xuất khỏi hệ thống',
      message: 'Bạn có chắc chắn muốn kết thúc phiên làm việc và đăng xuất khỏi tài khoản?',
      confirmText: 'Đăng xuất',
      cancelText: 'Ở lại',
      type: 'danger',
    });
    if (!ok) return;
    await logout();
    toast.success('Đã đăng xuất thành công!');
  };

  const unread = notifications.filter(n => n.unread);
  const activeName = profile?.displayName || user?.displayName || user?.email || '';
  const avatarText = activeName
    ? activeName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : (user?.email?.[0] || '?').toUpperCase();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <button
          type="button"
          className="hamburger-btn"
          onClick={onToggleMobileMenu}
          title="Mở menu chức năng"
        >
          ☰
        </button>
        <span className="topbar-title">{PAGE_TITLES[currentPage] || ''}</span>
      </div>

      <div className="topbar-actions">
        {/* Notification */}
        <div style={{ position: 'relative' }}>
          <button
            className="notif-btn"
            onClick={() => setNotifOpen(o => !o)}
            title="Thông báo hệ thống"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <span>🔔</span>
            <span>Thông báo</span>
            {unread.length > 0 && (
              <span className="notif-dot">{unread.length > 9 ? '9+' : unread.length}</span>
            )}
          </button>

          <NotificationDropdown
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
            notifications={notifications}
            onNavigate={onNavigate}
            onRefresh={onRefreshNotifications}
          />
        </div>

        {/* User */}
        <div className="user-chip">
          <div
            onClick={onOpenProfile}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            title="Bấm để xem và sửa thông tin cá nhân (Mã CB, SĐT, Phòng ban)"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div className="user-avatar" style={{ background: isAdmin ? 'var(--danger)' : 'var(--primary)' }}>{avatarText}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.25 }}>
              <span style={{ maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, fontSize: 13 }}>
                {activeName}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: isAdmin ? '#b91c1c' : '#1d4ed8',
                    fontWeight: 600,
                    background: isAdmin ? '#fee2e2' : '#dbeafe',
                    borderRadius: 4,
                    padding: '2px 6px',
                    display: 'inline-block',
                    marginTop: 2,
                    width: 'fit-content',
                  }}
                >
                  {isAdmin ? 'Quản trị viên' : 'Cán bộ'}
                </span>
                {profile?.staffId && (
                  <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2 }}>
                    [{profile.staffId}]
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-xs"
            onClick={onOpenProfile}
            title="Cập nhật Mã CB, Số ĐT, Đơn vị công tác"
            style={{ padding: '3px 8px', fontSize: 12 }}
          >
            Hồ sơ
          </button>

          <button className="btn btn-ghost btn-xs" onClick={handleLogout} title="Đăng xuất">
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
