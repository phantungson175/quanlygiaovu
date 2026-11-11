// src/components/common/UserAvatar.jsx
// Component hiển thị ảnh đại diện đồng bộ (ảnh Google / chữ cái viết tắt chuẩn xác)
import { useState, useEffect } from 'react';

export const getAvatarInitials = (name, email) => {
  const words = String(name || '')
    .trim()
    .split(/\s+/)
    .filter((w) => /^[\p{L}\p{N}]/u.test(w));

  if (words.length > 0) {
    return words
      .slice(-2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  return String(email?.[0] || '?').toUpperCase();
};

const UserAvatar = ({ photoURL, name, email, isAdmin = false, size = 32, fontSize }) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [photoURL]);

  if (photoURL && !imgFailed) {
    return (
      <img
        src={photoURL}
        alt={name || 'Avatar'}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      className="user-avatar"
      style={{
        width: size,
        height: size,
        fontSize: fontSize || Math.round(size * 0.36),
        background: isAdmin ? 'var(--danger)' : 'var(--primary)',
        flexShrink: 0,
      }}
    >
      {getAvatarInitials(name, email)}
    </div>
  );
};

export default UserAvatar;
