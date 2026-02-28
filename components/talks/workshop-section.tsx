import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Settings2,
  Package,
  Mic2,
  Wrench,
} from "lucide-react";

const outcomeItems = [
  {
    icon: FileText,
    title: "Casos reales del servicio",
    description: "Trabajamos con situaciones y datos de vuestro contexto.",
  },
  {
    icon: Settings2,
    title: "Herramientas configuradas en directo",
    description: "Configuración práctica y reproducible en vuestro flujo.",
  },
  {
    icon: Package,
    title: "Entregables listos para usar",
    description: "Material y guías que podéis aplicar desde el primer día.",
  },
];

const charlaBullets = [
  "Ideas y marco conceptual",
  "Demostraciones y ejemplos",
  "Duración: 60–90 min",
  "Sin implementación en vivo",
];

const tallerBullets = [
  "Trabajo real con vuestros casos",
  "Configuración en vivo",
  "Entregables adaptados al equipo",
  "2–4 h o jornada completa",
];

/**
 * Sección "Talleres" para la página /talks.
 * Presenta el servicio de talleres prácticos como siguiente paso opcional
 * tras las charlas, con tono profesional y sin claims comerciales agresivos.
 */
export function WorkshopSection() {
  return (
    <section className="mx-auto mt-14 max-w-4xl md:mt-20" aria-labelledby="talleres-heading">
      <h2
        id="talleres-heading"
        className="mb-4 font-display text-2xl text-text-primary md:text-3xl"
      >
        <span className="text-ainure-300">Talleres</span>
      </h2>
      <p className="mb-8 text-text-secondary">
        Para equipos que quieren pasar de conceptos a implementación, hacemos
        talleres prácticos adaptados al flujo real del servicio.
      </p>

      {/* Outcome bullets */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {outcomeItems.map((item) => (
          <Card
            key={item.title}
            className="border-white/10 bg-surface-elevated/50 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="shrink-0 rounded-lg border border-ainure-500/30 bg-ainure-900/25 p-3">
                <item.icon className="h-6 w-6 text-ainure-300" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-text-primary">
                  {item.title}
                </CardTitle>
                <p className="mt-1 text-sm text-text-secondary">
                  {item.description}
                </p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Charla vs Taller */}
      <div id="que-incluye" className="mb-10 grid gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-surface-elevated/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-text-primary">
              <Mic2 className="h-5 w-5 text-ainure-300" />
              Charla
            </CardTitle>
            <p className="text-sm text-text-muted">Gratis</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-text-secondary">
              {charlaBullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ainure-500/50" aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-ainure-500/30 border-white/10 bg-surface-elevated/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-text-primary">
              <Wrench className="h-5 w-5 text-ainure-300" />
              Taller
            </CardTitle>
            <p className="text-sm text-text-muted">Práctico</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-text-secondary">
              {tallerBullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ainure-500/50" aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA final */}
      <Card className="border-white/10 bg-surface-elevated/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-text-primary">
            ¿Quieres esto para tu equipo?
          </CardTitle>
          <p className="text-text-secondary">
            Lo adaptamos a vuestro nivel y a vuestro flujo de trabajo.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/contacto?motivo=taller">Solicitar taller</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#recursos">Ver recursos</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
