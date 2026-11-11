// src/App.jsx
// Root component - điều phối auth + routing + notifications
import { useState, useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { getAssets } from './services/assetService';
import { getExperts } from './services/expertService';
import { getIncomingDocs, getOutgoingDocs } from './services/documentService';
import { getDepreciationMonthsLeft, getContractMonthsLeft, formatDate } from './utils/dateUtils';

// Layout
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ProfileModal from './components/common/ProfileModal';

// Pages
import LoginPage from './pages/LoginPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import ScoresPage from './pages/ScoresPage';
import ExpertsPage from './pages/ExpertsPage';
import DocumentsPage from './pages/DocumentsPage';
import TeachingPage from './pages/TeachingPage';
import AuditLogPage from './pages/AuditLogPage';
import UsersManagementPage from './pages/UsersManagementPage';
import BackupPage from './pages/BackupPage';

const App = () => {
  const { user, isAdmin, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [docBadge, setDocBadge] = useState(0);

  // Build notifications từ dữ liệu thực
  const buildNotifications = async () => {
    if (!user) return;
    try {
      const [assets, experts, inDocs, outDocs] = await Promise.all([
        getAssets(), getExperts(), getIncomingDocs(), getOutgoingDocs(),
      ]);

      const notifs = [];

      // 1. Cảnh báo khấu hao Tài sản
      assets.forEach(a => {
        const ml = getDepreciationMonthsLeft(a.startDate, a.depreciationMonths);
        if (ml !== null && ml <= 1) {
          const isExpired = ml <= 0;
          notifs.push({
            id: `asset-${a.id}`,
            type: isExpired ? 'danger' : 'warning',
            category: 'Tài sản',
            categoryColor: isExpired ? '#b91c1c' : '#b45309',
            categoryBg: isExpired ? '#fee2e2' : '#fef3c7',
            icon: '🏢',
            badgeText: isExpired ? 'Hết khấu hao' : `Còn ${ml} tháng`,
            title: isExpired ? `Tài sản đã hết khấu hao: ${a.name}` : `Tài sản sắp hết khấu hao: ${a.name}`,
            desc: `Mã TS: ${a.code} · Phòng: ${a.room || 'Chưa xếp'} · Bắt đầu SD: ${formatDate(a.startDate)}`,
            page: 'assets',
            time: a.startDate ? formatDate(a.startDate) : 'Gần đây',
            unread: true,
          });
        }
      });

      // 2. Cảnh báo thời hạn Hợp đồng Chuyên gia
      experts.forEach(e => {
        const ml = getContractMonthsLeft(e.endDate);
        if (ml !== null && ml <= 2) {
          const isExpired = ml <= 0;
          notifs.push({
            id: `expert-${e.id}`,
            type: isExpired ? 'danger' : 'warning',
            category: 'Chuyên gia',
            categoryColor: isExpired ? '#c2410c' : '#b45309',
            categoryBg: isExpired ? '#ffedd5' : '#fef3c7',
            icon: '👨‍🏫',
            badgeText: isExpired ? 'Hết hạn HĐ' : `Còn ${ml} tháng`,
            title: isExpired ? `Hợp đồng đã hết hạn: ${e.title ? `${e.title} ` : ''}${e.name}` : `Hợp đồng sắp hết hạn: ${e.title ? `${e.title} ` : ''}${e.name}`,
            desc: `Số HĐ: ${e.contractNo || 'Chưa cấp'} · Học vị: ${e.degree || 'Chuyên gia'} · Hạn đến: ${formatDate(e.endDate)}`,
            page: 'experts',
            time: e.endDate ? formatDate(e.endDate) : 'Sắp đến hạn',
            unread: true,
          });
        }
      });

      // 3. Cảnh báo Văn bản đến chưa xử lý
      const unprocessed = inDocs.filter(d => d.status === 'Chưa xử lý');
      if (unprocessed.length > 0) {
        unprocessed.slice(0, 5).forEach(d => {
          notifs.push({
            id: `doc-in-${d.id}`,
            type: 'info',
            category: 'Văn bản đến',
            categoryColor: '#1d4ed8',
            categoryBg: '#eff6ff',
            icon: '📥',
            badgeText: 'Chưa xử lý',
            title: `Văn bản đến cần xử lý: ${d.refNo}`,
            desc: `Trích yếu: ${d.summary || d.title || 'Không có trích yếu'} · Ngày đến: ${formatDate(d.date)}`,
            page: 'documents',
            time: d.date ? formatDate(d.date) : 'Hôm nay',
            unread: true,
          });
        });
      }

      // 4. Cảnh báo Văn bản đi đang chờ phản hồi
      const awaiting = outDocs.filter(d => d.status === 'Chưa hồi đáp');
      if (awaiting.length > 0) {
        awaiting.slice(0, 5).forEach(d => {
          notifs.push({
            id: `doc-out-${d.id}`,
            type: 'info',
            category: 'Văn bản đi',
            categoryColor: '#475569',
            categoryBg: '#f1f5f9',
            icon: '📤',
            badgeText: 'Chờ phản hồi',
            title: `Văn bản đi chờ hồi đáp: ${d.refNo}`,
            desc: `Nơi nhận: ${d.recipient || 'Đơn vị nhận'} · Ngày gửi: ${formatDate(d.date)}`,
            page: 'documents',
            time: d.date ? formatDate(d.date) : 'Đã gửi',
            unread: false,
          });
        });
      }

      setNotifications(notifs);
      setDocBadge(unprocessed.length + awaiting.length);
    } catch (e) {
      console.warn('Notification build error:', e);
    }
  };

  useEffect(() => {
    if (user) buildNotifications();
  }, [user, currentPage]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Đang tải hệ thống...</span>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  // Nếu người dùng đăng ký bằng Email nhưng chưa xác thực email, bắt buộc xác thực trước khi vào hệ thống
  if (!user.emailVerified) return <VerifyEmailPage />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':  return <DashboardPage onNavigate={setCurrentPage} />;
      case 'assets':     return <AssetsPage />;
      case 'scores':     return <ScoresPage />;
      case 'experts':    return <ExpertsPage />;
      case 'documents':  return <DocumentsPage />;
      case 'teaching':   return <TeachingPage />;
      case 'users':      return isAdmin ? <UsersManagementPage /> : <DashboardPage onNavigate={setCurrentPage} />;
      case 'backup':     return isAdmin ? <BackupPage /> : <DashboardPage onNavigate={setCurrentPage} />;
      case 'audit':      return isAdmin ? <AuditLogPage /> : <DashboardPage onNavigate={setCurrentPage} />;
      default:           return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Backdrop khi mở menu trên điện thoại */}
      <div
        className={`sidebar-backdrop ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        badges={{ docBadge }}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />
      <div className="main">
        <Topbar
          currentPage={currentPage}
          notifications={notifications}
          onNavigate={setCurrentPage}
          onRefreshNotifications={buildNotifications}
          onToggleMobileMenu={() => setMobileMenuOpen(p => !p)}
          onOpenProfile={() => setProfileModalOpen(true)}
        />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>

      {/* Modal cập nhật hồ sơ cá nhân toàn hệ thống */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font)',
            fontSize: 13.5,
            borderRadius: 4,
          },
          success: { iconTheme: { primary: '#1a6b35', secondary: '#fff' } },
          error: { iconTheme: { primary: '#b32020', secondary: '#fff' } },
        }}
      />
    </div>
  );
};

export default App;
