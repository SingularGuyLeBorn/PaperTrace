"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

const CONTEXT_STEPS = [
  { label: "8K", tokens: 8_000 },
  { label: "32K", tokens: 32_000 },
  { label: "128K", tokens: 128_000 },
  { label: "512K", tokens: 512_000 },
  { label: "1M", tokens: 1_000_000 },
];

// Approximate KV cache GB at each context length
// V3: ~0.8 GB/100K tokens (128 heads, 128 dim, fp16)
// V4: V3 * 0.10 (10% KV cache)
function kvCacheGB(tokens: number, model: "v3" | "v4") {
  const base = (tokens / 100_000) * 0.8;
  return model === "v4" ? base * 0.10 : base;
}

export function KVCacheViz() {
  const { t } = useLang();
  const [stepIdx, setStepIdx] = useState(2);

  const step = CONTEXT_STEPS[stepIdx];
  const v3 = kvCacheGB(step.tokens, "v3");
  const v4 = kvCacheGB(step.tokens, "v4");
  const maxGB = kvCacheGB(CONTEXT_STEPS[4].tokens, "v3");

  const barPct = (gb: number) => `${(gb / maxGB) * 100}%`;

  return (
    <div className="border border-paper-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800 my-6">
      <p className="text-sm font-semibold dark:text-slate-100 mb-4">
        {t("KV Cache Size: V3 vs V4-Pro", "KV 缓存大小：V3 vs V4-Pro")}
      </p>

      {/* Slider */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-paper-800/50 dark:text-slate-400 mb-1">
          <span>{t("Context length", "上下文长度")}</span>
          <span className="font-mono font-bold dark:text-slate-200">{step.label} tokens</span>
        </div>
        <input
          type="range"
          min={0}
          max={CONTEXT_STEPS.length - 1}
          value={stepIdx}
          onChange={(e) => setStepIdx(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-paper-800/30 dark:text-slate-600 mt-1">
          {CONTEXT_STEPS.map((s) => <span key={s.label}>{s.label}</span>)}
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-amber-700 dark:text-amber-400">DeepSeek-V3</span>
            <span className="font-mono text-amber-700 dark:text-amber-400">{v3.toFixed(1)} GB</span>
          </div>
          <div className="h-7 bg-paper-100 dark:bg-slate-700 rounded-lg overflow-hidden">
            <div
              className="h-full bg-amber-400 dark:bg-amber-500 rounded-lg transition-all duration-500"
              style={{ width: barPct(v3) }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-green-700 dark:text-green-400">DeepSeek-V4-Pro</span>
            <span className="font-mono text-green-700 dark:text-green-400">{v4.toFixed(2)} GB</span>
          </div>
          <div className="h-7 bg-paper-100 dark:bg-slate-700 rounded-lg overflow-hidden">
            <div
              className="h-full bg-green-400 dark:bg-green-500 rounded-lg transition-all duration-500"
              style={{ width: barPct(v4) }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-500/10 rounded-lg text-xs text-green-800 dark:text-green-300 font-medium">
        {t(
          `At ${step.label} context: V4 saves ${(v3 - v4).toFixed(1)} GB — a ${Math.round(v3/v4)}× reduction`,
          `在 ${step.label} 上下文：V4 节省 ${(v3 - v4).toFixed(1)} GB，减少 ${Math.round(v3/v4)} 倍`
        )}
      </div>

      <p className="text-xs text-paper-800/40 dark:text-slate-500 mt-2">
        {t("Approximate estimates based on reported 10% KV cache ratio (CSA/HCA vs V3 MLA).", "基于报告的 10% KV 缓存比例估算（CSA/HCA vs V3 MLA）。")}
      </p>
    </div>
  );
}
