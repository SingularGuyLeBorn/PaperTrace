"use client";

import { useState, useRef, ReactNode } from "react";
import { useLang } from "@/lib/i18n";

interface TooltipProps {
  children: ReactNode;
  /** EN explanation */
  en: string;
  /** ZH explanation */
  zh: string;
  /** Optional linked paper slug */
  paper?: string;
}

/**
 * Concept tooltip — hover over a term to see a quick explanation.
 * Usage: <Tooltip en="..." zh="...">GRPO</Tooltip>
 */
export function Tooltip({ children, en, zh, paper }: TooltipProps) {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <span className="relative inline-block">
      <span
        ref={ref}
        className="border-b border-dashed border-blue-400 cursor-help text-blue-700 hover:text-blue-900 transition-colors"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        tabIndex={0}
      >
        {children}
      </span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 bg-paper-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none">
          <span className="block leading-relaxed">{t(en, zh)}</span>
          {paper && (
            <span className="block mt-1 text-blue-300">
              → {t("See deep-dive", "查看精读")}:{" "}
              <a
                href={`${basePath}/papers/${paper}`}
                className="underline pointer-events-auto"
              >
                {paper}
              </a>
            </span>
          )}
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-paper-900" />
        </span>
      )}
    </span>
  );
}
