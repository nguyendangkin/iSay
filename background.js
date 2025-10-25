chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    translateText(request.text).then(sendResponse);
    return true;
  }
});

async function translateText(text) {
  try {
    const { apiKey, targetLang } = await chrome.storage.sync.get([
      "apiKey",
      "targetLang",
    ]);

    if (!apiKey) {
      return {
        error:
          "Chưa thiết lập API Key. Click vào icon extension để nhập API Key!",
      };
    }

    const lang = targetLang || "en";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Translate the following text to ${lang}. IMPORTANT: Preserve the exact capitalization pattern from the source text. If the source starts with a lowercase letter, the translation must also start with a lowercase letter. Only return the translated text without explanation:\n\n"${text}"`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (data.error) return { error: `API Error: ${data.error.message}` };

    if (data.candidates && data.candidates[0]) {
      let translation = data.candidates[0].content.parts[0].text.trim();

      // Đảm bảo giữ đúng định dạng chữ hoa/thường của ký tự đầu
      if (text.length > 0 && translation.length > 0) {
        const firstCharOriginal = text[0];
        const firstCharTranslation = translation[0];

        // Nếu text gốc bắt đầu bằng chữ thường mà bản dịch bắt đầu bằng chữ hoa
        if (
          firstCharOriginal === firstCharOriginal.toLowerCase() &&
          firstCharTranslation === firstCharTranslation.toUpperCase() &&
          firstCharTranslation.toLowerCase() !== firstCharTranslation
        ) {
          translation = translation[0].toLowerCase() + translation.slice(1);
        }
        // Nếu text gốc bắt đầu bằng chữ hoa mà bản dịch bắt đầu bằng chữ thường
        else if (
          firstCharOriginal === firstCharOriginal.toUpperCase() &&
          firstCharTranslation === firstCharTranslation.toLowerCase() &&
          firstCharOriginal.toUpperCase() !== firstCharOriginal
        ) {
          translation = translation[0].toUpperCase() + translation.slice(1);
        }
      }

      return { translation };
    }

    return { error: "Không nhận được kết quả dịch" };
  } catch (error) {
    return { error: `Lỗi: ${error.message}` };
  }
}
