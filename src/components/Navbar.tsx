import { NavLink } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { LANGUAGES } from '../i18n/translations';
import { useState } from 'react';

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: t('navHome') },
    { to: '/phases', label: t('navPhases') },
    { to: '/dates', label: t('navDates') },
    { to: '/wizard', label: t('navWizard') },
    { to: '/privacy', label: t('navPrivacy') },
    { to: '/data', label: t('navData') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-gray-900" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-2xl display-text" aria-label="Census 2027 home">
          <span className="w-3 h-8 bg-[#F59E0B] inline-block" aria-hidden="true"></span>
          <span className="w-3 h-8 bg-gray-900 inline-block" aria-hidden="true"></span>
          <span className="w-3 h-8 bg-[#115E59] inline-block" aria-hidden="true"></span>
          <span className="ml-2 uppercase tracking-wide">Census 2027</span>
        </NavLink>

        <button
          className="md:hidden p-2 text-2xl"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        <div className={`${open ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-20 left-0 right-0 bg-white md:bg-transparent border-b-2 md:border-0 border-gray-900 gap-1 md:gap-4 items-start md:items-center p-4 md:p-0`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-4 ${
                  isActive ? 'border-[#115E59] text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-900'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <label className="sr-only" htmlFor="lang-select">Select language</label>
          <select
            id="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as typeof lang)}
            className="ml-0 md:ml-4 mt-4 md:mt-0 border-2 border-gray-900 rounded-none px-3 py-1.5 text-sm font-bold bg-white focus:ring-4 focus:ring-amber-400 focus:outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.native}</option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}
