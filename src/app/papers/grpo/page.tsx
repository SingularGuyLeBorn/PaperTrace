"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function GRPOPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("GRPO: Group Relative Policy Optimization", "GRPO: 组相对策略优化")}
        </h1>
        <p className="text-paper-800/50">
          Shao et al. (DeepSeek) &middot; 2024 &middot;{" "}
          <a href="https://arxiv.org/abs/2402.03300" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">arXiv 2402.03300</a>
        </p>
      </header>

      <article className="paper-content">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "GRPO is DeepSeek's simplified PPO variant. Key change: instead of training a separate value/critic network to estimate advantages, GRPO samples a GROUP of responses and uses the group's mean reward as the baseline. No critic network → less memory, simpler training.",
              "GRPO 是 DeepSeek 的简化版 PPO。关键变化：不训练独立的价值/critic 网络来估计优势，而是采样一组响应，用组内平均奖励作为基线。没有 critic 网络 → 更少内存，更简单的训练。"
            )}
          </p>
        </section>

        <FlowChart
          title={t("GRPO vs PPO", "GRPO vs PPO")}
          steps={[
            {
              title: t("PPO: needs a value network (critic)", "PPO: 需要价值网络 (critic)"),
              subtitle: t("Extra model to train, doubles memory", "额外的模型需要训练，内存翻倍"),
              color: "rose",
            },
            {
              title: t("GRPO: replace critic with group statistics", "GRPO: 用组统计量替代 critic"),
              subtitle: t("Sample G responses → normalize rewards within group", "采样 G 个响应 → 组内归一化奖励"),
              color: "amber",
            },
            {
              title: t("Advantage = (reward - group_mean) / group_std", "优势 = (reward - 组均值) / 组标准差"),
              color: "green",
            },
          ]}
          arrows={[t("Key change", "关键变化"), undefined]}
          highlights={[
            { text: t("No critic network needed", "不需要 critic 网络"), color: "green" },
            { text: t("50% less GPU memory", "GPU 内存减少 50%"), color: "blue" },
            { text: t("Used in DeepSeek-R1", "用于 DeepSeek-R1"), color: "purple" },
          ]}
        />

        <h2>{t("1. The Problem with PPO's Critic", "1. PPO Critic 的问题")}</h2>

        <p>
          {t(
            "In standard PPO, you need a value network V_ψ(s) to estimate the expected future reward at each state. This value network:",
            "在标准 PPO 中，需要一个价值网络 V_ψ(s) 来估计每个状态的预期未来奖励。这个价值网络："
          )}
        </p>
        <ul>
          <li>{t("Is often as large as the policy model itself", "通常与策略模型一样大")}</li>
          <li>{t("Requires its own training loop", "需要自己的训练循环")}</li>
          <li>{t("Can be hard to train well for language tasks", "对语言任务可能难以训练好")}</li>
        </ul>

        <h2>{t("2. The GRPO Solution", "2. GRPO 的解决方案")}</h2>

        <p>
          {t(
            "For each prompt x, sample G responses and compute advantages using group statistics:",
            "对于每个提示 x，采样 G 个响应，使用组统计量计算优势："
          )}
        </p>

        <Math
          display
          label={t("GRPO advantage estimation", "GRPO 优势估计")}
          tex="\hat{A}_i = \frac{r_i - \text{mean}(\{r_1, \ldots, r_G\})}{\text{std}(\{r_1, \ldots, r_G\})}"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-2">
              <Math tex="G" />
              <span>{t("Group size — number of responses sampled per prompt (e.g. 64)", "组大小 — 每个提示采样的响应数 (如 64)")}</span>

              <Math tex="r_i" />
              <span>{t("Reward for the i-th response in the group (from reward model or verifier)", "组中第 i 个响应的奖励 (来自奖励模型或验证器)")}</span>

              <Math tex="\hat{A}_i" />
              <span>{t("Normalized advantage: z-score within the group. Positive = better than group average, negative = worse", "归一化优势：组内 z-score。正 = 优于组平均，负 = 低于组平均")}</span>
            </div>
          </div>
        </Collapsible>

        <Math
          display
          label={t("GRPO objective (same structure as PPO but with group advantages)", "GRPO 目标 (与 PPO 结构相同但使用组优势)")}
          tex="\mathcal{L}_{\text{GRPO}} = \mathbb{E}\left[\frac{1}{G}\sum_{i=1}^{G}\min\!\left(\frac{\pi_\theta(y_i|x)}{\pi_{\text{old}}(y_i|x)}\hat{A}_i,\;\text{clip}(\cdot)\hat{A}_i\right) - \beta\,D_{\text{KL}}[\pi_\theta\|\pi_{\text{ref}}]\right]"
        />

        <Collapsible title={t("Concrete example: GRPO in action", "具体例子：GRPO 实战")} defaultOpen>
          <div className="text-sm space-y-2">
            <p>{t("Prompt: \"What is 7 × 8?\" Sample G=4 responses:", "提示: \"7 × 8 等于多少?\" 采样 G=4 个响应:")}</p>
            <div className="space-y-1 font-mono text-xs">
              <div className="p-2 bg-green-50 rounded">y₁: &quot;56&quot; → r₁ = 1.0 ✓</div>
              <div className="p-2 bg-red-50 rounded">y₂: &quot;54&quot; → r₂ = 0.0 ✗</div>
              <div className="p-2 bg-green-50 rounded">y₃: &quot;56&quot; → r₃ = 1.0 ✓</div>
              <div className="p-2 bg-red-50 rounded">y₄: &quot;58&quot; → r₄ = 0.0 ✗</div>
            </div>
            <div className="p-2 bg-paper-100 rounded font-mono text-xs mt-2">
              <div>mean = 0.5, std = 0.5</div>
              <div>Â₁ = (1.0 - 0.5) / 0.5 = <strong>+1.0</strong> ({t("reward correct answers", "奖励正确答案")})</div>
              <div>Â₂ = (0.0 - 0.5) / 0.5 = <strong>-1.0</strong> ({t("penalize wrong answers", "惩罚错误答案")})</div>
            </div>
          </div>
        </Collapsible>

        <h2>{t("3. Why GRPO Works for Math/Code", "3. 为什么 GRPO 适合数学/代码")}</h2>

        <p>
          {t(
            "GRPO is especially effective for verifiable tasks (math, code) where you can compute exact rewards (correct/incorrect). DeepSeek used it to train DeepSeek-Math (51.7% on MATH) and DeepSeek-R1.",
            "GRPO 对可验证任务 (数学、代码) 特别有效，因为可以计算精确奖励 (正确/错误)。DeepSeek 用它训练了 DeepSeek-Math (MATH 上 51.7%) 和 DeepSeek-R1。"
          )}
        </p>

        <h2>{t("4. Connections", "4. 与其他工作的联系")}</h2>
        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`/papers/ppo`} className="font-semibold text-blue-600 hover:underline">PPO</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t("GRPO's parent — same clipping mechanism but GRPO replaces the critic with group statistics.", "GRPO 的前身 — 相同的裁剪机制但 GRPO 用组统计量替代了 critic。")}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`/papers/dpo`} className="font-semibold text-blue-600 hover:underline">DPO</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t("Different approach: DPO removes RL entirely. GRPO keeps RL (online sampling) but simplifies it. GRPO is better for math/code; DPO is easier for general alignment.", "不同方法：DPO 完全移除 RL。GRPO 保留 RL (在线采样) 但简化了它。GRPO 对数学/代码更好；DPO 对通用对齐更容易。")}
            </p>
          </div>
        </div>

        <h2>{t("5. Additional Resources", "5. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a href="https://arxiv.org/abs/2402.03300" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">DeepSeekMath (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Introduces GRPO", "引入 GRPO")}</span>
          </a>
          <a href="https://arxiv.org/abs/2501.12948" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">DeepSeek-R1 (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("GRPO at scale for reasoning", "GRPO 规模化用于推理")}</span>
          </a>
        </div>
      </article>
    </div>
  );
}
