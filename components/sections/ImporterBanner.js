import Image from "next/image";

export default function ImporterBanner({ locale }) {
  const text =
    locale === "en"
      ? {
          title: "Official importer of Tandem Baits® in the Netherlands",
          subtitle: "Quality you can trust!",
        }
      : {
          title: "Officiële importeur van Tandem Baits® in Nederland",
          subtitle: "Kwaliteit waarop je kunt vertrouwen!",
        };

  return (
    <div className="bg-bg-secondary border-y border-text-secondary/10 py-4">
      <div className="max-w-7xl w-full m-auto max-xl:px-4 flex items-center justify-center gap-4 flex-wrap">
        <Image
          src="/tandem-baits-logo.png"
          alt="Tandem Baits"
          width={311}
          height={70}
          className="object-contain"
        />
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <span className="text-text-accent text-center font-bold uppercase tracking-widest text-sm">
            {text.title}
          </span>
          <span className="text-text-secondary text-center text-sm">
            {text.subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
