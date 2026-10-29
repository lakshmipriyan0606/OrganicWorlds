import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { checkRateLimitAsync } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/services/email-service";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimitKey = `forgot-password:${ip}`;

    // Rate-limit: max 5 requests per 15-minute window
    const rateLimit = await checkRateLimitAsync(rateLimitKey, {
      maxRequests: 5,
      intervalMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many password recovery requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetInMs / 1000).toString(),
          },
        }
      );
    }

    const body = await req.json().catch(() => null);
    const validated = forgotPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email } = validated.data;
    const cleanEmail = email.trim().toLowerCase();

    // Look up user by email
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (user) {
      // 1. Generate cryptographically secure random token (256-bit entropy)
      const rawToken = crypto.randomBytes(32).toString("hex");

      // 2. Hash token with SHA-256 before persisting to database
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

      // 3. Invalidate/delete any previous unused reset tokens for this user
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      // 4. Store single-use, 1-hour time-limited token
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      // 5. Construct reset URL
      const hostHeader = req.headers.get("host") || "localhost:3000";
      const protocol = req.headers.get("x-forwarded-proto") || (hostHeader.includes("localhost") ? "http" : "https");
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${hostHeader}`;
      const baseUrl = appUrl.replace(/\/$/, "");
      const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

      // 6. Send email via email service
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    }

    // Always return generic identical 200 response to prevent account enumeration
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email address, password reset instructions have been sent.",
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
