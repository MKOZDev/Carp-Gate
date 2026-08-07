"use client";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Mail } from "lucide-react";

export default function ContactOrderForm({ subject, locale }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const labels = {
    name: locale === "en" ? "Full name" : "Volledige naam",
    email: locale === "en" ? "Email address" : "E-mailadres",
    message: locale === "en" ? "Message" : "Bericht",
    submit: locale === "en" ? "Send request" : "Aanvraag versturen",
    success:
      locale === "en"
        ? "Request sent! We will get back to you within 1 business day."
        : "Aanvraag verzonden! We nemen binnen 1 werkdag contact met je op.",
    error:
      locale === "en"
        ? "Something went wrong. Please try again."
        : "Er is iets misgegaan. Probeer het opnieuw.",
    intro:
      locale === "en"
        ? "This product is made to order — tell us what you need and we'll get back to you with the details."
        : "Dit product wordt op maat samengesteld — vertel ons wat je nodig hebt en we nemen contact met je op.",
  };

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject, type: "order" }),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-bg-primary border border-text-secondary/20 rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-text-accent focus:ring-1 focus:ring-text-accent transition-colors";

  return (
    <div className="bg-bg-secondary rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <Mail size={16} className="text-text-accent" />
        <h3 className="text-sm font-semibold text-text-primary">
          {locale === "en" ? "Request this product" : "Vraag dit product aan"}
        </h3>
      </div>
      <p className="text-xs text-text-secondary mb-5">{labels.intro}</p>

      {status === "success" && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-5">
          <CheckCircle size={18} className="text-green-400 shrink-0" />
          <p className="text-green-400 text-xs">{labels.success}</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5">
          <AlertCircle size={18} className="text-red-400 shrink-0" />
          <p className="text-red-400 text-xs">{labels.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
            {locale === "en" ? "Subject" : "Onderwerp"}
          </label>
          <div className="w-full bg-bg-primary/60 border border-text-secondary/10 rounded-xl px-4 py-3 text-text-secondary text-sm">
            {subject}
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
            {labels.name} <span className="text-text-accent">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Jan de Vries"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
            {labels.email} <span className="text-text-accent">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="jan@email.nl"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
            {labels.message} <span className="text-text-accent">*</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={4}
            placeholder={
              locale === "en"
                ? "Which configuration/options do you need?"
                : "Welke configuratie/opties heb je nodig?"
            }
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center cursor-pointer justify-center gap-3 w-full font-medium text-sm text-text-secondary uppercase tracking-wider py-4 px-8 rounded border border-text-accent transition-all duration-150 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <Send size={16} />
          )}
          {status === "loading"
            ? locale === "en"
              ? "Sending..."
              : "Verzenden..."
            : labels.submit}
        </button>
      </form>
    </div>
  );
}
