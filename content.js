// Biến lưu trữ element đang focus và vị trí cursor
let activeElement = null;
let currentPopup = null;

// Lắng nghe sự kiện input
document.addEventListener("input", async (e) => {
  const target = e.target;

  // Chỉ xử lý input và textarea
  if (
    target.tagName !== "INPUT" &&
    target.tagName !== "TEXTAREA" &&
    !target.isContentEditable
  ) {
    return;
  }

  activeElement = target;
  const text = target.value || target.innerText || target.textContent;

  // Kiểm tra pattern <text>
  const pattern = /<([^>]+)>/;
  const match = text.match(pattern);

  if (match) {
    const textToTranslate = match[1];
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;

    // Lấy API key từ storage
    const result = await chrome.storage.sync.get(["apiKey", "targetLang"]);
    const apiKey = result.apiKey;
    const targetLang = result.targetLang || "en";

    if (!apiKey) {
      showPopup(
        "❌ Vui lòng cấu hình API Key trong extension settings",
        null,
        matchStart,
        matchEnd,
      );
      return;
    }

    // Hiện loading popup
    showLoadingPopup();

    // Gọi API dịch
    translateText(textToTranslate, apiKey, targetLang, matchStart, matchEnd);
  }
});

async function translateText(text, apiKey, targetLang, matchStart, matchEnd) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const langMap = {
      vi: "Tiếng Việt",
      en: "English",
      zh: "Chinese (Simplified)",
      "zh-TW": "Chinese (Traditional)",
      ja: "Japanese",
      ko: "Korean",
      th: "Thai",
      id: "Indonesian",
      ms: "Malay",
      tl: "Tagalog",
      my: "Burmese",
      km: "Khmer",
      lo: "Lao",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      ar: "Arabic",
      hi: "Hindi",
      bn: "Bengali",
      pa: "Punjabi",
      ur: "Urdu",
      fa: "Persian",
      tr: "Turkish",
      nl: "Dutch",
      pl: "Polish",
      uk: "Ukrainian",
      cs: "Czech",
      ro: "Romanian",
      sv: "Swedish",
      no: "Norwegian",
      da: "Danish",
      fi: "Finnish",
      el: "Greek",
      he: "Hebrew",
      hu: "Hungarian",
      sk: "Slovak",
      bg: "Bulgarian",
      hr: "Croatian",
      sr: "Serbian",
      lt: "Lithuanian",
      lv: "Latvian",
      et: "Estonian",
      sl: "Slovenian",
      sw: "Swahili",
      af: "Afrikaans",
      am: "Amharic",
      az: "Azerbaijani",
      eu: "Basque",
      be: "Belarusian",
      ca: "Catalan",
      gl: "Galician",
      ka: "Georgian",
      gu: "Gujarati",
      is: "Icelandic",
      kn: "Kannada",
      kk: "Kazakh",
      ky: "Kyrgyz",
      mk: "Macedonian",
      ml: "Malayalam",
      mr: "Marathi",
      mn: "Mongolian",
      ne: "Nepali",
      si: "Sinhala",
      ta: "Tamil",
      te: "Telugu",
      uz: "Uzbek",
      cy: "Welsh",
      ga: "Irish",
      mt: "Maltese",
      sq: "Albanian",
      hy: "Armenian",
      la: "Latin",
      lb: "Luxembourgish",
    };

    const targetLanguage = langMap[targetLang] || "English";

    const prompt = `Translate the following text to ${targetLanguage}. Only return the translation, nothing else:\n\n${text}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      showPopup("❌ Lỗi: " + data.error.message, null, matchStart, matchEnd);
      return;
    }

    const translatedText = data.candidates[0].content.parts[0].text.trim();
    showPopup(translatedText, text, matchStart, matchEnd);
  } catch (error) {
    showPopup("❌ Lỗi kết nối: " + error.message, null, matchStart, matchEnd);
  }
}

function showLoadingPopup() {
  // Xóa popup cũ nếu có
  if (currentPopup) {
    currentPopup.remove();
  }

  // Tạo loading popup
  const popup = document.createElement("div");
  popup.className = "translate-popup translate-loading";
  popup.innerHTML = `
    <div class="translate-popup-content">
      <div class="translate-spinner"></div>
      <div class="translate-text">Đang dịch...</div>
    </div>
  `;

  // Định vị popup gần element đang focus
  if (activeElement) {
    const rect = activeElement.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
  } else {
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.position = "fixed";
  }

  document.body.appendChild(popup);
  currentPopup = popup;
}

function showPopup(translatedText, originalText, matchStart, matchEnd) {
  // Xóa popup cũ nếu có
  if (currentPopup) {
    currentPopup.remove();
  }

  // Tạo popup
  const popup = document.createElement("div");
  popup.className = "translate-popup";
  popup.innerHTML = `
    <div class="translate-popup-content">
      <div class="translate-text">${translatedText}</div>
      <div class="translate-actions">
        ${originalText ? '<button class="translate-btn translate-accept" title="Thay thế">✓</button>' : ""}
        <button class="translate-btn translate-close" title="Đóng">✕</button>
      </div>
    </div>
  `;

  // Định vị popup gần element đang focus
  if (activeElement) {
    const rect = activeElement.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
  } else {
    // Fallback: hiện ở giữa màn hình
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.position = "fixed";
  }

  document.body.appendChild(popup);
  currentPopup = popup;

  // Xử lý nút Accept (✓)
  const acceptBtn = popup.querySelector(".translate-accept");
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      replaceText(translatedText, matchStart, matchEnd);
      popup.remove();
      currentPopup = null;
    });
  }

  // Xử lý nút Close (✕)
  const closeBtn = popup.querySelector(".translate-close");
  closeBtn.addEventListener("click", () => {
    popup.remove();
    currentPopup = null;
  });

  // Xử lý phím tắt Ctrl + Alt + Enter
  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.altKey && e.key === "Enter") {
      e.preventDefault();
      if (acceptBtn) {
        replaceText(translatedText, matchStart, matchEnd);
      }
      popup.remove();
      currentPopup = null;
      document.removeEventListener("keydown", handleKeyPress);
    }
  };

  document.addEventListener("keydown", handleKeyPress);

  // Cleanup khi popup bị xóa
  const cleanup = () => {
    document.removeEventListener("keydown", handleKeyPress);
  };

  // Tự động đóng sau 10 giây
  setTimeout(() => {
    if (currentPopup === popup) {
      popup.remove();
      currentPopup = null;
      cleanup();
    }
  }, 10000);
}

function replaceText(translatedText, matchStart, matchEnd) {
  if (!activeElement) return;

  if (activeElement.isContentEditable) {
    const text = activeElement.innerText;
    const newText =
      text.substring(0, matchStart) + translatedText + text.substring(matchEnd);
    activeElement.innerText = newText;

    // Đặt cursor cho contentEditable
    const range = document.createRange();
    const sel = window.getSelection();
    const textNode = activeElement.firstChild;

    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      const cursorPos = Math.min(
        matchStart + translatedText.length,
        textNode.length,
      );
      range.setStart(textNode, cursorPos);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    activeElement.focus();
  } else {
    const text = activeElement.value;
    const newText =
      text.substring(0, matchStart) + translatedText + text.substring(matchEnd);
    activeElement.value = newText;

    // Trigger input event để các framework như React nhận biết
    const event = new Event("input", { bubbles: true });
    activeElement.dispatchEvent(event);

    // Đặt cursor về vị trí sau text được thay thế
    const cursorPos = matchStart + translatedText.length;
    if (activeElement.setSelectionRange) {
      activeElement.setSelectionRange(cursorPos, cursorPos);
    }
    activeElement.focus();
  }
}
