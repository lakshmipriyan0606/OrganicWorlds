import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { mockProducts, productCategories } from "../src/config/products";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Pavishna Organic Worlds database seed...");

  // 1. Seed Administrator User
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@pavishnaorganicworlds.com";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "AdminPavishna2026!Secure";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      name: "Pavishna Administrator",
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: "Pavishna Administrator",
      role: "ADMIN",
      phone: "+91 98765 43210",
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email} (ID: ${admin.id})`);

  // 2. Seed Test Customer User
  const customerEmail = "customer@example.com";
  const customerPassword = process.env.CUSTOMER_INITIAL_PASSWORD || "CustomerPavishna2026!Secure";
  const customerPasswordHash = await bcrypt.hash(customerPassword, 10);
  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {
      passwordHash: customerPasswordHash,
    },
    create: {
      email: customerEmail,
      passwordHash: customerPasswordHash,
      name: "Lakshmi Narayanan",
      role: "CUSTOMER",
      phone: "+91 98401 23456",
      addresses: {
        create: {
          fullName: "Lakshmi Narayanan",
          addressLine1: "14, Temple View Avenue",
          addressLine2: "Besant Nagar",
          city: "Chennai",
          state: "Tamil Nadu",
          postalCode: "600090",
          phone: "+91 98401 23456",
          isDefault: true,
        },
      },
    },
  });
  console.log(`✅ Test customer user seeded: ${customer.email}`);

  // 3. Seed Categories
  const categoryMap = new Map<string, string>();

  for (let i = 0; i < productCategories.length; i++) {
    const cat = productCategories[i];
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        order: i,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        order: i,
        isActive: true,
      },
    });
    categoryMap.set(cat.slug, createdCat.id);
  }
  console.log(`✅ ${categoryMap.size} categories seeded.`);

  // 4. Seed Real Authentic Products from src/config/products.ts
  let seededProducts = 0;
  for (const product of mockProducts) {
    const categoryId = categoryMap.get(product.category) || null;
    const sku = (product.variants && product.variants[0]?.sku) || `PV-${product.slug.toUpperCase().slice(0, 8)}-STD`;

    const upsertedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        subtitle: product.subtitle || null,
        description: product.description,
        categoryId,
        categorySlug: product.category,
        categoryLabel: product.categoryLabel,
        price: product.price,
        originalPrice: product.originalPrice || null,
        sku,
        badge: product.badge || null,
        featuredImage: product.featuredImage,
        images: JSON.stringify(product.images || [product.featuredImage]),
        inStock: product.inStock ?? true,
        stockQuantity: 45,
        lowStockThreshold: 5,
        isPublished: true,
        rating: product.rating || 5.0,
        reviewCount: product.reviewCount || 12,
        ingredientsSummary: product.ingredientsSummary || null,
        ritualSteps: product.ritualSteps ? JSON.stringify(product.ritualSteps) : null,
        soapSpecs: product.soapSpecs ? JSON.stringify(product.soapSpecs) : null,
      },
      create: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        subtitle: product.subtitle || null,
        description: product.description,
        categoryId,
        categorySlug: product.category,
        categoryLabel: product.categoryLabel,
        price: product.price,
        originalPrice: product.originalPrice || null,
        sku,
        badge: product.badge || null,
        featuredImage: product.featuredImage,
        images: JSON.stringify(product.images || [product.featuredImage]),
        inStock: product.inStock ?? true,
        stockQuantity: 45,
        lowStockThreshold: 5,
        isPublished: true,
        rating: product.rating || 5.0,
        reviewCount: product.reviewCount || 12,
        ingredientsSummary: product.ingredientsSummary || null,
        ritualSteps: product.ritualSteps ? JSON.stringify(product.ritualSteps) : null,
        soapSpecs: product.soapSpecs ? JSON.stringify(product.soapSpecs) : null,
      },
    });

    // Seed Variants if present
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        await prisma.productVariant.upsert({
          where: { sku: variant.sku },
          update: {
            name: variant.name,
            price: variant.price,
            stockQuantity: 45,
            inStock: variant.inStock ?? true,
          },
          create: {
            productId: upsertedProduct.id,
            name: variant.name,
            sku: variant.sku,
            price: variant.price,
            stockQuantity: 45,
            inStock: variant.inStock ?? true,
          },
        });
      }
    }

    // Record initial inventory log
    await prisma.inventoryLog.create({
      data: {
        productId: upsertedProduct.id,
        productSku: sku,
        delta: 45,
        previousStock: 0,
        newStock: 45,
        reason: "INITIAL_SEED",
        actorEmail: adminEmail,
      },
    });

    seededProducts++;
  }
  console.log(`✅ ${seededProducts} products seeded with variants and inventory logs.`);

  // 5. Seed Homepage CMS Default Configuration
  await prisma.homepageContent.upsert({
    where: { key: "announcement" },
    update: {},
    create: {
      key: "announcement",
      data: JSON.stringify({
        enabled: true,
        text: "Welcome to Pavishna Organic Worlds • Complimentary botanical soap sample with orders above ₹1,499 • Free shipping across India",
        freeShippingThreshold: 1500,
      }),
    },
  });

  await prisma.homepageContent.upsert({
    where: { key: "hero" },
    update: {},
    create: {
      key: "hero",
      data: JSON.stringify({
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
      }),
    },
  });
  console.log(`✅ Default Homepage CMS content seeded.`);

  console.log("🌟 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
