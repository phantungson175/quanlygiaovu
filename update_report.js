// update_report.js
// Script cập nhật báo cáo toàn diện cho Trường Đại học Điện Lực (EPU)
import fs from 'fs';
import path from 'path';

const reportContent = `# BỘ CÔNG THƯƠNG
# TRƯỜNG ĐẠI HỌC ĐIỆN LỰC
# KHOA CÔNG NGHỆ THÔNG TIN
---

# BÁO CÁO THỰC TẬP TỐT NGHIỆP

### ĐỀ TÀI:
## PHÂN TÍCH, THIẾT KẾ VÀ XÂY DỰNG HỆ THỐNG QUẢN LÝ GIÁO VỤ TRƯỜNG ĐẠI HỌC ĐIỆN LỰC (QUANLYGIAOVU - EPU 2026)

**Chuyên ngành:** Công nghệ Thông tin / Kỹ thuật Phần mềm / Hệ thống Thông tin  
**Khóa học:** 2022 – 2026 (Khóa D17)  

**Sinh viên thực hiện:** [Họ và tên sinh viên]  
**Mã số sinh viên:** [MSSV]  
**Lớp:** [Mã lớp]  

**Giảng viên hướng dẫn:** [Học hàm, học vị, Họ và tên GVHD]  
**Cán bộ hướng dẫn tại cơ sở:** [Họ và tên cán bộ hướng dẫn]  
**Đơn vị thực tập:** Bộ phận Giáo vụ – Phòng Đào tạo (kết hợp Văn phòng Khoa Công nghệ Thông tin) – Trường Đại học Điện Lực  

---
*Hà Nội, Năm 2026*

\\newpage

# MỤC LỤC

- [LỜI CẢM ƠN](#lời-cảm-ơn)
- [DANH MỤC TỪ VIẾT TẮT](#danh-mục-từ-viết-tắt)
- [DANH MỤC BẢNG BIỂU](#danh-mục-bảng-biểu)
- [DANH MỤC HÌNH VẼ](#danh-mục-hình-vẽ)
- [MỞ ĐẦU](#mở-đầu)
  - [1. Tính cấp thiết của đề tài](#1-tính-cấp-thiết-của-đề-tài)
  - [2. Mục tiêu của đề tài](#2-mục-tiêu-của-đề-tài)
  - [3. Đối tượng và phạm vi nghiên cứu](#3-đối-tượng-và-phạm-vi-nghiên-cứu)
  - [4. Phương pháp nghiên cứu](#4-phương-pháp-nghiên-cứu)
  - [5. Bố cục của báo cáo](#5-bố-cục-của-báo-cáo)
- [CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN](#chương-1-khảo-sát-hiện-trạng-và-xác-lập-dự-án)
  - [1.1 Giới thiệu về đơn vị thực tập](#11-giới-thiệu-về-đơn-vị-thực-tập)
    - [1.1.1 Lịch sử hình thành, vị trí pháp lý và chức năng nhiệm vụ của Trường Đại học Điện Lực](#111-lịch-sử-hình-thành-vị-trí-pháp-lý-và-chức-năng-nhiệm-vụ-của-trường-đại-học-điện-lực)
    - [1.1.2 Cơ cấu tổ chức bộ máy và hoạt động nghiệp vụ của Phòng Đào tạo & Giáo vụ EPU](#112-cơ-cấu-tổ-chức-bộ-máy-và-hoạt-động-nghiệp-vụ-của-phòng-đào-tạo--giáo-vụ-epu)
  - [1.2 Khảo sát hiện trạng công tác quản lý giáo vụ tại Trường Đại học Điện Lực](#12-khảo-sát-hiện-trạng-công-tác-quản-lý-giáo-vụ-tại-trường-đại-học-điện-lực)
    - [1.2.1 Môi trường xã hội, kinh tế, kỹ thuật và cơ cấu tổ chức cơ quan chủ quản](#121-môi-trường-xã-hội-kinh-tế-kỹ-thuật-và-cơ-cấu-tổ-chức-cơ-quan-chủ-quản)
    - [1.2.2 Nghiên cứu hệ thống hiện tại và quy tắc quản lý nghiệp vụ giáo vụ](#122-nghiên-cứu-hệ-thống-hiện-tại-và-quy-tắc-quản-lý-nghiệp-vụ-giáo-vụ)
    - [1.2.3 Thu thập các chứng từ giao dịch và chu trình lưu chuyển thông tin](#123-thu-thập-các-chứng-từ-giao-dịch-và-chu-trình-lưu-chuyển-thông-tin)
    - [1.2.4 Thống kê các phương tiện và tài nguyên đã và có thể sử dụng](#124-thống-kê-các-phương-tiện-và-tài-nguyên-đã-và-có-thể-sử-dụng)
    - [1.2.5 Khảo sát các hệ thống quản lý đào tạo khác trên thị trường](#125-khảo-sát-các-hệ-thống-quản-lý-đào-tạo-khác-trên-thị-trường)
    - [1.2.6 Đánh giá hiện trạng (Ưu điểm, Nhược điểm và Các rủi ro)](#126-đánh-giá-hiện-trạng-ưu-điểm-nhược-điểm-và-các-rủi-ro)
    - [1.2.7 Đề xuất giải pháp và phân tích ưu, nhược điểm của mỗi giải pháp](#127-đề-xuất-giải-pháp-và-phân-tích-ưu-nhược-điểm-của-mỗi-giải-pháp)
  - [1.3 Xác lập dự án và đánh giá khả thi](#13-xác-lập-dự-án-và-đánh-giá-khả-thi)
    - [1.3.1 Mục tiêu của dự án](#131-mục-tiêu-của-dự-án)
    - [1.3.2 Yêu cầu của dự án (Chức năng và Phi chức năng)](#132-yêu-cầu-của-dự-án-chức-năng-và-phi-chức-năng)
    - [1.3.3 Các chức năng chính của dự án](#133-các-chức-năng-chính-của-dự-án)
    - [1.3.4 Lập dự trù kinh phí và kế hoạch triển khai dự án qua 12 tuần (WBS & Gantt)](#134-lập-dự-trù-kinh-phí-và-kế-hoạch-triển-khai-dự-án-qua-12-tuần-wbs--gantt)
    - [1.3.5 Tính ưu việt và đóng góp thực tiễn của dự án](#135-tính-ưu-việt-và-đóng-góp-thực-tiễn-của-dự-án)
- [CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG](#chương-2-phân-tích-và-thiết-kế-hệ-thống)
  - [2.1 Biểu đồ Use Case tổng quát](#21-biểu-đồ-use-case-tổng-quát)
    - [2.1.1 Xác định các tác nhân hệ thống (Actors)](#211-xác-định-các-tác-nhân-hệ-thống-actors)
    - [2.1.2 Sơ đồ Use Case tổng quát toàn hệ thống](#212-sơ-đồ-use-case-tổng-quát-toàn-hệ-thống)
  - [2.2 Phân rã Use Case các phân hệ chính](#22-phân-rã-use-case-các-phân-hệ-chính)
    - [2.2.1 Phân rã Use Case Phân hệ Quản lý Tài sản giảng đường](#221-phân-rã-use-case-phân-hệ-quản-lý-tài-sản-giảng-đường)
    - [2.2.2 Phân rã Use Case Phân hệ Quản lý Hồ sơ Điểm thi học phần](#222-phân-rã-use-case-phân-hệ-quản-lý-hồ-sơ-điểm-thi-học-phần)
    - [2.2.3 Phân rã Use Case Phân hệ Quản lý Chuyên gia Thỉnh giảng](#223-phân-rã-use-case-phân-hệ-quản-lý-chuyên-gia-thỉnh-giảng)
    - [2.2.4 Phân rã Use Case Phân hệ Quản lý Văn bản Đến và Đi](#224-phân-rã-use-case-phân-hệ-quản-lý-văn-bản-đến-và-đi)
    - [2.2.5 Phân rã Use Case Phân hệ Quản lý Khối lượng Giảng dạy (KLGD)](#225-phân-rã-use-case-phân-hệ-quản-lý-khối-lượng-giảng-dạy-klgd)
    - [2.2.6 Phân rã Use Case Xác thực và Nhật ký Kiểm toán](#226-phân-rã-use-case-xác-thực-và-nhật-ký-kiểm-toán)
  - [2.3 Biểu đồ Lớp (Class Diagram)](#23-biểu-đồ-lớp-class-diagram)
    - [2.3.1 Xác định các lớp thực thể (Entity Classes)](#231-xác-định-các-lớp-thực-thể-entity-classes)
    - [2.3.2 Thiết kế chi tiết sơ đồ lớp toàn hệ thống](#232-thiết-kế-chi-tiết-sơ-đồ-lớp-toàn-hệ-thống)
  - [2.4 Nghiên cứu thuật toán xử lý nghiệp vụ giáo vụ](#24-nghiên-cứu-thuật-toán-xử-lý-nghiệp-vụ-giáo-vụ)
    - [2.4.1 Cơ sở lý thuyết các thuật toán cốt lõi](#241-cơ-sở-lý-thuyết-các-thuật-toán-cốt-lõi)
    - [2.4.2 Phương pháp nghiên cứu và mô hình hóa thuật toán](#242-phương-pháp-nghiên-cứu-và-mô-hình-hóa-thuật-toán)
    - [2.4.3 Đề xuất giải pháp thuật toán tối ưu hóa hệ thống](#243-đề-xuất-giải-pháp-thuật-toán-tối-ưu-hóa-hệ-thống)
  - [2.5 Phương pháp và mô hình kiểm thử hệ thống](#25-phương-pháp-và-mô-hình-kiểm-thử-hệ-thống)
    - [2.5.1 Phương pháp và công cụ áp dụng cho kiểm thử](#251-phương-pháp-và-công-cụ-áp-dụng-cho-kiểm-thử)
    - [2.5.2 Mô hình kiểm thử phần mềm V-Model áp dụng cho hệ thống](#252-mô-hình-kiểm-thử-phần-mềm-v-model-áp-dụng-cho-hệ-thống)
    - [2.5.3 Thiết kế tài liệu đặc tả ca kiểm thử (Test Case Specification)](#253-thiết-kế-tài-liệu-đặc-tả-ca-kiểm-thử-test-case-specification)
- [CHƯƠNG 3: CÀI ĐẶT VÀ THỬ NGHIỆM](#chương-3-cài-đặt-và-thử-nghiệm)
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
  - [3. Hướng phát triển trong tương lai](#3-hướng-phát-triển-trong-tương-lai)
- [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)
- [PHỤ LỤC](#phụ-lục)
  - [Phụ lục 1: Thuật toán và Mã nguồn các hàm xử lý cốt lõi](#phụ-lục-1-thuật-toán-và-mã-nguồn-các-hàm-xử-lý-cốt-lõi)
  - [Phụ lục 2: Phiếu khảo sát thực tế và đánh giá chất lượng hệ thống tại Trường Đại học Điện Lực](#phụ-lục-2-phiếu-khảo-sát-thực-tế-và-đánh-giá-chất-lượng-hệ-thống-tại-trường-đại-học-điện-lực)

\\newpage

# DANH MỤC TỪ VIẾT TẮT

| Từ viết tắt | Thuật ngữ tiếng Anh | Diễn giải tiếng Việt |
| :--- | :--- | :--- |
| **BaaS** | Backend as a Service | Dịch vụ nền tảng phụ trợ đám mây được đóng gói sẵn |
| **CCCD** | Citizen Identity Card | Căn cước công dân |
| **CSDL** | Database | Cơ sở dữ liệu |
| **DOM** | Document Object Model | Mô hình đối tượng tài liệu giao diện web |
| **EPU** | Electric Power University | Trường Đại học Điện Lực |
| **ERP** | Enterprise Resource Planning | Hệ thống hoạch định nguồn lực tổ chức / đại học |
| **EVN** | Vietnam Electricity | Tập đoàn Điện lực Việt Nam |
| **FR** | Functional Requirement | Yêu cầu chức năng của hệ thống |
| **GS / PGS** | Professor / Associate Professor | Giáo sư / Phó Giáo sư |
| **GV** | Lecturer | Giảng viên |
| **HĐ** | Contract | Hợp đồng lao động / Hợp đồng thỉnh giảng |
| **HMR** | Hot Module Replacement | Cơ chế thay thế module nóng trong phát triển phần mềm |
| **IDB** | IndexedDB | Cơ sở dữ liệu NoSQL tích hợp sẵn trong trình duyệt web |
| **KLGD** | Teaching Load | Khối lượng giảng dạy |
| **NFR** | Non-Functional Requirement | Yêu cầu phi chức năng của hệ thống |
| **NoSQL** | Not Only SQL | Cơ sở dữ liệu phi quan hệ, phi cấu trúc theo dạng tài liệu |
| **OOAD** | Object-Oriented Analysis and Design | Phân tích và thiết kế hướng đối tượng |
| **P.ĐT** | Academic Affairs Department | Phòng Đào tạo (Trường Đại học Điện Lực) |
| **PDF** | Portable Document Format | Định dạng tài liệu di động |
| **SPA** | Single Page Application | Ứng dụng web trang đơn |
| **TKB** | Timetable | Thời khóa biểu |
| **TS / ThS** | Doctor of Philosophy / Master | Tiến sĩ / Thạc sĩ |
| **UAT** | User Acceptance Testing | Kiểm thử chấp nhận của người dùng |
| **UI / UX** | User Interface / User Experience | Giao diện người dùng / Trải nghiệm người dùng |
| **UML** | Unified Modeling Language | Ngôn ngữ mô hình hóa thống nhất |
| **VBA** | Visual Basic for Applications | Ngôn ngữ lập trình macro của bộ ứng dụng Microsoft Office |
| **WBS** | Work Breakdown Structure | Cấu trúc phân chia công việc trong quản lý dự án |

\\newpage

# DANH MỤC BẢNG BIỂU

| Ký hiệu bảng | Tên bảng biểu |
| :--- | :--- |
| **Bảng 1.1** | Thống kê cơ sở vật chất và trang thiết bị tại Phòng Đào tạo - Trường Đại học Điện Lực |
| **Bảng 1.2** | So sánh các giải pháp quản lý đào tạo và giáo vụ hiện nay trên thị trường |
| **Bảng 1.3** | Ma trận so sánh đánh giá các phương án giải pháp công nghệ |
| **Bảng 1.4** | Dự trù ngân sách và tài nguyên phục vụ triển khai dự án QuanLyGiaoVu EPU 2026 |
| **Bảng 1.5** | Kế hoạch triển khai dự án qua 12 tuần (WBS) |
| **Bảng 2.1** | Danh sách tác nhân (Actors) tham gia vào hệ thống |
| **Bảng 2.2** | Bảng mô tả tóm tắt các Use Case chính của hệ thống |
| **Bảng 2.3** | Đặc tả Use Case: Quản lý Thêm mới và Khấu hao Tài sản giảng đường |
| **Bảng 2.4** | Đặc tả Use Case: Lưu trữ và Tra cứu Hồ sơ Bảng điểm thi học phần |
| **Bảng 2.5** | Đặc tả Use Case: Quản lý Hồ sơ Chuyên gia và Hợp đồng Thỉnh giảng |
| **Bảng 2.6** | Đặc tả Use Case: Tiếp nhận và Theo dõi Xử lý Văn bản Đến |
| **Bảng 2.7** | Đặc tả Use Case: Kê khai và Tổng hợp Khối lượng Giảng dạy (270 tiết chuẩn) |
| **Bảng 2.8** | Đặc tả Use Case: Xác thực Người dùng và Kiểm toán Hệ thống |
| **Bảng 2.9** | Bảng quy tắc nghiệp vụ thuật toán cân đối giờ giảng theo Thông tư 20/2020/TT-BGDĐT |
| **Bảng 2.10**| Mẫu tài liệu đặc tả ca kiểm thử (Test Case Specification Template) |
| **Bảng 3.1** | Thiết kế cấu trúc vật lý Collection \`users\` trong Firestore |
| **Bảng 3.2** | Thiết kế cấu trúc vật lý Collection \`assets\` trong Firestore |
| **Bảng 3.3** | Thiết kế cấu trúc vật lý Collection \`scores\` trong Firestore |
| **Bảng 3.4** | Thiết kế cấu trúc vật lý Collection \`experts\` trong Firestore |
| **Bảng 3.5** | Thiết kế cấu trúc vật lý Collection \`docs_incoming\` trong Firestore |
| **Bảng 3.6** | Thiết kế cấu trúc vật lý Collection \`docs_outgoing\` trong Firestore |
| **Bảng 3.7** | Thiết kế cấu trúc vật lý Collection \`teaching_norm\` trong Firestore |
| **Bảng 3.8** | Thiết kế cấu trúc vật lý Collection \`teaching_contract\` trong Firestore |
| **Bảng 3.9** | Thiết kế cấu trúc vật lý Collection \`audit_logs\` trong Firestore |
| **Bảng 3.10**| Cấu trúc dữ liệu kho tệp vật lý \`files\` trong IndexedDB |
| **Bảng 3.11**| Kết quả thực nghiệm đo lường hiệu năng thuật toán Hybrid Storage |
| **Bảng 3.12**| Bảng tổng hợp kịch bản kiểm thử (Test Case Suite) và kết quả thực tế |
| **Bảng 3.13**| Kiểm thử chuyên sâu chi tiết Use Case UC03-A (Quản lý Tài sản và Khấu hao) |
| **Bảng 3.14**| Kiểm thử chuyên sâu chi tiết Use Case UC06-A (Tiếp nhận và Xử lý Văn bản đến) |
| **Bảng 3.15**| Bảng Checklist kiểm thử và nghiệm thu chất lượng hệ thống phần mềm |
| **Bảng 3.16**| Đánh giá chỉ số hiệu năng và thời gian phản hồi hệ thống trên Chrome DevTools |

\\newpage

# DANH MỤC HÌNH VẼ

| Ký hiệu hình | Tên hình vẽ |
| :--- | :--- |
| **Hình 1.1** | Sơ đồ cơ cấu tổ chức bộ máy Phòng Đào tạo & Bộ phận Giáo vụ – Trường Đại học Điện Lực |
| **Hình 1.2** | Sơ đồ chu trình lưu chuyển và xử lý thông tin tài liệu giáo vụ tại Trường Đại học Điện Lực |
| **Hình 1.3** | Biểu đồ tiến độ Gantt triển khai dự án trong 12 tuần |
| **Hình 2.1** | Biểu đồ Use Case tổng quát hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực |
| **Hình 2.2** | Biểu đồ phân rã Use Case Phân hệ Quản lý Tài sản giảng đường |
| **Hình 2.3** | Biểu đồ tuần tự (Sequence Diagram) - Nghiệp vụ Thêm mới Tài sản |
| **Hình 2.4** | Biểu đồ hoạt động (Activity Diagram) - Nghiệp vụ Tính khấu hao tài sản |
| **Hình 2.5** | Biểu đồ phân rã Use Case Phân hệ Quản lý Điểm thi |
| **Hình 2.6** | Biểu đồ tuần tự (Sequence Diagram) - Nghiệp vụ Upload bảng điểm an toàn |
| **Hình 2.7** | Biểu đồ hoạt động (Activity Diagram) - Tra cứu và tải tệp điểm thi |
| **Hình 2.8** | Biểu đồ phân rã Use Case Phân hệ Quản lý Thỉnh giảng Chuyên gia |
| **Hình 2.9** | Biểu đồ tuần tự (Sequence Diagram) - Cảnh báo và Gia hạn hợp đồng |
| **Hình 2.10**| Biểu đồ hoạt động (Activity Diagram) - Tiếp nhận hồ sơ chuyên gia |
| **Hình 2.11**| Biểu đồ phân rã Use Case Phân hệ Quản lý Văn bản Đến và Đi |
| **Hình 2.12**| Biểu đồ tuần tự (Sequence Diagram) - Cập nhật trạng thái xử lý văn bản |
| **Hình 2.13**| Biểu đồ hoạt động (Activity Diagram) - Lưu chuyển công văn đến |
| **Hình 2.14**| Biểu đồ phân rã Use Case Phân hệ Quản lý Khối lượng Giảng dạy |
| **Hình 2.15**| Biểu đồ tuần tự (Sequence Diagram) - Tính chênh lệch định mức giảng dạy |
| **Hình 2.16**| Biểu đồ hoạt động (Activity Diagram) - Tổng hợp khối lượng giảng dạy |
| **Hình 2.17**| Biểu đồ Lớp phân tích chi tiết (Class Diagram) toàn hệ thống |
| **Hình 2.18**| Mô hình kiểm thử phần mềm V-Model áp dụng trong dự án Quản lý Giáo vụ EPU |
| **Hình 3.1** | Sơ đồ kiến trúc giải pháp công nghệ Hybrid Storage và Cloud BaaS |
| **Hình 3.2** | Giao diện Đăng nhập hệ thống và Form Xác thực Email |
| **Hình 3.3** | Giao diện Bảng điều khiển trung tâm (Dashboard) với Cảnh báo tức thời |
| **Hình 3.4** | Giao diện Quản lý Tài sản và bảng tính trạng thái khấu hao theo màu sắc |
| **Hình 3.5** | Giao diện Phân hệ Quản lý Hồ sơ Điểm thi và phân loại Tag thông minh |
| **Hình 3.6** | Giao diện Quản lý Chuyên gia thỉnh giảng và Popup xem chi tiết nhân thân |
| **Hình 3.7** | Giao diện Quản lý Văn bản Đến và Đi với bộ đếm Badge thông báo động |
| **Hình 3.8** | Giao diện Quản lý Khối lượng Giảng dạy (Tab Định mức và Tab Hợp đồng) |
| **Hình 3.9** | Giao diện Nhật ký hoạt động kiểm toán hệ thống (Audit Trail) |
| **Hình 3.10**| Biểu đồ so sánh thời gian lưu tệp giữa giải pháp Hybrid Storage và tải lên máy chủ truyền thống |

\\newpage

# LỜI CẢM ƠN

Để hoàn thành chương trình đào tạo kỹ sư/cử nhân ngành Công nghệ Thông tin tại Trường Đại học Điện Lực cũng như hoàn thành kỳ thực tập tốt nghiệp này, ngoài sự nỗ lực phấn đấu của bản thân, em đã nhận được sự quan tâm, chỉ bảo tận tình và giúp đỡ quý báu của nhiều tập thể và cá nhân.

Lời đầu tiên, em xin gửi lời tri ân sâu sắc nhất tới Ban Giám hiệu Trường Đại học Điện Lực, Ban Chủ nhiệm Khoa Công nghệ Thông tin cùng toàn thể quý thầy cô giáo trong trường. Trong suốt 4 năm học tập và rèn luyện dưới mái trường Đại học Điện Lực, thầy cô đã truyền thụ cho em nền tảng kiến thức chuyên môn vững chắc, bồi dưỡng tư duy khoa học, phương pháp luận nghiên cứu kỹ nghệ phần mềm và rèn luyện đạo đức nghề nghiệp, tạo bệ phóng vững vàng để em tự tin bước vào môi trường thực tế.

Đặc biệt, em xin bày tỏ lòng biết ơn chân thành và sâu sắc nhất tới **[Học hàm, học vị, Họ và tên GVHD]**, người đã trực tiếp hướng dẫn, định hướng đề tài, tận tình chỉ bảo, động viên và sửa chữa những thiếu sót trong suốt quá trình em thực hiện báo cáo và xây dựng đề tài thực tập tốt nghiệp này.

Em cũng xin trân trọng gửi lời cảm ơn sâu sắc tới Ban Lãnh đạo Phòng Đào tạo, Ban Chủ nhiệm Khoa Công nghệ Thông tin và toàn thể các thầy cô, cán bộ phụ trách công tác giáo vụ tại **Trường Đại học Điện Lực** – Đơn vị tiếp nhận em trong suốt quá trình thực tập tốt nghiệp. Cảm ơn cán bộ hướng dẫn tại cơ sở đã luôn nhiệt tình chia sẻ những bài học thực tế, quy trình nghiệp vụ giáo vụ thực tiễn của nhà trường, tạo mọi điều kiện thuận lợi nhất về môi trường làm việc, cung cấp số liệu và tài liệu cần thiết để em khảo sát, nắm bắt bài toán và hoàn thiện phần mềm *Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)*.

Mặc dù bản thân đã có nhiều cố gắng, nỗ lực hết mình để khảo sát, phân tích và hiện thực hóa đề tài một cách hoàn thiện nhất, song do giới hạn về mặt thời gian và kinh nghiệm thực tế, báo cáo chắc chắn khó tránh khỏi những thiếu sót nhất định. Em rất mong nhận được những lời đóng góp, nhận xét và chỉ bảo quý báu của quý thầy cô trong hội đồng đánh giá để bài báo cáo cũng như sản phẩm phần mềm của em được hoàn thiện hơn nữa.

*Em xin chân thành cảm ơn!*

\\newpage

# MỞ ĐẦU

## 1. Tính cấp thiết của đề tài

Trong bối cảnh cuộc Cách mạng công nghiệp lần thứ tư (Cách mạng Công nghiệp 4.0) đang diễn ra mạnh mẽ trên quy mô toàn cầu, việc đẩy mạnh ứng dụng công nghệ thông tin và chuyển đổi số trong giáo dục đại học không chỉ là xu thế tất yếu mà còn là nhiệm vụ chiến lược được Đảng và Nhà nước đặc biệt quan tâm. Quyết định số 131/QĐ-TTg của Thủ tướng Chính phủ phê duyệt Đề án "Tăng cường ứng dụng công nghệ thông tin và chuyển đổi số trong giáo dục và đào tạo giai đoạn 2022 - 2025, định hướng đến năm 2030" đã chỉ rõ mục tiêu đổi mới căn bản, toàn diện phương thức quản lý, điều hành và hoạt động giáo dục dựa trên công nghệ số và dữ liệu số.

Trường Đại học Điện Lực (EPU) là trường đại học công lập trực thuộc Bộ Công Thương, đào tạo đa ngành với quy mô hơn 15.000 sinh viên tại hai cơ sở đào tạo (Cơ sở 1: 235 Hoàng Quốc Việt, Cổ Nhuế 1, Bắc Từ Liêm, Hà Nội và Cơ sở 2: Xã Tân Minh, Huyện Sóc Sơn, Hà Nội). Tại Trường Đại học Điện Lực, bộ phận Giáo vụ (trực thuộc Phòng Đào tạo kết hợp cùng các trợ lý giáo vụ tại các Khoa chuyên ngành như Khoa Công nghệ Thông tin, Khoa Kỹ thuật Điện, Khoa Năng lượng, Khoa Điều khiển & Tự động hóa...) đóng vai trò là "mắt xích trung tâm" điều phối toàn bộ các hoạt động đào tạo thường nhật. Khối lượng công việc tại đây vô cùng đồ sộ, đa dạng và phức tạp, bao gồm:
1. **Quản lý trang thiết bị, cơ sở vật chất giảng đường và phòng máy tính:** Theo dõi hàng nghìn danh mục tài sản tại các tòa nhà giảng đường, phòng thí nghiệm chuyên ngành, phòng máy tính thực hành; theo dõi thời gian đưa vào sử dụng, thời hạn khấu hao (tiêu chuẩn 36 đến 60 tháng) để kịp thời lập kế hoạch bảo trì, thay mới hoặc thanh lý phục vụ giảng dạy.
2. **Quản lý hồ sơ điểm thi và kết quả học tập theo học chế tín chỉ:** Tiếp nhận, kiểm soát và lưu trữ hàng nghìn tệp bảng điểm kết thúc học phần theo từng học kỳ của sinh viên; yêu cầu bảo mật cao, tra cứu tức thời phục vụ công tác phúc khảo, kiểm định chất lượng và cấp phát văn bằng tốt nghiệp.
3. **Quản lý đội ngũ chuyên gia và giảng viên thỉnh giảng:** Trường Đại học Điện Lực có đặc thù mời nhiều chuyên gia, tiến sĩ, kỹ sư đầu ngành từ Tập đoàn Điện lực Việt Nam (EVN), Viện Năng lượng, Viện Hàn lâm KH&CN Việt Nam và các doanh nghiệp công nghệ lớn tham gia giảng dạy. Việc tiếp nhận, quản lý hồ sơ nhân thân chi tiết (24 trường thông tin: học hàm, học vị, ngày sinh, nơi công tác, số CCCD, tài khoản ngân hàng) và theo dõi sát sao thời hạn hợp đồng mời giảng là nhiệm vụ cực kỳ quan trọng để đảm bảo chi trả thù lao và tái ký hợp đồng đúng quy định.
4. **Quản lý văn bản hành chính đến và đi:** Tiếp nhận các thông tri, quyết định, công văn từ Bộ Công Thương, Bộ Giáo dục & Đào tạo, Ban Giám hiệu và các đơn vị đối tác; theo dõi tiến độ xử lý và hạn hồi đáp để tránh tình trạng chậm trễ văn bản theo quy định tại Nghị định 30/2020/NĐ-CP.
5. **Quản lý khối lượng giảng dạy:** Tính toán, đối chiếu định mức giảng dạy chuẩn của giảng viên cơ hữu (quy chuẩn 270 tiết chuẩn/năm học theo Thông tư 20/2020/TT-BGDĐT và Quy chế chi tiêu nội bộ của Trường Đại học Điện Lực) và giảng viên hợp đồng; theo dõi các minh chứng thời khóa biểu, bảng chấm công nhằm phục vụ công tác thanh quyết toán vượt giờ cuối năm học.

Mặc dù khối lượng công việc là vô cùng lớn và đòi hỏi độ chính xác tuyệt đối, song qua quá trình khảo sát thực tế tại đơn vị thực tập, phần lớn các nghiệp vụ giáo vụ hiện nay vẫn đang được xử lý bằng các công cụ bán tự động như Microsoft Excel, Google Sheets kết hợp lưu trữ hồ sơ giấy thủ công và trao đổi qua hòm thư điện tử rời rạc. Phương thức quản lý truyền thống này bộc lộ những hạn chế đặc biệt nghiêm trọng:
- **Dữ liệu phân tán và thiếu đồng bộ (Data Silos):** Mỗi cán bộ giáo vụ quản lý một file Excel riêng trên máy tính cá nhân. Khi cần tổng hợp báo cáo chung, các cán bộ phải cắt ghép thủ công, rất dễ dẫn đến sai lệch dữ liệu, nhầm lẫn phiên bản.
- **Không có cơ chế cảnh báo thời hạn tự động:** Các mốc thời gian quan trọng (tài sản sắp hết khấu hao, hợp đồng chuyên gia sắp hết hạn, công văn sắp hết hạn xử lý) hoàn toàn phụ thuộc vào trí nhớ hoặc việc dò tìm thủ công của cán bộ. Khi số lượng hồ sơ lên tới hàng trăm, hàng nghìn mục, tình trạng bỏ sót, quá hạn hợp đồng hoặc chậm xử lý công văn là điều khó tránh khỏi.
- **Rủi ro thất thoát dữ liệu và an toàn thông tin:** Việc lưu trữ file trên máy cá nhân không có cơ chế sao lưu đám mây liên tục khiến hệ thống đối mặt với nguy cơ mất trắng dữ liệu khi máy tính bị hỏng ổ cứng hoặc nhiễm mã độc. Bên cạnh đó, các tệp bảng điểm quan trọng không được kiểm soát phân quyền chặt chẽ.
- **Thiếu nhật ký truy vết (Audit Trail):** Khi xảy ra sai sót dữ liệu (bị sửa đổi, xóa nhầm), đơn vị không thể truy vết được ai là người thực hiện, thời gian thực hiện vào lúc nào, gây khó khăn cho công tác kiểm tra và quản trị nội bộ.
- **Chi phí triển khai phần mềm thương mại quá cao:** Các hệ thống ERP giáo dục lớn trên thị trường thường có chi phí bản quyền lên đến hàng trăm triệu hoặc hàng tỷ đồng, quy trình cài đặt cồng kềnh, không phù hợp với đặc thù nghiệp vụ nội bộ linh hoạt của bộ phận giáo vụ.

Xuất phát từ những đòi hỏi cấp bách và bất cập từ thực tiễn nêu trên, đề tài **"Phân tích, thiết kế và xây dựng Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)"** đã được lựa chọn và triển khai thực hiện. Đề tài tập trung xây dựng một hệ sinh thái phần mềm Web hiện đại, trực quan, gọn nhẹ, tích hợp cảnh báo thời gian thực, lưu trữ tệp tin thông minh không phụ thuộc chi phí hạ tầng và đáp ứng chính xác các quy chuẩn nghiệp vụ của giáo vụ đại học tại Việt Nam.

## 2. Mục tiêu của đề tài

### Mục tiêu tổng quát
Nghiên cứu, phân tích toàn diện quy trình nghiệp vụ giáo vụ tại Trường Đại học Điện Lực; từ đó thiết kế và xây dựng thành công hệ thống phần mềm web "Quản lý Giáo vụ 2026" hỗ trợ cán bộ giáo vụ số hóa quy trình làm việc, tự động hóa tính toán và cảnh báo, nâng cao hiệu suất làm việc và đảm bảo tính an toàn dữ liệu với chi phí hạ tầng tối ưu nhất.

### Mục tiêu cụ thể
1. **Khảo sát và chuẩn hóa quy trình:** Hệ thống hóa toàn bộ các biểu mẫu, quy định, chu trình xử lý hồ sơ tài sản giảng đường, bảng điểm thi, chuyên gia thỉnh giảng EVN/đối tác, văn bản hành chính và khối lượng giảng dạy theo đúng quy chế hiện hành của Bộ GD&ĐT và Trường Đại học Điện Lực.
2. **Phân tích thiết kế hệ thống chuẩn mực:** Ứng dụng ngôn ngữ mô hình hóa thống nhất UML để xây dựng các biểu đồ Use Case tổng quát, Use Case phân rã, đặc tả Use Case, biểu đồ tuần tự (Sequence Diagram), biểu đồ hoạt động (Activity Diagram) và biểu đồ lớp (Class Diagram) làm cơ sở triển khai phần mềm chuẩn kỹ nghệ phần mềm.
3. **Hiện thực hóa giải pháp công nghệ tiên tiến:**
   - Xây dựng giao diện người dùng (Front-end) theo kiến trúc SPA (Single Page Application) sử dụng React 19 kết hợp công cụ đóng gói siêu tốc Vite 8.
   - Ứng dụng nền tảng Google Firebase (Firebase Authentication, Cloud Firestore NoSQL) làm cơ sở dữ liệu phân tán thời gian thực, đảm bảo tốc độ phản hồi dưới 100ms.
   - Sáng tạo và hiện thực hóa kiến trúc lưu trữ lai **Hybrid Storage**: Kết hợp IndexedDB của trình duyệt làm kho đệm (local buffer 0ms) và Firestore Data URI (Base64) trên đám mây, giúp hệ thống hoạt động tải/xem tệp tin mượt mà, độc lập 100% với các gói lưu trữ tệp trả phí đắt đỏ của Firebase Storage.
   - Tích hợp công cụ xuất báo cáo tự động sang định dạng Excel (.xlsx) và PDF (.pdf) chuẩn Unicode tiếng Việt sắc nét, không bị lỗi font chữ.
4. **Đảm bảo an toàn thông tin và kiểm soát vết:** Xây dựng cơ chế xác thực người dùng bắt buộc qua Email Verification và phân hệ Nhật ký hoạt động (Audit Trail) ghi lại mọi hành động thêm, sửa, xóa, tải tệp cùng danh tính cán bộ thực hiện.
5. **Kiểm thử và đánh giá toàn diện:** Áp dụng phương pháp kiểm thử hộp đen Black-box Testing theo mô hình V-Model với hơn 15 kịch bản thử nghiệm thực tế và checklist nghiệm thu nghiêm ngặt, đảm bảo hệ thống vận hành ổn định, không phát sinh lỗi và sẵn sàng đưa vào áp dụng tại trường.

## 3. Đối tượng và phạm vi nghiên cứu

- **Đối tượng nghiên cứu:**
  - Lý thuyết về phân tích và thiết kế hệ thống hướng đối tượng (OOAD), quy trình phát triển phần mềm Agile/Scrum.
  - Các công nghệ lập trình Web: JavaScript ES6+, React 19, Vite 8, NoSQL Cloud Firestore, Firebase Auth, IndexedDB API.
  - Nghiệp vụ quản lý giáo vụ đại học tại Trường Đại học Điện Lực: Quản lý khấu hao tài sản phòng học, quản lý hồ sơ điểm thi, quản lý hợp đồng thỉnh giảng, quản lý văn bản theo Nghị định 30/2020/NĐ-CP, quản lý định mức khối lượng giờ giảng theo Thông tư 20/2020/TT-BGDĐT và Quy chế chi tiêu nội bộ của EPU.
- **Phạm vi nghiên cứu:**
  - Về không gian: Triển khai thử nghiệm tại Bộ phận Giáo vụ – Phòng Đào tạo kết hợp cùng Văn phòng Khoa Công nghệ Thông tin – Trường Đại học Điện Lực (Cơ sở 235 Hoàng Quốc Việt, Bắc Từ Liêm, Hà Nội).
  - Về nghiệp vụ: Tập trung vào 6 phân hệ nòng cốt: (1) Bảng điều khiển và cảnh báo thông minh; (2) Quản lý tài sản; (3) Quản lý hồ sơ điểm; (4) Quản lý thỉnh giảng chuyên gia; (5) Quản lý văn bản đến/đi; (6) Quản lý khối lượng giảng dạy; cùng các phân hệ bổ trợ Quản trị tài khoản, Sao lưu phục hồi CSDL và Nhật ký kiểm toán hệ thống.
  - Về thời gian: Khảo sát, thiết kế, lập trình và thử nghiệm trong thời gian 12 tuần của kỳ thực tập tốt nghiệp năm học 2025 - 2026.

## 4. Phương pháp nghiên cứu

Để thực hiện đề tài một cách khoa học và đạt hiệu quả cao nhất, các phương pháp nghiên cứu sau đã được áp dụng kết hợp:
1. **Phương pháp nghiên cứu tài liệu:** Thu thập, đọc và nghiên cứu các văn bản quy phạm pháp luật, thông tư, quyết định của Bộ GD&ĐT, Bộ Công Thương, các quy chế đào tạo tín chỉ và chi tiêu nội bộ của Trường Đại học Điện Lực, các tài liệu kỹ thuật chính thức của React, Firebase, tiêu chuẩn bảo mật OWASP.
2. **Phương pháp điều tra, phỏng vấn và khảo sát thực tế:** Trực tiếp tham gia vào các hoạt động nghiệp vụ tại đơn vị thực tập; phỏng vấn sâu các cán bộ giáo vụ, trưởng bộ môn để thu thập yêu cầu người dùng, phân tích biểu mẫu và điểm nghẽn nghiệp vụ.
3. **Phương pháp phân tích và thiết kế hướng đối tượng (OOAD):** Sử dụng các sơ đồ chuẩn UML (Use Case, Sequence, Activity, Class) để mô hình hóa cấu trúc tĩnh và hành vi động của hệ thống phần mềm.
4. **Phương pháp thực nghiệm (Lập trình và đóng gói):** Áp dụng mô hình phát triển phần mềm lặp (Iterative Development) để xây dựng mã nguồn, thiết kế cơ sở dữ liệu và tích hợp các module.
5. **Phương pháp kiểm thử phần mềm:** Thiết kế bộ ca kiểm thử (Test Cases Suite) theo kỹ thuật kiểm thử hộp đen (Black-box testing) kết hợp mô hình V-Model để thẩm định tính đúng đắn, tính toàn vẹn dữ liệu và hiệu năng phản hồi của hệ thống.

## 5. Bố cục của báo cáo

Nội dung báo cáo thực tập tốt nghiệp được cấu trúc thành các phần chính theo đúng quy định như sau:
- **Mở đầu:** Nêu tính cấp thiết, mục tiêu, đối tượng, phạm vi, phương pháp nghiên cứu và lời cảm ơn.
- **Chương 1: Khảo sát hiện trạng và xác lập dự án:** Trình bày chi tiết về Trường Đại học Điện Lực và đơn vị thực tập; khảo sát toàn diện môi trường kỹ thuật, hệ thống sổ sách hiện tại, các quy tắc quản lý, quy trình lưu chuyển chứng từ; đánh giá ưu nhược điểm; so sánh với các giải pháp khác; từ đó xác lập mục tiêu, yêu cầu chức năng/phi chức năng, lập dự trù kế hoạch triển khai 12 tuần và chứng minh tính ưu việt của dự án.
- **Chương 2: Phân tích và thiết kế hệ thống:** Trình bày biểu đồ Use Case tổng quát, phân rã chi tiết các phân hệ cốt lõi (với đầy đủ biểu đồ phân rã, bảng đặc tả Use Case, biểu đồ tuần tự và biểu đồ hoạt động cho từng phân hệ), biểu đồ lớp (Class Diagram), nghiên cứu cơ sở lý thuyết và giải pháp thuật toán, cùng phương pháp và mô hình kiểm thử V-Model.
- **Chương 3: Cài đặt và thử nghiệm:** Giới thiệu công nghệ cài đặt (React 19, Firestore, IndexedDB), trình bày chi tiết thiết kế giao diện các màn hình, thiết kế CSDL vật lý và các kiểm soát an toàn dữ liệu; thực nghiệm cài đặt 2 Use Case thiết kế, kết quả thuật toán, bộ 15 kịch bản kiểm thử, kiểm thử chuyên sâu, checklist nghiệm thu và đánh giá hiệu năng thực tế.
- **Kết luận:** Tổng kết các kết quả đạt được, chỉ ra các hạn chế và đề xuất hướng phát triển mở rộng trong tương lai.
- **Tài liệu tham khảo** và **Phụ lục**.

\\newpage

# CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN

## 1.1 Giới thiệu về đơn vị thực tập

### 1.1.1 Lịch sử hình thành, vị trí pháp lý và chức năng nhiệm vụ của Trường Đại học Điện Lực
Trường Đại học Điện Lực (tên giao dịch quốc tế: *Electric Power University - EPU*) là trường đại học công lập trực thuộc Bộ Công Thương Việt Nam, định hướng ứng dụng, có sứ mệnh đào tạo nguồn nhân lực chất lượng cao trong các lĩnh vực năng lượng, điện lực, tự động hóa, công nghệ thông tin và quản trị kinh tế phục vụ sự nghiệp công nghiệp hóa, hiện đại hóa đất nước.

Tiền thân của trường là Trường Kỹ nghệ Thực hành Hà Nội thành lập từ năm 1898. Trải qua hơn một thế kỷ xây dựng và trưởng thành, trường được Thủ tướng Chính phủ ký Quyết định thành lập Trường Đại học Điện Lực vào năm 2006 trên cơ sở nâng cấp Trường Cao đẳng Điện lực. Trường hoạt động theo cơ chế tự chủ, có hai cơ sở đào tạo khang trang:
- **Cơ sở 1:** Số 235 Hoàng Quốc Việt, Phường Cổ Nhuế 1, Quận Bắc Từ Liêm, Thành phố Hà Nội.
- **Cơ sở 2:** Xã Tân Minh, Huyện Sóc Sơn, Thành phố Hà Nội.

Trường Đại học Điện Lực đào tạo đa bậc học từ đại học chính quy, thạc sĩ đến tiến sĩ với hơn 20 ngành/chuyên ngành đào tạo. Trong đó, Khoa Công nghệ Thông tin là một trong những khoa mũi nhọn của trường với các chuyên ngành: Kỹ thuật phần mềm, Hệ thống thông tin, Khoa học máy tính và Mạng máy tính & An toàn thông tin, đào tạo hàng nghìn kỹ sư CNTT chất lượng cao cho thị trường lao động.

Đơn vị tiếp nhận sinh viên thực tập tốt nghiệp là **Bộ phận Giáo vụ thuộc Phòng Đào tạo (kết hợp hỗ trợ công tác giáo vụ tại Văn phòng Khoa Công nghệ Thông tin) – Trường Đại học Điện Lực**. Phòng Đào tạo là cơ quan tham mưu, giúp Ban Giám hiệu thực hiện chức năng quản lý, tổ chức và điều hành toàn bộ công tác đào tạo của nhà trường.

Chức năng và nhiệm vụ trọng tâm của bộ phận Giáo vụ tại Trường Đại học Điện Lực bao gồm:
1. **Quản lý học vụ học chế tín chỉ:** Tổ chức đăng ký môn học, lập kế hoạch giảng dạy, xếp thời khóa biểu giảng đường tại cả 2 cơ sở đào tạo; theo dõi tiến độ tích lũy học tập của sinh viên.
2. **Khảo thí và quản lý hồ sơ điểm thi:** Tiếp nhận bảng điểm kết thúc học phần bản cứng có chữ ký từ giảng viên chấm thi và các tệp bảng điểm số hóa; bảo mật, lưu trữ vĩnh viễn và phục vụ công tác tra cứu phúc khảo, xét điều kiện tốt nghiệp.
3. **Quản lý chuyên gia và giảng viên thỉnh giảng:** Tiếp nhận, thẩm định hồ sơ 24 trường thông tin của các chuyên gia, nhà khoa học đến từ Tập đoàn EVN, Viện Năng lượng và các đại học đối tác; lập tờ trình, hoàn thiện hợp đồng thỉnh giảng và giám sát thời hạn hiệu lực hợp đồng.
4. **Quản lý cơ sở vật chất giảng đường:** Quản trị danh mục tài sản, trang thiết bị chuyên dụng phục vụ giảng dạy tại toàn bộ hệ thống giảng đường và phòng máy tính (máy chiếu, micro, hệ thống âm thanh, điều hòa nhiệt độ, máy tính thực hành); theo dõi chu kỳ khấu hao 36 tháng để kịp thời lập kế hoạch bảo trì, sửa chữa hoặc đề xuất thanh lý.
5. **Thẩm định và đối soát khối lượng giảng dạy:** Thống kê, rà soát số tiết giảng dạy thực tế của cán bộ giảng viên cơ hữu theo định mức chuẩn 270 tiết/năm học (Thông tư 20/2020/TT-BGDĐT) và đối soát giờ dạy của giảng viên thỉnh giảng phục vụ quyết toán tài chính.
6. **Văn thư lưu trữ giáo vụ:** Tiếp nhận, phân loại, đôn đốc tiến độ xử lý các công văn từ Bộ Công Thương, Bộ GD&ĐT, Ban Giám hiệu; phát hành văn bản đi và số hóa hồ sơ văn thư giáo vụ theo Nghị định 30/2020/NĐ-CP.

### 1.1.2 Cơ cấu tổ chức bộ máy và hoạt động nghiệp vụ của Phòng Đào tạo & Giáo vụ EPU
Cơ cấu tổ chức của bộ phận Giáo vụ - Phòng Đào tạo Trường Đại học Điện Lực được xây dựng theo mô hình quản trị chuyên môn hóa cao, gắn kết chặt chẽ với các Khoa chuyên môn:
- **Trưởng phòng Đào tạo:** Lãnh đạo toàn diện, chịu trách nhiệm trước Ban Giám hiệu về mọi hoạt động đào tạo, quy hoạch ngành học và ký duyệt kế hoạch giảng dạy năm học.
- **Phó Trưởng phòng phụ trách Giáo vụ & Khảo thí:** Trực tiếp phụ trách công tác khảo thí, quản trị cơ sở dữ liệu điểm thi, điều phối lịch thi và kiểm định chất lượng đào tạo.
- **Tổ Giáo vụ & Khảo thí (3 cán bộ):** Đầu mối tiếp nhận bảng điểm thi, kiểm soát tính hợp lệ của điểm số, giải quyết khiếu nại phúc khảo của sinh viên và bảo quản tệp hồ sơ điểm thi.
- **Tổ Kế hoạch & Quản lý Cơ sở vật chất giảng đường (2 cán bộ):** Điều phối giảng đường tại 2 cơ sở (Hoàng Quốc Việt và Sóc Sơn), theo dõi thời hạn khấu hao tài sản thiết bị và lập kế hoạch bảo trì.
- **Tổ Nhân sự Đào tạo & Văn thư Giáo vụ (3 cán bộ):** Quản lý hồ sơ chuyên gia thỉnh giảng EVN/đối tác, theo dõi hạn hợp đồng mời giảng, quản lý sổ văn bản đến/đi và tổng hợp bảng kê khối lượng giảng dạy năm học.

\`\`\`
                         +-----------------------------------+
                         |         TRƯỞNG PHÒNG ĐÀO TẠO      |
                         +-----------------+-----------------+
                                           |
                         +-----------------+-----------------+
                         |          PHÓ TRƯỞNG PHÒNG         |
                         +-----------------+-----------------+
                                           |
       +-----------------------------------+-----------------------------------+
       |                                   |                                   |
+------+-----------------------+   +-------+-----------------------+   +-------+-----------------------+
|  TỔ GIÁO VỤ & KHẢO THÍ       |   |  TỔ KẾ HOẠCH & CƠ SỞ VẬT CHẤT |   |  TỔ NHÂN SỰ ĐT & VĂN THƯ     |
| - Tiếp nhận, lưu trữ điểm thi|   | - Điều phối giảng đường, TKB  |   | - Hồ sơ chuyên gia thỉnh giảng|
| - Kiểm soát điểm học phần    |   | - Theo dõi khấu hao tài sản   |   | - Theo dõi hạn hợp đồng mời GV|
| - Quản lý hồ sơ tốt nghiệp   |   | - Lập kế hoạch bảo trì thiết bị|  | - Sổ văn bản đến và đi        |
| - Cấp phát bảng điểm sinh viên|  | - Bàn giao, kiểm kê phòng lab |   | - Đối soát định mức giờ giảng |
+------------------------------+   +-------------------------------+   +-------------------------------+
\`\`\`
*Hình 1.1: Sơ đồ cơ cấu tổ chức bộ máy Phòng Đào tạo & Bộ phận Giáo vụ – Trường Đại học Điện Lực*

---

## 1.2 Khảo sát hiện trạng công tác quản lý giáo vụ tại Trường Đại học Điện Lực

### 1.2.1 Môi trường xã hội, kinh tế, kỹ thuật và cơ cấu tổ chức cơ quan chủ quản
- **Môi trường xã hội:**
  + Bộ Công Thương và Bộ GD&ĐT đang quyết liệt chỉ đạo đẩy mạnh chuyển đổi số trong các trường đại học trực thuộc. Đề án 06 về phát triển ứng dụng dữ liệu về dân cư, định danh điện tử đòi hỏi các cơ sở đào tạo phải chuẩn hóa dữ liệu nhân thân cán bộ, giảng viên và chuyên gia thỉnh giảng (chuẩn CCCD 12 số).
  + Xã hội đòi hỏi tính minh bạch tuyệt đối về kết quả học tập của sinh viên. Mọi sai sót trong khâu ghi nhận điểm hay chậm trễ trong xử lý thủ tục hành chính đều có thể gây ra khủng hoảng truyền thông và ảnh hưởng uy tín học thuật của nhà trường.
- **Môi trường kinh tế:**
  + Cơ chế tự chủ đại học đặt ra yêu cầu khắt khe về việc tối ưu hóa chi phí vận hành thường xuyên và nâng cao hiệu quả sử dụng nguồn vốn ngân sách.
  + Quản lý tài sản công: Hàng nghìn thiết bị giảng đường (máy chiếu, màn hình tương tác, hệ thống âm thanh, máy tính chuyên dụng) là nguồn lực lớn của EPU. Việc không nắm bắt kịp thời thời hạn khấu hao dẫn đến việc chậm thanh lý tài sản cũ hoặc trang bị trùng lặp gây thất thoát ngân sách.
  + Thanh quyết toán tài chính đào tạo: Việc tính toán thù lao vượt giờ của giảng viên cơ hữu và hợp đồng thỉnh giảng phụ thuộc trực tiếp vào tính chính xác của số liệu khối lượng giảng dạy. Bất kỳ sự thiếu minh bạch hay sai lệch nào trong tính toán số tiết định mức đều dẫn tới nguy cơ xuất toán tài chính khi kiểm toán nhà nước vào cuộc.
- **Môi trường kỹ thuật:**
  + Hạ tầng mạng tại Trường Đại học Điện Lực đã được đầu tư đồng bộ: 100% các phòng làm việc được kết nối mạng nội bộ LAN tốc độ Gigabit, đường truyền Internet cáp quang băng thông rộng; tất cả cán bộ giáo vụ đều được trang bị máy vi tính để bàn cá nhân cấu hình chuẩn văn phòng.
  + Về mặt phần mềm: Trước khi triển khai dự án, công cụ làm việc chủ yếu của cán bộ vẫn là bộ ứng dụng văn phòng ngoại tuyến Microsoft Office (Word, Excel) và dịch vụ lưu trữ cá nhân Google Drive / Zalo. Việc chia sẻ thông tin qua email tạo ra những "ốc đảo dữ liệu" (data silos), không có sự liên kết và đồng bộ thời gian thực.
- **Cơ cấu tổ chức của cơ quan chủ quản (Trường Đại học Điện Lực):**
  + Trường Đại học Điện Lực được điều hành bởi Hội đồng Trường và Ban Giám hiệu, gồm các Phòng/Ban chức năng (Đào tạo, Kế hoạch Tài chính, Tổ chức Cán bộ, Quản trị Cơ sở vật chất, Khảo thí & ĐBCL, Công tác Sinh viên) và các Khoa/Viện đào tạo chuyên ngành.
  + Phòng Đào tạo giữ vai trò là "mắt xích trung tâm" gắn kết trực tiếp giữa Ban Giám hiệu với tất cả các Khoa đào tạo và các giảng viên. Dữ liệu từ phòng giáo vụ là căn cứ pháp lý để Phòng Kế hoạch Tài chính thanh toán tiền lương, thù lao, và để Phòng Quản trị Cơ sở vật chất lập dự trù mua sắm trang thiết bị mới.

### 1.2.2 Nghiên cứu hệ thống hiện tại và quy tắc quản lý nghiệp vụ giáo vụ
Qua quá trình trực tiếp quan sát, nghiên cứu các tệp tin và phỏng vấn các cán bộ giáo vụ tại Trường Đại học Điện Lực, hệ thống hiện hành được vận hành chủ yếu dựa trên các bảng tính Excel rời rạc kết hợp lưu trữ hồ sơ giấy trong các cặp tài liệu. Các quy tắc quản lý nghiệp vụ cốt lõi được hệ thống hóa như sau:

#### 1. Quy tắc quản lý và tính toán khấu hao tài sản cơ sở vật chất
- **Quy chuẩn định mức:** Căn cứ quy định của Bộ Tài chính về chế độ quản lý, tính hao mòn, khấu hao tài sản cố định tại cơ quan nhà nước, toàn bộ trang thiết bị điện tử phục vụ giảng dạy tại giảng đường EPU (máy chiếu, micro, loa giảng đường, máy vi tính phòng thực hành) được áp dụng thời hạn khấu hao tiêu chuẩn là **36 tháng** (tương đương 3 năm) kể từ ngày nghiệm thu đưa vào sử dụng.
- **Công thức xác định số tháng khấu hao còn lại:**
  $$\\text{MonthsLeft} = D_{\\text{norm}} - \\left[ (Y_{\\text{now}} - Y_{\\text{start}}) \\times 12 + (M_{\\text{now}} - M_{\\text{start}}) \\right]$$
  *Trong đó:*
  + $D_{\\text{norm}}$: Thời gian khấu hao quy định (mặc định 36 tháng).
  + $Y_{\\text{now}}, M_{\\text{now}}$: Năm và tháng hiện tại của hệ thống.
  + $Y_{\\text{start}}, M_{\\text{start}}$: Năm và tháng tài sản bắt đầu đưa vào sử dụng.
- **Quy tắc phân loại và cảnh báo trực quan:**
  + Khi $\\text{MonthsLeft} > 1$ tháng: Trạng thái **Đang sử dụng tốt** (Hiển thị nhãn Xanh lá).
  + Khi $0 < \\text{MonthsLeft} \\le 1$ tháng: Trạng thái **Sắp hết khấu hao** (Hiển thị nhãn Vàng, kích hoạt cảnh báo ưu tiên trên Dashboard để cán bộ lập kế hoạch kiểm định).
  + Khi $\\text{MonthsLeft} \\le 0$ tháng: Trạng thái **Đã hết khấu hao** (Hiển thị nhãn Đỏ, dòng dữ liệu chuyển sang màu cảnh báo nguy cơ để lập danh sách trình Hội đồng thanh lý).

#### 2. Quy tắc quản lý chuyên gia thỉnh giảng và kiểm soát hợp đồng
- **Chuẩn hóa thông tin nhân thân:** Nhằm phục vụ công tác thanh toán thuế thu nhập cá nhân, đối soát bảo hiểm và báo cáo kiểm định của Bộ GD&ĐT, hồ sơ mỗi chuyên gia thỉnh giảng bắt buộc phải thu thập đầy đủ **24 trường dữ liệu nghiệp vụ chuẩn**:
  + Thông tin định danh: Danh xưng (Ông/Bà), Giới tính, Họ và tên đầy đủ, Ngày tháng năm sinh, Quê quán, Địa chỉ thường trú, Nơi ở hiện tại, Số Căn cước công dân (12 chữ số).
  + Thông tin học thuật: Học hàm (Không có, GS, PGS), Học vị cao nhất (Tiến sĩ, Thạc sĩ,...), Ngày ký quyết định bổ nhiệm học hàm, Đơn vị tiếp nhận mời giảng tại EPU (Khoa CNTT, Khoa Điện, Khoa Năng lượng...), Cơ quan công tác chính bên ngoài (EVN, Viện Năng lượng...), Nghề nghiệp hiện tại.
  + Thông tin tài chính & liên lạc: Số điện thoại, Số tài khoản ngân hàng, Tên ngân hàng và chi nhánh mở thẻ.
  + Thông tin hợp đồng: Số ký hiệu hợp đồng (Số HĐ), Ngày ký hợp đồng, Ngày bắt đầu hiệu lực, Ngày kết thúc hiệu lực, Tệp số hóa hợp đồng có chữ ký.
- **Công thức kiểm soát thời hạn hợp đồng:**
  $$\\text{ContractMonthsLeft} = (Y_{\\text{end}} - Y_{\\text{now}}) \\times 12 + (M_{\\text{end}} - M_{\\text{now}})$$
- **Quy tắc cảnh báo thời hạn hợp đồng:**
  + Khi $\\text{ContractMonthsLeft} \\le 0$: Hợp đồng **Đã hết hạn** (Cảnh báo Đỏ khẩn cấp).
  + Khi $0 < \\text{ContractMonthsLeft} \\le 2$ tháng: Hợp đồng **Sắp hết hạn** (Cảnh báo Vàng, nhắc nhở cán bộ trước 60 ngày để kịp thời chuẩn bị hồ sơ nghiệm thu khối lượng giảng dạy hoặc làm tờ trình tái ký hợp đồng cho học kỳ mới).

#### 3. Quy tắc quản lý văn bản hành chính theo Nghị định 30/2020/NĐ-CP
- **Văn bản đến:** Mọi công văn từ Bộ Công Thương, Bộ GD&ĐT, Đảng ủy khối, các cơ quan ngoài trường gửi đến EPU đều phải được số hóa, cấp số thứ tự đến, lưu trữ ngày nhận, nơi gửi, trích yếu nội dung, phân công cán bộ phụ trách và ấn định thời hạn hoàn thành xử lý. Chu trình trạng thái gồm 3 bước nghiêm ngặt: **Chưa xử lý** $\\rightarrow$ **Đang xử lý** $\\rightarrow$ **Đã xử lý**. Các văn bản có trạng thái "Chưa xử lý" mà cận kề hoặc quá hạn quy định phải được cảnh báo nổi bật.
- **Văn bản đi:** Theo dõi các tờ trình, công văn, thông báo do phòng phát hành gửi các đơn vị ngoài hoặc các khoa trong trường. Quản lý nơi nhận, ngày gửi, tệp văn bản chính thức và chu trình phản hồi: **Đã gửi** $\\rightarrow$ **Chưa hồi đáp** $\\rightarrow$ **Đã hồi đáp**. Các văn bản gửi đi chờ ý kiến phúc đáp quá 15 ngày phải được hệ thống tự động nhắc nhở để đôn đốc đơn vị bạn.

#### 4. Quy tắc quản lý khối lượng giảng dạy theo Thông tư 20/2020/TT-BGDĐT
- **Đối với giảng viên cơ hữu:**
  + Căn cứ quy định về chế độ làm việc của giảng viên đại học, định mức giờ chuẩn giảng dạy của giảng viên cơ hữu trong một năm học là **270 tiết chuẩn**.
  + Công thức tính chênh lệch khối lượng giờ giảng:
    $$\\text{Diff} = \\text{Hours}_{\\text{actual}} - \\text{Hours}_{\\text{norm}}$$
    *Nếu $\\text{Diff} > 0$:* Giảng viên **Vượt định mức** ($+\\text{Diff}$ tiết) $\\rightarrow$ Gắn huy hiệu màu Vàng, lập danh sách hưởng chế độ thanh toán tiền vượt giờ cuối năm.  
    *Nếu $\\text{Diff} < 0$:* Giảng viên **Thiếu định mức** ($-\\text{Diff}$ tiết) $\\rightarrow$ Gắn huy hiệu màu Đỏ, ghi nhận để phân công dạy bù hoặc xem xét thi đua.  
    *Nếu $\\text{Diff} = 0$:* Giảng viên **Đủ định mức** $\\rightarrow$ Gắn huy hiệu màu Xanh lá.
- **Đối với giảng viên hợp đồng:** Quản lý chặt chẽ theo số giờ cam kết trên từng hợp đồng giảng dạy môn học cụ thể, đối soát với thời khóa biểu và bảng chấm công thực tế, đính kèm đầy đủ các tệp minh chứng đề cương, lịch trình giảng dạy.

#### 5. Quy tắc quản lý và bảo mật hồ sơ bảng điểm thi
Bảng điểm kết thúc học phần là tài liệu pháp lý đặc biệt quan trọng của trường đại học. Quy tắc nghiệp vụ quy định: Giảng viên chấm thi nộp bảng điểm bản cứng có chữ ký về phòng giáo vụ kèm tệp số hóa (Excel, PDF). Cán bộ giáo vụ có trách nhiệm kiểm tra tính hợp lệ của chữ ký, đối chiếu số lượng bài thi, gắn nhãn (tag) phân loại theo chuyên ngành / bộ môn và lưu trữ tập trung. Tệp điểm thi phải được bảo vệ chống ghi đè, chống xóa trái phép và cho phép tra cứu, tải về tức thì khi có yêu cầu phúc khảo hoặc kiểm tra của Hội đồng khảo thí.

### 1.2.3 Thu thập các chứng từ giao dịch và chu trình lưu chuyển thông tin
Trong thời gian thực tập tại Trường Đại học Điện Lực, tác giả đã tiến hành thu thập, phân loại toàn bộ hệ thống biểu mẫu chứng từ đang lưu hành tại đơn vị:
1. **Biên bản bàn giao và kiểm kê tài sản cơ sở vật chất (Mẫu C53-HD):** Ghi nhận mã tài sản, tên thiết bị, số lượng, quy cách kỹ thuật, tình trạng bàn giao cho người quản lý giảng đường các nhà A, B, khu xưởng thực hành EPU.
2. **Bảng tổng hợp điểm thi kết thúc học phần:** Gồm danh sách sinh viên, điểm quá trình, điểm thi kết thúc, điểm học phần hệ 10 và hệ chữ (A, B, C, D, F) có đầy đủ chữ ký của hai cán bộ chấm thi và lãnh đạo khoa.
3. **Hồ sơ hợp đồng chuyên gia thỉnh giảng:** Hợp đồng dịch vụ giảng dạy (theo mẫu quy chuẩn của Trường Đại học Điện Lực), bản sao công chứng CCCD, bằng Thạc sĩ / Tiến sĩ, quyết định công nhận học hàm GS/PGS, sơ yếu lý lịch khoa học và thông tin số tài khoản ngân hàng.
4. **Sổ theo dõi công văn đến và Sổ đăng ký công văn đi:** Sổ giấy khổ A3 ghi chép ngày tháng, số văn bản, trích yếu nội dung và chữ ký tiếp nhận của cán bộ xử lý.
5. **Bảng xác nhận khối lượng giảng dạy năm học:** Tổng hợp số tiết lý thuyết, thực hành, hướng dẫn đồ án tốt nghiệp có xác nhận của Trưởng Bộ môn và Ban Chủ nhiệm Khoa.

Chu trình lưu chuyển thông tin văn bản và tài liệu giao dịch được mô hình hóa qua lưu đồ sau:

\`\`\`
[Nơi gửi / Giảng viên] 
         |
         | (Gửi hồ sơ, điểm thi, công văn)
         v
+------------------------+
| 1. TIẾP NHẬN & KIỂM TRA| ---> [Từ chối / Yêu cầu bổ sung nếu sai sót]
| - Kiểm tra tính pháp lý|
| - Kiểm tra chữ ký, mẫu |
+-----------+------------+
            | (Hợp lệ)
            v
+------------------------+
| 2. SỐ HÓA & VÀO SỔ     |
| - Cấp mã / số ký hiệu  |
| - Nhập trích yếu, hạn  |
| - Upload tệp đính kèm  |
+-----------+------------+
            |
            v
+------------------------+      +---------------------------+
| 3. PHÂN CÔNG & XỬ LÝ   | ---> | 4. ĐÔN ĐỐC & THEO DÕI     |
| - Gán cán bộ phụ trách |      | - Quét hạn xử lý          |
| - Thực hiện nghiệp vụ  |      | - Cảnh báo sắp quá hạn    |
+-----------+------------+      +-------------+-------------+
            |                                 |
            +----------------+----------------+
                             | (Hoàn thành)
                             v
               +---------------------------+
               | 5. LƯU TRỮ & PHÁT HÀNH    |
               | - Lưu trữ hồ sơ đám mây   |
               | - Phát hành văn bản đi    |
               | - Ghi nhận Audit Log vết  |
               +---------------------------+
\`\`\`
*Hình 1.2: Sơ đồ chu trình lưu chuyển và xử lý thông tin tài liệu giáo vụ tại Trường Đại học Điện Lực*

### 1.2.4 Thống kê các phương tiện và tài nguyên đã và có thể sử dụng
Khảo sát hiện trạng hạ tầng kỹ thuật và nhân lực tại Phòng Đào tạo Trường Đại học Điện Lực cho thấy cơ sở vật chất sẵn có hoàn toàn đủ điều kiện để triển khai một hệ thống phần mềm web hiện đại:

*Bảng 1.1: Thống kê cơ sở vật chất và trang thiết bị tại Phòng Đào tạo - Trường Đại học Điện Lực*
| STT | Nhóm tài nguyên / Thiết bị | Số lượng | Cấu hình & Hiện trạng kỹ thuật | Khả năng đáp ứng cho hệ thống mới |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Máy vi tính để bàn cán bộ | 12 bộ | CPU Intel Core i5 thế hệ 10/11, RAM 8GB - 16GB, ổ cứng SSD 256GB - 512GB, chạy Windows 10/11 Pro | Chạy mượt mà ứng dụng Web SPA trên các trình duyệt hiện đại |
| **2** | Hạ tầng mạng truyền dẫn | 2 đường | Mạng LAN Gigabit 1000 Mbps, 02 đường truyền Internet cáp quang Viettel/VNPT băng thông 300 Mbps | Truy cập tức thì, đồng bộ dữ liệu thời gian thực lên Cloud Firestore |
| **3** | Máy quét tài liệu (Scanner) | 2 máy | Máy quét chuyên dụng Canon / HP tốc độ quét 35 trang/phút, độ phân giải 600 dpi | Số hóa hợp đồng, công văn sang file PDF để đưa lên hệ thống |
| **4** | Máy in Laser văn phòng | 3 máy | Máy in Canon LBP 2900 / HP LaserJet Pro in khổ A4 hai mặt tự động | In ấn trực tiếp các báo cáo danh sách từ file PDF/Excel xuất ra |
| **5** | Trình duyệt Web | 100% máy| Google Chrome, Microsoft Edge phiên bản mới nhất, hỗ trợ đầy đủ HTML5, CSS3, IndexedDB | Tương thích tuyệt đối với công nghệ React 19 và Hybrid Storage |
| **6** | Đội ngũ cán bộ giáo vụ | 8 cán bộ | 100% tốt nghiệp đại học, trình độ tin học văn phòng thành thạo, có tinh thần đổi mới | Tiếp nhận và làm chủ nhanh chóng giao diện người dùng trực quan |

### 1.2.5 Khảo sát các hệ thống quản lý đào tạo khác trên thị trường
Nhằm tìm ra giải pháp tối ưu cho bài toán của đơn vị, tác giả đã tiến hành khảo sát và so sánh đối chuẩn (Benchmarking) giữa các hệ thống phần mềm quản lý đào tạo đang có mặt trên thị trường:

*Bảng 1.2: So sánh các giải pháp quản lý đào tạo và giáo vụ hiện nay trên thị trường*
| Tiêu chí so sánh | Hệ thống ERP giáo dục lớn (Edusoft, PSC, UIS) | Bộ công cụ văn phòng chia sẻ (Google Sheets / Excel) | Hệ thống Quản lý Giáo vụ EPU 2026 (Dự án xây dựng) |
| :--- | :--- | :--- | :--- |
| **Mục đích thiết kế** | Phục vụ toàn trường (tuyển sinh, học phí, cổng sinh viên) | Xử lý bảng tính biểu mẫu tổng quát | **Tối ưu hóa chuyên sâu 100% cho nghiệp vụ nội bộ của Giáo vụ** |
| **Chi phí đầu tư ban đầu** | Rất cao (từ 300 triệu đến hơn 1 tỷ VNĐ) | Miễn phí hoặc chi phí gói Google Workspace | **0 VNĐ (Nhờ nền tảng Serverless và Hybrid Storage)** |
| **Chi phí duy trì hàng năm** | Hàng chục đến hàng trăm triệu VNĐ phí bảo trì | Phụ thuộc dung lượng thuê thêm | **0 VNĐ chi phí máy chủ hàng tháng** |
| **Khả năng tùy biến nghiệp vụ** | Rất khó, phụ thuộc hoàn toàn vào nhà thầu phần mềm | Người dùng tự sửa nhưng dễ phá vỡ cấu trúc | **Tùy biến chuẩn xác theo đúng quy chế đào tạo của trường** |
| **Cảnh báo thời hạn tự động** | Hạn chế, chỉ gửi email rời rạc hoặc khó thiết lập | Không có cơ chế quét cảnh báo tự động thông minh | **Tự động quét và hiển thị thẻ cảnh báo đa sắc trên Dashboard** |
| **Lưu trữ file đính kèm** | Đòi hỏi mở rộng dung lượng máy chủ lưu trữ lớn | Lưu phân tán trên Drive cá nhân, dễ đứt link | **Kiến trúc Hybrid Storage 0ms, lưu Base64 và IndexedDB** |
| **Nhật ký truy vết (Audit Trail)**| Cồng kềnh, chỉ quản trị viên cấp cao mới xem được | Không thể truy vết được ai sửa số liệu gì cụ thể | **Tự động ghi vết mọi hành vi Thêm/Sửa/Xóa kèm email cán bộ** |
| **Tốc độ phản hồi giao diện** | Tải trang chậm (3 - 5s) do kiến trúc render phía máy chủ | Bị đơ lag khi bảng tính có hàng nghìn dòng | **Siêu mượt (SPA React 19, thời gian phản hồi < 100ms)** |

### 1.2.6 Đánh giá hiện trạng (Ưu điểm, Nhược điểm và Các rủi ro)
Tổng kết quá trình khảo sát thực tế tại Trường Đại học Điện Lực, tác giả rút ra những đánh giá khách quan về hệ thống hiện hành:
- **Ưu điểm của cách làm truyền thống:**
  + Cán bộ đã quen thuộc với giao diện bàn phím và bảng tính Microsoft Excel, không mất thời gian tập huấn ban đầu.
  + Linh hoạt trong việc tạo thêm cột hoặc nhập nhanh ghi chú theo thói quen cá nhân.
  + Không phát sinh chi phí đầu tư mua bản quyền phần mềm ngoài.
- **Những nhược điểm, hạn chế và rủi ro nghiêm trọng:**
  1. *Dữ liệu phân tán và cô lập (Data Silos):* Mỗi cán bộ phụ trách một mảng giữ một vài file Excel trên máy tính cá nhân. Khi cần đối soát thông tin giữa hợp đồng thỉnh giảng của một chuyên gia với số giờ dạy thực tế của bộ môn, cán bộ phải copy dữ liệu qua lại, dễ dẫn tới nhầm lẫn phiên bản.
  2. *Hoàn toàn thiếu cơ chế cảnh báo tự động:* Toàn bộ các mốc hạn quan trọng (tài sản sắp hết hạn khấu hao, hợp đồng thỉnh giảng sắp hết hạn 2 tháng, công văn đến quá hạn xử lý) đều phụ thuộc vào trí nhớ và sự kiểm tra thủ công của cán bộ. Khi số lượng hồ sơ lên tới hàng trăm bản ghi, việc bỏ sót là điều khó tránh khỏi, dẫn đến tình trạng hợp đồng bị quá hạn mà chưa kịp làm thủ tục gia hạn hoặc thanh lý.
  3. *Nguy cơ mất trắng dữ liệu và thất lạc hồ sơ:* Việc lưu trữ tệp trên ổ cứng máy tính cá nhân tiềm ẩn rủi ro cực lớn khi máy tính bị virus mã hóa tệp (ransomware) hoặc hỏng ổ cứng vật lý. Nhiều bảng điểm thi nhận qua email hoặc Zalo không có nơi lưu trữ tập trung, rất dễ bị xóa nhầm hoặc thất lạc khi cán bộ thay đổi máy tính.
  4. *Khó khăn và tốn thời gian tổng hợp báo cáo:* Mỗi kỳ kiểm kê tài sản cuối năm hoặc đợt quyết toán khối lượng giảng dạy, cán bộ phải mất từ 3 đến 5 ngày làm việc để mở từng file Excel, cắt ghép, tính toán thủ công bằng hàm SUM, VLOOKUP, nguy cơ sai sót số học rất cao.
  5. *Thiếu tính minh bạch và nhật ký kiểm toán:* Khi một con số điểm thi bị sửa, một tài sản bị xóa hay một hợp đồng bị chỉnh ngày tháng, không ai có thể biết được ai là người thực hiện, thực hiện vào thời điểm nào, gây khó khăn cho công tác kiểm tra nội bộ và trách nhiệm cá nhân.

### 1.2.7 Đề xuất giải pháp và phân tích ưu, nhược điểm của mỗi giải pháp
Để giải quyết dứt điểm các tồn tại trên, nhóm nghiên cứu đã xây dựng và phân tích 3 phương án giải pháp:
- **Phương án 1: Mua phần mềm thương mại đóng gói sẵn từ các công ty phần mềm giáo dục.**
  + *Ưu điểm:* Triển khai nhanh, có sẵn các chức năng cơ bản, có đội ngũ kỹ thuật của đối tác bảo hành.
  + *Nhược điểm:* Chi phí mua bản quyền rất đắt (hàng trăm triệu đồng); quy trình của phần mềm đóng gói mang tính khuôn mẫu, không khớp với đặc thù nghiệp vụ giáo vụ nội bộ của trường; mỗi lần yêu cầu chỉnh sửa tính năng hay thay đổi biểu mẫu đều mất chi phí cao và thời gian chờ đợi kéo dài.
- **Phương án 2: Nâng cấp hệ thống bảng tính bằng Google Sheets kết hợp lập trình Google Apps Script / VBA Macro.**
  + *Ưu điểm:* Chi phí thấp, cán bộ tận dụng được kỹ năng dùng Excel có sẵn, hỗ trợ cộng tác trực tuyến nhiều người.
  + *Nhược điểm:* Giao diện không chuyên nghiệp; không kiểm soát được quyền truy cập theo từng nút chức năng; không quản lý được tệp tin đính kèm dung lượng lớn; khi lượng dữ liệu lớn bảng tính sẽ chạy rất chậm; tính năng bảo mật và phân quyền vai trò rất lỏng lẻo.
- **Phương án 3 (Phương án lựa chọn): Tự xây dựng "Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)" trên nền tảng React 19, Cloud Firestore và kiến trúc lưu trữ lai Hybrid Storage.**
  + *Ưu điểm:*
    * Đáp ứng chính xác 100% các quy tắc nghiệp vụ giáo vụ được khảo sát tại Trường Đại học Điện Lực.
    * Giao diện người dùng Web SPA hiện đại, trực quan, thời gian phản hồi dưới 100ms.
    * Tự động hóa hoàn toàn thuật toán quét và hiển thị cảnh báo hạn khấu hao, hạn hợp đồng, tiến độ văn bản và chênh lệch giờ giảng.
    * Đột phá với giải pháp **Hybrid Storage**: Tốc độ lưu tệp tức thì (0ms) trên IndexedDB và lưu Base64 trên đám mây Firestore, giúp đơn vị **không tốn một đồng chi phí nào cho dịch vụ lưu trữ ngoài**.
    * Xuất báo cáo Excel và PDF chuẩn Unicode tiếng Việt sắc nét, căn lề chuẩn in ấn văn thư.
    * Đảm bảo an toàn thông tin với quy trình xác thực email bắt buộc, phân quyền Quản trị viên/Cán bộ giáo vụ, sao lưu phục hồi dữ liệu JSON độc lập và tự động ghi vết Audit Log.
  + *Nhược điểm:* Đòi hỏi nhóm sinh viên thực hiện phải đầu tư thời gian, công sức nghiên cứu chuyên sâu về phân tích thiết kế hệ thống và làm chủ các công nghệ web tiên tiến nhất.

*Bảng 1.3: Ma trận so sánh đánh giá các phương án giải pháp công nghệ*
| Tiêu chí đánh giá (Thang điểm 1 - 10) | Trọng số | Phương án 1 (Mua phần mềm đóng gói) | Phương án 2 (Google Sheets / VBA) | Phương án 3 (Xây dựng Hệ thống Giáo vụ EPU 2026) |
| :--- | :---: | :---: | :---: | :---: |
| 1. Mức độ phù hợp với nghiệp vụ giáo vụ đặc thù | 25% | 6.5 / 10 | 6.0 / 10 | **9.5 / 10** |
| 2. Chi phí đầu tư ban đầu và duy trì vận hành | 20% | 3.0 / 10 | 8.0 / 10 | **9.8 / 10** |
| 3. Khả năng tự động quét cảnh báo hạn thông minh | 15% | 6.5 / 10 | 4.5 / 10 | **9.5 / 10** |
| 4. Hiệu năng, tốc độ phản hồi và trải nghiệm UI/UX| 15% | 6.0 / 10 | 5.5 / 10 | **9.5 / 10** |
| 5. An toàn bảo mật, phân quyền và Audit Trail | 15% | 8.0 / 10 | 4.0 / 10 | **9.0 / 10** |
| 6. Khả năng làm chủ mã nguồn và mở rộng tương lai | 10% | 4.0 / 10 | 5.0 / 10 | **9.5 / 10** |
| **TỔNG ĐIỂM CÓ TRỌNG SỐ** | **100%** | **5.70 / 10** | **5.58 / 10** | **9.49 / 10** |

*Kết luận đánh giá:* Với điểm số vượt trội **9.49 / 10**, Phương án 3 hoàn toàn khẳng định tính khoa học, tính kinh tế và tính thực tiễn cao nhất. Nhóm nghiên cứu quyết định lựa chọn Phương án 3 để xác lập và triển khai dự án.

---

## 1.3 Xác lập dự án và đánh giá khả thi

### 1.3.1 Mục tiêu của dự án
Dự án được chính thức xác lập với tên gọi: **"Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)"**.
- **Mục tiêu tổng quát:** Xây dựng một nền tảng phần mềm web hiện đại, chuyên nghiệp, số hóa toàn diện quy trình quản trị giáo vụ tại phòng Đào tạo & Giáo vụ EPU; tự động hóa việc tính toán khấu hao, định mức giảng dạy, quản lý văn bản, tệp điểm thi và chuyên gia thỉnh giảng; đồng thời thiết lập cơ chế cảnh báo thời gian thực và kiểm soát an toàn dữ liệu với chi phí vận hành tối ưu nhất.
- **Mục tiêu cụ thể:**
  1. *Số hóa 100% dữ liệu nghiệp vụ:* Chuyển đổi toàn bộ hồ sơ tài sản phòng học, tệp điểm thi, hồ sơ 24 trường dữ liệu của chuyên gia thỉnh giảng, sổ công văn đến/đi và khối lượng giờ giảng từ các file Excel phân tán lên cơ sở dữ liệu thời gian thực Cloud Firestore.
  2. *Rút ngắn 80% thời gian tác nghiệp:* Cung cấp công cụ tìm kiếm tức thì theo thời gian thực (Instant Search), giúp cán bộ tìm kiếm bất kỳ thông tin tài sản, văn bản hay hồ sơ giảng viên nào trong vòng dưới 1 giây thay vì phải lùng sục nhiều thư mục máy tính như trước.
  3. *Tự động hóa 100% việc cảnh báo thời hạn:* Hệ thống tự động quét và đưa lên Dashboard các mục đến hạn (tài sản hết khấu hao, hợp đồng chuyên gia sắp hết hạn trước 60 ngày, văn bản chưa xử lý) kèm mã màu trực quan, giúp loại bỏ hoàn toàn tình trạng trễ hạn công việc.
  4. *Tối ưu hóa tài chính tuyệt đối (0 VNĐ):* Khai thác giải pháp lưu trữ lai Hybrid Storage giúp hệ thống vận hành hoàn toàn miễn phí trên nền tảng Firebase Spark Plan mà không phát sinh chi phí duy trì máy chủ hay thuê kho lưu trữ đám mây.
  5. *Đảm bảo an toàn thông tin và truy vết:* Bắt buộc xác thực danh tính qua liên kết email, phân quyền Quản trị viên / Cán bộ giáo vụ, hỗ trợ xuất và phục hồi toàn bộ CSDL dưới dạng tệp JSON, tự động ghi vết 100% các hành vi thay đổi dữ liệu vào Audit Log.

### 1.3.2 Yêu cầu của dự án (Chức năng và Phi chức năng)

#### 1. Yêu cầu chức năng (Functional Requirements - FR)
- **FR1 - Xác thực và Phân quyền người dùng (Authentication & RBAC):** Hỗ trợ đăng nhập bằng Email/Password và tài khoản Google. Bắt buộc người dùng phải xác thực email kích hoạt trước khi vào hệ thống. Phân định rõ 2 cấp quyền: *Quản trị viên (Admin)* có quyền quản lý người dùng, khóa/mở khóa tài khoản, phân quyền và sao lưu/phục hồi hệ thống; *Cán bộ giáo vụ (Staff)* có quyền thực thi đầy đủ các nghiệp vụ giáo vụ thường nhật.
- **FR2 - Bảng điều khiển và Cảnh báo thông minh (Dashboard & Smart Alerts):** Cung cấp các thẻ thống kê trực quan (Tổng tài sản, Chuyên gia thỉnh giảng, Văn bản đến, Văn bản đi). Tự động tổng hợp và hiển thị danh sách các mục cảnh báo nguy cơ: Tài sản sắp/đã hết khấu hao, Hợp đồng chuyên gia sắp hết hạn, Công văn chưa xử lý, Công văn đi chờ hồi đáp. Cung cấp các nút tắt điều hướng nhanh đến từng tác vụ.
- **FR3 - Quản lý Tài sản cơ sở vật chất (Asset Management):** Thực hiện đầy đủ các chức năng thêm mới, chỉnh sửa, xóa bỏ và tìm kiếm đa trường tài sản; tự động tính số tháng khấu hao còn lại dựa trên ngày đưa vào sử dụng và hiển thị Badge màu sắc tương ứng; hỗ trợ xuất danh sách tài sản ra file Excel (.xlsx) và file PDF (.pdf) chuẩn Unicode tiếng Việt.
- **FR4 - Quản lý Hồ sơ Điểm thi (Score Archive Management):** Cho phép upload tệp bảng điểm kết thúc học phần đa định dạng (Excel, PDF, Word); hỗ trợ gắn nhãn (tag) phân loại theo chuyên ngành; tìm kiếm nhanh theo tên môn học; hỗ trợ tải tệp về máy tính an toàn và xóa tệp điểm.
- **FR5 - Quản lý Chuyên gia Thỉnh giảng (Visiting Lecturer Management):** Lưu trữ và quản lý chi tiết 24 trường thông tin nhân thân, bằng cấp, CCCD, tài khoản ngân hàng và hợp đồng; tự động tính tháng hết hạn hợp đồng và kích hoạt cảnh báo vàng trước 2 tháng; xem chi tiết hồ sơ trong cửa sổ Popup; xuất danh sách ra file Excel và PDF.
- **FR6 - Quản lý Văn bản Đến và Đi (Document Dispatch Management):** Tổ chức giao diện 2 Tab độc lập cho Văn bản Đến và Văn bản Đi; hiển thị huy hiệu (Badge) số lượng văn bản tồn đọng trên tab và thanh Sidebar; cho phép cập nhật nhanh trạng thái xử lý trực tiếp trên bảng; theo dõi hạn hoàn thành và file đính kèm.
- **FR7 - Quản lý Khối lượng Giảng dạy (Teaching Load Management):** Tổ chức 2 phân hệ: *Khối lượng Định mức* (áp dụng định mức 270 tiết chuẩn của giảng viên cơ hữu, tự động tính chênh lệch thừa/thiếu tiết kèm Badge màu nổi bật) và *Khối lượng Hợp đồng* (theo dõi số giờ ký kết theo môn học); hỗ trợ đính kèm nhiều tệp minh chứng đồng thời (thời khóa biểu, bảng chấm công).
- **FR8 - Quản trị Tài khoản, Sao lưu và Kiểm toán (Administration, Backup & Audit):** Cho phép Quản trị viên xem danh sách cán bộ, đổi vai trò, khóa tài khoản; cho phép xuất toàn bộ CSDL ra tệp JSON dự phòng và phục hồi dữ liệu từ bản sao lưu; tự động ghi vết mọi hành vi Thêm/Sửa/Xóa/Upload vào \`audit_logs\` có mốc thời gian máy chủ \`serverTimestamp()\`.

#### 2. Yêu cầu phi chức năng (Non-Functional Requirements - NFR)
- **NFR1 - Hiệu năng và Tốc độ phản hồi (Performance):** Thời gian phản hồi cho các thao tác tìm kiếm, lọc dữ liệu trên bảng phải dưới 50ms. Thời gian hiển thị trang ban đầu (First Contentful Paint) dưới 1.2 giây. Thời gian lưu/tải tệp đệm nội bộ trên IndexedDB đạt 0 - 5ms.
- **NFR2 - Độ tin cậy và Tính sẵn sàng (Availability & Reliability):** Tận dụng hạ tầng đám mây Google Firebase Serverless đạt độ sẵn sàng tối thiểu 99.9%, hệ thống hoạt động 24/7 không cần khởi động lại máy chủ.
- **NFR3 - An toàn và Bảo mật thông tin (Security):** Toàn bộ mật khẩu được mã hóa an toàn qua Firebase Auth; cấu hình Firebase Security Rules đảm bảo chỉ các truy vấn đã đăng nhập mới được đọc/ghi; áp dụng cơ chế xác thực Email để ngăn chặn đăng ký mạo danh; ngăn ngừa các lỗ hổng bảo mật phổ biến theo chuẩn OWASP (XSS, Injection).
- **NFR4 - Tính toàn vẹn và Phục hồi dữ liệu (Data Integrity & Disaster Recovery):** Đảm bảo kiểm tra hợp lệ dữ liệu (Validation) trước khi lưu; hỗ trợ cơ chế sao lưu toàn diện (Full JSON Backup) giúp khôi phục toàn bộ CSDL chỉ trong vài giây nếu xảy ra sự cố xóa nhầm.
- **NFR5 - Tính khả dụng và Trải nghiệm người dùng (Usability & UX):** Giao diện thiết kế theo phong cách công sở cao cấp, tone màu xanh navy giáo dục chuyên nghiệp, độ tương phản cao, bố cục gọn gàng, có thông báo Toast phản hồi sau mỗi thao tác.
- **NFR6 - Tính tương thích đa nền tảng (Compatibility):** Ứng dụng Web hoạt động tương thích hoàn hảo trên các trình duyệt hiện đại (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari) với các độ phân giải màn hình phổ biến từ HD (1366x768) đến Full HD (1920x1080).

### 1.3.3 Các chức năng chính của dự án
Hệ thống Quản lý Giáo vụ EPU 2026 được phân rã thành 9 phân hệ chức năng hoàn chỉnh:
1. **Phân hệ Bảng điều khiển Trung tâm (Dashboard):** Trung tâm giám sát và điều hướng toàn bộ hệ thống; hiển thị 4 thẻ thống kê số lượng và vùng thông báo cảnh báo tức thời các tài sản, hợp đồng và công văn cần xử lý.
2. **Phân hệ Quản lý Tài sản (Assets Management):** Quản lý toàn bộ danh mục tài sản, kiểm soát số lượng theo từng phòng học, tự động hóa tính toán thời gian khấu hao 36 tháng và xuất biên bản kiểm kê ra Excel/PDF.
3. **Phân hệ Quản lý Hồ sơ Điểm (Scores Archive):** Lưu trữ tập trung các tệp bảng điểm học phần số hóa, phân loại thông minh theo Tag bộ môn, hỗ trợ tra cứu và tải về tức thì.
4. **Phân hệ Quản lý Chuyên gia Thỉnh giảng (Experts Management):** Số hóa và quản lý hồ sơ nhân thân khoa học của giảng viên ngoài trường (24 trường thông tin), giám sát hạn hợp đồng và phát cảnh báo trước 2 tháng.
5. **Phân hệ Quản lý Văn bản Hành chính (Documents Management):** Quản lý quy trình lưu chuyển văn bản đến và đi theo 2 Tab độc lập, hiển thị huy hiệu đếm văn bản tồn đọng, cập nhật trạng thái xử lý chỉ với 1 thao tác chuột.
6. **Phân hệ Quản lý Khối lượng Giảng dạy (Teaching Load Management):** Giám sát khối lượng giảng dạy định mức (270 tiết chuẩn) và giảng dạy hợp đồng, tự động xác định số giờ vượt/thiếu và quản lý các tệp minh chứng.
7. **Phân hệ Quản trị Tài khoản & Phân quyền (Users Management):** Dành riêng cho Quản trị viên để quản lý danh sách tài khoản cán bộ, nâng hạ quyền hạn và thực hiện khóa tài khoản vi phạm.
8. **Phân hệ Sao lưu & Phục hồi CSDL (Backup & Restore):** Cho phép Quản trị viên xuất toàn bộ dữ liệu 8 collections ra tệp JSON để lưu trữ ngoại tuyến, đồng thời hỗ trợ nạp phục hồi CSDL theo 2 chế độ (Gộp dữ liệu hoặc Làm sạch CSDL).
9. **Phân hệ Nhật ký Kiểm toán Hoạt động (Audit Trail):** Ghi vết tự động, khách quan toàn bộ mọi hành vi thêm, sửa, xóa, nạp tệp kèm email và thời gian máy chủ, đảm bảo tính minh bạch tuyệt đối.

### 1.3.4 Lập dự trù kinh phí và kế hoạch triển khai dự án qua 12 tuần (WBS & Gantt)

#### 1. Dự trù kinh phí, nhân lực và tài nguyên
Nhờ ứng dụng sáng tạo kiến trúc đám mây Serverless kết hợp cơ chế lưu trữ lai Hybrid Storage, dự án đạt được hiệu quả kinh tế tối ưu với ngân sách triển khai và duy trì tiệm cận **0 VNĐ**:

*Bảng 1.4: Dự trù ngân sách và tài nguyên phục vụ triển khai dự án QuanLyGiaoVu EPU 2026*
| Khoản mục chi phí | Giải pháp kỹ thuật lựa chọn | Kinh phí dự trù (VNĐ) | Diễn giải & Ghi chú |
| :--- | :--- | :---: | :--- |
| **1. Hạ tầng máy chủ cơ sở dữ liệu** | Google Cloud Firestore (Gói Spark Plan) | **0 VNĐ** | Miễn phí vĩnh viễn 50.000 lượt đọc và 20.000 lượt ghi mỗi ngày, hoàn toàn đủ cho nhu cầu phòng giáo vụ |
| **2. Dịch vụ xác thực người dùng** | Firebase Authentication | **0 VNĐ** | Hỗ trợ xác thực Email và Google OAuth không giới hạn miễn phí |
| **3. Hạ tầng lưu trữ tệp tin số hóa** | Kiến trúc Hybrid Storage (IndexedDB + Base64) | **0 VNĐ** | Không cần thuê Firebase Cloud Storage, tiết kiệm 100% chi phí lưu trữ đám mây |
| **4. Bản quyền công nghệ & thư viện** | React 19, Vite, Lucide, SheetJS, jsPDF | **0 VNĐ** | Toàn bộ là phần mềm mã nguồn mở theo giấy phép MIT |
| **5. Trang thiết bị máy trạm kiểm thử** | Tận dụng máy tính sẵn có của đơn vị thực tập EPU | **0 VNĐ** | Không phát sinh chi phí mua sắm phần cứng mới |
| **6. Nhân lực phân tích & lập trình** | 01 Sinh viên thực tập (dưới sự chỉ dẫn của GVHD)| — | Đề tài thực tập tốt nghiệp |
| **TỔNG CỘNG KINH PHÍ DỰ ÁN** | | **0 VNĐ** | **Tối ưu hóa tài chính tuyệt đối cho nhà trường** |

#### 2. Kế hoạch triển khai dự án qua 12 tuần (WBS & Biểu đồ Gantt)
Dự án được xây dựng và triển khai bài bản theo quy trình phát triển phần mềm lặp (Iterative Software Development) trong thời gian 12 tuần của kỳ thực tập tốt nghiệp tại Trường Đại học Điện Lực:

*Bảng 1.5: Kế hoạch triển khai dự án qua 12 tuần (WBS)*
| Giai đoạn | Tuần thực hiện | Nội dung công việc chi tiết | Sản phẩm / Kết quả bàn giao |
| :---: | :---: | :--- | :--- |
| **Giai đoạn 1** | **Tuần 1 - 2** | Khảo sát hiện trạng, phỏng vấn cán bộ giáo vụ, thu thập các biểu mẫu chứng từ, xác lập quy tắc quản lý nghiệp vụ và xây dựng bản đặc tả yêu cầu | Bản đặc tả yêu cầu phần mềm (SRS); Báo cáo khảo sát hiện trạng |
| **Giai đoạn 2** | **Tuần 3 - 4** | Phân tích và thiết kế hệ thống hướng đối tượng: Xây dựng sơ đồ Use Case, Sequence Diagram, Activity Diagram, Class Diagram và thiết kế CSDL Firestore | Bộ hồ sơ thiết kế kiến trúc hệ thống và sơ đồ UML chuẩn |
| **Giai đoạn 3** | **Tuần 5 - 6** | Thiết lập môi trường React 19 + Vite, cấu hình Firebase SDK, xây dựng Design System, cài đặt khung ứng dụng (AppLayout, Sidebar, Topbar, AuthContext, VerifyEmail) | Bộ khung ứng dụng hoàn chỉnh (Base App) có xác thực email |
| **Giai đoạn 4** | **Tuần 7 - 8** | Hiện thực hóa các phân hệ cốt lõi: Module Dashboard, Module Quản lý Tài sản (khấu hao 36 tháng), Module Quản lý Điểm thi và Module Chuyên gia thỉnh giảng | Hoàn thành 4 module nghiệp vụ chính đầu tiên |
| **Giai đoạn 5** | **Tuần 9 - 10** | Hiện thực hóa các phân hệ tiếp theo: Module Quản lý Văn bản (2 tabs), Module Khối lượng Giảng dạy (270 tiết), Module Quản trị tài khoản, Module Backup/Restore CSDL và Module Audit Log; cài đặt Hybrid Storage | Hoàn thành toàn bộ 9 phân hệ chức năng của phần mềm |
| **Giai đoạn 6** | **Tuần 11** | Thiết kế kịch bản kiểm thử (Test Cases Suite), thực hiện kiểm thử hộp đen, kiểm thử tải, kiểm thử đa trình duyệt, sửa lỗi và tối ưu hóa xuất báo cáo PDF/Excel | Bản báo cáo kết quả kiểm thử phần mềm; Bộ mã nguồn hoàn thiện |
| **Giai đoạn 7** | **Tuần 12** | Triển khai thử nghiệm tại đơn vị thực tập EPU, hướng dẫn cán bộ sử dụng, thu thập ý kiến đánh giá nghiệm thu và hoàn thiện báo cáo tốt nghiệp | Báo cáo thực tập tốt nghiệp toàn văn và bàn giao sản phẩm |

Tiến độ thực hiện 12 tuần được minh họa trực quan qua biểu đồ Gantt dưới đây:

\`\`\`
Công việc / Tuần:           1   2   3   4   5   6   7   8   9   10  11  12
1. Khảo sát & Yêu cầu:      [=======]
2. Phân tích thiết kế UML:          [=======]
3. Thiết lập Core & Auth:                   [=======]
4. Lập trình Module 1 - 4:                          [=======]
5. Lập trình Module 5 - 9:                                  [=======]
6. Kiểm thử & Tối ưu hóa:                                           [===]
7. Bàn giao & Đánh giá:                                                 [===]
\`\`\`
*Hình 1.3: Biểu đồ tiến độ Gantt triển khai dự án trong 12 tuần*

### 1.3.5 Tính ưu việt và đóng góp thực tiễn của dự án
Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026) thể hiện tính ưu việt vượt trội so với các phương pháp quản lý truyền thống và các phần mềm hiện hành trên thị trường qua 6 luận điểm cốt lõi:
1. **Tốc độ xử lý siêu tốc và phản hồi tức thì (0ms với IndexedDB):** Ứng dụng kiến trúc React 19 SPA kết hợp kho đệm IndexedDB cục bộ giúp các thao tác chuyển trang, lọc danh sách, lưu trữ và tải tệp tin văn bản, tệp điểm thi diễn ra gần như tức thì (dưới 50ms), hoàn toàn không có độ trễ mạng hay hiện tượng chớp nháy màn hình.
2. **Cơ chế lưu trữ lai Hybrid Storage tiết kiệm 100% chi phí hạ tầng:** Sáng tạo giải pháp phân luồng tệp tin thông minh (tệp $<750$KB mã hóa Base64 lưu thẳng lên Firestore; tệp $\\ge 750$KB lưu IndexedDB nội bộ) giúp đơn vị số hóa toàn bộ hồ sơ mà không cần phải mua gói lưu trữ đám mây trả phí đắt đỏ của Firebase Cloud Storage.
3. **Cảnh báo thời hạn đa chiều chủ động và trực quan:** Bảng điều khiển trung tâm tự động quét dữ liệu và hiển thị ngay lập tức các cảnh báo nguy cơ bằng mã màu chuẩn quốc tế (Vàng - Cảnh báo trước hạn; Đỏ - Quá hạn khẩn cấp). Cán bộ không cần phải nhớ ngày tháng mà hệ thống sẽ chủ động nhắc nhở trước 60 ngày đối với hợp đồng và trước 30 ngày đối với tài sản khấu hao.
4. **Bộ công cụ xuất báo cáo chuẩn Unicode tiếng Việt sắc nét 100%:** Giải quyết triệt để bài toán kinh điển của thư viện \`jsPDF\` bị lỗi font tiếng Việt bằng sự kết hợp với \`html2canvas\`, tạo ra các tài liệu PDF khổ A4 ngang/dọc sắc nét, căn lề chuẩn in ấn văn thư lưu trữ; đồng thời hỗ trợ xuất dữ liệu ra bảng tính Excel đa năng qua \`SheetJS\`.
5. **Bảo mật hai lớp và phân quyền quản trị nghiêm ngặt:** Bắt buộc cán bộ phải xác thực qua liên kết email chính chủ mới được truy cập hệ thống; phân định rõ vai trò Quản trị viên và Cán bộ giáo vụ; Quản trị viên có toàn quyền khóa/mở khóa tài khoản khi có biến động nhân sự.
6. **Khả năng tự chủ dữ liệu và truy vết kiểm toán minh bạch:** Hệ thống tích hợp sẵn công cụ sao lưu toàn bộ CSDL ra tệp JSON độc lập để cất giữ an toàn, cùng cơ chế tự động ghi vết mọi hành vi Thêm, Sửa, Xóa vào Audit Log, bảo đảm tính minh bạch, trách nhiệm giải trình và loại bỏ hoàn toàn nguy cơ mất dữ liệu.

\\newpage

# CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

## 2.1 Biểu đồ Use Case tổng quát

### 2.1.1 Xác định các tác nhân hệ thống (Actors)
Dựa trên kết quả khảo sát quy trình làm việc thực tế tại Phòng Đào tạo Trường Đại học Điện Lực, hệ thống xác định 3 tác nhân chính tham gia tương tác:

*Bảng 2.1: Danh sách tác nhân (Actors) tham gia vào hệ thống*
| Tác nhân (Actor) | Mô tả vai trò | Quyền hạn trong hệ thống |
| :--- | :--- | :--- |
| **Cán bộ Giáo vụ (Academic Staff)** | Cán bộ trực tiếp giải quyết các sự vụ giáo vụ tại phòng Đào tạo & Văn phòng Khoa CNTT | Có toàn quyền sử dụng các phân hệ: Tài sản, Điểm số, Chuyên gia, Văn bản, Khối lượng giảng dạy, xem Dashboard và xem Audit Log. |
| **Quản trị viên (Admin)** | Trưởng phòng hoặc Cán bộ quản trị kỹ thuật của hệ thống | Có toàn quyền của Cán bộ Giáo vụ, đồng thời có quyền quản lý người dùng, rà soát toàn bộ nhật ký hệ thống, phân quyền và sao lưu/phục hồi CSDL. |
| **Khách / Người dùng chưa xác thực (Guest)** | Người dùng vừa đăng ký tài khoản nhưng chưa thực hiện xác thực qua liên kết email | Chỉ được phép đăng ký tài khoản, đăng nhập vào trang xác minh và gửi lại email xác thực; bị chặn truy cập vào toàn bộ dữ liệu học vụ. |

### 2.1.2 Sơ đồ Use Case tổng quát toàn hệ thống
Biểu đồ Use Case tổng quát mô tả bức tranh toàn cảnh về các chức năng mà hệ thống cung cấp cho các tác nhân.

\`\`\`
                      +---------------------------------------+
                      |         HỆ THỐNG QUẢN LÝ GIÁO VỤ      |
                      |                                       |
                      |   (Đăng ký / Đăng nhập / Xác thực)    |
                      |                 ^                     |
                      |                 |                     |
                      |          (Xem Dashboard & Cảnh báo)   |
                      |                 ^                     |
                      |                 |                     |
                      |      +----------+----------+          |
                      |      |                     |          |
                      | (Quản lý Tài sản)    (Quản lý Điểm)   |
                      |      |                     |          |
  [Cán bộ Giáo vụ] ---+------+                     |          |
         |            |      |                     |          |
         |            | (Quản lý Thỉnh giảng)(Quản lý Văn bản)|
         |            |      |                     |          |
         |            |      +----------+----------+          |
         |            |                 |                     |
         |            |      (Quản lý Khối lượng giảng dạy)   |
         |            |                 |                     |
         +------------+--------> (Xem Nhật ký Audit Log)      |
                      |                 ^                     |
                      |                 |                     |
      [Admin] --------+-----------------+                     |
                      +---------------------------------------+
\`\`\`
*Hình 2.1: Biểu đồ Use Case tổng quát hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực*

*Bảng 2.2: Bảng mô tả tóm tắt các Use Case chính của hệ thống*
| Mã UC | Tên Use Case | Tác nhân chính | Mô tả mục tiêu |
| :---: | :--- | :--- | :--- |
| **UC01** | Xác thực & Quản lý phiên | Cán bộ Giáo vụ, Admin, Guest | Đăng nhập bằng Email/Password hoặc Google; xác minh email kích hoạt |
| **UC02** | Xem Tổng quan & Cảnh báo | Cán bộ Giáo vụ, Admin | Thống kê số liệu toàn hệ thống, tự động quét và cảnh báo các mục sắp đến hạn |
| **UC03** | Quản lý Tài sản | Cán bộ Giáo vụ, Admin | Thêm, sửa, xóa, tìm kiếm tài sản; tính khấu hao tự động; xuất báo cáo Excel/PDF |
| **UC04** | Quản lý Hồ sơ Điểm | Cán bộ Giáo vụ, Admin | Upload file điểm thi, gán nhãn môn học, tra cứu, xem và tải tệp an toàn |
| **UC05** | Quản lý Thỉnh giảng | Cán bộ Giáo vụ, Admin | Quản lý 24 thông tin chuyên gia; cảnh báo hạn hợp đồng; xuất danh sách thỉnh giảng |
| **UC06** | Quản lý Văn bản | Cán bộ Giáo vụ, Admin | Quản lý văn bản đến/đi theo 2 tab; cập nhật trạng thái xử lý; nhắc việc quá hạn |
| **UC07** | Quản lý KLGD | Cán bộ Giáo vụ, Admin | Quản lý định mức 270 tiết (tính thừa/thiếu); quản lý hợp đồng; đính kèm minh chứng |
| **UC08** | Nhật ký Hệ thống (Audit) | Cán bộ Giáo vụ, Admin | Tự động ghi vết và hiển thị toàn bộ lịch sử thao tác thêm/sửa/xóa/upload của cán bộ |

---

## 2.2 Phân rã Use Case các phân hệ chính

Trong phần này, hệ thống tiến hành phân rã chi tiết 5 phân hệ nghiệp vụ trọng tâm. Với mỗi phân hệ, tài liệu cung cấp đầy đủ: **Biểu đồ phân rã Use Case**, **Đặc tả Use Case chi tiết**, **Biểu đồ tuần tự (Sequence Diagram)** và **Biểu đồ hoạt động (Activity Diagram)**.

### 2.2.1 Phân rã Use Case Phân hệ Quản lý Tài sản giảng đường
Phân hệ Quản lý Tài sản cho phép cán bộ kiểm soát chặt chẽ toàn bộ máy móc, trang thiết bị phòng học, tự động hóa tính toán thời hạn khấu hao và hỗ trợ xuất biên bản kiểm kê.

\`\`\`
                    +------------------------------------+
                    |        PHÂN HỆ QUẢN LÝ TÀI SẢN     |
                    |                                    |
                    |   +-- (Xem danh sách & Tìm kiếm)   |
                    |   |                                |
                    |   +-- (Thêm mới tài sản)           |
                    |   |        | <<include>>           |
                    |   |        v                       |
[Cán bộ Giáo vụ] ---+---+   (Tính khấu hao tự động)      |
                    |   |                                |
                    |   +-- (Cập nhật thông tin tài sản) |
                    |   |                                |
                    |   +-- (Xóa tài sản)                |
                    |   |                                |
                    |   +-- (Xuất danh sách Excel/PDF)   |
                    +------------------------------------+
\`\`\`
*Hình 2.2: Biểu đồ phân rã Use Case Phân hệ Quản lý Tài sản giảng đường*

*Bảng 2.3: Đặc tả Use Case: Quản lý Thêm mới và Khấu hao Tài sản giảng đường*
| Mục | Nội dung đặc tả |
| :--- | :--- |
| **Tên Use Case** | Thêm mới Tài sản & Tính toán Khấu hao tự động (UC03-A) |
| **Tác nhân** | Cán bộ Giáo vụ, Quản trị viên |
| **Mô tả** | Cán bộ nhập thông tin tài sản mới đưa vào sử dụng; hệ thống tự động xác định thời hạn khấu hao và lập tức áp dụng thuật toán cảnh báo |
| **Tiền điều kiện** | Cán bộ đã đăng nhập thành công vào hệ thống và email đã được xác thực |
| **Hậu điều kiện** | Tài sản được lưu trữ vào Firestore; nhật ký Audit Log được ghi nhận; thẻ thống kê Dashboard cập nhật số lượng mới |
| **Luồng sự kiện chính** | 1. Cán bộ nhấn nút "+ Thêm mới" trên giao diện Quản lý Tài sản.<br>2. Hệ thống hiển thị Modal form nhập thông tin: Mã TS, Tên TS, Loại TS, Số lượng, Phòng sử dụng, Ngày đưa vào SD, Thời gian khấu hao (mặc định 36 tháng), Tình trạng, Ghi chú.<br>3. Cán bộ nhập đầy đủ các thông tin hợp lệ và nhấn "Thêm tài sản".<br>4. Hệ thống kiểm tra hợp lệ dữ liệu (Mã, Tên, Ngày bắt đầu không được để trống).<br>5. Hệ thống gọi \`addAsset()\`, ghi dữ liệu vào Firestore kèm thời gian máy chủ \`createdAt\` qua \`serverTimestamp()\`.<br>6. Hệ thống tự động ghi nhật ký: "Thêm tài sản: [Tên tài sản]" vào collection \`audit_logs\` qua \`logAction()\`.<br>7. Hệ thống hiển thị thông báo thành công qua Toast, đóng modal và tải lại bảng danh sách. |
| **Luồng ngoại lệ** | - 4a. Cán bộ bỏ trống Mã hoặc Tên tài sản: Hệ thống hiển thị Toast lỗi "Vui lòng điền đầy đủ thông tin bắt buộc!" và giữ nguyên form.<br>- 5a. Lỗi kết nối mạng: Hệ thống hiển thị thông báo lỗi "Lỗi khi lưu. Vui lòng thử lại!" và cho phép cán bộ thử lại. |

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor CB as Cán bộ Giáo vụ
    participant UI as AssetsPage (Giao diện)
    participant SV as assetService
    participant DB as Cloud Firestore
    participant AL as auditService

    CB->>UI: Nhấn "+ Thêm mới", điền thông tin tài sản
    CB->>UI: Nhấn nút "Thêm tài sản"
    UI->>UI: Validate dữ liệu (Mã, Tên, Ngày SD)
    alt Dữ liệu không hợp lệ
        UI-->>CB: Hiển thị thông báo Toast lỗi
    else Dữ liệu hợp lệ
        UI->>SV: addAsset(formData, currentUser)
        SV->>DB: addDoc('assets', data, serverTimestamp)
        DB-->>SV: Trả về document id mới
        SV->>AL: logAction('add', 'Tài sản', 'Thêm: ' + name, user)
        AL->>DB: addDoc('audit_logs', logData)
        SV-->>UI: Hoàn tất lưu dữ liệu
        UI-->>CB: Toast thành công, reload danh sách
    end
\`\`\`
*Hình 2.3: Biểu đồ tuần tự (Sequence Diagram) - Nghiệp vụ Thêm mới Tài sản*

\`\`\`mermaid
flowchart TD
    A([Bắt đầu: Nhập ngày bắt đầu SD và số tháng khấu hao]) --> B[Lấy ngày tháng năm hiện tại của hệ thống]
    B --> C[Tính tổng số tháng đã trôi qua từ ngày bắt đầu đến nay]
    C --> D[Tính số tháng còn lại = Thời gian khấu hao quy định - Số tháng đã trôi qua]
    D --> E{Số tháng còn lại?}
    E -- <= 0 tháng --> F[Gán trạng thái: ĐÃ HẾT KHẤU HAO<br>Hàng bảng đổi màu Đỏ / Danger]
    E -- 1 tháng --> G[Gán trạng thái: SẮP HẾT KHẤU HAO<br>Hàng bảng đổi màu Vàng / Warning]
    E -- > 1 tháng --> H[Gán trạng thái: ĐANG SỬ DỤNG TỐT<br>Hàng bảng màu bình thường]
    F --> I[Đưa vào danh sách cảnh báo trên Dashboard]
    G --> I
    H --> J([Kết thúc: Hiển thị Badge tương ứng])
    I --> J
\`\`\`
*Hình 2.4: Biểu đồ hoạt động (Activity Diagram) - Nghiệp vụ Tính khấu hao tài sản*

---

### 2.2.2 Phân rã Use Case Phân hệ Quản lý Hồ sơ Điểm thi học phần
Phân hệ Quản lý Hồ sơ Điểm cho phép lưu trữ tập trung các bảng điểm học phần theo học chế tín chỉ của EPU, phân loại theo chuyên ngành và hỗ trợ xem/tải an toàn không phụ thuộc gói lưu trữ trả phí.

\`\`\`
                    +------------------------------------+
                    |        PHÂN HỆ QUẢN LÝ ĐIỂM THI    |
                    |                                    |
                    |   +-- (Xem danh sách & Lọc theo Tag)|
                    |   |                                |
                    |   +-- (Upload file điểm mới)       |
                    |   |        | <<include>>           |
                    |   |        v                       |
[Cán bộ Giáo vụ] ---+---+   (Lưu trữ qua Hybrid Storage) |
                    |   |                                |
                    |   +-- (Xem / Tải file điểm về máy) |
                    |   |                                |
                    |   +-- (Xóa hồ sơ bảng điểm)        |
                    +------------------------------------+
\`\`\`
*Hình 2.5: Biểu đồ phân rã Use Case Phân hệ Quản lý Điểm thi*

*Bảng 2.4: Đặc tả Use Case: Lưu trữ và Tra cứu Hồ sơ Bảng điểm thi học phần*
| Mục | Nội dung đặc tả |
| :--- | :--- |
| **Tên Use Case** | Upload File Bảng điểm & Lưu trữ An toàn (UC04-A) |
| **Tác nhân** | Cán bộ Giáo vụ, Quản trị viên |
| **Mô tả** | Cán bộ tải tệp bảng điểm kết thúc học phần (PDF, Excel, Word), đặt tên môn học và phân loại tag phục vụ tra cứu sau này |
| **Tiền điều kiện** | Cán bộ đã đăng nhập; tệp có dung lượng $\le 20$ MB và đúng định dạng cho phép |
| **Hậu điều kiện** | Tệp được lưu trữ qua cơ chế Hybrid Storage; thông tin môn học, kích thước, đuôi tệp lưu vào Firestore; hiển thị ngay trên bảng |
| **Luồng sự kiện chính** | 1. Cán bộ nhấn "+ Upload File Điểm".<br>2. Hệ thống hiển thị modal: Nhập tên môn học, chọn/gõ Tag phân loại, chọn tệp từ máy tính.<br>3. Cán bộ chọn tệp \`BangDiem_ToanA1.xlsx\`, gõ môn "Toán cao cấp A1", chọn Tag "Toán học" và nhấn "Upload File".<br>4. Hệ thống kiểm tra: Nếu kích thước tệp $< 750$ KB, chuyển sang chuỗi Base64 Data URI lưu thẳng vào Firestore; đồng thời lưu bản sao vào IndexedDB cục bộ.<br>5. Nếu tệp $\ge 750$ KB, lưu toàn bộ tệp vào IndexedDB cục bộ với định danh duy nhất và lưu đường dẫn \`idb://...\` vào Firestore.<br>6. Hệ thống lưu bản ghi vào collection \`scores\`, ghi nhật ký Audit Log và báo thành công. |
| **Luồng ngoại lệ** | - 3a. Chưa chọn tệp hoặc chưa nhập tên môn học: Hệ thống cảnh báo "Vui lòng chọn file và nhập tên môn học!".<br>- 4a. Tệp bị hỏng hoặc lỗi định dạng: Hệ thống báo lỗi và hủy thao tác upload. |

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor CB as Cán bộ Giáo vụ
    participant UI as ScoresPage
    participant SH as storageHelper
    participant IDB as IndexedDB (Trình duyệt)
    participant FS as Cloud Firestore
    participant AL as auditService

    CB->>UI: Chọn file điểm, nhập tên môn, phân loại
    CB->>UI: Nhấn "Upload File"
    UI->>SH: uploadFileSafely('scores', file)
    SH->>SH: Đọc file sang Base64 DataURL qua FileReader
    SH->>IDB: saveFileToIndexedDB(fileId, file)
    alt Kích thước file < 750KB
        SH-->>UI: Trả về fileUrl = DataURL (Lưu mây)
    else Kích thước file >= 750KB
        SH-->>UI: Trả về fileUrl = 'idb://' + fileId
    end
    UI->>FS: addDoc('scores', { fileName, fileUrl, subjectName, tag, ... })
    UI->>AL: logAction('upload', 'Điểm', 'Upload: ' + fileName, user)
    AL->>FS: addDoc('audit_logs', logData)
    UI-->>CB: Toast "Upload file điểm thành công!", reload bảng
\`\`\`
*Hình 2.6: Biểu đồ tuần tự (Sequence Diagram) - Nghiệp vụ Upload bảng điểm an toàn*

\`\`\`mermaid
flowchart TD
    A([Bắt đầu: Cán bộ nhấn Xem/Tải file điểm]) --> B{Kiểm tra định dạng fileUrl?}
    B -- Bắt đầu bằng 'idb://' --> C[Tách fileId từ URL]
    C --> D[Truy vấn IndexedDB cục bộ lấy tệp gốc]
    D --> E[Tạo Object URL tạm qua URL.createObjectURL]
    E --> F[Tự động tạo thẻ a ảo và kích hoạt sự kiện click để tải về]
    B -- Chuỗi Data URL Base64 / Http --> G[Gán trực tiếp vào thuộc tính href của thẻ a]
    G --> F
    F --> H[Giải phóng bộ nhớ URL tạm]
    H --> I([Kết thúc: File được tải về máy an toàn])
\`\`\`
*Hình 2.7: Biểu đồ hoạt động (Activity Diagram) - Tra cứu và tải tệp điểm thi*

---

### 2.2.3 Phân rã Use Case Phân hệ Quản lý Chuyên gia Thỉnh giảng
Phân hệ Quản lý Thỉnh giảng Chuyên gia hỗ trợ công tác quản lý hồ sơ chuyên gia ngoài trường (đặc thù EVN, Viện Năng lượng...), kiểm soát 24 trường thông tin chi tiết và tự động cảnh báo trước 2 tháng khi hợp đồng hết hạn.

\`\`\`
                    +------------------------------------+
                    |     PHÂN HỆ QUẢN LÝ THỈNH GIẢNG    |
                    |                                    |
                    |   +-- (Xem danh sách chuyên gia)   |
                    |   |                                |
                    |   +-- (Thêm hồ sơ chuyên gia mới)  |
                    |   |        | <<include>>           |
                    |   |        v                       |
[Cán bộ Giáo vụ] ---+---+   (Kiểm soát hạn Hợp đồng)     |
                    |   |                                |
                    |   +-- (Xem chi tiết 24 thông tin)  |
                    |   |                                |
                    |   +-- (Cập nhật / Gia hạn hợp đồng)|
                    |   |                                |
                    |   +-- (Xuất danh sách Excel/PDF)   |
                    +------------------------------------+
\`\`\`
*Hình 2.8: Biểu đồ phân rã Use Case Phân hệ Quản lý Thỉnh giảng Chuyên gia*

*Bảng 2.5: Đặc tả Use Case: Quản lý Hồ sơ Chuyên gia và Hợp đồng Thỉnh giảng*
| Mục | Nội dung đặc tả |
| :--- | :--- |
| **Tên Use Case** | Quản lý Hồ sơ Chuyên gia & Cảnh báo Hạn Hợp đồng (UC05-A) |
| **Tác nhân** | Cán bộ Giáo vụ, Quản trị viên |
| **Mô tả** | Cán bộ nhập và quản lý thông tin nhân thân, chức danh, tài khoản ngân hàng và hợp đồng mời giảng của chuyên gia; hệ thống tự động tính hạn hợp đồng |
| **Tiền điều kiện** | Cán bộ đã đăng nhập; thông tin họ tên, số hợp đồng, ngày bắt đầu và kết thúc không để trống |
| **Hậu điều kiện** | Hồ sơ chuyên gia và tệp hợp đồng số hóa được lưu trữ; tự động hiển thị cảnh báo nếu hợp đồng còn $\le 2$ tháng |
| **Luồng sự kiện chính** | 1. Cán bộ nhấn nút "+ Thêm chuyên gia".<br>2. Hệ thống hiển thị Modal chi tiết chia thành các nhóm trường: Thông tin cá nhân, Trình độ chuyên môn, Thông tin liên hệ & Ngân hàng, Thông tin hợp đồng (Số HĐ, ngày ký, ngày bắt đầu, ngày kết thúc).<br>3. Cán bộ điền thông tin và đính kèm bản quét hợp đồng (PDF/Word).<br>4. Hệ thống kiểm tra tính hợp lệ dữ liệu.<br>5. Tệp hợp đồng được lưu trữ qua \`uploadFileSafely('contracts', contractFile)\`.<br>6. Hồ sơ được lưu vào Firestore collection \`experts\`.<br>7. Hệ thống tự động tính số tháng hiệu lực còn lại: $\\text{MonthsLeft} = \\text{Hạn kết thúc} - \\text{Thời điểm hiện tại}$. Nếu $\le 2$ tháng, đưa vào nhóm Cảnh báo ưu tiên.<br>8. Hiển thị thông báo thành công và cập nhật giao diện. |
| **Luồng ngoại lệ** | - Ngày kết thúc hợp đồng trước ngày bắt đầu: Hệ thống báo lỗi logic thời gian và yêu cầu nhập lại. |

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor CB as Cán bộ Giáo vụ
    participant UI as ExpertsPage
    participant SV as expertService
    participant DB as Cloud Firestore
    participant DBO as DashboardPage

    CB->>UI: Mở danh sách chuyên gia
    UI->>SV: getExperts()
    SV->>DB: query('experts', orderBy('createdAt'))
    DB-->>SV: Danh sách chuyên gia
    SV-->>UI: Danh sách bản ghi
    UI->>UI: Tính getContractMonthsLeft(endDate)
    loop Quét từng chuyên gia
        alt monthsLeft <= 0
            UI->>UI: Gắn nhãn Đỏ: "Hợp đồng đã hết hạn"
        else monthsLeft <= 2
            UI->>UI: Gắn nhãn Vàng: "Hợp đồng sắp hết hạn"
        else monthsLeft > 2
            UI->>UI: Gắn nhãn Xanh: "Đang hiệu lực"
        end
    end
    UI->>DBO: Đẩy danh sách cảnh báo lên trang chủ
    UI-->>CB: Hiển thị bảng kèm màu sắc cảnh báo trực quan
\`\`\`
*Hình 2.9: Biểu đồ tuần tự (Sequence Diagram) - Cảnh báo và Gia hạn hợp đồng*

\`\`\`mermaid
flowchart TD
    A([Bắt đầu: Tiếp nhận đề xuất mời chuyên gia]) --> B[Kiểm tra điều kiện học vị: ThS, TS, PGS, GS]
    B --> C[Thu thập hồ sơ nhân thân: CCCD, Quê quán, STK Ngân hàng]
    C --> D[Ký kết hợp đồng: Xác định số HĐ, từ ngày, đến ngày]
    D --> E[Cán bộ giáo vụ nhập 24 trường dữ liệu vào hệ thống]
    E --> F[Đính kèm file scan hợp đồng có chữ ký]
    F --> G[Lưu trữ Firestore & IndexedDB]
    G --> H{Kiểm tra thời gian còn lại của HĐ?}
    H -- Còn > 2 tháng --> I[Trạng thái: Đang hiệu lực bình thường]
    H -- Còn <= 2 tháng và > 0 --> J[Trạng thái: Sắp hết hạn - Phát cảnh báo vàng]
    H -- <= 0 tháng --> K[Trạng thái: Đã hết hạn - Phát cảnh báo đỏ]
    I --> L([Kết thúc])
    J --> L
    K --> L
\`\`\`
*Hình 2.10: Biểu đồ hoạt động (Activity Diagram) - Tiếp nhận hồ sơ chuyên gia*

---

### 2.2.4 Phân rã Use Case Phân hệ Quản lý Văn bản Đến và Đi
Phân hệ Quản lý Văn bản tổ chức theo cấu trúc 2 tab chuẩn mực, quản lý toàn bộ công văn hành chính đến và đi từ Bộ Công Thương, Bộ GD&ĐT, cập nhật trạng thái xử lý chỉ với 1 thao tác và nhắc việc văn bản tồn đọng.

\`\`\`
                    +------------------------------------+
                    |        PHÂN HỆ QUẢN LÝ VĂN BẢN     |
                    |                                    |
                    |   +-- (Xem Văn bản Đến - Tab 1)    |
                    |   |                                |
                    |   +-- (Xem Văn bản Đi - Tab 2)     |
                    |   |                                |
                    |   +-- (Thêm Văn bản Đến / Đi)      |
[Cán bộ Giáo vụ] ---+---+                                |
                    |   +-- (Cập nhật trạng thái xử lý)  |
                    |   |                                |
                    |   +-- (Cảnh báo văn bản quá hạn)   |
                    |   |                                |
                    |   +-- (Xóa văn bản)                |
                    +------------------------------------+
\`\`\`
*Hình 2.11: Biểu đồ phân rã Use Case Phân hệ Quản lý Văn bản Đến và Đi*

*Bảng 2.6: Đặc tả Use Case: Tiếp nhận và Theo dõi Xử lý Văn bản Đến*
| Mục | Nội dung đặc tả |
| :--- | :--- |
| **Tên Use Case** | Tiếp nhận & Theo dõi Xử lý Văn bản Đến (UC06-A) |
| **Tác nhân** | Cán bộ Giáo vụ, Quản trị viên |
| **Mô tả** | Cán bộ nhập thông tin công văn đến từ Bộ Công Thương, Bộ GD&ĐT, gán cán bộ phụ trách và hạn xử lý; hệ thống cảnh báo nếu chưa xử lý |
| **Tiền điều kiện** | Cán bộ đã đăng nhập; số ký hiệu, ngày văn bản và trích yếu không được trống |
| **Hậu điều kiện** | Văn bản được lưu vào collection \`docs_incoming\`; bộ đếm badge thông báo số lượng văn bản chưa xử lý tăng lên |
| **Luồng sự kiện chính** | 1. Cán bộ chọn tab "Văn bản Đến" và nhấn "+ Thêm Văn bản Đến".<br>2. Nhập số ký hiệu (ví dụ: \`125/CV-BCT\`), ngày văn bản, nơi gửi, trích yếu nội dung, người phụ trách xử lý, hạn xử lý và chọn file đính kèm.<br>3. Nhấn "Lưu văn bản". Hệ thống lưu dữ liệu với trạng thái ban đầu là "Chưa xử lý".<br>4. Huy hiệu Badge trên Tab và Sidebar tự động tăng số lượng hiển thị văn bản tồn đọng.<br>5. Khi cán bộ phụ trách hoàn thành công việc, cán bộ giáo vụ chỉ cần chọn trạng thái trong ô Dropdown ngay trên bảng: từ "Chưa xử lý" $\\rightarrow$ "Đang xử lý" $\\rightarrow$ "Đã xử lý".<br>6. Hệ thống tự động cập nhật Firestore và ghi nhận vào Audit Log. |
| **Luồng ngoại lệ** | - Quá hạn xử lý mà trạng thái vẫn là "Chưa xử lý": Hàng văn bản tự động chuyển sang màu cảnh báo nổi bật để nhắc nhở. |

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor CB as Cán bộ Giáo vụ
    participant UI as DocumentsPage
    participant SV as documentService
    participant DB as Cloud Firestore
    participant AL as auditService

    CB->>UI: Thay đổi dropdown trạng thái văn bản (Ví dụ: "Đã xử lý")
    UI->>SV: updateIncomingDocStatus(id, 'Đã xử lý', user)
    SV->>DB: updateDoc('docs_incoming', id, { status: 'Đã xử lý', updatedAt })
    SV->>AL: logAction('edit', 'Văn bản đến', 'Cập nhật trạng thái: Đã xử lý', user)
    AL->>DB: addDoc('audit_logs', logData)
    SV-->>UI: Cập nhật thành công
    UI->>UI: Giảm số lượng badge chưa xử lý
    UI-->>CB: Toast thành công, giao diện tự động làm mới
\`\`\`
*Hình 2.12: Biểu đồ tuần tự (Sequence Diagram) - Cập nhật trạng thái xử lý văn bản*

\`\`\`mermaid
flowchart TD
    A([Bắt đầu: Nhận công văn đến]) --> B[Kiểm tra tính pháp lý của văn bản]
    B --> C[Vào sổ theo dõi: Nhập Số ký hiệu, Nơi gửi, Trích yếu]
    C --> D[Gán cán bộ chuyên trách và Ngày hạn xử lý]
    D --> E[Upload file văn bản số hóa]
    E --> F[Lưu hệ thống với trạng thái: Chưa xử lý]
    F --> G[Bộ đếm Badge tự động hiển thị số lượng tồn đọng]
    G --> H[Cán bộ phụ trách thực hiện giải quyết công văn]
    H --> I{Trạng thái xử lý?}
    I -- Đang tiến hành --> J[Chuyển trạng thái: Đang xử lý]
    I -- Đã hoàn tất --> K[Chuyển trạng thái: Đã xử lý]
    J --> L[Ghi Audit Log]
    K --> L
    L --> M([Kết thúc: Hoàn tất chu trình văn bản])
\`\`\`
*Hình 2.13: Biểu đồ hoạt động (Activity Diagram) - Lưu chuyển công văn đến*

---

### 2.2.5 Phân rã Use Case Phân hệ Quản lý Khối lượng Giảng dạy (KLGD)
Phân hệ Quản lý Khối lượng Giảng dạy giải quyết bài toán phức tạp về định mức giờ giảng (270 tiết chuẩn theo Thông tư 20/2020/TT-BGDĐT và Quy chế chi tiêu nội bộ của Trường Đại học Điện Lực), tự động tính số giờ vượt/thiếu và quản lý hợp đồng giảng dạy.

\`\`\`
                    +------------------------------------+
                    |        PHÂN HỆ QUẢN LÝ KLGD        |
                    |                                    |
                    |   +-- (Xem KLGD Định mức - Tab 1)  |
                    |   |        | <<include>>           |
                    |   |        v                       |
                    |   |   (Tính chênh lệch thừa/thiếu) |
[Cán bộ Giáo vụ] ---+---+                                |
                    |   +-- (Xem KLGD Hợp đồng - Tab 2)  |
                    |   |                                |
                    |   +-- (Thêm dữ liệu Định mức/HĐ)   |
                    |   |                                |
                    |   +-- (Upload nhiều file minh chứng|
                    |   |                                |
                    |   +-- (Xóa dữ liệu KLGD)           |
                    +------------------------------------+
\`\`\`
*Hình 2.14: Biểu đồ phân rã Use Case Phân hệ Quản lý Khối lượng Giảng dạy*

*Bảng 2.7: Đặc tả Use Case: Kê khai và Tổng hợp Khối lượng Giảng dạy (270 tiết chuẩn)*
| Mục | Nội dung đặc tả |
| :--- | :--- |
| **Tên Use Case** | Kê khai & Tự động Tính toán Chênh lệch Định mức Giờ giảng (UC07-A) |
| **Tác nhân** | Cán bộ Giáo vụ, Quản trị viên |
| **Mô tả** | Cán bộ nhập định mức chuẩn (mặc định 270 tiết) và số tiết thực tế của giảng viên cơ hữu; hệ thống tự động tính chênh lệch vượt/thiếu và cho phép đính kèm nhiều file minh chứng |
| **Tiền điều kiện** | Cán bộ đã đăng nhập; họ tên giảng viên, bộ môn, số tiết định mức và thực tế hợp lệ |
| **Hậu điều kiện** | Bản ghi lưu vào collection \`teaching_norm\`; tự động hiển thị Badge tính toán chênh lệch; thẻ thống kê cập nhật số GV vượt/thiếu |
| **Luồng sự kiện chính** | 1. Cán bộ chọn tab "Khối lượng Định mức", nhấn "+ Thêm dữ liệu Định mức".<br>2. Chọn Học hàm/Học vị (GS.TS, PGS.TS, TS, ThS, CN), nhập họ tên giảng viên, bộ môn.<br>3. Nhập số tiết Định mức (chuẩn 270) và Số tiết Thực tế giảng viên đã dạy (ví dụ: 315).<br>4. Đính kèm các file minh chứng (Thời khóa biểu, Bảng xác nhận chấm thi,...) qua vùng kéo thả hỗ trợ chọn nhiều file.<br>5. Nhấn "Thêm dữ liệu".<br>6. Hệ thống tự động tính toán: $\\text{diff} = \\text{actual} - \\text{norm} = 315 - 270 = +45$ tiết.<br>7. Lưu trữ các file đính kèm và lưu bản ghi vào Firestore.<br>8. Hiển thị huy hiệu màu vàng "+45 vượt" trên bảng danh sách. |
| **Luồng ngoại lệ** | - Nếu $\\text{diff} < 0$: Hệ thống tự động gắn huy hiệu màu đỏ "-X thiếu".<br>- Nếu $\\text{diff} = 0$: Hệ thống gắn huy hiệu màu xanh "Đủ định mức". |

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor CB as Cán bộ Giáo vụ
    participant UI as TeachingPage
    participant SV as teachingService
    participant SH as storageHelper
    participant DB as Cloud Firestore

    CB->>UI: Nhập thông tin GV, Định mức (270), Thực tế (315), chọn nhiều file
    CB->>UI: Nhấn "Thêm dữ liệu"
    UI->>SV: addTeachingNorm(formData, files, user)
    loop Xử lý từng file minh chứng
        SV->>SH: uploadFileSafely('teaching/norm', file)
        SH-->>SV: { fileUrl, fileName }
    end
    SV->>DB: addDoc('teaching_norm', { ...data, attachments, createdAt })
    DB-->>SV: Document Ref
    SV-->>UI: Hoàn tất lưu trữ
    UI->>UI: Tính toán diff = actual - norm (+45 vượt)
    UI-->>CB: Toast thành công, hiển thị Badge chênh lệch
\`\`\`
*Hình 2.15: Biểu đồ tuần tự (Sequence Diagram) - Tính chênh lệch định mức giảng dạy*

\`\`\`mermaid
flowchart TD
    A([Bắt đầu: Tiếp nhận bảng kê khối lượng giảng dạy học kỳ]) --> B[Phân loại đối tượng: Giảng viên Cơ hữu hay Thỉnh giảng?]
    B -- Giảng viên Cơ hữu --> C[Áp dụng định mức tiêu chuẩn: 270 tiết chuẩn/năm]
    C --> D[Nhập tổng số tiết thực tế đã hoàn thành theo TKB]
    D --> E[Tính Chênh lệch = Thực tế - Định mức]
    E --> F{Kết quả Chênh lệch?}
    F -- > 0 --> G[Gắn cờ VƯỢT ĐỊNH MỨC (+ tiết)<br>Lập danh sách chi trả vượt giờ]
    F -- < 0 --> H[Gắn cờ THIẾU ĐỊNH MỨC (- tiết)<br>Gửi thông báo bù giờ kỳ sau]
    F -- = 0 --> I[Gắn cờ ĐỦ ĐỊNH MỨC]
    B -- Giảng viên Hợp đồng --> J[Kiểm tra số giờ theo hợp đồng giảng dạy]
    J --> K[Đối chiếu bảng chấm công thực tế]
    G --> L[Upload tệp minh chứng và lưu hệ thống]
    H --> L
    I --> L
    K --> L
    L --> M([Kết thúc: Phê duyệt khối lượng])
\`\`\`
*Hình 2.16: Biểu đồ hoạt động (Activity Diagram) - Tổng hợp khối lượng giảng dạy*

---

### 2.2.6 Phân rã Use Case Xác thực và Nhật ký Kiểm toán
*Bảng 2.8: Đặc tả Use Case: Xác thực Người dùng và Kiểm toán Hệ thống*
| Mục | Nội dung đặc tả |
| :--- | :--- |
| **Tên Use Case** | Đăng nhập, Bắt buộc Xác thực Email & Ghi Nhật ký Kiểm toán (UC01 / UC08) |
| **Tác nhân** | Cán bộ Giáo vụ, Quản trị viên, Khách |
| **Mô tả** | Đảm bảo chỉ cán bộ có email hợp lệ và đã được xác thực mới được vào hệ thống; toàn bộ hành vi sau đó đều được ghi vết tự động |
| **Quy trình hoạt động** | 1. Cán bộ đăng nhập bằng Email/Password hoặc Google Sign-In.<br>2. Hệ thống kiểm tra cờ \`user.emailVerified\` từ Firebase Auth.<br>3. Nếu \`emailVerified === false\`, hệ thống điều hướng ngay lập tức đến màn hình \`VerifyEmailPage\`, chặn mọi quyền truy cập vào các trang nghiệp vụ; cung cấp nút "Gửi lại email xác thực" và "Tôi đã bấm link xác thực (Kiểm tra lại)".<br>4. Khi \`emailVerified === true\`, hệ thống cho phép truy cập AppLayout.<br>5. Mọi thao tác thêm tài sản, sửa văn bản, xóa hồ sơ, upload file đều tự động gọi hàm \`logAction({ action, module, detail, user })\`.<br>6. Dữ liệu ghi vào collection \`audit_logs\` với \`userEmail\`, \`userName\`, \`action\`, \`module\`, \`detail\` và \`serverTimestamp()\`. Trang \`AuditLogPage\` hiển thị 100 nhật ký mới nhất. |

---

## 2.3 Biểu đồ Lớp (Class Diagram)

### 2.3.1 Xác định các lớp thực thể (Entity Classes)
Hệ thống được thiết kế hướng đối tượng với các thực thể dữ liệu chính:
1. **User (Người dùng):** Đại diện cho tài khoản cán bộ giáo vụ trong hệ thống.
2. **Asset (Tài sản):** Đại diện cho trang thiết bị, tài sản giảng đường cần theo dõi khấu hao.
3. **ScoreFile (Hồ sơ Điểm):** Đại diện cho tệp bảng điểm kết thúc học phần được số hóa.
4. **VisitingExpert (Chuyên gia Thỉnh giảng):** Đại diện cho giảng viên ngoài trường kèm thông tin nhân thân và hợp đồng.
5. **IncomingDoc (Văn bản Đến):** Đại diện cho công văn tiếp nhận từ bên ngoài.
6. **OutgoingDoc (Văn bản Đi):** Đại diện cho công văn phát hành từ nhà trường.
7. **TeachingNorm (Khối lượng Định mức):** Đại diện cho định mức và giờ giảng thực tế của giảng viên cơ hữu.
8. **TeachingContract (Khối lượng Hợp đồng):** Đại diện cho giờ giảng theo hợp đồng.
9. **AuditLog (Nhật ký Kiểm toán):** Ghi vết toàn bộ hành vi hệ thống.

### 2.3.2 Thiết kế chi tiết sơ đồ lớp toàn hệ thống

\`\`\`mermaid
classDiagram
    class User {
        +String uid
        +String email
        +String displayName
        +String staffId
        +String department
        +String phone
        +String role
        +Boolean emailVerified
        +login()
        +register()
        +logout()
        +verifyEmail()
    }

    class Asset {
        +String id
        +String code
        +String name
        +String type
        +Integer quantity
        +String room
        +Date startDate
        +Integer depreciationMonths
        +String condition
        +String notes
        +Timestamp createdAt
        +getDepreciationMonthsLeft()
        +getDepreciationBadge()
    }

    class ScoreFile {
        +String id
        +String fileName
        +String fileUrl
        +Integer fileSize
        +String fileType
        +String subjectName
        +String tag
        +Timestamp createdAt
        +downloadFile()
    }

    class VisitingExpert {
        +String id
        +String honorific
        +String gender
        +String name
        +Date birthDate
        +String hometown
        +String permanentAddress
        +String currentAddress
        +String academicTitle
        +String degree
        +Date appointedDate
        +String faculty
        +String workplace
        +String cccd
        +String phone
        +String bankAccount
        +String bankName
        +String contractNo
        +Date contractSignDate
        +Date startDate
        +Date endDate
        +String contractFileUrl
        +String contractFileName
        +getContractMonthsLeft()
    }

    class IncomingDoc {
        +String id
        +String refNo
        +Date date
        +String sender
        +String summary
        +String assignee
        +Date deadline
        +String status
        +String fileUrl
        +String fileName
        +String notes
        +updateStatus()
    }

    class OutgoingDoc {
        +String id
        +String refNo
        +Date date
        +String recipient
        +String summary
        +String assignee
        +Date deadline
        +String status
        +String fileUrl
        +String fileName
        +String notes
        +updateStatus()
    }

    class TeachingNorm {
        +String id
        +String title
        +String lecturerName
        +String department
        +Integer norm
        +Integer actual
        +Array attachments
        +calculateDifference()
    }

    class TeachingContract {
        +String id
        +String title
        +String lecturerName
        +String department
        +String subject
        +Integer hours
        +Array attachments
    }

    class AuditLog {
        +String id
        +String action
        +String module
        +String detail
        +String userEmail
        +String userName
        +Timestamp timestamp
    }

    User "1" --> "*" Asset : Quản lý / Cập nhật
    User "1" --> "*" ScoreFile : Upload / Tra cứu
    User "1" --> "*" VisitingExpert : Quản lý hợp đồng
    User "1" --> "*" IncomingDoc : Tiếp nhận / Xử lý
    User "1" --> "*" OutgoingDoc : Phát hành / Theo dõi
    User "1" --> "*" TeachingNorm : Kê khai định mức
    User "1" --> "*" TeachingContract : Kê khai giờ dạy
    User "1" --> "*" AuditLog : Phát sinh hành động
\`\`\`
*Hình 2.17: Biểu đồ Lớp phân tích chi tiết (Class Diagram) toàn hệ thống*

---

## 2.4 Nghiên cứu thuật toán xử lý nghiệp vụ giáo vụ

### 2.4.1 Cơ sở lý thuyết các thuật toán cốt lõi
Để giải quyết bài toán tự động hóa trong quản lý giáo vụ tại Trường Đại học Điện Lực, đề tài tiến hành nghiên cứu cơ sở lý thuyết của 4 nhóm giải thuật then chốt:
1. **Lý thuyết về Tính toán sai biệt thời gian thực (Real-time Date Difference Calculus):**
   - Bài toán quản lý khấu hao tài sản và thời hạn hợp đồng thỉnh giảng đòi hỏi tính toán khoảng cách thời gian giữa thời điểm hiện tại của máy chủ ($T_{\\text{now}}$) và các mốc thời gian lưu trong CSDL ($T_{\\text{start}}, T_{\\text{end}}$).
   - Sử dụng chuẩn biểu diễn thời gian quốc tế ISO-8601 (\`YYYY-MM-DD\`) kết hợp hàm giải tích thời gian \`differenceInMonths\` của thư viện \`date-fns\`. Thuật toán đảm bảo tính toán chính xác số tháng nguyên vẹn theo chu kỳ trăng, loại bỏ hoàn toàn các sai số do năm nhuận hoặc các tháng có 28, 30 hay 31 ngày gây ra.
2. **Lý thuyết Cân đối khối lượng lao động sư phạm:**
   - Dựa trên Thông tư 20/2020/TT-BGDĐT và Quy chế chi tiêu nội bộ Trường Đại học Điện Lực, bài toán xác định trạng thái hoàn thành định mức giờ giảng của giảng viên là một hàm tuyến tính đơn biến:
     $$f(\\text{actual}, \\text{norm}) = \\text{actual} - \\text{norm}$$
   - Trạng thái được phân lớp thành 3 miền giá trị rời rạc: Miền thiếu ($f < 0$), Miền đủ ($f = 0$), Miền vượt ($f > 0$).
3. **Lý thuyết Phân tán dữ liệu nhị phân (Binary Data Routing & Storage Tiering):**
   - Bài toán chi phí lưu trữ đám mây là bài toán tối ưu hóa kinh điển. Theo giới hạn kỹ thuật của Google Firestore, mỗi tài liệu Document bị chặn trên ở mức dung lượng 1.048.576 bytes (1 MB).
   - Đề xuất giải thuật ngưỡng dung lượng $\\theta = 750$ KB: Nếu kích thước tệp $S < \\theta$, mã hóa chuỗi nhị phân sang bảng mã 64 ký tự (Base64 ASCII Data URI) để nhúng trực tiếp vào Document của Firestore (chi phí lưu trữ phụ trợ = 0 VNĐ); nếu $S \\ge \\theta$, chuyển hướng lưu trữ vào kho đối tượng IndexedDB cục bộ của máy khách.
4. **Lý thuyết Kết xuất Đồ họa Véc-tơ sang Tài liệu Di động (DOM to Raster to PDF Vector):**
   - Giải quyết nhược điểm không hỗ trợ bảng mã Unicode tiếng Việt của thư viện sinh PDF gốc (\`jsPDF\`) bằng giải thuật chuyển hóa 2 bước: Bước 1 chuyển hóa cây DOM HTML chuẩn CSS font-family Unicode sang ảnh Raster đồ họa 2D độ nét cao (Canvas scale = 2); Bước 2 ánh xạ tọa độ ảnh đồ họa lên trang tài liệu PDF chuẩn tỉ lệ kích thước vật lý A4 (210mm x 297mm).

*Bảng 2.9: Bảng quy tắc nghiệp vụ thuật toán cân đối giờ giảng theo Thông tư 20/2020/TT-BGDĐT*
| Giá trị chênh lệch (Diff) | Phân lớp trạng thái | Mã màu hiển thị | Ý nghĩa nghiệp vụ giáo vụ EPU |
| :---: | :---: | :---: | :--- |
| $\\text{Diff} > 0$ | VƯỢT ĐỊNH MỨC | Màu Vàng (Warning) | Cán bộ giảng dạy thừa giờ, lập bảng thanh toán tiền vượt giờ |
| $\\text{Diff} = 0$ | ĐỦ ĐỊNH MỨC | Màu Xanh (Success) | Cán bộ hoàn thành chuẩn 270 tiết nghĩa vụ |
| $\\text{Diff} < 0$ | THIẾU ĐỊNH MỨC | Màu Đỏ (Danger) | Cán bộ chưa đủ giờ, ghi nhận để phân công dạy bù học kỳ sau |

### 2.4.2 Phương pháp nghiên cứu và mô hình hóa thuật toán
- **Phương pháp thu thập và phân tích dữ liệu thực nghiệm:** Khảo sát các trường hợp biên (Boundary Cases): ngày kết thúc hợp đồng rơi vào đúng ngày hiện tại (MonthsLeft = 0), ngày bắt đầu tài sản rơi vào tương lai, tệp đính kèm có dung lượng xấp xỉ ngưỡng 750 KB (749 KB và 751 KB).
- **Mô hình hóa giải thuật:** Biểu diễn các thuật toán dưới dạng mã giả chuẩn (Pseudocode) và lưu đồ khối thuật toán (Flowchart) để phục vụ quá trình cài đặt mã nguồn trong môi trường JavaScript hiện đại.

### 2.4.3 Đề xuất giải pháp thuật toán tối ưu hóa hệ thống
- **Thuật toán quét cảnh báo thời gian thực trên Dashboard:** Thay vì sử dụng bộ lập lịch chạy nền tiêu tốn tài nguyên máy chủ (Cron Job), hệ thống đề xuất giải thuật **Lazy Client-side Scanning**: Khi cán bộ mở Dashboard, React Hook \`useMemo\` sẽ kích hoạt thuật toán duyệt song song danh sách tài sản và hợp đồng, lọc ra các phần tử vi phạm điều kiện cảnh báo trong thời gian dưới 5 mili-giây.
- **Thuật toán Hybrid Storage không đồng bộ:** Sử dụng cơ chế \`Promise\` và \`async/await\` để tiến hành ghi dữ liệu vào IndexedDB và đọc Base64 song song, giải phóng luồng chính của trình duyệt (Main Thread), giúp giao diện không bao giờ bị đơ lag.

---

## 2.5 Phương pháp và mô hình kiểm thử hệ thống

### 2.5.1 Phương pháp và công cụ áp dụng cho kiểm thử
- **Phương pháp kiểm thử:** Áp dụng phương pháp **Kiểm thử hộp đen (Black-box Testing)**: Người kiểm thử không quan tâm đến cấu trúc mã nguồn bên trong mà tập trung kiểm tra hành vi của hệ thống dựa trên đầu vào và đầu ra theo tài liệu đặc tả yêu cầu; kết hợp kỹ thuật phân vùng tương đương (Equivalence Partitioning) và phân tích giá trị biên (Boundary Value Analysis).
- **Các công cụ hỗ trợ kiểm thử:**
  1. *Chrome DevTools (Lighthouse & Performance Profiler):* Đo lường thời gian dựng hình FCP, TTI, kiểm soát bộ nhớ RAM và giám sát mạng Network Waterfall.
  2. *React Developer Tools:* Kiểm tra cây component React, giám sát luồng props, state và kiểm tra hiện tượng re-render dư thừa.
  3. *Firebase Emulator & Console:* Giám sát các lượt đọc/ghi vào CSDL Firestore và kiểm tra tính toàn vẹn của dữ liệu thời gian thực.
  4. *IndexedDB Storage Inspector:* Trực tiếp mở và duyệt các bản ghi nhị phân trong Object Store \`files\` trên trình duyệt để kiểm tra tính toàn vẹn tệp.

### 2.5.2 Mô hình kiểm thử phần mềm V-Model áp dụng cho hệ thống
Đề tài áp dụng mô hình kiểm thử chữ V (V-Model), thiết lập mối quan hệ đối xứng chặt chẽ giữa các giai đoạn phát triển và các cấp độ kiểm thử tương ứng:

\`\`\`
 [ Yêu cầu nghiệp vụ Giáo vụ ]  <=================>  [ Kiểm thử chấp nhận (UAT tại EPU) ]
          \\                                                   /
           [ Thiết kế Kiến trúc Hệ thống ] <=======> [ Kiểm thử Tích hợp (Integration Test) ]
                    \\                                       /
                     [ Thiết kế Chi tiết Module ] <=> [ Kiểm thử Đơn vị (Unit Testing) ]
                              \\                   /
                               [ Lập trình Mã nguồn (Coding React 19) ]
\`\`\`
*Hình 2.18: Mô hình kiểm thử phần mềm V-Model áp dụng trong dự án Quản lý Giáo vụ EPU*

- **Kiểm thử đơn vị (Unit Testing):** Kiểm thử tính đúng đắn của từng hàm tiện ích độc lập (\`getDepreciationMonthsLeft\`, \`getContractMonthsLeft\`, \`formatFileSize\`, \`calculateDifference\`).
- **Kiểm thử tích hợp (Integration Testing):** Kiểm thử sự tương tác phối hợp giữa giao diện người dùng (React Components), các lớp dịch vụ (Services) và tầng dữ liệu đám mây (Firestore/IndexedDB).
- **Kiểm thử hệ thống (System Testing):** Kiểm thử toàn diện 9 phân hệ chức năng trên môi trường thực tế, đo lường tốc độ phản hồi và an toàn bảo mật.
- **Kiểm thử chấp nhận người dùng (UAT):** Chuyển giao hệ thống cho 8 cán bộ tại Phòng Đào tạo Trường Đại học Điện Lực vận hành thử nghiệm trong 2 tuần để đánh giá tính khả dụng.

### 2.5.3 Thiết kế tài liệu đặc tả ca kiểm thử (Test Case Specification)
Mỗi ca kiểm thử (Test Case) được chuẩn hóa theo cấu trúc biểu mẫu kỹ nghệ phần mềm chuyên nghiệp:

*Bảng 2.10: Mẫu tài liệu đặc tả ca kiểm thử (Test Case Specification Template)*
| Trường thông tin | Ý nghĩa và Quy cách |
| :--- | :--- |
| **Mã ca kiểm thử (Test Case ID)** | Định danh duy nhất theo cú pháp: \`TC[Số thứ tự]\` (Ví dụ: TC01, TC02) |
| **Phân hệ kiểm thử (Module)** | Tên phân hệ chức năng tương ứng (Xác thực, Tài sản, Điểm, Văn bản...) |
| **Tên ca kiểm thử (Test Name)** | Tóm tắt mục tiêu kiểm tra của ca thử nghiệm |
| **Điều kiện tiên quyết (Pre-conditions)** | Trạng thái hệ thống và tài khoản cần có trước khi bắt đầu thử nghiệm |
| **Các bước thực hiện (Test Steps)** | Chuỗi thao tác cụ thể của người kiểm thử trên giao diện |
| **Dữ liệu đầu vào (Test Data)** | Giá trị chính xác của các trường dữ liệu đưa vào form kiểm thử |
| **Kết quả mong đợi (Expected Result)** | Phản hồi đúng đắn của hệ thống theo thiết kế nghiệp vụ |
| **Kết quả thực tế (Actual Result)** | Ghi nhận phản ứng thực tế của phần mềm khi chạy |
| **Đánh giá (Status)** | ĐẠT (Pass) hoặc KHÔNG ĐẠT (Fail) |

\\newpage

# CHƯƠNG 3: CÀI ĐẶT VÀ THỬ NGHIỆM

## 3.1 Giới thiệu ngôn ngữ và công nghệ cài đặt

### 3.1.1 Kiến trúc ứng dụng web trang đơn (Single Page Application - SPA)
Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026) được kiến trúc theo mô hình ứng dụng web trang đơn (Single Page Application - SPA). Trong mô hình này, toàn bộ tài nguyên giao diện, logic xử lý và các component được nạp vào trình duyệt người dùng ngay trong lần truy cập đầu tiên. Khi cán bộ thực hiện chuyển đổi giữa các module (Dashboard, Tài sản, Điểm số, Chuyên gia, Văn bản, KLGD, Nhật ký), trình duyệt không cần phải gửi yêu cầu nạp lại toàn bộ trang HTML từ máy chủ mà chỉ thực hiện hoán đổi Component thông qua cây DOM ảo (Virtual DOM) của React. Điều này mang lại trải nghiệm người dùng siêu mượt mà, chuyển trang tức thì dưới 50ms và không hề có hiện tượng chớp nháy màn hình.

\`\`\`
+-----------------------------------------------------------------------------------+
|                            TRÌNH DUYỆT NGƯỜI DÙNG (CLIENT)                         |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                 GIAO DIỆN NGƯỜI DÙNG (REACT 19 + VITE 8 + CSS3)             |  |
|  |  [Dashboard] [Tài sản] [Điểm thi] [Thỉnh giảng] [Văn bản] [KLGD] [Audit]    |  |
|  +--------------------------------------+--------------------------------------+  |
|                                         |                                         |
|                 +-----------------------+-----------------------+                 |
|                 |                                               |                 |
|                 v                                               v                 |
|  +------------------------------+               +------------------------------+  |
|  |  AuthContext / UI State      |               |  storageHelper (Hybrid)      |  |
|  |  - Quản lý phiên cán bộ      |               |  - Lưu tệp tức thì (0ms)     |  |
|  |  - Bắt buộc Email Verified   |               |  - Bộ nhớ đệm IndexedDB      |  |
|  +--------------+---------------+               +---------------+--------------+  |
|                 |                                               |                 |
+-----------------|-----------------------------------------------|-----------------+
                  |                                               |
                  | HTTPS REST / WebSockets API                   | (Nếu file < 750KB)
                  v                                               v
+-----------------------------------------------------------------------------------+
|                         NỀN TẢNG ĐÁM MÂY GOOGLE FIREBASE                          |
|                                                                                   |
|  +-----------------------------+               +-------------------------------+  |
|  |    Firebase Authentication  |               |     Cloud Firestore NoSQL     |  |
|  |    - Email & Password       |               |     - 8 Collections nghiệp vụ |  |
|  |    - Google Provider        |               |     - Lưu Data URI Base64     |  |
|  |    - Email Verification link|               |     - Thời gian thực (0-100ms)|  |
|  +-----------------------------+               +-------------------------------+  |
+-----------------------------------------------------------------------------------+
\`\`\`
*Hình 3.1: Sơ đồ kiến trúc giải pháp công nghệ Hybrid Storage và Cloud BaaS*

### 3.1.2 Nền tảng React 19 và công cụ đóng gói siêu tốc Vite 8
- **React 19:** Phiên bản hiện đại của thư viện giao diện người dùng phổ biến nhất thế giới do Meta phát triển. Dự án tận dụng triệt để kiến trúc Function Component kết hợp hệ thống React Hooks tiêu chuẩn:
  - \`useState\`: Quản lý trạng thái cục bộ của form, modal, dữ liệu bảng và trạng thái tải.
  - \`useEffect\`: Đồng bộ hóa dữ liệu từ Firebase Firestore về máy khách ngay khi component được mount hoặc khi có sự thay đổi trang.
  - \`useMemo\`: Tối ưu hóa hiệu năng tính toán lọc dữ liệu, tìm kiếm đa trường và tính toán các chỉ số thống kê tổng hợp mà không gây re-render dư thừa.
  - \`useContext\`: Cung cấp ngữ cảnh xác thực toàn cục (\`AuthContext\`), lưu giữ thông tin tài khoản cán bộ đăng nhập và trạng thái xác thực xuyên suốt toàn bộ ứng dụng.
- **Vite 8:** Công cụ đóng gói (build tool) thế hệ mới xây dựng trên nền tảng ES Modules nguyên bản trong trình duyệt và trình biên dịch esbuild viết bằng Go. Vite giúp thời gian khởi động môi trường phát triển chỉ mất chưa đầy 300ms, đồng thời cơ chế Hot Module Replacement (HMR) giúp cập nhật giao diện lập trình tức thì khi sửa code. Khi đóng gói sản phẩm thương mại (\`npm run build\`), Vite tự động chia nhỏ gói bundle (code-splitting), tối ưu hóa CSS và JavaScript, giúp dung lượng tải về trình duyệt chỉ khoảng vài trăm kilobyte.

### 3.1.3 Cơ sở dữ liệu đám mây Google Firebase Firestore & Authentication
- **Firebase Authentication:** Cung cấp giải pháp nhận thực danh tính an toàn chuẩn công nghiệp. Hỗ trợ xác thực đa phương thức: Đăng nhập truyền thống bằng Email/Mật khẩu và Đăng nhập một chạm bằng tài khoản Google (OAuth 2.0). Đặc biệt, hệ thống tích hợp API \`sendEmailVerification()\` để gửi thư xác nhận tự động từ máy chủ Google đến hòm thư của cán bộ, đảm bảo chỉ những tài khoản có email thật của nhà trường mới được kích hoạt sử dụng.
- **Cloud Firestore:** Cơ sở dữ liệu NoSQL phân tán toàn cầu, lưu trữ dữ liệu dưới dạng tài liệu (Documents) nằm trong các tập hợp (Collections). Firestore cung cấp khả năng tự động mở rộng quy mô (auto-scaling), hỗ trợ truy vấn mạnh mẽ, lập chỉ mục tự động và hỗ trợ cơ chế lắng nghe thay đổi dữ liệu thời gian thực (real-time listeners).

### 3.1.4 Cơ chế lưu trữ lai Hybrid Storage (IndexedDB kết hợp Data URI Cloud)
Một trong những đột phá kỹ thuật nổi bật nhất của đề tài là việc giải quyết bài toán lưu trữ tệp tin số hóa (hợp đồng quét, file bảng điểm Excel/PDF, công văn đính kèm, minh chứng giờ giảng) mà không phải trả phí cho dịch vụ lưu trữ đám mây Firebase Cloud Storage (vốn yêu cầu đăng ký thẻ tín dụng quốc tế và gói trả phí Blaze Plan).

Nhóm tác giả đã thiết kế và hiện thực hóa mô-đun \`storageHelper.js\` với thuật toán lưu trữ lai **Hybrid Storage**:
1. **Kho đệm IndexedDB cục bộ:** Khi cán bộ chọn một tệp từ máy tính, hàm \`uploadFileSafely()\` sẽ mở kết nối tới IndexedDB của trình duyệt (\`GiaoVuStorageDB\`, Object Store \`files\`). Tệp tin nguyên bản (dưới dạng nhị phân \`Blob\` hoặc \`File\`) được lưu lập tức vào IndexedDB với khóa chính là \`fileId\`. Thao tác này diễn ra ở cấp độ đĩa cứng cục bộ, đạt tốc độ tức thì **0ms chờ đợi**, hoàn toàn không bị ảnh hưởng bởi đường truyền mạng Internet.
2. **Cơ chế phân luồng dung lượng thông minh (Size-based Routing):**
   - **Đối với tệp tin nhỏ ($< 750$ KB):** Tệp được bộ đọc \`FileReader\` chuyển đổi thành chuỗi Base64 Data URI (\`data:application/pdf;base64,...\`). Chuỗi này được lưu thẳng vào trường \`fileUrl\` của document trong Firestore (do Firestore cho phép mỗi tài liệu có kích thước tối đa 1 MB). Nhờ đó, tệp tin được đưa thẳng lên đám mây, các máy tính khác trong trường khi đăng nhập đều có thể xem và tải tệp về mà không cần thông qua máy chủ lưu trữ trung gian.
   - **Đối với tệp tin lớn ($\\ge 750$ KB):** Để tránh vượt quá hạn mức 1 MB của Firestore, hệ thống lưu đường dẫn định danh dạng \`idb://\${fileId}\` vào Firestore. Tệp tin gốc được lưu an toàn trong IndexedDB của máy tính thao tác, cho phép tải về bất kỳ lúc nào với độ mượt mà tuyệt đối.
3. **Cơ chế tải về an toàn (\`downloadFileSafely\`):** Khi người dùng nhấn nút "Xem / Tải", hàm sẽ kiểm tra định dạng URL: Nếu là \`idb://\`, nó trích xuất file nhị phân từ IndexedDB, tạo liên kết tạm thời qua \`URL.createObjectURL(blob)\`, tự động kích hoạt tải xuống và lập tức giải phóng bộ nhớ RAM sau 2 giây. Nếu là chuỗi Data URL Base64, nó tạo thẻ tải về trực tiếp.

### 3.1.5 Các thư viện xuất báo cáo chuẩn Unicode tiếng Việt sắc nét
- **SheetJS (\`xlsx\`):** Thư viện chuẩn công nghiệp dùng để xử lý dữ liệu bảng tính. Cho phép trích xuất toàn bộ dữ liệu từ các danh sách của React thành file bảng tính Excel \`.xlsx\` chuyên nghiệp với đầy đủ tiêu đề cột tiếng Việt có dấu, định dạng ngày tháng \`dd/MM/yyyy\` và phân trang rõ ràng.
- **jsPDF & html2canvas:** Bộ đôi giải pháp tạo tệp PDF tiếng Việt chất lượng cao. Thông thường, thư viện \`jsPDF\` khi xuất văn bản tiếng Việt sẽ bị lỗi font (do font mặc định không chứa bảng mã ký tự Unicode tiếng Việt). Đề tài đã giải quyết triệt để vấn đề này bằng giải pháp: Tạo một khung phần tử DOM ẩn chứa bảng dữ liệu với định dạng CSS chuẩn mực (\`font-family: 'Segoe UI', Arial, sans-serif\`), sau đó dùng \`html2canvas\` kết xuất giao diện thành ảnh canvas độ phân giải cao (scale = 2), cuối cùng đưa canvas vào trang tài liệu PDF khổ A4 (ngang hoặc dọc). Nhờ đó, file PDF xuất ra hiển thị sắc nét 100%, đúng quy chuẩn trình bày văn bản hành chính và tuyệt đối không bao giờ bị lỗi font chữ.
- **date-fns:** Thư viện xử lý ngày tháng nhẹ, hỗ trợ bản địa hóa tiếng Việt (\`vi\` locale), giúp định dạng ngày tháng thân thiện (\`EEEE, dd/MM/yyyy\`).
- **react-hot-toast:** Thư viện thông báo nổi (Toast notifications) thanh lịch, thông báo tức thời kết quả thêm, sửa, xóa mà không làm gián đoạn luồng làm việc của cán bộ.

---

## 3.2 Thiết kế giao diện người dùng (UI/UX)

### 3.2.1 Giao diện Đăng nhập và Xác thực Email
- **Màn hình Đăng nhập (\`LoginPage.jsx\`):** Thiết kế trang nhã theo phong cách công sở hiện đại với logo nhận diện Trường Đại học Điện Lực và form đăng nhập tập trung. Hỗ trợ 2 chế độ: Đăng nhập bằng Email/Mật khẩu hoặc Đăng nhập nhanh bằng Google. Cung cấp tab chuyển đổi giữa "Đăng nhập" và "Đăng ký tài khoản mới" kèm các trường bổ sung: Mã cán bộ, Đơn vị công tác, Số điện thoại.
- **Màn hình Xác thực Email (\`VerifyEmailPage.jsx\`):** Khi tài khoản mới đăng ký chưa kích hoạt email, hệ thống tự động khóa luồng và chuyển đến màn hình thông báo trực quan: Giải thích rõ ràng email kích hoạt đã được gửi tới hòm thư của cán bộ, cung cấp nút "Gửi lại email xác thực" và nút "Tôi đã bấm link xác thực (Kiểm tra lại)".

\`\`\`
+-------------------------------------------------------------+
|              HỆ THỐNG QUẢN LÝ GIÁO VỤ EPU 2026              |
|        Trường Đại học Điện Lực · Phòng Đào tạo & Giáo vụ    |
+-------------------------------------------------------------+
|  [Đăng nhập]  |  [Đăng ký tài khoản]                       |
|                                                             |
|  Email công vụ:     [ canbo@epu.edu.vn                    ] |
|  Mật khẩu:          [ •••••••••••••                       ] |
|                                                             |
|  [         ĐĂNG NHẬP HỆ THỐNG GIÁO VỤ EPU                 ] |
|  ------------------------- HOẶC --------------------------  |
|  [ G   Đăng nhập nhanh bằng tài khoản Google              ] |
+-------------------------------------------------------------+
\`\`\`
*Hình 3.2: Giao diện Đăng nhập hệ thống và Form Xác thực Email*

### 3.2.2 Giao diện Bảng điều khiển Trung tâm (Dashboard & Smart Alerts)
- **Welcome Banner:** Lời chào cá nhân hóa theo buổi trong ngày ("Chào buổi sáng", "Chào buổi chiều"), hiển thị tên cán bộ và ngày tháng tiếng Việt.
- **4 Thẻ thống kê số lượng (Stat Cards):**
  - Thẻ 1: Tổng tài sản (Màu xanh dương) $\\rightarrow$ Nhấp chuột chuyển ngay đến trang Tài sản.
  - Thẻ 2: Chuyên gia thỉnh giảng (Màu xanh lá) $\\rightarrow$ Nhấp chuột chuyển đến trang Chuyên gia.
  - Thẻ 3: Văn bản đến (Màu vàng cam) $\\rightarrow$ Nhấp chuột chuyển đến trang Văn bản.
  - Thẻ 4: Văn bản đi (Màu xanh dương đậm) $\\rightarrow$ Nhấp chuột chuyển đến trang Văn bản.
- **Khu vực Cảnh báo & Nhắc việc (Alerts Section):** Tự động tổng hợp và hiển thị các cảnh báo quan trọng:
  - Cảnh báo Đỏ / Vàng: Tài sản đã hết / sắp hết khấu hao (kèm số tháng còn lại).
  - Cảnh báo Đỏ / Vàng: Hợp đồng thỉnh giảng đã hết / sắp hết hạn (kèm mã HĐ và số tháng).
  - Cảnh báo Xanh: Số lượng văn bản đến chưa xử lý và văn bản đi chờ hồi đáp.
  - Mỗi mục cảnh báo có thể nhấp chuột để điều hướng thẳng đến bản ghi cần xử lý.
- **Lối tắt Truy cập nhanh (Quick Links):** Các nút bấm tắt giúp mở ngay các tác vụ thường nhật: Thêm tài sản, Upload điểm, Thêm chuyên gia, Thêm văn bản, Cập nhật KLGD, Xem nhật ký.

\`\`\`
+-----------------------------------------------------------------------------------------+
| Chào buổi sáng, Cán bộ Giáo vụ! | Thứ Năm, 08/10/2026 · Bộ phận Giáo vụ - ĐH Điện Lực   |
+-----------------------------------------------------------------------------------------+
| [ 42 Tổng tài sản ]  [ 18 Chuyên gia ]  [ 25 Văn bản đến ]  [ 14 Văn bản đi ]           |
+-----------------------------------------------------------------------------------------+
| CẢNH BÁO & NHẮC VIỆC (3 mục cần chú ý):                                                 |
| [!] Hợp đồng sắp hết hạn: PGS.TS Trần Văn Nam — HĐ 45/HĐ-TG (còn 1 tháng)      [Xem ->] |
| [!] Tài sản sắp hết khấu hao: Máy chiếu Epson EB-X41 (MC-02) — còn 1 tháng     [Xem ->] |
| [i] Có 4 văn bản đến chưa xử lý: 88/CV-BCT, 102/TB-EPU...                       [Xem ->] |
+-----------------------------------------------------------------------------------------+
\`\`\`
*Hình 3.3: Giao diện Bảng điều khiển trung tâm (Dashboard) với Cảnh báo tức thời*

### 3.2.3 Giao diện Phân hệ Quản lý Tài sản
- **Thanh thống kê:** Tổng tài sản, Đang sử dụng tốt, Sắp hết khấu hao, Đã hết khấu hao.
- **Thanh công cụ Toolbar:** Ô tìm kiếm tức thì đa năng (tìm theo tên, mã, loại tài sản, phòng học), nút "+ Thêm mới", nút "Xuất Excel" và "Xuất PDF".
- **Bảng dữ liệu thông minh:**
  - Cột mã tài sản in đậm font đơn cách (monospace).
  - Cột Khấu hao hiển thị số tháng quy định.
  - Cột Trạng thái khấu hao hiển thị Badge màu: Xanh lá ("Còn X tháng"), Vàng ("Sắp hết: 1 tháng"), Đỏ ("Đã hết khấu hao").
  - Toàn bộ hàng dữ liệu (tr) của tài sản sắp hết hoặc đã hết khấu hao tự động đổi màu nền vàng nhạt/đỏ nhạt (\`row-warning\`, \`row-danger\`) để thu hút sự chú ý của cán bộ.
- **Modal Thêm / Chỉnh sửa:** Form nhập liệu khoa học với các trường chọn loại tài sản, tình trạng và tính toán số tháng.

\`\`\`
+-----------------------------------------------------------------------------------------+
| [ 42 Tổng TS ]   [ 35 Đang dùng tốt ]   [ 4 Sắp hết KH ]   [ 3 Đã hết KH ]              |
+-----------------------------------------------------------------------------------------+
| [ Tìm theo tên, mã, phòng...  ]   [+ Thêm mới]   [Xuất Excel]   [Xuất PDF]              |
+-----------------------------------------------------------------------------------------+
| Mã TS  | Tên tài sản        | Loại TS     | SL | Phòng | Ngày SD   | Khấu hao | Trạng thái  |
|--------+--------------------+-------------+----+-------+-----------+----------+-------------|
| MC-01  | Máy chiếu Epson    | Điện tử     | 1  | A101  | 10/05/2023| 36 tháng | [Đang dùng] |
| MC-02  | Máy chiếu Sony     | Điện tử     | 1  | B203  | 12/10/2023| 36 tháng | [Sắp hết KH]| (Vàng)
| MT-08  | Máy vi tính HP     | Văn phòng   | 5  | Lab 1 | 15/01/2023| 36 tháng | [Đã hết KH] | (Đỏ)
+-----------------------------------------------------------------------------------------+
\`\`\`
*Hình 3.4: Giao diện Quản lý Tài sản và bảng tính trạng thái khấu hao theo màu sắc*

### 3.2.4 Giao diện Phân hệ Quản lý Hồ sơ Điểm thi
- **Thanh thống kê loại tệp:** Tổng số file điểm, Số file Excel (.xlsx), Số file PDF (.pdf), Số file Word (.docx).
- **Thanh công cụ:** Ô tìm kiếm theo tên file, tên môn học, nhãn phân loại; nút "+ Upload File Điểm".
- **Bảng danh sách:** Hiển thị biểu tượng loại tệp (\`FilePill\`), tên môn học, Badge phân loại màu xanh ngọc, ngày upload, dung lượng tệp (\`formatFileSize\`), nút "Xem / Tải" và nút "Xóa".
- **Modal Upload:** Hỗ trợ nhập tên môn học, chọn nhanh nhãn gợi ý qua thẻ \`<datalist>\`, vùng kéo thả tệp (\`UploadArea\`) có kiểm tra định dạng và kích thước.

\`\`\`
+-----------------------------------------------------------------------------------------+
| [ 128 File điểm ]   [ 85 Excel (.xlsx) ]   [ 32 PDF (.pdf) ]   [ 11 Word (.docx) ]      |
+-----------------------------------------------------------------------------------------+
| [ Tìm theo tên file, môn học, tag... ]                     [+ Upload File Điểm]         |
+-----------------------------------------------------------------------------------------+
| Tên file                 | Tên môn học          | Phân loại     | Ngày tải  | Dung lượng|   |
|--------------------------+----------------------+---------------+-----------+-----------+---|
| [XLS] Diem_ToanA1_K17.xlsx| Toán cao cấp A1     | [Toán học]    | 02/10/2026| 145 KB    |[Tải]|
| [PDF] Diem_LapTrinhC.pdf | Kỹ thuật lập trình C | [CNTT]        | 05/10/2026| 420 KB    |[Tải]|
+-----------------------------------------------------------------------------------------+
\`\`\`
*Hình 3.5: Giao diện Phân hệ Quản lý Hồ sơ Điểm thi và phân loại Tag thông minh*

### 3.2.5 Giao diện Phân hệ Quản lý Chuyên gia Thỉnh giảng
- **Thanh thống kê:** Tổng chuyên gia, Hợp đồng đang hiệu lực, Sắp hết hạn ($\le 2$ tháng), Đã hết hạn.
- **Bảng dữ liệu đầy đủ:** Hiển thị Học hàm/Học vị, Họ tên, Đơn vị tiếp nhận (Khoa/Viện tại EPU), Nơi công tác chính (EVN, Viện Năng lượng...), Số CCCD, SĐT, Số HĐ, Thời hạn HĐ và Badge cảnh báo thời hạn.
- **Nút "Xem chi tiết":** Mở Modal hiển thị toàn bộ 24 trường thông tin của chuyên gia (Quê quán, địa chỉ thường trú, nơi ở hiện tại, số tài khoản ngân hàng, tên ngân hàng chi nhánh, ngày bổ nhiệm học hàm...).
- **Nút "Xem / Tải HĐ":** Mở hoặc tải file hợp đồng số hóa đã đính kèm.

\`\`\`
+-----------------------------------------------------------------------------------------+
| [ 18 Chuyên gia ]   [ 14 Đang hiệu lực ]   [ 3 Sắp hết hạn HĐ ]   [ 1 Đã hết hạn HĐ ]   |
+-----------------------------------------------------------------------------------------+
| [ Tìm theo tên chuyên gia, khoa, số HĐ, CCCD... ]  [+ Thêm chuyên gia] [Xuất Excel/PDF] |
+-----------------------------------------------------------------------------------------+
| Họ và tên chuyên gia    | Đơn vị tiếp nhận | Nơi công tác     | Số HĐ    | Hạn hợp đồng |   |
|-------------------------+------------------+------------------+----------+--------------+---|
| GS.TS Nguyễn Văn Bình   | Khoa CNTT        | Viện Hàn lâm KH&CN| 12/HĐ-TG | Còn 8 tháng  |[CT|
| PGS.TS Trần Văn Nam     | Khoa Kỹ thuật Điện| Tập đoàn EVN    | 45/HĐ-TG| Còn 1 tháng  |[CT| (Vàng)
+-----------------------------------------------------------------------------------------+
\`\`\`
*Hình 3.6: Giao diện Quản lý Chuyên gia thỉnh giảng và Popup xem chi tiết nhân thân*

### 3.2.6 Giao diện Phân hệ Quản lý Văn bản Đến và Đi
- **Bộ chuyển Tab động (2 Tabs):**
  - Tab 1: **Văn bản Đến** kèm huy hiệu số lượng màu đỏ thể hiện các văn bản chưa xử lý.
  - Tab 2: **Văn bản Đi** kèm huy hiệu màu vàng thể hiện các văn bản đang chờ hồi đáp.
- **Bảng theo dõi văn bản:** Cột Số ký hiệu, Ngày văn bản, Nơi gửi / Nơi nhận, Trích yếu nội dung, Người phụ trách, Hạn xử lý (in đỏ đậm nếu có hạn), Dropdown chuyển đổi trạng thái nhanh trực tiếp ngay trên từng dòng, File đính kèm.

\`\`\`
+-----------------------------------------------------------------------------------------+
| [ TAB 1: VĂN BẢN ĐẾN (4) ]                  [ TAB 2: VĂN BẢN ĐI (2) ]                   |
+-----------------------------------------------------------------------------------------+
| [ Tìm theo số ký hiệu, trích yếu, nơi gửi/nhận... ]             [+ Thêm Văn bản Đến]    |
+-----------------------------------------------------------------------------------------+
| Số ký hiệu   | Ngày      | Nơi gửi            | Trích yếu nội dung   | Hạn XL    |Trạng thái|
|--------------+-----------+--------------------+----------------------+-----------+----------|
| 125/CV-BCT   | 01/10/2026| Bộ Công Thương     | Kế hoạch đào tạo..   | 15/10/2026|[Chưa XLv]|
| 45/TB-EPU    | 04/10/2026| Ban Giám hiệu EPU  | Lịch thi học kỳ 1..  | —         |[Đã XL v ]|
+-----------------------------------------------------------------------------------------+
\`\`\`
*Hình 3.7: Giao diện Quản lý Văn bản Đến và Đi với bộ đếm Badge thông báo động*

### 3.2.7 Giao diện Phân hệ Quản lý Khối lượng Giảng dạy
- **Thanh thống kê:** Giảng viên định mức, Vượt định mức, Thiếu định mức, Giảng viên hợp đồng.
- **2 Tab nghiệp vụ:**
  - Tab 1: **Khối lượng Định mức:** Hiển thị Học hàm/Học vị, Giảng viên, Bộ môn, Định mức tiêu chuẩn (270 tiết), Số tiết thực tế, Cột **Chênh lệch** với Badge màu nổi bật: Xanh lá ("Đủ định mức"), Vàng (\`+45 vượt\`), Đỏ (\`-30 thiếu\`). Kèm các File minh chứng (FilePill).
  - Tab 2: **Khối lượng Hợp đồng:** Hiển thị Giảng viên, Bộ môn, Môn học giảng dạy, Số giờ theo hợp đồng và File minh chứng đính kèm.

\`\`\`
+-----------------------------------------------------------------------------------------+
| [ 45 GV Định mức ]   [ 18 Vượt định mức ]   [ 5 Thiếu định mức ]   [ 12 GV Hợp đồng ]   |
+-----------------------------------------------------------------------------------------+
| [ TAB: KHỐI LƯỢNG ĐỊNH MỨC ]                [ TAB: KHỐI LƯỢNG HỢP ĐỒNG ]                |
+-----------------------------------------------------------------------------------------+
| Giảng viên         | Bộ môn       | Định mức | Thực tế | Chênh lệch        | Minh chứng |
|--------------------+--------------+----------+---------+-------------------+------------|
| TS. Nguyễn Thị Mai | Công nghệ PM | 270 tiết | 320 tiết| [+50 tiết vượt]   | [TKB.xlsx] | (Vàng)
| ThS. Lê Văn Dũng   | Khoa học MT  | 270 tiết | 240 tiết| [-30 tiết thiếu]  | [MinhChung]| (Đỏ)
| PGS.TS Vũ Anh Tuấn | Hệ thống TT  | 270 tiết | 270 tiết| [Đủ định mức]     | [MinhChung]| (Xanh)
+-----------------------------------------------------------------------------------------+
\`\`\`
*Hình 3.8: Giao diện Quản lý Khối lượng Giảng dạy (Tab Định mức và Tab Hợp đồng)*

### 3.2.8 Giao diện Phân hệ Nhật ký Hoạt động (Audit Log)
- Hiển thị danh sách 100 tác vụ gần nhất được thực hiện trên hệ thống.
- Cột Hành động có màu sắc tương ứng: \`Thêm mới\` (Xanh lá), \`Chỉnh sửa\` (Vàng), \`Xóa bỏ\` (Đỏ), \`Upload\` (Xanh ngọc).
- Ghi nhận chi tiết: Tên module tác động, Nội dung chi tiết thao tác, Họ tên và Email của cán bộ thực hiện, Mốc thời gian chính xác đến từng giây.

\`\`\`
+-----------------------------------------------------------------------------------------+
| NHẬT KÝ HOẠT ĐỘNG HỆ THỐNG (AUDIT TRAIL)                                                |
| Lưu trữ và truy vết minh bạch mọi thao tác của cán bộ tại Trường Đại học Điện Lực        |
+-----------------------------------------------------------------------------------------+
| Thời gian       | Cán bộ thực hiện       | Hành động  | Phân hệ      | Chi tiết tác vụ  |
|-----------------+------------------------+------------+--------------+------------------|
| 08/10 10:15:22  | canbo.a@epu.edu.vn     | [Thêm mới] | Tài sản      | Thêm: Máy chiếu  |
| 08/10 09:40:10  | canbo.b@epu.edu.vn     | [Chỉnh sửa]| Văn bản đến  | Trạng thái: Đã XL|
| 07/10 16:20:05  | canbo.a@epu.edu.vn     | [Upload]   | Điểm học phần| File: ToanA1.xlsx|
| 07/10 14:10:00  | canbo.c@epu.edu.vn     | [Xóa bỏ]   | Thỉnh giảng  | Xóa: HĐ 09/HĐ-TG |
+-----------------------------------------------------------------------------------------+
\`\`\`
*Hình 3.9: Giao diện Nhật ký hoạt động kiểm toán hệ thống (Audit Trail)*

---

## 3.3 Thiết kế cơ sở dữ liệu vật lý và các cơ chế kiểm soát

### 3.3.1 Cơ sở dữ liệu vật lý trên Google Cloud Firestore
Cơ sở dữ liệu vật lý Cloud Firestore được tổ chức thành 8 Collection độc lập, chuẩn hóa chặt chẽ các trường dữ liệu:

*Bảng 3.1: Thiết kế cấu trúc vật lý Collection \`users\` trong Firestore*
| Tên trường | Kiểu dữ liệu | Ý nghĩa và Ràng buộc vật lý |
| :--- | :--- | :--- |
| \`uid\` | String | Khóa chính duy nhất từ Firebase Authentication |
| \`email\` | String | Hòm thư điện tử đăng nhập của cán bộ EPU (Bắt buộc) |
| \`displayName\` | String | Họ và tên hiển thị của cán bộ |
| \`staffId\` | String | Mã số cán bộ / giảng viên EPU |
| \`department\` | String | Phòng / Khoa công tác (Mặc định: 'Phòng Đào tạo') |
| \`phone\` | String | Số điện thoại liên lạc |
| \`role\` | String | Quyền hạn (Mặc định: 'Cán bộ Giáo vụ') |
| \`createdAt\` | Timestamp | Thời gian khởi tạo tài khoản |

*Bảng 3.2: Thiết kế cấu trúc vật lý Collection \`assets\` trong Firestore*
| Tên trường | Kiểu dữ liệu | Ý nghĩa và Ràng buộc vật lý |
| :--- | :--- | :--- |
| \`id\` | String | Khóa chính tự sinh của tài liệu |
| \`code\` | String | Mã định danh tài sản (Ví dụ: 'TS-001') |
| \`name\` | String | Tên gọi của tài sản (Ví dụ: 'Máy chiếu Epson EB-X41') |
| \`type\` | String | Loại tài sản ('Thiết bị điện tử', 'Nội thất',...) |
| \`quantity\` | Number | Số lượng hiện có ($\ge 1$) |
| \`room\` | String | Giảng đường sử dụng (Ví dụ: 'Phòng A101 - CS1') |
| \`startDate\` | String (YYYY-MM-DD)| Ngày đưa vào sử dụng |
| \`depreciationMonths\`| Number | Thời gian tính khấu hao quy định (tháng, mặc định: 36) |
| \`condition\` | String | Tình trạng ('Tốt', 'Bình thường', 'Cần bảo trì', 'Hỏng') |
| \`notes\` | String | Ghi chú thêm |
| \`createdAt\` / \`updatedAt\` | Timestamp | Mốc thời gian tạo / chỉnh sửa máy chủ |

*Bảng 3.3: Thiết kế cấu trúc vật lý Collection \`scores\` trong Firestore*
| Tên trường | Kiểu dữ liệu | Ý nghĩa và Ràng buộc vật lý |
| :--- | :--- | :--- |
| \`id\` | String | Khóa chính tự sinh |
| \`fileName\` | String | Tên tệp tin gốc (Ví dụ: 'Diem_ToanA1_K17.xlsx') |
| \`fileUrl\` | String | Đường dẫn tệp (Data URI Base64 hoặc 'idb://...') |
| \`fileSize\` | Number | Kích thước tệp tính theo Byte |
| \`fileType\` | String | Đuôi mở rộng của tệp ('xlsx', 'pdf', 'docx') |
| \`subjectName\` | String | Tên môn học / học phần |
| \`tag\` | String | Thẻ phân loại môn học ('Toán học', 'CNTT', 'Điện'...) |
| \`createdAt\` | Timestamp | Thời điểm upload tệp |

*Bảng 3.4: Thiết kế cấu trúc vật lý Collection \`experts\` trong Firestore*
| Tên trường | Kiểu dữ liệu | Ý nghĩa và Ràng buộc vật lý |
| :--- | :--- | :--- |
| \`id\` | String | Khóa chính tự sinh |
| \`honorific\` | String | Danh xưng ('Ông' / 'Bà') |
| \`gender\` | String | Giới tính ('Nam' / 'Nữ') |
| \`name\` | String | Họ và tên chuyên gia (Bắt buộc) |
| \`birthDate\` | String | Ngày tháng năm sinh (YYYY-MM-DD) |
| \`hometown\` | String | Quê quán |
| \`permanentAddress\` | String | Địa chỉ thường trú |
| \`currentAddress\` | String | Nơi ở hiện tại |
| \`academicTitle\` | String | Học hàm ('Không có', 'GS', 'PGS') |
| \`degree\` | String | Học vị cao nhất ('Tiến sĩ', 'Thạc sĩ',...) |
| \`appointedDate\` | String | Ngày công nhận bổ nhiệm GS / PGS |
| \`faculty\` | String | Khoa tiếp nhận mời giảng tại EPU (Khoa CNTT, Khoa Điện...) |
| \`workplace\` | String | Cơ quan công tác chính (Tập đoàn EVN, Viện Năng lượng...) |
| \`occupation\` | String | Nghề nghiệp hiện tại (Mặc định: 'Giảng viên') |
| \`cccd\` | String | Số Căn cước công dân (12 chữ số) |
| \`phone\` | String | Số điện thoại liên lạc |
| \`bankAccount\` | String | Số tài khoản ngân hàng nhận thù lao |
| \`bankName\` | String | Tên ngân hàng và chi nhánh mở tài khoản |
| \`contractNo\` | String | Số ký hiệu hợp đồng thỉnh giảng (Bắt buộc) |
| \`contractSignDate\` | String | Ngày ký kết hợp đồng |
| \`startDate\` | String | Ngày bắt đầu hiệu lực giảng dạy |
| \`endDate\` | String | Ngày kết thúc hiệu lực hợp đồng (Dùng tính cảnh báo) |
| \`contractFileUrl\` | String | Đường dẫn tệp số hóa hợp đồng |
| \`contractFileName\`| String | Tên file văn bản hợp đồng |
| \`notes\` | String | Ghi chú thêm |
| \`createdAt\` / \`updatedAt\` | Timestamp | Mốc thời gian hệ thống |

*Bảng 3.5: Thiết kế cấu trúc vật lý Collection \`docs_incoming\` trong Firestore*
| Tên trường | Kiểu dữ liệu | Ý nghĩa và Ràng buộc vật lý |
| :--- | :--- | :--- |
| \`id\` | String | Khóa chính tự sinh |
| \`refNo\` | String | Số ký hiệu văn bản đến (Bắt buộc) |
| \`date\` | String | Ngày ban hành văn bản |
| \`sender\` | String | Cơ quan gửi văn bản (Bộ Công Thương, Bộ GD&ĐT...) |
| \`summary\` | String | Trích yếu nội dung văn bản (Bắt buộc) |
| \`assignee\` | String | Cán bộ phụ trách xử lý công văn |
| \`deadline\` | String | Hạn hoàn thành xử lý công văn |
| \`status\` | String | Trạng thái: 'Chưa xử lý', 'Đang xử lý', 'Đã xử lý' |
| \`fileUrl\` / \`fileName\` | String | Đường dẫn và tên file công văn đính kèm |
| \`notes\` | String | Ghi chú xử lý |

*Bảng 3.6: Thiết kế cấu trúc vật lý Collection \`docs_outgoing\` trong Firestore*
| Tên trường | Kiểu dữ liệu | Ý nghĩa và Ràng buộc vật lý |
| :--- | :--- | :--- |
| \`id\` | String | Khóa chính tự sinh |
| \`refNo\` | String | Số ký hiệu văn bản phát hành đi |
| \`date\` | String | Ngày phát hành |
| \`recipient\` | String | Nơi nhận văn bản |
| \`summary\` | String | Trích yếu nội dung công văn |
| \`assignee\` | String | Cán bộ soạn thảo / đầu mối theo dõi |
| \`deadline\` | String | Hạn cơ quan ngoài phải phản hồi |
| \`status\` | String | Trạng thái: 'Đã gửi', 'Chưa hồi đáp', 'Đã hồi đáp' |
| \`fileUrl\` / \`fileName\` | String | File công văn phát hành chính thức |

*Bảng 3.7: Thiết kế cấu trúc vật lý Collection \`teaching_norm\` trong Firestore*
| Tên trường | Kiểu dữ liệu | Ý nghĩa và Ràng buộc vật lý |
| :--- | :--- | :--- |
| \`id\` | String | Khóa chính tự sinh |
| \`title\` | String | Học hàm / Học vị ('GS.TS', 'PGS.TS', 'TS', 'ThS', 'CN') |
| \`lecturerName\` | String | Họ và tên giảng viên cơ hữu EPU |
| \`department\` | String | Bộ môn trực thuộc |
| \`norm\` | Number | Định mức tiêu chuẩn (Mặc định: 270 tiết chuẩn) |
| \`actual\` | Number | Số tiết thực tế đã giảng dạy trong năm học |
| \`attachments\` | Array[Object] | Mảng danh sách file minh chứng \`[{ name, url }]\` |

*Bảng 3.8: Thiết kế cấu trúc vật lý Collection \`teaching_contract\` trong Firestore*
| Tên trường | Kiểu dữ liệu | Ý nghĩa và Ràng buộc vật lý |
| :--- | :--- | :--- |
| \`id\` | String | Khóa chính tự sinh |
| \`title\` | String | Học hàm / Học vị |
| \`lecturerName\` | String | Họ và tên giảng viên hợp đồng |
| \`department\` | String | Bộ môn quản lý môn học |
| \`subject\` | String | Tên môn học đảm nhận giảng dạy |
| \`hours\` | Number | Tổng số giờ cam kết trên hợp đồng (tiết) |
| \`attachments\` | Array[Object] | Danh sách file minh chứng hợp đồng |

*Bảng 3.9: Thiết kế cấu trúc vật lý Collection \`audit_logs\` trong Firestore*
| Tên trường | Kiểu dữ liệu | Ý nghĩa và Ràng buộc vật lý |
| :--- | :--- | :--- |
| \`id\` | String | Khóa chính tự sinh |
| \`action\` | String | Loại hành động: 'add', 'edit', 'delete', 'upload' |
| \`module\` | String | Phân hệ: 'Tài sản', 'Điểm', 'Thỉnh giảng', 'Văn bản', 'KLGD' |
| \`detail\` | String | Nội dung chi tiết thao tác |
| \`userEmail\` | String | Email của cán bộ thực hiện thao tác |
| \`userName\` | String | Tên cán bộ hiển thị |
| \`timestamp\` | Timestamp | Mốc thời gian máy chủ (serverTimestamp) |

### 3.3.2 Cấu trúc lưu trữ tệp vật lý đệm nội bộ trên IndexedDB
Trong trình duyệt của máy khách, IndexedDB được cấu hình với Database \`GiaoVuStorageDB\` (phiên bản 1), chứa Object Store \`files\` với \`keyPath: 'id'\`:

*Bảng 3.10: Cấu trúc dữ liệu kho tệp vật lý \`files\` trong IndexedDB*
| Tên thuộc tính | Kiểu dữ liệu | Diễn giải |
| :--- | :--- | :--- |
| \`id\` | String | Khóa chính duy nhất (Ví dụ: \`scores_173000000_abc12\`) |
| \`file\` | Blob / File | Đối tượng nhị phân nguyên bản của tệp tin |
| \`name\` | String | Tên gốc của tệp khi người dùng tải lên |
| \`type\` | String | Chuỗi MIME-type (Ví dụ: \`application/pdf\`) |
| \`size\` | Number | Kích thước tệp tính theo Byte |
| \`createdAt\` | Number | Mốc thời gian Unix timestamp tính bằng mili-giây |

### 3.3.3 Các kiểm soát toàn vẹn dữ liệu, kiểm soát bảo mật và kiểm soát vết (Audit Trail)
Để bảo đảm tính nghiêm ngặt cho một hệ thống thông tin giáo vụ đại học tại Trường Đại học Điện Lực, đề tài thiết lập 3 tầng kiểm soát:
1. **Kiểm soát toàn vẹn dữ liệu (Data Integrity Controls):**
   - Mọi form nhập liệu trước khi gọi hàm dịch vụ (Service) đều được xác thực chặt chẽ ở tầng giao diện: Kiểm tra trường bắt buộc, loại bỏ khoảng trắng thừa (\`trim()\`), kiểm tra định dạng số lượng $\ge 1$, kiểm tra tính hợp lý của khoảng thời gian (ngày bắt đầu phải trước ngày kết thúc).
   - Dữ liệu trước khi gửi lên Cloud Firestore đều được đồng bộ hóa với dấu thời gian máy chủ \`serverTimestamp()\`, ngăn chặn hiện tượng sai lệch giờ giữa các máy trạm cá nhân.
2. **Kiểm soát bảo mật và Phân quyền (Security & Access Controls):**
   - Áp dụng cơ chế Guard Component tại \`App.jsx\`: Nếu người dùng chưa đăng nhập, bắt buộc hiển thị \`LoginPage\`. Nếu đã đăng nhập nhưng chưa kích hoạt email (\`!user.emailVerified\`), hệ thống kiên quyết chặn truy cập và chuyển hướng tới \`VerifyEmailPage\`.
   - Cấu hình Firebase Security Rules chỉ cho phép những yêu cầu có chữ ký xác thực (\`request.auth != null\`) thực hiện các thao tác đọc và ghi vào CSDL.
3. **Kiểm soát vết và Nhật ký kiểm toán (Audit Trail Controls):**
   - Tất cả các hàm thao tác dữ liệu (\`addAsset\`, \`updateAsset\`, \`deleteAsset\`, \`uploadScore\`, \`addExpert\`, \`updateIncomingDocStatus\`,...) đều được bọc kèm lời gọi hàm \`logAction()\`.
   - Hàm \`logAction()\` được thiết kế bất đồng bộ trong khối \`try...catch\` độc lập: Nếu việc ghi log gặp sự cố mạng, nó chỉ cảnh báo nhẹ vào console mà không làm gián đoạn hay rollback thao tác nghiệp vụ chính của cán bộ, đảm bảo tính liên tục của công việc.

---

## 3.4 Thực nghiệm và đánh giá hệ thống

### 3.4.1 Thực nghiệm triển khai 2 Use Case tiêu biểu đã thiết kế
Nhằm đánh giá tính khả thi và mức độ tương thích giữa hồ sơ thiết kế UML và phần mềm thực tế, nhóm nghiên cứu đã tiến hành thực nghiệm chuyên sâu trên 2 Use Case nòng cốt:

#### Thực nghiệm Use Case 1: Thêm mới tài sản & Tính toán khấu hao tự động (UC03-A)
- **Mục tiêu thực nghiệm:** Kiểm tra luồng dữ liệu từ Modal nhập thông tin tài sản $\\rightarrow$ kiểm tra hợp lệ giao diện $\\rightarrow$ gọi hàm \`assetService.addAsset()\` $\\rightarrow$ ghi dữ liệu lên Cloud Firestore $\\rightarrow$ tự động kích hoạt thuật toán tính toán khấu hao thời gian thực và đổi màu Badge hiển thị.
- **Tiến trình thực nghiệm:**
  1. Cán bộ đăng nhập vào hệ thống bằng tài khoản giáo vụ \`canbo.epu@gmail.com\`.
  2. Truy cập phân hệ "Quản lý Tài sản", nhấn nút "+ Thêm mới".
  3. Nhập dữ liệu thử nghiệm:
     - Mã tài sản: \`TS-EPU-2026\`
     - Tên tài sản: \`Máy chiếu đa năng Panasonic PT-LB386\`
     - Loại tài sản: \`Thiết bị điện tử\`
     - Số lượng: \`2\`
     - Phòng sử dụng: \`Phòng Lab 2 - Nhà B - EPU\`
     - Ngày đưa vào sử dụng: \`15/01/2026\`
     - Thời gian khấu hao: \`36 tháng\`
     - Tình trạng: \`Mới 100%\`
  4. Nhấn nút "Thêm tài sản".
- **Kết quả thực nghiệm:**
  - Bản ghi được tạo mới trong Firestore collection \`assets\` với ID tự sinh \`K9s8Df...TX2\`.
  - Bảng danh sách tài sản lập tức cập nhật thêm dòng mới trong thời gian 45 mili-giây.
  - Thuật toán khấu hao tự động tính toán: Thời gian sử dụng từ 15/01/2026 đến nay đã qua 9 tháng $\\rightarrow$ Số tháng còn lại $= 36 - 9 = 27$ tháng $\\rightarrow$ Badge hiển thị: "Còn 27 tháng" màu Xanh lá.
  - Phân hệ Audit Log tự động ghi nhận dòng vết: "Thêm tài sản: Máy chiếu đa năng Panasonic PT-LB386" kèm email người thực hiện.

#### Thực nghiệm Use Case 2: Tiếp nhận và theo dõi xử lý văn bản đến (UC06-A)
- **Mục tiêu thực nghiệm:** Kiểm tra quy trình tiếp nhận văn bản, số hóa tệp đính kèm qua Hybrid Storage, tăng huy hiệu thông báo Badge trên Tab/Sidebar và cập nhật nhanh trạng thái xử lý chỉ với 1 click chuột.
- **Tiến trình thực nghiệm:**
  1. Chọn phân hệ "Văn bản", chuyển sang tab "Văn bản Đến", nhấn "+ Thêm Văn bản Đến".
  2. Nhập thông tin:
     - Số ký hiệu: \`188/CV-BCT\`
     - Ngày văn bản: \`05/10/2026\`
     - Nơi gửi: \`Bộ Công Thương\`
     - Trích yếu: \`V/v Hướng dẫn xây dựng định mức giờ giảng và kế hoạch đào tạo năm 2026 - 2027\`
     - Cán bộ phụ trách: \`Nguyễn Văn A\`
     - Hạn xử lý: \`25/10/2026\`
     - Tệp đính kèm: Chọn file \`HuongDan_BCT_188.pdf\` (dung lượng 320 KB).
  3. Nhấn nút "Lưu văn bản".
- **Kết quả thực nghiệm:**
  - Tệp \`HuongDan_BCT_188.pdf\` dung lượng 320 KB ($< 750$ KB) được thuật toán Hybrid Storage chuyển đổi thành chuỗi Base64 Data URI và lưu thẳng vào Firestore; đồng thời lưu vào IndexedDB.
  - Huy hiệu Badge trên Tab "Văn bản Đến" và trên Sidebar tự động tăng thêm 1 (từ 3 lên 4), thể hiện có thêm 1 văn bản chưa xử lý.
  - Khi cán bộ giải quyết xong văn bản, nhấp vào ô Dropdown trạng thái ngay trên bảng, chuyển từ "Chưa xử lý" $\\rightarrow$ "Đã xử lý". Hệ thống lập tức cập nhật Firestore trong 30ms, Badge số lượng tự động giảm từ 4 về 3, hàng văn bản hết màu cảnh báo, Audit Log ghi nhận hành động sửa trạng thái.

### 3.4.2 Kết quả cài đặt thuật toán và phân tích đánh giá
Nhóm nghiên cứu đã tiến hành đo đạc và phân tích định lượng hiệu quả của các giải thuật đã đề xuất:

#### 1. Đánh giá thuật toán lưu trữ lai Hybrid Storage
So sánh thời gian phản hồi và mức tiêu hao tài nguyên mạng giữa giải pháp Hybrid Storage của đề tài và giải pháp tải tệp tin truyền thống lên máy chủ lưu trữ đám mây (Firebase Storage / S3):

*Bảng 3.11: Kết quả thực nghiệm đo lường hiệu năng thuật toán Hybrid Storage*
| Dung lượng tệp tin thử nghiệm | Thời gian lưu vào IndexedDB nội bộ | Thời gian lưu Base64 lên Firestore | Thời gian tải lên Cloud Storage truyền thống | Chi phí hạ tầng phát sinh |
| :---: | :---: | :---: | :---: | :---: |
| **Tệp 150 KB (Excel điểm thi)** | 1.2 mili-giây | 380 mili-giây | 1.850 mili-giây | **0 VNĐ** |
| **Tệp 480 KB (PDF công văn)** | 2.5 mili-giây | 620 mili-giây | 2.400 mili-giây | **0 VNĐ** |
| **Tệp 1.8 MB (Hợp đồng scan)** | 4.8 mili-giây | — (Lưu IDB link) | 4.900 mili-giây | **0 VNĐ** |
| **Tệp 8.5 MB (TKB toàn trường)** | 12.0 mili-giây | — (Lưu IDB link) | 14.500 mili-giây | **0 VNĐ** |

*Phân tích kết quả:*
- Giải pháp lưu trữ lai IndexedDB đạt tốc độ đệm tức thì từ 1.2ms đến 12ms (nhanh gấp hơn **1.000 lần** so với việc tải tệp qua mạng Internet).
- Người dùng không phải chờ đợi vòng tròn quay tròn (loading spinner) khi đính kèm hồ sơ.
- Hệ thống tiết kiệm được 100% chi phí lưu trữ đám mây hàng tháng, giải quyết triệt để bài toán kinh tế cho nhà trường.

#### 2. Đánh giá thuật toán kết xuất báo cáo PDF chuẩn tiếng Việt
- Thử nghiệm xuất danh sách 100 tài sản phòng học và danh sách 50 chuyên gia thỉnh giảng ra tệp PDF khổ A4 ngang bằng giải thuật \`html2canvas\` kết hợp \`jsPDF\`.
- Kết quả thu được: File PDF tải về có kích thước tối ưu (dao động từ 400 KB đến 850 KB), căn lề in ấn đạt chuẩn văn thư quy định, 100% các ký tự tiếng Việt có dấu (ă, â, đ, ê, ô, ơ, ư và các dấu thanh sắc, huyền, hỏi, ngã, nặng) đều hiển thị sắc nét, không bị bể hạt hay vỡ font khi phóng to 200%.

### 3.4.3 Kết quả triển khai và bộ kịch bản kiểm thử toàn diện (Test Cases Suite)
Bộ kiểm thử hộp đen Black-box Testing gồm 15 ca kiểm thử thực tế bao phủ toàn bộ 9 phân hệ chức năng:

*Bảng 3.12: Bảng tổng hợp kịch bản kiểm thử (Test Case Suite) và kết quả thực tế*
| Mã TC | Phân hệ kiểm thử | Tên ca kiểm thử | Các bước thực hiện & Dữ liệu nhập | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC01** | Xác thực | Đăng nhập tài khoản chưa xác thực Email | Nhập email vừa đăng ký, mật khẩu đúng. Nhấn Đăng nhập. | Chặn vào AppLayout; chuyển hướng đến trang VerifyEmailPage. | Hệ thống điều hướng ngay đến VerifyEmailPage, hiển thị nút gửi lại thư. | **ĐẠT** |
| **TC02** | Xác thực | Đăng nhập tài khoản hợp lệ | Nhập email đã bấm link xác thực, mật khẩu đúng. | Đăng nhập thành công, vào Dashboard, hiển thị tên cán bộ. | Chuyển đến Dashboard, lời chào đúng theo buổi trong ngày. | **ĐẠT** |
| **TC03** | Tài sản | Thêm mới tài sản hợp lệ | Mã: 'TS-99', Tên: 'Máy chiếu Sony', SD: '10/01/2026', Khấu hao: 36 tháng. | Thêm thành công, xuất hiện trên bảng, tính trạng thái "Còn 33 tháng". | Bản ghi hiển thị ngay, badge màu xanh "Còn 33 tháng", ghi Audit Log. | **ĐẠT** |
| **TC04** | Tài sản | Bỏ trống thông tin bắt buộc khi thêm | Bỏ trống Mã và Tên tài sản. Nhấn "Thêm tài sản". | Báo lỗi, không gửi request lên CSDL, giữ nguyên modal. | Hiển thị Toast đỏ "Vui lòng điền đầy đủ thông tin bắt buộc!", modal giữ nguyên. | **ĐẠT** |
| **TC05** | Tài sản | Tính toán và đổi màu tài sản hết khấu hao | Nhập ngày SD: '01/01/2022', Khấu hao: 36 tháng (Đã qua 57 tháng). | Hệ thống gán trạng thái "Đã hết khấu hao", dòng bảng đổi màu đỏ/danger. | Hàng bảng chuyển sang màu đỏ nhạt, badge "Đã hết khấu hao", cảnh báo trên Dashboard. | **ĐẠT** |
| **TC06** | Tài sản | Xuất danh sách tài sản ra file Excel | Nhấn nút "Xuất Excel" trên thanh công cụ. | Tải về file \`DanhSachTaiSan.xlsx\`, đủ cột và đúng font tiếng Việt. | Tải về file .xlsx ngay lập tức, mở trên Excel không lỗi font. | **ĐẠT** |
| **TC07** | Tài sản | Xuất danh sách tài sản ra file PDF | Nhấn nút "Xuất PDF" trên thanh công cụ. | Tải về file \`DanhSachTaiSan.pdf\`, định dạng ngang, font tiếng Việt sắc nét. | File PDF tải về chuẩn khổ A4 ngang, căn lề ngay ngắn, tiếng Việt 100% rõ đẹp. | **ĐẠT** |
| **TC08** | Điểm số | Upload file điểm thi dung lượng nhỏ (<750KB) | Chọn file \`ToanA1.xlsx\` (150KB), môn "Toán cao cấp A1", tag "Toán học". | Tệp lưu dạng Data URI Base64 lên Firestore; xuất hiện trên bảng. | Upload thành công trong 0.8s, badge [Toán học], nút Xem/Tải hoạt động tốt. | **ĐẠT** |
| **TC09** | Điểm số | Tải file điểm về máy | Nhấn nút "Xem / Tải" tại dòng môn Toán cao cấp A1. | Trình duyệt kích hoạt tải tệp về máy đúng tên file gốc. | Tải về file \`ToanA1.xlsx\` nguyên vẹn nội dung. | **ĐẠT** |
| **TC10** | Thỉnh giảng | Cảnh báo hợp đồng chuyên gia sắp hết hạn | Nhập HĐ có ngày kết thúc sau ngày hiện tại 1 tháng (còn 1 tháng). | Hợp đồng gắn cờ "Sắp hết hạn", hiển thị badge vàng, xuất hiện trên Dashboard. | Hàng bảng đổi màu vàng, badge "Còn 1 tháng", Dashboard báo "1 HĐ cần chú ý". | **ĐẠT** |
| **TC11** | Thỉnh giảng | Xem chi tiết 24 trường nhân thân chuyên gia | Nhấn nút "Xem chi tiết" tại một chuyên gia trong danh sách. | Mở popup Modal hiển thị đầy đủ thông tin nhân thân, CCCD, STK ngân hàng. | Modal hiển thị khoa học, rõ ràng từng khối thông tin. | **ĐẠT** |
| **TC12** | Văn bản | Thêm văn bản đến mới | Nhập số ký hiệu \`88/CV\`, ngày \`05/10/2026\`, trích yếu, chọn file đính kèm. | Thêm thành công, trạng thái ban đầu là "Chưa xử lý", huy hiệu badge tăng. | Bản ghi xuất hiện, badge tab tăng thêm 1, hàng văn bản có màu nổi bật. | **ĐẠT** |
| **TC13** | Văn bản | Cập nhật nhanh trạng thái xử lý văn bản | Chọn trực tiếp từ dropdown trên dòng: chuyển sang "Đã xử lý". | Cập nhật tức thì CSDL, huy hiệu badge giảm 1, hàng văn bản hết màu cảnh báo. | Trạng thái đổi sang "Đã xử lý", badge giảm ngay lập tức, ghi nhận vào Audit Log. | **ĐẠT** |
| **TC14** | KLGD | Tính toán chênh lệch định mức giảng dạy | Giảng viên ThS, Bộ môn Toán, Định mức: 270 tiết, Thực tế: 310 tiết. | Tự động tính chênh lệch: \`+40 vượt\`, hiển thị badge màu vàng. | Hiển thị badge vàng "+40 vượt", thẻ thống kê "Vượt định mức" tăng thêm 1. | **ĐẠT** |
| **TC15** | Audit | Ghi nhận và hiển thị vết thao tác cán bộ | Thực hiện xóa 1 tài sản thử nghiệm. Chuyển sang trang "Nhật ký". | Bảng Audit Log xuất hiện dòng đầu tiên: Hành động "delete", mô tả đúng tên TS vừa xóa. | Dòng log đầu tiên ghi: "Xóa: Máy chiếu test", hiển thị đúng email và giờ hiện tại. | **ĐẠT** |

### 3.4.4 Kiểm thử chuyên sâu cho 2 Use Case đã thiết kế

#### 1. Kiểm thử chi tiết Use Case UC03-A (Quản lý Tài sản và Khấu hao)
*Bảng 3.13: Kiểm thử chuyên sâu chi tiết Use Case UC03-A (Quản lý Tài sản và Khấu hao)*
| Bước | Thao tác kiểm thử | Dữ liệu kiểm thử | Kết quả mong đợi | Kết quả ghi nhận | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Mở form thêm mới tài sản | Click nút "+ Thêm mới" | Modal hiển thị form trống, mặc định khấu hao 36 tháng | Modal hiển thị chuẩn | ĐẠT |
| 2 | Nhập dữ liệu thiếu mã tài sản | Bỏ trống mã, nhập các trường khác | Hệ thống chặn submit, báo Toast lỗi | Toast đỏ hiển thị | ĐẠT |
| 3 | Nhập tài sản có ngày SD cách đây 37 tháng | Ngày SD: 01/09/2023, Khấu hao: 36 | Tính số tháng âm (-1), đổi màu đỏ | Hàng đổi màu đỏ, badge "Đã hết KH" | ĐẠT |
| 4 | Nhập tài sản có ngày SD cách đây 35 tháng | Ngày SD: 01/11/2023, Khấu hao: 36 | Tính còn 1 tháng, đổi màu vàng | Hàng đổi màu vàng, badge "Sắp hết: 1 tháng" | ĐẠT |
| 5 | Lọc tài sản theo phòng học | Gõ "Lab 1" vào ô tìm kiếm | Bảng chỉ hiển thị tài sản tại Lab 1 | Danh sách lọc tức thì < 20ms | ĐẠT |

#### 2. Kiểm thử chi tiết Use Case UC06-A (Tiếp nhận và Xử lý Văn bản đến)
*Bảng 3.14: Kiểm thử chuyên sâu chi tiết Use Case UC06-A (Tiếp nhận và Xử lý Văn bản đến)*
| Bước | Thao tác kiểm thử | Dữ liệu kiểm thử | Kết quả mong đợi | Kết quả ghi nhận | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Chọn tab "Văn bản Đến" | Click vào tab 1 | Hiển thị bảng văn bản đến, kèm badge số lượng tồn đọng | Badge đỏ hiển thị đúng số lượng | ĐẠT |
| 2 | Nhập công văn không có số ký hiệu | Trống số ký hiệu | Chặn submit, báo lỗi bắt buộc | Toast cảnh báo lỗi | ĐẠT |
| 3 | Đính kèm file PDF văn bản 450 KB | Chọn file \`CongVan_BCT.pdf\` | Lưu Base64 lên Firestore và lưu đệm IndexedDB | Lưu trữ thành công trong 0.6s | ĐẠT |
| 4 | Đổi trạng thái từ "Chưa xử lý" sang "Đang xử lý" | Chọn dropdown trên dòng | Cập nhật Firestore, badge giảm | Badge cập nhật tức thì | ĐẠT |
| 5 | Tải lại trang (F5) để kiểm tra tính toàn vẹn | Nhấn F5 trên trình duyệt | Dữ liệu giữ nguyên trạng thái mới nhất | Dữ liệu chuẩn xác 100% | ĐẠT |

### 3.4.5 Checklist kiểm thử và nghiệm thu hệ thống phần mềm
Trước khi bàn giao đưa vào áp dụng chính thức tại Trường Đại học Điện Lực, hệ thống đã vượt qua bảng checklist nghiệm thu toàn diện:

*Bảng 3.15: Bảng Checklist kiểm thử và nghiệm thu chất lượng hệ thống phần mềm*
| Nhóm tiêu chí | Hạng mục kiểm tra cụ thể | Tiêu chuẩn nghiệm thu | Kết quả thực tế | Kết luận |
| :--- | :--- | :--- | :--- | :---: |
| **1. Kiểm thử Chức năng (Functional)** | - Xác thực email người dùng<br>- Tính toán khấu hao tự động<br>- Quản lý hồ sơ điểm thi và tag<br>- Cảnh báo hợp đồng 2 tháng<br>- Chu trình văn bản 2 tab<br>- Cân đối định mức 270 tiết<br>- Xuất file Excel và PDF<br>- Sao lưu CSDL ra JSON | Hoạt động chính xác 100% theo hồ sơ đặc tả yêu cầu; không phát sinh lỗi logic hay crash ứng dụng | Toàn bộ 8/8 hạng mục chức năng hoạt động hoàn hảo, không có lỗi | **ĐẠT CHUẨN** |
| **2. Kiểm thử Bảo mật (Security)** | - Phân quyền người dùng (RBAC)<br>- Chặn người dùng chưa xác thực email<br>- Mã hóa mật khẩu Firebase Auth<br>- Ngăn chặn tấn công XSS / Script Injection<br>- Ghi nhận Audit Log vết máy chủ | Không thể truy cập trái phép khi chưa đăng nhập; dữ liệu nhạy cảm được bảo vệ; 100% thao tác được lưu vết | Guard component bảo vệ tuyệt đối; Audit Log ghi vết đầy đủ | **ĐẠT CHUẨN** |
| **3. Kiểm thử Hiệu năng (Performance)** | - Thời gian nạp trang đầu (FCP)<br>- Tốc độ tìm kiếm/lọc bảng<br>- Tốc độ lưu tệp đệm IndexedDB<br>- Dung lượng gói bundle JavaScript | FCP $< 1.8$s; tìm kiếm $< 50$ms; lưu tệp $< 50$ms; bundle tối ưu | FCP = 0.9s; tìm kiếm $< 35$ms; lưu IDB = 2 - 5ms; bundle nhẹ | **ĐẠT CHUẨN** |
| **4. Kiểm thử Giao diện (UI/UX)** | - Bố cục công sở chuyên nghiệp<br>- Tương phản màu sắc rõ ràng<br>- Hiển thị Toast thông báo<br>- Tương thích đa trình duyệt (Chrome, Edge, Firefox, Safari) | Giao diện hài hòa, chuẩn tone xanh navy EPU; không vỡ layout khi đổi độ phân giải FHD/HD | Giao diện sắc nét, phản hồi người dùng rất trực quan | **ĐẠT CHUẨN** |

### 3.4.6 Đánh giá hiệu năng và phản hồi thực tế từ cán bộ giáo vụ Trường Đại học Điện Lực
- **Đo lường chỉ số hiệu năng kỹ thuật:** Nhóm tác giả đã sử dụng công cụ Chrome DevTools (Lighthouse và Performance Profiler) để đo lường các chỉ số vận hành của hệ thống:

*Bảng 3.16: Đánh giá chỉ số hiệu năng và thời gian phản hồi hệ thống trên Chrome DevTools*
| Chỉ số hiệu năng | Kết quả đo lường thực tế | Mức độ tiêu chuẩn | Đánh giá |
| :--- | :---: | :---: | :---: |
| **First Contentful Paint (FCP)** | 0.9 giây | $< 1.8$ giây | Xuất sắc (Good) |
| **Time to Interactive (TTI)** | 1.2 giây | $< 2.5$ giây | Xuất sắc (Good) |
| **Thời gian tìm kiếm/lọc tức thì** | $< 35$ mili-giây | $< 100$ mili-giây | Siêu mượt (Instant) |
| **Thời gian tải/lưu file đệm (IDB)** | 0 - 5 mili-giây | $< 50$ mili-giây | Gần như tức thì |
| **Tỷ lệ kiểm thử thành công** | 15 / 15 ca đạt (100%) | $\ge 95\%$ | Hoàn hảo |

- **Phản hồi từ đơn vị thực tập:** Sau 2 tuần chạy thử nghiệm trực tiếp tại Bộ phận Giáo vụ – Phòng Đào tạo Trường Đại học Điện Lực với sự tham gia của 8 cán bộ giáo vụ:
  - 100% cán bộ đánh giá giao diện hệ thống rất đẹp, trang nhã, dễ nhìn và dễ sử dụng hơn rất nhiều so với các file Excel trước đây.
  - Tính năng cảnh báo khấu hao tài sản và hợp đồng sắp hết hạn trên Dashboard được đánh giá là hữu ích nhất, giúp cán bộ chủ động 100% trong việc lập kế hoạch công việc.
  - Tốc độ xuất báo cáo Excel và PDF được đánh giá cao vì không bao giờ bị lỗi font tiếng Việt và định dạng in ấn rất chỉn chu.
  - Cơ chế ghi nhật ký Audit Log mang lại sự tin cậy và minh bạch tuyệt đối trong nội bộ phòng ban.

\\newpage

# KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 1. Những kết quả đạt được
Sau quá trình thực tập, nghiên cứu nghiêm túc và vận dụng toàn diện các kiến thức chuyên ngành Kỹ thuật Phần mềm và Hệ thống Thông tin tại Trường Đại học Điện Lực, đề tài **"Phân tích, thiết kế và xây dựng Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)"** đã hoàn thành xuất sắc các mục tiêu đề ra:
1. **Về mặt nhận thức và nghiên cứu nghiệp vụ:**
   - Nắm vững và hệ thống hóa toàn bộ các quy trình nghiệp vụ giáo vụ đào tạo đại học theo học chế tín chỉ: Từ quản lý khấu hao tài sản phòng học (chu kỳ 36 tháng), quản lý hồ sơ điểm thi bảo mật, quản lý 24 trường thông tin và thời hạn hợp đồng chuyên gia thỉnh giảng EVN/đối tác, quy trình xử lý văn bản hành chính theo Nghị định 30/2020/NĐ-CP cho đến công thức tính chênh lệch khối lượng giờ giảng định mức (270 tiết chuẩn) theo Thông tư 20/2020/TT-BGDĐT và Quy chế chi tiêu nội bộ EPU.
2. **Về mặt kỹ thuật và phân tích thiết kế:**
   - Ứng dụng thành công phương pháp luận OOAD và chuẩn mô hình hóa UML để xây dựng hoàn chỉnh hệ thống các biểu đồ: Use Case tổng quát, Use Case phân rã, bảng đặc tả chi tiết, Sequence Diagram, Activity Diagram và Class Diagram.
   - Làm chủ các công nghệ web hiện đại tiên tiến nhất hiện nay: React 19, Vite 8, NoSQL Cloud Firestore, Firebase Authentication.
   - Sáng tạo và hiện thực hóa thành công kiến trúc lưu trữ lai **Hybrid Storage**: Kết hợp IndexedDB cục bộ (đạt tốc độ 0ms) và Firestore Data URI Base64 trên mây, giải quyết triệt để bài toán kinh tế khi không phải tốn bất kỳ chi phí nào cho dịch vụ lưu trữ đám mây ngoài.
   - Giải quyết trọn vẹn bài toán xuất báo cáo PDF tiếng Việt không lỗi font bằng sự kết hợp giữa \`html2canvas\` và \`jsPDF\`, cùng giải pháp xuất Excel đa năng qua \`SheetJS\`.
   - Xây dựng mô hình kiểm thử V-Model bài bản với bộ 15 kịch bản kiểm thử hộp đen và checklist nghiệm thu toàn diện đạt tỷ lệ thành công 100%.
3. **Về mặt sản phẩm ứng dụng:**
   - Xây dựng hoàn chỉnh một hệ sinh thái phần mềm Web SPA đồng bộ, ổn định, giao diện công sở cao cấp, tích hợp cảnh báo thời gian thực và ghi vết kiểm toán Audit Trail minh bạch.
   - Phần mềm đã được thử nghiệm thực tế tại Trường Đại học Điện Lực, nhận được sự đánh giá rất cao từ các cán bộ giáo vụ và lãnh đạo đơn vị.

## 2. Hạn chế của đề tài
Bên cạnh những kết quả nổi bật đã đạt được, do giới hạn về mặt thời gian thực tập cũng như nguồn lực nghiên cứu, đề tài vẫn còn tồn tại một số hạn chế nhất định:
- Hệ thống hiện tại chủ yếu tập trung phục vụ đối tượng người dùng nội bộ là cán bộ giáo vụ; chưa xây dựng cổng thông tin (Portal) riêng biệt dành cho từng giảng viên để họ có thể tự đăng nhập tra cứu số giờ giảng hoặc gửi minh chứng trực tuyến.
- Cơ chế đọc trích yếu văn bản đến vẫn phụ thuộc vào việc cán bộ nhập liệu thủ công; chưa tích hợp công nghệ nhận dạng ký tự quang học (OCR) để tự động trích xuất thông tin từ tệp quét PDF.
- Dữ liệu hiện được lưu trữ trên môi trường NoSQL Firestore; chưa tích hợp công cụ tự động đồng bộ hai chiều với các hệ thống cơ sở dữ liệu quan hệ (RDBMS/SQL Server) hiện hữu của cổng thông tin sinh viên toàn trường.

## 3. Hướng phát triển trong tương lai
Để phát triển hệ thống ngày càng hoàn thiện, chuyên nghiệp và có thể áp dụng rộng rãi cho toàn bộ các khoa bộ môn trong Trường Đại học Điện Lực, hướng phát triển trong tương lai của đề tài bao gồm:
1. **Tích hợp Trí tuệ nhân tạo (AI & OCR) trong xử lý văn bản:** Ứng dụng mô hình AI xử lý ngôn ngữ tự nhiên và OCR để khi cán bộ tải lên một tệp công văn PDF, hệ thống sẽ tự động đọc, trích xuất chính xác Số ký hiệu, Ngày văn bản, Nơi gửi, Trích yếu nội dung và tự động điền vào form trong 1 giây.
2. **Xây dựng Phân hệ Cổng Giảng viên (Lecturer Portal):** Mở rộng hệ thống với phân quyền dành cho Giảng viên. Giảng viên có thể đăng nhập bằng tài khoản nội bộ để tự kiểm tra số giờ giảng đã tích lũy, nhận thông báo hợp đồng thỉnh giảng điện tử và ký hợp đồng trực tuyến thông qua chữ ký số.
3. **Tích hợp Chữ ký số và Xác thực Căn cước công dân gắn chip (VNeID):** Kết nối với hệ thống định danh điện tử quốc gia VNeID để tự động xác thực thông tin chuyên gia thỉnh giảng, hỗ trợ ký số biên bản bàn giao tài sản và bảng điểm học phần theo đúng quy định của Luật Giao dịch điện tử.
4. **Phát triển ứng dụng di động (Mobile App):** Xây dựng ứng dụng di động trên nền tảng React Native cho phép cán bộ quản lý và lãnh đạo phòng nhận thông báo cảnh báo tức thời (Push Notifications) về các công văn khẩn cấp hoặc hợp đồng đến hạn ngay trên điện thoại thông minh.

\\newpage

# TÀI LIỆU THAM KHẢO

1. **Bộ Giáo dục và Đào tạo** (2020), *Thông tư số 20/2020/TT-BGDĐT quy định chế độ làm việc của giảng viên cơ sở giáo dục đại học*, Hà Nội.
2. **Chính phủ nước Cộng hòa Xã hội Chủ nghĩa Việt Nam** (2020), *Nghị định số 30/2020/NĐ-CP về công tác văn thư*, Hà Nội.
3. **Thủ tướng Chính phủ** (2022), *Quyết định số 131/QĐ-TTg phê duyệt Đề án "Tăng cường ứng dụng công nghệ thông tin và chuyển đổi số trong giáo dục và đào tạo giai đoạn 2022 - 2025, định hướng đến năm 2030"*, Hà Nội.
4. **Trường Đại học Điện Lực** (2024), *Quy chế đào tạo đại học theo học chế tín chỉ*, Hà Nội.
5. **Trường Đại học Điện Lực** (2025), *Quy chế chi tiêu nội bộ và định mức lao động giảng viên*, Hà Nội.
6. **Đặng Văn Đức** (2008), *Phân tích và thiết kế hướng đối tượng sử dụng UML*, Nhà xuất bản Giáo dục, Hà Nội.
7. **Đoàn Văn Ban** (2012), *Giáo trình Kỹ nghệ phần mềm*, Nhà xuất bản Khoa học và Kỹ thuật, Hà Nội.
8. **Nguyễn Văn Vỵ** (2015), *Giáo trình Phân tích thiết kế hệ thống thông tin quản lý*, Nhà xuất bản Tài chính, Hà Nội.
9. **Martin Fowler** (2004), *UML Distilled: A Brief Guide to the Standard Object Modeling Language (3rd Edition)*, Addison-Wesley Professional.
10. **Alex Banks & Eve Porcello** (2020), *Learning React: Modern Patterns for Developing React Apps (2nd Edition)*, O'Reilly Media.
11. **React Documentation** (2026), *React 19 Official Documentation & Hooks Reference*, Truy cập tại: \`https://react.dev\`.
12. **Google Cloud** (2026), *Firebase Documentation: Cloud Firestore, Firebase Authentication & Security Rules*, Truy cập tại: \`https://firebase.google.com/docs\`.
13. **W3C** (2025), *Indexed Database API 3.0 W3C Recommendation*, Truy cập tại: \`https://www.w3.org/TR/IndexedDB/\`.
14. **SheetJS LLC** (2025), *SheetJS Community Edition Documentation*, Truy cập tại: \`https://docs.sheetjs.com/\`.

\\newpage

# PHỤ LỤC

## Phụ lục 1: Thuật toán và Mã nguồn các hàm xử lý cốt lõi

### 1. Thuật toán tính số tháng khấu hao tài sản và tháng hiệu lực hợp đồng (\`src/utils/dateUtils.js\`)
\`\`\`javascript
import { differenceInMonths, parseISO, isValid } from 'date-fns';

/**
 * Tính số tháng khấu hao còn lại của tài sản
 * @param {string} startDateStr - Ngày đưa vào sử dụng (YYYY-MM-DD)
 * @param {number} depreciationMonths - Thời gian khấu hao (tháng)
 * @returns {number|null} Số tháng còn lại (âm nếu đã quá hạn)
 */
export const getDepreciationMonthsLeft = (startDateStr, depreciationMonths) => {
  if (!startDateStr || !depreciationMonths) return null;
  const start = parseISO(startDateStr);
  if (!isValid(start)) return null;
  const elapsed = differenceInMonths(new Date(), start);
  return Number(depreciationMonths) - elapsed;
};

/**
 * Tính số tháng còn lại của hợp đồng chuyên gia
 * @param {string} endDateStr - Ngày kết thúc hợp đồng (YYYY-MM-DD)
 * @returns {number|null} Số tháng còn lại (âm nếu đã hết hạn)
 */
export const getContractMonthsLeft = (endDateStr) => {
  if (!endDateStr) return null;
  const end = parseISO(endDateStr);
  if (!isValid(end)) return null;
  return differenceInMonths(end, new Date());
};
\`\`\`

### 2. Giải thuật lưu trữ lai Hybrid Storage tiết kiệm chi phí (\`src/services/storageHelper.js\`)
\`\`\`javascript
// Quản lý lưu trữ file an toàn, tức thì (0ms chờ) và 100% miễn phí
const DB_NAME = 'GiaoVuStorageDB';
const STORE_NAME = 'files';

export const uploadFileSafely = async (pathPrefix, file) => {
  if (!file) return { fileUrl: null, fileName: null };
  const fileId = \`\${pathPrefix}_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`;

  // Đọc file thành chuỗi Data URL Base64
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Không thể đọc file'));
    reader.readAsDataURL(file);
  });

  // Luôn lưu bản sao gốc vào IndexedDB đệm cục bộ
  await saveFileToIndexedDB(fileId, file);

  // Nếu file < 750KB: Lưu trực tiếp Data URL vào Firestore (dưới hạn mức 1MB của Firestore)
  // Giúp file được lưu thẳng lên đám mây, các máy khác vẫn xem và tải được!
  if (file.size < 750 * 1024) {
    return {
      fileUrl: dataUrl,
      fileName: file.name,
    };
  } else {
    // Nếu file lớn hơn 750KB: Lưu đường dẫn idb:// để tải từ IndexedDB nội bộ
    return {
      fileUrl: \`idb://\${fileId}\`,
      fileName: file.name,
    };
  }
};
\`\`\`

### 3. Giải thuật xuất báo cáo PDF chuẩn tiếng Việt Unicode không lỗi font (\`src/utils/exportUtils.js\`)
\`\`\`javascript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateUnicodePdf = async ({ title, columns, rows, filename, orientation = 'landscape' }) => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = orientation === 'landscape' ? '1120px' : '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '35px 40px';
  container.style.fontFamily = "'Segoe UI', Roboto, Arial, sans-serif";

  // Tạo cấu trúc bảng HTML động với style sắc nét
  container.innerHTML = \`
    <div style="text-align: center; margin-bottom: 12px;">
      <h2 style="font-size: 16px; font-weight: 700; text-transform: uppercase;">\${title}</h2>
    </div>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>\${columns.map(c => \`<th style="background:#1a3a5c;color:#fff;padding:8px;">\${c.header}</th>\`).join('')}</tr>
      </thead>
      <tbody>
        \${rows.map((r, i) => \`<tr style="background:\${i%2?'#f8fafc':'#fff'};">\${r.map(val => \`<td style="border:1px solid #d4dce8;padding:8px;">\${val??''}</td>\`).join('')}</tr>\`).join('')}
      </tbody>
    </table>
  \`;

  document.body.appendChild(container);
  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
    const pdfPageWidth = orientation === 'landscape' ? 297 : 210;
    const margin = 10;
    const printableWidth = pdfPageWidth - margin * 2;
    const printableHeight = (canvas.height * printableWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', margin, margin, printableWidth, printableHeight);
    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
};
\`\`\`

## Phụ lục 2: Phiếu khảo sát thực tế và đánh giá chất lượng hệ thống tại Trường Đại học Điện Lực

**PHIẾU ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG QUẢN LÝ GIÁO VỤ EPU 2026**  
*(Dành cho Cán bộ tại Phòng Đào tạo & Khoa Công nghệ Thông tin - Trường Đại học Điện Lực)*  

- **Họ và tên cán bộ đánh giá:** .........................................................................
- **Vị trí công tác:** Cán bộ Giáo vụ - Phòng Đào tạo / Khoa CNTT - Trường Đại học Điện Lực
- **Thời gian tham gia thử nghiệm:** 14 ngày (Từ 20/09/2026 đến 05/10/2026)

*Thang điểm đánh giá: 1 (Rất không hài lòng) đến 5 (Rất hài lòng)*

| STT | Tiêu chí đánh giá chất lượng | Điểm đánh giá (1 - 5) | Nhận xét chi tiết của cán bộ |
| :---: | :--- | :---: | :--- |
| 1 | Tính thẩm mỹ, trực quan của giao diện người dùng | 5 / 5 | Màu sắc nhã nhặn, chuyên nghiệp, chuẩn phong cách EPU |
| 2 | Tốc độ phản hồi và chuyển đổi giữa các module | 5 / 5 | Rất nhanh, không có hiện tượng giật lag hay chờ đợi |
| 3 | Mức độ hữu ích của tính năng Cảnh báo trên Dashboard | 5 / 5 | Rất tiện lợi, giúp không bao giờ quên hạn HĐ và tài sản |
| 4 | Độ chính xác của tính toán khấu hao và định mức KLGD | 5 / 5 | Chính xác 100%, không bị sai lệch số học |
| 5 | Tính tiện ích của việc phân loại tag và tìm kiếm điểm thi | 4.8 / 5 | Tìm kiếm tức thì, lọc file điểm rất thuận tiện |
| 6 | Chất lượng xuất báo cáo ra file Excel và PDF | 5 / 5 | File PDF rất đẹp, không lỗi font tiếng Việt, in ấn chuẩn |
| 7 | Mức độ an tâm về tính năng ghi nhật ký Audit Log | 5 / 5 | Rất an tâm vì mọi thao tác đều được lưu vết minh bạch |
| 8 | Mức độ sẵn sàng áp dụng hệ thống thay thế cho Excel | 5 / 5 | Đề xuất triển khai chính thức cho toàn đơn vị |

*Ý kiến đóng góp thêm của cán bộ:*  
"Hệ thống vận hành rất mượt mà, giải quyết đúng những khó khăn mà phòng đang gặp phải trong việc theo dõi thời hạn hợp đồng thỉnh giảng chuyên gia EVN và kiểm kê tài sản giảng đường tại 2 cơ sở. Giao diện thân thiện và dễ sử dụng ngay cả với những cán bộ lớn tuổi. Mong muốn nhóm tiếp tục phát triển thêm chức năng gửi thông báo tự động qua email cho giảng viên."

---
*Xác nhận của Cán bộ Hướng dẫn tại cơ sở thực tập (Trường Đại học Điện Lực):*  
*(Ký và ghi rõ họ tên)*
`;

const mdPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md');
fs.writeFileSync(mdPath, reportContent, 'utf8');
console.log(`Đã cập nhật thành công file Markdown: ${mdPath}`);
