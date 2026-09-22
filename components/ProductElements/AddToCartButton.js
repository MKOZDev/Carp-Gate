"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";

function cleanOption(option) {
  return option.replace(/^"|"$/g, "").trim();
}

// Ilość danego klucza (produkt albo produkt-wariant) już obecna w koszyku.
function tracksStockKeyLookup(cart, key) {
  const item = cart?.find((i) => i.key === key);
  return item ? item.quantity : 0;
}

export default function AddToCartButton({ product }) {
  const t = useTranslations("product");
  const { cart, addToCart } = useCart();
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Aktualny "byt", którego stan magazynowy obowiązuje: wariant (jeśli produkt
  // ma warianty i jest wybrany) albo sam produkt.
  const activeEntity = hasVariations ? selectedVariation : product;

  // manage_stock === true i stock_quantity !== null/undefined -> mamy dokładną
  // liczbę sztuk na magazynie i musimy jej pilnować. W przeciwnym razie
  // (np. manage_stock wyłączony) polegamy tylko na stock_status.
  const tracksStock =
    !!activeEntity?.manage_stock &&
    activeEntity?.stock_quantity !== null &&
    activeEntity?.stock_quantity !== undefined;

  // Ile sztuk tego dokładnie produktu/wariantu klient ma już w koszyku - ten sam
  // klucz, którego używa CartContext (product.id albo product.id-variation.id).
  const cartKey = selectedVariation
    ? `${product.id}-${selectedVariation.id}`
    : String(product.id);
  const inCartQuantity = tracksStockKeyLookup(cart, cartKey);

  const rawAvailableStock = tracksStock ? activeEntity.stock_quantity : null;
  // To, co faktycznie zostało do dodania: stan magazynowy pomniejszony o to,
  // co klient już ma w koszyku - inaczej licznik "+" pozwoliłby przekroczyć
  // realny stan (np. stan=5, w koszyku już 0, ale gdyby doliczyć bez tego,
  // dało się dobić do 6 mimo że dostępnych jest tylko 5).
  const availableStock = tracksStock
    ? Math.max(0, rawAvailableStock - inCartQuantity)
    : null;

  // Resetuj/przycinaj ilość, gdy zmienia się dostępny stan (np. po wyborze wariantu,
  // albo gdy w innej karcie klient dorzucił ten sam produkt do koszyka).
  useEffect(() => {
    if (tracksStock && quantity > availableStock) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuantity(availableStock > 0 ? availableStock : 1);
    }
  }, [tracksStock, availableStock]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAdd() {
    if (hasVariations && !selectedVariation) return;
    if (tracksStock && (availableStock <= 0 || quantity > availableStock))
      return;
    addToCart(product, quantity, selectedVariation);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const outOfStock =
    activeEntity?.stock_status !== "instock" ||
    (tracksStock && rawAvailableStock <= 0);

  // Cały stan już leży w koszyku (np. stan=5, w koszyku już 5) - nie stan=0,
  // ale nie ma już nic do dodania.
  const noneLeftToAdd = tracksStock && !outOfStock && availableStock <= 0;

  const exceedsStock = tracksStock && quantity > availableStock;

  const canAdd =
    !outOfStock &&
    !noneLeftToAdd &&
    !exceedsStock &&
    (!hasVariations || (allSelected && selectedVariation));

  const canIncrease = !tracksStock || quantity < availableStock;

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
            onClick={() =>
              setQuantity((q) =>
                tracksStock ? Math.min(availableStock, q + 1) : q + 1,
              )
            }
            disabled={!canIncrease}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
              canIncrease
                ? "border-text-secondary/30 cursor-pointer text-text-secondary hover:border-text-accent hover:text-text-accent"
                : "border-text-secondary/10 text-text-secondary/30 cursor-not-allowed"
            }`}
          >
            +
          </button>
        </div>
        {/* Informacja o pozostałej dostępnej liczbie sztuk (uwzględnia to, co już w koszyku) */}
        {tracksStock && !outOfStock && (
          <span className="text-xs text-text-secondary/70">
            {availableStock > 0
              ? t("stockLeft", { count: availableStock })
              : t("allInCart")}
          </span>
        )}
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
            : noneLeftToAdd
              ? t("allInCart")
              : exceedsStock
                ? t("insufficientStock")
                : added
                  ? t("added")
                  : t("addToCart")}
      </button>
    </div>
  );
}
