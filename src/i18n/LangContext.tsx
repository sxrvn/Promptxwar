import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Lang, t as translate } from './translations';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Parameters<typeof translate>[0]) => string;
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = window.localStorage.getItem('census-lang');
    return (saved as Lang) || 'en';
  });

  const updateLang = useCallback((l: Lang) => {
    setLang(l);
    window.localStorage.setItem('census-lang', l);
  }, []);

  const t = useCallback((key: Parameters<typeof translate>[0]) => translate(key, lang), [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang: updateLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
