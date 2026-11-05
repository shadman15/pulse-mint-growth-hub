// Signup form on the trade and town pages.
//
// The form is a plain GET to the cal.com booking page, so it still works
// with scripts off: name and email prefill the booking. With scripts on, the
// trade and town are folded into the booking notes so Shadman sees them, and
// a "book_call_clicked" count is sent to /api/event (no cookie, nothing
// personal, same as the rest of the site).
(function () {
  'use strict';

  function count(name) {
    try {
      var body = JSON.stringify({ name: name, path: location.pathname });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }));
      }
    } catch (e) {
      /* never throw into the page */
    }
  }

  var form = document.querySelector('form.lead-form');
  if (!form) return;

  form.addEventListener('submit', function () {
    var trade = form.querySelector('[name="trade"]');
    var town = form.querySelector('[name="town"]');
    var notes = form.querySelector('[name="notes"]');
    var parts = [];
    if (trade && trade.value.trim()) parts.push('Trade: ' + trade.value.trim());
    if (town && town.value.trim()) parts.push('Town: ' + town.value.trim());
    parts.push('From: ' + location.pathname);
    if (notes) notes.value = parts.join('. ');
    // Keep the booking link tidy: these two are carried in the notes instead.
    if (trade) trade.removeAttribute('name');
    if (town) town.removeAttribute('name');
    count('book_call_clicked');
    // Put the names back so a second submit (or the back button) still works.
    setTimeout(function () {
      if (trade) trade.setAttribute('name', 'trade');
      if (town) town.setAttribute('name', 'town');
    }, 0);
  });
})();
