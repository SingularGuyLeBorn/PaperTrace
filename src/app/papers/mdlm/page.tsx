"use client";

import { Math } from "@/components/Math";
import { Widget } from "@/components/Widget";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { ELBOViz } from "@/components/widgets/ELBOViz";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function MDLMPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "MDLM: Simple and Effective Masked Diffusion Language Models",
            "MDLM: 简洁有效的掩码扩散语言模型"
          )}
        </h1>
        <p className="text-paper-800/50">
          Sahoo et al. &middot; NeurIPS 2024 &middot;{" "}
          <a href="https://arxiv.org/abs/2406.07524" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            arXiv 2406.07524
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "MDLM derives a clean, principled training objective for masked diffusion language models from first principles — starting from a continuous-time ELBO. It shows that a simple absorbing-state diffusion (tokens → [MASK]) with the right loss weighting achieves strong perplexity results, providing the theoretical foundation that LLaDA later scales up.",
              "MDLM 从基本原理出发，为掩码扩散语言模型推导出简洁、有理论依据的训练目标 — 从连续时间 ELBO 开始。它证明了简单的吸收态扩散 (token → [MASK]) 加上正确的损失加权可以达到很好的困惑度，为后来 LLaDA 的扩展奠定了理论基础。"
            )}
          </p>
        </section>

        {/* FlowChart */}
        <FlowChart
          title={t("Architecture Overview", "架构总览")}
          steps={[
            {
              title: t("Problem: No principled training for discrete diffusion", "问题：离散扩散缺乏有原则的训练方法"),
              subtitle: t("Prior work (D3PM) had complex objectives with many terms", "先前工作 (D3PM) 有复杂的多项目标"),
              color: "rose",
            },
            {
              title: t("Insight: Continuous-time limit simplifies everything", "洞察：连续时间极限简化一切"),
              subtitle: t("Take the ELBO in continuous time → clean closed-form loss", "在连续时间下取 ELBO → 简洁的闭式损失"),
              color: "amber",
            },
            {
              title: t("Method: Absorbing-state masked diffusion + ELBO loss", "方法：吸收态掩码扩散 + ELBO 损失"),
              color: "blue",
              children: [
                { title: t("Forward: token → [MASK]", "前向: token → [MASK]"), subtitle: t("Absorbing state = masking", "吸收态 = 掩码"), color: "blue" },
                { title: t("Loss: weighted CE on masks", "损失: 掩码上的加权 CE"), subtitle: t("Weight = 1/t for proper ELBO", "权重 = 1/t 确保 ELBO 正确"), color: "green" },
              ],
            },
            {
              title: t("Result: Strong perplexity, simple implementation", "结果：良好困惑度，简洁实现"),
              color: "green",
            },
          ]}
          arrows={[
            t("Key question", "关键问题"),
            t("Derivation", "推导"),
            undefined,
          ]}
          highlights={[
            { text: t("Theoretical foundation for LLaDA", "LLaDA 的理论基础"), color: "blue" },
            { text: t("~100 lines of core code", "核心代码约 100 行"), color: "green" },
          ]}
        />

        {/* ============ Section 1 ============ */}
        <h2>{t("1. Background: Why We Need Better Theory", "1. 背景：为什么需要更好的理论")}</h2>

        <p>
          {t(
            "Discrete diffusion models (like D3PM) existed before MDLM, but they had issues:",
            "在 MDLM 之前，离散扩散模型 (如 D3PM) 已经存在，但存在问题："
          )}
        </p>
        <ul>
          <li>
            <strong>{t("Complex ELBO", "复杂的 ELBO")}</strong>: {t("D3PM's loss has many terms that are hard to balance", "D3PM 的损失有很多难以平衡的项")}
          </li>
          <li>
            <strong>{t("Auxiliary losses", "辅助损失")}</strong>: {t("needed extra loss terms to work well in practice", "实践中需要额外的损失项才能有效")}
          </li>
          <li>
            <strong>{t("Gap from continuous", "与连续扩散的差距")}</strong>: {t("continuous diffusion (images) had cleaner theory — can we match it for discrete?", "连续扩散 (图像) 有更简洁的理论 — 能否在离散场景也做到？")}
          </li>
        </ul>

        <p>
          {t(
            "MDLM answers: yes. By taking the continuous-time limit of the discrete ELBO, we get an elegant, simple loss.",
            "MDLM 的回答：可以。通过取离散 ELBO 的连续时间极限，我们得到一个优雅、简洁的损失。"
          )}
        </p>

        {/* ============ Section 2 ============ */}
        <h2>{t("2. The Forward Process: Absorbing Diffusion", "2. 前向过程：吸收扩散")}</h2>

        <p>
          {t(
            "MDLM uses an absorbing-state forward process — each token independently transitions to [MASK] (the absorbing state) at rate β(t):",
            "MDLM 使用吸收态前向过程 — 每个 token 以速率 β(t) 独立地转移到 [MASK] (吸收态)："
          )}
        </p>

        <Math
          display
          label={t("Forward transition probability", "前向转移概率")}
          tex="q(x_t = \texttt{[M]} \mid x_0) = 1 - e^{-\int_0^t \beta(s)\,ds} \triangleq 1 - \alpha_t"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-2">
              <Math tex="\beta(t)" />
              <span>{t("Noise rate at time t — controls how fast tokens get masked", "时间 t 的噪声速率 — 控制 token 被掩码的速度")}</span>

              <Math tex="\alpha_t" />
              <span>{t("Survival probability: probability that token is still unmasked at time t", "存活概率：token 在时间 t 仍未被掩码的概率")}</span>

              <Math tex="e^{-\\int_0^t \\beta(s)\\,ds}" />
              <span>{t("Exponential decay — same math as radioactive decay!", "指数衰减 — 和放射性衰减的数学一样！")}</span>
            </div>
            <p className="p-3 bg-blue-50 rounded border border-blue-200 mt-3">
              {t(
                "This is more general than LLaDA's \"mask with probability t\". By choosing different β(t), we can have non-linear masking schedules. When β(t) = 1/(1-t), we recover LLaDA's linear schedule where α_t = 1-t.",
                "这比 LLaDA 的「以概率 t 掩码」更通用。通过选择不同的 β(t)，我们可以有非线性掩码调度。当 β(t) = 1/(1-t) 时，我们恢复 LLaDA 的线性调度，即 α_t = 1-t。"
              )}
            </p>
          </div>
        </Collapsible>

        <Collapsible title={t("Concrete example: α_t with linear schedule", "具体例子：线性调度下的 α_t")}>
          <div className="text-sm space-y-2 font-mono text-xs">
            <div className="p-2 bg-paper-100 rounded">t = 0.0: <Math tex="\alpha_t = 1.0" /> → {t("100% unmasked", "100% 未掩码")}</div>
            <div className="p-2 bg-paper-100 rounded">t = 0.3: <Math tex="\alpha_t = 0.7" /> → {t("70% survive, 30% masked", "70% 存活，30% 掩码")}</div>
            <div className="p-2 bg-paper-100 rounded">t = 0.7: <Math tex="\alpha_t = 0.3" /> → {t("30% survive, 70% masked", "30% 存活，70% 掩码")}</div>
            <div className="p-2 bg-paper-100 rounded">t = 1.0: <Math tex="\alpha_t = 0.0" /> → {t("0% survive, all masked", "0% 存活，全部掩码")}</div>
          </div>
        </Collapsible>

        {/* ============ Section 3: ELBO ============ */}
        <h2>{t("3. The Continuous-Time ELBO", "3. 连续时间 ELBO")}</h2>

        <p>
          {t(
            "The key contribution: MDLM derives a clean ELBO in continuous time. Starting from the standard variational bound:",
            "核心贡献：MDLM 推导出连续时间下的简洁 ELBO。从标准变分界开始："
          )}
        </p>

        <Math
          display
          label={t("Continuous-time ELBO", "连续时间 ELBO")}
          tex="\log p(x_0) \geq \mathbb{E}_{q}\left[-\int_0^1 \underbrace{\frac{\beta(t)}{1-\alpha_t} \sum_{i: x_t^i = \texttt{[M]}} \log p_\theta(x_0^i \mid x_t)}_{L_t}\, dt\right]"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[180px_1fr] gap-y-3 gap-x-2">
              <Math tex="\log p(x_0)" />
              <span>{t("Log-likelihood of the data — what we want to maximize", "数据的对数似然 — 我们想最大化的东西")}</span>

              <Math tex="\geq" />
              <span>{t("Evidence Lower BOund — maximizing the right side pushes up log p(x₀)", "证据下界 — 最大化右边会推高 log p(x₀)")}</span>

              <Math tex="\int_0^1 \cdots\, dt" />
              <span>{t("Integrate over all timesteps — continuous version of summing over T discrete steps", "对所有时间步积分 — 对 T 个离散步求和的连续版本")}</span>

              <Math tex="\frac{\beta(t)}{1-\alpha_t}" />
              <span>{t("Weighting factor — derived from the math, not hand-tuned. This is what makes it \"principled\"", "权重因子 — 从数学推导得出，而非手动调整。这就是「有原则」的含义")}</span>

              <Math tex="\sum_{i: x_t^i = \texttt{[M]}}" />
              <span>{t("Sum over masked positions only", "仅对掩码位置求和")}</span>

              <Math tex="\log p_\theta(x_0^i \\mid x_t)" />
              <span>{t("Cross-entropy: how well does the model predict each masked token?", "交叉熵：模型预测每个掩码 token 的准确程度")}</span>
            </div>
          </div>
        </Collapsible>

        <h3>{t("Practical Training Loss", "实际训练损失")}</h3>

        <p>
          {t(
            "In practice, we can't compute the integral — so we sample t uniformly and get:",
            "实践中，我们无法计算积分 — 所以均匀采样 t 得到："
          )}
        </p>

        <Math
          display
          label={t("MDLM training loss (Monte Carlo estimate)", "MDLM 训练损失 (蒙特卡洛估计)")}
          tex="\mathcal{L}_{\text{MDLM}} = -\mathbb{E}_{t \sim \mathcal{U}(0,1)}\left[\frac{\beta(t)}{1-\alpha_t} \sum_{i: x_t^i = \texttt{[M]}} \log p_\theta(x_0^i \mid x_t)\right]"
        />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Connection to LLaDA", "与 LLaDA 的联系")}</strong>: {t(
              "With the linear schedule β(t)=1/(1-t), we get α_t=1-t and β(t)/(1-α_t) = 1/t/(t) = 1/(t·L) when normalized. This is exactly LLaDA's loss! MDLM provides the theoretical justification for LLaDA's training objective.",
              "使用线性调度 β(t)=1/(1-t)，我们得到 α_t=1-t，归一化后 β(t)/(1-α_t) = 1/(t·L)。这恰好就是 LLaDA 的损失！MDLM 为 LLaDA 的训练目标提供了理论依据。"
            )}
          </p>
        </div>

        <Widget
          title={t("Interactive: ELBO Decomposition Across Timesteps", "交互：ELBO 在时间步上的分解")}
          description={t("Hover to see per-step contribution", "悬停查看每步贡献")}
        >
          <ELBOViz />
        </Widget>

        {/* ============ Section 4: Noise Schedule ============ */}
        <h2>{t("4. Noise Schedule Design", "4. 噪声调度设计")}</h2>

        <p>
          {t(
            "MDLM explores different noise schedules β(t) and finds that the choice matters significantly:",
            "MDLM 探索了不同的噪声调度 β(t)，发现选择对结果有显著影响："
          )}
        </p>

        <Math
          display
          label={t("Log-linear schedule (best performing)", "对数线性调度 (最佳表现)")}
          tex="\alpha_t = \frac{1 - t}{1 + (e^{10} - 1) \cdot t} \quad \Rightarrow \quad \text{slow start, fast end}"
        />

        <Collapsible title={t("Why does the schedule matter?", "为什么调度很重要？")}>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "The noise schedule controls how fast tokens get masked at different stages:",
                "噪声调度控制不同阶段 token 被掩码的速度："
              )}
            </p>
            <ul>
              <li><strong>{t("Linear", "线性")}</strong> (<Math tex="\alpha_t = 1-t" />): {t("uniform masking rate — simple but suboptimal", "均匀掩码率 — 简单但次优")}</li>
              <li><strong>{t("Cosine", "余弦")}</strong>: {t("slower early, faster late — borrowed from image diffusion", "早期慢，后期快 — 借鉴自图像扩散")}</li>
              <li><strong>{t("Log-linear", "对数线性")}</strong>: {t("even slower early masking — preserves structure longer, giving the model more \"easy\" examples early in training", "更慢的早期掩码 — 更长时间保持结构，在训练早期给模型更多「简单」样本")}</li>
            </ul>
          </div>
        </Collapsible>

        {/* ============ Section 5: Experiments ============ */}
        <h2>{t("5. Experiments & Results", "5. 实验与结果")}</h2>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-paper-200">
                <th className="text-left py-2 pr-4">{t("Model", "模型")}</th>
                <th className="text-left py-2 pr-4">{t("Type", "类型")}</th>
                <th className="text-center py-2 pr-4">{t("PPL (text8)", "PPL (text8)")}</th>
                <th className="text-center py-2">{t("PPL (OpenWebText)", "PPL (OpenWebText)")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">D3PM (absorbing)</td>
                <td className="py-2 pr-4 text-paper-800/50">{t("Discrete Diff.", "离散扩散")}</td>
                <td className="text-center py-2 pr-4">1.45</td>
                <td className="text-center py-2">—</td>
              </tr>
              <tr className="border-b border-paper-200">
                <td className="py-2 pr-4">SEDD</td>
                <td className="py-2 pr-4 text-paper-800/50">{t("Score Entropy", "分数熵")}</td>
                <td className="text-center py-2 pr-4">1.39</td>
                <td className="text-center py-2">32.1</td>
              </tr>
              <tr className="bg-blue-50/50">
                <td className="py-2 pr-4 font-medium">MDLM</td>
                <td className="py-2 pr-4 text-blue-600">{t("Masked Diff.", "掩码扩散")}</td>
                <td className="text-center py-2 pr-4 font-medium">1.36</td>
                <td className="text-center py-2 font-medium">31.2</td>
              </tr>
              <tr className="border-t border-paper-200">
                <td className="py-2 pr-4">GPT-2 (small)</td>
                <td className="py-2 pr-4 text-paper-800/50">AR</td>
                <td className="text-center py-2 pr-4">—</td>
                <td className="text-center py-2">29.1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Key result", "关键结果")}</strong>: {t(
              "MDLM outperforms all prior discrete diffusion models and nearly matches GPT-2 on OpenWebText. The gap to AR models is small enough to suggest that with more scale (which LLaDA later demonstrates), diffusion LMs can be fully competitive.",
              "MDLM 超越了所有先前的离散扩散模型，在 OpenWebText 上几乎匹配 GPT-2。与 AR 模型的差距足够小，表明通过更大规模 (LLaDA 后来证明了这一点)，扩散语言模型可以完全有竞争力。"
            )}
          </p>
        </div>

        {/* ============ Section 6: Limitations ============ */}
        <h2>{t("6. Limitations & Future Work", "6. 局限性与未来工作")}</h2>

        <ul>
          <li>
            <strong>{t("Scale", "规模")}</strong>: {t("Only tested up to ~110M parameters. LLaDA later proves it works at 8B.", "仅在约 110M 参数上测试。LLaDA 后来证明在 8B 上有效。")}
          </li>
          <li>
            <strong>{t("Generation quality", "生成质量")}</strong>: {t("Perplexity is good but unconditional text samples can be incoherent — needs SFT/RLHF.", "困惑度不错但无条件文本样本可能不连贯 — 需要 SFT/RLHF。")}
          </li>
          <li>
            <strong>{t("Schedule sensitivity", "调度敏感性")}</strong>: {t("Performance depends on noise schedule choice — not fully understood why log-linear works best.", "性能取决于噪声调度选择 — 为什么对数线性最好尚不完全理解。")}
          </li>
        </ul>

        {/* ============ Section 7: Connections ============ */}
        <h2>{t("7. Connections to Other Work", "7. 与其他工作的联系")}</h2>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`/papers/llada`} className="font-semibold text-blue-600 hover:underline">LLaDA</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Scales up MDLM's framework to 8B parameters. Uses MDLM's training objective (with linear schedule). Proves that masked diffusion works at LLM scale.",
                "将 MDLM 的框架扩展到 8B 参数。使用 MDLM 的训练目标 (线性调度)。证明掩码扩散在 LLM 规模上有效。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`/papers/fast-dllm`} className="font-semibold text-blue-600 hover:underline">Fast DLLM</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Optimizes MDLM's inference speed using the ELBO decomposition that MDLM derives. The per-step L_t values come directly from MDLM's theory.",
                "使用 MDLM 推导的 ELBO 分解来优化推理速度。每步的 L_t 值直接来自 MDLM 的理论。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`/papers/block-diffusion`} className="font-semibold text-blue-600 hover:underline">Block Diffusion</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "Uses MDLM's within-block diffusion framework combined with AR between blocks.",
                "在块内使用 MDLM 的扩散框架，块间结合 AR。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <span className="font-semibold text-paper-800">D3PM (Austin et al. 2021)</span>
            <p className="text-sm text-paper-800/70 mt-1">
              {t(
                "The predecessor. D3PM introduced discrete diffusion with transition matrices. MDLM simplifies D3PM's approach by taking the continuous-time limit and focusing on the absorbing state.",
                "前身。D3PM 引入了带转移矩阵的离散扩散。MDLM 通过取连续时间极限并聚焦吸收态来简化 D3PM 的方法。"
              )}
            </p>
          </div>
        </div>

        {/* ============ Section 8: Resources ============ */}
        <h2>{t("8. Additional Resources", "8. 补充资源")}</h2>

        <div className="space-y-2 my-4">
          <a href="https://arxiv.org/abs/2406.07524" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">MDLM (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Original paper", "原始论文")}</span>
          </a>
          <a href="https://github.com/kuleshov-group/mdlm" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">GitHub: kuleshov-group/mdlm</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Official code", "官方代码")}</span>
          </a>
          <a href="https://arxiv.org/abs/2107.03006" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">D3PM (Austin et al. 2021)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Predecessor — discrete diffusion with transition matrices", "前身 — 带转移矩阵的离散扩散")}</span>
          </a>
        </div>
      </article>
    </div>
  );
}
