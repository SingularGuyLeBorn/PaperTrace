# PaperTrace — Product Overview

## What is PaperTrace?

PaperTrace is a bilingual (EN/ZH) web resource hub for ML/AI learners and practitioners. It curates high-quality content for people studying machine learning, reading papers, prepping for AI research/engineering roles, and navigating the job hunt.

## Target Audience

- Chinese ML/AI students and practitioners (both domestic and overseas, especially US)
- People studying for ML research or SWE roles at AI labs
- Early-career researchers reading LLM/diffusion papers
- Job-seekers targeting Chinese and US AI companies

## Core Pages

| Page | Purpose |
|------|---------|
| `/` | Landing page |
| `/papers/*` | Interactive paper breakdowns (Transformer, LoRA, LLaDA, Block Diffusion, FlashAttention, etc.) |
| `/resources` | Curated learning resources (YouTube, Bilibili, newsletters, blogs, tools) |
| `/interview` | 找工 hub: LeetCode resources, job openings (US+China), ML 八股 Q&A |
| `/interview/notes` | Motivational essay: timing, information, connection, mindset |
| `/guide` | Study guide |
| `/timeline` | AI/ML timeline |
| `/daily` | Daily content |

## Tech Stack

- **Framework**: Next.js (App Router), TypeScript
- **Styling**: Tailwind CSS
- **Math**: KaTeX via custom `<Math>` component
- **i18n**: Custom `useLang()` hook with `t(en, zh)` inline bilingual pattern
- **Deployment**: Static export to GitHub Pages (`/PaperTrace` base path in production)
- **Dark mode**: Supported throughout

## Key Conventions

- All user-facing text uses `t(english, 中文)` — never add strings outside this pattern
- `basePath`: `process.env.NODE_ENV === "production" ? "/PaperTrace" : ""`
- Paper pages follow a consistent structure: TL;DR → sections with Math + Collapsible → resources
- Interview page sections use `SectionHeader` component with number + color
- Resource cards are `<a>` tags with consistent hover/border styling

## Product Direction

Building a one-stop resource for the Chinese ML community — especially students navigating US/China job markets. Emphasis on depth over breadth, bilingual accessibility, and community (the "小社群" spirit from the job hunt notes).
