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
