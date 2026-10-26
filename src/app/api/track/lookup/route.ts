import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || "").trim();

    if (!query) {
      return NextResponse.json(
        { error: "Please enter an order number or tracking token." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: query } },
          { trackingToken: { equals: query } },
        ],
      },
      select: {
        id: true,
        orderNumber: true,
        trackingToken: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "No matching order found. Please check your order number (e.g., POW-...) and try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      trackingToken: order.trackingToken,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Track lookup error:", error);
    return NextResponse.json(
      { error: "An error occurred while looking up your order." },
      { status: 500 }
    );
  }
}
