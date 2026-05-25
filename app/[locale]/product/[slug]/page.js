import { getProductBySlug, getProducts } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import { cleanDescription } from "@/lib/api";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/ProductElements/AddToCartButton";
import ProductGrid from "@/components/ProductElements/ProductGrid";
import ProductGallery from "@/components/ProductElements/ProductGallery";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) return { title: "Niet gevonden" };
  return {
    title: product.name,
    description: product.short_description
      ?.replace(/<[^>]+>/g, "")
      .slice(0, 160),
    openGraph: {
      images: product.images?.[0] ? [{ url: product.images[0].src }] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "product" });
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const p = locale === "en" ? "/en" : "";
  const isOnSale = product.on_sale;
  const price = parseFloat(product.price || 0);
  const regularPrice = parseFloat(product.regular_price || 0);

  const firstCategoryId = product.categories?.[0]?.id;
  const { products: relatedRaw } = firstCategoryId
    ? await getProducts(
        { category: firstCategoryId, per_page: 5, exclude: product.id },
        locale,
      )
    : { products: [] };

  const relatedProducts = relatedRaw
    .filter((rp) => rp.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-secondary mb-8 flex items-center gap-2 flex-wrap">
          <Link
            href={`${p}/`}
            className="hover:text-text-primary transition-colors"
          >
            Home
          </Link>
          <span className="text-text-secondary/40">/</span>
          <Link
            href={`${p}/shop`}
            className="hover:text-text-primary transition-colors"
          >
            {locale === "en" ? "Shop" : "Winkel"}
          </Link>
          {product.categories?.[0] && (
            <>
              <span className="text-text-secondary/40">/</span>
              <Link
                href={`${p}/category/${product.categories[0].slug}`}
                className="hover:text-text-primary transition-colors"
              >
                {product.categories[0].name}
              </Link>
            </>
          )}
          <span className="text-text-secondary/40">/</span>
          <span className="text-text-accent">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery
            images={product.images || []}
            productName={product.name}
            isOnSale={isOnSale}
            saleLabel={t("sale")}
          />

          <div className="flex flex-col gap-5">
            {/* Kategorie */}
            {product.categories?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {product.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`${p}/category/${cat.slug}`}
                    className="text-xs text-text-accent uppercase tracking-wider hover:text-text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Nazwa */}
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              {product.name}
            </h1>

            {/* Cena */}
            <div className="flex items-center gap-3">
              {product.type !== "variable" && (
                <>
                  <span className="text-3xl font-bold text-text-primary">
                    {price.toLocaleString("nl-NL", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                  {isOnSale && regularPrice > price && (
                    <>
                      <span className="text-text-secondary line-through text-xl">
                        {regularPrice.toLocaleString("nl-NL", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </span>
                      <span className="bg-red-500/10 text-red-400 text-sm font-medium px-2 py-0.5 rounded-full">
                        -{Math.round((1 - price / regularPrice) * 100)}%
                      </span>
                    </>
                  )}
                </>
              )}
              {product.type === "variable" && product.price_html && (
                <span
                  className="text-xl font-semibold text-text-primary"
                  dangerouslySetInnerHTML={{ __html: product.price_html }}
                />
              )}
            </div>

            {/* Krótki opis */}
            {product.short_description && (
              <div
                className="text-text-secondary text-sm leading-relaxed prose prose-sm max-w-none prose-invert"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            <AddToCartButton product={product} />

            {/* Stan magazynowy */}
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock_status === "instock"
                    ? "bg-green-500"
                    : "bg-red-400"
                }`}
              />
              <span
                className={
                  product.stock_status === "instock"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {product.stock_status === "instock"
                  ? t("inStock")
                  : t("outOfStock")}
              </span>
              {product.stock_quantity && product.stock_quantity < 10 && (
                <span className="text-text-secondary">
                  ({product.stock_quantity} resterend)
                </span>
              )}
            </div>

            {product.sku && (
              <p className="text-xs text-text-secondary/60">
                SKU: {product.sku}
              </p>
            )}
          </div>
        </div>

        {/* Opis */}
        {product.description && (
          <section className="mt-10 pt-10 border-t border-text-secondary/10">
            <h2 className="text-xl font-semibold mb-8 text-text-primary">
              {t("description")}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Panel boczny — na mobile PRZED opisem */}
              <div className="lg:col-span-1 lg:order-2">
                <div className="bg-bg-secondary rounded-2xl p-6 space-y-4 ">
                  {product.sku && (
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                        SKU
                      </p>
                      <p className="text-text-primary text-sm font-medium">
                        {product.sku}
                      </p>
                    </div>
                  )}
                  {product.categories?.length > 0 && (
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">
                        {locale === "en" ? "Categories" : "Categorieën"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`${p}/category/${cat.slug}`}
                            className="text-xs bg-bg-primary text-text-accent px-3 py-1 rounded-full border border-text-accent/30 hover:border-text-accent transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">
                      {locale === "en" ? "Availability" : "Beschikbaarheid"}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.stock_status === "instock"
                            ? "bg-green-500"
                            : "bg-red-400"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          product.stock_status === "instock"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {product.stock_status === "instock"
                          ? t("inStock")
                          : t("outOfStock")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opis — na mobile PO panelu */}
              <div className="lg:col-span-2 lg:order-1">
                <div className="overflow-x-auto">
                  <div
                    className="prose prose-invert max-w-none
          [&_p]:text-text-secondary [&_p]:leading-relaxed [&_p]:mb-4
          [&_strong]:text-text-primary [&_strong]:font-semibold
          [&_ul]:text-text-secondary [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-4
          [&_li]:text-text-secondary
          [&_h2]:text-text-primary [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3
          [&_h3]:text-text-primary [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
          [&_table]:w-full [&_table]:border-collapse [&_table]:mt-6 [&_table]:min-w-[500px]
          [&_tr]:border-b [&_tr]:border-text-secondary/10
          [&_tr:last-child]:border-0
          [&_td]:py-3 [&_td]:px-4 [&_td]:text-text-secondary [&_td]:text-sm
          [&_th]:py-3 [&_th]:px-4 [&_th]:text-text-primary [&_th]:text-sm [&_th]:font-semibold [&_th]:text-left
          [&_tbody_tr:nth-child(even)]:bg-bg-secondary/50"
                    dangerouslySetInnerHTML={{
                      __html: cleanDescription(product.description),
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Powiązane produkty */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 pt-10 border-t border-text-secondary/10">
            <h2 className="text-xl font-semibold mb-8 text-text-primary">
              {locale === "en"
                ? "More from this category"
                : "Meer uit deze categorie"}
            </h2>
            <ProductGrid products={relatedProducts} locale={locale} />
          </section>
        )}
      </div>
    </div>
  );
}
