// src/pages/TeachingPage.jsx
// Module 5: Quản lý Khối lượng Giảng dạy (Định mức + Hợp đồng) với Thư mục tự do đa tầng
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getTeachingNorms, addTeachingNorm, deleteTeachingNorm,
  getTeachingContracts, addTeachingContract, deleteTeachingContract,
} from '../services/teachingService';
import {
  getFolders, createFolder, renameFolder, deleteFolder,
} from '../services/folderService';
import SearchBar from '../components/common/SearchBar';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import FilePill from '../components/common/FilePill';
import UploadArea from '../components/common/UploadArea';
import { useConfirm } from '../context/ConfirmContext';
import toast from 'react-hot-toast';


const curY = new Date().getFullYear();
const defYear = `${curY - 1}-${curY}`;

const EMPTY_NORM = { lecturerName: '', title: 'ThS', department: '', academicYear: defYear, norm: 270, actual: 0, folderId: null, folderName: '' };
const EMPTY_CONTRACT = { lecturerName: '', title: 'TS', department: '', subject: '', academicYear: defYear, hours: 0, folderId: null, folderName: '' };
const TITLES = ['GS.TS', 'PGS.TS', 'TS', 'ThS', 'CN'];

const getTeachingYear = (item) => {
  if (item?.academicYear) return String(item.academicYear);
  if (item?.year) return String(item.year);
  if (item?.createdAt?.toDate) {
    const y = item.createdAt.toDate().getFullYear();
    return `${y - 1}-${y}`;
  }
  return '2025-2026';
};

const TeachingPage = () => {
  const { user, isAdmin } = useAuth();
  const confirm = useConfirm();
  const [tab, setTab] = useState('norm');
  const [norms, setNorms] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [customFolders, setCustomFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('folder'); // 'folder' | 'table'

  // Quản lý đường dẫn thư mục đa tầng (Nested Subfolders)
  const [selectedYear, setSelectedYear] = useState(null);
  const [folderPath, setFolderPath] = useState([]); // [{ id, name }]

  // Modal Thêm dữ liệu
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_NORM);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  // Modal Tạo Thư mục mới
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Modal Đổi tên Thư mục
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');

  // Modal Thêm năm học mới
  const [createYearModalOpen, setCreateYearModalOpen] = useState(false);
  const [customYears, setCustomYears] = useState([]);
  const [newYearInput, setNewYearInput] = useState('');

  const currentParentId = folderPath.length > 0 ? folderPath[folderPath.length - 1].id : null;
  const currentFolderName = folderPath.length > 0 ? folderPath[folderPath.length - 1].name : null;
  const currentModule = tab === 'norm' ? 'teaching_norm' : 'teaching_contract';

  const load = async () => {
    setLoading(true);
    try {
      const [n, c] = await Promise.all([getTeachingNorms(), getTeachingContracts()]);
      setNorms(n);
      setContracts(c);
    } catch {
      toast.error('Lỗi tải dữ liệu giảng dạy!');
    } finally {
      setLoading(false);
    }
  };

  const loadSubfolders = async (year, parentId = null) => {
    if (!year) return;
    try {
      const f = await getFolders(currentModule, year, parentId);
      setCustomFolders(f);
    } catch (e) {
      console.error('Lỗi tải thư mục:', e);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (selectedYear) {
      loadSubfolders(selectedYear, currentParentId);
    } else {
      setCustomFolders([]);
    }
  }, [selectedYear, currentParentId, tab]);

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    setFolderPath([]);
  };

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openModal = () => {
    const base = tab === 'norm' ? { ...EMPTY_NORM } : { ...EMPTY_CONTRACT };
    base.academicYear = selectedYear || defYear;
    base.folderId = currentParentId || null;
    base.folderName = currentFolderName || '';
    setForm(base);
    setFiles([]);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.lecturerName.trim() || !form.department.trim()) {
      toast.error('Vui lòng điền họ tên và bộ môn!');
      return;
    }
    if (tab === 'contract' && !form.subject?.trim()) {
      toast.error('Vui lòng điền tên môn học!');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        folderId: currentParentId || null,
        folderName: currentFolderName || '',
      };
      if (tab === 'norm') {
        await addTeachingNorm(payload, files, user);
      } else {
        await addTeachingContract(payload, files, user);
      }
      toast.success('Thêm dữ liệu thành công!');
      setModalOpen(false);
      await load();
      if (selectedYear) {
        await loadSubfolders(selectedYear, currentParentId);
      }
    } catch (err) {
      toast.error(err?.message || 'Lỗi khi lưu!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const ok = await confirm({
      title: 'Xác nhận xóa dữ liệu giảng dạy',
      message: `Bạn có chắc muốn xóa dữ liệu giảng dạy của "${item.lecturerName}"?`,
      confirmText: 'Xóa dữ liệu',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;
    try {
      if (tab === 'norm') await deleteTeachingNorm(item.id, item.lecturerName, user);
      else await deleteTeachingContract(item.id, item.lecturerName, user);
      toast.success('Đã xóa!');
      await load();
      if (selectedYear) {
        await loadSubfolders(selectedYear, currentParentId);
      }
    } catch {
      toast.error('Lỗi khi xóa!');
    }
  };

  // Tạo thư mục mới
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Vui lòng nhập tên thư mục!');
      return;
    }
    setCreatingFolder(true);
    try {
      const created = await createFolder({
        name: newFolderName.trim(),
        module: currentModule,
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
      await renameFolder(editingFolder.id, editFolderName.trim(), user, currentModule);
      toast.success('Đã đổi tên thư mục thành công!');
      setRenameModalOpen(false);
      await loadSubfolders(selectedYear, currentParentId);
    } catch (e) {
      toast.error('Lỗi khi đổi tên: ' + e.message);
    }
  };

  const handleDeleteFolder = async (e, f) => {
    e.stopPropagation();
    const currentList = tab === 'norm' ? norms : contracts;
    const count = currentList.filter(item => item.folderId === f.id).length;
    const msg = count > 0
      ? `Thư mục "${f.name}" đang chứa ${count} bản ghi. Bạn có chắc muốn xóa thư mục này không?`
      : `Bạn có chắc muốn xóa thư mục "${f.name}"?`;
    const ok = await confirm({
      title: 'Xác nhận xóa thư mục',
      message: msg,
      confirmText: 'Xóa thư mục',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;

    try {
      await deleteFolder(f.id, f.name, user, currentModule);
      toast.success(`Đã xóa thư mục "${f.name}"!`);
      await loadSubfolders(selectedYear, currentParentId);
    } catch (err) {
      toast.error('Lỗi khi xóa: ' + err.message);
    }
  };

  const handleAddCustomYear = () => {
    if (!newYearInput.trim()) {
      toast.error('Vui lòng nhập năm học (2027-2028)!');
      return;
    }
    const y = newYearInput.trim();
    if (!customYears.includes(y)) {
      setCustomYears(prev => [y, ...prev]);
    }
    toast.success(`Đã thêm năm học ${y}!`);
    setNewYearInput('');
    setCreateYearModalOpen(false);
    setSelectedYear(y);
    setFolderPath([]);
  };

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const defaultYears = [
      `${currentYear}-${currentYear + 1}`,
      `${currentYear - 1}-${currentYear}`,
      `${currentYear - 2}-${currentYear - 1}`,
      `${currentYear - 3}-${currentYear - 2}`,
    ];
    const dataYears = [...norms, ...contracts].map(getTeachingYear).filter(Boolean);
    return Array.from(new Set([...defaultYears, ...customYears, ...dataYears]));
  }, [norms, contracts, customYears]);

  const currentList = tab === 'norm' ? norms : contracts;

  // Lọc theo thư mục hiện tại
  const folderFilteredList = useMemo(() => {
    let result = currentList;
    if (selectedYear) {
      result = result.filter(item => getTeachingYear(item) === selectedYear);
    }
    if (currentParentId) {
      result = result.filter(item => item.folderId === currentParentId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.lecturerName?.toLowerCase().includes(q) ||
        item.department?.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q) ||
        item.folderName?.toLowerCase().includes(q) ||
        getTeachingYear(item)?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [currentList, selectedYear, currentParentId, search]);

  // Chế độ xem toàn bộ dạng bảng phẳng
  const tableFilteredList = useMemo(() => {
    let result = currentList;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.lecturerName?.toLowerCase().includes(q) ||
        item.department?.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q) ||
        item.folderName?.toLowerCase().includes(q) ||
        getTeachingYear(item)?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [currentList, search]);

  const normStats = useMemo(() => ({
    total: norms.length,
    over: norms.filter(n => n.actual > n.norm).length,
    under: norms.filter(n => n.actual < n.norm).length,
    exact: norms.filter(n => n.actual === n.norm).length,
  }), [norms]);

  return (
    <div>
      {/* Stats */}
      <div className="stat-grid">
        <StatCard num={normStats.total} label="Tổng GV định mức" variant="primary" />
        <StatCard num={normStats.over} label="Vượt định mức" variant="warning" />
        <StatCard num={normStats.under} label="Thiếu định mức" variant="danger" />
        <StatCard num={contracts.length} label="Tổng GV hợp đồng" variant="success" />
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'norm' ? 'active' : ''}`} onClick={() => handleTabChange('norm')}>
          📋 Khối lượng Định mức
        </button>
        <button className={`tab-btn ${tab === 'contract' ? 'active' : ''}`} onClick={() => handleTabChange('contract')}>
          📝 Khối lượng Hợp đồng
        </button>
      </div>

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

        <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên giảng viên, bộ môn, môn học, thư mục..." />

        {/* Nút tạo thư mục con (chỉ hiện khi đã chọn Năm trong chế độ Folder) */}
        {viewMode === 'folder' && selectedYear && (
          <button
            className="btn btn-outline"
            onClick={() => { setNewFolderName(''); setCreateFolderModalOpen(true); }}
            title={currentFolderName ? `Tạo thư mục con bên trong "${currentFolderName}"` : `Tạo thư mục mới trong Năm học ${selectedYear}`}
          >
            📁 + {currentFolderName ? 'Tạo thư mục con' : 'Tạo thư mục mới'}
          </button>
        )}

        {/* Nút thêm năm học mới khi ở thư mục gốc */}
        {viewMode === 'folder' && !selectedYear && (
          <button
            className="btn btn-outline"
            onClick={() => { setNewYearInput(''); setCreateYearModalOpen(true); }}
            title="Thêm năm học mới vào danh sách"
          >
            📅 + Thêm năm học
          </button>
        )}


        <button className="btn btn-primary" onClick={openModal}>
          + {tab === 'norm' ? 'Thêm dữ liệu Định mức' : 'Thêm Hợp đồng Giảng dạy'}
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
              🏠 {tab === 'norm' ? 'Định mức Giảng dạy' : 'Hợp đồng Giảng dạy'}
            </button>
            {selectedYear && (
              <>
                <span className="breadcrumb-separator">/</span>
                <button
                  type="button"
                  className={`breadcrumb-item ${folderPath.length === 0 ? 'active' : ''}`}
                  onClick={() => setFolderPath([])}
                >
                  📁 Năm học {selectedYear}
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

          {/* CẤP 0: Hiển thị các Năm học */}
          {!selectedYear && !search && (
            <div>
              <div className="folder-section-title">
                <span>📁 Chọn Năm học để quản lý</span>
              </div>
              <div className="folder-grid">
                {availableYears.map(y => {
                  const count = currentList.filter(item => getTeachingYear(item) === y).length;
                  return (
                    <div
                      key={y}
                      className="folder-card"
                      onClick={() => { setSelectedYear(y); setFolderPath([]); }}
                      title={`Vào năm học ${y}`}
                    >
                      <div className="folder-card-icon">📁</div>
                      <div className="folder-card-info">
                        <div className="folder-card-name">Năm học {y}</div>
                        <div className="folder-card-count">{count} bản ghi</div>
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
                  <span>📂 Thư mục con {currentFolderName ? `trong "${currentFolderName}"` : `trong Năm học ${selectedYear}`} ({customFolders.length})</span>
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
                    Bạn có thể tự tạo thư mục như "Bộ môn Toán", "Bộ môn CNTT", "Học kỳ 1", "Đợt bổ sung"... tùy ý bạn.
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
                    const count = currentList.filter(item => item.folderId === folder.id).length;
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
                          <div className="folder-card-count">{count} bản ghi</div>
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

          {/* Bảng danh sách trong Thư mục (Chỉ hiển thị khi đã chọn Năm học hoặc khi đang tìm kiếm) */}
          {(selectedYear || search) && (
            <div style={{ marginTop: 10 }}>
              <div className="folder-section-title">
                <span>
                  📄 Dữ liệu {currentFolderName ? `trong "${currentFolderName}"` : selectedYear ? `trong Năm học ${selectedYear}` : 'Kết quả tìm kiếm'} ({folderFilteredList.length} bản ghi)
                </span>
              </div>

              {tab === 'norm' ? (
                <div className="table-card">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Học hàm/Vị</th>
                          <th>Họ tên Giảng viên</th>
                          <th>Bộ môn</th>
                          <th>Thư mục lưu trữ</th>
                          <th>Năm học</th>
                          <th style={{ textAlign: 'center' }}>Định mức (tiết)</th>
                          <th style={{ textAlign: 'center' }}>Thực tế (tiết)</th>
                          <th style={{ textAlign: 'center' }}>Chênh lệch</th>
                          <th>File minh chứng</th>
                          <th style={{ textAlign: 'center' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan={10}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                        ) : folderFilteredList.length === 0 ? (
                          <tr><td colSpan={10}><div className="table-empty"><div className="table-empty-icon">📚</div><p>{search ? 'Không tìm thấy kết quả.' : 'Chưa có dữ liệu trong thư mục này. Nhấn "+ Thêm dữ liệu Định mức" để lưu vào đây.'}</p></div></td></tr>
                        ) : folderFilteredList.map(n => {
                          const diff = (n.actual || 0) - (n.norm || 0);
                          const diffBadge = diff > 0
                            ? <span className="badge badge-warning">+{diff} vượt</span>
                            : diff < 0
                              ? <span className="badge badge-danger">{diff} thiếu</span>
                              : <span className="badge badge-success">Đủ định mức</span>;
                          return (
                            <tr key={n.id}>
                              <td>{n.title}</td>
                              <td><strong>{n.lecturerName}</strong></td>
                              <td>{n.department}</td>
                              <td>
                                {n.folderName ? (
                                  <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    📁 {n.folderName}
                                  </span>
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Thư mục chung</span>
                                )}
                              </td>
                              <td><span className="badge badge-info">{getTeachingYear(n)}</span></td>
                              <td style={{ textAlign: 'center' }}>{n.norm}</td>
                              <td style={{ textAlign: 'center', fontWeight: 700 }}>{n.actual}</td>
                              <td style={{ textAlign: 'center' }}>{diffBadge}</td>
                              <td>
                                {n.attachments?.length > 0
                                  ? n.attachments.map((f, i) => <FilePill key={i} fileName={f.name} url={f.url} />)
                                  : <span className="text-muted">—</span>}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button className="btn btn-danger btn-xs" onClick={() => handleDelete(n)}>Xóa</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="table-card">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Học hàm/Vị</th>
                          <th>Họ tên Giảng viên</th>
                          <th>Bộ môn</th>
                          <th>Môn học</th>
                          <th>Thư mục lưu trữ</th>
                          <th>Năm học</th>
                          <th style={{ textAlign: 'center' }}>Số giờ</th>
                          <th>File minh chứng</th>
                          <th style={{ textAlign: 'center' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan={9}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                        ) : folderFilteredList.length === 0 ? (
                          <tr><td colSpan={9}><div className="table-empty"><div className="table-empty-icon">📝</div><p>{search ? 'Không tìm thấy kết quả.' : 'Chưa có hợp đồng nào trong thư mục này. Nhấn "+ Thêm Hợp đồng Giảng dạy" để lưu vào đây.'}</p></div></td></tr>
                        ) : folderFilteredList.map(c => (
                          <tr key={c.id}>
                            <td>{c.title}</td>
                            <td><strong>{c.lecturerName}</strong></td>
                            <td>{c.department}</td>
                            <td>{c.subject}</td>
                            <td>
                              {c.folderName ? (
                                <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  📁 {c.folderName}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Thư mục chung</span>
                              )}
                            </td>
                            <td><span className="badge badge-info">{getTeachingYear(c)}</span></td>
                            <td style={{ textAlign: 'center', fontWeight: 700 }}>{c.hours} tiết</td>
                            <td>
                              {c.attachments?.length > 0
                                ? c.attachments.map((f, i) => <FilePill key={i} fileName={f.name} url={f.url} />)
                                : <span className="text-muted">—</span>}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button className="btn btn-danger btn-xs" onClick={() => handleDelete(c)}>Xóa</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ================= GIAO DIỆN BẢNG PHẲNG TOÀN BỘ ================= */
        tab === 'norm' ? (
          <div className="table-card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Học hàm/Vị</th>
                    <th>Họ tên Giảng viên</th>
                    <th>Bộ môn</th>
                    <th>Thư mục lưu trữ</th>
                    <th>Năm học</th>
                    <th style={{ textAlign: 'center' }}>Định mức (tiết)</th>
                    <th style={{ textAlign: 'center' }}>Thực tế (tiết)</th>
                    <th style={{ textAlign: 'center' }}>Chênh lệch</th>
                    <th>File minh chứng</th>
                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={10}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                  ) : tableFilteredList.length === 0 ? (
                    <tr><td colSpan={10}><div className="table-empty"><div className="table-empty-icon">📚</div><p>{search ? 'Không tìm thấy kết quả.' : 'Chưa có dữ liệu.'}</p></div></td></tr>
                  ) : tableFilteredList.map(n => {
                    const diff = (n.actual || 0) - (n.norm || 0);
                    const diffBadge = diff > 0
                      ? <span className="badge badge-warning">+{diff} vượt</span>
                      : diff < 0
                        ? <span className="badge badge-danger">{diff} thiếu</span>
                        : <span className="badge badge-success">Đủ định mức</span>;
                    return (
                      <tr key={n.id}>
                        <td>{n.title}</td>
                        <td><strong>{n.lecturerName}</strong></td>
                        <td>{n.department}</td>
                        <td>
                          {n.folderName ? (
                            <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              📁 {n.folderName}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Chung</span>
                          )}
                        </td>
                        <td><span className="badge badge-info">{getTeachingYear(n)}</span></td>
                        <td style={{ textAlign: 'center' }}>{n.norm}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{n.actual}</td>
                        <td style={{ textAlign: 'center' }}>{diffBadge}</td>
                        <td>
                          {n.attachments?.length > 0
                            ? n.attachments.map((f, i) => <FilePill key={i} fileName={f.name} url={f.url} />)
                            : <span className="text-muted">—</span>}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button className="btn btn-danger btn-xs" onClick={() => handleDelete(n)}>Xóa</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="table-card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Học hàm/Vị</th>
                    <th>Họ tên Giảng viên</th>
                    <th>Bộ môn</th>
                    <th>Môn học</th>
                    <th>Thư mục lưu trữ</th>
                    <th>Năm học</th>
                    <th style={{ textAlign: 'center' }}>Số giờ</th>
                    <th>File minh chứng</th>
                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                  ) : tableFilteredList.length === 0 ? (
                    <tr><td colSpan={9}><div className="table-empty"><div className="table-empty-icon">📝</div><p>{search ? 'Không tìm thấy kết quả.' : 'Chưa có dữ liệu.'}</p></div></td></tr>
                  ) : tableFilteredList.map(c => (
                    <tr key={c.id}>
                      <td>{c.title}</td>
                      <td><strong>{c.lecturerName}</strong></td>
                      <td>{c.department}</td>
                      <td>{c.subject}</td>
                      <td>
                        {c.folderName ? (
                          <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            📁 {c.folderName}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Chung</span>
                        )}
                      </td>
                      <td><span className="badge badge-info">{getTeachingYear(c)}</span></td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{c.hours} tiết</td>
                      <td>
                        {c.attachments?.length > 0
                          ? c.attachments.map((f, i) => <FilePill key={i} fileName={f.name} url={f.url} />)
                          : <span className="text-muted">—</span>}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn btn-danger btn-xs" onClick={() => handleDelete(c)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* ================= MODAL TẠO THƯ MỤC MỚI ================= */}
      <Modal
        open={createFolderModalOpen}
        onClose={() => setCreateFolderModalOpen(false)}
        title={currentFolderName ? `Tạo thư mục con bên trong "${currentFolderName}"` : `Tạo thư mục mới trong Năm học ${selectedYear || ''}`}
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

      {/* ================= MODAL THÊM NĂM HỌC MỚI ================= */}
      <Modal
        open={createYearModalOpen}
        onClose={() => setCreateYearModalOpen(false)}
        title="Thêm Năm học mới"
        size="modal-sm"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setCreateYearModalOpen(false)}>Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleAddCustomYear}>Thêm năm học</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Năm học mới <span className="required">*</span></label>
          <input
            className="form-control"
            value={newYearInput}
            onChange={e => setNewYearInput(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleAddCustomYear(); }}
          />
        </div>
      </Modal>

      {/* ================= MODAL THÊM DỮ LIỆU GIẢNG DẠY ================= */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={tab === 'norm' ? (currentFolderName ? `Thêm Định mức vào: 📂 ${currentFolderName}` : 'Thêm Khối lượng Định mức') : (currentFolderName ? `Thêm Hợp đồng vào: 📂 ${currentFolderName}` : 'Thêm Khối lượng Hợp đồng')}
        size="modal-md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Thêm dữ liệu'}
            </button>
          </>
        }
      >
        {/* Vị trí lưu trữ */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Thư mục đích lưu trữ</label>
          <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
            {currentFolderName ? `📂 ${currentFolderName} (Năm học ${form.academicYear || selectedYear || defYear})` : `📁 Năm học ${form.academicYear || selectedYear || defYear}`}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: '0 0 130px' }}>
            <label className="form-label">Học hàm/Vị</label>
            <select className="form-control" value={form.title} onChange={e => setF('title', e.target.value)}>
              {TITLES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1.4 }}>
            <label className="form-label">Họ tên Giảng viên <span className="required">*</span></label>
            <input className="form-control" value={form.lecturerName} onChange={e => setF('lecturerName', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Năm học <span className="required">*</span></label>
            <select
              className="form-control"
              value={form.academicYear || defYear}
              onChange={e => setF('academicYear', e.target.value)}
            >
              {availableYears.map(y => (
                <option key={y} value={y}>Năm học {y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Bộ môn <span className="required">*</span></label>
            <input className="form-control" value={form.department} onChange={e => setF('department', e.target.value)} />
          </div>
          {tab === 'contract' && (
            <div className="form-group">
              <label className="form-label">Môn học <span className="required">*</span></label>
              <input className="form-control" value={form.subject} onChange={e => setF('subject', e.target.value)} />
            </div>
          )}
        </div>
        {tab === 'norm' ? (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Định mức (tiết) <span className="required">*</span></label>
              <input className="form-control" type="number" min="0" value={form.norm} onChange={e => setF('norm', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">Thực tế (tiết) <span className="required">*</span></label>
              <input className="form-control" type="number" min="0" value={form.actual} onChange={e => setF('actual', parseInt(e.target.value) || 0)} />
            </div>
          </div>
        ) : (
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label">Số giờ giảng <span className="required">*</span></label>
            <input className="form-control" type="number" min="0" value={form.hours} onChange={e => setF('hours', parseInt(e.target.value) || 0)} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Upload file minh chứng (TKB, bảng chấm công...)</label>
          <UploadArea
            onFileSelect={f => setFiles(prev => [...prev, ...f])}
            onRemoveFile={idx => setFiles(prev => prev.filter((_, i) => i !== idx))}
            multiple={true}
            allowedTypes={['pdf', 'xlsx', 'xls', 'docx', 'doc', 'jpg', 'jpeg', 'png']}
            accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png"
            hint="PDF, Excel, Word, Ảnh scan – Có thể chọn nhiều file"
            selectedFiles={files}
          />
        </div>
      </Modal>

    </div>
  );
};

export default TeachingPage;
