"use client";

import { useLang } from "@/lib/i18n";
import { LlmGuideChapterBar } from "@/components/LlmGuideChapterBar";
import { LlmGuideNav } from "@/components/LlmGuideNav";
import { LlmGuideToc } from "@/components/LlmGuideToc";

export default function Page() {
  const { t } = useLang();
  const html = `<h1>DeepSeek-V1</h1>
<blockquote>
<p>🔙 <strong><a href="/llm-guide/14-models/14.1-deepseek/14.1-deepseek">返回 14.1-DeepSeek 家族总览</a></strong></p>
</blockquote>
<blockquote>
<p>DeepSeek 家族第一份通用底座报告。模型本身是 Dense Transformer, 没有 MoE, 没有 MLA, 结构几乎照搬 LLaMA; 真正的分量落在三处: 一套在自家语料上重新拟合的 Scaling Laws, 一条把去重做到 91 个 Common Crawl dump 的数据流水, 以及对齐阶段几个「刻意不做」的决定。后面的 Coder, Math, V2 在分词器, 训练框架, 学习率调度和评测协议上都直接继承了这里的设定, 所以读它更像读家族的地基图纸。</p>
</blockquote>
<p>DeepSeek-V1(报告名 DeepSeek LLM)的微观结构基本是 LLaMA 配方: <code>Pre-Norm</code> 加 <code>RMSNorm</code>, FFN 用 <code>SwiGLU</code>, 位置编码用 <code>RoPE</code>; 唯一的注意力改动是 67B 换成 <code>GQA</code> 省推理成本, 真正动注意力结构要等到 V2 的 <code>MLA</code>。宏观上 7B 取 30 层, 67B 取 95 层, 配 <code>d_model=8192</code>, 训练框架是自研的 <code>HAI-LLM</code>, 通信尽量藏到计算后面——这套思路后来一路加码成 V3 的 <code>DualPipe</code>。</p>
<p>报告的硬核在 Scaling Laws: 先在 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mn>10</mn><mn>17</mn></msup></mrow><annotation encoding="application/x-tex">10^{17}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord">1</span><span class="mord"><span class="mord">0</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">17</span></span></span></span></span></span></span></span></span></span></span></span> FLOPs 下网格搜索 batch size 与学习率, 拟合出随算力 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi></mrow><annotation encoding="application/x-tex">C</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span></span></span></span> 变化的幂律, 再用 non-embedding FLOPs/token(<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>M</mi></mrow><annotation encoding="application/x-tex">M</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span>)代替参数量 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>N</mi></mrow><annotation encoding="application/x-tex">N</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span></span> 做 IsoFLOP 剖面。同一套方法换三份数据拟合, 得到「数据质量越高, 新增算力越该分给模型」的分配指数, 也给 Kaplan 与 Chinchilla 结论打架提供了一个解释: 它们的语料不同。</p>
<p>对齐阶段同样留下了家族惯例: 约 150 万条中英 <code>SFT</code> 数据(数学占 46.6%), 再接 <code>DPO</code>; 同时记下几个「做了有效但不采用」的实验——2000 万道选择题能把中文榜单抬高十几分但对真实对话无益, 于是预训练与微调都不用选择题数据。这份 Dense 7B/67B 的榜单成绩很快被超过, 但它定下的做事方式在后面每一代报告里都还能看到。</p>
<h2 id="wddh">文档导航</h2>
<table>
<thead>
<tr>
<th>文档</th>
<th>说明</th>
</tr>
</thead>
<tbody><tr>
<td><a href="/llm-guide/14-models/14.1-deepseek/00-deep-seek-v1/01-deep-seek-v1-jsbgjy">01-DeepSeek-V1 技术报告精译</a></td>
<td>DeepSeek LLM 技术报告精读(中英对照译稿过滤)</td>
</tr>
</tbody></table>
`;
  const toc: { level: number; id: string; text: string }[] = [{"level":2,"id":"wddh","text":"文档导航"}];
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LlmGuideNav currentRoute="14-models/14.1-deepseek/00-deep-seek-v1/05-deep-seek-v1-index" />
      <main className="flex-1 min-w-0 px-6 pt-20 pb-12 lg:pt-12">
        <LlmGuideChapterBar currentRoute="14-models/14.1-deepseek/00-deep-seek-v1/05-deep-seek-v1-index" />
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">DeepSeek-V1</h1>
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
