// src/pages/VerifyEmailPage.jsx
// Màn hình bắt buộc xác thực email dành cho Cán bộ Giáo vụ
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resendVerificationEmail, logout } from '../services/authService';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const { user, refreshUser } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCheckVerified = async () => {
    setChecking(true);
    try {
      const updatedUser = await refreshUser();
      if (updatedUser && updatedUser.emailVerified) {
        toast.success('Xác thực email thành công! Đang chuyển vào hệ thống...');
      } else {
        toast.error('Email chưa được xác thực! Vui lòng bấm vào liên kết trong hộp thư của bạn rồi thử lại.');
      }
    } catch (err) {
      toast.error('Lỗi kiểm tra trạng thái xác thực: ' + err.message);
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await resendVerificationEmail();
      toast.success('Đã gửi lại email xác thực! Vui lòng kiểm tra hộp thư.');
      setCountdown(60);
    } catch (err) {
      if (err.code === 'auth/too-many-requests') {
        toast.error('Bạn đã yêu cầu gửi quá nhiều lần. Vui lòng đợi ít phút.');
      } else {
        toast.error('Không thể gửi lại email: ' + err.message);
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 480 }}>
        {/* Verification Icon */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              border: '2px solid #bfdbfe',
            }}
          >
            ✉️
          </div>
        </div>

        <div className="login-title" style={{ textAlign: 'center' }}>
          Xác thực tài khoản Giáo vụ
        </div>
        <div className="login-subtitle" style={{ textAlign: 'center', marginBottom: 16 }}>
          Để đảm bảo tính chính danh và bảo mật dữ liệu của nhà trường, bạn cần xác thực địa chỉ email trước khi sử dụng.
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-light)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '12px 14px',
            marginBottom: 20,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
            Đã gửi liên kết xác nhận tới:
          </div>
          <div style={{ color: 'var(--primary)', fontWeight: 600, wordBreak: 'break-all' }}>
            {user?.email}
          </div>
          <div style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 12.5 }}>
            👉 <strong>Hướng dẫn:</strong> Mở hòm thư điện tử của bạn (kiểm tra cả mục <em>Hộp thư đến</em> và <em>Spam / Thư rác</em>), nhấp vào liên kết xác nhận, sau đó bấm nút bên dưới.
          </div>
        </div>

        {/* Nút bấm hành động */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={handleCheckVerified}
            disabled={checking}
            style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
          >
            {checking ? (
              <><span className="spinner" style={{ width: 16, height: 16 }} /> Đang kiểm tra...</>
            ) : (
              'Tôi đã xác thực (Tải lại hệ thống)'
            )}
          </button>

          <button
            className="btn btn-outline"
            onClick={handleResend}
            disabled={resending || countdown > 0}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {countdown > 0
              ? `Gửi lại email sau (${countdown}s)`
              : resending
              ? 'Đang gửi...'
              : 'Gửi lại email xác thực'}
          </button>

          <button
            className="btn btn-outline"
            onClick={logout}
            style={{ width: '100%', justifyContent: 'center', color: '#b32020', borderColor: '#fca5a5' }}
          >
            Đăng xuất / Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
