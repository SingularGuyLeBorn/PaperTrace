"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function AlexNetPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "AlexNet: ImageNet Classification with Deep Convolutional Neural Networks",
            "AlexNet: 使用深度卷积神经网络进行 ImageNet 分类"
          )}
        </h1>
        <p className="text-paper-800/50">
          Krizhevsky, Sutskever, Hinton &middot; NeurIPS 2012 &middot;{" "}
          <a
            href="https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            NeurIPS 2012
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "AlexNet won the 2012 ImageNet competition with a top-5 error of 15.3%, crushing the runner-up at 26.2% — an 11-point gap that shocked the field. The architecture: 5 convolutional layers + 3 fully connected layers, 60M parameters, trained on two GTX 580 GPUs. Key ingredients: ReLU activations for fast convergence, dropout for regularization, local response normalization, data augmentation, and GPU-accelerated training. This single paper reignited deep learning after a long winter and launched the modern AI era.",
              "AlexNet 以 15.3% 的 top-5 错误率赢得了 2012 年 ImageNet 竞赛，将排名第二的 26.2% 甩开了 11 个百分点——这一差距震惊了整个领域。网络架构：5 个卷积层 + 3 个全连接层，共 6000 万参数，在两块 GTX 580 GPU 上训练。核心要素：ReLU 激活函数（加速收敛）、Dropout（正则化）、局部响应归一化、数据增强以及 GPU 加速训练。这篇论文在深度学习漫长的寒冬之后重燃了这一领域的希望，开启了现代 AI 时代。"
            )}
          </p>
        </section>

        {/* ============ Section 1: The 2012 Moment ============ */}
        <h2>{t("1. The 2012 Moment: A Challenge That Changed History", "1. 2012 年的历史性时刻：改变历史的挑战")}</h2>

        <p>
          {t(
            "In 2012, the ImageNet Large Scale Visual Recognition Challenge (ILSVRC) asked competitors to classify 1.2 million training images across 1,000 categories — from tench (a fish) to volcanoes. Prior approaches used hand-crafted features: SIFT descriptors, HOG gradients, Fisher vectors. The best systems had plateaued around 25–26% top-5 error. Krizhevsky, Sutskever, and Hinton entered with something entirely different: a deep convolutional network trained end-to-end on raw pixels, accelerated by two GPUs running in parallel.",
            "2012 年，ImageNet 大规模视觉识别挑战赛（ILSVRC）要求参赛者对横跨 1000 个类别的 120 万张训练图像进行分类——从丁鱼（一种鱼类）到火山。此前的方法依赖手工设计的特征：SIFT 描述符、HOG 梯度、Fisher 向量。最好的系统 top-5 错误率在 25–26% 附近徘徊。Krizhevsky、Sutskever 和 Hinton 带着完全不同的方案参赛：一个从原始像素端到端训练的深度卷积网络，由两块并行 GPU 加速。"
          )}
        </p>

        <p>
          {t(
            "The result — 15.3% top-5 error — was not a modest improvement. It was a rupture. At 10.9 percentage points better than the runner-up, AlexNet did not just win; it invalidated an entire paradigm of feature engineering. Within two years, every serious computer vision system was a deep convolutional network. Within five, deep learning had conquered speech, language, and games.",
            "结果——15.3% 的 top-5 错误率——不是渐进式的改进，而是一次断裂。比排名第二的系统高出 10.9 个百分点，AlexNet 不仅赢得了比赛，还使整个特征工程范式走向终结。两年之内，所有严肃的计算机视觉系统都变成了深度卷积网络。五年之内，深度学习席卷了语音、语言和游戏领域。"
          )}
        </p>

        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong className="dark:text-amber-200">{t("Historical context:", "历史背景：")}</strong>{" "}
            <span className="dark:text-amber-100">
              {t(
                "Deep learning had been largely dormant in mainstream ML since the 1990s. Yann LeCun's LeNet had shown convolutional networks could read digits, but scaling them to large natural image datasets seemed infeasible without GPUs. AlexNet demonstrated that with enough GPU compute and the right engineering choices, depth wins.",
                "自 20 世纪 90 年代以来，深度学习在主流 ML 界基本上处于蛰伏状态。Yann LeCun 的 LeNet 已经证明卷积网络可以识别数字，但在没有 GPU 的情况下，将其扩展到大型自然图像数据集似乎不可行。AlexNet 证明了：只要有足够的 GPU 算力和正确的工程选择，深度就会胜出。"
              )}
            </span>
          </p>
        </div>

        {/* ============ Section 2: Architecture Walkthrough ============ */}
        <h2>{t("2. Architecture Walkthrough", "2. 架构详解")}</h2>

        <p>
          {t(
            "AlexNet takes 224×224×3 RGB images as input and passes them through 8 learned layers: 5 convolutional layers and 3 fully connected layers, culminating in a 1000-way softmax over ImageNet classes. The network is split across two GPU streams that communicate only at certain layers — a practical constraint imposed by the 3 GB memory limit of the GTX 580.",
            "AlexNet 以 224×224×3 的 RGB 图像作为输入，通过 8 个学习层处理：5 个卷积层和 3 个全连接层，最终以 1000 路 softmax 输出 ImageNet 类别概率。网络被分布在两块 GPU 上，仅在特定层进行通信——这是 GTX 580 3GB 显存限制下的实际约束。"
          )}
        </p>

        <p>
          {t(
            "The convolution output size formula determines spatial dimensions after each layer. For input width W, filter size F, padding P, and stride S:",
            "卷积输出尺寸公式决定了每层之后的空间维度。对于输入宽度 W、滤波器大小 F、填充 P 和步长 S："
          )}
        </p>

        <Math
          display
          label={t("Convolution output dimension formula", "卷积输出维度公式")}
          tex="\text{output size} = \left\lfloor \frac{W - F + 2P}{S} \right\rfloor + 1"
        />

        <p>
          {t(
            "Applying this formula layer by layer traces how AlexNet compresses 224×224 spatial inputs down to 6×6 feature maps before the fully connected layers:",
            "逐层应用此公式，可以追踪 AlexNet 如何将 224×224 的空间输入压缩至全连接层之前的 6×6 特征图："
          )}
        </p>

        {/* Architecture Table */}
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-slate-800">
                <th className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-left dark:text-slate-200">
                  {t("Layer", "层")}
                </th>
                <th className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-left dark:text-slate-200">
                  {t("Type", "类型")}
                </th>
                <th className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-left dark:text-slate-200">
                  {t("Filter / Size", "滤波器 / 尺寸")}
                </th>
                <th className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-left dark:text-slate-200">
                  {t("Stride", "步长")}
                </th>
                <th className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-left dark:text-slate-200">
                  {t("Output shape", "输出形状")}
                </th>
                <th className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-left dark:text-slate-200">
                  {t("Notes", "备注")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">Conv1</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("Conv + ReLU + LRN + Pool", "卷积 + ReLU + LRN + 池化")}</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">96 × 11×11</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">4</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">55×55×96</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-xs text-paper-800/70 dark:text-slate-400">{t("Large receptive field; pool→27×27", "大感受野；池化→27×27")}</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-slate-900">
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">Conv2</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("Conv + ReLU + LRN + Pool", "卷积 + ReLU + LRN + 池化")}</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">256 × 5×5</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">1</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">27×27×256</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-xs text-paper-800/70 dark:text-slate-400">{t("Cross-GPU; pool→13×13", "跨 GPU；池化→13×13")}</td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">Conv3</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("Conv + ReLU", "卷积 + ReLU")}</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">384 × 3×3</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">1</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">13×13×384</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-xs text-paper-800/70 dark:text-slate-400">{t("Full cross-GPU connection", "完全跨 GPU 连接")}</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-slate-900">
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">Conv4</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("Conv + ReLU", "卷积 + ReLU")}</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">384 × 3×3</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">1</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">13×13×384</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-xs text-paper-800/70 dark:text-slate-400">{t("Same-GPU only", "仅同 GPU 内")}</td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">Conv5</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("Conv + ReLU + Pool", "卷积 + ReLU + 池化")}</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">256 × 3×3</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">1</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">13×13×256</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-xs text-paper-800/70 dark:text-slate-400">{t("Same-GPU; pool→6×6", "同 GPU；池化→6×6")}</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-slate-900">
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">FC6</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("FC + ReLU + Dropout", "全连接 + ReLU + Dropout")}</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">4096</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">—</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">4096</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-xs text-paper-800/70 dark:text-slate-400">{t("6×6×256 → 4096; dropout p=0.5", "6×6×256 → 4096；dropout p=0.5")}</td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">FC7</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("FC + ReLU + Dropout", "全连接 + ReLU + Dropout")}</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">4096</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">—</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">4096</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-xs text-paper-800/70 dark:text-slate-400">{t("dropout p=0.5", "dropout p=0.5")}</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-slate-900">
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">FC8</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("FC + Softmax", "全连接 + Softmax")}</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">1000</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">—</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-mono dark:text-slate-300">1000</td>
                <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-xs text-paper-800/70 dark:text-slate-400">{t("Output: class probabilities", "输出：类别概率")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Collapsible
          title={t("Parameter count breakdown", "参数量细分")}
          defaultOpen
        >
          <div className="text-sm space-y-2">
            <div className="font-mono text-xs p-3 bg-paper-100 dark:bg-slate-800 rounded border border-paper-200 dark:border-slate-600 space-y-1 dark:text-slate-300">
              <div>Conv1: 96 × (3×11×11) + 96 = <strong>34,944</strong></div>
              <div>Conv2: 256 × (96×5×5) + 256 = <strong>614,656</strong></div>
              <div>Conv3: 384 × (256×3×3) + 384 = <strong>885,120</strong></div>
              <div>Conv4: 384 × (384×3×3) + 384 = <strong>1,327,488</strong></div>
              <div>Conv5: 256 × (384×3×3) + 256 = <strong>884,992</strong></div>
              <div>FC6: (6×6×256) × 4096 + 4096 = <strong>37,752,832</strong></div>
              <div>FC7: 4096 × 4096 + 4096 = <strong>16,781,312</strong></div>
              <div>FC8: 4096 × 1000 + 1000 = <strong>4,097,000</strong></div>
              <div className="pt-2 border-t border-paper-200 dark:border-slate-600 font-bold">{t("Total ≈ 62.4M parameters", "总计 ≈ 6240 万参数")}</div>
              <div className="text-paper-800/60 dark:text-slate-400">{t("(~90% live in the fully connected layers)", "（约 90% 集中在全连接层）")}</div>
            </div>
          </div>
        </Collapsible>

        {/* ============ Section 3: ReLU ============ */}
        <h2>{t("3. ReLU: The Activation That Made Depth Trainable", "3. ReLU：让深度网络可训练的激活函数")}</h2>

        <p>
          {t(
            "Before AlexNet, the standard activation function for neural networks was the sigmoid or tanh. Both are smooth, differentiable — and both saturate: when inputs are large in magnitude, the gradient of the activation approaches zero. In a deep network, this kills gradient flow through backpropagation. Weights in early layers stop learning.",
            "在 AlexNet 之前，神经网络的标准激活函数是 sigmoid 或 tanh。两者都光滑、可微——但都会饱和：当输入绝对值较大时，激活函数的梯度趋近于零。在深层网络中，这会扼杀反向传播中的梯度流。早期层的权重停止学习。"
          )}
        </p>

        <p>
          {t(
            "AlexNet used ReLU (Rectified Linear Unit) throughout. ReLU is strikingly simple: it is the identity for positive inputs and zero for negative inputs.",
            "AlexNet 全程使用 ReLU（整流线性单元）。ReLU 非常简单：对正输入是恒等函数，对负输入输出零。"
          )}
        </p>

        <Math
          display
          label={t("ReLU activation", "ReLU 激活函数")}
          tex="f(x) = \max(0,\, x)"
        />

        <p>
          {t(
            "Compare this to sigmoid, which saturates at both ends:",
            "与两端均会饱和的 sigmoid 相比："
          )}
        </p>

        <Math
          display
          label={t("Sigmoid activation (for comparison)", "Sigmoid 激活函数（对比）")}
          tex="f(x) = \frac{1}{1 + e^{-x}}"
        />

        <Collapsible
          title={t("Why ReLU trains 6× faster than tanh (from the paper)", "为什么 ReLU 比 tanh 快 6 倍（来自论文原文）")}
          defaultOpen
        >
          <div className="text-sm space-y-3 dark:text-slate-300">
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
              <strong className="dark:text-red-300">{t("Sigmoid / tanh problem:", "Sigmoid / tanh 的问题：")}</strong>
              <ul className="mt-1 space-y-1 text-xs list-disc list-inside dark:text-red-200">
                <li>{t("Gradient ∂σ/∂x = σ(x)(1−σ(x)) ≤ 0.25 everywhere", "梯度 ∂σ/∂x = σ(x)(1−σ(x)) ≤ 0.25 处处成立")}</li>
                <li>{t("In a 5-layer network: gradient multiplied 5 times → 0.25⁵ ≈ 0.001 attenuation", "在 5 层网络中：梯度连乘 5 次 → 0.25⁵ ≈ 0.001 的衰减")}</li>
                <li>{t("Saturated neurons: when |x| is large, gradient ≈ 0 — weight updates stop", "饱和神经元：当 |x| 较大时，梯度 ≈ 0——权重更新停止")}</li>
              </ul>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
              <strong className="dark:text-green-300">{t("ReLU advantages:", "ReLU 的优势：")}</strong>
              <ul className="mt-1 space-y-1 text-xs list-disc list-inside dark:text-green-200">
                <li>{t("Gradient ∂ReLU/∂x = 1 for x > 0 — no attenuation in the active region", "梯度 ∂ReLU/∂x = 1（x > 0 时）——激活区域无衰减")}</li>
                <li>{t("Sparse activations: ~50% neurons are zero → implicit regularization", "稀疏激活：约 50% 的神经元为零 → 隐式正则化")}</li>
                <li>{t("Cheaper to compute: max(0,x) vs exp() operations", "计算更便宜：max(0,x) 对比 exp() 运算")}</li>
                <li>{t("Paper result: 4-layer conv net reaches 25% training error in 6× fewer iterations vs tanh", "论文结果：4 层卷积网络仅需 tanh 的 1/6 迭代次数即可达到 25% 训练误差")}</li>
              </ul>
            </div>
          </div>
        </Collapsible>

        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-6">
          <p className="text-sm mb-0 dark:text-amber-100">
            <strong className="dark:text-amber-200">{t("ReLU's one flaw — dying ReLU:", "ReLU 的唯一缺陷——神经元死亡：")}</strong>{" "}
            {t(
              "If a neuron's weights cause it to always produce negative pre-activations, the ReLU output is always zero and its gradient is always zero. The neuron is permanently dead. AlexNet mitigated this by initializing biases in Conv2, Conv4, Conv5 and all FC layers to 1.0 (ensuring positive pre-activations early in training). Later work addressed this with Leaky ReLU, ELU, and batch normalization.",
              "如果一个神经元的权重导致其预激活始终为负，则 ReLU 输出永远为零，梯度永远为零——神经元永久死亡。AlexNet 通过将 Conv2、Conv4、Conv5 及所有全连接层的偏置初始化为 1.0 来缓解这一问题（确保训练早期预激活为正）。后续工作通过 Leaky ReLU、ELU 和批归一化进一步解决了这个问题。"
            )}
          </p>
        </div>

        {/* ============ Section 4: GPU Training ============ */}
        <h2>{t("4. GPU Training Across Two GTX 580s", "4. 在两块 GTX 580 上进行 GPU 训练")}</h2>

        <p>
          {t(
            "Training AlexNet required 1.2 million images over 90 epochs. On a single GPU, this would have taken prohibitively long. The GTX 580 had 3 GB of GDDR5 memory — not enough to hold the full model at a batch size that enabled efficient training. The authors split the network across two GPUs.",
            "训练 AlexNet 需要对 120 万张图像训练 90 个 epoch。在单块 GPU 上，这需要极长的时间。GTX 580 拥有 3GB GDDR5 显存——不足以在能够高效训练的批大小下容纳完整模型。作者将网络拆分到两块 GPU 上。"
          )}
        </p>

        <Collapsible
          title={t("GPU parallelism: which layers communicate?", "GPU 并行：哪些层之间进行通信？")}
          defaultOpen
        >
          <div className="text-sm space-y-2 dark:text-slate-300">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                <div className="font-semibold text-xs text-blue-800 dark:text-blue-300 mb-1">GPU 0</div>
                <div className="text-xs space-y-1 dark:text-blue-200">
                  <div>Conv1: 48 {t("filters", "个滤波器")}</div>
                  <div>Conv2: 128 {t("filters", "个滤波器")}</div>
                  <div>Conv3: 192 {t("filters (sees both GPUs)", "个滤波器（接收两块 GPU）")}</div>
                  <div>Conv4: 192 {t("filters (GPU 0 only)", "个滤波器（仅 GPU 0）")}</div>
                  <div>Conv5: 128 {t("filters (GPU 0 only)", "个滤波器（仅 GPU 0）")}</div>
                </div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded border border-purple-200 dark:border-purple-800">
                <div className="font-semibold text-xs text-purple-800 dark:text-purple-300 mb-1">GPU 1</div>
                <div className="text-xs space-y-1 dark:text-purple-200">
                  <div>Conv1: 48 {t("filters", "个滤波器")}</div>
                  <div>Conv2: 128 {t("filters", "个滤波器")}</div>
                  <div>Conv3: 192 {t("filters (sees both GPUs)", "个滤波器（接收两块 GPU）")}</div>
                  <div>Conv4: 192 {t("filters (GPU 1 only)", "个滤波器（仅 GPU 1）")}</div>
                  <div>Conv5: 128 {t("filters (GPU 1 only)", "个滤波器（仅 GPU 1）")}</div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-paper-100 dark:bg-slate-800 rounded text-xs dark:text-slate-400">
              {t(
                "Conv3 is the only convolutional layer with full cross-GPU connectivity. FC6–FC8 combine outputs from both GPUs. The authors reported that this topology was slightly better than fully inter-connected GPUs — possibly because the per-GPU specialization acts as a form of regularization.",
                "Conv3 是唯一具有完全跨 GPU 连接的卷积层。FC6–FC8 合并两块 GPU 的输出。作者报告称，这种拓扑略优于完全互连的 GPU 方案——可能是因为每块 GPU 的专业化起到了某种正则化作用。"
              )}
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "Training on two GTX 580s took 5–6 days. The paper carefully notes that inter-GPU communication happens only at specific layers, minimizing synchronization overhead. The total training computation was roughly 1.5 × 10¹⁸ floating point operations — trivial by today's standards but enormous for 2012.",
            "在两块 GTX 580 上训练耗时 5–6 天。论文特别指出，GPU 间通信仅发生在特定层，以最小化同步开销。总训练计算量约为 1.5 × 10¹⁸ 次浮点运算——以今天的标准来看微不足道，但对 2012 年而言是巨大的。"
          )}
        </p>

        {/* ============ Section 5: Dropout ============ */}
        <h2>{t("5. Dropout: Regularizing 60M Parameters", "5. Dropout：对 6000 万参数进行正则化")}</h2>

        <p>
          {t(
            "A network with 60 million parameters trained on 1.2 million images is severely overparameterized — it can memorize the training data. AlexNet combated this with dropout, a technique introduced by Hinton's group just before this paper. Dropout randomly zeroes neuron outputs during training:",
            "一个拥有 6000 万参数、在 120 万张图像上训练的网络严重过参数化——它可以记住训练数据。AlexNet 使用 Dropout 来解决这个问题，这是 Hinton 研究组在本文发表前不久提出的技术。Dropout 在训练期间随机将神经元输出置零："
          )}
        </p>

        <Math
          display
          label={t("Dropout: mask each neuron output independently", "Dropout：独立屏蔽每个神经元输出")}
          tex="\tilde{h}_i = \begin{cases} h_i & \text{with probability } 1 - p \\ 0 & \text{with probability } p \end{cases}"
        />

        <p>
          {t(
            "AlexNet applies dropout with p = 0.5 to the outputs of FC6 and FC7. At test time, all neurons are active but their outputs are multiplied by (1 − p) = 0.5 to account for the fact that twice as many neurons are active than during training. This keeps expected activations consistent.",
            "AlexNet 对 FC6 和 FC7 的输出使用 p = 0.5 的 Dropout。在测试时，所有神经元都处于激活状态，但其输出乘以 (1 − p) = 0.5，以补偿测试时比训练时多出一倍的激活神经元。这保持了期望激活值的一致性。"
          )}
        </p>

        <Collapsible
          title={t("Why dropout works: ensemble interpretation", "Dropout 为什么有效：集成视角")}
        >
          <div className="text-sm space-y-2 dark:text-slate-300">
            <p>
              {t(
                "With p = 0.5 dropout on n neurons, there are 2ⁿ possible subnetworks. Each forward pass samples one of these subnetworks. Training with dropout is approximately equivalent to training an exponentially large ensemble of networks that share weights.",
                "对 n 个神经元使用 p = 0.5 的 Dropout，共有 2ⁿ 种可能的子网络。每次前向传播从中采样一个。使用 Dropout 训练大约等同于训练一个共享权重的指数级大小的网络集成。"
              )}
            </p>
            <p>
              {t(
                "Dropout also forces each neuron to learn features that are useful in conjunction with many different subsets of other neurons — preventing co-adaptation, where a group of neurons collectively memorize specific training patterns that generalize poorly.",
                "Dropout 还迫使每个神经元学习在与许多不同的其他神经元子集组合时都有用的特征——防止协同适应，即一组神经元共同记住泛化性差的特定训练模式。"
              )}
            </p>
            <div className="p-3 bg-paper-100 dark:bg-slate-800 rounded text-xs dark:text-slate-400">
              {t(
                "AlexNet ablation: removing dropout caused substantial overfitting. The training error continued to decrease while validation error increased — classic signs of memorization rather than learning.",
                "AlexNet 消融实验：去掉 Dropout 会导致严重过拟合。训练误差持续下降而验证误差上升——这是记忆而非学习的经典信号。"
              )}
            </div>
          </div>
        </Collapsible>

        {/* ============ Section 6: LRN ============ */}
        <h2>{t("6. Local Response Normalization (LRN)", "6. 局部响应归一化（LRN）")}</h2>

        <p>
          {t(
            "AlexNet introduced Local Response Normalization, inspired by a neuroscience concept called lateral inhibition: strongly activated neurons suppress the responses of neighboring neurons. This creates competition between feature maps at the same spatial position.",
            "AlexNet 引入了局部响应归一化，灵感来自神经科学中的侧抑制概念：强激活的神经元会抑制邻近神经元的响应。这在同一空间位置的特征图之间形成竞争。"
          )}
        </p>

        <Math
          display
          label={t("Local Response Normalization formula", "局部响应归一化公式")}
          tex="b_{x,y}^i = \frac{a_{x,y}^i}{\left(k + \alpha \sum_{j=\max(0,\, i - n/2)}^{\min(N-1,\, i + n/2)} \!\left(a_{x,y}^j\right)^2\right)^{\!\beta}}"
        />

        <Collapsible
          title={t("LRN variable breakdown", "LRN 变量解析")}
          defaultOpen
        >
          <div className="text-sm dark:text-slate-300">
            <div className="grid grid-cols-[100px_1fr] gap-y-3 gap-x-3">
              <Math tex="a_{x,y}^i" />
              <span>{t("Pre-normalization activation of neuron i at spatial position (x,y)", "空间位置 (x,y) 处第 i 个神经元的归一化前激活值")}</span>

              <Math tex="b_{x,y}^i" />
              <span>{t("Post-normalization response", "归一化后的响应值")}</span>

              <Math tex="n" />
              <span>{t("Number of adjacent kernel maps to normalize over (AlexNet: n = 5)", "参与归一化的相邻核图数量（AlexNet 中 n = 5）")}</span>

              <Math tex="k,\,\alpha,\,\beta" />
              <span>{t("Hyperparameters: k = 2, α = 10⁻⁴, β = 0.75 (set by validation)", "超参数：k = 2，α = 10⁻⁴，β = 0.75（通过验证集确定）")}</span>

              <Math tex="N" />
              <span>{t("Total number of kernels in the layer", "该层内核的总数量")}</span>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "LRN is applied after the ReLU nonlinearity in Conv1 and Conv2. The authors report it reduces top-1 and top-5 error rates by 1.4% and 1.2% respectively on their validation set. Note: LRN fell out of favor after batch normalization (BN) was introduced in 2015 — BN is more principled, faster to train, and more generally applicable.",
            "LRN 在 Conv1 和 Conv2 的 ReLU 非线性之后应用。作者报告称，它将验证集上的 top-1 和 top-5 错误率分别降低了 1.4% 和 1.2%。注意：2015 年批归一化（BN）引入后，LRN 逐渐退出历史舞台——BN 原理更严谨、训练更快，且适用范围更广。"
          )}
        </p>

        {/* ============ Section 7: Data Augmentation ============ */}
        <h2>{t("7. Data Augmentation: Manufacturing Training Data", "7. 数据增强：制造训练数据")}</h2>

        <p>
          {t(
            "With 60 million parameters and 1.2 million training images, overfitting is a serious risk. Beyond dropout, AlexNet employed two forms of data augmentation that dramatically expand the effective training set size:",
            "拥有 6000 万参数和 120 万训练图像，过拟合是一个严重风险。除 Dropout 外，AlexNet 还采用了两种数据增强形式，大幅扩展了有效训练集的规模："
          )}
        </p>

        <Collapsible
          title={t("Augmentation 1: Random crops and horizontal flips", "增强方式 1：随机裁剪与水平翻转")}
          defaultOpen
        >
          <div className="text-sm space-y-2 dark:text-slate-300">
            <p>
              {t(
                "Images are resized to 256×256, then random 224×224 patches are extracted during training. Horizontal reflections are applied with 50% probability. At test time, 10 patches are extracted (4 corners + center, plus their mirror images) and predictions are averaged.",
                "图像被调整为 256×256 大小，训练期间随机裁取 224×224 的块。水平翻转以 50% 的概率应用。测试时，提取 10 个块（4 个角落 + 中心及其镜像），对预测结果取平均。"
              )}
            </p>
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800 text-xs dark:text-green-200">
              {t(
                "Effect: A 256×256 image yields 32×32 + 1 = 1,025 valid 224×224 crops. With flips: ~2,050 variants per image. The effective training set grows by ~2,000×.",
                "效果：一张 256×256 的图像可产生 32×32 + 1 = 1,025 个有效的 224×224 裁剪块。加上翻转后：每张图像约 2,050 种变体。有效训练集扩大约 2,000 倍。"
              )}
            </div>
          </div>
        </Collapsible>

        <Collapsible
          title={t("Augmentation 2: PCA color jitter", "增强方式 2：PCA 颜色抖动")}
          defaultOpen
        >
          <div className="text-sm space-y-2 dark:text-slate-300">
            <p>
              {t(
                "AlexNet performs PCA on the RGB pixel values across the entire ImageNet training set. For each training image, random multiples of the principal components are added to each pixel. Specifically, the following quantity is added to each pixel:",
                "AlexNet 对整个 ImageNet 训练集的 RGB 像素值进行 PCA。对于每张训练图像，将主成分的随机倍数加到每个像素上。具体而言，将以下量加到每个像素："
              )}
            </p>
            <Math
              display
              label={t("PCA color augmentation", "PCA 颜色增强")}
              tex="\left[\mathbf{p}_1,\, \mathbf{p}_2,\, \mathbf{p}_3\right] \left[\alpha_1 \lambda_1,\, \alpha_2 \lambda_2,\, \alpha_3 \lambda_3\right]^\top"
            />
            <p className="text-xs dark:text-slate-400">
              {t(
                "where pᵢ and λᵢ are the i-th eigenvector and eigenvalue of the 3×3 RGB covariance matrix, and αᵢ ~ N(0, 0.1) are random scalings drawn once per image per epoch. This models the fact that object identity is invariant to changes in illumination intensity and color.",
                "其中 pᵢ 和 λᵢ 是 3×3 RGB 协方差矩阵的第 i 个特征向量和特征值，αᵢ ~ N(0, 0.1) 是每张图像每个 epoch 采样一次的随机缩放系数。这模拟了目标身份对光照强度和颜色变化的不变性。"
              )}
            </p>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800 text-xs dark:text-blue-200">
              {t(
                "Result: This augmentation alone reduces top-1 error by over 1%. It captures a key invariance: a red apple is the same apple in warm vs cool lighting.",
                "结果：仅此增强方式就将 top-1 误差降低了超过 1%。它捕捉了一个关键不变性：红苹果在暖光和冷光下是同一个苹果。"
              )}
            </div>
          </div>
        </Collapsible>

        {/* ============ Section 8: Results ============ */}
        <h2>{t("8. Results: The 10.9-Point Gap", "8. 结果：10.9 个百分点的差距")}</h2>

        <p>
          {t(
            "ILSVRC-2012 evaluated systems on a test set of 150,000 images, computing both top-1 accuracy (is the highest-confidence prediction correct?) and top-5 accuracy (is the correct label among the 5 highest-confidence predictions?).",
            "ILSVRC-2012 在 15 万张测试图像上评估系统，同时计算 top-1 准确率（最高置信度预测是否正确？）和 top-5 准确率（正确标签是否在置信度最高的 5 个预测中？）。"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-slate-800">
                <th className="border border-paper-200 dark:border-slate-600 px-4 py-2 text-left dark:text-slate-200">
                  {t("Model", "模型")}
                </th>
                <th className="border border-paper-200 dark:border-slate-600 px-4 py-2 text-left dark:text-slate-200">
                  {t("Top-1 Error", "Top-1 错误率")}
                </th>
                <th className="border border-paper-200 dark:border-slate-600 px-4 py-2 text-left dark:text-slate-200">
                  {t("Top-5 Error", "Top-5 错误率")}
                </th>
                <th className="border border-paper-200 dark:border-slate-600 px-4 py-2 text-left dark:text-slate-200">
                  {t("Approach", "方法")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-green-50 dark:bg-green-950">
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 font-semibold text-green-700 dark:text-green-400">
                  AlexNet (5 CNNs ensemble)
                </td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 font-semibold text-green-700 dark:text-green-400">
                  36.7%
                </td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 font-semibold text-green-700 dark:text-green-400">
                  15.3%
                </td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 text-xs text-green-700 dark:text-green-400">
                  {t("Deep CNN, GPU training", "深度 CNN，GPU 训练")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 dark:text-slate-300">
                  AlexNet (single model)
                </td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 dark:text-slate-300">38.1%</td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 dark:text-slate-300">16.4%</td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 text-xs dark:text-slate-400">
                  {t("Deep CNN, GPU training", "深度 CNN，GPU 训练")}
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-slate-900">
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 dark:text-slate-300">
                  {t("2nd place (Clarifai/ISI)", "第2名（Clarifai/ISI）")}
                </td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 dark:text-slate-300">—</td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 text-red-600 dark:text-red-400 font-semibold">26.2%</td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 text-xs dark:text-slate-400">
                  {t("SIFT + Fisher vectors", "SIFT + Fisher 向量")}</td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 dark:text-slate-300">
                  {t("3rd place", "第3名")}
                </td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 dark:text-slate-300">—</td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 dark:text-slate-300">27.0%</td>
                <td className="border border-paper-200 dark:border-slate-600 px-4 py-2 text-xs dark:text-slate-400">
                  {t("Hand-crafted features", "手工特征")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-6">
          <p className="text-sm mb-0 dark:text-blue-100">
            <strong className="dark:text-blue-200">{t("The ensemble trick:", "集成技巧：")}</strong>{" "}
            {t(
              "AlexNet's 15.3% result used an ensemble of 5 independently trained networks whose softmax outputs were averaged. This boosted performance from 16.4% (single model) to 15.3% — a modest gain, but enough to matter. Model ensembling became a standard competition practice.",
              "AlexNet 的 15.3% 结果使用了 5 个独立训练网络的集成，对其 softmax 输出取平均。这将性能从 16.4%（单模型）提升至 15.3%——提升幅度不大，但足够重要。模型集成成为了竞赛中的标准做法。"
            )}
          </p>
        </div>

        <Collapsible
          title={t("AlexNet ablation: which components matter most?", "AlexNet 消融实验：哪些组件最重要？")}
        >
          <div className="text-sm space-y-2 dark:text-slate-300">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-paper-100 dark:bg-slate-800">
                    <th className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-left dark:text-slate-200">{t("Variant", "变体")}</th>
                    <th className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-left dark:text-slate-200">{t("Top-1 Error", "Top-1 错误率")}</th>
                    <th className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-left dark:text-slate-200">{t("Change", "变化")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("Full AlexNet", "完整 AlexNet")}</td>
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 font-semibold text-green-700 dark:text-green-400">38.1%</td>
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-400">—</td>
                  </tr>
                  <tr className="bg-paper-50 dark:bg-slate-900">
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("Remove LRN", "去掉 LRN")}</td>
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">39.5%</td>
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-red-600 dark:text-red-400">+1.4%</td>
                  </tr>
                  <tr>
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("Remove dropout", "去掉 Dropout")}</td>
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">~42%+</td>
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-red-600 dark:text-red-400">+4%+</td>
                  </tr>
                  <tr className="bg-paper-50 dark:bg-slate-900">
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">{t("Remove data augmentation", "去掉数据增强")}</td>
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 dark:text-slate-300">~41%+</td>
                    <td className="border border-paper-200 dark:border-slate-600 px-3 py-2 text-red-600 dark:text-red-400">+3%+</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-paper-800/60 dark:text-slate-400">
              {t("Note: exact ablation numbers were not all reported in the paper; some entries are approximate based on partial ablation data.", "注：论文中并未报告所有消融数字；部分条目基于部分消融数据的近似估计。")}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 9: Why It Mattered ============ */}
        <h2>{t("9. Why AlexNet Mattered: The Lessons That Lasted", "9. AlexNet 为何重要：经久不衰的教训")}</h2>

        <p>
          {t(
            "AlexNet was not just a better image classifier. It was a proof of concept that validated several ideas simultaneously — ideas that have compounded into the AI systems of today.",
            "AlexNet 不仅仅是一个更好的图像分类器。它是一个概念验证，同时验证了几个想法——这些想法已经积累成了今天的 AI 系统。"
          )}
        </p>

        <div className="space-y-4 my-6">
          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-sm mb-1 dark:text-slate-200">{t("Scale works", "规模有效")}</h4>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mb-0">
              {t(
                "AlexNet had 60M parameters trained on 1.2M images. The previous ILSVRC winners used far fewer parameters and hand-crafted features. More depth, more parameters, more data — this combination works. The insight generalizes: GPT-3 has 175B parameters, GPT-4 has ~1T, and performance keeps improving.",
                "AlexNet 有 6000 万参数，在 120 万图像上训练。之前的 ILSVRC 冠军使用的参数少得多，并且依赖手工特征。更多层、更多参数、更多数据——这种组合有效。这一洞察具有普遍性：GPT-3 有 1750 亿参数，GPT-4 约有 1 万亿，性能持续提升。"
              )}
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-sm mb-1 dark:text-slate-200">{t("GPUs are the platform for deep learning", "GPU 是深度学习的平台")}</h4>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mb-0">
              {t(
                "AlexNet's training required GPU parallelism. NVIDIA's CUDA framework made this accessible. Within a few years, GPU-accelerated deep learning became the standard, and NVIDIA's valuation would grow from ~$10B in 2012 to over $3T by 2024. AlexNet demonstrated this path.",
                "AlexNet 的训练需要 GPU 并行计算。NVIDIA 的 CUDA 框架使这成为可能。几年之内，GPU 加速的深度学习成为标准，NVIDIA 的市值从 2012 年的约 100 亿美元增长到 2024 年的超过 3 万亿美元。AlexNet 开创了这条道路。"
              )}
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-sm mb-1 dark:text-slate-200">{t("Learned features beat hand-crafted ones", "学习到的特征优于手工特征")}</h4>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mb-0">
              {t(
                "The filters learned by AlexNet's first convolutional layer look like Gabor filters — edge detectors at various orientations and frequencies. Researchers spent decades engineering such features by hand. AlexNet learned them automatically from data. This vindicated the representational learning hypothesis: given enough data and compute, networks learn their own feature hierarchy.",
                "AlexNet 第一个卷积层学习到的滤波器看起来像 Gabor 滤波器——各种方向和频率的边缘检测器。研究人员花了数十年手工设计这类特征。AlexNet 从数据中自动学习了它们。这验证了表示学习假说：给定足够的数据和计算，网络会自动学习自己的特征层次结构。"
              )}
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-sm mb-1 dark:text-slate-200">{t("Transfer learning becomes possible", "迁移学习成为可能")}</h4>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mb-0">
              {t(
                "Because AlexNet learns general visual features (edges → textures → parts → objects), its learned weights transfer to new tasks. Fine-tuning an AlexNet trained on ImageNet became the standard starting point for any new vision task — object detection, segmentation, medical imaging. This paradigm of pre-train then fine-tune now dominates all of ML.",
                "由于 AlexNet 学习的是通用视觉特征（边缘→纹理→部件→物体），其学习到的权重可以迁移到新任务。在 ImageNet 上预训练的 AlexNet 微调成为任何新视觉任务的标准起点——目标检测、分割、医学影像。这种预训练-微调范式现在主导着整个 ML 领域。"
              )}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-4 my-6">
          <p className="text-sm mb-0 dark:text-slate-300">
            <strong>{t("The broader legacy:", "更广泛的遗产：")}</strong>{" "}
            {t(
              "VGGNet (2014) pushed to 19 layers. GoogLeNet (2014) added inception modules. ResNet (2015) reached 152 layers using skip connections. Each built on AlexNet's core insight: depth + GPU + end-to-end training + sufficient data = state-of-the-art results. That insight now underlies every transformer, diffusion model, and large language model in existence.",
              "VGGNet（2014）将深度推进到 19 层。GoogLeNet（2014）加入了 inception 模块。ResNet（2015）使用跳跃连接达到了 152 层。每一个都建立在 AlexNet 的核心洞见之上：深度 + GPU + 端到端训练 + 足够数据 = 最先进的结果。这一洞见现在支撑着现有的每一个 Transformer、扩散模型和大型语言模型。"
            )}
          </p>
        </div>

        {/* ============ Related Papers ============ */}
        <h2>{t("10. Connections to Other Work", "10. 与其他工作的联系")}</h2>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg">
            <Link
              href={`${basePath}/papers/clip`}
              className="font-semibold text-blue-600 hover:underline"
            >
              CLIP
            </Link>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mt-1">
              {t(
                "CLIP's image encoder descends directly from AlexNet's paradigm: a convolutional (or later ViT-based) backbone trained end-to-end on large-scale image data. AlexNet established that visual representations can be learned, not engineered — CLIP scales this to 400M image-text pairs.",
                "CLIP 的图像编码器直接继承自 AlexNet 的范式：一个在大规模图像数据上端到端训练的卷积（或后来基于 ViT 的）主干网络。AlexNet 确立了视觉表示可以被学习而非手工设计——CLIP 将这一点扩展到 4 亿图文对。"
              )}
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg">
            <Link
              href={`${basePath}/papers/attention-is-all-you-need`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {t("Attention Is All You Need", "Attention Is All You Need")}
            </Link>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mt-1">
              {t(
                "The Transformer (2017) replaced CNNs in NLP just as AlexNet had replaced hand-crafted features in vision. Both papers prove that end-to-end learned representations beat prior engineered approaches at scale. Vision Transformers (ViT) later brought Transformers back to image classification, but AlexNet's infrastructure — GPU training, ReLU, dropout, large datasets — underpins both.",
                "Transformer（2017）在 NLP 领域取代 CNN，就像 AlexNet 在视觉领域取代手工特征一样。两篇论文都证明了端到端学习的表示在规模上优于此前的工程化方法。视觉 Transformer（ViT）后来将 Transformer 带回图像分类，但 AlexNet 的基础设施——GPU 训练、ReLU、Dropout、大型数据集——支撑着两者。"
              )}
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg">
            <Link
              href={`${basePath}/papers/lora`}
              className="font-semibold text-blue-600 hover:underline"
            >
              LoRA
            </Link>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mt-1">
              {t(
                "AlexNet introduced the paradigm of pre-training a large model then adapting it to new tasks — first as full fine-tuning. LoRA refines this by making adaptation parameter-efficient. Both papers exist on the same continuum: AlexNet established that learned representations transfer; LoRA makes that transfer cheap.",
                "AlexNet 引入了预训练大型模型然后将其适配到新任务的范式——最初以全量微调的形式。LoRA 通过使适配参数高效来改进这一点。两篇论文处于同一延续线上：AlexNet 确立了学习到的表示可以迁移；LoRA 使这种迁移变得廉价。"
              )}
            </p>
          </div>
        </div>

        {/* ============ Resources ============ */}
        <h2>{t("11. Additional Resources", "11. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a
            href="https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <span className="text-sm font-medium dark:text-slate-200">
              {t("AlexNet — NeurIPS 2012 (original paper)", "AlexNet — NeurIPS 2012（原始论文）")}
            </span>
            <span className="text-xs text-paper-800/50 dark:text-slate-400 ml-2">
              {t("proceedings.neurips.cc", "proceedings.neurips.cc")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/1409.1556"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <span className="text-sm font-medium dark:text-slate-200">VGGNet (Simonyan & Zisserman, 2014)</span>
            <span className="text-xs text-paper-800/50 dark:text-slate-400 ml-2">
              {t("Direct successor: pushed depth to 19 layers", "直接继承者：将深度推进到 19 层")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/1512.03385"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <span className="text-sm font-medium dark:text-slate-200">ResNet (He et al., 2015)</span>
            <span className="text-xs text-paper-800/50 dark:text-slate-400 ml-2">
              {t("Skip connections enabled 152-layer networks", "跳跃连接使 152 层网络成为可能")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/1502.03167"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <span className="text-sm font-medium dark:text-slate-200">
              {t("Batch Normalization (Ioffe & Szegedy, 2015)", "批归一化（Ioffe & Szegedy, 2015）")}
            </span>
            <span className="text-xs text-paper-800/50 dark:text-slate-400 ml-2">
              {t("Superseded LRN; made deep networks far easier to train", "取代了 LRN；使深层网络更易训练")}
            </span>
          </a>
          <a
            href="http://karpathy.github.io/2014/09/02/what-i-learned-from-competing-against-a-convnet-on-imagenet/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <span className="text-sm font-medium dark:text-slate-200">
              {t("Andrej Karpathy — What I Learned Competing Against a ConvNet on ImageNet", "Andrej Karpathy — 与卷积网络在 ImageNet 上竞争的经验")}
            </span>
            <span className="text-xs text-paper-800/50 dark:text-slate-400 ml-2">
              {t("Human-level evaluation: Karpathy achieved 5.1% top-5 error", "人类水平评估：Karpathy 达到 5.1% 的 top-5 错误率")}
            </span>
          </a>
        </div>

        {/* ============ Back link ============ */}
        <div className="mt-12 pt-6 border-t border-paper-200 dark:border-slate-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            ← {t("Back to Papers", "返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
