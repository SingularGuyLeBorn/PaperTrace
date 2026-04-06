"use client";

import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function JobHuntNotesPage() {
  const { t } = useLang();
  const basePath = process.env.NODE_ENV === "production" ? "/PaperTrace" : "";

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href={`${basePath}/interview`}
        className="inline-flex items-center gap-1.5 text-sm text-paper-800/50 dark:text-slate-400 hover:text-paper-800 dark:hover:text-slate-200 transition-colors mb-10"
      >
        ← {t("Back to Job Hunt", "返回找工")}
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3 dark:text-slate-100">
          {t("Notes on the Job Hunt", "写在找工路上")}
        </h1>
        <p className="text-paper-800/50 dark:text-slate-400 leading-relaxed">
          {t(
            "A few observations from years of recruiting — US and China. A letter to a fellow traveler, not a how-to guide.",
            "一些找工的体会与记录，写给同路人的一封信。"
          )}
        </p>
      </header>

      <article className="space-y-10">

        {/* ── 1. Timing & Luck ── */}
        <section className="border-l-4 border-blue-300 dark:border-blue-600 pl-5">
          <h2 className="text-lg font-bold mb-3 dark:text-slate-100">
            {t("1. Timing & Luck", "一、时机与运气")}
          </h2>
          <div className="space-y-3 text-sm text-paper-800/75 dark:text-slate-300 leading-relaxed">
            <p>
              {t(
                "Markets shift year to year in ways that are hard to predict. Headcount opens and closes based on macro forces far outside your control. This isn't discouraging — it just means the outcome isn't purely a referendum on how hard you worked.",
                "每年的市场都不一样，HC 的多少受宏观因素影响，很难预判。这不是在打击人，而是说结果不完全是努力程度的体现。"
              )}
            </p>
            <p>
              {t(
                "Luck is a real variable. The same resume, the same prep, a different week — a different outcome. Accept this, don't internalize every rejection as a personal failing.",
                "运气是真实存在的变量。同样的简历、同样的准备，不同的时间节点，可能完全不同的结果。接受这一点，不要把每次被拒都归因于自身。"
              )}
            </p>
            <p>
              {t(
                "What you can control: build real foundations, stay consistent, and when an opening appears — be ready.",
                "你能控制的是：把基础打扎实，保持节奏，机会来了能接住。"
              )}
            </p>
          </div>
        </section>

        {/* ── 2. Information ── */}
        <section className="border-l-4 border-emerald-300 dark:border-emerald-600 pl-5">
          <h2 className="text-lg font-bold mb-3 dark:text-slate-100">
            {t("2. Information", "二、信息差")}
          </h2>
          <div className="space-y-3 text-sm text-paper-800/75 dark:text-slate-300 leading-relaxed">
            <p>
              {t(
                "Knowing a position opened — before most people do — is itself an advantage. A lot of opportunities have already closed by the time they show up in your feed.",
                "在别人知道之前得知某个岗位开放了，本身就是优势。很多机会等到出现在你的信息流时已经截止了。"
              )}
            </p>
            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-700/40 rounded-xl">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2 uppercase tracking-wide">
                {t("Act first, iterate after", "先行动，边做边改")}
              </p>
              <ul className="space-y-2 text-emerald-900/80 dark:text-emerald-200/80 list-disc pl-4">
                <li>{t("Submit the imperfect resume. A submitted resume can move; a draft in Google Docs can't.", "把还不完美的简历先投出去。已经投出的简历才有可能进入下一轮，放在文档里的什么都做不了。")}</li>
                <li>{t("Treat daily applications like a recurring task, not a milestone you do once.", "把每天投简历当成日常任务，而不是某个时机成熟后做一次的事情。")}</li>
                <li>{t("Debrief after each stage — resume screen, phone screen, final round. What pattern do you see? What's the next lever to pull?", "每个阶段后及时复盘 — 简历筛选、电话面试、终面。发现什么规律？下一步该优化哪里？")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 3. Connection ── */}
        <section className="border-l-4 border-violet-300 dark:border-violet-600 pl-5">
          <h2 className="text-lg font-bold mb-3 dark:text-slate-100">
            {t("3. Connection", "三、人脉")}
          </h2>
          <div className="space-y-3 text-sm text-paper-800/75 dark:text-slate-300 leading-relaxed">
            <p>
              {t(
                "Targeted outreach beats volume applications. A referral routed to the right team — not just dropped in the general portal — is worth many cold applications. Alumni who graduated a few years ago, seniors already in the industry: they know the landscape and often want to help.",
                "有针对性的联系胜过大量海投。一封直接到达目标组的内推，比很多冷申请都有效。毕业几年的学长学姐、已经在业内的前辈，他们了解行情，而且往往愿意帮忙。"
              )}
            </p>
            <p>
              {t(
                "Low-stakes conversations have unexpectedly high returns. Catching up with someone you already know — what they're working on, what you're working on — sometimes opens doors you didn't know existed. It doesn't have to be transactional to be useful.",
                "低门槛的日常交流有时候回报超出预期。和认识的人聊聊各自在做什么，有时候就打开了你不知道存在的门。不需要带着明确目的，自然的联系本身就有价值。"
              )}
            </p>
            <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/15 border border-violet-200 dark:border-violet-700/40 rounded-xl">
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 mb-2 uppercase tracking-wide">
                {t("On study communities", "关于社群")}
              </p>
              <p className="text-violet-900/80 dark:text-violet-200/80">
                {t(
                  "The most valuable thing isn't a community that shares job listings — it's one where people share information, hold each other accountable, and keep each other going through the hard parts.",
                  "最有价值的不是分享岗位信息的社群，而是能互通信息、相互督促、在最难的时候彼此撑着的那种。"
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. Mindset ── */}
        <section className="border-l-4 border-rose-300 dark:border-rose-600 pl-5">
          <h2 className="text-lg font-bold mb-3 dark:text-slate-100">
            {t("4. Mindset", "四、心态")}
          </h2>
          <div className="space-y-3 text-sm text-paper-800/75 dark:text-slate-300 leading-relaxed">
            <p>
              {t(
                "Job hunting has a low feedback rate and a long time horizon. You will send things into the void and hear nothing. You will do well in an interview and not move forward. This is normal — it doesn't mean you're doing it wrong.",
                "找工作的正反馈率很低，时间线很长。你会把简历投出去然后什么都没有。你会面试发挥得不错但没有下一轮。这很正常，不代表你做错了什么。"
              )}
            </p>
            <p>
              {t(
                "Many people don't land an offer until May or June. A slow start isn't a sign that something has gone wrong. The finish line is the same regardless of when you left the gate.",
                "很多人到 5、6 月才拿到 offer。前期进展慢不代表出了问题。终点线在哪里，不取决于你什么时候出发。"
              )}
            </p>
          </div>
        </section>

        {/* ── 5. China ── */}
        <section className="border-l-4 border-amber-300 dark:border-amber-600 pl-5">
          <h2 className="text-lg font-bold mb-3 dark:text-slate-100">
            {t("5. Notes for China Recruiting", "五、关于国内校招")}
          </h2>
          <div className="space-y-3 text-sm text-paper-800/75 dark:text-slate-300 leading-relaxed">
            <p>
              {t(
                "Domestic recruiting is dense — summer internships, early admission, fall and spring recruiting all overlap. Map out the phases early so you don't end up with five OAs on the same weekend. Foreign companies (Microsoft, NVIDIA, Google, Amazon) often run on different schedules than domestic tech — check their sites and official accounts, don't assume the timelines match.",
                "国内校招节奏很紧凑，暑期实习、提前批、秋招、春招时间线重叠严重。提前规划阶段，不要让笔试面试堆到同一周。外企（微软、英伟达、谷歌、亚马逊等）的时间线往往和国内大厂不一样 — 分别关注官网和公众号，不要假设时间一致。"
              )}
            </p>
            <p>
              {t(
                "Within the same company, different teams are very different. If you have any connections inside, ask specifically about the team — culture, work style, growth path. Push for a referral directly to the team, not just the company portal.",
                "同一家公司的不同组，差异可以很大。如果有内部联系，尽量了解具体的组 — 氛围、工作方式、晋升路径。内推也尽量推到具体的组，不只是投公司系统。"
              )}
            </p>
            <p>
              {t(
                "Interview is a two-way process. You're also evaluating them. If you don't know something, say so — don't invent. Redirect to what you do know. Confidence and honesty read better than a nervous attempt to fill every blank.",
                "面试是双向选择。你也在评估对方。不会的就直接说，不要乱答。引导到你熟悉的方向。自信、诚实比紧张地强行填满每个空白效果好得多。"
              )}
            </p>
          </div>
        </section>

        {/* ── 6. US Interviews ── */}
        <section className="border-l-4 border-blue-300 dark:border-blue-600 pl-5">
          <h2 className="text-lg font-bold mb-3 dark:text-slate-100">
            {t("6. US Interviews", "六、北美面试")}
          </h2>
          <div className="space-y-3 text-sm text-paper-800/75 dark:text-slate-300 leading-relaxed">
            <p>
              {t(
                "US technical interviews care as much about how you think as what you produce. Explain your reasoning out loud. When you choose an approach, say why. Interviewers are also asking: would I enjoy working with this person? Communication is not a soft add-on — it's part of the signal.",
                "北美技术面试同等看重思考过程和最终结果。大声解释你的思路，说明为什么选这个方案。面试官也在问自己：我愿意和这个人一起工作吗？沟通能力不是加分项，是考核本身的一部分。"
              )}
            </p>
            <p>
              {t(
                "Career fairs, info sessions, tech talks: most produce nothing directly. Go anyway — occasionally. All you need is one useful conversation.",
                "Career fair、info session、tech talk：大多数时候没什么直接收获。偶尔还是去一去 — 你只需要一次有用的对话。"
              )}
            </p>
            <p>
              {t(
                "School mailing lists, department Slack channels, faculty talks — these often carry opportunities that never get posted publicly. Worth staying plugged in, or asking a friend in the right department to forward relevant emails.",
                "学校的邮件列表、院系 Slack、faculty talk — 这些渠道里有很多从不公开发布的机会。值得保持关注，或者让相关院系的朋友帮忙转发邮件。"
              )}
            </p>
            <p>
              {t(
                "The path has more flexibility than it looks — an extra semester, a domestic internship, converting early, working under OPT. These aren't failures; they're options. Think through the tradeoffs and act deliberately.",
                "路比看起来灵活得多。延毕一学期、回国实习积累经验、提前拿转正、挂 OPT 先工作 — 这些都不是失败，是可以权衡的选项。想清楚利弊再行动。"
              )}
            </p>
          </div>
        </section>

        {/* ── Closing ── */}
        <div className="pt-8 border-t border-paper-200 dark:border-slate-700">
          <div className="space-y-2 text-sm text-paper-800/50 dark:text-slate-500 italic">
            <p>{t('"Slow is smooth, smooth is fast."', "「事缓则圆，人缓则安」")}</p>
            <p>{t('"If you want to go fast, go alone. If you want to go far, go together."', "「一人独行走得快，与人同行走得远」")}</p>
            <p>{t('"All problems are people problems."', "「All problems are people problems」")}</p>
            <p>{t('"Sometimes, it\'s okay to give yourself grace."', "「有时候，也可以学会放过自己。只要心里有岸，就会有上不完的岸。」")}</p>
          </div>
          <p className="text-sm text-paper-800/35 dark:text-slate-600 mt-6">
            {t(
              "Hope we all find our own rhythm, pass through the fog, and reach the light.",
              "希望我们都能找到属于自己的节奏，穿越迷雾，迎来光亮。"
            )}
          </p>
        </div>
      </article>
    </div>
  );
}
