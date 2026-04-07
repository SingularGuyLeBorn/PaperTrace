"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function RNNRegularizationPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Recurrent Neural Network Regularization",
            "循环神经网络正则化"
          )}
        </h1>
        <p className="text-paper-800/50">
          Zaremba, Sutskever, Vinyals &middot; 2014 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1409.2329"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1409.2329
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "Applying dropout naively to recurrent connections in LSTMs destroys long-range memory and hurts performance. The fix is simple: apply dropout only on the vertical (non-recurrent) connections — between layers and at input/output — but never on the horizontal recurrent connections across timesteps. This achieved 68.0 test perplexity on PTB, beating the previous SOTA of 78.4, and became the standard recipe for regularizing RNNs for years.",
              "将 dropout 直接应用于 LSTM 的循环连接会破坏长程记忆，导致性能下降。解决方案简单直接：只在垂直（非循环）连接上应用 dropout——即层间连接和输入/输出层——而绝不在跨时间步的水平循环连接上应用。这一方法在 PTB 上取得了 68.0 的测试困惑度，超越了此前 78.4 的最优结果，并成为此后多年正则化 RNN 的标准做法。"
            )}
          </p>
        </section>

        {/* ============ Section 1: Dropout in Feedforward Networks ============ */}
        <h2>
          {t(
            "1. Dropout in Feedforward Networks",
            "1. 前馈网络中的 Dropout"
          )}
        </h2>

        <p>
          {t(
            "Dropout (Srivastava et al. 2014) is one of the most effective regularization techniques for deep neural networks. During training, it randomly zeros out activations with probability p, then rescales survivors to keep expected values unchanged. At test time, all units are kept but weights are scaled by (1-p).",
            "Dropout（Srivastava et al. 2014）是深度神经网络最有效的正则化技术之一。在训练期间，它以概率 p 随机将激活值置零，然后对保留的激活值进行缩放，以保持期望值不变。在测试时，所有单元均保留，但权重乘以 (1-p) 进行缩放。"
          )}
        </p>

        <p>
          {t(
            "The standard dropout formulation applies a Bernoulli mask to a hidden layer h:",
            "标准 dropout 公式将 Bernoulli 掩码应用于隐藏层 h："
          )}
        </p>

        <Math
          display
          label={t("Standard dropout mask", "标准 dropout 掩码")}
          tex="\tilde{h} = \frac{\mathbf{m}}{1-p} \odot h, \quad \mathbf{m} \sim \text{Bernoulli}(1-p)"
        />

        <p>
          {t(
            "Each element of m is independently drawn: 1 (keep) with probability 1-p, and 0 (drop) with probability p. The factor 1/(1-p) is the inverted dropout scaling that keeps expected activations the same as at test time. In practice, modern frameworks implement this as inverted dropout so no rescaling is needed at test time.",
            "m 的每个元素独立采样：以概率 1-p 为 1（保留），以概率 p 为 0（丢弃）。因子 1/(1-p) 是倒置 dropout 的缩放系数，使得期望激活值与测试时相同。在实践中，现代框架实现的是倒置 dropout，因此测试时无需重新缩放。"
          )}
        </p>

        <p>
          {t(
            "For feedforward networks, dropout between every pair of layers is straightforward and highly effective. The question is: can the same trick be applied to recurrent neural networks?",
            "对于前馈网络，在每对层之间使用 dropout 简单直接且效果显著。问题在于：同样的技巧能否应用于循环神经网络？"
          )}
        </p>

        <Collapsible
          title={t(
            "Why dropout works: the ensemble interpretation",
            "Dropout 为何有效：集成解释"
          )}
        >
          <p className="text-sm">
            {t(
              "At each training step, dropout samples a different thinned network (a subnetwork of the original). Training with dropout is equivalent to training an exponential number of weight-shared subnetworks and averaging their predictions at test time. This ensemble effect is what makes dropout such a powerful regularizer — it prevents co-adaptation of features, forcing each unit to be independently useful.",
              "在每个训练步骤中，dropout 采样一个不同的稀疏网络（原始网络的子网络）。使用 dropout 训练等价于训练指数数量的权重共享子网络，并在测试时对其预测取平均。这种集成效果使 dropout 成为强大的正则化器——它防止特征的协同适应，迫使每个单元独立地发挥作用。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 2: The Naive RNN Dropout Mistake ============ */}
        <h2>
          {t(
            "2. The Naive RNN Dropout Mistake",
            "2. 简单应用 Dropout 到 RNN 的错误"
          )}
        </h2>

        <p>
          {t(
            "A naive approach would apply dropout uniformly to all connections in an RNN — both the vertical connections (between layers at the same timestep) and the horizontal recurrent connections (carrying hidden state from one timestep to the next). This turns out to be a serious mistake.",
            "一种朴素的方法是将 dropout 均匀地应用于 RNN 中的所有连接——包括垂直连接（同一时间步的层间连接）和水平循环连接（将隐藏状态从一个时间步传递到下一个时间步）。事实证明，这是一个严重的错误。"
          )}
        </p>

        <p>
          {t(
            "In a sequence model, information must flow across T timesteps. If dropout is applied to recurrent connections at each timestep, the hidden state signal must survive repeated random erasure across the entire sequence. For a sequence of length T with dropout probability p applied at each step, the expected number of times any given unit survives all T timestep connections is (1-p)^T — which goes to 0 exponentially fast as T grows.",
            "在序列模型中，信息必须跨越 T 个时间步流动。如果在每个时间步对循环连接应用 dropout，隐藏状态信号必须在整个序列中经历反复的随机擦除。对于长度为 T 的序列，在每步使用概率 p 的 dropout 时，任意给定单元在所有 T 个时间步连接中均存活的期望次数为 (1-p)^T——随着 T 的增长，这以指数速度趋向 0。"
          )}
        </p>

        <Math
          display
          label={t(
            "Signal survival probability over T steps",
            "T 步后信号存活概率"
          )}
          tex="P(\text{signal survives } T \text{ steps}) = (1-p)^T \xrightarrow{T \to \infty} 0"
        />

        <p>
          {t(
            "The result: long-range dependencies are effectively severed. The gradient signal for events far back in time gets multiplied by (1-p)^T times the recurrent weight Jacobian — a product that vanishes rapidly. The network can no longer learn from context beyond a few steps, which is precisely what RNNs are designed to capture.",
            "结果是：长程依赖关系被有效切断。对于序列中较早发生的事件，梯度信号需要乘以 (1-p)^T 倍的循环权重雅可比矩阵——这一乘积迅速消失。网络无法再从几步之前的上下文中学习，而这恰恰是 RNN 设计用来捕获的内容。"
          )}
        </p>

        <Collapsible
          title={t(
            "Contrast with feedforward networks",
            "与前馈网络的对比"
          )}
        >
          <p className="text-sm">
            {t(
              "In a feedforward network with L layers, dropout between layers means signal must survive L independent masks — a fixed cost regardless of input length. In an RNN, the equivalent cost is T masks along the time dimension, and T grows with sequence length. Language model sequences are typically 20–35 words; machine translation can be much longer. This is why dropout on recurrent connections is far more harmful than on feedforward connections.",
              "在一个有 L 层的前馈网络中，层间 dropout 意味着信号必须通过 L 个独立掩码——这是一个与输入长度无关的固定代价。而在 RNN 中，等价的代价是沿时间维度的 T 个掩码，且 T 随序列长度增长。语言模型序列通常为 20-35 个词；机器翻译序列可能更长。这就是为什么循环连接上的 dropout 比前馈连接上的 dropout 危害大得多。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 3: The Fix ============ */}
        <h2>
          {t(
            "3. The Fix: Only Drop Vertical Connections",
            "3. 解决方案：只在垂直连接上应用 Dropout"
          )}
        </h2>

        <p>
          {t(
            "The key contribution of Zaremba et al. is elegantly simple: apply dropout only on the non-recurrent (vertical) connections. Specifically:",
            "Zaremba et al. 的核心贡献优雅简洁：只在非循环（垂直）连接上应用 dropout。具体而言："
          )}
        </p>

        <ul>
          <li>
            <strong>{t("Drop: ", "丢弃：")}</strong>
            {t(
              "Input to the first hidden layer (embedding → hidden layer 1)",
              "输入到第一个隐藏层（词嵌入 → 隐藏层 1）"
            )}
          </li>
          <li>
            <strong>{t("Drop: ", "丢弃：")}</strong>
            {t(
              "Between stacked LSTM layers (hidden layer l → hidden layer l+1)",
              "堆叠 LSTM 层之间（隐藏层 l → 隐藏层 l+1）"
            )}
          </li>
          <li>
            <strong>{t("Drop: ", "丢弃：")}</strong>
            {t(
              "From the final hidden layer to the output (hidden layer L → softmax)",
              "从最终隐藏层到输出（隐藏层 L → softmax）"
            )}
          </li>
          <li>
            <strong>{t("Never drop: ", "绝不丢弃：")}</strong>
            {t(
              "The recurrent connections h_t^l → h_{t+1}^l within each layer across timesteps",
              "每层内跨时间步的循环连接 h_t^l → h_{t+1}^l"
            )}
          </li>
        </ul>

        <p>
          {t(
            "With this scheme, each dropout mask is applied at most once per training step along the time dimension, not T times. The recurrent connections remain intact, preserving gradient flow and long-range memory.",
            "采用这种方案，每个 dropout 掩码在时间维度上每个训练步骤最多只应用一次，而不是 T 次。循环连接保持完整，从而保留梯度流和长程记忆。"
          )}
        </p>

        <Math
          display
          label={t(
            "Correct dropout: applied to vertical connections only",
            "正确的 dropout：只应用于垂直连接"
          )}
          tex="h_t^l = f\!\left(\text{dropout}(h_t^{l-1}) \cdot W_{x} + h_{t-1}^l \cdot W_{h} + b\right)"
        />

        <p>
          {t(
            "Notice that h_t^{l-1} (the vertical input from the layer below) passes through dropout, but h_{t-1}^l (the horizontal recurrent input from the previous timestep at the same layer) does not.",
            "注意，h_t^{l-1}（来自下方层的垂直输入）经过 dropout，但 h_{t-1}^l（同层前一时间步的水平循环输入）不经过 dropout。"
          )}
        </p>

        <Collapsible
          title={t(
            "Intuition: which connections carry memory vs. input?",
            "直觉：哪些连接承载记忆，哪些承载输入？"
          )}
        >
          <p className="text-sm">
            {t(
              "Think of the LSTM as having two distinct pathways. The vertical path (across layers at the same timestep) carries the current input signal — it transforms the current observation through the network hierarchy. The horizontal path (across timesteps at the same layer) carries the memory of the past. Dropout regularizes the input pathway, preventing overfitting to specific input patterns, while leaving the memory pathway untouched so the network retains what it has learned about long-range structure.",
              "将 LSTM 视为具有两条不同路径。垂直路径（同一时间步跨层）承载当前输入信号——它将当前观测通过网络层次结构进行变换。水平路径（同一层跨时间步）承载过去的记忆。Dropout 对输入路径进行正则化，防止对特定输入模式的过拟合，同时保持记忆路径完整，使网络保留其对长程结构的学习成果。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 4: LSTM Architecture with Dropout ============ */}
        <h2>
          {t(
            "4. LSTM Architecture with Dropout",
            "4. 带 Dropout 的 LSTM 架构"
          )}
        </h2>

        <p>
          {t(
            "The paper uses a standard multi-layer LSTM. Let's write out the full LSTM equations to see precisely where dropout is and isn't applied. For layer l at timestep t, the LSTM computes four gates:",
            "本文使用标准的多层 LSTM。让我们写出完整的 LSTM 方程，以精确了解 dropout 应用和不应用的位置。对于时间步 t 的第 l 层，LSTM 计算四个门："
          )}
        </p>

        <Math
          display
          label={t("LSTM input gate", "LSTM 输入门")}
          tex="i_t = \sigma\!\left(W_{xi}\,\tilde{h}_t^{l-1} + W_{hi}\,h_{t-1}^l + b_i\right)"
        />

        <Math
          display
          label={t("LSTM forget gate", "LSTM 遗忘门")}
          tex="f_t = \sigma\!\left(W_{xf}\,\tilde{h}_t^{l-1} + W_{hf}\,h_{t-1}^l + b_f\right)"
        />

        <Math
          display
          label={t("LSTM output gate", "LSTM 输出门")}
          tex="o_t = \sigma\!\left(W_{xo}\,\tilde{h}_t^{l-1} + W_{ho}\,h_{t-1}^l + b_o\right)"
        />

        <Math
          display
          label={t("LSTM cell candidate (g gate)", "LSTM 候选记忆（g 门）")}
          tex="g_t = \tanh\!\left(W_{xg}\,\tilde{h}_t^{l-1} + W_{hg}\,h_{t-1}^l + b_g\right)"
        />

        <Math
          display
          label={t("LSTM cell state update", "LSTM 记忆状态更新")}
          tex="c_t^l = f_t \odot c_{t-1}^l + i_t \odot g_t"
        />

        <Math
          display
          label={t("LSTM hidden state output", "LSTM 隐藏状态输出")}
          tex="h_t^l = o_t \odot \tanh(c_t^l)"
        />

        <p>
          {t(
            "The key notation is the tilde: ",
            "关键符号是波浪线："
          )}
          <Math tex="\tilde{h}_t^{l-1} = \text{dropout}(h_t^{l-1})" />
          {t(
            " — the dropped-out version of the layer below's output. All four gate computations receive this dropped version as vertical input. By contrast, the recurrent term ",
            "——来自下方层输出的 dropout 版本。所有四个门的计算都接收这个经过 dropout 处理的垂直输入。相比之下，循环项 "
          )}
          <Math tex="h_{t-1}^l" />
          {t(
            " carries no mask — it is always used intact.",
            " 不带掩码——始终完整使用。"
          )}
        </p>

        <Collapsible
          title={t(
            "Full multi-layer picture: what gets dropped where",
            "完整多层视图：什么位置被丢弃"
          )}
          defaultOpen
        >
          <div className="text-sm space-y-3">
            <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 items-center">
              <span className="font-mono text-xs bg-paper-100 rounded px-2 py-1">
                input → h^1
              </span>
              <span className="text-green-700 font-semibold">
                {t("dropout applied", "应用 dropout")}
              </span>

              <span className="font-mono text-xs bg-paper-100 rounded px-2 py-1">
                h^1 → h^2
              </span>
              <span className="text-green-700 font-semibold">
                {t("dropout applied", "应用 dropout")}
              </span>

              <span className="font-mono text-xs bg-paper-100 rounded px-2 py-1">
                h^L → output
              </span>
              <span className="text-green-700 font-semibold">
                {t("dropout applied", "应用 dropout")}
              </span>

              <span className="font-mono text-xs bg-paper-100 rounded px-2 py-1">
                h_t^l → h_{"{t+1}"}^l
              </span>
              <span className="text-red-600 font-semibold">
                {t("NO dropout", "不应用 dropout")}
              </span>

              <span className="font-mono text-xs bg-paper-100 rounded px-2 py-1">
                c_t^l → c_{"{t+1}"}^l
              </span>
              <span className="text-red-600 font-semibold">
                {t("NO dropout", "不应用 dropout")}
              </span>
            </div>
            <p className="text-xs text-paper-800/60 mt-2">
              {t(
                "The cell state c and the hidden state h both flow horizontally without any mask, preserving the LSTM's ability to carry long-range information.",
                "记忆状态 c 和隐藏状态 h 均在水平方向上无掩码地流动，保留了 LSTM 携带长程信息的能力。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 5: Why Recurrent Connections Are Special ============ */}
        <h2>
          {t(
            "5. Why Recurrent Connections Are Special",
            "5. 为什么循环连接如此特殊"
          )}
        </h2>

        <p>
          {t(
            "The fundamental reason is the role of recurrent connections in gradient flow during backpropagation through time (BPTT). For a sequence of length T, the gradient of the loss with respect to an early hidden state requires multiplying through T Jacobians of the recurrent transition:",
            "根本原因在于循环连接在时间反向传播（BPTT）中梯度流中的作用。对于长度为 T 的序列，损失关于早期隐藏状态的梯度需要乘以 T 个循环转换的雅可比矩阵："
          )}
        </p>

        <Math
          display
          label={t("Gradient flow in BPTT", "BPTT 中的梯度流")}
          tex="\frac{\partial \mathcal{L}}{\partial h_1} = \frac{\partial \mathcal{L}}{\partial h_T} \prod_{t=2}^{T} \frac{\partial h_t}{\partial h_{t-1}}"
        />

        <p>
          {t(
            "This product of T Jacobians is already fragile — it is the source of the vanishing and exploding gradient problems that motivated the LSTM's design. Adding dropout to recurrent connections multiplies each Jacobian by an additional sparse binary mask, making the product even more likely to vanish. The LSTM's cell state with its additive update was designed specifically to maintain a stable gradient highway; disrupting that highway with dropout defeats the purpose.",
            "这个 T 个雅可比矩阵的乘积本身已经很脆弱——它是促使 LSTM 设计的梯度消失和爆炸问题的根源。在循环连接上添加 dropout 会使每个雅可比矩阵额外乘以一个稀疏二值掩码，使乘积更容易消失。LSTM 的记忆状态通过其加法更新专门设计用于维持稳定的梯度通路；用 dropout 破坏这条通路会适得其反。"
          )}
        </p>

        <p>
          {t(
            "More intuitively: the recurrent connections implement the network's working memory. A language model must remember that it is inside a relative clause, or that a number was singular three words ago for subject-verb agreement. These are the dependencies that make language modeling hard. Randomly erasing recurrent activations is like randomly scrambling someone's working memory mid-sentence — they lose the thread of what they were computing.",
            "更直观地说：循环连接实现了网络的工作记忆。语言模型必须记住它正处于从句内部，或者三个词前的数字是单数（用于主谓一致）。这些正是使语言建模困难的依赖关系。随机擦除循环激活就像在句子中途随机打乱某人的工作记忆——他们会失去正在计算内容的线索。"
          )}
        </p>

        <Collapsible
          title={t(
            "The LSTM cell state as a gradient highway",
            "LSTM 记忆状态作为梯度通路"
          )}
        >
          <p className="text-sm">
            {t(
              "The LSTM's design insight (Hochreiter & Schmidhuber 1997) was to have a separate cell state c_t that updates additively rather than through a saturating nonlinearity. The cell update c_t = f_t ⊙ c_{t-1} + i_t ⊙ g_t means that with forget gate f_t ≈ 1, gradient flows backwards through the cell state essentially unchanged — a constant error carousel. Zaremba et al. preserve this by never masking the horizontal c_t path. Applied dropout on the cell state would break the additive highway and reintroduce the vanishing gradient problem the LSTM was designed to solve.",
              "LSTM 的设计洞见（Hochreiter & Schmidhuber 1997）是拥有一个单独的记忆状态 c_t，它通过加法而非饱和非线性进行更新。记忆更新 c_t = f_t ⊙ c_{t-1} + i_t ⊙ g_t 意味着当遗忘门 f_t ≈ 1 时，梯度通过记忆状态向后流动基本不变——一个恒定误差旋转木马。Zaremba et al. 通过从不掩盖水平 c_t 路径来保留这一特性。在记忆状态上应用 dropout 会破坏加法通路，重新引入 LSTM 设计旨在解决的梯度消失问题。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 6: Results ============ */}
        <h2>
          {t(
            "6. Results on PTB, Machine Translation, and Speech",
            "6. 在 PTB、机器翻译和语音识别上的结果"
          )}
        </h2>

        <p>
          {t(
            "The paper evaluates on three tasks. The headline result is Penn Treebank (PTB) language modeling.",
            "本文在三个任务上进行评估。最重要的结果是 Penn Treebank（PTB）语言建模。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">
          {t("Penn Treebank Language Modeling", "Penn Treebank 语言建模")}
        </h3>

        <p>
          {t(
            "PTB is the standard benchmark for language model perplexity at the time. Lower perplexity is better — it measures how surprised the model is by the test set on average (perplexity = exp(average negative log-likelihood per token)). The paper trains a 2-layer LSTM with 1500 hidden units per layer, approximately 65M parameters total.",
            "PTB 是当时语言模型困惑度的标准基准。困惑度越低越好——它衡量模型对测试集平均的惊讶程度（困惑度 = exp(每个 token 的平均负对数似然)）。本文训练了一个每层 1500 个隐藏单元的 2 层 LSTM，总共约 6500 万个参数。"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Model", "模型")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Valid PPL", "验证集困惑度")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Test PPL", "测试集困惑度")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Params", "参数量")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("KN5 (Mikolov 2012)", "KN5 (Mikolov 2012)")}
                </td>
                <td className="border border-paper-200 px-4 py-2">—</td>
                <td className="border border-paper-200 px-4 py-2">141.2</td>
                <td className="border border-paper-200 px-4 py-2">2M</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">
                  {t("RNN-LDA (Mikolov & Zweig 2012)", "RNN-LDA (Mikolov & Zweig 2012)")}
                </td>
                <td className="border border-paper-200 px-4 py-2">—</td>
                <td className="border border-paper-200 px-4 py-2">92.0</td>
                <td className="border border-paper-200 px-4 py-2">7M</td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Deep RNN (Pascanu et al. 2013)", "Deep RNN (Pascanu et al. 2013)")}
                </td>
                <td className="border border-paper-200 px-4 py-2">—</td>
                <td className="border border-paper-200 px-4 py-2">107.5</td>
                <td className="border border-paper-200 px-4 py-2">6M</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">
                  {t(
                    "Previous SOTA (Mikolov & Zweig 2012)",
                    "此前最优 (Mikolov & Zweig 2012)"
                  )}
                </td>
                <td className="border border-paper-200 px-4 py-2">—</td>
                <td className="border border-paper-200 px-4 py-2">78.4</td>
                <td className="border border-paper-200 px-4 py-2">—</td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("LSTM medium (no dropout)", "LSTM 中型（无 dropout）")}
                </td>
                <td className="border border-paper-200 px-4 py-2">86.2</td>
                <td className="border border-paper-200 px-4 py-2">82.7</td>
                <td className="border border-paper-200 px-4 py-2">20M</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">
                  {t("LSTM medium (dropout 0.65)", "LSTM 中型（dropout 0.65）")}
                </td>
                <td className="border border-paper-200 px-4 py-2">81.0</td>
                <td className="border border-paper-200 px-4 py-2">77.4</td>
                <td className="border border-paper-200 px-4 py-2">20M</td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  {t("LSTM large (dropout 0.65)", "LSTM 大型（dropout 0.65）")}
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  73.4
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  68.0
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  65M
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The large LSTM with dropout achieves 68.0 test perplexity, a massive improvement over the previous SOTA of 78.4 — a reduction of over 10 perplexity points. Comparing the medium model with and without dropout (82.7 vs 77.4) confirms that the dropout is directly responsible for the improvement, not just the larger model size.",
            "带 dropout 的大型 LSTM 取得了 68.0 的测试困惑度，相比此前最优结果 78.4 有了大幅改进——降低了超过 10 个困惑度点。对比中型模型有无 dropout 的结果（82.7 对 77.4）证实了 dropout 直接导致了性能提升，而不仅仅是更大的模型规模。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">
          {t(
            "Machine Translation and Speech Recognition",
            "机器翻译与语音识别"
          )}
        </h3>

        <p>
          {t(
            "The paper also validates on English-to-French translation (WMT'14) using an encoder-decoder LSTM. Adding dropout improves BLEU score from 14.5 to 16.5 — a meaningful gain for MT systems at the time. The same principle applies: dropout on the embedding → encoder layer and encoder → decoder layer, but not on the encoder's recurrent connections.",
            "本文还在英法机器翻译（WMT'14）上使用编码器-解码器 LSTM 进行了验证。添加 dropout 将 BLEU 分数从 14.5 提高到 16.5——对当时的机器翻译系统而言是显著提升。相同的原则适用：在词嵌入 → 编码器层和编码器 → 解码器层上应用 dropout，但不在编码器的循环连接上应用。"
          )}
        </p>

        <p>
          {t(
            "For speech recognition, tested on TIMIT, the paper reports reduced phone error rate (PER) from 18.0% without dropout to 17.7% with dropout on an LSTM acoustic model. While more modest than the PTB gains, it shows the technique generalizes across sequential domains.",
            "在语音识别方面，在 TIMIT 上测试时，本文报告了在 LSTM 声学模型上使用 dropout 将音素错误率（PER）从 18.0% 降至 17.7%。虽然不如 PTB 上的提升显著，但表明该技术在序列领域中具有通用性。"
          )}
        </p>

        <Collapsible
          title={t(
            "Hyperparameter sensitivity: dropout rate",
            "超参数敏感性：dropout 比率"
          )}
        >
          <p className="text-sm">
            {t(
              "The paper uses a dropout probability of 0.65 (i.e., keep probability 0.35) for the large model — this is quite aggressive. Applying dropout with p=0.65 means dropping 65% of activations at each vertical connection during each training step. The large model can tolerate this because dropout effectively acts as a strong regularizer, allowing training to proceed for more epochs without overfitting. The medium model uses the same dropout rate but has fewer parameters to regularize. In practice, tuning dropout rate is the main knob: too low and you underregularize; too high and you underfit.",
              "本文对大型模型使用 0.65 的 dropout 概率（即保留概率为 0.35）——这相当激进。使用 p=0.65 的 dropout 意味着在每个训练步骤中丢弃每个垂直连接 65% 的激活值。大型模型能够承受这一点，因为 dropout 实际上作为强正则化器，允许训练进行更多轮次而不过拟合。中型模型使用相同的 dropout 比率但参数更少。实践中，调整 dropout 比率是主要旋钮：太低则正则化不足；太高则欠拟合。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 7: Influence on Later Work ============ */}
        <h2>
          {t(
            "7. Influence: Variational Dropout and Beyond",
            "7. 影响：变分 Dropout 及后续工作"
          )}
        </h2>

        <p>
          {t(
            "Zaremba et al.'s approach dominated practice for roughly two years. The next significant advance came from Gal & Ghahramani (2016), who placed dropout in a Bayesian framework and derived a theoretically principled version called Variational Dropout (also called MC Dropout).",
            "Zaremba et al. 的方法在实践中占主导地位约两年。下一个重要进展来自 Gal & Ghahramani（2016），他们将 dropout 置于贝叶斯框架中，并推导出一个理论上有据可查的版本，称为变分 Dropout（也称为 MC Dropout）。"
          )}
        </p>

        <p>
          {t(
            "The key difference in Variational Dropout: the same dropout mask is reused at every timestep within a single forward pass. In Zaremba et al., a fresh mask is sampled at each timestep for vertical connections. Gal & Ghahramani showed that sharing the mask across timesteps corresponds to approximate variational inference in a Bayesian neural network, and this formulation also allows dropout to be applied safely to recurrent connections (with a fixed-per-sequence mask).",
            "变分 Dropout 的关键区别在于：在单次前向传播中，相同的 dropout 掩码在每个时间步重复使用。在 Zaremba et al. 中，每个时间步为垂直连接采样新的掩码。Gal & Ghahramani 表明，在时间步之间共享掩码对应于贝叶斯神经网络中的近似变分推断，这种表述也允许将 dropout 安全地应用于循环连接（使用每序列固定的掩码）。"
          )}
        </p>

        <Math
          display
          label={t(
            "Variational dropout: same mask repeated across timesteps",
            "变分 dropout：相同掩码在时间步间重复使用"
          )}
          tex="\tilde{h}_t^l = \frac{\mathbf{m}}{1-p} \odot h_t^l, \quad \mathbf{m} \sim \text{Bernoulli}(1-p) \text{ fixed for all } t"
        />

        <p>
          {t(
            "Subsequent work further refined RNN regularization:",
            "后续工作进一步完善了 RNN 正则化："
          )}
        </p>

        <ul>
          <li>
            <strong>
              {t(
                "Zoneout (Krueger et al. 2016): ",
                "Zoneout（Krueger et al. 2016）："
              )}
            </strong>
            {t(
              "Instead of zeroing hidden units, randomly keeps the previous timestep's value — like a stochastic identity shortcut across time.",
              "不是将隐藏单元置零，而是随机保留前一时间步的值——就像跨时间的随机恒等捷径。"
            )}
          </li>
          <li>
            <strong>
              {t(
                "Merity et al. AWD-LSTM (2017): ",
                "Merity et al. AWD-LSTM（2017）："
              )}
            </strong>
            {t(
              "Combines Zaremba-style dropout with DropConnect on recurrent weights, embedding dropout, and AR/TAR regularization to achieve 57.3 test perplexity on PTB.",
              "将 Zaremba 式 dropout 与循环权重上的 DropConnect、词嵌入 dropout 以及 AR/TAR 正则化相结合，在 PTB 上取得了 57.3 的测试困惑度。"
            )}
          </li>
          <li>
            <strong>
              {t(
                "Transformer era (post-2017): ",
                "Transformer 时代（2017 年后）："
              )}
            </strong>
            {t(
              "With the rise of attention-based models, recurrent dropout became less central — Transformers handle long-range dependencies differently and apply dropout on attention weights and feedforward connections instead.",
              "随着基于注意力机制模型的兴起，循环 dropout 变得不那么核心——Transformer 以不同方式处理长程依赖，转而在注意力权重和前馈连接上应用 dropout。"
            )}
          </li>
        </ul>

        <p>
          {t(
            "Despite being superseded by Transformers for many sequence modeling tasks, the conceptual insight of Zaremba et al. — that regularization must respect the structure of information flow, not just blindly apply noise to all connections — remains a fundamental principle of neural network design.",
            "尽管在许多序列建模任务中被 Transformer 所取代，Zaremba et al. 的概念洞见——正则化必须尊重信息流的结构，而不是盲目地向所有连接添加噪声——仍然是神经网络设计的基本原则。"
          )}
        </p>

        <Collapsible
          title={t(
            "Why this matters even in the Transformer era",
            "为什么这在 Transformer 时代仍然重要"
          )}
        >
          <p className="text-sm">
            {t(
              "The lesson from Zaremba et al. generalizes beyond RNNs: when you add stochastic regularization to a neural network, you must think about which paths carry gradient signals and which carry input signals. In Transformers, the residual stream is the analogue of the LSTM cell state — it is the highway through which gradients flow. Applying dropout directly on the residual stream (rather than on the feedforward sublayer outputs before the residual add) would similarly degrade performance. This structural thinking about regularization placement is a lasting contribution of this work.",
              "Zaremba et al. 的教训超越了 RNN 的范畴：当你向神经网络添加随机正则化时，你必须思考哪些路径承载梯度信号，哪些承载输入信号。在 Transformer 中，残差流是 LSTM 记忆状态的类比——它是梯度流动的通路。直接在残差流上应用 dropout（而不是在残差相加之前的前馈子层输出上）同样会降低性能。这种关于正则化位置的结构性思考是这项工作的持久贡献。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 8: Additional Resources ============ */}
        <h2>{t("8. Additional Resources", "8. 补充资源")}</h2>

        <div className="space-y-2 my-4">
          <a
            href="https://arxiv.org/abs/1409.2329"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {t(
                "Zaremba, Sutskever, Vinyals (2014) — Original Paper",
                "Zaremba, Sutskever, Vinyals（2014）——原始论文"
              )}
            </span>
            <span className="text-xs text-paper-800/50 ml-2">arXiv 1409.2329</span>
          </a>

          <a
            href="https://arxiv.org/abs/1512.05287"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {t(
                "Gal & Ghahramani (2016) — A Theoretically Grounded Application of Dropout in RNNs",
                "Gal & Ghahramani（2016）——理论支撑的 RNN Dropout 应用"
              )}
            </span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Variational Dropout / MC Dropout", "变分 Dropout / MC Dropout")}
            </span>
          </a>

          <a
            href="https://arxiv.org/abs/1708.02182"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {t(
                "Merity et al. (2017) — Regularizing and Optimizing LSTM Language Models (AWD-LSTM)",
                "Merity et al.（2017）——正则化和优化 LSTM 语言模型（AWD-LSTM）"
              )}
            </span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Pushed PTB SOTA to 57.3 perplexity", "将 PTB 最优困惑度推进至 57.3")}
            </span>
          </a>

          <a
            href="https://arxiv.org/abs/1512.03385"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {t(
                "Krueger et al. (2016) — Zoneout: Regularizing RNNs by Randomly Preserving Hidden Activations",
                "Krueger et al.（2016）——Zoneout：通过随机保留隐藏激活来正则化 RNN"
              )}
            </span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Stochastic depth alternative for RNNs", "RNN 的随机深度替代方案")}
            </span>
          </a>

          <a
            href="https://arxiv.org/abs/1506.00019"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {t(
                "Greff et al. (2016) — LSTM: A Search Space Odyssey",
                "Greff et al.（2016）——LSTM：搜索空间奥德赛"
              )}
            </span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t(
                "Comprehensive empirical study of LSTM variants and their components",
                "LSTM 变体及其组件的全面实证研究"
              )}
            </span>
          </a>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-paper-200">
          <Link
            href={`${basePath}/`}
            className="text-sm text-blue-600 hover:underline"
          >
            {t("← Back to home", "← 返回首页")}
          </Link>
        </div>
      </article>
    </div>
  );
}
