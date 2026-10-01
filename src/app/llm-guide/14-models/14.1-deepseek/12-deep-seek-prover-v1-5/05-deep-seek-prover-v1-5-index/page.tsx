"use client";

import { useLang } from "@/lib/i18n";
import { LlmGuideChapterBar } from "@/components/LlmGuideChapterBar";
import { LlmGuideNav } from "@/components/LlmGuideNav";
import { LlmGuideToc } from "@/components/LlmGuideToc";

export default function Page() {
  const { t } = useLang();
  const html = `<h1>DeepSeek-Prover-V1.5</h1>
<blockquote>
<p>🔙 <strong><a href="/llm-guide/14-models/14.1-deepseek/14.1-deepseek">返回 14.1-DeepSeek 家族总览</a></strong></p>
</blockquote>
<blockquote>
<p>V1 用 800 万条合成语句把 7B 模型在 Lean 4 miniF2F-test 上推到 50.0%, 靠的是一遍写完整段证明。V1.5 没有换骨架, 参数仍是 7B, 改动落在四个地方: 继续预训练时加入形式语言, SFT 数据里插入自然语言 CoT 注释和 tactic 状态注释, 用 Lean 的 0/1 验证结果做 <code>GRPO</code>(报告叫 <code>RLPAF</code>), 推理时把整证生成接进蒙特卡洛树搜索并配上内在奖励(<code>RMaxTS</code>)。</p>
</blockquote>
<p>整证生成的好处是通信少, 毛病是误差累积: 模型对某个中间状态「脑补」错了, 后面每一行都建立在错的状态上。V1.5 的 <code>SFT</code> 数据在证明里插入两种注释: 自然语言 CoT 写在代码注释里, tactic 状态注释则来自 LeanDojo 抽取的真实执行状态——后者是截断续写的地基, 没有它, 树搜索喂进去的状态注释模型根本不认识。<code>RLPAF</code> 的奖励就是 Lean 验证的 0/1, 不训奖励模型; 提示筛选刻意只留中等难度的定理, 全对或全错的组组内优势为零, <code>GRPO</code> 学不到梯度。</p>
<p>推理侧的 <code>RMaxTS</code> 把整证生成接进 <code>MCTS</code>: 证明在第一条错误处截断, 成功前缀加上最新 tactic 状态注释作为下一轮提示, 树搜索可以挑任意节点续写。外在奖励只有证完时的 1, 证完之前全靠内在奖励指路——一次扩展只要看到新的 tactic 状态就得分; 因奖励期望随搜索下降, 选择阶段用折扣 UCB 替代标准 UCB1。结果上, 单遍 CoT 在 16×6400 预算下 RL 比 SFT 高 2.8 个点且采样越多差距越大; 但「RL 在所有设定下都胜过 SFT」只在 miniF2F 上成立, ProofNet 上 RL 反而略低于 SFT, 且后续 Goedel-Prover 用 164 万条形式化语句只做 SFT 就超过了它——语句覆盖面比 RL 那一两个点重要得多。</p>
<h2 id="wddh">文档导航</h2>
<table>
<thead>
<tr>
<th>文档</th>
<th>说明</th>
</tr>
</thead>
<tbody><tr>
<td><a href="/llm-guide/14-models/14.1-deepseek/12-deep-seek-prover-v1-5/01-deep-seek-prover-v1-5-jsbgjy">01-DeepSeek-Prover-V1.5 技术报告精译</a></td>
<td>DeepSeek-Prover-V1.5 技术报告精读(中英对照译稿过滤)</td>
</tr>
</tbody></table>
`;
  const toc: { level: number; id: string; text: string }[] = [{"level":2,"id":"wddh","text":"文档导航"}];
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LlmGuideNav currentRoute="14-models/14.1-deepseek/12-deep-seek-prover-v1-5/05-deep-seek-prover-v1-5-index" />
      <main className="flex-1 min-w-0 px-6 pt-20 pb-12 lg:pt-12">
        <LlmGuideChapterBar currentRoute="14-models/14.1-deepseek/12-deep-seek-prover-v1-5/05-deep-seek-prover-v1-5-index" />
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">DeepSeek-Prover-V1.5</h1>
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
