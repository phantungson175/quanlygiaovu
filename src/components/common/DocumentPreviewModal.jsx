// src/components/common/DocumentPreviewModal.jsx
// Modal xem trực tiếp tài liệu thông minh (PDF, Hình ảnh Scan, Google Drive Embed, Văn phòng Office...)
import { useState, useEffect } from 'react';
import { resolveFileForPreview, downloadFileSafely } from '../../services/storageHelper';
import { formatFileSize, getFileType } from '../../utils/fileUtils';
import toast from 'react-hot-toast';

const DocumentPreviewModal = ({ isOpen, onClose, fileName, url }) => {
  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Trạng thái cho ảnh (Phóng to / Thu nhỏ / Xoay)
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let currentBlobUrl = null;

    const loadPreview = async () => {
      if (!isOpen || !url) return;
      setLoading(true);
      setErrorMsg(null);
      setZoom(1);
      setRotation(0);

      try {
        const res = await resolveFileForPreview(url, fileName);
        if (!res) {
          setErrorMsg('Không thể mở tệp này.');
        } else if (res.error) {
          setErrorMsg(res.error);
        } else {
          setResolved(res);
          if (res.isBlob) {
            currentBlobUrl = res.previewUrl;
          }
        }
      } catch (err) {
        console.error('Lỗi nạp file xem trước:', err);
        setErrorMsg('Lỗi khi nạp tài liệu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();

    return () => {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [isOpen, url, fileName]);

  if (!isOpen) return null;

  const fileType = getFileType(fileName, url);
  const ext = fileType === 'gdrive' ? 'G-DRIVE' : (fileName?.split('.').pop()?.toUpperCase() || 'FILE');

  const handleDownload = () => {
    downloadFileSafely(url, fileName);
    toast.success(`Đang tải tệp "${fileName}"...`);
  };

  const handleOpenNewTab = () => {
    if (resolved?.previewUrl) {
      window.open(resolved.previewUrl, '_blank');
    } else {
      downloadFileSafely(url, fileName);
    }
  };

  const handlePrint = () => {
    if (resolved?.previewUrl) {
      const printWindow = window.open(resolved.previewUrl, '_blank');
      printWindow?.focus();
      setTimeout(() => {
        try {
          printWindow?.print();
        } catch {
          // fallback
        }
      }, 500);
    }
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation(r => (r + 90) % 360);
  const handleResetImage = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '95vw',
          maxWidth: '1100px',
          height: '90vh',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div
          style={{
            padding: '12px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <span style={{ fontSize: '22px' }}>
              {fileType === 'gdrive' ? '☁️' : fileType === 'pdf' ? '📕' : fileType === 'img' ? '🖼️' : fileType === 'excel' ? '📊' : fileType === 'word' ? '📄' : '📁'}
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '480px',
                }}
                title={fileName}
              >
                {fileName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#64748b', marginTop: 1 }}>
                <span
                  style={{
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: fileType === 'gdrive' ? '#dbeafe' : fileType === 'pdf' ? '#fee2e2' : fileType === 'img' ? '#e0e7ff' : '#f1f5f9',
                    color: fileType === 'gdrive' ? '#1d4ed8' : fileType === 'pdf' ? '#b91c1c' : fileType === 'img' ? '#4338ca' : '#475569',
                  }}
                >
                  {ext}
                </span>
                {resolved?.size && (
                  <span>· {formatFileSize(resolved.size)}</span>
                )}
                <span>· {fileType === 'gdrive' ? 'Lưu trữ Google Drive Khoa (0đ)' : 'Chế độ xem trực tiếp an toàn'}</span>
              </div>
            </div>
          </div>

          {/* ACTION TOOLBAR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Thanh công cụ riêng cho Ảnh */}
            {fileType === 'img' && !loading && !errorMsg && (
              <div style={{ display: 'flex', alignItems: 'center', background: '#e2e8f0', borderRadius: '6px', padding: '2px 4px', gap: 2 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={handleZoomIn}
                  title="Phóng to (+)"
                  style={{ padding: '3px 8px', fontSize: 13, fontWeight: 700 }}
                >
                  🔍+
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={handleZoomOut}
                  title="Thu nhỏ (-)"
                  style={{ padding: '3px 8px', fontSize: 13, fontWeight: 700 }}
                >
                  🔍-
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={handleRotate}
                  title="Xoay 90 độ (cho tài liệu scan ngang)"
                  style={{ padding: '3px 8px', fontSize: 13 }}
                >
                  🔄
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={handleResetImage}
                  title="Đặt lại kích thước ban đầu"
                  style={{ padding: '3px 6px', fontSize: 11 }}
                >
                  1:1
                </button>
              </div>
            )}

            {/* Mở tab mới */}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleOpenNewTab}
              title="Mở tài liệu trong tab trình duyệt mới"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', fontSize: 12.5 }}
            >
              <span>↗</span> Tab mới
            </button>

            {/* In ấn */}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handlePrint}
              title="In trực tiếp tài liệu ra máy in"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', fontSize: 12.5 }}
            >
              <span>🖨️</span> In
            </button>

            {/* Tải về */}
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleDownload}
              title="Tải tệp này về máy tính"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', fontSize: 12.5, background: '#1d4ed8' }}
            >
              <span>📥</span> Tải về
            </button>

            {/* Đóng */}
            <button
              type="button"
              onClick={onClose}
              title="Đóng cửa sổ xem"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '22px',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px 8px',
                lineHeight: 1,
                marginLeft: 4,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* BODY XEM TÀI LIỆU */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            background: fileType === 'img' ? '#334155' : '#f1f5f9',
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
              <div style={{ color: '#64748b', fontSize: 13.5, fontWeight: 600 }}>Đang mở tài liệu...</div>
            </div>
          ) : errorMsg ? (
            <div
              style={{
                maxWidth: 480,
                textAlign: 'center',
                padding: 30,
                background: '#ffffff',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
              <h4 style={{ color: '#b91c1c', marginBottom: 8 }}>Không thể xem trước tệp</h4>
              <p style={{ color: '#475569', fontSize: 13.5, lineHeight: 1.5, marginBottom: 16 }}>
                {errorMsg}
              </p>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleDownload}>
                📥 Vẫn thử tải tệp về máy
              </button>
            </div>
          ) : resolved?.isGoogleDriveFolder ? (
            /* THẺ THÔNG BÁO CHO THƯ MỤC GOOGLE DRIVE */
            <div
              style={{
                maxWidth: 540,
                textAlign: 'center',
                padding: '40px 24px',
                background: '#ffffff',
                borderRadius: 12,
                boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 14 }}>📁</div>
              <h3 style={{ fontSize: 18, color: '#0f172a', marginBottom: 8, wordBreak: 'break-word' }}>
                {fileName || 'Thư mục Google Drive'}
              </h3>
              <p style={{ color: '#475569', fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
                Bạn đã gắn liên kết tới <strong>nguyên một Thư mục</strong> Google Drive.
                Vì thư mục chứa nhiều tệp con, Google không hỗ trợ nhúng toàn bộ thư mục vào khung xem trực tiếp.
                <br />
                <span style={{ fontSize: 12.5, color: '#166534', fontWeight: 600, display: 'block', marginTop: 8 }}>
                  💡 Mẹo: Để xem trước tài liệu (PDF/Ảnh/Word) trực tiếp trong khung này, bạn hãy vào thư mục trên Drive $\to$ bấm chuột phải vào chính tệp tài liệu đó $\to$ chọn Chia sẻ.
                </span>
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.open(url, '_blank')}
                style={{ background: '#2563eb', padding: '10px 20px', fontWeight: 600 }}
              >
                ↗ Mở thư mục trên Google Drive
              </button>
            </div>
          ) : (fileType === 'pdf' || fileType === 'gdrive' || resolved?.isGoogleDrive) ? (
            /* TRÌNH XEM PDF & GOOGLE DRIVE TRỰC TIẾP */
            <iframe
              src={resolved?.previewUrl}
              title={fileName}
              allow="autoplay"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#525659',
              }}
            />
          ) : fileType === 'img' ? (
            /* TRÌNH XEM ẢNH SCAN TƯƠNG TÁC */
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto',
                padding: 20,
              }}
            >
              <img
                src={resolved?.previewUrl}
                alt={fileName}
                style={{
                  maxWidth: '90%',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  borderRadius: 4,
                  background: '#fff',
                }}
              />
            </div>
          ) : fileType === 'excel' || fileType === 'word' ? (
            /* THẺ THÔNG TIN TÀI LIỆU VĂN PHÒNG */
            <div
              style={{
                maxWidth: 520,
                textAlign: 'center',
                padding: '40px 30px',
                background: '#ffffff',
                borderRadius: 12,
                boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>
                {fileType === 'excel' ? '📊' : '📄'}
              </div>
              <h3 style={{ fontSize: 18, color: '#0f172a', marginBottom: 8, wordBreak: 'break-word' }}>
                {fileName}
              </h3>
              <p style={{ color: '#64748b', fontSize: 13.5, lineHeight: 1.6, marginBottom: 24 }}>
                Đây là tài liệu định dạng <strong>{ext} ({fileType === 'excel' ? 'Bảng tính Excel' : 'Văn bản Word'})</strong>.
                Để xem chuẩn xác bảng tính, công thức và bố cục, bạn vui lòng tải về để mở trực tiếp trong Microsoft Office hoặc mở qua Google Docs.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleDownload}
                  style={{ background: '#2563eb', padding: '10px 20px', fontWeight: 600 }}
                >
                  📥 Tải tài liệu về máy ({ext})
                </button>
              </div>
            </div>
          ) : (
            /* TRÌNH XEM CHUNG CHO CÁC TỆP KHÁC */
            <div
              style={{
                maxWidth: 480,
                textAlign: 'center',
                padding: '30px 20px',
                background: '#ffffff',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>📁</div>
              <h4 style={{ color: '#0f172a', marginBottom: 8 }}>{fileName}</h4>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 18 }}>
                Tệp định dạng <strong>.{ext}</strong> không hỗ trợ xem trực tiếp trên trình duyệt.
              </p>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleDownload}>
                📥 Tải tệp về máy tính
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
