import { NextRequest } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { createSessionToken, verifySessionWithDb, verifySessionToken } from "../src/lib/auth";
import { getEmailHistory, clearEmailHistory } from "../src/lib/services/email-service";
import { POST as forgotPasswordHandler } from "../src/app/api/auth/forgot-password/route";
import { POST as resetPasswordHandler } from "../src/app/api/auth/reset-password/route";

interface TestSummary {
  passed: number;
  failed: number;
  results: { testName: string; passed: boolean; detail?: string }[];
}

const summary: TestSummary = {
  passed: 0,
  failed: 0,
  results: [],
};

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    summary.passed++;
    summary.results.push({ testName, passed: true });
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (detail) console.error(`     Detail: ${detail}`);
    summary.failed++;
    summary.results.push({ testName, passed: false, detail });
  }
}

async function runPasswordResetTests() {
  console.log("===============================================================");
  console.log("🌿 CUSTOMER PASSWORD RECOVERY & SESSION REVOCATION TEST SUITE");
  console.log("===============================================================\n");

  const timestamp = Date.now();
  const testEmail = `patron_reset_${timestamp}@pavishnaorganicworlds.com`;
  const initialPassword = "InitialPatronSecret2026!";
  const newPassword = "UpdatedSecurePatron2026!Blessed";

  try {
    // -------------------------------------------------------------
    // SETUP: Provision test customer in database
    // -------------------------------------------------------------
    const initialHash = await bcrypt.hash(initialPassword, 10);
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: initialHash,
        name: "Test Recovery Patron",
        role: "CUSTOMER",
        tokenVersion: 1,
      },
    });

    console.log("--- 1. Cryptographic Token Generation & Hashed Storage ---");

    clearEmailHistory();

    // 1.1 Request password reset
    const forgotReq = new NextRequest("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.100",
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const forgotRes = await forgotPasswordHandler(forgotReq);
    const forgotData = await forgotRes.json();

    assert(
      forgotRes.status === 200,
      "Forgot-password endpoint returns HTTP 200",
      `Expected 200, got ${forgotRes.status}`
    );

    assert(
      forgotData.success === true && typeof forgotData.message === "string",
      "Generic success message returned without leaking user internal state"
    );

    // 1.2 Inspect email service dispatch
    const history = getEmailHistory();
    assert(history.length === 1, "Password recovery email was dispatched to email provider");
    assert(history[0].to === testEmail, `Recipient matches target user (${testEmail})`);

    const resetUrl = history[0].resetUrl;
    const rawToken = new URL(resetUrl).searchParams.get("token");
    assert(
      !!rawToken && rawToken.length === 64,
      "Generated token is 64 hex characters (256 bits of cryptographic entropy)"
    );

    // 1.3 Verify database token storage is SHA-256 hashed, not plaintext
    const expectedHash = crypto.createHash("sha256").update(rawToken!).digest("hex");
    const storedRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: expectedHash },
    });

    assert(
      !!storedRecord,
      "Database contains matching record indexed by SHA-256 hash"
    );

    assert(
      storedRecord?.tokenHash !== rawToken,
      "Plaintext token is never stored in database (only SHA-256 hash persisted)"
    );

    assert(
      storedRecord?.usedAt === null,
      "New reset token initialized with usedAt = null"
    );

    // -------------------------------------------------------------
    // CHECK 2: Unknown Email Protection (Zero Account Enumeration)
    // -------------------------------------------------------------
    console.log("\n--- 2. Unknown Email Protection (Anti-Enumeration) ---");
    clearEmailHistory();

    const unknownReq = new NextRequest("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.101",
      },
      body: JSON.stringify({ email: `unregistered_${timestamp}@unknown-sanctuary.invalid` }),
    });

    const unknownRes = await forgotPasswordHandler(unknownReq);
    const unknownData = await unknownRes.json();

    assert(
      unknownRes.status === 200,
      "Unknown email returns identical HTTP 200",
      `Expected 200, got ${unknownRes.status}`
    );

    assert(
      unknownData.message === forgotData.message,
      "Unknown email response message exactly matches registered email response (zero enumeration)"
    );

    assert(
      getEmailHistory().length === 0,
      "Zero emails dispatched for unregistered email address"
    );

    // -------------------------------------------------------------
    // CHECK 3: Active Session Invalidation & Revocation
    // -------------------------------------------------------------
    console.log("\n--- 3. Session Revocation on Password Reset ---");

    // Create an active session token before password reset
    const preResetSessionToken = await createSessionToken({
      userId: testUser.id,
      email: testUser.email,
      role: "CUSTOMER",
      name: testUser.name,
      tokenVersion: testUser.tokenVersion,
    });

    // Verify it is initially valid
    const preSessionValid = await verifySessionWithDb(preResetSessionToken);
    assert(
      preSessionValid !== null && preSessionValid.userId === testUser.id,
      "Pre-reset session token is initially valid against active user tokenVersion"
    );

    // -------------------------------------------------------------
    // CHECK 4: Valid Password Reset Execution
    // -------------------------------------------------------------
    console.log("\n--- 4. Valid Password Reset Execution ---");

    const resetReq = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.102",
      },
      body: JSON.stringify({
        token: rawToken,
        password: newPassword,
      }),
    });

    const resetRes = await resetPasswordHandler(resetReq);
    const resetData = await resetRes.json();

    assert(
      resetRes.status === 200,
      "Reset-password endpoint returns HTTP 200",
      `Expected 200, got ${resetRes.status}`
    );

    assert(
      resetData.success === true,
      "Reset-password response confirms success"
    );

    // Verify user password hash in DB matches new password
    const updatedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
    });

    assert(
      await bcrypt.compare(newPassword, updatedUser!.passwordHash),
      "User password in real database matches new bcrypt hash"
    );

    assert(
      !(await bcrypt.compare(initialPassword, updatedUser!.passwordHash)),
      "Previous password is no longer accepted"
    );

    assert(
      updatedUser!.tokenVersion === 2,
      "User tokenVersion incremented from 1 to 2 upon password reset"
    );

    // Verify token record is now marked as used
    const postConsumedRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: expectedHash },
    });

    assert(
      postConsumedRecord?.usedAt !== null,
      "Token record marked usedAt with timestamp upon successful password reset"
    );

    // Verify pre-reset session is NOW INVALIDATED
    const postSessionCheck = await verifySessionWithDb(preResetSessionToken);
    assert(
      postSessionCheck === null,
      "Pre-reset session token is now rejected by verifySessionWithDb (session successfully revoked)"
    );

    // Verify newly issued session with updated tokenVersion is valid
    const newSessionToken = await createSessionToken({
      userId: updatedUser!.id,
      email: updatedUser!.email,
      role: "CUSTOMER",
      name: updatedUser!.name,
      tokenVersion: updatedUser!.tokenVersion,
    });
    const newSessionCheck = await verifySessionWithDb(newSessionToken);
    assert(
      newSessionCheck !== null && newSessionCheck.tokenVersion === 2,
      "New session token issued with updated tokenVersion is valid"
    );

    // -------------------------------------------------------------
    // CHECK 5: Token Reuse Prevention (Single-Use Guarantee)
    // -------------------------------------------------------------
    console.log("\n--- 5. Token Reuse Prevention (Single-Use) ---");

    const reuseReq = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.103",
      },
      body: JSON.stringify({
        token: rawToken,
        password: "YetAnotherPassword2026!Extra",
      }),
    });

    const reuseRes = await resetPasswordHandler(reuseReq);
    const reuseData = await reuseRes.json();

    assert(
      reuseRes.status === 400,
      "Reusing already consumed token is rejected with HTTP 400",
      `Expected 400, got ${reuseRes.status}`
    );

    assert(
      typeof reuseData.error === "string",
      "Informative error returned when token reuse is attempted"
    );

    // -------------------------------------------------------------
    // CHECK 6: Expired Token Rejection
    // -------------------------------------------------------------
    console.log("\n--- 6. Expired Token Rejection ---");

    // Create an intentionally expired token directly in DB
    const expiredRawToken = crypto.randomBytes(32).toString("hex");
    const expiredTokenHash = crypto.createHash("sha256").update(expiredRawToken).digest("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId: testUser.id,
        tokenHash: expiredTokenHash,
        expiresAt: new Date(Date.now() - 1000 * 60 * 30), // Expired 30 minutes ago
      },
    });

    const expiredReq = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.104",
      },
      body: JSON.stringify({
        token: expiredRawToken,
        password: "AnotherNewPassword2026!",
      }),
    });

    const expiredRes = await resetPasswordHandler(expiredReq);
    assert(
      expiredRes.status === 400,
      "Expired token is rejected with HTTP 400",
      `Expected 400, got ${expiredRes.status}`
    );

    // -------------------------------------------------------------
    // CHECK 7: Invalid / Forged Token Rejection
    // -------------------------------------------------------------
    console.log("\n--- 7. Invalid & Forged Token Rejection ---");

    const forgedReq = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.105",
      },
      body: JSON.stringify({
        token: "completely_fake_and_forged_reset_token_00000000000000000000000000",
        password: "ValidPassword123!",
      }),
    });

    const forgedRes = await resetPasswordHandler(forgedReq);
    assert(
      forgedRes.status === 400,
      "Forged/non-existent token is rejected with HTTP 400",
      `Expected 400, got ${forgedRes.status}`
    );

    // Weak password rejected
    const weakReq = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.106",
      },
      body: JSON.stringify({
        token: "some_token",
        password: "short",
      }),
    });
    const weakRes = await resetPasswordHandler(weakReq);
    assert(
      weakRes.status === 400,
      "Weak password (<8 characters) on reset is rejected with HTTP 400"
    );

    // -------------------------------------------------------------
    // CHECK 8: Rate Limiting Enforcement
    // -------------------------------------------------------------
    console.log("\n--- 8. Rate Limiting Enforcement ---");

    const rateLimitedIp = "192.168.1.250";
    let hit429 = false;

    // Send 6 requests rapidly with same IP (limit is 5)
    for (let i = 0; i < 6; i++) {
      const rlReq = new NextRequest("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": rateLimitedIp,
        },
        body: JSON.stringify({ email: testEmail }),
      });

      const rlRes = await forgotPasswordHandler(rlReq);
      if (rlRes.status === 429) {
        hit429 = true;
        break;
      }
    }

    assert(
      hit429,
      "Exceeding forgot-password rate limit triggers HTTP 429 Too Many Requests"
    );

    // Cleanup test user
    await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});

  } catch (error) {
    console.error("Test execution failed with unhandled exception:", error);
    summary.failed++;
  }

  console.log("\n===============================================================");
  console.log(`PASSWORD RECOVERY SUITE: ${summary.passed} PASSED, ${summary.failed} FAILED`);
  console.log("===============================================================\n");

  if (summary.failed > 0) {
    process.exit(1);
  }
}

runPasswordResetTests();
