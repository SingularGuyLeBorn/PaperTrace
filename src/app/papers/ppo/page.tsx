"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function PPOPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("PPO: Proximal Policy Optimization", "PPO: 近端策略优化")}
        </h1>
        <p className="text-paper-800/50">
          Schulman et al. &middot; 2017 &middot;{" "}
          <a href="https://arxiv.org/abs/1707.06347" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">arXiv 1707.06347</a>
        </p>
      </header>

      <article className="paper-content">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "PPO is a policy gradient RL algorithm that clips the objective to prevent too-large updates. It's the \"workhorse\" of RLHF — used in InstructGPT/ChatGPT to optimize LLMs with human feedback. Simple, stable, and effective.",
              "PPO 是一种策略梯度 RL 算法，通过裁剪目标函数防止过大的更新。它是 RLHF 的「主力」— 在 InstructGPT/ChatGPT 中用于根据人类反馈优化 LLM。简单、稳定、有效。"
            )}
          </p>
        </section>

        <FlowChart
          title={t("PPO in RLHF Pipeline", "RLHF 流程中的 PPO")}
          steps={[
            { title: t("1. SFT Model (reference)", "1. SFT 模型 (参考)"), color: "gray" },
            { title: t("2. Reward Model trained on human preferences", "2. 在人类偏好上训练奖励模型"), color: "amber" },
            {
              title: t("3. PPO optimizes policy against reward model", "3. PPO 根据奖励模型优化策略"),
              color: "blue",
              children: [
                { title: t("Sample from policy", "从策略采样"), color: "blue" },
                { title: t("Score with reward model", "用奖励模型打分"), color: "green" },
                { title: t("Clip & update policy", "裁剪 & 更新策略"), color: "purple" },
              ],
            },
          ]}
          arrows={[undefined, undefined]}
        />

        <h2>{t("1. The PPO Objective", "1. PPO 目标函数")}</h2>

        <Math
          display
          label={t("PPO-Clip objective", "PPO-Clip 目标函数")}
          tex="\mathcal{L}^{\text{CLIP}}(\theta) = \mathbb{E}_t\left[\min\!\left(r_t(\theta)\hat{A}_t,\; \text{clip}(r_t(\theta), 1{-}\epsilon, 1{+}\epsilon)\hat{A}_t\right)\right]"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-2">
              <Math tex="r_t(\theta)" />
              <span>{t("Probability ratio: π_θ(a|s) / π_old(a|s) — how much has the policy changed?", "概率比：π_θ(a|s) / π_old(a|s) — 策略变化了多少？")}</span>

              <Math tex="\hat{A}_t" />
              <span>{t("Estimated advantage: how much better is action a than the average? Positive = good, negative = bad", "估计优势：动作 a 比平均好多少？正 = 好，负 = 差")}</span>

              <Math tex="\epsilon" />
              <span>{t("Clip range (typically 0.2) — limits how much r_t can deviate from 1", "裁剪范围 (通常 0.2) — 限制 r_t 偏离 1 的程度")}</span>

              <span className="font-mono text-xs text-blue-600">clip()</span>
              <span>{t("Clamps r_t to [1-ε, 1+ε] — prevents policy from changing too much in one step", "将 r_t 限制在 [1-ε, 1+ε] — 防止策略在一步中变化太大")}</span>

              <span className="font-mono text-xs text-blue-600">min()</span>
              <span>{t("Conservative update: takes the worse of clipped/unclipped — only improves if BOTH agree", "保守更新：取裁剪/未裁剪中较差的 — 只有两者都同意时才改进")}</span>
            </div>
          </div>
        </Collapsible>

        <Collapsible title={t("Concrete example: Why clipping helps", "具体例子：为什么裁剪有帮助")}>
          <div className="text-sm space-y-2">
            <p>{t("Suppose ε=0.2 and the advantage Â=+2 (action was good):", "假设 ε=0.2，优势 Â=+2 (动作很好):")}</p>
            <div className="p-2 bg-paper-100 rounded font-mono text-xs">
              <div>{t("Without clip: r_t could become 5.0 → huge update → policy destabilizes", "无裁剪: r_t 可能变成 5.0 → 巨大更新 → 策略不稳定")}</div>
              <div>{t("With clip: r_t is clamped to [0.8, 1.2] → max objective = 1.2 × 2 = 2.4", "有裁剪: r_t 被限制在 [0.8, 1.2] → 最大目标 = 1.2 × 2 = 2.4")}</div>
              <div className="text-paper-800/40 mt-1">{t("The policy improves, but in small, controlled steps.", "策略改进，但是小步、可控地改进。")}</div>
            </div>
          </div>
        </Collapsible>

        <h2>{t("2. PPO for LLMs (RLHF)", "2. 用于 LLM 的 PPO (RLHF)")}</h2>

        <p>
          {t("When applied to LLMs, the setup becomes:", "应用于 LLM 时，设置变为：")}
        </p>

        <Math
          display
          label={t("RLHF with PPO", "使用 PPO 的 RLHF")}
          tex="\text{reward} = r_\phi(x, y) - \beta \cdot D_{\text{KL}}[\pi_\theta \| \pi_{\text{ref}}]"
        />

        <div className="grid grid-cols-[100px_1fr] gap-y-2 gap-x-2 text-sm my-4 p-3 bg-paper-100 rounded">
          <span className="font-mono text-xs">{t("State", "状态")}</span><span>= {t("prompt x", "提示 x")}</span>
          <span className="font-mono text-xs">{t("Action", "动作")}</span><span>= {t("full response y", "完整回复 y")}</span>
          <span className="font-mono text-xs">{t("Reward", "奖励")}</span><span>= {t("reward model score minus KL penalty", "奖励模型评分减去 KL 惩罚")}</span>
          <span className="font-mono text-xs">{t("Policy", "策略")}</span><span>= {t("the LLM π_θ", "LLM π_θ")}</span>
        </div>

        <h2>{t("3. Connections", "3. 与其他工作的联系")}</h2>
        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`${basePath}/papers/dpo`} className="font-semibold text-blue-600 hover:underline">DPO</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t("Eliminates PPO entirely by reparameterizing the reward — simpler but less flexible.", "通过重参数化奖励完全消除 PPO — 更简单但灵活性更低。")}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`${basePath}/papers/grpo`} className="font-semibold text-blue-600 hover:underline">GRPO</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t("Simplifies PPO by removing the critic/value network and using group-relative baselines.", "通过移除 critic/价值网络并使用组相对基线来简化 PPO。")}
            </p>
          </div>
        </div>

        <h2>{t("4. Additional Resources", "4. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a href="https://arxiv.org/abs/1707.06347" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">PPO (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Original paper", "原始论文")}</span>
          </a>
          <a href="https://arxiv.org/abs/2204.05862" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">InstructGPT (Ouyang et al. 2022)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("PPO applied to LLM alignment", "PPO 应用于 LLM 对齐")}</span>
          </a>
        </div>
      </article>
    </div>
  );
}
