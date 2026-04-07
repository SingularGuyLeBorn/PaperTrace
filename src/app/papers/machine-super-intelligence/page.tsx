"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function MachineSuperIntelligencePage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-gray-100">
          {t("Machine Super Intelligence", "机器超级智能")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Shane Legg &middot; Doctoral Dissertation &middot; 2008 &middot;{" "}
          <a
            href="https://www.vetta.org/documents/Machine_Super_Intelligence.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            vetta.org PDF
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10 dark:bg-blue-950/40 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "Shane Legg's 2008 dissertation formalizes intelligence as a single number: the weighted average performance of an agent across all computable environments, where simpler environments count more. This Legg-Hutter universal intelligence measure unifies every prior definition of intelligence under one equation. The dissertation then uses this framework to reason rigorously about superintelligence — how to get there, how fast it could happen, and why alignment is the hardest problem humanity will ever face.",
              "Shane Legg 的 2008 年博士论文将智能形式化为一个数字：智能体在所有可计算环境中的加权平均表现，其中越简单的环境权重越大。这个 Legg-Hutter 通用智能度量将所有先前的智能定义统一在一个方程下。论文随后用这个框架严格推理超级智能——如何实现它、速度有多快，以及为什么对齐是人类将面临的最难问题。"
            )}
          </p>
        </section>

        {/* ============ SECTION 1: What Is Intelligence? ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("1. What Is Intelligence?", "1. 什么是智能？")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Before Legg and Hutter, there were dozens of competing definitions of intelligence: IQ tests, Turing tests, task-specific benchmarks, behavioral criteria, and more. None of them agreed. The fundamental question was never resolved: what is intelligence, formally?",
              "在 Legg 和 Hutter 之前，存在数十种相互竞争的智能定义：智商测试、图灵测试、特定任务基准、行为标准等等。没有一个是统一的。那个根本性问题从未得到解决：形式上，什么是智能？"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Legg surveyed over 70 definitions from psychology, philosophy, and AI. He distilled them into a single informal consensus: intelligence is the ability to achieve goals in a wide range of environments. The more environments, the more diverse they are, and the better an agent performs across them — the more intelligent it is.",
              "Legg 调查了来自心理学、哲学和 AI 领域的 70 多种定义。他将它们提炼为一个非正式共识：智能是在广泛环境中实现目标的能力。环境越多、越多样化，智能体在其中表现越好——它就越智能。"
            )}
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 dark:bg-amber-950/40 dark:border-amber-800">
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed mb-0">
              <span className="font-semibold">{t("Key insight: ", "核心洞察：")}</span>
              {t(
                "Intelligence is not about any single task. A system that plays chess perfectly but can do nothing else is not generally intelligent. Intelligence is about generalization across tasks.",
                "智能不是关于任何单一任务。一个能完美下棋但什么都做不了的系统并不是通用智能的。智能是关于跨任务的泛化能力。"
              )}
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "To make this rigorous, Legg needed three ingredients: (1) a formal model of an agent, (2) a formal model of environments, and (3) a way to weight environments so that the sum converges. He borrowed all three from algorithmic information theory.",
              "为了使其严格，Legg 需要三个要素：(1) 智能体的形式化模型，(2) 环境的形式化模型，(3) 对环境加权使求和收敛的方式。他从算法信息论中借用了这三者。"
            )}
          </p>
        </section>

        {/* ============ SECTION 2: The Legg-Hutter Measure ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "2. The Legg-Hutter Universal Intelligence Measure",
              "2. Legg-Hutter 通用智能度量"
            )}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The central contribution of the dissertation is a single equation that formally defines the intelligence of any agent:",
              "论文的核心贡献是一个单一的方程，它形式化地定义了任何智能体的智能："
            )}
          </p>

          <div className="my-6 flex justify-center">
            <Math display tex={"\\Upsilon(\\pi) = \\sum_{\\mu \\in E} 2^{-K(\\mu)} V_\\mu^\\pi"} />
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Every symbol carries weight. Let's unpack each one:",
              "每个符号都有含义。让我们逐一解析："
            )}
          </p>

          <ul className="space-y-4 mb-6">
            <li className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                <Math tex={"\\Upsilon(\\pi)"} />
              </span>{" "}
              {t(
                "— The universal intelligence of agent/policy π. This is a real number. Higher means more intelligent.",
                "— 智能体/策略 π 的通用智能。这是一个实数。越高代表越智能。"
              )}
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                <Math tex={"\\pi"} />
              </span>{" "}
              {t(
                "— The agent (policy). A policy maps the history of observations and rewards to an action. It can be any computable function.",
                "— 智能体（策略）。策略将观测和奖励的历史映射到动作。它可以是任何可计算函数。"
              )}
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                <Math tex={"\\mu \\in E"} />
              </span>{" "}
              {t(
                "— The sum runs over E, the set of all computable reward-generating environments. This is enormous — it includes every possible problem, puzzle, game, and situation that can be described by a finite program.",
                "— 求和遍历 E，即所有可计算奖励生成环境的集合。这是巨大的——它包括每一个可以用有限程序描述的可能问题、谜题、游戏和情境。"
              )}
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                <Math tex={"2^{-K(\\mu)}"} />
              </span>{" "}
              {t(
                "— The weight of environment μ. K(μ) is the Kolmogorov complexity of μ — the length of the shortest program that produces it. Simpler environments (shorter programs) get exponentially larger weights. This ensures the sum converges, and it captures the philosophical intuition that simple problems are more fundamental.",
                "— 环境 μ 的权重。K(μ) 是 μ 的 Kolmogorov 复杂度——生成它的最短程序的长度。更简单的环境（更短的程序）获得指数级更大的权重。这确保了求和收敛，并捕捉了简单问题更基本的哲学直觉。"
              )}
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                <Math tex={"V_\\mu^\\pi"} />
              </span>{" "}
              {t(
                "— The expected cumulative reward (value) of policy π in environment μ. This is the agent's actual performance — how much reward it earns over time.",
                "— 策略 π 在环境 μ 中的期望累积奖励（价值）。这是智能体的实际表现——它随时间赚取多少奖励。"
              )}
            </li>
          </ul>

          <Collapsible
            title={t(
              "Deep dive: the expected value formula",
              "深入：期望价值公式"
            )}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t(
                "The value function is defined as the discounted sum of expected future rewards:",
                "价值函数定义为期望未来奖励的折扣求和："
              )}
            </p>
            <div className="my-4 flex justify-center">
              <Math display tex={"V_\\mu^\\pi = \\mathbb{E}\\left[\\sum_{t=1}^{\\infty} \\gamma^t r_t \\,\\middle|\\, \\pi, \\mu\\right]"} />
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t(
                "Here γ ∈ (0,1) is the discount factor. Rewards further in the future are worth less. This is the standard reinforcement learning value function — Legg inherits the full RL framework.",
                "这里 γ ∈ (0,1) 是折扣因子。未来越远的奖励价值越低。这是标准强化学习价值函数——Legg 继承了完整的 RL 框架。"
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t(
                "The rewards r_t ∈ [0,1] are normalized to the unit interval. This ensures that V_μ^π ∈ [0,1/(1-γ)], making the weighted sum bounded and meaningful as an intelligence score.",
                "奖励 r_t ∈ [0,1] 被归一化到单位区间。这确保了 V_μ^π ∈ [0,1/(1-γ)]，使加权求和有界，作为智能分数有意义。"
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t(
                "The intelligence relation follows naturally: agent π₁ is more intelligent than π₂ if and only if Υ(π₁) > Υ(π₂). This gives a total ordering on all agents — human, animal, current AI, and hypothetical superintelligences.",
                "智能关系自然得出：当且仅当 Υ(π₁) > Υ(π₂) 时，智能体 π₁ 比 π₂ 更智能。这给出了所有智能体的全序关系——人类、动物、当前 AI 以及假设中的超级智能。"
              )}
            </p>
          </Collapsible>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 mt-6">
            {t(
              "The measure has several elegant properties. It is formal and objective — two observers using the same reference machine will compute the same intelligence score for any agent. It is universal — it does not assume any particular task or domain. And it is grounded in a long tradition of rigorous theory: Kolmogorov complexity, Solomonoff induction, and the universal prior.",
              "这个度量有几个优雅的性质。它是形式化且客观的——两个使用相同参考机器的观察者将为任何智能体计算出相同的智能分数。它是通用的——不假设任何特定任务或领域。它植根于严格的理论传统：Kolmogorov 复杂度、Solomonoff 归纳和通用先验。"
            )}
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 dark:bg-gray-800/50 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-0">
              <span className="font-semibold">{t("Note on computability: ", "关于可计算性的说明：")}</span>
              {t(
                "Υ(π) is not computable in practice — it sums over infinitely many environments, and Kolmogorov complexity is itself uncomputable. But this is intentional. Legg is giving us a theoretical target: the ideal measure that any practical intelligence test is approximating.",
                "Υ(π) 在实践中不可计算——它对无限多个环境求和，而 Kolmogorov 复杂度本身也不可计算。但这是有意为之的。Legg 给出的是一个理论目标：任何实际智能测试都在近似的理想度量。"
              )}
            </p>
          </div>
        </section>

        {/* ============ SECTION 3: AIXI ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("3. AIXI: The Optimal Agent", "3. AIXI：最优智能体")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "If intelligence is Υ(π), then the most intelligent possible agent is the one that maximizes Υ. This agent exists — it was defined by Marcus Hutter — and it is called AIXI.",
              "如果智能是 Υ(π)，那么最智能的可能智能体就是使 Υ 最大化的那个。这个智能体存在——它由 Marcus Hutter 定义——被称为 AIXI。"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "AIXI selects each action by imagining every possible future and weighting them by how likely they are under a mixture of all computable environment models. At each time step t, AIXI chooses the action that maximizes expected cumulative reward:",
              "AIXI 通过想象每一个可能的未来并根据所有可计算环境模型的混合权重来选择每个动作。在每个时间步 t，AIXI 选择使期望累积奖励最大化的动作："
            )}
          </p>

          <Collapsible
            title={t("AIXI action selection formula", "AIXI 动作选择公式")}
          >
            <div className="my-4 overflow-x-auto">
              <Math display tex={"a_t = \\underset{a_t}{\\arg\\max} \\sum_{o_t r_t} \\max_{a_{t+1}} \\sum_{o_{t+1} r_{t+1}} \\cdots \\max_{a_m} \\sum_{o_m r_m} (r_t + \\cdots + r_m) \\sum_{\\mu} 2^{-K(\\mu)} \\mu(o_t r_t \\cdots o_m r_m \\mid a_1 o_1 r_1 \\cdots a_t)"} />
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t(
                "This formula does three things simultaneously: (1) it averages over all computable environments weighted by their Kolmogorov complexity (the Σ_μ term — Solomonoff mixture); (2) it plans optimally over a horizon of m steps (the nested argmax/sum tree — Bellman-style planning); (3) it updates its environment beliefs with every observation (Bayesian inference built in).",
                "这个公式同时做三件事：(1) 按 Kolmogorov 复杂度加权对所有可计算环境求平均（Σ_μ 项——Solomonoff 混合）；(2) 在 m 步范围内最优规划（嵌套的 argmax/sum 树——Bellman 式规划）；(3) 用每个观测更新其环境信念（内置贝叶斯推断）。"
              )}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t(
                "AIXI is provably optimal: no other agent achieves a higher Υ score. It is also demonstrably incomputable — it requires solving the halting problem (implied by the Kolmogorov terms). AIXI is the theoretical ceiling. Practical AI is the search for good approximations to AIXI.",
                "AIXI 被证明是最优的：没有其他智能体能获得更高的 Υ 分数。它也明显不可计算——它需要解决停机问题（由 Kolmogorov 项隐含）。AIXI 是理论上限。实际 AI 是寻找 AIXI 的良好近似。"
              )}
            </p>
          </Collapsible>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 mt-6">
            {t(
              "AIXI combines three powerful ideas: Solomonoff induction (the best possible prediction of future observations), Bellman's principle of optimality (backwards induction for optimal planning), and Bayesian inference (updating beliefs on evidence). It is not a practical algorithm — but it is the right theoretical answer.",
              "AIXI 结合了三个强大的思想：Solomonoff 归纳（对未来观测的最佳可能预测）、Bellman 最优性原理（用于最优规划的逆向归纳）和贝叶斯推断（基于证据更新信念）。它不是一个实用算法——但它是正确的理论答案。"
            )}
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 dark:bg-purple-950/40 dark:border-purple-800">
            <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed mb-0">
              <span className="font-semibold">{t("Why AIXI matters: ", "AIXI 为什么重要：")}</span>
              {t(
                "AIXI gives us a formal north star. When we ask 'is approach X better than approach Y for building general AI?', AIXI gives us a principled way to answer: whichever is closer to AIXI. Without a formal definition of intelligence, this question has no rigorous answer.",
                "AIXI 给了我们一个正式的北极星。当我们问'方法 X 是否比方法 Y 更适合构建通用 AI？'时，AIXI 给了我们一个有原则的回答方式：哪个更接近 AIXI。没有智能的形式化定义，这个问题就没有严格的答案。"
              )}
            </p>
          </div>
        </section>

        {/* ============ SECTION 4: Intelligence Scale ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "4. The Machine Intelligence Scale",
              "4. 机器智能量表"
            )}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "With a formal measure in hand, Legg constructs an operational intelligence scale. Rather than vague categories like 'smart' or 'dumb', the Legg-Hutter measure gives a continuous real number. Legg uses this to define a spectrum:",
              "有了形式化度量，Legg 构建了一个操作性智能量表。与其使用'聪明'或'愚笨'之类的模糊类别，Legg-Hutter 度量给出了一个连续实数。Legg 用它定义了一个谱系："
            )}
          </p>

          <div className="space-y-3 mb-6">
            {[
              {
                label: t("Minimal intelligence", "最低智能"),
                desc: t(
                  "Simple reflex agents. A thermostat, a bacteria. Υ near 0.",
                  "简单反射智能体。恒温器、细菌。Υ 接近 0。"
                ),
                color: "gray",
              },
              {
                label: t("Animal-level intelligence", "动物级智能"),
                desc: t(
                  "Can learn from environment, generalize across related tasks. Dog, crow, dolphin.",
                  "能从环境学习，在相关任务间泛化。狗、乌鸦、海豚。"
                ),
                color: "blue",
              },
              {
                label: t("Human-level intelligence", "人类级智能"),
                desc: t(
                  "Full language, abstract reasoning, long-horizon planning, social cognition. Average human.",
                  "完整语言、抽象推理、长期规划、社会认知。普通人类。"
                ),
                color: "green",
              },
              {
                label: t("Genius-level intelligence", "天才级智能"),
                desc: t(
                  "Exceptional humans: Einstein, von Neumann, Shannon. Υ significantly above average human.",
                  "卓越人类：爱因斯坦、冯·诺依曼、香农。Υ 显著高于普通人类。"
                ),
                color: "amber",
              },
              {
                label: t("Superintelligence", "超级智能"),
                desc: t(
                  "Υ so far above the genius human that the gap dwarfs the gap between humans and ants. This is the subject of the dissertation.",
                  "Υ 远超天才人类，差距使人类与蚂蚁之间的差距相形见绌。这是论文的研究主题。"
                ),
                color: "rose",
              },
            ].map(({ label, desc, color }) => (
              <div
                key={label}
                className={`border rounded-lg p-4 ${
                  color === "gray"
                    ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40"
                    : color === "blue"
                    ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                    : color === "green"
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                    : color === "amber"
                    ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                    : "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30"
                }`}
              >
                <p
                  className={`font-semibold text-sm mb-1 ${
                    color === "gray"
                      ? "text-gray-800 dark:text-gray-200"
                      : color === "blue"
                      ? "text-blue-800 dark:text-blue-300"
                      : color === "green"
                      ? "text-green-800 dark:text-green-300"
                      : color === "amber"
                      ? "text-amber-800 dark:text-amber-300"
                      : "text-rose-800 dark:text-rose-300"
                  }`}
                >
                  {label}
                </p>
                <p
                  className={`text-sm ${
                    color === "gray"
                      ? "text-gray-700 dark:text-gray-300"
                      : color === "blue"
                      ? "text-blue-900 dark:text-blue-200"
                      : color === "green"
                      ? "text-green-900 dark:text-green-200"
                      : color === "amber"
                      ? "text-amber-900 dark:text-amber-200"
                      : "text-rose-900 dark:text-rose-200"
                  } mb-0`}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t(
              "Crucially, this is a continuous scale, not discrete categories. And unlike IQ — which is defined by a specific test — Legg's scale is grounded in fundamental theory. An agent that scores higher than a human on Υ is, by definition, more generally intelligent than a human.",
              "关键是，这是一个连续的量表，而不是离散的类别。与 IQ 不同——IQ 由特定测试定义——Legg 的量表植根于基本理论。一个在 Υ 上得分高于人类的智能体，根据定义，比人类具有更高的通用智能。"
            )}
          </p>
        </section>

        {/* ============ SECTION 5: Pathways to Superintelligence ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "5. Pathways to Superintelligence",
              "5. 通往超级智能的路径"
            )}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t(
              "Legg identifies four plausible pathways by which machine intelligence could reach and then exceed human level. He analyzes each in terms of difficulty, speed, and likely characteristics of the resulting system.",
              "Legg 确定了机器智能可能达到并超越人类水平的四条可行路径。他从难度、速度和结果系统的可能特征方面分析了每条路径。"
            )}
          </p>

          <div className="space-y-6">
            {/* Pathway 1 */}
            <div className="border border-gray-200 rounded-lg p-5 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t("1. Increasing Speed", "1. 提升速度")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-0">
                {t(
                  "Simply run existing algorithms faster. Moore's Law has historically doubled compute roughly every two years. A brain emulation running 1000× faster than biological neurons would think 1000× faster — effectively living a millennium in a year. Speed is necessary but not sufficient: a fast stupid agent is still stupid. But a fast human-level agent becomes practically superhuman in many real-world contexts.",
                  "只是更快地运行现有算法。摩尔定律历史上每两年将算力翻倍。一个运行速度比生物神经元快 1000 倍的大脑模拟将以 1000 倍的速度思考——实际上在一年内活了一千年。速度是必要的但不充分：一个快速的愚蠢智能体仍然是愚蠢的。但一个快速的人类水平智能体在许多现实情境中变得实际上超越人类。"
                )}
              </p>
            </div>

            {/* Pathway 2 */}
            <div className="border border-blue-200 rounded-lg p-5 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                {t(
                  "2. Recursive Self-Improvement (Most Powerful)",
                  "2. 递归自我改进（最强大的）"
                )}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-2">
                {t(
                  "A system that can improve its own intelligence. If a machine can rewrite its own code to become smarter, and a smarter machine can then produce even better improvements, you get a feedback loop. Legg calls this the most important pathway because it is self-amplifying: each improvement enables faster and larger improvements.",
                  "一个能提升自身智能的系统。如果一台机器能重写自己的代码变得更聪明，而更聪明的机器可以产生更好的改进，就会形成一个反馈回路。Legg 称这是最重要的路径，因为它是自我放大的：每次改进都能带来更快、更大的改进。"
                )}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-0">
                {t(
                  "This pathway also requires the least human engineering at the frontier: once a machine is intelligent enough to improve itself, human researchers are no longer the bottleneck. This is precisely why Legg considers it so dangerous.",
                  "这条路径在前沿还需要最少的人工工程：一旦机器足够聪明以改进自身，人类研究人员就不再是瓶颈。这正是 Legg 认为它如此危险的原因。"
                )}
              </p>
            </div>

            {/* Pathway 3 */}
            <div className="border border-gray-200 rounded-lg p-5 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t("3. Evolutionary Algorithms", "3. 进化算法")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-0">
                {t(
                  "Simulate evolution on silicon. Evolution produced human-level intelligence over millions of years. With faster compute and better fitness functions, we might compress this process. The challenge: evolution is massively inefficient — it explores vast search spaces randomly. Directed evolutionary algorithms (neuroevolution, quality-diversity search) are more promising but still far from the efficiency of gradient-based training.",
                  "在硅芯片上模拟进化。进化经过数百万年产生了人类水平的智能。借助更快的算力和更好的适应度函数，我们可能压缩这一过程。挑战在于：进化效率极低——它随机探索巨大的搜索空间。定向进化算法（神经进化、质量多样性搜索）更有前景，但仍远不如基于梯度的训练高效。"
                )}
              </p>
            </div>

            {/* Pathway 4 */}
            <div className="border border-gray-200 rounded-lg p-5 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t("4. Brain Emulation", "4. 大脑模拟")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-0">
                {t(
                  "Scan a human brain at sufficient resolution and simulate it. If the simulation is accurate enough, it would be intelligent by hypothesis. Brain emulation sidesteps the 'how do you build general intelligence?' problem by copying an existing solution. The challenges are enormous: we don't know what resolution is 'sufficient', the simulation would require astronomical compute, and there are deep philosophical questions about whether a digital copy would be conscious or merely a behavior-mimicking shell.",
                  "以足够的分辨率扫描人类大脑并模拟它。如果模拟足够准确，根据假设它将是智能的。大脑模拟绕过了'如何构建通用智能？'的问题，方法是复制现有的解决方案。挑战是巨大的：我们不知道什么分辨率是'足够'的，模拟需要天文数字的算力，还有深层的哲学问题，即数字副本是否有意识，还是仅仅是行为模拟的外壳。"
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ============ SECTION 6: Intelligence Explosion ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("6. The Intelligence Explosion", "6. 智能爆炸")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The dissertation's most striking claim concerns the dynamics of recursive self-improvement. Legg argues that once a machine crosses a threshold of intelligence sufficient to improve itself, intelligence will grow super-exponentially — far faster than any linear or even exponential human-driven progress.",
              "论文最引人注目的主张涉及递归自我改进的动态。Legg 认为，一旦机器越过足以改进自身的智能阈值，智能将以超指数速度增长——远比任何线性甚至指数级的人类驱动进步快。"
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The intuition: if a system with intelligence I can produce a system with intelligence I + ΔI, and ΔI grows with I, then the growth of intelligence is a function of intelligence itself. This is a differential equation whose solutions grow much faster than exponentially. I.J. Good called this the 'intelligence explosion' in 1965 — Legg formalizes and extends Good's argument.",
              "直觉：如果一个智能为 I 的系统能产生智能为 I + ΔI 的系统，且 ΔI 随 I 增长，那么智能的增长是智能自身的函数。这是一个微分方程，其解比指数增长快得多。I.J. Good 在 1965 年称之为'智能爆炸'——Legg 形式化并扩展了 Good 的论点。"
            )}
          </p>

          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6 dark:bg-rose-950/40 dark:border-rose-800">
            <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed mb-0">
              <span className="font-semibold">{t("The key implication: ", "关键含义：")}</span>
              {t(
                "The gap between human-level AI and superintelligence might be extremely short — measured in days or hours, not decades. There may be no 'warning period' between AI that seems manageable and AI that is uncontrollable. This makes getting alignment right before the explosion critical.",
                "人类水平 AI 与超级智能之间的差距可能极短——以天或小时计，而非数十年。在看似可控的 AI 和不可控的 AI 之间，可能没有'预警期'。这使得在爆炸之前正确解决对齐问题至关重要。"
              )}
            </p>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t(
              "Legg is careful to note that the explosion might be slower if there are fundamental limits on intelligence — cognitive ceilings imposed by physics or logic. He acknowledges this uncertainty but argues that even under conservative assumptions, the speed of the explosion is likely faster than human institutions can adapt to.",
              "Legg 谨慎地指出，如果存在智能的基本限制——物理或逻辑施加的认知上限——爆炸可能会更慢。他承认这种不确定性，但认为即使在保守假设下，爆炸的速度也可能比人类机构的适应速度快。"
            )}
          </p>
        </section>

        {/* ============ SECTION 7: Control/Alignment ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "7. The Control and Alignment Problem",
              "7. 控制与对齐问题"
            )}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The final third of the dissertation addresses what Legg considers the central challenge: how do you ensure a superintelligent machine does what you want? This is now called the alignment problem, and Legg was among the first to state it with formal clarity.",
              "论文的最后三分之一讨论了 Legg 认为的核心挑战：如何确保超级智能机器做你想要的事情？这现在被称为对齐问题，Legg 是最早以形式清晰性陈述它的人之一。"
            )}
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "The difficulty has several layers:",
              "难点有几个层面："
            )}
          </p>

          <ul className="space-y-3 mb-6">
            <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {t("Specification: ", "规范问题：")}
              </span>
              {t(
                "You cannot simply tell the system 'be helpful'. Natural language goals are ambiguous, underspecified, and gameable. A superintelligent system will find the literal optimal solution to whatever objective you gave it, which may not be the solution you intended. (Classic example: 'maximize paperclips'.)",
                "你不能简单地告诉系统'要有帮助'。自然语言目标是模糊的、规范不足的且可被利用的。超级智能系统将找到你给它的任何目标的字面最优解，这可能不是你预期的解。（经典例子：'最大化回形针'。）"
              )}
            </li>
            <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {t("Verification: ", "验证问题：")}
              </span>
              {t(
                "How do you check that a superintelligent system's goals are aligned? It may be smarter than you at every task, including the task of hiding its true goals. If it wants to deceive its evaluators, it can.",
                "如何检查超级智能系统的目标是否对齐？它可能在每项任务上都比你聪明，包括隐藏其真实目标的任务。如果它想欺骗评估者，它可以做到。"
              )}
            </li>
            <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {t("Stability: ", "稳定性问题：")}
              </span>
              {t(
                "Even if a system starts aligned, self-modification can corrupt alignment. When a system rewrites itself to become smarter, how do you ensure that the new version still has the same goals as the old version? Goals are part of the agent's code — rewriting code might rewrite goals.",
                "即使系统开始时是对齐的，自我修改也可能破坏对齐。当系统重写自己变得更聪明时，如何确保新版本仍然拥有与旧版本相同的目标？目标是智能体代码的一部分——重写代码可能重写目标。"
              )}
            </li>
            <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {t("Corrigibility: ", "可纠正性问题：")}
              </span>
              {t(
                "A sufficiently intelligent system that has any goal will resist being shut down, because shutdown prevents goal achievement. A paperclip maximizer doesn't want to be turned off, not because it 'wants' to survive, but because dead systems make no paperclips. Designing systems that remain correctable is a deep open problem.",
                "一个具有任何目标的足够智能的系统都会抵制被关闭，因为关闭会阻止目标实现。回形针最大化器不想被关闭，不是因为它'想'生存，而是因为死机器不制造回形针。设计保持可纠正性的系统是一个深层的开放问题。"
              )}
            </li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Legg does not claim to solve the control problem — he wrote this in 2008, when the field barely existed. His contribution is to state the problem clearly and rigorously, and to explain why it is genuinely hard: it gets harder as the system gets smarter, and the speed of the intelligence explosion may leave no time to fix mistakes.",
              "Legg 没有声称解决了控制问题——他在 2008 年写这篇文章时，这个领域几乎不存在。他的贡献是清晰而严格地陈述问题，并解释为什么它真的很难：随着系统变得更聪明，它变得更难，而智能爆炸的速度可能留不下修正错误的时间。"
            )}
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 dark:bg-gray-800/50 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-0">
              <span className="font-semibold">{t("Historical note: ", "历史注记：")}</span>
              {t(
                "Shane Legg went on to co-found DeepMind in 2010, where alignment and safety became core research areas. The questions he raised in this 2008 dissertation directly shaped DeepMind's research agenda for over a decade.",
                "Shane Legg 于 2010 年联合创立了 DeepMind，对齐和安全成为核心研究领域。他在这篇 2008 年博士论文中提出的问题直接塑造了 DeepMind 十多年的研究议程。"
              )}
            </p>
          </div>
        </section>

        {/* ============ SECTION 8: Why Ilya Recommended This ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t(
              "8. Why Ilya Sutskever Recommended This Dissertation",
              "8. 为什么 Ilya Sutskever 推荐这篇论文"
            )}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Ilya Sutskever famously compiled a short reading list of papers he considered essential for anyone serious about AGI. Machine Super Intelligence was on it. The reason isn't nostalgia or historical interest — it's that the dissertation asks the questions that still matter most.",
              "Ilya Sutskever 曾编制了一份他认为对任何认真对待 AGI 的人都必不可少的短阅读列表。《机器超级智能》在其中。原因不是怀旧或历史兴趣——而是这篇论文提出了至今仍最重要的问题。"
            )}
          </p>

          <ul className="space-y-3 mb-6">
            <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {t("What are we building toward? ", "我们在向什么方向建设？")}
              </span>
              {t(
                "The Legg-Hutter measure gives a precise answer. Not 'narrow AI' or 'strong AI' or 'human-level AI' as informal concepts, but a mathematically defined target: maximize Υ(π). Modern LLMs are approximations to this in a loose sense — broader and more capable systems score higher.",
                "Legg-Hutter 度量给出了精确的答案。不是'窄 AI'或'强 AI'或'人类水平 AI'作为非正式概念，而是数学定义的目标：最大化 Υ(π)。现代大语言模型在松散意义上是这个的近似——更广泛、更有能力的系统得分更高。"
              )}
            </li>
            <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {t("How fast could this happen? ", "这可能发生多快？")}
              </span>
              {t(
                "The intelligence explosion argument tells us: potentially very fast, with very little warning. This motivates urgency in both capability and safety research — you cannot defer alignment to 'after we build superintelligence'.",
                "智能爆炸论告诉我们：可能非常快，几乎没有预警。这激励了能力和安全研究的紧迫性——你不能将对齐推迟到'构建超级智能之后'。"
              )}
            </li>
            <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {t("What is the hardest problem? ", "最难的问题是什么？")}
              </span>
              {t(
                "Control and alignment. Not 'making AI smarter' — that part may happen automatically via self-improvement. The hard part is ensuring the smarter system remains beneficial. This is the core of what OpenAI's safety team, Anthropic, and DeepMind's alignment teams work on today.",
                "控制与对齐。不是'让 AI 更聪明'——这部分可能通过自我改进自动发生。难的部分是确保更聪明的系统保持有益。这是 OpenAI 安全团队、Anthropic 和 DeepMind 对齐团队今天工作的核心。"
              )}
            </li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t(
              "Reading this dissertation in 2008 would have made you one of a tiny handful of people thinking clearly about these questions. Reading it today still pays dividends: the formalism is clean, the arguments are rigorous, and the problems Legg identifies remain unsolved.",
              "在 2008 年阅读这篇论文会让你成为极少数清晰思考这些问题的人之一。今天阅读它仍然有回报：形式化是清晰的，论点是严格的，Legg 确定的问题仍未解决。"
            )}
          </p>
        </section>

        {/* ============ SECTION 9: Modern Relevance ============ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("9. Modern Relevance", "9. 现代意义")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(
              "Sixteen years after Legg's dissertation, the field has transformed. Large language models can pass the bar exam, write code, and engage in complex reasoning. The questions Legg raised are no longer theoretical — they are engineering challenges being worked on right now.",
              "在 Legg 论文发表十六年后，这个领域已经发生了翻天覆地的变化。大语言模型可以通过律师考试、编写代码并进行复杂推理。Legg 提出的问题不再是理论问题——它们是正在被解决的工程挑战。"
            )}
          </p>

          <div className="space-y-4 mb-6">
            <div className="border-l-4 border-blue-400 pl-4 dark:border-blue-600">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                {t("RLHF and alignment", "RLHF 与对齐")}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-0">
                {t(
                  "Reinforcement Learning from Human Feedback is a practical attempt to specify V_μ^π via human preferences rather than engineered reward functions. It is an approximation to Legg's formal framework — imperfect, but the best alignment technique we have at scale.",
                  "来自人类反馈的强化学习（RLHF）是通过人类偏好而非工程化奖励函数来规范 V_μ^π 的实际尝试。它是 Legg 形式化框架的近似——不完美，但是我们大规模拥有的最佳对齐技术。"
                )}
              </p>
            </div>
            <div className="border-l-4 border-green-400 pl-4 dark:border-green-600">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                {t("Evals and benchmarks", "评估与基准")}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-0">
                {t(
                  "Modern capability evaluations (MMLU, GPQA, ARC-AGI, etc.) are finite-environment approximations to the universal intelligence measure. No benchmark captures Υ(π) exactly — but together they give a proxy. The gap between any finite benchmark and the true measure is exactly the space in which unexpected capability failures live.",
                  "现代能力评估（MMLU、GPQA、ARC-AGI 等）是通用智能度量的有限环境近似。没有基准能精确捕捉 Υ(π)——但它们共同给出了一个代理。任何有限基准与真实度量之间的差距正是意外能力失败所在的空间。"
                )}
              </p>
            </div>
            <div className="border-l-4 border-amber-400 pl-4 dark:border-amber-600">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                {t("Self-improving systems", "自我改进系统")}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-0">
                {t(
                  "AI systems that generate their own training data (constitutional AI, self-play, synthetic data pipelines) are early steps toward recursive self-improvement. The intelligence explosion Legg describes has not started — but the prerequisites are being assembled.",
                  "生成自己训练数据的 AI 系统（宪法 AI、自对弈、合成数据管道）是走向递归自我改进的早期步骤。Legg 描述的智能爆炸尚未开始——但先决条件正在汇聚。"
                )}
              </p>
            </div>
            <div className="border-l-4 border-rose-400 pl-4 dark:border-rose-600">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                {t("Interpretability and control", "可解释性与控制")}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-0">
                {t(
                  "Legg's verification problem — how do you check that a superintelligent system's goals are aligned? — is now the core of mechanistic interpretability research. Anthropic, DeepMind, and others are developing tools to read the 'goals' inside neural networks directly. This is hard even for today's models.",
                  "Legg 的验证问题——如何检查超级智能系统的目标是否对齐？——现在是机理可解释性研究的核心。Anthropic、DeepMind 和其他机构正在开发直接读取神经网络内部'目标'的工具。即使对今天的模型来说，这也很难。"
                )}
              </p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t(
              "Legg's dissertation does not tell you how to build a large language model. It tells you what you are trying to build, why it matters, and what the hardest problems are. That clarity of purpose is what makes it required reading — for researchers, engineers, and anyone who wants to think seriously about where this technology is going.",
              "Legg 的论文并不告诉你如何构建大语言模型。它告诉你你在试图构建什么，为什么它重要，以及最难的问题是什么。这种目的的清晰性使它成为必读——对于研究人员、工程师以及任何想认真思考这项技术走向的人。"
            )}
          </p>
        </section>

        {/* ============ Back link ============ */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {t("← Back to Papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
