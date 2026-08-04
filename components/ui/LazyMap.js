"use client";
import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

export default function LazyMap() {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden border border-text-secondary/10 mb-16 relative h-[500px]"
    >
      {!loaded ? (
        <a
          href="https://www.google.com/maps/search/?api=1&query=Zwaardvegersgaarde+48+2542+TE+Den+Haag"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full flex flex-col items-center justify-center bg-bg-secondary hover:bg-bg-primary transition-colors"
        >
          <MapPin size={32} className="text-text-accent mb-3 animate-pulse" />
          <span className="text-sm text-text-secondary">
            Zwaardvegersgaarde 48
          </span>
          <span className="text-xs text-text-secondary/50">
            2542 TE Den Haag, Holandia
          </span>
        </a>
      ) : (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2456.123!2d4.2820!3d52.0705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b72a5b2e3b3b%3A0x0!2sZwaardvegersgaarde+48%2C+2542+TE+Den+Haag!5e0!3m2!1snl!2snl!4v1234567890"
          width="100%"
          height="500"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      )}
    </div>
  );
}
