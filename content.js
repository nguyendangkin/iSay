// content.js
let translationPopup = null;
let currentInput = null;

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

      // Kiểm tra pattern: `text`
      const match = text.match(/`([^`]+)`$/);

      if (match && match[1]) {
        const textToTranslate = match[1].trim();
        const rect = target.getBoundingClientRect();
        showTranslationPopup(rect, target);
        requestTranslation(textToTranslate);
      }
    }
  },
  true,
);

// Đã bỏ tính năng dịch khi bôi đen text

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

  // Tính toán vị trí popup
  let top, left;

  if (inputElement) {
    // Hiện phía dưới input
    top = rect.bottom + window.scrollY + 10;
    left = rect.left + window.scrollX;

    // Nếu quá sát đáy màn hình, hiện phía trên
    if (top + 100 > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - 80;
    }
  } else {
    // Hiện phía trên text được bôi đen
    top = rect.top + window.scrollY - 80;
    left = rect.left + window.scrollX;
  }

  // Đảm bảo không bị tràn màn hình
  if (left + 350 > window.innerWidth) {
    left = window.innerWidth - 360;
  }
  if (left < 10) {
    left = 10;
  }

  translationPopup.style.top = `${top}px`;
  translationPopup.style.left = `${left}px`;
  translationPopup.style.opacity = "1";
}

function requestTranslation(text) {
  chrome.runtime.sendMessage({ action: "translate", text }, (response) => {
    if (!translationPopup) return;

    if (response && response.error) {
      translationPopup.querySelector(".ai-translation-content").innerHTML = `
          <div class="ai-translation-error">❌ ${response.error}</div>
        `;
    } else if (response && response.translation) {
      translationPopup.querySelector(".ai-translation-content").innerHTML = `
          <div class="ai-translation-original">📝 ${text}</div>
          <div class="ai-translation-result">🌐 ${response.translation}</div>
        `;
    } else {
      translationPopup.querySelector(".ai-translation-content").innerHTML = `
          <div class="ai-translation-error">❌ Không nhận được phản hồi</div>
        `;
    }
  });
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
