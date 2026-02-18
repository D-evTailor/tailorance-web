import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site.config";
import logoImage from "@/assets/images/logo2.png";

const links = [
  { label: "Servicios", href: "/servicios" },
  { label: "Metodologia", href: "/metodologia" },
  { label: "Valores", href: "/valores" },
  { label: "Talks", href: "/talks" },
  { label: "Contacto", href: "/contacto" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-surface-elevated/70 bg-noise">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(166,199,156,0.15),transparent_35%),radial-gradient(circle_at_85%_90%,rgba(132,178,123,0.1),transparent_30%)]" />

      <div className="app-container relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-muted">
              Digital Craftsmanship
            </p>
            <div className="mt-4">
              <Image
                src={logoImage}
                alt={`${siteConfig.name} logo`}
                className="h-12 w-auto sm:h-14 md:h-16"
              />
            </div>
            <p className="mt-4 max-w-lg text-sm text-text-secondary sm:text-base">
              Construimos productos digitales con precision, criterio y detalle artesanal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">Mapa</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-ainure-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">Contacto</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-sm text-text-secondary transition-colors hover:text-ainure-300"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li className="text-sm text-text-secondary">Espana / Remote-first</li>
                <li>
                  <a
                    href="tel:695140503"
                    className="text-sm text-text-secondary transition-colors hover:text-ainure-300"
                  >
                    695140503
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-text-secondary transition-colors hover:text-ainure-300"
                  >
                    Github
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.14em]">{siteConfig.domain}</p>
        </div>
      </div>
    </footer>
  );
}
