import {
  getHomepageSection,
  updateHomepageSection,
  createMediaAssetRecord,
  getMediaAssets,
  deleteMediaAsset,
  DEFAULT_HERO_DATA,
  DEFAULT_ANNOUNCEMENT_DATA,
  HeroCMSData,
  AnnouncementCMSData,
} from "../src/lib/services/cms-service";
import { prisma } from "../src/lib/prisma";

async function runTests() {
  console.log("🧪 Running Phase 04 Homepage CMS & Media Library Tests...\n");
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
    // Test 1: getHomepageSection returns seeded data
    const hero = await getHomepageSection<HeroCMSData>("hero", DEFAULT_HERO_DATA);
    assert(
      !!hero && (hero.title === "Nature’s Care" || typeof hero.title === "string"),
      "getHomepageSection reads seeded hero section data"
    );

    // Test 2: getHomepageSection returns fallback for nonexistent section
    const fallbackData = { custom: "test" };
    const missing = await getHomepageSection("nonexistent_section_key_xyz", fallbackData);
    assert(missing.custom === "test", "getHomepageSection gracefully falls back for nonexistent key");

    // Test 3: updateHomepageSection updates hero and writes Audit Log
    const updatedHero: HeroCMSData = {
      ...hero,
      eyebrow: "TAMIL NADU • HERBAL APOTHECARY",
      title: "Sacred Botanical Formulations",
      italicTitle: "for Eternal Skin Radiance",
      subtitle: "Pure cold-processed herbal soaps from Madurai soil.",
    };
    await updateHomepageSection("hero", updatedHero as unknown as Record<string, unknown>);
    const verifyHero = await getHomepageSection<HeroCMSData>("hero", DEFAULT_HERO_DATA);
    assert(
      verifyHero.title === "Sacred Botanical Formulations" &&
        verifyHero.eyebrow === "TAMIL NADU • HERBAL APOTHECARY",
      "updateHomepageSection persists hero updates"
    );

    const auditLog = await prisma.adminAuditLog.findFirst({
      where: {
        action: "UPDATE_HOMEPAGE",
        entityId: "hero",
      },
      orderBy: { createdAt: "desc" },
    });
    assert(
      !!(auditLog && auditLog.details?.includes("Sacred Botanical Formulations")),
      "updateHomepageSection generates AdminAuditLog entry"
    );

    // Test 4: updateHomepageSection updates announcement bar
    const announcement: AnnouncementCMSData = {
      enabled: true,
      text: "Festive Special • Complimentary Vetiver bath soap on all orders above ₹1,999",
      freeShippingThreshold: 1999,
    };
    await updateHomepageSection("announcement", announcement as unknown as Record<string, unknown>);
    const verifyAnnounce = await getHomepageSection<AnnouncementCMSData>(
      "announcement",
      DEFAULT_ANNOUNCEMENT_DATA
    );
    assert(
      verifyAnnounce.freeShippingThreshold === 1999 &&
        verifyAnnounce.text.includes("Complimentary Vetiver"),
      "updateHomepageSection persists announcement settings"
    );

    // Test 5: createMediaAssetRecord registers a new media asset
    const testAsset = await createMediaAssetRecord({
      filename: "test_vetiver_harvest.jpg",
      url: "/uploads/test_vetiver_harvest.jpg",
      mimeType: "image/jpeg",
      fileSize: 245000,
      altText: "Hand-harvested fresh vetiver roots in Cuddalore",
      width: 1200,
      height: 800,
    });
    assert(
      testAsset.id.length > 0 && testAsset.url === "/uploads/test_vetiver_harvest.jpg",
      "createMediaAssetRecord persists valid media asset"
    );

    // Test 6: getMediaAssets returns paginated listing with search
    const assetList = await getMediaAssets({ search: "vetiver" });
    assert(
      assetList.assets.length > 0 &&
        assetList.assets.some((a) => a.filename === "test_vetiver_harvest.jpg"),
      "getMediaAssets filters and returns matching media assets"
    );

    // Test 7: deleteMediaAsset rejects deletion if referenced by a product
    // Attach test asset to an existing product
    const anyProduct = await prisma.product.findFirst();
    if (anyProduct) {
      await prisma.product.update({
        where: { id: anyProduct.id },
        data: { featuredImage: testAsset.url },
      });

      let productRefError = false;
      try {
        await deleteMediaAsset(testAsset.id);
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes("Cannot delete asset")) {
          productRefError = true;
        }
      }
      assert(
        productRefError,
        "deleteMediaAsset rejects deletion when asset is referenced by a product"
      );

      // Clean up product reference
      await prisma.product.update({
        where: { id: anyProduct.id },
        data: { featuredImage: "/images/hero-hair-oil.jpg" },
      });
    }

    // Test 8: deleteMediaAsset rejects deletion if referenced by hero content
    await updateHomepageSection("hero", {
      ...updatedHero,
      imageDesktop: testAsset.url,
    } as unknown as Record<string, unknown>);

    let heroRefError = false;
    try {
      await deleteMediaAsset(testAsset.id);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("Cannot delete asset")) {
        heroRefError = true;
      }
    }
    assert(
      heroRefError,
      "deleteMediaAsset rejects deletion when asset is referenced by Homepage Hero"
    );

    // Test 9: deleteMediaAsset successfully deletes unreferenced asset
    // Reset hero to default image
    await updateHomepageSection("hero", {
      ...updatedHero,
      imageDesktop: "/images/hero-hair-oil.jpg",
    } as unknown as Record<string, unknown>);

    const deleteResult = await deleteMediaAsset(testAsset.id);
    const checkDeleted = await prisma.mediaAsset.findUnique({
      where: { id: testAsset.id },
    });
    assert(
      deleteResult.success && checkDeleted === null,
      "deleteMediaAsset successfully removes unreferenced media asset"
    );

    // Teardown: Restore default CMS configurations for test idempotency
    await updateHomepageSection("hero", DEFAULT_HERO_DATA as unknown as Record<string, unknown>);
    await updateHomepageSection(
      "announcement",
      DEFAULT_ANNOUNCEMENT_DATA as unknown as Record<string, unknown>
    );
  } catch (error) {
    console.error("Test execution failed with error:", error);
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
