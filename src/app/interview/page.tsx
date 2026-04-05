"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";

// ─── Small helpers ──────────────────────────────────────────────────────────

function SectionHeader({
  number,
  en,
  zh,
  color,
  t,
}: {
  number: string;
  en: string;
  zh: string;
  color: "blue" | "violet" | "emerald" | "rose";
  t: (en: string, zh: string) => string;
}) {
  const bg: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-700/40 dark:text-blue-100",
    violet: "bg-violet-50 border-violet-200 text-violet-900 dark:bg-violet-900/20 dark:border-violet-700/40 dark:text-violet-100",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-700/40 dark:text-emerald-100",
    rose: "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-900/20 dark:border-rose-700/40 dark:text-rose-100",
  };
  const badge: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  };

  return (
    <div
      className={`flex items-center gap-3 mt-14 mb-6 px-5 py-4 rounded-xl border ${bg[color]}`}
    >
      <span
        className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${badge[color]}`}
      >
        {number}
      </span>
      <h2 className="text-xl font-bold m-0 border-0 p-0">{t(en, zh)}</h2>
    </div>
  );
}

function KeyInsight({
  en,
  zh,
  t,
}: {
  en: string;
  zh: string;
  t: (en: string, zh: string) => string;
}) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-5 dark:bg-amber-900/15 dark:border-amber-700/40">
      <p className="text-sm mb-0">
        <strong className="text-amber-800 dark:text-amber-300">{t("Key insight", "关键洞察")}</strong>
        {": "}
        <span className="text-amber-900 dark:text-amber-200">{t(en, zh)}</span>
      </p>
    </div>
  );
}

function QuestionLabel({
  n,
  en,
  zh,
  t,
}: {
  n: number;
  en: string;
  zh: string;
  t: (en: string, zh: string) => string;
}) {
  return (
    <span className="flex items-start gap-2">
      <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-paper-900 dark:bg-slate-600 text-white text-xs font-bold">
        {n}
      </span>
      <span>{t(en, zh)}</span>
    </span>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function InterviewPage() {
  const { t } = useLang();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* ── Header ── */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 dark:text-slate-100">
          {t("Classic ML Interview Questions", "经典大模型八股题")}
        </h1>
        <p className="text-paper-800/50 dark:text-slate-400">
          {t(
            "Core concepts with rigorous answers — for LLM researchers and practitioners",
            "核心概念与严谨解答 — 面向大模型研究者和从业者"
          )}
        </p>
      </header>

      {/* ── TOC pill strip ── */}
      <div className="flex flex-wrap gap-2 mb-10">
        {[
          { href: "#attention", en: "Transformer & Attention", zh: "Transformer & 注意力" },
          { href: "#training", en: "Training & Optimization", zh: "训练与优化" },
          { href: "#architecture", en: "Architecture", zh: "架构设计" },
          { href: "#alignment", en: "Training & Alignment", zh: "训练与对齐" },
        ].map(({ href, en, zh }) => (
          <a
            key={href}
            href={href}
            className="text-xs px-3 py-1.5 rounded-full border border-paper-200 bg-white hover:border-blue-300 hover:text-blue-600 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
          >
            {t(en, zh)}
          </a>
        ))}
      </div>

      <article className="paper-content">
        {/* ════════════════════════════════════════════
            SECTION 1 — TRANSFORMER & ATTENTION
        ════════════════════════════════════════════ */}
        <div id="attention">
          <SectionHeader
            number="01"
            en="Transformer & Attention"
            zh="Transformer & 注意力机制"
            color="blue"
            t={t}
          />

          {/* Q1 */}
          <Collapsible
            title={t(
              "Q1: Why does scaled dot-product attention divide by √d_k?",
              "问1：缩放点积注意力为何除以 √d_k？"
            )}
            defaultOpen
          >
            <div className="space-y-4 text-sm">
              <p>
                {t(
                  "When d_k is large, the dot products Q·Kᵀ grow in magnitude — their variance scales with d_k, pushing softmax into regions with very small gradients (saturation). Dividing by √d_k normalizes the variance back to ~1, keeping softmax in a stable gradient regime.",
                  "当 d_k 很大时，点积 Q·Kᵀ 的数值会增大 — 其方差随 d_k 增长，导致 softmax 进入梯度极小的饱和区。除以 √d_k 将方差归一化回 ~1，使 softmax 保持在稳定的梯度区间内。"
                )}
              </p>

              <Math
                display
                label={t("Scaled dot-product attention", "缩放点积注意力")}
                tex="\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V"
              />

              <Collapsible
                title={t("Variance proof", "方差证明")}
                defaultOpen={false}
              >
                <div className="space-y-3 text-sm">
                  <p>
                    {t(
                      "If q and k have components drawn i.i.d. from N(0,1), then:",
                      "若 q、k 的分量独立同分布于 N(0,1)，则："
                    )}
                  </p>
                  <Math
                    display
                    tex="q \cdot k = \sum_{i=1}^{d_k} q_i k_i \;\implies\; \text{Var}(q \cdot k) = d_k"
                  />
                  <p>
                    {t(
                      "After dividing by √d_k the variance becomes 1, preventing softmax saturation.",
                      "除以 √d_k 后方差变为 1，防止 softmax 饱和。"
                    )}
                  </p>
                </div>
              </Collapsible>

              <KeyInsight
                en="Concrete example: d_k = 64 → without scaling, dot products have std ≈ 8; after scaling by 1/√64 = 1/8, std ≈ 1."
                zh="具体例子：d_k = 64 → 不缩放时点积标准差 ≈ 8；除以 √64 = 8 后标准差 ≈ 1。"
                t={t}
              />
            </div>
          </Collapsible>

          {/* Q2 */}
          <Collapsible
            title={t(
              "Q2: Encoder-only vs decoder-only vs encoder-decoder Transformers?",
              "问2：编码器、解码器、编码器-解码器架构有何区别？"
            )}
          >
            <div className="space-y-4 text-sm">
              <div className="grid gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/40">
                  <p className="font-semibold text-blue-800 mb-1">
                    {t("Encoder-only (BERT)", "编码器（BERT）")}
                  </p>
                  <p className="mb-0 text-blue-900">
                    {t(
                      "Bidirectional attention — each token sees all other tokens. No causal mask. Used for understanding tasks (classification, NER, QA). Pre-trained with Masked Language Modeling (MLM).",
                      "双向注意力 — 每个 token 可见所有其他 token，无因果掩码。用于理解任务（分类、NER、问答）。使用掩码语言建模（MLM）预训练。"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-violet-50 rounded-lg border border-violet-200 dark:bg-violet-900/20 dark:border-violet-700/40">
                  <p className="font-semibold text-violet-800 mb-1">
                    {t("Decoder-only (GPT series, LLaMA)", "解码器（GPT 系列、LLaMA）")}
                  </p>
                  <p className="mb-0 text-violet-900">
                    {t(
                      "Causal / autoregressive attention — each token only sees previous tokens. Used for generation. Pre-trained with next-token prediction.",
                      "因果/自回归注意力 — 每个 token 只能看到之前的 token。用于生成任务，使用下一个 token 预测预训练。"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700/40">
                  <p className="font-semibold text-emerald-800 mb-1">
                    {t("Encoder-decoder (T5, original Transformer)", "编码器-解码器（T5、原始 Transformer）")}
                  </p>
                  <p className="mb-0 text-emerald-900">
                    {t(
                      "Encoder reads the full source with bidirectional attention; decoder attends to encoder outputs via cross-attention, plus its own past tokens via causal attention. Used for seq2seq tasks (translation, summarization).",
                      "编码器用双向注意力读全文；解码器通过交叉注意力访问编码输出，同时对自身历史 token 使用因果注意力。用于序列到序列任务（翻译、摘要）。"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Collapsible>

          {/* Q3 */}
          <Collapsible
            title={t(
              "Q3: What is FlashAttention and why does it matter?",
              "问3：FlashAttention 是什么，为何重要？"
            )}
          >
            <div className="space-y-4 text-sm">
              <p>
                {t(
                  "Standard attention writes the full N×N attention matrix to GPU HBM (high-bandwidth memory, which is slow), requiring O(N²) memory. FlashAttention tiles the computation to stay in SRAM (fast on-chip cache), computing exact attention while only writing O(N) data to HBM.",
                  "标准注意力将完整的 N×N 注意力矩阵写入 GPU HBM（高带宽内存，较慢），需要 O(N²) 内存。FlashAttention 将计算分块在 SRAM（快速片上缓存）中完成，精确计算注意力，同时只向 HBM 写入 O(N) 数据。"
                )}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
                  <p className="text-xs font-semibold text-red-700 mb-1">
                    {t("Standard Attention", "标准注意力")}
                  </p>
                  <p className="font-mono text-red-800 mb-0">
                    O(N²) {t("HBM reads/writes", "HBM 读写")}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                  <p className="text-xs font-semibold text-green-700 mb-1">
                    {t("FlashAttention", "FlashAttention")}
                  </p>
                  <p className="font-mono text-green-800 mb-0">
                    O(N) {t("HBM reads/writes", "HBM 读写")}
                  </p>
                </div>
              </div>

              <KeyInsight
                en="~3× speedup on attention, enables 64K+ context lengths without approximation — the result is mathematically identical to standard attention."
                zh="注意力计算约 3× 加速，支持 64K+ 上下文长度，无需近似 — 结果与标准注意力数学等价。"
                t={t}
              />
            </div>
          </Collapsible>

          {/* Q4 */}
          <Collapsible
            title={t(
              "Q4: Explain multi-head attention. Why use multiple heads?",
              "问4：解释多头注意力。为何使用多个头？"
            )}
          >
            <div className="space-y-4 text-sm">
              <Math
                display
                label={t("Multi-head attention", "多头注意力")}
                tex="\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1,\ldots,\text{head}_h)\,W^O"
              />
              <Math
                display
                label={t("Each head", "每个头")}
                tex="\text{head}_i = \text{Attention}(QW_i^Q,\; KW_i^K,\; VW_i^V)"
              />

              <p>
                {t(
                  "The original Transformer uses h=8 heads with d_model=512, giving d_k=d_v=64 per head. The total compute is similar to single-head attention at d_model.",
                  "原始 Transformer 使用 h=8 个头，d_model=512，每头 d_k=d_v=64。总计算量与单头 d_model 维度的注意力相近。"
                )}
              </p>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/40">
                <p className="font-semibold text-blue-800 mb-2">
                  {t("Why multiple heads?", "为何多头？")}
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-0 text-blue-900">
                  <li>
                    {t(
                      "Each head attends to different representation subspaces and different positions simultaneously.",
                      "每个头可同时关注不同表示子空间和不同位置的信息。"
                    )}
                  </li>
                  <li>
                    {t(
                      "In practice: one head may focus on syntax, another on coreference, another on positional relations.",
                      "实践中：一个头可能关注句法，另一个关注指代，另一个关注位置关系。"
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </Collapsible>

          {/* Q5 */}
          <Collapsible
            title={t(
              "Q5: What is positional encoding and why does Transformer need it?",
              "问5：什么是位置编码，Transformer 为何需要它？"
            )}
          >
            <div className="space-y-4 text-sm">
              <p>
                {t(
                  "Self-attention is permutation-invariant — it produces the same output regardless of token order. Positional encoding injects sequence position information by adding a position-dependent signal to each token embedding.",
                  "自注意力对序列顺序不敏感（置换不变）— 无论 token 顺序如何都会产生相同输出。位置编码通过向每个 token 嵌入添加位置相关信号来注入序列位置信息。"
                )}
              </p>

              <Math
                display
                label={t("Sinusoidal positional encoding", "正弦位置编码")}
                tex="\text{PE}_{(pos,\,2i)} = \sin\!\left(\frac{pos}{10000^{2i/d}}\right), \quad \text{PE}_{(pos,\,2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d}}\right)"
              />

              <p>
                {t(
                  "Different frequencies let the model learn both absolute positions and relative distances between positions.",
                  "不同频率使模型能学习绝对位置和位置间的相对距离。"
                )}
              </p>

              <div className="p-3 bg-violet-50 rounded-lg border border-violet-200 dark:bg-violet-900/20 dark:border-violet-700/40">
                <p className="font-semibold text-violet-800 mb-1">
                  {t("Modern LLMs: RoPE", "现代 LLM：RoPE")}
                </p>
                <p className="mb-0 text-violet-900">
                  {t(
                    "Rotary Position Embedding applies rotation in complex space to Q and K before computing attention. It naturally encodes relative positions and generalizes better to sequences longer than those seen during training.",
                    "旋转位置编码在计算注意力前对 Q 和 K 在复数空间中施加旋转。它自然编码相对位置，并比绝对位置编码更好地泛化到训练时未见过的更长序列。"
                  )}
                </p>
              </div>
            </div>
          </Collapsible>
        </div>

        {/* ════════════════════════════════════════════
            SECTION 2 — TRAINING & OPTIMIZATION
        ════════════════════════════════════════════ */}
        <div id="training">
          <SectionHeader
            number="02"
            en="Training & Optimization"
            zh="训练与优化"
            color="violet"
            t={t}
          />

          {/* Q6 */}
          <Collapsible
            title={t(
              "Q6: What is gradient clipping and why is it used in LLM training?",
              "问6：梯度裁剪是什么，LLM 训练中为何使用？"
            )}
          >
            <div className="space-y-4 text-sm">
              <p>
                {t(
                  "Gradient clipping rescales the gradient vector when its norm exceeds a threshold θ. If ||∇L|| > θ, all gradients are scaled by θ/||∇L|| so the resulting norm equals exactly θ.",
                  "梯度裁剪在梯度向量的范数超过阈值 θ 时对其进行缩放。若 ||∇L|| > θ，所有梯度按 θ/||∇L|| 缩放，使结果范数恰好等于 θ。"
                )}
              </p>

              <Math
                display
                label={t("Gradient clipping rule", "梯度裁剪规则")}
                tex="g \leftarrow \begin{cases} g & \text{if } \|g\| \leq \theta \\ \dfrac{\theta}{\|g\|}\, g & \text{otherwise} \end{cases}"
              />

              <KeyInsight
                en="Clipping preserves gradient direction (it's a rescaling, not per-element truncation). Typical value: θ = 1.0. Prevents gradient explosion that is especially severe in deep Transformers and RNNs."
                zh="裁剪保留梯度方向（是整体缩放，非逐元素截断）。典型值 θ = 1.0。防止深层 Transformer 和 RNN 中尤为严重的梯度爆炸。"
                t={t}
              />
            </div>
          </Collapsible>

          {/* Q7 */}
          <Collapsible
            title={t(
              "Q7: Pre-norm vs post-norm Transformers — what's the difference?",
              "问7：Pre-norm 与 Post-norm Transformer 有何区别？"
            )}
          >
            <div className="space-y-4 text-sm">
              <div className="grid gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-semibold text-red-800 mb-1">
                    {t("Post-norm (original Transformer, 2017)", "Post-norm（原始 Transformer，2017）")}
                  </p>
                  <Math
                    display
                    tex="x \leftarrow \text{LayerNorm}(x + \text{Sublayer}(x))"
                  />
                  <p className="mb-0 text-red-900">
                    {t(
                      "Harder to train — requires careful learning-rate warmup. Gradient magnitude varies across layers.",
                      "训练较难 — 需要仔细的学习率预热。各层梯度幅度差异大。"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-800 mb-1">
                    {t("Pre-norm (GPT-2+, LLaMA, Mistral…)", "Pre-norm（GPT-2+、LLaMA、Mistral…）")}
                  </p>
                  <Math
                    display
                    tex="x \leftarrow x + \text{Sublayer}(\text{LayerNorm}(x))"
                  />
                  <p className="mb-0 text-green-900">
                    {t(
                      "More stable gradients, easier to train, can use larger learning rates. The residual stream passes through the network unnormalized, carrying information cleanly across layers.",
                      "梯度更稳定，训练更容易，可使用更大的学习率。残差流无归一化地穿过网络，在各层间干净地传递信息。"
                    )}
                  </p>
                </div>
              </div>

              <KeyInsight
                en="Virtually all modern LLMs use pre-norm. The clean residual stream is a key reason interpretability methods (like logit lens) work well on them."
                zh="现代 LLM 几乎全部使用 pre-norm。干净的残差流也是可解释性方法（如 logit lens）能有效工作的关键原因。"
                t={t}
              />
            </div>
          </Collapsible>

          {/* Q8 */}
          <Collapsible
            title={t(
              "Q8: What is label smoothing and when should you use it?",
              "问8：什么是标签平滑，何时应使用？"
            )}
          >
            <div className="space-y-4 text-sm">
              <p>
                {t(
                  "Instead of hard one-hot targets, label smoothing uses soft targets: the correct class receives probability 1−ε, and the remaining ε probability mass is distributed uniformly across all K classes.",
                  "标签平滑用软标签代替硬 one-hot 目标：正确类别获得概率 1−ε，剩余 ε 均匀分配给所有 K 个类别。"
                )}
              </p>

              <Math
                display
                label={t("Smoothed target distribution", "平滑目标分布")}
                tex="y_i^{\text{smooth}} = \begin{cases} 1 - \varepsilon & \text{if } i = \text{correct class} \\ \dfrac{\varepsilon}{K-1} & \text{otherwise} \end{cases}"
              />

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/40">
                <p className="font-semibold text-blue-800 mb-2">
                  {t("Benefits", "好处")}
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-0 text-blue-900">
                  <li>{t("Prevents overconfident predictions", "防止过度自信的预测")}</li>
                  <li>{t("Acts as regularization — improves generalization", "起正则化作用 — 提升泛化")}</li>
                  <li>{t("Better calibration: predicted probabilities more closely match true likelihoods", "更好的校准：预测概率更接近真实概率")}</li>
                </ul>
              </div>

              <p>
                {t(
                  "The original Transformer uses ε=0.1 for machine translation. Avoid label smoothing when the model needs to be confident — e.g., reward prediction in RL, or classification with clean labels.",
                  "原始 Transformer 在机器翻译中使用 ε=0.1。当模型需要自信时避免标签平滑 — 例如 RL 中的奖励预测，或带有干净标签的分类任务。"
                )}
              </p>
            </div>
          </Collapsible>

          {/* Q9 */}
          <Collapsible
            title={t(
              "Q9: BPE vs WordPiece vs SentencePiece tokenization?",
              "问9：BPE、WordPiece 与 SentencePiece 分词有何区别？"
            )}
          >
            <div className="space-y-3 text-sm">
              <div className="grid gap-3">
                <div className="p-3 bg-paper-50 rounded-lg border border-paper-200">
                  <p className="font-semibold mb-1">
                    {t("BPE — Byte Pair Encoding (GPT-2/3/4, LLaMA)", "BPE — 字节对编码（GPT-2/3/4、LLaMA）")}
                  </p>
                  <p className="mb-0 text-paper-800/80">
                    {t(
                      "Start with a character vocabulary. Iteratively merge the most frequent adjacent pair. Greedy and deterministic. GPT-4 uses ~100K BPE tokens.",
                      "从字符词表开始，迭代合并最频繁的相邻字符对。贪心且确定性。GPT-4 使用约 10 万个 BPE token。"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-paper-50 rounded-lg border border-paper-200">
                  <p className="font-semibold mb-1">
                    {t("WordPiece (BERT, DistilBERT)", "WordPiece（BERT、DistilBERT）")}
                  </p>
                  <p className="mb-0 text-paper-800/80">
                    {t(
                      "Like BPE, but merges pairs that maximize the language model likelihood (not raw frequency). Words split as: \"running\" → \"run\" + \"##ning\" (## marks non-initial sub-words).",
                      "类似 BPE，但合并使语言模型似然最大化的字符对（非频率）。单词拆分示例：\"running\" → \"run\" + \"##ning\"（## 标记非首位子词）。"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-paper-50 rounded-lg border border-paper-200">
                  <p className="font-semibold mb-1">
                    {t("SentencePiece (LLaMA, T5, mT5)", "SentencePiece（LLaMA、T5、mT5）")}
                  </p>
                  <p className="mb-0 text-paper-800/80">
                    {t(
                      "Language-agnostic: treats text as raw Unicode sequences with no pre-tokenization on whitespace. Works well for non-Latin scripts (Chinese, Japanese, Arabic). Can be used with either BPE or Unigram LM algorithm.",
                      "与语言无关：将文本视为原始 Unicode 序列，不进行空格预分词。对非拉丁语系（中、日、阿拉伯语等）友好。可与 BPE 或 Unigram LM 算法结合使用。"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Collapsible>
        </div>

        {/* ════════════════════════════════════════════
            SECTION 3 — ARCHITECTURE DESIGN
        ════════════════════════════════════════════ */}
        <div id="architecture">
          <SectionHeader
            number="03"
            en="Architecture Design"
            zh="架构设计"
            color="emerald"
            t={t}
          />

          {/* Q10 */}
          <Collapsible
            title={t(
              "Q10: What is LoRA and how does it reduce parameters?",
              "问10：LoRA 是什么，如何减少参数量？"
            )}
          >
            <div className="space-y-4 text-sm">
              <p>
                {t(
                  "LoRA (Low-Rank Adaptation) freezes the pre-trained weight matrix W₀ and learns a low-rank decomposition of the weight update ΔW = BA, where B ∈ ℝᵈˣʳ, A ∈ ℝʳˣᵏ, and rank r ≪ min(d, k).",
                  "LoRA（低秩自适应）冻结预训练权重矩阵 W₀，学习权重更新的低秩分解 ΔW = BA，其中 B ∈ ℝᵈˣʳ，A ∈ ℝʳˣᵏ，秩 r ≪ min(d, k)。"
                )}
              </p>

              <Math
                display
                label={t("LoRA forward pass", "LoRA 前向传播")}
                tex="h = W_0 x + \frac{\alpha}{r} B A x"
              />

              <p>
                {t(
                  "At inference: merge W = W₀ + (α/r)BA. Zero latency overhead compared to the base model.",
                  "推理时合并 W = W₀ + (α/r)BA，与基础模型相比零延迟开销。"
                )}
              </p>

              <Collapsible
                title={t("Parameter reduction example (GPT-3 scale)", "参数减少示例（GPT-3 规模）")}
                defaultOpen={false}
              >
                <div className="text-sm space-y-2">
                  <p>
                    {t(
                      "For a GPT-3 attention projection (d = 12288):",
                      "对于 GPT-3 注意力投影矩阵（d = 12288）："
                    )}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-red-50 rounded border border-red-200 text-center">
                      <p className="text-xs font-semibold text-red-700">
                        {t("Full fine-tuning", "全量微调")}
                      </p>
                      <p className="font-mono text-red-800 mb-0">
                        12288² = 150M {t("params", "参数")}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded border border-green-200 text-center">
                      <p className="text-xs font-semibold text-green-700">
                        {t("LoRA r=4", "LoRA r=4")}
                      </p>
                      <p className="font-mono text-green-800 mb-0">
                        2 × 12288 × 4 = 98K {t("params", "参数")}
                      </p>
                    </div>
                  </div>
                  <p className="text-paper-800/60">
                    {t("1500× parameter reduction per matrix.", "每个矩阵参数量减少 1500 倍。")}
                  </p>
                </div>
              </Collapsible>

              <KeyInsight
                en="Why does it work? Fine-tuning tasks have low intrinsic dimensionality — the meaningful weight changes live in a low-rank subspace of the full parameter space."
                zh="为何有效？微调任务的内在维度低 — 有意义的权重变化位于全参数空间的低秩子空间中。"
                t={t}
              />
            </div>
          </Collapsible>

          {/* Q11 */}
          <Collapsible
            title={t(
              "Q11: What is Grouped Query Attention (GQA)?",
              "问11：什么是分组查询注意力（GQA）？"
            )}
          >
            <div className="space-y-4 text-sm">
              <div className="grid gap-3">
                <div className="p-3 bg-paper-50 rounded-lg border border-paper-200">
                  <p className="font-semibold mb-1">
                    {t("MHA — Multi-Head Attention (standard)", "MHA — 多头注意力（标准）")}
                  </p>
                  <p className="mb-0 text-paper-800/70">
                    {t(
                      "h query heads, h key heads, h value heads. Full quality, largest KV cache.",
                      "h 个查询头，h 个键头，h 个值头。质量最高，KV 缓存最大。"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-semibold mb-1">
                    {t("MQA — Multi-Query Attention (Falcon)", "MQA — 多查询注意力（Falcon）")}
                  </p>
                  <p className="mb-0 text-red-900">
                    {t(
                      "h query heads share a single K and V. Fastest inference, smallest KV cache, but noticeable quality drop on some tasks.",
                      "h 个查询头共享 1 个 K 和 V。推理最快，KV 缓存最小，但部分任务质量明显下降。"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-semibold mb-1">
                    {t("GQA — Grouped Query Attention (Mistral 7B, LLaMA 3)", "GQA — 分组查询注意力（Mistral 7B、LLaMA 3）")}
                  </p>
                  <p className="mb-0 text-green-900">
                    {t(
                      "h query heads split into g groups; each group shares one K/V pair. Mistral 7B: 32 query heads, 8 KV heads. Balance between MHA quality and MQA speed. KV cache is h/g × smaller than MHA.",
                      "h 个查询头分为 g 组，每组共享一对 K/V。Mistral 7B：32 个查询头，8 个 KV 头。在 MHA 质量和 MQA 速度间取得平衡。KV 缓存比 MHA 小 h/g 倍。"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Collapsible>

          {/* Q12 */}
          <Collapsible
            title={t(
              "Q12: What is the KV Cache and why is it important for inference?",
              "问12：什么是 KV 缓存，为何对推理至关重要？"
            )}
          >
            <div className="space-y-4 text-sm">
              <p>
                {t(
                  "During autoregressive generation, each new token must attend to all previous tokens' keys and values. Without caching, we'd recompute K,V for every past token at every generation step — O(n²) total compute for a sequence of length n.",
                  "在自回归生成时，每个新 token 必须关注所有历史 token 的 K 和 V。不缓存的话，每一步生成都需重新计算所有历史 token 的 K、V — 总计算量为 O(n²)。"
                )}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
                  <p className="text-xs font-semibold text-red-700 mb-1">
                    {t("Without KV Cache", "无 KV 缓存")}
                  </p>
                  <p className="font-mono text-red-800 mb-0">O(n²)</p>
                  <p className="text-xs text-red-700">
                    {t("total compute", "总计算量")}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                  <p className="text-xs font-semibold text-green-700 mb-1">
                    {t("With KV Cache", "有 KV 缓存")}
                  </p>
                  <p className="font-mono text-green-800 mb-0">O(n)</p>
                  <p className="text-xs text-green-700">
                    {t("total compute", "总计算量")}
                  </p>
                </div>
              </div>

              <p>
                {t(
                  "Each step: compute Q, K, V only for the new token, append K and V to the cache, then attend over the full cached sequence.",
                  "每一步：只计算新 token 的 Q、K、V，将 K 和 V 追加到缓存，然后关注完整的缓存序列。"
                )}
              </p>

              <Collapsible
                title={t("KV cache memory cost", "KV 缓存内存占用")}
                defaultOpen={false}
              >
                <div className="text-sm space-y-2">
                  <Math
                    display
                    label={t("Memory per token (bytes)", "每 token 内存（字节）")}
                    tex="\text{mem} = 2 \times n_{\text{layers}} \times n_{\text{kv\_heads}} \times d_{\text{head}} \times \text{sizeof}(\text{dtype})"
                  />
                  <p className="text-paper-800/70">
                    {t(
                      "LLaMA-7B (fp16) at 4096 tokens: 2 × 32 layers × 32 heads × 128 dims × 2 bytes ≈ 0.5 GB per sequence.",
                      "LLaMA-7B（fp16）在 4096 tokens 时：2 × 32 层 × 32 头 × 128 维 × 2 字节 ≈ 每个序列 0.5 GB。"
                    )}
                  </p>
                </div>
              </Collapsible>
            </div>
          </Collapsible>
        </div>

        {/* ════════════════════════════════════════════
            SECTION 4 — TRAINING & ALIGNMENT
        ════════════════════════════════════════════ */}
        <div id="alignment">
          <SectionHeader
            number="04"
            en="Training & Alignment"
            zh="训练与对齐"
            color="rose"
            t={t}
          />

          {/* Q13 */}
          <Collapsible
            title={t(
              "Q13: Explain RLHF step by step. What are the main failure modes?",
              "问13：逐步解释 RLHF。主要失败模式有哪些？"
            )}
          >
            <div className="space-y-4 text-sm">
              <div className="space-y-3">
                <div className="p-3 bg-paper-50 rounded-lg border border-paper-200">
                  <p className="font-semibold mb-1">
                    {t("Step 1 — Supervised Fine-Tuning (SFT)", "第一步 — 监督微调（SFT）")}
                  </p>
                  <p className="mb-0 text-paper-800/70">
                    {t(
                      "Fine-tune the pre-trained LM on human-written demonstrations of desired behavior.",
                      "在人类编写的期望行为示范数据上对预训练语言模型进行微调。"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-paper-50 rounded-lg border border-paper-200">
                  <p className="font-semibold mb-1">
                    {t("Step 2 — Reward Model (RM)", "第二步 — 奖励模型（RM）")}
                  </p>
                  <p className="mb-0 text-paper-800/70">
                    {t(
                      "Train a reward model on human preference comparisons using the Bradley-Terry loss.",
                      "使用 Bradley-Terry 损失在人类偏好比较数据上训练奖励模型。"
                    )}
                  </p>
                  <Math
                    display
                    tex="\mathcal{L}_{\text{RM}} = -\log \sigma\!\left(r(x, y_w) - r(x, y_l)\right)"
                  />
                </div>
                <div className="p-3 bg-paper-50 rounded-lg border border-paper-200">
                  <p className="font-semibold mb-1">
                    {t("Step 3 — PPO with KL constraint", "第三步 — 带 KL 约束的 PPO")}
                  </p>
                  <p className="mb-0 text-paper-800/70">
                    {t(
                      "Optimize the policy to maximize the reward model score while staying close to the SFT model via a KL divergence penalty.",
                      "通过 KL 散度惩罚约束，在最大化奖励模型得分的同时保持策略接近 SFT 模型。"
                    )}
                  </p>
                  <Math
                    display
                    tex="\max_{\pi_\theta}\; \mathbb{E}[r_\phi(x,y)] - \beta\, D_{\text{KL}}[\pi_\theta \| \pi_{\text{ref}}]"
                  />
                </div>
              </div>

              <Collapsible
                title={t("Main failure modes", "主要失败模式")}
                defaultOpen={false}
              >
                <div className="text-sm space-y-2">
                  <ul className="list-disc pl-5 space-y-2 mb-0">
                    <li>
                      <strong>{t("Reward hacking", "奖励欺骗")}</strong>
                      {": "}
                      {t(
                        "Model learns to exploit RM flaws — produces long verbose answers, sycophantic responses, or format tricks that fool the RM without being genuinely helpful.",
                        "模型学会利用 RM 的漏洞 — 产生冗长啰嗦的回答、谄媚响应或格式技巧，欺骗 RM 但实际并不有用。"
                      )}
                    </li>
                    <li>
                      <strong>{t("KL constraint too loose", "KL 约束过松")}</strong>
                      {": "}
                      {t(
                        "Policy diverges from SFT distribution and loses general helpfulness.",
                        "策略偏离 SFT 分布，丧失通用有用性。"
                      )}
                    </li>
                    <li>
                      <strong>{t("RM distributional shift", "RM 分布偏移")}</strong>
                      {": "}
                      {t(
                        "RM was only trained on human preference pairs, not on the model's own outputs — may give unreliable scores out-of-distribution.",
                        "RM 只在人类偏好对上训练，未见过模型自身输出 — 在分布外可能给出不可靠的分数。"
                      )}
                    </li>
                    <li>
                      <strong>{t("Mode collapse", "模式坍塌")}</strong>
                      {": "}
                      {t(
                        "Policy collapses to a few high-reward responses, losing response diversity.",
                        "策略坍塌为少数高奖励响应，丧失输出多样性。"
                      )}
                    </li>
                  </ul>
                </div>
              </Collapsible>
            </div>
          </Collapsible>

          {/* Q14 */}
          <Collapsible
            title={t(
              "Q14: What's the difference between PPO, DPO, and GRPO?",
              "问14：PPO、DPO 与 GRPO 有何区别？"
            )}
          >
            <div className="space-y-4 text-sm">
              <div className="grid gap-3">
                <div className="p-3 bg-paper-50 rounded-lg border border-paper-200">
                  <p className="font-semibold mb-1">PPO</p>
                  <p className="mb-0 text-paper-800/70">
                    {t(
                      "Requires a reward model and a value network (critic). Online RL — generates new samples at each step. KL penalty against reference policy. Most powerful, but most complex and expensive to run.",
                      "需要奖励模型和价值网络（critic）。在线 RL — 每步生成新样本。有参考策略的 KL 惩罚。最强大，但最复杂、运行成本最高。"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/40">
                  <p className="font-semibold text-blue-800 mb-1">DPO</p>
                  <p className="mb-0 text-blue-900">
                    {t(
                      "No reward model, no RL. Analytically reparameterizes the RLHF objective into a classification loss on preference pairs. Offline — trains on a fixed dataset. Simple and stable, but cannot explore new data.",
                      "无奖励模型，无 RL。将 RLHF 目标解析重参数化为偏好对上的分类损失。离线 — 在固定数据集上训练。简单稳定，但无法探索新数据。"
                    )}
                  </p>
                  <Math
                    display
                    tex="\mathcal{L}_{\text{DPO}} = -\mathbb{E}\!\left[\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]"
                  />
                </div>
                <div className="p-3 bg-violet-50 rounded-lg border border-violet-200 dark:bg-violet-900/20 dark:border-violet-700/40">
                  <p className="font-semibold text-violet-800 mb-1">
                    {t("GRPO (DeepSeek-R1)", "GRPO（DeepSeek-R1）")}
                  </p>
                  <p className="mb-0 text-violet-900">
                    {t(
                      "Like PPO but replaces the critic (value network) with group-relative baselines. Sample G responses per prompt, normalize rewards within the group to compute advantages. Online but no critic network needed — middle ground between PPO and DPO.",
                      "类似 PPO，但用组相对基线替代 critic（价值网络）。每个提示采样 G 个响应，在组内归一化奖励以计算优势。在线但无需 critic 网络 — PPO 与 DPO 的折中方案。"
                    )}
                  </p>
                  <Math
                    display
                    tex="\hat{A}_i = \frac{r_i - \text{mean}(\{r_j\}_{j=1}^G)}{\text{std}(\{r_j\}_{j=1}^G)}"
                  />
                </div>
              </div>

              <KeyInsight
                en="PPO: most flexible, most expensive. DPO: simplest, offline only. GRPO: online training without a critic, used in DeepSeek-R1 to train strong reasoning."
                zh="PPO：最灵活，最昂贵。DPO：最简单，仅离线。GRPO：无 critic 的在线训练，DeepSeek-R1 用它训练强推理能力。"
                t={t}
              />
            </div>
          </Collapsible>
        </div>

        {/* ── Footer note ── */}
        <div className="mt-16 pt-6 border-t border-paper-200 text-xs text-paper-800/40">
          {t(
            "14 questions across 4 categories. More questions coming soon.",
            "4 个类别共 14 题。更多题目即将添加。"
          )}
        </div>
      </article>
    </div>
  );
}
