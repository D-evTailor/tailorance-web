import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mic2, Stethoscope, Workflow, Sparkles } from "lucide-react";
import { ContenidoCharlasCards } from "./contenido-charlas-cards";
import { WorkshopSection } from "@/components/talks/workshop-section";

const talks = [
  {
    title: "IA en el sector salud",
    description:
      "Charlas sobre inteligencia artificial aplicada a la práctica clínica: desde apoyo al diagnóstico hasta mejora de la experiencia del paciente.",
    topics: ["Sector salud", "Casos de uso", "Ética y regulación"],
    icon: Stethoscope,
  },
  {
    title: "Flujos de trabajo con IA",
    description:
      "Implementación de flujos que integran IA en el día a día: automatización, asistencia a la decisión y reducción de carga administrativa.",
    topics: ["Automatización", "Integración", "Herramientas"],
    icon: Workflow,
  },
  {
    title: "Optimización del día a día del médico",
    description:
      "Cómo la IA puede aligerar tareas repetitivas, priorizar la atención y devolver tiempo a lo que importa: el trato con el paciente.",
    topics: ["Productividad", "Priorización", "Bienestar profesional"],
    icon: Sparkles,
  },
];

export default function TalksPage() {
  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-page-header">
          <h1 className="app-page-title">
            <span className="text-ainure-300">TALKS</span>
          </h1>
          <p className="app-page-subtitle">
            Charlas sobre inteligencia artificial que hemos impartido, con foco en
            el sector salud: implementación de flujos de trabajo y optimización
            del día a día del médico.
          </p>
        </div>

        {/* Bloques temáticos */}
        <div className="mx-auto grid max-w-4xl gap-6">
          {talks.map((talk, index) => (
            <Card
              key={index}
              className="border-white/10 bg-surface-elevated/70 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-col items-start gap-4 sm:flex-row">
                <div className="shrink-0 rounded-lg border border-ainure-500/30 bg-ainure-900/25 p-3">
                  <talk.icon className="h-8 w-8 text-ainure-300" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2 text-text-primary">
                    <Mic2 className="h-5 w-5 text-ainure-300" />
                    {talk.title}
                  </CardTitle>
                  <CardDescription className="mt-1 text-text-secondary">
                    {talk.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {talk.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center rounded-md border border-white/10 bg-surface-base/80 px-3 py-1 text-sm text-text-secondary"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <WorkshopSection />

        {/* Recursos de la charla */}
        <section id="recursos" className="mx-auto mt-14 max-w-4xl md:mt-20" aria-labelledby="recursos-heading">
          <h2 id="recursos-heading" className="mb-6 font-display text-2xl text-text-primary md:text-3xl">
            <span className="text-ainure-300">Recursos de la charla</span>
          </h2>
          <p className="mb-8 text-text-secondary">
            Material de apoyo de nuestra formación: guías, notebooks y presentaciones para consultar o descargar.
          </p>
          <ContenidoCharlasCards />
        </section>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-text-muted">
          Si quieres que demos una charla en tu centro, colegio profesional o
          evento, contacta con nosotros desde la sección{" "}
          <Link href="/contacto" className="text-ainure-300 hover:underline">
            Contacto
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
