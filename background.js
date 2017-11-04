/*global chrome*/
var thisTab, debounce;

function inject() {
	chrome.tabs.insertCSS(thisTab,{file:'styles.css'});
	chrome.tabs.executeScript(thisTab,{file:'jquery.js'});
	chrome.tabs.executeScript(thisTab,{file:'jquery-ui.js'});
	chrome.tabs.executeScript(thisTab,{file:'script.js'});
}

function onTabUpdated(tabId, changeInfo, tab) {
	if (changeInfo.status === 'complete' && tab.url.indexOf('trello.com/b/') > -1) {
		thisTab = tabId;
		window.clearTimeout(debounce);
		debounce = setTimeout(inject, 1000);
	}
}

chrome.tabs.onUpdated.addListener(onTabUpdated);
