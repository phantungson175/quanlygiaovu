import fs from 'fs';
import path from 'path';

const mdPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md');
let content = fs.readFileSync(mdPath, 'utf8');

// 1. Cập nhật thông tin Trang bìa
const oldCoverPart = `**Giảng viên hướng dẫn:** TS. Trần Thị Minh Thư  
**Cán bộ hướng dẫn tại cơ sở:** Cán bộ Giáo vụ – Khoa Công nghệ Thông tin  
**Đơn vị thực tập:** Bộ phận Giáo vụ – Phòng Đào tạo (kết hợp Văn phòng Khoa Công nghệ Thông tin) – Trường Đại học Điện Lực`;

const newCoverPart = `**Giảng viên hướng dẫn:** TS. Trần Thị Minh Thư  
**Cán bộ hướng dẫn tại cơ sở:** ThS. Hoàng Văn Tuấn (Kỹ sư Trưởng - Công ty TNHH Công nghệ KTL)  
**Đơn vị thực tập:** CÔNG TY TNHH CÔNG NGHỆ KTL (Số 100 ngõ 1 phố Phạm Tuấn Tài, Nghĩa Đô, Cầu Giấy, Hà Nội)  
**Đơn vị phối hợp ứng dụng đề tài:** Bộ phận Giáo vụ – Phòng Đào tạo (kết hợp Khoa CNTT) – Trường Đại học Điện Lực`;

content = content.replace(oldCoverPart, newCoverPart);

// 2. Cập nhật Mục lục phần 1.1 và 1.2
const oldTocPart = `- [CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN](#chương-1-khảo-sát-hiện-trạng-và-xác-lập-dự-án)
  - [1.1 Giới thiệu về đơn vị thực tập](#11-giới-thiệu-về-đơn-vị-thực-tập)
    - [1.1.1 Lịch sử hình thành, vị trí pháp lý và chức năng nhiệm vụ của Trường Đại học Điện Lực](#111-lịch-sử-hình-thành-vị-trí-pháp-lý-và-chức-năng-nhiệm-vụ-của-trường-đại-học-điện-lực)
    - [1.1.2 Cơ cấu tổ chức bộ máy và hoạt động nghiệp vụ của Phòng Đào tạo & Giáo vụ EPU](#112-cơ-cấu-tổ-chức-bộ-máy-và-hoạt-động-nghiệp-vụ-của-phòng-đào-tạo--giáo-vụ-epu)
  - [1.2 Khảo sát hiện trạng công tác quản lý giáo vụ tại Trường Đại học Điện Lực](#12-khảo-sát-hiện-trạng-công-tác-quản-lý-giáo-vụ-tại-trường-đại-học-điện-lực)`;

const newTocPart = `- [CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN](#chương-1-khảo-sát-hiện-trạng-và-xác-lập-dự-án)
  - [1.1 Giới thiệu về đơn vị thực tập - Công ty TNHH Công nghệ KTL](#11-giới-thiệu-về-đơn-vị-thực-tập---công-ty-tnhh-công-nghệ-ktl)
    - [1.1.1 Lịch sử hình thành, tư cách pháp nhân và lĩnh vực hoạt động](#111-lịch-sử-hình-thành-tư-cách-pháp-nhân-và-lĩnh-vực-hoạt-động)
    - [1.1.2 Cơ cấu tổ chức bộ máy và quy trình phát triển phần mềm tại Công ty KTL](#112-cơ-cấu-tổ-chức-bộ-máy-và-quy-trình-phát-triển-phần-mềm-tại-công-ty-ktl)
    - [1.1.3 Vị trí thực tập và bối cảnh lựa chọn đề tài Quản lý Giáo vụ EPU](#113-vị-trí-thực-tập-và-bối-cảnh-lựa-chọn-đề-tài-quản-lý-giáo-vụ-epu)
  - [1.2 Khảo sát hiện trạng công tác quản lý giáo vụ tại đối tác ứng dụng – Trường Đại học Điện Lực](#12-khảo-sát-hiện-trạng-công-tác-quản-lý-giáo-vụ-tại-đối-tác-ứng-dụng--trường-đại-học-điện-lực)`;

content = content.replace(oldTocPart, newTocPart);

// 3. Cập nhật Lời cảm ơn
const oldThanksPart = `Em cũng xin trân trọng gửi lời cảm ơn sâu sắc tới Ban Lãnh đạo Phòng Đào tạo, Ban Chủ nhiệm Khoa Công nghệ Thông tin và toàn thể các thầy cô, cán bộ phụ trách công tác giáo vụ tại **Trường Đại học Điện Lực** – Đơn vị tiếp nhận em trong suốt quá trình thực tập tốt nghiệp. Cảm ơn cán bộ hướng dẫn tại cơ sở đã luôn nhiệt tình chia sẻ những bài học thực tế, quy trình nghiệp vụ giáo vụ thực tiễn của nhà trường, tạo mọi điều kiện thuận lợi nhất về môi trường làm việc, cung cấp số liệu và tài liệu cần thiết để em khảo sát, nắm bắt bài toán và hoàn thiện phần mềm *Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)*.`;

const newThanksPart = `Em cũng xin trân trọng gửi lời cảm ơn sâu sắc tới Ban Giám đốc, các anh chị cán bộ kỹ sư tại **Công ty TNHH Công nghệ KTL** – Đơn vị tiếp nhận em trong suốt quá trình thực tập tốt nghiệp. Cảm ơn cán bộ hướng dẫn tại công ty đã luôn nhiệt tình chỉ bảo, truyền đạt những kinh nghiệm thực tế quý báu về quy trình phát triển phần mềm chuyên nghiệp, tạo mọi điều kiện thuận lợi nhất về môi trường làm việc và hỗ trợ kỹ thuật để em hoàn thiện đề tài.

Đồng thời, em xin chân thành cảm ơn Ban Lãnh đạo Phòng Đào tạo, Ban Chủ nhiệm Khoa Công nghệ Thông tin và các thầy cô, cán bộ phụ trách công tác giáo vụ tại **Trường Đại học Điện Lực** – Đơn vị đối tác ứng dụng đề tài. Các thầy cô đã tạo điều kiện giúp đỡ, nhiệt tình cung cấp số liệu, tài liệu biểu mẫu thực tế và chia sẻ những khó khăn, yêu cầu nghiệp vụ chuyên môn để em có cơ sở thực tiễn khảo sát, phân tích bài toán và hoàn thiện sản phẩm *Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)*.`;

content = content.replace(oldThanksPart, newThanksPart);

// 4. Cập nhật toàn bộ Chương 1
const startTag = '# CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN';
const endTag = '# CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
  console.error('Không tìm thấy vị trí bắt đầu hoặc kết thúc của Chương 1!');
  process.exit(1);
}

const newChapter1 = `# CHƯƠNG 1: KHẢO SÁT HIỆN TRẠNG VÀ XÁC LẬP DỰ ÁN

## 1.1 Giới thiệu về đơn vị thực tập - Công ty TNHH Công nghệ KTL

### 1.1.1 Lịch sử hình thành, tư cách pháp nhân và lĩnh vực hoạt động
- **Tên doanh nghiệp:** CÔNG TY TNHH CÔNG NGHỆ KTL
- **Tên giao dịch quốc tế:** KTL TECHNOLOGY COMPANY LIMITED (KTL TECHNOLOGY CO., LTD)
- **Tên viết tắt:** KTL TECH
- **Địa chỉ trụ sở:** Số 100, ngõ 1 phố Phạm Tuấn Tài, phường Nghĩa Đô, quận Cầu Giấy, thành phố Hà Nội.
- **Loại hình doanh nghiệp:** Công ty Trách nhiệm hữu hạn hai thành viên trở lên.
- **Tư cách pháp nhân:** Công ty hoạt động theo Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp, có tư cách pháp nhân đầy đủ, hạch toán kinh tế độc lập, có con dấu riêng và tài khoản ngân hàng hoạt động theo đúng quy định của Luật Doanh nghiệp Việt Nam.

**1. Lịch sử hình thành và phát triển:**  
Công ty TNHH Công nghệ KTL được sáng lập bởi đội ngũ chuyên gia công nghệ và kỹ sư phần mềm giàu nhiệt huyết, có nhiều năm kinh nghiệm nghiên cứu và triển khai các giải pháp công nghệ thông tin tại các tập đoàn lớn trong và ngoài nước. Trải qua quá trình hình thành và phát triển, KTL không ngừng mở rộng quy mô, hoàn thiện năng lực công nghệ và khẳng định vị thế là một trong những đối tác tin cậy chuyên cung cấp các giải pháp phần mềm tùy biến chất lượng cao cho các khối cơ quan hành chính sự nghiệp, các doanh nghiệp vừa và nhỏ, và đặc biệt là khối các cơ sở giáo dục đại học, cao đẳng.

**2. Lĩnh vực hoạt động trọng tâm:**
- *Nghiên cứu và phát triển phần mềm ứng dụng (Software Engineering):* Thiết kế, lập trình và chuyển giao các hệ thống ứng dụng web hiện đại (Single Page Application - SPA), ứng dụng di động đa nền tảng và các cổng dịch vụ công trực tuyến.
- *Giải pháp công nghệ giáo dục và chuyển đổi số trường học (EdTech Solutions):* Cung cấp các nền tảng số hóa quản lý đào tạo, quản lý học vụ tín chỉ, quản lý thi khảo thí, khảo sát chất lượng giảng dạy và số hóa tài liệu hồ sơ giáo vụ.
- *Tư vấn giải pháp kiến trúc đám mây và lưu trữ tối ưu (Cloud & Serverless):* Tư vấn, thiết kế kiến trúc hệ thống trên nền tảng đám mây (Google Cloud, Firebase, AWS), áp dụng mô hình Serverless và các kỹ thuật lưu trữ lai (Hybrid Storage) nhằm tối ưu hóa 100% chi phí vận hành máy chủ cho khách hàng.
- *Dịch vụ kiểm thử phần mềm và bảo đảm chất lượng (Software Testing & QA):* Kiểm thử chức năng, kiểm thử hiệu năng, kiểm định an toàn an ninh thông tin theo các tiêu chuẩn OWASP trước khi bàn giao hệ thống cho đối tác.

**3. Tầm nhìn, Sứ mệnh và Giá trị cốt lõi:**
- *Tầm nhìn:* Trở thành đơn vị công nghệ tiên phong tại Việt Nam trong việc sáng tạo các giải pháp phần mềm tinh gọn, hiện đại, mang lại giá trị thực tiễn cao cho tiến trình chuyển đổi số của hệ thống giáo dục đại học quốc gia.
- *Sứ mệnh:* Đồng hành cùng các cơ quan, đơn vị giáo dục đơn giản hóa tối đa các quy trình quản lý giấy tờ thủ công, xóa bỏ những "ốc đảo dữ liệu" phân tán, nâng cao năng suất tác nghiệp của cán bộ và kiến tạo môi trường làm việc số minh bạch, an toàn.
- *Giá trị cốt lõi:* **"Sáng tạo - Tinh gọn - Trách nhiệm - Tối ưu"**. Mỗi sản phẩm do KTL phát triển đều phải giải quyết triệt để nỗi đau (pain-points) của người dùng thực tế với chi phí đầu tư và bảo trì tiết kiệm nhất.

### 1.1.2 Cơ cấu tổ chức bộ máy và quy trình phát triển phần mềm tại Công ty KTL
#### 1. Cơ cấu tổ chức bộ máy công ty
Bộ máy quản lý và vận hành của Công ty TNHH Công nghệ KTL được thiết kế theo mô hình tổ chức phẳng, linh hoạt và chuyên môn hóa cao, thúc đẩy tính chủ động sáng tạo của từng kỹ sư:
- **Ban Giám đốc (Board of Directors - CEO & CTO):** Chịu trách nhiệm toàn diện về đường lối chiến lược, điều hành kinh doanh, thẩm định các giải pháp công nghệ cốt lõi và ký kết các hợp đồng dự án với đối tác.
- **Phòng Phát triển Phần mềm (Software Development Department):** Là lực lượng nòng cốt của công ty, gồm:
  + *Nhóm Frontend:* Chuyên sâu xây dựng giao diện người dùng bằng các công nghệ hiện đại (React 19, Vite, Next.js, Tailwind/Vanilla CSS), bảo đảm trải nghiệm UI/UX mượt mà, phản hồi dưới 100ms.
  + *Nhóm Backend & Database:* Thiết kế API, xử lý nghiệp vụ, xây dựng và quản trị CSDL quan hệ và phi quan hệ (Cloud Firestore, PostgreSQL, MongoDB).
  + *Nhóm Cloud & DevOps:* Quản lý hạ tầng đám mây, thiết lập đường ống CI/CD tự động và bảo đảm an ninh mạng.
- **Phòng Kiểm thử & Đảm bảo chất lượng (QA/QC Department):** Chịu trách nhiệm thiết kế bộ kịch bản kiểm thử (Test Cases Suite), thực hiện kiểm thử chức năng (Functional Testing), kiểm thử giao diện (UI Testing), kiểm thử bảo mật và nghiệm thu kỹ thuật nội bộ trước khi bàn giao.
- **Phòng Tư vấn Giải pháp & Khảo sát nghiệp vụ (Business Analysis & Solution Dept):** Trực tiếp tiếp xúc khách hàng, khảo sát quy trình thực tế tại các đơn vị thụ hưởng, phân tích yêu cầu (BA) và lập tài liệu đặc tả phần mềm (SRS).
- **Phòng Hành chính - Nhân sự & Kế toán (HR & Admin Dept):** Thực hiện công tác hành chính, tài chính kế toán và tiếp nhận, quản lý, hỗ trợ đào tạo các sinh viên thực tập tốt nghiệp.

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
*Hình 1.1: Sơ đồ cơ cấu tổ chức bộ máy quản lý và vận hành Công ty TNHH Công nghệ KTL*

#### 2. Quy trình phát triển phần mềm chuẩn tại Công ty KTL
Công ty KTL áp dụng quy trình phát triển phần mềm linh hoạt (Agile Software Development) theo khung làm việc Scrum:
1. **Tiếp nhận & Khảo sát yêu cầu (Requirement Gathering):** Kỹ sư BA phối hợp cùng khách hàng khảo sát thực tế, thu thập hồ sơ chứng từ, phân loại yêu cầu chức năng và phi chức năng.
2. **Phân tích thiết kế kiến trúc (System Design):** Xây dựng các sơ đồ Use Case, Sequence Diagram, Activity Diagram, Class Diagram và thiết kế CSDL mức vật lý.
3. **Phát triển lặp theo Sprint (Sprint Development):** Dự án được chia nhỏ thành các Sprint 1 đến 2 tuần. Kết thúc mỗi Sprint đều có sản phẩm chạy được để người dùng trải nghiệm và phản hồi.
4. **Kiểm thử đa tầng (Multi-tier Testing):** Kết hợp kiểm thử đơn vị (Unit Test), kiểm thử tích hợp (Integration Test) và kiểm thử chấp nhận người dùng (User Acceptance Test - UAT).
5. **Đóng gói & Chuyển giao (Deployment & Maintenance):** Bàn giao mã nguồn, tài liệu hướng dẫn sử dụng, đào tạo cán bộ vận hành và duy trì cơ chế bảo hành bảo trì.

### 1.1.3 Vị trí thực tập và bối cảnh lựa chọn đề tài Quản lý Giáo vụ EPU
- **Vị trí thực tập của sinh viên:**  
  Sinh viên **Phan Tùng Sơn** được Công ty TNHH Công nghệ KTL tiếp nhận thực tập tại **Phòng Phát triển Phần mềm** với vị trí công việc: **Thực tập sinh Lập trình viên / Kỹ sư phân tích phần mềm (Software Developer Intern)** dưới sự hướng dẫn chuyên môn trực tiếp của Kỹ sư Trưởng – ThS. Hoàng Văn Tuấn.
- **Nhiệm vụ trọng tâm trong kỳ thực tập:**
  + Tiếp cận các tiêu chuẩn công nghệ tiên tiến của công ty: React 19, công cụ đóng gói Vite 8, cơ sở dữ liệu thời gian thực Google Cloud Firestore, kỹ thuật xử lý lưu trữ phân luồng IndexedDB và các thư viện xuất báo cáo đồ họa tiếng Việt.
  + Nắm vững quy trình phân tích nghiệp vụ, mô hình hóa kiến trúc hệ thống phần mềm hướng đối tượng theo chuẩn UML.
  + Trực tiếp chịu trách nhiệm phân tích, thiết kế, lập trình và kiểm thử một sản phẩm phần mềm hoàn chỉnh có tính ứng dụng thực tiễn cao phục vụ cộng đồng.
- **Bối cảnh lựa chọn đề tài và mối liên hệ thực tiễn giữa Công ty KTL và Trường Đại học Điện Lực:**
  + Trong chiến lược mở rộng danh mục giải pháp công nghệ giáo dục (EdTech), Công ty TNHH Công nghệ KTL luôn tìm kiếm các bài toán thực tế từ các trường đại học lớn để nghiên cứu và xây dựng các nền tảng chuyển đổi số chuyên sâu.
  + Là một sinh viên đang theo học ngành Công nghệ Thông tin tại **Trường Đại học Điện Lực (EPU)**, tác giả nhận thấy rõ thực trạng công tác giáo vụ tại trường: khối lượng hồ sơ sổ sách vô cùng lớn (hàng nghìn trang thiết bị giảng đường, hàng trăm túi bài thi và bảng điểm, danh sách chuyên gia thỉnh giảng đến từ Tập đoàn EVN, hàng trăm văn bản công văn và việc đối soát định mức 270 tiết giảng dạy của cán bộ) phần lớn vẫn đang được quản lý bằng các bảng tính Excel rời rạc và hồ sơ giấy thủ công, dẫn đến tình trạng chậm trễ trong việc nắm bắt thời hạn và tiềm ẩn nguy cơ thất lạc dữ liệu.
  + Xuất phát từ nhu cầu thực tiễn đó, sinh viên đã chủ động đề xuất ý tưởng với Ban Giám đốc Công ty KTL và báo cáo xin ý kiến của Giảng viên hướng dẫn tại trường – **TS. Trần Thị Minh Thư**. Đề xuất đã được cả hai bên nhất trí phê duyệt và giao nhiệm vụ thực hiện đề tài tốt nghiệp: **"Phân tích, thiết kế và xây dựng Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)"**.
  + *Sự phối hợp chặt chẽ giữa hai đơn vị:*
    * **Công ty TNHH Công nghệ KTL:** Đóng vai trò là **đơn vị bảo trợ kỹ thuật và công nghệ**, cung cấp không gian làm việc, định hướng kiến trúc phần mềm hiện đại (Web SPA React 19 kết hợp Cloud Firestore và Hybrid Storage), giám sát quy chuẩn mã nguồn và hỗ trợ quy trình kiểm thử chất lượng phần mềm.
    * **Trường Đại học Điện Lực (EPU):** Đóng vai trò là **đối tác ứng dụng và cung cấp dữ liệu nghiệp vụ thực tế**, nơi sinh viên trực tiếp khảo sát quy trình làm việc tại Phòng Đào tạo và Văn phòng Khoa CNTT, thu thập biểu mẫu chứng từ, phỏng vấn cán bộ giáo vụ và tiến hành thử nghiệm, nghiệm thu thực tế sản phẩm phần mềm.

---

## 1.2 Khảo sát hiện trạng công tác quản lý giáo vụ tại đối tác ứng dụng – Trường Đại học Điện Lực

### 1.2.1 Môi trường xã hội, kinh tế, kỹ thuật và cơ cấu tổ chức cơ quan chủ quản
Nhằm bảo đảm sản phẩm phần mềm xây dựng đáp ứng chính xác 100% nhu cầu thực tế của đơn vị thụ hưởng, nhóm nghiên cứu tại Công ty KTL cùng sinh viên thực hiện đã tiến hành khảo sát toàn diện môi trường hoạt động của Trường Đại học Điện Lực:
- **Môi trường xã hội:**
  + Bộ Công Thương và Bộ GD&ĐT đang quyết liệt chỉ đạo đẩy mạnh chuyển đổi số trong các trường đại học trực thuộc. Đề án 06 của Chính phủ về phát triển ứng dụng dữ liệu về dân cư, định danh điện tử đòi hỏi các cơ sở đào tạo phải chuẩn hóa dữ liệu nhân thân cán bộ, giảng viên và chuyên gia thỉnh giảng (chuẩn CCCD 12 số).
  + Xã hội đòi hỏi tính minh bạch tuyệt đối về kết quả học tập của sinh viên. Mọi sai sót trong khâu ghi nhận điểm hay chậm trễ trong xử lý thủ tục hành chính đều có thể gây ra khủng hoảng truyền thông và ảnh hưởng uy tín học thuật của nhà trường.
- **Môi trường kinh tế:**
  + Cơ chế tự chủ đại học đặt ra yêu cầu khắt khe về việc tối ưu hóa chi phí vận hành thường xuyên và nâng cao hiệu quả sử dụng nguồn vốn ngân sách.
  + Quản lý tài sản công: Hàng nghìn thiết bị giảng đường (máy chiếu, màn hình tương tác, hệ thống âm thanh, máy tính chuyên dụng) là nguồn lực lớn của EPU. Việc không nắm bắt kịp thời thời hạn khấu hao dẫn đến việc chậm thanh lý tài sản cũ hoặc trang bị trùng lặp gây thất thoát ngân sách.
  + Thanh quyết toán tài chính đào tạo: Việc tính toán thù lao vượt giờ của giảng viên cơ hữu và hợp đồng thỉnh giảng phụ thuộc trực tiếp vào tính chính xác của số liệu khối lượng giảng dạy. Bất kỳ sự thiếu minh bạch hay sai lệch nào trong tính toán số tiết định mức đều dẫn tới nguy cơ xuất toán tài chính khi kiểm toán nhà nước vào cuộc.
- **Môi trường kỹ thuật:**
  + Hạ tầng mạng tại Trường Đại học Điện Lực đã được đầu tư đồng bộ: 100% các phòng làm việc được kết nối mạng nội bộ LAN tốc độ Gigabit, đường truyền Internet cáp quang băng thông rộng; tất cả cán bộ giáo vụ đều được trang bị máy vi tính để bàn cá nhân cấu hình chuẩn văn phòng.
  + Về mặt phần mềm: Trước khi triển khai dự án, công cụ làm việc chủ yếu của cán bộ vẫn là bộ ứng dụng văn phòng ngoại tuyến Microsoft Office (Word, Excel) và dịch vụ lưu trữ cá nhân Google Drive / Zalo. Việc chia sẻ thông tin qua email tạo ra những "ốc đảo dữ liệu" (data silos), không có sự liên kết và đồng bộ thời gian thực.
- **Cơ cấu tổ chức của cơ quan chủ quản (Trường Đại học Điện Lực):**
  + Trường Đại học Điện Lực (EPU) được điều hành bởi Hội đồng Trường và Ban Giám hiệu, gồm các Phòng/Ban chức năng (Đào tạo, Kế hoạch Tài chính, Tổ chức Cán bộ, Quản trị Cơ sở vật chất, Khảo thí & ĐBCL, Công tác Sinh viên) và các Khoa/Viện đào tạo chuyên ngành.
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
Trong thời gian thực hiện đề tài, tác giả đã tiến hành thu thập, phân loại toàn bộ hệ thống biểu mẫu chứng từ đang lưu hành tại đơn vị:
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
Nhằm tìm ra giải pháp tối ưu cho bài toán của đơn vị, tác giả cùng nhóm kỹ sư Công ty KTL đã tiến hành khảo sát và so sánh đối chuẩn (Benchmarking) giữa các hệ thống phần mềm quản lý đào tạo đang có mặt trên thị trường:

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
Tổng kết quá trình khảo sát thực tế tại Trường Đại học Điện Lực, nhóm nghiên cứu rút ra những đánh giá khách quan về hệ thống hiện hành:
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
Để giải quyết dứt điểm các tồn tại trên, nhóm nghiên cứu tại Công ty KTL đã xây dựng và phân tích 3 phương án giải pháp:
- **Phương án 1: Mua phần mềm thương mại đóng gói sẵn từ các công ty phần mềm giáo dục.**
  + *Ưu điểm:* Triển khai nhanh, có sẵn các chức năng cơ bản, có đội ngũ kỹ thuật của đối tác bảo hành.
  + *Nhược điểm:* Chi phí mua bản quyền rất đắt (hàng trăm triệu đồng); quy trình của phần mềm đóng gói mang tính khuôn mẫu, không khớp với đặc thù nghiệp vụ giáo vụ nội bộ của trường; mỗi lần yêu cầu chỉnh sửa tính năng hay thay đổi biểu mẫu đều mất chi phí cao và thời gian chờ đợi kéo dài.
- **Phương án 2: Nâng cấp hệ thống bảng tính bằng Google Sheets kết hợp lập trình Google Apps Script / VBA Macro.**
  + *Ưu điểm:* Chi phí thấp, cán bộ tận dụng được kỹ năng dùng Excel có sẵn, hỗ trợ cộng tác trực tuyến nhiều người.
  + *Nhược điểm:* Giao diện không chuyên nghiệp; không kiểm soát được quyền truy cập theo từng nút chức năng; không quản lý được tệp tin đính kèm dung lượng lớn; khi lượng dữ liệu lớn bảng tính sẽ chạy rất chậm; tính năng bảo mật và phân quyền vai trò rất lỏng lẻo.
- **Phương án 3 (Phương án lựa chọn): Xây dựng "Hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực (QuanLyGiaoVu - EPU 2026)" trên nền tảng React 19, Cloud Firestore và kiến trúc lưu trữ lai Hybrid Storage.**
  + *Ưu điểm:*
    * Đáp ứng chính xác 100% các quy tắc nghiệp vụ giáo vụ được khảo sát tại Trường Đại học Điện Lực.
    * Giao diện người dùng Web SPA hiện đại, trực quan, thời gian phản hồi dưới 100ms.
    * Tự động hóa hoàn toàn thuật toán quét và hiển thị cảnh báo hạn khấu hao, hạn hợp đồng, tiến độ văn bản và chênh lệch giờ giảng.
    * Đột phá với giải pháp **Hybrid Storage**: Tốc độ lưu tệp tức thì (0ms) trên IndexedDB và lưu Base64 trên đám mây Firestore, giúp đơn vị **không tốn một đồng chi phí nào cho dịch vụ lưu trữ ngoài**.
    * Xuất báo cáo Excel và PDF chuẩn Unicode tiếng Việt sắc nét, căn lề chuẩn in ấn văn thư.
    * Đảm bảo an toàn thông tin với quy trình xác thực email bắt buộc, phân quyền Quản trị viên/Cán bộ giáo vụ, sao lưu phục hồi dữ liệu JSON độc lập và tự động ghi vết Audit Log.
  + *Nhược điểm:* Đòi hỏi nhóm sinh viên thực hiện phải đầu tư thời gian, công sức nghiên cứu chuyên sâu về phân tích thiết kế hệ thống và làm chủ các công nghệ web tiên tiến nhất dưới sự bảo trợ kỹ thuật của Công ty KTL.

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
Dưới sự tư vấn giải pháp công nghệ của Công ty TNHH Công nghệ KTL, hệ thống ứng dụng sáng tạo kiến trúc đám mây Serverless kết hợp cơ chế lưu trữ lai Hybrid Storage, giúp dự án đạt được hiệu quả kinh tế tối ưu với ngân sách triển khai và duy trì tiệm cận **0 VNĐ**:

*Bảng 1.4: Dự trù ngân sách và tài nguyên phục vụ triển khai dự án QuanLyGiaoVu EPU 2026*
| Khoản mục chi phí | Giải pháp kỹ thuật lựa chọn | Kinh phí dự trù (VNĐ) | Diễn giải & Ghi chú |
| :--- | :--- | :---: | :--- |
| **1. Hạ tầng máy chủ cơ sở dữ liệu** | Google Cloud Firestore (Gói Spark Plan) | **0 VNĐ** | Miễn phí vĩnh viễn 50.000 lượt đọc và 20.000 lượt ghi mỗi ngày, hoàn toàn đủ cho nhu cầu phòng giáo vụ |
| **2. Dịch vụ xác thực người dùng** | Firebase Authentication | **0 VNĐ** | Hỗ trợ xác thực Email và Google OAuth không giới hạn miễn phí |
| **3. Hạ tầng lưu trữ tệp tin số hóa** | Kiến trúc Hybrid Storage (IndexedDB + Base64) | **0 VNĐ** | Không cần thuê Firebase Cloud Storage, tiết kiệm 100% chi phí lưu trữ đám mây |
| **4. Bản quyền công nghệ & thư viện** | React 19, Vite, Lucide, SheetJS, jsPDF | **0 VNĐ** | Toàn bộ là phần mềm mã nguồn mở theo giấy phép MIT |
| **5. Trang thiết bị máy trạm kiểm thử** | Tận dụng máy tính sẵn có tại KTL và EPU | **0 VNĐ** | Không phát sinh chi phí mua sắm phần cứng mới |
| **6. Nhân lực phân tích & lập trình** | 01 Sinh viên thực tập (dưới sự chỉ dẫn của GVHD & Kỹ sư KTL)| — | Đề tài thực tập tốt nghiệp |
| **TỔNG CỘNG KINH PHÍ DỰ ÁN** | | **0 VNĐ** | **Tối ưu hóa tài chính tuyệt đối cho nhà trường** |

#### 2. Kế hoạch triển khai dự án qua 12 tuần (WBS & Biểu đồ Gantt)
Dự án được triển khai bài bản theo quy trình phát triển phần mềm lặp (Iterative Agile) trong thời gian 12 tuần của kỳ thực tập tốt nghiệp, kết hợp chặt chẽ giữa Công ty KTL và Trường Đại học Điện Lực:

*Bảng 1.5: Kế hoạch triển khai dự án qua 12 tuần (WBS)*
| Giai đoạn | Tuần thực hiện | Nội dung công việc chi tiết | Sản phẩm / Kết quả bàn giao |
| :---: | :---: | :--- | :--- |
| **Giai đoạn 1** | **Tuần 1 - 2** | Tiếp nhận tại Công ty KTL; khảo sát thực tế tại Phòng Đào tạo EPU, phỏng vấn cán bộ giáo vụ, thu thập các biểu mẫu chứng từ, xác lập quy tắc quản lý nghiệp vụ và xây dựng bản đặc tả yêu cầu | Bản đặc tả yêu cầu phần mềm (SRS); Báo cáo khảo sát hiện trạng |
| **Giai đoạn 2** | **Tuần 3 - 4** | Phân tích và thiết kế hệ thống hướng đối tượng tại KTL: Xây dựng sơ đồ Use Case, Sequence Diagram, Activity Diagram, Class Diagram và thiết kế CSDL Firestore | Bộ hồ sơ thiết kế kiến trúc hệ thống và sơ đồ UML chuẩn |
| **Giai đoạn 3** | **Tuần 5 - 6** | Thiết lập môi trường React 19 + Vite, cấu hình Firebase SDK, xây dựng Design System, cài đặt khung ứng dụng (AppLayout, Sidebar, Topbar, AuthContext, VerifyEmail) | Bộ khung ứng dụng hoàn chỉnh (Base App) có xác thực email |
| **Giai đoạn 4** | **Tuần 7 - 8** | Hiện thực hóa các phân hệ cốt lõi: Module Dashboard, Module Quản lý Tài sản (khấu hao 36 tháng), Module Quản lý Điểm thi và Module Chuyên gia thỉnh giảng | Hoàn thành 4 module nghiệp vụ chính đầu tiên |
| **Giai đoạn 5** | **Tuần 9 - 10** | Hiện thực hóa các phân hệ tiếp theo: Module Quản lý Văn bản (2 tabs), Module Khối lượng Giảng dạy (270 tiết), Module Quản trị tài khoản, Module Backup/Restore CSDL và Module Audit Log; cài đặt Hybrid Storage | Hoàn thành toàn bộ 9 phân hệ chức năng của phần mềm |
| **Giai đoạn 6** | **Tuần 11** | Thiết kế kịch bản kiểm thử (Test Cases Suite), phối hợp phòng QA/QC Công ty KTL thực hiện kiểm thử hộp đen, kiểm thử tải, kiểm thử đa trình duyệt, sửa lỗi và tối ưu hóa xuất báo cáo PDF/Excel | Bản báo cáo kết quả kiểm thử phần mềm; Bộ mã nguồn hoàn thiện |
| **Giai đoạn 7** | **Tuần 12** | Triển khai thử nghiệm tại Phòng Đào tạo EPU, hướng dẫn cán bộ sử dụng, thu thập ý kiến đánh giá nghiệm thu và hoàn thiện báo cáo tốt nghiệp | Báo cáo thực tập tốt nghiệp toàn văn và bàn giao sản phẩm |

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

`;

content = content.slice(0, startIndex) + newChapter1 + content.slice(endIndex);

fs.writeFileSync(mdPath, content, 'utf8');
console.log('Đã cập nhật thành công Chương 1 và toàn bộ thông tin liên quan vào BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md!');
