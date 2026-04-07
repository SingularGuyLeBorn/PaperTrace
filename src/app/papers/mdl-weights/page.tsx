"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function MDLWeightsPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Keeping Neural Networks Simple by Minimizing the Description Length of the Weights",
            "通过最小化权重描述长度保持神经网络简洁"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-paper-200/50">
          Hinton &amp; van Camp &middot; COLT 1993 &middot;{" "}
          <a
            href="https://www.cs.toronto.edu/~hinton/absps/colt93.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Toronto PDF
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ===== TL;DR ===== */}
        <section className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Hinton and van Camp propose training neural networks by minimizing the total description length of the weights plus the data given the weights. This is Occam's Razor formalized as information theory. Adding Gaussian noise to weights during training forces the network to encode weights cheaply — penalizing large, precise weights in favor of small, uncertain ones. This 1993 paper secretly derives weight decay, dropout, KL regularization, and variational inference for neural networks — three decades before they became mainstream.",
              "Hinton 和 van Camp 提出通过最小化权重的总描述长度加上给定权重下的数据描述长度来训练神经网络。这是奥卡姆剃刀原理的信息论形式化。在训练中向权重添加高斯噪声，迫使网络以更低成本编码权重，从而惩罚大而精确的权重，偏向小而不确定的权重。这篇 1993 年的论文秘密推导了权重衰减、dropout、KL 正则化和神经网络变分推断 — 比它们成为主流早了三十年。"
            )}
          </p>
        </section>

        {/* ===== Section 1: Occam's Razor as Information Theory ===== */}
        <h2>{t("1. Occam's Razor as Information Theory", "1. 奥卡姆剃刀的信息论诠释")}</h2>

        <p>
          {t(
            "Occam's Razor says: prefer simpler explanations. But \"simpler\" is vague. Information theory makes it precise. If you need to communicate a model and the residual errors to a receiver, the best model is the one that minimizes the total number of bits sent.",
            "奥卡姆剃刀说：倾向于更简单的解释。但「更简单」是模糊的。信息论使其精确化。如果你需要向接收方传达一个模型和残差误差，最好的模型是使发送的总比特数最小化的那个。"
          )}
        </p>

        <p>
          {t(
            "This framing — model selection as communication cost — is the Minimum Description Length (MDL) principle, developed by Rissanen and Kolmogorov. Hinton and van Camp apply it directly to neural network weights.",
            "这种框架 — 将模型选择视为通信成本 — 就是最小描述长度 (MDL) 原理，由 Rissanen 和 Kolmogorov 发展。Hinton 和 van Camp 将其直接应用于神经网络权重。"
          )}
        </p>

        <Collapsible title={t("Why is this Occam's Razor?", "为什么这就是奥卡姆剃刀？")} defaultOpen>
          <p>
            {t(
              "Imagine two models: Model A fits the training data perfectly but needs 1000 bits to describe its weights. Model B fits the data almost as well but only needs 50 bits for weights (plus a few more for the errors). MDL says Model B is better — it has found a more compact explanation of the data. Complex models that memorize noise need many bits to store every wiggle; simple models that capture true structure need few.",
              "想象两个模型：模型 A 完美拟合训练数据，但需要 1000 比特来描述其权重。模型 B 拟合效果几乎一样好，但只需要 50 比特描述权重（加上少量误差比特）。MDL 说模型 B 更好 — 它找到了更紧凑的数据解释。记忆噪声的复杂模型需要许多比特来存储每一个抖动；捕捉真实结构的简单模型需要的比特很少。"
            )}
          </p>
        </Collapsible>

        {/* ===== Section 2: The MDL Principle ===== */}
        <h2>{t("2. The MDL Principle", "2. 最小描述长度原理")}</h2>

        <p>
          {t(
            "Formally, given weights w and dataset D, we want to minimize:",
            "形式上，给定权重 w 和数据集 D，我们希望最小化："
          )}
        </p>

        <Math
          display
          label={t("MDL objective", "MDL 目标")}
          tex="\min_w \;\Big[ L(w) + L(D \mid w) \Big]"
        />

        <p>
          {t(
            "where:",
            "其中："
          )}
        </p>

        <div className="ml-4 space-y-2 text-sm">
          <div className="flex gap-3">
            <Math tex="L(w)" />
            <span>{t("— the number of bits needed to describe the weights", "— 描述权重所需的比特数")}</span>
          </div>
          <div className="flex gap-3">
            <Math tex="L(D \mid w)" />
            <span>{t("— the number of bits needed to describe the data given those weights (i.e., the errors)", "— 给定这些权重描述数据所需的比特数（即误差）")}</span>
          </div>
        </div>

        <p>
          {t(
            "This is the two-part MDL code: first send the model, then send the data compressed with that model. The total cost trades off model complexity against goodness of fit.",
            "这是两部分 MDL 编码：先发送模型，再用该模型压缩数据后发送。总成本在模型复杂度与拟合优度之间权衡。"
          )}
        </p>

        <Collapsible title={t("Connection to negative log-likelihood", "与负对数似然的联系")}>
          <p>
            {t(
              "By Shannon's theorem, the optimal number of bits to encode an outcome with probability p is -log₂(p). So the description length of the data given a probabilistic model is just the negative log-likelihood:",
              "根据香农定理，编码概率为 p 的结果所需的最优比特数为 -log₂(p)。因此，给定概率模型的数据描述长度就是负对数似然："
            )}
          </p>
          <Math
            display
            tex="L(D \mid w) = -\log p(D \mid w)"
          />
          <p>
            {t(
              "Minimizing description length of the data is exactly minimizing the negative log-likelihood — the standard training objective.",
              "最小化数据的描述长度恰好等于最小化负对数似然 — 这就是标准训练目标。"
            )}
          </p>
        </Collapsible>

        {/* ===== Section 3: Applying MDL to Neural Weights ===== */}
        <h2>{t("3. Applying MDL to Neural Weights", "3. 将 MDL 应用于神经网络权重")}</h2>

        <p>
          {t(
            "How do you encode a real-valued weight w on a finite grid? If you transmit w to precision σ (i.e., you round to the nearest multiple of σ), then the number of bits needed is approximately:",
            "如何在有限网格上编码实值权重 w？如果你以精度 σ 传输 w（即舍入到最近的 σ 的倍数），则所需的比特数约为："
          )}
        </p>

        <Math
          display
          label={t("Encoding cost of one weight", "单个权重的编码成本")}
          tex="L(w_i) \approx \log_2\!\left(\frac{|w_i|}{\sigma} + 1\right) \text{ bits}"
        />

        <p>
          {t(
            "This makes intuitive sense: a weight of 0.001 with noise σ = 0.01 essentially encodes as zero — nearly free. A weight of 100 with σ = 0.01 needs many bits. The noise level σ determines the precision, and precision costs bits.",
            "这很直观：噪声 σ = 0.01 的权重 0.001 基本上编码为零 — 几乎免费。噪声 σ = 0.01 的权重 100 需要很多比特。噪声水平 σ 决定精度，精度花费比特。"
          )}
        </p>

        <p>
          {t(
            "The key move: Hinton and van Camp propose adding Gaussian noise ε ~ N(0, σ²) to each weight during the forward pass. This has two effects:",
            "关键操作：Hinton 和 van Camp 提议在前向传播时向每个权重添加高斯噪声 ε ~ N(0, σ²)。这有两个效果："
          )}
        </p>

        <ul>
          <li>
            {t(
              "Noisy weights are cheaper to encode (you only need to encode them to the precision of σ)",
              "带噪声的权重更便宜编码（你只需以 σ 的精度编码它们）"
            )}
          </li>
          <li>
            {t(
              "Noisy weights hurt predictions — the network is forced to find weights that are both small and robust",
              "带噪声的权重会损害预测 — 网络被迫找到既小又鲁棒的权重"
            )}
          </li>
        </ul>

        <Collapsible title={t("Why noise = cheapness?", "为什么噪声等于低成本？")}>
          <p>
            {t(
              "Think of encoding a dart throw. If your dart always lands within ±1mm of where you aimed, you need to describe your aim precisely. But if your dart scatters ±10cm, a receiver who knows the scatter distribution only needs to know your rough aim — the noise \"absorbs\" precision. The same logic applies to weights: a sender knows weight w, adds noise ε, sends the noisy weight ŵ = w + ε. The receiver, knowing the noise model, decodes w to within ±σ. No need to specify w beyond that precision.",
              "想象编码飞镖投掷。如果你的飞镖总是落在目标 ±1mm 以内，你需要精确描述你的瞄准。但如果飞镖散布 ±10cm，知道散布分布的接收方只需知道你的大致瞄准 — 噪声「吸收」了精度。同样的逻辑适用于权重：发送方知道权重 w，添加噪声 ε，发送带噪声的权重 ŵ = w + ε。接收方知道噪声模型，解码 w 到 ±σ 精度以内。无需指定超出该精度的 w。"
            )}
          </p>
        </Collapsible>

        {/* ===== Section 4: Weight Noise as Compression ===== */}
        <h2>{t("4. Weight Noise as Compression", "4. 权重噪声作为压缩")}</h2>

        <p>
          {t(
            "Formally, the noisy weight used in the forward pass is:",
            "形式上，前向传播中使用的带噪声权重为："
          )}
        </p>

        <Math
          display
          label={t("Noisy weight", "带噪声的权重")}
          tex="\tilde{w}_i = w_i + \varepsilon_i, \quad \varepsilon_i \sim \mathcal{N}(0,\, \sigma_i^2)"
        />

        <p>
          {t(
            "Both the mean w_i and the noise level σ_i are learned parameters. The total MDL training objective becomes:",
            "均值 w_i 和噪声水平 σ_i 都是可学习参数。总 MDL 训练目标变为："
          )}
        </p>

        <Math
          display
          label={t("MDL training objective", "MDL 训练目标")}
          tex="\mathcal{L} = \underbrace{-\mathbb{E}_{\varepsilon}\big[\log p(D \mid \tilde{w})\big]}_{\text{fit the data}} + \underbrace{\sum_i \log_2\!\left(\frac{|w_i|}{\sigma_i} + 1\right)}_{\text{cost of encoding weights}}"
        />

        <p>
          {t(
            "During training, the network simultaneously optimizes prediction quality and compression of the weights. A weight that can be set to zero (or driven small relative to σ) is essentially pruned for free.",
            "在训练期间，网络同时优化预测质量和权重压缩。可以设置为零（或相对于 σ 驱动为小值）的权重本质上是免费剪枝的。"
          )}
        </p>

        <Collapsible title={t("Per-weight vs shared noise level", "每权重 vs 共享噪声水平")}>
          <p>
            {t(
              "Hinton and van Camp consider learning a separate σ_i for each weight. This is strictly more expressive than a single global σ: some weights may be informative (small σ, high precision needed) while others are uninformative (large σ, can be ignored). This per-weight variability is exactly what variational inference captures 25 years later in Bayesian deep learning.",
              "Hinton 和 van Camp 考虑为每个权重学习单独的 σ_i。这严格比单个全局 σ 更具表达力：某些权重可能是信息性的（小 σ，需要高精度），而其他权重是非信息性的（大 σ，可以忽略）。这种每权重的可变性正是 25 年后贝叶斯深度学习中变分推断所捕捉的内容。"
            )}
          </p>
        </Collapsible>

        {/* ===== Section 5: The Bits-Back Argument ===== */}
        <h2>{t("5. The Bits-Back Argument", "5. 比特反还论证")}</h2>

        <p>
          {t(
            "Here is the deepest insight of the paper. Naive two-part coding — send weights, then send data — seems to require L(w) + L(D|w) bits. But if the weights have uncertainty (a posterior distribution q(w|D)), the sender can use that uncertainty to communicate for free.",
            "这是本文最深刻的洞见。朴素的两部分编码 — 发送权重，然后发送数据 — 似乎需要 L(w) + L(D|w) 比特。但如果权重具有不确定性（后验分布 q(w|D)），发送方可以利用该不确定性免费通信。"
          )}
        </p>

        <p>
          {t(
            "The \"bits-back\" trick: the sender samples a weight w from the posterior q(w|D) to encode the data. The choice of w implicitly communicates log q(w|D) bits of information — bits the receiver can \"read back\" for free. The actual description length is therefore:",
            "「比特反还」技巧：发送方从后验 q(w|D) 中采样权重 w 来编码数据。w 的选择隐式传达了 log q(w|D) 比特信息 — 接收方可以「免费读回」的比特。因此实际描述长度为："
          )}
        </p>

        <Math
          display
          label={t("Bits-back description length", "比特反还描述长度")}
          tex="\text{DL} = L(w) + L(D \mid w) - \underbrace{H\big(q(w \mid D)\big)}_{\text{bits got back}}"
        />

        <p>
          {t(
            "The entropy H(q(w|D)) represents how uncertain the weights are — the more uncertain, the more bits you get back for free. Minimizing this actual description length is exactly the variational free energy.",
            "熵 H(q(w|D)) 表示权重的不确定程度 — 越不确定，你免费得回的比特越多。最小化这个实际描述长度恰好就是变分自由能。"
          )}
        </p>

        <Collapsible title={t("Intuition: why do you get bits back?", "直觉：为什么能得到比特？")}>
          <p>
            {t(
              "Imagine you want to send a message M to a friend, but you also need to tell them which die you rolled to encode it. If the die has 6 sides, you're using log₂(6) ≈ 2.58 bits to specify the die roll. But your friend can use those same bits to communicate something back to you — the \"which die\" choice carries free information. The bits-back argument generalizes this: when you use a stochastic weight sample to encode data, the randomness in the weight choice carries information you can reclaim.",
              "想象你想向朋友发送消息 M，但你还需要告诉他们你掷了哪个骰子来编码它。如果骰子有 6 面，你用 log₂(6) ≈ 2.58 比特来指定骰子点数。但你的朋友可以用这些相同的比特向你传达一些信息 — 「哪个骰子」的选择携带免费信息。比特反还论证将此推广：当你使用随机权重样本来编码数据时，权重选择中的随机性携带你可以取回的信息。"
            )}
          </p>
        </Collapsible>

        {/* ===== Section 6: Connection to Weight Decay and L2 Regularization ===== */}
        <h2>{t("6. Connection to Weight Decay and L2 Regularization", "6. 与权重衰减和 L2 正则化的联系")}</h2>

        <p>
          {t(
            "Consider the special case where the prior over weights is a Gaussian with variance σ²_0:",
            "考虑特殊情况，其中权重上的先验是方差为 σ²_0 的高斯分布："
          )}
        </p>

        <Math
          display
          label={t("Gaussian weight prior", "高斯权重先验")}
          tex="p(w) = \prod_i \mathcal{N}(w_i;\, 0,\, \sigma_0^2)"
        />

        <p>
          {t(
            "The description length of the weights under this prior (via Shannon's theorem) is:",
            "在此先验下权重的描述长度（通过香农定理）为："
          )}
        </p>

        <Math
          display
          label={t("Description length under Gaussian prior = weight decay", "高斯先验下的描述长度 = 权重衰减")}
          tex="L(w) = -\log p(w) = \sum_i \frac{w_i^2}{2\sigma_0^2} + \text{const} = \frac{\|w\|^2}{2\sigma_0^2} + \text{const}"
        />

        <p>
          {t(
            "This is exactly L2 regularization — weight decay! Minimizing MDL with a Gaussian prior is identical to training with weight decay. The regularization strength λ = 1/(2σ²₀) is the inverse prior variance: a tighter prior (smaller σ₀) means stronger weight decay.",
            "这恰好是 L2 正则化 — 权重衰减！用高斯先验最小化 MDL 与带权重衰减的训练完全相同。正则化强度 λ = 1/(2σ²₀) 是先验方差的倒数：更紧的先验（更小的 σ₀）意味着更强的权重衰减。"
          )}
        </p>

        <Collapsible title={t("The MDL derivation of weight decay", "权重衰减的 MDL 推导")}>
          <p>
            {t(
              "Total MDL objective with Gaussian prior:",
              "带高斯先验的总 MDL 目标："
            )}
          </p>
          <Math
            display
            tex="\min_w \Big[ \underbrace{\frac{\|w\|^2}{2\sigma_0^2}}_{L(w)} + \underbrace{(-\log p(D \mid w))}_{L(D \mid w)} \Big]"
          />
          <p>
            {t(
              "This is precisely negative log posterior (MAP estimation), which, for squared error loss, equals ridge regression. MDL doesn't just justify weight decay — it explains what it means: you're choosing the model that takes the fewest bits to communicate.",
              "这正是负对数后验（MAP 估计），对于平方误差损失，等于岭回归。MDL 不仅证明了权重衰减的合理性 — 它解释了其含义：你在选择通信所需比特最少的模型。"
            )}
          </p>
        </Collapsible>

        {/* ===== Section 7: Connection to Variational Inference ===== */}
        <h2>{t("7. Connection to Variational Inference", "7. 与变分推断的联系")}</h2>

        <p>
          {t(
            "The full MDL objective — with bits-back correction — has an exact algebraic identity with the variational lower bound (ELBO) used in VAEs and Bayesian deep learning. Define a variational posterior q(w) ≈ p(w|D). The bits-back MDL objective is:",
            "完整的 MDL 目标 — 带比特反还修正 — 与 VAE 和贝叶斯深度学习中使用的变分下界（ELBO）有精确的代数等价。定义变分后验 q(w) ≈ p(w|D)。比特反还 MDL 目标为："
          )}
        </p>

        <Math
          display
          label={t("MDL = Variational Free Energy = negative ELBO", "MDL = 变分自由能 = 负 ELBO")}
          tex="\mathcal{F} = \underbrace{-\mathbb{E}_{w \sim q}\big[\log p(D \mid w)\big]}_{\text{expected NLL}} + \underbrace{D_{\mathrm{KL}}\!\big(q(w) \;\|\; p(w)\big)}_{\text{coding cost of weights}}"
        />

        <p>
          {t(
            "This is precisely the VAE objective applied to weight space. The KL term plays the role of the weight description length; the expected NLL plays the role of the data description length. Hinton and van Camp derived this in 1993 — the VAE paper (Kingma & Welling) appeared in 2013, and Bayes By Backprop (Blundell et al.) in 2015.",
            "这正是应用于权重空间的 VAE 目标。KL 项充当权重描述长度的角色；期望 NLL 充当数据描述长度的角色。Hinton 和 van Camp 在 1993 年推导了这一点 — VAE 论文（Kingma & Welling）出现在 2013 年，Bayes By Backprop（Blundell 等）在 2015 年。"
          )}
        </p>

        <Collapsible title={t("The Bayesian perspective", "贝叶斯视角")}>
          <p>
            {t(
              "From a Bayesian standpoint, the posterior is p(w|D) ∝ p(D|w) p(w). MDL with a Gaussian prior finds the MAP (maximum a posteriori) estimate — the mode of this posterior. The full bits-back version instead approximates the entire posterior with a variational distribution q(w), minimizing the KL divergence between q and the true posterior. This is mean-field variational Bayes, derived from compression principles.",
              "从贝叶斯角度看，后验为 p(w|D) ∝ p(D|w) p(w)。带高斯先验的 MDL 找到 MAP（最大后验）估计 — 这个后验的众数。完整的比特反还版本则用变分分布 q(w) 近似整个后验，最小化 q 与真实后验之间的 KL 散度。这是从压缩原理推导出的均场变分贝叶斯。"
            )}
          </p>
          <Math
            display
            tex="\min_q \; D_{\mathrm{KL}}\!\big(q(w) \;\|\; p(w \mid D)\big) \;\equiv\; \min_q \; \mathcal{F}(q)"
          />
        </Collapsible>

        <Collapsible title={t("Why the KL term = weight description cost", "为什么 KL 项 = 权重描述成本")}>
          <p>
            {t(
              "The KL divergence KL(q||p) = ∫ q(w) log[q(w)/p(w)] dw measures how many extra bits you need to encode samples from q using a code designed for p. If q = p (the posterior matches the prior), the KL is zero — perfectly efficient encoding. If q is far from p (weights are far from where the prior expected them), the KL is large — weights are expensive to encode. Minimizing KL is literally minimizing description length.",
              "KL 散度 KL(q||p) = ∫ q(w) log[q(w)/p(w)] dw 衡量使用为 p 设计的编码来编码 q 的样本需要多少额外比特。如果 q = p（后验匹配先验），KL 为零 — 完全高效的编码。如果 q 远离 p（权重远离先验期望位置），KL 很大 — 权重编码昂贵。最小化 KL 字面上就是最小化描述长度。"
            )}
          </p>
        </Collapsible>

        {/* ===== Section 8: 30 Years Ahead of Its Time ===== */}
        <h2>{t("8. Thirty Years Ahead of Its Time", "8. 领先时代三十年")}</h2>

        <p>
          {t(
            "This 1993 paper implicitly contains the mathematical foundations of multiple techniques that would be independently rediscovered and celebrated over the next three decades:",
            "这篇 1993 年的论文隐式包含了多种技术的数学基础，这些技术在接下来三十年中被独立重新发现并受到赞誉："
          )}
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold">
                  {t("Modern technique", "现代技术")}
                </th>
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold">
                  {t("Year popularized", "流行年份")}
                </th>
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold">
                  {t("How it appears in MDL-weights (1993)", "如何出现在 MDL-weights (1993)")
                  }
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{t("Weight decay / L2 reg", "权重衰减 / L2 正则化")}</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">1950s–1980s</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{t("Exact derivation from Gaussian prior MDL", "高斯先验 MDL 的精确推导")}</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/30">
                <td className="p-3 border border-gray-200 dark:border-gray-700">{t("Weight noise / stochastic training", "权重噪声 / 随机训练")}</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">2000s</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{t("Core mechanism: ŵ = w + ε", "核心机制：ŵ = w + ε")}</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Dropout (Srivastava et al. 2014)</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">2014</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{t("Multiplicative noise on activations/weights", "激活/权重上的乘性噪声")}</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/30">
                <td className="p-3 border border-gray-200 dark:border-gray-700">VAE (Kingma & Welling 2013)</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">2013</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{t("ELBO = E[log p(D|w)] - KL(q||p) on weights", "权重上的 ELBO = E[log p(D|w)] - KL(q||p)")}</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Bayes By Backprop (Blundell et al. 2015)</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">2015</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{t("Variational Bayes over network weights", "网络权重上的变分贝叶斯")}</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/30">
                <td className="p-3 border border-gray-200 dark:border-gray-700">{t("Model compression / pruning", "模型压缩 / 剪枝")}</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">2015–2020</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{t("Weights with high σ relative to |w| are prunable", "|w| 相对于 σ 较高的权重可剪枝")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The 1993 context matters: backpropagation had only been widely known for ~6 years (since Rumelhart et al. 1986). GPUs did not exist as compute accelerators. Neural networks were trained on tiny datasets on CPUs. Hinton was thinking about generalization and compression as first principles — not as engineering tricks.",
            "1993 年的背景很重要：反向传播只被广泛知晓约 6 年（自 Rumelhart 等 1986 年起）。GPU 尚不作为计算加速器存在。神经网络在 CPU 上的小数据集上训练。Hinton 将泛化和压缩作为第一原理思考 — 而非工程技巧。"
          )}
        </p>

        <Collapsible title={t("Why wasn't this immediately influential?", "为什么没有立即产生影响？")}>
          <p>
            {t(
              "Several reasons conspired to delay the impact of this work. First, neural networks fell out of fashion in the mid-1990s — SVMs dominated the decade. Second, the computational cost of per-weight variational inference was prohibitive on 1993 hardware. Third, the mathematical connections to variational inference and the reparameterization trick (needed for backprop through stochastic weights) were not fully developed. The ideas had to wait for the deep learning renaissance, GPU computing, and the VAE framework before they could be practically implemented at scale.",
              "几个原因共同推迟了这项工作的影响。首先，神经网络在 1990 年代中期失去了流行 — SVM 主导了那十年。其次，在 1993 年的硬件上，每权重变分推断的计算成本令人望而却步。第三，与变分推断和重参数化技巧（反向传播通过随机权重所需）的数学联系尚未完全发展。这些想法必须等待深度学习复兴、GPU 计算和 VAE 框架，才能在规模上得到实际实现。"
            )}
          </p>
        </Collapsible>

        <Collapsible title={t("Bits-back coding in practice (modern revival)", "实践中的比特反还编码（现代复兴）")}>
          <p>
            {t(
              "Bits-back coding was largely theoretical until Townsend et al. (2019) and Hoogeboom et al. (2019) showed it could be implemented practically using ANS (Asymmetric Numeral Systems) coding. This enabled neural compression systems that actually achieve the theoretical bits-back savings — connecting Hinton's 1993 theory to state-of-the-art lossless compression 30 years later.",
              "比特反还编码在很大程度上停留于理论，直到 Townsend 等（2019）和 Hoogeboom 等（2019）展示它可以使用 ANS（非对称数值系统）编码实际实现。这使得神经压缩系统能够真正实现理论上的比特反还节省 — 将 Hinton 1993 年的理论与 30 年后的最先进无损压缩联系起来。"
            )}
          </p>
        </Collapsible>

        {/* ===== Back link ===== */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href={`${basePath}/papers`}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            {t("← Back to Papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
