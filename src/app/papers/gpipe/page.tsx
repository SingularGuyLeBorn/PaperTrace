"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function GPipePage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "GPipe: Easy Scaling with Micro-Batch Pipeline Parallelism",
            "GPipe：基于微批次流水线并行的简单扩展方法"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-paper-200/50">
          Huang et al. &middot; Google Brain &middot; NeurIPS 2019 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1811.06965"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1811.06965
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed mb-0">
            {t(
              "GPipe splits a large model across K accelerators (model parallelism), then splits each input batch into M micro-batches and pipelines them through the devices. Re-materialization (gradient checkpointing) reduces activation memory from O(N·M) to O(N+M). A pipeline bubble of fraction (K−1)/(M+K−1) is the only overhead — which vanishes as M grows large. Result: a 557M-parameter AmoebaNet-D on 4 TPUs, and an 83B-parameter language model on 8 TPUs.",
              "GPipe 将大型模型分割到 K 个加速器上（模型并行），再将每个输入批次分成 M 个微批次，通过设备流水线传递。重计算（梯度检查点）将激活内存从 O(N·M) 降至 O(N+M)。流水线气泡的比例为 (K−1)/(M+K−1)，随着 M 增大趋近于零。成果：在 4 个 TPU 上训练 5.57 亿参数的 AmoebaNet-D，在 8 个 TPU 上训练 830 亿参数的语言模型。"
            )}
          </p>
        </section>

        {/* Section 1: The Memory Wall Problem */}
        <h2 className="text-xl font-semibold mt-10 mb-4">
          {t("1. The Memory Wall Problem", "1. 内存墙问题")}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "Modern neural networks — especially in computer vision and NLP — have grown dramatically. A ResNet-50 has ~25M parameters; an AmoebaNet-D variant has 557M; large language models push into the tens or hundreds of billions. A single accelerator (GPU or TPU) has a fixed amount of high-bandwidth memory (HBM). When the model alone cannot fit in that memory, training becomes impossible without a strategy for distributing it.",
            "现代神经网络——尤其是计算机视觉和自然语言处理领域——规模急剧增长。ResNet-50 约有 2500 万参数，AmoebaNet-D 某变体有 5.57 亿参数，大型语言模型更达到数百亿乃至数千亿。单个加速器（GPU 或 TPU）的高带宽内存（HBM）容量是固定的。当模型本身就无法装入内存时，如果没有分布式策略，训练将无从进行。"
          )}
        </p>
        <p className="mb-4 leading-relaxed">
          {t(
            "Two natural axes of parallelism exist: data parallelism (each worker gets a copy of the full model, but a shard of the data) and model parallelism (each worker gets a shard of the model, but sees the full batch). Data parallelism breaks down the moment the model itself is too large for one device. Model parallelism is the only option — but naive implementations waste most of the hardware.",
            "并行化存在两个天然维度：数据并行（每个工作节点拥有完整模型的副本，但只处理数据的一个分片）和模型并行（每个工作节点拥有模型的一个分片，但处理完整批次）。当模型本身大于单设备内存时，数据并行便行不通。模型并行是唯一选择——但朴素的实现方式会浪费大部分硬件资源。"
          )}
        </p>

        <Collapsible
          title={t(
            "Why does memory scale with both parameters and activations?",
            "为什么内存同时随参数和激活值增长？"
          )}
        >
          <p className="text-sm leading-relaxed mb-3">
            {t(
              "During training, three things consume device memory: (1) model parameters, (2) optimizer states (e.g., Adam stores first and second moment estimates — 2× the parameter count), and (3) activations saved for the backward pass. Activations are the intermediate outputs at each layer during the forward pass. With batch size B and N layers, naive training stores all N×B activation tensors simultaneously. For large B this dominates memory usage entirely.",
              "训练期间，设备内存被三类数据占用：(1) 模型参数，(2) 优化器状态（例如 Adam 存储一阶和二阶矩估计，占参数量的 2 倍），以及 (3) 为反向传播保存的激活值。激活值是前向传播时每层的中间输出。在批次大小为 B、层数为 N 的朴素训练中，需要同时存储所有 N×B 个激活张量。对于较大的 B，这部分内存占用会完全主导整体消耗。"
            )}
          </p>
        </Collapsible>

        {/* Section 2: Naive Model Parallelism */}
        <h2 className="text-xl font-semibold mt-10 mb-4">
          {t("2. Naive Model Parallelism", "2. 朴素模型并行")}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "The straightforward approach to model parallelism is to assign consecutive groups of layers to consecutive devices. Device 1 holds layers 1–L/K, device 2 holds layers L/K+1–2L/K, and so on. The forward pass runs sequentially: device 1 computes its layers, passes the activation tensor to device 2, which computes its layers and passes forward, etc.",
            "模型并行最直接的方法是将连续的层组分配给连续的设备。设备 1 持有第 1 到 L/K 层，设备 2 持有第 L/K+1 到 2L/K 层，以此类推。前向传播按顺序执行：设备 1 计算其层后，将激活张量传递给设备 2，设备 2 计算后继续向前传递，依此类推。"
          )}
        </p>
        <p className="mb-4 leading-relaxed">
          {t(
            "The critical problem: at any point in time, only one device is active. While device 2 processes its layers, devices 1, 3, 4, …, K are idle. The utilization of each device approaches 1/K — so with 4 devices, each is busy only 25% of the time. This is sometimes called the \"model parallelism bubble\" or just idle time, and it completely negates the purpose of using multiple accelerators.",
            "关键问题在于：任何时刻只有一个设备在工作。当设备 2 处理其层时，设备 1、3、4……K 全部处于空闲状态。每个设备的利用率接近 1/K——使用 4 个设备时，每个设备只有 25% 的时间在运行。这有时被称为」模型并行气泡「或空闲时间，它完全抵消了使用多个加速器的意义。"
          )}
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-6 font-mono text-sm overflow-x-auto">
          <p className="text-gray-500 dark:text-gray-400 mb-3 font-sans font-medium text-xs uppercase tracking-wide">
            {t("Naive model parallelism — timeline (K=4 devices, 1 batch)", "朴素模型并行时间线（K=4 设备，1 个批次）")}
          </p>
          <pre className="text-gray-800 dark:text-gray-200 leading-relaxed">{`Device 1: [FWD][ idle ][ idle ][ idle ][BWD][ idle ][ idle ][ idle ]
Device 2: [idle][FWD  ][ idle ][ idle ][idle][BWD ][ idle ][ idle ]
Device 3: [idle][ idle][FWD  ][ idle ][idle][idle][BWD  ][ idle ]
Device 4: [idle][ idle][ idle ][FWD  ][idle][idle][ idle ][BWD  ]`}</pre>
          <p className="text-gray-500 dark:text-gray-400 mt-3 font-sans text-xs">
            {t("Each device active only 25% of the time (2 of 8 time slots).", "每个设备仅有 25% 的时间处于活跃状态（8 个时间槽中的 2 个）。")}
          </p>
        </div>

        {/* Section 3: Pipeline Parallelism with Micro-Batches */}
        <h2 className="text-xl font-semibold mt-10 mb-4">
          {t(
            "3. Pipeline Parallelism with Micro-Batches",
            "3. 基于微批次的流水线并行"
          )}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "GPipe's key insight is to subdivide the input mini-batch into M equal micro-batches. Each device processes micro-batch m, then immediately starts on micro-batch m+1. Device k+1 can begin processing micro-batch m as soon as device k finishes it — so all devices can be active simultaneously (after the initial fill phase).",
            "GPipe 的核心思想是将输入的 mini-batch 等分为 M 个微批次。每个设备处理完微批次 m 后，立即开始处理微批次 m+1。设备 k+1 可以在设备 k 完成微批次 m 后立即开始处理它——因此所有设备可以（在初始填充阶段后）同时保持活跃。"
          )}
        </p>
        <p className="mb-4 leading-relaxed">
          {t(
            "Critically, the gradient update happens only after all M micro-batches complete their forward and backward passes. The gradients from M micro-batches are accumulated and averaged before the optimizer step. This means the effective batch size equals the original mini-batch size — the micro-batch split is purely a scheduling optimization, invisible to the learning dynamics.",
            "关键在于，梯度更新只在所有 M 个微批次完成前向和反向传播后才进行。M 个微批次的梯度在优化器步骤前被累积并求平均。这意味着有效批次大小等于原始 mini-batch 大小——微批次分割纯粹是一种调度优化，对学习动态不可见。"
          )}
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-6 font-mono text-sm overflow-x-auto">
          <p className="text-gray-500 dark:text-gray-400 mb-3 font-sans font-medium text-xs uppercase tracking-wide">
            {t("GPipe pipeline schedule — K=4 devices, M=4 micro-batches", "GPipe 流水线调度——K=4 设备，M=4 微批次")}
          </p>
          <pre className="text-gray-800 dark:text-gray-200 leading-relaxed">{`         t=1   t=2   t=3   t=4   t=5   t=6   t=7   t=8   t=9   t=10  t=11
Device 1: [F1]  [F2]  [F3]  [F4]  [  ]  [  ]  [B4]  [B3]  [B2]  [B1]  [↑W]
Device 2: [  ]  [F1]  [F2]  [F3]  [F4]  [  ]  [  ]  [B4]  [B3]  [B2]  [B1]
Device 3: [  ]  [  ]  [F1]  [F2]  [F3]  [F4]  [  ]  [  ]  [B4]  [B3]  [B2]
Device 4: [  ]  [  ]  [  ]  [F1]  [F2]  [F3]  [F4]  [  ]  [  ]  [  ]  [B4]`}</pre>
          <p className="text-gray-500 dark:text-gray-400 mt-3 font-sans text-xs">
            {t(
              "Fm = forward pass for micro-batch m, Bm = backward pass. Empty slots = bubble (pipeline idle). ↑W = weight update using accumulated gradients.",
              "Fm = 微批次 m 的前向传播，Bm = 反向传播。空格 = 气泡（流水线空闲）。↑W = 使用累积梯度进行权重更新。"
            )}
          </p>
        </div>

        <p className="mb-4 leading-relaxed">
          {t(
            "The key property: once the pipeline is full (after K−1 time steps), all K devices are active on different micro-batches simultaneously. The only wasted time is the initial K−1 steps to fill the pipeline and the final K−1 steps to drain it — the \"pipeline bubble.\"",
            "关键特性：一旦流水线被填满（K−1 个时间步后），所有 K 个设备同时在不同的微批次上运行。唯一浪费的时间是填充流水线的初始 K−1 步和排空流水线的最后 K−1 步——即」流水线气泡「。"
          )}
        </p>

        <Collapsible
          title={t(
            "How does gradient accumulation maintain training correctness?",
            "梯度累积如何保证训练的正确性？"
          )}
        >
          <p className="text-sm leading-relaxed mb-3">
            {t(
              "Each micro-batch produces a gradient signal. Since micro-batches are non-overlapping and exhaustive partitions of the mini-batch, summing (or averaging) the per-micro-batch gradients is mathematically equivalent to computing the gradient over the full mini-batch in one shot. The optimizer (SGD, Adam, etc.) sees exactly the same gradient as it would with the original batch size, so learning dynamics are preserved exactly.",
              "每个微批次产生一个梯度信号。由于微批次是 mini-batch 的不重叠且完整的分区，对各微批次梯度求和（或平均）在数学上等价于一次性计算整个 mini-batch 的梯度。优化器（SGD、Adam 等）看到的梯度与原始批次大小完全相同，因此学习动态被精确保留。"
            )}
          </p>
          <p className="text-sm leading-relaxed">
            {t(
              "Batch normalization requires special handling: statistics must be computed per micro-batch (not globally), then the running statistics for inference are computed as the average across micro-batches. GPipe uses this micro-batch BN strategy throughout.",
              "批归一化需要特殊处理：统计数据必须按微批次计算（而非全局），然后推理时使用的运行统计数据是各微批次的平均值。GPipe 在整个训练中使用这种微批次 BN 策略。"
            )}
          </p>
        </Collapsible>

        {/* Section 4: Re-materialization */}
        <h2 className="text-xl font-semibold mt-10 mb-4">
          {t(
            "4. Re-materialization (Gradient Checkpointing)",
            "4. 重计算（梯度检查点）"
          )}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "With K devices and M micro-batches, the naive approach stores all activations from every layer of every micro-batch simultaneously to support the backward pass. With N total layers and M micro-batches, this means storing O(N·M) activation tensors — which can easily exceed device memory.",
            "在 K 个设备和 M 个微批次的情况下，朴素方法需要同时存储每个微批次每一层的所有激活值以支持反向传播。对于 N 层和 M 个微批次，这意味着存储 O(N·M) 个激活张量——很容易超出设备内存。"
          )}
        </p>
        <p className="mb-4 leading-relaxed">
          {t(
            "GPipe applies re-materialization: activations are not stored during the forward pass. Instead, only the boundary activations (the output tensors passed between devices) are retained. During the backward pass, each device re-runs its forward computation to recompute the needed activations on the fly, then immediately computes and discards the gradient.",
            "GPipe 应用重计算策略：前向传播时不存储激活值。取而代之，只保留边界激活值（在设备间传递的输出张量）。反向传播时，每个设备重新运行前向计算，即时重新计算所需的激活值，然后立即计算并丢弃梯度。"
          )}
        </p>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <p className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
            {t("Memory cost comparison", "内存开销对比")}
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t(
                  "Without re-materialization (store all activations):",
                  "不使用重计算（存储所有激活值）："
                )}
              </p>
              <Math display tex={String.raw`\text{Memory} = O(N \cdot M)`} />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t(
                  "N layers × M micro-batches each held in memory simultaneously",
                  "N 层 × M 个微批次同时保存在内存中"
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t(
                  "With re-materialization (only store partition boundary outputs):",
                  "使用重计算（只存储分区边界输出）："
                )}
              </p>
              <Math display tex={String.raw`\text{Memory} = O(N + M)`} />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t(
                  "O(N): parameter memory per partition + O(M): M boundary activation tensors (one per micro-batch in-flight)",
                  "O(N)：每个分区的参数内存 + O(M)：M 个边界激活张量（每个在途微批次一个）"
                )}
              </p>
            </div>
          </div>
        </div>

        <p className="mb-4 leading-relaxed">
          {t(
            "The trade-off is computation: each partition's forward pass is run twice — once during the forward phase and once during backward. This roughly doubles the computation within each device, but this is far preferable to running out of memory entirely.",
            "代价是计算量：每个分区的前向传播运行两次——一次在前向阶段，一次在反向阶段。这大约使每个设备的计算量翻倍，但远优于完全耗尽内存。"
          )}
        </p>

        <Collapsible
          title={t(
            "What exactly is stored at partition boundaries?",
            "分区边界处究竟存储了什么？"
          )}
        >
          <p className="text-sm leading-relaxed mb-3">
            {t(
              "Each partition is a contiguous group of layers assigned to one device. The only tensor that needs to be stored between forward and backward passes is the output of the last layer in each partition — this is the tensor that was sent to the next device. This tensor serves as the \"starting point\" for recomputing the entire partition's forward pass during the backward phase.",
              "每个分区是分配给一个设备的连续层组。在前向和反向传播之间唯一需要存储的张量是每个分区最后一层的输出——即发送给下一个设备的张量。这个张量作为反向阶段重新计算整个分区前向传播的」起点「。"
            )}
          </p>
          <p className="text-sm leading-relaxed">
            {t(
              "Also stored: model parameters (obviously) and optimizer states. The O(N+M) formula captures: O(N/K) parameters per device × K devices = O(N) total, plus O(M) boundary activation tensors — one for each of the M micro-batches currently in-flight in the pipeline.",
              "还需存储：模型参数（显然）和优化器状态。O(N+M) 公式包含：每个设备 O(N/K) 参数 × K 个设备 = 总计 O(N)，加上 O(M) 个边界激活张量——流水线中每个在途的 M 个微批次各一个。"
            )}
          </p>
        </Collapsible>

        {/* Section 5: Bubble Overhead Analysis */}
        <h2 className="text-xl font-semibold mt-10 mb-4">
          {t("5. Bubble Overhead Analysis", "5. 气泡开销分析")}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "The pipeline is not perfectly efficient: there is always a startup bubble (filling the pipeline) and a drain bubble (emptying it). How large is this overhead exactly?",
            "流水线并非完全高效：总会有启动气泡（填充流水线）和排空气泡（清空流水线）。这个开销究竟有多大？"
          )}
        </p>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
            {t("Pipeline efficiency formula", "流水线效率公式")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {t("Total time steps in forward+backward schedule:", "前向+反向调度的总时间步数：")}
          </p>
          <Math display tex={String.raw`T_{\text{total}} = (M + K - 1) \cdot t_{\text{step}}`} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 mb-2">
            {t("Useful (non-bubble) time steps:", "有效（非气泡）时间步数：")}
          </p>
          <Math display tex={String.raw`T_{\text{useful}} = M \cdot t_{\text{step}}`} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 mb-2">
            {t("Bubble fraction (wasted time):", "气泡比例（浪费的时间）：")}
          </p>
          <Math display tex={String.raw`\text{bubble} = \frac{K - 1}{M + K - 1}`} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 mb-2">
            {t("Pipeline efficiency:", "流水线效率：")}
          </p>
          <Math display tex={String.raw`\eta = 1 - \frac{K-1}{M+K-1} = \frac{M}{M+K-1}`} />
        </div>

        <p className="mb-4 leading-relaxed">
          {t(
            "The bubble fraction decreases as M increases. With K=4 partitions and M=4 micro-batches, the bubble is (4−1)/(4+4−1) = 3/7 ≈ 43%. With M=32 micro-batches, it drops to 3/35 ≈ 9%. With M=128, it is 3/131 ≈ 2.3%. In practice, GPipe recommends M ≥ 4K to keep bubble overhead below 20%.",
            "气泡比例随 M 增大而减小。K=4 分区、M=4 微批次时，气泡为 (4−1)/(4+4−1) = 3/7 ≈ 43%。M=32 时降至 3/35 ≈ 9%。M=128 时为 3/131 ≈ 2.3%。实践中，GPipe 建议 M ≥ 4K 以将气泡开销控制在 20% 以下。"
          )}
        </p>

        <Collapsible
          title={t(
            "Why is the formula M + K − 1 and not something else?",
            "为什么公式是 M + K − 1 而不是其他形式？"
          )}
        >
          <p className="text-sm leading-relaxed mb-3">
            {t(
              "Think of it as a conveyor belt with K stations and M items. The first item passes through all K stations before the last item starts. Total elapsed time = time for last item to reach station 1 (M steps) + time to pass through all K stations (K steps). But since the Mth item starts at step M and finishes at step M+K−1, the total is M+K−1 steps. Of these, K−1 steps at the start and K−1 steps at the end have at least one device idle (the bubble).",
              "可以将其想象为一条有 K 个工位、M 个物品的传送带。第一个物品通过所有 K 个工位后，最后一个物品才开始。总耗时 = 最后一个物品到达工位 1 的时间（M 步）+ 通过所有 K 个工位的时间（K 步）。由于第 M 个物品在第 M 步开始，在第 M+K−1 步完成，总共 M+K−1 步。其中开始的 K−1 步和结束的 K−1 步至少有一个设备空闲（气泡）。"
            )}
          </p>
          <p className="text-sm leading-relaxed">
            {t(
              "The formula also applies to the backward pass. Since backward takes approximately 2× as long as forward (due to computing both weight and activation gradients), the actual schedule is slightly more complex, but the bubble fraction formula remains the same.",
              "此公式同样适用于反向传播。由于反向传播（需要计算权重梯度和激活梯度）大约需要前向传播 2 倍的时间，实际调度略微复杂，但气泡比例公式保持不变。"
            )}
          </p>
        </Collapsible>

        {/* Section 6: Worked Example */}
        <h2 className="text-xl font-semibold mt-10 mb-4">
          {t(
            "6. Worked Example: 4 Devices, 8 Micro-Batches",
            "6. 实例演算：4 个设备，8 个微批次"
          )}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "Suppose we have a model with 32 layers split across K=4 devices (8 layers each), and we split each mini-batch into M=8 micro-batches.",
            "假设我们有一个 32 层的模型，分布在 K=4 个设备上（每个 8 层），并将每个 mini-batch 分成 M=8 个微批次。"
          )}
        </p>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t("Bubble fraction:", "气泡比例：")}
            </p>
            <Math display tex={String.raw`\frac{K-1}{M+K-1} = \frac{4-1}{8+4-1} = \frac{3}{11} \approx 27\%`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t("Pipeline efficiency:", "流水线效率：")}
            </p>
            <Math display tex={String.raw`\eta = \frac{M}{M+K-1} = \frac{8}{11} \approx 73\%`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t("Memory per device (with re-mat):", "每个设备的内存（使用重计算）：")}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t(
                "Parameters for 8 layers + 8 boundary activation tensors (one per micro-batch). Compare to without re-mat: 8 layers × 8 micro-batch activations = 64 activation tensors simultaneously.",
                "8 层的参数 + 8 个边界激活张量（每个微批次一个）。对比不使用重计算：8 层 × 8 个微批次激活值 = 同时 64 个激活张量。"
              )}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t("Scaling to M=32 micro-batches:", "扩展到 M=32 个微批次：")}
            </p>
            <Math display tex={String.raw`\text{bubble} = \frac{3}{32+3} = \frac{3}{35} \approx 8.6\%`} />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {t(
                "At M=32 the overhead is acceptable; memory cost increases only linearly with M (O(M) boundary tensors).",
                "M=32 时开销可接受；内存开销仅随 M 线性增长（O(M) 个边界张量）。"
              )}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-6 font-mono text-xs overflow-x-auto">
          <p className="text-gray-500 dark:text-gray-400 mb-3 font-sans font-medium text-xs uppercase tracking-wide">
            {t("K=4, M=8: full pipeline schedule (F=forward, B=backward, _=bubble)", "K=4, M=8：完整流水线调度（F=前向，B=反向，_=气泡）")}
          </p>
          <pre className="text-gray-800 dark:text-gray-200 leading-relaxed">{`      t:  1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19
Dev 1: [F1][F2][F3][F4][F5][F6][F7][F8][ ][ ][ ][B8][B7][B6][B5][B4][B3][B2][B1]
Dev 2: [ ][F1][F2][F3][F4][F5][F6][F7][F8][ ][ ][ ][B8][B7][B6][B5][B4][B3][B2]
Dev 3: [ ][ ][F1][F2][F3][F4][F5][F6][F7][F8][ ][ ][ ][B8][B7][B6][B5][B4][B3]
Dev 4: [ ][ ][ ][F1][F2][F3][F4][F5][F6][F7][F8][ ][ ][ ][B8][B7][B6][B5][B4]`}</pre>
        </div>

        {/* Section 7: Results */}
        <h2 className="text-xl font-semibold mt-10 mb-4">
          {t("7. Results", "7. 实验结果")}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "GPipe was validated on two drastically different domains: image classification with AmoebaNet-D and language modeling with a Transformer-based LM.",
            "GPipe 在两个截然不同的领域进行了验证：使用 AmoebaNet-D 的图像分类和使用基于 Transformer 的语言模型。"
          )}
        </p>

        <div className="space-y-4 mb-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="font-semibold text-sm mb-2">{t("Image Classification", "图像分类")}</p>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>
                {t(
                  "AmoebaNet-D (557M parameters) trained on ImageNet at 480×480 resolution across 4 accelerators — impossible to fit on one.",
                  "AmoebaNet-D（5.57 亿参数）在 4 个加速器上以 480×480 分辨率在 ImageNet 上训练——单个设备无法容纳。"
                )}
              </li>
              <li>
                {t(
                  "Top-1 accuracy: 84.3% on ImageNet — state-of-the-art at the time.",
                  "Top-1 准确率：ImageNet 上 84.3%——当时的最先进水平。"
                )}
              </li>
              <li>
                {t(
                  "Scaled to 1.8B parameters with 8 accelerators.",
                  "使用 8 个加速器扩展至 18 亿参数。"
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="font-semibold text-sm mb-2">{t("Language Modeling", "语言模型")}</p>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>
                {t(
                  "Trained a Transformer LM with 83 billion parameters across 8 TPUs — roughly 10× the size of GPT-2 XL (1.5B), trained the same year.",
                  "在 8 个 TPU 上训练了一个拥有 830 亿参数的 Transformer 语言模型——大约是同年训练的 GPT-2 XL（15 亿参数）的 10 倍。"
                )}
              </li>
              <li>
                {t(
                  "Perplexity improved significantly with scale, validating that pipeline parallelism enables regimes otherwise inaccessible.",
                  "困惑度随规模显著改善，验证了流水线并行能够实现其他方法无法触及的模型规模。"
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="font-semibold text-sm mb-2">{t("Throughput Scaling", "吞吐量扩展")}</p>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>
                {t(
                  "Near-linear throughput scaling: doubling the number of devices approximately doubles throughput (for sufficiently large M).",
                  "近线性吞吐量扩展：设备数量翻倍时，吞吐量近似翻倍（对于足够大的 M）。"
                )}
              </li>
              <li>
                {t(
                  "Re-materialization overhead is approximately 25% extra compute — a small constant cost for dramatically reduced memory.",
                  "重计算开销约为 25% 的额外计算量——以小的固定成本换取显著降低的内存需求。"
                )}
              </li>
            </ul>
          </div>
        </div>

        <Collapsible
          title={t(
            "Comparison: data parallelism vs model parallelism vs pipeline parallelism",
            "对比：数据并行 vs 模型并行 vs 流水线并行"
          )}
        >
          <div className="overflow-x-auto">
            <table className="text-sm w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                    {t("Strategy", "策略")}
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                    {t("Works when model > one device?", "模型超出单设备时可行？")}
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                    {t("Device utilization", "设备利用率")}
                  </th>
                  <th className="text-left py-2 font-semibold text-gray-700 dark:text-gray-300">
                    {t("Communication", "通信")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-400">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4">{t("Data parallelism", "数据并行")}</td>
                  <td className="py-2 pr-4">{t("No", "否")}</td>
                  <td className="py-2 pr-4">{t("High (all active)", "高（全部活跃）")}</td>
                  <td className="py-2">{t("All-reduce gradients", "全规约梯度")}</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4">{t("Naive model parallelism", "朴素模型并行")}</td>
                  <td className="py-2 pr-4">{t("Yes", "是")}</td>
                  <td className="py-2 pr-4">{t("Low (≈1/K)", "低（≈1/K）")}</td>
                  <td className="py-2">{t("Point-to-point activations", "点对点激活值")}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">{t("GPipe (pipeline)", "GPipe（流水线）")}</td>
                  <td className="py-2 pr-4">{t("Yes", "是")}</td>
                  <td className="py-2 pr-4">{t("High (M/(M+K−1))", "高（M/(M+K−1)）")}</td>
                  <td className="py-2">{t("Point-to-point activations", "点对点激活值")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Collapsible>

        {/* Section 8: Modern Relevance */}
        <h2 className="text-xl font-semibold mt-10 mb-4">
          {t(
            "8. Modern Relevance: Tensor and Pipeline Parallelism in Megatron-LM",
            "8. 现代意义：Megatron-LM 中的张量并行与流水线并行"
          )}
        </h2>
        <p className="mb-4 leading-relaxed">
          {t(
            "GPipe's pipeline parallelism is now one of three standard parallelism axes used in large-scale LLM training. Megatron-LM (NVIDIA, 2021+) combines all three simultaneously:",
            "GPipe 的流水线并行现已成为大规模 LLM 训练中三种标准并行轴之一。Megatron-LM（NVIDIA，2021 年起）同时结合了三者："
          )}
        </p>

        <div className="space-y-3 mb-6">
          <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-4">
            <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
              {t("Tensor Parallelism (TP)", "张量并行（TP）")}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t(
                "Splits individual weight matrices across devices within a single layer. For a linear layer W ∈ ℝ^{d×d}, split into column-parallel and row-parallel shards. Requires all-reduce communication within each layer. Typically used within a node (fast NVLink).",
                "在单个层内跨设备分割各个权重矩阵。对于线性层 W ∈ ℝ^{d×d}，分割为列并行和行并行分片。每层内需要全规约通信。通常在节点内使用（快速 NVLink）。"
              )}
            </p>
          </div>
          <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-4">
            <p className="font-semibold text-sm text-green-900 dark:text-green-100 mb-1">
              {t("Pipeline Parallelism (PP) — GPipe-style", "流水线并行（PP）——GPipe 风格")}
            </p>
            <p className="text-sm text-green-800 dark:text-green-200">
              {t(
                "Splits layers across nodes. Only boundary activation tensors are communicated (much less bandwidth than all-reduce). Used across nodes (slower InfiniBand). Megatron adds \"interleaved scheduling\" which reduces the bubble further by splitting each stage into non-contiguous layer chunks.",
                "跨节点分割层。只通信边界激活张量（比全规约需要少得多的带宽）。跨节点使用（较慢的 InfiniBand）。Megatron 增加了」交错调度「，通过将每个阶段分成不连续的层块进一步减少气泡。"
              )}
            </p>
          </div>
          <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950 p-4">
            <p className="font-semibold text-sm text-purple-900 dark:text-purple-100 mb-1">
              {t("Data Parallelism (DP)", "数据并行（DP）")}
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              {t(
                "Outer loop: replicate the full (TP+PP) model across data-parallel groups, each processing different data. Gradients are all-reduced across DP groups. ZeRO (DeepSpeed) further shards optimizer states, gradients, and parameters across DP ranks.",
                "外层循环：在数据并行组之间复制完整的（TP+PP）模型，每组处理不同的数据。梯度在 DP 组间全规约。ZeRO（DeepSpeed）进一步在 DP rank 之间分片优化器状态、梯度和参数。"
              )}
            </p>
          </div>
        </div>

        <p className="mb-4 leading-relaxed">
          {t(
            "A typical configuration for training a 175B parameter model might be: TP=8 (within node, 8 GPUs), PP=8 (across 8 nodes), DP=64 (64 copies of the TP+PP group). Total: 8 × 8 × 64 = 4096 GPUs. GPipe's micro-batch pipeline schedule is the direct ancestor of the PP dimension here.",
            "训练 1750 亿参数模型的典型配置可能是：TP=8（节点内，8 个 GPU），PP=8（跨 8 个节点），DP=64（TP+PP 组的 64 个副本）。总计：8 × 8 × 64 = 4096 个 GPU。GPipe 的微批次流水线调度是这里 PP 维度的直接前身。"
          )}
        </p>

        <Collapsible
          title={t(
            "What is Megatron's interleaved pipeline schedule?",
            "Megatron 的交错流水线调度是什么？"
          )}
        >
          <p className="text-sm leading-relaxed mb-3">
            {t(
              "Standard GPipe assigns K contiguous layer chunks to K devices. Megatron's interleaved schedule assigns V non-contiguous \"virtual stages\" per device. For example, with 4 devices and V=2 virtual stages, device 1 handles layers 1–4 and layers 9–12, device 2 handles layers 5–8 and layers 13–16, etc. Each micro-batch now goes through 2K pipeline stages instead of K.",
              "标准 GPipe 将 K 个连续层块分配给 K 个设备。Megatron 的交错调度为每个设备分配 V 个不连续的」虚拟阶段「。例如，4 个设备、V=2 个虚拟阶段时，设备 1 处理第 1-4 层和第 9-12 层，设备 2 处理第 5-8 层和第 13-16 层，以此类推。每个微批次现在通过 2K 个流水线阶段而不是 K 个。"
            )}
          </p>
          <p className="text-sm leading-relaxed mb-3">
            {t(
              "This reduces the bubble fraction from (K−1)/(M+K−1) to (K−1)/(M·V+K−1), which is V times smaller. The trade-off: V times more pipeline communication (boundary activations now cross device boundaries V times per layer group instead of once).",
              "这将气泡比例从 (K−1)/(M+K−1) 降至 (K−1)/(M·V+K−1)，减小了 V 倍。代价是 V 倍更多的流水线通信（边界激活值现在每层组跨越设备边界 V 次而不是一次）。"
            )}
          </p>
        </Collapsible>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {t("← Back to Papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
