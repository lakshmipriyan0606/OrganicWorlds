import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { name, slug, description, image, order } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Category name and slug are required" }, { status: 400 });
    }

    const category = await prisma.category.upsert({
      where: { slug },
      update: {
        name,
        description: description || null,
        image: image || null,
        order: typeof order === "number" ? order : 0,
      },
      create: {
        name,
        slug,
        description: description || null,
        image: image || null,
        order: typeof order === "number" ? order : 0,
      },
    });

    revalidatePath("/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath(`/categories/${category.slug}`);

    return NextResponse.json({ success: true, category });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to save category" }, { status: 500 });
  }
}
