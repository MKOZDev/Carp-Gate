export const PAGE_SLUGS = {
  privacybeleid: { nl: "privacybeleid", en: "privacy-policy" },
  verzendbeleid: { nl: "verzendbeleid", en: "shipping-policy" },
  "algemene-voorwaarden": {
    nl: "algemene-voorwaarden",
    en: "general-conditions",
  },
  "wettelijke-kennisgeving": {
    nl: "wettelijke-kennisgeving",
    en: "legal-notice",
  },
  terugbetalingsbeleid: { nl: "terugbetalingsbeleid", en: "refund-policy" },
  "over-ons": { nl: "over-ons", en: "about-us" },
  // EN jako klucze
  "shipping-policy": { nl: "verzendbeleid", en: "shipping-policy" },
  "general-conditions": {
    nl: "algemene-voorwaarden",
    en: "general-conditions",
  },
  "legal-notice": { nl: "wettelijke-kennisgeving", en: "legal-notice" },
  "refund-policy": { nl: "terugbetalingsbeleid", en: "refund-policy" },
  "about-us": { nl: "over-ons", en: "about-us" },
};

export function wpSlug(route, locale) {
  return PAGE_SLUGS[route]?.[locale] ?? route;
}
