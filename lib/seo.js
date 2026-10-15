export const BASE_URL = "https://www.carpgate.com";

export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  image,
}) {
  const isEn = locale === "en";
  const url = `${BASE_URL}${isEn ? "/en" : ""}${path}` || BASE_URL;
  const ogImage = image || `${BASE_URL}/og-image.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "CarpGate",
      locale: isEn ? "en_GB" : "nl_NL",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
export const DEFAULT_DESC = {
  nl: "CarpGate is dé online karperviswinkel van Nederland. Ontdek boilies, pop-ups, wafters, pellets, karperhengels, molens en hoogwaardige karperuitrusting.",
  en: "CarpGate is your specialist carp fishing shop. Discover boilies, pop-ups, wafters, pellets, rods, reels and premium carp fishing equipment.",
};

export function pickDescription(...candidates) {
  for (const c of candidates) {
    const t = String(c || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
    if (t) {
      return t.length > 160 ? t.slice(0, 157).replace(/\s+\S*$/, "") + "…" : t;
    }
  }
  return undefined;
}
