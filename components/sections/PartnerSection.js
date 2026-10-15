import Image from "next/image";
import Wrapper from "../layout/Wrapper";
import { getPartners } from "@/lib/api";

export default async function PartnersSection({ locale }) {
  const partners = await getPartners();
  if (partners.length === 0) return null;

  const title = locale === "en" ? "Our partners" : "Onze partners";
  const subtitle =
    locale === "en"
      ? "We work with the best brands in carp fishing"
      : "Wij werken samen met de beste merken in karpervissen";

  const tile =
    "group flex items-center justify-center w-40 h-24 sm:w-52 sm:h-32 rounded-2xl " +
    "border border-text-secondary/10 bg-white/[0.03] p-4 sm:p-6 " +
    "transition-all duration-300 hover:-translate-y-1 hover:border-text-accent/40 hover:bg-white/[0.06]";

  const logoClass = (partner) =>
    `h-full w-auto max-w-full object-contain transition-all duration-300 ` +
    ` ${partner.round ? "rounded-full" : "rounded-md"}`;

  return (
    <section className="bg-bg-secondary py-24 max-sm:py-12">
      <Wrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-4">
            {title}
          </h2>
          <p className="text-text-accent text-sm leading-relaxed">{subtitle}</p>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {partners.map((partner) => {
            const img = (
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                unoptimized
                sizes="(max-width: 640px) 160px, 208px"
                className={logoClass(partner)}
              />
            );

            return partner.href ? (
              <a
                key={partner.id}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={partner.name}
                className={tile}
              >
                {img}
              </a>
            ) : (
              <div key={partner.id} className={tile}>
                {img}
              </div>
            );
          })}
        </div>
      </Wrapper>
    </section>
  );
}
