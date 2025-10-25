const languages = [
  { code: "en", name: "English" },
  { code: "vi", name: "Vietnamese" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "uk", name: "Ukrainian" },
  { code: "he", name: "Hebrew" },
  { code: "sv", name: "Swedish" },
  { code: "nl", name: "Dutch" },
  { code: "fi", name: "Finnish" },
  { code: "no", name: "Norwegian" },
  { code: "da", name: "Danish" },
  { code: "cs", name: "Czech" },
  { code: "ro", name: "Romanian" },
  { code: "el", name: "Greek" },
  { code: "hu", name: "Hungarian" },
  { code: "bn", name: "Bengali" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "fa", name: "Persian" },
  { code: "ur", name: "Urdu" },
  { code: "sr", name: "Serbian" },
  { code: "hr", name: "Croatian" },
  { code: "sk", name: "Slovak" },
  { code: "bg", name: "Bulgarian" },
  { code: "et", name: "Estonian" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "sl", name: "Slovenian" },
  { code: "is", name: "Icelandic" },
  { code: "fil", name: "Filipino" },
  { code: "sw", name: "Swahili" },
];

const select = document.getElementById("targetLang");
languages.forEach((lang) => {
  const option = document.createElement("option");
  option.value = lang.code;
  option.textContent = lang.name;
  select.appendChild(option);
});

chrome.storage.sync.get(["apiKey", "targetLang"], (result) => {
  if (result.apiKey) document.getElementById("apiKey").value = result.apiKey;
  select.value = result.targetLang || "en";
});

document.getElementById("save").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value;
  const targetLang = select.value;
  await chrome.storage.sync.set({ apiKey, targetLang });

  document.getElementById("status").textContent = "✅ Đã lưu cài đặt!";
  setTimeout(() => (document.getElementById("status").textContent = ""), 2000);
});
