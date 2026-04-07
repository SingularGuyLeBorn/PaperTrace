"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function NeuralTuringMachinePage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("Neural Turing Machines", "神经图灵机")}
        </h1>
        <p className="text-paper-800/50 dark:text-paper-200/50">
          Graves, Wayne, Danihelka &middot; DeepMind &middot; 2014 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1410.5401"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1410.5401
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Neural Turing Machines couple a neural network controller with an external differentiable memory matrix. The controller reads from and writes to memory via soft, attention-like addressing — making every operation end-to-end trainable with gradient descent. NTMs learn to copy, sort, and recall sequences far better than LSTMs, and generalize to sequence lengths never seen during training.",
              "神经图灵机将神经网络控制器与外部可微分记忆矩阵相结合。控制器通过软性、类似注意力的寻址机制对记忆进行读写 — 使每个操作都可以通过梯度下降端对端训练。NTM 在复制、排序和召回序列方面远优于 LSTM，并能泛化到训练时从未见过的序列长度。"
            )}
          </p>
        </section>

        {/* ============ FlowChart ============ */}
        <FlowChart
          title={t("NTM Architecture Pipeline", "NTM 架构流程")}
          steps={[
            {
              title: t(
                "Problem: RNNs lack explicit external memory for algorithmic tasks",
                "问题：RNN 缺乏用于算法任务的显式外部记忆"
              ),
              subtitle: t(
                "Copy, sort, associative recall — RNNs fail to generalize",
                "复制、排序、关联召回 — RNN 无法泛化"
              ),
              color: "rose",
            },
            {
              title: t(
                "Solution: Controller (LSTM/FF) + Memory Matrix M of size N×M",
                "解决方案：控制器（LSTM/前馈）+ N×M 大小的记忆矩阵 M"
              ),
              subtitle: t(
                "Memory is external, persistent, and differentiable",
                "记忆是外部的、持久的、可微分的"
              ),
              color: "amber",
            },
            {
              title: t(
                "Addressing: Content-based + Location-based weighting",
                "寻址：基于内容 + 基于位置的加权"
              ),
              subtitle: t(
                "Full pipeline: content → interpolation → shift → sharpen",
                "完整流程：内容权重 → 插值 → 位移 → 锐化"
              ),
              color: "blue",
              children: [
                {
                  title: t("Content: cosine similarity key lookup", "内容：余弦相似度键查找"),
                  color: "blue",
                },
                {
                  title: t("Location: shift convolution + sharpening", "位置：位移卷积 + 锐化"),
                  color: "blue",
                },
              ],
            },
            {
              title: t(
                "Read: r_t = Σ_i w_t(i) · M_t(i) — differentiable weighted sum",
                "读取：r_t = Σ_i w_t(i) · M_t(i) — 可微分加权求和"
              ),
              subtitle: t(
                "Soft read — every memory slot contributes proportionally",
                "软读取 — 每个记忆槽按比例贡献"
              ),
              color: "teal",
            },
            {
              title: t(
                "Write: Erase then Add — M_t(i) ← M_{t-1}(i)[1 − w_t(i)·e_t] + w_t(i)·a_t",
                "写入：先擦除再添加 — M_t(i) ← M_{t-1}(i)[1 − w_t(i)·e_t] + w_t(i)·a_t"
              ),
              subtitle: t(
                "Selective erase with e_t, selective add with a_t",
                "用 e_t 选择性擦除，用 a_t 选择性添加"
              ),
              color: "purple",
            },
            {
              title: t(
                "Result: NTM generalizes to 2× unseen sequence lengths; LSTM fails",
                "结果：NTM 泛化到训练时未见的 2 倍序列长度；LSTM 失败"
              ),
              subtitle: t(
                "Demonstrated on copy, repeated copy, associative recall, priority sort",
                "在复制、重复复制、关联召回、优先级排序任务上验证"
              ),
              color: "green",
            },
          ]}
          arrows={[
            t("Motivation", "动机"),
            t("Architecture", "架构"),
            t("Core mechanism", "核心机制"),
            t("Read operation", "读取操作"),
            t("Write operation", "写入操作"),
          ]}
          highlights={[
            {
              text: t(
                "Fully differentiable — trained end-to-end with BPTT",
                "完全可微分 — 通过 BPTT 端对端训练"
              ),
              color: "blue",
            },
            {
              text: t(
                "External memory decouples storage from computation",
                "外部记忆将存储与计算解耦"
              ),
              color: "green",
            },
            {
              text: t(
                "Generalizes beyond training distribution on sequence length",
                "泛化到训练分布之外的序列长度"
              ),
              color: "purple",
            },
          ]}
        />

        {/* ============ Section 1: Motivation ============ */}
        <h2 className="text-xl font-semibold mt-12 mb-4">
          {t("1. Motivation: Why RNNs Aren't Enough", "1. 动机：为什么 RNN 还不够")}
        </h2>
        <p className="mb-4">
          {t(
            "Standard RNNs and LSTMs compress all past information into a fixed-size hidden state vector. For algorithmic tasks — copying a sequence, sorting by priority, recalling a stored pattern — this bottleneck is catastrophic. The network must simultaneously remember what it has seen and figure out what to do next, all within a single hidden vector.",
            "标准 RNN 和 LSTM 将所有过去信息压缩到一个固定大小的隐藏状态向量中。对于算法任务 — 复制序列、按优先级排序、召回存储的模式 — 这个瓶颈是致命的。网络必须同时记住它所见到的内容，并在单个隐藏向量中决定下一步操作。"
          )}
        </p>
        <p className="mb-4">
          {t(
            "The key insight of NTMs is that computers solve these tasks easily because they have two separate resources: a processor (controller) and working memory (RAM). The controller reads from and writes to memory as needed. NTMs implement exactly this separation — but with differentiable, soft operations so the whole system can be trained end-to-end.",
            "NTM 的核心洞察是：计算机能轻松解决这些任务，因为它们有两种独立资源：处理器（控制器）和工作内存（RAM）。控制器按需读写内存。NTM 正是实现了这种分离 — 但使用可微分的软性操作，使整个系统可以端对端训练。"
          )}
        </p>
        <Collapsible
          title={t(
            "Why can't LSTMs just learn to copy?",
            "为什么 LSTM 不能直接学会复制？"
          )}
        >
          <p className="mb-3">
            {t(
              "LSTMs can copy short sequences — the hidden state can memorize them. But as sequence length grows, the fixed-capacity hidden state becomes insufficient. More critically, LSTMs trained on sequences of length 1–20 fail almost completely on length 50, because the implicit memory strategy they learn is not compositional or addressable.",
              "LSTM 可以复制短序列 — 隐藏状态可以记忆它们。但随着序列长度增长，固定容量的隐藏状态变得不足。更关键的是，在长度 1-20 的序列上训练的 LSTM 在长度 50 时几乎完全失败，因为它们学到的隐式记忆策略不具有组合性或可寻址性。"
            )}
          </p>
          <p>
            {t(
              "NTMs decouple memory capacity (the N×M matrix, which can be large) from computation (the controller). The addressing weights tell the controller exactly where to read/write — making the operation length-generalizable by construction.",
              "NTM 将记忆容量（N×M 矩阵，可以很大）与计算（控制器）解耦。寻址权重告诉控制器确切的读写位置 — 使操作在构造上具有长度泛化能力。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 2: Architecture ============ */}
        <h2 className="text-xl font-semibold mt-12 mb-4">
          {t("2. NTM Architecture", "2. NTM 架构")}
        </h2>
        <p className="mb-4">
          {t(
            "An NTM has two main components:",
            "NTM 有两个主要组件："
          )}
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>
            <strong>{t("Controller", "控制器")}</strong>
            {t(
              ": An LSTM or feedforward network that receives external input x_t and read vectors from memory. It outputs write parameters (erase vector e_t, add vector a_t) and addressing parameters (key k_t, strength β_t, gate g_t, shift kernel s_t, sharpening factor γ_t).",
              "：一个 LSTM 或前馈网络，接收外部输入 x_t 和来自记忆的读取向量。它输出写入参数（擦除向量 e_t、添加向量 a_t）和寻址参数（键 k_t、强度 β_t、门控 g_t、位移核 s_t、锐化因子 γ_t）。"
            )}
          </li>
          <li>
            <strong>{t("Memory matrix", "记忆矩阵")}</strong>
            {t(
              ": M_t of size N×M — N memory locations, each a vector of dimension M. Initialized to small constants, updated by write operations each timestep.",
              "：大小为 N×M 的 M_t — N 个记忆位置，每个是维度为 M 的向量。初始化为小常数，每个时间步通过写入操作更新。"
            )}
          </li>
        </ul>
        <p className="mb-4">
          {t(
            "At each timestep, the controller outputs attention weights w_t over the N memory locations. These weights are used for both reading and writing. The full output of the NTM is the concatenation of the controller's internal output and the read vector r_t.",
            "在每个时间步，控制器输出对 N 个记忆位置的注意力权重 w_t。这些权重同时用于读取和写入。NTM 的完整输出是控制器内部输出和读取向量 r_t 的拼接。"
          )}
        </p>

        {/* ============ Section 3: Reading ============ */}
        <h2 className="text-xl font-semibold mt-12 mb-4">
          {t("3. Reading from Memory", "3. 从记忆中读取")}
        </h2>
        <p className="mb-4">
          {t(
            "Reading is a differentiable weighted sum over all memory locations. Given attention weights w_t(i) (a distribution summing to 1), the read vector is:",
            "读取是对所有记忆位置的可微分加权求和。给定注意力权重 w_t(i)（总和为 1 的分布），读取向量为："
          )}
        </p>
        <Math display tex={"r_t = \\sum_i w_t(i) \\, M_t(i)"} />
        <p className="mb-4 mt-4">
          {t(
            "This is a soft read — every memory slot contributes to the result, weighted by how much attention it receives. When w_t is concentrated on a single location (sharp), it approximates a hard read. When w_t is diffuse, it produces a blended average. Because this is a linear combination, gradients flow back through w_t and M_t seamlessly.",
            "这是软读取 — 每个记忆槽根据其受到的注意力权重贡献结果。当 w_t 集中在单个位置（尖锐）时，近似于硬读取。当 w_t 分散时，产生混合平均值。由于这是线性组合，梯度可以无缝地流回 w_t 和 M_t。"
          )}
        </p>

        {/* ============ Section 4: Writing ============ */}
        <h2 className="text-xl font-semibold mt-12 mb-4">
          {t("4. Writing to Memory", "4. 写入记忆")}
        </h2>
        <p className="mb-4">
          {t(
            "Writing is split into two sub-operations, applied in sequence: erase then add. The controller emits an erase vector e_t ∈ (0,1)^M and an add vector a_t ∈ R^M.",
            "写入分为两个子操作，依次应用：擦除然后添加。控制器发出擦除向量 e_t ∈ (0,1)^M 和添加向量 a_t ∈ R^M。"
          )}
        </p>
        <p className="mb-2 font-medium">
          {t("Erase step:", "擦除步骤：")}
        </p>
        <Math display tex={"\\tilde{M}_t(i) = M_{t-1}(i) \\left[\\mathbf{1} - w_t(i) \\, e_t\\right]"} />
        <p className="mt-4 mb-2 font-medium">
          {t("Add step:", "添加步骤：")}
        </p>
        <Math display tex={"M_t(i) = \\tilde{M}_t(i) + w_t(i) \\, a_t"} />
        <p className="mt-4 mb-4">
          {t(
            "The combined write operation is:",
            "完整的写入操作为："
          )}
        </p>
        <Math display tex={"M_t(i) = M_{t-1}(i)\\left[\\mathbf{1} - w_t(i)\\,e_t\\right] + w_t(i)\\,a_t"} />
        <p className="mt-4 mb-4">
          {t(
            "When e_t = 1 (all ones), the erase completely resets the attended location before adding a_t — a full overwrite. When e_t = 0, the erase does nothing and a_t is simply added to existing content. Locations with low w_t(i) are barely touched, implementing selective writes.",
            "当 e_t = 1（全 1）时，擦除在添加 a_t 之前完全重置被关注的位置 — 完全覆写。当 e_t = 0 时，擦除不执行任何操作，a_t 简单地添加到现有内容。w_t(i) 低的位置几乎不受影响，实现选择性写入。"
          )}
        </p>
        <Collapsible
          title={t(
            "Why split into erase + add instead of a single write?",
            "为什么分成擦除 + 添加，而不是单次写入？"
          )}
        >
          <p className="mb-3">
            {t(
              "A single write W_t(i) = w_t(i) · v_t would completely overwrite the memory, making it impossible to accumulate information across multiple writes to the same location. The erase-then-add split allows the network to choose how much of the old value to preserve (via e_t) and what new content to inject (via a_t) independently.",
              "单次写入 W_t(i) = w_t(i) · v_t 会完全覆盖记忆，使跨多次写入到同一位置的信息积累变得不可能。擦除-添加分离允许网络独立选择保留多少旧值（通过 e_t）和注入什么新内容（通过 a_t）。"
            )}
          </p>
          <p>
            {t(
              "This mirrors how real memory systems work: a register file in a CPU separates 'zero out' from 'write value'. The analog here is differentiable and continuous — the network learns to tune e_t and a_t jointly with the addressing weights.",
              "这与真实内存系统的工作方式类似：CPU 中的寄存器文件将'清零'与'写入值'分开。这里的类比是可微分且连续的 — 网络学习与寻址权重共同调整 e_t 和 a_t。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 5: Addressing ============ */}
        <h2 className="text-xl font-semibold mt-12 mb-4">
          {t("5. Addressing Mechanisms", "5. 寻址机制")}
        </h2>
        <p className="mb-4">
          {t(
            "Attention weights w_t are computed through a four-step pipeline that combines content-based and location-based addressing. This allows the controller to either look up a specific value by content (like a hash map) or iterate sequentially through memory locations (like a pointer).",
            "注意力权重 w_t 通过结合基于内容和基于位置寻址的四步流程计算。这使控制器可以通过内容查找特定值（类似哈希映射）或顺序遍历记忆位置（类似指针）。"
          )}
        </p>

        <h3 className="text-lg font-medium mt-6 mb-3">
          {t("Step 1 — Content Addressing", "第一步 — 基于内容寻址")}
        </h3>
        <p className="mb-3">
          {t(
            "The controller emits a query key k_t and a strength scalar β_t > 0. Content similarity between k_t and each row M_t(i) is measured by cosine similarity:",
            "控制器发出查询键 k_t 和强度标量 β_t > 0。k_t 与每行 M_t(i) 之间的内容相似度通过余弦相似度度量："
          )}
        </p>
        <Math display tex={"K(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\cdot \\|\\mathbf{v}\\|}"} />
        <p className="mt-4 mb-3">
          {t(
            "The content-based weight distribution is:",
            "基于内容的权重分布为："
          )}
        </p>
        <Math display tex={"w_t^c(i) = \\frac{\\exp\\!\\left(\\beta_t \\, K(\\mathbf{k}_t,\\, M_t(i))\\right)}{\\sum_j \\exp\\!\\left(\\beta_t \\, K(\\mathbf{k}_t,\\, M_t(j))\\right)}"} />
        <p className="mt-4 mb-4">
          {t(
            "β_t controls the sharpness of the lookup: large β_t → near-one-hot lookup (hard retrieval); small β_t → diffuse across all locations (soft averaging). This is analogous to temperature in softmax.",
            "β_t 控制查找的尖锐程度：大 β_t → 近似 one-hot 查找（硬检索）；小 β_t → 在所有位置上分散（软平均）。这类似于 softmax 中的温度参数。"
          )}
        </p>

        <h3 className="text-lg font-medium mt-6 mb-3">
          {t("Step 2 — Interpolation", "第二步 — 插值")}
        </h3>
        <p className="mb-3">
          {t(
            "A scalar gate g_t ∈ (0,1) interpolates between the content weight and the previous timestep's weight. This lets the controller decide whether to attend based on content (g_t ≈ 1) or maintain its previous location (g_t ≈ 0):",
            "标量门控 g_t ∈ (0,1) 在内容权重和上一时间步的权重之间插值。这使控制器决定是基于内容寻址（g_t ≈ 1）还是保持之前的位置（g_t ≈ 0）："
          )}
        </p>
        <Math display tex={"\\mathbf{w}_t^g = g_t \\, \\mathbf{w}_t^c + (1 - g_t) \\, \\mathbf{w}_{t-1}"} />

        <h3 className="text-lg font-medium mt-6 mb-3">
          {t("Step 3 — Shift", "第三步 — 位移")}
        </h3>
        <p className="mb-3">
          {t(
            "A shift distribution s_t (over integer offsets, e.g., {−1, 0, +1}) is convolved with w_t^g to allow the controller to move the attention head forward or backward. This enables sequential iteration over memory:",
            "位移分布 s_t（在整数偏移上，例如 {−1, 0, +1}）与 w_t^g 进行卷积，允许控制器向前或向后移动注意力头。这使顺序遍历记忆成为可能："
          )}
        </p>
        <Math display tex={"\\tilde{w}_t(i) = \\sum_j w_t^g(j) \\, s_t(i - j)"} />
        <p className="mt-4 mb-4">
          {t(
            "For the copy task, the network learns to set s_t to shift +1 every step, implementing a sequential scan.",
            "对于复制任务，网络学习在每一步将 s_t 设置为 +1，实现顺序扫描。"
          )}
        </p>

        <h3 className="text-lg font-medium mt-6 mb-3">
          {t("Step 4 — Sharpening", "第四步 — 锐化")}
        </h3>
        <p className="mb-3">
          {t(
            "The shift convolution can blur the weight distribution. A sharpening factor γ_t ≥ 1 re-concentrates the weights:",
            "位移卷积可能使权重分布模糊。锐化因子 γ_t ≥ 1 重新集中权重："
          )}
        </p>
        <Math display tex={"w_t(i) = \\frac{\\tilde{w}_t(i)^{\\gamma_t}}{\\sum_j \\tilde{w}_t(j)^{\\gamma_t}}"} />
        <p className="mt-4 mb-4">
          {t(
            "When γ_t = 1, sharpening is a no-op. When γ_t >> 1, the distribution approaches a one-hot vector over the argmax location.",
            "当 γ_t = 1 时，锐化是一个空操作。当 γ_t >> 1 时，分布趋近于 argmax 位置的 one-hot 向量。"
          )}
        </p>

        <Collapsible
          title={t(
            "Full addressing pipeline summary",
            "完整寻址流程总结"
          )}
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">1</span>
              <span>
                <strong>{t("Content weight", "内容权重")}</strong>
                {t(": softmax over cosine similarities, scaled by β_t", "：余弦相似度的 softmax，由 β_t 缩放")}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">2</span>
              <span>
                <strong>{t("Interpolate", "插值")}</strong>
                {t(": blend with w_{t-1} using gate g_t", "：使用门控 g_t 与 w_{t-1} 混合")}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">3</span>
              <span>
                <strong>{t("Shift", "位移")}</strong>
                {t(": circular convolution with learned shift kernel s_t", "：与学习到的位移核 s_t 进行循环卷积")}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">4</span>
              <span>
                <strong>{t("Sharpen", "锐化")}</strong>
                {t(": raise to power γ_t and renormalize", "：取 γ_t 次幂并重新归一化")}
              </span>
            </div>
          </div>
        </Collapsible>

        {/* ============ Section 6: Tasks ============ */}
        <h2 className="text-xl font-semibold mt-12 mb-4">
          {t("6. Tasks Demonstrated", "6. 验证任务")}
        </h2>
        <p className="mb-4">
          {t(
            "The paper evaluates NTMs against LSTMs on five algorithmic tasks. In every case, NTMs learn faster, achieve lower error, and generalize far better to out-of-distribution sequence lengths.",
            "论文在五个算法任务上对比了 NTM 和 LSTM。在所有情况下，NTM 学习更快、误差更低，并且在超出训练分布的序列长度上泛化能力显著更好。"
          )}
        </p>

        <div className="space-y-4 mb-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-1">
              {t("Copy Task", "复制任务")}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t(
                "Read a sequence of random binary vectors, then reproduce them. NTM learns to write each vector to memory sequentially, then read back in order. Trained on length 1–20; NTM generalizes to length 120 almost perfectly. LSTM degrades rapidly above training length.",
                "读取一系列随机二进制向量，然后重现它们。NTM 学会按顺序将每个向量写入内存，然后按顺序读回。在长度 1-20 上训练；NTM 在长度 120 上几乎完美泛化。LSTM 在训练长度以上快速退化。"
              )}
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-1">
              {t("Repeated Copy", "重复复制")}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t(
                "Copy a sequence K times (K given as input). NTM learns an outer loop (repeat K times) and inner loop (scan each position), implemented via location-based addressing. Demonstrates composable looping behavior.",
                "将序列复制 K 次（K 作为输入给出）。NTM 学习外部循环（重复 K 次）和内部循环（扫描每个位置），通过基于位置的寻址实现。展示了可组合的循环行为。"
              )}
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-1">
              {t("Associative Recall", "关联召回")}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t(
                "Store a list of item–item pairs, then given a query item, retrieve the associated item. NTM uses content-based addressing to look up the query key, then shifts +1 to fetch the paired item — implementing a primitive key-value store.",
                "存储一系列项目-项目对，然后给定查询项目，检索关联项目。NTM 使用基于内容的寻址查找查询键，然后移位 +1 获取配对项目 — 实现原始键值存储。"
              )}
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-1">
              {t("Dynamic N-Grams", "动态 N 元语法")}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t(
                "Predict the next symbol in a stream drawn from an n-gram distribution that changes over time. NTM can update its memory to track the current distribution, acting as an adaptive statistical model. Performance approaches the Bayesian optimal predictor.",
                "预测从随时间变化的 n 元语法分布中抽取的流中的下一个符号。NTM 可以更新其内存以跟踪当前分布，充当自适应统计模型。性能接近贝叶斯最优预测器。"
              )}
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-1">
              {t("Priority Sort", "优先级排序")}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t(
                "Given a sequence of (value, priority) pairs, output the values sorted by descending priority. NTM learns to write each value to the memory location indexed by its priority, then read back sequentially — a differentiable bucket sort.",
                "给定一系列（值，优先级）对，按优先级降序输出值。NTM 学习将每个值写入由其优先级索引的内存位置，然后顺序读回 — 一种可微分的桶排序。"
              )}
            </p>
          </div>
        </div>

        {/* ============ Section 7: NTM vs LSTM ============ */}
        <h2 className="text-xl font-semibold mt-12 mb-4">
          {t("7. NTM vs. LSTM", "7. NTM 与 LSTM 对比")}
        </h2>
        <p className="mb-4">
          {t(
            "The fundamental difference is not in expressivity (both are Turing-complete in theory) but in inductive bias and data efficiency.",
            "根本区别不在于表达能力（理论上两者都是图灵完备的），而在于归纳偏置和数据效率。"
          )}
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">
                  {t("Property", "属性")}
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">
                  LSTM
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">
                  NTM
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Memory capacity", "记忆容量")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Fixed (hidden state size)", "固定（隐藏状态大小）")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Scalable (N×M matrix)", "可扩展（N×M 矩阵）")}
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Memory access", "记忆访问")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Implicit (all gates)", "隐式（所有门控）")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Explicit (addressed reads/writes)", "显式（寻址读写）")}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Length generalization", "长度泛化")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Poor (degrades sharply)", "差（急剧退化）")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Strong (2× training length)", "强（训练长度的 2 倍）")}
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Addressing style", "寻址风格")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("None", "无")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Content + location hybrid", "内容 + 位置混合")}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("Training speed on copy", "复制任务训练速度")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("~100k steps to converge", "~100k 步收敛")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                  {t("~30k steps to converge", "~30k 步收敛")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Collapsible
          title={t(
            "Why does NTM generalize better on length?",
            "为什么 NTM 在长度上泛化更好？"
          )}
        >
          <p className="mb-3">
            {t(
              "The copy algorithm NTM discovers is genuinely compositional: it uses a pointer that increments by +1 each step, backed by a memory large enough to hold whatever the sequence size is. The algorithm itself is invariant to length — only the number of iterations changes.",
              "NTM 发现的复制算法是真正可组合的：它使用一个每步递增 +1 的指针，由足够大的内存支撑。算法本身与长度无关 — 只有迭代次数改变。"
            )}
          </p>
          <p>
            {t(
              "LSTM, by contrast, embeds the 'algorithm' in its weights and hidden state — which have fixed capacity. Longer sequences require more capacity than was trained on, causing failure. NTMs sidestep this by externalizing storage.",
              "相比之下，LSTM 将'算法'嵌入其权重和隐藏状态中 — 这些具有固定容量。更长的序列需要比训练时更多的容量，导致失败。NTM 通过外部化存储绕过了这一问题。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 8: Legacy ============ */}
        <h2 className="text-xl font-semibold mt-12 mb-4">
          {t("8. Legacy and Influence", "8. 遗产与影响")}
        </h2>
        <p className="mb-4">
          {t(
            "NTMs were one of the first demonstrations that differentiable memory could be bolted onto a neural network and trained end-to-end — a template that influenced many later architectures.",
            "NTM 是最早证明可微分记忆可以附加到神经网络并进行端对端训练的工作之一 — 这一模板影响了许多后续架构。"
          )}
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <strong>{t("Differentiable Neural Computer (DNC)", "可微分神经计算机（DNC）")}</strong>
            {t(
              " (Graves et al., 2016): Extended NTM with dynamic memory allocation, temporal link matrices for tracking write order, and stronger generalization. Used to navigate London Underground maps.",
              "（Graves 等，2016）：扩展了 NTM，加入动态内存分配、用于跟踪写入顺序的时间链接矩阵，以及更强的泛化能力。被用于导航伦敦地铁地图。"
            )}
          </li>
          <li>
            <strong>{t("Memory Networks", "记忆网络")}</strong>
            {t(
              " (Weston et al., 2014): Concurrent work with similar external memory idea, applied to QA tasks.",
              "（Weston 等，2014）：同期工作，具有类似的外部记忆思想，应用于问答任务。"
            )}
          </li>
          <li>
            <strong>{t("Attention mechanisms", "注意力机制")}</strong>
            {t(
              ": The content-based addressing in NTMs is conceptually identical to the attention mechanism later formalized in seq2seq models and Transformers. NTMs can be seen as an early attention-over-memory system.",
              "：NTM 中的基于内容寻址在概念上与后来在 seq2seq 模型和 Transformer 中形式化的注意力机制相同。NTM 可以看作是早期的记忆注意力系统。"
            )}
          </li>
          <li>
            <strong>{t("Meta-learning", "元学习")}</strong>
            {t(
              ": NTMs demonstrated that a neural network can implement an algorithm rather than just fit a function — foundational to later work on learning to learn.",
              "：NTM 证明了神经网络可以实现算法而不仅仅是拟合函数 — 这是后来学习如何学习工作的基础。"
            )}
          </li>
        </ul>

        {/* ============ Resources ============ */}
        <h2 className="text-xl font-semibold mt-12 mb-4">
          {t("Resources", "延伸阅读")}
        </h2>
        <div className="space-y-3">
          <a
            href="https://arxiv.org/abs/1410.5401"
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <div className="font-medium text-sm">
              {t("Original Paper — arXiv 1410.5401", "原始论文 — arXiv 1410.5401")}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t("Graves, Wayne, Danihelka · DeepMind · 2014", "Graves, Wayne, Danihelka · DeepMind · 2014")}
            </div>
          </a>
          <a
            href="https://arxiv.org/abs/1602.03218"
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <div className="font-medium text-sm">
              {t(
                "Hybrid Computing using a Neural Network with Dynamic External Memory (DNC)",
                "使用具有动态外部记忆的神经网络进行混合计算（DNC）"
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t("Graves et al. · Nature 2016 · Follow-up to NTM", "Graves 等 · Nature 2016 · NTM 的后续工作")}
            </div>
          </a>
          <a
            href="https://distill.pub/2016/augmented-rnns/"
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <div className="font-medium text-sm">
              {t("Distill: Attention and Augmented RNNs", "Distill：注意力与增强 RNN")}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t(
                "Olah & Carter · 2016 · Interactive visual explanation of NTMs, DNCs, and attention",
                "Olah & Carter · 2016 · NTM、DNC 和注意力的交互式可视化解释"
              )}
            </div>
          </a>
          <a
            href="https://rylanschaeffer.github.io/content/research/neural_turing_machine/main.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <div className="font-medium text-sm">
              {t("NTM Deep Dive — Rylan Schaeffer", "NTM 深度解析 — Rylan Schaeffer")}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t(
                "Detailed mathematical walkthrough with implementation notes",
                "详细的数学推导及实现说明"
              )}
            </div>
          </a>
        </div>

        {/* ============ Back Link ============ */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t("← Back to all papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
