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

  function isShortAnswer() {
    return !!document.querySelector('textarea#shortAnswerInput');
  }

  function enterShortAnswer() {
    const shortAnswer = document.querySelector('textarea#shortAnswerInput');
    if (shortAnswer) {
      shortAnswer.value = 'TEST'; // REPLACE WITH DESIRED SHORT ANSWER
      const event = new Event('input', { bubbles: true, cancelable: true });
      shortAnswer.dispatchEvent(event);
      setTimeout(clickSubmitButton, 500); // half second delay
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

  function enterSelectAll() {
    clickAnswerButton('A'); // ENTER THE SELECTION, IF YOU WANT TO MAKE MULTIPLE SELECTIONS ADD NEW LINES
    clickAnswerButton('B');
    setTimeout(clickSubmitButton, 500); // Wait half a second before submitting
  }

  function isMultipleChoice() {
    const multipleChoiceHeader = document.querySelector('h2.banner-text');
    console.log(multipleChoiceHeader && (multipleChoiceHeader.innerText.includes("Multiple Choice")));
    return multipleChoiceHeader && (multipleChoiceHeader.innerText.includes("Multiple Choice"));
  }

  function enterMultipleChoice() {
    chrome.storage.local.get(['questionIndex', 'answerOrder'], function(result) {
        console.log("Multiple Choice Detected");
        const answerChoices = result.answerOrder || ['a', 'b', 'c', 'd']; // Default to ['a', 'b', 'c', 'd'] if no order is set
        let questionIndex = result.questionIndex || 0;
        const selectedAnswer = answerChoices[questionIndex % answerChoices.length];
        clickAnswerButton(selectedAnswer);
        // Increment the index for the next question
        chrome.storage.local.set({ 'questionIndex': questionIndex + 1 });
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

  // Use a MutationObserver to detect when new nodes are added to the DOM (new questions)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            console.log("new events detected");
            if (node.querySelector('.multiple-choice-buttons, .status-text-container, .numeric-answer-container')) {
              handleQuestion();
            } else if (joinClassPopup()) {
              console.log("JOINING CLASS");
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

  // Function to periodically check for a new question every second
  function periodicCheck() {
    handleQuestion();
  }

  // Initial check on page load
  console.log("Test");
  //textbox("Initial Run");
  //handleQuestion();