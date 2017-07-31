(function defer() {
    if (window.jQuery) {
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
                e.parentNode.parentNode.parentNode.setAttribute('draggable', true);
                // insert toggle button
                e.parentNode.insertBefore(toggle, e);
            });
        });
        // we want to open lists after a short delay if a user is dragging a card on top of one
        // trello already uses jQuery draggable, but we have to create new events since content scripts
        // cant access JS on the parent page.
        var isClosed, openList;
        // make all cards draggable - revert to their former location if they werent moved, and don't wait to revert after drop
        $('.list-card').draggable({revert: true, revertDuration: 0});
        // make all lists droppable
        $('.js-list').droppable({
            // we only want to look at the area below the pointer
            tolerance: 'pointer',
            // when we move over a column, if it's closed, open it after a short period.
            // we use isClosed to keep track of the list's initial state so we know if we need to close it after.
            over: (evt, ui) => {
                if (evt.target.classList.contains('-closed')) {
                    openList = setTimeout(() => {
                        evt.target.classList.remove('-closed');
                        isClosed = true;
                    }, 250);
                } else {
                    isClosed = false;
                }
            },
            // when we leave a list or drop an item on it, clear the timeout and close it if it was originally closed.
            out: (evt, ui) => {
                clearTimeout(openList);
                if (isClosed) {
                    evt.target.classList.add('-closed');
                }
            },
            drop: (evt, ui) => {
                clearTimeout(openList);
                if (isClosed) {
                    evt.target.classList.add('-closed');
                }
            }
        });
    } else {
        setTimeout(() => defer(), 50);
    }
})();

