"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Truck } from "lucide-react";

export default function FreeShippingBar() {
  const t = useTranslations("shipping");
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const dismissed = sessionStorage.getItem("freeShippingBarDismissed");
    if (dismissed) {
      setVisible(false);
    }
  }, []);

  // Unikamy flashu przed hydracją / gdy user wcześniej zamknął pasek
  if (!mounted || !visible) return null;

  return (
    <div className="fixed top-0 w-full h-9 z-50 left-0 bg-text-accent text-bg-primary py-2 px-10 sm:px-12">
      <div className="flex items-center justify-center gap-2 text-center">
        <Truck className="w-5 h-5 shrink-0" strokeWidth={2} />
        <span className="text-xs sm:text-sm font-semibold tracking-wide">
          {t("freeShippingBanner")}
        </span>
      </div>
    </div>
  );
}
