// src/pages/BackupPage.jsx
// Trang Sao lưu & Phục hồi toàn bộ hệ thống (Dành cho Quản trị viên)
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  exportFullBackup, restoreFromBackup, getSystemDataStats, BACKUP_COLLECTIONS
} from '../services/backupService';
import toast from 'react-hot-toast';

const BackupPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(true);
  const [exporting, setExporting] = useState(false);

  // State phục hồi
  const [uploadedFile, setUploadedFile] = useState(null);
  const [backupPreview, setBackupPreview] = useState(null);
  const [restoreMode, setRestoreMode] = useState('merge'); // 'merge' | 'clean'
  const [restoring, setRestoring] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, msg: '' });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await getSystemDataStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportFullBackup(user);
      toast.success('Xuất file sao lưu thành công! Tệp JSON đã được tải về máy của bạn.');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi sao lưu dữ liệu: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Vui lòng chọn tệp định dạng .JSON hợp lệ!');
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.app !== 'quanlygiaovu2026') {
          toast.error('Tệp không đúng định dạng của Hệ thống Quản lý Giáo vụ 2026!');
          setBackupPreview(null);
          return;
        }
        setBackupPreview(parsed);
      } catch (err) {
        toast.error('Tệp JSON bị hỏng hoặc không hợp lệ: ' + err.message);
        setBackupPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleStartRestore = async () => {
    if (!backupPreview) return;
    setConfirmModalOpen(false);
    setRestoring(true);
    setProgress({ percent: 5, msg: 'Bắt đầu quá trình nạp dữ liệu...' });

    try {
      await restoreFromBackup(backupPreview, restoreMode, (percent, msg) => {
        setProgress({ percent, msg });
      });
      toast.success('Phục hồi dữ liệu hệ thống thành công!', { duration: 5000 });
      await fetchStats();
      setUploadedFile(null);
      setBackupPreview(null);
    } catch (err) {
      console.error('Lỗi phục hồi:', err);
      toast.error('Lỗi khi phục hồi: ' + err.message);
    } finally {
      setRestoring(false);
    }
  };

  const totalCurrentRecords = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Header Banner */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 6 }}>
          Trung tâm Sao lưu & Phục hồi Cơ sở Dữ liệu
        </h2>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          Công cụ bảo an toàn diện cho toàn bộ hồ sơ, hợp đồng, văn bản, bảng điểm và cấu trúc thư mục năm học.
          Cho phép bạn lưu trữ dự phòng về máy tính cá nhân và phục hồi nhanh chóng khi cần.
        </p>
      </div>

      {/* Grid 2 Cột: Sao lưu & Phục hồi */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        
        {/* CỘT 1: SAO LƯU */}
        <div className="card" style={{ padding: 24, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, margin: 0, color: 'var(--text-primary)' }}>Sao lưu Toàn bộ Dữ liệu</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Xuất ra tệp JSON an toàn lưu trữ ngoại tuyến</span>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Tải về bản sao lưu đầy đủ tất cả các phân hệ dữ liệu hiện tại trong hệ thống.
          </p>

          {/* Bảng tóm tắt dữ liệu hiện tại */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 6, padding: '12px 16px', margin: '16px 0' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
              Dữ liệu hiện có trên hệ thống: {loadingStats ? '...' : `${totalCurrentRecords} bản ghi`}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, fontSize: 12.5 }}>
              {BACKUP_COLLECTIONS.map(col => (
                <div key={col.key} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>{col.label}:</span>
                  <strong>{loadingStats ? '-' : (stats[col.key] || 0)}</strong>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExport}
            disabled={exporting || loadingStats}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, fontWeight: 600 }}
          >
            {exporting ? (
              <><span className="spinner" style={{ width: 16, height: 16 }} /> Đang trích xuất dữ liệu...</>
            ) : (
              'Tải về Bản Sao lưu (.JSON)'
            )}
          </button>
        </div>

        {/* CỘT 2: PHỤC HỒI */}
        <div className="card" style={{ padding: 24, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, margin: 0, color: 'var(--text-primary)' }}>Phục hồi Dữ liệu</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Nạp lại từ tệp sao lưu JSON đã tải trước đó</span>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Chọn tệp sao lưu `.json` để tiến hành nạp lại toàn bộ dữ liệu vào hệ thống.
          </p>

          {/* Chọn File */}
          <div style={{ margin: '16px 0' }}>
            <label
              style={{
                display: 'block',
                border: '2px dashed #cbd5e1',
                borderRadius: 8,
                padding: '24px 14px',
                textAlign: 'center',
                cursor: 'pointer',
                background: uploadedFile ? '#f0fdf4' : '#f8fafc',
                transition: 'all 0.2s',
              }}
            >
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={restoring}
              />
              <div style={{ fontSize: 14, fontWeight: 600, color: uploadedFile ? '#166534' : 'var(--primary)' }}>
                {uploadedFile ? uploadedFile.name : 'Nhấn để chọn tệp sao lưu (.json)'}
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                {uploadedFile ? `Dung lượng: ${(uploadedFile.size / 1024).toFixed(1)} KB` : 'Hoặc kéo thả tệp vào khung này'}
              </span>
            </label>
          </div>

          {/* Xem trước tệp sao lưu */}
          {backupPreview && (
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 6, padding: '12px 14px', marginBottom: 16, fontSize: 12.5 }}>
              <div style={{ fontWeight: 700, color: '#166534', marginBottom: 6 }}>
                Tệp sao lưu hợp lệ
              </div>
              <div>Thời gian tạo: <strong>{new Date(backupPreview.exportedAt).toLocaleString('vi-VN')}</strong></div>
              <div>Tài khoản xuất: <strong>{backupPreview.exportedBy?.displayName || backupPreview.exportedBy?.email || 'N/A'}</strong></div>
              <div style={{ marginTop: 6, color: '#64748b' }}>
                Tổng cộng: <strong>{Object.values(backupPreview.stats || {}).reduce((a, b) => a + b, 0)}</strong> bản ghi trong tệp.
              </div>

              {/* Lựa chọn chế độ nạp */}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Chế độ phục hồi:</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 6 }}>
                  <input
                    type="radio"
                    name="restoreMode"
                    value="merge"
                    checked={restoreMode === 'merge'}
                    onChange={() => setRestoreMode('merge')}
                  />
                  <span><strong>Hợp nhất (Ghi đè/Thêm mới)</strong> — An toàn, không mất dữ liệu khác</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#b91c1c' }}>
                  <input
                    type="radio"
                    name="restoreMode"
                    value="clean"
                    checked={restoreMode === 'clean'}
                    onChange={() => setRestoreMode('clean')}
                  />
                  <span><strong>Khôi phục sạch</strong> — Xóa dữ liệu cũ trước khi nạp</span>
                </label>
              </div>
            </div>
          )}

          {/* Thanh tiến độ */}
          {restoring && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>{progress.msg}</span>
                <strong>{progress.percent}%</strong>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${progress.percent}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s' }} />
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setConfirmModalOpen(true)}
            disabled={!backupPreview || restoring}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, fontWeight: 600 }}
          >
            {restoring ? 'Đang phục hồi dữ liệu...' : 'Bắt đầu Phục hồi Dữ liệu'}
          </button>
        </div>
      </div>

      {/* MODAL XÁC NHẬN PHỤC HỒI */}
      {confirmModalOpen && (
        <div className="modal-backdrop" onClick={() => setConfirmModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Xác nhận phục hồi dữ liệu</h3>
              <button className="modal-close" onClick={() => setConfirmModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: '18px 24px' }}>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Bạn đang chuẩn bị phục hồi dữ liệu từ bản sao lưu ngày{' '}
                <strong>{new Date(backupPreview?.exportedAt).toLocaleString('vi-VN')}</strong>.
              </p>
              {restoreMode === 'clean' ? (
                <div style={{ marginTop: 12, padding: 12, background: '#fee2e2', borderRadius: 6, color: '#991b1b', fontSize: 13 }}>
                  <strong>CẢNH BÁO QUAN TRỌNG:</strong> Bạn đã chọn chế độ "Khôi phục sạch". Toàn bộ dữ liệu hiện tại trong các bảng sẽ bị xóa để thay thế bằng dữ liệu từ file sao lưu!
                </div>
              ) : (
                <div style={{ marginTop: 12, padding: 12, background: '#eff6ff', borderRadius: 6, color: '#1e40af', fontSize: 13 }}>
                  Chế độ "Hợp nhất" sẽ giữ nguyên các dữ liệu hiện có và cập nhật/bổ sung các bản ghi từ file sao lưu.
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ padding: '12px 24px' }}>
              <button type="button" className="btn btn-outline" onClick={() => setConfirmModalOpen(false)}>
                Hủy bỏ
              </button>
              <button
                type="button"
                className={`btn ${restoreMode === 'clean' ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleStartRestore}
              >
                Tôi chắc chắn, bắt đầu phục hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupPage;
