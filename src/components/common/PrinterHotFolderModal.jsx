// src/components/common/PrinterHotFolderModal.jsx
// Hộp nạp tệp thông minh từ Thư mục Máy in / Máy scan (Hot Folder Auto-Sync)
import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { formatFileSize, validateFileType } from '../../utils/fileUtils';
import { formatTimestamp } from '../../utils/dateUtils';
import { useConfirm } from '../../context/ConfirmContext';
import toast from 'react-hot-toast';

const ALLOWED_EXTS = ['pdf', 'jpg', 'jpeg', 'png', 'tif', 'tiff'];
const STORAGE_IMPORTED_KEY = 'giao_vu_imported_scan_files';

const getStoredImported = () => {
  try {
    const raw = localStorage.getItem(STORAGE_IMPORTED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const addStoredImported = (fileName) => {
  try {
    const list = getStoredImported();
    if (!list.includes(fileName)) {
      list.push(fileName);
      localStorage.setItem(STORAGE_IMPORTED_KEY, JSON.stringify(list.slice(-200)));
    }
  } catch (e) {
    console.error(e);
  }
};

const PrinterHotFolderModal = ({
  isOpen,
  onClose,
  onSave, // (file, metadata) => Promise
  title = 'Hộp tệp Máy in / Máy scan tự động',
  folderInfo = null, // { module, year, folderId, folderName, moduleLabel }
}) => {
  const confirm = useConfirm();
  const [dirHandle, setDirHandle] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [scannedFiles, setScannedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [importedList, setImportedList] = useState(getStoredImported());
  const [processingFile, setProcessingFile] = useState(null);
  const [isApiSupported, setIsApiSupported] = useState(true);

  // Modal nạp nhanh 1 file cụ thể
  const [selectedFileForImport, setSelectedFileForImport] = useState(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customRefNo, setCustomRefNo] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [savingSingle, setSavingSingle] = useState(false);

  // Kéo thả thủ công dự phòng
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsApiSupported(typeof window !== 'undefined' && 'showDirectoryPicker' in window);
  }, []);

  // Đọc danh sách file từ thư mục máy in
  const readDirectoryFiles = async (handle = dirHandle) => {
    if (!handle) return;
    setLoadingFiles(true);
    try {
      const files = [];
      for await (const entry of handle.values()) {
        if (entry.kind === 'file') {
          const ext = entry.name.split('.').pop()?.toLowerCase();
          if (ALLOWED_EXTS.includes(ext)) {
            try {
              const file = await entry.getFile();
              files.push({
                name: file.name,
                size: file.size,
                lastModified: file.lastModified,
                handle: entry,
                fileObj: file,
              });
            } catch (err) {
              console.warn('Không thể đọc file:', entry.name, err);
            }
          }
        }
      }

      // Sắp xếp file mới nhất lên đầu
      files.sort((a, b) => b.lastModified - a.lastModified);
      setScannedFiles(files);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi đọc thư mục máy in: ' + (err.message || 'Chưa cấp quyền đọc thư mục'));
    } finally {
      setLoadingFiles(false);
    }
  };

  // Chọn thư mục đầu ra của máy in trên máy tính
  const handlePickDirectory = async () => {
    try {
      if (!window.showDirectoryPicker) {
        toast.error('Trình duyệt của bạn không hỗ trợ tính năng chọn thư mục trực tiếp. Hãy dùng tính năng kéo thả bên dưới!');
        return;
      }

      const handle = await window.showDirectoryPicker({
        id: 'printer-scan-hotfolder',
        mode: 'read',
      });

      setDirHandle(handle);
      setFolderName(handle.name);
      toast.success(`Đã kết nối với thư mục máy in: "${handle.name}"`);
      await readDirectoryFiles(handle);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        toast.error('Chưa thể mở thư mục máy in: ' + err.message);
      }
    }
  };

  // Mở hộp thoại xác nhận nạp 1 file
  const openConfirmImport = (fileItem) => {
    setSelectedFileForImport(fileItem);
    const cleanName = fileItem.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setCustomTitle(cleanName);
    setCustomRefNo('');
    setCustomNotes('');
  };

  // Thực hiện lưu 1 file vào thư mục web
  const handleExecuteImport = async () => {
    if (!selectedFileForImport) return;
    if (!customTitle.trim()) {
      toast.error('Vui lòng nhập Tên tài liệu / Trích yếu!');
      return;
    }

    setSavingSingle(true);
    try {
      const file = selectedFileForImport.fileObj || (await selectedFileForImport.handle?.getFile());
      const metadata = {
        title: customTitle.trim(),
        refNo: customRefNo.trim(),
        notes: customNotes.trim() || 'Nạp tự động từ thư mục máy in',
        folderInfo,
      };

      if (onSave) {
        await onSave(file, metadata);
      }

      // Đánh dấu đã nạp
      addStoredImported(selectedFileForImport.name);
      setImportedList(getStoredImported());
      toast.success(`Đã đưa tệp "${file.name}" vào thư mục thành công!`);
      setSelectedFileForImport(null);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lưu tệp vào thư mục: ' + (err.message || 'Vui lòng thử lại!'));
    } finally {
      setSavingSingle(false);
    }
  };

  // Nạp tự động nhanh 1 file không cần hỏi
  const handleQuickImport = async (fileItem) => {
    setProcessingFile(fileItem.name);
    try {
      const file = fileItem.fileObj || (await fileItem.handle?.getFile());
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const metadata = {
        title: cleanName,
        refNo: '',
        notes: 'Nạp tự động từ thư mục máy in',
        folderInfo,
      };

      if (onSave) {
        await onSave(file, metadata);
      }

      addStoredImported(fileItem.name);
      setImportedList(getStoredImported());
      toast.success(`Đã nạp "${file.name}" vào thư mục!`);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi nạp tệp: ' + err.message);
    } finally {
      setProcessingFile(null);
    }
  };

  // Nạp toàn bộ các file mới chưa được nạp
  const handleImportAllNew = async () => {
    const unimported = scannedFiles.filter(f => !importedList.includes(f.name));
    if (unimported.length === 0) {
      toast.info('Không có file scan mới nào cần nạp!');
      return;
    }

    const ok = await confirm({
      title: 'Xác nhận nạp toàn bộ file scan',
      message: `Bạn có chắc chắn muốn nạp toàn bộ ${unimported.length} tài liệu scan mới này vào thư mục "${folderInfo?.folderName || 'hiện tại'}" không?`,
      confirmText: 'Nạp ngay',
      cancelText: 'Huỷ bỏ',
      type: 'primary',
    });
    if (!ok) return;

    setLoadingFiles(true);
    let successCount = 0;
    for (const item of unimported) {
      try {
        const file = item.fileObj || (await item.handle?.getFile());
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const metadata = {
          title: cleanName,
          refNo: '',
          notes: 'Nạp hàng loạt từ thư mục máy in',
          folderInfo,
        };
        if (onSave) {
          await onSave(file, metadata);
        }
        addStoredImported(item.name);
        successCount++;
      } catch (err) {
        console.warn('Lỗi nạp file:', item.name, err);
      }
    }

    setImportedList(getStoredImported());
    setLoadingFiles(false);
    toast.success(`Đã nạp thành công ${successCount}/${unimported.length} tệp vào thư mục!`);
  };

  // Xử lý kéo thả thủ công
  const handleManualDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const files = Array.from(e.dataTransfer.files).filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ALLOWED_EXTS.includes(ext);
    });

    if (files.length === 0) {
      toast.error('Chỉ nhận các tệp scan PDF, JPG, PNG, TIFF!');
      return;
    }

    const items = files.map(f => ({
      name: f.name,
      size: f.size,
      lastModified: f.lastModified,
      fileObj: f,
    }));

    setScannedFiles(prev => [...items, ...prev]);
    toast.success(`Đã nhận ${items.length} tệp kéo thả từ máy tính!`);
  };

  const newFilesCount = scannedFiles.filter(f => !importedList.includes(f.name)).length;

  return (
    <Modal open={isOpen} onClose={onClose} title={title} size="modal-lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Banner thư mục đích trên web */}
        {folderInfo && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 6,
            padding: '10px 14px',
            fontSize: 13,
            color: '#166534',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>📁</span>
              <div>
                <strong>Thư mục lưu trữ đích: </strong>
                <span>
                  {folderInfo.moduleLabel || 'Phân hệ'} &gt; Năm {folderInfo.year || new Date().getFullYear()}
                  {folderInfo.folderName ? ` > ${folderInfo.folderName}` : ' (Thư mục gốc)'}
                </span>
              </div>
            </div>
            <span style={{
              background: '#16a34a',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4,
            }}>
              Đang mở thư mục này
            </span>
          </div>
        )}

        {/* Thanh kết nối thư mục máy in */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '12px 16px',
          flexWrap: 'wrap',
          gap: 10,
        }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🖨️</span>
              {folderName ? (
                <>Thư mục máy in đang theo dõi: <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>📂 {folderName}</span></>
              ) : (
                'Chưa kết nối thư mục máy in / máy scan'
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {folderName
                ? 'Máy in vừa scan xong file mới → Bấm nút "Cập nhật" là thấy file hiện ra ngay.'
                : 'Chọn thư mục mà máy in (hoặc app Windows Scan) lưu file (Documents/Scans, Desktop...).'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {dirHandle && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => readDirectoryFiles(dirHandle)}
                disabled={loadingFiles}
                title="Quét lại thư mục để tìm file mới máy in vừa scan xong"
              >
                🔄 {loadingFiles ? 'Đang đọc...' : 'Cập nhật thư mục'}
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handlePickDirectory}
              style={{ background: '#2563eb', borderColor: '#2563eb' }}
            >
              📂 {folderName ? 'Đổi thư mục máy in' : 'Chọn Thư mục Máy in Scan'}
            </button>
          </div>
        </div>

        {/* BẢNG DANH SÁCH FILE SCAN PHÁT HIỆN ĐƯỢC */}
        {scannedFiles.length > 0 ? (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                Tài liệu tìm thấy trong thư mục máy in ({scannedFiles.length} tệp · {newFilesCount} tệp mới)
              </div>

              {newFilesCount > 1 && (
                <button
                  type="button"
                  className="btn btn-primary btn-xs"
                  style={{ background: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}
                  onClick={handleImportAllNew}
                  disabled={loadingFiles}
                >
                  📥 Nạp tất cả {newFilesCount} file mới vào thư mục
                </button>
              )}
            </div>

            <div style={{
              maxHeight: 280,
              overflowY: 'auto',
              border: '1px solid var(--border)',
              borderRadius: 6,
              background: '#fff',
            }}>
              <table style={{ margin: 0, width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Tên tệp scan</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', width: 100 }}>Dung lượng</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', width: 140 }}>Thời gian scan</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', width: 110 }}>Trạng thái</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', width: 160 }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {scannedFiles.map((f, idx) => {
                    const isImported = importedList.includes(f.name);
                    const isProcessing = processingFile === f.name;

                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: isImported ? '#fafafa' : '#fff',
                          opacity: isImported ? 0.75 : 1,
                        }}
                      >
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>
                          <span style={{ marginRight: 6 }}>
                            {f.name.endsWith('.pdf') ? '📕' : '🖼️'}
                          </span>
                          {f.name}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
                          {formatFileSize(f.size)}
                        </td>
                        <td style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>
                          {new Date(f.lastModified).toLocaleString('vi-VN', {
                            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
                          })}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          {isImported ? (
                            <span style={{
                              display: 'inline-block',
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: '#dcfce7',
                              color: '#15803d',
                              fontWeight: 700,
                            }}>
                              ✓ Đã nạp
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-block',
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              fontWeight: 700,
                            }}>
                              Mới quét
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          {isImported ? (
                            <button
                              type="button"
                              className="btn btn-outline btn-xs"
                              onClick={() => openConfirmImport(f)}
                              title="Nạp lại tệp này"
                            >
                              Nạp lại
                            </button>
                          ) : (
                            <div style={{ display: 'inline-flex', gap: 6 }}>
                              <button
                                type="button"
                                className="btn btn-primary btn-xs"
                                style={{ background: '#16a34a', borderColor: '#16a34a' }}
                                onClick={() => handleQuickImport(f)}
                                disabled={isProcessing}
                              >
                                {isProcessing ? 'Đang lưu...' : '📥 Nạp ngay'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline btn-xs"
                                onClick={() => openConfirmImport(f)}
                                title="Điền thêm trích yếu hoặc số hiệu trước khi nạp"
                              >
                                Chi tiết
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* TRẠNG THÁI CHƯA CHỌN THƯ MỤC HOẶC THƯ MỤC TRỐNG */
          <div
            className={`upload-area ${dragging ? 'dragging' : ''}`}
            style={{
              padding: '30px 20px',
              background: '#f8fafc',
              border: '2px dashed var(--border)',
            }}
            onClick={folderName ? () => fileInputRef.current?.click() : handlePickDirectory}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleManualDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files).map(f => ({
                    name: f.name, size: f.size, lastModified: f.lastModified, fileObj: f
                  }));
                  setScannedFiles(prev => [...files, ...prev]);
                }
              }}
            />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🖨️ 📥</div>
              <p className="upload-text" style={{ fontSize: 14, fontWeight: 700 }}>
                {folderName
                  ? 'Thư mục hiện chưa có tệp scan mới. Bạn có thể kéo thả tệp vào đây!'
                  : 'Bấm để Chọn Thư mục Máy in Scan trên máy tính của bạn'}
              </p>
              <p className="upload-hint" style={{ fontSize: 12, maxWidth: 440, margin: '4px auto 0 auto' }}>
                {folderName
                  ? 'Khi máy in quét xong file rơi vào thư mục, bấm "Cập nhật thư mục" để hiển thị.'
                  : 'Chỉ cần chọn 1 lần duy nhất. Máy in scan xong ở đâu, trang web sẽ tự động nhận ở đó.'}
              </p>
            </div>
          </div>
        )}

        {/* Hướng dẫn thao tác nhanh */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 6,
          padding: '10px 14px',
          fontSize: 12,
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <strong>Quy trình scan cực nhanh:</strong> Đặt giấy lên máy in → Bấm nút <strong>Scan</strong> trên máy in (hoặc mở app <em>Windows Scan</em> bấm Scan) → Quay lại web bấm <strong>"Cập nhật thư mục"</strong> là file hiện ra ngay → Bấm <strong>"📥 Nạp ngay"</strong> là file lưu thẳng vào thư mục web!
          </div>
        </div>

        {/* FOOTER ĐÓNG */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Đóng hộp tệp
          </button>
        </div>
      </div>

      {/* MODAL CON: XÁC NHẬN / SỬA THÔNG TIN 1 FILE TRƯỚC KHI NẠP */}
      {selectedFileForImport && (
        <Modal
          open={Boolean(selectedFileForImport)}
          onClose={() => setSelectedFileForImport(null)}
          title={`Nạp tài liệu scan: "${selectedFileForImport.name}"`}
          size="modal-sm"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">
                Trích yếu / Tên văn bản <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                placeholder="Nhập trích yếu nội dung..."
                required
                disabled={savingSingle}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số ký hiệu / Mã tài liệu</label>
              <input
                type="text"
                className="form-control"
                value={customRefNo}
                onChange={e => setCustomRefNo(e.target.value)}
                placeholder="123/QĐ-ĐH..."
                disabled={savingSingle}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ghi chú</label>
              <textarea
                className="form-control"
                rows={2}
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                placeholder="Ghi chú về văn bản..."
                disabled={savingSingle}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedFileForImport(null)}
                disabled={savingSingle}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#16a34a', borderColor: '#16a34a' }}
                onClick={handleExecuteImport}
                disabled={savingSingle}
              >
                {savingSingle ? 'Đang lưu...' : 'Lưu vào thư mục'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default PrinterHotFolderModal;
