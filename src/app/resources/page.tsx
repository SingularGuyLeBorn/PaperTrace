"use client";

import { useLang } from "@/lib/i18n";

interface Resource {
  name: string;
  desc: string;
  descZh: string;
  href: string;
  type: "youtube" | "bilibili" | "xiaohongshu" | "wechat" | "newsletter" | "podcast" | "blog" | "tool" | "bookmark" | "twitter" | "github" | "productivity";
  tags?: string[];
  recommended?: boolean;
  note?: string;
  noteZh?: string;
}

const resources: Resource[] = [
  // YouTube
  { name: "Andrej Karpathy", href: "https://www.youtube.com/@AndrejKarpathy", type: "youtube",
    desc: "Code-first explanations of LLMs from scratch. The best for building deep intuition.", descZh: "从零开始的代码优先 LLM 讲解。建立深度直觉的最佳资源。", recommended: true, tags: ["LLM", "Architecture"] },
  { name: "Yannic Kilcher", href: "https://www.youtube.com/@YannicKilcher", type: "youtube",
    desc: "Deep paper reads with live commentary. Strong research taste, goes beyond the abstract.", descZh: "深度论文阅读加实时评论。研究品味高，不止步于摘要。", recommended: true, tags: ["Paper Reading", "NLP"] },
  { name: "Umar Jamil", href: "https://www.youtube.com/@umarjamilai", type: "youtube",
    desc: "Implementation-focused — watches you build Transformers, VAEs, etc from scratch in PyTorch.", descZh: "以实现为主 — 带你用 PyTorch 从零实现 Transformer、VAE 等。", tags: ["Implementation", "PyTorch"] },
  { name: "Two Minute Papers", href: "https://www.youtube.com/@TwoMinutePapers", type: "youtube",
    desc: "Fast 2-5 min overviews of new papers. Good for staying current, not for depth.", descZh: "2-5 分钟快速概览新论文。适合跟进最新进展，不适合深入理解。", tags: ["News", "Overview"] },
  { name: "3Blue1Brown", href: "https://www.youtube.com/@3blue1brown", type: "youtube",
    desc: "Beautiful visualizations of math/ML fundamentals. The neural network series is required viewing.", descZh: "数学/ML 基础的精美可视化。神经网络系列是必看内容。", recommended: true, tags: ["Math", "Visualization"] },
  // Bilibili
  { name: "跟李沐学AI", href: "https://space.bilibili.com/1567748478", type: "bilibili",
    desc: "Best Chinese ML content. Paper reading sessions, course lectures, intuitive explanations.", descZh: "中文最好的 ML 内容。论文精读、课程讲座、直觉讲解。", recommended: true, tags: ["Chinese", "Paper Reading", "Course"] },
  { name: "张小珺商业访谈录", href: "https://space.bilibili.com/280780745", type: "bilibili",
    desc: "In-depth interviews with AI startup founders and researchers — Kimi, DeepSeek, major tech AI leads. Also on Xiaoyuzhou podcast.", descZh: "深度访谈 AI 创业者和研究者 — Kimi、DeepSeek、各大厂 AI 负责人。同时在小宇宙播客发布。", recommended: true, tags: ["Chinese", "Interview", "Startup"] },
  { name: "WhyNotTV (为什么不)", href: "https://space.bilibili.com/14145636", type: "bilibili",
    desc: "Science and tech explanations with great visualizations. Covers AI concepts accessibly for a broad audience.", descZh: "科技知识可视化讲解，AI 内容通俗易懂，适合广泛受众。", tags: ["Chinese", "Science", "Visualization"] },
  { name: "3Blue1Brown 中文", href: "https://space.bilibili.com/88461692", type: "bilibili",
    desc: "Chinese re-upload of 3Blue1Brown's animation videos.", descZh: "3Blue1Brown 的中文搬运，动画视频。", tags: ["Chinese", "Math"] },
  { name: "深度之眼", href: "https://space.bilibili.com/375038855", type: "bilibili",
    desc: "Systematic ML course series, covers fundamentals to advanced topics.", descZh: "系统性 ML 课程系列，从基础到进阶。", tags: ["Chinese", "Course"] },
  // Xiaohongshu
  { name: "搜索关键词：大模型 / LLM科研 / AI论文 / 机器学习入门",
    href: "https://www.xiaohongshu.com/search_result?keyword=%E5%A4%A7%E6%A8%A1%E5%9E%8B",
    type: "xiaohongshu",
    desc: "Xiaohongshu has a large volume of AI/ML study notes. Search: \"大模型\", \"AI科研\", \"论文精读\", \"机器学习入门\" to find creators.",
    descZh: "小红书有大量 AI/ML 学习笔记。搜索「大模型」「AI科研」「论文精读」「机器学习入门」发现优质创作者。",
    tags: ["Chinese", "Notes", "Beginner-Friendly"] },
  // Newsletters
  { name: "The Batch (DeepLearning.AI)", href: "https://www.deeplearning.ai/the-batch/", type: "newsletter",
    desc: "Weekly AI newsletter by Andrew Ng. Balanced coverage of research + industry.", descZh: "吴恩达的每周 AI 简报。研究与工业界均衡报道。", recommended: true, tags: ["Weekly", "Broad Coverage"] },
  { name: "Ahead of AI (Sebastian Raschka)", href: "https://magazine.sebastianraschka.com", type: "newsletter",
    desc: "Deep technical dives. Best for understanding recent LLM research thoroughly.", descZh: "深度技术解析。深入理解最新 LLM 研究的最佳选择。", recommended: true, tags: ["Technical", "LLM"] },
  { name: "Import AI (Jack Clark)", href: "https://importai.substack.com", type: "newsletter",
    desc: "Weekly policy + research mix. Nuanced takes on AI safety and governance.", descZh: "每周政策 + 研究混合。对 AI 安全和治理的细致分析。", tags: ["Safety", "Policy"] },
  { name: "The Gradient", href: "https://thegradient.pub", type: "newsletter",
    desc: "Long-form technical articles. High quality, peer-reviewed content.", descZh: "长篇技术文章。高质量经过同行评审的内容。", tags: ["Technical", "Long-form"] },
  // WeChat
  { name: "机器之心", href: "https://www.jiqizhixin.com", type: "wechat",
    desc: "Top Chinese AI media. Fastest news coverage, industry updates.", descZh: "顶级中文 AI 媒体。最快的新闻报道，行业动态。", tags: ["News", "Chinese"] },
  { name: "量子位", href: "https://www.qbitai.com", type: "wechat",
    desc: "Chinese AI news + analysis. Covers both research papers and product launches.", descZh: "中文 AI 新闻 + 分析。同时报道研究论文和产品发布。", tags: ["News", "Chinese"] },
  { name: "新智元", href: "https://www.ainews.com.cn", type: "wechat",
    desc: "Major Chinese AI media outlet. Deep coverage of AI research, industry, and policy — especially strong on frontier model releases.", descZh: "重要中文 AI 媒体。深度报道 AI 研究、行业和政策 — 对前沿模型发布覆盖尤为深入。", tags: ["News", "Chinese"], recommended: true },
  // X / Twitter
  { name: "DeepSeek (@deepseek_ai)", href: "https://x.com/deepseek_ai", type: "twitter",
    desc: "Official DeepSeek account. First-hand announcements of model releases, technical reports, and API updates.", descZh: "DeepSeek 官方账号。第一手的模型发布、技术报告和 API 更新公告。", tags: ["Official", "Research"], recommended: true },
  { name: "Andrej Karpathy (@karpathy)", href: "https://x.com/karpathy", type: "twitter",
    desc: "Deep takes on LLMs, AI education, and the future of software. Essential follow for anyone serious about ML.", descZh: "对 LLM、AI 教育和软件未来的深度思考。认真学 ML 的人必关注。", recommended: true, tags: ["LLM", "Education"] },
  { name: "Yann LeCun (@ylecun)", href: "https://x.com/ylecun", type: "twitter",
    desc: "Meta AI Chief Scientist. Contrarian views on AGI, strong opinions on architecture and benchmarks. Always worth reading.", descZh: "Meta AI 首席科学家。对 AGI 的反主流观点，对架构和基准的独到见解。", tags: ["Research", "Industry"] },
  { name: "Jim Fan (@drjimfan)", href: "https://x.com/drjimfan", type: "twitter",
    desc: "NVIDIA AI researcher. Excellent explainer threads on embodied AI, agents, and frontier model capabilities.", descZh: "英伟达 AI 研究员。关于具身 AI、智能体和前沿模型能力的优质解说帖。", recommended: true, tags: ["Agents", "Embodied AI"] },
  { name: "François Chollet (@fchollet)", href: "https://x.com/fchollet", type: "twitter",
    desc: "Keras creator, ARC-AGI benchmark author. Sharp takes on reasoning, generalization, and what intelligence actually means.", descZh: "Keras 创始人，ARC-AGI 基准作者。对推理、泛化和智能本质的深刻见解。", tags: ["Research", "AGI"] },
  { name: "宝玉xp (@dotey)", href: "https://x.com/dotey", type: "twitter",
    desc: "High-quality Chinese translations of key AI papers, tweets, and threads. Essential bridge between English AI discourse and Chinese community.", descZh: "高质量中文翻译 AI 论文、推文和长帖。英文 AI 圈和中文社区之间的重要桥梁。", recommended: true, tags: ["Chinese", "Translation"] },
  { name: "罗福莉 (@_LuoFuli)", href: "https://x.com/_LuoFuli", type: "twitter",
    desc: "Sharp takes on AI industry trends, startup moves, and product launches from a Chinese tech insider perspective.", descZh: "从中文科技圈视角对 AI 行业动态、创业动向和产品发布的精准点评。", tags: ["Chinese", "Industry"] },
  // Blogs — International
  { name: "Lil'Log (Lilian Weng, OpenAI)", href: "https://lilianweng.github.io", type: "blog",
    desc: "Deep technical posts on RL, diffusion, and attention. The best technical summaries of entire subfields.", descZh: "关于 RL、扩散模型和注意力机制的深度技术文章。整个子领域最好的技术摘要。", recommended: true, tags: ["Survey", "LLM", "RL"] },
  { name: "Sebastian Ruder's Blog", href: "https://www.ruder.io", type: "blog",
    desc: "NLP and transfer learning deep-dives. Essential reading for language model researchers.", descZh: "NLP 和迁移学习的深度解析。语言模型研究者的必读内容。", tags: ["NLP", "Transfer Learning"] },
  { name: "The Gradient", href: "https://thegradient.pub", type: "blog",
    desc: "Long-form AI research journalism. High-quality editorial coverage of the field.", descZh: "长篇 AI 研究报道。高质量的领域编辑报道。", tags: ["Long-form", "Research"] },
  { name: "Andrej Karpathy's Blog", href: "https://karpathy.github.io", type: "blog",
    desc: "Classic posts like 'The Unreasonable Effectiveness of RNNs'. Rare but gold posts on LLMs and neural nets.", descZh: "经典文章如「RNN 的不合理有效性」。关于 LLM 和神经网络的稀少但精品的文章。", tags: ["Classic", "LLM"] },
  { name: "Eugene Yan", href: "https://eugeneyan.com", type: "blog",
    desc: "ML systems and LLM applications. Practical, engineering-focused perspective.", descZh: "ML 系统和 LLM 应用。实践性强，工程视角。", tags: ["ML Systems", "LLM Applications"] },
  // Blogs — Chinese
  { name: "苏剑林 (科学空间)", href: "https://kexue.fm", type: "blog",
    desc: "Deep mathematical derivations in Chinese. The go-to for understanding the theory behind attention, diffusion, etc.", descZh: "国内最深度的 NLP/扩散模型技术博客。理解注意力、扩散等理论的首选。", recommended: true, tags: ["Math", "Chinese", "Theory"] },
  { name: "张俊林博客", href: "https://blog.csdn.net/malefactor", type: "blog",
    desc: "One of the best Chinese explanations of BERT and pre-trained language models.", descZh: "BERT/预训练模型中文最好解读之一。", tags: ["Chinese", "BERT", "Pre-training"] },
  // Podcasts
  { name: "Lex Fridman Podcast", href: "https://lexfridman.com/podcast/", type: "podcast",
    desc: "Long-form interviews with top AI researchers. Better for inspiration than technical depth.", descZh: "与顶级 AI 研究者的长篇访谈。更适合激励而非技术深度。", tags: ["Interview", "Inspiration", "English"] },
  { name: "The TWIML AI Podcast", href: "https://twimlai.com/podcast/twimlai/", type: "podcast",
    desc: "This Week in ML & AI — weekly research interviews covering the breadth of the field.", descZh: "This Week in ML & AI — 每周研究访谈，覆盖领域广泛。", tags: ["Weekly", "Research", "English"] },
  { name: "Machine Learning Street Talk", href: "https://www.youtube.com/@MachineLearningStreetTalk", type: "podcast",
    desc: "Technical ML podcast, researcher-first perspective. Challenging and rewarding.", descZh: "技术 ML 播客，研究者视角。有挑战性但很有价值。", tags: ["Technical", "Research"] },
  { name: "AI浪潮 (小宇宙)", href: "https://www.xiaoyuzhoufm.com", type: "podcast",
    desc: "Chinese AI news and trends. Good for keeping up with the Chinese AI ecosystem.", descZh: "中文 AI 新闻和趋势。适合了解中国 AI 生态。", tags: ["Chinese", "News"] },
  { name: "硬地骇客 (小宇宙)", href: "https://www.xiaoyuzhoufm.com", type: "podcast",
    desc: "Tech startup founder interviews including AI content. Practical builder perspective.", descZh: "技术创业者访谈，含 AI 内容。实践创业者视角。", tags: ["Chinese", "Startup"] },
  // Tools
  { name: "Distill.pub", href: "https://distill.pub", type: "tool",
    desc: "Interactive ML articles with visualizations (attention, CNNs, etc.). Inactive since 2021 but all articles remain gold.", descZh: "带可视化的交互式 ML 文章（注意力、CNN 等）。2021 年后停更，但所有文章仍是精品。", recommended: true, tags: ["Visualization", "Interactive"] },
  { name: "3B1B Neural Networks", href: "https://www.3blue1brown.com/topics/neural-networks", type: "tool",
    desc: "Visual math explanations for neural networks. Best companion for learning the fundamentals.", descZh: "神经网络的视觉化数学讲解。学习基础知识的最佳伴侣。", recommended: true, tags: ["Visualization", "Math"] },
  { name: "Transformer Explainer", href: "https://poloclub.github.io/transformer-explainer", type: "tool",
    desc: "Interactive GPT-2 walkthrough in your browser. Visualize how tokens flow through the transformer.", descZh: "在浏览器中交互式体验 GPT-2。可视化 token 如何流经 Transformer。", tags: ["Interactive", "Transformer"] },
  { name: "Attention Visualizer (BertViz)", href: "https://github.com/jessevig/bertviz", type: "tool",
    desc: "Visualize BERT/GPT attention heads. Great for building intuition about what attention actually learns.", descZh: "可视化 BERT/GPT 的注意力头。非常适合建立对注意力机制实际学习内容的直觉。", tags: ["Visualization", "Attention"] },
  { name: "PyTorch Tutorials", href: "https://pytorch.org/tutorials", type: "tool",
    desc: "Official PyTorch learning path. The most reliable way to learn the framework from the ground up.", descZh: "官方 PyTorch 学习路径。从零开始学习框架的最可靠方式。", tags: ["PyTorch", "Tutorial"] },
  { name: "Hugging Face Courses", href: "https://huggingface.co/learn", type: "tool",
    desc: "Free NLP/diffusion courses with code. Practical and up-to-date with current ecosystem.", descZh: "免费的 NLP/扩散模型课程，含代码。实用且与当前生态同步。", recommended: true, tags: ["NLP", "Course", "Free"] },
  { name: "Fast.ai", href: "https://www.fast.ai", type: "tool",
    desc: "Practical DL course with a top-down approach. Start coding immediately, understand theory later.", descZh: "自上而下的实用深度学习课程。立即开始编码，之后再理解理论。", tags: ["Course", "Practical"] },
  { name: "The Missing Semester of Your CS Education (MIT)", href: "https://missing.csail.mit.edu/", type: "tool",
    desc: "MIT course covering the tools CS programs never teach: shell, scripting, Git, Vim, tmux, debugging, profiling, and more. Essential for anyone who spends time at a terminal.", descZh: "MIT 课程，覆盖 CS 专业从不教的工具：shell、脚本、Git、Vim、tmux、调试、性能分析等。任何要在终端工作的人必看。", recommended: true, tags: ["Course", "Tools", "Free", "MIT"] },
  { name: "Weights & Biases Blog", href: "https://wandb.ai/fully-connected", type: "tool",
    desc: "ML practitioner blog with great tutorials on training, experiment tracking, and LLM fine-tuning.", descZh: "ML 实践者博客，有关于训练、实验跟踪和 LLM 微调的优质教程。", tags: ["Tutorial", "MLOps"] },
  { name: "MiniMind", href: "https://www.minimind.wiki/", type: "tool",
    desc: "Understand LLM training from scratch — no black boxes. Through controlled experiments, deeply understand every design choice in LLMs.",
    descZh: "从零理解 LLM 训练，不再黑盒训练 — 通过对照实验彻底理解 LLM 的每个设计选择。",
    recommended: true, tags: ["Chinese", "From Scratch", "LLM", "Hands-on"] },

  // Productivity
  { name: "Claude / Claude Code", href: "https://claude.ai", type: "productivity",
    desc: "Anthropic's AI assistant and Claude Code CLI. Best-in-class for reading papers, writing code, and research workflows. Claude Code integrates directly into your terminal.", descZh: "Anthropic 的 AI 助手和 Claude Code CLI。阅读论文、编写代码和研究工作流的最佳选择。Claude Code 直接集成到终端。", recommended: true, tags: ["AI Assistant", "Coding", "Research"] },
  { name: "ChatGPT", href: "https://chat.openai.com", type: "productivity",
    desc: "OpenAI's flagship AI assistant. Strong for brainstorming, drafting, and code explanation. GPT-4o supports multimodal input.", descZh: "OpenAI 的旗舰 AI 助手。擅长头脑风暴、起草和代码解释。GPT-4o 支持多模态输入。", tags: ["AI Assistant", "Multimodal"] },
  { name: "Cursor", href: "https://cursor.sh", type: "productivity",
    desc: "AI-native IDE built on VS Code. Fastest way to navigate, edit, and understand large codebases with AI assistance.", descZh: "基于 VS Code 的 AI 原生 IDE。利用 AI 辅助浏览、编辑和理解大型代码库的最快方式。", recommended: true, tags: ["Coding", "IDE"] },
  { name: "Obsidian", href: "https://obsidian.md", type: "productivity",
    desc: "Local-first knowledge management with Markdown and bidirectional links. Ideal for building a personal research knowledge base and linking paper notes.", descZh: "基于 Markdown 和双向链接的本地优先知识管理工具。适合构建个人研究知识库和关联论文笔记。", recommended: true, tags: ["Note-taking", "PKM", "Research"] },
  { name: "Notion", href: "https://notion.so", type: "productivity",
    desc: "All-in-one workspace for notes, databases, and project management. Useful for organizing reading lists, research projects, and team collaboration.", descZh: "集笔记、数据库和项目管理于一体的工作空间。适合整理阅读清单、科研项目和团队协作。", tags: ["Note-taking", "Collaboration"] },
  { name: "Zotero", href: "https://www.zotero.org", type: "productivity",
    desc: "Free, open-source reference manager designed for researchers. Automatically extracts metadata from PDFs, organizes citations, and syncs across devices.", descZh: "免费开源的文献管理工具，专为研究者设计。自动从 PDF 提取元数据，整理引用，多设备同步。", recommended: true, tags: ["Reference Management", "Research", "Free"] },
  { name: "Elicit", href: "https://elicit.com", type: "productivity",
    desc: "AI research assistant for finding, summarizing, and synthesizing papers. Useful for literature reviews.", descZh: "AI 研究助手，用于查找、总结和综合论文。适合文献综述。", tags: ["AI Assistant", "Research", "Literature Review"] },

  // GitHub
  { name: "TransformerVisualizer", href: "https://github.com/SingularGuyLeBorn/TransformerVisualizer", type: "github",
    desc: "Interactive visual walkthrough of the Transformer architecture — attention heads, positional encoding, encoder-decoder flow, built from scratch.",
    descZh: "Transformer 架构的交互式可视化 — 注意力头、位置编码、编解码器流程，从零构建。",
    recommended: true, tags: ["Transformer", "Visualization", "Interactive"] },
  { name: "ResearchPaper-Analyzer", href: "https://github.com/aba122/ResearchPaper-Analyzer", type: "github",
    desc: "AI-powered research paper analyzer — automatically extracts key insights, summarizes contributions, and surfaces connections across papers.",
    descZh: "AI 驱动的论文分析工具 — 自动提取关键洞察、总结贡献，并发现论文间的关联。",
    tags: ["Paper Analysis", "AI Tool", "Research"] },

  // Bookmarks
  { name: "How To Ask Questions The Smart Way", href: "http://www.catb.org/~esr/faqs/smart-questions.html", type: "bookmark",
    desc: "Eric Raymond's classic guide on how to ask technical questions effectively in open source communities. Required reading before posting on Stack Overflow or any mailing list.", descZh: "Eric Raymond 的经典指南：如何在开源社区高效提问。在 Stack Overflow 或任何邮件列表发帖前的必读文章。", tags: ["Classic", "Community", "Communication"] },
  { name: "人生不可 DP，但别永远贪心", href: "https://hawstein.com/2019/04/24/life-cannot-dp-but-dont-be-always-greedy/", type: "bookmark",
    desc: "Uses DP and greedy algorithm metaphors to argue that always picking the locally optimal option traps you in a local optimum. Recommends introducing random perturbations to escape it.",
    descZh: "用动态规划和贪心算法类比人生决策，指出贪心策略会陷入局部最优。建议主动引入随机扰动，偶尔放弃眼前最优，获得更广阔的可能性。",
    recommended: true, tags: ["Essay", "Life", "CS Metaphor"] },
];

const typeConfig: Record<Resource["type"], { label: string; labelZh: string; icon: string; color: string }> = {
  youtube: { label: "YouTube", labelZh: "YouTube", icon: "▶", color: "bg-red-100 text-red-700" },
  bilibili: { label: "Bilibili", labelZh: "B 站", icon: "📺", color: "bg-blue-100 text-blue-700" },
  xiaohongshu: { label: "Xiaohongshu", labelZh: "小红书", icon: "📕", color: "bg-rose-100 text-rose-700" },
  wechat: { label: "WeChat / Blog", labelZh: "公众号 / 博客", icon: "📰", color: "bg-green-100 text-green-700" },
  newsletter: { label: "Newsletter", labelZh: "Newsletter", icon: "📬", color: "bg-purple-100 text-purple-700" },
  podcast: { label: "Podcast", labelZh: "播客", icon: "🎙", color: "bg-orange-100 text-orange-700" },
  blog: { label: "Blog", labelZh: "博客", icon: "✍️", color: "bg-teal-100 text-teal-700" },
  tool: { label: "Tool / Course", labelZh: "工具 / 课程", icon: "🔧", color: "bg-gray-100 text-gray-700" },
  bookmark: { label: "Bookmarks", labelZh: "收藏", icon: "🔖", color: "bg-amber-100 text-amber-700" },
  twitter: { label: "X / Twitter", labelZh: "X / Twitter", icon: "𝕏", color: "bg-slate-100 text-slate-700" },
  github: { label: "GitHub", labelZh: "GitHub", icon: "⌥", color: "bg-zinc-100 text-zinc-700" },
  productivity: { label: "Productivity", labelZh: "效率工具", icon: "⚡", color: "bg-violet-100 text-violet-700" },
};

const sections: { type: Resource["type"] | Resource["type"][]; title: string; titleZh: string }[] = [
  { type: "youtube", title: "YouTube", titleZh: "YouTube" },
  { type: "bilibili", title: "Bilibili (中文)", titleZh: "B 站 (中文)" },
  { type: "xiaohongshu", title: "小红书 (Xiaohongshu)", titleZh: "小红书 (Xiaohongshu)" },
  { type: "newsletter", title: "Newsletters", titleZh: "Newsletter" },
  { type: ["wechat", "blog", "twitter"], title: "Blogs, WeChat & X", titleZh: "博客 & 公众号 & X" },
  { type: "podcast", title: "Podcasts", titleZh: "播客" },
  { type: "tool", title: "Tools for Learning & Visualization", titleZh: "学习工具 & 可视化" },
  { type: "productivity", title: "AI Assistants & Productivity", titleZh: "AI 助手 & 效率工具" },
  { type: "github", title: "GitHub & Open Source", titleZh: "GitHub & 开源项目" },
  { type: "bookmark", title: "Bookmarks & Favorites", titleZh: "收藏" },
];

export default function ResourcesPage() {
  const { t, lang } = useLang();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold tracking-tight mb-3 dark:text-white">
          {t("Resources", "学习资源")}
        </h1>
        <p className="text-base text-paper-800/60 dark:text-slate-400 max-w-2xl leading-relaxed">
          {t(
            "Quality over quantity. These are the sources worth your time — curated for ML researchers and practitioners.",
            "质量优于数量。这些是值得你花时间的资源 — 为 ML 研究者和实践者精心整理。"
          )}
        </p>
      </div>

      <div className="space-y-14">
        {sections.map((section) => {
          const types = Array.isArray(section.type) ? section.type : [section.type];
          const items = resources.filter((r) => types.includes(r.type));
          return (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-bold mb-5 pb-3 border-b border-paper-200 dark:border-slate-700 tracking-tight dark:text-slate-100">
                {t(section.title, section.titleZh)}
              </h2>
              <div className="space-y-2.5">
                {items.map((r) => {
                  const tc = typeConfig[r.type];
                  return (
                    <a
                      key={r.name}
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all group"
                    >
                      <span className="text-xl mt-0.5 flex-shrink-0">{tc.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-sm dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{r.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.color}`}>
                            {t(tc.label, tc.labelZh)}
                          </span>
                          {r.tags?.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 bg-paper-100 dark:bg-slate-700 text-paper-800/50 dark:text-slate-400 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-paper-800/60 dark:text-slate-400 leading-relaxed">
                          {lang === "en" ? r.desc : r.descZh}
                        </p>
                      </div>
                      <span className="text-paper-800/30 dark:text-slate-600 group-hover:text-blue-500 text-sm mt-1 flex-shrink-0 transition-colors">↗</span>
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
