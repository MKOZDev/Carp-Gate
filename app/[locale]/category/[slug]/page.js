import {
  getCategoryBySlug,
  getProducts,
  getCategories,
  getShopCategories,
} from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getSortParams, resolveNlCategoryId } from "@/lib/shop-filters";
import ShopClient from "@/components/sections/ShopElements/ShopClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories("nl");
  return categories.flatMap((cat) => [
    { locale: "nl", slug: cat.slug },
    { locale: "en", slug: cat.slug },
  ]);
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const category = await getCategoryBySlug(slug, locale);
  if (!category) return { title: "Niet gevonden" };
  return { title: category.name };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug, locale } = await params;
  const { min_price, max_price, on_sale, in_stock, sort_by, page } =
    (await searchParams) || {};
  const p = locale === "en" ? "/en" : "";
  const currentPage = parseInt(page || "1");

  const [category, shopCategories] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getShopCategories(locale),
  ]);
  if (!category) notFound();

  // Ta sama kategoria, ale z id zgodnym z selectami filtrów
  const current =
    shopCategories.find((c) => c.slug === slug) ||
    shopCategories.find((c) => String(c.id) === String(category.id));

  const isSub = !!current?.parent && current.parent !== 0;
  const parent = isSub
    ? shopCategories.find((c) => String(c.id) === String(current.parent))
    : null;

  // Wstępnie zaznaczone filtry: dla podkategorii — rodzic + ona sama
  const presetCategory = String(
    isSub ? current.parent : (current?.id ?? category.id),
  );
  const presetSubcategory = isSub ? String(current.id) : "";

  const wcCategoryId = current
    ? resolveNlCategoryId(current.id, shopCategories, locale)
    : category.id;

  const { products, totalPages, totalCount } = await getProducts(
    {
      per_page: 20,
      page: currentPage,
      ...getSortParams(sort_by),
      min_price: min_price || undefined,
      max_price: max_price || undefined,
      on_sale: on_sale === "true" ? true : undefined,
      stock_status: in_stock === "false" ? undefined : "instock",
      category: wcCategoryId,
    },
    locale,
  );

  const breadcrumb = (
    <nav className="text-sm text-text-secondary mb-8 flex items-center gap-2">
      <Link
        href={`${p}/`}
        className="hover:text-text-primary transition-colors max-sm:text-xs"
      >
        Home
      </Link>
      {parent && (
        <>
          <span className="text-text-secondary/40 max-sm:text-xs">/</span>
          <Link
            href={`${p}/category/${parent.slug}`}
            className="hover:text-text-primary transition-colors max-sm:text-xs"
          >
            {parent.name}
          </Link>
        </>
      )}
      <span className="text-text-secondary/40 max-sm:text-xs">/</span>
      <span className="text-text-accent max-sm:text-xs">{category.name}</span>
    </nav>
  );

  const descriptionNode = category.description ? (
    <div
      className="text-text-secondary prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: category.description }}
    />
  ) : null;

  return (
    <ShopClient
      key={`${locale}-${slug}`}
      products={products}
      totalPages={totalPages}
      totalCount={totalCount}
      currentPage={currentPage}
      categories={shopCategories}
      locale={locale}
      currentSlug={slug}
      initialFilters={{
        min_price,
        max_price,
        on_sale,
        in_stock,
        sort_by,
        category: presetCategory,
        subcategory: presetSubcategory,
      }}
      title={category.name}
      breadcrumb={breadcrumb}
      description={descriptionNode}
    />
  );
}
