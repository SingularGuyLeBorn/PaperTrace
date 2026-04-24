export interface PaperMeta {
  slug: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  tags: string[];
  description: string;
  arxiv?: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  papers: PaperMeta[];
}

export const sections: Section[] = [
  {
    id: "frontier-llms",
    title: "Frontier LLMs",
    description:
      "Technical reports and architecture breakdowns of state-of-the-art large language models — covering MoE scaling, efficient attention, and modern training recipes.",
    papers: [
      {
        slug: "deepseek-v4",
        title: "DeepSeek-V4 Technical Report",
        authors: "DeepSeek AI",
        year: 2026,
        venue: "Technical Report",
        tags: ["MoE", "Efficient Attention", "Long Context", "Code"],
        description:
          "DeepSeek-V4-Pro: 1.6T-parameter MoE model (49B active) with three key innovations — Compressed Sparse Attention (10% KV cache vs V3), Engram conditional memory (97% NiAH at 1M tokens), and manifold-constrained hyper-connections for stable trillion-scale training. Reaches ~81% SWE-bench Verified on Huawei Ascend chips.",
        arxiv: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf",
      },
    ],
  },
  {
    id: "dllm",
    title: "Diffusion Language Models",
    description:
      "Applying diffusion processes to discrete text generation — an emerging alternative to autoregressive LLMs. These papers explore masked diffusion, fast sampling, and block-level generation.",
    papers: [
      {
        slug: "llada",
        title: "LLaDA: Large Language Diffusion with mAsking",
        authors: "Nie et al.",
        year: 2025,
        venue: "arXiv",
        tags: ["Diffusion LM", "Masked Diffusion", "Pre-training"],
        description:
          "Proposes a masked diffusion framework for large language models. LLaDA uses a forward process that progressively masks tokens and a reverse process that learns to predict masked tokens, enabling competitive performance with AR models at scale.",
        arxiv: "https://arxiv.org/abs/2502.09992",
      },
      {
        slug: "mdlm",
        title: "Simple and Effective Masked Diffusion Language Models (MDLM)",
        authors: "Sahoo et al.",
        year: 2024,
        venue: "NeurIPS",
        tags: ["Diffusion LM", "Masked Diffusion", "ELBO"],
        description:
          "Simplifies masked discrete diffusion with a principled training objective derived from a continuous-time ELBO. Achieves strong perplexity on language modeling benchmarks with clean, minimal design.",
        arxiv: "https://arxiv.org/abs/2406.07524",
      },
      {
        slug: "fast-dllm",
        title: "Fast Discrete Diffusion Language Models (Fast DLLM)",
        authors: "Shi et al.",
        year: 2025,
        venue: "arXiv",
        tags: ["Diffusion LM", "Fast Sampling", "Adaptive"],
        description:
          "Accelerates discrete diffusion LMs by introducing an adaptive noise schedule and importance sampling for the denoising steps, reducing the number of forward passes needed while maintaining generation quality.",
      },
      {
        slug: "block-diffusion",
        title:
          "Block Diffusion: Interpolating Between Autoregressive and Diffusion Language Models",
        authors: "Arriola et al.",
        year: 2025,
        venue: "arXiv",
        tags: ["Diffusion LM", "Block Generation", "Hybrid"],
        description:
          "Bridges AR and diffusion by generating text in blocks — each block is produced via discrete diffusion while blocks are generated left-to-right. Combines the fluency of AR with the parallel decoding of diffusion.",
      },
    ],
  },
  {
    id: "transformer-foundations",
    title: "Transformer Foundations",
    description:
      "The core architectures and mechanisms that power modern deep learning — attention, transformers, and their variants.",
    papers: [
      {
        slug: "attention-is-all-you-need",
        title: "Attention Is All You Need",
        authors: "Vaswani et al.",
        year: 2017,
        venue: "NeurIPS",
        tags: ["Transformer", "Attention", "Seq2Seq"],
        description:
          "The paper that introduced the Transformer — replacing recurrence entirely with self-attention. We walk through scaled dot-product attention, multi-head attention, and positional encoding.",
        arxiv: "https://arxiv.org/abs/1706.03762",
      },
    ],
  },
];

export const allPapers = sections.flatMap((s) => s.papers);
