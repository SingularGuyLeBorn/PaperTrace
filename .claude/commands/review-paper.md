# Review Paper Content

Quality-check a paper breakdown page before it goes live.

## Usage
/review-paper $ARGUMENTS  (pass the paper slug, e.g. `attention-is-all-you-need`)

## Review checklist

### Accuracy
- [ ] All math formulas render correctly (run `npm run build` — KaTeX errors show up as warnings)
- [ ] No fabricated citations — every paper referenced should have a real arXiv/venue link
- [ ] Key equations match the original paper
- [ ] Author names and years are correct

### Code quality
- [ ] No `inline` prop on `<Math>` — only `display` or default
- [ ] No `${basePath}` inside `<Link href="...">` — Next.js adds it automatically
- [ ] No bare JSX text with `{variable}` that TypeScript might misparse (wrap in quotes or strings)
- [ ] TypeScript strict — `npm run build` passes clean

### Content quality
- [ ] TL;DR is 2-4 sentences, accurate, not hand-wavy
- [ ] Every English string has a Chinese translation via `t(en, zh)`
- [ ] Math walkthroughs use real numbers / concrete examples where possible
- [ ] Related papers section links to actual pages on the site (not dead links)
- [ ] `<PaperHeader>` prereqs and related slugs exist in `src/lib/papers.ts`

### Steps
1. Read `src/app/papers/<slug>/page.tsx`
2. Read `src/lib/papers.ts` to verify the metadata entry exists
3. Run `npm run build` and check for errors
4. Cross-check 2-3 key equations against the original paper (use the arXiv link in metadata)
5. Report any issues found with line numbers
