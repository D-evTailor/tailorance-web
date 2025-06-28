"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Users, 
  Zap, 
  Download,
  Send
} from "lucide-react";

interface ProjectSummaryProps {
  projectData: {
    title: string;
    description: string;
    type: string;
    features: string[];
    timeline: string;
    budget: string;
    complexity: 'simple' | 'medium' | 'complex';
    technologies: string[];
  };
  onDownloadPDF?: () => void;
  onScheduleMeeting?: () => void;
}

export function ProjectSummary({ 
  projectData, 
  onDownloadPDF, 
  onScheduleMeeting 
}: ProjectSummaryProps) {
  const complexityColors = {
    simple: 'bg-green-500/20 text-green-300 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    complex: 'bg-red-500/20 text-red-300 border-red-500/30'
  };

  const complexityLabels = {
    simple: 'Básico',
    medium: 'Intermedio',
    complex: 'Avanzado'
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-brand-300/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-brand-300" />
            Resumen del Proyecto
          </CardTitle>
          <Badge 
            className={`${complexityColors[projectData.complexity]} border`}
          >
            {complexityLabels[projectData.complexity]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Project Overview */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {projectData.title}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {projectData.description}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-brand-300" />
              <span className="text-sm font-medium text-gray-300">Duración</span>
            </div>
            <p className="text-white font-semibold">{projectData.timeline}</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-brand-300" />
              <span className="text-sm font-medium text-gray-300">Presupuesto</span>
            </div>
            <p className="text-white font-semibold">{projectData.budget}</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-brand-300" />
              <span className="text-sm font-medium text-gray-300">Tipo</span>
            </div>
            <p className="text-white font-semibold">{projectData.type}</p>
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-300" />
            Funcionalidades Principales
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {projectData.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-gray-300"
              >
                <CheckCircle2 className="h-4 w-4 text-brand-300 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">
            Tecnologías Sugeridas
          </h4>
          <div className="flex flex-wrap gap-2">
            {projectData.technologies.map((tech, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-brand-400/20 text-brand-300 border-brand-400/30"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button
            onClick={onDownloadPDF}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
          
          <Button
            onClick={onScheduleMeeting}
            className="flex-1 bg-[rgb(24,59,63)] hover:bg-[rgb(18,45,48)] text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Agendar Reunión
          </Button>
        </div>

        {/* Next Steps */}
        <div className="bg-brand-400/10 border border-brand-400/20 rounded-lg p-4">
          <h4 className="text-brand-300 font-semibold mb-2">Próximos Pasos</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-300 rounded-full"></div>
              Análisis técnico detallado (1-2 días)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-300 rounded-full"></div>
              Propuesta comercial personalizada (2-3 días)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-300 rounded-full"></div>
              Prototipo funcional (1-2 semanas)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 