/*
 * DESIGN: Luminous Covenant — Warm editorial + Data journalism
 * Colors: Cream bg (#FAF6EF) | Cobalt blue primary | Terracotta accent | Gold scripture
 * Typography: Playfair Display (headers) + Nunito (body) + JetBrains Mono (data)
 * Layout: Magazine-style editorial with full-width hero, alternating sections, data dashboard
 */

import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const aiAdoptionData = [
  { region: "Developed Nations", q1_2026: 27.5, q4_2025: 26.0, fill: "#1B4FD8" },
  { region: "Developing Nations", q1_2026: 15.4, q4_2025: 14.2, fill: "#C4622D" },
  { region: "Global Average", q1_2026: 17.8, q4_2025: 16.3, fill: "#D4A843" },
];

const computeCostData = [
  { name: "R&D Compute", value: 4.10, color: "#1B4FD8" },
  { name: "Inference Compute", value: 2.70, color: "#3B6FE8" },
  { name: "Staff & Other", value: 2.90, color: "#D4A843" },
];

const aiGapTrendData = [
  { year: "2023", developed: 12, developing: 7 },
  { year: "2024", developed: 19, developing: 10 },
  { year: "Q1 2025", developed: 23, developing: 12 },
  { year: "Q3 2025", developed: 26, developing: 14 },
  { year: "Q1 2026", developed: 27.5, developing: 15.4 },
];

const principlesData = [
  {
    subject: "Open Source",
    ancient: 70,
    modern: 85,
  },
  {
    subject: "Debt Release",
    ancient: 100,
    modern: 60,
  },
  {
    subject: "Open Hand",
    ancient: 90,
    modern: 55,
  },
  {
    subject: "Consecration",
    ancient: 85,
    modern: 40,
  },
  {
    subject: "Equality",
    ancient: 80,
    modern: 35,
  },
];

const scriptures = [
  {
    reference: "Deuteronomy 15:11",
    text: "For the poor shall never cease out of the land: therefore I command thee, saying, Thou shalt open thine hand wide unto thy brother, to thy poor, and to thy needy, in thy land.",
    theme: "Open Access",
    color: "cobalt",
  },
  {
    reference: "Deuteronomy 15:1",
    text: "At the end of every seven years thou shalt make a release.",
    theme: "Debt Forgiveness",
    color: "gold",
  },
  {
    reference: "Mosiah 4:26",
    text: "And now, for the sake of these things which I have spoken unto you—that is, for the sake of retaining a remission of your sins from day to day, that ye may walk guiltless before God—I would that ye should impart of your substance to the poor, every man according to that which he hath.",
    theme: "Imparting Substance",
    color: "terracotta",
  },
  {
    reference: "4 Nephi 1:3",
    text: "And they had all things common among them; therefore there were not rich and poor, bond and free, but they were all made free, and partakers of the heavenly gift.",
    theme: "True Equality",
    color: "cobalt",
  },
  {
    reference: "Jacob 2:19",
    text: "And after ye have obtained a hope in Christ ye shall obtain riches, if ye seek them; and ye will seek them for the intent to do good—to clothe the naked, and to feed the hungry, and to liberate the captive, and administer relief to the sick and the afflicted.",
    theme: "Purpose of Wealth",
    color: "gold",
  },
];

const applications = [
  {
    principle: "Debt Forgiveness",
    scripture: "Deut 15:1",
    ancient: "Releasing financial debts every 7 years to prevent a permanent underclass",
    modern: "Contribute to open-source AI models (Llama, Mistral, DeepSeek) that remove licensing 'debts' for smaller developers",
    icon: "🔓",
  },
  {
    principle: "Open Thine Hand",
    scripture: "Deut 15:11",
    ancient: "Generous giving proportional to the need of the poor",
    modern: "Build efficient, optimized models that run on consumer hardware, reducing compute cost barriers",
    icon: "🤲",
  },
  {
    principle: "Impart Substance",
    scripture: "Mosiah 4:26",
    ancient: "Sharing food, clothing, and wealth with the needy",
    modern: "Develop free or low-cost AI tools specifically for nonprofits, educators, and developing nations",
    icon: "🌱",
  },
  {
    principle: "All Things Common",
    scripture: "4 Nephi 1:3",
    ancient: "Eliminating class distinctions through shared resources",
    modern: "Create intuitive interfaces requiring no advanced technical skills — democratize AI for the average person",
    icon: "🌐",
  },
  {
    principle: "Seek Riches to Do Good",
    scripture: "Jacob 2:19",
    ancient: "Using wealth to bless others, not for pride",
    modern: "Design business models where enterprise profits subsidize free access tiers for students and low-income users",
    icon: "⚖️",
  },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value * 10) / 10);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}{display.toFixed(value % 1 !== 0 ? 1 : 0)}{suffix}
    </span>
  );
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1C1E] text-white px-4 py-3 rounded-lg shadow-xl text-sm font-body">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.fill }}>
            {p.name}: <span className="font-mono-data font-medium">{p.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [activeScripture, setActiveScripture] = useState(0);
  const [activeTab, setActiveTab] = useState<"ancient" | "modern">("ancient");

  return (
    <div className="min-h-screen bg-[#FAF6EF] font-body">
      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#FAF6EF]/90 backdrop-blur-md border-b border-[#E8DFD0]">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4FD8] to-[#D4A843] flex items-center justify-center text-white text-xs font-bold">
              ✦
            </div>
            <span className="font-display font-semibold text-[#1C1C1E] text-sm hidden sm:block">
              Democratizing AI
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold text-[#666] uppercase tracking-widest">
            <a href="#lesson" className="hover:text-[#1B4FD8] transition-colors">The Lesson</a>
            <a href="#divide" className="hover:text-[#1B4FD8] transition-colors">The Divide</a>
            <a href="#principles" className="hover:text-[#1B4FD8] transition-colors">Principles</a>
            <a href="#action" className="hover:text-[#1B4FD8] transition-colors">Our Mission</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663669404695/9g4PRANA78RhFuymbJ8jAK/hero_covenant-eHF2fnfnkBBuEFig83JEpC.webp)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1B2D]/90 via-[#0F1B2D]/70 to-transparent" />
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-[#D4A843]/20 border border-[#D4A843]/40 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[#D4A843] text-xs font-semibold uppercase tracking-widest">
                  Come Follow Me · May 11–17 · Deuteronomy 15
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Democratizing AI:
                <br />
                <span className="text-[#D4A843] italic">A Vision of Equity</span>
                <br />
                and Consecration
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-[#C8D4E8] text-lg leading-relaxed mb-8 max-w-xl">
                Ancient scripture reveals a timeless mandate: open your hand wide to those in need.
                As AI developers, we carry this same calling — to ensure the blessings of artificial
                intelligence reach all of God's children, not just the privileged few.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#lesson"
                  className="bg-[#1B4FD8] hover:bg-[#1540B0] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95"
                >
                  Explore the Lesson
                </a>
                <a
                  href="#action"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95"
                >
                  Our Team's Mission
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Lesson Overview ────────────────────────────────────────────────── */}
      <section id="lesson" className="py-20 bg-[#FAF6EF]">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-[#1B4FD8] text-xs font-semibold uppercase tracking-widest mb-3">
                Come, Follow Me · Old Testament 2026
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1C1E] mb-4">
                "Beware Lest Thou Forget the Lord"
              </h2>
              <div className="section-divider w-24 mx-auto mb-6" />
              <p className="text-[#555] max-w-2xl mx-auto leading-relaxed">
                Moses's final words to Israel in Deuteronomy were not about military strategy or
                national policy — they were about the condition of the heart. The lesson for May 11–17
                centers on love, remembrance, and radical generosity toward the vulnerable.
              </p>
            </div>
          </ScrollReveal>

          {/* Scripture Carousel */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <ScrollReveal delay={100}>
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1C1E] mb-6">
                  Key Scriptures
                </h3>
                <div className="space-y-3">
                  {scriptures.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveScripture(i)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        activeScripture === i
                          ? "bg-[#1B4FD8] text-white border-[#1B4FD8] shadow-lg"
                          : "bg-white text-[#1C1C1E] border-[#E8DFD0] hover:border-[#1B4FD8]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${
                          activeScripture === i ? "text-[#A8C4FF]" : "text-[#1B4FD8]"
                        }`}>
                          {s.reference}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activeScripture === i
                            ? "bg-white/20 text-white"
                            : s.color === "cobalt"
                            ? "bg-[#1B4FD8]/10 text-[#1B4FD8]"
                            : s.color === "gold"
                            ? "bg-[#D4A843]/15 text-[#A07820]"
                            : "bg-[#C4622D]/10 text-[#C4622D]"
                        }`}>
                          {s.theme}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="scripture-card p-8 min-h-[280px] flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#A07820] mb-4">
                    {scriptures[activeScripture].reference}
                  </p>
                  <blockquote className="font-display text-xl italic text-[#1C1C1E] leading-relaxed mb-6">
                    "{scriptures[activeScripture].text}"
                  </blockquote>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-12 bg-gradient-to-b from-[#D4A843] to-[#1B4FD8] rounded-full" />
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-wide">Theme</p>
                    <p className="font-semibold text-[#1C1C1E]">{scriptures[activeScripture].theme}</p>
                  </div>
                </div>
              </div>

              {/* Deuteronomy 15 Summary */}
              <div className="mt-6 bg-[#1C1C1E] text-white rounded-xl p-6">
                <h4 className="font-display text-lg font-semibold mb-3 text-[#D4A843]">
                  Deuteronomy 15 — Laws Regarding the Poor
                </h4>
                <div className="space-y-3 text-sm text-[#C8D4E8] leading-relaxed">
                  <p>
                    <span className="text-[#D4A843] font-semibold">The Year of Release (v. 1–6):</span>{" "}
                    Every seven years, all debts among Israelites were cancelled — ensuring no permanent
                    underclass could form. This was called "the LORD's release."
                  </p>
                  <p>
                    <span className="text-[#D4A843] font-semibold">Open Thine Hand (v. 7–11):</span>{" "}
                    God commanded Israel not to harden their hearts or shut their hands from the poor,
                    but to give generously and willingly — not grudgingly.
                  </p>
                  <p>
                    <span className="text-[#D4A843] font-semibold">Freedom from Servitude (v. 12–15):</span>{" "}
                    Even servants were released after six years, and sent away with generous provisions
                    to start their new life — never empty-handed.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── The AI Divide ──────────────────────────────────────────────────── */}
      <section id="divide" className="py-20 bg-[#1C1C1E]">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-widest mb-3">
                The Modern Challenge
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                The AI "Great Divergence"
              </h2>
              <div className="section-divider w-24 mx-auto mb-6" />
              <p className="text-[#8A9AB5] max-w-2xl mx-auto leading-relaxed">
                Just as ancient Israel faced the risk of a permanent underclass, today's AI revolution
                threatens to create a permanent "intelligence gap" between the wealthy and the rest of
                the world. The UN has likened this to the Great Divergence of the Industrial Revolution.
              </p>
            </div>
          </ScrollReveal>

          {/* Stat Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { label: "Developed Nations AI Usage", value: 27.5, suffix: "%", note: "Q1 2026", color: "#1B4FD8" },
              { label: "Developing Nations AI Usage", value: 15.4, suffix: "%", note: "Q1 2026", color: "#C4622D" },
              { label: "Anthropic Compute Spend", value: 9.7, prefix: "$", suffix: "B", note: "2025 Total", color: "#D4A843" },
              { label: "AI Adoption Gap", value: 12.1, suffix: "pts", note: "Widening yearly", color: "#5B8AF0" },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="stat-card p-6">
                  <p className="text-[#8A9AB5] text-xs uppercase tracking-widest mb-3">{stat.label}</p>
                  <p className="font-display text-4xl font-bold mb-1" style={{ color: stat.color }}>
                    <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </p>
                  <p className="text-[#666] text-xs font-mono-data">{stat.note}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Adoption Gap Trend */}
            <ScrollReveal delay={100}>
              <div className="bg-[#252525] rounded-xl p-6">
                <h3 className="font-display text-lg font-semibold text-white mb-1">
                  AI Adoption: The Widening Gap
                </h3>
                <p className="text-[#8A9AB5] text-xs mb-6">% of working-age population using generative AI</p>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={aiGapTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="year" stroke="#666" tick={{ fontSize: 11, fill: "#888" }} />
                    <YAxis stroke="#666" tick={{ fontSize: 11, fill: "#888" }} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "#aaa", fontSize: 12 }}>{value}</span>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="developed"
                      name="Developed Nations"
                      stroke="#1B4FD8"
                      strokeWidth={2.5}
                      dot={{ fill: "#1B4FD8", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="developing"
                      name="Developing Nations"
                      stroke="#C4622D"
                      strokeWidth={2.5}
                      dot={{ fill: "#C4622D", r: 4 }}
                      strokeDasharray="5 3"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            {/* Compute Cost Breakdown */}
            <ScrollReveal delay={200}>
              <div className="bg-[#252525] rounded-xl p-6">
                <h3 className="font-display text-lg font-semibold text-white mb-1">
                  Where AI Money Goes
                </h3>
                <p className="text-[#8A9AB5] text-xs mb-6">Anthropic 2025 spend breakdown ($9.7B total)</p>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="60%" height={200}>
                    <PieChart>
                      <Pie
                        data={computeCostData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {computeCostData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`$${value}B`, ""]}
                        contentStyle={{ background: "#1C1C1E", border: "none", borderRadius: 8, color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {computeCostData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                        <div>
                          <p className="text-white text-xs font-semibold">{item.name}</p>
                          <p className="font-mono-data text-[#888] text-xs">${item.value}B</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-[#333]">
                      <p className="text-[#888] text-xs">Compute = <span className="text-[#D4A843] font-semibold">70%</span> of total spend</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* AI Adoption by Region Bar Chart */}
          <ScrollReveal delay={100}>
            <div className="mt-8 bg-[#252525] rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-1">
                AI Usage by Economic Region (Q1 2026)
              </h3>
              <p className="text-[#8A9AB5] text-xs mb-6">% of working-age population (15–64) using generative AI — Microsoft Research</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={aiAdoptionData} layout="vertical" barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                  <XAxis type="number" stroke="#666" tick={{ fontSize: 11, fill: "#888" }} unit="%" domain={[0, 35]} />
                  <YAxis type="category" dataKey="region" stroke="#666" tick={{ fontSize: 12, fill: "#ccc" }} width={140} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="q1_2026" name="Q1 2026" radius={[0, 4, 4, 0]}>
                    {aiAdoptionData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollReveal>

          {/* Globe Image + Quote */}
          <ScrollReveal delay={200}>
            <div className="mt-8 grid lg:grid-cols-2 gap-8 items-center">
              <div
                className="rounded-xl overflow-hidden h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663669404695/9g4PRANA78RhFuymbJ8jAK/ai_globe-EcvqLgbZvb9pf4X7CjhWz4.webp)`,
                }}
              />
              <div>
                <blockquote className="font-display text-2xl italic text-white leading-relaxed mb-4">
                  "The goal is to democratize access to AI so that every country and community can
                  benefit while protecting those most at risk from disruption."
                </blockquote>
                <p className="text-[#D4A843] text-sm font-semibold">— UN Development Programme Report, 2025</p>
                <p className="text-[#8A9AB5] text-sm mt-4 leading-relaxed">
                  AI is becoming as essential as electricity, roads, and the internet. Without intentional
                  action, billions will be left behind — invisible in the data, excluded from the economy.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Principles Bridge ──────────────────────────────────────────────── */}
      <section id="principles" className="py-20 bg-[#FAF6EF]">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-[#C4622D] text-xs font-semibold uppercase tracking-widest mb-3">
                Ancient Wisdom · Modern Application
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1C1E] mb-4">
                The Bridge: Scripture to Code
              </h2>
              <div className="section-divider w-24 mx-auto mb-6" />
              <p className="text-[#555] max-w-2xl mx-auto leading-relaxed">
                The principles God gave Moses are not relics of the past — they are a living blueprint
                for how we build technology. Each ancient command has a direct, actionable parallel
                for our AI development team.
              </p>
            </div>
          </ScrollReveal>

          {/* Tab Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#E8DFD0] rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setActiveTab("ancient")}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  activeTab === "ancient"
                    ? "bg-white text-[#1C1C1E] shadow-sm"
                    : "text-[#888] hover:text-[#1C1C1E]"
                }`}
              >
                📜 Ancient Principle
              </button>
              <button
                onClick={() => setActiveTab("modern")}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  activeTab === "modern"
                    ? "bg-[#1B4FD8] text-white shadow-sm"
                    : "text-[#888] hover:text-[#1C1C1E]"
                }`}
              >
                💻 Modern Application
              </button>
            </div>
          </div>

          {/* Application Cards */}
          <div className="space-y-4">
            {applications.map((app, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-white rounded-xl border border-[#E8DFD0] overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-stretch">
                    {/* Icon + Principle */}
                    <div className="bg-gradient-to-b from-[#1B4FD8]/5 to-[#1B4FD8]/10 p-6 flex flex-col items-center justify-center min-w-[120px] border-r border-[#E8DFD0]">
                      <span className="text-3xl mb-2">{app.icon}</span>
                      <p className="text-[#1B4FD8] text-xs font-bold text-center uppercase tracking-wide leading-tight">
                        {app.principle}
                      </p>
                      <p className="text-[#888] text-xs mt-1 font-mono-data">{app.scripture}</p>
                    </div>
                    {/* Content */}
                    <div className="p-6 flex-1 grid sm:grid-cols-2 gap-4">
                      <div
                        className={`transition-all duration-300 ${
                          activeTab === "ancient" ? "opacity-100" : "opacity-40"
                        }`}
                      >
                        <p className="text-xs font-semibold text-[#D4A843] uppercase tracking-wide mb-2">
                          📜 Ancient Context
                        </p>
                        <p className="text-[#444] text-sm leading-relaxed">{app.ancient}</p>
                      </div>
                      <div
                        className={`transition-all duration-300 ${
                          activeTab === "modern" ? "opacity-100" : "opacity-40"
                        }`}
                      >
                        <p className="text-xs font-semibold text-[#1B4FD8] uppercase tracking-wide mb-2">
                          💻 AI Dev Application
                        </p>
                        <p className="text-[#444] text-sm leading-relaxed">{app.modern}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Radar Chart */}
          <ScrollReveal delay={200}>
            <div className="mt-16 bg-white rounded-xl border border-[#E8DFD0] p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[#1C1C1E] mb-4">
                    How Well Are We Applying These Principles?
                  </h3>
                  <p className="text-[#555] text-sm leading-relaxed mb-6">
                    The ancient Israelites were commanded to live these principles fully. As modern AI
                    developers, we have the tools and knowledge — but are we applying them with the same
                    intentionality? This radar shows the gap between the ancient ideal and current
                    industry practice.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-0.5 bg-[#1B4FD8]" />
                      <span className="text-[#555]">Ancient Ideal (Deuteronomy + Book of Mormon)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-0.5 bg-[#C4622D] border-dashed border-t-2 border-[#C4622D]" />
                      <span className="text-[#555]">Current AI Industry Practice</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={principlesData}>
                    <PolarGrid stroke="#E8DFD0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#555" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#aaa" }} />
                    <Radar
                      name="Ancient Ideal"
                      dataKey="ancient"
                      stroke="#1B4FD8"
                      fill="#1B4FD8"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Current Industry"
                      dataKey="modern"
                      stroke="#C4622D"
                      fill="#C4622D"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="5 3"
                    />
                    <Legend formatter={(value) => <span style={{ color: "#555", fontSize: 12 }}>{value}</span>} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Book of Mormon Connection ──────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#1B4FD8] to-[#0F2A7A]">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-[#A8C4FF] text-xs font-semibold uppercase tracking-widest mb-3">
                Book of Mormon Witness
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                A Second Witness of Equity
              </h2>
              <div className="w-24 h-0.5 bg-[#D4A843] mx-auto mb-6" />
              <p className="text-[#A8C4FF] max-w-2xl mx-auto leading-relaxed">
                The Book of Mormon amplifies and expands the principles of Deuteronomy 15, showing
                both the glorious potential of a consecrated society and the tragic consequences
                of inequality and pride.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "King Benjamin's Address",
                reference: "Mosiah 4:16–26",
                text: "We are all beggars before God. King Benjamin's revolutionary discourse on poverty commands us to give without judgment, recognizing that we ourselves depend entirely on God's grace.",
                lesson: "We build AI not because we are superior, but because we are stewards of a gift we did not earn.",
                icon: "👑",
              },
              {
                title: "The Zion Society",
                reference: "4 Nephi 1:3",
                text: "After Christ's visit, the Nephites achieved 200 years of peace because 'there were not rich and poor.' All things were held in common. This is the ultimate vision of a consecrated community.",
                lesson: "Our goal is not just to build AI — it is to build toward a world where AI creates no new poor.",
                icon: "✨",
              },
              {
                title: "Jacob's Warning",
                reference: "Jacob 2:13–19",
                text: "Jacob rebuked the Nephites for seeking riches before the kingdom of God, causing pride and inequality. But he also showed the right path: seek riches to do good.",
                lesson: "AI monetization is not wrong — but our primary motivation must be to bless, not to profit.",
                icon: "⚖️",
              },
              {
                title: "Lehi's Parallel",
                reference: "2 Nephi 2:26–29",
                text: "Lehi expanded Moses's teaching on choosing life, connecting it to the Atonement of Christ. We are free to act for ourselves — including choosing to use our skills for equity.",
                lesson: "We choose daily whether our code serves the many or the few. Agency is a gift and a responsibility.",
                icon: "🌿",
              },
              {
                title: "Alma's Community",
                reference: "Alma 1:27",
                text: "The people of Alma 'did not send away any who were naked, or that were hungry, or that were athirst, or that were sick, or that had not been nourished.' They gave according to what they had.",
                lesson: "We give what we can: open-source code, free tiers, accessible documentation, mentorship.",
                icon: "🤝",
              },
              {
                title: "The Prophet Like Moses",
                reference: "Deuteronomy 18:15–19",
                text: "Moses prophesied of Jesus Christ, who would come to fulfill and expand the law. Christ's ministry was defined by reaching the poor, the sick, and the marginalized.",
                lesson: "We follow Christ's example when we ensure our AI tools reach those who need them most.",
                icon: "✝️",
              },
            ].map((card, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-colors duration-200">
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <h3 className="font-display text-lg font-semibold text-white mb-1">{card.title}</h3>
                  <p className="text-[#A8C4FF] text-xs font-mono-data mb-3">{card.reference}</p>
                  <p className="text-[#C8D8F0] text-sm leading-relaxed mb-4">{card.text}</p>
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-xs font-semibold text-[#D4A843] uppercase tracking-wide mb-1">For Our Team</p>
                    <p className="text-white text-sm leading-relaxed italic">{card.lesson}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Mission / Action ───────────────────────────────────────────── */}
      <section id="action" className="py-20 bg-[#FAF6EF]">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-[#C4622D] text-xs font-semibold uppercase tracking-widest mb-3">
                Our Team's Mandate
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1C1E] mb-4">
                "Open Thine Hand Wide"
                <br />
                <span className="text-[#1B4FD8]">in the Age of AI</span>
              </h2>
              <div className="section-divider w-24 mx-auto mb-6" />
              <p className="text-[#555] max-w-2xl mx-auto leading-relaxed">
                We may be stretched and limited by funds, but our vision is not constrained. The Lord
                promised Israel that if they cared for the poor, He would bless them. We can trust the
                same principle applies to our work.
              </p>
            </div>
          </ScrollReveal>

          {/* Open Hand Image + Action Items */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <ScrollReveal delay={100}>
              <div
                className="rounded-2xl overflow-hidden h-80 bg-cover bg-center shadow-xl"
                style={{
                  backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663669404695/9g4PRANA78RhFuymbJ8jAK/open_hand-aGt72zE7uRemDJRYMqiQke.webp)`,
                }}
              />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1C1E] mb-6">
                  Practical Steps for Our Team
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Embrace Open Source",
                      desc: "Contribute to and build upon open-source AI models. When we release our work freely, we cancel the 'debt' that proprietary AI creates for smaller developers and communities.",
                    },
                    {
                      step: "02",
                      title: "Optimize for Efficiency",
                      desc: "Design models that run on modest hardware. Reducing compute requirements is the modern equivalent of 'opening your hand wide' — it removes the financial barrier to access.",
                    },
                    {
                      step: "03",
                      title: "Build for the Margins",
                      desc: "Intentionally design for users in developing nations, low-income communities, and non-technical users. If our AI only works for the tech-savvy elite, we have failed our mandate.",
                    },
                    {
                      step: "04",
                      title: "Subsidize Access",
                      desc: "Where we do monetize, create genuine free tiers and educational licenses. Let enterprise revenue fund access for those who cannot pay.",
                    },
                    {
                      step: "05",
                      title: "Measure Equity, Not Just Revenue",
                      desc: "Track who is using our tools. If our user base is only wealthy and educated, we have more work to do. Consecration requires accountability.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1B4FD8]/10 flex items-center justify-center">
                        <span className="font-mono-data text-[#1B4FD8] text-xs font-bold">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1C1C1E] mb-1">{item.title}</h4>
                        <p className="text-[#666] text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Final Promise */}
          <ScrollReveal delay={100}>
            <div className="bg-[#1C1C1E] rounded-2xl p-10 text-center">
              <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-widest mb-4">
                The Promise
              </p>
              <blockquote className="font-display text-2xl sm:text-3xl italic text-white leading-relaxed mb-6 max-w-3xl mx-auto">
                "For the LORD thy God will bless thee in all thy works, and in all that thou puttest
                thine hand unto."
              </blockquote>
              <p className="text-[#A8C4FF] text-sm mb-8">— Deuteronomy 15:10</p>
              <p className="text-[#8A9AB5] max-w-2xl mx-auto leading-relaxed">
                The same God who commanded Israel to release debts and open their hands wide is the
                same God who can bless our team's work. When we build AI that serves the poor, the
                marginalized, and the underserved, we are not just writing code — we are fulfilling
                an ancient, sacred mandate.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0F1B2D] py-12">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1B4FD8] to-[#D4A843]" />
                <span className="font-display font-semibold text-white">Democratizing AI</span>
              </div>
              <p className="text-[#8A9AB5] text-sm leading-relaxed">
                A presentation connecting the Come Follow Me lesson for May 11–17 (Deuteronomy 15)
                to our mission as AI developers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Key Scriptures</h4>
              <ul className="space-y-2 text-[#8A9AB5] text-sm">
                <li>Deuteronomy 15:1–15</li>
                <li>Mosiah 4:16–26</li>
                <li>4 Nephi 1:3</li>
                <li>Jacob 2:13–19</li>
                <li>2 Nephi 2:26–29</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Data Sources</h4>
              <ul className="space-y-2 text-[#8A9AB5] text-sm">
                <li>Microsoft AI Diffusion Report Q1 2026</li>
                <li>UN Development Programme, Dec 2025</li>
                <li>Visual Capitalist / Epoch AI, Apr 2026</li>
                <li>AP News / UNDP Report, Dec 2025</li>
                <li>Church of Jesus Christ CFM 2026</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1C2A3A] pt-6 text-center">
            <p className="text-[#555] text-xs">
              Prepared for AI Development Team · Come Follow Me Lesson May 11–17, 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
