"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function DilatedConvolutionsPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Multi-Scale Context Aggregation by Dilated Convolutions",
            "膨胀卷积的多尺度上下文聚合"
          )}
        </h1>
        <p className="text-paper-800/50">
          Fisher Yu, Vladlen Koltun &middot; ICLR 2016 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1511.07122"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1511.07122
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "Semantic segmentation requires both large receptive fields (to understand context) and full-resolution outputs (to label every pixel). Standard pooling achieves large receptive fields but destroys spatial resolution. Dilated convolutions insert gaps between filter elements, exponentially growing the receptive field with stacked layers — without any downsampling. A 3\u00d73 filter with dilation rate 2 sees a 5\u00d75 region; stacking rates 1, 2, 4, 8, 16 spans a 65\u00d765 region — all at full resolution.",
              "\u8bed\u4e49\u5206\u5272\u540c\u65f6\u9700\u8981\u5927\u611f\u53d7\u91ce\uff08\u7406\u89e3\u4e0a\u4e0b\u6587\uff09\u548c\u5168\u5206\u8fa8\u7387\u8f93\u51fa\uff08\u5bf9\u6bcf\u4e2a\u50cf\u7d20\u6253\u6807\uff09\u3002\u6807\u51c6\u6c60\u5316\u80fd\u5b9e\u73b0\u5927\u611f\u53d7\u91ce\uff0c\u4f46\u4f1a\u7834\u574f\u7a7a\u95f4\u5206\u8fa8\u7387\u3002\u81a8\u80c0\u5377\u79ef\u5728\u6ee4\u6ce2\u5668\u5143\u7d20\u4e4b\u95f4\u63d2\u5165\u95f4\u9699\uff0c\u901a\u8fc7\u5806\u53e0\u5c42\u6307\u6570\u589e\u957f\u611f\u53d7\u91ce\u2014\u4e0d\u9700\u4efb\u4f55\u4e0b\u91c7\u6837\u3002\u81a8\u80c0\u7387 2 \u7684 3\u00d73 \u6ee4\u6ce2\u5668\u770b\u5230 5\u00d75 \u533a\u57df\uff1b\u5806\u53e0\u7387\u4e3a 1, 2, 4, 8, 16 \u8986\u76d6 65\u00d765 \u533a\u57df\u2014\u5168\u90e8\u4fdd\u6301\u5168\u5206\u8fa8\u7387\u3002"
            )}
          </p>
        </section>

        {/* Section 1: Segmentation's Resolution Dilemma */}
        <h2>{t("1. Segmentation\u2019s Resolution Dilemma", "1. \u5206\u5272\u7684\u5206\u8fa8\u7387\u56f0\u5883")}</h2>

        <p>
          {t(
            "Semantic segmentation assigns a class label to every pixel in an image. Unlike image classification, which produces a single label for the whole image, segmentation demands a dense, full-resolution prediction map.",
            "\u8bed\u4e49\u5206\u5272\u4e3a\u56fe\u50cf\u4e2d\u7684\u6bcf\u4e2a\u50cf\u7d20\u5206\u914d\u4e00\u4e2a\u7c7b\u522b\u6807\u7b7e\u3002\u4e0e\u4e3a\u6574\u4e2a\u56fe\u50cf\u751f\u6210\u5355\u4e00\u6807\u7b7e\u7684\u56fe\u50cf\u5206\u7c7b\u4e0d\u540c\uff0c\u5206\u5272\u9700\u8981\u5bc6\u96c6\u7684\u3001\u5168\u5206\u8fa8\u7387\u7684\u9884\u6218\u56fe\u3002"
          )}
        </p>

        <p>
          {t(
            "There are two conflicting requirements that make this hard:",
            "\u8fd9\u4e2a\u4efb\u52a1\u6709\u4e24\u4e2a\u76f8\u4e92\u77db\u76fe\u7684\u8981\u6c42\uff1a"
          )}
        </p>

        <ul>
          <li>
            <strong>{t("Large receptive fields", "\u5927\u611f\u53d7\u91ce")}</strong>
            {t(
              " — to understand what an object is, a model must see enough surrounding context. A pixel\u2019s class often depends on objects tens or hundreds of pixels away.",
              " \u2014 \u8981\u7406\u89e3\u4e00\u4e2a\u5bf9\u8c61\u662f\u4ec0\u4e48\uff0c\u6a21\u578b\u5fc5\u987b\u770b\u5230\u8db3\u591f\u7684\u5468\u56f4\u4e0a\u4e0b\u6587\u3002\u4e00\u4e2a\u50cf\u7d20\u7684\u7c7b\u522b\u5f80\u5f80\u53d6\u51b3\u4e8e\u51e0\u5341\u751a\u81f3\u4e0a\u767e\u50cf\u7d20\u5916\u7684\u5bf9\u8c61\u3002"
            )}
          </li>
          <li>
            <strong>{t("Full-resolution output", "\u5168\u5206\u8fa8\u7387\u8f93\u51fa")}</strong>
            {t(
              " — the final prediction must be the same size as the input image. Every pixel needs a label, so spatial information cannot be discarded.",
              " \u2014 \u6700\u7ec8\u9884\u6218\u5fc5\u987b\u4e0e\u8f93\u5165\u56fe\u50cf\u5927\u5c0f\u76f8\u540c\u3002\u6bcf\u4e2a\u50cf\u7d20\u90fd\u9700\u8981\u6807\u7b7e\uff0c\u56e0\u6b64\u7a7a\u95f4\u4fe1\u606f\u4e0d\u80fd\u88ab\u4e22\u5f03\u3002"
            )}
          </li>
        </ul>

        <p>
          {t(
            "Standard convolutional networks resolve the receptive-field problem through pooling and strided convolutions. After several pooling layers, a neuron\u2019s receptive field spans a large image region — but the feature map itself has been downsampled, often to 1/32 of the original resolution. To recover spatial detail, these architectures must use upsampling (transposed convolutions, bilinear interpolation), which re-introduces blurriness and loses fine-grained boundaries.",
            "\u6807\u51c6\u5377\u79ef\u7f51\u7edc\u901a\u8fc7\u6c60\u5316\u548c\u6b65\u957f\u5377\u79ef\u89e3\u51b3\u611f\u53d7\u91ce\u95ee\u9898\u3002\u7ecf\u8fc7\u591a\u4e2a\u6c60\u5316\u5c42\u540e\uff0c\u795e\u7ecf\u5143\u7684\u611f\u53d7\u91ce\u8986\u76d6\u4e86\u5927\u7247\u56fe\u50cf\u533a\u57df\u2014\u4f46\u7279\u5f81\u56fe\u672c\u8eab\u5df2\u88ab\u4e0b\u91c7\u6837\uff0c\u901a\u5e38\u4e3a\u539f\u59cb\u5206\u8fa8\u7387\u7684 1/32\u3002\u4e3a\u6062\u590d\u7a7a\u95f4\u7ec6\u8282\uff0c\u8fd9\u4e9b\u67b6\u6784\u5fc5\u987b\u4f7f\u7528\u4e0a\u91c7\u6837\uff08\u8f6c\u7f6e\u5377\u79ef\u3001\u53cc\u7ebf\u6027\u63d2\u5185\uff09\uff0c\u8fd9\u4f1a\u91cd\u65b0\u5f15\u5165\u6a21\u7cca\u5e76\u4e22\u5931\u7cbe\u7ec6\u8fb9\u754c\u3002"
          )}
        </p>

        <Collapsible
          title={t(
            "Why upsampling is a poor fix",
            "\u4e3a\u4ec0\u4e48\u4e0a\u91c7\u6837\u662f\u5dee\u52b2\u7684\u89e3\u51b3\u65b9\u6848"
          )}
        >
          <p>
            {t(
              "Fully Convolutional Networks (FCN, Long et al. 2015) applied VGG to segmentation by treating the final classification layers as convolutions, then upsampling the 32\u00d7 downsampled output back to full resolution. This works, but the coarse feature map loses thin structures, object boundaries, and small objects entirely. Skip connections partially compensate, but the fundamental problem remains: information was discarded during downsampling and cannot be perfectly reconstructed.",
              "\u5168\u5377\u79ef\u7f51\u7edc\uff08FCN\uff0cLong \u7b49 2015\uff09\u901a\u8fc7\u5c06\u6700\u7ec8\u5206\u7c7b\u5c42\u89c6\u4e3a\u5377\u79ef\uff0c\u5c06 VGG \u5e94\u7528\u4e8e\u5206\u5272\uff0c\u518d\u5c06 32\u00d7 \u4e0b\u91c7\u6837\u7684\u8f93\u51fa\u4e0a\u91c7\u6837\u5230\u5168\u5206\u8fa8\u7387\u3002\u8fd9\u884c\u5f97\u901a\uff0c\u4f46\u7c97\u7cbe\u7684\u7279\u5f81\u56fe\u5b8c\u5168\u4e22\u5931\u4e86\u7ec6\u5c0f\u7ed3\u6784\u3001\u5bf9\u8c61\u8fb9\u754c\u548c\u5c0f\u5bf9\u8c61\u3002\u8df3\u8fc7\u8fde\u63a5\u90e8\u5206\u5f25\u8865\u4e86\u8fd9\u4e00\u95ee\u9898\uff0c\u4f46\u6839\u672c\u95ee\u9898\u4ecd\u5b58\u5728\uff1a\u4e0b\u91c7\u6837\u671f\u95f4\u4fe1\u606f\u5df2\u88ab\u4e22\u5f03\uff0c\u65e0\u6cd5\u5b8c\u7f8e\u91cd\u5efa\u3002"
            )}
          </p>
        </Collapsible>

        {/* Section 2: Dilated Convolutions Explained */}
        <h2>{t("2. Dilated Convolutions Explained", "2. \u81a8\u80c0\u5377\u79ef\u8be6\u89e3")}</h2>

        <p>
          {t(
            "A dilated (or \u201catrous\u201d) convolution is a convolution in which the filter is applied over an area larger than its footprint by inserting zeros between filter elements. The ",
            "\u81a8\u80c0\uff08\u6216\u201c\u5e26\u5b54\u201d\uff09\u5377\u79ef\u662f\u4e00\u79cd\u901a\u8fc7\u5728\u6ee4\u6ce2\u5668\u5143\u7d20\u4e4b\u95f4\u63d2\u5165\u96f6\u6765\u5c06\u6ee4\u6ce2\u5668\u5e94\u7528\u4e8e\u5927\u4e8e\u5176\u81ea\u8eab\u5360\u7528\u533a\u57df\u7684\u5377\u79ef\u3002"
          )}
          <strong>{t("dilation rate", "\u81a8\u80c0\u7387")}</strong>
          {t(
            " \u2009",
            "\u2009"
          )}
          <Math tex={"l"} />
          {t(
            " controls how many zeros are inserted: with rate ",
            " \u63a7\u5236\u63d2\u5165\u591a\u5c11\u4e2a\u96f6\uff1a\u7387\u4e3a "
          )}
          <Math tex={"l"} />
          {t(
            ", each consecutive filter tap is spaced ",
            " \u65f6\uff0c\u6bcf\u4e2a\u76f8\u90bb\u6ee4\u6ce2\u5668\u6a20\u76f8\u9694 "
          )}
          <Math tex={"l"} />
          {t(" pixels apart.", " \u4e2a\u50cf\u7d20\u3002")}
        </p>

        <p>{t("The standard discrete convolution is:", "\u6807\u51c6\u79bb\u6563\u5377\u79ef\u4e3a\uff1a")}</p>

        <Math display tex={"(F * k)(\\mathbf{p}) = \\sum_{\\mathbf{s}+\\mathbf{t}=\\mathbf{p}} F(\\mathbf{s})\\, k(\\mathbf{t})"} />

        <p>
          {t(
            "The dilated convolution with rate ",
            "\u81a8\u80c0\u7387\u4e3a "
          )}
          <Math tex={"l"} />
          {t(" is:", " \u7684\u81a8\u80c0\u5377\u79ef\u4e3a\uff1a")}
        </p>

        <Math display tex={"(F *_l k)(\\mathbf{p}) = \\sum_{\\mathbf{s}+l\\mathbf{t}=\\mathbf{p}} F(\\mathbf{s})\\, k(\\mathbf{t})"} />

        <p>
          {t(
            "The only difference is the factor ",
            "\u552f\u4e00\u7684\u533a\u522b\u662f\u56e0\u5b50 "
          )}
          <Math tex={"l"} />
          {t(
            " in front of ",
            " \u5728 "
          )}
          <Math tex={"\\mathbf{t}"} />
          {t(
            ". Instead of summing over adjacent filter positions, we sample the input at positions spaced ",
            " \u524d\u9762\u3002\u6211\u4eec\u4e0d\u518d\u5bf9\u76f8\u90bb\u6ee4\u6ce2\u5668\u4f4d\u7f6e\u6c42\u548c\uff0c\u800c\u662f\u4ee5\u95f4\u8ddd\u4e3a "
          )}
          <Math tex={"l"} />
          {t(
            " apart. When ",
            " \u7684\u4f4d\u7f6e\u91c7\u6837\u8f93\u5165\u3002\u5f53 "
          )}
          <Math tex={"l = 1"} />
          {t(
            ", this reduces to standard convolution.",
            " \u65f6\uff0c\u8fd9\u5c31\u9000\u5316\u4e3a\u6807\u51c6\u5377\u79ef\u3002"
          )}
        </p>

        <p>
          {t(
            "For a filter of size ",
            "\u5bf9\u4e8e\u5927\u5c0f\u4e3a "
          )}
          <Math tex={"k \\times k"} />
          {t(
            " applied with dilation rate ",
            " \u3001\u81a8\u80c0\u7387\u4e3a "
          )}
          <Math tex={"r"} />
          {t(", the effective receptive field size is:", " \u7684\u6ee4\u6ce2\u5668\uff0c\u6709\u6548\u611f\u53d7\u91ce\u5927\u5c0f\u4e3a\uff1a")}
        </p>

        <Math display tex={"k_{\\text{eff}} = k + (k-1)(r-1)"} />

        <p>
          {t(
            "For example, a 3\u00d73 filter (k=3) with dilation rate r=2 has an effective size of:",
            "\u4f8b\u5982\uff0c\u81a8\u80c0\u7387 r=2 \u7684 3\u00d73 \u6ee4\u6ce2\u5668\uff08k=3\uff09\u6709\u6548\u5927\u5c0f\u4e3a\uff1a"
          )}
        </p>

        <Math display tex={"k_{\\text{eff}} = 3 + (3-1)(2-1) = 3 + 2 = 5"} />

        <p>
          {t(
            "So a 3\u00d73 filter with r=2 sees a 5\u00d75 region, but only uses 9 parameters (not 25). With r=4, the same 9-parameter filter sees a 9\u00d79 region. The key insight: receptive field grows with dilation rate, but parameter count stays the same.",
            "\u56e0\u6b64\uff0cr=2 \u7684 3\u00d73 \u6ee4\u6ce2\u5668\u770b\u5230 5\u00d75 \u533a\u57df\uff0c\u4f46\u53ea\u4f7f\u75289 \u4e2a\u53c2\u6570\uff08\u800c\u975e 25 \u4e2a\uff09\u3002\u5f53 r=4 \u65f6\uff0c\u540c\u4e2a 9 \u53c2\u6570\u6ee4\u6ce2\u5668\u770b\u5230 9\u00d79 \u533a\u57df\u3002\u5173\u952e\u6d1e\u5bdf\uff1a\u611f\u53d7\u91ce\u968f\u81a8\u80c0\u7387\u589e\u957f\uff0c\u4f46\u53c2\u6570\u6570\u91cf\u4fdd\u6301\u4e0d\u53d8\u3002"
          )}
        </p>

        <Collapsible
          title={t(
            "Why this preserves spatial resolution",
            "\u4e3a\u4ec0\u4e48\u8fd9\u4fdd\u6301\u4e86\u7a7a\u95f4\u5206\u8fa8\u7387"
          )}
        >
          <p>
            {t(
              "Spatial resolution is determined by the output feature map size relative to the input. Strided convolution (stride s>1) or pooling reduces spatial dimensions by a factor of s or the pooling window. Dilated convolution uses stride=1 and no pooling — the output is the same spatial size as the input (with appropriate padding). The dilation only determines which input locations are sampled; it does not skip output locations.",
              "\u7a7a\u95f4\u5206\u8fa8\u7387\u7531\u8f93\u51fa\u7279\u5f81\u56fe\u76f8\u5bf9\u4e8e\u8f93\u5165\u7684\u5927\u5c0f\u51b3\u5b9a\u3002\u6b65\u957f\u5377\u79ef\uff08\u6b65\u957f s>1\uff09\u6216\u6c60\u5316\u4f1a\u5c06\u7a7a\u95f4\u7ef4\u5ea6\u7f29\u5c0f s \u500d\u6216\u6c60\u5316\u7a97\u53e3\u5927\u5c0f\u500d\u3002\u81a8\u80c0\u5377\u79ef\u4f7f\u7528\u6b65\u957f=1\u4e14\u65e0\u6c60\u5316\u2014\u8f93\u51fa\u7a7a\u95f4\u5927\u5c0f\u4e0e\u8f93\u5165\u76f8\u540c\uff08\u9002\u5f53\u586b\u5145\uff09\u3002\u81a8\u80c0\u4ec5\u51b3\u5b9a\u91c7\u6837\u54ea\u4e9b\u8f93\u5165\u4f4d\u7f6e\uff1b\u5b83\u4e0d\u8df3\u8fc7\u8f93\u51fa\u4f4d\u7f6e\u3002"
            )}
          </p>
          <p>
            {t(
              "The output size formula for a convolution with no stride and symmetric padding p = (k_eff - 1) / 2:",
              "\u65e0\u6b65\u957f\u548c\u5bf9\u79f0\u586b\u5145 p = (k_eff - 1) / 2 \u7684\u5377\u79ef\u8f93\u51fa\u5927\u5c0f\u516c\u5f0f\uff1a"
            )}
          </p>
          <Math display tex={"H_{\\text{out}} = H_{\\text{in}} - k_{\\text{eff}} + 2p + 1 = H_{\\text{in}}"} />
        </Collapsible>

        {/* Section 3: Exponential Receptive Field Growth */}
        <h2>
          {t(
            "3. Exponential Receptive Field Growth",
            "3. \u6307\u6570\u589e\u957f\u7684\u611f\u53d7\u91ce"
          )}
        </h2>

        <p>
          {t(
            "The real power of dilated convolutions emerges when they are stacked with exponentially increasing dilation rates: 1, 2, 4, 8, 16, \u2026",
            "\u81a8\u80c0\u5377\u79ef\u7684\u771f\u6b63\u529b\u91cf\u5728\u4ee5\u6307\u6570\u589e\u957f\u7684\u81a8\u80c0\u7387 1, 2, 4, 8, 16, \u2026 \u5806\u53e0\u65f6\u663e\u73b0\u51fa\u6765\u3002"
          )}
        </p>

        <p>
          {t(
            "After stacking ",
            "\u5806\u53e0 "
          )}
          <Math tex={"n"} />
          {t(
            " layers with dilation rates ",
            " \u5c42\u3001\u81a8\u80c0\u7387\u5206\u522b\u4e3a "
          )}
          <Math tex={"1, 2, 4, \\ldots, 2^{n-1}"} />
          {t(
            ", each using a 3\u00d73 filter, the total effective receptive field is:",
            " \u7684\u5c42\uff0c\u6bcf\u5c42\u4f7f\u75283\u00d73 \u6ee4\u6ce2\u5668\uff0c\u603b\u6709\u6548\u611f\u53d7\u91ce\u4e3a\uff1a"
          )}
        </p>

        <Math display tex={"\\text{Receptive field} = 2^n \\times 2^n"} />

        <p>{t("Tracing this layer by layer:", "\u9010\u5c42\u8ffd\u8e2a\uff1a")}</p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-600 px-4 py-2 text-left">
                  {t("Layer", "\u5c42\u6570")}
                </th>
                <th className="border border-paper-200 dark:border-paper-600 px-4 py-2 text-left">
                  {t("Dilation rate", "\u81a8\u80c0\u7387")}
                </th>
                <th className="border border-paper-200 dark:border-paper-600 px-4 py-2 text-left">
                  {t("Effective filter size", "\u6709\u6548\u6ee4\u6ce2\u5668\u5927\u5c0f")}
                </th>
                <th className="border border-paper-200 dark:border-paper-600 px-4 py-2 text-left">
                  {t("Cumulative receptive field", "\u7d2f\u79ef\u611f\u53d7\u91ce")}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { layer: "1", rate: "1", filter: "3×3", rf: "3×3" },
                { layer: "2", rate: "2", filter: "5×5", rf: "7×7" },
                { layer: "3", rate: "4", filter: "9×9", rf: "15×15" },
                { layer: "4", rate: "8", filter: "17×17", rf: "31×31" },
                { layer: "5", rate: "16", filter: "33×33", rf: "63×63" },
                { layer: "6", rate: "32", filter: "65×65", rf: "127×127" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-paper-50 dark:bg-paper-900/30" : ""}>
                  <td className="border border-paper-200 dark:border-paper-600 px-4 py-2">{row.layer}</td>
                  <td className="border border-paper-200 dark:border-paper-600 px-4 py-2 font-mono">
                    {row.rate}
                  </td>
                  <td className="border border-paper-200 dark:border-paper-600 px-4 py-2 font-mono text-blue-700 dark:text-blue-400">
                    {row.filter}
                  </td>
                  <td className="border border-paper-200 dark:border-paper-600 px-4 py-2 font-mono text-green-700 dark:text-green-400">
                    {row.rf}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The receptive field grows as 3, 7, 15, 31, 63, 127, \u2026 Each doubling of the dilation rate roughly doubles the receptive field diameter — exponential growth with linear cost in layers. Compare this to standard convolutions stacked without dilation: you would need a 63-layer network of 3\u00d73 filters to achieve the same 127\u00d7127 receptive field.",
            "\u611f\u53d7\u91ce\u589e\u957f\u4e3a 3, 7, 15, 31, 63, 127, \u2026 \u81a8\u80c0\u7387\u6bcf\u6b21\u7ffb\u500d\uff0c\u611f\u53d7\u91ce\u76f4\u5f84\u5927\u7ea6\u7ffb\u500d\u2014\u5c42\u6570\u7ebf\u6027\u589e\u957f\u800c\u5e26\u6765\u6307\u6570\u589e\u957f\u3002\u4e0e\u6b64\u76f8\u6bd4\uff0c\u6807\u51c6 3\u00d73 \u5377\u79ef\u5806\u53e0\u800c\u4e0d\u81a8\u80c0\uff1a\u8981\u8fbe\u5230 127\u00d7127 \u7684\u611f\u53d7\u91ce\uff0c\u9700\u8981 63 \u5c42\u7684\u7f51\u7edc\u3002"
          )}
        </p>

        <Collapsible
          title={t(
            "Why exponential dilation rates? What about other schedules?",
            "\u4e3a\u4ec0\u4e48\u662f\u6307\u6570\u81a8\u80c0\u7387\uff1f\u5176\u4ed6\u8c03\u5ea6\u5446\u5982\u4f55\uff1f"
          )}
        >
          <p>
            {t(
              "If you use the same dilation rate at every layer (e.g., all rate 2), you create a \u201cgridding\u201d artifact: the receptive field only samples a regular grid of positions, missing many intermediate pixels. Exponentially increasing rates ensure that consecutive layers cover complementary spatial positions, giving dense coverage of the entire receptive field without gaps. The paper proves this formally using the \u201cno-gridding condition\u201d — the maximum dilation at layer k should not exceed the product of all previous dilation rates.",
              "\u5982\u679c\u6bcf\u5c42\u4f7f\u7528\u76f8\u540c\u7684\u81a8\u80c0\u7387\uff08\u4f8b\u5982\u5168\u90e8\u7387\u4e3a 2\uff09\uff0c\u4f1a\u4ea7\u751f\u201c\u7f51\u683c\u201d\u4f2a\u5f71\uff1a\u611f\u53d7\u91ce\u53ea\u91c7\u6837\u89c4\u5219\u7f51\u683c\u4f4d\u7f6e\uff0c\u9519\u8fc7\u8bb8\u591a\u4e2d\u95f4\u50cf\u7d20\u3002\u6307\u6570\u589e\u957f\u7684\u7387\u786e\u4fdd\u76f8\u90bb\u5c42\u8986\u76d6\u4e92\u8865\u7684\u7a7a\u95f4\u4f4d\u7f6e\uff0c\u5bf9\u6574\u4e2a\u611f\u53d7\u91ce\u63d0\u4f9b\u5bc6\u96c6\u8986\u76d6\uff0c\u6ca1\u6709\u95f4\u9699\u3002\u8be5\u8bba\u6587\u7528\u201c\u65e0\u7f51\u683c\u6761\u4ef6\u201d\u6b63\u5f0f\u8bc1\u660e\u4e86\u8fd9\u4e00\u70b9\u2014\u7b2c k \u5c42\u7684\u6700\u5927\u81a8\u80c0\u4e0d\u5e94\u8d85\u8fc7\u6240\u6709\u524d\u4e00\u5c42\u81a8\u80c0\u7387\u7684\u4e58\u79ef\u3002"
            )}
          </p>
        </Collapsible>

        {/* Section 4: Multi-Scale Context Module */}
        <h2>
          {t(
            "4. Multi-Scale Context Module",
            "4. \u591a\u5c3a\u5ea6\u4e0a\u4e0b\u6587\u6a21\u5757"
          )}
        </h2>

        <p>
          {t(
            "The paper proposes a standalone ",
            "\u8be5\u8bba\u6587\u63d0\u51fa\u4e86\u4e00\u4e2a\u72ec\u7acb\u7684"
          )}
          <strong>{t(" context module", "\u4e0a\u4e0b\u6587\u6a21\u5757")}</strong>
          {t(
            " that can be plugged on top of any existing segmentation network. It takes the network\u2019s feature map as input and passes it through a sequence of dilated convolutions with progressively larger dilation rates to aggregate multi-scale context.",
            "\uff0c\u53ef\u4ee5\u63d2\u5165\u4efb\u4f55\u73b0\u6709\u5206\u5272\u7f51\u7edc\u7684\u9876\u90e8\u3002\u5b83\u4ee5\u7f51\u7edc\u7684\u7279\u5f81\u56fe\u4e3a\u8f93\u5165\uff0c\u5e76\u901a\u8fc7\u4e00\u7cfb\u5217\u9010\u6e10\u589e\u5927\u81a8\u80c0\u7387\u7684\u81a8\u80c0\u5377\u79ef\u6765\u805a\u5408\u591a\u5c3a\u5ea6\u4e0a\u4e0b\u6587\u3002"
          )}
        </p>

        <p>
          {t(
            "The module stacks 8 convolutional layers with the following dilation schedule:",
            "\u8be5\u6a21\u5757\u5806\u53e0 8 \u4e2a\u5377\u79ef\u5c42\uff0c\u81a8\u80c0\u8c03\u5ea6\u5982\u4e0b\uff1a"
          )}
        </p>

        <div className="bg-paper-50 dark:bg-paper-900/40 border border-paper-200 dark:border-paper-700 rounded-lg p-5 my-6 font-mono text-sm">
          <p className="text-paper-600 dark:text-paper-400 mb-3">
            {t("Context module dilation schedule:", "\u4e0a\u4e0b\u6587\u6a21\u5757\u81a8\u80c0\u8c03\u5ea6\uff1a")}
          </p>
          <div className="space-y-1">
            {[
              { layer: "Layer 1", rate: "1", note: t("local features", "\u5c40\u90e8\u7279\u5f81") },
              { layer: "Layer 2", rate: "1", note: t("local features", "\u5c40\u90e8\u7279\u5f81") },
              { layer: "Layer 3", rate: "2", note: t("small context", "\u5c0f\u8303\u56f4\u4e0a\u4e0b\u6587") },
              { layer: "Layer 4", rate: "4", note: t("medium context", "\u4e2d\u8303\u56f4\u4e0a\u4e0b\u6587") },
              { layer: "Layer 5", rate: "8", note: t("large context", "\u5927\u8303\u56f4\u4e0a\u4e0b\u6587") },
              { layer: "Layer 6", rate: "16", note: t("very large context", "\u8d85\u5927\u8303\u56f4\u4e0a\u4e0b\u6587") },
              { layer: "Layer 7", rate: "1", note: t("channel mixing (1×1)", "\u901a\u9053\u6df7\u5408 (1\u00d71)") },
              { layer: "Layer 8", rate: "1", note: t("output projection (1×1)", "\u8f93\u51fa\u6295\u5f71 (1\u00d71)") },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-paper-500 w-20">{row.layer}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold w-12">r={row.rate}</span>
                <span className="text-paper-700 dark:text-paper-300">{row.note}</span>
              </div>
            ))}
          </div>
        </div>

        <p>
          {t(
            "All layers except the last two use 3\u00d73 filters. The last two 1\u00d71 layers combine information across channels. This module is trained end-to-end and can be inserted between the body of a segmentation network (e.g., VGG, ResNet) and the final prediction layer.",
            "\u9664\u6700\u540e\u4e24\u5c42\u5916\uff0c\u6240\u6709\u5c42\u5747\u4f7f\u75283\u00d73 \u6ee4\u6ce2\u5668\u3002\u6700\u540e\u4e24\u4e2a 1\u00d71 \u5c42\u5728\u901a\u9053\u95f4\u7ec4\u5408\u4fe1\u606f\u3002\u8be5\u6a21\u5757\u7aef\u5230\u7aef\u8bad\u7ec3\uff0c\u53ef\u63d2\u5165\u5206\u5272\u7f51\u7edc\u4e3b\u4f53\uff08\u5982 VGG\u3001ResNet\uff09\u4e0e\u6700\u7ec8\u9884\u6218\u5c42\u4e4b\u95f4\u3002"
          )}
        </p>

        <Collapsible
          title={t(
            "Basic vs. Large context module variants",
            "\u57fa\u672c\u4e0e\u5927\u578b\u4e0a\u4e0b\u6587\u6a21\u5757\u53d8\u4f53"
          )}
        >
          <p>
            {t(
              "The paper introduces two variants of the context module. The ",
              "\u8be5\u8bba\u6587\u5f15\u5165\u4e86\u4e24\u79cd\u4e0a\u4e0b\u6587\u6a21\u5757\u53d8\u4f53\u3002"
            )}
            <strong>{t("basic", "\u57fa\u672c")}</strong>
            {t(
              " module uses the same number of feature maps (C channels) in every layer, matching the input channel count. The ",
              "\u53d8\u4f53\u5728\u6bcf\u4e00\u5c42\u4e2d\u4f7f\u7528\u76f8\u540c\u6570\u91cf\u7684\u7279\u5f81\u56fe\uff08C \u4e2a\u901a\u9053\uff09\uff0c\u4e0e\u8f93\u5165\u901a\u9053\u6570\u5339\u914d\u3002"
            )}
            <strong>{t("large", "\u5927\u578b")}</strong>
            {t(
              " module expands to more channels in intermediate layers (e.g., 2C or 4C) before projecting back to C at the output. Both are inserted identically; the large variant improves accuracy at the cost of more computation.",
              "\u53d8\u4f53\u5728\u4e2d\u95f4\u5c42\u6269\u5c55\u5230\u66f4\u591a\u901a\u9053\uff08\u5982 2C \u6216 4C\uff09\uff0c\u7136\u540e\u5728\u8f93\u51fa\u65f6\u6295\u5f71\u56de C\u3002\u4e24\u79cd\u63d2\u5165\u65b9\u5f0f\u76f8\u540c\uff1b\u5927\u578b\u53d8\u4f53\u4ee5\u66f4\u591a\u8ba1\u7b97\u4e3a\u4ee3\u4ef7\u63d0\u9ad8\u4e86\u7cbe\u5ea6\u3002"
            )}
          </p>
        </Collapsible>

        {/* Section 5: Worked Example */}
        <h2>
          {t(
            "5. Worked Example: Tracing a 3\u00d73 Filter with r=2, then r=4",
            "5. \u8fd0\u7b97\u793a\u4f8b\uff1a\u8ffd\u8e2a r=2 \u5c0f r=4 \u7684 3\u00d73 \u6ee4\u6ce2\u5668"
          )}
        </h2>

        <p>
          {t(
            "Consider a 1D input of width 9 and a filter of size 3. We trace two dilated convolution layers.",
            "\u8003\u8651\u5bbd\u5ea6\u4e3a 9 \u7684 1D \u8f93\u5165\u548c\u5927\u5c0f\u4e3a 3 \u7684\u6ee4\u6ce2\u5668\u3002\u6211\u4eec\u8ffd\u8e2a\u4e24\u5c42\u81a8\u80c0\u5377\u79ef\u3002"
          )}
        </p>

        <div className="bg-paper-50 dark:bg-paper-900/40 border border-paper-200 dark:border-paper-700 rounded-lg p-5 my-6">
          <p className="font-semibold mb-4 text-paper-800 dark:text-paper-200">
            {t("Layer 1: dilation r=2, filter size k=3", "\u7b2c\u4e00\u5c42\uff1a\u81a8\u80c0\u7387 r=2\uff0c\u6ee4\u6ce2\u5668\u5927\u5c0f k=3")}
          </p>
          <p className="text-sm text-paper-700 dark:text-paper-300 mb-3">
            {t(
              "Input positions: [0, 1, 2, 3, 4, 5, 6, 7, 8]. Computing output at position p=4:",
              "\u8f93\u5165\u4f4d\u7f6e\uff1a[0, 1, 2, 3, 4, 5, 6, 7, 8]\u3002\u5728\u4f4d\u7f6e p=4 \u5904\u8ba1\u7b97\u8f93\u51fa\uff1a"
            )}
          </p>
          <div className="font-mono text-sm bg-white dark:bg-paper-950 rounded p-3 border border-paper-200 dark:border-paper-600">
            <p className="text-paper-500 mb-1">{t("# Filter taps at offsets t=-1, 0, +1", "# \u6ee4\u6ce2\u5668\u6a20\u4f4d\u4e8e\u504f\u79fb t=-1, 0, +1")}</p>
            <p className="text-blue-600 dark:text-blue-400">s + l·t = p → s + 2·t = 4</p>
            <p className="text-paper-700 dark:text-paper-300">t=-1: s = 4 + 2 = 6 → input[6] × k[-1]</p>
            <p className="text-paper-700 dark:text-paper-300">t= 0: s = 4 + 0 = 4 → input[4] × k[0]</p>
            <p className="text-paper-700 dark:text-paper-300">t=+1: s = 4 - 2 = 2 → input[2] × k[1]</p>
            <p className="text-green-600 dark:text-green-400 mt-2">
              {t("Samples positions: 2, 4, 6 — a span of 5 (effective 5×1 filter)", "\u91c7\u6837\u4f4d\u7f6e\uff1a2, 4, 6 \u2014 \u8986\u76d6\u8303\u56f4 5\uff08\u6709\u6548 5\u00d71 \u6ee4\u6ce2\u5668\uff09")}
            </p>
          </div>

          <p className="font-semibold mt-6 mb-4 text-paper-800 dark:text-paper-200">
            {t("Layer 2: dilation r=4, filter size k=3", "\u7b2c\u4e8c\u5c42\uff1a\u81a8\u80c0\u7387 r=4\uff0c\u6ee4\u6ce2\u5668\u5927\u5c0f k=3")}
          </p>
          <p className="text-sm text-paper-700 dark:text-paper-300 mb-3">
            {t(
              "Now each input to layer 2 already integrates a 5-wide region. Computing output at position p=4:",
              "\u73b0\u5728\u7b2c\u4e8c\u5c42\u7684\u6bcf\u4e2a\u8f93\u5165\u5df2\u7ecf\u6574\u5408\u4e86 5 \u5bbd\u7684\u533a\u57df\u3002\u5728\u4f4d\u7f6e p=4 \u5904\u8ba1\u7b97\u8f93\u51fa\uff1a"
            )}
          </p>
          <div className="font-mono text-sm bg-white dark:bg-paper-950 rounded p-3 border border-paper-200 dark:border-paper-600">
            <p className="text-paper-500 mb-1">{t("# Filter taps at offsets t=-1, 0, +1", "# \u6ee4\u6ce2\u5668\u6a20\u4f4d\u4e8e\u504f\u79fb t=-1, 0, +1")}</p>
            <p className="text-blue-600 dark:text-blue-400">s + l·t = p → s + 4·t = 4</p>
            <p className="text-paper-700 dark:text-paper-300">t=-1: s = 4 + 4 = 8 → L1_out[8] (covers original input 6..10)</p>
            <p className="text-paper-700 dark:text-paper-300">t= 0: s = 4 + 0 = 4 → L1_out[4] (covers original input 2..6)</p>
            <p className="text-paper-700 dark:text-paper-300">t=+1: s = 4 - 4 = 0 → L1_out[0] (covers original input -2..2)</p>
            <p className="text-green-600 dark:text-green-400 mt-2">
              {t("Combined span in original input: positions 0..8 → 9-wide = effective 9×1 filter ✓", "\u5728\u539f\u59cb\u8f93\u5165\u4e2d\u7684\u7ec4\u5408\u8303\u56f4\uff1a\u4f4d\u7f6e 0..8 \u2192 9 \u5bbd = \u6709\u6548 9\u00d71 \u6ee4\u6ce2\u5668 \u2713")}
            </p>
          </div>
        </div>

        <p>
          {t(
            "Two 3-tap filters (6 parameters total) see a 9-wide region. Equivalently in 2D: a 3\u00d73 filter with r=2 covers a 5\u00d75 footprint; stacking another 3\u00d73 filter with r=4 on top covers a 13\u00d713 footprint — all without any pooling or striding.",
            "\u4e24\u4e2a 3 \u6a20\u6ee4\u6ce2\u5668\uff086 \u4e2a\u53c2\u6570\uff09\u770b\u5230 9 \u5bbd\u7684\u533a\u57df\u3002\u7b49\u4ef7\u4e8e 2D\uff1ar=2 \u7684 3\u00d73 \u6ee4\u6ce2\u5668\u8986\u76d6 5\u00d75 \u8db3\u8ff9\uff1b\u5728\u5176\u4e0a\u5806\u53e0\u4e00\u4e2a r=4 \u7684 3\u00d73 \u6ee4\u6ce2\u5668\u8986\u76d6 13\u00d713 \u8db3\u8ff9\u2014\u5168\u90e8\u65e0\u9700\u4efb\u4f55\u6c60\u5316\u6216\u6b65\u957f\u3002"
          )}
        </p>

        {/* Section 6: Results on VOC */}
        <h2>
          {t(
            "6. Results on Pascal VOC",
            "6. Pascal VOC \u4e0a\u7684\u7ed3\u679c"
          )}
        </h2>

        <p>
          {t(
            "The authors evaluated on Pascal VOC 2012, the standard benchmark for semantic segmentation with 20 object categories plus background. The metric is mean Intersection over Union (mIoU).",
            "\u4f5c\u8005\u5728 Pascal VOC 2012 \u4e0a\u8fdb\u884c\u4e86\u8bc4\u4f30\uff0c\u8fd9\u662f\u5177\u6709 20 \u4e2a\u5bf9\u8c61\u7c7b\u522b\u52a0\u80cc\u666f\u7684\u8bed\u4e49\u5206\u5272\u6807\u51c6\u57fa\u51c6\u3002\u8bc4\u4f30\u6307\u6807\u662f\u5e73\u5747\u4ea4\u5e76\u6bd4\uff08mIoU\uff09\u3002"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-600 px-4 py-2 text-left">
                  {t("Method", "\u65b9\u6cd5")}
                </th>
                <th className="border border-paper-200 dark:border-paper-600 px-4 py-2 text-left">
                  {t("Backbone", "\u9aa8\u5e72\u7f51\u7edc")}
                </th>
                <th className="border border-paper-200 dark:border-paper-600 px-4 py-2 text-right">
                  {t("val mIoU (%)", "\u9a8c\u8bc1\u96c6 mIoU (%)")}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  method: t("FCN-32s (baseline)", "FCN-32s（\u57fa\u5e72\u7ebf\uff09"),
                  backbone: "VGG-16",
                  miou: "59.4",
                  highlight: false,
                },
                {
                  method: t("FCN-8s (skip connections)", "FCN-8s\uff08\u8df3\u8fc7\u8fde\u63a5\uff09"),
                  backbone: "VGG-16",
                  miou: "62.2",
                  highlight: false,
                },
                {
                  method: t("DeepLab v1 (CRF post-proc.)", "DeepLab v1\uff08CRF \u540e\u5904\u7406\uff09"),
                  backbone: "VGG-16",
                  miou: "67.6",
                  highlight: false,
                },
                {
                  method: t("Basic context module (ours)", "\u57fa\u672c\u4e0a\u4e0b\u6587\u6a21\u5757\uff08\u672c\u6587\uff09"),
                  backbone: "VGG-16",
                  miou: "66.2",
                  highlight: false,
                },
                {
                  method: t("Large context module (ours)", "\u5927\u578b\u4e0a\u4e0b\u6587\u6a21\u5757\uff08\u672c\u6587\uff09"),
                  backbone: "VGG-16",
                  miou: "67.1",
                  highlight: true,
                },
                {
                  method: t("Large context + CRF (ours)", "\u5927\u578b\u4e0a\u4e0b\u6587 + CRF\uff08\u672c\u6587\uff09"),
                  backbone: "VGG-16",
                  miou: "70.3",
                  highlight: true,
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  className={
                    row.highlight
                      ? "bg-blue-50 dark:bg-blue-900/20 font-semibold"
                      : i % 2 === 1
                      ? "bg-paper-50 dark:bg-paper-900/30"
                      : ""
                  }
                >
                  <td className="border border-paper-200 dark:border-paper-600 px-4 py-2">
                    {row.method}
                  </td>
                  <td className="border border-paper-200 dark:border-paper-600 px-4 py-2 font-mono text-paper-600 dark:text-paper-400">
                    {row.backbone}
                  </td>
                  <td
                    className={`border border-paper-200 dark:border-paper-600 px-4 py-2 text-right font-mono ${
                      row.highlight
                        ? "text-blue-700 dark:text-blue-400"
                        : ""
                    }`}
                  >
                    {row.miou}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The context module achieves competitive mIoU with FCN and DeepLab baselines, without any CRF post-processing. When combined with a CRF, it surpasses prior methods. Crucially, the improvement comes from richer multi-scale features, not architectural tricks or special training procedures.",
            "\u4e0a\u4e0b\u6587\u6a21\u5757\u5728\u6ca1\u6709\u4efb\u4f55 CRF \u540e\u5904\u7406\u7684\u60c5\u51b5\u4e0b\u5b9e\u73b0\u4e86\u4e0e FCN \u548c DeepLab \u57fa\u5e72\u7ebf\u5c81\u7684\u7ade\u4e89\u6027 mIoU\u3002\u4e0e CRF \u7ed3\u5408\u65f6\uff0c\u8d85\u8fc7\u4e86\u5148\u524d\u65b9\u6cd5\u3002\u81f3\u5173\u91cd\u8981\u7684\u662f\uff0c\u6539\u8fdb\u6765\u81ea\u66f4\u4e30\u5bcc\u7684\u591a\u5c3a\u5ea6\u7279\u5f81\uff0c\u800c\u975e\u67b6\u6784\u6280\u5de7\u6216\u7279\u6b8a\u8bad\u7ec3\u7a0b\u5e8f\u3002"
          )}
        </p>

        <Collapsible
          title={t(
            "What is mIoU and why does it matter?",
            "\u4ec0\u4e48\u662f mIoU\uff0c\u4e3a\u4ec0\u4e48\u91cd\u8981\uff1f"
          )}
        >
          <p>
            {t(
              "Mean Intersection over Union (mIoU) measures segmentation quality per class. For each class, IoU = |predicted \u2229 ground-truth| / |predicted \u222a ground-truth|. It penalizes both false positives (predicting a class where it isn\u2019t) and false negatives (missing pixels that belong to the class). The mean is taken over all classes including background. A difference of 2-3 mIoU points represents a meaningful improvement in real segmentation quality.",
              "\u5e73\u5747\u4ea4\u5e76\u6bd4\uff08mIoU\uff09\u6309\u7c7b\u6d4b\u91cf\u5206\u5272\u8d28\u91cf\u3002\u5bf9\u4e8e\u6bcf\u4e2a\u7c7b\u522b\uff0cIoU = |\u9884\u6218 \u2229 \u771f\u5b9e| / |\u9884\u6218 \u222a \u771f\u5b9e|\u3002\u5b83\u540c\u65f6\u60e9\u7f5a\u5047\u9633\u6027\uff08\u5728\u4e0d\u5b58\u5728\u7684\u5730\u65b9\u9884\u6218\u4e86\u67d0\u7c7b\u522b\uff09\u548c\u5047\u9634\u6027\uff08\u9057\u6f0f\u5c5e\u4e8e\u8be5\u7c7b\u522b\u7684\u50cf\u7d20\uff09\u3002\u5bf9\u6240\u6709\u7c7b\u522b\uff08\u5305\u62ec\u80cc\u666f\uff09\u53d6\u5e73\u5747\u5024\u3002mIoU \u76f8\u5dee 2-3 \u4e2a\u70b9\u4ee3\u8868\u5b9e\u9645\u5206\u5272\u8d28\u91cf\u7684\u663e\u8457\u6539\u8fdb\u3002"
            )}
          </p>
        </Collapsible>

        {/* Section 7: Influence on WaveNet, DeepLab */}
        <h2>
          {t(
            "7. Influence: WaveNet, DeepLab, and Beyond",
            "7. \u5f71\u54cd\uff1aWaveNet\u3001DeepLab \u53ca\u5176\u4ed6"
          )}
        </h2>

        <p>
          {t(
            "Dilated convolutions proved to be a general-purpose tool far beyond semantic segmentation. Two especially influential successors:",
            "\u81a8\u80c0\u5377\u79ef\u88ab\u8bc1\u660e\u662f\u8fdc\u8d85\u51fa\u8bed\u4e49\u5206\u5272\u9886\u57df\u7684\u901a\u7528\u5de5\u5177\u3002\u4e24\u4e2a\u7279\u522b\u5177\u5f71\u54cd\u529b\u7684\u540e\u7ee7\u5de5\u4f5c\uff1a"
          )}
        </p>

        <div className="space-y-4 my-6">
          <div className="border border-paper-200 dark:border-paper-700 rounded-lg p-5">
            <h3 className="font-semibold text-paper-900 dark:text-paper-100 mb-2">
              {t("WaveNet (van den Oord et al., DeepMind 2016)", "WaveNet\uff08van den Oord \u7b49\uff0cDeepMind 2016\uff09")}
            </h3>
            <p className="text-sm text-paper-700 dark:text-paper-300">
              {t(
                "WaveNet uses causal dilated convolutions for raw audio generation. The 1D signal requires extremely long-range context (audio at 16 kHz needs thousands of samples of context for coherent speech). Stacking dilated layers with rates 1, 2, 4, 8, ..., 512 gives a receptive field of 1024 samples — enough for tens of milliseconds of audio — with only ~30 layers. The exponential receptive field growth was directly inspired by this paper.",
                "WaveNet \u5c06\u56e0\u679c\u81a8\u80c0\u5377\u79ef\u7528\u4e8e\u539f\u59cb\u97f3\u9891\u751f\u6210\u3002\u4e00\u7ef4\u4fe1\u53f7\u9700\u8981\u6781\u957f\u7684\u8fdc\u7a0b\u4e0a\u4e0b\u6587\uff0816kHz \u97f3\u9891\u9700\u8981\u6570\u5343\u4e2a\u6837\u672c\u4e0a\u4e0b\u6587\u624d\u80fd\u751f\u6210\u8fde\u8d2f\u7684\u8bed\u97f3\uff09\u3002\u5806\u53e0\u7387\u4e3a 1, 2, 4, 8, ..., 512 \u7684\u81a8\u80c0\u5c42\u63d0\u4f9b\u4e86 1024 \u4e2a\u6837\u672c\u7684\u611f\u53d7\u91ce\u2014\u4ec5 30 \u5c42\u5c31\u8db3\u591f\u8054\u7cfb\u51e0\u5341\u6beb\u79d2\u7684\u97f3\u9891\u3002\u6307\u6570\u589e\u957f\u7684\u611f\u53d7\u91ce\u76f4\u63a5\u6e90\u81ea\u8be5\u8bba\u6587\u3002"
              )}
            </p>
          </div>

          <div className="border border-paper-200 dark:border-paper-700 rounded-lg p-5">
            <h3 className="font-semibold text-paper-900 dark:text-paper-100 mb-2">
              {t("DeepLab v2 / v3 / v3+ (Chen et al., Google 2018)", "DeepLab v2 / v3 / v3+\uff08Chen \u7b49\uff0cGoogle 2018\uff09")}
            </h3>
            <p className="text-sm text-paper-700 dark:text-paper-300">
              {t(
                "DeepLab extended dilated convolutions with Atrous Spatial Pyramid Pooling (ASPP): applying several dilated convolutions in parallel with different rates (e.g., r=6, 12, 18) and concatenating their outputs. This captures features at multiple scales simultaneously within a single layer, rather than sequentially. DeepLab v3+ achieved state-of-the-art on PASCAL VOC (89.0 mIoU) and Cityscapes, becoming the dominant segmentation paradigm for several years.",
                "DeepLab \u5c06\u81a8\u80c0\u5377\u79ef\u4e0e\u5e26\u5b54\u7a7a\u95f4\u91d1\u5b57\u5854\u6c60\u5316\uff08ASPP\uff09\u76f8\u7ed3\u5408\uff1a\u5e76\u884c\u5e94\u7528\u4e0d\u540c\u7387\uff08\u5982 r=6, 12, 18\uff09\u7684\u591a\u4e2a\u81a8\u80c0\u5377\u79ef\u5e76\u8fde\u63a5\u5176\u8f93\u51fa\u3002\u8fd9\u5728\u5355\u4e00\u5c42\u5185\u540c\u65f6\u6355\u83b7\u591a\u4e2a\u5c3a\u5ea6\u7684\u7279\u5f81\uff0c\u800c\u975e\u9010\u5e8f\u5904\u7406\u3002DeepLab v3+ \u5728 PASCAL VOC\uff0889.0 mIoU\uff09\u548c Cityscapes \u4e0a\u8fbe\u5230\u4e86\u6700\u4f18\u548c\uff0c\u6210\u4e3a\u591a\u5e74\u6765\u4e3b\u5bfc\u7684\u5206\u5272\u8303\u5f0f\u3002"
              )}
            </p>
          </div>

          <div className="border border-paper-200 dark:border-paper-700 rounded-lg p-5">
            <h3 className="font-semibold text-paper-900 dark:text-paper-100 mb-2">
              {t("Dilated Residual Networks (Yu et al., 2017)", "\u81a8\u80c0\u6b8b\u5dee\u7f51\u7edc\uff08Yu \u7b49\uff0c2017\uff09")}
            </h3>
            <p className="text-sm text-paper-700 dark:text-paper-300">
              {t(
                "A follow-up by the same authors replaced the final pooling layers of ResNet with dilated convolutions to maintain spatial resolution at 1/8 instead of 1/32. This became the standard practice for dense prediction tasks: use a classification backbone, remove the last stride, add dilation to compensate, and plug in a lightweight prediction head. This pattern underlies most modern segmentation and detection architectures.",
                "\u540c\u4e00\u4f5c\u8005\u7684\u540e\u7eed\u5de5\u4f5c\u5c06 ResNet \u7684\u6700\u540e\u51e0\u4e2a\u6c60\u5316\u5c42\u66ff\u6362\u4e3a\u81a8\u80c0\u5377\u79ef\uff0c\u5c06\u7a7a\u95f4\u5206\u8fa8\u7387\u4fdd\u6301\u5728 1/8 \u800c\u975e 1/32\u3002\u8fd9\u6210\u4e3a\u5bc6\u96c6\u9884\u6218\u4efb\u52a1\u7684\u6807\u51c6\u5b9e\u8df5\uff1a\u4f7f\u7528\u5206\u7c7b\u9aa8\u5e72\u7f51\u7edc\uff0c\u53bb\u6389\u6700\u540e\u7684\u6b65\u957f\uff0c\u6dfb\u52a0\u81a8\u80c0\u4ee5\u8865\u507f\uff0c\u5e76\u63d2\u5165\u8f7b\u91cf\u7ea7\u9884\u6218\u5934\u3002\u8fd9\u79cd\u6a21\u5f0f\u662f\u5927\u591a\u6570\u73b0\u4ee3\u5206\u5272\u548c\u68c0\u6d4b\u67b6\u6784\u7684\u57fa\u7840\u3002"
              )}
            </p>
          </div>
        </div>

        <Collapsible
          title={t(
            "Dilated convolutions in NLP and speech",
            "\u81a8\u80c0\u5377\u79ef\u5728 NLP \u548c\u8bed\u97f3\u4e2d\u7684\u5e94\u7528"
          )}
        >
          <p>
            {t(
              "Beyond vision, dilated convolutions appeared in several NLP architectures. ByteNet (Kalchbrenner et al. 2017) used dilated causal convolutions for neural machine translation, achieving linear-time sequence-to-sequence modeling. Before Transformers became dominant, dilated temporal convolution networks (TCN) competed with LSTMs on sequential tasks. The Transformer itself can be viewed as a form of global (infinite dilation) attention — but for local sequence tasks, dilated convolutions remain computationally cheaper and easier to parallelize.",
              "\u8d85\u8d8a\u89c6\u89c9\u9886\u57df\uff0c\u81a8\u80c0\u5377\u79ef\u51fa\u73b0\u5728\u591a\u4e2a NLP \u67b6\u6784\u4e2d\u3002ByteNet\uff08Kalchbrenner \u7b49 2017\uff09\u5c06\u81a8\u80c0\u56e0\u679c\u5377\u79ef\u7528\u4e8e\u795e\u7ecf\u673a\u5668\u7ffb\u8bd1\uff0c\u5b9e\u73b0\u4e86\u7ebf\u6027\u65f6\u95f4\u7684\u5e8f\u5217\u5230\u5e8f\u5217\u5efa\u6a21\u3002\u5728 Transformer \u5360\u4e3b\u5bfc\u4e4b\u524d\uff0c\u81a8\u80c0\u65f6\u5e8f\u5377\u79ef\u7f51\u7edc\uff08TCN\uff09\u5728\u5e8f\u5217\u4efb\u52a1\u4e0a\u4e0e LSTM \u7ade\u4e89\u3002Transformer \u672c\u8eab\u53ef\u4ee5\u88ab\u770b\u4f5c\u4e00\u79cd\u5168\u5c40\uff08\u65e0\u9650\u81a8\u80c0\uff09\u6ce8\u610f\u529b\u2014\u4f46\u5bf9\u4e8e\u5c40\u90e8\u5e8f\u5217\u4efb\u52a1\uff0c\u81a8\u80c0\u5377\u79ef\u7684\u8ba1\u7b97\u6210\u672c\u4ecd\u7136\u66f4\u4f4e\uff0c\u5e76\u884c\u5316\u66f4\u5bb9\u6613\u3002"
            )}
          </p>
        </Collapsible>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-paper-200 dark:border-paper-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; {t("Back to Papers", "\u8fd4\u56de\u8bba\u6587\u5217\u8868")}
          </Link>
        </div>
      </article>
    </div>
  );
}
