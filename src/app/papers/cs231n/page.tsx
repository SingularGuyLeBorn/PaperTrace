"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function CS231nPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "CS231n: Convolutional Neural Networks for Visual Recognition",
            "CS231n：用于视觉识别的卷积神经网络"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-slate-400">
          Fei-Fei Li, Andrej Karpathy, Justin Johnson &middot; Stanford University &middot;{" "}
          <a
            href="https://cs231n.stanford.edu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            cs231n.stanford.edu
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "CS231n is Stanford's foundational course on deep learning for computer vision. Taught by Fei-Fei Li, Andrej Karpathy, and Justin Johnson, it covers everything from k-NN classifiers and loss functions through backprop, CNNs, batch normalization, and modern architectures (AlexNet → ResNet), all the way to detection, segmentation, and visualization. It is the single best place to build a rigorous, mathematical understanding of how vision models actually work.",
              "CS231n 是斯坦福大学关于计算机视觉深度学习的基础课程，由 Fei-Fei Li、Andrej Karpathy 和 Justin Johnson 讲授。课程内容涵盖从 k-NN 分类器和损失函数，到反向传播、CNN、批归一化和现代架构（AlexNet → ResNet），再到目标检测、分割和可视化。这是建立对视觉模型工作原理深刻、严谨数学理解的最佳资源。"
            )}
          </p>
        </section>

        {/* ============ 1. Why CS231n? ============ */}
        <h2>{t("1. Why CS231n?", "1. 为什么学 CS231n？")}</h2>

        <p>
          {t(
            "Most machine learning courses teach models as black boxes. CS231n does the opposite: it forces you to derive every gradient by hand, implement every layer from scratch in NumPy, and understand why design choices like ReLU, batch norm, or skip connections exist. The assignments — especially the CNN implementation and the style transfer project — are among the most educational exercises in any public ML curriculum.",
            "大多数机器学习课程将模型当作黑盒来教。CS231n 恰恰相反：它要求你手动推导每个梯度，用 NumPy 从头实现每一层，并理解为什么 ReLU、批归一化或跳跃连接这类设计选择是存在的。作业——尤其是 CNN 实现和风格迁移项目——是公开 ML 课程中最有教育意义的练习之一。"
          )}
        </p>

        <p>
          {t(
            "The course is particularly valuable for interview preparation. Questions about convolution output sizes, backprop through a ReLU, what batch norm does at test time, or why ResNet works — all of these appear frequently in ML engineering and research interviews at top AI labs.",
            "该课程对面试备考尤为有价值。关于卷积输出尺寸、ReLU 的反向传播、批归一化在测试时的行为，或 ResNet 为何有效——这些问题在顶级 AI 公司的 ML 工程和研究面试中频繁出现。"
          )}
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-900 dark:text-amber-200 mb-0">
            <span className="font-semibold">{t("Recommended path: ", "推荐学习路径：")}</span>
            {t(
              "Watch lecture videos (2017 or 2022 versions), read the notes on cs231n.github.io, and complete at least Assignment 1 (k-NN, SVM, softmax, two-layer net) and Assignment 2 (BatchNorm, Dropout, ConvNet). The notes are exceptionally well-written and can be read independently.",
              "观看讲座视频（2017 或 2022 版本），阅读 cs231n.github.io 上的课程笔记，并完成至少作业 1（k-NN、SVM、softmax、两层网络）和作业 2（BatchNorm、Dropout、ConvNet）。课程笔记写得极为出色，可以独立阅读。"
            )}
          </p>
        </div>

        {/* ============ 2. Image Classification Fundamentals ============ */}
        <h2>{t("2. Image Classification Fundamentals", "2. 图像分类基础")}</h2>

        <p>
          {t(
            "CS231n opens with the image classification problem: given a fixed set of categories (say, 1000 ImageNet classes), assign the correct label to any input image. This is harder than it sounds — a cat can appear in any pose, lighting, or partial occlusion, and each image is just a 3D array of numbers to the model.",
            "CS231n 从图像分类问题入手：给定一组固定类别（例如 1000 个 ImageNet 类别），为任意输入图像分配正确标签。这比听起来难得多——一只猫可以以任何姿态、光照或部分遮挡的方式出现，对模型来说每张图像只是一个三维数字数组。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("k-Nearest Neighbors", "k 近邻分类器")}
        </h3>

        <p>
          {t(
            "The course starts with k-NN as a conceptual baseline. At test time, find the k training images closest in pixel space (L1 or L2 distance) to the query, and take a majority vote. k-NN has no training time — all computation is deferred to inference — but it scales terribly (O(N) per query) and raw pixel distances are a poor semantic similarity measure.",
            "课程以 k-NN 作为概念基线。在测试时，找到像素空间中（L1 或 L2 距离）与查询图像最近的 k 张训练图像，进行多数投票。k-NN 没有训练时间——所有计算推迟到推理阶段——但扩展性极差（每次查询 O(N)），且原始像素距离是糟糕的语义相似度度量。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Linear Classifiers", "线性分类器")}
        </h3>

        <p>
          {t(
            "A linear classifier computes a score for each class as a dot product of the weight matrix W and the input vector x (plus a bias b). For an image with pixel values flattened into a D-dimensional vector and C classes:",
            "线性分类器将每个类别的得分计算为权重矩阵 W 与输入向量 x 的点积（加上偏置 b）。对于像素值展平为 D 维向量且有 C 个类别的图像："
          )}
        </p>

        <Math
          display
          label={t("Linear classifier scores", "线性分类器得分")}
          tex="f(x_i, W, b) = W x_i + b \quad \in \mathbb{R}^C"
        />

        <p>
          {t(
            "W has shape C × D. Each row of W can be visualized as a 'template' for a class — the classifier learns one template per class and scores an image by how much it resembles each template. This is powerful but limited: one template per class cannot handle multimodal distributions (a car from the front looks nothing like a car from the side).",
            "W 的形状为 C × D。W 的每一行可以可视化为一个类别的「模板」——分类器为每个类别学习一个模板，通过图像与每个模板的相似程度来打分。这很强大但有局限：每个类别一个模板无法处理多模态分布（从正面看的汽车和从侧面看的汽车完全不同）。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Loss Functions", "损失函数")}
        </h3>

        <p>
          {t(
            "Two loss functions dominate the early course: SVM (hinge) loss and Softmax (cross-entropy) loss.",
            "课程前期有两个主要的损失函数：SVM（合页）损失和 Softmax（交叉熵）损失。"
          )}
        </p>

        <p>
          {t(
            "The multiclass SVM loss for example i sums over all wrong classes j ≠ y_i, penalizing any wrong class that scores higher than the correct class score by less than a margin Δ:",
            "样本 i 的多分类 SVM 损失对所有错误类别 j ≠ y_i 求和，对得分比正确类别得分高不足边距 Δ 的错误类别进行惩罚："
          )}
        </p>

        <Math
          display
          label={t("Multiclass SVM (hinge) loss", "多分类 SVM（合页）损失")}
          tex="L_i = \sum_{j \neq y_i} \max(0,\, f_j - f_{y_i} + \Delta)"
        />

        <p>
          {t(
            "With Δ = 1, the loss is zero only when the correct class score exceeds every wrong class score by at least 1. The Softmax loss converts raw scores into probabilities via the softmax function, then takes the negative log probability of the correct class:",
            "当 Δ = 1 时，只有当正确类别得分超过所有错误类别得分至少 1 时，损失才为零。Softmax 损失通过 softmax 函数将原始得分转换为概率，然后取正确类别的负对数概率："
          )}
        </p>

        <Math
          display
          label={t("Softmax cross-entropy loss", "Softmax 交叉熵损失")}
          tex="L_i = -\log\!\left(\frac{e^{f_{y_i}}}{\sum_j e^{f_j}}\right)"
        />

        <Collapsible title={t("SVM vs. Softmax: key differences", "SVM 与 Softmax 的关键区别")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "SVM loss only cares about whether the margin is satisfied — once the correct class score is comfortably above all wrong classes by Δ, the loss is exactly zero and gradients vanish. Softmax always pushes the correct class probability toward 1, providing non-zero gradient even when the classifier is already correct.",
                "SVM 损失只关心边距是否满足——一旦正确类别得分比所有错误类别高出 Δ，损失恰好为零，梯度消失。Softmax 始终将正确类别概率推向 1，即使分类器已经正确，也提供非零梯度。"
              )}
            </p>
            <p>
              {t(
                "In practice, Softmax is used almost universally for classification because it produces calibrated probabilities and integrates naturally with cross-entropy. SVM loss is taught primarily to build intuition about margins and the structure of loss functions.",
                "实践中，Softmax 几乎普遍用于分类，因为它产生校准概率并与交叉熵自然结合。SVM 损失主要作为教学内容，用于建立对边距和损失函数结构的直觉。"
              )}
            </p>
            <p>
              {t(
                "Numerical stability tip: when computing softmax, subtract the maximum score from all scores before exponentiating. This prevents overflow without changing the result: e^{f_j - max} / Σ e^{f_k - max} = e^{f_j} / Σ e^{f_k}.",
                "数值稳定性提示：计算 softmax 时，在求指数之前从所有得分中减去最大得分。这可以防止溢出而不改变结果：e^{f_j - max} / Σ e^{f_k - max} = e^{f_j} / Σ e^{f_k}。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ 3. Optimization ============ */}
        <h2>{t("3. Optimization: From SGD to Adam", "3. 优化：从 SGD 到 Adam")}</h2>

        <p>
          {t(
            "Once we have a loss function, the goal is to find parameters W that minimize it. CS231n covers the full optimization toolkit used in modern deep learning.",
            "一旦有了损失函数，目标就是找到使其最小化的参数 W。CS231n 涵盖了现代深度学习中使用的完整优化工具包。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Stochastic Gradient Descent (SGD)", "随机梯度下降（SGD）")}
        </h3>

        <p>
          {t(
            "Vanilla gradient descent computes the gradient of the loss over the entire dataset before each update — prohibitively expensive. SGD approximates this by using a small mini-batch of B examples (typically 32–256) to estimate the gradient:",
            "原始梯度下降在每次更新前计算整个数据集的损失梯度——代价极高。SGD 通过使用 B 个样本的小批量（通常 32–256）来估计梯度："
          )}
        </p>

        <Math
          display
          label={t("SGD update", "SGD 更新")}
          tex="W \leftarrow W - \alpha \nabla_W L"
        />

        <p>
          {t(
            "where α is the learning rate. The mini-batch gradient is a noisy but unbiased estimate of the full-batch gradient. The noise actually helps — it allows the optimizer to escape shallow local minima and saddle points.",
            "其中 α 是学习率。小批量梯度是全批量梯度的有噪声但无偏的估计。这种噪声实际上有帮助——它允许优化器逃脱浅层局部极小值和鞍点。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Momentum and Adaptive Methods", "动量与自适应方法")}
        </h3>

        <p>
          {t(
            "Plain SGD can oscillate in narrow ravines of the loss landscape. Momentum accumulates a velocity vector in the direction of persistent gradients, dampening oscillation:",
            "普通 SGD 在损失面的狭长沟壑中可能出现震荡。动量在持续梯度方向上累积速度向量，抑制震荡："
          )}
        </p>

        <Math
          display
          label={t("SGD with momentum", "带动量的 SGD")}
          tex="v \leftarrow \mu v - \alpha \nabla_W L, \quad W \leftarrow W + v"
        />

        <p>
          {t(
            "Typical momentum coefficient μ = 0.9. RMSprop adapts the learning rate per-parameter by dividing by a running average of squared gradients, preventing large updates in directions that already have large gradient magnitudes. Adam combines momentum and RMSprop, and is the default optimizer for most deep learning work today:",
            "典型动量系数 μ = 0.9。RMSprop 通过除以平方梯度的滑动平均来自适应调整每个参数的学习率，防止在梯度幅度已大的方向上产生大更新。Adam 结合了动量和 RMSprop，是当今大多数深度学习工作的默认优化器："
          )}
        </p>

        <Math
          display
          label={t("Adam update rule", "Adam 更新规则")}
          tex="m \leftarrow \beta_1 m + (1-\beta_1)g, \quad v \leftarrow \beta_2 v + (1-\beta_2)g^2, \quad W \leftarrow W - \frac{\alpha\, \hat{m}}{\sqrt{\hat{v}}+\epsilon}"
        />

        <Collapsible title={t("Learning rate schedules", "学习率调度")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "The learning rate is the single most important hyperparameter. Common schedules:",
                "学习率是最重要的单一超参数。常用调度方案："
              )}
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>{t("Step decay: ", "阶梯衰减：")}</strong>
                {t(
                  "multiply LR by γ (e.g., 0.1) every k epochs. Simple and commonly used with ResNets.",
                  "每 k 个 epoch 将学习率乘以 γ（例如 0.1）。简单，常用于 ResNet。"
                )}
              </li>
              <li>
                <strong>{t("Cosine annealing: ", "余弦退火：")}</strong>
                {t(
                  "LR follows a cosine curve from α_max to α_min. Smooth and effective; used in most modern training recipes.",
                  "学习率从 α_max 到 α_min 沿余弦曲线变化。平滑有效，用于大多数现代训练方案。"
                )}
              </li>
              <li>
                <strong>{t("Warmup: ", "预热：")}</strong>
                {t(
                  "Start with a very small LR and ramp up linearly for the first few epochs. Stabilizes early training, especially with large batch sizes or transformers.",
                  "从极小的学习率开始，在前几个 epoch 线性增大。稳定早期训练，尤其在大批量或 Transformer 中。"
                )}
              </li>
            </ul>
            <p>
              {t(
                "The CS231n course notes recommend monitoring the training loss curve: a loss that decreases then plateaus suggests the LR should be decayed; a loss that explodes or oscillates wildly suggests the LR is too high.",
                "CS231n 课程笔记建议监控训练损失曲线：损失先降后趋于平稳表明应该衰减学习率；损失爆炸或剧烈震荡表明学习率过高。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ 4. Backpropagation from Scratch ============ */}
        <h2>{t("4. Backpropagation from Scratch", "4. 从零理解反向传播")}</h2>

        <p>
          {t(
            "Backpropagation is the algorithm that computes gradients efficiently by applying the chain rule through a computational graph. CS231n's treatment is exceptionally clear: every node in the graph has a forward pass (compute output) and a backward pass (multiply incoming gradient by local gradient).",
            "反向传播是通过计算图应用链式法则高效计算梯度的算法。CS231n 的讲解异常清晰：图中每个节点都有前向传播（计算输出）和反向传播（将传入梯度与局部梯度相乘）。"
          )}
        </p>

        <Math
          display
          label={t("Chain rule at a node", "节点处的链式法则")}
          tex="\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y} \cdot \frac{\partial y}{\partial x}"
        />

        <p>
          {t(
            "The upstream gradient ∂L/∂y flows back from downstream nodes. The local gradient ∂y/∂x depends only on the current node's inputs and outputs. Their product gives the gradient flowing into the current node's inputs.",
            "上游梯度 ∂L/∂y 从下游节点反向流入。局部梯度 ∂y/∂x 仅取决于当前节点的输入和输出。两者的乘积给出流入当前节点输入的梯度。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Gate Intuitions", "门的直觉理解")}
        </h3>

        <p>
          {t(
            "CS231n gives memorable names to common gate patterns:",
            "CS231n 为常见的门模式提供了便于记忆的名称："
          )}
        </p>

        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <strong>{t("Add gate: ", "加法门：")}</strong>
            {t(
              "distributes gradient equally to both inputs (∂(x+y)/∂x = 1, ∂(x+y)/∂y = 1). Gradient flows through unchanged.",
              "将梯度等量分配给两个输入（∂(x+y)/∂x = 1，∂(x+y)/∂y = 1）。梯度不变地流过。"
            )}
          </li>
          <li>
            <strong>{t("Multiply gate: ", "乘法门：")}</strong>
            {t(
              "swaps the inputs as gradients (∂(xy)/∂x = y, ∂(xy)/∂y = x). Each input's gradient is the other input times the upstream gradient.",
              "交换输入作为梯度（∂(xy)/∂x = y，∂(xy)/∂y = x）。每个输入的梯度是另一个输入乘以上游梯度。"
            )}
          </li>
          <li>
            <strong>{t("Max gate: ", "最大值门：")}</strong>
            {t(
              "routes gradient to the input that was largest (∂max(x,y)/∂x = 1 if x > y, else 0). Acts as a switch.",
              "将梯度路由到最大的输入（若 x > y 则 ∂max(x,y)/∂x = 1，否则为 0）。充当开关。"
            )}
          </li>
        </ul>

        <Collapsible title={t("Worked example: sigmoid gate backward pass", "实例推导：sigmoid 门的反向传播")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "The sigmoid function σ(x) = 1 / (1 + e^{-x}) has a beautifully compact derivative:",
                "sigmoid 函数 σ(x) = 1 / (1 + e^{-x}) 有一个简洁优美的导数："
              )}
            </p>
            <Math
              display
              tex="\frac{d\sigma}{dx} = \sigma(x)\,(1 - \sigma(x))"
            />
            <p>
              {t(
                "Proof: write σ = (1 + e^{-x})^{-1}. By the chain rule, dσ/dx = -(1 + e^{-x})^{-2} · (-e^{-x}) = e^{-x} / (1 + e^{-x})^2 = σ · (e^{-x} / (1 + e^{-x})) = σ · (1 - σ). In code, if you cache the forward-pass output f = σ(x), the backward pass is just: dx = upstream_grad * f * (1 - f).",
                "证明：令 σ = (1 + e^{-x})^{-1}。由链式法则，dσ/dx = -(1 + e^{-x})^{-2} · (-e^{-x}) = e^{-x} / (1 + e^{-x})^2 = σ · (e^{-x} / (1 + e^{-x})) = σ · (1 - σ)。在代码中，若缓存了前向传播输出 f = σ(x)，则反向传播为：dx = upstream_grad * f * (1 - f)。"
              )}
            </p>
            <p>
              {t(
                "This illustrates a key principle: CS231n teaches you to derive these formulas, not memorize them. With practice, backprop through any function becomes mechanical.",
                "这说明了一个关键原则：CS231n 教你推导这些公式，而不是死记硬背。经过练习，通过任何函数的反向传播都变得机械化。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ 5. Neural Networks and Activations ============ */}
        <h2>{t("5. Neural Networks: Layers and Activations", "5. 神经网络：层与激活函数")}</h2>

        <p>
          {t(
            "A fully connected (FC) layer applies a linear transformation followed by an elementwise nonlinearity. Stack multiple FC layers and you have a neural network. Without the nonlinearity, stacking layers is equivalent to a single linear transformation — no expressive power is gained.",
            "全连接（FC）层应用线性变换，后接逐元素非线性。堆叠多个 FC 层就得到了神经网络。没有非线性，堆叠层等同于单一线性变换——无法获得更强的表达能力。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Activation Functions", "激活函数")}
        </h3>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-slate-800">
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Activation", "激活函数")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Formula", "公式")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Key property / issue", "关键特性 / 问题")}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Sigmoid",
                  "σ(x) = 1/(1+e⁻ˣ)",
                  t("Output ∈ (0,1); saturates → vanishing gradient; not zero-centered", "输出 ∈ (0,1)；饱和 → 梯度消失；非零中心化"),
                ],
                [
                  "Tanh",
                  "tanh(x)",
                  t("Output ∈ (−1,1); zero-centered; still saturates at extremes", "输出 ∈ (−1,1)；零中心化；极端值仍饱和"),
                ],
                [
                  "ReLU",
                  "max(0, x)",
                  t("Fast to compute; no vanishing gradient for x>0; dying ReLU problem", "计算快；x>0 时无梯度消失；存在 dying ReLU 问题"),
                ],
                [
                  "Leaky ReLU",
                  "max(αx, x), α≈0.01",
                  t("Fixes dying ReLU by allowing small gradient for x<0", "允许 x<0 时有小梯度，修复 dying ReLU 问题"),
                ],
              ].map(([name, formula, note]) => (
                <tr key={name} className="odd:bg-white dark:odd:bg-transparent even:bg-paper-50 dark:even:bg-slate-900/30">
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2 font-mono font-semibold">{name}</td>
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2 font-mono text-xs">{formula}</td>
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "ReLU is the default choice for hidden layers in CNNs. Its gradient is either 0 (for negative inputs) or 1 (for positive inputs), which avoids the vanishing gradient problem that plagued sigmoid and tanh at depth. The 'dying ReLU' issue — neurons that always output zero because their input is always negative — can be mitigated with careful initialization, smaller learning rates, or Leaky ReLU.",
            "ReLU 是 CNN 隐藏层的默认选择。其梯度要么为 0（负输入）要么为 1（正输入），避免了 sigmoid 和 tanh 在深度时的梯度消失问题。「dying ReLU」问题——神经元因输入始终为负而总是输出零——可以通过仔细的初始化、更小的学习率或 Leaky ReLU 来缓解。"
          )}
        </p>

        {/* ============ 6. Convolutional Layers ============ */}
        <h2>{t("6. Convolutional Layers", "6. 卷积层")}</h2>

        <p>
          {t(
            "The key insight of CNNs is that natural images have spatial structure: pixels near each other are related, and the same patterns (edges, textures) appear at multiple locations. A convolutional layer exploits this by using shared, spatially local filters instead of fully connected weights.",
            "CNN 的关键洞察是自然图像具有空间结构：相邻像素相互关联，且相同的模式（边缘、纹理）出现在多个位置。卷积层通过使用共享的空间局部滤波器（而非全连接权重）来利用这一特性。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("The Convolution Operation", "卷积操作")}
        </h3>

        <p>
          {t(
            "A filter (kernel) of size F×F slides across the input feature map with a given stride S. At each position, compute the dot product between the filter weights and the corresponding receptive field patch. The result is a single activation value. Using P pixels of zero-padding around the input keeps the spatial dimensions controlled.",
            "大小为 F×F 的滤波器（卷积核）以步长 S 在输入特征图上滑动。在每个位置，计算滤波器权重与对应感受野块的点积。结果是单个激活值。在输入周围使用 P 像素的零填充可以控制空间维度。"
          )}
        </p>

        <Math
          display
          label={t("Conv output size formula", "卷积输出尺寸公式")}
          tex="W_{\text{out}} = \frac{W_{\text{in}} - F + 2P}{S} + 1"
        />

        <p>
          {t(
            "This formula applies independently to height and width (for square inputs/filters with the same parameters). The number of output channels equals the number of filters used. Each filter produces one output feature map.",
            "该公式独立地应用于高度和宽度（对于使用相同参数的方形输入/滤波器）。输出通道数等于使用的滤波器数量。每个滤波器产生一个输出特征图。"
          )}
        </p>

        <Collapsible title={t("Concrete example: 32×32 input, 3×3 filter, P=1, S=1", "具体示例：32×32 输入，3×3 滤波器，P=1，S=1")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Plugging in: W_out = (32 - 3 + 2·1) / 1 + 1 = (32 - 3 + 2) / 1 + 1 = 31 / 1 + 1 = 32. The output is 32×32 — same spatial size as input. This is called 'same' convolution and is achieved with P = (F-1)/2 when S=1.",
                "代入：W_out = (32 - 3 + 2×1) / 1 + 1 = (32 - 3 + 2) / 1 + 1 = 31 / 1 + 1 = 32。输出是 32×32——与输入空间尺寸相同。这称为「same」卷积，当 S=1 时通过 P = (F-1)/2 实现。"
              )}
            </p>
            <p>
              {t(
                "With S=2 (strided convolution for downsampling): W_out = (32 - 3 + 2) / 2 + 1 = 31/2 + 1 = 15.5 + 1 = 16.5 → floor to 16. The feature map halves in spatial size, and the number of channels typically doubles to preserve representational capacity.",
                "当 S=2（用于下采样的步长卷积）：W_out = (32 - 3 + 2) / 2 + 1 = 31/2 + 1 = 15.5 + 1 = 16.5 → 取整为 16。特征图空间尺寸减半，通道数通常翻倍以保持表示容量。"
              )}
            </p>
            <p>
              {t(
                "Parameter count for a conv layer: F×F×C_in×C_out (filter weights) + C_out (biases). For a 3×3 conv with 64 input channels and 128 output channels: 3×3×64×128 + 128 = 73,856 parameters. Compare to a fully connected layer with the same input/output: 64×28×28 × 128 = 6,422,528 parameters — nearly 100× more.",
                "卷积层的参数数量：F×F×C_in×C_out（滤波器权重）+ C_out（偏置）。对于 64 输入通道、128 输出通道的 3×3 卷积：3×3×64×128 + 128 = 73,856 个参数。相比之下，具有相同输入/输出的全连接层：64×28×28 × 128 = 6,422,528 个参数——几乎多出 100 倍。"
              )}
            </p>
          </div>
        </Collapsible>

        <p>
          {t(
            "Weight sharing is what makes CNNs powerful: the same filter weights are applied at every spatial position, enforcing translational equivariance. The network learns that a horizontal edge detector, for example, is useful everywhere in the image — not just at one fixed position.",
            "权重共享是使 CNN 强大的原因：相同的滤波器权重应用于每个空间位置，强制实现平移等变性。网络学到，例如水平边缘检测器在图像的任何位置都有用——而不仅仅是一个固定位置。"
          )}
        </p>

        {/* ============ 7. Pooling and Architecture Design ============ */}
        <h2>{t("7. Pooling and Architecture Design", "7. 池化与架构设计")}</h2>

        <p>
          {t(
            "Pooling layers reduce spatial dimensions, providing a form of translation invariance and controlling computational cost. The two standard operations are max pooling and average pooling.",
            "池化层减小空间维度，提供一定程度的平移不变性并控制计算成本。两种标准操作是最大池化和平均池化。"
          )}
        </p>

        <p>
          {t(
            "Max pooling with a 2×2 window and stride 2 divides the feature map into 2×2 non-overlapping regions and keeps the maximum value from each. This halves width and height, reducing the feature map to 1/4 of its area. Max pooling is by far the most common; it retains the most prominent activation in each region, which correlates with detecting whether a feature is present.",
            "2×2 窗口、步长为 2 的最大池化将特征图划分为 2×2 不重叠区域，保留每个区域的最大值。这将宽度和高度减半，将特征图面积减小到 1/4。最大池化是最常见的；它保留每个区域中最显著的激活，这与检测某个特征是否存在相关。"
          )}
        </p>

        <p>
          {t(
            "Average pooling computes the mean of each region. It is used less frequently in feature extraction but appears at the end of many modern architectures as Global Average Pooling (GAP): reduce each feature map to a single number by averaging all spatial positions. GAP replaces large FC layers, dramatically reducing parameters and improving regularization.",
            "平均池化计算每个区域的均值。它在特征提取中较少使用，但在许多现代架构末尾作为全局平均池化（GAP）出现：通过对所有空间位置取平均，将每个特征图缩减为单个数字。GAP 替代了大型 FC 层，大幅减少参数量并改善正则化。"
          )}
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-900 dark:text-amber-200 mb-0">
            <span className="font-semibold">{t("Modern trend: ", "现代趋势：")}</span>
            {t(
              "Many modern architectures replace pooling with strided convolutions for downsampling, giving the network learned downsampling rather than a fixed heuristic. The spatial size reduction is the same, but the network can optimize how it reduces resolution.",
              "许多现代架构用步长卷积替代池化来进行下采样，给网络提供学习到的下采样方式而非固定的启发式方法。空间尺寸缩减相同，但网络可以优化其降低分辨率的方式。"
            )}
          </p>
        </div>

        {/* ============ 8. Batch Normalization ============ */}
        <h2>{t("8. Batch Normalization", "8. 批归一化")}</h2>

        <p>
          {t(
            "Batch normalization (Ioffe & Szegedy, 2015) is one of the most impactful techniques in deep learning. It normalizes the activations of each layer across the mini-batch, then applies a learnable affine transformation. This dramatically stabilizes training and allows much higher learning rates.",
            "批归一化（Ioffe & Szegedy，2015）是深度学习中最具影响力的技术之一。它在小批量上归一化每一层的激活，然后应用可学习的仿射变换。这极大地稳定了训练，并允许使用更高的学习率。"
          )}
        </p>

        <p>
          {t(
            "For a mini-batch B = {x_1, ..., x_m}, batch norm computes the batch mean and variance, normalizes each activation, then scales and shifts with learnable parameters γ and β:",
            "对于小批量 B = {x_1, ..., x_m}，批归一化计算批量均值和方差，归一化每个激活，然后用可学习参数 γ 和 β 进行缩放和平移："
          )}
        </p>

        <Math
          display
          label={t("Batch norm: normalize", "批归一化：归一化")}
          tex="\hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \varepsilon}}"
        />

        <Math
          display
          label={t("Batch norm: scale and shift", "批归一化：缩放与平移")}
          tex="y_i = \gamma\,\hat{x}_i + \beta"
        />

        <p>
          {t(
            "ε is a small constant (e.g., 1e-5) for numerical stability. γ and β are parameters learned during training — they allow the network to undo the normalization if that is optimal. If γ = √(σ_B² + ε) and β = μ_B, the output exactly recovers the original activations.",
            "ε 是一个小常数（例如 1e-5），用于数值稳定性。γ 和 β 是训练期间学习的参数——如果最优，它们允许网络撤销归一化。若 γ = √(σ_B² + ε) 且 β = μ_B，输出恰好恢复原始激活。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Train vs. Test Behavior", "训练与测试行为")}
        </h3>

        <p>
          {t(
            "During training, batch norm uses the statistics (μ_B, σ_B) of the current mini-batch. During inference, this is problematic: the batch might contain only one example, or statistics may vary. The solution: track running averages of mean and variance during training (with momentum), and use these fixed statistics at test time.",
            "训练期间，批归一化使用当前小批量的统计量（μ_B, σ_B）。推理时这会有问题：批量可能只包含一个样本，或统计量可能变化。解决方案：训练期间追踪均值和方差的滑动平均（使用动量），在测试时使用这些固定统计量。"
          )}
        </p>

        <Collapsible title={t("Why does batch norm help so much?", "批归一化为何如此有效？")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "The original paper attributed batch norm's benefits to reducing 'internal covariate shift' — the phenomenon where the distribution of each layer's inputs changes during training as the weights of previous layers change. By normalizing activations, batch norm keeps the distribution stable, letting each layer train more independently.",
                "原始论文将批归一化的优势归因于减少「内部协变量偏移」——随着前一层权重的变化，每层输入的分布在训练过程中发生变化的现象。通过归一化激活，批归一化保持分布稳定，使每层可以更独立地训练。"
              )}
            </p>
            <p>
              {t(
                "Later research (Santurkar et al., 2018) challenged this explanation. Their analysis suggests batch norm's real benefit is smoothing the optimization landscape — making the loss surface more Lipschitz continuous. This means gradients are more predictive of what a step will do, allowing larger learning rates and more stable training.",
                "后续研究（Santurkar 等，2018）对此解释提出了质疑。他们的分析表明，批归一化的真正优势是平滑优化景观——使损失面更符合 Lipschitz 连续性。这意味着梯度对步长效果的预测更准确，允许更大的学习率和更稳定的训练。"
              )}
            </p>
            <p>
              {t(
                "Practical benefits: allows 10× higher learning rates, reduces sensitivity to initialization, acts as regularization (reducing the need for dropout), and enables training much deeper networks. BN is typically placed after the linear/conv operation and before the activation.",
                "实际好处：允许高出 10 倍的学习率，降低对初始化的敏感性，起到正则化作用（减少对 Dropout 的需求），并使训练更深的网络成为可能。BN 通常放置在线性/卷积操作之后、激活函数之前。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ 9. Regularization Techniques ============ */}
        <h2>{t("9. Regularization Techniques", "9. 正则化技术")}</h2>

        <p>
          {t(
            "Regularization prevents overfitting by adding constraints or noise to the training process. CS231n covers several techniques that are ubiquitous in practice.",
            "正则化通过在训练过程中添加约束或噪声来防止过拟合。CS231n 涵盖了实践中无处不在的几种技术。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("L1 and L2 Regularization", "L1 和 L2 正则化")}
        </h3>

        <p>
          {t(
            "L2 regularization (weight decay) adds a penalty proportional to the squared magnitude of all weights to the loss: λ Σ w². This penalizes large weights, pushing them toward zero. L1 regularization adds λ Σ |w|, which tends to produce sparse weights (many exactly zero). In practice, L2 is used almost universally for neural networks; L1 is more common in sparse feature selection settings.",
            "L2 正则化（权重衰减）向损失添加与所有权重平方幅度成正比的惩罚：λ Σ w²。这惩罚大权重，将其推向零。L1 正则化添加 λ Σ |w|，倾向于产生稀疏权重（许多恰好为零）。实践中，L2 在神经网络中几乎普遍使用；L1 在稀疏特征选择场景中更常见。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Dropout", "Dropout")}
        </h3>

        <p>
          {t(
            "Dropout (Srivastava et al., 2014) randomly sets each neuron's activation to zero with probability p (typically 0.5 for FC layers, 0.1–0.2 for conv layers) during training. This prevents neurons from co-adapting — no single neuron can rely on the presence of any other specific neuron, forcing the network to learn redundant representations.",
            "Dropout（Srivastava 等，2014）在训练期间以概率 p（FC 层通常为 0.5，卷积层为 0.1–0.2）随机将每个神经元的激活置零。这防止神经元共适应——没有单个神经元可以依赖任何其他特定神经元的存在，迫使网络学习冗余表示。"
          )}
        </p>

        <p>
          {t(
            "At test time, all neurons are active. To compensate for the scale change (activations are now larger on average), multiply all activations by (1-p) — or equivalently, scale the activations by 1/(1-p) during training (inverted dropout). The latter is more common in practice.",
            "测试时，所有神经元都处于激活状态。为了补偿规模变化（激活现在平均更大），将所有激活乘以 (1-p)——或等价地，在训练期间将激活缩放 1/(1-p)（反向 Dropout）。后者在实践中更常见。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Data Augmentation", "数据增强")}
        </h3>

        <p>
          {t(
            "Data augmentation artificially expands the training set by applying label-preserving transformations: random horizontal flips, random crops, color jitter (brightness, contrast, saturation), cutout, mixup. These transformations make the model invariant to irrelevant variations in the input, effectively providing more diverse training examples without collecting new data.",
            "数据增强通过应用保持标签的变换来人工扩展训练集：随机水平翻转、随机裁剪、颜色抖动（亮度、对比度、饱和度）、cutout、mixup。这些变换使模型对输入中不相关变化具有不变性，在不收集新数据的情况下有效提供更多样化的训练样本。"
          )}
        </p>

        {/* ============ 10. CNN Architecture Evolution ============ */}
        <h2>{t("10. CNN Architecture Evolution: AlexNet → ResNet", "10. CNN 架构演进：AlexNet → ResNet")}</h2>

        <p>
          {t(
            "CS231n traces the rapid evolution of CNN architectures through the ImageNet Large Scale Visual Recognition Challenge (ILSVRC). Each major architecture introduced a key idea that influenced subsequent research.",
            "CS231n 通过 ImageNet 大规模视觉识别挑战（ILSVRC）追踪 CNN 架构的快速演进。每个主要架构都引入了影响后续研究的关键思想。"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-slate-800">
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Architecture", "架构")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Year", "年份")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Top-5 error", "Top-5 错误率")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Key innovation", "关键创新")}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "AlexNet",
                  "2012",
                  "15.3%",
                  t("ReLU, dropout, GPU training, data augmentation", "ReLU、Dropout、GPU 训练、数据增强"),
                ],
                [
                  "VGGNet",
                  "2014",
                  "7.3%",
                  t("Very deep (16–19 layers) with only 3×3 convolutions", "仅用 3×3 卷积堆叠的极深网络（16–19 层）"),
                ],
                [
                  "GoogLeNet",
                  "2014",
                  "6.7%",
                  t("Inception module: parallel paths with 1×1/3×3/5×5 convs", "Inception 模块：1×1/3×3/5×5 卷积的并行路径"),
                ],
                [
                  "ResNet",
                  "2015",
                  "3.57%",
                  t("Residual (skip) connections enabling 152-layer networks", "残差（跳跃）连接，实现 152 层深度网络"),
                ],
              ].map(([arch, year, err, innovation]) => (
                <tr key={arch} className="odd:bg-white dark:odd:bg-transparent even:bg-paper-50 dark:even:bg-slate-900/30">
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2 font-mono font-semibold">{arch}</td>
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2">{year}</td>
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2 font-mono">{err}</td>
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2">{innovation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Collapsible title={t("AlexNet: the architecture that started the deep learning era", "AlexNet：开启深度学习时代的架构")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "AlexNet (Krizhevsky, Sutskever, Hinton, 2012) won ILSVRC 2012 with a 10.8 percentage point margin over the runner-up — an unprecedented gap. It was the first large-scale CNN to win ILSVRC and validated deep learning as the dominant paradigm for visual recognition.",
                "AlexNet（Krizhevsky、Sutskever、Hinton，2012）以 10.8 个百分点的优势赢得 ILSVRC 2012——前所未有的差距。它是第一个赢得 ILSVRC 的大规模 CNN，验证了深度学习作为视觉识别主导范式的地位。"
              )}
            </p>
            <p>
              {t(
                "Key contributions: (1) ReLU activations instead of tanh/sigmoid, enabling faster training in deeper networks. (2) Dropout for regularization. (3) Data augmentation (random crops, flips, color jitter). (4) GPU training split across two GTX 580 GPUs. (5) Local Response Normalization (LRN), a precursor to batch norm that normalizes across nearby channels.",
                "关键贡献：(1) 使用 ReLU 激活代替 tanh/sigmoid，使更深网络训练更快。(2) Dropout 正则化。(3) 数据增强（随机裁剪、翻转、颜色抖动）。(4) 在两块 GTX 580 GPU 上的 GPU 训练。(5) 局部响应归一化（LRN），批归一化的前身，跨相邻通道进行归一化。"
              )}
            </p>
          </div>
        </Collapsible>

        <Collapsible title={t("VGGNet: the power of depth with small filters", "VGGNet：小滤波器的深度力量")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "VGGNet (Simonyan & Zisserman, 2014) showed that network depth, using very small (3×3) convolution filters, is a critical component for achieving strong performance. The insight: two stacked 3×3 conv layers have the same receptive field as a single 5×5 layer, but with fewer parameters (2×3×3=18 vs 5×5=25 per input channel) and more nonlinearity.",
                "VGGNet（Simonyan & Zisserman，2014）表明，使用非常小（3×3）卷积滤波器的网络深度是实现强性能的关键组成部分。洞察：两个堆叠的 3×3 卷积层与单个 5×5 层具有相同的感受野，但参数更少（每个输入通道 2×3×3=18 vs 5×5=25）且非线性更多。"
              )}
            </p>
            <p>
              {t(
                "VGG-16 and VGG-19 remain excellent feature extractors for transfer learning. Their simple, uniform architecture (blocks of 3×3 convs followed by max pool) is easy to understand and reimplement. The main downside: 138M parameters, making them memory-intensive compared to modern efficient architectures.",
                "VGG-16 和 VGG-19 仍然是迁移学习的优秀特征提取器。其简单、统一的架构（3×3 卷积块后跟最大池化）易于理解和重新实现。主要缺点：1.38 亿参数，与现代高效架构相比内存密集。"
              )}
            </p>
          </div>
        </Collapsible>

        <Collapsible title={t("GoogLeNet and the Inception module", "GoogLeNet 与 Inception 模块")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "GoogLeNet (Szegedy et al., 2014) introduced the Inception module: instead of choosing one filter size, apply multiple filter sizes in parallel (1×1, 3×3, 5×5) and concatenate their outputs. This lets the network learn which spatial scale is most useful at each layer, without the designer having to choose.",
                "GoogLeNet（Szegedy 等，2014）引入了 Inception 模块：不选择单一滤波器大小，而是并行应用多种滤波器大小（1×1、3×3、5×5）并拼接其输出。这让网络在每一层学习哪个空间尺度最有用，而无需设计者手动选择。"
              )}
            </p>
            <p>
              {t(
                "1×1 convolutions ('network in network') are used within the Inception module to reduce channel dimensions before expensive 3×3 and 5×5 convolutions. This dimensionality reduction trick, combined with the parallel multi-scale design, allowed GoogLeNet to be 22 layers deep with only 5M parameters — far fewer than AlexNet's 60M.",
                "1×1 卷积（「网络中的网络」）在 Inception 模块中用于在昂贵的 3×3 和 5×5 卷积之前减少通道维度。这种维度缩减技巧，结合并行多尺度设计，使 GoogLeNet 在只有 500 万参数的情况下深达 22 层——远少于 AlexNet 的 6000 万参数。"
              )}
            </p>
          </div>
        </Collapsible>

        <p>
          {t(
            "ResNet (He et al., 2015) solved the degradation problem: deeper plain networks were harder to train, not better. Residual (skip) connections let the network learn F(x) = H(x) − x instead of H(x) directly, making the identity function easy to approximate and allowing gradients to flow directly to early layers. See the",
            "ResNet（He 等，2015）解决了退化问题：更深的普通网络更难训练，而不是更好。残差（跳跃）连接让网络学习 F(x) = H(x) − x 而不是直接学习 H(x)，使恒等函数易于近似，并允许梯度直接流向早期层。详见"
          )}{" "}
          <Link href={`${basePath}/papers/resnet`} className="text-blue-600 hover:underline">
            {t("dedicated ResNet page", "ResNet 专页")}
          </Link>{" "}
          {t("for a full derivation.", "以获取完整推导。")}
        </p>

        {/* ============ 11. Transfer Learning ============ */}
        <h2>{t("11. Transfer Learning", "11. 迁移学习")}</h2>

        <p>
          {t(
            "Training a CNN from scratch requires millions of labeled examples and days of GPU time. Transfer learning sidesteps this by starting from a model pretrained on a large dataset (usually ImageNet) and adapting it to a new task with far less data.",
            "从头训练 CNN 需要数百万个标记样本和数天的 GPU 时间。迁移学习通过从在大型数据集（通常是 ImageNet）上预训练的模型开始，用少得多的数据将其适应到新任务，从而绕过这一问题。"
          )}
        </p>

        <p>
          {t(
            "The intuition: early CNN layers learn general features (edges, textures, colors) that are useful across many visual tasks. Later layers become increasingly task-specific. We can reuse the general features and only retrain the task-specific parts.",
            "直觉：早期 CNN 层学习通用特征（边缘、纹理、颜色），这些特征对许多视觉任务都有用。后期层变得越来越特定于任务。我们可以重用通用特征，只重新训练特定于任务的部分。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Fine-tuning Strategies", "微调策略")}
        </h3>

        <p>
          {t(
            "CS231n recommends the following decision process based on dataset size and similarity:",
            "CS231n 根据数据集大小和相似性推荐以下决策过程："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-slate-800">
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Scenario", "场景")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Strategy", "策略")}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  t("Small dataset, similar to pretrain domain", "小数据集，与预训练领域相似"),
                  t("Linear probe only: freeze all conv layers, train only a new classifier head", "仅线性探测：冻结所有卷积层，仅训练新的分类头"),
                ],
                [
                  t("Small dataset, different from pretrain domain", "小数据集，与预训练领域不同"),
                  t("Train only top few layers + classifier head; risk of overfitting if more", "仅训练顶部几层 + 分类头；训练更多层有过拟合风险"),
                ],
                [
                  t("Large dataset, similar to pretrain domain", "大数据集，与预训练领域相似"),
                  t("Fine-tune all or most layers with a small LR (10–100× smaller than training from scratch)", "用小学习率（比从头训练小 10–100 倍）微调全部或大部分层"),
                ],
                [
                  t("Large dataset, very different from pretrain domain", "大数据集，与预训练领域差异很大"),
                  t("Fine-tune everything; pretrained weights still provide a better starting point than random init", "微调所有内容；预训练权重仍比随机初始化提供更好的起点"),
                ],
              ].map(([scenario, strategy], i) => (
                <tr key={i} className="odd:bg-white dark:odd:bg-transparent even:bg-paper-50 dark:even:bg-slate-900/30">
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2">{scenario}</td>
                  <td className="border border-paper-200 dark:border-slate-700 px-3 py-2">{strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "A critical implementation detail: when fine-tuning, use a much lower learning rate for the pretrained layers than for the newly added layers. Common practice is to use 10× or 100× smaller LR for the backbone, preventing the pretrained features from being destroyed in the first few steps.",
            "一个关键的实现细节：微调时，对预训练层使用比新添加层低得多的学习率。常见做法是对骨干网络使用低 10× 或 100× 的学习率，防止预训练特征在前几步被破坏。"
          )}
        </p>

        {/* ============ 12. Beyond Classification: Detection & Segmentation ============ */}
        <h2>{t("12. Beyond Classification: Detection & Segmentation", "12. 超越分类：检测与分割")}</h2>

        <p>
          {t(
            "Classification assigns a single label to an entire image. Real-world applications require localizing objects (detection) or labeling every pixel (segmentation). CS231n covers the main approaches for both.",
            "分类为整张图像分配单一标签。现实应用需要定位对象（检测）或为每个像素打标签（分割）。CS231n 涵盖了两者的主要方法。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Object Detection: R-CNN Family", "目标检测：R-CNN 系列")}
        </h3>

        <p>
          {t(
            "R-CNN (Girshick et al., 2014) was the first major deep learning approach to detection. It uses selective search to propose ~2000 candidate regions, warps each to a fixed size, runs a CNN to extract features, and classifies with an SVM. Fast R-CNN eliminated the per-proposal CNN forward pass by running the CNN once on the full image and then extracting RoI-pooled features for each proposal. Faster R-CNN replaced selective search with a Region Proposal Network (RPN) that shares CNN features with the detection head — making proposals nearly free.",
            "R-CNN（Girshick 等，2014）是第一个主要的深度学习检测方法。它使用选择性搜索提出约 2000 个候选区域，将每个区域缩放到固定大小，运行 CNN 提取特征，并用 SVM 分类。Fast R-CNN 通过对完整图像运行一次 CNN，然后为每个候选区域提取 RoI 池化特征，消除了每个候选区域的 CNN 前向传播。Faster R-CNN 用区域提议网络（RPN）替换选择性搜索，该网络与检测头共享 CNN 特征——使提议几乎免费。"
          )}
        </p>

        <p>
          {t(
            "YOLO (You Only Look Once) took a completely different approach: divide the image into a grid, predict bounding boxes and class probabilities directly from the full image in a single forward pass. Much faster than R-CNN family (real-time capable), at some cost to accuracy on small objects.",
            "YOLO（你只看一次）采取了完全不同的方法：将图像划分为网格，在单次前向传播中直接从完整图像预测边界框和类别概率。比 R-CNN 系列快得多（可实时运行），但在小对象上的精度有所牺牲。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("Semantic Segmentation: FCN", "语义分割：FCN")}
        </h3>

        <p>
          {t(
            "Fully Convolutional Networks (Long et al., 2015) adapted classification CNNs to output pixel-wise predictions. The key insight: replace FC layers with 1×1 convolutional layers, making the network fully convolutional and applicable to any input size. The spatial downsampling from pooling is reversed via learned upsampling (transposed convolutions or bilinear interpolation + convolution), producing a dense output map with per-pixel class predictions.",
            "全卷积网络（Long 等，2015）将分类 CNN 改造为输出逐像素预测。关键洞察：用 1×1 卷积层替换 FC 层，使网络完全卷积化，可应用于任何输入大小。池化造成的空间下采样通过学习的上采样（转置卷积或双线性插值 + 卷积）逆转，产生具有逐像素类别预测的密集输出图。"
          )}
        </p>

        <Collapsible title={t("Instance segmentation and Mask R-CNN", "实例分割与 Mask R-CNN")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Semantic segmentation assigns a class to each pixel but does not distinguish between different instances of the same class (two cats are both 'cat'). Instance segmentation outputs a separate mask for each detected object instance.",
                "语义分割为每个像素分配一个类别，但不区分同一类别的不同实例（两只猫都是「猫」）。实例分割为每个检测到的对象实例输出单独的掩码。"
              )}
            </p>
            <p>
              {t(
                "Mask R-CNN (He et al., 2017) extends Faster R-CNN with a third head that predicts a binary mask for each detected instance in parallel with the classification and bounding box regression heads. It introduces RoIAlign (replacing RoIPool's quantization with bilinear interpolation) for more precise spatial alignment, which is critical for mask quality.",
                "Mask R-CNN（He 等，2017）扩展了 Faster R-CNN，增加了第三个头，与分类和边界框回归头并行为每个检测到的实例预测二进制掩码。它引入了 RoIAlign（用双线性插值替换 RoIPool 的量化），以获得更精确的空间对齐，这对掩码质量至关重要。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ 13. Visualization ============ */}
        <h2>{t("13. Visualization: Understanding What CNNs Learn", "13. 可视化：理解 CNN 学到了什么")}</h2>

        <p>
          {t(
            "CS231n dedicates significant attention to visualizing and understanding CNN representations — a topic that is both scientifically interesting and practically useful for debugging.",
            "CS231n 将大量篇幅用于可视化和理解 CNN 表示——这个话题既具有科学意义，对调试也很有实际价值。"
          )}
        </p>

        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <strong>{t("Saliency maps: ", "显著图：")}</strong>
            {t(
              "Compute the gradient of the class score with respect to input pixels. Large gradients indicate pixels the model is most sensitive to — a rough map of 'where the model is looking.'",
              "计算类别得分相对于输入像素的梯度。大梯度表示模型最敏感的像素——模型「正在看哪里」的粗略映射。"
            )}
          </li>
          <li>
            <strong>{t("Gradient ascent / activation maximization: ", "梯度上升/激活最大化：")}</strong>
            {t(
              "Start from noise and optimize the input to maximize a specific neuron's activation. Reveals the 'ideal input' for that neuron, showing what patterns it detects.",
              "从噪声开始，优化输入以最大化特定神经元的激活。揭示该神经元的「理想输入」，显示它检测的模式。"
            )}
          </li>
          <li>
            <strong>{t("DeepDream: ", "DeepDream：")}
            </strong>
            {t(
              "Run gradient ascent on an image (rather than noise), amplifying patterns the network detects. Produces the psychedelic, feature-amplified images that went viral in 2015.",
              "在图像（而非噪声）上运行梯度上升，放大网络检测到的模式。产生 2015 年广为流传的迷幻、特征放大图像。"
            )}
          </li>
          <li>
            <strong>{t("Neural style transfer: ", "神经风格迁移：")}
            </strong>
            {t(
              "Separate and recombine content (high-level structure) and style (texture statistics) by optimizing an image to match a content image's feature activations and a style image's Gram matrices (correlations between feature channels). Gatys et al., 2015.",
              "通过优化图像以匹配内容图像的特征激活和风格图像的 Gram 矩阵（特征通道之间的相关性），分离并重新组合内容（高级结构）和风格（纹理统计）。Gatys 等，2015 年。"
            )}
          </li>
          <li>
            <strong>{t("t-SNE of feature embeddings: ", "特征嵌入的 t-SNE：")}
            </strong>
            {t(
              "Extract penultimate-layer features for many images and embed them in 2D with t-SNE. Reveals the geometric structure of the learned representation — images of the same class should cluster together.",
              "提取许多图像的倒数第二层特征，用 t-SNE 嵌入到 2D 中。揭示学习表示的几何结构——同一类别的图像应该聚集在一起。"
            )}
          </li>
        </ul>

        {/* ============ 14. Recommended Study Path ============ */}
        <h2>{t("14. Recommended Study Path", "14. 推荐学习路径")}</h2>

        <p>
          {t(
            "CS231n is a large course. Here is a prioritized path for different goals:",
            "CS231n 是一门内容丰富的课程。以下是针对不同目标的优先学习路径："
          )}
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("For ML interview preparation (4–6 weeks)", "面向 ML 面试备考（4–6 周）")}
        </h3>

        <ol className="list-decimal list-inside space-y-2 mb-6">
          <li>
            {t(
              "Read the kNN, linear classification, and loss function notes. Do Assignment 1 (k-NN, SVM, softmax sections).",
              "阅读 k-NN、线性分类和损失函数笔记。完成作业 1（k-NN、SVM、softmax 部分）。"
            )}
          </li>
          <li>
            {t(
              "Read the backpropagation notes thoroughly. Implement a two-layer net from scratch in NumPy.",
              "深入阅读反向传播笔记。用 NumPy 从头实现两层网络。"
            )}
          </li>
          <li>
            {t(
              "Read the CNN notes and the architecture overview. Do Assignment 2 (BatchNorm, Dropout, ConvNets).",
              "阅读 CNN 笔记和架构概述。完成作业 2（BatchNorm、Dropout、ConvNet）。"
            )}
          </li>
          <li>
            {t(
              "Read transfer learning and regularization notes. Review the detection overview lecture.",
              "阅读迁移学习和正则化笔记。复习检测概述讲座。"
            )}
          </li>
        </ol>

        <h3 className="text-lg font-semibold mt-8 mb-3">
          {t("For CV research (full course)", "面向 CV 研究（完整课程）")}
        </h3>

        <p>
          {t(
            "Watch all lectures in order (2017 or 2022 versions, both available on YouTube). Complete all three assignments. Pay particular attention to the detection, segmentation, and visualization lectures, which are not fully covered in the notes and contain important practical wisdom.",
            "按顺序观看所有讲座（2017 或 2022 版本，均可在 YouTube 上找到）。完成全部三个作业。特别注意检测、分割和可视化讲座，这些内容在笔记中没有完全覆盖，包含重要的实践智慧。"
          )}
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-8">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            {t("Key resources", "关键资源")}
          </h4>
          <ul className="text-sm text-blue-900 dark:text-blue-200 space-y-1">
            <li>
              <a href="https://cs231n.github.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                cs231n.github.io
              </a>
              {" — "}{t("course notes (best starting point; readable independently)", "课程笔记（最佳起点，可独立阅读）")}
            </li>
            <li>
              <a href="https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                {t("YouTube: 2017 lecture series", "YouTube：2017 年讲座系列")}
              </a>
              {" — "}{t("Karpathy & Johnson lectures, most cited version", "Karpathy 和 Johnson 的讲座，被引用最多的版本")}
            </li>
            <li>
              <a href="https://cs231n.stanford.edu/schedule.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                {t("2024 course schedule", "2024 年课程安排")}
              </a>
              {" — "}{t("latest syllabus with new topics (vision-language, diffusion)", "最新课程大纲，含新主题（视觉语言、扩散）")}
            </li>
          </ul>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-paper-200 dark:border-slate-800">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← {t("Back to Papers & Courses", "返回论文与课程")}
          </Link>
        </div>
      </article>
    </div>
  );
}
