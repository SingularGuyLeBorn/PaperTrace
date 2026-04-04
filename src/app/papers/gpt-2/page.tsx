"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function GPT2Page() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Language Models are Unsupervised Multitask Learners (GPT-2)",
            "语言模型是无监督的多任务学习者（GPT-2）"
          )}
        </h1>
        <p className="text-paper-800/50">
          Radford et al. &middot; OpenAI 2019 &middot;{" "}
          <a
            href="https://openai.com/research/better-language-models"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            OpenAI Blog
          </a>
        </p>
      </header>

      <article className="paper-content">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "GPT-2 shows that a large language model trained purely on next-token prediction can perform many NLP tasks zero-shot — without any fine-tuning. The key insight: natural language tasks can be framed as conditional text generation. At 1.5B parameters, GPT-2 was the first model OpenAI refused to release fully due to misuse concerns.",
              "GPT-2 表明，一个仅通过预测下一个 token 训练的大语言模型，可以零样本执行许多 NLP 任务 — 无需任何微调。核心洞察：自然语言任务可以被框架为条件文本生成。GPT-2 共 1.5B 参数，是 OpenAI 首次因误用顾虑而拒绝完全公开的模型。"
            )}
          </p>
        </section>

        <FlowChart
          title={t("GPT-2: Zero-Shot Multitask Learning Pipeline", "GPT-2：零样本多任务学习流程")}
          steps={[
            {
              title: t(
                "BERT pre-trains then fine-tunes — requires labeled data per task",
                "BERT 先预训练再微调 — 每个任务都需要标注数据"
              ),
              subtitle: t(
                "Fine-tuning pipeline needs human annotations for every new task",
                "微调流程需要为每个新任务提供人工标注"
              ),
              color: "rose",
            },
            {
              title: t(
                "Insight: Tasks = text conditioning. Translation = \"text in French: text in English:\"",
                "洞察：任务 = 文本条件化。翻译 = 「法语文本：英语文本：」"
              ),
              subtitle: t(
                "Every NLP task can be expressed as: given this text, generate this text",
                "每个 NLP 任务都可以表达为：给定这段文本，生成这段文本"
              ),
              color: "amber",
            },
            {
              title: t(
                "Architecture: Transformer decoder-only, causal attention mask",
                "架构：仅 Transformer 解码器，因果注意力掩码"
              ),
              subtitle: t(
                "Each token attends only to previous tokens — left-to-right generation",
                "每个 token 只关注前面的 token — 从左到右生成"
              ),
              color: "blue",
            },
            {
              title: t(
                "Training: 40GB WebText (Reddit outbound links with 3+ upvotes)",
                "训练数据：40GB WebText（Reddit 外链，至少 3 个赞）"
              ),
              subtitle: t(
                "High-quality web text covering diverse topics and styles",
                "覆盖多样话题和风格的高质量网络文本"
              ),
              color: "teal",
            },
            {
              title: t(
                "Zero-shot: Give task description in prompt, generate answer",
                "零样本：在提示中给出任务描述，生成答案"
              ),
              subtitle: t(
                "No gradient updates — just prompt engineering at inference time",
                "没有梯度更新 — 只是在推理时进行提示工程"
              ),
              color: "purple",
            },
            {
              title: t(
                "Result: SOTA on 7/8 language modeling benchmarks, zero-shot",
                "结果：在 8 个语言建模基准中的 7 个上零样本达到最优"
              ),
              subtitle: t(
                "Emergent multitask abilities without any task-specific training",
                "无需任何任务特定训练即涌现出多任务能力"
              ),
              color: "green",
            },
          ]}
          arrows={[
            t("Key insight", "关键洞察"),
            t("Architecture", "架构"),
            t("Training", "训练"),
            t("Inference", "推理"),
            t("Evaluation", "评估"),
          ]}
          highlights={[
            { text: t("No fine-tuning needed", "无需微调"), color: "green" },
            { text: t("Zero-shot task transfer", "零样本任务迁移"), color: "blue" },
            { text: t("Tasks as text generation", "任务作为文本生成"), color: "purple" },
          ]}
        />

        {/* ============ Background ============ */}
        <h2>{t("1. Background: From Fine-Tuning to Zero-Shot", "1. 背景：从微调到零样本")}</h2>

        <p>
          {t(
            "GPT-1 (2018) demonstrated the pretrain-then-fine-tune paradigm: train a large Transformer LM on unlabeled text, then fine-tune on labeled task data. This worked well but still required labeled data for every task.",
            "GPT-1（2018 年）展示了预训练然后微调的范式：在无标签文本上训练大型 Transformer 语言模型，然后在有标签的任务数据上微调。这很有效，但仍然需要为每个任务提供标注数据。"
          )}
        </p>

        <p>
          {t(
            "GPT-2's central claim: if a language model is trained on a sufficiently large and diverse corpus, it implicitly learns to perform many tasks as a natural consequence of learning to predict text well. The model need not be explicitly told it is doing NLP tasks.",
            "GPT-2 的核心主张：如果语言模型在足够大且多样的语料库上训练，它会隐式地学习执行许多任务，这是学习好地预测文本的自然结果。模型不需要被明确告知它在执行 NLP 任务。"
          )}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("The core hypothesis", "核心假设")}</strong>:{" "}
            {t(
              "\"The natural language decathlon: multitask learning as question answering.\" Any NLP task can be cast as: given some context text, produce the appropriate output text. Translation, summarization, QA — all reduce to p(output | input, task_description).",
              "「自然语言十项全能：作为问答的多任务学习。」任何 NLP 任务都可以转化为：给定一些上下文文本，产生适当的输出文本。翻译、摘要、问答 — 全都归结为 p(输出 | 输入, 任务描述)。"
            )}
          </p>
        </div>

        {/* ============ Autoregressive LM ============ */}
        <h2>{t("2. Autoregressive Language Modeling", "2. 自回归语言建模")}</h2>

        <p>
          {t(
            "GPT-2 is trained on the standard language model objective: predict each token given all previous tokens. The joint probability of a sequence factorizes as:",
            "GPT-2 使用标准语言模型目标进行训练：给定所有前面的 token，预测每个 token。序列的联合概率分解为："
          )}
        </p>

        <Math
          display
          label={t("Autoregressive factorization", "自回归分解")}
          tex="P(x_1, \ldots, x_n) = \prod_{i=1}^{n} P(x_i \mid x_1, \ldots, x_{i-1})"
        />

        <p>
          {t(
            "The training loss is the negative log-likelihood summed over all token positions:",
            "训练损失是对所有 token 位置求和的负对数似然："
          )}
        </p>

        <Math
          display
          label={t("Language model training loss", "语言模型训练损失")}
          tex="\mathcal{L} = -\sum_{i=1}^{n} \log P(x_i \mid x_{<i})"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-2">
              <Math tex="x_1, \ldots, x_n" />
              <span>
                {t(
                  "The token sequence — each x_i is a token ID from the 50,257-token BPE vocabulary",
                  "token 序列 — 每个 x_i 是来自 50,257 个 token 的 BPE 词汇表中的一个 token ID"
                )}
              </span>

              <Math tex="P(x_i \mid x_{<i})" />
              <span>
                {t(
                  "The probability the model assigns to token x_i given all previous tokens x_1…x_{i-1}. This is computed by a softmax over the full vocabulary.",
                  "模型在给定所有前面的 token x_1…x_{i-1} 的情况下，为 token x_i 分配的概率。这是通过对完整词汇表进行 softmax 计算的。"
                )}
              </span>

              <Math tex="\prod" />
              <span>
                {t(
                  "The chain rule of probability — the joint probability of the whole sequence equals the product of each conditional probability.",
                  "概率的链式法则 — 整个序列的联合概率等于每个条件概率的乘积。"
                )}
              </span>

              <Math tex="\mathcal{L}" />
              <span>
                {t(
                  "Training loss — minimizing this maximizes the likelihood of the training data. Equivalent to minimizing per-token cross-entropy.",
                  "训练损失 — 最小化这个损失等同于最大化训练数据的似然。等价于最小化每个 token 的交叉熵。"
                )}
              </span>
            </div>
          </div>
        </Collapsible>

        <Collapsible title={t("Concrete example: autoregressive prediction", "具体例子：自回归预测")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>
              <strong>{t("Sequence", "序列")}:</strong>{" "}
              <span className="font-mono">{t('"The sky is blue"', '"The sky is blue"')}</span>
            </p>
            <p>
              {t(
                "Tokens: [The, sky, is, blue]. Training computes four conditional probabilities:",
                "Tokens：[The, sky, is, blue]。训练计算四个条件概率："
              )}
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 bg-paper-50 rounded border border-paper-200">
                <span className="font-sans text-paper-800/60">{t("Step 1", "步骤 1")}:</span>{" "}
                P(&quot;The&quot; | &lt;BOS&gt;){" "}
                <span className="font-sans text-paper-800/50">
                  {t("— learn common sentence starters", "— 学习常见的句子开头")}
                </span>
              </div>
              <div className="p-2 bg-paper-50 rounded border border-paper-200">
                <span className="font-sans text-paper-800/60">{t("Step 2", "步骤 2")}:</span>{" "}
                P(&quot;sky&quot; | &quot;The&quot;){" "}
                <span className="font-sans text-paper-800/50">
                  {t("— \"sky\" commonly follows \"The\"", "— \"sky\" 常跟在 \"The\" 后面")}
                </span>
              </div>
              <div className="p-2 bg-paper-50 rounded border border-paper-200">
                <span className="font-sans text-paper-800/60">{t("Step 3", "步骤 3")}:</span>{" "}
                P(&quot;is&quot; | &quot;The sky&quot;){" "}
                <span className="font-sans text-paper-800/50">
                  {t("— \"is\" follows \"The sky\" (sky is...)", "— \"is\" 跟在 \"The sky\" 后面（sky is...）")}
                </span>
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <span className="font-sans text-blue-800">{t("Step 4", "步骤 4")}:</span>{" "}
                P(&quot;blue&quot; | &quot;The sky is&quot;){" "}
                <span className="font-sans text-blue-800/70">
                  {t(
                    "— \"blue\" is a likely color for sky",
                    "— \"blue\" 是天空可能的颜色"
                  )}
                </span>
              </div>
            </div>
            <p className="text-paper-800/60">
              {t(
                "The model is trained on billions of such sequences. After training, it has implicitly learned grammar, facts, reasoning patterns, and task formats — all from predicting the next token.",
                "模型在数十亿个这样的序列上进行训练。训练后，它已隐式地学习了语法、事实、推理模式和任务格式 — 全部来自预测下一个 token。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Zero-Shot Task Transfer ============ */}
        <h2>{t("3. Zero-Shot Task Transfer", "3. 零样本任务迁移")}</h2>

        <p>
          {t(
            "Since GPT-2 is trained to predict text, and task instructions are text, the model can perform tasks simply by conditioning on an appropriate prompt — no gradient updates required.",
            "由于 GPT-2 被训练来预测文本，而任务指令也是文本，模型可以通过条件化适当的提示来执行任务 — 不需要梯度更新。"
          )}
        </p>

        <Collapsible title={t("Examples of zero-shot task conditioning", "零样本任务条件化示例")} defaultOpen>
          <div className="text-sm space-y-4">
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <div className="font-semibold text-purple-800 mb-2">
                {t("Translation (English → French)", "翻译（英语 → 法语）")}
              </div>
              <div className="font-mono text-xs space-y-1">
                <div>
                  <span className="text-paper-800/50">{t("Prompt", "提示")}: </span>
                  {t(
                    '"Translate English to French: sea otter => loutre de mer; cheese =>"',
                    '"Translate English to French: sea otter => loutre de mer; cheese =>"'
                  )}
                </div>
                <div>
                  <span className="text-green-700">{t("GPT-2 generates", "GPT-2 生成")}: </span>
                  {t('"fromage"', '"fromage"')}
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">
                {t("Question Answering", "问答")}
              </div>
              <div className="font-mono text-xs space-y-1">
                <div>
                  <span className="text-paper-800/50">{t("Prompt", "提示")}: </span>
                  {t(
                    '"Q: Who was president of the United States in 1955? A:"',
                    '"Q: Who was president of the United States in 1955? A:"'
                  )}
                </div>
                <div>
                  <span className="text-green-700">{t("GPT-2 generates", "GPT-2 生成")}: </span>
                  {t('"Dwight D. Eisenhower"', '"Dwight D. Eisenhower"')}
                </div>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded border border-amber-200">
              <div className="font-semibold text-amber-800 mb-2">
                {t("Summarization", "摘要")}
              </div>
              <div className="font-mono text-xs space-y-1">
                <div>
                  <span className="text-paper-800/50">{t("Prompt", "提示")}: </span>
                  {t(
                    '"[article text] TL;DR:"',
                    '"[文章文本] TL;DR:"'
                  )}
                </div>
                <div>
                  <span className="text-green-700">{t("GPT-2 generates", "GPT-2 生成")}: </span>
                  {t(
                    "[a plausible summary of the article]",
                    "[文章的合理摘要]"
                  )}
                </div>
              </div>
            </div>
            <p className="text-paper-800/60 text-xs">
              {t(
                "The key is that WebText contains many documents with these formats — news articles, Q&A pages, translations — so the model has seen these patterns and can continue them.",
                "关键在于 WebText 包含许多具有这些格式的文档 — 新闻文章、问答页面、翻译 — 因此模型已经见过这些模式，可以继续它们。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Architecture ============ */}
        <h2>{t("4. Architecture: GPT-2 vs GPT-1", "4. 架构：GPT-2 与 GPT-1 对比")}</h2>

        <p>
          {t(
            "GPT-2 uses the same Transformer decoder-only architecture as GPT-1, but with several modifications:",
            "GPT-2 使用与 GPT-1 相同的仅 Transformer 解码器架构，但有几处修改："
          )}
        </p>

        <Collapsible title={t("Architecture changes from GPT-1", "相对于 GPT-1 的架构变化")} defaultOpen>
          <div className="text-sm space-y-3">
            <div className="grid grid-cols-[220px_1fr] gap-y-4 gap-x-3">
              <strong>{t("Pre-norm (Layer norm moved)", "预归一化（层归一化移位）")}</strong>
              <span>
                {t(
                  "Layer normalization is moved to the input of each sub-block (pre-norm), rather than after (post-norm). This stabilizes training at large scale.",
                  "层归一化移至每个子块的输入端（预归一化），而不是之后（后归一化）。这在大规模训练时稳定了训练。"
                )}
              </span>

              <strong>{t("Extra layer norm", "额外的层归一化")}</strong>
              <span>
                {t(
                  "An additional layer normalization is added after the final self-attention block.",
                  "在最终自注意力块之后添加了额外的层归一化。"
                )}
              </span>

              <strong>{t("Modified weight init", "修改的权重初始化")}</strong>
              <span>
                {t(
                  "Weights of residual layers are scaled by 1/√N at initialization, where N is the number of residual layers. Prevents gradient explosion in deep models.",
                  "残差层的权重在初始化时按 1/√N 缩放，其中 N 是残差层的数量。防止深层模型中的梯度爆炸。"
                )}
              </span>

              <Math tex="\frac{1}{\sqrt{N}} W_{\text{init}}" />
              <span>
                {t(
                  "The residual path weight scaling — N = total number of residual layers in the model",
                  "残差路径权重缩放 — N = 模型中残差层的总数"
                )}
              </span>

              <strong>{t("Larger vocabulary", "更大的词汇表")}</strong>
              <span>
                {t(
                  "50,257 BPE tokens (vs 40,478 in GPT-1). Handles out-of-vocabulary words more gracefully.",
                  "50,257 个 BPE token（相比 GPT-1 的 40,478 个）。更优雅地处理词汇表外的词。"
                )}
              </span>

              <strong>{t("Longer context", "更长的上下文")}</strong>
              <span>
                {t(
                  "1,024 token context window (vs 512 in GPT-1). Allows reasoning over longer passages.",
                  "1,024 个 token 的上下文窗口（相比 GPT-1 的 512 个）。允许对更长的段落进行推理。"
                )}
              </span>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "Four model sizes were trained, scaling from 117M to 1.5B parameters:",
            "训练了四种模型大小，从 117M 到 1.5B 参数："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="text-left p-3 border border-paper-200">{t("Model", "模型")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Layers", "层数")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Hidden Dim", "隐藏维度")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Attn Heads", "注意力头数")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Parameters", "参数量")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-paper-200">GPT-2 Small</td>
                <td className="p-3 border border-paper-200">12</td>
                <td className="p-3 border border-paper-200">768</td>
                <td className="p-3 border border-paper-200">12</td>
                <td className="p-3 border border-paper-200">117M</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="p-3 border border-paper-200">GPT-2 Medium</td>
                <td className="p-3 border border-paper-200">24</td>
                <td className="p-3 border border-paper-200">1024</td>
                <td className="p-3 border border-paper-200">16</td>
                <td className="p-3 border border-paper-200">345M</td>
              </tr>
              <tr>
                <td className="p-3 border border-paper-200">GPT-2 Large</td>
                <td className="p-3 border border-paper-200">36</td>
                <td className="p-3 border border-paper-200">1280</td>
                <td className="p-3 border border-paper-200">20</td>
                <td className="p-3 border border-paper-200">762M</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="p-3 border border-paper-200 font-semibold">GPT-2 XL</td>
                <td className="p-3 border border-paper-200 font-semibold">48</td>
                <td className="p-3 border border-paper-200 font-semibold">1600</td>
                <td className="p-3 border border-paper-200 font-semibold">25</td>
                <td className="p-3 border border-paper-200 font-semibold">1.5B</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ============ Training Data ============ */}
        <h2>{t("5. Training Data: WebText", "5. 训练数据：WebText")}</h2>

        <p>
          {t(
            "GPT-2 is trained on WebText: a new dataset of 40GB of text scraped from Reddit. Specifically, they scraped all outbound links from Reddit that received at least 3 upvotes — a heuristic for human-judged quality and interest.",
            "GPT-2 在 WebText 上进行训练：一个从 Reddit 抓取的 40GB 文本数据集。具体来说，他们抓取了 Reddit 上所有获得至少 3 个赞的外链 — 这是人类判断的质量和兴趣度的启发式指标。"
          )}
        </p>

        <ul>
          <li>
            <strong>45M</strong>{" "}
            {t(
              "links scraped, filtered to 8M documents after de-duplication and quality filtering",
              "个链接被抓取，经过去重和质量过滤后过滤为 800 万个文档"
            )}
          </li>
          <li>
            {t(
              "Wikipedia was explicitly excluded (it appears in many test sets — including it would inflate performance)",
              "维基百科被明确排除（它出现在许多测试集中 — 包含它会虚增性能）"
            )}
          </li>
          <li>
            {t(
              "Diverse domains: news, fiction, Q&A, technical writing, forums — crucial for zero-shot generalization",
              "多样化领域：新闻、小说、问答、技术写作、论坛 — 对零样本泛化至关重要"
            )}
          </li>
        </ul>

        {/* ============ Results ============ */}
        <h2>{t("6. Results", "6. 实验结果")}</h2>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="text-left p-3 border border-paper-200">{t("Benchmark", "基准")}</th>
                <th className="text-left p-3 border border-paper-200">{t("Previous SOTA", "之前最优")}</th>
                <th className="text-left p-3 border border-paper-200">{t("GPT-2 (zero-shot)", "GPT-2（零样本）")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-paper-200">PTB {t("perplexity", "困惑度")}</td>
                <td className="p-3 border border-paper-200">35.8</td>
                <td className="p-3 border border-paper-200 font-semibold text-green-700">35.76</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="p-3 border border-paper-200">WikiText-2</td>
                <td className="p-3 border border-paper-200">39.14</td>
                <td className="p-3 border border-paper-200 font-semibold text-green-700">29.41</td>
              </tr>
              <tr>
                <td className="p-3 border border-paper-200">CBT-CN {t("(accuracy)", "（准确率）")}</td>
                <td className="p-3 border border-paper-200">85.7%</td>
                <td className="p-3 border border-paper-200 font-semibold text-green-700">93.3%</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="p-3 border border-paper-200">CBT-NE {t("(accuracy)", "（准确率）")}</td>
                <td className="p-3 border border-paper-200">82.3%</td>
                <td className="p-3 border border-paper-200 font-semibold text-green-700">89.1%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("The remarkable finding", "值得关注的发现")}</strong>:{" "}
            {t(
              "GPT-2 achieves state-of-the-art on 7 out of 8 language modeling benchmarks — zero-shot, with no fine-tuning. This suggests that the model has implicitly learned the structure of language and tasks from raw text alone. The authors note GPT-2 is \"still underfitting\" on WebText, suggesting further scaling would help.",
              "GPT-2 在 8 个语言建模基准中的 7 个上零样本达到最优 — 无需微调。这表明模型仅从原始文本隐式地学习了语言和任务的结构。作者指出 GPT-2 在 WebText 上「仍然欠拟合」，表明进一步扩大规模会有帮助。"
            )}
          </p>
        </div>

        {/* ============ Limitations ============ */}
        <h2>{t("7. Limitations", "7. 局限性")}</h2>

        <ul>
          <li>
            <strong>{t("Inconsistent zero-shot", "零样本不一致")}</strong>:{" "}
            {t(
              "Zero-shot performance is strong on some tasks (language modeling, cloze) but poor on others (reading comprehension, summarization). Performance is highly sensitive to prompt wording.",
              "零样本性能在某些任务上很强（语言建模、完形填空），但在其他任务上很差（阅读理解、摘要）。性能对提示措辞高度敏感。"
            )}
          </li>
          <li>
            <strong>{t("No alignment", "无对齐")}</strong>:{" "}
            {t(
              "No RLHF or instruction tuning — outputs can be harmful, biased, or repetitive. This was a key motivation for InstructGPT and later alignment research.",
              "没有 RLHF 或指令微调 — 输出可能有害、有偏见或重复。这是 InstructGPT 和后来对齐研究的关键动机。"
            )}
          </li>
          <li>
            <strong>{t("Decoder-only limitations", "仅解码器的局限性")}</strong>:{" "}
            {t(
              "No encoder — suboptimal for classification and understanding tasks where BERT excels. Cannot attend to future context.",
              "没有编码器 — 对于 BERT 擅长的分类和理解任务不是最优的。无法关注未来的上下文。"
            )}
          </li>
          <li>
            <strong>{t("Limited context", "有限的上下文")}</strong>:{" "}
            {t(
              "1,024 tokens — insufficient for long documents. GPT-3 extended this to 2,048; modern models use 128K+.",
              "1,024 个 token — 对于长文档不够。GPT-3 将其扩展到 2,048；现代模型使用 128K+。"
            )}
          </li>
          <li>
            <strong>{t("Release withheld", "发布受限")}</strong>:{" "}
            {t(
              "OpenAI initially released only the 117M model due to misuse concerns about synthetic disinformation. The full 1.5B model was released 9 months later (Nov 2019) after limited misuse was observed.",
              "OpenAI 最初由于对合成虚假信息的误用担忧，只发布了 117M 的模型。完整的 1.5B 模型在观察到有限的误用后于 9 个月后（2019 年 11 月）发布。"
            )}
          </li>
        </ul>

        {/* ============ Connections ============ */}
        <h2>{t("8. Connections to Other Work", "8. 与其他工作的联系")}</h2>

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
                "GPT-2 uses the Transformer decoder architecture defined in this paper, with causal (masked) self-attention to enforce left-to-right generation order.",
                "GPT-2 使用本文定义的 Transformer 解码器架构，使用因果（掩码）自注意力来强制从左到右的生成顺序。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/ppo`}
              className="font-semibold text-blue-600 hover:underline"
            >
              PPO
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "InstructGPT (2022) fine-tunes GPT-3 (the successor to GPT-2) using PPO with human feedback — transforming the raw language model into a helpful assistant. GPT-2's decoder-only architecture is the backbone.",
                "InstructGPT（2022 年）使用 PPO 和人类反馈对 GPT-3（GPT-2 的继任者）进行微调 — 将原始语言模型转变为有帮助的助手。GPT-2 的仅解码器架构是主干。"
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
                "DPO is an alternative to PPO for aligning GPT-style autoregressive models. The same decoder-only architecture that GPT-2 pioneered is what DPO fine-tunes.",
                "DPO 是对 GPT 风格自回归模型进行对齐的 PPO 替代方案。DPO 微调的正是 GPT-2 所开创的相同仅解码器架构。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/grpo`}
              className="font-semibold text-blue-600 hover:underline"
            >
              GRPO
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "DeepSeek-R1 uses GRPO on a GPT-style model (decoder-only, autoregressive) to achieve strong reasoning. The zero-shot scaling hypothesis of GPT-2 is vindicated: scale the model, scale the data, add alignment.",
                "DeepSeek-R1 在 GPT 风格模型（仅解码器，自回归）上使用 GRPO 以实现强大的推理能力。GPT-2 的零样本扩展假设得到了验证：扩大模型规模，扩大数据规模，添加对齐。"
              )}
            </p>
          </div>
        </div>

        <h2>{t("9. Additional Resources", "9. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a
            href="https://openai.com/research/better-language-models"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">GPT-2 (OpenAI Blog)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Original blog post + paper PDF", "原始博客文章 + 论文 PDF")}</span>
          </a>
          <a
            href="https://arxiv.org/abs/2005.14165"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">GPT-3 (Brown et al. 2020)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("175B parameter successor — few-shot learning at scale", "1750 亿参数继任者 — 大规模少样本学习")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/2203.02155"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">InstructGPT (Ouyang et al. 2022)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Fine-tunes GPT-3 with RLHF — the missing alignment piece GPT-2 lacked", "使用 RLHF 微调 GPT-3 — GPT-2 缺失的对齐部分")}
            </span>
          </a>
        </div>
      </article>
    </div>
  );
}
