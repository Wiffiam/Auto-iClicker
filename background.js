// background.js
chrome.runtime.onInstalled.addListener(function() {
    // Set the question index to 0 on installation
    chrome.storage.local.set({ 'questionIndex': 0 });
  });
  