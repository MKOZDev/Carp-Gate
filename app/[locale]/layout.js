/* eslint-disable @next/next/next-script-for-ga */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { Inter, Manrope } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { getShopCategories, getMenu } from "@/lib/api";
import { BASE_URL } from "@/lib/seo";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PageLoader from "@/components/ui/PageLoader";
import FreeShippingBar from "@/components/sections/FreeShippingBar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-manrope",
});

const locales = ["nl", "en"];

const GTM_IDS = ["GTM-TX7RHPZM", "GTM-K566VTNS"];
const GA_ID = "G-216004Y8LW";
const META_PIXEL_ID = "1313339790871186";

const CLIENT_NAMESPACES = [
  "product",
  "cart",
  "navbar",
  "footer",
  "search",
  "checkout",
  "common",
  "shipping",
  "shop",
];
function uniqueById(list) {
  const seen = new Set();
  return (list || []).filter((item) => {
    if (item?.id == null) return true;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isEn = locale === "en";

  // Uwaga: celowo brak `alternates` (canonical/hreflang) i `openGraph.url` —
  // każda podstrona ustawia własne przez buildMetadata() z lib/seo.js.
  return {
    metadataBase: new URL(BASE_URL),

    title: {
      default: isEn
        ? "CarpGate | Premium Carp Fishing Shop in Europe"
        : "CarpGate | Dé online karperviswinkel van Nederland",
      template: "%s | CarpGate",
    },

    description: isEn
      ? "CarpGate is your specialist carp fishing shop. Discover boilies, pop-ups, wafters, pellets, rods, reels and premium carp fishing equipment."
      : "CarpGate is dé online karperviswinkel van Nederland. Ontdek boilies, pop-ups, wafters, pellets, karperhengels, molens en hoogwaardige karperuitrusting.",

    keywords: isEn
      ? [
          "carp fishing shop",
          "carp fishing gear",
          "carp rods",
          "carp reels",
          "boilies",
          "pop ups",
          "carp bait",
          "Tandem Baits",
        ]
      : [
          "karperviswinkel",
          "karpervissen",
          "karperuitrusting",
          "karperhengels",
          "karpermolens",
          "boilies",
          "pop ups",
          "wafters",
          "karperaas",
          "Tandem Baits",
        ],

    authors: [{ name: "CarpGate" }],
    creator: "CarpGate",
    publisher: "CarpGate",

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "Qfn5U_1aGMdl-tYEO28pvv4DeyM7ZMVWcwFg8ewixsw",
    },

    openGraph: {
      type: "website",
      locale: isEn ? "en_GB" : "nl_NL",
      alternateLocale: isEn ? "nl_NL" : "en_GB",
      siteName: "CarpGate",

      title: isEn
        ? "CarpGate | Premium Carp Fishing Shop"
        : "CarpGate | Dé online karperviswinkel van Nederland",

      description: isEn
        ? "Premium carp fishing equipment, bait and accessories for carp anglers across Europe."
        : "Alles voor karpervissers. Boilies, pop-ups, pellets, hengels, molens en professionele karperuitrusting.",

      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "CarpGate karperviswinkel",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: isEn
        ? "CarpGate | Premium Carp Fishing Shop"
        : "CarpGate | Dé online karperviswinkel van Nederland",

      description: isEn
        ? "Premium carp fishing gear, bait and accessories."
        : "Hoogwaardige karperuitrusting, aas en accessoires voor iedere karpervisser.",

      images: [`${BASE_URL}/og-image.jpg`],
    },

    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const menuName = locale === "en" ? "main-menu-en" : "menu-main-nl";

  const [messages, categories, menuItems] = await Promise.all([
    getMessages({ locale }),
    getShopCategories(locale),
    getMenu(locale, menuName),
  ]);

  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => messages[ns]).map((ns) => [
      ns,
      messages[ns],
    ]),
  );

  // Navbar dostaje tylko pola potrzebne do menu
  const navCategories = uniqueById(categories).map(
    ({ id, name, slug, parent, count, show_in_menu, image, _nlId }) => ({
      id,
      name,
      slug,
      parent,
      count,
      show_in_menu,
      image: image ? { src: image.src, alt: image.alt } : null,
      _nlId,
    }),
  );

  return (
    <html lang={locale} className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary antialiased font-[family-name:var(--font-manrope)]">
        <Script id="tracking-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              linker: {
                domains: ['carpgate.com', 'cms.carpgate.com'],
                accept_incoming: true
              }
            });

            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];}(window, document);
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>

        {GTM_IDS.map((id) => (
          <noscript key={id}>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${id}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ))}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            alt=""
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>

        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <CartProvider>
            <PageLoader />
            <FreeShippingBar />
            <Navbar
              initialCategories={navCategories}
              initialMenuItems={menuItems}
            />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
            <ScrollToTop />
          </CartProvider>
        </NextIntlClientProvider>

        {GTM_IDS.map((id) => (
          <Script
            key={id}
            id={`gtm-${id}`}
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`,
            }}
          />
        ))}
        <Script
          id="gtag-js"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="lazyOnload"
        />
        <Script
          id="meta-pixel-js"
          src="https://connect.facebook.net/en_US/fbevents.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
