"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { FlowChart } from "@/components/FlowChart";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function DeepSpeech2Page() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Deep Speech 2: End-to-End Speech Recognition in English and Mandarin",
            "Deep Speech 2：英语和普通话的端到端语音识别"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-paper-200/50">
          Amodei et al. &middot; Baidu Research &middot; ICML 2016 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1512.02595"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1512.02595
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed mb-0">
            {t(
              "Deep Speech 2 is an end-to-end speech recognition system that takes raw audio (or log-mel spectrograms) directly to text — no hand-crafted phonemes or linguistic features required. It combines convolutional layers, bidirectional RNNs, and CTC loss into a single differentiable pipeline. With large-scale data, batch normalization on RNN inputs, speed-perturbation augmentation, and SortaGrad training, DS2 achieves 3.67% WER on clean LibriSpeech — surpassing human performance (5.83%) — and also works for Mandarin character-level output.",
              "Deep Speech 2 是一个端到端语音识别系统，直接将原始音频（或对数梅尔频谱图）转化为文字，无需手工设计的音素或语言学特征。它将卷积层、双向 RNN 和 CTC 损失整合为一个可微分的流程。通过大规模数据、对 RNN 输入应用批归一化、速度扰动增强和 SortaGrad 训练策略，DS2 在 LibriSpeech 干净测试集上达到 3.67% 的词错误率，超越人类水平（5.83%），并同样适用于普通话字符级输出。"
            )}
          </p>
        </section>

        {/* FlowChart */}
        <FlowChart
          title={t("Deep Speech 2 Pipeline Overview", "Deep Speech 2 流程总览")}
          steps={[
            {
              title: t(
                "Input: Raw audio waveform → log-mel spectrogram S(f,t)",
                "输入：原始音频波形 → 对数梅尔频谱图 S(f,t)"
              ),
              subtitle: t(
                "No hand-crafted features — the network learns what matters",
                "无手工特征 — 网络自主学习有用特征"
              ),
              color: "amber",
            },
            {
              title: t(
                "2–3 CNN layers: capture local spectro-temporal patterns",
                "2–3 个卷积层：捕捉局部频谱-时间模式"
              ),
              subtitle: t("Filters slide over frequency × time", "滤波器在频率×时间维度上滑动"),
              color: "blue",
            },
            {
              title: t(
                "5–7 Bidirectional RNN layers (GRU): model long-range dependencies",
                "5–7 个双向 RNN 层（GRU）：建模长程依赖"
              ),
              subtitle: t(
                "Batch normalization applied to RNN inputs at each layer",
                "在每层 RNN 输入处应用批归一化"
              ),
              color: "teal",
              children: [
                {
                  title: t("Forward RNN: left → right context", "前向 RNN：从左到右的上下文"),
                  color: "gray",
                },
                {
                  title: t("Backward RNN: right → left context", "后向 RNN：从右到左的上下文"),
                  color: "gray",
                },
              ],
            },
            {
              title: t(
                "Fully-connected layer + softmax over characters (or Mandarin chars)",
                "全连接层 + 字符（或汉字）softmax"
              ),
              color: "purple",
            },
            {
              title: t(
                "CTC loss: trains without explicit alignment labels",
                "CTC 损失：无需显式对齐标注即可训练"
              ),
              subtitle: t(
                "Sums over all valid alignments via forward-backward algorithm",
                "通过前向-后向算法对所有合法对齐路径求和"
              ),
              color: "rose",
            },
            {
              title: t(
                "Result: 3.67% WER on LibriSpeech clean (human: 5.83%)",
                "结果：LibriSpeech 干净集 WER 3.67%（人类：5.83%）"
              ),
              color: "green",
            },
          ]}
          arrows={[
            t("Feature extraction", "特征提取"),
            t("Local pattern encoding", "局部模式编码"),
            t("Sequence modeling", "序列建模"),
            t("Character probabilities", "字符概率"),
            t("Training signal", "训练信号"),
          ]}
          highlights={[
            {
              text: t("No hand-engineered features", "无手工特征"),
              color: "amber",
            },
            {
              text: t("Surpasses human WER on LibriSpeech", "超越人类词错误率"),
              color: "green",
            },
            {
              text: t("Works for both English and Mandarin", "同时支持英语和普通话"),
              color: "blue",
            },
          ]}
        />

        {/* Section 1 */}
        <h2>{t("1. From Features to End-to-End", "1. 从特征工程到端到端")}</h2>

        <p>
          {t(
            "Traditional ASR pipelines were modular and brittle: a separate acoustic model (GMM-HMM), a pronunciation dictionary, and a language model were trained independently and glued together at inference. Each component required domain expertise — phoneme inventories, forced alignment, N-gram statistics — and errors compounded across modules.",
            "传统的语音识别流程是模块化且脆弱的：声学模型（GMM-HMM）、发音词典和语言模型分别独立训练，在推理时拼接在一起。每个组件都需要领域专业知识——音素库、强制对齐、N-gram 统计——并且各模块的错误会叠加放大。"
          )}
        </p>

        <p>
          {t(
            "Deep Speech 2 replaces this entire pipeline with a single neural network trained end-to-end. The input is a log-mel spectrogram — a 2D representation of power at each frequency band over time:",
            "Deep Speech 2 用一个端到端训练的神经网络替代了整个流程。输入是对数梅尔频谱图——随时间变化的各频带能量的二维表示："
          )}
        </p>

        <Math display tex={"S(f,t) = |\\text{STFT}(x)|^2"} />

        <p>
          {t(
            "where x is the raw waveform, STFT is the Short-Time Fourier Transform, and S(f,t) gives the power at frequency f and time t. The network then learns all subsequent representations directly from this spectrogram — no hand-crafted cepstral features, no phoneme labels, no linguistic rules.",
            "其中 x 是原始波形，STFT 是短时傅里叶变换，S(f,t) 表示在频率 f 和时间 t 处的能量。之后网络直接从频谱图学习所有后续表示——无需手工设计的倒谱特征、无需音素标注、无需语言学规则。"
          )}
        </p>

        <p>
          {t(
            "The key insight is that a sufficiently deep network, trained on enough data, can learn better representations than humans can engineer. The original Deep Speech (2014) demonstrated this for English; DS2 scaled it up — more layers, more data, Mandarin support — and validated the thesis decisively.",
            "关键洞察在于：一个足够深的网络，在足量数据上训练，可以学习到比人类设计更好的表示。最初的 Deep Speech（2014年）在英语上验证了这一点；DS2 进行了更大规模的扩展——更多层、更多数据、支持普通话——并最终决定性地验证了这一论点。"
          )}
        </p>

        {/* Section 2 */}
        <h2>{t("2. Architecture: CNN + RNN + CTC", "2. 架构：CNN + RNN + CTC")}</h2>

        <p>
          {t(
            "The DS2 architecture has three stages. First, 2–3 convolutional layers process the 2D spectrogram. A convolution with kernel spanning a few frequency bins and a few time steps captures local spectro-temporal patterns — for example, formant transitions that characterize vowels or consonant bursts.",
            "DS2 架构分为三个阶段。首先，2–3 个卷积层处理二维频谱图。跨越若干频率区间和时间步的卷积核捕捉局部频谱-时间模式——例如表征元音的共振峰转移或辅音的爆发特征。"
          )}
        </p>

        <p>
          {t(
            "Second, 5–7 bidirectional recurrent layers (using GRUs) model long-range temporal dependencies. Because speech contains long-distance coarticulation — a phoneme at position t can depend on context many frames away — a deep recurrent stack is essential. Bidirectional RNNs see the entire utterance in both directions:",
            "其次，5–7 个双向循环层（使用 GRU）建模长程时间依赖。由于语音中存在长距离协同发音现象——时间步 t 处的音素可能依赖于很多帧之外的上下文——深层循环结构至关重要。双向 RNN 从两个方向观察整个语音："
          )}
        </p>

        <Math display tex={"h_t = \\text{concat}(\\overrightarrow{h}_t,\\, \\overleftarrow{h}_t)"} />

        <p>
          {t(
            "where the forward pass runs left-to-right and the backward pass runs right-to-left over the sequence. The concatenated hidden state at each time step is then passed to the next layer.",
            "其中前向传播从左到右，后向传播从右到左遍历序列。每个时间步的拼接隐藏状态随后传递到下一层。"
          )}
        </p>

        <p>
          {t(
            "Third, a fully-connected layer followed by a softmax projects each time step's hidden state into a probability distribution over the output alphabet — English characters (a–z, space, apostrophe, blank) or Mandarin characters (6000+). CTC loss then trains the network using only the ground-truth transcription, with no alignment information.",
            "第三，一个全连接层加上 softmax 将每个时间步的隐藏状态映射为输出字符表上的概率分布——英语字符（a–z、空格、撇号、空白符）或汉字（6000+ 个）。CTC 损失只使用真实转写文本训练网络，不需要任何对齐信息。"
          )}
        </p>

        {/* Section 3 */}
        <h2>{t("3. CTC: Training Without Alignment", "3. CTC：无需对齐的训练")}</h2>

        <p>
          {t(
            "The central training challenge in ASR is that we know the transcript of an utterance but not which audio frame corresponds to which character. Manually aligning every training example would be expensive. Connectionist Temporal Classification (CTC) solves this elegantly by marginalizing over all possible alignments.",
            "语音识别训练的核心挑战在于：我们知道语音的转写文本，却不知道哪个音频帧对应哪个字符。手动对齐每个训练样本代价高昂。联结主义时序分类（CTC）通过对所有可能的对齐方式求边缘化来优雅地解决这一问题。"
          )}
        </p>

        <p>
          {t(
            "Define a blank symbol ε. An alignment π is a sequence of characters (including ε) of the same length T as the audio frames. A collapse function B maps any alignment to a transcript by: (1) merging consecutive repeated characters, then (2) removing all blanks. For example:",
            "定义一个空白符号 ε。对齐路径 π 是与音频帧等长（T 帧）的字符序列（含 ε）。折叠函数 B 将任意对齐映射为转写：(1) 合并连续重复字符，(2) 删除所有空白符。例如："
          )}
        </p>

        <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded p-3 text-gray-800 dark:text-gray-200">
          {t(
            'B("a a ε b b ε b") = "abb"',
            'B("a a ε b b ε b") = "abb"'
          )}
        </p>

        <p>
          {t(
            "The CTC loss for a training pair (x, l) — audio x, label l — sums the probabilities of all alignments that collapse to l:",
            "对于训练对 (x, l)（音频 x，标签 l），CTC 损失对所有折叠为 l 的对齐路径的概率求和："
          )}
        </p>

        <Math display tex={"\\mathcal{L} = -\\log P(l \\mid x) = -\\log \\sum_{\\pi :\\, \\mathcal{B}(\\pi)=l} \\prod_{t=1}^{T} p(\\pi_t \\mid x)"} />

        <p>
          {t(
            "The number of valid alignments is exponential in T, so computing this sum naively is intractable. CTC uses a forward-backward dynamic programming algorithm to compute the loss and gradients efficiently in O(T·|l|) time.",
            "合法对齐路径的数量随 T 指数增长，因此直接暴力求和是不可行的。CTC 使用前向-后向动态规划算法，以 O(T·|l|) 的时间复杂度高效计算损失和梯度。"
          )}
        </p>

        <Collapsible
          title={t(
            "CTC Forward-Backward Derivation",
            "CTC 前向-后向算法推导"
          )}
        >
          <p>
            {t(
              "Let l' be the label sequence with blanks inserted between and around each character: l' = (ε, l_1, ε, l_2, ε, …, l_S, ε), with |l'| = 2S+1.",
              "设 l' 为在每个字符之间和前后插入空白符后的标签序列：l' = (ε, l_1, ε, l_2, ε, …, l_S, ε)，其中 |l'| = 2S+1。"
            )}
          </p>

          <p>
            {t(
              "Define the forward variable α(t, s) = probability of all paths up to time t that collapse to l'[1:s]:",
              "定义前向变量 α(t, s) 为到时间 t 为止、折叠为 l'[1:s] 的所有路径的概率之和："
            )}
          </p>

          <Math display tex={"\\alpha(t, s) = \\sum_{\\substack{\\pi_{1:t}:\\\\ \\mathcal{B}(\\pi_{1:t}) = l'_{1:s}}} \\prod_{t'=1}^{t} p(\\pi_{t'} \\mid x)"} />

          <p>
            {t(
              "The recurrence allows transitioning from the previous position or skipping a blank (if the current and next non-blank labels differ):",
              "递推关系允许从前一位置转移，或跳过一个空白符（当前与下一个非空白标签不同时）："
            )}
          </p>

          <Math display tex={"\\alpha(t,s) = p(l'_s \\mid x_t) \\cdot \\begin{cases} \\alpha(t-1,s) + \\alpha(t-1,s-1) & \\text{if } l'_s = \\varepsilon \\text{ or } l'_{s-2}=l'_s \\\\ \\alpha(t-1,s) + \\alpha(t-1,s-1) + \\alpha(t-1,s-2) & \\text{otherwise} \\end{cases}"} />

          <p>
            {t(
              "Similarly define the backward variable β(t, s). The total probability is:",
              "类似地定义后向变量 β(t, s)。总概率为："
            )}
          </p>

          <Math display tex={"P(l \\mid x) = \\alpha(T, |l'|) + \\alpha(T, |l'|-1)"} />

          <p>
            {t(
              "Gradients are computed as ∂L/∂p(k|x_t) = -Σ_s [α(t,s)β(t,s)] / [P(l|x) · p(l'_s|x_t)²] for positions s where l'_s = k. The full backward pass runs in O(T·S) time — linear in both sequence length and label length.",
              "梯度计算为 ∂L/∂p(k|x_t) = -Σ_s [α(t,s)β(t,s)] / [P(l|x) · p(l'_s|x_t)²]，对满足 l'_s = k 的位置 s 求和。完整的反向传播在 O(T·S) 时间内完成——与序列长度和标签长度均线性相关。"
            )}
          </p>
        </Collapsible>

        <p>
          {t(
            "At inference, a beam search decoder finds the most likely transcript. A language model can optionally rescore the beam hypotheses to improve fluency, but the acoustic model alone already achieves strong results.",
            "在推理时，集束搜索解码器寻找最可能的转写文本。可选地，语言模型可以对集束假设重新打分以提高流畅度，但仅凭声学模型本身已能取得强劲效果。"
          )}
        </p>

        {/* Section 4 */}
        <h2>{t("4. Batch Normalization for RNNs", "4. 对 RNN 的批归一化")}</h2>

        <p>
          {t(
            "Batch normalization (BatchNorm) had been highly effective for convolutional networks by normalizing activations to zero mean and unit variance during training, reducing internal covariate shift. Applying it to recurrent networks was non-obvious — the hidden state evolves over time and across layers, making a naive application unstable.",
            "批归一化（BatchNorm）通过在训练期间将激活归一化为零均值和单位方差，有效减少了内部协变量偏移，在卷积网络中效果显著。将其应用于循环网络则并非显而易见——隐藏状态随时间和层次演变，直接应用可能导致不稳定。"
          )}
        </p>

        <p>
          {t(
            "DS2's key insight: apply BatchNorm only to the input of each RNN layer (the affine transformation of the previous layer's output), not to the recurrent connections. This stabilizes training without disrupting the temporal dynamics of the recurrence. Concretely, if h_prev is the output of the previous RNN layer at time t, the input to the next layer is normalized before being fed to the GRU gates:",
            "DS2 的关键洞察：只对每个 RNN 层的输入（前一层输出的仿射变换）应用批归一化，而不对循环连接应用。这在不破坏递归时序动态的同时稳定了训练。具体而言，如果 h_prev 是前一个 RNN 层在时间 t 的输出，则在送入 GRU 门控之前先对输入进行归一化："
          )}
        </p>

        <Math display tex={"\\tilde{h} = \\text{BN}(W \\cdot h_{\\text{prev}}) = \\gamma \\cdot \\frac{W h_{\\text{prev}} - \\mu_B}{\\sigma_B} + \\beta"} />

        <p>
          {t(
            "where γ and β are learned scale and shift parameters, and μ_B, σ_B are the batch statistics. This was unusual at the time — most practitioners applied BatchNorm only to feedforward layers. The paper showed it gives consistent gains in both training speed and final accuracy, and became a standard technique for deep RNN training.",
            "其中 γ 和 β 是可学习的缩放和平移参数，μ_B、σ_B 是批次统计量。这在当时非同寻常——大多数从业者只在前馈层使用批归一化。论文表明，该方法在训练速度和最终精度上均带来稳定提升，并成为深层 RNN 训练的标准技术。"
          )}
        </p>

        {/* Section 5 */}
        <h2>{t("5. Data Augmentation at Scale", "5. 大规模数据增强")}</h2>

        <p>
          {t(
            "DS2 trains on thousands of hours of labeled speech. But data augmentation is still critical to prevent overfitting and improve robustness to real-world variation.",
            "DS2 在数千小时的标注语音上训练。但数据增强对于防止过拟合和提高对真实世界变化的鲁棒性仍然至关重要。"
          )}
        </p>

        <p>
          {t(
            "Speed perturbation: each audio clip is randomly resampled at 0.9×, 1.0×, or 1.1× speed. This is applied on the raw waveform before computing the spectrogram. At 0.9× speed, the audio stretches out in time; at 1.1×, it compresses. The character sequence stays the same, but the temporal distribution of phonemes shifts — effectively creating three versions of every training example.",
            "速度扰动：每段音频随机以 0.9×、1.0× 或 1.1× 的速度重采样，在计算频谱图之前应用于原始波形。以 0.9× 速度时，音频在时间上拉伸；以 1.1× 速度时则压缩。字符序列保持不变，但音素的时间分布发生变化——等效于为每个训练样本生成三个版本。"
          )}
        </p>

        <p>
          {t(
            "Noise injection: background noise from a separate noise dataset is additively mixed with the speech signal at various SNR levels. This forces the model to learn speech-specific patterns rather than memorizing the acoustic signature of studio-quality recordings.",
            "噪声注入：来自独立噪声数据集的背景噪声以不同信噪比叠加混入语音信号中。这迫使模型学习语音特有的模式，而不是记忆录音室质量录音的声学特征。"
          )}
        </p>

        <p>
          {t(
            "Together, these augmentations proved more impactful than architectural changes alone. The paper ablates them carefully and shows that augmentation accounts for a significant fraction of the gap between DS1 and DS2.",
            "综合使用这两种增强方式，其效果比单纯改变架构更为显著。论文对此进行了细致的消融实验，表明增强策略是 DS1 和 DS2 之间性能差距的重要来源。"
          )}
        </p>

        {/* Section 6 */}
        <h2>{t("6. Mandarin: Character-Level ASR", "6. 普通话：字符级语音识别")}</h2>

        <p>
          {t(
            "Chinese Mandarin presents a fundamentally different challenge for ASR. English has ~40 phonemes and ~170,000 words in common use; Mandarin has ~400 syllable sounds but over 6,000 commonly used characters, each potentially a morpheme. Traditional Chinese ASR systems required careful linguistic engineering: syllable models, tone modeling (Mandarin has 4 tones), and character-level language models.",
            "普通话在语音识别上面临着根本性的不同挑战。英语约有 40 个音素和约 170,000 个常用词；普通话约有 400 个音节，但有 6,000 多个常用汉字，每个汉字可能都是一个语素。传统的中文语音识别系统需要精心设计语言学特征：音节模型、声调建模（普通话有四个声调）以及字符级语言模型。"
          )}
        </p>

        <p>
          {t(
            "DS2's output layer for Mandarin simply uses the 6,000+ most common characters as the output alphabet. The CTC loss and architecture remain identical — only the output vocabulary changes. No tone labels, no syllable decomposition, no hand-coded linguistic structure.",
            "DS2 针对普通话的输出层直接使用 6,000 多个最常用汉字作为输出字符表。CTC 损失和架构保持不变——只有输出词汇表发生改变。无需声调标注、无需音节分解、无需手工编码的语言学结构。"
          )}
        </p>

        <p>
          {t(
            "The larger output vocabulary means the final softmax is bigger, but this is a minor computational cost. More importantly, the CTC model must learn to segment a continuous audio stream directly into characters — skipping the syllable and phoneme intermediate representations entirely. DS2 shows this works: it achieves competitive character error rates on Mandarin benchmarks without any language-specific engineering beyond the choice of output vocabulary.",
            "更大的输出词汇表意味着最终的 softmax 更大，但这只是微小的计算开销。更重要的是，CTC 模型必须直接将连续音频流分割为字符——完全跳过音节和音素的中间表示。DS2 证明了这是可行的：除了选择输出词汇表之外，无需任何特定语言的工程设计，就能在普通话基准测试上取得有竞争力的字符错误率。"
          )}
        </p>

        {/* Section 7 */}
        <h2>{t("7. Results: English and Mandarin", "7. 结果：英语与普通话")}</h2>

        <p>
          {t(
            "On LibriSpeech (English), DS2 achieves 3.67% WER on the clean test set. Human performance on the same benchmark is 5.83% — DS2 is measurably better than the average human transcriber. On the noisy test set, DS2 achieves 8.69% WER vs. human 12.69%. These results demonstrated for the first time that a neural ASR system could definitively beat humans on a standard benchmark.",
            "在 LibriSpeech（英语）上，DS2 在干净测试集上取得 3.67% 的词错误率。人类在同一基准上的表现为 5.83%——DS2 明显优于普通人类转写员。在噪声测试集上，DS2 取得 8.69% 的词错误率，而人类为 12.69%。这些结果首次证明了神经语音识别系统能够在标准基准上明确超越人类。"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="text-sm w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold">
                  {t("System", "系统")}
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center font-semibold">
                  {t("LibriSpeech Clean WER", "LibriSpeech 干净集 WER")}
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center font-semibold">
                  {t("LibriSpeech Noisy WER", "LibriSpeech 噪声集 WER")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">Deep Speech 2</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center font-bold text-green-700 dark:text-green-400">
                  3.67%
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center font-bold text-green-700 dark:text-green-400">
                  8.69%
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  {t("Human performance", "人类水平")}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">
                  5.83%
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">
                  12.69%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "SortaGrad was a key contributor to stable training at scale. Early in training, long sequences produce very noisy gradients because CTC must search an enormous alignment space. SortaGrad addresses this by sorting training examples by length at the start of training — feeding short sequences first — then gradually introducing longer sequences as the model stabilizes. This curriculum learning strategy reduced training instability and improved convergence speed.",
            "SortaGrad 是实现大规模稳定训练的重要贡献因素。训练初期，由于 CTC 需要在巨大的对齐空间中搜索，长序列会产生非常嘈杂的梯度。SortaGrad 通过在训练开始时按长度对训练样本排序——先输入短序列——然后随着模型趋于稳定逐渐引入更长的序列来解决这一问题。这种课程学习策略减少了训练不稳定性并提高了收敛速度。"
          )}
        </p>

        <p>
          {t(
            "Sorted batches also improve RNN training efficiency independently of SortaGrad. When a minibatch contains sequences of similar length, there is less padding waste — GPUs process rectangular tensors, and padding shorter sequences to match the longest wastes computation. By sorting, DS2 keeps batches roughly uniform in length, improving hardware utilization.",
            "排序批次还能独立于 SortaGrad 提高 RNN 训练效率。当一个小批次包含长度相近的序列时，填充浪费更少——GPU 处理矩形张量，将较短序列填充至最长序列的长度会浪费计算。通过排序，DS2 使批次长度大致一致，从而提高了硬件利用率。"
          )}
        </p>

        {/* Section 8 */}
        <h2>{t("8. Engineering at Scale", "8. 大规模工程优化")}</h2>

        <p>
          {t(
            "Scaling DS2 to thousands of hours of audio and 7+ RNN layers required serious systems engineering. The paper describes several custom optimizations:",
            "将 DS2 扩展到数千小时音频和 7 层以上的 RNN 需要认真的系统工程设计。论文描述了几项定制优化："
          )}
        </p>

        <p>
          {t(
            "Custom CUDA CTC kernel: the standard CTC implementation involves many small GPU operations with poor memory access patterns. Baidu Research wrote a custom CUDA kernel that fuses the forward-backward computation into a single pass, dramatically reducing kernel launch overhead and improving memory locality.",
            "自定义 CUDA CTC 核：标准 CTC 实现涉及许多内存访问模式不佳的小型 GPU 操作。百度研究院编写了一个自定义 CUDA 核，将前向-后向计算融合为单次传递，大幅减少了核启动开销并改善了内存局部性。"
          )}
        </p>

        <p>
          {t(
            "Custom RNN kernels: standard deep learning frameworks at the time (Theano, early TensorFlow) had inefficient implementations of stacked bidirectional GRUs. The team wrote custom CUDA kernels that exploit the sequential structure of RNN computation, achieving significant speedups over framework defaults.",
            "自定义 RNN 核：当时的标准深度学习框架（Theano、早期 TensorFlow）对堆叠双向 GRU 的实现效率较低。团队编写了自定义 CUDA 核，利用 RNN 计算的序列结构，相较于框架默认实现取得了显著加速。"
          )}
        </p>

        <p>
          {t(
            "Multi-GPU data parallelism: gradients are aggregated across GPUs via ring-allreduce. Because CTC gradients flow through the entire sequence, synchronization must be done carefully to avoid introducing bias from unequal batch lengths across GPUs.",
            "多 GPU 数据并行：通过环形全归约（ring-allreduce）在多 GPU 之间聚合梯度。由于 CTC 梯度流经整个序列，必须谨慎处理同步操作，以避免因各 GPU 批次长度不均等而引入偏差。"
          )}
        </p>

        <p>
          {t(
            "These engineering investments — CTC kernel, RNN kernel, sorted batches, batch normalization — together made it practical to train the full DS2 system in days rather than weeks, enabling the rapid iteration that produced the final results.",
            "这些工程投入——CTC 核、RNN 核、排序批次、批归一化——共同使得在数天而非数周内训练完整的 DS2 系统成为可能，从而支持了产出最终结果所需的快速迭代。"
          )}
        </p>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`${basePath}/papers`}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            {t("← Back to Papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
