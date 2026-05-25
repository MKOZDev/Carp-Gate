"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLocale } from "next-intl";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("cg_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("cg_cart", JSON.stringify(cart));
    } catch {}
  }, [cart, mounted]);

  const addToCart = useCallback((product, quantity = 1, variation = null) => {
    setCart((prev) => {
      const key = variation
        ? `${product.id}-${variation.id}`
        : String(product.id);
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { key, product, variation, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((i) => i.key !== key));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.variation?.price || item.product.price || 0);
    return sum + price * item.quantity;
  }, 0);

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const buildCheckoutUrl = useCallback(() => {
    const base = process.env.NEXT_PUBLIC_WP_URL;

    const items = cart.map((item) => ({
      id: item.product.id,
      qty: item.quantity,
      ...(item.variation
        ? {
            vid: item.variation.id,
            attrs: item.variation.attributes?.reduce((acc, attr) => {
              acc[`attribute_${attr.name.toLowerCase().replace(/\s+/g, "_")}`] =
                attr.option;
              return acc;
            }, {}),
          }
        : {}),
    }));

    const itemsJson = encodeURIComponent(JSON.stringify(items));
    return `${base}/?add_items=${itemsJson}&clear_next=1&lang=${locale}`;
  }, [cart, locale]);

  return (
    <CartContext.Provider
      value={{
        cart,
        mounted,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        count,
        buildCheckoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart musi być użyty wewnątrz CartProvider");
  return ctx;
};
