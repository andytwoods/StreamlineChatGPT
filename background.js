// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'output_complete') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'ChatGPT Output Complete',
            message: 'ChatGPT has finished outputting a result.',
            buttons: [
                { title: 'Download Files' },
                { title: 'Copy Output' }
            ],
            priority: 1
        });
    }
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
        chrome.storage.local.get(['downloadDirectory'], (result) => {
            const directory = result.downloadDirectory || '';
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: downloadFiles,
                    args: [directory]
                });
            });
        });
    } else if (buttonIndex === 1) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: copyOutputToClipboard
            });
        });
    }
});

function downloadFiles(directory) {
    const downloadLinks = document.querySelectorAll('[data-testid^="conversation-turn-"] pre'); // Update this selector
    downloadLinks.forEach((pre, index) => {
        const text = pre.innerText;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const filename = directory ? `${directory}/code-snippet-${index + 1}.txt` : `code-snippet-${index + 1}.txt`;
        chrome.downloads.download({ url, filename });
    });
}

function copyOutputToClipboard() {
    const output = document.querySelector('[data-testid^="conversation-turn-"] pre').innerText; // Update this selector
    navigator.clipboard.writeText(output).then(() => {
        alert('Output copied to clipboard');
    }, (err) => {
        console.error('Failed to copy text: ', err);
    });
}
