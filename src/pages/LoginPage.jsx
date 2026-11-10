// src/pages/LoginPage.jsx
import { useState } from 'react';
import { loginWithEmail, loginWithGoogle, registerWithEmail, resetPassword } from '../services/authService';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [sendingReset, setSendingReset] = useState(false);

  const [form, setForm] = useState({
    displayName: '',
    staffId: '',
    phone: '',
    department: 'Phòng Quản lý Đào tạo',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!form.displayName.trim()) {
        setError('Vui lòng nhập Họ và tên!');
        return;
      }
      if (form.password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Mật khẩu xác nhận không trùng khớp!');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(form.email, form.password);
        toast.success('Đăng nhập thành công!');
      } else {
        await registerWithEmail(form.email, form.password, form.displayName.trim(), {
          staffId: form.staffId.trim(),
          phone: form.phone.trim(),
          department: form.department.trim(),
        });
        toast.success('Đăng ký thành công! Đang chuyển đến bước xác thực email...');
      }
    } catch (err) {
      console.error('Login/Register error:', err);
      const msgs = {
        'auth/user-not-found': 'Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc Tạo tài khoản mới.',
        'auth/wrong-password': 'Mật khẩu không đúng. Bạn có thể bấm "Quên mật khẩu?" để khôi phục.',
        'auth/email-already-in-use': 'Email này đã được đăng ký tài khoản. Bạn vui lòng chuyển sang "Đăng nhập".',
        'auth/weak-password': 'Mật khẩu phải có ít nhất 6 ký tự.',
        'auth/invalid-email': 'Định dạng email không hợp lệ.',
        'auth/invalid-credential': 'Email hoặc mật khẩu không chính xác. Nếu bạn đã từng đăng ký bằng Google, hãy bấm nút "Đăng nhập bằng tài khoản Google" ở phía trên.',
        'auth/network-request-failed': 'Lỗi kết nối máy chủ. Vui lòng kiểm tra lại đường truyền internet.',
        'auth/too-many-requests': 'Đã thử đăng nhập thất bại quá nhiều lần. Vui lòng thử lại sau ít phút hoặc bấm "Quên mật khẩu?".',
      };
      setError(msgs[err.code] || `Lỗi (${err.code || 'unknown'}): ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Đăng nhập bằng Google thành công!');
    } catch (err) {
      console.error('Google Sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // người dùng tự đóng popup
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        setError('Tính năng đăng nhập bằng tài khoản Google hiện đang bảo trì.');
      } else {
        setError(`Đăng nhập Google thất bại (${err.code}): ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error('Vui lòng nhập địa chỉ email của bạn!');
      return;
    }
    setSendingReset(true);
    try {
      await resetPassword(forgotEmail.trim());
      toast.success(`Đã gửi liên kết đặt lại mật khẩu đến ${forgotEmail}! Vui lòng kiểm tra hộp thư (cả thư mục Spam).`, { duration: 6000 });
      setForgotModalOpen(false);
    } catch (err) {
      console.error('Reset password error:', err);
      if (err.code === 'auth/user-not-found') {
        toast.error('Email này chưa được đăng ký trong hệ thống.');
      } else if (err.code === 'auth/invalid-email') {
        toast.error('Định dạng email không hợp lệ.');
      } else {
        toast.error('Lỗi gửi email đặt lại mật khẩu: ' + err.message);
      }
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 440 }}>
        <div className="login-title">
          {mode === 'login' ? 'Đăng nhập hệ thống' : 'Đăng ký tài khoản'}
        </div>
        <div className="login-subtitle">
          {mode === 'login'
            ? 'Nhập thông tin xác thực để truy cập hệ thống Quản lý Giáo vụ'
            : 'Đăng ký tài khoản để sử dụng hệ thống Quản lý Giáo vụ'}
        </div>

        {/* Nút đăng nhập Google */}
        <button className="btn btn-google" onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 6 }}>
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          {mode === 'login' ? 'Đăng nhập bằng tài khoản Google' : 'Đăng ký bằng tài khoản Google'}
        </button>

        <div className="login-divider">hoặc tiếp tục với email</div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Họ và tên *</label>
                <input
                  className="form-control"
                  type="text"
                  value={form.displayName}
                  onChange={e => set('displayName', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại liên hệ</label>
                <input
                  className="form-control"
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              className="form-control"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              required
            />
            {mode === 'register' && (
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3, display: 'block' }}>
                Email dùng để nhận liên kết xác thực kích hoạt tài khoản.
              </span>
            )}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Mật khẩu *</label>
              {mode === 'login' && (
                <a
                  type="button"
                  onClick={() => { setForgotEmail(form.email || ''); setForgotModalOpen(true); }}
                  style={{ fontSize: 12, color: 'var(--primary)', cursor: 'pointer', textDecoration: 'none' }}
                >
                  Quên mật khẩu?
                </a>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                className="form-control"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                required
                minLength={6}
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 16,
                  padding: 2,
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu *</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-control"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  required
                  minLength={6}
                  style={{ paddingRight: 40 }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '11px' }}
          >
            {loading ? (
              <><span className="spinner" style={{ width: 16, height: 16 }} /> Đang xử lý...</>
            ) : mode === 'login' ? (
              'Đăng nhập'
            ) : (
              'Đăng ký & Gửi email xác thực'
            )}
          </button>
        </form>

        <div className="login-footer">
          {mode === 'login' ? (
            <>Chưa có tài khoản? <a onClick={() => { setMode('register'); setError(''); }}>Tạo tài khoản mới</a></>
          ) : (
            <>Đã có tài khoản? <a onClick={() => { setMode('login'); setError(''); }}>Quay lại Đăng nhập</a></>
          )}
        </div>
      </div>

      {/* MODAL QUÊN MẬT KHẨU */}
      {forgotModalOpen && (
        <div className="modal-backdrop" onClick={() => setForgotModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔑 Khôi phục mật khẩu</h3>
              <button className="modal-close" onClick={() => setForgotModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSendResetPassword}>
              <div className="modal-body" style={{ padding: '18px 24px' }}>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                  Nhập địa chỉ email tài khoản của bạn. Hệ thống sẽ gửi một liên kết an toàn để bạn tự tạo mật khẩu mới.
                </p>
                <div className="form-group">
                  <label className="form-label">Email tài khoản *</label>
                  <input
                    className="form-control"
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '12px 24px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setForgotModalOpen(false)}
                  disabled={sendingReset}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sendingReset}
                >
                  {sendingReset ? 'Đang gửi email...' : 'Gửi liên kết đặt lại mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
