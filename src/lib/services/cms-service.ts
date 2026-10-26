import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import {
  HeroCMSData,
  AnnouncementCMSData,
  DEFAULT_HERO_DATA,
  DEFAULT_ANNOUNCEMENT_DATA,
} from "@/types/cms";

export type { HeroCMSData, AnnouncementCMSData };
export { DEFAULT_HERO_DATA, DEFAULT_ANNOUNCEMENT_DATA };

/**
 * Get homepage CMS content by section key
 */
export async function getHomepageSection<T>(key: string, fallback: T): Promise<T> {
  try {
    const record = await prisma.homepageContent.findUnique({
      where: { key },
    });
    if (!record) return fallback;
    return JSON.parse(record.data) as T;
  } catch (e) {
    console.error(`Failed to load homepage section '${key}':`, e);
    return fallback;
  }
}

/**
 * Update homepage CMS section and log admin audit
 */
export async function updateHomepageSection(
  key: string,
  data: Record<string, unknown>,
  userId?: string
): Promise<{ success: boolean; data: Record<string, unknown> }> {
  const jsonString = JSON.stringify(data);

  await prisma.$transaction(async (tx) => {
    await tx.homepageContent.upsert({
      where: { key },
      create: { key, data: jsonString },
      update: { data: jsonString },
    });

    await tx.adminAuditLog.create({
      data: {
        userId: userId || null,
        action: "UPDATE_HOMEPAGE",
        entityType: "HOMEPAGE",
        entityId: key,
        details: jsonString,
      },
    });
  });

  return { success: true, data };
}

/**
 * Query Media Assets with pagination and search
 */
export async function getMediaAssets(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 24));
  const skip = (page - 1) * limit;

  const where = params.search
    ? {
        OR: [
          { filename: { contains: params.search } },
          { altText: { contains: params.search } },
        ],
      }
    : {};

  const [assets, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  return {
    assets,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Register a newly uploaded media asset in the database
 */
export async function createMediaAssetRecord(input: {
  filename: string;
  url: string;
  mimeType: string;
  fileSize: number;
  altText?: string;
  width?: number;
  height?: number;
}) {
  return await prisma.mediaAsset.create({
    data: {
      filename: input.filename,
      url: input.url,
      mimeType: input.mimeType,
      fileSize: input.fileSize,
      altText: input.altText || null,
      width: input.width || null,
      height: input.height || null,
    },
  });
}

/**
 * Delete a media asset, ensuring safe checks for product and homepage usage
 */
export async function deleteMediaAsset(id: string) {
  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new Error("Asset not found");
  }

  // Check if asset URL is referenced by any product
  const referencedInProducts = await prisma.product.findFirst({
    where: {
      OR: [
        { featuredImage: asset.url },
        { images: { contains: asset.url } },
      ],
    },
    select: { title: true, sku: true },
  });

  if (referencedInProducts) {
    throw new Error(
      `Cannot delete asset: It is currently used by product "${referencedInProducts.title}" (${referencedInProducts.sku}). Replace or remove the product image first.`
    );
  }

  // Check if asset is referenced in hero homepage content
  const heroContent = await prisma.homepageContent.findUnique({
    where: { key: "hero" },
  });
  if (heroContent && heroContent.data.includes(asset.url)) {
    throw new Error(
      "Cannot delete asset: It is currently configured as the Homepage Hero image. Update the Hero image first."
    );
  }

  // Delete physical file if located in public directory
  try {
    if (asset.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", asset.url);
      await fs.unlink(filePath);
    }
  } catch (err) {
    console.warn(`File deletion warning for ${asset.url}:`, err);
  }

  // Delete DB record
  await prisma.mediaAsset.delete({
    where: { id },
  });

  return { success: true };
}
