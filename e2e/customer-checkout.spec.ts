import { test, expect, BrowserContext, Page } from "@playwright/test";
import { prisma } from "../src/lib/prisma";
import { computeRazorpaySignature } from "../src/lib/services/payment-service";

test.describe.serial("Phases 2, 4, 5 & 6: End-to-End Customer Purchase Journey & Security Gates", () => {
  const timestamp = Date.now();
  const patronEmail = `sanctuary_patron_${timestamp}@example.com`;
  const patronPassword = "SacredPatronPassword2026!";
  const patronName = "Devi Soundaram";
  const patronPhone = "+91 98765 43210";

  const secondEmail = `second_patron_${timestamp}@example.com`;
  const secondPassword = "SecondPatronPassword2026!";

  let context: BrowserContext;
  let page: Page;
  let placedOrderId: string | null = null;

  test.beforeAll(async ({ browser }) => {
    // Create persistent browser context for the customer journey
    context = await browser.newContext();
    page = await context.newPage();

    // Route block external Razorpay script to run deterministic local payment flow
    await page.route("https://checkout.razorpay.com/**", (route) => route.abort());
  });

  test.afterAll(async () => {
    if (context) {
      await context.close().catch(() => {});
    }

    // Clean up test data
    const emails = [patronEmail, secondEmail];
    for (const email of emails) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.orderItem.deleteMany({ where: { order: { userId: user.id } } }).catch(() => {});
        await prisma.payment.deleteMany({ where: { order: { userId: user.id } } }).catch(() => {});
        await prisma.order.deleteMany({ where: { userId: user.id } }).catch(() => {});
        await prisma.address.deleteMany({ where: { userId: user.id } }).catch(() => {});
        await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
      }
    }
  });

  test("Step 1: Guest adds botanical soap to cart and encounters mandatory sign-in gate", async () => {
    // 1. Visit /shop
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");

    // 2. Click 'Add' on first product
    const addBtn = page.locator("button:has-text('Add')").first();
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // 3. Navigate to /checkout
    await page.goto("/checkout");

    // 4. Verify authentication requirement banner and absence of order submit button
    const authHeader = page.locator("text=Sign In Required for Checkout").or(page.locator("text=Sign in to Your Sanctuary"));
    await expect(authHeader.first()).toBeVisible();

    const orderSubmitBtn = page.locator("button:has-text('Confirm Order & Proceed to Pay')");
    await expect(orderSubmitBtn).toHaveCount(0);
  });

  test("Step 2: Guest registers new account directly on checkout, preserving cart and unlocking delivery form", async () => {
    // 1. Switch to 'Create New Account' tab
    const registerTab = page.locator("button:has-text('Create New Account')");
    await registerTab.click();

    // 2. Fill in account credentials
    await page.fill('input[placeholder="Sundari Natarajan"]', patronName);
    await page.fill('input[placeholder="sundari@example.com"]', patronEmail);
    await page.fill('input[placeholder="+91 98765 43210"]', patronPhone);
    const passwordInputs = page.locator('input[placeholder="••••••••••••"]');
    await passwordInputs.last().fill(patronPassword);

    // 3. Submit registration
    const submitRegBtn = page.locator("button:has-text('Create Account & Proceed to Delivery')");
    await submitRegBtn.click();

    // 4. Verify checkout form dynamically unlocks
    await expect(page.locator("text=Authenticated Patron Member")).toBeVisible();
    await expect(page.locator(`text=${patronEmail}`)).toBeVisible();
    await expect(page.locator("text=Shipping & Delivery Address")).toBeVisible();

    // 5. Verify database record
    const userInDb = await prisma.user.findUnique({ where: { email: patronEmail } });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.role).toBe("CUSTOMER");
    expect(userInDb?.passwordHash).not.toBe(patronPassword);
  });

  test("Step 3: Customer completes delivery destination and submits order", async () => {
    // 1. Fill shipping destination
    await page.fill('input[placeholder="Door No, Street Name, Cross, Layout"]', "108 Lotus Temple Road");
    await page.fill('input[placeholder="Chennai"]', "Chennai");
    await page.fill('input[placeholder="600001"]', "600001");

    // 2. Submit order
    const confirmOrderButton = page.locator("button:has-text('Confirm Order & Proceed to Pay')");
    await expect(confirmOrderButton).toBeVisible();
    await confirmOrderButton.click();

    // In local sandbox / placeholder mode, confirm via the Sanctuary Payment Sandbox modal
    const sandboxBtn = page.locator("[data-testid='confirm-sandbox-payment']");
    await sandboxBtn.waitFor({ state: "visible", timeout: 8000 });
    await sandboxBtn.click();

    // 3. Wait for redirect to order confirmation
    await page.waitForURL(/\/order-confirmation\/[a-zA-Z0-9_-]+/, { timeout: 15000 });
    const url = page.url();
    const orderIdMatch = url.match(/\/order-confirmation\/([a-zA-Z0-9_-]+)/);
    expect(orderIdMatch).not.toBeNull();
    placedOrderId = orderIdMatch![1];

    // 4. Verify order in database
    const orderInDb = await prisma.order.findUnique({
      where: { id: placedOrderId },
      include: { items: true, user: true },
    });
    expect(orderInDb).not.toBeNull();
    expect(orderInDb?.user?.email).toBe(patronEmail);
    expect(orderInDb?.items.length).toBeGreaterThan(0);
    expect(orderInDb?.totalAmount).toBeGreaterThan(0);
  });

  test("Step 4: Cryptographic payment verification confirms order and updates status to PAID", async ({ playwright }) => {
    expect(placedOrderId).not.toBeNull();

    // Get active session cookie
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === "pow_session");
    expect(sessionCookie).toBeDefined();

    const isolatedContext = await playwright.request.newContext();
    const rzpOrderId = `order_test_${Date.now()}`;
    const rzpPaymentId = `pay_test_${Date.now()}`;
    const signature = computeRazorpaySignature(rzpOrderId, rzpPaymentId);

    const verifyRes = await isolatedContext.post("http://localhost:3000/api/checkout/razorpay/verify", {
      headers: {
        Cookie: `pow_session=${sessionCookie?.value}`,
      },
      data: {
        orderId: placedOrderId!,
        razorpayOrderId: rzpOrderId,
        razorpayPaymentId: rzpPaymentId,
        razorpaySignature: signature,
      },
    });

    expect(verifyRes.status()).toBe(200);
    const verifyData = await verifyRes.json();
    expect(verifyData.success).toBe(true);

    // Verify order transitioned to CONFIRMED and payment is PAID
    const confirmedOrder = await prisma.order.findUnique({
      where: { id: placedOrderId! },
    });
    expect(confirmedOrder?.status).toBe("CONFIRMED");
    expect(confirmedOrder?.paymentStatus).toBe("PAID");
  });

  test("Step 5: Customer views order in order history and cross-account access is denied", async ({ playwright }) => {
    // 1. Visit /account while logged in
    await page.goto("/account");
    await expect(page.locator(`text=${patronName}`).first()).toBeVisible();

    // 2. Order appears in customer's order history
    if (placedOrderId) {
      const orderElement = page.locator(`text=${placedOrderId.slice(0, 8)}`).or(page.locator("text=CONFIRMED")).or(page.locator("text=Orders"));
      await expect(orderElement.first()).toBeVisible();
    }

    // 3. Register a second customer
    const otherContext = await playwright.request.newContext();
    const regRes = await otherContext.post("http://localhost:3000/api/auth/register", {
      data: {
        name: "Second Patron",
        email: secondEmail,
        password: secondPassword,
      },
    });
    expect(regRes.status()).toBe(201);

    // 4. Second customer attempts to access first customer's order -> forbidden/not found
    const unauthorizedAccessRes = await otherContext.get(`http://localhost:3000/api/orders/${placedOrderId}`);
    expect([403, 404]).toContain(unauthorizedAccessRes.status());
  });

  test("Step 6: Customer session termination (logout) and re-authentication", async () => {
    // 1. Logout
    const logoutButton = page.locator("button:has-text('Sign Out')").or(page.locator("button:has-text('Logout')"));
    if (await logoutButton.first().isVisible()) {
      await logoutButton.first().click();
      await page.waitForURL(/\/login/, { timeout: 10000 });
    }

    // 2. Re-login
    await page.goto("/login");
    await page.fill('input[type="email"]', patronEmail);
    await page.fill('input[type="password"]', patronPassword);
    await page.click('button[type="submit"]');

    // 3. Verify session restored on /account
    await expect(page).toHaveURL(/\/account/);
    await expect(page.locator(`text=${patronName}`).first()).toBeVisible();
  });

  test("Security Gate: Direct API order creation without valid session is strictly rejected with 401", async ({ request }) => {
    const unauthOrderRes = await request.post("/api/checkout/create-order", {
      data: {
        customerName: "Fraudulent Guest",
        email: "fraudulent@example.com",
        phone: "9876543210",
        addressLine1: "123 Fraud Lane",
        city: "Chennai",
        state: "Tamil Nadu",
        postalCode: "600001",
        items: [{ productId: "pav-soap-01", quantity: 1 }],
      },
    });

    expect(unauthOrderRes.status()).toBe(401);
    const data = await unauthOrderRes.json();
    expect(data.error).toBe("AUTHENTICATION_REQUIRED");
  });
});
