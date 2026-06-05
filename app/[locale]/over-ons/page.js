import { getPage } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import AboutHero from "@/components/sections/OverOns/AboutHero";
import Wrapper from "@/components/layout/Wrapper";
import {
  BadgeCheck,
  Truck,
  Heart,
  ShieldCheck,
  Package,
  Headphones,
  Lock,
} from "lucide-react";
import PrimaryBtn from "@/components/ui/PrimaryBtn";
import { getTranslations } from "next-intl/server";

const SLUGS = {
  nl: "over-ons",
  en: "about-us",
};

const ICONS = [BadgeCheck, Truck, Heart];

const USP = {
  nl: [
    {
      icon: ShieldCheck,
      title: "Hoogwaardige kwaliteit",
      desc: "Alleen de beste producten",
    },
    {
      icon: Package,
      title: "Snelle levering",
      desc: "Snel en betrouwbaar bezorgd",
    },
    {
      icon: Headphones,
      title: "Deskundig advies",
      desc: "Wij staan voor je klaar",
    },
    {
      icon: Lock,
      title: "Veilig betalen",
      desc: "Betaal veilig en vertrouwd",
    },
  ],
  en: [
    {
      icon: ShieldCheck,
      title: "Premium quality",
      desc: "Only the best products",
    },
    {
      icon: Package,
      title: "Fast delivery",
      desc: "Fast and reliable shipping",
    },
    {
      icon: Headphones,
      title: "Expert advice",
      desc: "We are here for you",
    },
    {
      icon: Lock,
      title: "Secure payment",
      desc: "Pay safe and trusted",
    },
  ],
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const page = await getPage(SLUGS[locale], locale);
  return {
    title: page?.acf?.hero_title || (locale === "en" ? "About us" : "Over ons"),
    description: page?.acf?.hero_subtitle || "",
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("overons");
  const p = locale === "en" ? "/en" : "";

  const page = await getPage(SLUGS[locale], locale);
  if (!page) notFound();

  const acf = page.acf ?? {};
  const usps = USP[locale] ?? USP.nl;

  return (
    <div className="bg-bg-primary">
      <div className="relative h-[820px] w-full flex items-center justify-center overflow-hidden max-sm:h-[80vh]">
        {acf.hero_image?.url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={acf.hero_image.url}
              alt={acf.hero_image.alt || ""}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, #0F2A20 0%, #0F2A20 10%, rgba(15,42,32,0.5) 60%, transparent 100%)",
              }}
            />
          </div>
        )}
        <AboutHero title={acf.hero_title} subtitle={acf.hero_subtitle} />
      </div>

      <Wrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-sm:gap-8 items-center pb-24 max-lg:pb-8">
          {acf.desc_img?.url && (
            <div className="relative h-[600px] rounded-sm overflow-hidden border border-white/10 group max-sm:h-[300px]">
              <Image
                src={acf.desc_img.url}
                alt={acf.desc_img.alt || ""}
                fill
                className="w-full h-full object-cover  opacity-80  group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                priority
              />
            </div>
          )}
          <div className="flex flex-col gap-8 max-sm:gap-6">
            {acf.desc_title && (
              <>
                <h2 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight uppercase">
                  {acf.desc_title}
                </h2>
                <div className="w-20 h-1 bg-text-accent rounded-sm" />
              </>
            )}
            {acf.desc_text && (
              <p className="text-md text-text-primary">{acf.desc_text}</p>
            )}
          </div>
        </div>
      </Wrapper>

      <div className="bg-bg-secondary py-24 max-sm:py-8">
        <Wrapper>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: acf.col_1_title, desc: acf.col_1_description },
              { title: acf.col_2_title, desc: acf.col_2_description },
              { title: acf.col_3_title, desc: acf.col_3_description },
            ]
              .filter((col) => col.title)
              .map((col, i) => {
                const Icon = ICONS[i];
                return (
                  <div
                    key={i}
                    className="p-10 bg-bg-primary hover:bg-[rgb(30,55,40)] transition-all duration-500 rounded-lg group"
                  >
                    {Icon && (
                      <div className="w-14 h-14 rounded-xl bg-bg-secondary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <Icon size={30} className="text-text-accent" />
                      </div>
                    )}
                    <h3 className="text-xl text-text-primary font-bold mb-4">
                      {col.title}
                    </h3>
                    {col.desc && (
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {col.desc}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </Wrapper>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-us-bottom.jpeg"
            alt=""
            fill
            className="object-cover object-[25%_80%]"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(15,42,32,0.95) 40%, rgba(15,42,32,0.3) 100%)",
            }}
          />
        </div>

        <Wrapper>
          <div className="relative z-10 py-24 max-sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 max-w-lg max-sm:gap-4">
              <h2 className="text-4xl max-sm:text-3xl font-bold text-text-primary leading-tight">
                {acf.widget_title.split(" ").reduce((acc, word, i, arr) => {
                  if (i === arr.length - 1) {
                    return (
                      <>
                        {acc} <span className="text-text-accent">{word}</span>
                      </>
                    );
                  }
                  return acc ? (
                    <>
                      {acc} {word}
                    </>
                  ) : (
                    word
                  );
                }, "")}
              </h2>
              <p className="text-text-secondary text-base leading-relaxed">
                {acf.widget_text}
              </p>

              <div className="mt-2">
                <PrimaryBtn href={`${p}/shop`}>{t("cta")}</PrimaryBtn>
              </div>
            </div>
          </div>
        </Wrapper>

        <div className="relative z-10  bg-bg-primary/80 backdrop-blur-sm">
          <Wrapper>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-10">
              {usps.map((usp, i) => {
                const Icon = usp.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full border border-text-accent/30 flex items-center justify-center">
                      <Icon size={22} className="text-text-accent" />
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-bold">
                        {usp.title}
                      </p>
                      <p className="text-text-secondary text-xs mt-0.5">
                        {usp.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Wrapper>
        </div>
      </div>
    </div>
  );
}
