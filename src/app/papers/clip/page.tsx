"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function ClipPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "CLIP: Learning Transferable Visual Models From Natural Language Supervision",
            "CLIP: 从自然语言监督中学习可迁移视觉模型"
          )}
        </h1>
        <p className="text-paper-800/50">
          Radford et al. &middot; ICML 2021 &middot;{" "}
          <a
            href="https://arxiv.org/abs/2103.00020"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 2103.00020
          </a>
        </p>
      </header>

      <article className="paper-content">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "CLIP trains image and text encoders jointly using contrastive learning on 400M image-text pairs scraped from the internet. The key insight: instead of predicting exact captions, predict which of N captions goes with which image. The resulting embeddings enable zero-shot image classification by computing similarity between image features and text labels — often rivaling supervised models.",
              "CLIP 使用从互联网爬取的 4 亿图文对，通过对比学习联合训练图像和文本编码器。核心洞察：不预测精确的描述词，而是预测 N 个描述中哪个与哪幅图像对应。由此产生的嵌入可以通过计算图像特征与文本标签之间的相似度来实现零样本图像分类，性能通常可与监督模型媲美。"
            )}
          </p>
        </section>

        <FlowChart
          title={t("CLIP Training and Zero-shot Transfer Pipeline", "CLIP 训练与零样本迁移流程")}
          steps={[
            {
              title: t(
                "Problem: ImageNet classifiers fixed to 1000 classes, need labeled data",
                "问题：ImageNet 分类器固定 1000 类，需要标注数据"
              ),
              color: "rose",
            },
            {
              title: t(
                "Insight: 400M (image, text) pairs on the internet = free supervision",
                "洞察：互联网上 4 亿（图像，文本）对 = 免费监督信号"
              ),
              color: "amber",
            },
            {
              title: t(
                "Image Encoder: ResNet or ViT — produces image embedding I_e",
                "图像编码器：ResNet 或 ViT — 生成图像嵌入 I_e"
              ),
              color: "blue",
            },
            {
              title: t(
                "Text Encoder: Transformer — produces text embedding T_e",
                "文本编码器：Transformer — 生成文本嵌入 T_e"
              ),
              color: "teal",
            },
            {
              title: t(
                "Contrastive Loss: maximize cosine similarity of correct pairs, minimize others",
                "对比损失：最大化正确对的余弦相似度，最小化其他对"
              ),
              color: "purple",
              children: [
                { title: t("N\u00d7N similarity matrix", "N\u00d7N 相似度矩阵"), color: "gray" },
                { title: t("InfoNCE loss on diagonal", "对角线上的 InfoNCE 损失"), color: "gray" },
              ],
            },
            {
              title: t(
                "Zero-shot transfer: encode class names as text, find closest image embedding",
                "零样本迁移：将类名编码为文本，找到最接近的图像嵌入"
              ),
              color: "green",
            },
            {
              title: t(
                "Result: 76.2% zero-shot ImageNet (matches ResNet-50 supervised)",
                "结果：76.2% 零样本 ImageNet（与监督 ResNet-50 持平）"
              ),
              color: "green",
            },
          ]}
          arrows={[
            t("Scale", "规模化"),
            t("Encode", "编码"),
            t("Encode", "编码"),
            t("Train jointly", "联合训练"),
            t("Apply", "应用"),
            t("Evaluate", "评估"),
          ]}
          highlights={[
            { text: t("No manual labels needed", "无需人工标注"), color: "green" },
            { text: t("Zero-shot on any class", "任意类的零样本"), color: "blue" },
            { text: t("Shared embedding space", "共享嵌入空间"), color: "purple" },
          ]}
        />

        {/* ============ Background ============ */}
        <h2>{t("1. Background: Why Contrastive Learning?", "1. 背景：为什么用对比学习？")}</h2>

        <p>
          {t(
            "Previous vision models trained on ImageNet-style datasets had a fundamental limitation: the label space was fixed. A model trained to classify 1000 categories cannot recognize a 1001st without retraining. The question: can we leverage the enormous quantity of image-text data on the internet instead?",
            "以往在 ImageNet 风格数据集上训练的视觉模型有一个根本局限：标签空间是固定的。训练用于分类 1000 个类别的模型无法在不重新训练的情况下识别第 1001 个类别。问题在于：我们能否利用互联网上海量的图文数据？"
          )}
        </p>

        <p>
          {t(
            "Early approaches tried predicting the exact caption from an image — a generative objective. This turns out to be too hard: there are infinitely many valid captions, leading to sparse gradient signal. CLIP's key insight is simpler and more powerful:",
            "早期方法尝试从图像预测精确的描述文本 — 一个生成式目标。这被证明太难了：有无数个有效的描述，导致梯度信号稀疏。CLIP 的关键洞察更简单也更强大："
          )}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Key insight", "关键洞察")}</strong>:{" "}
            {t(
              "Instead of predicting the exact caption, predict which of N captions in a batch matches which of N images. A batch of N pairs gives N correct pairs and N\u00b2\u2212N incorrect pairs — much denser training signal.",
              "不预测精确的描述，而是预测一批 N 个描述中哪个与哪幅图像对应。N 对组成的批次给出 N 个正确对和 N\u00b2\u2212N 个错误对 — 训练信号密度大得多。"
            )}
          </p>
        </div>

        {/* ============ Core Method ============ */}
        <h2>{t("2. Core Method: Contrastive Pre-training", "2. 核心方法：对比预训练")}</h2>

        <p>
          {t(
            "For a batch of N (image, text) pairs, CLIP computes normalized embeddings for each modality and then maximizes the cosine similarity of correct pairs while minimizing incorrect ones.",
            "对于一批 N 个（图像，文本）对，CLIP 为每个模态计算归一化嵌入，然后最大化正确对的余弦相似度，同时最小化错误对的相似度。"
          )}
        </p>

        <p>
          {t(
            "The similarity matrix S is defined as:",
            "相似度矩阵 S 定义为："
          )}
        </p>

        <Math
          display
          label={t("Pairwise cosine similarity (scaled by temperature)", "逐对余弦相似度（经温度缩放）")}
          tex="S[i,j] = \frac{I_i \cdot T_j}{\tau}"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-2">
              <Math tex="I_i" />
              <span>{t("L2-normalized image embedding for the i-th image in the batch", "批次中第 i 张图像的 L2 归一化图像嵌入")}</span>

              <Math tex="T_j" />
              <span>{t("L2-normalized text embedding for the j-th caption in the batch", "批次中第 j 个描述的 L2 归一化文本嵌入")}</span>

              <Math tex="\tau" />
              <span>{t("Temperature parameter — learned scalar, log-parameterized, initialized to 0.07. Controls the sharpness of the distribution.", "温度参数 — 可学习标量，对数参数化，初始化为 0.07。控制分布的尖锐程度。")}</span>

              <Math tex="S[i,j]" />
              <span>{t("Similarity score between image i and text j. High value = the model thinks they match.", "图像 i 和文本 j 之间的相似度得分。高值 = 模型认为它们匹配。")}</span>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "The InfoNCE (contrastive) loss is applied symmetrically — once treating images as queries (predicting the correct text) and once treating texts as queries (predicting the correct image):",
            "InfoNCE（对比）损失对称地应用 — 一次以图像作为查询（预测正确文本），一次以文本作为查询（预测正确图像）："
          )}
        </p>

        <Math
          display
          label={t("Symmetric InfoNCE loss (CLIP objective)", "对称 InfoNCE 损失（CLIP 目标）")}
          tex="\mathcal{L} = -\frac{1}{2N} \left[ \sum_{i=1}^{N} \log \frac{\exp(S[i,i])}{\sum_{j=1}^{N} \exp(S[i,j])} + \sum_{j=1}^{N} \log \frac{\exp(S[j,j])}{\sum_{i=1}^{N} \exp(S[i,j])} \right]"
        />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Intuition", "直觉")}</strong>:{" "}
            {t(
              "Each row of S is a distribution over texts for a given image (image\u2192text direction). Each column is a distribution over images for a given text (text\u2192image direction). The loss pushes the diagonal entries (correct pairs) toward 1 and off-diagonal entries toward 0.",
              "S 的每一行是给定图像的文本分布（图像\u2192文本方向）。每一列是给定文本的图像分布（文本\u2192图像方向）。损失将对角线项（正确对）推向 1，将非对角线项推向 0。"
            )}
          </p>
        </div>

        <Collapsible title={t("Concrete example: N=4 batch", "具体例子：N=4 批次")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Consider a batch with 4 image-text pairs:",
                "考虑一个包含 4 个图文对的批次："
              )}
            </p>
            <div className="space-y-1 font-mono text-xs">
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <div>{t("Image 1: a photo of a cat", "图像 1: 一张猫的照片")}</div>
                <div>{t("Image 2: a dog running", "图像 2: 一只奔跑的狗")}</div>
                <div>{t("Image 3: a red car", "图像 3: 一辆红色汽车")}</div>
                <div>{t("Image 4: a mountain landscape", "图像 4: 一片山地风景")}</div>
              </div>
            </div>
            <p>
              {t(
                "After encoding and L2-normalizing, the similarity matrix might look like:",
                "编码和 L2 归一化后，相似度矩阵可能如下所示："
              )}
            </p>
            <div className="overflow-x-auto">
              <table className="text-xs font-mono border-collapse w-full">
                <thead>
                  <tr>
                    <th className="border border-paper-200 p-2 bg-paper-100"></th>
                    <th className="border border-paper-200 p-2 bg-paper-100">{t("\"cat\"", "「猫」")}</th>
                    <th className="border border-paper-200 p-2 bg-paper-100">{t("\"dog\"", "「狗」")}</th>
                    <th className="border border-paper-200 p-2 bg-paper-100">{t("\"car\"", "「汽车」")}</th>
                    <th className="border border-paper-200 p-2 bg-paper-100">{t("\"mountain\"", "「山」")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-paper-200 p-2 bg-paper-100">{t("Image 1", "图像 1")}</td>
                    <td className="border border-paper-200 p-2 bg-green-100 font-bold">0.91</td>
                    <td className="border border-paper-200 p-2">0.12</td>
                    <td className="border border-paper-200 p-2">0.05</td>
                    <td className="border border-paper-200 p-2">0.08</td>
                  </tr>
                  <tr>
                    <td className="border border-paper-200 p-2 bg-paper-100">{t("Image 2", "图像 2")}</td>
                    <td className="border border-paper-200 p-2">0.13</td>
                    <td className="border border-paper-200 p-2 bg-green-100 font-bold">0.89</td>
                    <td className="border border-paper-200 p-2">0.08</td>
                    <td className="border border-paper-200 p-2">0.11</td>
                  </tr>
                  <tr>
                    <td className="border border-paper-200 p-2 bg-paper-100">{t("Image 3", "图像 3")}</td>
                    <td className="border border-paper-200 p-2">0.06</td>
                    <td className="border border-paper-200 p-2">0.09</td>
                    <td className="border border-paper-200 p-2 bg-green-100 font-bold">0.93</td>
                    <td className="border border-paper-200 p-2">0.04</td>
                  </tr>
                  <tr>
                    <td className="border border-paper-200 p-2 bg-paper-100">{t("Image 4", "图像 4")}</td>
                    <td className="border border-paper-200 p-2">0.10</td>
                    <td className="border border-paper-200 p-2">0.07</td>
                    <td className="border border-paper-200 p-2">0.05</td>
                    <td className="border border-paper-200 p-2 bg-green-100 font-bold">0.90</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-paper-800/70">
              {t(
                "Green cells = correct pairs (diagonal). High diagonal values mean the model has learned that each image matches its own caption. The loss pushes the diagonal values higher and off-diagonal values lower.",
                "绿色单元格 = 正确对（对角线）。对角线值高意味着模型已经学会了每张图像与其自己的描述匹配。损失将对角线值推高，将非对角线值推低。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Zero-shot Classification ============ */}
        <h2>{t("3. Zero-shot Classification", "3. 零样本分类")}</h2>

        <p>
          {t(
            "Once the encoders are trained, zero-shot classification on any dataset requires no fine-tuning:",
            "一旦编码器训练完成，对任何数据集进行零样本分类都不需要微调："
          )}
        </p>

        <ol className="list-decimal list-inside space-y-2 text-sm my-4">
          <li>
            {t(
              "For each class label c, construct a prompt: \"a photo of a {c}\" and encode it with the text encoder to get T_c.",
              "对于每个类标签 c，构造一个提示：\"a photo of a {c}\"，并用文本编码器对其进行编码得到 T_c。"
            )}
          </li>
          <li>
            {t(
              "For a test image, encode it with the image encoder to get I.",
              "对于测试图像，用图像编码器对其进行编码得到 I。"
            )}
          </li>
          <li>
            {t(
              "Compute cosine similarity between I and all T_c. Predict the class with the highest similarity.",
              "计算 I 与所有 T_c 的余弦相似度。预测相似度最高的类别。"
            )}
          </li>
        </ol>

        <Math
          display
          label={t("Zero-shot prediction", "零样本预测")}
          tex="\hat{c} = \arg\max_{c} \; \frac{I \cdot T_c}{\|I\| \|T_c\|}"
        />

        <p>
          {t(
            "For ImageNet with 1000 classes, this means encoding 1000 text prompts once (cached), then doing 1000 dot products per test image. No gradients, no fine-tuning, no labeled data needed.",
            "对于拥有 1000 个类别的 ImageNet，这意味着将 1000 个文本提示编码一次（缓存），然后对每张测试图像执行 1000 次点积运算。不需要梯度、微调或标注数据。"
          )}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Prompt engineering matters", "提示工程很重要")}</strong>:{" "}
            {t(
              "\"a photo of a X\" outperforms just \"X\" by several percentage points. CLIP uses an ensemble of 80 different prompt templates and averages their embeddings — this alone improves accuracy by ~3.5%.",
              "\"a photo of a X\" 比仅用 \"X\" 高出几个百分点。CLIP 使用 80 种不同提示模板的集成并取其嵌入的平均值 — 仅此一项就将准确率提高了约 3.5%。"
            )}
          </p>
        </div>

        {/* ============ Architecture ============ */}
        <h2>{t("4. Architecture Details", "4. 架构细节")}</h2>

        <div className="overflow-x-auto my-6">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 p-3 text-left">{t("Component", "组件")}</th>
                <th className="border border-paper-200 p-3 text-left">{t("Options Used", "使用选项")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 p-3 font-medium">{t("Image Encoder", "图像编码器")}</td>
                <td className="border border-paper-200 p-3">{t("ViT-L/14 (best) or ResNet-50/101/50x4/50x16/101x3", "ViT-L/14（最佳）或 ResNet-50/101/50x4/50x16/101x3")}</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 p-3 font-medium">{t("Text Encoder", "文本编码器")}</td>
                <td className="border border-paper-200 p-3">{t("Transformer, 63M params, 12 layers, 512 width, 8 heads", "Transformer，63M 参数，12 层，512 宽度，8 头")}</td>
              </tr>
              <tr>
                <td className="border border-paper-200 p-3 font-medium">{t("Projection", "投影")}</td>
                <td className="border border-paper-200 p-3">{t("Linear projection to 512-dim shared space", "线性投影到 512 维共享空间")}</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 p-3 font-medium">{t("Temperature", "温度")}</td>
                <td className="border border-paper-200 p-3">{t("Learned scalar \u03c4, log-parameterized, initialized to 0.07", "可学习标量 \u03c4，对数参数化，初始化为 0.07")}</td>
              </tr>
              <tr>
                <td className="border border-paper-200 p-3 font-medium">{t("Training data", "训练数据")}</td>
                <td className="border border-paper-200 p-3">{t("400M (image, text) pairs from internet (WIT dataset)", "来自互联网的 4 亿（图像，文本）对（WIT 数据集）")}</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 p-3 font-medium">{t("Training", "训练")}</td>
                <td className="border border-paper-200 p-3">{t("32 epochs, batch size 32,768, AdamW", "32 轮，批大小 32,768，AdamW")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The large batch size (32,768) is crucial: with N=32,768 pairs per batch, each image must be distinguished from 32,767 negative texts — a much harder task than small-batch contrastive learning, forcing the encoders to learn more discriminative features.",
            "大批量（32,768）至关重要：每批 N=32,768 对，每张图像必须与 32,767 个负文本区分开来 — 这比小批量对比学习难得多，迫使编码器学习更具判别性的特征。"
          )}
        </p>

        {/* ============ Results ============ */}
        <h2>{t("5. Results", "5. 结果")}</h2>

        <ul>
          <li>
            <strong>{t("Zero-shot ImageNet", "零样本 ImageNet")}</strong>:{" "}
            {t(
              "76.2% top-1 accuracy — matches a supervised ResNet-50 trained on 1.28M labeled images, with zero labeled ImageNet examples.",
              "76.2% top-1 准确率 — 与在 128 万标注图像上训练的监督 ResNet-50 持平，且使用零张标注的 ImageNet 样例。"
            )}
          </li>
          <li>
            <strong>{t("Zero-shot on 27 datasets", "27 个数据集上的零样本")}</strong>:{" "}
            {t(
              "Outperforms all prior zero-shot models across a diverse benchmark suite covering OCR, activity recognition, geo-localization, and more.",
              "在涵盖 OCR、活动识别、地理定位等多样化基准套件中，超越所有先前的零样本模型。"
            )}
          </li>
          <li>
            <strong>{t("Linear probe ImageNet", "线性探测 ImageNet")}</strong>:{" "}
            {t(
              "85.4% with ViT-L/14@336px — competitive with the best fully supervised models when a simple linear head is added.",
              "使用 ViT-L/14@336px 达到 85.4% — 添加简单线性头后与最佳完全监督模型竞争。"
            )}
          </li>
        </ul>

        {/* ============ Limitations ============ */}
        <h2>{t("6. Limitations", "6. 局限性")}</h2>

        <ul>
          <li>
            <strong>{t("Fine-grained tasks", "细粒度任务")}</strong>:{" "}
            {t(
              "Zero-shot performance degrades on fine-grained classification (e.g., distinguishing dog breeds, counting objects, reading text in complex scenes).",
              "在细粒度分类（如区分犬种、数物体、阅读复杂场景中的文字）上零样本性能下降。"
            )}
          </li>
          <li>
            <strong>{t("Template sensitivity", "模板敏感性")}</strong>:{" "}
            {t(
              "\"a photo of a X\" works much better than just \"X\". The model is sensitive to the exact wording of text prompts.",
              "\"a photo of a X\" 比仅用 \"X\" 效果好得多。模型对文本提示的确切措辞很敏感。"
            )}
          </li>
          <li>
            <strong>{t("Internet biases", "互联网偏见")}</strong>:{" "}
            {t(
              "Training on internet data reflects societal biases present online — racial, gender, and cultural biases have been documented.",
              "在互联网数据上训练会反映出网络上存在的社会偏见 — 种族、性别和文化偏见已有文献记录。"
            )}
          </li>
          <li>
            <strong>{t("Novel concepts", "新颖概念")}</strong>:{" "}
            {t(
              "Does not generalize well to truly novel concepts not seen during training — it can only match, not extrapolate.",
              "对训练中未见过的真正新颖概念泛化能力不佳 — 它只能匹配，不能外推。"
            )}
          </li>
          <li>
            <strong>{t("Computational cost", "计算成本")}</strong>:{" "}
            {t(
              "ViT-L/14 requires massive GPU resources. Training CLIP from scratch is only feasible for large organizations.",
              "ViT-L/14 需要大量 GPU 资源。从头训练 CLIP 只有大型组织才可行。"
            )}
          </li>
        </ul>

        {/* ============ Connections ============ */}
        <h2>{t("7. Connections to Other Work", "7. 与其他工作的联系")}</h2>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/attention-is-all-you-need`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {t("Attention Is All You Need", "Attention Is All You Need")}
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "CLIP's text encoder is a Transformer. The self-attention mechanism gives it the ability to produce rich, context-sensitive text representations.",
                "CLIP 的文本编码器是一个 Transformer。自注意力机制使其能够产生丰富的、上下文敏感的文本表示。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/llava`}
              className="font-semibold text-blue-600 hover:underline"
            >
              LLaVA
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "LLaVA uses CLIP ViT-L/14 as its vision encoder, projecting CLIP features into a LLaMA language model for visual instruction following.",
                "LLaVA 使用 CLIP ViT-L/14 作为其视觉编码器，将 CLIP 特征投影到 LLaMA 语言模型中用于视觉指令跟随。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <span className="font-semibold text-paper-800/50">
              {t("BLIP-2 (coming)", "BLIP-2（即将上线）")}
            </span>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "BLIP-2 builds a CLIP-style vision encoder into a bridge (Q-Former) that connects to a frozen LLM, offering even stronger vision-language alignment.",
                "BLIP-2 将 CLIP 风格的视觉编码器构建到连接冻结 LLM 的桥接模块（Q-Former）中，提供更强的视觉语言对齐。"
              )}
            </p>
          </div>
        </div>

        <h2>{t("8. Additional Resources", "8. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a
            href="https://arxiv.org/abs/2103.00020"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">CLIP (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Original paper", "原始论文")}
            </span>
          </a>
          <a
            href="https://openai.com/blog/clip"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">OpenAI CLIP Blog Post</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Accessible overview with demos", "带演示的易读概述")}
            </span>
          </a>
          <a
            href="https://github.com/openai/CLIP"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">OpenAI CLIP GitHub</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Official code and model weights", "官方代码和模型权重")}
            </span>
          </a>
        </div>
      </article>
    </div>
  );
}
