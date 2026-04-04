"use client";

import { useState, useCallback } from "react";
import { useLang } from "@/lib/i18n";

const EXAMPLE_SENTENCE = ["The", "cat", "sat", "on", "the", "mat"];
const MASK_SCHEDULE = [
  [3],
  [1, 5],
  [0, 4],
  [2],
];

export function MaskDiffusionViz() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "reverse">("forward");

  const totalSteps = MASK_SCHEDULE.length;

  const getMaskedIndices = useCallback(
    (currentStep: number) => {
      const masked = new Set<number>();
      const effectiveStep =
        direction === "forward" ? currentStep : totalSteps - currentStep;
      for (let i = 0; i < effectiveStep; i++) {
        MASK_SCHEDULE[i].forEach((idx) => masked.add(idx));
      }
      return masked;
    },
    [direction, totalSteps]
  );

  const maskedIndices = getMaskedIndices(step);

  const tokens = EXAMPLE_SENTENCE.map((text, i) => ({
    text,
    masked: maskedIndices.has(i),
  }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            setDirection((d) => (d === "forward" ? "reverse" : "forward"));
            setStep(0);
          }}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            direction === "forward"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {direction === "forward"
            ? t("Forward Process (Adding Noise)", "前向过程 (加噪)")
            : t("Reverse Process (Denoising)", "逆向过程 (去噪)")}
        </button>
        <span className="text-xs text-paper-800/50">
          {t("Click to toggle direction", "点击切换方向")}
        </span>
      </div>

      <div className="flex gap-2 mb-6 justify-center py-4">
        {tokens.map((token, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-lg font-mono text-sm font-medium transition-all duration-300 ${
              token.masked
                ? "bg-gray-200 text-gray-400 border-2 border-dashed border-gray-300"
                : "bg-blue-100 text-blue-800 border-2 border-blue-300"
            }`}
          >
            {token.masked ? "[M]" : token.text}
          </div>
        ))}
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
          {Array.from({ length: totalSteps + 1 }, (_, i) => (
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
          onClick={() => setStep((s) => Math.min(s + 1, totalSteps))}
          disabled={step === totalSteps}
          className="px-3 py-1.5 rounded bg-paper-200 text-sm disabled:opacity-30 hover:bg-paper-200/80"
        >
          {t("Next →", "下一步 →")}
        </button>
      </div>

      <div className="text-center text-xs text-paper-800/50 mt-2">
        t = {direction === "forward" ? step : totalSteps - step} / {totalSteps}
        &nbsp;&middot;&nbsp;
        {maskedIndices.size} / {EXAMPLE_SENTENCE.length} {t("tokens masked", "个 token 被掩码")}
      </div>
    </div>
  );
}
