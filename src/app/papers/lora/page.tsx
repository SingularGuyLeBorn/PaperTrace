"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function LoraPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "LoRA: Low-Rank Adaptation of Large Language Models",
            "LoRA: 大语言模型的低秩适配"
          )}
        </h1>
        <p className="text-paper-800/50">
          Hu et al. &middot; ICLR 2022 &middot;{" "}
          <a
            href="https://arxiv.org/abs/2106.09685"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 2106.09685
          </a>
        </p>
      </header>

      <article className="paper-content">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "LoRA freezes all pre-trained model weights and adds trainable low-rank decomposition matrices to each Transformer layer. For a weight matrix W \u2208 R^{d\u00d7k}, instead of updating W directly, it learns \u0394W = BA where B \u2208 R^{d\u00d7r} and A \u2208 R^{r\u00d7k} with rank r \u226a min(d,k). This reduces trainable parameters by 10,000\u00d7 while matching full fine-tuning performance.",
              "LoRA \u51bb\u7ed3\u6240\u6709\u9884\u8bad\u7ec3\u6a21\u578b\u6743\u91cd\uff0c\u5e76\u5728\u6bcf\u4e2a Transformer \u5c42\u6dfb\u52a0\u53ef\u8bad\u7ec3\u7684\u4f4e\u79e9\u5206\u89e3\u77e9\u9635\u3002\u5bf9\u4e8e\u6743\u91cd\u77e9\u9635 W \u2208 R^{d\u00d7k}\uff0c\u4e0d\u76f4\u63a5\u66f4\u65b0 W\uff0c\u800c\u662f\u5b66\u4e60 \u0394W = BA\uff0c\u5176\u4e2d B \u2208 R^{d\u00d7r}\uff0cA \u2208 R^{r\u00d7k}\uff0c\u79e9 r \u226a min(d,k)\u3002\u8fd9\u5c06\u53ef\u8bad\u7ec3\u53c2\u6570\u51cf\u5c11\u4e8610,000\u500d\uff0c\u540c\u65f6\u4fdd\u6301\u4e0e\u5168\u91cf\u5fae\u8c03\u76f8\u5f53\u7684\u6027\u80fd\u3002"
            )}
          </p>
        </section>

        <FlowChart
          title={t("LoRA Method Overview", "LoRA \u65b9\u6cd5\u603b\u89c8")}
          steps={[
            {
              title: t(
                "Problem: Full fine-tuning large LLMs requires updating all 175B params",
                "\u95ee\u9898\uff1a\u5168\u91cf\u5fae\u8c03\u5927\u578b LLM \u9700\u8981\u66f4\u65b0\u6240\u6709 175B \u53c2\u6570"
              ),
              color: "rose",
            },
            {
              title: t(
                "Observation: Fine-tuned weight changes \u0394W have low intrinsic rank",
                "\u89c2\u5bdf\uff1a\u5fae\u8c03\u6743\u91cd\u53d8\u5316 \u0394W \u5177\u6709\u4f4e\u672c\u5f81\u79e9"
              ),
              color: "amber",
            },
            {
              title: t(
                "LoRA: Freeze W_0, learn \u0394W = BA with small rank r",
                "LoRA\uff1a\u51bb\u7ed3 W_0\uff0c\u7528\u5c0f\u79e9 r \u5b66\u4e60 \u0394W = BA"
              ),
              color: "blue",
              children: [
                {
                  title: t(
                    "A: R^{r\u00d7k}, random Gaussian init",
                    "A\uff1aR^{r\u00d7k}\uff0c\u968f\u673a\u9ad8\u65af\u521d\u59cb\u5316"
                  ),
                  color: "gray",
                },
                {
                  title: t(
                    "B: R^{d\u00d7r}, zero init (so \u0394W=0 at start)",
                    "B\uff1aR^{d\u00d7r}\uff0c\u96f6\u521d\u59cb\u5316\uff08\u4f7f\u5f00\u59cb\u65f6 \u0394W=0\uff09"
                  ),
                  color: "gray",
                },
              ],
            },
            {
              title: t(
                "Forward pass: h = W_0 x + (\u03b1/r) BAx",
                "\u524d\u5411\u4f20\u64ad\uff1ah = W_0 x + (\u03b1/r) BAx"
              ),
              color: "teal",
            },
            {
              title: t(
                "At inference: merge W = W_0 + BA \u2014 no extra latency!",
                "\u63a8\u7406\u65f6\uff1a\u5408\u5e76 W = W_0 + BA \u2014 \u65e0\u989d\u5916\u5ef6\u8fdf\uff01"
              ),
              color: "purple",
            },
            {
              title: t(
                "Applied to: Q, K, V, output projection in attention layers",
                "\u5e94\u7528\u4e8e\uff1a\u6ce8\u610f\u529b\u5c42\u7684 Q\u3001K\u3001V\u3001\u8f93\u51fa\u6295\u5f71"
              ),
              color: "green",
            },
            {
              title: t(
                "Result: GPT-3 175B: 10,000\u00d7 fewer params, same BLEU on WMT",
                "\u7ed3\u679c\uff1aGPT-3 175B\uff1a\u53c2\u6570\u51cf\u5c11 10,000 \u500d\uff0cWMT \u4e0a BLEU \u76f8\u540c"
              ),
              color: "green",
            },
          ]}
          arrows={[
            t("Motivates", "\u542f\u53d1"),
            t("Core insight", "\u6838\u5fc3\u6d1e\u5bdf"),
            t("Implementation", "\u5b9e\u73b0"),
            t("Forward pass", "\u524d\u5411\u4f20\u64ad"),
            t("Where applied", "\u5e94\u7528\u4f4d\u7f6e"),
            t("Outcome", "\u7ed3\u679c"),
          ]}
          highlights={[
            {
              text: t("Zero extra inference latency", "\u96f6\u989d\u5916\u63a8\u7406\u5ef6\u8fdf"),
              color: "green",
            },
            {
              text: t("10,000\u00d7 parameter reduction", "\u53c2\u6570\u51cf\u5c1110,000\u500d"),
              color: "blue",
            },
            {
              text: t("Exact same architecture at inference", "\u63a8\u7406\u65f6\u67b6\u6784\u5b8c\u5168\u76f8\u540c"),
              color: "purple",
            },
          ]}
        />

        {/* ============ Background ============ */}
        <h2>{t("1. Background: The Fine-Tuning Problem", "1. \u80cc\u666f\uff1a\u5fae\u8c03\u95ee\u9898")}</h2>

        <p>
          {t(
            "Large pre-trained language models like GPT-3 (175B parameters) achieve state-of-the-art performance across many tasks. However, fully fine-tuning all parameters for each downstream task is prohibitively expensive: it requires updating and storing a separate copy of all 175B parameters per task.",
            "\u5927\u578b\u9884\u8bad\u7ec3\u8bed\u8a00\u6a21\u578b\uff08\u5982 GPT-3\uff0c175B \u53c2\u6570\uff09\u5728\u5f88\u591a\u4efb\u52a1\u4e0a\u8fbe\u5230\u4e86\u6700\u5148\u8fdb\u7684\u6027\u80fd\u3002\u7136\u800c\uff0c\u5bf9\u6bcf\u4e2a\u4e0b\u6e38\u4efb\u52a1\u8fdb\u884c\u5168\u91cf\u5fae\u8c03\u975e\u5e38\u6602\u8d35\uff1a\u6bcf\u4e2a\u4efb\u52a1\u9700\u8981\u66f4\u65b0\u5e76\u5b58\u50a8\u6240\u6709 175B \u53c2\u6570\u7684\u72ec\u7acb\u526f\u672c\u3002"
          )}
        </p>

        <p>
          {t(
            "Prior adapter-based approaches insert small bottleneck layers inside each Transformer block. While parameter-efficient, adapters add sequential computation and thus increase inference latency. LoRA solves this by learning weight updates that can be merged back into the base weights at inference time.",
            "\u4e4b\u524d\u57fa\u4e8e\u9002\u914d\u5668\u7684\u65b9\u6cd5\u5728\u6bcf\u4e2a Transformer \u5757\u5185\u63d2\u5165\u5c0f\u578b\u74f6\u9888\u5c42\u3002\u867d\u7136\u53c2\u6570\u6709\u6548\uff0c\u4f46\u9002\u914d\u5668\u589e\u52a0\u4e86\u987a\u5e8f\u8ba1\u7b97\uff0c\u56e0\u6b64\u4f1a\u589e\u52a0\u63a8\u7406\u5ef6\u8fdf\u3002LoRA \u901a\u8fc7\u5b66\u4e60\u53ef\u5728\u63a8\u7406\u65f6\u5408\u5e76\u56de\u57fa\u7840\u6743\u91cd\u7684\u6743\u91cd\u66f4\u65b0\u6765\u89e3\u51b3\u8fd9\u4e2a\u95ee\u9898\u3002"
          )}
        </p>

        {/* ============ Core Method ============ */}
        <h2>{t("2. Core Method: Low-Rank Decomposition", "2. \u6838\u5fc3\u65b9\u6cd5\uff1a\u4f4e\u79e9\u5206\u89e3")}</h2>

        <p>
          {t(
            "For a pre-trained weight matrix W_0 \u2208 R^{d\u00d7k}, LoRA constrains weight updates to a low-rank decomposition:",
            "\u5bf9\u4e8e\u9884\u8bad\u7ec3\u6743\u91cd\u77e9\u9635 W_0 \u2208 R^{d\u00d7k}\uff0cLoRA \u5c06\u6743\u91cd\u66f4\u65b0\u9650\u5236\u4e3a\u4f4e\u79e9\u5206\u89e3\uff1a"
          )}
        </p>

        <Math
          display
          label={t("LoRA weight decomposition", "LoRA \u6743\u91cd\u5206\u89e3")}
          tex="\Delta W = BA, \quad B \in \mathbb{R}^{d \times r}, \; A \in \mathbb{R}^{r \times k}, \quad r \ll \min(d, k)"
        />

        <p>
          {t(
            "The modified forward pass adds the low-rank update to the frozen pre-trained weights:",
            "\u4fee\u6539\u540e\u7684\u524d\u5411\u4f20\u64ad\u5c06\u4f4e\u79e9\u66f4\u65b0\u6dfb\u52a0\u5230\u51bb\u7ed3\u7684\u9884\u8bad\u7ec3\u6743\u91cd\u4e0a\uff1a"
          )}
        </p>

        <Math
          display
          label={t("Modified forward pass", "\u4fee\u6539\u540e\u7684\u524d\u5411\u4f20\u64ad")}
          tex="h = W_0 x + \frac{\alpha}{r} \Delta W x = W_0 x + \frac{\alpha}{r} BA x"
        />

        <Collapsible
          title={t("Variable-by-variable breakdown", "\u9010\u53d8\u91cf\u62c6\u89e3")}
          defaultOpen
        >
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-2">
              <Math tex="W_0" />
              <span>
                {t(
                  "Frozen pre-trained weight matrix — never updated during fine-tuning",
                  "\u51bb\u7ed3\u7684\u9884\u8bad\u7ec3\u6743\u91cd\u77e9\u9635 \u2014 \u5fae\u8c03\u671f\u95f4\u4ece\u4e0d\u66f4\u65b0"
                )}
              </span>

              <Math tex="B \in \mathbb{R}^{d \times r}" />
              <span>
                {t(
                  "Left factor — initialized to zero so \u0394W = BA = 0 at the start of training",
                  "\u5de6\u56e0\u5b50 \u2014 \u521d\u59cb\u5316\u4e3a\u96f6\uff0c\u4f7f\u8bad\u7ec3\u5f00\u59cb\u65f6 \u0394W = BA = 0"
                )}
              </span>

              <Math tex="A \in \mathbb{R}^{r \times k}" />
              <span>
                {t(
                  "Right factor — initialized with random Gaussian; provides diversity in directions",
                  "\u53f3\u56e0\u5b50 \u2014 \u7528\u968f\u673a\u9ad8\u65af\u521d\u59cb\u5316\uff1b\u63d0\u4f9b\u65b9\u5411\u591a\u6837\u6027"
                )}
              </span>

              <Math tex="r" />
              <span>
                {t(
                  "Rank hyperparameter — controls capacity of adaptation. Typically r \u2208 {1, 2, 4, 8}",
                  "\u79e9\u8d85\u53c2\u6570 \u2014 \u63a7\u5236\u9002\u914d\u80fd\u529b\u3002\u901a\u5e38 r \u2208 {1, 2, 4, 8}"
                )}
              </span>

              <Math tex="\alpha" />
              <span>
                {t(
                  "Fixed scaling constant (often set to r, so \u03b1/r = 1). Decouples scale from rank choice, making learning rate easier to tune across different ranks.",
                  "\u56fa\u5b9a\u7f29\u653e\u5e38\u6570\uff08\u901a\u5e38\u8bbe\u4e3a r\uff0c\u6240\u4ee5 \u03b1/r = 1\uff09\u3002\u5c06\u7f29\u653e\u4e0e\u79e9\u9009\u62e9\u89e3\u8026\uff0c\u4f7f\u5b66\u4e60\u7387\u5728\u4e0d\u540c\u79e9\u4e0b\u66f4\u5bb9\u6613\u8c03\u6574\u3002"
                )}
              </span>
            </div>
          </div>
        </Collapsible>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Why zero-initialize B?", "\u4e3a\u4ec0\u4e48\u5c06 B \u521d\u59cb\u5316\u4e3a\u96f6\uff1f")}</strong>{" "}
            {t(
              "At the start of training, \u0394W = BA = 0 \u00d7 A = 0, so the modified model is identical to the pre-trained model. Training starts from a clean slate: the same starting point as if we had not added LoRA at all. If we initialized both A and B randomly, the initial forward pass would be perturbed.",
              "\u5728\u8bad\u7ec3\u5f00\u59cb\u65f6\uff0c\u0394W = BA = 0 \u00d7 A = 0\uff0c\u56e0\u6b64\u4fee\u6539\u540e\u7684\u6a21\u578b\u4e0e\u9884\u8bad\u7ec3\u6a21\u578b\u5b8c\u5168\u76f8\u540c\u3002\u8bad\u7ec3\u4ece\u5e72\u51c0\u7684\u72b6\u6001\u5f00\u59cb\uff1a\u5c31\u597d\u50cf\u6839\u672c\u6ca1\u6709\u6dfb\u52a0 LoRA \u4e00\u6837\u3002\u5982\u679c A \u548c B \u90fd\u968f\u673a\u521d\u59cb\u5316\uff0c\u521d\u59cb\u524d\u5411\u4f20\u64ad\u5c06\u4f1a\u53d7\u5230\u6270\u52a8\u3002"
            )}
          </p>
        </div>

        {/* ============ Concrete Example ============ */}
        <h2>
          {t(
            "3. Concrete Example: GPT-3 Parameter Savings",
            "3. \u5177\u4f53\u793a\u4f8b\uff1aGPT-3 \u53c2\u6570\u8282\u7701"
          )}
        </h2>

        <p>
          {t(
            "GPT-3 has attention weight matrices of dimension d = 12288 for the query projection. Here is the parameter count comparison:",
            "GPT-3 \u7684\u67e5\u8be2\u6295\u5f71\u6ce8\u610f\u529b\u6743\u91cd\u77e9\u9635\u7ef4\u5ea6\u4e3a d = 12288\u3002\u4ee5\u4e0b\u662f\u53c2\u6570\u6570\u91cf\u5bf9\u6bd4\uff1a"
          )}
        </p>

        <Collapsible
          title={t(
            "GPT-3 single attention matrix: full fine-tune vs LoRA r=4",
            "GPT-3 \u5355\u4e2a\u6ce8\u610f\u529b\u77e9\u9635\uff1a\u5168\u91cf\u5fae\u8c03 vs LoRA r=4"
          )}
          defaultOpen
        >
          <div className="text-sm space-y-3">
            <div className="p-3 bg-red-50 rounded border border-red-200">
              <strong>{t("Full fine-tune:", "\u5168\u91cf\u5fae\u8c03\uff1a")}</strong>
              <div className="font-mono text-xs mt-1">
                W_0: 12288 &times; 12288 = 150,994,944 {t("parameters", "\u53c2\u6570")}
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <strong>{t("LoRA r=4:", "LoRA r=4\uff1a")}</strong>
              <div className="font-mono text-xs mt-1 space-y-1">
                <div>A: 4 &times; 12288 = 49,152 {t("params", "\u53c2\u6570")}</div>
                <div>B: 12288 &times; 4 = 49,152 {t("params", "\u53c2\u6570")}</div>
                <div>
                  <strong>{t("Total: 98,304 params", "\u603b\u8ba1\uff1a98,304 \u53c2\u6570")}</strong>
                </div>
                <div className="text-green-800">
                  {t(
                    "Reduction: 150,994,944 / 98,304 = 1,536\u00d7 for this single matrix",
                    "\u51cf\u5c11\u6bd4\uff1a150,994,944 / 98,304 = 1,536\u00d7\uff08\u4ec5\u8fd9\u4e00\u4e2a\u77e9\u9635\uff09"
                  )}
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <strong>{t("GPT-3 total (r=4):", "GPT-3 \u603b\u8ba1\uff08r=4\uff09\uff1a")}</strong>
              <div className="font-mono text-xs mt-1">
                4.7M {t("trainable params vs 175B full fine-tune", "\u53ef\u8bad\u7ec3\u53c2\u6570 vs 175B \u5168\u91cf\u5fae\u8c03")}
              </div>
              <div className="text-blue-800 font-mono text-xs">
                = 37,000&times; {t("parameter reduction!", "\u53c2\u6570\u51cf\u5c11\uff01")}
              </div>
            </div>
          </div>
        </Collapsible>

        {/* ============ Why Low Rank Works ============ */}
        <h2>
          {t(
            "4. Why Does Low Rank Work?",
            "4. \u4e3a\u4ec0\u4e48\u4f4e\u79e9\u6709\u6548\uff1f"
          )}
        </h2>

        <p>
          {t(
            "The central hypothesis is that weight changes during fine-tuning have low intrinsic dimensionality. Pre-trained models already encode vast world knowledge in W_0; task adaptation requires only a small correction that lives in a low-dimensional subspace.",
            "\u6838\u5fc3\u5047\u8bbe\u662f\uff1a\u5fae\u8c03\u671f\u95f4\u7684\u6743\u91cd\u53d8\u5316\u5177\u6709\u4f4e\u672c\u5f81\u7ef4\u5ea6\u3002\u9884\u8bad\u7ec3\u6a21\u578b\u5df2\u7ecf\u5728 W_0 \u4e2d\u7f16\u7801\u4e86\u5927\u91cf\u4e16\u754c\u77e5\u8bc6\uff1b\u4efb\u52a1\u9002\u914d\u53ea\u9700\u8981\u5c0f\u5c0f\u7684\u4fee\u6b63\uff0c\u800c\u8fd9\u79cd\u4fee\u6b63\u5b58\u5728\u4e8e\u4f4e\u7ef4\u5b50\u7a7a\u95f4\u4e2d\u3002"
          )}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Evidence from the paper:", "\u8bba\u6587\u4e2d\u7684\u8bc1\u636e\uff1a")}</strong>{" "}
            {t(
              "The authors show that randomly projecting the fine-tuning update into a 200-dimensional subspace and then doing full fine-tuning in that subspace achieves nearly the same performance as unconstrained fine-tuning on many NLP tasks. This supports the low-rank hypothesis empirically.",
              "\u4f5c\u8005\u8bc1\u660e\uff0c\u5c06\u5fae\u8c03\u66f4\u65b0\u968f\u673a\u6295\u5f71\u5230 200 \u7ef4\u5b50\u7a7a\u95f4\uff0c\u7136\u540e\u5728\u8be5\u5b50\u7a7a\u95f4\u4e2d\u8fdb\u884c\u5168\u91cf\u5fae\u8c03\uff0c\u5728\u8bb8\u591a NLP \u4efb\u52a1\u4e0a\u53d6\u5f97\u4e86\u51e0\u4e4e\u76f8\u540c\u7684\u6027\u80fd\u3002\u8fd9\u4ece\u7ecf\u9a8c\u4e0a\u652f\u6301\u4e86\u4f4e\u79e9\u5047\u8bbe\u3002"
            )}
          </p>
        </div>

        {/* ============ Rank Ablation ============ */}
        <h2>
          {t("5. Rank Ablation Study", "5. \u79e9\u7684\u6d88\u878d\u5b9e\u9a8c")}
        </h2>

        <p>
          {t(
            "How much does rank matter? The paper ablates rank on a RoBERTa model across GLUE tasks:",
            "\u79e9\u5bf9\u6027\u80fd\u6709\u591a\u5927\u5f71\u54cd\uff1f\u8bba\u6587\u5728 RoBERTa \u6a21\u578b\u4e0a\u5bf9 GLUE \u4efb\u52a1\u8fdb\u884c\u4e86\u79e9\u6d88\u878d\u5b9e\u9a8c\uff1a"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Rank r", "\u79e9 r")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("GLUE avg", "GLUE \u5747\u5206")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Trainable params", "\u53ef\u8bad\u7ec3\u53c2\u6570")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-4 py-2">1</td>
                <td className="border border-paper-200 px-4 py-2">85.0</td>
                <td className="border border-paper-200 px-4 py-2">0.29M</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">2</td>
                <td className="border border-paper-200 px-4 py-2">85.7</td>
                <td className="border border-paper-200 px-4 py-2">0.57M</td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  4
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  86.1
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  1.14M
                </td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">8</td>
                <td className="border border-paper-200 px-4 py-2">86.1</td>
                <td className="border border-paper-200 px-4 py-2">2.28M</td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2">64</td>
                <td className="border border-paper-200 px-4 py-2">85.9</td>
                <td className="border border-paper-200 px-4 py-2">18.28M</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The key insight: r=4 already saturates performance. Increasing rank beyond 4 does not improve quality and just wastes parameters. The adaptation information truly lives in a very low-dimensional subspace.",
            "\u5173\u952e\u53d1\u73b0\uff1ar=4 \u5df2\u7ecf\u8fbe\u5230\u6027\u80fd\u9970\u548c\u3002\u5c06\u79e9\u63d0\u9ad8\u5230 4 \u4ee5\u4e0a\u4e0d\u4f1a\u63d0\u5347\u8d28\u91cf\uff0c\u53ea\u662f\u6d6a\u8d39\u53c2\u6570\u3002\u9002\u914d\u4fe1\u606f\u786e\u5b9e\u5b58\u5728\u4e8e\u975e\u5e38\u4f4e\u7ef4\u7684\u5b50\u7a7a\u95f4\u4e2d\u3002"
          )}
        </p>

        {/* ============ Results ============ */}
        <h2>{t("6. Results: GPT-3 175B", "6. \u7ed3\u679c\uff1aGPT-3 175B")}</h2>

        <p>
          {t(
            "LoRA achieves parity with full fine-tuning while dramatically reducing parameters, and unlike adapter layers, it adds zero inference overhead:",
            "LoRA \u5728\u5927\u5e45\u51cf\u5c11\u53c2\u6570\u7684\u540c\u65f6\u4e0e\u5168\u91cf\u5fae\u8c03\u6301\u5e73\uff0c\u4e14\u4e0e\u9002\u914d\u5668\u5c42\u4e0d\u540c\uff0c\u4e0d\u589e\u52a0\u4efb\u4f55\u63a8\u7406\u5f00\u9500\uff1a"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Method", "\u65b9\u6cd5")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Wiki. PPL", "Wiki. \u56f0\u60d1\u5ea6")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Trainable params", "\u53ef\u8bad\u7ec3\u53c2\u6570")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Inference latency", "\u63a8\u7406\u5ef6\u8fdf")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Full fine-tune", "\u5168\u91cf\u5fae\u8c03")}
                </td>
                <td className="border border-paper-200 px-4 py-2">17.5</td>
                <td className="border border-paper-200 px-4 py-2">175B</td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("baseline", "\u57fa\u51c6")}
                </td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">
                  {t("Adapter (r=1)", "\u9002\u914d\u5668\uff08r=1\uff09")}
                </td>
                <td className="border border-paper-200 px-4 py-2">17.9</td>
                <td className="border border-paper-200 px-4 py-2">7.1M</td>
                <td className="border border-paper-200 px-4 py-2 text-red-600">
                  +{t("extra latency", "\u989d\u5916\u5ef6\u8fdf")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  LoRA (r=4)
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  17.5
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  4.7M
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  {t("zero overhead", "\u96f6\u5f00\u9500")}
                </td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">LoRA (r=16)</td>
                <td className="border border-paper-200 px-4 py-2">17.4</td>
                <td className="border border-paper-200 px-4 py-2">18.8M</td>
                <td className="border border-paper-200 px-4 py-2 text-green-600">
                  {t("zero overhead", "\u96f6\u5f00\u9500")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ============ Inference Merge ============ */}
        <h2>
          {t("7. Zero-Latency Inference via Weight Merging", "7. \u901a\u8fc7\u6743\u91cd\u5408\u5e76\u5b9e\u73b0\u96f6\u5ef6\u8fdf\u63a8\u7406")}
        </h2>

        <p>
          {t(
            "The key advantage over adapter layers: at inference time, the LoRA update can simply be added to the pre-trained weights. No additional sequential computation is needed:",
            "\u76f8\u6bd4\u9002\u914d\u5668\u5c42\u7684\u5173\u952e\u4f18\u52bf\uff1a\u5728\u63a8\u7406\u65f6\uff0cLoRA \u66f4\u65b0\u53ef\u76f4\u63a5\u52a0\u5230\u9884\u8bad\u7ec3\u6743\u91cd\u4e0a\u3002\u4e0d\u9700\u8981\u989d\u5916\u7684\u987a\u5e8f\u8ba1\u7b97\uff1a"
          )}
        </p>

        <Math
          display
          label={t("Weight merging at inference", "\u63a8\u7406\u65f6\u6743\u91cd\u5408\u5e76")}
          tex="W = W_0 + \frac{\alpha}{r} BA"
        />

        <p>
          {t(
            "After merging, the deployed model is structurally identical to the original pre-trained model. Switching between tasks requires only swapping the merged weights or keeping separate A and B matrices in memory.",
            "\u5408\u5e76\u540e\uff0c\u90e8\u7f72\u7684\u6a21\u578b\u5728\u7ed3\u6784\u4e0a\u4e0e\u539f\u59cb\u9884\u8bad\u7ec3\u6a21\u578b\u5b8c\u5168\u76f8\u540c\u3002\u5f53\u9700\u5207\u6362\u4efb\u52a1\u65f6\uff0c\u53ea\u9700\u4ea4\u6362\u5408\u5e76\u540e\u7684\u6743\u91cd\uff0c\u6216\u5c06\u72ec\u7acb\u7684 A \u548c B \u77e9\u9635\u4fdd\u5b58\u5728\u5185\u5b58\u4e2d\u5373\u53ef\u3002"
          )}
        </p>

        {/* ============ Limitations ============ */}
        <h2>{t("8. Limitations", "8. \u5c40\u9650\u6027")}</h2>

        <ul>
          <li>
            <strong>{t("Attention-only by default:", "\u9ed8\u8ba4\u4ec5\u9002\u7528\u4e8e\u6ce8\u610f\u529b\uff1a")}</strong>{" "}
            {t(
              "LoRA is typically applied only to Q, K, V, and output projection weight matrices in attention, not to FFN layers. Applying LoRA to FFN may improve performance further.",
              "LoRA \u901a\u5e38\u4ec5\u5e94\u7528\u4e8e\u6ce8\u610f\u529b\u4e2d\u7684 Q\u3001K\u3001V \u548c\u8f93\u51fa\u6295\u5f71\u6743\u91cd\u77e9\u9635\uff0c\u800c\u4e0d\u5e94\u7528\u4e8e FFN \u5c42\u3002\u5c06 LoRA \u5e94\u7528\u4e8e FFN \u53ef\u80fd\u8fdb\u4e00\u6b65\u63d0\u5347\u6027\u80fd\u3002"
            )}
          </li>
          <li>
            <strong>{t("Single-task adapters:", "\u5355\u4efb\u52a1\u9002\u914d\u5668\uff1a")}</strong>{" "}
            {t(
              "Cannot easily handle multiple tasks simultaneously — each task needs its own A, B matrices. Multi-task composition remains an open problem.",
              "\u65e0\u6cd5\u8f7b\u677e\u5e94\u5bf9\u591a\u4efb\u52a1\u573a\u666f \u2014 \u6bcf\u4e2a\u4efb\u52a1\u9700\u8981\u81ea\u5df1\u7684 A\u3001B \u77e9\u9635\u3002\u591a\u4efb\u52a1\u7ec4\u5408\u4ecd\u662f\u5f00\u653e\u6027\u95ee\u9898\u3002"
            )}
          </li>
          <li>
            <strong>{t("Rank is a hyperparameter:", "\u79e9\u662f\u8d85\u53c2\u6570\uff1a")}</strong>{" "}
            {t(
              "Optimal rank varies by task and model size. Requires tuning r per setting.",
              "\u6700\u4f18\u79e9\u56e0\u4efb\u52a1\u548c\u6a21\u578b\u5927\u5c0f\u800c\u5f02\u3002\u9700\u8981\u9488\u5bf9\u6bcf\u4e2a\u8bbe\u7f6e\u8c03\u6574 r\u3002"
            )}
          </li>
          <li>
            <strong>{t("Performance gap on complex tasks:", "\u5728\u590d\u6742\u4efb\u52a1\u4e0a\u7684\u6027\u80fd\u5dee\u8ddd\uff1a")}</strong>{" "}
            {t(
              "For highly specialized or complex tasks, LoRA can still fall short of full fine-tuning.",
              "\u5bf9\u4e8e\u9ad8\u5ea6\u4e13\u4e1a\u5316\u6216\u590d\u6742\u7684\u4efb\u52a1\uff0cLoRA \u4ecd\u53ef\u80fd\u8fbe\u4e0d\u5230\u5168\u91cf\u5fae\u8c03\u7684\u6c34\u5e73\u3002"
            )}
          </li>
        </ul>

        {/* ============ Connections ============ */}
        <h2>
          {t("9. Connections to Other Work", "9. \u4e0e\u5176\u4ed6\u5de5\u4f5c\u7684\u8054\u7cfb")}
        </h2>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/attention-is-all-you-need`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {t("Attention Is All You Need", "Attention Is All You Need")}
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "LoRA targets the Q, K, V, and output projection weight matrices that define multi-head attention in the Transformer. Understanding the attention mechanism is prerequisite to understanding which matrices LoRA adapts.",
                "LoRA \u9488\u5bf9 Transformer \u4e2d\u5b9a\u4e49\u591a\u5934\u6ce8\u610f\u529b\u7684 Q\u3001K\u3001V \u548c\u8f93\u51fa\u6295\u5f71\u6743\u91cd\u77e9\u9635\u3002\u7406\u89e3\u6ce8\u610f\u529b\u673a\u5236\u662f\u7406\u89e3 LoRA \u9002\u914d\u54ea\u4e9b\u77e9\u9635\u7684\u524d\u63d0\u3002"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/bert`}
              className="font-semibold text-blue-600 hover:underline"
            >
              BERT
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "LoRA enables cheap fine-tuning of BERT-scale models (\u223c340M params) on domain-specific tasks without storing separate full model copies.",
                "LoRA \u4f7f\u5f97\u5728\u9886\u57df\u7279\u5b9a\u4efb\u52a1\u4e0a\u4fbf\u5b9c\u5730\u5fae\u8c03 BERT \u89c4\u6a21\u6a21\u578b\uff08\u223c340M \u53c2\u6570\uff09\uff0c\u800c\u65e0\u9700\u5b58\u50a8\u72ec\u7acb\u7684\u5b8c\u6574\u6a21\u578b\u526f\u672c\u3002"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/dpo`}
              className="font-semibold text-blue-600 hover:underline"
            >
              DPO
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "QLoRA (4-bit quantization + LoRA) makes DPO on LLaMA-65B feasible on a single consumer GPU, dramatically democratizing alignment fine-tuning.",
                "QLoRA\uff084\u4f4d\u91cf\u5316 + LoRA\uff09\u4f7f\u5f97\u5728\u5355\u5f20\u6d88\u8d39\u7ea7 GPU \u4e0a\u5bf9 LLaMA-65B \u8fdb\u884c DPO \u6210\u4e3a\u53ef\u80fd\uff0c\u6781\u5927\u5730\u6c11\u4e3b\u5316\u4e86\u5bf9\u9f50\u5fae\u8c03\u3002"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/grpo`}
              className="font-semibold text-blue-600 hover:underline"
            >
              GRPO
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "DeepSeek-R1 training often combines LoRA with GRPO for memory-efficient reinforcement learning fine-tuning on reasoning tasks.",
                "DeepSeek-R1 \u8bad\u7ec3\u901a\u5e38\u5c06 LoRA \u4e0e GRPO \u7ed3\u5408\uff0c\u5728\u63a8\u7406\u4efb\u52a1\u4e0a\u5b9e\u73b0\u5185\u5b58\u9ad8\u6548\u7684\u5f3a\u5316\u5b66\u4e60\u5fae\u8c03\u3002"
              )}
            </p>
          </div>
        </div>

        <h2>
          {t("10. Additional Resources", "10. \u8865\u5145\u8d44\u6e90")}
        </h2>
        <div className="space-y-2 my-4">
          <a
            href="https://arxiv.org/abs/2106.09685"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">LoRA (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Original paper", "\u539f\u59cb\u8bba\u6587")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/2305.14314"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">QLoRA (Dettmers et al. 2023)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t(
                "Combines 4-bit quantization with LoRA for single-GPU fine-tuning of 65B models",
                "\u5c06 4 \u4f4d\u91cf\u5316\u4e0e LoRA \u7ed3\u5408\uff0c\u5b9e\u73b0\u5355 GPU \u5fae\u8c03 65B \u6a21\u578b"
              )}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/2110.04366"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              Intrinsic Dimensionality (Aghajanyan et al. 2021)
            </span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t(
                "Foundational work motivating LoRA's low-rank hypothesis",
                "\u652f\u6491 LoRA \u4f4e\u79e9\u5047\u8bbe\u7684\u57fa\u7840\u6027\u5de5\u4f5c"
              )}
            </span>
          </a>
        </div>
      </article>
    </div>
  );
}
