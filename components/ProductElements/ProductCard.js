"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { decodeHtml } from "@/lib/api";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function ProductCard({ product, locale }) {
  const image = product.images?.[0];
  const isOnSale = product.on_sale;
  const price = parseFloat(product.price || 0);
  const regularPrice = parseFloat(product.regular_price || 0);
  const t = useTranslations("product");
  const p = locale === "en" ? "/en" : "";
  const href = `${p}/product/${product.slug}`;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleNavigate(e) {
    e.preventDefault();
    setLoading(true);
    router.push(href);
  }

  return (
    <div className="group flex flex-col bg-bg-secondary rounded border border-transparent hover:border-text-accent duration-150 hover:-translate-y-0.5">
      <Link
        href={href}
        className="block relative aspect-square overflow-hidden rounded"
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-300"
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
      </Link>

      <div className="flex flex-col flex-1 gap-3 p-4">
        {product.categories?.length > 0 && (
          <div className="flex gap-1 flex-wrap grow">
            {product.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${p}/category/${cat.slug}`}
                className="text-xs text-text-accent hover:text-white transition-colors"
              >
                {decodeHtml(cat.name)}
              </Link>
            ))}
          </div>
        )}

        <Link
          href={href}
          className="flex hover:text-gray-500 transition-colors grow"
        >
          <h3 className="font-medium text-md text-text-primary line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 flex-wrap mt-1 text-text-primary">
          <>
            <span className="text-xl font-semibold">
              {price.toLocaleString("nl-NL", {
                style: "currency",
                currency: "EUR",
              })}
              <sup className="text-[9px] ml-1 font-light text-text-secondary/60">
                excl. VAT
              </sup>
            </span>
            {isOnSale && regularPrice > price && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {regularPrice.toLocaleString("nl-NL", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
                <span className="text-xl bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full font-medium">
                  -{Math.round((1 - price / regularPrice) * 100)}%
                </span>
              </>
            )}
          </>
        </div>

        <button
          onClick={handleNavigate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-3 h-[48px] font-medium text-sm text-text-secondary mt-auto cursor-pointer uppercase py-4 px-8 rounded border border-bg-accent transition-all duration-150 hover:bg-white/20 disabled:opacity-70"
        >
          {loading ? (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            t("viewProduct")
          )}
        </button>
      </div>
    </div>
  );
}
