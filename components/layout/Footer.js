import Link from "next/link";
import Image from "next/image";
import { getCategories, getMenu } from "@/lib/api";
import { Mail, Phone, MapPin } from "lucide-react";

export default async function Footer({ locale = "nl" }) {
  const p = locale === "en" ? "/en" : "";

  const [categories, footerMenu] = await Promise.all([
    getCategories(locale),
    getMenu(locale, locale === "en" ? "footer-menu-en" : "footer-menu-nl"),
  ]);

  return (
    <footer className="bg-bg-secondary py-16 max-sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Kolumna 1 — Logo + opis */}
          <div className="lg:col-span-1">
            <Link href={`${p}/`} className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Carp Gate"
                width={60}
                height={60}
                className="object-contain"
              />
              <span className="font-bold text-text-primary tracking-tight">
                CARP GATE
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed ">
              {locale === "en"
                ? "Field-tested carp materials. Europe-wide shipping from Utrecht."
                : "In het veld geteste karpermaterialen. Europa-breed verzonden vanuit Utrecht."}
            </p>
          </div>

          {/* Kolumna 2 — Winkel */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-5">
              {locale === "en" ? "Shop" : "Winkel"}
            </h3>
            <ul className="space-y-3">
              {categories.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`${p}/category/${cat.slug}`}
                    className="text-sm text-text-secondary hover:text-text-accent transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolumna 3 — Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {footerMenu.map((item) => (
                <li key={item.ID}>
                  <Link
                    href={item.url.replace(/^https?:\/\/[^/]+/, "") || "/"}
                    className="text-sm text-text-secondary hover:text-text-accent transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolumna 4 — Contact */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-5">
                Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:carpgatee@gmail.com"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-accent transition-colors"
                  >
                    <Mail size={14} />
                    carpgatee@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+31652368685"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-accent transition-colors"
                  >
                    <Phone size={14} />
                    +31652368685
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin size={14} className="shrink-0" />
                  Zwaardvegersgaarde 48, 2542 TE Den Haag, Holandia
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dolna linia */}
        <div className="border-t border-text-secondary/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-center text-text-secondary uppercase tracking-widest">
            © {new Date().getFullYear()} Carp Gate BV ·{" "}
            {locale === "en"
              ? "All rights reserved"
              : "Alle rechten voorbehouden"}
            .
          </p>
          <Link
            href="https://www.mkozdev.com"
            className="footer-bottom-img d-f al-c"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/made-by.webp"
              alt="mkozdev"
              width={224}
              height={20}
              className="object-contain"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
