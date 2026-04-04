"use client";

import { useLang } from "@/lib/i18n";

interface Prereq {
  label: string;
  labelZh: string;
  slug?: string;
}

interface PaperHeaderProps {
  title: string;
  titleZh?: string;
  authors: string;
  venue: string;
  year: number;
  arxiv?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prereqs?: Prereq[];
  tags?: string[];
}

const difficultyConfig = {
  beginner: {
    label: "Beginner-friendly",
    labelZh: "入门友好",
    color: "bg-green-100 text-green-800",
  },
  intermediate: {
    label: "Some ML background needed",
    labelZh: "需要一定 ML 基础",
    color: "bg-amber-100 text-amber-800",
  },
  advanced: {
    label: "Advanced — research-level",
    labelZh: "进阶 — 研究级别",
    color: "bg-red-100 text-red-800",
  },
};

export function PaperHeader({
  title,
  titleZh,
  authors,
  venue,
  year,
  arxiv,
  difficulty,
  prereqs,
  tags,
}: PaperHeaderProps) {
  const { t, lang } = useLang();
  const diff = difficultyConfig[difficulty];
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <header className="mb-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {lang === "en" ? title : titleZh ?? title}
      </h1>
      <p className="text-paper-800/50 mb-3">
        {authors} &middot; {venue} {year}
        {arxiv && (
          <>
            {" "}
            &middot;{" "}
            <a
              href={arxiv}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              arXiv
            </a>
          </>
        )}
      </p>

      <div className="flex flex-wrap gap-2 items-center">
        {/* Difficulty */}
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${diff.color}`}>
          {t(diff.label, diff.labelZh)}
        </span>

        {/* Tags */}
        {tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Prerequisites */}
      {prereqs && prereqs.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-paper-800/50">
          <span>{t("Prereqs:", "前置知识:")}</span>
          {prereqs.map((p, i) => (
            <span key={i}>
              {p.slug ? (
                <a
                  href={`${basePath}/papers/${p.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {lang === "en" ? p.label : p.labelZh}
                </a>
              ) : (
                <span>{lang === "en" ? p.label : p.labelZh}</span>
              )}
              {i < prereqs.length - 1 && " · "}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
