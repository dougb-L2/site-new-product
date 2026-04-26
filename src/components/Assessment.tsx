"use client";

import { useState, useCallback, useEffect } from "react";
import {
  QUESTIONS,
  RANKINGS,
  RANKING_LABELS,
  APPROACHES,
  COLORS,
  calculateResults,
  type Ranking,
  type Responses,
  type AssessmentResults,
  type Color,
} from "@/lib/assessment-data";

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
type Step = "intro" | "questions" | "extra" | "results";

interface UserInfo {
  name: string;
  email: string;
}

interface ExtraAnswers {
  leaderType: string | null;
  sellInfluence: string | null;
}

// ─── Main Component ──────────────────────────────────────────────
export default function Assessment() {
  const [step, setStep] = useState<Step>("intro");
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "" });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Responses>(
    Array.from({ length: 10 }, () => [null, null, null, null])
  );
  const [extraAnswers, setExtraAnswers] = useState<ExtraAnswers>({
    leaderType: null,
    sellInfluence: null,
  });
  const [results, setResults] = useState<AssessmentResults | null>(null);
  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, currentQuestion]);

  const handleComplete = useCallback(() => {
    const r = calculateResults(responses);
    setResults(r);
    setStep("results");

    // Save to PocketBase via API route (non-blocking)
    const source =
      new URLSearchParams(window.location.search).get("source") || "direct";
    const tag =
      window.location.pathname === "/rri"
        ? "RRI"
        : new URLSearchParams(window.location.search).get("tag") ||
          "ASSESSMENT";

    fetch("/api/assessment", {
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
        sellInfluence: extraAnswers.sellInfluence,
        source,
        tag,
        responses,
        positionFrequency: r.positionFrequency,
        rankings: r.personalityRankings,
      }),
    }).catch(() => {});
  }, [responses, userInfo, extraAnswers]);

  // ─── Intro Screen ──────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="w-full max-w-md">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-learn2-gray mb-5">
              5-Minute Assessment
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-learn2-text mb-6 leading-tight">
              Your Natural Approach
            </h1>
            <p className="text-learn2-gray text-lg leading-relaxed max-w-sm mx-auto">
              Discover your unique approach to work and collaboration
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (userInfo.name.trim() && userInfo.email.trim()) {
                setStep("questions");
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

  // ─── Questions Screen ──────────────────────────────────────────
  if (step === "questions") {
    const question = QUESTIONS[currentQuestion];
    const questionResponses = responses[currentQuestion];
    const allRanked = questionResponses.every((r) => r !== null);
    const usedRankings = new Set(questionResponses.filter((r) => r !== null));

    const assignRanking = (statementIndex: number, ranking: Ranking) => {
      setResponses((prev) => {
        const updated = prev.map((q) => [...q]);
        // Clear this ranking from any other statement in this question
        updated[currentQuestion] = updated[currentQuestion].map((r) =>
          r === ranking ? null : r
        ) as (Ranking | null)[];
        // Assign ranking to this statement
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
          {/* Progress */}
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

          {/* Question */}
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

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <button
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion((prev) => prev - 1);
                }
              }}
              className={`px-6 py-3.5 rounded-lg font-medium transition-colors ${
                currentQuestion === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-learn2-text hover:bg-gray-100"
              }`}
              disabled={currentQuestion === 0}
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
              className={`px-10 py-3.5 rounded-lg font-semibold transition-all ${
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
      extraAnswers.leaderType !== null && extraAnswers.sellInfluence !== null;

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
              Two quick questions to personalize your results.
            </p>
          </div>

          <div className="space-y-10">
            {/* Leader question */}
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

            {/* Sell influence question */}
            <div>
              <p className="font-medium text-learn2-text mb-4 text-lg">
                Do you sell, influence buying decisions, or regularly handle
                objections?
              </p>
              <div className="flex gap-4">
                {["yes", "sometimes", "no"].map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setExtraAnswers((prev) => ({
                        ...prev,
                        sellInfluence: val,
                      }))
                    }
                    className={`flex-1 py-4 rounded-lg font-medium text-center transition-all ${
                      extraAnswers.sellInfluence === val
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

          {/* Navigation */}
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
          {/* Hero */}
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-learn2-gray mb-5">
              Your Results
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-learn2-text mb-5 leading-tight">
              {results.combinationTitle}
            </h1>
            <p className="text-xl text-learn2-gray leading-relaxed">
              {userInfo.name}, your natural approach is{" "}
              <span className={`font-bold ${COLOR_TEXT[primary.color]}`}>
                {primary.name}
              </span>
            </p>
          </div>

          {/* Primary approach card */}
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
            <p className="text-learn2-text leading-relaxed text-lg">
              {primary.description}
            </p>
          </div>

          {/* Video */}
          <div className="mb-14 rounded-xl overflow-hidden aspect-video">
            <iframe
              src={primary.videoUrl}
              title={`${primary.name} approach video`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Score breakdown */}
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

          {/* Adaptability */}
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
                ? "You read situations differently and adapt your approach. Your team experiences someone who meets them where they are."
                : results.adaptabilityScore >= 40
                ? "You have a consistent approach with some flexibility. You adapt when the situation clearly calls for it."
                : "You lead with a consistent approach across most situations. Your team knows exactly what to expect from you."}
            </p>
          </div>

          {/* All approaches overview */}
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

          {/* CTA */}
          <div className="bg-learn2-dark rounded-2xl p-10 sm:p-14 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Want to bring this to your team?
            </h3>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed text-lg">
              Share the assessment with your team. See how everyone's natural
              approach creates your team dynamic. Book a discovery call to
              explore what's possible.
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
                    `${window.location.origin}/assessment`
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
