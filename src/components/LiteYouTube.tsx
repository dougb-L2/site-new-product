"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

interface LiteYouTubeProps {
  videoId: string;
  title: string;
  rounded?: string;
}

export default function LiteYouTube({
  videoId,
  title,
  rounded = "rounded-sm",
}: LiteYouTubeProps) {
  const [activated, setActivated] = useState(false);

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const activate = useCallback(() => {
    setActivated(true);
  }, []);

  if (activated) {
    return (
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className={`absolute top-0 left-0 w-full h-full ${rounded}`}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`relative w-full cursor-pointer group block ${rounded} overflow-hidden`}
      style={{ paddingBottom: "56.25%" }}
      onClick={activate}
      aria-label={`Play video: ${title}`}
    >
      {/* Thumbnail */}
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 896px"
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors shadow-lg">
          <svg
            className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white text-sm font-medium">{title}</p>
      </div>
    </button>
  );
}
