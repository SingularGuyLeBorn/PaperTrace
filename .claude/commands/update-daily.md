# Update Daily Feed

Add new papers or news items to the daily feed at `src/app/daily/page.tsx`.

## What this page contains

- **Papers**: recent arXiv/conference papers worth reading
- **News & Events**: industry news, model releases, job market updates

## Steps

1. **Identify content** from $ARGUMENTS or ask the user:
   - Paper title, authors, date, arXiv link, 1-sentence summary
   - OR news item: title, date, source URL, summary

2. **Read the current file** to understand the data structure:
   ```
   Read src/app/daily/page.tsx
   ```

3. **Add the entry** to the top of the relevant array (newest first):

   For papers:
   ```ts
   {
     title: "Paper Title",
     authors: "Author et al.",
     date: "2025-MM-DD",
     summary: "One sentence in English.",
     summaryZh: "一句话中文摘要。",
     tags: ["Tag1", "Tag2"],
     arxiv: "https://arxiv.org/abs/XXXX.XXXXX",
     slug: "slug-if-we-have-a-breakdown",  // optional
   }
   ```

   For news:
   ```ts
   {
     title: "News headline",
     titleZh: "中文标题",
     date: "2025-MM-DD",
     source: "Source Name",
     sourceUrl: "https://...",
     summary: "One sentence.",
     summaryZh: "一句话中文。",
   }
   ```

4. **Check the build**:
   ```
   npm run build
   ```

## Guidelines
- Dates in `YYYY-MM-DD` format
- Tags should reuse existing tags where possible (check what tags are already used)
- Summaries should be 1-2 sentences max — readers can follow the link for details
- Both English and Chinese summaries required
- If a paper has a full breakdown on the site, link it via `slug`
