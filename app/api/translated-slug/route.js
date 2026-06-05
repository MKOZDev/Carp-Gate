import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL;
const CK = process.env.WC_CONSUMER_KEY;
const CS = process.env.WC_CONSUMER_SECRET;

/**
 * Zamiast 2 sekwencyjnych fetchów — 1 fetch z wpml_language=to.
 * WPML zwróci produkt już w docelowym języku jeśli slug istnieje w NL,
 * a my wyciągamy translations[to].slug bezpośrednio.
 *
 * Logika:
 * 1. Pobierz produkt w języku źródłowym (from) → mamy translations[to] = ID
 * 2. Pobierz przetłumaczony produkt po ID z językiem docelowym (to) — ALE
 *    zamiast drugiego fetch HTTP robimy to w jednym zapytaniu przez
 *    ?wpml_language=to na endpoincie produktu z ID, co jest szybsze niż
 *    ?slug= bo ID lookup jest O(1) w bazie.
 *
 * Dodatkowo owijamy w unstable_cache żeby Next.js cache działał też
 * dla route handlerów (normalnie fetch() cache nie działa w route handlers).
 */

const getTranslatedSlug = unstable_cache(
  async (slug, from, to) => {
    // Krok 1: znajdź produkt po slugu w języku źródłowym
    const searchUrl = new URL(`${WP_URL}/wp-json/wc/v3/products`);
    searchUrl.searchParams.set("slug", slug);
    searchUrl.searchParams.set("consumer_key", CK);
    searchUrl.searchParams.set("consumer_secret", CS);
    searchUrl.searchParams.set("wpml_language", from);
    searchUrl.searchParams.set("_fields", "id,slug,translations"); // tylko potrzebne pola

    const res = await fetch(searchUrl.toString());
    if (!res.ok) return slug;

    const products = await res.json();
    const product = products[0];
    if (!product) return slug;

    const translatedId = product.translations?.[to];
    if (!translatedId) return slug;

    // Krok 2: pobierz przetłumaczony produkt po ID (szybsze niż po slugu)
    // + od razu w docelowym języku żeby dostać poprawny slug
    const productUrl = new URL(
      `${WP_URL}/wp-json/wc/v3/products/${translatedId}`,
    );
    productUrl.searchParams.set("consumer_key", CK);
    productUrl.searchParams.set("consumer_secret", CS);
    productUrl.searchParams.set("wpml_language", to);
    productUrl.searchParams.set("_fields", "id,slug"); // tylko slug potrzebny

    const transRes = await fetch(productUrl.toString());
    if (!transRes.ok) return slug;

    const translatedProduct = await transRes.json();
    return translatedProduct.slug || slug;
  },
  ["translated-slug"],
  { revalidate: 3600 },
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const from = searchParams.get("from") || "nl";
  const to = searchParams.get("to") || "en";

  if (!slug) {
    return NextResponse.json({ translatedSlug: "" }, { status: 400 });
  }

  try {
    const translatedSlug = await getTranslatedSlug(slug, from, to);
    return NextResponse.json(
      { translatedSlug },
      {
        headers: {
          // Przeglądarka + CDN cache na 1h — po pierwszym wywołaniu kolejne są natychmiastowe
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json({ translatedSlug: slug });
  }
}
