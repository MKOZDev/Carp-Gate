"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Fish, Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  const locale = useLocale();
  const p = locale === "en" ? "/en" : "";

  return (
    <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-bg-primary px-4 py-24">
      <div className="max-w-lg w-full text-center">
        {/* Ikona */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-text-accent/20 rounded-full" />
            <div className="relative w-20 h-20 rounded-full border border-text-accent/30 bg-bg-secondary flex items-center justify-center">
              <Fish size={36} className="text-text-accent" />
            </div>
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-7xl sm:text-8xl font-bold text-text-primary tracking-tight mb-3">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-3">
          {locale === "en" ? "This one got away" : "Deze is ontsnapt"}
        </h2>

        <p className="text-text-secondary text-sm sm:text-base mb-10 max-w-sm mx-auto">
          {locale === "en"
            ? "The page you're looking for doesn't exist or has been moved. Let's get you back on the bank."
            : "De pagina die je zoekt bestaat niet meer of is verplaatst. Laten we je terugbrengen naar de oever."}
        </p>

        {/* Przyciski */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`${p}/`}
            className="flex items-center gap-2 px-6 py-3 bg-text-accent text-bg-primary rounded-full text-sm font-medium hover:opacity-90 transition-all w-full sm:w-auto justify-center"
          >
            <Home size={16} />
            {locale === "en" ? "Back to home" : "Terug naar home"}
          </Link>

          <Link
            href={`${p}/shop`}
            className="flex items-center gap-2 px-6 py-3 border border-text-secondary/20 text-text-secondary rounded-full text-sm font-medium hover:border-text-accent/40 hover:text-text-primary transition-all w-full sm:w-auto justify-center"
          >
            <ShoppingBag size={16} />
            {locale === "en" ? "Browse shop" : "Bekijk de winkel"}
          </Link>
        </div>
      </div>
    </section>
  );
}
