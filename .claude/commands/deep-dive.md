# Paper Deep-Dive — Convert Paper to PaperTrace Interactive Breakdown

Convert an academic paper into a full PaperTrace interactive deep-dive page.

## Usage

```
/deep-dive $ARGUMENTS
```

`$ARGUMENTS` can be:
- An arXiv URL (e.g. `https://arxiv.org/abs/2106.09685`)
- An arXiv ID (e.g. `2106.09685`)
- A HuggingFace model page URL (e.g. `https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro`)
- A slug of an existing paper to rebuild (e.g. `lora`)

---

## ⛔ RULE #1 — NO HALLUCINATION (Read before anything else)

**Every single claim in the page must come from one of these verified sources:**

| Priority | Source | How to get it |
|---|---|---|
| 1 | Paper PDF | Download via HuggingFace resolve URL or arXiv |
| 2 | Official HuggingFace README | `https://huggingface.co/<org>/<model>/blob/main/README.md` |
| 3 | arXiv HTML full text | `https://arxiv.org/html/<id>` |
| 4 | Companion paper (cited in the paper itself) | Must have real arXiv link |

**NEVER use third-party blog posts, news articles, or web search results** to fill in:
- Parameter counts, model size, active parameters
- Training token counts or hardware
- Benchmark numbers
- Algorithm steps or equations
- Any architectural detail

**If the paper is inaccessible:** write an explicit disclaimer in the page. Do NOT fill plausible-sounding numbers from memory.

**After writing the page:** `grep` the whole file for any third-party-sourced claims that may have crept in (especially in TL;DR and Why It Matters sections — these are written quickly and are highest-risk for hallucination).

---

## Steps

### 1. Gather Sources

For any paper, fetch ALL of these before writing a single word:

```bash
# For arXiv papers:
# 1. Abstract page
https://arxiv.org/abs/<id>

# 2. Full HTML (best for equations and text)
https://arxiv.org/html/<id>

# 3. For HuggingFace model releases, fetch the README
https://huggingface.co/<org>/<model>/blob/main/README.md

# 4. Check assets directory for official figures
https://huggingface.co/<org>/<model>/tree/main/assets
```

Only proceed to writing after you have read the actual paper content. If HTML is unavailable and PDF can't be parsed, state this in a disclaimer box in the UI.

Ask the user for:
- **Slug**: short, URL-safe kebab-case (e.g. `attention-is-all-you-need`, `lora`, `flashattention`)
- **Section**: which section in `src/lib/papers.ts` to add this paper to

---

### 2. Deep-Read the Paper

Extract from the **actual paper text** (not summaries):

**Overview**
- Core problem being solved (1-2 sentences, from abstract/intro)
- Main insight / key idea (1 sentence)
- Main result / contribution with exact numbers

**Method — equations**
- Copy each key equation verbatim from the source, noting the equation number and section
- Define every variable from the paper's own notation
- If an equation is not in the paper but derived for explanation, label it "(schematic)"

**Algorithms**
- Copy algorithm pseudocode verbatim (steps, variable names, comments)
- These are high-value content for animations

**Results**
- Use the exact numbers from the paper's tables — never round or paraphrase numbers
- Note which table/figure each number comes from

**Figures**
- Note which figures are most important (architecture diagram, main results chart)
- Check the assets directory and arXiv HTML for embeddable URLs

---

### 3. Formula Verifier (Required for every equation)

Before adding any `<Math display>` block:
1. Find the equation in the fetched paper HTML/PDF
2. Copy the LaTeX verbatim — do NOT reconstruct from description
3. In the `label` prop, include the equation/section reference: `"Eq. (3), §3.2 — GRPO advantage"`
4. If the exact equation is not in the source, label it: `"(schematic — not verbatim from paper)"`

**Common failure mode from this project:** the mHC formula was written from memory as a Frobenius-norm constraint, but the actual paper (arXiv 2512.24880) uses a Birkhoff polytope (doubly stochastic matrix) constraint enforced by Sinkhorn-Knopp. Always fetch and read.

---

### 4. Figure Embedding (Required — prioritise official figures)

For each key figure, check sources in this order:

1. **HuggingFace `assets/` directory** — `https://huggingface.co/<org>/<model>/tree/main/assets`
   - Embed as: `https://huggingface.co/<org>/<model>/resolve/main/assets/<filename>`
2. **arXiv HTML** — `https://arxiv.org/html/<id>`, look for `<img>` tags
   - Embed directly with the arXiv URL
3. **arXiv figure pattern** — try `https://arxiv.org/html/<id>/x1.png`, `x2.png`, etc.

**If no official URL is found:** use `FlowChart` component or prose. Never embed a broken `<img>`.

Always add a caption:
```tsx
<img src="..." alt="Figure N: ..." className="w-full rounded-lg my-4 border border-paper-200 dark:border-slate-700" />
<p className="text-xs text-paper-800/50 dark:text-slate-500 text-center -mt-2 mb-6">
  {t("Figure N from [paper] — ...", "来自 [论文] 的图 N — ...")}
</p>
```

**Always include:** the main benchmark/results figure (e.g. `dsv4_performance.png`) and the architecture diagram.

---

### 5. Interactive Widgets (Required)

Every paper page MUST have at least one interactive widget. Create a new `.tsx` file in `src/components/widgets/` for anything that benefits from animation:

| Paper content | Widget type |
|---|---|
| Algorithm pseudocode | Step-through visualizer (like `MuonOptimizerViz`) |
| Routing / selection mechanism | Click-to-route animation (like `MoERoutingViz`) |
| Before/after comparison (e.g. KV cache) | Slider with bar chart (like `KVCacheViz`) |
| Training process | Step-through with concrete numbers |
| Attention pattern | Grid heatmap with token selection |
| Diffusion / masking | Token reveal/mask animation (like `MaskDiffusionViz`) |

Widget rules:
- `"use client"` + `useState` — always interactive, never static
- Bilingual via `useLang()` + `t(en, zh)` on every string
- Include a ▶ Animate / Step Through button
- Highlight the key innovation in amber

---

### 6. Add metadata to `src/lib/papers.ts`

```ts
{
  slug: "<slug>",
  title: "<English title>",
  authors: "<Last et al.>",
  year: <year>,
  venue: "<ICML 2024 / arXiv / NeurIPS 2023 / ...>",
  tags: ["<tag1>", "<tag2>", "<tag3>"],   // 2–4 tags
  description: "<2–3 sentence description>",
  arxiv: "https://arxiv.org/abs/<id>",  // or HuggingFace URL if no arXiv
}
```

---

### 7. Create `src/app/papers/<slug>/page.tsx`

```tsx
"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { <WidgetName> } from "@/components/widgets/<WidgetName>";
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
        <p className="text-paper-800/50 dark:text-slate-400">
          <Authors> &middot; <Venue Year> &middot;{" "}
          <a href="<url>" target="_blank" rel="noopener noreferrer"
             className="text-blue-600 hover:underline">
            arXiv <id>
          </a>
        </p>
      </header>

      <article className="paper-content">

        {/* TL;DR — only verified facts from paper */}
        <section className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t("<verified 2-4 sentence summary>", "<2-4句经过核实的摘要>")}
          </p>
        </section>

        {/* Official figure — check HuggingFace assets or arXiv HTML first */}
        <img src="<official-url>" alt="Figure N: ..." className="w-full rounded-lg my-4 border border-paper-200 dark:border-slate-700" />
        <p className="text-xs text-paper-800/50 dark:text-slate-500 text-center -mt-2 mb-6">
          {t("Figure N — ...", "图 N — ...")}
        </p>

        {/* FlowChart: evolution / pipeline overview */}
        <FlowChart title={...} steps={[...]} arrows={[...]} highlights={[...]} />

        {/* 1. Background */}
        <h2>{t("1. Background", "1. 背景")}</h2>

        {/* 2. Core Method — equations from paper, verbatim */}
        <h2>{t("2. Core Method", "2. 核心方法")}</h2>
        {/* label MUST include equation number: "Eq. (3), §3.2" */}
        <Math display label={t("Eq. (N) — ...", "公式 (N) — ...")} tex="..." />

        {/* Interactive widget */}
        <WidgetName />

        {/* 3–N. Sections per major contribution */}

        {/* Results — use exact numbers from paper tables */}
        <h2>{t("N. Key Results", "N. 关键结果")}</h2>

        {/* Why It Matters — interpretive, but claims still verified */}
        <h2>{t("N+1. Why It Matters", "N+1. 为什么重要")}</h2>

        {/* Related Papers */}
        <h2>{t("N+2. Related Papers", "N+2. 相关论文")}</h2>

        {/* Resources */}
        <h2>{t("N+3. Additional Resources", "N+3. 补充资源")}</h2>

      </article>
    </div>
  );
}
```

---

### 8. Add to knowledge graph in `src/lib/graph-data.ts`

- Add a paper node (type `"paper"`)
- Connect to existing lab/org nodes
- Add edges to prerequisite and follow-up papers

---

### 9. Verify

```bash
npm run build
# Then grep for any remaining third-party claims:
grep -n "华为\|Huawei\|据报\|reportedly\|~[0-9]" src/app/papers/<slug>/page.tsx
```

Fix any TypeScript errors. Fix any flagged claims with verified data or remove them.

---

## Content Rules (Quick Reference)

| Rule | Detail |
|---|---|
| **Bilingual** | Every string uses `t(en, zh)` — no bare strings anywhere |
| **Math blocks** | `<Math display tex="..." />` — include equation number in label |
| **Inline math** | `<Math tex="h_l" />` — NEVER write `h_l` as plain text in `<p>` |
| **Equations** | Verbatim from source; schematic equations labelled explicitly |
| **Figures** | From HuggingFace assets or arXiv HTML only; FlowChart as fallback |
| **Numbers** | Exact values from paper tables (e.g. `80.6%` not `~81%`) |
| **Hardware/infra** | Only state if explicitly in paper — never infer or guess |
| **Widget** | At least 1 interactive widget per page |
| **TL;DR** | 2-4 sentences, technical precision, all claims verified |
| **Section depth** | 7-10 sections; aim for depth of `lora`, `flashattention` |
| **Source notes** | Add `Source: ...` UI notes for any claim from outside the paper |
| **After writing** | Grep entire file for hallucination markers before committing |
