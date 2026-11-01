// Records a conversion event.
//
// Fire and forget by design: analytics must never delay or break anything the
// visitor is doing. Every failure is swallowed deliberately.
//
// No cookie, no identifier, nothing personal. These are counts of actions,
// not counts of people.

export type EventName =
  | 'test_agent_opened'
  | 'test_agent_connected'
  | 'test_agent_failed'
  | 'calculator_used'
  | 'book_call_clicked'
  | 'blog_cta_clicked';

export function track(name: EventName): void {
  try {
    const body = JSON.stringify({ name, path: window.location.pathname });
    // sendBeacon survives the page being closed, which matters for clicks
    // that navigate away, such as Book a call.
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }));
      return;
    }
    void fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never throw into the page */
  }
}
