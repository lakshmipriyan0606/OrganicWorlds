import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "pow_session";
const SESSION_EXPIRATION = "7d";

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "pavishna-dev-secret-super-secure-at-least-32-chars-long";
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
  name: string;
}

/**
 * Signs and creates an encrypted JWT session token.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secretKey = getSecretKey();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(secretKey);
}

/**
 * Decodes and verifies a JWT session token.
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
    };
  } catch {
    return null;
  }
}

/**
 * Retrieves the currently authenticated session from request cookies.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
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
