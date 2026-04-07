"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";

export default function KnowledgeGraphPage() {
  const { t } = useLang();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-paper-600 dark:text-slate-400 hover:text-paper-900 dark:hover:text-slate-100 transition-colors"
        >
          ← {t("Back to home", "返回首页")}
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 dark:text-slate-50">
          {t("Knowledge Graph", "知识图谱")}
        </h1>
        <p className="text-paper-800/60 dark:text-slate-400 leading-relaxed max-w-2xl">
          {t(
            "Explore connections between papers, research labs, authors, and industry categories. Each node links to its institutional context — from academia to Big Tech to AI Labs.",
            "探索论文、研究机构、作者与行业分类之间的关联。每个节点都连接到其所属的机构背景——从学术界到大科技公司再到 AI 实验室。"
          )}
        </p>
      </div>

      {/* Graph */}
      <KnowledgeGraph />

      {/* Legend */}
      <div className="mt-8 p-5 rounded-xl border border-paper-200 dark:border-slate-700 bg-paper-50 dark:bg-slate-900">
        <h2 className="text-sm font-semibold text-paper-900 dark:text-slate-100 mb-4">
          {t("Legend", "图例")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {/* Node types */}
          <div>
            <p className="text-xs font-medium text-paper-500 dark:text-slate-500 uppercase tracking-wide mb-2">
              {t("Node types", "节点类型")}
            </p>
            <div className="space-y-2">
              <LegendItem
                shape="circle"
                color="#3b82f6"
                label={t("Paper (circle) — click to open deep-dive", "论文（圆形）— 点击打开精读页")}
              />
              <LegendItem
                shape="diamond"
                color="#64748b"
                label={t("Research Lab (diamond)", "研究机构（菱形）")}
              />
              <LegendItem
                shape="circle"
                color="#f59e0b"
                label={t("Author (small circle)", "作者（小圆形）")}
              />
              <LegendItem
                shape="pill"
                color="#6366f1"
                label={t("Industry category (pill)", "行业分类（胶囊形）")}
              />
            </div>
          </div>

          {/* Paper categories */}
          <div>
            <p className="text-xs font-medium text-paper-500 dark:text-slate-500 uppercase tracking-wide mb-2">
              {t("Paper categories", "论文分类")}
            </p>
            <div className="space-y-2">
              <LegendItem shape="circle" color="#a855f7" label={t("Diffusion LM", "扩散语言模型")} />
              <LegendItem shape="circle" color="#3b82f6" label={t("Transformer / Architecture", "Transformer / 架构")} />
              <LegendItem shape="circle" color="#22c55e" label={t("Reinforcement Learning", "强化学习")} />
              <LegendItem shape="circle" color="#f97316" label={t("Vision", "视觉")} />
              <LegendItem shape="circle" color="#06b6d4" label={t("NLP / Language", "自然语言处理")} />
              <LegendItem shape="circle" color="#eab308" label={t("Efficiency / PEFT", "效率 / 参数高效微调")} />
              <LegendItem shape="circle" color="#ec4899" label={t("Alignment", "对齐")} />
            </div>
          </div>

          {/* Edge types */}
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-paper-500 dark:text-slate-500 uppercase tracking-wide mb-2">
              {t("Edge types", "连边类型")}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <EdgeItem dash={undefined} label={t("Wrote", "撰写")} />
              <EdgeItem dash={undefined} opacity={0.5} label={t("Affiliated", "归属")} />
              <EdgeItem dash="4 3" label={t("Related paper", "相关论文")} />
              <EdgeItem dash="2 4" opacity={0.25} label={t("Industry link", "行业关联")} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-paper-800/30 dark:text-slate-600 mt-6 text-center">
        {t(
          "Graph covers papers available on PaperTrace. Affiliations reflect primary institution at time of publication.",
          "图谱覆盖 PaperTrace 收录的论文，归属关系以发表时的主要机构为准。"
        )}
      </p>
    </div>
  );
}

// ── Legend helpers ────────────────────────────────────────────────────────────
function LegendItem({
  shape,
  color,
  label,
}: {
  shape: "circle" | "diamond" | "pill";
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <svg width={20} height={20} viewBox="-10 -10 20 20">
        {shape === "circle" && (
          <circle r={7} fill={color} fillOpacity={0.9} stroke="white" strokeWidth={1} />
        )}
        {shape === "diamond" && (
          <polygon
            points="0,-8 8,0 0,8 -8,0"
            fill={color}
            fillOpacity={0.85}
            stroke="white"
            strokeWidth={1}
          />
        )}
        {shape === "pill" && (
          <ellipse
            rx={9}
            ry={5}
            fill={color}
            fillOpacity={0.18}
            stroke={color}
            strokeWidth={1.2}
          />
        )}
      </svg>
      <span className="text-xs text-paper-700 dark:text-slate-300">{label}</span>
    </div>
  );
}

function EdgeItem({
  dash,
  opacity = 0.6,
  label,
}: {
  dash?: string;
  opacity?: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <svg width={28} height={10}>
        <line
          x1={0}
          y1={5}
          x2={28}
          y2={5}
          stroke="#94a3b8"
          strokeOpacity={opacity}
          strokeWidth={1.5}
          strokeDasharray={dash}
        />
      </svg>
      <span className="text-xs text-paper-700 dark:text-slate-300">{label}</span>
    </div>
  );
}
