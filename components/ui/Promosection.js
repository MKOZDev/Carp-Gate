"use client";
import { useState, useEffect } from "react";

function Countdown({ expiryDate, locale }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    function calc() {
      const diff = new Date(expiryDate) - new Date();
      if (diff <= 0) return setTimeLeft(null);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s });
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  if (!timeLeft) return null;

  const labels =
    locale === "en"
      ? ["days", "hours", "min", "sec"]
      : ["dagen", "uren", "min", "sec"];

  return (
    <div className="flex items-center gap-2">
      {[timeLeft.d, timeLeft.h, timeLeft.m, timeLeft.s].map((val, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-bg-primary/40 border border-white/10 rounded-lg px-3 py-1.5 min-w-[48px] text-center">
            <span className="text-xl font-bold text-text-primary font-mono">
              {String(val).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-text-secondary/60 mt-1">
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PromoSection({ coupon, locale }) {
  const [copied, setCopied] = useState(false);

  if (!coupon) return null;

  const expiryDate = new Date(coupon.date_expires);
  if (expiryDate < new Date()) return null;

  const discount =
    coupon.discount_type === "percent"
      ? `${coupon.amount}%`
      : `€${coupon.amount}`;

  function copyCode() {
    navigator.clipboard.writeText(coupon.code.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="bg-bg-secondary border-y border-text-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Lewa strona — tekst */}
          <div className="text-center lg:text-left">
            <p className="text-xs text-text-accent uppercase tracking-widest font-medium mb-2">
              {locale === "en" ? "Limited time offer" : "Beperkte aanbieding"}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              {locale === "en"
                ? `Get ${discount} off your order!`
                : `Krijg ${discount} korting op je bestelling!`}
            </h2>
            <p className="text-text-secondary text-sm">
              {locale === "en"
                ? "Use the code at checkout before the timer runs out."
                : "Gebruik de code bij het afrekenen voordat de timer afloopt."}
            </p>
          </div>

          {/* Środek — licznik */}
          <Countdown expiryDate={coupon.date_expires} locale={locale} />

          {/* Prawa strona — kod */}
          <div className="flex items-center gap-3">
            <div className="bg-bg-primary border border-text-accent/40 rounded-xl px-6 py-3 text-center min-w-[140px]">
              <span className="text-xl font-mono font-bold text-text-accent tracking-widest">
                {coupon.code.toUpperCase()}
              </span>
            </div>
            <button
              onClick={copyCode}
              className="px-5 py-3 bg-text-accent cursor-pointer text-bg-primary rounded-xl text-sm font-medium hover:opacity-90 transition-all whitespace-nowrap"
            >
              {copied
                ? locale === "en"
                  ? "Copied! ✓"
                  : "Gekopieerd! ✓"
                : locale === "en"
                  ? "Copy code"
                  : "Kopieer code"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
