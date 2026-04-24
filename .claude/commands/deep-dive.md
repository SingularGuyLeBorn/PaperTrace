# Paper Deep-Dive — Convert Paper to PaperTrace Interactive Breakdown

Convert an academic paper into a full PaperTrace interactive deep-dive page.

## Usage

```
/deep-dive $ARGUMENTS
```

`$ARGUMENTS` can be:
- An arXiv URL (e.g. `https://arxiv.org/abs/2106.09685`)
- An arXiv ID (e.g. `2106.09685`)
- A slug of an existing paper to rebuild (e.g. `lora`)

---

## Steps

### 1. Gather paper info

If $ARGUMENTS is a URL or arXiv ID:
- Fetch the abstract page (`https://arxiv.org/abs/<id>`) to get title, authors, year, venue
- Fetch the HTML version (`https://arxiv.org/html/<id>`) to read the full paper content
- If HTML is unavailable, fetch the PDF metadata page

Ask the user for:
- **Slug**: short, URL-safe kebab-case (e.g. `attention-is-all-you-need`, `lora`, `flashattention`)
- **Section**: which section in `src/lib/papers.ts` to add this paper to (show existing sections)

### 2. Deep-read the paper

Extract the following from the paper content:

**Overview**
- Core problem being solved (1-2 sentences)
- Main insight / key idea (1 sentence)
- Main result / contribution (1-2 sentences)

**Method**
- All key equations (LaTeX) with variable definitions
- Step-by-step algorithm or forward-pass logic
- Any notable initialization choices or design decisions

**Experiments / Results**
- Key benchmark results (numbers, comparisons)
- Ablations that validate the core design choices
- Compute/efficiency numbers if relevant

**Figures**
- Identify 1–3 figures from the paper that best illustrate the method (architecture diagram, training curve, main results table)
- Note the figure number/caption for use in step 4

**Connections**
- What prior work it builds on
- What later work it enables (think about papers already in `src/lib/papers.ts`)

### 3. ⚠️ Anti-Hallucination Rule (REQUIRED — READ FIRST)

**Every claim in the page MUST come from one of these sources, in this priority order:**
1. The actual paper text/PDF (fetched and read)
2. The official model page (HuggingFace README, paper abstract page)
3. A cited arXiv companion paper

**NEVER use third-party blog posts, news articles, or speculation as a source for:**
- Model parameter counts / architecture specs
- Benchmark numbers
- Training hardware or data size
- Algorithm details or equations
- Any technical claim that could be wrong

**If you cannot read the paper:** state this explicitly in the page with a disclaimer box. Do not fill in plausible-sounding numbers from memory or web search.

**For papers with HuggingFace releases:** always fetch the README at `https://huggingface.co/<org>/<model>/blob/main/README.md` — it usually contains the official benchmark tables verbatim from the paper.

**For any claim sourced from outside the paper itself:** add a visible `{t("Source: ...", "来源：...")}` note in the UI.

### 4. ⚠️ Formula & Figure Verifier (REQUIRED)

**Before writing any equation in the page, verify it against the source.**

For each equation you plan to include:
1. Locate the exact equation in the fetched paper HTML/PDF
2. Copy the LaTeX verbatim — do NOT reconstruct from memory or description
3. If you cannot locate the exact equation in the source, mark it explicitly as `{/* SCHEMATIC — verify against paper */}` in a comment and add a visible disclaimer in the UI
4. Record the paper section/equation number next to each `<Math>` label

For figures:
1. Check if the arXiv HTML version (`https://arxiv.org/html/<id>`) contains `<img>` tags with figure URLs
2. If yes, embed directly: `<img src="https://arxiv.org/html/<id>/..." alt="Figure N: caption" className="w-full rounded-lg my-4 border border-paper-200 dark:border-slate-700" />`
3. If the HTML figure URL is not available, note it with a comment but do NOT invent/fabricate a diagram — use `FlowChart` or prose instead
4. Always include the figure caption as a `<p className="text-xs text-paper-800/50 text-center -mt-2 mb-4">` below the image

**Rule: any formula not found verbatim in the source MUST be labelled "(schematic)" in the `label` prop.**

### 4. Add metadata to `src/lib/papers.ts`

Add a `PaperMeta` entry to the correct section:
```ts
{
  slug: "<slug>",
  title: "<English title>",
  authors: "<Last et al.>",
  year: <year>,
  venue: "<ICML 2024 / arXiv / NeurIPS 2023 / ...>",
  tags: ["<tag1>", "<tag2>", "<tag3>"],   // 2–4 tags
  description: "<2–3 sentence bilingual-ready description>",
  arxiv: "https://arxiv.org/abs/<id>",
}
```

### 5. Create `src/app/papers/<slug>/page.tsx`

Use this exact template structure:

```tsx
"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function <PascalCaseSlug>Page() {
  const { t } = useLang();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("<English title>", "<中文标题>")}
        </h1>
        <p className="text-paper-800/50">
          <Authors> &middot; <Venue Year> &middot;{" "}
          <a href="<arxiv url>" target="_blank" rel="noopener noreferrer"
             className="text-blue-600 hover:underline">
            arXiv <id>
          </a>
        </p>
      </header>

      <article className="paper-content">

        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t("<2-4 sentence English summary>", "<2-4句中文摘要>")}
          </p>
        </section>

        {/* ============ FlowChart overview ============ */}
        <FlowChart
          title={t("<Method> Overview", "<方法>总览")}
          steps={[/* 5-8 steps capturing the method pipeline */]}
          arrows={[/* transition labels between steps */]}
          highlights={[/* 2-3 key takeaways */]}
        />

        {/* ============ Key Figure (from paper) ============ */}
        {/* Embed the most important architecture/method figure if available from arXiv HTML */}
        {/*
        <img
          src="https://arxiv.org/html/<id>/x1.png"
          alt="Figure 1: <caption from paper>"
          className="w-full rounded-lg my-6 border border-paper-200 dark:border-slate-700"
        />
        <p className="text-xs text-paper-800/50 dark:text-slate-500 text-center -mt-4 mb-6">
          {t("Figure 1: <English caption>", "图1：<中文说明>")}
        </p>
        */}

        {/* ============ 1. Background ============ */}
        <h2>{t("1. Background: <subtitle>", "1. 背景：<副标题>")}</h2>
        <p>{t("...", "...")}</p>

        {/* ============ 2. Core Method ============ */}
        <h2>{t("2. Core Method: <subtitle>", "2. 核心方法：<副标题>")}</h2>
        <p>{t("...", "...")}</p>
        {/* label MUST include equation number from paper, e.g. "Eq. (3) — GRPO advantage" */}
        <Math display label={t("Eq. (N) — <description>", "公式 (N) — <描述>")} tex="..." />

        {/* Variable breakdown collapsible */}
        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-2">
              {/* <Math tex="var" /> <span>{t("definition en", "定义中文")}</span> pairs */}
            </div>
          </div>
        </Collapsible>

        {/* Key insight callout box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Why <design choice>?", "为什么<设计选择>？")}</strong>{" "}
            {t("...", "...")}
          </p>
        </div>

        {/* ============ 3. Concrete Example ============ */}
        <h2>{t("3. Concrete Example: <subtitle>", "3. 具体示例：<副标题>")}</h2>
        {/* Use real numbers from the paper. Green/red/blue boxes for comparison. */}

        {/* ============ 4. Key Results ============ */}
        <h2>{t("4. Key Results", "4. 关键实验结果")}</h2>

        {/* ============ 5. Why It Matters ============ */}
        <h2>{t("5. Why It Matters", "5. 为什么重要")}</h2>

        {/* ============ 6. Related Papers ============ */}
        <h2>{t("6. Related Papers", "6. 相关论文")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {/* Link to papers that exist in src/lib/papers.ts */}
        </div>

        {/* ============ 7. Additional Resources ============ */}
        <h2>{t("7. Additional Resources", "7. 补充资源")}</h2>
        {/* arXiv link + 1-2 key follow-up papers */}

      </article>
    </div>
  );
}
```

### 6. Add to knowledge graph in `src/lib/graph-data.ts`

- Add a paper node (type `"paper"`)
- Connect to existing lab/org nodes
- Add edges to prerequisite and follow-up papers if the nodes exist

### 7. Verify

```bash
npm run build
```

Fix any TypeScript errors before finishing.

---

## Content quality rules

- **Every English string must have a Chinese translation** via `t(en, zh)` — no bare strings
- **Math**: use `<Math tex="..." />` inline, `<Math display tex="..." />` for block equations; never use the `inline` prop
- **Inline math in prose**: NEVER write `h_l` or `x_{t}` as plain text inside `<p>` tags — always wrap with `<Math tex="h_l" />` inline
- **Links**: use `<Link href="/papers/<slug>">` (no `${basePath}` — Next.js adds it automatically)
- **No fabricated citations** — every referenced paper must have a real arXiv/venue link
- **No fabricated equations** — copy LaTeX verbatim from source; label with equation number; mark schematic formulas visibly
- **No fabricated figures** — only embed `<img>` if you found the URL in the arXiv HTML source; otherwise use FlowChart
- **Concrete numbers**: use actual results from the paper, not vague descriptions
- **Collapsibles**: use `defaultOpen` for the first breakdown, closed for supplementary material
- **Callout boxes**: amber for "why" explanations, blue for info, green for results, red for problem statements
- **TL;DR**: 2-4 sentences — precise and technical, not marketing speak
- **FlowChart steps**: 5-8 items capturing the logical pipeline of the method; each `color` should progress rose→amber→blue→teal→green→purple
- **Section count**: aim for 7-10 numbered sections; match the depth of existing long pages like `lora`, `flashattention`, `attention-is-all-you-need`
- **Equation labels**: always include the equation number from the paper (e.g. `"Eq. (3) from §3.2"`) so readers can cross-reference
