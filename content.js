// content.js

const observer = new MutationObserver((mutationsList) => {
    console.log(111)
    chrome.runtime.sendMessage({ message: 'output_complete' });
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.tagName === 'TEXTAREA' && node.id === 'prompt-textarea') {
                    document.body.style.backgroundColor = 'yellow';
                    setTimeout(() => {
                        document.body.style.backgroundColor = '';
                    }, 3000);
                    chrome.runtime.sendMessage({ message: 'output_complete' });
                }
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
