export type ProductCategory = 
  | "hair-care"
  | "hair-oils"
  | "soaps"
  | "skincare"
  | "candles"
  | "body-care"
  | "aromatherapy"
  | "gifting";

export interface CandleAttributes {
  waxType: string;
  burnTimeHours: number;
  scentFamily: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  weightGrams: number;
}

export interface HairOilAttributes {
  hairType: string[];
  keyBenefits: string[];
  volumeMl: number;
  organicIngredients: string[];
  scentProfile: string;
}

export interface SoapAttributes {
  soapType: string;
  weightGrams: number;
  curingWeeks: number;
  skinType: string[];
  keyBotanicals: string[];
  scentProfile: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  sku: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  images: string[];
  featuredImage: string;
  inStock: boolean;
  stockQuantity?: number;
  categorySlug?: string;
  rating: number;
  reviewCount: number;
  ingredientsSummary?: string;
  ritualSteps?: string[];
  hairOilSpecs?: HairOilAttributes;
  soapSpecs?: SoapAttributes;
  candleSpecs?: CandleAttributes;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}
