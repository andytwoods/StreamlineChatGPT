// popup.js
document.getElementById('save-directory').addEventListener('click', () => {
    const directory = document.getElementById('directory').value;
    chrome.storage.local.set({ downloadDirectory: directory }, () => {
        alert('Directory saved');
    });
});