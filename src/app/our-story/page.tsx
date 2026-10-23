import React from "react";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { Sparkles, MapPin, Droplets, Sparkle, ShieldCheck, Leaf, Heart } from "lucide-react";

export const metadata = {
  title: "Our Story & Botanical Wisdom | Pavishna Organic Worlds",
  description: "Learn about Pavishna Organic Worlds: handcrafted South Indian herbal bath soaps, cold-pressed scalp elixirs, wild harvesting, and 100% plastic-free artisanal rituals.",
};

export default function OurStoryPage() {
  return (
    <div className="bg-[#FAFBF9] text-[#1B1C19]">
      {/* Editorial Story Hero */}
      <section className="relative bg-gradient-to-b from-[#F2F6F3] via-[#FAFBF8] to-[#FFFFFF] py-20 md:py-28 border-b border-[#E3E8E1] overflow-hidden">
        <Container size="narrow" className="relative z-10">
          <div className="text-center space-y-6">
            
            {/* Official Logo Emblem */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-[#DCE3DB] shadow-sm mb-2">
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-emerald-900/20">
                <img src="/images/logo.jpeg" alt="Pavishna Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#0D3B2E]">
                Pavishna Organic Worlds
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#0D3B2E] leading-[1.08] tracking-tight font-bold">
              Good things, crafted slow with reverence for living plants.
            </h1>
            <p className="font-body text-base sm:text-lg text-[#374151] leading-relaxed font-normal max-w-xl mx-auto">
              We founded Pavishna Organic Worlds out of a deep reverence for South Indian botanical heritage. Modern personal care has become rushed, artificial, and flooded with petrochemical foaming agents. We returned to time-tested herbal saponification, cold-pressed scalp elixirs, and authentic botanicals.
            </p>
          </div>
        </Container>
      </section>

      {/* Sourcing & Harvest Section */}
      <Section spacing="spacious" id="sourcing">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 aspect-[4/3] rounded-2xl overflow-hidden border border-[#DCE3DB] shadow-md group bg-white">
              <img
                src="/images/Img1.jpeg"
                alt="Pavishna Vetti Veru Vetiver Roots"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/5 text-emerald-900 text-[11px] font-bold tracking-widest uppercase border border-emerald-900/15">
                Authentic Roots
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#0D3B2E] font-bold tracking-tight">
                Wild-Harvested Herbs &amp; Cold-Pressed Oils
              </h2>
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
                Our Vetiver (Vettiveru) roots, fresh Hibiscus petals, Neem leaves, and Damask roses are sourced directly from sustainable farmers in South India. We extract active botanical nectars using traditional low-temperature pressing to protect delicate phytonutrients, fatty acids, and antioxidants.
              </p>
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
                Every ingredient is harvested at peak seasonal potency. Zero chemical hexanes, zero parabens, zero artificial colors, and zero synthetic silicones.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#DCE3DB]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D3B2E]">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>South Indian Generational Cultivation</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D3B2E]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Ethical Fair Trade Partnerships</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Cold Process Soapmaking Section */}
      <Section bg="default" spacing="spacious" id="soapmaking" className="bg-[#F6F8F5] border-y border-[#E3E8E1]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/5 text-emerald-900 text-[11px] font-bold tracking-widest uppercase border border-emerald-900/15">
                4-Week Saponification
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#0D3B2E] font-bold tracking-tight">
                7 Signature Handcrafted Bath Bars
              </h2>
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
                Unlike industrial commercial detergent bars that dehydrate skin barrier lipids, Pavishna herbal bars are made with artisanal cold-process methods. We blend virgin coconut milk, pure aloe vera, and unrefined vegetable oils with fresh plant extracts.
              </p>
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
                Every batch is poured into wooden molds, cured naturally for four full weeks, and cut by hand. This gentle cure keeps 100% of the moisturizing plant glycerin locked within the bar, creating a luxurious creamy foam that leaves your skin silky, calm, and deeply nourished.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white border border-[#DCE3DB] rounded-xl shadow-2xs">
                  <h4 className="font-bold text-[#0D3B2E] text-sm">4-Week Natural Cure</h4>
                  <p className="text-xs text-[#4A5568] mt-0.5">Locks in natural soothing glycerin</p>
                </div>
                <div className="p-4 bg-white border border-[#DCE3DB] rounded-xl shadow-2xs">
                  <h4 className="font-bold text-[#0D3B2E] text-sm">Zero Palm Oil</h4>
                  <p className="text-xs text-[#4A5568] mt-0.5">Forest-safe &amp; wildlife protective</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 aspect-[4/3] rounded-2xl overflow-hidden border border-[#DCE3DB] shadow-md group bg-white">
              <img
                src="/images/img3.jpeg"
                alt="Pavishna Hibiscus Rosa Handcrafted Soap"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Sustainability Section */}
      <Section spacing="spacious" id="sustainability">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/5 text-emerald-900 text-[11px] font-bold tracking-widest uppercase border border-emerald-900/15">
                Zero Plastic
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#0D3B2E] font-bold tracking-tight">
                Plastic-Free, Biodegradable Packaging
              </h2>
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
                Every Pavishna hair oil bottle is heavy amber glass to protect active plant bio-lipids from UV degradation. Our bath soap bars are wrapped in unbleached, compostable paper bands with vegetable ink.
              </p>
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
                Our companion soy candles are housed in reusable stoneware jars intended for lifetime repurposing as desk organizers, planters, or keepsake containers.
              </p>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 aspect-[4/3] rounded-2xl overflow-hidden border border-[#DCE3DB] shadow-md group bg-white">
              <img
                src="/images/img7.jpeg"
                alt="Pavishna Rose Soap and Natural Packaging"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Values Pillars */}
      <Section bg="default" spacing="spacious" className="bg-[#FAFBF9] border-t border-[#E3E8E1]">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/5 text-emerald-900 text-[11px] font-bold tracking-widest uppercase border border-emerald-900/15 mb-2">
              Our Core Commitments
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#0D3B2E] font-bold">
              Pure Ingredients, Honest Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteConfig.values.map((v) => (
              <div key={v.title} className="bg-white p-8 rounded-2xl border border-[#DCE3DB] shadow-2xs space-y-3">
                <span className="w-10 h-10 rounded-full bg-emerald-50 text-[#0D3B2E] flex items-center justify-center font-bold text-sm">
                  ✓
                </span>
                <h3 className="font-display text-xl font-bold text-[#0D3B2E]">{v.title}</h3>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">{v.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/shop">
              <Button variant="primary" size="lg" className="rounded-full bg-[#0D3B2E] hover:bg-emerald-900 text-white px-8 py-3.5 text-xs uppercase tracking-widest font-bold shadow-md">
                Experience Pavishna Offerings
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
