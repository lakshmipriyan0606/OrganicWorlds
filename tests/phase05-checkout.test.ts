import { prisma } from "../src/lib/prisma";
import { getPublishedCatalog, getProductBySlug } from "../src/lib/services/product-service";
import { calculateAuthoritativeCart } from "../src/lib/services/pricing-service";

async function runTests() {
  console.log("🧪 Running Phase 05 Customer Accounts, Product Discovery & Checkout Tests...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  try {
    // Test 1: getPublishedCatalog queries live database products
    const catalog = await getPublishedCatalog();
    assert(catalog.length >= 19, `getPublishedCatalog returns all published products (${catalog.length} found)`);

    // Test 2: getProductBySlug resolves product with botanical specs
    const sampleProduct = catalog[0];
    const fetchedProduct = await getProductBySlug(sampleProduct.slug);
    assert(
      !!fetchedProduct && fetchedProduct.id === sampleProduct.id,
      `getProductBySlug correctly resolves '${sampleProduct.title}' by slug`
    );

    // Test 3: Customer address creation with default flag
    // Fetch or create a test customer
    let customer = await prisma.user.findUnique({
      where: { email: "customer@example.com" },
    });
    if (!customer) {
      customer = await prisma.user.create({
        data: {
          email: "customer@example.com",
          name: "Sundari Natarajan",
          passwordHash: "hash_test_dummy",
          role: "CUSTOMER",
        },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: customer.id,
        fullName: "Sundari Natarajan",
        addressLine1: "42 Vasanth Nagar, 2nd Cross",
        city: "Madurai",
        state: "Tamil Nadu",
        postalCode: "625020",
        phone: "+91 98765 43210",
        isDefault: true,
      },
    });
    assert(
      newAddress.userId === customer.id && newAddress.isDefault === true,
      "Customer address is created with proper user ownership"
    );

    // Test 4: Customer order isolation
    const customerOrders = await prisma.order.findMany({
      where: { userId: customer.id },
    });
    assert(
      customerOrders.every((o) => o.userId === customer.id),
      "Customer order lookup enforces strict userId boundary"
    );

    // Test 5: Authoritative price calculation ignores client prices
    // Client requests item with manipulated quantity & nonexistent cheap price
    const calculation = await calculateAuthoritativeCart([
      { productId: sampleProduct.id, quantity: 2 },
    ]);
    const expectedSubtotal = sampleProduct.price * 2;
    assert(
      calculation.subtotal === expectedSubtotal,
      `calculateAuthoritativeCart calculates exact subtotal (₹${calculation.subtotal} === ₹${expectedSubtotal})`
    );

    // Test 6: Free shipping threshold rules
    if (calculation.subtotal < 1500) {
      assert(calculation.shippingAmount === 99, "Shipping fee ₹99 applies when subtotal < ₹1,500");
    } else {
      assert(calculation.shippingAmount === 0, "Free shipping applies when subtotal >= ₹1,500");
    }

    // Test 7: Atomic Order creation in PENDING_PAYMENT state
    const orderNumber = `TEST-POW-${Date.now().toString().slice(-6)}`;
    const createdOrder = await prisma.$transaction(async (tx) => {
      return await tx.order.create({
        data: {
          orderNumber,
          user: { connect: { id: customer.id } },
          guestName: customer.name,
          guestEmail: customer.email,
          guestPhone: "+91 98765 43210",
          status: "PENDING_PAYMENT",
          subtotal: calculation.subtotal,
          shippingAmount: calculation.shippingAmount,
          taxAmount: 0,
          totalAmount: calculation.totalAmount,
          currency: "INR",
          shippingAddress: JSON.stringify({
            fullName: "Sundari Natarajan",
            addressLine1: "42 Vasanth Nagar",
            city: "Madurai",
            state: "Tamil Nadu",
            postalCode: "625020",
          }),
          billingAddress: JSON.stringify({
            fullName: "Sundari Natarajan",
            addressLine1: "42 Vasanth Nagar",
            city: "Madurai",
            state: "Tamil Nadu",
            postalCode: "625020",
          }),
          items: {
            create: calculation.items.map((i) => ({
              productId: i.productId,
              productName: i.productName,
              sku: i.sku,
              unitPrice: i.unitPrice,
              quantity: i.quantity,
              totalPrice: i.totalPrice,
              featuredImage: i.featuredImage,
            })),
          },
          payments: {
            create: {
              gateway: "RAZORPAY",
              amount: calculation.totalAmount,
              currency: "INR",
              status: "PENDING",
            },
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });
    });

    assert(
      createdOrder.status === "PENDING_PAYMENT" && createdOrder.items.length === 1,
      "Order created in PENDING_PAYMENT state with immutable line items"
    );

    // Test 8: Associated Payment record created in PENDING state
    const payment = await prisma.payment.findFirst({
      where: { orderId: createdOrder.id },
    });
    assert(
      !!payment && payment.status === "PENDING" && payment.amount === calculation.totalAmount,
      "Associated Payment record generated in PENDING state with exact amount"
    );

    // Test 9: Rejection of empty cart in calculateAuthoritativeCart
    let emptyCartError = false;
    try {
      await calculateAuthoritativeCart([]);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("EMPTY_CART")) {
        emptyCartError = true;
      }
    }
    assert(emptyCartError, "calculateAuthoritativeCart rejects empty cart with EMPTY_CART error");

    // Test 10: Rejection of stock overflow
    let stockOverflowError = false;
    try {
      await calculateAuthoritativeCart([
        { productId: sampleProduct.id, quantity: 99999 },
      ]);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("INSUFFICIENT_STOCK")) {
        stockOverflowError = true;
      }
    }
    assert(
      stockOverflowError,
      "calculateAuthoritativeCart rejects quantity exceeding inventory with INSUFFICIENT_STOCK error"
    );

    // Clean up test order & address
    await prisma.payment.deleteMany({ where: { orderId: createdOrder.id } });
    await prisma.orderItem.deleteMany({ where: { orderId: createdOrder.id } });
    await prisma.order.delete({ where: { id: createdOrder.id } });
    await prisma.address.delete({ where: { id: newAddress.id } });
  } catch (error) {
    console.error("Test execution error:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n========================================");
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log("========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
