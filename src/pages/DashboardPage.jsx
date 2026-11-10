// src/pages/DashboardPage.jsx
// Trang tổng quan - thống kê và cảnh báo tổng hợp
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAssets } from '../services/assetService';
import { getExperts } from '../services/expertService';
import { getIncomingDocs, getOutgoingDocs } from '../services/documentService';
import { getDepreciationMonthsLeft, getContractMonthsLeft } from '../utils/dateUtils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const DashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assets: 0, experts: 0, inDocs: 0, outDocs: 0 });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [assets, experts, inDocs, outDocs] = await Promise.all([
          getAssets(), getExperts(), getIncomingDocs(), getOutgoingDocs(),
        ]);

        setStats({
          assets: assets.length,
          experts: experts.length,
          inDocs: inDocs.length,
          outDocs: outDocs.length,
        });

        const alertList = [];

        // Tài sản sắp hết khấu hao
        assets.forEach(a => {
          const ml = getDepreciationMonthsLeft(a.startDate, a.depreciationMonths);
          if (ml !== null && ml <= 1) {
            alertList.push({
              type: ml <= 0 ? 'danger' : 'warning',
              title: ml <= 0 ? 'Tài sản đã hết khấu hao' : 'Tài sản sắp hết khấu hao',
              desc: `${a.name} (${a.code})${ml > 0 ? ` — còn ${ml} tháng` : ''}`,
              page: 'assets',
            });
          }
        });

        // Hợp đồng thỉnh giảng sắp hết hạn
        experts.forEach(e => {
          const ml = getContractMonthsLeft(e.endDate);
          if (ml !== null && ml <= 2) {
            alertList.push({
              type: ml <= 0 ? 'danger' : 'warning',
              title: ml <= 0 ? 'Hợp đồng đã hết hạn' : 'Hợp đồng sắp hết hạn',
              desc: `${e.title ? `${e.title} ` : ''}${e.name} — HĐ ${e.contractNo || '—'}${ml > 0 ? ` (còn ${ml} tháng)` : ''}`,
              page: 'experts',
            });
          }
        });

        // Văn bản đến chưa xử lý
        const unprocessed = inDocs.filter(d => d.status === 'Chưa xử lý');
        if (unprocessed.length > 0) {
          alertList.push({
            type: 'info',
            title: `${unprocessed.length} văn bản đến chưa xử lý`,
            desc: unprocessed.slice(0, 2).map(d => d.refNo).join(', ') + (unprocessed.length > 2 ? '...' : ''),
            page: 'documents',
          });
        }

        // Văn bản đi chưa hồi đáp
        const awaiting = outDocs.filter(d => d.status === 'Chưa hồi đáp');
        if (awaiting.length > 0) {
          alertList.push({
            type: 'info',
            title: `${awaiting.length} văn bản đi chờ hồi đáp`,
            desc: awaiting.slice(0, 2).map(d => d.refNo).join(', ') + (awaiting.length > 2 ? '...' : ''),
            page: 'documents',
          });
        }

        setAlerts(alertList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const today = format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi });

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div>
          <h2>{greeting()}, {user?.displayName || 'Cán bộ'}</h2>
          <p>{today} · Phòng Quản lý Đào tạo & Giáo vụ</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card primary" style={{ cursor: 'pointer' }} onClick={() => onNavigate('assets')}>
          <div className="stat-num">{loading ? '...' : stats.assets}</div>
          <div className="stat-label">Tổng tài sản</div>
        </div>
        <div className="stat-card success" style={{ cursor: 'pointer' }} onClick={() => onNavigate('experts')}>
          <div className="stat-num">{loading ? '...' : stats.experts}</div>
          <div className="stat-label">Chuyên gia thỉnh giảng</div>
        </div>
        <div className="stat-card warning" style={{ cursor: 'pointer' }} onClick={() => onNavigate('documents')}>
          <div className="stat-num">{loading ? '...' : stats.inDocs}</div>
          <div className="stat-label">Văn bản đến</div>
        </div>
        <div className="stat-card primary" style={{ cursor: 'pointer' }} onClick={() => onNavigate('documents')}>
          <div className="stat-num">{loading ? '...' : stats.outDocs}</div>
          <div className="stat-label">Văn bản đi</div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="card-header" style={{ background: '#f0f4fa', borderRadius: 5, marginBottom: 12, border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 14 }}>Cảnh báo & Nhắc việc</h3>
        {alerts.length > 0 && (
          <span className="badge badge-danger">{alerts.length} mục cần chú ý</span>
        )}
      </div>

      {loading ? (
        <div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div>
      ) : alerts.length === 0 ? (
        <div className="alert alert-success">
          <span>Không có cảnh báo hay nhắc việc cần xử lý. Hệ thống hoạt động bình thường.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`alert alert-${a.type}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate(a.page)}
            >
              <div>
                <strong>{a.title}</strong>
                <div style={{ fontSize: 12.5, marginTop: 2, opacity: 0.9 }}>{a.desc}</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>Xem chi tiết →</span>
            </div>
          ))}
        </div>
      )}


    </div>
  );
};

export default DashboardPage;
