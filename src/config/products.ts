import { Product } from "@/types/product";

export const mockProducts: Product[] = [
  // --------------------------------------------------------------------------
  // 1. PAVISHNA HANDCRAFTED HERBAL BATH SOAPS (PRIMARY REAL PRODUCTS)
  // --------------------------------------------------------------------------
  {
    id: "pav-soap-01",
    slug: "vetti-veru-bath-soap",
    title: "Vetti Veru Bath Soap",
    subtitle: "Authentic wild vetiver root cooling & grounding herbal bath bar",
    description: "Crafted with pure sun-dried Vetiver roots (Vettiveru) and cold-pressed coconut oil. Renowned in Ayurvedic tradition for its deeply cooling properties, this artisan bar purifies pores, calms body heat, relieves skin fatigue, and leaves a serene, long-lasting earthy woody fragrance.",
    category: "soaps",
    categoryLabel: "Artisanal Bath Soaps",
    price: 420,
    originalPrice: 480,
    badge: "Bestseller",
    featuredImage: "/images/Img1.jpeg",
    images: ["/images/Img1.jpeg"],
    inStock: true,
    rating: 5.0,
    reviewCount: 78,
    ingredientsSummary: "Cold-Pressed Virgin Coconut Oil, Hand-Harvested Vetti Veru (Vetiver Grass Root Extract), Pure Essential Oil of Vetiver, Castor Seed Oil, Vegetable Glycerin, Distilled Spring Water.",
    ritualSteps: [
      "Glide bar between moist hands or loofah to create a rich, dense herbal lather.",
      "Massage across entire body, breathing in the grounding vetiver root aroma to ease tension.",
      "Allow the lather to rest on skin for 60 seconds before rinsing with lukewarm water."
    ],
    soapSpecs: {
      soapType: "Ayurvedic Vetiver Root Herbal Bar",
      weightGrams: 125,
      curingWeeks: 4,
      skinType: ["All skin types", "Excess body heat", "Sensitive & prone to irritation"],
      keyBotanicals: ["Vetti Veru (Vetiver Root)", "Virgin Coconut Oil", "Sweet Vetiver Essential Oil"],
      scentProfile: "Deep earthy roots, freshly turned soil, and grounding woody tranquility"
    },
    variants: [
      { id: "v-single-vettiveru", name: "Single 125g Herbal Bar", price: 420, inStock: true, sku: "PV-VET-125" },
      { id: "v-trio-vettiveru", name: "Trio Ritual Pack (3 × 125g)", price: 1150, inStock: true, sku: "PV-VET-TRIO" }
    ],
    reviews: [
      {
        id: "rev-v1",
        author: "Lakshmi Narayanan",
        rating: 5,
        date: "October 18, 2026",
        title: "Pure authentic Vettiveru fragrance — amazing quality",
        comment: "This is genuine vetiver root soap, not synthetic chemical perfume! It feels incredibly cooling on the body and leaves the bathroom smelling like a serene temple garden.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "pav-soap-02",
    slug: "hibiscus-rosa-bath-soap",
    title: "Hibiscus Rosa Bath Soap",
    subtitle: "Translucent ruby complexion bar with fresh hibiscus petals & AHA glow",
    description: "An exquisite translucent crimson soap bar infused with concentrated extracts of fresh blooming Hibiscus Rosa-Sinensis flowers. Naturally rich in anthocyanins and gentle organic fruit acids, it provides mild enzymatic smoothing for luminous, supple, and radiant skin.",
    category: "soaps",
    categoryLabel: "Artisanal Bath Soaps",
    price: 450,
    originalPrice: 520,
    badge: "Bestseller",
    featuredImage: "/images/img3.jpeg",
    images: ["/images/img3.jpeg"],
    inStock: true,
    rating: 4.9,
    reviewCount: 64,
    ingredientsSummary: "Organic Hibiscus Flower Juice, Sweet Almond Oil, Natural Sucrose Base, Vegetable Glycerin, Pure Geranium & Hibiscus Essential Extracts.",
    ritualSteps: [
      "Work into a gentle rose-ruby foam with warm water.",
      "Gently smooth over face and body in circular motions.",
      "Rinse thoroughly for immediate petal-soft skin texture."
    ],
    soapSpecs: {
      soapType: "Glow & Tone Translucent Botanical Bar",
      weightGrams: 125,
      curingWeeks: 4,
      skinType: ["Dull complexion", "Uneven skin tone", "Normal to dry"],
      keyBotanicals: ["Fresh Hibiscus Rosa", "Almond Oil", "Botanical Fruit Acids"],
      scentProfile: "Delicate tart floral nectar with subtle velvety blossom notes"
    },
    variants: [
      { id: "v-single-hibiscus", name: "Single 125g Herbal Bar", price: 450, inStock: true, sku: "PV-HIB-125" }
    ]
  },
  {
    id: "pav-soap-03",
    slug: "neem-bath-soap",
    title: "Neem Bath Soap",
    subtitle: "Luminous emerald clarifying bar with cold-extracted neem leaf & seed",
    description: "Formulated with pure wild-harvested fresh neem leaves and cold-pressed neem seed oil. Esteemed for thousands of years as the ultimate botanical purifier, this bar shields against bacteria, calms breakouts, and detoxifies oily or congested skin while preserving softness.",
    category: "soaps",
    categoryLabel: "Artisanal Bath Soaps",
    price: 390,
    originalPrice: 450,
    badge: "Organic",
    featuredImage: "/images/img4.jpeg",
    images: ["/images/img4.jpeg"],
    inStock: true,
    rating: 4.9,
    reviewCount: 82,
    ingredientsSummary: "Cold-Pressed Neem Leaf Juice, Pure Neem Seed Oil, Saponified Coconut Oil, Holy Basil (Tulsi) Extract, Tea Tree Leaf Oil, Vitamin E.",
    ritualSteps: [
      "Lather generously over face, chest, and back.",
      "Allow the antibacterial neem bioactives to work for 45 seconds.",
      "Rinse with cool water to seal pores."
    ],
    soapSpecs: {
      soapType: "Clarifying Ayurvedic Herbal Bar",
      weightGrams: 125,
      curingWeeks: 4,
      skinType: ["Blemish-prone", "Oily & congested", "Sensitive & irritated"],
      keyBotanicals: ["Fresh Cold-Pressed Neem", "Holy Basil", "Tea Tree Oil"],
      scentProfile: "Crisp herbal green freshness with clarifying camphor hints"
    }
  },
  {
    id: "pav-soap-04",
    slug: "rose-bath-soap",
    title: "Rose Bath Soap",
    subtitle: "Royal Damask rose bar infused with pure rose water & petals",
    description: "Immerse in the luxury of fresh Indian Damask roses. Formulated with distilled rose hydrosol and cold-pressed rose seed oil, this creamy blushing pink bar hydrates dry patches, restores skin elasticity, and envelops the bath in an intoxicating aroma of fresh rose petals.",
    category: "soaps",
    categoryLabel: "Artisanal Bath Soaps",
    price: 480,
    originalPrice: 550,
    badge: "Bestseller",
    featuredImage: "/images/img7.jpeg",
    images: ["/images/img7.jpeg"],
    inStock: true,
    rating: 5.0,
    reviewCount: 95,
    ingredientsSummary: "Indian Damask Rose Petal Extract, Pure Distilled Rose Water, Jojoba Oil, Extra Virgin Olive Oil, Natural Vegetable Glycerin, Wild Rose Essential Oil.",
    soapSpecs: {
      soapType: "Luxury Floral Complexion Bar",
      weightGrams: 125,
      curingWeeks: 4,
      skinType: ["Dry & delicate", "Mature & dehydrated", "Normal"],
      keyBotanicals: ["Damask Rose Petals", "Pure Rose Water", "Golden Jojoba Oil"],
      scentProfile: "Rich velvety bloom of freshly plucked Indian garden roses"
    }
  },
  {
    id: "pav-soap-05",
    slug: "coconut-bath-soap",
    title: "Coconut Bath Soap",
    subtitle: "Pure virgin coconut milk & grated coconut flake moisture bar",
    description: "Crafted directly from freshly grated Kerala coconuts and cold-pressed virgin coconut milk. Extremely high in lauric acid and natural plant lipids, this gentle bar produces a thick, milky foam that deeply replenishes dry, flaking, or sensitive skin.",
    category: "soaps",
    categoryLabel: "Artisanal Bath Soaps",
    price: 380,
    badge: "Pure Moisture",
    featuredImage: "/images/img2.jpeg",
    images: ["/images/img2.jpeg"],
    inStock: true,
    rating: 4.8,
    reviewCount: 46,
    soapSpecs: {
      soapType: "Ultra-Moisturizing Cream Bar",
      weightGrams: 125,
      curingWeeks: 4,
      skinType: ["Very dry", "Sensitive", "Eczema-prone"],
      keyBotanicals: ["Virgin Coconut Milk", "Cold-Pressed Coconut Oil", "Raw Kokum Butter"],
      scentProfile: "Warm natural sweet coconut cream"
    }
  },
  {
    id: "pav-soap-06",
    slug: "aloe-vera-bath-soap",
    title: "Aloe Vera Bath Soap",
    subtitle: "Pure crystal-clear inner fillet aloe vera soothing moisture bar",
    description: "Packed with over 75 active phytonutrients and glycoproteins from hand-filleted fresh organic Aloe Vera leaves. Provides intense cellular hydration, accelerates skin repair, and calms redness from sun exposure and pollution.",
    category: "soaps",
    categoryLabel: "Artisanal Bath Soaps",
    price: 390,
    badge: "Deep Hydration",
    featuredImage: "/images/img6.jpeg",
    images: ["/images/img6.jpeg"],
    inStock: true,
    rating: 4.9,
    reviewCount: 51,
    soapSpecs: {
      soapType: "Soothing Botanical Crystal Bar",
      weightGrams: 125,
      curingWeeks: 4,
      skinType: ["Sun-damaged", "Dehydrated", "Sensitive"],
      keyBotanicals: ["Inner-Leaf Aloe Vera Gel", "Cucumber Water", "Virgin Olive Oil"],
      scentProfile: "Crisp clean aloe vera with cooling cucumber notes"
    }
  },
  {
    id: "pav-soap-07",
    slug: "orange-bath-soap",
    title: "Orange Bath Soap",
    subtitle: "Sun-drenched citrus radiance bar with pure orange peel & Vitamin C",
    description: "Brimming with cold-pressed orange peel oil and bio-flavonoids. Uplifts morning energy, sweeps away dull surface cells, and leaves skin with a bright, luminous, sun-kissed natural radiance.",
    category: "soaps",
    categoryLabel: "Artisanal Bath Soaps",
    price: 420,
    badge: "Vitamin C Boost",
    featuredImage: "/images/img5.jpeg",
    images: ["/images/img5.jpeg"],
    inStock: true,
    rating: 4.8,
    reviewCount: 39,
    soapSpecs: {
      soapType: "Energizing Citrus Complexion Bar",
      weightGrams: 125,
      curingWeeks: 4,
      skinType: ["Dull & tired", "Normal to oily", "Uneven texture"],
      keyBotanicals: ["Sweet Orange Peel Oil", "Mandarin Zest", "Natural Vitamin C"],
      scentProfile: "Bright juicy sun-ripened orange with sparkling citrus rind"
    }
  },

  // --------------------------------------------------------------------------
  // 2. PAVISHNA BOTANICAL HAIR & SCALP CARE
  // --------------------------------------------------------------------------
  {
    id: "pav-hair-01",
    slug: "herbal-hair-scalp-oil",
    title: "Pavishna Botanical Hair & Scalp Oil",
    subtitle: "Cold-pressed Ayurvedic root nectar with Rosemary, Bhringraj & Vetiver",
    description: "A restorative hair and scalp oil formulated with traditional Ayurvedic botanical roots. Combines wild Bhringraj, French Rosemary, Vettiveru roots, and Golden Amla to nourish the hair follicles, stop seasonal shedding, eliminate dandruff, and stimulate thick, glossy hair growth.",
    category: "hair-care",
    categoryLabel: "Scalp & Hair Care",
    price: 1250,
    originalPrice: 1450,
    badge: "Bestseller",
    featuredImage: "https://images.unsplash.com/photo-1608248597359-5613521b38f8?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1608248597359-5613521b38f8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80"
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 88,
    ingredientsSummary: "Cold-Pressed Sesame Oil, Virgin Coconut Oil, Bhringraj, Rosemary Leaf Extract, Vetti Veru Roots, Amla, Brahmi, Castor Seed Oil.",
    ritualSteps: [
      "Warm 2–3 pipettes between palms and apply directly to scalp roots.",
      "Massage thoroughly with circular fingertip pressure for 5–10 minutes.",
      "Leave on for at least 1 hour or overnight before cleansing with Pavishna Vetti Veru or Coconut Soap."
    ],
    hairOilSpecs: {
      hairType: ["All hair textures", "Thinning & shedding", "Dry & flaky scalp"],
      keyBenefits: ["Stimulates follicular microcirculation", "Fortifies hair roots", "Restores mirror-like shine"],
      volumeMl: 100,
      organicIngredients: ["Organic Rosemary", "Wild Bhringraj", "Vetti Veru Roots", "Raw Amla"],
      scentProfile: "Crisp herbal rosemary with deep earthy vetiver undertones"
    },
    variants: [
      { id: "v-oil-100ml", name: "100ml Glass Dropper Bottle", price: 1250, inStock: true, sku: "PV-OIL-100" },
      { id: "v-oil-200ml", name: "200ml Eco Value Refill", price: 2150, inStock: true, sku: "PV-OIL-200" }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. CANDLES (OPTION)
  // --------------------------------------------------------------------------
  {
    id: "pav-candle-01",
    slug: "wild-jasmine-vetiver-soy-candle",
    title: "Wild Jasmine & Smoked Vetiver Candle",
    subtitle: "Hand-poured coconut-soy candle in amber apothecary glass (Optional Ritual)",
    description: "An evocative evening companion candle. Hand-poured with clean-burning plant waxes, unbleached cotton wick, and pure extracts of crushed jasmine and smoked vetiver roots.",
    category: "candles",
    categoryLabel: "Artisan Candles (Option)",
    price: 1650,
    originalPrice: 1950,
    badge: "Hand-poured",
    featuredImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80",
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80"],
    inStock: true,
    rating: 4.8,
    reviewCount: 37,
    candleSpecs: {
      waxType: "100% Coconut Soy Wax Blend",
      burnTimeHours: 55,
      scentFamily: "Earthy Floral",
      topNotes: ["Crushed Jasmine", "Bergamot"],
      heartNotes: ["Smoked Vetiver", "Wild Cypress"],
      baseNotes: ["Aged Cedarwood", "Amber"],
      weightGrams: 260
    }
  },

  // --------------------------------------------------------------------------
  // 4. GIFT HAMPERS
  // --------------------------------------------------------------------------
  {
    id: "pav-gift-01",
    slug: "pavishna-royal-bath-hamper",
    title: "Pavishna Royal Heritage Bath Hamper",
    subtitle: "Complete luxury chest with 4 Handcrafted Soaps (Vettiveru, Rose, Neem, Hibiscus) & Hair Oil",
    description: "The ultimate botanical luxury gift. Presented in an eco-crafted keepsake wooden gift chest. Includes full-size Vetti Veru Soap, Rose Bath Soap, Neem Soap, Hibiscus Rosa Soap, and Pavishna Botanical Hair & Scalp Oil (100ml).",
    category: "gifting",
    categoryLabel: "Royal Gift Hampers",
    price: 2450,
    originalPrice: 2850,
    badge: "Bestseller",
    featuredImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80",
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80"],
    inStock: true,
    rating: 5.0,
    reviewCount: 42
  },

  // --------------------------------------------------------------------------
  // 5. STITCH BOTANICAL EDITORIAL SIGNATURE COLLECTION
  // --------------------------------------------------------------------------
  {
    id: "stitch-hair-01",
    slug: "botanical-scalp-elixir",
    title: "Botanical Scalp Elixir",
    subtitle: "Rosemary & Amla Cold-Infused Follicle Nectar (100ml)",
    description: "An intensive cold-macerated elixir blending high-elevation Kashmir Rosemary with wild Satpura Amla berries and virgin argan nectar. Formulated to awaken dormant follicles, soothe inflamed roots, and deliver deep micro-circulation without occlusive buildup.",
    category: "hair-care",
    categoryLabel: "Scalp Elixirs",
    price: 2800,
    originalPrice: 3100,
    badge: "Bestseller",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqlAOtGNk3tJ2FxpSmh4JI2aNOxXmiQDqRCk_jd_Uq-ztlPcT-uboJ_rnDnIdqh2x_4N-SReJu6QZxakIHhb5VNtA2rhaLaAPfgNLTk_ulUzL-wVdiDd-Cqcv8RXJcbvF3ML54NPaElJKPyq3Q9xrMQOaAzghw7MSK3STCQAxFWISQFFOlibPUL2yEnGDKG4Tew19Rld8nVuUSi6s-wx3Le3ecJKBV5vigTBnQe5NgFaO1O1vVIj1-",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqlAOtGNk3tJ2FxpSmh4JI2aNOxXmiQDqRCk_jd_Uq-ztlPcT-uboJ_rnDnIdqh2x_4N-SReJu6QZxakIHhb5VNtA2rhaLaAPfgNLTk_ulUzL-wVdiDd-Cqcv8RXJcbvF3ML54NPaElJKPyq3Q9xrMQOaAzghw7MSK3STCQAxFWISQFFOlibPUL2yEnGDKG4Tew19Rld8nVuUSi6s-wx3Le3ecJKBV5vigTBnQe5NgFaO1O1vVIj1-"
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 142,
    ingredientsSummary: "Cold-Pressed Rosemary Cineole, Wild Indian Gooseberry (Amla) Extract, Moroccan Argan Oil, Cold-Pressed Castor Seed, Brahmi Root.",
    ritualSteps: [
      "Dispense 3–4 drops directly along parted hair sections onto clean scalp.",
      "Massage firmly in circular motions with fingertips for 5 minutes.",
      "Leave on for 45 minutes or overnight before gentle cleansing."
    ],
    variants: [
      { id: "v-elixir-100", name: "100ml Dropper Bottle", price: 2800, inStock: true, sku: "ST-ELX-100" },
      { id: "v-elixir-refill", name: "200ml Eco Refill Bottle", price: 4600, inStock: true, sku: "ST-ELX-200" }
    ]
  },
  {
    id: "stitch-hair-02",
    slug: "camellia-honey-repair-masque",
    title: "Camellia & Wild Mountain Honey Deep Repair Masque",
    subtitle: "Intensive Biomimetic Keratin Treatment & Moisture Butter (200g)",
    description: "An ultra-nourishing hair butter masque whipped with cold-pressed Camellia Oleifera seed oil, raw high-altitude wildflower honey from Himachal cooperatives, and hydrolyzed micro-oat peptides. Rebuilds split cuticle scales, restores softness, and locks in mirror-like luminosity.",
    category: "hair-care",
    categoryLabel: "Conditioning Butters",
    price: 3200,
    originalPrice: 3600,
    badge: "Intensive Care",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrhJRD-WPQ19gytjiWWn66PERaxqUyjv021TRXPfY4f3Kjzkt8gn_BgmPS1pnM0Qc0rm0lT4Y6VfijLjSvAU_kAEO2yVdGWTY9WiTELicTdZJ6pm4EpBihz5-9r_pswbhEYJDRJEwykIuj_Sjdk8v5QQQ7NKBTctHiuHswdoCfNPHuMSvllwsYMnJp_OPUjeIFAUi9tCIxy9V0JgdlU1lN9PGlStwKsI4a8OLgSuQowU3GBdgqR1yQ",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCrhJRD-WPQ19gytjiWWn66PERaxqUyjv021TRXPfY4f3Kjzkt8gn_BgmPS1pnM0Qc0rm0lT4Y6VfijLjSvAU_kAEO2yVdGWTY9WiTELicTdZJ6pm4EpBihz5-9r_pswbhEYJDRJEwykIuj_Sjdk8v5QQQ7NKBTctHiuHswdoCfNPHuMSvllwsYMnJp_OPUjeIFAUi9tCIxy9V0JgdlU1lN9PGlStwKsI4a8OLgSuQowU3GBdgqR1yQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLvflG30Qfh1TuHv5yRZoL1a4X2_Ik_1p1QNyd3jolTo5VTYarqCxPc1A5kxfWdwko-HQgOC1BlBLycVWSPkCwWy4jfjp6Lly5NaAxwRyzlK7d-kiUNBxSKGnQToVZWBTwv8-LjDoU_UKysBikPv8di67VNiGMf0Bzyj1XuzYtad0JfrzMOuz3Qb0EP252us0fgVMCeRk5L79lMJS835ZxZKhdC8FMYdCrITvrV7hdI_BCcYgiFjG3",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0axqaM0xQezc7pCyKfEX_GNr7wv9bP0a229RMk39E1_w_nckvQTTRn5QYLjgp5Yqv7gHbziWMwijHdB_3k-qg-pIVUaFHy3cMO97uByy51N-O-qrAyX1lZTPWxRqmxFYOhEN_MG0enyzebhVtWsd2E_2myo3kouuk1hLDZEgYxPbSCxFqit1gIZecr5-lezoptmasN8WFbeu3Bc82Zgh6hRqnesgh-u1cplTsxEFRGm23KnVyghD6",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkiekRKS5O8gIssc9SXRJCmf19aTFnooogMxaP1EsEDX7iQlfn_IVwxnozVtDH9iasM-GVpJacZjxFQC383kcAQa0Uwthhg_BeLLHqpJdexfSQt-MQDMEnblYkwBAPDMbitHoeXxsjury8EjWecwuCsEUhoU1tA7mjIGKK2ta3vsTJctOGrjszRQZ3fmOVjURKzg7unBnqT1hrSuM87Rmi1293t9GuZEbvT-GvBe6DB6RmsSwaqLbd"
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 98,
    ingredientsSummary: "Cold-Pressed Camellia Oleifera Seed Oil, Raw Himachal Wildflower Honey, Hydrolyzed Oat Peptides, Cold-Pressed Nilotica Shea Butter, Sandalwood Extract.",
    ritualSteps: [
      "Gently press excess moisture from washed strands with a soft linen towel.",
      "Warm a chestnut-sized dollop between palms until it melts into a spreadable nectar.",
      "Comb through mid-lengths to ends with wide-tooth wooden comb. Dwell for 15 minutes before rinsing."
    ],
    variants: [
      { id: "v-masque-jar", name: "Artisan Ceramic Jar 200g", price: 3200, inStock: true, sku: "ST-MSQ-JAR" },
      { id: "v-masque-pouch", name: "Compostable Refill Pouch 200g", price: 2600, inStock: true, sku: "ST-MSQ-PCH" },
      { id: "v-masque-duo", name: "Duo Ritual Set (Jar + Refill)", price: 5400, inStock: true, sku: "ST-MSQ-DUO" }
    ],
    reviews: [
      {
        id: "rev-m1",
        author: "Ananya Deshmukh",
        rating: 5,
        date: "October 20, 2026",
        title: "Transcendent hair repair — feels like raw luxury silk",
        comment: "The texture is unmatched. My dry ends were instantly smoothed after just one application and the scent of wild honey and camellia is mesmerizing.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "stitch-hair-03",
    slug: "white-tea-aloe-tonic-mist",
    title: "White Tea & Aloe Tonic Mist",
    subtitle: "Lightweight pH-Balancing Cuticle Hydrosol (150ml)",
    description: "An ethereal botanical mist combining Darjeeling silver needle white tea antioxidants with fresh filleted inner-leaf aloe vera hydrosol. Gently seals the acidic hair mantle, neutralizes hard water minerals, and imparts weightless humidity defense.",
    category: "hair-care",
    categoryLabel: "Nourishing Mists",
    price: 2100,
    originalPrice: 2350,
    badge: "Hydrating",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB88o0CVbQnHBJgXY-_VNa8AXsV_gNhhbvlcWo_kr30qgn6keRF9J6pfcWXm0BXz_SBHduxkPSfaAfmIYTolIqAlsECL63G5AdY3g6igPdYG1PPRs9p1-9Yxurbke2WEhXP0PjoqEqlt1EkcuLeBFQUwBv0oIbR-LnDem0lc9F1KP8rPIKgZ0wm6mrtEXRvDAHPnnjCzyzQ-p3v7W7Uei_3IckOnvijthayjuZgbVKXn4Bk9Zorb2J6",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB88o0CVbQnHBJgXY-_VNa8AXsV_gNhhbvlcWo_kr30qgn6keRF9J6pfcWXm0BXz_SBHduxkPSfaAfmIYTolIqAlsECL63G5AdY3g6igPdYG1PPRs9p1-9Yxurbke2WEhXP0PjoqEqlt1EkcuLeBFQUwBv0oIbR-LnDem0lc9F1KP8rPIKgZ0wm6mrtEXRvDAHPnnjCzyzQ-p3v7W7Uei_3IckOnvijthayjuZgbVKXn4Bk9Zorb2J6"
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 64
  },
  {
    id: "stitch-hair-04",
    slug: "nocturnal-scalp-renewal-drops",
    title: "Nocturnal Scalp Renewal Drops",
    subtitle: "Overnight Peptide & Bhringraj Cellular Lipid (50ml)",
    description: "A restorative overnight cellular lipid serum powered by bioactive peptides, bio-fermented Bhringraj root, and cold-pressed black castor seed. Works in rhythm with nocturnal regenerative cycles to stimulate root anchor proteins and calm stress-related hair thinning.",
    category: "hair-care",
    categoryLabel: "Scalp Elixirs",
    price: 3100,
    originalPrice: 3500,
    badge: "Overnight Care",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuANaRo-ySPekmpyINHjGyo9SYn_Y5Js1cusYo2xYN6M6uPq1bhdUWhsMF5hrxZ33GPlgf9bmOigGhc78ZQBcSxEy04CnXNIMaVWx1YprfiNtA7_xAUUwgU7YYB121dsrKD5ojqhDorqCGq9nnVnBKC7w4FdVObgwzHsuxK1W7Yu_zeir3yOiffaBqY_cwBNeXBdAOLXgyW-LEWsV8nTlrjQgPd9N9Ky23irdD0eJOPyw7kGrU7w_KAJ",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANaRo-ySPekmpyINHjGyo9SYn_Y5Js1cusYo2xYN6M6uPq1bhdUWhsMF5hrxZ33GPlgf9bmOigGhc78ZQBcSxEy04CnXNIMaVWx1YprfiNtA7_xAUUwgU7YYB121dsrKD5ojqhDorqCGq9nnVnBKC7w4FdVObgwzHsuxK1W7Yu_zeir3yOiffaBqY_cwBNeXBdAOLXgyW-LEWsV8nTlrjQgPd9N9Ky23irdD0eJOPyw7kGrU7w_KAJ"
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 118
  },
  {
    id: "stitch-hair-05",
    slug: "hand-carved-walnut-comb",
    title: "Hand Carved Walnut Comb",
    subtitle: "Static-Free Wide Tooth Scalp Acupressure Tool",
    description: "Individually hand-carved from seasoned, fallen dark walnut wood and oiled with organic camellia seed lipid. The rounded, seamless tines glide effortlessly through wet or dry hair without snagging, gently stimulating acupressure points along the scalp.",
    category: "hair-care",
    categoryLabel: "Wooden Apothecary Tools",
    price: 1600,
    badge: "Handcrafted",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBecf6yU05it5lG6Iv_IM970Sw45EjggJPxwx4y2lKrP3lpFnpYyX_qhEwv30zMKshNPMvKaWSUKP1CKWod-weFJNPCi021j4sJ4dssW6hXVR-KKT-HAK5APcUPzPiCkoq2x6bsJ9Bt2iIU_iLmuLySldG-xb47vIb2Hgl5i_-c2Yus9WSdbYqQbI1YULLbBUJ1uEg0JiUqdn-ptLK2jHgN35Aq93LE6nEFtESwvBKrD6-eV91ABDGv",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBecf6yU05it5lG6Iv_IM970Sw45EjggJPxwx4y2lKrP3lpFnpYyX_qhEwv30zMKshNPMvKaWSUKP1CKWod-weFJNPCi021j4sJ4dssW6hXVR-KKT-HAK5APcUPzPiCkoq2x6bsJ9Bt2iIU_iLmuLySldG-xb47vIb2Hgl5i_-c2Yus9WSdbYqQbI1YULLbBUJ1uEg0JiUqdn-ptLK2jHgN35Aq93LE6nEFtESwvBKrD6-eV91ABDGv"
    ],
    inStock: true,
    rating: 5.0,
    reviewCount: 87
  },
  {
    id: "stitch-hair-06",
    slug: "shea-rosemary-split-end-salve",
    title: "Shea & Rosemary Split End Salve",
    subtitle: "Heat-Defending Botanical Sealing Balm (60g)",
    description: "A concentrated, solid conditioning butter formulated with raw unrefined nilotica shea, rosemary cineole, and golden beeswax. Melts upon fingertip contact to seal frayed end fibers, prevent mechanical breakage, and lock in lasting moisture.",
    category: "hair-care",
    categoryLabel: "Conditioning Butters",
    price: 2400,
    badge: "Solid Salve",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYYrEZs_DUgfkJ2XOZhOAbZwEWyyOqJKJuvBH1TlPMtXbx_IevZoL-AzY5AH1VNQPNI3NQ3seBo7ehKe1e9hdMWCTmGcS4Ul-nzH2rGbVtdnYuVhM4RiRbNm6x4VRFkOkfm2RWNRgOvjlAZROo67EFZyLCRyD6bE5bgJTIDmLZvJqSkauMbqAwkp0skUiS3G-7qW4bsXiMPePIQNmJtaUCn_YLMPP3n2ecZTQCU4IAvxn1Cb94NmCv",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYYrEZs_DUgfkJ2XOZhOAbZwEWyyOqJKJuvBH1TlPMtXbx_IevZoL-AzY5AH1VNQPNI3NQ3seBo7ehKe1e9hdMWCTmGcS4Ul-nzH2rGbVtdnYuVhM4RiRbNm6x4VRFkOkfm2RWNRgOvjlAZROo67EFZyLCRyD6bE5bgJTIDmLZvJqSkauMbqAwkp0skUiS3G-7qW4bsXiMPePIQNmJtaUCn_YLMPP3n2ecZTQCU4IAvxn1Cb94NmCv"
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 51
  },
  {
    id: "stitch-candle-01",
    slug: "santal-hinoki-candle",
    title: "Santal & Hinoki Candle",
    subtitle: "Hand-poured clay vessel, 55 hr burn with sacred cedar smoke",
    description: "Slow-poured into tactile wheel-thrown terracotta stoneware. Infused with pure Japanese hinoki cypress, aged sandalwood, and warm resins for grounding meditation spaces.",
    category: "candles",
    categoryLabel: "Ceramic Candle",
    price: 2200,
    badge: "Bestseller",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVE3MAXEB9dR5XMFgbnIqLFQ-_951m2FOR5Zj3twDW4V2Tlz5sBGHjwSHmTslDVxz2zIqruG_KzhJvhOzd8BauqrTK6bcz95_UhvjKJ70lSeEFYike-ZsrK0eOxLZE11NSyVpgUYa-lFS1Z4wr05gnirMT1bSgzX13CIEAggrYhUxZNB2valWTUfHITwsVXnlAWrTwwVVuUz6mdD0ooGOXuCotEZiiXqIWcE1513xp-guU6g77QAmF",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDVE3MAXEB9dR5XMFgbnIqLFQ-_951m2FOR5Zj3twDW4V2Tlz5sBGHjwSHmTslDVxz2zIqruG_KzhJvhOzd8BauqrTK6bcz95_UhvjKJ70lSeEFYike-ZsrK0eOxLZE11NSyVpgUYa-lFS1Z4wr05gnirMT1bSgzX13CIEAggrYhUxZNB2valWTUfHITwsVXnlAWrTwwVVuUz6mdD0ooGOXuCotEZiiXqIWcE1513xp-guU6g77QAmF"],
    inStock: true,
    rating: 4.9,
    reviewCount: 62
  },
  {
    id: "stitch-candle-02",
    slug: "dusk-olive-grove-candle",
    title: "Dusk Olive Grove Candle",
    subtitle: "Green olive leaf, ripe crushed fig & warm dry amber resin",
    description: "A nuanced Mediterranean harvest blend in a glazed sage-green stoneware mug. Evokes golden dusk hours walking through ancient olive and fig groves.",
    category: "candles",
    categoryLabel: "Seasonal Edition",
    price: 2400,
    badge: "Autumn Batch",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmS3ZXH_pBJcWcPmTOXowDKZy37izJ2gAUOFN_BYZlfFTpGNW-o0cThF47lQpqn846_icZ6QXWK7-sRU-EFr-W1OzuaydYUnWVS61FUkdUBTPvI0o6enBjEjgLYbQdOOlSn2l8p_jZfKBF1VhZjYwcKJ6ARh7YNCUI6vGnwypdAzf3Va1XGD-cwxJu8QPnpaE8F-9hQCu5SP1bHJ15K8hgOCdWZWG93M3M9_6HTnh-tvlEpCP0HDXc",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBmS3ZXH_pBJcWcPmTOXowDKZy37izJ2gAUOFN_BYZlfFTpGNW-o0cThF47lQpqn846_icZ6QXWK7-sRU-EFr-W1OzuaydYUnWVS61FUkdUBTPvI0o6enBjEjgLYbQdOOlSn2l8p_jZfKBF1VhZjYwcKJ6ARh7YNCUI6vGnwypdAzf3Va1XGD-cwxJu8QPnpaE8F-9hQCu5SP1bHJ15K8hgOCdWZWG93M3M9_6HTnh-tvlEpCP0HDXc"],
    inStock: true,
    rating: 4.8,
    reviewCount: 45
  },
  {
    id: "stitch-crate-01",
    slug: "solstice-crate-roots",
    title: "Solstice Crate: Roots Keepsake Box",
    subtitle: "Archival cedar presentation box with candle, tonic & carved comb",
    description: "The complete evening restorative collection encased inside an artisan-crafted solid cedarwood box with botanical cotton binding.",
    category: "gifting",
    categoryLabel: "Curated Crate",
    price: 6800,
    badge: "Keepsake Set",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv1x1xG1hZy2Xc17KIX8CXRo-7pmWxWVk-mRYeoC4KPN7ka5UBevINoCtu35nCPvGhhWHB7jvc1Vk2qboSlUJzqucXmb6zbgpJ_lSkURZO1r1izy5RyPwanEAQTaD3hr404s7Rgpxnpj3sCTG4zT1909Uzm8RyymE5KDci9PSWVkUYd8BYUQJA_koRLcLcqn6WQ8DJFtIEMTNPjbbY3X2QxFyy8KWgNZbTtv4OMAi6LVpM1TsZMdC3",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDv1x1xG1hZy2Xc17KIX8CXRo-7pmWxWVk-mRYeoC4KPN7ka5UBevINoCtu35nCPvGhhWHB7jvc1Vk2qboSlUJzqucXmb6zbgpJ_lSkURZO1r1izy5RyPwanEAQTaD3hr404s7Rgpxnpj3sCTG4zT1909Uzm8RyymE5KDci9PSWVkUYd8BYUQJA_koRLcLcqn6WQ8DJFtIEMTNPjbbY3X2QxFyy8KWgNZbTtv4OMAi6LVpM1TsZMdC3"],
    inStock: true,
    rating: 5.0,
    reviewCount: 29
  }
];

export const productCategories = [
  {
    id: "soaps",
    name: "Handcrafted Herbal Soaps",
    slug: "soaps",
    description: "Pure handcrafted bath soaps made with authentic botanicals: Vetti Veru, Hibiscus Rosa, Neem, Damask Rose, Coconut, Aloe Vera, and Orange.",
    image: "/images/Img1.jpeg",
    itemCount: 7
  },
  {
    id: "hair-care",
    name: "Botanical Hair & Scalp Care",
    slug: "hair-care",
    description: "Cold-pressed Ayurvedic root oils, rosemary density nectars, and vetiver-infused scalp formulas for thick, lustrous hair.",
    image: "https://images.unsplash.com/photo-1608248597359-5613521b38f8?auto=format&fit=crop&w=800&q=80",
    itemCount: 4
  },
  {
    id: "candles",
    name: "Artisan Botanical Candles (Option)",
    slug: "candles",
    description: "Clean-burning coconut & soy wax candles hand-poured into keepsake amber glass for optional evening relaxation rituals.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    itemCount: 3
  },
  {
    id: "gifting",
    name: "Royal Bath Gift Hampers",
    slug: "gifting",
    description: "Exquisite keepsake gift chests packed with assorted herbal bath soaps and cold-pressed hair care oils.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    itemCount: 3
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return mockProducts;
  return mockProducts.filter(p => p.category === category);
}
