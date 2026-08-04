"use client";
import { useEffect } from "react";
import { gtmViewItem } from "@/lib/gtm";

export default function GtmViewItem({ product }) {
  useEffect(() => {
    gtmViewItem(product);
  }, [product]);

  return null;
}
