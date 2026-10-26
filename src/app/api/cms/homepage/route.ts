import { NextResponse } from "next/server";
import {
  getHomepageSection,
  DEFAULT_HERO_DATA,
  DEFAULT_ANNOUNCEMENT_DATA,
  HeroCMSData,
  AnnouncementCMSData,
} from "@/lib/services/cms-service";

export async function GET() {
  try {
    const [hero, announcement] = await Promise.all([
      getHomepageSection<HeroCMSData>("hero", DEFAULT_HERO_DATA),
      getHomepageSection<AnnouncementCMSData>("announcement", DEFAULT_ANNOUNCEMENT_DATA),
    ]);

    return NextResponse.json({
      success: true,
      hero,
      announcement,
    });
  } catch (error) {
    console.error("Public CMS homepage GET error:", error);
    return NextResponse.json({
      success: true,
      hero: DEFAULT_HERO_DATA,
      announcement: DEFAULT_ANNOUNCEMENT_DATA,
    });
  }
}
