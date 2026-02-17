"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import chipImage from "@/assets/chip.png";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Servicios", href: "/servicios" },
  { name: "Metodología", href: "/metodologia" },
  { name: "Valores", href: "/valores" },
  { name: "TALKS", href: "/talks", icon: chipImage },
  { name: "Contacto", href: "/contacto" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 64);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0d1117]/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="/dev_tailor_logo.png"
                alt="DevTailor Logo"
                width={150}
                height={40}
                priority
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:space-x-8 md:items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-base font-medium transition-all duration-200 relative inline-flex items-center gap-2",
                  pathname === item.href
                    ? "text-brand-300 after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-brand-300 after:rounded-full"
                    : scrolled 
                      ? "text-white hover:text-brand-300" 
                      : "text-white hover:text-brand-300",
                )}
              >
                {"icon" in item && item.icon && (
                  <Image
                    src={item.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="object-contain shrink-0"
                  />
                )}
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              asChild
              className="bg-[rgb(24,59,63)] hover:bg-[rgb(18,45,48)] text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-[rgb(24,59,63)] hover:border-[rgb(18,45,48)]"
            >
              <Link href="/chatbot">Comenzar proyecto</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0d1117]/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-base font-medium transition-colors hover:text-brand-300 hover:bg-white/5 rounded-md",
                    pathname === item.href
                      ? "text-brand-300 bg-white/10"
                      : "text-white",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {"icon" in item && item.icon && (
                    <Image
                      src={item.icon}
                      alt=""
                      width={22}
                      height={22}
                      className="object-contain shrink-0"
                    />
                  )}
                  {item.name}
                </Link>
              ))}
              <div className="px-3 pt-2">
                <Button
                  asChild
                  className="w-full bg-[rgb(24,59,63)] hover:bg-[rgb(18,45,48)] text-white"
                >
                  <Link href="/chatbot">Comenzar proyecto</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
