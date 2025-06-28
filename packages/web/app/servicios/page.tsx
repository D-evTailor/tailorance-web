import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Smartphone, Database, Cloud, Cog, Users } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Globe,
    title: "Desarrollo Web",
    description: "Aplicaciones web modernas y responsivas",
    features: ["React/Next.js", "APIs REST", "PWAs"],
  },
  {
    icon: Smartphone,
    title: "Apps Móviles",
    description: "Aplicaciones nativas e híbridas",
    features: ["React Native", "Flutter", "Desarrollo nativo"],
  },
  {
    icon: Database,
    title: "Sistemas de Gestión",
    description: "ERP, CRM y soluciones personalizadas",
    features: ["Gestión de inventario", "CRM", "Automatización"],
  },
  {
    icon: Cloud,
    title: "Soluciones Cloud",
    description: "Migración y desarrollo en la nube",
    features: ["AWS", "Azure", "Microservicios"],
  },
  {
    icon: Cog,
    title: "Integración de Sistemas",
    description: "Conectamos tus herramientas existentes",
    features: ["APIs", "Webhooks", "Middleware"],
  },
  {
    icon: Users,
    title: "Consultoría Técnica",
    description: "Asesoramiento estratégico en tecnología",
    features: ["Arquitectura", "Code review", "Optimización"],
  },
];

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-6">
            Nuestros <span className="text-brand-300">Servicios</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Soluciones tecnológicas completas para impulsar tu negocio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full">
              <CardHeader>
                <service.icon className="h-10 w-10 text-brand-300 mb-4" />
                <CardTitle className="text-white">{service.title}</CardTitle>
                <CardDescription className="text-gray-300">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-center">
                      <span className="w-2 h-2 bg-brand-300 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿Proyecto específico en mente?
          </h2>
          <p className="text-gray-300 mb-8">
            Cada solución es única. Hablemos sobre tus necesidades
          </p>
          <Link
            href="/contacto"
            className="rounded-xl bg-brand-400 px-8 py-3 font-medium text-white hover:bg-brand-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Consulta personalizada →
          </Link>
        </div>
      </div>
    </div>
  );
}
