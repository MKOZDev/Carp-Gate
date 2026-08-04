import { getProducts } from "@/lib/api";

export async function GET() {
  const allProducts = [];
  let page = 1;

  while (true) {
    const { products, totalPages } = await getProducts(
      { per_page: 100, page, stock_status: "instock" },
      "nl",
    );
    allProducts.push(...products);
    if (page >= totalPages) break;
    page++;
  }

  const items = allProducts
    .filter((p) => parseFloat(p.price || 0) > 0)
    .map((p) => {
      const price = parseFloat(p.price || 0).toFixed(2);
      const image = p.images?.[0]?.src || "";
      const description = (p.short_description || p.description || "")
        .replace(/<[^>]+>/g, "")
        .replace(/&[^;]+;/g, " ")
        .trim()
        .slice(0, 500);

      return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${description || p.name}]]></g:description>
      <g:link>https://carpgate.com/product/${p.slug}</g:link>
      <g:image_link>${image}</g:image_link>
      <g:availability>in stock</g:availability>
      <g:price>${price} EUR</g:price>
      <g:brand>Tandem Baits</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>3483</g:google_product_category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>CarpGate Product Feed</title>
    <link>https://carpgate.com</link>
    <description>CarpGate product catalogue</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
