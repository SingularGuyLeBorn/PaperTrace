"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function VLAEPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Variational Lossy Autoencoder",
            "变分有损自编码器"
          )}
        </h1>
        <p className="text-paper-800/50">
          Xi Chen, Diederik P. Kingma, Tim Salimans, Yan Duan, Prafulla Dhariwal, John Schulman, Ilya Sutskever, Pieter Abbeel &middot; ICLR 2017 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1611.02731"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1611.02731
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "When you pair a VAE with a powerful autoregressive decoder (like PixelCNN), the decoder learns to model everything locally and the latent code z becomes useless — a phenomenon called posterior collapse. VLAE fixes this by restricting what the decoder can see, forcing z to carry global structure. The key insight: treat generation as lossy compression — z encodes the 'important' global information, and the decoder fills in local details. This yields a principled rate-distortion tradeoff and significantly richer latent representations.",
              "当你将 VAE 与强大的自回归解码器（如 PixelCNN）结合时，解码器会学会从局部建模一切，潜在编码 z 因此变得无用——这种现象称为后验坍塌。VLAE 通过限制解码器能看到的内容来解决这一问题，迫使 z 携带全局结构。核心洞见：将生成视为有损压缩——z 编码」重要的「全局信息，解码器填充局部细节。这产生了有原则的率失真权衡，并获得了显著更丰富的潜在表示。"
            )}
          </p>
        </section>

        {/* ============ Section 1: VAE Recap ============ */}
        <h2>{t("1. VAE Recap", "1. VAE 回顾")}</h2>

        <p>
          {t(
            "A Variational Autoencoder (VAE) defines a generative model p(x, z) = p(z) p(x|z) and learns an approximate posterior q(z|x) by maximizing the Evidence Lower BOund (ELBO):",
            "变分自编码器（VAE）定义了生成模型 p(x, z) = p(z) p(x|z)，并通过最大化证据下界（ELBO）来学习近似后验 q(z|x)："
          )}
        </p>

        <Math
          display
          label={t("Evidence Lower BOund (ELBO)", "证据下界（ELBO）")}
          tex="\mathcal{L} = \underbrace{\mathbb{E}_{q(z|x)}\bigl[\log p(x \mid z)\bigr]}_{\text{reconstruction}} - \underbrace{D_{\mathrm{KL}}\bigl(q(z \mid x) \;\|\; p(z)\bigr)}_{\text{regularisation}}"
        />

        <p>
          {t(
            "The first term rewards the decoder for reconstructing x well given z. The second term keeps the posterior close to the prior p(z) = N(0, I), acting as a regularizer that forces z to encode useful information.",
            "第一项奖励解码器在给定 z 的情况下很好地重建 x。第二项使后验接近先验 p(z) = N(0, I)，作为正则化器强迫 z 编码有用信息。"
          )}
        </p>

        <Collapsible
          title={t("Variable-by-variable breakdown", "逐变量拆解")}
          defaultOpen
        >
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-2">
              <Math tex="x" />
              <span>
                {t(
                  "Observed data (e.g., an image pixel grid)",
                  "观测数据（例如图像像素网格）"
                )}
              </span>

              <Math tex="z" />
              <span>
                {t(
                  "Latent code — the compressed representation we want to be meaningful",
                  "潜在编码——我们希望其有意义的压缩表示"
                )}
              </span>

              <Math tex="q(z \mid x)" />
              <span>
                {t(
                  "Encoder: maps x to a Gaussian distribution over z, parameterized by a neural network",
                  "编码器：将 x 映射到 z 上的高斯分布，由神经网络参数化"
                )}
              </span>

              <Math tex="p(x \mid z)" />
              <span>
                {t(
                  "Decoder: generates x given z — this is where the trouble starts if it's too powerful",
                  "解码器：在给定 z 的情况下生成 x——如果解码器过于强大，问题就从这里开始"
                )}
              </span>

              <Math tex="D_{\mathrm{KL}}" />
              <span>
                {t(
                  "KL divergence — measures how much information the latent code z carries beyond the prior",
                  "KL 散度——衡量潜在编码 z 超出先验所携带的信息量"
                )}
              </span>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "In the ideal case, the encoder compresses the global structure of x into z, and the decoder uses z to generate a plausible reconstruction. However, this balance breaks down when the decoder is too capable.",
            "在理想情况下，编码器将 x 的全局结构压缩到 z 中，解码器使用 z 生成合理的重建。然而，当解码器过于强大时，这种平衡就会被打破。"
          )}
        </p>

        {/* ============ Section 2: Posterior Collapse ============ */}
        <h2>{t("2. The Posterior Collapse Problem", "2. 后验坍塌问题")}</h2>

        <p>
          {t(
            "Posterior collapse is the failure mode where the encoder ignores x and simply outputs the prior: q(z|x) ≈ p(z). When this happens, the KL term drops to zero, z carries no information about x, and the decoder must reconstruct x from scratch without any useful latent signal.",
            "后验坍塌是编码器忽略 x 并简单地输出先验的失败模式：q(z|x) ≈ p(z)。当这种情况发生时，KL 项降至零，z 不携带任何关于 x 的信息，解码器必须在没有任何有用潜在信号的情况下从头重建 x。"
          )}
        </p>

        <Math
          display
          label={t("Posterior collapse condition", "后验坍塌条件")}
          tex="D_{\mathrm{KL}}\bigl(q(z \mid x) \;\|\; p(z)\bigr) \;\to\; 0 \quad \Longrightarrow \quad q(z \mid x) \approx p(z)"
        />

        <p>
          {t(
            "From the ELBO perspective, this is actually locally optimal: when the KL goes to zero, the decoder gets no gradient signal to use z, so it learns to ignore it. The reconstruction term is still maximized — but entirely by the decoder's own capacity, not by exploiting z.",
            "从 ELBO 的角度来看，这实际上是局部最优的：当 KL 降至零时，解码器没有梯度信号来使用 z，因此它学会了忽略它。重建项仍然被最大化——但完全靠解码器自身的能力，而不是利用 z。"
          )}
        </p>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg my-6">
          <p className="text-sm text-amber-900 mb-0">
            <strong>{t("Intuition:", "直觉：")}</strong>{" "}
            {t(
              "Think of a student (the decoder) who is smart enough to answer all exam questions without looking at the cheat sheet (z). The student simply never develops the habit of consulting it, even if it contains important information. The cheat sheet becomes useless.",
              "想象一个聪明到足以不看小抄（z）就回答所有考试题目的学生（解码器）。这个学生根本就不养成查阅小抄的习惯，即使它包含重要信息。小抄变得毫无用处。"
            )}
          </p>
        </div>

        {/* ============ Section 3: Why Autoregressive Decoders Cause Collapse ============ */}
        <h2>
          {t(
            "3. Why Autoregressive Decoders Cause Collapse",
            "3. 为什么自回归解码器会导致坍塌"
          )}
        </h2>

        <p>
          {t(
            "Autoregressive models like PixelCNN model the joint distribution of pixels by factorizing it as a product of conditionals:",
            "像 PixelCNN 这样的自回归模型通过将其分解为条件概率乘积来建模像素的联合分布："
          )}
        </p>

        <Math
          display
          label={t("Autoregressive factorization", "自回归分解")}
          tex="p(x) = \prod_{i=1}^{D} p(x_i \mid x_1, \ldots, x_{i-1})"
        />

        <p>
          {t(
            "PixelCNN is extremely powerful: given all previous pixels, it can model each next pixel with high fidelity using local convolutional context. The trouble is that this local context is already so rich that z becomes redundant — every pixel can be predicted well from its neighbors alone.",
            "PixelCNN 非常强大：给定所有先前的像素，它可以使用局部卷积上下文以高保真度建模每个下一个像素。问题在于这种局部上下文已经如此丰富，以至于 z 变得多余——每个像素都可以仅从其邻居很好地预测。"
          )}
        </p>

        <p>
          {t(
            "More precisely: the mutual information between x and z in a trained VAE+PixelCNN collapses to near zero:",
            "更精确地说：在训练好的 VAE+PixelCNN 中，x 和 z 之间的互信息崩溃至接近零："
          )}
        </p>

        <Math
          display
          label={t("Mutual information between x and z", "x 和 z 之间的互信息")}
          tex="I(x; z) = \mathbb{E}_{p(x)}\Bigl[\log \frac{q(z \mid x)}{p(z)}\Bigr] \;\approx\; 0"
        />

        <Collapsible
          title={t(
            "Why local context makes z redundant (detailed)",
            "为什么局部上下文使 z 多余（详细说明）"
          )}
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Consider pixel x_i at position i in an image. With a powerful PixelCNN, the conditional p(x_i | x_{<i}) is computed using a large convolutional receptive field over all preceding pixels. This preceding context captures:",
                "考虑图像中位置 i 处的像素 x_i。使用强大的 PixelCNN，条件 p(x_i | x_{<i}) 通过对所有先前像素的大型卷积感受野计算。这个先前上下文捕获了："
              )}
            </p>
            <ul>
              <li>
                {t(
                  "Local texture patterns (edges, gradients, color blobs)",
                  "局部纹理模式（边缘、梯度、颜色块）"
                )}
              </li>
              <li>
                {t(
                  "Medium-range structure (object parts, repeated patterns)",
                  "中等范围结构（物体部件、重复模式）"
                )}
              </li>
              <li>
                {t(
                  "Even long-range correlations if the receptive field is large enough",
                  "如果感受野足够大，甚至包括长程相关性"
                )}
              </li>
            </ul>
            <p>
              {t(
                "If the decoder can exploit this rich local context perfectly, there is no information left that z needs to provide. The optimization then finds a saddle point where KL = 0 and z is ignored, since this still minimizes the ELBO loss.",
                "如果解码器能够完美地利用这种丰富的局部上下文，就没有 z 需要提供的信息了。优化于是找到一个 KL = 0 且 z 被忽略的鞍点，因为这仍然能最小化 ELBO 损失。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 4: The Lossy Compression View ============ */}
        <h2>{t("4. The Lossy Compression View", "4. 有损压缩视角")}</h2>

        <p>
          {t(
            "VLAE reframes the VAE objective through the lens of lossy data compression. In lossy compression, we transmit a compressed representation that allows approximate reconstruction — we deliberately lose some information to save bits.",
            "VLAE 通过有损数据压缩的视角重新框架 VAE 目标。在有损压缩中，我们传输一个允许近似重建的压缩表示——我们故意丢失一些信息来节省比特。"
          )}
        </p>

        <p>
          {t(
            "The bits-back argument (Hinton & van Camp, 1993) provides a coding-theoretic interpretation of the ELBO. The rate R is the number of bits needed to encode z, and the distortion D is the expected reconstruction error:",
            "比特回退论证（Hinton & van Camp，1993）为 ELBO 提供了编码理论解释。率 R 是编码 z 所需的比特数，失真 D 是期望的重建误差："
          )}
        </p>

        <Math
          display
          label={t("Rate: bits used to encode z", "率：编码 z 使用的比特数")}
          tex="R = D_{\mathrm{KL}}\bigl(q(z \mid x) \;\|\; p(z)\bigr)"
        />

        <Math
          display
          label={t("Distortion: expected reconstruction loss", "失真：期望重建损失")}
          tex="D = \mathbb{E}_{q(z|x)}\bigl[-\log p(x \mid z)\bigr]"
        />

        <p>
          {t(
            "The ELBO is simply D + R (with a minus sign, since we maximize the ELBO but minimize D + R). Posterior collapse corresponds to R → 0: we spend zero bits on z, forcing the decoder to reconstruct everything from scratch.",
            "ELBO 简单地就是 D + R（带负号，因为我们最大化 ELBO 但最小化 D + R）。后验坍塌对应于 R → 0：我们在 z 上花零比特，迫使解码器从头重建一切。"
          )}
        </p>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg my-6">
          <p className="text-sm text-green-900 mb-1">
            <strong>
              {t("The VLAE insight:", "VLAE 的洞见：")}
            </strong>
          </p>
          <p className="text-sm text-green-900 mb-0">
            {t(
              "If we restrict the autoregressive decoder so it can only model local details (not global structure), then z must carry the global information — there is no other way to achieve low distortion. The restriction creates an information bottleneck that forces z to be useful.",
              "如果我们限制自回归解码器使其只能建模局部细节（而非全局结构），那么 z 就必须携带全局信息——没有其他方法可以实现低失真。这种限制创造了一个信息瓶颈，迫使 z 变得有用。"
            )}
          </p>
        </div>

        {/* ============ Section 5: Information Preference Design ============ */}
        <h2>{t("5. Information Preference Design", "5. 信息偏好设计")}</h2>

        <p>
          {t(
            "VLAE introduces 'information preference' — a deliberate design choice that controls which types of information are encoded in z versus modeled by the autoregressive decoder. There are two complementary variants:",
            "VLAE 引入了「信息偏好」——一种刻意的设计选择，控制哪些类型的信息被编码在 z 中，哪些由自回归解码器建模。有两个互补的变体："
          )}
        </p>

        <div className="space-y-4 my-6">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">
              {t("Variant 1: Bits-Back Coding View", "变体 1：比特回退编码视角")}
            </h4>
            <p className="text-sm text-paper-800/80">
              {t(
                "The decoder is conditioned on z, but z is chosen to use as few bits as possible (low R). Since R = KL(q||p), minimizing R encourages q(z|x) to stay close to the prior. The information that z carries is only what the decoder strictly needs to achieve good reconstruction that the autoregressive context cannot provide on its own.",
                "解码器以 z 为条件，但 z 被选择为使用尽可能少的比特（低 R）。由于 R = KL(q||p)，最小化 R 鼓励 q(z|x) 接近先验。z 携带的信息只是解码器严格需要的、自回归上下文无法单独提供的内容。"
              )}
            </p>
          </div>

          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <h4 className="font-semibold text-purple-700 mb-2">
              {t("Variant 2: Restricting the Decoder Receptive Field", "变体 2：限制解码器感受野")}
            </h4>
            <p className="text-sm text-paper-800/80">
              {t(
                "Rather than letting PixelCNN see the full preceding context x_{<i}, the decoder is only shown a downsampled or spatially limited version of the context. This deliberately removes global structure from the autoregressive context, so z must carry it instead. For example, the decoder only sees a spatially subsampled grid — it cannot infer global composition from local neighbors alone.",
                "不是让 PixelCNN 看到完整的前序上下文 x_{<i}，而是只向解码器展示下采样或空间受限版本的上下文。这故意从自回归上下文中移除全局结构，因此 z 必须携带它。例如，解码器只看到空间下采样的网格——它不能仅从局部邻居推断全局构成。"
              )}
            </p>
          </div>
        </div>

        <p>
          {t(
            "Concretely, the VLAE decoder architecture uses PixelCNN over a spatially downsampled representation. If the original image is 32×32, the autoregressive model might operate on an 8×8 grid. This means each autoregressive step sees at most the low-resolution context — high-frequency local texture is modeled locally, but low-frequency global layout must come from z.",
            "具体来说，VLAE 解码器架构在空间下采样表示上使用 PixelCNN。如果原始图像是 32×32，自回归模型可能在 8×8 网格上操作。这意味着每个自回归步骤最多看到低分辨率上下文——高频局部纹理在本地建模，但低频全局布局必须来自 z。"
          )}
        </p>

        <Collapsible
          title={t(
            "Full VLAE decoder architecture",
            "完整 VLAE 解码器架构"
          )}
        >
          <div className="text-sm space-y-3">
            <div className="font-mono text-xs p-3 bg-paper-100 rounded border border-paper-200 space-y-1">
              <div className="text-paper-800/60">
                {t("# Input: image x (e.g., 32×32×3)", "# 输入：图像 x（例如 32×32×3）")}
              </div>
              <div>
                <strong>{t("Encoder:", "编码器：")}</strong>{" "}
                {t("x → CNN → μ(z), σ(z) → z ~ q(z|x)", "x → CNN → μ(z), σ(z) → z ~ q(z|x)")}
              </div>
              <div className="mt-2 text-paper-800/60">
                {t("# Decoder: restricted context autoregressive model", "# 解码器：受限上下文自回归模型")}
              </div>
              <div>
                <strong>{t("Downsample:", "下采样：")}</strong>{" "}
                {t("x → x̃ (e.g., 32×32 → 8×8 by strided pooling)", "x → x̃（例如 32×32 → 8×8，步长池化）")}
              </div>
              <div>
                <strong>{t("PixelCNN:", "PixelCNN：")}</strong>{" "}
                {t("p(x̃_i | x̃_{<i}, z) — autoregressive over x̃, conditioned on z", "p(x̃_i | x̃_{<i}, z) — 在 x̃ 上自回归，以 z 为条件")}
              </div>
              <div>
                <strong>{t("Upsampler:", "上采样器：")}</strong>{" "}
                {t("p(x | x̃, z) — local decoder to fill in details", "p(x | x̃, z) — 局部解码器填充细节")}
              </div>
            </div>
            <p className="text-paper-800/70">
              {t(
                "The key constraint: the PixelCNN only conditions on the coarse x̃ context. Since x̃ has lost fine-grained local detail, z must encode it. Since x̃ still gives coarse layout, z must provide the residual global information the coarse grid cannot capture.",
                "关键约束：PixelCNN 只以粗糙的 x̃ 上下文为条件。由于 x̃ 丢失了细粒度局部细节，z 必须编码它。由于 x̃ 仍然给出粗略布局，z 必须提供粗糙网格无法捕获的残余全局信息。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 6: Rate-Distortion Tradeoff ============ */}
        <h2>{t("6. Rate-Distortion Tradeoff", "6. 率失真权衡")}</h2>

        <p>
          {t(
            "The standard ELBO implicitly sets a fixed balance between R and D. VLAE makes this explicit with a hyperparameter β (following the β-VAE framing) that controls how strongly the model is penalized for using bits in z:",
            "标准 ELBO 隐式地在 R 和 D 之间设定了固定的平衡。VLAE 通过超参数 β（遵循 β-VAE 框架）明确了这一点，控制模型因在 z 中使用比特而受到的惩罚强度："
          )}
        </p>

        <Math
          display
          label={t("Rate-distortion objective", "率失真目标")}
          tex="\mathcal{L}_{\beta} = \underbrace{\mathbb{E}_{q(z|x)}\bigl[-\log p(x \mid z)\bigr]}_{D \;\text{(distortion)}} + \beta \cdot \underbrace{D_{\mathrm{KL}}\bigl(q(z \mid x) \;\|\; p(z)\bigr)}_{R \;\text{(rate)}}"
        />

        <p>
          {t(
            "The standard VAE corresponds to β = 1. By varying β we trace out the rate-distortion frontier:",
            "标准 VAE 对应 β = 1。通过改变 β，我们可以描绘出率失真前沿："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("β value", "β 值")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Rate R (bits in z)", "率 R（z 中的比特）")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Distortion D", "失真 D")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Effect", "效果")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-4 py-2 font-semibold">
                  β → ∞
                </td>
                <td className="border border-paper-200 px-4 py-2 text-green-700">
                  {t("Very low (few bits)", "非常低（少量比特）")}
                </td>
                <td className="border border-paper-200 px-4 py-2 text-red-700">
                  {t("High (poor recon.)", "高（重建差）")}
                </td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Highly compressed z; disentangled but blurry", "高度压缩的 z；解耦但模糊")}
                </td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2 font-semibold">
                  β = 1
                </td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Balanced", "均衡")}
                </td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Balanced", "均衡")}
                </td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("Standard VAE; collapse risk with powerful decoder", "标准 VAE；强解码器有坍塌风险")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2 font-semibold">
                  β → 0
                </td>
                <td className="border border-paper-200 px-4 py-2 text-red-700">
                  {t("Very high (many bits)", "非常高（大量比特）")}
                </td>
                <td className="border border-paper-200 px-4 py-2 text-green-700">
                  {t("Low (sharp recon.)", "低（重建清晰）")}
                </td>
                <td className="border border-paper-200 px-4 py-2">
                  {t("z encodes everything; close to deterministic AE", "z 编码一切；接近确定性 AE")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "VLAE operates at a sweet spot: β is small enough that z carries meaningful global information, but the restricted decoder forces it to encode the right type of information (global structure, not local detail).",
            "VLAE 在一个最佳点运作：β 足够小使得 z 携带有意义的全局信息，但受限解码器迫使它编码正确类型的信息（全局结构，而非局部细节）。"
          )}
        </p>

        <Collapsible
          title={t(
            "Bits-back argument: why KL = rate (derivation)",
            "比特回退论证：为什么 KL = 率（推导）"
          )}
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "The bits-back argument shows that the expected number of bits needed to communicate x through z under the coding scheme is exactly R = KL(q||p). Here is the intuition:",
                "比特回退论证表明，在编码方案下通过 z 传递 x 所需的期望比特数恰好是 R = KL(q||p)。以下是直觉："
              )}
            </p>
            <p>
              {t(
                "Suppose Alice wants to send x to Bob. They both know the model p(z), p(x|z). Alice:",
                "假设 Alice 想要将 x 发送给 Bob。他们都知道模型 p(z), p(x|z)。Alice："
              )}
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                {t(
                  "Encodes z ~ q(z|x) using a code of length -log p(z) bits (coding z under the prior).",
                  "使用 -log p(z) 比特的编码对 z ~ q(z|x) 编码（在先验下编码 z）。"
                )}
              </li>
              <li>
                {t(
                  "Gets back log q(z|x) bits using bits-back coding (Hinton & van Camp).",
                  "使用比特回退编码（Hinton & van Camp）取回 log q(z|x) 比特。"
                )}
              </li>
              <li>
                {t(
                  "Net cost for z: E[-log p(z) + log q(z|x)] = KL(q||p) = R.",
                  "z 的净成本：E[-log p(z) + log q(z|x)] = KL(q||p) = R。"
                )}
              </li>
              <li>
                {t(
                  "Then encodes x | z using -log p(x|z) bits (the distortion D).",
                  "然后使用 -log p(x|z) 比特编码 x | z（失真 D）。"
                )}
              </li>
            </ol>
            <Math
              display
              tex="\text{Total bits} = R + D = D_{\mathrm{KL}}(q \| p) + \mathbb{E}[-\log p(x|z)] = -\mathcal{L}"
            />
            <p>
              {t(
                "Maximizing the ELBO is exactly minimizing the total description length — a direct connection to Minimum Description Length (MDL) theory.",
                "最大化 ELBO 恰好就是最小化总描述长度——与最小描述长度（MDL）理论的直接联系。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Section 7: Results ============ */}
        <h2>{t("7. Results", "7. 实验结果")}</h2>

        <p>
          {t(
            "VLAE was evaluated on MNIST, CIFAR-10, and Omniglot. The key metrics are bits-per-dimension (BPD, lower is better) and the quality of the learned latent representations.",
            "VLAE 在 MNIST、CIFAR-10 和 Omniglot 上进行了评估。关键指标是每维比特数（BPD，越低越好）以及学到的潜在表示质量。"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100">
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Model", "模型")}
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  MNIST (BPD)
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  CIFAR-10 (BPD)
                </th>
                <th className="border border-paper-200 px-4 py-2 text-left">
                  {t("Uses z?", "使用 z？")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 px-4 py-2">
                  {t("VAE (Gaussian decoder)", "VAE（高斯解码器）")}
                </td>
                <td className="border border-paper-200 px-4 py-2">≈ 86</td>
                <td className="border border-paper-200 px-4 py-2">≈ 4.54</td>
                <td className="border border-paper-200 px-4 py-2 text-green-700">
                  {t("Yes", "是")}
                </td>
              </tr>
              <tr className="bg-paper-50">
                <td className="border border-paper-200 px-4 py-2">
                  {t("VAE + PixelCNN decoder", "VAE + PixelCNN 解码器")}
                </td>
                <td className="border border-paper-200 px-4 py-2">≈ 79.6</td>
                <td className="border border-paper-200 px-4 py-2">≈ 3.14</td>
                <td className="border border-paper-200 px-4 py-2 text-red-600">
                  {t("No (collapse)", "否（坍塌）")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-blue-700">
                  VLAE
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-blue-700">
                  ≈ 78.5
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-blue-700">
                  ≈ 2.95
                </td>
                <td className="border border-paper-200 px-4 py-2 font-semibold text-green-700">
                  {t("Yes — rich global z", "是——丰富的全局 z")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "Beyond raw likelihood, VLAE produces qualitatively richer latent representations. On MNIST, the latent space shows smooth interpolations between digit classes. On CIFAR-10, interpolation in z changes global content (object class, background color) while local texture is handled by the decoder — precisely the separation the architecture was designed to achieve.",
            "除了原始似然之外，VLAE 产生了质量更丰富的潜在表示。在 MNIST 上，潜在空间显示出数字类别之间的平滑插值。在 CIFAR-10 上，z 中的插值改变了全局内容（物体类别、背景颜色），而局部纹理由解码器处理——这正是架构设计要实现的分离。"
          )}
        </p>

        <div className="space-y-3 my-6">
          <div className="p-3 bg-white border border-paper-200 rounded-lg flex gap-3">
            <span className="text-green-600 font-bold text-lg">✓</span>
            <div>
              <p className="font-semibold text-sm mb-1">
                {t("Active latent code", "活跃的潜在编码")}
              </p>
              <p className="text-sm text-paper-800/70">
                {t(
                  "VLAE maintains non-zero KL across all latent dimensions, confirming that z is used. Standard VAE+PixelCNN has KL ≈ 0 for all dimensions.",
                  "VLAE 在所有潜在维度上保持非零 KL，确认 z 被使用。标准 VAE+PixelCNN 在所有维度上 KL ≈ 0。"
                )}
              </p>
            </div>
          </div>
          <div className="p-3 bg-white border border-paper-200 rounded-lg flex gap-3">
            <span className="text-green-600 font-bold text-lg">✓</span>
            <div>
              <p className="font-semibold text-sm mb-1">
                {t("Global-local disentanglement", "全局-局部解耦")}
              </p>
              <p className="text-sm text-paper-800/70">
                {t(
                  "Latent traversals show that z controls global attributes (pose, class, composition) while the decoder handles fine-grained texture. This is the first systematic demonstration of this separation in a VAE.",
                  "潜在遍历显示 z 控制全局属性（姿态、类别、构成），而解码器处理细粒度纹理。这是在 VAE 中对这种分离的首次系统性证明。"
                )}
              </p>
            </div>
          </div>
          <div className="p-3 bg-white border border-paper-200 rounded-lg flex gap-3">
            <span className="text-green-600 font-bold text-lg">✓</span>
            <div>
              <p className="font-semibold text-sm mb-1">
                {t("Improved ELBO", "改进的 ELBO")}
              </p>
              <p className="text-sm text-paper-800/70">
                {t(
                  "VLAE achieves better BPD than VAE+PixelCNN despite using z — the model benefits from both the expressive decoder and the latent code simultaneously.",
                  "VLAE 在使用 z 的同时比 VAE+PixelCNN 获得更好的 BPD——模型同时受益于表达性解码器和潜在编码。"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ============ Section 8: β-VAE Connection ============ */}
        <h2>{t("8. Connection to β-VAE and Later Work", "8. 与 β-VAE 及后续工作的联系")}</h2>

        <p>
          {t(
            "VLAE was published simultaneously with β-VAE (Higgins et al., ICLR 2017). Both papers independently arrive at the idea of weighting the KL term in the ELBO, but with different motivations:",
            "VLAE 与 β-VAE（Higgins 等，ICLR 2017）同期发表。两篇论文独立地得出了在 ELBO 中对 KL 项进行加权的想法，但出发点不同："
          )}
        </p>

        <div className="space-y-3 my-6">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <h4 className="font-semibold text-purple-700 mb-2">
              {t("β-VAE", "β-VAE")}
            </h4>
            <p className="text-sm text-paper-800/80">
              {t(
                "Motivates β > 1 as a way to enforce disentanglement — using more pressure on the KL forces different dimensions of z to encode independent factors of variation. This trades reconstruction quality for interpretability.",
                "将 β > 1 作为强制解耦的方式——对 KL 施加更大压力迫使 z 的不同维度编码独立变化因素。这以牺牲重建质量换取可解释性。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">
              {t("VLAE", "VLAE")}
            </h4>
            <p className="text-sm text-paper-800/80">
              {t(
                "Motivates the rate-distortion view to prevent posterior collapse when using powerful decoders. The restricted autoregressive decoder is the key architectural innovation — β is used to tune the rate-distortion tradeoff, not primarily for disentanglement.",
                "以率失真视角来防止使用强大解码器时的后验坍塌。受限自回归解码器是关键的架构创新——β 用于调整率失真权衡，而非主要用于解耦。"
              )}
            </p>
          </div>
        </div>

        <p>
          {t(
            "The VLAE framing became foundational for later hierarchical VAEs (NVAE, VDVAE) and latent diffusion models. The insight that 'z should carry global structure while a powerful decoder handles local detail' directly inspired the design of Stable Diffusion's latent space — a VAE compresses images to 64×64 latent grids, and the diffusion model operates entirely in this latent space.",
            "VLAE 框架为后来的分层 VAE（NVAE、VDVAE）和潜在扩散模型奠定了基础。「z 应该携带全局结构，而强大的解码器处理局部细节」的洞见直接启发了 Stable Diffusion 潜在空间的设计——VAE 将图像压缩到 64×64 潜在网格，扩散模型完全在这个潜在空间中运作。"
          )}
        </p>

        <Collapsible
          title={t(
            "Why VLAE matters for modern latent diffusion models",
            "为什么 VLAE 对现代潜在扩散模型很重要"
          )}
        >
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Latent diffusion models (LDMs, Rombach et al. 2022 — the architecture behind Stable Diffusion) follow exactly the VLAE principle:",
                "潜在扩散模型（LDMs，Rombach 等 2022——Stable Diffusion 背后的架构）完全遵循 VLAE 原则："
              )}
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                {t(
                  "A VAE encoder compresses x (512×512 image) to a latent z (64×64 feature map) — this is the 'global structure' bottleneck.",
                  "VAE 编码器将 x（512×512 图像）压缩到潜在 z（64×64 特征图）——这是「全局结构」瓶颈。"
                )}
              </li>
              <li>
                {t(
                  "A diffusion model operates in z-space — generating global structure efficiently.",
                  "扩散模型在 z 空间中运作——高效地生成全局结构。"
                )}
              </li>
              <li>
                {t(
                  "The VAE decoder maps z back to pixel space, adding local detail — exactly the 'restricted decoder' role.",
                  "VAE 解码器将 z 映射回像素空间，添加局部细节——正是「受限解码器」的角色。"
                )}
              </li>
            </ol>
            <p>
              {t(
                "The LDM paper explicitly cites the rate-distortion perspective from VLAE when motivating their choice of compression factor.",
                "LDM 论文在解释其压缩因子选择时明确引用了 VLAE 的率失真视角。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ Back link + Resources ============ */}
        <h2>{t("9. Additional Resources", "9. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a
            href="https://arxiv.org/abs/1611.02731"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {t("Variational Lossy Autoencoder (arXiv)", "变分有损自编码器（arXiv）")}
            </span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Original paper", "原始论文")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/1606.05579"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {t("β-VAE (Higgins et al., ICLR 2017)", "β-VAE（Higgins 等，ICLR 2017）")}
            </span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Concurrent work on weighted KL — disentanglement motivation", "同期关于加权 KL 的工作——解耦动机")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/2112.10752"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {t("Latent Diffusion Models (Rombach et al. 2022)", "潜在扩散模型（Rombach 等 2022）")}
            </span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Applies VLAE's global-local split at scale — Stable Diffusion", "在规模上应用 VLAE 的全局-局部分离——Stable Diffusion")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/2007.03898"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {t("NVAE (Vahdat & Kautz, NeurIPS 2020)", "NVAE（Vahdat & Kautz，NeurIPS 2020）")}
            </span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Hierarchical VAE building on the global-local decomposition principle", "基于全局-局部分解原则的分层 VAE")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/1312.6114"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {t("Auto-Encoding Variational Bayes (Kingma & Welling, 2013)", "自编码变分贝叶斯（Kingma & Welling，2013）")}
            </span>
            <span className="text-xs text-paper-800/50 ml-2">
              {t("Original VAE paper — prerequisite reading", "原始 VAE 论文——前置阅读")}
            </span>
          </a>
        </div>

        <div className="mt-10 pt-6 border-t border-paper-200">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 hover:underline"
          >
            {t("← Back to all papers", "← 返回所有论文")}
          </Link>
        </div>
      </article>
    </div>
  );
}
