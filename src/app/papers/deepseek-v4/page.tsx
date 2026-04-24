"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
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
            Technical Report (HuggingFace)
          </a>
        </p>
      </header>

      <article className="paper-content">

        {/* ── TL;DR ── */}
        <section className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "DeepSeek-V4-Pro is a 1.6T-parameter MoE model (49B active) with three key architectural innovations: (1) Compressed Sparse Attention (CSA/HCA) that cuts KV cache to just 10% of V3's; (2) Engram conditional memory achieving 97% Needle-in-a-Haystack accuracy at 1M tokens; and (3) Manifold-Constrained Hyper-Connections (mHC) for stable trillion-scale training. Trained on 33T tokens, it reaches ~81% on SWE-bench Verified and runs entirely on Huawei Ascend chips.",
              "DeepSeek-V4-Pro 是 1.6T 参数 MoE 模型（49B 激活），具备三项关键架构创新：(1) 压缩稀疏注意力（CSA/HCA），KV 缓存仅为 V3 的 10%；(2) Engram 条件记忆，在百万 token 规模下达到 97% NiAH 准确率；(3) 流形约束超连接（mHC），支持万亿级参数的稳定训练。在 33T token 上训练，SWE-bench Verified 达 ~81%，完全运行于华为昇腾芯片。"
            )}
          </p>
        </section>

        {/* ── FlowChart ── */}
        <FlowChart
          title={t("DeepSeek Architecture Evolution", "DeepSeek 架构演进")}
          steps={[
            {
              title: t("DeepSeek-V2 (2024)", "DeepSeek-V2（2024）"),
              subtitle: t("MLA + MoE — introduced Multi-head Latent Attention to compress KV cache", "MLA + MoE — 引入多头潜在注意力压缩 KV 缓存"),
              color: "rose",
            },
            {
              title: t("DeepSeek-V3 (2025)", "DeepSeek-V3（2025）"),
              subtitle: t("671B MoE — auxiliary-loss-free load balancing, multi-token prediction", "671B MoE — 无辅助损失的负载均衡，多 token 预测"),
              color: "amber",
            },
            {
              title: t("V4 Innovation 1: CSA + HCA", "V4 创新 1: CSA + HCA"),
              subtitle: t("Hybrid compressed attention — 10% KV cache, 27% FLOPs vs V3", "混合压缩注意力 — 10% KV 缓存，27% FLOPs（相比 V3）"),
              color: "blue",
            },
            {
              title: t("V4 Innovation 2: Engram Memory", "V4 创新 2: Engram 记忆"),
              subtitle: t("O(1) hash-based static knowledge lookup — 97% NiAH at 1M tokens", "O(1) 哈希静态知识查找 — 百万 token 下 97% NiAH 准确率"),
              color: "teal",
            },
            {
              title: t("V4 Innovation 3: mHC", "V4 创新 3: mHC"),
              subtitle: t("Manifold-constrained residual connections enable stable 1.6T training", "流形约束残差连接支持稳定的 1.6T 规模训练"),
              color: "green",
            },
            {
              title: t("DeepSeek-V4-Pro (2026)", "DeepSeek-V4-Pro（2026）"),
              subtitle: t("1.6T params / 49B active · 1M context · 33T tokens · ~81% SWE-bench", "1.6T 参数 / 49B 激活 · 百万上下文 · 33T token · ~81% SWE-bench"),
              color: "purple",
            },
          ]}
          arrows={[
            t("Scales up", "规模扩大"),
            t("V4 builds on", "V4 基础"),
            t("+", "+"),
            t("+", "+"),
            t("Assembled as", "组合为"),
          ]}
          highlights={[
            { text: t("Only 3% of params active per token", "每 token 仅激活 3% 参数"), color: "green" },
            { text: t("10% KV cache vs V3", "KV 缓存仅为 V3 的 10%"), color: "blue" },
            { text: t("No Nvidia GPUs", "无需 Nvidia GPU"), color: "purple" },
          ]}
        />

        {/* ── 1. Background ── */}
        <h2>{t("1. Background: The Cost of Scale", "1. 背景：规模化的代价")}</h2>
        <p>
          {t(
            "Frontier LLMs face two fundamental scaling bottlenecks. First, compute: dense transformers scale quadratically with sequence length, making 1M-token context impractical. Second, memory: the KV cache for long sequences consumes enormous GPU memory, bottlenecking batch size and throughput.",
            "前沿大语言模型面临两个基本扩展瓶颈。第一是计算：稠密 Transformer 的计算量随序列长度二次增长，使百万 token 上下文不可行。第二是内存：长序列的 KV 缓存消耗大量 GPU 显存，限制 batch size 和吞吐量。"
          )}
        </p>
        <p>
          {t(
            "DeepSeek-V3 partially addressed these with MoE routing and MLA (Multi-head Latent Attention). V4 goes further — redesigning both the attention mechanism and the knowledge storage strategy from scratch, and adding a new type of residual connection to make trillion-scale training stable.",
            "DeepSeek-V3 通过 MoE 路由和 MLA（多头潜在注意力）部分解决了这些问题。V4 更进一步——从头重新设计了注意力机制和知识存储策略，并引入新型残差连接以使万亿参数规模的训练稳定可行。"
          )}
        </p>

        {/* ── 2. MoE at 1.6T Scale ── */}
        <h2>{t("2. MoE Architecture: 1.6T Parameters, 49B Active", "2. MoE 架构：1.6T 参数，49B 激活")}</h2>
        <p>
          {t(
            "V4-Pro uses Mixture-of-Experts to keep per-token compute feasible despite the enormous total parameter count. Each token activates only the top-K expert FFN layers, leaving the rest idle. At 1.6T total / 49B active, V4 activates roughly 3% of its weights per forward pass.",
            "V4-Pro 使用混合专家机制，尽管总参数量庞大，但每 token 的计算量保持可控。每个 token 只激活 top-K 个专家 FFN 层，其余保持休眠。1.6T 总参数 / 49B 激活，V4 每次前向传播激活约 3% 的权重。"
          )}
        </p>

        <Math
          display
          label={t("MoE routing: output is a weighted sum of selected experts", "MoE 路由：输出是选中专家的加权求和")}
          tex="\text{MoE}(x) = \sum_{i \in \text{Top-K}(x)} g_i(x) \cdot E_i(x)"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm">
            <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-3">
              <Math tex="x" />
              <span>{t("Input token hidden state", "输入 token 的隐藏状态")}</span>
              <Math tex="\text{Top-K}(x)" />
              <span>{t("Indices of the K experts with highest routing scores for this token", "当前 token 路由分数最高的 K 个专家的索引")}</span>
              <Math tex="g_i(x)" />
              <span>{t("Gating weight for expert i — softmax over routing scores, re-normalized to selected experts", "专家 i 的门控权重 — 对路由分数 softmax 后归一化至选中专家")}</span>
              <Math tex="E_i(x)" />
              <span>{t("Output of expert i (typically a 2-layer FFN)", "专家 i 的输出（通常是 2 层 FFN）")}</span>
            </div>
          </div>
        </Collapsible>

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Why not just train a dense 49B model?", "为什么不直接训练一个稠密 49B 模型？")}</strong>{" "}
            {t(
              "MoE gives you the capacity of 1.6T parameters (long-tail knowledge, rare languages, specialized skills) with the inference cost of 49B. Think of it as a huge library where you only consult the relevant specialist for each question.",
              "MoE 赋予你 1.6T 参数的容量（长尾知识、小语种、专业技能），但推理成本仅为 49B 模型。可以理解为一个巨大的图书馆，每个问题只咨询相关专家。"
            )}
          </p>
        </div>

        {/* ── 3. Innovation 1: CSA + HCA ── */}
        <h2>{t("3. Innovation 1: Compressed Sparse Attention (CSA + HCA)", "3. 创新一：压缩稀疏注意力（CSA + HCA）")}</h2>
        <p>
          {t(
            "Standard multi-head attention stores a key and value vector for every token in the context window. At 1M tokens this KV cache alone can exceed 100 GB. V4 replaces standard attention with a two-tier compression scheme:",
            "标准多头注意力为上下文窗口中的每个 token 存储一个 key 和 value 向量。在百万 token 场景下，KV 缓存本身就可能超过 100 GB。V4 用两级压缩方案替代了标准注意力："
          )}
        </p>
        <ul>
          <li>
            <strong>{t("CSA (Compressed Sparse Attention)", "CSA（压缩稀疏注意力）")}</strong>
            {t(
              " — groups query heads that share the same compressed KV heads, similar to Grouped-Query Attention but with a learned compression ratio optimized per layer.",
              " — 将共享同一压缩 KV 头的 query 头分组，类似分组查询注意力，但学习了每层的最优压缩比。"
            )}
          </li>
          <li>
            <strong>{t("HCA (Heavily Compressed Attention)", "HCA（高度压缩注意力）")}</strong>
            {t(
              " — applied to layers handling very long-range context, pushes compression further, trading some expressivity for dramatic memory savings.",
              " — 用于处理超长距离上下文的层，进一步提升压缩比，以少量表达能力换取大幅节省内存。"
            )}
          </li>
        </ul>

        <Math
          display
          label={t("Compressed KV projection (CSA)", "压缩 KV 投影（CSA）")}
          tex="\tilde{K} = W_K^c \cdot X, \quad \tilde{V} = W_V^c \cdot X, \quad \tilde{K} \in \mathbb{R}^{n \times d_c}"
        />

        <Collapsible title={t("Concrete numbers: V3 vs V4 attention cost", "具体数字：V3 vs V4 注意力开销")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>{t("At 1M-token context with batch size 1:", "在 100 万 token 上下文、batch size 为 1 时：")}</p>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 bg-paper-100 dark:bg-slate-800 rounded font-semibold">{t("Metric", "指标")}</div>
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded font-semibold">V3</div>
              <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded font-semibold">V4-Pro</div>
              <div className="p-2 bg-paper-100 dark:bg-slate-800 rounded">{t("KV cache size", "KV 缓存大小")}</div>
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded">100%</div>
              <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded text-green-700 dark:text-green-400 font-bold">10%</div>
              <div className="p-2 bg-paper-100 dark:bg-slate-800 rounded">{t("Single-token FLOPs", "单 token FLOPs")}</div>
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded">100%</div>
              <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded text-green-700 dark:text-green-400 font-bold">27%</div>
            </div>
            <p className="text-paper-800/60 dark:text-slate-400">
              {t("10× KV cache reduction means V4 can serve 10× longer contexts (or 10× larger batches) at the same GPU memory budget as V3.", "KV 缓存减少 10 倍意味着在相同 GPU 显存预算下，V4 可以处理 10 倍更长的上下文（或 10 倍更大的 batch）。")}
            </p>
          </div>
        </Collapsible>

        {/* ── 4. Innovation 2: Engram ── */}
        <h2>{t("4. Innovation 2: Engram — Conditional Memory", "4. 创新二：Engram 条件记忆")}</h2>
        <p>
          {t(
            "Transformers learn to store factual knowledge in their FFN weights — but this is inefficient: the same weight matrices are used for both reasoning (dynamic) and knowledge retrieval (static). Engram separates these two roles.",
            "Transformer 将事实知识存储在 FFN 权重中——但这很低效：相同的权重矩阵同时用于推理（动态）和知识检索（静态）。Engram 将这两种角色分离。"
          )}
        </p>
        <p>
          {t(
            "Engram adds a lightweight hash-based memory module alongside (not replacing) the FFN. Given a hidden state, a hash function maps it to a memory address, retrieves a stored knowledge vector in O(1) time, and blends it back into the hidden state. This decouples factual recall from inference reasoning.",
            "Engram 在 FFN 旁边（而非替换）增加了一个轻量级哈希记忆模块。给定隐藏状态，哈希函数将其映射到内存地址，以 O(1) 时间检索存储的知识向量，并将其融合回隐藏状态。这将事实回忆与推理解耦。"
          )}
        </p>

        <Math
          display
          label={t("Engram memory retrieval", "Engram 记忆检索")}
          tex="m(x) = \mathcal{M}[\text{hash}(W_q x)], \quad h' = h + \alpha \cdot m(x)"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm">
            <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-3">
              <Math tex="x" />
              <span>{t("Input hidden state at the current layer", "当前层的输入隐藏状态")}</span>
              <Math tex="W_q x" />
              <span>{t("Linear query projection — maps hidden state to a low-dimensional query", "线性查询投影 — 将隐藏状态映射到低维查询向量")}</span>
              <Math tex="\text{hash}(\cdot)" />
              <span>{t("Locality-sensitive hash — maps similar queries to nearby addresses for approximate nearest-neighbor lookup", "局部敏感哈希 — 将相似查询映射到相邻地址，实现近似最近邻查找")}</span>
              <Math tex="\mathcal{M}" />
              <span>{t("Static memory table — a large lookup table of knowledge vectors, fixed after pre-training", "静态记忆表 — 预训练后固定的大型知识向量查找表")}</span>
              <Math tex="\alpha" />
              <span>{t("Learned blending coefficient — how much memory to mix in (typically 0.2–0.4)", "学习的融合系数 — 混入多少记忆（通常 0.2–0.4）")}</span>
            </div>
          </div>
        </Collapsible>

        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-4 my-6">
          <p className="text-sm mb-1 font-semibold text-green-800 dark:text-green-300">{t("Needle-in-a-Haystack results at 1M tokens", "百万 token 下大海捞针结果")}</p>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-paper-800/50 dark:text-slate-400">{t("Without Engram", "无 Engram")}</span>
              <p className="font-mono text-lg font-bold text-red-600 dark:text-red-400">84.2%</p>
            </div>
            <div>
              <span className="text-paper-800/50 dark:text-slate-400">{t("With Engram", "有 Engram")}</span>
              <p className="font-mono text-lg font-bold text-green-700 dark:text-green-400">97.0%</p>
            </div>
          </div>
          <p className="text-xs text-paper-800/50 dark:text-slate-400 mt-2">
            {t("Needle-in-a-Haystack (NiAH): recall a fact injected at a random position in a 1M-token document.", "大海捞针（NiAH）：从百万 token 文档的随机位置召回注入的事实。")}
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("The 20/80 rule for memory allocation", "记忆分配的 20/80 法则")}</strong>{" "}
            {t(
              "DeepSeek's experiments found an optimal allocation of ~20–25% of layer capacity to Engram memory and ~75–80% to standard MoE FFN computation. Too much memory capacity cannibalizes reasoning; too little fails to improve recall.",
              "DeepSeek 实验发现最优分配为约 20–25% 的层容量用于 Engram 记忆，约 75–80% 用于标准 MoE FFN 计算。记忆容量太多会蚕食推理能力；太少则无法改善召回。"
            )}
          </p>
        </div>

        {/* ── 5. Innovation 3: mHC ── */}
        <h2>{t("5. Innovation 3: Manifold-Constrained Hyper-Connections (mHC)", "5. 创新三：流形约束超连接（mHC）")}</h2>
        <p>
          {t(
            "Standard residual connections add the layer input directly to its output: h_l = h_{l-1} + F_l(h_{l-1}). At 1.6T parameters and hundreds of layers, this simple addition can cause gradient instability — small perturbations compound across layers, leading to divergence or rank collapse.",
            "标准残差连接直接将层输入加到输出：h_l = h_{l-1} + F_l(h_{l-1})。在 1.6T 参数和数百层的规模下，这种简单相加可能导致梯度不稳定——小扰动跨层累积，导致训练发散或秩崩塌。"
          )}
        </p>
        <p>
          {t(
            "mHC replaces the fixed identity skip-connection with a learnable, manifold-constrained transformation. The constraint keeps the connection matrix close to identity (preserving signal) while allowing controlled deviation (improving expressivity).",
            "mHC 将固定的恒等跳接替换为可学习的流形约束变换。该约束使连接矩阵保持接近恒等（保留信号），同时允许受控偏差（提升表达能力）。"
          )}
        </p>

        <Math
          display
          label={t("mHC residual connection", "mHC 残差连接")}
          tex="h_l = M_l \cdot h_{l-1} + F_l(h_{l-1}), \quad M_l \approx I, \quad \|M_l - I\|_F \leq \epsilon"
        />

        <Collapsible title={t("Why the manifold constraint matters", "为什么流形约束很重要")}>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "Without the constraint ‖M_l − I‖_F ≤ ε, the residual matrix M_l could learn to dramatically amplify or suppress signal. Across 100+ layers this causes:",
                "没有约束 ‖M_l − I‖_F ≤ ε，残差矩阵 M_l 可能学会大幅放大或抑制信号。跨 100+ 层这会导致："
              )}
            </p>
            <ul>
              <li>{t("Gradient explosion in early training", "早期训练中的梯度爆炸")}</li>
              <li>{t("Representation collapse — all hidden states converging to similar vectors", "表示崩塌——所有隐藏状态收敛到相似向量")}</li>
            </ul>
            <p>
              {t(
                "The Frobenius-norm constraint keeps M_l on a manifold near identity, giving expressivity gains while bounding instability. This was the key enabler for training stability at 1.6T scale.",
                "Frobenius 范数约束使 M_l 保持在恒等矩阵附近的流形上，在获得表达能力提升的同时限制不稳定性。这是实现 1.6T 规模训练稳定性的关键。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ── 6. Training ── */}
        <h2>{t("6. Training Details", "6. 训练细节")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-sm">
          {[
            { label: t("Training tokens", "训练 token 数"), value: "33T" },
            { label: t("Total parameters", "总参数量"), value: "1.6T" },
            { label: t("Active parameters", "激活参数量"), value: "49B" },
            { label: t("Context length", "上下文长度"), value: "1M" },
            { label: t("Max output", "最大输出"), value: "384K" },
            { label: t("Training hardware", "训练硬件"), value: "Huawei Ascend 950PR" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg p-3">
              <p className="text-xs text-paper-800/50 dark:text-slate-400 mb-1">{label}</p>
              <p className="font-mono font-bold text-base dark:text-slate-100">{value}</p>
            </div>
          ))}
        </div>
        <p>
          {t(
            "V4 is trained entirely on Huawei Ascend 950PR chips — no Nvidia hardware. This is a deliberate response to US export controls, and proves that frontier AI is achievable without American GPU supply chains. The training pipeline incorporates multi-token prediction (from V3) and a comprehensive post-training stage including SFT and RLHF.",
            "V4 完全在华为昇腾 950PR 芯片上训练——不使用 Nvidia 硬件。这是对美国出口管制的有意回应，证明了在没有美国 GPU 供应链的情况下也能实现前沿 AI。训练流程融合了多 token 预测（来自 V3）以及包含 SFT 和 RLHF 的完整后训练阶段。"
          )}
        </p>

        {/* ── 7. Key Results ── */}
        <h2>{t("7. Key Results", "7. 关键实验结果")}</h2>
        <div className="space-y-3 my-4">
          <div className="bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-3 dark:text-slate-100">{t("SWE-bench Verified (Software Engineering)", "SWE-bench Verified（软件工程）")}</h4>
            <div className="space-y-2 text-sm">
              {[
                { model: "DeepSeek-V4-Pro", score: "80.6%", highlight: true },
                { model: "Claude Opus 4.6", score: "80.8%" },
                { model: "Gemini 2.5 Pro", score: "80.6%" },
                { model: "DeepSeek-V3", score: "~49%" },
              ].map(({ model, score, highlight }) => (
                <div key={model} className={`flex justify-between items-center p-2 rounded ${highlight ? "bg-green-50 dark:bg-green-500/10 font-semibold" : "bg-paper-50 dark:bg-slate-900"}`}>
                  <span className="dark:text-slate-200">{model}</span>
                  <span className={`font-mono ${highlight ? "text-green-700 dark:text-green-400" : "text-paper-800/70 dark:text-slate-400"}`}>{score}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-3 dark:text-slate-100">{t("Math Reasoning", "数学推理")}</h4>
            <div className="space-y-2 text-sm">
              {[
                { bench: "IMOAnswerBench", v4: "89.8", gpt: "91.4", claude: "75.3" },
                { bench: "HMMT 2026", v4: "95.2", gpt: "97.7", claude: "96.2" },
              ].map(({ bench, v4, gpt, claude }) => (
                <div key={bench} className="p-3 bg-paper-50 dark:bg-slate-900 rounded">
                  <p className="font-medium text-xs mb-2 dark:text-slate-300">{bench}</p>
                  <div className="flex gap-4 text-xs font-mono">
                    <span className="text-green-700 dark:text-green-400">V4: {v4}</span>
                    <span className="text-paper-800/50 dark:text-slate-400">GPT: {gpt}</span>
                    <span className="text-paper-800/50 dark:text-slate-400">Claude: {claude}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 8. Why It Matters ── */}
        <h2>{t("8. Why It Matters", "8. 为什么重要")}</h2>
        <div className="space-y-3 my-4">
          <div className="bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 dark:text-slate-100">
              {t("Geopolitical signal: frontier AI without Nvidia", "地缘政治信号：无 Nvidia 的前沿 AI")}
            </h4>
            <p className="text-sm text-paper-800/70 dark:text-slate-400">
              {t(
                "Training and running a 1.6T-parameter frontier model entirely on Huawei chips demonstrates that US export controls on GPUs cannot halt frontier AI development. This reshapes assumptions about AI hardware dependencies.",
                "完全在华为芯片上训练和运行 1.6T 参数前沿模型，证明美国对 GPU 的出口管制无法阻止前沿 AI 的发展。这重塑了对 AI 硬件依赖性的假设。"
              )}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 dark:text-slate-100">
              {t("Efficiency breakthrough: 10× KV cache reduction", "效率突破：KV 缓存减少 10 倍")}
            </h4>
            <p className="text-sm text-paper-800/70 dark:text-slate-400">
              {t(
                "CSA/HCA's 10× KV cache reduction at equivalent quality is a significant engineering achievement. It enables true 1M-token serving at reasonable cost — opening applications like full-codebase analysis, book-length document QA, and multi-session memory.",
                "CSA/HCA 在等效质量下实现 10 倍 KV 缓存减少，是重大工程成就。它以合理成本实现真正的百万 token 推理服务——开启全代码库分析、书籍长度文档问答和多轮会话记忆等应用。"
              )}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 dark:text-slate-100">
              {t("Engram: a new architectural primitive", "Engram：新的架构原语")}
            </h4>
            <p className="text-sm text-paper-800/70 dark:text-slate-400">
              {t(
                "Separating static knowledge (hash lookup) from dynamic reasoning (MoE FFN) is a conceptual advance. If it generalizes beyond DeepSeek, it could become a standard component in large language model design — similar to how MoE itself went from a research idea to ubiquitous.",
                "将静态知识（哈希查找）与动态推理（MoE FFN）分离是一个概念性进步。如果这一方法能推广到 DeepSeek 之外，它可能成为大语言模型设计的标准组件——就像 MoE 本身从研究想法变为普遍应用一样。"
              )}
            </p>
          </div>
        </div>

        {/* ── 9. Related Papers ── */}
        <h2>{t("9. Related Papers", "9. 相关论文")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg">
            <Link href="/papers/grpo" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              GRPO
            </Link>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mt-1">
              {t(
                "DeepSeek's RL algorithm — used in V4's post-training to align the model on reasoning tasks without a separate critic network.",
                "DeepSeek 的 RL 算法——用于 V4 后训练阶段，无需独立 critic 网络即可对齐推理任务。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg">
            <Link href="/papers/attention-is-all-you-need" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Attention Is All You Need
            </Link>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mt-1">
              {t(
                "The Transformer architecture that V4 builds on. CSA/HCA are direct extensions of the attention mechanism introduced here.",
                "V4 所基于的 Transformer 架构。CSA/HCA 是此处引入的注意力机制的直接扩展。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg">
            <Link href="/papers/flashattention" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              FlashAttention
            </Link>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mt-1">
              {t(
                "IO-aware attention that V4's sparse attention patterns build on — tiling and kernel fusion are prerequisites for efficient sparse attention at scale.",
                "V4 稀疏注意力模式所基于的 IO 感知注意力——分块和内核融合是大规模高效稀疏注意力的基础。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg">
            <Link href="/papers/scaling-laws" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Scaling Laws
            </Link>
            <p className="text-sm text-paper-800/70 dark:text-slate-400 mt-1">
              {t(
                "The empirical framework motivating V4's scale. Chinchilla scaling laws guided the 33T-token training budget for a 1.6T-parameter model.",
                "激励 V4 规模化的实证框架。Chinchilla 缩放规律指导了 1.6T 参数模型使用 33T token 的训练预算。"
              )}
            </p>
          </div>
        </div>

        {/* ── 10. Resources ── */}
        <h2>{t("10. Additional Resources", "10. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a
            href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <span className="text-sm font-medium dark:text-slate-100">
              {t("DeepSeek-V4 Technical Report (PDF)", "DeepSeek-V4 技术报告（PDF）")}
            </span>
            <span className="text-xs text-paper-800/50 dark:text-slate-400 ml-2">HuggingFace</span>
          </a>
          <a
            href="https://github.com/deepseek-ai/Engram"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <span className="text-sm font-medium dark:text-slate-100">
              {t("Engram GitHub Repository", "Engram GitHub 仓库")}
            </span>
            <span className="text-xs text-paper-800/50 dark:text-slate-400 ml-2">
              {t("Conditional Memory via Scalable Lookup", "通过可扩展查找实现条件记忆")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/2601.07372"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <span className="text-sm font-medium dark:text-slate-100">
              {t("Engram arXiv Paper (2601.07372)", "Engram arXiv 论文（2601.07372）")}
            </span>
            <span className="text-xs text-paper-800/50 dark:text-slate-400 ml-2">
              {t("Conditional Memory via Scalable Lookup — formal write-up", "通过可扩展查找实现条件记忆——正式论文")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/2512.02556"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <span className="text-sm font-medium dark:text-slate-100">DeepSeek-V3 Technical Report (arXiv 2512.02556)</span>
            <span className="text-xs text-paper-800/50 dark:text-slate-400 ml-2">
              {t("V4's predecessor — MoE load balancing and multi-token prediction", "V4 的前身——MoE 负载均衡与多 token 预测")}
            </span>
          </a>
        </div>

      </article>
    </div>
  );
}
