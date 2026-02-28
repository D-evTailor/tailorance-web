import { Metadata } from "next";
import { PromptGenerator } from "./prompt-generator";

export const metadata: Metadata = {
  title: "Generador de Prompts — AINURE Talks",
  description:
    "Herramienta interactiva para crear prompts médicos de calidad. Rellena los campos y obtén un prompt listo para usar en ChatGPT, Gemini o Claude.",
};

export default function GeneradorPromptsPage() {
  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-page-header">
          <h1 className="app-page-title">
            <span className="text-ainure-300">Generador de Prompts</span>
          </h1>
          <p className="app-page-subtitle">
            Elige una plantilla, rellena los campos con tu caso y genera un
            prompt profesional listo para pegar en cualquier IA.
          </p>
        </div>
        <PromptGenerator />
      </div>
    </div>
  );
}
