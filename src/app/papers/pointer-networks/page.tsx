"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function PointerNetworksPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("Pointer Networks", "指针网络")}
        </h1>
        <p className="text-paper-800/50">
          Vinyals, Fortunato, Jaitly &middot; NeurIPS 2015 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1506.03134"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1506.03134
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Standard seq2seq models output tokens from a fixed vocabulary — they cannot refer to positions in the input sequence. Pointer Networks solve this by turning the attention distribution itself into the output: at each decoder step, a softmax over input positions directly selects which input element to \"point to.\" This enables solving combinatorial problems (convex hull, TSP, sorting) where the output is a permutation of the input.",
              "标准 seq2seq 模型从固定词表中输出词元，无法引用输入序列中的位置。指针网络通过将注意力分布本身作为输出来解决这个问题：在每个解码步骤，对输入位置的 softmax 直接选择要「指向」哪个输入元素。这使得解决输出是输入排列的组合问题（凸包、TSP、排序）成为可能。"
            )}
          </p>
        </section>

        {/* ============ FlowChart ============ */}
        <FlowChart
          title={t("Pointer Network Pipeline", "指针网络流程")}
          steps={[
            {
              title: t(
                "Problem: seq2seq output vocab is fixed — can't index input positions",
                "问题：seq2seq 输出词表固定，无法索引输入位置"
              ),
              subtitle: t(
                "Sorting n numbers, TSP tour, convex hull — output size varies with input",
                "排序 n 个数、TSP 路径、凸包 — 输出大小随输入变化"
              ),
              color: "rose",
            },
            {
              title: t(
                "Encoder: LSTM reads input sequence, produces hidden states (e₁, ..., eₙ)",
                "编码器：LSTM 读取输入序列，生成隐状态 (e₁, ..., eₙ)"
              ),
              subtitle: t("One hidden vector per input element", "每个输入元素对应一个隐向量"),
              color: "amber",
            },
            {
              title: t(
                "Decoder: at step i, compute alignment score for each input position j",
                "解码器：在第 i 步，为每个输入位置 j 计算对齐分数"
              ),
              subtitle: t(
                "uⱼⁱ = vᵀ tanh(W₁eⱼ + W₂dᵢ) — combines encoder and decoder hidden states",
                "uⱼⁱ = vᵀ tanh(W₁eⱼ + W₂dᵢ) — 结合编码器和解码器隐状态"
              ),
              color: "blue",
            },
            {
              title: t(
                "Output: p(Cᵢ | C₁,...,Cᵢ₋₁, P) = softmax(uⁱ) — a distribution over input positions",
                "输出：p(Cᵢ | C₁,...,Cᵢ₋₁, P) = softmax(uⁱ) — 对输入位置的分布"
              ),
              subtitle: t(
                "The attention IS the output — no context vector summation",
                "注意力即输出，无上下文向量加权求和"
              ),
              color: "purple",
            },
            {
              title: t(
                "Training: supervised with optimal solutions from exact solvers",
                "训练：使用精确求解器的最优解进行监督"
              ),
              subtitle: t("Convex hull exact; TSP exact for n≤10, heuristics for larger", "凸包精确；TSP n≤10 时精确，更大时用启发式"),
              color: "teal",
            },
            {
              title: t(
                "Results: perfect on convex hull, near-optimal TSP up to n=10, generalizes to unseen sizes",
                "结果：凸包完美，TSP n≤10 接近最优，可泛化到未见尺寸"
              ),
              color: "green",
            },
          ]}
          arrows={[
            t("Motivates", "动机"),
            t("Encode input", "编码输入"),
            t("Score positions", "对位置打分"),
            t("Point to input", "指向输入"),
            t("Supervision", "监督信号"),
          ]}
          highlights={[
            {
              text: t("Attention distribution = output distribution", "注意力分布 = 输出分布"),
              color: "purple",
            },
            {
              text: t("Variable-length output over input positions", "对输入位置的可变长度输出"),
              color: "blue",
            },
            {
              text: t("Foundation for CopyNet and Transformer copy mechanisms", "CopyNet 和 Transformer 复制机制的基础"),
              color: "green",
            },
          ]}
        />

        {/* ============ Section 1 ============ */}
        <h2>{t("1. The Variable-Output Vocabulary Problem", "1. 可变输出词表问题")}</h2>

        <p>
          {t(
            "Standard sequence-to-sequence models define a fixed output vocabulary V. At each decoding step, the model produces a distribution over V and samples the next token. This works well for machine translation (fixed target language vocabulary) but breaks down for a whole class of combinatorial problems.",
            "标准序列到序列模型定义了固定的输出词表 V。在每个解码步骤，模型生成对 V 的分布并采样下一个词元。这对机器翻译（固定目标语言词表）效果很好，但对一整类组合问题失效。"
          )}
        </p>

        <p>
          {t(
            "Consider three tasks the paper studies:",
            "考虑论文研究的三个任务："
          )}
        </p>

        <ul>
          <li>
            <strong>{t("Sorting", "排序")}</strong>
            {t(
              ": Given numbers (3.1, 0.7, 2.4), output the sorted permutation — but \"sorted order\" is not a fixed vocabulary, it depends on the input.",
              "：给定数字 (3.1, 0.7, 2.4)，输出排好序的排列 — 但「排序后的顺序」不是固定词表，它取决于输入。"
            )}
          </li>
          <li>
            <strong>{t("Convex hull", "凸包")}</strong>
            {t(
              ": Given n 2D points, output the subset that forms the convex hull in order — the output is a variable-length subset of input points.",
              "：给定 n 个二维点，按顺序输出构成凸包的子集 — 输出是输入点的可变长度子集。"
            )}
          </li>
          <li>
            <strong>{t("Travelling Salesman Problem (TSP)", "旅行商问题 (TSP)")}</strong>
            {t(
              ": Given n cities, output a tour (permutation) that minimizes total distance — the tour length equals the number of input cities.",
              "：给定 n 个城市，输出最小化总距离的路径（排列）— 路径长度等于输入城市数。"
            )}
          </li>
        </ul>

        <p>
          {t(
            "In all three cases, the output is a permutation or subset of the input elements themselves. If you train a model on instances of size n = 10 with a fixed 10-class output, it cannot generalize to n = 15 — the output vocabulary would need to change. The key insight of Pointer Networks is to reframe the output as: \"which input position do I select next?\"",
            "在所有三种情况下，输出都是输入元素本身的排列或子集。如果你用固定 10 类输出在大小为 n = 10 的实例上训练模型，它无法泛化到 n = 15 — 输出词表需要改变。指针网络的关键洞察是将输出重新定义为：「我下一步选择哪个输入位置？」"
          )}
        </p>

        {/* ============ Section 2 ============ */}
        <h2>{t("2. The Pointer Mechanism", "2. 指针机制")}</h2>

        <p>
          {t(
            "A Pointer Network is an encoder-decoder LSTM where the decoder's output at each step is a probability distribution over input positions — not over a fixed vocabulary. Here is the full mechanism:",
            "指针网络是一个编码器-解码器 LSTM，其中解码器在每一步的输出是对输入位置的概率分布，而不是对固定词表的分布。以下是完整机制："
          )}
        </p>

        <p>
          <strong>{t("Step 1 — Encode the input:", "第 1 步 — 编码输入：")}</strong>
        </p>

        <Math display tex={String.raw`(e_1, e_2, \ldots, e_n) = \text{Encoder}(P)`} />

        <p>
          {t(
            "The encoder LSTM processes the input sequence P = (p₁, …, pₙ) and produces one hidden state eⱼ per input element. Each eⱼ is a dense vector summarizing the context around position j.",
            "编码器 LSTM 处理输入序列 P = (p₁, …, pₙ)，为每个输入元素生成一个隐状态 eⱼ。每个 eⱼ 是一个密集向量，总结了位置 j 附近的上下文。"
          )}
        </p>

        <p>
          <strong>{t("Step 2 — Compute alignment scores:", "第 2 步 — 计算对齐分数：")}</strong>
        </p>

        <Math display tex={String.raw`u_j^i = v^\top \tanh\!\left(W_1 e_j + W_2 d_i\right), \quad j \in \{1, \ldots, n\}`} />

        <p>
          {t(
            "At decoder step i, the decoder hidden state dᵢ is combined with each encoder hidden state eⱼ. The matrices W₁, W₂ and vector v are learned parameters. The result uⱼⁱ is a scalar alignment score: how relevant is input position j when generating the i-th output?",
            "在解码器第 i 步，解码器隐状态 dᵢ 与每个编码器隐状态 eⱼ 组合。矩阵 W₁、W₂ 和向量 v 是可学习参数。结果 uⱼⁱ 是一个标量对齐分数：在生成第 i 个输出时，输入位置 j 有多相关？"
          )}
        </p>

        <p>
          <strong>{t("Step 3 — Output distribution over input positions:", "第 3 步 — 对输入位置的输出分布：")}</strong>
        </p>

        <Math display tex={String.raw`p(C_i \mid C_1, \ldots, C_{i-1}, P) = \text{softmax}(u^i)`} />

        <p>
          {t(
            "The softmax is applied across all n input positions. This gives a proper probability distribution over {1, …, n}, and the model selects (or samples) whichever input index has the highest probability. The selected element becomes Cᵢ in the output sequence.",
            "softmax 在所有 n 个输入位置上应用。这给出了对 {1, …, n} 的正规概率分布，模型选择（或采样）概率最高的输入索引。被选中的元素成为输出序列中的 Cᵢ。"
          )}
        </p>

        <Collapsible title={t("Derivation: why tanh + linear projection?", "推导：为什么用 tanh + 线性投影？")}>
          <p>
            {t(
              "The alignment function uⱼⁱ = vᵀ tanh(W₁eⱼ + W₂dᵢ) is a two-layer network that scores compatibility between encoder state eⱼ and decoder state dᵢ. Unpacking it:",
              "对齐函数 uⱼⁱ = vᵀ tanh(W₁eⱼ + W₂dᵢ) 是一个双层网络，对编码器状态 eⱼ 和解码器状态 dᵢ 之间的兼容性打分。展开来看："
            )}
          </p>
          <ul>
            <li>
              {t(
                "W₁eⱼ projects the encoder state into a shared space — the same W₁ is used for all j.",
                "W₁eⱼ 将编码器状态投影到共享空间 — 同样的 W₁ 用于所有 j。"
              )}
            </li>
            <li>
              {t(
                "W₂dᵢ projects the current decoder state into the same space.",
                "W₂dᵢ 将当前解码器状态投影到同一空间。"
              )}
            </li>
            <li>
              {t(
                "tanh is a nonlinearity that lets the model learn non-linear compatibility.",
                "tanh 是一个非线性函数，让模型学习非线性兼容性。"
              )}
            </li>
            <li>
              {t(
                "vᵀ (·) collapses the vector to a scalar score — v is a learned weight vector.",
                "vᵀ (·) 将向量折叠为标量分数 — v 是可学习权重向量。"
              )}
            </li>
          </ul>
          <p>
            {t(
              "This is the same functional form as Bahdanau attention (2015), but the key difference is in how it is used: Bahdanau uses softmax(u) to form a weighted sum context vector; Pointer Networks use softmax(u) directly as the output.",
              "这与 Bahdanau 注意力（2015）的函数形式相同，但关键区别在于如何使用它：Bahdanau 使用 softmax(u) 形成加权求和上下文向量；指针网络将 softmax(u) 直接用作输出。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 3 ============ */}
        <h2>{t("3. Attention vs. Pointer Networks", "3. 注意力 vs. 指针网络")}</h2>

        <p>
          {t(
            "Pointer Networks look almost identical to sequence-to-sequence with Bahdanau attention. The critical difference is what happens after the softmax. This is the key conceptual distinction:",
            "指针网络看起来与带有 Bahdanau 注意力的序列到序列几乎相同。关键区别在于 softmax 之后发生了什么。这是关键的概念区别："
          )}
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  {t("", "")}
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  {t("Standard Attention", "标准注意力")}
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  {t("Pointer Network", "指针网络")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                  {t("Alignment scores", "对齐分数")}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-xs">
                  {t("uⱼⁱ = vᵀ tanh(W₁eⱼ + W₂dᵢ)", "uⱼⁱ = vᵀ tanh(W₁eⱼ + W₂dᵢ)")}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-xs">
                  {t("uⱼⁱ = vᵀ tanh(W₁eⱼ + W₂dᵢ)", "uⱼⁱ = vᵀ tanh(W₁eⱼ + W₂dᵢ)")}
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/30">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                  {t("After softmax", "softmax 之后")}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {t("Weighted sum: cᵢ = Σⱼ αⱼⁱ · eⱼ", "加权求和：cᵢ = Σⱼ αⱼⁱ · eⱼ")}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold text-purple-700 dark:text-purple-400">
                  {t("This IS the output: p(Cᵢ) = softmax(uⁱ)", "这就是输出：p(Cᵢ) = softmax(uⁱ)")}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                  {t("Context vector cᵢ used for?", "上下文向量 cᵢ 用于？")}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {t("Predicts next token from fixed vocab", "从固定词表预测下一个词元")}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {t("No context vector — pointer is the output", "无上下文向量，指针即输出")}
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/30">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                  {t("Output vocabulary", "输出词表")}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {t("Fixed size |V| (e.g. 50,000 words)", "固定大小 |V|（如 50,000 个词）")}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {t("Dynamic: n (size of current input)", "动态：n（当前输入的大小）")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "In formal terms, standard attention computes:",
            "用形式化语言，标准注意力计算："
          )}
        </p>

        <Math display tex={String.raw`c_i = \sum_j \underbrace{\text{softmax}(u_j^i)}_{\alpha_j^i} \cdot e_j \quad \text{(context vector — used to predict vocab token)}`} />

        <p>
          {t(
            "Pointer Networks skip the weighted sum entirely and use the softmax weights as the final answer:",
            "指针网络完全跳过加权求和，直接将 softmax 权重作为最终答案："
          )}
        </p>

        <Math display tex={String.raw`p(C_i \mid C_1, \ldots, C_{i-1}, P) = \text{softmax}(u^i) \quad \text{(this is the output)}`} />

        <p>
          {t(
            "This subtle shift — using attention weights as output rather than as intermediate aggregation weights — is what makes the output vocabulary dynamic. The model is literally \"pointing\" to one of the n input positions at each step.",
            "这个微妙的转变 — 将注意力权重用作输出而不是中间聚合权重 — 使输出词表变得动态。模型在每一步字面上「指向」n 个输入位置之一。"
          )}
        </p>

        {/* ============ Section 4 ============ */}
        <h2>{t("4. Training on Combinatorial Tasks", "4. 在组合任务上训练")}</h2>

        <p>
          {t(
            "Pointer Networks are trained with supervised learning. For each input instance, the training target is an optimal or near-optimal output sequence — a ground-truth ordering of input positions.",
            "指针网络使用监督学习训练。对于每个输入实例，训练目标是最优或接近最优的输出序列 — 输入位置的真实排序。"
          )}
        </p>

        <p>
          {t(
            "The loss is standard cross-entropy over the pointer distribution at each step:",
            "损失是每一步指针分布上的标准交叉熵："
          )}
        </p>

        <Math display tex={String.raw`\mathcal{L} = -\sum_{i=1}^{m} \log p(C_i^* \mid C_1^*, \ldots, C_{i-1}^*, P)`} />

        <p>
          {t(
            "where C* is the ground-truth sequence of input indices. Getting these ground-truth labels requires running an exact solver:",
            "其中 C* 是输入索引的真实序列。获取这些真实标签需要运行精确求解器："
          )}
        </p>

        <ul>
          <li>
            <strong>{t("Sorting:", "排序：")}</strong>
            {t(
              " The ground-truth tour is just the sorted order — trivially computed.",
              " 真实路径就是排好序的顺序，可简单计算。"
            )}
          </li>
          <li>
            <strong>{t("Convex hull:", "凸包：")}</strong>
            {t(
              " Standard computational geometry algorithms (gift wrapping, Graham scan) produce the exact convex hull in O(n log n).",
              " 标准计算几何算法（礼品包装、Graham 扫描）在 O(n log n) 时间内产生精确凸包。"
            )}
          </li>
          <li>
            <strong>{t("TSP:", "TSP：")}</strong>
            {t(
              " For small n (≤10), exact TSP solvers (e.g. dynamic programming, Concorde) are feasible. For n > 10, the paper uses the Christofides heuristic to generate near-optimal tours.",
              " 对于小 n（≤10），精确 TSP 求解器（如动态规划、Concorde）是可行的。对于 n > 10，论文使用 Christofides 启发式生成接近最优的路径。"
            )}
          </li>
        </ul>

        <Collapsible title={t("Why not use reinforcement learning?", "为什么不使用强化学习？")}>
          <p>
            {t(
              "The original Pointer Networks paper (2015) uses supervised learning only — it requires pre-computed optimal solutions as training labels. This is a limitation: for large TSP instances, computing the optimal tour is NP-hard.",
              "原始指针网络论文（2015）仅使用监督学习 — 需要预计算的最优解作为训练标签。这是一个限制：对于大型 TSP 实例，计算最优路径是 NP 难的。"
            )}
          </p>
          <p>
            {t(
              "The follow-up work \"Attention, Learn to Solve Routing Problems\" (Kool et al., 2019) and \"Neural Combinatorial Optimization with Reinforcement Learning\" (Bello et al., 2016) address this by training Pointer Networks with REINFORCE — using tour length as the reward signal, requiring no optimal labels. This extension makes the approach applicable to larger problem sizes.",
              "后续工作「Attention, Learn to Solve Routing Problems」（Kool 等，2019）和「Neural Combinatorial Optimization with Reinforcement Learning」（Bello 等，2016）通过使用 REINFORCE 训练指针网络来解决这个问题 — 以路径长度作为奖励信号，无需最优标签。这一扩展使该方法适用于更大的问题规模。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 5 ============ */}
        <h2>{t("5. Worked Example: Convex Hull Ordering", "5. 工作示例：凸包排序")}</h2>

        <p>
          {t(
            "Let's trace through a small convex hull example to make the pointer mechanism concrete. Suppose we have 5 points in 2D:",
            "让我们通过一个小的凸包示例来具体说明指针机制。假设我们有 5 个二维点："
          )}
        </p>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 font-mono text-sm">
          <p className="mb-1">P = &#123;</p>
          <p className="ml-4 mb-1">p₁ = (0.1, 0.2),  <span className="text-gray-500 dark:text-gray-400">← interior point</span></p>
          <p className="ml-4 mb-1">p₂ = (0.9, 0.1),  <span className="text-gray-500 dark:text-gray-400">← hull vertex</span></p>
          <p className="ml-4 mb-1">p₃ = (0.5, 0.5),  <span className="text-gray-500 dark:text-gray-400">← interior point</span></p>
          <p className="ml-4 mb-1">p₄ = (0.1, 0.9),  <span className="text-gray-500 dark:text-gray-400">← hull vertex</span></p>
          <p className="ml-4 mb-1">p₅ = (0.8, 0.8),  <span className="text-gray-500 dark:text-gray-400">← hull vertex</span></p>
          <p>&#125;</p>
        </div>

        <p>
          {t(
            "The convex hull visits points p₂, p₅, p₄ in counterclockwise order (p₁ and p₃ are interior). The encoder processes all 5 points and produces hidden states e₁, …, e₅.",
            "凸包按逆时针顺序访问点 p₂、p₅、p₄（p₁ 和 p₃ 在内部）。编码器处理所有 5 个点并生成隐状态 e₁, …, e₅。"
          )}
        </p>

        <p>
          {t(
            "Now the decoder runs step by step, each time computing a softmax over all 5 input positions:",
            "现在解码器逐步运行，每次在所有 5 个输入位置上计算 softmax："
          )}
        </p>

        <div className="space-y-3 mb-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">
              {t("Decoder step i=1 (initial decoder state d₁)", "解码器步骤 i=1（初始解码器状态 d₁）")}
            </p>
            <p className="text-sm font-mono mb-1">u¹ = [u₁¹, u₂¹, u₃¹, u₄¹, u₅¹]</p>
            <p className="text-sm font-mono mb-2">softmax(u¹) ≈ [0.03, <strong>0.72</strong>, 0.05, 0.08, 0.12]</p>
            <p className="text-sm text-green-700 dark:text-green-400">
              {t("→ Points to p₂ (bottom-right hull vertex, starting point)", "→ 指向 p₂（右下角凸包顶点，起始点）")}
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">
              {t("Decoder step i=2 (d₂ updated with selected p₂)", "解码器步骤 i=2（d₂ 由选中的 p₂ 更新）")}
            </p>
            <p className="text-sm font-mono mb-1">u² = [u₁², u₂², u₃², u₄², u₅²]</p>
            <p className="text-sm font-mono mb-2">softmax(u²) ≈ [0.04, 0.06, 0.03, 0.08, <strong>0.79</strong>]</p>
            <p className="text-sm text-green-700 dark:text-green-400">
              {t("→ Points to p₅ (top-right hull vertex)", "→ 指向 p₅（右上角凸包顶点）")}
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">
              {t("Decoder step i=3 (d₃ updated with selected p₅)", "解码器步骤 i=3（d₃ 由选中的 p₅ 更新）")}
            </p>
            <p className="text-sm font-mono mb-1">u³ = [u₁³, u₂³, u₃³, u₄³, u₅³]</p>
            <p className="text-sm font-mono mb-2">softmax(u³) ≈ [0.05, 0.07, 0.04, <strong>0.81</strong>, 0.03]</p>
            <p className="text-sm text-green-700 dark:text-green-400">
              {t("→ Points to p₄ (top-left hull vertex) → output sequence complete", "→ 指向 p₄（左上角凸包顶点）→ 输出序列完成")}
            </p>
          </div>
        </div>

        <p>
          {t(
            "The model never explicitly computed \"is this point on the hull?\" — it learned from examples to assign high pointer probability to hull vertices in traversal order. Interior points p₁ and p₃ consistently receive low softmax weight because their encoder representations, combined with the decoder state, produce low alignment scores.",
            "模型从未明确计算「这个点在凸包上吗？」— 它从示例中学习，按遍历顺序为凸包顶点分配高指针概率。内部点 p₁ 和 p₃ 始终接收低 softmax 权重，因为它们的编码器表示与解码器状态组合后产生低对齐分数。"
          )}
        </p>

        {/* ============ Section 6 ============ */}
        <h2>{t("6. Results", "6. 结果")}</h2>

        <p>
          {t(
            "The paper evaluates Pointer Networks on three tasks. All results use greedy decoding (argmax at each step) unless otherwise noted.",
            "论文在三个任务上评估指针网络。除非另有说明，所有结果使用贪婪解码（每步取 argmax）。"
          )}
        </p>

        <div className="space-y-4 mb-6">
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-semibold">{t("Convex Hull", "凸包")}</p>
            <p className="text-sm">
              {t(
                "Pointer Networks achieve near-perfect accuracy on convex hull prediction across all tested sizes (n = 5 to 50). The task is somewhat easier because it has a well-defined geometric structure that the model can learn. The paper reports >99% area coverage vs. ground truth.",
                "指针网络在所有测试大小（n = 5 到 50）的凸包预测上实现了接近完美的精度。该任务相对容易，因为它具有模型可以学习的明确几何结构。论文报告相对于真实值 >99% 的面积覆盖率。"
              )}
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold">{t("Travelling Salesman Problem", "旅行商问题")}</p>
            <p className="text-sm">
              {t(
                "For n ≤ 10 cities, Pointer Networks find near-optimal tours — within ~1% of the optimal tour length found by exact TSP solvers. For larger n (trained on n = 5–20, tested on n = 50), solution quality degrades: the model finds ~5–10% longer tours than optimal. The model also shows surprising generalization: trained on n = 5–20, it can handle n = 50 without retraining, though with reduced quality.",
                "对于 n ≤ 10 个城市，指针网络找到接近最优的路径 — 在精确 TSP 求解器找到的最优路径长度的约 1% 以内。对于更大的 n（在 n = 5-20 上训练，在 n = 50 上测试），解质量下降：模型找到比最优路径长约 5-10% 的路径。模型还显示出令人惊讶的泛化能力：在 n = 5-20 上训练，它可以在没有重新训练的情况下处理 n = 50，尽管质量有所降低。"
              )}
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-semibold">{t("Sorting", "排序")}</p>
            <p className="text-sm">
              {t(
                "Pointer Networks achieve 100% sequence accuracy on sorting tasks up to n = 20, and generalize to larger n with high accuracy. This is an easier task (unique correct answer, no combinatorial search), serving mainly to validate the mechanism.",
                "指针网络在排序任务（最多 n = 20）上实现了 100% 的序列精度，并以高精度泛化到更大的 n。这是一个更容易的任务（唯一正确答案，无组合搜索），主要用于验证机制。"
              )}
            </p>
          </div>
        </div>

        <Collapsible title={t("Comparison to sequence-to-sequence with attention baseline", "与带注意力的序列到序列基线的比较")}>
          <p>
            {t(
              "The paper compares Pointer Networks to a standard seq2seq model with Bahdanau attention (the closest prior work). The seq2seq model has a fixed output vocabulary of size n_max — but this means it cannot generalize beyond the training size.",
              "论文将指针网络与带有 Bahdanau 注意力的标准 seq2seq 模型（最接近的先前工作）进行比较。seq2seq 模型具有大小为 n_max 的固定输出词表 — 但这意味着它无法泛化到训练大小之外。"
            )}
          </p>
          <p>
            {t(
              "For TSP with n=10: Pointer Networks achieve ~2.68 average tour length vs. ~4.12 for seq2seq+attention (optimal is ~2.56). The gap widens with larger n, where seq2seq breaks down entirely due to its fixed vocabulary constraint.",
              "对于 n=10 的 TSP：指针网络实现平均路径长度约 2.68，而 seq2seq+注意力约为 4.12（最优为约 2.56）。随着 n 增大，差距扩大，其中 seq2seq 由于其固定词表约束而完全失效。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 7 ============ */}
        <h2>{t("7. Legacy: Copy Mechanisms in Modern LLMs", "7. 遗产：现代 LLM 中的复制机制")}</h2>

        <p>
          {t(
            "Pointer Networks introduced a key idea: models should be able to refer to input positions directly, not just generate from a fixed vocabulary. This concept has propagated through the field in several important ways:",
            "指针网络引入了一个关键思想：模型应该能够直接引用输入位置，而不仅仅是从固定词表生成。这个概念通过几种重要方式在该领域传播："
          )}
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">
              {t("CopyNet (Gu et al., 2016)", "CopyNet（Gu 等，2016）")}
            </p>
            <p className="text-sm">
              {t(
                "Extends Pointer Networks to a hybrid model: at each decoding step, the model can either generate a word from the vocabulary OR copy a word from the input sequence. This is critical for tasks like abstractive summarization (copy named entities, rare words) and dialogue (repeat user's phrases). The output probability mixes a generation distribution and a copy distribution.",
                "将指针网络扩展为混合模型：在每个解码步骤，模型可以从词表生成单词，或从输入序列复制单词。这对于抽象摘要（复制命名实体、罕见词）和对话（重复用户短语）等任务至关重要。输出概率混合了生成分布和复制分布。"
              )}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">
              {t("Pointer-Generator Networks (See et al., 2017)", "指针生成器网络（See 等，2017）")}
            </p>
            <p className="text-sm">
              {t(
                "Applied to abstractive summarization with a learned \"copy gate\" pᶜₒₚᵧ ∈ [0,1] that interpolates between generating and pointing. This enabled models to handle out-of-vocabulary words by copying them from the source document — a critical capability for summarizing documents with proper nouns and technical terms.",
                "应用于抽象摘要，带有学习的「复制门」pₒₚᵧ ∈ [0,1]，在生成和指向之间插值。这使模型能够通过从源文档复制来处理词表外的单词 — 这是总结包含专有名词和技术术语文档的关键能力。"
              )}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">
              {t("Transformer Copy Mechanisms", "Transformer 复制机制")}
            </p>
            <p className="text-sm">
              {t(
                "Modern LLMs like GPT-2/3 implicitly learn to copy from context via their attention mechanisms — the self-attention heads in later layers often show high attention to specific previous tokens, effectively \"pointing\" to them. Retrieval-augmented generation (RAG) makes this more explicit: the model attends over retrieved documents and incorporates their content. Extractive QA models point to answer spans in the passage.",
                "现代 LLM 如 GPT-2/3 通过其注意力机制隐式学习从上下文复制 — 后层中的自注意力头通常对特定的先前词元显示出高注意力，有效地「指向」它们。检索增强生成（RAG）使这更加明确：模型关注检索到的文档并整合其内容。抽取式问答模型指向段落中的答案跨度。"
              )}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">
              {t("Neural Combinatorial Optimization", "神经组合优化")}
            </p>
            <p className="text-sm">
              {t(
                "The Pointer Network architecture is now a standard building block for learned combinatorial solvers. Key follow-ups: Bello et al. (2016) trained with RL instead of supervised labels; Kool et al. (2019) built an attention-based model (without RNNs) for vehicle routing problems, achieving competitive results with classical solvers on 100-city TSP.",
                "指针网络架构现在是学习型组合求解器的标准构建块。关键后续工作：Bello 等（2016）用 RL 而不是监督标签训练；Kool 等（2019）构建了基于注意力的模型（无 RNN）用于车辆路径问题，在 100 个城市的 TSP 上取得了与经典求解器竞争的结果。"
              )}
            </p>
          </div>
        </div>

        <p>
          {t(
            "The core limitation remains: Pointer Networks (and their descendants) only work when the output comes from the input. You cannot use a pointer to generate a word that does not appear in the source. This is why hybrid generation+copy approaches like CopyNet are so popular in practice — they get the best of both worlds.",
            "核心限制仍然存在：指针网络（及其后继者）只在输出来自输入时才有效。你不能使用指针生成源中不存在的单词。这就是为什么像 CopyNet 这样的混合生成+复制方法在实践中如此受欢迎 — 它们兼顾两者的优点。"
          )}
        </p>

        {/* ============ Back link ============ */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`${basePath}/papers`}
            className="text-blue-600 hover:underline text-sm"
          >
            {t("← Back to Papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
