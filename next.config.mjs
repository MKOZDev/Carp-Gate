import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");

const nextConfig = {
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sklep.local",
        pathname: "/wp-content/uploads/**",
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default withNextIntl(nextConfig);
