# PaperTrace

**Interactive deep-dives into ML papers** — formulas + visualizations + walk-through examples.

No hand-waving. Every formula is broken down step by step with real numbers, and every key mechanism has an interactive widget you can poke at.

## Live Site

👉 **[papertrace](https://yourusername.github.io/PaperTrace)**

## What This Is

Each paper gets a full deep-dive page with:

- **Formula breakdowns** — every equation explained term by term, rendered with KaTeX
- **Walk-through examples** — concrete examples with real numbers, not abstract descriptions
- **Interactive widgets** — visualizations you can step through, hover over, and interact with
- **Connections** — how each paper relates to others in its area

## Papers

### Diffusion Language Models (DLLM)

| Paper | Authors | Key Idea |
|-------|---------|----------|
| [LLaDA](papers/llada) | Nie et al. 2025 | Masked diffusion for LLMs — variable masking rate + bidirectional attention |
| [MDLM](papers/mdlm) | Sahoo et al. 2024 | Principled continuous-time ELBO for masked diffusion |
| [Fast DLLM](papers/fast-dllm) | Shi et al. 2025 | Adaptive denoising schedules — 3-10x fewer steps |
| [Block Diffusion](papers/block-diffusion) | Arriola et al. 2025 | AR between blocks + diffusion within blocks |

### Transformer Foundations

| Paper | Authors | Key Idea |
|-------|---------|----------|
| [Attention Is All You Need](papers/attention-is-all-you-need) | Vaswani et al. 2017 | The Transformer architecture |

*More sections coming: Efficient Inference, RLHF & Alignment, Vision-Language Models, ...*

## Tech Stack

- **Next.js 14** with static export for GitHub Pages
- **React** interactive widgets (no heavy chart libraries — just clean custom components)
- **KaTeX** for fast, beautiful math rendering
- **Tailwind CSS** for styling

## Local Development

```bash
git clone https://github.com/yourusername/PaperTrace.git
cd PaperTrace
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a New Paper

1. Add paper metadata to `src/lib/papers.ts`
2. Create a new directory under `src/app/papers/<slug>/`
3. Write `page.tsx` using the existing components:
   - `<Math tex="..." />` for inline math, `<Math display tex="..." />` for display math
   - `<Widget title="...">` to wrap interactive visualizations
   - `<Collapsible title="...">` for expandable walk-throughs
4. Build custom widgets in `src/components/widgets/` as needed

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via GitHub Actions.

To enable: go to your repo **Settings → Pages → Source → GitHub Actions**.

## Contributing

PRs welcome! Especially:

- New paper deep-dives
- Interactive widgets for existing papers
- Corrections to formula explanations
- Translations

## License

MIT
