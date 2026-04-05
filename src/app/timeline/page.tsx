"use client";

import { useLang } from "@/lib/i18n";
import { InteractiveTimeline } from "@/components/InteractiveTimeline";

export default function TimelinePage() {
  const { t } = useLang();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 dark:text-slate-50">
          {t("AI Model Timeline", "AI 大模型时间线")}
        </h1>
        <p className="text-paper-800/60 dark:text-slate-400 leading-relaxed max-w-2xl">
          {t(
            "Key model releases from Transformer (2017) to today — filterable by category (LLMs, DLLMs, VLMs, Agents) and organization. ★ = PaperTrace deep-dive available. 🔓 = open weights.",
            "从 Transformer (2017) 到今天的重要模型发布 — 可按分类（LLM、DLLM、VLM、Agent）和机构筛选。★ = PaperTrace 有精读页面。🔓 = 开放权重。"
          )}
        </p>
      </div>

      <InteractiveTimeline />

      <p className="text-xs text-paper-800/30 dark:text-slate-600 mt-6 text-center">
        {t(
          "Dates are approximate. Parameters are estimates where not officially confirmed.",
          "日期为近似值。未正式公布的参数为估算值。"
        )}
      </p>
    </div>
  );
}
