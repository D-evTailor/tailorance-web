"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Stethoscope,
  BookOpen,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Lightbulb,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PROMPT_TEMPLATES,
  getExampleValues,
  getDefaultValues,
  type PromptTemplate,
  type TemplateField,
} from "@/lib/talks/prompt-templates";

const ICON_MAP: Record<string, typeof Stethoscope> = {
  stethoscope: Stethoscope,
  "book-open": BookOpen,
  "file-text": FileText,
};

const GOLDEN_RULES = [
  {
    num: 1,
    title: "Contexto profesional",
    desc: "\"Soy otorrino en hospital público\" — la IA adapta el nivel y el lenguaje.",
  },
  {
    num: 2,
    title: "Estructura la petición",
    desc: "Numera lo que necesitas (1, 2, 3…). La IA organiza mejor su respuesta.",
  },
  {
    num: 3,
    title: "Formato de salida",
    desc: "Pide tabla, lista o checklist — lo que te sea más útil en consulta.",
  },
  {
    num: 4,
    title: "Restricciones",
    desc: "\"Máximo 1 página\", \"Solo guías SEORL 2024\", \"Tono para un R1\".",
  },
];

// ---------------------------------------------------------------------------
// Field Renderer
// ---------------------------------------------------------------------------

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: TemplateField;
  value: string | string[];
  onChange: (fieldId: string, value: string | string[]) => void;
}) {
  switch (field.type) {
    case "text":
      return (
        <Input
          value={value as string}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          className="border-white/10 bg-surface-base/80 text-text-primary placeholder:text-text-muted"
        />
      );

    case "textarea":
      return (
        <Textarea
          value={value as string}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="border-white/10 bg-surface-base/80 text-text-primary placeholder:text-text-muted"
        />
      );

    case "select":
      return (
        <Select
          value={value as string}
          onValueChange={(v) => onChange(field.id, v)}
        >
          <SelectTrigger className="border-white/10 bg-surface-base/80 text-text-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-surface-elevated">
            {field.options?.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-text-primary focus:bg-white/10 focus:text-text-primary"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "checkbox-group": {
      const selected = (value as string[]) || [];
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => {
            const isChecked = selected.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-white/5 px-3 py-2.5 transition-colors hover:border-ainure-500/30 hover:bg-surface-base/60"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    const next = checked
                      ? [...selected, opt.value]
                      : selected.filter((v) => v !== opt.value);
                    onChange(field.id, next);
                  }}
                  className="border-white/20 data-[state=checked]:border-ainure-500 data-[state=checked]:bg-ainure-600"
                />
                <span className="text-sm text-text-secondary">
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Template Selector Card
// ---------------------------------------------------------------------------

function TemplateCard({
  template,
  isActive,
  onClick,
}: {
  template: PromptTemplate;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = ICON_MAP[template.icon] || FileText;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all",
        isActive
          ? "border-ainure-400/50 bg-ainure-900/20 shadow-lg shadow-ainure-500/5"
          : "border-white/10 bg-surface-elevated/70 hover:border-ainure-400/30 hover:bg-surface-elevated",
      )}
    >
      <div
        className={cn(
          "rounded-lg border p-2.5 transition-colors",
          isActive
            ? "border-ainure-500/40 bg-ainure-900/40"
            : "border-white/10 bg-surface-base/60 group-hover:border-ainure-500/20",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 transition-colors",
            isActive ? "text-ainure-300" : "text-text-muted group-hover:text-ainure-400",
          )}
        />
      </div>
      <div>
        <h3
          className={cn(
            "font-semibold transition-colors",
            isActive ? "text-ainure-300" : "text-text-primary",
          )}
        >
          {template.title}
        </h3>
        <p className="mt-0.5 text-sm text-text-secondary">
          {template.subtitle}
        </p>
      </div>
      {isActive && (
        <div className="absolute right-3 top-3">
          <ChevronRight className="h-4 w-4 text-ainure-400" />
        </div>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PromptGenerator() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    PROMPT_TEMPLATES[0].id,
  );
  const [allValues, setAllValues] = useState<
    Record<string, Record<string, string | string[]>>
  >(() => {
    const init: Record<string, Record<string, string | string[]>> = {};
    for (const t of PROMPT_TEMPLATES) {
      init[t.id] = getDefaultValues(t);
    }
    return init;
  });
  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(true);

  const template = useMemo(
    () => PROMPT_TEMPLATES.find((t) => t.id === activeTemplateId)!,
    [activeTemplateId],
  );

  const values = allValues[activeTemplateId];

  const handleFieldChange = useCallback(
    (fieldId: string, value: string | string[]) => {
      setAllValues((prev) => ({
        ...prev,
        [activeTemplateId]: { ...prev[activeTemplateId], [fieldId]: value },
      }));
    },
    [activeTemplateId],
  );

  const generatedPrompt = useMemo(() => {
    const hasRequired = template.fields
      .filter((f) => f.required)
      .every((f) => {
        const v = values[f.id];
        if (Array.isArray(v)) return v.length > 0;
        return typeof v === "string" && v.trim().length > 0;
      });
    if (!hasRequired) return "";
    return template.buildPrompt(values);
  }, [template, values]);

  const handleCopy = useCallback(async () => {
    if (!generatedPrompt) return;
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedPrompt]);

  const handleLoadExample = useCallback(() => {
    setAllValues((prev) => ({
      ...prev,
      [activeTemplateId]: getExampleValues(template),
    }));
  }, [activeTemplateId, template]);

  const handleReset = useCallback(() => {
    setAllValues((prev) => ({
      ...prev,
      [activeTemplateId]: getDefaultValues(template),
    }));
  }, [activeTemplateId, template]);

  const requiredMissing = template.fields.filter((f) => {
    if (!f.required) return false;
    const v = values[f.id];
    if (Array.isArray(v)) return v.length === 0;
    return typeof v !== "string" || v.trim().length === 0;
  });

  return (
    <TooltipProvider delayDuration={300}>
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Tips banner */}
        {showTips && (
          <Card className="border-ainure-500/20 bg-ainure-950/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base text-ainure-300">
                  <Lightbulb className="h-5 w-5" />
                  Las 4 reglas de oro del prompting clínico
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTips(false)}
                  className="h-7 text-xs text-text-muted hover:text-text-secondary"
                >
                  Ocultar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {GOLDEN_RULES.map((rule) => (
                  <div
                    key={rule.num}
                    className="rounded-lg border border-white/5 bg-surface-base/40 p-3"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Badge className="h-5 w-5 items-center justify-center rounded-full bg-ainure-600 p-0 text-[10px] font-bold text-white">
                        {rule.num}
                      </Badge>
                      <span className="text-sm font-medium text-text-primary">
                        {rule.title}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-text-muted">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs italic text-text-muted">
                Pro tip: ¿No sabes cómo formular el prompt? Pídele a la IA:{" "}
                <span className="text-ainure-400">
                  &quot;Actúa como experto en ingeniería de prompts. Hazme las
                  preguntas que necesites para crear el prompt perfecto sobre
                  [tu tema].&quot;
                </span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Template selector */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            1. Elige el tipo de prompt
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PROMPT_TEMPLATES.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                isActive={t.id === activeTemplateId}
                onClick={() => setActiveTemplateId(t.id)}
              />
            ))}
          </div>
        </section>

        {/* Form */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-text-primary">
              2. Rellena tu caso
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadExample}
                className="border-ainure-500/30 text-ainure-300 hover:bg-ainure-900/20 hover:text-ainure-200"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Ver ejemplo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="border-white/10 text-text-muted hover:text-text-secondary"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Limpiar
              </Button>
            </div>
          </div>

          <p className="mb-6 text-sm text-text-muted">
            {template.description}
          </p>

          <div className="space-y-5">
            {template.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={field.id}
                    className="text-sm font-medium text-text-primary"
                  >
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-ainure-400">*</span>
                    )}
                  </Label>
                  {field.helpText && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 shrink-0 cursor-help text-text-muted" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-xs border-white/10 bg-surface-elevated text-text-secondary"
                      >
                        {field.helpText}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <FieldRenderer
                  field={field}
                  value={values[field.id]}
                  onChange={handleFieldChange}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Generated prompt */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            3. Tu prompt listo para usar
          </h2>

          {requiredMissing.length > 0 && !generatedPrompt && (
            <div className="rounded-lg border border-white/10 bg-surface-elevated/50 p-6 text-center">
              <p className="text-sm text-text-muted">
                Rellena los campos obligatorios para generar tu prompt:
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {requiredMissing.map((f) => (
                  <Badge
                    key={f.id}
                    variant="outline"
                    className="border-white/10 text-text-secondary"
                  >
                    {f.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {generatedPrompt && (
            <div className="space-y-3">
              <div className="relative">
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-ainure-500/20 bg-surface-base/80 p-5 font-mono text-sm leading-relaxed text-text-primary">
                  {generatedPrompt}
                </pre>
                <Button
                  onClick={handleCopy}
                  size="sm"
                  className={cn(
                    "absolute right-3 top-3 transition-all",
                    copied
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-ainure-600 hover:bg-ainure-700",
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                <span>
                  Pega este prompt en{" "}
                  <span className="font-medium text-text-secondary">
                    ChatGPT
                  </span>
                  ,{" "}
                  <span className="font-medium text-text-secondary">
                    Google AI Studio
                  </span>
                  ,{" "}
                  <span className="font-medium text-text-secondary">
                    Claude
                  </span>{" "}
                  o cualquier otra IA.
                </span>
              </div>
            </div>
          )}
        </section>

        {!showTips && (
          <button
            onClick={() => setShowTips(true)}
            className="text-sm text-ainure-400 transition-colors hover:text-ainure-300"
          >
            Mostrar reglas de oro del prompting
          </button>
        )}
      </div>
    </TooltipProvider>
  );
}
