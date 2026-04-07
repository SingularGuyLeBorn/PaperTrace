"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function UnreasonableEffectivenessRNNPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "The Unreasonable Effectiveness of Recurrent Neural Networks",
            "循环神经网络不可思议的有效性"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-paper-200/50">
          Andrej Karpathy &middot; 2015 &middot;{" "}
          <a
            href="http://karpathy.github.io/2015/05/21/rnn-effectiveness/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            karpathy.github.io
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "In 2015, Karpathy trained simple character-level RNNs on raw text and showed they spontaneously learn structure far beyond what anyone expected: line breaks, quotation tracking, indentation depth, even rudimentary syntax. Training on Shakespeare produces plausible Shakespeare. Training on Linux source produces compilable-looking C. This wasn't just impressive — it directly seeded the intuition behind GPT and all modern token-level language models.",
              "2015 年，Karpathy 在原始文本上训练了简单的字符级 RNN，并展示它们自发地学到了远超所有人预期的结构：换行、引号追踪、缩进深度，甚至初步的语法。在莎士比亚作品上训练出来的结果像真正的莎士比亚。在 Linux 源码上训练出来的结果看起来像能编译的 C 代码。这不仅令人印象深刻 — 它直接播下了 GPT 和所有现代词元级语言模型背后的直觉种子。"
            )}
          </p>
        </section>

        {/* ============ 1. RNN Architecture Recap ============ */}
        <h2>{t("1. RNN Architecture Recap", "1. RNN 架构回顾")}</h2>

        <p>
          {t(
            "A Recurrent Neural Network maintains a hidden state vector that gets updated at every time step. At step t, the network takes the current input x_t and the previous hidden state h_{t-1}, mixes them through a learned weight matrix, and squashes through tanh to produce the new hidden state h_t:",
            "循环神经网络维护一个隐藏状态向量，在每个时间步更新。在第 t 步，网络接收当前输入 x_t 和前一个隐藏状态 h_{t-1}，通过学习到的权重矩阵混合，再经过 tanh 压缩，产生新的隐藏状态 h_t："
          )}
        </p>

        <Math
          display
          label={t("RNN hidden state update", "RNN 隐藏状态更新")}
          tex="h_t = \tanh(W_{hh}\, h_{t-1} + W_{xh}\, x_t + b_h)"
        />

        <Math
          display
          label={t("RNN output", "RNN 输出")}
          tex="y_t = W_{hy}\, h_t + b_y"
        />

        <p>
          {t(
            "The final output y_t is passed through a softmax to get a probability distribution over the next character. Three weight matrices are learned end-to-end:",
            "最终输出 y_t 经过 softmax 得到下一个字符的概率分布。三个权重矩阵端到端学习："
          )}
        </p>

        <Collapsible title={t("What each weight matrix does", "每个权重矩阵的作用")} defaultOpen>
          <div className="text-sm space-y-3">
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-3 items-start">
              <code className="font-mono text-blue-700 dark:text-blue-300 text-xs bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">W_xh</code>
              <span>
                {t(
                  "Input-to-hidden: maps the current input character (one-hot vector of size V) into the hidden space. Encodes \"what the current character contributes to state.\"",
                  "输入到隐藏层：将当前输入字符（大小为 V 的 one-hot 向量）映射到隐藏空间。编码「当前字符对状态的贡献」。"
                )}
              </span>
              <code className="font-mono text-purple-700 dark:text-purple-300 text-xs bg-purple-50 dark:bg-purple-950 px-2 py-1 rounded">W_hh</code>
              <span>
                {t(
                  "Hidden-to-hidden: maps the previous hidden state forward. This is the recurrent connection — it carries memory from the past. Crucially, the same W_hh is applied at every step.",
                  "隐藏到隐藏：将前一个隐藏状态向前映射。这是循环连接 — 它携带过去的记忆。关键是，同样的 W_hh 在每个步骤都被应用。"
                )}
              </span>
              <code className="font-mono text-green-700 dark:text-green-300 text-xs bg-green-50 dark:bg-green-950 px-2 py-1 rounded">W_hy</code>
              <span>
                {t(
                  "Hidden-to-output: decodes the hidden state into logits over the vocabulary. One row per vocabulary character — softmax over these gives the next-character distribution.",
                  "隐藏到输出：将隐藏状态解码为词汇表上的 logits。每个词汇字符一行 — 对这些进行 softmax 得到下一个字符的分布。"
                )}
              </span>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "The output distribution for the next token is:",
            "下一个词元的输出分布为："
          )}
        </p>

        <Math
          display
          label={t("Softmax output distribution", "Softmax 输出分布")}
          tex="\hat{y}_t = \text{softmax}(W_{hy}\, h_t + b_y)"
        />

        <p>
          {t(
            "Training minimizes the cross-entropy loss summed over all time steps — the negative log-probability of the correct next character at each position:",
            "训练最小化所有时间步的交叉熵损失之和 — 每个位置正确的下一个字符的负对数概率："
          )}
        </p>

        <Math
          display
          label={t("Cross-entropy loss over sequence", "序列上的交叉熵损失")}
          tex="\mathcal{L} = -\sum_t \log\, p(x_{t+1} \mid x_1, x_2, \ldots, x_t)"
        />

        <p>
          {t(
            "Gradients flow backward through time via Backpropagation Through Time (BPTT). In practice, gradients are truncated after K steps to avoid memory blowup and vanishing/exploding gradients:",
            "梯度通过时间反向传播（BPTT）向后流动。实际上，梯度在 K 步后被截断，以避免内存爆炸和梯度消失/爆炸："
          )}
        </p>

        <Math
          display
          label={t("Truncated BPTT gradient accumulation", "截断 BPTT 梯度累积")}
          tex="\frac{\partial \mathcal{L}}{\partial W} = \sum_{t} \frac{\partial \mathcal{L}_t}{\partial W} \quad \text{(truncated at } K \text{ steps)}"
        />

        {/* ============ 2. Character-Level Language Modeling ============ */}
        <h2>{t("2. Character-Level Language Modeling", "2. 字符级语言建模")}</h2>

        <p>
          {t(
            "The key setup: feed the model one character at a time, and ask it to predict the next character. No tokenization, no subwords — just raw bytes of text. At test time, you sample from the predicted distribution at each step and feed the result back as input.",
            "核心设置：每次向模型输入一个字符，要求它预测下一个字符。没有分词，没有子词 — 只是文本的原始字节。在测试时，在每一步从预测分布中采样，并将结果作为输入反馈。"
          )}
        </p>

        <Collapsible title={t("Why character-level? Why not words?", "为什么用字符级？为什么不用词？")} defaultOpen>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "Word-level models need a fixed vocabulary — any out-of-vocabulary word becomes an <UNK> token. Character-level models have no such problem: the alphabet is fixed (26 letters + punctuation), and the model can generate any string, including URLs, code, proper nouns, or words it never saw during training.",
                "词级模型需要固定词汇表 — 任何词汇表外的词都变成 <UNK> 标记。字符级模型没有这样的问题：字母表是固定的（26 个字母 + 标点），模型可以生成任何字符串，包括 URL、代码、专有名词或训练时从未见过的词。"
              )}
            </p>
            <p>
              {t(
                "The tradeoff: sequences are much longer (one step per character vs. per word), and the model must learn to group characters into meaningful units entirely implicitly. The fact that it succeeds is the \"unreasonable\" part.",
                "权衡：序列长度更长（每个字符一步，而不是每个词一步），模型必须完全隐式地学习将字符组合成有意义的单元。它成功做到这一点正是「不可思议」的地方。"
              )}
            </p>
          </div>
        </Collapsible>

        <p>
          {t(
            "The training loop is simple: encode each character as a one-hot vector of size V (vocabulary size, typically ~100 for ASCII), run it through the RNN, compute softmax over next characters, backprop through K steps. Karpathy used a two-layer LSTM with 512 hidden units — tiny by today's standards.",
            "训练循环很简单：将每个字符编码为大小 V 的 one-hot 向量（词汇表大小，ASCII 通常约 100），通过 RNN 运行，计算下一个字符的 softmax，通过 K 步进行反向传播。Karpathy 使用了一个有 512 个隐藏单元的双层 LSTM — 以今天的标准来看非常小。"
          )}
        </p>

        {/* ============ 3. What the Model Learns (Activation Analysis) ============ */}
        <h2>{t("3. What the Model Learns: Activation Analysis", "3. 模型学到了什么：激活分析")}</h2>

        <p>
          {t(
            "The most striking part of the blog post: Karpathy visualized individual neuron activations as the RNN processed text, and found cells that had learned to track specific, interpretable properties of the sequence — with no supervision other than \"predict the next character.\"",
            "博客文章中最引人注目的部分：Karpathy 可视化了 RNN 处理文本时单个神经元的激活，发现有些神经元已经学会追踪序列的特定、可解释的属性 — 除了「预测下一个字符」之外没有任何监督。"
          )}
        </p>

        <Collapsible title={t("Cell tracking line length (decides when to newline)", "追踪行长度的神经元（决定何时换行）")} defaultOpen>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "One neuron activates near zero at the start of a line, then smoothly ramps up as more characters are written, and fires strongly when the line is getting long — nudging the model toward predicting a newline character. This emergent \"line length counter\" wasn't programmed; the model discovered it because newlines are predictable from position within a line.",
                "一个神经元在行的开头激活接近零，然后随着更多字符被写入而平滑上升，当行变长时强烈激活 — 推动模型预测换行符。这个涌现出的「行长度计数器」不是被编程的；模型发现了它，因为换行符在行内的位置是可预测的。"
              )}
            </p>
          </div>
        </Collapsible>

        <Collapsible title={t("Cell tracking if inside a quoted string", "追踪是否在引号内的神经元")} defaultOpen>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "Another neuron switches states sharply when the model encounters an opening quotation mark, stays in that state throughout the quoted string, and switches back on the closing quote. The cell essentially implements a flip-flop — a binary memory of \"am I inside quotes?\". This is necessary for correct generation because characters inside quotes follow different statistical patterns than outside.",
                "另一个神经元在模型遇到开引号时状态急剧切换，在整个引用字符串期间保持该状态，并在结束引号时切换回来。这个神经元本质上实现了一个触发器 — 一个「我在引号内吗？」的二进制记忆。这对于正确生成是必要的，因为引号内的字符遵循与外部不同的统计模式。"
              )}
            </p>
          </div>
        </Collapsible>

        <Collapsible title={t("Cell tracking indentation depth (for code)", "追踪缩进深度的神经元（用于代码）")} defaultOpen>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "When trained on Linux kernel C code, one neuron tracks indentation depth: it activates proportionally to how many tabs or spaces the model is currently inside. As the model enters a nested block, the cell activates more strongly; as blocks close, it decreases. This lets the RNN generate matching closing braces at the correct depth.",
                "当在 Linux 内核 C 代码上训练时，一个神经元追踪缩进深度：它按比例激活于模型当前在多少个制表符或空格内。当模型进入嵌套块时，神经元激活更强；随着块关闭，它减少。这让 RNN 能在正确深度生成匹配的右括号。"
              )}
            </p>
          </div>
        </Collapsible>

        <Collapsible title={t("Cell tracking if inside an if-statement", "追踪是否在 if 语句内的神经元")} defaultOpen>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "Another cell fires when the model is inside an if-statement body — between the opening { after an if condition and its matching }. This allows the model to generate syntactically plausible code where if-statements contain consistent, indented bodies. Again: learned purely from character-level prediction, with no parse tree or grammar specification.",
                "另一个神经元在模型处于 if 语句体内时激活 — 在 if 条件后的开括号 { 和其匹配的 } 之间。这使模型能生成语法上合理的代码，其中 if 语句包含一致的、缩进的主体。同样：纯粹从字符级预测中学到，没有解析树或语法规范。"
              )}
            </p>
          </div>
        </Collapsible>

        <p>
          {t(
            "This analysis was groundbreaking: it showed that RNNs aren't just memorizing n-gram statistics. They're building internal representations of document structure. This foreshadowed what we now call \"emergent capabilities\" in large language models.",
            "这项分析是开创性的：它表明 RNN 不仅仅是在记忆 n-gram 统计数据。它们在建立文档结构的内部表示。这预示了我们现在在大型语言模型中称之为「涌现能力」的东西。"
          )}
        </p>

        {/* ============ 4. Generated Shakespeare ============ */}
        <h2>{t("4. Generated Shakespeare", "4. 生成的莎士比亚作品")}</h2>

        <p>
          {t(
            "After training on the complete works of Shakespeare (~1MB of text), the model generates text that looks like this:",
            "在莎士比亚全集（约 1MB 文本）上训练后，模型生成的文本如下所示："
          )}
        </p>

        <blockquote className="my-6 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-950 dark:border-amber-600 px-5 py-4 rounded-r-lg">
          <p className="font-mono text-sm leading-relaxed text-amber-900 dark:text-amber-100 whitespace-pre-line mb-2">
            {`PANDARUS:
Alas, I think he shall be come approached and the day
When little sobs, shalt of best doth been here thou this the doth,
And the grace with which the others they that be well.

VIOLA:
How the time is far with him that you stand, my lord,
And we meet and that I should speak'd of you, mine own.`}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 mb-0">
            {t(
              "Generated by a character-level LSTM trained on Shakespeare. Note: character names in ALL CAPS, consistent stage-direction formatting, and rough iambic pentameter rhythm.",
              "由在莎士比亚作品上训练的字符级 LSTM 生成。注意：角色名称全部大写、一致的舞台方向格式，以及粗略的五步抑扬格节奏。"
            )}
          </p>
        </blockquote>

        <p>
          {t(
            "The model has learned, without any explicit supervision:",
            "模型在没有任何明确监督的情况下学到了："
          )}
        </p>

        <ul>
          <li>
            <strong>{t("Character names in ALL CAPS followed by a colon", "角色名称全部大写后跟冒号")}</strong>
            {t(
              " — the model correctly formats speaker labels like PANDARUS: and VIOLA:.",
              " — 模型正确格式化了说话者标签，如 PANDARUS: 和 VIOLA:。"
            )}
          </li>
          <li>
            <strong>{t("Consistent indentation of dialogue", "对话的一致缩进")}</strong>
            {t(
              " — lines of speech are indented relative to the speaker label.",
              " — 演讲行相对于说话者标签缩进。"
            )}
          </li>
          <li>
            <strong>{t("Approximate iambic pentameter", "近似五步抑扬格")}</strong>
            {t(
              " — lines tend to have 10 syllables with alternating stress, matching Shakespeare's verse form.",
              " — 行倾向于有 10 个音节，具有交替重音，匹配莎士比亚的诗歌形式。"
            )}
          </li>
          <li>
            <strong>{t("Plausible Elizabethan vocabulary", "合理的伊丽莎白时代词汇")}</strong>
            {t(
              " — words like \"doth\", \"shalt\", \"mine own\" appear in grammatically correct positions.",
              " — 像「doth」、「shalt」、「mine own」这样的词出现在语法正确的位置。"
            )}
          </li>
        </ul>

        {/* ============ 5. Generated Linux Kernel Code ============ */}
        <h2>{t("5. Generated Linux Kernel Code", "5. 生成的 Linux 内核代码")}</h2>

        <p>
          {t(
            "Trained on the Linux kernel source code (~430MB of C code), the model generates text like this:",
            "在 Linux 内核源码（约 430MB 的 C 代码）上训练后，模型生成的文本如下所示："
          )}
        </p>

        <blockquote className="my-6 border-l-4 border-slate-400 bg-slate-50 dark:bg-slate-900 dark:border-slate-600 px-5 py-4 rounded-r-lg">
          <pre className="font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre mb-2">{`/*
 * Increment the size file of the new incorrect UI_FILTER group information
 * and target is the total.  So increment the request server tool
 * Temporary so that the start node depends to the file
 * all  units into the block device
 */
static int num_math(void) {
#ifdef CONFIG_BLOCK
        int block_read;
        mutex_lock(&dblock->mutex_io);
        if (num_error && !block_path) {
                device_trace(block, DEVICE_TYPE_DISK);
                return -EINVAL;
        }
#endif
        return 0;
}`}</pre>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-0">
            {t(
              "Generated by a character-level LSTM trained on the Linux kernel. Note: syntactically valid C, correct #ifdef/#endif pairing, proper mutex patterns, realistic error-handling conventions.",
              "由在 Linux 内核上训练的字符级 LSTM 生成。注意：语法上有效的 C 语言、正确的 #ifdef/#endif 配对、适当的互斥模式、真实的错误处理约定。"
            )}
          </p>
        </blockquote>

        <p>
          {t(
            "The generated code exhibits remarkably realistic structure:",
            "生成的代码展现出非常真实的结构："
          )}
        </p>

        <ul>
          <li>
            <strong>{t("Header guards (#ifdef CONFIG_BLOCK ... #endif)", "头部守卫（#ifdef CONFIG_BLOCK ... #endif）")}</strong>
            {t(
              " — the model opens and closes #ifdef blocks correctly, matching real kernel conventions.",
              " — 模型正确打开和关闭 #ifdef 块，匹配真实的内核约定。"
            )}
          </li>
          <li>
            <strong>{t("Function prototypes with realistic names", "具有真实名称的函数原型")}</strong>
            {t(
              " — function names follow kernel naming conventions (snake_case, verb_noun patterns).",
              " — 函数名遵循内核命名约定（蛇形命名法，动词_名词模式）。"
            )}
          </li>
          <li>
            <strong>{t("Consistent indentation and brace style", "一致的缩进和大括号风格")}</strong>
            {t(
              " — the model learned Linux kernel's specific code style (tabs, Allman-adjacent bracing).",
              " — 模型学习了 Linux 内核特定的代码风格（制表符，接近 Allman 风格的大括号）。"
            )}
          </li>
          <li>
            <strong>{t("Mutex, error code, and return value patterns", "互斥锁、错误码和返回值模式")}</strong>
            {t(
              " — mutex_lock/unlock, -EINVAL returns, and NULL checks appear in the right contexts.",
              " — mutex_lock/unlock、-EINVAL 返回值和 NULL 检查出现在正确的上下文中。"
            )}
          </li>
        </ul>

        <Collapsible title={t("LaTeX paper generation (bonus example)", "LaTeX 论文生成（额外示例）")}>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "Karpathy also trained on LaTeX source files from arXiv. The model generated text with \\begin{equation} ... \\end{equation} blocks, \\cite{} references with plausible citation keys, abstract sections in the right place, and even figure captions in a realistic style — all without ever seeing a LaTeX specification.",
                "Karpathy 还在来自 arXiv 的 LaTeX 源文件上进行了训练。模型生成的文本包含 \\begin{equation} ... \\end{equation} 块、带有合理引用键的 \\cite{} 引用、正确位置的摘要部分，甚至以真实风格呈现的图片说明 — 这一切都是在从未看过 LaTeX 规范的情况下完成的。"
              )}
            </p>
            <p>
              {t(
                "This was particularly striking: the model learned not just character statistics but the nested document structure of LaTeX — environments open and close correctly, equation blocks contain plausible math syntax, and bibliography sections appear at the end of the document.",
                "这尤其引人注目：模型不仅学到了字符统计数据，还学到了 LaTeX 的嵌套文档结构 — 环境正确地打开和关闭，方程块包含合理的数学语法，参考文献部分出现在文档末尾。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ 6. Temperature and Diversity ============ */}
        <h2>{t("6. Temperature and Diversity", "6. 温度与多样性")}</h2>

        <p>
          {t(
            "When sampling from the model, a temperature parameter T controls how peaked or spread-out the distribution is. At each step, instead of sampling from the raw softmax probabilities p(x), the model rescales the log-probabilities by T before exponentiating:",
            "从模型中采样时，温度参数 T 控制分布的尖锐程度或分散程度。在每个步骤中，模型在指数化之前将对数概率除以 T，而不是从原始 softmax 概率 p(x) 中采样："
          )}
        </p>

        <Math
          display
          label={t("Temperature-scaled sampling", "温度缩放采样")}
          tex="p_T(x) \propto \exp\!\left(\frac{\log p(x)}{T}\right)"
        />

        <Collapsible title={t("What different temperatures produce", "不同温度产生的效果")} defaultOpen>
          <div className="text-sm space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                <Math inline tex="T \to 0" /> — {t("Most likely character always picked (greedy)", "总是选择最可能的字符（贪心）")}
              </p>
              <p className="text-blue-700 dark:text-blue-200">
                {t(
                  "The distribution collapses to a point mass at argmax. Output is deterministic and repetitive — the model gets stuck in loops. You get highly consistent but boring text.",
                  "分布坍缩为 argmax 处的点质量。输出是确定性的且重复的 — 模型陷入循环。你得到高度一致但无聊的文本。"
                )}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="font-semibold text-green-800 dark:text-green-300 mb-1">
                <Math inline tex="T = 1" /> — {t("Sample from the raw model distribution", "从原始模型分布中采样")}
              </p>
              <p className="text-green-700 dark:text-green-200">
                {t(
                  "Samples exactly from what the model learned. Good balance of coherence and variety. Karpathy used T ≈ 0.5–1.0 for his examples.",
                  "完全从模型学到的内容中采样。连贯性和多样性之间的良好平衡。Karpathy 在他的示例中使用了 T ≈ 0.5–1.0。"
                )}
              </p>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-lg">
              <p className="font-semibold text-rose-800 dark:text-rose-300 mb-1">
                <Math inline tex="T \to \infty" /> — {t("Uniform random sampling over vocabulary", "在词汇表上均匀随机采样")}
              </p>
              <p className="text-rose-700 dark:text-rose-200">
                {t(
                  "All characters become equally likely — pure noise. The model's learned structure is completely washed out. You get random character soup.",
                  "所有字符变得同样可能 — 纯噪声。模型学到的结构被完全冲洗掉。你得到随机的字符汤。"
                )}
              </p>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "Temperature is still used in essentially the same way in modern LLMs (ChatGPT, Claude, Gemini). The math is unchanged — just divide logits by T before softmax. The practical insight from 2015 still holds: low T for factual/code tasks, higher T for creative writing.",
            "温度在现代大型语言模型（ChatGPT、Claude、Gemini）中基本上以相同的方式使用。数学没有变化 — 只是在 softmax 之前将 logits 除以 T。2015 年的实践见解仍然成立：对于事实/代码任务用低 T，对于创意写作用更高的 T。"
          )}
        </p>

        {/* ============ 7. Why This Was Surprising in 2015 ============ */}
        <h2>{t("7. Why This Was Surprising in 2015", "7. 为什么这在 2015 年令人惊讶")}</h2>

        <p>
          {t(
            "To understand why this caused such a stir, consider the prevailing assumptions in 2015:",
            "要理解为什么这引起了如此大的轰动，请考虑 2015 年的主流假设："
          )}
        </p>

        <ul>
          <li>
            <strong>{t("Character models were considered toy models", "字符模型被认为是玩具模型")}</strong>
            {t(
              " — the consensus was that useful sequence models needed word-level tokens at minimum. Character models couldn't possibly learn long-range structure.",
              " — 共识是有用的序列模型至少需要词级词元。字符模型不可能学习长程结构。"
            )}
          </li>
          <li>
            <strong>{t("Linguistic structure required explicit encoding", "语言结构需要显式编码")}</strong>
            {t(
              " — most NLP systems used hand-crafted features: POS tags, parse trees, named entity labels. The idea that a model could discover quotation tracking from raw text was heretical.",
              " — 大多数 NLP 系统使用手工制作的特征：词性标注、解析树、命名实体标签。模型可以从原始文本中发现引号追踪的想法是离经叛道的。"
            )}
          </li>
          <li>
            <strong>{t("Scale skepticism", "对规模的怀疑")}</strong>
            {t(
              " — the pre-deep-learning intuition was that simple optimization (SGD on a fixed-width RNN) couldn't possibly learn hierarchical structure. You'd need specially designed architectures for each type of structure.",
              " — 深度学习之前的直觉是，简单的优化（对固定宽度 RNN 进行 SGD）不可能学习层次结构。你需要为每种类型的结构设计特殊的架构。"
            )}
          </li>
          <li>
            <strong>{t("The training signal seemed too weak", "训练信号看起来太弱")}</strong>
            {t(
              " — predicting the next character is a very weak, local supervision signal. It seemed implausible that this could encode document-level knowledge like \"I am currently inside an if-statement.\"",
              " — 预测下一个字符是一个非常弱的、局部的监督信号。这似乎不可能编码文档级知识，比如「我目前在 if 语句内」。"
            )}
          </li>
        </ul>

        <p>
          {t(
            "The blog post's title was deliberate: Karpathy was echoing Wigner's \"unreasonable effectiveness of mathematics\" and Norvig's \"unreasonable effectiveness of data\" — the pattern that simple, general principles keep working at scales and domains where you'd expect them to fail.",
            "博客文章的标题是刻意的：Karpathy 在呼应 Wigner 的「数学不可思议的有效性」和 Norvig 的「数据不可思议的有效性」— 简单的通用原则在你预期它们会失败的规模和领域继续工作的模式。"
          )}
        </p>

        {/* ============ 8. Path to GPT ============ */}
        <h2>{t("8. Path to GPT", "8. 通向 GPT 之路")}</h2>

        <p>
          {t(
            "Karpathy's 2015 blog post established a template that GPT-1 (2018), GPT-2 (2019), and GPT-3 (2020) would follow almost exactly:",
            "Karpathy 的 2015 年博客文章建立了一个模板，GPT-1（2018）、GPT-2（2019）和 GPT-3（2020）几乎完全遵循这个模板："
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-700 px-3 py-2 text-left">{t("Concept", "概念")}</th>
                <th className="border border-paper-200 dark:border-paper-700 px-3 py-2 text-left">{t("Karpathy 2015 (RNN)", "Karpathy 2015（RNN）")}</th>
                <th className="border border-paper-200 dark:border-paper-700 px-3 py-2 text-left">{t("GPT (2018–2020)", "GPT（2018–2020）")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2 font-medium">{t("Prediction objective", "预测目标")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("Next character", "下一个字符")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("Next token (BPE)", "下一个词元（BPE）")}</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2 font-medium">{t("Architecture", "架构")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("2-layer LSTM, 512 hidden", "2 层 LSTM，512 隐藏单元")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("Transformer decoder, 96 layers (GPT-3)", "Transformer 解码器，96 层（GPT-3）")}</td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2 font-medium">{t("Training data", "训练数据")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("~1–430 MB raw text", "约 1–430 MB 原始文本")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("~45 TB text (GPT-3)", "约 45 TB 文本（GPT-3）")}</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2 font-medium">{t("Supervision", "监督方式")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("Self-supervised only", "仅自监督")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("Self-supervised + RLHF", "自监督 + RLHF")}</td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2 font-medium">{t("Emergent behavior", "涌现行为")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("Quotation/indent tracking", "引号/缩进追踪")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("Reasoning, math, code, translation", "推理、数学、代码、翻译")}</td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2 font-medium">{t("Sampling", "采样")}  </td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("Temperature T", "温度 T")}</td>
                <td className="border border-paper-200 dark:border-paper-700 px-3 py-2">{t("Temperature T + top-p/top-k", "温度 T + top-p/top-k")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The core intellectual leap — that predicting the next token with a large enough model on enough data will spontaneously learn everything about the world embedded in that text — was already visible in Karpathy's 2015 Shakespeare experiment. GPT-3 is, in a direct sense, the same idea at 10,000× scale.",
            "核心智识飞跃 — 用足够大的模型在足够多的数据上预测下一个词元，将自发地学习嵌入在该文本中的关于世界的一切 — 已经在 Karpathy 的 2015 年莎士比亚实验中可见。GPT-3 在直接意义上是同样的想法放大 10,000 倍。"
          )}
        </p>

        <Collapsible title={t("The key insight that survived to GPT-4", "延续到 GPT-4 的关键见解")}>
          <div className="text-sm space-y-2">
            <p>
              {t(
                "Karpathy's post established three ideas that became foundational:",
                "Karpathy 的文章确立了三个成为基础的想法："
              )}
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>
                <strong>{t("Next-token prediction is sufficient", "下一个词元预测就足够了")}</strong>
                {t(
                  " — you don't need to hand-engineer what the model should learn. Just predict the next character/token on enough data.",
                  " — 你不需要手工设计模型应该学什么。只需在足够多的数据上预测下一个字符/词元。"
                )}
              </li>
              <li>
                <strong>{t("Structure is implicit in the data", "结构隐含在数据中")}</strong>
                {t(
                  " — document structure, syntax, facts, style — everything a model needs is already encoded in the statistical patterns of text.",
                  " — 文档结构、语法、事实、风格 — 模型需要的一切都已经编码在文本的统计模式中。"
                )}
              </li>
              <li>
                <strong>{t("Scale matters enormously", "规模非常重要")}</strong>
                {t(
                  " — the 2015 RNN with 512 hidden units was impressive. A 2023 Transformer with 175B parameters trained on 45TB of text is the same idea with dramatically more capacity.",
                  " — 2015 年具有 512 个隐藏单元的 RNN 令人印象深刻。2023 年具有 1750 亿参数、在 45TB 文本上训练的 Transformer 是相同的想法，但拥有更大的容量。"
                )}
              </li>
            </ol>
          </div>
        </Collapsible>

        {/* ============ Resources ============ */}
        <h2>{t("9. Additional Resources", "9. 补充资源")}</h2>

        <div className="space-y-2 my-4">
          <a
            href="http://karpathy.github.io/2015/05/21/rnn-effectiveness/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">The Unreasonable Effectiveness of Recurrent Neural Networks</span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">{t("Original blog post — Andrej Karpathy, 2015", "原始博客文章 — Andrej Karpathy, 2015")}</span>
          </a>

          <a
            href="https://github.com/karpathy/char-rnn"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">char-rnn (GitHub)</span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">{t("Original Lua/Torch implementation by Karpathy", "Karpathy 的原始 Lua/Torch 实现")}</span>
          </a>

          <a
            href="https://github.com/karpathy/nanoGPT"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">nanoGPT (GitHub)</span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">{t("Karpathy's minimal GPT implementation — the direct successor to char-rnn", "Karpathy 的最小 GPT 实现 — char-rnn 的直接继承者")}</span>
          </a>

          <a
            href="https://www.youtube.com/watch?v=PaCmpygFfXo"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">Karpathy — Building makemore (YouTube)</span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">{t("Video lecture building a character-level language model from scratch in PyTorch", "从头在 PyTorch 中构建字符级语言模型的视频讲座")}</span>
          </a>

          <Link
            href={`${basePath}/papers/gpt-2`}
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">{t("GPT-2 deep dive (PaperTrace)", "GPT-2 深度解析（PaperTrace）")}</span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">{t("The direct descendant of char-rnn — same idea, Transformer architecture, 1.5B params", "char-rnn 的直接后裔 — 相同的想法，Transformer 架构，15 亿参数")}</span>
          </Link>
        </div>

        {/* ============ Back ============ */}
        <div className="mt-12 pt-6 border-t border-paper-200 dark:border-paper-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-paper-800/50 dark:text-paper-200/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            &larr; {t("Back to all papers", "返回所有论文")}
          </Link>
        </div>
      </article>
    </div>
  );
}
