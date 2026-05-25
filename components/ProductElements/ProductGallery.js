"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  productName,
  isOnSale,
  saleLabel,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = images[activeIndex];

  return (
    <div className="space-y-3">
      {/* Główne zdjęcie */}
      <div className="aspect-square relative rounded-2xl overflow-hidden bg-bg-secondary">
        {mainImage ? (
          <Image
            src={mainImage.src}
            alt={mainImage.alt || productName}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary/20">
            <svg
              className="w-20 h-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}
        {isOnSale && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10">
            {saleLabel}
          </span>
        )}
      </div>

      {/* Miniaturki */}
      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-2
          [&::-webkit-scrollbar]:h-1
          [&::-webkit-scrollbar-track]:bg-bg-secondary
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-text-secondary/30
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-text-accent"
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-20 shrink-0 rounded-xl cursor-pointer overflow-hidden bg-bg-secondary border-2 transition-all duration-200 ${
                activeIndex === i
                  ? "border-text-accent "
                  : "border-transparent hover:border-text-secondary/30"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt || `${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
