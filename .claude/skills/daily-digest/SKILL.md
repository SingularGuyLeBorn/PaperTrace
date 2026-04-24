---
name: daily-digest
description: Add today's ML/AI paper and news picks to the PaperTrace daily feed. Use when the user wants to update the daily page with new content.
allowed-tools: Read Edit Bash Glob
---

# PaperTrace · 每日日报

为 PaperTrace 生成当天的日报内容，更新到 `src/lib/daily.ts`。

---

## 1. 找内容

**Paper 来源（按优先级）：**
```
https://huggingface.co/papers        ← 社区人气榜，首选
https://arxiv.org/list/cs.LG/recent
https://arxiv.org/list/cs.CL/recent
https://paperswithcode.com/latest
```

**筛选标准：**
- 解决清晰问题，不是 survey
- 有明确数字结果
- 与受众相关：LLM / Diffusion / RL / Efficient Training / Reasoning

目标：**每日 2–5 篇 paper + 0–2 条 news**，宁缺毋滥。

---

## 2. 生成字段（Claude Prompt）

拿到 abstract 后：

```
论文标题：[title]
arXiv ID：[XXXX.XXXXX]
Abstract：[粘贴]

请输出 JSON：
{
  "titleZh": "中文标题",
  "tags": ["从以下选 ≤3 个: Diffusion LM, Pre-training, Fine-tuning, LoRA, Efficient Inference, Reasoning, Alignment, RLHF, Multimodal, Theory, Benchmark, Code, Agent, RAG, Quantization, MoE, Vision"],
  "why": "英文，≤25词，格式：[做了什么] — [为什么重要]",
  "whyZh": "中文，≤30字，同格式"
}
```

---

## 3. 更新文件

读取当前结构：
```
Read src/lib/daily.ts
```

在 `dailyPapers` 数组**顶部**加新条目：

```ts
{
  date: "YYYY-MM-DD",           // 今天
  title: "英文原标题",
  titleZh: "中文标题",           // 重要论文必填
  authors: "第一作者 et al.",
  arxivId: "XXXX.XXXXX",        // 只填 ID
  tags: ["Tag1", "Tag2"],
  why: "...",
  whyZh: "...",
  pick: true,                   // 最多 1 篇
}
```

---

## 4. 验证

```bash
npm run build
```

访问 `/daily` 确认新条目在顶部，中英文切换正常。

---

## 快速清单

```
[ ] 浏览 HuggingFace Papers 今日榜单
[ ] 选 2–5 篇，生成 why/whyZh
[ ] 选最强 1 篇加 pick: true
[ ] 加到 daily.ts 顶部（最新在前）
[ ] npm run build 验证
[ ] git commit: "feat(daily): YYYY-MM-DD digest"
```
