import { prisma } from "@/lib/prisma";

export interface NotificationLog {
  id: string;
  orderId: string;
  orderNumber: string;
  recipientEmail: string;
  type: "ORDER_CONFIRMATION" | "ORDER_DISPATCHED" | "ORDER_DELIVERED";
  subject: string;
  messageText: string;
  sentAt: Date;
}

// In-memory audit trail of sent notifications
export const notificationHistory: NotificationLog[] = [];

/**
 * Sends and records an artisanal Order Confirmation notification.
 */
export async function sendOrderConfirmationNotification(orderId: string): Promise<NotificationLog | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });

  if (!order) return null;

  const recipientEmail = order.user?.email || order.guestEmail || "patron@pavishnaorganicworlds.com";
  const customerName = order.user?.name || order.guestName || "Valued Botanical Patron";

  const subject = `Sacred Order Confirmed: ${order.orderNumber} — Pavishna Organic Worlds`;
  const messageText = `
Vanakam ${customerName},

Thank you for embracing mindful self-care. Your sacred order (${order.orderNumber}) has been confirmed and reserved in our Tamil Nadu workshop.

Items Reserved:
${order.items.map((i) => `• ${i.productName} (Qty: ${i.quantity}) — ₹${i.totalPrice}`).join("\n")}

Total: ₹${order.totalAmount}
Estimated Dispatch: Within 24–48 hours in unbleached banana fiber wraps.

With botanical reverence,
Pavishna Organic Worlds Apothecary
Madurai, Tamil Nadu
  `.trim();

  const record: NotificationLog = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    recipientEmail,
    type: "ORDER_CONFIRMATION",
    subject,
    messageText,
    sentAt: new Date(),
  };

  notificationHistory.push(record);
  return record;
}

/**
 * Sends and records an Order Dispatched notification with carrier & tracking URL.
 */
export async function sendOrderDispatchedNotification(orderId: string): Promise<NotificationLog | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });

  if (!order) return null;

  const recipientEmail = order.user?.email || order.guestEmail || "patron@pavishnaorganicworlds.com";
  const customerName = order.user?.name || order.guestName || "Valued Botanical Patron";

  const trackingLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://pavishnaorganicworlds.com"}/track/${order.trackingToken}`;

  const subject = `Your Botanical Formulations Have Dispatched: ${order.orderNumber}`;
  const messageText = `
Vanakam ${customerName},

Your handcrafted formulations have completed their curing ritual, received final quality blessing, and have been dispatched via ${order.carrier || "Standard Carrier"}.

Carrier: ${order.carrier || "Courier Partner"}
AWB / Tracking Number: ${order.trackingNumber || "Pending partner scan"}
Public Sanctuary Tracking: ${trackingLink}

May this ritual bring pure harmony and revitalizing botanical solace to your sanctum.

Warmly,
Pavishna Organic Worlds Dispatch Team
  `.trim();

  const record: NotificationLog = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    recipientEmail,
    type: "ORDER_DISPATCHED",
    subject,
    messageText,
    sentAt: new Date(),
  };

  notificationHistory.push(record);
  return record;
}

/**
 * Sends and records an Order Delivered notification.
 */
export async function sendOrderDeliveredNotification(orderId: string): Promise<NotificationLog | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) return null;

  const recipientEmail = order.user?.email || order.guestEmail || "patron@pavishnaorganicworlds.com";
  const customerName = order.user?.name || order.guestName || "Valued Botanical Patron";

  const subject = `Delivered to Your Sanctuary: ${order.orderNumber}`;
  const messageText = `
Vanakam ${customerName},

Your order (${order.orderNumber}) has arrived safely at your sanctuary. Please store cold-pressed oils away from direct sunlight and allow artisanal cold-processed soaps to rest on a draining wooden slatted dish between bathing rituals.

With deep gratitude,
Pavishna Organic Worlds
  `.trim();

  const record: NotificationLog = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    recipientEmail,
    type: "ORDER_DELIVERED",
    subject,
    messageText,
    sentAt: new Date(),
  };

  notificationHistory.push(record);
  return record;
}
