# 🏗️ Estructura del Proyecto DevTailor

Este documento detalla la estructura de carpetas y las convenciones de nomenclatura utilizadas en el proyecto DevTailor.

## 📂 Carpetas Principales

- **/app**: Contiene todas las rutas, páginas y layouts de la aplicación, siguiendo el App Router de Next.js.
  - **/app/api**: Para los endpoints de la API.
  - **/app/(rutas)**: Cada carpeta es una ruta pública de la web.
- **/components**: Componentes de React reutilizables.
  - **/components/ui**: Componentes de UI genéricos (botones, inputs, etc.), gestionados por `shadcn/ui`.
  - **/components/layout**: Componentes de la estructura principal (Header, Footer, Sidebar, etc.).
  - **/components/sections**: Componentes más grandes que componen una sección de una página (ej. Hero, Features, Testimonials).
- **/lib**: Funciones de utilidad, helpers y lógica de negocio.
  - **/lib/utils.ts**: Funciones genéricas.
  - **/lib/validations.ts**: Esquemas de validación (ej. con Zod).
- **/styles**: Archivos de estilos globales.
- **/public**: Archivos estáticos accesibles públicamente (imágenes, fuentes, etc.).
- **/docs**: Documentación del proyecto.
- **/hooks**: Hooks de React personalizados.

## 📝 Convenciones

- **Nomenclatura de Componentes**: PascalCase (ej. `BotonPrimario.tsx`).
- **Nomenclatura de Archivos**: kebab-case (ej. `user-profile.tsx`), excepto los componentes.
- **Estilos**: Se utiliza Tailwind CSS para la mayoría de los estilos. Los estilos globales se encuentran en `styles/globals.css`.
