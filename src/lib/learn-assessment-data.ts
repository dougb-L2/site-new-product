// Learn Naturally Assessment — Question Data and Scoring Configuration
// Parallel to assessment-data.ts. Lens: how you learn, not how you communicate.
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
  whatToDo: string[];
}

export const APPROACHES: Record<Color, ApproachProfile> = {
  gold: {
    color: "gold",
    name: "Naturally Gold Mine Learner",
    hex: "#D4A843",
    tailwind: "yellow-600",
    description:
      "You learn by following a clear sequence. You want structure, steps, and the chance to practice until you have got it solid. You trust a method that has been proven to work and you stick with it until the skill is reliable.",
    videoUrl: "https://www.youtube.com/embed/Iw_G452WnV4",
    prevalence: 40,
    whatToDo: [
      "Pick courses with a clear sequence and a defined endpoint, not open-ended workshops.",
      "Build in deliberate practice — the same skill, five times, before you move on.",
      "Choose teachers who give you a method and watch you perform it, not just concepts.",
    ],
  },
  green: {
    color: "green",
    name: "Naturally Green Planet Learner",
    hex: "#38A169",
    tailwind: "green-600",
    description:
      "You learn by seeing the big picture first, then working backward to the details. You spot patterns, connect ideas across domains, and want to understand how the whole system fits together before the pieces will stick.",
    videoUrl: "https://www.youtube.com/embed/idUqI6aysj8",
    prevalence: 20,
    whatToDo: [
      "Read the table of contents and the last chapter first. Map the territory before you walk it.",
      "Chase cross-discipline books and frameworks that reshape how you see a whole field.",
      "When you hit a stuck point, zoom out to the system before grinding on the detail.",
    ],
  },
  orange: {
    color: "orange",
    name: "Naturally Orange Sky Learner",
    hex: "#ED8936",
    tailwind: "orange-600",
    description:
      "You learn by doing. You would rather pick it up, try it, and adjust on the fly than sit through theory. Your best learning happens through experimentation, fast failure, and real-time adjustment.",
    videoUrl: "https://www.youtube.com/embed/FCw47lDBpxM",
    prevalence: 20,
    whatToDo: [
      "Pick workshops where you build or ship something, not listen-and-take-notes courses.",
      "Skip the manual. Start with the thing, then read only when you hit a wall.",
      "Work with a coach who gives you live feedback, not a teacher with a slide deck.",
    ],
  },
  blue: {
    color: "blue",
    name: "Naturally Blue Ocean Learner",
    hex: "#2B6CB0",
    tailwind: "blue-600",
    description:
      "You learn through conversation and shared discovery. You make sense of new material by talking it through with people you trust. Your most durable learning happens alongside peers, not alone.",
    videoUrl: "https://www.youtube.com/embed/9ETohtenRoI",
    prevalence: 20,
    whatToDo: [
      "Join a cohort, mastermind, or study group. Solo online courses will bore you.",
      "Find one learning partner and compare notes weekly on whatever you are picking up.",
      "Pick teachers who run real conversations, not one-way lectures.",
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
    text: "When I pick up something brand new, I learn fastest by:",
    statements: [
      "following a clear path — step, practice, repeat — until it is locked in.",
      "getting the whole shape first, then working inward to the details.",
      "trying it right away and adjusting as I go.",
      "working it out loud with someone I trust.",
    ],
  },
  {
    id: 2,
    text: "I come alive in a learning group that:",
    statements: [
      "moves through the material in a clear order so everyone builds the skill the same way.",
      "pulls back often to see how the pieces connect to a bigger picture.",
      "tries things fast and learns from what works and what does not.",
      "thinks out loud together so we figure it out as a group.",
    ],
  },
  {
    id: 3,
    text: "The instructor I always remember is the one who:",
    statements: [
      "walked me through it step by step and made sure I could do it before we moved on.",
      "laid out the whole territory first so I understood where each piece fit.",
      "handed me the thing and said, try it — we will figure it out as you go.",
      "turned the room into a real conversation and built the answer with us.",
    ],
  },
  {
    id: 4,
    text: "The kind of learning that leaves me wanting more is:",
    statements: [
      "a clear path with real practice until I can do it without looking.",
      "a big idea I can chase sideways into the parts that matter.",
      "a live problem I can try, break, and try again.",
      "a conversation with people who are figuring it out alongside me.",
    ],
  },
  {
    id: 5,
    text: "When I am learning on my own, I keep going because:",
    statements: [
      "I want to get it right, not just almost right.",
      "I want to understand why it works, not just that it does.",
      "I want to see what happens when I try the next thing.",
      "I want to come back and talk about it with people.",
    ],
  },
  {
    id: 6,
    text: "When I hit a wall learning something new, my first move is to:",
    statements: [
      "go back to the beginning and work through each step until it clicks.",
      "zoom out and rebuild the whole picture before I push forward.",
      "drop the instructions and just try the next thing.",
      "find someone and talk it through out loud.",
    ],
  },
  {
    id: 7,
    text: "Give me a brand-new idea I do not understand yet. My first instinct is to:",
    statements: [
      "break it into pieces and work through them in order.",
      "figure out how it connects to what I already know.",
      "try to use it on something real and see what it does.",
      "find someone who gets it and talk it through with me.",
    ],
  },
  {
    id: 8,
    text: "On the last day of a great learning experience, I am usually the person who:",
    statements: [
      "can do the thing reliably from start to finish.",
      "can explain the whole shape of it and where it fits.",
      "has already tried three variations and found one that works in the wild.",
      "has learned it with a small group of people I will keep comparing notes with.",
    ],
  },
  {
    id: 9,
    text: "When I walk out of a learning experience, I know it landed if:",
    statements: [
      "I left with a clear method I can follow next Monday.",
      "I left with a new mental model that reshapes how I see my work.",
      "I left already doing it, not planning to do it.",
      "I left with peers I will keep learning with long after the session ends.",
    ],
  },
  {
    id: 10,
    text: "I know I have really learned something when:",
    statements: [
      "I can do it without referring back to anything.",
      "I can explain why it works to someone who has never seen it.",
      "I have used it on something real that mattered.",
      "I have talked it through with enough people that my take is clear.",
    ],
  },
];

export const COMBINATION_TITLES: Record<string, string> = {
  "Gold-Blue": "The Steady Peer Learner",
  "Gold-Green": "The Methodical Thinker",
  "Gold-Orange": "The Disciplined Doer",
  "Blue-Gold": "The Collaborative Step-Follower",
  "Blue-Green": "The Reflective Conversationalist",
  "Blue-Orange": "The Active Peer Learner",
  "Green-Gold": "The Structured Strategist",
  "Green-Blue": "The Shared-Discovery Thinker",
  "Green-Orange": "The Curious Experimenter",
  "Orange-Gold": "The Hands-On Operator",
  "Orange-Blue": "The Dynamic Team Learner",
  "Orange-Green": "The Adventurous Explorer",
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
