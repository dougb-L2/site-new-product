/**
 * Assessment configuration. Toggle assessments on/off per site.
 * Each assessment has its own data file in src/lib/.
 */
export const ASSESSMENT_CONFIG = {
  /** Communication assessment — core diagnostic */
  communicate: {
    enabled: true,
    path: "/assessment",
    title: "Discover Your Natural Communication Approach",
    description: "A free 10-question diagnostic that reveals how you naturally communicate, sell, and lead.",
  },

  /** Lead Naturally assessment — leadership mirror */
  lead: {
    enabled: true,
    path: "/lead-assessment",
    title: "Discover Your Natural Leadership Approach",
    description: "How do you naturally lead? This 10-question assessment reveals your leadership style.",
  },

  /** Learn Naturally assessment — learning style */
  learn: {
    enabled: true,
    path: "/learn-assessment",
    title: "Discover How You Naturally Learn",
    description: "A 10-question assessment that reveals how you absorb and apply new skills.",
  },
};

/** Get all enabled assessments */
export function getEnabledAssessments() {
  return Object.entries(ASSESSMENT_CONFIG)
    .filter(([, config]) => config.enabled)
    .map(([key, config]) => ({ key, ...config }));
}
