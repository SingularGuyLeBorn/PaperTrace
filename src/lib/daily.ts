export interface DailyPaper {
  date: string; // ISO YYYY-MM-DD
  title: string;
  titleZh?: string;
  authors: string;
  arxivId: string;
  paperUrl?: string; // for non-arXiv papers (e.g. HuggingFace technical reports)
  tags: string[];
  /** One-line why it matters — English */
  why: string;
  /** One-line why it matters — Chinese */
  whyZh: string;
  /** Is this editor's pick */
  pick?: boolean;
  /** Has full deep-dive */
  slug?: string;
}

export const dailyPapers: DailyPaper[] = [
  {
    date: "2026-04-23",
    title: "DeepSeek-V4 Technical Report",
    titleZh: "DeepSeek-V4 技术报告",
    authors: "DeepSeek AI",
    arxivId: "",
    paperUrl: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf",
    tags: ["MoE", "Pre-training", "Code"],
    why: "1.6T MoE (49B active) with 1M-token Engram memory — claims ~81% SWE-bench Verified, a major leap from V3.",
    whyZh: "1.6T MoE（49B 激活），Engram 百万 token 记忆 — 宣称 SWE-bench Verified ~81%，远超 V3。",
    pick: true,
    slug: "deepseek-v4",
  },
  {
    date: "2025-02-14",
    title: "Large Language Diffusion Models (LLaDA)",
    titleZh: "大语言扩散模型 (LLaDA)",
    authors: "Nie et al.",
    arxivId: "2502.09992",
    tags: ["Diffusion LM", "Pre-training"],
    why: "First diffusion LM at 8B scale that matches LLaMA3 — proves AR is not the only path to powerful LLMs.",
    whyZh: "首个 8B 规模扩散语言模型，可与 LLaMA3 媲美 — 证明 AR 不是强大 LLM 的唯一路径。",
    pick: true,
    slug: "llada",
  },
  {
    date: "2025-02-28",
    title: "Block Diffusion: Interpolating Between Autoregressive and Diffusion Language Models",
    titleZh: "Block Diffusion: 在自回归与扩散语言模型之间插值",
    authors: "Arriola et al.",
    arxivId: "2503.09573",
    tags: ["Diffusion LM", "Efficient Inference"],
    why: "Elegant bridge between AR and diffusion — block size B lets you tune the speed/quality tradeoff continuously.",
    whyZh: "AR 和扩散之间的优雅桥梁 — 块大小 B 让你连续调节速度/质量权衡。",
    pick: true,
    slug: "block-diffusion",
  },
  {
    date: "2025-05-28",
    title: "Fast-dLLM: Training-free Acceleration of Diffusion LLM",
    authors: "Wu et al.",
    arxivId: "2505.22618",
    tags: ["Diffusion LM", "Efficient Inference"],
    why: "Practical 3-10x speedup for masked diffusion LMs with no retraining — makes diffusion LMs viable for production.",
    whyZh: "无需重新训练即可实现 3-10 倍加速 — 让扩散语言模型可用于生产环境。",
    pick: true,
    slug: "fast-dllm",
  },
  {
    date: "2024-06-11",
    title: "Simple and Effective Masked Diffusion Language Models (MDLM)",
    authors: "Sahoo et al.",
    arxivId: "2406.07524",
    tags: ["Diffusion LM", "Theory"],
    why: "Clean theoretical foundation for masked diffusion — derives the training loss from first principles, no hand-tuning.",
    whyZh: "掩码扩散的简洁理论基础 — 从基本原理推导训练损失，无需手动调整。",
    slug: "mdlm",
  },
  {
    date: "2023-05-29",
    title: "Direct Preference Optimization (DPO)",
    authors: "Rafailov et al.",
    arxivId: "2305.18290",
    tags: ["Alignment", "RLHF"],
    why: "Killed the reward model — rewrites RLHF as a simple binary loss. Became the default fine-tuning method for open-source LLMs.",
    whyZh: "消灭了奖励模型 — 将 RLHF 改写为简单的二元损失。成为开源 LLM 的默认微调方法。",
    pick: true,
    slug: "dpo",
  },
  {
    date: "2024-02-05",
    title: "DeepSeekMath: Pushing the Limits of Mathematical Reasoning (GRPO)",
    authors: "Shao et al.",
    arxivId: "2402.03300",
    tags: ["RL", "Math Reasoning"],
    why: "Introduces GRPO — removes the critic network from PPO by using group-relative rewards. Powers DeepSeek-R1.",
    whyZh: "引入 GRPO — 通过组相对奖励从 PPO 中移除 critic 网络。为 DeepSeek-R1 提供动力。",
    slug: "grpo",
  },
  {
    date: "2025-01-22",
    title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL",
    authors: "DeepSeek AI",
    arxivId: "2501.12948",
    tags: ["RL", "Reasoning", "Chain-of-Thought"],
    why: "Matches o1 on math/code using pure RL with GRPO — no supervised CoT data needed. Huge open-source release.",
    whyZh: "仅使用 GRPO 强化学习在数学/代码上匹配 o1 — 不需要监督 CoT 数据。重要的开源发布。",
    pick: true,
  },
  {
    date: "2017-06-12",
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    arxivId: "1706.03762",
    tags: ["Transformer", "Architecture"],
    why: "The paper that started it all — replaced RNNs with attention. Everything in this repo builds on it.",
    whyZh: "一切的起点 — 用注意力替代 RNN。本站所有论文都建立在它之上。",
    slug: "attention-is-all-you-need",
  },
];

export const allTags = Array.from(
  new Set(dailyPapers.flatMap((p) => p.tags))
).sort();
