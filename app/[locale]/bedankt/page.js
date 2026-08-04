import { getOrder } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { CheckCircle, Package, MapPin, Mail, ArrowRight } from "lucide-react";
import Wrapper from "@/components/layout/Wrapper";
import GtmPurchase from "@/components/ProductElements/GtmPurchase";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Order confirmed" : "Bestelling bevestigd",
  };
}

export default async function ThankYouPage({ params, searchParams }) {
  const { locale } = await params;
  const { order: orderId, key: orderKey } = await searchParams;
  const p = locale === "en" ? "/en" : "";
  const isEn = locale === "en";

  if (!orderId || !orderKey) notFound();

  const order = await getOrder(orderId, orderKey);
  if (!order) notFound();

  const items = order.line_items || [];
  <GtmPurchase order={order} />;
  const shipping = order.shipping_lines?.[0]?.method_title || "";
  const address = order.shipping;

  return (
    <div className="bg-bg-primary py-16 max-sm:py-8">
      <Wrapper>
        {/* Header */}
        <div className="text-center mb-16 max-sm:mb-8">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-3">
            {isEn ? "Order confirmed!" : "Bestelling bevestigd!"}
          </h1>
          <p className="text-text-secondary max-w-md mx-auto">
            {isEn
              ? "Thank you for your order. You will receive a confirmation email shortly."
              : "Bedankt voor je bestelling. Je ontvangt binnenkort een bevestigingsmail."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produkty */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order info */}
            <div className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10">
              <div className="flex items-center gap-3 mb-6">
                <Package size={18} className="text-text-accent" />
                <h2 className="font-semibold text-text-primary">
                  {isEn ? "Order" : "Bestelling"} #{order.number}
                </h2>
                <span className="ml-auto text-xs text-text-secondary">
                  {new Date(order.date_created).toLocaleDateString(
                    isEn ? "en-GB" : "nl-NL",
                    { year: "numeric", month: "long", day: "numeric" },
                  )}
                </span>
              </div>

              {/* Produkty */}
              <div className="space-y-4">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 py-4 border-b border-text-secondary/10 last:border-0"
                  >
                    {/* Zdjęcie */}
                    <div className="w-14 h-14 rounded-xl bg-bg-primary shrink-0 overflow-hidden relative">
                      {item.image?.src ? (
                        <Image
                          src={item.image.src}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-secondary/30">
                          <Package size={20} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.name}
                      </p>
                      {item.meta_data
                        ?.filter((m) => m.display_key && m.display_value)
                        .map((m, j) => (
                          <p key={j} className="text-xs text-text-secondary">
                            {m.display_key}: {m.display_value}
                          </p>
                        ))}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm text-text-secondary">
                        × {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-text-primary">
                        {parseFloat(item.total).toLocaleString("nl-NL", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 space-y-2 pt-4 border-t border-text-secondary/10">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    {isEn ? "Subtotal" : "Subtotaal"}
                  </span>
                  <span className="text-text-primary">
                    {parseFloat(order.subtotal || order.total).toLocaleString(
                      "nl-NL",
                      { style: "currency", currency: "EUR" },
                    )}
                  </span>
                </div>
                {shipping && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      {isEn ? "Shipping" : "Verzending"}
                    </span>
                    <span className="text-text-primary">
                      {parseFloat(order.shipping_total) === 0
                        ? isEn
                          ? "Free"
                          : "Gratis"
                        : parseFloat(order.shipping_total).toLocaleString(
                            "nl-NL",
                            { style: "currency", currency: "EUR" },
                          )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t border-text-secondary/10">
                  <span className="text-text-primary">
                    {isEn ? "Total" : "Totaal"}
                  </span>
                  <span className="text-text-accent text-lg">
                    {parseFloat(order.total).toLocaleString("nl-NL", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`${p}/shop`}
                className="flex-1 inline-flex items-center justify-center gap-3 font-medium text-sm text-text-secondary uppercase tracking-wider py-4 px-8 rounded border border-text-accent transition-all hover:bg-white/10"
              >
                {isEn ? "Continue shopping" : "Verder winkelen"}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`${p}/`}
                className="flex-1 inline-flex items-center justify-center gap-3 font-medium text-sm text-text-secondary uppercase tracking-wider py-4 px-8 rounded border border-text-secondary/30 transition-all hover:border-text-secondary"
              >
                {isEn ? "Back to home" : "Terug naar home"}
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Adres */}
            {address?.address_1 && (
              <div className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={16} className="text-text-accent" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                    {isEn ? "Shipping address" : "Verzendadres"}
                  </h3>
                </div>
                <address className="not-italic text-sm text-text-primary space-y-1">
                  <p>
                    {address.first_name} {address.last_name}
                  </p>
                  <p>{address.address_1}</p>
                  {address.address_2 && <p>{address.address_2}</p>}
                  <p>
                    {address.postcode} {address.city}
                  </p>
                  <p>{address.country}</p>
                </address>
              </div>
            )}

            {/* Email */}
            <div className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10">
              <div className="flex items-center gap-2 mb-4">
                <Mail size={16} className="text-text-accent" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  {isEn ? "Confirmation sent to" : "Bevestiging verstuurd naar"}
                </h3>
              </div>
              <p className="text-sm text-text-primary">
                {order.billing?.email}
              </p>
            </div>

            {/* Betaling */}
            <div className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
                {isEn ? "Payment method" : "Betaalmethode"}
              </h3>
              <p className="text-sm text-text-primary">
                {order.payment_method_title}
              </p>
            </div>

            {/* Status */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
              <p className="text-sm text-green-400 font-medium mb-1">
                {isEn ? "✓ Order received" : "✓ Bestelling ontvangen"}
              </p>
              <p className="text-xs text-text-secondary">
                {isEn
                  ? "We will process your order within 1 business day."
                  : "Wij verwerken je bestelling binnen 1 werkdag."}
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
