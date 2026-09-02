import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { blogPosts } from "@/lib/blog-data";
import { ASSESSMENT_CONFIG } from "@/lib/assessment-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/results`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/certification`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  // Driven by ASSESSMENT_CONFIG so the sitemap cannot drift from what the site
  // actually serves. Enabled assessments are listed here and indexable; disabled
  // ones are omitted here AND noindexed on the page, keeping SEO rule 3 ("in the
  // sitemap OR noindex, never both") true in both directions.
  const assessmentPages: MetadataRoute.Sitemap = Object.values(ASSESSMENT_CONFIG)
    .filter((a) => a.enabled)
    .map((a) => ({
      url: `${baseUrl}${a.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...assessmentPages, ...blogPages];
}
