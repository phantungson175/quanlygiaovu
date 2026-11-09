// src/components/common/FilePill.jsx
// Hiển thị tên file chuẩn mực công vụ, hỗ trợ mở trực tiếp trong Tab mới & tải về
import { useState } from 'react';
import { getFileType, getFileIcon } from '../../utils/fileUtils';
import { downloadFileSafely, openFileInNewTab } from '../../services/storageHelper';
import DocumentPreviewModal from './DocumentPreviewModal';

const FilePill = ({ fileName, url, preferModal = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!fileName) return null;
  const type = getFileType(fileName, url);
  const tag = getFileIcon(fileName, url);

  const handleClick = (e) => {
    if (url) {
      e.preventDefault();
      e.stopPropagation();
      if (preferModal) {
        setModalOpen(true);
      } else {
        // Mở trực tiếp sang Tab mới toàn màn hình hoặc Drive
        openFileInNewTab(url, fileName);
      }
    }
  };

  const handleQuickDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) {
      downloadFileSafely(url, fileName);
    }
  };

  return (
    <>
      <span
        className={`file-pill ${type}`}
        onClick={url ? handleClick : undefined}
        style={{
          cursor: url ? 'pointer' : 'default',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          userSelect: 'none',
        }}
        title={url ? `Bấm để mở xem "${fileName}" trong Tab mới (hoặc bấm 📥 để tải về)` : fileName}
      >
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          padding: '1px 5px',
          borderRadius: 3,
          background: type === 'gdrive' ? '#dbeafe' : 'rgba(0, 0, 0, 0.08)',
          color: type === 'gdrive' ? '#1d4ed8' : 'inherit',
          letterSpacing: '0.4px',
        }}>
          {tag}
        </span>
        <span style={{ maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {fileName}
        </span>
        {url && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginLeft: 2 }}>
            <span
              title="Mở trong Tab mới"
              style={{
                fontSize: 11,
                opacity: 0.7,
                cursor: 'pointer',
              }}
            >
              ↗
            </span>
            <span
              onClick={handleQuickDownload}
              title="Tải nhanh về máy tính"
              style={{
                opacity: 0.6,
                fontSize: 11,
                padding: '0 2px',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
            >
              📥
            </span>
          </span>
        )}
      </span>

      {modalOpen && (
        <DocumentPreviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          fileName={fileName}
          url={url}
        />
      )}
    </>
  );
};

export default FilePill;
