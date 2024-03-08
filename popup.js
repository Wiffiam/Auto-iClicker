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
            alert('Answer order set to random');
        });
    });

    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', saveAnswerOrder);
});

function saveAnswerOrder() {
    const answerOrder = document.getElementById('answerOrderInput').value.toLowerCase().split(',');
    chrome.storage.local.set({ 'answerOrder': answerOrder }, function() {
        console.log('Answer order saved successfully');
        alert('Answer order saved successfully');
    });
}
