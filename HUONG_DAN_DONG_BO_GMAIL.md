# Hướng dẫn Cài đặt Tự động Đồng bộ Văn bản Đến từ Gmail lên Website (0đ)

Khi hoàn tất 3 bước dưới đây (chỉ làm **1 lần duy nhất**), hễ có người gửi email công văn/tài liệu vào Gmail của bạn $\to$ hệ thống sẽ tự động lấy **Tiêu đề, Người gửi, Ngày gửi, Tệp đính kèm** đẩy thẳng lên mục **Quản lý Văn bản (Văn bản Đến)** trên trang web **`https://quanlygiaovuepu.netlify.app`** sau mỗi 5 phút — kể cả khi bạn đã tắt máy tính.

---

## Bước 1: Chuẩn bị 1 tài khoản Email & Mật khẩu trên Web
* Để script có quyền ghi dữ liệu bảo mật vào hệ thống, hãy sử dụng một tài khoản đã đăng ký **Email + Mật khẩu** (và đã bấm link xác thực email) trên trang web Quản lý Giáo vụ.
* *(Lưu ý: Nếu trước giờ bạn chỉ bấm nút "Đăng nhập bằng Google" mà chưa từng đặt mật khẩu riêng trên web, hãy bấm **"Quên mật khẩu?"** ở màn hình đăng nhập web, hoặc đăng ký 1 tài khoản Email/Mật khẩu phụ trên web để dùng cho bot đồng bộ này).*

---

## Bước 2: Cài đặt Google Apps Script (Mất 2 phút)
1. Mở trình duyệt và truy cập: **https://script.google.com** (đăng nhập đúng Gmail sẽ nhận văn bản).
2. Bấm nút **"+ Dự án mới" (New project)**.
3. Xóa hết đoạn code mặc định `function myFunction() {}` đang có trong khung soạn thảo.
4. Mở tệp [`scripts/gmail_sync_apps_script.gs`](scripts/gmail_sync_apps_script.gs) trong thư mục dự án, copy **toàn bộ nội dung** và dán vào khung soạn thảo của Apps Script.
5. Ở ngay đầu đoạn mã (`CONFIG`), sửa 2 dòng sau cho đúng với tài khoản web ở Bước 1:
   ```js
   FIREBASE_EMAIL: 'email_cua_ban@gmail.com',
   FIREBASE_PASSWORD: 'mat_khau_cua_ban',
   ```
6. Bấm nút **Lưu (Ctrl + S)** (đặt tên dự án là `DongBoVanBanGmail`).
7. Trên thanh công cụ phía trên, ở ô danh sách hàm (đang hiện `syncGmailToGiaoVu`), bấm mũi tên đổi sang chọn **`caiDatTuDong`** rồi bấm nút **Chạy (Run)**.
8. Ở lần chạy đầu tiên, Google sẽ hỏi cấp quyền truy cập Gmail & Google Drive của chính bạn:
   * Bấm **Xem xét quyền (Review permissions)** $\to$ chọn tài khoản Gmail của bạn.
   * Nếu hiện màn hình *"Google chưa xác minh ứng dụng này"*, bấm chữ **Nâng cao (Advanced)** ở góc dưới bên trái $\to$ bấm **Đi tới DongBoVanBanGmail (không an toàn)** $\to$ bấm **Cho phép (Allow)**.
9. Chờ vài giây, nhìn khung **Nhật ký thực thi (Execution log)** thấy hiện:
   * `✅ Đăng nhập Firebase thành công!`
   * `✅ Đã bật lịch chạy tự động mỗi 5 phút!`
   là đã cài đặt thành công hoàn toàn!

---

## Bước 3: Cài Bộ lọc trong Gmail để tự chọn đúng Email công văn (Tránh thư rác)
Để các email quảng cáo, mạng xã hội không bị đẩy nhầm thành Văn bản Đến của trường, script chỉ quét những email mang nhãn **`VanBanDen`** (nhãn này đã được tự tạo sau Bước 2).

Bạn có **2 cách dùng linh hoạt**:
* **Cách thủ công siêu nhanh:** Khi đọc Gmail thấy thư nào là văn bản cần đưa lên web, bạn chỉ cần gắn cho thư đó nhãn **`VanBanDen`** $\to$ tối đa 5 phút sau thư đó sẽ tự động chuyển sang nhãn **`DaDongBo`** và xuất hiện ngay trên trang web!
* **Cách tự động 100% (Bộ lọc Gmail Filter):**
  1. Trong Gmail, bấm biểu tượng **Tùy chọn tìm kiếm** (hình thanh trượt bên phải ô Tìm kiếm thư).
  2. Điền điều kiện lọc email công văn (ví dụ: ô *Có tệp đính kèm* tick chọn, hoặc ô *Có các từ*: `công văn OR quyết định OR thông báo OR kế hoạch`, hoặc lọc theo email phòng ban gửi tới).
  3. Bấm **Tạo bộ lọc (Create filter)**.
  4. Tick chọn **"Áp dụng nhãn" (Apply the label)** $\to$ chọn nhãn **`VanBanDen`** $\to$ bấm **Tạo bộ lọc**.

Từ nay về sau, mọi email khớp điều kiện sẽ tự động đi vào nhãn `VanBanDen` $\to$ Google Apps Script tự lưu file đính kèm vào thư mục **`QuanLyGiaoVu_VanBanDen`** trên Google Drive (mở quyền xem công khai qua liên kết) $\to$ đẩy bản ghi lên mục **Văn bản Đến** (trạng thái *Chưa xử lý*) và rung chuông thông báo trên website!
