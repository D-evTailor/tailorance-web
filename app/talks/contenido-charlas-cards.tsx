"use client";

import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NotebookPen, Presentation, ClipboardList, ChevronDown, Wand2, LucideIcon } from "lucide-react";

type RecursoSingle = {
  title: string;
  description: string;
  href: string;
  type: "single";
  icon: LucideIcon;
  internal?: boolean;
};

type RecursoVariants = {
  title: string;
  description: string;
  type: "variants";
  icon: LucideIcon;
  variants: { label: string; href: string }[];
};

const contenidoCharlas: (RecursoSingle | RecursoVariants)[] = [
  {
    title: "Cuestionario",
    description: "Cuestionario de la charla. Elige la especialidad para abrir el enlace correspondiente.",
    type: "variants",
    icon: ClipboardList,
    variants: [
      { label: "Otorrinolaringología", href: "/talks/cuestionario/otorrinolaringologia" },
      { label: "Hematología", href: "/talks/cuestionario/hematologia" },
    ],
  },
  {
    title: "Trabajar con la información",
    description: "Notebook para practicar el trabajo con información usando LLM.",
    type: "variants",
    icon: NotebookPen,
    variants: [
      { label: "Otorrinolaringología", href: "/content/charlas/trabajar-informacion-otorrinolaringologia.ipynb" },
      { label: "Hematología", href: "/content/charlas/trabajar-informacion-hematologia.ipynb" },
    ],
  },
  {
    title: "Presentar la información trabajada",
    description: "Presentación de diapositivas para abrir o descargar.",
    type: "variants",
    icon: Presentation,
    variants: [
      { label: "Otorrinolaringología", href: "/content/charlas/FINAL-ORL.ppt" },
      { label: "Hematología", href: "/content/charlas/presentar-informacion-hematologia.pdf" },
    ],
  },
  {
    title: "Generador de prompts",
    description: "Herramienta interactiva: rellena los campos con tu caso y genera un prompt profesional listo para pegar en cualquier IA.",
    href: "/talks/generador-prompts",
    type: "single",
    icon: Wand2,
    internal: true,
  },
];

export function ContenidoCharlasCards() {
  return (
    <div className="grid gap-4">
      {contenidoCharlas.map((recurso, index) => (
        <Card
          key={index}
          className="border-white/10 bg-surface-elevated/70 backdrop-blur-sm transition-colors hover:border-ainure-400/30"
        >
          <CardHeader className="flex flex-col items-start gap-4 sm:flex-row">
            <div className="shrink-0 rounded-lg border border-ainure-500/30 bg-ainure-900/25 p-3">
              <recurso.icon className="h-6 w-6 text-ainure-300" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-text-primary">
                {recurso.title}
              </CardTitle>
              <CardDescription className="mt-1 text-text-secondary">
                {recurso.description}
              </CardDescription>
              {recurso.type === "single" ? (
                <Link
                  href={recurso.href}
                  {...(recurso.internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="mt-2 inline-block text-sm text-ainure-300 transition-colors hover:text-ainure-200"
                >
                  {recurso.internal ? "Abrir herramienta →" : "Abrir →"}
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="link"
                      className="mt-2 h-auto p-0 text-sm text-ainure-300 hover:text-ainure-200"
                    >
                      Abrir <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="border-white/10 bg-surface-elevated">
                    {recurso.variants.map((v, i) => (
                      <DropdownMenuItem key={i} asChild>
                        <a
                          href={v.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer text-text-primary focus:bg-white/10 focus:text-text-primary"
                        >
                          {v.label}
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
