"use client";

import { I18nProvider, useLang } from "@/lib/i18n";
import { ReactNode } from "react";

function Header() {
  const { lang, toggleLang, t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <header className="border-b border-paper-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href={basePath || "/"}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl font-bold tracking-tight">
            Paper<span className="text-blue-600">Trace</span>
          </span>
        </a>
        <nav className="flex items-center gap-3 text-sm">
          <a href={`${basePath}/daily`} className="text-paper-800/60 hover:text-paper-800 transition-colors hidden sm:block">
            {t("Feed", "每日")}
          </a>
          <a href={`${basePath}/timeline`} className="text-paper-800/60 hover:text-paper-800 transition-colors hidden sm:block">
            {t("Timeline", "时间线")}
          </a>
          <a href={`${basePath}/guide`} className="text-paper-800/60 hover:text-paper-800 transition-colors hidden sm:block">
            {t("Guide", "指南")}
          </a>
          <a href={`${basePath}/resources`} className="text-paper-800/60 hover:text-paper-800 transition-colors hidden sm:block">
            {t("Resources", "资源")}
          </a>
          <a href={`${basePath}/interview`} className="text-paper-800/60 hover:text-paper-800 transition-colors hidden sm:block">
            {t("Interview", "八股题")}
          </a>
          <div className="w-px h-4 bg-paper-200 hidden sm:block" />
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-paper-100 hover:bg-paper-200 transition-colors text-paper-800 font-medium"
            title={t("Switch to Chinese", "切换到英文")}
          >
            <span className="text-base">{lang === "en" ? "🇨🇳" : "🇬🇧"}</span>
            <span>{lang === "en" ? "中文" : "EN"}</span>
          </button>
          <a
            href="https://github.com/yourusername/PaperTrace"
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper-800/60 hover:text-paper-800 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-paper-200 mt-20">
      <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-paper-800/50">
        {t(
          "PaperTrace — Interactive deep-dives into ML papers",
          "PaperTrace — ML 论文交互式精读"
        )}
      </div>
    </footer>
  );
}

function LanguageReadyWrapper({ children }: { children: ReactNode }) {
  const { mounted } = useLang();
  return (
    // Keep invisible until language is resolved from localStorage.
    // This prevents the English→Chinese flash. The fade-in takes 120ms
    // so users see the page appear cleanly in the correct language.
    <div
      className="transition-opacity duration-[120ms]"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {children}
    </div>
  );
}

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LanguageReadyWrapper>
        <Header />
        <main>{children}</main>
        <Footer />
      </LanguageReadyWrapper>
    </I18nProvider>
  );
}
