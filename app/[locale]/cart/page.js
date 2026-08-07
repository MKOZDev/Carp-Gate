"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { gtmViewCart, metaInitiateCheckout } from "@/lib/gtm";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    total,
    count,
    buildCheckoutUrl,
    clearCart,
    mounted,
  } = useCart();
  const p = locale === "en" ? "/en" : "";
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    function handlePageShow(event) {
      if (event.persisted) {
        setIsRedirecting(false);
      }
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);
  useEffect(() => {
    if (mounted && cart.length > 0) {
      gtmViewCart(cart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  function handleCheckout() {
    gtmViewCart(cart);
    metaInitiateCheckout(cart);
    setIsRedirecting(true);
    document.cookie = `next_locale=${locale}; path=/; SameSite=Lax`;
    const url = buildCheckoutUrl();
    window.location.href = url;
    setTimeout(() => {
      clearCart();
    }, 300);
  }

  if (!mounted) {
    return (
      <div className="bg-bg-primary min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-text-secondary/20 border-t-text-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="bg-bg-primary min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-text-secondary/20 border-t-text-accent rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">{t("redirecting")}</p>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="bg-bg-primary min-h-screen flex flex-col items-center justify-center px-4">
        <svg
          className="w-16 h-16 text-text-secondary/30 mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        <p className="text-text-secondary text-lg mb-6">{t("empty")}</p>
        <Link
          href={`${p}/shop`}
          className="inline-flex items-center justify-center gap-3 font-medium text-md text-text-secondary uppercase py-4 px-8 rounded border border-text-accent transition-all duration-150 hover:bg-white/10"
        >
          {t("backToShop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen relative">
      {isRedirecting && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-2 border-text-secondary/20 border-t-text-accent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">{t("redirecting")}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <h1 className="text-3xl font-bold mb-10 text-text-primary">
          {t("title")}
        </h1>

        <div className="space-y-3 mb-10">
          {cart.map((item) => {
            const image = item.product.images?.[0];
            const price = parseFloat(
              item.variation?.price || item.product.price || 0,
            );
            const variantLabel = item.variation?.attributes
              ?.map((a) => a.option)
              .join(", ");
            const fullName = variantLabel
              ? `${item.product.name} — ${variantLabel}`
              : item.product.name;

            return (
              <div
                key={item.key}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-text-secondary/10 rounded-2xl bg-bg-secondary"
              >
                {/* Góra na mobile: zdjęcie + nazwa + cena */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href={`${p}/product/${item.product.slug}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-xl overflow-hidden bg-bg-primary shrink-0"
                  >
                    {image && (
                      <Image
                        src={image.src}
                        alt={fullName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 sm:hidden">
                    <Link
                      href={`${p}/product/${item.product.slug}`}
                      className="font-medium text-sm text-text-primary hover:text-text-accent transition-colors line-clamp-2"
                    >
                      {fullName}
                    </Link>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {price.toLocaleString("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      })}{" "}
                      / {t("pieces")}
                    </p>
                  </div>
                </div>

                {/* Desktop: nazwa */}
                <div className="hidden sm:block flex-1 min-w-0">
                  <Link
                    href={`${p}/product/${item.product.slug}`}
                    className="font-medium text-sm text-text-primary hover:text-text-accent transition-colors line-clamp-2"
                  >
                    {fullName}
                  </Link>
                  <p className="text-text-secondary text-sm mt-0.5">
                    {price.toLocaleString("nl-NL", {
                      style: "currency",
                      currency: "EUR",
                    })}{" "}
                    / {t("pieces")}
                  </p>
                </div>

                {/* Dół na mobile: ilość + cena + usuń */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.key, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full border border-text-secondary/30 cursor-pointer text-text-secondary hover:border-text-accent hover:text-text-accent flex items-center justify-center text-sm transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-text-primary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.key, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full border border-text-secondary/30 cursor-pointer text-text-secondary hover:border-text-accent hover:text-text-accent flex items-center justify-center text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm text-text-primary">
                      {(price * item.quantity).toLocaleString("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-xs text-text-secondary cursor-pointer hover:text-red-400 transition-colors mt-1"
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-text-secondary/10 pt-6 flex flex-col items-end gap-5">
          <div className="flex items-center justify-between w-full md:w-80">
            <span className="text-text-secondary">{t("total")}</span>
            <span className="text-2xl font-bold text-text-primary">
              {total.toLocaleString("nl-NL", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isRedirecting}
            className="w-full md:w-80 inline-flex items-center cursor-pointer justify-center gap-3 font-medium text-md text-text-secondary uppercase py-4 px-8 rounded border border-text-accent transition-all duration-150 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isRedirecting ? (
              <>
                <span className="w-4 h-4 border-2 border-text-secondary/30 border-t-text-accent rounded-full animate-spin" />
                {t("redirecting")}
              </>
            ) : (
              t("checkout")
            )}
          </button>

          <p className="text-xs text-text-secondary/60">
            {t("secureCheckout")}
          </p>

          <Link
            href={`${p}/shop`}
            className="text-sm text-text-secondary hover:text-text-accent transition-colors"
          >
            ← {t("backToShop")}
          </Link>
        </div>
      </div>
    </div>
  );
}
