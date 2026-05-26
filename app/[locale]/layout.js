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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const [messages, categories, menuNl, menuEn] = await Promise.all([
    getMessages({ locale }),
    getCategories(locale),
    getMenu("nl", "menu-main-nl"),
    getMenu("en", "main-menu-en"),
  ]);

  const menuItems = locale === "en" ? menuEn : menuNl;

  return (
    <html lang={locale} className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartProvider>
            <PageLoader></PageLoader>
            <Navbar
              initialCategories={categories}
              initialMenuItems={menuItems}
            />

            <main className="flex-1">{children}</main>

            <Footer locale={locale} />
            <ScrollToTop></ScrollToTop>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
