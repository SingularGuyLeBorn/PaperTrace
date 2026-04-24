"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

// Algorithm 1: Muon Optimizer — verbatim from DeepSeek-V4 paper
const STEPS = [
  {
    line: "for each training step t do",
    lineZh: "对每个训练步骤 t:",
    label: "Outer loop",
    labelZh: "外层循环",
    desc: "Iterate over training steps. Inner loop runs over all logically independent weight matrices W ∈ ℝⁿˣᵐ.",
    descZh: "遍历所有训练步骤。内层循环遍历所有逻辑独立的权重矩阵 W ∈ ℝⁿˣᵐ。",
    color: "bg-slate-100 dark:bg-slate-700",
    highlight: false,
  },
  {
    line: "Gₜ = ∇_W ℒₜ(Wₜ₋₁)",
    lineZh: "Gₜ = ∇_W ℒₜ(Wₜ₋₁)",
    label: "Compute gradients",
    labelZh: "计算梯度",
    desc: "Standard backpropagation: compute the gradient of the loss with respect to weight matrix W at the current parameters.",
    descZh: "标准反向传播：计算当前参数下损失对权重矩阵 W 的梯度。",
    color: "bg-blue-50 dark:bg-blue-500/15",
    highlight: false,
  },
  {
    line: "Mₜ = μMₜ₋₁ + Gₜ",
    lineZh: "Mₜ = μMₜ₋₁ + Gₜ",
    label: "Accumulate momentum buffer",
    labelZh: "累积动量缓冲",
    desc: "Exponential moving average of gradients. μ (momentum coefficient, e.g. 0.95) smooths out gradient noise across steps.",
    descZh: "梯度的指数移动平均。μ（动量系数，如 0.95）平滑跨步骤的梯度噪声。",
    color: "bg-indigo-50 dark:bg-indigo-500/15",
    highlight: false,
  },
  {
    line: "O′ₜ = HybridNewtonSchulz(μMₜ + Gₜ)",
    lineZh: "O′ₜ = HybridNewtonSchulz(μMₜ + Gₜ)",
    label: "Nesterov + orthogonalise",
    labelZh: "Nesterov + 正交化",
    desc: "Two operations in one: (1) Nesterov lookahead — use μMₜ + Gₜ (the 'future' gradient) instead of Mₜ alone for lower variance. (2) HybridNewtonSchulz — approximate the orthogonal factor in the polar decomposition of the gradient matrix, ensuring the update has uniform spectral norm. This is the key innovation: gradient directions are normalised regardless of magnitude.",
    descZh: "两个操作合一：(1) Nesterov 超前估计——用 μMₜ + Gₜ（'未来'梯度）代替 Mₜ，降低方差。(2) HybridNewtonSchulz——近似梯度矩阵极分解的正交因子，确保更新具有均匀谱范数。这是核心创新：无论梯度大小，更新方向都被归一化。",
    color: "bg-amber-50 dark:bg-amber-500/15",
    highlight: true,
  },
  {
    line: "Oₜ = O′ₜ · √max(n,m) · γ",
    lineZh: "Oₜ = O′ₜ · √max(n,m) · γ",
    label: "Rescale update RMS",
    labelZh: "缩放更新 RMS",
    desc: "Rescale the orthogonalised update to have the right RMS norm. √max(n,m) accounts for the matrix dimensions (n rows, m cols); γ is a learned or fixed rescaling factor. This ensures that larger weight matrices don't receive proportionally smaller updates.",
    descZh: "将正交化更新缩放到合适的 RMS 范数。√max(n,m) 考虑了矩阵维度（n 行，m 列）；γ 是学习或固定的缩放因子。这确保较大权重矩阵不会获得比例更小的更新。",
    color: "bg-teal-50 dark:bg-teal-500/15",
    highlight: false,
  },
  {
    line: "Wₜ = Wₜ₋₁ · (1 − ηλ) − ηOₜ",
    lineZh: "Wₜ = Wₜ₋₁ · (1 − ηλ) − ηOₜ",
    label: "Weight decay + update",
    labelZh: "权重衰减 + 更新",
    desc: "Standard decoupled weight decay (multiply by 1−ηλ first) followed by the gradient step. η is the learning rate, λ is the weight decay coefficient. Decoupled weight decay avoids the interaction between L2 regularisation and adaptive gradient scaling.",
    descZh: "标准解耦权重衰减（先乘以 1−ηλ）后接梯度步。η 是学习率，λ 是权重衰减系数。解耦权重衰减避免了 L2 正则化与自适应梯度缩放的相互作用。",
    color: "bg-green-50 dark:bg-green-500/15",
    highlight: false,
  },
];

export function MuonOptimizerViz() {
  const { t, lang } = useLang();
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (playing) { setPlaying(false); setActive(null); return; }
    setPlaying(true);
    let i = 0;
    const tick = () => {
      setActive(i);
      i++;
      if (i < STEPS.length) {
        setTimeout(tick, 900);
      } else {
        setPlaying(false);
      }
    };
    tick();
  };

  return (
    <div className="border border-paper-200 dark:border-slate-700 rounded-xl overflow-hidden my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-paper-50 dark:bg-slate-800 border-b border-paper-200 dark:border-slate-700">
        <div>
          <p className="text-sm font-bold dark:text-slate-100">
            {t("Algorithm 1: Muon Optimizer", "算法 1：Muon 优化器")}
          </p>
          <p className="text-xs text-paper-800/50 dark:text-slate-400">
            {t("Verbatim from DeepSeek-V4 technical report — click a step or animate", "逐字来自 DeepSeek-V4 技术报告 — 点击步骤或动画演示")}
          </p>
        </div>
        <button
          onClick={handlePlay}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            playing
              ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
              : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-500/30"
          }`}
        >
          {playing ? t("Stop", "停止") : t("▶ Step through", "▶ 逐步演示")}
        </button>
      </div>

      {/* Require line */}
      <div className="px-4 py-2 bg-white dark:bg-slate-900 border-b border-paper-100 dark:border-slate-800 text-xs font-mono text-paper-800/60 dark:text-slate-400">
        <span className="font-bold text-paper-800 dark:text-slate-200">{t("Require:", "输入：")}</span>
        {t(
          " Learning rate η, momentum μ, weight decay λ, rescaling factor γ",
          " 学习率 η，动量 μ，权重衰减 λ，缩放因子 γ"
        )}
      </div>

      {/* Steps */}
      <div className="divide-y divide-paper-100 dark:divide-slate-800">
        {STEPS.map((step, i) => {
          const isActive = active === i;
          return (
            <button
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              className={`w-full text-left transition-all ${isActive ? step.color : "bg-white dark:bg-slate-900 hover:bg-paper-50 dark:hover:bg-slate-800/50"}`}
            >
              <div className="flex items-start gap-3 px-4 py-3">
                <span className={`flex-none w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold mt-0.5 transition-colors ${
                  isActive ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900" : "bg-paper-200 dark:bg-slate-700 text-paper-800/60 dark:text-slate-400"
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <code className={`text-sm font-mono ${isActive ? "dark:text-slate-100 font-semibold" : "dark:text-slate-300"}`}>
                      {lang === "en" ? step.line : step.lineZh}
                    </code>
                    {step.highlight && (
                      <span className="text-xs px-1.5 py-0.5 bg-amber-200 dark:bg-amber-500/30 text-amber-800 dark:text-amber-300 rounded font-medium">
                        {t("Key innovation", "核心创新")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-paper-800/50 dark:text-slate-400">
                    ▸ {lang === "en" ? step.label : step.labelZh}
                  </p>
                  {isActive && (
                    <p className="text-sm text-paper-800/70 dark:text-slate-300 mt-2 leading-relaxed">
                      {lang === "en" ? step.desc : step.descZh}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Key insight footer */}
      <div className="px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border-t border-amber-200 dark:border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
        <strong>{t("vs Adam: ", "vs Adam：")}</strong>
        {t(
          "Adam tracks gradient magnitude per-parameter (scale-dependent). Muon orthogonalises the gradient matrix (scale-independent) — every weight matrix gets an update of consistent spectral norm, preventing large matrices from dominating training dynamics at 1.6T scale.",
          "Adam 逐参数追踪梯度幅度（尺度依赖）。Muon 正交化梯度矩阵（尺度无关）——每个权重矩阵获得一致谱范数的更新，防止大矩阵在 1.6T 规模训练中主导梯度动态。"
        )}
      </div>
    </div>
  );
}
