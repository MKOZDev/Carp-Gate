"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import LanguageSwitcher from "../ui/LanguageSwitcher";

export default function Navbar({
  initialCategories = [],
  initialMenuItems = [],
}) {
  const locale = useLocale();
  const { count } = useCart();
  const p = locale === "en" ? "/en" : "";

  const categories = initialCategories;
  const menuItems = initialMenuItems;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Zamknij mobile menu przy zmianie rozmiaru
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  function cleanUrl(url) {
    if (!url) return "/";
    return url.replace(/^https?:\/\/[^/]+/, "") || "/";
  }

  const isShopItem = (item) =>
    item?.title?.toLowerCase().includes("winkel") ||
    item?.title?.toLowerCase().includes("shop");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg-primary/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-bg-primary"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 ">
            {/* Logo */}
            <Link href={`${p}/`} className="flex items-center gap-3 shrink-0">
              <Image
                src="/logo.png"
                alt="Carp Gate"
                width={60}
                height={60}
                className="object-contain"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) =>
                isShopItem(item) ? (
                  // Sklep z dropdown kategorii
                  <div key={item.ID} className="relative group">
                    <Link
                      href={cleanUrl(item.url)}
                      className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors uppercase tracking-wider"
                    >
                      {item.title}
                      <svg
                        className="w-3 h-3 transition-transform group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Link>

                    {/* Dropdown kategorii */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-bg-secondary border border-text-secondary/10 rounded-xl shadow-xl shadow-black/30 py-2 min-w-48">
                        <Link
                          href={`${p}/shop`}
                          className="block px-4 py-2 text-sm text-text-secondary hover:text-text-accent hover:bg-bg-primary/50 transition-colors"
                        >
                          {locale === "en" ? "All products" : "Alle producten"}
                        </Link>
                        <div className="border-t border-text-secondary/10 my-1" />
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`${p}/category/${cat.slug}`}
                            className="block px-4 py-2 text-sm text-text-secondary hover:text-text-accent hover:bg-bg-primary/50 transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.ID}
                    href={cleanUrl(item.url)}
                    className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors uppercase tracking-wider"
                  >
                    {item.title}
                  </Link>
                ),
              )}
            </nav>

            {/* Prawa strona */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher></LanguageSwitcher>

              {/* Koszyk */}
              <Link
                href={`${p}/cart`}
                className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-text-accent text-bg-primary text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>

              {/* Burger mobile */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                aria-label="Menu"
              >
                <span
                  className={`block w-6 h-0.5 bg-text-primary transition-all duration-300 ${
                    mobileOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-text-primary transition-all duration-300 ${
                    mobileOpen ? "w-0 opacity-0" : "w-6"
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-text-primary transition-all duration-300 ${
                    mobileOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-bg-primary border-l border-text-secondary/10 flex flex-col transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header panelu */}
          <div className="flex items-center justify-between p-5 border-b border-text-secondary/10 h-16">
            <span className="font-bold text-text-primary">CARP GATE</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nawigacja mobile */}
          <nav className="flex-1 overflow-y-auto p-5 space-y-1">
            {menuItems.map((item) =>
              isShopItem(item) ? (
                <div key={item.ID}>
                  <button
                    onClick={() => setShopOpen((o) => !o)}
                    className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-text-secondary hover:text-text-primary uppercase tracking-wider transition-colors"
                  >
                    {item.title}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Submenu kategorii mobile */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      shopOpen ? "max-h-72" : "max-h-0"
                    }`}
                  >
                    <div
                      className="pl-4 py-1 space-y-1 overflow-y-auto max-h-72
    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-text-secondary/30
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb:hover]:bg-text-accent"
                    >
                      <Link
                        href={`${p}/shop`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 text-sm text-text-secondary hover:text-text-accent transition-colors rounded-lg hover:bg-bg-secondary"
                      >
                        {locale === "en" ? "All products" : "Alle producten"}
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`${p}/category/${cat.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 text-sm text-text-secondary hover:text-text-accent transition-colors rounded-lg hover:bg-bg-secondary"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.ID}
                  href={cleanUrl(item.url)}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 text-sm font-medium text-text-secondary hover:text-text-primary uppercase tracking-wider transition-colors rounded-lg hover:bg-bg-secondary"
                >
                  {item.title}
                </Link>
              ),
            )}
          </nav>

          {/* Dół panelu — koszyk */}
          <div className="p-5 border-t border-text-secondary/10">
            <Link
              href={`${p}/cart`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-text-accent/30 text-text-secondary hover:border-text-accent hover:text-text-accent transition-colors"
            >
              <span className="text-sm font-medium uppercase tracking-wider">
                {locale === "en" ? "Cart" : "Winkelwagen"}
              </span>
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <span className="bg-text-accent text-bg-primary text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
                <ShoppingCart size={18} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer żeby treść nie chowała się pod sticky headerem */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
