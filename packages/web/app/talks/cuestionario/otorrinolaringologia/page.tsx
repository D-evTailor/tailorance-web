"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type QuestionnairePayload = {
  specialty: "otorrinolaringologia";
  answers: {
    q1_profile: string;
    q2_main_pain: string[];
    q2_other: string;
    q3_repetitive_tasks: string[];
    q3_other: string;
    q4_ai_usage: string;
    q5_ideal_ai_help: string[];
    q6_first_use_case: string;
    q7_main_barrier: string;
    q8_open_answer: string;
  };
};

type Errors = Partial<Record<keyof QuestionnairePayload["answers"], string>>;

const q1Options = [
  "Residente",
  "Especialista joven (<5 anos)",
  "Especialista (5-15 anos)",
  "Especialista senior (>15 anos)",
  "Jefe de servicio / coordinacion",
];

const q2Options = [
  "Redaccion de informes clinicos",
  "Historia clinica y documentacion",
  "Burocracia administrativa",
  "Listas de espera y gestion de pacientes",
  "Preparacion de sesiones o clases",
  "Investigacion y articulos",
  "Quirofano (gestion, informes, programacion)",
  "Comunicacion con pacientes",
  "Revision de pruebas e imagenes",
  "Otro",
];

const q3Options = [
  "Informes de consulta",
  "Informes quirurgicos",
  "Consentimientos informados",
  "Respuestas a pacientes",
  "Informes para primaria",
  "Informes de pruebas (audiometrias, TAC, etc.)",
  "Presentaciones o sesiones clinicas",
  "Ninguna en especial",
  "Otra",
];

const q4Options = [
  "Si, de forma habitual",
  "Si, alguna vez",
  "He oido hablar, pero no la uso",
  "No, nunca",
];

const q5Options = [
  "Escribir el informe de la consulta mientras hablo",
  "Resumir la historia clinica del paciente antes de entrar",
  "Generar informes quirurgicos",
  "Preparar documentos para el paciente",
  "Sugerir diagnosticos diferenciales",
  "Preparar sesiones clinicas o presentaciones",
  "Ayudar con articulos o investigacion",
  "Organizar agenda y listas de pacientes",
];

const q6Options = [
  "Dictar la consulta y generar el informe automatico",
  "Resumir historias clinicas largas",
  "Preparar sesiones o presentaciones",
  "Redactar articulos o proyectos",
  "Generar consentimientos o documentos",
  "Resolver dudas clinicas rapidas",
  "No me interesa usar IA",
];

const q7Options = [
  "Falta de tiempo para aprender",
  "No esta integrada en el sistema del hospital",
  "Dudas sobre privacidad de datos",
  "No se en que me podria ayudar",
  "Falta de formacion",
  "Desconfianza en los resultados",
  "Nada, la usaria si estuviera disponible",
];

function toggleArrayValue(
  current: string[],
  value: string,
  maxSelections?: number,
): { next: string[]; limitReached: boolean } {
  if (current.includes(value)) {
    return { next: current.filter((item) => item !== value), limitReached: false };
  }
  if (typeof maxSelections === "number" && current.length >= maxSelections) {
    return { next: current, limitReached: true };
  }
  return { next: [...current, value], limitReached: false };
}

export default function CuestionarioOtorrinoPage() {
  const [answers, setAnswers] = useState<QuestionnairePayload["answers"]>({
    q1_profile: "",
    q2_main_pain: [],
    q2_other: "",
    q3_repetitive_tasks: [],
    q3_other: "",
    q4_ai_usage: "",
    q5_ideal_ai_help: [],
    q6_first_use_case: "",
    q7_main_barrier: "",
    q8_open_answer: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [feedback, setFeedback] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const q2SelectedCount = answers.q2_main_pain.length;
  const q5SelectedCount = answers.q5_ideal_ai_help.length;

  const canSubmit = useMemo(() => !submitting, [submitting]);

  function validate(): Errors {
    const nextErrors: Errors = {};
    if (!answers.q1_profile) nextErrors.q1_profile = "Selecciona una opcion.";
    if (answers.q2_main_pain.length < 1) nextErrors.q2_main_pain = "Selecciona al menos una opcion.";
    if (answers.q2_main_pain.includes("Otro") && !answers.q2_other.trim()) {
      nextErrors.q2_other = "Describe la opcion 'Otro'.";
    }
    if (answers.q3_repetitive_tasks.length < 1) nextErrors.q3_repetitive_tasks = "Selecciona al menos una opcion.";
    if (answers.q3_repetitive_tasks.includes("Otra") && !answers.q3_other.trim()) {
      nextErrors.q3_other = "Describe la opcion 'Otra'.";
    }
    if (!answers.q4_ai_usage) nextErrors.q4_ai_usage = "Selecciona una opcion.";
    if (answers.q5_ideal_ai_help.length < 1) nextErrors.q5_ideal_ai_help = "Selecciona al menos una opcion.";
    if (!answers.q6_first_use_case) nextErrors.q6_first_use_case = "Selecciona una opcion.";
    if (!answers.q7_main_barrier) nextErrors.q7_main_barrier = "Selecciona una opcion.";
    if (!answers.q8_open_answer.trim()) nextErrors.q8_open_answer = "Esta respuesta es obligatoria.";
    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setFeedback("Revisa los campos marcados antes de enviar.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: QuestionnairePayload = {
        specialty: "otorrinolaringologia",
        answers,
      };

      const response = await fetch("/api/talks/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(responseData.error ?? "No se pudo guardar el cuestionario.");
      }

      setFeedback("Gracias. Tu cuestionario se ha guardado correctamente.");
      setAnswers({
        q1_profile: "",
        q2_main_pain: [],
        q2_other: "",
        q3_repetitive_tasks: [],
        q3_other: "",
        q4_ai_usage: "",
        q5_ideal_ai_help: [],
        q6_first_use_case: "",
        q7_main_barrier: "",
        q8_open_answer: "",
      });
      setErrors({});
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Ha ocurrido un error al enviar el cuestionario.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/talks" className="text-sm text-brand-300 hover:text-brand-200">
            Volver a TALKS
          </Link>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Cuestionario expres: IA para Otorrinolaringologia
            </CardTitle>
            <p className="text-gray-300 text-sm">
              Objetivo: entender que tareas del dia a dia os quitan mas tiempo y donde la IA puede
              ayudaros de forma realista. Tiempo estimado: 2-3 minutos.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-10">
              <section className="space-y-3">
                <h2 className="text-white font-semibold">1. Perfil profesional</h2>
                <p className="text-gray-300">1. Cual es tu situacion actual?</p>
                <div className="space-y-2">
                  {q1Options.map((option) => (
                    <label key={option} className="flex items-center gap-3 text-gray-200">
                      <input
                        type="radio"
                        name="q1"
                        checked={answers.q1_profile === option}
                        onChange={() => setAnswers((prev) => ({ ...prev, q1_profile: option }))}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {errors.q1_profile ? <p className="text-sm text-red-400">{errors.q1_profile}</p> : null}
              </section>

              <section className="space-y-3">
                <h2 className="text-white font-semibold">2. Dolor principal del dia a dia</h2>
                <p className="text-gray-300">
                  2. Que parte de tu trabajo te consume mas tiempo o energia mental? (elige hasta 2)
                </p>
                <div className="space-y-2">
                  {q2Options.map((option) => (
                    <label key={option} className="flex items-center gap-3 text-gray-200">
                      <input
                        type="checkbox"
                        checked={answers.q2_main_pain.includes(option)}
                        onChange={() => {
                          const result = toggleArrayValue(answers.q2_main_pain, option, 2);
                          if (result.limitReached) {
                            setFeedback("En la pregunta 2 solo puedes seleccionar hasta 2 opciones.");
                            return;
                          }
                          setFeedback("");
                          setAnswers((prev) => ({ ...prev, q2_main_pain: result.next }));
                        }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Seleccionadas: {q2SelectedCount}/2</p>
                {answers.q2_main_pain.includes("Otro") ? (
                  <input
                    type="text"
                    value={answers.q2_other}
                    onChange={(event) => setAnswers((prev) => ({ ...prev, q2_other: event.target.value }))}
                    placeholder="Especifica 'Otro'"
                    className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
                  />
                ) : null}
                {errors.q2_main_pain ? <p className="text-sm text-red-400">{errors.q2_main_pain}</p> : null}
                {errors.q2_other ? <p className="text-sm text-red-400">{errors.q2_other}</p> : null}
              </section>

              <section className="space-y-3">
                <h2 className="text-white font-semibold">3. Tareas repetitivas</h2>
                <p className="text-gray-300">
                  3. Que tarea repites tantas veces que te gustaria automatizarla?
                </p>
                <div className="space-y-2">
                  {q3Options.map((option) => (
                    <label key={option} className="flex items-center gap-3 text-gray-200">
                      <input
                        type="checkbox"
                        checked={answers.q3_repetitive_tasks.includes(option)}
                        onChange={() => {
                          const result = toggleArrayValue(answers.q3_repetitive_tasks, option);
                          setAnswers((prev) => ({ ...prev, q3_repetitive_tasks: result.next }));
                        }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {answers.q3_repetitive_tasks.includes("Otra") ? (
                  <input
                    type="text"
                    value={answers.q3_other}
                    onChange={(event) => setAnswers((prev) => ({ ...prev, q3_other: event.target.value }))}
                    placeholder="Especifica 'Otra'"
                    className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
                  />
                ) : null}
                {errors.q3_repetitive_tasks ? (
                  <p className="text-sm text-red-400">{errors.q3_repetitive_tasks}</p>
                ) : null}
                {errors.q3_other ? <p className="text-sm text-red-400">{errors.q3_other}</p> : null}
              </section>

              <section className="space-y-3">
                <h2 className="text-white font-semibold">4. Uso actual de IA</h2>
                <p className="text-gray-300">4. Has usado alguna vez herramientas de IA tipo ChatGPT?</p>
                <div className="space-y-2">
                  {q4Options.map((option) => (
                    <label key={option} className="flex items-center gap-3 text-gray-200">
                      <input
                        type="radio"
                        name="q4"
                        checked={answers.q4_ai_usage === option}
                        onChange={() => setAnswers((prev) => ({ ...prev, q4_ai_usage: option }))}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {errors.q4_ai_usage ? <p className="text-sm text-red-400">{errors.q4_ai_usage}</p> : null}
              </section>

              <section className="space-y-3">
                <h2 className="text-white font-semibold">5. Escenario ideal de ayuda con IA</h2>
                <p className="text-gray-300">
                  5. Imagina que tienes un asistente de IA en tu consulta. Que te gustaria que hiciera por ti automaticamente? (elige hasta 2)
                </p>
                <div className="space-y-2">
                  {q5Options.map((option) => (
                    <label key={option} className="flex items-center gap-3 text-gray-200">
                      <input
                        type="checkbox"
                        checked={answers.q5_ideal_ai_help.includes(option)}
                        onChange={() => {
                          const result = toggleArrayValue(answers.q5_ideal_ai_help, option, 2);
                          if (result.limitReached) {
                            setFeedback("En la pregunta 5 solo puedes seleccionar hasta 2 opciones.");
                            return;
                          }
                          setFeedback("");
                          setAnswers((prev) => ({ ...prev, q5_ideal_ai_help: result.next }));
                        }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Seleccionadas: {q5SelectedCount}/2</p>
                {errors.q5_ideal_ai_help ? <p className="text-sm text-red-400">{errors.q5_ideal_ai_help}</p> : null}
              </section>

              <section className="space-y-3">
                <h2 className="text-white font-semibold">6. Nivel de interes real</h2>
                <p className="text-gray-300">
                  6. Si existiera una herramienta de IA segura y legal en el hospital, para que la usarias primero?
                </p>
                <div className="space-y-2">
                  {q6Options.map((option) => (
                    <label key={option} className="flex items-center gap-3 text-gray-200">
                      <input
                        type="radio"
                        name="q6"
                        checked={answers.q6_first_use_case === option}
                        onChange={() => setAnswers((prev) => ({ ...prev, q6_first_use_case: option }))}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {errors.q6_first_use_case ? <p className="text-sm text-red-400">{errors.q6_first_use_case}</p> : null}
              </section>

              <section className="space-y-3">
                <h2 className="text-white font-semibold">7. Barrera principal para adoptar IA</h2>
                <p className="text-gray-300">7. Que es lo que mas te frena para usar IA en tu trabajo diario?</p>
                <div className="space-y-2">
                  {q7Options.map((option) => (
                    <label key={option} className="flex items-center gap-3 text-gray-200">
                      <input
                        type="radio"
                        name="q7"
                        checked={answers.q7_main_barrier === option}
                        onChange={() => setAnswers((prev) => ({ ...prev, q7_main_barrier: option }))}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {errors.q7_main_barrier ? <p className="text-sm text-red-400">{errors.q7_main_barrier}</p> : null}
              </section>

              <section className="space-y-3">
                <h2 className="text-white font-semibold">8. Pregunta abierta clave</h2>
                <p className="text-gray-300">
                  8. Si pudieras eliminar una tarea de tu trabajo manana mismo, cual seria?
                </p>
                <textarea
                  value={answers.q8_open_answer}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, q8_open_answer: event.target.value }))}
                  className="min-h-28 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
                  placeholder="Escribe tu respuesta"
                />
                {errors.q8_open_answer ? <p className="text-sm text-red-400">{errors.q8_open_answer}</p> : null}
              </section>

              {feedback ? (
                <p
                  className={
                    feedback.startsWith("Gracias")
                      ? "text-sm text-emerald-400"
                      : "text-sm text-amber-300"
                  }
                >
                  {feedback}
                </p>
              ) : null}

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={!canSubmit}>
                  {submitting ? "Enviando..." : "Enviar cuestionario"}
                </Button>
                <p className="text-xs text-gray-400">Tus respuestas se guardan de forma segura en Supabase.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
