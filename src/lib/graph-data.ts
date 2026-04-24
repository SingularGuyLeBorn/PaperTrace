export type NodeType = "paper" | "lab" | "author" | "industry-tag";

export interface KGNode {
  id: string;
  type: NodeType;
  label: string;
  labelZh?: string;
  slug?: string; // for paper nodes — links to /papers/slug
  year?: number;
  color?: string; // pre-computed color for rendering
  category?: string; // paper category: diffusion | transformer | rl | vision | nlp | efficiency
}

export interface KGEdge {
  source: string; // node id
  target: string; // node id
  type: "wrote" | "affiliated" | "related" | "industry";
}

// ── Industry tag nodes ───────────────────────────────────────────────────────
const industryNodes: KGNode[] = [
  {
    id: "industry-bigtech",
    type: "industry-tag",
    label: "Big Tech",
    labelZh: "大科技公司",
    color: "#6366f1",
  },
  {
    id: "industry-ailab",
    type: "industry-tag",
    label: "AI Lab",
    labelZh: "AI 实验室",
    color: "#8b5cf6",
  },
  {
    id: "industry-academia",
    type: "industry-tag",
    label: "Academia",
    labelZh: "学术界",
    color: "#10b981",
  },
];

// ── Lab nodes ────────────────────────────────────────────────────────────────
const labNodes: KGNode[] = [
  {
    id: "lab-google-brain",
    type: "lab",
    label: "Google Brain",
    labelZh: "Google Brain",
    color: "#64748b",
  },
  {
    id: "lab-google-deepmind",
    type: "lab",
    label: "Google DeepMind",
    labelZh: "Google DeepMind",
    color: "#64748b",
  },
  {
    id: "lab-openai",
    type: "lab",
    label: "OpenAI",
    labelZh: "OpenAI",
    color: "#64748b",
  },
  {
    id: "lab-deepmind",
    type: "lab",
    label: "DeepMind",
    labelZh: "DeepMind",
    color: "#64748b",
  },
  {
    id: "lab-stanford",
    type: "lab",
    label: "Stanford",
    labelZh: "斯坦福大学",
    color: "#64748b",
  },
  {
    id: "lab-cmu",
    type: "lab",
    label: "CMU",
    labelZh: "卡内基梅隆大学",
    color: "#64748b",
  },
  {
    id: "lab-meta-ai",
    type: "lab",
    label: "Meta AI",
    labelZh: "Meta AI",
    color: "#64748b",
  },
  {
    id: "lab-microsoft-research",
    type: "lab",
    label: "Microsoft Research",
    labelZh: "微软研究院",
    color: "#64748b",
  },
  {
    id: "lab-peking-university",
    type: "lab",
    label: "Peking University",
    labelZh: "北京大学",
    color: "#64748b",
  },
  {
    id: "lab-toronto",
    type: "lab",
    label: "University of Toronto",
    labelZh: "多伦多大学",
    color: "#64748b",
  },
  {
    id: "lab-nyu",
    type: "lab",
    label: "NYU",
    labelZh: "纽约大学",
    color: "#64748b",
  },
  {
    id: "lab-uw-madison",
    type: "lab",
    label: "UW Madison",
    labelZh: "威斯康星大学麦迪逊分校",
    color: "#64748b",
  },
  {
    id: "lab-deepseek",
    type: "lab",
    label: "DeepSeek",
    labelZh: "深度求索",
    color: "#64748b",
  },
  {
    id: "lab-cornell",
    type: "lab",
    label: "Cornell",
    labelZh: "康奈尔大学",
    color: "#64748b",
  },
  {
    id: "lab-google-ai",
    type: "lab",
    label: "Google AI",
    labelZh: "Google AI",
    color: "#64748b",
  },
];

// ── Author nodes ─────────────────────────────────────────────────────────────
const authorNodes: KGNode[] = [
  {
    id: "author-vaswani",
    type: "author",
    label: "Vaswani",
    labelZh: "Vaswani",
    color: "#f59e0b",
  },
  {
    id: "author-hinton",
    type: "author",
    label: "Hinton",
    labelZh: "Hinton",
    color: "#f59e0b",
  },
  {
    id: "author-lecun",
    type: "author",
    label: "LeCun",
    labelZh: "LeCun",
    color: "#f59e0b",
  },
  {
    id: "author-bengio",
    type: "author",
    label: "Bengio",
    labelZh: "Bengio",
    color: "#f59e0b",
  },
  {
    id: "author-karpathy",
    type: "author",
    label: "Karpathy",
    labelZh: "Karpathy",
    color: "#f59e0b",
  },
  {
    id: "author-sutskever",
    type: "author",
    label: "Sutskever",
    labelZh: "Sutskever",
    color: "#f59e0b",
  },
  {
    id: "author-he-kaiming",
    type: "author",
    label: "He Kaiming",
    labelZh: "何恺明",
    color: "#f59e0b",
  },
  {
    id: "author-radford",
    type: "author",
    label: "Radford",
    labelZh: "Radford",
    color: "#f59e0b",
  },
  {
    id: "author-schulman",
    type: "author",
    label: "Schulman",
    labelZh: "Schulman",
    color: "#f59e0b",
  },
  {
    id: "author-hu-edward",
    type: "author",
    label: "Edward Hu",
    labelZh: "胡爱德",
    color: "#f59e0b",
  },
  {
    id: "author-dao-tri",
    type: "author",
    label: "Tri Dao",
    labelZh: "Tri Dao",
    color: "#f59e0b",
  },
  {
    id: "author-rafailov",
    type: "author",
    label: "Rafailov",
    labelZh: "Rafailov",
    color: "#f59e0b",
  },
  {
    id: "author-nie-yuchen",
    type: "author",
    label: "Nie Yuchen",
    labelZh: "聂宇晨",
    color: "#f59e0b",
  },
  {
    id: "author-devlin",
    type: "author",
    label: "Devlin",
    labelZh: "Devlin",
    color: "#f59e0b",
  },
  {
    id: "author-liu-haotian",
    type: "author",
    label: "Haotian Liu",
    labelZh: "刘昊天",
    color: "#f59e0b",
  },
];

// ── Paper category colors ────────────────────────────────────────────────────
const categoryColors: Record<string, string> = {
  diffusion: "#a855f7", // purple
  transformer: "#3b82f6", // blue
  rl: "#22c55e", // green
  vision: "#f97316", // orange
  nlp: "#06b6d4", // cyan
  efficiency: "#eab308", // yellow
  alignment: "#ec4899", // pink
};

// ── Paper nodes ──────────────────────────────────────────────────────────────
const paperNodes: KGNode[] = [
  {
    id: "paper-attention-is-all-you-need",
    type: "paper",
    label: "Attention Is All You Need",
    labelZh: "注意力机制就是一切",
    slug: "attention-is-all-you-need",
    year: 2017,
    category: "transformer",
    color: categoryColors.transformer,
  },
  {
    id: "paper-bert",
    type: "paper",
    label: "BERT",
    labelZh: "BERT",
    slug: "bert",
    year: 2018,
    category: "nlp",
    color: categoryColors.nlp,
  },
  {
    id: "paper-gpt-2",
    type: "paper",
    label: "GPT-2",
    labelZh: "GPT-2",
    slug: "gpt-2",
    year: 2019,
    category: "nlp",
    color: categoryColors.nlp,
  },
  {
    id: "paper-lora",
    type: "paper",
    label: "LoRA",
    labelZh: "低秩适应",
    slug: "lora",
    year: 2021,
    category: "efficiency",
    color: categoryColors.efficiency,
  },
  {
    id: "paper-flashattention",
    type: "paper",
    label: "FlashAttention",
    labelZh: "闪速注意力",
    slug: "flashattention",
    year: 2022,
    category: "efficiency",
    color: categoryColors.efficiency,
  },
  {
    id: "paper-llava",
    type: "paper",
    label: "LLaVA",
    labelZh: "LLaVA",
    slug: "llava",
    year: 2023,
    category: "vision",
    color: categoryColors.vision,
  },
  {
    id: "paper-ppo",
    type: "paper",
    label: "PPO",
    labelZh: "近端策略优化",
    slug: "ppo",
    year: 2017,
    category: "rl",
    color: categoryColors.rl,
  },
  {
    id: "paper-dpo",
    type: "paper",
    label: "DPO",
    labelZh: "直接偏好优化",
    slug: "dpo",
    year: 2023,
    category: "alignment",
    color: categoryColors.alignment,
  },
  {
    id: "paper-grpo",
    type: "paper",
    label: "GRPO",
    labelZh: "群体相对策略优化",
    slug: "grpo",
    year: 2024,
    category: "rl",
    color: categoryColors.rl,
  },
  {
    id: "paper-llada",
    type: "paper",
    label: "LLaDA",
    labelZh: "大语言扩散模型",
    slug: "llada",
    year: 2025,
    category: "diffusion",
    color: categoryColors.diffusion,
  },
  {
    id: "paper-resnet",
    type: "paper",
    label: "ResNet",
    labelZh: "残差网络",
    slug: "resnet",
    year: 2015,
    category: "vision",
    color: categoryColors.vision,
  },
  {
    id: "paper-alexnet",
    type: "paper",
    label: "AlexNet",
    labelZh: "AlexNet",
    slug: "alexnet",
    year: 2012,
    category: "vision",
    color: categoryColors.vision,
  },
  {
    id: "paper-clip",
    type: "paper",
    label: "CLIP",
    labelZh: "对比语言-图像预训练",
    slug: "clip",
    year: 2021,
    category: "vision",
    color: categoryColors.vision,
  },
  {
    id: "paper-scaling-laws",
    type: "paper",
    label: "Scaling Laws",
    labelZh: "缩放规律",
    slug: "scaling-laws",
    year: 2020,
    category: "nlp",
    color: categoryColors.nlp,
  },
  {
    id: "paper-mdlm",
    type: "paper",
    label: "MDLM",
    labelZh: "掩码扩散语言模型",
    slug: "mdlm",
    year: 2024,
    category: "diffusion",
    color: categoryColors.diffusion,
  },
  {
    id: "paper-block-diffusion",
    type: "paper",
    label: "Block Diffusion",
    labelZh: "块扩散",
    slug: "block-diffusion",
    year: 2025,
    category: "diffusion",
    color: categoryColors.diffusion,
  },
  {
    id: "paper-rag",
    type: "paper",
    label: "RAG",
    labelZh: "检索增强生成",
    slug: "rag",
    year: 2020,
    category: "nlp",
    color: categoryColors.nlp,
  },
  {
    id: "paper-fast-dllm",
    type: "paper",
    label: "Fast DLLM",
    labelZh: "快速离散扩散语言模型",
    slug: "fast-dllm",
    year: 2025,
    category: "diffusion",
    color: categoryColors.diffusion,
  },
  {
    id: "paper-deepseek-v4",
    type: "paper",
    label: "DeepSeek-V4",
    labelZh: "DeepSeek-V4 技术报告",
    slug: "deepseek-v4",
    year: 2026,
    category: "efficiency",
    color: categoryColors.efficiency,
  },
];

// ── All nodes ────────────────────────────────────────────────────────────────
export const kgNodes: KGNode[] = [
  ...industryNodes,
  ...labNodes,
  ...authorNodes,
  ...paperNodes,
];

// ── Edges ────────────────────────────────────────────────────────────────────
export const kgEdges: KGEdge[] = [
  // Lab → industry affiliations
  { source: "lab-google-brain", target: "industry-bigtech", type: "industry" },
  { source: "lab-google-ai", target: "industry-bigtech", type: "industry" },
  {
    source: "lab-google-deepmind",
    target: "industry-bigtech",
    type: "industry",
  },
  {
    source: "lab-microsoft-research",
    target: "industry-bigtech",
    type: "industry",
  },
  { source: "lab-meta-ai", target: "industry-bigtech", type: "industry" },
  { source: "lab-openai", target: "industry-ailab", type: "industry" },
  { source: "lab-deepmind", target: "industry-ailab", type: "industry" },
  { source: "lab-deepseek", target: "industry-ailab", type: "industry" },
  { source: "lab-stanford", target: "industry-academia", type: "industry" },
  { source: "lab-cmu", target: "industry-academia", type: "industry" },
  { source: "lab-nyu", target: "industry-academia", type: "industry" },
  { source: "lab-toronto", target: "industry-academia", type: "industry" },
  {
    source: "lab-peking-university",
    target: "industry-academia",
    type: "industry",
  },
  { source: "lab-uw-madison", target: "industry-academia", type: "industry" },
  { source: "lab-cornell", target: "industry-academia", type: "industry" },

  // Author → lab affiliations
  { source: "author-vaswani", target: "lab-google-brain", type: "affiliated" },
  { source: "author-devlin", target: "lab-google-ai", type: "affiliated" },
  { source: "author-hinton", target: "lab-toronto", type: "affiliated" },
  { source: "author-lecun", target: "lab-meta-ai", type: "affiliated" },
  {
    source: "author-sutskever",
    target: "lab-openai",
    type: "affiliated",
  },
  { source: "author-karpathy", target: "lab-openai", type: "affiliated" },
  {
    source: "author-radford",
    target: "lab-openai",
    type: "affiliated",
  },
  {
    source: "author-schulman",
    target: "lab-openai",
    type: "affiliated",
  },
  {
    source: "author-he-kaiming",
    target: "lab-microsoft-research",
    type: "affiliated",
  },
  {
    source: "author-hu-edward",
    target: "lab-microsoft-research",
    type: "affiliated",
  },
  { source: "author-dao-tri", target: "lab-stanford", type: "affiliated" },
  { source: "author-rafailov", target: "lab-stanford", type: "affiliated" },
  {
    source: "author-nie-yuchen",
    target: "lab-peking-university",
    type: "affiliated",
  },
  {
    source: "author-liu-haotian",
    target: "lab-uw-madison",
    type: "affiliated",
  },

  // Paper → lab (wrote / originated at)
  {
    source: "paper-attention-is-all-you-need",
    target: "lab-google-brain",
    type: "wrote",
  },
  { source: "paper-bert", target: "lab-google-ai", type: "wrote" },
  { source: "paper-gpt-2", target: "lab-openai", type: "wrote" },
  { source: "paper-lora", target: "lab-microsoft-research", type: "wrote" },
  { source: "paper-flashattention", target: "lab-stanford", type: "wrote" },
  {
    source: "paper-llava",
    target: "lab-uw-madison",
    type: "wrote",
  },
  {
    source: "paper-llava",
    target: "lab-microsoft-research",
    type: "affiliated",
  },
  { source: "paper-ppo", target: "lab-openai", type: "wrote" },
  { source: "paper-dpo", target: "lab-stanford", type: "wrote" },
  { source: "paper-grpo", target: "lab-deepseek", type: "wrote" },
  {
    source: "paper-llada",
    target: "lab-peking-university",
    type: "wrote",
  },
  {
    source: "paper-resnet",
    target: "lab-microsoft-research",
    type: "wrote",
  },
  { source: "paper-alexnet", target: "lab-toronto", type: "wrote" },
  { source: "paper-clip", target: "lab-openai", type: "wrote" },
  { source: "paper-scaling-laws", target: "lab-openai", type: "wrote" },
  { source: "paper-mdlm", target: "lab-nyu", type: "wrote" },
  { source: "paper-block-diffusion", target: "lab-cornell", type: "wrote" },
  { source: "paper-rag", target: "lab-meta-ai", type: "wrote" },
  { source: "paper-fast-dllm", target: "lab-stanford", type: "affiliated" },
  { source: "paper-deepseek-v4", target: "lab-deepseek", type: "wrote" },

  // Key author → paper (wrote)
  {
    source: "author-vaswani",
    target: "paper-attention-is-all-you-need",
    type: "wrote",
  },
  { source: "author-devlin", target: "paper-bert", type: "wrote" },
  { source: "author-radford", target: "paper-gpt-2", type: "wrote" },
  { source: "author-hu-edward", target: "paper-lora", type: "wrote" },
  { source: "author-dao-tri", target: "paper-flashattention", type: "wrote" },
  { source: "author-liu-haotian", target: "paper-llava", type: "wrote" },
  { source: "author-schulman", target: "paper-ppo", type: "wrote" },
  { source: "author-rafailov", target: "paper-dpo", type: "wrote" },
  { source: "author-nie-yuchen", target: "paper-llada", type: "wrote" },
  { source: "author-he-kaiming", target: "paper-resnet", type: "wrote" },
  { source: "author-hinton", target: "paper-alexnet", type: "wrote" },
  { source: "author-radford", target: "paper-clip", type: "wrote" },
  { source: "author-sutskever", target: "paper-scaling-laws", type: "wrote" },

  // Paper → paper relations
  {
    source: "paper-bert",
    target: "paper-attention-is-all-you-need",
    type: "related",
  },
  {
    source: "paper-gpt-2",
    target: "paper-attention-is-all-you-need",
    type: "related",
  },
  {
    source: "paper-flashattention",
    target: "paper-attention-is-all-you-need",
    type: "related",
  },
  {
    source: "paper-lora",
    target: "paper-attention-is-all-you-need",
    type: "related",
  },
  {
    source: "paper-dpo",
    target: "paper-ppo",
    type: "related",
  },
  {
    source: "paper-grpo",
    target: "paper-ppo",
    type: "related",
  },
  {
    source: "paper-deepseek-v4",
    target: "paper-attention-is-all-you-need",
    type: "related",
  },
  {
    source: "paper-deepseek-v4",
    target: "paper-flashattention",
    type: "related",
  },
  {
    source: "paper-deepseek-v4",
    target: "paper-grpo",
    type: "related",
  },
  {
    source: "paper-mdlm",
    target: "paper-llada",
    type: "related",
  },
  {
    source: "paper-block-diffusion",
    target: "paper-mdlm",
    type: "related",
  },
  {
    source: "paper-fast-dllm",
    target: "paper-mdlm",
    type: "related",
  },
  {
    source: "paper-clip",
    target: "paper-llava",
    type: "related",
  },
  {
    source: "paper-resnet",
    target: "paper-alexnet",
    type: "related",
  },
];
