// Đồng bộ văn bản đến từ Gmail lên Hệ thống Quản lý Giáo vụ
const CONFIG = {
  FIREBASE_EMAIL: 'DIEN_EMAIL_TAI_KHOAN_WEB_CUA_BAN@gmail.com',
  FIREBASE_PASSWORD: 'DIEN_MAT_KHAU_TAI_KHOAN_WEB',
  FIREBASE_PROJECT_ID: 'qlgiaovu',
  FIREBASE_API_KEY: 'AIzaSyCdk0k-bVwRRIgT5G1_wV8EfOufY5v4qYU',
  LABEL_INBOX: 'VanBanDen',
  LABEL_DONE: 'DaDongBo',
  DRIVE_FOLDER_NAME: 'QuanLyGiaoVu_VanBanDen',
};

// Chạy hàm này 1 lần để tạo nhãn, thư mục Drive và bật lịch quét 5 phút
function caiDatTuDong() {
  if (!CONFIG.FIREBASE_EMAIL || CONFIG.FIREBASE_EMAIL.includes('DIEN_EMAIL')) {
    throw new Error('Vui lòng điền FIREBASE_EMAIL và FIREBASE_PASSWORD ở phần CONFIG trước khi chạy.');
  }

  getOrCreateLabel_(CONFIG.LABEL_INBOX);
  getOrCreateLabel_(CONFIG.LABEL_DONE);
  getOrCreateDriveFolder_(CONFIG.DRIVE_FOLDER_NAME);

  const authInfo = signInFirebase_();
  Logger.log('Đăng nhập Firebase thành công.');

  const triggers = ScriptApp.getProjectTriggers();
  const exists = triggers.some(t => t.getHandlerFunction() === 'syncGmailToGiaoVu');
  if (!exists) {
    ScriptApp.newTrigger('syncGmailToGiaoVu')
      .timeBased()
      .everyMinutes(5)
      .create();
    Logger.log('Đã bật lịch chạy tự động mỗi 5 phút.');
  } else {
    Logger.log('Lịch chạy tự động mỗi 5 phút đã được bật từ trước.');
  }

  assertGmailSyncAllowed_(authInfo.idToken, authInfo.uid);
  Logger.log('Tài khoản đã được cấp quyền đồng bộ Gmail.');

  runSyncWithToken_(authInfo);
}

// Bỏ qua tham số sự kiện Trigger khi chạy lịch tự động
function syncGmailToGiaoVu() {
  return runSyncWithToken_(null);
}

function runSyncWithToken_(preloadedAuth) {
  const labelInbox = getOrCreateLabel_(CONFIG.LABEL_INBOX);
  const labelDone = getOrCreateLabel_(CONFIG.LABEL_DONE);

  const threads = GmailApp.search('label:' + CONFIG.LABEL_INBOX, 0, 20);
  if (!threads || threads.length === 0) {
    Logger.log('Không có email mới trong nhãn "' + CONFIG.LABEL_INBOX + '".');
    return;
  }

  const authInfo = (preloadedAuth && typeof preloadedAuth.idToken === 'string' && preloadedAuth.idToken.length > 20)
    ? preloadedAuth
    : signInFirebase_();
  const idToken = authInfo.idToken;
  assertGmailSyncAllowed_(idToken, authInfo.uid);

  const driveFolder = getOrCreateDriveFolder_(CONFIG.DRIVE_FOLDER_NAME);
  const props = PropertiesService.getScriptProperties();
  const syncedIds = JSON.parse(props.getProperty('SYNCED_MSG_IDS') || '[]');
  const syncedSet = new Set(syncedIds);
  const myEmail = (Session.getActiveUser().getEmail() || '').trim().toLowerCase();

  let countSynced = 0;

  for (let tIdx = 0; tIdx < threads.length; tIdx++) {
    const thread = threads[tIdx];
    const messages = thread.getMessages();
    const hasExternalSender = myEmail
      ? messages.some(function (m) {
          const from = (m.getFrom() || '').toLowerCase();
          return from && !from.includes(myEmail);
        })
      : false;
    let threadProcessed = 0;

    for (let mIdx = 0; mIdx < messages.length; mIdx++) {
      const msg = messages[mIdx];
      if (typeof msg.isDraft === 'function' && msg.isDraft()) continue;

      const msgId = msg.getId();
      if (syncedSet.has(msgId)) {
        threadProcessed++;
        continue;
      }

      if (hasExternalSender && myEmail && (msg.getFrom() || '').toLowerCase().includes(myEmail)) {
        syncedSet.add(msgId);
        threadProcessed++;
        continue;
      }

      const subject = (msg.getSubject() || 'Văn bản từ Gmail').trim();
      const sender = formatSender_(msg.getFrom() || 'Không rõ người gửi');
      const msgDate = msg.getDate() || new Date();
      const dateStr = Utilities.formatDate(msgDate, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
      const yearStr = Utilities.formatDate(msgDate, 'Asia/Ho_Chi_Minh', 'yyyy');
      const timeStr = Utilities.formatDate(msgDate, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm');
      const refNo = extractRefNo_(subject, msgDate);

      let attachments = [];
      try {
        attachments = msg.getAttachments({ includeInlineImages: false, includeAttachments: true });
      } catch (e) {
        attachments = msg.getAttachments();
      }

      let primaryFileUrl = null;
      let primaryFileName = null;
      const extraLinks = [];

      for (let aIdx = 0; aIdx < attachments.length; aIdx++) {
        const att = attachments[aIdx];
        if (!att || att.getSize() === 0) continue;
        const fileName = att.getName() || ('tep_dinh_kem_' + (aIdx + 1));
        const driveFile = driveFolder.createFile(att.copyBlob());
        driveFile.setName(fileName);
        try {
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (shareErr) {
          Logger.log('Không thể bật chia sẻ công khai cho tệp ' + fileName + ': ' + shareErr.message);
        }
        const viewUrl = 'https://drive.google.com/file/d/' + driveFile.getId() + '/view?usp=sharing';

        if (!primaryFileUrl) {
          primaryFileUrl = viewUrl;
          primaryFileName = fileName;
        } else {
          extraLinks.push('- ' + fileName + ': ' + viewUrl);
        }
      }

      const plainBody = (msg.getPlainBody() || '').replace(/\r?\n+/g, '\n').trim();
      const bodyPreview = plainBody.length > 500 ? plainBody.slice(0, 500) + '...' : plainBody;

      let notes = 'Đồng bộ tự động từ Gmail (' + timeStr + ').';
      if (extraLinks.length > 0) {
        notes += '\nTệp đính kèm thêm:\n' + extraLinks.join('\n');
      }
      if (bodyPreview) {
        notes += '\n\nNội dung email:\n' + bodyPreview;
      }

      const now = new Date();
      writeFirestoreDoc_('docs_incoming', {
        refNo: refNo,
        date: dateStr,
        year: yearStr,
        sender: sender,
        summary: subject,
        assignee: '',
        deadline: '',
        notes: notes,
        fileUrl: primaryFileUrl,
        fileName: primaryFileName,
        status: 'Chưa xử lý',
        folderId: null,
        folderName: '',
        source: 'gmail',
        createdAt: now,
        updatedAt: now,
      }, idToken);

      try {
        writeFirestoreDoc_('audit_logs', {
          action: 'add',
          module: 'Văn bản đến',
          detail: 'Tự động đồng bộ Gmail: ' + refNo + ' - ' + subject,
          userEmail: CONFIG.FIREBASE_EMAIL,
          userName: 'Đồng bộ Gmail tự động',
          timestamp: now,
        }, idToken);
      } catch (logErr) {
        Logger.log('Cảnh báo ghi audit log: ' + logErr.message);
      }

      syncedSet.add(msgId);
      threadProcessed++;
      countSynced++;
      props.setProperty('SYNCED_MSG_IDS', JSON.stringify(Array.from(syncedSet).slice(-300)));
    }

    if (threadProcessed > 0) {
      thread.removeLabel(labelInbox);
      thread.addLabel(labelDone);
    }
  }

  props.setProperty('SYNCED_MSG_IDS', JSON.stringify(Array.from(syncedSet).slice(-300)));
  Logger.log('Đã đồng bộ thành công ' + countSynced + ' văn bản mới.');
}

function datLaiBoNhoDongBo() {
  PropertiesService.getScriptProperties().deleteProperty('SYNCED_MSG_IDS');
  Logger.log('Đã xóa danh sách ID email đã đồng bộ.');
}

function signInFirebase_() {
  const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + CONFIG.FIREBASE_API_KEY;
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      email: CONFIG.FIREBASE_EMAIL.trim(),
      password: CONFIG.FIREBASE_PASSWORD,
      returnSecureToken: true,
    }),
    muteHttpExceptions: true,
  });

  const code = res.getResponseCode();
  const data = JSON.parse(res.getContentText() || '{}');
  if (code < 200 || code >= 300 || !data.idToken) {
    throw new Error('Không thể đăng nhập Firebase (' + (data.error ? data.error.message : code) + '). Kiểm tra lại FIREBASE_EMAIL và FIREBASE_PASSWORD.');
  }
  return { idToken: data.idToken, uid: data.localId };
}

function assertGmailSyncAllowed_(idToken, uid) {
  if (!uid) return;
  const url = 'https://firestore.googleapis.com/v1/projects/' +
    CONFIG.FIREBASE_PROJECT_ID +
    '/databases/(default)/documents/users/' +
    encodeURIComponent(uid);

  const res = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { Authorization: 'Bearer ' + idToken },
    muteHttpExceptions: true,
  });

  const code = res.getResponseCode();
  if (code === 404) {
    throw new Error('Tài khoản chưa có hồ sơ trên trang web. Hãy đăng nhập web 1 lần rồi nhờ Quản trị viên cấp quyền đồng bộ Gmail.');
  }
  if (code < 200 || code >= 300) {
    throw new Error('Không thể kiểm tra quyền đồng bộ (' + code + ').');
  }

  const docData = JSON.parse(res.getContentText() || '{}');
  const fields = docData.fields || {};
  const role = fields.role && fields.role.stringValue ? fields.role.stringValue : '';
  const status = fields.status && fields.status.stringValue ? fields.status.stringValue : 'active';
  const canSyncGmail = fields.canSyncGmail && fields.canSyncGmail.booleanValue === true;

  if (status === 'locked') {
    throw new Error('Tài khoản của bạn đã bị khóa bởi Quản trị viên.');
  }

  const isAdmin = role === 'Quản trị viên' || role === 'admin';
  if (!isAdmin && !canSyncGmail) {
    throw new Error('Tài khoản "' + CONFIG.FIREBASE_EMAIL + '" chưa được Quản trị viên cấp quyền đồng bộ Gmail.');
  }
}

function writeFirestoreDoc_(collectionName, obj, idToken) {
  const url = 'https://firestore.googleapis.com/v1/projects/' +
    CONFIG.FIREBASE_PROJECT_ID +
    '/databases/(default)/documents/' +
    collectionName;

  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + idToken },
    payload: JSON.stringify({ fields: toFirestoreFields_(obj) }),
    muteHttpExceptions: true,
  });

  const code = res.getResponseCode();
  if (code === 403) {
    throw new Error('Tài khoản chưa được Quản trị viên cấp quyền đồng bộ Gmail (403 PERMISSION_DENIED).');
  }
  if (code < 200 || code >= 300) {
    throw new Error('Lỗi ghi Firestore (' + collectionName + '): ' + res.getContentText());
  }
  return JSON.parse(res.getContentText());
}

function toFirestoreFields_(obj) {
  const fields = {};
  Object.keys(obj).forEach(function (k) {
    fields[k] = toFirestoreValue_(obj[k]);
  });
  return fields;
}

function toFirestoreValue_(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (val instanceof Date) return { timestampValue: val.toISOString() };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === 'boolean') return { booleanValue: val };
  return { stringValue: String(val) };
}

function getOrCreateLabel_(name) {
  let label = GmailApp.getUserLabelByName(name);
  if (!label) {
    label = GmailApp.createLabel(name);
  }
  return label;
}

function getOrCreateDriveFolder_(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

function formatSender_(fromHeader) {
  const match = fromHeader.match(/^"?([^"<]+)"?\s*<([^>]+)>$/);
  if (match) {
    const name = match[1].trim();
    const email = match[2].trim();
    return name ? name + ' (' + email + ')' : email;
  }
  return fromHeader.replace(/[<>"]/g, '').trim();
}

function extractRefNo_(subject, dateObj) {
  const match = subject.match(/\b\d{1,4}\/[A-Za-zÀ-ỹ0-9._-]+\b/);
  if (match) return match[0];
  return 'GM-' + Utilities.formatDate(dateObj, 'Asia/Ho_Chi_Minh', 'ddMM-HHmm');
}
