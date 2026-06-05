import ContactForm from "@/components/sections/Contact/ContactForm";
import { getTranslations } from "next-intl/server";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Timer,
  Star,
  Shield,
  HelpCircle,
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import Wrapper from "@/components/layout/Wrapper";
import HeadingBox from "@/components/ui/HeadingBox";
import FaqItem from "@/components/ui/FaqItem";
import Link from "next/link";
import { getMenu, getFaqs, getSocialMedia } from "@/lib/api";
import LazyMap from "@/components/ui/LazyMap";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: "Contact",
    description:
      locale === "en"
        ? "Contact Carp Gate — we reply within 24 hours."
        : "Neem contact op met Carp Gate — wij reageren binnen 24 uur.",
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("contact");
  const p = locale === "en" ? "/en" : "";
  const isEn = locale === "en";

  const [footerMenu, faqs, socialMedia] = await Promise.all([
    getMenu(locale, locale === "en" ? "footer-menu-en" : "footer-menu-nl"),
    getFaqs(locale),
    getSocialMedia(),
  ]);

  const SOCIAL_ICONS = {
    instagram: FaInstagram,
    facebook: FaFacebookF,
    whatsapp: FaWhatsapp,
  };

  const socialLinks = socialMedia.map((item) => ({
    icon: SOCIAL_ICONS[item.acf?.platform] || FaInstagram,
    label: item.acf?.platform
      ? item.acf.platform.charAt(0).toUpperCase() + item.acf.platform.slice(1)
      : "Social",
    href: item.acf?.url || "#",
    handle: item.acf?.handle || "",
  }));

  const quickLinks =
    footerMenu.length > 0
      ? footerMenu.map((item) => ({
          label: item.title,
          href: item.url.replace(/^https?:\/\/[^/]+/, "") || "/",
        }))
      : [
          {
            label: isEn ? "Shipping information" : "Verzendbeleid",
            href: `${p}/verzendbeleid`,
          },
          {
            label: isEn ? "Return policy" : "Terugbetalingsbeleid",
            href: `${p}/terugbetalingsbeleid`,
          },
          {
            label: isEn ? "General conditions" : "Algemene voorwaarden",
            href: `${p}/algemene-voorwaarden`,
          },
        ];

  const contactDetails = [
    {
      icon: Mail,
      label: "Email",
      value: "carpgatee@gmail.com",
      href: "mailto:carpgatee@gmail.com",
    },
    {
      icon: Phone,
      label: isEn ? "Phone" : "Telefoon",
      value: "+31652368685",
      href: "tel:+31652368685",
    },
    {
      icon: MapPin,
      label: isEn ? "Address" : "Adres",
      value: "Zwaardvegersgaarde 48, 2542 TE Den Haag, Nederland",
      href: "https://maps.app.goo.gl/nXC9CfgmcuwF5CYt5",
    },
    {
      icon: Clock,
      label: isEn ? "Opening hours" : "Openingstijden",
      value: isEn
        ? "Mon-Fri: 9:00-18:00\nSat: 9:00-17:00\nSun: Closed"
        : "Ma-Vr: 9:00-17:00\nZa: 9:00-17:00\nZo: Gesloten",
      href: null,
    },
  ];

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="bg-bg-secondary border-b border-text-secondary/10 py-20 max-sm:py-12">
        <Wrapper>
          <HeadingBox title={t("subtitle")} accent={t("title")} />
          <p className="text-text-secondary text-sm leading-relaxed max-w-xl mt-4">
            {isEn
              ? "Have a question? We will respond within 24 hours. Our team of experienced carp anglers is ready to advise you on the best equipment."
              : "Heb je een vraag? Wij reageren binnen 24 uur. Ons team van ervaren karpervissers staat klaar om je te adviseren over de beste uitrusting."}
          </p>
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              {
                icon: Timer,
                label: isEn ? "Response within 24h" : "Reactie binnen 24u",
              },
              {
                icon: Star,
                label: isEn
                  ? "4.9/5 customer rating"
                  : "4.9/5 klantbeoordeling",
              },
              { icon: Shield, label: isEn ? "Expert advice" : "Expert advies" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm text-text-secondary"
              >
                <Icon size={16} className="text-text-accent" />
                {label}
              </div>
            ))}
          </div>
        </Wrapper>
      </div>

      <Wrapper>
        <div className="py-16 max-sm:py-8 space-y-4">
          <ContactForm locale={locale} />
          <p className="text-xs text-text-secondary/50 flex items-center gap-2 flex-wrap">
            <Shield size={12} className="text-text-accent shrink-0" />
            {isEn
              ? "Your data is protected. We never share it with third parties."
              : "Jouw gegevens zijn beschermd. Wij delen ze nooit met derden."}
            <Link
              href={isEn ? `/en/privacy-policy` : `/privacybeleid`}
              className="text-text-accent hover:underline"
            >
              {isEn ? "Privacy policy" : "Privacybeleid"}
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              {isEn ? "Contact details" : "Contactgegevens"}
            </h3>
            {contactDetails.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-primary flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-text-accent" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      className="text-sm text-text-primary hover:text-text-accent transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-text-primary">
                      {value.split("\n").map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-4">
              Social Media
            </h3>
            <div className="space-y-3">
              {socialLinks.map(({ icon: Icon, label, href, handle }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  className="flex items-center gap-3 p-3 rounded-xl bg-bg-primary border border-text-secondary/10 hover:border-text-accent transition-colors group"
                >
                  <Icon size={15} className="text-text-accent" />
                  <div>
                    <p className="text-xs text-text-primary font-medium">
                      {label}
                    </p>
                    <p className="text-xs text-text-secondary">{handle}</p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-text-secondary ml-auto group-hover:text-text-accent transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle size={14} className="text-text-accent" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                {isEn ? "Quick help" : "Snelle hulp"}
              </h3>
            </div>
            <p className="text-xs text-text-secondary mb-4">
              {isEn
                ? "Before you write to us, check the most common help topics:"
                : "Bekijk eerst de meest gestelde vragen voordat je ons een bericht stuurt:"}
            </p>
            <div className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between w-full px-3 py-2.5 bg-bg-primary rounded-xl text-sm text-text-secondary hover:text-text-accent border border-text-secondary/10 hover:border-text-accent/30 transition-colors"
                >
                  {label}
                  <ChevronRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <LazyMap />

        {faqs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-bold text-text-primary mb-8 text-center">
              {isEn ? "Frequently asked questions" : "Veelgestelde vragen"}
            </h2>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, i) => (
                <FaqItem
                  key={faq.id || i}
                  question={faq.acf?.question}
                  answer={faq.acf?.answer}
                />
              ))}
            </div>
          </div>
        )}
      </Wrapper>
    </div>
  );
}
