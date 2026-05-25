"use client";
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

  async function switchLocale(newLocale) {
    if (newLocale === locale) return;

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
      {["nl", "en"].map((lang) => (
        <button
          key={lang}
          onClick={() => switchLocale(lang)}
          className={`px-2.5 py-1 rounded-full text-xs cursor-pointer font-medium uppercase tracking-wider transition-all ${
            locale === lang
              ? "bg-text-accent text-bg-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
