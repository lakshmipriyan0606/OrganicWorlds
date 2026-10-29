export interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export interface RateLimitOptions {
  intervalMs?: number;
  maxRequests?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

/**
 * Shared-store adapter interface for distributed rate limiting across serverless/clustered instances.
 */
export interface RateLimitStoreAdapter {
  getOrIncrement(
    key: string,
    intervalMs: number
  ): Promise<RateLimitRecord> | RateLimitRecord;
}

/**
 * In-memory sliding-window store (ideal for single-instance, local development, and CI tests).
 */
class MemoryRateLimitStore implements RateLimitStoreAdapter {
  private store = new Map<string, RateLimitRecord>();

  constructor() {
    if (typeof setInterval !== "undefined") {
      const timer = setInterval(() => {
        const now = Date.now();
        for (const [key, record] of this.store.entries()) {
          if (record.resetAt <= now) {
            this.store.delete(key);
          }
        }
      }, 60000);
      if (typeof timer.unref === "function") {
        timer.unref();
      }
    }
  }

  getOrIncrement(key: string, intervalMs: number): RateLimitRecord {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.resetAt <= now) {
      const freshRecord: RateLimitRecord = {
        count: 1,
        resetAt: now + intervalMs,
      };
      this.store.set(key, freshRecord);
      return freshRecord;
    }

    record.count += 1;
    return record;
  }
}

/**
 * Remote Redis / Upstash REST distributed store adapter for multi-instance production environments.
 */
class UpstashRedisRateLimitStore implements RateLimitStoreAdapter {
  private url: string;
  private token: string;

  constructor(url: string, token: string) {
    this.url = url.replace(/\/$/, "");
    this.token = token;
  }

  async getOrIncrement(key: string, intervalMs: number): Promise<RateLimitRecord> {
    const now = Date.now();
    const ttlSeconds = Math.ceil(intervalMs / 1000);

    try {
      // INCR key and EXPIRE if new
      const pipelineRes = await fetch(`${this.url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["PTTL", key],
        ]),
      });

      if (!pipelineRes.ok) {
        throw new Error(`Upstash pipeline error: ${pipelineRes.statusText}`);
      }

      const results = await pipelineRes.json();
      const count = results[0]?.result ?? 1;
      let pttl = results[1]?.result ?? -1;

      // If key had no TTL (-1 or -2), set expiration
      if (pttl <= 0) {
        await fetch(`${this.url}/EXPIRE/${encodeURIComponent(key)}/${ttlSeconds}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        pttl = intervalMs;
      }

      return {
        count,
        resetAt: now + pttl,
      };
    } catch (err) {
      console.warn("Distributed rate limiter unavailable, falling back to local memory store:", err);
      return memoryStore.getOrIncrement(key, intervalMs);
    }
  }
}

const memoryStore = new MemoryRateLimitStore();

function getStoreAdapter(): RateLimitStoreAdapter {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    return new UpstashRedisRateLimitStore(upstashUrl, upstashToken);
  }

  return memoryStore;
}

/**
 * Synchronous in-memory rate limiter for backwards compatibility and instant evaluations.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const intervalMs = options.intervalMs || 60000;
  const maxRequests = options.maxRequests || 10;
  const now = Date.now();

  const record = memoryStore.getOrIncrement(identifier, intervalMs);

  if (record.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - record.count),
    resetInMs: Math.max(0, record.resetAt - now),
  };
}

/**
 * Asynchronous shared-store rate limiter supporting distributed production deployments (Upstash / Redis).
 */
export async function checkRateLimitDistributed(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const intervalMs = options.intervalMs || 60000;
  const maxRequests = options.maxRequests || 10;
  const now = Date.now();

  const store = getStoreAdapter();
  const record = await store.getOrIncrement(identifier, intervalMs);

  if (record.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - record.count),
    resetInMs: Math.max(0, record.resetAt - now),
  };
}

export const checkRateLimitAsync = checkRateLimitDistributed;

