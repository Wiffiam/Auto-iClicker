function clickAnswerButton(choice) {
    const answerButton = document.getElementById(`multiple-choice-${choice}`);
    if (answerButton && !answerButton.disabled) {
      answerButton.click();
    }
  }
  
  function enterNumericAnswer() {
    const numericInput = document.querySelector('.numeric-answer-container input[type="number"]');
    if (numericInput) {
      numericInput.value = '42'; // REPLACE WITH NUMERIC ANSWER
      const event = new Event('input', { bubbles: true, cancelable: true });
      numericInput.dispatchEvent(event);
      setTimeout(clickSubmitButton, 500); // Wait half a second before submitting
    }
  }
  
  function clickSubmitButton() {
    const submitButton = document.querySelector('.send-answer-btn');
    if (submitButton && !submitButton.disabled) {
      submitButton.click();
    }
  }
  
  function isSelectAllThatApplyQuestion() {
    const selectAllText = document.querySelector('.status-text-container');
    return selectAllText && (selectAllText.innerText.includes("Select All Correct Answers Below") || selectAllText.innerText.includes("Answers Received"));
  }
  
  function isNumericQuestion() {
    return !!document.querySelector('.numeric-answer-container input[type="number"]');
  }
  
  function handleQuestion() {
    if (isNumericQuestion()) {
      // It's a numeric question
      enterNumericAnswer();
    } else if (isSelectAllThatApplyQuestion()) {
      // It's a "select all that apply" question
      clickAnswerButton('A'); // ENTER THE SELECTION, IF YOU WANT TO MAKE MULTIPLE SELECTIONS ADD NEW LINES
      setTimeout(clickSubmitButton, 500); // Wait half a second before submitting
    } else {
      // It's a regular multiple-choice question
      chrome.storage.local.get(['questionIndex'], function(result) {
        const answerChoices = ['a', 'b', 'c', 'd']; // LIST OF CHOICES, GOES IN ORDER, MUST BE LOWERCASE
        let questionIndex = result.questionIndex || 0;
        const selectedAnswer = answerChoices[questionIndex % answerChoices.length];
        clickAnswerButton(selectedAnswer);
        // Increment the index for the next question
        chrome.storage.local.set({ 'questionIndex': questionIndex + 1 });
    });
  }
}

// Use a MutationObserver to detect when new nodes are added to the DOM (new questions)
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.querySelector('.multiple-choice-buttons, .status-text-container, .numeric-answer-container')) {
            handleQuestion();
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

// Function to periodically check for a new question every second
function periodicCheck() {
  handleQuestion();
}

// Initial check on page load
handleQuestion();
