import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateAdminProduct } from "@/lib/services/product-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const inventoryLogs = await prisma.inventoryLog.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        images: product.images ? JSON.parse(product.images) : [product.featuredImage],
        ritualSteps: product.ritualSteps ? JSON.parse(product.ritualSteps) : [],
        soapSpecs: product.soapSpecs ? JSON.parse(product.soapSpecs) : null,
      },
      inventoryLogs,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const product = await updateAdminProduct(id, body, session.email);

    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/shop");
    revalidatePath("/");
    if (product.categorySlug) {
      revalidatePath(`/categories/${product.categorySlug}`);
    }

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: msg || "Failed to update product" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Soft-archive by default: unpublish product
    const updated = await prisma.product.update({
      where: { id },
      data: { isPublished: false },
    });

    revalidatePath(`/products/${updated.slug}`);
    revalidatePath("/shop");
    revalidatePath("/");
    if (updated.categorySlug) {
      revalidatePath(`/categories/${updated.categorySlug}`);
    }

    return NextResponse.json({
      success: true,
      message: `Product ${updated.title} unpublished and archived.`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to archive product" }, { status: 500 });
  }
}
