function clickAnswerButton(choice) {
    const answerButton = document.getElementById(`multiple-choice-${choice}`);
    if (answerButton && !answerButton.disabled) {
      answerButton.click();
    }
  }

function enterNumericAnswer() {
  chrome.storage.local.get(['numericOrder', 'questionIndexNumeric'], function(result) {
    console.log("Numeric Detected");
    const numericOrder = result.numericOrder || [];
    let questionIndexNumeric = result.questionIndexNumeric || 0;
    // Use '0' as default if numericOrder is empty
    const selectedAnswerNumeric = numericOrder.length > 0 ? numericOrder[questionIndexNumeric % numericOrder.length] : '0';
    const numericInput = document.querySelector('textarea#numericAnswer');
    if (numericInput) { 
      numericInput.value = selectedAnswerNumeric;
      const event = new Event('input', { bubbles: true, cancelable: true });
      numericInput.dispatchEvent(event);
      setTimeout(clickSubmitButton, 500);
    }
    chrome.storage.local.set({ 'questionIndexNumeric': questionIndexNumeric + 1 });
  });
}

function isShortAnswer() {
  return !!document.querySelector('textarea#shortAnswerInput');
}

function enterShortAnswer() {
  chrome.storage.local.get(['shortAnswerOrder', 'questionIndexShort'], function(result) {
    const shortAnswerOrder = result.shortAnswerOrder || [];
    let questionIndexShort = result.questionIndexShort || 0;
    // Use '-' as the default if shortAnswerOrder is empty
    const selectedAnswerShort = shortAnswerOrder.length > 0 ? shortAnswerOrder[questionIndexShort % shortAnswerOrder.length] : '-';
    // Define shortAnswer by selecting the correct DOM element
    const shortAnswer = document.querySelector('textarea#shortAnswerInput'); // Corrected to select a textarea
    if (shortAnswer) { // Check if the textarea exists
      shortAnswer.value = selectedAnswerShort;
      const event = new Event('input', { bubbles: true, cancelable: true });
      shortAnswer.dispatchEvent(event);
      setTimeout(clickSubmitButton, 500); // Adjust clickSubmitButton function as necessary
    }
    chrome.storage.local.set({ 'questionIndexShort': questionIndexShort + 1 });
  });
}

function isNumericQuestion() {
  // Check if the numeric input text area is present
  return !!document.querySelector('textarea#numericAnswer');
}

function clickSubmitButton() {
  // Select the button by either of the two classes
  const submitButton = document.querySelector('.send-answer-btn, .rounded-button');
  
  // Check if the button exists and is not disabled, then click it
  if (submitButton && !submitButton.disabled) {
    submitButton.click();
  }
}  

function isSelectAllThatApplyQuestion() {
  const selectAllText = document.querySelector('.status-text-container');
  return selectAllText && (selectAllText.innerText.includes("Select All Correct Answers Below") || selectAllText.innerText.includes("Answers Received"));
}

function enterSelectAll() {
  chrome.storage.local.get(['selectAllOrder', 'questionIndexSelectAll'], function(result) {
    const selectAllOrder = result.selectAllOrder || ['bc']; // Default order if none is set
    let questionIndexSelectAll = result.questionIndexSelectAll || 0;
    const selectedAnswerSelectAll = selectAllOrder[questionIndexSelectAll % selectAllOrder.length];
    // Loop through each character in the selectedAnswerSelectAll string
    for (let i = 0; i < selectedAnswerSelectAll.length; i++) {
      const answerChar = selectedAnswerSelectAll.charAt(i);
      clickAnswerButton(answerChar.toUpperCase()); // Call clickAnswerButton for each character
    }
    setTimeout(clickSubmitButton, 500); // Wait half a second before submitting to ensure all clicks are registered
    chrome.storage.local.set({ 'questionIndexSelectAll': questionIndexSelectAll + 1 });
  });
}

function isMultipleChoice() {
  const multipleChoiceHeader = document.querySelector('h2.banner-text');
  console.log(multipleChoiceHeader && (multipleChoiceHeader.innerText.includes("Multiple Choice")));
  return multipleChoiceHeader && (multipleChoiceHeader.innerText.includes("Multiple Choice"));
}

function enterMultipleChoice() {
  chrome.storage.local.get(['multipleChoiceOrder', 'questionIndexMC'], function(result) {
      console.log("Multiple Choice Detected");
      const answerChoicesMC = result.multipleChoiceOrder || ['a', 'b', 'c', 'd']; // Use 'multipleChoiceOrder' to match popup.js
      let questionIndexMC = result.questionIndexMC || 0;
      const selectedAnswerMC = answerChoicesMC[questionIndexMC % answerChoicesMC.length];
      clickAnswerButton(selectedAnswerMC);
      // Increment the index for the next question
      chrome.storage.local.set({ 'questionIndexMC': questionIndexMC + 1 });
  });
}

function joinClassPopup() {
  const innerContainer = document.querySelector('#join-inner-container');
  if (innerContainer == null) {
    return false;
  } else if (innerContainer.style.display == 'block') {
    return true;
  }
  return false;
}

function joinClass() {
  const joinButton = document.querySelector('#btnJoin');
  if (joinButton && !joinButton.disabled) {
    joinButton.click();
  }
}

function textbox(text) {
  // this function is dumb
  const body = document.querySelector('body');
  const indicator = document.createElement('div');
  indicator.textContent = text;
  indicator.style.position = 'fixed';
  indicator.style.bottom = '10px';
  indicator.style.right = '10px';
  indicator.style.backgroundColor = 'red';
  indicator.style.color = 'white';
  indicator.style.zIndex = '10000';
  indicator.style.padding = '5px';
  body.appendChild(indicator);
  setTimeout(() => {
    body.removeChild(indicator);
  }, 3000);
}

function handleQuestion() {
  console.log("Question Detected");
  if (isNumericQuestion()) {
    console.log("Numeric Detected");
    enterNumericAnswer();
  } else if (isShortAnswer()) {
    console.log("Short Answer Detected");
    enterShortAnswer();
    console.log("Submitted Short Answer");
  } else if (isSelectAllThatApplyQuestion()) {
    console.log("Select All Detected");
    enterSelectAll();
  } else {
    console.log("Multiple Choice Detected");
    enterMultipleChoice();
  }
}

function initialRun() {
  if (joinClassPopup()) {
    joinClass();
  }
  handleQuestion();
}

chrome.storage.local.get(['power'], function(result) {
  const power = result.power;
  if (power === 'on') {
    initializeContentScript();
  }
});

let observer; 

function initializeContentScript() {
  initialRun();
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            console.log("new events detected");
            if (node.querySelector('.multiple-choice-buttons, .status-text-container, .numeric-answer-container')) {
              handleQuestion();
              setTimeout(function() {
                chrome.runtime.sendMessage({ command: "updateAnswerOrder" }, function(response) {;
                  console.log(response.farewell);
                });
              }, 500);
            } else if (joinClassPopup()) {
              joinClass();
            } else {
              console.log("OTHER EVENT");
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function stopContentScript() {
  if(observer) {
    observer.disconnect(); 
    console.log('Observer stopped');
  } else {
    console.log('No observer to disconnect');
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command === "start") {
    initializeContentScript();
    console.log("Content Script Started");
  } else if (request.command === "stop") {
    stopContentScript();
    console.log("Content Script Stopped");
  }
});

// Function to periodically check for a new question every second (for debug only)
function periodicCheck() {
  handleQuestion();
}