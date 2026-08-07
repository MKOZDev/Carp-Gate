export default function ProductSpecs({ attributes = [], locale }) {
  // BTW (VAT) to atrybut techniczny do naliczania podatku — nie pokazujemy go klientowi
  const specs = attributes.filter((a) => !a.name?.startsWith("BTW"));

  if (specs.length === 0) return null;

  return (
    <div className="bg-bg-secondary rounded-2xl p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
        {locale === "en" ? "Specifications" : "Specificaties"}
      </h3>
      <dl className="space-y-3 max-h-80 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-text-secondary/30 [&::-webkit-scrollbar-thumb]:rounded-full">
        {specs.map((attr, i) => (
          <div
            key={attr.name || i}
            className="flex items-start justify-between gap-4 text-sm pb-3 border-b border-text-secondary/5 last:border-0 last:pb-0"
          >
            <dt className="text-text-secondary shrink-0">{attr.name}</dt>
            <dd className="text-text-primary font-medium text-right">
              {attr.options?.join(", ")}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
