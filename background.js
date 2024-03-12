// background.js
chrome.runtime.onInstalled.addListener(function() {
    // Set the question index to 0 on installation
    chrome.storage.local.set({ 'questionIndex': 0 });
    chrome.storage.local.set({ 'orderInputSectionVisible': false });
    chrome.runtime.onStartup.addListener(function() {
      chrome.storage.local.set({
          'orderInputSectionVisible': false,
          'multipleChoiceOrder': [],
          'numericOrder': [],
          'shortAnswerOrder': [],
          'selectAllOrder': [],
          'questionIndexMC': 0,
          'questionIndexNumeric': 0,
          'questionIndexShort': 0,
          'questionIndexSelectAll': 0,
          'power': 'off',
      });
    });
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message !== null && message.command !== null) {
        if (message.command === 'updateAnswerOrder') {
          chrome.runtime.sendMessage({ command: "updateAnswerOrder" }, function(response) {
            console.log(response.farewell);
          });
        }
      }
    });
});  