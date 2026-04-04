"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

interface TokenState {
  text: string;
  confidence: number;
  revealed: boolean;
}

const DENOISING_STEPS: TokenState[][] = [
  [
    { text: "[M]", confidence: 0, revealed: false },
    { text: "[M]", confidence: 0, revealed: false },
    { text: "[M]", confidence: 0, revealed: false },
    { text: "[M]", confidence: 0, revealed: false },
    { text: "[M]", confidence: 0, revealed: false },
    { text: "[M]", confidence: 0, revealed: false },
  ],
  [
    { text: "A", confidence: 0.35, revealed: false },
    { text: "dog", confidence: 0.28, revealed: false },
    { text: "sat", confidence: 0.72, revealed: true },
    { text: "on", confidence: 0.81, revealed: true },
    { text: "a", confidence: 0.31, revealed: false },
    { text: "mat", confidence: 0.65, revealed: true },
  ],
  [
    { text: "The", confidence: 0.68, revealed: false },
    { text: "cat", confidence: 0.55, revealed: false },
    { text: "sat", confidence: 0.92, revealed: true },
    { text: "on", confidence: 0.95, revealed: true },
    { text: "the", confidence: 0.72, revealed: true },
    { text: "mat", confidence: 0.88, revealed: true },
  ],
  [
    { text: "The", confidence: 0.96, revealed: true },
    { text: "cat", confidence: 0.93, revealed: true },
    { text: "sat", confidence: 0.98, revealed: true },
    { text: "on", confidence: 0.99, revealed: true },
    { text: "the", confidence: 0.97, revealed: true },
    { text: "mat", confidence: 0.95, revealed: true },
  ],
];

function getConfidenceColor(confidence: number, revealed: boolean) {
  if (!revealed) return "bg-amber-50 border-amber-200 text-amber-700";
  if (confidence > 0.9) return "bg-green-100 border-green-300 text-green-800";
  if (confidence > 0.7) return "bg-blue-100 border-blue-300 text-blue-800";
  return "bg-amber-50 border-amber-200 text-amber-700";
}

export function DenoisingStepsViz() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const tokens = DENOISING_STEPS[step];

  return (
    <div>
      <div className="text-sm text-paper-800/60 mb-4 text-center">
        {t(
          "Reverse process: iteratively denoise from [MASK] → text",
          "逆向过程：从 [MASK] 迭代去噪 → 文本"
        )}
      </div>

      <div className="flex gap-2 mb-2 justify-center py-3">
        {tokens.map((token, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-lg font-mono text-sm border-2 transition-all duration-300 text-center min-w-[48px] ${
              step === 0
                ? "bg-gray-200 text-gray-400 border-dashed border-gray-300"
                : getConfidenceColor(token.confidence, token.revealed)
            }`}
          >
            {step === 0 ? "[M]" : token.text}
          </div>
        ))}
      </div>

      {step > 0 && (
        <div className="flex gap-2 justify-center mb-4">
          {tokens.map((token, i) => (
            <div key={i} className="min-w-[48px] text-center">
              <div className="h-1.5 bg-paper-200 rounded-full overflow-hidden mx-1">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${token.confidence * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-paper-800/40 mt-0.5">
                {(token.confidence * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="px-3 py-1.5 rounded bg-paper-200 text-sm disabled:opacity-30 hover:bg-paper-200/80"
        >
          {t("← Prev", "← 上一步")}
        </button>
        <span className="text-sm text-paper-800/60 font-mono">
          {t("Step", "步骤")} {step} / {DENOISING_STEPS.length - 1}
        </span>
        <button
          onClick={() => setStep((s) => Math.min(s + 1, DENOISING_STEPS.length - 1))}
          disabled={step === DENOISING_STEPS.length - 1}
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
          <span className="w-3 h-3 rounded bg-amber-50 border border-amber-200 inline-block" />{" "}
          {t("Low confidence", "低置信度")}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-100 border border-green-300 inline-block" />{" "}
          {t("High confidence", "高置信度")}
        </span>
      </div>
    </div>
  );
}
