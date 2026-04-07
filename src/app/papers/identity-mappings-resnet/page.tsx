"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function IdentityMappingsResNetPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Identity Mappings in Deep Residual Networks",
            "深度残差网络中的恒等映射"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-paper-200/50">
          He, Zhang, Ren, Sun &middot; ECCV 2016 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1603.05027"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1603.05027
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Original ResNet places activation (BN + ReLU) after the residual addition, breaking the shortcut into a non-identity path. This paper proposes pre-activation ResNet (ResNet v2): move BN and ReLU before the convolutions, so the shortcut is a perfect identity. The result: a clean additive recurrence x_L = x_l + Σ F_i that lets signals and gradients flow freely through hundreds of layers — enabling ResNet-1001 to achieve 4.62% error on CIFAR-10 vs. 7.61% for the original design.",
              "原始 ResNet 在残差相加之后才施加激活（BN + ReLU），这破坏了捷径路径的恒等性。本文提出预激活 ResNet（ResNet v2）：将 BN 和 ReLU 移到卷积之前，使捷径路径成为完美的恒等映射。结果是得到干净的加法递推式 x_L = x_l + Σ F_i，信号与梯度可以自由流经数百层——ResNet-1001 在 CIFAR-10 上达到 4.62% 错误率，而原始设计为 7.61%。"
            )}
          </p>
        </section>

        {/* FlowChart overview */}
        <FlowChart
          title={t("Pre-Activation ResNet: Key Idea", "预激活 ResNet：核心思想")}
          steps={[
            {
              title: t(
                "ResNet v1: Add → ReLU after residual sum — shortcut is NOT identity",
                "ResNet v1：残差相加后才 ReLU — 捷径路径不是恒等映射"
              ),
              color: "rose",
            },
            {
              title: t(
                "Problem: final ReLU blocks negative signals from passing through the skip connection",
                "问题：最终的 ReLU 阻止负值信号通过跳跃连接传播"
              ),
              color: "amber",
            },
            {
              title: t(
                "Key insight: if h(x) = x exactly, forward/backward paths are unobstructed",
                "关键洞察：若 h(x) = x 完全成立，前向/反向路径都畅通无阻"
              ),
              color: "blue",
            },
            {
              title: t(
                "Pre-activation: move BN → ReLU before each Conv (inside the residual branch)",
                "预激活：将 BN → ReLU 移到每个 Conv 之前（在残差分支内部）"
              ),
              color: "teal",
              children: [
                {
                  title: t(
                    "Block: BN → ReLU → Conv → BN → ReLU → Conv → Add",
                    "模块：BN → ReLU → Conv → BN → ReLU → Conv → Add"
                  ),
                  color: "gray",
                },
                {
                  title: t(
                    "Shortcut: pure identity — no activation applied",
                    "捷径：纯恒等映射——不施加任何激活"
                  ),
                  color: "gray",
                },
              ],
            },
            {
              title: t(
                "Math: x_L = x_l + Σ_{i=l}^{L-1} F(x_i, W_i) — clean additive recurrence",
                "数学：x_L = x_l + Σ_{i=l}^{L-1} F(x_i, W_i) — 干净的加法递推"
              ),
              color: "purple",
            },
            {
              title: t(
                "Result: ResNet-1001 on CIFAR-10: 4.62% error (vs. 7.61% original)",
                "结果：ResNet-1001 在 CIFAR-10 上：4.62% 错误率（vs. 原始 7.61%）"
              ),
              color: "green",
            },
          ]}
          arrows={[
            t("Motivates", "引出"),
            t("Core question", "核心问题"),
            t("Solution", "解决方案"),
            t("Enables", "实现"),
            t("Outcome", "结果"),
          ]}
          highlights={[
            {
              text: t("Perfect identity shortcut", "完美恒等捷径"),
              color: "green",
            },
            {
              text: t("Gradient always contains '1' — never vanishes", "梯度始终包含'1'——永不消失"),
              color: "blue",
            },
            {
              text: t("ResNet-1001: 4.62% CIFAR-10 error", "ResNet-1001：4.62% CIFAR-10 错误率"),
              color: "purple",
            },
          ]}
        />

        {/* ============ Section 1: ResNet v1 Recap ============ */}
        <h2>
          {t(
            "1. ResNet v1 Recap: Residual Blocks with Post-Activation",
            "1. ResNet v1 回顾：后激活残差模块"
          )}
        </h2>

        <p>
          {t(
            "The original ResNet (He et al., CVPR 2016) introduced the residual block to allow very deep networks to be trained. The key idea was to learn a residual function rather than the full mapping. For each building block, the output is:",
            "原始 ResNet（He et al., CVPR 2016）引入残差模块，使极深网络得以训练。核心思想是让网络学习残差函数而非完整映射。每个基本模块的输出为："
          )}
        </p>

        <Math display tex={"x_{l+1} = \\text{ReLU}\\bigl(x_l + F(x_l,\\, W_l)\\bigr)"} />

        <p>
          {t(
            "The building block follows the order: Conv → BN → ReLU → Conv → BN → Add → ReLU. In this design, the residual branch F(x, W) computes a transformation, and the result is added to the shortcut before a final ReLU is applied.",
            "该模块遵循如下顺序：Conv → BN → ReLU → Conv → BN → Add → ReLU。在这个设计中，残差分支 F(x, W) 计算变换，将结果与捷径相加后再施加最终的 ReLU。"
          )}
        </p>

        <div className="bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg p-4 my-6 font-mono text-sm">
          <p className="text-paper-500 dark:text-paper-400 mb-2 font-sans text-xs font-semibold uppercase tracking-wide">
            {t("ResNet v1 Block (Post-Activation)", "ResNet v1 模块（后激活）")}
          </p>
          <div className="space-y-1 text-paper-800 dark:text-paper-200">
            <div className="flex items-center gap-3">
              <span className="text-paper-400">│</span>
              <span>{t("x  (input)", "x  （输入）")}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-paper-400">├──</span>
              <span className="text-blue-700 dark:text-blue-400">{t("─── Conv ─── BN ─── ReLU ─── Conv ─── BN ───┐", "─── Conv ─── BN ─── ReLU ─── Conv ─── BN ───┐")}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-paper-400">│</span>
              <span className="text-paper-500 dark:text-paper-400 ml-12">{t("(residual branch F)", "（残差分支 F）")}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-paper-400">│</span>
              <span className="text-paper-800 dark:text-paper-200 ml-60">↓ Add</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-paper-400">└──────────────────────────────────────────</span>
              <span className="text-rose-600 dark:text-rose-400">ReLU</span>
              <span className="text-paper-400">←─┘</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-paper-400">│</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{t("x_{l+1}  (output, clipped by ReLU)", "x_{l+1}  （输出，被 ReLU 截断）")}</span>
            </div>
          </div>
        </div>

        <p>
          {t(
            "This design worked exceptionally well — ResNet-152 won ILSVRC 2015. But the authors noticed a subtle issue: that final ReLU prevents the shortcut from being a true identity mapping.",
            "这个设计效果非常好——ResNet-152 赢得了 ILSVRC 2015。但作者注意到一个微妙问题：最后那个 ReLU 阻止了捷径成为真正的恒等映射。"
          )}
        </p>

        {/* ============ Section 2: The Problem ============ */}
        <h2>
          {t(
            "2. The Hidden Problem: Broken Identity Path",
            "2. 隐藏的问题：被破坏的恒等路径"
          )}
        </h2>

        <p>
          {t(
            "In the original design, the shortcut connection feeds directly into an addition — but then a ReLU is applied to the sum. This means the effective shortcut mapping is not h(x) = x but rather:",
            "在原始设计中，捷径连接直接参与加法——但加法之后还有一个 ReLU。这意味着有效的捷径映射不是 h(x) = x，而是："
          )}
        </p>

        <Math display tex={"x_{l+1} = \\text{ReLU}(x_l + F_l) \\neq x_l + F_l"} />

        <p>
          {t(
            "The ReLU zeroes out all negative values. So any negative component in (x_l + F_l) is silently discarded. This has two harmful consequences:",
            "ReLU 将所有负值清零。因此 (x_l + F_l) 中任何负分量都被悄悄丢弃。这带来两个有害后果："
          )}
        </p>

        <ul>
          <li>
            {t(
              "Forward pass: information in negative activations cannot propagate — the shortcut is not truly \"free\"",
              "前向传播：负激活中的信息无法传播——捷径并非真正「畅通」"
            )}
          </li>
          <li>
            {t(
              "Backward pass: when the pre-ReLU sum is negative, the gradient is zero there — gradient flow is blocked",
              "反向传播：当 ReLU 前的和为负时，该处梯度为零——梯度流被阻断"
            )}
          </li>
        </ul>

        <p>
          {t(
            "The paper poses the question directly: what if we could guarantee the shortcut mapping h(x) = x is a perfect identity? Would that help very deep networks train more easily?",
            "论文直接提出问题：如果我们能保证捷径映射 h(x) = x 是完美的恒等映射，会怎样？这能帮助极深网络更容易训练吗？"
          )}
        </p>

        <Collapsible
          title={t(
            "Why does a clean identity shortcut matter so much?",
            "为什么干净的恒等捷径如此重要？"
          )}
        >
          <p>
            {t(
              "Think of a 1000-layer network. Each layer's output feeds as input to the next. If every shortcut is a perfect identity, then the output at layer L is related to the output at layer l by:",
              "想象一个 1000 层的网络。每层的输出作为下一层的输入。如果每个捷径都是完美恒等映射，则第 L 层的输出与第 l 层的输出之间的关系为："
            )}
          </p>
          <Math display tex={"x_L = x_l + \\sum_{i=l}^{L-1} F(x_i, W_i)"} />
          <p>
            {t(
              "This is a purely additive recurrence. Any layer l can directly \"see\" layer L through the shortcut — there is no multiplicative chain that could collapse to zero. By contrast, if each shortcut passes through even a mild nonlinearity, the effective path from l to L involves products of many Jacobians, which are prone to vanishing.",
              "这是一个纯加法递推式。任何第 l 层都可以通过捷径直接「看到」第 L 层——没有可能趋近于零的乘积链。相比之下，如果每个捷径都经过哪怕轻微的非线性变换，从 l 到 L 的有效路径就涉及许多 Jacobian 的乘积，容易消失。"
            )}
          </p>
          <p>
            {t(
              "The analogy: imagine a highway with on-ramps (the residual branches F_i) at each mile. If the highway itself is smooth and unobstructed, traffic (signals/gradients) can flow at full speed between any two exits. If the highway has speed bumps (nonlinearities like ReLU) at every mile marker, long-distance travel is impeded.",
              "类比：想象一条每一英里都有匝道（残差分支 F_i）的高速公路。如果公路本身平坦畅通，交通（信号/梯度）可以全速在任意两个出口间流动。如果高速公路在每个里程碑处都有减速带（如 ReLU 的非线性），远途行驶就会受阻。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 3: Pre-Activation Design ============ */}
        <h2>
          {t(
            "3. Pre-Activation Design: Moving Activations Before the Convolutions",
            "3. 预激活设计：将激活移到卷积之前"
          )}
        </h2>

        <p>
          {t(
            "The solution is elegant: instead of placing BN and ReLU after the convolution (post-activation), move them before (pre-activation). The new block applies BN → ReLU → Conv → BN → ReLU → Conv, then adds the original input without any further nonlinearity:",
            "解决方案优雅简洁：不在卷积之后放置 BN 和 ReLU（后激活），而是移到之前（预激活）。新模块先做 BN → ReLU → Conv → BN → ReLU → Conv，然后直接加上原始输入，不再施加任何非线性："
          )}
        </p>

        <Math display tex={"x_{l+1} = x_l + F\\bigl(\\hat{x}_l,\\, W_l\\bigr) \\quad \\text{where } \\hat{x}_l = \\text{ReLU}(\\text{BN}(x_l))"} />

        <p>
          {t(
            "Now the shortcut is a pure identity: x_{l+1} = x_l + (something). No nonlinearity is applied to x_l itself — it passes through unchanged.",
            "现在捷径是纯恒等映射：x_{l+1} = x_l + （某项）。不对 x_l 本身施加任何非线性——它原封不动地通过。"
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          {/* v1 block */}
          <div className="border border-rose-200 dark:border-rose-800 rounded-lg p-4 bg-rose-50 dark:bg-rose-950/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-400 mb-3">
              {t("ResNet v1 (Post-Activation)", "ResNet v1（后激活）")}
            </p>
            <div className="font-mono text-xs space-y-1 text-paper-700 dark:text-paper-300">
              <div className="text-paper-500 dark:text-paper-400">x_l</div>
              <div className="pl-2">↓ Conv (3×3)</div>
              <div className="pl-2">↓ BN</div>
              <div className="pl-2">↓ ReLU</div>
              <div className="pl-2">↓ Conv (3×3)</div>
              <div className="pl-2">↓ BN</div>
              <div className="pl-2">↓ + x_l (Add)</div>
              <div className="pl-2 text-rose-600 dark:text-rose-400 font-bold">↓ ReLU ← shortcut broken here</div>
              <div className="text-paper-500 dark:text-paper-400">x_{"{l+1}"}</div>
            </div>
          </div>
          {/* v2 block */}
          <div className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-950/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 mb-3">
              {t("ResNet v2 (Pre-Activation)", "ResNet v2（预激活）")}
            </p>
            <div className="font-mono text-xs space-y-1 text-paper-700 dark:text-paper-300">
              <div className="text-paper-500 dark:text-paper-400">x_l</div>
              <div className="pl-2 text-green-600 dark:text-green-400 font-bold">↓ BN ← activation first</div>
              <div className="pl-2 text-green-600 dark:text-green-400 font-bold">↓ ReLU</div>
              <div className="pl-2">↓ Conv (3×3)</div>
              <div className="pl-2 text-green-600 dark:text-green-400">↓ BN</div>
              <div className="pl-2 text-green-600 dark:text-green-400">↓ ReLU</div>
              <div className="pl-2">↓ Conv (3×3)</div>
              <div className="pl-2 font-bold">↓ + x_l (Add) ← clean identity</div>
              <div className="text-paper-500 dark:text-paper-400">x_{"{l+1}"}</div>
            </div>
          </div>
        </div>

        <p>
          {t(
            "This seemingly small change — reordering normalization and activation — has a profound structural consequence: the shortcut now carries the input signal x_l with no modification whatsoever.",
            "这个看似微小的改变——重新排列归一化和激活的顺序——带来了深刻的结构性后果：捷径现在不做任何修改地携带输入信号 x_l。"
          )}
        </p>

        <p>
          {t(
            "There is also a regularization benefit: since BN is applied before each convolution, the inputs to every weight layer are always normalized. In the original design, the input to the first convolution in each block is the output of a ReLU — already non-negative but not normalized. Pre-activation gives each convolution a properly normalized input.",
            "还有正则化方面的好处：由于 BN 在每次卷积前都会被应用，每个权重层的输入始终是标准化的。在原始设计中，每个模块第一个卷积的输入是 ReLU 的输出——非负但未标准化。预激活使每次卷积都能得到正确标准化的输入。"
          )}
        </p>

        {/* ============ Section 4: Clean Signal Propagation ============ */}
        <h2>
          {t(
            "4. Clean Signal Propagation",
            "4. 干净的信号传播"
          )}
        </h2>

        <p>
          {t(
            "With a perfect identity shortcut, we can write a simple closed-form expression for the output at any layer L in terms of any earlier layer l. Start from the block recurrence:",
            "有了完美的恒等捷径，我们可以用任意早期层 l 来写出第 L 层输出的简洁闭合表达式。从模块递推式出发："
          )}
        </p>

        <Math display tex={"x_{l+1} = x_l + F(x_l, W_l)"} />

        <p>
          {t(
            "Unrolling this recurrence from layer l to layer L gives:",
            "将此递推式从第 l 层展开到第 L 层，得到："
          )}
        </p>

        <Math display tex={"x_L = x_l + \\sum_{i=l}^{L-1} F(x_i,\\, W_i)"} />

        <Collapsible
          title={t(
            "Derivation: unrolling the additive recurrence",
            "推导：展开加法递推式"
          )}
        >
          <p>
            {t(
              "We proceed by induction. The base case is the single-block step:",
              "用归纳法推导。基础情形是单模块步骤："
            )}
          </p>
          <Math display tex={"x_{l+1} = x_l + F(x_l, W_l)"} />
          <p>
            {t(
              "Applying the same formula one step later:",
              "再向后一步应用相同公式："
            )}
          </p>
          <Math display tex={"x_{l+2} = x_{l+1} + F(x_{l+1}, W_{l+1}) = x_l + F(x_l, W_l) + F(x_{l+1}, W_{l+1})"} />
          <p>
            {t(
              "Continuing for L − l steps:",
              "继续展开 L − l 步："
            )}
          </p>
          <Math display tex={"x_L = x_l + \\sum_{i=l}^{L-1} F(x_i,\\, W_i)"} />
          <p>
            {t(
              "This is possible only because h(x_l) = x_l exactly. If h were any other function — even h(x) = ReLU(x) — the telescoping would not collapse so cleanly, and we would accumulate products of Jacobians of h across layers.",
              "这之所以可能，正是因为 h(x_l) = x_l 精确成立。如果 h 是任何其他函数——哪怕 h(x) = ReLU(x)——这个叠缩就不会如此干净，我们将在各层积累 h 的 Jacobian 乘积。"
            )}
          </p>
        </Collapsible>

        <p>
          {t(
            "This equation reveals something remarkable: the output at layer L is simply the output at layer l plus a sum of residuals. Layer L has a direct, unobstructed path to layer l. There is no chain of multiplicative transformations between them — just addition.",
            "这个方程揭示了一个惊人的事实：第 L 层的输出就是第 l 层的输出加上残差之和。第 L 层到第 l 层有一条直接、畅通的路径。它们之间没有乘法变换链——只有加法。"
          )}
        </p>

        <p>
          {t(
            "A further consequence is that any layer l has access to all previous outputs: x_l is the sum of x_0 and all residuals from layer 0 to l−1. The network behaves like an ensemble of shallower sub-networks of many different depths, all sharing weights.",
            "进一步的结论是，任何第 l 层都可以访问所有之前的输出：x_l 是 x_0 与从第 0 层到第 l−1 层所有残差之和。网络的行为类似于共享权重的、深度各异的浅层子网络的集成。"
          )}
        </p>

        {/* ============ Section 5: Gradient Highway ============ */}
        <h2>
          {t(
            "5. Gradient Highway Analysis",
            "5. 梯度高速通道分析"
          )}
        </h2>

        <p>
          {t(
            "The clean forward path has a direct analog in the backward pass. Using the chain rule on the clean recurrence x_L = x_l + Σ F_i, the gradient of the loss L with respect to layer l is:",
            "干净的前向路径在反向传播中有直接对应。对干净递推式 x_L = x_l + Σ F_i 用链式法则，损失 L 关于第 l 层的梯度为："
          )}
        </p>

        <Math display tex={"\\frac{\\partial \\mathcal{L}}{\\partial x_l} = \\frac{\\partial \\mathcal{L}}{\\partial x_L} \\cdot \\frac{\\partial x_L}{\\partial x_l} = \\frac{\\partial \\mathcal{L}}{\\partial x_L} \\left(1 + \\frac{\\partial}{\\partial x_l}\\sum_{i=l}^{L-1} F(x_i, W_i)\\right)"} />

        <p>
          {t(
            "The critical observation is the '1' inside the parentheses. The gradient from layer L to layer l is:",
            "关键观察是括号中的「1」。从第 L 层到第 l 层的梯度为："
          )}
        </p>

        <Math display tex={"\\frac{\\partial \\mathcal{L}}{\\partial x_l} = \\underbrace{\\frac{\\partial \\mathcal{L}}{\\partial x_L}}_{\\text{gradient at } L} + \\frac{\\partial \\mathcal{L}}{\\partial x_L} \\cdot \\frac{\\partial}{\\partial x_l}\\sum_{i=l}^{L-1} F_i"} />

        <Collapsible
          title={t(
            "Why the '1' prevents gradient vanishing — detailed argument",
            "为什么「1」能防止梯度消失——详细论证"
          )}
        >
          <p>
            {t(
              "In a standard deep network (no shortcuts), the gradient at layer l is the product of Jacobians from every intermediate layer:",
              "在标准深度网络（无捷径）中，第 l 层的梯度是每个中间层 Jacobian 的乘积："
            )}
          </p>
          <Math display tex={"\\frac{\\partial \\mathcal{L}}{\\partial x_l} = \\frac{\\partial \\mathcal{L}}{\\partial x_L} \\prod_{i=l}^{L-1} \\frac{\\partial x_{i+1}}{\\partial x_i}"} />
          <p>
            {t(
              "If any of these Jacobians has singular values less than 1 (which happens easily in deep networks), the product shrinks exponentially — vanishing gradient.",
              "如果这些 Jacobian 中任何一个的奇异值小于 1（在深度网络中很容易发生），乘积就会指数级缩小——梯度消失。"
            )}
          </p>
          <p>
            {t(
              "With the identity shortcut, the gradient decomposes as:",
              "有了恒等捷径，梯度分解为："
            )}
          </p>
          <Math display tex={"\\frac{\\partial \\mathcal{L}}{\\partial x_l} = \\frac{\\partial \\mathcal{L}}{\\partial x_L} + \\frac{\\partial \\mathcal{L}}{\\partial x_L} \\cdot \\frac{\\partial}{\\partial x_l}\\sum_{i=l}^{L-1} F_i"} />
          <p>
            {t(
              "The first term, ∂L/∂x_L, flows directly from L to l without any multiplication by intermediate Jacobians. Even if the second term (through the residual branches) vanishes, the first term alone carries the gradient signal. The gradient can never be zero unless ∂L/∂x_L itself is zero — which would mean the loss is already at a minimum.",
              "第一项 ∂L/∂x_L 直接从 L 流到 l，无需乘以任何中间 Jacobian。即使第二项（经过残差分支）消失，第一项单独也能携带梯度信号。梯度永远不会为零，除非 ∂L/∂x_L 本身为零——那意味着损失已经处于最小值。"
            )}
          </p>
          <p>
            {t(
              "This is the mathematical guarantee behind why very deep pre-activation ResNets (1001 layers) can train stably: the gradient highway runs from loss to input, completely bypassing the residual branches.",
              "这就是极深预激活 ResNet（1001 层）能够稳定训练的数学保证：梯度高速通道从损失直达输入，完全绕过残差分支。"
            )}
          </p>
        </Collapsible>

        <p>
          {t(
            "This gradient structure has a concrete practical meaning: even at layer 1 of a 1000-layer network, the gradient signal from the final loss arrives without being filtered through 999 multiplicative gates. Training very deep networks becomes almost as stable as training a shallow one.",
            "这种梯度结构有具体的实践意义：即使在 1000 层网络的第 1 层，来自最终损失的梯度信号也不会经过 999 个乘法门的过滤。训练极深网络几乎与训练浅层网络一样稳定。"
          )}
        </p>

        {/* ============ Section 6: Ablation Study ============ */}
        <h2>
          {t(
            "6. Ablation Study: Six Variants Tested",
            "6. 消融实验：测试了六种变体"
          )}
        </h2>

        <p>
          {t(
            "The paper systematically studies different ways to arrange the activation functions. Six variants of residual unit design are evaluated on ResNet-110 (CIFAR-10) to isolate which design choice matters:",
            "论文系统研究了激活函数的不同排列方式。在 ResNet-110（CIFAR-10）上评估了六种残差单元设计变体，以隔离哪种设计选择最重要："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Variant", "变体")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Design", "设计")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Error (%)", "错误率（%）")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold">
                  {t("(a) Original", "（a）原始")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-paper-600 dark:text-paper-400">
                  {t("BN after Add, ReLU after Add", "Add 后 BN，Add 后 ReLU")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">6.61</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900/50">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold">
                  {t("(b) BN after Add", "（b）Add 后 BN")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-paper-600 dark:text-paper-400">
                  {t("ReLU only after Add, BN moved to shortcut path", "仅 Add 后 ReLU，BN 移到捷径路径")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">8.17</td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold">
                  {t("(c) ReLU before Add", "（c）Add 前 ReLU")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-paper-600 dark:text-paper-400">
                  {t("ReLU inside residual branch before Add", "ReLU 在残差分支内、Add 之前")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">7.84</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900/50">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold">
                  {t("(d) ReLU-only pre-act", "（d）仅 ReLU 预激活")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-paper-600 dark:text-paper-400">
                  {t("ReLU before Conv (no BN before first Conv)", "Conv 前 ReLU（第一个 Conv 前无 BN）")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">6.71</td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold">
                  {t("(e) Const scaling", "（e）常数缩放")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-paper-600 dark:text-paper-400">
                  {t("λ·x_l + (1−λ)·F on shortcut", "捷径用 λ·x_l + (1−λ)·F")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">{t("worse for all λ", "所有 λ 都更差")}</td>
              </tr>
              <tr className="bg-green-50 dark:bg-green-950/30">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold text-green-700 dark:text-green-400">
                  {t("(f) Full pre-act ✓", "（f）完整预激活 ✓")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-green-700 dark:text-green-400">
                  {t("BN → ReLU → Conv → BN → ReLU → Conv → Add", "BN → ReLU → Conv → BN → ReLU → Conv → Add")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-bold text-green-700 dark:text-green-400">6.37</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The ablation confirms that neither moving just the ReLU nor just the BN is sufficient. Only the full pre-activation arrangement (variant f) achieves the clean identity shortcut and the best accuracy. Notably, variant (b) — which puts BN on the shortcut — actually hurts performance significantly, confirming that any modification to the shortcut path is harmful.",
            "消融实验证实：仅移动 ReLU 或仅移动 BN 都不够。只有完整的预激活排列（变体 f）才能实现干净的恒等捷径并获得最佳精度。值得注意的是，变体（b）——将 BN 放在捷径上——实际上显著损害了性能，证实了对捷径路径的任何修改都是有害的。"
          )}
        </p>

        {/* ============ Section 7: Results ============ */}
        <h2>
          {t(
            "7. Results on CIFAR-10 and ImageNet",
            "7. CIFAR-10 和 ImageNet 上的结果"
          )}
        </h2>

        <p>
          {t(
            "The most dramatic result is on CIFAR-10 with extremely deep networks. The original ResNet-1001 has a known training difficulty — at that depth, the post-activation design starts to degrade. The pre-activation design enables clean training:",
            "最显著的结果来自 CIFAR-10 上的极深网络。原始 ResNet-1001 存在已知的训练困难——在这个深度，后激活设计开始退化。预激活设计实现了干净的训练："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Model", "模型")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Design", "设计")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("CIFAR-10 Error", "CIFAR-10 错误率")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">ResNet-110</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-paper-600 dark:text-paper-400">
                  {t("Original (post-act)", "原始（后激活）")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">6.61%</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900/50">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">ResNet-110</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-green-700 dark:text-green-400">
                  {t("Pre-activation (v2)", "预激活（v2）")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold text-green-700 dark:text-green-400">6.37%</td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">ResNet-164</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-paper-600 dark:text-paper-400">
                  {t("Original (post-act)", "原始（后激活）")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">5.93%</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900/50">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">ResNet-164</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-green-700 dark:text-green-400">
                  {t("Pre-activation (v2)", "预激活（v2）")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold text-green-700 dark:text-green-400">5.46%</td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-bold">ResNet-1001</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-rose-600 dark:text-rose-400">
                  {t("Original — training unstable", "原始——训练不稳定")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-rose-600 dark:text-rose-400 font-bold">7.61%</td>
              </tr>
              <tr className="bg-green-50 dark:bg-green-950/30">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-bold">ResNet-1001</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-green-700 dark:text-green-400 font-semibold">
                  {t("Pre-activation — trains stably", "预激活——稳定训练")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-bold text-green-700 dark:text-green-400">4.62%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The 1001-layer result is the headline finding: nearly 3 percentage points improvement, achieved by a design change (not more compute or data). The gap grows with depth — at 110 layers the improvement is modest (0.24 pp), but at 1001 layers it is dramatic (3.0 pp).",
            "1001 层的结果是最重磅的发现：通过设计改变（而非更多算力或数据），实现了近 3 个百分点的提升。差距随深度增大——110 层时提升不大（0.24 个百分点），但在 1001 层时非常显著（3.0 个百分点）。"
          )}
        </p>

        <p>
          {t(
            "On ImageNet with ResNet-200 (200 layers), pre-activation achieves 21.1% top-1 error compared to 21.8% for the original ResNet-200 — a meaningful improvement at large scale. The gains are consistent but more moderate on shallower models, consistent with the theory that identity shortcuts matter most when the network is very deep.",
            "在 ImageNet 上，ResNet-200（200 层）的预激活版本实现了 21.1% 的 Top-1 错误率，而原始 ResNet-200 为 21.8%——在大规模任务上是有意义的提升。对于较浅的模型，提升幅度一致但更为温和，与理论相符：恒等捷径在网络非常深时最为重要。"
          )}
        </p>

        {/* ============ Section 8: Modern Impact ============ */}
        <h2>
          {t(
            "8. Pre-Activation in Modern Architectures",
            "8. 预激活在现代架构中的影响"
          )}
        </h2>

        <p>
          {t(
            "Pre-activation ResNet (ResNet v2) has become a widely adopted design pattern beyond image classification. Its influence can be seen in several areas:",
            "预激活 ResNet（ResNet v2）已成为超越图像分类的广泛采用的设计模式。其影响可在多个领域看到："
          )}
        </p>

        <ul>
          <li>
            <strong>{t("Very deep ResNets for medical imaging", "医学影像超深 ResNet")}</strong>
            {t(
              ": Models with 200–500 layers for 3D volumetric data routinely use pre-activation blocks because post-activation designs degrade at those depths.",
              "：用于三维体积数据的 200–500 层模型常规使用预激活模块，因为后激活设计在这种深度下会退化。"
            )}
          </li>
          <li>
            <strong>{t("Wide ResNets", "宽 ResNet")}</strong>
            {t(
              ": Zagoruyko and Komodakis (2016) adopt pre-activation in their wide residual networks, where width is scaled up instead of depth.",
              "：Zagoruyko 和 Komodakis（2016）在宽残差网络中采用预激活，这些网络通过扩大宽度而非深度来提升性能。"
            )}
          </li>
          <li>
            <strong>{t("Transformer residual design", "Transformer 残差设计")}</strong>
            {t(
              ": The Pre-LN (pre-LayerNorm) variant of Transformers — placing LayerNorm before the attention/FFN block rather than after — follows exactly the same philosophy as pre-activation ResNet and is now standard in many large language models (GPT-2, GPT-3, LLaMA).",
              "：Transformer 的 Pre-LN（预 LayerNorm）变体——在注意力/FFN 模块之前而非之后放置 LayerNorm——遵循与预激活 ResNet 完全相同的哲学，现已成为许多大型语言模型（GPT-2、GPT-3、LLaMA）的标准。"
            )}
          </li>
          <li>
            <strong>{t("Neural ODE and continuous-depth models", "神经 ODE 与连续深度模型")}</strong>
            {t(
              ": These models interpret the residual recurrence x_{l+1} = x_l + F(x_l) as an Euler discretization of an ODE. The clean identity interpretation from this paper is foundational to that line of work.",
              "：这些模型将残差递推式 x_{l+1} = x_l + F(x_l) 解释为 ODE 的欧拉离散化。本文的干净恒等映射解释是这一研究方向的基础。"
            )}
          </li>
        </ul>

        <Collapsible
          title={t(
            "Pre-LN Transformer and pre-activation ResNet: the same idea",
            "Pre-LN Transformer 与预激活 ResNet：同一个思想"
          )}
        >
          <p>
            {t(
              "The original Transformer (Vaswani et al., 2017) placed LayerNorm after the residual addition — Post-LN:",
              "原始 Transformer（Vaswani et al., 2017）在残差相加之后放置 LayerNorm——Post-LN："
            )}
          </p>
          <Math display tex={"x_{l+1} = \\text{LayerNorm}(x_l + F(x_l))"} />
          <p>
            {t(
              "This is structurally identical to post-activation ResNet: the shortcut x_l passes through a normalization layer, breaking the identity. Pre-LN moves the norm inside:",
              "这在结构上与后激活 ResNet 完全相同：捷径 x_l 经过归一化层，破坏了恒等映射。Pre-LN 将归一化移到内部："
            )}
          </p>
          <Math display tex={"x_{l+1} = x_l + F(\\text{LayerNorm}(x_l))"} />
          <p>
            {t(
              "Now the shortcut is a perfect identity again. Pre-LN Transformers (used in GPT-2, GPT-3, LLaMA, and most modern LLMs) are more stable to train, especially at large scale — exactly the same benefit that pre-activation gave to very deep ResNets. The two advances are the same insight applied independently in two communities.",
              "现在捷径再次是完美恒等映射。Pre-LN Transformer（用于 GPT-2、GPT-3、LLaMA 以及大多数现代大型语言模型）训练更加稳定，尤其在大规模下——这与预激活带给极深 ResNet 的好处完全相同。这两个进展是同一洞察在两个社区的独立应用。"
            )}
          </p>
        </Collapsible>

        <p>
          {t(
            "The core contribution of this paper — that identity shortcuts enable perfect gradient flow and make very deep networks tractable — has proven to be a durable principle that generalizes far beyond its original convolutional setting.",
            "本文的核心贡献——恒等捷径实现完美梯度流并使极深网络可训练——已被证明是一个持久的原则，其适用范围远超最初的卷积场景。"
          )}
        </p>

        {/* Resources */}
        <h2>{t("Resources", "参考资料")}</h2>
        <ul>
          <li>
            <a
              href="https://arxiv.org/abs/1603.05027"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {t(
                "Original paper: Identity Mappings in Deep Residual Networks (arXiv 1603.05027)",
                "原始论文：Identity Mappings in Deep Residual Networks（arXiv 1603.05027）"
              )}
            </a>
          </li>
          <li>
            <a
              href="https://arxiv.org/abs/1512.03385"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {t(
                "Original ResNet paper: Deep Residual Learning for Image Recognition (arXiv 1512.03385)",
                "原始 ResNet 论文：Deep Residual Learning for Image Recognition（arXiv 1512.03385）"
              )}
            </a>
          </li>
          <li>
            <a
              href="https://arxiv.org/abs/1605.07146"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {t(
                "Wide Residual Networks (Zagoruyko & Komodakis, 2016) — adopts pre-activation",
                "宽残差网络（Zagoruyko & Komodakis, 2016）——采用预激活"
              )}
            </a>
          </li>
          <li>
            <a
              href="https://arxiv.org/abs/2002.04745"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {t(
                "On Layer Normalization in the Transformer Architecture (Pre-LN analysis)",
                "关于 Transformer 架构中的层归一化（Pre-LN 分析）"
              )}
            </a>
          </li>
        </ul>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-paper-200 dark:border-paper-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 hover:underline"
          >
            {t("← Back to Papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
