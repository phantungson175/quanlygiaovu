// src/components/layout/NotificationDropdown.jsx
// Trung tâm thông báo & cảnh báo hạn thông minh toàn hệ thống
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

const NotificationDropdown = ({
  isOpen,
  onClose,
  notifications = [],
  onNavigate,
  onRefresh,
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'warning' | 'docs' | 'unread'
  const [readIds, setReadIds] = useState(new Set());

  // Đếm số lượng theo nhóm
  const counts = useMemo(() => {
    let unread = 0;
    let warnings = 0;
    let docs = 0;

    notifications.forEach((n) => {
      const isRead = readIds.has(n.id) || !n.unread;
      if (!isRead) unread++;
      if (n.category === 'Tài sản' || n.category === 'Chuyên gia' || n.type === 'warning' || n.type === 'danger') {
        warnings++;
      }
      if (n.category === 'Văn bản đến' || n.category === 'Văn bản đi' || n.page === 'documents') {
        docs++;
      }
    });

    return { total: notifications.length, unread, warnings, docs };
  }, [notifications, readIds]);

  // Lọc danh sách theo tab
  const filteredList = useMemo(() => {
    return notifications.filter((n) => {
      const isRead = readIds.has(n.id) || !n.unread;
      if (filter === 'unread') return !isRead;
      if (filter === 'warning') {
        return n.category === 'Tài sản' || n.category === 'Chuyên gia' || n.type === 'warning' || n.type === 'danger';
      }
      if (filter === 'docs') {
        return n.category === 'Văn bản đến' || n.category === 'Văn bản đi' || n.page === 'documents';
      }
      return true; // 'all'
    });
  }, [notifications, filter, readIds]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadIds(allIds);
    toast.success('Đã đánh dấu tất cả thông báo là đã đọc!');
  };

  const handleClickItem = (item) => {
    // Đánh dấu đã đọc
    setReadIds(prev => new Set([...prev, item.id]));

    if (item.page && onNavigate) {
      onNavigate(item.page);
      toast.success(`Đang chuyển tới phân hệ: ${item.category || item.title}`);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop vô hình để đóng khi click ra ngoài */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 499,
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          width: '420px',
          maxWidth: '92vw',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 500,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.15s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '12px 16px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>
              Thông báo & Cảnh báo hạn
            </span>
            {counts.unread > 0 && (
              <span
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 10,
                }}
              >
                {counts.unread} mới
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {onRefresh && (
              <button
                type="button"
                className="btn btn-outline btn-xs"
                onClick={onRefresh}
                title="Làm mới dữ liệu từ hệ thống"
                style={{ fontSize: 11, padding: '2px 8px' }}
              >
                Làm mới
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 16,
                color: '#64748b',
                cursor: 'pointer',
                padding: '2px 4px',
                lineHeight: 1,
              }}
              title="Đóng"
            >
              ✕
            </button>
          </div>
        </div>

        {/* TABS LỌC */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            background: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
            fontSize: 12,
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              type="button"
              style={{
                border: 'none',
                background: filter === 'all' ? '#e0e7ff' : 'transparent',
                color: filter === 'all' ? '#3730a3' : '#64748b',
                fontWeight: filter === 'all' ? 700 : 500,
                padding: '4px 8px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
              onClick={() => setFilter('all')}
            >
              Tất cả ({counts.total})
            </button>

            <button
              type="button"
              style={{
                border: 'none',
                background: filter === 'warning' ? '#fef3c7' : 'transparent',
                color: filter === 'warning' ? '#92400e' : '#64748b',
                fontWeight: filter === 'warning' ? 700 : 500,
                padding: '4px 8px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
              onClick={() => setFilter('warning')}
            >
              Cảnh báo ({counts.warnings})
            </button>

            <button
              type="button"
              style={{
                border: 'none',
                background: filter === 'docs' ? '#dbeafe' : 'transparent',
                color: filter === 'docs' ? '#1e40af' : '#64748b',
                fontWeight: filter === 'docs' ? 700 : 500,
                padding: '4px 8px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
              onClick={() => setFilter('docs')}
            >
              Văn bản ({counts.docs})
            </button>
          </div>

          {counts.unread > 0 && (
            <button
              type="button"
              style={{
                border: 'none',
                background: 'none',
                color: '#2563eb',
                fontSize: 11,
                cursor: 'pointer',
                fontWeight: 600,
                padding: 0,
              }}
              onClick={handleMarkAllRead}
            >
              Đã đọc hết
            </button>
          )}
        </div>

        {/* DANH SÁCH THÔNG BÁO */}
        <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
          {filteredList.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b' }}>
                Không có việc cần xử lý
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                Hiện tại tất cả tài sản, hợp đồng chuyên gia và văn bản đều trong trạng thái tốt.
              </div>
            </div>
          ) : (
            filteredList.map((item) => {
              const isRead = readIds.has(item.id) || !item.unread;

              return (
                <div
                  key={item.id}
                  onClick={() => handleClickItem(item)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    cursor: 'pointer',
                    background: isRead ? '#ffffff' : '#f8faff',
                    borderLeft: isRead ? '3px solid transparent' : '3px solid #2563eb',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = isRead ? '#ffffff' : '#f8faff')
                  }
                >
                  {/* NỘI DUNG CHÍNH */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: item.categoryBg || '#e2e8f0',
                            color: item.categoryColor || '#475569',
                          }}
                        >
                          {item.category || 'Hệ thống'}
                        </span>
                        {item.badgeText && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '1px 5px',
                              borderRadius: 4,
                              background: item.type === 'danger' ? '#fee2e2' : item.type === 'warning' ? '#fef3c7' : '#eff6ff',
                              color: item.type === 'danger' ? '#b91c1c' : item.type === 'warning' ? '#92400e' : '#1d4ed8',
                            }}
                          >
                            {item.badgeText}
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {item.time || ''}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: isRead ? 600 : 700,
                        color: '#0f172a',
                        lineHeight: 1.35,
                      }}
                    >
                      {item.title}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: '#64748b',
                        marginTop: 3,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.desc}
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: '#2563eb',
                        marginTop: 6,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>Xem chi tiết →</span>
                    </div>
                  </div>

                  {/* CHẤM CHƯA ĐỌC */}
                  {!isRead && (
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#2563eb',
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                      title="Chưa đọc"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
