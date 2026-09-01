import { useLang } from '../i18n/LangContext';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-16 border-t-4 border-gray-900 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm font-semibold text-gray-800">
        <p className="mb-2 tracking-wide uppercase">⚠️ {t('disclaimer')}</p>
        <p className="text-gray-600">Built for a hackathon challenge — Census 2027 & Digital Enumeration.</p>
      </div>
    </footer>
  );
}
