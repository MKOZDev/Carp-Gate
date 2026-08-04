"use client";
import { useEffect } from "react";
import { pushEvent } from "@/lib/gtm";

export default function GtmPurchase({ order }) {
  useEffect(() => {
    if (!order) return;

    const items =
      order.line_items?.map((item) => ({
        item_id: String(item.product_id),
        item_name: item.name,
        price: parseFloat(item.price || 0),
        quantity: item.quantity,
      })) || [];

    pushEvent({
      event: "purchase",
      ecommerce: {
        transaction_id: String(order.id),
        value: parseFloat(order.total || 0),
        tax: parseFloat(order.total_tax || 0),
        shipping: parseFloat(order.shipping_total || 0),
        currency: order.currency || "EUR",
        coupon: order.coupon_lines?.map((c) => c.code).join(",") || "",
        items,
      },
    });
  }, [order]);

  return null;
}
