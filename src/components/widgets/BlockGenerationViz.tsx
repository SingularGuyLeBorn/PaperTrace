"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

interface BlockState {
  tokens: { text: string; status: "masked" | "partial" | "done" }[];
}

const STEPS_EN = [
  "Step 0: All blocks masked",
  "Step 1: Denoise Block 1 (diffusion, 2 sub-steps)",
  "Step 2: Block 1 done → start Block 2",
  "Step 3: Block 2 done → start Block 3",
  "Step 4: All blocks complete",
];

const STEPS_ZH = [
  "步骤 0: 所有块被掩码",
  "步骤 1: 对块 1 去噪 (扩散, 2 个子步骤)",
  "步骤 2: 块 1 完成 → 开始块 2",
  "步骤 3: 块 2 完成 → 开始块 3",
  "步骤 4: 所有块完成",
];

const BLOCKS: BlockState[][] = [
  [
    { tokens: [{ text: "[M]", status: "masked" }, { text: "[M]", status: "masked" }] },
    { tokens: [{ text: "[M]", status: "masked" }, { text: "[M]", status: "masked" }] },
    { tokens: [{ text: "[M]", status: "masked" }, { text: "[M]", status: "masked" }] },
  ],
  [
    { tokens: [{ text: "The", status: "partial" }, { text: "[M]", status: "masked" }] },
    { tokens: [{ text: "[M]", status: "masked" }, { text: "[M]", status: "masked" }] },
    { tokens: [{ text: "[M]", status: "masked" }, { text: "[M]", status: "masked" }] },
  ],
  [
    { tokens: [{ text: "The", status: "done" }, { text: "cat", status: "done" }] },
    { tokens: [{ text: "sat", status: "partial" }, { text: "[M]", status: "masked" }] },
    { tokens: [{ text: "[M]", status: "masked" }, { text: "[M]", status: "masked" }] },
  ],
  [
    { tokens: [{ text: "The", status: "done" }, { text: "cat", status: "done" }] },
    { tokens: [{ text: "sat", status: "done" }, { text: "on", status: "done" }] },
    { tokens: [{ text: "the", status: "partial" }, { text: "[M]", status: "masked" }] },
  ],
  [
    { tokens: [{ text: "The", status: "done" }, { text: "cat", status: "done" }] },
    { tokens: [{ text: "sat", status: "done" }, { text: "on", status: "done" }] },
    { tokens: [{ text: "the", status: "done" }, { text: "mat", status: "done" }] },
  ],
];

const statusColors = {
  masked: "bg-gray-200 text-gray-400 border-dashed border-gray-300",
  partial: "bg-amber-100 text-amber-800 border-amber-300",
  done: "bg-green-100 text-green-800 border-green-300",
};

export function BlockGenerationViz() {
  const { t, lang } = useLang();
  const [step, setStep] = useState(0);
  const labels = lang === "en" ? STEPS_EN : STEPS_ZH;

  return (
    <div>
      <div className="text-sm text-paper-800/60 mb-4 text-center">
        {t(
          "Left-to-right block generation · within-block parallel diffusion",
          "从左到右的块级生成 · 块内并行扩散"
        )}
      </div>

      <div className="flex gap-3 justify-center mb-4">
        {BLOCKS[step].map((block, bi) => (
          <div key={bi} className="border-2 border-paper-200 rounded-lg p-2 bg-paper-50">
            <div className="text-[10px] text-paper-800/40 mb-1 text-center font-mono">
              {t(`Block ${bi + 1}`, `块 ${bi + 1}`)}
            </div>
            <div className="flex gap-1">
              {block.tokens.map((token, ti) => (
                <div
                  key={ti}
                  className={`px-3 py-1.5 rounded font-mono text-sm border-2 transition-all duration-300 min-w-[44px] text-center ${statusColors[token.status]}`}
                >
                  {token.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-paper-800/70 mb-4 font-medium">
        {labels[step]}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="px-3 py-1.5 rounded bg-paper-200 text-sm disabled:opacity-30 hover:bg-paper-200/80"
        >
          {t("← Prev", "← 上一步")}
        </button>
        <div className="flex gap-1">
          {BLOCKS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === step ? "bg-blue-500" : "bg-paper-200"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setStep((s) => Math.min(s + 1, BLOCKS.length - 1))}
          disabled={step === BLOCKS.length - 1}
          className="px-3 py-1.5 rounded bg-paper-200 text-sm disabled:opacity-30 hover:bg-paper-200/80"
        >
          {t("Next →", "下一步 →")}
        </button>
      </div>

      <div className="flex gap-4 justify-center mt-4 text-xs text-paper-800/50">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-200 inline-block" /> {t("Masked", "掩码")}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" /> {t("Denoising", "去噪中")}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-100 border border-green-300 inline-block" /> {t("Complete", "完成")}
        </span>
      </div>
    </div>
  );
}
