"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function AttentionPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("Attention Is All You Need", "Attention Is All You Need")}
        </h1>
        <p className="text-paper-800/50">
          Vaswani et al. &middot; NeurIPS 2017 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1706.03762"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1706.03762
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "The Transformer replaces recurrence entirely with self-attention. Each position can directly attend to every other position in a single step — no sequential computation required. At the time, it achieved state-of-the-art on WMT translation tasks while training 3× faster than the best RNN models.",
              "Transformer 完全用自注意力替代了循环结构。每个位置可以在一步内直接关注其他所有位置 — 无需顺序计算。发布时在 WMT 翻译任务上达到最优效果，训练速度比最好的 RNN 模型快 3 倍。"
            )}
          </p>
        </section>

        {/* ============ FlowChart ============ */}
        <FlowChart
          title={t("Transformer Pipeline", "Transformer 流程")}
          steps={[
            {
              title: t("Problem: RNNs process tokens sequentially", "问题：RNN 顺序处理词元"),
              subtitle: t("O(n) sequential steps, gradient vanishing, slow", "O(n) 顺序步骤，梯度消失，训练慢"),
              color: "rose",
            },
            {
              title: t("Insight: Attention can connect all positions in O(1) steps", "洞察：注意力可以在 O(1) 步内连接所有位置"),
              subtitle: t("No recurrence needed — pure parallelism", "不需要循环 — 纯并行计算"),
              color: "amber",
            },
            {
              title: t("Self-Attention: Each token queries all others", "自注意力：每个词元查询所有其他词元"),
              subtitle: t("Three learned projections per token", "每个词元三个学习到的投影"),
              color: "blue",
              children: [
                { title: "Q = XW^Q", color: "blue" },
                { title: "K = XW^K", color: "blue" },
                { title: "V = XW^V", color: "blue" },
              ],
            },
            {
              title: t("Scale + Softmax: Attention(Q,K,V) = softmax(QKᵀ/√d_k)V", "缩放 + Softmax：注意力分数归一化"),
              subtitle: t("Scaling prevents vanishing gradients in softmax", "缩放防止 softmax 中的梯度消失"),
              color: "teal",
            },
            {
              title: t("Multi-Head: Run h attention heads in parallel, concatenate", "多头：并行运行 h 个注意力头，然后拼接"),
              subtitle: t("h=8 heads, each with d_k=64; captures diverse relationships", "h=8 个头，每个 d_k=64；捕捉多样化的关系"),
              color: "purple",
            },
            {
              title: t("Encoder-Decoder: 6 encoder layers + 6 decoder layers", "编码器-解码器：6 层编码器 + 6 层解码器"),
              subtitle: t("Each layer: multi-head attention + feed-forward + LayerNorm", "每层：多头注意力 + 前馈网络 + 层归一化"),
              color: "green",
            },
            {
              title: t("Result: BLEU 28.4 on WMT EN-DE (new SOTA)", "结果：WMT EN-DE 上 BLEU 28.4（新 SOTA）"),
              subtitle: t("+2.0 BLEU over previous best, 3.5 days on 8 P100 GPUs", "比之前最佳提升 2.0 BLEU，在 8 块 P100 GPU 上训练 3.5 天"),
              color: "green",
            },
          ]}
          arrows={[
            t("Motivation", "动机"),
            t("Key insight", "关键洞察"),
            t("Core mechanism", "核心机制"),
            t("Normalization", "归一化"),
            t("Parallelism", "并行化"),
            t("Full architecture", "完整架构"),
          ]}
          highlights={[
            { text: t("O(1) path length between any two tokens", "任意两个词元之间 O(1) 路径长度"), color: "blue" },
            { text: t("Full parallelism during training", "训练时完全并行"), color: "green" },
            { text: t("New SOTA on WMT EN-DE and EN-FR", "WMT EN-DE 和 EN-FR 新 SOTA"), color: "purple" },
          ]}
        />

        {/* ============ Background ============ */}
        <h2>{t("1. Background: Why Not RNNs?", "1. 背景：为什么不用 RNN？")}</h2>

        <p>
          {t(
            "Before the Transformer, sequence-to-sequence models relied on RNNs (LSTMs, GRUs). These models process tokens one at a time, left-to-right, making them inherently sequential. Three core problems motivated a fundamentally different approach:",
            "在 Transformer 之前，序列到序列模型依赖于 RNN（LSTM、GRU）。这些模型一次处理一个词元，从左到右，本质上是顺序的。三个核心问题促使了根本不同的方法："
          )}
        </p>

        <ul>
          <li>
            <strong>{t("Sequential computation prevents parallelization", "顺序计算阻止并行化")}</strong>
            {t(
              ": To compute the hidden state at position t, you need the hidden state at t−1. This means no GPU parallelism across the sequence — training is slow.",
              "：要计算位置 t 处的隐藏状态，需要位置 t−1 的隐藏状态。这意味着序列上没有 GPU 并行性 — 训练很慢。"
            )}
          </li>
          <li>
            <strong>{t("Gradient vanishing over long sequences", "长序列上的梯度消失")}</strong>
            {t(
              ": Gradients must flow backwards through many time steps. Even with LSTMs, signals from early tokens get diluted over long sequences.",
              "：梯度必须通过许多时间步向后流动。即使使用 LSTM，来自早期词元的信号在长序列上也会被稀释。"
            )}
          </li>
          <li>
            <strong>{t("O(n) path length between distant tokens", "远距离词元之间 O(n) 路径长度")}</strong>
            {t(
              ': To connect token 1 and token 100, information must pass through 99 intermediate states. Long-range dependencies are hard to learn.',
              "：要连接词元 1 和词元 100，信息必须经过 99 个中间状态。长程依赖很难学习。"
            )}
          </li>
        </ul>

        <p>
          {t(
            "The table below compares the maximum path length between two tokens across different architectures — shorter paths mean easier learning of long-range dependencies:",
            "下表比较了不同架构中两个词元之间的最大路径长度 — 路径越短，长程依赖越容易学习："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 px-3 py-2 text-left">{t("Model", "模型")}</th>
                <th className="border border-paper-200 px-3 py-2 text-left">{t("Complexity / layer", "每层复杂度")}</th>
                <th className="border border-paper-200 px-3 py-2 text-left">{t("Sequential ops", "顺序操作")}</th>
                <th className="border border-paper-200 px-3 py-2 text-left">{t("Max path length", "最大路径长度")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-3 py-2 font-medium">{t("Self-Attention", "自注意力")}</td>
                <td className="border border-paper-200 px-3 py-2"><Math tex="O(n^2 \cdot d)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-green-700 font-medium"><Math tex="O(1)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-green-700 font-medium"><Math tex="O(1)" /></td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-3 py-2 font-medium">{t("Recurrent (RNN)", "循环 (RNN)")}</td>
                <td className="border border-paper-200 px-3 py-2"><Math tex="O(n \cdot d^2)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-red-700 font-medium"><Math tex="O(n)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-red-700 font-medium"><Math tex="O(n)" /></td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-3 py-2 font-medium">{t("Convolutional (CNN)", "卷积 (CNN)")}</td>
                <td className="border border-paper-200 px-3 py-2"><Math tex="O(k \cdot n \cdot d^2)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-amber-700 font-medium"><Math tex="O(1)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-amber-700 font-medium"><Math tex="O(\log_k n)" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-paper-800/60">
          {t(
            "n = sequence length, d = model dimension, k = kernel size. Self-attention achieves O(1) path length at the cost of O(n²) memory — the core trade-off.",
            "n = 序列长度，d = 模型维度，k = 卷积核大小。自注意力以 O(n²) 内存为代价实现 O(1) 路径长度 — 核心权衡。"
          )}
        </p>

        {/* ============ Scaled Dot-Product Attention ============ */}
        <h2>{t("2. Scaled Dot-Product Attention", "2. 缩放点积注意力")}</h2>

        <p>
          {t(
            "The core operation of the Transformer is Scaled Dot-Product Attention. Given queries Q, keys K, and values V, the output is a weighted sum of the values, where the weights come from the compatibility of queries and keys:",
            "Transformer 的核心操作是缩放点积注意力。给定查询 Q、键 K 和值 V，输出是值的加权和，权重来自查询和键的相似度："
          )}
        </p>

        <Math
          display
          label={t("Scaled Dot-Product Attention", "缩放点积注意力")}
          tex="\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-2">
              <Math tex="Q" />
              <span>
                {t(
                  "Queries — \"What am I looking for?\" Shape [n, d_k]. Each row is one token's query vector.",
                  "查询 — 「我在寻找什么？」形状 [n, d_k]。每行是一个词元的查询向量。"
                )}
              </span>

              <Math tex="K" />
              <span>
                {t(
                  "Keys — \"What do I have to offer?\" Shape [n, d_k]. Each row is one token's key vector.",
                  "键 — 「我能提供什么？」形状 [n, d_k]。每行是一个词元的键向量。"
                )}
              </span>

              <Math tex="V" />
              <span>
                {t(
                  "Values — \"What I will actually give you.\" Shape [n, d_v]. The actual content that gets aggregated.",
                  "值 — 「我实际给你的内容。」形状 [n, d_v]。被聚合的实际内容。"
                )}
              </span>

              <Math tex="d_k" />
              <span>
                {t(
                  "Dimension of key (and query) vectors. In the base Transformer, d_k = 64 per head.",
                  "键（和查询）向量的维度。在基础 Transformer 中，每个头 d_k = 64。"
                )}
              </span>

              <Math tex="\sqrt{d_k}" />
              <span>
                {t(
                  "Scaling factor — dot products grow in magnitude with d_k (variance scales with d_k). Dividing by √d_k keeps softmax inputs in a reasonable range and prevents gradient vanishing.",
                  "缩放因子 — 点积的大小随 d_k 增长（方差随 d_k 缩放）。除以 √d_k 使 softmax 输入保持在合理范围内，防止梯度消失。"
                )}
              </span>
            </div>
          </div>
        </Collapsible>

        <Collapsible title={t("Concrete example: \"The cat sat on\" (d_k = 4)", "具体例子：\"The cat sat on\"(d_k = 4)")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "We have 4 tokens: \"The\", \"cat\", \"sat\", \"on\". Let's trace how \"cat\" attends to all tokens with d_k = 4.",
                "我们有 4 个词元：\"The\"、\"cat\"、\"sat\"、\"on\"。让我们追踪 \"cat\" 如何在 d_k = 4 的情况下关注所有词元。"
              )}
            </p>

            <div className="space-y-2">
              <div className="p-3 bg-paper-50 rounded border border-paper-200">
                <div className="font-medium text-xs text-paper-800/60 mb-1">{t("Step 1: Raw dot-product scores (Q_cat · K_token)", "步骤 1：原始点积分数 (Q_cat · K_词元)")}</div>
                <div className="font-mono text-xs space-y-1">
                  <div>Q_cat &middot; K_The = <strong>0.8</strong></div>
                  <div>Q_cat &middot; K_cat = <strong>2.1</strong></div>
                  <div>Q_cat &middot; K_sat = <strong>0.3</strong></div>
                  <div>Q_cat &middot; K_on = <strong>0.1</strong></div>
                </div>
              </div>

              <div className="p-3 bg-paper-50 rounded border border-paper-200">
                <div className="font-medium text-xs text-paper-800/60 mb-1">
                  {t("Step 2: Divide by √d_k = √4 = 2", "步骤 2：除以 √d_k = √4 = 2")}
                </div>
                <div className="font-mono text-xs">
                  [0.8, 2.1, 0.3, 0.1] / 2 = [0.40, 1.05, 0.15, 0.05]
                </div>
              </div>

              <div className="p-3 bg-paper-50 rounded border border-paper-200">
                <div className="font-medium text-xs text-paper-800/60 mb-1">{t("Step 3: Softmax → attention weights (sum = 1.0)", "步骤 3：Softmax → 注意力权重（和 = 1.0）")}</div>
                <div className="font-mono text-xs">
                  softmax([0.40, 1.05, 0.15, 0.05]) = [0.21, 0.51, 0.17, 0.11]
                </div>
                <div className="text-xs text-paper-800/50 mt-1">
                  {t("\"cat\" attends most strongly to itself (0.51), then \"The\" (0.21)", "\"cat\" 最强烈地关注自身 (0.51)，然后是 \"The\" (0.21)")}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="font-medium text-xs text-blue-800 mb-1">{t("Step 4: Weighted sum of value vectors", "步骤 4：值向量的加权和")}</div>
                <div className="font-mono text-xs">
                  output = 0.21 &times; V_The + 0.51 &times; V_cat + 0.17 &times; V_sat + 0.11 &times; V_on
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {t(
                    "The output for \"cat\" is dominated by its own value (51%) and the preceding context \"The\" (21%).",
                    "\"cat\" 的输出由其自身的值（51%）和前文 \"The\"（21%）主导。"
                  )}
                </div>
              </div>
            </div>
          </div>
        </Collapsible>

        {/* ============ Multi-Head Attention ============ */}
        <h2>{t("3. Multi-Head Attention", "3. 多头注意力")}</h2>

        <p>
          {t(
            "Instead of performing a single attention function with d_model-dimensional queries, keys, and values, the paper found it beneficial to linearly project them h times to d_k, d_k, and d_v dimensions respectively and run attention in parallel:",
            "与其用 d_model 维的查询、键和值执行单一注意力函数，论文发现将它们分别线性投影 h 次到 d_k、d_k 和 d_v 维度并并行运行注意力更有效："
          )}
        </p>

        <Math
          display
          label={t("Multi-Head Attention", "多头注意力")}
          tex="\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h)\,W^O"
        />

        <Math
          display
          label={t("Each head", "每个头")}
          tex="\text{head}_i = \text{Attention}(QW_i^Q,\; KW_i^K,\; VW_i^V)"
        />

        <Collapsible title={t("Paper hyperparameters: h=8, d_model=512, d_k=d_v=64", "论文超参数：h=8, d_model=512, d_k=d_v=64")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-2">
              <Math tex="h = 8" />
              <span>{t("8 attention heads in parallel", "8 个并行注意力头")}</span>

              <Math tex="d_{\text{model}} = 512" />
              <span>{t("Total model dimension — the size of each token's representation", "总模型维度 — 每个词元表示的大小")}</span>

              <Math tex="d_k = d_v = 64" />
              <span>
                {t(
                  "Dimension per head: 512 / 8 = 64. Each head operates in a 64-dimensional subspace.",
                  "每个头的维度：512 / 8 = 64。每个头在 64 维子空间中操作。"
                )}
              </span>

              <Math tex="W_i^Q, W_i^K \in \mathbb{R}^{d_{\text{model}} \times d_k}" />
              <span>{t("Learned projection matrices — one set per head", "学习到的投影矩阵 — 每个头一组")}</span>

              <Math tex="W^O \in \mathbb{R}^{h d_v \times d_{\text{model}}}" />
              <span>{t("Output projection — maps concatenated heads back to d_model", "输出投影 — 将拼接的头映射回 d_model")}</span>
            </div>
          </div>
        </Collapsible>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Why multiple heads?", "为什么要多个头？")}</strong>{" "}
            {t(
              "Each head can specialize in a different type of relationship. One head might learn syntactic dependencies (verb-subject agreement), another semantic similarity (synonyms), another coreference resolution (pronouns), and yet another local positional context. Single-head attention must average over all these signals at once.",
              "每个头可以专注于不同类型的关系。一个头可能学习句法依赖关系（动词-主语一致性），另一个学习语义相似性（同义词），另一个学习共指消解（代词），还有一个学习局部位置上下文。单头注意力必须同时对所有这些信号取平均。"
            )}
          </p>
        </div>

        {/* ============ Positional Encoding ============ */}
        <h2>{t("4. Positional Encoding", "4. 位置编码")}</h2>

        <p>
          {t(
            "Self-attention is permutation-equivariant: shuffling the tokens produces shuffled outputs with no other change. The model has no built-in notion of order. To inject position information, the paper adds a positional encoding to each token embedding before the first layer:",
            "自注意力是置换等变的：打乱词元会产生打乱的输出，没有其他变化。模型没有内置的顺序概念。为了注入位置信息，论文在第一层之前向每个词元嵌入添加位置编码："
          )}
        </p>

        <Math
          display
          label={t("Positional encoding (even dimensions)", "位置编码（偶数维度）")}
          tex="\text{PE}_{(pos,\, 2i)} = \sin\!\left(\frac{pos}{10000^{2i / d_{\text{model}}}}\right)"
        />

        <Math
          display
          label={t("Positional encoding (odd dimensions)", "位置编码（奇数维度）")}
          tex="\text{PE}_{(pos,\, 2i+1)} = \cos\!\left(\frac{pos}{10000^{2i / d_{\text{model}}}}\right)"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")}>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[100px_1fr] gap-y-3 gap-x-2">
              <Math tex="pos" />
              <span>{t("Token position in the sequence (0, 1, 2, …)", "词元在序列中的位置 (0, 1, 2, …)")}</span>

              <Math tex="i" />
              <span>{t("Dimension index (0, 1, …, d_model/2 − 1)", "维度索引 (0, 1, …, d_model/2 − 1)")}</span>

              <Math tex="d_{\text{model}}" />
              <span>{t("Model dimension (512 in the base model)", "模型维度（基础模型中为 512）")}</span>

              <span className="font-mono text-xs">10000</span>
              <span>
                {t(
                  "Controls the frequency range. Low i → high frequency (changes rapidly with pos). High i → low frequency (changes slowly). This creates a unique fingerprint for each position.",
                  "控制频率范围。低 i → 高频（随 pos 快速变化）。高 i → 低频（缓慢变化）。这为每个位置创建了唯一的指纹。"
                )}
              </span>
            </div>
          </div>
        </Collapsible>

        <Collapsible title={t("Concrete example: d_model = 4, positions 0–2", "具体例子：d_model = 4，位置 0–2")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "With d_model = 4, we have 4 encoding dimensions (i = 0 and i = 1, each with sin and cos). The frequencies are 1/10000^0 = 1 and 1/10000^(2/4) = 1/100 = 0.01.",
                "d_model = 4 时，我们有 4 个编码维度（i = 0 和 i = 1，各有 sin 和 cos）。频率为 1/10000^0 = 1 和 1/10000^(2/4) = 1/100 = 0.01。"
              )}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-paper-100">
                    <th className="border border-paper-200 px-3 py-2 text-left font-sans">{t("pos", "pos")}</th>
                    <th className="border border-paper-200 px-3 py-2 font-sans">sin(pos)</th>
                    <th className="border border-paper-200 px-3 py-2 font-sans">cos(pos)</th>
                    <th className="border border-paper-200 px-3 py-2 font-sans">sin(0.01·pos)</th>
                    <th className="border border-paper-200 px-3 py-2 font-sans">cos(0.01·pos)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-paper-200 px-3 py-2 font-sans font-medium">0</td>
                    <td className="border border-paper-200 px-3 py-2">0.000</td>
                    <td className="border border-paper-200 px-3 py-2">1.000</td>
                    <td className="border border-paper-200 px-3 py-2">0.000</td>
                    <td className="border border-paper-200 px-3 py-2">1.000</td>
                  </tr>
                  <tr className="bg-paper-50">
                    <td className="border border-paper-200 px-3 py-2 font-sans font-medium">1</td>
                    <td className="border border-paper-200 px-3 py-2">0.841</td>
                    <td className="border border-paper-200 px-3 py-2">0.540</td>
                    <td className="border border-paper-200 px-3 py-2">0.010</td>
                    <td className="border border-paper-200 px-3 py-2">1.000</td>
                  </tr>
                  <tr>
                    <td className="border border-paper-200 px-3 py-2 font-sans font-medium">2</td>
                    <td className="border border-paper-200 px-3 py-2">0.909</td>
                    <td className="border border-paper-200 px-3 py-2">-0.416</td>
                    <td className="border border-paper-200 px-3 py-2">0.020</td>
                    <td className="border border-paper-200 px-3 py-2">1.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-paper-800/60">
              {t(
                "The high-frequency dimensions (sin/cos with frequency 1) change rapidly and distinguish nearby positions. The low-frequency dimensions (frequency 0.01) change slowly and encode coarser position information. Together, they form a unique vector for every position — like a binary clock but continuous.",
                "高频维度（频率为 1 的 sin/cos）变化迅速，区分相邻位置。低频维度（频率 0.01）变化缓慢，编码更粗粒度的位置信息。它们共同为每个位置形成唯一向量 — 类似于二进制时钟，但连续。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Full Architecture ============ */}
        <h2>{t("5. Full Architecture", "5. 完整架构")}</h2>

        <p>
          {t(
            "The Transformer follows an encoder-decoder structure. Both encoder and decoder are stacks of N=6 identical layers.",
            "Transformer 采用编码器-解码器结构。编码器和解码器都是 N=6 个相同层的堆叠。"
          )}
        </p>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">{t("Encoder (6 layers)", "编码器（6 层）")}</h4>
            <ul className="text-xs text-blue-900 space-y-1">
              <li>1. {t("Multi-head self-attention", "多头自注意力")}</li>
              <li>2. {t("Add & LayerNorm", "残差连接 & 层归一化")}</li>
              <li>3. {t("Feed-forward network (d_ff = 2048)", "前馈网络 (d_ff = 2048)")}</li>
              <li>4. {t("Add & LayerNorm", "残差连接 & 层归一化")}</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="text-sm font-semibold text-purple-800 mb-2">{t("Decoder (6 layers)", "解码器（6 层）")}</h4>
            <ul className="text-xs text-purple-900 space-y-1">
              <li>1. {t("Masked multi-head self-attention", "掩码多头自注意力")}</li>
              <li>2. {t("Add & LayerNorm", "残差连接 & 层归一化")}</li>
              <li>3. {t("Multi-head cross-attention (over encoder output)", "多头交叉注意力（在编码器输出上）")}</li>
              <li>4. {t("Add & LayerNorm", "残差连接 & 层归一化")}</li>
              <li>5. {t("Feed-forward network (d_ff = 2048)", "前馈网络 (d_ff = 2048)")}</li>
              <li>6. {t("Add & LayerNorm", "残差连接 & 层归一化")}</li>
            </ul>
          </div>
        </div>

        <p>
          {t(
            "The decoder uses masked self-attention to prevent positions from attending to future positions (causal masking), which is essential for autoregressive generation.",
            "解码器使用掩码自注意力来防止位置关注未来位置（因果掩码），这对于自回归生成至关重要。"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 px-3 py-2 text-left">{t("Model", "模型")}</th>
                <th className="border border-paper-200 px-3 py-2 text-left">{t("Complexity / layer", "每层复杂度")}</th>
                <th className="border border-paper-200 px-3 py-2 text-left">{t("Sequential ops", "顺序操作")}</th>
                <th className="border border-paper-200 px-3 py-2 text-left">{t("Max path length", "最大路径长度")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-3 py-2 font-medium">{t("Self-Attention", "自注意力")}</td>
                <td className="border border-paper-200 px-3 py-2"><Math tex="O(n^2 \cdot d)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-green-700"><Math tex="O(1)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-green-700"><Math tex="O(1)" /></td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-3 py-2 font-medium">{t("Recurrent", "循环")}</td>
                <td className="border border-paper-200 px-3 py-2"><Math tex="O(n \cdot d^2)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-red-700"><Math tex="O(n)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-red-700"><Math tex="O(n)" /></td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-3 py-2 font-medium">{t("Convolutional", "卷积")}</td>
                <td className="border border-paper-200 px-3 py-2"><Math tex="O(k \cdot n \cdot d^2)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-amber-700"><Math tex="O(1)" /></td>
                <td className="border border-paper-200 px-3 py-2 text-amber-700"><Math tex="O(\log_k n)" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ============ Experiments ============ */}
        <h2>{t("6. Experiments & Results", "6. 实验与结果")}</h2>

        <p>
          {t(
            "The Transformer was evaluated on WMT 2014 English-German and English-French translation tasks. Results were striking — not just a new SOTA, but achieved at a fraction of the training cost:",
            "Transformer 在 WMT 2014 英德和英法翻译任务上进行评估。结果令人瞩目 — 不仅创造了新的 SOTA，而且以极少的训练成本实现："
          )}
        </p>

        <div className="space-y-3 my-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-green-900">WMT 2014 EN-DE</span>
              <span className="text-2xl font-bold text-green-700">28.4 BLEU</span>
            </div>
            <p className="text-sm text-green-800 mb-0">
              {t(
                "New state-of-the-art, +2.0 BLEU over the previous best ensemble model. First single model to surpass the best ensemble.",
                "新的最优水平，比之前最佳集成模型高出 2.0 BLEU。首个超越最佳集成模型的单一模型。"
              )}
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-green-900">WMT 2014 EN-FR</span>
              <span className="text-2xl font-bold text-green-700">41.0 BLEU</span>
            </div>
            <p className="text-sm text-green-800 mb-0">
              {t(
                "New state-of-the-art, surpassing all previous models with a single model at lower training cost.",
                "新的最优水平，用单一模型以更低的训练成本超越了之前的所有模型。"
              )}
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-blue-900">{t("Training Cost", "训练成本")}</span>
              <span className="font-bold text-blue-700">3.5 {t("days", "天")}</span>
            </div>
            <p className="text-sm text-blue-800 mb-0">
              {t(
                "8 NVIDIA P100 GPUs, 3.5 days (Big model: 213M params). Previous best RNN models required weeks. ~3× faster training than comparable RNN models.",
                "8 块 NVIDIA P100 GPU，3.5 天（大模型：2.13 亿参数）。之前最好的 RNN 模型需要数周。训练速度比同类 RNN 模型快约 3 倍。"
              )}
            </p>
          </div>
        </div>

        <Collapsible title={t("Ablation studies: what matters most?", "消融研究：什么最重要？")}>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "The paper performed ablations on the EN-DE development set (newstest2013). Key findings:",
                "论文在 EN-DE 开发集（newstest2013）上进行了消融实验。主要发现："
              )}
            </p>
            <ul className="space-y-1">
              <li>
                <strong>{t("Number of heads", "头数")}</strong>: {t(
                  "Single head is 0.9 BLEU worse than 8 heads. But too many heads (16, 32) also degrades performance.",
                  "单头比 8 头差 0.9 BLEU。但头数过多（16、32）也会降低性能。"
                )}
              </li>
              <li>
                <strong>{t("Attention key dimension", "注意力键维度")}</strong>: {t(
                  "Reducing d_k from 64 to 16 hurts quality (−0.7 BLEU) — compatibility function needs sufficient capacity.",
                  "将 d_k 从 64 减小到 16 会损害质量（−0.7 BLEU）— 相似度函数需要足够的容量。"
                )}
              </li>
              <li>
                <strong>{t("Dropout", "Dropout")}</strong>: {t(
                  "Dropout (p=0.1) is critical — removing it hurts significantly, especially for the big model.",
                  "Dropout（p=0.1）至关重要 — 去掉它会显著损害性能，尤其是对大模型。"
                )}
              </li>
              <li>
                <strong>{t("Positional encoding type", "位置编码类型")}</strong>: {t(
                  "Learned positional embeddings performed nearly identically to sinusoidal — but sinusoidal can generalize to longer sequences than seen during training.",
                  "学习的位置嵌入与正弦编码表现几乎相同 — 但正弦编码可以泛化到训练时未见过的更长序列。"
                )}
              </li>
            </ul>
          </div>
        </Collapsible>

        {/* ============ Limitations ============ */}
        <h2>{t("7. Limitations", "7. 局限性")}</h2>

        <ul>
          <li>
            <strong>{t("Quadratic memory in sequence length", "序列长度的二次内存")}</strong>
            {t(
              ": The attention matrix is n × n — for a sequence of 1000 tokens, that's 1,000,000 attention weights per head per layer. Long documents (books, code repositories) quickly exhaust GPU memory.",
              "：注意力矩阵是 n × n — 对于 1000 个词元的序列，每层每个头有 1,000,000 个注意力权重。长文档（书籍、代码仓库）很快耗尽 GPU 内存。"
            )}
          </li>
          <li>
            <strong>{t("No inherent notion of order", "没有固有的顺序概念")}</strong>
            {t(
              ": Self-attention is permutation-equivariant. Position must be injected manually via positional encoding. If the encoding is removed or disrupted, the model becomes a bag-of-words.",
              "：自注意力是置换等变的。位置必须通过位置编码手动注入。如果去掉或破坏编码，模型就变成了词袋模型。"
            )}
          </li>
          <li>
            <strong>{t("Fixed context window", "固定上下文窗口")}</strong>
            {t(
              ": The model can only attend to n tokens at once. There is no mechanism for processing sequences longer than the context window.",
              "：模型一次只能关注 n 个词元。没有处理比上下文窗口更长的序列的机制。"
            )}
          </li>
          <li>
            <strong>{t("Absolute positional encoding", "绝对位置编码")}</strong>
            {t(
              ": The sinusoidal encoding uses absolute positions. While it can extrapolate to longer sequences, the model struggles when inference-time sequences are longer than those seen during training. Later work (RoPE, ALiBi) addressed this with relative encodings.",
              "：正弦编码使用绝对位置。虽然它可以外推到更长的序列，但当推理时序列比训练时见过的更长时，模型会遇到困难。后续工作（RoPE、ALiBi）通过相对编码解决了这个问题。"
            )}
          </li>
        </ul>

        {/* ============ Connections ============ */}
        <h2>{t("8. Connections to Other Work", "8. 与其他工作的联系")}</h2>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <span className="font-semibold text-paper-800/50">{t("BERT (coming soon)", "BERT（即将推出）")}</span>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Uses the Transformer encoder stack for bidirectional language modeling. Pre-trains by masking random tokens (MLM) and predicting the next sentence (NSP). Became the foundation for NLP fine-tuning.",
                "使用 Transformer 编码器栈进行双向语言建模。通过掩码随机词元（MLM）和预测下一个句子（NSP）进行预训练。成为 NLP 微调的基础。"
              )}
            </p>
          </div>

          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <span className="font-semibold text-paper-800/50">{t("GPT (coming soon)", "GPT（即将推出）")}</span>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Uses the Transformer decoder stack for autoregressive language modeling. Generates text left-to-right using causal (masked) self-attention. The architecture behind GPT-2, GPT-3, and ChatGPT.",
                "使用 Transformer 解码器栈进行自回归语言建模。使用因果（掩码）自注意力从左到右生成文本。GPT-2、GPT-3 和 ChatGPT 背后的架构。"
              )}
            </p>
          </div>

          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`${basePath}/papers/llada`} className="font-semibold text-blue-600 hover:underline">
              LLaDA
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Uses the Transformer as backbone for masked diffusion language modeling. Replaces autoregressive decoding with iterative denoising over masked tokens — but the attention mechanism underneath is identical to the original Transformer.",
                "使用 Transformer 作为掩码扩散语言建模的骨干网络。用对掩码词元的迭代去噪替代自回归解码 — 但底层的注意力机制与原始 Transformer 完全相同。"
              )}
            </p>
          </div>

          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <span className="font-semibold text-paper-800/50">{t("FlashAttention (coming soon)", "FlashAttention（即将推出）")}</span>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Optimizes the O(n²) attention computation using IO-aware tiling. Computes the exact same attention as the original Transformer, but avoids materializing the full n × n attention matrix in GPU HBM — enabling much longer context windows.",
                "使用 IO 感知的分块技术优化 O(n²) 注意力计算。计算与原始 Transformer 完全相同的注意力，但避免在 GPU HBM 中实例化完整的 n × n 注意力矩阵 — 从而支持更长的上下文窗口。"
              )}
            </p>
          </div>
        </div>

        {/* ============ Resources ============ */}
        <h2>{t("9. Additional Resources", "9. 补充资源")}</h2>

        <div className="space-y-2 my-4">
          <a
            href="https://arxiv.org/abs/1706.03762"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">Attention Is All You Need (arXiv 1706.03762)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Original paper — Vaswani et al., NeurIPS 2017", "原始论文 — Vaswani et al., NeurIPS 2017")}</span>
          </a>

          <a
            href="https://github.com/tensorflow/tensor2tensor"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">tensor2tensor (GitHub)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Original implementation by the authors", "作者的原始实现")}</span>
          </a>

          <a
            href="https://nlp.seas.harvard.edu/annotated-transformer/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">The Annotated Transformer</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Line-by-line PyTorch implementation with commentary (Rush et al.)", "逐行 PyTorch 实现与注释 (Rush et al.)")}</span>
          </a>
        </div>
      </article>
    </div>
  );
}
