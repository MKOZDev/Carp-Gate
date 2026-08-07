"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, X } from "lucide-react";
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

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Debounce zapytania
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`,
        );
        const data = await res.json();
        setSearchResults(data.products || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchQuery, locale]);

  // Zamknij po kliknięciu poza obszarem (desktop lub mobile)
  useEffect(() => {
    const handler = (e) => {
      const inDesktop = desktopSearchRef.current?.contains(e.target);
      const inMobile = mobileSearchRef.current?.contains(e.target);
      if (!inDesktop && !inMobile) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Autofocus po otwarciu — dopasowany do szerokości ekranu
  useEffect(() => {
    if (!searchOpen) return;
    if (window.innerWidth < 640) {
      mobileInputRef.current?.focus();
    } else {
      desktopInputRef.current?.focus();
    }
  }, [searchOpen]);

  // Blokada scrolla tła gdy mobilny pasek wyszukiwania jest otwarty
  useEffect(() => {
    if (window.innerWidth < 640) {
      document.body.style.overflow = searchOpen ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }

  function renderSearchResults() {
    if (searchLoading) {
      return (
        <div className="py-6 text-center text-sm text-text-secondary">
          {locale === "en" ? "Searching…" : "Zoeken…"}
        </div>
      );
    }
    if (searchResults.length === 0) {
      return (
        <div className="py-6 text-center text-sm text-text-secondary">
          {locale === "en" ? "No products found" : "Geen producten gevonden"}
        </div>
      );
    }
    return searchResults.map((product) => (
      <Link
        key={product.id}
        href={`${p}/product/${product.slug}`}
        onClick={closeSearch}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-secondary transition-colors"
      >
        <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-bg-secondary">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-primary truncate">{product.name}</p>
          <p className="text-xs text-text-accent font-medium">
            €{product.price}
            {product.on_sale && (
              <span className="ml-2 text-text-secondary/50 line-through">
                €{product.regular_price}
              </span>
            )}
          </p>
        </div>
      </Link>
    ));
  }

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
          <div className="flex items-center justify-between h-20">
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

                    {/* MEGA MENU */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-[600px]">
                      <div className="bg-bg-secondary border border-text-secondary/10 rounded-2xl shadow-2xl shadow-black/40 p-5">
                        {/* Link do wszystkich */}
                        <Link
                          href={`${p}/shop`}
                          className="flex items-center gap-2 text-sm font-semibold text-text-accent hover:text-text-primary transition-colors mb-4 pb-4 border-b border-text-secondary/10"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                          {locale === "en" ? "All products" : "Alle producten"}
                        </Link>

                        {/* 3 kolumny kategorii */}
                        <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`${p}/category/${cat.slug}`}
                              className="text-sm text-text-secondary hover:text-text-accent transition-colors py-1.5 truncate"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
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
              {/* Wyszukiwarka — desktop: ikona + rozwijana pigułka pod nią */}
              <div ref={desktopSearchRef} className="relative">
                <button
                  onClick={() => setSearchOpen((o) => !o)}
                  className="p-2 text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                  aria-label="Search"
                >
                  {searchOpen ? <X size={20} /> : <Search size={20} />}
                </button>

                {searchOpen && (
                  <div className="hidden sm:block absolute top-full right-0 mt-3 w-80 z-50">
                    <div className="flex items-center gap-2 bg-bg-secondary border border-text-secondary/20 rounded-full px-4 h-11">
                      <Search
                        size={16}
                        className="text-text-secondary shrink-0"
                      />
                      <input
                        ref={desktopInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                          locale === "en"
                            ? "Search products…"
                            : "Zoek producten…"
                        }
                        className="bg-transparent flex-1 min-w-0 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none"
                      />
                    </div>

                    {searchQuery.trim().length >= 2 && (
                      <div className="mt-2 max-h-96 overflow-y-auto bg-bg-secondary border border-text-secondary/10 rounded-2xl shadow-2xl shadow-black/40 p-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-text-secondary/30 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {renderSearchResults()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <LanguageSwitcher />

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

              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                aria-label="Menu"
              >
                <span
                  className={`block w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-text-primary transition-all duration-300 ${mobileOpen ? "w-0 opacity-0" : "w-6"}`}
                />
                <span
                  className={`block w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile: pełnoekranowy pasek wyszukiwania, wjeżdża z góry nad header */}
      <div
        ref={mobileSearchRef}
        className={`sm:hidden fixed top-0 left-0 right-0 z-[60] bg-bg-primary border-b border-text-secondary/10 transition-transform duration-300 ${
          searchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-2 px-4 h-16">
          <Search size={18} className="text-text-secondary shrink-0" />
          <input
            ref={mobileInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === "en" ? "Search products…" : "Zoek producten…"
            }
            className="bg-transparent flex-1 min-w-0 text-base text-text-primary placeholder:text-text-secondary/50 outline-none"
          />
          <button
            onClick={closeSearch}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors shrink-0"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {searchQuery.trim().length >= 2 && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-text-secondary/10 px-2 py-2">
            {renderSearchResults()}
          </div>
        )}
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-80 bg-bg-primary border-l border-text-secondary/10 flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
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

                  <div
                    className={`overflow-hidden transition-all duration-300 ${shopOpen ? "max-h-96" : "max-h-0"}`}
                  >
                    <div className="pl-4 py-1 space-y-1 overflow-y-auto max-h-96 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-text-secondary/30 [&::-webkit-scrollbar-thumb]:rounded-full">
                      <Link
                        href={`${p}/shop`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-text-accent hover:text-text-primary transition-colors rounded-lg hover:bg-bg-secondary"
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

      <div className="h-16 lg:h-20" />
    </>
  );
}
