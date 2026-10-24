"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Sparkles, Heart } from "lucide-react";

export function StitchSanctuaryRegimen() {
  return (
    <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full rounded-3xl bg-[#183427] text-[#FAFBF9] p-7 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden border border-[#2B4B3B]"
      >
        {/* Ambient Warm Golden & Emerald Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#82947B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#0E2319]/60 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 relative z-10">
          
          {/* Left Column: Arched Tamil Sanctuary Visual Scene */}
          <div className="w-full lg:w-5/12 flex flex-col gap-3.5">
            <div className="relative aspect-[4/5] rounded-t-[3.5rem] sm:rounded-t-[4.5rem] rounded-b-2xl overflow-hidden bg-black/30 shadow-2xl border border-white/15 group">
              <img
                src="/images/tamil-hair-ritual.jpg"
                alt="South Indian Tamil traditional botanical hair ritual in heritage courtyard with brass uruli and fresh flowers"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A2E3BE] mb-1">
                  பாரம்பரிய தைல ஸ்தானம் • HERITAGE SANCTUARY
                </span>
                <p className="font-display text-base sm:text-lg text-white italic font-normal leading-snug">
                  “இயற்கை மூலிகைகளின் நறுமணத்தில் மன அமைதியும், வேர்களின் வலிமையும்.”
                </p>
                <p className="text-[11px] text-white/90 mt-1 font-body">
                  An ancestral South Indian ritual transforming daily haircare into a calming, grounding retreat.
                </p>
              </div>
            </div>

            {/* Ritual Metadata */}
            <div className="flex items-center justify-between px-2 text-[#E2ECE5] text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A2E3BE]" />
                நேரம்: 15–20 நிமிடங்கள் (15–20 MINS)
              </span>
              <span>வாரம் ஒருமுறை (ONCE WEEKLY)</span>
            </div>
          </div>

          {/* Right Column: 3 Sequential Steps in Tamil & English */}
          <div className="w-full lg:w-7/12 flex flex-col gap-5">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#244635] border border-[#3C6450]">
                <Sparkles className="w-3 h-3 text-[#A2E3BE]" />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#A2E3BE]">
                  தமிழ்நாட்டு பாரம்பரிய முறை • SUGGESTED REGIMEN
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-medium leading-tight">
                மூலிகை எண்ணெயைப் பயன்படுத்தும் முறை
              </h2>
              <p className="text-xs sm:text-sm text-[#E2ECE5] mt-2 leading-relaxed font-normal">
                உடலின் இயல்பான வெப்பம் மூலிகைகளின் சத்துக்களை மயிர்க்கால்களுக்குள் ஆழமாகச் செலுத்த உதவுகிறது.
              </p>
            </div>

            {/* 3 Step Cards */}
            <div className="flex flex-col gap-3.5 mt-1">
              
              {/* Step 1 */}
              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-sm hover:bg-white/[0.14] hover:border-white/25 transition-all duration-300">
                <span className="w-8 h-8 rounded-full bg-[#A2E3BE] text-[#0A2016] flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-xs">
                  01
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-[14.5px] font-bold text-white tracking-wide">
                      வெதுவெதுப்பான எண்ணெய் தயாரிப்பு
                    </h4>
                    <span className="text-[11.5px] text-[#A2E3BE] font-medium">
                      (Warm Palm Activation)
                    </span>
                  </div>
                  <p className="text-xs sm:text-[12.5px] text-[#E2ECE5] mt-1.5 leading-relaxed font-normal">
                    2–3 பம்ப் பவிஷ்ணா மூலிகை எண்ணெயை உள்ளங்கைகளில் தேய்த்து மிதமான சூடேற்றி, வெட்டிவேர் மற்றும் மூலிகைகளின் நறுமணத்தை நுகர்ந்து தளர்வடையுங்கள்.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-sm hover:bg-white/[0.14] hover:border-white/25 transition-all duration-300">
                <span className="w-8 h-8 rounded-full bg-[#A2E3BE] text-[#0A2016] flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-xs">
                  02
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-[14.5px] font-bold text-white tracking-wide">
                      வர்ம புள்ளி மசாஜ்
                    </h4>
                    <span className="text-[11.5px] text-[#A2E3BE] font-medium">
                      (Marma Scalp Stimulation)
                    </span>
                  </div>
                  <p className="text-xs sm:text-[12.5px] text-[#E2ECE5] mt-1.5 leading-relaxed font-normal">
                    உச்சந்தலை மற்றும் பக்கவாட்டுப் பகுதிகளில் விரல்களால் வட்ட வடிவில் மென்மையாக மசாஜ் செய்து ரத்த ஓட்டத்தைத் தூண்டுங்கள்.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-sm hover:bg-white/[0.14] hover:border-white/25 transition-all duration-300">
                <span className="w-8 h-8 rounded-full bg-[#A2E3BE] text-[#0A2016] flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-xs">
                  03
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-[14.5px] font-bold text-white tracking-wide">
                      மூலிகை ஊறல் &amp; தூய குளியல்
                    </h4>
                    <span className="text-[11.5px] text-[#A2E3BE] font-medium">
                      (Herbal Dwell &amp; Gentle Wash)
                    </span>
                  </div>
                  <p className="text-xs sm:text-[12.5px] text-[#E2ECE5] mt-1.5 leading-relaxed font-normal">
                    15–20 நிமிடங்கள் மூலிகைச் சத்துக்கள் வேர்களில் இறங்க விட்டு, பவிஷ்ணா வெட்டிவேர் அல்லது பன்னீர் ரோஜா மூலிகை சோப்பால் அலசவும்.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#E2ECE5] font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A2E3BE]" />
                <span>பாரம்பரிய மரச்செக்கு தயாரிப்பு (100% Cold Wood-Pressed)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A2E3BE]" />
                <span>நச்சு ரசாயனங்கள் அற்றது (Zero Synthetic Chemicals)</span>
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </section>
  );
}
