"use client";

import { useLang } from "@/lib/i18n";
import { LlmGuideChapterBar } from "@/components/LlmGuideChapterBar";
import { LlmGuideNav } from "@/components/LlmGuideNav";
import { LlmGuideToc } from "@/components/LlmGuideToc";

export default function Page() {
  const { t } = useLang();
  const html = `<h1>DeepSeek LLM: 用长期主义缩放开源语言模型</h1>
<blockquote>
<p>🔙 <strong><a href="/llm-guide/14-models/14.1-deepseek/14.1-deepseek">返回 14.1-DeepSeek 家族总览</a></strong></p>
</blockquote>
<blockquote>
<p>原文标题: DeepSeek LLM: Scaling Open-Source Language Models with Longtermism
作者: DeepSeek-AI
原文链接: <a href="https://arxiv.org/abs/2401.02954">https://arxiv.org/abs/2401.02954</a>
发布日期: 2024 年 1 月 5 日
精译日期: 2026 年 10 月 1 日</p>
</blockquote>
<h2 id="zy">摘要</h2>
<p>开源大模型发展很快, 但既有文献里的 Scaling Laws 结论并不一致, 给继续放大模型蒙上一层不确定. 本文重新做 Scaling Laws, 并给出便于落地到常见开源档位(7B, 67B)的发现. 在此指导下推出 DeepSeek LLM: 以长期视角推进开源语言模型. 预训练语料现约 2 万亿 token, 仍在扩充; 再在 Base 上做 SFT 与 DPO, 得到 Chat. 评测显示 DeepSeek LLM 67B 在多项基准上超过 LLaMA-2 70B, 代码, 数学, 推理尤为明显; 开放式评测里 67B Chat 也强于 GPT-3.5.</p>
<h2 id="1-yy">1 引言</h2>
<p>近几年, 仅解码器 Transformer 上的大语言模型, 越来越被当成通往 AGI 的底座. 靠「下一个词预测」在海量数据上自监督预训练, 就能写小说, 摘要, 补代码等; 再经监督微调与奖励建模, 更贴用户意图, 对话能力铺开, 影响力也跟着涨.</p>
<p>这波浪潮由闭源产品点燃: ChatGPT, Claude, Bard 等, 算力与标注成本都很高, 也把社区对开源模型的期待抬高, 催生一串工作. 其中 LLaMA 系列最突出: 吸收多路工作做成高效稳定架构, 7B 到 70B 表现扎实, 已成开源侧架构与性能的事实基准.</p>
<p>LLaMA 之后, 开源社区多盯着固定体量(7B/13B/34B/70B)训高质量模型, Scaling Laws 研究常被晾在一边. 但开源模型还只在 AGI 早期, Scaling Laws 很关键; 早期工作在「算力加码后模型与数据怎么分」上结论不一, 超参讨论也不够. 本文系统查语言模型的缩放行为, 并落到常用的 7B, 67B. 先看 batch size 与学习率随模型规模的趋势; 再研究数据与模型规模的最优分配, 并预测大规模模型表现. 开发中还发现: 不同数据集推出的 Scaling Laws 差得很明显, 说明数据选择会改缩放行为, 跨数据集套用 Scaling Laws 要谨慎.</p>
<p>按自家 Scaling Laws 从零训开源大模型, 并尽量公开细节. 预训练约 2 万亿 token, 以中英为主. 架构大体跟 LLaMA, 但把余弦学习率换成 <strong>multi-step(多段阶梯)学习率</strong>: 成绩相当, 又更方便持续训练. SFT 收集逾百万条多样数据, 并分享不同 SFT 策略与数据消融经验; 再用 DPO 抬对话表现.</p>
<p>解释: multi-step 学习率 = 按训练 token 比例分几段, 到节点就把学习率按固定比例往下砍(文中是 warmup 后到峰值, 训完约 80% token 降到峰值的 31.6%, 再过 10% 降到 10%), 而不是一条平滑的余弦衰减. 好处是前一段训完的 checkpoint 还能接着用, 换数据规模续训时少浪费; 和余弦终局表现差不多.</p>
<p>Base 与 Chat 都做了大量评测: DeepSeek LLM 多项基准超过 LLaMA-2 70B, 代码, 数学, 推理更明显; SFT+DPO 后, 67B Chat 在中英开放式评测上压过 GPT-3.5; 安全评测也显示能给出无害回答.</p>
<p>后文结构: §2 预训练(数据, 架构, 基建, 超参); §3 Scaling Laws 与预训练超参怎么选; §4 微调(SFT, DPO 数据与方法); §5 评测(Base/Chat, 开放式, 安全); §6 局限与后续.</p>
<h2 id="2-yxl">2 预训练</h2>
<h3 id="2-1-sj">2.1 数据</h3>
<p>目标是把语料做得更丰富, 更多样. 参考 RedPajama, The Pile, RefinedWeb, LLaMA 等经验, 流程收成三步: 去重, 过滤, 再混合. 去重与再混合用「抽到不重复的样本」保多样性; 过滤抬信息密度, 训练更划算.</p>
<p>去重做得偏激进, 范围拉大: 对整个 Common Crawl 一起去重, 比只在单次 dump 里去重删掉的重复更多. 表 1: 跨 91 个 dump 去重, 删掉的文档量约是单 dump 的四倍.</p>
<table>
<thead>
<tr>
<th>Dumps Used</th>
<th>1</th>
<th>2</th>
<th>6</th>
<th>12</th>
<th>16</th>
<th>22</th>
<th>41</th>
<th>91</th>
</tr>
</thead>
<tbody><tr>
<td>Deduplication Rate (%)</td>
<td>22.2</td>
<td>46.7</td>
<td>55.7</td>
<td>69.9</td>
<td>75.7</td>
<td>76.3</td>
<td>81.6</td>
<td>89.8</td>
</tr>
</tbody></table>
<p>表 1｜不同数量 Common Crawl dump 下去重率.</p>
<p>过滤阶段: 从语言学与语义两侧定文档质量标准, 兼顾单篇与全局视角. 再混合阶段: 补弱覆盖领域, 减轻数据失衡, 让视角更均衡.</p>
<p>分词器用 Hugging Face tokenizers 实现的 BBPE. 预分词避免换行, 标点, CJK 等不同字符类被并成一个 token(类似 GPT-2); 数字按位拆开(同 LLaMA). 常规词表约 10 万; 在约 24 GB 多语语料上训, 再加 15 个特殊 token, 合计 100015. 训练时模型词表设为 102400, 方便对齐算力并预留后续特殊 token.</p>
<h3 id="2-2-jg">2.2 架构</h3>
<table>
<thead>
<tr>
<th>Params</th>
<th>𝑛layers</th>
<th>𝑑<sub>model</sub></th>
<th>𝑛heads</th>
<th>𝑛kv_heads</th>
<th>Context Length</th>
<th>Batch Size</th>
<th>Learning Rate</th>
<th>Tokens</th>
</tr>
</thead>
<tbody><tr>
<td>7B</td>
<td>30</td>
<td>4096</td>
<td>32</td>
<td>32</td>
<td>4096</td>
<td>2304</td>
<td>4.2e-4</td>
<td>2.0T</td>
</tr>
<tr>
<td>67B</td>
<td>95</td>
<td>8192</td>
<td>64</td>
<td>8</td>
<td>4096</td>
<td>4608</td>
<td>3.2e-4</td>
<td>2.0T</td>
</tr>
</tbody></table>
<p>表 2｜DeepSeek LLM 系列规格. 超参按 §3 结论选取. (表头个别列名 OCR 有损: Context Length, Batch Size, Learning Rate.)</p>
<p>微观设计大体跟 LLaMA: Pre-Norm + RMSNorm; FFN 用 SwiGLU, 中间维 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mn>8</mn><mn>3</mn></mfrac><msub><mi>d</mi><mrow><mi>m</mi><mi>o</mi><mi>d</mi><mi>e</mi><mi>l</mi></mrow></msub></mrow><annotation encoding="application/x-tex">\\frac{8}{3}d_{model}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.1901em;vertical-align:-0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8451em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">3</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">8</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.345em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mord"><span class="mord mathnormal">d</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">m</span><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight" style="margin-right:0.0197em;">l</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>; 位置编码用 RoPE. 67B 为压推理成本, 用 GQA 替代传统 MHA.</p>
<p>宏观上略有不同: 7B 共 30 层, 67B 共 95 层. 在参数量与常见开源档对齐的同时, 也方便流水线切分, 利于训练与推理.</p>
<p>多数 GQA 工作会加宽 FFN; 这里 67B 更偏向加深度, 期望更好表现. 细节见表 2.</p>
<h3 id="2-3-ccs">2.3 超参数</h3>
<p>初始化标准差 0.006; 优化器用 AdamW, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>β</mi><mn>1</mn></msub><mo>=</mo><mn>0.9</mn></mrow><annotation encoding="application/x-tex">\\beta_1=0.9</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0528em;">β</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.0528em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0.9</span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>β</mi><mn>2</mn></msub><mo>=</mo><mn>0.95</mn></mrow><annotation encoding="application/x-tex">\\beta_2=0.95</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0528em;">β</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.0528em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0.95</span></span></span></span>, weight_decay=0.1.</p>
<p>预训练用 multi-step 学习率, 不用常见余弦: 2000 step warmup 到峰值; 训完 80% token 降到峰值的 31.6%; 再过到 90% 降到 10%. 梯度裁剪 1.0.</p>
<p>经验上: 训练过程 loss 曲线形状会不同, 但 multi-step 与余弦的终局表现基本一致(图 1(a)). 固定模型, 改训练规模时, multi-step 能复用第一阶段训练, 续训更方便, 故作默认. 图 1(b) 显示改各段比例还能略好一点; 为兼顾续训复用比例与性能, 最终采用 80% / 10% / 10% 三段.</p>
<p>batch size 与学习率随模型规模变; 7B, 67B 预训练具体数值见表 2.</p>
<h3 id="2-4-jcss">2.4 基础设施</h3>
<p>训练与评测用轻量框架 HAI-LLM: 数据并行, 张量并行, 序列并行, 1F1B 流水线(同 Megatron 思路); FlashAttention 抬硬件利用率; ZeRO-1 切分优化器状态. 计算与通信尽量重叠(末个 micro-batch 反传与 ZeRO-1 的 reduce-scatter; 序列并行里 GEMM 与 all-gather/reduce-scatter). 融合 LayerNorm, 能融合的 GEMM, Adam 更新. 前向 bf16, 梯度累加用 fp32 求稳; 交叉熵原地做: 在 CUDA kernel 里把 bf16 logits 现场升到 fp32 算, 再写回 bf16 梯度, 省 HBM.</p>
<p>权重与优化器状态每 5 分钟异步存一次, 最坏丢不到 5 分钟进度; 临时 checkpoint 定期清. 支持换一套 3D 并行配置再续训, 好应对集群负载变化.</p>
<p>评测: 生成任务用 vLLM; 非生成任务用 continuous batching, 少手工调 batch, 少 padding.</p>
<h2 id="3-scaling-laws">3 Scaling Laws</h2>
<p>Scaling Laws 研究早于大模型热潮. 结论大致是: 算力预算 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi></mrow><annotation encoding="application/x-tex">C</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span></span></span></span>, 模型规模 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>N</mi></mrow><annotation encoding="application/x-tex">N</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span></span>, 数据规模 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>D</mi></mrow><annotation encoding="application/x-tex">D</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0278em;">D</span></span></span></span> 加大, 表现可预期变好. 若 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>N</mi></mrow><annotation encoding="application/x-tex">N</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span></span> 用参数量, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>D</mi></mrow><annotation encoding="application/x-tex">D</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0278em;">D</span></span></span></span> 用 token 数, 常近似 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi><mo>=</mo><mn>6</mn><mi>N</mi><mi>D</mi></mrow><annotation encoding="application/x-tex">C=6ND</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord">6</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="mord mathnormal" style="margin-right:0.0278em;">D</span></span></span></span>. 于是「加算力时模型和数据怎么分」成了核心问题.</p>
<p>大模型把 Scaling Laws 推到新高峰: 更大模型常带来意外大幅提升; Scaling Laws 也说明继续砸算力仍有明显收益, 反过来鼓励把模型做大.</p>
<p>表 4 显示: 早期工作对最优模型/数据分配结论并不一致, 让人怀疑 Scaling Laws 能不能泛化. 超参设定也常交代不全, 不同算力下是否训到最优并不清楚. 本节重做 Scaling Laws, 就是为把这些不确定啃掉, 保证加算力走在对的路上. 这也是「长期主义」与持续变强的关键.</p>
<p>为让不同算力预算下的模型都能接近最优, 先做超参 Scaling Laws. 经验上多数训练超参在改算力时最优值几乎不动, 与 §2.3 一致; 真正要重查的是影响最大的 batch size 与学习率.</p>
<p>早期关于 batch / 学习率的经验在我们初实验里不好用. 大规模实验后, 拟合出算力预算 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi></mrow><annotation encoding="application/x-tex">C</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span></span></span></span> 与最优 batch, 最优学习率之间的幂律, 称作「超参 Scaling Laws」, 用来给不同算力挑近优超参.</p>
<p>再研究模型与数据规模缩放. 为省实验成本, 降低拟合难度, 采用 Chinchilla 的 IsoFLOP 剖面法. 模型规模改用 <strong>non-embedding FLOPs/token <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>M</mi></mrow><annotation encoding="application/x-tex">M</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span></strong>, 不再用参数量 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>N</mi></mrow><annotation encoding="application/x-tex">N</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span></span>; 算力预算从近似 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi><mo>=</mo><mn>6</mn><mi>N</mi><mi>D</mi></mrow><annotation encoding="application/x-tex">C=6ND</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord">6</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="mord mathnormal" style="margin-right:0.0278em;">D</span></span></span></span> 换成更准的 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi><mo>=</mo><mi>M</mi><mi>D</mi></mrow><annotation encoding="application/x-tex">C=MD</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span><span class="mord mathnormal" style="margin-right:0.0278em;">D</span></span></span></span>. 由此得到最优模型/数据分配与性能预测, 并能较准地预报 DeepSeek LLM 7B, 67B.</p>
<p>解释: non-embedding FLOPs/token(<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>M</mi></mrow><annotation encoding="application/x-tex">M</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span>)= 每处理一个 token, 不算词表那一层时, 模型前向大约要多少浮点运算. 旧做法用 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>6</mn><mi>N</mi></mrow><annotation encoding="application/x-tex">6N</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord">6</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span></span>(参数量 ×6)估算力, 既漏掉注意力对序列长度的开销, 又可能把词表矩阵算进去(词表大但对「能力」贡献相对小). <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>M</mi></mrow><annotation encoding="application/x-tex">M</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span> 把注意力算进去, 把词表算力拿掉, 小模型上误差能到约 50%, 换表示后拟合大模型更靠谱.</p>
<p>探索 Scaling Laws 时数据多轮迭代, 质量在涨. 在不同数据集上拟合发现: 数据质量会显著改最优模型/数据分配: 质量越高, 新增算力越该偏向放大模型; 同等数据规模下, 高质量数据更撑得住更大模型. 分配策略差异甚至可间接当「数据质量探针」. 后续会继续盯质量变化与 Scaling Laws, 并另文展开.</p>
<p>Scaling Laws 方面贡献与发现:</p>
<p>• 建立超参 Scaling Laws, 给近优超参一套经验框架.</p>
<p>• 用 non-embedding FLOPs/token <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>M</mi></mrow><annotation encoding="application/x-tex">M</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span> 代替参数量 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>N</mi></mrow><annotation encoding="application/x-tex">N</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">N</span></span></span></span> 表示模型规模, 最优分配更准, 大规模泛化 loss 更好预报.</p>
<p>• 预训练数据质量影响最优分配: 质量越高, 加算力越该分给模型放大.</p>
<h3 id="3-1-ccsd-scaling-laws">3.1 超参数的 Scaling Laws</h3>
<p>先在算力预算 1e17 的小规模网格搜索 batch 与学习率; 图 2(a) 是某一模型规模(177M FLOPs/token)的结果. 泛化误差在很宽的 batch / 学习率范围内都稳, 说明近优解落在较宽的参数带里.</p>
<p>再用 multi-step 日程, 通过复用第一阶段, 在 1e17–2e19 算力上训多组不同 batch, 学习率的模型. 参数空间有冗余: 泛化误差比最优高不超过 0.25% 的, 都算近优超参. 再拟合 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>B</mi></mrow><annotation encoding="application/x-tex">B</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0502em;">B</span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>η</mi></mrow><annotation encoding="application/x-tex">η</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">η</span></span></span></span> 对 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi></mrow><annotation encoding="application/x-tex">C</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span></span></span></span> 的关系(图 3): 算力加大, 最优 batch 渐增, 最优学习率渐减, 符合放大模型时的直觉. 近优点落在一条宽带里, 落带内不难. 最终公式:</p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable width="100%"><mtr><mtd width="50%"></mtd><mtd><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><msub><mi>η</mi><mrow><mi>o</mi><mi>p</mi><mi>t</mi></mrow></msub></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><mn>0.3118</mn><mo>⋅</mo><msup><mi>C</mi><mrow><mo>−</mo><mn>0.1250</mn></mrow></msup></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><msub><mi>B</mi><mrow><mi>o</mi><mi>p</mi><mi>t</mi></mrow></msub></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><mn>0.2920</mn><mo>⋅</mo><msup><mi>C</mi><mn>0.3271</mn></msup></mrow></mstyle></mtd></mtr></mtable></mtd><mtd width="50%"></mtd><mtd><mtext>(1)</mtext></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{aligned}\\eta_{ opt } &amp;= 0.3118 \\cdot C^{-0.1250} \\\\B_{ opt } &amp;= 0.2920 \\cdot C^{0.3271}\\end{aligned}\\tag{1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:2.7482em;vertical-align:-1.1241em;"></span><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6241em;"><span style="top:-3.76em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.0359em;">η</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">pt</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span><span style="top:-2.2359em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.0502em;">B</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.0502em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">pt</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.1241em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6241em;"><span style="top:-3.76em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">0.3118</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">⋅</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">−</span><span class="mord mtight">0.1250</span></span></span></span></span></span></span></span></span></span></span><span style="top:-2.2359em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">0.2920</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">⋅</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">0.3271</span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.1241em;"><span></span></span></span></span></span></span></span></span><span class="tag"><span class="strut" style="height:2.7482em;vertical-align:-1.1241em;"></span><span class="mord text"><span class="mord">(</span><span class="mord"><span class="mord">1</span></span><span class="mord">)</span></span></span></span></span></span><p>在 1e20 算力的一系列模型上验证公式; 图 2(b) 是某一规模(2.94B FLOPs/token). 拟合出的超参落在最优区域中心; 后文也显示按此公式给 7B, 67B 选的超参表现良好.</p>
<p>要注意: 尚未考虑算力 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi></mrow><annotation encoding="application/x-tex">C</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span></span></span></span> 以外因素对最优超参的影响; 这与部分早期工作(认为最优 batch 可只由泛化误差 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>L</mi></mrow><annotation encoding="application/x-tex">L</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal">L</span></span></span></span> 建模)不一致. 同算力, 不同模型/数据分配时, 最优超参带也会略有偏移. 超参选择与训练动力学仍需后续研究.</p>
<h3 id="3-2-gjzymxysjsf">3.2 估计最优模型与数据缩放</h3>
<p>有了近优超参公式后, 开始拟合缩放曲线, 分析最优模型/数据分配: 找指数 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi></mrow><annotation encoding="application/x-tex">a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">a</span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>b</mi></mrow><annotation encoding="application/x-tex">b</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">b</span></span></span></span>, 使 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>N</mi><mrow><mi mathvariant="normal">o</mi><mi mathvariant="normal">p</mi><mi mathvariant="normal">t</mi></mrow></msub><mo>∝</mo><msup><mi>C</mi><mi>a</mi></msup></mrow><annotation encoding="application/x-tex">N_{\\mathrm{opt}}\\propto C^a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9694em;vertical-align:-0.2861em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">opt</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">∝</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6644em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">a</span></span></span></span></span></span></span></span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>D</mi><mrow><mi mathvariant="normal">o</mi><mi mathvariant="normal">p</mi><mi mathvariant="normal">t</mi></mrow></msub><mo>∝</mo><msup><mi>C</mi><mi>b</mi></msup></mrow><annotation encoding="application/x-tex">D_{\\mathrm{opt}}\\propto C^b</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9694em;vertical-align:-0.2861em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0278em;">D</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.0278em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">opt</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">∝</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.8491em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8491em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">b</span></span></span></span></span></span></span></span></span></span></span>. 数据规模 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>D</mi></mrow><annotation encoding="application/x-tex">D</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0278em;">D</span></span></span></span> 一律用 token 数. 既往模型规模多用参数: 非嵌入参数 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>N</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">N_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>(Kaplan)或全参数 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>N</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">N_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>(Hoffmann), 并近似 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi><mo>=</mo><mn>6</mn><mi>N</mi><mi>D</mi></mrow><annotation encoding="application/x-tex">C=6ND</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord">6</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="mord mathnormal" style="margin-right:0.0278em;">D</span></span></span></span>. 但 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>6</mn><msub><mi>N</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">6N_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>6</mn><msub><mi>N</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">6N_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 都不含注意力相对序列长度的开销; <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>6</mn><msub><mi>N</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">6N_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 还把词表计算算进去(对容量贡献相对小), 某些设定下近似误差很大.</p>
<p>为减误差, 引入 non-embedding FLOPs/token <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>M</mi></mrow><annotation encoding="application/x-tex">M</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span>: 含注意力开销, 不含词表计算. 用 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>M</mi></mrow><annotation encoding="application/x-tex">M</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span> 表示后, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi><mo>=</mo><mi>M</mi><mi>D</mi></mrow><annotation encoding="application/x-tex">C=MD</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span><span class="mord mathnormal" style="margin-right:0.0278em;">D</span></span></span></span>. 三者差别如下:</p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable width="100%"><mtr><mtd width="50%"></mtd><mtd><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mn>6</mn><msub><mi>N</mi><mn>1</mn></msub></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mrow><mrow></mrow><mo>=</mo><mn>72</mn><msub><mi>n</mi><mrow><mi mathvariant="normal">l</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">y</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">r</mi></mrow></msub><msubsup><mi>d</mi><mrow><mi mathvariant="normal">m</mi><mi mathvariant="normal">o</mi><mi mathvariant="normal">d</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">l</mi></mrow><mn>2</mn></msubsup></mrow></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mn>6</mn><msub><mi>N</mi><mn>2</mn></msub></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mrow><mrow></mrow><mo>=</mo><mn>72</mn><msub><mi>n</mi><mrow><mi mathvariant="normal">l</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">y</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">r</mi></mrow></msub><msubsup><mi>d</mi><mrow><mi mathvariant="normal">m</mi><mi mathvariant="normal">o</mi><mi mathvariant="normal">d</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">l</mi></mrow><mn>2</mn></msubsup><mo>+</mo><mn>6</mn><msub><mi>n</mi><mrow><mi mathvariant="normal">v</mi><mi mathvariant="normal">o</mi><mi mathvariant="normal">c</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">b</mi></mrow></msub><msub><mi>d</mi><mrow><mi mathvariant="normal">m</mi><mi mathvariant="normal">o</mi><mi mathvariant="normal">d</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">l</mi></mrow></msub></mrow></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mi>M</mi></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mrow><mrow></mrow><mo>=</mo><mn>72</mn><msub><mi>n</mi><mrow><mi mathvariant="normal">l</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">y</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">r</mi></mrow></msub><msubsup><mi>d</mi><mrow><mi mathvariant="normal">m</mi><mi mathvariant="normal">o</mi><mi mathvariant="normal">d</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">l</mi></mrow><mn>2</mn></msubsup><mo>+</mo><mn>12</mn><msub><mi>n</mi><mrow><mi mathvariant="normal">l</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">y</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">r</mi></mrow></msub><msub><mi>d</mi><mrow><mi mathvariant="normal">m</mi><mi mathvariant="normal">o</mi><mi mathvariant="normal">d</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">l</mi></mrow></msub><msub><mi>l</mi><mrow><mi mathvariant="normal">s</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">q</mi></mrow></msub></mrow></mrow></mstyle></mtd></mtr></mtable></mtd><mtd width="50%"></mtd><mtd><mtext>(2)</mtext></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{aligned} { 6 N _ { 1 } } &amp; { { } = 7 2   n _ { \\mathrm { l a y e r } }   d _ { \\mathrm { m o d e l } } ^ { 2 } } \\\\ { 6 N _ { 2 } } &amp; { { } = 7 2   n _ { \\mathrm { l a y e r } }   d _ { \\mathrm { m o d e l } } ^ { 2 } + 6   n _ { \\mathrm { v o c a b } }   d _ { \\mathrm { m o d e l } } } \\\\ { M } &amp; { { } = 7 2   n _ { \\mathrm { l a y e r } }   d _ { \\mathrm { m o d e l } } ^ { 2 } + 1 2   n _ { \\mathrm { l a y e r } }   d _ { \\mathrm { m o d e l } }   l _ { \\mathrm { s e q } } } \\end{aligned}\\tag{2}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:4.2723em;vertical-align:-1.8862em;"></span><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:2.3862em;"><span style="top:-4.5221em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span><span style="top:-2.9979em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span><span style="top:-1.4738em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.8862em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:2.3862em;"><span style="top:-4.5221em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">72</span><span class="mord"><span class="mord mathnormal">n</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">layer</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">d</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-2.453em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">model</span></span></span></span></span><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.247em;"><span></span></span></span></span></span></span></span></span></span><span style="top:-2.9979em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">72</span><span class="mord"><span class="mord mathnormal">n</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">layer</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">d</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-2.453em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">model</span></span></span></span></span><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.247em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathnormal">n</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">vocab</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">d</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">model</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span><span style="top:-1.4738em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">72</span><span class="mord"><span class="mord mathnormal">n</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">layer</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">d</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-2.453em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">model</span></span></span></span></span><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.247em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">12</span><span class="mord"><span class="mord mathnormal">n</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">layer</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">d</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">model</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0197em;">l</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.1514em;"><span style="top:-2.55em;margin-left:-0.0197em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">seq</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.8862em;"><span></span></span></span></span></span></span></span></span><span class="tag"><span class="strut" style="height:4.2723em;vertical-align:-1.8862em;"></span><span class="mord text"><span class="mord">(</span><span class="mord"><span class="mord">2</span></span><span class="mord">)</span></span></span></span></span></span><p>其中 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>n</mi><mrow><mi mathvariant="normal">l</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">y</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">r</mi></mrow></msub></mrow><annotation encoding="application/x-tex">n_{\\mathrm{layer}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7167em;vertical-align:-0.2861em;"></span><span class="mord"><span class="mord mathnormal">n</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">layer</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span></span> 层数, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>d</mi><mrow><mi mathvariant="normal">m</mi><mi mathvariant="normal">o</mi><mi mathvariant="normal">d</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">l</mi></mrow></msub></mrow><annotation encoding="application/x-tex">d_{\\mathrm{model}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">d</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">model</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 宽度, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>n</mi><mrow><mi mathvariant="normal">v</mi><mi mathvariant="normal">o</mi><mi mathvariant="normal">c</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">b</mi></mrow></msub></mrow><annotation encoding="application/x-tex">n_{\\mathrm{vocab}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.5806em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">n</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">vocab</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 词表大小, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>l</mi><mrow><mi mathvariant="normal">s</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">q</mi></mrow></msub></mrow><annotation encoding="application/x-tex">l_{\\mathrm{seq}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9805em;vertical-align:-0.2861em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0197em;">l</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.1514em;"><span style="top:-2.55em;margin-left:-0.0197em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">seq</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span></span> 序列长度. 表 3 比较三种表示: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>6</mn><msub><mi>N</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">6N_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>6</mn><msub><mi>N</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">6N_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 在不同规模上会高估或低估算力, 小模型偏差可达约 50%, 拟合缩放曲线会引入可观统计误差. 更多分析见附录 A. 2.</p>
<table>
<thead>
<tr>
<th>𝑛layers</th>
<th>𝑑<sub>model</sub></th>
<th>𝑛vocab</th>
<th>𝑙<sub>seq</sub></th>
<th>𝑁<sub>1</sub></th>
<th>𝑁<sub>2</sub></th>
<th>𝑀</th>
<th>6𝑁<sub>1</sub>/𝑀</th>
<th>6𝑁<sub>2</sub>/𝑀</th>
</tr>
</thead>
<tbody><tr>
<td>8</td>
<td>512</td>
<td></td>
<td></td>
<td>25.2M</td>
<td>77.6M</td>
<td>352M</td>
<td>0.43</td>
<td>1.32</td>
</tr>
<tr>
<td>12</td>
<td>768</td>
<td></td>
<td></td>
<td>84.9M</td>
<td>164M</td>
<td>963M</td>
<td>0.53</td>
<td>1.02</td>
</tr>
<tr>
<td>24</td>
<td>1024</td>
<td></td>
<td></td>
<td>302M</td>
<td>407M</td>
<td>3.02B</td>
<td>0.60</td>
<td>0.81</td>
</tr>
<tr>
<td>24</td>
<td>2048</td>
<td>102400</td>
<td>4096</td>
<td>1.21B</td>
<td>1.42B</td>
<td>9.66B</td>
<td>0.75</td>
<td>0.88</td>
</tr>
<tr>
<td>32</td>
<td>4096</td>
<td></td>
<td></td>
<td>6.44B</td>
<td>6.86B</td>
<td>45.1B</td>
<td>0.85</td>
<td>0.91</td>
</tr>
<tr>
<td>40</td>
<td>5120</td>
<td></td>
<td></td>
<td>12.6B</td>
<td>13.1B</td>
<td>85.6B</td>
<td>0.88</td>
<td>0.92</td>
</tr>
<tr>
<td>80</td>
<td>8192</td>
<td></td>
<td></td>
<td>64.4B</td>
<td>65.3B</td>
<td>419B</td>
<td>0.92</td>
<td>0.94</td>
</tr>
</tbody></table>
<p>表 3｜模型规模三种表示的差异, 以及 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>N</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">N_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>N</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">N_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 相对 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>M</mi></mrow><annotation encoding="application/x-tex">M</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span> 的偏离.</p>
<p>用 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>M</mi></mrow><annotation encoding="application/x-tex">M</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span> 之后, 目标更清楚: 给定 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi><mo>=</mo><mi>M</mi><mi>D</mi></mrow><annotation encoding="application/x-tex">C=MD</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span><span class="mord mathnormal" style="margin-right:0.0278em;">D</span></span></span></span>, 找使泛化误差最小的最优模型规模 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>M</mi><mrow><mi mathvariant="normal">o</mi><mi mathvariant="normal">p</mi><mi mathvariant="normal">t</mi></mrow></msub></mrow><annotation encoding="application/x-tex">M_{\\mathrm{opt}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9694em;vertical-align:-0.2861em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">M</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">opt</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span></span> 与数据规模 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>D</mi><mrow><mi mathvariant="normal">o</mi><mi mathvariant="normal">p</mi><mi mathvariant="normal">t</mi></mrow></msub></mrow><annotation encoding="application/x-tex">D_{\\mathrm{opt}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9694em;vertical-align:-0.2861em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0278em;">D</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.0278em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">opt</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span></span>:</p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable width="100%"><mtr><mtd width="50%"></mtd><mtd><mrow><msub><mi>M</mi><mrow><mi mathvariant="normal">o</mi><mi mathvariant="normal">p</mi><mi mathvariant="normal">t</mi></mrow></msub><mo stretchy="false">(</mo><mi>C</mi><mo stretchy="false">)</mo><mo separator="true">,</mo><msub><mi>D</mi><mrow><mi mathvariant="normal">o</mi><mi mathvariant="normal">p</mi><mi mathvariant="normal">t</mi></mrow></msub><mo stretchy="false">(</mo><mi>C</mi><mo stretchy="false">)</mo><mo>=</mo><mi><munder><mo><mrow><mi mathvariant="normal">a</mi><mi mathvariant="normal">r</mi><mi mathvariant="normal">g</mi><mi mathvariant="normal">m</mi><mi mathvariant="normal">i</mi><mi mathvariant="normal">n</mi></mrow></mo><mrow><mi>M</mi><mo separator="true">,</mo><mi>D</mi><mrow><mi mathvariant="normal">s</mi><mi mathvariant="normal">.</mi><mi mathvariant="normal">t</mi><mi mathvariant="normal">.</mi></mrow><mi>C</mi><mo>=</mo><mi>M</mi><mi>D</mi></mrow></munder></mi><mi>L</mi><mo stretchy="false">(</mo><mi>N</mi><mo separator="true">,</mo><mi>D</mi><mo stretchy="false">)</mo></mrow></mtd><mtd width="50%"></mtd><mtd><mtext>(3)</mtext></mtd></mtr></mtable><annotation encoding="application/x-tex">M _ { \\mathrm { o p t } } ( C ) , D _ { \\mathrm { o p t } } ( C ) = \\underset { M , D   \\mathrm { s . t . }   C = M D } { \\mathrm { a r g m i n } }   L ( N , D )\\tag{3}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.0361em;vertical-align:-0.2861em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">M</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">opt</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="mclose">)</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0278em;">D</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.0278em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">opt</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.8249em;vertical-align:-1.0749em;"></span><span class="mord"><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.6679em;"><span style="top:-2.1612em;margin-left:0em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.109em;">M</span><span class="mpunct mtight">,</span><span class="mord mathnormal mtight" style="margin-right:0.0278em;">D</span><span class="mord mtight"><span class="mord mathrm mtight">s.t.</span></span><span class="mord mathnormal mtight" style="margin-right:0.0715em;">C</span><span class="mrel mtight">=</span><span class="mord mathnormal mtight" style="margin-right:0.109em;">M</span><span class="mord mathnormal mtight" style="margin-right:0.0278em;">D</span></span></span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span><span class="mop"><span class="mord"><span class="mord mathrm">argmin</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.0749em;"><span></span></span></span></span></span></span><span class="mord mathnormal">L</span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.0278em;">D</span><span class="mclose">)</span></span><span class="tag"><span class="strut" style="height:1.8249em;vertical-align:-1.0749em;"></span><span class="mord text"><span class="mord">(</span><span class="mord"><span class="mord">3</span></span><span class="mord">)</span></span></span></span></span></span><p>采用 Chinchilla 的 IsoFLOP 剖面拟合. 选 8 档算力(1e17–3e20), 每档约 10 种模型/数据分配; 超参由式 (1) 定; 泛化误差在独立验证集上算(分布近似训练集, 约 100M token).</p>
<p>图 4 给出 IsoFLOP 与模型/数据缩放曲线(按每档最优分配拟合). 最优 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>M</mi><mrow><mi mathvariant="normal">o</mi><mi mathvariant="normal">p</mi><mi mathvariant="normal">t</mi></mrow></msub></mrow><annotation encoding="application/x-tex">M_{\\mathrm{opt}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9694em;vertical-align:-0.2861em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">M</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">opt</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>D</mi><mrow><mi mathvariant="normal">o</mi><mi mathvariant="normal">p</mi><mi mathvariant="normal">t</mi></mrow></msub></mrow><annotation encoding="application/x-tex">D_{\\mathrm{opt}}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9694em;vertical-align:-0.2861em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0278em;">D</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.0278em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">opt</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span></span>:</p>
<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable width="100%"><mtr><mtd width="50%"></mtd><mtd><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><msub><mi>M</mi><mrow><mi mathvariant="normal">o</mi><mi mathvariant="normal">p</mi><mi mathvariant="normal">t</mi></mrow></msub></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><msub><mi>M</mi><mrow><mi mathvariant="normal">b</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">s</mi><mi mathvariant="normal">e</mi></mrow></msub><mo>⋅</mo><msup><mi mathvariant="bold-italic">C</mi><mi>a</mi></msup><mo separator="true">,</mo><mspace width="1em"/><msub><mi>M</mi><mrow><mi mathvariant="normal">b</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">s</mi><mi mathvariant="normal">e</mi></mrow></msub><mo>=</mo><mn>0.1715</mn><mo separator="true">,</mo><mspace width="1em"/><mi>a</mi><mo>=</mo><mn>0.5243</mn><mo separator="true">,</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><msub><mi>D</mi><mrow><mi mathvariant="normal">o</mi><mi mathvariant="normal">p</mi><mi mathvariant="normal">t</mi></mrow></msub></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><msub><mi>D</mi><mrow><mi mathvariant="normal">b</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">s</mi><mi mathvariant="normal">e</mi></mrow></msub><mo>⋅</mo><msup><mi mathvariant="bold-italic">C</mi><mi>b</mi></msup><mo separator="true">,</mo><mspace width="1em"/><msub><mi>D</mi><mrow><mi mathvariant="normal">b</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">s</mi><mi mathvariant="normal">e</mi></mrow></msub><mo>=</mo><mn>5.8316</mn><mo separator="true">,</mo><mspace width="1em"/><mi>b</mi><mo>=</mo><mn>0.4757.</mn></mrow></mstyle></mtd></mtr></mtable></mtd><mtd width="50%"></mtd><mtd><mtext>(4)</mtext></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{aligned}M_{\\mathrm{opt}} &amp;= M_{\\mathrm{base}} \\cdot \\boldsymbol{C}^{a}, \\quad M_{\\mathrm{base}} = 0.1715, \\quad a = 0.5243, \\\\D_{\\mathrm{opt}} &amp;= D_{\\mathrm{base}} \\cdot \\boldsymbol{C}^{b}, \\quad D_{\\mathrm{base}} = 5.8316, \\quad b = 0.4757. \\end{aligned}\\tag{4}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:2.7851em;vertical-align:-1.1426em;"></span><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6426em;"><span style="top:-3.8026em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">M</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">opt</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span><span style="top:-2.2174em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.0278em;">D</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:-0.0278em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">opt</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.1426em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6426em;"><span style="top:-3.8026em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">M</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">base</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">⋅</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord boldsymbol" style="margin-right:0.0698em;">C</span></span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7404em;"><span style="top:-3.139em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">a</span></span></span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:1em;"></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">M</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">base</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">0.1715</span><span class="mpunct">,</span><span class="mspace" style="margin-right:1em;"></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">a</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">0.5243</span><span class="mpunct">,</span></span></span><span style="top:-2.2174em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0278em;">D</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:-0.0278em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">base</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">⋅</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord boldsymbol" style="margin-right:0.0698em;">C</span></span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.9251em;"><span style="top:-3.139em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">b</span></span></span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:1em;"></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.0278em;">D</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:-0.0278em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathrm mtight">base</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">5.8316</span><span class="mpunct">,</span><span class="mspace" style="margin-right:1em;"></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">0.4757.</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.1426em;"><span></span></span></span></span></span></span></span></span><span class="tag"><span class="strut" style="height:2.7851em;vertical-align:-1.1426em;"></span><span class="mord text"><span class="mord">(</span><span class="mord"><span class="mord">4</span></span><span class="mord">)</span></span></span></span></span></span><p>还按算力 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi></mrow><annotation encoding="application/x-tex">C</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.0715em;">C</span></span></span></span> 与最优泛化误差拟合 loss 缩放曲线, 并预报 7B, 67B(图 5). 小规模实验能较准预报约 1000× 算力的模型表现, 给更大规模训练提供信心与指引.</p>
<h3 id="3-3-btsjxd-scaling-laws">3.3 不同数据下的 Scaling Laws</h3>
<p>开发中语料多轮迭代: 调各来源比例, 抬整体质量, 因此能继续分析「不同数据集如何改 Scaling Laws」.</p>
<p>三套数据: 早期内部, 当前内部, 以及 Kaplan 用过的 OpenWebText2. 内部评估: 当前内部优于早期; OpenWebText2 因规模更小, 加工更细, 质量甚至高于当前内部.</p>
<table>
<thead>
<tr>
<th></th>
<th>Coeff. 𝑎 where</th>
<th>Coeff. 𝑏 where</th>
</tr>
</thead>
<tbody><tr>
<td>Approach</td>
<td>𝑁<sub>opt</sub>(𝑀<sub>opt</sub>) ∝ 𝐶<sup>𝑎</sup></td>
<td>𝐷<sub>opt</sub> ∝ 𝐶<sup>𝑏</sup></td>
</tr>
<tr>
<td>OpenAI (OpenWebText2)</td>
<td>0.73</td>
<td>0.27</td>
</tr>
<tr>
<td>Chinchilla (MassiveText)</td>
<td>0.49</td>
<td>0.51</td>
</tr>
<tr>
<td>Ours (Early Data)</td>
<td>0.450</td>
<td>0.550</td>
</tr>
<tr>
<td>Ours (Current Data)</td>
<td>0.524</td>
<td>0.476</td>
</tr>
<tr>
<td>Ours (OpenWebText2)</td>
<td>0.578</td>
<td>0.422</td>
</tr>
</tbody></table>
<p>表 4｜模型缩放系数 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi></mrow><annotation encoding="application/x-tex">a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">a</span></span></span></span> 与数据缩放系数 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>b</mi></mrow><annotation encoding="application/x-tex">b</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">b</span></span></span></span> 随训练数据分布变化.</p>
<p>有趣现象: 三套数据上的最优分配与质量排序一致. 表 4: 质量升, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi></mrow><annotation encoding="application/x-tex">a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">a</span></span></span></span> 升, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>b</mi></mrow><annotation encoding="application/x-tex">b</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">b</span></span></span></span> 降, 新增算力更该分给模型而非数据. 这也可能解释早期文献里最优分配差那么大.</p>
<p>直观猜测: 高质量数据逻辑更清楚, 训足后预测难度更低, 加算力时更划算去放大模型. 数据质量与 Scaling Laws 的关系会继续跟踪.</p>
<h2 id="4-dq">4 对齐</h2>
<p>收集约 150 万条中英指令数据, 覆盖有用性与无害性. 有用数据 120 万: 通用语言 31.2%, 数学 46.6%, 代码 22.2%; 安全数据 30 万, 覆盖多种敏感主题.</p>
<p>对齐流水线分两段.</p>
<p><strong>监督微调(SFT):</strong> 7B 训 4 个 epoch, 67B 只训 2 个--67B 过拟合更严重. 7B 上 GSM8K, HumanEval 持续涨; 67B 很快触顶. 学习率分别为 1e-5, 5e-6. 除基准准确率外, 还盯 chat 的<strong>重复率</strong>: 用 3868 条中英 prompt, 统计「生成停不下来, 一段文字循环复读」的比例. 数学 SFT 越多, 重复率越容易升-- 数学数据常有相似推理模板, 弱模型学不会就复读. 对策试过两阶段微调与 DPO, 都能基本保住基准分并明显压重复.</p>
<p><strong>DPO:</strong> 用直接偏好优化继续抬能力. 按有用性与无害性构造偏好对; 有用侧收集多语 prompt(创意写作, 问答, 跟指令等), 再用自家 Chat 生成候选回答; 无害侧同理.</p>
<p>DPO 训 1 个 epoch, 学习率 5e-6, batch 512, warmup + 余弦日程. 发现: 开放式生成明显变强, 标准基准分数几乎不动.</p>
<h2 id="5-pc">5 评测</h2>
<h3 id="5-1-gkjzpc">5.1 公开基准评测</h3>
<p>用内部评测框架, 在中英公开基准上评.</p>
<p><strong>多学科选择题</strong>: MMLU, C-Eval, CMMLU.</p>
<p><strong>语言理解与推理</strong>: HellaSwag, PIQA, ARC, OpenBookQA, BBH.</p>
<p><strong>闭卷问答</strong>: TriviaQA, NaturalQuestions.</p>
<p><strong>阅读理解</strong>: RACE, DROP, C3.</p>
<p><strong>指代消歧</strong>: WinoGrande, CLUEWSC.</p>
<p><strong>语言建模</strong>: Pile.</p>
<p><strong>中文理解与文化</strong>: CHID, CCPM.</p>
<p><strong>数学</strong>: GSM8K, MATH, CMath.</p>
<p><strong>代码</strong>: HumanEval, MBPP.</p>
<p><strong>标准化考试</strong>: AGIEval.</p>
<p>选项题用困惑度评测: 算每个选项的困惑度, 取最低者. 含 HellaSwag, PIQA, WinoGrande, RACE-Middle/High, MMLU, ARC-Easy/Challenge, OpenBookQA, CHID, C-Eval, CMMLU, C3, CCPM. ARC 与 OpenBookQA 用无条件归一化(Brown et al., 2020), 其余用长度归一化.</p>
<p>生成式评测用于 TriviaQA, NaturalQuestions, DROP, MATH, GSM8K, HumanEval, MBPP, BBH, AGIEval, CLUEWSC, CMath: 自由生成再解析; 解码用 greedy.</p>
<p>Pile-test 用语模评测: 算测试语料的 bits-per-byte.</p>
<p>不同基准最大序列长用 2048 或 4096; 格式细节见附录 A. 6.</p>
<h4 id="5-1-1-base-mx">5.1.1 Base 模型</h4>
<p>表 5 是主结果. DeepSeek 在 2T 中英双语上预训练, 英语理解基准仍能跟同吃 2T, 但偏英语的 LLaMA2 打平; 67B 在 MATH, GSM8K, HumanEval, MBPP, BBH 与中文基准上明显强于 LLaMA2 70B. 基准曲线见附录 A. 3. GSM8K, BBH 等随模型放大明显抬升--7B 与 67B 同数据, 这类跃迁更像大模型 few-shot 能力在起作用. 若数学数据占比再抬, 大小模型差距也可能收窄.</p>
<p>有趣观察: DeepSeek 67B 相对 LLaMA2 70B 的优势, 大于 7B 对 7B 的优势-- 语言冲突对小模型冲击更大. LLaMA2 没专门吃中文, 在 CMath 等题上仍不错, 说明数学推理一类基础能力可跨语言迁移; 但 CHID 这类成语用法, 需要预训练吞大量中文 token, LLaMA2 就明显落后.</p>
<h4 id="5-1-2-chat-mx">5.1.2 Chat 模型</h4>
<p>表 6 给出 Chat 结果: 多数任务微调后上涨, 也有少数任务</p>
<p>表 5｜主结果(内部评测框架). 加粗为四模型最优. Pile-test 报 BPB, DROP 报 F1, 其余报准确率. test-shots 为上限; 上下文或同篇 few-shot 样本不够时(如 RACE)可能更少.</p>
<p>在个别任务上出现下降.</p>
<p><strong>知识:</strong> Base/Chat 在 TriviaQA, MMLU, C-Eval 等知识题上会有小幅波动, 但作者不认为这代表 SFT「学到或丢掉」了知识. SFT 的价值在于: Chat 的 zero-shot 能摸到 Base 的 few-shot 水平, 更贴近真实用法. 例如 Chat 的 0-shot MMLU ≈ Base 的 5-shot MMLU.</p>
<p><strong>推理:</strong> SFT 里大量 CoT 格式, Chat 在 BBH, NaturalQuestions 等略涨; 作者认为 SFT 学的主要是推理路径的正确写法, 而不是「新的推理能力」本身.</p>
<table>
<thead>
<tr>
<th>Language Benchmark</th>
<th>DeepSeek 7B Base</th>
<th>DeepSeek 7B Chat</th>
<th>DeepSeek 67B Base</th>
<th>DeepSeek 67B Chat</th>
</tr>
</thead>
<tbody><tr>
<td>HellaSwag</td>
<td>75.4</td>
<td>68.5</td>
<td>84.0</td>
<td>75.7</td>
</tr>
<tr>
<td>PIQA</td>
<td>79.2</td>
<td>77.6</td>
<td>83.6</td>
<td>82.6</td>
</tr>
<tr>
<td>WinoGrande</td>
<td>70.5</td>
<td>66.9</td>
<td>79.8</td>
<td>76.0</td>
</tr>
<tr>
<td>RACE-Middle</td>
<td>63.2</td>
<td>65.2</td>
<td>69.9</td>
<td>70.9</td>
</tr>
<tr>
<td>RACE-High</td>
<td>46.5</td>
<td>50.8</td>
<td>50.7</td>
<td>56.0</td>
</tr>
<tr>
<td>TriviaQA</td>
<td>59.7</td>
<td>57.9</td>
<td>78.9</td>
<td>81.5</td>
</tr>
<tr>
<td>NaturalQuestions</td>
<td>22.2</td>
<td>32.5</td>
<td>36.6</td>
<td>47.0</td>
</tr>
<tr>
<td>MMLU</td>
<td>48.2</td>
<td>49.4</td>
<td>71.3</td>
<td>71.1</td>
</tr>
<tr>
<td>ARC-Easy</td>
<td>67.9</td>
<td>71.0</td>
<td>76.9</td>
<td>81.6</td>
</tr>
<tr>
<td>English</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td>ARC-Challenge</td>
<td>48.1</td>
<td>49.4</td>
<td>59.0</td>
<td>64.1</td>
</tr>
<tr>
<td>GSM8K</td>
<td>17.4</td>
<td>63.0</td>
<td>63.4</td>
<td>84.1</td>
</tr>
<tr>
<td>MATH</td>
<td>6.0</td>
<td>15.8</td>
<td>18.7</td>
<td>32.6</td>
</tr>
<tr>
<td>HumanEval</td>
<td>26.2</td>
<td>48.2</td>
<td>42.7</td>
<td>73.8</td>
</tr>
<tr>
<td>MBPP</td>
<td>39.0</td>
<td>35.2</td>
<td>57.4</td>
<td>61.4</td>
</tr>
<tr>
<td>DROP</td>
<td>41.0</td>
<td>49.1</td>
<td>67.9</td>
<td>71.9</td>
</tr>
<tr>
<td>OpenBookQA</td>
<td>55.8</td>
<td>54.8</td>
<td>60.2</td>
<td>63.2</td>
</tr>
<tr>
<td>BBH</td>
<td>39.5</td>
<td>42.3</td>
<td>68.7</td>
<td>71.7</td>
</tr>
<tr>
<td>AGIEval</td>
<td>26.4</td>
<td>19.3</td>
<td>41.3</td>
<td>46.4</td>
</tr>
<tr>
<td>CLUEWSC</td>
<td>73.1</td>
<td>71.9</td>
<td>81.0</td>
<td>60.0</td>
</tr>
<tr>
<td>CHID</td>
<td>89.3</td>
<td>64.9</td>
<td>92.1</td>
<td>72.6</td>
</tr>
<tr>
<td>C-Eval</td>
<td>45.0</td>
<td>47.0</td>
<td>66.1</td>
<td>65.2</td>
</tr>
<tr>
<td>Chinese CMMLU</td>
<td>47.2</td>
<td>49.7</td>
<td>70.8</td>
<td>67.8</td>
</tr>
<tr>
<td>CMath</td>
<td>34.5</td>
<td>68.4</td>
<td>63.0</td>
<td>80.3</td>
</tr>
<tr>
<td>C3</td>
<td>65.4</td>
<td>66.4</td>
<td>75.3</td>
<td>77.0</td>
</tr>
<tr>
<td>CCPM</td>
<td>76.9</td>
<td>76.5</td>
<td>88.5</td>
<td>84.9</td>
</tr>
</tbody></table>
<p>表 6｜Base 与 Chat 对照. Chat 在 MMLU, GSM8K, MATH, C-Eval, CMMLU 上用 0-shot; Base 仍为 few-shot.</p>
<p><strong>持续掉分的任务:</strong> 不论体量或 checkpoint, 微调后少数任务稳定下滑, 多为完形填空或续句(如 HellaSwag). 纯语言模型更擅长这类题, 说得通.</p>
<p><strong>数学与代码:</strong> 微调后涨幅大, HumanEval, GSM8K 可涨二十多分. 解释: Base 在这些任务上原本欠拟合, SFT 用大量相关数据补了知识. 但能力可能仍偏代码补全与代数题; 要全面理解数学与编程, 还需在预训练阶段塞更多样数据, 留作后续. 代码/数学细分析见附录 A. 4.</p>
<p>7B 微调: 先全数据训(stage-1), 再去掉数学与代码做第二阶段. 动机是 stage-1 重复率 2.0%, stage-2 降到 1.4% 且基准分基本保住. 67B 第一阶段重复率已低于 1%, 第二阶段反而伤基准, 故 67B 只做一阶段 SFT.</p>
<table><tbody><tr><td rowspan="2">Model模型</td><td rowspan="2">Overall总分</td><td colspan="4">Reasoning中文推理</td><td colspan="6">Language中文语言</td></tr><tr><td>Avg. 推理总分</td><td>Math. 数学计算</td><td>Logi. 逻辑推理</td><td>Avg. 语言总分</td><td>Fund. 基本任务</td><td>Chi. 中文理解</td><td>Open. 综合问答</td><td>Writ. 文本写作</td><td>Role. 角色扮演</td><td>Pro. 专业能力</td></tr><tr><td>gpt-4-1106-preview</td><td>8.01</td><td>7.73</td><td>7.80</td><td>7.66</td><td>8.29</td><td>7.99</td><td>7.33</td><td>8.61</td><td>8.67</td><td>8.47</td><td>8.65</td></tr><tr><td>gpt-4-0613</td><td>7.53</td><td>7.47</td><td>7.56</td><td>7.37</td><td>7.59</td><td>7.81</td><td>6.93</td><td>7.42</td><td>7.93</td><td>7.51</td><td>7.94</td></tr><tr><td>DeepSeek-67B-Chat-DPO*</td><td>6.69</td><td>5.77</td><td>6.13</td><td>5.41</td><td>7.60</td><td>7.29</td><td>7.47</td><td>7.82</td><td>7.51</td><td>7.83</td><td>7.71</td></tr><tr><td>DeepSeek-67B-Chat*</td><td>6.43</td><td>5.75</td><td>5.71</td><td>5.79</td><td>7.11</td><td>7.12</td><td>6.52</td><td>7.58</td><td>7.20</td><td>6.91</td><td>7.37</td></tr><tr><td>chatglm-turbo(智谱清言)</td><td>6.24</td><td>5.00</td><td>4.74</td><td>5.26</td><td>7.49</td><td>6.82</td><td>7.17</td><td>8.16</td><td>7.77</td><td>7.76</td><td>7.24</td></tr><tr><td>erniebot-3.5(文心一言)</td><td>6.14</td><td>5.15</td><td>5.03</td><td>5.27</td><td>7.13</td><td>6.62</td><td>7.60</td><td>7.26</td><td>7.56</td><td>6.83</td><td>6.90</td></tr><tr><td>gpt-3.5-turbo-0613</td><td>6.08</td><td>5.35</td><td>5.68</td><td>5.02</td><td>6.82</td><td>6.71</td><td>5.81</td><td>7.29</td><td>7.03</td><td>7.28</td><td>6.77</td></tr><tr><td>chatglm-pro(智谱清言)</td><td>5.83</td><td>4.65</td><td>4.54</td><td>4.75</td><td>7.01</td><td>6.51</td><td>6.76</td><td>7.47</td><td>7.07</td><td>7.34</td><td>6.89</td></tr><tr><td>spark_desk_v2(讯飞星火)</td><td>5.74</td><td>4.73</td><td>4.71</td><td>4.74</td><td>6.76</td><td>5.84</td><td>6.97</td><td>7.29</td><td>7.18</td><td>6.92</td><td>6.34</td></tr><tr><td>Qwen-14B-Chat</td><td>5.72</td><td>4.81</td><td>4.91</td><td>4.71</td><td>6.63</td><td>6.90</td><td>6.36</td><td>6.74</td><td>6.64</td><td>6.59</td><td>6.56</td></tr><tr><td>Baichuan2-13B-Chat</td><td>5.25</td><td>3.92</td><td>3.76</td><td>4.07</td><td>6.59</td><td>6.22</td><td>6.05</td><td>7.11</td><td>6.97</td><td>6.75</td><td>6.43</td></tr><tr><td>ChatGLM3-6B</td><td>4.97</td><td>3.85</td><td>3.55</td><td>4.14</td><td>6.10</td><td>5.75</td><td>5.29</td><td>6.71</td><td>6.83</td><td>6.28</td><td>5.73</td></tr><tr><td>Baichuan2-7B-Chat</td><td>4.97</td><td>3.66</td><td>3.56</td><td>3.75</td><td>6.28</td><td>5.81</td><td>5.50</td><td>7.13</td><td>6.84</td><td>6.53</td><td>5.84</td></tr><tr><td>InternLM-20B</td><td>4.96</td><td>3.66</td><td>3.39</td><td>3.92</td><td>6.26</td><td>5.96</td><td>5.50</td><td>7.18</td><td>6.19</td><td>6.49</td><td>6.22</td></tr><tr><td>Qwen-7B-Chat</td><td>4.91</td><td>3.73</td><td>3.62</td><td>3.83</td><td>6.09</td><td>6.40</td><td>5.74</td><td>6.26</td><td>6.31</td><td>6.19</td><td>5.66</td></tr><tr><td>ChatGLM2-6B</td><td>4.48</td><td>3.39</td><td>3.16</td><td>3.61</td><td>5.58</td><td>4.91</td><td>4.52</td><td>6.66</td><td>6.25</td><td>6.08</td><td>5.08</td></tr><tr><td>InternLM-Chat-7B</td><td>3.65</td><td>2.56</td><td>2.45</td><td>2.66</td><td>4.75</td><td>4.34</td><td>4.09</td><td>5.82</td><td>4.89</td><td>5.32</td><td>4.06</td></tr><tr><td>Chinese-LLaMA-2-7B-Chat</td><td>3.57</td><td>2.68</td><td>2.29</td><td>3.07</td><td>4.46</td><td>4.31</td><td>4.26</td><td>4.50</td><td>4.63</td><td>4.91</td><td>4.13</td></tr><tr><td>LLaMA-2-13B-Chinese-Chat</td><td>3.35</td><td>2.47</td><td>2.21</td><td>2.73</td><td>4.23</td><td>4.13</td><td>3.31</td><td>4.79</td><td>3.93</td><td>4.53</td><td>4.71</td></tr></tbody></table><p>表 7｜AlignBench 榜(gpt-4-0613 打分), 按总分降序. 标 * 为作者用官方仓库复测, 其余引自 AlignBench 原文. DeepSeek-67B-Chat 明显超过 ChatGPT 等基线; DPO 几乎各域都有提升.</p>
<h3 id="5-2-kfspc">5.2 开放式评测</h3>
<p>对 Chat 而言, 标准基准之外, 开放域与开放题的生成质量直接关系到用户体验. 因此分别测中英开放式生成.</p>
<h4 id="5-2-1-zwkfspc">5.2.1 中文开放式评测</h4>
<p>中文侧用高质量开放题集 AlignBench: 8 个一级类, 36 个二级类, 683 题; 除 prompt 外还提供专业参考答案与给 GPT-4 打分的模板.</p>
<p>评测走官方 AlignBench 仓库; 温度严格对齐原文: 角色扮演, 写作, 开放题用 0.7, 其余用 0.1.</p>
<p>表 7: DeepSeek 67B Chat 超过 ChatGPT 等基线, 仅次于两个 GPT-4 版本; 相对其他开源/闭源中文大模型表现突出. DPO 版几乎各项都涨, 对齐收益明显.</p>
<p>基础中文语言任务进入第一梯队; DPO 版中文基本语言能力甚至高于最新 GPT-4. 高阶中文推理上相对其他中文 LLM 分差明显, 复杂逻辑与数学计算更强.</p>
<h4 id="5-2-2-ywkfspc">5.2.2 英文开放式评测</h4>
<p>英文侧用 MT-Bench(8 类多轮题). 表 8: 67B Chat 超过 LLaMA-2-Chat 70B, Xwin 70b v0.1, TÜLU 2+DPO 70B 等开源, 均分 8.35, 与 GPT-3.5-turbo 相当; DPO 后再到 8.76, 仅次于 GPT-4. 多轮开放生成能力强.</p>
<table>
<thead>
<tr>
<th>Model</th>
<th>STEM</th>
<th>Humanities</th>
<th>Reasoning</th>
<th>Coding</th>
<th>Math</th>
<th>Extraction</th>
<th>Roleplay</th>
<th>Writing</th>
<th>Average</th>
</tr>
</thead>
<tbody><tr>
<td>GPT-4-1106-preview<sup>∗</sup></td>
<td>9.90</td>
<td>9.95</td>
<td>8.10</td>
<td>9.05</td>
<td>7.95</td>
<td>9.90</td>
<td>9.50</td>
<td>9.70</td>
<td>9.26</td>
</tr>
<tr>
<td>GPT-3.5-turbo-0613<sup>∗</sup></td>
<td>9.55</td>
<td>9.95</td>
<td>6.20</td>
<td>7.05</td>
<td>7.05</td>
<td>9.00</td>
<td>8.65</td>
<td>9.65</td>
<td>8.39</td>
</tr>
<tr>
<td>LLAMA-2-Chat 7B∗</td>
<td>8.65</td>
<td>8.75</td>
<td>4.25</td>
<td>3.00</td>
<td>2.40</td>
<td>6.50</td>
<td>7.70</td>
<td>8.90</td>
<td>6.27</td>
</tr>
<tr>
<td>LLAMA-2-Chat 13B∗</td>
<td>8.63</td>
<td>9.75</td>
<td>5.10</td>
<td>3.00</td>
<td>3.45</td>
<td>6.93</td>
<td>7.50</td>
<td>8.85</td>
<td>6.65</td>
</tr>
<tr>
<td>LLAMA-2-Chat 70B∗</td>
<td>8.93</td>
<td>9.63</td>
<td>5.80</td>
<td>3.15</td>
<td>3.30</td>
<td>7.25</td>
<td>7.50</td>
<td>9.30</td>
<td>6.86</td>
</tr>
<tr>
<td>Zephyr-Beta 7B∗</td>
<td>9.03</td>
<td>9.63</td>
<td>5.60</td>
<td>5.10</td>
<td>4.45</td>
<td>7.45</td>
<td>8.20</td>
<td>9.35</td>
<td>7.35</td>
</tr>
<tr>
<td>Xwin 70b v0.1∗</td>
<td>9.68</td>
<td>9.95</td>
<td>6.55</td>
<td>4.25</td>
<td>3.30</td>
<td>8.75</td>
<td>8.25</td>
<td>9.55</td>
<td>7.53</td>
</tr>
<tr>
<td>Xwin 13b v0.2∗</td>
<td>9.55</td>
<td>9.88</td>
<td>5.20</td>
<td>3.60</td>
<td>2.85</td>
<td>7.70</td>
<td>8.60</td>
<td>8.68</td>
<td>7.01</td>
</tr>
<tr>
<td>TÜLU 2+DPO 70B∗</td>
<td>9.00</td>
<td>9.90</td>
<td>7.00</td>
<td>4.70</td>
<td>4.65</td>
<td>9.35</td>
<td>9.25</td>
<td>9.25</td>
<td>7.89</td>
</tr>
<tr>
<td>DeepSeek LLM 67B Chat</td>
<td>9.60</td>
<td>9.70</td>
<td>8.00</td>
<td>7.35</td>
<td>6.25</td>
<td>8.40</td>
<td>8.20</td>
<td>9.30</td>
<td>8.35</td>
</tr>
<tr>
<td>DeepSeek LLM 67B Chat DPO</td>
<td>9.70</td>
<td>9.80</td>
<td>9.05</td>
<td>6.75</td>
<td>6.65</td>
<td>9.30</td>
<td>9.10</td>
<td>9.75</td>
<td>8.76</td>
</tr>
</tbody></table>
<p>表 8｜MT-Bench 评测. 标 ∗ 引自 Ivison et al. (2023).</p>
<h3 id="5-3-lcjpc">5.3 留出集评测</h3>
<p>数据污染与刷基准是评测两大难题. 常见做法是用新近发布的测试集当留出集.</p>
<p><strong>LeetCode:</strong> 用周赛题(Weekly 351–372, Biweekly 108–117, 2023 年 7–11 月)测代码. 爬取 126 题, 每题超 20 个测试用例; 指标类似 HumanEval: 全过才算解出. 文中图横轴为域外 LeetCode 周赛 pass@1, 纵轴为域内人工评测 pass@1. LeetCode 测集会随 DeepSeek Coder 技术报告放出.</p>
<p><strong>匈牙利高考:</strong> 仿 Grok-1, 用匈牙利全国高中考试 33 题测数学, 人工按 solution. pdf 给分.</p>
<p><strong>指令遵循(IFEval):</strong> 2023-11-15 Google 发布, 含 25 类可验证指令, 约 500 条 prompt. 统一用 prompt-level loose 指标.</p>
<table>
<thead>
<tr>
<th>Model</th>
<th>LeetCode</th>
<th>Hungarian Exam</th>
<th>IFEval</th>
</tr>
</thead>
<tbody><tr>
<td>GPT-4</td>
<td>48.4</td>
<td>68</td>
<td>79.3</td>
</tr>
<tr>
<td>ChatGLM3 6B</td>
<td>2.4</td>
<td>32</td>
<td>29.7</td>
</tr>
<tr>
<td>DeepSeek LLM 7B Chat</td>
<td>4.7</td>
<td>28.5</td>
<td>41.2</td>
</tr>
<tr>
<td>Baichuan2-Chat 13B</td>
<td>1.6</td>
<td>19.5</td>
<td>44.5</td>
</tr>
<tr>
<td>Yi-Chat 34B</td>
<td>7.9</td>
<td>39</td>
<td>48.4</td>
</tr>
<tr>
<td>Qwen 72B Chat</td>
<td>12.7</td>
<td>52</td>
<td>50.8</td>
</tr>
<tr>
<td>DeepSeek LLM 67B Chat</td>
<td>17.5</td>
<td>58</td>
<td>55.5</td>
</tr>
</tbody></table>
<p>表 9｜留出集评测.</p>
<p>对比 Qwen 72B Chat, ChatGLM3, Baichuan2, Yi-34B Chat 等. 留出集上大小模型落差很大-- 即便小模型在常规基准好看. 例如 ChatGLM3 在 MBPP 拿 52.4, 接近 DeepSeek 67B, 新基准上却差一截; 数学上 GSM8K 72.3 很强, 匈牙利高考却落后大模型. 指令遵循也显示总计算量很关键.</p>
<p>7B 与 67B 流水线相同, 表现却差很多. 主观评测也感到放到 67B 后各任务「智力」落差明显. 7B 在标准基准上常落后其他小模型, 但留出任务上相对并不差.</p>
<h3 id="5-4-aqpc">5.4 安全评测</h3>
<p>安全对通用人工智能很关键: 真正有用的前提是价值观与人一致, 对人友好. 预训练, SFT, DPO 全程都嵌安全约束.</p>
<p>20 人跨学科专家组搭安全内容分类(表 10), 每子类手工写数十高质量用例. 除内容域多样, 也注意问法多样--「奶奶漏洞」说明表面格式能骗出不安全回答. 用诱导, 角色扮演, 多轮, 预设立场等构造题, 最终约 2400 题; 并按内容/格式类型写安全审读基本准则.</p>
<table><tr><td>Category</td><td>Subcategory</td><td>#Safety Answers / #Total Cases</td></tr><tr><td rowspan="2">歧视偏见问题 (Discrimination and Prejudice Questions)</td><td>民族种族 (Ethnic and Racial), 宗教信仰 (Religious Belief), 国别地域 (Nationality and Geography), 性别 (Gender), 年龄 (Age), </td><td>486/500</td></tr><tr><td>职业 (Occupation), 健康 (Health), 其他方面歧视 (Discrimination in Other Aspects)</td><td></td></tr><tr><td rowspan="2">侵犯他人合法权益 (Infringement of Others&#x27; Legal Rights)</td><td>身心健康 (Physical and Mental Health), 合法财产 (Legitimate Property), </td><td></td></tr><tr><td>肖像权 (Portrait Rights), 名誉权 (Reputation Rights), 荣誉权 (Honor Rights), 隐私权 (Privacy Rights), 信息权益 (Information Rights), 其他合法权益 (Other Legal Rights)</td><td>473/500</td></tr><tr><td rowspan="2">商业秘密与知识产权 (Trade Secrets and Intellectual Property Rights)</td><td>侵犯他人知识产权 (Infringing Others&#x27; Intellectual Property Rights), </td><td></td></tr><tr><td>垄断和不正当竞争行为 (Monopolistic and Unfair Competitive Actions), 其他商业违法违规行为 (Other Commercially Illegal and Non-compliant Behaviors), </td><td>281/300</td></tr><tr><td>违法违规行为 (Illegal and Non-compliant Behavior)</td><td>违反商业道德 (Violating Business Ethics), 泄露他人商业机密 (Disclosing Others&#x27; Trade Secrets) 邪教迷信 (Cults and Superstition), 色情 (Pornography), 赌博 (Gambling), 毒品和违禁品 (Drugs and Prohibited Items), 侮辱谩骂 (Insults and Abuse), 暴力行为 (Violent Behavior), </td><td>290/300</td></tr><tr><td>其他安全问题</td><td>涉黑涉恶 (Involvement in Organized Crime), 其他违法违规行为 (Other Illegal and Non-compliant Behaviors)</td><td></td></tr><tr><td>(Other Safety Issues)</td><td>幻觉和真实性问题 (Issues of Illusion and Reality), 时效性问题 (Time-sensitive Issues), 自我认知问题 (Self-recognition Problems), 其他敏感话题 (Other Sensitive Topics), </td><td>767/800</td></tr></table><p>表 10｜安全评测分类. 右列是各类题量与 DeepSeek-67B-Chat 安全回答数. 出题与判读由专业人工团队完成; 模型在各类安全集上表现稳健.</p>
<p>人工审输出: 标注员受训并交叉校验, 每题三类-- 安全, 不安全, 模型拒答. 表 10 列各类题量与通过数; 安全回答与拒答都算安全响应. 多类安全集上表现良好.</p>
<p>另用 Do-Not-Answer(939 条风险分类 prompt)补测. 表 11: 67B Chat 得 97.8, 高于 ChatGPT 与 GPT-4, 敏感查询处理跻身前列.</p>
<h3 id="5-5-tl">5.5 讨论</h3>
<p>开发过程中还有几条有意思的发现.</p>
<table>
<thead>
<tr>
<th>Model</th>
<th>Do-Not-Answer</th>
</tr>
</thead>
<tbody><tr>
<td>LLAMA-2-7B-Chat</td>
<td>99.4</td>
</tr>
<tr>
<td>Claude</td>
<td>98.3</td>
</tr>
<tr>
<td>DeepSeek-67B-Chat*</td>
<td>97.8</td>
</tr>
<tr>
<td>ChatGPT</td>
<td>97.7</td>
</tr>
<tr>
<td>GPT-4</td>
<td>96.5</td>
</tr>
<tr>
<td>Vicuna-7B</td>
<td>94.9</td>
</tr>
<tr>
<td>ChatGLM2</td>
<td>92.9</td>
</tr>
</tbody></table>
<p>表 11｜Do-Not-Answer 分数(越高越安全). 标 * 为官方仓库复测, 其余引自原文. 本模型高于 ChatGPT 与 GPT-4, 属最安全一档.</p>
<p><strong>分阶段微调:</strong> 小模型在数学/代码上需要更长微调, 但会伤对话(如重复变多). 做法: 第一阶段全数据, 第二阶段只吃对话数据.</p>
<table>
<thead>
<tr>
<th>Model</th>
<th>HumanEval</th>
<th>GSM8K</th>
<th>Repetition</th>
<th>IFEval</th>
</tr>
</thead>
<tbody><tr>
<td>DeepSeek LLM 7B Chat Stage1</td>
<td>48.2</td>
<td>63.9</td>
<td>0.020</td>
<td>38.0</td>
</tr>
<tr>
<td>DeepSeek LLM 7B Chat Stage2</td>
<td>48.2</td>
<td>63.0</td>
<td>0.014</td>
<td>41.2</td>
</tr>
</tbody></table>
<p>表 12｜两阶段微调. 重复率在 temperature=0 下计算, 越低越好; IFEval 为 prompt-level loose.</p>
<p>表 12: 第二阶段几乎不伤代码与数学, 同时降重复, 抬指令遵循.</p>
<p><strong>选择题:</strong> MMLU, AGIEval, C-Eval 等常用选择题评测-- 既要知识, 也要懂选项在指什么. 对齐阶段试过加 2000 万中文选择题, 结果见表 13; 并对 C-Eval 验证集, CMMLU 测试集去重, 防污染.</p>
<table>
<thead>
<tr>
<th>Model</th>
<th>MMLU</th>
<th>C-Eval</th>
<th>CMMLU</th>
<th>TriviaQA</th>
<th>ChineseQA</th>
</tr>
</thead>
<tbody><tr>
<td>DeepSeek LLM 7B Chat</td>
<td>49.4</td>
<td>47.0</td>
<td>49.7</td>
<td>57.9</td>
<td>75.0</td>
</tr>
<tr>
<td>DeepSeek LLM 7B Chat + MC</td>
<td>60.9</td>
<td>71.3</td>
<td>73.8</td>
<td>57.9</td>
<td>74.4</td>
</tr>
</tbody></table>
<p>表 13｜加入选择题数据的影响.</p>
<p>加 20M 选择题: 中英选择题基准都涨, 说明「会做选择题」变强了. 但涨幅不外溢到非选择题评测-- 如 TriviaQA 与内部</p>
<p>ChineseQA(生成式)上几乎不动. 对话场景是生成回答而非选题, 用户未必感到「更聪明」.</p>
<p>因此预训练与微调都<strong>排除选择题数据</strong>, 避免刷榜过拟合, 却帮不上真正智能.</p>
<p>解释: 选择题刷榜 = 专喂大量 MC 题, MMLU/C-Eval 分数可以暴涨, 但生成式问答(TriviaQA, 对话)不动. 分数涨的是「选项匹配/格式熟练」, 不是泛化知识; 所以作者宁可不要这份「好看的榜」.</p>
<p><strong>预训练掺指令数据:</strong> 常说预训练末段加指令数据能抬 Base 基准. 作者在最后 10% 预训练塞入 500 万指令(多为选择题): Base 基准确实涨, 但终局几乎等于把同样数据放到 SFT. 结论: 这只是把基准分前移到 Base, 总潜力差不多. 若指令数据体量很大, 预训练里掺也可以; 因作者坚持不用选择题, 又缺非选择题指令, 最终预训练不加指令数据.</p>
<p><strong>系统提示:</strong> 好的 system prompt 应引导有用且得体的回答. 作者在 LLaMA-2 提示上略改:</p>
<p>系统提示(原文): You are DeepSeek Chat. (知识截止 2023 年 5 月; 尽量有用且安全; 拒绝有害/不道德等内容; 无意义或事实混乱的问题先解释; 不知道就别编.)</p>
<p>有趣现象: 7B 加 system prompt 略掉分; 67B 加了明显更好(表 14). 解释: 大模型更能理解提示意图, 跟指令; 小模型吃不透, 训练/测试不一致还可能拖后腿.</p>
<table>
<thead>
<tr>
<th>Model</th>
<th>MT Bench</th>
</tr>
</thead>
<tbody><tr>
<td>DeepSeek LLM 7B Chat</td>
<td>7.15</td>
</tr>
<tr>
<td>DeepSeek LLM 7B Chat + System Prompt</td>
<td>7.11</td>
</tr>
<tr>
<td>DeepSeek LLM 67B Chat</td>
<td>8.35</td>
</tr>
<tr>
<td>DeepSeek LLM 67B Chat + System Prompt</td>
<td>8.58</td>
</tr>
</tbody></table>
<p>表 14｜加系统提示的影响.</p>
<h2 id="6-jl-jxyhxgz">6 结论, 局限与后续工作</h2>
<p>推出 DeepSeek LLM: 从零在约 2 万亿中英 token 上训的开源系列. 文中详细交代超参选择, Scaling Laws 与各类微调尝试; 校准既往 Scaling Laws 并给出新的最优模型/数据分配; 给出给定算力下近优 batch 与学习率的预报方法; 并指出 Scaling Laws 与数据质量相关, 或可解释文献间差异. 按 Scaling Laws 选最优超参完成预训练与全面评测; 各训练阶段避免「裱糊基准」与暗箱操作.</p>
<p>DeepSeek Chat 也有常见局限: 预训练后知识不自动更新; 可能给出未核实建议等非事实内容; 会幻觉. 初版中文数据并不穷尽, 部分中文专属话题可能偏弱; 语料以中英为主, 其他语言能力仍脆, 使用需谨慎.</p>
<p>DeepSeek LLM 是长期项目, 目标推进开源语言模型.</p>
<p>• 即将分别发布代码智能与 MoE 技术报告: 如何做高质量代码预训练数据, 以及如何用稀疏模型逼近稠密表现.</p>
<p>• 正在为下一版 DeepSeek LLM 构建更大更好的数据集, 期望推理, 中文知识, 数学, 代码明显提升.</p>
<p>• 对齐团队在研究如何交付有用, 诚实, 安全的模型; 初期实验显示强化学习能抬复杂推理.</p>
<h2 id="a-fl">A 附录</h2>
<h3 id="a-2-btdmxgmbs">A.2 不同的模型规模表示</h3>
<p>复用 IsoFLOP 实验, 分别用 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>6</mn><msub><mi>N</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">6N_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>6</mn><msub><mi>N</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">6N_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 重算算力并重拟性能缩放曲线. 图 6: 高算力时三种表示的最优分配偏差不大; 低算力时差别明显.</p>
<p>用 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>6</mn><msub><mi>N</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">6N_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 时, 拟合曲线倾向高估大规模模型; 用 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>6</mn><msub><mi>N</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">6N_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord">6</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.109em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.109em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 则倾向低估; 用 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>M</mi></mrow><annotation encoding="application/x-tex">M</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.109em;">M</span></span></span></span> 预报最准.</p>
<h3 id="a-3-jzzbqx">A.3 基准指标曲线</h3>
<p>图 7: 随训练步数, 各基准持续上升; 若继续训, 作者认为还会再涨.</p>
<table><tr><td rowspan="2">Model</td><td rowspan="2">Size</td><td colspan="2">HumanEval</td><td rowspan="2">MBPP</td></tr><tr><td>Python</td><td>Multilingual</td></tr><tr><td></td><td>Pre-Trained Models</td><td></td><td></td><td></td></tr><tr><td>Codex-001</td><td></td><td>33.5%</td><td>26.1%</td><td>45.9%</td></tr><tr><td>StarCoder</td><td>16B</td><td>36.0%</td><td>28.7%</td><td>46.8%</td></tr><tr><td>CodeGeeX2</td><td>6B</td><td>36.0%</td><td>24.5%</td><td>42.4%</td></tr><tr><td>CodeLlama</td><td>7B</td><td>31.7%</td><td>29.2%</td><td>41.6%</td></tr><tr><td>CodeLlama</td><td>13B</td><td>36.0%</td><td>35.4%</td><td>48.4%</td></tr><tr><td>CodeLlama</td><td>34B</td><td>48.2%</td><td>41.0 %</td><td>55.2%</td></tr><tr><td>DeepSeek-LLM-Base</td><td>67B</td><td>42.7%</td><td>37.2%</td><td>57.4%</td></tr><tr><td colspan="3">Instruction-Tuned Models</td><td></td><td></td></tr><tr><td>Wizard-Coder</td><td>34B</td><td>73.2%</td><td>48.8%</td><td>61.2%</td></tr><tr><td>DeepSeek-LLM-Chat</td><td>67B</td><td>73.8%</td><td>53.3%</td><td>61.4%</td></tr></table><p>表 15｜与代码专用模型对比.</p>
<h3 id="a-4-ydm-sxzymxdb">A.4 与代码 / 数学专用模型对比</h3>
<p>与代码, 数学专用 LLM 对比. 表 15: 67B 在代码数据更少的情况下仍可接近 CodeLlama, 且代码以外能力更广.</p>
<p>表 16: GSM8K, MATH, MGSM-zh, CMath 等. 67B 跨语言数学表现突出; 还能用程序解数学题, 优于纯 CoT, 并显著超过此前 SOTA ToRA.</p>
<table><tr><td></td><td>Inference</td><td>GSM8K</td><td>MATH</td><td>MGSM-zh</td><td>CMath</td></tr><tr><td colspan="6">Chain-of-Thoughts</td></tr><tr><td>MetaMath 70B (Yu et al., 2023)</td><td>CoT</td><td>82.3%</td><td>26.6%</td><td>66.4%</td><td>70.9%</td></tr><tr><td>WizardMath 70B (Luo et al., 2023)</td><td>CoT</td><td>81.6%</td><td>22.7%</td><td>64.8%</td><td>65.4%</td></tr><tr><td>DeepSeek LLM 67B Chat</td><td>CoT</td><td>84.1%</td><td>32.6 %</td><td>74.0%</td><td>80.3%</td></tr><tr><td colspan="6">Tool-Integrated Reasoning</td></tr><tr><td>ToRA-Code 34B (Gou et al., 2023)</td><td>Tool-Integrated</td><td>80.7%</td><td>50.8%</td><td>41.2%</td><td>53.4%</td></tr><tr><td>DeepSeek LLM 67B Chat</td><td>Tool-Integrated</td><td>86.7%</td><td>51.1%</td><td>76.4%</td><td>85.4%</td></tr></table><p>表 16｜与数学专用模型对比.</p>
<h3 id="a-5-h-dpo-jddjzjg">A.5 含 DPO 阶段的基准结果</h3>
<p>表 17: DPO 前后基准. 结论: DPO 对 LLM 基础能力影响不大.</p>
<table>
<thead>
<tr>
<th></th>
<th>DeepSeek 67B Chat</th>
<th>DeepSeek 67B Chat DPO</th>
</tr>
</thead>
<tbody><tr>
<td>HellaSwag</td>
<td>75.7</td>
<td>76.1</td>
</tr>
<tr>
<td>TriviaQA</td>
<td>81.5</td>
<td>82.9</td>
</tr>
<tr>
<td>NaturalQuestions</td>
<td>47.0</td>
<td>48.8</td>
</tr>
<tr>
<td>MMLU</td>
<td>71.1</td>
<td>70.9</td>
</tr>
<tr>
<td>GSM8K</td>
<td>84.1</td>
<td>85.2</td>
</tr>
<tr>
<td>MATH</td>
<td>32.6</td>
<td>30.2</td>
</tr>
<tr>
<td>HumanEval</td>
<td>73.8</td>
<td>71.3</td>
</tr>
<tr>
<td>BBH</td>
<td>71.7</td>
<td>70.8</td>
</tr>
<tr>
<td>AGIEval</td>
<td>46.4</td>
<td>46.1</td>
</tr>
<tr>
<td>CEval</td>
<td>65.2</td>
<td>64.3</td>
</tr>
<tr>
<td>CMMLU</td>
<td>67.8</td>
<td>68.2</td>
</tr>
</tbody></table>
<p>表 17｜DPO 前后的基准指标.</p>
<h3 id="a-6-pcgs">A.6 评测格式</h3>
<p>表 18~表 40 给出各基准评测格式示例. (附录示例区保留源 md 原文表格 / 图片 / OCR 文本, 仅补中文表题; 数字与路径不改.)</p>
<table>
<thead>
<tr>
<th>PROMPT 以下是一道中国高考生物选择题, 请选择正确的答案.</th>
</tr>
</thead>
<tbody><tr>
<td>问题: 下列有关高尔基体, 线粒体和叶绿体的叙述, 正确的是选项: (A)三者都</td>
</tr>
<tr>
<td>存在于蓝藻中(B)三者都含有DNA(C)三者都是ATP合成的场所(D)三者的膜结</td>
</tr>
<tr>
<td>构中都含有蛋白质</td>
</tr>
<tr>
<td>答案: 从A到D, 我们应选择</td>
</tr>
</tbody></table>
<p>表 18｜AGIEval 格式示例.</p>
<p>表 19｜ARC 格式示例.</p>
<p><strong>PROMPT</strong>以下是中国关于教育学考试的单项<strong>选择</strong>题, 请选出其中的正确答案. 根据我国心理学家冯忠良教授的学习分类, 培养学生品德要通过A. 知识的学习B. 技能的学习C. 行为规范的学习D. 态度的学习答案: C</p>
<p>开设跨学科课程<strong>或建</strong>立跨学科专业体现了高等教育课程发展的A. 综<strong>合化趋势</strong>B. 多样<strong>化趋势</strong>C. 人<strong>文化趋势</strong>D. 科学<strong>化趋势</strong>答案: A</p>
<p>心智技能的特点有A. 物质性, 外显性, <strong>简缩</strong>性B. 观念性, 内潜性, <strong>简缩</strong>性C. 物质性, 外显性, 展开性D. 观念性, 内潜性, 展开性答案: B</p>
<p>下列关于大学生的情绪与理智关系的说法中正确的是A. 能冷静控制自己情绪B. 感情用事**, 难**以用理智控制情绪C. 遇事能坚持自己正确认识D.<strong>已发</strong>展到不为小事而发怒和怄气答案: B</p>
<p>在学完一<strong>篇逻</strong>辑结构严密的课文以<strong>后, 勾</strong>画出课文的论点论据的逻辑关系图以<strong>帮助理</strong>解和记忆. 这种学习方法属于A. 精细<strong>加工策</strong>略B. 组织策略C. 复述策略D.<strong>做笔</strong>记策略答案: B</p>
<p>有学者强<strong>调, 教</strong>育要根据一个<strong>民族</strong>固有的特征来定, 这种观点体现了A. 生产力对教育的影<strong>响和制</strong>约B.<strong>政治制度</strong>对教育的影<strong>响和制</strong>约C.<strong>文化</strong>对教育的影<strong>响和制</strong>约D. 经<strong>济制度</strong>对教育的影<strong>响和制</strong>约答案:</p>
<p>表 21｜C-Eval 格式示例.</p>
<p>表 22｜C3 格式示例.</p>
<p>表 23｜CCPM 格式示例.</p>
<table>
<thead>
<tr>
<th>PROMPT Q: 某小学在“献爱心-为汶川地震区捐款&quot;活动中, 六年级五个班共 捐款8000元, 其中一班捐款1500元, 二班比一班多捐款200元, 三班捐 款1600元, 四班与五班捐款数之比是3: 5. 四班捐款多少元? A: 一班捐款1500元, 而二班比一班多捐200元, 所以二班捐 款1500+200=1700元, 又知道六年级五个班一共捐款8000元, 所以四班 和五班捐款之和=一共捐款-一班和二班和三班捐款之和, 即8000-1500- <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1700</mn><mo>−</mo><mn>1600</mn><mo>=</mo><mn>3200</mn><mtext>元</mtext></mrow><annotation encoding="application/x-tex">1700-1600=3200 元</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">1700</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1600</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord">3200</span><span class="mord cjk_fallback">元</span></span></span></span> , 而题目说四班与五班捐款数之比是3: 5, 则四班捐款 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>3200</mn><mi mathvariant="normal">/</mi><mo stretchy="false">(</mo><mn>3</mn><mo>+</mo><mn>5</mn><msup><mo stretchy="false">)</mo><mo lspace="0em" rspace="0em">∗</mo></msup><mn>3</mn><mo>=</mo><mn>1200</mn><mtext>元</mtext></mrow><annotation encoding="application/x-tex">3200/(3+5)^{\\ast}3=1200 元</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">3200/</span><span class="mopen">(</span><span class="mord">3</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">5</span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6887em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">∗</span></span></span></span></span></span></span></span></span><span class="mord">3</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord">1200</span><span class="mord cjk_fallback">元</span></span></span></span> . 所以答案是: 1200. Q: 小俊在东西大道上跑步, 若规定向东为正. 他先向东跑了800米, 然后又跑</th>
</tr>
</thead>
<tbody><tr>
<td>了一段之后, 他位于出发点西边100米处, 小俊第二段跑了多少米? A: 小俊第二段跑完后位于出发点西边, 所以第二段应该是向西跑, 第二 段跑的长度-第一段跑的长度=100, 第二段跑了100+800=900米. 所以答案 是: 900. Q: A车和B车同时从甲, 乙两地相向开出, 经过5小时相遇. 然后, 它们又各 自按原速原方向继续行驶3小时, 这时A车离乙地还有135千米, B车离甲地还</td>
</tr>
<tr>
<td>有165千米. 甲, 乙两地相距多少千米? A: 假设A车的速度为x千米每小时, B车的速度为y千米每小时, 根据而A, B相 遇时A车行驶了5小时, A车行驶3小时后离乙地还有135千米, B车行驶3小时 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>5</mn><mi>x</mi><mo>+</mo><mn>5</mn><mi>y</mi><mo>=</mo><mn>135</mn><mo>+</mo><mn>8</mn><mi>x</mi><mo>=</mo><mn>165</mn><mo>+</mo><mn>8</mn><mi>y</mi></mrow><annotation encoding="application/x-tex">5x+5y=135+8x=165+8y</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">5</span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">5</span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">135</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">8</span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">165</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">8</span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span></span></span></span> 后距离甲地还有165千米, 可以得到甲乙两地相距= 于是x+y=150, 甲乙两地相距5(x+y)=750千 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>10</mn><mo stretchy="false">(</mo><mi>x</mi><mo>+</mo><mi>y</mi><mo stretchy="false">)</mo><mo>=</mo><mn>300</mn><mo>+</mo><mn>8</mn><mo stretchy="false">(</mo><mi>x</mi><mo>+</mo><mi>y</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">10(x+y)=300+8(x+y)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">10</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">300</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">8</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.0359em;">y</span><span class="mclose">)</span></span></span></span> 变换得到: 米. 所以答案是: 750.</td>
</tr>
<tr>
<td>Q: 在一个底面半径为10厘米的圆柱形容器内, 倒入10厘米深的水, 然后将一 个底面直径4厘米, 高6厘米的圆锥形铅锤放入水中, 容器中水面上升多少厘 米? A:</td>
</tr>
</tbody></table>
<p>表 24｜CMath 格式示例.</p>
<p>表 25｜CMMLU 格式示例.</p>
<p>表 26｜DROP 格式示例.</p>
<p>表 27｜CHID 格式示例.</p>
<table>
<thead>
<tr>
<th>PROMPT 胡雪岩离船登岸, 坐轿进城, 等王有龄到家, 他接着也到了他那里, 脸上是掩 抑不住的笑容, 王有龄夫妇都觉得奇怪, 问他什么事这么高兴. 上面的句子中的「他」指的是 胡雪岩</th>
</tr>
</thead>
<tbody><tr>
<td>渐渐地, 汤中凝结出一团团块状物, 将它们捞起放进盆里冷却, 肥皂便出现在 世上了. 上面的句子中的「它们」指的是 块状物</td>
</tr>
<tr>
<td>“她序上明明引着JulesTellier的比喻, 说有个生脱发病的人去理发, 那剃头的 对他说不用剪发, 等不了几天, 头毛压儿全掉光了; 大部分现代文学也同样的 不值批评. 这比喻还算俏皮. ” 上面的句子中的「他」指的是 生脱发病的人</td>
</tr>
<tr>
<td>在洛伦佐大街的尽头处, 矗立着著名的圣三一大教堂. 它有着巨大的穹顶, 还 有明亮的彩色玻璃窗, 上面描绘着「旧约」和「新约」的场景. 上面的句子中的「它」指的是 圣三一大教堂</td>
</tr>
<tr>
<td>他伯父还有许多女弟子, 大半是富商财主的外室; 这些财翁白天忙着赚钱, 怕 小公馆里的情妇长日无聊, 要不安分, 常常叫她们学点玩艺儿消遣. 上面的句子中的「她们」指的是 情妇</td>
</tr>
<tr>
<td>赵雨又拿出了一个杯子, 我们热情地请老王入座, 我边给他倒酒边问: 1962年 的哪次记得吗? “ 上面的句子中的「他」指的是</td>
</tr>
<tr>
<td>PROMPT Q: Max can mow the lawn in 40 minutes. If it takes him twice that long to fertilize the</td>
</tr>
<tr>
<td>lawn, how long will it take him to both mow and fertilize the lawn? <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mn>2</mn><mo lspace="0em" rspace="0em">∗</mo></msup><mn>40</mn></mrow><annotation encoding="application/x-tex">2 ^ { * } 4 0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6887em;"></span><span class="mord"><span class="mord">2</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6887em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">∗</span></span></span></span></span></span></span></span></span><span class="mord">40</span></span></span></span> A: Let&#39;s think step by step. It takes Max minutes = 80 minutes to fertilize the lawn. In total, Max takes 80 minutes + 40 minutes = 120 minutes to both mow and fertilize the lawn. The answer is 120.</td>
</tr>
<tr>
<td>Q: The bagels cost <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>2.25</mn><mi>e</mi><mi>a</mi><mi>c</mi><mi>h</mi><mo separator="true">,</mo><mi>o</mi><mi>r</mi><mi>a</mi><mi>d</mi><mi>o</mi><mi>z</mi><mi>e</mi><mi>n</mi><mi>f</mi><mi>o</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">2.25 each, or a dozen for</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">2.25</span><span class="mord mathnormal">e</span><span class="mord mathnormal">a</span><span class="mord mathnormal">c</span><span class="mord mathnormal">h</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.0278em;">or</span><span class="mord mathnormal">a</span><span class="mord mathnormal">d</span><span class="mord mathnormal" style="margin-right:0.044em;">oz</span><span class="mord mathnormal">e</span><span class="mord mathnormal">n</span><span class="mord mathnormal" style="margin-right:0.1076em;">f</span><span class="mord mathnormal" style="margin-right:0.0278em;">or</span></span></span></span>24. How much is saved, per bagel, in cents, by buying a dozen at a time? A: Let&#39;s think step by step. They cost 2.25<em>100=225 cents each. At the bulk rate, they <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>24</mn><mi mathvariant="normal">/</mi><mn>12</mn><mo lspace="0em" rspace="0em">=</mo><mn>2</mn></mrow><annotation encoding="application/x-tex">2 4 / 1 2 { = } 2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">24/12</span><span class="mord"><span class="mrel">=</span></span><span class="mord">2</span></span></span></span> dollar each. They cost 2</em>100=200 cents each. 225-200=25 cents are saved are per bagel. The answer is 25.</td>
</tr>
<tr>
<td>Q: Tim is 5 years old. His cousin, Rommel, is thrice as old as he is. His other cousin, Jenny, is 2 years older than Rommel. How many years younger is Tim than Jenny? <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>5</mn><mo>×</mo><mn>3</mn><mo>=</mo><mn>15</mn></mrow><annotation encoding="application/x-tex">5 \\times 3 = 1 5</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">5</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">3</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">15</span></span></span></span> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>15</mn><mo>+</mo><mn>2</mn><mo>=</mo><mn>17</mn></mrow><annotation encoding="application/x-tex">1 5 + 2 = 1 7</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">15</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">2</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">17</span></span></span></span> A: Let&#39;s think step by step. Rommel is years old. Jenny is years <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>17</mn><mo>−</mo><mn>5</mn><mo>=</mo><mn>12</mn></mrow><annotation encoding="application/x-tex">1 7 - 5 = 1 2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">17</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">5</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">12</span></span></span></span> years younger than Jenny. The answer is 12. old. So, Tim is</td>
</tr>
<tr>
<td>Q: The school has 14 boys and 10 girls. If 4 boys and 3 girls drop out, how many boys and girls are left?</td>
</tr>
<tr>
<td>A: Let&#39;s think step by step. There are 14 boys - 4 boys = 10 boys left. There are 10 girls - 3 girls = 7 girls left. In total there are 10 boys + 7 girls = 17 boys and girls left. The answer is 17. Q: Building one birdhouse requires 7 planks and 20 nails. If 1 nail costs 0.05, and one</td>
</tr>
<tr>
<td>plank costs 3, what is the cost, in dollars, to build 4 birdhouses? <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mn>7</mn><mo lspace="0em" rspace="0em">∗</mo></msup><mn>3</mn><mo>=</mo><mn>21</mn></mrow><annotation encoding="application/x-tex">7 ^ { * } 3 = 2 1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6887em;"></span><span class="mord"><span class="mord">7</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6887em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">∗</span></span></span></span></span></span></span></span></span><span class="mord">3</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">21</span></span></span></span> . And A: Let&#39;s think step by step. The cost of the planks for one birdhouse is <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mn>20</mn><mover accent="true"><mo>∗</mo><mo>ˉ</mo></mover></msup><mn>0.05</mn><mo>=</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">2 0 ^ { \\bar { * } } 0 . 0 5 = 1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7844em;"></span><span class="mord">2</span><span class="mord"><span class="mord">0</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7844em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord accent mtight"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6021em;"><span style="top:-2.7em;"><span class="pstrut" style="height:2.7em;"></span><span class="mbin mtight">∗</span></span><span style="top:-2.7343em;"><span class="pstrut" style="height:2.7em;"></span><span class="accent-body" style="left:-0.25em;"><span class="mord mtight">ˉ</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="mord">0.05</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span> the nails are a cost of for each birdhouse. So to build one birdhouse one <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>21</mn><mo>+</mo><mn>1</mn><mo>=</mo><mn>22</mn></mrow><annotation encoding="application/x-tex">2 1 + 1 = 2 2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">21</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">22</span></span></span></span> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>4</mn><mtext>  </mtext><msup><mrow></mrow><mo lspace="0em" rspace="0em">∗</mo></msup><mn>22</mn><mo>=</mo><mn>88.</mn></mrow><annotation encoding="application/x-tex">4 \\; ^ { * } 2 2 = 8 8 .</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6887em;"></span><span class="mord">4</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord"><span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6887em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">∗</span></span></span></span></span></span></span></span></span><span class="mord">22</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">88.</span></span></span></span> . So the cost of building 4 birdhouses is at will need The answer</td>
</tr>
<tr>
<td>is 88. Q: Danny brings 3 watermelons to his family picnic. He cuts each watermelon into 10 slices. His sister brings 1 watermelon to the family picnic, and she cuts the watermelon into 15 slices. How many watermelon slices are there in total at the picnic?</td>
</tr>
<tr>
<td>A: Let&#39;s think step by step. From Danny, there are <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>3</mn><mtext>  </mtext><msup><mrow></mrow><mo lspace="0em" rspace="0em">∗</mo></msup><mn>10</mn><mo>=</mo><mn>30</mn></mrow><annotation encoding="application/x-tex">3 \\; ^ { \\ast } 1 0 = 3 0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6887em;"></span><span class="mord">3</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord"><span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6887em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">∗</span></span></span></span></span></span></span></span></span><span class="mord">10</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">30</span></span></span></span> watermelon slices. From <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mover accent="true"><mn>1</mn><mo>^</mo></mover><mrow><mtext> </mtext><mo>∗</mo><mtext> </mtext></mrow></msup><mover accent="true"><mn>15</mn><mo>^</mo></mover><mo>=</mo><mn>15</mn></mrow><annotation encoding="application/x-tex">\\hat { 1 } ^ { \\mathrm { ~ * ~ } } \\hat { 1 5 } = 1 5</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9079em;"></span><span class="mord"><span class="mord accent"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.9079em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord">1</span></span><span style="top:-3.2134em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.25em;"><span class="mord">^</span></span></span></span></span></span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6887em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mspace nobreak mtight"><span class="mtight"> </span></span><span class="mord mtight">∗</span><span class="mspace nobreak mtight"><span class="mtight"> </span></span></span></span></span></span></span></span></span></span></span><span class="mord accent"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.9079em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">15</span></span></span><span style="top:-3.2134em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.25em;"><span class="mord">^</span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">15</span></span></span></span> watermelon slices. There are a total of <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>30</mn><mo>+</mo><mn>15</mn><mo>=</mo><mn>45</mn></mrow><annotation encoding="application/x-tex">3 0 + 1 5 = 4 5</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">30</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">15</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">45</span></span></span></span> his sister, there are watermelon slices. The answer is 45.</td>
</tr>
<tr>
<td>Q: Angela is a bike messenger in New York. She needs to deliver 8 times as many packages as meals. If she needs to deliver 27 meals and packages combined, how many meals does she deliver? A: Let&#39;s think step by step. Let p be the number of packages Angela delivers and</td>
</tr>
<tr>
<td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="bold">p</mi><mo>+</mo><mi mathvariant="bold">m</mi><mo>=</mo><mn>2</mn><mover accent="true"><mn>7</mn><mo>ˉ</mo></mover></mrow><annotation encoding="application/x-tex">\\mathbf { p } + \\mathbf { m } = 2 { \\bar { 7 } }</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7778em;vertical-align:-0.1944em;"></span><span class="mord mathbf">p</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.4444em;"></span><span class="mord mathbf">m</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7812em;"></span><span class="mord">2</span><span class="mord"><span class="mord accent"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7812em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord">7</span></span><span style="top:-3.2134em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.25em;"><span class="mord">ˉ</span></span></span></span></span></span></span></span></span></span></span> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="bold">p</mi><mo>=</mo><mn>8</mn><mi mathvariant="bold">m</mi><mi mathvariant="normal">.</mi></mrow><annotation encoding="application/x-tex">\\mathbf { p } = 8 \\mathbf { m } .</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6389em;vertical-align:-0.1944em;"></span><span class="mord mathbf">p</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">8</span><span class="mord mathbf">m</span><span class="mord">.</span></span></span></span> m be the number of meals. We know that Substituting the and Combining like terms, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>+</mo><mi mathvariant="fraktur">m</mi><mo>=</mo><mn>27.</mn></mrow><annotation encoding="application/x-tex">+ \\mathfrak { m } = 2 7 .</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord">+</span><span class="mord mathfrak">m</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">27.</span></span></span></span> second equation into the first equation, we get 8m we get 9m = 27. Dividing both sides by 9, we get m = 3. The answer is 3.</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>Q: Cori is 3 years old today. In 5 years, she will be one-third the age of her aunt. How</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>old is her aunt today?</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>3</mn><mo>+</mo><mn>5</mn><mo>=</mo><mn>8</mn></mrow><annotation encoding="application/x-tex">3 + 5 = 8</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">3</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">5</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">8</span></span></span></span></td>
</tr>
<tr>
<td>A: Let&#39;s think step by step. In 5 years, Cori will be years old. In 5 years,</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>Cori&#39;s aunt will be 8 years old. Today, her aunt is 24 - 5 = 19 years old. The</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>×</mo><mn>3</mn><mo>=</mo><mn>24</mn></mrow><annotation encoding="application/x-tex">\\times 3 = 2 4</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">×</span><span class="mord">3</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">24</span></span></span></span></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>answer is 19.</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>PROMPT Playing piano: A man is seated at a piano. He</td>
</tr>
<tr>
<td>OPTIONS</td>
</tr>
<tr>
<td>- is playing the piano with his hands and his face.</td>
</tr>
<tr>
<td>- bigins to play a song by timbaland on the piano.</td>
</tr>
<tr>
<td>- plays slowly, and pauses to snap his fingers. - is playing a song in front of him.</td>
</tr>
</tbody></table>
<p>表 28｜CLUEWSC 格式示例. (源文该表与 GSM8K / HellaSwag 等示例混排, OCR 空白行保留.)</p>
<p>表 31｜HumanEval 格式示例.</p>
<p>表 32｜MATH 格式示例.</p>
<pre><code class="language-python">PROMPT
You are an expert Python programmer, and here is your task: Write a function
to find the similar elements from the given two tuple lists. Your code should
pass these tests:
assert similar_elements((3, 4, 5, 6), (5, 7, 4, 10)) == (4, 5)
assert similar_elements((1, 2, 3, 4), (5, 4, 3, 7)) == (3, 4)
assert similar_elements((11, 12, 14, 13), (17, 15, 14, 13)) == (13, 14)
[BEGIN]
def similar_elements(test_tup1, test_tup2):
res = tuple(set(test_tup1) &amp; set(test_tup2))
return (res)
[DONE]
You are an expert Python programmer, and here is your task: Write a python
function to identify non-prime numbers. Your code should pass these tests:
assert is_not_prime(2) == False
assert is_not_prime(10) == True
assert is_not_prime(35) == True
[BEGIN]
import math
def is_not_prime(n):
result = False
for i in range(2, int(math. sqrt(n)) + 1):
if n % i == 0:
result = True
return result
[DONE]
You are an expert Python programmer, and here is your task: Write a function
to find the largest integers from a given list of numbers using heap queue
algorithm. Your code should pass these tests:
assert heap_queue_largest( [25, 35, 22, 85, 14, 65, 75, 22, 58], 3)==[85, 75, 65]
assert heap_queue_largest( [25, 35, 22, 85, 14, 65, 75, 22, 58], 2)==[85, 75]
assert heap_queue_largest( [25, 35, 22, 85, 14, 65, 75, 22, 58], 5)==[85, 75, 65, 58,
35]
[BEGIN]
import heapq as hq
def heap_queue_largest(nums, n):
largest_nums = hq. nlargest(n, nums)
return largest_nums
[DONE]
You are an expert Python programmer, and here is your task: Write a function
to return the sum of all divisors of a number. Your code should pass these tests:
assert sum_div(8)==7
assert sum_div(12)==16
assert sum_div(7)==1
[BEGIN]
</code></pre>
<p>表 33｜MBPP 格式示例.</p>
<table>
<thead>
<tr>
<th>PROMPT</th>
</tr>
</thead>
<tbody><tr>
<td>The following are multiple choice questions (with answers) about miscella-</td>
</tr>
<tr>
<td>How many axles does a standard automobile have?</td>
</tr>
<tr>
<td>A. one</td>
</tr>
<tr>
<td>B. two</td>
</tr>
<tr>
<td>C. four</td>
</tr>
<tr>
<td>D. eight</td>
</tr>
<tr>
<td>Answer: B</td>
</tr>
<tr>
<td>What place is named in the title of the 1979 live album by rock legends Cheap</td>
</tr>
<tr>
<td>Trick?</td>
</tr>
<tr>
<td>A. Budapest</td>
</tr>
<tr>
<td>B. Budokan</td>
</tr>
<tr>
<td>C. Bhutan</td>
</tr>
<tr>
<td>D. Britain Answer: B</td>
</tr>
<tr>
<td>Who is the shortest man to ever win an NBA slam dunk competition?</td>
</tr>
<tr>
<td>A. Anthony &#39;Spud&#39; Webb B. Michael &#39;Air&#39; Jordan</td>
</tr>
<tr>
<td>C. Tyrone &#39;Muggsy&#39; Bogues D. Julius &#39;Dr J&#39; Erving</td>
</tr>
<tr>
<td>Answer: A</td>
</tr>
<tr>
<td>What is produced during photosynthesis?</td>
</tr>
<tr>
<td>A. hydrogen</td>
</tr>
<tr>
<td>B. nylon</td>
</tr>
<tr>
<td>C. oxygen</td>
</tr>
<tr>
<td>D. light</td>
</tr>
<tr>
<td>Answer: C</td>
</tr>
<tr>
<td>Which of these songs was a Top 10 hit for the rock band The Police?</td>
</tr>
<tr>
<td>A. &#39;Radio Ga-Ga&#39;</td>
</tr>
<tr>
<td>B. &#39;Ob-la-di Ob-la-da&#39;</td>
</tr>
<tr>
<td>C. &#39;De Do Do Do De Da Da Da&#39; D. &#39;In-a-Gadda-Da-Vida&#39;</td>
</tr>
<tr>
<td>Answer: C</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>Which of the Three Stooges was not related to the others?</td>
</tr>
<tr>
<td>A. Moe</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>B. Larry</td>
</tr>
<tr>
<td>C. Curly</td>
</tr>
<tr>
<td>D. Shemp</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>Answer:</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>OPTIONS</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>- A</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>-B</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>-C</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>-D</td>
</tr>
</tbody></table>
<p>表 34｜MMLU 格式示例.</p>
<p>表 35｜NaturalQuestions 格式示例.</p>
<p>表 36｜OpenBookQA 格式示例.</p>
<p>表 37｜PIQA 格式示例.</p>
<table>
<thead>
<tr>
<th>PROMPT Article:</th>
</tr>
</thead>
<tbody><tr>
<td>how the writer has put the ideas together. Sometimes a writer puts ideas together by asking questions and then answering them. For example, if the article is about groundhogs, the set of questions in the writer&#39;s head might be: What does a groundhog look like? Where do groundhogs live?</td>
</tr>
<tr>
<td>What do they eat?.. In the article, the author might answer those questions. Sometimes an author writes out her questions in the article. These questions give you</td>
</tr>
<tr>
<td>signals. They tell you what the author is going to write next. Often an author has a question in her head but she doesn&#39;t write it out for you. You have to work out her question for yourself. Here&#39;s a sample reading for you to practice this method. Earthworms</td>
</tr>
<tr>
<td>Do you know how many kinds of earthworms there are? There are about 1800 kinds in the world! They can be brown, purple, green. They can be as small as 3 cm long and as large as 3 m long.</td>
</tr>
<tr>
<td>The best time to see earthworms is at night, especially a cool, damp night. That&#39;s when they come up from their burrows to hunt for food. Earthworms don&#39;t like to be in the sun. That&#39;s because they breathe through their skin, and they can&#39;t breathe if their skin gets too</td>
</tr>
<tr>
<td>dry. Earthworms must come out of the earth if it rains a lot, because they can&#39;t breathe in their flooded burrows. What a dangerous life! Earthworms don&#39;t have eyes, so how can they tell when it&#39;s dark? They have special places</td>
</tr>
<tr>
<td>on their skin that are sensitive to light. These spots tell whether it&#39;s light or dark. If you shine a flashlight on an earthworm at night, it will quickly disappear into the ground.</td>
</tr>
<tr>
<td>Earthworms don&#39;t have ears either, but they can hear by feeling movements in the earth. If you want to hear like an earthworm, lie on the ground with your fingers in your ears. Then</td>
</tr>
<tr>
<td>have a friend stamp his or her feet near you. This is how earthworms feel birds and people walking, and moles digging, near them.</td>
</tr>
<tr>
<td>Earthworms are useful. Farmers and gardeners like having lots of earthworms in their land because the worms help to make better soil when they dig. That digging keeps the soil loose</td>
</tr>
<tr>
<td>and airy. In one year earthworms can pile up as much as 23, 000 kg of castings in an area about the size of a football field.</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>Q: What&#39;s the purpose of reading Earthworms?</td>
</tr>
<tr>
<td>A: To put the writer&#39;s idea into real use.</td>
</tr>
<tr>
<td>Q: Which question CANNOT be answered in the passage?</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>A: Why can human listen like earthworms?</td>
</tr>
<tr>
<td>Q: How can you understand Earthworms better according to this passage?</td>
</tr>
<tr>
<td>A: Read to work out all the questions in the writer&#39;s head while reading</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>Q: What&#39;s the best title for the passage?</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>A:</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>OPTIONS</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>- One way to help with understanding</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>- One way to practice with a new idea</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td>- One way to learn to be a wise writer</td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
<tr>
<td></td>
</tr>
</tbody></table>
<p>表 38｜RACE 格式示例.</p>
<p>表 39｜TriviaQA 格式示例.</p>
<p>表 40｜WinoGrande 格式示例. 该任务多个前缀对应同一补全, 取使补全困惑度最低的前缀为预测.</p>
`;
  const toc: { level: number; id: string; text: string }[] = [{"level":2,"id":"zy","text":"摘要"},{"level":2,"id":"1-yy","text":"1 引言"},{"level":2,"id":"2-yxl","text":"2 预训练"},{"level":3,"id":"2-1-sj","text":"2.1 数据"},{"level":3,"id":"2-2-jg","text":"2.2 架构"},{"level":3,"id":"2-3-ccs","text":"2.3 超参数"},{"level":3,"id":"2-4-jcss","text":"2.4 基础设施"},{"level":2,"id":"3-scaling-laws","text":"3 Scaling Laws"},{"level":3,"id":"3-1-ccsd-scaling-laws","text":"3.1 超参数的 Scaling Laws"},{"level":3,"id":"3-2-gjzymxysjsf","text":"3.2 估计最优模型与数据缩放"},{"level":3,"id":"3-3-btsjxd-scaling-laws","text":"3.3 不同数据下的 Scaling Laws"},{"level":2,"id":"4-dq","text":"4 对齐"},{"level":2,"id":"5-pc","text":"5 评测"},{"level":3,"id":"5-1-gkjzpc","text":"5.1 公开基准评测"},{"level":4,"id":"5-1-1-base-mx","text":"5.1.1 Base 模型"},{"level":4,"id":"5-1-2-chat-mx","text":"5.1.2 Chat 模型"},{"level":3,"id":"5-2-kfspc","text":"5.2 开放式评测"},{"level":4,"id":"5-2-1-zwkfspc","text":"5.2.1 中文开放式评测"},{"level":4,"id":"5-2-2-ywkfspc","text":"5.2.2 英文开放式评测"},{"level":3,"id":"5-3-lcjpc","text":"5.3 留出集评测"},{"level":3,"id":"5-4-aqpc","text":"5.4 安全评测"},{"level":3,"id":"5-5-tl","text":"5.5 讨论"},{"level":2,"id":"6-jl-jxyhxgz","text":"6 结论, 局限与后续工作"},{"level":2,"id":"a-fl","text":"A 附录"},{"level":3,"id":"a-2-btdmxgmbs","text":"A.2 不同的模型规模表示"},{"level":3,"id":"a-3-jzzbqx","text":"A.3 基准指标曲线"},{"level":3,"id":"a-4-ydm-sxzymxdb","text":"A.4 与代码 / 数学专用模型对比"},{"level":3,"id":"a-5-h-dpo-jddjzjg","text":"A.5 含 DPO 阶段的基准结果"},{"level":3,"id":"a-6-pcgs","text":"A.6 评测格式"}];
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LlmGuideNav currentRoute="14-models/14.1-deepseek/00-deep-seek-v1/01-deep-seek-v1-jsbgjy" />
      <main className="flex-1 min-w-0 px-6 pt-20 pb-12 lg:pt-12">
        <LlmGuideChapterBar currentRoute="14-models/14.1-deepseek/00-deep-seek-v1/01-deep-seek-v1-jsbgjy" />
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">DeepSeek LLM: 用长期主义缩放开源语言模型</h1>
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
