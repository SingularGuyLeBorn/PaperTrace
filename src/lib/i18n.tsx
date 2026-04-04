"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

export type Lang = "en" | "zh";

interface I18nContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (en: string, zh: string) => string;
  mounted: boolean; // true once language has been resolved from localStorage
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (en) => en,
  mounted: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always start with "en" to match server-rendered HTML (no hydration mismatch).
  // useEffect runs after hydration and switches to the saved language.
  const [lang, setLang] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("papertrace-lang") as Lang | null;
      if (saved === "zh") setLang("zh");
    } catch {}
    setMounted(true); // language resolved — safe to show page
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "zh" : "en";
      localStorage.setItem("papertrace-lang", next);
      // Keep the attribute in sync so subsequent getInitialLang() calls are correct
      document.documentElement.setAttribute("data-lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (en: string, zh: string) => (lang === "en" ? en : zh),
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t, mounted }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLang() {
  return useContext(I18nContext);
}
