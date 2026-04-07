"use client";

import { Math } from "@/components/Math";
import { Widget } from "@/components/Widget";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { ELBOViz } from "@/components/widgets/ELBOViz";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function FastDLLMPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Fast Discrete Diffusion Language Models (Fast DLLM)",
            "Fast DLLM: 快速离散扩散语言模型"
          )}
        </h1>
        <p className="text-paper-800/50">Shi et al. &middot; 2025</p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "Masked diffusion LMs (LLaDA, MDLM) need many denoising steps at inference → slow. Fast DLLM speeds this up with: (1) an optimal denoising schedule that allocates more steps where they matter, (2) importance sampling to skip low-value steps, and (3) DualCache for KV reuse. Result: 3-10x fewer steps with minimal quality loss.",
              "掩码扩散语言模型 (LLaDA, MDLM) 在推理时需要很多去噪步骤 → 很慢。Fast DLLM 通过以下方式加速：(1) 最优去噪调度，在重要的地方分配更多步骤；(2) 重要性采样跳过低价值步骤；(3) DualCache 复用 KV。结果：步数减少 3-10 倍，质量损失极小。"
            )}
          </p>
        </section>

        {/* ============ FlowChart ============ */}
        <FlowChart
          title={t("Architecture Overview", "架构总览")}
          steps={[
            {
              title: t("Problem: Diffusion LMs are slow at inference", "问题：扩散语言模型推理慢"),
              subtitle: t("100+ denoising steps, each = full forward pass", "100+ 去噪步骤，每步 = 完整前向传播"),
              color: "rose",
            },
            {
              title: t("Insight: Not all steps are equally important", "洞察：不是所有步骤同等重要"),
              subtitle: t("Early steps (high noise) contribute much more to quality than late steps", "早期步骤 (高噪声) 对质量贡献远大于后期步骤"),
              color: "amber",
            },
            {
              title: t("Method: Three acceleration techniques", "方法：三种加速技术"),
              color: "blue",
              children: [
                { title: t("Optimal Schedule", "最优调度"), subtitle: t("Concentrate steps where L_t is large", "在 L_t 大的地方集中步骤"), color: "blue" },
                { title: t("Importance Sampling", "重要性采样"), subtitle: t("Probabilistically skip low-value steps", "概率性跳过低价值步骤"), color: "green" },
                { title: "DualCache", subtitle: t("Reuse KV across denoising steps", "跨去噪步骤复用 KV"), color: "purple" },
              ],
            },
            {
              title: t("Result: 3-10x speedup, near-lossless quality", "结果：3-10 倍加速，几乎无质量损失"),
              color: "green",
            },
          ]}
          arrows={[
            t("Observation", "观察"),
            t("Solution", "解决方案"),
            undefined,
          ]}
          highlights={[
            { text: t("10 steps ≈ 100 steps quality", "10 步 ≈ 100 步质量"), color: "green" },
            { text: t("Compatible with any masked diffusion LM", "兼容任意掩码扩散语言模型"), color: "blue" },
          ]}
        />

        {/* ============ Background ============ */}
        <h2>{t("1. Background: The Speed Problem", "1. 背景：速度问题")}</h2>

        <p>
          {t(
            "In masked diffusion LMs, generation requires T denoising steps. At each step, the model does a full forward pass through all layers to predict masked tokens. With T=100, generating a sequence takes 100x more compute than a single AR forward pass.",
            "在掩码扩散语言模型中，生成需要 T 步去噪。每一步，模型都要经过所有层的完整前向传播来预测被掩码的 token。T=100 时，生成一个序列的计算量是单次 AR 前向传播的 100 倍。"
          )}
        </p>

        <Math
          display
          label={t("Cost comparison", "成本比较")}
          tex="\text{AR cost} = L \times C_{\text{forward}} \quad \text{vs} \quad \text{Diffusion cost} = T \times C_{\text{forward}}"
        />

        <Collapsible title={t("Variable breakdown", "变量拆解")}>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-2">
              <Math tex="L" />
              <span>{t("Sequence length (e.g. 256 tokens)", "序列长度 (如 256 个 token)")}</span>
              <Math tex="T" />
              <span>{t("Number of denoising steps (e.g. 100)", "去噪步数 (如 100)")}</span>
              <Math tex="C_{\text{forward}}" />
              <span>{t("Cost of one forward pass (similar for both, ignoring KV-cache)", "一次前向传播的成本 (两者类似，忽略 KV-cache)")}</span>
            </div>
            <p className="p-3 bg-amber-50 rounded border border-amber-200 mt-3">
              {t(
                "When T < L, diffusion is actually cheaper! But naive reduction of T (uniform schedule with fewer steps) causes severe quality degradation. Fast DLLM solves this.",
                "当 T < L 时，扩散实际上更便宜！但简单减少 T (更少步骤的均匀调度) 会导致严重的质量下降。Fast DLLM 解决了这个问题。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Non-uniform importance ============ */}
        <h2>{t("2. Key Insight: Non-uniform Step Importance", "2. 关键洞察：步骤重要性不均匀")}</h2>

        <p>
          {t(
            "The contribution of each denoising step to the overall ELBO is highly non-uniform:",
            "每个去噪步骤对整体 ELBO 的贡献高度不均匀："
          )}
        </p>

        <Math
          display
          label={t("Per-timestep ELBO contribution", "每时间步的 ELBO 贡献")}
          tex="L_t = -\mathbb{E}\left[\frac{1}{t \cdot L} \sum_{i: x_t^i = \texttt{[M]}} \log p_\theta(x_0^i \mid x_t)\right]"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[200px_1fr] gap-y-3 gap-x-2">
              <Math tex="L_t" />
              <span>{t("Loss at timestep t — measures how \"hard\" this denoising step is", "时间步 t 的损失 — 衡量这个去噪步骤有多「难」")}</span>

              <Math tex="t" />
              <span>{t("Timestep (noise level). High t = many masks = hard. Low t = few masks = easy", "时间步 (噪声水平)。高 t = 多掩码 = 难。低 t = 少掩码 = 容易")}</span>

              <Math tex="x_t^i = \texttt{[M]}" />
              <span>{t("Only masked positions contribute to the loss", "只有被掩码的位置贡献损失")}</span>
            </div>
            <p className="p-3 bg-blue-50 rounded border border-blue-200 mt-3">
              <strong>{t("Intuition", "直觉")}</strong>: {t(
                "Early steps (high t) have high L_t because the model sees few tokens and must guess a lot. Late steps (low t) have low L_t because almost everything is revealed — just filling in 1-2 obvious tokens.",
                "早期步骤 (高 t) 有高 L_t，因为模型看到很少的 token 需要猜很多。后期步骤 (低 t) 有低 L_t，因为几乎所有东西都已揭示 — 只需填入 1-2 个明显的 token。"
              )}
            </p>
          </div>
        </Collapsible>

        <Widget
          title={t("Interactive: Per-step ELBO Contribution", "交互：每步 ELBO 贡献")}
          description={t("Hover to see how much each timestep contributes", "悬停查看每个时间步的贡献")}
        >
          <ELBOViz />
        </Widget>

        {/* ============ Optimal Schedule ============ */}
        <h2>{t("3. Optimal Denoising Schedule", "3. 最优去噪调度")}</h2>

        <p>
          {t(
            "Instead of uniform timesteps, Fast DLLM places steps proportionally to their importance using the inverse CDF:",
            "Fast DLLM 不使用均匀时间步，而是通过逆 CDF 按重要性比例放置步骤："
          )}
        </p>

        <Math
          display
          label={t("Cumulative importance function", "累积重要性函数")}
          tex="F(t) = \frac{\int_0^t L_s \, ds}{\int_0^1 L_s \, ds}"
        />

        <Math
          display
          label={t("Optimal schedule via inverse CDF", "通过逆 CDF 得到最优调度")}
          tex="t_k = F^{-1}\!\left(\frac{k}{K}\right), \quad k = 0, 1, \ldots, K"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-2">
              <Math tex="F(t)" />
              <span>{t("Cumulative importance up to time t. F(0)=0, F(1)=1", "到时间 t 的累积重要性。F(0)=0, F(1)=1")}</span>

              <Math tex="L_s" />
              <span>{t("Per-step loss at time s (from Section 2)", "时间 s 的每步损失 (来自第 2 节)")}</span>

              <Math tex="F^{-1}" />
              <span>{t("Inverse CDF — finds the time t where cumulative importance = target", "逆 CDF — 找到累积重要性等于目标值的时间 t")}</span>

              <Math tex="K" />
              <span>{t("Total number of denoising steps we want to use (e.g. 10)", "我们想使用的总去噪步数 (如 10)")}</span>

              <Math tex="t_k" />
              <span>{t("The k-th timestep in our schedule", "调度中的第 k 个时间步")}</span>
            </div>
          </div>
        </Collapsible>

        <Collapsible title={t("Concrete example: Why this works", "具体例子：为什么有效")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Suppose L_t looks like: high at t=0.8-1.0, medium at t=0.4-0.8, low at t=0-0.4. With K=4 steps:",
                "假设 L_t 分布：t=0.8-1.0 时高，t=0.4-0.8 时中等，t=0-0.4 时低。K=4 步时："
              )}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-paper-100 rounded">
                <div className="font-semibold text-xs mb-1">{t("Uniform schedule", "均匀调度")}</div>
                <div className="font-mono text-xs">
                  t = [1.0, 0.75, 0.50, 0.25, 0.0]<br/>
                  {t("Equal spacing, wastes steps in low-L region", "等间距，在低 L 区域浪费步骤")}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="font-semibold text-xs mb-1">{t("Optimal schedule", "最优调度")}</div>
                <div className="font-mono text-xs">
                  t = [1.0, 0.90, 0.78, 0.55, 0.0]<br/>
                  {t("Dense in high-L region, sparse in low-L", "在高 L 区域密集，低 L 区域稀疏")}
                </div>
              </div>
            </div>
            <p className="p-3 bg-amber-50 rounded border border-amber-200">
              {t(
                "Each step in the optimal schedule handles an equal share of the total importance. This means no compute is wasted on easy steps.",
                "最优调度中每步处理总重要性的等份。这意味着没有计算浪费在简单的步骤上。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Importance Sampling ============ */}
        <h2>{t("4. Importance Sampling for Step Skipping", "4. 重要性采样跳步")}</h2>

        <p>
          {t(
            "Beyond scheduling, Fast DLLM can skip steps entirely. The idea: if a step contributes very little to quality, we can skip it with high probability:",
            "除了调度之外，Fast DLLM 还可以完全跳过某些步骤。思路：如果一个步骤对质量贡献很小，我们可以高概率跳过它："
          )}
        </p>

        <Math
          display
          label={t("Skip probability", "跳过概率")}
          tex="P(\text{execute step } k) = \min\!\left(1,\; \frac{L_{t_k} \cdot K}{\sum_{j=1}^{K} L_{t_j}}\right)"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[200px_1fr] gap-y-3 gap-x-2">
              <Math tex="P(\text{execute step } k)" />
              <span>{t("Probability of actually running step k", "实际执行步骤 k 的概率")}</span>

              <Math tex="L_{t_k}" />
              <span>{t("Importance of step k (its ELBO contribution)", "步骤 k 的重要性 (其 ELBO 贡献)")}</span>

              <Math tex="K" />
              <span>{t("Total steps in the schedule", "调度中的总步数")}</span>

              <span className="font-mono text-xs text-blue-600">min(1, ...)</span>
              <span>{t("Cap at 1 — important steps are always executed", "上限为 1 — 重要步骤总是执行")}</span>
            </div>
            <p className="p-3 bg-amber-50 rounded border border-amber-200 mt-3">
              {t(
                "Steps with above-average importance (L_tk > average) → probability = 1, always run. Steps with below-average importance → run with reduced probability. Reweighting keeps the estimate unbiased.",
                "高于平均重要性的步骤 (L_tk > 平均) → 概率 = 1，总是执行。低于平均重要性的步骤 → 以降低的概率执行。重新加权保持估计无偏。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ DualCache ============ */}
        <h2>{t("5. DualCache: KV Cache for Diffusion", "5. DualCache: 扩散模型的 KV 缓存")}</h2>

        <p>
          {t(
            "Standard AR models use KV-cache to avoid recomputing key/value projections. But diffusion models change all token representations at each step — so KV-cache seems impossible. Fast DLLM's insight: tokens that are already unmasked DON'T change much between steps.",
            "标准 AR 模型使用 KV-cache 避免重新计算 key/value 投影。但扩散模型在每步都改变所有 token 的表示 — 所以 KV-cache 似乎不可能。Fast DLLM 的洞察：已经去掩码的 token 在步骤之间变化不大。"
          )}
        </p>

        <Math
          display
          label={t("DualCache split", "DualCache 分割")}
          tex="\text{KV}_{t} = \underbrace{\text{KV}_{\text{unmasked}}}_{\text{cached from step } t+1} \cup \underbrace{\text{KV}_{\text{masked}}}_{\text{recomputed at step } t}"
        />

        <Collapsible title={t("Why this approximation works", "为什么这个近似有效")}>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "Between step t+1 and t, typically only a few tokens get newly unmasked. The representations of already-unmasked tokens change minimally. So we can reuse their KV projections and only recompute KV for the newly changed tokens. This saves ~50-80% of compute per step.",
                "从步骤 t+1 到 t，通常只有少数 token 被新去掩码。已经去掩码的 token 的表示变化很小。所以我们可以复用它们的 KV 投影，只重新计算新变化 token 的 KV。这节省了每步约 50-80% 的计算。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Results ============ */}
        <h2>{t("6. Experiments & Results", "6. 实验与结果")}</h2>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-paper-200">
                <th className="text-left py-2 pr-4">{t("Method", "方法")}</th>
                <th className="text-center py-2 pr-4">{t("Steps", "步数")}</th>
                <th className="text-center py-2 pr-4">PPL</th>
                <th className="text-center py-2">{t("Speedup", "加速比")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">MDLM ({t("uniform", "均匀")})</td>
                <td className="text-center py-2 pr-4">100</td>
                <td className="text-center py-2 pr-4">31.2</td>
                <td className="text-center py-2">1x</td>
              </tr>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">{t("Uniform (fewer steps)", "均匀 (更少步数)")}</td>
                <td className="text-center py-2 pr-4">25</td>
                <td className="text-center py-2 pr-4">35.4</td>
                <td className="text-center py-2">4x</td>
              </tr>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">{t("Uniform (fewer steps)", "均匀 (更少步数)")}</td>
                <td className="text-center py-2 pr-4">10</td>
                <td className="text-center py-2 pr-4">45.8</td>
                <td className="text-center py-2">10x</td>
              </tr>
              <tr className="bg-blue-50/50">
                <td className="py-2 pr-4 font-medium">Fast DLLM ({t("adaptive", "自适应")})</td>
                <td className="text-center py-2 pr-4">10</td>
                <td className="text-center py-2 pr-4 font-medium">33.1</td>
                <td className="text-center py-2 font-medium">10x</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Key result", "关键结果")}</strong>: {t(
              "With 10 steps (10x speedup), adaptive schedule: 33.1 PPL vs uniform's 45.8 PPL. Nearly matches the 100-step baseline (31.2). This makes diffusion LMs practical for real-time applications.",
              "10 步 (10 倍加速)，自适应调度：33.1 PPL vs 均匀的 45.8 PPL。几乎匹配 100 步基线 (31.2)。这使得扩散语言模型在实时应用中变得实用。"
            )}
          </p>
        </div>

        {/* ============ Limitations ============ */}
        <h2>{t("7. Limitations & Future Work", "7. 局限性与未来工作")}</h2>

        <ul>
          <li>
            <strong>{t("Schedule estimation", "调度估计")}</strong>: {t("Need to estimate L_t on a validation set first — adds a pre-processing step", "需要先在验证集上估计 L_t — 增加了预处理步骤")}
          </li>
          <li>
            <strong>{t("DualCache approximation", "DualCache 近似")}</strong>: {t("Reusing unmasked KV is an approximation that can degrade at very few steps", "复用未掩码 KV 是一种近似，在步骤极少时可能退化")}
          </li>
          <li>
            <strong>{t("Distillation unexplored", "蒸馏未探索")}</strong>: {t("Could potentially learn to generate in fewer steps via distillation (like in image diffusion)", "可能通过蒸馏学习用更少步骤生成 (类似图像扩散)")}
          </li>
        </ul>

        {/* ============ Connections ============ */}
        <h2>{t("8. Connections to Other Work", "8. 与其他工作的联系")}</h2>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`/papers/llada`} className="font-semibold text-blue-600 hover:underline">LLaDA</Link>
            <span className="text-xs text-paper-800/40 ml-2">/ </span>
            <Link href={`/papers/mdlm`} className="font-semibold text-blue-600 hover:underline">MDLM</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Fast DLLM is compatible with any masked diffusion LM — it's a sampling strategy, not a new model. Drop it into LLaDA or MDLM for instant speedup.",
                "Fast DLLM 兼容任何掩码扩散语言模型 — 它是采样策略，不是新模型。将其应用于 LLaDA 或 MDLM 即可获得加速。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`/papers/block-diffusion`} className="font-semibold text-blue-600 hover:underline">Block Diffusion</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Addresses speed from a different angle (block-level AR). Both can be combined: block diffusion with Fast DLLM's adaptive schedule within each block.",
                "从不同角度解决速度问题 (块级 AR)。两者可以结合：在每个块内使用 Fast DLLM 的自适应调度。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <span className="font-semibold text-paper-800">DDIM / DPM-Solver</span>
            <span className="text-xs text-paper-800/40 ml-2">{t("(image diffusion)", "(图像扩散)")}</span>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Analogous works in continuous image diffusion that also optimize the denoising schedule. Fast DLLM adapts these ideas to the discrete (masked) setting.",
                "连续图像扩散中的类似工作，也优化去噪调度。Fast DLLM 将这些思想适配到离散 (掩码) 设置。"
              )}
            </p>
          </div>
        </div>

        {/* ============ Resources ============ */}
        <h2>{t("9. Additional Resources", "9. 补充资源")}</h2>

        <div className="space-y-2 my-4">
          <a href="https://arxiv.org/abs/2505.22618" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">Fast dLLM (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Original paper", "原始论文")}</span>
          </a>
          <a href="https://arxiv.org/abs/2406.07524" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">MDLM (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("The base model this accelerates", "被加速的基础模型")}</span>
          </a>
        </div>
      </article>
    </div>
  );
}
