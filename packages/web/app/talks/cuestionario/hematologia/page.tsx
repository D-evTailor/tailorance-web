import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CuestionarioHematologiaPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Cuestionario: Hematologia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              Este cuestionario estara disponible en breve. Si quieres, lo puedo
              montar ahora con el mismo formato de Otorrinolaringologia.
            </p>
            <Link href="/talks" className="text-brand-300 hover:text-brand-200">
              Volver a TALKS
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
