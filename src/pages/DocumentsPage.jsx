// src/pages/DocumentsPage.jsx
// Module 4: Quản lý Văn bản (Đến + Đi) với Thư mục tự do đa tầng (Nested Subfolders)
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getIncomingDocs, addIncomingDoc, updateIncomingDoc, updateIncomingDocStatus, deleteIncomingDoc,
  getOutgoingDocs, addOutgoingDoc, updateOutgoingDoc, updateOutgoingDocStatus, deleteOutgoingDoc,
} from '../services/documentService';
import {
  getFolders, createFolder, renameFolder, deleteFolder,
} from '../services/folderService';
import { formatDate, todayStr } from '../utils/dateUtils';
import SearchBar from '../components/common/SearchBar';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import FilePill from '../components/common/FilePill';
import UploadArea from '../components/common/UploadArea';
import GmailSyncModal from '../components/common/GmailSyncModal';
import { useConfirm } from '../context/ConfirmContext';
import toast from 'react-hot-toast';


const IN_STATUSES = ['Chưa xử lý', 'Đang xử lý', 'Đã xử lý'];
const OUT_STATUSES = ['Đã gửi', 'Chưa hồi đáp', 'Đã hồi đáp'];

const EMPTY_IN = { refNo: '', date: todayStr(), year: new Date().getFullYear().toString(), sender: '', summary: '', assignee: '', deadline: '', notes: '' };
const EMPTY_OUT = { refNo: '', date: todayStr(), year: new Date().getFullYear().toString(), recipient: '', summary: '', assignee: '', deadline: '', notes: '' };

const getDocYear = (d) => {
  if (d?.year) return String(d.year);
  if (d?.date && d.date.length >= 4) return d.date.substring(0, 4);
  return '2026';
};

const DocumentsPage = () => {
  const { user, isAdmin, canSyncGmail } = useAuth();
  const confirm = useConfirm();
  const [tab, setTab] = useState('incoming');
  const [inDocs, setInDocs] = useState([]);
  const [outDocs, setOutDocs] = useState([]);
  const [customFolders, setCustomFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('folder'); // 'folder' | 'table'

  // Quản lý đường dẫn thư mục đa tầng (Nested Subfolders)
  const [selectedYear, setSelectedYear] = useState(null);
  const [folderPath, setFolderPath] = useState([]); // [{ id, name }]

  // Modal Thêm / Sửa văn bản
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_IN);
  const [docFile, setDocFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [removeExistingFile, setRemoveExistingFile] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal Tạo thư mục mới
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Modal Đổi tên thư mục
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');

  // Modal Thêm năm mới
  const [createYearModalOpen, setCreateYearModalOpen] = useState(false);
  const [customYears, setCustomYears] = useState([]);
  const [newYearInput, setNewYearInput] = useState('');

  // Modal Thiết lập đồng bộ Gmail
  const [gmailModalOpen, setGmailModalOpen] = useState(false);

  const currentParentId = folderPath.length > 0 ? folderPath[folderPath.length - 1].id : null;
  const currentFolderName = folderPath.length > 0 ? folderPath[folderPath.length - 1].name : null;

  const load = async () => {
    setLoading(true);
    try {
      const [inc, out] = await Promise.all([getIncomingDocs(), getOutgoingDocs()]);
      setInDocs(inc);
      setOutDocs(out);
    } catch {
      toast.error('Lỗi tải dữ liệu văn bản!');
    } finally {
      setLoading(false);
    }
  };

  const loadSubfolders = async (year, parentId = null) => {
    if (!year) return;
    try {
      const f = await getFolders(`docs_${tab}`, year, parentId);
      setCustomFolders(f);
    } catch (e) {
      console.error('Lỗi tải thư mục:', e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      loadSubfolders(selectedYear, currentParentId);
    } else {
      setCustomFolders([]);
    }
  }, [selectedYear, currentParentId, tab]);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const currentDocs = tab === 'incoming' ? inDocs : outDocs;
  const statuses = tab === 'incoming' ? IN_STATUSES : OUT_STATUSES;

  const availableYears = useMemo(() => {
    const curY = new Date().getFullYear();
    const baseYears = [curY + 1, curY, curY - 1, curY - 2, curY - 3].map(String);
    const dataYears = currentDocs.map(getDocYear).filter(Boolean);
    return Array.from(new Set([...baseYears, ...customYears, ...dataYears])).sort((a, b) => b.localeCompare(a));
  }, [currentDocs, customYears]);

  // Lọc văn bản theo thư mục hiện tại
  const folderFilteredDocs = useMemo(() => {
    let result = currentDocs;
    if (selectedYear) {
      result = result.filter(d => getDocYear(d) === selectedYear);
    }
    if (currentParentId) {
      result = result.filter(d => d.folderId === currentParentId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.refNo?.toLowerCase().includes(q) ||
        d.summary?.toLowerCase().includes(q) ||
        d.sender?.toLowerCase().includes(q) ||
        d.recipient?.toLowerCase().includes(q) ||
        d.folderName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [currentDocs, selectedYear, currentParentId, search]);

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    setFolderPath([]);
  };

  const openModal = () => {
    setEditId(null);
    const baseForm = tab === 'incoming' ? { ...EMPTY_IN } : { ...EMPTY_OUT };
    if (selectedYear) {
      baseForm.year = selectedYear;
    }
    setForm(baseForm);
    setDocFile(null);
    setExistingFile(null);
    setRemoveExistingFile(false);
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditId(d.id);
    setForm({
      refNo: d.refNo || '',
      date: d.date || todayStr(),
      year: d.year || getDocYear(d),
      sender: d.sender || '',
      recipient: d.recipient || '',
      summary: d.summary || '',
      assignee: d.assignee || '',
      deadline: d.deadline || '',
      notes: d.notes || '',
      folderId: d.folderId || null,
      folderName: d.folderName || '',
    });
    setDocFile(null);
    setExistingFile(d.fileName ? { fileName: d.fileName, fileUrl: d.fileUrl } : null);
    setRemoveExistingFile(false);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.refNo.trim() || !form.date || !form.summary.trim()) {
      toast.error('Vui lòng điền Số ký hiệu, Ngày và Trích yếu!');
      return;
    }
    if (tab === 'incoming' && !form.sender.trim()) { toast.error('Vui lòng điền Nơi gửi!'); return; }
    if (tab === 'outgoing' && !form.recipient.trim()) { toast.error('Vui lòng điền Nơi nhận!'); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        folderId: editId ? (form.folderId || null) : (currentParentId || null),
        folderName: editId ? (form.folderName || '') : (currentFolderName || ''),
      };
      if (editId) {
        if (tab === 'incoming') {
          await updateIncomingDoc(editId, payload, docFile, removeExistingFile, user);
        } else {
          await updateOutgoingDoc(editId, payload, docFile, removeExistingFile, user);
        }
        toast.success('Cập nhật văn bản thành công!');
      } else {
        if (tab === 'incoming') {
          await addIncomingDoc(payload, docFile, user);
        } else {
          await addOutgoingDoc(payload, docFile, user);
        }
        toast.success('Thêm văn bản thành công!');
      }
      setModalOpen(false);
      await load();
      if (selectedYear) {
        await loadSubfolders(selectedYear, currentParentId);
      }
    } catch (err) {
      toast.error(err?.message || 'Lỗi khi lưu văn bản!');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      if (tab === 'incoming') await updateIncomingDocStatus(id, status, user);
      else await updateOutgoingDocStatus(id, status, user);
      toast.success('Cập nhật trạng thái thành công!');
      load();
    } catch {
      toast.error('Lỗi cập nhật!');
    }
  };

  const handleDelete = async (doc) => {
    const ok = await confirm({
      title: 'Xác nhận xóa văn bản',
      message: `Bạn có chắc muốn xóa văn bản số "${doc.refNo}"?`,
      confirmText: 'Xóa văn bản',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;
    try {
      if (tab === 'incoming') await deleteIncomingDoc(doc.id, doc.refNo, user);
      else await deleteOutgoingDoc(doc.id, doc.refNo, user);
      toast.success('Đã xóa văn bản!');
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
        module: `docs_${tab}`,
        year: selectedYear,
        parentId: currentParentId || null,
        user,
      });
      toast.success(`Đã tạo và mở thư mục "${newFolderName.trim()}"!`);
      setNewFolderName('');
      setCreateFolderModalOpen(false);
      // Tự động mở/chuyển ngay vào thư mục con vừa tạo để thanh breadcrumb hiển thị ngay lập tức
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
      await renameFolder(editingFolder.id, editFolderName.trim(), user, `docs_${tab}`);
      toast.success('Đã đổi tên thư mục thành công!');
      setRenameModalOpen(false);
      await loadSubfolders(selectedYear, currentParentId);
    } catch (e) {
      toast.error('Lỗi khi đổi tên: ' + e.message);
    }
  };

  const handleDeleteFolder = async (e, f) => {
    e.stopPropagation();
    const count = currentDocs.filter(d => d.folderId === f.id).length;
    const msg = count > 0
      ? `Thư mục "${f.name}" đang chứa ${count} văn bản. Bạn có chắc muốn xóa thư mục này không?`
      : `Bạn có chắc muốn xóa thư mục "${f.name}"?`;
    const ok = await confirm({
      title: 'Xác nhận xóa thư mục văn bản',
      message: msg,
      confirmText: 'Xóa thư mục',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;

    try {
      await deleteFolder(f.id, f.name, user, `docs_${tab}`);
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

  const unprocessedIn = inDocs.filter(d => d.status === 'Chưa xử lý').length;
  const awaitingOut = outDocs.filter(d => d.status === 'Chưa hồi đáp').length;

  return (
    <div>
      {/* Stats */}
      <div className="stat-grid">
        <StatCard num={inDocs.length} label="Văn bản đến" variant="primary" />
        <StatCard num={unprocessedIn} label="Chưa xử lý" variant="danger" />
        <StatCard num={outDocs.length} label="Văn bản đi" variant="primary" />
        <StatCard num={awaitingOut} label="Chờ hồi đáp" variant="warning" />
      </div>

      {/* Alerts */}
      {unprocessedIn > 0 && (
        <div className="alert alert-warning">
          <span>🔔</span>
          <span><strong>Nhắc việc:</strong> Có <strong>{unprocessedIn}</strong> văn bản đến chưa được xử lý. Vui lòng xử lý kịp thời.</span>
        </div>
      )}
      {awaitingOut > 0 && (
        <div className="alert alert-info">
          <span>ℹ️</span>
          <span><strong>Nhắc tiến độ:</strong> Có <strong>{awaitingOut}</strong> văn bản đi đang chờ hồi đáp từ các đơn vị.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'incoming' ? 'active' : ''}`} onClick={() => handleTabChange('incoming')}>
          📥 Văn bản Đến {unprocessedIn > 0 && <span className="nav-item-badge" style={{ marginLeft: 6 }}>{unprocessedIn}</span>}
        </button>
        <button className={`tab-btn ${tab === 'outgoing' ? 'active' : ''}`} onClick={() => handleTabChange('outgoing')}>
          📤 Văn bản Đi {awaitingOut > 0 && <span className="nav-item-badge" style={{ marginLeft: 6 }}>{awaitingOut}</span>}
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

        <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo số ký hiệu, trích yếu, nơi gửi/nhận..." />

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


        {tab === 'incoming' && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setGmailModalOpen(true)}
            title={canSyncGmail ? 'Thiết lập tự động đồng bộ từ Gmail' : 'Xem thông tin cấp quyền đồng bộ Gmail'}
          >
            {canSyncGmail ? '📧 Đồng bộ Gmail' : '🔒 Đồng bộ Gmail'}
          </button>
        )}

        <button className="btn btn-primary" onClick={openModal}>
          + Thêm {tab === 'incoming' ? 'Văn bản Đến' : 'Văn bản Đi'}
        </button>
      </div>

      {/* ================= GIAO DIỆN THƯ MỤC ================= */}
      {viewMode === 'folder' ? (
        <div>
          {/* Breadcrumb Navigation đa tầng (Đầy đủ mọi cấp thư mục) */}
          <div className="folder-breadcrumb">
            <button
              type="button"
              className={`breadcrumb-item ${!selectedYear ? 'active' : ''}`}
              onClick={() => { setSelectedYear(null); setFolderPath([]); }}
            >
              🏠 {tab === 'incoming' ? 'Văn bản Đến' : 'Văn bản Đi'}
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
                <span>📁 Chọn Năm văn bản để quản lý</span>
              </div>
              <div className="folder-grid">
                {availableYears.map(y => {
                  const count = currentDocs.filter(d => getDocYear(d) === y).length;
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
                        <div className="folder-card-count">{count} văn bản</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CẤP 1 & 2 & n: Thư mục con do người dùng tạo */}
          {selectedYear && !search && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="folder-section-title" style={{ margin: 0 }}>
                  <span>
                    📂 Thư mục con {currentFolderName ? `trong "${currentFolderName}"` : `trong Năm ${selectedYear}`} ({customFolders.length})
                  </span>
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
                    Bạn có thể tự tạo thư mục như "Quyết định", "Công văn chỉ đạo", "Tờ trình", "Kế hoạch"... tùy ý bạn.
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
                    const count = currentDocs.filter(d => d.folderId === folder.id).length;
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
                          <div className="folder-card-count">{count} văn bản</div>
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

          {/* Bảng danh sách Văn bản (Chỉ hiển thị khi đã chọn Năm hoặc khi đang tìm kiếm) */}
          {(selectedYear || search) && (
            <div style={{ marginTop: 10 }}>
              <div className="folder-section-title">
                <span>
                  📄 Văn bản {currentFolderName ? `trong "${currentFolderName}"` : selectedYear ? `trong Năm ${selectedYear}` : 'Kết quả tìm kiếm'} ({folderFilteredDocs.length} VB)
                </span>
              </div>
              <div className="table-card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Số ký hiệu</th>
                        <th>Ngày</th>
                        <th>{tab === 'incoming' ? 'Nơi gửi' : 'Nơi nhận'}</th>
                        <th>Trích yếu nội dung</th>
                        <th>Thư mục lưu trữ</th>
                        <th>Người phụ trách</th>
                        <th>Hạn xử lý</th>
                        <th>Trạng thái</th>
                        <th>File đính kèm</th>
                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={10}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                      ) : folderFilteredDocs.length === 0 ? (
                        <tr>
                          <td colSpan={10}>
                            <div className="table-empty">
                              <div className="table-empty-icon">📄</div>
                              <p>
                                {search
                                  ? 'Không tìm thấy kết quả.'
                                  : 'Thư mục này hiện chưa có văn bản nào. Nhấn "+ Thêm" để tạo mới.'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : folderFilteredDocs.map(d => {
                        const rowCls = (d.status === 'Chưa xử lý' || d.status === 'Chưa hồi đáp') ? 'row-warning' : '';
                        return (
                          <tr key={d.id} className={rowCls}>
                            <td><strong style={{ fontFamily: 'monospace' }}>{d.refNo}</strong></td>
                            <td>{formatDate(d.date)}</td>
                            <td>{d.sender || d.recipient}</td>
                            <td style={{ maxWidth: 240 }}>{d.summary}</td>
                            <td>
                              {d.folderName ? (
                                <span className="badge badge-default">📂 {d.folderName}</span>
                              ) : (
                                <span className="text-muted">Thư mục chung</span>
                              )}
                            </td>
                            <td>{d.assignee || <span className="text-muted">—</span>}</td>
                            <td>{d.deadline ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{formatDate(d.deadline)}</span> : <span className="text-muted">—</span>}</td>
                            <td>
                              <select
                                className="form-control"
                                value={d.status}
                                onChange={e => handleUpdateStatus(d.id, e.target.value)}
                                style={{ padding: '4px 8px', fontSize: 12, width: 130 }}
                              >
                                {statuses.map(s => <option key={s}>{s}</option>)}
                              </select>
                            </td>
                            <td>
                              {d.fileName
                                ? <FilePill fileName={d.fileName} url={d.fileUrl} />
                                : <span className="text-muted">—</span>}
                            </td>
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <button className="btn btn-outline btn-xs" onClick={() => openEdit(d)}>Sửa</button>
                              {' '}
                              <button className="btn btn-danger btn-xs" onClick={() => handleDelete(d)}>Xóa</button>
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
        /* ================= GIAO DIỆN BẢNG DANH SÁCH TOÀN BỘ ================= */
        <div className="table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Số ký hiệu</th>
                  <th>Ngày</th>
                  <th>{tab === 'incoming' ? 'Nơi gửi' : 'Nơi nhận'}</th>
                  <th>Trích yếu nội dung</th>
                  <th>Thư mục</th>
                  <th>Người phụ trách</th>
                  <th>Hạn xử lý</th>
                  <th>Trạng thái</th>
                  <th>File đính kèm</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                ) : currentDocs.length === 0 ? (
                  <tr><td colSpan={10}><div className="table-empty"><div className="table-empty-icon">📄</div><p>Chưa có văn bản nào.</p></div></td></tr>
                ) : currentDocs
                  .filter(d => !search || d.refNo?.toLowerCase().includes(search.toLowerCase()) || d.summary?.toLowerCase().includes(search.toLowerCase()) || d.folderName?.toLowerCase().includes(search.toLowerCase()))
                  .map(d => {
                    const rowCls = (d.status === 'Chưa xử lý' || d.status === 'Chưa hồi đáp') ? 'row-warning' : '';
                    return (
                      <tr key={d.id} className={rowCls}>
                        <td><strong style={{ fontFamily: 'monospace' }}>{d.refNo}</strong></td>
                        <td>{formatDate(d.date)}</td>
                        <td>{d.sender || d.recipient}</td>
                        <td style={{ maxWidth: 240 }}>{d.summary}</td>
                        <td>
                          {d.folderName ? (
                            <span className="badge badge-default">📂 {d.folderName}</span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>{d.assignee || <span className="text-muted">—</span>}</td>
                        <td>{d.deadline ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{formatDate(d.deadline)}</span> : <span className="text-muted">—</span>}</td>
                        <td>
                          <select
                            className="form-control"
                            value={d.status}
                            onChange={e => handleUpdateStatus(d.id, e.target.value)}
                            style={{ padding: '4px 8px', fontSize: 12, width: 130 }}
                          >
                            {statuses.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td>
                          {d.fileName
                            ? <FilePill fileName={d.fileName} url={d.fileUrl} />
                            : <span className="text-muted">—</span>}
                        </td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <button className="btn btn-outline btn-xs" onClick={() => openEdit(d)}>Sửa</button>
                          {' '}
                          <button className="btn btn-danger btn-xs" onClick={() => handleDelete(d)}>Xóa</button>
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

      {/* ================= MODAL THÊM NĂM VĂN BẢN MỚI ================= */}
      <Modal
        open={createYearModalOpen}
        onClose={() => setCreateYearModalOpen(false)}
        title="Thêm Năm văn bản mới"
        size="modal-sm"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setCreateYearModalOpen(false)}>Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleAddCustomYear}>Thêm năm</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Năm văn bản <span className="required">*</span></label>
          <input
            className="form-control"
            value={newYearInput}
            onChange={e => setNewYearInput(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleAddCustomYear(); }}
          />
        </div>
      </Modal>

      {/* ================= MODAL THÊM / SỬA VĂN BẢN ================= */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? (tab === 'incoming' ? 'Chỉnh sửa Văn bản Đến' : 'Chỉnh sửa Văn bản Đi') : (tab === 'incoming' ? 'Thêm Văn bản Đến' : 'Thêm Văn bản Đi')}
        size="modal-lg"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : (editId ? 'Cập nhật văn bản' : 'Lưu văn bản')}
            </button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group" style={{ flex: 1.4 }}>
            <label className="form-label">Số ký hiệu văn bản <span className="required">*</span></label>
            <input className="form-control" value={form.refNo} onChange={e => setF('refNo', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Ngày văn bản <span className="required">*</span></label>
            <input
              className="form-control"
              type="date"
              value={form.date}
              onChange={e => {
                setF('date', e.target.value);
                if (e.target.value && e.target.value.length >= 4) {
                  setF('year', e.target.value.substring(0, 4));
                }
              }}
            />
          </div>
          <div className="form-group" style={{ flex: 0.8 }}>
            <label className="form-label">Năm văn bản</label>
            <input
              type="number"
              className="form-control"
              value={form.year}
              onChange={e => setF('year', e.target.value)}
            />
          </div>
        </div>

        {/* Thông tin Thư mục đích */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Thư mục đích lưu trữ</label>
          <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
            {(form.folderName || currentFolderName) ? `📂 ${form.folderName || currentFolderName} (Năm ${form.year})` : `📁 Năm ${form.year}`}
          </div>
        </div>

        {tab === 'incoming' ? (
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label">Nơi gửi <span className="required">*</span></label>
            <input className="form-control" value={form.sender} onChange={e => setF('sender', e.target.value)} />
          </div>
        ) : (
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label">Nơi nhận <span className="required">*</span></label>
            <input className="form-control" value={form.recipient} onChange={e => setF('recipient', e.target.value)} />
          </div>
        )}

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Trích yếu nội dung <span className="required">*</span></label>
          <textarea className="form-control" rows={3} value={form.summary} onChange={e => setF('summary', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Người phụ trách xử lý</label>
            <input className="form-control" value={form.assignee} onChange={e => setF('assignee', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Hạn xử lý</label>
            <input className="form-control" type="date" value={form.deadline} onChange={e => setF('deadline', e.target.value)} />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">File văn bản đính kèm</label>
          {editId && existingFile && !removeExistingFile && !docFile && (
            <div style={{ marginBottom: 8, padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Tệp hiện tại:</span>
                <FilePill fileName={existingFile.fileName} url={existingFile.fileUrl} />
              </div>
              <button
                type="button"
                className="btn btn-outline btn-xs"
                onClick={() => setRemoveExistingFile(true)}
                style={{ color: '#b91c1c', borderColor: '#fecaca' }}
              >
                Gỡ bỏ tệp
              </button>
            </div>
          )}
          {editId && removeExistingFile && !docFile && (
            <div style={{ marginBottom: 8, fontSize: 12, color: '#b91c1c' }}>
              Tệp cũ sẽ được gỡ bỏ khi cập nhật (hoặc chọn tệp mới bên dưới để thay thế).
            </div>
          )}
          <UploadArea
            onFileSelect={files => {
              setDocFile(files[0]);
              if (files[0]) setRemoveExistingFile(false);
            }}
            allowedTypes={['pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png']}
            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
            hint="PDF, Word, Ảnh scan – Tối đa 15MB"
            selectedFiles={docFile ? [docFile] : []}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú</label>
          <textarea className="form-control" rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} />
        </div>
      </Modal>

      <GmailSyncModal
        isOpen={gmailModalOpen}
        onClose={() => setGmailModalOpen(false)}
      />

    </div>
  );
};

export default DocumentsPage;
