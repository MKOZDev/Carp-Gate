"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-bg-primary flex items-center justify-center transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/logo.png"
          alt="Carp Gate"
          width={100}
          height={100}
          className="object-contain"
        />

        {/* Loader */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-text-accent"
              style={{
                animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); opacity: 0.4; }
          to { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
