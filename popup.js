document.addEventListener('DOMContentLoaded', function() {
    const pickOrderButton = document.getElementById('pickOrderButton');
    const randomOrderButton = document.getElementById('randomOrderButton');
    const orderInputSection = document.getElementById('orderInputSection');
    const powerSwitch = document.getElementById('powerSwitch');

    pickOrderButton.addEventListener('click', function() {
        if (orderInputSection.style.display === 'block') {
            orderInputSection.style.display = 'none';
        } else {
            orderInputSection.style.display = 'block';
        }
    });

    randomOrderButton.addEventListener('click', function() {
        chrome.storage.local.set({ 'answerOrder': null }, function() {
            console.log('Answer order set to random');
            showNotification('Answer order set to random', 'success');
        });
        orderInputSection.style.display = 'none';
    });

    chrome.storage.local.get(['power'], function(result) {
        if (result.power === 'on') {
            powerSwitch.checked = true;
            powerButtonOn.style.display = 'block';
            powerButtonOff.style.display = 'none';
            initializeContentScript();
        } else {
            powerSwitch.checked = false;
            powerButtonOn.style.display = 'none';
            powerButtonOff.style.display = 'block';
            stopContentScript();
        }
    });

    powerSwitch.addEventListener('click', function() {
        const powerState = powerSwitch.checked ? 'on' : 'off';
        chrome.storage.local.set({ 'power': powerState }, function() {
            console.log(`Extension ${powerState}`);
            powerButtonOn.style.display = powerSwitch.checked ? 'block' : 'none';
            powerButtonOff.style.display = powerSwitch.checked ? 'none' : 'block';
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {command: powerSwitch.checked ? "start" : "stop"});
            });
        });
    });    

    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', saveAnswerOrder);
});

function saveAnswerOrder() {
    const answerOrderMC = getAnswerOrder('multipleChoiceOrderInput', ['a', 'b', 'c', 'd']);
    const answerOrderNumeric = getAnswerOrder('numericOrderInput', [1, 2, 3]);
    const answerOrderShort = getAnswerOrder('shortAnswerInput', ['hello', 'hola', 'bonjour']);
    const answerOrderSelectAll = getAnswerOrder('selectAllAnswerInput', ['abc', 'ab', 'acd']);
    chrome.storage.local.set({ 'multipleChoiceOrder': answerOrderMC }, function() {
        console.log('Multiple choice order saved successfully');
    });
    chrome.storage.local.set({ 'questionIndexMC': 0 }, function() {
        console.log('Question index reset');
    });
    chrome.storage.local.set({ 'numericOrder': answerOrderNumeric }, function() {
        console.log('Numeric order saved successfully');
    });
    chrome.storage.local.set({ 'questionIndexNumeric': 0 }, function() {
        console.log('Question index reset');
    });
    chrome.storage.local.set({ 'shortAnswerOrder': answerOrderShort }, function() {
        console.log('Short answer order saved successfully');
    });
    chrome.storage.local.set({ 'questionIndexShort': 0 }, function() {
        console.log('Question index reset');
    });
    chrome.storage.local.set({ 'selectAllOrder': answerOrderSelectAll }, function() {
        console.log('Select all order saved successfully');
    });
    chrome.storage.local.set({ 'questionIndexSelectAll': 0 }, function() {
        console.log('Question index reset');
    });
    // Assuming showNotification is a function you've defined to display notifications to the user
    showNotification('Answer order saved successfully', 'success');
}

function getAnswerOrder(inputId, defaultOrder) {
    const inputValue = document.getElementById(inputId).value.toLowerCase().trim();
    if (inputValue) {
        return inputValue.split(',');
    } else {
        return defaultOrder;
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}
