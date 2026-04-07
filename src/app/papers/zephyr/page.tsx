"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function ZephyrPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Zephyr: Direct Distillation of LM Alignment",
            "Zephyr：语言模型对齐的直接蒸馏"
          )}
        </h1>
        <p className="text-paper-800/50">
          Tunstall et al. &middot; HuggingFace &middot; 2023 &middot;{" "}
          <a
            href="https://arxiv.org/abs/2310.16944"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 2310.16944
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed mb-0">
            {t(
              "Zephyr aligns a 7B model (Mistral-7B) to ChatGPT-level helpfulness using only GPT-4-generated data — no PPO, no human labelers, no reward model. Two steps: (1) distilled SFT on GPT-4 conversations, (2) distilled DPO on GPT-4-ranked preference pairs. Zephyr-7B-β scores 90.60 on MT-Bench, beating Llama-2-Chat-70B despite being 10× smaller.",
              "Zephyr 仅使用 GPT-4 生成的数据，将 7B 模型 (Mistral-7B) 对齐到 ChatGPT 级别的有用性 —— 无需 PPO、无需人工标注、无需奖励模型。两个步骤：(1) 在 GPT-4 对话上做蒸馏 SFT，(2) 在 GPT-4 排名的偏好对上做蒸馏 DPO。Zephyr-7B-β 在 MT-Bench 上得分 90.60，以 1/10 的参数量击败 Llama-2-Chat-70B。"
            )}
          </p>
        </section>

        {/* Pipeline FlowChart */}
        <FlowChart
          title={t("Zephyr Two-Step Distillation Pipeline", "Zephyr 两步蒸馏流程")}
          steps={[
            {
              title: t("GPT-4 Teacher", "GPT-4 教师模型"),
              subtitle: t("Generates conversations & ranks responses", "生成对话并对响应排名"),
              color: "purple",
            },
            {
              title: t("Step 1: dSFT — Distilled Supervised Fine-Tuning", "第一步：dSFT — 蒸馏监督微调"),
              subtitle: t("Fine-tune Mistral-7B on UltraChat 200k (GPT-4 conversations)", "在 UltraChat 200k（GPT-4 对话）上微调 Mistral-7B"),
              color: "amber",
            },
            {
              title: t("Step 2: dDPO — Distilled DPO", "第二步：dDPO — 蒸馏 DPO"),
              subtitle: t("Preference learning on UltraFeedback (GPT-4 scores 4 responses, best vs. worst)", "在 UltraFeedback 上做偏好学习（GPT-4 对 4 个响应评分，最好 vs 最差）"),
              color: "green",
            },
            {
              title: t("Zephyr-7B-β", "Zephyr-7B-β"),
              subtitle: t("MT-Bench 90.60 · AlpacaEval 90.6% win rate", "MT-Bench 90.60 · AlpacaEval 胜率 90.6%"),
              color: "blue",
            },
          ]}
          arrows={[
            t("UltraChat 200k", "UltraChat 200k"),
            t("UltraFeedback", "UltraFeedback"),
            t("Final model", "最终模型"),
          ]}
          highlights={[
            { text: t("No PPO needed", "不需要 PPO"), color: "green" },
            { text: t("No reward model", "不需要奖励模型"), color: "blue" },
            { text: t("No human labelers", "不需要人工标注"), color: "purple" },
          ]}
        />

        {/* ============ Section 1: The Alignment Tax ============ */}
        <h2>{t("1. The Alignment Tax", "1. 对齐代价")}</h2>

        <p>
          {t(
            "Aligning large language models to be helpful, harmless, and honest has traditionally required a three-stage pipeline: supervised fine-tuning (SFT), reward model training on human preference data, and reinforcement learning via PPO. This pipeline is expensive, brittle, and requires massive infrastructure.",
            "将大型语言模型对齐为有用、无害和诚实，传统上需要三阶段流水线：监督微调 (SFT)、在人类偏好数据上训练奖励模型，以及通过 PPO 进行强化学习。这套流水线成本高昂、脆弱，且需要大量基础设施。"
          )}
        </p>

        <p>
          {t(
            "For small labs and open-source practitioners, replicating ChatGPT-level alignment is nearly impossible: you need thousands of high-quality human preference labels, a stable PPO implementation, and significant compute for reward model training. Zephyr's key insight is that GPT-4 can replace all of this.",
            "对于小型实验室和开源从业者来说，复制 ChatGPT 级别的对齐几乎是不可能的：你需要数千个高质量的人类偏好标签、稳定的 PPO 实现，以及大量用于奖励模型训练的算力。Zephyr 的核心洞察是：GPT-4 可以取代这一切。"
          )}
        </p>

        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Core idea", "核心思想")}</strong>:{" "}
            {t(
              "Use GPT-4 as both a teacher (generating high-quality conversations) and a judge (ranking model outputs). Distill this \"alignment signal\" into a 7B model using SFT followed by DPO — no RL, no reward model, no PPO.",
              "使用 GPT-4 既作为教师（生成高质量对话），又作为评委（排名模型输出）。通过 SFT 加 DPO 将这一「对齐信号」蒸馏到 7B 模型中 —— 无需 RL、无需奖励模型、无需 PPO。"
            )}
          </p>
        </div>

        {/* ============ Section 2: dSFT ============ */}
        <h2>{t("2. dSFT: Learning From GPT-4 Conversations", "2. dSFT：从 GPT-4 对话中学习")}</h2>

        <p>
          {t(
            "The first stage is distilled Supervised Fine-Tuning (dSFT). The model is fine-tuned on UltraChat 200k — a dataset of 200,000 multi-turn conversations generated by GPT-3.5/GPT-4 covering a wide range of topics: world knowledge, creative writing, coding, reasoning, and more.",
            "第一阶段是蒸馏监督微调 (dSFT)。模型在 UltraChat 200k 上微调 —— 这是一个包含 200,000 条多轮对话的数据集，由 GPT-3.5/GPT-4 生成，涵盖世界知识、创意写作、编程、推理等广泛话题。"
          )}
        </p>

        <p>
          {t(
            "The SFT objective is standard next-token prediction over the assistant turns only — the model learns to predict GPT-4's responses given the conversation context:",
            "SFT 目标是仅在助手轮次上进行标准的下一个 token 预测 —— 模型学习在给定对话上下文的情况下预测 GPT-4 的响应："
          )}
        </p>

        <Math
          display
          label={t("SFT loss (next-token prediction on assistant turns)", "SFT 损失（对助手轮次的下一个 token 预测）")}
          tex="\mathcal{L}_{\text{SFT}} = -\sum_{t=1}^{T} \log \pi_\theta(y_t \mid x,\, y_{<t})"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-2">
              <Math tex="\pi_\theta" />
              <span>{t("The student model being trained (Mistral-7B)", "正在训练的学生模型 (Mistral-7B)")}</span>

              <Math tex="x" />
              <span>{t("The conversation context: system prompt + user turns", "对话上下文：系统提示 + 用户轮次")}</span>

              <Math tex="y_t" />
              <span>{t("The t-th token of the GPT-4-generated assistant response", "GPT-4 生成的助手响应的第 t 个 token")}</span>

              <Math tex="y_{<t}" />
              <span>{t("All previously generated assistant tokens", "之前所有生成的助手 token")}</span>
            </div>
            <p className="p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800 mt-3">
              <strong>{t("Why only assistant turns?", "为什么只在助手轮次上？")}</strong>{" "}
              {t(
                "We mask out the user turns and system prompt during loss computation. The model only needs to learn how to respond — not how to formulate questions. This is the standard SFT protocol for chat models.",
                "在损失计算过程中，我们屏蔽用户轮次和系统提示。模型只需要学习如何响应 —— 而不是如何提出问题。这是聊天模型的标准 SFT 协议。"
              )}
            </p>
          </div>
        </Collapsible>

        <p>
          {t(
            "The result is a model that can follow instructions and produce coherent, helpful responses. But it doesn't yet know how to rank between good and bad answers — that's what dDPO adds.",
            "结果是一个能够遵循指令并产生连贯、有用响应的模型。但它还不知道如何在好答案和坏答案之间进行排名 —— 这正是 dDPO 添加的内容。"
          )}
        </p>

        {/* ============ Section 3: UltraFeedback ============ */}
        <h2>{t("3. UltraFeedback Dataset", "3. UltraFeedback 数据集")}</h2>

        <p>
          {t(
            "UltraFeedback is a large-scale preference dataset where GPT-4 evaluates multiple model outputs for the same prompt. For each instruction, four different models generate responses. GPT-4 then rates each response on a 1–5 scale across dimensions like instruction-following, honesty, and truthfulness.",
            "UltraFeedback 是一个大规模偏好数据集，GPT-4 对同一提示的多个模型输出进行评估。对于每条指令，四个不同的模型生成响应。然后 GPT-4 在指令遵循、诚实性和真实性等维度上对每个响应进行 1–5 分评级。"
          )}
        </p>

        <div className="space-y-3 my-6">
          <div className="p-4 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg">
            <div className="font-semibold text-sm mb-1">{t("Dataset construction", "数据集构建")}</div>
            <ol className="text-sm space-y-2 list-decimal list-inside text-paper-800/80 dark:text-paper-200/80">
              <li>{t("Sample a diverse instruction from curated sources (ShareGPT, FLAN, etc.)", "从精选来源 (ShareGPT、FLAN 等) 采样多样化的指令")}</li>
              <li>{t("Generate 4 responses using different models (GPT-4, Claude, LLaMA, etc.)", "使用不同模型 (GPT-4、Claude、LLaMA 等) 生成 4 个响应")}</li>
              <li>{t("Ask GPT-4 to rate each response (score 1–5) and provide a rationale", "要求 GPT-4 对每个响应评分 (1–5 分) 并提供理由")}</li>
              <li>{t("Construct preference pairs: highest-rated response = y_w, lowest-rated = y_l", "构建偏好对：评分最高的响应 = y_w，评分最低的 = y_l")}</li>
            </ol>
          </div>
        </div>

        <p>
          {t(
            "This dataset contains ~64,000 preference triples (x, y_w, y_l). Crucially, no human labelers are involved — GPT-4 serves as the sole annotator. This makes the entire pipeline scalable and reproducible.",
            "该数据集包含约 64,000 个偏好三元组 (x, y_w, y_l)。关键的是，不涉及人工标注者 —— GPT-4 作为唯一的标注者。这使得整个流程可扩展且可复现。"
          )}
        </p>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
          <p className="text-sm mb-0">
            <strong>{t("AI Feedback vs. Human Feedback", "AI 反馈 vs 人类反馈")}</strong>:{" "}
            {t(
              "Traditional RLHF uses human annotators to rank responses — slow, expensive, and inconsistent. UltraFeedback replaces humans with GPT-4 (\"AI Feedback\"), which is fast, cheap, and surprisingly aligned with human judgments at scale.",
              "传统 RLHF 使用人工标注者对响应排名 —— 缓慢、昂贵且不一致。UltraFeedback 用 GPT-4（「AI 反馈」）取代人类，速度快、成本低，且在大规模上与人类判断出奇地一致。"
            )}
          </p>
        </div>

        {/* ============ Section 4: dDPO ============ */}
        <h2>{t("4. dDPO: Preference Learning Without a Reward Model", "4. dDPO：无需奖励模型的偏好学习")}</h2>

        <p>
          {t(
            "The second stage is distilled DPO (dDPO). Starting from the dSFT model as both the policy and reference, the model is fine-tuned on UltraFeedback preference pairs using the DPO loss. No reward model is trained. No PPO rollouts happen. The preference signal comes directly from GPT-4's ratings.",
            "第二阶段是蒸馏 DPO (dDPO)。以 dSFT 模型作为策略和参考，使用 DPO 损失在 UltraFeedback 偏好对上微调模型。不需要训练奖励模型，不需要 PPO rollout。偏好信号直接来自 GPT-4 的评分。"
          )}
        </p>

        <p>
          {t(
            "The key insight from the DPO paper (Rafailov et al., 2023): you don't need an explicit reward model at all. The optimal policy under the KL-constrained RLHF objective implicitly defines a reward function. By reparameterizing this reward in terms of the policy ratio, DPO converts preference learning into a simple binary classification problem.",
            "DPO 论文 (Rafailov et al., 2023) 的核心洞察：根本不需要显式的奖励模型。KL 约束 RLHF 目标下的最优策略隐式地定义了一个奖励函数。通过用策略比率重新参数化这个奖励，DPO 将偏好学习转化为一个简单的二元分类问题。"
          )}
        </p>

        <p>
          {t(
            "The implicit reward that DPO recovers is:",
            "DPO 恢复的隐式奖励为："
          )}
        </p>

        <Math
          display
          label={t("Implicit reward (emerges from the optimal policy)", "隐式奖励（从最优策略中涌现）")}
          tex="r^*(x, y) = \beta \log \frac{\pi^*(y \mid x)}{\pi_{\text{ref}}(y \mid x)} + \beta \log Z(x)"
        />

        <Collapsible title={t("What does this mean intuitively?", "直观上这意味着什么？")} defaultOpen>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "The implicit reward is just the log-ratio between the optimal policy and the reference policy, scaled by β. This tells us: a response y has high reward if the aligned model assigns it much higher probability than the base model.",
                "隐式奖励就是最优策略与参考策略之间的对数比，乘以 β。这告诉我们：如果对齐模型对响应 y 的概率远高于基础模型，则 y 具有高奖励。"
              )}
            </p>
            <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-2">
              <Math tex="\pi^*(y \mid x)" />
              <span>{t("Optimal aligned policy — what we're training toward", "最优对齐策略 —— 我们正在训练的目标")}</span>

              <Math tex="\pi_{\text{ref}}(y \mid x)" />
              <span>{t("Reference policy — the dSFT model, frozen during DPO", "参考策略 —— dSFT 模型，在 DPO 期间冻结")}</span>

              <Math tex="Z(x)" />
              <span>{t("Partition function — a constant per prompt that cancels in the preference model", "配分函数 —— 每个提示的常数，在偏好模型中消掉")}</span>

              <Math tex="\beta" />
              <span>{t("Controls how far the policy can deviate from the reference (KL penalty strength)", "控制策略可以偏离参考多远 (KL 惩罚强度)")}</span>
            </div>
          </div>
        </Collapsible>

        {/* ============ Section 5: DPO Loss Derivation ============ */}
        <h2>{t("5. DPO Loss Derivation", "5. DPO 损失推导")}</h2>

        <p>
          {t(
            "Plugging the implicit reward into the Bradley-Terry preference model (which says the probability that y_w is preferred over y_l is σ(r(y_w) − r(y_l))) gives the DPO loss:",
            "将隐式奖励代入 Bradley-Terry 偏好模型（该模型指出 y_w 优于 y_l 的概率为 σ(r(y_w) − r(y_l))），得到 DPO 损失："
          )}
        </p>

        <Math
          display
          label={t("DPO loss (full form)", "DPO 损失（完整形式）")}
          tex="\mathcal{L}_{\text{DPO}}(\pi_\theta;\pi_{\text{ref}}) = -\mathbb{E}_{(x,\,y_w,\,y_l)\sim\mathcal{D}}\!\left[\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]"
        />

        <Collapsible title={t("Variable-by-variable breakdown", "逐变量拆解")} defaultOpen>
          <div className="text-sm space-y-2">
            <div className="grid grid-cols-[200px_1fr] gap-y-3 gap-x-2">
              <Math tex="(x, y_w, y_l) \sim \mathcal{D}" />
              <span>{t("A sampled preference triple from UltraFeedback: prompt, winner, loser", "从 UltraFeedback 采样的偏好三元组：提示、胜者、败者")}</span>

              <Math tex="\sigma(\cdot)" />
              <span>{t("Sigmoid — maps the score difference to a probability in (0, 1)", "Sigmoid —— 将分数差映射到 (0, 1) 中的概率")}</span>

              <Math tex="\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)}" />
              <span>{t("Scaled implicit reward for the winning response — positive when policy prefers y_w more than reference does", "胜者响应的缩放隐式奖励 —— 当策略比参考更偏好 y_w 时为正")}</span>

              <Math tex="\beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}" />
              <span>{t("Scaled implicit reward for the losing response — subtracted to push the model away from y_l", "败者响应的缩放隐式奖励 —— 减去以推动模型远离 y_l")}</span>
            </div>
          </div>
        </Collapsible>

        <Collapsible title={t("Step-by-step derivation", "逐步推导")} defaultOpen={false}>
          <div className="text-sm space-y-4">
            <div>
              <p className="font-semibold mb-1">{t("Step 1: RLHF objective", "第一步：RLHF 目标")}</p>
              <Math
                display
                tex="\max_{\pi_\theta}\; \mathbb{E}_{x \sim \mathcal{D},\, y \sim \pi_\theta}\!\left[r(x,y)\right] - \beta\, D_{\text{KL}}\!\left[\pi_\theta(\cdot|x) \| \pi_{\text{ref}}(\cdot|x)\right]"
              />
              <p>{t("The standard RLHF objective: maximize reward while staying close to the reference policy.", "标准 RLHF 目标：最大化奖励同时保持接近参考策略。")}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">{t("Step 2: Closed-form optimal policy", "第二步：闭式最优策略")}</p>
              <Math
                display
                tex="\pi^*(y \mid x) = \frac{1}{Z(x)}\, \pi_{\text{ref}}(y \mid x)\, \exp\!\left(\frac{r(x,y)}{\beta}\right)"
              />
              <p>{t("The KL-constrained objective has this closed-form solution (a Boltzmann distribution over the reference).", "KL 约束目标有这个闭式解（参考上的玻尔兹曼分布）。")}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">{t("Step 3: Reparameterize reward in terms of policy", "第三步：用策略重新参数化奖励")}</p>
              <Math
                display
                tex="r(x,y) = \beta \log \frac{\pi^*(y|x)}{\pi_{\text{ref}}(y|x)} + \beta \log Z(x)"
              />
              <p>{t("Inverting Step 2: reward is a function of the log policy ratio. Z(x) depends only on x, not y.", "反转第二步：奖励是对数策略比的函数。Z(x) 只依赖于 x，而非 y。")}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">{t("Step 4: Bradley-Terry preference model", "第四步：Bradley-Terry 偏好模型")}</p>
              <Math
                display
                tex="p(y_w \succ y_l \mid x) = \sigma\!\left(r(x, y_w) - r(x, y_l)\right)"
              />
              <p>{t("Z(x) cancels in the difference r(y_w) − r(y_l), leaving only the log policy ratios.", "Z(x) 在差值 r(y_w) − r(y_l) 中消掉，只剩下对数策略比。")}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">{t("Step 5: Maximize log-likelihood → DPO loss", "第五步：最大化对数似然 → DPO 损失")}</p>
              <Math
                display
                tex="\mathcal{L}_{\text{DPO}} = -\mathbb{E}\!\left[\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]"
              />
              <p>{t("Minimizing this loss is equivalent to maximizing the log-likelihood of the observed preference data under the Bradley-Terry model.", "最小化这个损失等价于在 Bradley-Terry 模型下最大化观测偏好数据的对数似然。")}</p>
            </div>
          </div>
        </Collapsible>

        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-6">
          <p className="text-sm mb-1">
            <strong>{t("Why no reward model is needed", "为什么不需要奖励模型")}</strong>
          </p>
          <p className="text-sm mb-0">
            {t(
              "The DPO loss only requires computing log-probabilities under π_θ and π_ref — both are just forward passes through the language model. No separate reward network, no PPO rollouts, no advantage estimation. The entire training loop is as simple as cross-entropy classification.",
              "DPO 损失只需要计算 π_θ 和 π_ref 下的对数概率 —— 两者都只是语言模型的前向传播。不需要独立的奖励网络、不需要 PPO rollout、不需要优势估计。整个训练循环就像交叉熵分类一样简单。"
            )}
          </p>
        </div>

        {/* ============ Section 6: Results ============ */}
        <h2>{t("6. Results", "6. 实验结果")}</h2>

        <p>
          {t(
            "Zephyr-7B-β is evaluated on MT-Bench (a multi-turn benchmark judged by GPT-4) and AlpacaEval (single-turn win rate against text-davinci-003). The results are striking:",
            "Zephyr-7B-β 在 MT-Bench（由 GPT-4 评判的多轮基准）和 AlpacaEval（与 text-davinci-003 的单轮胜率）上进行评估。结果令人瞩目："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="text-left p-3 border border-paper-200 dark:border-paper-700 font-semibold">{t("Model", "模型")}</th>
                <th className="text-right p-3 border border-paper-200 dark:border-paper-700 font-semibold">{t("Params", "参数量")}</th>
                <th className="text-right p-3 border border-paper-200 dark:border-paper-700 font-semibold">MT-Bench</th>
                <th className="text-right p-3 border border-paper-200 dark:border-paper-700 font-semibold">AlpacaEval</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-green-50 dark:bg-green-950">
                <td className="p-3 border border-paper-200 dark:border-paper-700 font-semibold">Zephyr-7B-β</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">7B</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700 font-semibold text-green-700 dark:text-green-400">90.60</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700 font-semibold text-green-700 dark:text-green-400">90.6%</td>
              </tr>
              <tr>
                <td className="p-3 border border-paper-200 dark:border-paper-700">Llama-2-Chat</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">70B</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">6.27</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">92.7%</td>
              </tr>
              <tr>
                <td className="p-3 border border-paper-200 dark:border-paper-700">Llama-2-Chat</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">13B</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">6.65</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">81.1%</td>
              </tr>
              <tr>
                <td className="p-3 border border-paper-200 dark:border-paper-700">Falcon-Instruct</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">40B</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">5.17</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">45.7%</td>
              </tr>
              <tr>
                <td className="p-3 border border-paper-200 dark:border-paper-700">GPT-3.5-turbo</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">—</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">7.94</td>
                <td className="text-right p-3 border border-paper-200 dark:border-paper-700">89.4%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul>
          <li>
            {t(
              "Zephyr-7B-β scores 90.60 on MT-Bench — beating Llama-2-Chat-70B (a model 10× larger) at 6.27",
              "Zephyr-7B-β 在 MT-Bench 上得分 90.60 —— 击败了参数量大 10 倍的 Llama-2-Chat-70B（得分 6.27）"
            )}
          </li>
          <li>
            {t(
              "AlpacaEval win rate of 90.6% against text-davinci-003, competitive with much larger models",
              "AlpacaEval 对 text-davinci-003 的胜率为 90.6%，与更大的模型具有竞争力"
            )}
          </li>
          <li>
            {t(
              "dSFT alone (without dDPO) significantly underperforms — the preference learning stage is critical",
              "单独使用 dSFT（没有 dDPO）表现明显不足 —— 偏好学习阶段至关重要"
            )}
          </li>
          <li>
            {t(
              "The gap between dSFT and dDPO is larger than the gap between different SFT datasets, suggesting the alignment method matters more than the SFT data",
              "dSFT 和 dDPO 之间的差距大于不同 SFT 数据集之间的差距，表明对齐方法比 SFT 数据更重要"
            )}
          </li>
        </ul>

        {/* ============ Section 7: Implications ============ */}
        <h2>{t("7. Implications for Open-Source Alignment", "7. 对开源对齐的启示")}</h2>

        <p>
          {t(
            "Zephyr demonstrates that the gap between open-source and proprietary models is largely a data and alignment gap, not a capability gap. The Mistral-7B base model already has strong reasoning abilities — what it lacked was exposure to high-quality aligned conversations and preference training.",
            "Zephyr 表明，开源模型和专有模型之间的差距主要是数据和对齐差距，而非能力差距。Mistral-7B 基础模型已经具有强大的推理能力 —— 它所缺乏的是接触高质量对齐对话和偏好训练。"
          )}
        </p>

        <p>
          {t(
            "Several implications follow for the community:",
            "这对社区有以下几点启示："
          )}
        </p>

        <ul>
          <li>
            <strong>{t("AI Feedback scales", "AI 反馈可扩展")}</strong>:{" "}
            {t(
              "GPT-4 as a judge is surprisingly effective and eliminates the bottleneck of human annotation. Later work (RLAIF, Constitutional AI) confirms this direction.",
              "GPT-4 作为评委出奇地有效，消除了人工标注的瓶颈。后续工作 (RLAIF、Constitutional AI) 证实了这一方向。"
            )}
          </li>
          <li>
            <strong>{t("DPO over PPO for small teams", "小团队应优先选择 DPO")}</strong>:{" "}
            {t(
              "DPO is far easier to implement and tune than PPO, making high-quality alignment accessible without massive RL infrastructure.",
              "DPO 比 PPO 更容易实现和调整，使得无需大量 RL 基础设施就能实现高质量对齐。"
            )}
          </li>
          <li>
            <strong>{t("Scale is not everything", "规模并非一切")}</strong>:{" "}
            {t(
              "A well-aligned 7B model can outperform poorly-aligned 70B models. Alignment quality matters as much as raw parameter count.",
              "一个良好对齐的 7B 模型可以超越对齐不佳的 70B 模型。对齐质量与原始参数数量同等重要。"
            )}
          </li>
          <li>
            <strong>{t("Dataset curation is a competitive moat", "数据集整理是竞争护城河")}</strong>:{" "}
            {t(
              "UltraChat and UltraFeedback were pivotal to Zephyr's success. High-quality curated data often matters more than model architecture.",
              "UltraChat 和 UltraFeedback 对 Zephyr 的成功至关重要。高质量的精选数据往往比模型架构更重要。"
            )}
          </li>
        </ul>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-6">
          <p className="text-sm mb-0">
            <strong>{t("Historical significance", "历史意义")}</strong>:{" "}
            {t(
              "Zephyr was one of the first public demonstrations that open-source 7B models could reach GPT-3.5-level helpfulness purely through distillation-based alignment. It catalyzed an explosion of DPO-trained models and AI-feedback datasets in the open-source community throughout 2023–2024.",
              "Zephyr 是最早公开证明开源 7B 模型可以纯粹通过蒸馏对齐达到 GPT-3.5 级别有用性的工作之一。它在 2023–2024 年推动了开源社区 DPO 训练模型和 AI 反馈数据集的爆发式增长。"
            )}
          </p>
        </div>

        {/* ============ Additional Resources ============ */}
        <h2>{t("8. Additional Resources", "8. 补充资源")}</h2>
        <div className="space-y-2 my-4">
          <a
            href="https://arxiv.org/abs/2310.16944"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">Zephyr (arXiv 2310.16944)</span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">
              {t("Original paper by Tunstall et al.", "Tunstall 等人的原始论文")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/2305.18290"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">DPO: Direct Preference Optimization (arXiv 2305.18290)</span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">
              {t("The DPO paper that Zephyr builds on", "Zephyr 所基于的 DPO 论文")}
            </span>
          </a>
          <a
            href="https://huggingface.co/datasets/HuggingFaceH4/ultrafeedback_binarized"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">UltraFeedback (HuggingFace)</span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">
              {t("The preference dataset used for dDPO", "用于 dDPO 的偏好数据集")}
            </span>
          </a>
          <a
            href="https://huggingface.co/datasets/HuggingFaceH4/ultrachat_200k"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">UltraChat 200k (HuggingFace)</span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">
              {t("The SFT dataset used for dSFT", "用于 dSFT 的 SFT 数据集")}
            </span>
          </a>
        </div>

        <div className="space-y-2 my-4">
          <div className="p-4 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg">
            <Link href={`/papers/dpo`} className="font-semibold text-blue-600 hover:underline">
              {t("DPO Deep Dive", "DPO 深度解析")}
            </Link>
            <p className="text-sm text-paper-800/70 dark:text-paper-200/70 mt-1">
              {t(
                "Full derivation of the DPO loss — how the RLHF objective reduces to a simple classification loss without a reward model.",
                "DPO 损失的完整推导 —— RLHF 目标如何在没有奖励模型的情况下简化为简单的分类损失。"
              )}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg">
            <Link href={`/papers/ppo`} className="font-semibold text-blue-600 hover:underline">
              {t("PPO Deep Dive", "PPO 深度解析")}
            </Link>
            <p className="text-sm text-paper-800/70 dark:text-paper-200/70 mt-1">
              {t(
                "The RL algorithm that Zephyr avoids. Understanding PPO makes it clearer why dDPO is such an improvement for open-source alignment.",
                "Zephyr 所避免的 RL 算法。理解 PPO 能让你更清楚地看到 dDPO 为何是开源对齐的重大改进。"
              )}
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-paper-200 dark:border-paper-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; {t("Back to Papers", "返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
