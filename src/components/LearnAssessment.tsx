"use client";

import { useState, useCallback, useEffect } from "react";
import {
  QUESTIONS,
  RANKINGS,
  RANKING_LABELS,
  APPROACHES,
  calculateResults,
  type Ranking,
  type Responses,
  type AssessmentResults,
  type Color,
} from "@/lib/learn-assessment-data";

// ─── Color utilities ─────────────────────────────────────────────
const COLOR_BG: Record<Color, string> = {
  gold: "bg-[#D4A843]",
  green: "bg-[#38A169]",
  orange: "bg-[#ED8936]",
  blue: "bg-[#2B6CB0]",
};

const COLOR_TEXT: Record<Color, string> = {
  gold: "text-[#D4A843]",
  green: "text-[#38A169]",
  orange: "text-[#ED8936]",
  blue: "text-[#2B6CB0]",
};

const COLOR_BORDER: Record<Color, string> = {
  gold: "border-[#D4A843]",
  green: "border-[#38A169]",
  orange: "border-[#ED8936]",
  blue: "border-[#2B6CB0]",
};

const COLOR_BG_LIGHT: Record<Color, string> = {
  gold: "bg-[#D4A843]/10",
  green: "bg-[#38A169]/10",
  orange: "bg-[#ED8936]/10",
  blue: "bg-[#2B6CB0]/10",
};

// ─── Types ───────────────────────────────────────────────────────
type Step = "intro" | "opener" | "questions" | "extra" | "results";

interface UserInfo {
  name: string;
  email: string;
}

interface ExtraAnswers {
  leaderType: string | null;
  developsOthers: string | null;
}

// ─── Main Component ──────────────────────────────────────────────
export default function LearnAssessment() {
  const [step, setStep] = useState<Step>("intro");
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "" });
  const [situationalNote, setSituationalNote] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Responses>(
    Array.from({ length: 10 }, () => [null, null, null, null])
  );
  const [extraAnswers, setExtraAnswers] = useState<ExtraAnswers>({
    leaderType: null,
    developsOthers: null,
  });
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [emailStatus, setEmailStatus] = useState<"pending" | "sent" | "failed">(
    "pending"
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, currentQuestion]);

  const handleComplete = useCallback(() => {
    const r = calculateResults(responses);
    setResults(r);
    setStep("results");

    const source =
      new URLSearchParams(window.location.search).get("source") || "direct";
    const tag =
      new URLSearchParams(window.location.search).get("tag") ||
      "LEARN_ASSESSMENT";

    fetch("/api/learn-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userInfo.name,
        email: userInfo.email,
        goldScore: r.scores.gold,
        greenScore: r.scores.green,
        orangeScore: r.scores.orange,
        blueScore: r.scores.blue,
        primaryApproach: r.primary.color,
        secondaryApproach: r.secondary.color,
        blindSpot: r.blindSpot.color,
        combinationTitle: r.combinationTitle,
        adaptabilityScore: r.adaptabilityScore,
        leaderType: extraAnswers.leaderType,
        developsOthers: extraAnswers.developsOthers,
        situationalNote,
        source,
        tag,
        responses,
        positionFrequency: r.positionFrequency,
        rankings: r.personalityRankings,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (data?.emailSent) setEmailStatus("sent");
        else setEmailStatus("failed");
      })
      .catch(() => setEmailStatus("failed"));
  }, [responses, userInfo, extraAnswers, situationalNote]);

  // ─── Intro Screen ──────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="w-full max-w-xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-learn2-gray mb-5">
              5-Minute Assessment
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-learn2-text mb-5 leading-tight">
              Your Natural Learning Approach
            </h1>
            <p className="text-learn2-gray text-lg leading-relaxed max-w-md mx-auto">
              Discover your natural way of learning — so you use it on purpose
              instead of fighting it.
            </p>
          </div>

          <div className="bg-learn2-light rounded-xl p-7 sm:p-8 mb-10 space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-learn2-orange mb-2">
                Why this matters
              </p>
              <p className="text-learn2-text leading-relaxed">
                School works mainly one way. So we deliver information one
                way. When you know how you learn, you learn faster and enjoy it
                more.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-learn2-orange mb-2">
                What you do
              </p>
              <p className="text-learn2-text leading-relaxed">
                Answer ten short questions. Each has four endings. Rank them —
                most like you, somewhat, rarely, least. Five minutes.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-learn2-orange mb-2">
                What you get
              </p>
              <p className="text-learn2-text leading-relaxed">
                Instant results on screen. Plus an email with what your primary
                and secondary mean for learning. Your blind spot, where
                surprises can open up new perspective. And the types of
                learning experiences worth picking for your team.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (userInfo.name.trim() && userInfo.email.trim()) {
                setStep("opener");
              }
            }}
            className="space-y-7"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-learn2-text mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-5 py-4 border border-gray-300 rounded-lg text-learn2-text text-base focus:outline-none focus:ring-2 focus:ring-learn2-orange focus:border-transparent transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-learn2-text mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-5 py-4 border border-gray-300 rounded-lg text-learn2-text text-base focus:outline-none focus:ring-2 focus:ring-learn2-orange focus:border-transparent transition"
                placeholder="you@company.com"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-learn2-orange text-white py-4 rounded-lg text-lg font-semibold uppercase tracking-[0.05em] hover:bg-orange-sky transition-all hover:-translate-y-0.5"
              >
                Start Assessment
              </button>
            </div>

            <p className="text-center text-sm text-learn2-gray pt-1">
              Five minutes. No credit card. Instant results.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ─── Situational Opener ────────────────────────────────────────
  if (step === "opener") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-learn2-gray mb-5">
              Before We Start
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-learn2-text mb-5 leading-tight">
              Think of a time learning felt easy.
            </h2>
            <p className="text-learn2-gray text-lg leading-relaxed">
              You picked something up and it just clicked. What was happening
              around you?
            </p>
          </div>

          <textarea
            value={situationalNote}
            onChange={(e) => setSituationalNote(e.target.value)}
            rows={5}
            className="w-full px-5 py-4 border border-gray-300 rounded-lg text-learn2-text text-base focus:outline-none focus:ring-2 focus:ring-learn2-orange focus:border-transparent transition resize-none"
            placeholder="Who were you with? What was the setup? What made it work? (Optional — a sentence or two is plenty.)"
          />

          <div className="flex justify-between mt-10">
            <button
              onClick={() => setStep("intro")}
              className="px-6 py-3.5 rounded-lg font-medium text-learn2-text hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep("questions")}
              className="px-10 py-3.5 rounded-lg font-semibold bg-learn2-orange text-white hover:bg-orange-sky transition-all hover:-translate-y-0.5"
            >
              {situationalNote.trim() ? "Continue" : "Skip and Continue"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Questions Screen ──────────────────────────────────────────
  if (step === "questions") {
    const question = QUESTIONS[currentQuestion];
    const questionResponses = responses[currentQuestion];
    const allRanked = questionResponses.every((r) => r !== null);
    const usedRankings = new Set(questionResponses.filter((r) => r !== null));

    const assignRanking = (statementIndex: number, ranking: Ranking) => {
      setResponses((prev) => {
        const updated = prev.map((q) => [...q]);
        updated[currentQuestion] = updated[currentQuestion].map((r) =>
          r === ranking ? null : r
        ) as (Ranking | null)[];
        updated[currentQuestion][statementIndex] = ranking;
        return updated;
      });
    };

    const clearStatement = (statementIndex: number) => {
      setResponses((prev) => {
        const updated = prev.map((q) => [...q]);
        updated[currentQuestion][statementIndex] = null;
        return updated;
      });
    };

    return (
      <div className="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-learn2-gray">
                Question {currentQuestion + 1} of 10
              </span>
              <span className="text-sm text-learn2-gray">
                {Math.round(((currentQuestion + 1) / 10) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-learn2-orange rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentQuestion + 1) / 10) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-learn2-dark rounded-xl p-8 sm:p-10 mb-10 shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">
              {question.text}
            </h2>
          </div>

          <p className="text-sm text-learn2-gray mb-8 tracking-wide">
            Rank each statement. Use each ranking exactly once.
          </p>

          <div className="space-y-6">
            {question.statements.map((statement, sIdx) => {
              const currentRanking = questionResponses[sIdx];
              return (
                <div
                  key={sIdx}
                  className={`rounded-xl border p-6 sm:p-7 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.04)] ${
                    currentRanking
                      ? "border-learn2-dark/30 bg-gray-50 shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
                      : "border-gray-200 bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                  }`}
                >
                  <p className="text-learn2-text mb-4 leading-relaxed text-base">
                    {statement}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {RANKINGS.map((ranking) => {
                      const isSelected = currentRanking === ranking;
                      const isUsedElsewhere =
                        usedRankings.has(ranking) && !isSelected;
                      return (
                        <button
                          key={ranking}
                          onClick={() => {
                            if (isSelected) {
                              clearStatement(sIdx);
                            } else if (!isUsedElsewhere) {
                              assignRanking(sIdx, ranking);
                            }
                          }}
                          disabled={isUsedElsewhere}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-learn2-dark text-white"
                              : isUsedElsewhere
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-white text-learn2-text border border-gray-300 hover:border-learn2-dark hover:bg-gray-50 cursor-pointer"
                          }`}
                        >
                          {RANKING_LABELS[ranking]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between gap-4 mt-12">
            <button
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion((prev) => prev - 1);
                } else {
                  setStep("opener");
                }
              }}
              className="px-8 sm:px-12 py-5 rounded-lg text-lg font-semibold transition-colors border-2 border-gray-300 text-learn2-text hover:bg-gray-100 hover:border-learn2-dark"
            >
              Previous
            </button>

            <button
              onClick={() => {
                if (currentQuestion < 9) {
                  setCurrentQuestion((prev) => prev + 1);
                } else {
                  setStep("extra");
                }
              }}
              disabled={!allRanked}
              className={`px-10 sm:px-16 py-5 rounded-lg text-lg font-semibold transition-all ${
                allRanked
                  ? "bg-learn2-orange text-white hover:bg-orange-sky hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {currentQuestion < 9 ? "Next" : "Almost Done"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Extra Questions Screen ────────────────────────────────────
  if (step === "extra") {
    const canComplete =
      extraAnswers.leaderType !== null && extraAnswers.developsOthers !== null;

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="w-full max-w-lg">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-learn2-gray mb-4">
              Final Step
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-learn2-text mb-4">
              Almost Done!
            </h2>
            <p className="text-learn2-gray text-lg leading-relaxed">
              Two quick questions to personalize your results and email.
            </p>
          </div>

          <div className="space-y-10">
            <div>
              <p className="font-medium text-learn2-text mb-4 text-lg">
                Do you currently lead or manage people?
              </p>
              <div className="flex gap-4">
                {["yes", "no"].map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setExtraAnswers((prev) => ({
                        ...prev,
                        leaderType: val,
                      }))
                    }
                    className={`flex-1 py-4 rounded-lg font-medium text-center transition-all ${
                      extraAnswers.leaderType === val
                        ? "bg-learn2-dark text-white"
                        : "bg-white border border-gray-300 text-learn2-text hover:border-learn2-dark"
                    }`}
                  >
                    {val === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-learn2-text mb-4 text-lg">
                Do you regularly guide, coach, or develop others?
              </p>
              <div className="flex gap-4">
                {["yes", "sometimes", "no"].map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setExtraAnswers((prev) => ({
                        ...prev,
                        developsOthers: val,
                      }))
                    }
                    className={`flex-1 py-4 rounded-lg font-medium text-center transition-all ${
                      extraAnswers.developsOthers === val
                        ? "bg-learn2-dark text-white"
                        : "bg-white border border-gray-300 text-learn2-text hover:border-learn2-dark"
                    }`}
                  >
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-14">
            <button
              onClick={() => {
                setStep("questions");
                setCurrentQuestion(9);
              }}
              className="px-6 py-3.5 rounded-lg font-medium text-learn2-text hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={!canComplete}
              className={`px-10 py-3.5 rounded-lg font-semibold transition-all ${
                canComplete
                  ? "bg-learn2-orange text-white hover:bg-orange-sky hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Complete Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Results Screen ────────────────────────────────────────────
  if (step === "results" && results) {
    const primary = APPROACHES[results.primary.color];
    const maxScore = 40;

    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Email confirmation banner */}
          <div
            className={`rounded-xl p-5 sm:p-6 mb-10 flex items-start gap-4 ${
              emailStatus === "sent"
                ? "bg-green-50 border border-green-200"
                : emailStatus === "failed"
                ? "bg-amber-50 border border-amber-200"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="pt-0.5">
              {emailStatus === "sent" ? (
                <span className="text-2xl">✓</span>
              ) : emailStatus === "failed" ? (
                <span className="text-2xl">!</span>
              ) : (
                <span className="text-2xl">✉</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-learn2-text mb-1">
                {emailStatus === "sent"
                  ? `We sent a personal email to ${userInfo.email}`
                  : emailStatus === "failed"
                  ? "We could not reach your inbox"
                  : "Sending your personal email…"}
              </p>
              <p className="text-sm text-learn2-gray leading-relaxed">
                {emailStatus === "sent"
                  ? "Check your inbox in a minute for a deeper breakdown of your natural learning approach and what to do with it."
                  : emailStatus === "failed"
                  ? "Your results are here on screen. If you would like the full breakdown emailed, reach out and we will send it again."
                  : "Your full breakdown, your blind spot, and what kind of learning is worth your time."}
              </p>
            </div>
          </div>

          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-learn2-gray mb-5">
              Your Results
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-learn2-text mb-5 leading-tight">
              {results.combinationTitle}
            </h1>
            <p className="text-xl text-learn2-gray leading-relaxed">
              {userInfo.name}, your natural learning approach is{" "}
              <span className={`font-bold ${COLOR_TEXT[primary.color]}`}>
                {primary.name}
              </span>
            </p>
          </div>

          <div
            className={`rounded-2xl border-2 ${COLOR_BORDER[primary.color]} ${COLOR_BG_LIGHT[primary.color]} p-8 sm:p-10 mb-14`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className={`w-5 h-5 rounded-full ${COLOR_BG[primary.color]}`}
              />
              <h2 className="text-2xl font-bold text-learn2-text">
                {primary.name}
              </h2>
              <span
                className={`text-sm font-medium ${COLOR_TEXT[primary.color]}`}
              >
                {results.primary.score}/{maxScore}
              </span>
            </div>
            <p className="text-learn2-text leading-relaxed text-lg mb-6">
              {primary.description}
            </p>
            <div className="border-t border-learn2-text/10 pt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-learn2-text/70 mb-3">
                What to do with this
              </p>
              <ul className="space-y-2.5">
                {primary.whatToDo.map((tip, i) => (
                  <li
                    key={i}
                    className="text-learn2-text leading-relaxed flex gap-3"
                  >
                    <span className={`${COLOR_TEXT[primary.color]} font-bold`}>
                      →
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-14 rounded-xl overflow-hidden aspect-video">
            <iframe
              src={primary.videoUrl}
              title={`${primary.name} approach video`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="mb-14">
            <h3 className="text-2xl font-bold text-learn2-text mb-8">
              Your Score Breakdown
            </h3>
            <div className="space-y-6">
              {results.personalityRankings.map((r) => {
                const approach = APPROACHES[r.color];
                const percentage = (r.score / maxScore) * 100;
                return (
                  <div key={r.color}>
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3.5 h-3.5 rounded-full ${COLOR_BG[r.color]}`}
                        />
                        <span className="font-medium text-learn2-text">
                          {approach.name}
                        </span>
                        {r.rank === 1 && (
                          <span className="text-xs bg-learn2-dark text-white px-2.5 py-1 rounded-full">
                            Primary
                          </span>
                        )}
                        {r.rank === 4 && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
                            Blind Spot
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-learn2-gray">
                        {r.score}/{maxScore}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${COLOR_BG[r.color]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-learn2-light rounded-2xl p-8 sm:p-10 mb-14">
            <h3 className="text-2xl font-bold text-learn2-text mb-3">
              Adaptability Score
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold text-learn2-orange">
                {results.adaptabilityScore}
              </span>
              <span className="text-xl text-learn2-gray">/100</span>
            </div>
            <p className="text-learn2-gray leading-relaxed text-lg">
              {results.adaptabilityScore >= 70
                ? "You flex how you learn based on the situation. You can follow a sequence, step back for the big picture, jump in and try, or learn alongside peers — whichever the moment calls for."
                : results.adaptabilityScore >= 40
                ? "You have a consistent way of learning with some range. You flex when the situation clearly calls for it."
                : "You lead with one primary way of learning across most situations. You know what works for you and you trust it."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
            {results.personalityRankings.map((r) => {
              const approach = APPROACHES[r.color];
              return (
                <div
                  key={r.color}
                  className={`rounded-xl border p-6 sm:p-7 ${
                    r.rank === 1
                      ? `${COLOR_BORDER[r.color]} ${COLOR_BG_LIGHT[r.color]}`
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${COLOR_BG[r.color]}`}
                    />
                    <span className="font-semibold text-learn2-text">
                      {approach.name}
                    </span>
                    <span className="text-sm text-learn2-gray ml-auto">
                      #{r.rank}
                    </span>
                  </div>
                  <p className="text-sm text-learn2-gray leading-relaxed">
                    {approach.description.split(".").slice(0, 2).join(".") + "."}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-learn2-dark rounded-2xl p-10 sm:p-14 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Want to build learning that fits how people actually learn?
            </h3>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed text-lg">
              Share the assessment with your team. See how each person learns
              differently. Design experiences that land for everyone, not just
              one style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block bg-learn2-orange text-white px-10 py-4 rounded-lg font-semibold uppercase tracking-[0.05em] hover:bg-orange-sky transition-all hover:-translate-y-0.5"
              >
                Book a Discovery Call
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/learn-assessment`
                  );
                }}
                className="inline-block border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5"
              >
                Copy Assessment Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
