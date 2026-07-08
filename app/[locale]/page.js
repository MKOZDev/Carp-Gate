import { getTranslations } from "next-intl/server";
import {
  getProducts,
  getCategories,
  getLatestReviews,
  getActiveCoupon,
} from "@/lib/api";
import Hero from "@/components/sections/Hero/Hero";
import AboutUs from "@/components/sections/AboutUs";
import HeadingBox from "@/components/ui/HeadingBox";
import Wrapper from "@/components/layout/Wrapper";
import ReviewsSection from "@/components/sections/ReviewsSection";
import Newsletter from "@/components/sections/Newsletter";
import BestsellerSlider from "@/components/ProductElements/Bestsellerslider";
import CategorySection from "@/components/sections/CategorySection";
import PromoSection from "@/components/ui/Promosection";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return { title: t("title") };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tR = await getTranslations({ locale, namespace: "reviews" });
  const p = locale === "en" ? "/en" : "";

  const [{ products: featured }, categories, reviews, coupon] =
    await Promise.all([
      getProducts({ featured: true, per_page: 12 }, locale),
      getCategories(locale),
      getLatestReviews(12),
      getActiveCoupon(),
    ]);

  return (
    <>
      <Hero locale={locale} />

      <AboutUs locale={locale} />

      {featured.length > 0 && (
        <section className="bg-bg-secondary py-24 max-sm:py-8">
          <Wrapper>
            <HeadingBox accent={t("featuredAccent")} title={t("featured")} />
            <BestsellerSlider products={featured} locale={locale} />
          </Wrapper>
        </section>
      )}
      <PromoSection coupon={coupon} locale={locale} />

      <section className="bg-bg-main py-24 max-sm:py-8">
        <Wrapper>
          <HeadingBox accent={t("categoriesAccent")} title={t("categories")} />
          <CategorySection categories={categories} locale={locale} p={p} />
        </Wrapper>
      </section>

      <Newsletter locale={locale} />
      <ReviewsSection reviews={reviews} title={tR("title")} />
    </>
  );
}
