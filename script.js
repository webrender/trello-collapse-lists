if (!document.querySelector(".collapse-toggle")) {
  // get boardid
  var boardid = window.location.href.substring(
    window.location.href.indexOf("/b/") + 3,
    window.location.href.indexOf("/b/") + 11
  );
  // get all lists
  document.querySelectorAll(".list-header-name").forEach(e => {
    // encoded list title for unique id
    var columnName = encodeURI(e.textContent);
    // get isClosed value from chrome extension storage
    chrome.storage.local.get(boardid + ":" + columnName, isClosed => {
      // if this list is closed, add the -closed class
      if (isClosed[boardid + ":" + columnName]) {
        e.parentNode.parentNode.parentNode.classList.add("-closed");
        e.parentNode.parentNode.parentNode.classList.add("-cl");
      }
      // create toggle button
      var toggle = document.createElement("div");
      toggle.className = "collapse-toggle";
      // toggle click handler
      toggle.addEventListener("click", evt => {
        // get column name from event target
        var thisColumn = encodeURI(evt.target.nextSibling.textContent);
        // set isClosed value in chrome storage to inverse value
        chrome.storage.local.set(
          {
            [boardid + ":" + thisColumn]: isClosed[boardid + ":" + columnName]
              ? null
              : true
          },
          res => {
            // toggle the -closed class on successful save
            evt.target.parentNode.parentNode.parentNode.classList.toggle(
              "-closed"
            );
          }
        );
      });
      //   e.parentNode.parentNode.parentNode.setAttribute("draggable", true);
      // insert toggle button
      e.parentNode.insertBefore(toggle, e);
    });
  });
  // we want to open lists after a short delay if a user is dragging a card on top of one
  // trello already uses jQuery draggable, but we have to create new events since content scripts
  // cant access JS on the parent page.
  var isClosed, openList;
  $(".list-card").draggable({
    helper: "clone",
    // we used to use a jquery droppable event to monitor drop events, but either trello or jquery ui
    // changed something that broke this.  now, while a user is dragging, we use the code below to 
    // evaluate if the pointer is over a closed list and react accordingly
    drag: e => {
      document.querySelectorAll(".js-list.-cl").forEach(l => {
        const c = l.getBoundingClientRect();
        if (
          e.pageX > c.left &&
          e.pageX < c.right &&
          e.pageY > c.top &&
          e.pageY < c.bottom
        ) {
          if (!openList) {
            // we use a timeout here so that users can drag cards across a closed list without
            // opening it right away.
            openList = setTimeout(() => {
              l.classList.add("-open");
              l.classList.remove("-closed");
            }, 250)
          }
        } else {
          clearTimeout(openList)
          openList = null
          if (l.classList.contains("-open")) {
            l.classList.remove("-open");
            l.classList.add("-closed");
          }
        }
      });
    }
  });
}
