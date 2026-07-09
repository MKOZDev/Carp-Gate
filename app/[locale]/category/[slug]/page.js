import { getCategoryBySlug, getProducts, getCategories } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductElements/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";

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
  const { page } = (await searchParams) || {};
  const p = locale === "en" ? "/en" : "";
  const currentPage = parseInt(page || "1");

  const category = await getCategoryBySlug(slug, locale);
  if (!category) notFound();

  const { products, totalPages, totalCount } = await getProducts(
    {
      category: category.id,
      per_page: 20,
      page: currentPage,
      stock_status: "instock",
    },
    locale,
  );

  return (
    <div className="bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <nav className="text-sm text-text-secondary mb-8 flex items-center gap-2">
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
          <span className="text-text-secondary/40">/</span>
          <span className="text-text-accent">{category.name}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2 text-text-primary">
            {category.name}
          </h1>
          {category.description && (
            <div
              className="text-text-secondary prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          )}
          <p className="text-sm text-text-secondary/60 mt-2">
            {totalCount} {locale === "en" ? "products" : "producten"}
          </p>
        </div>

        <ProductGrid products={products} locale={locale} />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`${p}/category/${slug}`}
          />
        )}

        <div className="mt-12 text-center">
          <Link
            href={`${p}/shop`}
            className="inline-flex items-center gap-2 border border-text-secondary/30 text-text-secondary px-6 py-3 rounded-full text-sm hover:border-text-accent hover:text-text-accent transition-colors"
          >
            ← {locale === "en" ? "Back to shop" : "Terug naar winkel"}
          </Link>
        </div>
      </div>
    </div>
  );
}
