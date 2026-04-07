"use client";

import { Math } from "@/components/Math";
import { Widget } from "@/components/Widget";
import { Collapsible } from "@/components/Collapsible";
import { BlockGenerationViz } from "@/components/widgets/BlockGenerationViz";
import { AttentionMaskViz } from "@/components/widgets/AttentionMaskViz";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function BlockDiffusionPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Block Diffusion: Interpolating Between Autoregressive and Diffusion Language Models",
            "Block Diffusion: 在自回归与扩散语言模型之间插值"
          )}
        </h1>
        <p className="text-paper-800/50">Arriola et al. &middot; 2025</p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "Block Diffusion bridges AR and diffusion by splitting text into blocks. Blocks are generated left-to-right (AR-style), but tokens within each block are generated via masked diffusion (parallel). Block size B controls the tradeoff: B=1 is pure AR, B=L is pure diffusion.",
              "Block Diffusion 将文本分成块来融合 AR 和扩散。块间从左到右生成 (AR 风格)，块内 token 通过掩码扩散并行生成。块大小 B 控制权衡：B=1 是纯 AR，B=L 是纯扩散。"
            )}
          </p>
        </section>

        {/* ============ Section 1 ============ */}
        <h2>
          {t("1. The AR-Diffusion Spectrum", "1. AR-扩散 光谱")}
        </h2>

        <p>
          {t(
            "Two extremes of text generation:",
            "文本生成的两个极端："
          )}
        </p>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="border border-paper-200 rounded-lg p-4 bg-white">
            <h4 className="font-semibold text-sm mb-2">
              {t("Autoregressive (B = 1)", "自回归 (B = 1)")}
            </h4>
            <ul className="text-sm space-y-1 text-paper-800/70">
              <li>+ {t("Excellent long-range coherence", "优秀的长程连贯性")}</li>
              <li>+ {t("Strong benchmarks", "强大的 benchmark 表现")}</li>
              <li>- {t("Sequential: 1 token per step", "串行：每步 1 个 token")}</li>
              <li>- {t("Left-to-right only", "只能从左到右")}</li>
            </ul>
          </div>
          <div className="border border-paper-200 rounded-lg p-4 bg-white">
            <h4 className="font-semibold text-sm mb-2">
              {t("Full Diffusion (B = L)", "全扩散 (B = L)")}
            </h4>
            <ul className="text-sm space-y-1 text-paper-800/70">
              <li>+ {t("Parallel within block", "块内并行")}</li>
              <li>+ {t("Bidirectional context", "双向上下文")}</li>
              <li>- {t("Many denoising steps needed", "需要很多去噪步骤")}</li>
              <li>- {t("Weaker long-range coherence", "长程连贯性较弱")}</li>
            </ul>
          </div>
        </div>

        <p>
          {t(
            "Block Diffusion sits in between: block size B controls the tradeoff.",
            "Block Diffusion 位于两者之间：块大小 B 控制权衡。"
          )}
        </p>

        {/* ============ Section 2: Formulation ============ */}
        <h2>
          {t("2. Mathematical Formulation", "2. 数学公式")}
        </h2>

        <p>
          {t(
            "Partition a sequence of length L into blocks of size B:",
            "将长度为 L 的序列分成大小为 B 的块："
          )}
        </p>

        <Math
          display
          label={t("Block partition", "块划分")}
          tex="x = \underbrace{[x_1, \ldots, x_B]}_{\text{Block 1}}, \underbrace{[x_{B+1}, \ldots, x_{2B}]}_{\text{Block 2}}, \ldots, \underbrace{[x_{L-B+1}, \ldots, x_L]}_{\text{Block } L/B}"
        />

        <Collapsible title={t("Variable breakdown", "变量逐一解析")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-mono text-blue-600">x</span>
              <span>{t("The full sequence of L tokens", "完整序列，共 L 个 token")}</span>
              <span className="font-mono text-blue-600">L</span>
              <span>{t("Total sequence length (e.g. 256)", "总序列长度 (如 256)")}</span>
              <span className="font-mono text-blue-600">B</span>
              <span>{t("Block size — the key hyperparameter. Larger B = more parallel, less coherent", "块大小 — 核心超参数。B 越大 = 越并行，但连贯性越弱")}</span>
              <span className="font-mono text-blue-600">L/B</span>
              <span>{t("Number of blocks (must divide evenly)", "块的数量 (需要整除)")}</span>
            </div>
          </div>
        </Collapsible>

        <h3>{t("Block-level AR factorization", "块级别 AR 分解")}</h3>

        <Math
          display
          label={t("Outer loop: autoregressive over blocks", "外循环：块间自回归")}
          tex="p(x) = \prod_{b=1}^{L/B} p_\theta\!\left(\mathbf{x}^{(b)} \mid \mathbf{x}^{(<b)}\right)"
        />

        <Collapsible title={t("Variable breakdown", "变量逐一解析")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <Math tex="\mathbf{x}^{(b)}" />
              <span>{t("The b-th block of B tokens", "第 b 个块，包含 B 个 token")}</span>
              <Math tex="\mathbf{x}^{(<b)}" />
              <span>{t("All blocks before block b (the \"prefix\")", "块 b 之前的所有块（\"前缀\"）")}</span>
              <Math tex="p_\theta" />
              <span>{t("The neural network (Transformer) parameterized by θ", "由 θ 参数化的神经网络 (Transformer)")}</span>
            </div>
            <p className="p-3 bg-amber-50 rounded border border-amber-200 mt-3">
              {t(
                "This is exactly like standard AR, but at the block level. Each block conditions on all previous blocks, just like how each token conditions on all previous tokens in GPT.",
                "这和标准 AR 完全一样，只是在块级别操作。每个块以所有之前的块为条件，就像 GPT 中每个 token 以之前所有 token 为条件一样。"
              )}
            </p>
          </div>
        </Collapsible>

        <h3>{t("Within-block diffusion", "块内扩散")}</h3>

        <p>
          {t(
            "Within each block, we use masked diffusion (same as LLaDA/MDLM):",
            "在每个块内，使用掩码扩散 (和 LLaDA/MDLM 相同)："
          )}
        </p>

        <Math
          display
          label={t("Inner loop: masked diffusion within block", "内循环：块内掩码扩散")}
          tex="p_\theta\!\left(\mathbf{x}^{(b)} \mid \mathbf{x}^{(<b)}\right) = \int \prod_{s=1}^{T} p_\theta\!\left(\mathbf{x}_{t_{s-1}}^{(b)} \mid \mathbf{x}_{t_s}^{(b)},\, \mathbf{x}^{(<b)}\right) d\mathbf{x}_{t_1:t_{T-1}}"
        />

        <Collapsible title={t("Variable breakdown", "变量逐一解析")}>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <Math tex="T" />
              <span>{t("Number of denoising steps within this block", "该块内的去噪步数")}</span>
              <Math tex="\mathbf{x}_{t_s}^{(b)}" />
              <span>{t("Block b at noise level t_s (partially masked)", "块 b 在噪声水平 t_s 下 (部分掩码)")}</span>
              <Math tex="t_s" />
              <span>{t("Noise schedule: t_T=1 (fully masked) → t_0=0 (fully clean)", "噪声调度：t_T=1 (全掩码) → t_0=0 (全干净)")}</span>
            </div>
          </div>
        </Collapsible>

        <Collapsible title={t("Concrete example: B=2, L=6, T=2", "具体例子：B=2, L=6, T=2")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Generate \"The cat sat on the mat\" with B=2 (3 blocks), T=2 denoising steps per block:",
                "用 B=2 (3 个块)，每块 T=2 步去噪来生成 \"The cat sat on the mat\」："
              )}
            </p>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-paper-100 rounded">
                <div className="text-paper-800/50 mb-1">
                  {t("Block 1: start from [M][M], no prefix", "块 1: 从 [M][M] 开始，无前缀")}
                </div>
                <div>t=1.0: [M] [M]</div>
                <div>t=0.5: <span className="text-green-600 font-bold">The</span> [M] &nbsp; <span className="text-paper-800/40">({t("\"The\" has 0.92 confidence", "\"The\" 置信度 0.92")})</span></div>
                <div>t=0.0: The <span className="text-green-600 font-bold">cat</span> &nbsp; ✓</div>
              </div>
              <div className="p-3 bg-paper-100 rounded">
                <div className="text-paper-800/50 mb-1">
                  {t("Block 2: start from [M][M], prefix = \"The cat\"", "块 2: 从 [M][M] 开始，前缀 = \"The cat\"")}
                </div>
                <div>t=1.0: [M] [M] &nbsp; | &nbsp; prefix: The cat</div>
                <div>t=0.5: <span className="text-green-600 font-bold">sat</span> [M]</div>
                <div>t=0.0: sat <span className="text-green-600 font-bold">on</span> &nbsp; ✓</div>
              </div>
              <div className="p-3 bg-paper-100 rounded">
                <div className="text-paper-800/50 mb-1">
                  {t("Block 3: prefix = \"The cat sat on\"", "块 3: 前缀 = \"The cat sat on\"")}
                </div>
                <div>t=1.0: [M] [M] &nbsp; | &nbsp; prefix: The cat sat on</div>
                <div>t=0.5: <span className="text-green-600 font-bold">the</span> [M]</div>
                <div>t=0.0: the <span className="text-green-600 font-bold">mat</span> &nbsp; ✓</div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-200 mt-2">
              <p>
                {t(
                  "Total forward passes: 3 blocks × 2 steps = 6. Pure AR would need 6 steps too (one per token). But with B=4 and L=8: only 2 blocks × 2 steps = 4 passes for 8 tokens — that's the speedup!",
                  "总前向传播次数: 3 块 × 2 步 = 6。纯 AR 也需要 6 步 (每 token 一步)。但如果 B=4, L=8: 只需 2 块 × 2 步 = 4 次传播生成 8 个 token — 这就是加速！"
                )}
              </p>
            </div>
          </div>
        </Collapsible>

        <Widget
          title={t("Interactive: Block-by-Block Generation", "交互：逐块生成过程")}
          description={t(
            "Watch blocks get generated left-to-right with within-block diffusion",
            "观察块从左到右生成，块内使用扩散"
          )}
        >
          <BlockGenerationViz />
        </Widget>

        {/* ============ Section 3: Training Objective ============ */}
        <h2>{t("3. Training Objective", "3. 训练目标")}</h2>

        <p>
          {t(
            "The training loss is a masked-token-only cross-entropy, similar to LLaDA but with block-aware conditioning:",
            "训练损失是仅针对掩码 token 的交叉熵，类似 LLaDA 但有块级条件："
          )}
        </p>

        <Math
          display
          label={t("Block diffusion training loss", "Block Diffusion 训练损失")}
          tex="\mathcal{L}_{\text{block}}(\theta) = -\mathbb{E}_{x,m}\left[\sum_{i=1}^{L} \mathbf{1}[x_t^i = \texttt{[MASK]}] \log p_\theta(x_0^i \mid x_{<i},\, \mathbf{x}_{\text{block}(i)})\right]"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[180px_1fr] gap-y-3 gap-x-2">
              <Math tex="\mathcal{L}_{\text{block}}(\theta)" />
              <span>{t("The loss function we minimize during training", "训练时最小化的损失函数")}</span>

              <Math tex="\mathbb{E}_{x,m}" />
              <span>{t("Expectation over: training data x and random mask m", "在训练数据 x 和随机掩码 m 上求期望")}</span>

              <Math tex="\mathbf{1}[x_t^i = \texttt{[MASK]}]" />
              <span>{t("Indicator: only count loss for masked positions", "指示函数：只计算被掩码位置的损失")}</span>

              <Math tex="x_{<i}" />
              <span>{t("All tokens before position i in previous blocks (AR prefix)", "前面块中位置 i 之前的所有 token (AR 前缀)")}</span>

              <Math tex="\mathbf{x}_{\text{block}(i)}" />
              <span>{t("All tokens in the same block as position i (bidirectional context)", "与位置 i 同一块内的所有 token (双向上下文)")}</span>

              <Math tex="p_\theta(x_0^i \mid \cdot)" />
              <span>{t("Model's predicted probability of the true token at position i", "模型在位置 i 预测真实 token 的概率")}</span>
            </div>
            <p className="p-3 bg-amber-50 rounded border border-amber-200 mt-3">
              {t(
                "Key difference from LLaDA: the conditioning includes both the AR prefix (previous blocks) AND bidirectional context within the current block. This is what makes the attention mask design special.",
                "与 LLaDA 的关键区别：条件同时包括 AR 前缀 (之前的块) 和当前块内的双向上下文。这就是 attention mask 设计特殊的原因。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 4: Attention Mask ============ */}
        <h2>{t("4. Attention Mask Design (Figure 7)", "4. 注意力掩码设计 (图 7)")}</h2>

        <p>
          {t(
            "The heart of Block Diffusion is its specialized attention mask. During training, the input is the concatenation of the noisy sequence x_t and clean targets x_0. The mask combines three types of attention:",
            "Block Diffusion 的核心是其特殊的注意力掩码。训练时，输入是噪声序列 x_t 和干净目标 x_0 的拼接。掩码结合了三种注意力类型："
          )}
        </p>

        <div className="space-y-3 my-6">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-5 h-5 rounded bg-blue-300 border border-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sm">Block Diagonal</span>
              <p className="text-sm text-paper-800/70 mt-0.5">
                {t(
                  "Intra-block bidirectional attention among noisy tokens. Within the same noisy block, every token can see every other token — just like BERT. This enables parallel denoising within a block.",
                  "噪声 token 的块内双向注意力。在同一噪声块内，每个 token 都能看到其他所有 token — 就像 BERT 一样。这使得块内并行去噪成为可能。"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-5 h-5 rounded bg-green-300 border border-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sm">Offset Block Causal</span>
              <p className="text-sm text-paper-800/70 mt-0.5">
                {t(
                  "Noisy tokens attend to clean tokens in the corresponding block AND all preceding clean blocks. This is how the model sees the \"answer\" — x_t^(b) can look at x_0^(1), x_0^(2), ..., x_0^(b) to learn the denoising mapping.",
                  "噪声 token 关注对应块以及所有前面块的干净 token。这就是模型看到「答案」的方式 — x_t^(b) 可以看到 x_0^(1), x_0^(2), ..., x_0^(b) 来学习去噪映射。"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="w-5 h-5 rounded bg-orange-300 border border-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sm">Block Causal</span>
              <p className="text-sm text-paper-800/70 mt-0.5">
                {t(
                  "Standard left-to-right causal attention among clean tokens — exactly like GPT's causal mask. Clean block b can see clean blocks 1..b-1 and tokens to its left within block b.",
                  "干净 token 之间的标准从左到右因果注意力 — 和 GPT 的因果掩码完全一样。干净块 b 可以看到干净块 1..b-1 以及块 b 内左侧的 token。"
                )}
              </p>
            </div>
          </div>
        </div>

        <Widget
          title={t(
            "Interactive: Attention Mask Matrix (Figure 7)",
            "交互：注意力掩码矩阵 (图 7)"
          )}
          description={t(
            "Adjust block size, number of blocks, and switch between training/inference mode. Hover over cells to see the attention type.",
            "调整块大小、块数量，切换训练/推理模式。鼠标悬停查看注意力类型。"
          )}
        >
          <AttentionMaskViz />
        </Widget>

        <Collapsible title={t("Why this mask design works — step by step", "为什么这个掩码设计有效 — 逐步解析")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Consider block 2 (tokens 3-4) during training. The model receives:",
                "考虑训练时的块 2 (token 3-4)。模型接收："
              )}
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>{t("Noisy input", "噪声输入")}</strong>: <Math tex="x_t^3, x_t^4" /> — {t("these might be [M], [M] or partially revealed", "这些可能是 [M], [M] 或部分可见")}
              </li>
              <li>
                <strong>{t("Intra-block context", "块内上下文")}</strong> <span className="text-blue-600">(Blue)</span>: <Math tex="x_t^3 \leftrightarrow x_t^4" /> {t("see each other bidirectionally", "双向互相可见")}
              </li>
              <li>
                <strong>{t("Clean prefix", "干净前缀")}</strong> <span className="text-green-600">(Green)</span>: {t("can see", "可以看到")} <Math tex="x_0^1, x_0^2" /> {t("(block 1's clean tokens) AND", "(块 1 的干净 token) 以及")} <Math tex="x_0^3, x_0^4" /> {t("(own block's clean tokens)", "(自己块的干净 token)")}
              </li>
              <li>
                <strong>{t("Prediction", "预测")}</strong>: {t("output probability for the masked positions in block 2", "输出块 2 中被掩码位置的概率")}
              </li>
            </ol>
            <p className="p-3 bg-amber-50 rounded border border-amber-200 mt-2">
              {t(
                "At inference, the clean tokens of previous blocks are cached (like KV-cache in standard AR). Only the current block's noisy tokens go through the full attention computation. This is the DualCache mechanism from Fast-dLLM.",
                "在推理时，之前块的干净 token 被缓存 (类似标准 AR 中的 KV-cache)。只有当前块的噪声 token 需要完整的注意力计算。这就是 Fast-dLLM 的 DualCache 机制。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 5: Inference ============ */}
        <h2>{t("5. Inference Process (Figure 3)", "5. 推理过程 (图 3)")}</h2>

        <p>
          {t(
            "At inference, blocks are decoded sequentially, and each decoded block is cached:",
            "推理时，块按顺序解码，每个解码完的块被缓存："
          )}
        </p>

        <Math
          display
          label={t("Inference: block-by-block decoding", "推理：逐块解码")}
          tex="\text{For } b = 1, 2, \ldots, L/B: \quad \hat{\mathbf{x}}^{(b)} = \text{Denoise}_T\!\left(\mathbf{x}_T^{(b)} = [\texttt{M}]^B \;\middle|\; \hat{\mathbf{x}}^{(<b)}_{\text{cached}}\right)"
        />

        <Collapsible title={t("Variable breakdown", "变量逐一解析")}>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[160px_1fr] gap-2">
              <Math tex="\hat{\mathbf{x}}^{(b)}" />
              <span>{t("The decoded (final) tokens for block b", "块 b 的解码 (最终) token")}</span>
              <Math tex="\text{Denoise}_T" />
              <span>{t("Run T denoising steps on this block", "对该块运行 T 步去噪")}</span>
              <Math tex="[\texttt{M}]^B" />
              <span>{t("Start with B fully masked tokens", "从 B 个全掩码 token 开始")}</span>
              <Math tex="\hat{\mathbf{x}}^{(<b)}_{\text{cached}}" />
              <span>{t("Previously decoded blocks, stored in KV-cache", "之前解码的块，存储在 KV-cache 中")}</span>
            </div>
          </div>
        </Collapsible>

        <h3>{t("DualCache: Two-level KV Cache", "DualCache: 两级 KV 缓存")}</h3>

        <p>
          {t(
            "Block Diffusion uses two types of caching to speed up inference:",
            "Block Diffusion 使用两种缓存来加速推理："
          )}
        </p>

        <div className="space-y-2 my-4">
          <div className="p-3 bg-white border border-paper-200 rounded-lg">
            <span className="font-semibold text-sm">{t("Prefix Cache", "前缀缓存")}</span>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "KV cache of all previously decoded blocks. Just like standard AR KV-cache. Only computed once per block.",
                "所有已解码块的 KV 缓存。就像标准 AR 的 KV-cache。每块只计算一次。"
              )}
            </p>
          </div>
          <div className="p-3 bg-white border border-paper-200 rounded-lg">
            <span className="font-semibold text-sm">{t("Block Cache", "块缓存")}</span>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "KV cache within the current block across denoising steps. Since denoising is iterative, token representations from earlier steps can be reused (from Fast-dLLM).",
                "当前块在去噪步骤之间的 KV 缓存。由于去噪是迭代的，早期步骤的 token 表示可以被复用 (来自 Fast-dLLM)。"
              )}
            </p>
          </div>
        </div>

        {/* ============ Section 6: D2F ============ */}
        <h2>{t("6. D2F: Discrete Diffusion Forcing", "6. D2F：离散扩散强制")}</h2>

        <p>
          {t(
            "D2F is a training technique that converts a pre-trained bidirectional dLLM into a model supporting block-wise causal attention — enabling KV cache reuse and inter-block parallel decoding at inference time.",
            "D2F 是一种训练技术，将预训练的双向 dLLM 转换为支持块级因果注意力的模型，从而在推理时实现 KV 缓存复用和块间并行解码。"
          )}
        </p>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-700/40">
            <h4 className="font-semibold text-sm mb-2 text-orange-900 dark:text-orange-200">
              🔥 {t("D2F dLLM (student)", "D2F dLLM（学生模型）")}
            </h4>
            <ul className="text-sm space-y-1 text-orange-800/80 dark:text-orange-200/70">
              <li>{t("Block-wise causal attention mask", "块级因果注意力掩码")}</li>
              <li>{t("Sees past blocks, current block tokens left-to-right", "可见历史块，当前块内从左到右")}</li>
              <li>{t("Compatible with KV cache across denoising steps", "去噪步骤间兼容 KV 缓存")}</li>
            </ul>
          </div>
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-700/40">
            <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-200">
              ❄️ {t("Pre-trained dLLM (teacher)", "预训练 dLLM（教师模型）")}
            </h4>
            <ul className="text-sm space-y-1 text-blue-800/80 dark:text-blue-200/70">
              <li>{t("Bidirectional full attention", "双向全注意力")}</li>
              <li>{t("Sees all tokens simultaneously", "同时看到所有 token")}</li>
              <li>{t("Strong quality, but no KV cache reuse", "质量高，但无法 KV 缓存复用")}</li>
            </ul>
          </div>
        </div>

        <h3>{t("Training with Monotonically Increasing Masks", "使用单调递增掩码训练")}</h3>
        <p>
          {t(
            "The answer sequence is divided into blocks with progressively increasing masking ratios. The D2F student model is trained to mimic the teacher's predictions on partially denoised preceding tokens — via a KL divergence loss between the two models' output distributions.",
            "答案序列被分成遮蔽比例单调递增的块。D2F 学生模型被训练以模仿教师模型对部分去噪前序 token 的预测 — 通过两模型输出分布之间的 KL 散度损失实现。"
          )}
        </p>

        <Math
          display
          label={t("D2F distillation objective", "D2F 蒸馏目标")}
          tex="\mathcal{L}_{\text{D2F}} = \mathbb{E}\bigl[\text{KL}\bigl(p_{\text{teacher}}(\cdot \mid x_t) \;\|\; p_{\text{student}}(\cdot \mid x_t^{\text{causal}})\bigr)\bigr]"
        />

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg my-4 dark:bg-amber-900/15 dark:border-amber-700/40">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
            {t("Why this matters", "为何重要")}
          </p>
          <p className="text-sm text-amber-900/80 dark:text-amber-200/80 mb-0">
            {t(
              "Standard dLLMs use bidirectional attention — each denoising step must recompute all token representations from scratch. D2F's causal attention structure means the KV activations from step t can be partially reused in step t+1, breaking the O(N²) per-step compute barrier.",
              "标准 dLLM 使用双向注意力 — 每次去噪步骤必须从头重新计算所有 token 表示。D2F 的因果注意力结构意味着第 t 步的 KV 激活可以在第 t+1 步中部分复用，打破了每步 O(N²) 的计算瓶颈。"
            )}
          </p>
        </div>

        {/* ============ Section 7: Results ============ */}
        <h2>{t("7. Results: The Block Size Tradeoff", "7. 结果：块大小权衡")}</h2>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-paper-200">
                <th className="text-left py-2 pr-4">{t("Block Size", "块大小")}</th>
                <th className="text-center py-2 pr-4">{t("Perplexity", "困惑度")}</th>
                <th className="text-center py-2 pr-4">{t("Steps for 256 tokens", "256 token 所需步数")}</th>
                <th className="text-center py-2">{t("Speedup", "加速比")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">B=1 <span className="text-paper-800/40">({t("pure AR", "纯 AR")})</span></td>
                <td className="text-center py-2 pr-4">24.1</td>
                <td className="text-center py-2 pr-4">256</td>
                <td className="text-center py-2">1x</td>
              </tr>
              <tr className="border-b border-paper-200 bg-blue-50/50">
                <td className="py-2 pr-4 font-medium">B=4</td>
                <td className="text-center py-2 pr-4">24.8</td>
                <td className="text-center py-2 pr-4">64 × T</td>
                <td className="text-center py-2 font-medium">~2-4x</td>
              </tr>
              <tr className="border-b border-paper-200 bg-blue-50/50">
                <td className="py-2 pr-4 font-medium">B=16</td>
                <td className="text-center py-2 pr-4">26.3</td>
                <td className="text-center py-2 pr-4">16 × T</td>
                <td className="text-center py-2 font-medium">~4-8x</td>
              </tr>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">B=256 <span className="text-paper-800/40">({t("pure diffusion", "纯扩散")})</span></td>
                <td className="text-center py-2 pr-4">31.2</td>
                <td className="text-center py-2 pr-4">1 × T</td>
                <td className="text-center py-2">{t("depends on T", "取决于 T")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ============ Section 8: Connections ============ */}
        <h2>{t("8. Connections to Other Work", "8. 与其他工作的联系")}</h2>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`${basePath}/papers/llada`} className="font-semibold text-blue-600 hover:underline">LLaDA</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Can be seen as Block Diffusion with B = L (one giant block). LLaDA's training objective is a special case of the block diffusion loss.",
                "可以看作 B = L 的 Block Diffusion (一个巨大的块)。LLaDA 的训练目标是 block diffusion 损失的特例。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`${basePath}/papers/fast-dllm`} className="font-semibold text-blue-600 hover:underline">Fast DLLM</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Provides the adaptive denoising schedule and DualCache that Block Diffusion uses within each block. The two papers are complementary — Fast DLLM reduces T, Block Diffusion reduces the number of blocks.",
                "提供了 Block Diffusion 在每个块内使用的自适应去噪调度和 DualCache。两篇论文是互补的 — Fast DLLM 减少 T，Block Diffusion 减少块数。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`${basePath}/papers/mdlm`} className="font-semibold text-blue-600 hover:underline">MDLM</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "The continuous-time ELBO theory that underpins the within-block diffusion process. Block Diffusion uses MDLM's training framework.",
                "为块内扩散过程提供理论基础的连续时间 ELBO 理论。Block Diffusion 使用 MDLM 的训练框架。"
              )}
            </p>
          </div>
        </div>

        {/* ============ Section 9: Resources ============ */}
        <h2>{t("9. Additional Resources", "9. 补充资源")}</h2>

        <div className="space-y-2 my-4">
          <a href="https://arxiv.org/abs/2503.09573" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">Block Diffusion (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Original paper", "原始论文")}</span>
          </a>
          <a href="https://github.com/kuleshov-group/block-diffusion" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">GitHub: kuleshov-group/block-diffusion</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Official code", "官方代码")}</span>
          </a>
        </div>
      </article>
    </div>
  );
}
