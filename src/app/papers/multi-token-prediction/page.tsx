"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function MultiTokenPredictionPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Better & Faster Large Language Models via Multi-Token Prediction",
            "通过多词元预测构建更好更快的大语言模型"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-paper-200/50">
          Gloeckle, Idrissi, Rozi\u00e8re et al. &middot; Meta FAIR &middot; 2024 &middot;{" "}
          <a
            href="https://arxiv.org/abs/2404.19737"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 2404.19737
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Standard LLM training predicts one token at a time. Multi-Token Prediction (MTP) adds k independent output heads to the same transformer trunk, each trained to predict one future token (t+1 through t+k) simultaneously. The joint loss forces the model to learn higher-level, forward-looking representations. At inference, the k heads double as a built-in speculative decoder, yielding up to 3\u00d7 throughput gains. Models trained with MTP consistently outperform next-token-only baselines on coding and algorithmic reasoning benchmarks, and reach the same perplexity with less training data.",
              "\u6807\u51c6 LLM \u8bad\u7ec3\u6bcf\u6b21\u53ea\u9884\u6d4b\u4e00\u4e2a\u8bcd\u5143\u3002\u591a\u8bcd\u5143\u9884\u6d4b\uff08MTP\uff09\u5728\u76f8\u540c\u7684 Transformer \u5e72\u7ebf\u4e0a\u6dfb\u52a0 k \u4e2a\u72ec\u7acb\u8f93\u51fa\u5934\uff0c\u6bcf\u4e2a\u5934\u540c\u65f6\u88ab\u8bad\u7ec3\u9884\u6d4b\u4e00\u4e2a\u672a\u6765\u8bcd\u5143\uff08t+1 \u5230 t+k\uff09\u3002\u8054\u5408\u635f\u5931\u8feb\u4f7f\u6a21\u578b\u5b66\u4e60\u66f4\u9ad8\u5c42\u6b21\u3001\u5177\u6709\u524d\u77bb\u6027\u7684\u8868\u793a\u3002\u5728\u63a8\u7406\u65f6\uff0ck \u4e2a\u5934\u5929\u7136\u5730\u6210\u4e3a\u5185\u5efa\u7684\u6295\u6a5f\u89e3\u7801\u5668\uff0c\u6700\u9ad8\u53ef\u63d0\u5347 3 \u500d\u5403\u5c71\u91cf\u3002\u7ecf\u8fc7 MTP \u8bad\u7ec3\u7684\u6a21\u578b\u5728\u7f16\u7a0b\u548c\u7b97\u6cd5\u63a8\u7406\u57fa\u51c6\u4e0a\u59cb\u5982\u4e00\u8d2f\u5730\u4f18\u4e8e\u4ec5\u7528\u4e0b\u4e00\u8bcd\u5143\u8bad\u7ec3\u7684\u57fa\u7ebf\uff0c\u4e14\u7528\u66f4\u5c11\u7684\u8bad\u7ec3\u6570\u636e\u5c31\u80fd\u8fbe\u5230\u76f8\u540c\u7684\u56f0\u60d1\u5ea6\u3002"
            )}
          </p>
        </section>

        {/* ============ Section 1 ============ */}
        <h2>
          {t(
            "1. The One-Token-At-A-Time Bottleneck",
            "1. \u6bcf\u6b21\u53ea\u9884\u6d4b\u4e00\u4e2a\u8bcd\u5143\u7684\u74f6\u9888"
          )}
        </h2>

        <p>
          {t(
            "Every modern autoregressive language model is trained with the same objective: given a sequence of tokens x\u2081, x\u2082, \u2026, x_T, maximise the log-likelihood of each token given all preceding tokens. The training loss is the sum of cross-entropy terms over every position:",
            "\u6bcf\u4e00\u4e2a\u73b0\u4ee3\u81ea\u56de\u5f52\u8bed\u8a00\u6a21\u578b\u90fd\u4f7f\u7528\u76f8\u540c\u7684\u76ee\u6807\u8fdb\u884c\u8bad\u7ec3\uff1a\u7ed9\u5b9a\u8bcd\u5143\u5e8f\u5217 x\u2081, x\u2082, \u2026, x_T\uff0c\u5bf9\u6bcf\u4e2a\u8bcd\u5143\u5728\u6240\u6709\u524d\u5e8f\u8bcd\u5143\u6761\u4ef6\u4e0b\u7684\u5bf9\u6570\u4f3c\u7136\u5ea6\u6700\u5927\u5316\u3002\u8bad\u7ec3\u635f\u5931\u662f\u6bcf\u4e2a\u4f4d\u7f6e\u7684\u4ea4\u53c9\u71b5\u9879\u4e4b\u548c\uff1a"
          )}
        </p>

        <Math
          display
          label={t("Standard next-token prediction loss", "\u6807\u51c6\u4e0b\u4e00\u8bcd\u5143\u9884\u6d4b\u635f\u5931")}
          tex="\mathcal{L}_{\text{NTP}} = -\sum_{t} \log p_\theta\!\left(x_{t+1} \mid x_{1:t}\right)"
        />

        <p>
          {t(
            "This is elegant and powerful, but it imposes a strict constraint: every forward pass teaches the model about exactly one future token. The representation learned by the transformer at position t only needs to carry enough information to predict x_{t+1} — nothing further. This local, myopic training signal may limit how much long-range structure the model internalises.",
            "\u8fd9\u4e2a\u76ee\u6807\u4f18\u96c5\u800c\u5f3a\u5927\uff0c\u4f46\u5b83\u5f3a\u52a0\u4e86\u4e00\u4e2a\u4e25\u683c\u9650\u5236\uff1a\u6bcf\u6b21\u524d\u5411\u4f20\u64ad\u53ea\u6559\u4f1a\u6a21\u578b\u4e00\u4e2a\u672a\u6765\u8bcd\u5143\u7684\u4fe1\u606f\u3002Transformer \u5728\u4f4d\u7f6e t \u5b66\u5230\u7684\u8868\u793a\u53ea\u9700\u8981\u5305\u542b\u8db3\u591f\u7684\u4fe1\u606f\u6765\u9884\u6d4b x_{t+1}\uff0c\u4e0d\u9700\u8981\u66f4\u591a\u3002\u8fd9\u79cd\u5c40\u90e8\u3001\u77ed\u89c6\u7684\u8bad\u7ec3\u4fe1\u53f7\u53ef\u80fd\u9650\u5236\u4e86\u6a21\u578b\u5185\u5316\u957f\u7a0b\u7ed3\u6784\u7684\u80fd\u529b\u3002"
          )}
        </p>

        <p>
          {t(
            "Auto-regressive generation also has a well-known throughput problem: tokens are produced strictly one at a time. Even on the fastest GPUs, the bottleneck is the sequential dependency chain — you cannot start computing x_{t+2} until x_{t+1} is known. Multi-Token Prediction addresses both issues at once.",
            "\u81ea\u56de\u5f52\u751f\u6210\u8fd8\u6709\u4e00\u4e2a\u4f17\u6240\u5468\u77e5\u7684\u5403\u5c71\u91cf\u95ee\u9898\uff1a\u8bcd\u5143\u662f\u4e25\u683c\u6309\u987a\u5e8f\u4e00\u4e2a\u4e00\u4e2a\u4ea7\u751f\u7684\u3002\u5373\u4f7f\u5728\u6700\u5feb\u7684 GPU \u4e0a\uff0c\u74f6\u9888\u4e5f\u5728\u4e8e\u9a6c\u5c14\u79d1\u592b\u4f9d\u8d56\u94fe\u2014\u2014\u5728\u4e0d\u77e5\u9053 x_{t+1} \u4e4b\u524d\uff0c\u4f60\u65e0\u6cd5\u5f00\u59cb\u8ba1\u7b97 x_{t+2}\u3002\u591a\u8bcd\u5143\u9884\u6d4b\u540c\u65f6\u89e3\u51b3\u8fd9\u4e24\u4e2a\u95ee\u9898\u3002"
          )}
        </p>

        {/* ============ Section 2 ============ */}
        <h2>
          {t(
            "2. Multi-Token Prediction Architecture",
            "2. \u591a\u8bcd\u5143\u9884\u6d4b\u67b6\u6784"
          )}
        </h2>

        <p>
          {t(
            "The core idea is deceptively simple: keep the transformer body exactly as-is, but attach k independent output heads instead of one. Each head n (for n = 1, 2, \u2026, k) is responsible for predicting the token that appears n steps into the future, given only the tokens seen up to position t.",
            "\u6838\u5fc3\u601d\u60f3\u51fa\u4e4e\u5176\u7b80\u5355\uff1aTransformer \u4e3b\u4f53\u5b8c\u5168\u4fdd\u6301\u4e0d\u53d8\uff0c\u4f46\u9644\u52a0 k \u4e2a\u72ec\u7acb\u7684\u8f93\u51fa\u5934\u800c\u4e0d\u662f\u4e00\u4e2a\u3002\u6bcf\u4e2a\u5934 n\uff08n = 1, 2, \u2026, k\uff09\u8d1f\u8d23\u9884\u6d4b\u672a\u6765\u7b2c n \u6b65\u7684\u8bcd\u5143\uff0c\u53ea\u4f7f\u7528\u5230\u76ee\u524d\u4e3a\u6b62\u4f4d\u7f6e t \u7684\u8bcd\u5143\u3002"
          )}
        </p>

        <div className="my-6 rounded-lg border border-paper-200 dark:border-paper-700 overflow-hidden">
          <div className="bg-paper-50 dark:bg-paper-800/50 px-4 py-2 text-xs font-semibold text-paper-600 dark:text-paper-400 uppercase tracking-wide">
            {t("Architecture diagram", "\u67b6\u6784\u56fe\u793a")}
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="rounded bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 px-3 py-2 flex-1 text-center font-medium text-amber-900 dark:text-amber-200">
                {t("Input tokens x\u2081 \u2026 x_t", "\u8f93\u5165\u8bcd\u5143 x\u2081 \u2026 x_t")}
              </div>
            </div>
            <div className="flex justify-center text-paper-400">\u2193</div>
            <div className="flex items-center gap-2 text-sm">
              <div className="rounded bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 px-3 py-2 flex-1 text-center font-medium text-blue-900 dark:text-blue-200">
                {t("Shared Transformer Trunk \u2014 produces hidden state h_t", "\u5171\u4eab Transformer \u5e72\u7ebf\u2014\u2014\u4ea7\u751f\u9690\u85cf\u72b6\u6001 h_t")}
              </div>
            </div>
            <div className="flex justify-center text-paper-400">\u2193</div>
            <div className="flex gap-2 text-xs">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex-1 rounded bg-teal-50 dark:bg-teal-900/30 border border-teal-300 dark:border-teal-700 px-2 py-2 text-center text-teal-900 dark:text-teal-200"
                >
                  <div className="font-semibold mb-1">{t(`Head ${n}`, `\u7b2c ${n} \u5934`)}</div>
                  <div>
                    {t(
                      `\u2192 x\u209c\u208a${n}`,
                      `\u2192 x\u209c\u208a${n}`
                    )}
                  </div>
                </div>
              ))}
              <div className="flex-1 rounded bg-paper-100 dark:bg-paper-700/30 border border-paper-300 dark:border-paper-600 px-2 py-2 text-center text-paper-500 dark:text-paper-400 text-xs self-center">
                \u2026 {t("Head k", "\u7b2c k \u5934")} \u2192 x_{"{t+k}"}
              </div>
            </div>
          </div>
        </div>

        <p>
          {t(
            "The shared trunk is the expensive part — the full transformer with all its layers. Each output head is a lightweight linear projection from the hidden dimension d to the vocabulary size V, plus a bias. Because the trunk is shared, the overhead of adding k heads is modest.",
            "\u5171\u4eab\u5e72\u7ebf\u662f\u6210\u672c\u6700\u9ad8\u7684\u90e8\u5206\u2014\u2014\u5305\u542b\u6240\u6709\u5c42\u7684\u5b8c\u6574 Transformer\u3002\u6bcf\u4e2a\u8f93\u51fa\u5934\u662f\u4ece\u9690\u85cf\u7ef4\u5ea6 d \u5230\u8bcd\u8868\u5927\u5c0f V \u7684\u8f7b\u91cf\u7ea7\u7ebf\u6027\u6295\u5f71\uff08\u52a0\u504f\u7f6e\uff09\u3002\u5f97\u76ca\u4e8e\u5e72\u7ebf\u5171\u4eab\uff0c\u6dfb\u52a0 k \u4e2a\u5934\u7684\u989d\u5916\u5f00\u9500\u5341\u5206\u6709\u9650\u3002"
          )}
        </p>

        {/* ============ Section 3 ============ */}
        <h2>
          {t(
            "3. k Independent Heads",
            "3. k \u4e2a\u72ec\u7acb\u7684\u8f93\u51fa\u5934"
          )}
        </h2>

        <p>
          {t(
            "Each head n has its own weight matrix W_n and bias b_n. Given the hidden state h_t produced by the shared trunk at position t, head n computes a distribution over the vocabulary:",
            "\u6bcf\u4e2a\u5934 n \u6709\u5176\u81ea\u5df1\u7684\u6743\u91cd\u77e9\u9635 W_n \u548c\u504f\u7f6e b_n\u3002\u7ed9\u5b9a\u4f4d\u7f6e t \u5904\u5171\u4eab\u5e72\u7ebf\u4ea7\u751f\u7684\u9690\u85cf\u72b6\u6001 h_t\uff0c\u5934 n \u8ba1\u7b97\u4e00\u4e2a\u8bcd\u8868\u4e0a\u7684\u5206\u5e03\uff1a"
          )}
        </p>

        <Math
          display
          label={t("Head n output distribution", "\u5934 n \u7684\u8f93\u51fa\u5206\u5e03")}
          tex="p_\theta^{(n)}\!\left(\cdot \mid x_{1:t}\right) = \operatorname{softmax}\!\left(W_n \cdot h_t + b_n\right)"
        />

        <p>
          {t(
            "The heads are independent: they do not share parameters with each other (beyond the trunk), and they are trained with separate gradient signals. Crucially, the gradient from head n flows back through the shared trunk — so the trunk receives k training signals simultaneously from every token position.",
            "\u8fd9\u4e9b\u5934\u662f\u72ec\u7acb\u7684\uff1a\u9664\u4e86\u5e72\u7ebf\u90e8\u5206\uff0c\u5b83\u4eec\u4e4b\u95f4\u4e0d\u5171\u4eab\u53c2\u6570\uff0c\u5e76\u4e14\u4f7f\u7528\u72ec\u7acb\u7684\u68af\u5ea6\u4fe1\u53f7\u8fdb\u884c\u8bad\u7ec3\u3002\u5173\u952e\u5728\u4e8e\uff0c\u6765\u81ea\u5934 n \u7684\u68af\u5ea6\u4f1a\u6d41\u56de\u5171\u4eab\u5e72\u7ebf\u2014\u2014\u56e0\u6b64\u5e72\u7ebf\u5728\u6bcf\u4e2a\u8bcd\u5143\u4f4d\u7f6e\u540c\u65f6\u63a5\u6536 k \u4e2a\u8bad\u7ec3\u4fe1\u53f7\u3002"
          )}
        </p>

        <div className="my-5 p-4 bg-paper-50 dark:bg-paper-800/40 rounded-lg border border-paper-200 dark:border-paper-700 text-sm">
          <p className="font-semibold mb-2 text-paper-800 dark:text-paper-200">
            {t("Parameter overhead", "\u53c2\u6570\u5f00\u9500")}
          </p>
          <p className="text-paper-700 dark:text-paper-300 mb-0">
            {t(
              "Each head adds a weight matrix of shape (V \u00d7 d) plus a bias of shape V. With k heads, the additional parameters are k \u00d7 (V \u00b7 d + V). For typical values (d = 4096, V = 32000, k = 4), this is roughly 4 \u00d7 131M = 524M extra parameters — significant in absolute terms, but small compared to the tens of billions of parameters in the trunk.",
              "\u6bcf\u4e2a\u5934\u6dfb\u52a0\u4e00\u4e2a\u5f62\u72b6\u4e3a (V \u00d7 d) \u7684\u6743\u91cd\u77e9\u9635\u548c\u5f62\u72b6\u4e3a V \u7684\u504f\u7f6e\u3002\u6709 k \u4e2a\u5934\u65f6\uff0c\u989d\u5916\u53c2\u6570\u4e3a k \u00d7 (V \u00b7 d + V)\u3002\u5bf9\u4e8e\u5178\u578b\u5c06\uff08d = 4096, V = 32000, k = 4\uff09\uff0c\u5927\u7ea6\u662f 4 \u00d7 131M = 524M \u989d\u5916\u53c2\u6570\u2014\u2014\u7edd\u5bf9\u503c\u8fd8\u53ef\u4ee5\uff0c\u4f46\u4e0e\u5e72\u7ebf\u4e2d\u6570\u767e\u4ebf\u53c2\u6570\u76f8\u6bd4\u5c0f\u5f97\u591a\u3002"
            )}
          </p>
          <Math
            display
            tex="\Delta\text{params} = k \cdot (d \cdot V + V) = \mathcal{O}(k \cdot d \cdot V)"
          />
        </div>

        {/* ============ Section 4 ============ */}
        <h2>
          {t(
            "4. Training Loss",
            "4. \u8bad\u7ec3\u635f\u5931"
          )}
        </h2>

        <p>
          {t(
            "The training objective is a simple sum of k cross-entropy losses, one per head. At each position t, head n is supervised by the ground-truth token x_{t+n}. Summing over all positions and all heads:",
            "\u8bad\u7ec3\u76ee\u6807\u662f k \u4e2a\u4ea4\u53c9\u71b5\u635f\u5931\u7684\u7b80\u5355\u6c42\u548c\uff0c\u6bcf\u4e2a\u5934\u5bf9\u5e94\u4e00\u4e2a\u3002\u5728\u6bcf\u4e2a\u4f4d\u7f6e t\uff0c\u5934 n \u7531\u771f\u5b9e\u8bcd\u5143 x_{t+n} \u8fdb\u884c\u76d1\u7763\u3002\u5728\u6240\u6709\u4f4d\u7f6e\u548c\u6240\u6709\u5934\u4e0a\u6c42\u548c\uff1a"
          )}
        </p>

        <Math
          display
          label={t("Multi-token prediction training loss", "\u591a\u8bcd\u5143\u9884\u6d4b\u8bad\u7ec3\u635f\u5931")}
          tex="\mathcal{L}_{\text{MTP}} = -\sum_{t}\sum_{n=1}^{k} \log p_\theta^{(n)}\!\left(x_{t+n} \mid x_{1:t}\right)"
        />

        <p>
          {t(
            "Notice that the conditioning context is always the same prefix x_{1:t} for all k heads at position t. Head 1 predicts the very next token (same supervision as standard NTP). Head 2 predicts two steps ahead. And so on. This means the gradient from every head flows into the same hidden state h_t — giving the trunk far richer learning signal.",
            "\u6ce8\u610f\uff0c\u5bf9\u4f4d\u7f6e t \u7684\u6240\u6709 k \u4e2a\u5934\uff0c\u6761\u4ef6\u4e0a\u4e0b\u6587\u59cb\u7ec8\u662f\u76f8\u540c\u7684\u524d\u7f00 x_{1:t}\u3002\u5934 1 \u9884\u6d4b\u7d27\u63a5\u7740\u7684\u4e0b\u4e00\u4e2a\u8bcd\u5143\uff08\u4e0e\u6807\u51c6 NTP \u7684\u76d1\u7763\u76f8\u540c\uff09\u3002\u5934 2 \u9884\u6d4b\u4e24\u6b65\u540e\u7684\u8bcd\u5143\u3002\u4ee5\u6b64\u7c7b\u63a8\u3002\u8fd9\u610f\u5473\u7740\u6bcf\u4e2a\u5934\u7684\u68af\u5ea6\u6d41\u5165\u540c\u4e00\u4e2a\u9690\u85cf\u72b6\u6001 h_t\u2014\u2014\u4e3a\u5e72\u7ebf\u63d0\u4f9b\u4e86\u4e30\u5bcc\u5f97\u591a\u7684\u5b66\u4e60\u4fe1\u53f7\u3002"
          )}
        </p>

        <Collapsible
          title={t(
            "Derivation: why the loss decomposes cleanly",
            "\u63a8\u5bfc\uff1a\u4e3a\u4ec0\u4e48\u635f\u5931\u53ef\u4ee5\u5e72\u51c0\u5206\u89e3"
          )}
        >
          <div className="text-sm space-y-3">
            <p className="text-paper-700 dark:text-paper-300">
              {t(
                "Each head n defines an independent conditional distribution. The joint training objective can be written as:",
                "\u6bcf\u4e2a\u5934 n \u5b9a\u4e49\u4e86\u4e00\u4e2a\u72ec\u7acb\u7684\u6761\u4ef6\u5206\u5e03\u3002\u8054\u5408\u8bad\u7ec3\u76ee\u6807\u53ef\u4ee5\u5199\u6210\uff1a"
              )}
            </p>
            <Math
              display
              tex="\mathcal{L}_{\text{MTP}} = \sum_{n=1}^{k} \mathcal{L}^{(n)}, \quad \mathcal{L}^{(n)} = -\sum_t \log p_\theta^{(n)}\!\left(x_{t+n} \mid x_{1:t}\right)"
            />
            <p className="text-paper-700 dark:text-paper-300">
              {t(
                "Because the heads are independent (no shared parameters beyond the trunk), the gradient of L^(n) with respect to the head-n weights W_n, b_n is isolated. Only the gradients that flow back through h_t couple the heads — giving the trunk a richer aggregate signal.",
                "\u56e0\u4e3a\u5404\u5934\u662f\u72ec\u7acb\u7684\uff08\u9664\u4e86\u5e72\u7ebf\u5916\u65e0\u5171\u4eab\u53c8\u6570\uff09\uff0cL^(n) \u5bf9\u5934 n \u6743\u91cd W_n, b_n \u7684\u68af\u5ea6\u662f\u5b64\u7acb\u7684\u3002\u53ea\u6709\u901a\u8fc7 h_t \u6d41\u56de\u7684\u68af\u5ea6\u624d\u5c06\u5404\u5934\u8026\u5408\u2014\u2014\u5c31\u8fd9\u4e48\u4e3a\u5e72\u7ebf\u63d0\u4f9b\u4e86\u66f4\u4e30\u5bcc\u7684\u805a\u5408\u4fe1\u53f7\u3002"
              )}
            </p>
            <p className="text-paper-700 dark:text-paper-300">
              {t(
                "Standard NTP is the special case k = 1. MTP strictly generalises NTP — the first head is identical to the NTP objective.",
                "\u6807\u51c6 NTP \u662f k = 1 \u7684\u7279\u6b8a\u60c5\u51b5\u3002MTP \u662f NTP \u7684\u4e25\u683c\u6cfb\u5316\u2014\u2014\u7b2c\u4e00\u4e2a\u5934\u4e0e NTP \u76ee\u6807\u5b8c\u5168\u76f8\u540c\u3002"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 5 ============ */}
        <h2>
          {t(
            "5. Speculative Decoding Connection",
            "5. \u4e0e\u6295\u6a5f\u89e3\u7801\u7684\u8054\u7cfb"
          )}
        </h2>

        <p>
          {t(
            "One of the most practically valuable aspects of MTP is that the k prediction heads can be reused at inference time as a speculative decoder — at zero extra training cost.",
            "MTP \u5728\u5b9e\u8df5\u4e2d\u6700\u6709\u4ef7\u5024\u7684\u4e00\u4e2a\u65b9\u9762\u662f\uff1a\u5728\u63a8\u7406\u65f6\uff0ck \u4e2a\u9884\u6d4b\u5934\u53ef\u4ee5\u88ab\u5fa9\u7528\u4e3a\u6295\u6a5f\u89e3\u7801\u5668\u2014\u2014\u4e14\u65e0\u9700\u989d\u5916\u8bad\u7ec3\u6210\u672c\u3002"
          )}
        </p>

        <p>
          {t(
            "Speculative decoding works by running a cheap draft model to propose multiple tokens in one shot, then verifying all proposals in a single forward pass of the full model. Since verification is embarrassingly parallel (all proposals are scored simultaneously), this avoids the serial bottleneck of standard generation while keeping output quality identical.",
            "\u6295\u6a5f\u89e3\u7801\u7684\u539f\u7406\u662f\uff1a\u8fd0\u884c\u4e00\u4e2a\u5f00\u9500\u4f4e\u5ec9\u7684\u8349\u7a3f\u6a21\u578b\u4e00\u6b21\u6027\u63d0\u51fa\u591a\u4e2a\u8bcd\u5143\uff0c\u7136\u540e\u5728\u5b8c\u6574\u6a21\u578b\u7684\u4e00\u6b21\u524d\u5411\u4f20\u64ad\u4e2d\u5e76\u884c\u9a8c\u8bc1\u6240\u6709\u63d0\u6848\u3002\u7531\u4e8e\u9a8c\u8bc1\u662f\u5c34\u5c34\u5e76\u884c\u7684\uff08\u6240\u6709\u63d0\u6848\u540c\u65f6\u8bc4\u5206\uff09\uff0c\u53ef\u4ee5\u9996\u5148\u89e3\u51b3\u6807\u51c6\u751f\u6210\u7684\u4e32\u884c\u74f6\u9888\uff0c\u540c\u65f6\u4fdd\u6301\u8f93\u51fa\u8d28\u91cf\u4e0d\u53d8\u3002"
          )}
        </p>

        <div className="my-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
          <p className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
            {t("MTP as a draft model", "MTP \u4f5c\u4e3a\u8349\u7a3f\u6a21\u578b")}
          </p>
          <ol className="list-decimal list-inside space-y-1 text-amber-900 dark:text-amber-200">
            <li>
              {t(
                "Draft: run the shared trunk once at position t. Heads 1\u2026k each output a proposed token x\u0302_{t+1}, \u2026, x\u0302_{t+k}.",
                "\u8d77\u8349\uff1a\u5728\u4f4d\u7f6e t \u8fd0\u884c\u5171\u4eab\u5e72\u7ebf\u4e00\u6b21\u3002\u5934 1\u2026k \u5206\u522b\u8f93\u51fa\u63d0\u6848\u8bcd\u5143 x\u0302_{t+1}, \u2026, x\u0302_{t+k}\u3002"
              )}
            </li>
            <li>
              {t(
                "Verify: run a single forward pass on the concatenated sequence x_{1:t}, x\u0302_{t+1}, \u2026, x\u0302_{t+k} to obtain the model's true probabilities for each position.",
                "\u9a8c\u8bc1\uff1a\u5bf9\u62fc\u63a5\u5e8f\u5217 x_{1:t}, x\u0302_{t+1}, \u2026, x\u0302_{t+k} \u8fd0\u884c\u4e00\u6b21\u524d\u5411\u4f20\u64ad\uff0c\u83b7\u5f97\u6bcf\u4e2a\u4f4d\u7f6e\u7684\u6a21\u578b\u771f\u5b9e\u6982\u7387\u3002"
              )}
            </li>
            <li>
              {t(
                "Accept/reject: accept each proposed token greedily or via the speculative sampling rule below.",
                "\u63a5\u53d7/\u62d2\u7edd\uff1a\u8d2a\u5fc3\u5730\u6216\u901a\u8fc7\u4e0b\u65b9\u7684\u6295\u6a5f\u91c7\u6837\u89c4\u5219\u63a5\u53d7\u6bcf\u4e2a\u63d0\u6848\u8bcd\u5143\u3002"
              )}
            </li>
          </ol>
        </div>

        <p>
          {t(
            "The speculative sampling acceptance rule guarantees that the accepted tokens are distributed exactly as if they had been sampled from the full model's distribution — so output quality is provably unchanged:",
            "\u6295\u6a5f\u91c7\u6837\u63a5\u53d7\u89c4\u5219\u4fdd\u8bc1\u4e86\u88ab\u63a5\u53d7\u7684\u8bcd\u5143\u7684\u5206\u5e03\u4e0e\u76f4\u63a5\u4ece\u5b8c\u6574\u6a21\u578b\u5206\u5e03\u4e2d\u91c7\u6837\u5b8c\u5168\u76f8\u540c\u2014\u2014\u56e0\u6b64\u8f93\u51fa\u8d28\u91cf\u53ef\u4ee5\u8bc1\u660e\u4fdd\u6301\u4e0d\u53d8\uff1a"
          )}
        </p>

        <Math
          display
          label={t("Speculative sampling acceptance rule", "\u6295\u6a5f\u91c7\u6837\u63a5\u53d7\u89c4\u5219")}
          tex="\text{accept } \hat{x}_{t+n} \text{ if } \frac{p_{\text{verify}}(\hat{x}_{t+n})}{p_{\text{draft}}(\hat{x}_{t+n})} \geq u \sim \operatorname{Uniform}(0,1)"
        />

        <p>
          {t(
            "When the draft distribution closely matches the verifier (i.e., the MTP heads are accurate), nearly all proposals are accepted and the net throughput approaches k\u00d7 that of standard generation. In practice, Meta's experiments show roughly 3\u00d7 speedup for code generation tasks where the heads are highly accurate.",
            "\u5f53\u8349\u7a3f\u5206\u5e03\u4e0e\u9a8c\u8bc1\u5668\u9ad8\u5ea6\u5339\u914d\u65f6\uff08\u5373 MTP \u5934\u975e\u5e38\u51c6\u786e\uff09\uff0c\u51e0\u4e4e\u6240\u6709\u63d0\u6848\u90fd\u4f1a\u88ab\u63a5\u53d7\uff0c\u51c0\u5438\u5c71\u91cf\u63a5\u8fd1\u6807\u51c6\u751f\u6210\u7684 k \u500d\u3002\u5728\u5b9e\u8df5\u4e2d\uff0cMeta \u7684\u5b9e\u9a8c\u5728\u5934\u975e\u5e38\u51c6\u786e\u7684\u4ee3\u7801\u751f\u6210\u4efb\u52a1\u4e0a\u663e\u793a\u51fa\u5927\u7ea6 3 \u500d\u7684\u52a0\u901f\u6548\u679c\u3002"
          )}
        </p>

        <Collapsible
          title={t(
            "Why MTP heads are better drafters than a separate small model",
            "\u4e3a\u4ec0\u4e48 MTP \u5934\u6bd4\u5355\u72ec\u5c0f\u6a21\u578b\u66f4\u9002\u5408\u505a\u8349\u7a3f\u5668"
          )}
        >
          <div className="text-sm space-y-2 text-paper-700 dark:text-paper-300">
            <p>
              {t(
                "Traditional speculative decoding uses a separate, small draft model. This introduces several pain points: you need to train and maintain two separate models; the draft model has different parameters from the main model, so distribution mismatch is common; and serving two models simultaneously uses more memory.",
                "\u4f20\u7edf\u7684\u6295\u6a5f\u89e3\u7801\u9700\u8981\u4e00\u4e2a\u5355\u72ec\u7684\u5c0f\u578b\u8349\u7a3f\u6a21\u578b\u3002\u8fd9\u5e26\u6765\u51e0\u4e2a\u75db\u70b9\uff1a\u4f60\u9700\u8981\u8bad\u7ec3\u548c\u7ef4\u62a4\u4e24\u4e2a\u72ec\u7acb\u6a21\u578b\uff1b\u8349\u7a3f\u6a21\u578b\u4e0e\u4e3b\u6a21\u578b\u53c2\u6570\u4e0d\u540c\uff0c\u5206\u5e03\u4e0d\u5339\u914d\u5f88\u5e38\u89c1\uff1b\u540c\u65f6\u670d\u52a1\u4e24\u4e2a\u6a21\u578b\u4f1a\u5360\u7528\u66f4\u591a\u5185\u5b58\u3002"
              )}
            </p>
            <p>
              {t(
                "MTP heads share the trunk with the verifier, so they implicitly have the same representational basis. The draft distribution is naturally well-calibrated relative to the verifier, leading to higher acceptance rates. There is no separate model to deploy or maintain.",
                "MTP \u5934\u4e0e\u9a8c\u8bc1\u5668\u5171\u4eab\u5e72\u7ebf\uff0c\u56e0\u6b64\u5185\u9690\u5730\u5177\u6709\u76f8\u540c\u7684\u8868\u793a\u57fa\u7840\u3002\u8349\u7a3f\u5206\u5e03\u76f8\u5bf9\u4e8e\u9a8c\u8bc1\u5668\u81ea\u7136\u8fbe\u5230\u8f83\u597d\u7684\u6821\u51c6\uff0c\u4ece\u800c\u8fbe\u5230\u66f4\u9ad8\u7684\u63a5\u53d7\u7387\u3002\u4e14\u65e0\u9700\u5355\u72ec\u90e8\u7f72\u6216\u7ef4\u62a4\u5176\u4ed6\u6a21\u578b\u3002"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 6 ============ */}
        <h2>
          {t(
            "6. Why Planning Ahead Helps",
            "6. \u4e3a\u4ec0\u4e48\u524d\u77bb\u89c4\u5212\u6709\u5e2e\u52a9"
          )}
        </h2>

        <p>
          {t(
            "The intuitive story is compelling: if a model must simultaneously predict the next word and the word five steps ahead, it cannot afford to commit to greedy local choices. It must learn representations that are globally consistent with upcoming structure. This is analogous to how a chess player plans multiple moves ahead instead of optimising each move in isolation.",
            "\u76f4\u89c2\u4e0a\u5f88\u6709\u8bf4\u670d\u529b\uff1a\u5982\u679c\u4e00\u4e2a\u6a21\u578b\u5fc5\u987b\u540c\u65f6\u9884\u6d4b\u4e0b\u4e00\u4e2a\u8bcd\u548c\u4e94\u6b65\u540e\u7684\u8bcd\uff0c\u5b83\u5c31\u65e0\u6cd5\u8d2a\u5fc3\u5730\u9009\u62e9\u5c40\u90e8\u6700\u4f18\u3002\u5b83\u5fc5\u987b\u5b66\u4e60\u4e0e\u672a\u6765\u7ed3\u6784\u5168\u5c40\u4e00\u81f4\u7684\u8868\u793a\u3002\u8fd9\u5c31\u597d\u6bd4\u68cb\u624b\u63d0\u524d\u8c0b\u5212\u591a\u6b65\uff0c\u800c\u4e0d\u662f\u6bcf\u6b65\u7b8b\u7b79\u5c40\u90e8\u6700\u4f18\u3002"
          )}
        </p>

        <p>
          {t(
            "More formally: the gradient that the shared trunk receives from head n contains information about the local distribution at t+n, not just t+1. When many such gradients are aggregated, the trunk is incentivised to compress longer-range dependencies into h_t. The result is a more expressive, temporally richer hidden state.",
            "\u66f4\u5f62\u5f0f\u5316\u5730\u8bf4\uff1a\u5171\u4eab\u5e72\u7ebf\u4ece\u5934 n \u63a5\u6536\u5230\u7684\u68af\u5ea6\u5305\u542b\u4e86 t+n \u5904\u5c40\u90e8\u5206\u5e03\u7684\u4fe1\u606f\uff0c\u800c\u4e0d\u4ec5\u4ec5\u662f t+1\u3002\u5f53\u5927\u91cf\u8fd9\u6837\u7684\u68af\u5ea6\u88ab\u805a\u5408\u65f6\uff0c\u5e72\u7ebf\u5c31\u4f1a\u53d7\u5230\u6fc0\u52b1\u5c06\u66f4\u957f\u8303\u56f4\u7684\u4f9d\u8d56\u5173\u7cfb\u538b\u7f29\u8fdb h_t\u3002\u7ed3\u679c\u662f\u4e00\u4e2a\u66f4\u5177\u8868\u8fbe\u529b\u3001\u65f6\u95f4\u4e0a\u66f4\u4e30\u5bcc\u7684\u9690\u85cf\u72b6\u6001\u3002"
          )}
        </p>

        <div className="my-5 rounded-lg border border-paper-200 dark:border-paper-700 overflow-hidden text-sm">
          <div className="bg-paper-50 dark:bg-paper-800/50 px-4 py-2 text-xs font-semibold text-paper-600 dark:text-paper-400 uppercase tracking-wide">
            {t("Where does the benefit show up?", "\u6548\u679c\u5728\u54ea\u91cc\u4f53\u73b0\uff1f")}
          </div>
          <div className="divide-y divide-paper-200 dark:divide-paper-700">
            <div className="px-4 py-3 flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shrink-0" />
              <div>
                <span className="font-medium text-paper-900 dark:text-paper-100">
                  {t("Coding tasks (large gains)", "\u7f16\u7a0b\u4efb\u52a1\uff08\u663e\u8457\u63d0\u5347\uff09")}
                </span>
                <span className="text-paper-600 dark:text-paper-400">
                  {" "}—{" "}
                  {t(
                    "Code has predictable, grammar-constrained structure many tokens ahead. Planning is very useful here.",
                    "\u4ee3\u7801\u5728\u591a\u4e2a\u8bcd\u5143\u5c42\u9762\u5177\u6709\u53ef\u9884\u6d4b\u7684\u8bed\u6cd5\u7ea6\u675f\u7ed3\u6784\u3002\u5728\u8fd9\u91cc\u524d\u77bb\u89c4\u5212\u975e\u5e38\u6709\u7528\u3002"
                  )}
                </span>
              </div>
            </div>
            <div className="px-4 py-3 flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shrink-0" />
              <div>
                <span className="font-medium text-paper-900 dark:text-paper-100">
                  {t("Algorithmic reasoning (large gains)", "\u7b97\u6cd5\u63a8\u7406\uff08\u663e\u8457\u63d0\u5347\uff09")}
                </span>
                <span className="text-paper-600 dark:text-paper-400">
                  {" "}—{" "}
                  {t(
                    "Math and logic problems benefit from forward planning because intermediate steps are tightly coupled.",
                    "\u6570\u5b66\u548c\u903b\u8f91\u95ee\u9898\u56e0\u4e2d\u95f4\u6b65\u9aa4\u7d27\u5bc6\u8026\u5408\u800c\u53d7\u76ca\u4e8e\u524d\u77bb\u89c4\u5212\u3002"
                  )}
                </span>
              </div>
            </div>
            <div className="px-4 py-3 flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500 shrink-0" />
              <div>
                <span className="font-medium text-paper-900 dark:text-paper-100">
                  {t("Natural language (moderate gains)", "\u81ea\u7136\u8bed\u8a00\uff08\u9002\u5ea6\u63d0\u5347\uff09")}
                </span>
                <span className="text-paper-600 dark:text-paper-400">
                  {" "}—{" "}
                  {t(
                    "Language is more stochastic; the future is harder to pin down. Improvements are smaller but still consistent.",
                    "\u8bed\u8a00\u968f\u673a\u6027\u66f4\u5f3a\uff0c\u672a\u6765\u66f4\u96be\u786e\u5b9a\u3002\u6539\u5584\u5e45\u5ea6\u8f83\u5c0f\u4f46\u4ecd\u5f88\u4e00\u81f4\u3002"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ Section 7 ============ */}
        <h2>
          {t(
            "7. Results: Coding, Reasoning, and Sample Efficiency",
            "7. \u5b9e\u9a8c\u7ed3\u679c\uff1a\u7f16\u7a0b\u3001\u63a8\u7406\u4e0e\u6837\u672c\u6548\u7387"
          )}
        </h2>

        <p>
          {t(
            "Gloeckle et al. train a series of models (370M, 1.3B, 3B, 7B, and 13B parameters) on code and text corpora, comparing standard NTP against MTP with k = 4. Key findings:",
            "Gloeckle \u7b49\u4eba\u5728\u4ee3\u7801\u548c\u6587\u672c\u8bed\u6599\u4e0a\u8bad\u7ec3\u4e86\u4e00\u7cfb\u5217\u6a21\u578b\uff08370M\u30011.3B\u30013B\u30017B \u548c 13B \u53c2\u6570\uff09\uff0c\u5c06\u6807\u51c6 NTP \u4e0e k = 4 \u7684 MTP \u8fdb\u884c\u5bf9\u6bd4\u3002\u4e3b\u8981\u53d1\u73b0\uff1a"
          )}
        </p>

        <div className="my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800/60">
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Benchmark", "\u57fa\u51c6")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("NTP (baseline)", "NTP \u57fa\u7ebf")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("MTP k=4", "MTP k=4")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center">
                  {t("Gain", "\u63d0\u5347")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("HumanEval (code)", "HumanEval\uff08\u4ee3\u7801\uff09")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-paper-600 dark:text-paper-400">
                  ~39%
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center font-semibold text-green-700 dark:text-green-400">
                  ~46%
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-green-700 dark:text-green-400">
                  +7 pp
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-800/20">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("MBPP (code)", "MBPP\uff08\u4ee3\u7801\uff09")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-paper-600 dark:text-paper-400">
                  ~52%
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center font-semibold text-green-700 dark:text-green-400">
                  ~58%
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-green-700 dark:text-green-400">
                  +6 pp
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Algorithmic reasoning (byte ops)", "\u7b97\u6cd5\u63a8\u7406\uff08\u5b57\u8282\u64cd\u4f5c\uff09")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-paper-600 dark:text-paper-400">
                  baseline
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center font-semibold text-green-700 dark:text-green-400">
                  {t("significantly higher", "\u663e\u8457\u66f4\u9ad8")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-green-700 dark:text-green-400">
                  ++
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-800/20">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Natural language perplexity", "\u81ea\u7136\u8bed\u8a00\u56f0\u60d1\u5ea6")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-paper-600 dark:text-paper-400">
                  baseline
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center font-semibold text-green-700 dark:text-green-400">
                  {t("slightly better", "\u5c0f\u5e45\u63d0\u5347")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-green-700 dark:text-green-400">
                  +
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Inference throughput (code)", "\u63a8\u7406\u5438\u5c71\u91cf\uff08\u4ee3\u7801\uff09")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-paper-600 dark:text-paper-400">
                  1\u00d7
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center font-semibold text-green-700 dark:text-green-400">
                  ~3\u00d7
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-center text-green-700 dark:text-green-400">
                  3\u00d7
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-paper-500 dark:text-paper-500 mt-2">
            {t(
              "Approximate numbers from the paper; exact values vary by model size and task.",
              "\u6765\u81ea\u8bba\u6587\u7684\u8fd1\u4f3c\u6570\u5b57\uff1b\u786e\u5207\u6570\u5b57\u56e0\u6a21\u578b\u5927\u5c0f\u548c\u4efb\u52a1\u800c\u5f02\u3002"
            )}
          </p>
        </div>

        <p>
          {t(
            "Sample efficiency is a particularly striking result. When training on a fixed compute budget, MTP models reach a given perplexity threshold with substantially fewer tokens. Alternatively, with the same number of training tokens, MTP models achieve lower perplexity. This suggests the richer gradient signal leads to more efficient use of each training example.",
            "\u6837\u672c\u6548\u7387\u662f\u5c24\u4e3a\u663e\u8457\u7684\u7ed3\u679c\u3002\u5728\u56fa\u5b9a\u8ba1\u7b97\u9884\u7b97\u4e0b\uff0cMTP \u6a21\u578b\u7528\u663e\u8457\u66f4\u5c11\u7684\u8bcd\u5143\u5c31\u80fd\u8fbe\u5230\u7ed9\u5b9a\u7684\u56f0\u60d1\u5ea6\u9608\u5024\u3002\u53cd\u8fc7\u6765\uff0c\u5728\u76f8\u540c\u8bad\u7ec3\u8bcd\u5143\u6570\u4e0b\uff0cMTP \u6a21\u578b\u80fd\u5b9e\u73b0\u66f4\u4f4e\u7684\u56f0\u60d1\u5ea6\u3002\u8fd9\u8868\u660e\u66f4\u4e30\u5bcc\u7684\u68af\u5ea6\u4fe1\u53f7\u4f7f\u6bcf\u4e2a\u8bad\u7ec3\u6837\u672c\u88ab\u66f4\u9ad8\u6548\u5730\u5229\u7528\u3002"
          )}
        </p>

        <Collapsible
          title={t(
            "Ablations: which choices matter?",
            "\u6d88\u878d\u5b9e\u9a8c\uff1a\u54ea\u4e9b\u9009\u62e9\u5173\u952e\uff1f"
          )}
        >
          <div className="text-sm space-y-3 text-paper-700 dark:text-paper-300">
            <div>
              <span className="font-semibold text-paper-900 dark:text-paper-100">
                {t("Choice of k:", "k \u7684\u9009\u62e9\uff1a")}
              </span>{" "}
              {t(
                "k = 4 consistently outperforms k = 1 (NTP). Gains plateau around k = 4\u20138; larger k provides diminishing returns and costs more memory.",
                "k = 4 \u59cb\u7ec8\u4f18\u4e8e k = 1\uff08NTP\uff09\u3002\u5148\u5728 k = 4\u20138 \u5de6\u53f3\u6536\u76ca\u8d8b\u4e8e\u5e73\u9014\uff1b\u66f4\u5927\u7684 k \u6536\u76ca\u9012\u51cf\u4e14\u5185\u5b58\u5f00\u9500\u66f4\u5927\u3002"
              )}
            </div>
            <div>
              <span className="font-semibold text-paper-900 dark:text-paper-100">
                {t("Independent vs. sequential heads:", "\u72ec\u7acb\u5934 vs. \u5e8f\u8d2f\u5934\uff1a")}
              </span>{" "}
              {t(
                "The paper tests an alternative where head n uses the output of head n-1 as additional context. Independent heads perform comparably and are simpler to implement.",
                "\u8bba\u6587\u6d4b\u8bd5\u4e86\u4e00\u79cd\u5907\u9009\u65b9\u6848\uff0c\u5176\u4e2d\u5934 n \u5c06\u5934 n-1 \u7684\u8f93\u51fa\u4f5c\u4e3a\u989d\u5916\u4e0a\u4e0b\u6587\u3002\u72ec\u7acb\u5934\u6027\u80fd\u76f8\u5f53\uff0c\u5b9e\u73b0\u66f4\u7b80\u5355\u3002"
              )}
            </div>
            <div>
              <span className="font-semibold text-paper-900 dark:text-paper-100">
                {t("Training from scratch vs. continued pre-training:", "\u4ece\u5934\u8bad\u7ec3 vs. \u7ee7\u7eed\u9884\u8bad\u7ec3\uff1a")}
              </span>{" "}
              {t(
                "MTP provides larger benefits when trained from scratch. Adding MTP heads to a standard pre-trained model mid-training still helps, but less so.",
                "\u4ece\u5934\u8bad\u7ec3\u65f6 MTP \u63d0\u5347\u66f4\u5927\u3002\u5728\u8bad\u7ec3\u4e2d\u9014\u5c06 MTP \u5934\u6dfb\u52a0\u5230\u6807\u51c6\u9884\u8bad\u7ec3\u6a21\u578b\u4e2d\u4e5f\u6709\u5e2e\u52a9\uff0c\u4f46\u6548\u679c\u8f83\u5c0f\u3002"
              )}
            </div>
          </div>
        </Collapsible>

        {/* ============ Back link ============ */}
        <div className="mt-12 pt-8 border-t border-paper-200 dark:border-paper-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 hover:underline"
          >
            \u2190 {t("Back to all papers", "\u8fd4\u56de\u6240\u6709\u8bba\u6587")}
          </Link>
        </div>
      </article>
    </div>
  );
}
