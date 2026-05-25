import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Wrapper from "@/components/layout/Wrapper";
import HeroContent from "./HeroContent";
import HeroSection from "./HeroSection";

export default async function Hero({ locale }) {
  const t = await getTranslations("hero");
  const p = locale === "en" ? "/en" : "";

  return (
    <HeroSection>
      <div className="absolute inset-0 z-0">
        <Image
          className="w-full h-full object-cover"
          src="/hero-img3.png"
          alt="Hero"
          width={1024}
          height={1024}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2A20]/95 via-[#0F2A20]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A20] via-transparent to-transparent"></div>
      </div>

      <Wrapper>
        <HeroContent
          title={t("title")}
          subtitle={t("subtitle")}
          cta={t("cta")}
          href={`${p}/shop`}
        />
      </Wrapper>
    </HeroSection>
  );
}
