"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function RelationalRNNPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Relational Recurrent Neural Networks",
            "关系循环神经网络"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-paper-200/50">
          Santoro, Faulkner, Raposo, Rae, Chrzanowski, Weber, Wierstra, Vinyals, Pascanu, Lillicrap (DeepMind) &middot; NeurIPS 2018 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1806.01822"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1806.01822
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Standard LSTMs compress everything into a single hidden vector, making it impossible to reason about relationships between distinct stored facts. Relational Memory Core (RMC) maintains multiple memory slots and lets them communicate via multi-head self-attention at every step — explicitly modeling which memories interact. On tasks that require tracking multiple independent variables (program evaluation, spatial navigation, language modeling), RMC consistently outperforms LSTM and DNC.",
              "标准 LSTM 将所有信息压缩到一个隐藏向量中，无法推理不同存储事实之间的关系。关系记忆核心（RMC）在每一步维护多个记忆槽，并通过多头自注意力让它们相互交流——明确地建模哪些记忆之间存在交互。在需要追踪多个独立变量的任务（程序求值、空间导航、语言建模）上，RMC 始终优于 LSTM 和 DNC。"
            )}
          </p>
        </section>

        {/* ============ Section 1 ============ */}
        <h2>
          {t(
            "1. Beyond Single-Vector Memory",
            "1. 超越单向量记忆"
          )}
        </h2>

        <p>
          {t(
            "A standard LSTM at time step t maintains a hidden state h_t and cell state c_t — both single vectors. Every piece of information the model needs to remember is entangled inside these vectors. There is no mechanism to separately track, say, \"variable A holds value 3\" and \"variable B holds value 7\" and then reason about their relationship without conflating them.",
            "标准 LSTM 在时间步 t 维护隐藏状态 h_t 和细胞状态 c_t——两者都是单个向量。模型需要记住的每一条信息都纠缠在这些向量中。没有任何机制能单独追踪「变量 A 的值为 3」和「变量 B 的值为 7」，并在不混淆它们的情况下推理其关系。"
          )}
        </p>

        <p>
          {t(
            "This is a fundamental limitation for relational reasoning — tasks where the answer depends on comparing or combining multiple distinct facts held in memory simultaneously. The LSTM must implicitly learn to encode and disentangle this structure from scratch, with no architectural support.",
            "这是关系推理的根本局限——在这类任务中，答案取决于同时比较或组合记忆中多个不同的事实。LSTM 必须隐式地从头学习编码和解耦这种结构，没有任何架构层面的支持。"
          )}
        </p>

        <Collapsible
          title={t(
            "Analogy: a notebook vs. a single sticky note",
            "类比：笔记本 vs. 单张便利贴"
          )}
        >
          <p>
            {t(
              "An LSTM is like a single sticky note: you can write on it, but everything gets overwritten or smeared together. RMC is like a structured notebook with labeled pages: each memory slot is a page, and you can flip between pages, compare them, and update only the relevant one. Attention over memory slots plays the role of reading across pages before deciding what to write.",
              "LSTM 就像一张便利贴：你可以在上面写字，但所有内容会被覆盖或混在一起。RMC 就像一本有标签页的结构化笔记本：每个记忆槽是一页，你可以翻阅各页、比较它们，只更新相关的那页。对记忆槽的注意力起到了在决定写什么之前跨页阅读的作用。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 2 ============ */}
        <h2>
          {t(
            "2. Relational Memory Core Architecture",
            "2. 关系记忆核心架构"
          )}
        </h2>

        <p>
          {t(
            "RMC replaces the single hidden vector with a memory matrix M. At each time step, M holds h independent memory slots, each a d-dimensional vector:",
            "RMC 用记忆矩阵 M 替换单个隐藏向量。在每个时间步，M 保存 h 个独立的记忆槽，每个槽是一个 d 维向量："
          )}
        </p>

        <Math display tex={"M \\in \\mathbb{R}^{h \\times d}"} />

        <p>
          {t(
            "Here h is the number of memory slots (a hyperparameter, typically 4–8) and d is the slot dimension. The total memory capacity is h × d, but crucially the structure is explicit: slot i and slot j are distinct, and the model can attend to them independently.",
            "其中 h 是记忆槽数量（超参数，通常为 4–8），d 是槽维度。总记忆容量为 h × d，但关键在于结构是显式的：槽 i 和槽 j 是独立的，模型可以分别对它们进行注意力操作。"
          )}
        </p>

        <p>
          {t(
            "The input x_t at each time step is first concatenated with the memory matrix to form an augmented memory, ensuring the current input can interact with all existing memories during the attention step:",
            "每个时间步的输入 x_t 首先与记忆矩阵拼接，形成增强记忆，确保当前输入在注意力步骤中能与所有现有记忆交互："
          )}
        </p>

        <Math display tex={"M_0^t = \\text{concat}(M^{t-1},\\, x_t)"} />

        <p>
          {t(
            "This augmented matrix is then processed by multi-head self-attention, and the result is passed through an LSTM to produce the updated memory M^t.",
            "然后通过多头自注意力处理这个增强矩阵，结果通过 LSTM 生成更新后的记忆 M^t。"
          )}
        </p>

        <Collapsible
          title={t(
            "Why concat input with memory, not just add it?",
            "为什么将输入与记忆拼接，而不是直接相加？"
          )}
        >
          <p>
            {t(
              "Concatenating x_t as an extra row means the attention mechanism can compute a full softmax over all (memories + current input) jointly. This lets any memory slot attend to the new input and vice versa — a symmetric interaction. Simply adding x_t to memory or using it only as a gate signal would break this symmetry and prevent the input from being queried by memory slots.",
              "将 x_t 作为额外一行拼接，意味着注意力机制可以联合计算所有（记忆+当前输入）的完整 softmax。这让任意记忆槽都能关注新输入，反之亦然——一种对称交互。仅将 x_t 加到记忆或只用作门控信号会破坏这种对称性，阻止记忆槽查询输入。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 3 ============ */}
        <h2>
          {t(
            "3. Multi-Head Self-Attention Over Memories",
            "3. 记忆上的多头自注意力"
          )}
        </h2>

        <p>
          {t(
            "The core relational computation is standard scaled dot-product attention applied to the rows of M_0^t. Each memory slot acts as both a query and a key-value pair — every slot can attend to every other slot:",
            "核心关系计算是对 M_0^t 的行应用标准缩放点积注意力。每个记忆槽既作为查询，也作为键值对——每个槽都可以关注其他所有槽："
          )}
        </p>

        <Math display tex={"Q = M_0^t W_Q, \\quad K = M_0^t W_K, \\quad V = M_0^t W_V"} />

        <Math display tex={"\\tilde{A} = \\text{softmax}\\!\\left(\\frac{Q K^\\top}{\\sqrt{d_k}}\\right) V"} />

        <p>
          {t(
            "where W_Q, W_K, W_V are learned projection matrices and d_k is the key dimension (used for scaling to prevent vanishing gradients in the softmax). This is the same attention formula as in the Transformer — the key difference is that it is applied to memory slots over time, not to token positions across a sequence.",
            "其中 W_Q、W_K、W_V 是可学习的投影矩阵，d_k 是键维度（用于缩放以防止 softmax 中的梯度消失）。这与 Transformer 中的注意力公式完全相同——关键区别在于它应用于随时间变化的记忆槽，而不是序列中的词元位置。"
          )}
        </p>

        <p>
          {t(
            "Multi-head attention runs this in parallel for several heads with independent projection matrices, then concatenates the results. This allows different heads to capture different types of relational interactions simultaneously — one head might track spatial relationships while another tracks value comparisons.",
            "多头注意力使用独立投影矩阵并行运行多个注意力头，然后拼接结果。这允许不同的头同时捕获不同类型的关系交互——一个头可能追踪空间关系，另一个追踪值比较。"
          )}
        </p>

        <Collapsible
          title={t(
            "Attention weight interpretation",
            "注意力权重的解释"
          )}
        >
          <p>
            {t(
              "The attention matrix A ∈ R^{h × h} after softmax gives a distribution over all memory slots for each query slot. Entry A[i, j] says: \"how much should memory slot i update based on the content of memory slot j?\" High attention weight means the model has learned that fact j is relevant to updating fact i at this time step. This is relational reasoning made explicit in the architecture.",
              "softmax 后的注意力矩阵 A ∈ R^{h × h} 给出了每个查询槽对所有记忆槽的分布。条目 A[i, j] 表示：「记忆槽 i 应该基于记忆槽 j 的内容更新多少？」高注意力权重意味着模型已经学习到事实 j 与此时间步更新事实 i 相关。这就是架构中明确体现的关系推理。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 4 ============ */}
        <h2>
          {t(
            "4. Memory Read and Write",
            "4. 记忆读写"
          )}
        </h2>

        <p>
          {t(
            "After multi-head attention produces A-tilde, each memory slot is updated using an LSTM. The LSTM acts as the write mechanism — it decides how much of the attended information to incorporate into each slot, using its gating structure to control forgetting and integration:",
            "多头注意力产生 A-tilde 后，每个记忆槽使用 LSTM 更新。LSTM 充当写入机制——它决定将多少注意力信息融入每个槽，利用其门控结构控制遗忘和整合："
          )}
        </p>

        <Math display tex={"M^t = \\text{LSTM}(M^{t-1},\\, \\tilde{A})"} />

        <p>
          {t(
            "Concretely, the LSTM is applied row-wise: each memory slot m_i^{t-1} is updated using the corresponding attended representation a-tilde_i as input. The LSTM's forget gate learns when to discard old slot content, the input gate learns when to write new information, and the output gate controls what is exposed for reading at this step.",
            "具体来说，LSTM 按行应用：每个记忆槽 m_i^{t-1} 使用对应的注意力表示 a-tilde_i 作为输入进行更新。LSTM 的遗忘门学习何时丢弃旧槽内容，输入门学习何时写入新信息，输出门控制此步骤中暴露供读取的内容。"
          )}
        </p>

        <p>
          {t(
            "Reading from memory happens implicitly: the output of the entire RMC at time step t is typically the concatenation of all h memory slots, or a weighted combination. Downstream modules (policy networks, language model heads, etc.) receive this full memory state and can selectively use different slots.",
            "从记忆中读取是隐式发生的：RMC 在时间步 t 的输出通常是所有 h 个记忆槽的拼接，或加权组合。下游模块（策略网络、语言模型头等）接收这个完整的记忆状态，可以选择性地使用不同的槽。"
          )}
        </p>

        <Collapsible
          title={t(
            "Full forward pass summary",
            "完整前向传播摘要"
          )}
        >
          <p>
            {t(
              "Step-by-step at each time step t:",
              "每个时间步 t 的逐步过程："
            )}
          </p>
          <ol className="list-decimal ml-6 space-y-1 text-sm">
            <li>
              {t(
                "Prepend input x_t to memory: M_0^t = concat(M^{t-1}, x_t)",
                "将输入 x_t 前置到记忆：M_0^t = concat(M^{t-1}, x_t)"
              )}
            </li>
            <li>
              {t(
                "Compute Q, K, V projections from M_0^t",
                "从 M_0^t 计算 Q、K、V 投影"
              )}
            </li>
            <li>
              {t(
                "Run multi-head self-attention to get A-tilde",
                "运行多头自注意力得到 A-tilde"
              )}
            </li>
            <li>
              {t(
                "Apply LSTM row-wise: M^t = LSTM(M^{t-1}, A-tilde)",
                "按行应用 LSTM：M^t = LSTM(M^{t-1}, A-tilde)"
              )}
            </li>
            <li>
              {t(
                "Output: flatten or pool M^t for downstream use",
                "输出：展平或池化 M^t 供下游使用"
              )}
            </li>
          </ol>
        </Collapsible>

        {/* ============ Section 5 ============ */}
        <h2>
          {t(
            "5. Program Evaluation Task: Tracking Multiple Variables",
            "5. 程序求值任务：追踪多个变量"
          )}
        </h2>

        <p>
          {t(
            "The program evaluation task is a synthetic benchmark designed to stress-test relational memory. A model is shown a sequence of variable assignments and operations (e.g., \"A = 3; B = 7; C = A + B; output C\") and must output the correct value. This requires:",
            "程序求值任务是一个专门设计用于压力测试关系记忆的合成基准。模型看到一系列变量赋值和操作（例如「A = 3; B = 7; C = A + B; 输出 C」），必须输出正确值。这需要："
          )}
        </p>

        <ul className="list-disc ml-6 space-y-1 mb-4">
          <li>
            {t(
              "Storing each variable's value in a distinct location (a slot, not a blended vector)",
              "在不同位置（槽，而非混合向量）存储每个变量的值"
            )}
          </li>
          <li>
            {t(
              "Retrieving and combining specific variables when an operation refers to them",
              "当操作引用特定变量时检索并组合它们"
            )}
          </li>
          <li>
            {t(
              "Updating only the target variable without corrupting others",
              "仅更新目标变量而不破坏其他变量"
            )}
          </li>
        </ul>

        <p>
          {t(
            "RMC can naturally assign one memory slot per variable. When the model reads \"C = A + B\", the attention mechanism can retrieve slots for A and B, compute their sum, and write the result into slot C — all within the attention + LSTM update. An LSTM has no such structure and must learn this implicitly, leading to degraded performance as the number of variables grows.",
            "RMC 可以自然地为每个变量分配一个记忆槽。当模型读取「C = A + B」时，注意力机制可以检索 A 和 B 的槽，计算它们的和，并将结果写入槽 C——所有这些都在注意力 + LSTM 更新中完成。LSTM 没有这种结构，必须隐式学习，导致随着变量数量增加性能下降。"
          )}
        </p>

        <p>
          {t(
            "In the paper's experiments, RMC achieves near-perfect accuracy on program evaluation with up to 8 variables, while LSTM accuracy degrades sharply beyond 4. The gap widens further when programs are longer or require nested operations.",
            "在论文的实验中，RMC 在多达 8 个变量的程序求值上达到近乎完美的精度，而 LSTM 精度在超过 4 个变量后急剧下降。当程序更长或需要嵌套操作时，差距进一步扩大。"
          )}
        </p>

        <Collapsible
          title={t(
            "Mini-Pacman: spatial relational memory",
            "迷你吃豆人：空间关系记忆"
          )}
        >
          <p>
            {t(
              "In the mini-Pacman task, an agent navigates a grid, collects objects, and must answer questions about what it has seen. This requires holding multiple spatial facts simultaneously (\"fruit was at location X, wall was at Y\"). RMC's multiple slots naturally partition spatial memory, while an LSTM must superpose all spatial information into a single vector. RMC achieves higher reward and better generalization across map sizes.",
              "在迷你吃豆人任务中，智能体在网格中导航、收集物品，并必须回答关于它所见内容的问题。这需要同时保存多个空间事实（「水果在位置 X，墙壁在 Y」）。RMC 的多个槽自然地划分空间记忆，而 LSTM 必须将所有空间信息叠加到单个向量中。RMC 在不同地图大小上实现了更高的奖励和更好的泛化。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 6 ============ */}
        <h2>
          {t(
            "6. Language Modeling Results",
            "6. 语言建模结果"
          )}
        </h2>

        <p>
          {t(
            "RMC is evaluated on two standard language modeling benchmarks measured in bits per word (BPW) — lower is better.",
            "RMC 在两个标准语言建模基准上进行评估，以每词比特数（BPW）衡量——越低越好。"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Model", "模型")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("Penn Treebank (BPW)", "Penn Treebank（BPW）")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("Wikitext-103 (BPW)", "Wikitext-103（BPW）")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">LSTM</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">1.30</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">1.38</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">DNC</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">1.27</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">1.35</td>
              </tr>
              <tr className="font-semibold">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-blue-700 dark:text-blue-400">
                  RMC
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-blue-700 dark:text-blue-400">
                  1.22
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-blue-700 dark:text-blue-400">
                  1.29
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "RMC achieves the best BPW on both datasets. Language modeling benefits from relational memory because coherent text involves tracking entities across long spans: pronouns reference earlier nouns, verb agreement depends on the subject introduced many tokens ago, and discourse coherence requires remembering what has been said. Each entity can occupy a distinct memory slot, and attention can retrieve the right slot when generating context-dependent words.",
            "RMC 在两个数据集上都取得了最佳 BPW。语言建模受益于关系记忆，因为连贯文本涉及跨长距离追踪实体：代词引用早期名词，动词一致性取决于许多词元之前引入的主语，话语连贯性需要记住已说的内容。每个实体可以占据一个独立的记忆槽，注意力可以在生成依赖上下文的词时检索正确的槽。"
          )}
        </p>

        <Collapsible
          title={t(
            "Why BPW instead of perplexity?",
            "为什么用 BPW 而不是困惑度？"
          )}
        >
          <p>
            {t(
              "Bits per word (BPW) is the average number of bits needed to encode each word given the model's predictions. It equals log2(perplexity) and is preferred for cross-corpus comparisons because it is invariant to vocabulary size differences — perplexity scores are not comparable across corpora with different token counts. Lower BPW means the model assigns higher probability to the actual next word.",
              "每词比特数（BPW）是给定模型预测时编码每个词所需的平均比特数。它等于 log2（困惑度），在跨语料库比较中更受青睐，因为它对词汇量差异不敏感——不同词元数量的语料库间困惑度分数不可比。BPW 越低意味着模型对实际下一个词赋予更高的概率。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 7 ============ */}
        <h2>
          {t(
            "7. Comparison with LSTM and DNC",
            "7. 与 LSTM 和 DNC 的比较"
          )}
        </h2>

        <p>
          {t(
            "The three models represent a spectrum of memory architectures:",
            "这三种模型代表了记忆架构的谱系："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Property", "属性")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">LSTM</th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">DNC</th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-blue-700 dark:text-blue-400">RMC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Memory structure", "记忆结构")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("1 vector", "1 个向量")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("External matrix + controller", "外部矩阵 + 控制器")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-blue-700 dark:text-blue-400">
                  {t("M ∈ R^{h×d} slots", "M ∈ R^{h×d} 槽")}
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Read mechanism", "读取机制")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("Implicit via gating", "隐式门控")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("Content / location addressing", "内容/位置寻址")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-blue-700 dark:text-blue-400">
                  {t("Multi-head self-attention", "多头自注意力")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Memory-to-memory interaction", "记忆间交互")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("None", "无")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("None (reads are independent)", "无（读取独立）")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-blue-700 dark:text-blue-400">
                  {t("Full pairwise attention", "完整成对注意力")}
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Write mechanism", "写入机制")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("LSTM gates", "LSTM 门控")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("Erase + add vectors", "擦除 + 添加向量")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-blue-700 dark:text-blue-400">
                  {t("LSTM gates per slot", "每槽 LSTM 门控")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Relational task accuracy", "关系任务精度")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("Low", "低")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("Medium", "中")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-blue-700 dark:text-blue-400">
                  {t("High", "高")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "DNC (Differentiable Neural Computer, Graves et al. 2016) also uses an external memory matrix, but memory locations are read and written independently using content-based and location-based addressing. There is no mechanism for memories to interact with each other — slot i cannot directly query slot j. RMC closes this gap by running full self-attention across all slots before the write step.",
            "DNC（可微分神经计算机，Graves 等人 2016 年）也使用外部记忆矩阵，但使用基于内容和位置的寻址独立读写记忆位置。记忆之间没有相互交互的机制——槽 i 不能直接查询槽 j。RMC 通过在写入步骤之前对所有槽运行完整自注意力来弥合这一差距。"
          )}
        </p>

        <Collapsible
          title={t(
            "When does DNC beat RMC?",
            "DNC 何时优于 RMC？"
          )}
        >
          <p>
            {t(
              "DNC's explicit addressing (with usage tracking and temporal linking) gives it stronger performance on tasks that require large external memory — e.g., one-shot graph traversal or copying long sequences. RMC's attention-based interaction is more parameter-efficient for relational tasks but doesn't scale as cleanly to very large memory banks, since self-attention cost scales quadratically with the number of slots.",
              "DNC 的显式寻址（带使用跟踪和时序链接）在需要大型外部记忆的任务上表现更强——例如单次图遍历或复制长序列。RMC 基于注意力的交互在关系任务上参数效率更高，但不能像 DNC 那样优雅地扩展到非常大的记忆库，因为自注意力成本随槽数呈二次方增长。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 8 ============ */}
        <h2>
          {t(
            "8. Connection to Transformers",
            "8. 与 Transformer 的联系"
          )}
        </h2>

        <p>
          {t(
            "RMC and the Transformer share the same multi-head self-attention formula. The key architectural difference is the axis of attention:",
            "RMC 和 Transformer 共享相同的多头自注意力公式。关键架构差异在于注意力的轴："
          )}
        </p>

        <ul className="list-disc ml-6 space-y-2 mb-4">
          <li>
            <strong>{t("Transformer:", "Transformer：")}</strong>{" "}
            {t(
              "Attention runs across token positions in the sequence. At each layer, every token position attends to all other positions. The sequence length is fixed within a forward pass.",
              "注意力在序列的词元位置间运行。在每一层，每个词元位置关注所有其他位置。在一次前向传播中序列长度是固定的。"
            )}
          </li>
          <li>
            <strong>{t("RMC:", "RMC：")}</strong>{" "}
            {t(
              "Attention runs across memory slots at each time step. The number of slots h is fixed, but the model processes one time step at a time (like an RNN). Memory persists across time steps via the LSTM update.",
              "注意力在每个时间步的记忆槽间运行。槽数量 h 固定，但模型一次处理一个时间步（像 RNN）。记忆通过 LSTM 更新跨时间步持久保存。"
            )}
          </li>
        </ul>

        <p>
          {t(
            "This makes RMC a temporal model with relational capacity — it can handle variable-length sequences online (one token at a time), while maintaining structured relational memory that is updated and refined at each step. The Transformer, by contrast, processes entire sequences in parallel but lacks persistent state across calls.",
            "这使 RMC 成为具有关系能力的时序模型——它可以在线处理可变长度序列（一次一个词元），同时维护在每一步更新和细化的结构化关系记忆。相比之下，Transformer 并行处理整个序列，但在调用之间缺乏持久状态。"
          )}
        </p>

        <p>
          {t(
            "In retrospect, RMC can be seen as a precursor to memory-augmented Transformers (like Transformer-XL and Memorizing Transformers). The shared insight: attention over a small, structured set of memory vectors is a powerful primitive for relational computation, whether those vectors are token representations or persistent memory slots.",
            "回顾来看，RMC 可以看作是记忆增强 Transformer（如 Transformer-XL 和记忆化 Transformer）的先驱。共同的洞察：对一小组结构化记忆向量的注意力是关系计算的强大基础，无论这些向量是词元表示还是持久记忆槽。"
          )}
        </p>

        <Collapsible
          title={t(
            "RMC as a recurrent Transformer",
            "RMC 作为循环 Transformer"
          )}
        >
          <p>
            {t(
              "One way to understand RMC: take a Transformer block (multi-head attention + feedforward), make it recurrent by giving it a persistent memory state M that carries across time steps, and replace the feedforward with an LSTM for richer temporal gating. The attention still operates over the same fixed-size memory, so the per-step computation cost is O(h²·d) — independent of sequence length, unlike a full Transformer which costs O(T²·d) for sequence length T.",
              "理解 RMC 的一种方式：取一个 Transformer 块（多头注意力 + 前馈），通过给它一个跨时间步持久的记忆状态 M 使其循环，并用 LSTM 替换前馈以实现更丰富的时序门控。注意力仍在相同大小的固定记忆上运行，因此每步计算成本为 O(h²·d)——与序列长度无关，不像完整 Transformer 对序列长度 T 成本为 O(T²·d)。"
            )}
          </p>
        </Collapsible>

        {/* ============ Back link ============ */}
        <div className="mt-16 pt-8 border-t border-paper-200 dark:border-paper-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t("\u2190 Back to Papers", "\u2190 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
