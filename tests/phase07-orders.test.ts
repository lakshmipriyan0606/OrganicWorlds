import { prisma } from "../src/lib/prisma";
import {
  listAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  getOrderByTrackingToken,
  canTransitionOrderStatus,
  buildCarrierTrackingUrl,
} from "../src/lib/services/order-service";
import {
  sendOrderConfirmationNotification,
  notificationHistory,
} from "../src/lib/services/notification-service";

async function runTests() {
  console.log("🧪 Running Phase 07 Order Fulfillment & Tracking Tests...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      if (detail) console.error(`     Detail: ${detail}`);
      failed++;
    }
  }

  try {
    const product = await prisma.product.findFirst({ where: { isPublished: true } });
    if (!product) {
      throw new Error("No published product found in database for test");
    }

    // 1. Create a test order in CONFIRMED state
    const orderNumber = `POW-TEST-FULFILL-${Date.now()}`;
    const testOrder = await prisma.order.create({
      data: {
        orderNumber,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        guestName: "Meenakshi Sundaram",
        guestEmail: "meenakshi@example.com",
        guestPhone: "+91 94432 11111",
        subtotal: 1800,
        shippingAmount: 0,
        totalAmount: 1800,
        shippingAddress: JSON.stringify({
          fullName: "Meenakshi Sundaram",
          addressLine1: "45 West Chithirai Street",
          city: "Madurai",
          state: "Tamil Nadu",
          postalCode: "625001",
          phone: "+91 94432 11111",
        }),
        items: {
          create: [
            {
              productId: product.id,
              productName: product.title,
              sku: product.sku,
              unitPrice: product.price,
              quantity: 2,
              totalPrice: product.price * 2,
            },
          ],
        },
        payments: {
          create: {
            gateway: "RAZORPAY",
            gatewayPaymentId: `pay_test_${Date.now()}`,
            amount: 1800,
            status: "SUCCESS",
          },
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    // TEST 1: listAdminOrders returns paginated orders
    const listResult = await listAdminOrders({ page: 1, limit: 10 });
    assert(
      Array.isArray(listResult.orders) && listResult.total >= 1,
      "listAdminOrders returns array of orders with total count"
    );

    // TEST 2: listAdminOrders filters by status
    const filterResult = await listAdminOrders({ status: "CONFIRMED" });
    const hasOrder = filterResult.orders.some((o) => o.id === testOrder.id);
    assert(hasOrder, "listAdminOrders filters accurately by 'CONFIRMED' status");

    // TEST 3: listAdminOrders searches by order number
    const searchResult = await listAdminOrders({ search: orderNumber });
    assert(
      searchResult.orders.length === 1 && searchResult.orders[0].orderNumber === orderNumber,
      `listAdminOrders searches by orderNumber (${orderNumber})`
    );

    // TEST 4: getAdminOrderById retrieves complete order details
    const orderDetail = await getAdminOrderById(testOrder.id);
    assert(
      orderDetail?.id === testOrder.id && orderDetail.items.length === 1 && orderDetail.payments.length === 1,
      "getAdminOrderById returns full order record with line items and payment details"
    );

    // TEST 5: Carrier URL generation
    const delhiveryUrl = buildCarrierTrackingUrl("Delhivery", "DEL-12345678");
    assert(
      delhiveryUrl.includes("delhivery.com") && delhiveryUrl.includes("DEL-12345678"),
      "buildCarrierTrackingUrl builds valid Delhivery tracking URL"
    );
    const blueDartUrl = buildCarrierTrackingUrl("BlueDart", "BLU-888999");
    assert(
      blueDartUrl.includes("bluedart.com") && blueDartUrl.includes("BLU-888999"),
      "buildCarrierTrackingUrl builds valid BlueDart tracking URL"
    );

    // TEST 6: State transition validation helper
    assert(
      canTransitionOrderStatus("CONFIRMED", "PROCESSING") === true,
      "canTransitionOrderStatus permits CONFIRMED -> PROCESSING"
    );
    assert(
      canTransitionOrderStatus("CONFIRMED", "DELIVERED") === false,
      "canTransitionOrderStatus rejects illegal CONFIRMED -> DELIVERED transition"
    );

    // TEST 7: Advance order through fulfillment stages: CONFIRMED -> PROCESSING -> PACKED -> SHIPPED
    await updateAdminOrderStatus({
      orderId: testOrder.id,
      status: "PROCESSING",
      actorEmail: "admin@pavishnaorganicworlds.com",
    });

    await updateAdminOrderStatus({
      orderId: testOrder.id,
      status: "PACKED",
      actorEmail: "admin@pavishnaorganicworlds.com",
    });

    const initialNotifCount = notificationHistory.length;

    const shippedOrder = await updateAdminOrderStatus({
      orderId: testOrder.id,
      status: "SHIPPED",
      carrier: "Delhivery",
      trackingNumber: "DEL-88991200",
      actorEmail: "admin@pavishnaorganicworlds.com",
    });

    assert(
      shippedOrder.status === "SHIPPED" &&
        shippedOrder.carrier === "Delhivery" &&
        shippedOrder.trackingNumber === "DEL-88991200" &&
        shippedOrder.shippedAt !== null,
      "Fulfillment successfully advances to SHIPPED with carrier, AWB, and shippedAt timestamp"
    );

    assert(
      typeof shippedOrder.trackingUrl === "string" && shippedOrder.trackingUrl.includes("delhivery.com"),
      "Auto-generated carrier tracking URL attached to order"
    );

    // TEST 8: Dispatched notification triggered and recorded in audit log
    const lastNotif = notificationHistory[notificationHistory.length - 1];
    assert(
      notificationHistory.length > initialNotifCount &&
        lastNotif.type === "ORDER_DISPATCHED" &&
        lastNotif.orderId === testOrder.id,
      "Transactional ORDER_DISPATCHED notification automatically sent to customer"
    );

    // TEST 9: AdminAuditLog records entry for status change
    const auditLog = await prisma.adminAuditLog.findFirst({
      where: { entityId: testOrder.id, action: "UPDATE_ORDER_STATUS" },
      orderBy: { createdAt: "desc" },
    });
    assert(
      auditLog !== null && auditLog.entityType === "ORDER",
      "AdminAuditLog records UPDATE_ORDER_STATUS entry with actor metadata"
    );

    // TEST 10: Advance SHIPPED -> DELIVERED
    const deliveredOrder = await updateAdminOrderStatus({
      orderId: testOrder.id,
      status: "DELIVERED",
      actorEmail: "admin@pavishnaorganicworlds.com",
    });
    assert(
      deliveredOrder.status === "DELIVERED" && deliveredOrder.deliveredAt !== null,
      "Order successfully advances to DELIVERED with deliveredAt timestamp"
    );

    const deliveredNotif = notificationHistory[notificationHistory.length - 1];
    assert(
      deliveredNotif.type === "ORDER_DELIVERED" && deliveredNotif.orderId === testOrder.id,
      "Transactional ORDER_DELIVERED notification automatically sent to customer"
    );

    // TEST 11: Rejection of illegal backwards transition from DELIVERED to PROCESSING
    let illegalTransitionError = false;
    try {
      await updateAdminOrderStatus({
        orderId: testOrder.id,
        status: "PROCESSING",
      });
    } catch {
      illegalTransitionError = true;
    }
    assert(
      illegalTransitionError,
      "updateAdminOrderStatus throws error on illegal transition (DELIVERED -> PROCESSING)"
    );

    // TEST 12: Public tracking lookup by unguessable trackingToken
    const publicTracking = await getOrderByTrackingToken(testOrder.trackingToken);
    assert(
      publicTracking !== null &&
        publicTracking.orderNumber === testOrder.orderNumber &&
        publicTracking.status === "DELIVERED" &&
        publicTracking.carrier === "Delhivery" &&
        publicTracking.destination.city === "Madurai",
      "getOrderByTrackingToken resolves truthful tracking data with sanitized destination"
    );

    // TEST 13: Nonexistent tracking token returns null
    const missingTracking = await getOrderByTrackingToken("fake-token-9999");
    assert(
      missingTracking === null,
      "getOrderByTrackingToken returns null for unknown tracking token"
    );

    // TEST 14: Order confirmation notification generator
    const confirmationNotif = await sendOrderConfirmationNotification(testOrder.id);
    assert(
      confirmationNotif !== null &&
        confirmationNotif.type === "ORDER_CONFIRMATION" &&
        confirmationNotif.subject.includes(testOrder.orderNumber),
      "sendOrderConfirmationNotification generates artisanal email payload with order summary"
    );

    // Cleanup test order
    await prisma.order.delete({
      where: { id: testOrder.id },
    });
  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  }

  console.log("\n========================================");
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log("========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
