"use client";

import { useLang } from "@/lib/i18n";
import { LlmGuideChapterBar } from "@/components/LlmGuideChapterBar";
import { LlmGuideNav } from "@/components/LlmGuideNav";
import { LlmGuideToc } from "@/components/LlmGuideToc";

export default function Page() {
  const { t } = useLang();
  const html = `<h1>Janus-Pro: 用数据与模型缩放统一多模态理解与生成</h1>
<blockquote>
<p>🔙 <strong><a href="/llm-guide/14-models/14.1-deepseek/14.1-deepseek">返回 14.1-DeepSeek 家族总览</a></strong></p>
</blockquote>
<blockquote>
<p>原文标题: Janus-Pro: Unified Multimodal Understanding and Generation with Data and Model Scaling
作者: DeepSeek-AI
原文链接: <a href="https://arxiv.org/abs/2501.17811">https://arxiv.org/abs/2501.17811</a>
发布日期: 2025 年 1 月 29 日
精译日期: 2026 年 10 月 1 日</p>
</blockquote>
<h2 id="zy">摘要</h2>
<p>本文推出 <strong>Janus-Pro</strong>, 是前作 Janus 的加强版. 改动落在三处: (1)训练策略重排, (2)训练数据加量, (3)模型规模上探. 据此, 多模态理解与文生图指令跟随都明显抬升, 文生图稳定性也更好. 代码与模型已公开, 希望能推动同方向继续挖.</p>
<h2 id="1-yy">1 引言</h2>
<p>(a) 四个多模态理解基准的平均表现. (b) 文生图指令跟随基准上的表现.</p>
<p>黑板示例提示: 干净深绿黑板面, 正中用粗白粉笔清晰写「Hello」. 向日葵示例: 盛开的向日葵特写, 花瓣上停着蜜蜂, 翅缘透光. 橘子示例: 极简静物, 青蒂橙橘象征兴旺, 搁在春节红绸上.</p>
<p>统一「既能看懂又能画」的多模态模型近来进展很快. 这类做法常能抬高视觉生成侧的指令跟随, 也减少重复堆模型. 多数方法给理解任务和生成任务共用同一个视觉编码器; 两任务需要的表征并不一样, 理解侧往往吃亏. Janus 的对策是<strong>把视觉编码拆开</strong>: 理解一路, 生成一路, 缓解冲突, 两边都能做好.</p>
<p>解释:「解耦视觉编码」不是把整网拆成两个无关模型, 而是输入图像时走两套编码器(理解用语义编码器, 生成用离散 tokenizer), 再在同一个自回归 LLM 里汇合; 共享的是语言骨干, 不是视觉前端.</p>
<p>Janus 作为先行验证, 主要落在约 1B 参数. 数据与容量都偏紧时, 短提示生图偏弱, 文生图质量也不稳. 本文的 Janus-Pro 从训练策略, 数据, 模型规模三处加码; 系列含 1B 与 7B 两档, 用来证明「视觉编码解耦」这条路能跟着规模一起涨.</p>
<p>多基准结果显示: 理解更强, 文生图指令跟随也明显抬升. 具体数字: Janus-Pro-7B 在 MMBench 得 79.2, 超过 Janus(69.4), TokenFlow(68.9), MetaMorph(75.2); 在 GenEval 得 0.80, 超过 Janus(0.61), DALL-E 3(0.67), Stable Diffusion 3 Medium(0.74).</p>
<h2 id="2-ff">2 方法</h2>
<h3 id="2-1-jg">2.1 架构</h3>
<p>架构见图 3, 与 Janus 相同. 总原则仍是: 理解与生成的视觉编码分开. 原始输入各走独立编码, 再送进<strong>同一个</strong>自回归 Transformer. 理解侧用 SigLIP 抽高维语义特征, 把 2-D 网格展成 1-D, 经 understanding adaptor 映到 LLM 输入空间. 生成侧用文献 [38] 的 VQ tokenizer 把图像变成离散 ID; ID 展成 1-D 后, generation adaptor 把每个 ID 对应的 codebook 嵌入映进 LLM 输入空间. 各模态特征序列拼接后进 LLM. 除 LLM 自带预测头外, 生成任务另有一个随机初始化的图像预测头. 整网按自回归框架跑.</p>
<p>解释: SigLIP 是一类图文对齐视觉编码器, 输出偏「语义稠密特征」, 适合问答, 描述; VQ tokenizer 则把连续像素压成有限码本上的离散编号, 适合当「下一视觉 token」来预测. Adaptor(适配器)通常是浅层 MLP, 只负责维度对齐, 不另造一套视觉语义.</p>
<h3 id="2-2-yhhdxlcl">2.2 优化后的训练策略</h3>
<p>前作 Janus 分三阶段: Stage I 训 adaptor 与图像预测头; Stage II 做统一预训练, 除理解编码器, 生成编码器外其余参数更新; Stage III 在 Stage II 之上做监督微调, 并进一步解冻理解编码器. 问题出在 Stage II: 文生图能力按 PixArt 分成两段-- 先在 ImageNet 上用类别名当提示, 学像素依赖; 再用常规文生图数据. 实现里 Stage II 文生图步数的 66.67% 砸在第一段. 后续实验发现..</p>
<p>.. 这条策略并不优, 算力浪费明显.</p>
<p>为此做了两处改动.</p>
<p>• <strong>Stage I 加长</strong>: 拉长 Stage I 步数, 让 ImageNet 训够. 发现即便 LLM 参数固定, 模型也能学好像素依赖, 并按类别名生成像样的图.</p>
<p>• <strong>Stage II 收束</strong>: Stage II 不再用 ImageNet, 直接用常规文生图数据, 按稠密描述生图. 文生图数据用得更满, 训练效率与整体表现一起上来.</p>
<p>解释: 前作把「学像素依赖」和「学按长提示画画」挤在同一阶段, 还把大半步数给类别名; Pro 把前者前移到 Stage I(LLM 冻结也能学), Stage II 专心吃稠密描述, 避免在统一预训练里反复刷短类别提示.</p>
<p>Stage III 监督微调的数据配比也改了: 多模态 : 纯文本 : 文生图 从 7: 3: 10 调到 5: 1: 4. 文生图占比略降后, 生成能力仍强, 理解侧反而更好.</p>
<h3 id="2-3-sjsf">2.3 数据缩放</h3>
<p>相对 Janus, 理解与生成两侧的训练数据都加量.</p>
<p>• <strong>多模态理解</strong>. Stage II 预训练参考 DeepSeek-VL2, 大约加 9000 万样本: 含图像描述(如 YFCC), 以及表格, 图表, 文档理解(如 Docmatix). Stage III 也从 DeepSeek-VL2 补入 MEME 理解, 中文对话, 以及抬高对话体验的数据. 任务面更宽, 对话体验更好.</p>
<p>• <strong>视觉生成</strong>. 前作 Janus 用的真实世界数据质量一般, 噪声大, 文生图不稳, 观感差. Janus-Pro 大约加入 7200 万合成美学数据, 统一预训练阶段真实: 合成 = 1: 1. 合成数据的提示词可公开获取(如 [43]). 实验表明: 合成数据上收敛更快, 文生图更稳, 美学质量也明显更好.</p>
<p>解释:「合成美学数据」通常指用已有强文生图模型按公开提示词批量出图再当监督; 噪声更低, 风格更干净, 但分布会偏「生成器审美」, 和真实照片分布并不等同.</p>
<h3 id="2-4-mxsf">2.4 模型缩放</h3>
<p>前作用约 1.5B LLM 验证了解耦编码. Janus-Pro 扩到 7B; 1.5B 与 7B 的超参见表 1. 更大 LLM 时, 理解与生成两侧的 loss 收敛都明显快于小模型, 说明这条路线的可扩展性不错.</p>
<p>表 1｜Janus-Pro 架构配置(超参一览).</p>
<table>
<thead>
<tr>
<th></th>
<th>Janus-Pro-1B</th>
<th>Janus-Pro-7B</th>
</tr>
</thead>
<tbody><tr>
<td>Vocabulary size</td>
<td>100K</td>
<td>100K</td>
</tr>
<tr>
<td>Embedding size</td>
<td>2048</td>
<td>4096</td>
</tr>
<tr>
<td>Context Window</td>
<td>4096</td>
<td>4096</td>
</tr>
<tr>
<td>#Attention heads</td>
<td>16</td>
<td>32</td>
</tr>
<tr>
<td>#Layers</td>
<td>24</td>
<td>30</td>
</tr>
</tbody></table>
<p>表 2｜Janus-Pro 训练超参明细. Data ratio 指多模态理解 : 纯文本 : 视觉生成.</p>
<table>
<thead>
<tr>
<th></th>
<th>Janus-Pro-1B</th>
<th>Janus-Pro-7B</th>
</tr>
</thead>
<tbody><tr>
<td>Hyperparameters</td>
<td>Stage 1 Stage 2 Stage 3</td>
<td>Stage 1 Stage 2 Stage 3</td>
</tr>
<tr>
<td>Learning rate LR scheduler Weight decay Gradient clip Optimizer Warm-up steps Training steps Batch size Data Ratio</td>
<td>1.0×10-3 1.0×10-4 4.0×10-5Constant Constant Constant0.0 0.0 0.01.0 1.0 1.0AdamW (𝛽<sub>1</sub> = 0.9, 𝛽<sub>2</sub> = 0.95)600 5000 020K 360K 80K256 512 1281: 0: 3 2: 3: 5 5: 1: 4</td>
<td>1.0×10-3 1.0×10-4 4.0×10-5Constant Constant Constant0.0 0.0 0.01.0 1.0 1.0AdamW (𝛽<sub>1</sub> = 0.9, 𝛽<sub>2</sub> = 0.95)600 5000 020K 360K 40K256 512 1281: 0: 3 2: 3: 5 5: 1: 4</td>
</tr>
</tbody></table>
<h2 id="3-sy">3 实验</h2>
<h3 id="3-1-sxxj">3.1 实现细节</h3>
<p>底座语言型号为 DeepSeek-LLM(1.5B 与 7B), 最大序列长度 4096. 理解侧视觉编码器选 SigLIP-Large-Patch16-384. 生成编码器码本大小 16, 384, 图像下采样 16 倍. 理解 / 生成 adaptor 都是两层 MLP. 各阶段超见表 2. 注意 Stage II 用早停, 在 270K 步停下(表中规划为 360K). 图像一律到 384 × 384. 理解数据: 长边缩放, 短边用背景色 RGB (127, 127, 127) 填充到 384. 生成数据: 短边缩到 384, 长边裁到 384. 训练用 sequence packing 提效; 单步内按给定比例混所有数据类型. 训练与评测走 HAI-LLM(基于 PyTorch 的轻量分布式框架). 全程大约: 1.5B 用 16 节点约 9 天, 7B 用 32 节点约 14 天; 每节点 8 张 Nvidia A100(40GB).</p>
<p>解释: sequence packing 把多条短样本拼进同一条长序列, 减少 padding 空转; 理解侧「pad」保构图不裁, 生成侧「crop」保正方形监督更干净, 两种预处理故意不对称.</p>
<h3 id="3-2-pcsz">3.2 评测设置</h3>
<p><strong>多模态理解.</strong> 在常见图像视觉–语言基准上评测, 包括 GQA..</p>
<p>表 3｜多模态理解基准上与既有方法对比.「Und.」「Gen.」分别表示理解, 生成. † 表示外挂了预训练扩散模型.</p>
<table>
<thead>
<tr>
<th>Type Model</th>
<th>LLM Params</th>
<th>POPE↑</th>
<th>MME-P↑</th>
<th>MMB↑</th>
<th>SEED↑</th>
<th>GQA↑</th>
<th>MMMU↑</th>
<th>MM-Vet↑</th>
</tr>
</thead>
<tbody><tr>
<td>Und. Only LLaVA-v1.5-Phi-1.5 [50]</td>
<td>1.3B</td>
<td>84.1</td>
<td>1128.0</td>
<td>-</td>
<td>-</td>
<td>56.5</td>
<td>30.7</td>
<td>-</td>
</tr>
<tr>
<td>MobileVLM [6]</td>
<td>1.4B</td>
<td>84.5</td>
<td>1196.2</td>
<td>53.2</td>
<td>-</td>
<td>56.1</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>MobileVLM-V2 [7]</td>
<td>1.4B</td>
<td>84.3</td>
<td>1302.8</td>
<td>57.7</td>
<td>-</td>
<td>59.3</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>MobileVLM [6]</td>
<td>2.7B</td>
<td>84.9</td>
<td>1288.9</td>
<td>59.6</td>
<td>-</td>
<td>59.0</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>MobileVLM-V2 [7]</td>
<td>2.7B</td>
<td>84.7</td>
<td>1440.5</td>
<td>63.2</td>
<td>-</td>
<td>61.1</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>LLaVA-Phi [56]</td>
<td>2.7B</td>
<td>85.0</td>
<td>1335.1</td>
<td>59.8</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>28.9</td>
</tr>
<tr>
<td>LLaVA [27]</td>
<td>7B</td>
<td>76.3</td>
<td>809.6</td>
<td>38.7</td>
<td>33.5</td>
<td>-</td>
<td>-</td>
<td>25.5</td>
</tr>
<tr>
<td>LLaVA-v1.5 [26]</td>
<td>7B</td>
<td>85.9</td>
<td>1510.7</td>
<td>64.3</td>
<td>58.6</td>
<td>62.0</td>
<td>35.4</td>
<td>31.1</td>
</tr>
<tr>
<td>InstructBLIP [8]</td>
<td>7B</td>
<td>-</td>
<td>-</td>
<td>36.0</td>
<td>53.4</td>
<td>49.2</td>
<td>-</td>
<td>26.2</td>
</tr>
<tr>
<td>Qwen-VL-Chat [1]</td>
<td>7B</td>
<td>-</td>
<td>1487.5</td>
<td>60.6</td>
<td>58.2</td>
<td>57.5</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>IDEFICS-9B [19]</td>
<td>8B</td>
<td>-</td>
<td>-</td>
<td>48.2</td>
<td>-</td>
<td>38.4</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>Emu3-Chat [45]</td>
<td>8B</td>
<td>85.2</td>
<td>1244</td>
<td>58.5</td>
<td>68.2</td>
<td>60.3</td>
<td>31.6</td>
<td>37.2</td>
</tr>
<tr>
<td>InstructBLIP [8]</td>
<td>13B</td>
<td>78.9</td>
<td>1212.8</td>
<td>-</td>
<td>-</td>
<td>49.5</td>
<td>-</td>
<td>25.6</td>
</tr>
<tr>
<td>Und. and Gen. DreamLLM† [10]</td>
<td>7B</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>36.6</td>
</tr>
<tr>
<td>LaVIT† [18]</td>
<td>7B</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>46.8</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>MetaMorph† [42]</td>
<td>8B</td>
<td>-</td>
<td>-</td>
<td>75.2</td>
<td>71.8</td>
<td>-</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>Emu† [39]</td>
<td>13B</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>NExT-GPT† [47]</td>
<td>13B</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>Show-o-256 [50]</td>
<td>1.3B</td>
<td>73.8</td>
<td>948.4</td>
<td>-</td>
<td>-</td>
<td>48.7</td>
<td>25.1</td>
<td>-</td>
</tr>
<tr>
<td>Show-o-512 [50]</td>
<td>1.3B</td>
<td>80.0</td>
<td>1097.2</td>
<td>-</td>
<td>-</td>
<td>58.0</td>
<td>26.7</td>
<td>-</td>
</tr>
<tr>
<td>D-Dit [24]</td>
<td>2.0B</td>
<td>84.0</td>
<td>1124.7</td>
<td>-</td>
<td>-</td>
<td>59.2</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>Gemini-Nano-1 [41]</td>
<td>1.8B</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>26.3</td>
<td>-</td>
</tr>
<tr>
<td>ILLUME [44]</td>
<td>7B</td>
<td>88.5</td>
<td>1445.3</td>
<td>65.1</td>
<td>72.9</td>
<td>-</td>
<td>38.2</td>
<td>37.0</td>
</tr>
<tr>
<td>TokenFlow-XL [34]</td>
<td>13B</td>
<td>86.8</td>
<td>1545.9</td>
<td>68.9</td>
<td>68.7</td>
<td>62.7</td>
<td>38.7</td>
<td>40.7</td>
</tr>
<tr>
<td>LWM [28]</td>
<td>7B</td>
<td>75.2</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>44.8</td>
<td>-</td>
<td>9.6</td>
</tr>
<tr>
<td>VILA-U [48]</td>
<td>7B</td>
<td>85.8</td>
<td>1401.8</td>
<td>-</td>
<td>59.0</td>
<td>60.8</td>
<td>-</td>
<td>33.5</td>
</tr>
<tr>
<td>Chameleon [40]</td>
<td>7B</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>22.4</td>
<td>8.3</td>
</tr>
<tr>
<td>Janus</td>
<td>1.5B</td>
<td>87.0</td>
<td>1338.0</td>
<td>69.4</td>
<td>63.7</td>
<td>59.1</td>
<td>30.5</td>
<td>34.3</td>
</tr>
<tr>
<td>Janus-Pro-1B</td>
<td>1.5B</td>
<td>86.2</td>
<td>1444.0</td>
<td>75.5</td>
<td>68.3</td>
<td>59.3</td>
<td>36.3</td>
<td>39.8</td>
</tr>
<tr>
<td>Janus-Pro-7B</td>
<td>7B</td>
<td>87.4</td>
<td>1567.1</td>
<td>79.2</td>
<td>72.1</td>
<td>62.0</td>
<td>41.0</td>
<td>50.0</td>
</tr>
</tbody></table>
<p>.. 以及 GQA [17], POPE [23], MME [12], SEED [21], MMB [29], MM-Vet [51], MMMU [52].</p>
<p><strong>视觉生成.</strong> 用 GenEval 与 DPG-Bench. GenEval 侧重文生图的组合能力, 做实例级细拆. DPG-Bench(Dense Prompt Graph Benchmark)含 1065 条长而密的提示, 测稠密语义对齐.</p>
<h3 id="3-3-yjyxjffdb">3.3 与既有先进方法对比</h3>
<p><strong>多模态理解表现.</strong> 表 3 对照统一模型与纯理解模型. Janus-Pro 整体最好, 作者归因于理解/生成视觉编码解耦, 冲突减轻. 相对更大参数量的模型仍有竞争力: 例如 Janus-Pro-7B 除 GQA 外全面超过 TokenFlow-XL(13B).</p>
<p>表 4｜GenEval 上文生图能力.「Und.」「Gen.」同上. † 表示外挂预训练扩散模型.</p>
<table>
<thead>
<tr>
<th>Method</th>
<th>Single Obj.</th>
<th>Two Obj.</th>
<th>Counting</th>
<th>Colors</th>
<th>Position</th>
<th>Color Attri.</th>
<th>Overall↑</th>
</tr>
</thead>
<tbody><tr>
<td>LlamaGen [38]</td>
<td>0.71</td>
<td>0.34</td>
<td>0.21</td>
<td>0.58</td>
<td>0.07</td>
<td>0.04</td>
<td>0.32</td>
</tr>
<tr>
<td>LDM [37]</td>
<td>0.92</td>
<td>0.29</td>
<td>0.23</td>
<td>0.70</td>
<td>0.02</td>
<td>0.05</td>
<td>0.37</td>
</tr>
<tr>
<td>SDv1.5 [37]</td>
<td>0.97</td>
<td>0.38</td>
<td>0.35</td>
<td>0.76</td>
<td>0.04</td>
<td>0.06</td>
<td>0.43</td>
</tr>
<tr>
<td>PixArt-𝛼 [4]</td>
<td>0.98</td>
<td>0.50</td>
<td>0.44</td>
<td>0.80</td>
<td>0.08</td>
<td>0.07</td>
<td>0.48</td>
</tr>
<tr>
<td>Gen. Only</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td>SDv2.1 [37]</td>
<td>0.98</td>
<td>0.51</td>
<td>0.44</td>
<td>0.85</td>
<td>0.07</td>
<td>0.17</td>
<td>0.50</td>
</tr>
<tr>
<td>DALL-E 2 [35]</td>
<td>0.94</td>
<td>0.66</td>
<td>0.49</td>
<td>0.77</td>
<td>0.10</td>
<td>0.19</td>
<td>0.52</td>
</tr>
<tr>
<td>Emu3-Gen [45]</td>
<td>0.98</td>
<td>0.71</td>
<td>0.34</td>
<td>0.81</td>
<td>0.17</td>
<td>0.21</td>
<td>0.54</td>
</tr>
<tr>
<td>SDXL [32]</td>
<td>0.98</td>
<td>0.74</td>
<td>0.39</td>
<td>0.85</td>
<td>0.15</td>
<td>0.23</td>
<td>0.55</td>
</tr>
<tr>
<td>DALL-E 3 [2]</td>
<td>0.96</td>
<td>0.87</td>
<td>0.47</td>
<td>0.83</td>
<td>0.43</td>
<td>0.45</td>
<td>0.67</td>
</tr>
<tr>
<td>SD3-Medium [11]</td>
<td>0.99</td>
<td>0.94</td>
<td>0.72</td>
<td>0.89</td>
<td>0.33</td>
<td>0.60</td>
<td>0.74</td>
</tr>
<tr>
<td>SEED-X† [13]</td>
<td>0.97</td>
<td>0.58</td>
<td>0.26</td>
<td>0.80</td>
<td>0.19</td>
<td>0.14</td>
<td>0.49</td>
</tr>
<tr>
<td>Show-o [50]</td>
<td>0.95</td>
<td>0.52</td>
<td>0.49</td>
<td>0.82</td>
<td>0.11</td>
<td>0.28</td>
<td>0.53</td>
</tr>
<tr>
<td>Und. and Gen. D-DiT [24]</td>
<td>0.97</td>
<td>0.80</td>
<td>0.54</td>
<td>0.76</td>
<td>0.32</td>
<td>0.50</td>
<td>0.65</td>
</tr>
<tr>
<td>LWM [28]</td>
<td>0.93</td>
<td>0.41</td>
<td>0.46</td>
<td>0.79</td>
<td>0.09</td>
<td>0.15</td>
<td>0.47</td>
</tr>
<tr>
<td>Transfusion [55]</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>0.63</td>
</tr>
<tr>
<td>ILLUME [44]</td>
<td>0.99</td>
<td>0.86</td>
<td>0.45</td>
<td>0.71</td>
<td>0.39</td>
<td>0.28</td>
<td>0.61</td>
</tr>
<tr>
<td>TokenFlow-XL [28]</td>
<td>0.95</td>
<td>0.60</td>
<td>0.41</td>
<td>0.81</td>
<td>0.16</td>
<td>0.24</td>
<td>0.55</td>
</tr>
<tr>
<td>Chameleon [40]</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>0.39</td>
</tr>
<tr>
<td>Janus [46]</td>
<td>0.97</td>
<td>0.68</td>
<td>0.30</td>
<td>0.84</td>
<td>0.46</td>
<td>0.42</td>
<td>0.61</td>
</tr>
<tr>
<td>Janus-Pro-1B</td>
<td>0.98</td>
<td>0.82</td>
<td>0.51</td>
<td>0.89</td>
<td>0.65</td>
<td>0.56</td>
<td>0.73</td>
</tr>
<tr>
<td>Janus-Pro-7B</td>
<td>0.99</td>
<td>0.89</td>
<td>0.59</td>
<td>0.90</td>
<td>0.79</td>
<td>0.66</td>
<td>0.80</td>
</tr>
</tbody></table>
<p>表 5｜DPG-Bench 表现. 除 Janus / Janus-Pro 外, 表中均为生成专用模型.</p>
<table>
<thead>
<tr>
<th>Method</th>
<th>Global</th>
<th>Entity</th>
<th>Attribute</th>
<th>Relation</th>
<th>Other</th>
<th>Overall↑</th>
</tr>
</thead>
<tbody><tr>
<td>SDv1.5 [36]</td>
<td>74.63</td>
<td>74.23</td>
<td>75.39</td>
<td>73.49</td>
<td>67.81</td>
<td>63.18</td>
</tr>
<tr>
<td>PixArt-𝛼 [4]</td>
<td>74.97</td>
<td>79.32</td>
<td>78.60</td>
<td>82.57</td>
<td>76.96</td>
<td>71.11</td>
</tr>
<tr>
<td>Lumina-Next [57]</td>
<td>82.82</td>
<td>88.65</td>
<td>86.44</td>
<td>80.53</td>
<td>81.82</td>
<td>74.63</td>
</tr>
<tr>
<td>SDXL [33]</td>
<td>83.27</td>
<td>82.43</td>
<td>80.91</td>
<td>86.76</td>
<td>80.41</td>
<td>74.65</td>
</tr>
<tr>
<td>Playground v2.5 [22]</td>
<td>83.06</td>
<td>82.59</td>
<td>81.20</td>
<td>84.08</td>
<td>83.50</td>
<td>75.47</td>
</tr>
<tr>
<td>Hunyuan-DiT [25]</td>
<td>84.59</td>
<td>80.59</td>
<td>88.01</td>
<td>74.36</td>
<td>86.41</td>
<td>78.87</td>
</tr>
<tr>
<td>PixArt-Σ [5]</td>
<td>86.89</td>
<td>82.89</td>
<td>88.94</td>
<td>86.59</td>
<td>87.68</td>
<td>80.54</td>
</tr>
<tr>
<td>Emu3-Gen [45]</td>
<td>85.21</td>
<td>86.68</td>
<td>86.84</td>
<td>90.22</td>
<td>83.15</td>
<td>80.60</td>
</tr>
<tr>
<td>DALL-E 3 [2]</td>
<td>90.97</td>
<td>89.61</td>
<td>88.39</td>
<td>90.58</td>
<td>89.83</td>
<td>83.50</td>
</tr>
<tr>
<td>SD3-Medium [11]</td>
<td>87.90</td>
<td>91.01</td>
<td>88.83</td>
<td>80.70</td>
<td>88.68</td>
<td>84.08</td>
</tr>
<tr>
<td>Janus</td>
<td>82.33</td>
<td>87.38</td>
<td>87.70</td>
<td>85.46</td>
<td>86.41</td>
<td>79.68</td>
</tr>
<tr>
<td>Janus-Pro-1B</td>
<td>87.58</td>
<td>88.63</td>
<td>88.17</td>
<td>88.98</td>
<td>88.30</td>
<td>82.63</td>
</tr>
<tr>
<td>Janus-Pro-7B</td>
<td>86.90</td>
<td>88.90</td>
<td>89.40</td>
<td>89.32</td>
<td>89.48</td>
<td>84.19</td>
</tr>
</tbody></table>
<p><strong>视觉生成表现.</strong> GenEval 上 Janus-Pro-7B 总准确率 80%, 超过表中全部统一或纯生成方法, 例如 Transfusion(63%), SD3-Medium(74%), DALL-E 3(67%), 说明指令跟随更强. DPG-Bench 上 Janus-Pro 得 84.19, 也超过其余方法, 稠密指令跟随表现突出.</p>
<h3 id="3-4-dxjg">3.4 定性结果</h3>
<p>图 4 给了多模态理解样例: 跨场景输入时理解力扎实. 同图下半是文生图: Janus-Pro-7B 观感写实; 分辨率虽只有 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>384</mn><mo>×</mo><mn>384</mn></mrow><annotation encoding="application/x-tex">384 \\times 384</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">384</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">384</span></span></span></span>, 细节仍多. 想象类场景也能抓住提示语义, 构图合理, 前后一致.</p>
<p>Image Description 图像描述</p>
<p>请详细描述这个场景.</p>
<p>画面是一片醒目的海岸: 几座高大嶙峋的岩柱从海中升起, 沉积岩层层分明. 最大一块在前景, 其余向远处退去. 浪拍岩脚, 溅起白沫, 动感清楚. 右侧有一条窄沙滩, 陡峭崖壁从岸边拔起, 崖上斑驳绿植给土色岩石添了点颜色. 天空阴沉厚云, 像要来雨或刚下过; 光线散射, 整景偏柔, 偏灰. 即便如此, 海岸仍显得安静, 自然.</p>
<p>Landmark Recognition 地标识别</p>
<p>这张图⽚展示的是中国杭州的⻄湖, 特别是著名的三潭印⽉岛. 图⽚中的建筑是三潭印⽉的亭⼦, 周围是平静的湖⽔, 远处是连绵的⼭脉. ⻄湖是中国著名的旅游景点之⼀, 以其美丽的⾃然景观和丰富的历史⽂化⽽闻名.</p>
<p>猜猜这是哪里?</p>
<p>文字识别</p>
<p>General Knowledge 常识问答</p>
<p>能介绍一下这块蛋糕的背景故事吗?</p>
<p>黑板上写了什么?</p>
<p>答: 蛋糕主题是经典卡通「猫和老鼠」. 上面有汤姆(猫)与杰瑞(鼠)的玩耍场景, 背景写着 「Tom &amp; Jerry」. 蛋糕用奶酪造型翻糖装饰, 呼应动画里反复出现的奶酪母题; 还有一栋带门的小翻糖小屋, 整体偏俏皮.</p>
<p>答: 大黑板主标题是 「Serving Soul since Twenty Twelve」. 旁边还有更细的分区信息, 但主标题清晰可读.</p>
<p>文生图</p>
<p>一只金毛寻回犬安详趴在木廊上, 周围散落秋叶.</p>
<p>雀斑少女戴草帽, 站在金色麦田里.</p>
<p>一滴水挂在绿叶上, 阳光折射出淡淡彩虹.</p>
<p>古石桥横跨清澈山溪, 四周绿意浓.</p>
<p>沙漠日落中, 发光水晶球浮在砂岩桌上.</p>
<p>玻璃瓶里装进小小星系, 在深色绒布上发亮.</p>
<p>巨鲸飞过城市天际线, 四周漂浮发光灯笼.</p>
<p>丛林中的宇航员, 冷色调, 低饱和, 细节丰富, 8k.</p>
<h2 id="4-jl-jxxywlfx">4 结论、局限性与未来方向</h2>
<p>本文从训练策略, 数据, 模型规模三处改进 Janus, 理解与文生图指令跟随都明显抬升. 局限仍在: 理解侧输入锁在 384 × 384, 细粒度任务(如 OCR)吃亏; 生成侧分辨率低, 再叠加视觉 tokenizer 的重建损失, 语义够, 细部仍虚-- 占画面很小的人脸尤其容易糊. 提高图像分辨率有望缓解.</p>
`;
  const toc: { level: number; id: string; text: string }[] = [{"level":2,"id":"zy","text":"摘要"},{"level":2,"id":"1-yy","text":"1 引言"},{"level":2,"id":"2-ff","text":"2 方法"},{"level":3,"id":"2-1-jg","text":"2.1 架构"},{"level":3,"id":"2-2-yhhdxlcl","text":"2.2 优化后的训练策略"},{"level":3,"id":"2-3-sjsf","text":"2.3 数据缩放"},{"level":3,"id":"2-4-mxsf","text":"2.4 模型缩放"},{"level":2,"id":"3-sy","text":"3 实验"},{"level":3,"id":"3-1-sxxj","text":"3.1 实现细节"},{"level":3,"id":"3-2-pcsz","text":"3.2 评测设置"},{"level":3,"id":"3-3-yjyxjffdb","text":"3.3 与既有先进方法对比"},{"level":3,"id":"3-4-dxjg","text":"3.4 定性结果"},{"level":2,"id":"4-jl-jxxywlfx","text":"4 结论、局限性与未来方向"}];
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LlmGuideNav currentRoute="14-models/14.1-deepseek/13-deep-seek-janus-pro/01-deep-seek-janus-pro-jsbgjy" />
      <main className="flex-1 min-w-0 px-6 pt-20 pb-12 lg:pt-12">
        <LlmGuideChapterBar currentRoute="14-models/14.1-deepseek/13-deep-seek-janus-pro/01-deep-seek-janus-pro-jsbgjy" />
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Janus-Pro: 用数据与模型缩放统一多模态理解与生成</h1>
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
