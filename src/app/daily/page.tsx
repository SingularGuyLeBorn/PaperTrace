"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/lib/i18n";
import { dailyPapers, allTags } from "@/lib/daily";
import Link from "next/link";

interface NewsItem {
  date: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  source: string;
  sourceUrl: string;
  tag: "Research" | "Release" | "Industry";
}

const newsItems: NewsItem[] = [
  // ── 2026 ──
  {
    date: "2026-04-04",
    title: "Claude Code Source Leaked via npm Source Maps",
    titleZh: "Claude Code 源码通过 npm Source Map 泄露",
    description: "Anthropic's Claude Code CLI source code was inadvertently exposed via npm source maps, revealing 1,884 TypeScript files across 36 folders. The leak exposed internal feature flags, unreleased agent modes (ultraplan, kairos-proactive), and architecture details. Anthropic has since patched the package.",
    descriptionZh: "Anthropic 的 Claude Code CLI 源码通过 npm source map 意外暴露，揭示了 36 个文件夹中的 1,884 个 TypeScript 文件。泄露内容包括内部功能标志、未发布的智能体模式（ultraplan、kairos-proactive）和架构细节。Anthropic 已修补该包。",
    source: "ccleaks.com Analysis",
    sourceUrl: "https://ccleaks.com/",
    tag: "Industry",
  },
  {
    date: "2026-04-03",
    title: "3 Security Flaws in Claude Code Allow Remote Code Execution",
    titleZh: "Claude Code 3 个安全漏洞允许远程代码执行",
    description: "Check Point Research identified three vulnerabilities (CVE-2025-59536, CVE-2026-21852) in Claude Code that allow attackers to run arbitrary code and steal API keys via malicious repositories.",
    descriptionZh: "Check Point Research 在 Claude Code 中发现三个漏洞（CVE-2025-59536、CVE-2026-21852），允许攻击者通过恶意仓库执行任意代码并窃取 API 密钥。",
    source: "Check Point Research",
    sourceUrl: "https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/",
    tag: "Industry",
  },
  {
    date: "2026-02-17",
    title: "Claude Sonnet 4.6 Released",
    titleZh: "Claude Sonnet 4.6 发布",
    description: "Anthropic released Claude Sonnet 4.6, delivering frontier performance across coding, agents, and professional work at scale.",
    descriptionZh: "Anthropic 发布 Claude Sonnet 4.6，在代码、智能体和专业工作中提供前沿性能。",
    source: "Anthropic News",
    sourceUrl: "https://www.anthropic.com/news",
    tag: "Release",
  },
  {
    date: "2026-02-05",
    title: "Claude Opus 4.6 Released — Powers Claude Code",
    titleZh: "Claude Opus 4.6 发布 — 驱动 Claude Code",
    description: "Anthropic released Claude Opus 4.6, upgrading their smartest model. Features extended thinking, improved agentic capabilities (coding, computer use, tool use, search, finance). An industry-leading model for agentic tasks.",
    descriptionZh: "Anthropic 发布 Claude Opus 4.6，升级最聪明的模型。具备扩展思考、增强智能体能力（代码、电脑操控、工具使用、搜索、金融）。在智能体任务上具有业界领先性能。",
    source: "Anthropic News",
    sourceUrl: "https://www.anthropic.com/news",
    tag: "Release",
  },
  {
    date: "2026-01-26",
    title: "DeepSeek-V3 Released — Efficient MoE at Scale",
    titleZh: "DeepSeek-V3 发布 — 高效大规模 MoE",
    description: "DeepSeek released V3, a 671B mixture-of-experts model trained with novel load-balancing and multi-token prediction. Strong coding and math performance at a fraction of the training cost of comparable models.",
    descriptionZh: "DeepSeek 发布 V3，671B 混合专家模型，采用新型负载均衡和多 token 预测。以极低训练成本实现强大的代码和数学性能。",
    source: "DeepSeek Blog",
    sourceUrl: "https://api-docs.deepseek.com/",
    tag: "Release",
  },
  // ── 2025 ──
  {
    date: "2025-04-28",
    title: "Qwen3 — Thinking Mode Toggle + Top Open Reasoning",
    titleZh: "Qwen3 — 思考模式切换 + 顶级开源推理",
    description: "Alibaba released Qwen3, including a 235B MoE flagship. Features a toggleable 'thinking mode' — switch between fast responses and deep chain-of-thought reasoning. Tops open-source reasoning benchmarks.",
    descriptionZh: "阿里巴巴发布 Qwen3，旗舰版为 235B MoE 模型。支持可切换的「思考模式」— 可在快速响应和深度思维链推理间切换。登顶开源推理基准。",
    source: "Qwen Blog",
    sourceUrl: "https://qwenlm.github.io/blog/qwen3/",
    tag: "Release",
  },
  {
    date: "2025-04-16",
    title: "OpenAI o3 & o4-mini Released",
    titleZh: "OpenAI o3 和 o4-mini 正式发布",
    description: "OpenAI released o3 (full model) and o4-mini. o3 scored 85.7% on ARC-AGI-1 and set new records on FrontierMath and SWE-bench. o4-mini offers similar reasoning at lower cost with \"think\" budget tokens.",
    descriptionZh: "OpenAI 发布 o3（完整版）和 o4-mini。o3 在 ARC-AGI-1 上得分 85.7%，在 FrontierMath 和 SWE-bench 上创下新纪录。o4-mini 以更低成本提供类似推理能力，支持「思考」预算 token。",
    source: "OpenAI Blog",
    sourceUrl: "https://openai.com/index/openai-o3-and-o4-mini-system-card/",
    tag: "Release",
  },
  {
    date: "2025-04-05",
    title: "LLaMA 4 — Meta's Multimodal MoE Frontier Models",
    titleZh: "LLaMA 4 — Meta 的多模态 MoE 前沿模型",
    description: "Meta released LLaMA 4 Scout (17Bx16E MoE) and Maverick (17Bx128E MoE). Both are natively multimodal with 10M token context on Scout. Open weights for research and commercial use.",
    descriptionZh: "Meta 发布 LLaMA 4 Scout（17Bx16E MoE）和 Maverick（17Bx128E MoE），均为原生多模态模型，Scout 支持 1000 万 token 上下文。开放权重，可商用。",
    source: "Meta AI Blog",
    sourceUrl: "https://ai.meta.com/blog/llama-4-multimodal-intelligence/",
    tag: "Release",
  },
  {
    date: "2025-03-25",
    title: "Gemini 2.5 Pro Preview — Strong Reasoning & 1M Context",
    titleZh: "Gemini 2.5 Pro 预览版 — 强推理与 100 万 token 上下文",
    description: "Google released Gemini 2.5 Pro as a preview via Google AI Studio and Gemini API. Features native thinking capabilities, 1M token context window, and strong performance on coding and math benchmarks.",
    descriptionZh: "谷歌通过 Google AI Studio 和 Gemini API 发布 Gemini 2.5 Pro 预览版。具备原生思考能力、100 万 token 上下文，在代码和数学基准测试上表现强劲。",
    source: "Google DeepMind Blog",
    sourceUrl: "https://deepmind.google/technologies/gemini/pro/",
    tag: "Release",
  },
  {
    date: "2025-02-24",
    title: "Claude 3.7 Sonnet + Extended Thinking",
    titleZh: "Claude 3.7 Sonnet + 扩展思考模式",
    description: "Anthropic released Claude 3.7 Sonnet with 'extended thinking' — the model can spend more tokens on internal reasoning before responding. Sets new SOTA on SWE-bench verified (70.3%) for software engineering.",
    descriptionZh: "Anthropic 发布 Claude 3.7 Sonnet，支持「扩展思考」— 模型在回答前可花费更多 token 进行内部推理。在软件工程基准 SWE-bench verified 上创下 70.3% 的新最优成绩。",
    source: "Anthropic News",
    sourceUrl: "https://www.anthropic.com/news/claude-3-7-sonnet",
    tag: "Release",
  },
  {
    date: "2025-01-20",
    title: "DeepSeek-R1 Open-Sourced — o1-Level Reasoning, MIT License",
    titleZh: "DeepSeek-R1 开源 — o1 级推理，MIT 协议",
    description: "DeepSeek released R1 fully open-weights under MIT license. Trained using pure RL (GRPO) without supervised chain-of-thought data, matching OpenAI o1 on math and coding benchmarks. Sent shockwaves through AI markets.",
    descriptionZh: "DeepSeek 以 MIT 协议完全开源 R1。纯 RL（GRPO）训练，无需监督思维链数据，数学和编程基准上与 OpenAI o1 相当。震动了 AI 市场。",
    source: "arXiv 2501.12948",
    sourceUrl: "https://arxiv.org/abs/2501.12948",
    tag: "Research",
  },
];

// Include dark: variants so Tailwind JIT picks them up
const tagColors: Record<NewsItem["tag"], string> = {
  Research: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  Release:  "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  Industry: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

const NEWS_PER_PAGE = 6;
const PAPERS_PER_PAGE = 20;

// Sort news newest first
const sortedNews = [...newsItems].sort((a, b) => b.date.localeCompare(a.date));

export default function DailyPage() {
  const { t, lang } = useLang();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showPicksOnly, setShowPicksOnly] = useState(false);
  const [papersPage, setPapersPage] = useState(1);
  const [newsPage, setNewsPage] = useState(1);
  const [newsSearch, setNewsSearch] = useState("");
  const [showNewsArchive, setShowNewsArchive] = useState(false);

  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  const filtered = useMemo(() => {
    return dailyPapers
      .filter((p) => {
        if (showPicksOnly && !p.pick) return false;
        if (activeTag && !p.tags.includes(activeTag)) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            (p.titleZh ?? "").includes(q) ||
            p.authors.toLowerCase().includes(q) ||
            p.why.toLowerCase().includes(q) ||
            p.whyZh?.includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [searchQuery, activeTag, showPicksOnly]);

  const formatMonth = (ym: string) => {
    const [y, m] = ym.split("-");
    const months = lang === "en"
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    return `${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 dark:text-slate-50">
          {t("Paper Feed", "论文推荐")}
        </h1>
        <p className="text-paper-800/60 dark:text-slate-400 leading-relaxed max-w-2xl">
          {t(
            "Curated ML papers with one-line takes on why they matter.",
            "精选 ML 论文"
          )}
        </p>
      </div>

      {/* News & Events */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold tracking-tight dark:text-slate-100">{t("News & Events", "行业动态")}</h2>
          <button
            onClick={() => setShowNewsArchive((v) => !v)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showNewsArchive ? t("Hide archive", "收起归档") : t("Show all", "查看全部")}
          </button>
        </div>
        <p className="text-sm text-paper-800/50 dark:text-slate-500 mb-4">
          {t("Recent happenings in AI research.", "AI 研究领域的近期动态。")}
        </p>

        {/* Featured hero — latest article */}
        {sortedNews[0] && (
          <div className="mb-4 bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-paper-800/40 dark:text-slate-500 font-mono">{sortedNews[0].date}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[sortedNews[0].tag]}`}>
                  {sortedNews[0].tag}
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 ml-1">LATEST</span>
              </div>
              <h3 className="font-bold text-lg leading-snug dark:text-slate-50 mb-2">
                {lang === "en" ? sortedNews[0].title : sortedNews[0].titleZh}
              </h3>
              <p className="text-sm text-paper-800/60 dark:text-slate-400 leading-relaxed mb-3">
                {lang === "en" ? sortedNews[0].description : sortedNews[0].descriptionZh}
              </p>
              <a href={sortedNews[0].sourceUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                {sortedNews[0].source} ↗
              </a>
            </div>
          </div>
        )}

        {/* 2-column grid for next 4 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {sortedNews.slice(1, 5).map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-paper-800/40 dark:text-slate-500 font-mono">{item.date}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[item.tag]}`}>
                  {item.tag}
                </span>
              </div>
              <h3 className="font-semibold text-sm leading-snug dark:text-slate-100 line-clamp-2">
                {lang === "en" ? item.title : item.titleZh}
              </h3>
              <p className="text-xs text-paper-800/60 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
                {lang === "en" ? item.description : item.descriptionZh}
              </p>
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                {item.source} ↗
              </a>
            </div>
          ))}
        </div>

        {sortedNews.length > 5 && (
          <button
            onClick={() => setShowNewsArchive(true)}
            className="w-full py-2 text-xs text-paper-800/40 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 border border-dashed border-paper-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            +{sortedNews.length - 5} {t("more articles", "条更多")} →
          </button>
        )}

        {/* Archive: searchable paginated list */}
        {showNewsArchive && (
          <div className="border border-paper-200 dark:border-slate-700 rounded-lg p-4 bg-paper-50 dark:bg-slate-900/60">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                placeholder={t("Search news...", "搜索动态...")}
                value={newsSearch}
                onChange={(e) => { setNewsSearch(e.target.value); setNewsPage(1); }}
                className="flex-1 px-3 py-1.5 text-sm border border-paper-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700/50"
              />
            </div>
            {(() => {
              const filteredNews = sortedNews.filter((n) => {
                if (!newsSearch) return true;
                const q = newsSearch.toLowerCase();
                return (
                  n.title.toLowerCase().includes(q) ||
                  n.titleZh.includes(q) ||
                  n.description.toLowerCase().includes(q) ||
                  n.source.toLowerCase().includes(q) ||
                  n.tag.toLowerCase().includes(q)
                );
              });
              const totalPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
              const pageItems = filteredNews.slice((newsPage - 1) * NEWS_PER_PAGE, newsPage * NEWS_PER_PAGE);
              return (
                <>
                  <div className="space-y-3">
                    {pageItems.map((item) => (
                      <div key={item.title} className="bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-700 rounded-lg p-3 hover:border-paper-300 dark:hover:border-slate-600 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-paper-800/40 dark:text-slate-500 font-mono">{item.date}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[item.tag]}`}>{item.tag}</span>
                            </div>
                            <h3 className="font-semibold text-sm mb-1 dark:text-slate-100">{lang === "en" ? item.title : item.titleZh}</h3>
                            <p className="text-xs text-paper-800/60 dark:text-slate-400 leading-relaxed">{lang === "en" ? item.description : item.descriptionZh}</p>
                          </div>
                          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                            className="flex-none text-xs text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">{item.source} ↗</a>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <button onClick={() => setNewsPage((p) => Math.max(1, p - 1))} disabled={newsPage === 1}
                        className="px-3 py-1 text-xs rounded-md border border-paper-200 dark:border-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-paper-100 dark:hover:bg-slate-700">
                        {t("Prev", "上一页")}
                      </button>
                      <span className="text-xs text-paper-800/50 dark:text-slate-500">{newsPage} / {totalPages}</span>
                      <button onClick={() => setNewsPage((p) => Math.min(totalPages, p + 1))} disabled={newsPage === totalPages}
                        className="px-3 py-1 text-xs rounded-md border border-paper-200 dark:border-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-paper-100 dark:hover:bg-slate-700">
                        {t("Next", "下一页")}
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </section>

      {/* Search + Filters */}
      <div className="space-y-3 mb-8">
        <input
          type="text"
          placeholder={t("Search papers, authors, topics...", "搜索论文、作者、主题...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 border border-paper-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700/50"
        />
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setShowPicksOnly(!showPicksOnly)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              showPicksOnly
                ? "bg-amber-500 text-white"
                : "bg-paper-200 dark:bg-slate-700 text-paper-800/60 dark:text-slate-300 hover:bg-paper-200/80 dark:hover:bg-slate-600"
            }`}
          >
            ⭐ {t("Editor's picks", "编辑精选")}
          </button>
          <div className="w-px h-4 bg-paper-200 dark:bg-slate-700" />
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                activeTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-paper-100 dark:bg-slate-800 text-paper-800/60 dark:text-slate-400 hover:bg-paper-200 dark:hover:bg-slate-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-paper-800/40 dark:text-slate-500 mb-6">
        {filtered.length} {t("papers", "篇论文")}
        {(searchQuery || activeTag || showPicksOnly) && (
          <button
            onClick={() => { setSearchQuery(""); setActiveTag(null); setShowPicksOnly(false); setPapersPage(1); }}
            className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t("Clear filters", "清除筛选")}
          </button>
        )}
      </p>

      {/* Paper list — paginated */}
      {(() => {
        const totalPages = Math.ceil(filtered.length / PAPERS_PER_PAGE);
        const pageItems = filtered.slice((papersPage - 1) * PAPERS_PER_PAGE, papersPage * PAPERS_PER_PAGE);

        // Re-group page items by month
        const pageGrouped = new Map<string, typeof pageItems>();
        for (const p of pageItems) {
          const key = p.date.slice(0, 7);
          if (!pageGrouped.has(key)) pageGrouped.set(key, []);
          pageGrouped.get(key)!.push(p);
        }
        const pageGroupedArr = Array.from(pageGrouped.entries()).sort(([a], [b]) => b.localeCompare(a));

        return (
          <>
            {pageGrouped.size === 0 ? (
              <div className="text-center py-12 text-paper-800/40 dark:text-slate-600">
                {t("No papers found.", "没有找到相关论文。")}
              </div>
            ) : (
              <div className="space-y-10">
                {pageGroupedArr.map(([month, papers]) => (
                  <section key={month}>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-paper-800/40 dark:text-slate-500 mb-4">
                      {formatMonth(month)}
                    </h2>
                    <div className="space-y-3">
                      {papers.map((paper) => (
                        <div
                          key={paper.arxivId}
                          className={`bg-white dark:bg-slate-800 border rounded-lg p-4 transition-all hover:shadow-sm ${
                            paper.pick
                              ? "border-amber-200 dark:border-amber-700/40 hover:border-amber-300 dark:hover:border-amber-600/50"
                              : "border-paper-200 dark:border-slate-700 hover:border-paper-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-base mt-0.5 flex-shrink-0">{paper.pick ? "⭐" : "·"}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="font-semibold text-sm leading-snug dark:text-slate-100">
                                    {lang === "en" ? paper.title : paper.titleZh ?? paper.title}
                                  </h3>
                                  <p className="text-xs text-paper-800/40 dark:text-slate-500 mt-0.5">
                                    {paper.authors} &middot; {paper.date.slice(0, 7)}
                                  </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <a href={`https://arxiv.org/abs/${paper.arxivId}`} target="_blank" rel="noopener noreferrer"
                                    className="text-xs text-paper-800/40 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">arXiv ↗</a>
                                  {paper.slug && (
                                    <Link href={`${basePath}/papers/${paper.slug}`}
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                      {t("Deep-dive →", "精读 →")}
                                    </Link>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-paper-800/70 dark:text-slate-300 mt-1.5 leading-relaxed">
                                {lang === "en" ? paper.why : paper.whyZh}
                              </p>
                              <div className="flex gap-1.5 mt-2 flex-wrap">
                                {paper.tags.map((tag) => (
                                  <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                    className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-500/25 transition-colors">
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10 pt-6 border-t border-paper-100 dark:border-slate-800">
                <button onClick={() => setPapersPage((p) => Math.max(1, p - 1))} disabled={papersPage === 1}
                  className="px-4 py-1.5 text-sm rounded-lg border border-paper-200 dark:border-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-paper-50 dark:hover:bg-slate-800 transition-colors">
                  ← {t("Prev", "上一页")}
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button key={pg} onClick={() => setPapersPage(pg)}
                      className={`w-8 h-8 text-xs rounded-md transition-colors ${
                        pg === papersPage
                          ? "bg-blue-600 text-white"
                          : "hover:bg-paper-100 dark:hover:bg-slate-700 text-paper-800/60 dark:text-slate-400"
                      }`}>
                      {pg}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPapersPage((p) => Math.min(totalPages, p + 1))} disabled={papersPage === totalPages}
                  className="px-4 py-1.5 text-sm rounded-lg border border-paper-200 dark:border-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-paper-50 dark:hover:bg-slate-800 transition-colors">
                  {t("Next", "下一页")} →
                </button>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}
