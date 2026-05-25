import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Wrapper from "../layout/Wrapper";
import HeadingBox from "../ui/HeadingBox";
import PrimaryBtn from "../ui/PrimaryBtn";
export default async function AboutUs({ locale }) {
  const t = await getTranslations("aboutus");
  const p = locale === "en" ? "/en" : "";
  const slug = locale === "en" ? "about-us" : "over-ons";
  return (
    <section className=" relative bg-bg-primary w-full py-24 max-sm:py-8 flex items-start overflow-hidden z-2">
      <Wrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-bg-secondary rounded-sm transform -rotate-2"></div>
            <Image
              src="/main-page-about.png"
              alt="AboutUs"
              width={590}
              height={484}
              priority
              className="relative z-10 object-cover rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] "
            ></Image>
          </div>
          <div>
            <HeadingBox title={t("subtitle")} accent={t("title")}></HeadingBox>
            <p className="text-md text-text-secondary mb-6">{t("text")}</p>
            <PrimaryBtn href={`${p}/${slug}`}>{t("cta")}</PrimaryBtn>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
