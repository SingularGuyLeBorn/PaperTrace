"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { MoERoutingViz } from "@/components/widgets/MoERoutingViz";
import { KVCacheViz } from "@/components/widgets/KVCacheViz";
import { MuonOptimizerViz } from "@/components/widgets/MuonOptimizerViz";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function DeepSeekV4Page() {
  const { t } = useLang();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("DeepSeek-V4 Technical Report", "DeepSeek-V4 技术报告")}
        </h1>
        <p className="text-paper-800/50 dark:text-slate-400">
          DeepSeek AI &middot; 2026 &middot;{" "}
          <a
            href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {t("Technical Report (HuggingFace)", "技术报告（HuggingFace）")}
          </a>
        </p>
      </header>

      <article className="paper-content">

        {/* ── TL;DR ── */}
        <section className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "DeepSeek-V4-Pro is a 1.6T-parameter MoE model (49B active) pre-trained on 32T+ tokens. Key innovations: (1) CSA/HCA compressed attention — only 10% KV cache and 27% inference FLOPs vs DeepSeek-V3.2 at 1M context; (2) mHC Birkhoff-constrained residual connections for stable trillion-scale training; (3) the Muon optimizer replacing Adam for consistent gradient spectral norm. Achieves 80.6% SWE Verified, 93.5 LiveCodeBench, 3206 Codeforces Rating (Think Max mode).",
              "DeepSeek-V4-Pro 是 1.6T 参数 MoE 模型（49B 激活），在 32T+ token 上预训练。核心创新：(1) CSA/HCA 压缩注意力——在百万 token 上下文下 KV 缓存仅为 DeepSeek-V3.2 的 10%，推理 FLOPs 仅为 27%；(2) mHC Birkhoff 约束残差连接，支持万亿规模稳定训练；(3) Muon 优化器替代 Adam，保证一致的梯度谱范数。Think Max 模式下：SWE Verified 80.6%，LiveCodeBench 93.5，Codeforces 评分 3206。"
            )}
          </p>
        </section>

        {/* ── FlowChart ── */}
        <FlowChart
          title={t("DeepSeek Architecture Evolution", "DeepSeek 架构演进")}
          steps={[
            {
              title: t("DeepSeek-V2 (2024)", "DeepSeek-V2（2024）"),
              subtitle: t("Introduced MLA (Multi-head Latent Attention) to compress KV cache via low-rank projection", "引入 MLA（多头潜在注意力）通过低秩投影压缩 KV 缓存"),
              color: "rose",
            },
            {
              title: t("DeepSeek-V3 (2025, 671B)", "DeepSeek-V3（2025，671B）"),
              subtitle: t("Auxiliary-loss-free MoE load balancing + multi-token prediction; trained on 14.8T tokens", "无辅助损失 MoE 负载均衡 + 多 token 预测；在 14.8T token 上训练"),
              color: "amber",
            },
            {
              title: t("V4 Innovation 1+2: CSA/HCA + DSA", "V4 创新 1+2：CSA/HCA + DSA"),
              subtitle: t("Two-level attention overhaul — 10× KV cache reduction + 2× long-context compute reduction", "两级注意力革新 — KV 缓存减少 10 倍 + 长上下文计算减少 2 倍"),
              color: "blue",
            },
            {
              title: t("V4 Innovation 3: Engram Memory", "V4 创新 3：Engram 记忆"),
              subtitle: t("O(1) hash-based static knowledge store — decouples factual recall from FFN reasoning", "O(1) 哈希静态知识存储 — 将事实回忆与 FFN 推理解耦"),
              color: "teal",
            },
            {
              title: t("V4 Innovation 4: mHC", "V4 创新 4：mHC"),
              subtitle: t("Birkhoff-constrained residual streams via Sinkhorn-Knopp projection — stable gradient flow at 1.6T", "Birkhoff 约束残差流（Sinkhorn-Knopp 投影）— 1.6T 规模稳定梯度流"),
              color: "green",
            },
            {
              title: t("DeepSeek-V4-Pro (2026)", "DeepSeek-V4-Pro（2026）"),
              subtitle: t("1.6T / 49B active · 1M context · 32T+ tokens · MIT license", "1.6T / 49B 激活 · 百万上下文 · 32T+ token · MIT 协议"),
              color: "purple",
            },
          ]}
          arrows={[
            t("Scales", "扩展"),
            t("V4 adds", "V4 新增"),
            t("+", "+"),
            t("+", "+"),
            t("= V4", "= V4"),
          ]}
          highlights={[
            { text: t("3% params active per token", "每 token 仅激活 3% 参数"), color: "green" },
            { text: t("10× KV cache vs V3", "KV 缓存为 V3 的 1/10"), color: "blue" },
            { text: t("No Nvidia GPUs needed", "无需 Nvidia GPU"), color: "purple" },
          ]}
        />

        {/* ── 1. Background ── */}
        <h2>{t("1. Background: Two Scaling Walls", "1. 背景：两道扩展之墙")}</h2>
        <p>
          {t(
            "Frontier LLMs hit two fundamental walls as context grows. The memory wall: KV cache for a 1M-token context can exceed 100 GB, bottlenecking batch size and GPU utilisation. The compute wall: dense attention is O(L²) in sequence length — at 1M tokens, standard attention is simply infeasible.",
            "前沿大语言模型随上下文增长面临两道根本性的墙。内存墙：百万 token 上下文的 KV 缓存可能超过 100 GB，限制 batch size 和 GPU 利用率。计算墙：稠密注意力的计算复杂度为序列长度的 O(L²)——在百万 token 下，标准注意力根本不可行。"
          )}
        </p>
        <p>
          {t(
            "DeepSeek-V4 attacks both walls simultaneously with two attention innovations (CSA/HCA and DSA), then adds Engram memory to make 1M-context knowledge retrieval reliable, and mHC to keep a 1.6T-parameter model stable during training.",
            "DeepSeek-V4 通过两项注意力创新（CSA/HCA 和 DSA）同时攻克这两道墙，然后加入 Engram 记忆使百万 token 上下文的知识检索可靠，以及 mHC 使 1.6T 参数模型在训练中保持稳定。"
          )}
        </p>

        {/* ── 2. MoE ── */}
        <h2>{t("2. Foundation: MoE at 1.6T / 49B Active", "2. 基础：1.6T / 49B 激活的 MoE")}</h2>
        <p>
          {t(
            "V4-Pro uses Mixture-of-Experts to keep per-token compute feasible at 1.6T total parameters. Each token activates only the top-K expert FFN layers — roughly 3% of all weights — leaving the rest idle. The routing is learned end-to-end.",
            "V4-Pro 使用混合专家在 1.6T 总参数下保持每 token 计算可控。每个 token 只激活 top-K 个专家 FFN 层——约 3% 的权重——其余保持休眠。路由是端到端学习的。"
          )}
        </p>

        <Math
          display
          label={t("MoE routing — weighted sum of selected experts", "MoE 路由 — 选中专家的加权求和")}
          tex="\text{MoE}(x) = \sum_{i \in \text{Top-K}(x)} g_i(x) \cdot E_i(x), \quad g_i(x) = \frac{e^{s_i(x)}}{\sum_{j \in \text{Top-K}} e^{s_j(x)}}"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm">
            <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-3">
              <Math tex="x \in \mathbb{R}^d" />
              <span>{t("Input token hidden state", "输入 token 的隐藏状态")}</span>
              <Math tex="\text{Top-K}(x)" />
              <span>{t("Indices of the K experts with highest routing scores — K=2 in V4 (out of 64 routed experts per layer)", "路由分数最高的 K 个专家索引——V4 中 K=2（每层 64 个可路由专家中选 2）")}</span>
              <Math tex="s_i(x)" />
              <span>{t("Routing score for expert i — computed by a small gating network", "专家 i 的路由分数——由小型门控网络计算")}</span>
              <Math tex="g_i(x)" />
              <span>{t("Gating weight — softmax re-normalised over the top-K selected experts only", "门控权重——仅在选中的 top-K 专家上重新 softmax 归一化")}</span>
              <Math tex="E_i(x)" />
              <span>{t("Output of expert i (a 2-layer FFN with its own weights)", "专家 i 的输出（具有独立权重的 2 层 FFN）")}</span>
            </div>
          </div>
        </Collapsible>

        {/* Interactive MoE viz */}
        <MoERoutingViz />

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Why 1.6T total but only 49B active?", "为什么总参数 1.6T 但只激活 49B？")}</strong>{" "}
            {t(
              "MoE separates model capacity from inference cost. The 1.6T parameters store a vast library of specialised knowledge; the 49B active parameters per token is what you actually pay for at inference time. Compare to a dense 49B model — same inference cost but 32× less knowledge capacity.",
              "MoE 将模型容量与推理成本分离。1.6T 参数存储了大量专业知识；每 token 激活的 49B 参数才是推理时实际付出的成本。与稠密 49B 模型相比——推理成本相同，但知识容量少 32 倍。"
            )}
          </p>
        </div>

        {/* ── 3. CSA + HCA ── */}
        <h2>{t("3. Innovation 1: Compressed Attention (CSA + HCA)", "3. 创新一：压缩注意力（CSA + HCA）")}</h2>
        <p>
          {t(
            "Standard multi-head attention caches one key and one value vector per head per token. V4 replaces this with a two-level scheme: CSA (Compressed Sparse Attention) for medium-range context, and HCA (Heavily Compressed Attention) for ultra-long-range layers — each with a different learned compression ratio.",
            "标准多头注意力为每个头的每个 token 缓存一个 key 和一个 value 向量。V4 用两级方案替代：CSA（压缩稀疏注意力）用于中距离上下文，HCA（高度压缩注意力）用于超长距离层——每层有不同的学习压缩比。"
          )}
        </p>

        <Math
          display
          label={t("CSA: compressed KV projection (schematic — V4 paper not yet public)", "CSA：压缩 KV 投影（示意图 — V4 论文尚未完全公开）")}
          tex="\tilde{K}_l = W_K^c \cdot X,\quad \tilde{V}_l = W_V^c \cdot X,\quad d_c \ll d_h \cdot n_h"
        />

        <KVCacheViz />

        <Collapsible title={t("CSA vs HCA: when is each used?", "CSA vs HCA：各自何时使用？")}>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[90px_1fr_1fr] gap-2 text-xs">
              <div className="p-2 font-semibold dark:text-slate-300"></div>
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded font-semibold text-blue-800 dark:text-blue-300">CSA</div>
              <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded font-semibold text-purple-800 dark:text-purple-300">HCA</div>
              <div className="p-2 dark:text-slate-400">{t("Purpose", "用途")}</div>
              <div className="p-2 bg-blue-50/50 dark:bg-blue-500/5 rounded dark:text-slate-300">{t("Standard long-context layers", "标准长上下文层")}</div>
              <div className="p-2 bg-purple-50/50 dark:bg-purple-500/5 rounded dark:text-slate-300">{t("Ultra-long-range attention layers", "超长距离注意力层")}</div>
              <div className="p-2 dark:text-slate-400">{t("Compression", "压缩比")}</div>
              <div className="p-2 bg-blue-50/50 dark:bg-blue-500/5 rounded dark:text-slate-300">{t("Moderate", "适中")}</div>
              <div className="p-2 bg-purple-50/50 dark:bg-purple-500/5 rounded dark:text-slate-300">{t("Aggressive", "激进")}</div>
              <div className="p-2 dark:text-slate-400">{t("Trade-off", "权衡")}</div>
              <div className="p-2 bg-blue-50/50 dark:bg-blue-500/5 rounded dark:text-slate-300">{t("Balanced quality / memory", "质量与内存均衡")}</div>
              <div className="p-2 bg-purple-50/50 dark:bg-purple-500/5 rounded dark:text-slate-300">{t("Max memory reduction, minor quality drop", "最大内存减少，少量质量下降")}</div>
            </div>
            <p className="text-paper-800/60 dark:text-slate-400">
              {t("Together: 10× KV cache reduction and 27% single-token FLOPs vs V3.", "合计：KV 缓存减少 10 倍，单 token FLOPs 为 V3 的 27%。")}
            </p>
          </div>
        </Collapsible>

        {/* ── 4. DSA ── */}
        <h2>{t("4. Innovation 2: DeepSeek Sparse Attention (DSA)", "4. 创新二：DeepSeek 稀疏注意力（DSA）")}</h2>
        <p>
          {t(
            "Even after compressing the KV cache, the attention computation itself is still O(L²). DSA adds a second efficiency layer: instead of attending to all L tokens, each query selects only the top-K most relevant tokens via a lightweight Lightning Indexer, reducing attention from O(L²) to O(L·k).",
            "即使压缩了 KV 缓存，注意力计算本身仍是 O(L²)。DSA 增加了第二层效率：每个 query 不是关注所有 L 个 token，而是通过轻量级闪电索引器只选择 top-K 最相关的 token，将注意力复杂度从 O(L²) 降低到 O(L·k)。"
          )}
        </p>

        <div className="grid grid-cols-2 gap-3 my-4 text-sm">
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-3">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">{t("Dense Attention", "稠密注意力")}</p>
            <p className="font-mono text-lg font-bold dark:text-slate-100">O(L²)</p>
            <p className="text-xs text-paper-800/50 dark:text-slate-400">{t("Every query attends to all L tokens", "每个 query 关注所有 L 个 token")}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-3">
            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">{t("DSA (Sparse)", "DSA（稀疏）")}</p>
            <p className="font-mono text-lg font-bold dark:text-slate-100">O(L · k)</p>
            <p className="text-xs text-paper-800/50 dark:text-slate-400">{t("Each query selects top-k relevant tokens", "每个 query 只选 top-k 相关 token")}</p>
          </div>
        </div>

        <p>
          {t(
            "The Lightning Indexer is a small, fast network (FP8 precision, few attention heads) that scores each token's relevance to the query. It runs before the main attention layer and returns the k token indices to attend to. Result: ~1.5× per-layer speedup, ~2× end-to-end GPU cost reduction at 100K+ tokens.",
            "闪电索引器是一个小型快速网络（FP8 精度，少量注意力头），对每个 token 与 query 的相关性进行评分。它在主注意力层之前运行并返回需要关注的 k 个 token 索引。效果：每层约 1.5 倍加速，在 100K+ token 下端到端 GPU 成本降低约 2 倍。"
          )}
        </p>

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("DSA vs CSA/HCA — what's the difference?", "DSA vs CSA/HCA — 有何区别？")}</strong>{" "}
            {t(
              "CSA/HCA reduce memory by compressing the KV representation (fewer bits per token). DSA reduces compute by sparsifying the attention pattern (fewer tokens attended to). They are orthogonal and both applied in V4.",
              "CSA/HCA 通过压缩 KV 表示（每 token 更少位数）减少内存。DSA 通过稀疏化注意力模式（关注更少 token）减少计算。两者正交，V4 中同时应用。"
            )}
          </p>
        </div>

        {/* ── 5. Engram ── */}
        <h2>{t("5. Innovation 3: Engram — Conditional Memory", "5. 创新三：Engram 条件记忆")}</h2>
        <p>
          {t(
            "Transformers store factual knowledge in FFN weights — but this conflates two different tasks: dynamic reasoning (which needs the full network) and static fact retrieval (which is just a lookup). Engram (arXiv 2601.07372) adds a separate O(1) hash-based memory module alongside the FFN.",
            "Transformer 在 FFN 权重中存储事实知识——但这将两种不同任务混为一谈：动态推理（需要完整网络）和静态事实检索（只是查找）。Engram（arXiv 2601.07372）在 FFN 旁边增加了一个独立的 O(1) 哈希记忆模块。"
          )}
        </p>

        <Math
          display
          label={t("Engram memory retrieval (schematic — from arXiv 2601.07372)", "Engram 记忆检索（示意图 — 来自 arXiv 2601.07372）")}
          tex="m(x) = \mathcal{M}[\text{hash}(W_q x)], \quad h' = h + \alpha \cdot m(x)"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm">
            <div className="grid grid-cols-[180px_1fr] gap-y-3 gap-x-3">
              <Math tex="W_q x" />
              <span>{t("Linear query projection — maps hidden state to a low-dimensional lookup key", "线性查询投影 — 将隐藏状态映射为低维查找键")}</span>
              <Math tex="\text{hash}(\cdot)" />
              <span>{t("Locality-sensitive hash — similar queries map to nearby addresses; enables approximate nearest-neighbour retrieval", "局部敏感哈希 — 相似查询映射到相邻地址；实现近似最近邻检索")}</span>
              <Math tex="\mathcal{M}[\cdot]" />
              <span>{t("Static memory table — a large lookup table of knowledge vectors fixed after pre-training", "静态记忆表 — 预训练后固定的大型知识向量查找表")}</span>
              <Math tex="\alpha" />
              <span>{t("Learned blending coefficient — controls how much memory to mix in; optimal allocation is ~20–25% memory vs 75–80% FFN", "学习的融合系数 — 控制混入多少记忆；最优分配约 20–25% 记忆 vs 75–80% FFN")}</span>
            </div>
          </div>
        </Collapsible>

        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-4 my-6">
          <p className="text-sm mb-3 font-semibold text-green-800 dark:text-green-300">
            {t("Needle-in-a-Haystack (NiAH) accuracy at 1M tokens", "百万 token 下大海捞针（NiAH）准确率")}
          </p>
          <div className="flex gap-8 mb-3">
            <div>
              <p className="text-xs text-paper-800/50 dark:text-slate-400">{t("Without Engram", "无 Engram")}</p>
              <div className="flex items-end gap-1">
                <p className="font-mono text-2xl font-bold text-red-600 dark:text-red-400">84.2%</p>
              </div>
            </div>
            <div className="flex items-center text-paper-800/30 dark:text-slate-600 text-2xl">→</div>
            <div>
              <p className="text-xs text-paper-800/50 dark:text-slate-400">{t("With Engram", "有 Engram")}</p>
              <div className="flex items-end gap-1">
                <p className="font-mono text-2xl font-bold text-green-700 dark:text-green-400">97.0%</p>
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">+12.8pp</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-paper-100 dark:bg-slate-700 rounded-full h-2 mb-1">
            <div className="bg-gradient-to-r from-red-400 to-green-500 h-2 rounded-full" style={{ width: "97%" }} />
          </div>
          <p className="text-xs text-paper-800/50 dark:text-slate-400">
            {t("Task: recall a specific fact injected at a random position in a 1M-token document.", "任务：从百万 token 文档的随机位置召回注入的特定事实。")}
          </p>
        </div>

        {/* ── 6. mHC ── */}
        <h2>{t("6. Innovation 4: Manifold-Constrained Hyper-Connections (mHC)", "6. 创新四：流形约束超连接（mHC）")}</h2>
        <p>
          {t(
            "Standard residual connections use a fixed identity skip: h_out = h_in + F(h_in). Hyper-Connections (HC) generalise this with learnable mixing matrices across multiple residual streams. mHC (arXiv 2512.24880) adds a hard constraint: the residual mixer must be a doubly stochastic matrix (Birkhoff polytope), preventing any stream from amplifying signal.",
            "标准残差连接使用固定恒等跳接。超连接（HC）通过跨多条残差流的可学习混合矩阵泛化了这一设计。mHC（arXiv 2512.24880）添加了硬约束：残差混合矩阵必须是双随机矩阵（Birkhoff 多胞体），防止任何流放大信号。"
          )}
        </p>

        <Math
          display
          label={t("mHC layer update (Eq. 1 from arXiv 2512.24880)", "mHC 层更新（arXiv 2512.24880 公式 1）")}
          tex="\mathbf{x}_{l+1} = \mathcal{H}_l^{\mathrm{res}}\mathbf{x}_l + (\mathcal{H}_l^{\mathrm{post}})^\top \mathcal{F}(\mathcal{H}_l^{\mathrm{pre}}\mathbf{x}_l,\, \mathcal{W}_l)"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm">
            <div className="grid grid-cols-[210px_1fr] gap-y-3 gap-x-3">
              <Math tex="\mathbf{x}_l \in \mathbb{R}^{n \times C}" />
              <span>{t("Expanded hidden state — n parallel residual streams of dimension C (n=4 typically)", "扩展隐藏状态 — n 条 C 维并行残差流（n 通常为 4）")}</span>
              <Math tex="\mathcal{H}_l^{\mathrm{res}} \in \mathbb{R}^{n \times n}" />
              <span>{t("Residual stream mixer — routes information between streams; constrained to Birkhoff polytope", "残差流混合矩阵 — 在流之间路由信息；约束在 Birkhoff 多胞体上")}</span>
              <Math tex="\mathcal{H}_l^{\mathrm{pre}},\, \mathcal{H}_l^{\mathrm{post}} \in \mathbb{R}^{1 \times n}" />
              <span>{t("Input/output projections — compress n streams → 1 before layer, expand 1 → n after layer", "输入/输出投影 — 层前将 n 流压缩为 1，层后将 1 展开为 n")}</span>
              <Math tex="\mathcal{F}(\cdot,\, \mathcal{W}_l)" />
              <span>{t("Layer function — attention or FFN with weights W_l", "层函数 — 带权重 W_l 的注意力或 FFN")}</span>
            </div>
          </div>
        </Collapsible>

        <Math
          display
          label={t("Birkhoff polytope constraint (doubly stochastic)", "Birkhoff 多胞体约束（双随机）")}
          tex="\mathcal{H}_l^{\mathrm{res}} \in \left\{M \in \mathbb{R}^{n \times n} \;\middle|\; M\mathbf{1}_n = \mathbf{1}_n,\;\mathbf{1}_n^\top M = \mathbf{1}_n^\top,\; M \geq 0\right\}"
        />

        <Collapsible title={t("How is the constraint enforced? (Sinkhorn-Knopp)", "如何实施约束？（Sinkhorn-Knopp）")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "A doubly stochastic matrix is hard to parameterise directly. mHC uses Sinkhorn-Knopp: start from exp(H̃_res) (guaranteed positive), then alternately normalise rows and columns to sum to 1. This converges in 20 iterations. The key property: spectral norm ‖H_res‖₂ ≤ 1 — no stream can amplify signal.",
                "双随机矩阵难以直接参数化。mHC 使用 Sinkhorn-Knopp：从 exp(H̃_res)（保证为正）出发，交替将行和列归一化为求和等于 1。20 次迭代即可收敛。关键性质：谱范数 ‖H_res‖₂ ≤ 1 — 任何流都无法放大信号。"
              )}
            </p>
            <div className="p-3 bg-paper-100 dark:bg-slate-800 rounded font-mono text-xs space-y-1 dark:text-slate-300">
              <div>M⁽⁰⁾ = exp(H̃_res)  <span className="text-paper-800/40 dark:text-slate-500">← {t("always positive", "始终为正")}</span></div>
              <div>M⁽ᵗ⁾ = row_norm(col_norm(M⁽ᵗ⁻¹⁾))  <span className="text-paper-800/40 dark:text-slate-500">← {t("repeat ×20", "重复 ×20")}</span></div>
              <div>H_res = M⁽²⁰⁾  <span className="text-paper-800/40 dark:text-slate-500">← {t("doubly stochastic", "双随机矩阵")}</span></div>
            </div>
            <p className="text-paper-800/60 dark:text-slate-400">
              {t(
                "Why not just use a Frobenius-norm ball around identity? A norm ball allows entries to become negative or rows to sum ≠ 1 — both dangerous. The Birkhoff polytope gives a tighter, geometrically meaningful constraint.",
                "为什么不用恒等矩阵周围的 Frobenius 范数球？范数球允许元素变为负数或行求和不等于 1 — 两者都很危险。Birkhoff 多胞体给出了更严格、几何意义更明确的约束。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ── 7. Training Details ── */}
        <h2>{t("7. Training Details", "7. 训练细节")}</h2>

        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 mb-4 text-xs text-blue-800 dark:text-blue-300">
          {t(
            "The following specs are sourced from the official HuggingFace model page (deepseek-ai/DeepSeek-V4-Pro) and the paper. Training hardware is not stated in the paper.",
            "以下规格来自官方 HuggingFace 模型页（deepseek-ai/DeepSeek-V4-Pro）及论文。论文中未说明训练硬件。"
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-sm">
          {[
            { label: t("Pre-training tokens", "预训练 token 数"), value: "32T+" },
            { label: t("Total parameters", "总参数量"), value: "1.6T" },
            { label: t("Active parameters", "激活参数量"), value: "49B" },
            { label: t("Context length", "上下文长度"), value: "1M" },
            { label: t("Precision", "精度"), value: "FP4 + FP8" },
            { label: t("License", "协议"), value: "MIT" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg p-3">
              <p className="text-xs text-paper-800/50 dark:text-slate-400 mb-1">{label}</p>
              <p className="font-mono font-bold text-base dark:text-slate-100">{value}</p>
            </div>
          ))}
        </div>

        <p>
          {t(
            "Precision: MoE expert parameters use FP4; most other parameters use FP8. Post-training follows a two-stage paradigm: Stage 1 cultivates domain-specific experts via SFT and RL with GRPO; Stage 2 consolidates them into a unified model through on-policy distillation.",
            "精度：MoE 专家参数使用 FP4；其他大多数参数使用 FP8。后训练采用两阶段范式：阶段 1 通过 SFT 和 GRPO 强化学习培育领域专家；阶段 2 通过在线策略蒸馏将其整合为统一模型。"
          )}
        </p>

        <p>
          {t(
            "V4 supports three reasoning modes: Non-Think (fast responses), Think High (deliberate reasoning), and Think Max (maximum reasoning effort, requires ≥384K context).",
            "V4 支持三种推理模式：Non-Think（快速响应）、Think High（深思熟虑）、Think Max（最大推理强度，需要 ≥384K 上下文）。"
          )}
        </p>

        {/* ── 8. Muon Optimizer ── */}
        <h2>{t("8. Training Algorithm: Muon Optimizer", "8. 训练算法：Muon 优化器")}</h2>
        <p>
          {t(
            "V4 uses the Muon optimizer in place of Adam. The key difference: instead of tracking per-parameter gradient magnitudes, Muon applies a Newton-Schulz orthogonalisation to the gradient matrix, producing updates with a consistent spectral norm regardless of gradient scale. This improves training stability at 1.6T-parameter scale.",
            "V4 使用 Muon 优化器代替 Adam。核心区别：Muon 对梯度矩阵应用 Newton-Schulz 正交化，而非追踪逐参数梯度幅度，从而产生具有一致谱范数的更新，与梯度大小无关。这提高了 1.6T 参数规模下的训练稳定性。"
          )}
        </p>

        <MuonOptimizerViz />

        {/* ── 9. V4-Pro vs V4-Flash ── */}
        <h2>{t("9. V4-Pro vs V4-Flash", "9. V4-Pro vs V4-Flash")}</h2>
        <p>
          {t(
            "DeepSeek released two V4 variants alongside each other. V4-Flash is a smaller model optimised for throughput and latency; V4-Pro is the flagship. Both share the 1M context window and all architectural innovations. Specs below are from the official HuggingFace model pages.",
            "DeepSeek 同时发布了两个 V4 变体。V4-Flash 是面向吞吐量和延迟优化的小型模型；V4-Pro 是旗舰版。两者共享百万 token 上下文和所有架构创新。以下规格来自官方 HuggingFace 模型页。"
          )}
        </p>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-slate-700 text-left">
                <th className="p-2.5 dark:text-slate-200">{t("Spec", "规格")}</th>
                <th className="p-2.5 text-center text-blue-700 dark:text-blue-400">V4-Pro</th>
                <th className="p-2.5 text-center text-teal-700 dark:text-teal-400">V4-Flash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-100 dark:divide-slate-700">
              {[
                [t("Total params", "总参数"), "1.6T", "284B"],
                [t("Active params", "激活参数"), "49B", "13B"],
                [t("Context length", "上下文长度"), "1M", "1M"],
                [t("Precision", "精度"), "FP4 + FP8", "FP4 + FP8"],
                [t("License", "协议"), "MIT", "MIT"],
                ["LiveCodeBench Max (Pass@1)", "93.5", "91.6"],
                ["Codeforces Max (Rating)", "3206", "3052"],
                ["SWE Verified Max (Resolved)", "80.6%", "79.0%"],
                ["SWE Verified Non-Think", "73.6%", "73.7%"],
                ["MMLU-Pro Max (EM)", "87.5", "86.2"],
                ["GPQA Diamond Max (Pass@1)", "90.1", "88.1"],
                ["HLE Max (Pass@1)", "37.7", "34.8"],
                ["MRCR 1M Max (MMR)", "83.5", "78.7"],
              ].map(([spec, pro, flash]) => (
                <tr key={String(spec)} className="hover:bg-paper-50 dark:hover:bg-slate-800/50">
                  <td className="p-2 text-paper-800/70 dark:text-slate-400">{spec}</td>
                  <td className="p-2 text-center font-mono font-medium dark:text-slate-200">{pro}</td>
                  <td className="p-2 text-center font-mono text-paper-800/70 dark:text-slate-400">{flash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-paper-800/40 dark:text-slate-500">
          {t(
            "Source: official HuggingFace READMEs for DeepSeek-V4-Pro and DeepSeek-V4-Flash. Training hardware is not stated in either README or the paper.",
            "来源：DeepSeek-V4-Pro 和 DeepSeek-V4-Flash 官方 HuggingFace README。论文和 README 均未说明训练硬件。"
          )}
        </p>

        {/* ── 10. Key Results ── */}
        <h2>{t("10. Key Results", "10. 关键实验结果")}</h2>

        {/* Official benchmark figure from HuggingFace assets */}
        <img
          src="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/resolve/main/assets/dsv4_performance.png"
          alt="DeepSeek-V4-Pro-Max benchmark comparison: SimpleQA Verified, HLE, Apex Shortlist, Codeforces, SWE Verified, Terminal Bench 2.0, Toolathlon"
          className="w-full rounded-lg my-4 border border-paper-200 dark:border-slate-700"
        />
        <p className="text-xs text-paper-800/50 dark:text-slate-500 text-center -mt-2 mb-6">
          {t(
            "Figure from official HuggingFace model page — DeepSeek-V4-Pro-Max vs Claude Opus 4.6 Max, GPT-5.4 xHigh, Gemini-3.1-Pro High across Knowledge & Reasoning and Agentic benchmarks.",
            "来自官方 HuggingFace 模型页的图表——DeepSeek-V4-Pro-Max vs Claude Opus 4.6 Max、GPT-5.4 xHigh、Gemini-3.1-Pro High 在知识推理与智能体能力基准上的对比。"
          )}
        </p>

        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 mb-4 text-xs text-blue-800 dark:text-blue-300">
          {t(
            "All benchmark numbers below are from the official README (huggingface.co/deepseek-ai/DeepSeek-V4-Pro), which mirrors the tables in the technical report. V4-Pro Max = maximum Think mode.",
            "以下所有基准测试数字来自官方 README（huggingface.co/deepseek-ai/DeepSeek-V4-Pro），与技术报告中的表格一致。V4-Pro Max = 最大 Think 模式。"
          )}
        </div>

        {/* Efficiency callout — from paper Figure 1 */}
        <div className="grid grid-cols-2 gap-3 my-4 text-center">
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-4">
            <p className="font-mono text-3xl font-bold text-green-700 dark:text-green-400">27%</p>
            <p className="text-xs text-paper-800/60 dark:text-slate-400 mt-1">{t("single-token inference FLOPs vs V3.2", "单 token 推理 FLOPs（相比 V3.2）")}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-4">
            <p className="font-mono text-3xl font-bold text-green-700 dark:text-green-400">10%</p>
            <p className="text-xs text-paper-800/60 dark:text-slate-400 mt-1">{t("KV cache size at 1M context vs V3.2", "百万 token 上下文 KV 缓存（相比 V3.2）")}</p>
          </div>
        </div>
        <p className="text-xs text-paper-800/40 dark:text-slate-500 -mt-2 mb-4">{t("Source: paper Figure 1 (right panel).", "来源：论文图 1（右图）。")}</p>

        {/* Coding benchmarks — official README */}
        <div className="overflow-x-auto my-4">
          <p className="text-xs font-semibold text-paper-800/60 dark:text-slate-400 mb-2">{t("Coding & Math (V4-Pro Max vs frontier, from README)", "代码与数学（V4-Pro Max vs 前沿模型，来自 README）")}</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-slate-700 text-left">
                <th className="p-2 dark:text-slate-200">{t("Benchmark", "基准")}</th>
                <th className="p-2 text-right dark:text-slate-200">V4-Pro Max</th>
                <th className="p-2 text-right text-paper-800/50 dark:text-slate-400">Claude Opus 4.6</th>
                <th className="p-2 text-right text-paper-800/50 dark:text-slate-400">GPT-5.4</th>
                <th className="p-2 text-right text-paper-800/50 dark:text-slate-400">Gemini-3.1-Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-100 dark:divide-slate-800">
              {[
                ["LiveCodeBench (Pass@1)", "93.5 ★", "88.8", "—", "91.7"],
                ["Codeforces (Rating)", "3206 ★", "—", "3168", "3052"],
                ["SWE Verified (Resolved)", "80.6", "80.8 ★", "—", "80.6"],
                ["IMOAnswerBench (Pass@1)", "89.8", "75.3", "91.4 ★", "81.0"],
                ["HMMT 2026 Feb (Pass@1)", "95.2", "96.2", "97.7 ★", "94.7"],
                ["Apex Shortlist (Pass@1)", "90.2 ★", "85.9", "78.1", "89.1"],
                ["MMLU-Pro (EM)", "87.5", "89.1", "87.5", "91.0 ★"],
                ["GPQA Diamond (Pass@1)", "90.1", "91.3", "93.0", "94.3 ★"],
              ].map(([bench, v4, claude, gpt, gem]) => (
                <tr key={String(bench)} className="hover:bg-paper-50 dark:hover:bg-slate-800/50">
                  <td className="p-2 dark:text-slate-300">{bench}</td>
                  <td className="p-2 text-right font-mono font-bold text-green-700 dark:text-green-400">{v4}</td>
                  <td className="p-2 text-right font-mono text-paper-800/60 dark:text-slate-400">{claude}</td>
                  <td className="p-2 text-right font-mono text-paper-800/60 dark:text-slate-400">{gpt}</td>
                  <td className="p-2 text-right font-mono text-paper-800/60 dark:text-slate-400">{gem}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-paper-800/40 dark:text-slate-500 mt-1">★ = best in row. {t("Source: official README, DeepSeek-V4-Pro HuggingFace page.", "来源：官方 README，DeepSeek-V4-Pro HuggingFace 页面。")}</p>
        </div>

        {/* ── 11. Why It Matters ── */}
        <h2>{t("11. Why It Matters", "11. 为什么重要")}</h2>
        <div className="space-y-3 my-4">
          {[
            {
              title: t("Efficiency: frontier quality at a fraction of the inference cost", "效率：以极低推理成本实现前沿质量"),
              body: t("27% inference FLOPs and 10% KV cache vs DeepSeek-V3.2 at equivalent quality is a significant systems engineering advance. It enables true 1M-token serving — full codebases, book-length documents — at deployable cost.", "相比 DeepSeek-V3.2，在同等质量下仅需 27% 推理 FLOPs 和 10% KV 缓存，是重大系统工程进步。它使真正的百万 token 服务成为可能——完整代码库、书籍长度文档——以可部署的成本实现。"),
            },
            {
              title: t("Technical: 10× KV cache at frontier quality", "技术：前沿质量下 KV 缓存减少 10 倍"),
              body: t("CSA/HCA/DSA achieving a 10× KV cache and 2× long-context compute reduction at equivalent or better quality is a major systems engineering advance. It enables genuine 1M-token serving — full codebases, book-length documents, multi-session memory — at deployable cost.", "CSA/HCA/DSA 在同等或更高质量下实现 10 倍 KV 缓存和 2 倍长上下文计算减少，是重大系统工程进步。它以可部署的成本实现真正的百万 token 服务——完整代码库、书籍长度文档、多轮会话记忆。"),
            },
            {
              title: t("Architectural: Engram as a new primitive", "架构：Engram 作为新的基础原语"),
              body: t("Separating static knowledge lookup from dynamic FFN computation is a conceptual advance that could become a standard LLM component — analogous to how MoE evolved from a niche technique to a universal practice. If Engram generalises, all frontier models may adopt it.", "将静态知识查找与动态 FFN 计算分离是一个概念性进步，可能成为 LLM 的标准组件——类似于 MoE 从小众技术演变为普遍实践。如果 Engram 具有普适性，所有前沿模型都可能采用它。"),
            },
            {
              title: t("Open: Apache 2.0, 1.6T weights public", "开放：Apache 2.0，1.6T 权重公开"),
              body: t("Releasing a 1.6T-parameter frontier model under MIT license puts extreme capability in the hands of the research community. The full model weights (865 GB across 64 SafeTensors files) are publicly available on HuggingFace.", "以 MIT 协议发布 1.6T 参数前沿模型，将极强的能力交到研究社区手中。完整模型权重（64 个 SafeTensors 文件，共 865 GB）在 HuggingFace 公开可用。"),
            },
          ].map(({ title, body }) => (
            <div key={String(title)} className="bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 dark:text-slate-100">{title}</h4>
              <p className="text-sm text-paper-800/70 dark:text-slate-400">{body}</p>
            </div>
          ))}
        </div>

        {/* ── 11. Related Papers ── */}
        <h2>{t("11. Related Papers", "11. 相关论文")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            {
              slug: "grpo",
              title: "GRPO",
              body: t("DeepSeek's RL algorithm used in V4 post-training — group-relative rewards, no separate critic network.", "V4 后训练所用的 DeepSeek RL 算法 — 组相对奖励，无独立 critic 网络。"),
            },
            {
              slug: "attention-is-all-you-need",
              title: "Attention Is All You Need",
              body: t("The Transformer CSA/HCA/DSA all build on. V4's compressed attention is a direct extension of scaled dot-product attention.", "CSA/HCA/DSA 都基于的 Transformer。V4 的压缩注意力是缩放点积注意力的直接扩展。"),
            },
            {
              slug: "flashattention",
              title: "FlashAttention",
              body: t("IO-aware attention kernel that V4's sparse patterns rely on — tiling and kernel fusion are prerequisites for efficient sparse attention at scale.", "V4 稀疏模式所依赖的 IO 感知注意力内核——分块和内核融合是大规模高效稀疏注意力的先决条件。"),
            },
            {
              slug: "scaling-laws",
              title: "Scaling Laws",
              body: t("Motivated V4's 32T+ token pre-training budget for a 1.6T-parameter model — Chinchilla-style optimal compute allocation.", "激励 V4 对 1.6T 参数模型使用 32T+ token 预训练预算——Chinchilla 风格的最优计算分配。"),
            },
          ].map(({ slug, title, body }) => (
            <div key={slug} className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg">
              <Link href={`/papers/${slug}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                {title}
              </Link>
              <p className="text-sm text-paper-800/70 dark:text-slate-400 mt-1">{body}</p>
            </div>
          ))}
        </div>

        {/* ── 12. Resources ── */}
        <h2>{t("12. Additional Resources", "12. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          {[
            {
              href: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf",
              title: t("DeepSeek-V4 Technical Report (PDF)", "DeepSeek-V4 技术报告（PDF）"),
              sub: "HuggingFace",
            },
            {
              href: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash",
              title: t("DeepSeek-V4-Flash Model Page", "DeepSeek-V4-Flash 模型页面"),
              sub: "HuggingFace",
            },
            {
              href: "https://github.com/deepseek-ai/Engram",
              title: t("Engram GitHub Repository", "Engram GitHub 仓库"),
              sub: t("Conditional Memory via Scalable Lookup", "通过可扩展查找实现条件记忆"),
            },
            {
              href: "https://arxiv.org/abs/2601.07372",
              title: "Engram arXiv 2601.07372",
              sub: t("Formal paper on conditional memory", "条件记忆正式论文"),
            },
            {
              href: "https://arxiv.org/abs/2512.24880",
              title: "mHC arXiv 2512.24880",
              sub: t("Manifold-Constrained Hyper-Connections", "流形约束超连接"),
            },
            {
              href: "https://arxiv.org/abs/2512.02556",
              title: "DeepSeek-V3 arXiv 2512.02556",
              sub: t("V4's predecessor — MoE load balancing, multi-token prediction", "V4 的前身 — MoE 负载均衡、多 token 预测"),
            },
          ].map(({ href, title, sub }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
            >
              <span className="text-sm font-medium dark:text-slate-100">{title}</span>
              <span className="text-xs text-paper-800/50 dark:text-slate-400 ml-2">{sub}</span>
            </a>
          ))}
        </div>

      </article>
    </div>
  );
}
