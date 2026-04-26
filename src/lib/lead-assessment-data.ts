// Lead Naturally Assessment — Question Data and Scoring Configuration
// Parallel to assessment-data.ts and learn-assessment-data.ts.
// Lens: how you lead AND what your team likely needs from you (Copernican mirror).
// Questions tuned through three review lenses:
//   - Jeannette Vos (Learning Revolution): concrete moments, positive framing
//   - Isabel Briggs Myers (MBTI): preference over aspiration, behavioral
//   - Seth Godin: specific visceral moments, tribal recognition

export const COLORS = ["gold", "green", "orange", "blue"] as const;
export type Color = typeof COLORS[number];

export const RANKINGS = ["most", "somewhat", "rarely", "least"] as const;
export type Ranking = typeof RANKINGS[number];

export const POINTS: Record<Ranking, number> = {
  most: 4,
  somewhat: 3,
  rarely: 2,
  least: 1,
};

export const RANKING_LABELS: Record<Ranking, string> = {
  most: "Most Like Me",
  somewhat: "Somewhat Like Me",
  rarely: "Rarely Like Me",
  least: "Least Like Me",
};

export interface ApproachProfile {
  color: Color;
  name: string;
  hex: string;
  tailwind: string;
  description: string;
  videoUrl: string;
  prevalence: number;
  strengths: string[];
  watchOuts: string[];
}

export const APPROACHES: Record<Color, ApproachProfile> = {
  gold: {
    color: "gold",
    name: "Naturally Gold Mine Leader",
    hex: "#D4A843",
    tailwind: "yellow-600",
    description:
      "You lead through structure, clear expectations, and reliable delivery. Your team knows what good looks like and how to get there. You hold the standard and you hold yourself to it first. People trust you because you do what you say.",
    videoUrl: "https://www.youtube.com/embed/Iw_G452WnV4",
    prevalence: 40,
    strengths: [
      "Operational excellence and on-time delivery.",
      "Clear standards, clean accountability.",
      "Calm in steady-state complexity.",
    ],
    watchOuts: [
      "Flex — you can lock into the plan when the situation has changed.",
      "Tolerance for mess — early-stage ambiguity can feel intolerable.",
    ],
  },
  green: {
    color: "green",
    name: "Naturally Green Planet Leader",
    hex: "#38A169",
    tailwind: "green-600",
    description:
      "You lead through vision, frameworks, and systems thinking. You see around corners and you teach your team to do the same. You are the person people bring a hard problem to when they want a better way to think about it. You build learning organizations.",
    videoUrl: "https://www.youtube.com/embed/idUqI6aysj8",
    prevalence: 20,
    strengths: [
      "Strategic clarity and long-horizon thinking.",
      "Pattern recognition across domains.",
      "Building cultures that keep learning.",
    ],
    watchOuts: [
      "Urgency — you can over-think while the moment passes.",
      "Warmth — insight can read as aloof if you skip the human beat.",
    ],
  },
  orange: {
    color: "orange",
    name: "Naturally Orange Sky Leader",
    hex: "#ED8936",
    tailwind: "orange-600",
    description:
      "You lead through decisive action, speed, and bold moves. You make the call when no one else will. Your team ships. You are the leader people want in a turnaround, a pivot, or a brand-new launch. You energize the room.",
    videoUrl: "https://www.youtube.com/embed/FCw47lDBpxM",
    prevalence: 20,
    strengths: [
      "Decisiveness in ambiguity.",
      "Momentum and shipping culture.",
      "Confidence that steadies a crisis.",
    ],
    watchOuts: [
      "Steadiness — you can push so hard people burn out.",
      "Depth — fast can mean shallow if you do not pause.",
    ],
  },
  blue: {
    color: "blue",
    name: "Naturally Blue Ocean Leader",
    hex: "#2B6CB0",
    tailwind: "blue-600",
    description:
      "You lead through relationships, development, and trust. You invest in the people you lead and they grow under you. Your team feels seen, heard, and backed. The culture you build lasts long after you leave the room.",
    videoUrl: "https://www.youtube.com/embed/9ETohtenRoI",
    prevalence: 20,
    strengths: [
      "Deep developmental relationships.",
      "Cultures people do not want to leave.",
      "Honest conversation and psychological safety.",
    ],
    watchOuts: [
      "Accountability — the hard conversation can wait too long.",
      "Strategic edge — relationships can soften the call that has to be made.",
    ],
  },
};

export interface Question {
  id: number;
  text: string;
  statements: string[]; // Index 0=Gold, 1=Green, 2=Orange, 3=Blue
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "When I am leading a team through something new, I naturally:",
    statements: [
      "set a clear process and hold everyone to it.",
      "lay out the bigger why before we touch the how.",
      "pick a direction, move, and adjust once we see what works.",
      "build the trust first, then the work gets easier.",
    ],
  },
  {
    id: 2,
    text: "The leaders I trust most are the ones who:",
    statements: [
      "set clear expectations and hold everyone to them — including themselves.",
      "see patterns before the rest of us do and explain them simply.",
      "make the call when no one else will and take the heat.",
      "know my name, know what I care about, know what I am trying to build.",
    ],
  },
  {
    id: 3,
    text: "When my team is stuck, my first move is to:",
    statements: [
      "walk the plan back and find where it broke.",
      "zoom out and reframe the whole problem.",
      "drop the plan — try something and see what moves.",
      "pull people together and talk about what is really going on.",
    ],
  },
  {
    id: 4,
    text: "The kind of team I build leaves people saying:",
    statements: [
      "we always know what is expected and we always deliver.",
      "we see around corners most teams do not.",
      "we do not sit around — we ship.",
      "we grow here. We have each other's backs.",
    ],
  },
  {
    id: 5,
    text: "In a meeting, the version of me my team sees most is the one who:",
    statements: [
      "runs the agenda and names the decisions.",
      "asks the question that makes everyone think differently.",
      "cuts the discussion and calls the next action.",
      "makes sure the quieter voice gets heard.",
    ],
  },
  {
    id: 6,
    text: "The feedback I most often give a team member is:",
    statements: [
      "here is what I need, here is the deadline, here is the standard.",
      "step back and see the bigger picture before you move.",
      "ship it — we will fix it as we go.",
      "how are you doing? What do you need from me?",
    ],
  },
  {
    id: 7,
    text: "When a direct report disappoints me, my instinct is to:",
    statements: [
      "hold them to the agreement we made and be clear about the gap.",
      "figure out where our thinking went out of alignment.",
      "have the hard conversation fast and move on.",
      "find out what is going on for them before I judge the work.",
    ],
  },
  {
    id: 8,
    text: "The part of leading I would least willingly give up is:",
    statements: [
      "keeping the operation running on time.",
      "shaping strategy and the longer view.",
      "making decisions nobody else wants to make.",
      "developing the people I lead.",
    ],
  },
  {
    id: 9,
    text: "My team's best day at work looks like:",
    statements: [
      "hit our targets, clean close of day, nothing slipped.",
      "a breakthrough in how we think about the work.",
      "shipped something hard we were not sure we could.",
      "real connection, real conversations, everyone felt seen.",
    ],
  },
  {
    id: 10,
    text: "If I am honest about where I most often fall short as a leader, it is:",
    statements: [
      "flexibility — I can get locked into the plan.",
      "urgency — I can over-think before I move.",
      "steadiness — I can push in too many directions and burn people out.",
      "accountability — I can avoid the hard conversation too long.",
    ],
  },
];

export const COMBINATION_TITLES: Record<string, string> = {
  "Gold-Blue": "The Steady Developer",
  "Gold-Green": "The Disciplined Strategist",
  "Gold-Orange": "The Reliable Closer",
  "Blue-Gold": "The Accountable Coach",
  "Blue-Green": "The Reflective Mentor",
  "Blue-Orange": "The Energizing Connector",
  "Green-Gold": "The Structured Architect",
  "Green-Blue": "The Thoughtful Developer",
  "Green-Orange": "The Bold Visionary",
  "Orange-Gold": "The Decisive Operator",
  "Orange-Blue": "The Charismatic Catalyst",
  "Orange-Green": "The Bold Strategist",
};

// ─── Team-Needs Mirror (Copernican layer) ───────────────────────
// Given a leader's primary approach, the team most often needs what the leader
// under-supplies. This is the second report — the "what your team likely needs"
// view that powers the blog CTA double-win.

export interface TeamMirror {
  firstNeed: Color;       // strongest need the leader's style under-supplies
  secondNeed: Color;      // secondary complement
  narrative: string;      // what to tell the leader
  practiceMove: string;   // one concrete action the leader can take this week
}

export const TEAM_MIRROR: Record<Color, TeamMirror> = {
  gold: {
    firstNeed: "orange",
    secondNeed: "blue",
    narrative:
      "Your team trusts your standards and your delivery. What they are often quietly asking for is more room to try, fail, and adjust — and more human warmth in the moments that do not fit the plan. Natural Gold Mine leaders can leave teams feeling managed more than led.",
    practiceMove:
      "This week: pick one meeting where you trade your agenda for a fifteen-minute open conversation about how people are actually doing. See what shifts.",
  },
  green: {
    firstNeed: "gold",
    secondNeed: "orange",
    narrative:
      "Your team values how clearly you see the shape of the work. What they often want more of is crisp execution urgency — and simple, repeatable process they can lean on when the big picture is still forming. Natural Green Planet leaders can over-contextualize when the team needs a next step.",
    practiceMove:
      "This week: pick one strategic conversation and close it with a one-page plan and a deadline. Give the team the scaffolding underneath the vision.",
  },
  orange: {
    firstNeed: "gold",
    secondNeed: "blue",
    narrative:
      "Your team respects your decisiveness and the momentum you create. What they often want between your big moves is stability, structure, and genuine check-ins on how people are holding up. Natural Orange Sky leaders can leave burnout in their wake without noticing.",
    practiceMove:
      "This week: pick one person who has been grinding hardest and have a fifteen-minute conversation that is not about the work. Listen more than you talk.",
  },
  blue: {
    firstNeed: "gold",
    secondNeed: "green",
    narrative:
      "Your team feels seen, trusted, and developed — and that is rare. What they sometimes quietly want is clearer accountability and a sharper strategic call. Natural Blue Ocean leaders can delay the hard conversation that would actually protect the relationship.",
    practiceMove:
      "This week: have the hard conversation you have been putting off. Name the gap, name the standard, and be honest. The relationship will survive — and probably strengthen.",
  },
};

// Response array: 10 questions x 4 statements, each value is a Ranking or null
export type Responses = (Ranking | null)[][];

export interface AssessmentScores {
  gold: number;
  green: number;
  orange: number;
  blue: number;
}

export interface RankedApproach {
  color: Color;
  score: number;
  rank: number;
}

export interface AssessmentResults {
  scores: AssessmentScores;
  primary: RankedApproach;
  secondary: RankedApproach;
  tertiary: RankedApproach;
  blindSpot: RankedApproach;
  adaptabilityScore: number;
  positionFrequency: Record<Color, number[]>;
  combinationTitle: string;
  personalityRankings: RankedApproach[];
  teamMirror: TeamMirror;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function calculateResults(responses: Responses): AssessmentResults {
  const scores: AssessmentScores = { gold: 0, green: 0, orange: 0, blue: 0 };
  responses.forEach((question) => {
    question.forEach((ranking, answerIndex) => {
      if (ranking === null) return;
      scores[COLORS[answerIndex]] += POINTS[ranking];
    });
  });

  const positionFrequency: Record<Color, number[]> = {
    gold: [0, 0, 0, 0],
    green: [0, 0, 0, 0],
    orange: [0, 0, 0, 0],
    blue: [0, 0, 0, 0],
  };

  responses.forEach((question) => {
    question.forEach((ranking, answerIndex) => {
      if (ranking === null) return;
      const color = COLORS[answerIndex];
      const position = RANKINGS.indexOf(ranking);
      positionFrequency[color][position]++;
    });
  });

  const lockInSum = COLORS.reduce((sum, color) => {
    return sum + Math.max(...positionFrequency[color]);
  }, 0);
  const adaptabilityScore = Math.round(((40 - lockInSum) / 28) * 100);

  const ranked = (Object.entries(scores) as [Color, number][])
    .map(([color, score]) => ({ color, score }))
    .sort((a, b) => b.score - a.score || a.color.localeCompare(b.color));

  const personalityRankings = ranked.map((r, i) => ({
    color: r.color,
    score: r.score,
    rank: i + 1,
  }));

  const combinationKey = `${capitalize(ranked[0].color)}-${capitalize(ranked[1].color)}`;
  const primaryColor = ranked[0].color;

  return {
    scores,
    primary: personalityRankings[0],
    secondary: personalityRankings[1],
    tertiary: personalityRankings[2],
    blindSpot: personalityRankings[3],
    adaptabilityScore: Math.max(0, Math.min(100, adaptabilityScore)),
    positionFrequency,
    combinationTitle: COMBINATION_TITLES[combinationKey] || "Unknown",
    personalityRankings,
    teamMirror: TEAM_MIRROR[primaryColor],
  };
}
