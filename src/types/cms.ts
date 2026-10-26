export interface HeroCMSData {
  eyebrow?: string;
  title?: string;
  italicTitle?: string;
  subtitle?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  imageDesktop?: string;
  imageAlt?: string;
  badgeText?: string;
  overlayOpacity?: number;
}

export interface AnnouncementCMSData {
  enabled: boolean;
  text: string;
  freeShippingThreshold?: number;
}

export const DEFAULT_HERO_DATA: HeroCMSData = {
  eyebrow: "PURE • BOTANICAL • HANDCRAFTED",
  title: "Nature’s Care",
  italicTitle: "for Your Skin",
  subtitle: "Organic soaps, oils and skincare crafted with traditional wisdom and the power of nature.",
  ctaPrimaryText: "Shop Organic Soaps",
  ctaPrimaryLink: "/categories/soaps",
  ctaSecondaryText: "Explore Our Oils",
  ctaSecondaryLink: "/categories/hair-care",
  imageDesktop: "/images/hero-hair-oil.jpg",
  imageAlt: "Pavishna Herbal Hair Oil pouring into carved stone mortar surrounded by fresh botanicals",
  badgeText: "100% NATURAL INGREDIENTS",
  overlayOpacity: 0,
};

export const DEFAULT_ANNOUNCEMENT_DATA: AnnouncementCMSData = {
  enabled: true,
  text: "Welcome to Pavishna Organic Worlds • Complimentary botanical soap sample with orders above ₹1,499 • Free shipping across India",
  freeShippingThreshold: 1500,
};
