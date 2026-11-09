// src/context/ConfirmContext.jsx
// Hộp thoại xác nhận mượt mà thay thế hoàn toàn cho window.confirm() mặc định thô kệch của trình duyệt
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: 'Xác nhận thao tác',
    message: '',
    confirmText: 'Xác nhận',
    cancelText: 'Huỷ',
    type: 'danger', // 'danger' | 'warning' | 'info' | 'primary'
  });

  const resolverRef = useRef(null);
  const confirmBtnRef = useRef(null);

  const confirm = useCallback((options) => {
    const config = typeof options === 'string'
      ? {
          title: 'Xác nhận thao tác',
          message: options,
          confirmText: 'Đồng ý',
          cancelText: 'Huỷ bỏ',
          type: 'danger',
        }
      : {
          title: options.title || 'Xác nhận thao tác',
          message: options.message || '',
          confirmText: options.confirmText || 'Xác nhận',
          cancelText: options.cancelText || 'Huỷ',
          type: options.type || 'danger',
        };

    setDialogState({
      isOpen: true,
      ...config,
    });

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback((result) => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!dialogState.isOpen) return;

    // Tự động focus nút xác nhận để người dùng có thể bấm Enter ngay lập tức
    const timer = setTimeout(() => {
      if (confirmBtnRef.current) {
        confirmBtnRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dialogState.isOpen, handleClose]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialogState.isOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose(false);
          }}
          style={{
            zIndex: 999999,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="modal modal-sm"
            role="alertdialog"
            aria-modal="true"
            style={{
              padding: '24px',
              borderRadius: 12,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Top: Icon + Tiêu đề + Nội dung */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background:
                    dialogState.type === 'danger'
                      ? '#fee2e2'
                      : dialogState.type === 'warning'
                      ? '#fef3c7'
                      : '#e0f2fe',
                  color:
                    dialogState.type === 'danger'
                      ? '#dc2626'
                      : dialogState.type === 'warning'
                      ? '#d97706'
                      : '#0284c7',
                }}
              >
                {dialogState.type === 'danger' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ) : dialogState.type === 'warning' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.3,
                  }}
                >
                  {dialogState.title}
                </h3>
                <div
                  style={{
                    margin: '8px 0 0 0',
                    fontSize: 13.5,
                    color: '#475569',
                    lineHeight: 1.55,
                    wordBreak: 'break-word',
                  }}
                >
                  {dialogState.message}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 10,
                marginTop: 22,
                paddingTop: 16,
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleClose(false)}
                style={{
                  minWidth: 84,
                  fontSize: 13,
                  padding: '7px 14px',
                  borderRadius: 6,
                  color: '#475569',
                  borderColor: '#cbd5e1',
                  background: '#ffffff',
                }}
              >
                {dialogState.cancelText}
              </button>
              <button
                ref={confirmBtnRef}
                type="button"
                className={`btn ${dialogState.type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => handleClose(true)}
                style={{
                  minWidth: 92,
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '7px 16px',
                  borderRadius: 6,
                  backgroundColor: dialogState.type === 'danger' ? '#dc2626' : 'var(--primary, #003366)',
                  borderColor: dialogState.type === 'danger' ? '#dc2626' : 'var(--primary, #003366)',
                  color: '#ffffff',
                }}
              >
                {dialogState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
