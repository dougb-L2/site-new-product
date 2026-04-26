// Naturally Assessment — Question Data and Scoring Configuration

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
}

export const APPROACHES: Record<Color, ApproachProfile> = {
  gold: {
    color: "gold",
    name: "Naturally Gold Mine",
    hex: "#D4A843",
    tailwind: "yellow-600",
    description:
      "You value structure, reliability, responsibility, and clear expectations. You thrive in stable environments with rules and standards. You prefer organized, systematic approaches and appreciate traditional methods that have proven successful.",
    videoUrl: "https://www.youtube.com/embed/Iw_G452WnV4",
    prevalence: 40,
  },
  green: {
    color: "green",
    name: "Naturally Green Planet",
    hex: "#38A169",
    tailwind: "green-600",
    description:
      "You are analytical, strategic, and curious. You enjoy solving problems and improving systems. You value competence, logic, and continuous learning. You prefer to work independently and focus on long-term planning and innovation.",
    videoUrl: "https://www.youtube.com/embed/idUqI6aysj8",
    prevalence: 20,
  },
  orange: {
    color: "orange",
    name: "Naturally Orange Sky",
    hex: "#ED8936",
    tailwind: "orange-600",
    description:
      "You are energetic, action-oriented, and thrive in fast-moving, flexible environments. You love new experiences, variety, and hands-on problem solving. You prefer spontaneous, creative approaches and enjoy taking calculated risks.",
    videoUrl: "https://www.youtube.com/embed/FCw47lDBpxM",
    prevalence: 20,
  },
  blue: {
    color: "blue",
    name: "Naturally Blue Ocean",
    hex: "#2B6CB0",
    tailwind: "blue-600",
    description:
      "You prioritize empathy, harmony, and authentic relationships. You are driven by values and emotional connections. You prefer collaborative environments where you can help others grow and succeed. You value meaningful work that makes a positive impact.",
    videoUrl: "https://www.youtube.com/embed/9ETohtenRoI",
    prevalence: 20,
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
    text: "I believe that the best way to succeed at work is by:",
    statements: [
      "having clearly defined goals and established processes for achieving them.",
      "acquiring abilities, solving problems, and thinking in unique ways.",
      "being competitive, adventurous, and spontaneous.",
      "being supportive of the team, fostering great relationships, and being open and honest.",
    ],
  },
  {
    id: 2,
    text: "When leading a team or project, I am most annoyed by team members who:",
    statements: [
      "ignore deadlines and don't play by the rules.",
      "make silly mistakes and do not think strategically.",
      "are reluctant to test their limits.",
      "do not make an effort to build relationships with others.",
    ],
  },
  {
    id: 3,
    text: "Four different teams are presenting the same idea to me in different ways. I will be most likely to choose the team that:",
    statements: [
      "answers all my questions in detail and in an organized way.",
      "demonstrates the best approach for delivering results.",
      "engages me with their energy and confidence.",
      "understands me and what I really need.",
    ],
  },
  {
    id: 4,
    text: "Which working style represents me most accurately?",
    statements: [
      "I dislike ambiguity and enjoy working with clear direction and timelines.",
      "I dislike conforming and like to focus on problems that are difficult to solve.",
      "I dislike routine and structure and like to have the freedom to experiment.",
      "I dislike conflict and flourish in a cooperative, interactive environment.",
    ],
  },
  {
    id: 5,
    text: "The driving force behind most of the things I do at work is:",
    statements: [
      "a strong sense of right and wrong.",
      "a strong desire to be creative and develop my potential.",
      "the need to be constantly challenged and pursue new directions.",
      "the need to influence others positively.",
    ],
  },
  {
    id: 6,
    text: "There are times when I am overwhelmed and frustrated at work. At these times, I am most likely to:",
    statements: [
      "be hard on myself. I would probably work overtime to ensure I completed all tasks on time.",
      "become extremely focused on results and ignore any kind of distractions.",
      "look for a fun, positive energizer—a reason to laugh out loud.",
      "talk to a trusted colleague who could help me see things from a different perspective.",
    ],
  },
  {
    id: 7,
    text: "My preferred way of handling conflict at work is to:",
    statements: [
      "prepare myself to talk to the opposed individual and explain things thoroughly.",
      "correct misinformation and help others understand my perspective.",
      "keep things less serious by making jokes about our challenges collaborating as a team.",
      "avoid confrontation because I want to maintain relationships.",
    ],
  },
  {
    id: 8,
    text: "As a leader, I most represent:",
    statements: [
      "structure, stability, and responsibility.",
      "non-conformity, intelligence, and continuous improvement.",
      "spontaneity, excitement, and courage.",
      "authenticity, idealism, and compassion.",
    ],
  },
  {
    id: 9,
    text: "I feel that the best way to create a happy and productive work environment is to:",
    statements: [
      "ensure a clear guide to produce best results.",
      "focus on maximizing performance and results to ensure efficiency.",
      "take risks and explore new avenues to achieve results.",
      "focus on authenticity, people, and communication to create a healthy environment rather than only focusing on results.",
    ],
  },
  {
    id: 10,
    text: "When receiving recognition for your work, you would prefer:",
    statements: [
      "a reference to specific contributions that illustrate your detailed work and reliability.",
      "recognition for innovative solutions and strategic thinking that improved outcomes.",
      "acknowledgment of your energy, risk-taking, and ability to drive results quickly.",
      "appreciation for your collaborative spirit and positive impact on team relationships.",
    ],
  },
];

export const COMBINATION_TITLES: Record<string, string> = {
  "Gold-Blue": "The Compassionate Driver",
  "Gold-Green": "The Strategic Executor",
  "Gold-Orange": "The Reliable Closer",
  "Blue-Gold": "The Caring Organizer",
  "Blue-Green": "The Insightful Connector",
  "Blue-Orange": "The Energizing Peacemaker",
  "Green-Gold": "The Precise Strategist",
  "Green-Blue": "The Empathetic Analyst",
  "Green-Orange": "The Innovative Thinker",
  "Orange-Gold": "The Productive Dynamo",
  "Orange-Blue": "The Charismatic Performer",
  "Orange-Green": "The Strategic Risk-Taker",
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
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function calculateResults(responses: Responses): AssessmentResults {
  // Total scores
  const scores: AssessmentScores = { gold: 0, green: 0, orange: 0, blue: 0 };
  responses.forEach((question) => {
    question.forEach((ranking, answerIndex) => {
      if (ranking === null) return;
      scores[COLORS[answerIndex]] += POINTS[ranking];
    });
  });

  // Position frequency matrix
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

  // Adaptability score
  const lockInSum = COLORS.reduce((sum, color) => {
    return sum + Math.max(...positionFrequency[color]);
  }, 0);
  const adaptabilityScore = Math.round(((40 - lockInSum) / 28) * 100);

  // Rankings (tie-break: alphabetical)
  const ranked = (Object.entries(scores) as [Color, number][])
    .map(([color, score]) => ({ color, score }))
    .sort((a, b) => b.score - a.score || a.color.localeCompare(b.color));

  const personalityRankings = ranked.map((r, i) => ({
    color: r.color,
    score: r.score,
    rank: i + 1,
  }));

  const combinationKey = `${capitalize(ranked[0].color)}-${capitalize(ranked[1].color)}`;

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
  };
}
