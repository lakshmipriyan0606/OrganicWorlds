import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getHomepageSection,
  updateHomepageSection,
  DEFAULT_HERO_DATA,
  DEFAULT_ANNOUNCEMENT_DATA,
  HeroCMSData,
  AnnouncementCMSData,
} from "@/lib/services/cms-service";

export async function GET() {
  try {
    await requireAdmin();

    const [hero, announcement] = await Promise.all([
      getHomepageSection<HeroCMSData>("hero", DEFAULT_HERO_DATA),
      getHomepageSection<AnnouncementCMSData>("announcement", DEFAULT_ANNOUNCEMENT_DATA),
    ]);

    return NextResponse.json({
      success: true,
      cms: {
        hero,
        announcement,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Admin homepage GET error:", error);
    return NextResponse.json({ error: "Failed to fetch homepage content" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    if (body.hero) {
      await updateHomepageSection("hero", body.hero, session.userId);
    }

    if (body.announcement) {
      await updateHomepageSection("announcement", body.announcement, session.userId);
    }

    return NextResponse.json({
      success: true,
      message: "Homepage content updated successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Admin homepage PUT error:", error);
    return NextResponse.json({ error: "Failed to update homepage content" }, { status: 500 });
  }
}
