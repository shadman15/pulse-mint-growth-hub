// Counts clicks from a blog article through to the site or the calculator,
// so you can tell which guide actually sends people somewhere rather than
// only which one gets read.
//
// No cookie, no identifier, nothing personal: just a count of the action and
// the page it happened on. Fails silently, because analytics must never
// interfere with the page.
(function () {
  'use strict';
  function send(name) {
    try {
      var body = JSON.stringify({ name: name, path: location.pathname });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }));
      } else {
        fetch('/api/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          keepalive: true,
        }).catch(function () {});
      }
    } catch (e) {
      /* never throw into the page */
    }
  }

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      // Only links that leave the article for the product itself.
      if (href === '/' || href.indexOf('/#') === 0 || href.indexOf('https://pulsemint.co.uk/#') === 0) {
        send('blog_cta_clicked');
      }
    },
    true,
  );
})();
