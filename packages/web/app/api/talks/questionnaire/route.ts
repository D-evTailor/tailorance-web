import { NextResponse } from "next/server";
import { z } from "zod";

const MIN_FORM_COMPLETION_MS = 3_000;
const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 6;
const SUPABASE_TIMEOUT_MS = 8_000;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_BLOCK_MS = 5 * 60_000;

type RateLimitEntry = {
  count: number;
  windowStartedAt: number;
  blockedUntil: number;
  lastSeenAt: number;
};

const requestSchema = z.object({
  specialty: z.enum(["otorrinolaringologia", "hematologia"]),
  answers: z.object({
    q1_profile: z.string().trim().min(1).max(120),
    q2_main_pain: z.array(z.string().trim().min(1).max(160)).min(1).max(2),
    q2_other: z.string().trim().max(300),
    q3_repetitive_tasks: z.array(z.string().trim().min(1).max(160)).min(1).max(2),
    q3_other: z.string().trim().max(300),
    q4_1_ai_usage: z.string().trim().min(1).max(120),
    q4_2_used_tools: z.array(z.string().trim().min(1).max(160)).min(1).max(5),
    q4_2_other: z.string().trim().max(300),
    q5_assistant_help: z.array(z.string().trim().min(1).max(160)).min(1).max(2),
    q5_other: z.string().trim().max(300),
    q6_main_barrier: z.string().trim().min(1).max(160),
    q7_use_cases: z.array(z.string().trim().min(1).max(200)).min(1).max(2),
    q7_other: z.string().trim().max(300),
    q8_1_open_answer: z.string().trim().min(1).max(2_000),
    q8_2_open_answer: z.string().trim().min(1).max(2_000),
  }),
  meta: z.object({
    startedAt: z.number().int().positive(),
    honeypot: z.string().max(0).optional().default(""),
  }),
});

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function getNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value <= 0) return fallback;
  return value;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function getCurrentOrigin(request: Request): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  if (!host) return "";
  return `${proto}://${host}`;
}

function getAllowedOrigins(request: Request): Set<string> {
  const envOrigins = process.env.QUESTIONNAIRE_ALLOWED_ORIGINS;
  const origins = new Set<string>();
  if (envOrigins) {
    for (const origin of envOrigins.split(",")) {
      const trimmed = origin.trim();
      if (trimmed) origins.add(trimmed);
    }
  }
  const currentOrigin = getCurrentOrigin(request);
  if (currentOrigin) origins.add(currentOrigin);
  return origins;
}

function validateOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  const allowedOrigins = getAllowedOrigins(request);
  return allowedOrigins.has(origin);
}

function getRateLimitStore(): Map<string, RateLimitEntry> {
  const globalState = globalThis as typeof globalThis & {
    __questionnaireRateLimitStore?: Map<string, RateLimitEntry>;
  };
  if (!globalState.__questionnaireRateLimitStore) {
    globalState.__questionnaireRateLimitStore = new Map<string, RateLimitEntry>();
  }
  return globalState.__questionnaireRateLimitStore;
}

function cleanupRateLimitStore(store: Map<string, RateLimitEntry>, now: number): void {
  const staleMs = RATE_LIMIT_BLOCK_MS * 2;
  for (const [key, entry] of store.entries()) {
    if (now - entry.lastSeenAt > staleMs) {
      store.delete(key);
    }
  }
}

function enforceRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const windowMs = getNumberEnv("QUESTIONNAIRE_RATE_LIMIT_WINDOW_MS", DEFAULT_RATE_LIMIT_WINDOW_MS);
  const maxRequests = getNumberEnv("QUESTIONNAIRE_RATE_LIMIT_MAX", DEFAULT_RATE_LIMIT_MAX_REQUESTS);
  const store = getRateLimitStore();
  cleanupRateLimitStore(store, now);

  const current = store.get(ip);
  if (current?.blockedUntil && current.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.blockedUntil - now) / 1000),
    };
  }

  if (!current || now - current.windowStartedAt > windowMs) {
    store.set(ip, {
      count: 1,
      windowStartedAt: now,
      blockedUntil: 0,
      lastSeenAt: now,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;
  current.lastSeenAt = now;
  if (current.count > maxRequests) {
    current.blockedUntil = now + RATE_LIMIT_BLOCK_MS;
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(RATE_LIMIT_BLOCK_MS / 1000),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function POST(request: Request) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  }

  const clientIp = getClientIp(request);
  const rateLimit = enforceRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intentalo de nuevo en unos minutos." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type invalido." }, { status: 415 });
  }

  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
    }

    const elapsedMs = Date.now() - parsed.data.meta.startedAt;
    if (elapsedMs < MIN_FORM_COMPLETION_MS) {
      return NextResponse.json({ error: "Envio sospechoso detectado." }, { status: 400 });
    }
    if (elapsedMs > MAX_FORM_AGE_MS) {
      return NextResponse.json(
        { error: "Formulario expirado. Recarga la pagina e intentalo de nuevo." },
        { status: 400 },
      );
    }

    const supabaseUrl = getEnv("SUPABASE_URL");
    const supabaseServiceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

    const insertPayload = {
      specialty: parsed.data.specialty,
      answers: parsed.data.answers,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SUPABASE_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(`${supabaseUrl}/rest/v1/talks_questionnaire_responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseServiceRoleKey,
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(insertPayload),
        cache: "no-store",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const details = await response.text();
      console.error("[questionnaire] Supabase insert failed", {
        status: response.status,
        details,
      });
      return NextResponse.json(
        { error: "No se pudo guardar el cuestionario." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Tiempo de espera agotado." }, { status: 504 });
    }
    console.error("[questionnaire] Unexpected error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Error interno al guardar el cuestionario." },
      { status: 500 },
    );
  }
}
