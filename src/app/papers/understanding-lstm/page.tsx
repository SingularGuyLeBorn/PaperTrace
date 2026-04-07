"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function UnderstandingLSTMPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Understanding LSTM Networks",
            "理解 LSTM 网络"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-slate-400">
          Christopher Olah &middot; 2015 &middot;{" "}
          <a
            href="https://colah.github.io/posts/2015-08-Understanding-LSTMs/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            colah.github.io
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "LSTMs solve the vanishing gradient problem of vanilla RNNs by introducing a cell state — a \"conveyor belt\" that carries information across many timesteps with minimal modification. Four learned gates (forget, input, candidate, output) decide what to erase, write, and read from this state. The key trick is the additive cell state update: C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t, which creates a near-constant gradient highway through time.",
              "LSTM 通过引入细胞状态（一条「传送带」）来解决普通 RNN 的梯度消失问题，细胞状态可以在几乎不被修改的情况下跨越许多时间步传递信息。四个可学习的门（遗忘门、输入门、候选门、输出门）决定从状态中擦除、写入和读取什么。关键在于加性细胞状态更新：C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t，这在时间维度上创造了一条近似恒定的梯度通路。"
            )}
          </p>
        </section>

        {/* ============ 1. The Vanishing Gradient Problem ============ */}
        <h2>{t("1. The Vanishing Gradient Problem", "1. 梯度消失问题")}</h2>

        <p>
          {t(
            "Recurrent Neural Networks (RNNs) process sequences by maintaining a hidden state h_t that is updated at each timestep. The hidden state is supposed to carry information from the past that is relevant to predicting the next token or label. In principle, an RNN should be able to use context from arbitrarily far back in the sequence.",
            "循环神经网络（RNN）通过在每个时间步更新隐藏状态 h_t 来处理序列。隐藏状态应当携带过去的相关信息，用于预测下一个词或标签。理论上，RNN 应当能利用序列中任意远处的上下文。"
          )}
        </p>

        <p>
          {t(
            "In practice, vanilla RNNs fail to learn long-range dependencies. The reason is the vanishing gradient problem. During backpropagation through time (BPTT), the gradient of the loss with respect to an early hidden state involves a long chain of matrix multiplications — one per timestep. If the eigenvalues of the recurrent weight matrix are less than 1, these multiplications drive the gradient exponentially toward zero. If they are greater than 1, gradients explode.",
            "实践中，普通 RNN 无法学习长距离依赖。原因是梯度消失问题。在时间反向传播（BPTT）中，损失对早期隐藏状态的梯度涉及一个很长的矩阵乘法链 —— 每个时间步一次。如果循环权重矩阵的特征值小于 1，这些乘法会使梯度指数级趋向于零；如果大于 1，梯度则会爆炸。"
          )}
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-900 dark:text-amber-200 mb-0">
            <span className="font-semibold">{t("Concrete failure: ", "具体失败案例：")}</span>
            {t(
              "Consider predicting the verb \"are\" in: \"The cats that the dog chased are hungry.\" A vanilla RNN must bridge a gap of 7 tokens between \"cats\" (plural subject) and \"are\". By the time the gradient flows back from the prediction to the representation of \"cats\", it has been multiplied by the recurrent weight matrix 7 times and has effectively vanished.",
              "考虑预测句子「The cats that the dog chased are hungry.」中的动词「are」。普通 RNN 必须在复数主语「cats」和「are」之间跨越 7 个词的距离。当梯度从预测位置回流到「cats」的表示时，已经被循环权重矩阵乘了 7 次，实际上已消失殆尽。"
            )}
          </p>
        </div>

        <p>
          {t(
            "Hochreiter & Schmidhuber (1997) identified this problem formally and proposed Long Short-Term Memory as the solution. The key insight: instead of propagating information multiplicatively through a hidden state, use an additive cell state that can carry information forward unchanged over many steps.",
            "Hochreiter & Schmidhuber（1997）正式识别了这一问题，并提出了长短期记忆网络（LSTM）作为解决方案。核心洞察：不通过乘法传播隐藏状态，而是使用可以在许多步骤中保持不变地向前传递信息的加性细胞状态。"
          )}
        </p>

        <Collapsible title={t("Why does BPTT cause vanishing gradients mathematically?", "为什么 BPTT 会导致梯度消失？")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "In a vanilla RNN, the hidden state update is h_t = tanh(W_h h_{t-1} + W_x x_t + b). The gradient of the loss L with respect to h_τ (an early timestep) is:",
                "在普通 RNN 中，隐藏状态更新为 h_t = tanh(W_h h_{t-1} + W_x x_t + b)。损失 L 对早期时间步 h_τ 的梯度为："
              )}
            </p>
            <Math
              display
              tex="\frac{\partial L}{\partial h_\tau} = \frac{\partial L}{\partial h_T} \prod_{t=\tau+1}^{T} \frac{\partial h_t}{\partial h_{t-1}} = \frac{\partial L}{\partial h_T} \prod_{t=\tau+1}^{T} W_h^\top \cdot \text{diag}(\tanh'(\cdot))"
            />
            <p>
              {t(
                "Each factor in the product contributes a W_h^T (the recurrent weight matrix transposed) multiplied by the Jacobian of tanh. Since tanh' ≤ 1 everywhere and the spectral radius of W_h is typically ≤ 1 after training, repeated multiplication causes the gradient to shrink exponentially with the number of timesteps T − τ.",
                "乘积中的每个因子都贡献一个 W_h^T（循环权重矩阵转置）乘以 tanh 的雅可比矩阵。由于 tanh' ≤ 1 处处成立，且训练后 W_h 的谱半径通常 ≤ 1，重复乘法导致梯度随时间步数 T − τ 指数级缩小。"
              )}
            </p>
            <p>
              {t(
                "The LSTM's additive cell state update C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t replaces this multiplicative chain with addition. The gradient flowing through C has a highway: ∂C_t/∂C_{t-1} = f_t, which can be kept close to 1 by the forget gate, maintaining gradient magnitude.",
                "LSTM 的加性细胞状态更新 C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t 用加法替代了这条乘法链。流经 C 的梯度有一条高速公路：∂C_t/∂C_{t-1} = f_t，遗忘门可以将其保持在接近 1 的值，维持梯度大小。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ 2. LSTM Cell State ============ */}
        <h2>{t("2. LSTM's Cell State: The Conveyor Belt", "2. LSTM 的细胞状态：传送带")}</h2>

        <p>
          {t(
            "The key innovation of LSTM is the cell state C_t — a separate memory track that runs alongside the hidden state. Olah's blog post describes it as a \"conveyor belt\": information can ride this belt across many timesteps with only minor, deliberate modifications.",
            "LSTM 的关键创新是细胞状态 C_t —— 一个与隐藏状态并行运行的独立记忆轨道。Olah 的博文将其描述为「传送带」：信息可以在这条传送带上跨越许多时间步，只经历微小的、有意为之的修改。"
          )}
        </p>

        <p>
          {t(
            "Unlike the hidden state h_t, which is passed through tanh at every step, the cell state is modified only through element-wise addition and multiplication. This additive structure is what prevents gradient vanishing: the gradient of C_t with respect to C_{t-1} is just the forget gate value f_t, which can stay close to 1.",
            "不同于每步都通过 tanh 的隐藏状态 h_t，细胞状态仅通过逐元素加法和乘法被修改。这种加性结构正是防止梯度消失的原因：C_t 对 C_{t-1} 的梯度恰好是遗忘门值 f_t，它可以保持接近 1。"
          )}
        </p>

        <div className="bg-paper-50 dark:bg-slate-900/40 border border-paper-200 dark:border-slate-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-paper-700 dark:text-slate-300 mb-2 font-semibold">
            {t("The full LSTM state at each timestep:", "每个时间步的完整 LSTM 状态：")}
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside text-paper-700 dark:text-slate-300">
            <li>
              {t(
                "Cell state C_t — long-term memory, the conveyor belt",
                "细胞状态 C_t —— 长期记忆，传送带"
              )}
            </li>
            <li>
              {t(
                "Hidden state h_t — short-term output, passed to the next step and used for predictions",
                "隐藏状态 h_t —— 短期输出，传递至下一步并用于预测"
              )}
            </li>
          </ul>
        </div>

        <p>
          {t(
            "Three gates regulate what information flows into and out of the cell state. Each gate is a sigmoid layer (output in [0, 1]) combined with pointwise multiplication — 0 means \"block everything\", 1 means \"let everything through\". This gating mechanism gives the network fine-grained control over what to remember and forget.",
            "三个门调节信息进出细胞状态。每个门是一个 sigmoid 层（输出在 [0, 1]）与逐点乘法的组合 —— 0 表示「阻止一切」，1 表示「全部通过」。这种门控机制赋予网络对记忆和遗忘的精细控制。"
          )}
        </p>

        {/* ============ 3. Forget Gate ============ */}
        <h2>{t("3. Forget Gate", "3. 遗忘门")}</h2>

        <p>
          {t(
            "The first operation the LSTM performs is deciding what to erase from the cell state. This is done by the forget gate f_t, a sigmoid layer that looks at the previous hidden state h_{t-1} and the current input x_t, and outputs a number between 0 and 1 for each element of C_{t-1}.",
            "LSTM 执行的第一个操作是决定从细胞状态中擦除什么。这由遗忘门 f_t 完成，它是一个 sigmoid 层，查看上一个隐藏状态 h_{t-1} 和当前输入 x_t，为 C_{t-1} 的每个元素输出一个 0 到 1 之间的数。"
          )}
        </p>

        <Math
          display
          label={t("Forget gate", "遗忘门")}
          tex="f_t = \sigma(W_f \cdot [h_{t-1},\, x_t] + b_f)"
        />

        <p>
          {t(
            "Here [h_{t-1}, x_t] denotes concatenation of the previous hidden state and current input. W_f is the learned weight matrix for the forget gate, and b_f is the bias. The sigmoid output f_t ∈ (0, 1)^n is then multiplied element-wise with C_{t-1} during the cell state update.",
            "这里 [h_{t-1}, x_t] 表示上一个隐藏状态和当前输入的拼接。W_f 是遗忘门的可学习权重矩阵，b_f 是偏置。sigmoid 输出 f_t ∈ (0, 1)^n 随后在细胞状态更新中与 C_{t-1} 逐元素相乘。"
          )}
        </p>

        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-rose-900 dark:text-rose-200 mb-0">
            <span className="font-semibold">{t("Example — gender tracking: ", "示例 —— 性别追踪：")}</span>
            {t(
              "In a language model generating \"She went to the store. She bought...\" — when the model encounters a new subject pronoun, the forget gate should fire to erase the gender stored in the cell state from the previous subject, making room for the new subject's gender.",
              "在语言模型生成「She went to the store. She bought...」时 —— 当模型遇到新主语代词时，遗忘门应当触发，擦除细胞状态中上一个主语存储的性别信息，为新主语的性别腾出空间。"
            )}
          </p>
        </div>

        <Collapsible title={t("Why sigmoid? Why not a hard 0/1 gate?", "为什么用 sigmoid？为什么不用硬性的 0/1 门？")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Hard gates (step functions) have zero gradient almost everywhere, making them untrainable via backpropagation. The sigmoid function provides a smooth, differentiable approximation that allows gradients to flow during training. The network learns to make its gate outputs close to 0 or 1 in practice, achieving near-binary behavior while remaining trainable.",
                "硬性门（阶跃函数）几乎处处梯度为零，无法通过反向传播训练。sigmoid 函数提供了平滑可微的近似，允许梯度在训练中流动。网络在实践中学会让门输出接近 0 或 1，在保持可训练性的同时实现近似二元行为。"
              )}
            </p>
            <p>
              {t(
                "Additionally, a soft gate allows partial forgetting — the gate can output 0.5 to keep half the information, which is sometimes the right behavior when the relevance of stored information is uncertain.",
                "此外，软门允许部分遗忘 —— 门可以输出 0.5 以保留一半信息，当所存储信息的相关性不确定时，这有时是正确的行为。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ 4. Input Gate and Candidate Values ============ */}
        <h2>{t("4. Input Gate and Candidate Values", "4. 输入门与候选值")}</h2>

        <p>
          {t(
            "Next, the LSTM decides what new information to write into the cell state. This involves two parallel operations: the input gate i_t (how much to write) and the candidate layer C̃_t (what values to write).",
            "接下来，LSTM 决定将什么新信息写入细胞状态。这涉及两个并行操作：输入门 i_t（写入多少）和候选层 C̃_t（写入什么值）。"
          )}
        </p>

        <Math
          display
          label={t("Input gate", "输入门")}
          tex="i_t = \sigma(W_i \cdot [h_{t-1},\, x_t] + b_i)"
        />

        <Math
          display
          label={t("Candidate values", "候选值")}
          tex="\tilde{C}_t = \tanh(W_C \cdot [h_{t-1},\, x_t] + b_C)"
        />

        <p>
          {t(
            "The input gate i_t is a sigmoid (values in [0, 1]) that decides which dimensions of the candidate are worth writing. The candidate C̃_t is a tanh layer (values in [−1, 1]) that proposes new values to add to the cell state. Together they determine the update: i_t ⊙ C̃_t.",
            "输入门 i_t 是一个 sigmoid（值在 [0, 1]），决定候选中哪些维度值得写入。候选值 C̃_t 是一个 tanh 层（值在 [−1, 1]），提议要添加到细胞状态的新值。两者共同决定更新量：i_t ⊙ C̃_t。"
          )}
        </p>

        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-900 dark:text-green-200 mb-0">
            <span className="font-semibold">{t("Example — subject tracking: ", "示例 —— 主语追踪：")}</span>
            {t(
              "When the model reads a new noun phrase \"the cats\" that could serve as the subject of an upcoming verb, the input gate opens to write the plurality and gender of \"cats\" into the cell state. The candidate layer proposes the actual encoded values, and the input gate decides how strongly to write them.",
              "当模型读到可能作为即将出现的动词主语的名词短语「the cats」时，输入门打开，将「cats」的复数形式和性别写入细胞状态。候选层提议实际编码的值，输入门决定写入的强度。"
            )}
          </p>
        </div>

        {/* ============ 5. Cell State Update ============ */}
        <h2>{t("5. Cell State Update", "5. 细胞状态更新")}</h2>

        <p>
          {t(
            "With the forget gate and input+candidate computed, the cell state is updated by combining them:",
            "计算出遗忘门和输入门+候选值后，细胞状态通过组合它们来更新："
          )}
        </p>

        <Math
          display
          label={t("Cell state update", "细胞状态更新")}
          tex="C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t"
        />

        <p>
          {t(
            "This is the heart of the LSTM. The old cell state C_{t-1} is selectively erased by multiplying with f_t, then new information i_t ⊙ C̃_t is added in. The operation is purely additive (after the forget scaling) — no tanh squashing, no weight matrix multiplication.",
            "这是 LSTM 的核心。旧细胞状态 C_{t-1} 通过与 f_t 相乘被选择性地擦除，然后加入新信息 i_t ⊙ C̃_t。该操作（在遗忘缩放之后）是纯加性的 —— 没有 tanh 压缩，没有权重矩阵乘法。"
          )}
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900 dark:text-blue-200 mb-2 font-semibold">
            {t("Why addition prevents vanishing gradients:", "为什么加法能防止梯度消失：")}
          </p>
          <p className="text-sm text-blue-900 dark:text-blue-200 mb-0">
            {t(
              "The gradient of C_t with respect to C_{t-1} is simply f_t. As long as the forget gate stays open (f_t ≈ 1), gradients flow through the cell state unchanged across many timesteps. This is analogous to ResNet's skip connections — the additive path creates a gradient highway through time.",
              "C_t 对 C_{t-1} 的梯度恰好是 f_t。只要遗忘门保持打开（f_t ≈ 1），梯度就可以在多个时间步中不变地流过细胞状态。这类似于 ResNet 的跳跃连接 —— 加性路径在时间维度上创造了一条梯度高速公路。"
            )}
          </p>
        </div>

        <Collapsible title={t("Interpreting the cell state update element-by-element", "逐元素解释细胞状态更新")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "Each of the n dimensions of the cell state is an independent memory slot. For dimension j at timestep t:",
                "细胞状态的 n 个维度中，每个都是独立的记忆槽。对于时间步 t 的第 j 个维度："
              )}
            </p>
            <ul className="list-disc list-inside space-y-2 text-paper-700 dark:text-slate-300">
              <li>
                {t(
                  "If f_t[j] ≈ 0 and i_t[j] ≈ 0 → the slot is cleared and nothing is written. The information is erased.",
                  "若 f_t[j] ≈ 0 且 i_t[j] ≈ 0 → 该槽被清空且不写入任何内容。信息被擦除。"
                )}
              </li>
              <li>
                {t(
                  "If f_t[j] ≈ 1 and i_t[j] ≈ 0 → the slot retains its old value. The information is preserved unchanged.",
                  "若 f_t[j] ≈ 1 且 i_t[j] ≈ 0 → 该槽保留旧值。信息原封不动地保留。"
                )}
              </li>
              <li>
                {t(
                  "If f_t[j] ≈ 0 and i_t[j] ≈ 1 → the slot is overwritten with the new candidate value. Complete replacement.",
                  "若 f_t[j] ≈ 0 且 i_t[j] ≈ 1 → 该槽被新候选值覆盖。完全替换。"
                )}
              </li>
              <li>
                {t(
                  "If f_t[j] ≈ 1 and i_t[j] ≈ 1 → the slot accumulates both old and new values. Additive update.",
                  "若 f_t[j] ≈ 1 且 i_t[j] ≈ 1 → 该槽累积旧值和新值。加性更新。"
                )}
              </li>
            </ul>
          </div>
        </Collapsible>

        {/* ============ 6. Output Gate ============ */}
        <h2>{t("6. Output Gate", "6. 输出门")}</h2>

        <p>
          {t(
            "Finally, the LSTM decides what to output from the cell state to the hidden state h_t. The output is a filtered, compressed version of the cell state — not everything stored is relevant to the current prediction.",
            "最后，LSTM 决定从细胞状态向隐藏状态 h_t 输出什么。输出是细胞状态的过滤压缩版本 —— 并非所有存储的内容都与当前预测相关。"
          )}
        </p>

        <Math
          display
          label={t("Output gate", "输出门")}
          tex="o_t = \sigma(W_o \cdot [h_{t-1},\, x_t] + b_o)"
        />

        <Math
          display
          label={t("Hidden state output", "隐藏状态输出")}
          tex="h_t = o_t \odot \tanh(C_t)"
        />

        <p>
          {t(
            "The output gate o_t is another sigmoid that decides which parts of the cell state to expose. The cell state C_t is first squashed through tanh (to bring values into [−1, 1]), then multiplied by o_t. The result h_t is the hidden state passed to the next timestep and used for predictions.",
            "输出门 o_t 是另一个 sigmoid，决定暴露细胞状态的哪些部分。细胞状态 C_t 首先通过 tanh 压缩（将值带入 [−1, 1]），然后与 o_t 相乘。结果 h_t 是传递到下一个时间步并用于预测的隐藏状态。"
          )}
        </p>

        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-purple-900 dark:text-purple-200 mb-0">
            <span className="font-semibold">{t("Example — verb output: ", "示例 —— 动词输出：")}</span>
            {t(
              "If the cell state has stored that the current subject is plural, the output gate can expose this information when the model needs to decide the form of an upcoming verb (\"are\" vs. \"is\"). Other stored information (e.g., the topic of conversation) may remain in the cell state but be gated out of h_t if it is not relevant to the immediate prediction.",
              "如果细胞状态存储了当前主语是复数，当模型需要决定即将出现的动词形式（「are」还是「is」）时，输出门可以暴露这一信息。其他存储信息（例如对话话题）可能仍留在细胞状态中，但如果与当前预测不相关，则被门控挡在 h_t 之外。"
            )}
          </p>
        </div>

        {/* ============ 7. Concrete Example ============ */}
        <h2>{t("7. Concrete Example: Tracking Subject in a Sentence", "7. 具体示例：追踪句子中的主语")}</h2>

        <p>
          {t(
            "Let us walk through how an LSTM would handle the sentence: \"The clouds in the sky are beautiful.\" A language model processing this sentence needs to predict \"are\" (not \"is\") because the subject \"clouds\" is plural.",
            "让我们逐步了解 LSTM 如何处理句子：「The clouds in the sky are beautiful.」处理这个句子的语言模型需要预测「are」而非「is」，因为主语「clouds」是复数。"
          )}
        </p>

        <div className="space-y-4 mb-8">
          {[
            {
              step: t("Step 1: Read \"The\"", "步骤 1：读取「The」"),
              body: t(
                "An article is detected. The input gate may weakly activate some dimensions to indicate that a noun phrase is starting. The cell state barely changes.",
                "检测到冠词。输入门可能弱激活某些维度以表示名词短语开始。细胞状态几乎不变。"
              ),
              color: "gray",
            },
            {
              step: t("Step 2: Read \"clouds\"", "步骤 2：读取「clouds」"),
              body: t(
                "A plural noun is detected. The input gate opens strongly for the \"subject plurality\" dimension. The candidate layer proposes a high value for \"plural\". This is written into the cell state: C_t[plurality] ← 1.",
                "检测到复数名词。输入门在「主语数量」维度上强力打开。候选层为「复数」维度提议高值。将其写入细胞状态：C_t[数量] ← 1（复数）。"
              ),
              color: "blue",
            },
            {
              step: t("Step 3: Read \"in\", \"the\", \"sky\"", "步骤 3：读取「in」、「the」、「sky」"),
              body: t(
                "Prepositional phrase. The forget gate keeps f_t[plurality] ≈ 1 — the plurality information is preserved unchanged across these three timesteps. The conveyor belt carries the information forward.",
                "介词短语。遗忘门在这三个时间步中保持 f_t[数量] ≈ 1 —— 数量信息原封不动地保留。传送带将信息向前传递。"
              ),
              color: "green",
            },
            {
              step: t("Step 4: Predict \"are\"", "步骤 4：预测「are」"),
              body: t(
                "The output gate opens for the \"subject plurality\" dimension. h_t reflects that the subject is plural, which drives the softmax to assign high probability to \"are\" over \"is\".",
                "输出门在「主语数量」维度上打开。h_t 反映主语为复数，这驱动 softmax 将高概率分配给「are」而非「is」。"
              ),
              color: "purple",
            },
          ].map(({ step, body, color }) => (
            <div
              key={step}
              className={`border-l-4 pl-4 py-2 ${
                color === "gray"
                  ? "border-paper-300 dark:border-slate-600"
                  : color === "blue"
                  ? "border-blue-400 dark:border-blue-600"
                  : color === "green"
                  ? "border-green-400 dark:border-green-600"
                  : "border-purple-400 dark:border-purple-600"
              }`}
            >
              <p className="font-semibold text-sm mb-1">{step}</p>
              <p className="text-sm text-paper-700 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>

        <p>
          {t(
            "This example illustrates the power of the cell state: the plurality of \"clouds\" must survive 3 intervening tokens with no grammatical reinforcement. A vanilla RNN would have difficulty; an LSTM handles it naturally by keeping the forget gate open for the relevant memory slot.",
            "这个例子说明了细胞状态的强大：「clouds」的复数形式必须在 3 个插入词元中没有语法强化的情况下存活。普通 RNN 会难以应对；LSTM 通过保持相关记忆槽的遗忘门打开来自然地处理这一问题。"
          )}
        </p>

        <Collapsible title={t("Complete equations summary at a glance", "完整方程一览")}>
          <div className="text-sm space-y-2">
            <p className="font-semibold text-paper-700 dark:text-slate-300 mb-3">
              {t("All six LSTM equations in order of execution:", "按执行顺序列出的全部六个 LSTM 方程：")}
            </p>
            <Math
              display
              label={t("① Forget gate", "① 遗忘门")}
              tex="f_t = \sigma(W_f \cdot [h_{t-1},\, x_t] + b_f)"
            />
            <Math
              display
              label={t("② Input gate", "② 输入门")}
              tex="i_t = \sigma(W_i \cdot [h_{t-1},\, x_t] + b_i)"
            />
            <Math
              display
              label={t("③ Candidate values", "③ 候选值")}
              tex="\tilde{C}_t = \tanh(W_C \cdot [h_{t-1},\, x_t] + b_C)"
            />
            <Math
              display
              label={t("④ Cell state update", "④ 细胞状态更新")}
              tex="C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t"
            />
            <Math
              display
              label={t("⑤ Output gate", "⑤ 输出门")}
              tex="o_t = \sigma(W_o \cdot [h_{t-1},\, x_t] + b_o)"
            />
            <Math
              display
              label={t("⑥ Hidden state", "⑥ 隐藏状态")}
              tex="h_t = o_t \odot \tanh(C_t)"
            />
          </div>
        </Collapsible>

        {/* ============ 8. GRU ============ */}
        <h2>{t("8. GRU: The Simplified Version", "8. GRU：简化版本")}</h2>

        <p>
          {t(
            "The Gated Recurrent Unit (GRU), introduced by Cho et al. (2014), is a streamlined variant of the LSTM. It makes two simplifications: (1) it merges the cell state and hidden state into a single h_t, and (2) it uses only two gates — a reset gate r_t and an update gate z_t — instead of LSTM's three.",
            "门控循环单元（GRU）由 Cho 等人（2014）提出，是 LSTM 的简化变体。它做了两个简化：（1）将细胞状态和隐藏状态合并为单一的 h_t；（2）仅使用两个门 —— 重置门 r_t 和更新门 z_t —— 而不是 LSTM 的三个门。"
          )}
        </p>

        <Math
          display
          label={t("Update gate", "更新门")}
          tex="z_t = \sigma(W_z [h_{t-1},\, x_t])"
        />

        <Math
          display
          label={t("Reset gate", "重置门")}
          tex="r_t = \sigma(W_r [h_{t-1},\, x_t])"
        />

        <Math
          display
          label={t("Candidate hidden state", "候选隐藏状态")}
          tex="\tilde{h}_t = \tanh(W [r_t \odot h_{t-1},\, x_t])"
        />

        <Math
          display
          label={t("GRU hidden state update", "GRU 隐藏状态更新")}
          tex="h_t = (1 - z_t) \odot h_{t-1} + z_t \odot \tilde{h}_t"
        />

        <p>
          {t(
            "The update gate z_t plays the combined role of the LSTM's forget and input gates. When z_t ≈ 1, the new candidate h̃_t mostly replaces the old state (like a high input gate and zero forget gate). When z_t ≈ 0, the old state is mostly preserved (like a high forget gate and zero input gate).",
            "更新门 z_t 扮演 LSTM 遗忘门和输入门的组合角色。当 z_t ≈ 1 时，新候选 h̃_t 基本替换旧状态（类似高输入门和零遗忘门）。当 z_t ≈ 0 时，旧状态基本保留（类似高遗忘门和零输入门）。"
          )}
        </p>

        <p>
          {t(
            "The reset gate r_t controls how much of the previous hidden state is used when computing the candidate. When r_t ≈ 0, the candidate is computed almost entirely from the input x_t, effectively resetting the memory. When r_t ≈ 1, the candidate uses the full previous state, allowing it to track long-term dependencies.",
            "重置门 r_t 控制计算候选时使用多少上一个隐藏状态。当 r_t ≈ 0 时，候选几乎完全由输入 x_t 计算，相当于重置记忆。当 r_t ≈ 1 时，候选使用完整的上一个状态，允许追踪长距离依赖。"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-slate-800">
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  {t("Property", "特性")}
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  LSTM
                </th>
                <th className="border border-paper-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">
                  GRU
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  t("States", "状态数"),
                  t("Two: C_t (cell) + h_t (hidden)", "两个：C_t（细胞）+ h_t（隐藏）"),
                  t("One: h_t only", "一个：仅 h_t"),
                ],
                [
                  t("Gates", "门数"),
                  t("Three: forget, input, output", "三个：遗忘、输入、输出"),
                  t("Two: update, reset", "两个：更新、重置"),
                ],
                [
                  t("Parameters", "参数量"),
                  t("More (4 × hidden_size × input_size)", "更多（4 × 隐藏维度 × 输入维度）"),
                  t("Fewer (3 × hidden_size × input_size)", "更少（3 × 隐藏维度 × 输入维度）"),
                ],
                [
                  t("Training speed", "训练速度"),
                  t("Slower per step", "每步较慢"),
                  t("Faster per step", "每步较快"),
                ],
                [
                  t("Performance", "性能"),
                  t("Slightly better on very long sequences", "在超长序列上略优"),
                  t("Often competitive, sometimes better", "通常具有竞争力，有时更好"),
                ],
              ].map((row) => (
                <tr
                  key={row[0]}
                  className="odd:bg-white dark:odd:bg-transparent even:bg-paper-50 dark:even:bg-slate-900/30"
                >
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`border border-paper-200 dark:border-slate-700 px-3 py-2 ${i === 0 ? "font-semibold" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Collapsible title={t("How does the GRU update gate unify forget and input?", "GRU 的更新门如何统一遗忘和输入？")}>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "In the LSTM, the forget gate f_t and input gate i_t are independent: theoretically, f_t and i_t could both be 1 simultaneously (accumulating both old and new information). In the GRU, the update gate forces a hard tradeoff: the coefficient of h_{t-1} is (1 − z_t) and the coefficient of h̃_t is z_t. They always sum to 1.",
                "在 LSTM 中，遗忘门 f_t 和输入门 i_t 是独立的：理论上 f_t 和 i_t 可以同时为 1（累积旧信息和新信息）。在 GRU 中，更新门强制进行权衡：h_{t-1} 的系数是 (1 − z_t)，h̃_t 的系数是 z_t，它们之和始终为 1。"
              )}
            </p>
            <p>
              {t(
                "This means the GRU must choose between remembering the past and incorporating new information — it cannot do both simultaneously. This constraint acts as a useful inductive bias for many sequence tasks, but can be a limitation for tasks requiring both.",
                "这意味着 GRU 必须在记住过去和融入新信息之间做出选择 —— 两者不能同时进行。这个约束对许多序列任务来说是有用的归纳偏置，但对同时需要两者的任务可能是限制。"
              )}
            </p>
          </div>
        </Collapsible>

        {/* ============ 9. Why LSTMs Dominated ============ */}
        <h2>{t("9. Why LSTMs Dominated 2015–2017", "9. 为何 LSTM 主导了 2015–2017 年")}</h2>

        <p>
          {t(
            "In the years following Colah's blog post, LSTMs became the default architecture for virtually every sequence modeling task: language modeling, machine translation, speech recognition, sentiment analysis, and time series forecasting. Several factors made them dominant.",
            "在 Colah 博文发表之后的几年里，LSTM 成为几乎所有序列建模任务的默认架构：语言建模、机器翻译、语音识别、情感分析和时间序列预测。几个因素使它们占据主导地位。"
          )}
        </p>

        <div className="space-y-4 mb-8">
          {[
            {
              title: t("The additive update solves vanishing gradients", "加性更新解决梯度消失"),
              body: t(
                "The key equation C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t creates an additive path through time. The gradient ∂C_t/∂C_{t-1} = f_t can remain close to 1 across hundreds of timesteps, enabling the model to learn dependencies over sequences of length 100–1000 — something completely out of reach for vanilla RNNs.",
                "关键方程 C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t 在时间维度上创造了一条加性路径。梯度 ∂C_t/∂C_{t-1} = f_t 可以在数百个时间步中保持接近 1，使模型能够学习长度 100–1000 序列上的依赖关系 —— 这对普通 RNN 来说完全无法实现。"
              ),
              color: "blue",
            },
            {
              title: t("Gating provides expressive memory management", "门控提供富有表现力的记忆管理"),
              body: t(
                "The three gates give the network fine-grained control: forget specific information, write specific new information, and read selectively. This expressiveness allows a single LSTM layer to simultaneously track multiple pieces of state — subject, tense, topic, and more.",
                "三个门赋予网络精细控制：遗忘特定信息，写入特定新信息，以及选择性读取。这种表达能力允许单层 LSTM 同时追踪多个状态 —— 主语、时态、话题等。"
              ),
              color: "green",
            },
            {
              title: t("Empirical success across many domains", "在多个领域的实证成功"),
              body: t(
                "LSTMs achieved state-of-the-art on machine translation (seq2seq with attention, Bahdanau et al. 2015), language modeling (Zaremba et al. 2014), and speech recognition (Graves et al. 2013). The consistency of these results across very different tasks gave practitioners confidence in the architecture.",
                "LSTM 在机器翻译（带注意力机制的 seq2seq，Bahdanau 等人 2015）、语言建模（Zaremba 等人 2014）和语音识别（Graves 等人 2013）上达到了最先进水平。这些结果在非常不同任务上的一致性使从业者对该架构充满信心。"
              ),
              color: "purple",
            },
            {
              title: t("Practical trainability", "实用的可训练性"),
              body: t(
                "LSTMs are stable to train with standard gradient descent + gradient clipping, unlike vanilla RNNs which require careful initialization and learning rate tuning to avoid gradient explosion. This practical reliability made them the default choice.",
                "LSTM 使用标准梯度下降 + 梯度裁剪训练稳定，不像普通 RNN 需要仔细的初始化和学习率调整以避免梯度爆炸。这种实用可靠性使它们成为默认选择。"
              ),
              color: "amber",
            },
            {
              title: t("Why Transformers eventually replaced LSTMs", "为何 Transformer 最终取代了 LSTM"),
              body: t(
                "LSTMs are inherently sequential — h_t depends on h_{t-1}, so you cannot parallelize across timesteps during training. Transformers, introduced in 2017, process all positions in parallel via self-attention, enabling much faster training on GPUs/TPUs and scaling to far larger datasets and models. For tasks with very long contexts (>1000 tokens), Transformers also generally outperform LSTMs.",
                "LSTM 本质上是顺序的 —— h_t 依赖 h_{t-1}，因此在训练时无法跨时间步并行化。2017 年引入的 Transformer 通过自注意力机制并行处理所有位置，在 GPU/TPU 上训练速度更快，并可扩展到更大的数据集和模型。对于上下文很长（>1000 个词元）的任务，Transformer 通常也优于 LSTM。"
              ),
              color: "rose",
            },
          ].map(({ title, body, color }) => (
            <div
              key={title}
              className={`border-l-4 pl-4 py-2 ${
                color === "blue"
                  ? "border-blue-400 dark:border-blue-600"
                  : color === "green"
                  ? "border-green-400 dark:border-green-600"
                  : color === "purple"
                  ? "border-purple-400 dark:border-purple-600"
                  : color === "amber"
                  ? "border-amber-400 dark:border-amber-600"
                  : "border-rose-400 dark:border-rose-600"
              }`}
            >
              <p className="font-semibold text-sm mb-1">{title}</p>
              <p className="text-sm text-paper-700 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>

        <Collapsible title={t("LSTM variants: peephole connections and coupled gates", "LSTM 变体：窥视孔连接与耦合门")}>
          <div className="text-sm space-y-4">
            <div>
              <p className="font-semibold mb-2">{t("Peephole connections (Gers & Schmidhuber, 2000)", "窥视孔连接（Gers & Schmidhuber，2000）")}</p>
              <p>
                {t(
                  "Standard LSTM gates only look at h_{t-1} and x_t. Peephole connections additionally let the gates see the cell state C_{t-1} directly:",
                  "标准 LSTM 门只查看 h_{t-1} 和 x_t。窥视孔连接还允许门直接看到细胞状态 C_{t-1}："
                )}
              </p>
              <Math
                display
                tex="f_t = \sigma(W_f \cdot [C_{t-1},\, h_{t-1},\, x_t] + b_f)"
              />
              <p>
                {t(
                  "This gives gates direct access to what is stored in memory, rather than only seeing the filtered output h_{t-1}. Useful when precise timing of gate activations matters.",
                  "这给门提供了对记忆中存储内容的直接访问，而不仅仅是看到过滤后的输出 h_{t-1}。当门激活的精确时机很重要时很有用。"
                )}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">{t("Coupled forget-input gates", "耦合遗忘-输入门")}</p>
              <p>
                {t(
                  "Instead of independent f_t and i_t, some variants enforce i_t = 1 − f_t, making the cell state update:",
                  "一些变体不使用独立的 f_t 和 i_t，而是强制 i_t = 1 − f_t，使细胞状态更新为："
                )}
              </p>
              <Math
                display
                tex="C_t = f_t \odot C_{t-1} + (1 - f_t) \odot \tilde{C}_t"
              />
              <p>
                {t(
                  "This mirrors the GRU's update gate logic and reduces parameters. The model forgets exactly as much as it wants to learn — a compelling inductive bias.",
                  "这与 GRU 的更新门逻辑相似，减少了参数。模型遗忘的恰好与它想学的一样多 —— 一个引人注目的归纳偏置。"
                )}
              </p>
            </div>
          </div>
        </Collapsible>

        {/* Further reading */}
        <div className="bg-paper-50 dark:bg-slate-900/40 border border-paper-200 dark:border-slate-700 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold mb-3">{t("Further Reading", "延伸阅读")}</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a
                href="https://colah.github.io/posts/2015-08-Understanding-LSTMs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Olah (2015) — Understanding LSTM Networks
              </a>
              <span className="text-paper-500 dark:text-slate-400 ml-2">
                {t("(the original blog post)", "（原始博文）")}
              </span>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/1409.3215"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Sutskever et al. 2014 — Sequence to Sequence Learning with Neural Networks
              </a>
              <span className="text-paper-500 dark:text-slate-400 ml-2">
                {t("(LSTM-based seq2seq, founded neural MT)", "（基于 LSTM 的 seq2seq，开创神经机器翻译）")}
              </span>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/1406.1078"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Cho et al. 2014 — Learning Phrase Representations using RNN Encoder-Decoder
              </a>
              <span className="text-paper-500 dark:text-slate-400 ml-2">
                {t("(introduced the GRU)", "（提出了 GRU）")}
              </span>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/1409.0473"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Bahdanau et al. 2015 — Neural Machine Translation by Jointly Learning to Align and Translate
              </a>
              <span className="text-paper-500 dark:text-slate-400 ml-2">
                {t("(attention + LSTM, precursor to Transformers)", "（注意力 + LSTM，Transformer 的前身）")}
              </span>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/1706.03762"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Vaswani et al. 2017 — Attention Is All You Need
              </a>
              <span className="text-paper-500 dark:text-slate-400 ml-2">
                {t("(the Transformer, which largely replaced LSTMs)", "（Transformer，基本取代了 LSTM）")}
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-16 pt-8 border-t border-paper-200 dark:border-slate-700">
          <Link
            href={`${basePath}/`}
            className="text-blue-600 hover:underline text-sm"
          >
            ← {t("Back to all papers", "返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
