"use client";

import katex from "katex";
import { useMemo } from "react";

interface MathProps {
  /** LaTeX string */
  tex: string;
  /** Display mode (block) vs inline */
  display?: boolean;
  /** Optional label shown above the block */
  label?: string;
}

export function Math({ tex, display = false, label }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        trust: true,
      });
    } catch {
      return `<span style="color:red">Error rendering: ${tex}</span>`;
    }
  }, [tex, display]);

  if (!display) {
    return (
      <span
        className="math-inline"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="math-block">
      {label && (
        <div className="text-xs font-mono text-paper-800/40 mb-3">{label}</div>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
