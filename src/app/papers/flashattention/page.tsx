"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function FlashAttentionPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
            "FlashAttention: \u5177\u6709 IO \u611f\u77e5\u7684\u5feb\u901f\u9ad8\u5185\u5b58\u6548\u7387\u7cbe\u786e\u6ce8\u610f\u529b"
          )}
        </h1>
        <p className="text-paper-800/50">
          Dao et al. &middot; NeurIPS 2022 &middot;{" "}
          <a
            href="https://arxiv.org/abs/2205.14135"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 2205.14135
          </a>
        </p>
      </header>

      <article className="paper-content">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "Standard attention materializes the full N\u00d7N attention matrix in GPU HBM, requiring O(N\u00b2) memory. FlashAttention reorders the computation using tiling: it computes attention in blocks that fit in SRAM (fast cache), never writing the full N\u00d7N matrix to HBM. This achieves exact (not approximate) attention with 2-4\u00d7 speedup and O(N) memory.",
              "\u6807\u51c6\u6ce8\u610f\u529b\u5728 GPU HBM \u4e2d\u5b58\u50a8\u5b8c\u6574\u7684 N\u00d7N \u6ce8\u610f\u529b\u77e9\u9635\uff0c\u9700\u8981 O(N\u00b2) \u5185\u5b58\u3002FlashAttention \u901a\u8fc7\u5206\u5757\u91cd\u65b0\u6392\u5e8f\u8ba1\u7b97\uff1a\u4ee5\u9002\u5408 SRAM\uff08\u5feb\u901f\u7f13\u5b58\uff09\u7684\u5757\u4e3a\u5355\u4f4d\u8ba1\u7b97\u6ce8\u610f\u529b\uff0c\u4ece\u4e0d\u5c06\u5b8c\u6574\u7684 N\u00d7N \u77e9\u9635\u5199\u5165 HBM\u3002\u5b9e\u73b0\u4e86\u7cbe\u786e\uff08\u975e\u8fd1\u4f3c\uff09\u6ce8\u610f\u529b\uff0c2-4 \u500d\u52a0\u901f\uff0cO(N) \u5185\u5b58\u3002"
            )}
          </p>
        </section>

        <FlowChart
          title={t("FlashAttention Method Overview", "FlashAttention \u65b9\u6cd5\u603b\u89c8")}
          steps={[
            {
              title: t(
                "Problem: Standard attention writes N\u00d7N matrix to HBM \u2014 bottleneck is memory bandwidth",
                "\u95ee\u9898\uff1a\u6807\u51c6\u6ce8\u610f\u529b\u5c06 N\u00d7N \u77e9\u9635\u5199\u5165 HBM \u2014 \u5185\u5b58\u5e26\u5bbd\u6210\u4e3a\u74f6\u9888"
              ),
              color: "rose",
            },
            {
              title: t(
                "Key insight: GPU SRAM (fast) is tiny; GPU HBM (slow) is large. Minimize HBM reads/writes.",
                "\u5173\u952e\u6d1e\u5bdf\uff1aGPU SRAM\uff08\u5feb\uff09\u5f88\u5c0f\uff1bGPU HBM\uff08\u6162\uff09\u5f88\u5927\u3002\u6700\u5c0f\u5316 HBM \u8bfb\u5199\u6b21\u6570\u3002"
              ),
              color: "amber",
            },
            {
              title: t(
                "Tiling: Split Q, K, V into blocks that fit in SRAM",
                "\u5206\u5757\uff1a\u5c06 Q\u3001K\u3001V \u5206\u5272\u6210\u9002\u5408 SRAM \u7684\u5757"
              ),
              color: "blue",
              children: [
                {
                  title: t(
                    "Block size B_r \u00d7 B_c",
                    "\u5757\u5927\u5c0f B_r \u00d7 B_c"
                  ),
                  color: "gray",
                },
                {
                  title: t(
                    "Compute partial softmax in SRAM",
                    "\u5728 SRAM \u4e2d\u8ba1\u7b97\u90e8\u5206 softmax"
                  ),
                  color: "gray",
                },
              ],
            },
            {
              title: t(
                "Online softmax: Rescale running max/sum as new blocks arrive",
                "\u5728\u7ebf softmax\uff1a\u968f\u7740\u65b0\u5757\u5230\u6765\uff0c\u5bf9\u8fd0\u884c\u6700\u5927\u5024/\u548c\u8fdb\u884c\u91cd\u65b0\u7f29\u653e"
              ),
              color: "teal",
            },
            {
              title: t(
                "Backward: Recompute attention from tiles (no store of N\u00d7N grad)",
                "\u53cd\u5411\uff1a\u4ece\u5206\u5757\u91cd\u65b0\u8ba1\u7b97\u6ce8\u610f\u529b\uff08\u4e0d\u5b58\u50a8 N\u00d7N \u68af\u5ea6\uff09"
              ),
              color: "purple",
            },
            {
              title: t(
                "Result: 3\u00d7 faster attention, 5-20\u00d7 memory reduction, longer context",
                "\u7ed3\u679c\uff1a\u6ce8\u610f\u529b\u52a0\u901f 3 \u500d\uff0c\u5185\u5b58\u51cf\u5c11 5-20 \u500d\uff0c\u652f\u6301\u66f4\u957f\u4e0a\u4e0b\u6587"
              ),
              color: "green",
            },
          ]}
          arrows={[
            t("Motivates", "\u542f\u53d1"),
            t("Solution strategy", "\u89e3\u51b3\u7b56\u7565"),
            t("Core mechanism", "\u6838\u5fc3\u673a\u5236"),
            t("Enables exact softmax", "\u5b9e\u73b0\u7cbe\u786e softmax"),
            t("Outcome", "\u7ed3\u679c"),
          ]}
          highlights={[
            {
              text: t("Exact attention (not approximate)", "\u7cbe\u786e\u6ce8\u610f\u529b\uff08\u975e\u8fd1\u4f3c\uff09"),
              color: "green",
            },
            {
              text: t("O(N) memory instead of O(N\u00b2)", "O(N) \u5185\u5b58\u800c\u975e O(N\u00b2)"),
              color: "blue",
            },
            {
              text: t("IO-aware algorithm design", "IO \u611f\u77e5\u7b97\u6cd5\u8bbe\u8ba1"),
              color: "purple",
            },
          ]}
        />

        {/* ============ Background ============ */}
        <h2>
          {t(
            "1. Background: Why Standard Attention Is Slow",
            "1. \u80cc\u666f\uff1a\u6807\u51c6\u6ce8\u610f\u529b\u4e3a\u4f55\u7f13\u6162"
          )}
        </h2>

        <p>
          {t(
            "Modern GPUs have two levels of memory with very different bandwidths. SRAM (on-chip cache) is fast but tiny (\u223c20 MB). HBM (high-bandwidth memory, i.e., the main GPU RAM) is large (\u223c40 GB on A100) but comparatively slow.",
            "\u73b0\u4ee3 GPU \u6709\u4e24\u4e2a\u5185\u5b58\u5c42\u7ea7\uff0c\u5e26\u5bbd\u5dee\u5f02\u5f88\u5927\u3002SRAM\uff08\u7247\u4e0a\u7f13\u5b58\uff09\u5feb\u4f46\u5f88\u5c0f\uff08\u223c20 MB\uff09\u3002HBM\uff08\u9ad8\u5e26\u5bbd\u5185\u5b58\uff0c\u5373\u4e3b GPU \u5185\u5b58\uff09\u5927\uff08A100 \u4e0a\u223c40 GB\uff09\u4f46\u76f8\u5bf9\u8f83\u6162\u3002"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Memory type", "\u5185\u5b58\u7c7b\u578b")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Bandwidth", "\u5e26\u5bbd")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Size (A100)", "\u5927\u5c0f\uff08A100\uff09")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  SRAM ({t("on-chip", "\u7247\u4e0a")})
                </td>
                <td className="border border-paper-200 px-4 py-2 text-green-700">
                  ~19 TB/s
                </td>
                <td className="border border-paper-200 px-4 py-2 text-green-700">
                  ~20 MB
                </td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2 font-semibold text-red-700">
                  HBM ({t("off-chip", "\u7247\u5916")})
                </td>
                <td className="border border-paper-200 px-4 py-2 text-red-700">
                  ~2 TB/s
                </td>
                <td className="border border-paper-200 px-4 py-2 text-red-700">
                  ~40 GB
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "Standard attention performs three round-trips through HBM for each sequence. Every intermediate result — the raw score matrix S, the softmax probability matrix P — is written to HBM and read back:",
            "\u6807\u51c6\u6ce8\u610f\u529b\u5bf9\u6bcf\u4e2a\u5e8f\u5217\u6267\u884c\u4e09\u6b21 HBM \u5f80\u8fd4\u3002\u6bcf\u4e2a\u4e2d\u95f4\u7ed3\u679c \u2014 \u539f\u59cb\u5206\u6570\u77e9\u9635 S\u3001softmax \u6982\u7387\u77e9\u9635 P \u2014 \u90fd\u88ab\u5199\u5165 HBM \u5e76\u8bfb\u56de\uff1a"
          )}
        </p>

        <Collapsible
          title={t(
            "Standard attention: all 3 steps go through HBM",
            "\u6807\u51c6\u6ce8\u610f\u529b\uff1a\u6240\u67093\u4e2a\u6b65\u9aa4\u90fd\u8fc7 HBM"
          )}
          defaultOpen
        >
          <div className="text-sm space-y-2">
            <div className="p-3 bg-red-50 rounded border border-red-200 space-y-1">
              <div>
                <strong>{t("Step 1:", "\u6b65\u9aa41\uff1a")}</strong>{" "}
                {t(
                  "Load Q, K from HBM \u2192 compute S = QK\u1d40 \u2192 write S to HBM",
                  "\u4ece HBM \u52a0\u8f7d Q\u3001K \u2192 \u8ba1\u7b97 S = QK\u1d40 \u2192 \u5c06 S \u5199\u5165 HBM"
                )}
              </div>
              <div>
                <strong>{t("Step 2:", "\u6b65\u9aa42\uff1a")}</strong>{" "}
                {t(
                  "Load S from HBM \u2192 compute P = softmax(S) \u2192 write P to HBM",
                  "\u4ece HBM \u52a0\u8f7d S \u2192 \u8ba1\u7b97 P = softmax(S) \u2192 \u5c06 P \u5199\u5165 HBM"
                )}
              </div>
              <div>
                <strong>{t("Step 3:", "\u6b65\u9aa43\uff1a")}</strong>{" "}
                {t(
                  "Load P, V from HBM \u2192 compute O = PV \u2192 write O to HBM",
                  "\u4ece HBM \u52a0\u8f7d P\u3001V \u2192 \u8ba1\u7b97 O = PV \u2192 \u5c06 O \u5199\u5165 HBM"
                )}
              </div>
            </div>
            <div className="p-3 bg-paper-100 rounded text-paper-800/70">
              {t(
                "Total HBM reads/writes: O(N\u00b2) — this is the bottleneck, not compute!",
                "\u603b HBM \u8bfb\u5199\uff1aO(N\u00b2) \u2014 \u8fd9\u624d\u662f\u74f6\u9888\uff0c\u800c\u4e0d\u662f\u8ba1\u7b97\u672c\u8eab\uff01"
              )}
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "For sequence length N = 4096, the attention matrix S has 4096\u00b2 = 16,777,216 elements. At FP16, that is 32 MB just for S alone — already larger than SRAM. The bottleneck is not arithmetic throughput but memory bandwidth.",
            "\u5bf9\u4e8e\u5e8f\u5217\u957f\u5ea6 N = 4096\uff0c\u6ce8\u610f\u529b\u77e9\u9635 S \u6709 4096\u00b2 = 16,777,216 \u4e2a\u5143\u7d20\u3002\u4ee5 FP16 \u8ba1\u7b97\uff0c\u4ec5 S \u5c31\u9700\u8981 32 MB \u2014 \u5df2\u7ecf\u8d85\u8fc7\u4e86 SRAM\u3002\u74f6\u9888\u4e0d\u5728\u4e8e\u7b97\u6570\u541e\u5410\u91cf\uff0c\u800c\u5728\u4e8e\u5185\u5b58\u5e26\u5bbd\u3002"
          )}
        </p>

        {/* ============ Core Method ============ */}
        <h2>
          {t("2. The Tiling Approach", "2. \u5206\u5757\u65b9\u6cd5")}
        </h2>

        <p>
          {t(
            "FlashAttention tiles Q, K, V into blocks that each fit in SRAM, computes attention entirely within SRAM for each pair of blocks, and accumulates into the output without ever materializing the full N\u00d7N matrix in HBM.",
            "FlashAttention \u5c06 Q\u3001K\u3001V \u5206\u5757\uff0c\u4f7f\u6bcf\u4e2a\u5757\u90fd\u80fd\u88c5\u5165 SRAM\uff0c\u5bf9\u6bcf\u5bf9\u5757\u5b8c\u5168\u5728 SRAM \u4e2d\u8ba1\u7b97\u6ce8\u610f\u529b\uff0c\u5e76\u9010\u6b65\u7d2f\u52a0\u5230\u8f93\u51fa\u4e2d\uff0c\u5c06\u5b8c\u6574\u7684 N\u00d7N \u77e9\u9635\u59cb\u7ec8\u4e0d\u4f1a\u5b9e\u4f53\u5316\u5230 HBM \u4e2d\u3002"
          )}
        </p>

        <Math
          display
          label={t("Block tile decomposition", "\u5757\u5206\u5272\u5206\u89e3")}
          tex="Q = [Q_1, \ldots, Q_{T_r}], \quad K = [K_1, \ldots, K_{T_c}], \quad V = [V_1, \ldots, V_{T_c}]"
        />

        <Collapsible
          title={t("FlashAttention inner loop (pseudocode)", "FlashAttention \u5185\u5faa\u73af\uff08\u4f2a\u4ee3\u7801\uff09")}
          defaultOpen
        >
          <div className="text-sm space-y-2">
            <div className="font-mono text-xs p-3 bg-paper-100 rounded border border-paper-200 space-y-1">
              <div className="text-paper-800/60">{t("# Load Q block into SRAM once", "# \u5c06 Q \u5757\u52a0\u8f7d\u5230 SRAM \u4e00\u6b21")}</div>
              <div><strong>{t("for", "\u5bf9\u4e8e")}</strong> i {t("in", "\u4e2d\u7684")} 1..T_r:</div>
              <div className="pl-4 text-blue-800">{t("Load Q_i from HBM to SRAM", "\u4ece HBM \u52a0\u8f7d Q_i \u5230 SRAM")}</div>
              <div className="pl-4"><strong>{t("for", "\u5bf9\u4e8e")}</strong> j {t("in", "\u4e2d\u7684")} 1..T_c:</div>
              <div className="pl-8 text-blue-800">{t("Load K_j, V_j from HBM to SRAM", "\u4ece HBM \u52a0\u8f7d K_j\u3001V_j \u5230 SRAM")}</div>
              <div className="pl-8">{t("Compute S_ij = Q_i K_j\u1d40 (in SRAM)", "\u8ba1\u7b97 S_ij = Q_i K_j\u1d40\uff08\u5728 SRAM \u4e2d\uff09")}</div>
              <div className="pl-8">{t("Update running max m and sum \u2113 (online softmax)", "\u66f4\u65b0\u8fd0\u884c\u6700\u5927\u5024 m \u548c\u548c \u2113\uff08\u5728\u7ebf softmax\uff09")}</div>
              <div className="pl-8">{t("Accumulate O_i += rescaled(softmax(S_ij) \u00b7 V_j) (in SRAM)", "\u7d2f\u52a0 O_i += rescaled(softmax(S_ij) \u00b7 V_j)\uff08\u5728 SRAM \u4e2d\uff09")}</div>
              <div className="pl-4 text-green-800">{t("Write O_i to HBM (once per Q block)", "\u5c06 O_i \u5199\u5165 HBM\uff08\u6bcf\u4e2a Q \u5757\u4e00\u6b21\uff09")}</div>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-200 text-xs">
              {t(
                "HBM reads/writes: O(N) total — S and P are never materialized in HBM!",
                "\u603b HBM \u8bfb\u5199\uff1aO(N) \u2014 S \u548c P \u5c06\u6c38\u8fdc\u4e0d\u4f1a\u5728 HBM \u4e2d\u5b9e\u4f53\u5316\uff01"
              )}
            </div>
          </div>
        </Collapsible>

        {/* ============ Online Softmax ============ */}
        <h2>
          {t("3. The Online Softmax Trick", "3. \u5728\u7ebf Softmax \u6280\u5de7")}
        </h2>

        <p>
          {t(
            "Softmax normally requires a two-pass algorithm: first compute the maximum value across all scores (for numerical stability), then compute the exponentials and sum. This requires seeing all N values before producing any output — incompatible with tiling.",
            "Softmax \u901a\u5e38\u9700\u8981\u4e24\u6b21\u904d\u5386\uff1a\u9996\u5148\u8ba1\u7b97\u6240\u6709\u5206\u6570\u7684\u6700\u5927\u5024\uff08\u6570\u5b57\u7a33\u5b9a\u6027\uff09\uff0c\u7136\u540e\u8ba1\u7b97\u6307\u6570\u548c\u548c\u3002\u8fd9\u9700\u8981\u5728\u4ea7\u751f\u4efb\u4f55\u8f93\u51fa\u524d\u770b\u5230\u6240\u6709 N \u4e2a\u503c \u2014 \u4e0e\u5206\u5757\u4e0d\u517c\u5bb9\u3002"
          )}
        </p>

        <p>
          {t(
            "The online softmax trick maintains a running maximum m and a running sum \u2113 as blocks arrive, and rescales the accumulated output O each time the maximum estimate is updated:",
            "\u5728\u7ebf softmax \u6280\u5de7\u968f\u7740\u5757\u7684\u5230\u6765\u7ef4\u62a4\u4e00\u4e2a\u8fd0\u884c\u6700\u5927\u5024 m \u548c\u4e00\u4e2a\u8fd0\u884c\u548c \u2113\uff0c\u5e76\u5728\u6bcf\u6b21\u66f4\u65b0\u6700\u5927\u5024\u4f30\u8ba1\u65f6\u5bf9\u7d2f\u79ef\u8f93\u51fa O \u8fdb\u884c\u91cd\u65b0\u7f29\u653e\uff1a"
          )}
        </p>

        <Math
          display
          label={t("Online max update", "\u5728\u7ebf\u6700\u5927\u5024\u66f4\u65b0")}
          tex="m_\text{new} = \max(m_\text{old},\; \max(s_\text{block}))"
        />

        <Math
          display
          label={t("Online sum rescale", "\u5728\u7ebf\u548c\u91cd\u65b0\u7f29\u653e")}
          tex="\ell_\text{new} = e^{m_\text{old} - m_\text{new}} \cdot \ell_\text{old} + \sum_j e^{s_{\text{block},j} - m_\text{new}}"
        />

        <Math
          display
          label={t("Online output accumulation", "\u5728\u7ebf\u8f93\u51fa\u7d2f\u52a0")}
          tex="O_\text{new} = \frac{e^{m_\text{old} - m_\text{new}} \cdot \ell_\text{old} \cdot O_\text{old} + e^{s_\text{block} - m_\text{new}} \cdot V_\text{block}}{\ell_\text{new}}"
        />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Why this is exact:", "\u4e3a\u4ec0\u4e48\u8fd9\u662f\u7cbe\u786e\u7684\uff1a")}</strong>{" "}
            {t(
              "Each update is a mathematically equivalent rescaling of the previous partial result. When all blocks have been processed, O contains exactly the same value as standard attention — not an approximation. The trick only reorganizes the order of arithmetic operations.",
              "\u6bcf\u6b21\u66f4\u65b0\u90fd\u662f\u5bf9\u4e4b\u524d\u90e8\u5206\u7ed3\u679c\u7684\u6570\u5b66\u7b49\u4ef7\u91cd\u7f29\u653e\u3002\u5f53\u6240\u6709\u5757\u5904\u7406\u5b8c\u6bd5\u540e\uff0cO \u5305\u542b\u4e0e\u6807\u51c6\u6ce8\u610f\u529b\u5b8c\u5168\u76f8\u540c\u7684\u5024 \u2014 \u800c\u4e0d\u662f\u8fd1\u4f3c\u3002\u8fd9\u4e2a\u6280\u5de7\u53ea\u662f\u91cd\u65b0\u7ec4\u7ec7\u4e86\u7b97\u6570\u8fd0\u7b97\u7684\u987a\u5e8f\u3002"
            )}
          </p>
        </div>

        {/* ============ Concrete Example ============ */}
        <h2>
          {t(
            "4. Concrete Example: Tiling with N=4, Block Size=2",
            "4. \u5177\u4f53\u793a\u4f8b\uff1aN=4\u3001\u5757\u5927\u5c0f=2 \u7684\u5206\u5757"
          )}
        </h2>

        <Collapsible
          title={t(
            "Step-by-step tiled attention for sequence length 4",
            "\u5e8f\u5217\u957f\u5ea6\u4e3a 4 \u7684\u9010\u6b65\u5206\u5757\u6ce8\u610f\u529b"
          )}
          defaultOpen
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Query sequence: [q1, q2, q3, q4], Key sequence: [k1, k2, k3, k4]",
                "\u67e5\u8be2\u5e8f\u5217\uff1a[q1, q2, q3, q4]\uff0c\u952e\u5e8f\u5217\uff1a[k1, k2, k3, k4]"
              )}
            </p>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <strong>{t("Block 1 (q1,q2 attend to k1,k2):", "\u5757 1\uff08q1,q2 \u5173\u6ce8 k1,k2\uff09\uff1a")}</strong>
              <div className="mt-1 font-mono text-xs space-y-1">
                <div>{t("Load Q[1:2], K[1:2], V[1:2] into SRAM", "\u5c06 Q[1:2]\u3001K[1:2]\u3001V[1:2] \u52a0\u8f7d\u5230 SRAM")}</div>
                <div>{t("Compute S_11 = Q[1:2] \u00b7 K[1:2]\u1d40", "\u8ba1\u7b97 S_11 = Q[1:2] \u00b7 K[1:2]\u1d40")}</div>
                <div>{t("Set m1 = max(S_11), \u2113_1 = sum of exp(S_11 - m1)", "\u8bbe m1 = max(S_11)\uff0c\u2113_1 = sum(exp(S_11 - m1))")}</div>
                <div>{t("O[1:2] = exp(S_11 - m1) \u00b7 V[1:2] / \u2113_1", "O[1:2] = exp(S_11 - m1) \u00b7 V[1:2] / \u2113_1")}</div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <strong>{t("Block 2 (q1,q2 attend to k3,k4):", "\u5757 2\uff08q1,q2 \u5173\u6ce8 k3,k4\uff09\uff1a")}</strong>
              <div className="mt-1 font-mono text-xs space-y-1">
                <div>{t("Load K[3:4], V[3:4] into SRAM (Q[1:2] stays)", "\u5c06 K[3:4]\u3001V[3:4] \u52a0\u8f7d\u5230 SRAM\uff08Q[1:2] \u4fdd\u7559\uff09")}</div>
                <div>{t("Compute S_12 = Q[1:2] \u00b7 K[3:4]\u1d40", "\u8ba1\u7b97 S_12 = Q[1:2] \u00b7 K[3:4]\u1d40")}</div>
                <div>{t("m2 = max(m1, max(S_12)), rescale \u2113_1, merge into \u2113_2", "m2 = max(m1, max(S_12))\uff0c\u91cd\u7f29\u653e \u2113_1\uff0c\u5408\u5e76\u5230 \u2113_2")}</div>
                <div>{t("Rescale O[1:2] by exp(m1 - m2), add new contribution", "\u5c06 O[1:2] \u4e58\u4ee5 exp(m1 - m2)\uff0c\u52a0\u5165\u65b0\u8d21\u732e")}</div>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <strong>{t("Final O[1:2] = exact softmax attention over all 4 keys!", "\u6700\u7ec8 O[1:2] = \u5bf9\u6240\u6709 4 \u4e2a\u952e\u7684\u7cbe\u786e softmax \u6ce8\u610f\u529b\uff01")}</strong>
              <div className="mt-1 text-xs text-green-800">
                {t(
                  "Never wrote S or P to HBM. Only read each K, V block once.",
                  "\u4ece\u672a\u5c06 S \u6216 P \u5199\u5165 HBM\u3002\u6bcf\u4e2a K\u3001V \u5757\u53ea\u8bfb\u53d6\u4e00\u6b21\u3002"
                )}
              </div>
            </div>
          </div>
        </Collapsible>

        {/* ============ Backward Pass ============ */}
        <h2>
          {t("5. Backward Pass: Recomputation", "5. \u53cd\u5411\u4f20\u64ad\uff1a\u91cd\u65b0\u8ba1\u7b97")}
        </h2>

        <p>
          {t(
            "For backpropagation, standard attention needs to store the N\u00d7N attention matrix P to compute gradients. FlashAttention instead stores only the output O and the per-row softmax statistics (m, \u2113) — O(N) total — and recomputes the attention tiles on the fly during the backward pass.",
            "\u5bf9\u4e8e\u53cd\u5411\u4f20\u64ad\uff0c\u6807\u51c6\u6ce8\u610f\u529b\u9700\u8981\u5b58\u50a8 N\u00d7N \u6ce8\u610f\u529b\u77e9\u9635 P \u6765\u8ba1\u7b97\u68af\u5ea6\u3002FlashAttention \u4ee3\u4e4b\u5b58\u50a8\u8f93\u51fa O \u548c\u6bcf\u884c\u7684 softmax \u7edf\u8ba1\u4fe1\u606f\uff08m\u3001\u2113\uff09\u2014 \u5171 O(N) \u2014 \u5e76\u5728\u53cd\u5411\u4f20\u64ad\u671f\u95f4\u5373\u65f6\u91cd\u65b0\u8ba1\u7b97\u6ce8\u610f\u529b\u5206\u5757\u3002"
          )}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Trade-off:", "\u6743\u8861\uff1a")}</strong>{" "}
            {t(
              "Recomputation requires additional FLOPs in the backward pass (roughly 2\u00d7 the FLOPs of the forward pass), but this is cheaper than the HBM bandwidth cost of storing and loading the N\u00d7N matrix. On modern hardware, attention is memory-bandwidth-bound, not compute-bound.",
              "\u91cd\u65b0\u8ba1\u7b97\u5728\u53cd\u5411\u4f20\u64ad\u4e2d\u9700\u8981\u989d\u5916\u7684 FLOP\uff08\u5927\u7ea6\u662f\u524d\u5411\u4f20\u64ad\u7684 2 \u500d\uff09\uff0c\u4f46\u8fd9\u6bd4\u5b58\u50a8\u548c\u52a0\u8f7d N\u00d7N \u77e9\u9635\u7684 HBM \u5e26\u5bbd\u6210\u672c\u66f4\u4fbf\u5b9c\u3002\u5728\u73b0\u4ee3\u786c\u4ef6\u4e0a\uff0c\u6ce8\u610f\u529b\u53d7\u5185\u5b58\u5e26\u5bbd\u9650\u5236\uff0c\u800c\u975e\u8ba1\u7b97\u9650\u5236\u3002"
            )}
          </p>
        </div>

        {/* ============ Memory Complexity ============ */}
        <h2>
          {t("6. Memory Complexity", "6. \u5185\u5b58\u590d\u6742\u5ea6")}
        </h2>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("What is stored", "\u5b58\u50a8\u5185\u5901")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Standard attention", "\u6807\u51c6\u6ce8\u610f\u529b")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("FlashAttention", "FlashAttention")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Score matrix S", "\u5206\u6570\u77e9\u9635 S")}
                </td>
                <td className="border border-paper-200 px-4 py-2 text-red-600">
                  O(N&sup2;)
                </td>
                <td className="border border-paper-200 px-4 py-2 text-green-600">
                  {t("never stored", "\u4ece\u4e0d\u5b58\u50a8")}
                </td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">
                  {t("Probability matrix P", "\u6982\u7387\u77e9\u9635 P")}
                </td>
                <td className="border border-paper-200 px-4 py-2 text-red-600">
                  O(N&sup2;)
                </td>
                <td className="border border-paper-200 px-4 py-2 text-green-600">
                  {t("never stored", "\u4ece\u4e0d\u5b58\u50a8")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Output O", "\u8f93\u51fa O")}
                </td>
                <td className="border border-paper-200 px-4 py-2">O(Nd)</td>
                <td className="border border-paper-200 px-4 py-2">O(Nd)</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">
                  {t("Softmax statistics (m, \u2113)", "Softmax \u7edf\u8ba1\u4fe1\u606f\uff08m\u3001\u2113\uff09")}
                </td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("implicit in P", "\u9690\u542b\u5728 P \u4e2d")}
                </td>
                <td className="border border-paper-200 px-4 py-2">O(N)</td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2 font-semibold">
                  {t("Total", "\u603b\u8ba1")}
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-red-600">
                  O(N&sup2;)
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-600">
                  O(N)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ============ Results ============ */}
        <h2>{t("7. Results", "7. \u7ed3\u679c")}</h2>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Method", "\u65b9\u6cd5")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Seq len 2K", "\u5e8f\u5217\u957f\u5ea6 2K")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Seq len 4K", "\u5e8f\u5217\u957f\u5ea6 4K")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Seq len 8K", "\u5e8f\u5217\u957f\u5ea6 8K")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Memory (2K)", "\u5185\u5b58\uff082K\uff09")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Standard", "\u6807\u51c6")}
                </td>
                <td className="border border-paper-200 px-4 py-2">1.0&times;</td>
                <td className="border border-paper-200 px-4 py-2">1.0&times;</td>
                <td className="border border-paper-200 px-4 py-2 text-red-600">OOM</td>
                <td className="border border-paper-200 px-4 py-2 text-red-600">O(N&sup2;)</td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  FlashAttention
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  3.1&times;
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  3.8&times;
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  3.5&times;
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  O(N)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul>
          <li>
            <strong>BERT:</strong>{" "}
            {t(
              "15% end-to-end training speedup, 3\u00d7 memory reduction",
              "15% \u7aef\u5230\u7aef\u8bad\u7ec3\u52a0\u901f\uff0c\u5185\u5b58\u51cf\u5c11 3 \u500d"
            )}
          </li>
          <li>
            <strong>GPT-2:</strong>{" "}
            {t(
              "3\u00d7 faster attention operation with identical perplexity",
              "\u6ce8\u610f\u529b\u64cd\u4f5c\u52a0\u901f 3 \u500d\uff0c\u56f0\u60d1\u5ea6\u76f8\u540c"
            )}
          </li>
          <li>
            <strong>{t("Long context:", "\u957f\u4e0a\u4e0b\u6587\uff1a")}</strong>{" "}
            {t(
              "Enables 64K context length training, compared to the ~2K practical limit of standard attention on the same hardware",
              "\u652f\u6301 64K \u4e0a\u4e0b\u6587\u957f\u5ea6\u8bad\u7ec3\uff0c\u800c\u540c\u7b49\u786c\u4ef6\u4e0a\u6807\u51c6\u6ce8\u610f\u529b\u7684\u5b9e\u9645\u9650\u5236\u4e3a ~2K"
            )}
          </li>
        </ul>

        {/* ============ Limitations ============ */}
        <h2>{t("8. Limitations", "8. \u5c40\u9650\u6027")}</h2>

        <ul>
          <li>
            <strong>{t("CUDA-specific:", "\u7279\u5b9a\u4e8e CUDA\uff1a")}</strong>{" "}
            {t(
              "The original FlashAttention is a hand-written CUDA kernel. It is not automatically available in all deep learning frameworks without explicit integration.",
              "\u539f\u59cb FlashAttention \u662f\u624b\u5199\u7684 CUDA \u5185\u6838\u3002\u5b83\u4e0d\u4f1a\u81ea\u52a8\u5e94\u7528\u4e8e\u6240\u6709\u6df1\u5ea6\u5b66\u4e60\u6846\u67b6\uff0c\u9700\u8981\u660e\u786e\u96c6\u6210\u3002"
            )}
          </li>
          <li>
            <strong>{t("Hardware-dependent block sizes:", "\u4f9d\u8d56\u786c\u4ef6\u7684\u5757\u5927\u5c0f\uff1a")}</strong>{" "}
            {t(
              "Optimal block sizes depend on the specific GPU's SRAM capacity, requiring tuning per hardware target.",
              "\u6700\u4f18\u5757\u5927\u5c0f\u53d6\u51b3\u4e8e\u7279\u5b9a GPU \u7684 SRAM \u5bb9\u91cf\uff0c\u9700\u8981\u9488\u5bf9\u6bcf\u4e2a\u786c\u4ef6\u76ee\u6807\u8fdb\u884c\u8c03\u6574\u3002"
            )}
          </li>
          <li>
            <strong>{t("GPU utilization:", "GPU \u5229\u7528\u7387\uff1a")}</strong>{" "}
            {t(
              "FlashAttention-1 did not fully utilize GPU compute units. FlashAttention-2 and FlashAttention-3 addressed this with further parallelism and warp-level optimizations.",
              "FlashAttention-1 \u672a\u5145\u5206\u5229\u7528 GPU \u8ba1\u7b97\u5355\u5143\u3002FlashAttention-2 \u548c FlashAttention-3 \u901a\u8fc7\u8fdb\u4e00\u6b65\u7684\u5e76\u884c\u5ea6\u548c warp \u7ea7\u4f18\u5316\u89e3\u51b3\u4e86\u8fd9\u4e2a\u95ee\u9898\u3002"
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
                "FlashAttention is a drop-in replacement for the O(N\u00b2) scaled dot-product attention introduced in this paper. It computes exactly the same mathematical operation, just with a dramatically better IO pattern.",
                "FlashAttention \u662f\u672c\u6587\u5f15\u5165\u7684 O(N\u00b2) \u7f29\u653e\u70b9\u79ef\u6ce8\u610f\u529b\u7684\u76f4\u63a5\u66ff\u4ee3\u54c1\u3002\u5b83\u8ba1\u7b97\u5b8c\u5168\u76f8\u540c\u7684\u6570\u5b66\u8fd0\u7b97\uff0c\u53ea\u662f\u5177\u6709\u6781\u5927\u6539\u5584\u7684 IO \u6a21\u5f0f\u3002"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/lora`}
              className="font-semibold text-blue-600 hover:underline"
            >
              LoRA
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Frequently combined in practice: LoRA reduces the number of trainable parameters while FlashAttention reduces the memory and time cost of each forward pass. Together they enable fine-tuning large models on limited hardware.",
                "\u5b9e\u8df5\u4e2d\u7ecf\u5e38\u7ed3\u5408\u4f7f\u7528\uff1aLoRA \u51cf\u5c11\u53ef\u8bad\u7ec3\u53c2\u6570\u7684\u6570\u91cf\uff0c\u800c FlashAttention \u51cf\u5c11\u6bcf\u6b21\u524d\u5411\u4f20\u64ad\u7684\u5185\u5b58\u548c\u65f6\u95f4\u5f00\u9500\u3002\u4e24\u8005\u7ed3\u5408\u5f00\u542f\u4e86\u5728\u6709\u9650\u786c\u4ef6\u4e0a\u5fae\u8c03\u5927\u6a21\u578b\u7684\u53ef\u80fd\u3002"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link
              href={`${basePath}/papers/llada`}
              className="font-semibold text-blue-600 hover:underline"
            >
              LLaDA
            </Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Masked diffusion language models like LLaDA rely on FlashAttention for efficient training at scale, since they perform many forward passes per training step.",
                "\u50cf LLaDA \u8fd9\u6837\u7684\u63a9\u853d\u6269\u6563\u8bed\u8a00\u6a21\u578b\u4f9d\u8d56 FlashAttention \u5b9e\u73b0\u5927\u89c4\u6a21\u9ad8\u6548\u8bad\u7ec3\uff0c\u56e0\u4e3a\u5b83\u4eec\u5728\u6bcf\u4e2a\u8bad\u7ec3\u6b65\u9aa4\u4e2d\u6267\u884c\u591a\u6b21\u524d\u5411\u4f20\u64ad\u3002"
              )}
            </p>
          </div>
        </div>

        <h2>
          {t("10. Additional Resources", "10. \u8865\u5145\u8d44\u6e90")}
        </h2>
        <div className="space-y-2 my-4">
          <a
            href="https://arxiv.org/abs/2205.14135"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">FlashAttention (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Original paper", "\u539f\u59cb\u8bba\u6587")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/2307.08691"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">FlashAttention-2 (Dao 2023)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t(
                "Better parallelism and work partitioning for higher GPU utilization",
                "\u66f4\u597d\u7684\u5e76\u884c\u6027\u548c\u5de5\u4f5c\u5212\u5206\uff0c\u63d0\u9ad8 GPU \u5229\u7528\u7387"
              )}
            </span>
          </a>
          <a
            href="https://tridao.me/blog/2024/flash3/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">FlashAttention-3 (2024)</span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t(
                "Hopper GPU optimizations: TMA, warp specialization, FP8 support",
                "Hopper GPU \u4f18\u5316\uff1aTMA\u3001warp \u4e13\u9577\u5316\u3001FP8 \u652f\u6301"
              )}
            </span>
          </a>
        </div>
      </article>
    </div>
  );
}
