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

    const res = await fetch(url, { next: { revalidate: 60 } });
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
      next: { revalidate: 60 },
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

    // Jeśli EN nie ma zdjęć — pobierz z NL

    // Pobierz zdjęcia z NL jeśli EN ma mniej zdjęć
    if (locale !== "nl") {
      const nlId = product.translations?.nl;
      if (nlId) {
        const nlRes = await fetch(wcUrl(`products/${nlId}`, {}), {
          next: { revalidate: 60 },
        });
        if (nlRes.ok) {
          const nlProduct = await nlRes.json();
          // Jeśli NL ma więcej zdjęć — użyj zdjęć z NL
          if (nlProduct.images?.length > product.images?.length) {
            product.images = nlProduct.images || [];
          }
        }
      }
    }

    if (product.type === "variable") {
      const variantProductId = product.id;
      const varRes = await fetch(
        wcUrl(
          `products/${variantProductId}/variations`,
          { per_page: 100 },
          locale,
        ),
        { next: { revalidate: 60 } },
      );
      if (varRes.ok) {
        product._variations = await varRes.json();
      }
    }

    return product;
  } catch (e) {
    console.error("getProductBySlug error:", e);
    return null;
  }
}

export async function getCategories(locale = "nl") {
  try {
    const res = await fetch(
      wcUrl("products/categories", { per_page: 100, hide_empty: true }, "nl"),
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const cats = await res.json();
    const filtered = cats.filter((c) => c.slug !== "uncategorized");

    if (locale === "en") {
      const enCats = await Promise.all(
        filtered.map(async (cat) => {
          const enId = cat.translations?.en;
          if (!enId || enId === cat.id)
            return { ...cat, name: decodeHtml(cat.name) };

          try {
            const enRes = await fetch(
              wcUrl(`products/categories/${enId}`, {}),
              { next: { revalidate: 3600 } },
            );
            if (!enRes.ok) return { ...cat, name: decodeHtml(cat.name) };
            const enCat = await enRes.json();
            return { ...cat, name: decodeHtml(enCat.name), slug: enCat.slug };
          } catch {
            return { ...cat, name: decodeHtml(cat.name) };
          }
        }),
      );
      return enCats;
    }

    // Dekoduj nazwy dla NL
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

    // Zamień ID obrazków ACF na URL
    if (page.acf) {
      for (const key of Object.keys(page.acf)) {
        const val = page.acf[key];
        // Jeśli wartość to liczba — to pewnie ID obrazka
        if (typeof val === "number" && val > 0) {
          try {
            const imgRes = await fetch(`${WP_URL}/wp-json/wp/v2/media/${val}`, {
              next: { revalidate: 3600 },
            });
            if (imgRes.ok) {
              const img = await imgRes.json();
              page.acf[key] = {
                url: img.source_url,
                alt: img.alt_text || "",
                width: img.media_details?.width,
                height: img.media_details?.height,
              };
            }
          } catch {}
        }
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
    // Weryfikacja klucza zamówienia
    if (order.order_key !== orderKey) return null;
    return order;
  } catch {
    return null;
  }
}
