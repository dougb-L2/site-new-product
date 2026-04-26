"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-data";

interface Hub {
  name: string;
  color: string;
  count: number;
}

export default function BlogGrid({
  posts,
  hubs,
}: {
  posts: BlogPost[];
  hubs: Hub[];
}) {
  const [activeHub, setActiveHub] = useState<string | null>(null);

  const filteredPosts = activeHub
    ? posts.filter((post) => post.hub === activeHub)
    : posts;

  return (
    <>
      {/* Hub Navigation */}
      <section className="bg-learn2-light py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-learn2-gray font-semibold mb-8">
            Filter by topic:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveHub(null)}
              className={`px-7 py-2.5 rounded-full font-semibold transition ${
                activeHub === null
                  ? "bg-learn2-orange text-white border-2 border-learn2-orange"
                  : "bg-white border-2 border-gray-200 text-learn2-text hover:border-learn2-orange"
              }`}
            >
              All Topics
            </button>
            {hubs.map((hub) => (
              <button
                key={hub.name}
                onClick={() => setActiveHub(hub.name)}
                className={`px-7 py-2.5 rounded-full font-semibold transition ${
                  activeHub === hub.name
                    ? "bg-learn2-orange text-white border-2 border-learn2-orange"
                    : "bg-white border-2 border-gray-200 text-learn2-text hover:border-learn2-orange"
                }`}
              >
                {hub.name} ({hub.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all group"
              >
                <div className="px-7 pt-7 pb-0">
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${
                      post.hubColor === "gold-mine"
                        ? "bg-yellow-100 text-gold-mine"
                        : post.hubColor === "blue-ocean"
                          ? "bg-blue-100 text-blue-ocean"
                          : post.hubColor === "green-planet"
                            ? "bg-green-100 text-green-planet"
                            : "bg-orange-100 text-orange-sky"
                    }`}
                  >
                    {post.hub}
                  </span>
                </div>
                <div className="px-7 py-5">
                  <h3 className="text-lg font-bold text-learn2-text mb-4 group-hover:text-learn2-orange transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-learn2-gray text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="px-7 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="text-xs text-learn2-gray">
                    <time dateTime={post.date}>{post.date}</time>
                    <span className="mx-2">&bull;</span>
                    <span>
                      {Math.max(
                        2,
                        Math.ceil(post.content.split(/\s+/).length / 230)
                      )}{" "}
                      min read
                    </span>
                  </div>
                  <span className="text-learn2-orange font-semibold text-sm group-hover:text-orange-sky transition">
                    Read &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
