import { test, expect } from "@playwright/test";
import { prisma } from "../src/lib/prisma";
import { createSessionToken } from "../src/lib/auth";

test.describe("Admin Extended Governance & Security", () => {
  const timestamp = Date.now();
  let adminToken: string = "";
  let adminCookie: string = "";
  let customerCookie: string = "";
  let uploadedMediaAssetId: string | null = null;
  const testCategoryName = `E2E Category ${timestamp}`;
  const testCategorySlug = `e2e-cat-${timestamp}`;

  test.beforeAll(async () => {
    // 1. Generate Admin Token
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    adminToken = await createSessionToken({
      userId: adminUser?.id || "admin_seed_id",
      email: adminUser?.email || "admin@pavishnaorganicworlds.com",
      role: "ADMIN",
      name: "Sanctuary Admin",
      tokenVersion: adminUser?.tokenVersion ?? 1,
    });
    adminCookie = `pow_session=${adminToken}`;

    // 2. Generate Customer Token
    const customerUser = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });
    const customerToken = await createSessionToken({
      userId: customerUser?.id || "customer_seed_id",
      email: customerUser?.email || "customer@example.com",
      role: "CUSTOMER",
      name: "Standard Patron",
      tokenVersion: customerUser?.tokenVersion ?? 1,
    });
    customerCookie = `pow_session=${customerToken}`;
  });

  test.afterAll(async () => {
    // Clean up test category
    await prisma.category.deleteMany({ where: { slug: testCategorySlug } }).catch(() => {});

    // Clean up test media asset
    if (uploadedMediaAssetId) {
      await prisma.mediaAsset.delete({ where: { id: uploadedMediaAssetId } }).catch(() => {});
    }

    // Reset settings to defaults
    await prisma.setting.deleteMany({
      where: {
        key: { in: ["standardShippingFee", "storeName"] },
      },
    }).catch(() => {});
  });

  test("1. Admin settings save and persist on page reload", async ({ browser }) => {
    const context = await browser.newContext();
    await context.addCookies([
      {
        name: "pow_session",
        value: adminToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
    const page = await context.newPage();

    // 1. Initial navigation and await settings API load
    const initialGetPromise = page.waitForResponse(
      (resp) => resp.url().includes("/api/admin/settings") && resp.request().method() === "GET"
    );
    await page.goto("/admin/settings");
    await initialGetPromise;
    await page.waitForLoadState("domcontentloaded");

    // Check header
    await expect(page.locator("h1:has-text('Apothecary & Store Settings')")).toBeVisible();
    await expect(page.locator("form[data-loaded='true']")).toBeVisible({ timeout: 15000 });

    // Update standard shipping fee to 125 using explicit id
    const shippingFeeInput = page.locator("#standard-shipping-fee");
    await expect(shippingFeeInput).toBeEnabled({ timeout: 15000 });
    await shippingFeeInput.fill("125");

    // Click Save and await PUT response
    const savePromise = page.waitForResponse(
      (resp) => resp.url().includes("/api/admin/settings") && resp.request().method() === "PUT"
    );
    const saveButton = page.getByRole("button", { name: /Save Store Settings/i });
    await saveButton.click();
    await savePromise;

    // Verify success banner appears
    await expect(page.locator("text=Store settings successfully updated")).toBeVisible();

    // Reload page and await re-fetch from SQLite database
    const reloadGetPromise = page.waitForResponse(
      (resp) => resp.url().includes("/api/admin/settings") && resp.request().method() === "GET"
    );
    await page.reload();
    await reloadGetPromise;
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("form[data-loaded='true']")).toBeVisible({ timeout: 15000 });

    // The shipping fee input must still have value '125'
    await expect(page.locator("#standard-shipping-fee")).toHaveValue("125", { timeout: 15000 });

    await context.close();
  });

  test("2. Admin media upload accepts valid image and rejects non-image files", async ({ request }) => {
    // 1x1 valid PNG buffer
    const validPngBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    // 1. Valid Image Upload
    const validUploadRes = await request.post("/api/admin/media", {
      headers: { Cookie: adminCookie },
      multipart: {
        file: {
          name: `valid_test_${timestamp}.png`,
          mimeType: "image/png",
          buffer: validPngBuffer,
        },
        altText: "Valid automated test image",
      },
    });

    expect(validUploadRes.status()).toBe(200);
    const validData = await validUploadRes.json();
    expect(validData.success).toBe(true);
    expect(validData.asset).toBeDefined();
    uploadedMediaAssetId = validData.asset.id;

    // 2. Invalid non-image file upload (text file)
    const invalidUploadRes = await request.post("/api/admin/media", {
      headers: { Cookie: adminCookie },
      multipart: {
        file: {
          name: "test_script.txt",
          mimeType: "text/plain",
          buffer: Buffer.from("Hello world not an image"),
        },
      },
    });

    expect(invalidUploadRes.status()).toBe(400);
    const invalidData = await invalidUploadRes.json();
    expect(invalidData.error).toContain("Unsupported file type");
  });

  test("3. Unauthorized non-admin user gets 401 from admin API", async ({ request }) => {
    // 1. Unauthenticated request (no cookie) -> 401
    const unauthRes = await request.get("/api/admin/settings");
    expect(unauthRes.status()).toBe(401);

    // 2. Regular customer request -> 403 Forbidden
    const forbiddenRes = await request.get("/api/admin/settings", {
      headers: { Cookie: customerCookie },
    });
    expect(forbiddenRes.status()).toBe(403);
  });

  test("4. Admin category create form persists and appears in /api/categories", async ({ browser, request }) => {
    const context = await browser.newContext();
    await context.addCookies([
      {
        name: "pow_session",
        value: adminToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
    const page = await context.newPage();

    await page.goto("/admin/categories");
    await page.waitForLoadState("domcontentloaded");

    // Open create modal
    const newCatBtn = page.getByRole("button", { name: /New Category/i });
    await expect(newCatBtn).toBeVisible();
    await newCatBtn.click();

    // Fill form
    const nameInput = page.locator("input[placeholder='e.g. Artisanal Bath Soaps']");
    await expect(nameInput).toBeVisible();
    await nameInput.fill(testCategoryName);

    const slugInput = page.locator("input[placeholder='soaps']");
    await slugInput.fill(testCategorySlug);

    const descInput = page.locator("textarea[placeholder*='Summary of botanicals']");
    await descInput.fill("Automated test collection of artisanal botanical elixirs.");

    // Submit form
    const submitBtn = page.locator("button[type='submit']:has-text('Save Category')");
    await submitBtn.click();

    // Verify success banner appears in UI
    await expect(page.locator(`text=Category '${testCategoryName}' saved successfully.`)).toBeVisible({ timeout: 15000 });

    // Verify newly created category appears on public /api/categories
    const publicCatRes = await request.get("/api/categories");
    expect(publicCatRes.status()).toBe(200);
    const publicData = await publicCatRes.json();
    expect(publicData.success).toBe(true);

    const exists = publicData.categories.some((c: { slug: string }) => c.slug === testCategorySlug);
    expect(exists).toBe(true);

    await context.close();
  });
});
