"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function MDLTutorialPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "A Tutorial Introduction to the Minimum Description Length Principle",
            "最小描述长度原理入门教程"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-gray-400">
          Peter Grünwald &middot; 2004 &middot;{" "}
          <a
            href="https://arxiv.org/abs/math/0406077"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv math/0406077
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "The Minimum Description Length (MDL) principle frames statistical learning as a data compression problem: the best model is the one that compresses the data most. By formalizing Occam's razor as code-length minimization, MDL provides a rigorous, prior-free foundation for model selection that bridges information theory, statistics, and Kolmogorov complexity.",
              "最小描述长度（MDL）原理将统计学习视为数据压缩问题：最好的模型就是能最大程度压缩数据的模型。通过将奥卡姆剃刀原则形式化为编码长度最小化，MDL 为模型选择提供了严格的、无需先验的基础，架起了信息论、统计学与 Kolmogorov 复杂性之间的桥梁。"
            )}
          </p>
        </section>

        {/* Section 1: Learning as Compression */}
        <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white">
          {t("1. Learning as Compression", "1. 学习即压缩")}
        </h2>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "MDL rests on a single foundational insight: regularity in data enables compression. If a dataset has no structure — if it is pure noise — then no model can describe it more concisely than listing every observation. But if there is genuine pattern, a compact model can describe the pattern plus the residual errors in fewer bits than the raw data.",
            "MDL 建立在一个核心洞见上：数据中的规律性使压缩成为可能。如果数据集没有任何结构——纯粹是噪声——那么任何模型都无法比逐条列举更简洁地描述它。但如果存在真正的规律，一个紧凑的模型可以用更少的比特描述规律加上残差误差。"
          )}
        </p>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "This correspondence between compression and learning is not a metaphor — it is exact. Every probability model implicitly defines a code via Shannon's source coding theorem, and every code implicitly defines a probability model. Learning a good model and finding a short description are the same task.",
            "压缩与学习之间的对应不是比喻，而是精确的。每个概率模型通过 Shannon 信源编码定理隐式地定义了一种编码，每种编码也隐式地定义了一个概率模型。学习一个好的模型与找到一个短描述是同一件事。"
          )}
        </p>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 mb-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold mb-2 dark:text-gray-200">
            {t("The MDL Slogan", "MDL 格言")}
          </p>
          <p className="text-sm dark:text-gray-300">
            {t(
              "\"The best model for a dataset is the one that leads to the shortest description of the data.\" This description must include a description of the model itself — simpler models get a shorter free lunch.",
              "「对于一个数据集，最好的模型就是能导致最短数据描述的模型。」这个描述必须包括对模型本身的描述——更简单的模型可以获得更短的免费午餐。"
            )}
          </p>
        </div>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "The Kraft inequality makes this precise: any set of code lengths ",
            "Kraft 不等式使这一点变得精确：任何一组编码长度 "
          )}
          <Math tex={"L(s_1), L(s_2), \\ldots"} />
          {t(
            " for a prefix-free code must satisfy:",
            " 对于一个前缀无关的编码必须满足："
          )}
        </p>
        <Math display tex={"\\sum_{s} 2^{-L(s)} \\leq 1"} />
        <p className="mt-3 mb-4 dark:text-gray-200">
          {t(
            "Conversely, any set of lengths satisfying this inequality corresponds to a valid prefix-free code. The bijection between valid codes and sub-probability distributions means that assigning shorter codes to more probable sequences is always consistent.",
            "反之，任何满足此不等式的长度集合都对应一个有效的前缀无关编码。有效编码与次概率分布之间的双射意味着为更可能的序列分配更短的编码始终是自洽的。"
          )}
        </p>

        {/* Section 2: Shannon Codes and Entropy */}
        <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white">
          {t("2. Shannon Codes and Entropy", "2. Shannon 编码与熵")}
        </h2>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "If data source X has distribution p, the optimal code assigns length ",
            "如果数据源 X 的分布为 p，最优编码为长度为 "
          )}
          <Math tex={"L(x) = -\\log_2 p(x)"} />
          {t(
            " bits to outcome x. Shannon's noiseless coding theorem proves this is tight: no code can do better on average than Shannon entropy.",
            " 比特的符号 x。Shannon 无噪声编码定理证明这是紧的：没有任何编码在平均意义上能比 Shannon 熵做得更好。"
          )}
        </p>
        <Math display tex={"\\mathbb{E}[L(X)] \\geq H(X) = -\\sum_x p(x) \\log_2 p(x)"} />
        <p className="mt-3 mb-4 dark:text-gray-200">
          {t(
            "The Shannon code achieves expected length H(X) + 1 bits (the +1 comes from rounding to integer lengths). The entropy H(X) is therefore the fundamental limit of lossless compression for source p.",
            "Shannon 编码实现的期望长度为 H(X) + 1 比特（+1 来自取整到整数长度）。因此，熵 H(X) 是信源 p 的无损压缩的基本极限。"
          )}
        </p>

        <Collapsible
          title={t(
            "Derivation: Why -log p(x) is the optimal code length",
            "推导：为什么 -log p(x) 是最优编码长度"
          )}
        >
          <p className="mb-3 dark:text-gray-300">
            {t(
              "We want to minimize expected code length subject to the Kraft inequality. Formally:",
              "我们想在 Kraft 不等式约束下最小化期望编码长度。形式上："
            )}
          </p>
          <Math display tex={"\\min_{L_1,\\ldots,L_m} \\sum_x p(x) L(x) \\quad \\text{s.t.} \\quad \\sum_x 2^{-L(x)} \\leq 1"} />
          <p className="mt-3 mb-3 dark:text-gray-300">
            {t(
              "Using Lagrange multipliers or the method of types, the optimum is:",
              "利用拉格朗日乘数法，最优解为："
            )}
          </p>
          <Math display tex={"L^*(x) = -\\log_2 p(x)"} />
          <p className="mt-3 mb-3 dark:text-gray-300">
            {t(
              "The expected cost is then exactly Shannon entropy:",
              "期望代价恰好是 Shannon 熵："
            )}
          </p>
          <Math display tex={"\\sum_x p(x) \\cdot (-\\log_2 p(x)) = H(X)"} />
          <p className="mt-3 dark:text-gray-300">
            {t(
              "If we use a model q instead of the true p, the expected length becomes the cross-entropy H(p, q) = H(p) + D_KL(p || q) ≥ H(p). The extra cost is exactly the KL divergence — a direct link between compression and statistical estimation.",
              "如果我们使用模型 q 而不是真实的 p，期望长度变为交叉熵 H(p, q) = H(p) + D_KL(p || q) ≥ H(p)。额外代价恰好是 KL 散度——压缩与统计估计之间的直接联系。"
            )}
          </p>
        </Collapsible>

        <p className="mt-4 mb-4 dark:text-gray-200">
          {t(
            "When the true distribution is unknown (the typical case), we must use a model. If model M assigns probability ",
            "当真实分布未知时（典型情况），我们必须使用一个模型。如果模型 M 为数据序列 "
          )}
          <Math tex={"p_M(x^n)"} />
          {t(
            " to data sequence x^n, then the code length is:",
            " 分配概率 "
          )}
          <Math tex={"p_M(x^n)"} />
          {t(", the code length is:", "，则编码长度为：")}
        </p>
        <Math display tex={"L_M(x^n) = -\\log_2 p_M(x^n)"} />
        <p className="mt-3 mb-4 dark:text-gray-200">
          {t(
            "Model selection in MDL reduces to: which model M gives the shortest code length for the observed data? But we must add the cost of describing M itself.",
            "MDL 中的模型选择归结为：哪个模型 M 对观测数据给出最短的编码长度？但我们必须加上描述 M 本身的代价。"
          )}
        </p>

        {/* Section 3: Two-Part MDL */}
        <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white">
          {t("3. Two-Part MDL", "3. 两部分 MDL")}
        </h2>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "The simplest and most interpretable formulation of MDL is the two-part (or crude) code. The total description of data D given a hypothesis class requires two parts:",
            "MDL 最简单且最易解释的公式是两部分（或粗糙的）编码。给定假设类，对数据 D 的完整描述需要两个部分："
          )}
        </p>
        <ol className="list-decimal list-inside mb-4 space-y-2 dark:text-gray-200">
          <li>
            <strong>{t("Model description:", "模型描述：")}</strong>{" "}
            {t(
              "the code length L(H) to communicate which hypothesis H was selected",
              "传达选择了哪个假设 H 所需的编码长度 L(H)"
            )}
          </li>
          <li>
            <strong>{t("Data-given-model description:", "给定模型的数据描述：")}</strong>{" "}
            {t(
              "the code length L(D | H) to communicate the data assuming the receiver knows H",
              "假设接收方知道 H 时，传达数据所需的编码长度 L(D | H)"
            )}
          </li>
        </ol>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "The two-part MDL criterion selects the hypothesis that minimizes the total:",
            "两部分 MDL 准则选择最小化总量的假设："
          )}
        </p>
        <Math display tex={"\\bar{L}(H_n, D^n) = L(H_n) + L(D^n \\mid H_n)"} />
        <p className="mt-3 mb-4 dark:text-gray-200">
          {t(
            "Here, H_n is a hypothesis from a parametric family fit to n data points, and D^n is the observed sequence of length n. The first term penalizes model complexity; the second penalizes poor fit. Their sum is minimized at the sweet spot between underfitting and overfitting.",
            "这里，H_n 是从参数族中拟合到 n 个数据点的假设，D^n 是长度为 n 的观测序列。第一项惩罚模型复杂性；第二项惩罚拟合不良。它们的和在欠拟合与过拟合之间的最优点处最小化。"
          )}
        </p>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "For parametric models with k real-valued parameters, the model description cost scales roughly as ",
            "对于具有 k 个实值参数的参数模型，模型描述代价大约按 "
          )}
          <Math tex={"\\frac{k}{2} \\log_2 n"} />
          {t(
            " bits (since parameters need to be described to precision ~1/√n for n observations). This is exactly the penalty term in the Bayesian Information Criterion (BIC), revealing a deep connection between MDL and BIC.",
            " 比特缩放（因为参数需要以约 1/√n 的精度描述 n 个观测值）。这正好是贝叶斯信息准则（BIC）中的惩罚项，揭示了 MDL 与 BIC 之间的深刻联系。"
          )}
        </p>

        <Collapsible
          title={t(
            "Two-Part Code: Encoding the Model Parameter",
            "两部分编码：对模型参数编码"
          )}
        >
          <p className="mb-3 dark:text-gray-300">
            {t(
              "Consider a parametric model with parameter θ ∈ Θ. To encode θ for the receiver, we need finite precision. For a dataset of n points, the maximum likelihood estimator θ̂ typically has standard error ~1/√n, so it suffices to encode θ with precision ε ~ n^{-1/2}.",
              "考虑参数为 θ ∈ Θ 的参数模型。为了向接收方编码 θ，我们需要有限精度。对于 n 个数据点的数据集，最大似然估计量 θ̂ 通常具有约 1/√n 的标准误差，因此以精度 ε ~ n^{-1/2} 编码 θ 就足够了。"
            )}
          </p>
          <p className="mb-3 dark:text-gray-300">
            {t(
              "The number of distinguishable values in the parameter space (assumed bounded with volume V) is approximately V · n^{k/2}, so the encoding cost is:",
              "参数空间中（假设有界，体积为 V）可区分值的数量约为 V · n^{k/2}，因此编码代价为："
            )}
          </p>
          <Math display tex={"L(\\theta) \\approx \\log_2(V \\cdot n^{k/2}) = \\frac{k}{2}\\log_2 n + \\log_2 V"} />
          <p className="mt-3 mb-3 dark:text-gray-300">
            {t(
              "Ignoring constants, the model cost is (k/2) log n. Combined with -log p(D^n | θ̂) for the data, MDL model selection becomes:",
              "忽略常数，模型代价为 (k/2) log n。与数据的 -log p(D^n | θ̂) 相结合，MDL 模型选择变为："
            )}
          </p>
          <Math display tex={"\\hat{k} = \\arg\\min_k \\left[ -\\log p(D^n \\mid \\hat{\\theta}_k) + \\frac{k}{2}\\log n \\right]"} />
          <p className="mt-3 dark:text-gray-300">
            {t(
              "This is exactly the BIC criterion. MDL thus provides an information-theoretic derivation of BIC, without requiring a Bayesian prior.",
              "这正是 BIC 准则。因此，MDL 提供了 BIC 的信息论推导，无需贝叶斯先验。"
            )}
          </p>
        </Collapsible>

        {/* Section 4: Concrete Example */}
        <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white">
          {t(
            "4. Concrete Example: Polynomial Model Selection",
            "4. 具体示例：多项式模型选择"
          )}
        </h2>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "Suppose we observe n data points (x_i, y_i) and want to decide whether to fit a degree-1, degree-2, or degree-3 polynomial. Let k denote the number of parameters (k = 2, 3, 4 respectively) and let RSS_k denote the residual sum of squares under the best-fit degree-k polynomial.",
            "假设我们观测到 n 个数据点 (x_i, y_i)，想要决定是拟合 1 次、2 次还是 3 次多项式。令 k 表示参数数量（分别为 k = 2, 3, 4），令 RSS_k 表示在最优拟合 k 次多项式下的残差平方和。"
          )}
        </p>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "Under a Gaussian noise model with variance σ², the negative log-likelihood of the data given the model is:",
            "在方差为 σ² 的高斯噪声模型下，给定模型的数据的负对数似然为："
          )}
        </p>
        <Math display tex={"L(D^n \\mid H_k) = \\frac{n}{2}\\log(2\\pi\\sigma^2) + \\frac{\\text{RSS}_k}{2\\sigma^2}"} />
        <p className="mt-3 mb-4 dark:text-gray-200">
          {t(
            "Adding the model description cost, the total two-part code length for each degree is:",
            "加上模型描述代价，每个次数的总两部分编码长度为："
          )}
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left dark:text-gray-200">
                  {t("Degree", "次数")}
                </th>
                <th className="px-4 py-2 text-left dark:text-gray-200">
                  {t("Params (k)", "参数数 (k)")}
                </th>
                <th className="px-4 py-2 text-left dark:text-gray-200">
                  {t("Model cost", "模型代价")}
                </th>
                <th className="px-4 py-2 text-left dark:text-gray-200">
                  {t("Data cost", "数据代价")}
                </th>
                <th className="px-4 py-2 text-left dark:text-gray-200">
                  {t("Total", "总计")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200 dark:border-gray-600">
                <td className="px-4 py-2 dark:text-gray-300">1</td>
                <td className="px-4 py-2 dark:text-gray-300">2</td>
                <td className="px-4 py-2 dark:text-gray-300">
                  <Math tex={"\\log n"} />
                </td>
                <td className="px-4 py-2 dark:text-gray-300">
                  <Math tex={"\\text{RSS}_1 / (2\\sigma^2)"} />
                </td>
                <td className="px-4 py-2 dark:text-gray-300">
                  {t("(large RSS)", "(大 RSS)")}
                </td>
              </tr>
              <tr className="border-t border-gray-200 dark:border-gray-600 bg-green-50 dark:bg-green-950">
                <td className="px-4 py-2 dark:text-gray-300">2</td>
                <td className="px-4 py-2 dark:text-gray-300">3</td>
                <td className="px-4 py-2 dark:text-gray-300">
                  <Math tex={"\\frac{3}{2}\\log n"} />
                </td>
                <td className="px-4 py-2 dark:text-gray-300">
                  <Math tex={"\\text{RSS}_2 / (2\\sigma^2)"} />
                </td>
                <td className="px-4 py-2 font-semibold text-green-700 dark:text-green-400">
                  {t("Shortest — select!", "最短——选此！")}
                </td>
              </tr>
              <tr className="border-t border-gray-200 dark:border-gray-600">
                <td className="px-4 py-2 dark:text-gray-300">3</td>
                <td className="px-4 py-2 dark:text-gray-300">4</td>
                <td className="px-4 py-2 dark:text-gray-300">
                  <Math tex={"2\\log n"} />
                </td>
                <td className="px-4 py-2 dark:text-gray-300">
                  <Math tex={"\\text{RSS}_3 / (2\\sigma^2)"} />
                </td>
                <td className="px-4 py-2 dark:text-gray-300">
                  {t("(smaller RSS but bigger model cost)", "(RSS 更小但模型代价更大)")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "The degree-2 polynomial wins when its reduction in data cost exceeds the extra model description cost relative to degree-1, and its extra model cost exceeds the reduction in data cost relative to degree-3. MDL selects the model at the compression sweet spot — not the best-fitting model.",
            "当 2 次多项式相对于 1 次多项式的数据代价减少量超过额外的模型描述代价，且其额外模型代价超过相对于 3 次多项式的数据代价减少量时，2 次多项式胜出。MDL 选择压缩最优点的模型——而不是拟合最好的模型。"
          )}
        </p>

        {/* Section 5: Refined MDL and NML */}
        <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white">
          {t("5. Refined MDL and Normalized Maximum Likelihood", "5. 精细 MDL 与归一化最大似然")}
        </h2>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "Two-part MDL requires a separate code for the model, which can be arbitrary. Refined MDL eliminates this arbitrariness by using a single-part code that is minimax optimal over all data sequences in the model class.",
            "两部分 MDL 需要对模型进行单独编码，这可能是任意的。精细 MDL 通过使用在模型类的所有数据序列上是极小极大最优的单部分编码来消除这种任意性。"
          )}
        </p>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "The key concept is the Normalized Maximum Likelihood (NML) distribution. For a parametric model class M with data sequence x^n, the NML distribution is defined as:",
            "关键概念是归一化最大似然（NML）分布。对于参数模型类 M 和数据序列 x^n，NML 分布定义为："
          )}
        </p>
        <Math display tex={"p_{\\text{NML}}(x^n) = \\frac{p(x^n;\\, \\hat{\\theta}(x^n))}{\\sum_{y^n} p(y^n;\\, \\hat{\\theta}(y^n))}"} />
        <p className="mt-3 mb-4 dark:text-gray-200">
          {t(
            "where θ̂(x^n) is the maximum likelihood estimate for data x^n, and the denominator (the parametric complexity) sums over all possible data sequences of length n. The NML assigns each sequence a probability proportional to how well the model class can explain it.",
            "其中 θ̂(x^n) 是数据 x^n 的最大似然估计，分母（参数复杂性）对所有可能的长度为 n 的数据序列求和。NML 为每个序列分配与模型类能多好地解释它成比例的概率。"
          )}
        </p>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "The stochastic complexity of x^n under model class M is the NML code length:",
            "数据序列 x^n 在模型类 M 下的随机复杂性是 NML 编码长度："
          )}
        </p>
        <Math display tex={"SC(x^n) = -\\log_2 p_{\\text{NML}}(x^n) = -\\log_2 p(x^n;\\hat{\\theta}(x^n)) + \\log_2 \\sum_{y^n} p(y^n;\\hat{\\theta}(y^n))"} />
        <p className="mt-3 mb-4 dark:text-gray-200">
          {t(
            "The stochastic complexity decomposes into the maximum likelihood code length plus the log of the parametric complexity (the model class overhead). Model selection with refined MDL chooses M to minimize SC(x^n).",
            "随机复杂性分解为最大似然编码长度加上参数复杂性（模型类开销）的对数。用精细 MDL 进行模型选择选择 M 以最小化 SC(x^n)。"
          )}
        </p>

        <Collapsible
          title={t(
            "Minimax Regret: Why NML is Optimal",
            "极小极大遗憾：为什么 NML 是最优的"
          )}
        >
          <p className="mb-3 dark:text-gray-300">
            {t(
              "The regret of a code p_M relative to the best-fitting model on data x^n is:",
              "编码 p_M 相对于数据 x^n 上最优拟合模型的遗憾为："
            )}
          </p>
          <Math display tex={"\\text{Regret}(x^n) = \\log_2 p(x^n; \\hat{\\theta}(x^n)) - \\log_2 p_M(x^n)"} />
          <p className="mt-3 mb-3 dark:text-gray-300">
            {t(
              "This measures how many extra bits p_M uses compared to the oracle maximum likelihood code. The NML distribution minimizes the worst-case (minimax) regret:",
              "这衡量了 p_M 与预知最大似然编码相比使用了多少额外比特。NML 分布最小化最坏情况（极小极大）遗憾："
            )}
          </p>
          <Math display tex={"\\max_{x^n} \\left[\\log_2 p(x^n; \\hat{\\theta}(x^n)) - \\log_2 p_{\\text{NML}}(x^n)\\right] = \\log_2 \\sum_{y^n} p(y^n; \\hat{\\theta}(y^n))"} />
          <p className="mt-3 mb-3 dark:text-gray-300">
            {t(
              "The NML code achieves the same regret for every possible data sequence — it is perfectly equi-regret. No other code can achieve a lower worst-case regret. This is the information-theoretic justification for NML as the uniquely optimal code for model class M.",
              "NML 编码对每个可能的数据序列实现相同的遗憾——它是完全等遗憾的。没有其他编码能实现更低的最坏情况遗憾。这是 NML 作为模型类 M 唯一最优编码的信息论理由。"
            )}
          </p>
          <p className="mb-3 dark:text-gray-300">
            {t(
              "For k-dimensional exponential families with n observations, the parametric complexity satisfies (Rissanen's theorem):",
              "对于 n 个观测值的 k 维指数族，参数复杂性满足（Rissanen 定理）："
            )}
          </p>
          <Math display tex={"\\log_2 \\sum_{y^n} p(y^n; \\hat{\\theta}(y^n)) \\approx \\frac{k}{2}\\log_2 \\frac{n}{2\\pi} + \\log_2 \\int_{\\Theta} \\sqrt{\\det I(\\theta)}\\, d\\theta"} />
          <p className="mt-3 dark:text-gray-300">
            {t(
              "where I(θ) is the Fisher information matrix. The first term matches BIC; the second term (the log-volume of the model's geometry) is a correction absent from BIC.",
              "其中 I(θ) 是 Fisher 信息矩阵。第一项与 BIC 匹配；第二项（模型几何的对数体积）是 BIC 中没有的修正项。"
            )}
          </p>
        </Collapsible>

        {/* Section 6: Kolmogorov Complexity Connection */}
        <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white">
          {t(
            "6. Kolmogorov Complexity Connection",
            "6. Kolmogorov 复杂性联系"
          )}
        </h2>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "MDL has a deep theoretical cousin: Kolmogorov complexity, also called algorithmic information theory. The Kolmogorov complexity K(x) of a string x is the length of the shortest computer program (on a universal Turing machine) that outputs x and halts:",
            "MDL 有一个深刻的理论近亲：Kolmogorov 复杂性，也称为算法信息论。字符串 x 的 Kolmogorov 复杂性 K(x) 是输出 x 并停机的最短计算机程序（在通用图灵机上）的长度："
          )}
        </p>
        <Math display tex={"K(x) = \\min_{p\\, :\\, U(p) = x} |p|"} />
        <p className="mt-3 mb-4 dark:text-gray-200">
          {t(
            "where U is a universal Turing machine and |p| is the length of program p in bits. K(x) represents the ultimate compression limit: the shortest possible description of x across all computable descriptions.",
            "其中 U 是通用图灵机，|p| 是程序 p 的比特长度。K(x) 表示终极压缩极限：x 在所有可计算描述中最短的可能描述。"
          )}
        </p>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "The connection to MDL is precise: MDL can be viewed as the computable, statistical approximation to Kolmogorov complexity. While K(x) is uncomputable (no algorithm can compute it for all x), MDL restricts the search to a parametric model class and finds the shortest description within that class.",
            "与 MDL 的联系是精确的：MDL 可以被视为 Kolmogorov 复杂性的可计算统计近似。虽然 K(x) 是不可计算的（没有算法可以对所有 x 计算它），但 MDL 将搜索限制在参数模型类中，并在该类中找到最短描述。"
          )}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2">
              {t("Kolmogorov Complexity K(x)", "Kolmogorov 复杂性 K(x)")}
            </p>
            <ul className="text-sm text-purple-900 dark:text-purple-200 space-y-1 list-disc list-inside">
              <li>{t("Uncomputable", "不可计算")}</li>
              <li>{t("Universal (all programs)", "通用（所有程序）")}</li>
              <li>{t("Absolute optimal compression", "绝对最优压缩")}</li>
              <li>{t("Model-free", "无需模型")}</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              {t("MDL (Stochastic Complexity)", "MDL（随机复杂性）")}
            </p>
            <ul className="text-sm text-blue-900 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>{t("Computable", "可计算")}</li>
              <li>{t("Restricted to model class M", "限制在模型类 M")}</li>
              <li>{t("Class-optimal compression", "类最优压缩")}</li>
              <li>{t("Requires model specification", "需要模型规范")}</li>
            </ul>
          </div>
        </div>

        <p className="mb-4 dark:text-gray-200">
          {t(
            "The conditional Kolmogorov complexity K(x | y) — the shortest program that outputs x given y as input — is the algorithmic analogue of MDL's two-part code. When y is the model and x is the data, K(x | y) plays the role of L(D | H).",
            "条件 Kolmogorov 复杂性 K(x | y)——给定 y 作为输入时输出 x 的最短程序——是 MDL 两部分编码的算法类比。当 y 是模型而 x 是数据时，K(x | y) 扮演 L(D | H) 的角色。"
          )}
        </p>

        <Collapsible
          title={t(
            "Prequential (Predictive Sequential) Coding",
            "序贯预测编码"
          )}
        >
          <p className="mb-3 dark:text-gray-300">
            {t(
              "Prequential coding, introduced by Dawid (1984), provides an elegant third formulation of MDL that avoids both the two-part code's arbitrariness and NML's intractable normalization constant.",
              "序贯预测编码由 Dawid（1984）引入，提供了 MDL 的优雅的第三种表述，避免了两部分编码的任意性和 NML 难以处理的归一化常数。"
            )}
          </p>
          <p className="mb-3 dark:text-gray-300">
            {t(
              "The idea: encode each observation using the model's prediction based on all previous observations. If at time t the model predicts x_t with probability p(x_t | x_1, ..., x_{t-1}; θ̂_{t-1}), the code length for the entire sequence is:",
              "思路：使用基于所有先前观测值的模型预测对每个观测值进行编码。如果在时刻 t 模型以概率 p(x_t | x_1, ..., x_{t-1}; θ̂_{t-1}) 预测 x_t，则整个序列的编码长度为："
            )}
          </p>
          <Math display tex={"L_{\\text{prequential}}(x^n) = -\\sum_{t=1}^{n} \\log_2 p(x_t \\mid x_1, \\ldots, x_{t-1};\\, \\hat{\\theta}_{t-1})"} />
          <p className="mt-3 mb-3 dark:text-gray-300">
            {t(
              "This is simultaneously: (1) an online compression scheme, (2) an online learning algorithm — the compression at each step equals the prediction accuracy. Prequential codes satisfy the Kraft inequality and are therefore valid codes.",
              "这同时是：（1）一种在线压缩方案，（2）一种在线学习算法——每一步的压缩等于预测准确性。序贯编码满足 Kraft 不等式，因此是有效的编码。"
            )}
          </p>
          <p className="dark:text-gray-300">
            {t(
              "The connection to Bayesian inference: the prequential code with Bayesian prediction p(x_t | x^{t-1}) = ∫ p(x_t | θ) π(θ | x^{t-1}) dθ has total code length equal to -log p(x^n) where p(x^n) = ∫ p(x^n | θ) π(θ) dθ is the marginal likelihood. Online compression = Bayesian model averaging.",
              "与贝叶斯推断的联系：使用贝叶斯预测 p(x_t | x^{t-1}) = ∫ p(x_t | θ) π(θ | x^{t-1}) dθ 的序贯编码总编码长度等于 -log p(x^n)，其中 p(x^n) = ∫ p(x^n | θ) π(θ) dθ 是边际似然。在线压缩 = 贝叶斯模型平均。"
            )}
          </p>
        </Collapsible>

        {/* Section 7: Why Simpler Models Generalize */}
        <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white">
          {t(
            "7. Why Simpler Models Generalize Better",
            "7. 为什么更简单的模型泛化更好"
          )}
        </h2>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "MDL provides the first rigorous explanation of Occam's razor: simpler models generalize better because they are better compressors of genuinely structured data. This is not a philosophical preference — it follows from mathematics.",
            "MDL 提供了奥卡姆剃刀的第一个严格解释：更简单的模型泛化更好，因为它们是真正结构化数据的更好压ressors。这不是哲学偏好——它来自数学。"
          )}
        </p>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "A complex model class can compress any data sequence to zero bits (by memorizing it), but must pay for this universality in model description cost. A model that achieves short total description length must genuinely compress — it cannot be memorizing noise.",
            "复杂的模型类可以将任何数据序列压缩到零比特（通过记忆它），但必须在模型描述代价上为这种通用性付出代价。实现短总描述长度的模型必须是真正在压缩——它不可能是在记忆噪声。"
          )}
        </p>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "Formally, a model selected by MDL satisfies: the data is compressible under the model. This is equivalent to: the model has captured the regularities in the data. Regularities that generalize across samples will compress future samples too.",
            "形式上，MDL 选择的模型满足：数据在该模型下是可压缩的。这等价于：该模型捕获了数据中的规律性。跨样本泛化的规律性也会压缩未来的样本。"
          )}
        </p>

        <Collapsible
          title={t(
            "MDL and Model Averaging: Weighted by Code Length",
            "MDL 与模型平均：按编码长度加权"
          )}
        >
          <p className="mb-3 dark:text-gray-300">
            {t(
              "Instead of model selection (picking a single winner), MDL supports model averaging: weight each model by its compression quality. Define the mixture:",
              "MDL 支持模型平均而不是模型选择（选择单一胜者）：按每个模型的压缩质量对其加权。定义混合："
            )}
          </p>
          <Math display tex={"p_{\\text{avg}}(x^n) = \\sum_M w(M) \\cdot p_M(x^n)"} />
          <p className="mt-3 mb-3 dark:text-gray-300">
            {t(
              "where w(M) ∝ 2^{-L(M)} — models with shorter description length get higher weight. This is exactly the Bayesian model average with prior p(M) ∝ 2^{-L(M)} (a universal prior that favors simpler models).",
              "其中 w(M) ∝ 2^{-L(M)}——描述长度较短的模型获得更高权重。这正是先验 p(M) ∝ 2^{-L(M)} 的贝叶斯模型平均（一种偏好更简单模型的通用先验）。"
            )}
          </p>
          <p className="dark:text-gray-300">
            {t(
              "The mixture code achieves code length -log p_avg(x^n). By the log-sum inequality, this is never worse than the best individual model up to a constant (the log of the number of models). In practice, model averaging often outperforms model selection, especially when models have similar description lengths.",
              "混合编码实现编码长度 -log p_avg(x^n)。根据对数和不等式，这在常数（模型数量的对数）以内不比最好的单个模型差。在实践中，模型平均通常优于模型选择，特别是当模型具有相似描述长度时。"
            )}
          </p>
        </Collapsible>

        {/* Section 8: MDL in Modern ML */}
        <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white">
          {t("8. MDL in Modern ML", "8. MDL 在现代机器学习中的应用")}
        </h2>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "MDL's influence permeates modern machine learning, often under different names. Understanding these connections reveals the unified information-theoretic structure beneath diverse regularization techniques.",
            "MDL 的影响渗透到现代机器学习中，通常以不同的名称出现。理解这些联系揭示了不同正则化技术下统一的信息论结构。"
          )}
        </p>
        <div className="space-y-4 mb-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="font-semibold mb-1 dark:text-white">
              {t("MDL ↔ Regularization", "MDL ↔ 正则化")}
            </p>
            <p className="text-sm dark:text-gray-300">
              {t(
                "L2 regularization (weight decay) can be derived as MDL with a Gaussian prior on weights — the regularization coefficient sets the model description cost. L1 (Lasso) corresponds to a Laplace prior. Both penalize model complexity, exactly as the MDL model description term does.",
                "L2 正则化（权重衰减）可以推导为对权重使用高斯先验的 MDL——正则化系数设置模型描述代价。L1（Lasso）对应于 Laplace 先验。两者都惩罚模型复杂性，正如 MDL 模型描述项所做的那样。"
              )}
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="font-semibold mb-1 dark:text-white">
              {t("MDL ↔ Variational Inference", "MDL ↔ 变分推断")}
            </p>
            <p className="text-sm dark:text-gray-300">
              {t(
                "The ELBO in variational autoencoders decomposes as: -E[log p(x|z)] + D_KL(q(z|x) || p(z)). The KL term is the description length of the latent code z under the prior, and the reconstruction term is the description length of x given z. VAE training minimizes a two-part MDL code.",
                "变分自编码器中的 ELBO 分解为：-E[log p(x|z)] + D_KL(q(z|x) || p(z))。KL 项是在先验下潜在编码 z 的描述长度，重建项是给定 z 时 x 的描述长度。VAE 训练最小化两部分 MDL 编码。"
              )}
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="font-semibold mb-1 dark:text-white">
              {t("MDL ↔ Early Stopping", "MDL ↔ 早停")}
            </p>
            <p className="text-sm dark:text-gray-300">
              {t(
                "The number of gradient descent steps is itself a complexity parameter — more steps means a more complex effective model. Early stopping caps this complexity, implicitly optimizing an MDL-like tradeoff between fit and complexity measured by training steps.",
                "梯度下降步骤数本身是一个复杂性参数——更多步骤意味着更复杂的有效模型。早停限制了这种复杂性，隐式地优化了拟合与由训练步骤衡量的复杂性之间的类 MDL 权衡。"
              )}
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="font-semibold mb-1 dark:text-white">
              {t("MDL ↔ Minimum Message Length (MML)", "MDL ↔ 最小消息长度（MML）")}
            </p>
            <p className="text-sm dark:text-gray-300">
              {t(
                "Developed independently by Wallace and Boulton (1968), MML is MDL's Australian cousin with a Bayesian twist. MML encodes both the parameter estimate and the data under that estimate, accounting for the precision with which parameters need to be stated. The two frameworks give identical results in many cases.",
                "由 Wallace 和 Boulton（1968）独立开发，MML 是 MDL 的澳大利亚近亲，带有贝叶斯的色彩。MML 在给定估计的情况下对参数估计和数据进行编码，考虑了参数需要被陈述的精度。两个框架在许多情况下给出相同的结果。"
              )}
            </p>
          </div>
        </div>
        <p className="mb-4 dark:text-gray-200">
          {t(
            "Perhaps most strikingly, the double descent phenomenon in modern overparameterized networks — where test loss decreases again after the interpolation threshold — can be partially understood through MDL: very large models can compress data via interpolation (memorization), but the specific way they interpolate (induced by gradient descent on neural architectures) turns out to generalize surprisingly well.",
            "也许最引人注目的是，现代过参数化网络中的双重下降现象——在插值阈值之后测试损失再次下降——可以部分通过 MDL 理解：非常大的模型可以通过插值（记忆）压缩数据，但它们插值的具体方式（由神经架构上的梯度下降诱导）结果泛化效果出奇地好。"
          )}
        </p>
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-5 mb-8">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
            {t("Key Takeaway: Compression = Understanding", "关键结论：压缩 = 理解")}
          </p>
          <p className="text-sm text-amber-900 dark:text-amber-200">
            {t(
              "MDL gives a principled answer to the question \"what does it mean for a model to have learned something?\" A model has learned when it can compress — when it describes the data more concisely than any simpler model. The bits saved are exactly the regularities captured. This makes MDL not just a model selection technique but a theory of statistical learning itself.",
              "MDL 对「模型学到了什么意味着什么」这个问题给出了有原则的答案。当模型能够压缩时——当它比任何更简单的模型更简洁地描述数据时——它就学到了东西。节省的比特正是捕获的规律性。这使 MDL 不仅仅是一种模型选择技术，而是统计学习本身的理论。"
            )}
          </p>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
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
