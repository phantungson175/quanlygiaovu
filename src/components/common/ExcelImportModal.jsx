// src/components/common/ExcelImportModal.jsx
// Modal Nhập dữ liệu hàng loạt từ file Excel (.xlsx, .xls)
import { useState } from 'react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const ExcelImportModal = ({
  isOpen,
  onClose,
  title = 'Nhập dữ liệu từ Excel',
  moduleName,
  sampleColumns = [],
  sampleRows = [],
  templateFileName = 'Mau_Nhap_Du_Lieu.xlsx',
  folders = [],
  selectedYear = null,
  onImport,
}) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [targetFolderId, setTargetFolderId] = useState('');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  // 1. Tải về file mẫu Excel
  const handleDownloadTemplate = () => {
    try {
      const headers = sampleColumns.map(c => c.label);
      const dataRows = sampleRows.map(row => {
        const obj = {};
        sampleColumns.forEach(c => {
          obj[c.label] = row[c.key] ?? '';
        });
        return obj;
      });

      const ws = XLSX.utils.json_to_sheet(dataRows, { header: headers });
      
      // Định dạng độ rộng cột
      ws['!cols'] = sampleColumns.map(c => ({ wch: Math.max(c.label.length + 4, 16) }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Mau_Nhap');
      XLSX.writeFile(wb, templateFileName);
      toast.success('Đã tải xuống file Excel mẫu!');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi tạo file mẫu: ' + err.message);
    }
  };

  // 2. Đọc file tải lên
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const buffer = evt.target.result;
        const wb = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (rawJson.length === 0) {
          toast.error('File Excel không có dữ liệu!');
          setParsedData([]);
          return;
        }

        // Ánh xạ các cột trong file về đúng key của hệ thống
        const normalized = rawJson.map(row => {
          const item = {};
          sampleColumns.forEach(col => {
            // Tìm giá trị theo tên nhãn cột tiếng Việt hoặc tên key
            const val = row[col.label] !== undefined ? row[col.label] : row[col.key];
            item[col.key] = val !== undefined ? String(val).trim() : '';
          });
          return item;
        }).filter(item => {
          // Lọc bỏ các hàng rỗng
          return Object.values(item).some(v => v !== '');
        });

        setParsedData(normalized);
        toast.success(`Đã đọc ${normalized.length} dòng dữ liệu từ file Excel!`);
      } catch (err) {
        console.error('Lỗi đọc Excel:', err);
        toast.error('Không thể đọc file Excel: ' + err.message);
        setParsedData([]);
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  // 3. Tiến hành nhập vào hệ thống
  const handleExecuteImport = async () => {
    if (parsedData.length === 0) {
      toast.error('Chưa có dữ liệu để nhập!');
      return;
    }

    setImporting(true);
    setProgress(0);

    try {
      const selectedFolder = folders.find(f => f.id === targetFolderId);
      const folderInfo = selectedFolder
        ? { folderId: selectedFolder.id, folderName: selectedFolder.name }
        : { folderId: null, folderName: '' };

      await onImport(parsedData, folderInfo, (current, total) => {
        setProgress(Math.round((current / total) * 100));
      });

      toast.success(`Nhập thành công ${parsedData.length} bản ghi vào hệ thống!`, { duration: 4000 });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi nhập dữ liệu: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 840, width: '92%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} disabled={importing}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
          {/* Bước 1: Tải file mẫu */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 6, padding: '14px 18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>Bước 1: Tải file Excel mẫu chuẩn</strong>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Điền dữ liệu theo đúng các cột trong mẫu để hệ thống nhận diện chính xác 100%.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleDownloadTemplate}
                style={{ fontSize: 13, background: '#fff' }}
              >
                Tải file mẫu Excel (.xlsx)
              </button>
            </div>
          </div>

          {/* Bước 2: Chọn thư mục đích & Tải file lên */}
          <div style={{ display: 'grid', gridTemplateColumns: folders.length > 0 ? '1fr 2fr' : '1fr', gap: 14, marginBottom: 16 }}>
            {folders.length > 0 && (
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Lưu vào Thư mục</label>
                <select
                  className="form-control"
                  value={targetFolderId}
                  onChange={e => setTargetFolderId(e.target.value)}
                  disabled={importing}
                >
                  <option value="">Thư mục chung {selectedYear ? `(Năm ${selectedYear})` : ''}</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>📁 {f.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Bước 2: Chọn tệp Excel đã điền dữ liệu (.xlsx, .xls)</label>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                className="form-control"
                onChange={handleFileUpload}
                disabled={importing}
              />
            </div>
          </div>

          {/* Bước 3: Xem trước dữ liệu */}
          {parsedData.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong style={{ fontSize: 13.5, color: 'var(--primary)' }}>
                  Bước 3: Xem trước dữ liệu ({parsedData.length} bản ghi)
                </strong>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Hiển thị tối đa 50 dòng đầu tiên
                </span>
              </div>

              <div className="table-wrap" style={{ maxHeight: 280, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 4 }}>
                <table style={{ fontSize: 12 }}>
                  <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                    <tr>
                      <th style={{ width: 40, textAlign: 'center' }}>STT</th>
                      {sampleColumns.map(c => (
                        <th key={c.key}>{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 50).map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
                        {sampleColumns.map(c => (
                          <td key={c.key} style={{ whiteSpace: 'nowrap', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {row[c.key] || <span style={{ color: '#cbd5e1' }}>—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tiến độ */}
          {importing && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>Đang ghi dữ liệu vào hệ thống...</span>
                <strong>{progress}%</strong>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.2s' }} />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={importing}>
            Hủy
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExecuteImport}
            disabled={parsedData.length === 0 || importing}
          >
            {importing ? (
              <><span className="spinner" style={{ width: 14, height: 14 }} /> Đang xử lý ({progress}%)...</>
            ) : (
              `Xác nhận Nhập ${parsedData.length > 0 ? `(${parsedData.length} bản ghi)` : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportModal;
