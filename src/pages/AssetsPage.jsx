// src/pages/AssetsPage.jsx
// Module 1: Quản lý Tài sản (Phân cấp theo Năm & Thư mục tự do đa tầng)
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAssets, addAsset, updateAsset, deleteAsset } from '../services/assetService';
import {
  getFolders, createFolder, renameFolder, deleteFolder,
} from '../services/folderService';
import {
  getDepreciationMonthsLeft, getDepreciationBadge,
  getWarningRowClass, formatDate, todayStr,
} from '../utils/dateUtils';
import { exportAssetsToExcel, exportAssetsToPDF } from '../utils/exportUtils';
import SearchBar from '../components/common/SearchBar';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import FilePill from '../components/common/FilePill';
import UploadArea from '../components/common/UploadArea';
import { useConfirm } from '../context/ConfirmContext';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  code: '', name: '', type: 'Thiết bị điện tử', quantity: 1,
  room: '', startDate: todayStr(),
  year: new Date().getFullYear().toString(),
  depreciationMonths: 36,
  condition: 'Tốt', notes: '',
};

const ASSET_TYPES = ['Thiết bị điện tử', 'Nội thất', 'Thiết bị giảng dạy', 'Thiết bị văn phòng', 'Khác'];
const CONDITIONS = ['Tốt', 'Bình thường', 'Cần bảo trì', 'Hỏng', 'Đã thanh lý'];

const getAssetYear = (a) => {
  if (a?.year) return String(a?.year);
  if (a?.startDate && a.startDate.length >= 4) return a.startDate.substring(0, 4);
  return '2026';
};

const AssetsPage = () => {
  const { user, isAdmin } = useAuth();
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [customFolders, setCustomFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('folder'); // 'folder' | 'table'

  // Quản lý đường dẫn thư mục đa tầng (Nested Subfolders)
  const [selectedYear, setSelectedYear] = useState(null);
  const [folderPath, setFolderPath] = useState([]); // [{ id, name }]

  // Modal Thêm / Sửa
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [assetFile, setAssetFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Modal Tạo Thư mục mới
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Modal Đổi tên Thư mục
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');

  // Modal Thêm năm mới
  const [createYearModalOpen, setCreateYearModalOpen] = useState(false);
  const [customYears, setCustomYears] = useState([]);
  const [newYearInput, setNewYearInput] = useState('');

  const currentParentId = folderPath.length > 0 ? folderPath[folderPath.length - 1].id : null;
  const currentFolderName = folderPath.length > 0 ? folderPath[folderPath.length - 1].name : null;

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAssets();
      setItems(data);
    } catch {
      toast.error('Lỗi tải dữ liệu tài sản!');
    } finally {
      setLoading(false);
    }
  };

  const loadSubfolders = async (year, parentId = null) => {
    if (!year) return;
    try {
      const f = await getFolders('assets', year, parentId);
      setCustomFolders(f);
    } catch (e) {
      console.error('Lỗi tải thư mục tài sản:', e);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (selectedYear) {
      loadSubfolders(selectedYear, currentParentId);
    } else {
      setCustomFolders([]);
    }
  }, [selectedYear, currentParentId]);

  // Thêm monthsLeft và yearCalculated vào từng item
  const enriched = useMemo(() => items.map(a => ({
    ...a,
    yearCalculated: getAssetYear(a),
    monthsLeft: getDepreciationMonthsLeft(a.startDate, a.depreciationMonths),
  })), [items]);

  const availableYears = useMemo(() => {
    const curY = new Date().getFullYear();
    const baseYears = [curY + 1, curY, curY - 1, curY - 2, curY - 3].map(String);
    const dataYears = items.map(getAssetYear).filter(Boolean);
    return Array.from(new Set([...baseYears, ...customYears, ...dataYears])).sort((a, b) => b.localeCompare(a));
  }, [items, customYears]);

  // Lọc tài sản theo thư mục hiện tại
  const folderFiltered = useMemo(() => {
    let result = enriched;
    if (selectedYear) {
      result = result.filter(a => a.yearCalculated === selectedYear);
    }
    if (currentParentId) {
      result = result.filter(a => a.folderId === currentParentId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.name?.toLowerCase().includes(q) ||
        a.code?.toLowerCase().includes(q) ||
        a.type?.toLowerCase().includes(q) ||
        a.room?.toLowerCase().includes(q) ||
        a.folderName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [enriched, selectedYear, currentParentId, search]);

  // Chế độ xem toàn bộ dạng bảng
  const tableFiltered = useMemo(() => {
    let result = enriched;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.name?.toLowerCase().includes(q) ||
        a.code?.toLowerCase().includes(q) ||
        a.type?.toLowerCase().includes(q) ||
        a.room?.toLowerCase().includes(q) ||
        a.folderName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [enriched, search]);

  const activeFiltered = viewMode === 'folder' ? folderFiltered : tableFiltered;

  const stats = useMemo(() => ({
    total: enriched.length,
    warn: enriched.filter(a => a.monthsLeft !== null && a.monthsLeft > 0 && a.monthsLeft <= 1).length,
    expired: enriched.filter(a => a.monthsLeft !== null && a.monthsLeft <= 0).length,
    ok: enriched.filter(a => a.monthsLeft !== null && a.monthsLeft > 1).length,
  }), [enriched]);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => {
    setEditId(null);
    setAssetFile(null);
    setForm({
      ...EMPTY_FORM,
      year: selectedYear || new Date().getFullYear().toString(),
      folderId: currentParentId || null,
      folderName: currentFolderName || '',
    });
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditId(a.id);
    setAssetFile(null);
    setForm({
      code: a.code || '', name: a.name || '', type: a.type || 'Thiết bị điện tử',
      quantity: a.quantity || 1, room: a.room || '',
      startDate: a.startDate || todayStr(),
      year: a.year || getAssetYear(a),
      depreciationMonths: a.depreciationMonths || 36,
      condition: a.condition || 'Tốt', notes: a.notes || '',
      folderId: a.folderId || null,
      folderName: a.folderName || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim() || !form.startDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        folderId: form.folderId || currentParentId || null,
        folderName: form.folderName || currentFolderName || '',
      };
      if (editId) {
        await updateAsset(editId, payload, assetFile, user);
        toast.success('Cập nhật tài sản thành công!');
      } else {
        await addAsset(payload, assetFile, user);
        toast.success('Thêm tài sản thành công!');
      }
      setModalOpen(false);
      await load();
      if (selectedYear) {
        await loadSubfolders(selectedYear, currentParentId);
      }
    } catch {
      toast.error('Lỗi khi lưu. Vui lòng thử lại!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a) => {
    const ok = await confirm({
      title: 'Xác nhận xóa tài sản',
      message: `Bạn có chắc muốn xóa tài sản "${a.name}"?`,
      confirmText: 'Xóa tài sản',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;
    try {
      await deleteAsset(a.id, a.name, user);
      toast.success('Đã xóa tài sản!');
      await load();
      if (selectedYear) {
        await loadSubfolders(selectedYear, currentParentId);
      }
    } catch {
      toast.error('Lỗi khi xóa!');
    }
  };

  // Tạo thư mục mới do người dùng đặt tên
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Vui lòng nhập tên thư mục!');
      return;
    }
    setCreatingFolder(true);
    try {
      const created = await createFolder({
        name: newFolderName.trim(),
        module: 'assets',
        year: selectedYear,
        parentId: currentParentId || null,
        user,
      });
      toast.success(`Đã tạo và mở thư mục "${newFolderName.trim()}"!`);
      setNewFolderName('');
      setCreateFolderModalOpen(false);
      // Tự động mở/chuyển ngay vào thư mục vừa tạo để thanh breadcrumb hiển thị ngay lập tức
      setFolderPath(prev => [...prev, { id: created.id, name: created.name }]);
    } catch (e) {
      toast.error('Lỗi khi tạo thư mục: ' + e.message);
    } finally {
      setCreatingFolder(false);
    }
  };

  const openRenameModal = (e, f) => {
    e.stopPropagation();
    setEditingFolder(f);
    setEditFolderName(f.name);
    setRenameModalOpen(true);
  };

  const handleRenameFolder = async () => {
    if (!editFolderName.trim()) {
      toast.error('Tên thư mục không được để trống!');
      return;
    }
    try {
      await renameFolder(editingFolder.id, editFolderName.trim(), user, 'assets');
      toast.success('Đã đổi tên thư mục thành công!');
      setRenameModalOpen(false);
      await loadSubfolders(selectedYear, currentParentId);
    } catch (e) {
      toast.error('Lỗi khi đổi tên: ' + e.message);
    }
  };

  const handleDeleteFolder = async (e, f) => {
    e.stopPropagation();
    const count = items.filter(a => a.folderId === f.id).length;
    const msg = count > 0
      ? `Thư mục "${f.name}" đang chứa ${count} tài sản. Bạn có chắc muốn xóa thư mục này không?`
      : `Bạn có chắc muốn xóa thư mục "${f.name}"?`;
    const ok = await confirm({
      title: 'Xác nhận xóa thư mục tài sản',
      message: msg,
      confirmText: 'Xóa thư mục',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;

    try {
      await deleteFolder(f.id, f.name, user, 'assets');
      toast.success(`Đã xóa thư mục "${f.name}"!`);
      await loadSubfolders(selectedYear, currentParentId);
    } catch (err) {
      toast.error('Lỗi khi xóa: ' + err.message);
    }
  };

  const handleAddCustomYear = () => {
    if (!newYearInput.trim()) {
      toast.error('Vui lòng nhập năm (2027)!');
      return;
    }
    const y = newYearInput.trim();
    if (!customYears.includes(y)) {
      setCustomYears(prev => [y, ...prev]);
    }
    toast.success(`Đã thêm năm ${y}!`);
    setNewYearInput('');
    setCreateYearModalOpen(false);
    setSelectedYear(y);
    setFolderPath([]);
  };

  const warnItems = enriched.filter(a => a.monthsLeft !== null && a.monthsLeft <= 1);

  const handleExportPDF = async () => {
    const t = toast.loading('Đang khởi tạo file PDF...');
    try {
      await exportAssetsToPDF(activeFiltered);
      toast.success('Xuất file PDF thành công!', { id: t });
    } catch (e) {
      console.error(e);
      toast.error('Lỗi khi xuất PDF!', { id: t });
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="stat-grid">
        <StatCard num={stats.total} label="Tổng tài sản" variant="primary" />
        <StatCard num={stats.ok} label="Đang sử dụng tốt" variant="success" />
        <StatCard num={stats.warn} label="Sắp hết khấu hao" variant="warning" />
        <StatCard num={stats.expired} label="Đã hết khấu hao" variant="danger" />
      </div>

      {/* Alert bar */}
      {warnItems.length > 0 && (
        <div className="alert alert-warning">
          <div>
            <strong>Cảnh báo:</strong> Có <strong>{warnItems.length}</strong> tài sản
            sắp hết hoặc đã hết thời hạn khấu hao:&nbsp;
            {warnItems.slice(0, 3).map(a => a.name).join(', ')}
            {warnItems.length > 3 ? ` và ${warnItems.length - 3} tài sản khác...` : '.'}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        {/* Toggle View Mode */}
        <div className="view-mode-toggle">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'folder' ? 'active' : ''}`}
            onClick={() => setViewMode('folder')}
            title="Xem theo Thư mục tự tạo"
          >
            📁 Dạng Thư mục
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Xem toàn bộ dạng danh sách phẳng"
          >
            📋 Dạng Danh sách
          </button>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên, mã, loại tài sản, phòng, thư mục..."
        />

        {/* Nút tạo thư mục con (chỉ hiện khi đã chọn Năm trong chế độ Folder) */}
        {viewMode === 'folder' && selectedYear && (
          <button
            className="btn btn-outline"
            onClick={() => { setNewFolderName(''); setCreateFolderModalOpen(true); }}
            title={currentFolderName ? `Tạo thư mục con bên trong "${currentFolderName}"` : `Tạo thư mục mới trong Năm ${selectedYear}`}
          >
            📁 + {currentFolderName ? 'Tạo thư mục con' : 'Tạo thư mục mới'}
          </button>
        )}

        {/* Nút thêm năm mới khi ở thư mục gốc */}
        {viewMode === 'folder' && !selectedYear && (
          <button
            className="btn btn-outline"
            onClick={() => { setNewYearInput(''); setCreateYearModalOpen(true); }}
            title="Thêm năm mới vào danh sách"
          >
            📅 + Thêm năm
          </button>
        )}

        <button className="btn btn-primary" onClick={openAdd}>+ Thêm mới Tài sản</button>

        <button className="btn btn-outline btn-sm" onClick={() => exportAssetsToExcel(activeFiltered)} disabled={!activeFiltered.length}>
          Xuất Excel
        </button>
        <button className="btn btn-outline btn-sm" onClick={handleExportPDF} disabled={!activeFiltered.length}>
          Xuất PDF
        </button>
      </div>

      {/* ================= GIAO DIỆN THƯ MỤC ================= */}
      {viewMode === 'folder' ? (
        <div>
          {/* Breadcrumb Navigation đa tầng */}
          <div className="folder-breadcrumb">
            <button
              type="button"
              className={`breadcrumb-item ${!selectedYear ? 'active' : ''}`}
              onClick={() => { setSelectedYear(null); setFolderPath([]); }}
            >
              🏠 Quản lý Tài sản
            </button>
            {selectedYear && (
              <>
                <span className="breadcrumb-separator">/</span>
                <button
                  type="button"
                  className={`breadcrumb-item ${folderPath.length === 0 ? 'active' : ''}`}
                  onClick={() => setFolderPath([])}
                >
                  📁 Năm {selectedYear}
                </button>
              </>
            )}
            {folderPath.map((item, idx) => {
              const isLast = idx === folderPath.length - 1;
              return (
                <span key={item.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span className="breadcrumb-separator">/</span>
                  {isLast ? (
                    <span className="breadcrumb-item active">
                      📂 {item.name}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="breadcrumb-item"
                      onClick={() => setFolderPath(folderPath.slice(0, idx + 1))}
                    >
                      📁 {item.name}
                    </button>
                  )}
                </span>
              );
            })}
          </div>

          {/* CẤP 0: Hiển thị các Năm */}
          {!selectedYear && !search && (
            <div>
              <div className="folder-section-title">
                <span>📁 Chọn Năm trang bị để quản lý tài sản</span>
              </div>
              <div className="folder-grid">
                {availableYears.map(y => {
                  const count = items.filter(a => getAssetYear(a) === y).length;
                  return (
                    <div
                      key={y}
                      className="folder-card"
                      onClick={() => { setSelectedYear(y); setFolderPath([]); }}
                      title={`Vào năm ${y}`}
                    >
                      <div className="folder-card-icon">📁</div>
                      <div className="folder-card-info">
                        <div className="folder-card-name">Năm {y}</div>
                        <div className="folder-card-count">{count} tài sản</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CẤP 1 & 2 & n: Thư mục con do người dùng tự tạo */}
          {selectedYear && !search && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="folder-section-title" style={{ margin: 0 }}>
                  <span>📂 Thư mục con {currentFolderName ? `trong "${currentFolderName}"` : `trong Năm ${selectedYear}`} ({customFolders.length})</span>
                </div>
                <button
                  className="btn btn-outline btn-xs"
                  onClick={() => { setNewFolderName(''); setCreateFolderModalOpen(true); }}
                >
                  + Tạo thư mục mới
                </button>
              </div>

              {customFolders.length === 0 ? (
                <div className="folder-empty-state">
                  <div className="folder-empty-icon">📁</div>
                  <div className="folder-empty-text">
                    Chưa có thư mục con nào tại đây.
                    <br />
                    Bạn có thể tự tạo thư mục như "Phòng máy 301", "Hội trường lớn", "Văn phòng Khoa CNTT", "Bộ môn Mạng"... tùy ý bạn.
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => { setNewFolderName(''); setCreateFolderModalOpen(true); }}
                  >
                    📁 + Tạo thư mục mới
                  </button>
                </div>
              ) : (
                <div className="folder-grid">
                  {customFolders.map(folder => {
                    const count = items.filter(a => a.folderId === folder.id).length;
                    return (
                      <div
                        key={folder.id}
                        className="folder-card"
                        onClick={() => setFolderPath(prev => [...prev, { id: folder.id, name: folder.name }])}
                        title={`Mở thư mục: ${folder.name}`}
                      >
                        <div className="folder-card-icon">📂</div>
                        <div className="folder-card-info" style={{ flex: 1 }}>
                          <div className="folder-card-name">{folder.name}</div>
                          <div className="folder-card-count">{count} tài sản</div>
                        </div>
                        <div className="folder-card-actions">
                          <button
                            type="button"
                            className="folder-action-btn"
                            title="Đổi tên thư mục"
                            onClick={(e) => openRenameModal(e, folder)}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="folder-action-btn delete"
                            title="Xóa thư mục"
                            onClick={(e) => handleDeleteFolder(e, folder)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Bảng danh sách Tài sản (Chỉ hiển thị khi đã chọn Năm hoặc khi đang tìm kiếm) */}
          {(selectedYear || search) && (
            <div style={{ marginTop: 10 }}>
              <div className="folder-section-title">
                <span>
                  🏢 Danh sách Tài sản {currentFolderName ? `trong "${currentFolderName}"` : selectedYear ? `trong Năm ${selectedYear}` : 'Kết quả tìm kiếm'} ({folderFiltered.length} tài sản)
                </span>
              </div>
              <div className="table-card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Mã tài sản</th>
                        <th>Tên tài sản</th>
                        <th>Loại</th>
                        <th style={{ textAlign: 'center' }}>Số lượng</th>
                        <th>Phòng sử dụng</th>
                        <th>Thư mục lưu trữ</th>
                        <th>Ngày đưa vào SD</th>
                        <th>Khấu hao</th>
                        <th>Trạng thái khấu hao</th>
                        <th>Tình trạng</th>
                        <th>Biên bản / File</th>
                        <th>Ghi chú</th>
                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={13}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                      ) : folderFiltered.length === 0 ? (
                        <tr><td colSpan={13}><div className="table-empty"><div className="table-empty-icon">🏢</div><p>{search ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có tài sản nào trong thư mục này. Nhấn "+ Thêm mới Tài sản" để lưu trữ vào đây.'}</p></div></td></tr>
                      ) : folderFiltered.map(a => {
                        const { label, variant } = getDepreciationBadge(a.monthsLeft);
                        const rowCls = getWarningRowClass(a.monthsLeft, 1);
                        const condMap = { 'Tốt': 'badge-success', 'Bình thường': 'badge-info', 'Cần bảo trì': 'badge-warning', 'Hỏng': 'badge-danger', 'Đã thanh lý': 'badge-default' };
                        return (
                          <tr key={a.id} className={rowCls}>
                            <td><strong>{a.code}</strong></td>
                            <td>{a.name}</td>
                            <td>{a.type}</td>
                            <td style={{ textAlign: 'center' }}>{a.quantity}</td>
                            <td>{a.room}</td>
                            <td>
                              {a.folderName ? (
                                <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  📁 {a.folderName}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Thư mục chung</span>
                              )}
                            </td>
                            <td>{formatDate(a.startDate)}</td>
                            <td>{a.depreciationMonths} tháng</td>
                            <td><span className={`badge ${variant}`}>{label}</span></td>
                            <td><span className={`badge ${condMap[a.condition] || 'badge-default'}`}>{a.condition}</span></td>
                            <td>{a.fileName ? <FilePill fileName={a.fileName} url={a.fileUrl} /> : <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>}</td>
                            <td style={{ maxWidth: 160, color: 'var(--text-secondary)', fontSize: 12 }}>{a.notes}</td>
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <button className="btn btn-outline btn-xs" onClick={() => openEdit(a)}>Chỉnh sửa</button>
                              {' '}
                              <button className="btn btn-danger btn-xs" onClick={() => handleDelete(a)}>Xóa</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= GIAO DIỆN BẢNG TOÀN BỘ ================= */
        <div className="table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã tài sản</th>
                  <th>Tên tài sản</th>
                  <th>Loại</th>
                  <th style={{ textAlign: 'center' }}>Số lượng</th>
                  <th>Phòng sử dụng</th>
                  <th>Năm</th>
                  <th>Thư mục lưu trữ</th>
                  <th>Ngày đưa vào SD</th>
                  <th>Khấu hao</th>
                  <th>Trạng thái khấu hao</th>
                  <th>Tình trạng</th>
                  <th>Biên bản / File</th>
                  <th>Ghi chú</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={14}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                ) : tableFiltered.length === 0 ? (
                  <tr><td colSpan={14}><div className="table-empty"><div className="table-empty-icon">🏢</div><p>{search ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có tài sản nào. Nhấn "+ Thêm mới" để bắt đầu.'}</p></div></td></tr>
                ) : tableFiltered.map(a => {
                  const { label, variant } = getDepreciationBadge(a.monthsLeft);
                  const rowCls = getWarningRowClass(a.monthsLeft, 1);
                  const condMap = { 'Tốt': 'badge-success', 'Bình thường': 'badge-info', 'Cần bảo trì': 'badge-warning', 'Hỏng': 'badge-danger', 'Đã thanh lý': 'badge-default' };
                  return (
                    <tr key={a.id} className={rowCls}>
                      <td><strong>{a.code}</strong></td>
                      <td>{a.name}</td>
                      <td>{a.type}</td>
                      <td style={{ textAlign: 'center' }}>{a.quantity}</td>
                      <td>{a.room}</td>
                      <td>{a.yearCalculated}</td>
                      <td>
                        {a.folderName ? (
                          <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            📁 {a.folderName}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Chung</span>
                        )}
                      </td>
                      <td>{formatDate(a.startDate)}</td>
                      <td>{a.depreciationMonths} tháng</td>
                      <td><span className={`badge ${variant}`}>{label}</span></td>
                      <td><span className={`badge ${condMap[a.condition] || 'badge-default'}`}>{a.condition}</span></td>
                      <td>{a.fileName ? <FilePill fileName={a.fileName} url={a.fileUrl} /> : <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>}</td>
                      <td style={{ maxWidth: 160, color: 'var(--text-secondary)', fontSize: 12 }}>{a.notes}</td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button className="btn btn-outline btn-xs" onClick={() => openEdit(a)}>Chỉnh sửa</button>
                        {' '}
                        <button className="btn btn-danger btn-xs" onClick={() => handleDelete(a)}>Xóa</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL TẠO THƯ MỤC MỚI ================= */}
      <Modal
        open={createFolderModalOpen}
        onClose={() => setCreateFolderModalOpen(false)}
        title={currentFolderName ? `Tạo thư mục con bên trong "${currentFolderName}"` : `Tạo thư mục mới trong Năm ${selectedYear || ''}`}
        size="modal-sm"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setCreateFolderModalOpen(false)}>Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleCreateFolder} disabled={creatingFolder}>
              {creatingFolder ? 'Đang tạo...' : 'Tạo thư mục'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Tên thư mục <span className="required">*</span></label>
          <input
            className="form-control"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); }}
          />
        </div>
      </Modal>

      {/* ================= MODAL ĐỔI TÊN THƯ MỤC ================= */}
      <Modal
        open={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title="Đổi tên thư mục"
        size="modal-sm"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setRenameModalOpen(false)}>Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleRenameFolder}>Lưu thay đổi</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Tên thư mục mới <span className="required">*</span></label>
          <input
            className="form-control"
            value={editFolderName}
            onChange={e => setEditFolderName(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleRenameFolder(); }}
          />
        </div>
      </Modal>

      {/* ================= MODAL THÊM NĂM MỚI ================= */}
      <Modal
        open={createYearModalOpen}
        onClose={() => setCreateYearModalOpen(false)}
        title="Thêm Năm mới"
        size="modal-sm"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setCreateYearModalOpen(false)}>Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleAddCustomYear}>Thêm năm</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Năm mới <span className="required">*</span></label>
          <input
            className="form-control"
            value={newYearInput}
            onChange={e => setNewYearInput(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleAddCustomYear(); }}
          />
        </div>
      </Modal>

      {/* ================= MODAL THÊM / SỬA TÀI SẢN ================= */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Chỉnh sửa Tài sản' : currentFolderName ? `Thêm mới Tài sản vào: 📂 ${currentFolderName}` : 'Thêm mới Tài sản'}
        size="modal-lg"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : (editId ? 'Cập nhật' : 'Thêm tài sản')}
            </button>
          </>
        }
      >
        {/* Vị trí lưu trữ */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Thư mục đích lưu trữ</label>
          <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
            {form.folderName ? `📂 ${form.folderName} (Năm ${form.year || selectedYear || '2026'})` : `📁 Năm ${form.year || selectedYear || '2026'}`}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Mã tài sản <span className="required">*</span></label>
            <input className="form-control" value={form.code} onChange={e => setF('code', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tên tài sản <span className="required">*</span></label>
            <input className="form-control" value={form.name} onChange={e => setF('name', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1.2 }}>
            <label className="form-label">Loại tài sản</label>
            <select className="form-control" value={form.type} onChange={e => setF('type', e.target.value)}>
              {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: '0 0 90px' }}>
            <label className="form-label">Số lượng</label>
            <input className="form-control" type="number" min="1" value={form.quantity} onChange={e => setF('quantity', parseInt(e.target.value) || 1)} />
          </div>
          <div className="form-group" style={{ flex: 1.5 }}>
            <label className="form-label">Phòng / Nơi sử dụng</label>
            <input className="form-control" value={form.room} onChange={e => setF('room', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1.2 }}>
            <label className="form-label">Ngày đưa vào SD <span className="required">*</span></label>
            <input
              className="form-control"
              type="date"
              value={form.startDate}
              onChange={e => {
                setF('startDate', e.target.value);
                if (e.target.value && e.target.value.length >= 4) {
                  setF('year', e.target.value.substring(0, 4));
                }
              }}
            />
          </div>
          <div className="form-group" style={{ flex: 0.9 }}>
            <label className="form-label">Năm trang bị</label>
            <input
              type="number"
              className="form-control"
              value={form.year}
              onChange={e => setF('year', e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Khấu hao (tháng) <span className="required">*</span></label>
            <input className="form-control" type="number" min="1" value={form.depreciationMonths} onChange={e => setF('depreciationMonths', parseInt(e.target.value) || 36)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Tình trạng</label>
            <select className="form-control" value={form.condition} onChange={e => setF('condition', e.target.value)}>
              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">File Biên bản bàn giao / Hóa đơn đính kèm (PDF, Word, Ảnh scan)</label>
          <UploadArea
            onFileSelect={files => setAssetFile(files[0])}
            allowedTypes={['pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png']}
            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
            hint="PDF, Word, JPG, PNG – Bản scan biên bản bàn giao hoặc hóa đơn"
            selectedFiles={assetFile ? [assetFile] : []}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú / Mô tả</label>
          <textarea className="form-control" rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} />
        </div>
      </Modal>

    </div>
  );
};

export default AssetsPage;
