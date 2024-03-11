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
    const answerOrder = document.getElementById('answerOrderInput').value.toLowerCase().split(',');
    chrome.storage.local.set({ 'answerOrder': answerOrder }, function() {
        console.log('Answer order saved successfully');
        showNotification('Answer order saved successfully', 'success');
    });
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
