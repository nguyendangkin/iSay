// Load saved settings
document.addEventListener("DOMContentLoaded", async () => {
  const result = await chrome.storage.sync.get(["apiKey", "targetLang"]);

  if (result.apiKey) {
    document.getElementById("apiKey").value = result.apiKey;
  }

  if (result.targetLang) {
    document.getElementById("targetLang").value = result.targetLang;
  }
});

// Save settings
document.getElementById("save").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value.trim();
  const targetLang = document.getElementById("targetLang").value;
  const statusDiv = document.getElementById("status");

  if (!apiKey) {
    statusDiv.className = "status error";
    statusDiv.textContent = "❌ Vui lòng nhập API Key";
    return;
  }

  try {
    await chrome.storage.sync.set({
      apiKey: apiKey,
      targetLang: targetLang,
    });

    statusDiv.className = "status success";
    statusDiv.textContent = "✅ Đã lưu cài đặt thành công!";

    setTimeout(() => {
      statusDiv.style.display = "none";
    }, 3000);
  } catch (error) {
    statusDiv.className = "status error";
    statusDiv.textContent = "❌ Lỗi: " + error.message;
  }
});
