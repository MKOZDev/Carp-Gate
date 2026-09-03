"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Volume2, VolumeX, ShoppingBag } from "lucide-react";
import Wrapper from "../layout/Wrapper";

function VideoCard({ video, locale }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const viewProductLabel = locale === "en" ? "View product" : "Bekijk product";
  const newLabel = locale === "en" ? "New" : "Nieuw";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        const videoEl = videoRef.current;
        if (!videoEl) return;
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = !videoEl.muted;
    setIsMuted(videoEl.muted);
  }, []);

  return (
    <div
      ref={containerRef}
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-bg-secondary border border-text-secondary/15 hover:border-text-accent/50 transition-colors duration-300"
    >
      <video
        ref={videoRef}
        src={video.video_url}
        poster={video.poster_url || undefined}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {video.is_new && (
        <span className="absolute top-3 left-3 bg-text-accent text-bg-primary text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
          {newLabel}
        </span>
      )}

      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-text-primary transition-colors cursor-pointer"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>

      {/* <p className="absolute bottom-3 left-3 right-3 text-text-primary text-sm font-medium line-clamp-2">
        {video.title}
      </p> */}

      {video.product_link && isVisible && (
        <Link
          href={video.product_link}
          className="absolute bottom-12 left-3 right-3 flex items-center justify-center gap-2 bg-text-accent text-bg-primary text-xs font-semibold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {viewProductLabel}
        </Link>
      )}
    </div>
  );
}

export default function ProductVideosSection({ videos, locale }) {
  const title =
    locale === "en"
      ? "Watch our products in action"
      : "Bekijk onze producten in actie";
  const subtitle =
    locale === "en"
      ? "Real footage, straight from the lakeside"
      : "Echte beelden, rechtstreeks van de waterkant";

  if (!videos || videos.length === 0) return null;

  return (
    <section id="video" className="bg-bg-primary py-24 max-sm:py-8">
      <Wrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-4">
            {title}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} locale={locale} />
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
