import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getMediaAssets,
  createMediaAssetRecord,
} from "@/lib/services/cms-service";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);
    const search = searchParams.get("search") || undefined;

    const data = await getMediaAssets({ page, limit, search });
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Admin media GET error:", error);
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // MIME type check
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file type '${file.type}'. Allowed formats: JPEG, PNG, WebP, AVIF, SVG.`,
        },
        { status: 400 }
      );
    }

    // Size limit check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds the 5MB maximum limit. Selected file is ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB.`,
        },
        { status: 400 }
      );
    }

    // Generate safe filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueSuffix = crypto.randomBytes(4).toString("hex");
    const filename = `pow_${Date.now()}_${cleanBaseName}_${uniqueSuffix}.${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    const assetUrl = `/uploads/${filename}`;

    const asset = await createMediaAssetRecord({
      filename,
      url: assetUrl,
      mimeType: file.type,
      fileSize: file.size,
      altText: altText || file.name,
    });

    return NextResponse.json({
      success: true,
      asset,
      message: "Media asset uploaded and indexed successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Admin media upload POST error:", error);
    return NextResponse.json(
      { error: "Failed to upload and store media file" },
      { status: 500 }
    );
  }
}
