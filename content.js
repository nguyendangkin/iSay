// content.js - Auto copy & select when translation done
let translationPopup = null;
let currentInput = null;
let lastTranslation = null;
let lastOriginalText = null;
let lastMatchPattern = null;

// Lắng nghe sự kiện gõ phím
document.addEventListener(
  "input",
  (e) => {
    const target = e.target;

    // Kiểm tra nếu là input hoặc textarea hoặc contenteditable
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      currentInput = target;
      const text = target.value || target.textContent || "";

      // Kiểm tra pattern: ]\text]\
      const match = text.match(/\]\\([^\]\\]+)\]\\/);

      if (match && match[1]) {
        const textToTranslate = match[1].trim();
        lastOriginalText = match[1].trim();
        lastMatchPattern = match[0]; // Lưu cả pattern để thay thế chính xác
        const rect = target.getBoundingClientRect();
        showTranslationPopup(rect, target);
        requestTranslation(textToTranslate);
      }
    }
  },
  true,
);

// Lắng nghe phím tắt Ctrl+Alt+R để thay thế
document.addEventListener("keydown", async (e) => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "r") {
    e.preventDefault();

    if (!currentInput || !lastTranslation || !lastMatchPattern) {
      console.log("❌ Không có translation để thay thế");
      return;
    }

    const active = currentInput;

    if (active.isContentEditable) {
      await replaceInContentEditable(active);
    } else if (active.tagName === "INPUT" || active.tagName === "TEXTAREA") {
      replaceInNormalInput(active);
    }

    // Ẩn popup sau khi thay thế
    hidePopup();
  }
});

// Tự động copy và select khi dịch xong
async function autoCopyAndSelect() {
  if (!currentInput || !lastTranslation || !lastMatchPattern) {
    return;
  }

  const active = currentInput;

  if (active.isContentEditable) {
    const text = active.innerText || active.textContent;
    if (text.includes(lastMatchPattern)) {
      const newText = text.replace(lastMatchPattern, lastTranslation);
      try {
        await navigator.clipboard.writeText(newText);
        active.focus();
        document.execCommand("selectAll", false, null);
        console.log("✅ Đã tự động copy & select. Nhấn Ctrl+V để paste!");
      } catch (err) {
        console.error("Auto copy failed:", err);
      }
    }
  } else if (active.tagName === "INPUT" || active.tagName === "TEXTAREA") {
    const text = active.value;
    if (text.includes(lastMatchPattern)) {
      const newText = text.replace(lastMatchPattern, lastTranslation);
      try {
        await navigator.clipboard.writeText(newText);
        active.focus();
        active.select();
        console.log("✅ Đã tự động copy & select. Nhấn Ctrl+V để paste!");
      } catch (err) {
        console.error("Auto copy failed:", err);
      }
    }
  }
}

function replaceInNormalInput(active) {
  const text = active.value;

  if (text.includes(lastMatchPattern)) {
    const newText = text.replace(lastMatchPattern, lastTranslation);
    active.value = newText;

    // Trigger input event để các framework như React nhận biết thay đổi
    const inputEvent = new Event("input", { bubbles: true });
    active.dispatchEvent(inputEvent);

    console.log("✅ Đã thay thế:", lastMatchPattern, "→", lastTranslation);

    // Di chuyển cursor về cuối
    active.focus();
    active.setSelectionRange(newText.length, newText.length);
  }
}

async function replaceInContentEditable(active) {
  const text = active.innerText || active.textContent;

  if (!text.includes(lastMatchPattern)) {
    console.log("❌ Không tìm thấy pattern để thay thế");
    return;
  }

  const newText = text.replace(lastMatchPattern, lastTranslation);

  try {
    // Copy text mới vào clipboard
    await navigator.clipboard.writeText(newText);
    console.log("📋 Đã copy vào clipboard:", newText);

    // Focus vào element
    active.focus();

    // Select all
    document.execCommand("selectAll", false, null);
    console.log("✅ Đã select all");

    // Tự động simulate Ctrl+V keystroke
    const ctrlVEvent = new KeyboardEvent("keydown", {
      key: "v",
      code: "KeyV",
      keyCode: 86,
      which: 86,
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });

    active.dispatchEvent(ctrlVEvent);
    console.log("⌨️ Đã gửi Ctrl+V event");

    // Backup method
    setTimeout(() => {
      if (active.innerText === text) {
        // Nếu vẫn chưa thay đổi, dùng execCommand
        document.execCommand("paste");
        console.log("🔄 Dùng execCommand backup");
      }
    }, 100);
  } catch (err) {
    console.error("Auto paste failed:", err);
  }
}

function showTranslationPopup(rect, inputElement = null) {
  hidePopup();

  translationPopup = document.createElement("div");
  translationPopup.className = "ai-translation-popup";
  translationPopup.innerHTML = `
    <div class="ai-translation-content">
      <div class="ai-translation-loading">⏳ Đang dịch...</div>
    </div>
  `;

  document.body.appendChild(translationPopup);

  // Tính toán vị trí popup - ƯU TIÊN TRÊN/DƯỚI
  let top, left;

  if (inputElement) {
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const popupHeight = 80; // Ước tính chiều cao popup

    // Thử hiện phía dưới trước
    if (rect.bottom - scrollY + popupHeight + 20 < viewportHeight) {
      top = rect.bottom + scrollY + 8;
      left = rect.left + scrollX;
    }
    // Nếu không đủ chỗ phía dưới, hiện phía trên
    else {
      top = rect.top + scrollY - popupHeight - 8;
      left = rect.left + scrollX;
    }

    // Đảm bảo không bị tràn ngang
    const popupWidth = 250;
    if (left + popupWidth > window.innerWidth + scrollX) {
      left = window.innerWidth + scrollX - popupWidth - 10;
    }
    if (left < scrollX + 10) {
      left = scrollX + 10;
    }
  } else {
    // Hiện phía trên text được bôi đen
    top = rect.top + window.scrollY - 80;
    left = rect.left + window.scrollX;
  }

  translationPopup.style.top = `${top}px`;
  translationPopup.style.left = `${left}px`;
  translationPopup.style.opacity = "1";
}

function requestTranslation(text) {
  chrome.runtime.sendMessage(
    { action: "translate", text },
    async (response) => {
      if (!translationPopup) return;

      if (response && response.error) {
        lastTranslation = null;
        translationPopup.querySelector(".ai-translation-content").innerHTML = `
          <div class="ai-translation-error">❌ ${response.error}</div>
        `;
      } else if (response && response.translation) {
        lastTranslation = response.translation;

        // TỰ ĐỘNG COPY & SELECT LUÔN KHI DỊCH XONG
        await autoCopyAndSelect();

        translationPopup.querySelector(".ai-translation-content").innerHTML = `
          <div class="ai-translation-original">📝 ${text}</div>
          <div class="ai-translation-result">🌐 ${response.translation}</div>
          <div class="ai-translation-hint">✅ Đã copy! Nhấn Ctrl+V để paste</div>
        `;
      } else {
        lastTranslation = null;
        translationPopup.querySelector(".ai-translation-content").innerHTML = `
          <div class="ai-translation-error">❌ Không nhận được phản hồi</div>
        `;
      }
    },
  );
}

function hidePopup() {
  if (translationPopup) {
    translationPopup.remove();
    translationPopup = null;
  }
}

// Click ra ngoài để ẩn popup
document.addEventListener("mousedown", (e) => {
  if (translationPopup && !translationPopup.contains(e.target)) {
    hidePopup();
  }
});

// Ẩn popup khi nhấn ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && translationPopup) {
    hidePopup();
  }
});

// Ẩn popup sau khi người dùng nhấn Ctrl+V để dán
document.addEventListener("paste", () => {
  if (translationPopup) {
    hidePopup();
  }
});
