"use client";
import { useRef, useState, useEffect } from "react";
import BestsellerCard from "./BestsellerCard";

export default function BestsellerSlider({ products, locale }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(4);
  const [containerWidth, setContainerWidth] = useState(0);

  const dragStartX = useRef(0);
  const dragDiff = useRef(0);
  const isDragging = useRef(false);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Mierzymy realną szerokość kontenera + ustalamy perView
  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setContainerWidth(w);
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(4);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const maxIndex = Math.max(0, products.length - perView);
  const cardWidth = containerWidth / perView;

  function clamp(i) {
    return Math.min(Math.max(i, 0), maxIndex);
  }

  function goTo(i) {
    setIndex(clamp(i));
  }

  // Autoplay — co 2s, zapętlony, pauzuje na hover/drag
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering || isPointerDown) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [isHovering, isPointerDown, maxIndex]);

  // Drag handlers (mysz + touch)
  function onDown(clientX) {
    isDragging.current = false;
    dragStartX.current = clientX;
    dragDiff.current = 0;
    setIsPointerDown(true);
  }

  function onMove(clientX) {
    if (!isPointerDown) return;
    dragDiff.current = clientX - dragStartX.current;
    if (Math.abs(dragDiff.current) > 5) isDragging.current = true;
  }

  function onUp() {
    if (!isPointerDown) return;
    setIsPointerDown(false);

    const threshold = cardWidth / 4;
    if (dragDiff.current > threshold) {
      goTo(index - 1);
    } else if (dragDiff.current < -threshold) {
      goTo(index + 1);
    }
    dragDiff.current = 0;
  }

  // eslint-disable-next-line react-hooks/refs
  const dragOffset = isPointerDown ? dragDiff.current : 0;
  const translateX = -(index * cardWidth) + dragOffset;

  if (products.length < 4) {
    // Mniej niż 4 — normalny grid, bez slidera
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6">
        {products.map((product) => (
          <BestsellerCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Strzałki */}
      {index > 0 && (
        <button
          onClick={() => goTo(index - 1)}
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-bg-secondary border border-text-secondary/20 text-text-primary flex items-center justify-center hover:border-text-accent transition-colors z-20 cursor-pointer max-sm:hidden"
        >
          ‹
        </button>
      )}
      {index < maxIndex && (
        <button
          onClick={() => goTo(index + 1)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-bg-secondary border border-text-secondary/20 text-text-primary flex items-center justify-center hover:border-text-accent transition-colors z-20 cursor-pointer max-sm:hidden"
        >
          ›
        </button>
      )}

      <div
        ref={containerRef}
        className="overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          onUp();
        }}
        onMouseDown={(e) => onDown(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={onUp}
        onTouchStart={(e) => onDown(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onUp}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isPointerDown
              ? "none"
              : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{ width: cardWidth || `${100 / perView}%`, flexShrink: 0 }}
              className="px-1 lg:px-3"
            >
              <BestsellerCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      {/* Kropki nawigacji sekcji */}
      <div className="flex justify-center gap-1.5 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "bg-text-accent w-6" : "bg-text-secondary/30 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
