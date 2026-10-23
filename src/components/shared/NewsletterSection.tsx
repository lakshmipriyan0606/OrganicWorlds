"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

export function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="bg-[#0E231C] text-white py-16 md:py-20 border-b border-forest-800">
      <Container size="narrow">
        <div className="text-center space-y-6">
          <span className="eyebrow text-sand-300">Quiet Solace in Your Inbox</span>
          <h2 className="font-display text-3xl sm:text-4xl text-white">
            The Botanical Journal &amp; Fresh Harvest Batches
          </h2>
          <p className="text-sm sm:text-base text-ivory-100/85 max-w-lg mx-auto font-normal leading-relaxed">
            Subscribers receive seasonal harvest notes, scalp wellness guides, and first access to fresh 6-week cured cold-process soap bars and cold-pressed hair oil pressings.
          </p>
          
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 p-4 bg-forest-800 rounded-[3px] border border-forest-700 max-w-md mx-auto text-sand-300 text-sm">
              <Check className="w-4 h-4 text-sand-300" />
              <span>Welcome to our botanical community. Complimentary soap sample added to your profile.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-forest-800 border border-forest-700 rounded-[3px] px-4 py-3 text-sm text-white placeholder-ivory-100/40 focus:outline-none focus:border-sand-300"
                required
              />
              <Button variant="secondary" className="whitespace-nowrap font-bold">
                Subscribe &amp; Receive 15% Off
              </Button>
            </form>
          )}

          <p className="text-[11px] text-ivory-100/60 font-normal">
            We respect your quiet moments. 100% spam-free, unsubscribe anytime.
          </p>
        </div>
      </Container>
    </section>
  );
}
