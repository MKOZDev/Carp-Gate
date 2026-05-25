// lib/api.js
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const WP_URL = process.env.NEXT_PUBLIC_WP_URL;
const CK = process.env.WC_CONSUMER_KEY;
const CS = process.env.WC_CONSUMER_SECRET;

function wcUrl(endpoint, params = {}, locale = null) {
  const base = {
    consumer_key: CK,
    consumer_secret: CS,
  };
  if (locale) base.wpml_language = locale;
  const merged = { ...base, ...params };
  Object.keys(merged).forEach(
    (k) => (merged[k] == null || merged[k] === false) && delete merged[k],
  );
  return `${WP_URL}/wp-json/wc/v3/${endpoint}?${new URLSearchParams(merged)}`;
}

export function decodeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export async function getProducts(params = {}, locale = "nl") {
  try {
    const url = wcUrl(
      "products",
      { per_page: 20, status: "publish", ...params },
      locale,
    );

    const res = await fetch(url, { next: { revalidate: 600 } }); // było 60 → 10 minut
    if (!res.ok) return { products: [], totalPages: 1, totalCount: 0 };

    const rawProducts = await res.json();
    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
    const totalCount = parseInt(res.headers.get("X-WP-Total") || "0");

    const products = rawProducts.map((p) => ({
      ...p,
      name: decodeHtml(p.name),
      categories: p.categories?.map((c) => ({
        ...c,
        name: decodeHtml(c.name),
      })),
    }));

    return { products, totalPages, totalCount };
  } catch {
    return { products: [], totalPages: 1, totalCount: 0 };
  }
}

export async function getProductBySlug(slug, locale = "nl") {
  try {
    const res = await fetch(wcUrl("products", { slug }, locale), {
      next: { revalidate: 600 }, // było 60 → 10 minut
    });
    if (!res.ok) return null;
    const data = await res.json();
    const product = data[0];
    if (!product) return null;

    product.name = decodeHtml(product.name);
    product.categories = product.categories?.map((c) => ({
      ...c,
      name: decodeHtml(c.name),
    }));

    // Pobierz zdjęcia z NL jeśli EN ma mniej zdjęć — równolegle z variations
    const fetchNlImages =
      locale !== "nl" && product.translations?.nl
        ? fetch(wcUrl(`products/${product.translations.nl}`, {}), {
            next: { revalidate: 600 },
          })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        : Promise.resolve(null);

    const fetchVariations =
      product.type === "variable"
        ? fetch(
            wcUrl(
              `products/${product.id}/variations`,
              { per_page: 100 },
              locale,
            ),
            { next: { revalidate: 600 } },
          )
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => [])
        : Promise.resolve(null);

    // Oba requesty równolegle zamiast sekwencyjnie
    const [nlProduct, variations] = await Promise.all([
      fetchNlImages,
      fetchVariations,
    ]);

    if (nlProduct?.images?.length > product.images?.length) {
      product.images = nlProduct.images;
    }

    if (variations !== null) {
      product._variations = variations;
    }

    return product;
  } catch (e) {
    console.error("getProductBySlug error:", e);
    return null;
  }
}

export async function getCategories(locale = "nl") {
  try {
    // Pobierz NL i EN jednocześnie zamiast sekwencyjnie
    const fetchNl = fetch(
      wcUrl("products/categories", { per_page: 100, hide_empty: true }, "nl"),
      { next: { revalidate: 3600 } },
    );

    const fetchEn =
      locale === "en"
        ? fetch(
            wcUrl(
              "products/categories",
              { per_page: 100, hide_empty: true },
              "en",
            ),
            { next: { revalidate: 3600 } },
          )
        : Promise.resolve(null);

    const [nlRes, enRes] = await Promise.all([fetchNl, fetchEn]);

    if (!nlRes.ok) return [];
    const nlCats = await nlRes.json();
    const filtered = nlCats.filter((c) => c.slug !== "uncategorized");

    if (locale === "en" && enRes?.ok) {
      // Pobierz EN kategorie jednym requestem zamiast N requestów
      const enCats = await enRes.json();
      const enMap = new Map(enCats.map((c) => [c.id, c]));

      return filtered.map((cat) => {
        const enId = cat.translations?.en;
        const enCat = enId ? enMap.get(enId) : null;
        return {
          ...cat,
          name: decodeHtml(enCat?.name || cat.name),
          slug: enCat?.slug || cat.slug,
        };
      });
    }

    return filtered.map((cat) => ({
      ...cat,
      name: decodeHtml(cat.name),
    }));
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug, locale = "nl") {
  try {
    const res = await fetch(wcUrl("products/categories", { slug }, locale), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const cat = data[0];
    return cat ? { ...cat, name: decodeHtml(cat.name) } : null;
  } catch {
    return null;
  }
}

export async function getMenu(locale = "nl", menuName = "menu-main-nl") {
  try {
    const res = await fetch(`${WP_URL}/wp-json/menus/v1/menus/${menuName}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export async function getPage(slug, locale = "nl") {
  try {
    const params = new URLSearchParams({
      slug,
      lang: locale,
      _fields: "id,slug,title,acf,content",
    });
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/pages?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const page = data[0];
    if (!page) return null;

    // Zbierz wszystkie ID obrazków ACF i pobierz równolegle
    if (page.acf) {
      const imageKeys = Object.keys(page.acf).filter(
        (key) => typeof page.acf[key] === "number" && page.acf[key] > 0,
      );

      if (imageKeys.length > 0) {
        const imageResults = await Promise.all(
          imageKeys.map((key) =>
            fetch(`${WP_URL}/wp-json/wp/v2/media/${page.acf[key]}`, {
              next: { revalidate: 3600 },
            })
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null),
          ),
        );

        imageKeys.forEach((key, i) => {
          const img = imageResults[i];
          if (img) {
            page.acf[key] = {
              url: img.source_url,
              alt: img.alt_text || "",
              width: img.media_details?.width,
              height: img.media_details?.height,
            };
          }
        });
      }
    }

    return page;
  } catch {
    return null;
  }
}

export function cleanDescription(html) {
  if (!html) return "";
  return html
    .replace(/<div[^>]*class="[^"]*value[^"]*"[^>]*>/gi, "")
    .replace(/<div[^>]*class="[^"]*product[^"]*attribute[^"]*"[^>]*>/gi, "")
    .replace(/<h1[^>]*class="[^"]*page-title[^"]*"[^>]*>.*?<\/h1>/gi, "")
    .replace(/<\/div>/gi, "")
    .trim();
}

export async function getReviews(locale = "nl") {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/review?lang=${locale}&_fields=id,acf&per_page=6`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getFaqs(locale = "nl") {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/faq?wpml_language=${locale}&_fields=id,acf&per_page=20`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getSocialMedia() {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/social-media?_fields=id,acf&per_page=10`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getOrder(orderId, orderKey) {
  try {
    const url = wcUrl(`orders/${orderId}`, {});
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const order = await res.json();
    if (order.order_key !== orderKey) return null;
    return order;
  } catch {
    return null;
  }
}
