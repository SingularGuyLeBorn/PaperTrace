"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function ScalingLawsPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Scaling Laws for Neural Language Models",
            "神经语言模型的规模化定律"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-gray-400">
          Kaplan, McCandlish, Henighan et al. &middot; OpenAI 2020 &middot;{" "}
          <a
            href="https://arxiv.org/abs/2001.08361"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            arXiv 2001.08361
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10 dark:bg-blue-950/40 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Language model loss follows smooth power laws in model size (N), dataset size (D), and compute (C) — each independently, over many orders of magnitude. This means you can predict how much better a model will be before training it. The key insight: given a fixed compute budget, you should scale model size faster than dataset size. This paper directly motivated GPT-3 and inaugurated the LLM scaling era.",
              "语言模型的损失在模型规模（N）、数据集大小（D）和计算量（C）上都遵循平滑的幂律关系 — 各自独立，跨越多个数量级。这意味着你可以在训练之前预测模型会提升多少。核心洞察：在固定的计算预算下，你应该比扩大数据集更快地扩大模型规模。这篇论文直接推动了 GPT-3 的诞生，开启了大语言模型规模化时代。"
            )}
          </p>
        </section>

        {/* Section 1: Why Scale? */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("1. Why Does Scaling Matter?", "1. 为什么规模化如此重要？")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Before this paper, practitioners had to run expensive experiments to figure out whether making a model bigger would help. The conventional wisdom was vague: bigger is often better, but by how much? And where should you invest — more parameters, more data, or longer training?",
              "在这篇论文之前，从业者必须运行昂贵的实验才能弄清楚让模型更大是否会有帮助。传统智慧很模糊：更大通常更好，但好多少？你应该投资在哪里——更多参数、更多数据，还是更长的训练？"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Kaplan et al. ran hundreds of language model training runs across a vast range of model sizes (768 parameters to 1.5 billion), dataset sizes, and compute budgets. They found something remarkable: performance doesn't improve randomly or chaotically — it follows precise mathematical laws.",
              "Kaplan 等人在跨越广泛范围的模型大小（768 个参数到 15 亿）、数据集大小和计算预算上运行了数百次语言模型训练。他们发现了一件了不起的事：性能不是随机或混乱地提升的——它遵循精确的数学规律。"
            )}
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-amber-950/40 dark:border-amber-800">
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed mb-0">
              <span className="font-semibold">{t("Key insight: ", "核心洞察：")}</span>
              {t(
                "Loss (cross-entropy, in nats) behaves like a power law in N, D, and C separately. Power laws are straight lines on a log-log plot. This predictability is what makes scaling laws so powerful — and so actionable.",
                "损失（交叉熵，以 nats 为单位）在 N、D 和 C 上分别表现为幂律关系。幂律在对数-对数图上是直线。这种可预测性正是规模化定律如此强大——且如此可操作的原因。"
              )}
            </p>
          </div>
        </section>

        {/* Section 2: The Three Power Laws */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("2. The Three Power Laws", "2. 三条幂律")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t(
              "The paper identifies three fundamental scaling laws — one for each of the three ways you can invest resources in training a language model.",
              "论文确定了三条基本的规模化定律——分别对应你在训练语言模型时可以投入资源的三种方式。"
            )}
          </p>

          {/* 2a: Parameters */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {t("2a. Loss vs. Parameters (N)", "2a. 损失与参数数量（N）")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "When you train with unlimited data (so data is never the bottleneck), loss follows:",
                "当你用无限数据训练时（数据永远不是瓶颈），损失遵循："
              )}
            </p>
            <Math display tex={"L(N) = \\left(\\frac{N_c}{N}\\right)^{\\alpha_N}"} />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3 mb-3">
              {t(
                "where the exponent α_N ≈ 0.076 and N_c is a fitted constant. This is a small exponent — every 10× increase in parameters only reduces loss by a factor of 10^{0.076} ≈ 1.19. Progress is real but gradual.",
                "其中指数 α_N ≈ 0.076，N_c 是拟合常数。这是一个很小的指数——每增加 10 倍参数，损失只减少 10^{0.076} ≈ 1.19 倍。进步是真实的，但是渐进的。"
              )}
            </p>
            <Collapsible
              title={t("What does α_N ≈ 0.076 mean intuitively?", "α_N ≈ 0.076 直觉上意味着什么？")}
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {t(
                  "Think of it this way: to cut your loss in half purely by adding parameters, you'd need to multiply N by 2^{1/0.076} ≈ 2^{13} ≈ 8,192×. That's going from a 1B parameter model to an 8,000B parameter model for a 2× loss improvement. The returns are consistent but slow.",
                  "这样想：仅靠增加参数将损失减半，你需要将 N 乘以 2^{1/0.076} ≈ 2^{13} ≈ 8,192 倍。即从 10 亿参数模型扩展到 8 万亿参数模型才能实现 2 倍的损失改善。收益是稳定的，但很缓慢。"
                )}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t(
                  "The power law holds across six orders of magnitude in N — from thousands to billions of parameters. This is the surprise: a single clean equation describes all of it.",
                  "这条幂律在 N 的六个数量级范围内成立——从数千到数十亿个参数。这才是令人惊讶之处：一个简洁的方程描述了所有这些。"
                )}
              </p>
            </Collapsible>
          </div>

          {/* 2b: Dataset */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {t("2b. Loss vs. Dataset Size (D)", "2b. 损失与数据集大小（D）")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "When you train with an unlimited model (so capacity is never the bottleneck), loss follows:",
                "当你用无限容量的模型训练时（容量永远不是瓶颈），损失遵循："
              )}
            </p>
            <Math display tex={"L(D) = \\left(\\frac{D_c}{D}\\right)^{\\alpha_D}"} />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              {t(
                "where α_D ≈ 0.095. The dataset exponent is slightly larger than the parameter exponent (0.095 vs 0.076), meaning more data gives marginally more benefit per doubling than more parameters — but only marginally.",
                "其中 α_D ≈ 0.095。数据集指数略大于参数指数（0.095 vs 0.076），意味着每翻倍数据比每翻倍参数带来的收益略多——但只是略多。"
              )}
            </p>
          </div>

          {/* 2c: Compute */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {t("2c. Loss vs. Compute Budget (C)", "2c. 损失与计算预算（C）")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "When you optimize the training run for a fixed compute budget (choosing the best N and D), loss follows:",
                "当你针对固定计算预算优化训练（选择最优 N 和 D）时，损失遵循："
              )}
            </p>
            <Math display tex={"L(C_{\\min}) = \\left(\\frac{C_c^{\\min}}{C_{\\min}}\\right)^{\\alpha_C^{\\min}}"} />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              {t(
                "where α_C ≈ 0.050. This is the smallest exponent, meaning compute is the hardest axis to gain from. But compute is also the axis you can always increase — you just need more GPUs and more time. This law is what made the paper so actionable for practitioners.",
                "其中 α_C ≈ 0.050。这是最小的指数，意味着从计算轴获益最难。但计算也是你始终可以增加的轴——你只需要更多 GPU 和更多时间。这条定律使论文对从业者如此可操作。"
              )}
            </p>
          </div>

          {/* Combined law */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {t("2d. The Combined Law: L(N, D)", "2d. 联合定律：L(N, D)")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "When both N and D are finite (the realistic case), both effects combine. The paper fits a unified formula:",
                "当 N 和 D 都有限（现实情况）时，两种效应叠加。论文拟合了一个统一公式："
              )}
            </p>
            <Math display tex={"L(N, D) = \\left[\\left(\\frac{N_0}{N}\\right)^{\\alpha_N / \\alpha_D} + \\frac{D_0}{D}\\right]^{\\alpha_D}"} />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              {t(
                "This formula captures the key competition: as N grows, the first term shrinks. As D grows, the second term shrinks. Whichever term is larger dominates the loss. This is why undertrained large models can be beaten by well-trained smaller ones — the data term is too large.",
                "这个公式捕捉了关键竞争：随着 N 增大，第一项缩小；随着 D 增大，第二项缩小。哪项更大，哪项就主导损失。这就是为什么训练不足的大模型可以被训练充分的小模型击败——数据项太大了。"
              )}
            </p>
          </div>
        </section>

        {/* Section 3: Compute-Optimal Training */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("3. Compute-Optimal Training", "3. 计算最优训练")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Given a fixed compute budget C (measured in FLOPs), how should you divide it between model size N and training tokens D? First, recall the cost approximation:",
              "给定固定的计算预算 C（以 FLOP 衡量），你应该如何在模型大小 N 和训练 token 数 D 之间分配？首先，回忆一下计算量近似公式："
            )}
          </p>
          <Math display tex={"C \\approx 6ND"} />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3 mb-4">
            {t(
              "The factor of 6 comes from: 2 FLOPs per multiply-add, × 3 for forward + backward pass. So for a 1B parameter model trained on 300B tokens: C ≈ 6 × 10^9 × 3×10^{11} = 1.8×10^{21} FLOPs.",
              "因子 6 来自：每次乘加 2 FLOP × 3（前向 + 反向传播）。因此对于在 3000 亿 token 上训练的 10 亿参数模型：C ≈ 6 × 10^9 × 3×10^{11} = 1.8×10^{21} FLOP。"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "By minimizing L(N,D) subject to C = 6ND, Kaplan et al. derived the optimal allocation:",
              "通过在 C = 6ND 约束下最小化 L(N,D)，Kaplan 等人推导出最优分配："
            )}
          </p>
          <Math display tex={"N_{\\text{opt}} \\propto C^{0.73}, \\quad D_{\\text{opt}} \\propto C^{0.27}"} />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3 mb-4">
            {t(
              "The exponents sum to 1.0 (since C ∝ N·D). The key ratio: N grows much faster than D as compute scales. For every 10× increase in compute, optimal N should grow by 10^{0.73} ≈ 5.4×, while D grows only 10^{0.27} ≈ 1.9×.",
              "指数之和为 1.0（因为 C ∝ N·D）。关键比率：随着计算量扩展，N 的增长远快于 D。每增加 10 倍计算量，最优 N 应增长 10^{0.73} ≈ 5.4 倍，而 D 只增长 10^{0.27} ≈ 1.9 倍。"
            )}
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-950/40 dark:border-green-800">
            <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed mb-0">
              <span className="font-semibold">{t("Practical implication: ", "实际意义：")}</span>
              {t(
                "The Kaplan et al. finding says: spend most of your extra compute on bigger models, not more data. This is what motivated training GPT-3 (175B parameters) on \"only\" 300B tokens — by the scaling laws, that was roughly compute-optimal given their budget.",
                "Kaplan 等人的发现说：将大部分额外计算花在更大的模型上，而不是更多数据上。这正是推动在「仅」3000 亿 token 上训练 GPT-3（1750 亿参数）的原因——根据规模化定律，在他们的预算下，这大致是计算最优的。"
              )}
            </p>
          </div>
        </section>

        {/* Section 4: Sample Efficiency */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("4. Sample Efficiency: Bigger Models Learn More Per Token", "4. 样本效率：更大的模型每个 Token 学到更多")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "One of the most counterintuitive findings: larger models are more sample-efficient. They reach the same loss level with fewer training tokens.",
              "最违反直觉的发现之一：更大的模型具有更高的样本效率。它们用更少的训练 token 达到相同的损失水平。"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Why? Because a larger model has more capacity to extract structure from each example. A small model might need to see the same pattern thousands of times before it reliably captures it. A large model may get it right in dozens of exposures.",
              "为什么？因为更大的模型有更多容量从每个样本中提取结构。小模型可能需要看到同一模式数千次才能可靠地捕捉它。大模型可能只需要几十次暴露就能掌握。"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "This also connects to convergence behavior: smaller models converge faster in wall-clock time (fewer parameters to update) but plateau at higher loss. Larger models take longer to converge but end up at much lower loss. If you stop early, a smaller model might look better — but that's an artifact of not training long enough.",
              "这也与收敛行为有关：小模型在实际时间上收敛更快（需要更新的参数更少），但在更高损失处趋于平稳。大模型需要更长时间才能收敛，但最终达到的损失要低得多。如果提前停止，小模型可能看起来更好——但那只是训练时间不够长的假象。"
            )}
          </p>
          <Collapsible title={t("What didn't scale? Model shape, LR, batch size", "什么没有规模化？模型形状、学习率、批大小")}>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "The paper carefully controlled for many other variables and found they mattered much less than N, D, and C:",
                "论文仔细控制了许多其他变量，发现它们比 N、D 和 C 重要得多："
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <li>
                <span className="font-medium">{t("Model shape (depth vs. width): ", "模型形状（深度 vs. 宽度）：")}</span>
                {t(
                  "For a fixed N, the aspect ratio (number of layers vs. hidden size) barely matters. A very deep narrow model and a shallow wide model perform similarly. Only extreme shapes hurt.",
                  "对于固定的 N，长宽比（层数 vs. 隐藏大小）几乎无关紧要。极深极窄的模型和极浅极宽的模型表现相似。只有极端形状会有损失。"
                )}
              </li>
              <li>
                <span className="font-medium">{t("Learning rate: ", "学习率：")}</span>
                {t(
                  "Performance is robust to learning rate over a wide range, as long as it's not too large or too small. The optimal LR is roughly proportional to 1/√N.",
                  "只要不是太大或太小，性能对学习率在很大范围内是稳健的。最优学习率大致与 1/√N 成正比。"
                )}
              </li>
              <li>
                <span className="font-medium">{t("Batch size: ", "批大小：")}</span>
                {t(
                  "The critical batch size (above which you get diminishing returns per gradient step) scales with loss: B_crit ∝ L^{-4.8}. Larger batches are more compute-efficient but less sample-efficient.",
                  "临界批大小（超过此大小后每个梯度步骤的回报递减）随损失扩展：B_crit ∝ L^{-4.8}。更大的批次计算效率更高，但样本效率更低。"
                )}
              </li>
            </ul>
          </Collapsible>
        </section>

        {/* Section 5: Worked Example */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("5. Worked Example: Doubling Your Compute Budget", "5. 实例演算：计算预算翻倍怎么办？")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Let's make this concrete. Suppose you currently run 1× compute (say, 10^{22} FLOPs, roughly a mid-sized LLM training run). Now you get access to 2× that compute. How should you allocate it?",
              "让我们具体化。假设你当前运行 1× 计算量（比如 10^{22} FLOP，大致是一次中等规模 LLM 训练）。现在你获得了 2 倍的计算量。你应该如何分配？"
            )}
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 dark:bg-gray-800/50 dark:border-gray-700 mb-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t("Applying N_opt ∝ C^{0.73}, D_opt ∝ C^{0.27}:", "应用 N_opt ∝ C^{0.73}, D_opt ∝ C^{0.27}：")}
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>
                {t(
                  "Scale N by: 2^{0.73} ≈ 1.66× (e.g., go from 7B → 11.6B parameters)",
                  "N 扩大：2^{0.73} ≈ 1.66 倍（例如，从 70 亿→116 亿参数）"
                )}
              </li>
              <li>
                {t(
                  "Scale D by: 2^{0.27} ≈ 1.21× (e.g., go from 200B → 242B tokens)",
                  "D 扩大：2^{0.27} ≈ 1.21 倍（例如，从 2000 亿→2420 亿 token）"
                )}
              </li>
              <li className="font-medium text-green-700 dark:text-green-400">
                {t(
                  "Check: (1.66 × 1.21) ≈ 2.0 ✓ — budget is fully used",
                  "验证：(1.66 × 1.21) ≈ 2.0 ✓ — 预算全部用掉"
                )}
              </li>
            </ul>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The wrong answer (and what many teams did before this paper): split the compute evenly — 1.41× more parameters, 1.41× more data. That misallocates compute. You'd be underusing your extra model capacity by giving it insufficient extra data, or vice versa.",
              "错误的答案（也是许多团队在这篇论文之前做的）：平均分配计算量——1.41 倍更多参数，1.41 倍更多数据。那是对计算量的错误分配。你要么给更大的模型提供了不够的额外数据，或者反过来。"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t(
              "For a $1M compute budget (roughly 10^{22}–10^{23} FLOPs at 2020 prices), these laws say: spend it almost entirely on a bigger model with a modest data increase, not an equal split. The model is the cheaper investment per unit of loss reduction.",
              "对于 100 万美元的计算预算（按 2020 年价格大约 10^{22}–10^{23} FLOP），这些定律表明：几乎全部花在更大的模型上，只适度增加数据，而不是平均分配。在每单位损失减少方面，模型是更便宜的投资。"
            )}
          </p>
        </section>

        {/* Section 6: Chinchilla's Correction */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("6. Chinchilla's Correction (2022)", "6. Chinchilla 的修正（2022）")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Two years later, Hoffmann et al. at DeepMind published \"Training Compute-Optimal Large Language Models\" (the Chinchilla paper), which revisited Kaplan's optimal allocation using a different methodology — and got a substantially different answer.",
              "两年后，DeepMind 的 Hoffmann 等人发表了《训练计算最优大型语言模型》（Chinchilla 论文），使用不同的方法重新审视了 Kaplan 的最优分配——并得出了实质性不同的答案。"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Chinchilla's finding: the optimal allocation is approximately equal scaling — N and D should grow at the same rate. More precisely:",
              "Chinchilla 的发现：最优分配大约是等比例扩展——N 和 D 应该以相同速率增长。更精确地说："
            )}
          </p>
          <Math display tex={"N_{\\text{opt}} \\approx \\frac{D_{\\text{opt}}}{20}, \\quad \\text{i.e.,} \\quad D \\approx 20 \\cdot N"} />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3 mb-4">
            {t(
              "This rule of thumb — 20 tokens per parameter — became the dominant heuristic. Chinchilla itself (70B parameters) was trained on 1.4T tokens (= 20 × 70B) and outperformed Gopher (280B) trained on only 300B tokens.",
              "这条经验法则——每个参数 20 个 token——成为主流启发式规则。Chinchilla 本身（700 亿参数）在 1.4T token（= 20 × 700 亿）上训练，超过了仅在 3000 亿 token 上训练的 Gopher（2800 亿参数）。"
            )}
          </p>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 dark:bg-rose-950/40 dark:border-rose-800 mb-4">
            <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed mb-0">
              <span className="font-semibold">{t("What changed? ", "什么变了？")}</span>
              {t(
                "Kaplan's runs used a learning rate schedule that didn't fully decay — models were slightly undertrained. This biased the exponents. Chinchilla used IsoFLOP curves (fixing C and varying N/D at constant C), which gave a cleaner estimate. The qualitative message is the same — scaling laws hold — but the optimal split shifted toward more data.",
                "Kaplan 的训练没有完全衰减学习率——模型训练略微不足。这使指数产生了偏差。Chinchilla 使用了 IsoFLOP 曲线（固定 C，在常数 C 下变化 N/D），得到了更清晰的估计。定性信息是相同的——规模化定律成立——但最优分配向更多数据偏移了。"
              )}
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t(
              "Today, most frontier labs use roughly the Chinchilla ratio or beyond. Llama 3 (8B) was trained on 15T tokens — nearly 2,000 tokens per parameter, far beyond both recipes, because inference efficiency favors smaller, longer-trained models.",
              "如今，大多数前沿实验室使用的大约是 Chinchilla 比例或更多。Llama 3（80 亿参数）在 15T token 上训练——每个参数接近 2000 个 token，远超两种方案，因为推理效率更倾向于更小、训练时间更长的模型。"
            )}
          </p>
        </section>

        {/* Section 7: Why This Matters */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("7. Why This Paper Changed Everything", "7. 为什么这篇论文改变了一切")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Before scaling laws, building large models felt like exploration in the dark. Each new model was an expensive bet — nobody could reliably predict if going bigger would help or by how much.",
              "在规模化定律之前，构建大型模型感觉像是在黑暗中探索。每个新模型都是一次昂贵的赌注——没有人能可靠地预测扩大规模是否会有帮助，或者能帮助多少。"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "After this paper, scaling became an engineering discipline. You could:",
              "在这篇论文之后，规模化成为一门工程学科。你可以："
            )}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>
              {t(
                "Run small experiments and extrapolate to predict large model performance",
                "运行小型实验并外推以预测大型模型的性能"
              )}
            </li>
            <li>
              {t(
                "Plan your compute budget before training — know roughly what loss you'll hit",
                "在训练前规划你的计算预算——大致知道你会达到什么损失"
              )}
            </li>
            <li>
              {t(
                "Justify building GPT-3 (175B) with a quantitative argument, not just intuition",
                "用定量论据而不仅仅是直觉来证明构建 GPT-3（1750 亿）的合理性"
              )}
            </li>
            <li>
              {t(
                "Understand the 'compute frontier': what's the best model achievable for a given budget?",
                "理解「计算前沿」：在给定预算下可以达到的最佳模型是什么？"
              )}
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The broader intellectual impact: scaling laws suggested that intelligence might be more predictable and more continuous than previously believed. There's no sharp threshold where models become capable — just steady improvement along smooth power laws. This view, sometimes called the 'smooth scaling hypothesis', drove the bet that GPT-3, GPT-4, and their successors would keep getting better.",
              "更广泛的思想影响：规模化定律表明，智能可能比以前认为的更可预测、更连续。模型变得有能力没有明显的阈值——只是沿着平滑的幂律稳步改善。这种观点，有时称为「平滑规模化假说」，推动了 GPT-3、GPT-4 及其继承者将持续变得更好的押注。"
            )}
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 dark:bg-purple-950/40 dark:border-purple-800">
            <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed mb-0">
              <span className="font-semibold">{t("The compute frontier: ", "计算前沿：")}</span>
              {t(
                "Every point on the curve L(C_min) represents the best possible loss for a given compute budget. Models trained below this frontier are suboptimal — they're either too small (undertrained) or too data-limited. The frontier has been pushed down consistently for five years, and scaling laws let you project where it'll be next.",
                "曲线 L(C_min) 上的每个点代表给定计算预算下可能的最佳损失。在此前沿以下训练的模型是次优的——它们要么太小（训练不足），要么数据有限。五年来这条前沿一直在被推低，规模化定律让你能预测它下一步会在哪里。"
              )}
            </p>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("Quick Reference: The Key Numbers", "速查：关键数值")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-800 dark:text-gray-200">
                    {t("Law", "定律")}
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-800 dark:text-gray-200">
                    {t("Formula", "公式")}
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-800 dark:text-gray-200">
                    {t("Exponent", "指数")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    {t("Parameters", "参数量")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-gray-700 dark:text-gray-300">
                    L(N) ∝ N^{-α_N}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    α_N ≈ 0.076
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    {t("Dataset size", "数据集大小")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-gray-700 dark:text-gray-300">
                    L(D) ∝ D^{-α_D}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    α_D ≈ 0.095
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    {t("Compute", "计算量")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-gray-700 dark:text-gray-300">
                    L(C) ∝ C^{-α_C}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    α_C ≈ 0.050
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    {t("Optimal N", "最优参数量")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-gray-700 dark:text-gray-300">
                    N_opt ∝ C^{0.73}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    {t("(Kaplan)", "（Kaplan）")}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    {t("Optimal D", "最优数据量")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-gray-700 dark:text-gray-300">
                    D_opt ∝ C^{0.27}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    {t("(Kaplan)", "（Kaplan）")}
                  </td>
                </tr>
                <tr className="bg-blue-50 dark:bg-blue-950/40">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    {t("Chinchilla rule", "Chinchilla 规则")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-gray-700 dark:text-gray-300">
                    D ≈ 20·N
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                    {t("(Hoffmann 2022)", "（Hoffmann 2022）")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Further Reading */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("Further Reading", "延伸阅读")}
          </h2>
          <ul className="space-y-3">
            <li>
              <a
                href="https://arxiv.org/abs/2001.08361"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
              >
                {t(
                  "Kaplan et al. (2020) — Scaling Laws for Neural Language Models",
                  "Kaplan 等人（2020）— 神经语言模型的规模化定律"
                )}
              </a>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/2203.15556"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
              >
                {t(
                  "Hoffmann et al. (2022) — Training Compute-Optimal LLMs (Chinchilla)",
                  "Hoffmann 等人（2022）— 训练计算最优大语言模型（Chinchilla）"
                )}
              </a>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/2005.14165"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
              >
                {t(
                  "Brown et al. (2020) — GPT-3: Language Models are Few-Shot Learners",
                  "Brown 等人（2020）— GPT-3：语言模型是少样本学习者"
                )}
              </a>
            </li>
          </ul>
        </section>
      </article>

      {/* Back link */}
      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href={`${basePath}/papers`}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          {t("← Back to Papers", "← 返回论文列表")}
        </Link>
      </div>
    </div>
  );
}
