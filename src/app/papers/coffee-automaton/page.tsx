"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function CoffeeAutomatonPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Quantifying the Rise and Fall of Complexity in Closed Systems: The Coffee Automaton",
            "量化封闭系统中复杂性的兴衰：咖啡自动机"
          )}
        </h1>
        <p className="text-paper-800/50">
          Aaronson, Carroll, Ouellette &middot; 2014 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1405.6903"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1405.6903
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "Entropy always increases (2nd law of thermodynamics), but complexity — like the swirling patterns of coffee and milk mixing — first rises, then falls. This paper formalizes that intuition using a cellular automaton and Kolmogorov complexity after coarse-graining. It shows that \"apparent complexity\" peaks at an intermediate time, connecting physics, information theory, and the story of complexity in our universe.",
              "熵总是增加的（热力学第二定律），但复杂性——比如咖啡和牛奶混合时的漩涡花纹——先上升，后下降。本文用元胞自动机和粗粒化后的柯尔莫哥洛夫复杂性将这一直觉形式化，证明\」表观复杂性\「在中间时刻达到峰值，将物理学、信息论与宇宙复杂性的故事联系在一起。"
            )}
          </p>
        </section>

        {/* ============ Section 1: The Coffee Question ============ */}
        <h2>{t("1. The Coffee Question", "1. 咖啡问题")}</h2>

        <p>
          {t(
            "Pour a splash of milk into your morning coffee. At first, you see a clear boundary: black coffee, white milk, sharply separated. Then you stir. The boundary explodes into intricate swirls — tendrils of white curling through the black, fractal-like eddies at every scale. Finally, after enough time, the cup is uniform: a homogeneous beige.",
            "往早晨的咖啡里倒入一点牛奶。起初，界限清晰：黑咖啡与白牛奶泾渭分明。然后你搅拌，界限炸裂成复杂的漩涡——白色触须在黑色中卷曲，各个尺度上都有分形般的涡流。最终，经过足够长的时间，杯子变得均匀：一片均匀的米色。"
          )}
        </p>

        <p>
          {t(
            "This mundane observation hides a deep puzzle. The Second Law of Thermodynamics tells us that entropy — disorder — monotonically increases. The coffee cup goes from low entropy (separated) to high entropy (mixed). But the complexity of the system does not monotonically increase. It rises from simple (separated layers) to complex (swirling patterns) and then falls back to simple (uniform gray). Entropy increases; complexity does not.",
            "这个平凡的现象隐藏着一个深刻的谜题。热力学第二定律告诉我们，熵——混乱度——单调增加。咖啡杯从低熵（分离）走向高熵（混合）。但系统的复杂性并不单调增加：它从简单（分离的层）上升到复杂（漩涡花纹），再下降回简单（均匀的灰色）。熵增加，复杂性却不增加。"
          )}
        </p>

        <p>
          {t(
            "This paper asks: can we make this precise? Can we formally define complexity so that it provably rises and then falls in a closed physical system? And what does this tell us about complexity in the universe at large?",
            "本文提问：我们能将这一现象精确化吗？能否正式定义复杂性，使其在封闭物理系统中可证明地先升后降？这对宇宙中复杂性的整体故事意味着什么？"
          )}
        </p>

        {/* ============ Section 2: Entropy vs Complexity ============ */}
        <h2>{t("2. Entropy vs. Complexity", "2. 熵与复杂性")}</h2>

        <p>
          {t(
            "Entropy, in the Boltzmann sense, counts the number of microstates consistent with the macroscopic description of a system. For our coffee cup, entropy tracks how many ways the coffee and milk molecules could be arranged at a given moment. The Second Law guarantees this count only grows.",
            "玻尔兹曼意义上的熵，计算的是与系统宏观描述相符的微观状态数量。对于咖啡杯而言，熵追踪的是咖啡和牛奶分子在某一时刻可能排列的方式数量。第二定律保证这个数量只会增长。"
          )}
        </p>

        <p>
          {t(
            "Complexity is something different. Intuitively, a highly ordered state (all black on the left, all white on the right) is not complex — it is simple to describe. A completely random state (every pixel independently black or white) is also not complex in the interesting sense — it is just noise, also simple to describe (\"pick each color with probability 1/2\"). Complexity peaks somewhere in between: where there is structure, but structure that takes many bits to describe.",
            "复杂性则是另一回事。直觉上，高度有序的状态（左边全黑，右边全白）并不复杂——很容易描述。完全随机的状态（每个像素独立地随机黑或白）在有趣的意义上也不复杂——那只是噪声，同样很容易描述（\」每种颜色以1/2概率选取\「）。复杂性在两者之间的某处达到峰值：有结构，但需要很多比特来描述的结构。"
          )}
        </p>

        <p>
          {t(
            "The formal tool for measuring descriptive complexity is Kolmogorov complexity. The Kolmogorov complexity K(x) of a string x is the length of the shortest program that outputs x. A fully ordered state has low K (short program: \"output half black, half white\"). A fully random state also has low K in principle — but its apparent description, after coarse-graining, will be low too. It is the intermediate, swirling state that requires a long program to describe.",
            "度量描述复杂性的形式化工具是柯尔莫哥洛夫复杂性。字符串x的柯尔莫哥洛夫复杂性K(x)是输出x的最短程序的长度。完全有序的状态K值低（短程序：\」输出一半黑一半白\「）。完全随机的状态K值原则上也低——但其粗粒化后的表观描述也会是低的。是中间的漩涡状态需要一个很长的程序来描述。"
          )}
        </p>

        <Collapsible
          title={t("What is Kolmogorov complexity?", "什么是柯尔莫哥洛夫复杂性？")}
          defaultOpen={false}
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Kolmogorov complexity K(x) is defined relative to a fixed universal Turing machine U. Formally:",
                "柯尔莫哥洛夫复杂性K(x)是相对于固定的通用图灵机U定义的。形式上："
              )}
            </p>
            <Math
              display
              tex="K(x) = \min_{p : U(p) = x} |p|"
            />
            <p>
              {t(
                "where the minimum is over all programs p that cause U to output x, and |p| is the length of the program in bits. K(x) measures the information content of x — how compressible it is. Highly structured strings (like all zeros) have small K; truly random strings have K ≈ |x| (incompressible).",
                "其中最小值取遍所有使U输出x的程序p，|p|是程序的比特长度。K(x)度量x的信息含量——它的可压缩程度。高度结构化的字符串（如全零）K值小；真正随机的字符串K ≈ |x|（不可压缩）。"
              )}
            </p>
            <p>
              {t(
                "Key property: K is uncomputable in general (no algorithm can compute K(x) for all x). But it is a clean theoretical yardstick, and approximations (like compression algorithms) are computable.",
                "关键性质：K在一般情况下是不可计算的（没有算法能对所有x计算K(x)）。但它是一个清晰的理论标尺，其近似值（如压缩算法）是可计算的。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 3: The Coffee Automaton Setup ============ */}
        <h2>{t("3. The Coffee Automaton Setup", "3. 咖啡自动机的设置")}</h2>

        <p>
          {t(
            "To make things concrete and simulatable, the paper defines a cellular automaton that models the coffee-mixing process. A cellular automaton is a grid of cells, each in a discrete state, that evolves in synchronous discrete time steps according to a local rule.",
            "为了让问题具体且可模拟，本文定义了一个模拟咖啡混合过程的元胞自动机。元胞自动机是一个由细胞组成的网格，每个细胞处于离散状态，根据局部规则在同步的离散时间步中演化。"
          )}
        </p>

        <p>
          {t(
            "The coffee automaton uses a two-dimensional grid where each cell is either black (coffee, B) or white (milk, W). The initial state has all black cells on one side and all white cells on the other — a clean separation, like just-poured milk. The automaton evolves by probabilistically swapping adjacent cells, mimicking thermal diffusion.",
            "咖啡自动机使用一个二维网格，每个细胞要么是黑色（咖啡，B）要么是白色（牛奶，W）。初始状态是一侧全黑另一侧全白——干净的分离，就像刚倒入的牛奶。自动机通过概率性地交换相邻细胞来演化，模拟热扩散。"
          )}
        </p>

        <Collapsible
          title={t("Automaton evolution rules", "自动机演化规则")}
          defaultOpen={false}
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "At each time step, for each pair of adjacent cells (i, j) and (i, j+1) [or vertically], the automaton flips a coin:",
                "在每个时间步，对于每对相邻细胞(i, j)和(i, j+1)（或垂直方向），自动机抛一枚硬币："
              )}
            </p>
            <ul>
              <li>
                {t(
                  "With probability p: swap the two cells (regardless of their colors)",
                  "以概率p：交换这两个细胞（无论它们的颜色如何）"
                )}
              </li>
              <li>
                {t(
                  "With probability 1-p: leave them unchanged",
                  "以概率1-p：保持不变"
                )}
              </li>
            </ul>
            <p>
              {t(
                "This rule is reversible (swapping twice is identity), preserves the total number of black and white cells, and satisfies detailed balance — so the uniform mixed state is the equilibrium. The system will thermalize and all initial structure will eventually wash out.",
                "这个规则是可逆的（交换两次等于恒等变换），保持黑色和白色细胞的总数，并满足细致平衡条件——因此均匀混合状态是平衡态。系统将热化，所有初始结构最终都会消散。"
              )}
            </p>
          </div>
        </Collapsible>

        <p>
          {t(
            "The key parameters are: grid size N×N, initial condition (half black / half white), swap probability p, and observation time t. The system is a closed system — no energy or information flows in or out. Like a sealed coffee cup.",
            "关键参数为：网格大小N×N、初始条件（一半黑/一半白）、交换概率p和观测时间t。系统是封闭系统——没有能量或信息流入或流出。就像一个密封的咖啡杯。"
          )}
        </p>

        {/* ============ Section 4: Coarse-Graining and Apparent Complexity ============ */}
        <h2>
          {t(
            "4. Coarse-Graining and Apparent Complexity",
            "4. 粗粒化与表观复杂性"
          )}
        </h2>

        <p>
          {t(
            "Here is the central technical idea. The fully fine-grained state of the coffee automaton at late times looks random — and indeed, the Kolmogorov complexity K(x) of the raw state is high (near-random). But when you look at the cup with your naked eye, you do not see individual molecules. You see regions of roughly uniform color. This is coarse-graining.",
            "这里是核心技术思想。咖啡自动机在晚期的完全精细粒度状态看起来是随机的——事实上，原始状态的柯尔莫哥洛夫复杂性K(x)很高（接近随机）。但当你用肉眼看杯子时，你看不到单个分子。你看到的是大致均匀颜色的区域。这就是粗粒化。"
          )}
        </p>

        <p>
          {t(
            "Coarse-graining at resolution ε means: divide the grid into blocks of size ε×ε, and replace each block with its average color (the fraction of black cells in the block). The coarse-grained state x_ε is a lower-resolution image of the system.",
            "在分辨率ε下粗粒化意味着：将网格划分为ε×ε大小的块，用每个块的平均颜色（块中黑色细胞的比例）替换每个块。粗粒化状态x_ε是系统的低分辨率图像。"
          )}
        </p>

        <Math
          display
          label={t("Coarse-grained state", "粗粒化状态")}
          tex="x_\varepsilon[i,j] = \frac{1}{\varepsilon^2} \sum_{(i',j') \in \text{block}(i,j)} x[i',j']"
        />

        <p>
          {t(
            "The apparent complexity at resolution ε is then simply the Kolmogorov complexity of the coarse-grained image:",
            "在分辨率ε下的表观复杂性就是粗粒化图像的柯尔莫哥洛夫复杂性："
          )}
        </p>

        <Math
          display
          label={t("Apparent complexity", "表观复杂性")}
          tex="\mathrm{AC}_\varepsilon(x) = K(x_\varepsilon)"
        />

        <p>
          {t(
            "Intuitively: AC_ε(x) answers the question \"how hard is it to describe what this system looks like from a distance of ε?\" It strips away fine-grained randomness that an observer at resolution ε cannot see anyway.",
            "直觉上：AC_ε(x)回答的问题是\」从ε的距离观察，描述这个系统的外观有多难？\「它去除了分辨率ε的观察者无论如何都看不到的精细粒度随机性。"
          )}
        </p>

        <Collapsible
          title={t("Why raw K(x) fails to capture complexity", "为什么原始K(x)无法捕捉复杂性")}
          defaultOpen={false}
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Consider the three phases of the coffee cup:",
                "考虑咖啡杯的三个阶段："
              )}
            </p>
            <ul>
              <li>
                <strong>{t("Phase 1 (t=0, separated):", "阶段1（t=0，分离）：")}</strong>{" "}
                {t(
                  "K(x) is low — the state is \"all black left half, all white right half\", compressible.",
                  "K(x)低——状态是\「左半全黑，右半全白\」，可压缩。"
                )}
              </li>
              <li>
                <strong>{t("Phase 2 (t=intermediate, swirling):", "阶段2（t=中间，旋转）：")}</strong>{" "}
                {t(
                  "K(x) is high — the fine-grained state is complex, because the exact position of every molecule encodes a long random history.",
                  "K(x)高——精细粒度状态很复杂，因为每个分子的精确位置编码了一段很长的随机历史。"
                )}
              </li>
              <li>
                <strong>{t("Phase 3 (t=∞, uniform gray):", "阶段3（t=∞，均匀灰色）：")}</strong>{" "}
                {t(
                  "K(x) is still high — the fine-grained state is maximally random (thermal equilibrium), so K(x) ≈ N².",
                  "K(x)仍然高——精细粒度状态是最大随机的（热平衡），所以K(x) ≈ N²。"
                )}
              </li>
            </ul>
            <p>
              {t(
                "So raw K(x) only goes up (tracking entropy). It never comes back down. It fails to capture the interesting non-monotonicity. Coarse-graining is the fix: AC_ε(x) is low in phase 1 (simple pattern), high in phase 2 (complex swirls), and low in phase 3 (uniform gray, compressible as \"constant ≈ 0.5\").",
                "所以原始K(x)只会上升（追踪熵）。它从不下降。它无法捕捉有趣的非单调性。粗粒化是解决方案：AC_ε(x)在阶段1低（简单花纹），在阶段2高（复杂漩涡），在阶段3低（均匀灰色，可压缩为\」常数\u22480.5\「）。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 5: The Three Phases ============ */}
        <h2>{t("5. The Three Phases", "5. 三个阶段")}</h2>

        <p>
          {t(
            "The coffee automaton simulation confirms the three-phase picture with precision:",
            "咖啡自动机模拟精确地确认了三阶段图景："
          )}
        </p>

        <div className="space-y-4 my-6">
          <div className="p-4 bg-white border border-paper-200 rounded-lg dark:bg-paper-900 dark:border-paper-700">
            <div className="flex items-start gap-3">
              <span className="inline-block mt-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <strong>
                  {t("Initially ordered (t = 0)", "初始有序（t = 0）")}
                </strong>
                <p className="text-sm mt-1">
                  {t(
                    "The system starts in a low-entropy, low-complexity state: half black, half white, perfectly separated. The coarse-grained image is easy to describe — one edge, two colors. AC_ε is small.",
                    "系统从低熵、低复杂性的状态开始：一半黑，一半白，完美分离。粗粒化图像很容易描述——一条边，两种颜色。AC_ε很小。"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-paper-200 rounded-lg dark:bg-paper-900 dark:border-paper-700">
            <div className="flex items-start gap-3">
              <span className="inline-block mt-0.5 w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <strong>
                  {t("Complex mixing patterns (t = intermediate)", "复杂混合花纹（t = 中间）")}
                </strong>
                <p className="text-sm mt-1">
                  {t(
                    "As cells mix, intricate patterns emerge. At intermediate times, the coarse-grained image shows complex spatial structure — tendrils, gradients, islands of black in white and white in black. No short description captures this. AC_ε peaks.",
                    "随着细胞混合，复杂的花纹出现。在中间时刻，粗粒化图像显示出复杂的空间结构——触须、渐变、黑中的白岛和白中的黑岛。没有简短的描述能捕捉这一点。AC_ε达到峰值。"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-paper-200 rounded-lg dark:bg-paper-900 dark:border-paper-700">
            <div className="flex items-start gap-3">
              <span className="inline-block mt-0.5 w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <strong>
                  {t("Homogeneous gray (t → ∞)", "均匀灰色（t → ∞）")}
                </strong>
                <p className="text-sm mt-1">
                  {t(
                    "At equilibrium, every block has roughly equal fractions of black and white. The coarse-grained image is approximately uniform gray. It can be described very compactly: \"constant 0.5 everywhere\". AC_ε collapses near zero.",
                    "在平衡态，每个块的黑色和白色比例大致相等。粗粒化图像近似均匀灰色。它可以非常紧凑地描述：\」处处为常数0.5\「。AC_ε接近零。"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p>
          {t(
            "Throughout all three phases, the fine-grained entropy H(x) is non-decreasing — it starts low and plateaus at its maximum. This is consistent with the Second Law. But AC_ε(x) traces out an arc: low → high → low. The two quantities measure genuinely different things.",
            "在整个三个阶段中，精细粒度熵H(x)是非递减的——它从低值开始，达到最大值后趋于平稳。这与第二定律一致。但AC_ε(x)描绘出一段弧线：低→高→低。这两个量度量的是真正不同的东西。"
          )}
        </p>

        {/* ============ Section 6: Mathematical Formalization ============ */}
        <h2>{t("6. Mathematical Formalization", "6. 数学形式化")}</h2>

        <p>
          {t(
            "The paper provides rigorous definitions for the quantities involved. Let x ∈ {0,1}^{N×N} be a state of the N×N grid. Define entropy and apparent complexity as follows:",
            "本文为所涉及的量提供了严格定义。设x ∈ {0,1}^{N×N}为N×N网格的一个状态。定义熵和表观复杂性如下："
          )}
        </p>

        <Math
          display
          label={t("Fine-grained entropy (always increases)", "精细粒度熵（始终增加）")}
          tex="H(x_t) \;\leq\; H(x_{t+1}) \quad \forall\, t \geq 0"
        />

        <p>
          {t(
            "Here H(x) is the Shannon entropy of the probability distribution over fine-grained states consistent with the coarse-grained observation. The Second Law guarantees this is monotone.",
            "这里H(x)是与粗粒化观察一致的精细粒度状态概率分布的香农熵。第二定律保证这是单调的。"
          )}
        </p>

        <Math
          display
          label={t("Apparent complexity at resolution ε", "分辨率ε下的表观复杂性")}
          tex="\mathrm{AC}_\varepsilon(x) = K(x_\varepsilon) = K\!\left(\left\{\frac{1}{\varepsilon^2}\sum_{(i',j') \in \text{block}_{ij}} x[i',j']\right\}_{i,j}\right)"
        />

        <p>
          {t(
            "The key finding: there exists a time t* such that AC_ε(x_{t*}) > AC_ε(x_0) and AC_ε(x_{t*}) > AC_ε(x_∞). The complexity has a non-monotone arc.",
            "关键发现：存在一个时刻t*，使得AC_ε(x_{t*}) > AC_ε(x_0)且AC_ε(x_{t*}) > AC_ε(x_∞)。复杂性具有非单调的弧线。"
          )}
        </p>

        <p>
          {t(
            "The paper also introduces complextropy as a way to define a single complexity measure by minimizing over all coarse-graining scales:",
            "本文还引入了\」复熵\「（complextropy），通过对所有粗粒化尺度取最小值来定义单一复杂性度量："
          )}
        </p>

        <Math
          display
          label={t("Complextropy", "复熵")}
          tex="\mathcal{C}(x) \;\approx\; \min_{\varepsilon} \,\mathrm{AC}_\varepsilon(x) \;=\; \min_\varepsilon K(x_\varepsilon)"
        />

        <Collapsible
          title={t("Intuition for complextropy", "复熵的直觉")}
          defaultOpen={false}
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Why minimize over ε? Because we want to find the coarse-graining scale at which the state is hardest to describe — the scale that reveals the most interesting structure. At very fine ε, we see noise (high K but not interesting). At very coarse ε, we see nothing (the image is a single gray square). Somewhere in between is the sweet spot where the structure is genuinely complex.",
                "为什么要对ε取最小值？因为我们想找到最难描述状态的粗粒化尺度——揭示最有趣结构的尺度。在非常细的ε下，我们看到噪声（高K但不有趣）。在非常粗的ε下，我们什么都看不到（图像是一个灰色方块）。两者之间的某处是结构真正复杂的甜蜜点。"
              )}
            </p>
            <p>
              {t(
                "Complextropy is related to the concept from Aaronson's earlier work: it is the minimum over ε of AC_ε, and it peaks at intermediate times — formalizing the intuition that interesting complexity lives between perfect order and perfect chaos.",
                "复熵与Aaronson早期工作中的概念相关：它是AC_ε对ε的最小值，在中间时刻达到峰值——形式化了有趣的复杂性存在于完美秩序和完美混沌之间的直觉。"
              )}
            </p>
          </div>
        </Collapsible>

        <p>
          {t(
            "The relationship between entropy H and apparent complexity AC_ε can be summarized compactly. Let x_0 be the initial state, x_t the state at time t, and x_∞ the equilibrium state:",
            "熵H与表观复杂性AC_ε之间的关系可以简洁地总结。设x_0为初始状态，x_t为时刻t的状态，x_∞为平衡态："
          )}
        </p>

        <Math
          display
          label={t("Summary of monotonicity", "单调性总结")}
          tex="\underbrace{H(x_0) \leq H(x_t) \leq H(x_\infty)}_{\text{monotone (2nd law)}} \qquad \underbrace{\mathrm{AC}_\varepsilon(x_0) \lesssim \mathrm{AC}_\varepsilon(x_{t^*}) \gtrsim \mathrm{AC}_\varepsilon(x_\infty)}_{\text{non-monotone (complexity)}}"
        />

        {/* ============ Section 7: Connection to Complexodynamics ============ */}
        <h2>
          {t(
            "7. Connection to the First Law of Complexodynamics",
            "7. 与复杂动力学第一定律的联系"
          )}
        </h2>

        <p>
          {t(
            "This paper is directly motivated by Scott Aaronson's earlier essay \"Why Philosophers Should Care About Computational Complexity\" (2011), which introduced the term complextropy and posed the question: is there a formal analog of entropy for complexity — a quantity that tracks the interesting structure of a system rather than just its disorder?",
            "本文直接受到Scott Aaronson早期文章《为什么哲学家应该关心计算复杂性》（2011年）的启发，该文章引入了\」复熵\「这一术语，并提出问题：是否存在复杂性的正式熵类比——一个追踪系统有趣结构而非仅仅追踪其混乱程度的量？"
          )}
        </p>

        <p>
          {t(
            "The coffee automaton paper provides concrete evidence for what Aaronson called the \"First Law of Complexodynamics\": complexity first increases, then decreases, as a closed system evolves from an ordered initial state to thermal equilibrium. It is not a law in the strict sense (unlike the Second Law of Thermodynamics), but a robust empirical finding confirmed in the automaton setting.",
            "咖啡自动机论文为Aaronson所称的\」复杂动力学第一定律\「提供了具体证据：当封闭系统从有序初始状态演化到热平衡时，复杂性先增加，后减少。它不是严格意义上的定律（不像热力学第二定律），而是在自动机设置中确认的稳健经验发现。"
          )}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6 dark:bg-amber-950/30 dark:border-amber-800">
          <p className="text-sm mb-0">
            <strong>
              {t(
                "The key asymmetry between entropy and complexity:",
                "熵与复杂性之间的关键不对称性："
              )}
            </strong>{" "}
            {t(
              "Entropy is a function of the probability distribution over microstates — it is a property of our knowledge. Complexity (apparent complexity / complextropy) is a property of the coarse-grained state itself — what the system looks like at a given resolution. This distinction is physically meaningful: an observer with limited resolution will perceive complex patterns even when the fine-grained state is already maximally entropic.",
              "熵是微观状态概率分布的函数——它是我们知识的性质。复杂性（表观复杂性/复熵）是粗粒化状态本身的性质——系统在给定分辨率下的外观。这种区分在物理上是有意义的：有限分辨率的观察者即使在精细粒度状态已经最大熵时，也会感知到复杂的花纹。"
            )}
          </p>
        </div>

        <p>
          {t(
            "The paper also notes that complextropy is related to logical depth (Bennett 1988): the time required by an optimal program to reproduce the coarse-grained state. A state with high complextropy is one that is hard to describe but also hard to produce — it takes a long computation to generate it from a short description.",
            "本文还指出，复熵与逻辑深度（Bennett 1988）相关：最优程序重现粗粒化状态所需的时间。高复熵的状态既难以描述又难以产生——从简短描述生成它需要长时间的计算。"
          )}
        </p>

        {/* ============ Section 8: Why This Matters for AI and Physics ============ */}
        <h2>
          {t(
            "8. Why This Matters for AI and Physics",
            "8. 这对AI和物理学的意义"
          )}
        </h2>

        <p>
          {t(
            "The coffee automaton is a toy model, but its implications are profound.",
            "咖啡自动机是一个玩具模型，但其含义是深刻的。"
          )}
        </p>

        <p>
          {t(
            "For physics: the universe started in a very low-entropy state (the Big Bang). Entropy has been increasing ever since. But the universe has also been getting more complex — stars, galaxies, planets, life, minds emerged where none existed before. The Second Law cannot explain this: rising entropy should lead to eventual heat death (maximum disorder), not increasing complexity. The coffee automaton framework suggests that complexity is a transient, non-monotone quantity: we are in the \"rising complexity\" phase of the universe's arc.",
            "对物理学而言：宇宙起始于一个极低熵的状态（大爆炸）。此后熵一直在增加。但宇宙也变得越来越复杂——恒星、星系、行星、生命、心智在原本不存在的地方出现了。第二定律无法解释这一点：熵的增加应该导致最终的热寂（最大混乱），而不是复杂性的增加。咖啡自动机框架表明，复杂性是一个短暂的、非单调的量：我们正处于宇宙弧线的\」复杂性上升\「阶段。"
          )}
        </p>

        <p>
          {t(
            "For AI and machine learning: the coarse-graining framework has a direct analog in representation learning. A neural network that learns to represent data is doing something like coarse-graining: it is compressing the raw input (which may be high-entropy) into a compact representation that captures structure at the right level of abstraction. The question of what makes a good representation is related to the question of what resolution ε minimizes AC_ε — where is the information that is genuinely complex and useful?",
            "对AI和机器学习而言：粗粒化框架在表示学习中有直接类比。学习表示数据的神经网络做的事情类似于粗粒化：它将原始输入（可能是高熵的）压缩成紧凑的表示，在适当的抽象层次上捕捉结构。什么使得一个表示良好，这个问题与什么分辨率ε最小化AC_ε相关——哪里是真正复杂且有用的信息？"
          )}
        </p>

        <p>
          {t(
            "For complexity theory: Kolmogorov complexity is uncomputable, but the ideas here suggest practical approximations. Compression algorithms like gzip or LZMA approximate K(x); applying them to coarse-grained images gives computable versions of AC_ε. This has been used in practice to detect structure in time series, images, and biological data.",
            "对复杂性理论而言：柯尔莫哥洛夫复杂性是不可计算的，但这里的思想表明了实际近似方法。gzip或LZMA等压缩算法近似K(x)；将它们应用于粗粒化图像给出AC_ε的可计算版本。这在实践中已被用于检测时间序列、图像和生物数据中的结构。"
          )}
        </p>

        <Collapsible
          title={t("The universe as a coffee cup", "宇宙作为咖啡杯")}
          defaultOpen={false}
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Carroll and collaborators (including in this paper) have argued that the universe's history maps onto the three phases of the coffee automaton:",
                "Carroll及其合作者（包括在本文中）认为，宇宙的历史映射到咖啡自动机的三个阶段："
              )}
            </p>
            <ul>
              <li>
                <strong>{t("Phase 1 — Early universe:", "阶段1——早期宇宙：")}</strong>{" "}
                {t(
                  "Low entropy, low complexity. Smooth, nearly uniform plasma. Simple to describe (homogeneous + small perturbations).",
                  "低熵，低复杂性。光滑、近乎均匀的等离子体。简单描述（均匀+小扰动）。"
                )}
              </li>
              <li>
                <strong>{t("Phase 2 — Now:", "阶段2——现在：")}</strong>{" "}
                {t(
                  "Intermediate entropy, high complexity. Galaxies, stars, planets, biospheres, civilizations. Hard to describe at any resolution. This is where we live.",
                  "中等熵，高复杂性。星系、恒星、行星、生物圈、文明。在任何分辨率下都难以描述。这是我们生活的地方。"
                )}
              </li>
              <li>
                <strong>{t("Phase 3 — Far future (heat death):", "阶段3——遥远未来（热寂）：")}</strong>{" "}
                {t(
                  "Maximum entropy, low complexity. Uniform background radiation. Simple to describe again (constant temperature everywhere). No stars, no life, no information processing.",
                  "最大熵，低复杂性。均匀的背景辐射。再次简单描述（处处恒温）。没有恒星，没有生命，没有信息处理。"
                )}
              </li>
            </ul>
            <p>
              {t(
                "The Second Law alone would predict a monotone march from Phase 1 to Phase 3. But the coffee automaton framework explains why Phase 2 is transient but real: complexity is a genuine physical quantity that rises and falls, and we happen to be living in the peak of that arc.",
                "单独的第二定律会预测从阶段1到阶段3的单调行进。但咖啡自动机框架解释了为什么阶段2是短暂但真实的：复杂性是一个真正的物理量，它先升后降，而我们恰好生活在那段弧线的峰值处。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Back ============ */}
        <div className="mt-12 pt-8 border-t border-paper-200 dark:border-paper-700">
          <Link
            href={`${basePath}/papers/top30`}
            className="text-sm text-blue-600 hover:underline"
          >
            {t("← Back to Top Papers", "← 返回精选论文")}
          </Link>
        </div>
      </article>
    </div>
  );
}
