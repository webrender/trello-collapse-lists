var injectTimeout, currentUrl;

function inject() {
    chrome.tabs.executeScript(null,{file:"script.js"});
}

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log(details);
    if(details.url.indexOf('https://trello.com/b/') > -1) {
        if (details.url.substr(0,30) != currentUrl) {
            currentUrl = details.url.substr(0,30);
            if (!injectTimeout) {
                injectTimeout = setTimeout(inject, 1000);
            } else {
                clearTimeout(injectTimeout);
                injectTimeout = setTimeout(inject, 1000);
            }
        }
    }
});
