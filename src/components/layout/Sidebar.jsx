// src/components/layout/Sidebar.jsx
import { useAuth } from '../../context/AuthContext';

// Nhóm chức năng quản trị đặc biệt của Admin
const ADMIN_NAV_ITEMS = [
  { id: 'users',      label: 'Quản lý Người dùng',      badge: null },
  { id: 'backup',     label: 'Sao lưu & Phục hồi',      badge: null },
  { id: 'audit',      label: 'Nhật ký Hoạt động',       badge: null },
];

// Nhóm chức năng nghiệp vụ giáo vụ (Người dùng)
const USER_NAV_ITEMS = [
  { id: 'assets',     label: 'Quản lý Tài sản',         badge: null },
  { id: 'scores',     label: 'Quản lý Điểm',            badge: null },
  { id: 'experts',    label: 'Thỉnh giảng Chuyên gia', badge: null },
  { id: 'documents',  label: 'Quản lý Văn bản',         badge: 'docBadge' },
  { id: 'teaching',   label: 'Khối lượng Giảng dạy',    badge: null },
];

const Sidebar = ({ currentPage, onNavigate, badges = {}, mobileOpen, onCloseMobile, onOpenProfile }) => {
  const { user, profile, isAdmin } = useAuth();

  const handleSelect = (id) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  const renderNavItem = (item) => (
    <button
      key={item.id}
      className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
      onClick={() => handleSelect(item.id)}
    >
      <span className="nav-item-text">{item.label}</span>
      {item.badge && badges[item.badge] > 0 && (
        <span className="nav-item-badge">{badges[item.badge]}</span>
      )}
    </button>
  );

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-name">
          QUẢN LÝ GIÁO VỤ
          <span>Phòng Quản lý Đào tạo</span>
        </div>
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onCloseMobile}
          title="Đóng thanh điều hướng"
        >
          ✕
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Mục Tổng quan chung */}
        {renderNavItem({ id: 'dashboard', label: 'Tổng quan' })}

        {/* Các phần đặc biệt của Admin ưu tiên hiển thị lên trên */}
        {isAdmin && (
          <>
            <div className="sidebar-section-label" style={{ marginTop: 8 }}>
              Quản trị Hệ thống
            </div>
            {ADMIN_NAV_ITEMS.map(renderNavItem)}
          </>
        )}

        {/* Các phần nghiệp vụ giáo vụ của người dùng hiển thị phía dưới */}
        <div className="sidebar-section-label" style={{ marginTop: 8 }}>
          {isAdmin ? 'Nghiệp vụ Giáo vụ' : 'Chức năng hệ thống'}
        </div>
        {USER_NAV_ITEMS.map(renderNavItem)}
      </nav>

      {/* Footer / User Profile Card */}
      <div
        className="sidebar-footer"
        onClick={onOpenProfile}
        style={{ cursor: 'pointer', transition: 'background 0.2s' }}
        title="Bấm để xem và sửa Hồ sơ cá nhân"
      >
        <div style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {profile?.displayName || user?.displayName || user?.email}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>✎ Sửa</span>
        </div>
        {profile?.staffId && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2, fontFamily: 'monospace' }}>
            Mã CB: {profile.staffId}
          </div>
        )}
        <div style={{ marginTop: 4, display: 'inline-block', fontSize: 11, padding: '2px 8px', borderRadius: 10, background: isAdmin ? 'rgba(239, 68, 68, 0.25)' : 'rgba(59, 130, 246, 0.25)', color: isAdmin ? '#fca5a5' : '#93c5fd' }}>
          {isAdmin ? 'Quản trị viên (Admin)' : 'Cán bộ'}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
          Hệ thống Giáo vụ · {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
