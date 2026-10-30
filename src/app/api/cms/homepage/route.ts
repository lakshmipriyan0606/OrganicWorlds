import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getHomepageSection,
  DEFAULT_HERO_DATA,
  DEFAULT_ANNOUNCEMENT_DATA,
  HeroCMSData,
  AnnouncementCMSData,
} from "@/lib/services/cms-service";

export async function GET() {
  try {
    const [hero, announcement, featuredCms] = await Promise.all([
      getHomepageSection<HeroCMSData>("hero", DEFAULT_HERO_DATA),
      getHomepageSection<AnnouncementCMSData>("announcement", DEFAULT_ANNOUNCEMENT_DATA),
      getHomepageSection<{ slug?: string; productId?: string } | null>("featured_product", null),
    ]);

    let featuredProduct = null;
    if (featuredCms?.slug) {
      featuredProduct = await prisma.product.findUnique({
        where: { slug: featuredCms.slug, isPublished: true },
      });
    } else if (featuredCms?.productId) {
      featuredProduct = await prisma.product.findUnique({
        where: { id: featuredCms.productId, isPublished: true },
      });
    }

    if (!featuredProduct) {
      // Find a featured or badged published product from database
      featuredProduct = await prisma.product.findFirst({
        where: {
          isPublished: true,
          badge: { not: null },
        },
        orderBy: { createdAt: "asc" },
      });
    }

    return NextResponse.json({
      success: true,
      hero,
      announcement,
      featuredProduct: featuredProduct
        ? {
            id: featuredProduct.id,
            title: featuredProduct.title,
            slug: featuredProduct.slug,
            subtitle: featuredProduct.subtitle,
            description: featuredProduct.description,
            price: featuredProduct.price,
            badge: featuredProduct.badge,
            featuredImage: featuredProduct.featuredImage,
            ingredientsSummary: featuredProduct.ingredientsSummary,
          }
        : null,
    });
  } catch (error) {
    console.error("Public CMS homepage GET error:", error);
    return NextResponse.json({
      success: true,
      hero: DEFAULT_HERO_DATA,
      announcement: DEFAULT_ANNOUNCEMENT_DATA,
      featuredProduct: null,
    });
  }
}
