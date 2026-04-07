"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function OrderMattersPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Order Matters: Sequence to Sequence for Sets",
            "顺序重要：集合的序列到序列模型"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-gray-400">
          Vinyals, Bengio, Kudlur &middot; ICLR 2016 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1511.06391"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1511.06391
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Seq2seq models are sensitive to the order of both input and output elements — even when the underlying data is a set with no natural order. This paper studies how different orderings affect perplexity on tasks like sorting, proposes attention-based (Pointer Network) architectures to handle unordered inputs, and introduces a Read-Process-Write memory architecture for truly order-invariant set encoding. The key lesson: model structure should match problem structure.",
              "Seq2seq 模型对输入和输出元素的顺序非常敏感——即使底层数据是没有自然顺序的集合。本文研究了不同排列顺序对排序等任务困惑度的影响，提出了基于注意力（指针网络）的架构来处理无序输入，并引入了读-处理-写内存架构，实现真正的顺序不变集合编码。核心教训：模型结构应与问题结构相匹配。"
            )}
          </p>
        </section>

        {/* Section 1 */}
        <h2 className="text-xl font-bold mt-10 mb-4 dark:text-gray-100">
          {t(
            "1. Order Sensitivity in Seq2Seq",
            "1. Seq2Seq 中的顺序敏感性"
          )}
        </h2>

        <p className="dark:text-gray-300">
          {t(
            "Standard seq2seq models — encoder RNN + decoder RNN — factorize the joint distribution over an output sequence as a product of conditionals:",
            "标准的 seq2seq 模型——编码器 RNN + 解码器 RNN——将输出序列的联合分布分解为条件概率的乘积："
          )}
        </p>

        <Math display tex={String.raw`p(y \mid x) = \prod_{t=1}^{T} p(y_t \mid y_1, \ldots, y_{t-1},\, x)`} />

        <p className="dark:text-gray-300">
          {t(
            "Each conditional depends on all previous outputs and the entire input encoding. This is well-suited for language, where there is a natural left-to-right order. But what happens when the input or output is a set — a collection of elements with no inherent ordering?",
            "每个条件概率依赖于所有先前的输出以及整个输入编码。这对于有自然从左到右顺序的语言很适合。但当输入或输出是集合——没有固有顺序的元素集合——时会发生什么？"
          )}
        </p>

        <p className="dark:text-gray-300">
          {t(
            "The paper demonstrates that the choice of ordering is not neutral: two equivalent representations of the same set (e.g., [3, 1, 4, 2] vs. [1, 2, 3, 4]) can yield dramatically different training perplexities, converge at different speeds, and generalize differently. The model architecture encodes strong inductive biases about sequence structure, which conflict with the set's symmetry.",
            "本文证明，排列顺序的选择并非中立：同一集合的两种等价表示（如 [3, 1, 4, 2] 与 [1, 2, 3, 4]）可能产生截然不同的训练困惑度，以不同速度收敛，并有不同的泛化能力。模型架构对序列结构编码了强烈的归纳偏置，而这与集合的对称性相冲突。"
          )}
        </p>

        <Collapsible
          title={t(
            "Why does order matter for RNNs?",
            "为什么顺序对 RNN 很重要？"
          )}
        >
          <p className="dark:text-gray-300">
            {t(
              "An RNN encoder reads tokens one by one, updating a hidden state h_t = f(h_{t-1}, x_t). The final hidden state is used as the encoding of the entire input. Early tokens have more \"influence\" on this encoding because their effects persist through the full sequence of updates. Late tokens are only partially integrated. This asymmetry means the same set presented in a different order produces a structurally different encoding — and different downstream generation behavior.",
              "RNN 编码器逐个读取 token，更新隐藏状态 h_t = f(h_{t-1}, x_t)。最终隐藏状态用作整个输入的编码。早期 token 对该编码的「影响」更大，因为它们的效果会在完整的更新序列中持续存在。后期 token 只被部分整合。这种不对称性意味着以不同顺序呈现的同一集合会产生结构不同的编码——以及不同的下游生成行为。"
            )}
          </p>
        </Collapsible>

        {/* Section 2 */}
        <h2 className="text-xl font-bold mt-10 mb-4 dark:text-gray-100">
          {t(
            "2. Input Order Matters: The Sorting Experiment",
            "2. 输入顺序重要：排序实验"
          )}
        </h2>

        <p className="dark:text-gray-300">
          {t(
            "The authors design a controlled experiment: given a set of numbers, train a seq2seq model to output them in sorted order. The input is the same set, but presented in different orderings to the encoder. The decoder always produces numbers in ascending order.",
            "作者设计了一个受控实验：给定一组数字，训练 seq2seq 模型按排序顺序输出它们。输入是同一集合，但以不同顺序呈现给编码器。解码器始终按升序输出数字。"
          )}
        </p>

        <p className="dark:text-gray-300">
          {t(
            "They test several input orderings and measure perplexity on held-out sets:",
            "他们测试了几种输入排列顺序并测量了保留集上的困惑度："
          )}
        </p>

        <ul className="list-disc pl-6 space-y-2 mb-6 dark:text-gray-300">
          <li>
            <strong>{t("Random order:", "随机顺序：")}</strong>{" "}
            {t(
              "Elements shuffled arbitrarily — high perplexity, slow convergence.",
              "元素任意打乱——困惑度高，收敛慢。"
            )}
          </li>
          <li>
            <strong>{t("Sorted ascending:", "升序排列：")}</strong>{" "}
            {t(
              "Input already sorted — model essentially learns identity; low perplexity.",
              "输入已排序——模型本质上学习恒等映射；困惑度低。"
            )}
          </li>
          <li>
            <strong>{t("Sorted descending:", "降序排列：")}</strong>{" "}
            {t(
              "Input sorted in reverse — also low perplexity; a consistent pattern still helps.",
              "输入逆序排列——困惑度也低；一致的模式仍然有帮助。"
            )}
          </li>
          <li>
            <strong>{t("By frequency (optimal for discrete):", "按频率排列（离散最优）：")}</strong>{" "}
            {t(
              "Rare or high-value items first — often the best heuristic for discrete vocabularies.",
              "稀少或高值项放在前面——通常是离散词汇表的最佳启发式方法。"
            )}
          </li>
        </ul>

        <p className="dark:text-gray-300">
          {t(
            "The key finding: when the input order is correlated with the output order (or is a consistent function thereof), the model learns faster and achieves lower perplexity. The encoder can build a useful hidden state, and the decoder can decode greedily without backtracking over ambiguous encodings.",
            "关键发现：当输入顺序与输出顺序相关（或是其一致函数）时，模型学习更快，困惑度更低。编码器可以构建有用的隐藏状态，解码器可以贪婪解码，而无需回溯模糊的编码。"
          )}
        </p>

        <Collapsible
          title={t(
            "What does perplexity measure here?",
            "这里的困惑度衡量什么？"
          )}
        >
          <p className="dark:text-gray-300">
            {t(
              "Perplexity is exp(cross-entropy loss) — it measures how surprised the model is by the correct output sequence. Lower perplexity means the model assigns higher probability to the correct answer. In the sorting task, all output sequences are identical (sorted), so differences in perplexity directly reflect how well the encoder represents the input for the decoder to use. A poorly ordered input produces a confusing encoding, raising the decoder's uncertainty.",
              "困惑度是 exp(交叉熵损失)——它衡量模型对正确输出序列的惊讶程度。更低的困惑度意味着模型对正确答案赋予更高的概率。在排序任务中，所有输出序列都是相同的（已排序），因此困惑度的差异直接反映了编码器为解码器提供的表示质量。排列顺序差的输入产生令人困惑的编码，提高了解码器的不确定性。"
            )}
          </p>
        </Collapsible>

        {/* Section 3 */}
        <h2 className="text-xl font-bold mt-10 mb-4 dark:text-gray-100">
          {t(
            "3. Output Order Matters",
            "3. 输出顺序重要"
          )}
        </h2>

        <p className="dark:text-gray-300">
          {t(
            "The same sensitivity applies to the output side. When the decoder generates a set (e.g., all detected objects in an image, all answers to a math problem), there are multiple valid orderings. But training the model with inconsistent orderings creates an impossible optimization target: the model must simultaneously learn to produce element A before B, and B before A, depending on the training example.",
            "同样的敏感性适用于输出端。当解码器生成一个集合（如图像中所有检测到的对象、数学问题的所有答案）时，存在多种有效顺序。但使用不一致的顺序训练模型会创建一个不可能的优化目标：模型必须同时学会在不同训练样本中先产生 A 再产生 B，以及先产生 B 再产生 A。"
          )}
        </p>

        <p className="dark:text-gray-300">
          {t(
            "The paper advocates for choosing a canonical output ordering — a deterministic function of the outputs themselves, not the inputs. For numerical outputs, sorting by value is natural. For object detection, sorting by confidence score or spatial position are reasonable choices. The key constraint is consistency: given any set of outputs, the ordering rule must always produce the same sequence.",
            "本文主张选择一个规范的输出顺序——输出本身的确定性函数，而非输入的函数。对于数值输出，按值排序是自然的。对于目标检测，按置信度分数或空间位置排序是合理的选择。关键约束是一致性：给定任何一组输出，排序规则必须始终产生相同的序列。"
          )}
        </p>

        <Collapsible
          title={t(
            "What about search over orderings?",
            "对顺序进行搜索怎么样？"
          )}
        >
          <p className="dark:text-gray-300">
            {t(
              "One advanced strategy the paper discusses is to search over possible output orderings during training — finding the permutation that minimizes loss for each training example and using that. This is equivalent to solving an assignment problem at each step. The authors show this can reduce perplexity further but is computationally expensive. In practice, a fixed canonical ordering (e.g., sort by score) is the most practical and principled choice.",
              "本文讨论的一种高级策略是在训练期间搜索可能的输出顺序——找到每个训练样本损失最小的排列并使用它。这等价于在每一步解决一个分配问题。作者表明这可以进一步降低困惑度，但计算成本高昂。实际上，固定的规范顺序（如按分数排序）是最实用且有原则的选择。"
            )}
          </p>
        </Collapsible>

        {/* Section 4 */}
        <h2 className="text-xl font-bold mt-10 mb-4 dark:text-gray-100">
          {t(
            "4. Read-Process-Write Architecture",
            "4. 读-处理-写架构"
          )}
        </h2>

        <p className="dark:text-gray-300">
          {t(
            "For truly unordered sets, the paper proposes the Read-Process-Write (RPW) architecture — a memory-augmented model with three components that interact with a set of memory cells:",
            "对于真正无序的集合，本文提出了读-处理-写（RPW）架构——一种带有三个组件的内存增强模型，这些组件与一组内存单元交互："
          )}
        </p>

        <div className="grid grid-cols-1 gap-4 my-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("Write Phase — Encode the Set", "写入阶段——编码集合")}
            </h4>
            <p className="text-sm dark:text-gray-300 mb-3">
              {t(
                "Each input element x_i is written into a memory cell m_i via a learned encoding function:",
                "每个输入元素 x_i 通过学习到的编码函数写入内存单元 m_i："
              )}
            </p>
            <Math display tex={String.raw`m_i \leftarrow m_i + f_{\text{write}}(x_i)`} />
            <p className="text-sm dark:text-gray-300 mt-3">
              {t(
                "Since elements are written independently and in any order, the memory is permutation-equivariant: the same set always produces the same memory state (up to permutation of cells).",
                "由于元素独立写入且顺序任意，内存是置换等变的：同一集合始终产生相同的内存状态（在单元排列方面等价）。"
              )}
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("Process Phase — Attend and Aggregate", "处理阶段——注意力与聚合")}
            </h4>
            <p className="text-sm dark:text-gray-300 mb-3">
              {t(
                "An LSTM runs for P steps with no inputs — it reads from memory via attention at each step. At process step t, the query q_t is derived from the LSTM hidden state, and the read vector is a weighted sum over memory cells:",
                "LSTM 运行 P 步，没有外部输入——它在每一步通过注意力从内存读取。在处理步骤 t，查询向量 q_t 来自 LSTM 隐藏状态，读取向量是内存单元的加权和："
              )}
            </p>
            <Math display tex={String.raw`a_{ti} = \text{softmax}\!\left(\text{score}(q_{t-1},\, m_i)\right)`} />
            <Math display tex={String.raw`q_t = \sum_{i} a_{ti}\, m_i`} />
            <p className="text-sm dark:text-gray-300 mt-3">
              {t(
                "The LSTM updates its hidden state using q_t. After P steps, the LSTM hidden state is a rich, order-invariant summary of the entire input set — the order of writing did not affect the final summary.",
                "LSTM 使用 q_t 更新其隐藏状态。经过 P 步后，LSTM 隐藏状态是整个输入集合的丰富、顺序不变的摘要——写入顺序不影响最终摘要。"
              )}
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {t("Read Phase — Pointer Network Decoding", "读取阶段——指针网络解码")}
            </h4>
            <p className="text-sm dark:text-gray-300 mb-3">
              {t(
                "At decode step t, instead of sampling from a fixed vocabulary, the model uses a pointer — it points directly to one of the input memory cells. The pointer distribution is:",
                "在解码步骤 t，模型使用指针而不是从固定词汇表中采样——它直接指向一个输入内存单元。指针分布为："
              )}
            </p>
            <Math display tex={String.raw`p(y_t \mid y_{<t}, x) = \text{softmax}\!\left(\text{score}(s_t,\, m_i)\right)`} />
            <p className="text-sm dark:text-gray-300 mt-3">
              {t(
                "where s_t is the decoder LSTM state and m_i are memory cells. This means the output vocabulary is the input set itself — enabling the model to generalize to sets of arbitrary size without retraining.",
                "其中 s_t 是解码器 LSTM 状态，m_i 是内存单元。这意味着输出词汇表就是输入集合本身——使模型能够推广到任意大小的集合而无需重新训练。"
              )}
            </p>
          </div>
        </div>

        <Collapsible
          title={t(
            "How does RPW achieve order invariance?",
            "RPW 如何实现顺序不变性？"
          )}
        >
          <p className="dark:text-gray-300">
            {t(
              "The write phase applies f_write element-wise — no interaction between elements during encoding. The process phase then runs attention over all cells simultaneously, so the LSTM can attend to any element at any step regardless of the input order. This is the key difference from a plain RNN encoder, where position in the sequence directly determines influence on the final state. In RPW, all elements are equally accessible from the process LSTM, and the attention mechanism learns which elements matter for the current decoding context.",
              "写入阶段逐元素应用 f_write——编码过程中元素间没有交互。处理阶段则同时对所有单元运行注意力，因此 LSTM 可以在任意步骤关注任意元素，不受输入顺序影响。这是与普通 RNN 编码器的关键区别——在普通 RNN 中，元素在序列中的位置直接决定了对最终状态的影响。在 RPW 中，所有元素对处理 LSTM 都同等可访问，注意力机制学习哪些元素与当前解码上下文相关。"
            )}
          </p>
        </Collapsible>

        {/* Section 5 */}
        <h2 className="text-xl font-bold mt-10 mb-4 dark:text-gray-100">
          {t(
            "5. Handling Truly Unordered Sets",
            "5. 处理真正无序的集合"
          )}
        </h2>

        <p className="dark:text-gray-300">
          {t(
            "For tasks where there is genuinely no meaningful ordering — such as counting, detecting all objects, or computing aggregate statistics — any fixed ordering introduces spurious inductive bias. The paper distinguishes three strategies for dealing with unordered inputs:",
            "对于真正没有有意义顺序的任务——如计数、检测所有对象或计算聚合统计——任何固定顺序都会引入虚假的归纳偏置。本文区分了三种处理无序输入的策略："
          )}
        </p>

        <ol className="list-decimal pl-6 space-y-4 mb-6 dark:text-gray-300">
          <li>
            <strong>{t("Heuristic ordering:", "启发式排序：")}</strong>{" "}
            {t(
              "Sort inputs by value, magnitude, frequency, or spatial location before feeding to a standard RNN encoder. Works surprisingly well in practice when there is a natural ordering correlated with the task structure.",
              "在输入标准 RNN 编码器之前按值、大小、频率或空间位置排序。当存在与任务结构相关的自然排序时，实际效果出奇地好。"
            )}
          </li>
          <li>
            <strong>{t("Attention encoder (Pointer Networks):", "注意力编码器（指针网络）：")}</strong>{" "}
            {t(
              "Run a bidirectional RNN over the input, then use attention at each decode step. The attention mechanism aggregates over all input positions, partially mitigating order sensitivity — the decoder can attend to any element regardless of position.",
              "在输入上运行双向 RNN，然后在每个解码步骤使用注意力。注意力机制聚合所有输入位置，部分缓解了顺序敏感性——解码器可以关注任意元素，不受位置限制。"
            )}
          </li>
          <li>
            <strong>{t("Read-Process-Write:", "读-处理-写：")}</strong>{" "}
            {t(
              "Full order invariance via independent write + iterative attention-based processing. The only truly permutation-invariant approach among those studied. Best performance on tasks where set structure is fundamental.",
              "通过独立写入+基于注意力的迭代处理实现完全顺序不变性。这是所研究方法中唯一真正置换不变的方法。在集合结构至关重要的任务上表现最佳。"
            )}
          </li>
        </ol>

        <p className="dark:text-gray-300">
          {t(
            "The attention-based encoder with seq2seq attention (middle approach) is related to the Pointer Networks paper (Vinyals et al. 2015). The standard attention formula used at decode step t is:",
            "带有 seq2seq 注意力的注意力编码器（中间方法）与指针网络论文（Vinyals 等人，2015）相关。解码步骤 t 使用的标准注意力公式为："
          )}
        </p>

        <Math display tex={String.raw`c_t = \sum_{i} \alpha_{ti}\, h_i, \quad \alpha_{ti} = \text{softmax}\!\left(\text{score}(s_t,\, h_i)\right)`} />

        <p className="dark:text-gray-300">
          {t(
            "where h_i are encoder hidden states, s_t is the decoder state, and c_t is the context vector used to condition the output distribution. The context vector integrates information from all encoder positions — a weaker form of order invariance compared to RPW.",
            "其中 h_i 是编码器隐藏状态，s_t 是解码器状态，c_t 是用于条件化输出分布的上下文向量。上下文向量整合了所有编码器位置的信息——与 RPW 相比，这是一种较弱的顺序不变形式。"
          )}
        </p>

        {/* Section 6 */}
        <h2 className="text-xl font-bold mt-10 mb-4 dark:text-gray-100">
          {t(
            "6. Worked Example: Sorting 5 Numbers",
            "6. 示例详解：排序 5 个数字"
          )}
        </h2>

        <p className="dark:text-gray-300">
          {t(
            "Let's trace through how Read-Process-Write handles the task of sorting the set {3, 1, 4, 2, 5}. The output should be the sequence 1, 2, 3, 4, 5.",
            "让我们追踪读-处理-写如何处理对集合 {3, 1, 4, 2, 5} 进行排序的任务。输出应该是序列 1, 2, 3, 4, 5。"
          )}
        </p>

        <div className="space-y-4 my-6">
          <div className="border-l-4 border-blue-400 pl-4 dark:border-blue-600">
            <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
              {t("Step 1: Write", "步骤 1：写入")}
            </p>
            <p className="text-sm dark:text-gray-300">
              {t(
                "Five memory cells are initialized. Each number is embedded and written independently: m_1 ← f(3), m_2 ← f(1), m_3 ← f(4), m_4 ← f(2), m_5 ← f(5). The order of writing is irrelevant — swapping m_1 and m_2 produces the same memory state (up to cell permutation).",
                "初始化五个内存单元。每个数字独立嵌入并写入：m_1 ← f(3)，m_2 ← f(1)，m_3 ← f(4)，m_4 ← f(2)，m_5 ← f(5)。写入顺序无关——交换 m_1 和 m_2 产生相同的内存状态（在单元排列方面等价）。"
              )}
            </p>
          </div>

          <div className="border-l-4 border-purple-400 pl-4 dark:border-purple-600">
            <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
              {t("Step 2: Process (P = 3 steps)", "步骤 2：处理（P = 3 步）")}
            </p>
            <p className="text-sm dark:text-gray-300">
              {t(
                "The process LSTM attends over all 5 cells at each step. It learns to build a holistic understanding of the distribution — e.g., attending to the minimum and maximum to understand the range, attending to the median to understand the midpoint. After 3 attention steps, the LSTM hidden state encodes the statistical structure of the full set.",
                "处理 LSTM 在每个步骤对所有 5 个单元进行注意力。它学习构建对分布的整体理解——例如，关注最小值和最大值来理解范围，关注中位数来理解中点。经过 3 个注意力步骤后，LSTM 隐藏状态编码了完整集合的统计结构。"
              )}
            </p>
          </div>

          <div className="border-l-4 border-green-400 pl-4 dark:border-green-600">
            <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
              {t("Step 3: Read (decode with pointers)", "步骤 3：读取（使用指针解码）")}
            </p>
            <p className="text-sm dark:text-gray-300">
              {t(
                "At decode step 1: the decoder attends over memory cells and points to m_2 (value 1) — the minimum. At step 2: points to m_4 (value 2). At step 3: points to m_1 (value 3). At step 4: points to m_3 (value 4). At step 5: points to m_5 (value 5). The model outputs elements by pointing to memory, so it can never generate values outside the input set.",
                "解码步骤 1：解码器对内存单元进行注意力并指向 m_2（值 1）——最小值。步骤 2：指向 m_4（值 2）。步骤 3：指向 m_1（值 3）。步骤 4：指向 m_3（值 4）。步骤 5：指向 m_5（值 5）。模型通过指向内存输出元素，因此永远不会生成输入集合之外的值。"
              )}
            </p>
          </div>
        </div>

        <Collapsible
          title={t(
            "What about the adding-numbers task?",
            "数字求和任务怎么样？"
          )}
        >
          <p className="dark:text-gray-300">
            {t(
              "The paper also evaluates on computing the sum of a set of numbers — a naturally commutative operation where order should not matter. A plain seq2seq model struggles because the RNN hidden state treats position as meaningful. The RPW architecture achieves much lower error because the process phase builds a truly order-invariant encoding, and the task (output a single number) does not require pointing — it uses a separate read head to produce a scalar output from the final process state.",
              "本文还评估了计算一组数字之和的任务——这是一个自然可交换的操作，顺序本不应该重要。普通 seq2seq 模型表现较差，因为 RNN 隐藏状态将位置视为有意义的。RPW 架构误差低得多，因为处理阶段构建了真正顺序不变的编码，而任务（输出单个数字）不需要指向——它使用单独的读头从最终处理状态产生标量输出。"
            )}
          </p>
        </Collapsible>

        {/* Section 7 */}
        <h2 className="text-xl font-bold mt-10 mb-4 dark:text-gray-100">
          {t(
            "7. Legacy: Influence on Set Transformer and Modern Architectures",
            "7. 影响：对 Set Transformer 和现代架构的影响"
          )}
        </h2>

        <p className="dark:text-gray-300">
          {t(
            "\"Order Matters\" arrived just before the attention revolution. Its ideas seeded a rich line of work on set-structured learning:",
            "《顺序重要》在注意力革命之前出现。其思想催生了一系列关于集合结构学习的丰富研究："
          )}
        </p>

        <ul className="list-disc pl-6 space-y-3 mb-6 dark:text-gray-300">
          <li>
            <strong>Set Transformer (Lee et al., 2019):</strong>{" "}
            {t(
              "Replaces the RPW LSTM with self-attention layers (inducing points / attention bottleneck). Achieves O(n) rather than O(n²) complexity through learned summary tokens. Directly generalizes the process phase of RPW using Transformer building blocks.",
              "用自注意力层（引导点/注意力瓶颈）替换 RPW LSTM。通过学习到的摘要 token 实现 O(n) 而非 O(n²) 复杂度。使用 Transformer 构建块直接推广了 RPW 的处理阶段。"
            )}
          </li>
          <li>
            <strong>Deep Sets (Zaheer et al., 2017):</strong>{" "}
            {t(
              "Formalizes the theory of permutation-invariant functions: any such function can be decomposed as ρ(Σ_i φ(x_i)) for learned φ and ρ. The write phase of RPW (element-wise encoding + sum) is exactly this decomposition.",
              "形式化置换不变函数的理论：任何此类函数都可以分解为 ρ(Σ_i φ(x_i))，其中 φ 和 ρ 是学习到的函数。RPW 的写入阶段（逐元素编码 + 求和）正是这种分解。"
            )}
          </li>
          <li>
            <strong>{t("Object detection ordering:", "目标检测排序：")}</strong>{" "}
            {t(
              "Modern detection models like DETR (2020) use a Transformer decoder that attends to all encoder features simultaneously. The output is a set of object predictions, and DETR uses Hungarian matching (a permutation-optimal assignment) between predictions and ground truth — a direct application of the insight that set outputs need set-appropriate losses.",
              "DETR（2020）等现代检测模型使用 Transformer 解码器，同时关注所有编码器特征。输出是一组对象预测，DETR 使用匈牙利匹配（置换最优分配）在预测和真值之间——直接应用了集合输出需要集合适当损失的洞察。"
            )}
          </li>
          <li>
            <strong>{t("Combinatorial optimization:", "组合优化：")}</strong>{" "}
            {t(
              "Pointer Networks (the base decoder architecture here) became the foundation for learned combinatorial solvers: TSP, VRP, scheduling. The RPW extension showed that the encoder side also needs to be set-aware for truly unordered inputs.",
              "指针网络（这里的基础解码器架构）成为学习组合优化器的基础：TSP、VRP、调度问题。RPW 扩展表明，对于真正无序的输入，编码器端也需要具备集合感知能力。"
            )}
          </li>
          <li>
            <strong>{t("The core lesson persists:", "核心教训持续存在：")}</strong>{" "}
            {t(
              "Transformers with full self-attention are (approximately) position-invariant when no positional encodings are used, but typically have positional encodings added. The question of when to use positional information and when to be set-invariant remains active in architecture design for molecules, point clouds, graphs, and multimodal inputs.",
              "不使用位置编码时，具有完整自注意力的 Transformer 是（近似）位置不变的，但通常会添加位置编码。何时使用位置信息、何时保持集合不变性的问题在分子、点云、图和多模态输入的架构设计中仍然活跃。"
            )}
          </li>
        </ul>

        <Collapsible
          title={t(
            "Summary: When should you care about order?",
            "总结：什么时候应该关心顺序？"
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-gray-100">
                    {t("Scenario", "场景")}
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-gray-100">
                    {t("Input", "输入")}
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-gray-100">
                    {t("Output", "输出")}
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-gray-100">
                    {t("Recommendation", "建议")}
                  </th>
                </tr>
              </thead>
              <tbody className="dark:text-gray-300">
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Language", "语言")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Sequence", "序列")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Sequence", "序列")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Standard seq2seq with positional encoding", "带位置编码的标准 seq2seq")}
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Sorting", "排序")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Set", "集合")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Sequence", "序列")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Sort input; use pointer network", "排序输入；使用指针网络")}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Object detection", "目标检测")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Image (set of patches)", "图像（块集合）")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Set of boxes", "边界框集合")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Canonical output order + set loss (Hungarian)", "规范输出顺序 + 集合损失（匈牙利算法）")}
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Aggregate (sum, mean)", "聚合（求和、平均）")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Set", "集合")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("Scalar", "标量")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {t("RPW or Deep Sets", "RPW 或 Deep Sets")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Collapsible>

        {/* Resources */}
        <h2 className="text-xl font-bold mt-10 mb-4 dark:text-gray-100">
          {t("Further Reading", "延伸阅读")}
        </h2>

        <ul className="list-disc pl-6 space-y-2 dark:text-gray-300">
          <li>
            <a
              href="https://arxiv.org/abs/1506.03134"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Pointer Networks (Vinyals et al., 2015)
            </a>{" "}
            {t(
              "— the predecessor: seq2seq for combinatorial problems.",
              "——前驱工作：用于组合优化问题的 seq2seq。"
            )}
          </li>
          <li>
            <a
              href="https://arxiv.org/abs/1703.06114"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Deep Sets (Zaheer et al., 2017)
            </a>{" "}
            {t(
              "— formal theory of permutation-invariant functions.",
              "——置换不变函数的形式理论。"
            )}
          </li>
          <li>
            <a
              href="https://arxiv.org/abs/1810.00825"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Set Transformer (Lee et al., 2019)
            </a>{" "}
            {t(
              "— replaces RPW LSTM with multi-head attention and inducing points.",
              "——用多头注意力和引导点替换 RPW LSTM。"
            )}
          </li>
          <li>
            <a
              href="https://arxiv.org/abs/2005.12872"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              DETR (Carion et al., 2020)
            </a>{" "}
            {t(
              "— end-to-end detection with Transformers; uses Hungarian set matching.",
              "——使用 Transformer 的端到端检测；使用匈牙利集合匹配。"
            )}
          </li>
        </ul>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`${basePath}/papers`}
            className="text-blue-600 hover:underline text-sm dark:text-blue-400"
          >
            {t("← Back to Papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
