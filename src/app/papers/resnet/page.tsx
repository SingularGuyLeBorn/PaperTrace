"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function ResNetPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Deep Residual Learning for Image Recognition",
            "深度残差学习用于图像识别"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-slate-400">
          He et al. &middot; CVPR 2015 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1512.03385"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1512.03385
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "ResNet introduces skip connections — also called shortcut connections — that let a layer learn the residual F(x) = H(x) − x instead of the full mapping H(x). This simple idea lets neural networks scale to hundreds of layers without the training accuracy degrading. ResNet-152 won ILSVRC 2015 with a record 3.57% top-5 error, beating human-level performance.",
              "ResNet 引入了跳跃连接（也叫残差连接），让每一层学习残差 F(x) = H(x) − x，而不是完整映射 H(x)。这个简单的想法让神经网络可以扩展到数百层，而不会出现训练精度下降的问题。ResNet-152 以 3.57% 的 top-5 错误率赢得了 ILSVRC 2015，超过了人类水平的表现。"
            )}
          </p>
        </section>

        {/* ============ 1. The Degradation Problem ============ */}
        <h2>{t("1. The Degradation Problem", "1. 退化问题")}</h2>

        <p>
          {t(
            "Before ResNet, a natural assumption was: deeper networks should be at least as good as shallower ones. If a 20-layer network is optimal, you can always construct a 56-layer network that matches it by making the extra 36 layers identity mappings. In theory, the deeper network's training error should be no worse.",
            "在 ResNet 之前，人们自然地假设：更深的网络至少应该和浅层网络一样好。如果 20 层网络是最优的，你总可以构造一个 56 层网络，让额外的 36 层学恒等映射来与之匹配。理论上，更深网络的训练误差不应更差。"
          )}
        </p>

        <p>
          {t(
            "Yet in practice, experiments showed the opposite. A plain 56-layer network had higher training error than a 20-layer network on CIFAR-10. This was not overfitting — the training error itself was higher, meaning the optimizer simply could not find a good solution in the deeper network's parameter space.",
            "然而实验表明恰恰相反。在 CIFAR-10 上，一个普通的 56 层网络的训练误差竟高于 20 层网络。这不是过拟合 —— 训练误差本身就更高，说明优化器根本无法在更深网络的参数空间中找到好的解。"
          )}
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-900 dark:text-amber-200 mb-0">
            <span className="font-semibold">{t("Key insight: ", "核心洞察：")}</span>
            {t(
              "The degradation problem shows that deep plain networks are hard to optimize, not that they have insufficient capacity. The solution is to change what the layers are asked to learn.",
              "退化问题说明深层普通网络难以优化，而不是容量不足。解决方案是改变对层的学习目标。"
            )}
          </p>
        </div>

        <p>
          {t(
            "He et al. hypothesized that it is easier to optimize the residual mapping F(x) = H(x) − x than the original unreferenced mapping H(x). If the optimal solution is close to an identity mapping, it is easier to push F(x) toward zero than to have a stack of nonlinear layers approximate an identity from scratch.",
            "He 等人假设，优化残差映射 F(x) = H(x) − x 比优化原始的无参考映射 H(x) 更容易。如果最优解接近恒等映射，则将 F(x) 推向零，比让一叠非线性层从头学习恒等映射更容易。"
          )}
        </p>

        {/* ============ 2. Residual Block ============ */}
        <h2>{t("2. The Residual Block", "2. 残差块")}</h2>

        <p>
          {t(
            "The core building block of ResNet is the residual block. Instead of learning H(x) directly, the block learns the residual function F(x), and the true output is recovered by adding the input x back:",
            "ResNet 的核心构建单元是残差块。残差块不直接学习 H(x)，而是学习残差函数 F(x)，通过将输入 x 加回来恢复真实输出："
          )}
        </p>

        <Math
          display
          label={t("Residual block output", "残差块输出")}
          tex="\mathbf{y} = \mathcal{F}(\mathbf{x},\, \{W_i\}) + \mathbf{x}"
        />

        <p>
          {t(
            "Here x is the input to the block, F(x, {W_i}) is the residual function computed by the stacked layers (e.g., two 3×3 convolutions with BN and ReLU), and the addition is element-wise. The shortcut connection adds x directly — no extra parameters, no extra computation.",
            "其中 x 是块的输入，F(x, {W_i}) 是由堆叠层（例如两个带 BN 和 ReLU 的 3×3 卷积）计算的残差函数，加法是逐元素的。跳跃连接直接加上 x —— 没有额外参数，也没有额外计算。"
          )}
        </p>

        <Collapsible title={t("What does a two-layer residual block look like?", "两层残差块长什么样？")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "A standard two-layer residual block for ResNet-18/34 contains:",
                "ResNet-18/34 的标准两层残差块包含："
              )}
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>{t("3×3 Conv → Batch Norm → ReLU", "3×3 卷积 → 批归一化 → ReLU")}</li>
              <li>{t("3×3 Conv → Batch Norm", "3×3 卷积 → 批归一化")}</li>
              <li>{t("Add input x (shortcut) → ReLU", "加输入 x（跳跃连接）→ ReLU")}</li>
            </ol>
            <p>
              {t(
                "The ReLU after the addition is applied to the summed output y = F(x) + x, not to F(x) alone. This ordering — sometimes called 'pre-activation' in later work — keeps the shortcut path clean.",
                "加法之后的 ReLU 作用于求和输出 y = F(x) + x，而不单独作用于 F(x)。这种顺序（在后续工作中有时称为「预激活」）保持了跳跃路径的清洁性。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* Projection shortcut */}
        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Identity vs. Projection Shortcuts", "恒等跳跃 vs. 投影跳跃")}
        </h3>

        <p>
          {t(
            "When the input and output have the same dimensions (same number of channels and spatial size), the shortcut is a simple identity: x is added as-is. This costs nothing.",
            "当输入和输出具有相同维度（相同通道数和空间尺寸）时，跳跃连接是简单的恒等映射：x 直接相加，零成本。"
          )}
        </p>

        <p>
          {t(
            "When dimensions differ — for example when the number of channels doubles at a downsampling step — the shortcut must be adapted. The paper uses a 1×1 convolution (projection shortcut) to match dimensions:",
            "当维度不同时 —— 例如在下采样步骤中通道数翻倍 —— 跳跃连接必须做调整。论文使用 1×1 卷积（投影跳跃）来匹配维度："
          )}
        </p>

        <Math
          display
          label={t("Projection shortcut", "投影跳跃")}
          tex="\mathbf{y} = \mathcal{F}(\mathbf{x},\, \{W_i\}) + W_s \mathbf{x}"
        />

        <p>
          {t(
            "W_s is a 1×1 convolution applied with stride 2 (for spatial downsampling) that maps the input from C channels to 2C channels. The paper experiments show that using projection shortcuts only where necessary (option B in the paper) performs well while keeping parameter count low.",
            "W_s 是一个步长为 2（用于空间下采样）的 1×1 卷积，将输入从 C 通道映射到 2C 通道。论文实验表明，仅在必要时使用投影跳跃（论文中的选项 B）效果良好，同时保持参数量较低。"
          )}
        </p>

        {/* ============ 3. Architecture Details ============ */}
        <h2>{t("3. Architecture Details", "3. 架构细节")}</h2>

        <h3 className="text-lg font-semibold mt-6 mb-3">
          {t("ResNet Family", "ResNet 系列")}
        </h3>

        <p>
          {t(
            "The paper introduces a family of networks with different depths. ResNet-18 and ResNet-34 use basic blocks (two 3×3 convolutions). ResNet-50, ResNet-101, and ResNet-152 use bottleneck blocks to keep computation manageable at larger scales.",
            "论文引入了一系列不同深度的网络。ResNet-18 和 ResNet-34 使用基本块（两个 3×3 卷积）。ResNet-50、ResNet-101 和 ResNet-152 使用瓶颈块，以在更大规模下保持计算量可控。"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-slate-800">
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Model", "模型")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Layers", "层数")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Block type", "块类型")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Params", "参数量")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Top-1 err (ImageNet)", "Top-1 错误率")}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["ResNet-18", "18", t("Basic", "基本块"), "11.7M", "30.24%"],
                ["ResNet-34", "34", t("Basic", "基本块"), "21.8M", "26.73%"],
                ["ResNet-50", "50", t("Bottleneck", "瓶颈块"), "25.6M", "24.01%"],
                ["ResNet-101", "101", t("Bottleneck", "瓶颈块"), "44.5M", "22.44%"],
                ["ResNet-152", "152", t("Bottleneck", "瓶颈块"), "60.2M", "22.16%"],
              ].map(([model, layers, block, params, err]) => (
                <tr key={model} className="odd:bg-white dark:odd:bg-transparent even:bg-paper-50 dark:even:bg-slate-900/30">
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2 font-mono font-semibold">{model}</td>
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2">{layers}</td>
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2">{block}</td>
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2">{params}</td>
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2">{err}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Bottleneck Block", "瓶颈块")}
        </h3>

        <p>
          {t(
            "For deeper networks (ResNet-50+), using two 3×3 convolutions per block becomes computationally expensive. The bottleneck design replaces this with a three-layer structure:",
            "对于更深的网络（ResNet-50+），每个块使用两个 3×3 卷积的计算代价较高。瓶颈设计用三层结构来替代："
          )}
        </p>

        <Math
          display
          label={t("Bottleneck block structure", "瓶颈块结构")}
          tex="1 \times 1 \text{ conv} \xrightarrow{\text{reduce}} 3 \times 3 \text{ conv} \xrightarrow{\text{transform}} 1 \times 1 \text{ conv} \xrightarrow{\text{expand}} + \mathbf{x}"
        />

        <Collapsible title={t("Bottleneck: concrete channel dimensions", "瓶颈块：具体通道维度")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "For a bottleneck block with 256 output channels (as in ResNet-50's first stage after the initial conv):",
                "对于输出 256 通道的瓶颈块（如 ResNet-50 初始卷积后的第一阶段）："
              )}
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                {t(
                  "1×1 Conv: 256 → 64 channels (4× channel reduction, cheap)",
                  "1×1 卷积：256 → 64 通道（4 倍通道压缩，计算量小）"
                )}
              </li>
              <li>
                {t(
                  "3×3 Conv: 64 → 64 channels (the expensive spatial operation, now on fewer channels)",
                  "3×3 卷积：64 → 64 通道（代价较高的空间操作，现在作用于更少通道）"
                )}
              </li>
              <li>
                {t(
                  "1×1 Conv: 64 → 256 channels (restore original channel count)",
                  "1×1 卷积：64 → 256 通道（恢复原始通道数）"
                )}
              </li>
            </ul>
            <p>
              {t(
                "The 3×3 conv in this bottleneck processes 64 channels instead of 256, reducing FLOPs by roughly 9×. This makes each bottleneck block cheaper than two 3×3 convolutions on the full 256 channels, while having more representational depth.",
                "此瓶颈块中的 3×3 卷积处理 64 通道而非 256 通道，大约减少了 9 倍的计算量。这使得每个瓶颈块比在完整 256 通道上的两个 3×3 卷积更高效，同时具有更大的表示深度。"
              )}
            </p>
          </div>
        </Collapsible>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Batch Normalization Placement", "批归一化的位置")}
        </h3>

        <p>
          {t(
            "In the original ResNet, Batch Normalization (BN) is placed after each convolution and before the ReLU activation. The order within each residual branch is: Conv → BN → ReLU → Conv → BN → (Add shortcut) → ReLU.",
            "在原始 ResNet 中，批归一化（BN）放在每次卷积之后、ReLU 激活之前。每个残差分支内的顺序是：卷积 → BN → ReLU → 卷积 → BN → （加跳跃连接）→ ReLU。"
          )}
        </p>

        <p>
          {t(
            "He et al. later explored 'pre-activation' ResNets (in a 2016 follow-up) where BN and ReLU come before the convolution: BN → ReLU → Conv. This variant makes the shortcut path truly clean (just addition, no BN or activation on the path), and slightly improves performance on very deep networks.",
            "He 等人在 2016 年的后续工作中探索了「预激活」ResNet，将 BN 和 ReLU 放在卷积之前：BN → ReLU → 卷积。这种变体使跳跃路径真正干净（只有加法，路径上没有 BN 或激活），并在非常深的网络上略微提升了性能。"
          )}
        </p>

        {/* ============ 4. Gradient Flow Analysis ============ */}
        <h2>{t("4. Gradient Flow Analysis", "4. 梯度流分析")}</h2>

        <p>
          {t(
            "The key mathematical benefit of skip connections is how they affect gradient flow during backpropagation. Consider the loss L and the gradient flowing back through the network.",
            "跳跃连接的关键数学好处在于它如何影响反向传播中的梯度流。考虑损失 L 以及流回网络的梯度。"
          )}
        </p>

        <p>
          {t(
            "For a residual block with output y = F(x) + x, the gradient of the loss with respect to the block's input x is:",
            "对于输出为 y = F(x) + x 的残差块，损失关于块输入 x 的梯度为："
          )}
        </p>

        <Math
          display
          label={t("Gradient through a residual block", "残差块的梯度")}
          tex="\frac{\partial \mathcal{L}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{y}} \cdot \frac{\partial \mathbf{y}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{y}} \cdot \left(\frac{\partial \mathcal{F}}{\partial \mathbf{x}} + \mathbf{I}\right)"
        />

        <p>
          {t(
            "The identity matrix I in the gradient expression is crucial. Even if the gradient flowing through F(x) — the residual branch — becomes very small (vanishing), the identity term I ensures that ∂L/∂y is always passed directly to ∂L/∂x. Gradients cannot fully vanish as long as the shortcut connection is present.",
            "梯度表达式中的单位矩阵 I 至关重要。即使流经 F(x)（残差分支）的梯度变得非常小（梯度消失），单位项 I 也确保 ∂L/∂y 总是直接传递到 ∂L/∂x。只要跳跃连接存在，梯度就不会完全消失。"
          )}
        </p>

        <Collapsible title={t("Concrete numeric example: gradient highway", "具体数值示例：梯度高速公路")}>
          <div className="text-sm space-y-4">
            <p>
              {t(
                "Suppose we have a 5-block network and each residual branch shrinks the gradient by a factor of 0.1 (severe vanishing). Without skip connections, the gradient at the first block would be:",
                "假设我们有一个 5 块网络，每个残差分支将梯度缩小 0.1 倍（严重消失）。没有跳跃连接时，第一个块的梯度为："
              )}
            </p>
            <Math
              display
              tex="\frac{\partial \mathcal{L}}{\partial \mathbf{x}_0} \approx 0.1^5 = 0.00001"
            />
            <p>
              {t(
                "With skip connections, even if the residual branch contributes only 0.1×, the identity shortcut adds 1× directly:",
                "有跳跃连接时，即使残差分支只贡献 0.1×，恒等跳跃直接加上 1×："
              )}
            </p>
            <Math
              display
              tex="\frac{\partial \mathcal{L}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{y}} \cdot (0.1 + 1) = 1.1 \times \frac{\partial \mathcal{L}}{\partial \mathbf{y}}"
            />
            <p>
              {t(
                "After 5 blocks: 1.1^5 ≈ 1.61. The gradient actually grows (slightly) through skip connections rather than vanishing! In practice, the network balances these terms, but the key insight is that there is always a direct gradient highway from the output all the way back to early layers.",
                "经过 5 个块后：1.1^5 ≈ 1.61。梯度实际上通过跳跃连接略微增长，而不是消失！实践中网络会平衡这些项，但关键洞察是：从输出到早期层，始终存在一条直接的梯度高速公路。"
              )}
            </p>
            <p>
              {t(
                "For a network with L total residual blocks, the gradient at layer l receives contributions from all L − l blocks above it simultaneously, not just the single path through all layers. This exponentially increases the effective number of gradient paths.",
                "对于共有 L 个残差块的网络，第 l 层的梯度同时接收来自其上方所有 L − l 个块的贡献，而不仅仅是穿过所有层的单条路径。这指数级地增加了有效梯度路径的数量。"
              )}
            </p>
          </div>
        </Collapsible>

        <Collapsible title={t("Show full backprop derivation across multiple blocks", "展开多块的完整反向传播推导")}>
          <div className="text-sm space-y-4">
            <p>
              {t(
                "For a chain of residual blocks, let x_L be the output after L blocks and x_l the output after l blocks. The forward pass satisfies:",
                "对于一连串残差块，设 x_L 为 L 个块后的输出，x_l 为 l 个块后的输出。前向传播满足："
              )}
            </p>
            <Math
              display
              tex="\mathbf{x}_L = \mathbf{x}_l + \sum_{i=l}^{L-1} \mathcal{F}(\mathbf{x}_i, W_i)"
            />
            <p>
              {t(
                "This is because each block adds its residual. Taking the gradient of the loss L with respect to x_l:",
                "这是因为每个块都加上了自己的残差。对损失 L 关于 x_l 求梯度："
              )}
            </p>
            <Math
              display
              tex="\frac{\partial \mathcal{L}}{\partial \mathbf{x}_l} = \frac{\partial \mathcal{L}}{\partial \mathbf{x}_L} \cdot \frac{\partial \mathbf{x}_L}{\partial \mathbf{x}_l} = \frac{\partial \mathcal{L}}{\partial \mathbf{x}_L} \left(1 + \frac{\partial}{\partial \mathbf{x}_l}\sum_{i=l}^{L-1}\mathcal{F}(\mathbf{x}_i, W_i)\right)"
            />
            <p>
              {t(
                "The term ∂L/∂x_L propagates directly to ∂L/∂x_l without going through any weight matrices — this is the gradient highway. The second term captures the contribution of all the residual functions between layers l and L.",
                "项 ∂L/∂x_L 直接传播到 ∂L/∂x_l，无需经过任何权重矩阵 —— 这就是梯度高速公路。第二项捕获了 l 到 L 层之间所有残差函数的贡献。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ 5. Results ============ */}
        <h2>{t("5. Results", "5. 实验结果")}</h2>

        <p>
          {t(
            "ResNet's results on ILSVRC 2015 (ImageNet) were decisive. The ensemble of ResNets achieved 3.57% top-5 error on the test set — better than the reported human-level performance of ~5.1% by some estimates.",
            "ResNet 在 ILSVRC 2015（ImageNet）上的结果非常突出。ResNet 集成方法在测试集上实现了 3.57% 的 top-5 错误率 —— 按某些估计，优于人类水平（约 5.1%）。"
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          {[
            {
              label: t("Top-5 Error (ILSVRC 2015)", "Top-5 错误率（ILSVRC 2015）"),
              value: "3.57%",
              sub: t("ResNet ensemble, test set", "ResNet 集成，测试集"),
              color: "blue",
            },
            {
              label: t("Depth", "深度"),
              value: "152",
              sub: t("layers in ResNet-152", "ResNet-152 的层数"),
              color: "purple",
            },
            {
              label: t("Previous record", "前一纪录"),
              value: "6.7%",
              sub: t("VGGNet / GoogLeNet, 2014", "VGGNet / GoogLeNet，2014年"),
              color: "amber",
            },
          ].map(({ label, value, sub, color }) => (
            <div
              key={label}
              className={`rounded-lg border p-4 text-center ${
                color === "blue"
                  ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                  : color === "purple"
                  ? "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
                  : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
              }`}
            >
              <div
                className={`text-3xl font-bold mb-1 ${
                  color === "blue"
                    ? "text-blue-700 dark:text-blue-300"
                    : color === "purple"
                    ? "text-purple-700 dark:text-purple-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {value}
              </div>
              <div className="text-xs font-semibold text-paper-700 dark:text-slate-300 mb-1">{label}</div>
              <div className="text-xs text-paper-500 dark:text-slate-400">{sub}</div>
            </div>
          ))}
        </div>

        <p>
          {t(
            "On CIFAR-10, the paper showed that a plain 56-layer network performs worse than a plain 20-layer network (the degradation problem), whereas ResNet-56 and ResNet-110 both outperform shallower baselines, confirming that residual connections actually solve the degradation problem rather than just alleviating it.",
            "在 CIFAR-10 上，论文表明普通 56 层网络比普通 20 层网络表现更差（退化问题），而 ResNet-56 和 ResNet-110 都优于更浅的基线，证实残差连接确实解决了退化问题，而不只是缓解了它。"
          )}
        </p>

        <p>
          {t(
            "ResNet also transferred strongly to object detection (COCO) and image segmentation, suggesting the learned features generalize well. ResNet-101/152 as backbone networks became the standard in computer vision for years after publication.",
            "ResNet 在目标检测（COCO）和图像分割上也有很强的迁移能力，说明学到的特征泛化性良好。ResNet-101/152 作为骨干网络在论文发表后多年都是计算机视觉的标准配置。"
          )}
        </p>

        {/* ============ 6. Key Takeaways ============ */}
        <h2>{t("6. Key Takeaways", "6. 核心要点")}</h2>

        <div className="space-y-4 mb-8">
          {[
            {
              title: t("Depth alone isn't enough", "深度本身不够"),
              body: t(
                "Stacking more layers on a plain network hurts training accuracy. The problem is optimization difficulty, not model capacity.",
                "在普通网络上堆叠更多层会损害训练精度。问题在于优化困难，而不是模型容量不足。"
              ),
              color: "rose",
            },
            {
              title: t("Residual learning reframes the problem", "残差学习重新定义问题"),
              body: t(
                "Asking layers to learn F(x) = H(x) − x is easier than learning H(x) when the optimal H is close to identity. Pushing F toward zero is trivial; pushing H toward identity through multiple nonlinearities is not.",
                "当最优 H 接近恒等映射时，让层学习 F(x) = H(x) − x 比学习 H(x) 更容易。将 F 推向零很简单；通过多个非线性层将 H 推向恒等映射则不然。"
              ),
              color: "blue",
            },
            {
              title: t("Skip connections are gradient highways", "跳跃连接是梯度高速公路"),
              body: t(
                "The identity shortcut guarantees a direct gradient path from any layer to any earlier layer, preventing vanishing gradients even in 150+ layer networks.",
                "恒等跳跃连接保证了从任意层到任意早期层的直接梯度路径，即使在 150+ 层的网络中也能防止梯度消失。"
              ),
              color: "green",
            },
            {
              title: t("Bottlenecks make depth computationally feasible", "瓶颈块使深度在计算上可行"),
              body: t(
                "The 1×1 → 3×3 → 1×1 bottleneck design dramatically reduces FLOPs by operating the expensive 3×3 conv on a reduced channel count, enabling 50–152 layer networks to train efficiently.",
                "1×1 → 3×3 → 1×1 瓶颈设计通过在减少的通道数上执行代价较高的 3×3 卷积，大幅减少了计算量，使 50–152 层网络能高效训练。"
              ),
              color: "purple",
            },
            {
              title: t("Zero extra parameters for identity shortcuts", "恒等跳跃连接零额外参数"),
              body: t(
                "When input and output dimensions match, skip connections cost nothing — no parameters, no FLOPs. Only dimension-changing shortcuts (1×1 conv) add a small number of parameters.",
                "当输入输出维度匹配时，跳跃连接零成本 —— 无参数，无计算量。只有改变维度的跳跃连接（1×1 卷积）才会增加少量参数。"
              ),
              color: "teal",
            },
          ].map(({ title, body, color }) => (
            <div
              key={title}
              className={`border-l-4 pl-4 py-2 ${
                color === "rose"
                  ? "border-rose-400 dark:border-rose-600"
                  : color === "blue"
                  ? "border-blue-400 dark:border-blue-600"
                  : color === "green"
                  ? "border-green-400 dark:border-green-600"
                  : color === "purple"
                  ? "border-purple-400 dark:border-purple-600"
                  : "border-teal-400 dark:border-teal-600"
              }`}
            >
              <p className="font-semibold text-sm mb-1">{title}</p>
              <p className="text-sm text-paper-700 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>

        {/* Further reading */}
        <div className="bg-paper-50 dark:bg-slate-900/40 border border-paper-200 dark:border-slate-700 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold mb-3">{t("Further Reading", "延伸阅读")}</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a
                href="https://arxiv.org/abs/1603.05027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                He et al. 2016 — Identity Mappings in Deep Residual Networks
              </a>
              <span className="text-paper-500 dark:text-slate-400 ml-2">
                {t("(pre-activation ResNet)", "（预激活 ResNet）")}
              </span>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/1608.06993"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Huang et al. 2017 — Densely Connected Convolutional Networks (DenseNet)
              </a>
              <span className="text-paper-500 dark:text-slate-400 ml-2">
                {t("(extends skip connections to all layers)", "（将跳跃连接扩展到所有层）")}
              </span>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/1611.05431"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Xie et al. 2017 — Aggregated Residual Transformations (ResNeXt)
              </a>
              <span className="text-paper-500 dark:text-slate-400 ml-2">
                {t("(grouped convolutions in bottleneck)", "（瓶颈块中的分组卷积）")}
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-16 pt-8 border-t border-paper-200 dark:border-slate-700">
          <Link
            href={`${basePath}/`}
            className="text-blue-600 hover:underline text-sm"
          >
            ← {t("Back to all papers", "返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
