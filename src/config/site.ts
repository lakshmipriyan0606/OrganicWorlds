export const siteConfig = {
  name: "Pavishna Organic Worlds",
  shortName: "Pavishna",
  tagline: "Pure Botanical Rituals & Artisanal Soaps",
  logo: "/images/logo.jpeg",
  description: "Pavishna Organic Worlds — Handcrafted herbal bath soaps, cold-pressed scalp hair oils, and pure organic essentials crafted from nature without synthetic chemicals.",
  url: "https://pavishnaorganicworlds.com",
  announcement: {
    enabled: true,
    text: "Welcome to Pavishna Organic Worlds • Complimentary botanical soap sample with orders above ₹1,499 • Free shipping across India",
  },
  freeShippingThreshold: 1500, // ₹1,500
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Artisanal Soaps", href: "/categories/soaps" },
    { label: "Hair & Scalp", href: "/categories/hair-care" },
    { label: "Shop All", href: "/shop" },
    { label: "Candles (Option)", href: "/categories/candles" },
    { label: "Our Story", href: "/our-story" },
  ],
  footerLinks: {
    shop: [
      { label: "Handcrafted Herbal Soaps", href: "/categories/soaps" },
      { label: "Botanical Hair & Scalp Oils", href: "/categories/hair-care" },
      { label: "Artisan Soy Candles (Option)", href: "/categories/candles" },
      { label: "Royal Bath Gift Hampers", href: "/categories/gifting" },
      { label: "View All Offerings", href: "/shop" },
    ],
    about: [
      { label: "Our Botanical Heritage", href: "/our-story" },
      { label: "Pure Herbal Extraction", href: "/our-story#herbal" },
      { label: "Plastic-Free Packaging", href: "/our-story#sustainability" },
      { label: "Artisanal Soap Workshop", href: "/our-story#workshop" },
    ],
    help: [
      { label: "Shipping & Delivery", href: "/contact" },
      { label: "Returns & Guarantee", href: "/contact" },
      { label: "Track Your Order", href: "/contact" },
      { label: "Soap Care & Longevity", href: "/contact" },
      { label: "Customer Concierge", href: "/contact" },
    ],
  },
  social: {
    instagram: "https://instagram.com/pavishnaorganicworlds",
    pinterest: "https://pinterest.com/pavishnaorganicworlds",
  },
  values: [
    {
      icon: "Sparkle",
      title: "Handcrafted Herbal Soaps",
      description: "Made with authentic botanicals like Vettiveru, Neem, Aloe Vera, Rose, Coconut, and Hibiscus."
    },
    {
      icon: "Droplets",
      title: "Cold-Pressed Hair Oils",
      description: "Slow-extracted root nectars rich in natural vitamins, bio-lipids, and hair-strengthening botanicals."
    },
    {
      icon: "Recycle",
      title: "100% Plastic-Free",
      description: "Sustainable glass bottles, compostable packaging, and biodegradable botanical materials."
    },
    {
      icon: "Heart",
      title: "Purity & Integrity",
      description: "Zero synthetic fragrances, zero harsh sulfates, zero parabens, and cruelty-free formulas."
    }
  ]
};
