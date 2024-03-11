document.addEventListener('DOMContentLoaded', function() {
    const pickOrderButton = document.getElementById('pickOrderButton');
    const randomOrderButton = document.getElementById('randomOrderButton');
    const orderInputSection = document.getElementById('orderInputSection');

    pickOrderButton.addEventListener('click', function() {
        orderInputSection.style.display = 'block';
    });

    randomOrderButton.addEventListener('click', function() {
        chrome.storage.local.set({ 'answerOrder': null }, function() {
            console.log('Answer order set to random');
            showNotification('Answer order set to random', 'success');
        });
        orderInputSection.style.display = 'none';
    });

    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', saveAnswerOrder);
});

function saveAnswerOrder() {
    const answerOrderMC = document.getElementById('multipleChoiceOrderInput').value.toLowerCase().split(',');
    const answerOrderNumeric = document.getElementById('numericOrderInput').value.toLowerCase().split(',');
    const answerOrderShort = document.getElementById('shortAnswerInput').value.toLowerCase().split(',');
    const answerOrderSelectAll = document.getElementById('selectAllAnswerInput').value.toLowerCase().split(',');
    chrome.storage.local.set({ 'multipleChoiceOrder': answerOrderMC }, function() {
        console.log('Multiple choice order saved successfully');
    });
    chrome.storage.local.set({ 'questionIndexMC': 0 }, function() {
        chrome.log('Question index reset');
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
