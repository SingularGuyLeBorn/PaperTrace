"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function NeuralMessagePassingPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "Neural Message Passing for Quantum Chemistry",
            "用于量子化学的神经消息传递"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-paper-200/50">
          Gilmer, Schoenholz, Riley, Vinyals, Dahl (Google) &middot; ICML 2017
          &middot;{" "}
          <a
            href="https://arxiv.org/abs/1704.01212"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            arXiv 1704.01212
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* ============ TL;DR ============ */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            TL;DR
          </h3>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed mb-0">
            {t(
              "This paper introduces the Message Passing Neural Network (MPNN) framework — a unified abstraction that subsumes most GNN architectures proposed before 2017. Applied to the QM9 dataset of 130k small molecules, MPNN learns to predict quantum mechanical properties (energy, polarizability, dipole moment, etc.) directly from molecular graphs, outperforming DFT-based fingerprint methods on most targets. The framework has three phases: message (aggregate neighbor features), update (refine node states), and readout (pool all nodes into a graph-level prediction).",
              "本文提出了消息传递神经网络（MPNN）框架——一个统一的抽象，涵盖了 2017 年之前提出的大多数 GNN 架构。应用于包含 13 万个小分子的 QM9 数据集，MPNN 直接从分子图中学习预测量子力学性质（能量、极化率、偶极矩等），在大多数目标上优于基于 DFT 的指纹方法。该框架分为三个阶段：消息（聚合邻居特征）、更新（精化节点状态）和读出（将所有节点汇聚为图级预测）。"
            )}
          </p>
        </section>

        {/* ============ Section 1: Predicting Molecular Properties ============ */}
        <h2>{t("1. Predicting Molecular Properties", "1. 预测分子性质")}</h2>

        <p>
          {t(
            "Quantum chemistry aims to predict how molecules behave at the atomic level — their energy, how their electrons are distributed, how they interact with light, and so on. These properties govern everything from drug activity to materials design. The gold standard for computing them is Density Functional Theory (DFT), a physics-based simulation method. DFT is accurate but expensive: a single calculation can take hours even for a small molecule.",
            "量子化学旨在预测分子在原子层面的行为——能量、电子分布、与光的相互作用等。这些性质决定了从药物活性到材料设计的方方面面。计算这些性质的黄金标准是密度泛函理论（DFT），一种基于物理的模拟方法。DFT 精确但昂贵：即使对于小分子，单次计算也可能需要数小时。"
          )}
        </p>

        <p>
          {t(
            "The question Gilmer et al. ask is: can a neural network learn to predict these quantum mechanical targets directly from the molecular structure, skipping the simulation entirely? If so, we get a model that runs in milliseconds instead of hours, enabling large-scale virtual screening of chemical libraries.",
            "Gilmer 等人提出的问题是：神经网络能否直接从分子结构中学习预测这些量子力学目标，完全跳过模拟过程？如果可以，我们就能得到一个运行时间为毫秒级而非小时级的模型，从而实现对化学库的大规模虚拟筛选。"
          )}
        </p>

        <p>
          {t(
            "The key challenge is representation. Traditional machine learning on molecules uses hand-crafted features called molecular fingerprints — bit vectors encoding the presence of certain substructures. These are fixed and lossy. MPNN instead takes the raw molecular graph as input and learns its own representation end-to-end.",
            "关键挑战在于表示。传统的分子机器学习使用手工设计的特征，称为分子指纹——编码某些子结构存在与否的位向量。这些特征是固定的且有信息损失的。MPNN 则以原始分子图作为输入，端到端地学习自身的表示。"
          )}
        </p>

        {/* ============ Section 2: Molecules as Graphs ============ */}
        <h2>{t("2. Molecules as Graphs", "2. 分子作为图")}</h2>

        <p>
          {t(
            "A molecule maps naturally onto a graph. Atoms are nodes; covalent bonds are edges. Each node carries features describing the atom (element type, charge, hybridization, aromaticity, number of hydrogens). Each edge carries features describing the bond (bond type: single/double/triple/aromatic, ring membership, stereo configuration).",
            "分子天然地映射到图上。原子是节点；共价键是边。每个节点携带描述原子的特征（元素类型、电荷、杂化状态、芳香性、氢原子数）。每条边携带描述键的特征（键类型：单键/双键/三键/芳香键、环成员资格、立体构型）。"
          )}
        </p>

        <p>
          {t(
            "Formally, a molecular graph is a tuple G = (V, E) where V is the set of atoms with initial feature vectors h_v^0, and E is the set of bonds with edge feature vectors e_{vw}. The goal is to learn a function f : G → ŷ mapping from the full graph to a scalar or vector of quantum properties.",
            "形式上，分子图是一个元组 G = (V, E)，其中 V 是具有初始特征向量 h_v^0 的原子集合，E 是具有边特征向量 e_{vw} 的键集合。目标是学习一个函数 f : G → ŷ，将完整图映射到量子性质的标量或向量。"
          )}
        </p>

        <Collapsible
          title={t(
            "What features does QM9 use for atoms and bonds?",
            "QM9 为原子和键使用哪些特征？"
          )}
        >
          <p className="text-sm">
            {t(
              "Atom features in QM9 include: atom type (one-hot over H, C, N, O, F), atomic number, acceptor/donor flags, aromaticity flag, number of hydrogens (0–4, one-hot). Bond features include: bond type (single/double/triple/aromatic, one-hot), same-ring flag, aromaticity flag, conjugation flag. The bond features are represented as the vector e_{vw} and critically are passed directly into the message function, allowing the model to reason about bond chemistry.",
              "QM9 中的原子特征包括：原子类型（H、C、N、O、F 的独热编码）、原子序数、受体/供体标志、芳香性标志、氢原子数（0-4，独热编码）。键特征包括：键类型（单键/双键/三键/芳香键，独热编码）、同环标志、芳香性标志、共轭标志。键特征以向量 e_{vw} 的形式表示，并被直接传入消息函数，使模型能够推理键的化学性质。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 3: The MPNN Framework ============ */}
        <h2>
          {t(
            "3. The MPNN Framework",
            "3. MPNN 框架"
          )}
        </h2>

        <p>
          {t(
            "MPNN unifies a broad class of GNNs into a single parameterized framework with three components: a message function M_t, an update function U_t, and a readout function R. These operate in two phases — a message passing phase that runs for T steps, followed by a single readout.",
            "MPNN 将大量 GNN 统一到一个参数化框架中，包含三个组件：消息函数 M_t、更新函数 U_t 和读出函数 R。这些组件在两个阶段中运行——一个运行 T 步的消息传递阶段，随后是一次读出。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          {t("3a. Message Phase", "3a. 消息阶段")}
        </h3>

        <p>
          {t(
            "At each step t, every node v collects messages from all of its graph neighbors N(v). The message from neighbor w to v depends on both nodes' current hidden states and the edge feature between them:",
            "在每一步 t，每个节点 v 从其所有图邻居 N(v) 收集消息。从邻居 w 到 v 的消息取决于两个节点的当前隐藏状态和它们之间的边特征："
          )}
        </p>

        <Math display tex={`m_v^{t+1} = \\sum_{w \\in N(v)} M_t\\!\\left(h_v^t,\\, h_w^t,\\, e_{vw}\\right)`} />

        <p>
          {t(
            "Here M_t is a learned function (e.g., a small neural network) that can take any form. The sum aggregates all neighbor contributions into a single message vector m_v^{t+1}. Different GNN architectures differ in how they define M_t — but they all fit this template.",
            "这里 M_t 是一个可学习的函数（例如，一个小型神经网络），可以采用任意形式。求和将所有邻居的贡献聚合成单一消息向量 m_v^{t+1}。不同的 GNN 架构在如何定义 M_t 上有所不同——但它们都符合这个模板。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          {t("3b. Update Phase", "3b. 更新阶段")}
        </h3>

        <p>
          {t(
            "After collecting the aggregated message, each node updates its own hidden state using an update function U_t:",
            "收集聚合消息后，每个节点使用更新函数 U_t 更新自身的隐藏状态："
          )}
        </p>

        <Math display tex={`h_v^{t+1} = U_t\\!\\left(h_v^t,\\, m_v^{t+1}\\right)`} />

        <p>
          {t(
            "U_t takes the node's old state and the incoming message, and produces a new state. The simplest U_t is just concatenation followed by a linear layer. A more powerful choice — used in the paper's best model — is a GRU cell, which provides gating to control how much new information to incorporate:",
            "U_t 接收节点的旧状态和传入消息，并产生新状态。最简单的 U_t 只是拼接后接一个线性层。更强大的选择——本文最优模型中使用的——是 GRU 单元，它提供门控机制来控制新信息的融入程度："
          )}
        </p>

        <Math display tex={`h_v^{t+1} = \\text{GRU}\\!\\left(h_v^t,\\, m_v^{t+1}\\right)`} />

        <p>
          {t(
            "After T rounds of message passing, each node h_v^T has incorporated information from all nodes within T hops. With T = 3, a carbon atom in a benzene ring knows about its neighbors' neighbors' neighbors.",
            "经过 T 轮消息传递后，每个节点 h_v^T 已经融入了 T 跳以内所有节点的信息。当 T = 3 时，苯环中的碳原子能了解其邻居的邻居的邻居的信息。"
          )}
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          {t("3c. Readout Phase", "3c. 读出阶段")}
        </h3>

        <p>
          {t(
            "Molecule-level prediction requires pooling all node states into a single fixed-size vector, then mapping to the target. The readout function R does this:",
            "分子级预测需要将所有节点状态汇聚成单一固定大小的向量，然后映射到目标。读出函数 R 完成这一工作："
          )}
        </p>

        <Math display tex={`\\hat{y} = R\\!\\left(\\left\\{h_v^T \\mid v \\in G\\right\\}\\right)`} />

        <p>
          {t(
            "R must be permutation-invariant — the prediction cannot depend on which order we list the atoms. Simple choices include sum pooling or mean pooling. The paper's best model uses set2vec (a learned, attention-based aggregation from Vinyals et al.) which is more expressive than simple sum/mean.",
            "R 必须是置换不变的——预测不能依赖于原子的列举顺序。简单的选择包括求和池化或均值池化。本文最优模型使用 set2vec（Vinyals 等人提出的基于注意力的可学习聚合），比简单的求和/均值更具表达能力。"
          )}
        </p>

        <Collapsible
          title={t(
            "What is set2vec and why is it more expressive?",
            "什么是 set2vec，为什么它更具表达能力？"
          )}
        >
          <p className="text-sm">
            {t(
              "Set2vec (also called Set2Set) uses a recurrent neural network with attention to iteratively build a summary of a set of vectors. At each step, it attends over all elements, produces a weighted sum, and feeds that into an LSTM. After a fixed number of steps, the LSTM hidden state is used as the set embedding. This is more powerful than sum/mean because it can learn to focus on specific atoms (e.g., the reactive site) and produce a non-linear aggregation. The key property preserved: it is order-invariant because the attention mechanism considers all atoms symmetrically.",
              "Set2vec（也称为 Set2Set）使用带注意力的循环神经网络来迭代构建一组向量的摘要。每一步，它对所有元素进行注意力计算，产生加权和，并将其输入 LSTM。经过固定步数后，LSTM 隐藏状态被用作集合嵌入。这比求和/均值更强大，因为它可以学习专注于特定原子（例如，反应位点）并产生非线性聚合。保留的关键属性：由于注意力机制对所有原子对称地处理，因此是顺序不变的。"
            )}
          </p>
        </Collapsible>

        {/* ============ Section 4: Worked Example ============ */}
        <h2>
          {t(
            "4. Worked Example: One Step of MPNN on Methane",
            "4. 工作示例：甲烷上 MPNN 的一步运行"
          )}
        </h2>

        <p>
          {t(
            "Let's trace through one message passing step on methane (CH₄). Methane has 5 atoms: one carbon (C) at the center connected to four hydrogen (H) atoms. There are 4 C–H bonds (edges). We ignore direction for now.",
            "让我们在甲烷（CH₄）上追踪一个消息传递步骤。甲烷有 5 个原子：一个碳（C）在中心，连接四个氢（H）原子。有 4 条 C–H 键（边）。我们暂时忽略方向。"
          )}
        </p>

        <Collapsible
          title={t(
            "Step-by-step trace: message passing on CH₄",
            "逐步追踪：CH₄ 上的消息传递"
          )}
          defaultOpen
        >
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-paper-800 dark:text-paper-200 mb-1">
                {t("Initial state (t = 0)", "初始状态（t = 0）")}
              </p>
              <p>
                {t(
                  "Each atom gets an initial hidden state h_v^0 from its atom features. Carbon's feature vector encodes: element=C, atomic number=6, not aromatic, sp³ hybridization, 0 explicit H. Each hydrogen: element=H, atomic number=1, 0 H neighbors. All edge features e_{CH} encode: bond type = single, not in ring.",
                  "每个原子从其原子特征获得初始隐藏状态 h_v^0。碳的特征向量编码：元素=C，原子序数=6，非芳香性，sp³ 杂化，0 个显式 H。每个氢：元素=H，原子序数=1，0 个 H 邻居。所有边特征 e_{CH} 编码：键类型=单键，不在环中。"
                )}
              </p>
            </div>
            <div>
              <p className="font-semibold text-paper-800 dark:text-paper-200 mb-1">
                {t(
                  "Message computation for carbon (t = 0 → 1)",
                  "碳的消息计算（t = 0 → 1）"
                )}
              </p>
              <p>
                {t(
                  "Carbon has 4 neighbors: H₁, H₂, H₃, H₄. For each neighbor H_i, we compute one message vector: M_0(h_C^0, h_{H_i}^0, e_{CH}). With the edge network message function, this equals A(e_{CH}) · h_{H_i}^0, where A is a small neural network that maps the edge feature to a matrix. Since all four hydrogens are identical and all C–H bonds are identical, all four messages are the same vector. The aggregated message is:",
                  "碳有 4 个邻居：H₁、H₂、H₃、H₄。对于每个邻居 H_i，我们计算一个消息向量：M_0(h_C^0, h_{H_i}^0, e_{CH})。使用边网络消息函数，这等于 A(e_{CH}) · h_{H_i}^0，其中 A 是将边特征映射到矩阵的小型神经网络。由于四个氢原子相同且所有 C–H 键相同，四个消息是相同的向量。聚合消息为："
                )}
              </p>
              <Math display tex={`m_C^1 = \\sum_{i=1}^{4} A(e_{CH})\\, h_{H_i}^0 = 4 \\cdot A(e_{CH})\\, h_H^0`} />
            </div>
            <div>
              <p className="font-semibold text-paper-800 dark:text-paper-200 mb-1">
                {t(
                  "Message computation for each hydrogen (t = 0 → 1)",
                  "每个氢的消息计算（t = 0 → 1）"
                )}
              </p>
              <p>
                {t(
                  "Each hydrogen H_i has exactly one neighbor: carbon C. So the aggregated message for H_i is simply the single message from C:",
                  "每个氢 H_i 只有一个邻居：碳 C。因此 H_i 的聚合消息就是来自 C 的单一消息："
                )}
              </p>
              <Math display tex={`m_{H_i}^1 = M_0(h_{H_i}^0,\\, h_C^0,\\, e_{CH}) = A(e_{CH})\\, h_C^0`} />
            </div>
            <div>
              <p className="font-semibold text-paper-800 dark:text-paper-200 mb-1">
                {t("Update step", "更新步骤")}
              </p>
              <p>
                {t(
                  "Each node feeds its old state and aggregated message into the GRU. Carbon's new state h_C^1 encodes 'I am a carbon atom that has 4 single-bonded hydrogen neighbors.' Each hydrogen's new state h_{H_i}^1 encodes 'I am a hydrogen atom bonded to carbon.' After step 2, carbon would see what those hydrogens saw in step 1 — i.e., that they are terminal hydrogens. This 2-hop reach captures the full connectivity of CH₄.",
                  "每个节点将其旧状态和聚合消息输入 GRU。碳的新状态 h_C^1 编码「我是一个有 4 个单键氢邻居的碳原子」。每个氢的新状态 h_{H_i}^1 编码「我是一个与碳键合的氢原子」。在第 2 步后，碳会看到那些氢在第 1 步看到的内容——即它们是末端氢。这种 2 跳可达性捕获了 CH₄ 的完整连接性。"
                )}
              </p>
            </div>
            <div>
              <p className="font-semibold text-paper-800 dark:text-paper-200 mb-1">
                {t("Readout", "读出")}
              </p>
              <p>
                {t(
                  "After T steps, set2vec aggregates {h_C^T, h_{H_1}^T, h_{H_2}^T, h_{H_3}^T, h_{H_4}^T} into a single graph embedding, which is passed through a final MLP to produce the predicted quantum properties (e.g., internal energy U₀).",
                  "经过 T 步后，set2vec 将 {h_C^T, h_{H_1}^T, h_{H_2}^T, h_{H_3}^T, h_{H_4}^T} 聚合成单一图嵌入，再通过最终的 MLP 产生预测的量子性质（例如内能 U₀）。"
                )}
              </p>
            </div>
          </div>
        </Collapsible>

        {/* ============ Section 5: How Existing GNNs Fit ============ */}
        <h2>
          {t(
            "5. How Existing GNNs Fit This Framework",
            "5. 现有 GNN 如何适配此框架"
          )}
        </h2>

        <p>
          {t(
            "One of the paper's main contributions is showing that five previously disconnected GNN architectures are all special cases of MPNN. They differ only in their choice of M_t, U_t, and R.",
            "本文的主要贡献之一是证明了五种先前独立的 GNN 架构都是 MPNN 的特例。它们的区别仅在于 M_t、U_t 和 R 的选择。"
          )}
        </p>

        <Collapsible
          title={t(
            "Convolutional GNN / GCN (Duvenaud et al., Kipf & Welling)",
            "卷积 GNN / GCN（Duvenaud 等人，Kipf & Welling）"
          )}
        >
          <p className="text-sm">
            {t(
              "The simplest case. The message function ignores edge features and the sender's state: M_t(h_v, h_w, e_{vw}) = h_w / |N(v)|, i.e., each neighbor contributes its own feature vector, and the aggregation is an average (or degree-normalized sum). The update is then U_t(h_v, m_v) = σ(W · [h_v || m_v]) — a linear transform followed by a nonlinearity. This is precisely Graph Convolutional Networks (GCN). No bond features, no gating — just neighbor averaging. MPNN generalizes this by allowing M_t to be a full network that uses e_{vw}.",
              "最简单的情况。消息函数忽略边特征和发送者的状态：M_t(h_v, h_w, e_{vw}) = h_w / |N(v)|，即每个邻居贡献其自身的特征向量，聚合是平均（或度归一化求和）。更新为 U_t(h_v, m_v) = σ(W · [h_v || m_v])——线性变换后接非线性激活。这正是图卷积网络（GCN）。无键特征，无门控——只是邻居平均。MPNN 通过允许 M_t 是使用 e_{vw} 的完整网络来推广这一点。"
            )}
          </p>
        </Collapsible>

        <Collapsible
          title={t(
            "Gated Graph Neural Network (GGNN — Li et al. 2016)",
            "门控图神经网络（GGNN — Li 等人 2016）"
          )}
        >
          <p className="text-sm">
            {t(
              "GGNN uses a GRU as the update function — the same choice as MPNN's best configuration. The message function in the original GGNN is M_t(h_v, h_w, e_{vw}) = A_{e_{vw}} h_w where A_{e_{vw}} is a learned matrix per edge type (e.g., one matrix for single bonds, one for double bonds). This is a lookup table of matrices indexed by edge type. MPNN's edge network message function generalizes this: instead of a lookup table, a neural network produces the matrix from continuous edge features.",
              "GGNN 使用 GRU 作为更新函数——与 MPNN 最佳配置的选择相同。原始 GGNN 中的消息函数为 M_t(h_v, h_w, e_{vw}) = A_{e_{vw}} h_w，其中 A_{e_{vw}} 是每种边类型的可学习矩阵（例如，单键一个矩阵，双键一个矩阵）。这是一个由边类型索引的矩阵查找表。MPNN 的边网络消息函数对此进行了推广：不使用查找表，而是由神经网络从连续边特征生成矩阵。"
            )}
          </p>
        </Collapsible>

        <Collapsible
          title={t(
            "Interaction Networks (Battaglia et al. 2016)",
            "交互网络（Battaglia 等人 2016）"
          )}
        >
          <p className="text-sm">
            {t(
              "Interaction Networks were designed for physical simulations (e.g., N-body dynamics, rigid body systems). Their message function is M_t(h_v, h_w, e_{vw}) = f(h_v, h_w, e_{vw}) where f is an MLP — exactly the general MPNN message form. Their update function is U_t(h_v, m_v) = g(h_v, m_v) where g is another MLP. The key difference from MPNN is that Interaction Networks use a sum over directed edges and don't distinguish between node and edge roles in the same way. They fit cleanly into the MPNN template.",
              "交互网络设计用于物理模拟（例如，N 体动力学、刚体系统）。其消息函数为 M_t(h_v, h_w, e_{vw}) = f(h_v, h_w, e_{vw})，其中 f 是 MLP——正好是通用 MPNN 消息形式。其更新函数为 U_t(h_v, m_v) = g(h_v, m_v)，其中 g 是另一个 MLP。与 MPNN 的主要区别是交互网络在有向边上求和，且不以相同方式区分节点和边的角色。它们完美地适配 MPNN 模板。"
            )}
          </p>
        </Collapsible>

        <Collapsible
          title={t(
            "Molecular Graph Convolutions (Kearnes et al. 2016)",
            "分子图卷积（Kearnes 等人 2016）"
          )}
        >
          <p className="text-sm">
            {t(
              "This model, published before MPNN, explicitly maintained separate state vectors for both atoms and bonds — an early recognition that edge features matter in chemistry. In MPNN terms, it is a variant where the message function pools over atom–bond pairs rather than just atoms, and the readout considers both atom and bond states. The MPNN framework accommodates it by treating edge features as part of the message computation.",
              "这个在 MPNN 之前发表的模型明确地为原子和键维护了独立的状态向量——这是早期对化学中边特征重要性的认识。在 MPNN 术语中，它是一种消息函数在原子-键对（而非仅原子）上汇集的变体，读出函数同时考虑原子和键状态。MPNN 框架通过将边特征视为消息计算的一部分来适应它。"
            )}
          </p>
        </Collapsible>

        <Collapsible
          title={t(
            "Deep Tensor Neural Networks (Schütt et al. 2017)",
            "深度张量神经网络（Schütt 等人 2017）"
          )}
        >
          <p className="text-sm">
            {t(
              "DTNN was developed specifically for quantum chemistry, using Gaussian basis functions of interatomic distances as edge features. It fits MPNN with M_t(h_v, h_w, e_{vw}) = tanh(W_1 h_w + b_1) ⊙ (W_2 e_{vw} + b_2) — an element-wise gating of the neighbor state by the edge features. This is slightly less expressive than the edge network (which multiplies a full matrix by h_w) but more so than simple averaging. On QM9, DTNN was the strongest baseline before MPNN.",
              "DTNN 专门为量子化学开发，使用原子间距离的高斯基函数作为边特征。它适配 MPNN，其中 M_t(h_v, h_w, e_{vw}) = tanh(W_1 h_w + b_1) ⊙ (W_2 e_{vw} + b_2)——邻居状态被边特征逐元素门控。这比边网络（将完整矩阵乘以 h_w）的表达能力稍弱，但比简单平均更强。在 QM9 上，DTNN 是 MPNN 之前最强的基线。"
            )}
          </p>
        </Collapsible>

        <div className="my-4 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <strong>{t("Key insight:", "核心洞察：")}</strong>{" "}
            {t(
              "The MPNN framework is not just an architectural proposal — it is a taxonomy. By casting all prior GNNs into one template, it makes it easy to see exactly what each model does and does not capture. Most models before MPNN used simple, non-parametric message functions (e.g., sums or averages). MPNN's key contribution is making both M_t and U_t fully learned and making edge features first-class citizens.",
              "MPNN 框架不仅仅是一个架构提案——它是一个分类体系。通过将所有先前的 GNN 映射到同一模板，它使我们能够清楚地看到每个模型捕获了什么以及遗漏了什么。MPNN 之前的大多数模型使用简单的非参数消息函数（例如求和或平均）。MPNN 的关键贡献是使 M_t 和 U_t 都完全可学习，并使边特征成为一等公民。"
            )}
          </p>
        </div>

        {/* ============ Section 6: Results on QM9 ============ */}
        <h2>{t("6. Results on QM9", "6. QM9 上的结果")}</h2>

        <p>
          {t(
            "QM9 is a benchmark dataset of 133,885 small organic molecules (up to 9 heavy atoms: C, H, O, N, F), each labeled with 12 quantum mechanical properties computed via DFT. The properties span a wide range of physics: energetics (U₀, U₂₉₈, H₂₉₈, G₂₉₈), electronic properties (HOMO, LUMO, gap, dipole moment μ), geometric properties (polarizability α, zero-point vibrational energy ZPVE), and others (R², C_v).",
            "QM9 是包含 133,885 个小有机分子（最多 9 个重原子：C、H、O、N、F）的基准数据集，每个分子都用通过 DFT 计算的 12 个量子力学性质标注。这些性质涵盖广泛的物理范畴：能量（U₀、U₂₉₈、H₂₉₈、G₂₉₈）、电子性质（HOMO、LUMO、带隙、偶极矩 μ）、几何性质（极化率 α、零点振动能 ZPVE）等（R²、C_v）。"
          )}
        </p>

        <p>
          {t(
            "The MPNN paper evaluates several variants and compares against: (1) fingerprint-based baselines using DFT-computed features, (2) DTNN (the then-strongest neural baseline), and (3) an ensemble of graph convolution models from Duvenaud et al. The key MPNN variant uses edge network messages + GRU update + set2vec readout, with T = 3 message passing steps.",
            "MPNN 论文评估了几个变体，并与以下方法进行比较：（1）使用 DFT 计算特征的指纹基线，（2）DTNN（当时最强的神经基线），以及（3）Duvenaud 等人的图卷积模型集成。关键 MPNN 变体使用边网络消息 + GRU 更新 + set2vec 读出，消息传递步数 T = 3。"
          )}
        </p>

        <Collapsible
          title={t(
            "MPNN's specific message and readout functions",
            "MPNN 的具体消息和读出函数"
          )}
          defaultOpen
        >
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold mb-1">
                {t("Edge network message function:", "边网络消息函数：")}
              </p>
              <Math display tex={`M_t(h_v, h_w, e_{vw}) = A(e_{vw})\\, h_w`} />
              <p className="mt-1">
                {t(
                  "where A : ℝ^{d_e} → ℝ^{d_h × d_h} is a neural network that maps the edge feature vector to a square matrix. This matrix then left-multiplies the neighbor's hidden state h_w. This is the most expressive message function in the paper — it allows the bond type to completely reshape how neighbor information flows.",
                  "其中 A : ℝ^{d_e} → ℝ^{d_h × d_h} 是将边特征向量映射到方阵的神经网络。然后该矩阵左乘邻居的隐藏状态 h_w。这是本文中最具表达能力的消息函数——它允许键类型完全重塑邻居信息的流动方式。"
                )}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">
                {t("GRU update function:", "GRU 更新函数：")}
              </p>
              <Math display tex={`h_v^{t+1} = \\text{GRU}\\!\\left(h_v^t,\\, m_v^{t+1}\\right)`} />
              <p className="mt-1">
                {t(
                  "The GRU treats h_v^t as the hidden state and m_v^{t+1} as the input. Its forget/update gates learn to balance how much of the previous node state to retain vs. how much to incorporate from neighbors. This is the same GRU as in sequence modeling — the only difference is that the 'sequence' here is the T rounds of message passing.",
                  "GRU 将 h_v^t 视为隐藏状态，将 m_v^{t+1} 视为输入。其遗忘/更新门学习如何平衡保留多少先前节点状态与融入多少来自邻居的信息。这与序列建模中的 GRU 相同——唯一的区别是这里的「序列」是 T 轮消息传递。"
                )}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">
                {t("Set2vec readout:", "Set2vec 读出：")}
              </p>
              <p>
                {t(
                  "After T steps, set2vec runs M_r steps of attention-based aggregation over the final node states {h_v^T}. The output is a fixed-size vector passed through a final MLP to produce the 12 property predictions (one per target, trained separately).",
                  "经过 T 步后，set2vec 对最终节点状态 {h_v^T} 运行 M_r 步基于注意力的聚合。输出是一个固定大小的向量，通过最终 MLP 产生 12 个性质预测（每个目标一个，分别训练）。"
                )}
              </p>
            </div>
          </div>
        </Collapsible>

        <p>
          {t(
            "Results: MPNN achieves state-of-the-art on 10 out of 12 QM9 targets, often by large margins over DTNN. On targets like U₀ (internal energy at 0K), MPNN reduces mean absolute error by ~40% compared to DTNN. Importantly, MPNN also beats DFT-based fingerprint baselines on most targets — meaning the learned graph representation is more informative than the hand-engineered physics features.",
            "结果：MPNN 在 12 个 QM9 目标中的 10 个上达到最先进水平，通常比 DTNN 有大幅领先。在 U₀（0K 内能）等目标上，MPNN 将平均绝对误差比 DTNN 降低了约 40%。重要的是，MPNN 在大多数目标上也优于基于 DFT 的指纹基线——这意味着学习的图表示比手工设计的物理特征更具信息量。"
          )}
        </p>

        <p>
          {t(
            "Two targets remain difficult: μ (dipole moment) and R² (electronic spatial extent). Dipole moment is sensitive to the 3D geometry of the molecule — a property that MPNN only partially captures through bond types. The authors note that incorporating 3D coordinates as edge features (inter-atomic distances, angles) would likely close this gap, and subsequent work (e.g., SchNet, DimeNet) confirms this.",
            "两个目标仍然困难：μ（偶极矩）和 R²（电子空间范围）。偶极矩对分子的三维几何形状敏感——MPNN 只通过键类型部分捕获这一属性。作者指出，将三维坐标作为边特征（原子间距离、角度）可能会弥合这一差距，后续工作（例如 SchNet、DimeNet）证实了这一点。"
          )}
        </p>

        {/* ============ Section 7: MPNN's Legacy ============ */}
        <h2>
          {t(
            "7. MPNN's Legacy in GNN Research",
            "7. MPNN 在 GNN 研究中的遗产"
          )}
        </h2>

        <p>
          {t(
            "The MPNN paper (2017) arrived at a pivotal moment for graph neural networks. Before it, GNNs were a fragmented landscape of individually motivated architectures. MPNN provided the first clean, general framework that showed these methods were all doing the same thing — iterative neighborhood aggregation — with different parameterizations.",
            "MPNN 论文（2017 年）在图神经网络的关键时刻出现。在此之前，GNN 是各自独立设计的架构的碎片化领域。MPNN 提供了第一个清晰的通用框架，证明这些方法都在做同一件事——迭代邻域聚合——只是参数化方式不同。"
          )}
        </p>

        <p>
          {t(
            "Its impact is twofold. First, practical: MPNN set strong benchmarks on molecular property prediction that shaped research in AI for science for years. Second, conceptual: the message-passing abstraction became the dominant vocabulary for GNN research. Papers like GraphSAGE, GAT, GIN, and PNA all define themselves in terms of their message and aggregation choices.",
            "其影响是双重的。首先是实践层面：MPNN 在分子性质预测上设立了强有力的基准，塑造了多年来的 AI 科学研究。其次是概念层面：消息传递抽象成为 GNN 研究的主导词汇。GraphSAGE、GAT、GIN 和 PNA 等论文都用消息和聚合选择来定义自身。"
          )}
        </p>

        <Collapsible
          title={t(
            "How later GNNs extend MPNN",
            "后续 GNN 如何扩展 MPNN"
          )}
        >
          <div className="space-y-2 text-sm">
            <p>
              <strong>GAT (Veličković et al. 2018):</strong>{" "}
              {t(
                "Replaces the sum aggregation with learned attention weights — each neighbor's contribution is weighted by a learned attention score a_{vw}. This is still MPNN with M_t(h_v, h_w, e_{vw}) = a_{vw} · h_w, but the attention depends on the current node states.",
                "将求和聚合替换为可学习的注意力权重——每个邻居的贡献由可学习的注意力分数 a_{vw} 加权。这仍然是 MPNN，其中 M_t(h_v, h_w, e_{vw}) = a_{vw} · h_w，但注意力依赖于当前节点状态。"
              )}
            </p>
            <p>
              <strong>GIN (Xu et al. 2019):</strong>{" "}
              {t(
                "Analyzes the expressive power of MPNNs through the lens of the Weisfeiler-Lehman graph isomorphism test. Shows that sum aggregation (not mean/max) is necessary for maximum expressiveness. GIN is the simplest MPNN provably as expressive as 1-WL.",
                "通过 Weisfeiler-Lehman 图同构测试的视角分析 MPNN 的表达能力。证明求和聚合（而非均值/最大值）是最大表达能力所必需的。GIN 是可证明与 1-WL 等强的最简单 MPNN。"
              )}
            </p>
            <p>
              <strong>SchNet / DimeNet / PaiNN:</strong>{" "}
              {t(
                "Extend MPNN specifically for 3D molecular geometry — incorporating interatomic distances and angles as continuous edge features, exactly as MPNN's framework permits. These dominate molecular property benchmarks when 3D geometry is available.",
                "专门针对三维分子几何扩展 MPNN——将原子间距离和角度作为连续边特征纳入，正是 MPNN 框架所允许的。当三维几何可用时，这些方法主导了分子性质基准测试。"
              )}
            </p>
            <p>
              <strong>
                {t(
                  "Graph Transformers (Kreuzer et al., Rampášek et al.):",
                  "图 Transformer（Kreuzer 等人，Rampášek 等人）："
                )}
              </strong>{" "}
              {t(
                "Replace local message passing with global attention over all node pairs. These go beyond the 1-WL expressiveness limit of standard MPNN by using positional encodings or random walks to distinguish nodes.",
                "将局部消息传递替换为所有节点对上的全局注意力。通过使用位置编码或随机游走来区分节点，这些方法超越了标准 MPNN 的 1-WL 表达能力限制。"
              )}
            </p>
          </div>
        </Collapsible>

        <p>
          {t(
            "One fundamental limitation identified after the paper: all MPNNs are bounded in expressiveness by the 1-dimensional Weisfeiler-Lehman (1-WL) graph isomorphism test. They cannot distinguish certain pairs of non-isomorphic graphs that have the same local neighborhood structure. Higher-order GNNs (k-GNNs) and graph transformers address this, at the cost of increased computation.",
            "论文发表后发现的一个基本限制：所有 MPNN 在表达能力上都受到一维 Weisfeiler-Lehman（1-WL）图同构测试的限制。它们无法区分具有相同局部邻域结构的某些非同构图对。高阶 GNN（k-GNN）和图 Transformer 解决了这一问题，但代价是计算量增加。"
          )}
        </p>

        {/* ============ Back / Resources ============ */}
        <h2>{t("8. Additional Resources", "8. 补充资源")}</h2>

        <div className="space-y-2 my-4">
          <a
            href="https://arxiv.org/abs/1704.01212"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">
              {t(
                "Neural Message Passing for Quantum Chemistry (arXiv 1704.01212)",
                "用于量子化学的神经消息传递 (arXiv 1704.01212)"
              )}
            </span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">
              {t("Original paper", "原始论文")}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/1609.02907"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">
              GCN — Kipf & Welling 2017
            </span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">
              {t(
                "Semi-supervised classification with graph convolutional networks",
                "使用图卷积网络的半监督分类"
              )}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/1511.05493"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">
              GGNN — Li et al. 2016
            </span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">
              {t(
                "Gated graph sequence neural networks — GRU-based node update",
                "门控图序列神经网络——基于 GRU 的节点更新"
              )}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/1810.00826"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">
              GIN — Xu et al. 2019
            </span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">
              {t(
                "How powerful are graph neural networks? — WL expressiveness analysis",
                "图神经网络有多强大？—— WL 表达能力分析"
              )}
            </span>
          </a>
          <a
            href="https://arxiv.org/abs/1706.08549"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">
              SchNet — Schütt et al. 2017
            </span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">
              {t(
                "Continuous-filter convolutional neural networks for 3D molecular graphs",
                "用于三维分子图的连续滤波器卷积神经网络"
              )}
            </span>
          </a>
          <a
            href="https://rdk.to/GNNguide"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">
              {t("Stanford CS224W: Machine Learning with Graphs", "斯坦福 CS224W：图上的机器学习")}
            </span>
            <span className="text-xs text-paper-800/50 dark:text-paper-200/50 ml-2">
              {t(
                "Lecture notes covering MPNN, GCN, GAT, GIN with worked examples",
                "涵盖 MPNN、GCN、GAT、GIN 及工作示例的课程讲义"
              )}
            </span>
          </a>
        </div>

        <div className="mt-12 pt-6 border-t border-paper-200 dark:border-paper-700">
          <Link
            href={`${basePath}/papers`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t("← Back to Papers", "← 返回论文列表")}
          </Link>
        </div>
      </article>
    </div>
  );
}
