// src/pages/ScoresPage.jsx
// Module 2: Quản lý Điểm Đại học (Phân loại theo Năm & Người dùng tự do tạo Thư mục)
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getScores, uploadScore, deleteScore } from '../services/scoreService';
import {
  getFolders, createFolder, renameFolder, deleteFolder,
} from '../services/folderService';
import { formatTimestamp } from '../utils/dateUtils';
import { formatFileSize } from '../utils/fileUtils';
import SearchBar from '../components/common/SearchBar';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import FilePill from '../components/common/FilePill';
import UploadArea from '../components/common/UploadArea';
import PrinterHotFolderModal from '../components/common/PrinterHotFolderModal';
import { downloadFileSafely } from '../services/storageHelper';
import { useConfirm } from '../context/ConfirmContext';
import toast from 'react-hot-toast';

const getScoreYear = (f) => {
  if (f?.academicYear) return String(f.academicYear);
  if (f?.createdAt?.toDate) {
    const y = f.createdAt.toDate().getFullYear();
    return `${y - 1}-${y}`;
  }
  return '2025-2026';
};

const ScoresPage = () => {
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

  const currentParentId = folderPath.length > 0 ? folderPath[folderPath.length - 1].id : null;
  const currentFolderName = folderPath.length > 0 ? folderPath[folderPath.length - 1].name : null;

  // Modal Upload File
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [uploading, setUploading] = useState(false);

  // Modal Tạo Thư mục mới
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Modal Đổi tên Thư mục
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');

  // Modal Thêm Năm học mới
  const [createYearModalOpen, setCreateYearModalOpen] = useState(false);
  const [customYears, setCustomYears] = useState([]);
  const [newYearInput, setNewYearInput] = useState('');

  // Modal Quét bảng điểm trực tiếp vào Thư mục
  const [scanToFolderModalOpen, setScanToFolderModalOpen] = useState(false);

  const handleSaveScannedScoreToFolder = async (file, metadata) => {
    try {
      const subName = metadata.title || 'Bảng điểm scan';
      const yr = selectedYear || '2025-2026';
      await uploadScore(
        file,
        subName,
        currentFolderName || 'Bảng điểm scan',
        user,
        yr,
        currentParentId || null,
        currentFolderName || ''
      );
      toast.success('Đã quét và lưu bảng điểm vào thư mục!');
      await load();
      if (selectedYear) {
        await loadFolders(selectedYear, currentParentId);
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lưu bảng điểm: ' + (err.message || 'Vui lòng thử lại!'));
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getScores());
    } catch (e) {
      console.error(e);
      toast.error('Lỗi tải dữ liệu điểm!');
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async (year, parentId = null) => {
    if (!year) return;
    try {
      const f = await getFolders('scores', year, parentId);
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
      loadFolders(selectedYear, currentParentId);
    } else {
      setCustomFolders([]);
    }
  }, [selectedYear, currentParentId]);

  const availableYears = useMemo(() => {
    const curY = new Date().getFullYear();
    const defaultYears = [
      `${curY}-${curY + 1}`,
      `${curY - 1}-${curY}`,
      `${curY - 2}-${curY - 1}`,
      `${curY - 3}-${curY - 2}`,
    ];
    const dataYears = items.map(getScoreYear).filter(Boolean);
    return Array.from(new Set([...defaultYears, ...customYears, ...dataYears]));
  }, [items, customYears]);

  // Các file thuộc thư mục/năm hiện tại
  const folderFilteredFiles = useMemo(() => {
    let result = items;
    if (selectedYear) {
      result = result.filter(f => getScoreYear(f) === selectedYear);
    }
    if (currentParentId) {
      result = result.filter(f => f.folderId === currentParentId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(f =>
        f.fileName?.toLowerCase().includes(q) ||
        f.subjectName?.toLowerCase().includes(q) ||
        f.folderName?.toLowerCase().includes(q) ||
        getScoreYear(f)?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, selectedYear, currentParentId, search]);

  // Mở modal upload
  const openModal = () => {
    const curY = new Date().getFullYear();
    setSelectedFile(null);
    setSubjectName('');
    setAcademicYear(selectedYear || `${curY - 1}-${curY}`);
    setModalOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) { toast.error('Vui lòng chọn file!'); return; }
    if (!subjectName.trim()) { toast.error('Vui lòng nhập tên môn học!'); return; }

    setUploading(true);
    try {
      await uploadScore(
        selectedFile,
        subjectName.trim(),
        currentFolderName || 'Chung',
        user,
        academicYear,
        currentParentId || null,
        currentFolderName || ''
      );
      toast.success('Upload file điểm thành công!');
      setModalOpen(false);
      await load();
      if (selectedYear) {
        await loadFolders(selectedYear, currentParentId);
      }
    } catch (err) {
      console.error('Lỗi upload file điểm:', err);
      toast.error('Lỗi khi upload: ' + (err.message || 'Vui lòng thử lại!'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item) => {
    const ok = await confirm({
      title: 'Xác nhận xóa file điểm',
      message: `Bạn có chắc muốn xóa file bảng điểm "${item.fileName}"?`,
      confirmText: 'Xóa file điểm',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;
    try {
      await deleteScore(item.id, item.fileName, user);
      toast.success('Đã xóa file!');
      await load();
      if (selectedYear) {
        await loadFolders(selectedYear, currentParentId);
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
        module: 'scores',
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

  // Mở modal đổi tên
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
      await renameFolder(editingFolder.id, editFolderName.trim(), user, 'scores');
      toast.success('Đã đổi tên thư mục thành công!');
      setRenameModalOpen(false);
      await loadFolders(selectedYear, currentParentId);
    } catch (e) {
      toast.error('Lỗi khi đổi tên: ' + e.message);
    }
  };

  // Xóa thư mục
  const handleDeleteFolder = async (e, f) => {
    e.stopPropagation();
    const count = items.filter(i => i.folderId === f.id).length;
    const msg = count > 0
      ? `Thư mục "${f.name}" đang chứa ${count} tệp tin điểm. Bạn có chắc muốn xóa thư mục này không?`
      : `Bạn có chắc muốn xóa thư mục "${f.name}"?`;
    const ok = await confirm({
      title: 'Xác nhận xóa thư mục điểm',
      message: msg,
      confirmText: 'Xóa thư mục',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;

    try {
      await deleteFolder(f.id, f.name, user, 'scores');
      toast.success(`Đã xóa thư mục "${f.name}"!`);
      await loadFolders(selectedYear, currentParentId);
    } catch (err) {
      toast.error('Lỗi khi xóa: ' + err.message);
    }
  };

  // Thêm năm học mới
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

  return (
    <div>
      {/* Stats */}
      <div className="stat-grid">
        <StatCard num={items.length} label="Tổng số file điểm" variant="primary" />
        <StatCard num={items.filter(i => i.fileType === 'xlsx' || i.fileType === 'xls').length} label="File Excel" variant="success" />
        <StatCard num={items.filter(i => i.fileType === 'pdf').length} label="File PDF" variant="danger" />
        <StatCard num={items.filter(i => i.fileType === 'docx' || i.fileType === 'doc').length} label="File Word" variant="info" />
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

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Tìm file theo tên môn, tên file, thư mục..."
        />

        {/* Nút tạo thư mục mới (chỉ hiện khi đã chọn năm học trong chế độ Folder) */}
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

        <button
          className="btn btn-outline"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            borderColor: '#2563eb',
            color: '#1d4ed8',
            background: '#eff6ff',
            fontWeight: 600,
          }}
          onClick={() => setScanToFolderModalOpen(true)}
          title={currentFolderName ? `Mở Hộp tệp máy in để nạp bảng điểm vào thư mục "${currentFolderName}"` : `Mở Hộp tệp máy in để nạp vào Năm học ${selectedYear || '2025-2026'}`}
        >
          <span>🖨️</span> Hộp tệp Máy in / Scan
        </button>

        <button className="btn btn-primary" onClick={openModal}>
          + Upload File Điểm
        </button>
      </div>

      {/* ================= GIAO DIỆN THƯ MỤC ================= */}
      {viewMode === 'folder' ? (
        <div>
          {/* Breadcrumb Navigation đa tầng (Hỗ trợ vô số cấp thư mục con) */}
          <div className="folder-breadcrumb">
            <button
              type="button"
              className={`breadcrumb-item ${!selectedYear ? 'active' : ''}`}
              onClick={() => { setSelectedYear(null); setFolderPath([]); }}
            >
              🏠 Quản lý Điểm
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
                  const count = items.filter(f => getScoreYear(f) === y).length;
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
                        <div className="folder-card-count">{count} tệp tin điểm</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CẤP 1 & 2 & n: Bên trong Năm học -> Hiển thị các Thư mục do người dùng tự tạo */}
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
                    Bạn có thể tự tạo thư mục theo Lớp, Bộ môn, hoặc Học kỳ tùy ý để phân loại file điểm.
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
                    const count = items.filter(f => f.folderId === folder.id).length;
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
                          <div className="folder-card-count">{count} tệp tin</div>
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

          {/* Bảng danh sách Tệp tin Điểm (Chỉ hiển thị khi đã chọn Năm học hoặc khi đang tìm kiếm) */}
          {(selectedYear || search) && (
            <div style={{ marginTop: 10 }}>
              <div className="folder-section-title">
                <span>
                  📄 Tệp tin {currentFolderName ? `trong "${currentFolderName}"` : selectedYear ? `trong Năm học ${selectedYear}` : 'Kết quả tìm kiếm'} ({folderFilteredFiles.length} file)
                </span>
              </div>
              <div className="table-card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Tên file</th>
                        <th>Tên môn học</th>
                        <th>Năm học</th>
                        <th>Thư mục lưu trữ</th>
                        <th>Ngày upload</th>
                        <th>Dung lượng</th>
                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={7}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                      ) : folderFilteredFiles.length === 0 ? (
                        <tr>
                          <td colSpan={7}>
                            <div className="table-empty">
                              <div className="table-empty-icon">📊</div>
                              <p>
                                {search
                                  ? 'Không tìm thấy file phù hợp với từ khóa.'
                                  : 'Thư mục này chưa có file điểm nào. Nhấn "+ Upload File Điểm" để tải lên.'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : folderFilteredFiles.map(f => (
                        <tr key={f.id}>
                          <td><FilePill fileName={f.fileName} url={f.fileUrl} /></td>
                          <td><strong>{f.subjectName}</strong></td>
                          <td><span className="badge badge-info">{getScoreYear(f)}</span></td>
                          <td>
                            {f.folderName ? (
                              <span className="badge badge-default">📂 {f.folderName}</span>
                            ) : (
                              <span className="text-muted">Thư mục chung</span>
                            )}
                          </td>
                          <td>{formatTimestamp(f.createdAt)}</td>
                          <td>{formatFileSize(f.fileSize)}</td>
                          <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {f.fileUrl && (
                              <button
                                type="button"
                                onClick={() => downloadFileSafely(f.fileUrl, f.fileName)}
                                className="btn btn-outline btn-xs"
                              >
                                Xem / Tải
                              </button>
                            )}
                            {' '}
                            <button className="btn btn-danger btn-xs" onClick={() => handleDelete(f)}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= GIAO DIỆN BẢNG DANH SÁCH PHẲNG ================= */
        <div className="table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tên file</th>
                  <th>Tên môn học</th>
                  <th>Năm học</th>
                  <th>Thư mục</th>
                  <th>Ngày upload</th>
                  <th>Dung lượng</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={7}><div className="table-empty"><div className="table-empty-icon">📊</div><p>Chưa có file điểm nào.</p></div></td></tr>
                ) : items
                  .filter(f => !search || f.fileName?.toLowerCase().includes(search.toLowerCase()) || f.subjectName?.toLowerCase().includes(search.toLowerCase()) || f.folderName?.toLowerCase().includes(search.toLowerCase()))
                  .map(f => (
                    <tr key={f.id}>
                      <td><FilePill fileName={f.fileName} url={f.fileUrl} /></td>
                      <td><strong>{f.subjectName}</strong></td>
                      <td><span className="badge badge-info">{getScoreYear(f)}</span></td>
                      <td>
                        {f.folderName ? (
                          <span className="badge badge-default">📂 {f.folderName}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>{formatTimestamp(f.createdAt)}</td>
                      <td>{formatFileSize(f.fileSize)}</td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {f.fileUrl && (
                          <button
                            type="button"
                            onClick={() => downloadFileSafely(f.fileUrl, f.fileName)}
                            className="btn btn-outline btn-xs"
                          >
                            Xem / Tải
                          </button>
                        )}
                        {' '}
                        <button className="btn btn-danger btn-xs" onClick={() => handleDelete(f)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
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
            placeholder="Lớp K65-CNTT, Điểm thi lần 1, Khoa Kinh tế..."
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); }}
          />
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            💡 Bạn có thể đặt tên thư mục tùy ý theo lớp học, môn học, khoa hoặc đợt thi.
          </p>
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
            placeholder="2027-2028, 2028-2029"
            value={newYearInput}
            onChange={e => setNewYearInput(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleAddCustomYear(); }}
          />
        </div>
      </Modal>

      {/* ================= MODAL UPLOAD FILE ĐIỂM ================= */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={currentFolderName ? `Upload File Điểm vào: 📂 ${currentFolderName}` : 'Upload File Điểm'}
        size="modal-md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Đang upload...' : 'Upload File'}
            </button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group" style={{ flex: 1.4 }}>
            <label className="form-label">Tên môn học <span className="required">*</span></label>
            <input
              className="form-control"
              placeholder="Toán cao cấp A1, Vật lý đại cương..."
              value={subjectName}
              onChange={e => setSubjectName(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Năm học <span className="required">*</span></label>
            <select
              className="form-control"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
            >
              {availableYears.map(y => (
                <option key={y} value={y}>Năm học {y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Thông tin Thư mục đích */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Thư mục đích lưu trữ</label>
          <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
            {currentFolderName ? `📂 ${currentFolderName} (Năm ${academicYear})` : `📁 Năm học ${academicYear}`}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Chọn file điểm <span className="required">*</span></label>
          <UploadArea
            onFileSelect={files => setSelectedFile(files[0])}
            allowedTypes={['pdf', 'xlsx', 'xls', 'docx', 'doc']}
            accept=".pdf,.xlsx,.xls,.docx,.doc"
            hint="Excel, Word, PDF – Tối đa 20MB"
            selectedFiles={selectedFile ? [selectedFile] : []}
          />
        </div>
      </Modal>

      {/* Modal Hộp tệp Máy in / Máy scan tự động */}
      <PrinterHotFolderModal
        isOpen={scanToFolderModalOpen}
        onClose={() => setScanToFolderModalOpen(false)}
        onSave={handleSaveScannedScoreToFolder}
        title={`Hộp tệp Máy in / Scan: ${currentFolderName || (selectedYear ? `Năm học ${selectedYear}` : 'Quản lý Điểm')}`}
        folderInfo={{
          module: 'scores',
          moduleLabel: 'Quản lý Điểm',
          year: selectedYear || '2025-2026',
          folderId: currentParentId,
          folderName: currentFolderName,
        }}
      />
    </div>
  );
};

export default ScoresPage;
