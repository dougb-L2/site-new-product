"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (
        el: HTMLIFrameElement,
        opts: { events: Record<string, (e: { data: number }) => void> }
      ) => void;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
  }
}

function pushEvent(eventName: string, params: Record<string, string>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export default function ConversionTracker() {
  useEffect(() => {
    // ── CTA Click Tracking ──
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;

      const el = target as HTMLElement;
      const href = el.getAttribute("href") || "";
      const text = el.textContent?.trim() || "";

      let funnelStage = "unknown";
      let ctaType = "other";

      if (href.includes("/assessment") || text.toLowerCase().includes("assessment") || text.toLowerCase().includes("communication patterns")) {
        funnelStage = "top";
        ctaType = "assessment_cta";
      } else if (href.includes("#video-demo") || text.toLowerCase().includes("see how") || text.toLowerCase().includes("preview")) {
        funnelStage = "top";
        ctaType = "video_cta";
      } else if (href.includes("free-discovery") || text.toLowerCase().includes("design your experience")) {
        funnelStage = "bottom";
        ctaType = "booking_cta";
      } else if (href.includes("/results") || text.toLowerCase().includes("how this works")) {
        funnelStage = "middle";
        ctaType = "proof_cta";
      } else if (href.includes("/certification")) {
        funnelStage = "middle";
        ctaType = "certification_cta";
      }

      if (ctaType !== "other") {
        pushEvent("cta_click", {
          cta_text: text,
          cta_url: href,
          funnel_stage: funnelStage,
          cta_type: ctaType,
          page_location: window.location.pathname,
        });
      }
    }

    document.addEventListener("click", handleClick);

    // ── YouTube Video Tracking (works with LiteYouTube click-to-load) ──
    const trackedIframes = new WeakSet<HTMLIFrameElement>();

    function attachYouTubeTracking(iframe: HTMLIFrameElement) {
      if (trackedIframes.has(iframe)) return;
      trackedIframes.add(iframe);

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }

      function initPlayer() {
        if (!window.YT?.Player) {
          setTimeout(initPlayer, 200);
          return;
        }
        new window.YT.Player(iframe, {
          events: {
            onStateChange: (event: { data: number }) => {
              const videoTitle =
                iframe.getAttribute("title") || "unknown_video";

              if (event.data === window.YT.PlayerState.PLAYING) {
                pushEvent("video_play", {
                  video_title: videoTitle,
                  video_url: iframe.src,
                  page_location: window.location.pathname,
                });
              }
              if (event.data === window.YT.PlayerState.ENDED) {
                pushEvent("video_complete", {
                  video_title: videoTitle,
                  video_url: iframe.src,
                  page_location: window.location.pathname,
                });
              }
            },
          },
        });
      }

      initPlayer();
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLIFrameElement && node.src?.includes("youtube.com/embed")) {
            attachYouTubeTracking(node);
          }
          if (node instanceof HTMLElement) {
            const iframes = node.querySelectorAll<HTMLIFrameElement>('iframe[src*="youtube.com/embed"]');
            iframes.forEach(attachYouTubeTracking);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll<HTMLIFrameElement>('iframe[src*="youtube.com/embed"]').forEach(attachYouTubeTracking);

    // ── Scroll Depth Tracking ──
    const trackedSections = new Set<string>();
    let scroll50Fired = false;

    function handleScroll() {
      // Section views
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const id = section.getAttribute("id");
        if (!id || trackedSections.has(id)) return;

        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          trackedSections.add(id);
          pushEvent("section_view", {
            section_id: id,
            page_location: window.location.pathname,
          });
        }
      });

      // 50% scroll depth
      if (!scroll50Fired) {
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        if (scrollPercent >= 0.5) {
          scroll50Fired = true;
          pushEvent("scroll_50", {
            page_location: window.location.pathname,
          });
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── Time on Page (30s) ──
    const timeTimer = setTimeout(() => {
      pushEvent("time_on_page_30s", {
        page_location: window.location.pathname,
      });
    }, 30000);

    // ── Form Submit Tracking ──
    function handleFormSubmit(e: SubmitEvent) {
      const form = e.target as HTMLFormElement;
      pushEvent("form_submit", {
        form_action: form.action || window.location.pathname,
        page_location: window.location.pathname,
      });
    }

    document.addEventListener("submit", handleFormSubmit as EventListener);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("submit", handleFormSubmit as EventListener);
      clearTimeout(timeTimer);
      observer.disconnect();
    };
  }, []);

  return null;
}
