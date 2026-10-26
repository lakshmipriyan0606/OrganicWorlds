import { prisma } from "@/lib/prisma";
import {
  sendOrderDispatchedNotification,
  sendOrderDeliveredNotification,
} from "./notification-service";

export interface ListOrdersOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const VALID_ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export type OrderStatus = (typeof VALID_ORDER_STATUSES)[number];

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export function canTransitionOrderStatus(current: string, next: string): boolean {
  if (current === next) return true;
  const allowed = ALLOWED_TRANSITIONS[current as OrderStatus] || [];
  return allowed.includes(next as OrderStatus);
}

export function buildCarrierTrackingUrl(carrier: string, trackingNumber: string): string {
  const c = carrier.toLowerCase();
  const num = encodeURIComponent(trackingNumber.trim());

  if (c.includes("delhivery")) {
    return `https://www.delhivery.com/track/package/${num}`;
  }
  if (c.includes("bluedart") || c.includes("blue dart")) {
    return `https://www.bluedart.com/tracking?trackNumber=${num}`;
  }
  if (c.includes("dtdc")) {
    return `https://www.dtdc.in/tracking/shipment-tracking.asp?trkid=${num}`;
  }
  if (c.includes("india post") || c.includes("indiapost")) {
    return `https://www.indiapost.gov.in/_layouts/15/dpt.cpt.tracking/trackconsignment.aspx`;
  }
  if (c.includes("shadowfax")) {
    return `https://tracker.shadowfax.in/#/track?orderId=${num}`;
  }

  return `https://track.aftership.com/${num}`;
}

/**
 * Lists paginated orders with status filtering and text search for Admin.
 */
export async function listAdminOrders(options: ListOrdersOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, Math.max(1, options.limit || 15));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (options.status && options.status !== "ALL") {
    where.status = options.status;
  }

  if (options.search) {
    const s = options.search.trim();
    where.OR = [
      { orderNumber: { contains: s } },
      { guestName: { contains: s } },
      { guestEmail: { contains: s } },
      { guestPhone: { contains: s } },
      { user: { name: { contains: s } } },
      { user: { email: { contains: s } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: true,
        payments: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Retrieves full order details by ID for Admin.
 */
export async function getAdminOrderById(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      payments: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
}

/**
 * Updates order fulfillment status, carrier details, and dispatches customer notifications.
 */
export async function updateAdminOrderStatus(params: {
  orderId: string;
  status: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  actorEmail?: string;
}) {
  const { orderId, status, carrier, trackingNumber, trackingUrl, actorEmail } = params;

  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payments: true },
  });

  if (!existing) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (!VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }

  if (!canTransitionOrderStatus(existing.status, status)) {
    throw new Error(
      `Illegal transition from '${existing.status}' to '${status}'. Allowed: ${ALLOWED_TRANSITIONS[existing.status as OrderStatus]?.join(", ") || "none"}`
    );
  }

  // Determine final tracking URL
  let finalTrackingUrl = trackingUrl;
  if (trackingNumber && carrier && !finalTrackingUrl) {
    finalTrackingUrl = buildCarrierTrackingUrl(carrier, trackingNumber);
  }

  const dataToUpdate: Record<string, unknown> = {
    status,
  };

  if (carrier !== undefined) dataToUpdate.carrier = carrier.trim() || null;
  if (trackingNumber !== undefined) dataToUpdate.trackingNumber = trackingNumber.trim() || null;
  if (finalTrackingUrl !== undefined) dataToUpdate.trackingUrl = finalTrackingUrl;

  if (status === "SHIPPED" && !existing.shippedAt) {
    dataToUpdate.shippedAt = new Date();
  }

  if (status === "DELIVERED" && !existing.deliveredAt) {
    dataToUpdate.deliveredAt = new Date();
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: dataToUpdate,
    include: { items: true, payments: true, user: true },
  });

  // Create AdminAuditLog entry
  await prisma.adminAuditLog.create({
    data: {
      action: "UPDATE_ORDER_STATUS",
      entityType: "ORDER",
      entityId: orderId,
      details: JSON.stringify({
        actorEmail: actorEmail || "admin@pavishnaorganicworlds.com",
        previousStatus: existing.status,
        newStatus: status,
        carrier,
        trackingNumber,
      }),
    },
  });

  // Trigger notifications
  if (status === "SHIPPED") {
    await sendOrderDispatchedNotification(orderId);
  } else if (status === "DELIVERED") {
    await sendOrderDeliveredNotification(orderId);
  }

  return updatedOrder;
}

/**
 * Public lookup using unguessable trackingToken.
 */
export async function getOrderByTrackingToken(token: string) {
  const order = await prisma.order.findUnique({
    where: { trackingToken: token },
    include: {
      items: true,
      payments: true,
    },
  });

  if (!order) return null;

  let shippingAddressParsed: {
    city?: string;
    state?: string;
    postalCode?: string;
  } = {};

  try {
    const raw = JSON.parse(order.shippingAddress);
    shippingAddressParsed = {
      city: raw.city,
      state: raw.state,
      postalCode: raw.postalCode,
    };
  } catch {
    // ignore
  }

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    carrier: order.carrier,
    trackingNumber: order.trackingNumber,
    trackingUrl: order.trackingUrl,
    shippedAt: order.shippedAt,
    deliveredAt: order.deliveredAt,
    createdAt: order.createdAt,
    destination: shippingAddressParsed,
    items: order.items.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      featuredImage: i.featuredImage,
    })),
  };
}
