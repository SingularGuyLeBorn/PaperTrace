"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function DPRPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <Link
          href={`${basePath}/papers`}
          className="text-sm text-paper-800/50 hover:text-blue-600 transition-colors mb-4 inline-block"
        >
          ← {t("Back to Papers", "返回论文列表")}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Dense Passage Retrieval for Open-Domain Question Answering",
            "用于开放域问答的密集段落检索"
          )}
        </h1>
        <p className="text-paper-800/50">
          Karpukhin et al. &middot; Meta AI &middot; 2020 &middot;{" "}
          <a
            href="https://arxiv.org/abs/2004.04906"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 2004.04906
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "DPR replaces sparse TF-IDF/BM25 retrieval with two separate BERT encoders — one for questions, one for passages — trained so that matching question-passage pairs have high dot-product similarity in 768-dim space. Using in-batch negatives and hard BM25 negatives, DPR achieves 79.4% top-20 accuracy on NaturalQuestions vs. BM25's 59.1%, and scales to 21M Wikipedia passages via a FAISS index.",
              "DPR 用两个独立的 BERT 编码器（一个编码问题，一个编码段落）替代了稀疏的 TF-IDF/BM25 检索，训练目标是让匹配的问题-段落对在 768 维空间中具有高点积相似度。通过批内负样本和 BM25 难负样本，DPR 在 NaturalQuestions 上的 top-20 准确率达到 79.4%，远超 BM25 的 59.1%，并通过 FAISS 索引扩展到 2100 万维基百科段落。"
            )}
          </p>
        </section>

        {/* ============ FlowChart ============ */}
        <FlowChart
          title={t("DPR Method Overview", "DPR 方法总览")}
          steps={[
            {
              title: t(
                "Problem: BM25 matches keywords, misses semantic meaning — \"born in Ulm\" ≠ \"birthplace\"",
                "问题：BM25 只匹配关键词，忽略语义 — \u201c生于乌尔姆\u201d \u2260 \u201c出生地\u201d"
              ),
              color: "rose",
            },
            {
              title: t(
                "Insight: Learn dense vector representations where meaning, not words, determines similarity",
                "洞见：学习密集向量表示，用语义而非词语决定相似度"
              ),
              color: "amber",
            },
            {
              title: t(
                "Dual encoder: E_Q(question) and E_P(passage) — both BERT [CLS] vectors",
                "双编码器：E_Q（问题）和 E_P（段落）——均为 BERT [CLS] 向量"
              ),
              color: "blue",
              children: [
                {
                  title: t(
                    "Question encoder: BERT_Q → 768-dim vector",
                    "问题编码器：BERT_Q → 768 维向量"
                  ),
                  color: "gray",
                },
                {
                  title: t(
                    "Passage encoder: BERT_P → 768-dim vector",
                    "段落编码器：BERT_P → 768 维向量"
                  ),
                  color: "gray",
                },
              ],
            },
            {
              title: t(
                "Similarity: sim(q, p) = E_Q(q)ᵀ · E_P(p) — dot product in 768-dim space",
                "相似度：sim(q, p) = E_Q(q)ᵀ · E_P(p) — 768 维空间中的点积"
              ),
              color: "teal",
            },
            {
              title: t(
                "Training: NLL loss with in-batch negatives + BM25 hard negatives",
                "训练：使用批内负样本 + BM25 难负样本的负对数似然损失"
              ),
              color: "purple",
            },
            {
              title: t(
                "FAISS index: Pre-encode all 21M passages, retrieve top-k in milliseconds",
                "FAISS 索引：预编码全部 2100 万段落，毫秒级检索 top-k"
              ),
              color: "green",
            },
            {
              title: t(
                "Result: NaturalQuestions top-20: DPR 79.4% vs BM25 59.1%",
                "结果：NaturalQuestions top-20：DPR 79.4% vs BM25 59.1%"
              ),
              color: "green",
            },
          ]}
          arrows={[
            t("Motivates", "启发"),
            t("Core insight", "核心洞见"),
            t("Architecture", "架构"),
            t("Scoring", "打分"),
            t("Optimization", "优化"),
            t("Deployment", "部署"),
            t("Outcome", "结果"),
          ]}
          highlights={[
            {
              text: t("Semantic similarity via dot product", "通过点积实现语义相似度"),
              color: "blue",
            },
            {
              text: t("Hard negatives for robust training", "难负样本实现鲁棒训练"),
              color: "purple",
            },
            {
              text: t("FAISS for billion-scale retrieval", "FAISS 支持十亿级检索"),
              color: "green",
            },
          ]}
        />

        {/* ============ Section 1: Sparse vs Dense ============ */}
        <h2>{t("1. Sparse vs. Dense Retrieval", "1. 稀疏检索 vs. 密集检索")}</h2>

        <p>
          {t(
            "Open-domain question answering first retrieves relevant passages from a large corpus (e.g., Wikipedia), then feeds them to a reader model that extracts the answer. The retrieval step is the bottleneck.",
            "开放域问答首先从大型语料库（如维基百科）中检索相关段落，再将其输入阅读器模型提取答案。检索步骤是整个流程的瓶颈。"
          )}
        </p>

        <p>
          {t(
            "TF-IDF and BM25 represent both query and document as sparse bag-of-words vectors, scoring by exact term overlap weighted by frequency and inverse document frequency. This works well when the question and answer passage share vocabulary, but fails at semantic mismatches:",
            "TF-IDF 和 BM25 将查询与文档表示为稀疏词袋向量，通过词频与逆文档频率加权的精确词汇重叠来打分。当问题与答案段落共享词汇时效果良好，但在语义不匹配时会失败："
          )}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6 text-sm">
          <p className="font-semibold text-amber-900 mb-2">
            {t("The vocabulary mismatch problem", "词汇不匹配问题")}
          </p>
          <div className="space-y-2 text-amber-800">
            <p>
              <strong>{t("Query:", "查询：")}</strong>{" "}
              {t(
                '"Where was Einstein born?"',
                "「爱因斯坦出生在哪里？」"
              )}
            </p>
            <p>
              <strong>{t("Answer passage:", "答案段落：")}</strong>{" "}
              {t(
                '"Ulm is Einstein\'s birthplace in the Kingdom of Württemberg."',
                "「乌尔姆是爱因斯坦的出生地，位于符腾堡王国。」"
              )}
            </p>
            <p className="text-amber-700 mt-2">
              {t(
                "BM25 sees: \"born\" ∉ passage, \"birthplace\" ∉ query — low overlap score despite being the correct answer.",
                "BM25 \u53d1\u73b0\uff1a\u300cborn\u300d\u4e0d\u5728\u6bb5\u843d\u4e2d\uff0c\u300cbirthplace\u300d\u4e0d\u5728\u67e5\u8be2\u4e2d\u2014\u2014\u5c3d\u7ba1\u8fd9\u662f\u6b63\u786e\u7b54\u6848\uff0c\u91cd\u53e0\u5206\u6570\u5374\u5f88\u4f4e\u3002"
              )}
            </p>
          </div>
        </div>

        <p>
          {t(
            "Dense retrieval solves this by learning continuous vector representations where semantically similar texts are close in embedding space — regardless of surface-level word choice.",
            "密集检索通过学习连续向量表示来解决这个问题，使语义相似的文本在嵌入空间中相互靠近——不论表面词汇选择如何。"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Property", "特性")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("BM25 (Sparse)", "BM25（稀疏）")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("DPR (Dense)", "DPR（密集）")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Representation", "表示")}
                </td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Sparse TF-IDF vector", "稀疏 TF-IDF 向量")}
                </td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Dense 768-dim BERT vector", "768 维 BERT 密集向量")}
                </td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">
                  {t("Similarity", "相似度")}
                </td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Exact term overlap", "精确词汇重叠")}
                </td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Dot product in embedding space", "嵌入空间中的点积")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Training", "训练")}
                </td>
                <td className="border border-paper-200 px-4 py-2 text-red-600">
                  {t("Unsupervised (no learning)", "无监督（无需学习）")}
                </td>
                <td className="border border-paper-200 px-4 py-2 text-green-700">
                  {t("Supervised with QA pairs", "用 QA 对进行监督训练")}
                </td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">
                  {t("Semantic understanding", "语义理解")}
                </td>
                <td className="border border-paper-200 px-4 py-2 text-red-600">
                  {t("None (vocabulary mismatch fails)", "无（词汇不匹配时失败）")}
                </td>
                <td className="border border-paper-200 px-4 py-2 text-green-700">
                  {t("Yes — synonyms, paraphrases", "有——同义词、改写均可")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("NQ top-20 accuracy", "NQ top-20 准确率")}
                </td>
                <td className="border border-paper-200 px-4 py-2 text-red-600 font-semibold">
                  59.1%
                </td>
                <td className="border border-paper-200 px-4 py-2 text-green-700 font-semibold">
                  79.4%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ============ Section 2: DPR Architecture ============ */}
        <h2>{t("2. DPR Architecture: The Dual Encoder", "2. DPR 架构：双编码器")}</h2>

        <p>
          {t(
            "DPR uses two independent BERT-base encoders: one for questions (E_Q) and one for passages (E_P). Each encoder maps its input to a 768-dimensional vector by taking the [CLS] token representation from the final layer.",
            "DPR 使用两个独立的 BERT-base 编码器：一个用于问题（E_Q），一个用于段落（E_P）。每个编码器通过提取最后一层的 [CLS] 词元表示，将输入映射为 768 维向量。"
          )}
        </p>

        <Math
          display
          label={t("Similarity score", "相似度评分")}
          tex="\text{sim}(q, p) = E_Q(q)^\top \cdot E_P(p)"
        />

        <p>
          {t(
            "Where E_Q(q) and E_P(p) are 768-dimensional [CLS] representations from their respective BERT encoders. Both encoders are initialized from the same pre-trained BERT-base checkpoint but have separate weights after fine-tuning.",
            "其中 E_Q(q) 和 E_P(p) 分别是各自 BERT 编码器的 768 维 [CLS] 表示。两个编码器从同一个预训练的 BERT-base 检查点初始化，但微调后拥有各自独立的权重。"
          )}
        </p>

        <Collapsible
          title={t(
            "Why [CLS] token? Why dot product, not cosine?",
            "为什么用 [CLS] 词元？为什么用点积而不是余弦相似度？"
          )}
        >
          <div className="text-sm space-y-3">
            <p>
              <strong>{t("[CLS] token:", "[CLS] 词元：")}</strong>{" "}
              {t(
                "In BERT, the [CLS] (classification) token is prepended to every input and attends to all other tokens via full self-attention. Its final hidden state has been shown empirically to aggregate sentence-level semantics effectively. DPR experiments confirmed [CLS] outperforms averaging all token representations.",
                "在 BERT 中，[CLS]（分类）词元被添加到每个输入的开头，并通过完整的自注意力机制关注所有其他词元。经验证明，其最终隐藏状态能有效聚合句子级语义。DPR 实验确认 [CLS] 的效果优于对所有词元表示取平均。"
              )}
            </p>
            <p>
              <strong>{t("Dot product vs cosine:", "点积 vs 余弦：")}</strong>{" "}
              {t(
                "The paper found dot product similarity slightly outperforms L2 distance and cosine similarity. The intuition: cosine normalizes magnitude, but magnitude can encode useful information about how well-supported a passage is by the model. DPR's dot product is equivalent to cosine if vectors were L2-normalized.",
                "论文发现点积相似度略优于 L2 距离和余弦相似度。直觉上：余弦会归一化向量长度，但长度本身可以编码模型对段落的支持程度等有用信息。若向量经过 L2 归一化，点积等价于余弦相似度。"
              )}
            </p>
          </div>
        </Collapsible>

        <p>
          {t(
            "The key architectural choice — two separate encoders rather than one cross-encoder — is essential for scalability. A cross-encoder would concatenate the question and passage and run joint attention over both, making it impossible to pre-compute passage representations. With dual encoders, all passage embeddings can be computed offline once and stored in a FAISS index.",
            "关键的架构选择——两个独立编码器而非一个交叉编码器——对可扩展性至关重要。交叉编码器需要将问题和段落拼接后联合进行注意力计算，使得段落表示无法预计算。而双编码器可以离线一次性计算所有段落嵌入并存入 FAISS 索引。"
          )}
        </p>

        <div className="grid grid-cols-2 gap-4 my-6 text-sm">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-semibold text-red-800 mb-2">
              {t("Cross-encoder (not used)", "交叉编码器（未采用）")}
            </p>
            <p className="text-red-700">
              {t(
                "BERT([CLS] q [SEP] p [SEP]) → score. Powerful but must run on every (q, p) pair at query time — O(N) BERT calls for N passages. Infeasible at scale.",
                "BERT([CLS] q [SEP] p [SEP]) → 分数。强大但在查询时必须对每个 (q, p) 对运行——对 N 个段落需要 O(N) 次 BERT 调用。规模化时不可行。"
              )}
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-800 mb-2">
              {t("Dual encoder (DPR)", "双编码器（DPR）")}
            </p>
            <p className="text-green-700">
              {t(
                "E_Q(q)ᵀ · E_P(p). Passage embeddings pre-computed offline. Query time: 1 BERT call + FAISS lookup. Scales to 21M passages in milliseconds.",
                "E_Q(q)ᵀ · E_P(p)。段落嵌入离线预计算。查询时：1 次 BERT 调用 + FAISS 查找。毫秒内扩展到 2100 万段落。"
              )}
            </p>
          </div>
        </div>

        {/* ============ Section 3: Training with Hard Negatives ============ */}
        <h2>
          {t(
            "3. Training with Hard Negatives",
            "3. 使用难负样本训练"
          )}
        </h2>

        <p>
          {t(
            "The training objective is to make the positive passage (one containing the answer) score higher than all negative passages for a given question. The loss is negative log-likelihood over a softmax:",
            "训练目标是让给定问题的正样本段落（包含答案的段落）比所有负样本段落得分更高。损失函数为 softmax 上的负对数似然："
          )}
        </p>

        <Math
          display
          label={t("DPR training loss (NLL)", "DPR 训练损失（NLL）")}
          tex="L(q_i, p_i^+, p_{i,1}^-, \ldots, p_{i,n}^-) = -\log \frac{e^{\text{sim}(q_i, p_i^+)}}{e^{\text{sim}(q_i, p_i^+)} + \sum_{j=1}^{n} e^{\text{sim}(q_i, p_{i,j}^-)}}"
        />

        <Collapsible
          title={t("Breaking down the loss term by term", "逐项解析损失函数")}
          defaultOpen
        >
          <div className="text-sm space-y-3">
            <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-3">
              <Math tex="q_i" />
              <span>
                {t(
                  "The i-th training question",
                  "第 i 个训练问题"
                )}
              </span>

              <Math tex="p_i^+" />
              <span>
                {t(
                  "The positive passage — one that contains the ground-truth answer span",
                  "正样本段落——包含真实答案片段的段落"
                )}
              </span>

              <Math tex="p_{i,j}^-" />
              <span>
                {t(
                  "The j-th negative passage — does not contain the answer",
                  "第 j 个负样本段落——不包含答案"
                )}
              </span>

              <Math tex="\text{sim}(q_i, p_i^+)" />
              <span>
                {t(
                  "Dot product score for the correct passage — we want this to be large",
                  "正确段落的点积分数——我们希望它尽量大"
                )}
              </span>

              <span className="font-mono text-xs">softmax denom</span>
              <span>
                {t(
                  "Sum of exp scores over positive + all negatives — normalizes into a probability",
                  "正样本与所有负样本的指数分数之和——归一化为概率"
                )}
              </span>
            </div>
            <p className="text-paper-800/70 mt-2">
              {t(
                "The loss is minimized when the positive passage has much higher score than all negatives, pushing the positive embedding close to the question embedding and negatives far away.",
                "当正样本段落的分数远高于所有负样本时损失最小，这会将正样本嵌入推向问题嵌入附近，并将负样本推远。"
              )}
            </p>
          </div>
        </Collapsible>

        <p>
          {t(
            "The quality of negatives is critical. DPR uses three types:",
            "负样本的质量至关重要。DPR 使用三种类型的负样本："
          )}
        </p>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg text-sm">
            <p className="font-semibold mb-1">
              {t("1. Random negatives", "1. 随机负样本")}
            </p>
            <p className="text-paper-800/70">
              {t(
                "Randomly sampled passages from Wikipedia. Easy to distinguish — low training signal. Used mainly to fill the batch.",
                "从维基百科随机采样的段落。容易区分——训练信号弱。主要用于填充批次。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg text-sm">
            <p className="font-semibold mb-1">
              {t("2. In-batch negatives (key efficiency trick)", "2. 批内负样本（关键效率技巧）")}
            </p>
            <p className="text-paper-800/70">
              {t(
                "The positive passages of other questions in the same mini-batch serve as negatives. If batch size B = 32, each question gets B-1 = 31 free negatives. This dramatically reduces cost: passage embeddings already computed for the batch are reused.",
                "同一小批次中其他问题的正样本段落充当负样本。若批次大小 B = 32，每个问题可免费获得 B-1 = 31 个负样本。这大幅降低了成本：批次中已计算的段落嵌入可以复用。"
              )}
            </p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
            <p className="font-semibold text-amber-800 mb-1">
              {t("3. Hard negatives (BM25 top-k) — most important", "3. 难负样本（BM25 top-k）——最重要")}
            </p>
            <p className="text-amber-700">
              {t(
                "BM25 retrieves the top passages for the question that do NOT contain the answer. These are lexically similar but semantically wrong — exactly the hard cases the model needs to learn to reject. Adding hard negatives was the single biggest accuracy improvement in ablations.",
                "BM25 检索问题的 top 段落中不包含答案的部分。这些段落词汇上相似但语义上错误——正是模型需要学会拒绝的难例。消融实验表明，加入难负样本是单一最大的准确率提升来源。"
              )}
            </p>
          </div>
        </div>

        <Collapsible
          title={t(
            "Why in-batch negatives work so well",
            "为什么批内负样本效果这么好"
          )}
        >
          <p className="text-sm">
            {t(
              "During training, a batch contains B question-passage pairs. For question q_i, the positive is p_i^+ and all other B-1 passages p_j^+ (j ≠ i) in the batch serve as negatives. The trick: you compute B question embeddings and B passage embeddings — that's 2B forward passes — but you get B×(B-1) negative training pairs from a single batch. With B=128, that's 128 questions each with 127 negatives = 16,256 pairs per batch for the cost of 256 encoder calls.",
              "训练时，一个批次包含 B 个问题-段落对。对于问题 q_i，正样本是 p_i^+，批次中所有其他 B-1 个段落 p_j^+（j ≠ i）充当负样本。技巧在于：计算 B 个问题嵌入和 B 个段落嵌入——即 2B 次前向传播——但从单个批次中获得 B×(B-1) 个负样本训练对。当 B=128 时，128 个问题各有 127 个负样本 = 每批 16,256 对，成本仅为 256 次编码器调用。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 4: FAISS ============ */}
        <h2>
          {t(
            "4. FAISS for Billion-Scale Retrieval",
            "4. 用于十亿级检索的 FAISS"
          )}
        </h2>

        <p>
          {t(
            "At inference time, DPR must find the top-k most similar passages from a corpus of 21 million Wikipedia passages. Brute-force dot product over 21M 768-dim vectors would be too slow. DPR uses Facebook AI Similarity Search (FAISS).",
            "在推理时，DPR 必须从 2100 万个维基百科段落的语料库中找到 top-k 最相似的段落。对 2100 万个 768 维向量进行暴力点积计算太慢了。DPR 使用 Facebook AI 相似搜索（FAISS）。"
          )}
        </p>

        <Math
          display
          label={t("Retrieval objective", "检索目标")}
          tex="\text{top-}k = \underset{p \in \mathcal{P}}{\text{argmax}} \; \text{sim}(q, p) = \underset{p \in \mathcal{P}}{\text{argmax}} \; E_Q(q)^\top E_P(p)"
        />

        <p>
          {t(
            "FAISS is a library for Maximum Inner Product Search (MIPS) and approximate nearest neighbor search. The DPR pipeline works as follows:",
            "FAISS 是用于最大内积搜索（MIPS）和近似最近邻搜索的库。DPR 流程如下："
          )}
        </p>

        <div className="space-y-2 my-4">
          <div className="flex gap-3 text-sm">
            <span className="flex-none w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
              1
            </span>
            <div>
              <strong>{t("Offline indexing:", "离线索引：")}</strong>{" "}
              {t(
                "Run E_P on all 21M passages. Store the 21M × 768 matrix as a FAISS index. This takes ~8.8 hours on 8 GPUs but only needs to be done once.",
                "对全部 2100 万个段落运行 E_P。将 2100 万 × 768 的矩阵存储为 FAISS 索引。在 8 块 GPU 上耗时约 8.8 小时，但只需执行一次。"
              )}
            </div>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="flex-none w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
              2
            </span>
            <div>
              <strong>{t("Online retrieval:", "在线检索：")}</strong>{" "}
              {t(
                "For a new question q, compute E_Q(q) — one BERT forward pass. Then query FAISS for the top-100 nearest passage embeddings by dot product. FAISS uses approximate search (HNSW or IVF) to do this in ~1ms.",
                "对于新问题 q，计算 E_Q(q)——一次 BERT 前向传播。然后查询 FAISS 获取点积最近的 top-100 段落嵌入。FAISS 使用近似搜索（HNSW 或 IVF）在约 1 毫秒内完成。"
              )}
            </div>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="flex-none w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
              3
            </span>
            <div>
              <strong>{t("Reader:", "阅读器：")}</strong>{" "}
              {t(
                "The retrieved top-k passages are passed to a separate BERT-based reader model that extracts the answer span.",
                "检索到的 top-k 段落传递给独立的基于 BERT 的阅读器模型，用于提取答案片段。"
              )}
            </div>
          </div>
        </div>

        <Collapsible
          title={t(
            "How FAISS approximate search works (IVF index)",
            "FAISS 近似搜索的工作原理（IVF 索引）"
          )}
        >
          <div className="text-sm space-y-2">
            <p>
              {t(
                "FAISS IVF (Inverted File Index) uses k-means to partition the 768-dim embedding space into C clusters (e.g., C=2048). Each passage embedding is assigned to its nearest cluster centroid.",
                "FAISS IVF（倒排文件索引）使用 k-means 将 768 维嵌入空间划分为 C 个簇（如 C=2048）。每个段落嵌入被分配到最近的簇中心。"
              )}
            </p>
            <p>
              {t(
                "At query time: (1) Find the nearest W cluster centroids to E_Q(q). (2) Exhaustively search only within those W clusters (~21M/C × W passages). This reduces search cost by C/W — with C=2048, W=64, you only search 64/2048 = 3% of passages with minimal accuracy loss.",
                "查询时：（1）找到距离 E_Q(q) 最近的 W 个簇中心。（2）仅在这 W 个簇内穷举搜索（约 2100 万/C × W 个段落）。这将搜索成本降低了 C/W 倍——当 C=2048，W=64 时，只需搜索 64/2048 = 3% 的段落，准确率损失极小。"
              )}
            </p>
            <p>
              {t(
                "DPR also supports HNSW (Hierarchical Navigable Small World) graphs which offer even faster queries. The paper uses the FAISS Flat index (exact search) for the 21M Wikipedia passage corpus since it fits in ~65GB RAM.",
                "DPR 还支持 HNSW（层次可导航小世界）图，提供更快的查询速度。论文对 2100 万维基百科段落语料库使用 FAISS Flat 索引（精确搜索），因为它可以放入约 65GB 内存。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 5: Worked Example ============ */}
        <h2>{t("5. Worked Example", "5. 完整示例")}</h2>

        <p>
          {t(
            "Let's trace through DPR end-to-end for the Einstein birthplace question:",
            "让我们逐步追踪 DPR 对爱因斯坦出生地问题的完整处理过程："
          )}
        </p>

        <div className="space-y-4 my-6">
          <div className="p-4 bg-white border border-paper-200 rounded-lg text-sm">
            <p className="font-semibold text-paper-800 mb-2">
              {t("Step 1 — Encode the question", "第 1 步——编码问题")}
            </p>
            <p className="font-mono text-xs bg-paper-50 p-2 rounded mb-2">
              {t(
                '"Where was Einstein born?" → E_Q → [0.12, -0.34, 0.87, ..., 0.03] ∈ ℝ⁷⁶⁸',
                "「爱因斯坦出生在哪里？」→ E_Q → [0.12, -0.34, 0.87, ..., 0.03] ∈ ℝ⁷⁶⁸"
              )}
            </p>
            <p className="text-xs text-paper-800/60">
              {t("768-dim dense vector representing the question's meaning", "表示问题含义的 768 维密集向量")}
            </p>
          </div>

          <div className="p-4 bg-white border border-paper-200 rounded-lg text-sm">
            <p className="font-semibold text-paper-800 mb-2">
              {t("Step 2 — Retrieve top-k passages via FAISS", "第 2 步——通过 FAISS 检索 top-k 段落")}
            </p>
            <p className="text-xs text-paper-800/70 mb-2">
              {t("Compute dot product with all 21M pre-encoded passage vectors. Return top 20.", "与全部 2100 万预编码段落向量计算点积，返回前 20 个。")}
            </p>
            <p className="font-mono text-xs bg-paper-50 p-2 rounded">
              {t(
                "Top passage: \"Ulm is Einstein's birthplace, in the Kingdom of Württemberg.\" (score: 0.94)",
                "最高分段落：「乌尔姆是爱因斯坦的出生地，位于符腾堡王国。」（分数：0.94）"
              )}
            </p>
          </div>

          <div className="p-4 bg-white border border-paper-200 rounded-lg text-sm">
            <p className="font-semibold text-paper-800 mb-2">
              {t("Step 3 — Reader extracts answer", "第 3 步——阅读器提取答案")}
            </p>
            <p className="text-xs text-paper-800/70">
              {t("A separate reader model (e.g., BERT fine-tuned on SQuAD) extracts the answer span from the top passage.", "单独的阅读器模型（如在 SQuAD 上微调的 BERT）从最高分段落中提取答案片段。")}
            </p>
            <p className="font-mono text-xs bg-green-50 p-2 rounded mt-2 text-green-800">
              {t("Answer: \"Ulm\"", "答案：「乌尔姆」")}
            </p>
          </div>
        </div>

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