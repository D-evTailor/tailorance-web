import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CuestionarioHematologiaPage() {
  return (
    <div className="app-page">
      <div className="app-container">
        <div className="mx-auto max-w-3xl">
          <Card className="border-white/10 bg-surface-elevated/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-text-primary">
                Cuestionario: Hematologia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-text-secondary">
                Este cuestionario estara disponible en breve. Si quieres, lo puedo
                montar ahora con el mismo formato de Otorrinolaringologia.
              </p>
              <Link href="/talks" className="text-ainure-300 hover:text-ainure-200">
                Volver a AINURE
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
