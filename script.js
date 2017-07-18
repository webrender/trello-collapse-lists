// get boardid
var boardid = window.location.href.substring(window.location.href.indexOf('/b/') + 3, window.location.href.indexOf('/b/') + 11);
// get all lists
document.querySelectorAll('.list-header-name').forEach( e => {
    // encoded list title for unique id
    var columnName = encodeURI(e.textContent);
    // get isClosed value from chrome extension storage
    chrome.storage.local.get(boardid+':'+columnName, isClosed => {
        // if this list is closed, add the -closed class
        if (isClosed[boardid+':'+columnName])
            e.parentNode.parentNode.parentNode.classList.add('-closed');
        // create toggle button
        var toggle = document.createElement("div");
        toggle.className = 'collapse-toggle';
        // toggle click handler
        toggle.addEventListener('click', evt => {
            // get column name from event target
            var thisColumn = encodeURI(evt.target.nextSibling.textContent);
            // set isClosed value in chrome storage to inverse value
            chrome.storage.local.set({[boardid+':'+thisColumn]: isClosed[boardid+':'+columnName] ? null : true}, res => {
                // toggle the -closed class on successful save
                evt.target.parentNode.parentNode.parentNode.classList.toggle('-closed');
            });
        })
        // insert toggle button
        e.parentNode.insertBefore(toggle, e);
    });
});
