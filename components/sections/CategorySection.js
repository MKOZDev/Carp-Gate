import Link from "next/link";
import Image from "next/image";
import { decodeHtml } from "@/lib/api";

// ─── KONFIGURACJA — wpisz slugi kategorii które chcesz pokazać ───────────────
const CATEGORY_SLUGS = [
  "wedziska-karpiowe",
  "kolowrotki-karpiowe",
  "przynety-haczykowe-kulki-plywajace",
  "zanety-karpiowe-stick-mix",
  "odziez-wedkarska",
  "torby-karpiowe",
  "namioty-karpiowe",
  "atraktory-boostery",
  "podporki-karpiowe",
  "sygnalizatory-wedkarskie",
  "zylka-wedkarska-karpiowa",
  "plecionki-przyponowe",
  "haczyki-karpiowe",
];
// ─────────────────────────────────────────────────────────────────────────────

export default function CategoryGrid({ categories, locale, p }) {
  // Filtruj i sortuj według kolejności z CATEGORY_SLUGS
  const filtered = CATEGORY_SLUGS.map((slug) =>
    categories.find((c) => c.slug === slug),
  ).filter(Boolean);

  const shopLabel = locale === "en" ? "All categories" : "Alle categorieën";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {filtered.map((cat) => (
        <Link
          key={cat.id}
          href={`${p}/category/${cat.slug}`}
          className="group relative h-48 bg-carp-green rounded-sm overflow-hidden flex flex-col items-center justify-center border border-white/5 hover:border-carp-accent/50 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
          {cat.image?.src ? (
            <Image
              src={cat.image.src}
              alt={cat.image.alt || cat.name}
              fill
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"
              sizes="200px"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
                />
              </svg>
            </div>
          )}
          <p className="relative z-20 text-sm font-bold text-white tracking-wide text-center px-2">
            {decodeHtml(cat.name)}
          </p>
        </Link>
      ))}

      {/* Kafelek — wszystkie kategorie */}
      <Link
        href={`${p}/shop`}
        className="group relative h-48 rounded-sm flex flex-col items-center justify-center border border-white/10 hover:border-[#c8a561]/50 hover:bg-white/5 transition-all duration-300 gap-3"
      >
        <div className="w-12 h-12 rounded-full border border-white/20 group-hover:border-[#c8a561] flex items-center justify-center transition-all duration-300">
          <svg
            className="w-5 h-5 text-white/40 group-hover:text-[#c8a561] transition-all duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-white/40 group-hover:text-[#c8a561] transition-colors duration-300 tracking-wide text-center px-2">
          {shopLabel}
        </p>
      </Link>
    </div>
  );
}
