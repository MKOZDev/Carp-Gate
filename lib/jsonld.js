import { BASE_URL } from "@/lib/seo";

const strip = (s = "") =>
  String(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const url = (path, locale) =>
  `${BASE_URL}${locale === "en" ? "/en" : ""}${path}`;

const AVAILABILITY = {
  instock: "https://schema.org/InStock",
  onbackorder: "https://schema.org/BackOrder",
  outofstock: "https://schema.org/OutOfStock",
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    "@id": `${BASE_URL}/#organization`,
    name: "CarpGate",
    alternateName: "CarpGate Karperviswinkel",
    url: BASE_URL,
    logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    description:
      "CarpGate is dé online karperviswinkel van Nederland. Ontdek boilies, pop-ups, wafters, pellets, karperhengels, molens en professionele karperuitrusting voor iedere karpervisser.",
    email: "info@carpgate.com",
    telephone: "+31652368685",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Zwaardvegersgaarde 48",
      postalCode: "2542 TE",
      addressLocality: "Den Haag",
      addressCountry: "NL",
    },
    areaServed: [
      { "@type": "Country", name: "Netherlands" },
      { "@type": "Country", name: "Belgium" },
    ],
    sameAs: [
      "https://www.instagram.com/carpgate_webshop",
      "https://www.facebook.com/profile.php?id=61589939893708",
    ],
  };
}

// items: [{ name, path }]  (path bez prefiksu /en; "" = home)
export function breadcrumbJsonLd(items, locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: strip(it.name),
      item: url(it.path, locale),
    })),
  };
}

function findBrand(product) {
  if (Array.isArray(product.brands) && product.brands[0]?.name) {
    return product.brands[0].name;
  }
  const attr = (product.attributes || []).find((a) =>
    /brand|merk|marka/i.test(a.name || a.slug || ""),
  );
  const val = attr?.options?.[0];
  return val ? strip(val) : null;
}

// variations: opcjonalnie tablica wariantów z polem price
export function productJsonLd(product, locale, variations = []) {
  const pageUrl = url(`/product/${product.slug}`, locale);

  const prices = (variations || [])
    .map((v) => parseFloat(v.price))
    .filter((n) => n > 0);
  const base = parseFloat(product.price) || 0;
  const low = prices.length ? Math.min(...prices) : base;
  const high = prices.length ? Math.max(...prices) : base;

  const availability =
    AVAILABILITY[product.stock_status] || AVAILABILITY.outofstock;

  const offer =
    prices.length && low !== high
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice: low.toFixed(2),
          highPrice: high.toFixed(2),
          offerCount: prices.length,
          availability,
          url: pageUrl,
        }
      : {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: low.toFixed(2),
          availability,
          url: pageUrl,
          itemCondition: "https://schema.org/NewCondition",
        };

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: strip(product.name),
    url: pageUrl,
    image: (product.images || []).map((i) => i.src).filter(Boolean),
    description: strip(product.short_description || product.description).slice(
      0,
      500,
    ),
    offers: offer,
  };

  if (product.sku) data.sku = product.sku;

  const brand = findBrand(product);
  if (brand) data.brand = { "@type": "Brand", name: brand };

  const ratingCount = Number(product.rating_count) || 0;
  const avg = parseFloat(product.average_rating) || 0;
  if (ratingCount > 0 && avg > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: ratingCount,
    };
  }

  return data;
}
