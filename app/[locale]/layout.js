import { NextIntlClientProvider } from "next-intl";

import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { Inter, Manrope } from "next/font/google";
import "../globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { getCategories, getMenu } from "@/lib/api";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PageLoader from "@/components/ui/PageLoader";

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
        ? "Carp Gate | Premium Carp Fishing Gear"
        : "Carp Gate | Hoogwaardige Karperuitrusting",
      template: "%s | Carp Gate",
    },
    description: isEn
      ? "Shop premium carp fishing gear at Carp Gate. Rods, reels, hooks, clothing and more. Fast EU shipping from Utrecht."
      : "Koop hoogwaardige karperuitrusting bij Carp Gate. Hengels, molens, haken, kleding en meer. Snelle levering vanuit Utrecht.",
    keywords: isEn
      ? [
          "carp fishing",
          "carp gear",
          "fishing rods",
          "fishing reels",
          "carp hooks",
          "carp clothing",
        ]
      : [
          "karpervissen",
          "karperuitrusting",
          "karperhengels",
          "karpermolens",
          "karperhaken",
          "karperkleding",
        ],
    authors: [{ name: "Carp Gate" }],
    creator: "Carp Gate",
    publisher: "Carp Gate",
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
      siteName: "Carp Gate",
      title: isEn
        ? "Carp Gate | Premium Carp Fishing Gear"
        : "Carp Gate | Hoogwaardige Karperuitrusting",
      description: isEn
        ? "Shop premium carp fishing gear at Carp Gate. Fast EU shipping from Utrecht."
        : "Koop hoogwaardige karperuitrusting bij Carp Gate. Snelle levering vanuit Utrecht.",
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Carp Gate",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Carp Gate | Premium Carp Fishing Gear",
      description: isEn
        ? "Shop premium carp fishing gear. Fast EU shipping."
        : "Koop hoogwaardige karperuitrusting. Snelle levering.",
      images: [`${BASE_URL}/og-image.jpg`],
    },
    alternates: {
      canonical: isEn ? `${BASE_URL}/en` : BASE_URL,
      languages: {
        nl: BASE_URL,
        en: `${BASE_URL}/en`,
      },
    },
    verification: {
      google: "",
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
      <head></head>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary antialiased font-[family-name:var(--font-manrope)]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartProvider>
            <PageLoader />
            <Navbar
              initialCategories={categories}
              initialMenuItems={menuItems}
            />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
            <ScrollToTop />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
