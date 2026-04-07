"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function RAGPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "RAG: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
            "RAG：面向知识密集型 NLP 任务的检索增强生成"
          )}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Lewis et al. &middot; Meta AI &middot; NeurIPS 2020 &middot;{" "}
          <a
            href="https://arxiv.org/abs/2005.11401"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            arXiv 2005.11401
          </a>
        </p>
      </header>

      <article className="paper-content">

        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "RAG combines a parametric memory (BART seq2seq generator) with a non-parametric memory (dense retrieval over 21M Wikipedia passages). Given a query, a DPR retriever fetches the top-k relevant passages; BART then generates the answer conditioned on the query and each passage. The model marginalizes over retrieved documents during training and achieves state-of-the-art on open-domain QA benchmarks without any task-specific fine-tuning of the retriever index.",
              "RAG 将参数化记忆（BART seq2seq 生成器）与非参数化记忆（对 2100 万条维基百科段落的密集检索）相结合。给定一个查询，DPR 检索器获取 top-k 相关段落；然后 BART 在查询和每个段落的条件下生成答案。模型在训练期间对检索到的文档进行边缘化，在开放域问答基准测试中无需对检索器索引进行任何特定任务微调即可达到当时最优效果。"
            )}
          </p>
        </section>

        {/* Section 1: The Hallucination Problem */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            1. {t("The Hallucination Problem", "幻觉问题")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Large language models store knowledge in their parameters during pretraining. This creates two deep problems: they can confidently generate plausible-sounding but factually wrong text (hallucination), and their knowledge is frozen at training time — updating facts requires expensive full retraining.",
              "大语言模型在预训练期间将知识存储在参数中。这带来了两个深层问题：它们可能自信地生成听起来合理但事实错误的文本（幻觉），并且其知识在训练时被固定——更新事实需要昂贵的完整重训练。"
            )}
          </p>
          <Collapsible
            title={t("Why parametric memory is not enough", "为什么参数化记忆不够用")}
          >
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <li>
                {t(
                  "Knowledge capacity is bounded by model size. A 400M-param model simply cannot memorize all of Wikipedia.",
                  "知识容量受模型大小限制。4 亿参数的模型根本无法记住整个维基百科。"
                )}
              </li>
              <li>
                {t(
                  "Parametric models cannot cite sources — there is no retrieval trace to verify.",
                  "参数化模型无法引用来源——没有可供验证的检索痕迹。"
                )}
              </li>
              <li>
                {t(
                  "Rare or long-tail facts are under-represented in gradients and tend to be forgotten or hallucinated.",
                  "罕见或长尾事实在梯度中代表性不足，往往被遗忘或产生幻觉。"
                )}
              </li>
              <li>
                {t(
                  "World knowledge changes — training a new model each time is prohibitively expensive.",
                  "世界知识在变化——每次训练新模型的代价极高。"
                )}
              </li>
            </ul>
          </Collapsible>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            {t(
              "RAG's core insight: separate what the model knows how to do (language, reasoning, generation) from what it needs to look up (facts, entities, recent events). Keep facts in a searchable external store that can be swapped or updated without retraining.",
              "RAG 的核心洞察：将模型知道如何做的事情（语言、推理、生成）与它需要查找的事情（事实、实体、近期事件）分离开来。将事实保存在可搜索的外部存储中，无需重训练即可交换或更新。"
            )}
          </p>
        </section>

        {/* Section 2: RAG Architecture */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            2. {t("RAG Architecture", "RAG 架构")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "RAG is a two-component system: a retriever that fetches relevant passages from a fixed corpus, and a generator that produces the answer conditioned on the query and retrieved passages. The retriever and generator are trained end-to-end by marginalizing over retrieved documents.",
              "RAG 是一个双组件系统：一个从固定语料库中获取相关段落的检索器，以及一个在查询和检索段落条件下生成答案的生成器。检索器和生成器通过对检索文档进行边缘化来端到端训练。"
            )}
          </p>
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {t("RAG Pipeline", "RAG 流程")}
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-800 dark:text-gray-200">
              <div className="flex items-center gap-3">
                <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded px-2 py-1 font-mono text-xs">
                  {t("Input query x", "输入查询 x")}
                </span>
                <span className="text-gray-400">→</span>
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded px-2 py-1 font-mono text-xs">
                  {t("DPR Retriever: top-k passages z₁…zₖ", "DPR 检索器：top-k 段落 z₁…zₖ")}
                </span>
                <span className="text-gray-400">→</span>
                <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded px-2 py-1 font-mono text-xs">
                  {t("BART Generator: output y", "BART 生成器：输出 y")}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t(
                  "Retriever provides p_η(z|x) · Generator provides p_θ(y|x,z) · Marginalize: p(y|x) = Σ_z p_η(z|x) · p_θ(y|x,z)",
                  "检索器提供 p_η(z|x) · 生成器提供 p_θ(y|x,z) · 边缘化：p(y|x) = Σ_z p_η(z|x) · p_θ(y|x,z)"
                )}
              </p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t(
              "The joint probability is defined by marginalizing over the latent document variable z. During training, the retriever index is fixed (not updated by gradient), while both the DPR query encoder and the BART parameters receive gradients through the generator loss.",
              "联合概率通过对潜在文档变量 z 进行边缘化来定义。在训练过程中，检索器索引是固定的（不通过梯度更新），而 DPR 查询编码器和 BART 参数都通过生成器损失接收梯度。"
            )}
          </p>
        </section>

        {/* Section 3: DPR Retriever */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            3. {t("Retriever: Dense Passage Retrieval (DPR)", "检索器：密集段落检索（DPR）")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The retriever uses DPR — a bi-encoder architecture that maps both queries and passages to dense vectors in the same embedding space. Relevance is measured by dot-product similarity, enabling efficient Maximum Inner Product Search (MIPS) over a pre-built index of 21 million Wikipedia passages.",
              "检索器使用 DPR——一种双编码器架构，将查询和段落都映射到同一嵌入空间中的密集向量。相关性通过点积相似度来衡量，从而在预先构建的 2100 万条维基百科段落索引上实现高效的最大内积搜索（MIPS）。"
            )}
          </p>
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {t("DPR Similarity Score", "DPR 相似度得分")}
            </p>
            <Math display tex={`\\text{sim}(q, p) = E_Q(q)^\\top \\cdot E_P(p)`} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {t(
                "E_Q: BERT-based query encoder · E_P: BERT-based passage encoder · Both produce 768-dim vectors",
                "E_Q：基于 BERT 的查询编码器 · E_P：基于 BERT 的段落编码器 · 两者均产生 768 维向量"
              )}
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "All 21M passage embeddings are pre-computed and stored in a FAISS index. At inference, only the query is encoded on the fly; MIPS retrieves the top-k passages in sub-linear time.",
              "所有 2100 万条段落嵌入均预先计算并存储在 FAISS 索引中。在推理时，只有查询被即时编码；MIPS 在次线性时间内检索 top-k 段落。"
            )}
          </p>
          <Collapsible title={t("Bi-encoder vs. cross-encoder trade-offs", "双编码器 vs 交叉编码器权衡")}>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                {t(
                  "A cross-encoder jointly encodes the query and passage together through full self-attention — much more expressive but requires a separate forward pass for every (query, passage) pair. With 21M passages this is computationally infeasible at retrieval time.",
                  "交叉编码器通过完整自注意力将查询和段落联合编码——表达能力强得多，但需要对每个（查询，段落）对进行单独的前向传播。对于 2100 万条段落，在检索时这在计算上是不可行的。"
                )}
              </p>
              <p>
                {t(
                  "The bi-encoder encodes query and passage independently, enabling passage vectors to be pre-computed offline. The query vector is computed once per query, and MIPS finds top-k matches in milliseconds — the right trade-off for large-scale retrieval.",
                  "双编码器独立编码查询和段落，使段落向量可以离线预计算。每次查询只计算一次查询向量，MIPS 在毫秒内找到 top-k 匹配——这是大规模检索的正确权衡。"
                )}
              </p>
            </div>
          </Collapsible>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            {t(
              "The retriever probability over document z given query x is defined as:",
              "给定查询 x，文档 z 的检索器概率定义为："
            )}
          </p>
          <div className="my-4">
            <Math display tex={`p_\\eta(z \\mid x) \\propto \\exp\\!\\left(E_Q(x)^\\top E_P(z)\\right)`} />
          </div>
        </section>

        {/* Section 4: BART Generator */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            4. {t("Generator: BART", "生成器：BART")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The generator is BART-large — a denoising autoencoder pretrained as an encoder-decoder Transformer. BART's encoder receives a concatenation of the query x and retrieved passage z; its decoder auto-regressively generates the output sequence y token by token.",
              "生成器是 BART-large——一个作为编码器-解码器 Transformer 预训练的去噪自动编码器。BART 的编码器接收查询 x 和检索段落 z 的拼接；其解码器自回归地逐 token 生成输出序列 y。"
            )}
          </p>
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {t("Generator input format", "生成器输入格式")}
            </p>
            <code className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-xs text-gray-800 dark:text-gray-200 font-mono">
              {`[BOS] question: {x} context: {z} [EOS]  →  {y}`}
            </code>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t(
                "Query x and passage z are concatenated as the encoder input. The decoder generates y auto-regressively.",
                "查询 x 和段落 z 拼接作为编码器输入。解码器自回归生成 y。"
              )}
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t(
              "The generator defines the conditional probability of each token given all previous tokens, the query, and the retrieved passage. This factorizes as:",
              "生成器定义了在所有先前 token、查询和检索段落条件下每个 token 的条件概率。这分解为："
            )}
          </p>
          <div className="my-4">
            <Math display tex={`p_\\theta(y_i \\mid x, z, y_{1:i-1})`} />
          </div>
          <Collapsible title={t("Why BART? Key pretraining tasks", "为什么选 BART？关键预训练任务")}>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                {t(
                  "BART is pretrained with several denoising objectives including token masking, token deletion, text infilling, sentence permutation, and document rotation. This makes it a strong seq2seq model that can handle the noisy, varied inputs produced by concatenating queries with retrieved passages.",
                  "BART 使用多种去噪目标进行预训练，包括 token 掩码、token 删除、文本填充、句子置换和文档旋转。这使其成为一个强大的 seq2seq 模型，能够处理查询与检索段落拼接产生的嘈杂、多样的输入。"
                )}
              </p>
              <p>
                {t(
                  "BART-large has 400M parameters (12-layer encoder + 12-layer decoder). Its seq2seq pretraining naturally fits the RAG generation task.",
                  "BART-large 有 4 亿参数（12 层编码器 + 12 层解码器）。其 seq2seq 预训练自然适合 RAG 生成任务。"
                )}
              </p>
            </div>
          </Collapsible>
        </section>

        {/* Section 5: RAG-Sequence vs RAG-Token */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            5. {t("RAG-Sequence vs RAG-Token", "RAG-Sequence 与 RAG-Token")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t(
              "RAG proposes two ways to marginalize over the k retrieved documents. They differ in where the marginalization happens: once for the whole output sequence, or at every output token.",
              "RAG 提出了两种对 k 个检索文档进行边缘化的方式。它们的区别在于边缘化发生的位置：对整个输出序列一次，或在每个输出 token 处。"
            )}
          </p>

          {/* RAG-Sequence */}
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-5 mb-5">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
              {t("RAG-Sequence: one document per generation", "RAG-Sequence：每次生成使用一个文档")}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {t(
                "Treat the retrieved document as fixed for the entire output sequence. Marginalize over documents by summing the full sequence probability for each document:",
                "将检索到的文档视为整个输出序列的固定上下文。通过对每个文档的完整序列概率求和来对文档进行边缘化："
              )}
            </p>
            <Math display tex={`p_{\\text{RAG-Seq}}(y \\mid x) \\approx \\sum_{z \\,\\in\\, \\text{top-}k(p_\\eta(\\cdot|x))} p_\\eta(z \\mid x) \\prod_{i} p_\\theta(y_i \\mid x, z, y_{1:i-1})`} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {t(
                "Intuition: the model picks a document, fully generates a candidate answer conditioned on it, then averages across documents. Each candidate answer is coherent with one source.",
                "直觉：模型选择一个文档，在其条件下完整生成候选答案，然后对各文档取平均。每个候选答案与一个来源保持一致。"
              )}
            </p>
          </div>

          {/* RAG-Token */}
          <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg p-5 mb-5">
            <h3 className="font-semibold text-teal-900 dark:text-teal-200 mb-2">
              {t("RAG-Token: different document per token", "RAG-Token：每个 token 使用不同文档")}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {t(
                "Allow each output token to be generated from a different document. Marginalize at every decoding step:",
                "允许每个输出 token 从不同的文档中生成。在每个解码步骤进行边缘化："
              )}
            </p>
            <Math display tex={`p_{\\text{RAG-Tok}}(y \\mid x) \\approx \\prod_{i} \\sum_{z \\,\\in\\, \\text{top-}k(p_\\eta(\\cdot|x))} p_\\eta(z \\mid x) \\cdot p_\\theta(y_i \\mid x, z, y_{1:i-1})`} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {t(
                "Intuition: at each token, the model effectively aggregates evidence from all k documents. This is more flexible — it can synthesize facts from multiple passages within a single answer.",
                "直觉：在每个 token 处，模型有效地聚合来自所有 k 个文档的证据。这更灵活——它可以在单个答案中综合来自多个段落的事实。"
              )}
            </p>
          </div>

          <Collapsible title={t("When to use RAG-Sequence vs RAG-Token", "何时使用 RAG-Sequence vs RAG-Token")}>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                {t(
                  "RAG-Token is usually stronger on open-domain QA because answers can be short (a few words or a sentence) and benefit from synthesizing evidence across documents. Each token can be grounded in whichever passage provides the most support for that specific token.",
                  "RAG-Token 在开放域问答中通常更强，因为答案可以很短（几个词或一句话），并且受益于综合多个文档的证据。每个 token 可以基于为该特定 token 提供最多支持的段落。"
                )}
              </p>
              <p>
                {t(
                  "RAG-Sequence is preferable for longer generation tasks where internal consistency across the entire output matters — for instance, generating a multi-sentence explanation that should all come from one coherent source.",
                  "RAG-Sequence 更适合整个输出内部一致性很重要的长文本生成任务——例如，生成应全部来自一个连贯来源的多句解释。"
                )}
              </p>
            </div>
          </Collapsible>
        </section>

        {/* Section 6: Worked Example */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            6. {t("Worked Example: How RAG Answers a Question", "实例演示：RAG 如何回答问题")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Suppose the query is: \"Who invented the transformer architecture?\"",
              "假设查询是：「谁发明了 Transformer 架构？」"
)}
</p>
<ol className="list-decimal pl-5 space-y-4 text-gray-700 dark:text-gray-300 text-sm">
<li>
<strong>{t("Encode query", "编码查询")}: </strong>
{t(
"E_Q encodes the question into a 768-dim vector.",
"E_Q 将问题编码为 768 维向量。"
)}
</li>
<li>
<strong>{t("MIPS retrieval", "MIPS 检索")}: </strong>
{t(
"FAISS finds the top-k=5 Wikipedia passages with highest dot-product similarity. Passages about Vaswani et al., the 'Attention Is All You Need' paper, and the Transformer's reception are retrieved.",
"FAISS 找到点积相似度最高的 top-k=5 条维基百科段落。检索到关于 Vaswani 等人、《Attention Is All You Need》论文及 Transformer 接受情况的段落。"
)}
</li>
<li>
<strong>{t("Compute document weights", "计算文档权重")}: </strong>
{t(
"The retriever assigns a probability p_η(z|x) to each passage proportional to exp(E_Q(x)ᵀ E_P(z)).",
"检索器给每个段落分配概率 p_η(z|x)，与 exp(E_Q(x)ᵀ E_P(z)) 成正比。"
)}
</li>
<li>
<strong>{t("BART generates", "BART 生成")}: </strong>
{t(
"For each passage z, BART encodes [question; passage] and decodes a candidate answer. In RAG-Token, at each decoding step the next token is sampled from a mixture over all passages weighted by p_η(z|x).",
"对于每个段落 z，BART 编码 [问题；段落] 并解码一个候选答案。在 RAG-Token 中，在每个解码步骤，下一个 token 从所有段落的混合分布中采样，权重为 p_η(z|x)。"
)}
</li>
<li>
<strong>{t("Output", "输出")}: </strong>
{t(
"\"The transformer architecture was introduced by Vaswani et al. in the 2017 paper 'Attention Is All You Need.'\" — grounded in retrieved evidence, not memorized.",
"「Transformer 架构由 Vaswani 等人在 2017 年的论文《Attention Is All You Need》中提出。」——基于检索到的证据，而非记忆。"
              )}
            </li>
          </ol>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-5">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <strong>{t("Key insight", "关键洞察")}: </strong>
              {t(
                "The document probabilities p_η(z|x) act as soft attention weights over the corpus — the model attends to the entire Wikipedia index, not just its parameters.",
                "文档概率 p_η(z|x) 充当语料库上的软注意力权重——模型关注整个维基百科索引，而不仅仅是其参数。"
              )}
            </p>
          </div>
        </section>

        {/* Section 7: Training */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            7. {t("Training: Joint End-to-End Learning", "训练：联合端到端学习")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The full marginal probability is optimized directly with stochastic gradient descent. The loss is the negative log-likelihood of the correct output y* given query x:",
              "完整的边缘概率直接通过随机梯度下降进行优化。损失是给定查询 x 时正确输出 y* 的负对数似然："
            )}
          </p>
          <div className="my-4">
            <Math display tex={`\\mathcal{L} = -\\sum_{(x, y^*)} \\log p(y^* \\mid x)`} />
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Gradients flow through both the BART generator (p_θ) and the DPR query encoder E_Q (inside p_η). The passage encoder E_P and the FAISS index are frozen — updating them would require reindexing 21M passages after every gradient step.",
              "梯度流经 BART 生成器（p_θ）和 DPR 查询编码器 E_Q（在 p_η 内部）。段落编码器 E_P 和 FAISS 索引被冻结——更新它们需要在每次梯度步骤后重新索引 2100 万条段落。"
            )}
          </p>
          <Collapsible title={t("The gradient approximation detail", "梯度近似细节")}>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                {t(
                  "The sum over all 21M documents is intractable. RAG approximates it by summing only over the top-k retrieved passages. This is justified because p_η(z|x) assigns negligible probability mass to non-retrieved passages.",
                  "对所有 2100 万文档求和是不可处理的。RAG 通过仅对 top-k 检索段落求和来近似。这是合理的，因为 p_η(z|x) 对未检索段落分配的概率质量可忽略不计。"
                )}
              </p>
              <p>
                {t(
                  "In practice k=5 documents work well. The authors find that updating the document index (Asynchronous Index Update) during training gives marginal improvements and is typically omitted for simplicity.",
                  "实际上 k=5 个文档效果良好。作者发现在训练期间更新文档索引（异步索引更新）只能带来边际改进，通常为了简便而省略。"
                )}
              </p>
            </div>
          </Collapsible>
        </section>

        {/* Section 8: Results */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            8. {t("Results", "实验结果")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
            {t(
              "RAG achieves state-of-the-art on multiple open-domain QA benchmarks at publication time, outperforming purely parametric models of much larger size.",
              "RAG 在发表时在多个开放域问答基准测试上达到最优，超越了规模大得多的纯参数化模型。"
            )}
          </p>
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                    {t("Benchmark", "基准测试")}
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                    {t("Metric", "指标")}
                  </th>
                  <th className="text-right px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                    {t("Prior SOTA", "先前最优")}
                  </th>
                  <th className="text-right px-4 py-2 font-semibold text-green-700 dark:text-green-400">
                    RAG
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">NaturalQuestions</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">EM</td>
                  <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">44.5</td>
                  <td className="px-4 py-2 text-right font-semibold text-green-700 dark:text-green-400">44.5 → 44.5*</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">TriviaQA</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">EM</td>
                  <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">67.8</td>
                  <td className="px-4 py-2 text-right font-semibold text-green-700 dark:text-green-400">68.0</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">WebQuestions</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">EM</td>
                  <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">41.5</td>
                  <td className="px-4 py-2 text-right font-semibold text-green-700 dark:text-green-400">45.5</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">CuratedTrec</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">EM</td>
                  <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">50.6</td>
                  <td className="px-4 py-2 text-right font-semibold text-green-700 dark:text-green-400">72.1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
            {t(
              "EM = Exact Match. RAG-Token reported for NQ and TriviaQA; RAG-Sequence for WebQ and CuratedTrec.",
              "EM = 精确匹配。NQ 和 TriviaQA 报告 RAG-Token；WebQ 和 CuratedTrec 报告 RAG-Sequence。"
            )}
          </p>
          <Collapsible title={t("Ablation highlights", "消融实验亮点")}>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>
                {t(
                  "Jointly training the query encoder with BART is critical — fixing the retriever entirely hurts performance by ~3 EM points on NQ.",
                  "与 BART 联合训练查询编码器至关重要——完全固定检索器会使 NQ 上的性能下降约 3 个 EM 点。"
                )}
              </li>
              <li>
                {t(
                  "Increasing k from 1 to 5 consistently improves performance; beyond 10 the gains plateau.",
                  "将 k 从 1 增加到 5 会持续提高性能；超过 10 后收益趋于平稳。"
                )}
              </li>
              <li>
                {t(
                  "RAG generates more specific and diverse text than a pure parametric T5 model, as measured by human evaluation.",
                  "根据人工评估，RAG 生成的文本比纯参数化 T5 模型更具体、更多样。"
                )}
              </li>
              <li>
                {t(
                  "Swapping the Wikipedia index to a different domain (e.g., medical texts) immediately shifts the knowledge base — no retraining required.",
                  "将维基百科索引替换为不同领域（例如医学文本）可立即更换知识库——无需重训练。"
                )}
              </li>
            </ul>
          </Collapsible>
        </section>

        {/* Section 9: Why RAG Matters Today */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            9. {t("Why RAG Matters Today", "RAG 为何在今天依然重要")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "RAG has become one of the most practically impactful ideas from NLP research. The retrieval-augmented paradigm is now the default architecture for production LLM applications that require factual accuracy and up-to-date knowledge.",
              "RAG 已成为 NLP 研究中实践影响最大的想法之一。检索增强范式现在是需要事实准确性和最新知识的生产 LLM 应用的默认架构。"
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 dark:text-purple-200 text-sm mb-2">
                {t("Knowledge stays fresh", "知识保持新鲜")}
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {t(
                  "Updating the retrieval corpus (e.g., adding new documents) immediately updates the model's effective knowledge without any gradient update.",
                  "更新检索语料库（例如添加新文档）可立即更新模型的有效知识，无需任何梯度更新。"
                )}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-200 text-sm mb-2">
                {t("Hallucination reduction", "减少幻觉")}
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {t(
                  "Grounding generation in retrieved text reduces confabulation — the model's output is anchored to actual documents.",
                  "将生成锚定在检索文本中可减少捏造——模型的输出锚定在实际文档中。"
                )}
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 dark:text-amber-200 text-sm mb-2">
                {t("Interpretability", "可解释性")}
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {t(
                  "Unlike purely parametric models, RAG's retrieved passages give a direct audit trail — you can see exactly what the model read.",
                  "与纯参数化模型不同，RAG 检索到的段落提供了直接的审计追踪——你可以精确看到模型读了什么。"
                )}
              </p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg p-4">
              <h4 className="font-semibold text-rose-900 dark:text-rose-200 text-sm mb-2">
                {t("Domain specialization", "领域专业化")}
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {t(
                  "Swapping the corpus enables instant domain adaptation — medical RAG, legal RAG, code RAG — using the same trained model.",
                  "替换语料库可实现即时领域适配——医疗 RAG、法律 RAG、代码 RAG——使用同一个训练好的模型。"
                )}
              </p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t(
              "Modern RAG systems extend the original paper in many ways: better retrievers (e.g., ColBERT, E5, BGE), hybrid search (dense + BM25 sparse), re-ranking, multi-hop retrieval, and long-context generation. But the core idea — separate retrieval from generation, marginalize over retrieved documents — comes directly from this 2020 paper.",
              "现代 RAG 系统在许多方面扩展了原始论文：更好的检索器（例如 ColBERT、E5、BGE）、混合搜索（密集 + BM25 稀疏）、重排序、多跳检索和长上下文生成。但核心思想——将检索与生成分离，对检索文档进行边缘化——直接来自这篇 2020 年的论文。"
            )}
          </p>
        </section>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`${basePath}/`}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            ← {t("Back to all papers", "返回论文列表")}
          </Link>
        </div>

      </article>
    </div>
  );
}
