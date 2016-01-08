/**
  * URLs on Twitter are unfortunately slow and frequently time out because of
  * their URL shortening service, t.co. This Safari extension replaces t.co URLs
  * with the originally submitted URL.
  *
  * More info: https://github.com/davidcelis/no-tco
  */

var noTco = (function() {
  "use strict";

  /**
   * Removes all current t.co links and sets a polling interval to remove future
   * t.co links that come in as Twitter streams to the browser.
   */
  var poll = function() {
    remove();

    // Poll for new URLs as Twitter streams
    setInterval(function() { remove() }, 3000);
  };

  /**
   * A simple forEach implementation to avoid Array.prototype hacks. Enumerates
   * over our t.co links as a NodeList.
   *
   * @private
   */
  var forEach = function(array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
      callback.call(scope, array[i]);
    }
  }

  /**
   * Parses t.co links and replaces them with the original URL, typically found
   * in data-full-url.
   *
   * @private
   */
  var remove = function() {
    var linkSelector = ".twitter-timeline-link:not([data-tco-expanded])",
        withOriginal = "a[data-full-url]:not([data-tco-expanded])",
        links = document.querySelectorAll(linkSelector + "," + withOriginal);

    if (links.length > 0) {
      forEach(links, function(link) {
        if (link.hasAttribute("data-expanded-url")) {
          link.href = link.getAttribute("data-expanded-url");
        } else if (link.innerHTML.substring(0, 16) === "pic.twitter.com/") {
          // If there's no data-expanded-url, we most likely have a link to
          // pic.twitter.com. This is only present in the link's innerHTML.
          link.href = window.location.protocol + "//" + link.innerHTML;
        }

        // Mark the link as expanded so that we don't try to change it again as
        // we poll.
        link.setAttribute("data-tco-expanded", true)
      });
    }
  };

  return {
    poll: poll
  };
})();

noTco.poll();
