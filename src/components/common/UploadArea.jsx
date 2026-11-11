// src/components/common/UploadArea.jsx
// Khu vực tải file đa phương thức: Hỗ trợ Upload tệp từ máy tính & Nhúng link Google Drive 0đ
import { useRef, useState } from 'react';
import { validateFileType, validateFileSize } from '../../utils/fileUtils';
import { isGoogleDriveUrl, isGoogleDriveFolderUrl } from '../../services/storageHelper';
import toast from 'react-hot-toast';

const UploadArea = ({
  onFileSelect,
  onRemoveFile,
  multiple = false,
  accept = '.pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.webp',
  allowedTypes = ['pdf', 'xlsx', 'xls', 'docx', 'doc', 'jpg', 'jpeg', 'png', 'webp'],
  maxMB = 25,
  hint = 'PDF, Excel, Word, Ảnh JPG/PNG',
  selectedFiles = [],
}) => {
  const inputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'gdrive'
  const [dragging, setDragging] = useState(false);

  // State cho tab Google Drive
  const [driveUrl, setDriveUrl] = useState('');
  const [driveFileName, setDriveFileName] = useState('');

  const handleFiles = (files) => {
    const validFiles = [];
    for (const file of Array.from(files)) {
      if (!validateFileType(file, allowedTypes)) {
        toast.error(`File "${file.name}" không đúng định dạng cho phép!`);
        continue;
      }
      if (!validateFileSize(file, maxMB)) {
        toast.error(`File "${file.name}" vượt quá ${maxMB}MB!`);
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length > 0) onFileSelect(validFiles);
  };

  const handleConfirmDriveLink = () => {
    if (!driveUrl.trim()) {
      toast.error('Vui lòng dán liên kết Google Drive hoặc đường dẫn tài liệu!');
      return;
    }

    const trimmedUrl = driveUrl.trim();
    const isDrive = isGoogleDriveUrl(trimmedUrl);
    const fallbackName = isDrive ? 'Tài liệu Google Drive' : 'Liên kết tài liệu đính kèm';
    const finalName = driveFileName.trim() || fallbackName;

    const linkFileObj = {
      isLink: true,
      isExternalLink: true,
      fileUrl: trimmedUrl,
      fileName: finalName,
      name: finalName,
      size: 0,
      type: isDrive ? 'application/pdf' : 'text/html',
    };

    onFileSelect([linkFileObj]);
    toast.success('Đã gắn liên kết tài liệu thành công!');
    if (isGoogleDriveFolderUrl(trimmedUrl)) {
      toast('💡 Bạn đang gắn link Thư mục. Để xem trước nội dung trực tiếp, hãy copy link của từng tệp bên trong thư mục nhé!', { icon: 'ℹ️', duration: 5000 });
    }
    setDriveUrl('');
    setDriveFileName('');
  };

  const handleRemoveFile = (indexToRemove) => {
    if (onRemoveFile) {
      onRemoveFile(indexToRemove);
    } else if (multiple) {
      onFileSelect(selectedFiles.filter((_, idx) => idx !== indexToRemove));
    } else {
      onFileSelect([]);
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: 12.5,
            fontWeight: 600,
            border: 'none',
            borderBottom: activeTab === 'upload' ? '2px solid #2563eb' : '2px solid transparent',
            background: activeTab === 'upload' ? '#ffffff' : 'transparent',
            color: activeTab === 'upload' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span>📁</span> Tải tệp từ máy tính
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gdrive')}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: 12.5,
            fontWeight: 600,
            border: 'none',
            borderBottom: activeTab === 'gdrive' ? '2px solid #2563eb' : '2px solid transparent',
            background: activeTab === 'gdrive' ? '#ffffff' : 'transparent',
            color: activeTab === 'gdrive' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span>☁️</span> Google Drive / Đám mây
        </button>
      </div>

      <div style={{ padding: 12 }}>
        {/* TAB 1: UPLOAD FILE TRUYỀN THỐNG */}
        {activeTab === 'upload' && (
          <div>
            <div
              className={`upload-area ${dragging ? 'dragging' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: 6,
                padding: '16px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragging ? '#eff6ff' : '#fafafa',
                transition: 'all 0.2s ease',
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginBottom: 4 }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="upload-text" style={{ fontSize: 13, fontWeight: 600, margin: '2px 0', color: '#0f172a' }}>
                Nhấn hoặc kéo thả file vào đây
              </p>
              <p className="upload-hint" style={{ fontSize: 11.5, color: '#64748b', margin: 0 }}>
                {hint}
              </p>

              <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files?.length) handleFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: DÁN LINK GOOGLE DRIVE (LƯU TRỮ VĨNH VIỄN 0Đ) */}
        {activeTab === 'gdrive' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Đường dẫn liên kết Google Drive / Đám mây <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="url"
                className="form-control"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                style={{ fontSize: 12.5 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Tên hiển thị tài liệu
              </label>
              <input
                type="text"
                className="form-control"
                value={driveFileName}
                onChange={(e) => setDriveFileName(e.target.value)}
                style={{ fontSize: 12.5 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 2 }}>
              <button
                type="button"
                className="btn btn-primary btn-xs"
                onClick={handleConfirmDriveLink}
                style={{ padding: '5px 14px', whiteSpace: 'nowrap' }}
              >
                Gắn liên kết
              </button>
            </div>
          </div>
        )}

        {/* DANH SÁCH FILE ĐÃ CHỌN HOẶC GẮN LINK */}
        {selectedFiles.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {selectedFiles.map((f, i) => {
              const isDrive = f.isLink || (f.fileUrl && isGoogleDriveUrl(f.fileUrl));
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    background: isDrive ? '#eff6ff' : '#f0f4fa',
                    border: `1px solid ${isDrive ? '#93c5fd' : '#d4dce8'}`,
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: 10, color: isDrive ? '#1d4ed8' : 'var(--primary)', fontWeight: 700 }}>
                    {isDrive ? 'GOOGLE DRIVE:' : 'TỆP ĐÍNH KÈM:'}
                  </span>
                  <span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.name || f.fileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(i)}
                    title="Bỏ chọn tệp này"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: 14,
                      lineHeight: 1,
                      padding: '0 2px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadArea;
