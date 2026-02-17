"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, Zap, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const buttonConfigs = [
  {
    label: "Preciso",
    code: `<button className="btn-precise">\n  Preciso\n</button>`,
    style: "border border-white/20 bg-transparent px-8 py-3 text-white font-mono text-sm tracking-wider hover:bg-white/5 transition-all duration-300"
  },
  {
    label: "Creativo", 
    code: `<button className="btn-creative">\n  Creativo\n</button>`,
    style: "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 px-10 py-4 text-white font-bold text-lg rounded-full shadow-2xl hover:scale-110 transform transition-all duration-500 animate-pulse"
  },
  {
    label: "Detallista",
    code: `<button className="btn-detailed">\n  Detallista\n</button>`,
    style: "relative bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-8 py-4 text-white font-semibold rounded-lg shadow-xl border-2 border-brand-400/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:rounded-lg hover:shadow-2xl transition-all duration-300"
  },
  {
    label: "Home-made",
    code: `<button className="btn-homemade">\n  Home-made\n</button>`,
    style: "bg-amber-600 hover:bg-amber-700 px-6 py-3 text-amber-50 font-serif text-base rounded-md shadow-lg border-2 border-amber-800/50 transform hover:rotate-1 transition-all duration-300"
  }
];

export default function HomePage() {
  const [currentButtonIndex, setCurrentButtonIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [codeProgress, setCodeProgress] = useState(0);

  useEffect(() => {
    const currentConfig = buttonConfigs[currentButtonIndex];
    let i = 0;
    setTypedText("");
    setIsTyping(true);
    setCodeProgress(0);

    const typeInterval = setInterval(() => {
      if (i < currentConfig.code.length) {
        setTypedText(currentConfig.code.slice(0, i + 1));
        setCodeProgress((i + 1) / currentConfig.code.length);
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        // Wait 1 second after code is complete, then move to next button
        setTimeout(() => {
          setCurrentButtonIndex((prev) => (prev + 1) % buttonConfigs.length);
        }, 1000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentButtonIndex]);

  const currentConfig = buttonConfigs[currentButtonIndex];

  // Function to get progressive button style based on code progress
  const getProgressiveButtonStyle = () => {
    const progress = codeProgress;
    const baseStyle = "transition-all duration-300 transform";
    
    if (progress < 0.2) {
      return `${baseStyle} opacity-30 scale-75 bg-gray-600 px-4 py-2 text-gray-300 text-sm`;
    } else if (progress < 0.4) {
      return `${baseStyle} opacity-50 scale-85 bg-gray-500 px-6 py-2 text-gray-200 text-sm`;
    } else if (progress < 0.6) {
      return `${baseStyle} opacity-70 scale-90 bg-gray-400 px-6 py-3 text-gray-100`;
    } else if (progress < 0.8) {
      return `${baseStyle} opacity-85 scale-95 ${currentConfig.style.split(' ').slice(0, 3).join(' ')} px-7 py-3`;
    } else if (progress < 1.0) {
      return `${baseStyle} opacity-95 scale-98 ${currentConfig.style}`;
    } else {
      return `${baseStyle} ${currentConfig.style}`;
    }
  };

  return (
    <div className="flex flex-col">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        .text-mineral-gradient {
          background-image: linear-gradient(145deg, #7DDBE5 0%, #37E8FF 30%, #18B3C4 60%, #16806F 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
        }
      `}</style>
      
      <section className="relative isolate min-h-screen flex items-center bg-[#0d1117] px-8 py-16">
        <Image
          src="/background.png"
          alt="Dev Tailor hero image"
          layout="fill"
          objectFit="contain"
          className="absolute inset-0 h-full w-full -z-10"
          priority
        />

        {/* VSCode-like Editor Window - moved to the right */}
        <div className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-full max-w-[31.5rem] h-[33vh] rounded-2xl shadow-2xl border border-white/10 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center h-10 px-4 bg-gradient-to-r from-brand-800/80 to-brand-700/80 border-b border-white/10">
            {/* Window controls */}
            <div className="flex items-center gap-2 mr-4">
              <span className="w-3 h-3 rounded-full bg-red-400/80 border border-red-900/40"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400/80 border border-yellow-900/40"></span>
              <span className="w-3 h-3 rounded-full bg-green-400/80 border border-green-900/40"></span>
            </div>
            <span className="text-xs text-white/70 font-mono select-none">Button.jsx</span>
          </div>

          {/* Editor body with guide lines */}
          <div className="relative px-6 py-8 h-full bg-gradient-to-br from-brand-900/80 to-brand-800/80 flex flex-col">
            {/* Guide lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="h-full w-px bg-white/5 absolute left-1/4 top-0"></div>
              <div className="h-full w-px bg-white/5 absolute left-1/2 top-0"></div>
              <div className="h-full w-px bg-white/5 absolute left-3/4 top-0"></div>
              <div className="w-full h-px bg-white/5 absolute top-1/4 left-0"></div>
              <div className="w-full h-px bg-white/5 absolute top-1/2 left-0"></div>
              <div className="w-full h-px bg-white/5 absolute top-3/4 left-0"></div>
            </div>
            
            {/* Code area */}
            <div className="flex-1 flex flex-col justify-between">
              <pre className="relative z-10 whitespace-pre-wrap text-green-400 font-mono text-sm md:text-base select-none">
                {typedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </pre>

              {/* Progressive button preview */}
              <div className="relative z-20 flex justify-center pb-4">
                <button className={getProgressiveButtonStyle()}>
                  {currentConfig.label}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0d1117]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <Code className="h-10 w-10 text-brand-300 mb-4" />
                <CardTitle className="text-white">Desarrollo Personalizado</CardTitle>
                <CardDescription className="text-gray-300">
                  Cada línea de código está pensada específicamente para tu negocio
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <Zap className="h-10 w-10 text-brand-300 mb-4" />
                <CardTitle className="text-white">Entrega Rápida</CardTitle>
                <CardDescription className="text-gray-300">
                  Metodologías ágiles que garantizan resultados en tiempo récord
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <Shield className="h-10 w-10 text-brand-300 mb-4" />
                <CardTitle className="text-white">Máxima Seguridad</CardTitle>
                <CardDescription className="text-gray-300">
                  Implementamos las mejores prácticas de seguridad desde el primer día
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative bg-[#0d1117] py-16 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Hablemos sobre tu proyecto y cómo podemos ayudarte a alcanzar tus objetivos
            </p>
            <div className="mt-8">
              <Link
                href="/contacto"
                className="rounded-xl bg-brand-400 px-8 py-3 font-medium text-white hover:bg-brand-500 transition"
              >
                Contactar ahora →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
