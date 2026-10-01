"use client";

import { useLang } from "@/lib/i18n";
import { LlmGuideChapterBar } from "@/components/LlmGuideChapterBar";
import { LlmGuideNav } from "@/components/LlmGuideNav";
import { LlmGuideToc } from "@/components/LlmGuideToc";

export default function Page() {
  const { t } = useLang();
  const html = `<h1>DeepSeek-Prover</h1>
<blockquote>
<p>🔙 <strong><a href="/llm-guide/14-models/14.1-deepseek/14.1-deepseek">返回 14.1-DeepSeek 家族总览</a></strong></p>
</blockquote>
<blockquote>
<p>DeepSeekMath 在结论里承认几何和定理证明是短板, 三个月后的 DeepSeek-Prover 就对准了其中一块: 用 Lean 4 写出能被机器核验的证明。模型和底座都没变, 仍是 DeepSeekMath-Base 7B, 训练方法也只是普通的监督微调。这篇报告的全部分量都在数据上: 把网上爬来的约 87 万道竞赛题自动翻成 Lean 语句, 过滤, 证明, 用 Lean 核验器判对错, 通过的样本回流训练, 滚四轮得到约 <strong>800 万</strong>条带证明的形式语句。读它要换一个视角: 这里的「数据流水」本身就是算法, Lean 核验器同时扮演标注员和质检员。</p>
</blockquote>
<p>报告的判断是: 模型架构和搜索算法不是主要瓶颈, 训练数据才是。所以不改模型, 不改搜索, 只造数据。冷启动用 MMA 数据集(GPT-4 把 mathlib 语句反向翻成自然语言题)让模型学会「把题目翻成 Lean 4」, 然后从竞赛资源爬来 869,659 道题做自动形式化; 质量过滤有两道关口——模型按五个维度给语句打分, 以及<strong>假设否决</strong>(把结论换成 <code>False</code> 试证, 证出来说明前提矛盾, 整条丢弃), 过完剩 712,073 条。</p>
<p>大规模合成里最被引用的工程细节是<strong>否定并行</strong>: 即使过滤后报告估计仍有至少 20% 的语句是错的, 假命题会把证明搜索烧到超时; 对命题和它的否定并行搜索, 任何一边先证出就停——假命题提前判死省算力, 否定一侧的证明同样是合法 Lean 数据。形式化, 过滤, 证明, 用通过样本微调的闭环滚四轮, miniF2F-test 从 34.0% 一路到 46.3%(pass@128), 数据规模从 1,000 条到 800 万条也单调抬分。</p>
<p>结果上, 7B 的 DeepSeek-Prover 在 miniF2F 整证生成 64 次采样 46.3%, 累计 52.0%, 超过 GPT-4 的 23.0% 与当时最强树搜索的 41.0%; FIMO 上证出 5 题而 GPT-4 一题未证。它的 V1.5 续作沿同一条线补上 <code>RLPAF</code> 与 <code>RMaxTS</code> 树搜索——本篇是那条证明器路线的起点。</p>
<h2 id="wddh">文档导航</h2>
<table>
<thead>
<tr>
<th>文档</th>
<th>说明</th>
</tr>
</thead>
<tbody><tr>
<td><a href="/llm-guide/14-models/14.1-deepseek/14-deep-seek-prover/01-deep-seek-prover-jsbgjy">01-DeepSeek-Prover 技术报告精译</a></td>
<td>DeepSeek-Prover 技术报告精读(中英对照译稿过滤)</td>
</tr>
</tbody></table>
`;
  const toc: { level: number; id: string; text: string }[] = [{"level":2,"id":"wddh","text":"文档导航"}];
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LlmGuideNav currentRoute="14-models/14.1-deepseek/14-deep-seek-prover/05-deep-seek-prover-index" />
      <main className="flex-1 min-w-0 px-6 pt-20 pb-12 lg:pt-12">
        <LlmGuideChapterBar currentRoute="14-models/14.1-deepseek/14-deep-seek-prover/05-deep-seek-prover-index" />
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">DeepSeek-Prover</h1>
          <p className="text-paper-800/50">{t("From LLM Guide", "来自 LLM 指南")}</p>
        </header>
        <article
          className="paper-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen overflow-y-auto border-l border-paper-200 dark:border-slate-700 bg-paper-50 dark:bg-slate-900">
        <LlmGuideToc items={toc} />
      </aside>
    </div>
  );
}
