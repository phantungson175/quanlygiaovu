// src/utils/gmailSyncScript.js
import rawGmailSyncScript from '../../scripts/gmail_sync_apps_script.gs?raw';

const escapeSingleQuoted = (val) =>
  String(val || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '');

/**
 * Sinh đoạn mã Google Apps Script hoàn chỉnh từ scripts/gmail_sync_apps_script.gs,
 * điền sẵn thông tin tài khoản web và cấu hình Firebase của hệ thống.
 */
export const buildGmailSyncScript = ({
  email = '',
  password = '',
  projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'qlgiaovu',
  apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '',
} = {}) => {
  const safeEmail = escapeSingleQuoted(email.trim() || 'DIEN_EMAIL_TAI_KHOAN_WEB_CUA_BAN@gmail.com');
  const safePassword = escapeSingleQuoted(password || 'DIEN_MAT_KHAU_TAI_KHOAN_WEB');
  const safeProjectId = escapeSingleQuoted(projectId);
  const safeApiKey = escapeSingleQuoted(apiKey);

  return rawGmailSyncScript
    .replace(/FIREBASE_EMAIL:\s*'[^']*'/, () => `FIREBASE_EMAIL: '${safeEmail}'`)
    .replace(/FIREBASE_PASSWORD:\s*'[^']*'/, () => `FIREBASE_PASSWORD: '${safePassword}'`)
    .replace(/FIREBASE_PROJECT_ID:\s*'[^']*'/, () => `FIREBASE_PROJECT_ID: '${safeProjectId}'`)
    .replace(/FIREBASE_API_KEY:\s*'[^']*'/, () => `FIREBASE_API_KEY: '${safeApiKey}'`);
};

