// seed_sample_data.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';

// Đọc config từ file .env
const envText = fs.readFileSync('.env', 'utf8');
const config = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const val = match[2].trim();
    if (key === 'VITE_FIREBASE_API_KEY') config.apiKey = val;
    if (key === 'VITE_FIREBASE_AUTH_DOMAIN') config.authDomain = val;
    if (key === 'VITE_FIREBASE_PROJECT_ID') config.projectId = val;
    if (key === 'VITE_FIREBASE_STORAGE_BUCKET') config.storageBucket = val;
    if (key === 'VITE_FIREBASE_MESSAGING_SENDER_ID') config.messagingSenderId = val;
    if (key === 'VITE_FIREBASE_APP_ID') config.appId = val;
  }
});

const app = initializeApp(config);
const db = getFirestore(app);

console.log('Đang kết nối Firebase Project:', config.projectId);

async function seed() {
  console.log('--- 1. TẠO MẪU TÀI SẢN (ASSETS) ---');
  const sampleAssets = [
    {
      code: 'MC-EPU-A101',
      name: 'Máy chiếu Epson EB-X41 Giảng đường A101',
      type: 'Thiết bị điện tử',
      quantity: 1,
      room: 'Phòng A101 - Giảng đường A',
      startDate: '2025-01-15',
      year: '2025',
      depreciationMonths: 36,
      condition: 'Tốt',
      notes: 'Phục vụ giảng dạy học phần chuyên ngành CNTT',
      fileUrl: null, fileName: null,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      code: 'AM-HT-B203',
      name: 'Hệ thống âm ly loa trợ giảng Yamaha B203',
      type: 'Thiết bị điện tử',
      quantity: 1,
      room: 'Phòng B203 - Giảng đường B',
      startDate: '2023-11-05',
      year: '2023',
      depreciationMonths: 36,
      condition: 'Bình thường',
      notes: 'Đã dùng 35 tháng - Sắp hết khấu hao (còn 1 tháng), cần lập kế hoạch bảo trì',
      fileUrl: null, fileName: null,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      code: 'PC-LAB301',
      name: 'Dàn máy vi tính thực hành HP ProDesk (30 bộ)',
      type: 'Thiết bị văn phòng',
      quantity: 30,
      room: 'Phòng Lab 301 - Khoa CNTT',
      startDate: '2022-12-10',
      year: '2022',
      depreciationMonths: 36,
      condition: 'Cần bảo trì',
      notes: 'Đã hết thời hạn khấu hao 36 tháng - Lập biên bản kiểm kê trình Hội đồng thanh lý / nâng cấp',
      fileUrl: null, fileName: null,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      code: 'IN-VP-CNTT',
      name: 'Máy in Laser hai mặt Canon LBP 2900',
      type: 'Thiết bị văn phòng',
      quantity: 2,
      room: 'Văn phòng Khoa CNTT',
      startDate: '2025-09-01',
      year: '2025',
      depreciationMonths: 36,
      condition: 'Tốt',
      notes: 'In ấn biểu mẫu, bảng điểm thi và công văn hành chính',
      fileUrl: null, fileName: null,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    }
  ];

  for (const a of sampleAssets) {
    await addDoc(collection(db, 'assets'), a);
    console.log(' + Đã thêm tài sản:', a.name);
  }

  console.log('--- 2. TẠO MẪU CHUYÊN GIA THỈNH GIẢNG (EXPERTS) ---');
  const sampleExperts = [
    {
      honorific: 'Ông',
      gender: 'Nam',
      name: 'PGS.TS. Trần Đình Long',
      birthDate: '1968-05-12',
      birthDay: '12', birthMonth: '05', birthYear: '1968',
      hometown: 'Hà Nội',
      permanentAddress: 'Số 45 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
      currentAddress: 'Số 45 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
      academicTitle: 'PGS',
      degree: 'Tiến sĩ',
      appointedDate: '2015-11-20',
      faculty: 'Khoa Công nghệ Thông tin',
      workplace: 'Tập đoàn Điện lực Việt Nam (EVN)',
      occupation: 'Cố vấn Kỹ thuật Cao cấp',
      cccd: '001068001234',
      phone: '0912345678',
      bankAccount: '1903456789012',
      bankName: 'Vietcombank - Chi nhánh Thăng Long',
      contractNo: '45/HĐ-TG-EPU',
      contractSignDate: '2025-11-15',
      startDate: '2025-11-15',
      endDate: '2026-11-15', // Còn 1 tháng nữa -> Sắp hết hạn (Badge Vàng)
      contractFileUrl: null, contractFileName: 'HopDongThinhGiang_TranDinhLong.pdf',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      honorific: 'Bà',
      gender: 'Nữ',
      name: 'TS. Nguyễn Thị Bích Loan',
      birthDate: '1975-08-24',
      birthDay: '24', birthMonth: '08', birthYear: '1975',
      hometown: 'Nam Định',
      permanentAddress: 'Số 12 Chùa Láng, Đống Đa, Hà Nội',
      currentAddress: 'Số 12 Chùa Láng, Đống Đa, Hà Nội',
      academicTitle: 'Không có',
      degree: 'Tiến sĩ',
      appointedDate: '',
      faculty: 'Khoa Công nghệ Thông tin',
      workplace: 'Viện Năng lượng Quốc gia',
      occupation: 'Trưởng phòng Nghiên cứu Hệ thống',
      cccd: '001175005678',
      phone: '0987654321',
      bankAccount: '10287654321',
      bankName: 'BIDV - Chi nhánh Cầu Giấy',
      contractNo: '18/HĐ-TG-CNTT',
      contractSignDate: '2025-08-01',
      startDate: '2025-08-15',
      endDate: '2026-08-15', // Đã hết hạn -> Cảnh báo Đỏ
      contractFileUrl: null, contractFileName: 'HopDongThinhGiang_BichLoan.pdf',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      honorific: 'Ông',
      gender: 'Nam',
      name: 'GS.TS. Hoàng Minh Sơn',
      birthDate: '1962-03-10',
      birthDay: '10', birthMonth: '03', birthYear: '1962',
      hometown: 'Thái Bình',
      permanentAddress: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
      currentAddress: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
      academicTitle: 'GS',
      degree: 'Tiến sĩ Khoa học',
      appointedDate: '2010-09-15',
      faculty: 'Khoa Công nghệ Thông tin',
      workplace: 'Đại học Bách Khoa Hà Nội',
      occupation: 'Giảng viên cao cấp',
      cccd: '001062003456',
      phone: '0903123456',
      bankAccount: '0011002345678',
      bankName: 'Vietcombank - Sở Giao Dịch',
      contractNo: '68/HĐ-TG-EPU',
      contractSignDate: '2026-09-01',
      startDate: '2026-09-05',
      endDate: '2027-06-30', // Còn 8 tháng -> Đang hiệu lực (Badge Xanh)
      contractFileUrl: null, contractFileName: 'HopDongThinhGiang_HoangMinhSon.pdf',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    }
  ];

  for (const e of sampleExperts) {
    await addDoc(collection(db, 'experts'), e);
    console.log(' + Đã thêm chuyên gia:', e.name);
  }

  console.log('--- 3. TẠO MẪU VĂN BẢN ĐẾN & ĐI (DOCUMENTS) ---');
  const sampleInDocs = [
    {
      refNo: '128/CV-BCT',
      date: '2026-10-12',
      year: '2026',
      sender: 'Bộ Công Thương',
      summary: 'V/v rà soát chỉ tiêu tuyển sinh và quy hoạch ngành đào tạo trọng điểm năm học 2026 - 2027',
      assignee: 'Phòng Đào tạo - Giáo vụ EPU',
      deadline: '2026-10-28',
      notes: 'Công văn khẩn yêu cầu báo cáo trước ngày 28/10',
      status: 'Chưa xử lý',
      fileUrl: null, fileName: 'CongVan_128_BCT.pdf',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      refNo: '452/BGDĐT-GDĐH',
      date: '2026-10-05',
      year: '2026',
      sender: 'Bộ Giáo dục và Đào tạo',
      summary: 'Hướng dẫn tự đánh giá và kiểm định chất lượng chương trình đào tạo kỹ sư CNTT chuẩn ABET',
      assignee: 'Khoa CNTT - Trợ lý Giáo vụ',
      deadline: '2026-11-15',
      notes: 'Đang tổng hợp minh chứng chuẩn đầu ra',
      status: 'Đang xử lý',
      fileUrl: null, fileName: 'HuongDan_452_BGDDT.pdf',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      refNo: '89/TB-EPU',
      date: '2026-09-28',
      year: '2026',
      sender: 'Ban Giám hiệu Trường ĐH Điện Lực',
      summary: 'Thông báo lịch thi kết thúc học phần và điều động cán bộ coi thi học kỳ 1 năm học 2026 - 2027',
      assignee: 'Tổ Giáo vụ & Khảo thí',
      deadline: '2026-10-10',
      notes: 'Đã hoàn tất lập lịch thi và phân công phòng thi',
      status: 'Đã xử lý',
      fileUrl: null, fileName: 'ThongBao_89_BGH.pdf',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    }
  ];

  for (const d of sampleInDocs) {
    await addDoc(collection(db, 'docs_incoming'), d);
    console.log(' + Đã thêm công văn đến:', d.refNo);
  }

  const sampleOutDocs = [
    {
      refNo: '24/TTr-CNTT',
      date: '2026-10-14',
      year: '2026',
      recipient: 'Ban Giám hiệu & Phòng Đào tạo EPU',
      summary: 'Tờ trình về việc phê duyệt danh sách mời giảng viên thỉnh giảng chuyên gia EVN học kỳ 1',
      assignee: 'Khoa Công nghệ Thông tin',
      deadline: '2026-10-22',
      notes: 'Đang chờ Ban Giám hiệu ký duyệt tờ trình',
      status: 'Chưa hồi đáp',
      fileUrl: null, fileName: 'ToTrinh_24_CNTT.pdf',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      refNo: '115/TB-ĐT',
      date: '2026-10-02',
      year: '2026',
      recipient: 'Các Khoa đào tạo & Sinh viên toàn trường',
      summary: 'Thông báo kế hoạch nộp bảng điểm thi học phần và xét điều kiện làm đồ án tốt nghiệp đợt 2',
      assignee: 'Phòng Đào tạo',
      deadline: '2026-10-15',
      notes: 'Các khoa đã nộp đủ danh sách sinh viên đủ điều kiện',
      status: 'Đã hồi đáp',
      fileUrl: null, fileName: 'ThongBao_115_DaoTao.pdf',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    }
  ];

  for (const d of sampleOutDocs) {
    await addDoc(collection(db, 'docs_outgoing'), d);
    console.log(' + Đã thêm công văn đi:', d.refNo);
  }

  console.log('--- 4. TẠO MẪU HỒ SƠ ĐIỂM THI (SCORES) ---');
  const sampleScores = [
    {
      fileName: 'BangDiem_LapTrinhWebReact_D17CNPM3.xlsx',
      fileUrl: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIA...',
      fileSize: 145200,
      fileType: 'xlsx',
      subjectName: 'Lập trình Ứng dụng Web với ReactJS',
      tag: 'Kỹ thuật phần mềm',
      academicYear: '2025-2026',
      createdAt: serverTimestamp()
    },
    {
      fileName: 'BangDiem_ToanCaoCapA1_D17.pdf',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQK...',
      fileSize: 256800,
      fileType: 'pdf',
      subjectName: 'Toán cao cấp A1',
      tag: 'Khoa học cơ bản',
      academicYear: '2025-2026',
      createdAt: serverTimestamp()
    },
    {
      fileName: 'BangDiem_CoSoDuLieu_D17CNPM1.xlsx',
      fileUrl: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIA...',
      fileSize: 112400,
      fileType: 'xlsx',
      subjectName: 'Cơ sở dữ liệu nâng cao',
      tag: 'Hệ thống thông tin',
      academicYear: '2025-2026',
      createdAt: serverTimestamp()
    }
  ];

  for (const s of sampleScores) {
    await addDoc(collection(db, 'scores'), s);
    console.log(' + Đã thêm bảng điểm:', s.subjectName);
  }

  console.log('--- 5. TẠO MẪU KHỐI LƯỢNG GIẢNG DẠY (TEACHING NORM & CONTRACT) ---');
  const sampleNorms = [
    {
      lecturerName: 'TS. Trần Thị Minh Thư',
      title: 'TS',
      department: 'Bộ môn Công nghệ phần mềm',
      academicYear: '2025-2026',
      norm: 270,
      actual: 315, // Vượt 45 tiết (Badge Vàng)
      attachments: [{ name: 'ThoiKhoaBieu_HK1_MinhThu.pdf', url: '#' }],
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      lecturerName: 'ThS. Nguyễn Văn Bình',
      title: 'ThS',
      department: 'Bộ môn Hệ thống thông tin',
      academicYear: '2025-2026',
      norm: 270,
      actual: 240, // Thiếu 30 tiết (Badge Đỏ)
      attachments: [{ name: 'LichGiangDay_VanBinh.pdf', url: '#' }],
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      lecturerName: 'TS. Lê Hoàng Mai',
      title: 'TS',
      department: 'Bộ môn Khoa học máy tính',
      academicYear: '2025-2026',
      norm: 270,
      actual: 270, // Đủ định mức (Badge Xanh)
      attachments: [{ name: 'XacNhanChamThi_HoangMai.pdf', url: '#' }],
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    }
  ];

  for (const n of sampleNorms) {
    await addDoc(collection(db, 'teaching_norm'), n);
    console.log(' + Đã thêm KLGD định mức:', n.lecturerName);
  }

  const sampleContracts = [
    {
      lecturerName: 'PGS.TS. Trần Đình Long',
      title: 'PGS.TS',
      department: 'Khoa Công nghệ Thông tin',
      subject: 'Hệ thống Lưới điện thông minh (Smart Grid)',
      academicYear: '2025-2026',
      hours: 45,
      attachments: [{ name: 'DeCuong_SmartGrid.pdf', url: '#' }],
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    },
    {
      lecturerName: 'TS. Nguyễn Thị Bích Loan',
      title: 'TS',
      department: 'Khoa Năng lượng',
      subject: 'Mô hình hóa Năng lượng tái tạo',
      academicYear: '2025-2026',
      hours: 60,
      attachments: [{ name: 'GiaoTrinh_NangLuongTaiTao.pdf', url: '#' }],
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    }
  ];

  for (const c of sampleContracts) {
    await addDoc(collection(db, 'teaching_contract'), c);
    console.log(' + Đã thêm KLGD hợp đồng:', c.lecturerName);
  }

  console.log('--- 6. TẠO MẪU NHẬT KÝ HOẠT ĐỘNG (AUDIT LOGS) ---');
  const sampleLogs = [
    {
      action: 'add',
      module: 'Tài sản',
      detail: 'Thêm tài sản: Máy chiếu Epson EB-X41 Giảng đường A101',
      userEmail: 'giaovu@epu.edu.vn',
      userName: 'Phan Tùng Sơn',
      timestamp: serverTimestamp()
    },
    {
      action: 'add',
      module: 'Thỉnh giảng',
      detail: 'Thêm chuyên gia: PGS.TS. Trần Đình Long (EVN)',
      userEmail: 'giaovu@epu.edu.vn',
      userName: 'Phan Tùng Sơn',
      timestamp: serverTimestamp()
    },
    {
      action: 'upload',
      module: 'Điểm',
      detail: 'Upload file điểm: BangDiem_LapTrinhWebReact_D17CNPM3.xlsx',
      userEmail: 'giaovu@epu.edu.vn',
      userName: 'Phan Tùng Sơn',
      timestamp: serverTimestamp()
    },
    {
      action: 'edit',
      module: 'Văn bản đến',
      detail: 'Cập nhật trạng thái công văn 89/TB-EPU: Đã xử lý',
      userEmail: 'admin@epu.edu.vn',
      userName: 'Quản trị viên EPU',
      timestamp: serverTimestamp()
    }
  ];

  for (const l of sampleLogs) {
    await addDoc(collection(db, 'audit_logs'), l);
    console.log(' + Đã ghi log:', l.detail);
  }

  console.log('========================================================');
  console.log('ĐÃ NẠP THÀNH CÔNG TOÀN BỘ MẪU DỮ LIỆU CHUẨN VÀO FIRESTORE!');
  console.log('========================================================');
  process.exit(0);
}

seed().catch(err => {
  console.error('Lỗi khi nạp dữ liệu:', err);
  process.exit(1);
});
