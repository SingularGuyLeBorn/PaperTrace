# Add Paper Breakdown

Add a new interactive paper breakdown page to PaperTrace.

## Steps

1. **Get paper info** from the user (or from $ARGUMENTS):
   - Paper title, authors, year, venue
   - arXiv link
   - Slug (URL-safe, e.g. `attention-is-all-you-need`)
   - Which section it belongs to in `src/lib/papers.ts`

2. **Add metadata** to `src/lib/papers.ts`:
   - Add a `PaperMeta` entry to the correct section's `papers` array
   - Include: slug, title, authors, year, venue, tags (2-4 tags), description (2-3 sentences), arxiv URL

3. **Create the page** at `src/app/papers/<slug>/page.tsx`:
   - Copy structure from a similar existing paper page
   - Must include: `"use client"`, `useLang`, `<PaperHeader>`, TL;DR section
   - All user-facing text uses `t(english, 中文)` — never bare strings
   - Math uses `<Math tex="..." />` (inline) or `<Math display tex="..." />` (block)
   - Collapsible sections use `<Collapsible title={t(...)}>`
   - Key insights use `<KeyInsight>`

4. **Add to knowledge graph** in `src/lib/graph-data.ts`:
   - Add a paper node with the correct lab/author edges
   - Connect to existing lab nodes if the institution already exists

5. **Run build** to verify no TypeScript errors:
   ```
   npm run build
   ```

## Page structure to follow

```
PaperHeader (with prereqs + related papers)
↓
TL;DR section
↓
Background / Motivation
↓
Core Method (with Math + diagrams)
↓
Key Results
↓
Why It Matters / Connections
↓
Resources (arXiv link, etc.)
```

## Quality checklist
- [ ] No `inline` prop on `<Math>` — use `display` or leave as default (inline)
- [ ] No `${basePath}` in `<Link>` hrefs — Next.js adds it automatically
- [ ] Chinese translation for every English string
- [ ] Build passes with `npm run build`

## Next step: generate the 精读 page

After adding metadata and registering the slug, run:

```
/deep-dive <slug-or-arxiv-url>
```

This generates the full interactive deep-dive page at `src/app/papers/<slug>/page.tsx`.
