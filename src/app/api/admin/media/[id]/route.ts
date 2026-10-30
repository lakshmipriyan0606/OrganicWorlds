import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteMediaAsset } from "@/lib/services/cms-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();

    const { id } = await params;
    await deleteMediaAsset(id);

    return NextResponse.json({
      success: true,
      message: "Media asset deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const message = error instanceof Error ? error.message : "Failed to delete media asset";
    const status = message.includes("Cannot delete asset") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
