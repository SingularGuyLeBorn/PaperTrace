"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function BertPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "BERT: Pre-training of Deep Bidirectional Transformers",
            "BERT: 深度双向 Transformer 的预训练"
          )}
        </h1>
        <p className="text-paper-800/50">
          Devlin et al. &middot; NAACL 2019 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1810.04805"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1810.04805
          </a>
        </p>
      </header>

      <article className="paper-content">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "BERT pre-trains a deep bidirectional Transformer by jointly conditioning on left and right context. It uses two self-supervised tasks: Masked Language Modeling (predict masked tokens) and Next Sentence Prediction (classify sentence pairs). Fine-tuning BERT on 11 NLP tasks set new state-of-the-art across the board in 2018.",
              "BERT 通过联合条件化左右上下文来预训练深度双向 Transformer。使用两个自监督任务：掩码语言建模（预测被掩盖的 token）和下一句预测（分类句子对）。在 2018 年，在 11 个 NLP 任务上微调 BERT 全面刷新了当时的最优效果。"
            )}
          </p>
        </section>

        <FlowChart
          title={t("BERT Architecture and Training Pipeline", "BERT 架构与训练流程")}
          steps={[
            {
              title: t(
                "Problem: GPT is left-to-right only; ELMo is shallow bidirectional",
                "问题：GPT 只从左到右；ELMo 是浅层双向"
              ),
              subtitle: t(
                "Prior models cannot see full context simultaneously",
                "先前的模型无法同时看到完整上下文"
              ),
              color: "rose",
            },
            {
              title: t(
                "Insight: Mask tokens and predict them — forces bidirectional context",
                "洞察：掩盖 token 并预测它们 — 强制双向上下文"
              ),
              subtitle: t(
                "Model must use both left and right context to fill in masked positions",
                "模型必须使用左右两侧的上下文来填充被掩盖的位置"
              ),
              color: "amber",
            },
            {
              title: t(
                "Pre-training Task 1: MLM — mask 15% tokens, predict original",
                "预训练任务 1：MLM — 掩盖 15% 的 token，预测原始值"
              ),
              subtitle: t("80/10/10 masking strategy", "80/10/10 掩盖策略"),
              color: "blue",
              children: [
                { title: t("[MASK] token added", "添加 [MASK] token"), color: "gray" },
                { title: t("80/10/10 masking strategy", "80/10/10 掩盖策略"), color: "gray" },
              ],
            },
            {
              title: t(
                "Pre-training Task 2: NSP — predict if sentence B follows sentence A",
                "预训练任务 2：NSP — 预测句子 B 是否紧跟句子 A"
              ),
              subtitle: t("Binary classification on sentence pairs", "句子对上的二元分类"),
              color: "teal",
              children: [
                { title: t("[CLS] token", "[CLS] token"), color: "gray" },
                { title: t("[SEP] separator", "[SEP] 分隔符"), color: "gray" },
              ],
            },
            {
              title: t(
                "Architecture: 12 Transformer encoder layers, 110M params (BERT-Base)",
                "架构：12 层 Transformer 编码器，110M 参数 (BERT-Base)"
              ),
              subtitle: t(
                "Stacked self-attention + feed-forward blocks",
                "堆叠的自注意力 + 前馈块"
              ),
              color: "purple",
            },
            {
              title: t(
                "Fine-tuning: Add 1 output layer, fine-tune ALL parameters",
                "微调：添加 1 个输出层，微调所有参数"
              ),
              subtitle: t(
                "Task-specific head on top of [CLS] or token representations",
                "在 [CLS] 或 token 表示之上添加任务特定头"
              ),
              color: "green",
            },
            {
              title: t(
                "Results: GLUE +7.7%, SQuAD F1 +1.5%, 11/11 tasks SOTA",
                "结果：GLUE +7.7%，SQuAD F1 +1.5%，11/11 任务最优"
              ),
              subtitle: t("State-of-the-art across the board in 2018", "2018 年全面刷新最优效果"),
              color: "green",
            },
          ]}
          arrows={[
            t("Key insight", "关键洞察"),
            t("Task 1", "任务 1"),
            t("Task 2", "任务 2"),
            t("Model", "模型"),
            t("Downstream", "下游"),
            t("Evaluation", "评估"),
          ]}
          highlights={[
            { text: t("True bidirectionality", "真正的双向性"), color: "blue" },
            { text: t("No task-specific architecture", "无任务特定架构"), color: "green" },
            { text: t("Pretrain once, fine-tune many", "预训练一次，多次微调"), color: "purple" },
          ]}
        />

        {/* ============ Background ============ */}
        <h2>{t("1. Background: The Bidirectionality Problem", "1. 背景：双向性问题")}</h2>

        <p>
          {t(
            "Before BERT, the two dominant approaches to contextual language representations had a fundamental limitation:",
            "在 BERT 之前，两种主流的上下文语言表示方法都有一个根本性的局限："
          )}
        </p>

        <ul>
          <li>
            <strong>GPT</strong>:{" "}
            {t(
              "Autoregressive left-to-right Transformer. At position i, it can only attend to positions 1…i-1. Rich context — but only half of it.",
              "自回归从左到右的 Transformer。在位置 i，只能关注位置 1…i-1。上下文丰富 — 但只有一半。"
            )}
          </li>
          <li>
            <strong>ELMo</strong>:{" "}
            {t(
              "Runs a forward LSTM and a backward LSTM separately, then concatenates. Bidirectional in principle, but shallow — the two directions never interact within a layer.",
              "分别运行前向 LSTM 和后向 LSTM，然后拼接。原则上是双向的，但很浅 — 两个方向在一层内从不交互。"
            )}
          </li>
        </ul>

        <p>
          {t(
            "BERT's solution: jointly condition on ALL tokens at every layer using a Masked Language Model (MLM) objective, enabling every token to attend to every other token in both directions simultaneously.",
            "BERT 的解决方案：使用掩码语言模型 (MLM) 目标，在每一层对所有 token 进行联合条件化，使每个 token 可以同时在两个方向上关注所有其他 token。"
          )}
        </p>

        {/* ============ Core Method 1: MLM ============ */}
        <h2>{t("2. Core Method 1: Masked Language Modeling (MLM)", "2. 核心方法 1：掩码语言建模 (MLM)")}</h2>

        <p>
          {t(
            "Randomly select 15% of tokens in each sequence. For each selected token, apply the following strategy:",
            "在每个序列中随机选择 15% 的 token。对每个被选中的 token，应用以下策略："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="text-left p-3 border border-paper-200">{t("Case", "情况")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Probability", "概率")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Action", "操作")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Why", "原因")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-paper-200 font-mono">[MASK]</td>
                <td className="p-3 border border-paper-200">80%</td>
                <td className="p-3 border border-paper-200">{t("Replace with [MASK] token", "替换为 [MASK] token")}</td>
                <td className="p-3 border border-paper-200">{t("Main learning signal", "主要学习信号")}</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="p-3 border border-paper-200 font-mono">{t("random", "随机")}</td>
                <td className="p-3 border border-paper-200">10%</td>
                <td className="p-3 border border-paper-200">{t("Replace with random token", "替换为随机 token")}</td>
                <td className="p-3 border border-paper-200">{t("Forces model to maintain robust token representations", "迫使模型保持鲁棒的 token 表示")}</td>
              </tr>
              <tr>
                <td className="p-3 border border-paper-200 font-mono">{t("unchanged", "不变")}</td>
                <td className="p-3 border border-paper-200">10%</td>
                <td className="p-3 border border-paper-200">{t("Keep original token", "保持原始 token")}</td>
                <td className="p-3 border border-paper-200">{t("Reduces train/test mismatch for [MASK]", "减少 [MASK] 的训练/测试不匹配")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The training loss is standard cross-entropy, computed only at the masked positions:",
            "训练损失是标准交叉熵，仅在被掩盖的位置计算："
          )}
        </p>

        <Math
          display
          label={t("MLM loss (sum over masked positions T_mask)", "MLM 损失 (在掩盖位置 T_mask 上求和)")}
          tex="\mathcal{L}_{\text{MLM}} = -\sum_{i \in \mathcal{T}_{\text{mask}}} \log P(x_i \mid \tilde{x})"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-2">
              <Math tex="\mathcal{T}_{\text{mask}}" />
              <span>
                {t(
                  "Set of token positions selected for masking (15% of all positions)",
                  "被选为掩盖的 token 位置集合（所有位置的 15%）"
                )}
              </span>

              <Math tex="x_i" />
              <span>
                {t(
                  "The original token at position i — the label the model must predict",
                  "位置 i 的原始 token — 模型必须预测的标签"
                )}
              </span>

              <Math tex="\tilde{x}" />
              <span>
                {t(
                  "The corrupted input sequence (with [MASK] tokens, random replacements, or unchanged tokens applied)",
                  "被破坏的输入序列（应用了 [MASK] token、随机替换或保持不变的 token）"
                )}
              </span>

              <Math tex="P(x_i \mid \tilde{x})" />
              <span>
                {t(
                  "Probability that the model assigns to the correct original token at position i, given the full corrupted context",
                  "模型在给定完整被破坏上下文的情况下，为位置 i 的正确原始 token 分配的概率"
                )}
              </span>
            </div>
          </div>
        </Collapsible>

        <Collapsible title={t("Concrete example: MLM in action", "具体例子：MLM 的运作")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>
              <strong>{t("Original sentence", "原始句子")}:</strong>{" "}
              <span className="font-mono">{t('"The cat sat on the mat"', '"The cat sat on the mat"')}</span>
            </p>
            <p>
              {t(
                "Tokens selected for masking (15%): position 2 (\"cat\"), position 6 (\"mat\")",
                "被选为掩盖的 token（15%）：位置 2（\"cat\"），位置 6（\"mat\"）"
              )}
            </p>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <div className="font-sans text-xs text-blue-800 mb-1">
                  <strong>{t("\"cat\" (pos 2) → 80% rule → [MASK]", "\"cat\"（位置 2）→ 80% 规则 → [MASK]")}</strong>
                </div>
                <div>{t("Model input at pos 2: [MASK]", "模型位置 2 的输入：[MASK]")}</div>
                <div>{t("Model target at pos 2: \"cat\"", "模型位置 2 的目标：\"cat\"")}</div>
              </div>
              <div className="p-2 bg-amber-50 rounded border border-amber-200">
                <div className="font-sans text-xs text-amber-800 mb-1">
                  <strong>{t("\"mat\" (pos 6) → 10% rule → random token \"dog\"", "\"mat\"（位置 6）→ 10% 规则 → 随机 token \"dog\"")}</strong>
                </div>
                <div>{t("Model input at pos 6: \"dog\"", "模型位置 6 的输入：\"dog\"")}</div>
                <div>{t("Model target at pos 6: \"mat\"", "模型位置 6 的目标：\"mat\"")}</div>
              </div>
              <div className="p-2 bg-paper-100 rounded">
                <div className="font-sans">
                  <strong>{t("Final model input", "最终模型输入")}:</strong>{" "}
                  <span className="font-mono">{t('"The [MASK] sat on the dog"', '"The [MASK] sat on the dog"')}</span>
                </div>
                <div className="font-sans mt-1">
                  <strong>{t("Predictions required", "需要的预测")}:</strong>{" "}
                  {t(
                    "Position 2 → \"cat\", Position 6 → \"mat\" (loss only at these two positions)",
                    "位置 2 → \"cat\"，位置 6 → \"mat\"（损失仅在这两个位置计算）"
                  )}
                </div>
                <div className="font-sans text-paper-800/50 mt-1">
                  {t(
                    "To predict \"cat\", the model uses context: \"The __ sat on the dog\" — it must attend both left (\"The\") and right (\"sat on the dog\") context simultaneously.",
                    "为了预测 \"cat\"，模型使用上下文：\"The __ sat on the dog\" — 它必须同时关注左侧（\"The\"）和右侧（\"sat on the dog\"）的上下文。"
                  )}
                </div>
              </div>
            </div>
          </div>
        </Collapsible>

        {/* ============ Core Method 2: NSP ============ */}
        <h2>{t("3. Core Method 2: Next Sentence Prediction (NSP)", "3. 核心方法 2：下一句预测 (NSP)")}</h2>

        <p>
          {t(
            "Many downstream tasks (QA, natural language inference) require understanding relationships between sentence pairs. NSP pre-trains this capability directly.",
            "许多下游任务（问答、自然语言推理）需要理解句子对之间的关系。NSP 直接预训练这一能力。"
          )}
        </p>

        <p>
          {t(
            "Given a sentence pair (A, B), 50% of the time B is the actual next sentence (IsNext), 50% of the time B is a random sentence from the corpus (NotNext). The model sees:",
            "给定句子对 (A, B)，50% 的情况下 B 是实际的下一句（IsNext），50% 的情况下 B 是语料库中的随机句子（NotNext）。模型看到："
          )}
        </p>

        <div className="bg-paper-50 rounded border border-paper-200 p-4 my-4 font-mono text-sm">
          [CLS] {t("sentence A tokens", "句子 A 的 token")} [SEP] {t("sentence B tokens", "句子 B 的 token")} [SEP]
        </div>

        <p>
          {t(
            "The final hidden state of the [CLS] token (a special classification token prepended to every input) is fed into a linear layer for binary classification: IsNext or NotNext.",
            "[CLS] token（一个添加在每个输入开头的特殊分类 token）的最终隐藏状态被输入到线性层进行二元分类：IsNext 或 NotNext。"
          )}
        </p>

        <Collapsible title={t("Input encoding: three embeddings added together", "输入编码：三种嵌入相加")} defaultOpen>
          <div className="text-sm space-y-3">
            <div className="grid grid-cols-[180px_1fr] gap-y-3 gap-x-2">
              <strong>{t("Token Embeddings", "Token 嵌入")}</strong>
              <span>
                {t(
                  "Standard word embeddings from a 30,000-token WordPiece vocabulary",
                  "来自 30,000 token WordPiece 词汇表的标准词嵌入"
                )}
              </span>

              <strong>{t("Segment Embeddings", "段落嵌入")}</strong>
              <span>
                {t(
                  "E_A for all tokens in sentence A, E_B for all tokens in sentence B — tells the model which sentence each token belongs to",
                  "句子 A 中所有 token 用 E_A，句子 B 中所有 token 用 E_B — 告诉模型每个 token 属于哪个句子"
                )}
              </span>

              <strong>{t("Positional Embeddings", "位置嵌入")}</strong>
              <span>
                {t(
                  "Learned embeddings for positions 0…511 — encodes position within the sequence",
                  "位置 0…511 的学习嵌入 — 编码序列中的位置信息"
                )}
              </span>
            </div>
            <Math
              display
              tex="\text{Input} = \text{TokenEmb}(x_i) + \text{SegmentEmb}(s_i) + \text{PositionEmb}(i)"
            />
            <p className="text-paper-800/60">
              {t(
                "All three embeddings are simply summed element-wise before being fed into the first Transformer layer.",
                "三种嵌入在被输入第一个 Transformer 层之前简单地按元素求和。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Architecture Details ============ */}
        <h2>{t("4. Architecture Details", "4. 架构细节")}</h2>

        <p>
          {t(
            "BERT uses a standard Transformer encoder (no decoder). Two model sizes were released:",
            "BERT 使用标准的 Transformer 编码器（没有解码器）。发布了两种模型大小："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="text-left p-3 border border-paper-200">{t("Model", "模型")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Layers (L)", "层数 (L)")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Hidden (H)", "隐藏维度 (H)")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Attention Heads (A)", "注意力头数 (A)")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Parameters", "参数量")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-paper-200 font-semibold">BERT-Base</td>
                <td className="p-3 border border-paper-200">12</td>
                <td className="p-3 border border-paper-200">768</td>
                <td className="p-3 border border-paper-200">12</td>
                <td className="p-3 border border-paper-200">110M</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="p-3 border border-paper-200 font-semibold">BERT-Large</td>
                <td className="p-3 border border-paper-200">24</td>
                <td className="p-3 border border-paper-200">1024</td>
                <td className="p-3 border border-paper-200">16</td>
                <td className="p-3 border border-paper-200">340M</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "Pre-training corpus: BooksCorpus (800M words) + English Wikipedia (2,500M words). Pre-training took 4 days on 16/64 Cloud TPUs for BERT-Base/Large.",
            "预训练语料库：BooksCorpus（8 亿词）+ 英文维基百科（25 亿词）。BERT-Base/Large 的预训练分别在 16/64 个 Cloud TPU 上花费了 4 天。"
          )}
        </p>

        {/* ============ Results ============ */}
        <h2>{t("5. Results", "5. 实验结果")}</h2>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="text-left p-3 border border-paper-200">{t("Task", "任务")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Previous SOTA", "之前最优")}</th>
                <th className="text-left p-3 border border-paper-200">BERT-Base</th>
                <th className="text-left p-3 border border-paper-200">BERT-Large</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-paper-200">GLUE</td>
                <td className="p-3 border border-paper-200">72.8</td>
                <td className="p-3 border border-paper-200">78.3</td>
                <td className="p-3 border border-paper-200 font-semibold text-green-700">80.4</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="p-3 border border-paper-200">SQuAD v1.1 EM</td>
                <td className="p-3 border border-paper-200">84.1</td>
                <td className="p-3 border border-paper-200">84.1</td>
                <td className="p-3 border border-paper-200 font-semibold text-green-700">85.1</td>
              </tr>
              <tr>
                <td className="p-3 border border-paper-200">SQuAD v1.1 F1</td>
                <td className="p-3 border border-paper-200">90.9</td>
                <td className="p-3 border border-paper-200">90.9</td>
                <td className="p-3 border border-paper-200 font-semibold text-green-700">91.8</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="p-3 border border-paper-200">MNLI</td>
                <td className="p-3 border border-paper-200">86.7</td>
                <td className="p-3 border border-paper-200">84.6</td>
                <td className="p-3 border border-paper-200 font-semibold text-green-700">86.7</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Impact", "影响")}</strong>:{" "}
            {t(
              "BERT achieved state-of-the-art on all 11 NLP tasks it was evaluated on. GLUE score improved from 72.8 to 80.4 (+7.6 points). It took only 1 GPU-hour to fine-tune BERT-Base on most tasks.",
              "BERT 在评估的所有 11 个 NLP 任务上都达到了最优效果。GLUE 分数从 72.8 提升到 80.4（提升 7.6 分）。在大多数任务上微调 BERT-Base 只需 1 个 GPU 小时。"
            )}
          </p>
        </div>

        {/* ============ Limitations ============ */}
        <h2>{t("6. Limitations", "6. 局限性")}</h2>

        <ul>
          <li>
            <strong>{t("Training inefficiency", "训练效率低")}</strong>:{" "}
            {t(
              "MLM only provides signal on 15% of tokens per forward pass — much lower than standard LM objectives that predict every token.",
              "MLM 每次前向传播只对 15% 的 token 提供信号 — 远低于预测每个 token 的标准语言模型目标。"
            )}
          </li>
          <li>
            <strong>{t("NSP task limitations", "NSP 任务局限性")}</strong>:{" "}
            {t(
              "NSP was later shown to be less helpful than originally claimed — RoBERTa removes it and achieves better performance.",
              "NSP 后来被证明不如最初声称的那么有用 — RoBERTa 移除了它并取得了更好的性能。"
            )}
          </li>
          <li>
            <strong>{t("Encoder-only", "仅编码器")}</strong>:{" "}
            {t(
              "BERT's architecture is not directly suited for text generation tasks — it has no autoregressive decoder.",
              "BERT 的架构不直接适用于文本生成任务 — 它没有自回归解码器。"
            )}
          </li>
          <li>
            <strong>{t("[MASK] token mismatch", "[MASK] token 不匹配")}</strong>:{" "}
            {t(
              "[MASK] tokens appear during pre-training but never during fine-tuning — creating a distribution shift. The 10% unchanged + 10% random strategy partially mitigates this.",
              "[MASK] token 在预训练期间出现，但在微调期间从不出现 — 造成分布偏移。10% 不变 + 10% 随机的策略部分缓解了这一问题。"
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
                "BERT uses the Transformer encoder from this paper. Every self-attention layer in BERT is the scaled dot-product attention defined here.",
                "BERT 使用了本文的 Transformer 编码器。BERT 中的每个自注意力层都是这里定义的缩放点积注意力。"
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
                "DPO builds on RLHF which fine-tunes pretrained models like BERT and GPT. The \"pretrain then align\" paradigm that DPO operates in was pioneered by BERT's \"pretrain then fine-tune\" framework.",
                "DPO 建立在 RLHF 之上，RLHF 对预训练模型（如 BERT 和 GPT）进行微调。DPO 所依赖的「预训练然后对齐」范式，正是由 BERT 的「预训练然后微调」框架所开创的。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <span className="font-semibold text-paper-800/60">
              {t("GPT-2 (coming)", "GPT-2（即将推出）")}
            </span>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "The decoder-only alternative to BERT. Same Transformer backbone — but uses causal (left-to-right) attention instead of bidirectional. Excels at generation where BERT excels at understanding.",
                "BERT 的仅解码器替代方案。相同的 Transformer 主干 — 但使用因果（从左到右）注意力而非双向注意力。在生成方面表现出色，而 BERT 在理解方面表现出色。"
              )}
            </p>
          </div>
        </div>

        <h2>{t("8. Additional Resources", "8. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a
            href="https://arxiv.org/abs/1810.04805"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">BERT (arXiv 1810.04805)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Original paper", "原始论文")}</span>
          </a>
          <a
            href="https://arxiv.org/abs/1907.11692"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">RoBERTa (Liu et al. 2019)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Robustly optimized BERT — removes NSP, longer training, shows NSP is not needed", "鲁棒优化的 BERT — 移除 NSP，更长训练，证明 NSP 不是必要的")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/1910.01108"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">DistilBERT (Sanh et al. 2019)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("40% smaller, 60% faster, retains 97% of BERT performance via knowledge distillation", "小 40%，快 60%，通过知识蒸馏保留 97% 的 BERT 性能")}
            </span>
          </a>
        </div>
      </article>
    </div>
  );
}
