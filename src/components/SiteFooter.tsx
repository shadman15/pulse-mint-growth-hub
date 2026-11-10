import React, { useEffect, useState } from 'react';
import { BOOK_CALL_URL } from '../lib/links';

// The same four columns as the static pages in public/. Plain <a> throughout,
// because every destination is static HTML served outside the app.
const TRADES: [string, string][] = [
  ['/answering-service-for-plumbers/', 'Plumbers'],
  ['/answering-service-for-electricians/', 'Electricians'],
  ['/answering-service-for-heating-engineers/', 'Heating engineers'],
  ['/answering-service-for-roofers/', 'Roofers'],
  ['/answering-service-for-builders/', 'Builders'],
  ['/answering-service-for-locksmiths/', 'Locksmiths'],
  ['/out-of-hours-call-answering-for-tradesmen/', 'Out of hours cover'],
  ['/virtual-receptionist-for-sole-traders/', 'Sole traders'],
];

const AREAS: [string, string][] = [
  ['/ai-answering-service-norwich/', 'Norwich'],
  ['/ai-answering-service-ipswich/', 'Ipswich'],
  ['/ai-answering-service-peterborough/', 'Peterborough'],
  ['/ai-answering-service-northampton/', 'Northampton'],
  ['/ai-answering-service-milton-keynes/', 'Milton Keynes'],
  ['/ai-answering-service-derby/', 'Derby'],
  ['/ai-answering-service-stoke-on-trent/', 'Stoke-on-Trent'],
  ['/ai-answering-service-doncaster/', 'Doncaster'],
  ['/ai-answering-service-swindon/', 'Swindon'],
  ['/ai-answering-service-plymouth/', 'Plymouth'],
];

const GUIDES: [string, string][] = [
  ['/blog/', 'All guides'],
  ['/blog/best-ai-answering-service-small-business/', 'Services compared'],
  ['/blog/ai-answering-service-uk-tradesmen/', 'AI answering for tradesmen'],
  ['/blog/what-missed-calls-cost-small-business/', 'What missed calls cost'],
  ['/#calculator', 'Missed call calculator'],
];

const COMPANY: [string, string][] = [
  ['/about/', 'About us'],
  ['/privacy/', 'Privacy policy'],
  ['/cookies/', 'Cookie policy'],
  ['/terms/', 'Terms of service'],
  ['mailto:info@pulsemint.co.uk', 'info@pulsemint.co.uk'],
];

/** True once the viewport is wide enough to show all four columns open. */
function useWideScreen() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return wide;
}

function Column({
  title,
  links,
  wide,
}: {
  title: string;
  links: [string, string][];
  wide: boolean;
}) {
  const [open, setOpen] = useState(false);
  const shown = wide || open;

  return (
    <div className="min-w-0 border-t border-white/10 md:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={shown}
        // On desktop the heading is just a heading: the list is always shown.
        className="flex w-full items-center justify-between gap-3 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 md:pointer-events-none md:py-0 md:pb-4"
      >
        {title}
        <span
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rotate-45 border-b-2 border-r-2 border-emerald-400 transition-transform duration-150 md:hidden ${
            open ? '-rotate-[135deg]' : ''
          }`}
        />
      </button>
      <ul className={`${shown ? 'block' : 'hidden'} list-none space-y-2.5 pb-4 md:block md:pb-0`}>
        {links.map(([href, label]) => (
          <li key={href}>
            <a
              href={href}
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SiteFooter = () => {
  const wide = useWideScreen();

  return (
    <footer className="relative z-20 border-t border-white/10 px-6 pb-12 pt-12 md:pt-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 max-w-sm md:mb-12">
          <div className="mb-3 text-xl font-semibold tracking-wide text-white">
            Pulse<span className="text-emerald-400">mint</span>
          </div>
          <p className="text-sm leading-relaxed text-white/55">
            AI phone answering for UK small businesses. It answers the calls you can’t take,
            gets the caller’s details and texts them to you within a minute. £199 a month,
            with a free 14-day pilot.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <a
              href={BOOK_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-[#04110c] transition-colors hover:bg-emerald-400"
            >
              Start the free pilot
            </a>
            <a
              href="/#test-agent"
              className="rounded-full border border-emerald-500/45 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/10 hover:text-white"
            >
              Hear it answer
            </a>
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-1 gap-x-7 border-b border-white/10 pb-0 md:grid-cols-4 md:gap-y-2 md:pb-8"
        >
          <Column title="Answering service by trade" links={TRADES} wide={wide} />
          <Column title="Areas we cover" links={AREAS} wide={wide} />
          <Column title="Guides" links={GUIDES} wide={wide} />
          <Column title="Company" links={COMPANY} wide={wide} />
        </nav>

        <div className="flex flex-col gap-1 pt-6 text-xs text-white/40 sm:flex-row sm:flex-wrap sm:gap-x-5">
          <span>© 2026 Pulsemint Limited</span>
          <span>104B High Street, Lowestoft, Suffolk NR32 1XW</span>
          <span>Registered in England and Wales, company 16467783</span>
        </div>
        <p className="mt-2.5 text-xs text-white/30">
          Calls to the assistant may be recorded so we can check how it answered and improve it.
          See our{' '}
          <a href="/privacy/" className="underline hover:text-white/60">
            privacy policy
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
