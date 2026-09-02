"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _hp_email: honeypot,
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to send. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch {
      setErrorMsg('Network error. Please email sales@Learn2.com directly.');
      setStatus('error');
    }
  };
  return (
    <>
      {/* Hero Section */}
      <section className="bg-learn2-dark py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">Get in Touch</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-6 text-white">
            Let's Talk About Your Team
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed">
            Ready to help your team discover their natural approaches? Let's schedule a conversation. We'll explore which experience could help your organization.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4 text-center">Connect</p>
          <h2 className="text-2xl md:text-3xl mb-12 text-center">How to Reach Out</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Book a Call */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl mb-3 text-learn2-text">Book a Discovery Call</h3>
              <p className="text-learn2-gray mb-6 leading-relaxed">
                30 minutes to explore how Learn2 could help your team. No pressure. Just conversation.
              </p>
              <a
                href="https://bookme.name/DougBolger/free-discovery"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Schedule a Call
              </a>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-xl mb-3 text-learn2-text">Call Doug Directly</h3>
              <p className="text-learn2-gray mb-6 leading-relaxed">
                Prefer to talk right now? Call and let's discuss what you need.
              </p>
              <a
                href="tel:+14164106434"
                className="btn-secondary"
              >
                +1 416-410-6434
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-xl mb-3 text-learn2-text">Send an Email</h3>
              <p className="text-learn2-gray mb-6 leading-relaxed">
                Tell us about your team and what you need. We'll get back to you within 24 hours.
              </p>
              <a
                href="mailto:doug@learn2.com"
                className="btn-secondary"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 md:py-24 bg-learn2-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">Discovery Process</p>
          <h2 className="text-2xl md:text-3xl mb-12">What to Expect on a Discovery Call</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="text-5xl font-bold text-learn2-orange flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl mb-3 text-learn2-text">We Listen</h3>
                <p className="text-learn2-gray leading-relaxed">
                  We want to understand your team. What challenges you're facing. What you've tried. What success looks like. This is a conversation, not a pitch.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-5xl font-bold text-learn2-orange flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl mb-3 text-learn2-text">We Explore Options</h3>
                <p className="text-learn2-gray leading-relaxed">
                  Based on what you tell us, we discuss which experiences might be right for you. We're honest about what would help and what wouldn't.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-5xl font-bold text-learn2-orange flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl mb-3 text-learn2-text">We Answer Questions</h3>
                <p className="text-learn2-gray leading-relaxed">
                  You'll have questions. How long does it take. What does it cost. How many people can participate. What kind of results should we expect. We answer all of them.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-5xl font-bold text-learn2-orange flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl mb-3 text-learn2-text">Next Steps</h3>
                <p className="text-learn2-gray leading-relaxed">
                  If it feels like a good fit, we'll talk about next steps. If it doesn't feel right, we'll say so. We only work with teams where we can deliver real value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Form */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl mb-4 text-center text-learn2-text">Not Ready to Call?</h2>
          <p className="text-learn2-gray text-center mb-10">Leave your details. We'll reach out within 24 hours.</p>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-semibold text-center">
              Thanks for reaching out. We'll be in touch within 24 hours.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 font-semibold text-center">
              {errorMsg || "Something went wrong. Please email sales@Learn2.com directly."}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Honeypot — hidden from humans, catches bots */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="hp-email">Leave this empty</label>
              <input
                type="email"
                id="hp-email"
                name="_hp_email"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="contact-name" className="block text-sm font-semibold text-learn2-text mb-2">Name</label>
              <input type="text" id="contact-name" name="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-learn2-orange" />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-semibold text-learn2-text mb-2">Email</label>
              <input type="email" id="contact-email" name="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-learn2-orange" />
            </div>
            <div>
              <label htmlFor="contact-company" className="block text-sm font-semibold text-learn2-text mb-2">Company</label>
              <input type="text" id="contact-company" name="company" value={formData.company} onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-learn2-orange" />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-semibold text-learn2-text mb-2">What could we help with?</label>
              <textarea id="contact-message" name="message" rows={4} value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} placeholder="Tell us what you are trying to change and roughly when." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-learn2-orange" />
            </div>
            <button type="submit" disabled={status === 'sending'} className="w-full btn-primary disabled:opacity-50">
              {status === 'sending' ? 'Sending...' : 'Send My Details'}
            </button>
          </form>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">FAQ</p>
          <h2 className="text-2xl md:text-3xl mb-12">Common Questions</h2>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg p-8 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-learn2-text">
                <span>How much does it cost?</span>
                <span className="text-2xl group-open:rotate-180 transition">→</span>
              </summary>
              <p className="text-learn2-gray mt-4 leading-relaxed">
                Pricing depends on what you need. Are you bringing Doug in to facilitate. Are you certifying your own facilitators. How many people will participate. We discuss your needs and put together a custom proposal. There's no one-size-fits-all price.
              </p>
            </details>

            <details className="group border border-gray-200 rounded-lg p-8 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-learn2-text">
                <span>How long does it take?</span>
                <span className="text-2xl group-open:rotate-180 transition">→</span>
              </summary>
              <p className="text-learn2-gray mt-4 leading-relaxed">
                Most experiences are one or two days. Sometimes we do it in half-day sessions spread across weeks if that works better for your team. Certification is a 3-day intensive. We customize the timeline to fit your needs.
              </p>
            </details>

            <details className="group border border-gray-200 rounded-lg p-8 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-learn2-text">
                <span>How many people should participate?</span>
                <span className="text-2xl group-open:rotate-180 transition">→</span>
              </summary>
              <p className="text-learn2-gray mt-4 leading-relaxed">
                Experiences work best with 8-30 people. Smaller groups can be more intimate. Larger groups can be more powerful because you have more natural approaches represented. We can customize for whatever size makes sense for you.
              </p>
            </details>

            <details className="group border border-gray-200 rounded-lg p-8 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-learn2-text">
                <span>Can we do this remotely?</span>
                <span className="text-2xl group-open:rotate-180 transition">→</span>
              </summary>
              <p className="text-learn2-gray mt-4 leading-relaxed">
                Yes. We've successfully delivered experiences both in-person and remotely. Remote delivery is different. It requires more structure and shorter sessions. We'll work with you to design an approach that works for your team.
              </p>
            </details>

            <details className="group border border-gray-200 rounded-lg p-8 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-learn2-text">
                <span>What if we just want to try it first?</span>
                <span className="text-2xl group-open:rotate-180 transition">→</span>
              </summary>
              <p className="text-learn2-gray mt-4 leading-relaxed">
                Perfect. Take the free assessment. See your natural approach. Then we can talk about a pilot program with your leadership team. Once you see the value, you can expand to the broader organization.
              </p>
            </details>

            <details className="group border border-gray-200 rounded-lg p-8 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-learn2-text">
                <span>Will my team actually change?</span>
                <span className="text-2xl group-open:rotate-180 transition">→</span>
              </summary>
              <p className="text-learn2-gray mt-4 leading-relaxed">
                Change happens when people discover something true about themselves and commit to using that insight. Our experiences are designed for discovery. Over 80% of participants maintain behavior change for at least 6 months. The key is that they own it, not that we convince them.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Doug Bio */}
      <section className="py-16 md:py-24 bg-learn2-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl md:text-3xl mb-8 text-learn2-text">About Doug Bolger</h2>
            <div className="space-y-4 text-learn2-gray leading-relaxed">
              <p>
                Doug Bolger is the founder of Learn2 Learning Experiences Inc. and the creator of the Naturally Suite. Over 25 years, he has designed and facilitated experiences for leaders and teams at American Express, Bell Canada, Prophix, EO, Deloitte, Duke CE, and Korn Ferry.
              </p>
              <p>
                Doug believes that every team has the same four natural approaches represented. When teams understand how they naturally think, communicate, and work, everything improves. His job is helping teams discover that.
              </p>
              <p>
                In his spare time, Doug is outdoors. Running. Mountain biking. Kayaking. He believes that the best thinking happens outside. That movement creates clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-learn2-orange text-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-95">
            Let's talk. A quick discovery call will help us understand your team and how we could help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://bookme.name/DougBolger/free-discovery"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Book a Discovery Call
            </a>
            <a
              href="tel:+14164106434"
              className="btn-outline"
            >
              Call +1 416-410-6434
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
