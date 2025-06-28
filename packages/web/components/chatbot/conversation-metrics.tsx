"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from "lucide-react";

interface ConversationMetricsProps {
  messageCount: number;
  projectDefinitionProgress: number;
  systemConfidence: number;
  nextSuggestedTopic: string;
  identifiedRequirements: string[];
  missingInfo: string[];
}

export function ConversationMetrics({
  messageCount,
  projectDefinitionProgress,
  systemConfidence,
  nextSuggestedTopic,
  identifiedRequirements,
  missingInfo
}: ConversationMetricsProps) {
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-400";
    if (confidence >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="space-y-4">
      
      {/* Main Progress Card */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-brand-300" />
              Progreso de Definición
            </h3>
            <span className="text-sm text-gray-400">
              {Math.round(projectDefinitionProgress)}%
            </span>
          </div>
          
          <Progress 
            value={projectDefinitionProgress} 
            className="h-2 mb-3"
          />
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>{messageCount} mensajes</span>
            <span>
              {projectDefinitionProgress < 30 && "Explorando idea"}
              {projectDefinitionProgress >= 30 && projectDefinitionProgress < 70 && "Definiendo requisitos"}
              {projectDefinitionProgress >= 70 && "Preparando propuesta"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* System Confidence */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-brand-300" />
              <span className="font-medium text-white text-sm">Análisis IA</span>
            </div>
            <span className={`text-sm font-semibold ${getConfidenceColor(systemConfidence)}`}>
              {systemConfidence}%
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {systemConfidence >= 80 ? (
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            )}
            <span className="text-xs text-gray-400">
              {systemConfidence >= 80 && "Proyecto bien definido"}
              {systemConfidence >= 60 && systemConfidence < 80 && "Recopilando información"}
              {systemConfidence < 60 && "Explorando requisitos"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Next Suggested Topic */}
      {nextSuggestedTopic && (
        <Card className="bg-brand-400/10 border-brand-400/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-brand-300 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-brand-300 mb-1">
                  Siguiente tema sugerido:
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {nextSuggestedTopic}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requirements Status */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <h4 className="font-medium text-white text-sm mb-3">Estado de Requisitos</h4>
          
          {/* Identified Requirements */}
          {identifiedRequirements.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-400" />
                Identificados ({identifiedRequirements.length})
              </p>
              <div className="space-y-1">
                {identifiedRequirements.slice(0, 3).map((req, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="text-xs bg-green-500/20 text-green-300 border-green-500/30"
                  >
                    {req}
                  </Badge>
                ))}
                {identifiedRequirements.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{identifiedRequirements.length - 3} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Missing Information */}
          {missingInfo.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-yellow-400" />
                Pendientes ({missingInfo.length})
              </p>
              <div className="space-y-1">
                {missingInfo.slice(0, 2).map((info, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="text-xs bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                  >
                    {info}
                  </Badge>
                ))}
                {missingInfo.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{missingInfo.length - 2} más
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 