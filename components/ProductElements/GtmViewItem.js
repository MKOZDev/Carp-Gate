"use client";
import { useEffect } from "react";
import { gtmViewItem, metaViewContent } from "@/lib/gtm";

export default function GtmViewItem({ product }) {
  useEffect(() => {
    gtmViewItem(product);
    metaViewContent(product);
  }, [product]);

  return null;
}
