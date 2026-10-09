"use client";

import { useLang } from "@/lib/i18n";
import { LlmGuideChapterBar } from "@/components/LlmGuideChapterBar";
import { LlmGuideNav } from "@/components/LlmGuideNav";
import { LlmGuideToc } from "@/components/LlmGuideToc";

export default function Page() {
  const { t } = useLang();
  const html = `<h1>DeepSeek-V4.1-Flash</h1>
<blockquote>
<p>🔙 <strong><a href="/llm-guide/14-models/14.1-deepseek/14.1-deepseek">返回 14.1-DeepSeek 家族总览</a></strong></p>
</blockquote>
<blockquote>
<p>原生多模态 MoE 模型, 骨干 552B 参数, 另挂 196B Engram 参数, 上下文 1M token。出发点很直接: 长程 Agent 的负载越来越偏输入, KV cache 的容量和带宽成了继续降部署成本的主瓶颈。V4.1 的回答分三层——架构上用 <code>CED</code> 让 prefill 只激活 8B, decode 激活 16B, 再用 <code>CSA2</code> 的跨层复用把 global KV 压到每 token 890 字节; 精度上把主 KV 存成 <code>FP4</code>; 部署上用 <code>SWA Bounded Replay</code> 把 SWA KV 从持久化缓存里拿掉。</p>
</blockquote>
<p>V4.1-Flash 的压缩是架构, cache 精度与部署策略的联合优化。<code>CED(Causal Encoder-Decoder)</code> 借自 YOCO 的半网 prefill 思路但做了关键改动: decoder 的 global KV 条目与压缩权重由 encoder 末层隐状态投影得到, prefill 算完第 20 层就能退出。<code>CSA2</code> 给每个层静态指定 Full / Reindex / Reuse 三种模式, 38 个 CSA2 层里只有 4 层真正产生 global KV, 其余 34 层都在读别人的 cache; 配合分层稀疏 Indexer, 1M 上下文每个 decode token 的 indexer 打分次数降到全独立打分的约 1/11。</p>
<p>骨干之外的扩展各自瞄准一类开销: <code>Single-Pass mHC</code> 把残差连接三遍实现并为单遍, 激活内存流量从 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>4</mn><mi>n</mi><mo>+</mo><mn>4</mn><mo stretchy="false">)</mo><mi>d</mi></mrow><annotation encoding="application/x-tex">(4n+4)d</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">4</span><span class="mord mathnormal">n</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4</span><span class="mclose">)</span><span class="mord mathnormal">d</span></span></span></span> 降到 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>2</mn><mi>n</mi><mo>+</mo><mn>2</mn><mo stretchy="false">)</mo><mi>d</mi></mrow><annotation encoding="application/x-tex">(2n+2)d</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">2</span><span class="mord mathnormal">n</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">2</span><span class="mclose">)</span><span class="mord mathnormal">d</span></span></span></span>; <code>Engram</code> 用 196B 参数的 N-gram 条件记忆走查表而非矩阵乘; <code>DSpark</code> 以投机解码取代 V4 的 MTP 服务线上推理。后训练报告自称没有算法创新, 增益几乎来自大规模 Agent 任务合成与环境规模; 评测覆盖推理, 代码, 网络安全与视觉 Agent 四类 scaffold, 并给出可控推理力度这把「成本换准度」的旋钮。</p>
<h2 id="wddh">文档导航</h2>
<table>
<thead>
<tr>
<th>文档</th>
<th>说明</th>
</tr>
</thead>
<tbody><tr>
<td><a href="/llm-guide/14-models/14.1-deepseek/11-deep-seek-v4.1-flash/01-deep-seek-v4.1-flash-jsbgjy">01-DeepSeek-V4.1-Flash 技术报告精译</a></td>
<td>DeepSeek-V4.1-Flash 技术报告精读(中英对照译稿过滤)</td>
</tr>
</tbody></table>
`;
  const toc: { level: number; id: string; text: string }[] = [{"level":2,"id":"wddh","text":"文档导航"}];
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LlmGuideNav currentRoute="14-models/14.1-deepseek/11-deep-seek-v4.1-flash/05-deep-seek-v4.1-flash-index" />
      <main className="flex-1 min-w-0 px-6 pt-20 pb-12 lg:pt-12">
        <LlmGuideChapterBar currentRoute="14-models/14.1-deepseek/11-deep-seek-v4.1-flash/05-deep-seek-v4.1-flash-index" />
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">DeepSeek-V4.1-Flash</h1>
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
