import createNextIntlPlugin from "next-intl/plugin";
import { CATEGORY_REDIRECTS, OTHER_REDIRECTS } from "./lib/redirects.js";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");

const nextConfig = {
  async redirects() {
    const fromCategories = CATEGORY_REDIRECTS.flatMap(([from, to]) => [
      {
        source: `/category/${from}`,
        destination: `/category/${to}`,
        statusCode: 301,
      },
      {
        source: `/en/category/${from}`,
        destination: `/en/category/${to}`,
        statusCode: 301,
      },
    ]);

    const fromOther = OTHER_REDIRECTS.flatMap(([from, to]) => [
      { source: from, destination: to, statusCode: 301 },
      { source: `/en${from}`, destination: `/en${to}`, statusCode: 301 },
    ]);

    return [
      { source: "/shop", destination: "/", statusCode: 301 },
      { source: "/en/shop", destination: "/en", statusCode: 301 },
      ...fromCategories,
      ...fromOther,
    ];
  },
  async rewrites() {
    return [
      { source: "/en/about-us", destination: "/en/over-ons" },
      { source: "/en/privacy-policy", destination: "/en/privacybeleid" },
      { source: "/en/shipping-policy", destination: "/en/verzendbeleid" },
      {
        source: "/en/general-conditions",
        destination: "/en/algemene-voorwaarden",
      },
      {
        source: "/en/legal-notice",
        destination: "/en/wettelijke-kennisgeving",
      },
      { source: "/en/refund-policy", destination: "/en/terugbetalingsbeleid" },
      { source: "/en/thank-you", destination: "/en/bedankt" },
    ];
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.carpgate.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
