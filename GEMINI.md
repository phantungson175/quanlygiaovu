# HƯỚNG DẪN & BỐI CẢNH DỰ ÁN (TỰ ĐỘNG NẠP CHO ANTIGRAVITY)

File `GEMINI.md` này được Antigravity tự động đọc mỗi khi mở thư mục dự án trên bất kỳ máy tính nào, giúp AI nắm bắt 100% thông tin đề tài, kiến trúc mã nguồn và cấu trúc báo cáo thực tập tốt nghiệp mà không cần giải thích lại.

---

## 1. Thông tin chung về Đề tài & Sinh viên thực hiện

- **Tên đề tài:** Phân tích, thiết kế và xây dựng Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (*QuanLyGiaoVu - EPU 2026*)
- **Sinh viên thực hiện:** Phan Tùng Sơn
- **Mã sinh viên:** 22810310206
- **Lớp:** D17CNPM3 – Khoa Công nghệ Thông tin – Trường Đại học Điện Lực (EPU)
- **Giảng viên hướng dẫn:** TS. Trần Thị Minh Thư
- **Đơn vị thực tập:** Công ty TNHH Công nghệ KTL (*KTL TECHNOLOGY CO., LTD* – Địa chỉ: Số 100, ngõ 1 phố Phạm Tuấn Tài, phường Nghĩa Đô, quận Cầu Giấy, Hà Nội)
- **Cán bộ hướng dẫn tại doanh nghiệp:** ThS. Hoàng Văn Tuấn (Kỹ sư Trưởng – Phòng Phát triển Phần mềm)

---

## 2. Kiến trúc Kỹ thuật & Các Phân hệ của Phần mềm (`src/`)

### 2.1. Công nghệ sử dụng (Tech Stack)
- **Frontend & Build Tool:** React 19 (`^19.2.8`), Vite 8 (`^8.3.0`), React Router DOM v7, Lucide React Icons, React Hot Toast.
- **Backend-as-a-Service (BaaS):** Google Firebase (`^12.19.0`) gồm **Firebase Authentication** (xác thực Email/Password, kiểm tra xác minh email) và **Cloud Firestore** (cơ sở dữ liệu NoSQL thời gian thực).
- **Cơ chế Lưu trữ Tệp Lai (Hybrid Storage):** Kết hợp **IndexedDB** nội bộ trên trình duyệt và **Cloud Data URI** trên Firestore để đính kèm, xem trực tiếp (PDF/Ảnh) và tải xuống tệp chứng từ/bảng điểm/hợp đồng mà không phụ thuộc vào dịch vụ lưu trữ trả phí bên ngoài.
- **Xuất Báo cáo & Xử lý Dữ liệu:** `jspdf` + `jspdf-autotable` (xuất PDF chuẩn tiếng Việt Unicode), `xlsx` (nhập/xuất Excel `.xlsx`), `docx` (tạo tài liệu Word chuẩn OpenXML `.docx`), `date-fns` (xử lý ngày tháng và tính hạn khấu hao/hợp đồng).

### 2.2. Các tác nhân (Actors) & Phân quyền
1. **Quản trị viên (`Admin`):** Toàn quyền trên mọi phân hệ nghiệp vụ + Quản lý người dùng (`UsersManagementPage`: phân quyền `admin`/`staff`, khóa/mở khóa tài khoản) + Sao lưu & Phục hồi toàn bộ CSDL ra tệp JSON (`BackupPage`).
2. **Cán bộ Giáo vụ (`Academic Staff`):** Thực hiện toàn bộ các nghiệp vụ giáo vụ hằng ngày trên hệ thống.
3. **Người dùng chưa xác thực (`Guest`):** Bị chặn ở `VerifyEmailPage` cho đến khi xác nhận liên kết kích hoạt qua email.

### 2.3. Các phân hệ chức năng chính trong `src/`
- **Xác thực & Hồ sơ:** `src/pages/LoginPage.jsx`, `src/pages/VerifyEmailPage.jsx`, `src/components/common/ProfileModal.jsx`, `src/context/AuthContext.jsx`.
- **Bảng điều khiển & Cảnh báo thông minh (Smart Alerts):** `src/pages/DashboardPage.jsx` và logic cảnh báo tại `src/App.jsx` (tự động quét tài sản sắp/hết khấu hao $\le 1$ tháng, hợp đồng chuyên gia sắp/hết hạn $\le 2$ tháng, văn bản đến ở trạng thái `"Chưa xử lý"`).
- **Quản lý Tài sản & Thiết bị (`AssetsPage.jsx`, `assetService.js`):** Quản lý mã tài sản, phòng sử dụng, ngày bắt đầu, số tháng khấu hao, tự động tính số tháng khấu hao còn lại.
- **Quản lý Hồ sơ Điểm thi (`ScoresPage.jsx`, `scoreService.js`):** Lưu trữ học phần, lớp, học kỳ, năm học, giảng viên chấm thi và đính kèm tệp bảng điểm scan.
- **Quản lý Chuyên gia Thỉnh giảng (`ExpertsPage.jsx`, `expertService.js`):** Quản lý học hàm/học vị, số hợp đồng, ngày hiệu lực/hết hạn, cảnh báo gia hạn hợp đồng.
- **Quản lý Văn bản Đến & Đi (`DocumentsPage.jsx`, `documentService.js`):** Phân tách luồng công văn đến và đi, theo dõi trạng thái xử lý (`Chưa xử lý`, `Đang xử lý`, `Đã xử lý`), đính kèm tệp văn bản.
- **Kê khai Khối lượng Giảng dạy (`TeachingPage.jsx`, `teachingService.js`):** Quản lý số tiết lý thuyết, thực hành, hệ số quy đổi, tự động tính tổng giờ chuẩn giảng dạy của giảng viên.
- **Nhật ký Hoạt động (`AuditLogPage.jsx`, `auditService.js`):** Tự động ghi vết mọi thao tác thêm/sửa/xóa/đăng nhập (Audit Trail) phục vụ kiểm toán nội bộ.
- **Quản trị Người dùng & Sao lưu CSDL (`UsersManagementPage.jsx`, `BackupPage.jsx`):** Dành riêng cho Admin.
- **Tạo dữ liệu mẫu:** `seed_sample_data.js` chứa bộ dữ liệu thực tế phục vụ kiểm thử và chụp ảnh minh họa báo cáo.

---

## 3. Cấu trúc Báo cáo Thực tập Tốt nghiệp & Các Script Tự động

Dự án đi kèm bộ script Node.js để sinh và cập nhật nội dung Báo cáo Thực tập Tốt nghiệp chuẩn định dạng của Trường Đại học Điện Lực (khổ A4, lề chuẩn Trái 3.5cm - Phải 2.0cm - Trên/Dưới 2.5cm, font Times New Roman cỡ 13pt, giãn dòng 1.5 lines):

- **Tệp Word báo cáo chính:** `Thực tập tốt nghiệp_phan tùng sơn_22810310206.docx`
- **Tệp đặc tả biểu đồ UML / PlantUML:** `CHƯƠNG_2_CHI_TIET_PLANTTEXT.md` và thư mục `usecasse/` (chứa mã PlantUML và sơ đồ Use Case, Activity, Sequence, Class Diagram).
- **Các script tạo & cập nhật báo cáo:**
  - `update_report.js`: Script tổng hợp nội dung gốc của báo cáo Markdown.
  - `update_chapter1.js` & `update_chapter1_exact_image.js`: Cập nhật chi tiết **Chương 1: Khảo sát hiện trạng và xác lập dự án** (Mục 1.1 Sơ đồ hoạt động, 1.2 Chức năng công ty, 1.3 Nhiệm vụ công ty, 1.4 Khảo sát hiện trạng EPU, 1.5 Xác định bài toán, 1.6 Phân tích & đặc tả nghiệp vụ).
  - `update_chapter2_full.js`: Cập nhật chi tiết **Chương 2: Phân tích và thiết kế hệ thống** (Biểu đồ Use Case tổng quát & phân rã, đặc tả Use Case, biểu đồ Hoạt động Activity, biểu đồ Trình tự Sequence, biểu đồ Lớp Class Diagram, thiết kế CSDL).
  - `update_conclusion_and_ch3.js` & `update_fig31_clean.js`: Cập nhật **Chương 3: Cài đặt và thử nghiệm** (Kiến trúc SPA, React 19 + Vite 8, Firestore, Hybrid Storage, thiết kế UI/UX, kịch bản kiểm thử Test Cases) và phần **Kết luận & Hướng phát triển**.
  - `build_full_docx.js`: Biên dịch từ tệp Markdown sang tệp Word `.docx` hoàn chỉnh với bìa, mục lục, header/footer đánh số trang và bảng biểu có đường viền chuẩn.

---

## 4. Quy tắc làm việc cho AI (Antigravity) khi tiếp tục dự án

1. **Ngôn ngữ giao tiếp:** Luôn phản hồi bằng tiếng Việt rõ ràng, mạch lạc; văn phong trong báo cáo phải trang trọng, chuẩn học thuật ngành Công nghệ phần mềm / Hệ thống thông tin.
2. **Chỉnh sửa Báo cáo:** Khi người dùng yêu cầu sửa hoặc bổ sung nội dung báo cáo (Chương 1, Chương 2, Chương 3, Kết luận, Biểu đồ PlantUML), hãy kiểm tra các script `update_*.js` và `build_full_docx.js` để đảm bảo tính đồng bộ khi xuất ra file `.docx`.
3. **Chỉnh sửa Phần mềm (`src/`):** Giữ nguyên phong cách giao diện hiện đại, sử dụng các service trong `src/services/` kết nối với Firebase Firestore và ghi nhận lịch sử vào `auditService.js` đối với các thao tác thay đổi dữ liệu.

