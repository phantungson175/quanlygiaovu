// src/components/common/Modal.jsx
// Modal an toàn: Không đóng khi click nhầm ra ngoài để chống mất dữ liệu đang nhập dở
import { useEffect, useRef } from 'react';

const Modal = ({
  open,
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'modal-md',
  closeOnBackdrop = false, // Mặc định không đóng khi click ngoài để bảo vệ dữ liệu người dùng
}) => {
  const modalBoxRef = useRef(null);

  const isVisible = open !== undefined ? open : isOpen;
  if (!isVisible) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (closeOnBackdrop) {
        onClose();
      } else {
        // Hiệu ứng phản hồi nhẹ (rung/nổi) để báo cho người dùng biết modal đang giữ an toàn dữ liệu
        if (modalBoxRef.current) {
          modalBoxRef.current.classList.remove('modal-bounce');
          void modalBoxRef.current.offsetWidth; // Force reflow
          modalBoxRef.current.classList.add('modal-bounce');
        }
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div ref={modalBoxRef} className={`modal ${size}`}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose} title="Đóng cửa sổ">✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
