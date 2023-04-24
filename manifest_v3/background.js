var thisTab, debounce;
var browser = browser || chrome;

function inject(tabId) {
  browser.scripting.insertCSS({
    target: { tabId },
    files: ["styles.css"]
  });
  browser.scripting.executeScript({
    target: {tabId}, 
    files: ["script.js"]
  });
}

function onTabUpdated(tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    tab.url.indexOf("trello.com/b/") > -1
  ) {
    thisTab = tabId;
    clearTimeout(debounce);
    debounce = setTimeout(() => {inject(tabId)}, 1000);
  }
}

browser.tabs.onUpdated.addListener(onTabUpdated);
