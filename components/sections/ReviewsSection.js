"use client";
import { useState, useRef, useEffect } from "react";
import Wrapper from "../layout/Wrapper";
import HeadingBox from "../ui/HeadingBox";

function StarRating({ rating }) {
  return (
    <div className="flex text-sm">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= rating ? "text-yellow-400" : "text-text-secondary/20"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

function OverallRating({ reviews }) {
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const rounded = Math.round(avg * 10) / 10;

  return (
    <div className="flex items-center gap-3 mb-10 max-sm:mb-6">
      <span className="text-4xl font-bold text-text-primary">
        {rounded.toFixed(1)}
      </span>
      <div className="flex flex-col gap-1">
        <div className="flex text-yellow-400 text-lg">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={
                star <= Math.round(avg)
                  ? "text-yellow-400"
                  : "text-text-secondary/20"
              }
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-text-secondary text-xs">
          {reviews.length}{" "}
          {reviews.length === 1 ? "beoordeling" : "beoordelingen"}
        </span>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-bg-secondary rounded-2xl p-6 flex flex-col gap-3 flex-shrink-0 h-full">
      <p
        className="text-text-secondary text-sm leading-relaxed flex-1 line-clamp-4"
        dangerouslySetInnerHTML={{ __html: review.review }}
      />
      <div className="flex flex-col gap-1 mt-auto pt-3 border-t border-text-secondary/10">
        <StarRating rating={review.rating} />
        <p className="text-text-primary text-sm font-medium">
          {review.reviewer}
        </p>
        {review.product_name && (
          <p className="text-text-secondary/50 text-xs">
            {review.product_name}
          </p>
        )}
      </div>
    </div>
  );
}

function ReviewsGrid({ reviews }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

function ReviewsSlider({ reviews }) {
  const [current, setCurrent] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [perView, setPerView] = useState(4);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const maxIndex = reviews.length - perView;
  const gap = 16;

  useEffect(() => {
    function measure() {
      const w = window.innerWidth;
      const pv = w < 640 ? 1 : w < 1024 ? 2 : 4;
      setPerView(pv);
      if (trackRef.current) {
        const trackW = trackRef.current.offsetWidth;
        setCardWidth((trackW - gap * (pv - 1)) / pv);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const offset = current * (cardWidth + gap);

  function go(index) {
    setCurrent(Math.max(0, Math.min(maxIndex, index)));
  }

  function onMouseDown(e) {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = current;
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!isDragging.current || !cardWidth) return;
    const diff = startX.current - e.pageX;
    go(scrollStart.current + Math.round(diff / (cardWidth + gap)));
  }

  function onMouseUp(e) {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = startX.current - e.pageX;
    if (Math.abs(diff) > (cardWidth + gap) / 2) {
      go(scrollStart.current + (diff > 0 ? 1 : -1));
    } else {
      go(scrollStart.current);
    }
  }

  function onTouchStart(e) {
    startX.current = e.touches[0].pageX;
    scrollStart.current = current;
  }

  function onTouchEnd(e) {
    const diff = startX.current - e.changedTouches[0].pageX;
    if (Math.abs(diff) > 50) go(scrollStart.current + (diff > 0 ? 1 : -1));
  }

  return (
    <div>
      <div className="overflow-hidden" ref={trackRef}>
        <div
          className="flex"
          style={{
            gap: `${gap}px`,
            transform: `translateX(-${offset}px)`,
            transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            cursor: "grab",
            userSelect: "none",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0"
              style={{ width: `${cardWidth}px` }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => go(current - 1)}
          disabled={current === 0}
          className="w-9 h-9 rounded-full border border-text-secondary/20 flex items-center justify-center text-text-secondary hover:border-text-accent hover:text-text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-text-accent w-5"
                  : "bg-text-secondary/20 w-2"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(current + 1)}
          disabled={current === maxIndex}
          className="w-9 h-9 rounded-full border border-text-secondary/20 flex items-center justify-center text-text-secondary hover:border-text-accent hover:text-text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default function ReviewsSection({ reviews, title }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="relative bg-bg-primary w-full py-24 max-sm:py-8 overflow-hidden">
      <Wrapper>
        <HeadingBox title={title} />
        <OverallRating reviews={reviews} />
        {reviews.length <= 4 ? (
          <ReviewsGrid reviews={reviews} />
        ) : (
          <ReviewsSlider reviews={reviews} />
        )}
      </Wrapper>
    </section>
  );
}
