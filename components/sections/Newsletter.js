"use client";
import { useState } from "react";
import Wrapper from "../layout/Wrapper";
import { Mail } from "lucide-react";

const COPY = {
  nl: {
    tag: "Nieuwsbrief",
    title: "Blijf op de hoogte van onze",
    accent: "aanbiedingen",
    desc: "Schrijf je in en ontvang als eerste nieuws over kortingen, nieuwe producten en exclusieve acties.",
    placeholder: "Jouw e-mailadres",
    submit: "Inschrijven",
    sending: "Bezig...",
    success: "Bedankt! Je bent ingeschreven.",
    exists: "Je bent al ingeschreven.",
    error: "Er is iets misgegaan. Probeer het opnieuw.",
  },
  en: {
    tag: "Newsletter",
    title: "Stay updated on our",
    accent: "promotions",
    desc: "Subscribe and be the first to know about discounts, new products and exclusive deals.",
    placeholder: "Your email address",
    submit: "Subscribe",
    sending: "Sending...",
    success: "Thank you! You are now subscribed.",
    exists: "You are already subscribed.",
    error: "Something went wrong. Please try again.",
  },
};

export default function Newsletter({ locale = "nl" }) {
  const c = COPY[locale] ?? COPY.nl;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "exists" | "error"

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setEmail("");
      } else if (data.error === "exists") {
        setStatus("exists");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-bg-secondary py-24 max-sm:py-12">
      <Wrapper>
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          {/* Tag */}
          <div className="flex items-center gap-2 text-text-accent text-xs uppercase tracking-widest">
            <Mail size={14} />
            {c.tag}
          </div>

          {/* Tytuł */}
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
            {c.title} <span className="text-text-accent">{c.accent}</span>
          </h2>

          {/* Opis */}
          <p className="text-text-secondary text-sm leading-relaxed max-w-md">
            {c.desc}
          </p>

          {/* Formularz */}
          {status === "success" ? (
            <div className="w-full p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
              {c.success}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-md gap-2 max-sm:flex-col"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={c.placeholder}
                required
                className="flex-1 bg-bg-primary border border-text-secondary/20 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-text-accent/60 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="border border-text-accent/50 text-text-secondary hover:bg-text-accent/10 transition-colors px-6 py-3 rounded-xl text-sm uppercase tracking-wider font-medium disabled:opacity-40 whitespace-nowrap"
              >
                {status === "loading" ? c.sending : c.submit}
              </button>
            </form>
          )}

          {/* Błędy */}
          {status === "exists" && (
            <p className="text-text-secondary/60 text-xs">{c.exists}</p>
          )}
          {status === "error" && (
            <p className="text-red-400 text-xs">{c.error}</p>
          )}

          <p className="text-text-secondary/40 text-xs">
            {locale === "en"
              ? "No spam. Unsubscribe anytime."
              : "Geen spam. Op elk moment uitschrijven."}
          </p>
        </div>
      </Wrapper>
    </section>
  );
}
