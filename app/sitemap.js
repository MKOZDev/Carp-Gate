import { BASE_URL } from "@/lib/seo";

const WP = (process.env.NEXT_PUBLIC_WP_URL || "").replace(/\/$/, "");
const AUTH = `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;

export const revalidate = 21600;

async function fetchAll(endpoint, lang, fields, extra = "") {
  const items = [];
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(
      `${WP}/wp-json/wc/v3/${endpoint}?${AUTH}&lang=${lang}&per_page=100&page=${page}&_fields=${fields}${extra}`,
      { next: { revalidate: 21600 } },
    );
    if (!res.ok) {
      console.error(
        `[sitemap] ${endpoint} lang=${lang} page=${page} -> ${res.status}`,
      );
      break;
    }
    const data = await res.json();
    items.push(...data);
    if (data.length < 100) break;
  }
  return items;
}

// Jedna para NL/EN z wzajemnymi alternates (hreflang)
function pair(nlPath, enPath, base) {
  const nlUrl = `${BASE_URL}${nlPath}`;
  const enUrl = `${BASE_URL}/en${enPath}`;
  const alternates = {
    languages: { nl: nlUrl, en: enUrl, "x-default": nlUrl },
  };
  return [
    { url: nlUrl, alternates, ...base },
    { url: enUrl, alternates, ...base },
  ];
}

export default async function sitemap() {
  const now = new Date();
  const entries = [];
  const seen = new Set();

  const add = (list) =>
    list.forEach((e) => {
      if (seen.has(e.url)) return;
      seen.add(e.url);
      entries.push(e);
    });

  const staticPaths = [
    ["", ""],
    ["/over-ons", "/about-us"],
    ["/contact", "/contact"],
    ["/privacybeleid", "/privacy-policy"],
    ["/verzendbeleid", "/shipping-policy"],
    ["/algemene-voorwaarden", "/general-conditions"],
    ["/wettelijke-kennisgeving", "/legal-notice"],
    ["/terugbetalingsbeleid", "/refund-policy"],
  ];

  staticPaths.forEach(([nl, en], i) =>
    add(
      pair(nl, en, {
        lastModified: now,
        changeFrequency: i === 0 ? "daily" : "monthly",
        priority: i === 0 ? 1 : 0.5,
      }),
    ),
  );

  const EXCLUDED_CATS = ["uncategorized", "niet-gecategoriseerd"];

  const [cats, prods] = await Promise.all([
    fetchAll("products/categories", "nl", "slug", "&hide_empty=false"),
    fetchAll("products", "nl", "slug,date_modified,price", "&status=publish"),
  ]);

  cats
    .filter((c) => c.slug && !EXCLUDED_CATS.includes(c.slug))
    .forEach((c) =>
      add(
        pair(`/category/${c.slug}`, `/category/${c.slug}`, {
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        }),
      ),
    );

  prods
    .filter((p) => p.slug && parseFloat(p.price || 0) > 0)
    .forEach((p) =>
      add(
        pair(`/product/${p.slug}`, `/product/${p.slug}`, {
          lastModified: new Date(p.date_modified || now),
          changeFrequency: "weekly",
          priority: 0.8,
        }),
      ),
    );

  return entries;
}
