"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";

function cleanOption(option) {
  return option.replace(/^"|"$/g, "").trim();
}

export default function AddToCartButton({ product }) {
  const t = useTranslations("product");
  const { addToCart } = useCart();
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const hasVariations = product.type === "variable";
  const variations = product._variations || [];
  const variantAttributes =
    product.attributes?.filter((a) => a.variation) || [];
  const allSelected = variantAttributes.every(
    (attr) => selectedAttributes[attr.name],
  );

  useEffect(() => {
    if (!hasVariations || !allSelected) {
      setSelectedVariation(null);
      return;
    }

    const matched = variations.find((v) =>
      v.attributes.every((attr) => {
        if (!attr.option) return true;
        const variantOption = cleanOption(attr.option).toLowerCase();
        const selectedOption = (
          selectedAttributes[attr.name] || ""
        ).toLowerCase();

        return variantOption === selectedOption;
      }),
    );

    setSelectedVariation(matched || null);
  }, [selectedAttributes, variations, hasVariations, allSelected]);

  function handleAdd() {
    if (hasVariations && !selectedVariation) return;
    addToCart(product, quantity, selectedVariation);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const outOfStock = product.stock_status !== "instock";
  const canAdd =
    !outOfStock && (!hasVariations || (allSelected && selectedVariation));

  return (
    <div className="space-y-5">
      {/* Warianty */}
      {hasVariations &&
        variantAttributes.map((attr) => (
          <div key={attr.name}>
            <label className="block text-sm font-medium mb-2 text-text-secondary uppercase tracking-wider">
              {attr.name}
              {selectedAttributes[attr.name] && (
                <span className="text-text-accent font-normal ml-2 normal-case tracking-normal">
                  — {cleanOption(selectedAttributes[attr.name])}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {attr.options.map((option, idx) => (
                <button
                  key={`${attr.name}-${idx}`}
                  onClick={() =>
                    setSelectedAttributes((p) => ({
                      ...p,
                      [attr.name]: cleanOption(option),
                    }))
                  }
                  className={`px-4 py-2 text-sm cursor-pointer rounded border transition-all ${
                    selectedAttributes[attr.name] === cleanOption(option)
                      ? "bg-text-accent  text-bg-primary border-text-accent"
                      : "border-text-secondary/30 text-text-secondary hover:border-text-accent hover:text-text-accent"
                  }`}
                >
                  {cleanOption(option)}
                </button>
              ))}
            </div>
          </div>
        ))}

      {/* Cena wariantu */}
      {selectedVariation && (
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-text-primary">
            {parseFloat(selectedVariation.price).toLocaleString("nl-NL", {
              style: "currency",
              currency: "EUR",
            })}
          </span>
          {selectedVariation.on_sale &&
            parseFloat(selectedVariation.regular_price) >
              parseFloat(selectedVariation.price) && (
              <span className="text-text-secondary line-through">
                {parseFloat(selectedVariation.regular_price).toLocaleString(
                  "nl-NL",
                  { style: "currency", currency: "EUR" },
                )}
              </span>
            )}
        </div>
      )}

      {/* Ilość */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-secondary uppercase tracking-wider">
          {t("quantity")}:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-full border border-text-secondary/30 cursor-pointer text-text-secondary hover:border-text-accent hover:text-text-accent flex items-center justify-center transition-colors"
          >
            −
          </button>
          <span className="w-10 text-center font-medium text-text-primary">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 rounded-full border border-text-secondary/30 cursor-pointer text-text-secondary hover:border-text-accent hover:text-text-accent flex items-center justify-center transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Przycisk dodaj do koszyka */}
      <button
        onClick={handleAdd}
        disabled={!canAdd}
        className={`inline-flex w-full items-center justify-center gap-3 font-medium text-md uppercase py-4 px-8 rounded border transition-all duration-150 ${
          added
            ? "border-green-500 text-green-400 bg-green-500/10"
            : canAdd
              ? "border-text-accent text-text-secondary hover:bg-white/10 cursor-pointer"
              : "border-text-secondary/20 text-text-secondary/40 cursor-not-allowed"
        }`}
      >
        {outOfStock
          ? t("outOfStock")
          : hasVariations && !allSelected
            ? t("selectAll")
            : added
              ? t("added")
              : t("addToCart")}
      </button>
    </div>
  );
}
