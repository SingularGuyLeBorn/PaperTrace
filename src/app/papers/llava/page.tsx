"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function LlavaPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "LLaVA: Visual Instruction Tuning",
            "LLaVA: 视觉指令微调"
          )}
        </h1>
        <p className="text-paper-800/50">
          Liu et al. &middot; NeurIPS 2023 &middot;{" "}
          <a
            href="https://arxiv.org/abs/2304.08485"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 2304.08485
          </a>
        </p>
      </header>

      <article className="paper-content">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "LLaVA connects a CLIP vision encoder to a LLaMA language model with a single linear projection layer. It fine-tunes on 158K GPT-4-generated instruction-following examples covering image descriptions, Q&A, and complex reasoning. Despite its simplicity, LLaVA achieves 85.1% relative score on Science QA compared to GPT-4's 88.1%.",
              "LLaVA 通过单层线性投影将 CLIP 视觉编码器连接到 LLaMA 语言模型。使用 GPT-4 生成的 158K 条指令跟随示例（图像描述、问答、复杂推理）进行微调。尽管结构简单，LLaVA 在 Science QA 上的相对得分达到 85.1%（GPT-4 为 88.1%）。"
            )}
          </p>
        </section>

        <FlowChart
          title={t("LLaVA Architecture and Training Pipeline", "LLaVA 架构与训练流程")}
          steps={[
            {
              title: t(
                "Problem: LLMs cannot process images; vision models cannot follow instructions",
                "问题：LLM 无法处理图像；视觉模型无法遵循指令"
              ),
              color: "rose",
            },
            {
              title: t(
                "Insight: Project visual features into LLM token space — treat as visual tokens",
                "洞察：将视觉特征投影到 LLM 词元空间 — 当作视觉词元处理"
              ),
              color: "amber",
            },
            {
              title: t(
                "Step 1: CLIP ViT-L/14 encodes image \u2192 256 visual tokens (14\u00d714 patches)",
                "第一步：CLIP ViT-L/14 编码图像 \u2192 256 个视觉词元（14\u00d714 图块）"
              ),
              color: "blue",
            },
            {
              title: t(
                "Step 2: Linear projection W maps visual tokens to LLM token dimension",
                "第二步：线性投影 W 将视觉词元映射到 LLM 词元维度"
              ),
              color: "teal",
            },
            {
              title: t(
                "Step 3: Concatenate visual tokens with text tokens, feed to LLaMA",
                "第三步：将视觉词元与文本词元拼接，输入 LLaMA"
              ),
              color: "purple",
            },
            {
              title: t(
                "Training: Two-stage — feature alignment, then instruction fine-tuning",
                "训练：两阶段 — 特征对齐，然后指令微调"
              ),
              color: "green",
              children: [
                {
                  title: t("Stage 1: 595K image-text pairs (CC3M)", "第一阶段：595K 图文对（CC3M）"),
                  color: "green",
                },
                {
                  title: t("Stage 2: 158K GPT-4 instruction data", "第二阶段：158K GPT-4 指令数据"),
                  color: "green",
                },
              ],
            },
            {
              title: t(
                "Result: 85.1% on ScienceQA, strong visual reasoning",
                "结果：ScienceQA 上 85.1%，强大的视觉推理能力"
              ),
              color: "green",
            },
          ]}
          arrows={[
            t("Key insight", "关键洞察"),
            t("Encode", "编码"),
            t("Project", "投影"),
            t("Concatenate", "拼接"),
            t("Train", "训练"),
            t("Evaluate", "评估"),
          ]}
          highlights={[
            { text: t("Single linear projection", "单层线性投影"), color: "blue" },
            { text: t("GPT-4-generated data", "GPT-4 生成数据"), color: "purple" },
            { text: t("Two-stage training", "两阶段训练"), color: "green" },
          ]}
        />

        {/* ============ Architecture ============ */}
        <h2>{t("1. Architecture: Connecting Vision and Language", "1. 架构：连接视觉与语言")}</h2>

        <p>
          {t(
            "LLaVA's architecture is intentionally minimal. Rather than designing an elaborate bridge between vision and language, the authors ask: what is the simplest possible connection that works?",
            "LLaVA 的架构是刻意极简的。作者没有设计复杂的视觉语言桥接模块，而是问：最简单的有效连接是什么？"
          )}
        </p>

        <p>
          {t(
            "The answer: a single trainable linear projection matrix W. Given an input image, the full forward pass is:",
            "答案是：单个可训练线性投影矩阵 W。给定输入图像，完整的前向传播为："
          )}
        </p>

        <Math
          display
          label={t("Visual feature projection", "视觉特征投影")}
          tex="H_v = W \cdot Z_v"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-2">
              <Math tex="Z_v" />
              <span>
                {t(
                  "CLIP visual features — output of the penultimate layer of CLIP ViT-L/14. Shape: [256, 1024]. Each of the 256 tokens corresponds to a 14\u00d714 image patch.",
                  "CLIP 视觉特征 — CLIP ViT-L/14 倒数第二层的输出。形状：[256, 1024]。256 个词元中的每一个对应一个 14\u00d714 图像图块。"
                )}
              </span>

              <Math tex="W" />
              <span>
                {t(
                  "Learnable projection matrix. Shape: [1024, 4096] — maps from CLIP's 1024-dim space to LLaMA's 4096-dim token space.",
                  "可学习投影矩阵。形状：[1024, 4096] — 从 CLIP 的 1024 维空间映射到 LLaMA 的 4096 维词元空间。"
                )}
              </span>

              <Math tex="H_v" />
              <span>
                {t(
                  "Projected visual tokens ready for LLaMA. Shape: [256, 4096]. These are treated identically to text token embeddings by the LLM.",
                  "准备好供 LLaMA 使用的投影视觉词元。形状：[256, 4096]。这些词元被 LLM 与文本词元嵌入同等对待。"
                )}
              </span>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "The full input sequence to LLaMA is the concatenation of visual tokens and text tokens:",
            "LLaMA 的完整输入序列是视觉词元和文本词元的拼接："
          )}
        </p>

        <Math
          display
          label={t("LLaMA input: visual tokens prepended to text tokens", "LLaMA 输入：视觉词元拼接在文本词元前")}
          tex="\text{Input} = [H_v \;\|\; H_q]"
        />

        <p>
          {t(
            "where H_q are the token embeddings of the text question. The LLaMA model then autoregressively generates the response attending over both visual and text tokens.",
            "其中 H_q 是文本问题的词元嵌入。LLaMA 模型随后以自回归方式生成响应，同时关注视觉和文本词元。"
          )}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Why does a single linear layer work?", "为什么单层线性层有效？")}</strong>{" "}
            {t(
              "Both CLIP's visual space and LLaMA's text space are high-capacity, well-structured embedding spaces. A linear projection is sufficient to \"translate\" between them — a more complex bridge (like a full cross-attention layer) might overfit on the relatively small fine-tuning dataset.",
              "CLIP 的视觉空间和 LLaMA 的文本空间都是高容量、结构良好的嵌入空间。线性投影足以在它们之间「翻译」— 更复杂的桥接模块（如完整的交叉注意力层）可能在相对较小的微调数据集上过拟合。"
            )}
          </p>
        </div>

        {/* ============ Data Generation ============ */}
        <h2>{t("2. Data Generation with GPT-4", "2. 使用 GPT-4 生成数据")}</h2>

        <p>
          {t(
            "High-quality instruction-following data for vision is expensive to collect manually. LLaVA's solution: use GPT-4 to generate it automatically. The trick is that GPT-4 (text-only at the time) can receive image information as text — via captions and object bounding boxes.",
            "手动收集高质量的视觉指令跟随数据成本昂贵。LLaVA 的解决方案：使用 GPT-4 自动生成。诀窍在于，GPT-4（当时仅支持文本）可以通过描述文本和物体边界框接收图像信息。"
          )}
        </p>

        <Collapsible
          title={t("Data generation pipeline in detail", "数据生成流程详解")}
          defaultOpen
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "For each image, LLaVA's pipeline feeds GPT-4 two pieces of text information:",
                "对于每张图像，LLaVA 的流程向 GPT-4 提供两段文本信息："
              )}
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                {t(
                  "Image captions (from COCO or similar datasets): \"A woman is riding a horse in a field.\"",
                  "图像描述（来自 COCO 或类似数据集）：「一名女性在田野中骑马。」"
                )}
              </li>
              <li>
                {t(
                  "Object bounding boxes: \"person: [0.23, 0.10, 0.55, 0.89], horse: [0.12, 0.30, 0.80, 0.95]\"",
                  "物体边界框：「person: [0.23, 0.10, 0.55, 0.89], horse: [0.12, 0.30, 0.80, 0.95]」"
                )}
              </li>
            </ol>
            <p>{t("GPT-4 then generates three types of instruction data:", "GPT-4 随后生成三类指令数据：")}</p>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <strong className="text-blue-800">{t("Type 1: Conversation", "类型 1：对话")}</strong>
                <p className="mt-1 text-paper-800/80">
                  {t(
                    "Multi-turn Q&A about the image. \"Q: What is the woman doing? A: She is riding a horse. Q: Where does this seem to take place? A: In an open field or meadow.\"",
                    "关于图像的多轮问答。「Q: 这名女性在做什么？A: 她在骑马。Q: 这似乎发生在哪里？A: 在开阔的田野或草地上。」"
                  )}
                </p>
              </div>
              <div className="p-3 bg-teal-50 rounded border border-teal-200">
                <strong className="text-teal-800">{t("Type 2: Detailed description", "类型 2：详细描述")}</strong>
                <p className="mt-1 text-paper-800/80">
                  {t(
                    "A rich paragraph describing the scene, objects, relationships, and atmosphere. Tests the model's ability to produce coherent visual narratives.",
                    "描述场景、物体、关系和氛围的丰富段落。测试模型生成连贯视觉叙述的能力。"
                  )}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded border border-purple-200">
                <strong className="text-purple-800">{t("Type 3: Complex reasoning", "类型 3：复杂推理")}</strong>
                <p className="mt-1 text-paper-800/80">
                  {t(
                    "Questions requiring inference beyond what is literally visible. \"Q: What challenges might the rider face in this environment? A: The open field may have uneven terrain...\"",
                    "需要超越字面可见内容进行推断的问题。「Q: 骑手在这个环境中可能面临哪些挑战？A: 开阔的田野可能有不平整的地形...」"
                  )}
                </p>
              </div>
            </div>
            <p className="text-paper-800/60 text-xs">
              {t(
                "Total: 158K instruction-following samples generated at low cost using GPT-4 API, covering diverse visual reasoning patterns.",
                "总计：使用 GPT-4 API 以低成本生成 158K 条指令跟随样本，涵盖多样化的视觉推理模式。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Two-stage Training ============ */}
        <h2>{t("3. Two-stage Training", "3. 两阶段训练")}</h2>

        <p>
          {t(
            "LLaVA uses a two-stage training procedure that separates learning the visual-language alignment from learning to follow diverse instructions.",
            "LLaVA 使用两阶段训练过程，将学习视觉语言对齐与学习遵循多样化指令分开。"
          )}
        </p>

        <div className="space-y-4 my-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 text-sm mb-2">
              {t(
                "Stage 1 — Visual feature alignment (train W only)",
                "第一阶段 — 视觉特征对齐（仅训练 W）"
              )}
            </h3>
            <div className="text-sm space-y-1 text-blue-900">
              <p>
                <strong>{t("Frozen", "冻结")}</strong>:{" "}
                {t("CLIP encoder + LLaMA weights", "CLIP 编码器 + LLaMA 权重")}
              </p>
              <p>
                <strong>{t("Trained", "训练")}</strong>:{" "}
                {t("Only the projection matrix W", "仅投影矩阵 W")}
              </p>
              <p>
                <strong>{t("Data", "数据")}</strong>:{" "}
                {t(
                  "595K image-text pairs filtered from CC3M (conceptual captions)",
                  "从 CC3M（概念字幕）过滤的 595K 图文对"
                )}
              </p>
              <p>
                <strong>{t("Task", "任务")}</strong>:{" "}
                {t(
                  "Simple image description: \"Human: describe this image. Assistant: [caption]\"",
                  "简单图像描述：「Human: 描述这张图像。Assistant: [描述]」"
                )}
              </p>
              <p>
                <strong>{t("Goal", "目标")}</strong>:{" "}
                {t(
                  "Teach W to align CLIP's visual representations with LLaMA's token space — not yet instruction following.",
                  "训练 W 将 CLIP 的视觉表示与 LLaMA 的词元空间对齐 — 还不是指令跟随。"
                )}
              </p>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 text-sm mb-2">
              {t(
                "Stage 2 — End-to-end instruction fine-tuning (train W + LLaMA)",
                "第二阶段 — 端到端指令微调（训练 W + LLaMA）"
              )}
            </h3>
            <div className="text-sm space-y-1 text-green-900">
              <p>
                <strong>{t("Frozen", "冻结")}</strong>:{" "}
                {t("CLIP encoder only", "仅 CLIP 编码器")}
              </p>
              <p>
                <strong>{t("Trained", "训练")}</strong>:{" "}
                {t("Projection matrix W + all LLaMA parameters", "投影矩阵 W + 所有 LLaMA 参数")}
              </p>
              <p>
                <strong>{t("Data", "数据")}</strong>:{" "}
                {t(
                  "158K GPT-4-generated instruction-following samples (conversation, description, reasoning)",
                  "158K GPT-4 生成的指令跟随样本（对话、描述、推理）"
                )}
              </p>
              <p>
                <strong>{t("Task", "任务")}</strong>:{" "}
                {t(
                  "Diverse visual QA and multi-turn conversation with images",
                  "多样化的视觉问答和带图像的多轮对话"
                )}
              </p>
              <p>
                <strong>{t("Goal", "目标")}</strong>:{" "}
                {t(
                  "Learn to follow visual instructions — combining visual understanding with conversational ability.",
                  "学会遵循视觉指令 — 将视觉理解与对话能力相结合。"
                )}
              </p>
            </div>
          </div>
        </div>

        <p>
          {t(
            "The training objective is standard autoregressive language modeling — predict the next token. Only the assistant's response tokens contribute to the loss; prompt tokens (including visual tokens) are excluded.",
            "训练目标是标准的自回归语言建模 — 预测下一个词元。只有助手的响应词元参与损失计算；提示词元（包括视觉词元）被排除在外。"
          )}
        </p>

        {/* ============ Concrete Example ============ */}
        <Collapsible
          title={t("Concrete example: Visual reasoning", "具体例子：视觉推理")}
          defaultOpen
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Image: A street scene with a stop sign at an intersection",
                "图像：路口有停车标志的街道场景"
              )}
            </p>
            <div className="space-y-2">
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <strong className="text-blue-800">{t("CLIP encoding", "CLIP 编码")}</strong>
                <p className="mt-1 text-xs font-mono text-paper-800/70">
                  {t(
                    "ViT-L/14 patches encode: \"red octagon shape\", \"white STOP text\", \"street intersection\", \"traffic light\", \"crosswalk markings\"",
                    "ViT-L/14 图块编码：「红色八边形形状」、「白色 STOP 文字」、「街道路口」、「交通灯」、「人行横道标线」"
                  )}
                </p>
              </div>
              <div className="p-2 bg-teal-50 rounded border border-teal-200">
                <strong className="text-teal-800">{t("Linear projection", "线性投影")}</strong>
                <p className="mt-1 text-xs text-paper-800/70">
                  {t(
                    "W maps 256 CLIP tokens (dim 1024) \u2192 256 visual tokens (dim 4096), same dimension as LLaMA's word embeddings",
                    "W 将 256 个 CLIP 词元（维度 1024）\u2192 256 个视觉词元（维度 4096），与 LLaMA 的词嵌入维度相同"
                  )}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                <strong className="text-purple-800">{t("LLaMA input sequence", "LLaMA 输入序列")}</strong>
                <p className="mt-1 text-xs font-mono text-paper-800/70">
                  {t(
                    "[256 visual tokens] + [\"What would happen if the driver ignores this sign?\"]",
                    "[256 个视觉词元] + [「如果司机忽视这个标志会发生什么？」]"
                  )}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <strong className="text-green-800">{t("LLaVA response", "LLaVA 响应")}</strong>
                <p className="mt-1 text-xs text-paper-800/70">
                  {t(
                    "\"Ignoring a stop sign can lead to serious consequences, including traffic violations and fines, increased risk of collisions with cross-traffic, potential accidents causing injury or property damage, and legal liability.\"",
                    "「忽视停车标志可能导致严重后果，包括交通违规和罚款、与横向交通发生碰撞的风险增加、可能造成人员伤亡或财产损失的事故，以及法律责任。」"
                  )}
                </p>
              </div>
            </div>
          </div>
        </Collapsible>

        {/* ============ Results ============ */}
        <h2>{t("4. Results", "4. 结果")}</h2>

        <div className="overflow-x-auto my-6">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 p-3 text-left">{t("Benchmark", "基准")}</th>
                <th className="border border-paper-200 p-3 text-left">GPT-4V</th>
                <th className="border border-paper-200 p-3 text-left">LLaVA-1.5</th>
                <th className="border border-paper-200 p-3 text-left">LLaVA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 p-3 font-medium">ScienceQA</td>
                <td className="border border-paper-200 p-3">88.1%</td>
                <td className="border border-paper-200 p-3">92.0%</td>
                <td className="border border-paper-200 p-3">85.1%</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 p-3 font-medium">TextVQA</td>
                <td className="border border-paper-200 p-3">&mdash;</td>
                <td className="border border-paper-200 p-3">58.2%</td>
                <td className="border border-paper-200 p-3">&mdash;</td>
              </tr>
              <tr>
                <td className="border border-paper-200 p-3 font-medium">MMBench</td>
                <td className="border border-paper-200 p-3">&mdash;</td>
                <td className="border border-paper-200 p-3">67.7%</td>
                <td className="border border-paper-200 p-3">36.2%</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 p-3 font-medium">LLaVA-Bench</td>
                <td className="border border-paper-200 p-3">100%</td>
                <td className="border border-paper-200 p-3">&mdash;</td>
                <td className="border border-paper-200 p-3">85.1%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The original LLaVA (7B parameters, single linear projection, 158K training samples) achieves 85.1% relative score on ScienceQA compared to GPT-4's 88.1% — remarkably close given the vast difference in model size and training resources. LLaVA-1.5 (an improved version using MLP projection and better data) further surpasses GPT-4V on ScienceQA.",
            "原始 LLaVA（7B 参数，单层线性投影，158K 训练样本）在 ScienceQA 上达到 85.1% 的相对得分，而 GPT-4 为 88.1% — 考虑到模型大小和训练资源的巨大差异，这一结果非常接近。LLaVA-1.5（使用 MLP 投影和更好数据的改进版本）在 ScienceQA 上进一步超越了 GPT-4V。"
          )}
        </p>

        {/* ============ Limitations ============ */}
        <h2>{t("5. Limitations", "5. 局限性")}</h2>

        <ul>
          <li>
            <strong>{t("Spatial understanding", "空间理解")}</strong>:{" "}
            {t(
              "A single linear projection may not capture complex spatial relationships between objects — pixel-level tasks like counting or precise localization remain challenging.",
              "单层线性投影可能无法捕获物体之间复杂的空间关系 — 计数或精确定位等像素级任务仍然具有挑战性。"
            )}
          </li>
          <li>
            <strong>{t("Inherited biases", "继承的偏见")}</strong>:{" "}
            {t(
              "GPT-4-generated training data inherits GPT-4's biases and can hallucinate facts about images — the model may confidently describe details that aren't present.",
              "GPT-4 生成的训练数据继承了 GPT-4 的偏见，并可能对图像中的事实产生幻觉 — 模型可能自信地描述不存在的细节。"
            )}
          </li>
          <li>
            <strong>{t("Single image, static", "单图像、静态")}</strong>:{" "}
            {t(
              "The original LLaVA does not handle video or multi-image inputs. Each inference processes exactly one image.",
              "原始 LLaVA 不处理视频或多图像输入。每次推理恰好处理一张图像。"
            )}
          </li>
          <li>
            <strong>{t("Model scale", "模型规模")}</strong>:{" "}
            {t(
              "At 7B parameters, LLaVA is significantly smaller than GPT-4V — complex multi-step visual reasoning and fine-grained understanding remain gaps.",
              "LLaVA 拥有 70 亿参数，远小于 GPT-4V — 复杂的多步视觉推理和细粒度理解仍存在差距。"
            )}
          </li>
        </ul>

        {/* ============ Connections ============ */}
        <h2>{t("6. Connections to Other Work", "6. 与其他工作的联系")}</h2>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/clip`}
              className="font-semibold text-blue-600 hover:underline"
            >
              CLIP
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "LLaVA uses CLIP ViT-L/14 as its frozen vision encoder. The quality of the visual features produced by CLIP is a primary driver of LLaVA's visual understanding capability.",
                "LLaVA 使用 CLIP ViT-L/14 作为其冻结的视觉编码器。CLIP 产生的视觉特征质量是驱动 LLaVA 视觉理解能力的主要因素。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/attention-is-all-you-need`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {t("Attention Is All You Need", "Attention Is All You Need")}
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "LLaMA (LLaVA's language backbone) is a Transformer. The self-attention mechanism allows LLaMA to attend over both visual tokens and text tokens jointly, enabling cross-modal reasoning.",
                "LLaMA（LLaVA 的语言骨干）是一个 Transformer。自注意力机制允许 LLaMA 同时关注视觉词元和文本词元，从而实现跨模态推理。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/dpo`}
              className="font-semibold text-blue-600 hover:underline"
            >
              DPO
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Vision-language models like LLaVA can also be aligned using DPO on preference data — collecting (image, question, preferred answer, rejected answer) tuples and applying DPO to improve output quality and reduce hallucinations.",
                "像 LLaVA 这样的视觉语言模型也可以使用偏好数据上的 DPO 进行对齐 — 收集（图像、问题、偏好答案、拒绝答案）元组并应用 DPO 以提高输出质量并减少幻觉。"
              )}
            </p>
          </div>
        </div>

        <h2>{t("7. Additional Resources", "7. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a
            href="https://arxiv.org/abs/2304.08485"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">LLaVA (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Original paper", "原始论文")}
            </span>
          </a>
          <a
            href="https://llava-vl.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">LLaVA Project Page</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Demo and model weights", "演示和模型权重")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/2310.03744"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">LLaVA-1.5 (arXiv 2310.03744)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Improved version with MLP projection and better data", "使用 MLP 投影和更好数据的改进版本")}
            </span>
          </a>
        </div>
      </article>
    </div>
  );
}
