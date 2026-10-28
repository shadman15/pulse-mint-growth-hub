import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  PhoneMissed,
  PhoneCall,
  PhoneForwarded,
  MessageSquareText,
  ClipboardList,
  ShieldCheck,
  Mail,
  MapPin,
  Plus,
} from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { BOOK_CALL_URL, CONTACT_EMAIL } from '../lib/links';
import { useAgentCall } from './AgentCallModal';
import shadmanPhoto from '../assets/shadman.jpg';

/* ---------- shared bits, matching the existing site styles ---------- */

const primaryBtn =
  'inline-flex items-center justify-center gap-2 text-sm tracking-wider border border-emerald-500/50 px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 hover:from-emerald-500/40 hover:to-emerald-400/40 transition-all duration-300 text-white rounded group relative overflow-hidden';

const secondaryBtn =
  'inline-flex items-center justify-center gap-2 text-sm tracking-wider border border-white/20 px-8 py-4 bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded group';

const sectionHeading =
  'text-3xl md:text-5xl font-light tracking-[0.12em] md:tracking-[0.2em] text-white leading-tight';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** Fades children up the first time they scroll into view. */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`pm-reveal ${shown ? 'pm-reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/** Small voice waveform, used as a "live" signal. */
const Waveform: React.FC<{ bars?: number; className?: string }> = ({ bars = 24, className = '' }) => (
  <div className={`flex items-center justify-center gap-[3px] ${className}`} aria-hidden="true">
    {Array.from({ length: bars }).map((_, i) => (
      <span
        key={i}
        className="pm-wave-bar w-[3px] rounded-full bg-gradient-to-t from-emerald-500 to-white/80"
        style={{
          height: `${18 + ((i * 37) % 26)}px`,
          animationDelay: `${(i % 8) * 0.11}s`,
          animationDuration: `${0.9 + (i % 5) * 0.15}s`,
        }}
      />
    ))}
  </div>
);

/* ---------- 1. Missed calls intro + 3D enquiry card ---------- */

const EnquiryCard = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -10, y: px * 12 });
  };

  const rows = [
    ['Name', 'Sarah Mitchell'],
    ['Job', 'Flat roof leaking over the kitchen'],
    ['Where', 'Reading, RG1'],
    ['Call back', 'This evening, after 7'],
  ];

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      style={{ perspective: '1200px' }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {/* soft glow behind the card */}
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-500/25 via-white/5 to-emerald-500/20 blur-3xl" />

      <div
        className="relative pm-float"
        style={{
          transform: `rotateX(${tilt.x + 4}deg) rotateY(${tilt.y - 8}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.25s ease-out',
        }}
      >
        {/* ghost cards stacked behind for depth */}
        <div
          className="absolute inset-0 rounded-2xl border border-emerald-500/15 bg-emerald-900/10"
          style={{ transform: 'translateZ(-60px) translate(18px, 18px)' }}
        />
        <div
          className="absolute inset-0 rounded-2xl border border-emerald-500/20 bg-emerald-900/10"
          style={{ transform: 'translateZ(-30px) translate(9px, 9px)' }}
        />

        <div className="relative rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-gray-900/95 via-black/95 to-emerald-900/80 backdrop-blur-md p-6 md:p-7 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
          <div className="text-xs tracking-[0.3em] text-emerald-400/90 mb-5">EXAMPLE ENQUIRY</div>

          {/* missed call */}
          <div
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
            style={{ transform: 'translateZ(20px)' }}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10">
                <span className="absolute inset-0 rounded-full border border-red-400/40 pm-ping" />
                <PhoneMissed className="h-4 w-4 text-red-300" />
              </span>
              <div>
                <div className="text-sm text-white/90">Missed call</div>
                <div className="text-xs text-white/50 tracking-wider">07700 900123</div>
              </div>
            </div>
            <div className="text-xs text-white/50 tracking-wider">Tue 18:42</div>
          </div>

          {/* connector */}
          <div className="flex items-center gap-3 py-3 pl-[1.6rem]">
            <span className="h-6 w-px bg-gradient-to-b from-white/20 to-emerald-400/70" />
            <span className="text-xs tracking-wider text-emerald-300">Caught by Pulsemint at 18:44</span>
          </div>

          {/* captured details */}
          <div
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] p-4"
            style={{ transform: 'translateZ(40px)' }}
          >
            <dl className="space-y-3">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 text-sm">
                  <dt className="text-xs tracking-[0.2em] text-white/45 uppercase pt-[2px]">{k}</dt>
                  <dd className="text-white/90">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-white/55">
            <MessageSquareText className="h-4 w-4 text-emerald-400" />
            Sent to your phone as a text and email.
          </div>
        </div>
      </div>
    </div>
  );
};

const MissedCallsIntro = () => {
  const { openAgentCall } = useAgentCall();
  return (
  <section className="relative z-10 py-20 md:py-28 px-6 md:px-8 bg-gradient-to-br from-emerald-900/10 via-black to-purple-900/10">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-16 items-center">
      <Reveal>
        <div className="text-xs tracking-[0.4em] text-emerald-400/80 mb-6">FOR UK TRADES</div>
        <h2 className={sectionHeading}>
          Missed calls are jobs your <span className="text-emerald-400">competitor</span> gets.
        </h2>
        <p className="mt-8 text-lg md:text-xl text-white/75 leading-relaxed max-w-xl">
          Pulsemint picks up when you can’t. It takes the customer’s name, number and what they need,
          then texts you the details within a minute. <span className="text-white">Free for 14 days.</span>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a href={BOOK_CALL_URL} {...ext} className={primaryBtn}>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-white/20 to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              START THE FREE PILOT
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          <button type="button" onClick={openAgentCall} className={secondaryBtn}>
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            HEAR IT FIRST
          </button>
        </div>

        <p className="mt-6 text-sm text-white/50 tracking-wide">
          For UK roofers, builders, landscapers and fitters. No contract.
        </p>
      </Reveal>

      <Reveal delay={150}>
        <EnquiryCard />
      </Reveal>
    </div>
  </section>
  );
};

/* ---------- 2. Hear it before you decide ---------- */

const HearIt = () => {
  const { openAgentCall } = useAgentCall();
  return (
  <section className="relative z-10 py-20 px-6 md:px-8 bg-gradient-to-br from-purple-900/10 via-black to-emerald-900/10">
    <Reveal className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/25 via-black/60 to-emerald-900/25 px-6 py-14 md:px-14 text-center">
        {/* orbit rings echoing the hero ring */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[34rem] w-[34rem] rounded-full border border-emerald-500/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[24rem] w-[24rem] rounded-full border border-emerald-500/15" />

        <div className="relative">
          <h2 className={sectionHeading}>Hear it before you decide.</h2>
          <Waveform className="my-10 h-12" />
          <p className="text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
            Call the agent. That’s the assistant picking up, and it answers everything about our business.
            No sign-up, and nobody will ring you back.
          </p>
          <button type="button" onClick={openAgentCall} className={`${primaryBtn} mt-10 px-10 animate-pulse hover:animate-none`}>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-white/20 to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              CALL THE AGENT NOW
            </span>
          </button>
        </div>
      </div>
    </Reveal>
  </section>
  );
};

/* ---------- 3. What happens when you miss a call ---------- */

const steps = [
  {
    icon: PhoneForwarded,
    title: 'The call goes unanswered',
    body: 'You’re up a ladder or on another call. After a few rings it passes to Pulsemint instead of voicemail.',
  },
  {
    icon: ClipboardList,
    title: 'It takes the details',
    body: 'It answers the call, then asks for their name, number, the job and the address. If a caller asks whether it’s an AI, it says yes. It doesn’t quote prices or promise dates.',
  },
  {
    icon: MessageSquareText,
    title: 'You get it by text',
    body: 'A short summary lands on your phone within a minute. You ring back and win the job while they’re still searching.',
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="relative z-10 py-20 px-6 md:px-8 bg-gradient-to-br from-emerald-900/10 via-black to-purple-900/10">
    <div className="max-w-6xl mx-auto">
      <Reveal>
        <h2 className={`${sectionHeading} text-center mb-16`}>What happens when you miss a call</h2>
      </Reveal>

      <div className="relative grid md:grid-cols-3 gap-10 md:gap-8">
        {/* connecting line on desktop */}
        <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />

        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 120}>
            <div className="relative h-full">
              <div className="absolute -top-4 -left-4 z-10 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold text-xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                {i + 1}
              </div>
              <div className="h-full border border-white/20 p-8 pt-12 bg-black/40 hover:bg-white/5 transition-all duration-300 group">
                <s.icon className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-light text-white mb-4">{s.title}</h3>
                <p className="text-white/70 leading-relaxed">{s.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- 3b. Missed call cost calculator ---------- */

const PRICE_PER_MONTH = 199;
const WEEKS_PER_MONTH = 52 / 12;

const gbp = (n: number) =>
  '£' + Math.round(n).toLocaleString('en-GB', { maximumFractionDigits: 0 });

/** Eases a number towards its target so totals glide rather than jump. */
const useTweened = (target: number, ms = 450) => {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const begin = from.current;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = begin + (target - begin) * eased;
      from.current = v;
      setValue(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
};

const clampNum = (v: string, max: number) => {
  const n = parseFloat(v);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(n, max);
};

const CalcInput: React.FC<{
  id: string;
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  max: number;
  sliderMax: number;
  step: number;
  prefix?: string;
  ariaLabel?: string;
}> = ({ id, label, hint, value, onChange, max, sliderMax, step, prefix, ariaLabel }) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-xs tracking-[0.25em] text-white/70 mb-1 uppercase">
        {label}
      </label>
    )}
    <p className="text-sm text-white/45 mb-3">{hint}</p>
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={0}
        max={sliderMax}
        step={step}
        value={Math.min(value, sliderMax)}
        onChange={(e) => onChange(clampNum(e.target.value, max))}
        aria-label={label || ariaLabel}
        className="flex-1 accent-emerald-500 cursor-pointer"
      />
      <div className="relative w-32 shrink-0">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50">{prefix}</span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(clampNum(e.target.value, max))}
          className={`w-full bg-black/50 border border-white/20 rounded py-3 pr-3 text-white text-right focus:border-emerald-500/60 focus:outline-none transition-colors ${
            prefix ? 'pl-7' : 'pl-3'
          }`}
        />
      </div>
    </div>
  </div>
);

const LossCalculator = () => {
  const { openAgentCall } = useAgentCall();
  const [callValue, setCallValue] = useState(250);
  const [calls, setCalls] = useState(5);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const perWeekCalls = period === 'week' ? calls : calls / WEEKS_PER_MONTH;
  const weekly = perWeekCalls * callValue;
  const monthly = weekly * WEEKS_PER_MONTH;
  const yearly = weekly * 52;

  const shownMonthly = useTweened(monthly);
  const shownWeekly = useTweened(weekly);
  const shownYearly = useTweened(yearly);

  const breakEven = callValue > 0 ? Math.ceil(PRICE_PER_MONTH / callValue) : null;
  const barMax = Math.max(monthly, PRICE_PER_MONTH, 1);

  const switchPeriod = (p: 'week' | 'month') => {
    if (p === period) return;
    // keep the same real-world rate when switching units
    setCalls(Math.round(p === 'month' ? calls * WEEKS_PER_MONTH : calls / WEEKS_PER_MONTH));
    setPeriod(p);
  };

  return (
    <section
      id="calculator"
      className="relative z-10 py-20 px-6 md:px-8 bg-gradient-to-br from-purple-900/10 via-black to-emerald-900/10"
    >
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <div className="text-xs tracking-[0.4em] text-emerald-400/80 mb-5">MISSED CALL COST CALCULATOR</div>
          <h2 className={sectionHeading}>What are missed calls costing you?</h2>
          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
            Put in what one missed call is worth to you and how many you miss. It works out what walks to
            your competitors.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid lg:grid-cols-2 gap-0 border border-emerald-500/30 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900/20 via-black/60 to-emerald-900/20 shadow-[0_0_40px_rgba(16,185,129,0.12)]">
            {/* inputs */}
            <div className="p-7 md:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-emerald-500/20">
              <CalcInput
                id="calc-value"
                label="Value of one missed call"
                hint="The average job you’d win from a call that you answer."
                value={callValue}
                onChange={setCallValue}
                max={1000000}
                sliderMax={5000}
                step={10}
                prefix="£"
              />

              <div>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <label htmlFor="calc-calls" className="text-xs tracking-[0.25em] text-white/70 uppercase">Missed calls</label>
                  <div role="group" aria-label="Count calls per" className="flex rounded border border-white/20 p-0.5 text-xs tracking-wider">
                    {(['week', 'month'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => switchPeriod(p)}
                        aria-pressed={period === p}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors ${
                          period === p ? 'bg-emerald-500/30 text-white' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        PER {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <CalcInput
                  id="calc-calls"
                  label=""
                  ariaLabel={`Missed calls per ${period}`}
                  hint={`Roughly how many calls you don’t pick up each ${period}.`}
                  value={calls}
                  onChange={(n) => setCalls(Math.round(n))}
                  max={10000}
                  sliderMax={period === 'week' ? 60 : 250}
                  step={1}
                />
              </div>
            </div>

            {/* results */}
            <div className="p-7 md:p-10 flex flex-col" aria-live="polite">
              <div className="text-xs tracking-[0.3em] text-white/60 mb-3">YOU COULD BE LOSING</div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="pm-shimmer-text text-5xl md:text-6xl font-light tabular-nums">
                  {gbp(shownMonthly)}
                </span>
                <span className="text-white/60 tracking-wider">a month</span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="border border-white/15 rounded p-4">
                  <div className="text-xs tracking-[0.25em] text-white/50 mb-1">PER WEEK</div>
                  <div className="text-2xl font-light tabular-nums">{gbp(shownWeekly)}</div>
                </div>
                <div className="border border-white/15 rounded p-4">
                  <div className="text-xs tracking-[0.25em] text-white/50 mb-1">PER YEAR</div>
                  <div className="text-2xl font-light tabular-nums">{gbp(shownYearly)}</div>
                </div>
              </div>

              {/* loss vs price */}
              <div className="mt-8 space-y-3">
                <div>
                  <div className="flex justify-between text-xs tracking-wider text-white/60 mb-1.5">
                    <span>Missed calls, per month</span>
                    <span className="tabular-nums">{gbp(monthly)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-400/70 to-red-300/90 transition-all duration-500"
                      style={{ width: `${(monthly / barMax) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs tracking-wider text-white/60 mb-1.5">
                    <span>Pulsemint, per month</span>
                    <span>{gbp(PRICE_PER_MONTH)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-500"
                      style={{ width: `${(PRICE_PER_MONTH / barMax) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm text-white/65 leading-relaxed">
                {breakEven !== null ? (
                  <>
                    At {gbp(callValue)} a call, Pulsemint pays for itself if it catches{' '}
                    <span className="text-emerald-300">
                      {breakEven} {breakEven === 1 ? 'call' : 'calls'} a month
                    </span>{' '}
                    you’d otherwise have lost. The first 14 days are free.
                  </>
                ) : (
                  'Enter what one call is worth to you to see your figures.'
                )}
              </p>

              <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-3">
                <a href={BOOK_CALL_URL} {...ext} className={`${primaryBtn} px-6`}>
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-white/20 to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    START THE FREE PILOT
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
                <button type="button" onClick={openAgentCall} className={`${secondaryBtn} px-6`}>
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  HEAR IT FIRST
                </button>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mt-4 text-center text-xs text-white/40">
          An estimate from the figures you enter. A month is counted as 52 ÷ 12 weeks.
        </p>
      </div>
    </section>
  );
};

/* ---------- 4. Pricing / pilot ---------- */

const pilotTerms = [
  {
    label: 'The pilot',
    body: '14 days, free. I set everything up for you, so it takes about ten minutes of your time.',
  },
  {
    label: 'After that',
    body: '£199 a month if you want to keep it, with up to 50 captured calls included. Cancel any time, no contract.',
  },
  {
    label: 'Your number',
    body: 'You keep your current number. Unanswered calls are passed on from it.',
  },
  {
    label: 'If it breaks',
    body: 'Calls ring straight to your mobile, as they did before. You never end up worse off.',
  },
];

const Pricing = () => (
  <section className="relative z-10 py-20 px-6 md:px-8 bg-gradient-to-br from-purple-900/10 via-black to-emerald-900/10">
    <div className="max-w-6xl mx-auto">
      <Reveal className="text-center mb-14">
        <h2 className={sectionHeading}>
          A two-week pilot, then <span className="text-emerald-400">£199</span> a month
        </h2>
      </Reveal>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 items-stretch">
        <Reveal>
          <div className="h-full border border-white/20 bg-black/40 p-8">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-sm tracking-[0.3em] text-white/80 mb-4">WHAT IT DOESN’T DO</h3>
            <p className="text-white/70 leading-relaxed">
              It doesn’t replace you, quote for work, book dates or negotiate. It only steps in when you
              can’t answer, and it doesn’t use voice recognition to identify callers.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {pilotTerms.map((t, i) => (
            <Reveal key={t.label} delay={i * 90}>
              <div className="h-full border border-emerald-500/30 p-7 bg-gradient-to-br from-emerald-900/20 via-black/50 to-emerald-900/20 hover:from-emerald-900/30 hover:to-emerald-900/30 transition-all duration-300">
                <div className="text-xs tracking-[0.3em] text-emerald-400 mb-3 uppercase">{t.label}</div>
                <p className="text-white/80 leading-relaxed">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ---------- 5. Who's behind this ---------- */

const Founder = () => (
  <section className="relative z-10 py-20 px-6 md:px-8 bg-gradient-to-br from-emerald-900/10 via-black to-purple-900/10">
    <div className="max-w-5xl mx-auto grid md:grid-cols-[minmax(0,320px)_1fr] gap-12 items-center">
      <Reveal>
        <div className="relative mx-auto w-64 md:w-full max-w-[320px]">
          <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-emerald-500/40 via-white/10 to-emerald-500/30 blur-xl" />
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-400 via-white/60 to-emerald-500">
            <img
              src={shadmanPhoto}
              alt="Shadman, founder of Pulsemint"
              loading="lazy"
              className="block w-full aspect-[4/5] object-cover rounded-2xl"
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="text-xs tracking-[0.4em] text-emerald-400/80 mb-5">WHO’S BEHIND THIS</div>
        <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed">
          I’m Shadman, based in Lowestoft, UK. I build and run Pulsemint myself; feel free to contact me
          with any enquiry. You deal with me directly, not a call centre.
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm text-white/50 tracking-wider">
          <MapPin className="w-4 h-4 text-emerald-400" /> Lowestoft, UK
        </div>
        <p className="mt-8 text-white/70">
          Want to speak to a person first? Email at{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 underline decoration-emerald-500/40 underline-offset-4"
          >
            <Mail className="w-4 h-4" />
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Reveal>
    </div>
  </section>
);

/* ---------- 6. FAQ ---------- */

const faqs = [
  ['Will callers know it’s an AI?', 'If they ask, yes. It doesn’t open the call by announcing it, but if a caller asks whether they’re speaking to an AI, it answers truthfully: yes, it is.'],
  [
    'What happens to the call details?',
    'They’re sent to you. Callers are told the call may be recorded, and I’ll give you a short data-protection note for your records.',
  ],
  ['Is there a charge per call?', 'No. The monthly price covers it, up to the limit above.'],
  [
    'What if I don’t like it?',
    'Tell me and I’ll switch it off. The pilot is free, so you’ve lost nothing but ten minutes of setup.',
  ],
  [
    'Why should I trust someone I haven’t met?',
    'Fair question. Call the demo line, check my name and town above, and ask me anything. The pilot is free, so you can judge it on results.',
  ],
];

const Faq = () => (
  <section className="relative z-10 py-20 px-6 md:px-8 bg-gradient-to-br from-purple-900/10 via-black to-emerald-900/10">
    <div className="max-w-3xl mx-auto">
      <Reveal>
        <h2 className={`${sectionHeading} text-center mb-14`}>Questions you’re probably asking</h2>
      </Reveal>
      <Reveal delay={100}>
        <AccordionPrimitive.Root type="single" collapsible className="border-t border-white/15">
          {faqs.map(([q, a], i) => (
            <AccordionPrimitive.Item key={q} value={`faq-${i}`} className="border-b border-white/15">
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-6 py-6 text-left text-lg font-light text-white hover:text-emerald-300 transition-colors">
                  {q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 transition-transform duration-300 group-data-[state=open]:rotate-45">
                    <Plus className="h-4 w-4 text-emerald-400" />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="pb-6 pr-14 text-white/70 leading-relaxed">{a}</p>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </Reveal>
    </div>
  </section>
);

/* ---------- 7. Closing CTA ---------- */

export const ClosingCta = () => (
  <section className="relative z-10 py-20 px-6 md:px-8 bg-gradient-to-br from-emerald-900/10 via-black to-purple-900/10">
    <Reveal className="max-w-4xl mx-auto text-center">
      <h2 className={`${sectionHeading} mb-10`}>
        Run it for 14 days. Keep it only if it catches jobs you’d have lost.
      </h2>
      <a href={BOOK_CALL_URL} {...ext} className={`${primaryBtn} text-lg px-12 py-6 from-emerald-500/30 to-emerald-400/30`}>
        <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-white/20 to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 flex items-center gap-3">
          START THE FREE PILOT
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </a>
    </Reveal>
  </section>
);

const MissedCallSections = () => (
  <>
    <MissedCallsIntro />
    <HearIt />
    <HowItWorks />
    <LossCalculator />
    <Pricing />
    <Founder />
    <Faq />
  </>
);

export default MissedCallSections;
