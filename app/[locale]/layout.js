/* eslint-disable @next/next/next-script-for-ga */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { Inter, Manrope } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { getCategories, getMenu } from "@/lib/api";
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

const BASE_URL = "https://carpgate.com";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isEn = locale === "en";

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

    openGraph: {
      type: "website",
      locale: isEn ? "en_GB" : "nl_NL",
      alternateLocale: isEn ? "nl_NL" : "en_GB",

      url: isEn ? `${BASE_URL}/en` : BASE_URL,

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

    alternates: {
      canonical: isEn ? `${BASE_URL}/en` : BASE_URL,
      languages: {
        nl: BASE_URL,
        en: `${BASE_URL}/en`,
      },
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

  // 3 fetche zamiast 4 — menu tylko dla aktualnego locale
  const [messages, categories, menuItems] = await Promise.all([
    getMessages({ locale }),
    getCategories(locale),
    getMenu(locale, menuName),
  ]);

  return (
    <html lang={locale} className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TX7RHPZM');`,
          }}
        />
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1313339790871186');
    fbq('track', 'PageView');
  `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              name: "CarpGate",
              alternateName: "CarpGate Karperviswinkel",

              url: "https://carpgate.com",

              logo: {
                "@type": "ImageObject",
                url: "https://carpgate.com/logo.png",
              },
              description:
                "CarpGate is dé online karperviswinkel van Nederland. Ontdek boilies, pop-ups, wafters, pellets, karperhengels, molens en professionele karperuitrusting voor iedere karpervisser.",

              email: "carpgatee@gmail.com",
              telephone: "+31652368685",

              address: {
                "@type": "PostalAddress",
                streetAddress: "Zwaardvegersgaarde 48",
                postalCode: "2542 TE",
                addressLocality: "Den Haag",
                addressCountry: "NL",
              },
              priceRange: "€€",
              currenciesAccepted: "EUR",
              paymentAccepted: "iDEAL, Credit Card, PayPal, Klarna",
              areaServed: [
                {
                  "@type": "Country",
                  name: "Netherlands",
                },
                {
                  "@type": "Country",
                  name: "Belgium",
                },
              ],
              knowsAbout: [
                "Karpervissen",
                "Karperuitrusting",
                "Boilies",
                "Pop-ups",
                "Wafters",
                "Pellets",
                "Karperhengels",
                "Karpermolens",
                "Tandem Baits",
              ],
              brand: {
                "@type": "Brand",
                name: "CarpGate",
              },
              sameAs: [
                "https://www.instagram.com/carpgate",
                "https://www.facebook.com/carpgate",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "CarpGate categorieën",
                itemListElement: [
                  {
                    "@type": "OfferCatalog",
                    name: "Aas & Karpervoer",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Karpermolens & hengels",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "CarpGate Voordeelsets",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Dips, boosters en liquids",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Vislijnen & onderlijnen",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "End-tackle",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Carp Care",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Beetmelders & toebehoren",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Pods & sticks",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Kleding",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Nachtvissen",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Opbergen",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Accessories",
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary antialiased font-[family-name:var(--font-manrope)]">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TX7RHPZM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            alt=""
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1313339790871186&ev=PageView&noscript=1"
          />
        </noscript>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartProvider>
            <PageLoader />
            <FreeShippingBar></FreeShippingBar>
            <Navbar
              initialCategories={categories}
              initialMenuItems={menuItems}
            />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
            <ScrollToTop />
          </CartProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics gaId="G-216004Y8LW" />
        <Script id="ga4-linker" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('config', 'G-216004Y8LW', {
              linker: {
                domains: ['carpgate.com', 'cms.carpgate.com'],
                accept_incoming: true
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
