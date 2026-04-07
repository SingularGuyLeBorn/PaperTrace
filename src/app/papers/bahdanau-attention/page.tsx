"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function BahdanauAttentionPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Neural Machine Translation by Jointly Learning to Align and Translate",
            "通过联合学习对齐与翻译实现神经机器翻译"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-gray-400">
          Bahdanau, Cho, Bengio &middot; ICLR 2015 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1409.0473"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1409.0473
          </a>
        </p>
      </header>

      <article className="paper-content space-y-10">

        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Vanilla seq2seq forces the encoder to compress an entire source sentence into a single fixed-size vector — a catastrophic bottleneck for long sentences. Bahdanau et al. fix this by letting the decoder dynamically attend to all encoder hidden states at every output step. The decoder learns a soft alignment over source positions, forming a weighted context vector rather than relying on one frozen summary. This is the origin of attention in deep learning — the direct ancestor of the Transformer's cross-attention.",
              "普通 seq2seq 强迫编码器将整个源句子压缩成一个固定大小的向量——对于长句子来说这是灾难性的瓶颈。Bahdanau 等人让解码器在每个输出步骤动态关注所有编码器隐藏状态来解决这个问题。解码器学习源位置上的软对齐，形成加权上下文向量而非依赖一个冻结的摘要。这是深度学习中注意力机制的起源——Transformer 交叉注意力的直接祖先。"
            )}
          </p>
        </section>

        {/* ============ Section 1: The Bottleneck ============ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("1. The Fixed-Length Bottleneck", "1. 固定长度瓶颈")}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "The standard encoder-decoder architecture (Cho et al. 2014, Sutskever et al. 2014) works as follows: an RNN encoder reads the source sequence token by token, updating a hidden state at each step. When the last token is read, the final hidden state is passed to the decoder as the sole context. The decoder then generates the target sequence from this one vector.",
              "标准编码器-解码器架构（Cho 等人 2014，Sutskever 等人 2014）的工作方式如下：RNN 编码器逐词读取源序列，每步更新一个隐藏状态。读完最后一个词时，最终隐藏状态作为唯一上下文传给解码器。解码器然后从这一个向量生成目标序列。"
            )}
          </p>
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-300 mb-1">
              {t("The problem", "问题所在")}
            </p>
            <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
              {t(
                "Everything the decoder will ever use from the source sentence must be encoded in a single vector of fixed dimension (e.g., 1000 floats). For a 30-word sentence that is already tight; for a 50-word sentence performance degrades noticeably. The encoder must decide upfront which details to preserve — without knowing what the decoder will ask for.",
                "解码器从源句子中使用的所有信息必须编码在一个固定维度的向量中（例如 1000 个浮点数）。对于 30 词的句子已经很紧张；对于 50 词的句子性能明显下降。编码器必须提前决定保留哪些细节——而不知道解码器会需要什么。"
              )}
            </p>
          </div>
          <Collapsible
            title={t(
              "Why is compression especially hard for long sentences?",
              "为什么长句子的压缩特别困难？"
            )}
          >
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
              {t(
                "RNNs have trouble with long-range dependencies due to vanishing gradients. Even without gradient issues, a fixed-size vector is an information bottleneck: the number of bits it can store does not grow with sentence length. Empirically, Cho et al. (2014) showed BLEU scores dropping sharply for sentences longer than ~20 tokens — exactly what Bahdanau attention was designed to fix.",
                "由于梯度消失，RNN 难以处理长距离依赖。即使没有梯度问题，固定大小的向量也是信息瓶颈：它能存储的比特数不随句子长度增长。经验上，Cho 等人（2014）表明对于超过约 20 个词的句子 BLEU 分数急剧下降——这正是 Bahdanau 注意力的设计目标。"
              )}
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {t(
                "The problem is structural, not just about training. A 1000-dimensional vector has the same capacity regardless of whether the source sentence is 5 words or 50. Machine translation is inherently variable-length: you cannot know in advance how much information to retain.",
                "这个问题是结构性的，不仅仅是关于训练。无论源句子是 5 词还是 50 词，1000 维向量都有相同的容量。机器翻译本质上是变长的：你无法提前知道需要保留多少信息。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 2: The Attention Solution ============ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("2. The Attention Solution", "2. 注意力机制解决方案")}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "Instead of compressing everything into one vector, Bahdanau et al. keep all encoder hidden states and let the decoder attend to them. Think of it as giving the decoder a dynamic spotlight: at each output step, it chooses which parts of the source to focus on.",
              "Bahdanau 等人不把所有内容压缩成一个向量，而是保留所有编码器隐藏状态，让解码器关注它们。把它想象成给解码器一个动态聚光灯：在每个输出步骤，它选择关注源的哪些部分。"
            )}
          </p>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "The key insight: instead of a single context vector c shared across all decoder steps, compute a distinct context vector c_t at every decoder step t. This c_t is a weighted combination of all encoder hidden states, where the weights are learned automatically and reflect which source positions are most relevant for generating the current target word.",
              "关键洞察：不是在所有解码器步骤共享单一上下文向量 c，而是在每个解码器步骤 t 计算不同的上下文向量 c_t。这个 c_t 是所有编码器隐藏状态的加权组合，权重是自动学习的，反映哪些源位置与生成当前目标词最相关。"
            )}
          </p>

          {/* Bidirectional encoder */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
              {t("Bidirectional RNN encoder", "双向 RNN 编码器")}
            </p>
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed mb-2">
              {t(
                "The paper introduces a bidirectional RNN encoder. Each source position j gets a hidden state h_j that is the concatenation of a forward and backward pass:",
                "论文引入了双向 RNN 编码器。每个源位置 j 得到一个隐藏状态 h_j，它是前向和后向传递的拼接："
              )}
            </p>
            <Math display tex={`h_j = \\left[ \\overrightarrow{h}_j^\\top \\; ; \\; \\overleftarrow{h}_j^\\top \\right]^\\top`} />
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed mt-2">
              {t(
                "This means h_j contains context from both directions — what comes before and after position j. The annotation h_j is a richer representation than a unidirectional hidden state.",
                "这意味着 h_j 包含两个方向的上下文——位置 j 之前和之后的内容。标注 h_j 比单向隐藏状态更丰富。"
              )}
            </p>
          </div>

          <Collapsible
            title={t(
              "Why does bidirectionality matter for the encoder?",
              "为什么双向性对编码器很重要？"
            )}
          >
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {t(
                "A unidirectional RNN reading left-to-right has only seen the tokens before position j when it produces h_j. For translation, the meaning of a word often depends on what follows it (e.g., verb agreement, prepositional attachment). A bidirectional encoder lets h_j be informed by the full sentence context, making it a better summary of what that position means in context.",
                "从左到右读取的单向 RNN 在生成 h_j 时只看到了位置 j 之前的词元。对于翻译，一个词的含义通常取决于它后面的内容（例如，动词一致，介词附着）。双向编码器让 h_j 被完整句子上下文所知，使其成为该位置在上下文中含义的更好摘要。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 3: Computing Alignment Scores ============ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("3. Computing Alignment Scores", "3. 计算对齐分数")}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "The alignment model assigns a scalar score e_{tj} to each (decoder step t, encoder position j) pair. This score measures how relevant encoder state h_j is when the decoder is at step t with hidden state s_{t-1}.",
              "对齐模型为每个（解码器步骤 t，编码器位置 j）对分配一个标量分数 e_{tj}。这个分数衡量当解码器处于步骤 t 且隐藏状态为 s_{t-1} 时编码器状态 h_j 的相关程度。"
            )}
          </p>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              {t("Additive (concat) alignment model", "加法（拼接）对齐模型")}
            </p>
            <Math display tex={`e_{tj} = v_a^\\top \\tanh\\bigl(W_a s_{t-1} + U_a h_j\\bigr)`} />
            <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mt-3">
              {t(
                "Where W_a and U_a are learned weight matrices and v_a is a learned weight vector. This is a small single-hidden-layer MLP that takes both the previous decoder state s_{t-1} and an encoder state h_j as inputs.",
                "其中 W_a 和 U_a 是学习到的权重矩阵，v_a 是学习到的权重向量。这是一个小型单隐藏层 MLP，将前一个解码器状态 s_{t-1} 和编码器状态 h_j 作为输入。"
              )}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "This is sometimes called \"additive attention\" or \"concat attention\" — as opposed to the dot-product attention used in the Transformer. The MLP allows the model to learn complex nonlinear interactions between the decoder state and encoder state before collapsing to a scalar score.",
              "这有时被称为」加法注意力「或」拼接注意力「——与 Transformer 中使用的点积注意力相反。MLP 允许模型在折叠成标量分数之前学习解码器状态和编码器状态之间复杂的非线性交互。"
            )}
          </p>

          <Collapsible
            title={t(
              "Additive vs. dot-product attention — what's the difference?",
              "加法注意力与点积注意力——有什么区别？"
            )}
          >
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
              {t(
                "Bahdanau uses additive attention: score(s, h) = v^T tanh(Ws + Uh). The Transformer uses scaled dot-product: score(q, k) = q·k / √d_k. Luong et al. (2015) studied both empirically. Dot-product is more computationally efficient because it can be implemented as a single matrix multiplication, while additive attention requires a learned MLP. For moderate dimensions, the two perform similarly. At large scale, dot-product attention (which the Transformer uses) is preferred for speed.",
                "Bahdanau 使用加法注意力：score(s, h) = v^T tanh(Ws + Uh)。Transformer 使用缩放点积：score(q, k) = q·k / √d_k。Luong 等人（2015）对两者进行了实证研究。点积在计算上更高效，因为它可以实现为单次矩阵乘法，而加法注意力需要一个学习到的 MLP。对于中等维度，两者表现相似。在大规模情况下，Transformer 使用的点积注意力因速度而受到青睐。"
              )}
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {t(
                "The conceptual contribution of Bahdanau attention is the idea itself — the mechanism of attending to encoder states — not the specific scoring function. Any differentiable scoring function can play the role of the alignment model.",
                "Bahdanau 注意力的概念贡献是这个想法本身——关注编码器状态的机制——而不是特定的评分函数。任何可微的评分函数都可以扮演对齐模型的角色。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 4: Weights & Context Vector ============ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("4. Attention Weights and Context Vector", "4. 注意力权重与上下文向量")}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "The raw alignment scores e_{tj} are turned into a probability distribution over source positions via softmax. These attention weights α_{tj} tell us how much the decoder should focus on encoder position j when generating output at step t.",
              "原始对齐分数 e_{tj} 通过 softmax 转换为源位置上的概率分布。这些注意力权重 α_{tj} 告诉我们，当在步骤 t 生成输出时，解码器应该多少关注编码器位置 j。"
            )}
          </p>

          <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-teal-800 dark:text-teal-300 mb-3">
              {t("Step 1: Softmax over alignment scores", "步骤 1：对对齐分数做 softmax")}
            </p>
            <Math display tex={`\\alpha_{tj} = \\frac{\\exp(e_{tj})}{\\displaystyle\\sum_{k=1}^{T_x} \\exp(e_{tk})}`} />
            <p className="text-sm text-teal-900 dark:text-teal-200 leading-relaxed mt-3">
              {t(
                "The sum is over all T_x source positions. The result α_{tj} ∈ (0,1) and Σ_j α_{tj} = 1 — it is a proper probability distribution.",
                "求和遍历所有 T_x 个源位置。结果 α_{tj} ∈ (0,1) 且 Σ_j α_{tj} = 1——这是一个正规概率分布。"
              )}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-3">
              {t("Step 2: Weighted sum → context vector", "步骤 2：加权求和 → 上下文向量")}
            </p>
            <Math display tex={`c_t = \\sum_{j=1}^{T_x} \\alpha_{tj}\\, h_j`} />
            <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed mt-3">
              {t(
                "c_t is the context vector for decoder step t. It is a weighted average of all encoder hidden states, where the weights are the attention probabilities. If α_{t3} = 0.8, the context vector is dominated by encoder state h_3.",
                "c_t 是解码器步骤 t 的上下文向量。它是所有编码器隐藏状态的加权平均，权重是注意力概率。如果 α_{t3} = 0.8，上下文向量由编码器状态 h_3 主导。"
              )}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3">
              {t("Step 3: Context-aware decoder update", "步骤 3：上下文感知解码器更新")}
            </p>
            <Math display tex={`s_t = f(s_{t-1},\\, y_{t-1},\\, c_t)`} />
            <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed mt-3">
              {t(
                "The decoder hidden state s_t depends on: the previous hidden state s_{t-1}, the previously generated word y_{t-1}, and the step-specific context c_t. The output word y_t is then predicted from s_t and c_t jointly.",
                "解码器隐藏状态 s_t 取决于：前一个隐藏状态 s_{t-1}，之前生成的词 y_{t-1}，以及步骤特定的上下文 c_t。输出词 y_t 然后从 s_t 和 c_t 联合预测。"
              )}
            </p>
          </div>

          <Collapsible
            title={t(
              "Why is this called 'soft' alignment?",
              "为什么这被称为'软'对齐？"
            )}
          >
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
              {t(
                "Classical word alignment in statistical MT assigns each target word to exactly one source word — a hard, discrete assignment. Bahdanau attention instead assigns fractional weights to all source positions simultaneously. A target word might attend 60% to one source position, 30% to another, and 10% spread over the rest. This is called soft alignment.",
                "统计机器翻译中的经典词对齐将每个目标词精确分配给一个源词——一个硬性的、离散的分配。Bahdanau 注意力则同时为所有源位置分配分数权重。一个目标词可能 60% 关注一个源位置，30% 关注另一个，10% 分散在其余位置。这被称为软对齐。"
              )}
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {t(
                "Soft alignment is differentiable end-to-end — you can backpropagate through the softmax and the weighted sum. This is what makes joint training of alignment and translation possible: everything is a differentiable computation.",
                "软对齐是端到端可微的——你可以通过 softmax 和加权求和进行反向传播。这就是使对齐和翻译联合训练成为可能的原因：一切都是可微的计算。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 5: Worked Example ============ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t(
              "5. Worked Example: Translating \"how are you\"",
              "5. 实例演示：翻译 \"how are you\""
            )}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "Let's trace through computing attention for the first decoder step when translating \"how are you\" → \"comment allez-vous\". This is a toy example to build intuition — real models have higher dimensions and more nuanced weights.",
              "让我们追踪翻译 \"how are you\" → \"comment allez-vous\" 时第一个解码器步骤的注意力计算。这是一个培养直觉的玩具示例——真实模型有更高的维度和更细致的权重。"
            )}
          </p>

          {/* Setup */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {t("Setup", "设置")}
            </p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
              <li>
                {t(
                  "Source: [\"how\", \"are\", \"you\"] → positions j = 1, 2, 3",
                  "源：[\"how\", \"are\", \"you\"] → 位置 j = 1, 2, 3"
                )}
              </li>
              <li>
                {t(
                  "Encoder produces hidden states h_1, h_2, h_3 (bidirectional)",
                  "编码器产生隐藏状态 h_1, h_2, h_3（双向）"
                )}
              </li>
              <li>
                {t(
                  "Decoder initial state: s_0 (from encoder final state)",
                  "解码器初始状态：s_0（来自编码器最终状态）"
                )}
              </li>
              <li>
                {t(
                  "We want to generate y_1 = \"comment\"",
                  "我们想生成 y_1 = \"comment\""
                )}
              </li>
            </ul>
          </div>

          {/* Step by step */}
          <div className="space-y-3">
            <div className="border-l-4 border-blue-400 pl-4">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {t("Step A: Compute alignment scores", "步骤 A：计算对齐分数")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t(
                  "Feed (s_0, h_j) into the alignment MLP for each j:",
                  "对每个 j 将 (s_0, h_j) 输入对齐 MLP："
                )}
              </p>
              <Math display tex={`e_{1,1} = v_a^\\top \\tanh(W_a s_0 + U_a h_1) \\approx 2.1`} />
              <Math display tex={`e_{1,2} = v_a^\\top \\tanh(W_a s_0 + U_a h_2) \\approx 0.3`} />
              <Math display tex={`e_{1,3} = v_a^\\top \\tanh(W_a s_0 + U_a h_3) \\approx 0.8`} />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t(
                  "(scores are illustrative — higher means more relevant)",
                  "（分数仅供说明——越高表示越相关）"
                )}
              </p>
            </div>

            <div className="border-l-4 border-teal-400 pl-4">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {t("Step B: Apply softmax", "步骤 B：应用 softmax")}
              </p>
              <Math display tex={`\\alpha_{1,1} = \\frac{e^{2.1}}{e^{2.1} + e^{0.3} + e^{0.8}} \\approx \\frac{8.17}{8.17 + 1.35 + 2.23} \\approx 0.70`} />
              <Math display tex={`\\alpha_{1,2} \\approx \\frac{1.35}{11.75} \\approx 0.11`} />
              <Math display tex={`\\alpha_{1,3} \\approx \\frac{2.23}{11.75} \\approx 0.19`} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t(
                  "The model is placing 70% of its attention on \"how\" (j=1) — sensible, since \"comment\" is the French translation of \"how\".",
                  "模型将 70% 的注意力放在「how」（j=1）上——合理的，因为「comment」是「how」的法语翻译。"
                )}
              </p>
            </div>

            <div className="border-l-4 border-purple-400 pl-4">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {t("Step C: Compute context vector", "步骤 C：计算上下文向量")}
              </p>
              <Math display tex={`c_1 = 0.70 \\cdot h_1 + 0.11 \\cdot h_2 + 0.19 \\cdot h_3`} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t(
                  "c_1 is dominated by h_1 (the encoding of \"how\"). The decoder uses this context-rich vector to predict \"comment\".",
                  "c_1 由 h_1（「how」的编码）主导。解码器使用这个富含上下文的向量预测「comment」。"
                )}
              </p>
            </div>

            <div className="border-l-4 border-green-400 pl-4">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {t("Step D: Update decoder state", "步骤 D：更新解码器状态")}
              </p>
              <Math display tex={`s_1 = f(s_0,\\; \\langle\\text{BOS}\\rangle,\\; c_1)`} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t(
                  "The new decoder state s_1 incorporates the focused context. Then for y_2 = \"allez\", we recompute new alignment scores using s_1 and a fresh set of weights, likely attending more to h_2 (\"are\") and h_3 (\"you\").",
                  "新的解码器状态 s_1 包含了聚焦的上下文。然后对于 y_2 = \"allez\"，我们使用 s_1 重新计算新的对齐分数和一组新的权重，可能更多地关注 h_2（\"are\"）和 h_3（\"you\"）。"
                )}
              </p>
            </div>
          </div>

          <Collapsible
            title={t(
              "Why does the attention pattern shift for each output word?",
              "为什么每个输出词的注意力模式会变化？"
            )}
          >
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
              {t(
                "Because the decoder state s_{t-1} changes at every step. The alignment model score(s_{t-1}, h_j) depends on s_{t-1}, so as the decoder generates more words and its state evolves, the relevance of each encoder position changes too. When generating \"comment\", the decoder is asking \"what is the source word I'm translating right now?\" — and h_1 (\"how\") scores highest. When generating \"allez\", s_1 reflects that \"comment\" has been generated, and h_2/h_3 become more relevant.",
                "因为解码器状态 s_{t-1} 在每个步骤都会改变。对齐模型分数 score(s_{t-1}, h_j) 取决于 s_{t-1}，所以随着解码器生成更多词且其状态演变，每个编码器位置的相关性也会改变。生成「comment」时，解码器在问「我现在翻译的源词是什么？」——h_1（「how」）得分最高。生成「allez」时，s_1 反映「comment」已经被生成，h_2/h_3 变得更相关。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 6: Alignment Matrix ============ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("6. The Alignment Matrix Visualization", "6. 对齐矩阵可视化")}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "One of the most striking results in the paper is Figure 3: a heatmap of attention weights α_{tj} for an English-to-French sentence pair. Rows are target words, columns are source words. High α means the decoder attended strongly to that source word when generating that target word.",
              "论文中最引人注目的结果之一是图 3：英法句对的注意力权重 α_{tj} 热图。行是目标词，列是源词。高 α 意味着解码器在生成该目标词时强烈关注该源词。"
            )}
          </p>
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {t("What the alignment matrix reveals", "对齐矩阵揭示的内容")}
            </p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>
                {t(
                  "Mostly monotonic alignment for English-French (similar word order), shown as a diagonal band",
                  "英法语的对齐大多是单调的（词序相似），表现为对角线带"
                )}
              </li>
              <li>
                {t(
                  "Non-monotonic alignment visible at adjective-noun inversions (French often reverses English adj-noun order)",
                  "形容词-名词倒置处可见非单调对齐（法语常常颠倒英语的形-名顺序）"
                )}
              </li>
              <li>
                {t(
                  "The model learned this alignment structure entirely from parallel text — no explicit alignment supervision",
                  "模型完全从平行文本中学习了这种对齐结构——没有明确的对齐监督"
                )}
              </li>
              <li>
                {t(
                  "\"[EOSf]\" (French end token) attends broadly — consistent with the decoder knowing the sentence is done",
                  "\"[EOSf]\"（法语结束符）广泛关注——与解码器知道句子结束一致"
                )}
              </li>
            </ul>
          </div>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {t(
              "The alignment matrix is not just an interpretability tool — it validates that the mechanism is doing what we intended. The model really is learning to soft-align source and target words, recovering structure that linguists have studied for decades.",
              "对齐矩阵不仅仅是一个可解释性工具——它验证了该机制正在做我们预期的事情。模型确实在学习软对齐源语言和目标语言的词，恢复语言学家研究了数十年的结构。"
            )}
          </p>
        </section>

        {/* ============ Section 7: Results ============ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("7. Results on WMT English-French", "7. WMT 英法翻译结果")}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "The experiments compare three systems on WMT 2014 English-French translation: a vanilla RNNenc-dec without attention, an RNNsearch model with attention (this paper), and Moses — a mature phrase-based statistical MT system representing state of the art at the time.",
              "实验在 WMT 2014 英法翻译上比较了三个系统：没有注意力的普通 RNNenc-dec，带注意力的 RNNsearch 模型（本文），以及 Moses——当时代表最先进水平的成熟短语统计机器翻译系统。"
            )}
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="text-sm w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold text-gray-800 dark:text-gray-200">
                    {t("Model", "模型")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center font-semibold text-gray-800 dark:text-gray-200">
                    BLEU
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold text-gray-800 dark:text-gray-200">
                    {t("Notes", "备注")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-gray-50 dark:even:bg-gray-800/40">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300">
                    RNNenc-dec {t("(no attention)", "（无注意力）")}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                    26.71
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {t("Degrades on sentences > 20 words", "句子 > 20 词时性能下降")}
                  </td>
                </tr>
                <tr className="even:bg-gray-50 dark:even:bg-gray-800/40">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300">
                    RNNsearch-50 {t("(with attention)", "（带注意力）")}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center font-semibold text-green-700 dark:text-green-400">
                    28.45
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {t("Robust on long sentences", "长句子上保持稳健")}
                  </td>
                </tr>
                <tr className="even:bg-gray-50 dark:even:bg-gray-800/40">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300">
                    Moses {t("(phrase-based SMT)", "（短语统计机器翻译）")}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                    33.30
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {t("Highly engineered, uses large n-gram LMs", "高度工程化，使用大型 n-gram 语言模型")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
              {t("The key finding", "关键发现")}
            </p>
            <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed">
              {t(
                "RNNsearch-50 surpasses the vanilla RNNenc-dec by 1.7 BLEU on known-vocabulary test sets, and by a larger margin on sentences longer than 20 words. Critically, the performance gap between with- and without-attention grows with sentence length — directly confirming the bottleneck hypothesis. The model without attention degrades sharply; the model with attention maintains quality even for 50+ word sentences.",
                "RNNsearch-50 在已知词汇测试集上超过普通 RNNenc-dec 1.7 BLEU，在超过 20 词的句子上超过更大。关键地，有无注意力之间的性能差距随句子长度增大——直接证实了瓶颈假设。没有注意力的模型急剧下降；有注意力的模型即使对于 50+ 词的句子也保持质量。"
              )}
            </p>
          </div>

          <Collapsible
            title={t(
              "Why didn't RNNsearch beat Moses outright?",
              "为什么 RNNsearch 没有完全超过 Moses？"
            )}
          >
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
              {t(
                "Moses was a highly engineered system with years of tuning, large phrase tables, and external n-gram language models trained on hundreds of millions of words. RNNsearch was a proof of concept trained end-to-end. Subsequent work — especially the Transformer (Vaswani et al. 2017) — did surpass phrase-based SMT decisively. But in 2014, closing the gap to Moses using a pure neural approach was remarkable.",
                "Moses 是一个经过多年调整的高度工程化系统，拥有大型短语表和在数亿词上训练的外部 n-gram 语言模型。RNNsearch 是端到端训练的概念验证。后续工作——尤其是 Transformer（Vaswani 等人 2017）——确实决定性地超过了基于短语的统计机器翻译。但在 2014 年，使用纯神经方法缩小与 Moses 的差距是了不起的。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 8: Connection to Self-Attention ============ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t(
              "8. Connection to the Transformer and Self-Attention",
              "8. 与 Transformer 和自注意力的联系"
            )}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "Bahdanau attention is cross-attention: the query comes from the decoder, the keys and values come from the encoder. The Transformer (Vaswani et al. 2017) generalizes this in two ways:",
              "Bahdanau 注意力是交叉注意力：查询来自解码器，键和值来自编码器。Transformer（Vaswani 等人 2017）以两种方式泛化了这一点："
            )}
          </p>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside mb-4">
            <li>
              {t(
                "Self-attention: queries, keys, and values all come from the same sequence — allowing a sequence to attend to itself",
                "自注意力：查询、键和值都来自同一序列——允许序列关注自身"
              )}
            </li>
            <li>
              {t(
                "Dot-product scoring instead of additive MLP scoring — more computationally efficient",
                "点积评分而非加法 MLP 评分——计算效率更高"
              )}
            </li>
            <li>
              {t(
                "Multi-head attention: run attention multiple times in parallel with different projections",
                "多头注意力：使用不同投影并行运行多次注意力"
              )}
            </li>
            <li>
              {t(
                "No recurrence at all: the Transformer replaces the RNN entirely with attention",
                "完全没有循环：Transformer 完全用注意力替代 RNN"
              )}
            </li>
          </ul>

          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {t("Conceptual lineage", "概念谱系")}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 px-2 py-1 rounded">
                {t("RNN seq2seq (2014)", "RNN seq2seq (2014)")}
              </span>
              <span className="text-gray-400 dark:text-gray-500 self-center">→</span>
              <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">
                {t("Bahdanau Attention (2015)", "Bahdanau 注意力 (2015)")}
              </span>
              <span className="text-gray-400 dark:text-gray-500 self-center">→</span>
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                {t("Luong Attention (2015)", "Luong 注意力 (2015)")}
              </span>
              <span className="text-gray-400 dark:text-gray-500 self-center">→</span>
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 px-2 py-1 rounded">
                {t("Transformer (2017)", "Transformer (2017)")}
              </span>
              <span className="text-gray-400 dark:text-gray-500 self-center">→</span>
              <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                {t("BERT, GPT, LLMs...", "BERT, GPT, 大语言模型...")}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "The Transformer's encoder-decoder cross-attention is exactly Bahdanau attention with dot-product scoring and linear projections (Q, K, V matrices). The decoder's cross-attention layer computes attention weights between the decoder's current state and all encoder outputs — the same computation, just generalized and scaled.",
              "Transformer 的编码器-解码器交叉注意力正是带有点积评分和线性投影（Q、K、V 矩阵）的 Bahdanau 注意力。解码器的交叉注意力层计算解码器当前状态与所有编码器输出之间的注意力权重——同样的计算，只是泛化和扩展了。"
            )}
          </p>

          <Collapsible
            title={t(
              "Why does attention scale to modern LLMs?",
              "为什么注意力机制能扩展到现代大语言模型？"
            )}
          >
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
              {t(
                "Three reasons. First, attention is fully parallelizable across positions — unlike RNNs which must process sequentially. This enables training on massive hardware. Second, the path length between any two positions is O(1) in attention (vs. O(n) in RNNs), making it easier to capture long-range dependencies. Third, attention weights are interpretable: you can visualize what the model attends to, which aids debugging and analysis.",
                "三个原因。第一，注意力在位置上是完全可并行化的——不像 RNN 必须顺序处理。这使得在大规模硬件上训练成为可能。第二，注意力中任意两个位置之间的路径长度是 O(1)（vs. RNN 中的 O(n)），使其更容易捕捉长距离依赖。第三，注意力权重是可解释的：你可以可视化模型关注什么，这有助于调试和分析。"
              )}
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {t(
                "Bahdanau attention introduced all three of these properties in the context of seq2seq. The Transformer's contribution was eliminating recurrence entirely and showing that pure attention is sufficient — at scale.",
                "Bahdanau 注意力在 seq2seq 的背景下引入了所有这三个属性。Transformer 的贡献是完全消除循环，并表明纯注意力就足够了——在大规模情况下。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 9: Why This Paper Matters ============ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("9. Why This Paper Matters", "9. 为什么这篇论文重要")}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            {t(
              "As of early 2025, this paper has over 20,000 citations. But citation counts undersell its impact. Essentially every modern large language model — GPT-4, Claude, Gemini, LLaMA — descends directly from the ideas in this 2014 paper. The attention mechanism is the core computational primitive of modern AI.",
              "截至 2025 年初，这篇论文已被引用超过 20,000 次。但引用次数低估了它的影响。基本上每一个现代大型语言模型——GPT-4、Claude、Gemini、LLaMA——都直接源自这篇 2014 年论文的思想。注意力机制是现代 AI 的核心计算原语。"
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">
                {t("Conceptual leap", "概念飞跃")}
              </p>
              <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                {t(
                  "Broke the fixed-vector bottleneck. Showed that dynamic, input-conditioned context is learnable end-to-end.",
                  "打破了固定向量瓶颈。表明动态的、输入条件化的上下文是可以端到端学习的。"
                )}
              </p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-teal-800 dark:text-teal-300 mb-1">
                {t("Interpretability", "可解释性")}
              </p>
              <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
                {t(
                  "Introduced alignment visualization as a window into model behavior — the first widely used neural interpretability tool.",
                  "引入对齐可视化作为模型行为的窗口——第一个广泛使用的神经可解释性工具。"
                )}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 mb-1">
                {t("Engineering template", "工程模板")}
              </p>
              <p className="text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
                {t(
                  "Established score → softmax → weighted-sum as the standard attention recipe, still used in every Transformer today.",
                  "建立了 score → softmax → 加权求和作为标准注意力配方，至今仍用于每个 Transformer。"
                )}
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                {t("Scalability foundation", "可扩展性基础")}
              </p>
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                {t(
                  "Attention is differentiable and parallelizable. These properties made the Transformer possible and enabled the scaling laws era.",
                  "注意力是可微且可并行化的。这些属性使 Transformer 成为可能，并开启了扩展定律时代。"
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ============ Further Reading ============ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("Further Reading", "延伸阅读")}
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://arxiv.org/abs/1409.0473"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {t(
                  "Original paper — Bahdanau et al. (2014)",
                  "原始论文 — Bahdanau 等人 (2014)"
                )}
              </a>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/1508.04025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {t(
                  "Luong et al. (2015) — Effective Approaches to Attention (dot-product & concat variants)",
                  "Luong 等人 (2015) — 有效的注意力方法（点积与拼接变体）"
                )}
              </a>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/1706.03762"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {t(
                  "Vaswani et al. (2017) — Attention Is All You Need (the Transformer)",
                  "Vaswani 等人 (2017) — Attention Is All You Need（Transformer）"
                )}
              </a>
            </li>
            <li>
              <a
                href="https://distill.pub/2016/augmented-rnns/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {t(
                  "Distill.pub — Attention and Augmented Recurrent Neural Networks (excellent visual explanation)",
                  "Distill.pub — 注意力与增强循环神经网络（优秀的可视化解释）"
                )}
              </a>
            </li>
            <li>
              <a
                href="https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {t(
                  "Jay Alammar — Visualizing seq2seq with attention (interactive diagrams)",
                  "Jay Alammar — 可视化带注意力的 seq2seq（交互图表）"
                )}
              </a>
            </li>
          </ul>
        </section>

        {/* ============ Back link ============ */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← {t("Back to Papers", "返回论文列表")}
          </Link>
        </div>

      </article>
    </div>
  );
}
