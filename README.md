# iSay - Quick Translation Extension

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**iSay** là Chrome Extension giúp bạn dịch văn bản nhanh chóng ngay trong bất kỳ ô nhập nào trên web, sử dụng Google AI (Gemini) với độ chính xác cao.

## ✨ Tính năng

- 🚀 **Dịch siêu nhanh** - Chỉ cần gõ `<văn bản>` và nhấn Enter
- 🌍 **Hỗ trợ 75+ ngôn ngữ** - Từ Tiếng Việt đến Latin
- ⚡ **Phím tắt tiện lợi** - Ctrl + Alt + Enter để chấp nhận
- 🎨 **Giao diện tối giản** - Popup nhỏ gọn, đẹp mắt
- 🤖 **Powered by Google AI** - Sử dụng Gemini Flash cho độ chính xác cao
- 💾 **Thay thế tự động** - Click ✓ để thay văn bản gốc bằng bản dịch
- 🔄 **Loading indicator** - Biết ngay khi đang dịch

## 📦 Cài đặt

### 1. Tải về
```bash
git clone https://github.com/your-username/iSay.git
cd iSay
```

### 2. Cài extension vào Chrome
1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật **Developer mode** (góc trên bên phải)
3. Click **Load unpacked**
4. Chọn thư mục `iSay` vừa tải về

### 3. Cấu hình API Key
1. Click vào icon extension iSay trên thanh công cụ
2. Lấy **Google AI API Key** miễn phí tại: https://aistudio.google.com/app/apikey
3. Dán API Key vào ô cài đặt
4. Chọn ngôn ngữ đích (mặc định: English)
5. Click **💾 Lưu cài đặt**

## 🎯 Cách sử dụng

### Cú pháp cơ bản
Gõ văn bản cần dịch trong dấu ngoặc nhọn:
```
<Hello, how are you?>
```

### Khi popup xuất hiện:
- **✓** - Thay thế văn bản gốc bằng bản dịch
- **✕** - Đóng popup
- **Ctrl + Alt + Enter** - Chấp nhận nhanh (không cần click chuột)

### Ví dụ thực tế:

**Trên YouTube:**
```
<Thank you very much! This is amazing>
→ Cảm ơn bạn rất nhiều! Điều này thật tuyệt vời
```

**Trên Facebook:**
```
<xin chào, bạn khỏe không?>
→ Hello, how are you?
```

**Trên Twitter/X:**
```
<Je t'aime>
→ I love you
```

## 🌍 Ngôn ngữ được hỗ trợ

### Châu Á - Thái Bình Dương
🇻🇳 Tiếng Việt | 🇨🇳 Chinese | 🇯🇵 Japanese | 🇰🇷 Korean | 🇹🇭 Thai | 🇮🇩 Indonesian | 🇲🇾 Malay | 🇵🇭 Tagalog | 🇲🇲 Burmese | 🇰🇭 Khmer | 🇱🇦 Lao

### Châu Âu
🇬🇧 English | 🇪🇸 Spanish | 🇫🇷 French | 🇩🇪 German | 🇮🇹 Italian | 🇵🇹 Portuguese | 🇷🇺 Russian | 🇳🇱 Dutch | 🇵🇱 Polish | 🇺🇦 Ukrainian | 🇨🇿 Czech | 🇷🇴 Romanian | 🇸🇪 Swedish | 🇳🇴 Norwegian | 🇩🇰 Danish | 🇫🇮 Finnish | 🇬🇷 Greek

### Trung Đông & Nam Á
🇸🇦 Arabic | 🇮🇷 Persian | 🇹🇷 Turkish | 🇮🇱 Hebrew | 🇮🇳 Hindi | 🇧🇩 Bengali | 🇵🇰 Urdu | Tamil | Telugu | Malayalam

**+ 40 ngôn ngữ khác** - Xem đầy đủ trong extension settings

## 🔧 Cấu trúc thư mục

```
iSay/
├── manifest.json         # Cấu hình extension
├── content.js           # Logic chính
├── popup.css            # Styles cho popup
├── options.html         # Trang cài đặt
├── options.js           # Logic cài đặt
├── background.js        # Service worker
├── icon16.png          # Icon 16x16
├── icon48.png          # Icon 48x48
├── icon128.png         # Icon 128x128
└── README.md           # File này
```

## ⚙️ Cài đặt nâng cao

### Thay đổi ngôn ngữ đích
1. Click icon extension
2. Chọn ngôn ngữ từ dropdown (75+ options)
3. Lưu lại

### Thay đổi phím tắt
Hiện tại sử dụng `Ctrl + Alt + Enter`. Nếu muốn thay đổi, edit trong `content.js`:
```javascript
if (e.ctrlKey && e.altKey && e.key === 'Enter') {
  // Đổi thành phím khác
}
```

## 🐛 Xử lý lỗi thường gặp

### Popup không hiện
- ✅ Kiểm tra đã nhập đúng cú pháp `<text>`
- ✅ Reload extension tại `chrome://extensions/`
- ✅ Refresh lại trang web

### Lỗi API Key
```
❌ Vui lòng cấu hình API Key trong extension settings
```
→ Vào settings và nhập API Key từ Google AI Studio

### Lỗi model không tìm thấy
```
❌ Lỗi: models/... is not found
```
→ Đảm bảo sử dụng model `gemini-flash-latest` trong code

## 🚀 Phát triển

### Yêu cầu
- Chrome/Edge/Brave Browser (Manifest V3)
- Google AI API Key (miễn phí)

### Chạy development mode
1. Load unpacked extension
2. Mở Console (F12) để xem logs
3. Thay đổi code
4. Reload extension để test

## 📝 Changelog

### Version 1.0 (2025-10-24)
- ✨ Release đầu tiên
- ✅ Hỗ trợ 75+ ngôn ngữ
- ✅ Google AI (Gemini Flash) integration
- ✅ Popup tối giản, đẹp mắt
- ✅ Phím tắt Ctrl + Alt + Enter
- ✅ Loading indicator
- ✅ Tự động thay thế text

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón!

1. Fork repo
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🙏 Cảm ơn

- Google AI (Gemini) - AI translation engine
- Chrome Extension API
- Tất cả người dùng và contributors

## 📧 Liên hệ

Có vấn đề hoặc góp ý? Mở [Issue](https://github.com/your-username/iSay/issues) trên GitHub!

---

⭐ Nếu thấy hữu ích, hãy star repo này nhé! ⭐