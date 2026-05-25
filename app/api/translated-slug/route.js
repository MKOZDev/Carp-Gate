import { NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL;
const CK = process.env.WC_CONSUMER_KEY;
const CS = process.env.WC_CONSUMER_SECRET;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const from = searchParams.get("from") || "nl";
  const to = searchParams.get("to") || "en";

  try {
    // Pobierz produkt po slug w języku źródłowym
    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${CK}&consumer_secret=${CS}&wpml_language=${from}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) return NextResponse.json({ translatedSlug: slug });

    const products = await res.json();
    const product = products[0];
    if (!product) return NextResponse.json({ translatedSlug: slug });

    // Pobierz ID tłumaczenia
    const translatedId = product.translations?.[to];
    if (!translatedId) return NextResponse.json({ translatedSlug: slug });

    // Pobierz przetłumaczony produkt
    const transRes = await fetch(
      `${WP_URL}/wp-json/wc/v3/products/${translatedId}?consumer_key=${CK}&consumer_secret=${CS}`,
      { next: { revalidate: 3600 } },
    );

    if (!transRes.ok) return NextResponse.json({ translatedSlug: slug });

    const translatedProduct = await transRes.json();
    return NextResponse.json({ translatedSlug: translatedProduct.slug });
  } catch {
    return NextResponse.json({ translatedSlug: slug });
  }
}
