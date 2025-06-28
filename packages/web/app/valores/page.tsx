import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Lightbulb, Shield, Handshake, Zap, Users } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Pasión Artesanal",
    description: "Cada línea de código es hecha a medida, con dedicación y detalle.",
  },
  {
    icon: Lightbulb,
    title: "Soluciones Únicas",
    description: "Diseñamos software original, evitando atajos y plantillas genéricas.",
  },
  {
    icon: Shield,
    title: "Transparencia Sincera",
    description: "Comunicación clara y honesta en cada etapa del proceso.",
  },
  {
    icon: Handshake,
    title: "Compromiso a Medida",
    description: "Tu éxito es nuestro ajuste perfecto; trabajamos como un solo equipo.",
  },
  {
    icon: Zap,
    title: "Excelencia Técnica",
    description: "Arquitecturas sólidas y calidad de sastre en cada entrega.",
  },
  {
    icon: Users,
    title: "Colaboración Creativa",
    description: "El mejor resultado surge del trabajo conjunto y la escucha activa.",
  },
];

export default function ValoresPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-6">
            Nuestros <span className="text-brand-300">Valores</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Principios que nos definen como sastres tecnológicos y guían cada proyecto a medida
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full">
              <CardHeader>
                <value.icon className="h-12 w-12 text-brand-300 mb-4" />
                <CardTitle className="text-white text-xl">{value.title}</CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  {value.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-brand-900/50 to-brand-800/50 border-brand-600/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-brand-300">Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                Empoderar empresas con soluciones tecnológicas hechas a medida, robustas y pensadas para transformar su negocio. Somos sastres digitales: cada proyecto es único.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-brand-800/50 to-brand-700/50 border-brand-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-brand-300">Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                Ser reconocidos como el taller de software de referencia para empresas que buscan calidad, confianza y resultados sobresalientes. Innovamos con precisión y pasión artesanal.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
