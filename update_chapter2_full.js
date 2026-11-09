import fs from 'fs';
import path from 'path';

const mdPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md');
let content = fs.readFileSync(mdPath, 'utf8');

const s2 = content.indexOf('# CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG');
const s3 = content.indexOf('# CHƯƠNG 3: CÀI ĐẶT VÀ THỬ NGHIỆM');

if (s2 === -1 || s3 === -1) {
  console.error('Không tìm thấy vị trí Chương 2 hoặc Chương 3!');
  process.exit(1);
}

const newChapter2 = `# CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

## 2.1 Biểu đồ Use Case tổng quát

### 2.1.1 Xác định các tác nhân hệ thống (Actors)
Dựa trên kết quả khảo sát quy trình tác nghiệp thực tế tại Phòng Đào tạo và Văn phòng Khoa Công nghệ Thông tin – Trường Đại học Điện Lực, hệ thống xác định 3 tác nhân chính tham gia tương tác:

*Bảng 2.1: Danh sách tác nhân (Actors) tham gia vào hệ thống*
| Tác nhân (Actor) | Mô tả vai trò | Quyền hạn trong hệ thống |
| :--- | :--- | :--- |
| **Cán bộ Giáo vụ (Academic Staff)** | Cán bộ trực tiếp giải quyết các sự vụ giáo vụ thường nhật tại trường | Toàn quyền thao tác trên các phân hệ nghiệp vụ: Quản lý Tài sản, Quản lý Điểm thi, Quản lý Chuyên gia thỉnh giảng, Quản lý Văn bản đến/đi, Kê khai Khối lượng giảng dạy, xem Bảng điều khiển Dashboard và tra cứu lịch sử Audit Log. |
| **Quản trị viên (Admin)** | Trưởng bộ phận hoặc Cán bộ quản trị kỹ thuật hệ thống | Thừa hưởng toàn bộ quyền hạn của Cán bộ Giáo vụ; có thêm đặc quyền tối cao: Quản trị tài khoản người dùng (phân quyền vai trò Staff/Admin, khóa/mở khóa tài khoản), Sao lưu toàn bộ CSDL ra tệp JSON và Phục hồi dữ liệu khi có sự cố. |
| **Người dùng chưa xác thực (Guest)** | Tài khoản mới đăng ký nhưng chưa xác thực qua liên kết email | Bị chặn truy cập toàn bộ dữ liệu học vụ; chỉ được phép thao tác tại trang xác minh email (\`VerifyEmailPage\`) và yêu cầu hệ thống gửi lại email kích hoạt. |

---

### 2.1.2 Sơ đồ Use Case tổng quát toàn hệ thống
Biểu đồ Use Case tổng quát mô tả bức tranh toàn cảnh về sự tương tác giữa các tác nhân và các gói chức năng chính. Biểu đồ được thiết kế theo phong cách tối giản, thoáng mắt, các luồng kết nối rõ ràng từ trái qua phải:

#### Mã nguồn vẽ trên PlantText (Copy & Paste vào planttext.com):
\`\`\`plantuml
@startuml
title HỆ THỐNG QUẢN LÝ GIÁO VỤ EPU 2026 - TỔNG QUAN
left to right direction

skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 13
skinparam shadowing false
skinparam roundcorner 15
skinparam nodesep 45
skinparam ranksep 70

skinparam actor {
  BackgroundColor #E0F2FE
  BorderColor #0284C7
  FontColor #0F172A
  FontSize 13
}

skinparam usecase {
  BackgroundColor #FFFFFF
  BorderColor #2563EB
  FontColor #1E293B
  FontSize 13
  BorderThickness 1.5
}

skinparam arrow {
  Color #64748B
  Thickness 1.2
}

actor "Cán bộ Giáo vụ" as Staff
actor "Quản trị viên" as Admin

rectangle "Phần mềm Quản lý Giáo vụ EPU" {
  usecase "1. Đăng nhập & Xác thực Email" as UC1
  usecase "2. Dashboard & Xem Cảnh báo hạn" as UC2
  usecase "3. Quản lý Tài sản & Khấu hao 36 tháng" as UC3
  usecase "4. Quản lý Hồ sơ Điểm thi học phần" as UC4
  usecase "5. Quản lý Chuyên gia & Hạn Hợp đồng" as UC5
  usecase "6. Quản lý Văn bản Đến & Văn bản Đi" as UC6
  usecase "7. Quản lý Khối lượng Giảng dạy (270 tiết)" as UC7
  usecase "8. Quản trị Tài khoản & CSDL (Backup/Log)" as UC8
}

Staff --> UC1
Staff --> UC2
Staff --> UC3
Staff --> UC4
Staff --> UC5
Staff --> UC6
Staff --> UC7

Admin --|> Staff
Admin --> UC8
@enduml
\`\`\`
*Hình 2.1: Biểu đồ Use Case tổng quát hệ thống Quản lý Giáo vụ Trường Đại học Điện Lực*

*Bảng 2.2: Bảng mô tả tóm tắt các Use Case chính của hệ thống*
| Mã UC | Tên Use Case | Tác nhân chính | Mô tả mục tiêu |
| :---: | :--- | :--- | :--- |
| **UC01** | Xác thực & Quản lý phiên | Cán bộ Giáo vụ, Admin, Guest | Đăng nhập bằng Email/Password hoặc Google; kích hoạt email tài khoản |
| **UC02** | Xem Tổng quan & Cảnh báo | Cán bộ Giáo vụ, Admin | Thống kê số liệu toàn hệ thống, tự động quét và cảnh báo các mục sắp đến hạn |
| **UC03** | Quản lý Tài sản | Cán bộ Giáo vụ, Admin | Thêm, sửa, xóa, tìm kiếm tài sản; tính khấu hao 36 tháng; xuất báo cáo Excel/PDF |
| **UC04** | Quản lý Hồ sơ Điểm | Cán bộ Giáo vụ, Admin | Upload file điểm thi, gán nhãn môn học, tra cứu, xem và tải tệp an toàn |
| **UC05** | Quản lý Thỉnh giảng | Cán bộ Giáo vụ, Admin | Quản lý 24 thông tin chuyên gia; cảnh báo hạn hợp đồng trước 60 ngày; xuất danh sách |
| **UC06** | Quản lý Văn bản | Cán bộ Giáo vụ, Admin | Quản lý văn bản đến/đi theo 2 tab; cập nhật trạng thái xử lý; nhắc việc quá hạn |
| **UC07** | Quản lý KLGD | Cán bộ Giáo vụ, Admin | Quản lý định mức 270 tiết (tính thừa/thiếu); quản lý hợp đồng; đính kèm minh chứng |
| **UC08** | Quản trị & An toàn dữ liệu | Quản trị viên (Admin) | Quản lý danh sách cán bộ, đổi vai trò, khóa tài khoản, sao lưu/phục hồi JSON, Audit Log |

---

## 2.2 Phân rã Use Case các phân hệ chính

Trong phần này, hệ thống tiến hành phân rã chi tiết 5 phân hệ nghiệp vụ cốt lõi. Mỗi phân hệ đều được cung cấp đầy đủ: **Biểu đồ phân rã Use Case (PlantUML thoáng mắt)**, **Bảng đặc tả Use Case chi tiết**, **Biểu đồ hoạt động (Activity Diagram)** và **Biểu đồ trình tự (Sequence Diagram)**.

---

### 2.2.1 Phân hệ Quản lý Tài sản và Tính toán khấu hao động

Phân hệ Quản lý Tài sản cho phép cán bộ kiểm soát chặt chẽ toàn bộ máy móc, trang thiết bị phòng học giảng đường EPU, tự động hóa tính toán thời hạn khấu hao 36 tháng và hỗ trợ xuất biên bản kiểm kê.

#### a. Biểu đồ Use Case phân rã chức năng Quản lý Tài sản
\`\`\`plantuml
@startuml
title PHÂN HỆ QUẢN LÝ TÀI SẢN & KHẤU HAO
left to right direction

skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 13
skinparam shadowing false
skinparam roundcorner 12
skinparam nodesep 35
skinparam ranksep 60

skinparam actor {
  BackgroundColor #E0F2FE
  BorderColor #0284C7
}
skinparam usecase {
  BackgroundColor #FFFFFF
  BorderColor #0284C7
  BorderThickness 1.5
}

actor "Cán bộ Giáo vụ" as Staff

rectangle "Quản lý Tài sản" {
  usecase "Tra cứu & Xem danh sách tài sản" as UC_View
  usecase "Thêm mới / Cập nhật tài sản" as UC_Edit
  usecase "Xóa tài sản" as UC_Del
  usecase "Xuất báo cáo Excel / PDF" as UC_Exp
  
  usecase "Tính số tháng khấu hao (36 tháng)" as UC_Calc
  usecase "Cảnh báo tài sản sắp/đã hết hạn" as UC_Alert
}

Staff --> UC_View
Staff --> UC_Edit
Staff --> UC_Del
Staff --> UC_Exp

UC_Edit ..> UC_Calc : <<include>>
UC_Calc ..> UC_Alert : <<extend>>
@enduml
\`\`\`
*Hình 2.2: Biểu đồ phân rã Use Case Phân hệ Quản lý Tài sản*

#### b. Đặc tả Use Case: Thêm mới Tài sản & Tính khấu hao tự động
*Bảng 2.3: Đặc tả Use Case Thêm mới và tính khấu hao tài sản*
| Thuộc tính đặc tả | Nội dung chi tiết |
| :--- | :--- |
| **Mã Use Case** | **UC-ASSET-01** |
| **Tên Use Case** | Thêm mới Tài sản và Tính toán Khấu hao tự động |
| **Tác nhân (Actor)**| Cán bộ Giáo vụ, Quản trị viên |
| **Mô tả tóm tắt** | Cán bộ tiếp nhận và nhập thiết bị giảng đường mới (máy chiếu, âm thanh, máy vi tính); hệ thống tự động xác định số tháng khấu hao còn lại dựa trên chu kỳ 36 tháng, gán Badge màu sắc và kích hoạt cảnh báo hạn |
| **Tiền điều kiện** | Cán bộ đã đăng nhập thành công và đã kích hoạt email |
| **Hậu điều kiện** | Tài sản được lưu trữ vào Firestore collection \`assets\`; hiển thị ngay trên bảng; tự động ghi vết hành vi vào \`audit_logs\` |
| **Luồng sự kiện chính**| 1. Cán bộ nhấn nút **"+ Thêm mới"** trên giao diện Tài sản.<br>2. Hệ thống hiển thị hộp thoại Modal gồm: Mã tài sản, Tên tài sản, Loại tài sản, Số lượng, Phòng sử dụng, Ngày đưa vào SD, Thời gian khấu hao (mặc định 36 tháng), Tình trạng, Ghi chú.<br>3. Cán bộ nhập các trường dữ liệu và nhấn **"Thêm tài sản"**.<br>4. Hệ thống kiểm tra hợp lệ (Mã, Tên, Ngày bắt đầu không được để trống).<br>5. Hệ thống gọi \`addAsset()\`, ghi dữ liệu vào Firestore kèm thời gian máy chủ \`serverTimestamp()\`.<br>6. Thực thi thuật toán \`getDepreciationMonthsLeft()\` để xác định trạng thái màu.<br>7. Hệ thống tự động ghi nhật ký: \`logAction('add', 'Tài sản', 'Thêm: ' + name, user)\`.<br>8. Hiển thị Toast thông báo thành công, đóng Modal và nạp lại bảng dữ liệu. |
| **Luồng ngoại lệ** | - **Bỏ trống trường bắt buộc:** Báo lỗi Toast đỏ *"Vui lòng điền đầy đủ thông tin bắt buộc!"* và giữ nguyên dữ liệu trên form.<br>- **Lỗi mạng:** Báo lỗi kết nối và cho phép cán bộ nhấn thử lại. |

#### c. Biểu đồ hoạt động (Activity Diagram) – Nghiệp vụ Tính khấu hao tài sản
\`\`\`plantuml
@startuml
title BIỂU ĐỒ HOẠT ĐỘNG - TÍNH TOÁN KHẤU HAO & CẢNH BÁO TÀI SẢN
skinparam defaultFontName Arial
skinparam defaultFontSize 12

start
:Cán bộ mở danh sách hoặc thêm mới tài sản;
:Hệ thống lấy Ngày đưa vào SD (startDate) và Số tháng khấu hao (depreciationMonths);
:Lấy mốc thời gian hiện tại của hệ thống (Date.now());
:Tính số tháng đã trôi qua:
elapsed = differenceInMonths(now, startDate);
:Tính số tháng còn lại:
monthsLeft = depreciationMonths - elapsed;

if (monthsLeft <= 0) then (Đúng)
  :Gán trạng thái: "ĐÃ HẾT KHẤU HAO";
  :Gắn Badge màu ĐỎ (danger);
  :Đổi màu nền dòng bảng thành row-danger;
  :Đẩy vào danh sách Cảnh báo đỏ trên Dashboard;
else (Sai)
  if (monthsLeft <= 1) then (Đúng)
    :Gán trạng thái: "SẮP HẾT KHẤU HAO";
    :Gắn Badge màu VÀNG (warning);
    :Đổi màu nền dòng bảng thành row-warning;
    :Đẩy vào danh sách Cảnh báo vàng trên Dashboard;
  else (Sai)
    :Gán trạng thái: "ĐANG SỬ DỤNG TỐT";
    :Gắn Badge màu XANH LÁ (success);
    :Hiển thị dòng bảng bình thường;
  endif
endif

:Hiển thị dữ liệu lên giao diện bảng tài sản;
stop
@enduml
\`\`\`
*Hình 2.3: Biểu đồ hoạt động tính toán khấu hao và kích hoạt cảnh báo*

#### d. Biểu đồ trình tự (Sequence Diagram) – Nghiệp vụ Thêm mới Tài sản
\`\`\`plantuml
@startuml
title BIỂU ĐỒ TRÌNH TỰ - THÊM MỚI TÀI SẢN & GHI AUDIT LOG
autonumber
skinparam defaultFontName Arial
skinparam defaultFontSize 12

actor "Cán bộ Giáo vụ" as Staff
boundary "Giao diện AssetsPage" as UI
control "Asset Service" as Service
control "Audit Service" as Audit
database "Cloud Firestore" as DB

Staff -> UI: Nhấn "+ Thêm mới", nhập form tài sản
Staff -> UI: Nhấn nút "Thêm tài sản"
activate UI

UI -> UI: Kiểm tra validate form (code, name, startDate)
alt Dữ liệu thiếu / không hợp lệ
  UI --> Staff: Hiển thị Toast lỗi "Vui lòng điền đủ thông tin!"
else Dữ liệu hợp lệ
  UI -> Service: addAsset(formData, currentUser)
  activate Service
  
  Service -> DB: addDoc("assets", { ...data, createdAt: serverTimestamp() })
  activate DB
  DB --> Service: Trả về document ID thành công
  deactivate DB
  
  Service -> Audit: logAction("add", "Tài sản", "Thêm: " + name, user)
  activate Audit
  Audit -> DB: addDoc("audit_logs", logData)
  Audit --> Service: Ghi log hoàn tất
  deactivate Audit
  
  Service --> UI: Hoàn thành thêm mới
  deactivate Service
  
  UI --> Staff: Toast thành công, đóng Modal, nạp lại danh sách
end
deactivate UI
@enduml
\`\`\`
*Hình 2.4: Biểu đồ trình tự Thêm mới tài sản và ghi nhật ký kiểm toán*

---

### 2.2.2 Phân hệ Quản lý Chuyên gia Thỉnh giảng và Hạn Hợp đồng

Phân hệ Quản lý Chuyên gia Thỉnh giảng giúp theo dõi hồ sơ 24 trường thông tin của các giảng viên ngoài trường (từ Tập đoàn EVN, Viện Năng lượng...), lưu trữ hợp đồng số hóa và tự động cảnh báo trước 60 ngày khi hợp đồng sắp hết hạn.

#### a. Biểu đồ Use Case phân rã chức năng Quản lý Chuyên gia Thỉnh giảng
\`\`\`plantuml
@startuml
title PHÂN HỆ QUẢN LÝ CHUYÊN GIA THỈNH GIẢNG
left to right direction

skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 13
skinparam shadowing false
skinparam roundcorner 12
skinparam nodesep 35
skinparam ranksep 60

skinparam actor {
  BackgroundColor #E0F2FE
  BorderColor #0284C7
}
skinparam usecase {
  BackgroundColor #FFFFFF
  BorderColor #10B981
  BorderThickness 1.5
}

actor "Cán bộ Giáo vụ" as Staff

rectangle "Quản lý Chuyên gia" {
  usecase "Xem danh sách & Popup 24 trường dữ liệu" as UC_List
  usecase "Thêm / Sửa hồ sơ chuyên gia" as UC_Save
  usecase "Đính kèm file scan hợp đồng số hóa" as UC_Attach
  usecase "Tự động cảnh báo hạn HĐ (trước 60 ngày)" as UC_Alert
  usecase "Xuất danh sách ra Excel / PDF" as UC_Exp
}

Staff --> UC_List
Staff --> UC_Save
Staff --> UC_Exp

UC_Save ..> UC_Attach : <<include>>
UC_List ..> UC_Alert : <<include>>
@enduml
\`\`\`
*Hình 2.5: Biểu đồ phân rã Use Case Quản lý Chuyên gia Thỉnh giảng*

#### b. Đặc tả Use Case: Quản lý Hồ sơ Chuyên gia & Hạn Hợp đồng
*Bảng 2.4: Đặc tả Use Case Quản lý Chuyên gia Thỉnh giảng*
| Thuộc tính đặc tả | Nội dung chi tiết |
| :--- | :--- |
| **Mã Use Case** | **UC-EXPERT-01** |
| **Tên Use Case** | Tiếp nhận Hồ sơ Chuyên gia và Giám sát Hạn Hợp đồng |
| **Tác nhân (Actor)**| Cán bộ Giáo vụ, Quản trị viên |
| **Mô tả tóm tắt** | Cán bộ nhập 24 trường dữ liệu nhân thân, học vị, CCCD, tài khoản ngân hàng và tệp scan hợp đồng của chuyên gia mời giảng; hệ thống tự động kiểm soát mốc hạn và cảnh báo trước 60 ngày |
| **Tiền điều kiện** | Cán bộ đã đăng nhập; có tệp số hóa hợp đồng |
| **Hậu điều kiện** | Lưu vào collection \`experts\`; file lưu trữ an toàn qua Hybrid Storage; hiển thị cảnh báo trên Dashboard nếu hợp đồng còn $\le 2$ tháng |
| **Luồng sự kiện chính**| 1. Cán bộ nhấn **"+ Thêm chuyên gia"**.<br>2. Nhập 24 trường thông tin: Danh xưng, Giới tính, Họ tên, Ngày sinh, Quê quán, Địa chỉ thường trú, Nơi ở hiện tại, Số CCCD (12 số), Học hàm, Học vị, Đơn vị mời giảng tại trường, Cơ quan công tác chính, Số điện thoại, STK, Tên ngân hàng, Số HĐ, Ngày ký, Từ ngày, Đến ngày.<br>3. Chọn file mềm hợp đồng.<br>4. Nhấn **"Thêm chuyên gia"**.<br>5. Hệ thống gọi \`uploadFileSafely()\` lưu tệp qua Hybrid Storage (Base64 hoặc IndexedDB).<br>6. Ghi 24 trường dữ liệu vào Firestore collection \`experts\` kèm thời gian máy chủ.<br>7. Hệ thống tự động tính: \`getContractMonthsLeft(endDate)\`.<br>8. Ghi vết \`logAction()\` và hiển thị thông báo thành công. |
| **Luồng ngoại lệ** | - **Lỗi logic thời hạn:** Ngày kết thúc hợp đồng trước ngày bắt đầu $\rightarrow$ Hệ thống báo lỗi và yêu cầu điều chỉnh lại ngày. |

#### c. Biểu đồ hoạt động (Activity Diagram) – Tiếp nhận và Cảnh báo Hợp đồng
\`\`\`plantuml
@startuml
title BIỂU ĐỒ HOẠT ĐỘNG - TIẾP NHẬN & KIỂM SOÁT HẠN HỢP ĐỒNG
skinparam defaultFontName Arial
skinparam defaultFontSize 12

start
:Tiếp nhận hồ sơ mời giảng chuyên gia ngoài trường;
:Kiểm tra điều kiện học vị (ThS, TS, PGS, GS);
:Nhập 24 trường dữ liệu nhân thân, CCCD, STK ngân hàng;
:Chọn tệp scan hợp đồng số hóa;
:Lưu trữ tệp qua Hybrid Storage (Base64 / IndexedDB);
:Lưu hồ sơ vào Firestore collection 'experts';

:Hệ thống lấy ngày kết thúc hợp đồng (endDate);
:Tính số tháng còn lại:
monthsLeft = differenceInMonths(endDate, now);

if (monthsLeft <= 0) then (Đúng)
  :Gán nhãn: "HỢP ĐỒNG ĐÃ HẾT HẠN";
  :Hiển thị Badge ĐỎ (danger);
  :Đưa vào danh sách cảnh báo đỏ khẩn cấp trên Dashboard;
else (Sai)
  if (monthsLeft <= 2) then (Đúng)
    :Gán nhãn: "HỢP ĐỒNG SẮP HẾT HẠN";
    :Hiển thị Badge VÀNG (warning);
    :Đưa vào cảnh báo vàng (nhắc việc trước 60 ngày);
  else (Sai)
    :Gán nhãn: "HỢP ĐỒNG ĐANG HIỆU LỰC";
    :Hiển thị Badge XANH LÁ (success);
  endif
endif

:Cán bộ theo dõi tiến độ và làm thủ tục thanh lý / gia hạn;
stop
@enduml
\`\`\`
*Hình 2.6: Biểu đồ hoạt động tiếp nhận và kiểm soát hạn hợp đồng*

#### d. Biểu đồ trình tự (Sequence Diagram) – Thêm Chuyên gia & Lưu Hợp đồng
\`\`\`plantuml
@startuml
title BIỂU ĐỒ TRÌNH TỰ - THÊM CHUYÊN GIA & LƯU HỢP ĐỒNG SỐ HÓA
autonumber
skinparam defaultFontName Arial
skinparam defaultFontSize 12

actor "Cán bộ Giáo vụ" as Staff
boundary "ExpertsPage (Giao diện)" as UI
control "Storage Helper" as Storage
control "Expert Service" as Service
database "IndexedDB (Cục bộ)" as IDB
database "Cloud Firestore" as DB

Staff -> UI: Điền 24 trường thông tin, chọn file hợp đồng
Staff -> UI: Nhấn "Lưu chuyên gia"
activate UI

UI -> Service: addExpert(formData, contractFile, user)
activate Service

Service -> Storage: uploadFileSafely('contracts', contractFile)
activate Storage
Storage -> IDB: saveFileToIndexedDB(fileId, file)
alt File < 750KB
  Storage --> Service: { fileUrl: dataUrlBase64, fileName }
else File >= 750KB
  Storage --> Service: { fileUrl: 'idb://' + fileId, fileName }
end
deactivate Storage

Service -> DB: addDoc("experts", { ...data, fileUrl, createdAt: serverTimestamp() })
activate DB
DB --> Service: Document ID thành công
deactivate DB

Service --> UI: Hoàn thành thêm mới
deactivate Service

UI -> UI: Tính getContractMonthsLeft(endDate)
UI --> Staff: Hiển thị Badge hạn HĐ, thông báo Toast thành công
deactivate UI
@enduml
\`\`\`
*Hình 2.7: Biểu đồ trình tự lưu trữ hợp đồng và tính hạn*

---

### 2.2.3 Phân hệ Quản lý Hồ sơ Bảng điểm thi

#### a. Biểu đồ Use Case phân rã chức năng Quản lý Điểm thi
\`\`\`plantuml
@startuml
title PHÂN HỆ QUẢN LÝ HỒ SƠ ĐIỂM THI
left to right direction

skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 13
skinparam shadowing false
skinparam roundcorner 12
skinparam nodesep 35
skinparam ranksep 60

skinparam actor {
  BackgroundColor #E0F2FE
  BorderColor #0284C7
}
skinparam usecase {
  BackgroundColor #FFFFFF
  BorderColor #8B5CF6
  BorderThickness 1.5
}

actor "Cán bộ Giáo vụ" as Staff

rectangle "Quản lý Điểm thi" {
  usecase "Tìm kiếm bảng điểm theo tên môn học" as UC_Search
  usecase "Upload tệp điểm thi (Excel / PDF)" as UC_Up
  usecase "Gán nhãn chuyên ngành (Tag bộ môn)" as UC_Tag
  usecase "Tải tệp điểm gốc về máy tính an toàn" as UC_Down
  usecase "Xóa tệp bảng điểm học phần" as UC_Del
}

Staff --> UC_Search
Staff --> UC_Up
Staff --> UC_Down
Staff --> UC_Del

UC_Up ..> UC_Tag : <<include>>
@enduml
\`\`\`
*Hình 2.8: Biểu đồ phân rã Use Case Quản lý Hồ sơ Điểm thi*

#### b. Đặc tả Use Case Upload & Quản lý Tệp Điểm thi
*Bảng 2.5: Đặc tả Use Case Quản lý Điểm thi*
| Thuộc tính đặc tả | Nội dung chi tiết |
| :--- | :--- |
| **Mã Use Case** | **UC-SCORE-01** |
| **Tên Use Case** | Tải lên và Quản lý Tệp Bảng điểm thi kết thúc học phần |
| **Tác nhân (Actor)**| Cán bộ Giáo vụ, Quản trị viên |
| **Mô tả tóm tắt** | Cán bộ tiếp nhận bảng điểm từ giảng viên chấm thi, upload file số hóa (Excel, PDF, Word), gán nhãn chuyên ngành và lưu trữ tập trung phục vụ tra cứu phúc khảo |
| **Tiền điều kiện** | Cán bộ đã đăng nhập; có tệp bảng điểm thi đã kiểm tra chữ ký |
| **Hậu điều kiện** | Lưu trữ vào collection \`score_records\`; tệp lưu trữ an toàn; có thể tải về nguyên bản |
| **Luồng sự kiện chính**| 1. Cán bộ kéo thả hoặc chọn tệp bảng điểm từ máy tính.<br>2. Nhập Tên học phần, Mã lớp học phần, Học kỳ, Năm học.<br>3. Chọn Tag chuyên ngành (CNPM, HTTT, MMT...).<br>4. Nhấn nút "Tải lên tệp điểm".<br>5. Hệ thống gọi \`uploadFileSafely()\` mã hóa và lưu trữ an toàn.<br>6. Ghi bản ghi vào CSDL và tự động ghi Audit Log.<br>7. Hiển thị Toast thành công và cập nhật danh sách bảng điểm. |

#### c. Biểu đồ trình tự (Sequence Diagram) – Upload & Tải tệp Điểm thi
\`\`\`plantuml
@startuml
title BIỂU ĐỒ TRÌNH TỰ - UPLOAD & TẢI TỆP ĐIỂM THI AN TOÀN
autonumber
skinparam defaultFontName Arial
skinparam defaultFontSize 12

actor "Cán bộ Giáo vụ" as Staff
boundary "ScoresPage (Giao diện)" as UI
control "Score Service" as Service
control "Storage Helper" as Storage
database "Cloud Firestore" as DB

Staff -> UI: Kéo thả file Excel điểm thi, nhập Tên môn, chọn Tag
Staff -> UI: Nhấn "Tải lên"
activate UI

UI -> Service: uploadScoreFile(file, meta, user)
activate Service

Service -> Storage: uploadFileSafely('scores', file)
activate Storage
Storage --> Service: { fileUrl, fileName, fileSize }
deactivate Storage

Service -> DB: addDoc("score_records", { ...meta, fileUrl, createdAt: serverTimestamp() })
activate DB
DB --> Service: Document ID thành công
deactivate DB

Service --> UI: Upload thành công
deactivate Service
UI --> Staff: Toast thành công, hiển thị tệp trên bảng

== Thao tác Tải tệp về máy tính ==
Staff -> UI: Nhấn nút "Tải về" tại dòng bảng điểm
UI -> Storage: downloadFileSafely(fileUrl, fileName)
activate Storage
Storage --> UI: Mở luồng tải tệp nhị phân về máy
deactivate Storage
UI --> Staff: Trình duyệt lưu tệp Excel nguyên bản
deactivate UI
@enduml
\`\`\`
*Hình 2.9: Biểu đồ trình tự Upload và tải tệp bảng điểm thi*

---

### 2.2.4 Phân hệ Quản lý Văn bản Đến và Đi (Nghị định 30/2020/NĐ-CP)

#### a. Biểu đồ Use Case phân rã chức năng Quản lý Văn bản
\`\`\`plantuml
@startuml
title PHÂN HỆ QUẢN LÝ VĂN BẢN ĐẾN & ĐI
left to right direction

skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 13
skinparam shadowing false
skinparam roundcorner 12
skinparam nodesep 35
skinparam ranksep 60

skinparam actor {
  BackgroundColor #E0F2FE
  BorderColor #0284C7
}
skinparam usecase {
  BackgroundColor #FFFFFF
  BorderColor #F59E0B
  BorderThickness 1.5
}

actor "Cán bộ Giáo vụ" as Staff

rectangle "Quản lý Văn bản" {
  usecase "Xem danh sách Văn bản Đến (Tab 1)" as UC_In
  usecase "Xem danh sách Văn bản Đi (Tab 2)" as UC_Out
  usecase "Vào sổ công văn mới (kèm file đính kèm)" as UC_Add
  usecase "Cập nhật trạng thái xử lý trực tiếp" as UC_Status
  usecase "Cảnh báo văn bản quá hạn / chờ phúc đáp" as UC_Warn
}

Staff --> UC_In
Staff --> UC_Out
Staff --> UC_Add
Staff --> UC_Status

UC_In ..> UC_Warn : <<extend>>
UC_Out ..> UC_Warn : <<extend>>
@enduml
\`\`\`
*Hình 2.10: Biểu đồ phân rã Use Case Quản lý Văn bản Đến và Đi*

#### b. Đặc tả Use Case Quản lý Văn bản Hành chính
*Bảng 2.6: Đặc tả Use Case Quản lý Văn bản*
| Thuộc tính đặc tả | Nội dung chi tiết |
| :--- | :--- |
| **Mã Use Case** | **UC-DOC-01** |
| **Tên Use Case** | Tiếp nhận, Phân công và Theo dõi Trạng thái Văn bản |
| **Tác nhân (Actor)**| Cán bộ Giáo vụ, Quản trị viên |
| **Mô tả tóm tắt** | Quản lý quy trình vào sổ công văn đến và đi; cập nhật trạng thái xử lý 1 chạm; đếm số lượng văn bản tồn đọng trên huy hiệu Badge và cảnh báo quá hạn |
| **Tiền điều kiện** | Cán bộ đã đăng nhập |
| **Hậu điều kiện** | Lưu vào collection \`documents\` (loại 'incoming' hoặc 'outgoing'); cập nhật số đếm Badge thời gian thực |
| **Luồng sự kiện chính**| 1. Chọn Tab "Văn bản Đến" hoặc "Văn bản Đi".<br>2. Nhấn "+ Thêm văn bản", nhập Số hiệu, Ngày tháng, Nơi gửi/nhận, Trích yếu nội dung, Cán bộ thụ lý, Hạn xử lý, Tệp đính kèm.<br>3. Nhấn "Lưu văn bản".<br>4. Tại danh sách bảng, cán bộ có thể chuyển nhanh trạng thái (Chưa xử lý $\rightarrow$ Đang xử lý $\rightarrow$ Đã xử lý).<br>5. Hệ thống tự động giảm số đếm Badge khi văn bản hoàn tất. |

---

### 2.2.5 Phân hệ Quản lý Khối lượng Giảng dạy (Thông tư 20/2020/TT-BGDĐT)

#### a. Biểu đồ Use Case phân rã chức năng Khối lượng Giảng dạy
\`\`\`plantuml
@startuml
title PHÂN HỆ QUẢN LÝ KHỐI LƯỢNG GIẢNG DẠY
left to right direction

skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 13
skinparam shadowing false
skinparam roundcorner 12
skinparam nodesep 35
skinparam ranksep 60

skinparam actor {
  BackgroundColor #E0F2FE
  BorderColor #0284C7
}
skinparam usecase {
  BackgroundColor #FFFFFF
  BorderColor #0D9488
  BorderThickness 1.5
}

actor "Cán bộ Giáo vụ" as Staff

rectangle "Khối lượng Giảng dạy" {
  usecase "Kê khai giờ giảng định mức (Tab 1)" as UC_Norm
  usecase "Tự tính thừa/thiếu so với 270 tiết" as UC_Calc
  usecase "Quản lý hợp đồng giờ giảng (Tab 2)" as UC_Contract
  usecase "Đính kèm tệp minh chứng (TKB, chấm công)" as UC_Proof
  usecase "Xuất bảng quyết toán giờ giảng" as UC_Exp
}

Staff --> UC_Norm
Staff --> UC_Contract
Staff --> UC_Exp

UC_Norm ..> UC_Calc : <<include>>
UC_Norm ..> UC_Proof : <<extend>>
UC_Contract ..> UC_Proof : <<extend>>
@enduml
\`\`\`
*Hình 2.11: Biểu đồ phân rã Use Case Quản lý Khối lượng Giảng dạy*

#### b. Đặc tả Use Case Quản lý Khối lượng Giảng dạy
*Bảng 2.7: Đặc tả Use Case Khối lượng Giảng dạy*
| Thuộc tính đặc tả | Nội dung chi tiết |
| :--- | :--- |
| **Mã Use Case** | **UC-TEACH-01** |
| **Tên Use Case** | Kê khai và Đối soát Định mức Giờ giảng |
| **Tác nhân (Actor)**| Cán bộ Giáo vụ, Quản trị viên |
| **Mô tả tóm tắt** | Kê khai số tiết giảng dạy thực tế của cán bộ cơ hữu, tự động tính chênh lệch so với định mức chuẩn 270 tiết (Thông tư 20/2020/TT-BGDĐT) và hiển thị Badge phân loại |
| **Tiền điều kiện** | Cán bộ đã đăng nhập |
| **Hậu điều kiện** | Lưu vào collection \`teaching_logs\`; hiển thị Badge "+Vượt", "-Thiếu", hoặc "Đủ giờ" |
| **Luồng sự kiện chính**| 1. Chọn Tab "Khối lượng Định mức".<br>2. Nhấn "+ Kê khai định mức", nhập Tên giảng viên, Bộ môn, Định mức chuẩn (mặc định 270 tiết), Số giờ giảng thực tế.<br>3. Chọn nhiều tệp minh chứng (TKB, bảng chấm công).<br>4. Nhấn "Lưu kê khai".<br>5. Hệ thống tự động tính $\\text{Diff} = \\text{Thực tế} - 270$ và gắn nhãn màu.<br>6. Cán bộ có thể nhấn "Xuất quyết toán" để tải về file Excel/PDF. |

---

## 2.3 Biểu đồ Lớp (Class Diagram) toàn hệ thống

### 2.3.1 Xác định các lớp thực thể (Entity Classes)
Hệ thống bao gồm 9 lớp thực thể chính:
1. \`User\`: Quản lý thông tin định danh cán bộ giáo vụ, vai trò phân quyền và trạng thái kích hoạt tài khoản.
2. \`Asset\`: Quản lý hồ sơ trang thiết bị giảng đường, phòng học và chu kỳ khấu hao 36 tháng.
3. \`ScoreFile\`: Quản lý tệp bảng điểm kết thúc học phần, nhãn Tag môn học và tệp số hóa.
4. \`VisitingExpert\`: Quản lý chi tiết 24 trường dữ liệu nhân thân, học vị và hợp đồng mời giảng của chuyên gia ngoài trường.
5. \`IncomingDoc\`: Quản lý công văn đến, nơi gửi, hạn xử lý và cán bộ phụ trách.
6. \`OutgoingDoc\`: Quản lý công văn đi, nơi nhận, ngày phát hành và chu trình phúc đáp.
7. \`TeachingNorm\`: Quản lý kê khai giờ giảng định mức 270 tiết của giảng viên cơ hữu.
8. \`TeachingContract\`: Quản lý hợp đồng giảng dạy theo môn học và số giờ cam kết.
9. \`AuditLog\`: Ghi vết khách quan toàn bộ mọi hành động Thêm/Sửa/Xóa của người dùng trong hệ thống.

---

### 2.3.2 Biểu đồ lớp chi tiết toàn hệ thống

#### Mã nguồn PlantUML (Copy dán vào [planttext.com](https://www.planttext.com)):
\`\`\`plantuml
@startuml
title BIỂU ĐỒ LỚP CHI TIẾT (CLASS DIAGRAM) - HỆ THỐNG QUẢN LÝ GIÁO VỤ EPU 2026
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam classFontSize 12
skinparam roundcorner 6
skinparam classBackgroundColor #FFFFFF
skinparam classBorderColor #1A365D

class User {
  - String uid
  - String email
  - String displayName
  - String staffId
  - String department
  - String phone
  - String role
  - String status
  - Boolean emailVerified
  + login()
  + register()
  + verifyEmail()
  + updateUserRole()
  + toggleStatus()
}

class Asset {
  - String id
  - String code
  - String name
  - String type
  - Integer quantity
  - String room
  - Date startDate
  - Integer depreciationMonths
  - String condition
  - String notes
  + getDepreciationMonthsLeft()
  + getDepreciationBadge()
}

class ScoreFile {
  - String id
  - String fileName
  - String fileUrl
  - Integer fileSize
  - String fileType
  - String subjectName
  - String tag
  - Timestamp createdAt
  + uploadScore()
  + downloadFileSafely()
}

class VisitingExpert {
  - String id
  - String honorific
  - String gender
  - String name
  - Date birthDate
  - String hometown
  - String permanentAddress
  - String currentAddress
  - String academicTitle
  - String degree
  - Date appointedDate
  - String faculty
  - String workplace
  - String cccd
  - String phone
  - String bankAccount
  - String bankName
  - String contractNo
  - Date contractSignDate
  - Date startDate
  - Date endDate
  - String contractFileUrl
  + getContractMonthsLeft()
}

class IncomingDoc {
  - String id
  - String refNo
  - Date date
  - String sender
  - String summary
  - String assignee
  - Date deadline
  - String status
  - String fileUrl
  + updateStatus()
}

class OutgoingDoc {
  - String id
  - String refNo
  - Date date
  - String recipient
  - String summary
  - String assignee
  - Date deadline
  - String status
  - String fileUrl
  + updateStatus()
}

class TeachingNorm {
  - String id
  - String title
  - String lecturerName
  - String department
  - Integer norm
  - Integer actual
  - Array attachments
  + calculateDifference()
}

class TeachingContract {
  - String id
  - String title
  - String lecturerName
  - String department
  - String subject
  - Integer hours
  - Array attachments
}

class AuditLog {
  - String id
  - String action
  - String module
  - String detail
  - String userEmail
  - String userName
  - Timestamp timestamp
  + logAction()
}

' Mối quan hệ liên kết
User "1" --> "*" Asset : Quản lý & Tính khấu hao
User "1" --> "*" ScoreFile : Upload & Tra cứu
User "1" --> "*" VisitingExpert : Quản lý hồ sơ & HĐ
User "1" --> "*" IncomingDoc : Tiếp nhận & Xử lý
User "1" --> "*" OutgoingDoc : Phát hành & Đôn đốc
User "1" --> "*" TeachingNorm : Kê khai định mức (270 tiết)
User "1" --> "*" TeachingContract : Quản lý giờ hợp đồng
User "1" --> "*" AuditLog : Phát sinh hành động kiểm toán
@enduml
\`\`\`
*Hình 2.12: Biểu đồ Lớp phân tích chi tiết (Class Diagram) toàn hệ thống*

---

## 2.4 Nghiên cứu thuật toán xử lý nghiệp vụ giáo vụ

### 2.4.1 Cơ sở lý thuyết các thuật toán cốt lõi
1. **Lý thuyết khấu hao tài sản cố định đường thẳng:**
   Căn cứ Thông tư 45/2018/TT-BTC của Bộ Tài chính, trang thiết bị điện tử đào tạo tại giảng đường áp dụng phương pháp khấu hao đường thẳng với chu kỳ tiêu chuẩn là **36 tháng** (3 năm):
   $$\\text{MonthsLeft} = 36 - \\left[ (Y_{\\text{now}} - Y_{\\text{start}}) \\times 12 + (M_{\\text{now}} - M_{\\text{start}}) \\right]$$
2. **Lý thuyết kiểm soát thời hạn hợp đồng mời giảng:**
   $$\\text{ContractMonthsLeft} = (Y_{\\text{end}} - Y_{\\text{now}}) \\times 12 + (M_{\\text{end}} - M_{\\text{now}})$$
   Hệ thống tự động kích hoạt cảnh báo vàng khi $0 < \\text{ContractMonthsLeft} \\le 2$ tháng (nhắc việc trước 60 ngày).
3. **Lý thuyết kiến trúc lưu trữ lai (Hybrid Storage):**
   * *Vấn đề thực tế:* Dịch vụ Firebase Cloud Storage yêu cầu thẻ tín dụng quốc tế và tính phí theo dung lượng lưu trữ.
   * *Giải pháp KTL đề xuất:* Phân luồng tệp thông minh kết hợp giữa bộ nhớ đệm trình duyệt **IndexedDB** và cơ sở dữ liệu **Cloud Firestore** bằng mã hóa Base64 Data URI, giúp hệ thống hoạt động hoàn toàn miễn phí **0 VNĐ**.

---

### 2.4.2 Lưu đồ thuật toán Hybrid Storage 0ms

#### Mã nguồn PlantUML (Copy dán vào [planttext.com](https://www.planttext.com)):
\`\`\`plantuml
@startuml
title LƯU ĐỒ THUẬT TOÁN LƯU TRỮ LAI HYBRID STORAGE (TIẾT KIỆM CHI PHÍ 0 ĐỒNG)
skinparam defaultFontName Arial
skinparam defaultFontSize 12

start
:Người dùng chọn tệp (Word, Excel, PDF);
:Sinh mã định danh duy nhất:
fileId = prefix + Date.now() + random;

:Đọc file nhị phân thành chuỗi Base64 Data URL
thông qua FileReader API;

:Lưu tệp nhị phân gốc vào kho đệm IndexedDB cục bộ:
saveFileToIndexedDB(fileId, file);
note right: Tốc độ lưu 0ms - 5ms, mở tức thì ngoại tuyến

if (Kích thước tệp file.size < 750 KB?) then (Đúng)
  :Gán fileUrl = DataURL (chuỗi Base64);
  :Lưu fileUrl trực tiếp vào Document Firestore;
  note right
    Đồng bộ lên mây vĩnh viễn,
    máy khác vẫn tải được
  end note
else (Sai - File lớn >= 750 KB)
  :Gán fileUrl = 'idb://' + fileId;
  :Lưu fileUrl vào Firestore;
  note right
    Tránh vượt hạn mức 1MB của Firestore,
    tải mượt mà từ máy cục bộ
  end note
endif

:Hoàn tất quá trình lưu trữ tệp tin an toàn;
stop
@enduml
\`\`\`
*Hình 2.13: Biểu đồ hoạt động thuật toán Hybrid Storage*

---

## 2.5 Phương pháp và mô hình kiểm thử hệ thống

### 2.5.1 Phương pháp và công cụ áp dụng cho kiểm thử
- **Phương pháp kiểm thử:** Áp dụng phương pháp **Kiểm thử hộp đen (Black-box Testing)**, tập trung kiểm thử chức năng (Functional Testing), kiểm thử giao diện (UI Testing) và kiểm thử tính toàn vẹn dữ liệu.
- **Mô hình kiểm thử:** Áp dụng mô hình **V-Model**, kiểm thử đối soát song song giữa tài liệu đặc tả yêu cầu với sản phẩm phần mềm thực tế.
- **Công cụ áp dụng:**
  + *Chrome DevTools:* Giám sát Network, Console kiểm tra lỗi runtime, Application Tab kiểm tra cấu trúc dữ liệu IndexedDB \`GiaoVuStorageDB\`.
  + *Lighthouse Audit:* Đánh giá chỉ số hiệu năng (Performance) và tính khả dụng (Accessibility).

### 2.5.2 Xây dựng bộ kịch bản kiểm thử (Test Cases Suite)

*Bảng 2.8: Bảng kịch bản kiểm thử các chức năng chính của hệ thống*
| ID | Tên ca kiểm thử | Các bước thực hiện & Dữ liệu nhập | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC01** | Thêm mới tài sản hợp lệ | Nhập Mã: 'TS-01', Tên: 'Máy chiếu Epson', Ngày SD: '01/01/2026', Khấu hao: 36 tháng | Lưu CSDL, tính trạng thái "Còn 33 tháng", Badge xanh | Lưu thành công, hiển thị đúng Badge xanh | **ĐẠT** |
| **TC02** | Bỏ trống thông tin bắt buộc | Để trống Mã và Tên tài sản. Nhấn "Thêm tài sản" | Hệ thống chặn lại, hiển thị Toast đỏ cảnh báo | Toast đỏ: "Vui lòng điền đầy đủ thông tin bắt buộc!" | **ĐẠT** |
| **TC03** | Khấu hao tài sản hết hạn | Nhập Ngày SD: '01/01/2022', Khấu hao: 36 tháng | Gán "Đã hết khấu hao", dòng bảng màu đỏ, hiện trên Dashboard | Dòng đổi màu đỏ, Dashboard hiển thị mục cần chú ý | **ĐẠT** |
| **TC04** | Xuất danh sách tài sản ra PDF | Nhấn nút "Xuất PDF" trên thanh công cụ | Tải về file \`DanhSachTaiSan.pdf\`, tiếng Việt có dấu rõ nét | Tải về file PDF chuẩn khổ A4, không lỗi font | **ĐẠT** |
| **TC05** | Upload file điểm thi an toàn | Chọn file \`DiemToanA1.xlsx\` (150KB), môn: 'Toán A1', tag: 'Toán học' | Lưu Base64 lên Firestore, hiển thị trên bảng, tải về được | Upload thành công trong 0.7s, tải về đúng file gốc | **ĐẠT** |
| **TC06** | Thêm chuyên gia & Cảnh báo HĐ | Nhập HĐ có ngày kết thúc sau ngày hiện tại 1 tháng | Gắn nhãn "Còn 1 tháng", Badge vàng, cảnh báo Dashboard | Dòng bảng màu vàng, Dashboard báo HĐ sắp hết hạn | **ĐẠT** |
| **TC07** | Xem Popup chi tiết nhân thân | Nhấn nút "Xem chi tiết" tại một chuyên gia | Hiển thị Modal với đủ 24 trường dữ liệu, CCCD, STK | Hiển thị đầy đủ thông tin khoa học trong popup | **ĐẠT** |
| **TC08** | Cập nhật trạng thái văn bản | Chọn trực tiếp từ Dropdown trên bảng: chuyển sang "Đã xử lý" | Cập nhật tức thì CSDL, huy hiệu Badge giảm 1 | Cập nhật ngay, Badge giảm 1, ghi Audit Log | **ĐẠT** |
| **TC09** | Tính chênh lệch định mức KLGD | Định mức: 270 tiết, Thực tế giảng dạy: 315 tiết | Tự động tính chênh lệch: \`+45 vượt\`, Badge vàng | Hiển thị đúng Badge vàng "+45 vượt" | **ĐẠT** |
| **TC10** | Tự động ghi vết Audit Log | Cán bộ xóa một văn bản thử nghiệm | Bảng Audit Log xuất hiện dòng đầu tiên: hành động "delete" | Ghi nhận chính xác: "Xóa: [Số hiệu]", email cán bộ, giờ | **ĐẠT** |

\\newpage

`;

content = content.slice(0, s2) + newChapter2 + content.slice(s3);

fs.writeFileSync(mdPath, content, 'utf8');
console.log('Đã cập nhật thành công Chương 2 hoàn chỉnh vào BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md!');
