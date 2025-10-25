# Google AI Translator - Trình dịch nhanh bằng AI

Một tiện ích mở rộng cho Chrome giúp bạn dịch văn bản ngay lập tức tại bất kỳ ô nhập liệu nào bằng Google AI.

## ✨ Tính năng chính (Dựa trên mã nguồn)

- 🚀 **Kích hoạt dịch nhanh**: Gõ `]\văn bản cần dịch]\` trong một ô nhập liệu để bắt đầu dịch.
- 🤖 **Nền tảng Google AI**: Sử dụng mô hình `gemini-flash-latest` để có bản dịch chất lượng.
- 📋 **Tự động sao chép**: Ngay sau khi dịch xong, kết quả sẽ được tự động sao chép vào clipboard của bạn.
- ⚡ **Thay thế**: Nhấn `Ctrl + V` để thay thế nhanh văn bản đã dịch vào chuỗi (`]\...]\`) cũ.
- ⚙️ **Tùy chỉnh linh hoạt**:
  - Nhập **API Key** của riêng bạn từ Google AI Studio.
  - Chọn **ngôn ngữ đích** từ danh sách hơn 40 ngôn ngữ.
- 🎨 **Giao diện trực quan**: Một popup nhỏ sẽ hiện lên hiển thị quá trình và kết quả dịch.

## 📦 Cài đặt

### 1. Tải mã nguồn
Sao chép hoặc tải về dự án này.
```bash
git clone <URL_REPO_CUA_BAN>
```

### 2. Cài đặt vào Chrome
1.  Mở Chrome và truy cập `chrome://extensions/`.
2.  Bật **Chế độ dành cho nhà phát triển** (Developer mode).
3.  Nhấn vào **Tải tiện ích đã giải nén** (Load unpacked).
4.  Chọn thư mục chứa mã nguồn bạn vừa tải về.

### 3. Cấu hình
1.  Nhấn vào biểu tượng của tiện ích trên thanh công cụ Chrome.
2.  Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey) để lấy API Key miễn phí.
3.  Dán API Key vào ô "Nhập API Key".
4.  Chọn ngôn ngữ bạn muốn dịch sang.
5.  Nhấn "Lưu cài đặt".

## 🎯 Cách sử dụng

1.  Đi đến một trang web bất kỳ có ô nhập liệu (ví dụ: Facebook, Twitter, YouTube).
2.  Gõ văn bản bạn muốn dịch theo cú pháp: `]\xin chào]\`
3.  Một popup sẽ hiện ra với bản dịch. Kết quả đã được tự động sao chép.
4.  Bạn có thể dán (Ctrl+V) bản dịch vào đâu tùy ý.


**Ví dụ:**
- Gõ: `]\hello world]\`
- Kết quả (với ngôn ngữ đích là Tiếng Việt): `chào thế giới`

## 🔧 Cấu trúc dự án

```
/
├── manifest.json         # Cấu hình chính của extension
├── content.js            # Xử lý logic chính trên trang web (kích hoạt dịch, popup)
├── content.css           # CSS cho popup dịch
├── background.js         # Gọi API của Google AI để dịch
├── popup.html            # Giao diện trang cài đặt (nhập API key, chọn ngôn ngữ)
├── popup.js              # Logic cho trang cài đặt
├── icon*.png             # Các biểu tượng của extension
└── README.md
```
