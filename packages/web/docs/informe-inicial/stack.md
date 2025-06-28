# 🛠️ Stack Tecnológico

Este documento describe las tecnologías, frameworks y librerías que forman la base del proyecto DevTailor.

## Frontend

- **Framework**: [Next.js](https://nextjs.org/) (React)
  - **Motivo**: Permite renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG) para un rendimiento y SEO óptimos. Su sistema de enrutamiento basado en archivos (`App Router`) simplifica la organización del código.

- **UI Framework**: [Tailwind CSS](https://tailwindcss.com/)
  - **Motivo**: Ofrece una gran flexibilidad para construir diseños personalizados rápidamente sin escribir CSS tradicional. Es altamente mantenible y escalable.

- **Componentes**: [shadcn/ui](https://ui.shadcn.com/)
  - **Motivo**: Proporciona una colección de componentes accesibles y personalizables que se pueden "poseer" directamente en el código base, en lugar de depender de una librería externa.

- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
  - **Motivo**: Una librería potente y declarativa para crear animaciones fluidas en React.

- **Gestión de Formularios**: [React Hook Form](https://react-hook-form.com/)
  - **Motivo**: Optimiza el rendimiento de los formularios y simplifica la gestión del estado y la validación.

- **Iconos**: [Lucide React](https://lucide.dev/)
  - **Motivo**: Librería de iconos ligera, personalizable y consistente.

## Backend y Base de Datos

- **Alojamiento**: [Vercel](https://vercel.com)
  - **Motivo**: Plataforma optimizada para Next.js, con despliegues continuos (CI/CD) automáticos, alta disponibilidad y escalabilidad global.

- **Base de Datos**: (Por definir)
  - **Opciones**: Se evaluará el uso de una base de datos SQL (ej. PostgreSQL con Supabase/Neon) o NoSQL (ej. MongoDB) según los requisitos finales de la aplicación.

- **Envío de Formularios**: (Por definir)
  - **Opciones**: Se podría usar [EmailJS](https://www.emailjs.com/), [Formspree](https://formspree.io/) o un endpoint de API propio.

## Herramientas de Desarrollo

- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Gestor de Paquetes**: [pnpm](https://pnpm.io/)
- **Linting**: [ESLint](https://eslint.org/)
- **Formateo**: [Prettier](https://prettier.io/)
