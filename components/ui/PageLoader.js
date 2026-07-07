"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef(null);
  const hideTimerRef = useRef(null);
  const isNavigating = useRef(false);

  const startProgress = useCallback(() => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    clearInterval(intervalRef.current);
    clearTimeout(hideTimerRef.current);
    setProgress(0);
    setVisible(true);
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += Math.random() * 12 + 3;
      if (current >= 85) {
        current = 85;
        clearInterval(intervalRef.current);
      }
      setProgress(current);
    }, 120);
  }, []);

  const finishProgress = useCallback(() => {
    clearInterval(intervalRef.current);
    setProgress(100);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      isNavigating.current = false;
    }, 400);
  }, []);

  // Kliknięcie w link — start natychmiast
  useEffect(() => {
    function handleClick(e) {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto") ||
        href.startsWith("tel")
      )
        return;
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath === href) return;
      startProgress();
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [startProgress]);

  // Zakończ gdy URL się zmieni
  const prevUrl = useRef(null);
  useEffect(() => {
    const currentUrl = pathname + searchParams.toString();
    if (prevUrl.current === null) {
      prevUrl.current = currentUrl;
      return;
    }
    if (prevUrl.current !== currentUrl) {
      prevUrl.current = currentUrl;
      finishProgress();
    }
  }, [pathname, searchParams, finishProgress]);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-0.5 pointer-events-none">
      <div
        className="h-full bg-text-accent transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div
        className="absolute top-0 h-full w-16 bg-text-accent/50 blur-sm transition-all duration-200"
        style={{ left: `calc(${progress}% - 64px)` }}
      />
    </div>
  );
}

function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("loaderDone")) {
      setVisible(false);
      return;
    }
    const fadeTimer = setTimeout(() => setFading(true), 800);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("loaderDone", "1");
    }, 1300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-bg-primary flex items-center justify-center transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/logo.png"
          alt="Carp Gate"
          width={100}
          height={100}
          className="object-contain"
        />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-text-accent"
              style={{
                animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); opacity: 0.4; }
          to { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function PageLoader() {
  return (
    <>
      <SplashScreen />
      <NavigationBar />
    </>
  );
}
