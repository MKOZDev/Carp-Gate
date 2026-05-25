import ProductCard from "./ProductCard";

export default function ProductGrid({ products, locale = "nl" }) {
  if (!products?.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400">Geen producten gevonden.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6 md:ga">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
