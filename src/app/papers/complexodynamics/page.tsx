"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function ComplexodynamicsPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "The First Law of Complexodynamics",
            "复杂动力学第一定律"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-slate-400">
          Scott Aaronson &middot; Blog post / Essay &middot;{" "}
          <a
            href="https://scottaaronson.blog/?p=762"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            scottaaronson.blog
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Entropy always increases — but the interesting 'complexity' of a closed system first rises and then falls. Aaronson proposes a measure called complextropy, defined via Kolmogorov complexity and model compression, which captures this arc: random noise and uniform gas are both low-complextropy, while galaxies, organisms, and brains sit at the hard-to-describe-briefly middle. He conjectures a First Law: complextropy of a closed system first increases then decreases toward zero.",
              "熵总是增加的——但封闭系统有趣的「复杂性」却先升后降。Aaronson 提出了一个名为「复杂熵」的度量，通过 Kolmogorov 复杂度和模型压缩来定义，捕捉这种弧线：随机噪声和均匀气体的复杂熵都很低，而星系、生命体和大脑则处于难以简短描述的中间地带。他猜想一条第一定律：封闭系统的复杂熵先增加后趋近于零。"
            )}
          </p>
        </section>

        {/* ============ 1. The Entropy Paradox ============ */}
        <h2>{t("1. The Entropy Paradox", "1. 熵的悖论")}</h2>

        <p>
          {t(
            "The Second Law of Thermodynamics says entropy never decreases in a closed system. A glass of water and a drop of ink start in a low-entropy state — all the ink molecules clustered together — and over time the ink disperses until the solution is a uniform blue. Entropy has increased, and it will never spontaneously decrease.",
            "热力学第二定律说封闭系统中熵永不减少。一杯水和一滴墨水起初处于低熵状态——所有墨水分子聚集在一起——随着时间推移墨水扩散，直到溶液变成均匀的蓝色。熵已经增加，并且永远不会自发减少。"
          )}
        </p>

        <p>
          {t(
            "Now consider a box of gas. At time 0, all molecules are crammed into one corner: extremely ordered, low entropy. As time passes, the gas expands and fills the box uniformly: high entropy. Both the initial state (all in one corner) and the final state (perfectly uniform) seem simple and easy to describe. But the intermediate states — molecules half-mixed in complicated swirling patterns — seem far more complex and harder to describe.",
            "现在考虑一箱气体。在时刻 0，所有分子挤在一个角落：极度有序，低熵。随着时间流逝，气体膨胀并均匀充满箱子：高熵。初始状态（全部在一个角落）和最终状态（完全均匀）似乎都很简单，容易描述。但中间状态——分子半混合在复杂的旋涡模式中——似乎复杂得多，更难描述。"
          )}
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-900 dark:text-amber-200 mb-0">
            <span className="font-semibold">{t("The puzzle: ", "谜题：")}</span>
            {t(
              "Entropy increases monotonically, but something we might call 'complexity' or 'sophistication' first increases and then decreases. If complexity is not entropy, what is it — and can we define it precisely?",
              "熵单调递增，但我们可能称之为「复杂性」或「精妙性」的东西却先增后降。如果复杂性不是熵，那它是什么——我们能精确定义它吗？"
            )}
          </p>
        </div>

        <p>
          {t(
            "This is not a trivial observation. The early universe was also low entropy and 'simple', yet it gave rise to stars, galaxies, cells, and brains — all of which seem vastly more complex than the final heat-death equilibrium. Something interesting happens in between, and entropy alone cannot capture it.",
            "这不是一个微不足道的观察。早期宇宙也是低熵且「简单」的，但它孕育了恒星、星系、细胞和大脑——这些似乎都比最终的热寂平衡复杂得多。中间发生了一些有趣的事情，而单靠熵无法捕捉它。"
          )}
        </p>

        {/* ============ 2. Kolmogorov Complexity ============ */}
        <h2>{t("2. Kolmogorov Complexity", "2. Kolmogorov 复杂度")}</h2>

        <p>
          {t(
            "To make 'complexity' precise, we turn to algorithmic information theory. The Kolmogorov complexity K(x) of a string x is the length of the shortest program that outputs x on a universal Turing machine U:",
            "为了使「复杂性」精确，我们转向算法信息论。字符串 x 的 Kolmogorov 复杂度 K(x) 是在通用图灵机 U 上输出 x 的最短程序的长度："
          )}
        </p>

        <Math
          display
          label={t("Kolmogorov complexity", "Kolmogorov 复杂度")}
          tex="K(x) = \min_{p\,:\,U(p)=x} |p|"
        />

        <p>
          {t(
            "In other words: K(x) measures how compressible x is. A string of one million zeros has very low Kolmogorov complexity — the program 'print 0 one million times' is short. A random string of one million bits has high Kolmogorov complexity — no program shorter than the string itself can reproduce it.",
            "换句话说：K(x) 衡量 x 的可压缩性。一百万个零的字符串 Kolmogorov 复杂度非常低——程序「打印一百万个 0」很短。一百万比特的随机字符串 Kolmogorov 复杂度很高——没有比字符串本身更短的程序能重现它。"
          )}
        </p>

        <Collapsible
          title={t("Conditional Kolmogorov complexity K(x|y)", "条件 Kolmogorov 复杂度 K(x|y)")}
        >
          <p className="text-sm">
            {t(
              "We can also define conditional complexity: K(x|y) is the length of the shortest program that outputs x given y as auxiliary input.",
              "我们还可以定义条件复杂度：K(x|y) 是在给定辅助输入 y 的情况下输出 x 的最短程序的长度。"
            )}
          </p>
          <Math
            display
            tex="K(x \mid y) = \min_{p\,:\,U(p,\,y)=x} |p|"
          />
          <p className="text-sm">
            {t(
              "This is the amount of additional information needed to describe x, given that the receiver already knows y. It satisfies K(x|y) ≤ K(x) + O(1) — knowing y never hurts. The chain rule K(x,y) ≈ K(x) + K(y|x) mirrors the classical entropy chain rule H(X,Y) = H(X) + H(Y|X).",
              "这是在接收方已知 y 的情况下描述 x 所需的额外信息量。它满足 K(x|y) ≤ K(x) + O(1)——知道 y 永远不会有害。链式法则 K(x,y) ≈ K(x) + K(y|x) 类似于经典熵链式法则 H(X,Y) = H(X) + H(Y|X)。"
            )}
          </p>
        </Collapsible>

        <p>
          {t(
            "But Kolmogorov complexity fails to capture the 'interesting middle'. A random string has maximum K(x) — yet it is not complex in any meaningful sense. It is just noise. A perfectly uniform string has minimum K(x) — it is also not interesting. The things we care about — organisms, languages, theorems — sit somewhere in between.",
            "但 Kolmogorov 复杂度未能捕捉「有趣的中间地带」。随机字符串具有最大 K(x)——但它在任何有意义的意义上都不复杂。它只是噪声。完全均匀的字符串 K(x) 最小——它也不有趣。我们关心的事物——生命体、语言、定理——介于两者之间。"
          )}
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-800 dark:text-slate-200 mb-1 font-semibold">
            {t("Kolmogorov complexity as a thermodynamic analogy", "Kolmogorov 复杂度作为热力学类比")}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-0">
            {t(
              "Shannon entropy H(X) and Kolmogorov complexity K(x) are deeply related: for a string drawn from a distribution, E[K(x)] ≈ H(X) up to logarithmic terms. But K(x) is defined for individual strings, not distributions — and that is exactly what we need for a physical system whose microstate evolves deterministically.",
              "香农熵 H(X) 和 Kolmogorov 复杂度 K(x) 有深刻联系：对于从分布中抽取的字符串，E[K(x)] ≈ H(X) 相差对数项。但 K(x) 是针对单个字符串定义的，而非分布——这正是我们描述确定性演化的物理系统微观状态所需要的。"
            )}
          </p>
        </div>

        {/* ============ 3. Sophistication ============ */}
        <h2>{t("3. Sophistication: Complexity Given a Model", "3. 精妙性：给定模型的复杂度")}</h2>

        <p>
          {t(
            "The key insight is that a random string, despite having high K(x), is not 'sophisticated'. It has no exploitable structure — its description can only be the string itself. Sophistication tries to capture the idea: how much of x's complexity comes from non-trivial structure versus mere randomness?",
            "关键洞察是：随机字符串尽管 K(x) 很高，但并不「精妙」。它没有可利用的结构——其描述只能是字符串本身。精妙性试图捕捉这个概念：x 的复杂度有多少来自非平凡结构，而不仅仅是随机性？"
          )}
        </p>

        <p>
          {t(
            "Formally, a model C(x) is a succinctly-described set containing x. The sophistication of x with parameter k is the minimum description length of any model C such that: (1) K(C) ≤ k — the model itself is short to describe — and (2) K(x|C) ≤ K(x) − k + O(1) — given the model, x still requires roughly K(x)−k bits to specify, meaning x is 'typical' of the model rather than special within it.",
            "形式上，模型 C(x) 是一个包含 x 的简洁描述集合。参数为 k 的 x 的精妙性是满足以下条件的任意模型 C 的最小描述长度：(1) K(C) ≤ k——模型本身描述简短；(2) K(x|C) ≤ K(x) − k + O(1)——给定模型，x 仍需大约 K(x)−k 位来指定，意味着 x 在模型中是「典型」的而非特殊的。"
          )}
        </p>

        <Math
          display
          label={t("Sophistication (Vitányi)", "精妙性（Vitányi 定义）")}
          tex="\mathrm{soph}(x) = \min\bigl\{K(C) : K(C) \leq k,\; K(x \mid C) \leq K(x) - k + O(1)\bigr\}"
        />

        <p>
          {t(
            "Intuitively: sophistication asks 'what is the shortest description of the best model for x?' A random string has soph(x) ≈ 0 — the best model is just 'all strings of length n', which is trivial to describe. A string that is the output of a complex but compressible computation has high sophistication: you need a non-trivial model to compress it.",
            "直观地说：精妙性问的是「x 的最佳模型的最短描述是什么？」随机字符串 soph(x) ≈ 0——最佳模型就是「所有长度为 n 的字符串」，描述起来很简单。而复杂但可压缩计算的输出字符串精妙性很高：你需要一个非平凡的模型来压缩它。"
          )}
        </p>

        <Collapsible
          title={t("Why sophistication is subtle to define", "为什么精妙性定义微妙")}
        >
          <p className="text-sm">
            {t(
              "The definition above looks circular: we optimize over models C while the threshold k appears on both sides of the constraint. The subtlety is the balance condition K(x|C) ≤ K(x) − k: it says that K(C) + K(x|C) ≤ K(x) + O(1), which means the two-part code (model + residual) is essentially as efficient as the raw Kolmogorov code. This is the 'meaningful' condition: C captures exactly the structured part of x, leaving only the random residue.",
              "上面的定义看起来是循环的：我们在模型 C 上优化，而阈值 k 出现在约束的两边。微妙之处在于平衡条件 K(x|C) ≤ K(x) − k：它说 K(C) + K(x|C) ≤ K(x) + O(1)，意味着两部分编码（模型 + 残差）与原始 Kolmogorov 编码同样高效。这是「有意义」的条件：C 恰好捕捉了 x 的结构部分，只留下随机残差。"
            )}
          </p>
          <p className="text-sm">
            {t(
              "The problem is that sophistication is only definable up to additive O(log K(x)) terms and is not computable. But as a theoretical concept it is the right one: it separates 'structure' from 'noise' in a principled way.",
              "问题是精妙性只能定义到加法 O(log K(x)) 项，且不可计算。但作为理论概念它是正确的：它以有原则的方式将「结构」与「噪声」分离。"
            )}
          </p>
        </Collapsible>

        {/* ============ 4. Complextropy Defined ============ */}
        <h2>{t("4. Complextropy Defined", "4. 复杂熵的定义")}</h2>

        <p>
          {t(
            "Sophistication is the right idea, but it is technically fragile: small changes in k can cause soph(x) to jump discontinuously. Aaronson proposes a smoother, more robust measure called complextropy. The intuition is to minimize, over all models C, the total two-part description length — model size plus residual — subject to neither part being trivial:",
            "精妙性是正确的思路，但技术上很脆弱：k 的微小变化可能导致 soph(x) 不连续跳跃。Aaronson 提出了一个更平滑、更鲁棒的度量，称为复杂熵。其直觉是在所有模型 C 上最小化总两部分描述长度——模型大小加上残差——条件是两部分都不平凡："
          )}
        </p>

        <Math
          display
          label={t("Complextropy (informal)", "复杂熵（非正式定义）")}
          tex="\mathrm{compl}(x) \;\approx\; \min_{C}\;\bigl[K(C) + K(x \mid C)\bigr] \quad \text{with balance constraint}"
        />

        <p>
          {t(
            "Without the balance constraint, this minimum equals K(x) (just take C to be the empty model) — not interesting. The balance constraint says that neither K(C) nor K(x|C) dominates: we want a model that genuinely compresses x, not one that either explains everything (memorization) or nothing (trivial model).",
            "没有平衡约束，这个最小值等于 K(x)（只需取 C 为空模型）——不有趣。平衡约束说的是 K(C) 和 K(x|C) 都不能主导：我们需要一个真正压缩 x 的模型，而不是解释一切（记忆）或什么都不解释（平凡模型）。"
          )}
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {t("Complextropy vs. entropy vs. sophistication", "复杂熵 vs. 熵 vs. 精妙性")}
          </p>
          <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <div className="grid grid-cols-[160px_1fr] gap-x-3">
              <span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 rounded px-1 py-0.5 self-start mt-0.5">entropy H</span>
              <span>{t("Measures disorder / missing information. Monotone increasing. Does not capture structure.", "衡量混乱度/缺失信息。单调递增。不能捕捉结构。")}</span>
              <span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 rounded px-1 py-0.5 self-start mt-1">K(x)</span>
              <span>{t("Shortest program length. High for random strings, low for structured ones. But random noise maximizes it.", "最短程序长度。随机字符串高，结构化字符串低。但随机噪声使其最大化。")}</span>
              <span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 rounded px-1 py-0.5 self-start mt-1">soph(x)</span>
              <span>{t("Shortest useful model. Near 0 for noise, high for structured data. Technically unstable.", "最短有用模型。噪声近 0，结构化数据高。技术上不稳定。")}</span>
              <span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 rounded px-1 py-0.5 self-start mt-1">compl(x)</span>
              <span>{t("Balanced two-part code. Near 0 for noise and uniform gas, high for organisms and brains. The proposed right notion.", "平衡的两部分编码。噪声和均匀气体近 0，生命体和大脑高。提出的正确概念。")}</span>
            </div>
          </div>
        </div>

        <Collapsible
          title={t("Technical note: why the balance constraint matters", "技术说明：为什么平衡约束重要")}
        >
          <p className="text-sm">
            {t(
              "Consider two degenerate solutions. (1) Take C to encode x entirely: K(C) ≈ K(x), K(x|C) ≈ 0. Total ≈ K(x) but K(C) is large — C is a lookup table, not a 'model'. (2) Take C to be empty: K(C) ≈ 0, K(x|C) = K(x). Total ≈ K(x) but K(x|C) is large — C explains nothing. Both achieve the same total cost but neither is useful. The balance constraint rules them both out, forcing C to be a genuinely informative intermediate model.",
              "考虑两种退化解。(1) 让 C 完全编码 x：K(C) ≈ K(x)，K(x|C) ≈ 0。总计 ≈ K(x) 但 K(C) 很大——C 是查找表，不是「模型」。(2) 让 C 为空：K(C) ≈ 0，K(x|C) = K(x)。总计 ≈ K(x) 但 K(x|C) 很大——C 什么都没解释。两者总成本相同但都没用。平衡约束排除了两者，迫使 C 成为真正有信息量的中间模型。"
            )}
          </p>
        </Collapsible>

        {/* ============ 5. The First Law Conjecture ============ */}
        <h2>{t("5. The First Law Conjecture", "5. 第一定律猜想")}</h2>

        <p>
          {t(
            "With complextropy defined, Aaronson states the conjecture that he calls the First Law of Complexodynamics:",
            "在定义了复杂熵之后，Aaronson 陈述了他称为「复杂动力学第一定律」的猜想："
          )}
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-6">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            {t("First Law of Complexodynamics (conjecture)", "复杂动力学第一定律（猜想）")}
          </p>
          <p className="text-sm text-blue-900 dark:text-blue-200 mb-0">
            {t(
              "For a typical closed physical system evolving from a low-entropy initial state: complextropy first increases over time, reaches a maximum at some intermediate time, and then decreases toward near zero as the system approaches thermal equilibrium.",
              "对于从低熵初始状态演化的典型封闭物理系统：复杂熵随时间先增加，在某个中间时刻达到最大值，然后随着系统趋近热平衡而降低至接近零。"
            )}
          </p>
        </div>

        <p>
          {t(
            "This is a conjecture, not a theorem. The difficulty is both technical (Kolmogorov complexity is not computable) and conceptual (what does 'typical closed system' mean precisely?). But the intuitive content is crisp: there is a sense in which the universe has been on the rising phase of its complextropy arc ever since the Big Bang, with the long-run heat death being the eventual descent.",
            "这是一个猜想，不是定理。困难既是技术性的（Kolmogorov 复杂度不可计算），也是概念性的（「典型封闭系统」究竟意味着什么？）。但直觉内容很清晰：从某种意义上说，自大爆炸以来宇宙一直处于复杂熵弧线的上升阶段，而长远的热寂是最终的下降。"
          )}
        </p>

        <p>
          {t(
            "Why should complextropy first increase? Because starting from a fully correlated low-entropy state, the system begins generating structure: correlations between distant parts that are non-trivial to describe but that can be captured by a good model. Why should it then decrease? Because as the system fully thermalizes, those correlations wash out into pure noise — which is low-complextropy for the reason that a random string has soph ≈ 0.",
            "为什么复杂熵应该先增加？因为从完全相关的低熵状态开始，系统开始产生结构：远距离部分之间的关联，描述起来非平凡但可以被好的模型捕捉。为什么之后会减少？因为随着系统完全热化，那些关联消散为纯噪声——这是低复杂熵的，原因是随机字符串的精妙性 ≈ 0。"
          )}
        </p>

        {/* ============ 6. Three Examples ============ */}
        <h2>{t("6. Three Examples: Noise, Crystal, Organism", "6. 三个例子：噪声、晶体、生命体")}</h2>

        <p>
          {t(
            "To make the definitions concrete, consider three canonical objects and how they fare on complextropy:",
            "为了使定义具体化，考虑三个典型对象以及它们在复杂熵上的表现："
          )}
        </p>

        {/* Example 1 */}
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-rose-800 dark:text-rose-300 mb-1">
            {t("Example 1: Random noise (high-entropy gas at equilibrium)", "例1：随机噪声（处于平衡态的高熵气体）")}
          </p>
          <p className="text-sm text-rose-900 dark:text-rose-200 mb-0">
            {t(
              "A string of random bits has K(x) ≈ |x| — nearly incompressible. Its entropy is maximal. But what is soph(x)? The only 'model' for a random string is the trivial one: 'all strings of this length'. K(C) ≈ O(log |x|), and K(x|C) ≈ K(x). The total K(C) + K(x|C) ≈ K(x), but neither term is genuinely reduced by the model. Complextropy ≈ 0. Random noise is complex in the entropy sense but not in the complextropy sense — there is nothing to model.",
              "随机比特字符串 K(x) ≈ |x|——几乎不可压缩。其熵最大。但 soph(x) 是多少？随机字符串的唯一「模型」是平凡的：「所有这个长度的字符串」。K(C) ≈ O(log |x|)，K(x|C) ≈ K(x)。总计 K(C) + K(x|C) ≈ K(x)，但模型没有真正减少任何一项。复杂熵 ≈ 0。随机噪声在熵的意义上复杂，但在复杂熵的意义上不复杂——没有什么可建模的。"
            )}
          </p>
        </div>

        {/* Example 2 */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
            {t("Example 2: Perfect crystal (low-entropy, highly ordered)", "例2：完美晶体（低熵，高度有序）")}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-0">
            {t(
              "A perfect crystal — say, a string 'ABABAB...AB' of length n — has K(x) ≈ O(log n): very compressible. Its entropy is nearly zero. The best model C is the pattern 'AB repeated n/2 times', which has K(C) ≈ O(log n). Given C, K(x|C) ≈ 0 — the string is fully determined by the model. So K(C) + K(x|C) ≈ O(log n) ≈ 0. Complextropy ≈ 0. Crystals are simple in both the entropy sense and the complextropy sense.",
              "完美晶体——比如长度为 n 的字符串「ABABAB...AB」——K(x) ≈ O(log n)：非常可压缩。其熵几乎为零。最佳模型 C 是模式「AB 重复 n/2 次」，K(C) ≈ O(log n)。给定 C，K(x|C) ≈ 0——字符串完全由模型确定。所以 K(C) + K(x|C) ≈ O(log n) ≈ 0。复杂熵 ≈ 0。晶体在熵的意义上和复杂熵的意义上都很简单。"
            )}
          </p>
        </div>

        {/* Example 3 */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
            {t("Example 3: A living organism (medium entropy, high sophistication)", "例3：生命体（中等熵，高精妙性）")}
          </p>
          <p className="text-sm text-emerald-900 dark:text-emerald-200 mb-0">
            {t(
              "The genome and molecular machinery of a bacterium is neither perfectly random nor perfectly regular. It has genuine structure — genetic code, metabolic pathways, regulatory networks — that can be partially described by a model C of non-trivial length. Given C, K(x|C) is still large (there are many specific details the model does not capture). Both K(C) and K(x|C) are large and comparable. Complextropy is high. The organism is in the interesting middle: it has structure worth modeling, and residual specificity worth noting.",
              "细菌的基因组和分子机器既不完全随机也不完全规则。它有真实的结构——遗传密码、代谢途径、调控网络——可以由非平凡长度的模型 C 部分描述。给定 C，K(x|C) 仍然很大（有许多特定细节模型没有捕捉到）。K(C) 和 K(x|C) 都很大且可比。复杂熵很高。生命体处于有趣的中间地带：它有值得建模的结构，也有值得注意的残差特异性。"
            )}
          </p>
        </div>

        <p>
          {t(
            "The arc from Big Bang to heat death passes through all three regimes: from an initial near-crystal (ultra-low-entropy vacuum state) through the interesting middle (stars, planets, life) to a final near-random noise (thermal equilibrium). Complextropy rises and then falls, tracing the bell curve of cosmic history.",
            "从大爆炸到热寂的弧线经历了所有三种状态：从初始的近晶体（超低熵真空态）经过有趣的中间地带（恒星、行星、生命）到最终的近随机噪声（热平衡）。复杂熵先升后降，描绘出宇宙历史的钟形曲线。"
          )}
        </p>

        {/* ============ 7. Why This Matters for Intelligence ============ */}
        <h2>{t("7. Why This Matters for Understanding Intelligence", "7. 这对理解智能的意义")}</h2>

        <p>
          {t(
            "Aaronson's essay is not just physics. It has sharp implications for what 'intelligence' and 'learning' mean. If complextropy measures genuine structured complexity, then the goal of learning — in both biological and machine intelligence — is precisely to find the model C that achieves the balance: capturing real structure without memorizing noise.",
            "Aaronson 的文章不只是物理学。它对「智能」和「学习」的含义有深刻影响。如果复杂熵衡量真实的结构化复杂性，那么学习的目标——无论是生物智能还是机器智能——恰好是找到实现平衡的模型 C：捕捉真实结构而不记忆噪声。"
          )}
        </p>

        <p>
          {t(
            "A neural network that memorizes its training data has found a model C with K(C) ≈ K(x) — it is a lookup table. The residual K(x|C) is near zero, but C itself is expensive. This is low-complextropy in the bad way: the model is not generalizing. A network that learns genuine features — grammar, physics, causal structure — has found a short C (the inductive bias built into the architecture plus learned weights) such that K(x|C) is small. That is high-complextropy intelligence.",
            "记忆训练数据的神经网络找到了 K(C) ≈ K(x) 的模型 C——它是查找表。残差 K(x|C) 接近零，但 C 本身代价高昂。这是坏的低复杂熵：模型没有泛化。学习真实特征的网络——语法、物理、因果结构——找到了简短的 C（内置于架构中的归纳偏置加上学习的权重），使得 K(x|C) 很小。这才是高复杂熵智能。"
          )}
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-900 dark:text-amber-200 mb-0">
            <span className="font-semibold">{t("Connection to generalization: ", "与泛化的联系：")}</span>
            {t(
              "Minimum description length (MDL) and Bayesian model selection both operationalize this balance. In MDL: the best model minimizes K(C) + K(data|C). In Bayesian inference: the posterior favors models with short description and high likelihood. Complextropy gives a physical grounding for why generalization is the right goal.",
              "最小描述长度（MDL）和贝叶斯模型选择都将这种平衡操作化。在 MDL 中：最佳模型最小化 K(C) + K(数据|C)。在贝叶斯推断中：后验倾向于描述简短且似然高的模型。复杂熵为什么泛化是正确目标提供了物理基础。"
            )}
          </p>
        </div>

        <Collapsible
          title={t("Complextropy and the bias-variance tradeoff", "复杂熵与偏差-方差权衡")}
        >
          <p className="text-sm">
            {t(
              "The classical bias-variance tradeoff is a special case of the complextropy balance. A high-bias model has K(C) small and K(x|C) large — underfitting. A high-variance model has K(C) large and K(x|C) small — overfitting. The sweet spot — the model that generalizes — is the one where K(C) and K(x|C) are both moderate and their sum is minimized. Double descent, where test error decreases again for very large models, can be understood as: large models find the minimum-norm interpolant, which has a specific structure (low effective K(C)) despite having many parameters.",
              "经典的偏差-方差权衡是复杂熵平衡的特例。高偏差模型 K(C) 小而 K(x|C) 大——欠拟合。高方差模型 K(C) 大而 K(x|C) 小——过拟合。泛化的最佳点——泛化的模型——是 K(C) 和 K(x|C) 都适中且其和最小的点。双重下降（非常大的模型测试误差再次下降）可以理解为：大模型找到了最小范数插值，尽管参数很多，但具有特定结构（有效 K(C) 低）。"
            )}
          </p>
        </Collapsible>

        {/* ============ 8. Connection to Coffee Automaton ============ */}
        <h2>{t("8. Connection to the Coffee Automaton", "8. 与咖啡自动机的联系")}</h2>

        <p>
          {t(
            "Aaronson illustrates the First Law with a thought experiment he calls the 'coffee automaton': a cellular automaton (like a discrete physics) starting from a state where one region is black (coffee) and the rest is white (cream). As the automaton runs, the two regions mix:",
            "Aaronson 用他称为「咖啡自动机」的思想实验来说明第一定律：一个细胞自动机（类似离散物理）从一个区域为黑色（咖啡）其余为白色（奶油）的状态开始。随着自动机运行，两个区域混合："
          )}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">⬛⬜</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-0">
              {t("t = 0: two clean blocks. Low entropy, low complextropy.", "t = 0：两个干净的块。低熵，低复杂熵。")}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🌀</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-0">
              {t("t = T: complex swirling pattern. High entropy, high complextropy.", "t = T：复杂旋涡模式。高熵，高复杂熵。")}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🩶</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-0">
              {t("t = ∞: uniform gray. Max entropy, near-zero complextropy.", "t = ∞：均匀灰色。最大熵，接近零复杂熵。")}
            </p>
          </div>
        </div>

        <p>
          {t(
            "At t = 0: the state is easy to describe — 'left half black, right half white'. K(x) is small. Complextropy is near zero because K(C) + K(x|C) is small (the model is simple and the residual is also small).",
            "在 t = 0：状态易于描述——「左半黑，右半白」。K(x) 很小。复杂熵接近零，因为 K(C) + K(x|C) 很小（模型简单，残差也小）。"
          )}
        </p>

        <p>
          {t(
            "At intermediate t: the swirling pattern cannot be described by a simple model (K(C) is large) but it also is not fully random — there are structures coming from the initial condition (K(x|C) is still non-trivial). Both terms are substantial. Complextropy is high.",
            "在中间 t 时：旋涡模式无法用简单模型描述（K(C) 很大），但也不完全随机——有来自初始条件的结构（K(x|C) 仍然非平凡）。两项都很大。复杂熵很高。"
          )}
        </p>

        <p>
          {t(
            "At t = ∞: uniform gray. K(x) is tiny. The best model is 'uniform distribution over all states', K(C) ≈ 0. K(x|C) ≈ K(x) ≈ 0 as well. Total complextropy ≈ 0.",
            "在 t = ∞：均匀灰色。K(x) 很小。最佳模型是「所有状态的均匀分布」，K(C) ≈ 0。K(x|C) ≈ K(x) ≈ 0 也是。总复杂熵 ≈ 0。"
          )}
        </p>

        <p>
          {t(
            "The coffee automaton is a microcosm of cosmic history. The universe started as coffee and cream in separate corners; it is now in the swirling phase; heat death will be the uniform gray. We — all the interesting structures — are the swirl.",
            "咖啡自动机是宇宙历史的缩影。宇宙开始时咖啡和奶油分别在各自角落；现在处于旋涡阶段；热寂将是均匀的灰色。我们——所有有趣的结构——就是那个旋涡。"
          )}
        </p>

        {/* ============ Back link ============ */}
        <div className="mt-14 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t("← Back to Papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
