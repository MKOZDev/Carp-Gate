import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const locale = searchParams.get("locale") || "nl";

  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const products = await searchProducts(q, locale);
  return NextResponse.json({ products });
}
