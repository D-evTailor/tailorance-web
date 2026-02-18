"use client";

import { FormEvent, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Moon, ShieldCheck, Sun } from "lucide-react";
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
  "Especialista 1 (<5 años)",
  "Especialista 2 (5-15 años)",
  "Especialista 3 (>15 años)",
  "Investigador",
  "Jefe de servicio / coordinación",
];

const q2Options = [
  "Redacción de informes clínicos",
  "Historia clínica y documentación",
  "Burocracia administrativa",
  "Listas de espera y gestión de pacientes",
  "Preparación de sesiones o clases",
  "Investigación y artículos",
  "Datos/estadística/tablas",
  "Quirófano (gestión, informes, programación)",
  "Comunicación con pacientes",
  "Revisión de pruebas e imágenes",
  "Otro",
];

const q3Options = [
  "Informes de consulta",
  "Informes quirúrgicos",
  "Consentimientos informados",
  "Revisión bibliográfica / síntesis de papers",
  "Emails / coordinación / agendas",
  "Codificación / estadística / scripts",
  "Búsqueda de información",
  "Respuestas a pacientes",
  "Informes para primaria",
  "Informes de pruebas (audiometrías, TAC, etc.)",
  "Presentaciones o sesiones clínicas",
  "Ninguna en especial",
  "Otra",
];

const q4_1Options = [
  "Sí, de forma habitual",
  "Sí, alguna vez",
  "He oído hablar, pero no la uso",
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
  "Resumir la historia clínica del paciente antes de entrar",
  "Crear informes",
  "Preparar documentos para el paciente",
  "Sugerir diagnósticos",
  "Preparar sesiones clínicas o presentaciones",
  "Ayudar con artículos o investigación",
  "Organizar agenda y listas de pacientes",
  "Otra",
];

const q6Options = [
  "Falta de tiempo para aprender",
  "No está integrada en el sistema del hospital",
  "Dudas sobre privacidad de datos",
  "No sé en qué me podría ayudar",
  "Falta de formación",
  "Desconfianza en los resultados",
  "Nada, la usaría si estuviera disponible",
  "No me interesa usar IA",
];

const q7Options = [
  "Cómo hablar con IA (prompting) para resultados fiables",
  "Resumir y estructurar texto clínico/científico (sin inventar)",
  "Convertir ideas en documentos: protocolos, informes, emails, proyectos",
  "Búsqueda con fuentes y citación (evidencia/guías)",
  "Análisis de tablas/datos (Excel/CSV)",
  "Crear presentaciones/sesiones en minutos",
  "Automatizaciones simples (plantillas, checklists, macros ligeras)",
  "Imágenes: qué puede y qué NO puede (radiología, dermato, etc.)",
  "Evaluación de riesgos: privacidad, sesgos, errores",
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
          ? "border-brand-600/60 bg-brand-700/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          : "border-border bg-background/70 hover:border-border",
      )}
    >
      {props.control}
      <Label htmlFor={props.id} className="cursor-pointer text-foreground">
        {props.children}
      </Label>
    </label>
  );
}

export default function CuestionarioOtorrinoPage() {
  const [lightMode, setLightMode] = useState(false);

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

  function toggleQuestionnaireTheme() {
    setLightMode((prev) => !prev);
  }

  const localThemeVars = useMemo(
    () =>
      ({
        "--background": lightMode ? "96 26% 95%" : "0 0% 2%",
        "--foreground": lightMode ? "116 18% 12%" : "0 0% 93%",
        "--card": lightMode ? "96 28% 98%" : "0 0% 4%",
        "--card-foreground": lightMode ? "116 18% 12%" : "0 0% 93%",
        "--popover": lightMode ? "96 28% 98%" : "0 0% 4%",
        "--popover-foreground": lightMode ? "116 18% 12%" : "0 0% 93%",
        "--secondary": lightMode ? "98 22% 89%" : "0 0% 10%",
        "--secondary-foreground": lightMode ? "116 16% 19%" : "0 0% 93%",
        "--muted": lightMode ? "96 18% 90%" : "0 0% 11%",
        "--muted-foreground": lightMode ? "108 12% 30%" : "0 0% 53%",
        "--accent": lightMode ? "112 36% 30%" : "112 30% 34%",
        "--accent-foreground": lightMode ? "0 0% 100%" : "0 0% 8%",
        "--border": lightMode ? "108 18% 70%" : "0 0% 15%",
        "--input": lightMode ? "108 16% 66%" : "0 0% 16%",
        "--ring": lightMode ? "112 36% 30%" : "112 30% 34%",
      }) as CSSProperties,
    [lightMode],
  );

  function validate(): Errors {
    const nextErrors: Errors = {};
    if (!answers.q1_profile) nextErrors.q1_profile = "Selecciona una opción.";
    if (answers.q2_main_pain.length < 1) nextErrors.q2_main_pain = "Selecciona al menos una opción.";
    if (answers.q2_main_pain.length > 2) nextErrors.q2_main_pain = "Puedes seleccionar hasta 2 opciones.";
    if (q2HasOther && !answers.q2_other.trim()) nextErrors.q2_other = "Describe la opción «Otro».";
    if (answers.q3_repetitive_tasks.length < 1) nextErrors.q3_repetitive_tasks = "Selecciona al menos una opción.";
    if (answers.q3_repetitive_tasks.length > 2) nextErrors.q3_repetitive_tasks = "Puedes seleccionar hasta 2 opciones.";
    if (q3HasOther && !answers.q3_other.trim()) nextErrors.q3_other = "Describe la opción «Otra».";
    if (!answers.q4_1_ai_usage) nextErrors.q4_1_ai_usage = "Selecciona una opción.";
    if (answers.q4_2_used_tools.length < 1) nextErrors.q4_2_used_tools = "Selecciona al menos una opción.";
    if (q4HasOther && !answers.q4_2_other.trim()) nextErrors.q4_2_other = "Describe la opción «Otro».";
    if (answers.q5_assistant_help.length < 1) nextErrors.q5_assistant_help = "Selecciona al menos una opción.";
    if (answers.q5_assistant_help.length > 2) nextErrors.q5_assistant_help = "Puedes seleccionar hasta 2 opciones.";
    if (q5HasOther && !answers.q5_other.trim()) nextErrors.q5_other = "Describe la opción «Otra».";
    if (!answers.q6_main_barrier) nextErrors.q6_main_barrier = "Selecciona una opción.";
    if (answers.q7_use_cases.length < 1) nextErrors.q7_use_cases = "Selecciona al menos una opción.";
    if (answers.q7_use_cases.length > 2) nextErrors.q7_use_cases = "Puedes seleccionar hasta 2 opciones.";
    if (q7HasOther && !answers.q7_other.trim()) nextErrors.q7_other = "Describe la opción «Otro».";
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
    <div className={cn("app-page pt-0 sm:pt-0", lightMode ? "bg-[radial-gradient(circle_at_14%_10%,rgba(76,112,77,0.12),transparent_38%),radial-gradient(circle_at_86%_0%,rgba(85,126,88,0.10),transparent_26%)]" : "")} style={localThemeVars}>
      <div className="app-container">
        <div className="mx-auto max-w-4xl">
          <div className="sticky top-0 z-40 mb-6">
            <div className="rounded-xl border border-border/80 bg-background/90 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs text-foreground/70">Progreso del cuestionario</p>
                <p className="text-xs font-semibold text-brand-500">{completedSteps}/8 ({progress}%)</p>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-1.5 bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
          <Card className="overflow-hidden border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <Link href="/talks" className="text-sm text-brand-500 hover:text-brand-400">Volver a TALKS</Link>
              <Button
                type="button"
                variant="outline"
                onClick={toggleQuestionnaireTheme}
                className={cn(
                  "h-9 px-3 text-xs",
                  lightMode
                    ? "border-black/30 bg-white text-black hover:bg-black/10"
                    : "border-white/20 bg-white/5 text-white hover:bg-white/10",
                )}
              >
                {lightMode ? (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Modo oscuro
                  </>
                ) : (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Modo claro
                  </>
                )}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-brand-500/30 bg-brand-600/10 px-3 py-1 text-xs font-medium text-brand-500">Cuestionario exprés</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-input px-3 py-1 text-xs text-foreground/80"><Clock3 className="h-3.5 w-3.5" />2-3 minutos</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-input px-3 py-1 text-xs text-foreground/80"><ShieldCheck className="h-3.5 w-3.5" />Datos protegidos</span>
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground sm:text-3xl">IA para Otorrinolaringología</CardTitle>
              <p className="mt-3 text-sm leading-6 text-foreground/80">Objetivo: entender qué tareas del día a día os quitan más tiempo y dónde la IA puede ayudaros de forma realista.</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-4 py-3">
              <p className="text-sm text-foreground/80">Progreso del formulario</p>
              <p className="text-sm font-medium text-brand-500">{completedSteps}/8 preguntas completadas ({progress}%)</p>
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
              <section className="space-y-4 rounded-xl border border-border bg-background/70 p-5">
                <h2 className="text-lg font-semibold text-foreground">1. Perfil profesional</h2>
                <p className="text-foreground/80">{"\u00BF"}Cuál es tu situación actual?</p>
                <RadioGroup value={answers.q1_profile} onValueChange={(value) => setAnswers((prev) => ({ ...prev, q1_profile: value }))} className="space-y-2">
                  {q1Options.map((option, index) => {
                    const id = `q1-${index}`;
                    return <OptionCard key={option} id={id} selected={answers.q1_profile === option} control={<RadioGroupItem id={id} value={option} className="mt-0.5 border-input text-brand-500" />}>{option}</OptionCard>;
                  })}
                </RadioGroup>
                {errors.q1_profile ? <p className="text-sm text-red-400">{errors.q1_profile}</p> : null}
              </section>

              <section className="space-y-4 rounded-xl border border-border bg-background/70 p-5">
                <h2 className="text-lg font-semibold text-foreground">2. Dolor principal del día a día</h2>
                <p className="text-foreground/80">{"\u00BF"}Qué parte de tu trabajo te consume más tiempo o energía mental? (Elige hasta 2.)</p>
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
                            className="mt-0.5 border-input data-[state=checked]:bg-brand-600 data-[state=checked]:text-white"
                          />
                        }
                      >
                        {option}
                      </OptionCard>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Seleccionadas: {answers.q2_main_pain.length}/2</p>
                {q2HasOther ? <Input type="text" value={answers.q2_other} onChange={(event) => setAnswers((prev) => ({ ...prev, q2_other: event.target.value }))} placeholder="Especifica «Otro»" className="border-input bg-background text-foreground" /> : null}
                {errors.q2_main_pain ? <p className="text-sm text-red-400">{errors.q2_main_pain}</p> : null}
                {errors.q2_other ? <p className="text-sm text-red-400">{errors.q2_other}</p> : null}
              </section>

              <section className="space-y-4 rounded-xl border border-border bg-background/70 p-5">
                <h2 className="text-lg font-semibold text-foreground">3. Tareas repetitivas</h2>
                <p className="text-foreground/80">{"\u00BF"}Qué tarea repites tantas veces que te gustaría automatizarla? (Elige hasta 2.)</p>
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
                            className="mt-0.5 border-input data-[state=checked]:bg-brand-600 data-[state=checked]:text-white"
                          />
                        }
                      >
                        {option}
                      </OptionCard>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Seleccionadas: {answers.q3_repetitive_tasks.length}/2</p>
                {q3HasOther ? <Input type="text" value={answers.q3_other} onChange={(event) => setAnswers((prev) => ({ ...prev, q3_other: event.target.value }))} placeholder="Especifica «Otra»" className="border-input bg-background text-foreground" /> : null}
                {errors.q3_repetitive_tasks ? <p className="text-sm text-red-400">{errors.q3_repetitive_tasks}</p> : null}
                {errors.q3_other ? <p className="text-sm text-red-400">{errors.q3_other}</p> : null}
              </section>

              <section className="space-y-6 rounded-xl border border-border bg-background/70 p-5">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">4. Uso actual de IA</h2>
                  <p className="text-foreground/80">4.1 {"\u00BF"}Has usado alguna vez herramientas de IA tipo ChatGPT?</p>
                  <RadioGroup value={answers.q4_1_ai_usage} onValueChange={(value) => setAnswers((prev) => ({ ...prev, q4_1_ai_usage: value }))} className="space-y-2">
                    {q4_1Options.map((option, index) => {
                      const id = `q4-1-${index}`;
                      return <OptionCard key={option} id={id} selected={answers.q4_1_ai_usage === option} control={<RadioGroupItem id={id} value={option} className="mt-0.5 border-input text-brand-500" />}>{option}</OptionCard>;
                    })}
                  </RadioGroup>
                  {errors.q4_1_ai_usage ? <p className="text-sm text-red-400">{errors.q4_1_ai_usage}</p> : null}
                </div>
                <div className="space-y-4">
                  <p className="text-foreground/80">4.2 {"\u00BF"}Qué has usado ya?</p>
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
                              className="mt-0.5 border-input data-[state=checked]:bg-brand-600 data-[state=checked]:text-white"
                            />
                          }
                        >
                          {option}
                        </OptionCard>
                      );
                    })}
                  </div>
                  {q4HasOther ? <Input type="text" value={answers.q4_2_other} onChange={(event) => setAnswers((prev) => ({ ...prev, q4_2_other: event.target.value }))} placeholder="Especifica «Otro»" className="border-input bg-background text-foreground" /> : null}
                  {errors.q4_2_used_tools ? <p className="text-sm text-red-400">{errors.q4_2_used_tools}</p> : null}
                  {errors.q4_2_other ? <p className="text-sm text-red-400">{errors.q4_2_other}</p> : null}
                </div>
              </section>

              <section className="space-y-4 rounded-xl border border-border bg-background/70 p-5">
                <h2 className="text-lg font-semibold text-foreground">5. Escenario ideal de ayuda</h2>
                <p className="text-foreground/80">Imagina que tienes un asistente humano en tu trabajo diario. {"\u00BF"}Qué te gustaría que hiciera por ti? (Elige hasta 2.)</p>
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
                            className="mt-0.5 border-input data-[state=checked]:bg-brand-600 data-[state=checked]:text-white"
                          />
                        }
                      >
                        {option}
                      </OptionCard>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Seleccionadas: {answers.q5_assistant_help.length}/2</p>
                {q5HasOther ? <Input type="text" value={answers.q5_other} onChange={(event) => setAnswers((prev) => ({ ...prev, q5_other: event.target.value }))} placeholder="Especifica «Otra»" className="border-input bg-background text-foreground" /> : null}
                {errors.q5_assistant_help ? <p className="text-sm text-red-400">{errors.q5_assistant_help}</p> : null}
                {errors.q5_other ? <p className="text-sm text-red-400">{errors.q5_other}</p> : null}
              </section>

              <section className="space-y-4 rounded-xl border border-border bg-background/70 p-5">
                <h2 className="text-lg font-semibold text-foreground">6. Barrera principal para adoptar IA</h2>
                <p className="text-foreground/80">{"\u00BF"}Qué es lo que más te frena para usar IA en tu trabajo diario?</p>
                <RadioGroup value={answers.q6_main_barrier} onValueChange={(value) => setAnswers((prev) => ({ ...prev, q6_main_barrier: value }))} className="space-y-2">
                  {q6Options.map((option, index) => {
                    const id = `q6-${index}`;
                    return <OptionCard key={option} id={id} selected={answers.q6_main_barrier === option} control={<RadioGroupItem id={id} value={option} className="mt-0.5 border-input text-brand-500" />}>{option}</OptionCard>;
                  })}
                </RadioGroup>
                {errors.q6_main_barrier ? <p className="text-sm text-red-400">{errors.q6_main_barrier}</p> : null}
              </section>

              <section className="space-y-4 rounded-xl border border-border bg-background/70 p-5">
                <h2 className="text-lg font-semibold text-foreground">7. Casos de uso</h2>
                <p className="text-foreground/80">{"\u00BF"}Qué te sería más útil ver en la charla? (Elige hasta 2.)</p>
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
                            className="mt-0.5 border-input data-[state=checked]:bg-brand-600 data-[state=checked]:text-white"
                          />
                        }
                      >
                        {option}
                      </OptionCard>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Seleccionadas: {answers.q7_use_cases.length}/2</p>
                {q7HasOther ? <Input type="text" value={answers.q7_other} onChange={(event) => setAnswers((prev) => ({ ...prev, q7_other: event.target.value }))} placeholder="Especifica «Otro»" className="border-input bg-background text-foreground" /> : null}
                {errors.q7_use_cases ? <p className="text-sm text-red-400">{errors.q7_use_cases}</p> : null}
                {errors.q7_other ? <p className="text-sm text-red-400">{errors.q7_other}</p> : null}
              </section>

              <section className="space-y-4 rounded-xl border border-border bg-background/70 p-5">
                <h2 className="text-lg font-semibold text-foreground">8. Pregunta abierta clave</h2>
                <p className="text-foreground/80">8.1 {"\u00BF"}Si pudieras eliminar una tarea de tu trabajo mañana mismo, cuál sería?</p>
                <Textarea value={answers.q8_1_open_answer} onChange={(event) => setAnswers((prev) => ({ ...prev, q8_1_open_answer: event.target.value }))} className="min-h-24 border-input bg-background text-foreground" placeholder="Respuesta" />
                {errors.q8_1_open_answer ? <p className="text-sm text-red-400">{errors.q8_1_open_answer}</p> : null}
                <p className="pt-2 text-foreground/80">8.2 {"\u00BF"}Si tuvieras una varita mágica, qué resultado te gustaría obtener?</p>
                <Textarea value={answers.q8_2_open_answer} onChange={(event) => setAnswers((prev) => ({ ...prev, q8_2_open_answer: event.target.value }))} className="min-h-24 border-input bg-background text-foreground" placeholder="Respuesta" />
                {errors.q8_2_open_answer ? <p className="text-sm text-red-400">{errors.q8_2_open_answer}</p> : null}
              </section>

              {feedback ? (
                <div className={cn("rounded-lg border px-4 py-3 text-sm", feedback.startsWith("Gracias") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300")}>
                  <div className="flex items-center gap-2">{feedback.startsWith("Gracias") ? <CheckCircle2 className="h-4 w-4" /> : null}<p>{feedback}</p></div>
                </div>
              ) : null}

                <div className="flex flex-col gap-3 rounded-xl border border-border bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">Tus respuestas se guardan de forma segura en Supabase.</p>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="sm:min-w-52 border border-brand-300/40 bg-brand-500 font-semibold text-white shadow-[0_10px_24px_rgba(36,53,33,0.45)] transition-all hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-[0_14px_30px_rgba(36,53,33,0.55)]"
                  >
                    {submitting ? "Enviando..." : "Enviar cuestionario"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
