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

const cleanPlantUML = `#### Mã nguồn vẽ Sơ đồ kiến trúc trên PlantText (Copy & Paste vào planttext.com):
\`\`\`plantuml
@startuml
title SƠ ĐỒ KIẾN TRÚC HỆ THỐNG HYBRID STORAGE & FIREBASE CLOUD
left to right direction

skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 12
skinparam shadowing false
skinparam roundcorner 12
skinparam nodesep 45
skinparam ranksep 60

skinparam package {
  BackgroundColor #F8FAFC
  BorderColor #94A3B8
  FontColor #1E293B
  FontStyle bold
  FontSize 13
}

skinparam rectangle {
  BorderThickness 1.5
}

package "1. TRÌNH DUYỆT NGƯỜI DÙNG (CLIENT)" as Client {
  rectangle "GIAO DIỆN HỌC VỤ (SPA)\nReact 19 + Vite 8\n(7 Phân hệ nghiệp vụ EPU)" as UI #E0F2FE;line:0284C7;text:0369A1
  rectangle "QUẢN LÝ PHIÊN & TRẠNG THÁI\nAuthContext & State\n(Bắt buộc Email Verified)" as State #E0F2FE;line:0284C7;text:0369A1
}

package "2. LƯU TRỮ LAI (HYBRID STORAGE)" as Hybrid {
  rectangle "BỘ PHÂN LUỒNG TỆP\nstorageHelper.js\n(Tiết kiệm 0 VNĐ đám mây)" as Router #ECFDF5;line:10B981;text:047857
  database "KHO ĐỆM CỤC BỘ\nIndexedDB (Trình duyệt)\n(Tệp >= 750KB - Tốc độ 0ms)" as IDB #ECFDF5;line:10B981;text:047857
}

package "3. MÁY CHỦ ĐÁM MÂY (GOOGLE BaaS)" as Cloud {
  rectangle "XÁC THỰC DANH TÍNH\nFirebase Authentication\n(OAuth2 Google & Email/Password)" as Auth #FEF3C7;line:F59E0B;text:B45309
  database "CƠ SỞ DỮ LIỆU ĐÁM MÂY\nCloud Firestore NoSQL\n(Dữ liệu học vụ & Tệp < 750KB)" as DB #FEF3C7;line:F59E0B;text:B45309
}

' Kết nối luồng thẳng hàng, không chéo dây
UI --> State : 1. Quản lý phiên
State --> Auth : 2. Xác thực HTTPS

UI --> Router : 3. Gửi tệp số hóa
Router --> IDB : 4. Lưu tệp gốc (>= 750KB)
Router --> DB : 5. Lưu Base64 (< 750KB)

UI --> DB : 6. Đồng bộ dữ liệu (0-100ms)

@enduml
\`\`\``;

content = content.slice(0, lastBlockStart) + cleanPlantUML + '\n' + content.slice(idx);
fs.writeFileSync(mdPath, content, 'utf8');
console.log('Đã cập nhật Sơ đồ kiến trúc tối giản mới thành công!');
