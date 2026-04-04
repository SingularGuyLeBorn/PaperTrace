"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

/**
 * Interactive n×n attention mask visualization for Block Diffusion.
 * Based on Figure 7 from the paper.
 *
 * Three types of attention:
 * - Block Diagonal (blue): intra-block bidirectional attention within noisy blocks
 * - Offset Block Causal (green): noisy tokens attend to corresponding clean block + all preceding clean blocks
 * - Block Causal (orange): standard left-to-right causal among clean tokens
 */

type CellType =
  | "none"
  | "block-diagonal"
  | "offset-block-causal"
  | "block-causal";

interface AttentionMaskConfig {
  blockSize: number;
  numBlocks: number;
}

function buildTrainingMask(config: AttentionMaskConfig): CellType[][] {
  const { blockSize, numBlocks } = config;
  // Layout: [x_t^1, x_t^2, ..., x_t^n, x_0^1, x_0^2, ..., x_0^n]
  // Where x_t = noisy, x_0 = clean
  const n = blockSize * numBlocks;
  const total = n * 2;
  const mask: CellType[][] = Array.from({ length: total }, () =>
    Array(total).fill("none")
  );

  for (let row = 0; row < total; row++) {
    for (let col = 0; col < total; col++) {
      const rowIsNoisy = row < n;
      const colIsNoisy = col < n;
      const rowBlock = Math.floor((row % n) / blockSize);
      const colBlock = Math.floor((col % n) / blockSize);

      if (rowIsNoisy && colIsNoisy) {
        // Noisy-to-noisy: Block Diagonal (intra-block bidirectional)
        if (rowBlock === colBlock) {
          mask[row][col] = "block-diagonal";
        }
      } else if (rowIsNoisy && !colIsNoisy) {
        // Noisy-to-clean: Offset Block Causal
        // noisy block b attends to clean blocks 0..b
        if (colBlock <= rowBlock) {
          mask[row][col] = "offset-block-causal";
        }
      } else if (!rowIsNoisy && colIsNoisy) {
        // Clean-to-noisy: nothing (clean doesn't attend to noisy)
        // nothing
      } else {
        // Clean-to-clean: Block Causal (standard left-to-right)
        if (colBlock < rowBlock) {
          mask[row][col] = "block-causal";
        } else if (colBlock === rowBlock) {
          // Within same clean block: causal (token-level left-to-right)
          const rowPos = row % n;
          const colPos = col % n;
          if (colPos <= rowPos) {
            mask[row][col] = "block-causal";
          }
        }
      }
    }
  }

  return mask;
}

function buildInferenceMask(config: AttentionMaskConfig): CellType[][] {
  const { blockSize, numBlocks } = config;
  const n = blockSize * numBlocks;
  const total = n * 2;
  const mask: CellType[][] = Array.from({ length: total }, () =>
    Array(total).fill("none")
  );

  for (let row = 0; row < total; row++) {
    for (let col = 0; col < total; col++) {
      const rowIsNoisy = row < n;
      const colIsNoisy = col < n;
      const rowBlock = Math.floor((row % n) / blockSize);
      const colBlock = Math.floor((col % n) / blockSize);

      if (rowIsNoisy && colIsNoisy) {
        // At inference: only the current decoding block is active
        // Show last block as the "decoding block"
        if (rowBlock === numBlocks - 1 && colBlock === numBlocks - 1) {
          mask[row][col] = "block-diagonal";
        }
      } else if (rowIsNoisy && !colIsNoisy) {
        // Noisy attends to cached clean blocks
        if (
          rowBlock === numBlocks - 1 &&
          colBlock < numBlocks - 1
        ) {
          mask[row][col] = "offset-block-causal";
        }
        // Also attends to own clean block
        if (rowBlock === numBlocks - 1 && colBlock === numBlocks - 1) {
          mask[row][col] = "offset-block-causal";
        }
      } else if (!rowIsNoisy && !colIsNoisy) {
        // Cached clean blocks
        if (colBlock < rowBlock && rowBlock < numBlocks - 1) {
          mask[row][col] = "block-causal";
        } else if (
          colBlock === rowBlock &&
          rowBlock < numBlocks - 1
        ) {
          const rowPos = row % n;
          const colPos = col % n;
          if (colPos <= rowPos) {
            mask[row][col] = "block-causal";
          }
        }
      }
    }
  }

  return mask;
}

const cellColors: Record<CellType, string> = {
  none: "bg-white",
  "block-diagonal": "bg-blue-300 hover:bg-blue-400",
  "offset-block-causal": "bg-green-300 hover:bg-green-400",
  "block-causal": "bg-orange-300 hover:bg-orange-400",
};

export function AttentionMaskViz() {
  const { t } = useLang();
  const [blockSize, setBlockSize] = useState(2);
  const [numBlocks, setNumBlocks] = useState(3);
  const [mode, setMode] = useState<"training" | "inference">("training");
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const config = { blockSize, numBlocks };
  const mask =
    mode === "training"
      ? buildTrainingMask(config)
      : buildInferenceMask(config);

  const n = blockSize * numBlocks;
  const total = n * 2;
  const cellSize = Math.max(16, Math.min(32, 400 / total));

  // Generate labels
  const labels: string[] = [];
  for (let b = 0; b < numBlocks; b++) {
    for (let i = 0; i < blockSize; i++) {
      labels.push(`x_t^${b * blockSize + i + 1}`);
    }
  }
  for (let b = 0; b < numBlocks; b++) {
    for (let i = 0; i < blockSize; i++) {
      labels.push(`x_0^${b * blockSize + i + 1}`);
    }
  }

  const hoveredType = hoveredCell ? mask[hoveredCell.row][hoveredCell.col] : null;

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-paper-800/60">
            {t("Mode", "模式")}:
          </label>
          <button
            onClick={() => setMode("training")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              mode === "training"
                ? "bg-blue-600 text-white"
                : "bg-paper-200 text-paper-800/60"
            }`}
          >
            {t("Training", "训练时")}
          </button>
          <button
            onClick={() => setMode("inference")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              mode === "inference"
                ? "bg-blue-600 text-white"
                : "bg-paper-200 text-paper-800/60"
            }`}
          >
            {t("Inference", "推理时")}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-paper-800/60">
            {t("Block size", "块大小")}:
          </label>
          {[2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setBlockSize(s)}
              className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                blockSize === s
                  ? "bg-blue-600 text-white"
                  : "bg-paper-200 text-paper-800/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-paper-800/60">
            {t("Blocks", "块数")}:
          </label>
          {[2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setNumBlocks(s)}
              className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                numBlocks === s
                  ? "bg-blue-600 text-white"
                  : "bg-paper-200 text-paper-800/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Size indicator */}
      <div className="text-xs text-paper-800/40 mb-3">
        {t(
          `Matrix size: ${total} × ${total} (${n} noisy + ${n} clean tokens, ${numBlocks} blocks × ${blockSize} tokens)`,
          `矩阵大小: ${total} × ${total} (${n} 噪声 + ${n} 干净 token, ${numBlocks} 块 × ${blockSize} token)`
        )}
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Column header labels */}
          <div className="flex" style={{ marginLeft: cellSize * 2.5 }}>
            {/* Separator between noisy and clean */}
            {labels.map((label, i) => (
              <div
                key={i}
                className={`text-[8px] text-paper-800/40 text-center ${
                  i === n ? "ml-1" : ""
                }`}
                style={{ width: cellSize, minWidth: cellSize }}
              >
                {total <= 16 ? label.replace("x_t^", "t").replace("x_0^", "c") : ""}
              </div>
            ))}
          </div>

          {mask.map((row, ri) => (
            <div key={ri} className={`flex items-center ${ri === n ? "mt-1" : ""}`}>
              {/* Row label */}
              <div
                className="text-[8px] text-paper-800/40 text-right pr-1"
                style={{ width: cellSize * 2.5, minWidth: cellSize * 2.5 }}
              >
                {total <= 16
                  ? labels[ri].replace("x_t^", "t").replace("x_0^", "c")
                  : ""}
              </div>
              {row.map((cell, ci) => (
                <div
                  key={ci}
                  className={`${cellColors[cell]} border border-paper-200/50 transition-all duration-100 cursor-pointer ${
                    ci === n ? "ml-1" : ""
                  } ${
                    hoveredCell?.row === ri || hoveredCell?.col === ci
                      ? "ring-1 ring-blue-400"
                      : ""
                  }`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    minWidth: cellSize,
                    minHeight: cellSize,
                  }}
                  onMouseEnter={() => setHoveredCell({ row: ri, col: ci })}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Axis labels */}
      <div className="flex gap-8 mt-2 text-xs text-paper-800/50 justify-center">
        <span>← {t("noisy tokens (x_t)", "噪声 token (x_t)")} | {t("clean tokens (x_0)", "干净 token (x_0)")} →</span>
      </div>

      {/* Hover info */}
      {hoveredCell && (
        <div className="mt-3 p-2 bg-paper-100 rounded text-xs text-paper-800/70 text-center">
          {t("Row", "行")} {hoveredCell.row + 1} ({labels[hoveredCell.row]})
          {" → "}
          {t("Col", "列")} {hoveredCell.col + 1} ({labels[hoveredCell.col]})
          {": "}
          <span className="font-medium">
            {hoveredType === "none"
              ? t("No attention (masked)", "无注意力 (被遮挡)")
              : hoveredType === "block-diagonal"
              ? t(
                  "Block Diagonal — intra-block bidirectional attention among noisy tokens",
                  "Block Diagonal — 噪声 token 块内双向注意力"
                )
              : hoveredType === "offset-block-causal"
              ? t(
                  "Offset Block Causal — noisy tokens attend to corresponding + preceding clean blocks",
                  "Offset Block Causal — 噪声 token 关注对应及之前的干净块"
                )
              : t(
                  "Block Causal — standard left-to-right causal among clean tokens",
                  "Block Causal — 干净 token 之间的标准从左到右因果注意力"
                )}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-4 h-4 rounded bg-blue-300 border border-blue-400" />
          <span>
            {t("Block Diagonal", "Block Diagonal")}
            <span className="text-paper-800/40 ml-1">
              ({t("intra-block bidirectional", "块内双向")})
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-4 h-4 rounded bg-green-300 border border-green-400" />
          <span>
            {t("Offset Block Causal", "Offset Block Causal")}
            <span className="text-paper-800/40 ml-1">
              ({t("noisy→clean", "噪声→干净")})
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-4 h-4 rounded bg-orange-300 border border-orange-400" />
          <span>
            {t("Block Causal", "Block Causal")}
            <span className="text-paper-800/40 ml-1">
              ({t("clean AR", "干净 token AR")})
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-4 h-4 rounded bg-white border border-paper-200" />
          <span>{t("No attention", "无注意力")}</span>
        </div>
      </div>
    </div>
  );
}
