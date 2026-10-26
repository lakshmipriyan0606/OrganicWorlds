import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  addressLine1: z.string().min(3, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Valid postal code is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  isDefault: z.boolean().optional(),
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "Variant SKU is required"),
  price: z.number().positive("Price must be positive"),
  stockQuantity: z.number().int().nonnegative().default(50),
  inStock: z.boolean().default(true),
});

export const productSchema = z.object({
  title: z.string().min(2, "Product title is required"),
  slug: z.string().min(2, "URL slug is required"),
  subtitle: z.string().optional(),
  description: z.string().min(10, "Detailed description is required"),
  categoryId: z.string().optional(),
  categorySlug: z.string().min(1, "Category is required"),
  categoryLabel: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().positive().optional(),
  sku: z.string().min(1, "SKU is required"),
  badge: z.string().optional(),
  featuredImage: z.string().min(1, "Featured image URL is required"),
  images: z.array(z.string()).optional(),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().nonnegative().default(50),
  lowStockThreshold: z.number().int().nonnegative().default(5),
  isPublished: z.boolean().default(true),
  ingredientsSummary: z.string().optional(),
  ritualSteps: z.array(z.string()).optional(),
  soapSpecs: z.record(z.string(), z.any()).optional(),
  variants: z.array(productVariantSchema).optional(),
});

export const checkoutItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  addressLine1: z.string().min(3, "Shipping address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  paymentMethod: z.enum(["RAZORPAY", "COD"]).default("RAZORPAY"),
  notes: z.string().optional(),
  items: z.array(checkoutItemSchema).min(1, "Cart cannot be empty"),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "CONFIRMED",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  carrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const heroCmsSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  italicTitle: z.string().min(1),
  subtitle: z.string().min(1),
  ctaPrimaryText: z.string().min(1),
  ctaPrimaryLink: z.string().min(1),
  ctaSecondaryText: z.string().min(1),
  ctaSecondaryLink: z.string().min(1),
  imageDesktop: z.string().min(1),
  imageAlt: z.string().optional(),
  badgeText: z.string().optional(),
});

export const announcementCmsSchema = z.object({
  enabled: z.boolean(),
  text: z.string().min(1),
  freeShippingThreshold: z.number().int().nonnegative(),
});
