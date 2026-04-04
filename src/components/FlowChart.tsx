"use client";

import { ReactNode } from "react";

/**
 * Reusable flow chart component for paper architecture overviews.
 * Renders a vertical flow with boxes and arrows, supporting groups of sub-items.
 */

type BoxColor = "blue" | "green" | "amber" | "purple" | "teal" | "gray" | "rose";

const colorMap: Record<BoxColor, { bg: string; border: string; text: string }> = {
  blue:   { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-800" },
  green:  { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-800" },
  amber:  { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-800" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800" },
  teal:   { bg: "bg-teal-50",   border: "border-teal-200",   text: "text-teal-800" },
  gray:   { bg: "bg-paper-100", border: "border-paper-200",  text: "text-paper-800" },
  rose:   { bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-800" },
};

interface FlowBox {
  title: string;
  subtitle?: string;
  color?: BoxColor;
}

interface FlowStep {
  /** Main title of this step */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Color theme */
  color?: BoxColor;
  /** Sub-items displayed horizontally within this step */
  children?: FlowBox[];
}

interface FlowChartProps {
  /** The title of the flow chart */
  title?: string;
  /** Steps in the flow */
  steps: FlowStep[];
  /** Arrow labels between steps */
  arrows?: (string | undefined)[];
  /** Bottom highlights */
  highlights?: { text: string; color: BoxColor }[];
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-4 bg-paper-800/20" />
      {label && (
        <span className="text-[11px] text-paper-800/50 py-0.5">{label}</span>
      )}
      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-paper-800/20" />
    </div>
  );
}

function Box({ title, subtitle, color = "gray" }: FlowBox) {
  const c = colorMap[color];
  return (
    <div className={`${c.bg} ${c.border} border rounded-lg px-4 py-2.5 text-center min-w-[140px] flex-1`}>
      <div className={`text-sm font-semibold ${c.text}`}>{title}</div>
      {subtitle && (
        <div className="text-xs text-paper-800/50 mt-0.5 leading-relaxed">{subtitle}</div>
      )}
    </div>
  );
}

export function FlowChart({ title, steps, arrows = [], highlights }: FlowChartProps) {
  return (
    <div className="widget-container">
      {title && (
        <div className="widget-header">
          <span className="text-blue-600">&#9670;</span>
          <span>{title}</span>
        </div>
      )}
      <div className="widget-body flex flex-col items-center py-4">
        {steps.map((step, i) => (
          <div key={i} className="w-full flex flex-col items-center">
            {i > 0 && <Arrow label={arrows[i - 1]} />}

            {/* Main box */}
            <div className={`${colorMap[step.color || "gray"].bg} ${colorMap[step.color || "gray"].border} border rounded-lg px-5 py-3 text-center max-w-md w-full`}>
              <div className={`text-sm font-bold ${colorMap[step.color || "gray"].text}`}>
                {step.title}
              </div>
              {step.subtitle && (
                <div className="text-xs text-paper-800/50 mt-0.5">{step.subtitle}</div>
              )}
            </div>

            {/* Children boxes */}
            {step.children && step.children.length > 0 && (
              <>
                <div className="w-px h-3 bg-paper-800/15" />
                <div className="flex gap-3 flex-wrap justify-center max-w-lg">
                  {step.children.map((child, j) => (
                    <Box key={j} {...child} />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        {/* Bottom highlights */}
        {highlights && highlights.length > 0 && (
          <div className="flex gap-3 flex-wrap justify-center mt-6">
            {highlights.map((h, i) => {
              const c = colorMap[h.color];
              return (
                <div key={i} className={`${c.bg} ${c.border} border rounded-full px-4 py-1.5`}>
                  <span className={`text-xs font-medium ${c.text}`}>{h.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
