import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "pow_session";
const SESSION_EXPIRATION = "7d";

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: AUTH_SECRET environment variable is missing in production environment");
    }
    return new TextEncoder().encode("pavishna-dev-secret-super-secure-at-least-32-chars-long");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
  name: string;
  tokenVersion?: number;
}

/**
 * Signs and creates an encrypted JWT session token.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secretKey = getSecretKey();
  return await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    name: payload.name,
    tokenVersion: payload.tokenVersion ?? 1,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(secretKey);
}

/**
 * Decodes and verifies a JWT session token signature.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: (payload.role as "CUSTOMER" | "ADMIN" | "STAFF") || "CUSTOMER",
      name: payload.name as string,
      tokenVersion: typeof payload.tokenVersion === "number" ? payload.tokenVersion : 1,
    };
  } catch {
    return null;
  }
}

/**
 * Decodes and verifies a JWT session token and ensures it has not been revoked (checks tokenVersion in DB).
 */
export async function verifySessionWithDb(token: string): Promise<SessionPayload | null> {
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { tokenVersion: true },
    });
    if (!user) return null;

    const currentTokenVersion = user.tokenVersion ?? 1;
    const sessionTokenVersion = payload.tokenVersion ?? 1;

    if (sessionTokenVersion !== currentTokenVersion) {
      // Session has been invalidated due to a password reset or manual revocation
      return null;
    }
  } catch (err) {
    console.error("Database session validation error:", err);
    return null;
  }

  return payload;
}

/**
 * Retrieves the currently authenticated session from request cookies, validating against DB revocation list.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionWithDb(token);
}

/**
 * Sets an HTTP-only, SameSite=Lax secure session cookie.
 */
export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });
}

/**
 * Clears the session cookie upon logout.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Enforces authenticated session; returns session or throws Error.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Enforces admin authorization; returns session or throws Error.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
