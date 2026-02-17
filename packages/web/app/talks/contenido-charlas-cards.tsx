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
import { FileText, NotebookPen, Presentation, ClipboardList, ChevronDown, LucideIcon } from "lucide-react";

type RecursoSingle = {
  title: string;
  description: string;
  href: string;
  type: "single";
  icon: LucideIcon;
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
    title: "Guía para que la IA te responda lo que necesitas",
    description: "PDF con pautas para formular preguntas y obtener mejores respuestas de la IA.",
    href: "/content/charlas/guia-ia-responda.pdf",
    type: "single",
    icon: FileText,
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
      { label: "Otorrinolaringología", href: "/content/charlas/presentar-informacion-otorrinolaringologia.pdf" },
      { label: "Hematología", href: "/content/charlas/presentar-informacion-hematologia.pdf" },
    ],
  },
];

export function ContenidoCharlasCards() {
  return (
    <div className="grid gap-4">
      {contenidoCharlas.map((recurso, index) => (
        <Card
          key={index}
          className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors"
        >
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="rounded-lg bg-brand-900/50 p-3 shrink-0">
              <recurso.icon className="h-6 w-6 text-brand-300" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-white">
                {recurso.title}
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">
                {recurso.description}
              </CardDescription>
              {recurso.type === "single" ? (
                <Link
                  href={recurso.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-brand-300 hover:text-brand-200 transition-colors"
                >
                  Abrir →
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="link"
                      className="mt-2 h-auto p-0 text-sm text-brand-300 hover:text-brand-200"
                    >
                      Abrir <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-gray-800 border-gray-700">
                    {recurso.variants.map((v, i) => (
                      <DropdownMenuItem key={i} asChild>
                        <a
                          href={v.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer text-white focus:bg-gray-700 focus:text-white"
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
