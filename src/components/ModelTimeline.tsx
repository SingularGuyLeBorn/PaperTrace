"use client";
import { useLang } from "@/lib/i18n";

interface ModelRelease {
  date: string; // YYYY-MM
  name: string;
  org: string;
  params: string;
  highlight?: string;
  highlightZh?: string;
  color: "blue" | "green" | "purple" | "orange" | "teal" | "rose";
  type: "open" | "closed";
}

const releases: ModelRelease[] = [
  { date: "2017-06", name: "Transformer", org: "Google", params: "-", highlight: "Attention Is All You Need — self-attention replaces RNNs", highlightZh: "自注意力取代 RNN，开创 Transformer 时代", color: "blue", type: "open" },
  { date: "2018-10", name: "BERT", org: "Google", params: "340M", highlight: "Bidirectional pre-training, GLUE SOTA", highlightZh: "双向预训练，GLUE 全面刷榜", color: "blue", type: "open" },
  { date: "2019-02", name: "GPT-2", org: "OpenAI", params: "1.5B", highlight: "Zero-shot task transfer, 'too dangerous to release'", highlightZh: "零样本任务迁移，「太危险不公开」", color: "green", type: "open" },
  { date: "2020-05", name: "GPT-3", org: "OpenAI", params: "175B", highlight: "Few-shot in-context learning at scale", highlightZh: "大规模少样本上下文学习", color: "green", type: "closed" },
  { date: "2021-01", name: "CLIP", org: "OpenAI", params: "400M", highlight: "Image-text contrastive learning, zero-shot ImageNet", highlightZh: "图文对比学习，零样本 ImageNet", color: "purple", type: "open" },
  { date: "2022-03", name: "InstructGPT", org: "OpenAI", params: "175B", highlight: "RLHF alignment — precursor to ChatGPT", highlightZh: "RLHF 对齐 — ChatGPT 前身", color: "green", type: "closed" },
  { date: "2022-11", name: "ChatGPT", org: "OpenAI", params: "~175B", highlight: "100M users in 2 months — mainstream AI moment", highlightZh: "2 个月 1 亿用户 — AI 进入大众视野", color: "green", type: "closed" },
  { date: "2023-02", name: "LLaMA 1", org: "Meta", params: "65B", highlight: "Open-weights LLM enabling community research", highlightZh: "开放权重 LLM，推动社区研究", color: "orange", type: "open" },
  { date: "2023-03", name: "GPT-4", org: "OpenAI", params: "~1.8T?", highlight: "Multimodal, passes bar exam, massive capability jump", highlightZh: "多模态，通过律师资格考试，能力大幅跃升", color: "green", type: "closed" },
  { date: "2023-04", name: "LLaVA", org: "Wisconsin/Columbia", params: "13B", highlight: "Simple CLIP+LLaMA instruction tuning VLM", highlightZh: "简洁的 CLIP+LLaMA 指令微调 VLM", color: "blue", type: "open" },
  { date: "2023-07", name: "LLaMA 2", org: "Meta", params: "70B", highlight: "Commercial license, chat fine-tuned", highlightZh: "商用许可，指令微调版本", color: "orange", type: "open" },
  { date: "2023-09", name: "Mistral 7B", org: "Mistral AI", params: "7B", highlight: "Grouped query attention + sliding window, beats LLaMA 2 13B", highlightZh: "分组查询注意力 + 滑动窗口，超越 LLaMA 2 13B", color: "teal", type: "open" },
  { date: "2023-12", name: "Gemini 1.0", org: "Google", params: "Ultra", highlight: "Native multimodal, first credible GPT-4 competitor", highlightZh: "原生多模态，首个可与 GPT-4 媲美的竞争对手", color: "blue", type: "closed" },
  { date: "2024-01", name: "DeepSeek-V2", org: "DeepSeek", params: "236B MoE", highlight: "MLA + DeepSeekMoE — cheaper than dense models", highlightZh: "MLA + DeepSeekMoE — 比稠密模型更便宜", color: "rose", type: "open" },
  { date: "2024-04", name: "LLaMA 3", org: "Meta", params: "70B/405B", highlight: "Best open-weight model, competitive with GPT-4 Turbo", highlightZh: "最强开源模型，可与 GPT-4 Turbo 竞争", color: "orange", type: "open" },
  { date: "2024-05", name: "Qwen2", org: "Alibaba", params: "72B", highlight: "Strong multilingual model, excellent Chinese performance", highlightZh: "强大的多语言模型，中文表现卓越", color: "teal", type: "open" },
  { date: "2024-06", name: "Claude 3.5 Sonnet", org: "Anthropic", params: "?", highlight: "Best coding model at launch, outperforms GPT-4o on most benchmarks", highlightZh: "发布时最强代码模型，多数基准超越 GPT-4o", color: "purple", type: "closed" },
  { date: "2025-01", name: "DeepSeek-R1", org: "DeepSeek", params: "671B MoE", highlight: "o1-level reasoning via RL, fully open-weights, shocked the market", highlightZh: "通过 RL 实现 o1 级推理，完全开放权重，震撼业界", color: "rose", type: "open" },
  { date: "2025-01", name: "Kimi k1.5", org: "Moonshot AI", params: "?", highlight: "Long-context + RL reasoning, strong Chinese multimodal model", highlightZh: "长上下文 + RL 推理，强大的中文多模态模型", color: "teal", type: "closed" },
  { date: "2025-02", name: "Gemini 2.0 Flash", org: "Google", params: "?", highlight: "Fastest Gemini yet, native tool use, multimodal", highlightZh: "最快 Gemini，原生工具调用，多模态", color: "blue", type: "closed" },
  { date: "2025-04", name: "Qwen3", org: "Alibaba", params: "235B MoE", highlight: "Thinking mode toggle, top open-source reasoning", highlightZh: "可切换思考模式，顶级开源推理模型", color: "teal", type: "open" },
  { date: "2025-04", name: "Claude Opus 4", org: "Anthropic", params: "?", highlight: "Extended thinking, used in Claude Code — the model writing this page", highlightZh: "扩展思考模式，用于 Claude Code — 正在编写本页面的模型", color: "purple", type: "closed" },
];

const colorDot: Record<ModelRelease["color"], string> = {
  blue:   "bg-blue-500",
  green:  "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  teal:   "bg-teal-500",
  rose:   "bg-rose-500",
};

const colorText: Record<ModelRelease["color"], string> = {
  blue:   "text-blue-700",
  green:  "text-green-700",
  purple: "text-purple-700",
  orange: "text-orange-700",
  teal:   "text-teal-700",
  rose:   "text-rose-700",
};

const colorBg: Record<ModelRelease["color"], string> = {
  blue:   "bg-blue-50",
  green:  "bg-green-50",
  purple: "bg-purple-50",
  orange: "bg-orange-50",
  teal:   "bg-teal-50",
  rose:   "bg-rose-50",
};

export function ModelTimeline() {
  const { t, lang } = useLang();

  // Group by year
  const byYear = releases.reduce<Record<string, ModelRelease[]>>((acc, r) => {
    const year = r.date.slice(0, 4);
    if (!acc[year]) acc[year] = [];
    acc[year].push(r);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => Number(a) - Number(b));

  const formatDate = (ym: string) => {
    const [, m] = ym.split("-");
    const months = lang === "en"
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    return months[parseInt(m) - 1];
  };

  return (
    <section className="pb-16">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">
          {t("LLM Timeline", "大模型时间线")}
        </h2>
        <p className="text-sm text-paper-800/50 mt-1">
          {t(
            "Major model releases from Transformer (2017) to today. 🔓 open-weights · 🔒 closed/API-only.",
            "从 Transformer (2017) 到今天的重要模型发布。🔓 开放权重 · 🔒 闭源/仅 API。"
          )}
        </p>
      </div>

      <div className="bg-white border border-paper-200 rounded-xl p-6 space-y-6">
        {years.map((year) => (
          <div key={year}>
            {/* Year label */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-paper-800/30 w-10">
                {year}
              </span>
              <div className="flex-1 h-px bg-paper-100" />
            </div>

            {/* Entries for this year */}
            <div className="space-y-2 ml-12">
              {byYear[year].map((r, i) => (
                <div key={`${r.name}-${i}`} className="flex items-start gap-3 group">
                  {/* Date badge */}
                  <span className="text-xs text-paper-800/40 w-8 flex-shrink-0 pt-0.5 font-mono">
                    {formatDate(r.date)}
                  </span>

                  {/* Color dot */}
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${colorDot[r.color]}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${colorText[r.color]}`}>
                        {r.name}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${colorBg[r.color]} ${colorText[r.color]} font-medium`}>
                        {r.org}
                      </span>
                      {r.params !== "-" && (
                        <span className="text-xs text-paper-800/40 font-mono">
                          {r.params}
                        </span>
                      )}
                      <span
                        className="text-xs"
                        title={r.type === "open" ? (lang === "en" ? "Open weights" : "开放权重") : (lang === "en" ? "Closed / API only" : "闭源 / 仅 API")}
                      >
                        {r.type === "open" ? "🔓" : "🔒"}
                      </span>
                    </div>
                    {(r.highlight || r.highlightZh) && (
                      <p className="text-xs text-paper-800/60 mt-0.5 leading-relaxed">
                        {lang === "en" ? r.highlight : (r.highlightZh ?? r.highlight)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
