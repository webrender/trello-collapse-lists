var injectTimeout;

function inject() {
    chrome.tabs.executeScript(null,{file:"script.js"});
}

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details.url.indexOf('https://trello.com/b/') > -1) {
        if (!injectTimeout) {
            injectTimeout = setTimeout(inject, 1000);
        } else {
            clearTimeout(injectTimeout);
            injectTimeout = setTimeout(inject, 1000);
        }
    }
});
