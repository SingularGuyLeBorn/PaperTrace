"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

const T = 8;
const L_VALUES = [0.42, 0.38, 0.31, 0.25, 0.18, 0.12, 0.08, 0.05];

export function ELBOViz() {
  const { t } = useLang();
  const [hoveredT, setHoveredT] = useState<number | null>(null);
  const total = L_VALUES.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="text-sm text-paper-800/60 mb-4 text-center">
        {t(
          "ELBO = -∑ Lₜ — hover over each bar to see the per-timestep loss",
          "ELBO = -∑ Lₜ — 悬停在柱状图上查看每个时间步的损失"
        )}
      </div>

      <div className="flex items-end justify-center gap-2 h-40 mb-4">
        {L_VALUES.map((val, idx) => {
          const heightPct = (val / Math.max(...L_VALUES)) * 100;
          const isHovered = hoveredT === idx;
          return (
            <div
              key={idx}
              className="flex flex-col items-center gap-1"
              onMouseEnter={() => setHoveredT(idx)}
              onMouseLeave={() => setHoveredT(null)}
            >
              {isHovered && (
                <div className="text-xs font-mono text-blue-600 font-medium">
                  {val.toFixed(3)}
                </div>
              )}
              <div
                className={`w-8 rounded-t transition-all duration-200 cursor-pointer ${
                  isHovered ? "bg-blue-500" : "bg-blue-300"
                }`}
                style={{ height: `${heightPct}%` }}
              />
              <div className="text-xs text-paper-800/50 font-mono">
                t={idx + 1}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-paper-800/60">
        {t("Total ELBO loss", "总 ELBO 损失")}:{" "}
        <span className="font-mono font-medium text-paper-900">
          {total.toFixed(3)}
        </span>
        {hoveredT !== null && (
          <span className="ml-2">
            &middot; L<sub>{hoveredT + 1}</sub> {t("contributes", "贡献")}{" "}
            <span className="font-mono font-medium text-blue-600">
              {((L_VALUES[hoveredT] / total) * 100).toFixed(1)}%
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
