import { useLang } from '../i18n/LangContext';

const phase1Items = [
  'Type and condition of the census house/building',
  'Ownership status (owned, rented, etc.)',
  'Number of dwelling rooms and household members',
  'Source of drinking water and lighting',
  'Sanitation and toilet facilities',
  'Availability of assets (phone, internet, vehicles)',
];

const phase2Items = [
  'Name, relationship to head of household, sex, age',
  'Marital status and religion',
  'Mother tongue and other languages known',
  'Educational attainment and literacy',
  'Occupation and economic activity',
  'Migration details (birthplace, last residence)',
  'Disability status, if any',
];

export default function Phases() {
  const { t } = useLang();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{t('phasesPageTitle')}</h1>
      <p className="text-gray-600 mb-10 max-w-3xl">{t('phasesPageIntro')}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <PhaseCard
          number="1"
          color="orange"
          title={t('phase1Title')}
          subtitle={t('phase1Subtitle')}
          items={phase1Items}
        />
        <PhaseCard
          number="2"
          color="green"
          title={t('phase2Title')}
          subtitle={t('phase2Subtitle')}
          items={phase2Items}
        />
      </div>

      <div className="mt-12 p-6 rounded-xl bg-blue-50 border border-blue-100">
        <h2 className="font-semibold text-lg mb-2">{t('whyTwoPhasesTitle')}</h2>
        <p className="text-gray-700">{t('whyTwoPhasesBody')}</p>
      </div>
    </div>
  );
}

function PhaseCard({
  number,
  color,
  title,
  subtitle,
  items,
}: {
  number: string;
  color: 'orange' | 'green';
  title: string;
  subtitle: string;
  items: string[];
}) {
  const colorClasses = color === 'orange' ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50';
  const badgeClasses = color === 'orange' ? 'bg-orange-500' : 'bg-green-600';

  return (
    <div className={`rounded-xl border p-6 ${colorClasses}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold ${badgeClasses}`} aria-hidden="true">
          {number}
        </span>
        <div>
          <h2 className="font-bold text-lg leading-tight">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
      <ul className="space-y-2 mt-4">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-gray-700 text-sm">
            <span aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
