"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

type DLLMType = "discrete" | "continuous" | "multimodal";

interface DLLMEntry {
  name: string;
  period: string; // e.g. "2021", "2024-01", "2025-01-03" (for month ranges)
  yearKey: string; // for column grouping: "2021","2022","2023","2024","2025a","2025b","2025c"
  type: DLLMType;
  org?: string;
  arxiv?: string;
  deepdive?: string; // internal slug
  notable?: boolean;
}

const entries: DLLMEntry[] = [
  // ── 2021 ──
  { name: "D3PM", period: "2021-07", yearKey: "2021", type: "continuous", org: "Google", arxiv: "2107.03006", notable: true },
  { name: "GENIE", period: "2021-10", yearKey: "2021", type: "continuous", org: "Microsoft" },
  { name: "DiffuSeq", period: "2021-10", yearKey: "2021", type: "continuous", org: "Multiple", arxiv: "2210.08933" },
  { name: "Diffusion-LM", period: "2021-11", yearKey: "2021", type: "continuous", org: "Stanford", arxiv: "2205.14217" },

  // ── 2022 ──
  { name: "SSD-LM", period: "2022-01", yearKey: "2022", type: "continuous", org: "Multiple" },
  { name: "CDCD", period: "2022-11", yearKey: "2022", type: "continuous", org: "Cornell", arxiv: "2211.15089" },
  { name: "DiffusionBERT", period: "2022-11", yearKey: "2022", type: "discrete", org: "Tsinghua", arxiv: "2211.15029" },
  { name: "LD4LG", period: "2022-12", yearKey: "2022", type: "continuous", org: "Tsinghua", arxiv: "2212.09462" },
  { name: "SeqDiffuSeq", period: "2022-12", yearKey: "2022", type: "continuous", org: "Alibaba", arxiv: "2212.10325" },

  // ── 2023 ──
  { name: "Plaid", period: "2023-06", yearKey: "2023", type: "discrete", org: "NYU", arxiv: "2306.00320" },
  { name: "AR-Diffusion", period: "2023-05", yearKey: "2023", type: "discrete", org: "MSRA", arxiv: "2305.09515" },
  { name: "SEDD", period: "2023-10", yearKey: "2023", type: "discrete", org: "Stanford", arxiv: "2310.16834", notable: true },
  { name: "RDM", period: "2023-11", yearKey: "2023", type: "discrete", org: "Multiple" },
  { name: "TESS", period: "2023-12", yearKey: "2023", type: "discrete", org: "Multiple" },

  // ── 2024 ──
  { name: "AR2Diff", period: "2024-01", yearKey: "2024", type: "discrete", org: "Google" },
  { name: "MD4", period: "2024-06", yearKey: "2024", type: "discrete", org: "Google DeepMind", arxiv: "2406.04329", notable: true },
  { name: "RADD", period: "2024-06", yearKey: "2024", type: "discrete", org: "CMU", arxiv: "2406.00555" },
  { name: "MDLM", period: "2024-06", yearKey: "2024", type: "discrete", org: "NYU/Princeton", arxiv: "2406.07524", deepdive: "mdlm", notable: true },
  { name: "DFM", period: "2024-07", yearKey: "2024", type: "discrete", org: "Meta", arxiv: "2407.15595" },
  { name: "DDPD", period: "2024-10", yearKey: "2024", type: "discrete", org: "MIT" },
  { name: "EDLM", period: "2024-11", yearKey: "2024", type: "continuous", org: "NVIDIA" },
  { name: "DiffuLLaMA", period: "2024-10", yearKey: "2024", type: "discrete", org: "Multiple" },
  { name: "SDTT", period: "2024-12", yearKey: "2024", type: "discrete", org: "EPFL" },
  { name: "MGDM", period: "2024-12", yearKey: "2024", type: "discrete", org: "Multiple" },

  // ── 2025 Q1 (months 1–3) ──
  { name: "LLaDA", period: "2025-02", yearKey: "2025a", type: "discrete", org: "Renmin U", arxiv: "2502.09992", deepdive: "llada", notable: true },
  { name: "Dream", period: "2025-02", yearKey: "2025a", type: "discrete", org: "Multiple", arxiv: "2502.09948" },
  { name: "BD3-LM", period: "2025-02", yearKey: "2025a", type: "discrete", org: "Multiple" },
  { name: "TESS2", period: "2025-01", yearKey: "2025a", type: "discrete", org: "Multiple" },
  { name: "Block Diffusion", period: "2025-03", yearKey: "2025a", type: "discrete", org: "Cornell", arxiv: "2503.09573", deepdive: "block-diffusion", notable: true },
  { name: "Fast-dLLM", period: "2025-03", yearKey: "2025a", type: "discrete", org: "Multiple", arxiv: "2505.22618", deepdive: "fast-dllm", notable: true },
  { name: "CaDDi", period: "2025-02", yearKey: "2025a", type: "multimodal", org: "Multiple" },
  { name: "Mercury", period: "2025-02", yearKey: "2025a", type: "multimodal", org: "Multiple" },
  { name: "UniDisc", period: "2025-01", yearKey: "2025a", type: "multimodal", org: "Multiple" },

  // ── 2025 Q2 (months 4–6) ──
  { name: "LLaDA 1.5", period: "2025-04", yearKey: "2025b", type: "discrete", org: "Renmin U", notable: true },
  { name: "Gemini Diffusion", period: "2025-04", yearKey: "2025b", type: "continuous", org: "Google", notable: true },
  { name: "d1", period: "2025-05", yearKey: "2025b", type: "multimodal", org: "Apple" },
  { name: "TCSM", period: "2025-05", yearKey: "2025b", type: "multimodal", org: "Multiple" },
  { name: "FUDOKI", period: "2025-05", yearKey: "2025b", type: "multimodal", org: "Multiple" },
  { name: "LLaDA-V", period: "2025-04", yearKey: "2025b", type: "multimodal", org: "Renmin U" },
  { name: "LaViDa", period: "2025-05", yearKey: "2025b", type: "multimodal", org: "Multiple" },
  { name: "Dimple", period: "2025-04", yearKey: "2025b", type: "multimodal", org: "Multiple" },
  { name: "ADLM", period: "2025-05", yearKey: "2025b", type: "multimodal", org: "Multiple" },

  // ── 2025 H2 (months 6+) ──
  { name: "MMaDA", period: "2025-06", yearKey: "2025c", type: "multimodal", org: "HKU", arxiv: "2505.15809" },
  { name: "Muddit", period: "2025-06", yearKey: "2025c", type: "multimodal", org: "ETH Zurich", arxiv: "2504.08322" },
  { name: "LongLLaDA", period: "2025-06", yearKey: "2025c", type: "discrete", org: "Multiple" },
  { name: "DiffuCoder", period: "2025-06", yearKey: "2025c", type: "multimodal", org: "Apple" },
  { name: "Lumina-DiMOO", period: "2025-06", yearKey: "2025c", type: "multimodal", org: "Multiple" },
  { name: "LLaDA-MoE", period: "2025-06", yearKey: "2025c", type: "discrete", org: "Multiple" },
  { name: "LaViDa-O", period: "2025-06", yearKey: "2025c", type: "multimodal", org: "Multiple" },
  { name: "TiDAR", period: "2025-06", yearKey: "2025c", type: "multimodal", org: "NVIDIA" },
  { name: "PG-DDM", period: "2025-06", yearKey: "2025c", type: "continuous", org: "Multiple" },
  { name: "wd1", period: "2025-06", yearKey: "2025c", type: "discrete", org: "Multiple" },
  { name: "Duo", period: "2025-06", yearKey: "2025c", type: "multimodal", org: "Apple" },
];

const YEAR_COLS = [
  { key: "2021", label: "2021", sublabel: "" },
  { key: "2022", label: "2022", sublabel: "" },
  { key: "2023", label: "2023", sublabel: "" },
  { key: "2024", label: "2024", sublabel: "" },
  { key: "2025a", label: "2025", sublabel: "Jan–Mar" },
  { key: "2025b", label: "2025", sublabel: "Apr–Jun" },
  { key: "2025c", label: "2025", sublabel: "Jul+" },
];

const TYPE_META: Record<DLLMType, { label: string; labelZh: string; bg: string; badge: string; dot: string }> = {
  discrete:   { label: "Discrete",   labelZh: "离散空间",   bg: "bg-teal-50",   badge: "bg-teal-100 text-teal-800 border border-teal-200",   dot: "bg-teal-500" },
  continuous: { label: "Continuous", labelZh: "连续空间", bg: "bg-amber-50",  badge: "bg-amber-100 text-amber-800 border border-amber-200",  dot: "bg-amber-500" },
  multimodal: { label: "Multimodal", labelZh: "多模态",   bg: "bg-rose-50",   badge: "bg-rose-100 text-rose-800 border border-rose-200",     dot: "bg-rose-500" },
};

const TYPES: DLLMType[] = ["discrete", "continuous", "multimodal"];

export function DLLMTimeline() {
  const { t, lang } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";
  const [activeType, setActiveType] = useState<DLLMType | null>(null);
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);

  const byYearAndType = (yearKey: string, type: DLLMType) =>
    entries.filter(
      (e) =>
        e.yearKey === yearKey &&
        e.type === type &&
        (activeType === null || activeType === type)
    );

  const renderChip = (e: DLLMEntry) => {
    const meta = TYPE_META[e.type];
    const isHovered = hoveredEntry === e.name;
    return (
      <div
        key={e.name}
        className="relative group"
        onMouseEnter={() => setHoveredEntry(e.name)}
        onMouseLeave={() => setHoveredEntry(null)}
      >
        {e.deepdive ? (
          <a
            href={`${basePath}/papers/${e.deepdive}`}
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium transition-all cursor-pointer ${meta.badge} ${e.notable ? "font-bold" : ""} hover:opacity-80`}
          >
            {e.notable && <span className="text-current">★</span>}
            {e.name}
          </a>
        ) : e.arxiv ? (
          <a
            href={`https://arxiv.org/abs/${e.arxiv}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium transition-all cursor-pointer ${meta.badge} ${e.notable ? "font-bold" : ""} hover:opacity-80`}
          >
            {e.notable && <span className="text-current">★</span>}
            {e.name}
          </a>
        ) : (
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${meta.badge} ${e.notable ? "font-bold" : ""}`}>
            {e.notable && <span>★</span>}
            {e.name}
          </span>
        )}
        {/* Tooltip */}
        {isHovered && e.org && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 whitespace-nowrap bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none">
            {e.org}{e.period ? ` · ${e.period.slice(0, 7)}` : ""}
            {e.deepdive && ` · ★ ${lang === "en" ? "Deep-dive" : "精读"}`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-paper-200 rounded-xl p-5">
      {/* Legend + filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="text-xs font-semibold text-paper-800/50 uppercase tracking-wider">
          {t("Type", "类型")}:
        </span>
        {TYPES.map((type) => {
          const meta = TYPE_META[type];
          return (
            <button
              key={type}
              onClick={() => setActiveType((prev) => prev === type ? null : type)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium transition-all border ${
                activeType === null || activeType === type
                  ? meta.badge
                  : "bg-gray-50 text-gray-400 border-gray-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
              {lang === "en" ? meta.label : meta.labelZh}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-paper-800/40">
          ★ {t("= PaperTrace deep-dive", "= PaperTrace 有精读")} · {t("hover for details", "悬停查看详情")}
        </span>
      </div>

      {/* Swimlane grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px]">
          {/* Year headers */}
          <div className="grid mb-2" style={{ gridTemplateColumns: `80px repeat(${YEAR_COLS.length}, 1fr)` }}>
            <div /> {/* row label space */}
            {YEAR_COLS.map((col) => (
              <div key={col.key} className="text-center">
                <span className="text-sm font-bold text-paper-800/70">{col.label}</span>
                {col.sublabel && (
                  <div className="text-xs text-paper-800/40">{col.sublabel}</div>
                )}
              </div>
            ))}
          </div>

          {/* Year-divider line */}
          <div className="grid mb-3 items-center" style={{ gridTemplateColumns: `80px repeat(${YEAR_COLS.length}, 1fr)` }}>
            <div />
            {YEAR_COLS.map((col) => (
              <div key={col.key} className="border-l border-paper-200 h-3 mx-auto" />
            ))}
          </div>

          {/* Swimlanes */}
          {TYPES.map((type) => {
            const meta = TYPE_META[type];
            const isActive = activeType === null || activeType === type;
            return (
              <div
                key={type}
                className={`grid mb-2 rounded-lg transition-opacity ${isActive ? "opacity-100" : "opacity-25"}`}
                style={{ gridTemplateColumns: `80px repeat(${YEAR_COLS.length}, 1fr)` }}
              >
                {/* Row label */}
                <div className={`flex items-center justify-center rounded-l-lg px-2 py-2 ${meta.bg}`}>
                  <span
                    className="text-xs font-bold writing-mode-vertical rotate-180"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    {lang === "en" ? meta.label : meta.labelZh}
                  </span>
                </div>

                {/* Cells per year */}
                {YEAR_COLS.map((col, ci) => {
                  const cellEntries = byYearAndType(col.key, type);
                  return (
                    <div
                      key={col.key}
                      className={`${meta.bg} ${ci === YEAR_COLS.length - 1 ? "rounded-r-lg" : ""} border-l border-white/60 px-2 py-3 min-h-[80px]`}
                    >
                      <div className="flex flex-wrap gap-1">
                        {cellEntries.map((e) => renderChip(e))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Timeline arrow */}
          <div className="grid mt-2" style={{ gridTemplateColumns: `80px 1fr` }}>
            <div />
            <div className="flex items-center gap-0">
              <div className="flex-1 h-0.5 bg-paper-300" />
              <div className="text-paper-400 text-sm">→</div>
            </div>
          </div>
        </div>
      </div>

      {/* Insight */}
      <p className="text-xs text-paper-800/40 mt-4 italic leading-relaxed">
        {t(
          "Early research (2021–22) focused on continuous-space models. Discrete models dominated 2023–24. Multimodal DLMs are now the fastest-growing frontier (2025).",
          "早期研究（2021–22）以连续空间模型为主。离散模型主导了 2023–24 年。多模态 DLLM 是当前增长最快的前沿方向（2025）。"
        )}
      </p>
    </div>
  );
}
