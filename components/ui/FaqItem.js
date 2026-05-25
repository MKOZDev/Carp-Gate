"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-bg-secondary rounded-xl border border-text-secondary/10 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center cursor-pointer justify-between w-full px-6 py-4 text-left"
      >
        <span className="text-sm font-medium text-text-primary">
          {question}
        </span>
        <ChevronDown
          size={16}
          className={`text-text-accent shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-4 text-sm text-text-secondary leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
