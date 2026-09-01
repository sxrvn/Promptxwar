import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

const NAV_LINKS = [
  { to: '/phases',  label: 'The Two Phases'       },
  { to: '/dates',   label: 'State-wise Schedule'   },
  { to: '/wizard',  label: 'Self-Enumeration Guide' },
  { to: '/privacy', label: 'Privacy & Trust'        },
  { to: '/data',    label: 'Data Explorer'          },
];

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t-4 border-gray-900 bg-white" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">

          {/* Brand / description */}
          <div>
            <p className="font-bold text-lg uppercase tracking-wider text-gray-900 mb-2 display-text">
              Census 2027
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              India's first fully digital national census. AI-powered guidance
              available in 5 Indian languages — English, Hindi, Marathi, Tamil,
              and Bengali.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <p className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-3">
              Quick Links
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-700 hover:text-[var(--color-teal)] transition-colors focus:outline-none focus:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal / data disclaimer */}
          <div>
            <p className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-3">
              Legal & Data Notice
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-2">
              ⚠️ {t('disclaimer')}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              All census data, state schedules, and statistics displayed are
              <strong> illustrative sample data</strong> for demonstration purposes
              only. They do not represent official Census of India figures.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Individual responses are protected under the{' '}
              <strong>Census Act, 1948</strong>. No PII is collected or stored
              by this application.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-gray-500">
          <p>
            © {year} Census 2027 Demo — Built for the Digital Enumeration Hackathon Challenge.
          </p>
          <p className="flex items-center gap-1.5">
            <span aria-hidden="true">🤖</span>
            Powered by{' '}
            <a
              href="https://deepmind.google/technologies/gemini/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--color-teal)] hover:underline focus:outline-none focus:underline"
            >
              Google Gemini
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
