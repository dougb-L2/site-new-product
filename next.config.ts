import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://tagmanager.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://i.ytimg.com",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://analytics.google.com https://region1.google-analytics.com https://api.anthropic.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "media-src 'self'",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  headers: async () => [
    { source: "/(.*)", headers: securityHeaders },
    {
      source: "/:path*.pdf",
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    },
  ],
  redirects: async () => [],
};

export default nextConfig;
