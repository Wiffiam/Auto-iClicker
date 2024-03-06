function clickAnswerButton(choice) {
    const answerButton = document.getElementById(`multiple-choice-${choice}`);
    if (answerButton && !answerButton.disabled) {
      answerButton.click();
    }
  }
  
  function enterNumericAnswer() {
    // The numeric input is a textarea with the ID "numericAnswer"
    const numericInput = document.querySelector('textarea#numericAnswer');
    if (numericInput) {
      numericInput.value = '42'; // REPLACE WITH NUMERIC ANSWER
      // Trigger the input event for AngularJS
      const event = new Event('input', { bubbles: true, cancelable: true });
      numericInput.dispatchEvent(event);
      setTimeout(clickSubmitButton, 500); // Wait half a second before submitting
    }
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
    //textbox("Question Detected");
    if (isNumericQuestion()) {
      // It's a numeric question
      console.log("Numeric Detected");
      //textbox("Numeric Detected");
      enterNumericAnswer();
      setTimeout(clickSubmitButton, 500);
      textbox("Test");
    } else if (isSelectAllThatApplyQuestion()) {
      // It's a "select all that apply" question
      //textbox("Select All Detected");
      console.log("Select All Detected");
      clickAnswerButton('A'); // ENTER THE SELECTION, IF YOU WANT TO MAKE MULTIPLE SELECTIONS ADD NEW LINES
      setTimeout(clickSubmitButton, 500); // Wait half a second before submitting
    } else {
      // It's a regular multiple-choice question
      chrome.storage.local.get(['questionIndex'], function(result) {
        console.log("Multiple Choice Detected");
        //textbox("MC Detected");
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
console.log("Test");
//textbox("Initial Run");
//handleQuestion();