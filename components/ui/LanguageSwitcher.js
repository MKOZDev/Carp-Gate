"use client";
import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

const PRODUCT_ROUTES = ["product", "category"];

const LOCAL_SLUG_MAP = {
  bedankt: { nl: "bedankt", en: "thank-you" },
  "thank-you": { nl: "bedankt", en: "thank-you" },
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [pendingLocale, setPendingLocale] = useState(null);
  const timeoutRef = useRef(null);

  // Loader znika, gdy next-intl faktycznie zwróci nowe locale (strona się załadowała)
  useEffect(() => {
    if (pendingLocale && locale === pendingLocale) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingLocale(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [locale, pendingLocale]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function switchLocale(newLocale) {
    if (newLocale === locale || pendingLocale) return;

    setPendingLocale(newLocale);
    // Zabezpieczenie: gdyby nawigacja się nie udała, nie zostajemy z loaderem na zawsze
    timeoutRef.current = setTimeout(() => setPendingLocale(null), 8000);

    const pathWithoutLocale = pathname.replace(/^\/en/, "") || "/";
    const segments = pathWithoutLocale.split("/").filter(Boolean);

    // Strona CMS — jeden segment
    if (segments.length === 1 && !PRODUCT_ROUTES.includes(segments[0])) {
      const currentSlug = segments[0];

      // Lokalne mapowanie bez API
      if (LOCAL_SLUG_MAP[currentSlug]) {
        const mappedSlug = LOCAL_SLUG_MAP[currentSlug][newLocale];
        const search = window.location.search; // zachowaj ?order=...&key=...
        const newPath =
          newLocale === "en"
            ? `/en/${mappedSlug}${search}`
            : `/${mappedSlug}${search}`;
        router.push(newPath);
        return;
      }

      // Reszta przez API
      try {
        const res = await fetch(
          `/api/translated-page?slug=${currentSlug}&to=${newLocale}`,
        );
        if (res.ok) {
          const { slug } = await res.json();
          const newPath = newLocale === "en" ? `/en/${slug}` : `/${slug}`;
          router.push(newPath);
          return;
        }
      } catch {}
    }

    // Produkt
    if (segments[0] === "product" && segments[1]) {
      const productSlug = segments[1];
      try {
        const res = await fetch(
          `/api/translated-slug?slug=${productSlug}&from=${locale}&to=${newLocale}`,
        );
        if (res.ok) {
          const { translatedSlug } = await res.json();
          const newPath =
            newLocale === "en"
              ? `/en/product/${translatedSlug}`
              : `/product/${translatedSlug}`;
          router.push(newPath);
          return;
        }
      } catch {}
    }

    // Pozostałe strony
    const newPath =
      newLocale === "en" ? `/en${pathWithoutLocale}` : pathWithoutLocale;
    router.push(newPath || "/");
  }

  return (
    <div className="flex items-center gap-1 border border-text-secondary/20 rounded-full p-0.5">
      {["nl", "en"].map((lang) => {
        const isLoadingThis = pendingLocale === lang;
        return (
          <button
            key={lang}
            onClick={() => switchLocale(lang)}
            disabled={!!pendingLocale}
            className={`w-9 h-6 flex items-center justify-center rounded-full text-xs cursor-pointer font-medium uppercase tracking-wider transition-all disabled:cursor-not-allowed ${
              locale === lang
                ? "bg-text-accent text-bg-primary"
                : `text-text-secondary ${!pendingLocale ? "hover:text-text-primary" : ""}`
            } ${pendingLocale && !isLoadingThis ? "opacity-40" : ""}`}
          >
            {isLoadingThis ? (
              <svg
                className="w-3 h-3 animate-spin"
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
              lang
            )}
          </button>
        );
      })}
    </div>
  );
}
