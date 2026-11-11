/**
 * ============================================================================
 * SCRIPT TỰ ĐỘNG ĐỒNG BỘ VĂN BẢN ĐẾN TỪ GMAIL -> HỆ THỐNG QUẢN LÝ GIÁO VỤ
 * Chạy miễn phí 0đ trên Google Apps Script (https://script.google.com)
 * ============================================================================
 */

const CONFIG = {
  // 1. Tài khoản Email & Mật khẩu bạn đã đăng ký (và xác thực email) trên trang web Quản lý Giáo vụ
  FIREBASE_EMAIL: 'DIEN_EMAIL_TAI_KHOAN_WEB_CUA_BAN@gmail.com',
  FIREBASE_PASSWORD: 'DIEN_MAT_KHAU_TAI_KHOAN_WEB',

  // 2. Cấu hình dự án Firebase (đã điền sẵn đúng theo hệ thống của bạn)
  FIREBASE_PROJECT_ID: 'qlgiaovu',
  FIREBASE_API_KEY: 'AIzaSyCdk0k-bVwRRIgT5G1_wV8EfOufY5v4qYU',

  // 3. Tên nhãn (Label) trong Gmail để nhận diện công văn đến (tự động tạo nếu chưa có)
  LABEL_INBOX: 'VanBanDen',
  LABEL_DONE: 'DaDongBo',

  // 4. Tên thư mục trên Google Drive để lưu tự động tệp đính kèm từ email
  DRIVE_FOLDER_NAME: 'QuanLyGiaoVu_VanBanDen',
};

/**
 * HÀM CÀI ĐẶT 1 LẦN DUY NHẤT:
 * Hãy chọn hàm "caiDatTuDong" ở thanh công cụ phía trên và bấm "Chạy (Run)" 1 lần đầu tiên.
 * Hàm này sẽ:
 * - Tạo nhãn Gmail "VanBanDen" và "DaDongBo"
 * - Tạo thư mục Drive "QuanLyGiaoVu_VanBanDen"
 * - Kiểm tra kết nối đăng nhập lên trang web
 * - Tự động đặt lịch quét Gmail mỗi 5 phút
 */
function caiDatTuDong() {
  if (!CONFIG.FIREBASE_EMAIL || CONFIG.FIREBASE_EMAIL.includes('DIEN_EMAIL')) {
    throw new Error('Vui lòng điền FIREBASE_EMAIL và FIREBASE_PASSWORD thật của bạn ở phần CONFIG phía trên trước khi chạy!');
  }

  getOrCreateLabel_(CONFIG.LABEL_INBOX);
  getOrCreateLabel_(CONFIG.LABEL_DONE);
  getOrCreateDriveFolder_(CONFIG.DRIVE_FOLDER_NAME);

  // Kiểm tra đăng nhập Firebase
  const authInfo = signInFirebase_();
  Logger.log('✅ Đăng nhập Firebase thành công!');

  // Tạo Trigger tự động chạy mỗi 5 phút (nếu chưa có)
  const triggers = ScriptApp.getProjectTriggers();
  const exists = triggers.some(t => t.getHandlerFunction() === 'syncGmailToGiaoVu');
  if (!exists) {
    ScriptApp.newTrigger('syncGmailToGiaoVu')
      .timeBased()
      .everyMinutes(5)
      .create();
    Logger.log('✅ Đã bật lịch chạy tự động mỗi 5 phút!');
  } else {
    Logger.log('ℹ️ Lịch chạy tự động mỗi 5 phút đã được bật từ trước.');
  }

  // Kiểm tra xem tài khoản đã được Quản trị viên cấp quyền đồng bộ Gmail chưa
  assertGmailSyncAllowed_(authInfo.idToken, authInfo.uid);
  Logger.log('✅ Tài khoản đã được cấp quyền đồng bộ Gmail lên trang web!');

  // Chạy thử đồng bộ ngay lần đầu với phiên đăng nhập sẵn
  runSyncWithToken_(authInfo);
}

/**
 * HÀM ĐỒNG BỘ CHÍNH (Chạy tự động mỗi 5 phút hoặc bấm Chạy thủ công)
 * Lưu ý: Google Apps Script sẽ tự truyền đối tượng sự kiện thời gian vào tham số
 * khi chạy trigger tự động, nên tuyệt đối không dùng tham số này làm Token Firebase.
 */
function syncGmailToGiaoVu() {
  return runSyncWithToken_(null);
}

/**
 * Thực thi quét nhãn VanBanDen và đẩy dữ liệu lên Firestore
 */
function runSyncWithToken_(preloadedAuth) {
  const labelInbox = getOrCreateLabel_(CONFIG.LABEL_INBOX);
  const labelDone = getOrCreateLabel_(CONFIG.LABEL_DONE);

  // Tìm các chuỗi email đang gắn nhãn VanBanDen
  const threads = GmailApp.search('label:' + CONFIG.LABEL_INBOX, 0, 20);
  if (!threads || threads.length === 0) {
    Logger.log('Không có email mới nào trong nhãn "' + CONFIG.LABEL_INBOX + '".');
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

      // Bỏ qua thư đã đồng bộ trước đó
      if (syncedSet.has(msgId)) {
        threadProcessed++;
        continue;
      }

      // Chỉ bỏ qua thư tự trả lời của chính mình nếu trong chuỗi thư có email từ người khác gửi đến
      if (hasExternalSender && myEmail && (msg.getFrom() || '').toLowerCase().includes(myEmail)) {
        syncedSet.add(msgId);
        threadProcessed++;
        continue;
      }

      const subject = (msg.getSubject() || 'Văn bản từ Gmail').trim();
      const senderRaw = msg.getFrom() || 'Không rõ người gửi';
      const sender = formatSender_(senderRaw);
      const msgDate = msg.getDate() || new Date();
      const dateStr = Utilities.formatDate(msgDate, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
      const yearStr = Utilities.formatDate(msgDate, 'Asia/Ho_Chi_Minh', 'yyyy');
      const timeStr = Utilities.formatDate(msgDate, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm');
      const refNo = extractRefNo_(subject, msgDate);

      // Xử lý tệp đính kèm (bỏ qua ảnh chữ ký inline nhỏ)
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
          Logger.log('Không thể tự bật chia sẻ công khai cho tệp ' + fileName + ': ' + shareErr.message);
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
      const docPayload = {
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
      };

      writeFirestoreDoc_('docs_incoming', docPayload, idToken);

      // Ghi nhật ký Audit Log trên hệ thống
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

      // Lưu ngay sau mỗi văn bản ghi thành công để tránh trùng lặp nếu thư sau lỗi
      props.setProperty('SYNCED_MSG_IDS', JSON.stringify(Array.from(syncedSet).slice(-300)));
    }

    // Chuyển nhãn từ VanBanDen -> DaDongBo sau khi đã xử lý xong chuỗi thư
    if (threadProcessed > 0) {
      thread.removeLabel(labelInbox);
      thread.addLabel(labelDone);
    }
  }

  // Giữ lại tối đa 300 ID gần nhất để tránh tràn bộ nhớ Properties
  const updatedIds = Array.from(syncedSet).slice(-300);
  props.setProperty('SYNCED_MSG_IDS', JSON.stringify(updatedIds));

  Logger.log('✅ Đã đồng bộ thành công ' + countSynced + ' văn bản mới từ Gmail lên trang web!');
}

/**
 * Hàm phụ trợ (chỉ chạy thủ công khi cần test lại một email cũ đã đồng bộ trước đó)
 */
function datLaiBoNhoDongBo() {
  PropertiesService.getScriptProperties().deleteProperty('SYNCED_MSG_IDS');
  Logger.log('Đã xóa danh sách ID email đã đồng bộ (SYNCED_MSG_IDS).');
}

// ==================== CÁC HÀM HỖ TRỢ NỘI BỘ ====================

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
    throw new Error('Không thể đăng nhập tài khoản Firebase (' + (data.error ? data.error.message : code) + '). Vui lòng kiểm tra lại FIREBASE_EMAIL và FIREBASE_PASSWORD!');
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
    throw new Error('Tài khoản chưa kích hoạt hồ sơ trên trang web. Hãy đăng nhập vào trang web ít nhất 1 lần rồi nhờ Quản trị viên cấp quyền đồng bộ Gmail!');
  }
  if (code < 200 || code >= 300) {
    throw new Error('Không thể kiểm tra quyền đồng bộ tài khoản (' + code + ').');
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
    throw new Error('Tài khoản "' + CONFIG.FIREBASE_EMAIL + '" chưa được Quản trị viên cấp quyền đồng bộ Gmail. Vui lòng nhờ Admin bật quyền trong mục Quản lý Người dùng!');
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
  // Nếu tiêu đề email có chứa số ký hiệu văn bản (VD: 125/CV-BGDDT, 45/QD-EPU)
  const match = subject.match(/\b\d{1,4}\/[A-Za-zÀ-ỹ0-9._-]+\b/);
  if (match) return match[0];
  return 'GM-' + Utilities.formatDate(dateObj, 'Asia/Ho_Chi_Minh', 'ddMM-HHmm');
}
