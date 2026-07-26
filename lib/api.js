// lib/api.js
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const WP_URL = (process.env.NEXT_PUBLIC_WP_URL || "").replace(/\/$/, "");
const CK = process.env.WC_CONSUMER_KEY;
const CS = process.env.WC_CONSUMER_SECRET;

function wcUrl(endpoint, params = {}, locale = null) {
  const base = {
    consumer_key: CK,
    consumer_secret: CS,
  };
  if (locale) base.lang = locale;
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

// Pola produktu — tylko te których faktycznie używamy w UI
const PRODUCT_FIELDS = [
  "id",
  "name",
  "slug",
  "type",
  "status",
  "price",
  "regular_price",
  "sale_price",
  "on_sale",
  "price_html",
  "stock_status",
  "stock_quantity",
  "sku",
  "images",
  "categories",
  "short_description",
  "description",
  "translations",
  "featured",
  "date_modified",
  "attributes",
].join(",");

export async function getProducts(params = {}, locale = "nl") {
  try {
    // Zawsze pobieraj z NL dla poprawnego filtrowania po kategorii
    const fetchLocale = "nl";
    const url = wcUrl(
      "products",
      { per_page: 20, status: "publish", _fields: PRODUCT_FIELDS, ...params },
      locale,
    );

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { products: [], totalPages: 1, totalCount: 0 };

    const rawProducts = await res.json();
    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
    const totalCount = parseInt(res.headers.get("X-WP-Total") || "0");

    // Jeśli EN — pobierz EN wersje produktów równolegle
    let enProducts = [];
    if (locale === "en") {
      const enIds = rawProducts.map((p) => p.translations?.en).filter(Boolean);

      if (enIds.length > 0) {
        const enRes = await fetch(
          wcUrl(
            "products",
            {
              include: enIds.join(","),
              per_page: 100,
              _fields: "id,name,slug,categories,translations",
            },
            "en",
          ),
          { next: { revalidate: 3600 } },
        );
        if (enRes.ok) enProducts = await enRes.json();
      }
    }

    const enMap = new Map(enProducts.map((p) => [p.id, p]));

    const products = rawProducts.map((p) => {
      const enId = p.translations?.en;
      const enProduct = enId ? enMap.get(enId) : null;
      return {
        ...p,
        name: decodeHtml(
          locale === "en" && enProduct ? enProduct.name : p.name,
        ),
        slug: locale === "en" && enProduct ? enProduct.slug : p.slug,
        categories: p.categories?.map((c) => ({
          ...c,
          name: decodeHtml(c.name),
        })),
      };
    });

    return { products, totalPages, totalCount };
  } catch {
    return { products: [], totalPages: 1, totalCount: 0 };
  }
}
export async function getProductsByCategorySlug(
  slug,
  locale = "nl",
  perPage = 12,
) {
  try {
    const category = await getCategoryBySlug(slug, "nl");
    if (!category) return [];

    const { products } = await getProducts(
      { category: category.id, per_page: perPage },
      locale,
    );
    return products;
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug, locale = "nl") {
  try {
    // Bez AbortController — Next.js cache nie lubi signal
    const res = await fetch(
      wcUrl("products", { slug, _fields: PRODUCT_FIELDS }, locale),
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) return null;
    const data = await res.json();
    let product = data[0];

    // Jeśli nie znaleziono po EN locale — spróbuj NL slug
    if (!product && locale !== "nl") {
      const nlRes = await fetch(
        wcUrl("products", { slug, _fields: PRODUCT_FIELDS }, "nl"),
        { next: { revalidate: 3600 } },
      );
      if (nlRes.ok) {
        const nlData = await nlRes.json();
        product = nlData[0];
      }
    }

    if (!product) return null;

    product.name = decodeHtml(product.name);
    product.categories = product.categories?.map((c) => ({
      ...c,
      name: decodeHtml(c.name),
    }));

    const fetchNlImages =
      locale !== "nl" && product.translations?.nl
        ? fetch(
            wcUrl(`products/${product.translations.nl}`, {
              _fields: "id,images",
            }),
            { next: { revalidate: 3600 } },
          )
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        : Promise.resolve(null);

    const fetchVariations =
      product.type === "variable"
        ? fetch(
            wcUrl(
              `products/${product.id}/variations`,
              {
                per_page: 100,
                _fields:
                  "id,price,regular_price,sale_price,on_sale,stock_status,stock_quantity,attributes,image",
              },
              locale,
            ),
            { next: { revalidate: 3600 } },
          )
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => [])
        : Promise.resolve(null);

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
    const catFields = "id,name,slug,image,parent,count,translations";

    const fetchNl = fetch(
      wcUrl(
        "products/categories",
        { per_page: 100, hide_empty: false, parent: 0, _fields: catFields },
        "nl",
      ),
      { next: { revalidate: 3600 } },
    );

    const fetchEn =
      locale === "en"
        ? fetch(
            wcUrl(
              "products/categories",
              {
                per_page: 100,
                hide_empty: false,
                parent: 0,
                _fields: catFields,
              },
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
      const enCats = await enRes.json();
      const enMap = new Map(enCats.map((c) => [c.id, c]));

      return filtered.map((cat) => {
        const enId = cat.translations?.en;
        const enCat = enId ? enMap.get(enId) : null;
        return {
          ...cat,
          id: enCat?.id || cat.id, // EN ID
          name: decodeHtml(enCat?.name || cat.name),
          slug: enCat?.slug || cat.slug,
          _nlId: cat.id, // zachowaj NL ID
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
    const res = await fetch(
      wcUrl(
        "products/categories",
        { slug, _fields: "id,name,slug,image,description,translations" },
        locale,
      ),
      { next: { revalidate: 3600 } },
    );
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
      next: { revalidate: 3600 },
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

    if (page.acf) {
      const imageKeys = Object.keys(page.acf).filter(
        (key) => typeof page.acf[key] === "number" && page.acf[key] > 0,
      );

      if (imageKeys.length > 0) {
        const imageResults = await Promise.all(
          imageKeys.map((key) =>
            fetch(
              `${WP_URL}/wp-json/wp/v2/media/${page.acf[key]}?_fields=source_url,alt_text,media_details`,
              {
                next: { revalidate: 3600 },
              },
            )
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
    const url = wcUrl(`orders/${orderId}`, {
      _fields: "id,order_key,status,billing,shipping,line_items,total,currency",
    });
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const order = await res.json();
    if (order.order_key !== orderKey) return null;
    return order;
  } catch {
    return null;
  }
}

// ─── Recenzje WooCommerce ─────────────────────────────────────────────────

const REVIEW_FIELDS =
  "id,product_id,product_name,reviewer,rating,review,verified,date_created";

export async function getProductReviews(productId) {
  try {
    const res = await fetch(
      wcUrl("products/reviews", {
        product: productId,
        per_page: 20,
        status: "approved",
        _fields: REVIEW_FIELDS,
      }),
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getLatestReviews(count = 6) {
  try {
    const res = await fetch(
      wcUrl("products/reviews", {
        per_page: count,
        status: "approved",
        orderby: "date",
        order: "desc",
        _fields: REVIEW_FIELDS,
      }),
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function submitReview({ productId, name, email, rating, review }) {
  const res = await fetch(wcUrl("products/reviews"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: productId,
      reviewer: name,
      reviewer_email: email,
      review,
      rating,
      status: "hold",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to submit review");
  return res.json();
}
export async function getActiveCoupon() {
  try {
    const res = await fetch(
      wcUrl("coupons", {
        per_page: 1,
        orderby: "date",
        order: "desc",
        _fields: "id,code,amount,discount_type,date_expires",
      }),
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const coupon = data[0];
    if (!coupon) return null;
    // Jeśli wygasł — zwróć null
    if (coupon.date_expires && new Date(coupon.date_expires) < new Date())
      return null;
    return coupon;
  } catch {
    return null;
  }
}
