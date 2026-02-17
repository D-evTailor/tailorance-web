"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type QuestionnairePayload = {
  specialty: "otorrinolaringologia";
  answers: {
    q1_profile: string;
    q2_main_pain: string[];
    q2_other: string;
    q3_repetitive_tasks: string[];
    q3_other: string;
    q4_1_ai_usage: string;
    q4_2_used_tools: string[];
    q4_2_other: string;
    q5_assistant_help: string[];
    q5_other: string;
    q6_main_barrier: string;
    q7_use_cases: string[];
    q7_other: string;
    q8_1_open_answer: string;
    q8_2_open_answer: string;
  };
  meta: {
    startedAt: number;
    honeypot: string;
  };
};

type Errors = Partial<Record<keyof QuestionnairePayload["answers"], string>>;

const q1Options = [
  "Residente",
  "Especialista 1 (<5 anos)",
  "Especialista 2 (5-15 anos)",
  "Especialista 3 (>15 anos)",
  "Investigador",
  "Jefe de servicio / coordinacion",
];

const q2Options = [
  "Redaccion de informes clinicos",
  "Historia clinica y documentacion",
  "Burocracia administrativa",
  "Listas de espera y gestion de pacientes",
  "Preparacion de sesiones o clases",
  "Investigacion y articulos",
  "Datos/estadistica/tablas",
  "Quirofano (gestion, informes, programacion)",
  "Comunicacion con pacientes",
  "Revision de pruebas e imagenes",
  "Otro",
];

const q3Options = [
  "Informes de consulta",
  "Informes quirurgicos",
  "Consentimientos informados",
  "Revision bibliografica / sintesis de papers",
  "Emails / coordinacion / agendas",
  "Codificacion / estadistica / scripts",
  "Busqueda de informacion",
  "Respuestas a pacientes",
  "Informes para primaria",
  "Informes de pruebas (audiometrias, TAC, etc.)",
  "Presentaciones o sesiones clinicas",
  "Ninguna en especial",
  "Otra",
];

const q4_1Options = [
  "Si, de forma habitual",
  "Si, alguna vez",
  "He oido hablar, pero no la uso",
  "No, nunca",
];

const q4_2Options = [
  "Nada",
  "He probado ChatGPT/Claude",
  "Uso herramientas tipo Copilot, Google AI Studio, generadores de imagenes o presentaciones",
  "Uso IA para papers",
  "Otro",
];

const q5Options = [
  "Escribir el informe de la consulta mientras hablo",
  "Resumir la historia clinica del paciente antes de entrar",
  "Crear informes",
  "Preparar documentos para el paciente",
  "Sugerir diagnosticos",
  "Preparar sesiones clinicas o presentaciones",
  "Ayudar con articulos o investigacion",
  "Organizar agenda y listas de pacientes",
  "Otra",
];

const q6Options = [
  "Falta de tiempo para aprender",
  "No esta integrada en el sistema del hospital",
  "Dudas sobre privacidad de datos",
  "No se en que me podria ayudar",
  "Falta de formacion",
  "Desconfianza en los resultados",
  "Nada, la usaria si estuviera disponible",
  "No me interesa usar IA",
];

const q7Options = [
  "Como hablar con IA (prompting) para resultados fiables",
  "Resumir y estructurar texto clinico/cientifico (sin inventar)",
  "Convertir ideas en documentos: protocolos, informes, emails, proyectos",
  "Busqueda con fuentes y citacion (evidencia/guias)",
  "Analisis de tablas/datos (Excel/CSV)",
  "Crear presentaciones/sesiones en minutos",
  "Automatizaciones simples (plantillas, checklists, macros ligeras)",
  "Imagenes: que puede y que NO puede (radiologia, dermato, etc.)",
  "Evaluacion de riesgos: privacidad, sesgos, errores",
  "Otro",
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

function OptionCard(props: {
  id: string;
  selected: boolean;
  children: React.ReactNode;
  control: React.ReactNode;
}) {
  return (
    <label
      htmlFor={props.id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition-colors",
        props.selected
          ? "border-brand-300/60 bg-brand-300/10"
          : "border-gray-700 bg-gray-900/40 hover:border-gray-600",
      )}
    >
      {props.control}
      <Label htmlFor={props.id} className="cursor-pointer text-gray-100">
        {props.children}
      </Label>
    </label>
  );
}

export default function CuestionarioOtorrinoPage() {
  const [formStartedAt, setFormStartedAt] = useState<number>(() => Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [answers, setAnswers] = useState<QuestionnairePayload["answers"]>({
    q1_profile: "",
    q2_main_pain: [],
    q2_other: "",
    q3_repetitive_tasks: [],
    q3_other: "",
    q4_1_ai_usage: "",
    q4_2_used_tools: [],
    q4_2_other: "",
    q5_assistant_help: [],
    q5_other: "",
    q6_main_barrier: "",
    q7_use_cases: [],
    q7_other: "",
    q8_1_open_answer: "",
    q8_2_open_answer: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [feedback, setFeedback] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const q2HasOther = answers.q2_main_pain.includes("Otro");
  const q3HasOther = answers.q3_repetitive_tasks.includes("Otra");
  const q4HasOther = answers.q4_2_used_tools.includes("Otro");
  const q5HasOther = answers.q5_assistant_help.includes("Otra");
  const q7HasOther = answers.q7_use_cases.includes("Otro");

  const completedSteps = useMemo(() => {
    const steps = [
      Boolean(answers.q1_profile),
      answers.q2_main_pain.length > 0 && (!q2HasOther || Boolean(answers.q2_other.trim())),
      answers.q3_repetitive_tasks.length > 0 && (!q3HasOther || Boolean(answers.q3_other.trim())),
      Boolean(answers.q4_1_ai_usage) && answers.q4_2_used_tools.length > 0 && (!q4HasOther || Boolean(answers.q4_2_other.trim())),
      answers.q5_assistant_help.length > 0 && (!q5HasOther || Boolean(answers.q5_other.trim())),
      Boolean(answers.q6_main_barrier),
      answers.q7_use_cases.length > 0 && (!q7HasOther || Boolean(answers.q7_other.trim())),
      Boolean(answers.q8_1_open_answer.trim()) && Boolean(answers.q8_2_open_answer.trim()),
    ];
    return steps.filter(Boolean).length;
  }, [answers, q2HasOther, q3HasOther, q4HasOther, q5HasOther, q7HasOther]);

  const progress = Math.round((completedSteps / 8) * 100);

  function validate(): Errors {
    const nextErrors: Errors = {};
    if (!answers.q1_profile) nextErrors.q1_profile = "Selecciona una opcion.";
    if (answers.q2_main_pain.length < 1) nextErrors.q2_main_pain = "Selecciona al menos una opcion.";
    if (answers.q2_main_pain.length > 2) nextErrors.q2_main_pain = "Puedes seleccionar hasta 2 opciones.";
    if (q2HasOther && !answers.q2_other.trim()) nextErrors.q2_other = "Describe la opcion 'Otro'.";
    if (answers.q3_repetitive_tasks.length < 1) nextErrors.q3_repetitive_tasks = "Selecciona al menos una opcion.";
    if (answers.q3_repetitive_tasks.length > 2) nextErrors.q3_repetitive_tasks = "Puedes seleccionar hasta 2 opciones.";
    if (q3HasOther && !answers.q3_other.trim()) nextErrors.q3_other = "Describe la opcion 'Otra'.";
    if (!answers.q4_1_ai_usage) nextErrors.q4_1_ai_usage = "Selecciona una opcion.";
    if (answers.q4_2_used_tools.length < 1) nextErrors.q4_2_used_tools = "Selecciona al menos una opcion.";
    if (q4HasOther && !answers.q4_2_other.trim()) nextErrors.q4_2_other = "Describe la opcion 'Otro'.";
    if (answers.q5_assistant_help.length < 1) nextErrors.q5_assistant_help = "Selecciona al menos una opcion.";
    if (answers.q5_assistant_help.length > 2) nextErrors.q5_assistant_help = "Puedes seleccionar hasta 2 opciones.";
    if (q5HasOther && !answers.q5_other.trim()) nextErrors.q5_other = "Describe la opcion 'Otra'.";
    if (!answers.q6_main_barrier) nextErrors.q6_main_barrier = "Selecciona una opcion.";
    if (answers.q7_use_cases.length < 1) nextErrors.q7_use_cases = "Selecciona al menos una opcion.";
    if (answers.q7_use_cases.length > 2) nextErrors.q7_use_cases = "Puedes seleccionar hasta 2 opciones.";
    if (q7HasOther && !answers.q7_other.trim()) nextErrors.q7_other = "Describe la opcion 'Otro'.";
    if (!answers.q8_1_open_answer.trim()) nextErrors.q8_1_open_answer = "Esta respuesta es obligatoria.";
    if (!answers.q8_2_open_answer.trim()) nextErrors.q8_2_open_answer = "Esta respuesta es obligatoria.";
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
        meta: {
          startedAt: formStartedAt,
          honeypot,
        },
      };
      const response = await fetch("/api/talks/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseData = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(responseData.error ?? "No se pudo guardar el cuestionario.");
      setFeedback("Gracias. Tu cuestionario se ha guardado correctamente.");
      setAnswers({
        q1_profile: "",
        q2_main_pain: [],
        q2_other: "",
        q3_repetitive_tasks: [],
        q3_other: "",
        q4_1_ai_usage: "",
        q4_2_used_tools: [],
        q4_2_other: "",
        q5_assistant_help: [],
        q5_other: "",
        q6_main_barrier: "",
        q7_use_cases: [],
        q7_other: "",
        q8_1_open_answer: "",
        q8_2_open_answer: "",
      });
      setHoneypot("");
      setFormStartedAt(Date.now());
      setErrors({});
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Ha ocurrido un error al enviar el cuestionario.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/talks" className="text-sm text-brand-300 hover:text-brand-200">Volver a TALKS</Link>
        </div>
        <Card className="overflow-hidden border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="h-1.5 w-full bg-gray-700"><div className="h-1.5 bg-brand-300 transition-all duration-300" style={{ width: `${progress}%` }} /></div>
          <CardHeader className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-brand-300/30 bg-brand-300/10 px-3 py-1 text-xs font-medium text-brand-200">Cuestionario expres</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-600 px-3 py-1 text-xs text-gray-300"><Clock3 className="h-3.5 w-3.5" />2-3 minutos</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-600 px-3 py-1 text-xs text-gray-300"><ShieldCheck className="h-3.5 w-3.5" />Datos protegidos</span>
            </div>
            <div>
              <CardTitle className="text-2xl text-white sm:text-3xl">IA para Otorrinolaringologia</CardTitle>
              <p className="mt-3 text-sm leading-6 text-gray-300">Objetivo: entender que tareas del dia a dia os quitan mas tiempo y donde la IA puede ayudaros de forma realista.</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3">
              <p className="text-sm text-gray-300">Progreso del formulario</p>
              <p className="text-sm font-medium text-brand-200">{completedSteps}/8 preguntas completadas ({progress}%)</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-10">
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                className="hidden"
              />
              <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-900/40 p-5">
                <h2 className="text-lg font-semibold text-white">1. Perfil profesional</h2>
                <p className="text-gray-300">Cual es tu situacion actual?</p>
                <RadioGroup value={answers.q1_profile} onValueChange={(value) => setAnswers((prev) => ({ ...prev, q1_profile: value }))} className="space-y-2">
                  {q1Options.map((option, index) => {
                    const id = `q1-${index}`;
                    return <OptionCard key={option} id={id} selected={answers.q1_profile === option} control={<RadioGroupItem id={id} value={option} className="mt-0.5 border-gray-400 text-brand-300" />}>{option}</OptionCard>;
                  })}
                </RadioGroup>
                {errors.q1_profile ? <p className="text-sm text-red-400">{errors.q1_profile}</p> : null}
              </section>

              <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-900/40 p-5">
                <h2 className="text-lg font-semibold text-white">2. Dolor principal del dia a dia</h2>
                <p className="text-gray-300">Que parte de tu trabajo te consume mas tiempo o energia mental? (elige hasta 2)</p>
                <div className="space-y-2">
                  {q2Options.map((option, index) => {
                    const id = `q2-${index}`;
                    const selected = answers.q2_main_pain.includes(option);
                    return (
                      <OptionCard
                        key={option}
                        id={id}
                        selected={selected}
                        control={
                          <Checkbox
                            id={id}
                            checked={selected}
                            onCheckedChange={() => {
                              const result = toggleArrayValue(answers.q2_main_pain, option, 2);
                              if (result.limitReached) return setFeedback("En la pregunta 2 solo puedes seleccionar hasta 2 opciones.");
                              setFeedback("");
                              setAnswers((prev) => ({ ...prev, q2_main_pain: result.next }));
                            }}
                            className="mt-0.5 border-gray-400 data-[state=checked]:bg-brand-300 data-[state=checked]:text-black"
                          />
                        }
                      >
                        {option}
                      </OptionCard>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400">Seleccionadas: {answers.q2_main_pain.length}/2</p>
                {q2HasOther ? <Input type="text" value={answers.q2_other} onChange={(event) => setAnswers((prev) => ({ ...prev, q2_other: event.target.value }))} placeholder="Especifica 'Otro'" className="border-gray-600 bg-gray-900 text-gray-100" /> : null}
                {errors.q2_main_pain ? <p className="text-sm text-red-400">{errors.q2_main_pain}</p> : null}
                {errors.q2_other ? <p className="text-sm text-red-400">{errors.q2_other}</p> : null}
              </section>

              <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-900/40 p-5">
                <h2 className="text-lg font-semibold text-white">3. Tareas repetitivas</h2>
                <p className="text-gray-300">Que tarea repites tantas veces que te gustaria automatizarla? (elige hasta 2)</p>
                <div className="space-y-2">
                  {q3Options.map((option, index) => {
                    const id = `q3-${index}`;
                    const selected = answers.q3_repetitive_tasks.includes(option);
                    return (
                      <OptionCard
                        key={option}
                        id={id}
                        selected={selected}
                        control={
                          <Checkbox
                            id={id}
                            checked={selected}
                            onCheckedChange={() => {
                              const result = toggleArrayValue(answers.q3_repetitive_tasks, option, 2);
                              if (result.limitReached) return setFeedback("En la pregunta 3 solo puedes seleccionar hasta 2 opciones.");
                              setFeedback("");
                              setAnswers((prev) => ({ ...prev, q3_repetitive_tasks: result.next }));
                            }}
                            className="mt-0.5 border-gray-400 data-[state=checked]:bg-brand-300 data-[state=checked]:text-black"
                          />
                        }
                      >
                        {option}
                      </OptionCard>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400">Seleccionadas: {answers.q3_repetitive_tasks.length}/2</p>
                {q3HasOther ? <Input type="text" value={answers.q3_other} onChange={(event) => setAnswers((prev) => ({ ...prev, q3_other: event.target.value }))} placeholder="Especifica 'Otra'" className="border-gray-600 bg-gray-900 text-gray-100" /> : null}
                {errors.q3_repetitive_tasks ? <p className="text-sm text-red-400">{errors.q3_repetitive_tasks}</p> : null}
                {errors.q3_other ? <p className="text-sm text-red-400">{errors.q3_other}</p> : null}
              </section>

              <section className="space-y-6 rounded-xl border border-gray-700 bg-gray-900/40 p-5">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">4. Uso actual de IA</h2>
                  <p className="text-gray-300">4.1 Has usado alguna vez herramientas de IA tipo ChatGPT?</p>
                  <RadioGroup value={answers.q4_1_ai_usage} onValueChange={(value) => setAnswers((prev) => ({ ...prev, q4_1_ai_usage: value }))} className="space-y-2">
                    {q4_1Options.map((option, index) => {
                      const id = `q4-1-${index}`;
                      return <OptionCard key={option} id={id} selected={answers.q4_1_ai_usage === option} control={<RadioGroupItem id={id} value={option} className="mt-0.5 border-gray-400 text-brand-300" />}>{option}</OptionCard>;
                    })}
                  </RadioGroup>
                  {errors.q4_1_ai_usage ? <p className="text-sm text-red-400">{errors.q4_1_ai_usage}</p> : null}
                </div>
                <div className="space-y-4">
                  <p className="text-gray-300">4.2 Que has usado ya?</p>
                  <div className="space-y-2">
                    {q4_2Options.map((option, index) => {
                      const id = `q4-2-${index}`;
                      const selected = answers.q4_2_used_tools.includes(option);
                      return (
                        <OptionCard
                          key={option}
                          id={id}
                          selected={selected}
                          control={
                            <Checkbox
                              id={id}
                              checked={selected}
                              onCheckedChange={() => {
                                const result = toggleArrayValue(answers.q4_2_used_tools, option);
                                setAnswers((prev) => ({ ...prev, q4_2_used_tools: result.next }));
                              }}
                              className="mt-0.5 border-gray-400 data-[state=checked]:bg-brand-300 data-[state=checked]:text-black"
                            />
                          }
                        >
                          {option}
                        </OptionCard>
                      );
                    })}
                  </div>
                  {q4HasOther ? <Input type="text" value={answers.q4_2_other} onChange={(event) => setAnswers((prev) => ({ ...prev, q4_2_other: event.target.value }))} placeholder="Especifica 'Otro'" className="border-gray-600 bg-gray-900 text-gray-100" /> : null}
                  {errors.q4_2_used_tools ? <p className="text-sm text-red-400">{errors.q4_2_used_tools}</p> : null}
                  {errors.q4_2_other ? <p className="text-sm text-red-400">{errors.q4_2_other}</p> : null}
                </div>
              </section>

              <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-900/40 p-5">
                <h2 className="text-lg font-semibold text-white">5. Escenario ideal de ayuda</h2>
                <p className="text-gray-300">Imagina que tienes un asistente humano en tu trabajo diario. Que te gustaria que hiciera por ti? (elige hasta 2)</p>
                <div className="space-y-2">
                  {q5Options.map((option, index) => {
                    const id = `q5-${index}`;
                    const selected = answers.q5_assistant_help.includes(option);
                    return (
                      <OptionCard
                        key={option}
                        id={id}
                        selected={selected}
                        control={
                          <Checkbox
                            id={id}
                            checked={selected}
                            onCheckedChange={() => {
                              const result = toggleArrayValue(answers.q5_assistant_help, option, 2);
                              if (result.limitReached) return setFeedback("En la pregunta 5 solo puedes seleccionar hasta 2 opciones.");
                              setFeedback("");
                              setAnswers((prev) => ({ ...prev, q5_assistant_help: result.next }));
                            }}
                            className="mt-0.5 border-gray-400 data-[state=checked]:bg-brand-300 data-[state=checked]:text-black"
                          />
                        }
                      >
                        {option}
                      </OptionCard>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400">Seleccionadas: {answers.q5_assistant_help.length}/2</p>
                {q5HasOther ? <Input type="text" value={answers.q5_other} onChange={(event) => setAnswers((prev) => ({ ...prev, q5_other: event.target.value }))} placeholder="Especifica 'Otra'" className="border-gray-600 bg-gray-900 text-gray-100" /> : null}
                {errors.q5_assistant_help ? <p className="text-sm text-red-400">{errors.q5_assistant_help}</p> : null}
                {errors.q5_other ? <p className="text-sm text-red-400">{errors.q5_other}</p> : null}
              </section>

              <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-900/40 p-5">
                <h2 className="text-lg font-semibold text-white">6. Barrera principal para adoptar IA</h2>
                <p className="text-gray-300">Que es lo que mas te frena para usar IA en tu trabajo diario?</p>
                <RadioGroup value={answers.q6_main_barrier} onValueChange={(value) => setAnswers((prev) => ({ ...prev, q6_main_barrier: value }))} className="space-y-2">
                  {q6Options.map((option, index) => {
                    const id = `q6-${index}`;
                    return <OptionCard key={option} id={id} selected={answers.q6_main_barrier === option} control={<RadioGroupItem id={id} value={option} className="mt-0.5 border-gray-400 text-brand-300" />}>{option}</OptionCard>;
                  })}
                </RadioGroup>
                {errors.q6_main_barrier ? <p className="text-sm text-red-400">{errors.q6_main_barrier}</p> : null}
              </section>

              <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-900/40 p-5">
                <h2 className="text-lg font-semibold text-white">7. Casos de uso</h2>
                <p className="text-gray-300">Que te seria mas util ver en la charla? (elige hasta 2)</p>
                <div className="space-y-2">
                  {q7Options.map((option, index) => {
                    const id = `q7-${index}`;
                    const selected = answers.q7_use_cases.includes(option);
                    return (
                      <OptionCard
                        key={option}
                        id={id}
                        selected={selected}
                        control={
                          <Checkbox
                            id={id}
                            checked={selected}
                            onCheckedChange={() => {
                              const result = toggleArrayValue(answers.q7_use_cases, option, 2);
                              if (result.limitReached) return setFeedback("En la pregunta 7 solo puedes seleccionar hasta 2 opciones.");
                              setFeedback("");
                              setAnswers((prev) => ({ ...prev, q7_use_cases: result.next }));
                            }}
                            className="mt-0.5 border-gray-400 data-[state=checked]:bg-brand-300 data-[state=checked]:text-black"
                          />
                        }
                      >
                        {option}
                      </OptionCard>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400">Seleccionadas: {answers.q7_use_cases.length}/2</p>
                {q7HasOther ? <Input type="text" value={answers.q7_other} onChange={(event) => setAnswers((prev) => ({ ...prev, q7_other: event.target.value }))} placeholder="Especifica 'Otro'" className="border-gray-600 bg-gray-900 text-gray-100" /> : null}
                {errors.q7_use_cases ? <p className="text-sm text-red-400">{errors.q7_use_cases}</p> : null}
                {errors.q7_other ? <p className="text-sm text-red-400">{errors.q7_other}</p> : null}
              </section>

              <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-900/40 p-5">
                <h2 className="text-lg font-semibold text-white">8. Pregunta abierta clave</h2>
                <p className="text-gray-300">8.1 Si pudieras eliminar una tarea de tu trabajo manana mismo, cual seria?</p>
                <Textarea value={answers.q8_1_open_answer} onChange={(event) => setAnswers((prev) => ({ ...prev, q8_1_open_answer: event.target.value }))} className="min-h-24 border-gray-600 bg-gray-900 text-gray-100" placeholder="Respuesta" />
                {errors.q8_1_open_answer ? <p className="text-sm text-red-400">{errors.q8_1_open_answer}</p> : null}
                <p className="pt-2 text-gray-300">8.2 Si tuvieras una varita magica, que resultado te gustaria obtener?</p>
                <Textarea value={answers.q8_2_open_answer} onChange={(event) => setAnswers((prev) => ({ ...prev, q8_2_open_answer: event.target.value }))} className="min-h-24 border-gray-600 bg-gray-900 text-gray-100" placeholder="Respuesta" />
                {errors.q8_2_open_answer ? <p className="text-sm text-red-400">{errors.q8_2_open_answer}</p> : null}
              </section>

              {feedback ? (
                <div className={cn("rounded-lg border px-4 py-3 text-sm", feedback.startsWith("Gracias") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300")}>
                  <div className="flex items-center gap-2">{feedback.startsWith("Gracias") ? <CheckCircle2 className="h-4 w-4" /> : null}<p>{feedback}</p></div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 rounded-xl border border-gray-700 bg-gray-900/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-400">Tus respuestas se guardan de forma segura en Supabase.</p>
                <Button type="submit" disabled={submitting} className="sm:min-w-52">{submitting ? "Enviando..." : "Enviar cuestionario"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
