"use client";

import { Math } from "@/components/Math";
import { Collapsible } from "@/components/Collapsible";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function RelationNetworksPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t(
            "A Simple Neural Network Module for Relational Reasoning",
            "\u7528\u4e8e\u5173\u7cfb\u63a8\u7406\u7684\u7b80\u5355\u795e\u7ecf\u7f51\u7edc\u6a21\u5757"
          )}
        </h1>
        <p className="text-paper-800/50 dark:text-paper-200/50">
          Santoro, Raposo, Barrett, Malinowski, Pascanu, Battaglia, Lillicrap (DeepMind) &middot; NeurIPS 2017 &middot;{" "}
          <a
            href="https://arxiv.org/abs/1706.01427"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            arXiv 1706.01427
          </a>
        </p>
      </header>

      <article className="paper-content">
        {/* TL;DR */}
        <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-5 mb-10">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">TL;DR</h3>
          <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed mb-0">
            {t(
              "The Relation Network (RN) is a plug-in neural network module that explicitly reasons about pairwise relations between objects. Given a set of objects, it computes a learned relation embedding for every pair, sums them all, and passes the result through an MLP to produce an answer. This simple inductive bias \u2014 consider all pairs \u2014 is surprisingly powerful: RNs achieve 95.5% on CLEVR visual QA (surpassing human performance of 92.6%) and near-perfect on bAbI language tasks.",
              "\u5173\u7cfb\u7f51\u7edc\uff08RN\uff09\u662f\u4e00\u4e2a\u5373\u63d2\u5373\u7528\u7684\u795e\u7ecf\u7f51\u7edc\u6a21\u5757\uff0c\u80fd\u591f\u663e\u5f0f\u5730\u5bf9\u7269\u4f53\u95f4\u7684\u6210\u5bf9\u5173\u7cfb\u8fdb\u884c\u63a8\u7406\u3002\u7ed9\u5b9a\u4e00\u7ec4\u7269\u4f53\uff0c\u5b83\u4e3a\u6bcf\u5bf9\u7269\u4f53\u8ba1\u7b97\u4e00\u4e2a\u5b66\u4e60\u5230\u7684\u5173\u7cfb\u5d4c\u5165\uff0c\u6c42\u548c\u6240\u6709\u7ed3\u679c\uff0c\u5e76\u901a\u8fc7 MLP \u751f\u6210\u6700\u7ec8\u7b54\u6848\u3002\u8fd9\u79cd\u7b80\u5355\u7684\u5f52\u7eb3\u504f\u7f6e\u2014\u2014\u8003\u8651\u6240\u6709\u6210\u5bf9\u2014\u2014\u51fa\u5947\u5730\u5f3a\u5927\uff1aRN \u5728 CLEVR \u89c6\u89c9\u95ee\u7b54\u4e0a\u8fbe\u5230 95.5%\uff08\u8d85\u8d8a\u4eba\u7c7b\u7684 92.6%\uff09\uff0c\u5728 bAbI \u8bed\u8a00\u4efb\u52a1\u4e0a\u51e0\u4e4e\u5b8c\u7f8e\u3002"
            )}
          </p>
        </section>

        {/* Section 1: What Is Relational Reasoning? */}
        <h2>
          {t(
            "1. What Is Relational Reasoning?",
            "1. \u4ec0\u4e48\u662f\u5173\u7cfb\u63a8\u7406\uff1f"
          )}
        </h2>

        <p>
          {t(
            "Many questions we ask about the world are inherently relational. \"Is the red cube to the left of the blue sphere?\" cannot be answered by inspecting either object in isolation \u2014 you must compare them. \"Which of these two shapes is larger?\" requires placing both objects in relation to each other. Classic deep learning models (MLPs, CNNs) do not have a built-in mechanism to reason about such pairwise relationships.",
            "\u6211\u4eec\u5bf9\u4e16\u754c\u63d0\u51fa\u7684\u8bb8\u591a\u95ee\u9898\u672c\u8d28\u4e0a\u662f\u5173\u7cfb\u6027\u7684\u3002\u201c\u7ea2\u8272\u7acb\u65b9\u4f53\u662f\u5426\u5728\u84dd\u8272\u7403\u4f53\u7684\u5de6\u8fb9\uff1f\u201d\u65e0\u6cd5\u901a\u8fc7\u5355\u72ec\u68c0\u67e5\u4efb\u4e00\u7269\u4f53\u6765\u56de\u7b54\u2014\u2014\u4f60\u5fc5\u987b\u6bd4\u8f83\u5b83\u4eec\u3002\u201c\u8fd9\u4e24\u4e2a\u5f62\u72b6\u54ea\u4e2a\u66f4\u5927\uff1f\u201d\u9700\u8981\u5c06\u4e24\u4e2a\u7269\u4f53\u76f8\u4e92\u5bf9\u7167\u3002\u7ecf\u5178\u6df1\u5ea6\u5b66\u4e60\u6a21\u578b\uff08MLP\u3001CNN\uff09\u6ca1\u6709\u5185\u7f6e\u673a\u5236\u6765\u63a8\u7406\u8fd9\u79cd\u6210\u5bf9\u5173\u7cfb\u3002"
          )}
        </p>

        <p>
          {t(
            "Relational reasoning is the ability to explicitly reason about relationships and properties of entities and their interactions. It underlies tasks like visual question answering, reading comprehension, knowledge graph reasoning, and physical simulation.",
            "\u5173\u7cfb\u63a8\u7406\u662f\u663e\u5f0f\u63a8\u7406\u5b9e\u4f53\u4e4b\u95f4\u5173\u7cfb\u548c\u5c5e\u6027\u53ca\u5176\u4ea4\u4e92\u7684\u80fd\u529b\u3002\u5b83\u662f\u89c6\u89c9\u95ee\u7b54\u3001\u9605\u8bfb\u7406\u89e3\u3001\u77e5\u8bc6\u56fe\u8c31\u63a8\u7406\u548c\u7269\u7406\u4eff\u771f\u7b49\u4efb\u52a1\u7684\u57fa\u7840\u3002"
          )}
        </p>

        <Collapsible title={t("Why standard models struggle with relational queries", "\u4e3a\u4ec0\u4e48\u6807\u51c6\u6a21\u578b\u96be\u4ee5\u5904\u7406\u5173\u7cfb\u578b\u67e5\u8be2")}>
          <p>
            {t(
              "A CNN processes an image by applying local filters \u2014 each output feature depends on a local patch. To relate distant objects, the network must propagate information through many layers, which is indirect and inefficient. An MLP operating on a flattened image treats all pixel positions equally but has no explicit notion of \"compare these two regions\". The Relation Network sidesteps this by constructing explicit pairwise comparisons as part of the architecture.",
              "CNN \u901a\u8fc7\u5c40\u90e8\u6ee4\u6ce2\u5668\u5904\u7406\u56fe\u50cf\u2014\u2014\u6bcf\u4e2a\u8f93\u51fa\u7279\u5f81\u4f9d\u8d56\u4e8e\u5c40\u90e8\u533a\u57df\u3002\u4e3a\u4e86\u5173\u8054\u8fdc\u8ddd\u79bb\u7684\u7269\u4f53\uff0c\u7f51\u7edc\u5fc5\u987b\u901a\u8fc7\u591a\u5c42\u4f20\u64ad\u4fe1\u606f\uff0c\u8fd9\u662f\u95f4\u63a5\u4e14\u4f4e\u6548\u7684\u3002\u5728\u5c55\u5e73\u56fe\u50cf\u4e0a\u64cd\u4f5c\u7684 MLP \u5e73\u7b49\u5bf9\u5f85\u6240\u6709\u50cf\u7d20\u4f4d\u7f6e\uff0c\u4f46\u6ca1\u6709\u663e\u5f0f\u7684\u6bd4\u8f83\u6982\u5ff5\u3002\u5173\u7cfb\u7f51\u7edc\u901a\u8fc7\u5c06\u663e\u5f0f\u7684\u6210\u5bf9\u6bd4\u8f83\u4f5c\u4e3a\u67b6\u6784\u7684\u4e00\u90e8\u5206\u6765\u7ed5\u5f00\u8fd9\u4e2a\u95ee\u9898\u3002"
            )}
          </p>
        </Collapsible>

        {/* Section 2: The Relation Network Module */}
        <h2>
          {t(
            "2. The Relation Network Module",
            "2. \u5173\u7cfb\u7f51\u7edc\u6a21\u5757"
          )}
        </h2>

        <p>
          {t(
            "The Relation Network is defined by a single equation. Given a set of objects",
            "\u5173\u7cfb\u7f51\u7edc\u7531\u4e00\u4e2a\u7b80\u5355\u7684\u516c\u5f0f\u5b9a\u4e49\u3002\u7ed9\u5b9a\u4e00\u7ec4\u7269\u4f53"
          )}{" "}
          <Math tex={"O = \\{o_1, o_2, \\ldots, o_n\\}"} />
          {t(
            ", the RN computes:",
            "\uff0cRN \u8ba1\u7b97\uff1a"
          )}
        </p>

        <Math display tex={"\\text{RN}(O) = f_\\varphi\\!\\left(\\sum_{i,j} g_\\theta(o_i, o_j)\\right)"} />

        <p>
          {t(
            "There are only two learned functions:",
            "\u53ea\u6709\u4e24\u4e2a\u5b66\u4e60\u51fd\u6570\uff1a"
          )}
        </p>

        <ul>
          <li>
            <strong><Math tex={"g_\\theta"} /></strong>
            {t(
              " \u2014 a small MLP that takes a pair of objects as input and outputs a relation embedding: a vector summarizing whatever relationship might exist between those two objects. The same MLP is applied to every pair (weights are shared across all pairs).",
              " \u2014 \u4e00\u4e2a\u5c0f\u578b MLP\uff0c\u4ee5\u4e00\u5bf9\u7269\u4f53\u4e3a\u8f93\u5165\uff0c\u8f93\u51fa\u4e00\u4e2a\u5173\u7cfb\u5d4c\u5165\uff1a\u6982\u62ec\u8fd9\u4e24\u4e2a\u7269\u4f53\u4e4b\u95f4\u53ef\u80fd\u5b58\u5728\u7684\u4efb\u4f55\u5173\u7cfb\u7684\u5411\u91cf\u3002\u540c\u4e00\u4e2a MLP \u5e94\u7528\u4e8e\u6bcf\u4e00\u5bf9\uff08\u6743\u91cd\u5728\u6240\u6709\u5bf9\u4e4b\u95f4\u5171\u4eab\uff09\u3002"
            )}
          </li>
          <li>
            <strong><Math tex={"f_\\varphi"} /></strong>
            {t(
              " \u2014 another MLP that takes the sum of all relation embeddings and produces the final output (e.g., an answer to a question). The sum aggregates evidence from all pairwise comparisons into a single vector.",
              " \u2014 \u53e6\u4e00\u4e2a MLP\uff0c\u63a5\u6536\u6240\u6709\u5173\u7cfb\u5d4c\u5165\u7684\u603b\u548c\uff0c\u5e76\u4ea7\u751f\u6700\u7ec8\u8f93\u51fa\uff08\u4f8b\u5982\uff0c\u95ee\u9898\u7684\u7b54\u6848\uff09\u3002\u6c42\u548c\u5c06\u6240\u6709\u6210\u5bf9\u6bd4\u8f83\u7684\u8bc1\u636e\u805a\u5408\u6210\u4e00\u4e2a\u5411\u91cf\u3002"
            )}
          </li>
        </ul>

        <p>
          {t(
            "The key design choices are: (1) sharing",
            "\u5173\u952e\u8bbe\u8ba1\u9009\u62e9\u662f\uff1a(1) \u5171\u4eab"
          )}{" "}
          <Math tex={"g_\\theta"} />{" "}
          {t(
            "across all pairs (like a convolutional kernel shared across positions), and (2) using summation as the aggregation operator \u2014 this makes the module invariant to the ordering of objects, and it is differentiable everywhere.",
            "\u5728\u6240\u6709\u5bf9\u4e2d\uff08\u7c7b\u4f3c\u4e8e\u5728\u5404\u4f4d\u7f6e\u5171\u4eab\u7684\u5377\u79ef\u6838\uff09\uff0c\u4ee5\u53ca (2) \u4f7f\u7528\u6c42\u548c\u4f5c\u4e3a\u805a\u5408\u7b97\u5b50\u2014\u2014\u8fd9\u4f7f\u6a21\u5757\u5bf9\u7269\u4f53\u6392\u5e8f\u4e0d\u53d8\uff0c\u5e76\u4e14\u5904\u5904\u53ef\u5fae\u3002"
          )}
        </p>

        <Collapsible title={t("Why sum (not max or concat)?", "\u4e3a\u4ec0\u4e48\u4f7f\u7528\u6c42\u548c\uff08\u800c\u975e\u6700\u5927\u5024\u6216\u62fc\u63a5\uff09\uff1f")}>
          <p>
            {t(
              "Summation is a natural choice for a set operation: it is permutation-invariant (order of objects doesn't matter), differentiable (unlike argmax), and scales gracefully with the number of objects. Max-pooling would discard all but the strongest signal. Concatenation would require knowing the number of objects at architecture design time and would break permutation invariance. The sum lets",
              "\u6c42\u548c\u662f\u96c6\u5408\u64cd\u4f5c\u7684\u81ea\u7136\u9009\u62e9\uff1a\u5b83\u662f\u7f6e\u6362\u4e0d\u53d8\u7684\uff08\u7269\u4f53\u7684\u987a\u5e8f\u65e0\u5173\uff09\uff0c\u53ef\u5fae\u7684\uff08\u4e0d\u50cf argmax\uff09\uff0c\u5e76\u4e14\u968f\u7269\u4f53\u6570\u91cf\u4f18\u96c5\u5730\u6269\u5c55\u3002\u6700\u5927\u6c60\u5316\u4f1a\u4e22\u5f03\u9664\u6700\u5f3a\u4fe1\u53f7\u4ee5\u5916\u7684\u6240\u6709\u4fe1\u53f7\u3002\u62fc\u63a5\u9700\u8981\u5728\u67b6\u6784\u8bbe\u8ba1\u65f6\u77e5\u9053\u7269\u4f53\u6570\u91cf\uff0c\u5e76\u4e14\u4f1a\u7834\u574f\u7f6e\u6362\u4e0d\u53d8\u6027\u3002\u6c42\u548c\u8ba9"
            )}{" "}
            <Math tex={"f_\\varphi"} />{" "}
            {t(
              "act on a fixed-size vector regardless of how many objects there are.",
              "\u5728\u56fa\u5b9a\u5927\u5c0f\u7684\u5411\u91cf\u4e0a\u4f5c\u7528\uff0c\u65e0\u8bba\u6709\u591a\u5c11\u4e2a\u7269\u4f53\u3002"
            )}
          </p>
        </Collapsible>

        {/* Section 3: All Pairwise Relations */}
        <h2>
          {t(
            "3. All Pairwise Relations",
            "3. \u6240\u6709\u6210\u5bf9\u5173\u7cfb"
          )}
        </h2>

        <p>
          {t(
            "A crucial design decision is to consider every pair",
            "\u4e00\u4e2a\u5173\u952e\u8bbe\u8ba1\u51b3\u7b56\u662f\u8003\u8651\u6bcf\u4e00\u5bf9"
          )}{" "}
          <Math tex={"(o_i, o_j)"} />{" "}
          {t(
            "\u2014 including pairs where",
            "\u2014\u2014\u5305\u62ec"
          )}{" "}
          <Math tex={"i = j"} />{" "}
          {t(
            "(self-pairs) and both orderings",
            "\uff08\u81ea\u5bf9\uff09\u548c\u4e24\u79cd\u987a\u5e8f"
          )}{" "}
          <Math tex={"(o_i, o_j)"} />{" "}
          {t(
            "and",
            "\u548c"
          )}{" "}
          <Math tex={"(o_j, o_i)"} />
          {t(
            ". With",
            "\u3002\u6709"
          )}{" "}
          <Math tex={"n"} />{" "}
          {t(
            "objects, this yields",
            "\u4e2a\u7269\u4f53\u65f6\uff0c\u8fd9\u4ea7\u751f"
          )}{" "}
          <Math tex={"n^2"} />{" "}
          {t(
            "pairs total \u2014 an",
            "\u5bf9\uff0c\u603b\u5171 \u2014\u2014 \u4e00\u4e2a"
          )}{" "}
          <Math tex={"O(n^2)"} />{" "}
          {t(
            "computation.",
            "\u7684\u8ba1\u7b97\u91cf\u3002"
          )}
        </p>

        <p>
          {t(
            "This exhaustive enumeration is intentional. The network does not need to know in advance which pairs are relevant \u2014 it considers all of them and lets",
            "\u8fd9\u79cd\u7a77\u4e3e\u679a\u4e3e\u662f\u6709\u610f\u4e3a\u4e4b\u7684\u3002\u7f51\u7edc\u4e0d\u9700\u8981\u63d0\u524d\u77e5\u9053\u54ea\u4e9b\u5bf9\u662f\u76f8\u5173\u7684\u2014\u2014\u5b83\u8003\u8651\u6240\u6709\u5bf9\uff0c\u5e76\u8ba9"
          )}{" "}
          <Math tex={"g_\\theta"} />{" "}
          {t(
            "learn to output a near-zero vector for irrelevant pairs and a meaningful embedding for relevant ones. The sum then focuses on the relevant pairs because they dominate the signal.",
            "\u5b66\u4e60\u5bf9\u65e0\u5173\u7684\u5bf9\u8f93\u51fa\u63a5\u8fd1\u96f6\u7684\u5411\u91cf\uff0c\u5bf9\u76f8\u5173\u7684\u5bf9\u8f93\u51fa\u6709\u610f\u4e49\u7684\u5d4c\u5165\u3002\u6c42\u548c\u7136\u540e\u805a\u7126\u4e8e\u76f8\u5173\u7684\u5bf9\uff0c\u56e0\u4e3a\u5b83\u4eec\u4e3b\u5bfc\u4fe1\u53f7\u3002"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("n (objects)", "n\uff08\u7269\u4f53\u6570\uff09")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Pairs considered", "\u8003\u8651\u7684\u5bf9\u6570")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Example", "\u793a\u4f8b")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">3</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">9</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Small scene", "\u5c0f\u573a\u666f")}
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">10</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">100</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("CLEVR scene (avg ~10 objects)", "CLEVR \u573a\u666f\uff08\u5e73\u5747\u7ea610\u4e2a\u7269\u4f53\uff09")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">25</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">625</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("CNN feature map (5\u00d75 spatial positions)", "CNN \u7279\u5f81\u56fe\uff085\u00d75 \u7a7a\u95f4\u4f4d\u7f6e\uff09")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "For visual inputs, the objects are typically CNN feature map cells \u2014 a 5\u00d75 feature map gives 25 objects and 625 pairs. This is manageable. For very large inputs the quadratic cost can become expensive, but the RN paper's tasks stay in this tractable regime.",
            "\u5bf9\u4e8e\u89c6\u89c9\u8f93\u5165\uff0c\u201c\u7269\u4f53\u201d\u901a\u5e38\u662f CNN \u7279\u5f81\u56fe\u5355\u5143\u2014\u20145\u00d75 \u7279\u5f81\u56fe\u7ed9\u51fa 25 \u4e2a\u7269\u4f53\u548c 625 \u5bf9\u3002\u8fd9\u662f\u53ef\u7ba1\u7406\u7684\u3002\u5bf9\u4e8e\u975e\u5e38\u5927\u7684\u8f93\u5165\uff0c\u4e8c\u6b21\u6210\u672c\u53ef\u80fd\u53d8\u5f97\u6602\u8d35\uff0c\u4f46 RN \u8bba\u6587\u7684\u4efb\u52a1\u4fdd\u6301\u5728\u8fd9\u4e2a\u53ef\u5904\u7406\u7684\u8303\u56f4\u5185\u3002"
          )}
        </p>

        {/* Section 4: Processing Visual Inputs */}
        <h2>
          {t(
            "4. Processing Visual Inputs",
            "4. \u5904\u7406\u89c6\u89c9\u8f93\u5165"
          )}
        </h2>

        <p>
          {t(
            "For visual question answering, the full pipeline is:",
            "\u5bf9\u4e8e\u89c6\u89c9\u95ee\u7b54\uff0c\u5b8c\u6574\u6d41\u7a0b\u662f\uff1a"
          )}
        </p>

        <ol>
          <li>
            <strong>{t("CNN encoder:", "CNN \u7f16\u7801\u5668\uff1a")}</strong>{" "}
            {t(
              "A convolutional network processes the input image and produces a feature map of shape",
              "\u5377\u79ef\u7f51\u7edc\u5904\u7406\u8f93\u5165\u56fe\u50cf\u5e76\u4ea7\u751f\u5f62\u72b6\u4e3a"
            )}{" "}
            <Math tex={"k \\times k \\times d"} />
            {t(
              ". Each of the",
              "\u7684\u7279\u5f81\u56fe\u3002\u6bcf\u4e2a"
            )}{" "}
            <Math tex={"k^2"} />{" "}
            {t(
              "spatial positions becomes one object:",
              "\u7a7a\u95f4\u4f4d\u7f6e\u6210\u4e3a\u4e00\u4e2a\u7269\u4f53\uff1a"
            )}{" "}
            <Math tex={"o_i \\in \\mathbb{R}^d"} />
            {t(
              ". The 2D coordinates of each cell are appended to",
              "\u3002\u6bcf\u4e2a\u5355\u5143\u7684\u4e8c\u7ef4\u5750\u6807\u9644\u52a0\u5230"
            )}{" "}
            <Math tex={"o_i"} />{" "}
            {t(
              "so the network knows where each object is in the image.",
              "\uff0c\u8fd9\u6837\u7f51\u7edc\u77e5\u9053\u6bcf\u4e2a\u7269\u4f53\u5728\u56fe\u50cf\u4e2d\u7684\u4f4d\u7f6e\u3002"
            )}
          </li>
          <li>
            <strong>{t("LSTM question encoder:", "LSTM \u95ee\u9898\u7f16\u7801\u5668\uff1a")}</strong>{" "}
            {t(
              "The question is encoded by an LSTM into a fixed-length question embedding",
              "\u95ee\u9898\u7531 LSTM \u7f16\u7801\u4e3a\u56fa\u5b9a\u957f\u5ea6\u7684\u95ee\u9898\u5d4c\u5165"
            )}{" "}
            <Math tex={"q \\in \\mathbb{R}^{d_q}"} />
            {t(
              ". This embedding captures the semantics of the question \u2014 \"what color is...\", \"how many...\", \"is there a...\", etc.",
              "\u3002\u8fd9\u4e2a\u5d4c\u5165\u6355\u83b7\u4e86\u95ee\u9898\u7684\u8bed\u4e49\u2014\u2014\u201c\u4ec0\u4e48\u989c\u8272\u2026\u2026\u201d\u3001\u201c\u6709\u591a\u5c11\u2026\u2026\u201d\u3001\u201c\u662f\u5426\u6709\u2026\u2026\u201d\u7b49\u3002"
            )}
          </li>
          <li>
            <strong>{t("Relation Network:", "\u5173\u7cfb\u7f51\u7edc\uff1a")}</strong>{" "}
            {t(
              "The question embedding",
              "\u95ee\u9898\u5d4c\u5165"
            )}{" "}
            <Math tex={"q"} />{" "}
            {t(
              "is appended to every pair input, so",
              "\u9644\u52a0\u5230\u6bcf\u4e2a\u5bf9\u7684\u8f93\u5165\uff0c\u56e0\u6b64"
            )}{" "}
            <Math tex={"g_\\theta"} />{" "}
            {t(
              "receives",
              "\u63a5\u6536"
            )}{" "}
            <Math tex={"\\text{concat}(o_i,\\, o_j,\\, q)"} />
            {t(
              ". This conditions the relational reasoning on the question \u2014 for \"what color?\" the network learns to focus on color attributes; for \"to the left of?\" it focuses on spatial relations.",
              "\u3002\u8fd9\u5c06\u5173\u7cfb\u63a8\u7406\u4ee5\u95ee\u9898\u4e3a\u6761\u4ef6\u2014\u2014\u5bf9\u4e8e\u201c\u4ec0\u4e48\u989c\u8272\uff1f\u201d\uff0c\u7f51\u7edc\u5b66\u4e60\u5173\u6ce8\u989c\u8272\u5c5e\u6027\uff1b\u5bf9\u4e8e\u201c\u5728\u2026\u2026\u5de6\u8fb9\uff1f\u201d\uff0c\u5b83\u5173\u6ce8\u7a7a\u95f4\u5173\u7cfb\u3002"
            )}
          </li>
        </ol>

        <p>
          {t(
            "The full VQA formula is:",
            "\u5b8c\u6574\u7684 VQA \u516c\u5f0f\u662f\uff1a"
          )}
        </p>

        <Math display tex={"a = f_\\varphi\\!\\left(\\sum_{i,j} g_\\theta(o_i,\\, o_j,\\, q)\\right)"} />

        <p>
          {t(
            "where the input to",
            "\u5176\u4e2d"
          )}{" "}
          <Math tex={"g_\\theta"} />{" "}
          {t(
            "is a concatenated vector of dimension",
            "\u7684\u8f93\u5165\u662f\u7ef4\u5ea6\u4e3a"
          )}{" "}
          <Math tex={"2d + d_q"} />
          {t(
            ":",
            "\u7684\u62fc\u63a5\u5411\u91cf\uff1a"
          )}
        </p>

        <Math display tex={"\\text{concat}(o_i, o_j, q) \\in \\mathbb{R}^{2d + d_q}"} />

        <Collapsible title={t("Architecture details of g and f", "g \u548c f \u7684\u67b6\u6784\u7ec6\u8282")}>
          <p>
            {t(
              "In the CLEVR experiments:",
              "\u5728 CLEVR \u5b9e\u9a8c\u4e2d\uff1a"
            )}
          </p>
          <ul>
            <li>
              {t(
                "CNN: 4 convolutional layers, each with 24 filters, kernel size 3, stride 2, batch norm + ReLU. Output: 5\u00d75\u00d724 feature map \u2192 25 objects of dimension 26 (24 features + 2 coordinates).",
                "CNN\uff1a4 \u4e2a\u5377\u79ef\u5c42\uff0c\u6bcf\u5c42 24 \u4e2a\u6ee4\u6ce2\u5668\uff0c\u6838\u5927\u5c0f 3\uff0c\u6b65\u957f 2\uff0c\u6279\u5f52\u4e00\u5316 + ReLU\u3002\u8f93\u51fa\uff1a5\u00d75\u00d724 \u7279\u5f81\u56fe \u2192 25 \u4e2a\u7ef4\u5ea6\u4e3a 26 \u7684\u7269\u4f53\uff0824 \u7279\u5f81 + 2 \u5750\u6807\uff09\u3002"
              )}
            </li>
            <li>
              {t(
                "Question LSTM: 128-dimensional hidden state, so q \u2208 R\u00b9\u00b2\u2078.",
                "\u95ee\u9898 LSTM\uff1a128 \u7ef4\u9690\u85cf\u72b6\u6001\uff0c\u56e0\u6b64 q \u2208 R\u00b9\u00b2\u2078\u3002"
              )}
            </li>
            <li>
              {t(
                "g_\u03b8: 4-layer MLP with 256 units per layer, ReLU activations. Input size = 26+26+128 = 180.",
                "g_\u03b8\uff1a4 \u5c42 MLP\uff0c\u6bcf\u5c42 256 \u4e2a\u5355\u5143\uff0cReLU \u6fc0\u6d3b\u3002\u8f93\u5165\u5927\u5c0f = 26+26+128 = 180\u3002"
              )}
            </li>
            <li>
              {t(
                "f_\u03c6: 3-layer MLP with 256 units, ReLU, plus a final softmax over answer classes.",
                "f_\u03c6\uff1a3 \u5c42 MLP\uff0c256 \u4e2a\u5355\u5143\uff0cReLU\uff0c\u52a0\u4e0a\u7b54\u6848\u7c7b\u4e0a\u7684\u6700\u7ec8 softmax\u3002"
              )}
            </li>
          </ul>
        </Collapsible>

        {/* Section 5: CLEVR */}
        <h2>
          {t(
            "5. CLEVR: A Hard Relational Reasoning Benchmark",
            "5. CLEVR\uff1a\u4e00\u4e2a\u56f0\u96be\u7684\u5173\u7cfb\u63a8\u7406\u57fa\u51c6"
          )}
        </h2>

        <p>
          {t(
            "CLEVR (Johnson et al., 2017) is a synthetic visual QA dataset designed to test compositional and relational reasoning. Scenes contain 3D-rendered objects with attributes like shape (cube/sphere/cylinder), color (8 colors), material (rubber/metal), and size (large/small). Questions are generated from programs and require multi-step reasoning.",
            "CLEVR\uff08Johnson \u7b49\uff0c2017\uff09\u662f\u4e00\u4e2a\u5408\u6210\u89c6\u89c9\u95ee\u7b54\u6570\u636e\u96c6\uff0c\u65e8\u5728\u6d4b\u8bd5\u7ec4\u5408\u6027\u548c\u5173\u7cfb\u63a8\u7406\u3002\u573a\u666f\u5305\u542b\u5177\u6709\u5f62\u72b6\uff08\u7acb\u65b9\u4f53/\u7403\u4f53/\u5706\u67f1\u4f53\uff09\u3001\u989c\u8272\uff088 \u79cd\u989c\u8272\uff09\u3001\u6750\u6599\uff08\u6a61\u80f6/\u91d1\u5c5e\uff09\u548c\u5927\u5c0f\uff08\u5927/\u5c0f\uff09\u7b49\u5c5e\u6027\u7684 3D \u6e32\u67d3\u7269\u4f53\u3002\u95ee\u9898\u7531\u7a0b\u5e8f\u751f\u6210\uff0c\u9700\u8981\u591a\u6b65\u63a8\u7406\u3002"
          )}
        </p>

        <p>
          {t(
            "Example questions:",
            "\u793a\u4f8b\u95ee\u9898\uff1a"
          )}
        </p>

        <ul>
          <li>
            <em>{t("\"What color is the cube that is to the left of the cylinder?\"", "\u201c\u5728\u5706\u67f1\u4f53\u5de6\u8fb9\u7684\u7acb\u65b9\u4f53\u662f\u4ec0\u4e48\u989c\u8272\uff1f\u201d")}</em>
          </li>
          <li>
            <em>{t("\"Are there more red things than blue things?\"", "\u201c\u7ea2\u8272\u7684\u4e1c\u897f\u6bd4\u84dd\u8272\u7684\u591a\u5417\uff1f\u201d")}</em>
          </li>
          <li>
            <em>{t("\"What size is the object made of the same material as the large blue cube?\"", "\u201c\u4e0e\u5927\u84dd\u8272\u7acb\u65b9\u4f53\u7531\u76f8\u540c\u6750\u6599\u5236\u6210\u7684\u7269\u4f53\u662f\u4ec0\u4e48\u5927\u5c0f\uff1f\u201d")}</em>
          </li>
        </ul>

        <p>
          {t(
            "These questions require comparing multiple objects, tracking references across clauses, and reasoning about spatial relationships \u2014 exactly the kind of task that benefits from explicit relational reasoning.",
            "\u8fd9\u4e9b\u95ee\u9898\u9700\u8981\u6bd4\u8f83\u591a\u4e2a\u7269\u4f53\u3001\u8de8\u5b50\u53e5\u8ffd\u8e2a\u5f15\u7528\uff0c\u4ee5\u53ca\u63a8\u7406\u7a7a\u95f4\u5173\u7cfb\u2014\u2014\u6b63\u662f\u8fd9\u79cd\u53d7\u76ca\u4e8e\u663e\u5f0f\u5173\u7cfb\u63a8\u7406\u7684\u4efb\u52a1\u3002"
          )}
        </p>

        <Collapsible title={t("Why CLEVR is harder than earlier VQA datasets", "\u4e3a\u4ec0\u4e48 CLEVR \u6bd4\u65e9\u671f VQA \u6570\u636e\u96c6\u66f4\u96be")}>
          <p>
            {t(
              "Earlier VQA datasets (like VQA v1) could often be solved by exploiting dataset biases \u2014 e.g., answering \"yes\" to most yes/no questions, or picking the most frequent color. CLEVR was designed to minimize such shortcuts by using balanced question programs and controlled answer distributions. It demands genuine compositional reasoning rather than pattern matching.",
              "\u65e9\u671f\u7684 VQA \u6570\u636e\u96c6\uff08\u5982 VQA v1\uff09\u901a\u5e38\u53ef\u4ee5\u901a\u8fc7\u5229\u7528\u6570\u636e\u96c6\u504f\u5dee\u6765\u89e3\u51b3\u2014\u2014\u4f8b\u5982\uff0c\u5bf9\u5927\u591a\u6570\u662f/\u5426\u95ee\u9898\u56de\u7b54\u201c\u662f\u201d\uff0c\u6216\u9009\u62e9\u6700\u9891\u7e41\u7684\u989c\u8272\u3002CLEVR \u7684\u8bbe\u8ba1\u901a\u8fc7\u4f7f\u7528\u5e73\u8861\u7684\u95ee\u9898\u7a0b\u5e8f\u548c\u63a7\u5236\u7684\u7b54\u6848\u5206\u5e03\u6765\u6700\u5c0f\u5316\u6b64\u7c7b\u6377\u5f84\u3002\u5b83\u9700\u8981\u771f\u6b63\u7684\u7ec4\u5408\u63a8\u7406\uff0c\u800c\u4e0d\u662f\u6a21\u5f0f\u5339\u914d\u3002"
            )}
          </p>
        </Collapsible>

        {/* Section 6: Worked Example */}
        <h2>
          {t(
            "6. Worked Example: Three Objects, One Question",
            "6. \u5b9e\u4f8b\u6f14\u793a\uff1a\u4e09\u4e2a\u7269\u4f53\uff0c\u4e00\u4e2a\u95ee\u9898"
          )}
        </h2>

        <p>
          {t(
            "Let's trace through the Relation Network for a simple 3-object scene.",
            "\u8ba9\u6211\u4eec\u8ffd\u8e2a\u4e00\u4e2a\u7b80\u5355\u7684 3 \u7269\u4f53\u573a\u666f\u4e2d\u7684\u5173\u7cfb\u7f51\u7edc\u3002"
          )}
        </p>

        <p>
          <strong>{t("Scene:", "\u573a\u666f\uff1a")}</strong>{" "}
          {t(
            "Three objects: a large red cube (o\u2081), a small blue sphere (o\u2082), a large metal cylinder (o\u2083).",
            "\u4e09\u4e2a\u7269\u4f53\uff1a\u4e00\u4e2a\u5927\u7ea2\u8272\u7acb\u65b9\u4f53\uff08o\u2081\uff09\u3001\u4e00\u4e2a\u5c0f\u84dd\u8272\u7403\u4f53\uff08o\u2082\uff09\u3001\u4e00\u4e2a\u5927\u91d1\u5c5e\u5706\u67f1\u4f53\uff08o\u2083\uff09\u3002"
          )}
        </p>

        <p>
          <strong>{t("Question:", "\u95ee\u9898\uff1a")}</strong>{" "}
          <em>{t("\"What color is the cube that is to the left of the cylinder?\"", "\u201c\u5728\u5706\u67f1\u4f53\u5de6\u8fb9\u7684\u7acb\u65b9\u4f53\u662f\u4ec0\u4e48\u989c\u8272\uff1f\u201d")}</em>
        </p>

        <p>
          <strong>{t("Step 1 \u2014 Extract objects:", "\u6b65\u9aa4 1 \u2014 \u63d0\u53d6\u7269\u4f53\uff1a")}</strong>{" "}
          {t(
            "The CNN produces feature vectors for each spatial cell. Suppose",
            "CNN \u4e3a\u6bcf\u4e2a\u7a7a\u95f4\u5355\u5143\u4ea7\u751f\u7279\u5f81\u5411\u91cf\u3002\u5047\u8bbe"
          )}{" "}
          <Math tex={"o_1, o_2, o_3 \\in \\mathbb{R}^d"} />{" "}
          {t(
            "are extracted, each with appended 2D coordinates.",
            "\u88ab\u63d0\u53d6\u51fa\u6765\uff0c\u6bcf\u4e2a\u90fd\u9644\u52a0\u4e86\u4e8c\u7ef4\u5750\u6807\u3002"
          )}
        </p>

        <p>
          <strong>{t("Step 2 \u2014 Encode question:", "\u6b65\u9aa4 2 \u2014 \u7f16\u7801\u95ee\u9898\uff1a")}</strong>{" "}
          {t(
            "The LSTM produces",
            "LSTM \u4ea7\u751f"
          )}{" "}
          <Math tex={"q \\in \\mathbb{R}^{128}"} />
          {t(
            ", encoding \"what color ... cube ... left of ... cylinder\".",
            "\uff0c\u7f16\u7801\u201c\u4ec0\u4e48\u989c\u8272\u2026\u2026\u7acb\u65b9\u4f53\u2026\u2026\u5de6\u8fb9\u2026\u2026\u5706\u67f1\u4f53\u201d\u3002"
          )}
        </p>

        <p>
          <strong>{t("Step 3 \u2014 Apply g to all 9 pairs:", "\u6b65\u9aa4 3 \u2014 \u5bf9\u6240\u67099\u5bf9\u5e94\u7528 g\uff1a")}</strong>
        </p>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Pair", "\u5bf9")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Input to g", "g \u7684\u8f93\u5165")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Relevance", "\u76f8\u5173\u6027")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">(o\u2081, o\u2081)</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  <Math tex={"[o_1, o_1, q]"} />
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Low (self-pair, cube vs cube)", "\u4f4e\uff08\u81ea\u5bf9\uff0c\u7acb\u65b9\u4f53 vs \u7acb\u65b9\u4f53\uff09")}
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">(o\u2081, o\u2082)</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  <Math tex={"[o_1, o_2, q]"} />
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Low (cube vs sphere \u2014 wrong pair)", "\u4f4e\uff08\u7acb\u65b9\u4f53 vs \u7403\u4f53\u2014\u2014\u9519\u8bef\u7684\u5bf9\uff09")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold text-blue-700 dark:text-blue-300">(o\u2081, o\u2083)</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  <Math tex={"[o_1, o_3, q]"} />
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold text-blue-700 dark:text-blue-300">
                  {t("High (cube to the left of cylinder!)", "\u9ad8\uff08\u7acb\u65b9\u4f53\u5728\u5706\u67f1\u4f53\u5de6\u8fb9\uff01\uff09")}
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("\u2026 6 more pairs \u2026", "\u2026 \u53e6\u5916 6 \u5bf9 \u2026")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">\u2026</td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Low (irrelevant combinations)", "\u4f4e\uff08\u4e0d\u76f8\u5173\u7684\u7ec4\u5408\uff09")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>{t("Step 4 \u2014 Sum and aggregate:", "\u6b65\u9aa4 4 \u2014 \u6c42\u548c\u5e76\u805a\u5408\uff1a")}</strong>{" "}
          {t(
            "The 9 embeddings are summed. The (o\u2081, o\u2083) pair dominates the sum since",
            "9 \u4e2a\u5d4c\u5165\u88ab\u6c42\u548c\u3002(o\u2081, o\u2083) \u5bf9\u4e3b\u5bfc\u6c42\u548c\uff0c\u56e0\u4e3a"
          )}{" "}
          <Math tex={"g_\\theta"} />{" "}
          {t(
            "learned to output a large signal for it. Then",
            "\u5b66\u4f1a\u4e86\u4e3a\u5b83\u8f93\u51fa\u5927\u4fe1\u53f7\u3002\u7136\u540e"
          )}{" "}
          <Math tex={"f_\\varphi"} />{" "}
          {t(
            "maps this aggregate to the answer distribution, outputting high probability for \"red\".",
            "\u5c06\u8fd9\u4e2a\u805a\u5408\u6620\u5c04\u5230\u7b54\u6848\u5206\u5e03\uff0c\u4e3a\u201c\u7ea2\u8272\u201d\u8f93\u51fa\u9ad8\u6982\u7387\u3002"
          )}
        </p>

        {/* Section 7: Results */}
        <h2>
          {t(
            "7. Results",
            "7. \u7ed3\u679c"
          )}
        </h2>

        <p>
          {t(
            "The Relation Network achieved state-of-the-art results across multiple benchmarks in 2017:",
            "\u5173\u7cfb\u7f51\u7edc\u5728 2017 \u5e74\u5728\u591a\u4e2a\u57fa\u51c6\u4e0a\u53d6\u5f97\u4e86\u6700\u5148\u8fdb\u7684\u7ed3\u679c\uff1a"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Benchmark", "\u57fa\u51c6")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("RN Accuracy", "RN \u51c6\u786e\u7387")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Baseline / Human", "\u57fa\u7ebf / \u4eba\u7c7b")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("CLEVR (overall)", "CLEVR\uff08\u603b\u4f53\uff09")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold text-green-700 dark:text-green-400">
                  95.5%
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Human: 92.6%", "\u4eba\u7c7b\uff1a92.6%")}
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Sort-of-CLEVR (relational Qs)", "Sort-of-CLEVR\uff08\u5173\u7cfb\u578b\u95ee\u9898\uff09")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold text-green-700 dark:text-green-400">
                  96%
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("CNN+MLP baseline: 63%", "CNN+MLP \u57fa\u7ebf\uff1a63%")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("bAbI (passed tasks)", "bAbI\uff08\u901a\u8fc7\u4efb\u52a1\u6570\uff09")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2 font-semibold text-green-700 dark:text-green-400">
                  18 / 20
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Prior LSTM: 12 / 20", "\u5148\u524d LSTM\uff1a12 / 20")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "The 33-percentage-point gap on Sort-of-CLEVR relational questions (96% vs 63%) is particularly striking. The task is designed so that non-relational questions (e.g., \"What shape is the red object?\") can be answered by inspecting one object, while relational questions (e.g., \"What shape is the object to the left of the green object?\") require comparing two objects. The CNN+MLP baseline, lacking explicit relational structure, performs near chance on the relational subset.",
            "\u5728 Sort-of-CLEVR \u5173\u7cfb\u578b\u95ee\u9898\u4e0a 33 \u4e2a\u767e\u5206\u70b9\u7684\u5dee\u8ddd\uff0896% vs 63%\uff09\u5c24\u4e3a\u60ca\u4eba\u3002\u8be5\u4efb\u52a1\u7684\u8bbe\u8ba1\u4f7f\u5f97\u975e\u5173\u7cfb\u578b\u95ee\u9898\uff08\u4f8b\u5982\uff0c\u201c\u7ea2\u8272\u7269\u4f53\u662f\u4ec0\u4e48\u5f62\u72b6\uff1f\u201d\uff09\u53ef\u4ee5\u901a\u8fc7\u68c0\u67e5\u4e00\u4e2a\u7269\u4f53\u6765\u56de\u7b54\uff0c\u800c\u5173\u7cfb\u578b\u95ee\u9898\uff08\u4f8b\u5982\uff0c\u201c\u7ef3\u8272\u7269\u4f53\u5de6\u8fb9\u7684\u7269\u4f53\u662f\u4ec0\u4e48\u5f62\u72b6\uff1f\u201d\uff09\u9700\u8981\u6bd4\u8f83\u4e24\u4e2a\u7269\u4f53\u3002\u7f3a\u4e4f\u663e\u5f0f\u5173\u7cfb\u7ed3\u6784\u7684 CNN+MLP \u57fa\u7ebf\u5728\u5173\u7cfb\u5b50\u96c6\u4e0a\u7684\u8868\u73b0\u63a5\u8fd1\u968f\u673a\u3002"
          )}
        </p>

        <Collapsible title={t("CLEVR question type breakdown", "CLEVR \u95ee\u9898\u7c7b\u578b\u7ec6\u5206")}>
          <p>
            {t(
              "CLEVR has five question categories, each testing different reasoning skills. The RN improves most on the hardest relational categories:",
              "CLEVR \u67095\u4e2a\u95ee\u9898\u7c7b\u522b\uff0c\u6bcf\u4e2a\u7c7b\u522b\u6d4b\u8bd5\u4e0d\u540c\u7684\u63a8\u7406\u6280\u80fd\u3002RN \u5728\u6700\u96be\u7684\u5173\u7cfb\u578b\u7c7b\u522b\u4e0a\u6539\u8fdb\u6700\u5927\uff1a"
            )}
          </p>
          <ul>
            <li>{t("Exist: 97.8% (RN) vs 96.6% (CNN+LSTM)", "Exist\uff1a97.8%\uff08RN\uff09vs 96.6%\uff08CNN+LSTM\uff09")}</li>
            <li>{t("Count: 90.1% (RN) vs 84.9% (CNN+LSTM)", "Count\uff1a90.1%\uff08RN\uff09vs 84.9%\uff08CNN+LSTM\uff09")}</li>
            <li>{t("Compare Integer: 93.6% (RN) vs 85.7% (CNN+LSTM)", "Compare Integer\uff1a93.6%\uff08RN\uff09vs 85.7%\uff08CNN+LSTM\uff09")}</li>
            <li>{t("Query Attribute: 97.9% (RN) vs 92.9% (CNN+LSTM)", "Query Attribute\uff1a97.9%\uff08RN\uff09vs 92.9%\uff08CNN+LSTM\uff09")}</li>
            <li>{t("Compare Attribute: 97.1% (RN) vs 95.5% (CNN+LSTM)", "Compare Attribute\uff1a97.1%\uff08RN\uff09vs 95.5%\uff08CNN+LSTM\uff09")}</li>
          </ul>
        </Collapsible>

        <Collapsible title={t("bAbI: 20 language reasoning tasks", "bAbI\uff1a20 \u4e2a\u8bed\u8a00\u63a8\u7406\u4efb\u52a1")}>
          <p>
            {t(
              "The bAbI dataset (Weston et al., 2015) contains 20 synthetic text reasoning tasks ranging from basic factual recall to spatial reasoning and reasoning with multiple supporting facts. Each object for the RN is a sentence embedding from an LSTM. The RN solves 18 out of 20 tasks (failing on tasks 16 and 17, which involve basic factual QA that may not benefit from pairwise comparisons). A previous LSTM model passed only 12/20 tasks.",
              "bAbI \u6570\u636e\u96c6\uff08Weston \u7b49\uff0c2015\uff09\u5305\u542b 20 \u4e2a\u5408\u6210\u6587\u672c\u63a8\u7406\u4efb\u52a1\uff0c\u4ece\u57fa\u672c\u7684\u4e8b\u5b9e\u56de\u5fc6\u5230\u7a7a\u95f4\u63a8\u7406\u548c\u4f7f\u7528\u591a\u4e2a\u652f\u6491\u4e8b\u5b9e\u7684\u63a8\u7406\u3002RN \u7684\u6bcf\u4e2a\u201c\u7269\u4f53\u201d\u662f\u6765\u81ea LSTM \u7684\u53e5\u5b50\u5d4c\u5165\u3002RN \u89e3\u51b3\u4e8620 \u4e2a\u4efb\u52a1\u4e2d\u768418\u4e2a\uff08\u5728\u4efb\u52a1 16 \u548c 17 \u4e0a\u5931\u8d25\uff0c\u8fd9\u4e9b\u4efb\u52a1\u6d89\u53ca\u53ef\u80fd\u4e0d\u53d7\u76ca\u4e8e\u6210\u5bf9\u6bd4\u8f83\u7684\u57fa\u672c\u4e8b\u5b9e QA\uff09\u3002\u5148\u524d\u7684 LSTM \u6a21\u578b\u53ea\u901a\u8fc7\u4e8612/20 \u4e2a\u4efb\u52a1\u3002"
            )}
          </p>
        </Collapsible>

        {/* Section 8: Connection to Attention and Transformers */}
        <h2>
          {t(
            "8. Connection to Attention and Transformers",
            "8. \u4e0e\u6ce8\u610f\u529b\u673a\u5236\u548c Transformer \u7684\u8054\u7cfb"
          )}
        </h2>

        <p>
          {t(
            "The Relation Network has a deep conceptual connection to self-attention, which is the core of the Transformer architecture (Vaswani et al., 2017 \u2014 published the same year).",
            "\u5173\u7cfb\u7f51\u7edc\u4e0e\u81ea\u6ce8\u610f\u529b\u673a\u5236\u6709\u6df1\u523b\u7684\u6982\u5ff5\u8054\u7cfb\uff0c\u81ea\u6ce8\u610f\u529b\u673a\u5236\u662f Transformer \u67b6\u6784\u7684\u6838\u5fc3\uff08Vaswani \u7b49\uff0c2017\u2014\u2014\u540c\u5e74\u53d1\u8868\uff09\u3002"
          )}
        </p>

        <p>
          {t(
            "Recall the self-attention formula:",
            "\u56de\u987e\u81ea\u6ce8\u610f\u529b\u516c\u5f0f\uff1a"
          )}
        </p>

        <Math display tex={"\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V"} />

        <p>
          {t(
            "Self-attention also considers all pairs of positions: the logit",
            "\u81ea\u6ce8\u610f\u529b\u4e5f\u8003\u8651\u6240\u6709\u4f4d\u7f6e\u5bf9\uff1alogit"
          )}{" "}
          <Math tex={"Q_i K_j^T / \\sqrt{d_k}"} />{" "}
          {t(
            "measures the relationship between position",
            "\u8861\u91cf\u4f4d\u7f6e"
          )}{" "}
          <Math tex={"i"} />{" "}
          {t("and", "\u548c")}{" "}
          <Math tex={"j"} />
          {t(
            ", and the output is a weighted sum over all positions. The key differences:",
            "\u4e4b\u95f4\u7684\u5173\u7cfb\uff0c\u8f93\u51fa\u662f\u6240\u6709\u4f4d\u7f6e\u7684\u52a0\u6743\u548c\u3002\u4e3b\u8981\u533a\u522b\uff1a"
          )}
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-800">
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Aspect", "\u65b9\u9762")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Relation Network", "\u5173\u7cfb\u7f51\u7edc")}
                </th>
                <th className="border border-paper-200 dark:border-paper-700 px-4 py-2 text-left">
                  {t("Self-Attention", "\u81ea\u6ce8\u610f\u529b")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Pair function", "\u6210\u5bf9\u51fd\u6570")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Nonlinear MLP", "\u975e\u7ebf\u6027 MLP")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Dot product (linear)", "\u70b9\u79ef\uff08\u7ebf\u6027\uff09")}
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Aggregation", "\u805a\u5408")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Unweighted sum", "\u65e0\u6743\u91cd\u6c42\u548c")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Softmax-weighted sum (attention)", "Softmax \u52a0\u6743\u548c\uff08\u6ce8\u610f\u529b\uff09")}
                </td>
              </tr>
              <tr>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Conditioning on query", "\u4ee5\u67e5\u8be2\u4e3a\u6761\u4ef6")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Explicit (q appended to input)", "\u663e\u5f0f\uff08q \u9644\u52a0\u5230\u8f93\u5165\uff09")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Via learned Q projection", "\u901a\u8fc7\u5b66\u4e60\u7684 Q \u6295\u5f71")}
                </td>
              </tr>
              <tr className="bg-paper-50 dark:bg-paper-900">
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  {t("Computational complexity", "\u8ba1\u7b97\u590d\u6742\u5ea6")}
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  <Math tex={"O(n^2)"} />
                </td>
                <td className="border border-paper-200 dark:border-paper-700 px-4 py-2">
                  <Math tex={"O(n^2)"} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          {t(
            "In a sense, the Relation Network can be viewed as a form of unweighted self-attention where the attention score is a nonlinear function of both objects, and the aggregated value is always the pair embedding itself (rather than a value vector). Self-attention can be seen as a more structured, computationally efficient version that uses dot-product similarity to weight contributions.",
            "\u4ece\u67d0\u79cd\u610f\u4e49\u4e0a\u8bf4\uff0c\u5173\u7cfb\u7f51\u7edc\u53ef\u4ee5\u88ab\u89c6\u4e3a\u4e00\u79cd\u65e0\u6743\u91cd\u81ea\u6ce8\u610f\u529b\uff0c\u5176\u4e2d\u201c\u6ce8\u610f\u529b\u5206\u6570\u201d\u662f\u4e24\u4e2a\u7269\u4f53\u7684\u975e\u7ebf\u6027\u51fd\u6570\uff0c\u805a\u5408\u7684\u5024\u59cb\u7ec8\u662f\u6210\u5bf9\u5d4c\u5165\u672c\u8eab\uff08\u800c\u4e0d\u662f\u5024\u5411\u91cf\uff09\u3002\u81ea\u6ce8\u610f\u529b\u53ef\u4ee5\u88ab\u89c6\u4e3a\u4e00\u79cd\u66f4\u7ed3\u6784\u5316\u3001\u8ba1\u7b97\u6548\u7387\u66f4\u9ad8\u7684\u7248\u672c\uff0c\u5b83\u4f7f\u7528\u70b9\u79ef\u76f8\u4f3c\u5ea6\u6765\u6743\u8861\u8d21\u732e\u3002"
          )}
        </p>

        <p>
          {t(
            "The Relation Network's contribution is its clarity as an inductive bias: it says explicitly that reasoning should be done by comparing all pairs of objects. This interpretable design principle \u2014 rather than emerging implicitly from gradient descent \u2014 is what makes the paper influential. The Transformer generalizes this to sequences, stacks the operation multiple times, and adds multi-head projections, but the core idea of all-pairs comparison is shared.",
            "\u5173\u7cfb\u7f51\u7edc\u7684\u8d21\u732e\u5728\u4e8e\u5176\u4f5c\u4e3a\u5f52\u7eb3\u504f\u7f6e\u7684\u6e05\u6670\u6027\uff1a\u5b83\u660e\u786e\u5730\u8bf4\u63a8\u7406\u5e94\u8be5\u901a\u8fc7\u6bd4\u8f83\u6240\u6709\u7269\u4f53\u5bf9\u6765\u5b8c\u6210\u3002\u8fd9\u4e2a\u53ef\u89e3\u91ca\u7684\u8bbe\u8ba1\u539f\u5219\u2014\u2014\u800c\u4e0d\u662f\u4ece\u68af\u5ea6\u4e0b\u964d\u4e2d\u9690\u5f0f\u6d8c\u73b0\u2014\u2014\u662f\u8fd9\u7bc7\u8bba\u6587\u5177\u6709\u5f71\u54cd\u529b\u7684\u539f\u56e0\u3002Transformer \u5c06\u5176\u63a8\u5e7f\u5230\u5e8f\u5217\uff0c\u591a\u6b21\u53e0\u52a0\u8be5\u64cd\u4f5c\uff0c\u5e76\u6dfb\u52a0\u591a\u5934\u6295\u5f71\uff0c\u4f46\u5168\u5bf9\u6bd4\u8f83\u7684\u6838\u5fc3\u601d\u60f3\u662f\u5171\u4eab\u7684\u3002"
          )}
        </p>

        <Collapsible title={t("Relation Networks in graph neural networks", "\u56fe\u795e\u7ecf\u7f51\u7edc\u4e2d\u7684\u5173\u7cfb\u7f51\u7edc")}>
          <p>
            {t(
              "The Relation Network is also closely related to Graph Neural Networks (GNNs). In a GNN, messages are passed along graph edges \u2014 each node aggregates messages from its neighbors. If you make the graph fully connected (every node connected to every other node), GNN message passing becomes equivalent to the RN: for each pair (i, j), compute a message g(o_i, o_j) and aggregate. This connection was formalized in the Neural Message Passing framework and later in works like Interaction Networks (Battaglia et al., 2016) which the same group developed.",
              "\u5173\u7cfb\u7f51\u7edc\u4e5f\u4e0e\u56fe\u795e\u7ecf\u7f51\u7edc\uff08GNN\uff09\u5bc6\u5207\u76f8\u5173\u3002\u5728 GNN \u4e2d\uff0c\u6d88\u606f\u6cbf\u56fe\u8fb9\u4f20\u9012\u2014\u2014\u6bcf\u4e2a\u8282\u70b9\u805a\u5408\u6765\u81ea\u5176\u90bb\u5c45\u7684\u6d88\u606f\u3002\u5982\u679c\u4f60\u4f7f\u56fe\u5b8c\u5168\u8fde\u63a5\uff08\u6bcf\u4e2a\u8282\u70b9\u4e0e\u5176\u4ed6\u6bcf\u4e2a\u8282\u70b9\u8fde\u63a5\uff09\uff0cGNN \u6d88\u606f\u4f20\u9012\u5c31\u7b49\u540c\u4e8e RN\uff1a\u5bf9\u4e8e\u6bcf\u5bf9 (i, j)\uff0c\u8ba1\u7b97\u6d88\u606f g(o_i, o_j) \u5e76\u805a\u5408\u3002\u8fd9\u79cd\u8054\u7cfb\u5728\u795e\u7ecf\u6d88\u606f\u4f20\u9012\u6846\u67b6\u4e2d\u5f97\u5230\u4e86\u5f62\u5f0f\u5316\uff0c\u540e\u6765\u5728\u540c\u4e00\u56e2\u961f\u5f00\u53d1\u7684\u4ea4\u4e92\u7f51\u7edc\uff08Battaglia \u7b49\uff0c2016\uff09\u7b49\u5de5\u4f5c\u4e2d\u4e5f\u6709\u4f53\u73b0\u3002"
            )}
          </p>
        </Collapsible>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-paper-200 dark:border-paper-700">
          <Link
            href={`${basePath}/papers`}
            className="text-blue-600 hover:underline text-sm"
          >
            {t("\u2190 Back to Papers", "\u2190 \u8fd4\u56de\u8bba\u6587\u5217\u8868")}
          </Link>
        </div>
      </article>
    </div>
  );
}
