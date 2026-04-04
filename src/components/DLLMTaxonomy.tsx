"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

const basePath =
  process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

interface DeepDive {
  slug: string;
  label: string;
}

interface SubNode {
  nameEn: string;
  nameZh: string;
  papers: string[];
  // optional sub-groupings inside a node (e.g. "From scratch" / "Adapting …")
  groups?: { labelEn: string; labelZh: string; papers: string[] }[];
}

interface TopNode {
  id: string;
  nameEn: string;
  nameZh: string;
  color: string;        // hex accent color
  colorClass: string;   // tailwind text class
  borderClass: string;  // tailwind border class
  bgClass: string;      // tailwind bg class for header
  children: SubNode[];
}

// ────────────────────────────────────────────────────────────
// Deep-dive registry  (★ papers)
// ────────────────────────────────────────────────────────────

const deepDives: Record<string, DeepDive> = {
  "LLaDA":            { slug: "llada",          label: "LLaDA" },
  "MDLM":             { slug: "mdlm",           label: "MDLM" },
  "Fast-dLLM":        { slug: "fast-dllm",      label: "Fast-dLLM" },
  "Block Diffusion":  { slug: "block-diffusion", label: "Block Diffusion" },
  "LLaDA-8B":         { slug: "llada",          label: "LLaDA" },
};

// ────────────────────────────────────────────────────────────
// Taxonomy data
// ────────────────────────────────────────────────────────────

const taxonomy: TopNode[] = [
  {
    id: "paradigms",
    nameEn: "Paradigms",
    nameZh: "范式",
    color: "#3B82F6",
    colorClass: "text-blue-600",
    borderClass: "border-blue-200",
    bgClass: "bg-blue-50",
    children: [
      {
        nameEn: "Continuous Space Models",
        nameZh: "连续空间模型",
        papers: [
          "Diffusion-LM", "SED", "LATENTOPS", "Diffuseq", "CDCD",
          "Difformer", "LD4LG", "GENIE", "InfoDiffusion", "EDDPMs",
          "SMOOTHIE", "TESS", "TESS 2", "LDEBM",
        ],
      },
      {
        nameEn: "Discrete Space Models",
        nameZh: "离散空间模型",
        papers: [
          "D3PM", "DiffusionBERT", "LLaDA", "RDMs", "MD4", "MDLM",
          "Diffusion-LLM", "Diffusion-NAT", "Plaid", "SEDD", "RADD",
          "DFM", "DDPD", "MGDM", "Diffu-LLaMA", "Dream-7B", "GIDD",
          "LongLLaDA", "Seed Diffusion", "LLaDA-MoE",
        ],
      },
      {
        nameEn: "Hybrid DLMs",
        nameZh: "混合扩散语言模型",
        papers: [
          "SSD-LM", "AR-DIFFUSION", "BD3-LM", "CtrlDiff",
          "SpecDiff", "SDAR", "TiDAR", "SDLM", "Block Diffusion",
        ],
      },
    ],
  },
  {
    id: "training",
    nameEn: "Training Strategies",
    nameZh: "训练策略",
    color: "#F97316",
    colorClass: "text-orange-600",
    borderClass: "border-orange-200",
    bgClass: "bg-orange-50",
    children: [
      {
        nameEn: "Pre-training",
        nameZh: "预训练",
        papers: [],
        groups: [
          { labelEn: "From scratch",              labelZh: "从头训练",          papers: ["LLaDA-8B"] },
          { labelEn: "Adapting from AR models",   labelZh: "从 AR 模型迁移",    papers: ["Dream", "DiffuLLaMA"] },
          { labelEn: "Adapting from image diffusion", labelZh: "从图像扩散迁移", papers: ["D-DiT", "Muddit"] },
        ],
      },
      {
        nameEn: "Post-training",
        nameZh: "后训练",
        papers: [],
        groups: [
          {
            labelEn: "Policy Gradient",
            labelZh: "策略梯度",
            papers: ["diffu-GRPO", "UniGRPO", "SEPO", "Coupled-GRPO", "wd1", "IGPO", "SPG", "SAPO", "BGPO"],
          },
          { labelEn: "Preference Optimization", labelZh: "偏好优化", papers: ["VRPO"] },
        ],
      },
    ],
  },
  {
    id: "inference",
    nameEn: "Inference & Optimization",
    nameZh: "推理与优化",
    color: "#22C55E",
    colorClass: "text-green-600",
    borderClass: "border-green-200",
    bgClass: "bg-green-50",
    children: [
      {
        nameEn: "Parallel Decoding",
        nameZh: "并行解码",
        papers: ["Fast-dLLM", "APD", "SlowFast Sampling", "SpecDiff", "Dimple", "Learn2PD", "dParallel"],
      },
      {
        nameEn: "Unmasking / Remasking",
        nameZh: "揭码 / 重掩码",
        papers: ["LLaDA", "Dream", "Masked DLM", "Fast-dLLM", "ReMDM"],
      },
      {
        nameEn: "Guidance",
        nameZh: "引导",
        papers: ["A-CFG", "Freecache", "DINGO"],
      },
      {
        nameEn: "Efficiency Techniques",
        nameZh: "效率技术",
        papers: ["Key-Value Cache (Fast-dLLM)", "Feature Cache", "Step Distillation"],
      },
    ],
  },
  {
    id: "multimodal",
    nameEn: "Multimodal & Applications",
    nameZh: "多模态与应用",
    color: "#A855F7",
    colorClass: "text-purple-600",
    borderClass: "border-purple-200",
    bgClass: "bg-purple-50",
    children: [
      {
        nameEn: "Multimodal DLMs",
        nameZh: "多模态 DLM",
        papers: [
          "LLaDA-V", "Dimple", "MMaDA", "D-DiT", "LaViDa", "Fudoki",
          "Muddit", "UniDisc", "Lumina-DiMOO", "LaViDa-O", "MMaDA-Parallel",
        ],
      },
      {
        nameEn: "Conventional NLP Tasks",
        nameZh: "传统 NLP 任务",
        papers: [
          "ROIC-DM", "DiffusionNER", "IPAD", "DiffusionABSA", "DiffuSum",
          "TermDiffuSum", "Diff-KPE", "IPED", "EdiText", "DIFFUSEMP",
          "DiffuDetox", "ParaGuide", "PLANNER", "DiffuCom", "LDP",
          "PoetryDiffusion", "XDLM", "DiffusionRet", "DIFND",
        ],
      },
      {
        nameEn: "Code Generation",
        nameZh: "代码生成",
        papers: ["DUS", "DiffuCoder", "DCoLT", "Mercury Coder"],
      },
      {
        nameEn: "Computational Biology",
        nameZh: "计算生物学",
        papers: [],
        groups: [
          { labelEn: "Molecular",       labelZh: "分子",     papers: ["TransDLM", "TGM-DLM"] },
          { labelEn: "Protein Design",  labelZh: "蛋白质设计", papers: ["MeMDLM", "DPLM", "CFP-GEN", "DRAKES", "ForceGen", "DSM", "DPLM2"] },
        ],
      },
      {
        nameEn: "Robotics",
        nameZh: "机器人",
        papers: ["LLaDA-VLA", "dVLA", "UD-VLA"],
      },
    ],
  },
];

// ────────────────────────────────────────────────────────────
// Small helpers
// ────────────────────────────────────────────────────────────

/** Normalise a paper name so we can look it up in deepDives */
function canonical(name: string): string {
  // Strip parenthetical suffixes like " (Fast-dLLM)" or "★"
  return name.replace(/\s*\(.*?\)/g, "").replace(/★/g, "").trim();
}

function PaperPill({ name }: { name: string }) {
  const key = canonical(name);
  const dd = deepDives[key];

  if (dd) {
    return (
      <Link
        href={`${basePath}/papers/${dd.slug}`}
        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium
                   bg-amber-50 text-amber-700 border border-amber-200
                   hover:bg-amber-100 hover:border-amber-400 transition-colors"
      >
        <span>{name}</span>
        <span className="text-amber-500 font-bold text-[10px]">★</span>
      </Link>
    );
  }

  return (
    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-paper-100 text-paper-700 border border-paper-200">
      {name}
    </span>
  );
}

function PaperList({ papers }: { papers: string[] }) {
  if (papers.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {papers.map((p) => (
        <PaperPill key={p} name={p} />
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Sub-node card
// ────────────────────────────────────────────────────────────

function SubNodeCard({
  node,
  colorClass,
  borderClass,
}: {
  node: SubNode;
  colorClass: string;
  borderClass: string;
}) {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();

  const name = lang === "en" ? node.nameEn : node.nameZh;
  const totalPapers =
    node.papers.length +
    (node.groups?.reduce((s, g) => s + g.papers.length, 0) ?? 0);

  return (
    <div className={`border ${borderClass} rounded-lg bg-white overflow-hidden`}>
      {/* Header row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-paper-50 transition-colors"
        aria-expanded={open}
      >
        <span className={`text-sm font-semibold ${colorClass}`}>{name}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-paper-800/40 font-mono">
            {totalPapers} {lang === "en" ? "papers" : "篇"}
          </span>
          <span className="text-paper-800/30 text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="px-3 pb-3 pt-1 border-t border-paper-100 space-y-2">
          {/* Direct papers (no group) */}
          {node.papers.length > 0 && <PaperList papers={node.papers} />}

          {/* Grouped papers */}
          {node.groups?.map((g) => (
            <div key={g.labelEn}>
              <p className="text-xs text-paper-800/50 font-medium mt-2 mb-1">
                {lang === "en" ? g.labelEn : g.labelZh}
              </p>
              <PaperList papers={g.papers} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Top-level section
// ────────────────────────────────────────────────────────────

function TopSection({ node }: { node: TopNode }) {
  const [open, setOpen] = useState(true); // top-level open by default
  const { lang } = useLang();

  const name = lang === "en" ? node.nameEn : node.nameZh;

  return (
    <div className={`border ${node.borderClass} rounded-xl overflow-hidden`}>
      {/* Section header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 ${node.bgClass} hover:opacity-90 transition-opacity text-left`}
        aria-expanded={open}
      >
        <span
          className="font-bold text-sm tracking-wide"
          style={{ color: node.color }}
        >
          {name}
        </span>
        <span
          className="text-xs font-mono"
          style={{ color: node.color, opacity: 0.6 }}
        >
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Children */}
      {open && (
        <div className="p-3 space-y-2 bg-white">
          {node.children.map((child) => (
            <SubNodeCard
              key={child.nameEn}
              node={child}
              colorClass={node.colorClass}
              borderClass={node.borderClass}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main export
// ────────────────────────────────────────────────────────────

export function DLLMTaxonomy() {
  const { t } = useLang();

  return (
    <div className="bg-white border border-paper-200 rounded-xl p-5">
      {/* Title */}
      <p className="text-xs font-bold uppercase tracking-widest text-paper-800/40 mb-4">
        {t("Taxonomy of Diffusion Language Models", "扩散语言模型分类图")}
      </p>

      {/* Tree */}
      <div className="space-y-3">
        {taxonomy.map((node) => (
          <TopSection key={node.id} node={node} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-xs text-paper-800/50 border-t border-paper-100 pt-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
          Paper <span className="text-amber-500 font-bold text-[10px]">★</span>
        </span>
        <span>
          {t(
            "= deep-dive available on PaperTrace — click to read",
            "= PaperTrace 上有精读页面 — 点击阅读"
          )}
        </span>
      </div>
    </div>
  );
}
