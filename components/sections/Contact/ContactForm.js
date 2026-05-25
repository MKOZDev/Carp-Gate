"use client";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm({ locale }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const labels = {
    name: locale === "en" ? "Full name" : "Volledige naam",
    email: locale === "en" ? "Email address" : "E-mailadres",
    subject: locale === "en" ? "Subject" : "Onderwerp",
    message: locale === "en" ? "Message" : "Bericht",
    submit: locale === "en" ? "Send message" : "Bericht versturen",
    success:
      locale === "en"
        ? "Message sent! We will respond within 1 business day."
        : "Bericht verzonden! We reageren binnen 1 werkdag.",
    error:
      locale === "en"
        ? "Something went wrong. Please try again."
        : "Er is iets misgegaan. Probeer het opnieuw.",
    required: locale === "en" ? "Required" : "Verplicht",
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
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-bg-secondary border border-text-secondary/20 rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-text-accent focus:ring-1 focus:ring-text-accent transition-colors";

  return (
    <div className="bg-bg-secondary rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        {locale === "en" ? "Send us a message" : "Stuur ons een bericht"}
      </h2>

      {status === "success" && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
          <CheckCircle size={20} className="text-green-400 shrink-0" />
          <p className="text-green-400 text-sm">{labels.success}</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <AlertCircle size={20} className="text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{labels.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
        </div>

        <div>
          <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
            {labels.subject}
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder={
              locale === "en"
                ? "Question about my order"
                : "Vraag over mijn bestelling"
            }
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
            rows={6}
            placeholder={
              locale === "en" ? "Your message..." : "Jouw bericht..."
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
