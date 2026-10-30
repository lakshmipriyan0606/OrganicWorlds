import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await requireAuth();

    const addresses = await prisma.address.findMany({
      where: { userId: session.userId },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Account addresses GET error:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const parsed = addressSchema.parse(body);

    const address = await prisma.$transaction(async (tx) => {
      if (parsed.isDefault) {
        await tx.address.updateMany({
          where: { userId: session.userId },
          data: { isDefault: false },
        });
      }

      return await tx.address.create({
        data: {
          userId: session.userId,
          fullName: parsed.fullName,
          addressLine1: parsed.addressLine1,
          addressLine2: parsed.addressLine2 || null,
          city: parsed.city,
          state: parsed.state,
          postalCode: parsed.postalCode,
          phone: parsed.phone,
          isDefault: parsed.isDefault || false,
        },
      });
    });

    return NextResponse.json({
      success: true,
      address,
      message: "Address saved successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Account address POST error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 400 });
  }
}
