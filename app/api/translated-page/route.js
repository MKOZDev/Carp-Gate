import { NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL;

// Ręczna mapa NL slug → EN slug
const SLUG_MAP = {
  verzendbeleid: "shipping-policy",
  terugbetalingsbeleid: "refund-policy",
  "algemene-voorwaarden": "general-conditions",
  "wettelijke-kennisgeving": "legal-notice",
  privacybeleid: "privacy-policy",
  "over-ons": "about-us",
  // EN → NL
  "shipping-policy": "verzendbeleid",
  "refund-policy": "terugbetalingsbeleid",
  "general-conditions": "algemene-voorwaarden",
  "legal-notice": "wettelijke-kennisgeving",
  "privacy-policy": "privacybeleid",
  "about-us": "over-ons",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const translatedSlug = SLUG_MAP[slug] || slug;
  return NextResponse.json({ slug: translatedSlug });
}
