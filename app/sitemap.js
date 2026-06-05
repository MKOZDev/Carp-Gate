import { getProducts, getCategories } from "@/lib/api";

const BASE_URL = "https://carpgate.com";

export default async function sitemap() {
  // Pobierz produkty i kategorie równolegle dla NL i EN
  const [
    { products: nlProducts },
    { products: enProducts },
    nlCategories,
    enCategories,
  ] = await Promise.all([
    getProducts({ per_page: 100, status: "publish" }, "nl"),
    getProducts({ per_page: 100, status: "publish" }, "en"),
    getCategories("nl"),
    getCategories("en"),
  ]);

  // Strony statyczne
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          nl: BASE_URL,
          en: `${BASE_URL}/en`,
        },
      },
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          nl: `${BASE_URL}/shop`,
          en: `${BASE_URL}/en/shop`,
        },
      },
    },
    {
      url: `${BASE_URL}/over-ons`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          nl: `${BASE_URL}/over-ons`,
          en: `${BASE_URL}/en/about-us`,
        },
      },
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          nl: `${BASE_URL}/contact`,
          en: `${BASE_URL}/en/contact`,
        },
      },
    },
  ];

  // Produkty NL (bez prefiksu)
  const nlProductPages = nlProducts.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: new Date(product.date_modified || new Date()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Produkty EN
  const enProductPages = enProducts.map((product) => ({
    url: `${BASE_URL}/en/product/${product.slug}`,
    lastModified: new Date(product.date_modified || new Date()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Kategorie NL
  const nlCategoryPages = nlCategories.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Kategorie EN
  const enCategoryPages = enCategories.map((cat) => ({
    url: `${BASE_URL}/en/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...nlProductPages,
    ...enProductPages,
    ...nlCategoryPages,
    ...enCategoryPages,
  ];
}
