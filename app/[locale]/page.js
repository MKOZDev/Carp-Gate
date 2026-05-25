import { getTranslations } from "next-intl/server";
import { getProducts, getCategories, decodeHtml } from "@/lib/api";
import Hero from "@/components/sections/Hero/Hero";
import ProductGrid from "@/components/ProductElements/ProductGrid";
import Link from "next/link";
import Image from "next/image";
import AboutUs from "@/components/sections/AboutUs";
import HeadingBox from "@/components/ui/HeadingBox";
import Wrapper from "@/components/layout/Wrapper";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return { title: t("title") };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const p = locale === "en" ? "/en" : "";

  const [{ products }, { products: featured }, categories] = await Promise.all([
    getProducts({ per_page: 8 }, locale),
    getProducts({ featured: true, per_page: 4 }, locale),
    getCategories(locale),
  ]);

  return (
    <>
      <Hero locale={locale} />
      <AboutUs locale={locale}></AboutUs>

      {categories.length > 0 && (
        <section className="bg-bg-secondary py-24 max-sm:py-8">
          <Wrapper>
            <HeadingBox
              accent={t("categoriesAccent")}
              title={t("categories")}
            ></HeadingBox>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`${p}/category/${cat.slug}`}
                  className="group relative h-48 bg-carp-green rounded-sm overflow-hidden flex flex-col items-center justify-center border border-white/5 hover:border-carp-accent/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                  {cat.image?.src ? (
                    <Image
                      src={cat.image.src}
                      alt={cat.image.alt || cat.name}
                      fill
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"
                      sizes="56px"
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
                  <p className="relative z-20 text-sm font-bold text-white tracking-wide text-center">
                    {decodeHtml(cat.name)}
                  </p>
                </Link>
              ))}
            </div>
          </Wrapper>
        </section>
      )}

      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{t("catalog")}</h2>
          <Link
            href={`${p}/shop`}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            {t("viewAll")}
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
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
        <ProductGrid products={products} locale={locale} />
      </section> */}

      {featured.length > 0 && (
        <section className="bg-bg-primary py-24 max-sm:py-8">
          <Wrapper>
            <HeadingBox
              accent={t("featuredAccent")}
              title={t("featured")}
            ></HeadingBox>
            <ProductGrid products={featured} locale={locale} />
          </Wrapper>
        </section>
      )}
    </>
  );
}
