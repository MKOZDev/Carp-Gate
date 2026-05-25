import { getPage } from "@/lib/api";
import { wpSlug } from "@/lib/slugs";
import { notFound } from "next/navigation";

const EXCLUDED_PAGES = [
  "shop",
  "cart",
  "product",
  "category",
  "over-ons",
  "about-us",
  "contact",
  "bedankt",
];

export async function generateMetadata({ params }) {
  const { locale, page } = await params;
  if (EXCLUDED_PAGES.includes(page)) return {};
  const slug = wpSlug(page, locale);
  const data = await getPage(slug, locale);
  if (!data) return {};
  return { title: data.title?.rendered };
}

export default async function StaticPage({ params }) {
  const { locale, page } = await params;

  if (EXCLUDED_PAGES.includes(page)) notFound();

  const slug = wpSlug(page, locale);
  const data = await getPage(slug, locale);
  if (!data) notFound();

  return (
    <div className="bg-bg-primary">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1
          className="text-4xl font-bold text-text-primary mb-10"
          dangerouslySetInnerHTML={{ __html: data.title?.rendered }}
        />
        {data.content?.rendered && (
          <div
            className="prose prose-invert max-w-none
              [&_p]:text-text-secondary [&_p]:leading-relaxed [&_p]:mb-4
              [&_h2]:text-text-primary [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4
              [&_h3]:text-text-primary [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
              [&_ul]:text-text-secondary [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:mb-4
              [&_ol]:text-text-secondary [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:mb-4
              [&_li]:text-text-secondary
              [&_strong]:text-text-primary [&_strong]:font-semibold
              [&_a]:text-text-accent [&_a]:hover:text-text-primary [&_a]:transition-colors"
            dangerouslySetInnerHTML={{ __html: data.content.rendered }}
          />
        )}
      </div>
    </div>
  );
}
