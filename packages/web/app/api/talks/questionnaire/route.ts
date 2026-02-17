import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  specialty: z.enum(["otorrinolaringologia", "hematologia"]),
  answers: z.object({
    q1_profile: z.string().min(1),
    q2_main_pain: z.array(z.string()).min(1).max(2),
    q2_other: z.string(),
    q3_repetitive_tasks: z.array(z.string()).min(1),
    q3_other: z.string(),
    q4_ai_usage: z.string().min(1),
    q5_ideal_ai_help: z.array(z.string()).min(1).max(2),
    q6_first_use_case: z.string().min(1),
    q7_main_barrier: z.string().min(1),
    q8_open_answer: z.string().min(1),
  }),
});

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Payload invalido", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const supabaseUrl = getEnv("SUPABASE_URL");
    const supabaseServiceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

    const insertPayload = {
      specialty: parsed.data.specialty,
      answers: parsed.data.answers,
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/talks_questionnaire_responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(insertPayload),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { error: "No se pudo guardar en Supabase", details },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error interno al guardar el cuestionario",
      },
      { status: 500 },
    );
  }
}
