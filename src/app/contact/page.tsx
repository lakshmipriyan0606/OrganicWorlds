"use client";

import React, { useState } from "react";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <section className="bg-ivory-100 py-16 md:py-20 border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <span className="eyebrow mb-2">Concierge & Inquiries</span>
            <h1 className="font-display text-4xl sm:text-5xl text-forest-900 mb-4">
              Connect With Our Studio
            </h1>
            <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-light">
              Whether you need customized ritual gifting, guidance on botanical scents, or help with an ongoing order.
            </p>
          </div>
        </Container>
      </section>

      <Section spacing="spacious">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h3 className="font-display text-2xl text-forest-900 mb-2">Artisanal Studio</h3>
                <p className="text-sm text-charcoal-600 leading-relaxed font-light">
                  Our hand-pouring studio and organic blending apothecary is situated in Bangalore, India.
                </p>
              </div>

              <div className="space-y-4 text-sm text-charcoal-900">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-forest-700 flex-shrink-0 mt-0.5" />
                  <span>Earth & Essence Botanicals, Indiranagar, Bangalore, Karnataka 560038</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-forest-700 flex-shrink-0" />
                  <span>concierge@earthandessence.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-forest-700 flex-shrink-0" />
                  <span>+91 (080) 4123-8890 (Mon–Fri, 10am–6pm IST)</span>
                </div>
              </div>

              <div className="p-6 bg-sage-100/60 rounded-[3px] border border-[#d6e0d0]">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-forest-900 mb-1">
                  Bespoke & Corporate Gifting
                </h4>
                <p className="text-xs text-forest-900/80 leading-relaxed">
                  We create custom-branded seed paper packaging, private wax vessels, and curated botanical gift boxes for weddings and executive gifts.
                </p>
              </div>
            </div>

            {/* Inquiries Form */}
            <div className="lg:col-span-7 bg-white p-8 md:p-10 border border-border rounded-[3px] shadow-xs">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-sage-100 text-forest-900 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl text-forest-900 mb-2">Message Received</h3>
                  <p className="text-sm text-charcoal-600 max-w-sm mx-auto leading-relaxed">
                    Our botanical concierge will respond to your note within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-charcoal-900 block mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Rohan Sharma"
                        className="w-full text-sm p-3 bg-ivory-50 border border-border rounded-[3px] focus:outline-none focus:border-forest-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-charcoal-900 block mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rohan@example.com"
                        className="w-full text-sm p-3 bg-ivory-50 border border-border rounded-[3px] focus:outline-none focus:border-forest-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-charcoal-900 block mb-2">
                      Inquiry Subject
                    </label>
                    <select className="w-full text-sm p-3 bg-ivory-50 border border-border rounded-[3px] focus:outline-none focus:border-forest-900">
                      <option>General Product Guidance</option>
                      <option>Order & Delivery Status</option>
                      <option>Bespoke Event & Wedding Gifting</option>
                      <option>Wholesale & Retail Stockist</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-charcoal-900 block mb-2">
                      Your Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="How can we assist your ritual journey today?"
                      className="w-full text-sm p-3 bg-ivory-50 border border-border rounded-[3px] focus:outline-none focus:border-forest-900"
                    />
                  </div>

                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Send Message to Studio
                  </Button>
                </form>
              )}
            </div>

          </div>
        </Container>
      </Section>
    </div>
  );
}
