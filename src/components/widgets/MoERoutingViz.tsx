"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

const EXPERTS = 8;
const TOP_K = 2;
const TOKENS = ["The", "model", "routes", "each", "token", "to", "top-K", "experts"];

const EXPERT_LABELS = [
  { en: "Code", zh: "代码" },
  { en: "Math", zh: "数学" },
  { en: "Science", zh: "科学" },
  { en: "Lang", zh: "语言" },
  { en: "Logic", zh: "逻辑" },
  { en: "Fact", zh: "事实" },
  { en: "Style", zh: "风格" },
  { en: "Misc", zh: "杂项" },
];

// Pre-computed routing: which 2 experts each token routes to
const ROUTES: number[][] = [
  [0, 1], [0, 4], [3, 4], [2, 5], [0, 6], [3, 7], [0, 1], [2, 4],
];

const EXPERT_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-amber-500",
  "bg-teal-500", "bg-rose-500", "bg-indigo-500", "bg-orange-500",
];
const EXPERT_LIGHT = [
  "bg-blue-100 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/40",
  "bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/40",
  "bg-green-100 dark:bg-green-500/20 border-green-300 dark:border-green-500/40",
  "bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40",
  "bg-teal-100 dark:bg-teal-500/20 border-teal-300 dark:border-teal-500/40",
  "bg-rose-100 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/40",
  "bg-indigo-100 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/40",
  "bg-orange-100 dark:bg-orange-500/20 border-orange-300 dark:border-orange-500/40",
];

export function MoERoutingViz() {
  const { t } = useLang();
  const [activeToken, setActiveToken] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);

  const activeRoutes = activeToken !== null ? ROUTES[activeToken] : step >= 0 ? ROUTES[step] : [];
  const displayToken = activeToken !== null ? activeToken : step >= 0 ? step : null;

  const handlePlay = () => {
    if (playing) { setPlaying(false); setStep(-1); return; }
    setPlaying(true);
    setActiveToken(null);
    let i = 0;
    const interval = setInterval(() => {
      setStep(i);
      i++;
      if (i >= TOKENS.length) {
        clearInterval(interval);
        setPlaying(false);
        setStep(-1);
      }
    }, 700);
  };

  return (
    <div className="border border-paper-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800 my-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold dark:text-slate-100">
          {t(`MoE Routing: ${EXPERTS} Experts, Top-${TOP_K} Active`, `MoE 路由：${EXPERTS} 个专家，激活 Top-${TOP_K}`)}
        </p>
        <button
          onClick={handlePlay}
          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
            playing
              ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
              : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-500/30"
          }`}
        >
          {playing ? t("Stop", "停止") : t("▶ Animate", "▶ 动画演示")}
        </button>
      </div>

      {/* Tokens */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TOKENS.map((tok, i) => (
          <button
            key={i}
            onClick={() => { setActiveToken(activeToken === i ? null : i); setStep(-1); }}
            className={`px-2.5 py-1 rounded-lg text-sm font-mono transition-all border ${
              displayToken === i
                ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200 scale-105"
                : "bg-paper-100 dark:bg-slate-700 text-paper-800 dark:text-slate-200 border-paper-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
            }`}
          >
            {tok}
          </button>
        ))}
      </div>

      {/* Experts grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {Array.from({ length: EXPERTS }, (_, i) => {
          const active = activeRoutes.includes(i);
          return (
            <div
              key={i}
              className={`rounded-lg p-2.5 border text-center transition-all ${
                active
                  ? `${EXPERT_LIGHT[i]} scale-105 shadow-sm`
                  : "bg-paper-50 dark:bg-slate-900 border-paper-200 dark:border-slate-700 opacity-40"
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 ${active ? EXPERT_COLORS[i] : "bg-paper-300 dark:bg-slate-600"}`} />
              <p className="text-xs font-medium dark:text-slate-200">
                {t(EXPERT_LABELS[i].en, EXPERT_LABELS[i].zh)}
              </p>
              <p className="text-xs text-paper-800/40 dark:text-slate-500">E{i + 1}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-paper-800/50 dark:text-slate-500">
        <span>
          {displayToken !== null
            ? t(`Token "${TOKENS[displayToken]}" → experts E${ROUTES[displayToken][0]+1} + E${ROUTES[displayToken][1]+1}`, `词元"${TOKENS[displayToken]}"→ 专家 E${ROUTES[displayToken][0]+1} + E${ROUTES[displayToken][1]+1}`)
            : t("Click a token or press Animate to see routing", "点击词元或按动画演示查看路由")}
        </span>
        <span className="font-mono">{TOP_K}/{EXPERTS} {t("active", "激活")}</span>
      </div>
    </div>
  );
}
