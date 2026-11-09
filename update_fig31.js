import fs from 'fs';
import path from 'path';

const mdPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md');
let content = fs.readFileSync(mdPath, 'utf8');

const search = '*Hình 3.1: Sơ đồ kiến trúc giải pháp công nghệ Hybrid Storage và Cloud BaaS*';
const idx = content.indexOf(search);
if (idx === -1) {
  console.error('Không tìm thấy chú thích Hình 3.1!');
  process.exit(1);
}

const lastBlockEnd = content.lastIndexOf('```', idx);
const lastBlockStart = content.lastIndexOf('```', lastBlockEnd - 1);

const plantumlCode = `#### Mã nguồn vẽ Sơ đồ kiến trúc trên PlantText (Copy & Paste vào planttext.com):
\`\`\`plantuml
@startuml
title SƠ ĐỒ KIẾN TRÚC GIẢI PHÁP CÔNG NGHỆ HYBRID STORAGE VÀ CLOUD BAAS
top to bottom direction

skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 12
skinparam shadowing false
skinparam roundcorner 10
skinparam nodesep 25
skinparam ranksep 35

skinparam package {
  BackgroundColor #F8FAFC
  BorderColor #2563EB
  FontColor #1E3A8A
  FontSize 13
  FontStyle bold
}

skinparam component {
  BackgroundColor #FFFFFF
  BorderColor #0284C7
  FontColor #0F172A
  BorderThickness 1.5
}

skinparam database {
  BackgroundColor #FEF3C7
  BorderColor #D97706
  FontColor #78350F
}

skinparam cloud {
  BackgroundColor #EFF6FF
  BorderColor #2563EB
  FontColor #1E40AF
}

package "TRÌNH DUYỆT NGƯỜI DÙNG (CLIENT LAYER)" as Client {
  
  package "Giao diện Người dùng (React 19 + Vite 8 SPA)" as UI {
    [1. Dashboard & Cảnh báo] as M1
    [2. Quản lý Tài sản] as M2
    [3. Hồ sơ Điểm thi] as M3
    [4. Chuyên gia Thỉnh giảng] as M4
    [5. Văn bản Đến / Đi] as M5
    [6. Khối lượng Giảng dạy] as M6
    [7. Nhật ký Audit Log] as M7
  }

  package "Tầng Xử lý & Lưu trữ Cục bộ" as Logic {
    [AuthContext\\n(Quản lý phiên & Xác thực Email)] as Auth
    [storageHelper (Hybrid Storage)\\n(Phân luồng tệp thông minh)] as StorageEngine
    database "IndexedDB Cục bộ\\n(Kho đệm nhị phân 0ms)" as IDB
  }
}

cloud "NỀN TẢNG ĐÁM MÂY GOOGLE FIREBASE (BaaS)" as Cloud {
  [Firebase Authentication\\n(OAuth2 Google, Email/Password, Verify Link)] as FireAuth
  database "Cloud Firestore NoSQL CSDL\\n(8 Collections + Data URI Base64)" as Firestore
}

' Kết nối các luồng nghiệp vụ
UI --> Auth : Kiểm tra đăng nhập & kích hoạt
UI --> StorageEngine : Lưu trữ / Đọc tệp số hóa

StorageEngine --> IDB : Lưu tệp gốc (file lớn >= 750KB & cache)
Auth --> FireAuth : HTTPS REST API (Token JWT)
UI --> Firestore : Đồng bộ dữ liệu học vụ thời gian thực
StorageEngine --> Firestore : Lưu Data URI Base64 (file < 750KB)

@enduml
\`\`\``;

content = content.slice(0, lastBlockStart) + plantumlCode + '\n' + content.slice(idx);
fs.writeFileSync(mdPath, content, 'utf8');
console.log('Đã thay thế Hình 3.1 thành mã PlantUML thành công!');
