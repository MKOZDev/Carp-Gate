import { getProducts, getShopCategories } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import ShopClient from "./ShopClient";
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return { title: t("title") };
}

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

function resolveNlCategoryId(id, categories, locale) {
  if (!id) return undefined;
  const cat = categories.find((c) => String(c.id) === String(id));
  if (!cat) return id;
  return locale === "en" ? cat._nlId || cat.id : cat.id;
}

export default async function ShopPage({ params, searchParams }) {
  const { locale } = await params;
  const {
    min_price,
    max_price,
    on_sale,
    in_stock,
    category,
    subcategory,
    sort_by,
    page,
  } = (await searchParams) || {};

  const currentPage = parseInt(page || "1");

  // Osobne pobranie kategorii + podkategorii, wyłącznie na potrzeby filtrów /shop
  const categories = await getShopCategories(locale);

  const selectedId = subcategory || category || undefined;
  const wcCategoryId = resolveNlCategoryId(selectedId, categories, locale);

  const { products, totalPages } = await getProducts(
    {
      per_page: 12,
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

  return (
    <ShopClient
      products={products}
      totalPages={totalPages}
      currentPage={currentPage}
      categories={categories}
      locale={locale}
      initialFilters={{
        min_price,
        max_price,
        on_sale,
        in_stock,
        category,
        subcategory,
        sort_by,
      }}
    />
  );
}
