import Image from "next/image";
import Link from "next/link";
import Wrapper from "../layout/Wrapper";

const PARTNERS = [
  {
    name: "CT-Baitboats",
    href: "https://www.ct-baitboats.com/",
    logo: "/ct-baitboatss.jpg",
    width: 200,
    height: 100,
  },
  {
    name: "bookingfish",
    href: "https://bookingfish.eu/",
    logo: "/bookingfishh.png",
    width: 200,
    height: 100,
  },
];

export default function PartnersSection({ locale }) {
  const title = locale === "en" ? "Our partners" : "Onze partners";
  const subtitle =
    locale === "en"
      ? "We work with the best brands in carp fishing"
      : "Wij werken samen met de beste merken in karpervissen";

  return (
    <section className="bg-bg-secondary py-24 max-sm:py-8 border-t border-text-secondary/20">
      <Wrapper>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary  leading-tight mb-6">
            {title}
          </h2>
          <p className="text-text-accent text-sm leading-relaxed">{subtitle}</p>
        </div>

        <div className="flex items-center justify-center gap-12 flex-wrap">
          {PARTNERS.map((partner) => (
            <Link
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="object-contain"
              />
            </Link>
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
