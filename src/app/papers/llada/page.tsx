"use client";

import { Math } from "@/components/Math";
import { Widget } from "@/components/Widget";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { MaskDiffusionViz } from "@/components/widgets/MaskDiffusionViz";
import { DenoisingStepsViz } from "@/components/widgets/DenoisingStepsViz";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function LLaDAPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "LLaDA: Large Language Diffusion with mAsking",
            "LLaDA: 基于掩码的大语言扩散模型"
          )}
        </h1>
        <p className="text-paper-800/50">
          Nie et al. &middot; 2025 &middot;{" "}
          <a
            href="https://arxiv.org/abs/2502.09992"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 2502.09992
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "LLaDA treats language modeling as a masked diffusion process: the forward process randomly masks tokens, and the reverse process learns to predict all masked tokens simultaneously. Unlike AR models that generate left-to-right, LLaDA can fill in tokens in any order. Scaled to 8B parameters, it matches LLaMA3 on many benchmarks.",
              "LLaDA 将语言建模视为掩码扩散过程：前向过程随机掩码 token，逆向过程学习同时预测所有被掩码的 token。与从左到右生成的 AR 模型不同，LLaDA 可以以任意顺序填充 token。扩展到 8B 参数后，在多项 benchmark 上可与 LLaMA3 媲美。"
            )}
          </p>
        </section>

        {/* ============ Architecture Overview FlowChart ============ */}
        <FlowChart
          title={t("Architecture Overview", "架构总览")}
          steps={[
            {
              title: t("Problem: AR LMs have inherent limitations", "问题：AR 语言模型有固有局限"),
              subtitle: t("Unidirectional, sequential, error accumulation", "单向、串行、误差累积"),
              color: "rose",
            },
            {
              title: t("Core Idea: Masked Diffusion for Language", "核心思路：用掩码扩散做语言建模"),
              subtitle: t("Masking = natural \"noise\" for discrete tokens", "掩码 = 离散 token 的天然「噪声」"),
              color: "blue",
              children: [
                { title: t("Forward Process", "前向过程"), subtitle: t("Progressively mask tokens with probability t", "以概率 t 逐步掩码 token"), color: "blue" },
                { title: t("Reverse Process", "逆向过程"), subtitle: t("Predict all [MASK] positions in parallel", "并行预测所有 [MASK] 位置"), color: "blue" },
              ],
            },
            {
              title: t("Architecture: Standard Transformer (like LLaMA)", "架构：标准 Transformer (类似 LLaMA)"),
              subtitle: t("Bidirectional attention (no causal mask) + RoPE + RMSNorm + SwiGLU", "双向注意力 (无因果掩码) + RoPE + RMSNorm + SwiGLU"),
              color: "green",
            },
            {
              title: t("Training: Variable-rate MLM", "训练：变率掩码语言建模"),
              subtitle: t("Cross-entropy on masked positions, t ~ Uniform(0,1)", "掩码位置的交叉熵损失，t ~ Uniform(0,1)"),
              color: "amber",
            },
            {
              title: t("Generation: Iterative Unmasking", "生成：迭代去掩码"),
              subtitle: t("T steps: unmask highest-confidence tokens first", "T 步：优先去掩码置信度最高的 token"),
              color: "purple",
            },
          ]}
          arrows={[
            t("Insight", "洞察"),
            t("Design choice", "设计选择"),
            t("How to learn", "如何学习"),
            t("How to generate", "如何生成"),
          ]}
          highlights={[
            { text: t("8B params, competitive with LLaMA3", "8B 参数，可与 LLaMA3 媲美"), color: "green" },
            { text: t("Bidirectional context", "双向上下文"), color: "blue" },
            { text: t("Parallel decoding potential", "并行解码潜力"), color: "purple" },
          ]}
        />

        {/* ============ Section 1: Background ============ */}
        <h2>{t("1. Background & Motivation", "1. 背景与动机")}</h2>

        <p>
          {t(
            "Autoregressive (AR) LLMs like GPT generate tokens one-by-one, left to right. This is the dominant paradigm, but it has inherent limitations:",
            "像 GPT 这样的自回归 (AR) LLM 从左到右逐个生成 token。这是主流范式，但有固有的局限性："
          )}
        </p>
        <ul>
          <li>
            <strong>{t("Unidirectional", "单向性")}</strong>: {t("can only condition on left context — can't \"look ahead\"", "只能以左侧上下文为条件 — 不能「向前看」")}
          </li>
          <li>
            <strong>{t("Sequential decoding", "串行解码")}</strong>: {t("generating N tokens requires N forward passes, can't parallelize", "生成 N 个 token 需要 N 次前向传播，无法并行")}
          </li>
          <li>
            <strong>{t("Error accumulation", "误差累积")}</strong>: {t("mistakes in early tokens propagate to all later tokens", "早期 token 的错误会传播到后续所有 token")}
          </li>
          <li>
            <strong>{t("Fixed generation order", "固定生成顺序")}</strong>: {t("always left→right, even when later tokens are more certain", "总是从左到右，即使后面的 token 更确定")}
          </li>
        </ul>

        <p>
          {t(
            "Continuous diffusion models (like DALL-E for images) have shown that iterative denoising can be a powerful generative paradigm. But text is discrete — you can't add Gaussian noise to words. LLaDA's key insight: masking IS the natural noise for discrete tokens.",
            "连续扩散模型 (如用于图像的 DALL-E) 已经证明迭代去噪是一种强大的生成范式。但文本是离散的 — 你不能给文字加高斯噪声。LLaDA 的关键洞察：掩码就是离散 token 的天然噪声。"
          )}
        </p>

        {/* ============ Section 2: Forward Process ============ */}
        <h2>{t("2. Forward Process: Progressive Masking", "2. 前向过程：渐进式掩码")}</h2>

        <p>
          {t(
            "Given a clean sequence, the forward process independently masks each token with probability t:",
            "给定一个干净的序列，前向过程以概率 t 独立地掩码每个 token："
          )}
        </p>

        <Math
          display
          label={t("Forward transition kernel", "前向转移核")}
          tex="q(x_t^i \mid x_0^i) = \begin{cases} x_0^i & \text{with probability } 1 - t \\ \texttt{[MASK]} & \text{with probability } t \end{cases}"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-2">
              <Math tex="x_0^i" />
              <span>{t("The original (clean) token at position i", "位置 i 的原始 (干净) token")}</span>

              <Math tex="x_t^i" />
              <span>{t("The token at position i at noise level t (either original or [MASK])", "在噪声水平 t 下位置 i 的 token (原始或 [MASK])")}</span>

              <Math tex="t \in [0, 1]" />
              <span>{t("Noise level / timestep. t=0 means clean, t=1 means fully masked", "噪声水平 / 时间步。t=0 表示干净，t=1 表示完全掩码")}</span>

              <Math tex="q(\cdot \mid \cdot)" />
              <span>{t("The forward transition distribution — how we add noise", "前向转移分布 — 我们如何添加噪声")}</span>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "Key properties of this forward process:",
            "这个前向过程的关键特性："
          )}
        </p>
        <ul>
          <li>
            {t("At t=0, the sequence is fully clean", "在 t=0 时，序列完全干净")}
          </li>
          <li>
            {t("At t=1, every token is [MASK]", "在 t=1 时，每个 token 都是 [MASK]")}
          </li>
          <li>
            {t("Masking is independent across positions — each token decides on its own", "掩码在各位置间独立 — 每个 token 自行决定")}
          </li>
          <li>
            {t("Expected number of masked tokens at time t: t × L", "在时间 t 时掩码 token 的期望数量：t × L")}
          </li>
        </ul>

        <Math
          display
          label={t("Joint forward distribution (all positions independent)", "联合前向分布 (所有位置独立)")}
          tex="q(x_t \mid x_0) = \prod_{i=1}^{L} q(x_t^i \mid x_0^i)"
        />

        <Collapsible title={t("Concrete example: Forward process with real numbers", "具体例子：带真实数字的前向过程")} defaultOpen>
          <p className="text-sm mb-3">
            {t(
              "Take the sentence \"The cat sat on the mat\" (L=6 tokens). Each token independently decides whether to mask:",
              "取句子 \"The cat sat on the mat\" (L=6 个 token)。每个 token 独立决定是否被掩码："
            )}
          </p>
          <div className="text-sm space-y-2">
            <div className="p-2 bg-paper-100 rounded font-mono text-xs">
              <div><strong>t = 0.0</strong>: {t("mask prob = 0%", "掩码概率 = 0%")} → The cat sat on the mat</div>
              <div className="text-paper-800/40 ml-4">{t("Expected masked: 0×6 = 0 tokens", "期望掩码数: 0×6 = 0 个 token")}</div>
            </div>
            <div className="p-2 bg-paper-100 rounded font-mono text-xs">
              <div><strong>t = 0.25</strong>: {t("mask prob = 25%", "掩码概率 = 25%")} → The cat sat [M] the mat</div>
              <div className="text-paper-800/40 ml-4">{t("Expected: 0.25×6 = 1.5 tokens (got 1 here — it's stochastic!)", "期望: 0.25×6 = 1.5 个 token (这里得到 1 — 是随机的！)")}</div>
            </div>
            <div className="p-2 bg-paper-100 rounded font-mono text-xs">
              <div><strong>t = 0.5</strong>: {t("mask prob = 50%", "掩码概率 = 50%")} → The [M] sat [M] [M] mat</div>
              <div className="text-paper-800/40 ml-4">{t("Expected: 0.5×6 = 3 tokens", "期望: 0.5×6 = 3 个 token")}</div>
            </div>
            <div className="p-2 bg-paper-100 rounded font-mono text-xs">
              <div><strong>t = 0.75</strong>: {t("mask prob = 75%", "掩码概率 = 75%")} → [M] [M] sat [M] [M] [M]</div>
              <div className="text-paper-800/40 ml-4">{t("Expected: 0.75×6 = 4.5 tokens", "期望: 0.75×6 = 4.5 个 token")}</div>
            </div>
            <div className="p-2 bg-paper-100 rounded font-mono text-xs">
              <div><strong>t = 1.0</strong>: {t("mask prob = 100%", "掩码概率 = 100%")} → [M] [M] [M] [M] [M] [M]</div>
              <div className="text-paper-800/40 ml-4">{t("Expected: 1.0×6 = 6 tokens (deterministic)", "期望: 1.0×6 = 6 个 token (确定性)")}</div>
            </div>
          </div>
        </Collapsible>

        <Widget
          title={t("Interactive: Forward & Reverse Masking Process", "交互：前向 & 逆向掩码过程")}
          description={t("Step through the masking/unmasking of tokens", "逐步观察 token 的掩码/去掩码过程")}
        >
          <MaskDiffusionViz />
        </Widget>

        {/* ============ Section 3: Reverse Process ============ */}
        <h2>{t("3. Reverse Process: Learning to Unmask", "3. 逆向过程：学习去掩码")}</h2>

        <p>
          {t(
            "The reverse process is a neural network that takes a partially masked sequence and predicts the original token at every masked position:",
            "逆向过程是一个神经网络，接收部分掩码的序列并预测每个掩码位置的原始 token："
          )}
        </p>

        <Math
          display
          label={t("Reverse process — predict clean tokens from noisy input", "逆向过程 — 从噪声输入预测干净 token")}
          tex="p_\theta(x_0 \mid x_t) = \prod_{i=1}^{L} p_\theta(x_0^i \mid x_t)"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-2">
              <Math tex="p_\theta" />
              <span>{t("Neural network (Transformer) with parameters θ", "参数为 θ 的神经网络 (Transformer)")}</span>

              <Math tex="x_t" />
              <span>{t("The noisy (partially masked) input sequence", "带噪声的 (部分掩码) 输入序列")}</span>

              <Math tex="x_0" />
              <span>{t("The clean target sequence we want to predict", "我们想预测的干净目标序列")}</span>

              <Math tex="\prod_{i=1}^{L}" />
              <span>{t("Independent prediction at each position — this is what enables parallelism", "每个位置独立预测 — 这是实现并行的关键")}</span>
            </div>
            <p className="p-3 bg-amber-50 rounded border border-amber-200 mt-3">
              <strong>{t("Key insight", "关键洞察")}</strong>: {t(
                "The model predicts ALL masked tokens independently in a single forward pass. This means we don't need to generate tokens one by one like in AR models.",
                "模型在单次前向传播中独立预测所有被掩码的 token。这意味着我们不需要像 AR 模型那样逐个生成 token。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 4: Training ============ */}
        <h2>{t("4. Training Objective", "4. 训练目标")}</h2>

        <Math
          display
          label={t("LLaDA training objective (ELBO-derived)", "LLaDA 训练目标 (ELBO 推导)")}
          tex="\mathcal{L}(\theta) = -\mathbb{E}_{t \sim \mathcal{U}(0,1)} \mathbb{E}_{x_t \sim q(x_t \mid x_0)} \left[ \frac{1}{t \cdot L} \sum_{i: x_t^i = \texttt{[M]}} \log p_\theta(x_0^i \mid x_t) \right]"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[220px_1fr] gap-y-3 gap-x-2">
              <Math tex="\mathcal{L}(\theta)" />
              <span>{t("The loss function we minimize", "我们最小化的损失函数")}</span>

              <Math tex="t \sim \mathcal{U}(0,1)" />
              <span>{t("Sample a random timestep uniformly from [0,1]. This means we train at ALL noise levels", "从 [0,1] 均匀采样随机时间步。这意味着我们在所有噪声水平上训练")}</span>

              <Math tex="x_t \sim q(x_t \mid x_0)" />
              <span>{t("Apply forward process: mask each token with probability t", "应用前向过程：以概率 t 掩码每个 token")}</span>

              <Math tex="\sum_{i: x_t^i = \texttt{[M]}}" />
              <span>{t("Sum only over masked positions — don't compute loss on unmasked tokens", "仅对掩码位置求和 — 不计算未掩码 token 的损失")}</span>

              <Math tex="\log p_\theta(x_0^i \mid x_t)" />
              <span>{t("Log probability of predicting the correct original token", "预测正确原始 token 的对数概率")}</span>

              <Math tex="\frac{1}{t \cdot L}" />
              <span>{t("Normalization: expected number of masked tokens is t×L", "归一化：掩码 token 的期望数量为 t×L")}</span>
            </div>
          </div>
        </Collapsible>

        <Collapsible title={t("Concrete example: Computing the loss for one sample", "具体例子：计算一个样本的损失")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>{t("Sentence: \"The cat sat on the mat\" (L=6)", "句子: \"The cat sat on the mat\" (L=6)")}</p>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2 bg-paper-100 rounded">
                <div>{t("Step 1: Sample t = 0.5", "步骤 1: 采样 t = 0.5")}</div>
              </div>
              <div className="p-2 bg-paper-100 rounded">
                <div>{t("Step 2: Mask with prob 0.5 → \"The [M] sat [M] [M] mat\"", "步骤 2: 以概率 0.5 掩码 → \"The [M] sat [M] [M] mat\"")}</div>
                <div className="text-paper-800/40">{t("Masked positions: {2, 4, 5} (cat, on, the)", "掩码位置: {2, 4, 5} (cat, on, the)")}</div>
              </div>
              <div className="p-2 bg-paper-100 rounded">
                <div>{t("Step 3: Model predicts at masked positions:", "步骤 3: 模型在掩码位置预测:")}</div>
                <div className="ml-2">
                  pos 2: p(cat|x_t) = 0.7 → log(0.7) = -0.357<br/>
                  pos 4: p(on|x_t)  = 0.9 → log(0.9) = -0.105<br/>
                  pos 5: p(the|x_t) = 0.6 → log(0.6) = -0.511
                </div>
              </div>
              <div className="p-2 bg-paper-100 rounded">
                <div>{t("Step 4: Loss = -1/(0.5×6) × (-0.357 + -0.105 + -0.511)", "步骤 4: Loss = -1/(0.5×6) × (-0.357 + -0.105 + -0.511)")}</div>
                <div className="ml-2">= -1/3 × (-0.973) = <strong>0.324</strong></div>
              </div>
            </div>
          </div>
        </Collapsible>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Connection to BERT", "与 BERT 的联系")}</strong>: {t(
              "LLaDA's training is essentially BERT with a variable masking rate (t~Uniform) instead of BERT's fixed 15%. By training across ALL masking rates, the model learns to handle any degree of partial information — from nearly complete to fully masked.",
              "LLaDA 的训练本质上是 BERT 加上可变掩码率 (t~Uniform)，而不是 BERT 的固定 15%。通过在所有掩码率上训练，模型学会处理任何程度的部分信息 — 从几乎完整到完全掩码。"
            )}
          </p>
        </div>

        {/* ============ Section 5: Generation ============ */}
        <h2>{t("5. Generation: Iterative Unmasking", "5. 生成：迭代去掩码")}</h2>

        <p>
          {t(
            "At inference, LLaDA starts from a fully masked sequence and iteratively unmasks tokens over T steps:",
            "在推理时，LLaDA 从完全掩码的序列开始，经过 T 步迭代去掩码 token："
          )}
        </p>

        <Math
          display
          label={t("Generation algorithm", "生成算法")}
          tex="\text{For } s = T, T{-}1, \ldots, 1: \quad x_{t_{s-1}} = \text{Unmask}(x_{t_s}, p_\theta, n_s)"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-2">
              <Math tex="T" />
              <span>{t("Total number of denoising steps (e.g. 10, 50, 100)", "总去噪步数 (如 10, 50, 100)")}</span>

              <Math tex="t_s" />
              <span>{t("Noise level at step s: t_T=1, t_0=0, uniformly spaced", "步骤 s 的噪声水平: t_T=1, t_0=0, 均匀分布")}</span>

              <Math tex="n_s" />
              <span>{t("Number of tokens to unmask at this step", "本步要去掩码的 token 数量")}</span>

              <span className="font-mono text-blue-600 text-xs">Unmask()</span>
              <span>{t("1) Model predicts all masked tokens; 2) Keep top-n_s by confidence; 3) Re-mask the rest", "1) 模型预测所有掩码 token；2) 保留置信度最高的 n_s 个；3) 重新掩码其余的")}</span>
            </div>
          </div>
        </Collapsible>

        <Math
          display
          label={t("Tokens to unmask per step", "每步去掩码的 token 数")}
          tex="n_s = \left\lfloor (t_s - t_{s-1}) \cdot L \right\rfloor"
        />

        <Collapsible title={t("Why unmask high-confidence tokens first?", "为什么优先去掩码高置信度的 token？")}>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "Think about it: if the model is 95% sure position 3 is \"sat\", but only 40% sure position 1 is \"The\" vs \"A\", it makes sense to commit to \"sat\" first. Then in the next step, with \"sat\" revealed as context, the model can make a better decision about position 1.",
                "想一想：如果模型对位置 3 是 \"sat\" 有 95% 的把握，但对位置 1 是 \"The\" 还是 \"A\" 只有 40% 的把握，那么先确定 \"sat\" 是有道理的。然后在下一步，有了 \"sat\" 作为上下文，模型可以更好地决定位置 1。"
              )}
            </p>
            <p className="p-3 bg-blue-50 rounded border border-blue-200">
              {t(
                "This is the opposite of AR, which always commits to the first token first, regardless of confidence. LLaDA can \"skip\" uncertain positions and come back to them later.",
                "这与 AR 相反，AR 总是先确定第一个 token，不管置信度如何。LLaDA 可以「跳过」不确定的位置，稍后再回来处理。"
              )}
            </p>
          </div>
        </Collapsible>

        <Widget
          title={t("Interactive: Iterative Denoising Process", "交互：迭代去噪过程")}
          description={t("Watch tokens get revealed step by step with confidence scores", "逐步观察 token 被揭示及其置信度")}
        >
          <DenoisingStepsViz />
        </Widget>

        {/* ============ Section 6: Architecture ============ */}
        <h2>{t("6. Architecture Details", "6. 架构细节")}</h2>

        <p>
          {t(
            "LLaDA uses a standard Transformer architecture (same as LLaMA), with one crucial difference:",
            "LLaDA 使用标准 Transformer 架构 (与 LLaMA 相同)，但有一个关键区别："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-paper-200">
                <th className="text-left py-2 pr-4">{t("Component", "组件")}</th>
                <th className="text-left py-2 pr-4">{t("LLaMA (AR)", "LLaMA (AR)")}</th>
                <th className="text-left py-2">{t("LLaDA (Diffusion)", "LLaDA (扩散)")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-paper-200 bg-blue-50/50">
                <td className="py-2 pr-4 font-medium">{t("Attention", "注意力")}</td>
                <td className="py-2 pr-4">{t("Causal (left-to-right)", "因果 (从左到右)")}</td>
                <td className="py-2 font-medium text-blue-700">{t("Bidirectional (full)", "双向 (全连接)")}</td>
              </tr>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">Positional Encoding</td>
                <td className="py-2 pr-4">RoPE</td>
                <td className="py-2">RoPE</td>
              </tr>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">Normalization</td>
                <td className="py-2 pr-4">RMSNorm</td>
                <td className="py-2">RMSNorm</td>
              </tr>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">Activation</td>
                <td className="py-2 pr-4">SwiGLU</td>
                <td className="py-2">SwiGLU</td>
              </tr>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">{t("Timestep conditioning", "时间步条件")}</td>
                <td className="py-2 pr-4">N/A</td>
                <td className="py-2">{t("Implicit (via masking ratio)", "隐式 (通过掩码比例)")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Why no causal mask?", "为什么没有因果掩码？")}</strong> {t(
              "AR models use causal masking because they generate left-to-right and shouldn't see future tokens. LLaDA generates all positions simultaneously, so every token needs to see every other token (including the [MASK] tokens) to make coordinated predictions. This is the same as BERT-style bidirectional attention.",
              "AR 模型使用因果掩码是因为它们从左到右生成，不应看到未来的 token。LLaDA 同时生成所有位置，所以每个 token 需要看到其他所有 token (包括 [MASK] token) 来做出协调的预测。这与 BERT 风格的双向注意力相同。"
            )}
          </p>
        </div>

        {/* ============ Section 7: SFT for Instruction Following ============ */}
        <h2>{t("7. Supervised Fine-tuning (SFT)", "7. 监督微调 (SFT)")}</h2>

        <p>
          {t(
            "For instruction following, LLaDA only masks the response tokens (not the prompt) during fine-tuning:",
            "为了实现指令跟随，LLaDA 在微调时只掩码回复的 token (不掩码提示)："
          )}
        </p>

        <Math
          display
          label={t("SFT: mask response only", "SFT: 仅掩码回复")}
          tex="\mathcal{L}_{\text{SFT}} = -\mathbb{E}_t \left[ \frac{1}{t \cdot L_r} \sum_{i \in \text{response}} \mathbf{1}[x_t^i = \texttt{M}] \cdot \log p_\theta(x_0^i \mid x_{\text{prompt}}, x_{t,\text{response}}) \right]"
        />

        <Collapsible title={t("Why mask only the response?", "为什么只掩码回复？")}>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "During inference, the prompt is always fully visible — we only need to generate the response. So training should match this: the model sees the full prompt and learns to denoise only the response part. This is analogous to how AR models compute loss only on the response tokens during SFT.",
                "在推理时，提示始终完全可见 — 我们只需要生成回复。所以训练应该匹配这一点：模型看到完整的提示，只学习对回复部分去噪。这类似于 AR 模型在 SFT 期间仅对回复 token 计算损失。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 8: Results ============ */}
        <h2>{t("8. Experiments & Results", "8. 实验与结果")}</h2>

        <p>{t("LLaDA was trained at two scales: 1.1B and 8B parameters.", "LLaDA 在两个规模上训练：1.1B 和 8B 参数。")}</p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-paper-200">
                <th className="text-left py-2 pr-4">{t("Model", "模型")}</th>
                <th className="text-left py-2 pr-4">{t("Type", "类型")}</th>
                <th className="text-center py-2 pr-4">{t("Params", "参数")}</th>
                <th className="text-center py-2 pr-4">MMLU</th>
                <th className="text-center py-2 pr-4">ARC-C</th>
                <th className="text-center py-2">HellaSwag</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">LLaMA3</td>
                <td className="py-2 pr-4 text-paper-800/50">AR</td>
                <td className="text-center py-2 pr-4">8B</td>
                <td className="text-center py-2 pr-4">65.3</td>
                <td className="text-center py-2 pr-4">53.7</td>
                <td className="text-center py-2">82.1</td>
              </tr>
              <tr className="border-b border-paper-200 bg-blue-50/50">
                <td className="py-2 pr-4 font-medium">LLaDA</td>
                <td className="py-2 pr-4 text-blue-600">{t("Diffusion", "扩散")}</td>
                <td className="text-center py-2 pr-4">8B</td>
                <td className="text-center py-2 pr-4 font-medium">67.0</td>
                <td className="text-center py-2 pr-4 font-medium">55.6</td>
                <td className="text-center py-2 font-medium">79.8</td>
              </tr>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">GPT-2</td>
                <td className="py-2 pr-4 text-paper-800/50">AR</td>
                <td className="text-center py-2 pr-4">1.5B</td>
                <td className="text-center py-2 pr-4">32.4</td>
                <td className="text-center py-2 pr-4">33.3</td>
                <td className="text-center py-2">71.3</td>
              </tr>
              <tr className="bg-blue-50/50">
                <td className="py-2 pr-4 font-medium">LLaDA</td>
                <td className="py-2 pr-4 text-blue-600">{t("Diffusion", "扩散")}</td>
                <td className="text-center py-2 pr-4">1.1B</td>
                <td className="text-center py-2 pr-4 font-medium">38.9</td>
                <td className="text-center py-2 pr-4 font-medium">38.2</td>
                <td className="text-center py-2 font-medium">62.1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Key takeaway", "关键结论")}</strong>: {t(
              "A diffusion LM can be competitive with AR models at scale. LLaDA 8B slightly outperforms LLaMA3 8B on MMLU and ARC-C — a strong signal that AR is not the only path to powerful LLMs.",
              "扩散语言模型在规模化后可以与 AR 模型竞争。LLaDA 8B 在 MMLU 和 ARC-C 上略优于 LLaMA3 8B — 这是一个强信号，说明 AR 不是通往强大 LLM 的唯一道路。"
            )}
          </p>
        </div>

        {/* ============ Section 9: Limitations & Future Work ============ */}
        <h2>{t("9. Limitations & Future Work", "9. 局限性与未来工作")}</h2>

        <ul>
          <li>
            <strong>{t("Inference speed", "推理速度")}</strong>: {t("Multiple denoising steps needed vs. AR's single pass per token. Mitigated by Fast DLLM's adaptive schedule.", "需要多步去噪，而 AR 每个 token 只需一次传播。可通过 Fast DLLM 的自适应调度缓解。")}
          </li>
          <li>
            <strong>{t("No KV-cache", "无 KV-cache")}</strong>: {t("Bidirectional attention means standard KV-cache doesn't work. Block Diffusion addresses this with block-level caching.", "双向注意力意味着标准 KV-cache 不适用。Block Diffusion 通过块级缓存解决了这个问题。")}
          </li>
          <li>
            <strong>{t("RLHF unexplored", "RLHF 未探索")}</strong>: {t("How to do reinforcement learning from human feedback with diffusion LMs is an open question.", "如何对扩散语言模型进行人类反馈的强化学习仍是开放问题。")}
          </li>
          <li>
            <strong>{t("Long-form generation", "长文本生成")}</strong>: {t("Performance on very long sequences (>4K tokens) not yet studied at scale.", "在超长序列 (>4K token) 上的表现尚未大规模研究。")}
          </li>
        </ul>

        {/* ============ Section 10: Connections ============ */}
        <h2>{t("10. Connections to Other Work", "10. 与其他工作的联系")}</h2>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`/papers/mdlm`} className="font-semibold text-blue-600 hover:underline">MDLM</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Provides the rigorous continuous-time ELBO theory that underpins LLaDA's training objective. MDLM's loss is essentially the same as LLaDA's, derived from first principles.",
                "提供了支撑 LLaDA 训练目标的严格连续时间 ELBO 理论。MDLM 的损失本质上与 LLaDA 相同，从基本原理推导而来。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`/papers/fast-dllm`} className="font-semibold text-blue-600 hover:underline">Fast DLLM</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Addresses LLaDA's main weakness — slow multi-step generation — with adaptive denoising schedules and importance sampling. Reduces steps by 3-10x.",
                "解决了 LLaDA 的主要弱点 — 多步生成慢 — 通过自适应去噪调度和重要性采样。将步数减少 3-10 倍。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`/papers/block-diffusion`} className="font-semibold text-blue-600 hover:underline">Block Diffusion</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Combines AR and diffusion at the block level. Can be seen as a generalization of LLaDA where B=L is one extreme (full diffusion = LLaDA) and B=1 is the other (pure AR).",
                "在块级别结合 AR 和扩散。可以看作 LLaDA 的推广，其中 B=L 是一个极端 (全扩散 = LLaDA)，B=1 是另一个极端 (纯 AR)。"
              )}
            </p>
          </div>
        </div>

        {/* ============ Section 11: Resources ============ */}
        <h2>{t("11. Additional Resources", "11. 补充资源")}</h2>

        <div className="space-y-2 my-4">
          <a href="https://arxiv.org/abs/2502.09992" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">LLaDA (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Original paper", "原始论文")}</span>
          </a>
          <a href="https://github.com/ML-GSAI/LLaDA" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">GitHub: ML-GSAI/LLaDA</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Official code", "官方代码")}</span>
          </a>
          <a href="https://arxiv.org/abs/2406.07524" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">MDLM (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Theoretical foundation paper", "理论基础论文")}</span>
          </a>
          <a href="https://arxiv.org/abs/2107.03006" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">D3PM (Austin et al. 2021)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Earlier discrete diffusion work", "早期离散扩散工作")}</span>
          </a>
        </div>
      </article>
    </div>
  );
}
