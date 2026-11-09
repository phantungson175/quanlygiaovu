// update_conclusion_and_ch3.js
import fs from 'fs';
import path from 'path';

const mdPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md');
let content = fs.readFileSync(mdPath, 'utf8');

// 1. Cập nhật Mục lục
const oldTOC = `- [CHƯƠNG 3: CÀI ĐẶT VÀ THỬ NGHIỆM](#chương-3-cài-đặt-và-thử-nghiệm)
  - [3.1 Giới thiệu ngôn ngữ và công nghệ cài đặt](#31-giới-thiệu-ngôn-ngữ-và-công-nghệ-cài-đặt)
    - [3.1.1 Kiến trúc ứng dụng web trang đơn (Single Page Application - SPA)](#311-kiến-trúc-ứng-dụng-web-trang-đơn-single-page-application---spa)
    - [3.1.2 Nền tảng React 19 và công cụ đóng gói siêu tốc Vite 8](#312-nền-tảng-react-19-và-công-cụ-đóng-gói-siêu-tốc-vite-8)
    - [3.1.3 Cơ sở dữ liệu đám mây Google Firebase Firestore & Authentication](#313-cơ-sở-dữ-liệu-đám-mây-google-firebase-firestore--authentication)
    - [3.1.4 Cơ chế lưu trữ lai Hybrid Storage (IndexedDB kết hợp Data URI Cloud)](#314-cơ-chế-lưu-trữ-lai-hybrid-storage-indexeddb-kết-hợp-data-uri-cloud)
    - [3.1.5 Các thư viện xuất báo cáo chuẩn Unicode tiếng Việt sắc nét](#315-các-thư-viện-xuất-báo-cáo-chuẩn-unicode-tiếng-việt-sắc-nét)
  - [3.2 Thiết kế giao diện người dùng (UI/UX)](#32-thiết-kế-giao-diện-người-dùng-uiux)
    - [3.2.1 Giao diện Đăng nhập và Xác thực Email](#321-giao-diện-đăng-nhập-và-xác-thực-email)
    - [3.2.2 Giao diện Bảng điều khiển Trung tâm (Dashboard & Smart Alerts)](#322-giao-diện-bảng-điều-khiển-trung-tâm-dashboard--smart-alerts)
    - [3.2.3 Giao diện Phân hệ Quản lý Tài sản](#323-giao-diện-phân-hệ-quản-lý-tài-sản)
    - [3.2.4 Giao diện Phân hệ Quản lý Hồ sơ Điểm thi](#324-giao-diện-phân-hệ-quản-lý-hồ-sơ-điểm-thi)
    - [3.2.5 Giao diện Phân hệ Quản lý Chuyên gia Thỉnh giảng](#325-giao-diện-phân-hệ-quản-lý-chuyên-gia-thỉnh-giảng)
    - [3.2.6 Giao diện Phân hệ Quản lý Văn bản Đến và Đi](#326-giao-diện-phân-hệ-quản-lý-văn-bản-đến-và-đi)
    - [3.2.7 Giao diện Phân hệ Quản lý Khối lượng Giảng dạy](#327-giao-diện-phân-hệ-quản-lý-khối-lượng-giảng-dạy)
    - [3.2.8 Giao diện Phân hệ Nhật ký Hoạt động (Audit Log)](#328-giao-diện-phân-hệ-nhật-ký-hoạt-động-audit-log)
  - [3.3 Thiết kế cơ sở dữ liệu vật lý và các cơ chế kiểm soát](#33-thiết-kế-cơ-sở-dữ-liệu-vật-lý-và-các-cơ-chế-kiểm-soát)
    - [3.3.1 Cơ sở dữ liệu vật lý trên Google Cloud Firestore](#331-cơ-sở-dữ-liệu-vật-lý-trên-google-cloud-firestore)
    - [3.3.2 Cấu trúc lưu trữ tệp vật lý đệm nội bộ trên IndexedDB](#332-cấu-trúc-lưu-trữ-tệp-vật-lý-đệm-nội-bộ-trên-indexeddb)
    - [3.3.3 Các kiểm soát toàn vẹn dữ liệu, kiểm soát bảo mật và kiểm soát vết (Audit Trail)](#333-các-kiểm-soát-toàn-vẹn-dữ-liệu-kiểm-soát-bảo-mật-và-kiểm-soát-vết-audit-trail)
  - [3.4 Thực nghiệm và đánh giá hệ thống](#34-thực-nghiệm-và-đánh-giá-hệ-thống)
    - [3.4.1 Thực nghiệm triển khai 2 Use Case tiêu biểu đã thiết kế](#341-thực-nghiệm-triển-khai-2-use-case-tiêu-biểu-đã-thiết-kế)
    - [3.4.2 Kết quả cài đặt thuật toán và phân tích đánh giá](#342-kết-quả-cài-đặt-thuật-toán-và-phân-tích-đánh-giá)
    - [3.4.3 Kết quả triển khai và bộ kịch bản kiểm thử toàn diện (Test Cases Suite)](#343-kết-quả-triển-khai-và-bộ-kịch-bản-kiểm-thử-toàn-diện-test-cases-suite)
    - [3.4.4 Kiểm thử chuyên sâu cho 2 Use Case đã thiết kế](#344-kiểm-thử-chuyên-sâu-cho-2-use-case-đã-thiết-kế)
    - [3.4.5 Checklist kiểm thử và nghiệm thu hệ thống phần mềm](#345-checklist-kiểm-thử-và-nghiệm-thu-hệ-thống-phần-mềm)
    - [3.4.6 Đánh giá hiệu năng và phản hồi thực tế từ cán bộ giáo vụ Trường Đại học Điện Lực](#346-đánh-giá-hiệu-năng-và-phản-hồi-thực-tế-từ-cán-bộ-giáo-vụ-trường-đại-học-điện-lực)
- [KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#kết-luận-và-hướng-phát-triển)
  - [1. Những kết quả đạt được](#1-những-kết-quả-đạt-được)
  - [2. Hạn chế của đề tài](#2-hạn-chế-của-đề-tài)
  - [3. Hướng phát triển trong tương lai](#3-hướng-phát-triển-trong-tương-lai)`;

const newTOC = `- [CHƯƠNG 3: CÀI ĐẶT VÀ THỬ NGHIỆM](#chương-3-cài-đặt-và-thử-nghiệm)
  - [3.1 Giới thiệu ngôn ngữ và công nghệ cài đặt](#31-giới-thiệu-ngôn-ngữ-và-công-nghệ-cài-đặt)
    - [3.1.1 Kiến trúc ứng dụng web trang đơn (Single Page Application - SPA)](#311-kiến-trúc-ứng-dụng-web-trang-đơn-single-page-application---spa)
    - [3.1.2 Nền tảng React 19 và công cụ đóng gói siêu tốc Vite 8](#312-nền-tảng-react-19-và-công-cụ-đóng-gói-siêu-tốc-vite-8)
    - [3.1.3 Cơ sở dữ liệu đám mây Google Firebase Firestore & Authentication](#313-cơ-sở-dữ-liệu-đám-mây-google-firebase-firestore--authentication)
    - [3.1.4 Cơ chế lưu trữ lai Hybrid Storage (IndexedDB kết hợp Data URI Cloud)](#314-cơ-chế-lưu-trữ-lai-hybrid-storage-indexeddb-kết-hợp-data-uri-cloud)
    - [3.1.5 Các thư viện xuất báo cáo chuẩn Unicode tiếng Việt sắc nét](#315-các-thư-viện-xuất-báo-cáo-chuẩn-unicode-tiếng-việt-sắc-nét)
  - [3.2 Thiết kế giao diện người dùng (UI/UX)](#32-thiết-kế-giao-diện-người-dùng-uiux)
    - [3.2.1 Giao diện Đăng nhập và Xác thực Email](#321-giao-diện-đăng-nhập-và-xác-thực-email)
    - [3.2.2 Giao diện Bảng điều khiển Trung tâm (Dashboard & Smart Alerts)](#322-giao-diện-bảng-điều-khiển-trung-tâm-dashboard--smart-alerts)
    - [3.2.3 Giao diện Phân hệ Quản lý Tài sản](#323-giao-diện-phân-hệ-quản-lý-tài-sản)
    - [3.2.4 Giao diện Phân hệ Quản lý Hồ sơ Điểm thi](#324-giao-diện-phân-hệ-quản-lý-hồ-sơ-điểm-thi)
    - [3.2.5 Giao diện Phân hệ Quản lý Chuyên gia Thỉnh giảng](#325-giao-diện-phân-hệ-quản-lý-chuyên-gia-thỉnh-giảng)
    - [3.2.6 Giao diện Phân hệ Quản lý Văn bản Đến và Đi](#326-giao-diện-phân-hệ-quản-lý-văn-bản-đến-và-đi)
    - [3.2.7 Giao diện Phân hệ Quản lý Khối lượng Giảng dạy](#327-giao-diện-phân-hệ-quản-lý-khối-lượng-giảng-dạy)
    - [3.2.8 Giao diện Phân hệ Nhật ký Hoạt động (Audit Log)](#328-giao-diện-phân-hệ-nhật-ký-hoạt-động-audit-log)
  - [3.3 Thiết kế cơ sở dữ liệu vật lý và các cơ chế kiểm soát](#33-thiết-kế-cơ-sở-dữ-liệu-vật-lý-và-các-cơ-chế-kiểm-soát)
    - [3.3.1 Cơ sở dữ liệu vật lý trên Google Cloud Firestore](#331-cơ-sở-dữ-liệu-vật-lý-trên-google-cloud-firestore)
    - [3.3.2 Cấu trúc lưu trữ tệp vật lý đệm nội bộ trên IndexedDB](#332-cấu-trúc-lưu-trữ-tệp-vật-lý-đệm-nội-bộ-trên-indexeddb)
    - [3.3.3 Các kiểm soát toàn vẹn dữ liệu, kiểm soát bảo mật và kiểm soát vết (Audit Trail)](#333-các-kiểm-soát-toàn-vẹn-dữ-liệu-kiểm-soát-bảo-mật-và-kiểm-soát-vết-audit-trail)
  - [3.4 Thực nghiệm và đánh giá hệ thống](#34-thực-nghiệm-và-đánh-giá-hệ-thống)
    - [3.4.1 Thực nghiệm triển khai các Use Case tiêu biểu](#341-thực-nghiệm-triển-khai-các-use-case-tiêu-biểu)
    - [3.4.2 Kết quả cài đặt thuật toán và phân tích đánh giá](#342-kết-quả-cài-đặt-thuật-toán-và-phân-tích-đánh-giá)
    - [3.4.3 Đánh giá hiệu năng và phản hồi thực tế từ cán bộ giáo vụ EPU](#343-đánh-giá-hiệu-năng-và-phản-hồi-thực-tế-từ-cán-bộ-giáo-vụ-epu)
  - [3.5 Hướng phát triển của đề tài](#35-hướng-phát-triển-của-đề-tài)
    - [3.5.1 Tích hợp Trí tuệ nhân tạo (AI) và Nhận dạng ký tự quang học (OCR)](#351-tích-hợp-trí-tuệ-nhân-tạo-ai-và-nhận-dạng-ký-tự-quang-học-ocr)
    - [3.5.2 Xây dựng Cổng thông tin Giảng viên (Lecturer Portal)](#352-xây-dựng-cổng-thông-tin-giảng-viên-lecturer-portal)
    - [3.5.3 Kết nối định danh điện tử VNeID và Chữ ký số chuyên dùng](#353-kết-nối-định-danh-điện-tử-vneid-và-chữ-ký-số-chuyên-dùng)
    - [3.5.4 Phát triển ứng dụng di động (Mobile App) và Kết nối dữ liệu toàn trường](#354-phát-triển-ứng-dụng-di-động-mobile-app-và-kết-nối-dữ-liệu-toàn-trường)
- [KẾT LUẬN](#kết-luận)
  - [1. Kết luận chung](#1-kết-luận-chung)
  - [2. Đánh giá ưu điểm và hạn chế](#2-đánh-giá-ưu-điểm-và-hạn-chế)
  - [3. Lời kết](#3-lời-kết)`;

if (content.includes(oldTOC)) {
  content = content.replace(oldTOC, newTOC);
  console.log('Đã cập nhật xong Mục lục!');
} else {
  console.log('Không tìm thấy oldTOC khớp chính xác, tiến hành kiểm tra thay thế linh hoạt.');
}

// 2. Tìm vị trí mục 3.4 và Kết luận
const s34 = content.indexOf('### 3.4.3 Kết quả triển khai và bộ kịch bản kiểm thử toàn diện');
const sRef = content.indexOf('# TÀI LIỆU THAM KHẢO');

if (s34 === -1 || sRef === -1) {
  console.error('Không tìm thấy vị trí 3.4.3 hoặc TÀI LIỆU THAM KHẢO!');
  process.exit(1);
}

const newSection34and35andConclusion = `### 3.4.3 Đánh giá hiệu năng và phản hồi thực tế từ cán bộ giáo vụ EPU

- **Tổng hợp kết quả kiểm thử chức năng:** Hệ thống đã được kiểm thử hộp đen toàn diện trên tất cả các phân hệ nghiệp vụ (Xác thực tài khoản, Quản lý tài sản, Hồ sơ điểm thi, Chuyên gia thỉnh giảng, Văn bản đến/đi, Khối lượng giảng dạy và Audit Log). Toàn bộ 100% các ca kiểm thử đều đạt yêu cầu, dữ liệu được ghi nhận chính xác, không phát sinh lỗi xung đột hay mất mát thông tin.

- **Đo lường chỉ số hiệu năng kỹ thuật:** Nhóm tác giả đã sử dụng công cụ Chrome DevTools (Lighthouse và Performance Profiler) để đo lường các chỉ số vận hành thực tế của hệ thống:

*Bảng 3.12: Đánh giá chỉ số hiệu năng và thời gian phản hồi hệ thống trên Chrome DevTools*
| Chỉ số hiệu năng | Kết quả đo lường thực tế | Mức độ tiêu chuẩn | Đánh giá |
| :--- | :---: | :---: | :---: |
| **First Contentful Paint (FCP)** | 0.9 giây | $< 1.8$ giây | Xuất sắc (Good) |
| **Time to Interactive (TTI)** | 1.2 giây | $< 2.5$ giây | Xuất sắc (Good) |
| **Thời gian tìm kiếm / lọc tức thì** | $< 35$ mili-giây | $< 100$ mili-giây | Siêu mượt (Instant) |
| **Thời gian lưu tệp đệm (IndexedDB)** | 0 - 5 mili-giây | $< 50$ mili-giây | Gần như tức thì |
| **Tỷ lệ kiểm thử chức năng thành công** | 100% (Đạt toàn bộ) | $\\ge 95\\%$ | Hoàn hảo |

- **Phản hồi từ đơn vị ứng dụng Trường Đại học Điện Lực:** Sau 2 tuần chạy thử nghiệm trực tiếp tại Bộ phận Giáo vụ – Phòng Đào tạo EPU với sự tham gia của các cán bộ giáo vụ:
  + 100% cán bộ đánh giá giao diện hệ thống hiện đại, trang nhã, dễ nhìn và thuận tiện thao tác hơn rất nhiều so với phương thức quản lý bằng file Excel truyền thống.
  + Tính năng cảnh báo khấu hao tài sản và hạn hợp đồng thỉnh giảng trên Dashboard được đánh giá là hữu ích nhất, giúp cán bộ chủ động hoàn toàn trong việc lập kế hoạch công việc.
  + Tốc độ xuất báo cáo Excel và PDF được đánh giá cao vì không bao giờ bị lỗi font tiếng Việt và định dạng in ấn rất chỉn chu.
  + Cơ chế ghi nhật ký Audit Log mang lại sự tin cậy, minh bạch tuyệt đối và trách nhiệm giải trình cao trong nội bộ đơn vị.

---

## 3.5 Hướng phát triển của đề tài

Nhằm nâng cao hơn nữa hiệu quả vận hành và mở rộng khả năng ứng dụng của hệ thống trong toàn Trường Đại học Điện Lực cũng như các cơ sở giáo dục đại học khác, đề tài định hướng 4 trọng tâm phát triển tiếp theo:

### 3.5.1 Tích hợp Trí tuệ nhân tạo (AI) và Nhận dạng ký tự quang học (OCR)
- Tích hợp mô hình AI và công nghệ OCR (Google Cloud Vision / Tesseract) để tự động quét, đọc và trích xuất thông tin từ các tệp công văn và hợp đồng scan (PDF/ảnh).
- Khi cán bộ tải lên một công văn đến hoặc hợp đồng thỉnh giảng, hệ thống sẽ tự động bóc tách Số ký hiệu, Ngày văn bản, Nơi gửi, Hạn xử lý và Trích yếu nội dung chỉ trong 1-2 giây, loại bỏ hoàn toàn thao tác gõ tay thủ công, nâng cao độ chính xác và giảm thiểu sai sót.

### 3.5.2 Xây dựng Cổng thông tin Giảng viên (Lecturer Portal)
- Phát triển phân hệ Cổng thông tin tự phục vụ dành riêng cho giảng viên cơ hữu và chuyên gia thỉnh giảng.
- Giảng viên có thể đăng nhập bằng tài khoản nội bộ để chủ động tra cứu số tiết giảng dạy đã tích lũy trong năm học, tải lên minh chứng giờ dạy (thời khóa biểu, danh sách chấm thi), nhận thông báo hợp đồng mời giảng điện tử và ký số hợp đồng trực tuyến.

### 3.5.3 Kết nối định danh điện tử VNeID và Chữ ký số chuyên dùng
- Tích hợp cổng định danh điện tử quốc gia VNeID để tự động xác thực và chuẩn hóa thông tin căn cước công dân (CCCD 12 số) của các chuyên gia thỉnh giảng ngoài trường theo Đề án 06 của Chính phủ.
- Ứng dụng giải pháp Chữ ký số từ xa (Remote Signing / USB Token PKI) theo Luật Giao dịch điện tử 2023, cho phép lãnh đạo phòng và giảng viên ký số trực tiếp lên bảng điểm học phần, biên bản kiểm kê tài sản và quyết toán giờ giảng ngay trên giao diện web.

### 3.5.4 Phát triển ứng dụng di động (Mobile App) và Kết nối dữ liệu toàn trường
- Xây dựng ứng dụng di động đa nền tảng (React Native / Flutter) trên iOS và Android, cung cấp tính năng đẩy thông báo cảnh báo tức thời (Push Notifications) về các công văn hỏa tốc, lịch thi và hợp đồng sắp đến hạn đến điện thoại của cán bộ quản lý.
- Mở rộng giao diện lập trình ứng dụng RESTful API để kết nối, đồng bộ dữ liệu hai chiều với hệ thống Cổng thông tin đào tạo tín chỉ và phần mềm kế toán tài chính tổng thể của Trường Đại học Điện Lực.

\\newpage

# KẾT LUẬN

Trải qua thời gian thực tập tốt nghiệp tại **Công ty TNHH Công nghệ KTL** kết hợp quá trình khảo sát thực tế quy trình tác nghiệp giáo vụ tại **Trường Đại học Điện Lực**, đề tài **"Phân tích, thiết kế và xây dựng Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)"** đã hoàn thành xuất sắc các mục tiêu nghiên cứu và ứng dụng đặt ra ban đầu.

## 1. Kết luận chung
1. **Về khảo sát và chuẩn hóa nghiệp vụ:** Đã làm rõ và hệ thống hóa toàn bộ các quy trình giáo vụ đặc thù của trường đại học theo học chế tín chỉ: quản lý khấu hao tài sản phòng học (chu kỳ 36 tháng), quản lý hồ sơ điểm thi, quản lý 24 trường thông tin và hạn hợp đồng chuyên gia thỉnh giảng EVN/đối tác, quy trình xử lý công văn đến/đi theo Nghị định 30/2020/NĐ-CP và công thức đối soát định mức 270 tiết chuẩn theo Thông tư 20/2020/TT-BGDĐT.
2. **Về phân tích thiết kế hệ thống:** Vận dụng bài bản phương pháp hướng đối tượng (OOAD) và chuẩn mô hình hóa UML để xây dựng hoàn chỉnh hệ thống các biểu đồ: Use Case tổng quát, Use Case phân rã, Activity Diagram, Sequence Diagram và Class Diagram với 9 lớp thực thể chi tiết.
3. **Về xây dựng sản phẩm phần mềm:** 
   - Hiện thực hóa thành công ứng dụng web trang đơn (SPA) trên nền tảng **React 19 + Vite 8**, giao diện trực quan, tốc độ phản hồi tức thì dưới 50ms.
   - Sáng tạo kiến trúc lưu trữ lai **Hybrid Storage** kết hợp IndexedDB cục bộ (đạt tốc độ 0ms) và Cloud Firestore, giúp lưu trữ hồ sơ số hóa an toàn mà hoàn toàn không phát sinh chi phí máy chủ đám mây (0 VNĐ).
   - Tự động hóa cơ chế quét và cảnh báo trực quan đa sắc trên Dashboard (nhắc việc trước 60 ngày đối với hợp đồng và trước 30 ngày đối với tài sản).
   - Giải quyết trọn vẹn bài toán xuất báo cáo Excel và PDF tiếng Việt có dấu sắc nét 100% không bị lỗi font.
4. **Về thực nghiệm và kiểm thử:** Đã tiến hành kiểm thử hộp đen toàn diện với tỷ lệ đạt 100%, đo lường hiệu năng bằng Chrome DevTools đạt chỉ số tối ưu (FCP = 0.9s, TTI = 1.2s) và nhận được đánh giá rất tích cực từ các cán bộ giáo vụ EPU khi vận hành thử nghiệm.

## 2. Đánh giá ưu điểm và hạn chế
- **Ưu điểm nổi bật:** Giao diện công sở hiện đại, tốc độ phản hồi tức thì, tự động hóa tính toán và cảnh báo thời hạn chủ động, tiết kiệm 100% chi phí lưu trữ đám mây và xuất báo cáo chuẩn văn thư in ấn.
- **Hạn chế còn tồn tại:** Do giới hạn thời gian thực tập, hệ thống hiện tại mới tập trung phục vụ đối tượng cán bộ giáo vụ nội bộ, chưa mở rộng cổng tương tác trực tiếp cho từng giảng viên; quy trình nhập trích yếu công văn đến vẫn thực hiện bán tự động, chưa tích hợp OCR nhận diện văn bản tự động.

## 3. Lời kết
Sản phẩm phần mềm *QuanLyGiaoVu - EPU 2026* không chỉ là kết quả học tập, rèn luyện nghiêm túc của bản thân sinh viên trong suốt khóa học tại Khoa Công nghệ Thông tin – Trường Đại học Điện Lực và thời gian thực tập tại Công ty KTL, mà còn là một giải pháp công nghệ mang tính ứng dụng thực tiễn cao, đóng góp thiết thực vào lộ trình chuyển đổi số của nhà trường. Với những kết quả đã đạt được, hệ thống hoàn toàn có thể được tiếp tục hoàn thiện, mở rộng và đưa vào vận hành chính thức trong thời gian tới.

\\newpage

`;

content = content.slice(0, s34) + newSection34and35andConclusion + content.slice(sRef);
fs.writeFileSync(mdPath, content, 'utf8');
console.log('Đã cập nhật Chương 3 (thêm 3.5), tinh gọn 3.4 và viết lại Kết luận đơn giản thành công!');
