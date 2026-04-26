export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  hub: string;
  hubColor: string;
  date: string;
  readTime: string;
  metaDescription: string;
  ogTitle: string;
  keywords: string[];
  content: string;
}

export const hubs = [
  { name: "Communication", color: "blue-ocean" },
  { name: "Leadership", color: "gold-mine" },
  { name: "Sales", color: "orange-sky" },
  { name: "Teams", color: "green-planet" },
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "example-post-one",
    title: "Example Post One: Replace With Your Content",
    excerpt:
      "This is a placeholder blog post. Replace it with content relevant to your product site.",
    hub: "Communication",
    hubColor: "blue-ocean",
    date: "2026-04-01",
    readTime: "5 min read",
    metaDescription:
      "This is a placeholder blog post. Replace with your product-specific content and meta description.",
    ogTitle: "Example Post One | Learn2",
    keywords: [
      "team communication",
      "leadership",
      "participant-driven",
    ],
    content: `This is a placeholder blog post. Replace it with content relevant to your product site.

## Section One

Write your content here. Each blog post should target a specific search intent and include internal links to your product pages and assessment.

## Section Two

Include proof points, examples, and a clear call to action.

---

## Next step

The free **Naturally assessment** takes ten minutes. Your report shows:

- Your primary and secondary Natural Approach
- The specific friction patterns your combination creates at work
- One behavior to try this week

[**Take the free assessment →**](/assessment)`,
  },
  {
    id: 2,
    slug: "example-post-two",
    title: "Example Post Two: Replace With Your Content",
    excerpt:
      "Another placeholder blog post. Replace it with content that targets buyer intent for your product.",
    hub: "Leadership",
    hubColor: "gold-mine",
    date: "2026-04-05",
    readTime: "4 min read",
    metaDescription:
      "Another placeholder blog post. Replace with your product-specific content targeting buyer search intent.",
    ogTitle: "Example Post Two | Learn2",
    keywords: [
      "leadership development",
      "team dynamics",
      "natural approaches",
    ],
    content: `Another placeholder blog post. Replace it with content that targets buyer intent for your product.

## The Problem

Describe the problem your buyer is trying to solve.

## What Works Instead

Show why participant-driven immersive learning works better than lecture-based approaches.

## Example

Include a real example or case study.

---

## Next step

[**Take the free assessment →**](/assessment)

Want to go deeper? Explore the [results page](/results) to see what teams have achieved.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
