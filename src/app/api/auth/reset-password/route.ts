import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations";
import { checkRateLimitAsync } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimitKey = `reset-password:${ip}`;

    // Rate-limit token verification: max 10 requests per 15-minute window
    const rateLimit = await checkRateLimitAsync(rateLimitKey, {
      maxRequests: 10,
      intervalMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many password reset attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetInMs / 1000).toString(),
          },
        }
      );
    }

    const body = await req.json().catch(() => null);
    const validated = resetPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, password } = validated.data;

    // Hash the submitted token to match stored SHA-256 hash
    const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");

    // Retrieve token record
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    // Check validity: must exist, not be already used, and not expired
    if (!resetRecord) {
      return NextResponse.json(
        { error: "Invalid or expired password reset token" },
        { status: 400 }
      );
    }

    if (resetRecord.usedAt !== null) {
      return NextResponse.json(
        { error: "This password reset token has already been used. Please request a new link." },
        { status: 400 }
      );
    }

    if (new Date() > resetRecord.expiresAt) {
      return NextResponse.json(
        { error: "This password reset token has expired. Please request a new link." },
        { status: 400 }
      );
    }

    // Cryptographically hash the new password using bcrypt (cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // Atomically consume token, update password, and increment tokenVersion to revoke all active sessions
    await prisma.$transaction(async (tx) => {
      // 1. Mark token as consumed
      await tx.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      });

      // 2. Update user's password and increment tokenVersion (invalidates all existing JWT sessions)
      await tx.user.update({
        where: { id: resetRecord.userId },
        data: {
          passwordHash,
          tokenVersion: { increment: 1 },
        },
      });

      // 3. Clean up any remaining reset tokens for this user
      await tx.passwordResetToken.deleteMany({
        where: {
          userId: resetRecord.userId,
          id: { not: resetRecord.id },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Password has been successfully updated. Please sign in with your new credentials.",
    });
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
