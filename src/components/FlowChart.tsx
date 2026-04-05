"use client";

import { ReactNode } from "react";

/**
 * Reusable flow chart component for paper architecture overviews.
 * Renders a vertical flow with boxes and arrows, supporting groups of sub-items.
 */

type BoxColor = "blue" | "green" | "amber" | "purple" | "teal" | "gray" | "rose";

const colorMap: Record<BoxColor, { bg: string; border: string; text: string; sub: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-900/30",   border: "border-blue-200 dark:border-blue-700/40",   text: "text-blue-800 dark:text-blue-200",   sub: "text-blue-700/60 dark:text-blue-400/70" },
  green:  { bg: "bg-green-50 dark:bg-green-900/30",  border: "border-green-200 dark:border-green-700/40",  text: "text-green-800 dark:text-green-200",  sub: "text-green-700/60 dark:text-green-400/70" },
  amber:  { bg: "bg-amber-50 dark:bg-amber-900/30",  border: "border-amber-200 dark:border-amber-700/40",  text: "text-amber-800 dark:text-amber-200",  sub: "text-amber-700/60 dark:text-amber-400/70" },
  purple: { bg: "bg-purple-50 dark:bg-purple-900/30", border: "border-purple-200 dark:border-purple-700/40", text: "text-purple-800 dark:text-purple-200", sub: "text-purple-700/60 dark:text-purple-400/70" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-900/30",   border: "border-teal-200 dark:border-teal-700/40",   text: "text-teal-800 dark:text-teal-200",   sub: "text-teal-700/60 dark:text-teal-400/70" },
  gray:   { bg: "bg-paper-100 dark:bg-slate-700/60", border: "border-paper-200 dark:border-slate-600",    text: "text-paper-800 dark:text-slate-100",  sub: "text-paper-800/50 dark:text-slate-400" },
  rose:   { bg: "bg-rose-50 dark:bg-rose-900/30",   border: "border-rose-200 dark:border-rose-700/40",   text: "text-rose-800 dark:text-rose-200",   sub: "text-rose-700/60 dark:text-rose-400/70" },
};

interface FlowBox {
  title: string;
  subtitle?: string;
  color?: BoxColor;
}

interface FlowStep {
  title: string;
  subtitle?: string;
  color?: BoxColor;
  children?: FlowBox[];
}

interface FlowChartProps {
  title?: string;
  steps: FlowStep[];
  arrows?: (string | undefined)[];
  highlights?: { text: string; color: BoxColor }[];
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-4 bg-paper-800/20 dark:bg-slate-500/30" />
      {label && (
        <span className="text-[11px] text-paper-800/50 dark:text-slate-500 py-0.5">{label}</span>
      )}
      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-paper-800/20 dark:border-t-slate-500/30" />
    </div>
  );
}

function Box({ title, subtitle, color = "gray" }: FlowBox) {
  const c = colorMap[color];
  return (
    <div className={`${c.bg} ${c.border} border rounded-lg px-4 py-2.5 text-center min-w-[140px] flex-1`}>
      <div className={`text-sm font-semibold ${c.text}`}>{title}</div>
      {subtitle && (
        <div className={`text-xs mt-0.5 leading-relaxed ${c.sub}`}>{subtitle}</div>
      )}
    </div>
  );
}

export function FlowChart({ title, steps, arrows = [], highlights }: FlowChartProps) {
  return (
    <div className="widget-container">
      {title && (
        <div className="widget-header">
          <span className="text-blue-600 dark:text-blue-400">&#9670;</span>
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
                <div className={`text-xs mt-0.5 ${colorMap[step.color || "gray"].sub}`}>{step.subtitle}</div>
              )}
            </div>

            {/* Children boxes */}
            {step.children && step.children.length > 0 && (
              <>
                <div className="w-px h-3 bg-paper-800/15 dark:bg-slate-500/20" />
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
