import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="494319d4-dd85-4387-abb8-d034ded4ea83"
          data-blockingmode="auto"
          type="text/javascript"
        />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Carp Gate",
              url: "https://carpgate.com",
              logo: "https://carpgate.com/logo.png",
              email: "carpgatee@gmail.com",
              telephone: "+31652368685",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Zwaardvegersgaarde 48",
                postalCode: "2542 TE",
                addressLocality: "Den Haag",
                addressCountry: "NL",
              },
              priceRange: "€€",
              currenciesAccepted: "EUR",
              paymentAccepted: "iDEAL, Credit Card, PayPal, Klarna",
              areaServed: ["NL", "BE"],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
