"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/lib/i18n";

type Section = "llm" | "dllm" | "vlm" | "agent";
type DLLMType = "Discrete" | "Continuous" | "Multimodal" | "Hybrid";

interface TimelineEntry {
  date: string; // "YYYY-MM"
  name: string;
  nameZh?: string;
  org: string;
  orgKey: string; // for filtering
  sections: Section[];
  dlllmType?: DLLMType;
  params?: string;
  description: string;
  descriptionZh: string;
  links: {
    arxiv?: string;
    deepdive?: string;
    blog?: string;
    github?: string;
  };
  notable?: boolean;
}

const entries: TimelineEntry[] = [
  // ─────────── LLM foundations ───────────
  {
    date: "2017-06", name: "Transformer", org: "Google", orgKey: "google",
    sections: ["llm"],
    description: "Attention Is All You Need — self-attention replaces RNNs entirely",
    descriptionZh: "自注意力完全取代 RNN，开创 Transformer 时代",
    links: { arxiv: "https://arxiv.org/abs/1706.03762", deepdive: "/papers/attention-is-all-you-need" },
    notable: true,
  },
  {
    date: "2018-10", name: "BERT", org: "Google", orgKey: "google",
    sections: ["llm"],
    params: "340M",
    description: "Bidirectional Transformer pre-training with MLM — GLUE SOTA across all tasks",
    descriptionZh: "双向 Transformer 预训练，掩码语言建模，GLUE 全面刷榜",
    links: { arxiv: "https://arxiv.org/abs/1810.04805", deepdive: "/papers/bert" },
    notable: true,
  },
  {
    date: "2019-02", name: "GPT-2", org: "OpenAI", orgKey: "openai",
    sections: ["llm"],
    params: "1.5B",
    description: "Zero-shot multitask LM — \"too dangerous to release\" at launch",
    descriptionZh: "零样本多任务语言模型 — 发布时「太危险」而拒绝公开",
    links: { blog: "https://openai.com/research/better-language-models", deepdive: "/papers/gpt-2" },
    notable: true,
  },
  {
    date: "2020-05", name: "GPT-3", org: "OpenAI", orgKey: "openai",
    sections: ["llm"],
    params: "175B",
    description: "Few-shot in-context learning emerges at scale — no gradient update needed",
    descriptionZh: "规模涌现少样本上下文学习 — 无需梯度更新",
    links: { arxiv: "https://arxiv.org/abs/2005.14165" },
    notable: true,
  },
  {
    date: "2021-08", name: "Codex", org: "OpenAI", orgKey: "openai",
    sections: ["llm", "agent"],
    params: "12B",
    description: "GPT fine-tuned on GitHub code — powers GitHub Copilot",
    descriptionZh: "在 GitHub 代码上微调的 GPT — 驱动 GitHub Copilot",
    links: { arxiv: "https://arxiv.org/abs/2107.03374" },
  },
  {
    date: "2022-03", name: "InstructGPT", org: "OpenAI", orgKey: "openai",
    sections: ["llm"],
    params: "175B",
    description: "RLHF alignment via PPO on human preferences — precursor to ChatGPT",
    descriptionZh: "通过 PPO 做 RLHF 对齐 — ChatGPT 前身",
    links: { arxiv: "https://arxiv.org/abs/2203.02155", deepdive: "/papers/ppo" },
    notable: true,
  },
  {
    date: "2022-11", name: "ChatGPT", org: "OpenAI", orgKey: "openai",
    sections: ["llm"],
    description: "100M users in 2 months — AI enters mainstream consciousness",
    descriptionZh: "2 个月 1 亿用户 — AI 进入大众视野",
    links: { blog: "https://openai.com/blog/chatgpt" },
    notable: true,
  },
  {
    date: "2023-02", name: "LLaMA 1", org: "Meta", orgKey: "meta",
    sections: ["llm"],
    params: "65B",
    description: "Open-weights LLM that outperforms GPT-3 — enables community research",
    descriptionZh: "超越 GPT-3 的开放权重 LLM — 推动社区研究",
    links: { arxiv: "https://arxiv.org/abs/2302.13971" },
    notable: true,
  },
  {
    date: "2023-03", name: "GPT-4", org: "OpenAI", orgKey: "openai",
    sections: ["llm", "vlm"],
    description: "Multimodal, passes bar exam, massive capability leap over GPT-3.5",
    descriptionZh: "多模态，通过律师资格考试，能力大幅跃升",
    links: { arxiv: "https://arxiv.org/abs/2303.08774" },
    notable: true,
  },
  {
    date: "2023-05", name: "DPO", org: "Stanford", orgKey: "academia",
    sections: ["llm"],
    description: "Direct Preference Optimization — eliminates reward model and PPO from RLHF",
    descriptionZh: "直接偏好优化 — 消除 RLHF 中的奖励模型和 PPO",
    links: { arxiv: "https://arxiv.org/abs/2305.18290", deepdive: "/papers/dpo" },
    notable: true,
  },
  {
    date: "2023-07", name: "LLaMA 2", org: "Meta", orgKey: "meta",
    sections: ["llm"],
    params: "70B",
    description: "Commercial license, chat fine-tuned, widely adopted open-weight model",
    descriptionZh: "商用许可，指令微调，广泛采用的开源模型",
    links: { arxiv: "https://arxiv.org/abs/2307.09288" },
  },
  {
    date: "2023-09", name: "Mistral 7B", org: "Mistral AI", orgKey: "mistral",
    sections: ["llm"],
    params: "7B",
    description: "GQA + sliding window attention — beats LLaMA 2 13B at 7B scale",
    descriptionZh: "分组查询注意力 + 滑动窗口 — 7B 参数超越 LLaMA 2 13B",
    links: { arxiv: "https://arxiv.org/abs/2310.06825" },
  },
  {
    date: "2023-12", name: "Gemini 1.0", org: "Google", orgKey: "google",
    sections: ["llm", "vlm"],
    description: "Native multimodal — first credible GPT-4 competitor from Google",
    descriptionZh: "原生多模态 — 谷歌首个可与 GPT-4 媲美的竞争对手",
    links: { blog: "https://deepmind.google/technologies/gemini/" },
  },
  {
    date: "2024-01", name: "GRPO (DeepSeek-Math)", org: "DeepSeek", orgKey: "deepseek",
    sections: ["llm"],
    description: "Group Relative Policy Optimization — simpler PPO without critic network",
    descriptionZh: "组相对策略优化 — 无需 critic 的简化版 PPO",
    links: { arxiv: "https://arxiv.org/abs/2402.03300", deepdive: "/papers/grpo" },
  },
  {
    date: "2024-04", name: "LLaMA 3", org: "Meta", orgKey: "meta",
    sections: ["llm", "vlm"],
    params: "70B / 405B",
    description: "Best open-weight model — competitive with GPT-4 Turbo on most tasks",
    descriptionZh: "最强开源模型，可与 GPT-4 Turbo 竞争",
    links: { blog: "https://ai.meta.com/blog/meta-llama-3/" },
    notable: true,
  },
  {
    date: "2024-05", name: "Qwen2", org: "Alibaba", orgKey: "alibaba",
    sections: ["llm"],
    params: "72B",
    description: "Strong multilingual model with excellent Chinese performance",
    descriptionZh: "强大多语言模型，中文表现卓越",
    links: { arxiv: "https://arxiv.org/abs/2407.10671" },
  },
  {
    date: "2024-06", name: "Claude 3.5 Sonnet", org: "Anthropic", orgKey: "anthropic",
    sections: ["llm"],
    description: "Best coding model at launch — outperforms GPT-4o on most benchmarks",
    descriptionZh: "发布时最强代码模型，多数基准超越 GPT-4o",
    links: { blog: "https://www.anthropic.com/news/claude-3-5-sonnet" },
    notable: true,
  },
  {
    date: "2025-01", name: "DeepSeek-R1", org: "DeepSeek", orgKey: "deepseek",
    sections: ["llm"],
    params: "671B MoE",
    description: "o1-level reasoning via RL, fully open-weights MIT license — shocked markets",
    descriptionZh: "通过 RL 实现 o1 级推理，完全开源 MIT 协议 — 震撼业界",
    links: { arxiv: "https://arxiv.org/abs/2501.12948", deepdive: "/papers/grpo" },
    notable: true,
  },
  {
    date: "2025-01", name: "Kimi k1.5", org: "Moonshot AI", orgKey: "moonshot",
    sections: ["llm"],
    description: "Long-context RL reasoning model — competitive with o1 on math/coding",
    descriptionZh: "长上下文 RL 推理模型，数学/代码上可与 o1 竞争",
    links: { arxiv: "https://arxiv.org/abs/2501.12599" },
  },
  {
    date: "2025-03", name: "Gemini 2.5 Pro", org: "Google", orgKey: "google",
    sections: ["llm", "vlm"],
    description: "Tops most benchmarks + Chatbot Arena — 1M token context",
    descriptionZh: "登顶多数基准及 Chatbot Arena — 100 万 token 上下文",
    links: { blog: "https://deepmind.google/technologies/gemini/pro/" },
    notable: true,
  },
  {
    date: "2025-04", name: "Qwen3", org: "Alibaba", orgKey: "alibaba",
    sections: ["llm"],
    params: "235B MoE",
    description: "Thinking mode toggle — top open-source reasoning model",
    descriptionZh: "可切换思考模式 — 顶级开源推理模型",
    links: { blog: "https://qwenlm.github.io/blog/qwen3/" },
    notable: true,
  },
  // ─────────── 2026 ───────────
  {
    date: "2026-01", name: "DeepSeek-V3", org: "DeepSeek", orgKey: "deepseek",
    sections: ["llm"],
    description: "Efficient MoE with novel load-balancing and multi-token prediction — strong coding and math at low training cost",
    descriptionZh: "新型负载均衡和多 token 预测的高效 MoE — 以极低训练成本实现强大代码和数学性能",
    links: { blog: "https://api-docs.deepseek.com/" },
    notable: true,
  },
  {
    date: "2026-02", name: "Claude Opus 4.6", org: "Anthropic", orgKey: "anthropic",
    sections: ["llm", "agent"],
    description: "Extended thinking, improved agentic capabilities — powers Claude Code. Released Feb 5, 2026.",
    descriptionZh: "扩展思考，增强智能体能力 — 驱动 Claude Code。2026年2月5日发布。",
    links: { blog: "https://www.anthropic.com/news" },
    notable: true,
  },
  {
    date: "2026-02", name: "Claude Sonnet 4.6", org: "Anthropic", orgKey: "anthropic",
    sections: ["llm"],
    description: "Frontier performance across coding, agents, and professional work. Released Feb 17, 2026.",
    descriptionZh: "在代码、智能体和专业工作中达到前沿性能。2026年2月17日发布。",
    links: { blog: "https://www.anthropic.com/news" },
    notable: true,
  },
  {
    date: "2026-02", name: "Gemini 2.0 Ultra", org: "Google", orgKey: "google",
    sections: ["llm", "vlm"],
    description: "Native multimodal reasoning + agentic tool use — Google's strongest model at launch",
    descriptionZh: "原生多模态推理 + 智能体工具调用 — 发布时谷歌最强模型",
    links: { blog: "https://deepmind.google/technologies/gemini/" },
    notable: true,
  },

  // ─────────── DLLM section ───────────
  {
    date: "2021-07", name: "D3PM", org: "Google", orgKey: "google",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "Structured denoising diffusion in discrete state spaces — the DLLM ancestor",
    descriptionZh: "离散状态空间中的结构化去噪扩散 — DLLM 鼻祖",
    links: { arxiv: "https://arxiv.org/abs/2107.03006" },
    notable: true,
  },
  {
    date: "2022-05", name: "Diffusion-LM", org: "Stanford", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Continuous",
    description: "Continuous diffusion over word embeddings with controllable generation",
    descriptionZh: "在词嵌入上做连续扩散，支持可控文本生成",
    links: { arxiv: "https://arxiv.org/abs/2205.14217" },
    notable: true,
  },
  {
    date: "2022-06", name: "LD4LG", org: "Tsinghua", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Continuous",
    description: "Latent diffusion for language generation in compressed latent space",
    descriptionZh: "在压缩潜在空间中做语言生成的潜在扩散",
    links: { arxiv: "https://arxiv.org/abs/2212.09462" },
  },
  {
    date: "2022-10", name: "DiffuSeq", org: "Microsoft", orgKey: "microsoft",
    sections: ["dllm"], dlllmType: "Continuous",
    description: "Sequence-to-sequence text generation via continuous diffusion",
    descriptionZh: "通过连续扩散实现序列到序列文本生成",
    links: { arxiv: "https://arxiv.org/abs/2210.08933" },
  },
  {
    date: "2022-12", name: "CDCD", org: "Cornell", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Continuous",
    description: "Continuous diffusion for categorical data with score matching",
    descriptionZh: "用分数匹配对分类数据做连续扩散",
    links: { arxiv: "https://arxiv.org/abs/2211.15089" },
  },
  {
    date: "2022-12", name: "SeqDiffuSeq", org: "Alibaba", orgKey: "alibaba",
    sections: ["dllm"], dlllmType: "Continuous",
    description: "Text diffusion with encoder-decoder and self-conditioning",
    descriptionZh: "带编码器-解码器和自条件的文本扩散",
    links: { arxiv: "https://arxiv.org/abs/2212.10325" },
  },
  {
    date: "2023-05", name: "SEDD", org: "Stanford", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "Score entropy discrete diffusion — principled continuous-time framework",
    descriptionZh: "分数熵离散扩散 — 有原则的连续时间框架",
    links: { arxiv: "https://arxiv.org/abs/2310.16834" },
    notable: true,
  },
  {
    date: "2023-09", name: "AR-Diffusion", org: "MSRA", orgKey: "microsoft",
    sections: ["dllm"], dlllmType: "Hybrid",
    description: "Combines AR left-to-right ordering with diffusion denoising per token",
    descriptionZh: "结合自回归从左到右顺序与每个 token 的扩散去噪",
    links: { arxiv: "https://arxiv.org/abs/2305.09515" },
  },
  {
    date: "2023-09", name: "Plaid", org: "NYU", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "Plug-and-play language model diffusion with discrete flow matching",
    descriptionZh: "基于离散流匹配的即插即用语言模型扩散",
    links: { arxiv: "https://arxiv.org/abs/2306.00320" },
  },
  {
    date: "2023-11", name: "DiffusionBERT", org: "Tsinghua", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "Discrete diffusion LM leveraging BERT pre-training for initialization",
    descriptionZh: "利用 BERT 预训练初始化的离散扩散语言模型",
    links: { arxiv: "https://arxiv.org/abs/2211.15029" },
  },
  {
    date: "2024-05", name: "MDLM", org: "NYU / Princeton", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "Simple and effective masked diffusion with continuous-time ELBO",
    descriptionZh: "基于连续时间 ELBO 的简洁有效掩码扩散",
    links: { arxiv: "https://arxiv.org/abs/2406.07524", deepdive: "/papers/mdlm" },
    notable: true,
  },
  {
    date: "2024-06", name: "MD4", org: "Google DeepMind", orgKey: "google",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "Masked discrete diffusion trained from scratch, scales to large datasets",
    descriptionZh: "从头训练的掩码离散扩散，可扩展到大规模数据集",
    links: { arxiv: "https://arxiv.org/abs/2406.04329" },
  },
  {
    date: "2024-07", name: "RADD", org: "CMU", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "Residual absorbing discrete diffusion with improved generation quality",
    descriptionZh: "残差吸收离散扩散，提升生成质量",
    links: { arxiv: "https://arxiv.org/abs/2406.00555" },
  },
  {
    date: "2024-10", name: "Block Diffusion", org: "Cornell", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Hybrid",
    description: "Blocks go left-to-right (AR); tokens within each block denoised in parallel",
    descriptionZh: "块间从左到右（AR），块内 token 并行去噪",
    links: { arxiv: "https://arxiv.org/abs/2503.09573", deepdive: "/papers/block-diffusion" },
    notable: true,
  },
  {
    date: "2024-11", name: "DFM", org: "Meta", orgKey: "meta",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "Discrete flow matching for language generation — Meta's DLLM effort",
    descriptionZh: "用于语言生成的离散流匹配 — Meta 的 DLLM",
    links: { arxiv: "https://arxiv.org/abs/2407.15595" },
  },
  {
    date: "2025-01", name: "LLaDA", org: "Renmin University", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "8B masked diffusion LM matching AR models — flagship DLLM",
    descriptionZh: "8B 掩码扩散语言模型，可与 AR 模型媲美 — 旗舰 DLLM",
    links: { arxiv: "https://arxiv.org/abs/2502.09992", deepdive: "/papers/llada" },
    notable: true,
  },
  {
    date: "2025-01", name: "Dream", org: "Multiple", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "Discrete reasoning language model with adaptive masking",
    descriptionZh: "带自适应掩码的离散推理语言模型",
    links: { arxiv: "https://arxiv.org/abs/2502.09948" },
  },
  {
    date: "2025-02", name: "Gemini Diffusion", org: "Google", orgKey: "google",
    sections: ["dllm"], dlllmType: "Continuous",
    description: "Google's diffusion LM — faster generation than autoregressive Gemini",
    descriptionZh: "谷歌的扩散语言模型 — 生成速度快于自回归 Gemini",
    links: { blog: "https://deepmind.google/discover/blog/gemini-diffusion/" },
    notable: true,
  },
  {
    date: "2025-03", name: "Fast-dLLM", org: "Multiple", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Discrete",
    description: "Training-free acceleration with parallel decoding and confidence-based scheduling",
    descriptionZh: "无需训练的加速，并行解码与置信度调度",
    links: { arxiv: "https://arxiv.org/abs/2505.22618", deepdive: "/papers/fast-dllm" },
    notable: true,
  },
  {
    date: "2025-03", name: "MMaDA", org: "HKU", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Multimodal",
    description: "Multimodal discrete diffusion for text and image generation",
    descriptionZh: "用于文本和图像生成的多模态离散扩散",
    links: { arxiv: "https://arxiv.org/abs/2505.15809" },
  },
  {
    date: "2025-04", name: "Muddit", org: "ETH Zurich", orgKey: "academia",
    sections: ["dllm"], dlllmType: "Multimodal",
    description: "Unified discrete diffusion for text, image, and video",
    descriptionZh: "统一的文本、图像、视频离散扩散",
    links: { arxiv: "https://arxiv.org/abs/2504.08322" },
  },

  // ─────────── VLM section ───────────
  {
    date: "2020-10", name: "ViT", org: "Google", orgKey: "google",
    sections: ["vlm"],
    description: "Vision Transformer — patches of images treated as token sequences",
    descriptionZh: "视觉 Transformer — 图像 patch 作为 token 序列处理",
    links: { arxiv: "https://arxiv.org/abs/2010.11929" },
    notable: true,
  },
  {
    date: "2021-01", name: "CLIP", org: "OpenAI", orgKey: "openai",
    sections: ["vlm"],
    description: "Contrastive image-text pre-training on 400M pairs — zero-shot ImageNet 76%",
    descriptionZh: "在 4 亿图文对上做对比预训练 — 零样本 ImageNet 76%",
    links: { arxiv: "https://arxiv.org/abs/2103.00020", deepdive: "/papers/clip" },
    notable: true,
  },
  {
    date: "2021-01", name: "DALL-E", org: "OpenAI", orgKey: "openai",
    sections: ["vlm"],
    description: "Text-to-image generation with GPT-style discrete VAE",
    descriptionZh: "基于 GPT 风格离散 VAE 的文本到图像生成",
    links: { blog: "https://openai.com/research/dall-e" },
    notable: true,
  },
  {
    date: "2022-01", name: "BLIP", org: "Salesforce", orgKey: "salesforce",
    sections: ["vlm"],
    description: "Bootstrapping language-image pre-training with noisy web data",
    descriptionZh: "利用含噪网络数据引导语言-图像预训练",
    links: { arxiv: "https://arxiv.org/abs/2201.12086" },
  },
  {
    date: "2022-04", name: "Flamingo", org: "DeepMind", orgKey: "google",
    sections: ["vlm"],
    description: "Few-shot visual QA by interleaving images and text in context",
    descriptionZh: "在上下文中交错图像和文本实现少样本视觉问答",
    links: { arxiv: "https://arxiv.org/abs/2204.14198" },
    notable: true,
  },
  {
    date: "2023-01", name: "BLIP-2", org: "Salesforce", orgKey: "salesforce",
    sections: ["vlm"],
    description: "Q-Former bridges frozen CLIP + frozen LLM — efficient VLM training",
    descriptionZh: "Q-Former 桥接冻结的 CLIP 和 LLM — 高效 VLM 训练",
    links: { arxiv: "https://arxiv.org/abs/2301.12597" },
  },
  {
    date: "2023-04", name: "LLaVA", org: "UW-Madison", orgKey: "academia",
    sections: ["vlm"],
    description: "CLIP + LLaMA with single linear projection + GPT-4 instruction data",
    descriptionZh: "CLIP + LLaMA 单层线性投影 + GPT-4 指令数据",
    links: { arxiv: "https://arxiv.org/abs/2304.08485", deepdive: "/papers/llava" },
    notable: true,
  },
  {
    date: "2023-10", name: "LLaVA-1.5", org: "UW-Madison", orgKey: "academia",
    sections: ["vlm"],
    description: "MLP connector + academic-task data — major quality improvement",
    descriptionZh: "MLP 连接器 + 学术任务数据 — 质量大幅提升",
    links: { arxiv: "https://arxiv.org/abs/2310.03744" },
  },
  {
    date: "2024-01", name: "InternVL", org: "Shanghai AI Lab", orgKey: "academia",
    sections: ["vlm"],
    description: "Large-scale vision-language model with dynamic resolution input",
    descriptionZh: "支持动态分辨率输入的大规模视觉语言模型",
    links: { arxiv: "https://arxiv.org/abs/2404.16821" },
  },
  {
    date: "2024-09", name: "Qwen-VL", org: "Alibaba", orgKey: "alibaba",
    sections: ["vlm"],
    description: "Multilingual VLM with strong Chinese visual understanding",
    descriptionZh: "多语言 VLM，中文视觉理解能力突出",
    links: { arxiv: "https://arxiv.org/abs/2408.09071" },
  },
  {
    date: "2024-09", name: "LLaMA 3.2 Vision", org: "Meta", orgKey: "meta",
    sections: ["vlm"],
    params: "90B",
    description: "Open-weights vision model matching closed-source VLMs",
    descriptionZh: "可与闭源 VLM 媲美的开放权重视觉模型",
    links: { blog: "https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/" },
  },

  // ─────────── Agent section ───────────
  {
    date: "2021-12", name: "WebGPT", org: "OpenAI", orgKey: "openai",
    sections: ["agent"],
    description: "GPT-3 fine-tuned to use a web browser — retrieval-augmented QA",
    descriptionZh: "微调 GPT-3 使用网络浏览器 — 检索增强问答",
    links: { arxiv: "https://arxiv.org/abs/2112.09332" },
  },
  {
    date: "2022-10", name: "ReAct", org: "Princeton/Google", orgKey: "academia",
    sections: ["agent"],
    description: "Reasoning + Acting — interleave chain-of-thought with tool calls",
    descriptionZh: "推理 + 行动 — 交替进行思维链和工具调用",
    links: { arxiv: "https://arxiv.org/abs/2210.03629" },
    notable: true,
  },
  {
    date: "2023-02", name: "Toolformer", org: "Meta", orgKey: "meta",
    sections: ["agent"],
    description: "LLM self-supervises learning to call APIs — calculator, search, etc.",
    descriptionZh: "LLM 自监督学习调用 API — 计算器、搜索等",
    links: { arxiv: "https://arxiv.org/abs/2302.04761" },
    notable: true,
  },
  {
    date: "2023-03", name: "AutoGPT", org: "Community", orgKey: "community",
    sections: ["agent"],
    description: "Autonomous GPT-4 agent with memory, internet access, and self-prompting",
    descriptionZh: "带记忆、联网和自提示的自主 GPT-4 智能体",
    links: { github: "https://github.com/Significant-Gravitas/AutoGPT" },
    notable: true,
  },
  {
    date: "2023-06", name: "OpenAI Functions", org: "OpenAI", orgKey: "openai",
    sections: ["agent"],
    description: "Structured tool calling in GPT — JSON schema for function definitions",
    descriptionZh: "GPT 中的结构化工具调用 — 函数定义 JSON schema",
    links: { blog: "https://openai.com/blog/function-calling-and-other-api-updates" },
    notable: true,
  },
  {
    date: "2023-10", name: "OpenAgents", org: "XLANG Lab", orgKey: "academia",
    sections: ["agent"],
    description: "Open platform for language agents with data, plugin, and web agents",
    descriptionZh: "开放语言智能体平台，含数据、插件和 Web 智能体",
    links: { arxiv: "https://arxiv.org/abs/2310.10634" },
  },
  {
    date: "2024-03", name: "Devin", org: "Cognition", orgKey: "community",
    sections: ["agent"],
    description: "First AI software engineer — autonomous coding, debugging, deployment",
    descriptionZh: "首个 AI 软件工程师 — 自主编码、调试、部署",
    links: { blog: "https://www.cognition.ai/blog/introducing-devin" },
    notable: true,
  },
  {
    date: "2024-10", name: "Claude Computer Use", org: "Anthropic", orgKey: "anthropic",
    sections: ["agent"],
    description: "Claude controls mouse and keyboard to operate any desktop application",
    descriptionZh: "Claude 控制鼠标和键盘操作任何桌面应用",
    links: { blog: "https://www.anthropic.com/news/developing-computer-use" },
    notable: true,
  },
  {
    date: "2024-11", name: "Model Context Protocol", org: "Anthropic", orgKey: "anthropic",
    sections: ["agent"],
    description: "Open standard for connecting AI models to tools, data, and services",
    descriptionZh: "连接 AI 模型与工具、数据和服务的开放标准",
    links: { blog: "https://www.anthropic.com/news/model-context-protocol" },
    notable: true,
  },
  {
    date: "2024-11", name: "OpenAI Swarm", org: "OpenAI", orgKey: "openai",
    sections: ["agent"],
    description: "Lightweight multi-agent orchestration framework — educational release",
    descriptionZh: "轻量级多智能体编排框架 — 教育性开源发布",
    links: { github: "https://github.com/openai/swarm" },
  },
  {
    date: "2025-02", name: "Claude Code", org: "Anthropic", orgKey: "anthropic",
    sections: ["agent"],
    description: "Terminal-based agentic coding assistant with full filesystem access",
    descriptionZh: "基于终端的智能体代码助手，具有完整文件系统访问权限",
    links: { blog: "https://www.anthropic.com/claude-code" },
    notable: true,
  },
  {
    date: "2025-04", name: "OpenAI Agents SDK", org: "OpenAI", orgKey: "openai",
    sections: ["agent"],
    description: "Production-ready multi-agent framework with handoffs and guardrails",
    descriptionZh: "生产就绪的多智能体框架，支持交接和护栏",
    links: { github: "https://github.com/openai/openai-agents-python" },
  },
];

const SECTION_META: Record<Section, { label: string; labelZh: string; color: string; bg: string }> = {
  llm:   { label: "LLMs",   labelZh: "大语言模型",   color: "text-blue-700 dark:text-blue-300",   bg: "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700/50" },
  dllm:  { label: "DLLMs",  labelZh: "扩散语言模型", color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-700/50" },
  vlm:   { label: "VLMs",   labelZh: "视觉语言模型", color: "text-teal-700 dark:text-teal-300",   bg: "bg-teal-50 border-teal-200 dark:bg-teal-900/30 dark:border-teal-700/50" },
  agent: { label: "Agents", labelZh: "AI 智能体",   color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-700/50" },
};

const DLLM_TYPE_COLORS: Record<DLLMType, string> = {
  Discrete:   "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700/50",
  Continuous: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/50",
  Multimodal: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700/50",
  Hybrid:     "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/50",
};

const ORG_COLORS: Record<string, string> = {
  google:     "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  openai:     "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  meta:       "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  anthropic:  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  microsoft:  "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
  deepseek:   "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  alibaba:    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  mistral:    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  moonshot:   "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  academia:   "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300",
  salesforce: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  community:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
};

const ALL_ORGS: Record<string, string> = {
  google:     "Google / DeepMind",
  openai:     "OpenAI",
  meta:       "Meta",
  anthropic:  "Anthropic",
  microsoft:  "Microsoft",
  deepseek:   "DeepSeek",
  alibaba:    "Alibaba / Qwen",
  mistral:    "Mistral AI",
  moonshot:   "Moonshot / Kimi",
  academia:   "Academia",
  salesforce: "Salesforce",
  community:  "Community",
};

export function InteractiveTimeline() {
  const { t, lang } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  const [activeSection, setActiveSection] = useState<Section>("llm");
  const [activeOrg, setActiveOrg] = useState<string | null>(null);
  const [activeDLLMType, setActiveDLLMType] = useState<DLLMType | null>(null);
  const [showNotableOnly, setShowNotableOnly] = useState(false);

  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => {
        if (!e.sections.includes(activeSection)) return false;
        if (activeOrg && e.orgKey !== activeOrg) return false;
        if (activeSection === "dllm" && activeDLLMType && e.dlllmType !== activeDLLMType) return false;
        if (showNotableOnly && !e.notable) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // newest first
  }, [activeSection, activeOrg, activeDLLMType, showNotableOnly]);

  // Group by year
  const byYear = useMemo(() => {
    const map = new Map<string, typeof filteredEntries>();
    for (const e of filteredEntries) {
      const yr = e.date.slice(0, 4);
      if (!map.has(yr)) map.set(yr, []);
      map.get(yr)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a)); // newest first
  }, [filteredEntries]);

  // Available orgs for current section
  const availableOrgs = useMemo(() => {
    const orgSet = new Set<string>();
    entries.filter((e) => e.sections.includes(activeSection)).forEach((e) => orgSet.add(e.orgKey));
    return Array.from(orgSet);
  }, [activeSection]);

  const sections: Section[] = ["llm", "dllm", "vlm", "agent"];

  const getLinkBadge = (entry: TimelineEntry) => {
    const links = [];
    if (entry.links.deepdive) {
      links.push(
        <a key="dd" href={`${basePath}${entry.links.deepdive}`}
          className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          title={t("Read deep-dive", "查看精读")}>
          ★ {t("Deep Dive", "精读")}
        </a>
      );
    }
    if (entry.links.arxiv) {
      links.push(
        <a key="ax" href={entry.links.arxiv} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600">
          arXiv ↗
        </a>
      );
    }
    if (entry.links.blog) {
      links.push(
        <a key="bl" href={entry.links.blog} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600">
          Blog ↗
        </a>
      );
    }
    if (entry.links.github) {
      links.push(
        <a key="gh" href={entry.links.github} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600">
          GitHub ↗
        </a>
      );
    }
    return links;
  };

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-paper-200 dark:border-slate-700 rounded-xl p-6">
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {sections.map((s) => {
          const meta = SECTION_META[s];
          const isActive = activeSection === s;
          return (
            <button
              key={s}
              onClick={() => { setActiveSection(s); setActiveOrg(null); setActiveDLLMType(null); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                isActive
                  ? `${meta.bg} ${meta.color} border-current`
                  : "bg-white dark:bg-slate-800 border-paper-200 dark:border-slate-600 text-paper-800/60 dark:text-slate-400 hover:border-paper-300 dark:hover:border-slate-500"
              }`}
            >
              {lang === "en" ? meta.label : meta.labelZh}
            </button>
          );
        })}
        <button
          onClick={() => setShowNotableOnly((v) => !v)}
          className={`ml-auto px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
            showNotableOnly
              ? "bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300"
              : "bg-white dark:bg-slate-800 border-paper-200 dark:border-slate-600 text-paper-800/60 dark:text-slate-400 hover:border-paper-300 dark:hover:border-slate-500"
          }`}
        >
          {showNotableOnly ? "★ " : ""}{t("Highlights", "重要节点")}
        </button>
      </div>

      {/* DLLM type filter */}
      {activeSection === "dllm" && (
        <div className="flex flex-wrap gap-2 mb-4">
          {(["Discrete", "Continuous", "Multimodal", "Hybrid"] as DLLMType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveDLLMType((prev) => prev === type ? null : type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                activeDLLMType === type
                  ? DLLM_TYPE_COLORS[type]
                  : "bg-white dark:bg-slate-800 border-paper-200 dark:border-slate-600 text-paper-800/50 dark:text-slate-400 hover:border-paper-300 dark:hover:border-slate-500"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Org filter */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {availableOrgs.map((orgKey) => (
          <button
            key={orgKey}
            onClick={() => setActiveOrg((prev) => prev === orgKey ? null : orgKey)}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all border ${
              activeOrg === orgKey
                ? ORG_COLORS[orgKey] + " border-current"
                : "bg-white dark:bg-slate-800 border-paper-200 dark:border-slate-600 text-paper-800/50 dark:text-slate-400 hover:border-paper-300 dark:hover:border-slate-500"
            }`}
          >
            {ALL_ORGS[orgKey] ?? orgKey}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {byYear.map(([year, yearEntries]) => (
          <div key={year} className="flex gap-4 mb-6">
            {/* Year label */}
            <div className="flex-none w-12 pt-1">
              <span className="text-xs font-bold text-paper-800/40 dark:text-slate-500 uppercase">{year}</span>
              <div className="mt-2 h-full border-l-2 border-paper-200 dark:border-slate-700 ml-5" />
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-3">
              {yearEntries.map((entry) => (
                <div
                  key={`${entry.date}-${entry.name}`}
                  className={`relative flex gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${
                    entry.notable
                      ? "border-paper-300 dark:border-slate-600 bg-paper-50 dark:bg-slate-800"
                      : "border-paper-100 dark:border-slate-700/60 bg-white dark:bg-slate-800/40"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[21px] top-4 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                    style={{
                      backgroundColor:
                        activeSection === "dllm" && entry.dlllmType
                          ? entry.dlllmType === "Discrete"   ? "#0D9488"
                          : entry.dlllmType === "Continuous" ? "#3B82F6"
                          : entry.dlllmType === "Multimodal" ? "#A855F7"
                          : "#F59E0B"
                          : ORG_COLORS[entry.orgKey]?.includes("blue") ? "#3B82F6"
                          : ORG_COLORS[entry.orgKey]?.includes("green") ? "#22C55E"
                          : ORG_COLORS[entry.orgKey]?.includes("purple") ? "#A855F7"
                          : ORG_COLORS[entry.orgKey]?.includes("orange") ? "#F97316"
                          : ORG_COLORS[entry.orgKey]?.includes("rose") ? "#F43F5E"
                          : "#94A3B8"
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-1">
                      <span className={`font-semibold text-sm ${entry.notable ? "text-paper-800 dark:text-slate-100" : "text-paper-700 dark:text-slate-200"}`}>
                        {entry.name}
                        {entry.notable && <span className="text-amber-500 ml-1">★</span>}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ORG_COLORS[entry.orgKey] ?? "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300"}`}>
                        {entry.org}
                      </span>
                      {entry.params && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600">
                          {entry.params}
                        </span>
                      )}
                      {entry.dlllmType && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${DLLM_TYPE_COLORS[entry.dlllmType]}`}>
                          {entry.dlllmType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-paper-800/60 dark:text-slate-400 leading-relaxed mb-2">
                      {lang === "en" ? entry.description : entry.descriptionZh}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {getLinkBadge(entry)}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex-none text-right">
                    <span className="text-xs text-paper-800/30 dark:text-slate-600">
                      {entry.date.slice(5) === "01" ? "" : entry.date.slice(5) + "/"}
                      {entry.date.slice(0, 4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12 text-paper-800/40">
            {t("No entries match the current filters.", "没有匹配当前筛选条件的记录。")}
          </div>
        )}
      </div>

      {/* DLLM Legend */}
      {activeSection === "dllm" && (
        <div className="mt-4 pt-4 border-t border-paper-100 flex flex-wrap gap-3 items-center">
          <span className="text-xs text-paper-800/40 font-medium">{t("Type:", "类型：")}</span>
          {(["Discrete", "Continuous", "Multimodal", "Hybrid"] as DLLMType[]).map((type) => (
            <span key={type} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${DLLM_TYPE_COLORS[type]}`}>
              {type}
            </span>
          ))}
          <span className="ml-auto text-xs text-paper-800/40">
            ★ {t("Deep-dive available on PaperTrace", "PaperTrace 上有精读页面")}
          </span>
        </div>
      )}
    </div>
  );
}
