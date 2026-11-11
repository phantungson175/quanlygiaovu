// src/components/common/DocumentPreviewModal.jsx
// Modal xem trực tiếp tài liệu thông minh (PDF, Hình ảnh Scan, Google Drive Embed, Văn phòng Office...)
import { useState, useEffect, useRef } from 'react';
import { resolveFileForPreview, downloadFileSafely } from '../../services/storageHelper';
import { formatFileSize, getFileType } from '../../utils/fileUtils';
import { parseExcelPreview, parseDocxPreview } from '../../utils/officePreview';
import toast from 'react-hot-toast';

const renderDocxRuns = (runs = []) => {
  return runs.map((run, idx) => {
    if (run.kind === 'br') return <br key={idx} />;
    if (run.kind === 'img') {
      return (
        <img
          key={idx}
          src={run.src}
          alt="Minh họa văn bản"
          style={{ maxWidth: '100%', height: 'auto', display: 'inline-block', margin: '4px 0' }}
        />
      );
    }
    const s = run.style || {};
    const textStyle = {
      fontWeight: s.bold ? 700 : undefined,
      fontStyle: s.italic ? 'italic' : undefined,
      textDecoration: [s.underline ? 'underline' : '', s.strike ? 'line-through' : ''].filter(Boolean).join(' ') || undefined,
      color: s.color || undefined,
      fontSize: s.fontSize ? `${s.fontSize}pt` : undefined,
    };
    if (run.linkHref) {
      return (
        <a key={idx} href={run.linkHref} target="_blank" rel="noreferrer" style={{ ...textStyle, color: '#1d4ed8', textDecoration: 'underline' }}>
          {run.text}
        </a>
      );
    }
    return <span key={idx} style={textStyle}>{run.text}</span>;
  });
};

const renderDocxBlocks = (blocks = [], inTable = false) => {
  return blocks.map((block, bIdx) => {
    if (block.type === 'table') {
      return (
        <div key={bIdx} style={{ overflowX: 'auto', margin: '10px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #94a3b8' }}>
            <tbody>
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      colSpan={cell.colSpan > 1 ? cell.colSpan : undefined}
                      style={{
                        border: '1px solid #94a3b8',
                        padding: '6px 8px',
                        verticalAlign: 'top',
                        backgroundColor: cell.bgColor || undefined,
                      }}
                    >
                      {renderDocxBlocks(cell.blocks, true)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    const isEmpty = !block.runs || block.runs.length === 0 || block.runs.every(r => r.kind === 'text' && !r.text);
    if (isEmpty) {
      return <div key={bIdx} style={{ height: inTable ? '0.4em' : '0.8em' }} />;
    }

    const headingStyles = {
      title: { fontSize: '20pt', fontWeight: 700, margin: '10px 0 8px' },
      subtitle: { fontSize: '14pt', fontStyle: 'italic', color: '#475569', margin: '4px 0 10px' },
      h1: { fontSize: '16pt', fontWeight: 700, margin: '12px 0 6px', color: '#0f172a' },
      h2: { fontSize: '14pt', fontWeight: 700, margin: '10px 0 5px', color: '#1e293b' },
      h3: { fontSize: '13pt', fontWeight: 700, margin: '8px 0 4px', color: '#334155' },
    };

    const pStyle = {
      textAlign: block.align || 'left',
      margin: inTable ? '2px 0' : '4px 0',
      lineHeight: 1.55,
      paddingLeft: block.isList ? '20px' : undefined,
      position: block.isList ? 'relative' : undefined,
      ...(block.heading ? headingStyles[block.heading] : {}),
    };

    return (
      <div key={bIdx} style={pStyle}>
        {block.isList && (
          <span style={{ position: 'absolute', left: '6px', fontWeight: 700 }}>•</span>
        )}
        {renderDocxRuns(block.runs)}
      </div>
    );
  });
};

const DocumentPreviewModal = ({ isOpen, onClose, fileName, url }) => {
  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Dữ liệu xem trước Word (.docx) & Excel (.xlsx, .xls, .csv)
  const [docxData, setDocxData] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const previewContentRef = useRef(null);

  // Trạng thái cho ảnh (Phóng to / Thu nhỏ / Xoay)
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const fileType = getFileType(fileName, url);

  useEffect(() => {
    let currentBlobUrl = null;

    const loadPreview = async () => {
      if (!isOpen || !url) return;
      setLoading(true);
      setErrorMsg(null);
      setDocxData(null);
      setExcelData(null);
      setActiveSheetIdx(0);
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

          // Nếu là Excel hoặc Word tải từ máy tính / đám mây -> dựng xem trước trực tiếp
          const lowerName = (fileName || '').toLowerCase();
          if (fileType === 'excel' && !res.isGoogleDrive) {
            try {
              const sourceBlob = res.file || res.blob || await (await fetch(res.previewUrl)).blob();
              const buf = await sourceBlob.arrayBuffer();
              setExcelData(parseExcelPreview(buf));
            } catch (e) {
              console.warn('Không thể đọc xem trước Excel:', e);
            }
          } else if (fileType === 'word' && !res.isGoogleDrive && lowerName.endsWith('.docx')) {
            try {
              const sourceBlob = res.file || res.blob || await (await fetch(res.previewUrl)).blob();
              const buf = await sourceBlob.arrayBuffer();
              const parsed = parseDocxPreview(buf);
              if (parsed?.supported) {
                setDocxData(parsed);
              }
            } catch (e) {
              console.warn('Không thể đọc xem trước Word:', e);
            }
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
  }, [isOpen, url, fileName, fileType]);

  if (!isOpen) return null;

  const ext = fileType === 'gdrive' ? 'G-DRIVE' : (fileName?.split('.').pop()?.toUpperCase() || 'FILE');

  const handleDownload = async () => {
    const ok = await downloadFileSafely(url, fileName);
    if (ok) {
      toast.success(`Đang tải tệp "${fileName}"...`);
    }
  };

  const openRenderedHtmlWindow = (autoPrint = false) => {
    if (!previewContentRef.current) return false;
    const htmlContent = previewContentRef.current.innerHTML;
    const safeTitle = String(fileName || 'Xem tài liệu').replace(/[<>&"]/g, '');
    const win = window.open('', '_blank');
    if (!win) return false;
    win.document.write(`<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${safeTitle}</title>
        <style>
          body { font-family: "Times New Roman", "Segoe UI", Arial, sans-serif; color: #0f172a; margin: 20px; background: #fff; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #94a3b8; padding: 6px 8px; }
          @media print { @page { size: A4; margin: 15mm; } body { margin: 0; } }
        </style>
      </head>
      <body>${htmlContent}</body>
      </html>`);
    win.document.close();
    win.focus();
    if (autoPrint) {
      setTimeout(() => {
        try { win.print(); } catch {}
      }, 300);
    }
    return true;
  };

  const handleOpenNewTab = () => {
    if ((docxData || excelData) && openRenderedHtmlWindow(false)) {
      return;
    }
    if (resolved?.previewUrl) {
      window.open(resolved.previewUrl, '_blank');
    } else {
      downloadFileSafely(url, fileName);
    }
  };

  const handlePrint = () => {
    if ((docxData || excelData) && openRenderedHtmlWindow(true)) {
      return;
    }
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
                <span>· {fileType === 'gdrive' ? 'Lưu trữ Đám mây Google Drive' : 'Chế độ xem trực tiếp an toàn'}</span>
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
            background: fileType === 'img' ? '#334155' : (docxData || excelData) ? '#e2e8f0' : '#f1f5f9',
            overflow: 'auto',
            display: 'flex',
            alignItems: (!loading && !errorMsg && (docxData || excelData)) ? 'flex-start' : 'center',
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
                  💡 Mẹo: Để xem trước tài liệu (PDF/Ảnh/Word) trực tiếp trong khung này, bạn hãy vào thư mục trên Drive → bấm chuột phải vào chính tệp tài liệu đó → chọn Chia sẻ.
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
          ) : (fileType === 'word' && docxData?.supported) ? (
            /* TRÌNH XEM TRỰC TIẾP VĂN BẢN WORD (.DOCX) */
            <div style={{ width: '100%', padding: '24px 16px', display: 'flex', justifyContent: 'center' }}>
              <div
                ref={previewContentRef}
                style={{
                  width: '100%',
                  maxWidth: '820px',
                  minHeight: '72vh',
                  background: '#ffffff',
                  padding: '40px 48px',
                  borderRadius: '6px',
                  boxShadow: '0 6px 24px rgba(15, 23, 42, 0.12)',
                  fontFamily: "'Times New Roman', 'Segoe UI', Arial, sans-serif",
                  fontSize: '12.5pt',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  wordBreak: 'break-word',
                }}
              >
                {renderDocxBlocks(docxData.blocks)}
              </div>
            </div>
          ) : (fileType === 'excel' && excelData?.sheets?.length > 0) ? (
            /* TRÌNH XEM TRỰC TIẾP BẢNG TÍNH EXCEL (.XLSX / .XLS) */
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
              {excelData.sheets.length > 1 && (
                <div style={{
                  display: 'flex',
                  gap: 4,
                  padding: '8px 16px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #cbd5e1',
                  overflowX: 'auto',
                }}>
                  {excelData.sheets.map((s, idx) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setActiveSheetIdx(idx)}
                      style={{
                        padding: '5px 12px',
                        fontSize: 12.5,
                        fontWeight: activeSheetIdx === idx ? 700 : 500,
                        border: '1px solid',
                        borderColor: activeSheetIdx === idx ? '#2563eb' : '#cbd5e1',
                        background: activeSheetIdx === idx ? '#eff6ff' : '#ffffff',
                        color: activeSheetIdx === idx ? '#1d4ed8' : '#475569',
                        borderRadius: 6,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      📊 {s.name}
                    </button>
                  ))}
                </div>
              )}

              <div ref={previewContentRef} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                {(() => {
                  const activeSheet = excelData.sheets[activeSheetIdx] || excelData.sheets[0];
                  if (!activeSheet || activeSheet.rows.length === 0) {
                    return <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>Trang tính trống.</div>;
                  }
                  return (
                    <>
                      {activeSheet.truncated && (
                        <div style={{
                          marginBottom: 10,
                          padding: '6px 12px',
                          background: '#fef3c7',
                          color: '#92400e',
                          fontSize: 12,
                          borderRadius: 6,
                        }}>
                          Đang hiển thị {activeSheet.rows.length} / {activeSheet.totalRows} dòng đầu để xem nhanh. Bấm "Tải về" để xem toàn bộ.
                        </div>
                      )}
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, background: '#fff' }}>
                        <tbody>
                          {activeSheet.rows.map((row, rIdx) => (
                            <tr key={rIdx} style={{ background: rIdx === 0 ? '#f1f5f9' : rIdx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                              <td style={{
                                border: '1px solid #cbd5e1',
                                padding: '5px 8px',
                                background: '#f8fafc',
                                color: '#64748b',
                                textAlign: 'center',
                                fontWeight: 600,
                                width: 38,
                                fontSize: 11,
                              }}>
                                {rIdx + 1}
                              </td>
                              {Array.from({ length: activeSheet.maxCols }).map((_, cIdx) => (
                                <td
                                  key={cIdx}
                                  style={{
                                    border: '1px solid #cbd5e1',
                                    padding: '6px 10px',
                                    fontWeight: rIdx === 0 ? 700 : 400,
                                    color: '#0f172a',
                                    whiteSpace: 'pre-wrap',
                                    minWidth: 70,
                                  }}
                                >
                                  {row[cIdx] ?? ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : fileType === 'excel' || fileType === 'word' ? (
            /* DỰ PHÒNG CHO FILE .DOC ĐỜI CŨ HOẶC KHÔNG THỂ PHÂN TÍCH */
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
                Định dạng tệp <strong>.{ext}</strong> này chưa hỗ trợ xem trực tiếp trên trình duyệt (chỉ hỗ trợ xem trực tiếp chuẩn mới <code>.docx</code>, <code>.xlsx</code>, <code>.pdf</code>, ảnh). Bạn vui lòng tải về máy để xem đầy đủ nhé.
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
