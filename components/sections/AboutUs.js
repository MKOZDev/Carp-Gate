import { getTranslations } from "next-intl/server";
import Wrapper from "../layout/Wrapper";
import HeadingBox from "../ui/HeadingBox";
import PrimaryBtn from "../ui/PrimaryBtn";
import AnimatedImage from "../AnimatedImage";

export default async function AboutUs({ locale }) {
  const t = await getTranslations("aboutus");
  const p = locale === "en" ? "/en" : "";
  const slug = locale === "en" ? "about-us" : "over-ons";

  return (
    <section className="relative bg-bg-secondary w-full py-24 max-sm:py-8 flex items-start overflow-hidden z-2">
      <Wrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-bg-secondary rounded-sm transform -rotate-2" />
            <AnimatedImage></AnimatedImage>
          </div>
          <div>
            <HeadingBox title={t("subtitle")} accent={t("title")} />
            <p className="text-md text-text-secondary mb-6">
              {t("text")}
              <br />
              <br />
              <strong>{t("tagline")}</strong>
            </p>
            <div className="flex gap-4 flex-wrap">
              <PrimaryBtn href={`${p}/${slug}`}>{t("cta")}</PrimaryBtn>
              <PrimaryBtn href={`${p}/${slug}#video`}>
                {t("ctaVideo")}
              </PrimaryBtn>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
