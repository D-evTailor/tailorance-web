"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/lib/site.config";

interface ContactForm {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

const contactInfo = [
  { icon: Mail, title: "Email", value: siteConfig.email },
  { icon: Phone, title: "Teléfono", value: "+34 695140503" },
  { icon: MapPin, title: "Ubicación", value: "España (Remoto)" },
  { icon: Clock, title: "Horario", value: "Lun - Vie: 9:00 - 18:00" },
];

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(
        `/api/mail/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error en el envío");

      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      setSubmitStatus("success");

      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-page-header">
          <h1 className="app-page-title">
            <span className="text-ainure-300">Contacto</span>
          </h1>
          <p className="app-page-subtitle">
            ¿Tienes un proyecto en mente? Hablemos sobre cómo convertir tu idea en realidad
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {/* Información de contacto */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-white/10 bg-surface-elevated/70 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <info.icon className="mb-2 h-6 w-6 text-ainure-300" />
                    <CardTitle className="text-sm text-text-primary">{info.title}</CardTitle>
                    <CardDescription className="text-text-secondary">{info.value}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="h-full lg:col-span-2">
            <Card className="flex h-full flex-col border-white/10 bg-surface-elevated/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-text-primary">Cuéntanos sobre tu proyecto</CardTitle>
                <CardDescription className="text-text-secondary">
                  Nos pondremos en contacto contigo en menos de 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="text-text-secondary">Nombre *</Label>
                      <Input
                        id="name"
                        {...register("name", { required: "El nombre es obligatorio" })}
                        className="border-white/15 bg-surface-base/80 text-text-primary"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-text-secondary">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "El email es obligatorio",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email inválido",
                          },
                        })}
                        className="border-white/15 bg-surface-base/80 text-text-primary"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="company" className="text-text-secondary">Empresa</Label>
                      <Input 
                        id="company" 
                        {...register("company")} 
                        className="border-white/15 bg-surface-base/80 text-text-primary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="service" className="text-text-secondary">Tipo de servicio</Label>
                      <Select onValueChange={(value) => setValue("service", value)}>
                        <SelectTrigger className="border-white/15 bg-surface-base/80 text-text-primary">
                          <SelectValue placeholder="Selecciona un servicio" />
                        </SelectTrigger>
                        <SelectContent className="border-white/15 bg-surface-elevated text-text-primary">
                          <SelectItem value="web">Desarrollo Web</SelectItem>
                          <SelectItem value="mobile">Aplicación Móvil</SelectItem>
                          <SelectItem value="system">Sistema de Gestión</SelectItem>
                          <SelectItem value="cloud">Solución Cloud</SelectItem>
                          <SelectItem value="consulting">Consultoría</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-text-secondary">Mensaje *</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Cuéntanos sobre tu proyecto, objetivos y plazos..."
                      {...register("message", { required: "El mensaje es obligatorio" })}
                      className="border-white/15 bg-surface-base/80 text-text-primary placeholder:text-text-muted"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full border border-ainure-300/50 bg-ainure-500/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-text-primary transition-all hover:bg-ainure-500/30 disabled:opacity-50"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar mensaje →"}
                  </button>
                  {submitStatus === "success" && (
                    <p className="text-center text-sm text-ainure-300">
                      Mensaje enviado correctamente.
                    </p>
                  )}
                  {submitStatus === "error" && (
                    <p className="text-center text-sm text-red-400">
                      No se pudo enviar el mensaje. Revisa los datos e inténtalo de nuevo.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


