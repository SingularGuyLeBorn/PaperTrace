"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function KolmogorovComplexityPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-gray-100">
          {t(
            "Kolmogorov Complexity and Algorithmic Randomness",
            "柯尔莫哥洛夫复杂度与算法随机性"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-gray-400">
          Shen, Uspensky, Vereshchagin &middot; Textbook &middot;{" "}
          <a
            href="https://www.lirmm.fr/~ashen/kolmbook-eng-scan.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            kolmbook-eng-scan.pdf
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10 dark:bg-blue-950/40 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Kolmogorov complexity K(x) measures the length of the shortest program that prints x on a universal Turing machine. Most strings are incompressible — K(x) ≈ |x| for random strings. The framework is universal (robust across all choices of Turing machine), gives rise to a formal definition of randomness, and connects directly to Occam's razor, minimum description length (MDL), Solomonoff induction, and AIXI. Ilya Sutskever has called understanding this textbook essential for thinking clearly about intelligence.",
              "柯尔莫哥洛夫复杂度 K(x) 衡量在通用图灵机上输出 x 的最短程序的长度。大多数字符串是不可压缩的——对随机字符串有 K(x) ≈ |x|。该框架是通用的（对图灵机的选择具有鲁棒性），给出了随机性的形式化定义，并直接连接到奥卡姆剃刀、最小描述长度（MDL）、Solomonoff 归纳和 AIXI。Ilya Sutskever 曾称理解这本教材对于清晰地思考智能至关重要。"
            )}
          </p>
        </section>

        {/* ============ Section 1: The Big Idea ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "1. The Big Idea: Compression as Complexity",
              "1. 核心思想：压缩即复杂度"
            )}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "How do we measure the complexity of an object — a string, an image, a sequence? One natural answer: by the length of its shortest description. A string like 0000...0 (one million zeros) has a very short description: \"print zero one million times.\" But a truly random string has no shorter description than itself.",
              "如何衡量一个对象——字符串、图像、序列——的复杂度？一个自然的答案：用其最短描述的长度。字符串 0000...0（一百万个零）有一个非常短的描述：\」打印一百万个零\「。但一个真正随机的字符串没有比自身更短的描述。"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "This is the core insight of Kolmogorov complexity, developed independently by Solomonoff (1964), Kolmogorov (1965), and Chaitin (1966): the complexity of x is the length of the shortest program p such that a universal Turing machine U outputs x when run on p.",
              "这是柯尔莫哥洛夫复杂度的核心洞察，由 Solomonoff（1964）、Kolmogorov（1965）和 Chaitin（1966）独立提出：x 的复杂度是最短程序 p 的长度，使得通用图灵机 U 在运行 p 时输出 x。"
            )}
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-amber-950/40 dark:border-amber-800">
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed mb-0">
              <span className="font-semibold">
                {t("Why does this matter for ML?", "这对 ML 有何意义？")}
              </span>{" "}
              {t(
                "Every learning algorithm implicitly makes assumptions about which hypotheses are simpler. Kolmogorov complexity formalizes simplicity in a way that is provably universal — independent of the particular language or representation you choose. It grounds Occam's razor in mathematics.",
                "每个学习算法都隐式地假设哪些假设更简单。柯尔莫哥洛夫复杂度以一种可证明是通用的方式形式化了简单性——独立于你选择的特定语言或表示形式。它将奥卡姆剃刀奠基于数学之上。"
              )}
            </p>
          </div>
        </section>

        {/* ============ Section 2: Defining K(x) ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "2. Defining Kolmogorov Complexity",
              "2. 定义柯尔莫哥洛夫复杂度"
            )}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Fix a universal Turing machine U. The Kolmogorov complexity of a string x is defined as the length of the shortest program (binary string) p that causes U to output x and halt:",
              "固定一个通用图灵机 U。字符串 x 的柯尔莫哥洛夫复杂度定义为最短程序（二进制字符串）p 的长度，使得 U 在运行 p 时输出 x 并停机："
            )}
          </p>

          <Math
            display
            label={t("Kolmogorov complexity", "柯尔莫哥洛夫复杂度")}
            tex="K(x) = \min_{\{p \,:\, U(p) = x\}} |p|"
          />

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Here |p| denotes the length of program p in bits. If no program outputs x, we set K(x) = ∞ (but for any computable x, K(x) is always finite).",
              "这里 |p| 表示程序 p 的长度（以比特为单位）。如果没有程序输出 x，我们令 K(x) = ∞（但对于任何可计算的 x，K(x) 总是有限的）。"
            )}
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 dark:bg-gray-800/40 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {t("Concrete examples", "具体例子")}
            </p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 mb-0">
              <li>
                <span className="font-mono text-blue-700 dark:text-blue-300">
                  0<sup>n</sup>
                </span>{" "}
                {t(
                  '(n zeros): K(0^n) ≈ log₂(n) bits — the program just says "print n zeros", so you only need to encode n.',
                  "（n 个零）：K(0^n) ≈ log₂(n) 比特——程序只需说\」打印 n 个零\「，因此只需编码 n。"
                )}
              </li>
              <li>
                <span className="font-mono text-blue-700 dark:text-blue-300">π</span>{" "}
                {t(
                  "to n digits: K(π_n) = O(log n) — there is a short program to compute π to any precision.",
                  "的前 n 位：K(π_n) = O(log n)——有一个短程序可以计算 π 到任意精度。"
                )}
              </li>
              <li>
                <span className="font-mono text-blue-700 dark:text-blue-300">
                  {t("Random string of length n", "长度为 n 的随机字符串")}
                </span>{" "}
                {t(
                  ": K(x) ≈ n for most strings — the only program is essentially to print x itself.",
                  "：对大多数字符串 K(x) ≈ n——唯一的程序本质上就是打印 x 本身。"
                )}
              </li>
            </ul>
          </div>

          <Collapsible
            title={t(
              "Why is K(x) always at most |x| + c?",
              "为什么 K(x) 总是最多 |x| + c？"
            )}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "There is always a trivial program: \"print the following string: [x]\". This program has length |x| + O(1) — you need |x| bits for x itself, plus a constant-length header that says 'print what follows'. So K(x) ≤ |x| + c for some constant c that depends only on U.",
                "总有一个平凡程序：\」打印以下字符串：[x]\「。这个程序的长度为 |x| + O(1)——你需要 |x| 比特表示 x 本身，加上一个常数长度的头部，说明\」打印后面的内容\「。因此对某个只依赖于 U 的常数 c，有 K(x) ≤ |x| + c。"
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t(
                "The interesting case is when K(x) ≪ |x|: x has a lot of structure that allows compression. Strings for which K(x) ≥ |x| − c are called c-incompressible — they are maximally complex, i.e., random.",
                "有趣的情况是 K(x) ≪ |x|：x 有很多结构可以被压缩。满足 K(x) ≥ |x| − c 的字符串称为 c-不可压缩的——它们具有最大复杂度，即随机的。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 3: Invariance Theorem ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("3. The Invariance Theorem", "3. 不变性定理")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The definition of K(x) depends on the choice of universal Turing machine U — different machines give potentially different complexities. Is this a fatal flaw? No: the Invariance Theorem shows that the choice of U matters only up to a constant.",
              "K(x) 的定义依赖于通用图灵机 U 的选择——不同的机器可能给出不同的复杂度。这是一个致命缺陷吗？不：不变性定理表明，U 的选择只影响一个常数。"
            )}
          </p>

          <Math
            display
            label={t("Invariance Theorem", "不变性定理")}
            tex="|K_U(x) - K_{U'}(x)| \leq c_{U,U'} \quad \text{for all } x"
          />

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "where c_{U,U'} is a constant that depends only on U and U', not on x. The key idea of the proof: to simulate U' on U, you only need a fixed-size \"translator\" program. That translator pays a one-time cost c_{U,U'} independent of x.",
              "其中 c_{U,U'} 是只依赖于 U 和 U' 而不依赖于 x 的常数。证明的关键思想：为了在 U 上模拟 U'，你只需要一个固定大小的\」翻译\「程序。该翻译器支付一次性成本 c_{U,U'}，与 x 无关。"
            )}
          </p>

          <Collapsible
            title={t(
              "Proof sketch: why the constant is independent of x",
              "证明概要：为什么常数与 x 无关"
            )}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "Let p' be the shortest program for x on U'. We want to construct a program for x on U of length not much longer than |p'|.",
                "设 p' 是 U' 上 x 的最短程序。我们想在 U 上构造一个长度不超过 |p'| 太多的 x 的程序。"
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "The program q on U is: \"simulate U' on p'\". This has length |q| = |p'| + |sim_{U'}| where sim_{U'} is a fixed program that encodes how to simulate U' on U. Since sim_{U'} has fixed length c that does not depend on x or p', we get K_U(x) ≤ K_{U'}(x) + c. Symmetrically, K_{U'}(x) ≤ K_U(x) + c', and combining gives the invariance bound.",
                "U 上的程序 q 是：\「在 p' 上模拟 U'\」。其长度为 |q| = |p'| + |sim_{U'}|，其中 sim_{U'} 是一个固定程序，编码了如何在 U 上模拟 U'。由于 sim_{U'} 有固定长度 c，不依赖于 x 或 p'，我们得到 K_U(x) ≤ K_{U'}(x) + c。对称地，K_{U'}(x) ≤ K_U(x) + c'，结合得到不变性界。"
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t(
                "This is why we speak of \"Kolmogorov complexity\" as a single concept: all universal TMs agree up to a constant, so for long strings the difference is negligible.",
                "这就是为什么我们将\」柯尔莫哥洛夫复杂度\「视为一个单一概念：所有通用图灵机最多相差一个常数，因此对于长字符串，差异可以忽略不计。"
              )}
            </p>
          </Collapsible>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 dark:bg-amber-950/40 dark:border-amber-800">
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed mb-0">
              <span className="font-semibold">
                {t("ML parallel:", "ML 中的对应：")}
              </span>{" "}
              {t(
                "Invariance is what makes K(x) an objective measure of complexity. Just as a physical quantity like temperature doesn't depend on the thermometer you use (up to calibration), complexity doesn't depend on the programming language — Python, C, lambda calculus — you use to describe it (up to a constant).",
                "不变性使 K(x) 成为复杂度的客观度量。就像温度这样的物理量不依赖于你使用的温度计（除了校准），复杂度也不依赖于你用来描述它的编程语言——Python、C、lambda 演算——（除了一个常数）。"
              )}
            </p>
          </div>
        </section>

        {/* ============ Section 4: Incompressibility and Randomness ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "4. Incompressibility and Randomness",
              "4. 不可压缩性与随机性"
            )}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Intuitively, a random string has no pattern — no regularity that allows a shorter description. Kolmogorov complexity formalizes this: a string x is algorithmically random if it cannot be significantly compressed.",
              "直觉上，随机字符串没有模式——没有允许更短描述的规律性。柯尔莫哥洛夫复杂度将此形式化：如果字符串 x 不能被显著压缩，则它是算法随机的。"
            )}
          </p>

          <Math
            display
            label={t("Algorithmic randomness (c-incompressibility)", "算法随机性（c-不可压缩性）")}
            tex="x \text{ is } c\text{-random} \iff K(x) \geq |x| - c"
          />

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "A simple counting argument shows that most strings are incompressible: there are 2^n binary strings of length n, but only 2^{n-c+1} − 1 programs of length less than n − c. So the fraction of n-bit strings with K(x) < n − c is at most 2^{−c+1}. For c = 10, fewer than 1 in 500 strings of any length are 10-compressible.",
              "一个简单的计数论证表明大多数字符串是不可压缩的：长度为 n 的二进制字符串有 2^n 个，但长度小于 n − c 的程序只有 2^{n-c+1} − 1 个。因此 n 比特字符串中满足 K(x) < n − c 的比例最多为 2^{−c+1}。对于 c = 10，任何长度的字符串中可 10-压缩的不超过 1/500。"
            )}
          </p>

          <Collapsible
            title={t(
              "Incompressibility method: how it's used in proofs",
              "不可压缩性方法：如何在证明中使用"
            )}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "Since most strings are incompressible, you can pick any incompressible string x and use the fact that K(x) ≥ |x| − c to derive properties that hold for a typical (random) input. This is the incompressibility method: a proof technique for combinatorics and complexity theory.",
                "由于大多数字符串是不可压缩的，你可以选取任意一个不可压缩字符串 x，并利用 K(x) ≥ |x| − c 的事实来推导对典型（随机）输入成立的性质。这就是不可压缩性方法：一种用于组合数学和复杂性理论的证明技术。"
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t(
                "Example application: lower bounds on sorting. If a sorting algorithm could sort any incompressible permutation in fewer than n log n comparisons, the output (the sorted order) together with the comparison trace would allow reconstruction of the original permutation in fewer than n log n bits — contradicting incompressibility. So sorting must take Ω(n log n) on a typical input.",
                "应用示例：排序的下界。如果排序算法能在少于 n log n 次比较中排序任何不可压缩的排列，那么输出（排序顺序）与比较轨迹一起将允许用少于 n log n 比特重建原始排列——与不可压缩性矛盾。因此排序对典型输入必须花费 Ω(n log n)。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 5: Conditional Complexity and Mutual Information ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "5. Conditional Complexity and Mutual Information",
              "5. 条件复杂度与互信息"
            )}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Just as Shannon entropy has a conditional version H(X|Y), Kolmogorov complexity has a conditional version. K(x|y) is the length of the shortest program that outputs x when given y as a free input — y is available to the program at no cost.",
              "就像香农熵有条件版本 H(X|Y) 一样，柯尔莫哥洛夫复杂度也有条件版本。K(x|y) 是在免费给定 y 作为输入时输出 x 的最短程序的长度——y 对程序来说是免费可用的。"
            )}
          </p>

          <Math
            display
            label={t("Conditional complexity", "条件复杂度")}
            tex="K(x \mid y) = \min_{\{p \,:\, U(p, y) = x\}} |p|"
          />

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "This leads naturally to algorithmic mutual information: how much information does knowing y give you about x?",
              "这自然地引出了算法互信息：了解 y 能给你提供多少关于 x 的信息？"
            )}
          </p>

          <Math
            display
            label={t("Algorithmic mutual information", "算法互信息")}
            tex="I(x : y) = K(x) + K(y) - K(x, y)"
          />

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Here K(x, y) is the complexity of the pair (x, y) — the shortest program that outputs both. The chain rule connects these quantities, analogous to H(X,Y) = H(X) + H(Y|X) in Shannon theory:",
              "这里 K(x, y) 是对 (x, y) 的复杂度——输出两者的最短程序。链式法则连接这些量，类似于香农理论中的 H(X,Y) = H(X) + H(Y|X)："
            )}
          </p>

          <Math
            display
            label={t("Chain rule for complexity", "复杂度的链式法则")}
            tex="K(x, y) = K(x) + K(y \mid x) + O(\log K(x, y))"
          />

          <Collapsible
            title={t(
              "Symmetry of information (and why it's surprising)",
              "信息对称性（以及为什么它令人惊讶）"
            )}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "From the chain rule we can derive that mutual information is (nearly) symmetric: K(x) − K(x|y) = K(y) − K(y|x) up to logarithmic terms. This is the symmetry of information theorem:",
                "从链式法则我们可以推导出互信息是（近似）对称的：K(x) − K(x|y) = K(y) − K(y|x)，精确到对数项。这是信息对称性定理："
              )}
            </p>
            <Math
              display
              tex="K(x, y) = K(x) + K(y \mid x^*) + O(\log K(x, y))"
            />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3 mb-3">
              {t(
                "where x* is the shortest program for x. The surprise: in Shannon information theory, H(X|Y) ≠ H(Y|X) in general, but H(X) − H(X|Y) = H(Y) − H(Y|X) = I(X;Y) always holds. The algorithmic version requires a log correction and uses the shortest program x* rather than x itself — a subtlety that took years to nail down rigorously.",
                "其中 x* 是 x 的最短程序。令人惊讶的是：在香农信息理论中，一般 H(X|Y) ≠ H(Y|X)，但 H(X) − H(X|Y) = H(Y) − H(Y|X) = I(X;Y) 总是成立。算法版本需要一个对数修正，并使用最短程序 x* 而不是 x 本身——这个微妙之处花了多年时间才得到严格确立。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 6: Universal Distribution ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("6. The Universal Distribution", "6. 通用分布")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Plain Kolmogorov complexity K has a technical problem: it does not satisfy the Kraft inequality, which is a fundamental constraint on code lengths in information theory. Prefix-free (or self-delimiting) complexity K^p fixes this by requiring programs to form a prefix-free set — no program is a prefix of another.",
              "普通柯尔莫哥洛夫复杂度 K 有一个技术问题：它不满足 Kraft 不等式，后者是信息论中代码长度的基本约束。前缀无关（或自定界）复杂度 K^p 通过要求程序构成前缀无关集来解决这个问题——没有程序是另一个程序的前缀。"
            )}
          </p>

          <Math
            display
            label={t("Prefix complexity", "前缀复杂度")}
            tex="K^p(x) = \min_{\{p \,:\, U^p(p) = x\}} |p|"
          />

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Because programs are prefix-free, we can apply the Kraft inequality: ∑_p 2^{-|p|} ≤ 1. This means we can treat 2^{-|p|} as a probability weight. Summing over all programs that output x, we get the universal prior (or Solomonoff's prior):",
              "因为程序是前缀无关的，我们可以应用 Kraft 不等式：∑_p 2^{-|p|} ≤ 1。这意味着我们可以将 2^{-|p|} 视为概率权重。对所有输出 x 的程序求和，我们得到通用先验（或 Solomonoff 先验）："
            )}
          </p>

          <Math
            display
            label={t("Universal prior (Solomonoff's prior)", "通用先验（Solomonoff 先验）")}
            tex="m(x) = \sum_{\{p \,:\, U^p(p) = x\}} 2^{-|p|}"
          />

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The dominant term is the shortest program: m(x) ≈ 2^{-K^p(x)}. Simpler objects (lower K^p) get exponentially higher probability. This is Occam's razor made precise: assign probability proportional to simplicity.",
              "主导项是最短程序：m(x) ≈ 2^{-K^p(x)}。更简单的对象（更低的 K^p）获得指数级更高的概率。这是奥卡姆剃刀的精确化：按简单性分配概率。"
            )}
          </p>

          <Collapsible
            title={t(
              "Why m(x) dominates every computable distribution",
              "为什么 m(x) 支配每个可计算分布"
            )}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "Let μ be any computable probability distribution. Then there exists a constant c_μ (depending on μ but not on x) such that:",
                "设 μ 是任意可计算概率分布。则存在常数 c_μ（依赖于 μ 但不依赖于 x），使得："
              )}
            </p>
            <Math display tex="m(x) \geq c_\mu \cdot \mu(x) \quad \text{for all } x" />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3 mb-3">
              {t(
                "Proof idea: if μ is computable, there is a program that enumerates the probabilities μ(x). This program has some fixed length |p_μ|. We can use this program inside U^p to output x with probability μ(x), paying only the fixed overhead 2^{-|p_μ|} = c_μ.",
                "证明思路：如果 μ 是可计算的，就有一个程序枚举概率 μ(x)。该程序有某个固定长度 |p_μ|。我们可以在 U^p 中使用这个程序以概率 μ(x) 输出 x，只需支付固定开销 2^{-|p_μ|} = c_μ。"
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t(
                "m(x) is called a universal semimeasure: it assigns more probability to x than any computable distribution (up to a constant). This is why it is the natural 'prior over all computable hypotheses'.",
                "m(x) 称为通用半测度：它对 x 赋予的概率比任何可计算分布都多（差一个常数）。这就是为什么它是\「所有可计算假设的自然先验\」。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 7: Solomonoff Induction ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("7. Solomonoff Induction", "7. Solomonoff 归纳")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Given a sequence x₁x₂...xₙ, how should we predict xₙ₊₁? Solomonoff's answer: use the universal prior m as a Bayesian prior, weighted over all computable hypotheses that are consistent with the observed data.",
              "给定序列 x₁x₂...xₙ，我们应该如何预测 xₙ₊₁？Solomonoff 的答案：使用通用先验 m 作为贝叶斯先验，对与观测数据一致的所有可计算假设加权。"
            )}
          </p>

          <Math
            display
            label={t("Solomonoff induction", "Solomonoff 归纳")}
            tex="P(x_{n+1} \mid x_1 \cdots x_n) \propto m(x_1 \cdots x_{n+1})"
          />

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "This is a Bayesian mixture over all computable models, weighted by their prior probability (program length). As n grows, the mixture converges: short programs that correctly predicted the data accumulate probability mass; long programs that needed many ad hoc adjustments are washed out.",
              "这是对所有可计算模型的贝叶斯混合，按其先验概率（程序长度）加权。随着 n 增大，混合收敛：正确预测数据的短程序积累概率质量；需要许多临时调整的长程序被淘汰。"
            )}
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 dark:bg-gray-800/40 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {t(
                "Key convergence theorem",
                "关键收敛定理"
              )}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-0">
              {t(
                "If the true data-generating process is any computable probability distribution μ, then Solomonoff induction converges to μ — in the sense that the cumulative prediction error (summed KL divergence) is bounded by K^p(μ), the complexity of μ itself. The simpler the true process, the faster convergence. This is the theoretical justification for Occam's razor.",
                "如果真实的数据生成过程是任何可计算概率分布 μ，那么 Solomonoff 归纳收敛到 μ——在累积预测误差（求和 KL 散度）以 K^p(μ)（μ 本身的复杂度）为界的意义上。真实过程越简单，收敛越快。这是奥卡姆剃刀的理论论证。"
              )}
            </p>
          </div>

          <Collapsible
            title={t(
              "Why Solomonoff induction is not computable — and why that's OK",
              "为什么 Solomonoff 归纳不可计算——以及为什么这没关系"
            )}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "Computing m(x) requires summing over all programs that halt and output x — but the halting problem is undecidable. So Solomonoff induction is not a practical algorithm. However, it serves as a theoretical ideal: the best possible predictor among all computable methods, and a benchmark against which practical algorithms can be measured.",
                "计算 m(x) 需要对所有停机并输出 x 的程序求和——但停机问题是不可判定的。因此 Solomonoff 归纳不是一个实用算法。然而，它作为理论理想：在所有可计算方法中最好的预测器，以及实用算法可以衡量的基准。"
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t(
                "MDL (minimum description length) and Bayesian model selection are computable approximations to Solomonoff induction: instead of summing over all programs, they pick the shortest (or weight by description length). Deep learning can be seen as learning a compressed representation — a short program — for the training data.",
                "MDL（最小描述长度）和贝叶斯模型选择是 Solomonoff 归纳的可计算近似：它们不对所有程序求和，而是选择最短的（或按描述长度加权）。深度学习可以看作是学习训练数据的压缩表示——一个短程序。"
              )}
            </p>
          </Collapsible>
        </section>

        {/* ============ Section 8: Why Ilya Thinks This Is Foundational ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "8. Why Ilya Thinks This Is Foundational",
              "8. 为什么 Ilya 认为这是基础性的"
            )}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Ilya Sutskever has pointed to the Shen–Uspensky–Vereshchagin textbook as one of the most important texts for understanding intelligence. The reason is not just historical interest — it is that Kolmogorov complexity provides the only framework that:",
              "Ilya Sutskever 曾指出 Shen–Uspensky–Vereshchagin 教材是理解智能最重要的文本之一。原因不仅仅是历史兴趣——而是柯尔莫哥洛夫复杂度提供了唯一一个满足以下条件的框架："
            )}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>
              {t(
                "Gives a substrate-independent, language-independent definition of the complexity of any computable object",
                "给出任何可计算对象的复杂度的与底层无关、与语言无关的定义"
              )}
            </li>
            <li>
              {t(
                "Formally justifies Occam's razor: simpler explanations are exponentially more probable under the universal prior",
                "正式证明奥卡姆剃刀：在通用先验下，更简单的解释具有指数级更高的概率"
              )}
            </li>
            <li>
              {t(
                "Provides a notion of randomness that does not depend on a probability distribution — a string is random if it has no structure, period",
                "提供一个不依赖于概率分布的随机性概念——如果一个字符串没有结构，它就是随机的，句点"
              )}
            </li>
            <li>
              {t(
                "Grounds the idea that a sufficiently general predictor must converge to the correct model of any computable environment",
                "奠定了一个足够通用的预测器必须收敛到任何可计算环境的正确模型的思想"
              )}
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "If you believe that intelligence is fundamentally about prediction and compression — finding the shortest description of the world that explains the observations — then Kolmogorov complexity is not an optional advanced topic. It is the mathematical core of what intelligence means.",
              "如果你相信智能从根本上是关于预测和压缩——找到解释观测结果的世界的最短描述——那么柯尔莫哥洛夫复杂度不是可选的高级主题。它是智能含义的数学核心。"
            )}
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 dark:bg-purple-950/40 dark:border-purple-800">
            <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed mb-0">
              {t(
                "\"If you really understand Kolmogorov complexity and Solomonoff induction, you understand why deep learning works at all.\" The neural network is learning to compress — finding short programs (weights) that reproduce training data. Generalization is compression: if you've found a short description, it should predict well on new data from the same source.",
                "\「如果你真正理解柯尔莫哥洛夫复杂度和 Solomonoff 归纳，你就理解了为什么深度学习能够工作。\」神经网络正在学习压缩——找到再现训练数据的短程序（权重）。泛化就是压缩：如果你找到了一个短描述，它应该能够很好地预测来自同一来源的新数据。"
              )}
            </p>
          </div>
        </section>

        {/* ============ Section 9: Connections to MDL, AIXI, Modern ML ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "9. Connections to MDL, AIXI, and Modern ML",
              "9. 与 MDL、AIXI 和现代 ML 的联系"
            )}
          </h2>

          {/* MDL */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {t("9a. Minimum Description Length (MDL)", "9a. 最小描述长度（MDL）")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "MDL, introduced by Rissanen (1978), is a practical approximation to Solomonoff induction. Given data D and a hypothesis class H, MDL selects the hypothesis h* that minimizes the total description length:",
                "Rissanen（1978）引入的 MDL 是 Solomonoff 归纳的实用近似。给定数据 D 和假设类 H，MDL 选择最小化总描述长度的假设 h*："
              )}
            </p>
            <Math
              display
              tex="h^* = \arg\min_{h \in H} \left[ L(h) + L(D \mid h) \right]"
            />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              {t(
                "where L(h) is the code length for the model and L(D|h) is the code length for the data given the model (negative log-likelihood). This is equivalent to MAP estimation with a prior proportional to 2^{-L(h)} — a direct implementation of Occam's razor. BIC, AIC, and regularization can all be interpreted as MDL variants.",
                "其中 L(h) 是模型的编码长度，L(D|h) 是给定模型的数据的编码长度（负对数似然）。这等价于带有正比于 2^{-L(h)} 的先验的 MAP 估计——奥卡姆剃刀的直接实现。BIC、AIC 和正则化都可以解释为 MDL 的变体。"
              )}
            </p>
          </div>

          {/* AIXI */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {t("9b. AIXI: The Ideal Rational Agent", "9b. AIXI：理想理性智能体")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "Marcus Hutter's AIXI (2000) extends Solomonoff induction to reinforcement learning. AIXI is a Bayesian agent that uses the universal prior m as its model of the environment and chooses actions to maximize expected future reward, averaged over all computable environments weighted by m.",
                "Marcus Hutter 的 AIXI（2000）将 Solomonoff 归纳扩展到强化学习。AIXI 是一个贝叶斯智能体，它使用通用先验 m 作为环境模型，并选择动作以最大化期望未来奖励，在所有以 m 加权的可计算环境上平均。"
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "AIXI is provably optimal in a formal sense: no other algorithm achieves higher total reward in expectation over all computable environments. Like Solomonoff induction, it is uncomputable — but it defines what optimal intelligence means when computational constraints are lifted.",
                "AIXI 在形式意义上可证明是最优的：没有其他算法在所有可计算环境上的期望总奖励更高。像 Solomonoff 归纳一样，它是不可计算的——但它定义了当计算约束被解除时最优智能的含义。"
              )}
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 dark:bg-gray-800/40 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-0">
                {t(
                  "Modern RL from human feedback (RLHF) and model-based RL can be seen as computable approximations to AIXI: instead of summing over all computable environments, they learn a world model from data. The universal prior m tells us what the ideal world model would look like.",
                  "来自人类反馈的现代 RL（RLHF）和基于模型的 RL 可以看作是 AIXI 的可计算近似：它们不对所有可计算环境求和，而是从数据中学习世界模型。通用先验 m 告诉我们理想的世界模型应该是什么样子。"
                )}
              </p>
            </div>
          </div>

          {/* Modern ML */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {t("9c. Deep Learning as Compression", "9c. 深度学习即压缩")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t(
                "Every trained neural network can be thought of as a compressed description of its training data. The network weights encode a program — a short description — from which the training distribution can be approximately reconstructed. Generalization corresponds to low K(weights): the simpler the compressed program, the better it should generalize.",
                "每个经过训练的神经网络都可以看作是其训练数据的压缩描述。网络权重编码了一个程序——一个短描述——从中可以大致重建训练分布。泛化对应于低 K(权重)：压缩程序越简单，泛化越好。"
              )}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <span className="font-semibold">{t("Weight decay / L2 regularization:", "权重衰减 / L2 正则化：")}</span>{" "}
                {t(
                  "corresponds to a Gaussian prior — penalizing description length of weights",
                  "对应于高斯先验——惩罚权重的描述长度"
                )}
              </li>
              <li>
                <span className="font-semibold">{t("Dropout:", "Dropout：")}</span>{" "}
                {t(
                  "can be interpreted as averaging over multiple compressed descriptions (subnetworks)",
                  "可以解释为对多个压缩描述（子网络）取平均"
                )}
              </li>
              <li>
                <span className="font-semibold">{t("Early stopping:", "早停：")}</span>{" "}
                {t(
                  "stops before the model starts memorizing noise — i.e., before K(weights|data) grows too large",
                  "在模型开始记忆噪声之前停止——即在 K(权重|数据) 变得太大之前"
                )}
              </li>
              <li>
                <span className="font-semibold">{t("Scaling laws:", "规模化定律：")}</span>{" "}
                {t(
                  "larger models can encode longer programs — access to exponentially more compressible hypothesis classes",
                  "更大的模型可以编码更长的程序——访问指数级更多可压缩的假设类"
                )}
              </li>
              <li>
                <span className="font-semibold">{t("In-context learning:", "上下文学习：")}</span>{" "}
                {t(
                  "the model has learned a prior m over tasks; few-shot examples update this prior, analogous to K(task|examples) ≪ K(task)",
                  "模型已经学习了任务的先验 m；少样本示例更新此先验，类似于 K(任务|示例) ≪ K(任务)"
                )}
              </li>
            </ul>
          </div>
        </section>

        {/* ============ Back link ============ */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`${basePath}/papers`}
            className="text-blue-600 hover:underline dark:text-blue-400 text-sm"
          >
            {t("← Back to Papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
