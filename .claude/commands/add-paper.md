# Add Paper Breakdown

Add a new paper entry to PaperTrace (metadata + daily feed entry). For the full interactive deep-dive page, run `/deep-dive` afterwards.

## ⛔ Anti-Hallucination (applies to all content)

- **Only use the paper's own abstract and official sources** for `why`, `whyZh`, and `description`
- Numbers in `why` must come from the abstract directly — never from search results or blog posts
- If a paper has no arXiv ID (e.g. HuggingFace technical report), use `paperUrl` instead of `arxivId`

---

## Steps

### 1. Get paper info (from user or $ARGUMENTS)

- Title, authors, year, venue
- arXiv URL — or HuggingFace model page if no arXiv
- Slug (URL-safe, e.g. `attention-is-all-you-need`)
- Which section in `src/lib/papers.ts` (show existing sections to user)

### 2. Fetch the abstract

```
https://arxiv.org/abs/<id>    ← get title, authors, abstract text
```

For HuggingFace releases, also fetch:
```
https://huggingface.co/<org>/<model>/blob/main/README.md
```

### 3. Add metadata to `src/lib/papers.ts`

```ts
{
  slug: "<slug>",
  title: "<English title — verbatim from paper>",
  authors: "<Last et al.>",
  year: <year>,
  venue: "<arXiv / NeurIPS 2024 / ICML 2025 / ...>",
  tags: ["<tag1>", "<tag2>"],   // 2–4 tags
  description: "<2–3 sentences from abstract, not paraphrased from blogs>",
  arxiv: "https://arxiv.org/abs/<id>",  // or HuggingFace URL
}
```

### 4. Add entry to `src/lib/daily.ts`

Add to the **top** of `dailyPapers`:

```ts
{
  date: "YYYY-MM-DD",
  title: "<English title>",
  titleZh: "<中文标题>",
  authors: "<First Author et al.>",
  arxivId: "<XXXX.XXXXX>",   // leave empty string "" if no arXiv; use paperUrl instead
  paperUrl: "<url>",          // for non-arXiv papers (HuggingFace, etc.)
  tags: ["Tag1", "Tag2"],
  why: "<≤25 words — from abstract only>",
  whyZh: "<≤30字 — 同格式>",
  pick: true,                 // max 1 pick at a time
  slug: "<slug>",             // only if deep-dive page exists
}
```

### 5. Add to knowledge graph `src/lib/graph-data.ts`

```ts
// In paperNodes array:
{
  id: "paper-<slug>",
  type: "paper",
  label: "<Short title>",
  labelZh: "<中文短标题>",
  slug: "<slug>",
  year: <year>,
  category: "nlp" | "efficiency" | "rl" | "diffusion" | "vision",
  color: categoryColors.<category>,
},

// In kgEdges array:
{ source: "paper-<slug>", target: "lab-<lab>", type: "wrote" },
{ source: "paper-<slug>", target: "paper-<related>", type: "related" },
```

### 6. Verify

```bash
npm run build
```

---

## Quality Checklist

- [ ] `why` / `whyZh` numbers come from abstract, not web search
- [ ] No `inline` prop on `<Math>` components
- [ ] No `${basePath}` in `<Link>` hrefs
- [ ] Every English string has a Chinese translation via `t(en, zh)`
- [ ] Build passes

## Next Step

```
/deep-dive <slug-or-arxiv-url>
```

Generates the full interactive 精读 page with equations, widgets, and figures.
