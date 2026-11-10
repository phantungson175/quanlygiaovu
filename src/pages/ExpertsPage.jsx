// src/pages/ExpertsPage.jsx
// Module 3: Quản lý Thỉnh giảng Chuyên gia (Phân cấp theo Năm & Thư mục tự do đa tầng)
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getExperts, addExpert, updateExpert, deleteExpert } from '../services/expertService';
import {
  getFolders, createFolder, renameFolder, deleteFolder,
} from '../services/folderService';
import {
  getContractMonthsLeft, getContractBadge,
  getWarningRowClass, formatDate, todayStr,
} from '../utils/dateUtils';
import { exportExpertsToExcel, exportExpertsToPDF } from '../utils/exportUtils';
import SearchBar from '../components/common/SearchBar';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import FilePill from '../components/common/FilePill';
import UploadArea from '../components/common/UploadArea';
import { useConfirm } from '../context/ConfirmContext';
import toast from 'react-hot-toast';


const ACADEMIC_TITLES = ['Không có', 'GS', 'PGS'];
const DEGREES = ['Tiến sĩ', 'Tiến sĩ Khoa học', 'Thạc sĩ', 'Cử nhân / Kỹ sư', 'Khác'];
const GENDERS = ['Nam', 'Nữ'];
const HONORIFICS = ['Ông', 'Bà'];

const FACULTIES = [
  'Khoa Công nghệ Thông tin',
  'Khoa Kinh tế & Quản trị',
  'Khoa Ngoại ngữ',
  'Khoa Khoa học Cơ bản',
  'Khoa Luật',
  'Phòng Quản lý Đào tạo & Giáo vụ',
  'Đơn vị khác',
];

const EMPTY_FORM = {
  honorific: 'Ông',             // ông/bà
  gender: 'Nam',               // giới tính
  name: '',                    // họ và tên
  birthDate: '',               // ngày tháng năm sinh (YYYY-MM-DD)
  birthDay: '',                // ngày sinh
  birthMonth: '',              // tháng sinh
  birthYear: '',               // năm sinh
  hometown: '',                // quê quán
  permanentAddress: '',        // địa chỉ thường trú
  currentAddress: '',          // nơi ở hiện tại
  academicTitle: 'Không có',   // học hàm (Không có, GS, PGS)
  degree: 'Tiến sĩ',           // học vị (Tiến sĩ, Thạc sĩ...)
  appointedDate: '',           // ngày bổ nhiệm GS/PGS
  faculty: FACULTIES[0],       // đơn vị (khoa/phòng tại trường)
  workplace: '',               // đơn vị công tác (nơi công tác chính)
  occupation: 'Giảng viên',    // nghề nghiệp
  cccd: '',                    // số CCCD
  phone: '',                   // SĐT
  bankAccount: '',             // STK
  bankName: '',                // ngân hàng
  contractNo: '',              // số HĐ
  contractSignDate: todayStr(),// ngày tháng HĐ hiện tại
  startDate: todayStr(),       // từ ngày (HĐ hiện tại)
  endDate: '',                 // đến ngày (HĐ hiện tại)
  year: new Date().getFullYear().toString(), // Năm HĐ / Năm thực hiện
  notes: '',                   // ghi chú
  folderId: null,
  folderName: '',
};

const getExpertYear = (e) => {
  if (e?.year) return String(e.year);
  if (e?.startDate && e.startDate.length >= 4) return e.startDate.substring(0, 4);
  if (e?.contractSignDate && e.contractSignDate.length >= 4) return e.contractSignDate.substring(0, 4);
  if (e?.endDate && e.endDate.length >= 4) return e.endDate.substring(0, 4);
  return '2026';
};

const ExpertsPage = () => {
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
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [contractFile, setContractFile] = useState(null);
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
      setItems(await getExperts());
    } catch {
      toast.error('Lỗi tải dữ liệu chuyên gia!');
    } finally {
      setLoading(false);
    }
  };

  const loadSubfolders = async (year, parentId = null) => {
    if (!year) return;
    try {
      const f = await getFolders('experts', year, parentId);
      setCustomFolders(f);
    } catch (e) {
      console.error('Lỗi tải thư mục chuyên gia:', e);
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

  const enriched = useMemo(() => items.map(e => ({
    ...e,
    yearCalculated: getExpertYear(e),
    monthsLeft: getContractMonthsLeft(e.endDate),
  })), [items]);

  const availableYears = useMemo(() => {
    const curYear = new Date().getFullYear();
    const base = [curYear + 1, curYear, curYear - 1, curYear - 2].map(String);
    const fromData = items.map(getExpertYear).filter(Boolean);
    const set = new Set([...base, ...customYears, ...fromData]);
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [items, customYears]);

  // Lọc chuyên gia theo thư mục hiện tại
  const folderFiltered = useMemo(() => {
    let result = enriched;
    if (selectedYear) {
      result = result.filter(e => e.yearCalculated === selectedYear);
    }
    if (currentParentId) {
      result = result.filter(e => e.folderId === currentParentId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name?.toLowerCase().includes(q) ||
        e.faculty?.toLowerCase().includes(q) ||
        e.workplace?.toLowerCase().includes(q) ||
        e.contractNo?.toLowerCase().includes(q) ||
        e.cccd?.includes(q) ||
        e.phone?.includes(q) ||
        e.folderName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [enriched, selectedYear, currentParentId, search]);

  // Chế độ xem toàn bộ dạng bảng
  const tableFiltered = useMemo(() => {
    let result = enriched;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name?.toLowerCase().includes(q) ||
        e.faculty?.toLowerCase().includes(q) ||
        e.workplace?.toLowerCase().includes(q) ||
        e.contractNo?.toLowerCase().includes(q) ||
        e.cccd?.includes(q) ||
        e.phone?.includes(q) ||
        e.folderName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [enriched, search]);

  const activeFiltered = viewMode === 'folder' ? folderFiltered : tableFiltered;

  const stats = useMemo(() => ({
    total: enriched.length,
    warn: enriched.filter(e => e.monthsLeft !== null && e.monthsLeft > 0 && e.monthsLeft <= 2).length,
    expired: enriched.filter(e => e.monthsLeft !== null && e.monthsLeft <= 0).length,
  }), [enriched]);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Đồng bộ ngày tháng năm sinh khi người dùng chọn ngày
  const handleBirthDateChange = (val) => {
    setForm(p => {
      const next = { ...p, birthDate: val };
      if (val) {
        const parts = val.split('-');
        if (parts.length === 3) {
          next.birthYear = parts[0];
          next.birthMonth = parts[1];
          next.birthDay = parts[2];
        }
      }
      return next;
    });
  };

  // Đồng bộ ngày sinh / tháng sinh / năm sinh nếu nhập riêng lẻ
  const handleBirthPartChange = (part, val) => {
    setForm(p => {
      const next = { ...p, [part]: val };
      const y = part === 'birthYear' ? val : p.birthYear;
      const m = part === 'birthMonth' ? val : p.birthMonth;
      const d = part === 'birthDay' ? val : p.birthDay;
      if (y && m && d) {
        const mm = String(m).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        next.birthDate = `${y}-${mm}-${dd}`;
      }
      return next;
    });
  };

  // Tự động đổi Ông/Bà theo Giới tính nếu người dùng chưa chọn riêng
  const handleGenderChange = (val) => {
    setForm(p => ({
      ...p,
      gender: val,
      honorific: val === 'Nữ' ? 'Bà' : 'Ông',
    }));
  };

  const openAdd = () => {
    setEditId(null);
    setForm({
      ...EMPTY_FORM,
      year: selectedYear || new Date().getFullYear().toString(),
      folderId: currentParentId || null,
      folderName: currentFolderName || '',
    });
    setContractFile(null);
    setModalOpen(true);
  };

  const openEdit = (e) => {
    setEditId(e.id);
    setForm({
      honorific: e.honorific || (e.gender === 'Nữ' ? 'Bà' : 'Ông'),
      gender: e.gender || 'Nam',
      name: e.name || '',
      birthDate: e.birthDate || '',
      birthDay: e.birthDay || '',
      birthMonth: e.birthMonth || '',
      birthYear: e.birthYear || '',
      hometown: e.hometown || '',
      permanentAddress: e.permanentAddress || '',
      currentAddress: e.currentAddress || '',
      academicTitle: e.academicTitle || (e.title?.includes('GS') ? 'GS' : e.title?.includes('PGS') ? 'PGS' : 'Không có'),
      degree: e.degree || (e.title?.includes('TS') ? 'Tiến sĩ' : e.title?.includes('ThS') ? 'Thạc sĩ' : 'Khác'),
      appointedDate: e.appointedDate || '',
      faculty: e.faculty || FACULTIES[0],
      workplace: e.workplace || '',
      occupation: e.occupation || 'Giảng viên',
      cccd: e.cccd || '',
      phone: e.phone || '',
      bankAccount: e.bankAccount || '',
      bankName: e.bankName || '',
      contractNo: e.contractNo || '',
      contractSignDate: e.contractSignDate || todayStr(),
      startDate: e.startDate || todayStr(),
      endDate: e.endDate || '',
      year: e.year || getExpertYear(e),
      notes: e.notes || '',
      folderId: e.folderId || null,
      folderName: e.folderName || '',
    });
    setContractFile(null);
    setModalOpen(true);
  };

  const openDetail = (e) => {
    setDetailItem(e);
    setDetailModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập họ và tên chuyên gia!');
      return;
    }
    if (!form.contractNo.trim()) {
      toast.error('Vui lòng nhập số hợp đồng!');
      return;
    }
    if (!form.endDate) {
      toast.error('Vui lòng chọn ngày kết thúc hợp đồng!');
      return;
    }

    setSaving(true);
    try {
      // Chuẩn hóa danh xưng học thuật
      const titleDisplay = (form.academicTitle && form.academicTitle !== 'Không có' ? `${form.academicTitle}.` : '') +
        (form.degree === 'Tiến sĩ' ? 'TS' : form.degree === 'Thạc sĩ' ? 'ThS' : form.degree === 'Cử nhân / Kỹ sư' ? 'CN' : '');

      const payload = {
        ...form,
        title: titleDisplay || form.degree || 'Chuyên gia',
        folderId: form.folderId || currentParentId || null,
        folderName: form.folderName || currentFolderName || '',
      };

      if (editId) {
        await updateExpert(editId, payload, contractFile, user);
        toast.success('Cập nhật hồ sơ chuyên gia thành công!');
      } else {
        await addExpert(payload, contractFile, user);
        toast.success('Thêm hồ sơ chuyên gia thành công!');
      }
      setModalOpen(false);
      await load();
      if (selectedYear) {
        await loadSubfolders(selectedYear, currentParentId);
      }
    } catch (err) {
      toast.error('Lỗi khi lưu dữ liệu: ' + (err.message || 'Vui lòng thử lại!'));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e) => {
    const ok = await confirm({
      title: 'Xác nhận xóa hồ sơ chuyên gia',
      message: `Bạn có chắc chắn muốn xóa hồ sơ chuyên gia "${e.honorific || ''} ${e.name}"?`,
      confirmText: 'Xóa hồ sơ',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;
    try {
      await deleteExpert(e.id, e.name, user);
      toast.success('Đã xóa hồ sơ chuyên gia!');
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
        module: 'experts',
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
      await renameFolder(editingFolder.id, editFolderName.trim(), user, 'experts');
      toast.success('Đã đổi tên thư mục thành công!');
      setRenameModalOpen(false);
      await loadSubfolders(selectedYear, currentParentId);
    } catch (e) {
      toast.error('Lỗi khi đổi tên: ' + e.message);
    }
  };

  const handleDeleteFolder = async (e, f) => {
    e.stopPropagation();
    const count = items.filter(i => i.folderId === f.id).length;
    const msg = count > 0
      ? `Thư mục "${f.name}" đang chứa ${count} hồ sơ chuyên gia. Bạn có chắc muốn xóa thư mục này không?`
      : `Bạn có chắc muốn xóa thư mục "${f.name}"?`;
    const ok = await confirm({
      title: 'Xác nhận xóa thư mục chuyên gia',
      message: msg,
      confirmText: 'Xóa thư mục',
      cancelText: 'Huỷ bỏ',
      type: 'danger',
    });
    if (!ok) return;

    try {
      await deleteFolder(f.id, f.name, user, 'experts');
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

  const warnItems = enriched.filter(e => e.monthsLeft !== null && e.monthsLeft <= 2);

  const handleExportPDF = async () => {
    const t = toast.loading('Đang khởi tạo file PDF...');
    try {
      await exportExpertsToPDF(activeFiltered);
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
        <StatCard num={stats.total} label="Tổng chuyên gia" variant="primary" />
        <StatCard num={stats.warn} label="Sắp hết hạn HĐ (≤ 2 tháng)" variant="warning" />
        <StatCard num={stats.expired} label="Đã hết hạn HĐ" variant="danger" />
      </div>

      {/* Alert bar */}
      {warnItems.length > 0 && (
        <div className="alert alert-warning">
          <div>
            <strong>Cảnh báo hợp đồng:</strong> Có <strong>{warnItems.length}</strong> hợp đồng thỉnh giảng
            sắp hết hoặc đã hết hạn:&nbsp;
            {warnItems.slice(0, 3).map(e => `${e.honorific || ''} ${e.name}`).join(', ')}
            {warnItems.length > 3 ? ` và ${warnItems.length - 3} người khác...` : '.'}
            {' '}Vui lòng xem xét gia hạn kịp thời.
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
          placeholder="Tìm theo họ tên, CCCD, SĐT, đơn vị, số HĐ, thư mục..."
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

        <button className="btn btn-primary" onClick={openAdd}>+ Thêm mới Chuyên gia</button>

        <button className="btn btn-outline btn-sm" onClick={() => exportExpertsToExcel(activeFiltered)} disabled={!activeFiltered.length}>Xuất Excel</button>
        <button className="btn btn-outline btn-sm" onClick={handleExportPDF} disabled={!activeFiltered.length}>Xuất PDF</button>
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
              🏠 Quản lý Chuyên gia
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
                <span>📁 Chọn Năm Hợp đồng để quản lý chuyên gia</span>
              </div>
              <div className="folder-grid">
                {availableYears.map(y => {
                  const count = items.filter(e => getExpertYear(e) === y).length;
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
                        <div className="folder-card-count">{count} chuyên gia</div>
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
                    Bạn có thể tự tạo thư mục như "Khoa CNTT - Học kỳ 1", "Chuyên gia Quốc tế", "Viện Cơ khí"... tùy ý bạn.
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
                    const count = items.filter(e => e.folderId === folder.id).length;
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
                          <div className="folder-card-count">{count} chuyên gia</div>
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

          {/* Bảng danh sách Chuyên gia (Chỉ hiển thị khi đã chọn Năm hoặc khi đang tìm kiếm) */}
          {(selectedYear || search) && (
            <div style={{ marginTop: 10 }}>
              <div className="folder-section-title">
                <span>
                  👨‍🏫 Danh sách Chuyên gia {currentFolderName ? `trong "${currentFolderName}"` : selectedYear ? `trong Năm ${selectedYear}` : 'Kết quả tìm kiếm'} ({folderFiltered.length} chuyên gia)
                </span>
              </div>
              <div className="table-card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th style={{ textAlign: 'center' }}>Ông/Bà</th>
                        <th>Họ và tên</th>
                        <th>Giới tính</th>
                        <th>Ngày sinh</th>
                        <th>Học hàm / Học vị</th>
                        <th>Đơn vị tiếp nhận</th>
                        <th>Thư mục lưu trữ</th>
                        <th>Nơi công tác chính</th>
                        <th>Số CCCD</th>
                        <th>Số ĐT</th>
                        <th>Số HĐ</th>
                        <th>Thời hạn HĐ</th>
                        <th>Trạng thái HĐ</th>
                        <th>File HĐ</th>
                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={16}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                      ) : folderFiltered.length === 0 ? (
                        <tr><td colSpan={16}><div className="table-empty"><p>{search ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có hồ sơ chuyên gia nào trong thư mục này. Nhấn "+ Thêm mới Chuyên gia" để lưu vào đây.'}</p></div></td></tr>
                      ) : folderFiltered.map((e, index) => {
                        const { label, variant } = getContractBadge(e.monthsLeft);
                        const rowCls = getWarningRowClass(e.monthsLeft, 2);
                        return (
                          <tr key={e.id} className={rowCls}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                              {e.honorific || (e.gender === 'Nữ' ? 'Bà' : 'Ông')}
                            </td>
                            <td>
                              <strong
                                style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => openDetail(e)}
                                title="Nhấn để xem toàn bộ chi tiết hồ sơ"
                              >
                                {e.name}
                              </strong>
                            </td>
                            <td>{e.gender || '—'}</td>
                            <td>{e.birthDate ? formatDate(e.birthDate) : (e.birthYear ? `${e.birthDay || '?'}/${e.birthMonth || '?'}/${e.birthYear}` : '—')}</td>
                            <td>
                              {e.academicTitle && e.academicTitle !== 'Không có' ? `${e.academicTitle}. ` : ''}
                              {e.degree || e.title || '—'}
                            </td>
                            <td><span className="badge badge-info">{e.faculty || '—'}</span></td>
                            <td>
                              {e.folderName ? (
                                <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  📁 {e.folderName}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Thư mục chung</span>
                              )}
                            </td>
                            <td style={{ maxWidth: 160 }}>{e.workplace || '—'}</td>
                            <td style={{ fontFamily: 'monospace' }}>{e.cccd || '—'}</td>
                            <td>{e.phone || '—'}</td>
                            <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{e.contractNo}</td>
                            <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                              {formatDate(e.startDate)} → {formatDate(e.endDate)}
                            </td>
                            <td><span className={`badge ${variant}`}>{label}</span></td>
                            <td>
                              {e.contractFileName
                                ? <FilePill fileName={e.contractFileName} url={e.contractFileUrl} />
                                : <span className="text-muted">—</span>}
                            </td>
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <button className="btn btn-outline btn-xs" onClick={() => openDetail(e)} title="Xem chi tiết">Chi tiết</button>
                              {' '}
                              <button className="btn btn-outline btn-xs" onClick={() => openEdit(e)}>Sửa</button>
                              {' '}
                              <button className="btn btn-danger btn-xs" onClick={() => handleDelete(e)} title="Xóa hồ sơ">Xóa</button>
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
                  <th>STT</th>
                  <th style={{ textAlign: 'center' }}>Ông/Bà</th>
                  <th>Họ và tên</th>
                  <th>Năm</th>
                  <th>Thư mục lưu trữ</th>
                  <th>Đơn vị tiếp nhận</th>
                  <th>Học hàm / Học vị</th>
                  <th>Số CCCD</th>
                  <th>Số ĐT</th>
                  <th>Số HĐ</th>
                  <th>Thời hạn HĐ</th>
                  <th>Trạng thái HĐ</th>
                  <th>File HĐ</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={14}><div className="page-loading"><div className="spinner" /><span>Đang tải...</span></div></td></tr>
                ) : tableFiltered.length === 0 ? (
                  <tr><td colSpan={14}><div className="table-empty"><p>{search ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có hồ sơ chuyên gia nào. Nhấn "+ Thêm mới" để bắt đầu.'}</p></div></td></tr>
                ) : tableFiltered.map((e, index) => {
                  const { label, variant } = getContractBadge(e.monthsLeft);
                  const rowCls = getWarningRowClass(e.monthsLeft, 2);
                  return (
                    <tr key={e.id} className={rowCls}>
                      <td style={{ textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {e.honorific || (e.gender === 'Nữ' ? 'Bà' : 'Ông')}
                      </td>
                      <td>
                        <strong
                          style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => openDetail(e)}
                          title="Nhấn để xem toàn bộ chi tiết hồ sơ"
                        >
                          {e.name}
                        </strong>
                      </td>
                      <td>{e.yearCalculated}</td>
                      <td>
                        {e.folderName ? (
                          <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            📁 {e.folderName}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Chung</span>
                        )}
                      </td>
                      <td><span className="badge badge-info">{e.faculty || '—'}</span></td>
                      <td>
                        {e.academicTitle && e.academicTitle !== 'Không có' ? `${e.academicTitle}. ` : ''}
                        {e.degree || e.title || '—'}
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>{e.cccd || '—'}</td>
                      <td>{e.phone || '—'}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{e.contractNo}</td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                        {formatDate(e.startDate)} → {formatDate(e.endDate)}
                      </td>
                      <td><span className={`badge ${variant}`}>{label}</span></td>
                      <td>
                        {e.contractFileName
                          ? <FilePill fileName={e.contractFileName} url={e.contractFileUrl} />
                          : <span className="text-muted">—</span>}
                      </td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button className="btn btn-outline btn-xs" onClick={() => openDetail(e)} title="Xem chi tiết">Chi tiết</button>
                        {' '}
                        <button className="btn btn-outline btn-xs" onClick={() => openEdit(e)}>Sửa</button>
                        {' '}
                        <button className="btn btn-danger btn-xs" onClick={() => handleDelete(e)} title="Xóa hồ sơ">Xóa</button>
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

      {/* ================= MODAL THÊM MỚI / CHỈNH SỬA ================= */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Chỉnh sửa hồ sơ Chuyên gia Thỉnh giảng' : currentFolderName ? `Thêm mới Chuyên gia vào: 📂 ${currentFolderName}` : 'Thêm mới Chuyên gia Thỉnh giảng'}
        size="modal-xl"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : (editId ? 'Cập nhật' : 'Thêm chuyên gia')}
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

        {/* PHẦN 1: THÔNG TIN NHÂN THÂN & CÁ NHÂN */}
        <div className="form-section-title">1. Thông tin Cá nhân & Nhân thân</div>
        <div className="form-row">
          <div className="form-group" style={{ flex: '0 0 100px' }}>
            <label className="form-label">Ông / Bà</label>
            <select className="form-control" value={form.honorific} onChange={e => setF('honorific', e.target.value)}>
              {HONORIFICS.map(h => <option key={h}>{h}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: '0 0 110px' }}>
            <label className="form-label">Giới tính</label>
            <select className="form-control" value={form.gender} onChange={e => handleGenderChange(e.target.value)}>
              {GENDERS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Họ và tên <span className="required">*</span></label>
            <input className="form-control" value={form.name} onChange={e => setF('name', e.target.value)} required />
          </div>
          <div className="form-group" style={{ flex: 1.3 }}>
            <label className="form-label">Số CCCD</label>
            <input className="form-control" value={form.cccd} onChange={e => setF('cccd', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1.3 }}>
            <label className="form-label">Số điện thoại (SĐT)</label>
            <input className="form-control" value={form.phone} onChange={e => setF('phone', e.target.value)} />
          </div>
        </div>

        {/* Ngày tháng năm sinh & Quê quán */}
        <div className="form-row">
          <div className="form-group" style={{ flex: 1.3 }}>
            <label className="form-label">Ngày sinh (Lịch)</label>
            <input className="form-control" type="date" value={form.birthDate} onChange={e => handleBirthDateChange(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: '0 0 75px' }}>
            <label className="form-label">Ngày</label>
            <input className="form-control" type="number" min="1" max="31" value={form.birthDay} onChange={e => handleBirthPartChange('birthDay', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: '0 0 75px' }}>
            <label className="form-label">Tháng</label>
            <input className="form-control" type="number" min="1" max="12" value={form.birthMonth} onChange={e => handleBirthPartChange('birthMonth', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: '0 0 90px' }}>
            <label className="form-label">Năm</label>
            <input className="form-control" type="number" min="1940" max="2010" value={form.birthYear} onChange={e => handleBirthPartChange('birthYear', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Quê quán</label>
            <input className="form-control" value={form.hometown} onChange={e => setF('hometown', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Địa chỉ thường trú</label>
            <input className="form-control" value={form.permanentAddress} onChange={e => setF('permanentAddress', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Nơi ở hiện tại</label>
            <input className="form-control" value={form.currentAddress} onChange={e => setF('currentAddress', e.target.value)} />
          </div>
        </div>

        <div className="divider" />

        {/* PHẦN 2: CHUYÊN MÔN & ĐƠN VỊ CÔNG TÁC */}
        <div className="form-section-title">2. Học hàm, Học vị & Cơ quan công tác</div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Học hàm</label>
            <select className="form-control" value={form.academicTitle} onChange={e => setF('academicTitle', e.target.value)}>
              {ACADEMIC_TITLES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Học vị</label>
            <select className="form-control" value={form.degree} onChange={e => setF('degree', e.target.value)}>
              {DEGREES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1.2 }}>
            <label className="form-label">Ngày bổ nhiệm GS/PGS</label>
            <input className="form-control" type="date" value={form.appointedDate} onChange={e => setF('appointedDate', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1.5 }}>
            <label className="form-label">Nghề nghiệp</label>
            <input className="form-control" value={form.occupation} onChange={e => setF('occupation', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Đơn vị tiếp nhận (Khoa / Viện) <span className="required">*</span></label>
            <select className="form-control" value={form.faculty} onChange={e => setF('faculty', e.target.value)}>
              {FACULTIES.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Nơi công tác chính (Cơ quan / Doanh nghiệp)</label>
            <input className="form-control" value={form.workplace} onChange={e => setF('workplace', e.target.value)} />
          </div>
        </div>

        <div className="divider" />

        {/* PHẦN 3: TÀI KHOẢN NGÂN HÀNG */}
        <div className="form-section-title">3. Thông tin Tài khoản Ngân hàng (Chi trả thù lao)</div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Số tài khoản (STK)</label>
            <input className="form-control" value={form.bankAccount} onChange={e => setF('bankAccount', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Ngân hàng & Chi nhánh</label>
            <input className="form-control" value={form.bankName} onChange={e => setF('bankName', e.target.value)} />
          </div>
        </div>

        <div className="divider" />

        {/* PHẦN 4: THÔNG TIN HỢP ĐỒNG THỈNH GIẢNG */}
        <div className="form-section-title">4. Thông tin Hợp đồng Thỉnh giảng Hiện tại</div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1.2 }}>
            <label className="form-label">Số hợp đồng (Số HĐ) <span className="required">*</span></label>
            <input className="form-control" value={form.contractNo} onChange={e => setF('contractNo', e.target.value)} required />
          </div>
          <div className="form-group" style={{ flex: 0.9 }}>
            <label className="form-label">Năm HĐ</label>
            <input
              className="form-control"
              value={form.year}
              onChange={e => setF('year', e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Ngày ký hợp đồng</label>
            <input
              className="form-control"
              type="date"
              value={form.contractSignDate}
              onChange={e => {
                setF('contractSignDate', e.target.value);
                if (e.target.value && e.target.value.length >= 4) {
                  setF('year', e.target.value.substring(0, 4));
                }
              }}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Hiệu lực từ ngày</label>
            <input className="form-control" type="date" value={form.startDate} onChange={e => setF('startDate', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Hết hạn đến ngày <span className="required">*</span></label>
            <input className="form-control" type="date" value={form.endDate} onChange={e => setF('endDate', e.target.value)} required />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Upload file Hợp đồng đính kèm (PDF, Word, Ảnh scan)</label>
          <UploadArea
            onFileSelect={files => setContractFile(files[0])}
            allowedTypes={['pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png']}
            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
            hint="PDF, Word, JPG, PNG – Bản scan hoặc văn bản hợp đồng"
            selectedFiles={contractFile ? [contractFile] : []}
          />
          {editId && !contractFile && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              💡 Để trống nếu không muốn thay đổi file hợp đồng hiện tại.
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú thêm</label>
          <textarea className="form-control" rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} />
        </div>
      </Modal>

      {/* Modal Xem chi tiết Hồ sơ Chuyên gia */}
      {detailItem && (
        <Modal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Chi tiết Hồ sơ: ${detailItem.honorific || ''} ${detailItem.name}`}
          size="modal-lg"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setDetailModalOpen(false)}>Đóng</button>
              <button className="btn btn-primary" onClick={() => { setDetailModalOpen(false); openEdit(detailItem); }}>Chỉnh sửa hồ sơ</button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', fontSize: 13, lineHeight: 1.6 }}>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Ông/Bà:</strong> <span style={{ fontWeight: 600 }}>{detailItem.honorific || (detailItem.gender === 'Nữ' ? 'Bà' : 'Ông')}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Họ và tên:</strong> <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{detailItem.name}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Giới tính:</strong> {detailItem.gender || '—'}</div>

            <div><strong style={{ color: 'var(--text-secondary)' }}>Ngày tháng năm sinh:</strong> {detailItem.birthDate ? formatDate(detailItem.birthDate) : (detailItem.birthYear ? `${detailItem.birthDay || '?'}/${detailItem.birthMonth || '?'}/${detailItem.birthYear}` : '—')}</div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Số CCCD:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{detailItem.cccd || '—'}</span></div>

            <div><strong style={{ color: 'var(--text-secondary)' }}>Số điện thoại (SĐT):</strong> {detailItem.phone || '—'}</div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Quê quán:</strong> {detailItem.hometown || '—'}</div>

            <div style={{ gridColumn: 'span 2' }}><strong style={{ color: 'var(--text-secondary)' }}>Địa chỉ thường trú:</strong> {detailItem.permanentAddress || '—'}</div>
            <div style={{ gridColumn: 'span 2' }}><strong style={{ color: 'var(--text-secondary)' }}>Nơi ở hiện tại:</strong> {detailItem.currentAddress || '—'}</div>

            <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4, fontWeight: 700, color: 'var(--primary)' }}>
              Trình độ & Cơ quan công tác
            </div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Học hàm:</strong> {detailItem.academicTitle || 'Không có'}</div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Học vị:</strong> {detailItem.degree || '—'}</div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Ngày bổ nhiệm GS/PGS:</strong> {detailItem.appointedDate ? formatDate(detailItem.appointedDate) : '—'}</div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Nghề nghiệp:</strong> {detailItem.occupation || '—'}</div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Đơn vị tiếp nhận:</strong> <span className="badge badge-info">{detailItem.faculty || '—'}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Đơn vị công tác chính:</strong> {detailItem.workplace || '—'}</div>

            <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4, fontWeight: 700, color: 'var(--primary)' }}>
              Tài khoản Ngân hàng
            </div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Số tài khoản (STK):</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{detailItem.bankAccount || '—'}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Ngân hàng:</strong> {detailItem.bankName || '—'}</div>

            <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4, fontWeight: 700, color: 'var(--primary)' }}>
              Hợp đồng Thỉnh giảng Hiện tại
            </div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Số hợp đồng:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{detailItem.contractNo || '—'}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Năm hợp đồng:</strong> <span className="badge badge-info">{detailItem.year || getExpertYear(detailItem)}</span></div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Thư mục lưu trữ:</strong> {detailItem.folderName ? <span className="badge badge-info">📁 {detailItem.folderName}</span> : 'Thư mục chung'}</div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Ngày ký HĐ:</strong> {formatDate(detailItem.contractSignDate)}</div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Từ ngày:</strong> {formatDate(detailItem.startDate)}</div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Đến ngày:</strong> {formatDate(detailItem.endDate)}</div>
            <div>
              <strong style={{ color: 'var(--text-secondary)' }}>Trạng thái HĐ:</strong>&nbsp;
              {(() => {
                const ml = getContractMonthsLeft(detailItem.endDate);
                const { label, variant } = getContractBadge(ml);
                return <span className={`badge ${variant}`}>{label}</span>;
              })()}
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)' }}>File hợp đồng:</strong>&nbsp;
              {detailItem.contractFileName ? (
                <FilePill fileName={detailItem.contractFileName} url={detailItem.contractFileUrl} />
              ) : 'Chưa đính kèm file'}
            </div>
            {detailItem.notes && (
              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Ghi chú:</strong> {detailItem.notes}
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};

export default ExpertsPage;
