import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { useEffect, useState } from 'react';

// First state opens on Jan 5, 2027 (Uttar Pradesh & Delhi)
const CENSUS_OPEN = new Date('2027-01-05T00:00:00+05:30').getTime();

function useCountdown(target: number) {
  const [remaining, setRemaining] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const total = Math.max(0, remaining);
  const days   = Math.floor(total / 86_400_000);
  const hours  = Math.floor((total % 86_400_000) / 3_600_000);
  const mins   = Math.floor((total % 3_600_000)  / 60_000);
  const secs   = Math.floor((total % 60_000)     / 1_000);
  return { days, hours, mins, secs, open: total === 0 };
}

export default function Home() {
  const { t } = useLang();
  const { days, hours, mins, secs, open } = useCountdown(CENSUS_OPEN);

  return (
    <div className="flex flex-col gap-12 mt-4">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b-4 border-gray-900 pb-12 mb-4">
        <div className="max-w-4xl">
          <p className="font-semibold tracking-widest uppercase mb-4 text-[#115E59]">Official Notice</p>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight display-text">
            {t('appTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl leading-relaxed">
            {t('tagline')}
          </p>

          {/* Countdown */}
          {open ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border-2 border-green-600 text-green-800 font-bold mb-8 text-sm tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" aria-hidden="true" />
              Self-enumeration is now open
            </div>
          ) : (
            <div className="mb-8" aria-label="Countdown to census opening">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
                Self-enumeration opens in
              </p>
              <div className="flex gap-3 flex-wrap" role="timer" aria-live="off">
                {[{ v: days, l: 'Days' }, { v: hours, l: 'Hrs' }, { v: mins, l: 'Min' }, { v: secs, l: 'Sec' }].map(
                  ({ v, l }) => (
                    <div key={l} className="flex flex-col items-center min-w-[4rem] border-2 border-gray-900 bg-white">
                      <span className="text-3xl md:text-4xl font-bold font-mono py-2 px-3 tabular-nums text-[#115E59]">
                        {String(v).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-widest bg-gray-900 text-white w-full text-center py-1">
                        {l}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              to="/wizard"
              className="px-8 py-4 bg-[#115E59] text-white font-bold hover:bg-gray-900 transition-colors focus:outline-none focus:ring-4 focus:ring-amber-400"
            >
              {t('heroCta')}
            </Link>
            <Link
              to="/phases"
              className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-4 focus:ring-amber-400"
            >
              {t('learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Key stats strip ──────────────────────────────────────────────── */}
      <section aria-label="Key census statistics" className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t-2 border-l-2 border-gray-900 mb-2">
        {[
          { value: '1.47B', label: 'Projected Population' },
          { value: '35',    label: 'States & UTs Covered' },
          { value: '5',     label: 'Indian Languages' },
          { value: '100%',  label: 'Digital for the First Time' },
        ].map(({ value, label }) => (
          <div key={label} className="border-r-2 border-b-2 border-gray-900 p-6 bg-white">
            <p className="text-3xl md:text-4xl font-bold text-[#115E59] display-text mb-1">{value}</p>
            <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </section>

      {/* ── Feature grid ─────────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-t-2 border-l-2 border-gray-900">
        <FeatureCard
          icon="🏠"
          title="Two-Phase Process"
          desc="Understand exactly what House Listing and Population Enumeration each collect."
          to="/phases"
        />
        <FeatureCard
          icon="📅"
          title="State-wise Schedule"
          desc="Check self-enumeration and survey windows for every state and UT — with live status badges."
          to="/dates"
        />
        <FeatureCard
          icon="🤖"
          title="AI Enumeration Guide"
          desc="A Gemini-powered assistant walks you through self-enumeration step by step."
          to="/wizard"
        />
        <FeatureCard
          icon="🛡️"
          title="Privacy & Myth-Busting"
          desc="Clear answers on data confidentiality and common misinformation."
          to="/privacy"
        />
        <FeatureCard
          icon="📊"
          title="Data Explorer"
          desc="Visualize population, literacy, and demographic trends — click any state to drill down."
          to="/data"
        />
        <FeatureCard
          icon="🌐"
          title="5 Indian Languages"
          desc="Use the app in English, Hindi, Marathi, Tamil, or Bengali — switch anytime."
          to="/phases"
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, to }: { icon: string; title: string; desc: string; to: string }) {
  return (
    <Link
      to={to}
      className="block p-8 border-r-2 border-b-2 border-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:bg-amber-50 focus:ring-inset focus:ring-4 focus:ring-amber-400 transition-colors group"
    >
      <span className="text-3xl mb-3 block" aria-hidden="true">{icon}</span>
      <h3 className="font-bold text-2xl mb-3 text-gray-900 display-text">{title}</h3>
      <p className="text-gray-700 text-lg leading-relaxed">{desc}</p>
      <div className="mt-6 text-[#115E59] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
        <span>Proceed</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </Link>
  );
}
