# Hướng dẫn Cài đặt Tự động Đồng bộ Văn bản từ Gmail lên Website (0đ)

Khi hoàn tất 3 bước dưới đây (chỉ làm **1 lần duy nhất**), bạn chỉ cần gắn nhãn **`VanBanDen`** (hoặc **`VanBanDi`** cho thư đã gửi) trong Gmail $\to$ hệ thống sẽ tự động lấy **Tiêu đề, Người gửi/Nơi nhận, Ngày, Tệp đính kèm** đẩy lên trang web **`https://quanlygiaovuepu.netlify.app`** sau mỗi 5 phút — kể cả khi bạn đã tắt máy tính.

---

## Bước 1: Chuẩn bị Tài khoản & Quyền đồng bộ
* Quản trị viên (Admin) cần bật quyền **`Cấp Gmail`** cho tài khoản của bạn tại mục **Quản lý Người dùng** trên website.
* Nếu trước đây bạn chỉ dùng nút *"Đăng nhập bằng tài khoản Google"*, hãy vào mục **Hồ sơ** (hoặc nút **Đồng bộ Gmail** trong **Quản lý Văn bản**) để đặt mật khẩu đăng nhập trực tiếp trước khi sao chép mã script.

---

## Bước 2: Cài đặt Google Apps Script (Mất 2 phút)
1. Trên website (tại mục **Quản lý Văn bản** $\to$ bấm **Đồng bộ Gmail**, hoặc trong **Hồ sơ**), điền mật khẩu để hệ thống điền sẵn thông tin và bấm **Sao chép toàn bộ mã** (hoặc mở tệp [`scripts/gmail_sync_apps_script.gs`](scripts/gmail_sync_apps_script.gs)).
2. Truy cập **https://script.google.com** bằng đúng tài khoản Gmail của bạn $\to$ bấm **+ Dự án mới**.
3. Xóa mã mặc định, dán toàn bộ đoạn mã đã sao chép vào và bấm **Lưu (Ctrl + S)**.
4. Ở thanh công cụ phía trên, chọn hàm **`caiDatTuDong`** $\to$ bấm **Chạy (Run)** và bấm **Cho phép (Allow)** quyền truy cập Gmail & Google Drive.

---

## Bước 3: Gắn nhãn trong Gmail để đồng bộ
* **Văn bản Đến:** Gắn nhãn **`VanBanDen`** (hoặc tạo Bộ lọc Gmail Filter tự động gắn nhãn **`VanBanDen`**) $\to$ hệ thống đẩy lên tab **Văn bản Đến** (trạng thái *Chưa xử lý*).
* **Văn bản Đi:** Ở mục **Đã gửi (Sent)** trong Gmail, gắn nhãn **`VanBanDi`** cho email đã gửi $\to$ hệ thống đẩy lên tab **Văn bản Đi** (trạng thái *Đã gửi*).
* Sau khi đồng bộ xong, nhãn tự động chuyển sang **`DaDongBo`** để tránh lặp lại dữ liệu, đồng thời tệp đính kèm được lưu vào thư mục **`QuanLyGiaoVu_VanBanDen`** trên Google Drive của bạn.
