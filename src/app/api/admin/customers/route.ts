import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
        orders: {
          select: {
            totalAmount: true,
            status: true,
          },
        },
      },
    });

    const formatted = customers.map((c) => {
      const totalSpent = c.orders.reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        createdAt: c.createdAt,
        orderCount: c._count.orders,
        totalSpent,
      };
    });

    return NextResponse.json({ success: true, customers: formatted });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
