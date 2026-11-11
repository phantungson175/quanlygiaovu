// src/components/common/GmailSyncModal.jsx
// Modal thiết lập tự động đồng bộ Văn bản Đến từ Gmail theo phân quyền của Admin
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAccountAuthInfo } from '../../services/authService';
import { buildGmailSyncScript } from '../../utils/gmailSyncScript';
import Modal from './Modal';
import PasswordSetupBox from './PasswordSetupBox';
import toast from 'react-hot-toast';

const GmailSyncModal = ({ isOpen, onClose }) => {
  const { user, canSyncGmail, refreshUser } = useAuth();
  const [authInfo, setAuthInfo] = useState(() => getAccountAuthInfo());
  const [scriptPassword, setScriptPassword] = useState('');
  const [showScriptPassword, setShowScriptPassword] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    const syncState = async () => {
      try {
        await refreshUser?.();
      } catch {}
      if (active) {
        setAuthInfo(getAccountAuthInfo());
      }
    };
    syncState();
    return () => { active = false; };
  }, [isOpen, refreshUser]);

  const handleClose = () => {
    setCopied(false);
    setShowChangePwd(false);
    onClose();
  };

  const generatedScript = useMemo(() => {
    return buildGmailSyncScript({
      email: user?.email || '',
      password: scriptPassword,
    });
  }, [user?.email, scriptPassword]);

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(generatedScript);
      setCopied(true);
      if (!scriptPassword) {
        toast.success('Đã sao chép mã Script! Nhớ điền thêm mật khẩu tại dòng FIREBASE_PASSWORD khi dán vào Apps Script.');
      } else {
        toast.success('Đã sao chép toàn bộ mã Script đã điền sẵn Email & Mật khẩu!');
      }
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error('Trình duyệt không cho sao chép tự động. Vui lòng bôi đen khung mã bên dưới và nhấn Ctrl + C.');
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Thiết lập đồng bộ văn bản từ Gmail"
      size="modal-lg"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!canSyncGmail ? (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            padding: '18px 20px',
            color: '#991b1b',
            lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
              Tài khoản chưa được cấp quyền đồng bộ Gmail
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 13.5 }}>
              Tài khoản <strong>{user?.email}</strong> hiện chưa được Quản trị viên bật quyền đồng bộ văn bản từ Gmail lên hệ thống.
            </p>
            <p style={{ margin: 0, fontSize: 13, color: '#7f1d1d' }}>
              Vui lòng liên hệ Quản trị viên (Admin) vào mục <strong>Quản lý Người dùng</strong> để bật nút <strong>Cấp Gmail</strong> cho tài khoản của bạn, sau đó mở lại cửa sổ này.
            </p>
          </div>
        ) : (
          <>
            {/* Trạng thái được cấp quyền */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
              fontSize: 13,
              color: '#166534',
            }}>
              <span>
                Tài khoản <strong>{user?.email}</strong> đã được cấp quyền đồng bộ Gmail lên mục <strong>Văn bản Đến</strong> và <strong>Văn bản Đi</strong>.
              </span>
              <span className="badge badge-success">Đã cấp quyền</span>
            </div>

            {/* Bước 1: Tạo mật khẩu hoặc nhập mật khẩu tạm để nhúng vào Script */}
            {!authInfo.hasPassword ? (
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--primary)', marginBottom: 8 }}>
                  Bước 1: Tạo mật khẩu cho tài khoản trước khi lấy mã Script
                </div>
                <PasswordSetupBox
                  hasPassword={authInfo.hasPassword}
                  hasGoogle={authInfo.hasGoogle}
                  onSuccess={(savedPwd) => {
                    setScriptPassword(savedPwd);
                    setAuthInfo(getAccountAuthInfo());
                  }}
                />
              </div>
            ) : (
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--primary)' }}>
                    Bước 1: Điền mật khẩu web của bạn vào mã Script (tùy chọn)
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-xs"
                    onClick={() => setShowChangePwd(p => !p)}
                  >
                    {showChangePwd ? 'Ẩn đổi mật khẩu' : 'Đổi / Quên mật khẩu?'}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type={showScriptPassword ? 'text' : 'password'}
                    className="form-control"
                    style={{ flex: 1, minWidth: 220 }}
                    value={scriptPassword}
                    onChange={e => setScriptPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đăng nhập web của bạn để tự điền vào code bên dưới..."
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowScriptPassword(s => !s)}
                  >
                    {showScriptPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>
                  Mật khẩu chỉ dùng tạm trên trình duyệt để điền sẵn vào dòng FIREBASE_PASSWORD giúp bạn copy nhanh, không lưu lại trên máy chủ.
                </div>

                {showChangePwd && (
                  <div style={{ marginTop: 12 }}>
                    <PasswordSetupBox
                      hasPassword={authInfo.hasPassword}
                      hasGoogle={authInfo.hasGoogle}
                      onSuccess={(savedPwd) => {
                        setScriptPassword(savedPwd);
                        setShowChangePwd(false);
                        setAuthInfo(getAccountAuthInfo());
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Bước 2: Mã Apps Script đã điền sẵn */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--primary)' }}>
                  Bước 2: Sao chép mã Google Apps Script dành riêng cho bạn
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href="https://script.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    Mở script.google.com
                  </a>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleCopyScript}
                  >
                    {copied ? 'Đã sao chép' : 'Sao chép toàn bộ mã'}
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={generatedScript}
                rows={9}
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: 11.5,
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: '#0f172a',
                  color: '#e2e8f0',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Bước 3: Hướng dẫn thao tác */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 8,
              padding: '12px 14px',
              fontSize: 12.5,
              color: '#78350f',
              lineHeight: 1.6,
            }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Bước 3: Cài đặt 1 lần trên Gmail của bạn (2 phút)</div>
              <ol style={{ margin: 0, paddingLeft: 18 }}>
                <li>Mở <strong>script.google.com</strong> (đăng nhập bằng Gmail nhận công văn của bạn) → bấm <strong>+ Dự án mới</strong>.</li>
                <li>Xóa code mẫu sẵn có, dán đoạn mã vừa sao chép vào và bấm <strong>Lưu (Ctrl + S)</strong>.</li>
                <li>Ở thanh công cụ phía trên, chọn hàm <strong>caiDatTuDong</strong> → bấm <strong>Chạy (Run)</strong> và bấm cho phép quyền Gmail/Drive 1 lần.</li>
                <li>Từ đó về sau, gắn nhãn <strong>VanBanDen</strong> để đưa vào <strong>Văn bản Đến</strong> hoặc gắn nhãn <strong>VanBanDi</strong> (trong mục Đã gửi) để đưa vào <strong>Văn bản Đi</strong> — hệ thống tự đồng bộ sau mỗi 5 phút.</li>
              </ol>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-outline" onClick={handleClose}>
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GmailSyncModal;
