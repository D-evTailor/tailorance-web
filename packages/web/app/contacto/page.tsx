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

interface ContactForm {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

const contactInfo = [
  { icon: Mail, title: "Email", value: "info@devtailor.com" },
  { icon: Phone, title: "Teléfono", value: "+34 XXX XXX XXX" },
  { icon: MapPin, title: "Ubicación", value: "España (Remoto)" },
  { icon: Clock, title: "Horario", value: "Lun - Vie: 9:00 - 18:00" },
];

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/email`,
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

      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-6">
            <span className="text-brand-300">Contacto</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            ¿Tienes un proyecto en mente? Hablemos sobre cómo convertir tu idea en realidad
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de contacto */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <info.icon className="h-6 w-6 text-brand-300 mb-2" />
                    <CardTitle className="text-white text-sm">{info.title}</CardTitle>
                    <CardDescription className="text-gray-300">{info.value}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Cuéntanos sobre tu proyecto</CardTitle>
                <CardDescription className="text-gray-300">
                  Nos pondremos en contacto contigo en menos de 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Nombre *</Label>
                      <Input
                        id="name"
                        {...register("name", { required: "El nombre es obligatorio" })}
                        className="bg-gray-900/50 border-gray-600 text-white"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email *</Label>
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
                        className="bg-gray-900/50 border-gray-600 text-white"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company" className="text-gray-300">Empresa</Label>
                      <Input 
                        id="company" 
                        {...register("company")} 
                        className="bg-gray-900/50 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="service" className="text-gray-300">Tipo de servicio</Label>
                      <Select onValueChange={(value) => setValue("service", value)}>
                        <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
                          <SelectValue placeholder="Selecciona un servicio" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
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
                    <Label htmlFor="message" className="text-gray-300">Mensaje *</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Cuéntanos sobre tu proyecto, objetivos y plazos..."
                      {...register("message", { required: "El mensaje es obligatorio" })}
                      className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-brand-400 px-6 py-3 font-medium text-white hover:bg-brand-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar mensaje →"}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

