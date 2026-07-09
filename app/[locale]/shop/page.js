import { getProducts, getCategories } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import ShopClient from "./ShopClient";
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return { title: t("title") };
}

export default async function ShopPage({ params, searchParams }) {
  const { locale } = await params;
  const { min_price, max_price, on_sale, in_stock, category, page } =
    (await searchParams) || {};

  const currentPage = parseInt(page || "1");
  const { sort_by } = (await searchParams) || {};

  // Znajdź NL ID kategorii jeśli locale === "en"
  let categoryId = category || undefined;

  console.log("Final categoryId:", categoryId);
  console.log(
    "category param:",
    category,
    "categoryId after translation:",
    categoryId,
  );
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
  const [{ products, totalPages }, categories] = await Promise.all([
    getProducts(
      {
        per_page: 12,
        page: currentPage,
        ...getSortParams(sort_by),
        min_price: min_price || undefined,
        max_price: max_price || undefined,
        on_sale: on_sale === "true" ? true : undefined,
        stock_status: in_stock === "false" ? undefined : "instock",
        category: categoryId,
      },
      locale,
    ),
    getCategories(locale),
  ]);
  console.log(
    "Products count:",
    products.length,
    "categoryId used:",
    categoryId,
    "locale:",
    locale,
  );

  return (
    <ShopClient
      products={products}
      totalPages={totalPages}
      currentPage={currentPage}
      categories={categories}
      locale={locale}
      initialFilters={{ min_price, max_price, on_sale, in_stock, category }}
    />
  );
}
