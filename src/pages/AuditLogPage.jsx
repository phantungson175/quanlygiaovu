// src/pages/AuditLogPage.jsx
// Nhật ký hoạt động - ghi lại mọi thao tác
import { useState, useEffect, useMemo } from 'react';
import { getAuditLogs } from '../services/auditService';
import { formatTimestamp } from '../utils/dateUtils';
import SearchBar from '../components/common/SearchBar';

const ACTION_LABELS = {
  add: { label: 'Thêm mới', cls: 'badge-success', dot: 'add' },
  create: { label: 'Tạo mới', cls: 'badge-success', dot: 'add' },
  edit: { label: 'Chỉnh sửa', cls: 'badge-info', dot: 'edit' },
  update: { label: 'Cập nhật', cls: 'badge-info', dot: 'edit' },
  update_role: { label: 'Phân quyền', cls: 'badge-warning', dot: 'edit' },
  update_user_info: { label: 'Sửa cán bộ', cls: 'badge-info', dot: 'edit' },
  update_self_profile: { label: 'Sửa hồ sơ', cls: 'badge-info', dot: 'edit' },
  lock_account: { label: 'Khóa TK', cls: 'badge-danger', dot: 'delete' },
  unlock_account: { label: 'Mở khóa TK', cls: 'badge-success', dot: 'add' },
  delete: { label: 'Xóa', cls: 'badge-danger', dot: 'delete' },
  delete_account: { label: 'Xóa TK', cls: 'badge-danger', dot: 'delete' },
  upload: { label: 'Tải lên', cls: 'badge-warning', dot: 'upload' },
  backup: { label: 'Sao lưu', cls: 'badge-primary', dot: 'upload' },
  login: { label: 'Đăng nhập', cls: 'badge-primary', dot: 'add' },
  logout: { label: 'Đăng xuất', cls: 'badge-default', dot: 'edit' },
};

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try { setLogs(await getAuditLogs(200)); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = useMemo(() => logs.filter(l =>
    l.module?.toLowerCase().includes(search.toLowerCase()) ||
    l.detail?.toLowerCase().includes(search.toLowerCase()) ||
    l.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    l.action?.toLowerCase().includes(search.toLowerCase())
  ), [logs, search]);

  return (
    <div>
      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo module, hành động, người dùng..." />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Hiển thị {filtered.length} / {logs.length} bản ghi</span>
      </div>

      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Hành động</th>
                <th>Module</th>
                <th>Chi tiết</th>
                <th>Người thực hiện</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5}><div className="page-loading"><div className="spinner" /><span>Đang tải nhật ký...</span></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5}><div className="table-empty"><div className="table-empty-icon">📋</div><p>{search ? 'Không tìm thấy kết quả.' : 'Chưa có nhật ký hoạt động nào.'}</p></div></td></tr>
              ) : filtered.map(l => {
                const act = ACTION_LABELS[l.action] || { label: l.action, cls: 'badge-default', dot: 'edit' };
                return (
                  <tr key={l.id}>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: 12 }}>
                      {formatTimestamp(l.timestamp)}
                    </td>
                    <td><span className={`badge ${act.cls}`}>{act.label}</span></td>
                    <td><strong>{l.module}</strong></td>
                    <td style={{ maxWidth: 320 }}>{l.detail}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{l.userEmail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
