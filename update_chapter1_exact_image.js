import fs from 'fs';
import path from 'path';

const mdPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md');
let content = fs.readFileSync(mdPath, 'utf8');

// 1. Cập nhật Mục lục Chương 1 theo đúng ảnh của người dùng:
// CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN
// 1. Giới thiệu về đơn vị thực tập
//    1.1. Sơ đồ hoạt động
//    1.2. Chức năng của công ty
//    1.3. Nhiệm vụ công ty
//    1.4. Khảo sát hiện trạng
//    1.5. Xác định bài toán cần giải quyết
//    1.6. Phân tích và đặc tả nghiệp vụ của hệ thống

const oldTocCh1Regex = /- \[CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN\][\s\S]+?(?=- \[CHƯƠNG 2)/;

const newTocCh1 = `- [CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN](#chương-1-khảo-sát-hiện-trạng-và-xác-lập-dự-án)
  - [1. Giới thiệu về đơn vị thực tập](#1-giới-thiệu-về-đơn-vị-thực-tập)
    - [1.1. Sơ đồ hoạt động](#11-sơ-đồ-hoạt-động)
    - [1.2. Chức năng của công ty](#12-chức-năng-của-công-ty)
    - [1.3. Nhiệm vụ công ty](#13-nhiệm-vụ-công-ty)
  - [1.4. Khảo sát hiện trạng](#14-khảo-sát-hiện-trạng)
    - [1.4.1. Môi trường hoạt động và cơ cấu tổ chức đơn vị thụ hưởng EPU](#141-môi-trường-hoạt-động-và-cơ-cấu-tổ-chức-đơn-vị-thụ-hưởng-epu)
    - [1.4.2. Khảo sát các quy trình nghiệp vụ giáo vụ hiện hành](#142-khảo-sát-các-quy-trình-nghiệp-vụ-giáo-vụ-hiện-hành)
    - [1.4.3. Thống kê phương tiện, tài nguyên sẵn có](#143-thống-kê-phương-tiện-tài-nguyên-sẵn-có)
    - [1.4.4. So sánh đối chuẩn các giải pháp trên thị trường](#144-so-sánh-đối-chuẩn-các-giải-pháp-trên-thị-trường)
    - [1.4.5. Đánh giá hiện trạng, điểm nghẽn và rủi ro](#145-đánh-giá-hiện-trạng-điểm-nghẽn-và-rủi-ro)
  - [1.5. Xác định bài toán cần giải quyết](#15-xác-định-bài-toán-cần-giải-quyết)
    - [1.5.1. Định nghĩa các bài toán nghiệp vụ cốt lõi](#151-định-nghĩa-các-bài-toán-nghiệp-vụ-cốt-lõi)
    - [1.5.2. Mục tiêu của dự án phần mềm](#152-mục-tiêu-của-dự-án-phần-mềm)
    - [1.5.3. Đề xuất và đánh giá lựa chọn giải pháp công nghệ](#153-đề-xuất-và-đánh-giá-lựa-chọn-giải-pháp-công-nghệ)
  - [1.6. Phân tích và đặc tả nghiệp vụ của hệ thống](#16-phân-tích-và-đặc-tả-nghiệp-vụ-của-hệ-thống)
    - [1.6.1. Quy tắc quản lý nghiệp vụ chi tiết (Business Rules)](#161-quy-tắc-quản-lý-nghiệp-vụ-chi-tiết-business-rules)
    - [1.6.2. Thu thập chứng từ và chu trình lưu chuyển thông tin](#162-thu-thập-chứng-từ-và-chu-trình-lưu-chuyển-thông-tin)
    - [1.6.3. Đặc tả yêu cầu chức năng và phi chức năng](#163-đặc-tả-yêu-cầu-chức-năng-và-phi-chức-năng)
    - [1.6.4. Các phân hệ chức năng chính của hệ thống](#164-các-phân-hệ-chức-năng-chính-của-hệ-thống)
    - [1.6.5. Dự trù kinh phí và kế hoạch triển khai 12 tuần (WBS & Gantt)](#165-dự-trù-kinh-phí-và-kế-hoạch-triển-khai-12-tuần-wbs--gantt)
    - [1.6.6. Tính ưu việt và đóng góp thực tiễn của dự án](#166-tính-ưu-việt-và-đóng-góp-thực-tiễn-của-dự-án)
`;

content = content.replace(oldTocCh1Regex, newTocCh1);

// 2. Nội dung chi tiết toàn bộ Chương 1
const startTag = '# CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN';
const endTag = '# CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
  console.error('Không tìm thấy thẻ phân tách Chương 1!');
  process.exit(1);
}

const newChapter1Full = `# CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN

## 1. Giới thiệu về đơn vị thực tập

- **Tên đơn vị thực tập:** CÔNG TY TNHH CÔNG NGHỆ KTL
- **Tên giao dịch quốc tế:** KTL TECHNOLOGY COMPANY LIMITED (*KTL TECHNOLOGY CO., LTD*)
- **Tên viết tắt:** KTL TECH
- **Địa chỉ trụ sở chính:** Số 100, ngõ 1 phố Phạm Tuấn Tài, phường Nghĩa Đô, quận Cầu Giấy, thành phố Hà Nội.
- **Loại hình doanh nghiệp:** Công ty Trách nhiệm hữu hạn hai thành viên trở lên.
- **Tư cách pháp nhân:** Công ty hoạt động theo Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp, có tư cách pháp nhân đầy đủ theo quy định của pháp luật Việt Nam, hạch toán kinh tế độc lập, có con dấu pháp lý riêng và mở tài khoản hoạt động tại ngân hàng thương mại.

Công ty TNHH Công nghệ KTL được sáng lập bởi đội ngũ chuyên gia công nghệ và kỹ sư phần mềm giàu nhiệt huyết, có bề dày kinh nghiệm thực chiến trong lĩnh vực phát triển phần mềm doanh nghiệp và các nền tảng chuyển đổi số giáo dục. Với định hướng chiến lược là nghiên cứu, thiết kế và phát triển các sản phẩm phần mềm tùy biến cao, tối ưu chi phí vận hành, KTL Tech đã và đang khẳng định vị thế là một trong những đối tác công nghệ uy tín, chuyên cung cấp các giải pháp ứng dụng Web thế hệ mới (Single Page Application - SPA), kiến trúc đám mây Serverless và giải pháp công nghệ giáo dục (EdTech) cho các trường đại học, cao đẳng và các cơ quan hành chính sự nghiệp trên địa bàn Hà Nội.

Trong kỳ thực tập tốt nghiệp, sinh viên **Phan Tùng Sơn** (MSSV: 22810310206, Lớp D17CNPM3 - Khoa Công nghệ Thông tin, Trường Đại học Điện Lực) vinh dự được tiếp nhận thực tập tại **Phòng Phát triển Phần mềm** của Công ty TNHH Công nghệ KTL dưới sự chỉ dẫn trực tiếp của Kỹ sư Trưởng – **ThS. Hoàng Văn Tuấn**. Xuất phát từ nhu cầu thực tiễn của công ty trong việc phát triển giải pháp số hóa giáo vụ đại học và bài toán thực tế tại chính ngôi trường sinh viên đang theo học là **Trường Đại học Điện Lực (EPU)**, sinh viên đã đề xuất và được Ban Giám đốc Công ty KTL cùng Giảng viên hướng dẫn – **TS. Trần Thị Minh Thư** phê duyệt thực hiện đề tài: **"Phân tích, thiết kế và xây dựng Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)"**.

---

## 1.1. Sơ đồ hoạt động

### 1.1.1. Sơ đồ cơ cấu tổ chức bộ máy công ty
Bộ máy quản lý và vận hành của Công ty TNHH Công nghệ KTL được thiết kế theo mô hình tổ chức phẳng (Flat Organization), tinh gọn, linh hoạt và chuyên môn hóa sâu, nhằm tối đa hóa tốc độ phản hồi và sự phối hợp nhịp nhàng giữa các phòng ban:

\`\`\`
                         +-----------------------------------+
                         |           BAN GIÁM ĐỐC            |
                         |            (CEO / CTO)            |
                         +-----------------+-----------------+
                                           |
         +---------------------------------+---------------------------------+
         |                                 |                                 |
+--------+--------+               +--------+--------+               +--------+--------+
| PHÒNG PHÁT TRIỂN|               | PHÒNG KIỂM THỬ  |               | PHÒNG GIẢI PHÁP |
|    PHẦN MỀM     |               |    & QA/QC      |               |  & TRIỂN KHAI   |
| - Frontend Team |               | - Manual Test   |               | - Khảo sát BA   |
| - Backend Team  |               | - Automation    |               | - Triển khai HD |
| - Cloud / DevOps|               | - Security Test |               | - Support KH    |
+-----------------+               +-----------------+               +-----------------+
         |                                                                   |
         +---------------------------------+---------------------------------+
                                           |
                         +-----------------+-----------------+
                         |      PHÒNG HÀNH CHÍNH - KẾ TOÁN   |
                         +-----------------------------------+
\`\`\`
*Hình 1.1: Sơ đồ cơ cấu tổ chức bộ máy Công ty TNHH Công nghệ KTL*

- **Ban Giám đốc (CEO/CTO):** Hoạch định chiến lược kinh doanh, định hướng công nghệ cốt lõi, phê duyệt các đề án nghiên cứu phát triển và ký kết hợp đồng dự án với đối tác.
- **Phòng Phát triển Phần mềm (Software Development Dept):** Là trung tâm kỹ thuật nòng cốt của công ty, bao gồm nhóm kỹ sư Frontend (chuyên sâu React 19, Vite, Next.js), nhóm Backend & Database (Node.js, Cloud Firestore, PostgreSQL) và nhóm Cloud DevOps (quản trị hạ tầng đám mây và CI/CD).
- **Phòng Kiểm thử & Đảm bảo chất lượng (QA/QC Dept):** Giám sát chất lượng độc lập, thiết kế kịch bản kiểm thử (Test Matrix), thực hiện kiểm thử chức năng tự động, kiểm thử hiệu năng tải và bảo đảm an toàn bảo mật trước khi bàn giao sản phẩm.
- **Phòng Giải pháp & Triển khai (Business Analysis & Solution Dept):** Trực tiếp tiếp cận khách hàng, khảo sát quy trình nghiệp vụ thực địa, lập tài liệu đặc tả yêu cầu phần mềm (SRS), tổ chức đào tạo chuyển giao công nghệ và hỗ trợ kỹ thuật người dùng.
- **Phòng Hành chính - Kế toán (HR & Admin Dept):** Quản lý tài chính, nhân sự, đảm bảo cơ sở vật chất và trực tiếp quản lý, hỗ trợ đào tạo sinh viên thực tập tốt nghiệp.

### 1.1.2. Sơ đồ quy trình hoạt động sản xuất phần mềm (Agile/Scrum)
Công ty KTL áp dụng quy trình phát triển phần mềm linh hoạt (Agile Software Development) theo khung làm việc Scrum với chu trình 5 bước khép kín:

\`\`\`
[1. Tiếp nhận & Khảo sát] 
          |
          v
[2. Phân tích & Thiết kế UML] 
          |
          v
[3. Lập trình theo Sprint (1-2 tuần)] <----+ (Phản hồi & Tinh chỉnh)
          |                                |
          v                                |
[4. Kiểm thử QA/QC & Security] ------------+
          |
          v
[5. Đóng gói, Bàn giao & Nghiệm thu]
\`\`\`
*Hình 1.2: Sơ đồ quy trình sản xuất và phát triển phần mềm tại Công ty KTL*

Mỗi chu kỳ Sprint được kiểm soát chặt chẽ qua hệ thống quản lý mã nguồn Git (GitFlow: Feature Branch $\\rightarrow$ Pull Request $\\rightarrow$ Code Review $\\rightarrow$ Merge Main Branch), bảo đảm mọi dòng code đều được tối ưu hóa về tốc độ phản hồi và an toàn dữ liệu.

---

## 1.2. Chức năng của công ty

Công ty TNHH Công nghệ KTL thực hiện 4 nhóm chức năng kỹ thuật và dịch vụ công nghệ chính:
1. **Chức năng Nghiên cứu và Phát triển phần mềm theo đơn đặt hàng:** Thiết kế, lập trình và chuyển giao các hệ thống thông tin quản lý, ứng dụng Web trang đơn (Single Page Application - SPA) chuyên nghiệp, tối ưu hóa giao diện người dùng (UI/UX) với tốc độ phản hồi siêu mượt dưới 100ms.
2. **Chức năng Cung cấp Giải pháp Công nghệ Giáo dục (EdTech):** Xây dựng các nền tảng chuyển đổi số chuyên sâu phục vụ quản trị đại học: quản lý học vụ tín chỉ, khảo thí điểm thi, quản lý hồ sơ nhân thân chuyên gia thỉnh giảng, số hóa công văn hành chính và quản lý tài sản trang thiết bị giảng đường.
3. **Chức năng Tư vấn Kiến trúc Đám mây và Tối ưu hóa Lưu trữ (Cloud & Serverless):** Tư vấn và triển khai kiến trúc hệ thống trên Google Cloud Platform, Firebase Serverless; ứng dụng giải pháp lưu trữ lai sáng tạo (Hybrid Storage) kết hợp bộ nhớ đệm trình duyệt (IndexedDB) với Firestore, giúp loại bỏ hoàn toàn chi phí thuê kho lưu trữ đám mây cho khách hàng.
4. **Chức năng Kiểm định Chất lượng và An toàn Thông tin (QA/QC & Security):** Rà soát mã nguồn, kiểm thử tự động, kiểm tra tính toàn vẹn dữ liệu và thẩm định an toàn ứng dụng web theo tiêu chuẩn bảo mật quốc tế OWASP Top 10.

---

## 1.3. Nhiệm vụ công ty

Nhằm hiện thực hóa các chức năng trên, Công ty KTL thực thi các nhiệm vụ trọng tâm:
1. **Nhiệm vụ sản xuất kinh doanh:** Hoàn thành đúng tiến độ và cam kết chất lượng các hợp đồng phát triển phần mềm cho đối tác; không ngừng nâng cao năng lực cạnh tranh và mở rộng thị phần trong khối giáo dục đại học.
2. **Nhiệm vụ nghiên cứu và đổi mới sáng tạo:** Tiên phong thử nghiệm và làm chủ các công nghệ mới nhất trên thế giới (React 19, Vite 8, Google Firestore, IndexedDB, giải pháp xuất báo cáo vector không lỗi font tiếng Việt); chuyển hóa các nghiên cứu học thuật thành sản phẩm thương mại có giá trị cao.
3. **Nhiệm vụ đồng hành cùng chuyển đổi số quốc gia:** Hỗ trợ các trường đại học, viện nghiên cứu từng bước số hóa các thủ tục hành chính giáo vụ, xóa bỏ các "ốc đảo dữ liệu" phân tán, hướng tới mô hình đại học thông minh không giấy tờ (*Paperless Campus*).
4. **Nhiệm vụ đào tạo nguồn nhân lực chất lượng cao:** Tạo môi trường thực tập chuyên nghiệp cho sinh viên CNTT các trường đại học, gắn kết chặt chẽ lý thuyết giảng đường với thực tế sản xuất phần mềm tại doanh nghiệp.
5. **Nhiệm vụ giao cho sinh viên thực tập:** Giao sinh viên Phan Tùng Sơn trực tiếp khảo sát thực địa tại **Trường Đại học Điện Lực (EPU)**, tiếp cận các quy trình nghiệp vụ giáo vụ thực tế, xây dựng đề án kỹ thuật và hiện thực hóa sản phẩm phần mềm *QuanLyGiaoVu - EPU 2026* dưới sự bảo trợ công nghệ và kiểm thử của công ty.

---

## 1.4. Khảo sát hiện trạng

### 1.4.1. Môi trường hoạt động và cơ cấu tổ chức đơn vị thụ hưởng EPU
- **Cơ quan chủ quản ứng dụng:** TRƯỜNG ĐẠI HỌC ĐIỆN LỰC (EPU) – Bộ Công Thương.
- **Môi trường xã hội:** Trường đào tạo đa ngành với hơn 15.000 sinh viên tại hai cơ sở (Cơ sở 1: Hoàng Quốc Việt, Hà Nội và Cơ sở 2: Sóc Sơn, Hà Nội). Áp lực chuyển đổi số theo Quyết định 131/QĐ-TTg và Đề án 06 của Chính phủ đòi hỏi nhà trường phải chuẩn hóa toàn bộ dữ liệu nhân thân cán bộ, chuyên gia (chuẩn CCCD 12 số) và minh bạch hóa kết quả học tập của sinh viên.
- **Môi trường kinh tế:** Cơ chế tự chủ đại học đòi hỏi EPU phải tiết giảm tối đa chi phí vận hành thường xuyên, kiểm soát chặt chẽ khấu hao tài sản công giảng đường và đối soát chính xác khối lượng giờ giảng để quyết toán tài chính, tránh nguy cơ xuất toán khi kiểm toán nhà nước vào cuộc.
- **Cơ cấu tổ chức bộ phận giáo vụ EPU:** Phòng Đào tạo giữ vai trò đầu mối điều phối, phối hợp cùng các trợ lý giáo vụ tại các Khoa chuyên ngành (tiêu biểu là Khoa Công nghệ Thông tin) phụ trách 5 mảng nghiệp vụ: quản lý giảng đường, khảo thí bảng điểm, chuyên gia thỉnh giảng EVN, văn thư giáo vụ và khối lượng giờ giảng.

### 1.4.2. Khảo sát các quy trình nghiệp vụ giáo vụ hiện hành
Khảo sát thực tế công tác giáo vụ tại EPU cho thấy phần lớn các quy trình vẫn được thực hiện thủ công:
1. **Quản lý tài sản giảng đường:** Theo dõi hàng nghìn thiết bị (máy chiếu, màn hình tương tác, âm ly, máy tính thực hành) trên các file Excel độc lập. Cán bộ không có công cụ tính tự động ngày hết khấu hao, dẫn tới việc nhiều thiết bị hỏng hóc hoặc quá hạn khấu hao mà chưa kịp lập kế hoạch bảo trì, thanh lý.
2. **Quản lý điểm thi và khảo thí:** Giảng viên nộp bảng điểm bản cứng có chữ ký kèm file Excel qua Zalo/Email. Hồ sơ lưu rải rác trên máy tính cá nhân của cán bộ, rất khó khăn khi cần tra cứu phúc khảo hoặc kiểm tra điều kiện tốt nghiệp.
3. **Quản lý chuyên gia thỉnh giảng:** Hàng trăm chuyên gia từ Tập đoàn EVN và các đại học đối tác với hơn 20 trường thông tin nhân thân, hợp đồng. Việc theo dõi thời hạn hợp đồng hoàn toàn dựa vào trí nhớ, dẫn tới nhiều trường hợp hợp đồng hết hạn trước khi kịp làm thủ tục tái ký hoặc thanh toán thù lao.
4. **Quản lý công văn, văn bản đến/đi:** Ghi chép trên sổ giấy A3 kết hợp lưu file Word/PDF trong các thư mục Windows. Không có hệ thống đôn đốc tiến độ xử lý công văn, dễ phát sinh tình trạng chậm trễ văn bản của cấp trên.
5. **Kê khai và đối soát khối lượng giảng dạy:** Cuối mỗi học kỳ, cán bộ phải mở từng file Excel của từng bộ môn, cắt ghép số liệu thủ công để kiểm tra định mức 270 tiết chuẩn của giảng viên, mất từ 3 đến 5 ngày làm việc liên tục.

### 1.4.3. Thống kê phương tiện, tài nguyên sẵn có
Khảo sát hạ tầng kỹ thuật tại Phòng Đào tạo EPU khẳng định đơn vị hoàn toàn đủ điều kiện tiếp nhận hệ thống Web hiện đại:

*Bảng 1.1: Thống kê cơ sở vật chất và trang thiết bị tại đơn vị ứng dụng EPU*
| STT | Nhóm tài nguyên / Thiết bị | Số lượng | Cấu hình & Hiện trạng kỹ thuật | Khả năng đáp ứng cho hệ thống mới |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Máy tính để bàn cán bộ | 12 bộ | Intel Core i5 thế hệ 10/11, RAM 8GB–16GB, SSD 256GB–512GB, Windows 10/11 | Chạy mượt mà ứng dụng Web SPA trên trình duyệt |
| **2** | Hạ tầng mạng truyền dẫn | 2 đường | Mạng LAN Gigabit 1000 Mbps, Internet cáp quang băng thông 300 Mbps | Kết nối tức thì, đồng bộ dữ liệu thời gian thực lên Cloud |
| **3** | Máy quét tài liệu Scanner | 2 máy | Máy quét chuyên dụng Canon/HP tốc độ 35 trang/phút, 600 dpi | Số hóa hợp đồng, công văn sang PDF tải lên hệ thống |
| **4** | Máy in Laser văn phòng | 3 máy | Canon LBP 2900 / HP LaserJet Pro in khổ A4 hai mặt tự động | In ấn trực tiếp báo cáo từ file PDF/Excel xuất ra |
| **5** | Trình duyệt Web | 100% máy | Google Chrome, Microsoft Edge phiên bản mới nhất | Hỗ trợ đầy đủ HTML5, CSS3, IndexedDB |
| **6** | Nhân sự cán bộ giáo vụ | 8 cán bộ | 100% tốt nghiệp đại học, thành thạo tin học văn phòng | Tiếp nhận nhanh chóng giao diện người dùng trực quan |

### 1.4.4. So sánh đối chuẩn các giải pháp trên thị trường

*Bảng 1.2: So sánh đối chuẩn giữa các giải pháp quản lý đào tạo và giáo vụ trên thị trường*
| Tiêu chí so sánh | Hệ thống ERP giáo dục lớn (Edusoft, PSC, UIS) | Bộ công cụ văn phòng chia sẻ (Google Sheets / Excel) | Hệ thống Quản lý Giáo vụ EPU 2026 (Dự án xây dựng) |
| :--- | :--- | :--- | :--- |
| **Mục đích thiết kế** | Phục vụ toàn trường (tuyển sinh, học phí, cổng sinh viên) | Bảng tính biểu mẫu tổng quát | **Tối ưu hóa chuyên sâu 100% cho nghiệp vụ nội bộ Giáo vụ** |
| **Chi phí đầu tư ban đầu** | Rất cao (từ 300 triệu đến hơn 1 tỷ VNĐ) | Miễn phí hoặc gói Google Workspace | **0 VNĐ (Nhờ Serverless và Hybrid Storage)** |
| **Chi phí duy trì hàng năm** | Hàng chục đến hàng trăm triệu VNĐ bảo trì | Phụ thuộc dung lượng lưu trữ thuê | **0 VNĐ chi phí máy chủ hàng tháng** |
| **Khả năng tùy biến nghiệp vụ** | Rất khó, phụ thuộc hoàn toàn vào nhà thầu | Người dùng tự sửa nhưng dễ vỡ cấu trúc | **Tùy biến chuẩn xác theo quy chế đào tạo EPU** |
| **Cảnh báo thời hạn tự động** | Hạn chế, chỉ gửi email rời rạc | Không có cơ chế quét cảnh báo tự động | **Tự động quét và hiển thị thẻ cảnh báo đa sắc trên Dashboard** |
| **Lưu trữ file đính kèm** | Đòi hỏi mở rộng máy chủ tệp đắt tiền | Lưu phân tán trên Drive cá nhân, dễ đứt link | **Kiến trúc Hybrid Storage 0ms, lưu Base64 và IndexedDB** |
| **Nhật ký truy vết (Audit Trail)**| Cồng kềnh, chỉ admin cấp cao xem được | Không thể truy vết ai đã sửa số liệu gì | **Tự động ghi vết mọi hành vi Thêm/Sửa/Xóa kèm email cán bộ** |
| **Tốc độ phản hồi giao diện** | Tải trang chậm (3–5s) do render phía máy chủ | Bị đơ lag khi bảng tính có hàng nghìn dòng | **Siêu mượt (SPA React 19, phản hồi < 100ms)** |

### 1.4.5. Đánh giá hiện trạng, điểm nghẽn và rủi ro
1. **Dữ liệu phân tán và cô lập (Data Silos):** Mỗi cán bộ giữ file riêng, không có cơ sở dữ liệu dùng chung dẫn tới sai lệch phiên bản dữ liệu.
2. **Thiếu cơ chế cảnh báo tự động:** Toàn bộ hạn khấu hao, hạn hợp đồng, tiến độ công văn đều dựa vào trí nhớ, dẫn tới việc chậm trễ công việc.
3. **Nguy cơ mất trắng dữ liệu:** Lưu trữ cục bộ dễ bị virus mã hóa tệp (ransomware) hoặc hỏng ổ cứng vật lý; file điểm thi trôi trên Zalo dễ thất lạc.
4. **Tốn thời gian tổng hợp báo cáo:** Cán bộ mất hàng tuần mỗi kỳ kiểm kê tài sản hoặc quyết toán khối lượng giảng dạy.
5. **Thiếu tính minh bạch và truy vết:** Không xác định được ai đã chỉnh sửa điểm thi, ngày tháng hợp đồng hay xóa tài sản.

---

## 1.5. Xác định bài toán cần giải quyết

### 1.5.1. Định nghĩa các bài toán nghiệp vụ cốt lõi
Dựa trên kết quả khảo sát, hệ thống cần giải quyết dứt điểm 7 bài toán nghiệp vụ trọng tâm:
1. **Bài toán 1 - Tự động hóa khấu hao tài sản giảng đường:** Thiết lập định mức khấu hao 36 tháng, tự động tính số tháng còn lại và hiển thị cảnh báo màu (Xanh/Vàng/Đỏ).
2. **Bài toán 2 - Chuẩn hóa và kiểm soát hợp đồng chuyên gia thỉnh giảng:** Thu thập đủ 24 trường thông tin nhân thân và tự động kích hoạt cảnh báo trước 60 ngày khi hợp đồng sắp hết hiệu lực.
3. **Bài toán 3 - Số hóa và bảo vệ hồ sơ bảng điểm thi:** Lưu trữ tập trung các tệp bảng điểm kết thúc học phần, gắn nhãn Tag bộ môn, chống xóa nhầm và hỗ trợ tra cứu phúc khảo tức thì.
4. **Bài toán 4 - Quản lý quy trình văn bản hành chính theo Nghị định 30/2020/NĐ-CP:** Quản lý văn bản đến/đi theo 2 tab độc lập, theo dõi hạn xử lý và đôn đốc công văn tồn đọng.
5. **Bài toán 5 - Đối soát khối lượng giảng dạy theo Thông tư 20/2020/TT-BGDĐT:** Tự động tính chênh lệch so với định mức chuẩn 270 tiết của giảng viên cơ hữu và theo dõi giờ dạy hợp đồng.
6. **Bài toán 6 - Tối ưu hóa chi phí lưu trữ tệp số hóa:** Giải quyết bài toán lưu trữ tệp dung lượng lớn mà không tốn chi phí thuê kho lưu trữ đám mây.
7. **Bài toán 7 - Bảo mật, phân quyền và kiểm toán hoạt động:** Xác thực người dùng qua liên kết email, phân quyền Quản trị viên/Cán bộ và ghi nhật ký truy vết Audit Log tự động.

### 1.5.2. Mục tiêu của dự án phần mềm
- **Mục tiêu tổng quát:** Xây dựng phần mềm ứng dụng Web hiện đại, số hóa 100% quy trình giáo vụ tại Trường Đại học Điện Lực, tự động hóa tính toán và cảnh báo thời gian thực với chi phí vận hành 0 VNĐ.
- **Mục tiêu cụ thể định lượng:**
  * Số hóa 100% hồ sơ tài sản, bảng điểm, chuyên gia, công văn và khối lượng giảng dạy lên Google Cloud Firestore.
  * Rút ngắn 80% thời gian tìm kiếm thông tin nghiệp vụ (dưới 1 giây qua Instant Search).
  * Loại bỏ 100% tình trạng bỏ sót hạn hợp đồng và hạn khấu hao tài sản.
  * Tối ưu hóa chi phí vận hành tiệm cận 0 VNĐ trên gói Firebase Spark Plan.
  * Đảm bảo an toàn thông tin 100% với cơ chế phân quyền RBAC và ghi vết Audit Log.

### 1.5.3. Đề xuất và đánh giá lựa chọn giải pháp công nghệ
Nhóm nghiên cứu đánh giá 3 phương án:
- *Phương án 1:* Mua phần mềm đóng gói (Chi phí quá cao, khó tùy biến).
- *Phương án 2:* Dùng Google Sheets / VBA (Giao diện đơn điệu, bảo mật kém, dễ đơ lag).
- *Phương án 3 (Lựa chọn):* Xây dựng Hệ thống Web SPA React 19 + Vite 8 + Cloud Firestore + Hybrid Storage.

*Bảng 1.3: Ma trận so sánh đánh giá các phương án giải pháp công nghệ*
| Tiêu chí đánh giá (Thang điểm 1 - 10) | Trọng số | Phương án 1 (Mua đóng gói) | Phương án 2 (Google Sheets / VBA) | Phương án 3 (Xây dựng Web EPU 2026) |
| :--- | :---: | :---: | :---: | :---: |
| 1. Mức độ phù hợp với nghiệp vụ giáo vụ đặc thù | 25% | 6.5 / 10 | 6.0 / 10 | **9.5 / 10** |
| 2. Chi phí đầu tư ban đầu và duy trì vận hành | 20% | 3.0 / 10 | 8.0 / 10 | **9.8 / 10** |
| 3. Khả năng tự động quét cảnh báo hạn thông minh | 15% | 6.5 / 10 | 4.5 / 10 | **9.5 / 10** |
| 4. Hiệu năng, tốc độ phản hồi và trải nghiệm UI/UX| 15% | 6.0 / 10 | 5.5 / 10 | **9.5 / 10** |
| 5. An toàn bảo mật, phân quyền và Audit Trail | 15% | 8.0 / 10 | 4.0 / 10 | **9.0 / 10** |
| 6. Khả năng làm chủ mã nguồn và mở rộng tương lai | 10% | 4.0 / 10 | 5.0 / 10 | **9.5 / 10** |
| **TỔNG ĐIỂM CÓ TRỌNG SỐ** | **100%** | **5.70 / 10** | **5.58 / 10** | **9.49 / 10** |

*Kết luận:* Phương án 3 đạt điểm số cao nhất (**9.49 / 10**), khẳng định tính khả thi vượt trội để triển khai.

---

## 1.6. Phân tích và đặc tả nghiệp vụ của hệ thống

### 1.6.1. Quy tắc quản lý nghiệp vụ chi tiết (Business Rules)
- **Quy tắc BR1 (Khấu hao tài sản 36 tháng):**
  $$\\text{MonthsLeft} = 36 - \\left[ (Y_{\\text{now}} - Y_{\\text{start}}) \\times 12 + (M_{\\text{now}} - M_{\\text{start}}) \\right]$$
  *Phân loại:* $\\text{MonthsLeft} > 1$: Xanh lá (Đang dùng tốt); $0 < \\text{MonthsLeft} \\le 1$: Vàng (Sắp hết khấu hao); $\\text{MonthsLeft} \\le 0$: Đỏ (Đã hết khấu hao).
- **Quy tắc BR2 (Thời hạn hợp đồng chuyên gia thỉnh giảng):**
  $$\\text{ContractMonthsLeft} = (Y_{\\text{end}} - Y_{\\text{now}}) \\times 12 + (M_{\\text{end}} - M_{\\text{now}})$$
  *Phân loại:* $\\le 0$ tháng: Đỏ (Hết hạn); $0 < \\text{tháng} \\le 2$: Vàng (Cảnh báo trước 60 ngày); $> 2$ tháng: Xanh lá.
- **Quy tắc BR3 (Văn bản hành chính):**
  *Văn bản đến:* Chưa xử lý $\\rightarrow$ Đang xử lý $\\rightarrow$ Đã xử lý (quá hạn quy định phải cảnh báo đỏ).  
  *Văn bản đi:* Đã gửi $\\rightarrow$ Chưa hồi đáp $\\rightarrow$ Đã hồi đáp (chờ phúc đáp quá 15 ngày phải nhắc nhở đôn đốc).
- **Quy tắc BR4 (Khối lượng giảng dạy định mức 270 tiết):**
  $$\\text{Diff} = \\text{Hours}_{\\text{actual}} - 270$$
  *Phân loại:* $\\text{Diff} > 0$: Vàng (Vượt giờ); $\\text{Diff} < 0$: Đỏ (Thiếu giờ); $\\text{Diff} = 0$: Xanh lá (Đủ giờ).
- **Quy tắc BR5 (Bảo mật bảng điểm thi):** Lưu trữ tập trung, mã hóa bảo vệ chống ghi đè, hỗ trợ tìm kiếm theo môn học và tải về an toàn.

### 1.6.2. Thu thập chứng từ và chu trình lưu chuyển thông tin
Hệ thống xử lý 5 loại chứng từ: Biên bản bàn giao C53-HD, Bảng tổng hợp điểm thi học phần, Hồ sơ hợp đồng thỉnh giảng, Sổ công văn đến/đi, Bảng kê khối lượng giờ giảng.

Chu trình lưu chuyển 5 bước:
1. Tiếp nhận & Thẩm định tính pháp lý hồ sơ.
2. Số hóa tệp & Cấp mã vào sổ điện tử.
3. Phân công cán bộ thụ lý & Xử lý nghiệp vụ.
4. Đôn đốc & Tự động quét hạn cảnh báo trên Dashboard.
5. Lưu trữ đám mây, phát hành văn bản & Tự động ghi vết Audit Log.

### 1.6.3. Đặc tả yêu cầu chức năng và phi chức năng
- **8 Yêu cầu chức năng (FR):**
  + *FR1:* Xác thực đăng nhập Email/Google, bắt buộc kích hoạt email, phân quyền Admin/Staff.
  + *FR2:* Dashboard trung tâm với 4 thẻ thống kê và vùng hiển thị cảnh báo hạn thông minh.
  + *FR3:* Quản lý tài sản, tự tính khấu hao 36 tháng, xuất báo cáo Excel/PDF.
  + *FR4:* Quản lý hồ sơ bảng điểm thi, gắn nhãn Tag môn học, tải tệp an toàn.
  + *FR5:* Quản lý hồ sơ chuyên gia 24 trường thông tin, cảnh báo hợp đồng trước 60 ngày.
  + *FR6:* Quản lý công văn đến/đi theo 2 tab, huy hiệu đếm tồn đọng, cập nhật trạng thái.
  + *FR7:* Quản lý khối lượng giờ giảng (tab Định mức 270 tiết và tab Hợp đồng), đính kèm minh chứng.
  + *FR8:* Quản trị tài khoản cán bộ, sao lưu phục hồi CSDL ra tệp JSON, ghi nhật ký Audit Log.
- **6 Yêu cầu phi chức năng (NFR):**
  + *NFR1 (Hiệu năng):* Phản hồi tìm kiếm dưới 50ms, FCP dưới 1.2s, lưu tệp đệm IndexedDB 0ms.
  + *NFR2 (Độ sẵn sàng):* Đạt 99.9% trên hạ tầng Google Cloud Serverless, vận hành 24/7.
  + *NFR3 (Bảo mật):* Mã hóa mật khẩu Firebase Auth, quy tắc bảo mật Firestore Rules, chống lỗ hổng OWASP.
  + *NFR4 (Toàn vẹn):* Kiểm tra hợp lệ dữ liệu chặt chẽ, phục hồi CSDL từ bản sao lưu JSON trong 5 giây.
  + *NFR5 (Khả dụng & UX):* Giao diện phong cách hiện đại tone xanh navy, thông báo Toast trực quan.
  + *NFR6 (Tương thích):* Hoạt động hoàn hảo trên Chrome, Edge, Firefox, Safari từ HD đến Full HD.

### 1.6.4. Các phân hệ chức năng chính của hệ thống
Hệ thống được tổ chức thành 9 phân hệ chức năng hoàn chỉnh:
1. Phân hệ Bảng điều khiển Trung tâm (Dashboard & Smart Alerts).
2. Phân hệ Quản lý Tài sản & Khấu hao (Assets Management).
3. Phân hệ Quản lý Hồ sơ Điểm thi (Score Archive Management).
4. Phân hệ Quản lý Chuyên gia Thỉnh giảng (Experts Management).
5. Phân hệ Quản lý Văn bản Đến và Đi (Documents Dispatch Management).
6. Phân hệ Quản lý Khối lượng Giảng dạy (Teaching Load Management).
7. Phân hệ Quản trị Tài khoản & Phân quyền (Users Management).
8. Phân hệ Sao lưu & Phục hồi CSDL (Backup & Restore).
9. Phân hệ Nhật ký Kiểm toán Hoạt động (Audit Trail).

### 1.6.5. Dự trù kinh phí và kế hoạch triển khai 12 tuần (WBS & Gantt)

*Bảng 1.4: Dự trù ngân sách và tài nguyên phục vụ triển khai dự án*
| Khoản mục chi phí | Giải pháp kỹ thuật lựa chọn | Kinh phí dự trù (VNĐ) | Diễn giải & Ghi chú |
| :--- | :--- | :---: | :--- |
| **1. Máy chủ CSDL** | Google Cloud Firestore (Gói Spark Plan) | **0 VNĐ** | Miễn phí 50.000 đọc / 20.000 ghi mỗi ngày |
| **2. Xác thực người dùng** | Firebase Authentication | **0 VNĐ** | Miễn phí không giới hạn Email & Google OAuth |
| **3. Lưu trữ tệp số hóa** | Hybrid Storage (IndexedDB + Base64) | **0 VNĐ** | Tiết kiệm 100% chi phí thuê Cloud Storage |
| **4. Bản quyền thư viện** | React 19, Vite, SheetJS, jsPDF | **0 VNĐ** | Mã nguồn mở giấy phép MIT |
| **5. Máy trạm kiểm thử** | Tận dụng máy tính sẵn có tại KTL và EPU | **0 VNĐ** | Không phát sinh chi phí phần cứng |
| **6. Nhân lực thực hiện** | Sinh viên thực tập (GVHD & Kỹ sư KTL hướng dẫn)| — | Đề tài thực tập tốt nghiệp |
| **TỔNG CỘNG KINH PHÍ** | | **0 VNĐ** | **Tối ưu hóa tài chính tuyệt đối cho nhà trường** |

*Bảng 1.5: Kế hoạch triển khai dự án qua 12 tuần (WBS)*
| Giai đoạn | Tuần | Nội dung công việc chi tiết | Sản phẩm bàn giao |
| :---: | :---: | :--- | :--- |
| **Giai đoạn 1** | **Tuần 1–2** | Tiếp nhận tại KTL; khảo sát thực tế tại EPU, thu thập chứng từ, xác lập yêu cầu | Bản đặc tả yêu cầu (SRS); Báo cáo khảo sát |
| **Giai đoạn 2** | **Tuần 3–4** | Phân tích thiết kế hướng đối tượng UML (Use Case, Sequence, Activity, Class) & CSDL | Bộ hồ sơ thiết kế kiến trúc hệ thống UML |
| **Giai đoạn 3** | **Tuần 5–6** | Cấu hình React 19, Vite, Firebase SDK, xây dựng AppLayout, AuthContext, VerifyEmail | Bộ khung ứng dụng hoàn chỉnh (Base App) |
| **Giai đoạn 4** | **Tuần 7–8** | Lập trình Module Dashboard, Tài sản (khấu hao 36 tháng), Điểm thi, Chuyên gia | Hoàn thành 4 module nghiệp vụ đầu tiên |
| **Giai đoạn 5** | **Tuần 9–10**| Lập trình Module Văn bản, Khối lượng giảng dạy (270 tiết), Users, Backup/Restore, Audit Log | Hoàn thành toàn bộ 9 phân hệ chức năng |
| **Giai đoạn 6** | **Tuần 11** | Kiểm thử QA/QC tại KTL (hộp đen, tải, đa trình duyệt), tối ưu xuất PDF/Excel tiếng Việt | Báo cáo kết quả kiểm thử phần mềm |
| **Giai đoạn 7** | **Tuần 12** | Triển khai thử nghiệm tại EPU, tập huấn cán bộ, nghiệm thu và hoàn thiện báo cáo | Báo cáo thực tập tốt nghiệp toàn văn |

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

### 1.6.6. Tính ưu việt và đóng góp thực tiễn của dự án
1. **Tốc độ phản hồi tức thì (0ms với IndexedDB):** Tương tác mượt mà không độ trễ, lưu và tải tệp siêu tốc.
2. **Cơ chế lưu trữ lai Hybrid Storage tiết kiệm 100% chi phí:** Tệp $<750$KB lưu Base64 trên Firestore, tệp $\ge 750$KB lưu IndexedDB nội bộ, không phát sinh chi phí đám mây.
3. **Cảnh báo thời hạn đa chiều chủ động:** Tự động cảnh báo trước 60 ngày đối với hợp đồng và trước 30 ngày đối với tài sản khấu hao bằng mã màu trực quan.
4. **Bộ công cụ xuất báo cáo chuẩn Unicode tiếng Việt sắc nét:** Kết hợp \`jsPDF\` và \`html2canvas\` tạo tệp PDF A4 sắc nét không lỗi font, xuất bảng tính Excel qua \`SheetJS\`.
5. **Bảo mật hai lớp và phân quyền quản trị nghiêm ngặt:** Bắt buộc kích hoạt email, phân quyền Admin/Staff, khóa tài khoản vi phạm.
6. **Tự chủ dữ liệu và truy vết kiểm toán minh bạch:** Sao lưu phục hồi CSDL dạng JSON độc lập và tự động ghi vết Audit Log mọi hành vi thêm, sửa, xóa.

\\newpage

`;

content = content.slice(0, startIndex) + newChapter1Full + content.slice(endIndex);

fs.writeFileSync(mdPath, content, 'utf8');
console.log('Đã cập nhật thành công Chương 1 theo đúng cấu trúc ảnh của người dùng!');
