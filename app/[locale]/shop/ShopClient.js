"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import ProductGrid from "@/components/ProductElements/ProductGrid";
import Pagination from "@/components/ui/Pagination";

function FiltersContent({
  t,
  minPrice,
  maxPrice,
  onSale,
  inStock,
  category,
  categories,
  setMinPrice,
  setMaxPrice,
  setOnSale,
  setInStock,
  setCategory,
  applyFilters,
  resetFilters,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="space-y-6">
      {/* Sortowanie — tylko w mobile */}
      <div className="lg:hidden">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          {t("sortBy")}
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-text-secondary/20 rounded-xl px-3 py-2 text-sm bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-text-accent"
        >
          <option value="default">{t("sortDefault")}</option>
          <option value="name_asc">{t("sortNameAsc")}</option>
          <option value="name_desc">{t("sortNameDesc")}</option>
          <option value="price_asc">{t("sortPriceAsc")}</option>
          <option value="price_desc">{t("sortPriceDesc")}</option>
        </select>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          {t("filterPrice")}
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder={t("priceFrom")}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-text-secondary/20 rounded-xl px-3 py-2 text-sm bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-text-accent placeholder:text-text-secondary/50"
          />
          <span className="text-text-secondary">—</span>
          <input
            type="number"
            placeholder={t("priceTo")}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-text-secondary/20 rounded-xl px-3 py-2 text-sm bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-text-accent placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          {t("filterCategory")}
        </h3>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-text-secondary/20 rounded-xl cursor-pointer px-3 py-2 text-sm bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-text-accent"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          {t("filterAvailability")}
        </h3>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
              className="w-4 h-4 accent-text-accent"
            />
            <span className="text-sm text-text-primary">{t("onSaleOnly")}</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 accent-text-accent"
            />
            <span className="text-sm text-text-primary">
              {t("inStockOnly")}
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={applyFilters}
          className="w-full bg-text-accent text-bg-primary cursor-pointer py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t("applyFilter")}
        </button>
        <button
          onClick={resetFilters}
          className="w-full border border-text-secondary/30 cursor-pointer py-2.5 rounded-full text-sm text-text-secondary hover:border-text-secondary transition-colors"
        >
          {t("resetFilter")}
        </button>
      </div>
    </div>
  );
}

const ProductSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-3 animate-pulse">
        <div className="aspect-square rounded bg-bg-secondary" />
        <div className="h-3 bg-bg-secondary rounded w-1/3" />
        <div className="h-4 bg-bg-secondary rounded w-3/4" />
        <div className="h-4 bg-bg-secondary rounded w-1/2" />
        <div className="h-10 bg-bg-secondary rounded" />
      </div>
    ))}
  </div>
);

// Mapowanie sortBy na parametry WooCommerce
function getSortParams(sortBy) {
  switch (sortBy) {
    case "name_asc":
      return { orderby: "title", order: "asc" };
    case "name_desc":
      return { orderby: "title", order: "desc" };
    case "price_asc":
      return { orderby: "price", order: "asc" };
    case "price_desc":
      return { orderby: "price", order: "desc" };
    default:
      return {};
  }
}

export default function ShopClient({
  products,
  totalPages,
  currentPage,
  categories,
  locale,
  initialFilters,
}) {
  const router = useRouter();
  const t = useTranslations("shop");
  const p = locale === "en" ? "/en" : "";

  const [minPrice, setMinPrice] = useState(initialFilters.min_price || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.max_price || "");
  const [onSale, setOnSale] = useState(initialFilters.on_sale === "true");
  const [inStock, setInStock] = useState(initialFilters.in_stock === "true");
  const [category, setCategory] = useState(initialFilters.category || "");
  const [sortBy, setSortBy] = useState(initialFilters.sort_by || "default");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  function buildParams(overrides = {}) {
    const params = new URLSearchParams();
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (onSale) params.set("on_sale", "true");
    if (inStock) params.set("in_stock", "true");
    if (category) params.set("category", category);
    if (sortBy !== "default") params.set("sort_by", sortBy);
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    return params.toString();
  }

  function applyFilters() {
    const q = buildParams();
    setIsLoading(true);
    router.push(`${p}/shop${q ? `?${q}` : ""}`);
    setMobileFilters(false);
  }

  function resetFilters() {
    setMinPrice("");
    setMaxPrice("");
    setOnSale(false);
    setInStock(false);
    setCategory("");
    setSortBy("default");
    setIsLoading(true);
    router.push(`${p}/shop`);
  }

  function handleSortChange(value) {
    setSortBy(value);
    const q = buildParams({ sort_by: value !== "default" ? value : "" });
    setIsLoading(true);
    router.push(`${p}/shop${q ? `?${q}` : ""}`);
  }

  const filterProps = {
    t,
    minPrice,
    maxPrice,
    onSale,
    inStock,
    category,
    categories,
    setMinPrice,
    setMaxPrice,
    setOnSale,
    setInStock,
    setCategory,
    applyFilters,
    resetFilters,
    sortBy,
    setSortBy,
  };

  return (
    <section className="bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">{t("title")}</h1>
          <button
            onClick={() => setMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 border border-text-secondary/30 rounded-full px-4 py-2 text-sm text-text-primary"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            {t("filterTitle")}
          </button>
        </div>

        <AnimatePresence>
          {mobileFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFilters(false)}
                className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden fixed top-0 right-0 h-full w-80 bg-bg-primary border-l border-text-secondary/10 z-50 flex flex-col"
              >
                <div className="flex items-center justify-between p-5 border-b border-text-secondary/10">
                  <h2 className="font-semibold text-text-primary">
                    {t("filterTitle")}
                  </h2>
                  <button
                    onClick={() => setMobileFilters(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-secondary transition-colors text-text-secondary"
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
                <div className="flex-1 overflow-y-auto p-5">
                  <FiltersContent {...filterProps} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-30">
              <h2 className="font-semibold mb-5 text-text-primary">
                {t("filterTitle")}
              </h2>
              <FiltersContent {...filterProps} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Pasek nad produktami */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              {/* Licznik — ukryj podczas loading */}
              <p className="text-sm text-text-secondary">
                {isLoading ? (
                  <span className="opacity-0">...</span>
                ) : (
                  t("found", { count: products.length })
                )}
              </p>

              {/* Sortowanie — zawsze widoczne */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary">
                  {t("sortBy")}:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-text-secondary/20 rounded-xl px-3 py-2 text-sm bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-text-accent cursor-pointer"
                >
                  <option value="default">{t("sortDefault")}</option>
                  <option value="name_asc">{t("sortNameAsc")}</option>
                  <option value="name_desc">{t("sortNameDesc")}</option>
                  <option value="price_asc">{t("sortPriceAsc")}</option>
                  <option value="price_desc">{t("sortPriceDesc")}</option>
                </select>
              </div>
            </div>

            {/* Mobile — liczba produktów */}
            {!isLoading && (
              <p className="lg:hidden text-sm text-text-secondary mb-6">
                {t("found", { count: products.length })}
              </p>
            )}

            {isLoading ? (
              <ProductSkeleton />
            ) : (
              <>
                <ProductGrid products={products} locale={locale} />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={`${p}/shop`}
                    extraParams={buildParams()}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
