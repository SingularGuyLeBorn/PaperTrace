"use client";

import { useLang } from "@/lib/i18n";
import Link from "next/link";

interface Paper {
  num: number;
  title: string;
  authors: string;
  year: string;
  tldr: string;
  tldrZh: string;
  concepts: string[];
  arXiv?: string;
  slug?: string; // internal breakdown page if it exists
}

const papers: Paper[] = [
  {
    num: 1,
    title: "The First Law of Complexodynamics",
    authors: "Scott Aaronson",
    year: "—",
    tldr: "Why does complexity in physical systems rise, peak, and fall — unlike entropy which only grows? Introduces 'complextropy' as a bounded complexity measure.",
    tldrZh: "物理系统中的复杂度为何先升后降，而不像熵那样单调递增？提出 complextropy 作为有界复杂度度量。",
    concepts: ["Kolmogorov complexity", "Sophistication", "Entropy"],
    slug: "complexodynamics",
  },
  {
    num: 2,
    title: "The Unreasonable Effectiveness of Recurrent Neural Networks",
    authors: "Andrej Karpathy",
    year: "2015",
    tldr: "RNNs trained character-by-character on raw text can produce surprisingly coherent outputs — code, Shakespeare, math papers. A must-read for building intuition about sequence models.",
    tldrZh: "逐字符训练的 RNN 能生成出人意料的连贯文本——代码、莎士比亚、数学论文。建立序列模型直觉的必读文章。",
    concepts: ["RNN", "Sequence Modeling", "Character-level LM"],
    arXiv: "http://karpathy.github.io/2015/05/21/rnn-effectiveness/",
    slug: "unreasonable-effectiveness-rnn",
  },
  {
    num: 3,
    title: "Understanding LSTM Networks",
    authors: "Christopher Olah",
    year: "2015",
    tldr: "The clearest explanation of how LSTM gates (forget, input, output) enable long-term memory. Required reading before diving into Transformers.",
    tldrZh: "最清晰的 LSTM 门控机制（遗忘门、输入门、输出门）解释。深入 Transformer 之前的必读资料。",
    concepts: ["LSTM", "Gating Mechanisms", "Long-term Dependencies"],
    arXiv: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
    slug: "understanding-lstm",
  },
  {
    num: 4,
    title: "Recurrent Neural Network Regularization",
    authors: "Zaremba, Sutskever, Vinyals",
    year: "2014",
    tldr: "Dropout for LSTMs: apply it only on non-recurrent connections. Simple fix that significantly improves generalization on language modeling tasks.",
    tldrZh: "LSTM 的 Dropout 方案：仅对非循环连接应用。简单有效，显著提升语言建模任务的泛化能力。",
    concepts: ["Dropout", "LSTM", "Regularization"],
    arXiv: "https://arxiv.org/abs/1409.2329",
    slug: "rnn-regularization",
  },
  {
    num: 5,
    title: "Keeping Neural Networks Simple by Minimizing the Description Length of the Weights",
    authors: "Hinton, van Camp",
    year: "1993",
    tldr: "Apply Minimum Description Length (MDL) to networks: add Gaussian noise to weights to compress them. A 1993 precursor to modern weight regularization and Bayesian deep learning.",
    tldrZh: "将最小描述长度（MDL）应用于神经网络：给权重添加高斯噪声以压缩。1993 年提出，是现代权重正则化和贝叶斯深度学习的先驱。",
    concepts: ["MDL Principle", "Weight Compression", "Bayesian NNs"],
    slug: "mdl-weights",
  },
  {
    num: 6,
    title: "Pointer Networks",
    authors: "Vinyals, Fortunato, Jaitly",
    year: "2015",
    tldr: "Attention mechanism that points to positions in the input instead of a fixed output vocabulary. Solves variable-output problems like convex hull and TSP.",
    tldrZh: "一种指向输入位置的注意力机制，而非固定输出词表。可解决凸包、TSP 等输出长度可变的问题。",
    concepts: ["Pointer Mechanism", "Attention", "Combinatorial Optimization"],
    arXiv: "https://arxiv.org/abs/1506.03134",
    slug: "pointer-networks",
  },
  {
    num: 7,
    title: "ImageNet Classification with Deep CNNs (AlexNet)",
    authors: "Krizhevsky, Sutskever, Hinton",
    year: "2012",
    tldr: "The paper that started the deep learning revolution. AlexNet used ReLU activations, GPU training, and dropout to crush ImageNet by a 10%+ margin.",
    tldrZh: "引发深度学习革命的论文。AlexNet 用 ReLU 激活、GPU 训练和 Dropout，以超 10% 的优势碾压 ImageNet。",
    concepts: ["CNN", "ReLU", "GPU Training", "Dropout"],
    arXiv: "https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html",
    slug: "alexnet",
  },
  {
    num: 8,
    title: "Order Matters: Sequence to Sequence for Sets",
    authors: "Vinyals, Bengio, Kudlur",
    year: "2015",
    tldr: "The order you feed inputs into seq2seq models matters significantly — even for set-structured problems. Proposes methods for learning optimal input/output orderings.",
    tldrZh: "向 seq2seq 模型输入数据的顺序影响显著——即使是集合问题也如此。提出学习最优输入/输出顺序的方法。",
    concepts: ["Seq2Seq", "Order Invariance", "Attention"],
    arXiv: "https://arxiv.org/abs/1511.06391",
    slug: "order-matters",
  },
  {
    num: 9,
    title: "GPipe: Easy Scaling with Micro-Batch Pipeline Parallelism",
    authors: "Huang et al. (Google)",
    year: "2018",
    tldr: "Split model layers across accelerators and pipeline micro-batches through them. Enables training billion-parameter models on commodity hardware setups.",
    tldrZh: "将模型层分布到多个加速器，并以微批次流水线方式训练。让在普通硬件上训练十亿参数模型成为可能。",
    concepts: ["Model Parallelism", "Pipeline Parallelism", "Scaling"],
    arXiv: "https://arxiv.org/abs/1811.06965",
    slug: "gpipe",
  },
  {
    num: 10,
    title: "Deep Residual Learning for Image Recognition (ResNet)",
    authors: "He, Zhang, Ren, Sun",
    year: "2015",
    tldr: "Skip connections solve the degradation problem in very deep networks. ResNet-152 wins ImageNet 2015; residual blocks are now everywhere in deep learning.",
    tldrZh: "跳跃连接解决了极深网络中的退化问题。ResNet-152 赢得 ImageNet 2015；残差块现在遍布深度学习。",
    concepts: ["Skip Connections", "Residual Blocks", "Vanishing Gradients"],
    arXiv: "https://arxiv.org/abs/1512.03385",
    slug: "resnet",
  },
  {
    num: 11,
    title: "Multi-Scale Context Aggregation by Dilated Convolutions",
    authors: "Yu, Koltun",
    year: "2015",
    tldr: "Dilated convolutions expand the receptive field exponentially without losing resolution. Key for semantic segmentation tasks.",
    tldrZh: "膨胀卷积在不损失分辨率的情况下指数级扩展感受野。是语义分割任务的关键技术。",
    concepts: ["Dilated Convolutions", "Semantic Segmentation", "Receptive Field"],
    arXiv: "https://arxiv.org/abs/1511.07122",
    slug: "dilated-convolutions",
  },
  {
    num: 12,
    title: "Neural Message Passing for Quantum Chemistry",
    authors: "Gilmer et al. (Google)",
    year: "2017",
    tldr: "Unifies GNN variants under a single Message Passing Neural Network framework for predicting molecular properties from graphs.",
    tldrZh: "将各类 GNN 变体统一在消息传递神经网络框架下，用于从图结构预测分子性质。",
    concepts: ["Graph Neural Networks", "Message Passing", "Molecular Properties"],
    arXiv: "https://arxiv.org/abs/1704.01212",
    slug: "neural-message-passing",
  },
  {
    num: 13,
    title: "Attention Is All You Need",
    authors: "Vaswani et al. (Google Brain)",
    year: "2017",
    tldr: "Introduced the Transformer — replacing RNNs entirely with self-attention. The foundation of every modern LLM.",
    tldrZh: "提出了 Transformer——用自注意力完全替代 RNN。所有现代大语言模型的基石。",
    concepts: ["Self-Attention", "Multi-Head Attention", "Positional Encoding", "Encoder-Decoder"],
    arXiv: "https://arxiv.org/abs/1706.03762",
    slug: "attention-is-all-you-need",
  },
  {
    num: 14,
    title: "Neural Machine Translation by Jointly Learning to Align and Translate",
    authors: "Bahdanau, Cho, Bengio",
    year: "2014",
    tldr: "The original attention paper. Decoder learns to focus on relevant source words dynamically — precursor to the Transformer's self-attention.",
    tldrZh: "原始注意力机制论文。解码器动态关注相关源词——Transformer 自注意力的前身。",
    concepts: ["Attention Mechanism", "Alignment", "NMT"],
    arXiv: "https://arxiv.org/abs/1409.0473",
    slug: "bahdanau-attention",
  },
  {
    num: 15,
    title: "Identity Mappings in Deep Residual Networks",
    authors: "He, Zhang, Ren, Sun",
    year: "2016",
    tldr: "ResNet v2: move BN and ReLU before the convolution for clean identity mappings. Enables training ResNet-1001.",
    tldrZh: "ResNet v2：将 BN 和 ReLU 移到卷积之前，实现干净的恒等映射。可训练 ResNet-1001。",
    concepts: ["Identity Mappings", "Residual Networks", "Signal Propagation"],
    arXiv: "https://arxiv.org/abs/1603.05027",
    slug: "identity-mappings-resnet",
  },
  {
    num: 16,
    title: "A Simple Neural Network Module for Relational Reasoning",
    authors: "Santoro et al. (DeepMind)",
    year: "2017",
    tldr: "Relation Networks: a small module that computes all pairwise object relations. State-of-the-art on visual QA with a strikingly simple design.",
    tldrZh: "关系网络：一个计算所有成对对象关系的小模块。以极简设计在视觉问答上达到最优。",
    concepts: ["Relational Reasoning", "Pairwise Relations", "Visual QA"],
    arXiv: "https://arxiv.org/abs/1706.01427",
    slug: "relation-networks",
  },
  {
    num: 17,
    title: "Variational Lossy Autoencoder",
    authors: "Chen, Kingma, Salimans et al.",
    year: "2017",
    tldr: "Combines VAEs with autoregressive models: use autoregressive decoder to capture local details, let the VAE latent capture global structure.",
    tldrZh: "将 VAE 与自回归模型结合：用自回归解码器捕捉局部细节，VAE 隐变量捕捉全局结构。",
    concepts: ["VAE", "Variational Inference", "Autoregressive Models"],
    arXiv: "https://arxiv.org/abs/1611.02731",
    slug: "variational-lossy-autoencoder",
  },
  {
    num: 18,
    title: "Relational Recurrent Neural Networks",
    authors: "Santoro et al. (DeepMind)",
    year: "2018",
    tldr: "Relational Memory Core: uses multi-head attention for memory-to-memory interactions. Improves on tasks requiring tracking relations over time.",
    tldrZh: "关系记忆核：使用多头注意力实现记忆间交互。在需要追踪时序关系的任务上表现更优。",
    concepts: ["Memory Augmented NNs", "Multi-Head Attention", "Relational Reasoning"],
    arXiv: "https://arxiv.org/abs/1806.01822",
    slug: "relational-rnn",
  },
  {
    num: 19,
    title: "The Coffee Automaton: Coarse-graining, Symmetry Breaking, and Possible Futures",
    authors: "Aaronson, Carroll, Ouellette",
    year: "2014",
    tldr: "Cellular automata model of complexity: shows complexity peaks at intermediate times using coarse-grained Kolmogorov complexity. Companion to paper #1.",
    tldrZh: "元胞自动机建模复杂度：用粗粒化 Kolmogorov 复杂度证明复杂度在中间时刻达峰。是第1篇论文的伴侣文章。",
    concepts: ["Coarse-graining", "Complexity Dynamics", "Kolmogorov Complexity"],
    arXiv: "https://arxiv.org/abs/1405.6903",
    slug: "coffee-automaton",
  },
  {
    num: 20,
    title: "Neural Turing Machines",
    authors: "Graves, Wayne, Danihelka (DeepMind)",
    year: "2014",
    tldr: "Neural network + differentiable external memory = can learn algorithms (copy, sort, associative recall). Content + location-based addressing.",
    tldrZh: "神经网络 + 可微分外部记忆 = 可学习算法（复制、排序、关联回忆）。内容 + 位置双重寻址。",
    concepts: ["External Memory", "Differentiable Programming", "Turing Completeness"],
    arXiv: "https://arxiv.org/abs/1410.5401",
    slug: "neural-turing-machines",
  },
  {
    num: 21,
    title: "Deep Speech 2: End-to-End Speech Recognition in English and Mandarin",
    authors: "Amodei et al. (Baidu Research)",
    year: "2015",
    tldr: "End-to-end deep learning for ASR matching human performance on benchmarks. Works across English and Mandarin, different accents, noisy environments.",
    tldrZh: "端到端深度学习语音识别，在基准测试上达到人类水平。支持英文和普通话，适应不同口音和噪音环境。",
    concepts: ["ASR", "CTC", "Batch Normalization", "End-to-End"],
    arXiv: "https://arxiv.org/abs/1512.02595",
    slug: "deep-speech-2",
  },
  {
    num: 22,
    title: "Scaling Laws for Neural Language Models",
    authors: "Kaplan et al. (OpenAI)",
    year: "2020",
    tldr: "Loss follows power laws in N (params), D (data), C (compute). Optimal allocation: scale N and D together. Directly led to GPT-3 and the LLM scaling era.",
    tldrZh: "损失函数遵循关于 N（参数量）、D（数据量）、C（算力）的幂律。最优分配：同步扩大 N 和 D。直接催生了 GPT-3 和大模型时代。",
    concepts: ["Scaling Laws", "Power Laws", "Compute Optimal", "LLM"],
    arXiv: "https://arxiv.org/abs/2001.08361",
    slug: "scaling-laws",
  },
  {
    num: 23,
    title: "A Tutorial Introduction to the Minimum Description Length Principle",
    authors: "Peter Grünwald",
    year: "2004",
    tldr: "MDL principle: the best model is the one that compresses the data most. A bridge between Kolmogorov complexity and practical statistics / model selection.",
    tldrZh: "MDL 原则：最好的模型是压缩数据最充分的模型。连接 Kolmogorov 复杂度与实用统计/模型选择的桥梁。",
    concepts: ["MDL", "Model Selection", "Data Compression", "Kolmogorov Complexity"],
    arXiv: "https://arxiv.org/abs/math/0406077",
    slug: "mdl-tutorial",
  },
  {
    num: 24,
    title: "Machine Super Intelligence (Dissertation)",
    authors: "Shane Legg (DeepMind)",
    year: "2008",
    tldr: "Theoretical foundations of machine superintelligence: formal definition of intelligence, pathways to superintelligence, early AI safety framing.",
    tldrZh: "机器超级智能的理论基础：智能的形式化定义、通向超级智能的路径、早期 AI 安全框架。",
    concepts: ["AGI", "Intelligence Measures", "AI Safety", "Recursive Self-improvement"],
    arXiv: "https://www.vetta.org/documents/Machine_Super_Intelligence.pdf",
    slug: "machine-super-intelligence",
  },
  {
    num: 25,
    title: "Kolmogorov Complexity and Algorithmic Randomness",
    authors: "Shen, Uspensky, Vereshchagin",
    year: "—",
    tldr: "Comprehensive technical textbook on Kolmogorov complexity: incompressibility, algorithmic randomness, mutual information. The math behind intelligence measures.",
    tldrZh: "Kolmogorov 复杂度完整技术教材：不可压缩性、算法随机性、互信息。智能度量背后的数学。",
    concepts: ["Kolmogorov Complexity", "Algorithmic Randomness", "Information Theory"],
    arXiv: "https://www.lirmm.fr/~ashen/kolmbook-eng-scan.pdf",
    slug: "kolmogorov-complexity",
  },
  {
    num: 26,
    title: "CS231n: CNNs for Visual Recognition (Stanford)",
    authors: "Fei-Fei Li et al.",
    year: "—",
    tldr: "The gold standard CNN course — backpropagation, convolutions, batch norm, transfer learning. Still the best technical intro to deep learning for vision.",
    tldrZh: "CNN 标杆课程——反向传播、卷积、批归一化、迁移学习。至今仍是视觉深度学习最佳技术入门。",
    concepts: ["CNN", "Backpropagation", "Batch Normalization", "Transfer Learning"],
    arXiv: "https://cs231n.stanford.edu",
    slug: "cs231n",
  },
  {
    num: 27,
    title: "Better & Faster LLMs via Multi-Token Prediction",
    authors: "Gloeckle, Idrissi, Rozière et al. (Meta)",
    year: "2024",
    tldr: "Instead of predicting one next token, predict the next k tokens in parallel with k independent heads. Faster inference + better code/reasoning performance.",
    tldrZh: "不再预测单个下一个 token，而是用 k 个独立头并行预测后 k 个 token。推理更快，代码/推理能力更强。",
    concepts: ["Multi-Token Prediction", "Parallel Decoding", "Inference Speed"],
    arXiv: "https://arxiv.org/abs/2404.19737",
    slug: "multi-token-prediction",
  },
  {
    num: 28,
    title: "Dense Passage Retrieval for Open-Domain QA",
    authors: "Karpukhin et al. (Meta)",
    year: "2020",
    tldr: "Dual-encoder BERT for dense retrieval dramatically outperforms sparse BM25. The foundation of modern RAG systems.",
    tldrZh: "用于密集检索的双编码器 BERT 大幅超越稀疏 BM25 方法。现代 RAG 系统的基础。",
    concepts: ["Dense Retrieval", "Dual Encoder", "Open-Domain QA", "Embeddings"],
    arXiv: "https://arxiv.org/abs/2004.04906",
    slug: "dense-passage-retrieval",
  },
  {
    num: 29,
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (RAG)",
    authors: "Lewis et al. (Meta AI)",
    year: "2020",
    tldr: "Combine a pre-trained seq2seq model with a dense retriever over Wikipedia. Factual, updateable knowledge without retraining the model.",
    tldrZh: "将预训练 seq2seq 模型与基于 Wikipedia 的密集检索器结合。无需重新训练即可获得事实性、可更新的知识。",
    concepts: ["RAG", "Knowledge Retrieval", "Parametric Memory", "Seq2Seq"],
    arXiv: "https://arxiv.org/abs/2005.11401",
    slug: "rag",
  },
  {
    num: 30,
    title: "Zephyr: Direct Distillation of LM Alignment",
    authors: "Tunstall et al. (HuggingFace)",
    year: "2023",
    tldr: "Distill alignment from a larger teacher LLM to a smaller student using dSFT + dDPO — no PPO, no reward model. Zephyr-7B beats larger RLHF models.",
    tldrZh: "通过 dSFT + dDPO 将大型教师模型的对齐能力蒸馏到小型学生模型——无需 PPO，无需奖励模型。Zephyr-7B 胜过更大的 RLHF 模型。",
    concepts: ["Knowledge Distillation", "Alignment", "DPO", "Instruction Tuning"],
    arXiv: "https://arxiv.org/abs/2310.16944",
    slug: "zephyr",
  },
];

export default function Top30Page() {
  const { t, lang } = useLang();
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Link href="/" className="text-sm text-paper-800/50 dark:text-slate-500 hover:text-blue-600 transition-colors">
            ← {t("Home", "主页")}
          </Link>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight mb-3 dark:text-white">
          {t("Ilya's Top 30 Papers", "Ilya 的 30 篇必读论文")}
        </h1>
        <p className="text-base text-paper-800/60 dark:text-slate-400 max-w-2xl leading-relaxed">
          {t(
            "Ilya Sutskever's personal reading list — the papers that shaped modern deep learning. From Kolmogorov complexity to Transformers, residual networks to scaling laws.",
            "Ilya Sutskever 的私人书单 — 塑造现代深度学习的论文。从 Kolmogorov 复杂度到 Transformer，从残差网络到规模化定律。"
          )}
        </p>
        <a
          href="https://aman.ai/primers/ai/top-30-papers/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {t("Original list by Aman Chadha", "原始列表由 Aman Chadha 整理")} ↗
        </a>
      </header>

      {/* Paper grid */}
      <div className="space-y-3">
        {papers.map((paper) => {
          const href = paper.slug
            ? `/papers/${paper.slug}`
            : paper.arXiv;
          const isInternal = !!paper.slug;

          const CardContent = (
            <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all group cursor-pointer">
              {/* Number badge */}
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-paper-100 dark:bg-slate-700 text-paper-800/60 dark:text-slate-400 text-xs font-bold flex items-center justify-center mt-0.5">
                {paper.num}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-paper-800/50 dark:text-slate-500 mt-0.5">
                      {paper.authors}
                      {paper.year !== "—" ? ` · ${paper.year}` : ""}
                    </p>
                  </div>
                  {isInternal && (
                    <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                      {t("Full breakdown", "精读")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-paper-800/70 dark:text-slate-300 mt-2 leading-relaxed">
                  {lang === "zh" ? paper.tldrZh : paper.tldr}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {paper.concepts.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2 py-0.5 bg-paper-100 dark:bg-slate-700 text-paper-800/60 dark:text-slate-400 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <span className="flex-shrink-0 text-paper-800/30 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors text-sm mt-1">
                {isInternal ? "→" : "↗"}
              </span>
            </div>
          );

          return isInternal ? (
            <Link key={paper.num} href={href!}>
              {CardContent}
            </Link>
          ) : (
            <a
              key={paper.num}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {CardContent}
            </a>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-xs text-paper-800/40 dark:text-slate-600 mt-10 text-center">
        {t(
          "Cards marked 'Full breakdown' link to interactive deep-dives. Others link to the original paper.",
          "标注「精读」的卡片链接到交互式精读页面，其余链接到原始论文。"
        )}
      </p>
    </div>
  );
}
