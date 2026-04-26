"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function CohortWaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    context: "",
  });
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/cert-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          _hp_email: honeypot,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", role: "", context: "" });
    } catch {
      setErrorMsg("Network error. Please email sales@Learn2.com directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-lg p-8 border-2 border-learn2-orange text-center">
        <p className="text-2xl mb-3 text-learn2-text">You&apos;re on the waitlist.</p>
        <p className="text-learn2-gray leading-relaxed">
          We&apos;ll email you with cohort dates, pricing, and the application before the July cohort opens. If you have a specific question, reply to the confirmation email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 border border-gray-200 space-y-5">
      {/* Honeypot — hidden from humans */}
      <div style={{ position: "absolute", left: "-9999px", height: 0, width: 0, overflow: "hidden" }} aria-hidden="true">
        <label htmlFor="hp_email">Do not fill this field</label>
        <input
          id="hp_email"
          type="email"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="cw_name" className="block text-sm font-semibold text-learn2-text mb-2">
          Your name
        </label>
        <input
          id="cw_name"
          type="text"
          required
          autoComplete="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded border border-gray-300 focus:border-learn2-orange focus:outline-none text-learn2-text"
        />
      </div>

      <div>
        <label htmlFor="cw_email" className="block text-sm font-semibold text-learn2-text mb-2">
          Email
        </label>
        <input
          id="cw_email"
          type="email"
          required
          autoComplete="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded border border-gray-300 focus:border-learn2-orange focus:outline-none text-learn2-text"
        />
      </div>

      <div>
        <label htmlFor="cw_role" className="block text-sm font-semibold text-learn2-text mb-2">
          What brings you to the waitlist?
        </label>
        <select
          id="cw_role"
          required
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-4 py-3 rounded border border-gray-300 focus:border-learn2-orange focus:outline-none text-learn2-text bg-white"
        >
          <option value="">Select one</option>
          <option value="consultant">Independent consultant / coach</option>
          <option value="internal-ld">Internal L&amp;D or HR</option>
          <option value="transitioning-leader">Transitioning leader (severance / between roles)</option>
          <option value="team-leader">Team leader wanting to certify</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="cw_context" className="block text-sm font-semibold text-learn2-text mb-2">
          What are you hoping certification helps you do? <span className="text-learn2-gray font-normal">(optional)</span>
        </label>
        <textarea
          id="cw_context"
          rows={3}
          value={formData.context}
          onChange={(e) => setFormData({ ...formData, context: e.target.value })}
          className="w-full px-4 py-3 rounded border border-gray-300 focus:border-learn2-orange focus:outline-none text-learn2-text"
          placeholder="A few words about your situation"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full disabled:opacity-60"
      >
        {status === "submitting" ? "Joining..." : "Join the July Cohort Waitlist"}
      </button>

      <p className="text-xs text-learn2-gray text-center">
        We email you cohort details before open enrollment. No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
