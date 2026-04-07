"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function DPOPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "DPO: Direct Preference Optimization",
            "DPO: 直接偏好优化"
          )}
        </h1>
        <p className="text-paper-800/50">
          Rafailov et al. &middot; NeurIPS 2023 &middot;{" "}
          <a href="https://arxiv.org/abs/2305.18290" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            arXiv 2305.18290
          </a>
        </p>
      </header>

      <article className="paper-content">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 leading-relaxed mb-0">
            {t(
              "DPO eliminates the need for a separate reward model in RLHF. By reparameterizing the reward function, it converts the RL problem into a simple classification loss on preference pairs. No PPO, no reward model, no sampling — just supervised learning on (preferred, rejected) pairs.",
              "DPO 消除了 RLHF 中对独立奖励模型的需求。通过重新参数化奖励函数，将 RL 问题转化为偏好对上的简单分类损失。不需要 PPO、不需要奖励模型、不需要采样 — 只需在 (偏好, 拒绝) 对上做监督学习。"
            )}
          </p>
        </section>

        <FlowChart
          title={t("DPO vs Standard RLHF Pipeline", "DPO vs 标准 RLHF 流程")}
          steps={[
            {
              title: t("Standard RLHF: 3-stage pipeline", "标准 RLHF: 三阶段流程"),
              subtitle: t("Complex, unstable, expensive", "复杂、不稳定、昂贵"),
              color: "rose",
              children: [
                { title: t("1. SFT", "1. SFT 监督微调"), color: "gray" },
                { title: t("2. Train Reward Model", "2. 训练奖励模型"), color: "gray" },
                { title: t("3. PPO with RM", "3. 用 RM 做 PPO"), color: "gray" },
              ],
            },
            {
              title: t("DPO Insight: reward model is implicit in the policy!", "DPO 洞察：奖励模型隐含在策略中！"),
              subtitle: t("Closed-form mapping: optimal policy ↔ reward function", "闭式映射：最优策略 ↔ 奖励函数"),
              color: "amber",
            },
            {
              title: t("DPO: 2-stage pipeline", "DPO: 两阶段流程"),
              subtitle: t("Simple, stable, cheap", "简单、稳定、便宜"),
              color: "green",
              children: [
                { title: t("1. SFT", "1. SFT 监督微调"), color: "green" },
                { title: t("2. DPO on preferences", "2. 在偏好数据上做 DPO"), color: "green" },
              ],
            },
          ]}
          arrows={[
            t("Key insight", "关键洞察"),
            t("Simplification", "简化"),
          ]}
          highlights={[
            { text: t("No reward model needed", "不需要奖励模型"), color: "green" },
            { text: t("No RL sampling needed", "不需要 RL 采样"), color: "blue" },
            { text: t("Just supervised learning", "只需监督学习"), color: "purple" },
          ]}
        />

        {/* ============ Background ============ */}
        <h2>{t("1. Background: The RLHF Problem", "1. 背景：RLHF 问题")}</h2>

        <p>
          {t(
            "Standard RLHF optimizes a language model to maximize a learned reward while staying close to the reference (SFT) model:",
            "标准 RLHF 优化语言模型以最大化学习到的奖励，同时保持与参考 (SFT) 模型的接近："
          )}
        </p>

        <Math
          display
          label={t("Standard RLHF objective", "标准 RLHF 目标")}
          tex="\max_{\pi_\theta} \; \mathbb{E}_{x \sim \mathcal{D},\, y \sim \pi_\theta(\cdot|x)} \left[ r_\phi(x, y) \right] - \beta \, D_{\text{KL}}\!\left[\pi_\theta(\cdot|x) \| \pi_{\text{ref}}(\cdot|x)\right]"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-2">
              <Math tex="\pi_\theta" />
              <span>{t("The policy (language model) we're training", "我们正在训练的策略 (语言模型)")}</span>

              <Math tex="\pi_{\text{ref}}" />
              <span>{t("Reference policy — usually the SFT model, prevents the policy from drifting too far", "参考策略 — 通常是 SFT 模型，防止策略偏移太远")}</span>

              <Math tex="r_\phi(x, y)" />
              <span>{t("Learned reward model: scores how good response y is for prompt x", "学习到的奖励模型：评分响应 y 对提示 x 的质量")}</span>

              <Math tex="\beta" />
              <span>{t("KL penalty coefficient — controls how far policy can deviate from reference", "KL 惩罚系数 — 控制策略可以偏离参考多远")}</span>

              <Math tex="D_{\text{KL}}" />
              <span>{t("KL divergence — measures distribution difference between policy and reference", "KL 散度 — 衡量策略与参考之间的分布差异")}</span>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "This requires: (1) training a separate reward model r_φ on human preferences, (2) running PPO with r_φ as the reward signal — which involves sampling from the policy, computing rewards, estimating advantages, and updating. It's complex and unstable.",
            "这需要：(1) 在人类偏好上训练独立的奖励模型 r_φ，(2) 用 r_φ 作为奖励信号运行 PPO — 包括从策略采样、计算奖励、估计优势、更新。复杂且不稳定。"
          )}
        </p>

        {/* ============ Key Derivation ============ */}
        <h2>{t("2. The Key Derivation", "2. 核心推导")}</h2>

        <p>
          {t(
            "DPO's insight: the RLHF objective has a closed-form optimal solution. The optimal policy is:",
            "DPO 的洞察：RLHF 目标有闭式最优解。最优策略为："
          )}
        </p>

        <Math
          display
          label={t("Optimal policy (closed-form solution to RLHF)", "最优策略 (RLHF 的闭式解)")}
          tex="\pi^*(y \mid x) = \frac{1}{Z(x)} \pi_{\text{ref}}(y \mid x) \exp\!\left(\frac{1}{\beta} r(x, y)\right)"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-2">
              <Math tex="\pi^*" />
              <span>{t("Optimal policy — the solution to the RLHF objective", "最优策略 — RLHF 目标的解")}</span>

              <Math tex="Z(x)" />
              <span>{t("Partition function (normalizer) — ensures probabilities sum to 1", "配分函数 (归一化因子) — 确保概率和为 1")}</span>

              <Math tex="\exp(r/\\beta)" />
              <span>{t("Responses with higher reward get exponentially more probability mass", "奖励更高的响应获得指数级更多的概率质量")}</span>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "Now rearrange to express reward in terms of policy:",
            "现在重新排列，用策略来表达奖励："
          )}
        </p>

        <Math
          display
          label={t("Reward as function of policy (the key reparameterization)", "奖励作为策略的函数 (关键重参数化)")}
          tex="r(x, y) = \beta \log \frac{\pi_\theta(y \mid x)}{\pi_{\text{ref}}(y \mid x)} + \beta \log Z(x)"
        />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Key insight", "关键洞察")}</strong>: {t(
              "The reward is just the log-ratio of policy to reference, scaled by β! We don't NEED a separate reward model — the policy itself implicitly defines one.",
              "奖励就是策略与参考的对数比，乘以 β！我们不需要独立的奖励模型 — 策略本身隐式地定义了一个。"
            )}
          </p>
        </div>

        {/* ============ DPO Loss ============ */}
        <h2>{t("3. The DPO Loss Function", "3. DPO 损失函数")}</h2>

        <p>
          {t(
            "Substituting the implicit reward into the Bradley-Terry preference model gives the DPO loss:",
            "将隐式奖励代入 Bradley-Terry 偏好模型得到 DPO 损失："
          )}
        </p>

        <Math
          display
          label={t("DPO loss function", "DPO 损失函数")}
          tex="\mathcal{L}_{\text{DPO}}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma\!\left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} \right) \right]"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[180px_1fr] gap-y-3 gap-x-2">
              <Math tex="(x, y_w, y_l)" />
              <span>{t("A preference triple: prompt x, preferred response y_w (winner), rejected response y_l (loser)", "偏好三元组：提示 x，偏好响应 y_w (胜者)，拒绝响应 y_l (败者)")}</span>

              <Math tex="\sigma(\cdot)" />
              <span>{t("Sigmoid function — turns log-odds into probability", "Sigmoid 函数 — 将对数几率转化为概率")}</span>

              <Math tex="\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)}" />
              <span>{t("Log-ratio for preferred response: how much has the policy upweighted y_w relative to reference?", "偏好响应的对数比：策略相对于参考上调了 y_w 多少？")}</span>

              <Math tex="\beta" />
              <span>{t("Temperature: larger β → policy changes more aggressively", "温度：β 越大 → 策略变化越激进")}</span>
            </div>
            <p className="p-3 bg-blue-50 rounded border border-blue-200 mt-3">
              <strong>{t("Intuition", "直觉")}</strong>: {t(
                "The loss encourages the model to increase the probability of y_w and decrease the probability of y_l, relative to the reference model. It's essentially binary classification: \"which response is better?\"",
                "损失鼓励模型相对于参考模型增加 y_w 的概率并降低 y_l 的概率。本质上是二元分类：「哪个响应更好？」"
              )}
            </p>
          </div>
        </Collapsible>

        <Collapsible title={t("Concrete example: Computing DPO loss", "具体例子：计算 DPO 损失")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>{t("Prompt: \"Explain gravity.\"", "提示：\"解释引力。\"")}</p>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <div className="font-sans text-xs text-green-800 mb-1"><strong>{t("Preferred (y_w)", "偏好 (y_w)")}</strong>: {t("\"Gravity is the force that attracts objects with mass toward each other...\"", "\」引力是使有质量的物体相互吸引的力...\"")}</div>
                <div><Math tex="\log \pi_\theta(y_w|x) = -12.3" />, <Math tex="\log \pi_{\text{ref}}(y_w|x) = -14.1" /></div>
                <div>{t("Log-ratio", "对数比")} = -12.3 - (-14.1) = <strong>+1.8</strong> ({t("policy likes it MORE than ref", "策略比参考更喜欢它")})</div>
              </div>
              <div className="p-2 bg-red-50 rounded border border-red-200">
                <div className="font-sans text-xs text-red-800 mb-1"><strong>{t("Rejected (y_l)", "拒绝 (y_l)")}</strong>: {t("\"Gravity is when things fall down.\"", "\」引力就是东西往下掉。\"")}</div>
                <div><Math tex="\log \pi_\theta(y_l|x) = -8.5" />, <Math tex="\log \pi_{\text{ref}}(y_l|x) = -7.2" /></div>
                <div>{t("Log-ratio", "对数比")} = -8.5 - (-7.2) = <strong>-1.3</strong> ({t("policy likes it LESS than ref", "策略比参考更不喜欢它")})</div>
              </div>
              <div className="p-2 bg-paper-100 rounded">
                <div>{t("With β=0.1:", "β=0.1 时:")}</div>
                <div><Math tex="\sigma(0.1 \times (1.8 - (-1.3))) = \sigma(0.31) = 0.577" /></div>
                <div>{t("Loss", "损失")} = <Math tex="-\log(0.577) = 0.549" /></div>
                <div className="text-paper-800/50 mt-1">{t("Gradient will push to increase this gap further — make y_w even more likely, y_l even less likely.", "梯度会推动进一步增大这个差距 — 让 y_w 更可能，y_l 更不可能。")}</div>
              </div>
            </div>
          </div>
        </Collapsible>

        {/* ============ Results ============ */}
        <h2>{t("4. Results & Impact", "4. 结果与影响")}</h2>

        <ul>
          <li>{t("Matches or exceeds PPO-based RLHF on summarization and dialogue tasks", "在摘要和对话任务上匹配或超过基于 PPO 的 RLHF")}</li>
          <li>{t("Much simpler to implement (~50 lines of core code)", "实现简单得多 (核心代码约 50 行)")}</li>
          <li>{t("More stable training — no reward hacking, no sampling instabilities", "训练更稳定 — 没有奖励黑客，没有采样不稳定性")}</li>
          <li>{t("Became the default alignment method for many open-source LLMs", "成为许多开源 LLM 的默认对齐方法")}</li>
        </ul>

        {/* ============ Limitations ============ */}
        <h2>{t("5. Limitations & Future Work", "5. 局限性与未来工作")}</h2>
        <ul>
          <li><strong>{t("Offline only", "仅离线")}</strong>: {t("DPO uses fixed preference data — can't explore like online RL (PPO)", "DPO 使用固定偏好数据 — 不能像在线 RL (PPO) 那样探索")}</li>
          <li><strong>{t("Reference model dependency", "参考模型依赖")}</strong>: {t("Quality depends on having a good reference model", "质量取决于有一个好的参考模型")}</li>
          <li><strong>{t("No reward shaping", "无奖励塑造")}</strong>: {t("Can't add auxiliary rewards for specific behaviors (safety, factuality)", "无法为特定行为 (安全性、事实性) 添加辅助奖励")}</li>
        </ul>

        {/* ============ Connections ============ */}
        <h2>{t("6. Connections to Other Work", "6. 与其他工作的联系")}</h2>

        <div className="space-y-3 my-4">
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`${basePath}/papers/ppo`} className="font-semibold text-blue-600 hover:underline">PPO</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t("The RL algorithm DPO replaces. PPO is more flexible but harder to tune.", "DPO 替代的 RL 算法。PPO 更灵活但更难调优。")}
            </p>
          </div>
          <div className="p-4 bg-white border border-paper-200 rounded-lg">
            <Link href={`${basePath}/papers/grpo`} className="font-semibold text-blue-600 hover:underline">GRPO</Link>
            <p className="text-sm text-paper-800/70 mt-1">
              {t("DeepSeek's PPO variant that uses group-relative advantages instead of a value network — a middle ground between PPO's flexibility and DPO's simplicity.", "DeepSeek 的 PPO 变体，使用组相对优势代替价值网络 — 介于 PPO 的灵活性和 DPO 的简单性之间。")}
            </p>
          </div>
        </div>

        <h2>{t("7. Additional Resources", "7. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a href="https://arxiv.org/abs/2305.18290" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">DPO (arXiv)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("Original paper", "原始论文")}</span>
          </a>
          <a href="https://arxiv.org/abs/2204.05862" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white border border-paper-200 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-sm font-medium">InstructGPT (Ouyang et al. 2022)</span>
            <span className="text-xs text-paper-800/50 ml-2">{t("The original RLHF paper that DPO improves upon", "DPO 改进的原始 RLHF 论文")}</span>
          </a>
        </div>
      </article>
    </div>
  );
}
