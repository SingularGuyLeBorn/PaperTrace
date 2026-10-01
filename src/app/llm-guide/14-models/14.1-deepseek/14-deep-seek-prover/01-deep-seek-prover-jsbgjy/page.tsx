"use client";

import { useLang } from "@/lib/i18n";
import { LlmGuideChapterBar } from "@/components/LlmGuideChapterBar";
import { LlmGuideNav } from "@/components/LlmGuideNav";
import { LlmGuideToc } from "@/components/LlmGuideToc";

export default function Page() {
  const { t } = useLang();
  const html = `<h1>DeepSeek-Prover: 用大规模合成数据推进大语言模型中的定理证明</h1>
<blockquote>
<p>🔙 <strong><a href="/llm-guide/14-models/14.1-deepseek/14.1-deepseek">返回 14.1-DeepSeek 家族总览</a></strong></p>
</blockquote>
<blockquote>
<p>原文标题: DeepSeek-Prover: Advancing Theorem Proving in LLMs through Large-Scale Synthetic Data
作者: DeepSeek-AI
原文链接: <a href="https://arxiv.org/abs/2405.14333">https://arxiv.org/abs/2405.14333</a>
发布日期: 2024 年 5 月 23 日
精译日期: 2026 年 10 月 1 日</p>
</blockquote>
<h2 id="zy">摘要</h2>
<p>像 Lean 这样的证明助手, 已经把数学证明的核验推到很高的准确度与可信度. <strong>Lean</strong> 是一类交互式定理证明器: 人把命题写成机器可读的形式化语句, 再逐步或整段给出证明; 内核按形式规则检查, 通过才算「证完」. 大语言模型在数学推理上已有苗头, 但形式化定理证明仍被训练数据短缺拖住.<strong>形式化证明</strong>指把命题与证明步骤都写成证明助手能机械核验的代码; 相对地, 自然语言里「看起来对」的推理, 机器无法直接保证无洞. 为此, 本文从高中与本科竞赛题出发, 大规模生成 Lean 4 证明数据: 自然语言题转成形式语句, 滤掉低质语句, 再生成证明, 得到合成数据. 在含 800 万条带证明形式语句的合成集上微调 DeepSeekMath 7B 后, Lean 4 miniF2F 测试上整证生成准确率达 46.3%(64 样本)与累计 52%, 超过 GPT-4 的 23.0%(64 样本)以及树搜索强化学习方法的 41.0%.<strong>自动定理证明(ATP)</strong> 泛指让机器自动找证明; 本文走的是「一次生成整段证明 + Lean 核验」, 而不是逐步与证明器来回交互的树搜索. 此外, 在 Lean 4 形式化 IMO(FIMO)148 题中证出 5 题, GPT-4 一题都没证出. 结果说明大规模合成数据能抬高 LLM 的定理证明能力. 合成数据与模型将公开, 方便后续研究.</p>
<h2 id="1-yy">1 引言</h2>
<p>现代数学里, 证明越写越复杂, 同行评审很难跟上: 错证可能被接受, 关键漏洞往往很久以后才被发现. 为此发展出 Lean, Isabelle, Coq 等形式化数学语言, 让证明可以被计算机核验. <strong>形式化语言</strong>把符号, 推理规则和目标状态都定成可检查的规则; 写证明像写程序, 过不了类型检查就过不了关. 但手工写形式化证明极费功夫, 即便资深数学家也吃力, 所以自动定理证明的重要性在上升.</p>
<p>为减轻写形式化证明的负担, 已有一批工作主要靠搜索算法在候选证明空间里探索. 复杂定理的搜索空间极大, 这些方法往往吃不消. 近来大语言模型给出另一条路:</p>
<p>用预训练模型引导搜索. 这些方法有进步, 但仍难落地, 根因是平行语料太少: 形式化证明语言的使用者远少于 Python/Java, 现成数据稀薄. <strong>自动形式化(autoformalization)</strong> 指把自然语言数学叙述自动翻成 Lean 等语言里的形式语句; 近年已能合成更多对齐数据来训 LLM 证明器, 但规模仍不足以把大模型能力吃满.</p>
<p>本文提出: 从非形式化数学题大规模生成 Lean 4 证明数据. 流程是: 高中与本科竞赛题 → 形式语句 → LLM 自动生成证明 → 在 Lean 4 环境里核验对错. 难点在同时保住合成数据的规模与质量.</p>
<p><strong>质量保障:</strong> 多步抬高生成证明质量. 先用质量打分模型滤掉过简语句, 再用假设否决策略剔除无效语句. 迭代框架: 用在有限数据上微调过的弱模型, 从自然语言题合成语句; 再为这些语句生成证明, 经 Lean 4 核验器验证; 正确的定理–证明对回头继续训模型. 若干轮后, 吃过大合成数据的模型远强于最初弱模型, 定理–证明对的质量也随之升高.</p>
<p><strong>规模保障:</strong> 证明搜索空间大, 拖慢生成. 一大延误源是「不可证」语句一直跑到超时. 做法是并行去证原语句的否定式: 原命题或其否定任一被证出, 整条证明流程立即终止.</p>
<p>在 Lean 4 上用 miniF2F 的 488 题与 FIMO 的 148 题评估. 底座是 DeepSeekMath 7B. 迭代训出的模型整证生成在 miniF2F-test 上 64 样本达 46.3%, 超过 GPT-4 的 23.0% 与强化学习树搜索方法的 41.0%. FIMO: 100 样本解出 4/148, GPT-4 为 0; 4096 样本解出 5 题. 消融显示每轮迭代在 miniF2F 上能多解一些题. 贡献如下:</p>
<p>• 提出迭代方法, 从自然语言数学题合成 800 万条带形式证明的形式语句; 实验表明规模与质量都明显抬高.</p>
<p>在该合成集上训练的模型, Lean 4 miniF2F 测试上整证生成 46.3%(64 样本), 累计 52%, 超过 GPT-4(23.0%@64)与树搜索 RL(41.0%); FIMO 148 题证出 5 题, GPT-4 为零.</p>
<p>• 开源大规模高质量形式化数学证明数据, 推动自动定理证明方向的后续研究.</p>
<h2 id="2-bjyxggz">2 背景与相关工作</h2>
<p>自动定理证明从 AI 早期就是重要方向. 早期瞄准较简单的逻辑框架, 催生出 E, Vampire 等高效一阶定理证明器. 但面对现代证明助手里常见的复杂定理, 这些工具往往不够用:</p>
<p>Lean, Isabelle, Coq 一类系统里的定理远比经典一阶场景难. 深度学习与模型引导搜索重新给这个领域加热, ATP 能力与可解问题范围都在扩大.</p>
<p><strong>神经模型上的 ATP.</strong> 一类做法用神经模型引导树搜索, 并常用强化学习抬准度; 搜索空间大, 时间与算力都贵.</p>
<p>另一类直接用大语言模型: 在开源证明数据上微调, 经状态–动作程序与核验器交互, 逐步生成证明步再核验. 效果好, 但算力重. 为提效, 近年研究让模型一次生成完整形式证明, 跳过生成期的逐步交互. 本文主线即整证生成.</p>
<p><strong>面向形式化数学的自动形式化.</strong> 形式语料少, 限制了现有 LLM. 有人用自动形式化把自然语言转成可被证明助手核验的形式语句; 也有人用规则变换已有定理合成证明数据, 有效但绑死规则, 难泛化. 近作开始用 LLM 翻自然语言题, 但数据集仍偏小, 多限于小基准, 训练增益有限. 本文目标是把自动形式化推到大得多的规模, 抬高神经证明器表现.</p>
<h2 id="3-ff">3 方法</h2>
<p>本节方法对应图 1 的四步: 先从大批自然语言题生成形式语句; 再经模型打分与假设否决筛高质量语句; 由 DeepSeek-Prover 尝试证明, Lean 4 核验器判定对错, 得到已验证的语句与证明, 用作微调合成数据; 模型变强后整条流水线再跑, 直到收益变小. 为提效, 原语句与其否定并行证明: 一旦否定被证出, 即可快速丢掉无效原语句.</p>
<h3 id="3-1-zdxsh">3.1 自动形式化</h3>
<p>形式证明数据的根基是大量形式语句, 手工堆很难. 好在网上有海量自然语言数学题:</p>
<p>把这些非形式化题自动形式化, 就能得到大量形式语句.</p>
<p>条件清楚, 目标明确的题, 比需要复杂定义与构造的高等主题更容易形式化. 因此本文主攻高中与本科竞赛题, 侧重代数与数论, 组合, 几何, 统计较少. 题面看似简单, 解法往往不浅, 适合拿来构造证明数据. 经爬取与清洗, 得到 869, 659 道高质量自然语言数学题.</p>
<p>底座初始化为 DeepSeekMath-Base 7B. 起初几乎不会把自然语言题翻成形式语句. 于是用 MMA 数据集微调: 该集把 Lean 4 mathlib 里的形式语句经 GPT-4 回译成自然语言题面. 再按结构化提示, 让模型把自然语言题翻成 Lean 4 形式语句.</p>
<pre><code class="language-txt">Prompt:
Mathematical Problem in Natural Language:
{\$informal_statement_with_answers}
Translate the problem to Lean 4 (only the core declaration):
“‘lean4

Response:
{\$formal_statement}
“‘
</code></pre>
<h3 id="3-2-zlgl">3.2 质量过滤</h3>
<p>自动形式化语句质量不稳, 主要有两点. 一是大量语句过简. 为此设计打分标准, 并以 miniF2F-valid 为例做 few-shot, 引导 DeepSeek-Prover</p>
<p>用 CoT 评估内容与质量. 人工复核显示打分与人的直觉接近. 档位为「excellent / good / above average / fair / poor」;「fair」「poor」一律丢掉.</p>
<p>第二类问题: 语句「可证」, 但假设自相矛盾, 结论是空虚真(vacuous), 数学上无意义. 例如模型生成:</p>
<div style="white-space: pre-wrap; font-family: monospace;">
example (<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>θ</mi><mo>:</mo><mi mathvariant="double-struck">R</mi></mrow><annotation encoding="application/x-tex">\\theta : \\mathbb{R}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal" style="margin-right:0.0278em;">θ</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6889em;"></span><span class="mord mathbb">R</span></span></span></span>) (h<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mrow></mrow><mn>0</mn></msub></mrow><annotation encoding="application/x-tex">_0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4511em;vertical-align:-0.15em;"></span><span class="mord"><span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">0</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> : <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="normal">∀</mi></mrow><annotation encoding="application/x-tex">\\forall</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord">∀</span></span></span></span> z : <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="double-struck">C</mi></mrow><annotation encoding="application/x-tex">\\mathbb{C}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6889em;"></span><span class="mord mathbb">C</span></span></span></span>, z <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mrow></mrow><mn>2</mn></msup><mo>=</mo><mo>−</mo><mn>1</mn><mo>∧</mo></mrow><annotation encoding="application/x-tex">^2 = -1 \\land</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord"><span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">−</span><span class="mord">1</span><span class="mord">∧</span></span></span></span> z <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mrow></mrow><mn>3</mn></msup><mo>=</mo><mo>−</mo><mn>1</mn><mo>∧</mo></mrow><annotation encoding="application/x-tex">^3 = -1 \\land</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord"><span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">3</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">−</span><span class="mord">1</span><span class="mord">∧</span></span></span></span> z <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mrow></mrow><mn>6</mn></msup><mo>=</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">^6 = 1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord"><span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">6</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span>) (h<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mrow></mrow><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4511em;vertical-align:-0.15em;"></span><span class="mord"><span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> :
Real. tan <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>θ</mi><mo>=</mo><mn>2</mn><mo>∗</mo></mrow><annotation encoding="application/x-tex">\\theta = 2 *</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal" style="margin-right:0.0278em;">θ</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">2</span><span class="mord">∗</span></span></span></span> Real. sqrt 3) : <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>θ</mi><mo>=</mo><mn>5</mn><mo>∗</mo></mrow><annotation encoding="application/x-tex">\\theta = 5 *</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal" style="margin-right:0.0278em;">θ</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">5</span><span class="mord">∗</span></span></span></span> Real. pi / 3
</div><p>对所有复数都成立的 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>z</mi><mn>2</mn></msup><mo>=</mo><mo>−</mo><mn>1</mn><mo>∧</mo><msup><mi>z</mi><mn>3</mn></msup><mo>=</mo><mo>−</mo><mn>1</mn><mo>∧</mo><msup><mi>z</mi><mn>6</mn></msup><mo>=</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">z^{2}=-1 \\wedge z^{3}=-1 \\wedge z^{6}=1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.044em;">z</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">−</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∧</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.044em;">z</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">3</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">−</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∧</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.044em;">z</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">6</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span> 显然假, 由此推出的任何结论都无意义. <strong>假设否决(hypothesis rejection)</strong>: 让模型尝试把结论改成 <code>False</code> 再证; 若能证出, 说明假设不一致, 该语句剔除. 示例如下:</p>
<div style="white-space: pre-wrap; font-family: monospace;">
example (<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>θ</mi><mo>:</mo><mi mathvariant="double-struck">R</mi></mrow><annotation encoding="application/x-tex">\\theta : \\mathbb{R}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal" style="margin-right:0.0278em;">θ</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6889em;"></span><span class="mord mathbb">R</span></span></span></span>) (<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>h</mi><mn>0</mn></msub><mo>:</mo><mi mathvariant="normal">∀</mi><mi>z</mi><mo>:</mo><mi mathvariant="double-struck">C</mi></mrow><annotation encoding="application/x-tex">h_0 : \\forall z : \\mathbb{C}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">0</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord">∀</span><span class="mord mathnormal" style="margin-right:0.044em;">z</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6889em;"></span><span class="mord mathbb">C</span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>z</mi><mover accent="true"><mrow></mrow><mo>^</mo></mover><mn>2</mn><mo>=</mo><mo>−</mo><mn>1</mn><mo>∧</mo><mi>z</mi><mover accent="true"><mrow></mrow><mo>^</mo></mover><mn>3</mn><mo>=</mo><mo>−</mo><mn>1</mn><mo>∧</mo><mi>z</mi><mover accent="true"><mrow></mrow><mo>^</mo></mover><mn>6</mn><mo>=</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">z \\hat{} 2 = -1 \\land z \\hat{} 3 = -1 \\land z \\hat{} 6 = 1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal" style="margin-right:0.044em;">z</span><span class="mord accent"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord"></span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.25em;"><span class="mord">^</span></span></span></span></span></span></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">−</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∧</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal" style="margin-right:0.044em;">z</span><span class="mord accent"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord"></span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.25em;"><span class="mord">^</span></span></span></span></span></span></span><span class="mord">3</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">−</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∧</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal" style="margin-right:0.044em;">z</span><span class="mord accent"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord"></span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.25em;"><span class="mord">^</span></span></span></span></span></span></span><span class="mord">6</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span>) (<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>h</mi><mn>1</mn></msub><mo>:</mo><mi>R</mi><mi>e</mi><mi>a</mi><mi>l</mi><mi mathvariant="normal">.</mi><mi>t</mi><mi>a</mi><mi>n</mi><mi>θ</mi><mo>=</mo><mn>2</mn><mo>∗</mo><mi>R</mi><mi>e</mi><mi>a</mi><mi>l</mi><mi mathvariant="normal">.</mi><mi>s</mi><mi>q</mi><mi>r</mi><mi>t</mi><mn>3</mn></mrow><annotation encoding="application/x-tex">h_1 : Real. tan \\theta = 2 * Real. sqrt 3</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal" style="margin-right:0.0077em;">R</span><span class="mord mathnormal">e</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.0197em;">l</span><span class="mord">.</span><span class="mord mathnormal">t</span><span class="mord mathnormal">an</span><span class="mord mathnormal" style="margin-right:0.0278em;">θ</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.0077em;">R</span><span class="mord mathnormal">e</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.0197em;">l</span><span class="mord">.</span><span class="mord mathnormal">s</span><span class="mord mathnormal" style="margin-right:0.0359em;">q</span><span class="mord mathnormal" style="margin-right:0.0278em;">r</span><span class="mord mathnormal">t</span><span class="mord">3</span></span></span></span>): False : = by
simpa using <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>h</mi><mn>0</mn></msub></mrow><annotation encoding="application/x-tex">h_0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">0</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 1
</div><p>打分与假设否决双管齐下后, 留下 712, 073 条高质量形式语句, 作为后续证明合成的底座.</p>
<h3 id="3-3-yjzm">3.3 语句证明</h3>
<p>有了高质量形式语句语料后, 用模型为它们找证明. 传统做法多是暴力重试到找到合法证明或耗尽算力; 在人工精选, 大体为真的语句上还说得过去. 自动形式化语句里很多本身就不对-- 可靠证明系统里证不出假命题. 大规模下更明显: 即便过了质量过滤, 至少约 20% 仍不正确; 硬暴力会浪费大量算力.</p>
<p>为少在不可证语句上烧资源, 利用命题与其否定的对称性: 对每条合成语句并行搜 Γ ⊢ P 与 Γ ⊢ ¬P, 任一找到合法证明即停, 另一侧随之判定不可证. 每条搜索流最多尝试 k 次, 除非更早成功.</p>
<p>凡核验通过的证明-- 无论证的是原定理还是否定-- 都汇总进训练. 双轨证明因此也是数据增强: 即便原形式化写错, 否定侧仍可贡献训练信号.</p>
<h3 id="3-4-ddzq">3.4 迭代增强</h3>
<p>整条流水线高度依赖 DeepSeek-Prover, 每轮后都要用新数据继续微调, 再用更新后的模型做下一轮自动形式化. 关键观察: 每循环一轮, 模型更强, 产出的定理–证明对也更好. 迭代直到看不到增益为止.</p>
<p>持续 refinement 最终抬高定理–证明对质量.</p>
<h2 id="4-sy">4 实验</h2>
<h3 id="4-1-sysz">4.1 实验设置</h3>
<p>底座: DeepSeekMath-Base 7B, decoder-only Transformer, 约 1200 亿数学相关 token 预训练. 微调: 全局 batch 512, 恒定学习率 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1</mn><mo>×</mo><msup><mn>10</mn><mrow><mo>−</mo><mn>4</mn></mrow></msup></mrow><annotation encoding="application/x-tex">1\\times10^{-4}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord">1</span><span class="mord"><span class="mord">0</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">−</span><span class="mord mtight">4</span></span></span></span></span></span></span></span></span></span></span></span>, 6000 warmup, 合成数据. 对照基线如下:</p>
<p>• <strong>GPT-3.5 / GPT-4</strong>: 非专为定理证明设计, 但规模大.<strong>DeepSeekMath</strong> 则明确面向数学内容预训练. 本文用 GPT-4-turbo 0409 与 DeepSeekMath, 按与本文类似的方式做整证生成.</p>
<p>• <strong>GPT-f</strong> 及后续 <strong>Proof Artifact Co-Training, ReProver, Llemma, COPRA</strong>: 迭代最优优先搜证明步, 与核验器交互直至完成或耗尽资源; 证明步可由专用微调模型或 GPT-3.5/4 生成.</p>
<h3 id="4-2-zjg">4.2 主结果</h3>
<p>主战场是代数与数论. 评测用 miniF2F 与 FIMO. <strong>pass@k</strong>: 模型生成的前 k 次尝试里, 至少有一次通过核验即算成功.</p>
<p><strong>MiniF2F 结果.</strong> 验证/测试各 244 题, 从基础算术到 AIME, AMC, IMO 级竞赛题. 使用 LeanDojo 发布的 Lean 4 版: <a href="https://github.com/yangky11/miniF2F-lean4">https://github.com/yangky11/miniF2F-lean4</a>.</p>
<p>表 1: DeepSeek-Prover 累计得分在 miniF2F-valid / test 上分别为 60.2% / 52.0%, 高于含 GPT-4(25.41% / 22.95%)在内的对照; 最强树搜索 Hypertree Proof Search(600M)也只到 valid 58.6%, test 41.0%. 算力加大时分数跟着涨: 贪心约 30.03%, 65536 次生成到 50.0%. MiniF2F 证例见附录 A. 3.1.</p>
<p><strong>FIMO 结果.</strong> FIMO 含 149 道来自 IMO shortlist, 译成 Lean 4 的形式题. 每题 100 次尝试证出 4 题, GPT-4 为 0; 每题加到 4096 次再多证 1 题. 证例见附录 A. 3.2.</p>
<p>表 1｜miniF2F 上与现有方法对比.</p>
<h3 id="4-3-xrsy">4.3 消融实验</h3>
<h4 id="4-3-1-dgmzdxshsfyx">4.3.1 大规模自动形式化是否有效</h4>
<p>表 2 对比自动形式化数据与常规数据上的 expert iteration(生成证明 → 用成功样本微调 → 再迭代). 结果显示: 用本文自动形式化数据训出的模型, 明显强于只吃 mathlib 数据的模型.</p>
<p>表 2｜在 pass@128 下, 用 mathlib 人工定理证明 vs 自动形式化定理证明训练后的 miniF2F 通过率.</p>
<table>
<thead>
<tr>
<th>Model</th>
<th>#Tokens</th>
<th>miniF2F-valid</th>
<th>miniF2F-test</th>
</tr>
</thead>
<tbody><tr>
<td>-</td>
<td>-</td>
<td>25.4%</td>
<td>27.5%</td>
</tr>
<tr>
<td>Mathlib</td>
<td>0.238B</td>
<td>30.3%</td>
<td>31.2%</td>
</tr>
<tr>
<td>Autoformalized Statements</td>
<td>3.108B</td>
<td>48.8%</td>
<td>42.6%</td>
</tr>
</tbody></table>
<h4 id="4-3-2-xsyjdfsfyx">4.3.2 形式语句打分是否有效</h4>
<p>等量高分 vs 低分证明数据微调 DeepSeekMath-Base(表 3): 高分组在 miniF2F 上高出约 4.5 个点, 说明打分过滤低质语句有用.</p>
<p>表 3｜不同打分档证明数据训练后的 miniF2F pass@128.</p>
<table>
<thead>
<tr>
<th>Scored Class</th>
<th>miniF2F-valid</th>
<th>miniF2F-test</th>
</tr>
</thead>
<tbody><tr>
<td>&quot;excellent&quot;, &quot;good&quot; and &quot;above average&quot;</td>
<td>48.8%</td>
<td>42.6%</td>
</tr>
<tr>
<td>&quot;fair&quot; and &quot;poor&quot;</td>
<td>41.4%</td>
<td>38.1%</td>
</tr>
</tbody></table>
<h4 id="4-3-3-ddzqsfyx">4.3.3 迭代增强是否有效</h4>
<p>表 4: 数据合成迭代次数与定理证明表现正相关. 迭代既抬高处理复杂证明的能力, 也抬高合成数据的质与量.</p>
<p>表 4｜ successive 迭代, 逐步并入自动形式化合成数据后的 miniF2F pass@128.</p>
<table>
<thead>
<tr>
<th>Model</th>
<th>miniF2F-valid</th>
<th>miniF2F-test</th>
</tr>
</thead>
<tbody><tr>
<td>iteration 0</td>
<td>38.1%</td>
<td>34.0%</td>
</tr>
<tr>
<td>iteration 1</td>
<td>45.1%</td>
<td>39.3%</td>
</tr>
<tr>
<td>iteration 2</td>
<td>49.2%</td>
<td>41.4%</td>
</tr>
<tr>
<td>iteration 3</td>
<td>54.5%</td>
<td>45.1%</td>
</tr>
<tr>
<td>iteration 4</td>
<td>59.4%</td>
<td>46.3%</td>
</tr>
</tbody></table>
<h4 id="4-3-4-fdhcdlzmsjsfyx">4.3.4 放大合成定理证明数据是否有效</h4>
<p>表 5: 在 800 万条证明数据的子集上, miniF2F 表现随数据规模近似按指数级扩张而提升, 说明大规模数据对自动形式化与证明能力的关键性, 也说明系统化造数据值得做.</p>
<p>表 5｜用更大部分自动形式化合成数据训练后的 miniF2F pass@128.</p>
<table>
<thead>
<tr>
<th>Size</th>
<th>miniF2F-valid</th>
<th>miniF2F-test</th>
</tr>
</thead>
<tbody><tr>
<td>1, 000</td>
<td>22.95%</td>
<td>24.18%</td>
</tr>
<tr>
<td>10, 000</td>
<td>32.79%</td>
<td>31.97%</td>
</tr>
<tr>
<td>100, 000</td>
<td>36.07%</td>
<td>37.7%</td>
</tr>
<tr>
<td>1, 000, 000</td>
<td>39.34%</td>
<td>38.11%</td>
</tr>
<tr>
<td>8, 066, 621</td>
<td>42.62%</td>
<td>40.16%</td>
</tr>
</tbody></table>
<h2 id="5-alyj">5 案例研究</h2>
<p>两则案例: 成功自动形式化并证完, 以及假设否决阶段揪出不一致假设.</p>
<h3 id="5-1-dwzzmdzdxshdl">5.1 带完整证明的自动形式化定理</h3>
<p><strong>例 a.</strong> 题: 证明下列矩阵行列式为零.</p>
<pre><code class="language-latex">
&lt;!--MATH_0--&gt;
</code></pre>
<p>Lean 中的自动形式化定理:</p>
<pre><code class="language-txt">example (a b : R) :
  Matrix. det ![![1, Real. cos (a - b), Real. cos a], ![Real. cos (a - b), 1, Real. cos b], ![Real. cos a, Real. cos b, 1]] = 0
</code></pre>
<p>这一写法把矩阵与行列式的代数表达准确落到 Lean: 定义依赖实数 a, b 的 3×3 矩阵, 断言行列式为 0; 用 <code>Matrix. det</code> 与 <code>![...]</code> 行列表记法表示矩阵行.</p>
<h3 id="5-2-jsbyzdzdxsh">5.2 假设不一致的自动形式化</h3>
<p><strong>例 b.</strong> 给定实数 D, 以及「对非零实数 a, b, c, 矩阵行列式等于 D」的条件, 证明 D² = 154.</p>
<p>Lean 中的自动形式化:</p>
<pre><code class="language-txt">example (D : R) (h0 : ∀ a b c : R, a ≠ 0 ∧ b ≠ 0 ∧ c ≠ 0 →
    Matrix. det ![![a, b, c], ![1, 4, 9], ![3, 1, 2]] = D) : D ^ 2 = 154
</code></pre>
<p>初版错误地把条件理解成对所有非零 a, b, c 都成立, 从而逼出 D²=154; 原题并未声称这种全称适用. 更合理的形式化应找满足条件的具体 a, b, c, 或说明不存在.</p>
<p>模型识别出不一致, 并给出反例说明假设荒谬:</p>
<pre><code class="language-txt">example (D : ℝ) (h₀ : ∀ a b c : ℝ, a ≠ 0 ∧ b ≠ 0 ∧ c ≠ 0 →
  Matrix. det ![![a, b, c], ![1, 4, 9], ![3, 1, 2]] = D) : False : = by
  have h₁ : = h₀ 1 2 3
  have h₂ : = h₀ 1 4 9
  simp [Matrix. det_fin_three] at h₁ h₂
  linarith
</code></pre>
<p>修正版可写成:</p>
<pre><code class="language-txt">example (a b c : R) (h0 : a ≠ 0 ∧ b ≠ 0 ∧ c ≠ 0) :
    let D : = Matrix. det ![![a, b, c], ![1, 4, 9], ![3, 1, 2]];
    D ^ 2 = 154
</code></pre>
<p>两例说明模型既能核验证明, 也能揪出假设不一致. 更多见附录 A. 2.</p>
<h2 id="6-jl-jxxywlfx">6 结论、局限性与未来方向</h2>
<p>本文从高中与本科竞赛题大规模合成证明数据: 自然语言 → 形式语句 → 滤低质 → 迭代证明生成, 得到 800 万条证明数据, 显著抬高 DeepSeekMath 7B 在 ATP 上的表现. 模型在</p>
<p>miniF2F, FIMO 等基准上超过 GPT-4 等对照. 开源数据与模型, 意在推进自动定理证明与 LLM 形式化数学推理. 当前主战场仍是中学到本科的代数与数论; 未来会扩题型多样性, 抬高方法在 ATP 上的通用性.</p>
<h2 id="ggyx">更广影响</h2>
<p>用从自然语言题合成的大规模证明数据推进 ATP, 可抬高 LLM 形式化定理证明能力, 服务于更可靠的证明核验与教学资源. 直接公开代码, 模型与数据, 意在负责任使用, 并兼顾数据隐私与知识产权规范.</p>
<h2 id="a-fl-bccl">A 附录 / 补充材料</h2>
<h3 id="a-1-tsc">A.1 提示词</h3>
<p>形式化语句质量打分提示格式如下:</p>
<pre><code class="language-txt">To evaluate whether a formal Lean4 statement will be of interest to the community, consider the following criteria:
1. Relevance to Current Research: Does the statement address a problem or concept that is actively being researched in mathematics or related fields? Higher relevance scores indicate greater potential interest.
2. Complexity and Depth: Is the statement complex enough to challenge existing theories and methodologies, yet deep enough to provide significant insights or advancements? Complexity and depth showcase Lean4&#39;s capabilities and attract interest.
3. Interdisciplinary Potential: Does the statement offer opportunities for interdisciplinary research, connecting mathematics with other fields such as computer science, physics, or biology? Interdisciplinary projects often garner wide interest.
4. Community Needs and Gaps: Does the statement fill an identified need or gap within the Lean4 community or the broader mathematical community? Addressing these needs directly correlates with interest.
5. Innovativeness: How innovative is the statement? Does it propose new methods, concepts, or applications? Innovation drives interest and engagement.
Customize your evaluation for each problem accordingly, assessing it as &#39;excellent&#39;, &#39;good&#39;, &#39;above average&#39;, &#39;fair&#39; or &#39;poor&#39;.
You should respond in the following format for each statement:
\`\`\`
Translate the code to natural language: (Detailed explanation of the informal statement, including any relevant background information, assumptions, and definitions.)
Analysis: (Provide a brief justification for each score, highlighting why the statement scored as it did across the criteria.)
Assessment: (Based on the criteria, rate the statement as &#39;excellent&#39;, &#39;good&#39;, &#39;above average&#39;, &#39;fair&#39; or &#39;poor&#39;.)
\`\`
</code></pre>
<h3 id="a-2-zdxshal">A.2 自动形式化案例</h3>
<p><strong>例 a.</strong> 自然语言: 实数 a 与实函数 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><msup><mi>x</mi><mn>3</mn></msup><mo>−</mo><mi>a</mi><mi>x</mi><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">f(x)=x^{3}-ax-1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.1076em;">f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.8974em;vertical-align:-0.0833em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">3</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">a</span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span>, 若凡 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>≤</mo><mn>0</mn></mrow><annotation encoding="application/x-tex">f(x)\\leq 0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.1076em;">f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≤</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0</span></span></span></span> 都推出 x 小于 −1 或大于 1, 则 a 必等于 3.</p>
<p>带完整证明的自动形式化:</p>
<div style="white-space: pre-wrap; font-family: monospace;">
example (a : <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="double-struck">R</mi></mrow><annotation encoding="application/x-tex">\\mathbb{R}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6889em;"></span><span class="mord mathbb">R</span></span></span></span>) (f : <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="double-struck">R</mi><mo>→</mo><mi mathvariant="double-struck">R</mi></mrow><annotation encoding="application/x-tex">\\mathbb{R} \\to \\mathbb{R}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6889em;"></span><span class="mord mathbb">R</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">→</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6889em;"></span><span class="mord mathbb">R</span></span></span></span>) (<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>h</mi><mn>0</mn></msub></mrow><annotation encoding="application/x-tex">h_0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">0</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> : <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="normal">∀</mi><mi>x</mi></mrow><annotation encoding="application/x-tex">\\forall x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord">∀</span><span class="mord mathnormal">x</span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mi>x</mi><mo>=</mo><mi>x</mi><mover accent="true"><mrow></mrow><mo>^</mo></mover><mn>3</mn><mo>−</mo><mi>a</mi><mo>∗</mo><mi>x</mi><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">f x = x \\hat{} 3 - a * x - 1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.1076em;">f</span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7778em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">x</span><span class="mord accent"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord"></span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.25em;"><span class="mord">^</span></span></span></span></span></span></span><span class="mord">3</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord mathnormal">a</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span>) :
    (<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="normal">∀</mi><mi>x</mi></mrow><annotation encoding="application/x-tex">\\forall x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord">∀</span><span class="mord mathnormal">x</span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mi>x</mi><mo>≤</mo><mn>0</mn><mo>→</mo><mi>x</mi><mo>∈</mo><mi>S</mi><mi>e</mi><mi>t</mi><mi mathvariant="normal">.</mi><mi>I</mi><mi>i</mi><mi>o</mi><mo stretchy="false">(</mo><mo>−</mo><mn>1</mn><mo stretchy="false">)</mo><mo>∪</mo><mi>S</mi><mi>e</mi><mi>t</mi><mi mathvariant="normal">.</mi><mi>I</mi><mi>o</mi><mi>i</mi><mn>1</mn></mrow><annotation encoding="application/x-tex">f x \\leq 0 \\to x \\in Set. Iio (-1) \\cup Set. Ioi 1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.1076em;">f</span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≤</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">→</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.5782em;vertical-align:-0.0391em;"></span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">∈</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="mord mathnormal">e</span><span class="mord mathnormal">t</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.0785em;">I</span><span class="mord mathnormal">i</span><span class="mord mathnormal">o</span><span class="mopen">(</span><span class="mord">−</span><span class="mord">1</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0576em;">S</span><span class="mord mathnormal">e</span><span class="mord mathnormal">t</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.0785em;">I</span><span class="mord mathnormal">o</span><span class="mord mathnormal">i</span><span class="mord">1</span></span></span></span>) <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>→</mo><mi>a</mi><mo>=</mo><mn>3</mn><mo>:</mo><mo>=</mo><mi>b</mi><mi>y</mi></mrow><annotation encoding="application/x-tex">\\to a = 3 : = by</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.3669em;"></span><span class="mrel">→</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">a</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">3</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal">b</span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span></span></span>
intro <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>h</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">h_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>
have <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>h</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">h_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> : = <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>h</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">h_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 0
simp <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><msub><mi>h</mi><mn>0</mn></msub><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[h_0]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">[</span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">0</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">]</span></span></span></span> at <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>h</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">h_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>
</div><pre><code class="language-txt">have h3 : = h1 1
simp [h0] at h3
have h4 : = h1 (-1)
simp [h0] at h4
linarith
</code></pre>
<p>分析: 展示自动形式化常见情形-- 要把「小于 −1 或大于 1」认成区间并 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mo>−</mo><mi mathvariant="normal">∞</mi><mo separator="true">,</mo><mo>−</mo><mn>1</mn><mo stretchy="false">)</mo><mo>∪</mo><mo stretchy="false">(</mo><mn>1</mn><mo separator="true">,</mo><mo>+</mo><mi mathvariant="normal">∞</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(-\\infty,-1)\\cup(1, +\\infty)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">−</span><span class="mord">∞</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">−</span><span class="mord">1</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">1</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">+</span><span class="mord">∞</span><span class="mclose">)</span></span></span></span>, 并写成 <code>Set. Iio (-1) ∪ Set. Ioi 1</code>.</p>
<p><strong>例 b.</strong> 定义 F(k)=C(k+2, 2), f(k)=C(k+1, 1); 对任意 n≥2, 存在 k 使 f(k)=(n−1)n/2, 且存在 m 使 F(m)=(n−1)n/2, 并推出 m=k.</p>
<p>Autoformalized Theorems with Complete Proofs: 带完整证明的自动形式化:</p>
<pre><code class="language-txt">example :
  let F : = fun k =&gt; Nat. choose (k + 2) 2;
  let f : = fun k =&gt; Nat. choose (k + 1) 1;
  ∀ n : N, 2 ≤ n → ∃ k : N, f k = (n - 1) * n / 2 → (∃ m : N, F m = (n - 1) * n / 2 → m = k) : = by
  simp [Nat. choose, Nat. mul_sub_left_distrib, Nat. sub_sub, Nat. mul_one]
  aesop
</code></pre>
<p>分析: 组合题的形式化语义忠实; <code>Nat. choose</code> 对应二项式系数, 存在量词与蕴含结构贴合题意.</p>
<p><strong>例 c.</strong> 三维向量 a, b, c, 点积 a. b=−3, a. c=4, b. c=6, 证明 b. (7c−2a)=48.</p>
<p>Autoformalized Theorems with Complete Proofs: 带完整证明的自动形式化:</p>
<pre><code class="language-lisp">example (a b c : R × R × R)
  (h0 : a. 1 * b. 1 + a. 2.1 * b. 2.1 + a. 2.2 * b. 2.2 = -3)
  (h1 : a. 1 * c. 1 + a. 2.1 * c. 2.1 + a. 2.2 * c. 2.2 = 4)
  (h2 : b. 1 * c. 1 + b. 2.1 * c. 2.1 + b. 2.2 * c. 2.2 = 6)
  : b. 1 * (7 * c. 1 - 2 * a. 1) + b. 2.1 * (7 * c. 2.1 - 2 * a. 2.1) + b. 2.2 * (7 *
    c. 2.2 - 2 * a. 2.2) = 48 : = by
linarith [h0, h1, h2]
</code></pre>
<p>分析: 用笛卡尔积 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="double-struck">R</mi><mo>×</mo><mi mathvariant="double-struck">R</mi><mo>×</mo><mi mathvariant="double-struck">R</mi></mrow><annotation encoding="application/x-tex">\\mathbb{R}\\times\\mathbb{R}\\times\\mathbb{R}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7722em;vertical-align:-0.0833em;"></span><span class="mord mathbb">R</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.7722em;vertical-align:-0.0833em;"></span><span class="mord mathbb">R</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6889em;"></span><span class="mord mathbb">R</span></span></span></span> 表示三维向量, 分量写作 a. 1, a. 2.1, a. 2.2; 点积按定义展开为分量积之和.</p>
<h3 id="a-3-mxscd-lean-zmsl">A.3 模型生成的 Lean 证明示例</h3>
<h4 id="a-3-1-mini-f2-f-test-jgsl">A.3.1 MiniF2F-Test 结果示例</h4>
<p><strong>例 a.</strong> 对任意实数 x, 自然数 n, 若 x &gt; −1, 则 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1</mn><mo>+</mo><mi>n</mi><mi>x</mi><mo stretchy="false">)</mo><mo>≤</mo><mo stretchy="false">(</mo><mn>1</mn><mo>+</mo><mi>x</mi><msup><mo stretchy="false">)</mo><mi>n</mi></msup></mrow><annotation encoding="application/x-tex">(1+nx)\\leq(1+x)^{n}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">n</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≤</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">x</span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6644em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">n</span></span></span></span></span></span></span></span></span></span></span></span>.</p>
<p>Formal Proof: 形式证明:</p>
<pre><code class="language-txt">theorem induction_1pxpownlt1pnx (x : R) (n : N) (h0 : -1 &lt; x) (h1 : 0 &lt; n)
    : 1 + ↑n * x ≤ (1 + x) ^ (n : N) : = by
    induction&#39; h1 with k h1 &lt;; &gt; simp_all [Nat. succ_eq_add_one, pow_add, mul_add,
        add_assoc, add_comm, add_left_comm]
</code></pre>
<pre><code class="language-txt">nlinarith [mul_self_nonneg (1 + x - 1)]
</code></pre>
<p><strong>例 b.</strong> 早班均分 84, 午班均分 70, 人数比 3(原文写为与下午班之比相关条件), 证明全体均分为 76.</p>
<p>Formal Proof: 形式证明:</p>
<pre><code class="language-verilog">theorem amc12b_2021_p4 (m a : N) (h0 : 0 &lt; m ∧ 0 &lt; a)
  (h1 : ↑m / ↑a = (3 : R) / 4)
  : (84 * ↑m + 70 * ↑a) / (↑m + ↑a) = (76 : R) : = by
  have h2 : = h0.1. ne&#39;
  have h3 : = h0.2. ne&#39;
  field_simp at h2 h3 ⊢
  ring_nf
  norm_num
  rw [div_eq_inv_mul] at h1
  field_simp at h1
  linarith
</code></pre>
<p><strong>例 c.</strong> 有多少正整数 m 存在正整数 n 使 m. n ≤ m+n? 证明有无穷多个.</p>
<p>Formal Proof: 形式证明:</p>
<pre><code class="language-txt">theorem amc12a_2002_p6 (n : N) (h₀ : 0 &lt; n)
  : ∃ m, m &gt; n ∧ ∃ p, m * p ≤ m + p : = by
  simp_all only [ge_iff_le, gt_iff_lt, mul_one, mul_add, mul_comm, mul_assoc,
    mul_left_comm]
  use n + 1
  constructor
  exact Nat. lt_succ_self n
  use 1
  ring_nf
  nlinarith
</code></pre>
<h4 id="a-3-2-fimo-sjjjgsl">A.3.2 FIMO 数据集结果示例</h4>
<p><strong>例 a.</strong> 求所有正整数到正整数的函数 f, 使对任意 x, y 存在边长为 x, f(y), f(y+f(x)−1) 的非退化三角形; 答案为恒等函数 f(x)=x.</p>
<p>Formal Proof: 形式证明:</p>
<pre><code class="language-ocaml">theorem fimo_2009_algebra_p3
  (f : N → N)
  (h₀ : ∀ x y, ∃ (a b c : N),
      a = x ∧
      b = f y ∧
      c = f (y + f x - 1) ∧
      a + b &gt; c ∧
      a + c &gt; b ∧
      b + c &gt; a) :
  ∀ x, f x = x : = by
  have h₁ : f 0 = 0 : = by
    specialize h₀ 0 0
    obtain ⟨_, _, _, h₁, h₂, h₃⟩ : = h₀
    simp at *
    linarith
  intro x
  induction x with
  | zero =&gt; exact h₁
  | succ x ih =&gt;
    specialize h₀ (x + 1) 0
</code></pre>
<pre><code class="language-c">obtain ⟨_, _, _, h1, h2, h3⟩ : = h0
simp at *
linarith
</code></pre>
<p><strong>例 b.</strong> 证明对每个正整数 n, 存在整数 a, b 满足 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0</mn><mo>&lt;</mo><mi>b</mi><mo>≤</mo><msqrt><mi>n</mi></msqrt><mo>+</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">0&lt;b\\leq\\sqrt{n}+1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6835em;vertical-align:-0.0391em;"></span><span class="mord">0</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">&lt;</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.8304em;vertical-align:-0.136em;"></span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≤</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.04em;vertical-align:-0.2397em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8003em;"><span class="svg-align" style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord" style="padding-left:0.833em;"><span class="mord mathnormal">n</span></span></span><span style="top:-2.7603em;"><span class="pstrut" style="height:3em;"></span><span class="hide-tail" style="min-width:0.853em;height:1.08em;"><svg xmlns="http://www.w3.org/2000/svg" width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l0 -0
c5.3,-9.3,12,-14,20,-14
H400000v40H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M834 80h400000v40h-400000z"/></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2397em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span> 且 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msqrt><mi>n</mi></msqrt><mo>≤</mo><mi>a</mi><mi mathvariant="normal">/</mi><mi>b</mi><mo>≤</mo><msqrt><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow></msqrt></mrow><annotation encoding="application/x-tex">\\sqrt{n}\\leq a/b \\leq \\sqrt{n+1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.04em;vertical-align:-0.2397em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8003em;"><span class="svg-align" style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord" style="padding-left:0.833em;"><span class="mord mathnormal">n</span></span></span><span style="top:-2.7603em;"><span class="pstrut" style="height:3em;"></span><span class="hide-tail" style="min-width:0.853em;height:1.08em;"><svg xmlns="http://www.w3.org/2000/svg" width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l0 -0
c5.3,-9.3,12,-14,20,-14
H400000v40H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M834 80h400000v40h-400000z"/></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2397em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≤</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">a</span><span class="mord">/</span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≤</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.04em;vertical-align:-0.1744em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8656em;"><span class="svg-align" style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord" style="padding-left:0.833em;"><span class="mord mathnormal">n</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">1</span></span></span><span style="top:-2.8256em;"><span class="pstrut" style="height:3em;"></span><span class="hide-tail" style="min-width:0.853em;height:1.08em;"><svg xmlns="http://www.w3.org/2000/svg" width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l0 -0
c5.3,-9.3,12,-14,20,-14
H400000v40H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M834 80h400000v40h-400000z"/></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1744em;"><span></span></span></span></span></span></span></span></span>.</p>
<p>Formal Proof: 形式证明:</p>
<pre><code class="language-txt">theorem fimo_2016_algebra_p5_1
  (n : N)
  (h0 : 0 &lt; n) :
  ∃ a b : N, 0 &lt; b ∧ b ≤ n. sqrt + 1 ∧
    n. sqrt ≤ a / b ∧ a / b ≤ (n + 1). sqrt : = by
  use n. sqrt, 1
  constructor &lt;; &gt;
  simp [h0, Nat. sqrt_le_sqrt] &lt;; &gt;
  norm_num &lt;; &gt;
  linarith [Nat. sqrt_le_sqrt n]
</code></pre>
<h3 id="a-4-xshyxj">A.4 形式核验细节</h3>
<p>生成的 Lean 4 代码前缀如下(导入与选项原样保留):</p>
`;
  const toc: { level: number; id: string; text: string }[] = [{"level":2,"id":"zy","text":"摘要"},{"level":2,"id":"1-yy","text":"1 引言"},{"level":2,"id":"2-bjyxggz","text":"2 背景与相关工作"},{"level":2,"id":"3-ff","text":"3 方法"},{"level":3,"id":"3-1-zdxsh","text":"3.1 自动形式化"},{"level":3,"id":"3-2-zlgl","text":"3.2 质量过滤"},{"level":3,"id":"3-3-yjzm","text":"3.3 语句证明"},{"level":3,"id":"3-4-ddzq","text":"3.4 迭代增强"},{"level":2,"id":"4-sy","text":"4 实验"},{"level":3,"id":"4-1-sysz","text":"4.1 实验设置"},{"level":3,"id":"4-2-zjg","text":"4.2 主结果"},{"level":3,"id":"4-3-xrsy","text":"4.3 消融实验"},{"level":4,"id":"4-3-1-dgmzdxshsfyx","text":"4.3.1 大规模自动形式化是否有效"},{"level":4,"id":"4-3-2-xsyjdfsfyx","text":"4.3.2 形式语句打分是否有效"},{"level":4,"id":"4-3-3-ddzqsfyx","text":"4.3.3 迭代增强是否有效"},{"level":4,"id":"4-3-4-fdhcdlzmsjsfyx","text":"4.3.4 放大合成定理证明数据是否有效"},{"level":2,"id":"5-alyj","text":"5 案例研究"},{"level":3,"id":"5-1-dwzzmdzdxshdl","text":"5.1 带完整证明的自动形式化定理"},{"level":3,"id":"5-2-jsbyzdzdxsh","text":"5.2 假设不一致的自动形式化"},{"level":2,"id":"6-jl-jxxywlfx","text":"6 结论、局限性与未来方向"},{"level":2,"id":"ggyx","text":"更广影响"},{"level":2,"id":"a-fl-bccl","text":"A 附录 / 补充材料"},{"level":3,"id":"a-1-tsc","text":"A.1 提示词"},{"level":3,"id":"a-2-zdxshal","text":"A.2 自动形式化案例"},{"level":3,"id":"a-3-mxscd-lean-zmsl","text":"A.3 模型生成的 Lean 证明示例"},{"level":4,"id":"a-3-1-mini-f2-f-test-jgsl","text":"A.3.1 MiniF2F-Test 结果示例"},{"level":4,"id":"a-3-2-fimo-sjjjgsl","text":"A.3.2 FIMO 数据集结果示例"},{"level":3,"id":"a-4-xshyxj","text":"A.4 形式核验细节"}];
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LlmGuideNav currentRoute="14-models/14.1-deepseek/14-deep-seek-prover/01-deep-seek-prover-jsbgjy" />
      <main className="flex-1 min-w-0 px-6 pt-20 pb-12 lg:pt-12">
        <LlmGuideChapterBar currentRoute="14-models/14.1-deepseek/14-deep-seek-prover/01-deep-seek-prover-jsbgjy" />
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">DeepSeek-Prover: 用大规模合成数据推进大语言模型中的定理证明</h1>
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
