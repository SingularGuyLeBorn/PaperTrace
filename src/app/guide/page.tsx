"use client";

import { useLang } from "@/lib/i18n";
import { Collapsible } from "@/components/Collapsible";

function Section({ title, titleZh, children }: { title: string; titleZh: string; children: React.ReactNode }) {
  const { t } = useLang();
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4 pb-2 border-b border-paper-200">
        {t(title, titleZh)}
      </h2>
      {children}
    </section>
  );
}

function Card({ icon, title, titleZh, desc, descZh, href }: {
  icon: string; title: string; titleZh: string; desc: string; descZh: string; href?: string;
}) {
  const { t } = useLang();
  const inner = (
    <div className="bg-white border border-paper-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all h-full">
      <div className="text-xl mb-2">{icon}</div>
      <div className="font-semibold text-sm mb-1">{t(title, titleZh)}</div>
      <div className="text-xs text-paper-800/60 leading-relaxed">{t(desc, descZh)}</div>
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>;
  return inner;
}

export default function GuidePage() {
  const { t } = useLang();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("Research Guide", "科研指南")}
        </h1>
        <p className="text-paper-800/60 max-w-2xl leading-relaxed">
          {t(
            "How to read papers efficiently, tools to use, prompts that work, and how to write. Distilled from practice.",
            "如何高效精读论文、工具推荐、有效的 prompt、以及如何写作。来自实践的提炼。"
          )}
        </p>
      </div>

      {/* ============ Why PaperTrace: Learning Science Motivation ============ */}
      <section className="mb-12 p-6 bg-amber-50 border border-amber-200 rounded-xl">
        <h2 className="text-lg font-bold mb-3">
          {t("Why Visualizations + Examples?", "为什么要可视化 + 举例？")}
        </h2>
        <p className="text-sm text-paper-800/80 leading-relaxed mb-4">
          {t(
            "A 2014 study in the Postgraduate Medical Journal found that 87% of people connect with multiple learning styles — especially when auditory learning is combined with other methods. The VARK model identifies four primary styles: Visual, Auditory, Read/Write, and Kinesthetic.",
            "2014 年发表在《研究生医学杂志》的研究表明，87% 的人与多种学习风格相连接，特别是将听觉学习与其他方法结合时。VARK 模型识别了四种主要学习风格：视觉、听觉、阅读/写作和动觉。"
          )}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { icon: "👁️", title: "Visual", titleZh: "视觉", desc: "Diagrams, attention maps, flow charts", descZh: "图表、注意力图、流程图" },
            { icon: "👂", title: "Auditory", titleZh: "听觉", desc: "Walk-through narration, step-by-step explanations", descZh: "逐步讲解、step-by-step 解释" },
            { icon: "📖", title: "Read/Write", titleZh: "阅读/写作", desc: "Detailed formula breakdowns, annotated equations", descZh: "公式逐项拆解、带注释的公式" },
            { icon: "🖐️", title: "Kinesthetic", titleZh: "动觉", desc: "Interactive widgets — adjust parameters, see results", descZh: "交互 widget — 调整参数，即时看到结果" },
          ].map((s) => (
            <div key={s.title} className="bg-white rounded-lg p-3 border border-amber-200">
              <div className="text-lg mb-1">{s.icon}</div>
              <div className="font-semibold text-xs mb-1">{t(s.title, s.titleZh)}</div>
              <div className="text-xs text-paper-800/60">{t(s.desc, s.descZh)}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-paper-800/70 leading-relaxed">
          {t(
            "The 70-20-10 rule also suggests that 70% of learning comes from practice, 20% from social interaction, and only 10% from traditional training. That's why PaperTrace uses interactive examples (70%), connection to related papers (20%), and structured explanations (10%) — not just passive reading.",
            "70-20-10 学习法则也表明，70% 的学习来自实践，20% 来自社交互动，仅 10% 来自传统培训。这就是为什么 PaperTrace 用交互式例子 (70%)、论文之间的关联 (20%) 和结构化讲解 (10%) — 而不只是被动阅读。"
          )}
        </p>
        <p className="text-xs text-paper-800/40 mt-3">
          {t(
            "Source: Fleming & Mills (1992) VARK model; Postgraduate Medical Journal (2014); Lombardo (1996) 70-20-10 model",
            "来源：Fleming & Mills (1992) VARK 模型；《研究生医学杂志》(2014)；Lombardo (1996) 70-20-10 模型"
          )}
        </p>
      </section>

      {/* ============ How to Read ============ */}
      <Section title="How to Read a Paper" titleZh="如何精读论文">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 leading-relaxed">
            {t(
              "The 3-pass method (Keshav 2007): don't read linearly. Three focused passes, each with a different goal.",
              "三遍法 (Keshav 2007)：不要线性阅读。三次有目的的阅读，每次目标不同。"
            )}
          </p>
        </div>

        <div className="space-y-4">
          <div className="border border-paper-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">1</span>
              <span className="font-semibold">{t("Pass 1: 5-10 min — Skim for structure", "第一遍：5-10 分钟 — 略读结构")}</span>
            </div>
            <ul className="text-sm text-paper-800/70 space-y-1 pl-10">
              <li>{t("Read title, abstract, intro, section headers, conclusion", "读标题、摘要、引言、章节标题、结论")}</li>
              <li>{t("Look at all figures — they usually tell the whole story", "看所有图表 — 它们通常讲述了整个故事")}</li>
              <li>{t("Answer: What is the problem? What is the solution? Are there experiments?", "回答：问题是什么？解决方案是什么？有实验吗？")}</li>
              <li>{t("Decide: worth reading further? (most papers: no)", "决定：值得继续读吗？(大多数论文：不值)")}</li>
            </ul>
          </div>

          <div className="border border-paper-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">2</span>
              <span className="font-semibold">{t("Pass 2: 30-60 min — Read carefully, skip proofs", "第二遍：30-60 分钟 — 仔细阅读，跳过证明")}</span>
            </div>
            <ul className="text-sm text-paper-800/70 space-y-1 pl-10">
              <li>{t("Read with a pencil — annotate everything", "拿笔读 — 注释所有东西")}</li>
              <li>{t("Mark equations you don't understand — don't get stuck", "标记不理解的公式 — 不要卡住")}</li>
              <li>{t("Note the key contributions (usually 3-5 things)", "记录核心贡献 (通常 3-5 条)")}</li>
              <li>{t("Read related work to understand positioning", "阅读相关工作了解论文定位")}</li>
            </ul>
          </div>

          <div className="border border-paper-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">3</span>
              <span className="font-semibold">{t("Pass 3: 1-5 hours — Virtually re-implement", "第三遍：1-5 小时 — 虚拟复现")}</span>
            </div>
            <ul className="text-sm text-paper-800/70 space-y-1 pl-10">
              <li>{t("Every claim, every equation — verify you can re-derive it", "每个论断、每个公式 — 验证你能自己推导出来")}</li>
              <li>{t("Find every assumption and question it", "找出每个假设并质疑它")}</li>
              <li>{t("Think: how would I have done this differently?", "思考：我会怎么不同地做这件事？")}</li>
              <li>{t("Identify future work directions", "识别未来工作方向")}</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ============ Claude Prompts ============ */}
      <Section title="Prompts for Reading Papers with AI" titleZh="用 AI 辅助精读论文的 Prompt 模板">
        <div className="space-y-4">
          {[
            {
              title: "Structure Overview",
              titleZh: "结构总览",
              prompt: `I'm reading a paper. Here's the abstract:

[PASTE ABSTRACT]

Give me:
1. The problem being solved (1-2 sentences)
2. The core method/insight (1-3 bullet points)
3. Key results (1-3 metrics)
4. What I need to know first (prerequisites)
5. How it relates to [RELATED WORK]`,
              promptZh: `我在读一篇论文。这是摘要：

[粘贴摘要]

请给我：
1. 正在解决的问题 (1-2 句)
2. 核心方法/洞察 (1-3 条)
3. 关键结果 (1-3 个指标)
4. 需要的前置知识
5. 与 [相关工作] 的关系`,
            },
            {
              title: "Formula Breakdown",
              titleZh: "公式拆解",
              prompt: `Explain this formula from a paper step by step:

[PASTE FORMULA]

Context: [WHAT THE PAPER IS ABOUT]

For each variable/operator:
- What does it represent intuitively?
- What values can it take?
- Why is it there?

Then give me a concrete numerical example.`,
              promptZh: `逐步解释这个论文中的公式：

[粘贴公式]

背景：[论文的主题]

对每个变量/算子：
- 它直觉上代表什么？
- 它可以取什么值？
- 为什么需要它？

然后给我一个具体的数值例子。`,
            },
            {
              title: "Critical Analysis",
              titleZh: "批判性分析",
              prompt: `I've read this paper: [TITLE]
Core method: [BRIEF DESCRIPTION]

Please analyze:
1. What assumptions does it make? Are they justified?
2. What are the weakest points of the experiments?
3. What baselines are missing?
4. What does it not handle that I should be aware of?
5. What follow-up experiments would be most revealing?`,
              promptZh: `我读了这篇论文：[标题]
核心方法：[简要描述]

请分析：
1. 它做了哪些假设？这些假设合理吗？
2. 实验最薄弱的地方是什么？
3. 缺少哪些 baseline？
4. 它无法处理什么，我需要注意的？
5. 哪些后续实验最有揭示性？`,
            },
          ].map((p, i) => (
            <div key={i} className="border border-paper-200 rounded-lg overflow-hidden">
              <div className="bg-paper-100 px-4 py-2 text-sm font-medium">
                {t(p.title, p.titleZh)}
              </div>
              <pre className="p-4 text-xs font-mono text-paper-800/80 leading-relaxed overflow-x-auto bg-white whitespace-pre-wrap">
                {t(p.prompt, p.promptZh)}
              </pre>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ Tools ============ */}
      <Section title="Essential Tools" titleZh="必备工具">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-paper-800/50 uppercase tracking-wider mb-3">
              {t("Finding Papers", "找论文")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Card icon="🔍" title="Semantic Scholar" titleZh="Semantic Scholar"
                desc="Best for finding related work + citation context. The 'Highly Influential' filter is gold."
                descZh="找相关工作最好用 + 引用上下文。「高影响力引用」过滤器非常有价值。"
                href="https://semanticscholar.org" />
              <Card icon="📄" title="arXiv" titleZh="arXiv"
                desc="The primary source. Use arXiv Sanity (by Karpathy) for ML papers."
                descZh="原始来源。ML 论文用 arXiv Sanity (by Karpathy)。"
                href="https://arxiv.org" />
              <Card icon="🕸️" title="Connected Papers" titleZh="Connected Papers"
                desc="Visualizes citation graph — shows which papers cluster together. Great for exploring a new area."
                descZh="可视化引用图 — 显示哪些论文聚集在一起。探索新领域很好用。"
                href="https://connectedpapers.com" />
              <Card icon="💻" title="Papers With Code" titleZh="Papers With Code"
                desc="Benchmark leaderboards + code links. Check if there's an implementation before reimplementing."
                descZh="Benchmark 排行榜 + 代码链接。重新实现之前先看有没有现成代码。"
                href="https://paperswithcode.com" />
              <Card icon="🤗" title="Hugging Face Daily Papers" titleZh="HuggingFace 每日论文"
                desc="Community curated arXiv highlights — good signal for what's trending."
                descZh="社区精选 arXiv 亮点 — 了解趋势的好信号。"
                href="https://huggingface.co/papers" />
              <Card icon="🔗" title="Google Scholar" titleZh="Google Scholar"
                desc="Citation alerts — set up to track when a key paper gets cited."
                descZh="引用提醒 — 设置跟踪关键论文何时被引用。"
                href="https://scholar.google.com" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-paper-800/50 uppercase tracking-wider mb-3">
              {t("Managing Literature", "管理文献")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Card icon="📚" title="Zotero" titleZh="Zotero"
                desc="Free, open-source. Best browser plugin for saving papers. Syncs across devices."
                descZh="免费开源。最好的浏览器插件保存论文。跨设备同步。"
                href="https://zotero.org" />
              <Card icon="📝" title="Notion" titleZh="Notion"
                desc="Build a personal paper wiki. Template: Problem | Method | Experiments | Takeaway | Questions."
                descZh="建立个人论文 wiki。模板：问题 | 方法 | 实验 | 收获 | 问题。"
                href="https://notion.so" />
              <Card icon="✍️" title="Obsidian" titleZh="Obsidian"
                desc="Local-first markdown notes with bidirectional links — great for building a concept graph."
                descZh="本地优先的 Markdown 笔记，双向链接 — 非常适合构建概念图。"
                href="https://obsidian.md" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-paper-800/50 uppercase tracking-wider mb-3">
              {t("Writing & Experiments", "写作与实验")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Card icon="🔬" title="Weights & Biases" titleZh="Weights & Biases"
                desc="Experiment tracking. Free for academics. Essential for ablations."
                descZh="实验追踪。学术用途免费。消融实验必备。"
                href="https://wandb.ai" />
              <Card icon="📊" title="Overleaf" titleZh="Overleaf"
                desc="Online LaTeX editor. Use NeurIPS/ICML/ICLR templates."
                descZh="在线 LaTeX 编辑器。使用 NeurIPS/ICML/ICLR 模板。"
                href="https://overleaf.com" />
              <Card icon="🗓️" title="AI Conference Deadlines" titleZh="AI 会议截止日期"
                desc="aideadlines.com — all major ML conference deadlines in one place."
                descZh="aideadlines.com — 所有主要 ML 会议截止日期汇总。"
                href="https://aideadlin.es" />
            </div>
          </div>
        </div>
      </Section>

      {/* ============ Paper Writing ============ */}
      <Section title="Writing Papers" titleZh="写论文">
        <Collapsible title={t("Standard paper structure", "标准论文结构")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-4">
              <span className="font-semibold">Abstract</span>
              <span>{t("4 sentences: problem, current state, your approach, result. Write last.", "4 句话：问题、现状、你的方法、结果。最后写。")}</span>
              <span className="font-semibold">Introduction</span>
              <span>{t("Motivation → gap in existing work → your idea → contributions (bullets) → roadmap.", "动机 → 现有工作的空缺 → 你的想法 → 贡献 (条目) → 路线图。")}</span>
              <span className="font-semibold">Related Work</span>
              <span>{t("Position your work. Don't just list papers — explain what each does and why yours is different.", "定位你的工作。不要只列论文 — 解释每篇做了什么以及你的论文有何不同。")}</span>
              <span className="font-semibold">Method</span>
              <span>{t("Top-down: overview first, then details. Every equation needs a sentence before and after.", "自顶向下：先总览，再细节。每个公式前后都需要一句话说明。")}</span>
              <span className="font-semibold">Experiments</span>
              <span>{t("Setup → main results → ablations → analysis. Ablations are the most important part.", "设置 → 主要结果 → 消融 → 分析。消融实验是最重要的部分。")}</span>
              <span className="font-semibold">Conclusion</span>
              <span>{t("Summary + limitations + future work. Limitations make reviewers trust you.", "总结 + 局限性 + 未来工作。局限性让审稿人相信你。")}</span>
            </div>
          </div>
        </Collapsible>

        <Collapsible title={t("Conference deadlines cheat sheet", "会议截止日期速查")}>
          <div className="text-sm">
            <div className="grid grid-cols-[120px_1fr_100px] gap-y-2 gap-x-4">
              <span className="font-semibold">NeurIPS</span>
              <span>{t("Abstract: May, Full: May", "摘要: 5月, 全文: 5月")}</span>
              <span className="text-paper-800/50">Dec</span>
              <span className="font-semibold">ICML</span>
              <span>{t("Abstract: Jan, Full: Jan", "摘要: 1月, 全文: 1月")}</span>
              <span className="text-paper-800/50">Jul</span>
              <span className="font-semibold">ICLR</span>
              <span>{t("Full: Oct", "全文: 10月")}</span>
              <span className="text-paper-800/50">May</span>
              <span className="font-semibold">ACL/EMNLP</span>
              <span>{t("Full: Feb/Jun", "全文: 2月/6月")}</span>
              <span className="text-paper-800/50">Aug/Dec</span>
            </div>
            <p className="mt-3 text-paper-800/50">
              {t("Check exact dates at ", "查看精确日期: ")}
              <a href="https://aideadlin.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aideadlin.es</a>
            </p>
          </div>
        </Collapsible>
      </Section>
    </div>
  );
}
