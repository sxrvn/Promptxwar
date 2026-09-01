import { useState } from 'react';
import { mythsFacts } from '../data/mythsFacts';
import { useLang } from '../i18n/LangContext';

export default function Privacy() {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{t('privacyPageTitle')}</h1>
      <p className="text-gray-600 mb-10 max-w-3xl">{t('privacyPageIntro')}</p>

      {/* ── Info cards ─────────────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-3 gap-6 mb-12" aria-label="Privacy guarantees">
        <InfoCard
          icon="🔐"
          title="Legal Confidentiality"
          desc="All individual responses are protected under the Census Act, 1948 and cannot be used as evidence against you in any court or by any agency."
        />
        <InfoCard
          icon="🧮"
          title="Aggregated Publication"
          desc="Only anonymized, aggregated statistics are ever published — never data that identifies an individual or household."
        />
        <InfoCard
          icon="🛡️"
          title="Secure Digital Portal"
          desc="Self-enumeration uses encrypted, authenticated sessions. No OTP, bank detail, or payment is ever requested by census officials."
        />
      </section>

      {/* ── Myth vs. Fact accordion ────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t('mythVsFactTitle')}</h2>
        <div className="space-y-3">
          {mythsFacts.map((mf, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`myth-fact-${i}`}
                className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <span className="font-medium text-red-800">❌ Myth: {mf.myth}</span>
                <span aria-hidden="true" className="text-red-600 text-xl font-bold shrink-0">
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>
              {openIndex === i && (
                <div
                  id={`myth-fact-${i}`}
                  role="region"
                  aria-label={`Fact: ${mf.myth}`}
                  className="px-5 py-4 bg-green-50 text-green-900 text-sm"
                >
                  ✅ <strong>Fact:</strong> {mf.fact}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Scam alert & reporting callout ─────────────────────────────────── */}
      <section aria-labelledby="scam-alert-heading">
        <div className="rounded-xl border-2 border-red-400 bg-red-50 p-6">
          <h2 id="scam-alert-heading" className="font-bold text-xl text-red-800 mb-3 flex items-center gap-2">
            🚨 Spotted a Census Scam?
          </h2>
          <p className="text-red-900 mb-4">
            If you receive an unsolicited SMS, email, or phone call claiming to be from Census 2027 
            and asking for money, OTPs, or Aadhaar details — it is a scam. 
            The official census portal will <strong>never</strong> contact you this way.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              Report on Cybercrime Portal
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </a>
            <a
              href="tel:1930"
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-red-700 text-red-800 font-semibold rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              📞 Helpline: 1930
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white">
      <div className="text-3xl mb-3" aria-hidden="true">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
