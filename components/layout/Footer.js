import Link from "next/link";
import Image from "next/image";
import { getCategories, getMenu } from "@/lib/api";
import { Mail, Phone, MapPin } from "lucide-react";

function PaymentBadge({ children, bg = "white" }) {
  return (
    <div
      className="h-8 px-2 rounded-md flex items-center justify-center"
      style={{ background: bg, minWidth: "48px" }}
    >
      {children}
    </div>
  );
}

function MollieIcon() {
  return (
    <PaymentBadge>
      <svg
        viewBox="0 0 60 24"
        className="h-4 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="2"
          y="18"
          fontSize="16"
          fontWeight="800"
          fontFamily="Arial, sans-serif"
          fill="#000"
        >
          mollie
        </text>
      </svg>
    </PaymentBadge>
  );
}

function VisaIcon() {
  return (
    <PaymentBadge>
      <svg
        viewBox="0 0 38 16"
        className="h-4 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="13"
          fontSize="14"
          fontWeight="800"
          fontFamily="Arial, sans-serif"
          fill="#1A1F71"
          fontStyle="italic"
          letterSpacing="1"
        >
          VISA
        </text>
      </svg>
    </PaymentBadge>
  );
}

function MastercardIcon() {
  return (
    <PaymentBadge>
      <svg
        viewBox="0 0 38 24"
        className="h-5 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="14" cy="12" r="10" fill="#EB001B" />
        <circle cx="24" cy="12" r="10" fill="#F79E1B" />
        <path
          d="M19 4.8a10 10 0 0 1 0 14.4A10 10 0 0 1 19 4.8z"
          fill="#FF5F00"
        />
      </svg>
    </PaymentBadge>
  );
}

function ApplePayIcon() {
  return (
    <PaymentBadge>
      <svg
        viewBox="0 0 45 22"
        className="h-4 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.5 3.6c-.55.66-1.43 1.18-2.3 1.1-.11-.88.32-1.8.83-2.38C8.58 1.6 9.5 1.1 10.25 1.07c.1.91-.26 1.8-.75 2.53zm.73 1.16c-1.27-.08-2.35.72-2.96.72-.62 0-1.55-.68-2.55-.66-1.31.02-2.53.76-3.19 1.94-1.37 2.37-.35 5.97.97 7.93.65.96 1.42 2.02 2.43 1.98.96-.04 1.34-.62 2.51-.62 1.18 0 1.51.62 2.55.6 1.04-.02 1.7-.97 2.34-1.93.74-1.1 1.04-2.16 1.06-2.23-.02-.02-2.04-.79-2.06-3.13-.02-1.96 1.6-2.9 1.67-2.95-.91-1.34-2.33-1.49-2.77-1.65z"
          fill="#000"
        />
        <text
          x="17"
          y="16"
          fontSize="12"
          fontWeight="600"
          fontFamily="-apple-system, Arial, sans-serif"
          fill="#000"
        >
          Pay
        </text>
      </svg>
    </PaymentBadge>
  );
}

function PayPalIcon() {
  return (
    <PaymentBadge>
      <svg
        viewBox="0 0 50 20"
        className="h-4 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="15"
          fontSize="14"
          fontWeight="800"
          fontFamily="Arial, sans-serif"
          fill="#003087"
          fontStyle="italic"
        >
          Pay
        </text>
        <text
          x="22"
          y="15"
          fontSize="14"
          fontWeight="800"
          fontFamily="Arial, sans-serif"
          fill="#009cde"
          fontStyle="italic"
        >
          Pal
        </text>
      </svg>
    </PaymentBadge>
  );
}

function KlarnaIcon() {
  return (
    <PaymentBadge bg="#FFB3C7">
      <svg
        viewBox="0 0 55 18"
        className="h-4 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="14"
          fontSize="13"
          fontWeight="800"
          fontFamily="Arial, sans-serif"
          fill="#000"
        >
          Klarna.
        </text>
      </svg>
    </PaymentBadge>
  );
}

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
            <p className="text-text-secondary text-xs font-bold leading-relaxed mb-2">
              {locale === "en"
                ? "Order carp fishing gear online"
                : "Karperspullen online bestellen"}
            </p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {locale === "en"
                ? "There are many different types of carp fishing gear that you can order online from CarpGate. We’ve organized our online store as efficiently as possible so you can always find the right gear quickly and easily. We also offer competitive shipping rates. This means you can have packages of hooks and other tackle delivered via PostNL. Larger items are shipped via DPD. We have a wide range of carp fishing gear, from hooks, boilies, and rig rings to tents, boats, and power banks. If you can think of anything related to carp fishing, chances are you’ll find it in our selection."
                : "Er zijn heel veel soorten karperspullen die je online kunt bestellen bij CarpGate. We hebben onze webshop zo efficiënt mogelijk ingedeeld zodat jij altijd de juiste spullen goed en snel kunt vinden. Ook bieden we scherpe tarieven voor verzending. Zo kun je pakjes haken en overige tackle ook gewoon laten bezorgen met PostNL. Grotere items gaan met DPD  mee. We hebben een groot assortiment karperspullen van haken, boilies, rig rings tot tenten, boten en powerbanks. Als je kan bedenken dat het met karpervissen te maken heeft, is de kans groot dat je het in ons assortiment terug vind."}
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
                Zwaardvegersgaarde 48, 2542 TE Den Haag, Nederland
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-text-secondary/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-4">
            <p className="text-xs text-center sm:text-left text-text-secondary uppercase tracking-widest">
              © {new Date().getFullYear()} Carp Gate BV ·{" "}
              {locale === "en"
                ? "All rights reserved"
                : "Alle rechten voorbehouden"}
              .
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <MollieIcon />
              <VisaIcon />
              <MastercardIcon />
              <ApplePayIcon />
              <PayPalIcon />
              <KlarnaIcon />
            </div>
          </div>

          <Link
            href="https://www.mkozdev.com"
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
