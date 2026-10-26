import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalProducts,
      publishedProducts,
      outOfStockCount,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalCustomers,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.product.count({ where: { stockQuantity: 0 } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.product.findMany({
        where: {
          stockQuantity: { lte: 10 },
        },
        take: 8,
        orderBy: { stockQuantity: "asc" },
        select: {
          id: true,
          title: true,
          sku: true,
          stockQuantity: true,
          lowStockThreshold: true,
          price: true,
          featuredImage: true,
        },
      }),
    ]);

    // Calculate revenue from paid/confirmed orders
    const paidOrders = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
      },
      select: {
        totalAmount: true,
      },
    });

    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return NextResponse.json({
      success: true,
      metrics: {
        totalProducts,
        publishedProducts,
        outOfStockCount,
        lowStockCount: lowStockProducts.length,
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalCustomers,
        totalRevenue,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("Admin metrics error:", error);
    return NextResponse.json({ error: "Failed to load admin metrics" }, { status: 500 });
  }
}
