"use client";

import { useLang } from "@/lib/i18n";
import { LlmGuideChapterBar } from "@/components/LlmGuideChapterBar";
import { LlmGuideNav } from "@/components/LlmGuideNav";
import { LlmGuideToc } from "@/components/LlmGuideToc";

export default function Page() {
  const { t } = useLang();
  const html = `<h1>DeepSeek-Janus-Pro</h1>
<blockquote>
<p>🔙 <strong><a href="/llm-guide/14-models/14.1-deepseek/14.1-deepseek">返回 14.1-DeepSeek 家族总览</a></strong></p>
</blockquote>
<blockquote>
<p>Janus 的升级版, 架构完全沿用: 理解走 <code>SigLIP</code>, 生成走 <code>VQ tokenizer</code>, 两条视觉通路接同一个自回归 Transformer。改动在三处: 训练日程重排, 理解和生成数据都大幅扩充, 语言底座从 1.5B 扩到 7B。结果是 7B 版 MMBench 79.2, GenEval 0.80, DPG-Bench 84.19, 后两项超过 DALL-E 3 和 SD3-Medium。报告只有 13 页, 没有消融表, 三处改动各贡献多少只能从版本对比里推算。</p>
</blockquote>
<p>训练日程的改动冲着 Janus 的已知短板去: 阶段 II 里 66.67% 的生成步数花在 ImageNet 类别名条件生成上, 计算效率很低。Janus-Pro 把 ImageNet 挪到只训 adaptor 与图像头的冻结阶段 I(并延长到 20K 步, 生成比例 1:0:3), 阶段 II 去掉 ImageNet 直接学开放域文生图(计划 360K 步, 早停于 270K), 阶段 III 把理解数据占比从 35% 抬到 50%, 学习率翻倍, batch 减半, 全程恒定学习率, <code>weight decay</code> 归零。</p>
<p>数据侧, 理解数据参考 DeepSeek-VL2 扩了约 9000 万条(图像描述, 表格, 图表, 文档理解), 生成侧加入约 7200 万条合成美学数据, 让真实与合成比例到 1:1; 预处理上理解「pad」保构图, 生成「crop」保正方形监督, 两种规则故意不对称。模型规模从 1.5B 扩到 7B, 报告发现更大的 LLM 在理解与生成两侧的损失都收敛得更快; 但理解输入锁在 384 × 384, 细粒度任务(如 OCR)吃亏, 生成侧分辨率低叠加视觉 tokenizer 的重建损失, 细部仍虚——这是报告自己点出的局限。</p>
<h2 id="wddh">文档导航</h2>
<table>
<thead>
<tr>
<th>文档</th>
<th>说明</th>
</tr>
</thead>
<tbody><tr>
<td><a href="/llm-guide/14-models/14.1-deepseek/13-deep-seek-janus-pro/01-deep-seek-janus-pro-jsbgjy">01-DeepSeek-Janus-Pro 技术报告精译</a></td>
<td>Janus-Pro 技术报告精读(中英对照译稿过滤)</td>
</tr>
</tbody></table>
`;
  const toc: { level: number; id: string; text: string }[] = [{"level":2,"id":"wddh","text":"文档导航"}];
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LlmGuideNav currentRoute="14-models/14.1-deepseek/13-deep-seek-janus-pro/05-deep-seek-janus-pro-index" />
      <main className="flex-1 min-w-0 px-6 pt-20 pb-12 lg:pt-12">
        <LlmGuideChapterBar currentRoute="14-models/14.1-deepseek/13-deep-seek-janus-pro/05-deep-seek-janus-pro-index" />
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">DeepSeek-Janus-Pro</h1>
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
