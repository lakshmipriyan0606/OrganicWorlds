import { prisma } from "@/lib/prisma";

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currencyCode: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  razorpayKeyId: string;
  webhookEndpoint: string;
  taxRate: number;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Pavishna Organic Worlds",
  supportEmail: "care@pavishna.in",
  supportPhone: "+91 98765 43210",
  currencyCode: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 1500,
  standardShippingFee: 99,
  razorpayKeyId: "rzp_test_placeholder_key",
  webhookEndpoint: "/api/webhooks/razorpay",
  taxRate: 0,
};

/**
 * Retrieve current store settings, merged with defaults
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const rows = await prisma.setting.findMany();
    const map = new Map<string, string>();
    for (const row of rows) {
      map.set(row.key, row.value);
    }

    return {
      storeName: map.get("storeName") ?? DEFAULT_SETTINGS.storeName,
      supportEmail: map.get("supportEmail") ?? DEFAULT_SETTINGS.supportEmail,
      supportPhone: map.get("supportPhone") ?? DEFAULT_SETTINGS.supportPhone,
      currencyCode: map.get("currencyCode") ?? DEFAULT_SETTINGS.currencyCode,
      currencySymbol: map.get("currencySymbol") ?? DEFAULT_SETTINGS.currencySymbol,
      freeShippingThreshold: map.has("freeShippingThreshold")
        ? Number(map.get("freeShippingThreshold"))
        : DEFAULT_SETTINGS.freeShippingThreshold,
      standardShippingFee: map.has("standardShippingFee")
        ? Number(map.get("standardShippingFee"))
        : DEFAULT_SETTINGS.standardShippingFee,
      razorpayKeyId: map.get("razorpayKeyId") ?? DEFAULT_SETTINGS.razorpayKeyId,
      webhookEndpoint: map.get("webhookEndpoint") ?? DEFAULT_SETTINGS.webhookEndpoint,
      taxRate: map.has("taxRate")
        ? Number(map.get("taxRate"))
        : DEFAULT_SETTINGS.taxRate,
    };
  } catch (error) {
    console.error("Failed to fetch store settings from DB:", error);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Persist updated store settings to the database
 */
export async function updateStoreSettings(
  input: Partial<StoreSettings>,
  actorEmail?: string
): Promise<StoreSettings> {
  await prisma.$transaction(
    async (tx) => {
      for (const [key, val] of Object.entries(input)) {
        if (val !== undefined) {
          await tx.setting.upsert({
            where: { key },
            update: { value: String(val) },
            create: { key, value: String(val) },
          });
        }
      }

      if (actorEmail) {
        await tx.adminAuditLog.create({
          data: {
            action: "UPDATE_SETTINGS",
            entityType: "SETTINGS",
            entityId: "store_settings",
            details: JSON.stringify(input),
          },
        });
      }
    },
    { timeout: 15000 }
  );

  return await getStoreSettings();
}
