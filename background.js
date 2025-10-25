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
                text: `Translate the following text to ${lang}. Only return the translated text without explanation:\n\n"${text}"`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (data.error) return { error: `API Error: ${data.error.message}` };

    if (data.candidates && data.candidates[0]) {
      const translation = data.candidates[0].content.parts[0].text.trim();
      return { translation };
    }

    return { error: "Không nhận được kết quả dịch" };
  } catch (error) {
    return { error: `Lỗi: ${error.message}` };
  }
}
