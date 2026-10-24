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

      {/* Farm-to-Ritual Journey Flow Graph (Requested Connected Flow) */}
      <Section bg="default" spacing="spacious" className="bg-[#FAFBF9] border-t border-[#E3E8E1] relative overflow-hidden">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#263D32]/8 text-[#263D32] text-[11px] font-bold tracking-widest uppercase border border-[#263D32]/15 mb-2">
              விவசாய நிலத்திலிருந்து உங்கள் கைகளுக்கு • FARM TO SACRED RITUAL
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1A1C18] font-normal">
              Pure Ingredients, <span className="italic font-display text-[#82947B]">Honest Craft</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#424844] mt-2 max-w-lg mx-auto">
              Our 4-step botanical journey preserving living phytosterols and authentic Dravidian healing wisdom.
            </p>
          </div>

          {/* Connected 4-Step Journey Flow */}
          <div className="relative">
            {/* Desktop Connecting Flow Line */}
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-[#82947B]/20 via-[#263D32]/30 to-[#82947B]/20 -translate-y-6 z-0 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                {
                  step: "01",
                  tamilStep: "பாரம்பரிய உழவு",
                  title: "Regenerative Farming",
                  description: "Pesticide-free cultivation of Vetiver, Neem, Damask Roses, and Hibiscus in South Indian fertile soils.",
                  icon: "🌱",
                },
                {
                  step: "02",
                  tamilStep: "மரச்செக்கு பிழிதல்",
                  title: "Wood-Pressed Extraction",
                  description: "Cold mechanical extraction in Vaagai wood presses without friction heat to protect live bio-lipids.",
                  icon: "🪵",
                },
                {
                  step: "03",
                  tamilStep: "40 நாள் மூலிகை ஊறல்",
                  title: "40-Day Solar Infusion",
                  description: "Slow solar decoction in terracotta urns, allowing potent roots to naturally saturate base carrier oils.",
                  icon: "☀️",
                },
                {
                  step: "04",
                  tamilStep: "பூஜ்ஜிய பிளாஸ்டிக்",
                  title: "100% Plastic-Free",
                  description: "Carefully wrapped in plant-fiber kraft, sealed in glass apothecary vessels, and despatched sustainably.",
                  icon: "📦",
                },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  className="group bg-white rounded-3xl p-6 sm:p-7 border border-[#E3DDD1] shadow-2xs hover:shadow-xl hover:shadow-[#263D32]/10 hover:border-[#263D32]/40 hover:-translate-y-2 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Step Badge & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-10 h-10 rounded-2xl bg-[#EAF0E6] text-[#263D32] flex items-center justify-center font-bold text-xs group-hover:scale-110 group-hover:bg-[#263D32] group-hover:text-white transition-all duration-300 shadow-xs">
                        {item.step}
                      </span>
                      <span className="text-xl">{item.icon}</span>
                    </div>

                    {/* Tamil Title */}
                    <span className="text-[11px] font-semibold text-[#82947B] block mb-0.5">
                      {item.tamilStep}
                    </span>

                    {/* English Title */}
                    <h3 className="font-display text-lg text-[#1A1C18] font-medium mb-2 group-hover:text-[#263D32] transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#525A55] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Flow Indicator on Mobile/Tablet */}
                  <div className="pt-4 mt-4 border-t border-[#ECE7DC] flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#82947B]">
                    <span>Step {item.step} of 04</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/shop">
              <Button variant="primary" size="lg" className="rounded-full bg-[#263D32] hover:bg-[#1A2C23] text-white px-8 py-3.5 text-xs uppercase tracking-widest font-bold shadow-md hover:scale-102 transition-transform cursor-pointer">
                Experience Pavishna Offerings
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
