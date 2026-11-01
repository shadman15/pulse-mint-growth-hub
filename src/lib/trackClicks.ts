// Counts clicks on the booking link wherever it appears.
//
// One listener on the document rather than an onClick on each button: the
// link is used in six places and a seventh would otherwise be added one day
// without anyone remembering to track it.

import { BOOK_CALL_URL } from './links';
import { track } from './track';

export function trackOutboundClicks(): void {
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as HTMLElement | null)?.closest?.('a[href]');
      if (!el) return;
      const href = el.getAttribute('href') || '';
      if (href.startsWith(BOOK_CALL_URL)) track('book_call_clicked');
    },
    // Capture, so it still counts if something downstream stops the event.
    { capture: true },
  );
}
