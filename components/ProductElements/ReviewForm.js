"use client";
import { useState } from "react";

export default function ReviewForm({ productId, translations }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", review: "" });
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, ...form }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
        {translations.success}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Gwiazdki */}
      <div>
        <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">
          {translations.ratingLabel ?? "Beoordeling"}
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="text-2xl transition-colors focus:outline-none"
            >
              <span
                className={
                  (hover || rating) >= star
                    ? "text-yellow-400"
                    : "text-text-secondary/20"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={translations.namePlaceholder}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full bg-bg-primary border border-text-secondary/20 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-text-accent/60 transition-colors"
        />
        <input
          type="email"
          placeholder={translations.emailPlaceholder}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full bg-bg-primary border border-text-secondary/20 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-text-accent/60 transition-colors"
        />
      </div>

      <textarea
        placeholder={translations.reviewPlaceholder}
        value={form.review}
        onChange={(e) => setForm({ ...form, review: e.target.value })}
        required
        rows={4}
        className="w-full bg-bg-primary border border-text-secondary/20 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-text-accent/60 transition-colors resize-none"
      />

      {status === "error" && (
        <p className="text-red-400 text-sm">{translations.error}</p>
      )}

      <button
        type="submit"
        disabled={!rating || status === "loading"}
        className="border border-text-accent/50 text-text-secondary hover:bg-text-accent/10 transition-colors px-6 py-2.5 rounded-lg text-sm uppercase tracking-wider font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "loading" ? translations.sending : translations.submit}
      </button>
    </form>
  );
}
